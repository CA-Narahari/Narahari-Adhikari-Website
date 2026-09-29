'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Phone } from 'lucide-react';
import { getServiceBySlug } from '@/lib/services-data';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { settings } = useApp();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#023A51]">
            Service Not Found
          </h1>
          <p className="text-sm text-[#59667D]">
            The service you requested could not be located.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="pb-24 overflow-x-hidden">
      {/* 1. Heading Section matching Home Page background gradient and functionality */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#023A51] tracking-tight leading-tight">
              {service.title}<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Editorial Article Layout matching user reference screenshot */}
      <div className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Team Photograph + Consultation Quick Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-[#E8EBEF]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>

            {/* Quick Consultation Box */}
            <div className="p-6 bg-[#E8F4F8] rounded-2xl border border-[#CCD7DC]/60 space-y-3">
              <h3 className="text-base font-bold text-[#023A51]">
                Need Professional Assistance?
              </h3>
              <p className="text-xs sm:text-[13px] text-[#33475B] leading-relaxed">
                Consult with our senior Chartered Accountants on your specific compliance, tax, or audit requirements in Nepal.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/book-appointment"
                  className="px-5 py-2.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs transition-all shadow-xs"
                >
                  Consult Our Team
                </Link>
                <a
                  href={`tel:${settings.phone}`}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#023A51] font-bold text-xs transition-all border border-[#CCD7DC] inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2CBC63]" />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Editorial Article */}
          <div className="lg:col-span-7 space-y-7 text-[#023A51]">
            {/* Primary Article Paragraphs */}
            <div className="space-y-4 text-[15px] sm:text-[16px] text-[#023A51] leading-[1.8] font-normal">
              {service.articleParagraphs.map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Detailed Article Sections (Lists, Offerings, Sub-services) */}
            <div className="space-y-8 pt-6 border-t border-[#E8EBEF]">
              {service.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h2 className="text-[18px] sm:text-[19px] font-bold text-[#023A51] tracking-tight">
                    {section.heading}
                  </h2>

                  {section.description && (
                    <p className="text-[14.5px] text-[#33475B] leading-relaxed">
                      {section.description}
                    </p>
                  )}

                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-2.5 pt-1 pl-5">
                      {section.items.map((item, iIdx) => (
                        <li
                          key={iIdx}
                          className="text-[14px] sm:text-[14.5px] text-[#023A51] list-disc marker:text-[#023A51] leading-relaxed"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Quality Assurance & Engagement Standards */}
        <div className="mt-16 pt-8 border-t border-[#E8EBEF]">
          <div className="bg-[#F8FAFC] border border-[#E8EBEF] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <h3 className="text-base sm:text-lg font-bold text-[#023A51]">
                  Statutory Independence & Working Papers Guarantee
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#59667D] leading-relaxed">
                  Every engagement is conducted under the strict supervisory framework of the Institute of Chartered Accountants of Nepal (ICAN), the Nepal Standards on Auditing (NSA), and the Nepal Accounting Standards (NAS/NFRS). All financial documentation, working papers, and proprietary corporate intelligence remain protected under institutional professional privilege and non-disclosure standards.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 text-xs text-[#023A51] font-semibold border-l-0 md:border-l border-[#E8EBEF] md:pl-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2CBC63]" />
                  <span>ICAN Registered Practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2CBC63]" />
                  <span>Partner-Led Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2CBC63]" />
                  <span>Statutory Compliance Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
