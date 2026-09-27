import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#F8FAFC] text-slate-900 selection:bg-orange-100 selection:text-orange-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
