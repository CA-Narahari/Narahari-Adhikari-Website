import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Read practical articles on tax, audit, accounting, and financial reporting from the Narahari Adhikari practice.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
