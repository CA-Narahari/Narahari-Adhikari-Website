'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  CheckCircle2,
  Copy,
  ArrowRight,
  Phone,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogArticlePage() {
  const { blogPosts, services, settings } = useApp();
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('regulatory-landscape');

  const post = blogPosts.find(
    (item) => item.status === 'published' && item.slug === params.slug
  );

  const articleSections = [
    { id: 'regulatory-landscape', title: 'Regulatory Landscape' },
    { id: 'cbms-invoicing', title: '1. Electronic Billing (CBMS)' },
    { id: 'tds-matrix', title: '2. Withholding Tax (TDS) Matrix' },
    { id: 'advance-tax', title: '3. Advance Corporate Tax Schedule' },
    { id: 'statutory-audit', title: '4. Statutory Audit & Returns' },
    { id: 'recommendations', title: 'Practice Recommendations' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const section of articleSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-[#023A51]">Article Not Found</h1>
        <p className="mt-2 text-sm text-[#59667D]">
          The article you are looking for has not been published yet or may have been relocated.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#023A51] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#2CBC63] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-28 bg-[#FAFCFD] overflow-x-hidden">
      {/* 1. Header Section matching Ideas/Article Idea.png */}
      <section className="bg-white border-b border-[#E8EBEF] pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="mx-auto max-w-[1140px] px-6">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#59667D] hover:text-[#023A51] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>

          {/* Title & Metadata */}
          <div className="mt-6 max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E8F4F8] text-[#023A51] text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#023A51] leading-[1.2] tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-[13px] text-[#59667D] pt-1">
              <span className="font-semibold text-[#023A51]">{post.author || 'CA Narahari Adhikari, FCA'}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2CBC63]" />
                {post.published_at}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2CBC63]" />
                {post.read_time || '7 min read'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hero Image Banner matching Ideas/Article Idea.png */}
      <div className="mx-auto max-w-[1140px] px-6 pt-8 sm:pt-10">
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-md border border-[#E8EBEF] bg-slate-100">
          <Image
            src={post.featured_image || '/services/service-tax.jpg'}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1140px"
            className="object-cover"
          />
        </div>
      </div>

      {/* 3. Two Column Editorial Body matching Ideas/Article Idea.png */}
      <div className="mx-auto max-w-[1140px] px-6 pt-10 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Sticky Table of Contents & Socials (~30%) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Table of Contents
                </h3>
                <nav className="mt-3 space-y-1.5" aria-label="Article outline">
                  {articleSections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className={`block py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        activeSection === sec.id
                          ? 'bg-[#E8F4F8] text-[#023A51] border-l-3 border-[#2CBC63] font-bold'
                          : 'text-[#64748B] hover:text-[#023A51] hover:bg-slate-50'
                      }`}
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Share Article */}
              <div className="pt-4 border-t border-[#E8EBEF] space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Share this article
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#E8F4F8] text-[#023A51] hover:bg-[#2CBC63] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                    title="Share on WhatsApp"
                  >
                    W
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#E8F4F8] text-[#023A51] hover:bg-[#0A66C2] hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                    title="Share on LinkedIn"
                  >
                    in
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#E8F4F8] text-[#023A51] hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2CBC63]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Practice Consultation Box */}
            <div className="bg-[#023A51] text-white rounded-2xl p-6 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2CBC63]/20 rounded-full blur-xl pointer-events-none" />
              <h4 className="text-sm font-bold text-white relative z-10">
                Facing an IRD Assessment?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed relative z-10">
                Speak directly with CA Narahari Adhikari to examine your books and clarify statutory liabilities.
              </p>
              <div className="pt-1 relative z-10 flex flex-col gap-2">
                <Link
                  href="/book-appointment"
                  className="w-full py-2.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs text-center transition-all shadow-xs"
                >
                  Schedule Consultation
                </Link>
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3 h-3 text-[#2CBC63]" />
                  <span>Call {settings.phone}</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Full Narrative Editorial Content (~70%) */}
          <main className="lg:col-span-8 space-y-10 text-[#33475B]">
            {/* Lead Introductory Section */}
            <section id="regulatory-landscape" className="space-y-4">
              <p className="text-base sm:text-lg text-[#023A51] font-medium leading-relaxed">
                Operating a commercial enterprise in Nepal requires a disciplined approach to statutory compliance. With the Inland Revenue Department (IRD) accelerating digital enforcement through the Central Billing Monitoring System (CBMS) and stringent e-TDS reconciliation, business leaders cannot afford compliance oversights.
              </p>
              <p className="text-sm sm:text-[15px] leading-[1.85]">
                The corporate taxation framework in Nepal is governed primarily by the Income Tax Act 2058, the Value Added Tax Act 2052, and annual Finance Acts. Every registered corporate taxpayer is obligated to maintain verified books of account, adhere to statutory accounting standards (NAS/NFRS), and submit timely disclosures to regulatory authorities including the IRD, Office of the Company Registrar (OCR), and Nepal Rastra Bank (NRB).
              </p>
            </section>

            {/* Section 1: CBMS */}
            <section id="cbms-invoicing" className="space-y-4 pt-6 border-t border-[#E8EBEF]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#023A51]">
                  Electronic Billing (CBMS) and Invoice Compliance
                </h2>
              </div>
              <p className="text-sm sm:text-[15px] leading-[1.85]">
                Under updated directives from the Inland Revenue Department, entities crossing specific revenue thresholds must synchronize their point-of-sale and ERP billing software directly with the CBMS server. Key compliance mandates include:
              </p>
              <div className="space-y-3 pl-2 sm:pl-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8EBEF] space-y-1">
                  <div className="font-bold text-xs sm:text-sm text-[#023A51] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2CBC63] shrink-0" />
                    Software Certification
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed pl-6">
                    Billing software must be pre-approved by the IRD. Any unapproved modification of database invoices attracts severe penalties under Section 23 of the VAT Act.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8EBEF] space-y-1">
                  <div className="font-bold text-xs sm:text-sm text-[#023A51] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2CBC63] shrink-0" />
                    Real-Time Transmission
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed pl-6">
                    Invoices generated at counters or dispatched electronically must reflect instantaneously on the IRD portal with verifiable QR codes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8EBEF] space-y-1">
                  <div className="font-bold text-xs sm:text-sm text-[#023A51] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2CBC63] shrink-0" />
                    Credit Note Regularization
                  </div>
                  <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed pl-6">
                    Any cancellation or revision of sales invoices must be formalized via statutory credit notes within 7 working days, accompanied by legitimate commercial explanations.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: TDS Matrix */}
            <section id="tds-matrix" className="space-y-4 pt-6 border-t border-[#E8EBEF]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#023A51]">
                  Withholding Tax (TDS) Matrix and E-TDS Mandate
                </h2>
              </div>
              <p className="text-sm sm:text-[15px] leading-[1.85]">
                Withholding tax is an advance deduction at source that acts as a vital reconciliation bridge between vendor income and purchaser expenditure. For FY 2081/82, key statutory withholding rates include:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-[#E8EBEF] bg-white shadow-xs">
                <table className="w-full text-left text-xs sm:text-[13.5px]">
                  <thead className="bg-[#F8FAFC] border-b border-[#E8EBEF] text-[#023A51] font-bold">
                    <tr>
                      <th className="py-3 px-4">Transaction Nature</th>
                      <th className="py-3 px-4">Statutory Rate</th>
                      <th className="py-3 px-4">Statutory Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EBEF]">
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#023A51]">House & Property Rent</td>
                      <td className="py-3 px-4 text-[#2CBC63] font-bold">10%</td>
                      <td className="py-3 px-4 text-slate-500">25th of next Nepali month</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#023A51]">Contractor / Supply Work</td>
                      <td className="py-3 px-4 text-[#2CBC63] font-bold">1.5%</td>
                      <td className="py-3 px-4 text-slate-500">25th of next Nepali month</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#023A51]">Professional & Consultancy Fees</td>
                      <td className="py-3 px-4 text-[#2CBC63] font-bold">15%</td>
                      <td className="py-3 px-4 text-slate-500">25th of next Nepali month</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-[#023A51]">Fixed Deposit Interest (Individual)</td>
                      <td className="py-3 px-4 text-[#2CBC63] font-bold">5% Final</td>
                      <td className="py-3 px-4 text-slate-500">At time of credit</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-2xl bg-[#E8F4F8] border border-[#CCD7DC] flex items-start gap-3 text-xs sm:text-[13.5px] text-[#023A51]">
                <AlertCircle className="w-5 h-5 text-[#2CBC63] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">E-TDS Deposit Requirement:</strong>
                  All withheld tax must be deposited into the government treasury and reconciled via E-TDS vouchers no later than the 25th of the following Nepali month. Failure to deposit incurs monthly penal interest under Section 118.
                </div>
              </div>
            </section>

            {/* Section 3: Advance Corporate Tax */}
            <section id="advance-tax" className="space-y-4 pt-6 border-t border-[#E8EBEF]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#023A51]">
                  Advance Corporate Tax Installment Schedule
                </h2>
              </div>
              <p className="text-sm sm:text-[15px] leading-[1.85]">
                Corporate taxpayers must calculate estimated annual taxable income and pay income tax in three statutory installments:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E8EBEF] text-center space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase">1st Installment</span>
                  <div className="text-2xl font-extrabold text-[#023A51]">40%</div>
                  <div className="text-xs font-semibold text-[#2CBC63]">End of Poush</div>
                  <p className="text-[11px] text-slate-500 pt-1">Mid-January milestone</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8EBEF] text-center space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase">2nd Installment</span>
                  <div className="text-2xl font-extrabold text-[#023A51]">70%</div>
                  <div className="text-xs font-semibold text-[#2CBC63]">End of Chaitra</div>
                  <p className="text-[11px] text-slate-500 pt-1">Mid-April cumulative</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-[#E8EBEF] text-center space-y-1">
                  <span className="text-xs text-slate-400 font-bold uppercase">3rd Installment</span>
                  <div className="text-2xl font-extrabold text-[#023A51]">100%</div>
                  <div className="text-xs font-semibold text-[#2CBC63]">End of Ashadh</div>
                  <p className="text-[11px] text-slate-500 pt-1">Fiscal year closure</p>
                </div>
              </div>
              <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed">
                Shortfall in advance installment payments triggers mandatory interest under Section 118 of the Income Tax Act at 15% per annum, calculated on the unpaid balance.
              </p>
            </section>

            {/* Section 4: Statutory Audit */}
            <section id="statutory-audit" className="space-y-4 pt-6 border-t border-[#E8EBEF]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#023A51]">
                  Statutory Audit and Tax Return Submission
                </h2>
              </div>
              <p className="text-sm sm:text-[15px] leading-[1.85]">
                Every corporate entity in Nepal must appoint a qualified Chartered Accountant licensed by the Institute of Chartered Accountants of Nepal (ICAN) to conduct an independent annual statutory audit.
              </p>
              <ul className="space-y-2 text-xs sm:text-[14px] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2CBC63] font-bold">•</span>
                  <span><strong>Audit Timeline:</strong> Audited balance sheets and profit & loss statements must be approved by the Board and submitted within 6 months of the fiscal year closing (by end of Poush).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2CBC63] font-bold">•</span>
                  <span><strong>Return Filing Forms:</strong> Entities submit online returns via the IRD portal (D-01 for simplified taxpayers, D-02 for medium taxpayers, D-03 for general corporate taxpayers).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#2CBC63] font-bold">•</span>
                  <span><strong>Extensions:</strong> Where justifiable delay occurs, applications for extension up to 3 additional months must be formally lodged with the relevant Inland Revenue Office (IRO) prior to the Poush deadline.</span>
                </li>
              </ul>
            </section>

            {/* Section 5: Recommendations */}
            <section id="recommendations" className="space-y-4 pt-6 border-t border-[#E8EBEF]">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#2CBC63]/20 text-[#2CBC63] font-bold text-xs flex items-center justify-center">
                  ✓
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#023A51]">
                  Actionable Practice Recommendations
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E8EBEF]">
                  <span className="w-5 h-5 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-xs sm:text-[13.5px]">Conduct monthly input VAT and E-TDS reconciliations before the 25th rather than deferring to year-end closing.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E8EBEF]">
                  <span className="w-5 h-5 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-xs sm:text-[13.5px]">Review vendor PAN and VAT status on the IRD portal prior to disbursing payments above NPR 1,000.</p>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E8EBEF]">
                  <span className="w-5 h-5 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p className="text-xs sm:text-[13.5px]">Maintain auditable digital trails for all transactions exceeding NPR 50,000, ensuring payments flow strictly through banking channels.</p>
                </div>
              </div>
            </section>

            {/* Author Profile Block */}
            <div className="mt-12 rounded-3xl border border-[#CCD7DC] bg-[#E8F4F8] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-white border border-[#CCD7DC]">
                <Image
                  src="/profile-picture.png"
                  alt="CA Narahari Adhikari"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2CBC63]">
                  Author Profile
                </span>
                <h3 className="text-lg font-bold text-[#023A51]">
                  CA Narahari Adhikari, FCA
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4A5259] leading-relaxed">
                  Principal Chartered Accountant at Narahari Adhikari & Co. Advising Nepali enterprises, joint ventures, and multinational organisations on tax litigation, statutory audit, and NFRS financial reporting.
                </p>
                <div className="pt-2">
                  <Link
                    href="/book-appointment"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51] hover:text-[#2CBC63]"
                  >
                    <span>Request direct consultation with the author</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63]" />
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </article>
  );
}
