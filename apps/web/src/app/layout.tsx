import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Dhanshree - Everything You Love, One Place.',
  description: 'Dhanshree: Everything You Love, One Place. Global Multi-Vendor Marketplace for Nepal, India, and UAE - Dashain, Tihar & Chhath Festive 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
