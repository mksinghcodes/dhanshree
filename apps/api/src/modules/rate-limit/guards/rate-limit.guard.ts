import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitTier } from '@dhanshree/shared';
import { RateLimitService } from '../rate-limit.service';
import {
  ACCOUNT_IDENTIFIER_KEY,
  RATE_LIMIT_OVERRIDE_KEY,
  RATE_LIMIT_TIER_KEY,
  RateLimitOverrideOptions,
  SKIP_RATE_LIMIT_KEY,
} from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimitService: RateLimitService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isSkipped = this.reflector.getAllAndOverride<boolean>(
      SKIP_RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isSkipped) {
      return true;
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const res = httpContext.getResponse();

    // Determine Rate Limit Tier
    const tier =
      this.reflector.getAllAndOverride<RateLimitTier>(RATE_LIMIT_TIER_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || (req.user ? RateLimitTier.AUTHENTICATED : RateLimitTier.PUBLIC);

    const override = this.reflector.getAllAndOverride<RateLimitOverrideOptions>(
      RATE_LIMIT_OVERRIDE_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Extract Client IP (support Proxies / Cloudflare / Vercel / Nginx)
    const ip = this.extractClientIp(req);

    // Extract Authenticated User ID (if any)
    const userId = req.user?.id || req.user?.sub || undefined;

    // Extract Account Identifier for AUTH tier (email or phone)
    let accountIdentifier: string | undefined;
    if (tier === RateLimitTier.AUTH) {
      accountIdentifier = this.extractAccountIdentifier(context, req);
      // Stash on request for the companion RateLimitAuthInterceptor
      req._rateLimitAccount = accountIdentifier;
      req._rateLimitIp = ip;
    }

    const result = this.rateLimitService.checkRateLimit({
      tier,
      ip,
      accountIdentifier,
      userId,
      override,
    });

    // Set standard RateLimit headers on the HTTP response if response object supports setHeader
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('X-RateLimit-Limit', result.limit.toString());
      res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
      res.setHeader(
        'X-RateLimit-Reset',
        Math.ceil(result.resetMs / 1000).toString(),
      );
      res.setHeader('X-RateLimit-Tier', result.tier);
    }

    if (!result.allowed) {
      const retryAfterSec =
        result.retryAfterSec || Math.ceil(result.resetMs / 1000) || 1;

      if (res && typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', retryAfterSec.toString());
      }

      const message =
        result.reason === 'ACCOUNT_BACKOFF_ACTIVE'
          ? `Too many failed authentication attempts for this account. Exponential backoff active: please try again in ${retryAfterSec} seconds.`
          : result.reason === 'IP_LIMIT_EXCEEDED'
            ? `Too many authentication requests from this IP address. Please try again in ${retryAfterSec} seconds.`
            : `Rate limit exceeded for ${result.tier} endpoints. Please retry after ${retryAfterSec} seconds.`;

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message,
          retryAfter: retryAfterSec,
          tier: result.tier,
          reason: result.reason,
          accountIdentifier: result.accountIdentifier,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private extractClientIp(req: any): string {
    const forwarded = req.headers?.['x-forwarded-for'];
    if (forwarded) {
      const first = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0];
      if (first && first.trim()) return first.trim();
    }

    const realIp = req.headers?.['x-real-ip'];
    if (realIp) return realIp.toString().trim();

    return req.ip || req.socket?.remoteAddress || '127.0.0.1';
  }

  private extractAccountIdentifier(
    context: ExecutionContext,
    req: any,
  ): string | undefined {
    const customKeyOrFn = this.reflector.getAllAndOverride<
      string | ((req: any) => string)
    >(ACCOUNT_IDENTIFIER_KEY, [context.getHandler(), context.getClass()]);

    if (typeof customKeyOrFn === 'function') {
      const extracted = customKeyOrFn(req);
      if (extracted) return extracted.trim().toLowerCase();
    } else if (typeof customKeyOrFn === 'string' && req.body?.[customKeyOrFn]) {
      return String(req.body[customKeyOrFn]).trim().toLowerCase();
    }

    // Default inspection for common auth identifiers
    const body = req.body || {};
    const candidate =
      body.email ||
      body.phoneNumber ||
      body.phone ||
      body.username ||
      req.query?.email ||
      req.query?.phoneNumber ||
      req.query?.phone;

    if (candidate) {
      return String(candidate).trim().toLowerCase();
    }

    return undefined;
  }
}
