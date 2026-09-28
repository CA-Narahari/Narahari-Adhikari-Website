'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Calculator,
  Receipt,
  TrendingUp,
  BookOpen,
  Users,
  Globe2,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  BarChart3,
  Building,
  FileCheck2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ServicesPage() {
  const { settings } = useApp();

  const mainServices = [
    {
      title: 'Accounting',
      icon: Calculator,
      description: 'Comprehensive financial accounting, trial balance reconciliations, and statutory reporting under Nepal Financial Reporting Standards (NFRS).',
      accentColor: 'border-b-4 border-b-[#2CBC63]',
      items: [
        'Income tax preparation & regulatory filings',
        'Income tax planning and strategic consulting',
        'Business start-up consulting & incorporation',
        'General ledger review and balance sheet cleanup',
      ],
    },
    {
      title: 'Tax Services',
      icon: Receipt,
      description: 'Strategic tax compliance designed to legally minimize liabilities, ensure IRD alignment, and safeguard against administrative penalties.',
      accentColor: 'border-b-4 border-b-[#023A51]',
      items: [
        'On-site and Off-site IRD representation',
        'VAT compliance & CBMS e-billing synchronization',
        'Tax assessments, revisions & dispute appeals',
        'Cross-border withholding tax (TDS) advisory',
      ],
    },
    {
      title: 'Financial',
      icon: TrendingUp,
      description: 'High-level financial modeling, capital structuring, and strategic advisory for business owners, boards, and corporate directors.',
      accentColor: 'border-b-4 border-b-[#2CBC63]',
      items: [
        "Strategies for owner's capital & distribution",
        'Designing executive benefits & equity plans',
        'Banking loan syndication & project feasibility',
        'Corporate succession & restructuring guidance',
      ],
    },
    {
      title: 'Bookkeeping',
      icon: BookOpen,
      description: 'Flawless cloud-based bookkeeping and daily transaction entries ensuring real-time visibility into your cash flow and operational margins.',
      accentColor: 'border-b-4 border-b-[#023A51]',
      items: [
        'On & Off-site monthly bookkeeping',
        'Complete management accounts & MIS reports',
        'Credit control, accounts receivable & follow-ups',
        'Virtual bookkeeping via QuickBooks, Xero & Tally',
      ],
    },
    {
      title: 'Payroll',
      icon: Users,
      description: 'Complete payroll administration ensuring strict compliance with Nepal Labor Act 2074 and mandatory Social Security Fund (SSF) rules.',
      accentColor: 'border-b-4 border-b-[#2CBC63]',
      items: [
        'Monthly and weekly employee payroll processing',
        'Annual tax returns & IRD employee TDS reconciliation',
        'Social Security Fund (SSF) & Gratuity compliance',
        'Provident fund, bonus act & statutory benefits',
      ],
    },
    {
      title: 'Outsourcing & Offshore BPO',
      icon: Globe2,
      description: 'Dedicated offshore accounting teams providing high-accuracy financial management for US, UK, and Australian accounting firms and businesses.',
      accentColor: 'border-b-4 border-b-[#023A51]',
      items: [
        'Dedicated offshore full-charge bookkeepers',
        'Accounts payable & vendor invoice verification',
        'Overseas sales tax and quarterly return filings',
        'Multi-currency reconciliations & month-end closing',
      ],
    },
  ];

  const valuableFeatures = [
    {
      title: 'On & Off-site Accounting',
      description: 'Flexible deployment of senior accountants directly to your corporate premises or managed securely through cloud platforms.',
      icon: Building,
    },
    {
      title: 'Cash Control & Working Capital',
      description: 'Proactive treasury oversight and cash flow modeling to ensure liquidity during peak seasonal procurement.',
      icon: BarChart3,
    },
    {
      title: 'VAT & E-Billing Control',
      description: 'Full adherence to IRD Central Billing Monitoring System (CBMS) requirements with continuous audit logs.',
      icon: Receipt,
    },
    {
      title: 'Statutory Audit Services',
      description: 'Independent, rigorous audit opinions under NSA/ISA standards respected by commercial banks and tax authorities.',
      icon: ShieldCheck,
    },
    {
      title: 'Year End Accounts & Tax Clearance',
      description: 'Timely closing of financial books and swift issuance of formal tax clearance certificates from Inland Revenue offices.',
      icon: FileCheck2,
    },
    {
      title: 'Reliable Chartered Accountants',
      description: 'Hands-on oversight from ICAN Fellow Chartered Accountants with decades of accumulated industry insight.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. Hero Header matching Ideas/Services.png with light aqua gradient */}
      <section className="relative bg-hero-gradient pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#023A51] leading-[1.12] tracking-tight">
              Extensive range of professional services<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#33475B] font-normal leading-relaxed max-w-2xl">
              End-to-end chartered accountancy, corporate tax advisory, statutory assurance, and offshore BPO bookkeeping customized for businesses, startups, and international enterprises.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Services Grid (6 cards matching Ideas/Services.png & Ideas/ServicesPage Components.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`bg-white rounded-2xl border border-[#E8EBEF] p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${service.accentColor}`}
              >
                <div>
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-[#E8EBEF] flex items-center justify-center text-[#2CBC63] mb-6 group-hover:scale-110 group-hover:bg-[#2CBC63]/10 transition-all">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-2xl font-bold text-[#023A51] mb-3 group-hover:text-[#2CBC63] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[#4A5259] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Checklist Items */}
                  <ul className="space-y-3 mb-8">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#33475B]">
                        <span className="w-4 h-4 rounded-full bg-[#2CBC63]/15 text-[#2CBC63] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom link */}
                <div className="pt-4 border-t border-[#E8EBEF]">
                  <Link
                    href={`/book-appointment?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#023A51] hover:text-[#2CBC63] transition-colors"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Need a personalized solution? Banner matching Ideas/Services.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51]">
            Need a personalized solution<span className="text-[#2CBC63]">?</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5259] leading-relaxed">
            Every enterprise has unique operational variables. Contact our senior partners to tailor a service package that fits your exact scope and budget.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <button className="px-8 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer">
                How we can help?
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Client Testimonial / Spotlight Section matching Ideas/Services.png */}
      <section className="bg-slate-50 border-y border-[#E8EBEF] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-lg border border-[#E8EBEF]">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80"
                alt="Executive business client review"
                width={600}
                height={500}
                unoptimized
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
            </div>

            {/* Right Quote */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#59667D]">
                HEMISFERIO ENTERPRISES
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#023A51] leading-tight tracking-tight">
                Narahari Adhikari has been providing accountancy services and advice to us for over 7 years<span className="text-[#2CBC63]">.</span>
              </h3>
              <p className="text-sm sm:text-base text-[#4A5259] leading-relaxed">
                &ldquo;Their team eliminated the complexity from our annual audits, streamlined our VAT e-billing CBMS synchronization, and saved us substantial administrative costs. There is no other chartered accounting firm in Nepal we trust more.&rdquo;
              </p>
              <div className="pt-2">
                <div className="font-bold text-[#023A51] text-sm">Bruce Miller / Prakash Thapa</div>
                <div className="text-xs text-[#59667D]">Managing Director & Founder</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Valuable Features Grid matching Ideas/Services.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
            Valuable Features<span className="text-[#2CBC63]">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valuableFeatures.map((feat) => {
            const FeatIcon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center shrink-0">
                    <FeatIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#023A51]">{feat.title}</h3>
                </div>
                <p className="text-xs text-[#59667D] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Specialty and Niche Industry Practices matching Ideas/Services.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Industries
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Extensive range of specialty and niche industry practices<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4A5259] leading-relaxed">
              We understand that the tax and regulatory issues facing a hydropower project differ dramatically from a SaaS technology startup or a hospitality resort. Our practice maintains dedicated industry specialization across Nepal&apos;s key growth sectors.
            </p>
            <div className="pt-2">
              <Link href="/book-appointment">
                <button className="px-6 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer">
                  Schedule an Industry Consultation
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-lg border border-[#E8EBEF]">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
              alt="Two colleagues collaborating at a coffee and laptop workspace"
              width={700}
              height={500}
              unoptimized
              className="w-full h-[360px] sm:h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. Bottom Consultation Banner matching Ideas/Services.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#023A51] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CBC63]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
              Get a personal consultation<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-normal">
              We will take care of your accounting and administrative services.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 shrink-0">
            <Link
              href="/book-appointment"
              className="px-8 py-3.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
            >
              Free Consultation
            </Link>

            <a
              href={`tel:${settings.phone || '+97714423890'}`}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4 text-[#2CBC63]" />
              <span>{settings.phone || '(555) 802-1234'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
