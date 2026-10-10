import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest Updates & News | Narahari Adhikari',
  description: 'Stay informed with the latest government notices, tax changes, accounting guidelines, and important updates in the fiscal sector.',
};

export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
