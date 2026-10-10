'use client';

import React from 'react';
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
  Target,
  Eye,
  CheckCircle2,
  FileCheck2,
  Search,
  Sparkles,
  Award,
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();

  const primaryPractitioner = {
    name: 'Narahari Adhikari',
    title: 'Senior Financial Advisor & Principal',
    credential: 'Registered Practitioner & Senior Advisor',
    image: '/profile-picture.png',
    bio: 'Distinguished financial advisor with extensive experience guiding corporations, trading houses, manufacturing entities, and financial institutions across Nepal. Narahari Adhikari leads the firm with a steadfast commitment to regulatory precision, sound corporate governance, and practical fiscal strategy. His expertise spans complex statutory audits, IRD tax assessments, cross-border corporate reorganizations, and NFRS conversions.',
    specialties: [
      'Statutory & Forensic Audit Assurance',
      'Corporate Tax Planning & IRD Assessment Defense',
      'NFRS Accounting Conversion & Advisory',
      'Mergers, Corporate Restructuring & Due Diligence',
      'Internal Control & Risk Governance Systems',
      'Financial Strategy & Entity Structuring',
    ],
  };

  const coreValues = [
    {
      title: 'Integrity & Independence',
      desc: 'Uncompromising commitment to objective professional standards and strict ethical conduct across every engagement.',
      icon: Scale,
    },
    {
      title: 'Precision & Technical Rigor',
      desc: 'In-depth mastery of Nepalese fiscal regulations, tax statutes, and reporting standards to ensure flawless compliance.',
      icon: ShieldCheck,
    },
    {
      title: 'Client Confidentiality',
      desc: 'Absolute discretion and institutional safeguarding of corporate financial books, working papers, and strategic decisions.',
      icon: Award,
    },
    {
      title: 'Senior-Led Direct Involvement',
      desc: 'Clients work directly with principal leadership, ensuring practical recommendations rooted in senior experience.',
      icon: Sparkles,
    },
  ];

  const clientApproachSteps = [
    {
      step: '01',
      title: 'Discovery & Mandate Analysis',
      desc: 'We conduct a comprehensive assessment of your business model, corporate structure, statutory obligations, and specific compliance or advisory objectives.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Evidence-Based Technical Review',
      desc: 'Our team examines transaction records, financial disclosures, and regulatory notices against current Nepalese statutory frameworks.',
      icon: FileCheck2,
    },
    {
      step: '03',
      title: 'Strategic Formulation & Execution',
      desc: 'We deliver clear, actionable compliance roadmaps, authoritative audit opinions, or robust representations before tax authorities.',
      icon: Target,
    },
    {
      step: '04',
      title: 'Proactive Assurance & Monitoring',
      desc: 'Continuous advisory support ensures your organization stays ahead of evolving tax circulars, fiscal deadlines, and regulatory shifts.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 1. Hero Header */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-14 sm:pb-18 overflow-hidden border-b border-[#E2E8F0]"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2EBF0] text-[#023A51] text-xs font-bold tracking-wider uppercase">
              About the Practice
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Professional Integrity. Strategic Clarity.
            </h1>
            <p className="text-base sm:text-[18px] text-[#33475B] font-normal leading-relaxed">
              A premier financial advisory and audit practice led by Narahari Adhikari, dedicated to delivering uncompromising regulatory compliance and executive counsel across Nepal.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 pt-12 sm:pt-16 space-y-20 sm:space-y-24">
        {/* ======================================================== */}
        {/* 2. MEET THE PRINCIPAL */}
        {/* ======================================================== */}
        <section id="principal" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8EBEF] pb-4 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#023A51]/70 block mb-1">
                Executive Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
                Meet the Principal<span className="text-[#2CBC63]">.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#59667D]">
              Direct involvement on every corporate advisory engagement.
            </p>
          </div>

          <div className="bg-white rounded-[32px] border border-[#DCE4EC] p-8 sm:p-12 shadow-[0_12px_40px_rgba(2,58,81,0.06)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Photo & Portrait */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-72 h-88 sm:w-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-[#DCE4EC] bg-gradient-to-b from-[#EAEFF4] to-[#F5F8FA]">
                  <Image
                    src={primaryPractitioner.image}
                    alt={primaryPractitioner.name}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#023A51]/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Bio & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4F8] text-[#023A51] font-bold text-xs mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#2CBC63]" />
                    <span>{primaryPractitioner.title}</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#023A51]">
                    {primaryPractitioner.name}
                  </h3>
                </div>

                <p className="text-sm sm:text-[15.5px] text-[#33475B] leading-relaxed">
                  {primaryPractitioner.bio}
                </p>

                {/* Core Competencies */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#023A51] block mb-3">
                    Areas of Practice Focus
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {primaryPractitioner.specialties.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] font-medium text-[#023A51] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E8EBEF]">
                        <CheckCircle2 className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-full bg-[#023A51] hover:bg-[#034B68] text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-xs sm:text-sm font-bold text-[#023A51] hover:text-[#2CBC63] flex items-center gap-2 transition-colors px-4 py-2.5 rounded-full border border-[#DCE4EC] hover:bg-slate-50"
                  >
                    <Phone className="w-4 h-4 text-[#2CBC63]" />
                    <span>{settings.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. MISSION, VISION & VALUES */}
        {/* ======================================================== */}
        <section id="mission-vision-values" className="space-y-10">
          <div className="border-b border-[#E8EBEF] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#023A51]/70 block mb-1">
              Foundational Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
              Mission, Vision & Values<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#59667D] mt-1">
              The ethical and strategic standards guiding every client relationship.
            </p>
          </div>

          {/* Mission & Vision Twin Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-[28px] border border-[#DCE4EC] p-8 sm:p-10 shadow-[0_8px_30px_rgba(2,58,81,0.05)] space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F4F8] text-[#023A51] flex items-center justify-center">
                <Target className="w-6 h-6 text-[#2CBC63]" />
              </div>
              <h3 className="text-2xl font-bold text-[#023A51]">
                Our Mission
              </h3>
              <p className="text-sm sm:text-[15px] text-[#4A5259] leading-relaxed">
                To deliver rigorous, independent financial counsel and audit assurance that empowers corporate leaders and entrepreneurs to operate with total regulatory confidence, safeguard assets, and optimize long-term economic performance in Nepal.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-[28px] border border-[#DCE4EC] p-8 sm:p-10 shadow-[0_8px_30px_rgba(2,58,81,0.05)] space-y-4 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F4F8] text-[#023A51] flex items-center justify-center">
                <Eye className="w-6 h-6 text-[#023A51]" />
              </div>
              <h3 className="text-2xl font-bold text-[#023A51]">
                Our Vision
              </h3>
              <p className="text-sm sm:text-[15px] text-[#4A5259] leading-relaxed">
                To be recognized as Nepal&apos;s benchmark independent financial and statutory consulting practice&mdash;distinguished by technical precision, unwavering ethical integrity, and profound clarity in complex fiscal environments.
              </p>
            </div>
          </div>

          {/* Core Values 4-Grid */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-[#023A51]">
              Core Practice Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E8F4F8] text-[#023A51] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#2CBC63]" />
                    </div>
                    <h4 className="text-base font-bold text-[#023A51] leading-snug">
                      {val.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#59667D] leading-relaxed">
                      {val.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. OUR APPROACH TO CLIENT WORK */}
        {/* ======================================================== */}
        <section id="approach" className="space-y-8">
          <div className="border-b border-[#E8EBEF] pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#023A51]/70 block mb-1">
              Methodology & Execution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
              Our Approach to Client Work<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#59667D] mt-1">
              A structured, transparent engagement framework that guarantees precision and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientApproachSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#DCE4EC] p-6 shadow-xs flex flex-col justify-between hover:border-[#023A51] transition-colors relative group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#023A51]/20 font-mono group-hover:text-[#2CBC63] transition-colors">
                        {step.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-[#F0F5F8] flex items-center justify-center text-[#023A51]">
                        <Icon className="w-4 h-4 text-[#023A51]" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-[#023A51]">
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-[#59667D] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. LOCATION & PRACTICE DETAILS */}
        {/* ======================================================== */}
        <section className="bg-white rounded-[28px] border border-[#DCE4EC] p-8 sm:p-12 shadow-[0_10px_35px_rgba(2,58,81,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#023A51]/70 block">
                Kathmandu Practice
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
                Our Office Location & Hours
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5259] leading-relaxed">
                Clients are welcome to schedule in-person consultations at our Kathmandu chambers or initiate virtual advisory discussions.
              </p>

              <div className="space-y-3.5 text-xs sm:text-sm text-[#4A5259] pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Address:</span>
                    <span>{settings.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Email:</span>
                    <a href={`mailto:${settings.email}`} className="text-[#023A51] hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#023A51] block">Phone:</span>
                    <a href={`tel:${settings.phone}`} className="text-[#023A51] hover:underline">
                      {settings.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 space-y-4 border border-[#DCE4EC]">
              <h4 className="text-base font-bold text-[#023A51]">
                Need Professional Assistance?
              </h4>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Connect directly with our advisory desk regarding your specific audit, corporate assessment, or regulatory inquiry.
              </p>
              <Link
                href="/contact"
                className="w-full py-3 rounded-full bg-[#023A51] hover:bg-[#034B68] text-white font-bold text-xs text-center block transition-all shadow-xs"
              >
                Contact Us &rarr;
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
