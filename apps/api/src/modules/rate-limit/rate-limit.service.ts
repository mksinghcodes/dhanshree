import { Injectable, Logger } from '@nestjs/common';
import {
  AccountFailureRecord,
  RateLimitConfig,
  RateLimitResult,
  RateLimitTier,
} from '@dhanshree/shared';
import { RateLimitConfigService } from './rate-limit.config';
import { RateLimitStorage } from './rate-limit.storage';

export interface RateLimitCheckParams {
  tier: RateLimitTier;
  ip: string;
  accountIdentifier?: string;
  userId?: string;
  override?: {
    max?: number;
    windowMs?: number;
  };
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  constructor(
    private readonly configService: RateLimitConfigService,
    private readonly storage: RateLimitStorage,
  ) {}

  getConfig(): RateLimitConfig {
    return this.configService.getConfig();
  }

  /**
   * Main rate limit checking method.
   * Evaluates endpoint tier (AUTH, PUBLIC, AUTHENTICATED),
   * applying per-account backoff and per-IP limits for AUTH,
   * moderate IP limits for PUBLIC, and looser user limits for AUTHENTICATED.
   */
  checkRateLimit(params: RateLimitCheckParams): RateLimitResult {
    const config = this.getConfig();

    // If rate limiting is globally disabled
    if (!config.enabled) {
      return {
        allowed: true,
        tier: params.tier,
        limit: Infinity,
        remaining: Infinity,
        resetMs: 0,
      };
    }

    switch (params.tier) {
      case RateLimitTier.AUTH:
        return this.checkAuthTier(params, config);

      case RateLimitTier.AUTHENTICATED:
        return this.checkAuthenticatedTier(params, config);

      case RateLimitTier.PUBLIC:
      default:
        return this.checkPublicTier(params, config);
    }
  }

  private checkAuthTier(
    params: RateLimitCheckParams,
    config: RateLimitConfig,
  ): RateLimitResult {
    const { ip, accountIdentifier } = params;

    // 1. Check per-account exponential backoff
    if (accountIdentifier) {
      const backoffStatus = this.storage.getAccountBackoffStatus(
        accountIdentifier,
        config.auth.accountWindowMs,
      );

      if (backoffStatus.isBlocked) {
        this.logger.warn(
          `Auth rate limit blocked for account '${accountIdentifier}'. Retry after ${backoffStatus.retryAfterSec}s (Exponential Backoff)`,
        );
        return {
          allowed: false,
          tier: RateLimitTier.AUTH,
          limit: config.auth.accountMax,
          remaining: 0,
          resetMs: backoffStatus.retryAfterSec * 1000,
          retryAfterSec: backoffStatus.retryAfterSec,
          reason: 'ACCOUNT_BACKOFF_ACTIVE',
          accountIdentifier,
        };
      }
    }

    // 2. Check per-IP auth rate limit
    const ipMax = params.override?.max ?? config.auth.ipMax;
    const ipWindowMs = params.override?.windowMs ?? config.auth.ipWindowMs;
    const ipKey = `auth:ip:${ip}`;

    const ipHit = this.storage.checkAndRecordHit(ipKey, ipMax, ipWindowMs);

    if (!ipHit.allowed) {
      const retryAfterSec = Math.ceil(ipHit.resetMs / 1000) || 1;
      this.logger.warn(
        `Auth IP rate limit exceeded for IP '${ip}'. Retry after ${retryAfterSec}s`,
      );
      return {
        allowed: false,
        tier: RateLimitTier.AUTH,
        limit: ipMax,
        remaining: 0,
        resetMs: ipHit.resetMs,
        retryAfterSec,
        reason: 'IP_LIMIT_EXCEEDED',
        accountIdentifier,
      };
    }

    return {
      allowed: true,
      tier: RateLimitTier.AUTH,
      limit: ipMax,
      remaining: ipHit.remaining,
      resetMs: ipHit.resetMs,
      accountIdentifier,
    };
  }

  private checkPublicTier(
    params: RateLimitCheckParams,
    config: RateLimitConfig,
  ): RateLimitResult {
    const max = params.override?.max ?? config.public.max;
    const windowMs = params.override?.windowMs ?? config.public.windowMs;
    const key = `public:ip:${params.ip}`;

    const hit = this.storage.checkAndRecordHit(key, max, windowMs);

    if (!hit.allowed) {
      const retryAfterSec = Math.ceil(hit.resetMs / 1000) || 1;
      return {
        allowed: false,
        tier: RateLimitTier.PUBLIC,
        limit: max,
        remaining: 0,
        resetMs: hit.resetMs,
        retryAfterSec,
        reason: 'TIER_LIMIT_EXCEEDED',
      };
    }

    return {
      allowed: true,
      tier: RateLimitTier.PUBLIC,
      limit: max,
      remaining: hit.remaining,
      resetMs: hit.resetMs,
    };
  }

  private checkAuthenticatedTier(
    params: RateLimitCheckParams,
    config: RateLimitConfig,
  ): RateLimitResult {
    const max = params.override?.max ?? config.authenticated.max;
    const windowMs = params.override?.windowMs ?? config.authenticated.windowMs;
    // Prefer user ID, fallback to IP if user is not resolved
    const key = params.userId
      ? `auth_user:${params.userId}`
      : `auth_user_ip:${params.ip}`;

    const hit = this.storage.checkAndRecordHit(key, max, windowMs);

    if (!hit.allowed) {
      const retryAfterSec = Math.ceil(hit.resetMs / 1000) || 1;
      return {
        allowed: false,
        tier: RateLimitTier.AUTHENTICATED,
        limit: max,
        remaining: 0,
        resetMs: hit.resetMs,
        retryAfterSec,
        reason: 'TIER_LIMIT_EXCEEDED',
      };
    }

    return {
      allowed: true,
      tier: RateLimitTier.AUTHENTICATED,
      limit: max,
      remaining: hit.remaining,
      resetMs: hit.resetMs,
    };
  }

  /**
   * Called on failed authentication attempt (wrong password, invalid OTP, etc.)
   */
  recordAuthFailure(accountIdentifier?: string): AccountFailureRecord | null {
    if (!accountIdentifier) return null;

    const config = this.getConfig();
    const record = this.storage.recordAuthFailure(
      accountIdentifier,
      config.auth.accountMax,
      config.auth.baseBackoffSec,
      config.auth.maxBackoffSec,
      config.auth.accountWindowMs,
    );

    if (record.backoffSec > 0) {
      this.logger.warn(
        `Account '${accountIdentifier}' triggered exponential backoff: ${record.backoffSec}s delay after ${record.failedAttempts} failures.`,
      );
    }

    return record;
  }

  /**
   * Called on successful authentication to clear failure counters and active backoff
   */
  recordAuthSuccess(accountIdentifier?: string): void {
    if (!accountIdentifier) return;
    this.storage.recordAuthSuccess(accountIdentifier);
    this.logger.log(`Account '${accountIdentifier}' auth success: failure counters reset.`);
  }

  /**
   * Helper to check an account's current backoff status
   */
  getAccountStatus(accountIdentifier: string) {
    const config = this.getConfig();
    return this.storage.getAccountBackoffStatus(
      accountIdentifier,
      config.auth.accountWindowMs,
    );
  }

  /**
   * Reset all storage data (useful for test runner)
   */
  resetAll(): void {
    this.storage.clear();
  }
}
