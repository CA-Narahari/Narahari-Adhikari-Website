import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Practice',
  description: 'Meet Narahari Adhikari and learn how the practice approaches tax, audit, reporting, and business advisory work in Nepal.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
