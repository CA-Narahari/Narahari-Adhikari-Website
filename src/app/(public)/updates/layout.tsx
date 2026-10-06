import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nepal Tax and Regulatory Updates',
  description: 'Practice notes on Nepal tax and regulatory changes, with links to the original notices from official authorities.',
  alternates: { canonical: '/updates' },
  openGraph: { type: 'website', title: 'Nepal Tax and Regulatory Updates', description: 'Practice notes on Nepal tax and regulatory changes, with links to official authorities.' },
};

export default function UpdatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
