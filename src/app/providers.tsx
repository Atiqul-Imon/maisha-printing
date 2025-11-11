'use client';

import { ReactNode } from 'react';

/**
 * Providers Component
 * 
 * Wraps the application with providers.
 * Currently using custom authentication system (JWT-based)
 * instead of NextAuth, so no session provider is needed.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

