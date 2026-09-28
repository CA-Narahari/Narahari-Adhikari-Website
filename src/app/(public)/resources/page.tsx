'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import {
  Calculator,
  Receipt,
  PiggyBank,
  BookOpen,
  Clock,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Phone,
  X,
  ExternalLink,
} from 'lucide-react';

export default function ResourcesPage() {
  const { settings, downloads } = useApp();

  // Active Interactive Calculator Modal State
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // VAT Calculator State
  const [vatAmount, setVatAmount] = useState<number>(100000);
  const [vatMode, setVatMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  // Income Tax Calculator State (Nepal Individual Slabs)
  const [annualIncome, setAnnualIncome] = useState<number>(1200000);
  const [maritalStatus, setMaritalStatus] = useState<'unmarried' | 'married'>('unmarried');

  // SSF Calculator State
  const [basicSalary, setBasicSalary] = useState<number>(40000);

  // Calculate VAT
  const calcVat = () => {
    if (vatMode === 'exclusive') {
      const vat = vatAmount * 0.13;
      return {
        base: vatAmount,
        vat: Math.round(vat),
        total: Math.round(vatAmount + vat),
      };
    } else {
      const base = vatAmount / 1.13;
      const vat = vatAmount - base;
      return {
        base: Math.round(base),
        vat: Math.round(vat),
        total: vatAmount,
      };
    }
  };
  const vatResult = calcVat();

  // Calculate Nepal Income Tax (Simplified current fiscal slab estimate)
  const calcTax = () => {
    let tax = 0;
    const slab1 = maritalStatus === 'unmarried' ? 500000 : 600000;
    const slab2 = maritalStatus === 'unmarried' ? 700000 : 800000;
    const slab3 = maritalStatus === 'unmarried' ? 1000000 : 1100000;
    const slab4 = 2000000;

    let remaining = annualIncome;
    if (remaining <= slab1) {
      tax += remaining * 0.01; // 1% Social Security Tax
    } else {
      tax += slab1 * 0.01;
      remaining -= slab1;

      const band2 = slab2 - slab1;
      if (remaining <= band2) {
        tax += remaining * 0.10;
      } else {
        tax += band2 * 0.10;
        remaining -= band2;

        const band3 = slab3 - slab2;
        if (remaining <= band3) {
          tax += remaining * 0.20;
        } else {
          tax += band3 * 0.20;
          remaining -= band3;

          const band4 = slab4 - slab3;
          if (remaining <= band4) {
            tax += remaining * 0.30;
          } else {
            tax += band4 * 0.30;
            remaining -= band4;
            tax += remaining * 0.36; // 36% surcharge band
          }
        }
      }
    }
    return Math.round(tax);
  };

  // SSF Calculation (11% employee, 20% employer)
  const employeeSSF = Math.round(basicSalary * 0.11);
  const employerSSF = Math.round(basicSalary * 0.20);
  const totalSSF = employeeSSF + employerSSF;

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. Hero Header matching Ideas/Resources.png with light aqua gradient */}
      <section className="relative bg-hero-gradient pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Resources
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#023A51] leading-[1.12] tracking-tight">
              Accounting tools for your business<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#33475B] font-normal leading-relaxed max-w-2xl">
              Practical financial calculators, VAT computation models, statutory templates, and verified directories to streamline your fiscal operations.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Calculators and applications Section matching Ideas/Resources.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Title */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
              Calculators and applications<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5259] leading-relaxed">
              Real-time models designed for financial controllers, accountants, and business owners in Nepal.
            </p>
          </div>

          {/* Right 2x2 Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tax Calculator */}
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#023A51]">Tax Calculator</h3>
                <p className="text-xs text-[#59667D] leading-relaxed">
                  Interactive personal & corporate income tax calculation based on latest Inland Revenue Department slabs.
                </p>
              </div>
              <button
                onClick={() => setActiveCalculator('tax')}
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <span>Try Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* VAT Calculator */}
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#023A51]">VAT Calculator</h3>
                <p className="text-xs text-[#59667D] leading-relaxed">
                  Calculate statutory 13% Value Added Tax with instant VAT-Inclusive and VAT-Exclusive reverse calculation.
                </p>
              </div>
              <button
                onClick={() => setActiveCalculator('vat')}
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <span>Try Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Retirement / SSF Planner */}
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#023A51]">Retirement Planner</h3>
                <p className="text-xs text-[#59667D] leading-relaxed">
                  Model mandatory employee SSF (11%) and employer contribution (20%) together with gratuity provisions.
                </p>
              </div>
              <button
                onClick={() => setActiveCalculator('ssf')}
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <span>Try Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Checkbook Balancer */}
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#023A51]">Checkbook Balancer</h3>
                <p className="text-xs text-[#59667D] leading-relaxed">
                  Download our official Bank Reconciliation Statement template (BRS) with automated unpresented check logs.
                </p>
              </div>
              <Link
                href="#downloads-section"
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] flex items-center gap-1.5 transition-colors"
              >
                <span>Download Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Green Banner strip matching Ideas/Resources.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2CBC63]/15 border border-[#2CBC63]/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-base sm:text-lg font-bold text-[#023A51] text-center sm:text-left">
            Taking care of your management accounts<span className="text-[#2CBC63]">.</span>
          </div>
          <Link href="/contact">
            <button className="px-6 py-2.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap">
              Talk to us!
            </button>
          </Link>
        </div>
      </section>

      {/* 4. Payroll and HR resources Section matching Ideas/Resources.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Title */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
              Payroll and HR resources<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5259] leading-relaxed">
              Standardized compliance tools to ensure full conformity with the Nepal Labor Act 2074.
            </p>
          </div>

          {/* Right 2 Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#023A51]">Hourly Paycheck Calculator</h3>
                <p className="text-xs text-[#59667D] leading-relaxed">
                  Compute statutory overtime rates (1.5x basic wage), daily subsistence allowances, and net shift pay.
                </p>
              </div>
              <button
                onClick={() => setActiveCalculator('ssf')}
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <span>Try Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#023A51]">Salary Comparison Tool</h3>
                <p className="text-xs text-[#59667D] leading-relaxed">
                  Compare in-hand salary packages across married vs. unmarried tax brackets and evaluate bonus payouts.
                </p>
              </div>
              <button
                onClick={() => setActiveCalculator('tax')}
                className="text-xs font-bold text-[#2CBC63] hover:text-[#25A456] flex items-center gap-1.5 transition-colors cursor-pointer text-left"
              >
                <span>Try Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. We deliver expertise you can trust Section matching Ideas/Resources.png */}
      <section className="bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
              We deliver expertise you can trust<span className="text-[#2CBC63]">.</span>
            </h2>

            <div className="space-y-5">
              <div className="space-y-1">
                <div className="text-base font-bold text-[#2CBC63]">Experience</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Over 15 years of rigorous practice across ICAN audit standards, IRD corporate assessments, and complex cross-border transactions.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-base font-bold text-[#2CBC63]">Professional</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Led by qualified Chartered Accountants with unmatched diligence in balance sheet integrity and statutory filing timelines.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-base font-bold text-[#2CBC63]">Trust Worthy</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Absolute confidentiality, objective reporting, and strict adherence to international ethical standards and the ICAN Code of Ethics.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Experienced financial consulting team"
              width={700}
              height={500}
              unoptimized
              className="w-full h-[360px] sm:h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. We bring you the best possible solutions grid matching Ideas/Resources.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
            We bring you the best possible solutions for your business<span className="text-[#2CBC63]">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center mb-3">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#023A51]">Accounting</h3>
            <p className="text-xs text-[#59667D] leading-relaxed">
              Statutory NFRS financial accounts, corporate bookkeeping, and trial balance integrity.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center mb-3">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#023A51]">Tax Services</h3>
            <p className="text-xs text-[#59667D] leading-relaxed">
              Corporate tax planning, VAT assessments, and dispute representation before IRD.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#023A51]">Bookkeeping</h3>
            <p className="text-xs text-[#59667D] leading-relaxed">
              Accurate daily ledger maintenance, bank reconciliation, and real-time cash flow oversight.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center mb-3">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#023A51]">Payroll</h3>
            <p className="text-xs text-[#59667D] leading-relaxed">
              Monthly payroll computation, SSF uploads, and employee tax withholding statements.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/services">
            <button className="px-6 py-2.5 rounded-full border border-slate-300 hover:border-[#2CBC63] text-[#023A51] hover:text-[#2CBC63] font-bold text-xs transition-colors cursor-pointer">
              View All Services
            </button>
          </Link>
        </div>
      </section>

      {/* 7. On the cutting edge & Business Insights matching Ideas/Resources.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Stats */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
              On the cutting edge<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-sm text-[#4A5259] leading-relaxed max-w-xl">
              Equipped with modern cloud infrastructure, advanced tax analytics, and deep regulatory experience, we deliver financial clarity that positions your enterprise ahead of statutory deadlines.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-[#E8EBEF]">
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#023A51]">15+</div>
                <div className="text-xs text-[#59667D]">Years of experience</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#023A51]">4,054</div>
                <div className="text-xs text-[#59667D]">Connections</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#023A51]">1,200</div>
                <div className="text-xs text-[#59667D]">Clients Served</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-[#023A51]">10+</div>
                <div className="text-xs text-[#59667D]">Countries / Desks</div>
              </div>
            </div>
          </div>

          {/* Right Business Insights Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[#E8EBEF] p-8 shadow-md text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#023A51]">Business Insights</h3>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Stay updated with the latest Inland Revenue Department tax directives, budget amendments, and statutory compliance reminders.
              </p>
              <div className="pt-2">
                <Link href="/tax-updates">
                  <button className="px-6 py-2.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer">
                    Read the updates
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Download Center Section */}
      <section id="downloads-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51]">
            Official Download Center<span className="text-[#2CBC63]">.</span>
          </h2>
          <p className="text-xs text-[#59667D] mt-1">
            Standard statutory templates, IRD forms, and audit preparation checklists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {downloads.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E8EBEF] p-5 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#2CBC63] bg-[#2CBC63]/10 px-2 py-0.5 rounded">
                    {item.category} • {item.file_format}
                  </span>
                  <h3 className="text-sm font-bold text-[#023A51] mt-1">{item.title}</h3>
                  <div className="text-[11px] text-[#59667D] font-mono mt-0.5">
                    {item.file_size} • {item.downloads_count} downloads
                  </div>
                </div>
              </div>

              <a
                href={item.download_url}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading: "${item.title}"`);
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-[#023A51] hover:bg-[#2CBC63] text-white text-xs font-semibold transition-colors"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Bottom Consultation Banner matching Ideas/Resources.png */}
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

      {/* Interactive Calculator Modal */}
      {activeCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022A3A]/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#E8EBEF] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#023A51] flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#2CBC63]" />
                {activeCalculator === 'vat' && '13% VAT Invoice Calculator'}
                {activeCalculator === 'tax' && 'Nepal Income Tax Estimator'}
                {activeCalculator === 'ssf' && 'Social Security Fund (SSF) Calculator'}
              </h3>
              <button
                onClick={() => setActiveCalculator(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VAT Modal Content */}
            {activeCalculator === 'vat' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#023A51] mb-1">
                    Invoice Amount (NRs)
                  </label>
                  <input
                    type="number"
                    value={vatAmount}
                    onChange={(e) => setVatAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-[#023A51] focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setVatMode('exclusive')}
                    className={`py-2 rounded font-semibold text-xs transition-all ${
                      vatMode === 'exclusive'
                        ? 'bg-[#023A51] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    VAT Exclusive (+13%)
                  </button>
                  <button
                    onClick={() => setVatMode('inclusive')}
                    className={`py-2 rounded font-semibold text-xs transition-all ${
                      vatMode === 'inclusive'
                        ? 'bg-[#023A51] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    VAT Inclusive (Tax included)
                  </button>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxable Net:</span>
                    <span className="font-bold font-mono text-[#023A51]">
                      NRs {vatResult.base.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2CBC63] font-semibold">13% VAT:</span>
                    <span className="font-bold font-mono text-[#2CBC63]">
                      NRs {vatResult.vat.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                    <span className="text-[#023A51]">Total Gross:</span>
                    <span className="font-mono text-[#023A51]">
                      NRs {vatResult.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Income Tax Modal Content */}
            {activeCalculator === 'tax' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#023A51] mb-1">
                    Annual Gross Income (NRs)
                  </label>
                  <input
                    type="number"
                    step={50000}
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-[#023A51] focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMaritalStatus('unmarried')}
                    className={`py-2 rounded font-semibold text-xs transition-all ${
                      maritalStatus === 'unmarried'
                        ? 'bg-[#023A51] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Individual (Unmarried)
                  </button>
                  <button
                    onClick={() => setMaritalStatus('married')}
                    className={`py-2 rounded font-semibold text-xs transition-all ${
                      maritalStatus === 'married'
                        ? 'bg-[#023A51] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Couple (Married)
                  </button>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Annual Tax:</span>
                    <span className="font-bold font-mono text-xl text-[#023A51]">
                      NRs {calcTax().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Monthly Tax Deduction (TDS):</span>
                    <span className="font-mono text-slate-700">
                      NRs {Math.round(calcTax() / 12).toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SSF Modal Content */}
            {activeCalculator === 'ssf' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#023A51] mb-1">
                    Monthly Basic Salary (NRs)
                  </label>
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-[#023A51] focus:outline-none focus:ring-1 focus:ring-[#2CBC63]"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Employee Contribution (11%):</span>
                    <span className="font-bold font-mono text-[#023A51]">
                      NRs {employeeSSF.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Employer Contribution (20%):</span>
                    <span className="font-bold font-mono text-[#023A51]">
                      NRs {employerSSF.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                    <span className="text-[#2CBC63]">Total Monthly SSF Deposited:</span>
                    <span className="font-mono text-[#2CBC63]">
                      NRs {totalSSF.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveCalculator(null)}
                className="w-full py-2.5 rounded-lg bg-[#023A51] hover:bg-[#034e6d] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
