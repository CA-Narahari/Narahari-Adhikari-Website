import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact the Practice',
  description: 'Contact Narahari Adhikari in Kathmandu about advisory, statutory audit, tax consulting, and reporting services.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
