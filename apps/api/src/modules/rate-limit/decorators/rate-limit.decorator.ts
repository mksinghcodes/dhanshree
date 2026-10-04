import { SetMetadata, applyDecorators } from '@nestjs/common';
import { RateLimitTier } from '@dhanshree/shared';

export const RATE_LIMIT_TIER_KEY = 'rate_limit_tier';
export const RATE_LIMIT_OVERRIDE_KEY = 'rate_limit_override';
export const SKIP_RATE_LIMIT_KEY = 'skip_rate_limit';
export const ACCOUNT_IDENTIFIER_KEY = 'account_identifier_key';

export interface RateLimitOverrideOptions {
  max?: number;
  windowMs?: number;
}

/**
 * Configure rate limit tier and optional threshold override for a route or controller
 */
export function RateLimit(
  tier: RateLimitTier,
  override?: RateLimitOverrideOptions,
) {
  return applyDecorators(
    SetMetadata(RATE_LIMIT_TIER_KEY, tier),
    SetMetadata(RATE_LIMIT_OVERRIDE_KEY, override),
  );
}

/**
 * Convenience decorator for Authentication routes (strictest limits, exponential backoff)
 */
export function AuthRateLimit(override?: RateLimitOverrideOptions) {
  return RateLimit(RateLimitTier.AUTH, override);
}

/**
 * Convenience decorator for Public routes (moderate limits per IP)
 */
export function PublicRateLimit(override?: RateLimitOverrideOptions) {
  return RateLimit(RateLimitTier.PUBLIC, override);
}

/**
 * Convenience decorator for Authenticated user actions (looser limits per user)
 */
export function AuthenticatedRateLimit(override?: RateLimitOverrideOptions) {
  return RateLimit(RateLimitTier.AUTHENTICATED, override);
}

/**
 * Skip rate limiting for specific internal health checks or webhooks
 */
export function SkipRateLimit() {
  return SetMetadata(SKIP_RATE_LIMIT_KEY, true);
}

/**
 * Explicitly specify custom field in request body/query for the account identifier
 */
export function AccountIdentifierKey(fieldOrFn: string | ((req: any) => string)) {
  return SetMetadata(ACCOUNT_IDENTIFIER_KEY, fieldOrFn);
}
