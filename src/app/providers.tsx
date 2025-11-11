'use client';

import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  // No longer using SessionProvider - using custom auth
  return <>{children}</>;
}

