import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSessionToken } from '@/lib/auth-custom';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const user = await verifyCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSessionToken(user);

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    // In production, ensure secure is true and sameSite is 'lax' for cross-site requests
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: isProduction, // true in production (HTTPS required)
      sameSite: 'lax', // Allows cookies to be sent with top-level navigations
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/', // Available for all paths
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

