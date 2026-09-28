'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import {
  Users,
  HeartHandshake,
  ShieldCheck,
  Award,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Check,
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();

  const teamMembers = [
    {
      name: 'CA Narahari Adhikari',
      role: 'Founder & Managing Partner',
      experience: 'FCA • 15+ Years Experience',
      image: '/profile-picture.png',
      bio: 'Fellow Chartered Accountant (ICAN) with extensive expertise in statutory audit, corporate restructuring, and high-stakes IRD tax dispute resolutions.',
    },
    {
      name: 'Sneha Adhikari',
      role: 'Senior Audit Director',
      experience: 'Chartered Accountant • NFRS Specialist',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: 'Directs statutory and internal audits across commercial banks, manufacturing enterprises, and public corporations in Nepal.',
    },
    {
      name: 'Ramesh Bhattarai',
      role: 'Tax Advisory Partner',
      experience: 'Corporate Tax & Dispute Resolution',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      bio: 'Specialist in corporate income tax planning, VAT CBMS e-billing synchronization, and foreign cross-border withholding tax.',
    },
    {
      name: 'Priya Karki',
      role: 'Corporate Finance Lead',
      experience: 'M&A & Feasibility Consulting',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      bio: 'Advises high-growth startups and family business conglomerates on financial modeling, bank syndication, and private equity preparation.',
    },
    {
      name: 'Bikash Sharma',
      role: 'Offshore Accounting Manager',
      experience: 'US & Australian GAAP / Cloud BPO',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      bio: 'Leads our offshore BPO division providing night-shift and real-time reconciliation in QuickBooks, Xero, and NetSuite for overseas clients.',
    },
    {
      name: 'Sunita Shrestha',
      role: 'Regulatory & Litigation Specialist',
      experience: 'OCR & Company Secretarial Affairs',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
      bio: 'Oversees Company Registrar (OCR) compliance, FDI department sanctions, and intellectual property registrations for domestic and international entities.',
    },
  ];

  const offices = [
    {
      city: 'Kathmandu (Head Office)',
      address: 'Level 4, Corporate Heights, New Baneshwor, Kathmandu',
      phone: settings.phone || '+977 1 4423890',
      email: settings.email || 'info@narahariadhikari.com',
      badge: 'Main Practice Hub',
      mapUrl: 'https://maps.google.com/?q=New+Baneshwor+Kathmandu',
    },
    {
      city: 'Pokhara Regional Liaison',
      address: 'Lakeside Commercial Center, Ward 6, Pokhara, Gandaki',
      phone: '+977 61 541289',
      email: 'pokhara@narahariadhikari.com',
      badge: 'Regional Desk',
      mapUrl: 'https://maps.google.com/?q=Lakeside+Pokhara',
    },
    {
      city: 'Offshore & Remote Advisory Hub',
      address: 'Serving North America, UK & Australia (BPO Division)',
      phone: '+977 9851000000',
      email: 'offshore@narahariadhikari.com',
      badge: 'Global Delivery',
      mapUrl: 'mailto:offshore@narahariadhikari.com',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. Hero Section matching Ideas/AboutUs.png with light aqua gradient */}
      <section className="relative bg-hero-gradient pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#023A51] leading-[1.12] tracking-tight">
              We deliver expertise you can trust<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#33475B] font-normal leading-relaxed max-w-2xl">
              Narahari Adhikari is a premier Chartered Accountancy practice in Nepal, delivering rigorous statutory audit, strategic corporate tax planning, and seamless offshore accounting solutions.
            </p>
          </div>

          {/* 3 Photos Collage matching Ideas/AboutUs.png */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-3 rounded-2xl overflow-hidden shadow-lg border border-white/80 h-64 md:h-72">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=700&q=80"
                alt="Advisory meeting"
                width={500}
                height={400}
                unoptimized
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="md:col-span-6 rounded-2xl overflow-hidden shadow-xl border-2 border-white h-72 md:h-96">
              <Image
                src="/team-consultation.jpg"
                alt="Audit and Tax Team collaborating"
                width={800}
                height={600}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
            <div className="md:col-span-3 rounded-2xl overflow-hidden shadow-lg border border-white/80 h-64 md:h-72">
              <Image
                src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=700&q=80"
                alt="Executive business review"
                width={500}
                height={400}
                unoptimized
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Overview Section matching Ideas/AboutUs.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
            Overview<span className="text-[#2CBC63]">.</span>
          </h2>
          <div className="space-y-4 text-[15px] sm:text-base text-[#4A5259] leading-relaxed">
            <p>
              Registered with the Institute of Chartered Accountants of Nepal (ICAN Reg. No. 1024/2078), our practice stands at the intersection of technical excellence and institutional integrity. We provide businesses—from high-growth domestic startups to multinational corporations—with clear, proactive guidance to navigate Nepal’s intricate fiscal landscape.
            </p>
            <p>
              Whether structuring compliance for complex Inland Revenue Department (IRD) requirements, managing foreign direct investment (FDI) approvals through Nepal Rastra Bank, or preparing statutory accounts according to Nepal Financial Reporting Standards (NFRS), we bring precision, confidentiality, and commercial acumen to every client engagement.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Our Mission Section matching Ideas/AboutUs.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left image */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-lg border border-[#E8EBEF]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Hands stacked in unity and mission"
              width={700}
              height={500}
              unoptimized
              className="w-full h-[360px] sm:h-[420px] object-cover"
            />
          </div>

          {/* Right mission copy */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              We help our clients identify their business and financial needs<span className="text-[#2CBC63]">.</span>
            </h2>
            <div className="space-y-4 text-sm sm:text-[15px] text-[#4A5259] leading-relaxed">
              <p>
                Our core mission is to safeguard enterprise value through rigorous statutory assurance, legally compliant tax minimization, and responsive financial management.
              </p>
              <p>
                We do not believe in one-size-fits-all accounting. Every client receives hands-on attention from qualified Chartered Accountants who take the time to understand operational realities and deliver pragmatic, forward-looking counsel.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#023A51] hover:text-[#2CBC63] transition-colors"
              >
                <span>Explore all practice areas</span>
                <ArrowRight className="w-4 h-4 text-[#2CBC63]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trusted Strip matching Ideas/AboutUs.png */}
      <section className="bg-slate-50 border-y border-[#E8EBEF] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#59667D] mb-8">
            Trusted by the country&apos;s fastest growing companies & institutions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="text-base font-extrabold tracking-widest text-[#023A51]">❖ ABSTRACT</span>
            <span className="text-base font-extrabold tracking-widest text-[#023A51]">CGLOBAL</span>
            <span className="text-base font-extrabold tracking-widest text-[#023A51]">DIGITALBOX</span>
            <span className="text-base font-extrabold tracking-widest text-[#023A51]">HEMISFERIO</span>
            <span className="text-base font-extrabold tracking-widest text-[#023A51]">NEXT❖</span>
            <span className="text-base font-extrabold tracking-widest text-[#023A51]">[SPACES]</span>
          </div>
        </div>
      </section>

      {/* 5. Our Values Section matching Ideas/AboutUs.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Values Summary */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
              Our Values<span className="text-[#2CBC63]">.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4A5259] leading-relaxed">
              Our culture and code of conduct are anchored in institutional integrity, client obsession, and technical excellence. These core values govern every audit opinion and consultation we provide.
            </p>
          </div>

          {/* Right 2x2 Values Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#023A51]">Customer first</h3>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Direct partner access, transparent billing, and dedicated response times within 24 business hours.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#023A51]">Passion</h3>
              <p className="text-xs text-[#59667D] leading-relaxed">
                We are deeply passionate about numbers, fiscal health, and helping businesses thrive under complex regulatory systems.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#023A51]">Integrity</h3>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Strict adherence to the ICAN Code of Professional Ethics, objectivity, and absolute confidentiality of financial data.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-[#E8EBEF] shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#023A51]">Excellence</h3>
              <p className="text-xs text-[#59667D] leading-relaxed">
                Continuous professional training on revised IRD directives, CBMS e-invoicing, and International Financial Reporting Standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Meet the Team Section matching Ideas/AboutUs.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
            Meet the Team<span className="text-[#2CBC63]">.</span>
          </h2>
          <p className="text-sm text-[#4A5259]">
            A dedicated group of qualified Chartered Accountants, tax specialists, and financial analysts committed to your success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-[#E8EBEF] overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-[#023A51]">{member.name}</h3>
                  <div className="text-xs font-semibold text-[#2CBC63]">{member.role}</div>
                  <div className="text-[11px] text-[#59667D] font-mono mt-0.5">{member.experience}</div>
                  <p className="text-xs text-[#4A5259] leading-relaxed mt-3">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8EBEF] flex items-center justify-between text-xs text-[#59667D]">
                  <Link
                    href={`/contact?recipient=${encodeURIComponent(member.name)}`}
                    className="text-xs font-bold text-[#023A51] hover:text-[#2CBC63] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Connect directly</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Careers Section matching Ideas/AboutUs.png */}
      <section className="bg-slate-50 border-y border-[#E8EBEF] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left image */}
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-md border border-[#E8EBEF]">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
                alt="Our energetic firm team collaborating"
                width={700}
                height={450}
                unoptimized
                className="w-full h-[320px] sm:h-[380px] object-cover"
              />
            </div>

            {/* Right Careers Text */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
                Careers
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight leading-tight">
                Want to be a part of our team<span className="text-[#2CBC63]">?</span>
              </h2>
              <p className="text-sm sm:text-[15px] text-[#4A5259] leading-relaxed">
                We are constantly looking for sharp ICAN Articleship trainees, semi-qualified accountants, and experienced tax seniors who value rigorous work and a collaborative environment.
              </p>
              <div className="pt-2">
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-[#2CBC63] text-[#023A51] hover:bg-[#2CBC63] hover:text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <span>See Openings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Our Offices Section matching Ideas/AboutUs.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#023A51] tracking-tight">
            Our Offices<span className="text-[#2CBC63]">.</span>
          </h2>
          <p className="text-sm text-[#4A5259]">
            Headquartered in Kathmandu with active regional presence and global offshore support capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offices.map((office) => (
            <div
              key={office.city}
              className="bg-white rounded-2xl border border-[#E8EBEF] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 rounded bg-[#2CBC63]/10 text-[#2CBC63] text-[11px] font-bold">
                  {office.badge}
                </span>
                <h3 className="text-lg font-bold text-[#023A51]">{office.city}</h3>
                <div className="flex items-start gap-2 text-xs text-[#4A5259]">
                  <MapPin className="w-4 h-4 text-[#2CBC63] shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4A5259]">
                  <Phone className="w-4 h-4 text-[#59667D] shrink-0" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4A5259]">
                  <Mail className="w-4 h-4 text-[#59667D] shrink-0" />
                  <span>{office.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8EBEF]">
                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#023A51] hover:text-[#2CBC63] transition-colors"
                >
                  <span>Open in Maps / Inquire</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Bottom Consultation Banner matching Ideas/AboutUs.png */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#023A51] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
          {/* Subtle background glow */}
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
    </div>
  );
}
