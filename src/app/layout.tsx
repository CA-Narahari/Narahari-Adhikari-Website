import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans-main',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const fontSerif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-accent',
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Narahari Adhikari',
    template: '%s | Narahari Adhikari',
  },
  description: 'Professional advisory, statutory audit, tax consulting, and financial reporting support in Nepal.',
  applicationName: 'Narahari Adhikari',
  keywords: ['financial advisory Nepal', 'tax consulting Nepal', 'statutory audit Nepal', 'NFRS Nepal'],
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.narahariadhikari.com.np'),
  openGraph: {
    type: 'website',
    siteName: 'Narahari Adhikari',
    title: 'Narahari Adhikari',
    description: 'Professional advisory, statutory audit, tax consulting, and financial reporting support in Nepal.',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-[#1E293B] selection:bg-[#023A51]/15 selection:text-[#023A51]">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
