import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Resources',
  description: 'Use the practice calculators, browse useful downloads, and find Nepal government and regulatory portals.',
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
