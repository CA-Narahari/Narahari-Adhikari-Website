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
  title: 'Narahari Adhikari & Associates | Chartered Accountants',
  description: 'Premier Chartered Accountancy, Tax Advisory, Statutory Audit & Corporate Consulting in Nepal.',
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
