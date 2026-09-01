import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://roommatefinder-pi.vercel.app'),
  title: {
    default: 'Roomie | Find Rooms, PGs, Flats & Roommates near MIT-ADT',
    template: '%s | Roomie',
  },
  description:
    'Find verified roommates, shared flats, and student room vacancies near MIT-ADT University, Pune. Safe, student-focused platform.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Roomie | Find Rooms, PGs, Flats & Roommates near MIT-ADT',
    description:
      'Find verified roommates, shared flats, and student room vacancies near MIT-ADT University, Pune. Safe, student-focused platform.',
    url: 'https://roommatefinder-pi.vercel.app',
    siteName: 'Roomie MIT-ADT',
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('roomie_theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col selection:bg-brand-100 selection:text-brand-900 pb-16 md:pb-0">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <MobileBottomNav />
          <WelcomeModal />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
