import { Injectable } from '@nestjs/common';
import { AccountFailureRecord, calculateExponentialBackoff } from '@dhanshree/shared';

@Injectable()
export class RateLimitStorage {
  // Key -> array of timestamp (ms) for sliding window rate limiting
  private readonly hits = new Map<string, number[]>();

  // Normalized account identifier -> failure tracking & backoff state
  private readonly accounts = new Map<string, AccountFailureRecord>();

  /**
   * Evaluates and records a hit within a sliding window.
   * Returns { allowed, currentHits, remaining, resetMs }
   */
  checkAndRecordHit(
    key: string,
    maxHits: number,
    windowMs: number,
  ): { allowed: boolean; currentHits: number; remaining: number; resetMs: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    const timestamps = this.hits.get(key) || [];
    // Prune expired hits outside window
    const activeTimestamps = timestamps.filter((t) => t > windowStart);

    if (activeTimestamps.length >= maxHits) {
      const oldestHit = activeTimestamps[0];
      const resetMs = oldestHit + windowMs - now;
      this.hits.set(key, activeTimestamps);
      return {
        allowed: false,
        currentHits: activeTimestamps.length,
        remaining: 0,
        resetMs: Math.max(0, resetMs),
      };
    }

    activeTimestamps.push(now);
    this.hits.set(key, activeTimestamps);

    const oldestHit = activeTimestamps[0];
    const resetMs = oldestHit + windowMs - now;

    return {
      allowed: true,
      currentHits: activeTimestamps.length,
      remaining: Math.max(0, maxHits - activeTimestamps.length),
      resetMs: Math.max(0, resetMs),
    };
  }

  /**
   * Checks if an account identifier is currently blocked by an active exponential backoff.
   */
  getAccountBackoffStatus(
    accountIdentifier: string,
    accountWindowMs: number,
  ): { isBlocked: boolean; retryAfterSec: number; record?: AccountFailureRecord } {
    const normalized = accountIdentifier.toLowerCase().trim();
    const record = this.accounts.get(normalized);

    if (!record) {
      return { isBlocked: false, retryAfterSec: 0 };
    }

    const now = Date.now();

    // If failure occurred longer ago than the failure tracking window, reset failure count
    if (now - record.lastFailedAt > accountWindowMs) {
      this.accounts.delete(normalized);
      return { isBlocked: false, retryAfterSec: 0 };
    }

    if (record.blockedUntil > now) {
      const retryAfterSec = Math.ceil((record.blockedUntil - now) / 1000);
      return {
        isBlocked: true,
        retryAfterSec,
        record,
      };
    }

    return {
      isBlocked: false,
      retryAfterSec: 0,
      record,
    };
  }

  /**
   * Records a failed authentication attempt for an account identifier.
   * Applies exponential backoff once failed attempts exceed threshold.
   */
  recordAuthFailure(
    accountIdentifier: string,
    threshold: number,
    baseBackoffSec: number,
    maxBackoffSec: number,
    accountWindowMs: number,
  ): AccountFailureRecord {
    const normalized = accountIdentifier.toLowerCase().trim();
    const now = Date.now();

    const existing = this.accounts.get(normalized);
    let failedAttempts = 1;

    // If existing failure was within window, increment
    if (existing && now - existing.lastFailedAt <= accountWindowMs) {
      failedAttempts = existing.failedAttempts + 1;
    }

    const backoffSec = calculateExponentialBackoff(
      failedAttempts,
      threshold,
      baseBackoffSec,
      maxBackoffSec,
    );

    const blockedUntil = backoffSec > 0 ? now + backoffSec * 1000 : 0;

    const record: AccountFailureRecord = {
      failedAttempts,
      lastFailedAt: now,
      blockedUntil,
      backoffSec,
    };

    this.accounts.set(normalized, record);
    return record;
  }

  /**
   * Resets the failure counter and backoff for an account upon successful authentication.
   */
  recordAuthSuccess(accountIdentifier: string): void {
    const normalized = accountIdentifier.toLowerCase().trim();
    this.accounts.delete(normalized);
  }

  /**
   * Get account record for inspection / test verification
   */
  getAccount(accountIdentifier: string): AccountFailureRecord | undefined {
    return this.accounts.get(accountIdentifier.toLowerCase().trim());
  }

  /**
   * Clear all stored rate limit hits and accounts (for tests)
   */
  clear(): void {
    this.hits.clear();
    this.accounts.clear();
  }
}
