import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ReduxProvider } from '@/store/ReduxProvider';

export const metadata: Metadata = {
  title: 'Dhanshree - Shop. Discover. Delight',
  description: 'Dhanshree: Shop. Discover. Delight. Global Multi-Vendor Marketplace for Nepal, India, and UAE - Dashain, Tihar & Chhath Festive 2026',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'Dhanshree - Shop. Discover. Delight',
    description: 'Premier Multi-Vendor E-Commerce Marketplace for Nepal, India, and UAE',
    images: ['/brand/dhanshree-brand-identity.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
