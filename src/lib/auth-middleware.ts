/**
 * Middleware Auth Utilities
 * For use in Next.js middleware (Edge Runtime)
 */

import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Use AUTH_SECRET or NEXTAUTH_SECRET (for backward compatibility)
// Secret should be at least 32 characters long
const getSecretKey = (): Uint8Array => {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production-min-32-chars-please-change-this-in-production-environment';
  return new TextEncoder().encode(secret);
};

const SECRET_KEY = getSecretKey();

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

/**
 * Get user from request cookie (for middleware)
 */
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);
    const user = payload.user as User;

    if (!user || !user.id || !user.email) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

