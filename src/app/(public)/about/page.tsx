'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Award,
  Users,
  Briefcase,
  Target,
  Eye,
  Gem,
  ArrowRight,
  Calendar,
  MessageSquare,
  Mail,
  Building,
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();

  const experts = [
    {
      name: 'CA Narahari Adhikari',
      role: 'Managing Partner (FCA)',
      qualification: 'Fellow Member of ICAN • 15+ Yrs Exp',
      initials: 'NA',
    },
    {
      name: 'Sneha Adhikari',
      role: 'Senior Audit Associate',
      qualification: 'ICAN Semi-Qualified • Banking & NFRS',
      initials: 'SA',
    },
    {
      name: 'Amit Tiwari',
      role: 'Corporate Tax Consultant',
      qualification: 'Direct & Indirect Taxes Specialist',
      initials: 'AT',
    },
    {
      name: 'Priya Karki',
      role: 'Accounts & Advisory Lead',
      qualification: 'Financial Compilation & SSF Reporting',
      initials: 'PK',
    },
  ];

  return (
    <div className="space-y-20 lg:space-y-28 pb-20">
      {/* 1. Hero Section matching Ideas/aboutpage.png */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430]">
                <span>About Us</span>
                <span className="h-px w-8 bg-[#F26430] inline-block" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-slate-900 leading-[1.15] tracking-tight">
                Trusted Guidance for a Stronger Tomorrow
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                {settings.company_name} is a leading Chartered Accountant firm committed to delivering reliable, transparent, and value-driven financial solutions to individuals, businesses, and organizations across Nepal.
              </p>

              {/* 4 Feature Badges */}
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

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl border border-slate-200 shadow-xl bg-white p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-serif text-xl font-bold">
                    CA
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-lg leading-tight">
                      More than just numbers
                    </h3>
                    <p className="text-xs text-slate-500">
                      We build lasting financial futures.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  <p>
                    Established under the Institute of Chartered Accountants of Nepal Act, our practice blends institutional rigor with responsive, personalized service.
                  </p>
                  <p>
                    Whether handling multi-crore corporate tax filings or guiding family enterprises through statutory audits, our standard of diligence remains uncompromising.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">ICAN License:</span>
                  <span className="text-slate-900 font-bold">{settings.ca_reg_number}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are Section (Matching Ideas/aboutpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430] mb-2">
                <span>Our Firm</span>
                <span className="h-px w-8 bg-[#F26430] inline-block" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                Who We Are
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {settings.company_name} is a professional Chartered Accountant firm, offering a wide range of assurance, advisory, tax, and compliance services. With a strong foundation in integrity, quality, and client satisfaction, we help individuals and businesses navigate complex financial landscapes with confidence.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We bring together a team of experienced professionals who are passionate about creating long-term value through personalized and practical solutions.
            </p>

            <div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-900 text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <span>Learn More About Our Services</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F26430]" />
              </Link>
            </div>
          </div>

          {/* Right: Mission, Vision, Values Stack (Matching Ideas/aboutpage.png) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Mission Card */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-[#F26430]" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Our Mission
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  To provide high-quality, independent, and innovative professional services that empower our clients to achieve statutory clarity, financial resilience, and sustained strategic growth.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Our Vision
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  To be the most respected and trusted Chartered Accountancy practice in the region, recognized for technical excellence, integrity, and enduring institutional relationships.
                </p>
              </div>
            </div>

            {/* Values Card */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Gem className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  Our Values
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Integrity, Objectivity, Professional Confidentiality, Technical Precision, and a Client-First consultative approach across all audit and advisory engagements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-center">
          <div className="space-y-1">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">15 +</div>
            <div className="text-xs text-slate-500 font-medium">Years of Experience</div>
          </div>
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">500 +</div>
            <div className="text-xs text-slate-500 font-medium">Happy Corporate Clients</div>
          </div>
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">98%</div>
            <div className="text-xs text-slate-500 font-medium">Success Rate</div>
          </div>
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">12 +</div>
            <div className="text-xs text-slate-500 font-medium">Industries Served</div>
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 text-xs text-slate-600 italic">
            &ldquo;Our success is measured by the success of our clients.&rdquo;
            <span className="block font-semibold not-italic text-slate-900 mt-1">
              — {settings.company_name}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Meet Our Experts (Matching Ideas/aboutpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F26430] mb-2">
              <span>Our Team</span>
              <span className="h-px w-8 bg-[#F26430] inline-block" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Meet Our Experts
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Our team consists of qualified and experienced Chartered Accountants, tax specialists, and assurance professionals.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F26430] hover:text-[#DC5322]"
          >
            <span>Connect with Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experts.map((exp) => (
            <div
              key={exp.name}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="w-20 h-20 rounded-full bg-slate-900 text-amber-400 font-serif font-bold text-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                  {exp.initials}
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {exp.name}
                </h3>
                <div className="text-xs font-semibold text-[#F26430] mt-0.5">
                  {exp.role}
                </div>
                <div className="h-0.5 w-6 bg-[#F26430] my-2" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {exp.qualification}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Kathmandu Desk</span>
                <span className="text-[#F26430] font-semibold group-hover:underline">Consult →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Consultation Banner (Matching Ideas/aboutpage.png) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-[#F26430]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26430] block">
                Need Professional Assistance?
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-0.5">
                Schedule a Consultation
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Get in touch with our team for a consultation or any queries you may have.
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
              href={`mailto:${settings.email}`}
              className="inline-flex items-center gap-2 px-4 py-3.5 text-slate-700 hover:text-slate-900 text-xs font-semibold"
            >
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Email Us</span>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3.5 text-emerald-700 hover:text-emerald-800 text-xs font-semibold"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
