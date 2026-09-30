import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Website Use',
  description: 'How to use information and services on the Narahari Adhikari website.',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <p className="text-sm font-semibold text-[#2CBC63]">Website information</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#023A51]">Terms of Website Use</h1>
      <p className="mt-5 text-base leading-7 text-[#4A5259]">
        These notes explain the limits of the information and request forms on this website.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-7 text-[#33475B]">
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">General information</h2>
          <p className="mt-2">Website articles, tax updates, resources, and calculator results are general information. They are not tailored accounting, tax, legal, or investment advice. Rules can change, so confirm current requirements with the relevant authority and a qualified adviser before acting.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">Consultation requests</h2>
          <p className="mt-2">Submitting an in-person consultation request does not reserve a confirmed appointment or create a client relationship. The practice will contact you to confirm availability and any engagement terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">External websites</h2>
          <p className="mt-2">Links to government offices, scheduling providers, and other websites are provided for convenience. Their content, availability, and terms are controlled by those providers.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">Contact</h2>
          <p className="mt-2">For questions about the website or its services, please use the <Link href="/contact" className="font-semibold text-[#023A51] underline decoration-[#2CBC63] underline-offset-4">contact page</Link>.</p>
        </section>
      </div>
    </main>
  );
}
