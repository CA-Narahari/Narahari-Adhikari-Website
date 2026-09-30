import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepal Tax and Regulatory Updates',
  description: 'Practice notes on Nepal tax and regulatory changes, with links to the original notices from official authorities.',
};

export default function TaxUpdatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
