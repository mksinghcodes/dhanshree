import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

/**
 * Security Headers & Information Leakage Prevention Middleware
 *
 * Implements OWASP recommended security headers and strips technology fingerprint headers.
 */
@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // 1. Assign unique Correlation ID (Request ID) if not provided by upstream proxy
    const incomingRequestId = req.headers['x-request-id'] as string;
    const requestId =
      incomingRequestId && incomingRequestId.trim().length > 0
        ? incomingRequestId
        : `req-${crypto.randomUUID()}`;

    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);

    // 2. Strip technology fingerprinting headers
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');

    // 3. Set OWASP & security compliance headers
    // Prevent MIME-sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevent framing/clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Disable outdated buggy browser XSS auditor to prevent auditor-based leaks
    res.setHeader('X-XSS-Protection', '0');

    // Protect referrer data from leaking in cross-origin navigation
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Restrict browser hardware & sensitive device features
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()',
    );

    // Enforce HTTPS HSTS if in production or secure proxy
    if (process.env.NODE_ENV === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    }

    next();
  }
}
