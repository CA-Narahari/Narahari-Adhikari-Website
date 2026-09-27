'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ReceiptText,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Building2,
  Globe2,
  ArrowRight,
  Calendar,
  CheckCircle,
  FileCheck2,
  HelpCircle,
  FileText,
} from 'lucide-react';

export default function ServicesPage() {
  const { services } = useApp();

  const serviceCards = [
    {
      title: 'Tax & Compliance',
      slug: 'tax-advisory-compliance',
      icon: ReceiptText,
      description: 'Stay compliant with ever-changing tax regulations and minimize your tax burden with expert guidance.',
    },
    {
      title: 'Accounting & Bookkeeping',
      slug: 'accounting-business-advisory',
      icon: Calculator,
      description: 'Accurate records, better decisions with our efficient cloud accounting and bookkeeping solutions.',
    },
    {
      title: 'Audit & Assurance',
      slug: 'audit-assurance',
      icon: ShieldCheck,
      description: 'Build trust with independent and reliable audits, ensuring statutory accuracy and board transparency.',
    },
    {
      title: 'Business Advisory',
      slug: 'accounting-business-advisory',
      icon: TrendingUp,
      description: 'Strategic financial guidance for sustainable growth, fractional CFO insights, and long-term success.',
    },
    {
      title: 'Company Registration',
      slug: 'corporate-secretarial-legal',
      icon: Building2,
      description: 'From idea to establishment, we simplify OCR incorporation, shareholder registries, and local licensing.',
    },
    {
      title: 'Cross-Border & FDI Advisory',
      slug: 'corporate-secretarial-legal',
      icon: Globe2,
      description: 'Comprehensive support for foreign investors, NRB approvals, and cross-border withholding tax.',
    },
  ];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* 1. Hero Section matching Ideas/servicespage.png */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430]">
                <span>Our Services</span>
                <span className="h-px w-8 bg-[#F26430] inline-block" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-slate-900 leading-[1.15] tracking-tight">
                Professional Services for Your Financial Growth
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                We offer a comprehensive range of accounting, tax, assurance, and corporate advisory services tailored to meet your unique enterprise needs and compliance goals.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/book-appointment"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F26430] hover:bg-[#DC5322] text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#explore-services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-lg border border-slate-300 transition-all shadow-xs"
                >
                  <span>Explore All Services</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl border border-slate-200 shadow-xl bg-white p-8 space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-serif text-lg font-bold">
                    CA
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-base leading-tight">
                      Full Practice Spectrum
                    </h3>
                    <p className="text-[11px] text-slate-500">Regulated under ICAN Code of Ethics</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200/60">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Penalty Corporate Tax Filing</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200/60">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Statutory & NSA Compliant Audits</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200/60">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OCR Company Secretarial & 51/78 Filings</span>
                  </div>
                </div>

                <Link
                  href="/book-appointment"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  <span>Inquire for Your Business</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore Our Services Grid (Matching Ideas/servicespage.png) */}
      <section id="explore-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430] mb-2">
              <span>Our Services</span>
              <span className="h-px w-8 bg-[#F26430] inline-block" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Explore Our Services
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Choose a practice area below to learn more about how our Senior Chartered Accountants can assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCards.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.title}
                className="bg-white border border-slate-200/90 rounded-xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-slate-300"
              >
                <div>
                  <div className="w-11 h-11 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F26430] mb-5 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/book-appointment?service=${encodeURIComponent(srv.title)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F26430] group-hover:underline"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Practice Section (Matching Ideas/servicespage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26430] block mb-1">
              Featured Practice Area
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Tax Planning, Assessment & Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Stay compliant with ever-changing tax regulations, minimize corporate tax burdens legally, and gain expert representation before tax authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-200">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-sm font-serif font-bold text-slate-900">
                Tax Planning & Advisory
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimize your corporate tax structures and advance installment payments legally.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-sm font-serif font-bold text-slate-900">
                VAT & E-Billing (CBMS)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seamless monthly VAT reconciliation, input credit audit, and IRD CBMS certification.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-sm font-serif font-bold text-slate-900">
                TDS Advisory & Withholding
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accurate ETDS uploads, withholding tax certification, and Section 87-89 compliance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-sm font-serif font-bold text-slate-900">
                Income Tax Return (ITR)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hassle-free corporate annual return preparation and clearance certificate processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Consultation Banner (Matching Ideas/servicespage.png) */}
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
                Book Your Appointment Today
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Let&apos;s discuss your needs and create a plan that works for you.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F26430] hover:bg-[#DC5322] text-white font-semibold rounded-lg text-sm shadow-sm transition-all"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
