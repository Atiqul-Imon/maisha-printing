import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  try {
    const user = await getUserFromRequest(request);

    // Protect admin routes (except login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (!user) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
      // User is authenticated, allow access
      return NextResponse.next();
    }

    // Redirect authenticated users away from login page
    if (pathname === '/admin/login' && user) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
      // Validate callbackUrl to prevent open redirects
      const redirectUrl = callbackUrl && callbackUrl.startsWith('/admin') 
        ? callbackUrl 
        : '/admin';
      const redirect = new URL(redirectUrl, request.url);
      // Use 307 Temporary Redirect
      return NextResponse.redirect(redirect, 307);
    }

    return NextResponse.next();
  } catch (error) {
    // If auth check fails, allow the request to continue
    // This prevents middleware errors from blocking the site
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};

