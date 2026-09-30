import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact the Practice',
  description: 'Contact CA Narahari Adhikari in Kathmandu about tax, audit, accounting, reporting, and business advisory services.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
