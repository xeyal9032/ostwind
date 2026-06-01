import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('x-admin-route', '1');
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|uploads|.*\\..*).*)'],
};
