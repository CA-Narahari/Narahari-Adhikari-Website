'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Share2,
  Check,
  Copy,
  FileCheck,
  Building,
} from 'lucide-react';
import { getServiceBySlug, servicesData } from '@/lib/services-data';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { settings } = useApp();
  const service = getServiceBySlug(slug);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FAFCFD]">
        <div className="text-center space-y-4 max-w-md p-6">
          <h1 className="text-2xl font-bold text-[#023A51]">
            Service Not Found
          </h1>
          <p className="text-sm text-[#59667D]">
            The requested service article could not be located.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#023A51] hover:bg-[#2CBC63] text-white font-bold text-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const relatedServices = servicesData.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <article className="pb-28 bg-[#FAFCFD] overflow-x-hidden">
      {/* 1. Header Section */}
      <section id="hero-section" className="relative bg-hero-gradient pt-8 pb-12 sm:pt-12 sm:pb-16 overflow-hidden">
        <div className="mx-auto max-w-[1140px] px-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#59667D] hover:text-[#023A51] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>

          <div className="mt-6 max-w-4xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E8F4F8] text-[#023A51] text-xs font-bold uppercase tracking-wider">
              Practice Area Article
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#023A51] leading-[1.2] tracking-tight">
              {service.title}<span className="text-[#2CBC63]">.</span>
            </h1>

            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed max-w-3xl">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Hero Image Banner matching Ideas/Article Idea.png */}
      <div className="mx-auto max-w-[1140px] px-6 pt-8 sm:pt-10">
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-md border border-[#E8EBEF] bg-slate-100">
          <Image
            src={service.image}
            alt={service.title}
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
          {/* Left Column: Sticky Sidebar (~30%) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Article Sections
                </h3>
                <nav className="mt-3 space-y-1.5" aria-label="Service article sections">
                  <a
                    href="#executive-overview"
                    className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-[#023A51] hover:bg-[#E8F4F8]"
                  >
                    Executive Overview
                  </a>
                  {service.sections.map((sec, idx) => (
                    <a
                      key={idx}
                      href={`#section-${idx}`}
                      className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#023A51] hover:bg-slate-50"
                    >
                      {sec.heading}
                    </a>
                  ))}
                  <a
                    href="#quality-guarantee"
                    className="block py-1.5 px-3 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#023A51] hover:bg-slate-50"
                  >
                    ICAN Compliance Guarantee
                  </a>
                </nav>
              </div>

              {/* Share Service Article */}
              <div className="pt-4 border-t border-[#E8EBEF] space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Share this service article
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(service.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
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
                Engage Our Practice
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed relative z-10">
                Schedule an in-person meeting in Kathmandu or a direct virtual consultation with CA Narahari Adhikari.
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
            {/* Executive Overview */}
            <section id="executive-overview" className="space-y-4">
              <div className="space-y-4 text-[15.5px] sm:text-[16.5px] leading-[1.85] text-[#33475B]">
                {service.articleParagraphs.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className={
                      pIdx === 0
                        ? 'text-[17px] sm:text-[18px] leading-[1.75] text-[#023A51] font-medium'
                        : ''
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Structured Sections */}
            <div className="space-y-10 pt-4 border-t border-[#E8EBEF]">
              {service.sections.map((section, sIdx) => (
                <section
                  key={sIdx}
                  id={`section-${sIdx}`}
                  className="space-y-4 pt-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs flex items-center justify-center shrink-0">
                      {String(sIdx + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#023A51]">
                      {section.heading}
                    </h2>
                  </div>

                  {section.description && (
                    <p className="text-sm sm:text-[15px] leading-[1.8] text-[#4A5259] pl-10">
                      {section.description}
                    </p>
                  )}

                  {section.items && section.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-10 pt-2">
                      {section.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E8EBEF] text-xs sm:text-[13.5px] leading-relaxed text-[#023A51]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Quality Assurance Card */}
            <section
              id="quality-guarantee"
              className="mt-12 rounded-3xl border border-[#CCD7DC] bg-[#E8F4F8] p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-start gap-3.5">
                <FileCheck className="w-6 h-6 text-[#2CBC63] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#023A51]">
                    Statutory Independence & Working Papers Guarantee
                  </h3>
                  <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed">
                    All engagements are performed under the direct oversight of licensed Chartered Accountants registered with ICAN. Client working papers, trial balances, and strategic financial records are maintained under statutory confidentiality and strict professional privilege.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* 4. Related Practice Areas at Bottom */}
        <section className="mt-20 pt-12 border-t border-[#E8EBEF]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
                Practice Areas
              </span>
              <h3 className="text-2xl font-bold text-[#023A51] mt-1">
                Explore Other Services
              </h3>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-[#023A51] hover:text-[#2CBC63] inline-flex items-center gap-1"
            >
              View all 7 services &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => (
              <div
                key={rel.slug}
                className="bg-white rounded-2xl border border-[#E8EBEF] p-6 hover:shadow-md hover:border-[#CCD7DC] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <h4 className="font-bold text-[#023A51] text-base leading-snug">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#59667D] leading-relaxed line-clamp-2">
                    {rel.description}
                  </p>
                </div>
                <Link
                  href={`/services/${rel.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51] hover:text-[#2CBC63]"
                >
                  <span>Read service article</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63]" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
