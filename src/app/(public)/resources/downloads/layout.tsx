import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forms and Downloads',
  description: 'Browse published forms, checklists, and business resources from the Narahari Adhikari practice.',
};

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
