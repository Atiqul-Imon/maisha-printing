'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Add timeout for session check to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'loading') {
        console.warn('Session check timed out after 5 seconds');
        setSessionChecked(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [status]);

  // Redirect if already logged in - but let middleware handle it primarily
  // Only redirect client-side if middleware didn't catch it
  useEffect(() => {
    if (status === 'authenticated' && session) {
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/admin';
      // Small delay to let middleware handle it first
      const timer = setTimeout(() => {
        console.log('Client-side redirect to:', callbackUrl);
        window.location.replace(callbackUrl);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with email:', email);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('Login result:', result);

      if (result?.error) {
        const errorMessage = result.error || 'Invalid credentials';
        setError(errorMessage);
        console.error('Login error:', errorMessage);
        setLoading(false);
      } else if (result?.ok) {
        console.log('Login successful, redirecting...');
        // Login was successful, the session cookie should be set
        // Let the useEffect handle the redirect when status changes to 'authenticated'
        // Or redirect directly after a short delay
        const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/admin';
        // Use a full page reload to ensure session is read
        setTimeout(() => {
          window.location.replace(callbackUrl);
        }, 300);
      } else {
        setError('Login failed. Please check your credentials.');
        console.error('Login failed - no error or success status');
        setLoading(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Login exception:', err);
      setLoading(false);
    }
  };

  // Show loading after successful login (while redirecting)
  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Logging in...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show redirecting (middleware should handle this, but show UI just in case)
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting to admin panel...</p>
        </div>
      </div>
    );
  }

  // If session check is taking too long, show the form anyway
  // This prevents infinite loading if session endpoint is slow/failing
  if (status === 'loading' && sessionChecked) {
    console.log('Session check timed out, showing login form anyway');
    // Continue to show the form below
  } else if (status === 'loading' && !sessionChecked) {
    // Show loading only for the first 5 seconds
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-600 mt-2">
              Maisha Printing CMS
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maishaprinting.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Security:</strong> This is a protected area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2024 Maisha Printing. All rights reserved.
        </p>
      </div>
    </div>
  );
}

