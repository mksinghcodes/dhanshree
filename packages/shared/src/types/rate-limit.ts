export enum RateLimitTier {
  AUTH = 'AUTH',
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
}

export interface RateLimitTierConfig {
  max: number;
  windowMs: number;
}

export interface AuthRateLimitConfig {
  ipMax: number;
  ipWindowMs: number;
  accountMax: number;
  accountWindowMs: number;
  baseBackoffSec: number;
  maxBackoffSec: number;
}

export interface RateLimitConfig {
  enabled: boolean;
  auth: AuthRateLimitConfig;
  public: RateLimitTierConfig;
  authenticated: RateLimitTierConfig;
}

export interface RateLimitResult {
  allowed: boolean;
  tier: RateLimitTier;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSec?: number;
  reason?: 'IP_LIMIT_EXCEEDED' | 'ACCOUNT_BACKOFF_ACTIVE' | 'TIER_LIMIT_EXCEEDED';
  accountIdentifier?: string;
}

export interface AccountFailureRecord {
  failedAttempts: number;
  lastFailedAt: number;
  blockedUntil: number;
  backoffSec: number;
}

/**
 * Calculates exponential backoff in seconds for failed attempts.
 *
 * If failedAttempts < threshold, returns 0 (allowed without delay).
 * If failedAttempts >= threshold, backoff = min(maxDelaySec, baseDelaySec * 2^(failedAttempts - threshold)).
 *
 * Example (threshold = 5, base = 5s, max = 1800s):
 * - attempts 1..4 => 0s
 * - attempt 5 failure => 5s * 2^0 = 5s
 * - attempt 6 failure => 5s * 2^1 = 10s
 * - attempt 7 failure => 5s * 2^2 = 20s
 * - attempt 8 failure => 5s * 2^3 = 40s
 * - attempt 9 failure => 5s * 2^4 = 80s
 * ... capped at maxDelaySec (1800s = 30m).
 */
export function calculateExponentialBackoff(
  failedAttempts: number,
  threshold: number,
  baseDelaySec: number,
  maxDelaySec: number,
): number {
  if (failedAttempts < threshold) {
    return 0;
  }
  const exponent = failedAttempts - threshold;
  const safeExponent = Math.min(exponent, 20); // Guard against numeric overflow
  const delay = Math.round(baseDelaySec * Math.pow(2, safeExponent));
  return Math.min(delay, maxDelaySec);
}
