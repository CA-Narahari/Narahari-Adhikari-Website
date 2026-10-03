import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how information submitted through the Narahari Adhikari website is used and stored.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-[#023A51]">Privacy Policy</h1>
      <p className="mt-5 text-base leading-7 text-[#4A5259]">
        This notice explains what happens when you send a request or job application through this website.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-7 text-[#33475B]">
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">Information you provide</h2>
          <p className="mt-2">Consultation requests may include your name, contact details, organisation, requested meeting time, service, and message. Job applications include your contact details, qualifications, application note, and CV.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">How it is used</h2>
          <p className="mt-2">The practice uses consultation details to respond to your request and application details to consider you for the vacancy you selected. Your information is not used for marketing unless you separately choose to receive marketing communications.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">Storage and access</h2>
          <p className="mt-2">Submitted requests are sent to the practice database. CVs are stored in a private file area and can be retrieved by authorised practice staff. The practice should retain records only as long as needed for the purpose and applicable record-keeping requirements.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">External services</h2>
          <p className="mt-2">If you choose online scheduling, Calendly handles that booking on its own service. WhatsApp and other external links also leave this website and are governed by the destination provider&apos;s privacy terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-[#023A51]">Questions about your information</h2>
          <p className="mt-2">To ask about information you have submitted, use the practice&apos;s <Link href="/contact" className="font-semibold text-[#023A51] underline decoration-[#2CBC63] underline-offset-4">contact page</Link> and identify the request or application concerned.</p>
        </section>
      </div>
    </main>
  );
}
