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
  title: 'Narahari Adhikari | Chartered Accountant, Tax Advisory & Offshore Accounting Services',
  description: 'We are preparing a new home for our Tax Business Advisory & Offshore Accounting Services. In the meantime, our team remains fully reachable — please get in touch through any of the options below.',
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
