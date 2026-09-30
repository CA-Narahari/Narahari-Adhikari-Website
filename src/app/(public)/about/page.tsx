'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Scale,
  Briefcase,
  FileCheck,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Practice leadership and expandable associate network
  const primaryPractitioner = {
    name: 'CA Narahari Adhikari',
    title: 'Chartered Accountant & Principal',
    credential: 'FCA | ICAN Member',
    image: '/profile-picture.png',
    bio: 'Fellow Chartered Accountant with long experience in Nepal\'s tax system, statutory audits, and financial reporting. He works with businesses on IRD assessments, corporate reorganisations, and NFRS/IFRS implementation.',
    specialties: [
      'Statutory & Forensic Audit',
      'Direct & Indirect Tax Advisory',
      'Mergers, Acquisitions & Valuation',
      'NFRS/IFRS Implementation',
    ],
  };

  const practiceCommitments = [
    {
      title: 'Independent and ethical work',
      desc: 'We follow ICAN and auditing standards, and keep our advice independent of the outcome a client wants.',
      icon: Scale,
    },
    {
      title: 'Client confidentiality',
      desc: 'Your records, working papers, and business information are handled discreetly and shared only when there is a proper reason to do so.',
      icon: ShieldCheck,
    },
    {
      title: 'Direct senior involvement',
      desc: 'You speak with the people reviewing the work, so recommendations stay practical and connected to your situation.',
      icon: Briefcase,
    },
    {
      title: 'Careful records and clear answers',
      desc: 'We trace the numbers, explain the assumptions, and flag the points that need attention before a filing or review.',
      icon: FileCheck,
    },
  ];

  const faqsList = [
    {
      q: 'What are the statutory audit submission timelines for companies in Nepal?',
      a: 'Under the Company Act 2063 and Income Tax Act 2058, every registered entity must conduct an annual statutory audit by a certified Chartered Accountant within six months of the fiscal year-end (typically by the end of Poush, with allowable 3-month extensions upon IRD approval). Audited financial statements must then be tabled at the Annual General Meeting and filed with the Office of the Company Registrar (OCR) and Inland Revenue Department.',
    },
    {
      q: 'Who is required to file monthly VAT returns and what is the statutory deadline?',
      a: 'All entities registered under the Value Added Tax Act 2052 must submit their monthly VAT returns and deposit the net tax payable by the 25th of the following month. Failure to file on time attracts statutory penal fines under Section 19 of 0.1% per day or NPR 1,000 per month, whichever is higher.',
    },
    {
      q: 'How does your practice assist with NFRS/IFRS transition?',
      a: 'We perform diagnostic gap-analyses against traditional Nepal Accounting Standards (NAS), establish opening balance sheet reconciliations, draft technical accounting policy notes for leases (NFRS 16) and financial assets (NFRS 9), and guide internal finance teams through auditor review readiness.',
    },
    {
      q: 'What is the procedure for handling Inland Revenue Department (IRD) tax assessments or disputes?',
      a: 'When an assessment order or scrutiny notice is issued by the IRD, our practice conducts an evidentiary review of your books, prepares formal rebuttals, calculates statutory security deposit requirements, and provides representation during Administrative Review (Section 115) and before the Revenue Tribunal.',
    },
    {
      q: 'Are all employers required to enroll in the Social Security Fund (SSF)?',
      a: 'Yes. Under the Labor Act 2074 and Social Security Act 2074, all formal sector employers in Nepal must contribute 31% of the employee\'s basic salary (20% employer contribution + 11% employee contribution) through the SSF online portal every month.',
    },
    {
      q: 'How is working paper confidentiality and professional privilege maintained?',
      a: 'All client communications, working papers, and proprietary trade information remain protected under the ICAN Code of Professional Conduct. We do not disclose client data to third parties without lawful statutory authorization or explicit written client consent.',
    },
  ];

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              About the Practice<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Experienced advice for businesses that need clear answers on tax, audit, reporting, and compliance in Nepal.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-10 sm:pt-12 space-y-16 sm:space-y-20">
        {/* ======================================================== */}
        {/* 2. LEAD PRACTITIONER & ADVISORY EXPERTISE (AT TOP AS REQUESTED) */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="border-b border-[#E8EBEF] pb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
              Meet the principal<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#59667D] mt-1">
              Every engagement is reviewed directly by an experienced Chartered Accountant.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8EBEF] p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Photo */}
              <div className="md:col-span-5 lg:col-span-4 flex justify-center">
                <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-[#E8EBEF] bg-[#E8F4F8]">
                  <Image
                    src={primaryPractitioner.image}
                    alt={primaryPractitioner.name}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className="md:col-span-7 lg:col-span-8 space-y-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs mb-2">
                    {primaryPractitioner.title}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#023A51]">
                    {primaryPractitioner.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-semibold text-[#2CBC63] mt-0.5">
                    {primaryPractitioner.credential}
                  </div>
                </div>

                <p className="text-xs sm:text-[14px] text-[#4A5259] leading-relaxed">
                  {primaryPractitioner.bio}
                </p>

                {/* Core Competencies */}
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                    Areas of focus
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {primaryPractitioner.specialties.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#023A51]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2CBC63] shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
                  <Link
                    href="/book-appointment"
                    className="px-6 py-2.5 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Schedule Direct Consultation
                  </Link>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-xs font-semibold text-[#023A51] hover:text-[#2CBC63] flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#2CBC63]" />
                    <span>{settings.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. PRACTICE OVERVIEW & BACKGROUND */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Clear advice, grounded in experience<span className="text-[#2CBC63]">.</span>
            </h2>
            <div className="space-y-3.5 text-sm sm:text-[14.5px] text-[#4A5259] leading-relaxed">
              <p>
                Our work follows the Nepal Chartered Accountants Act and the standards issued by ICAN. That gives clients a clear process for making decisions and keeping their records in order.
              </p>
              <p>
                We help growing businesses with monthly VAT and E-TDS work, and support larger organisations with restructuring, Nepal Rastra Bank approvals, and NFRS conversions.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#023A51] hover:text-[#2CBC63] transition-colors"
              >
                <span>See all 7 services</span>
                <ArrowRight className="w-4 h-4 text-[#2CBC63]" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E8EBEF] aspect-[16/11]">
              <Image
                src="/team-consultation.jpg"
                alt="Professional consultation session"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. PRACTICE COMMITMENTS & GOVERNANCE PILLARS */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="border-b border-[#E8EBEF] pb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
              How we work<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#59667D] mt-1">
              Independent thinking, careful work, and plain communication on every engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {practiceCommitments.map((commit, idx) => {
              const Icon = commit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F4F8] text-[#023A51] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#2CBC63]" />
                    </div>
                    <h3 className="text-base font-bold text-[#023A51] leading-snug">
                      {commit.title}
                    </h3>
                    <p className="text-xs text-[#59667D] leading-relaxed">
                      {commit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. FREQUENTLY ASKED QUESTIONS (FAQS SECTION WITH ID="FAQS") */}
        {/* ======================================================== */}
        <section id="faqs" className="scroll-mt-28 space-y-6">
          <div className="border-b border-[#E8EBEF] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                Frequently Asked Questions<span className="text-[#2CBC63]">.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#59667D] mt-1">
                Essential compliance answers regarding statutory audit, tax disputes, and corporate filings in Nepal.
              </p>
            </div>
            <Link
              href="/contact"
              className="text-xs font-bold text-[#2CBC63] hover:underline shrink-0"
            >
              Have a specific inquiry? Contact us &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {faqsList.map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div
                  key={fIdx}
                  className="bg-white rounded-2xl border border-[#E8EBEF] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    type="button"
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <span className="text-sm sm:text-[15px] font-bold text-[#023A51] leading-snug">
                      {faq.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2CBC63]' : 'text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed border-t border-slate-100 bg-[#FBFDFE]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. OFFICE LOCATION & CONSULTATION CONTACT */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl border border-[#E8EBEF] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                Conveniently located in Kathmandu<span className="text-[#2CBC63]">.</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-[#4A5259] leading-relaxed pt-1">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Office:</span>
                    <span>{settings.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Email:</span>
                    <a href={`mailto:${settings.email}`} className="text-[#023A51] hover:underline font-mono">
                      {settings.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Phone:</span>
                    <a href={`tel:${settings.phone}`} className="text-[#023A51] hover:underline font-mono">
                      {settings.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#E8F4F8] rounded-2xl p-6 sm:p-8 space-y-4 border border-[#CCD7DC]/70">
              <h3 className="text-base font-bold text-[#023A51]">
                Arrange a Consultation
              </h3>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Consult regarding statutory audit scheduling, IRD assessment notices, or NFRS financial conversion requirements.
              </p>
              <Link
                href="/book-appointment"
                className="w-full py-3 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs text-center block transition-colors shadow-xs"
              >
                Request Meeting &rarr;
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
