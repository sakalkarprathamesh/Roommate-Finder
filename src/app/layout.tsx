import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://roommatefinder-pi.vercel.app'),
  title: {
    default: 'MIT-ADT Roommate Finder | Find Roommates & Rooms Near MIT-ADT',
    template: '%s | MIT-ADT Roommate Finder',
  },
  description:
    'Find verified roommates, shared flats, and student room vacancies near MIT-ADT University, Pune. Safe, student-only platform for MIT-ADT students.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'MIT-ADT Roommate Finder | Find Roommates & Rooms Near MIT-ADT',
    description:
      'Find verified roommates, shared flats, and student room vacancies near MIT-ADT University, Pune. Safe, student-only platform for MIT-ADT students.',
    url: 'https://roommatefinder-pi.vercel.app',
    siteName: 'MIT-ADT Roommate Finder',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans min-h-screen flex flex-col text-slate-900 selection:bg-brand-100 selection:text-brand-900 pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileBottomNav />
        <WelcomeModal />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
