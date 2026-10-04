import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dhanshree - Global Multi-Vendor Marketplace',
  description: 'Multi-vendor e-commerce marketplace for Nepal, India, and UAE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
