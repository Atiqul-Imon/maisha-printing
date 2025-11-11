/**
 * Custom Authentication System
 * Uses JWT tokens stored in HTTP-only cookies
 */

import { getUsersCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

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

export interface Session {
  user: User;
  expires: string;
}

/**
 * Verify user credentials
 */
export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const collection = await getUsersCollection();

    if (!collection) {
      // Fallback authentication if MongoDB not configured
      if (
        (email === 'admin@maishaprinting.com' || email === 'admin@maishaprintingbd.com') &&
        password === 'admin123'
      ) {
        return {
          id: '1',
          email: email,
          name: 'Admin',
          role: 'admin',
        };
      }
      return null;
    }

    const user = await collection.findOne({ email }) as {
      password: string;
      email: string;
      name?: string;
      role?: string;
      _id: { toString: () => string };
    } | null;

    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name || 'Admin',
      role: user.role || 'admin',
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Create a JWT token for the user
 */
export async function createSessionToken(user: User): Promise<string> {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expires.getTime() / 1000))
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verify and decode JWT token
 */
export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const user = payload.user as User;

    if (!user || !user.id || !user.email) {
      return null;
    }

    return {
      user,
      expires: new Date((payload.exp as number) * 1000).toISOString(),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get session from cookie (server-side only - use in API routes/server components)
 */
export async function getSessionFromCookie(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return null;
    }

    return await verifySessionToken(token);
  } catch (error) {
    return null;
  }
}

