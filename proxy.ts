import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/studio',
  '/briefs',
  '/council',
  '/library',
  '/radar',
  '/signals',
  '/think-tank',
  '/publications',
  '/search',
  '/sources',
  '/admin',
];

// Public routes — never redirect
const PUBLIC_PREFIXES = [
  '/api/auth',
  '/api/public',
  '/api/health',
  '/api/newsletter',
  '/api/radar/subscribe',
  '/_next',
  '/favicon',
  '/public',
];

function getAllowedOrigins(): string[] {
  const origins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  if (process.env.NEXT_PUBLIC_APP_URL) origins.push(process.env.NEXT_PUBLIC_APP_URL);
  if (process.env.URL) origins.push(process.env.URL);
  return origins;
}

function checkCsrf(request: NextRequest): boolean {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;
  if (request.headers.get('x-admin-key') || request.headers.get('authorization')) return true;

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const allowed = getAllowedOrigins();

  if (origin) return allowed.includes(origin);
  if (referer) {
    try { return allowed.includes(new URL(referer).origin); } catch { return false; }
  }
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api');

  // CSRF protection for API mutations
  if (isApi && !checkCsrf(request)) {
    return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 });
  }

  // Auth guard for protected page routes
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (isProtected && !isApi) {
    const session = await getSession();
    if (!session?.email) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('auth', '1');
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Security headers for ALL routes
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // CSP only for pages
  if (!isApi) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;"
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)',
  ],
};
