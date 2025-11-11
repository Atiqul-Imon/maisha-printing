import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Maisha Printing CMS',
  robots: 'noindex, nofollow',
  description: 'Admin panel for managing Maisha Printing content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages should not show header/footer
  return <>{children}</>;
}

