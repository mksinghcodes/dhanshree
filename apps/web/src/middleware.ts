import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Path Traversal & Suspicious Payload Shield
  const decodedPath = decodeURIComponent(pathname).toLowerCase();
  const suspiciousPatterns = [
    '/..',
    '\\..',
    '..\\',
    '%2e%2e',
    '\0',
    '.env',
    'wp-login',
    'wp-admin',
    'phpinfo',
    '/etc/passwd',
    'cmd.exe',
    '/bin/sh',
    '<script',
    'javascript:',
  ];

  for (const pattern of suspiciousPatterns) {
    if (decodedPath.includes(pattern)) {
      return new NextResponse('Access Denied: Malicious Request Pattern Detected', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
  }

  // 2. Clone response and attach hardened HTTP security headers
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self)',
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
