import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Maisha Printing CMS',
  robots: 'noindex, nofollow',
  description: 'Secure admin login for Maisha Printing CMS',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page should be standalone without header/footer
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      {children}
    </div>
  );
}

