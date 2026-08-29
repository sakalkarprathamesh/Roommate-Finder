import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'MIT-ADT Roommate Finder | Student Accommodation & Roommate Discovery',
  description:
    'Find the right roommate, flatmate, room, or accommodation vacancy with fellow MIT-ADT University students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <body className="font-sans min-h-screen flex flex-col text-slate-900 selection:bg-brand-100 selection:text-brand-900 pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileBottomNav />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
