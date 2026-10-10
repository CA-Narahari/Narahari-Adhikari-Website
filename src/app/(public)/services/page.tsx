'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Briefcase,
  FileText,
  ShieldCheck,
  TrendingUp,
  Building2,
  Handshake,
  MessageSquareQuote,
  HeartHandshake,
  LineChart,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { publicMediaUrl } from '@/lib/media-url';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ReceiptText: FileText,
  ShieldCheck: ShieldCheck,
  TrendingUp: TrendingUp,
  Building2: Building2,
  Handshake: Handshake,
  MessageSquareQuote: MessageSquareQuote,
  HeartHandshake: HeartHandshake,
  LineChart: LineChart,
  GraduationCap: GraduationCap,
};

export default function ServicesPage() {
  const { services } = useApp();
  const displayServices = services;

  return (
    <div className="pb-28 overflow-x-hidden bg-[#FAFCFD]">
      {/* 1. Header Section */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Our Professional Services<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
              Rigorous statutory audits, corporate tax structuring, accounting outsourcing, and financial advisory for enterprises in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Grid directly from dynamic CMS database */}
      <section className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Briefcase;
            const serviceImage = publicMediaUrl(service.image) || '/Logo.png';

            return (
              <div
                key={service.slug}
                className="group flex flex-col justify-between bg-white rounded-3xl border border-[#E8EBEF] overflow-hidden hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300"
              >
                <div>
                  {/* Service Photo */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={serviceImage}
                      alt={service.image_alt || service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs text-[#023A51] flex items-center justify-center shadow-md">
                      <Icon className="w-4 h-4 text-[#023A51]" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 space-y-3">
                    <h2 className="text-xl font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors">
                      <Link href={`/services/${service.slug}`}>
                        {service.title}
                      </Link>
                    </h2>
                    <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed line-clamp-3">
                      {service.short_description}
                    </p>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="px-6 sm:px-7 pb-6 pt-2">
                  <div className="pt-4 border-t border-[#E8EBEF] flex items-center justify-between">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors"
                    >
                      <span>Read service article</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Advisory Delivery & Quality Standards */}
      <section className="max-w-[1240px] mx-auto px-6 mt-16 sm:mt-20">
        <div className="rounded-3xl bg-white border border-[#E8EBEF] p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-8 sm:mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#2CBC63]">
              Engagement Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight mt-1">
              How We Deliver Professional Advisory
            </h2>
            <p className="text-sm sm:text-[15px] text-[#4A5259] leading-relaxed mt-2">
              Our service model emphasizes thorough regulatory alignment, partner-led engagement oversight, and structured working documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E8EBEF] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7ED] text-[#2CBC63] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-bold text-[#023A51]">Regulatory Precision</h3>
              <p className="text-xs sm:text-[13px] text-[#4A5259] leading-relaxed">
                Direct alignment with prevailing Nepal Income Tax Acts, VAT directives, ASB Nepal guidelines, and statutory audit mandates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E8EBEF] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7ED] text-[#2CBC63] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-bold text-[#023A51]">Direct Principal Oversight</h3>
              <p className="text-xs sm:text-[13px] text-[#4A5259] leading-relaxed">
                Key advisory findings, audit plans, and tax opinions are directly led and reviewed by Narahari Adhikari.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E8EBEF] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#E6F7ED] text-[#2CBC63] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-bold text-[#023A51]">Confidential Documentation</h3>
              <p className="text-xs sm:text-[13px] text-[#4A5259] leading-relaxed">
                Institutional documentation standards ensuring audit trails, data protection, and permanent compliance readiness for stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
