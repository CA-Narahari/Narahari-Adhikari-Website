import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Narahari Adhikari | Chartered Accountants',
    template: '%s | Narahari Adhikari',
  },
  description: 'Chartered accountancy support in Nepal for tax, audit, financial reporting, business advisory, and compliance decisions.',
  applicationName: 'Narahari Adhikari Chartered Accountants',
  keywords: ['chartered accountant Nepal', 'tax advisory Nepal', 'statutory audit Nepal', 'NFRS IFRS Nepal'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Narahari Adhikari Chartered Accountants',
    title: 'Narahari Adhikari | Chartered Accountants',
    description: 'Practical support for tax, audit, reporting, and compliance decisions in Nepal.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-[#33475B] selection:bg-[#2CBC63]/20 selection:text-[#023A51]">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
