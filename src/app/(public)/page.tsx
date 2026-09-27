'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  MapPin,
  Mail,
  Clock,
  CheckCircle2,
  Check,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function HomePage() {
  const { settings } = useApp();

  // Consultation form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Tax Advisory & IRD Compliance',
    subject: 'Personal & Corporate Tax Consultation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-20 lg:space-y-28 pb-20 overflow-x-hidden">
      {/* 1. Hero Section matching Ideas/LandingPage.png */}
      <section id="hero-section" className="relative bg-[#E0ECF0] pt-8 pb-16 lg:pt-14 lg:pb-0 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/40 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />

        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 lg:pb-20 text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#023A51] leading-[1.12] tracking-tight">
                Secure your financial future with Narahari Adhikari & Associates<span className="text-[#2CBC63]">.</span>
              </h1>

              <p className="text-base sm:text-[18px] text-[#4A5259] leading-relaxed max-w-xl">
                Premier Chartered Accountants licensed by ICAN Nepal, providing high-integrity statutory audits, corporate tax strategy, and institutional business advisory across Nepal.
              </p>

              {/* Action Buttons: Free Consultation (Green Pill) + Our Services (Restored!) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  size="pill"
                  className="bg-[#2CBC63] hover:bg-[#25A456] text-white text-[15px] font-bold h-12 px-8 shadow-sm hover:shadow-lg hover:shadow-[#2CBC63]/25 active:scale-[0.98] transition-all"
                >
                  <Link href="/book-appointment">
                    Free Consultation
                  </Link>
                </Button>

                <Button
                  asChild
                  size="pill"
                  variant="outline"
                  className="border border-[#CCD7DC] bg-white/90 hover:bg-white text-[#023A51] text-[15px] font-bold h-12 px-7 shadow-xs hover:border-[#2CBC63]/50 transition-all"
                >
                  <Link href="/services">
                    Our Services
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Profile Picture matching LandingPage.png person mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 flex justify-center lg:justify-end items-end"
            >
              <div className="relative w-full max-w-[400px] lg:max-w-[430px] flex justify-center">
                <div className="relative">
                  <Image
                    src="/profile-picture.png?v=fresh2"
                    alt="CA Narahari Adhikari - Chartered Accountant Nepal"
                    width={450}
                    height={520}
                    unoptimized={true}
                    priority
                    className="w-auto h-[380px] sm:h-[450px] lg:h-[490px] object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Solutions for every business need (matching LandingPage.png) */}
      <section className="max-w-[1240px] mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-[40px] font-bold text-[#023A51] tracking-tight leading-tight">
            Solutions for every business need<span className="text-[#2CBC63]">.</span>
          </h2>
          <p className="mt-3 text-[15px] text-[#59667D]">
            Comprehensive accounting, statutory assurance, and tax management built on integrity and Nepalese regulatory rigor.
          </p>
        </div>

        {/* 3 Pillars Grid using shadcn Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Accounting */}
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="h-full border border-[#E8EBEF] rounded-[10px] p-8 shadow-none hover:shadow-lg hover:shadow-[#023A51]/5 transition-all bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[8px] bg-transparent flex items-center justify-start text-[#2CBC63]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <line x1="8" y1="7" x2="16" y2="7" />
                    <line x1="8" y1="11" x2="10" y2="11" />
                    <line x1="14" y1="11" x2="16" y2="11" />
                    <line x1="8" y1="15" x2="10" y2="15" />
                    <line x1="14" y1="15" x2="16" y2="15" />
                  </svg>
                </div>

                <h3 className="text-[20px] font-bold text-[#023A51]">
                  Accounting & NFRS
                </h3>

                <p className="text-[14px] text-[#4A5259] leading-relaxed">
                  Meticulous bookkeeping, statutory financial statements preparation under NFRS (Nepal Financial Reporting Standards), periodic management accounts, and internal controls design.
                </p>
              </div>

              <div className="pt-6 border-t border-[#E8EBEF] mt-6">
                <Link
                  href="/services#accounting-business-advisory"
                  className="text-[13px] font-bold text-[#023A51] hover:text-[#2CBC63] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Learn more</span>
                  <span className="text-[#2CBC63]">&rarr;</span>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Tax Management */}
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="h-full border border-[#E8EBEF] rounded-[10px] p-8 shadow-none hover:shadow-lg hover:shadow-[#023A51]/5 transition-all bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[8px] bg-transparent flex items-center justify-start text-[#2CBC63]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>

                <h3 className="text-[20px] font-bold text-[#023A51]">
                  Tax Advisory & IRD
                </h3>

                <p className="text-[14px] text-[#4A5259] leading-relaxed">
                  Corporate tax optimization under Income Tax Act 2058, monthly VAT filing under VAT Act 2052, TDS reconciliations, Tax Clearance, and representation before Inland Revenue Offices (IRO).
                </p>
              </div>

              <div className="pt-6 border-t border-[#E8EBEF] mt-6">
                <Link
                  href="/services#tax-advisory-compliance"
                  className="text-[13px] font-bold text-[#023A51] hover:text-[#2CBC63] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Learn more</span>
                  <span className="text-[#2CBC63]">&rarr;</span>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Financial Planning & Audit */}
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="h-full border border-[#E8EBEF] rounded-[10px] p-8 shadow-none hover:shadow-lg hover:shadow-[#023A51]/5 transition-all bg-white flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-[8px] bg-transparent flex items-center justify-start text-[#2CBC63]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                </div>

                <h3 className="text-[20px] font-bold text-[#023A51]">
                  Audit & Assurance
                </h3>

                <p className="text-[14px] text-[#4A5259] leading-relaxed">
                  Independent statutory audits compliant with ICAN standards, project appraisal reports for commercial bank loans, and corporate secretarial compliance with the Office of the Company Registrar (OCR).
                </p>
              </div>

              <div className="pt-6 border-t border-[#E8EBEF] mt-6">
                <Link
                  href="/services#audit-assurance"
                  className="text-[13px] font-bold text-[#023A51] hover:text-[#2CBC63] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Learn more</span>
                  <span className="text-[#2CBC63]">&rarr;</span>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sub-banner: Need a personalized solution? */}
        <div className="mt-16 text-center max-w-xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-[26px] font-bold text-[#023A51]">
            Need a personalized solution<span className="text-[#2CBC63]">?</span>
          </h3>
          <p className="text-[15px] text-[#4A5259] leading-relaxed">
            Every business entity in Nepal has distinct statutory obligations. Consult with our senior Chartered Accountants for an individualized compliance roadmap.
          </p>
          <div className="pt-2">
            <Button
              asChild
              size="pill"
              className="bg-[#2CBC63] hover:bg-[#25A456] text-white text-[14px] font-bold px-7 h-11 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <Link href="/contact">
                How we can help?
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Empowering you to make sound financial decisions (matching LandingPage.png) */}
      <section className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Consultation Team Photo */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[16px] overflow-hidden shadow-md border border-[#E8EBEF]">
              <Image
                src="/team-consultation.jpg"
                alt="Narahari Adhikari & Associates Consultation Team"
                width={720}
                height={520}
                className="w-full h-[360px] sm:h-[440px] object-cover"
              />
            </div>
          </div>

          {/* Right Column: Copy & Checklist Pills */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-[38px] font-bold text-[#023A51] leading-[1.2] tracking-tight">
              Empowering you to make sound financial decisions<span className="text-[#2CBC63]">.</span>
            </h2>

            <p className="text-[15px] text-[#4A5259] leading-relaxed">
              We translate complex Nepalese tax laws and statutory frameworks into transparent, actionable business strategies. Our partners uphold strict audit independence and maintain direct partner-level engagement with every client.
            </p>

            {/* Checklist Badges — Clean rounded pills with green check */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E8EBEF] rounded-[8px] flex items-center gap-3.5 transition-colors hover:border-[#2CBC63]/40">
                <CheckCircle2 className="w-5 h-5 text-[#2CBC63] shrink-0" />
                <span className="text-[14px] font-semibold text-[#023A51]">
                  Financial assessment & statutory audit reports under ICAN guidelines
                </span>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] border border-[#E8EBEF] rounded-[8px] flex items-center gap-3.5 transition-colors hover:border-[#2CBC63]/40">
                <CheckCircle2 className="w-5 h-5 text-[#2CBC63] shrink-0" />
                <span className="text-[14px] font-semibold text-[#023A51]">
                  Income tax planning, VAT optimization and IRD representation
                </span>
              </div>

              <div className="p-3.5 bg-[#F8FAFC] border border-[#E8EBEF] rounded-[8px] flex items-center gap-3.5 transition-colors hover:border-[#2CBC63]/40">
                <CheckCircle2 className="w-5 h-5 text-[#2CBC63] shrink-0" />
                <span className="text-[14px] font-semibold text-[#023A51]">
                  Payroll processing, Social Security Fund (SSF) & OCR annual compliance
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. No matter who you are, we've got what you need (matching LandingPage.png) */}
      <section className="max-w-[1240px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-[38px] font-bold text-[#023A51] tracking-tight">
            No matter who you are, we’ve got what you need<span className="text-[#2CBC63]">.</span>
          </h2>
          <p className="mt-3 text-[15px] text-[#59667D]">
            Specialized Chartered Accountant engagement models tailored for businesses and individuals in Nepal.
          </p>
        </div>

        {/* 3 Persona Cards matching reference layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Private Clients */}
          <Card className="rounded-[10px] border border-[#E8EBEF] p-8 text-center shadow-none hover:shadow-md transition-all bg-white flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-[#023A51]">
                Private Clients
              </h3>

              <div className="w-24 h-24 mx-auto rounded-full bg-[#FFEAE6] flex items-center justify-center p-3 text-[#023A51]">
                <svg className="w-12 h-12 text-[#E77862]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>

              <p className="text-[13px] text-[#4A5259] leading-relaxed italic">
                &ldquo;Personal income tax returns under Income Tax Act 2058, overseas remittance declarations, and capital gains tax planning managed with complete confidentiality.&rdquo;
              </p>
            </div>

            <div className="pt-6 border-t border-[#E8EBEF] mt-6 text-[12px] text-[#93999F]">
              <div className="font-bold text-[#023A51] text-[13px]">High Net Worth Individuals</div>
              <div>Executives & Investors in Nepal</div>
            </div>
          </Card>

          {/* Card 2: Entrepreneurs */}
          <Card className="rounded-[10px] border border-[#E8EBEF] p-8 text-center shadow-none hover:shadow-md transition-all bg-white flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-[#023A51]">
                Entrepreneurs & Startups
              </h3>

              <div className="w-24 h-24 mx-auto rounded-full bg-[#E0ECF0] flex items-center justify-center p-3 text-[#023A51]">
                <svg className="w-12 h-12 text-[#023A51]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>

              <p className="text-[13px] text-[#4A5259] leading-relaxed italic">
                &ldquo;Private Limited incorporation at Office of Company Registrar (OCR), initial PAN & VAT registration at IRD, and seamless cloud accounting setup from day one.&rdquo;
              </p>
            </div>

            <div className="pt-6 border-t border-[#E8EBEF] mt-6 text-[12px] text-[#93999F]">
              <div className="font-bold text-[#023A51] text-[13px]">SMEs & Startups</div>
              <div>Growing Enterprises in Nepal</div>
            </div>
          </Card>

          {/* Card 3: Professional Firms */}
          <Card className="rounded-[10px] border border-[#E8EBEF] p-8 text-center shadow-none hover:shadow-md transition-all bg-white flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-[18px] font-bold text-[#023A51]">
                Corporate Institutions
              </h3>

              <div className="w-24 h-24 mx-auto rounded-full bg-[#F5EFE6] flex items-center justify-center p-3 text-[#023A51]">
                <svg className="w-12 h-12 text-[#8C6D4F]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>

              <p className="text-[13px] text-[#4A5259] leading-relaxed italic">
                &ldquo;Rigorous statutory audit reports under ICAN framework, transfer pricing compliance, internal forensic reviews, and ongoing regulatory representation before IRD.&rdquo;
              </p>
            </div>

            <div className="pt-6 border-t border-[#E8EBEF] mt-6 text-[12px] text-[#93999F]">
              <div className="font-bold text-[#023A51] text-[13px]">Public & Private Companies</div>
              <div>Financial & Commercial Entities</div>
            </div>
          </Card>
        </div>

        {/* Restored Nepalese Institutional Accreditation Strip matching the reference line style */}
        <div className="mt-16 pt-8 border-t border-[#E8EBEF] flex flex-wrap items-center justify-between gap-6 opacity-75 text-[#33475B] font-bold text-xs tracking-widest uppercase">
          <div className="flex items-center gap-1.5 hover:text-[#2CBC63] transition-colors">
            <span className="text-base font-extrabold text-[#2CBC63]">&bull;</span> ICAN REGISTERED
          </div>
          <div className="hover:text-[#2CBC63] transition-colors">INLAND REVENUE (IRD)</div>
          <div className="hover:text-[#2CBC63] transition-colors">COMPANY REGISTRAR (OCR)</div>
          <div className="hover:text-[#2CBC63] transition-colors">NEPAL RASTRA BANK (NRB)</div>
          <div className="flex items-center gap-1 hover:text-[#2CBC63] transition-colors">
            <span>SEBON ACCREDITED</span> <span className="text-xs text-[#2CBC63]">&loz;</span>
          </div>
          <div className="hover:text-[#2CBC63] transition-colors">[SOCIAL SECURITY FUND]</div>
        </div>
      </section>

      {/* 5. Dark Consultation Box matching LandingPage.png Get a personal consultation */}
      <section className="max-w-[1240px] mx-auto px-6">
        <div className="bg-[#023A51] rounded-[24px] lg:rounded-[28px] p-8 sm:p-12 lg:p-14 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-white tracking-tight">
                  Get a personal consultation<span className="text-[#2CBC63]">.</span>
                </h2>
                <p className="mt-3 text-[14px] text-slate-300 leading-relaxed">
                  Schedule an initial session with our Chartered Accountants to discuss your statutory audit, tax planning, or corporate advisory requirements in Nepal.
                </p>
              </div>

              <div className="space-y-6 text-sm">
                {/* Office */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#2CBC63]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Office</div>
                    <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{settings.address}</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#2CBC63]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Contact</div>
                    <div className="text-xs text-slate-300 mt-0.5 space-y-0.5">
                      <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors block">
                        {settings.email}
                      </a>
                      <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors block">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Open Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#2CBC63]" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Open Hours</div>
                    <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Sunday &ndash; Friday: 10:00 AM &ndash; 5:00 PM<br />
                      Saturday: Closed (By Appointment Only)
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp link */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20CA%20Team%2C%20I%20would%20like%20to%20consult%20regarding%20tax%20and%20audit%20in%20Nepal.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#2CBC63] hover:underline"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Immediate query? Chat directly on WhatsApp &rarr;</span>
                </a>
              </div>
            </div>

            {/* Right Form Card matching LandingPage.png */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[16px] p-6 sm:p-8 text-[#33475B] shadow-2xl">
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 bg-[#2CBC63]/20 rounded-full flex items-center justify-center mx-auto text-[#2CBC63]">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#023A51]">Consultation Requested</h3>
                    <p className="text-xs text-[#59667D] max-w-md mx-auto">
                      Thank you, {formData.name}. Our practice coordinator will contact you at {formData.phone} within one business day.
                    </p>
                    <Button
                      onClick={() => setFormSubmitted(false)}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      Submit Another Query
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#023A51] mb-1.5">
                          Name <span className="text-[#2CBC63]">*</span>
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#023A51] mb-1.5">
                          Phone <span className="text-[#2CBC63]">*</span>
                        </label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(+977) 98XXXXXXXX"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Service */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#023A51] mb-1.5">
                          Email address <span className="text-[#2CBC63]">*</span>
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#023A51] mb-1.5">
                          Service interested in <span className="text-[#2CBC63]">*</span>
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="flex h-11 w-full rounded-[8px] border border-[#E8EBEF] bg-[#F8FAFC] px-3.5 py-2.5 text-[14px] text-[#023A51] transition-all duration-200 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBC63]/40 focus-visible:border-[#2CBC63]"
                        >
                          <option value="Tax Advisory & IRD Compliance">Corporate Tax & IRD Representation</option>
                          <option value="Statutory Audit under ICAN">Statutory & Internal Audit (ICAN)</option>
                          <option value="Accounting & NFRS Bookkeeping">Accounting & NFRS Preparation</option>
                          <option value="Company Registration & OCR">Company Incorporation & OCR Secretarial</option>
                          <option value="Bank Loan Appraisal Reports">Bank Loan Appraisal & Project Reports</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-[#023A51] mb-1.5">
                        Subject
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Tax Planning / Audit Inquiry"
                      />
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label className="block text-xs font-semibold text-[#023A51] mb-1.5">
                        How can we help?
                      </label>
                      <Textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe your entity, tax or audit requirement..."
                      />
                    </div>

                    {/* Submit Button — Pill shape matching LandingPage.png */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="pill"
                        className="w-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-[15px] h-12 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Request a Quote
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
