/**
 * Authentication utilities for API routes
 * These functions work reliably in Next.js API routes by reading cookies from request headers
 */

import { NextRequest } from 'next/server';
import { verifySessionToken, Session } from '@/lib/auth-custom';

/**
 * Parse cookies from request headers
 */
function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce((acc, cookie) => {
    const trimmed = cookie.trim();
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex > 0) {
      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get session from request (for API routes)
 * This is more reliable than getSessionFromCookie() in API route contexts
 */
export async function getSessionFromRequest(request: NextRequest): Promise<Session | null> {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const token = cookies['auth-token'];

    if (!token) {
      return null;
    }

    return await verifySessionToken(token);
  } catch (error) {
    console.error('getSessionFromRequest error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated (for API routes)
 * Returns the user if authenticated, null otherwise
 */
export async function requireAuth(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  
  if (!session || !session.user) {
    return null;
  }

  return session.user;
}

