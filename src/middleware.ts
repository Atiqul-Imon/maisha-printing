import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
  });

  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login page
  // But only if we have a valid token (prevents loops)
  if (pathname === '/admin/login' && token) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    // Validate callbackUrl to prevent open redirects
    const redirectUrl = callbackUrl && callbackUrl.startsWith('/admin') 
      ? callbackUrl 
      : '/admin';
    const redirect = new URL(redirectUrl, request.url);
    // Use 307 Temporary Redirect to ensure method is preserved
    return NextResponse.redirect(redirect, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

