'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  ReceiptText,
  TrendingUp,
  Building2,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileCheck,
  Sparkles,
  Award,
  Users,
  Briefcase,
  HelpCircle,
  FileText,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  const { settings, services, taxUpdates } = useApp();

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* 1. Hero Section matching Ideas/homepage.png and Ideas/aboutpage.png */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430]">
                <span>Business Advisory & Audit Practice</span>
                <span className="h-px w-8 bg-[#F26430] inline-block" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-slate-900 leading-[1.15] tracking-tight">
                Reliable Financial & Audit Advisory, Built Around Your Business
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                {settings.company_name} empowers organizations to stay compliant, confident, and financially clear through structured audits, strategic tax planning, and authoritative corporate guidance.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F26430] hover:bg-[#DC5322] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <span>Request Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-lg border border-slate-300 transition-all shadow-xs"
                >
                  <span>Our Practice Areas</span>
                </Link>

                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20would%20like%20to%20consult%20with%20your%20tax%20team.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 text-emerald-700 hover:text-emerald-800 text-sm font-semibold transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Query</span>
                </a>
              </div>

              {/* 4 Feature Badges (Matching Ideas/aboutpage.png) */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-[#F26430]" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 leading-tight">Professional</div>
                    <div className="text-slate-500 text-[11px]">Expertise</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 leading-tight">Client</div>
                    <div className="text-slate-500 text-[11px]">Focused</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 leading-tight">Integrity &</div>
                    <div className="text-slate-500 text-[11px]">Transparency</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-200/60 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900 leading-tight">Long-Term</div>
                    <div className="text-slate-500 text-[11px]">Partnerships</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 p-8 text-white space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 font-serif font-bold flex items-center justify-center text-lg">
                      CA
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">ICAN Licensed Practice</div>
                      <div className="text-xs text-amber-400 font-mono">{settings.ca_reg_number}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    Active Desk
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xl font-serif font-bold text-white">
                    Direct Partner Advisory
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Personalized consultation with Fellow Chartered Accountants on corporate restructuring, Inland Revenue tax audits, and compliance clearances.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Office Location:</span>
                    <span className="font-semibold text-white">New Baneshwor, Kathmandu</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Consultation Options:</span>
                    <span className="font-semibold text-amber-400">Office • Phone • Online</span>
                  </div>
                </div>

                <Link
                  href="/book-appointment"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#F26430] hover:bg-[#DC5322] text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Consultation Slot</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Pillar Cards (Matching Ideas/homepage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
            Confidential & Objective Approach
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Experienced Business Advisors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Structured Audits */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-8 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
              <FileCheck className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Structured Audits
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Clear, methodical audit processes designed to meet statutory requirements and strengthen board oversight.
            </p>
          </div>

          {/* Card 2: Confidential & Secure (Dark Accent Card) */}
          <div className="bg-[#14213D] text-white border border-slate-800 rounded-xl p-8 shadow-md space-y-3">
            <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 mb-4">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white">
              Confidential & Secure
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Financial insights that help leadership make informed, risk-aware decisions with complete client confidentiality.
            </p>
          </div>

          {/* Card 3: Clear Communication */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-8 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-4">
              <MessageSquare className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              Clear Communication
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We explain tax findings and statutory requirements clearly—no unnecessary jargon, no ambiguity, just clarity.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Stats Strip (Matching Ideas/aboutpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-center">
          <div className="text-center sm:text-left space-y-1">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">15 +</div>
            <div className="text-xs text-slate-500 font-medium">Years of Experience</div>
          </div>

          <div className="text-center sm:text-left space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">500 +</div>
            <div className="text-xs text-slate-500 font-medium">Audits & Engagements</div>
          </div>

          <div className="text-center sm:text-left space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">98%</div>
            <div className="text-xs text-slate-500 font-medium">Compliance Accuracy</div>
          </div>

          <div className="text-center sm:text-left space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">12 +</div>
            <div className="text-xs text-slate-500 font-medium">Industries Served</div>
          </div>

          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 text-xs text-slate-600 italic">
            &ldquo;Our success is measured by the statutory compliance and enduring growth of our clients.&rdquo;
            <span className="block font-semibold not-italic text-slate-900 mt-1">
              — CA Narahari Adhikari
            </span>
          </div>
        </div>
      </section>

      {/* 4. Practice Areas (Matching Ideas/servicespage.png 6-card grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430] mb-2">
              <span>Our Services</span>
              <span className="h-px w-8 bg-[#F26430] inline-block" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Explore Our Professional Services
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F26430] hover:text-[#DC5322] transition-colors"
          >
            <span>View All Practice Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-slate-200/90 rounded-xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-slate-300"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F26430] mb-5 group-hover:scale-105 transition-transform">
                  <ReceiptText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {srv.short_description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/services#${srv.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#F26430] group-hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-slate-400 font-mono">Expert Counsel</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Latest Tax Updates Portal Strip */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430] mb-2">
                <span>Tax Updates</span>
                <span className="h-px w-8 bg-[#F26430] inline-block" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                Latest Tax Updates & Regulatory Directives
              </h2>
            </div>
            <Link
              href="/tax-updates"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F26430] hover:text-[#DC5322]"
            >
              <span>Explore Tax Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {taxUpdates.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs hover:shadow transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.published_at}
                    </span>
                  </div>
                  <h3 className="text-base font-serif font-bold text-slate-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium truncate max-w-[140px]">
                    {item.source_name}
                  </span>
                  <Link
                    href={`/tax-updates`}
                    className="font-bold text-[#F26430] hover:text-[#DC5322] flex items-center gap-1"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bottom Consultation Strip (Matching Ideas/contactpage.png & Ideas/aboutpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-[#F26430]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26430] block">
                Ready to Get Started?
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Book Your Consultation Today
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Let&apos;s discuss your compliance needs and create a plan that works for you.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F26430] hover:bg-[#DC5322] text-white font-semibold rounded-lg text-sm shadow-sm transition-all"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20would%20like%20to%20connect%20with%20your%20office.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3.5 text-emerald-700 hover:text-emerald-800 text-sm font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
