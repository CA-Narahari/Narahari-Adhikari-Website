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
  Check,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MagicRings from '@/components/ui/MagicRings';
import ServicesCarousel from '@/components/ui/ServicesCarousel';
import { servicesData } from '@/lib/services-data';

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
      <section id="hero-section" className="relative bg-hero-gradient pt-8 pb-16 lg:pt-14 lg:pb-12 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6 lg:pb-6 text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#022A3A] leading-[1.12] tracking-tight">
                Secure your financial future with Narahari Adhikari<span className="text-[#2CBC63]">.</span>
              </h1>

              <p className="text-base sm:text-[17.5px] text-[#16384C] font-normal leading-relaxed max-w-xl">
                Premier Chartered Accountants licensed by ICAN Nepal, providing high-integrity statutory audits, corporate tax strategy, and institutional business advisory across Nepal.
              </p>

              {/* Action Buttons: Clean Pill Style Matching Avada Reference */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/book-appointment"
                  className="px-7 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-[15px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
                >
                  Free Consultation
                </Link>

                <Link
                  href="/services"
                  className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#023A51] font-bold text-[15px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center cursor-pointer border border-white/80"
                >
                  Our Services
                </Link>
              </div>
            </motion.div>

            {/* Right Component: Centered Profile Picture with MagicRings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 flex items-center justify-center relative py-4 lg:py-6"
            >
              <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] h-[440px] sm:h-[480px] lg:h-[510px] flex items-center justify-center">
                {/* MagicRings Component as interactive background aura */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto overflow-visible">
                  <div className="w-[520px] h-[520px] sm:w-[580px] sm:h-[580px] lg:w-[620px] lg:h-[620px] shrink-0">
                    <MagicRings
                      color="#ffffff"
                      colorTwo="#2CBC63"
                      ringCount={5}
                      speed={0.7}
                      attenuation={14}
                      lineThickness={2.2}
                      baseRadius={0.34}
                      radiusStep={0.09}
                      scaleRate={0.07}
                      opacity={0.9}
                      blur={0}
                      noiseAmount={0}
                      rotation={-15}
                      ringGap={1.4}
                      fadeIn={0.6}
                      fadeOut={0.4}
                      followMouse={true}
                      mouseInfluence={0.25}
                      hoverScale={1.12}
                      parallax={0.04}
                      clickBurst={true}
                      alphaMode="coverage"
                    />
                  </div>
                </div>

                {/* Profile Picture centered */}
                <div className="relative z-10 flex items-center justify-center pointer-events-none">
                  <Image
                    src="/profile-picture.png?v=fresh2"
                    alt="CA Narahari Adhikari - Chartered Accountant Nepal"
                    width={450}
                    height={520}
                    unoptimized={true}
                    priority
                    className="w-auto h-[380px] sm:h-[430px] lg:h-[470px] object-contain drop-shadow-2xl select-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Practice Areas & Services Carousel */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-[38px] font-bold text-[#023A51] tracking-tight leading-tight">
              Our Professional Services<span className="text-[#2CBC63]">.</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[13.5px] font-bold text-[#023A51] hover:text-[#2CBC63] transition-all shadow-xs border border-[#E8EBEF] inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 text-[#2CBC63]" />
          </Link>
        </div>

        <div>
          <ServicesCarousel />
        </div>
      </section>

      {/* 3. Improvised Contact & Consultation Section */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-[#023A51] rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-14 text-white shadow-xl relative overflow-hidden">
          {/* Subtle luminous ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2CBC63]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63] block">
                  Get in Touch
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Consult with CA Narahari Adhikari<span className="text-[#2CBC63]">.</span>
                </h2>
                <p className="text-[14.5px] text-slate-300 leading-relaxed font-normal">
                  Schedule an advisory session to review your statutory audit compliance, tax assessments, or corporate matters in Nepal.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-5 text-sm">
                {/* Office */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2CBC63]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[14px]">Firm Office</div>
                    <div className="text-xs sm:text-[13px] text-slate-300 mt-1 leading-relaxed">
                      {settings.address}
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2CBC63]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[14px]">Direct Channels</div>
                    <div className="text-xs sm:text-[13px] text-slate-300 mt-1 space-y-1">
                      <a href={`mailto:${settings.email}`} className="hover:text-[#2CBC63] transition-colors block">
                        {settings.email}
                      </a>
                      <a href={`tel:${settings.phone}`} className="hover:text-[#2CBC63] transition-colors block">
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Open Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#2CBC63]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[14px]">Office Hours</div>
                    <div className="text-xs sm:text-[13px] text-slate-300 mt-1 leading-relaxed">
                      Sunday &ndash; Friday: 10:00 AM &ndash; 5:00 PM<br />
                      Saturday: Closed (Appointments Available)
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Link */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20CA%20Team%2C%20I%20would%20like%20to%20consult%20regarding%20tax%20and%20audit%20in%20Nepal.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2CBC63]/20 hover:bg-[#2CBC63]/30 text-[#8BE0A8] text-xs font-semibold border border-[#2CBC63]/30 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-[#2CBC63]" />
                  <span>Immediate query? Chat directly on WhatsApp &rarr;</span>
                </a>
              </div>
            </div>

            {/* Right Consultation Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-9 text-[#33475B] shadow-2xl">
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 bg-[#2CBC63]/20 rounded-full flex items-center justify-center mx-auto text-[#2CBC63]">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#023A51]">Consultation Requested</h3>
                    <p className="text-xs sm:text-sm text-[#59667D] max-w-md mx-auto leading-relaxed">
                      Thank you, {formData.name}. Our practice coordinator will review your request and contact you at {formData.phone} within one business day.
                    </p>
                    <Button
                      onClick={() => setFormSubmitted(false)}
                      variant="outline"
                      size="sm"
                      className="mt-4 rounded-full"
                    >
                      Submit Another Query
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Full Name <span className="text-[#2CBC63]">*</span>
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          className="h-11 rounded-[10px] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Phone Number <span className="text-[#2CBC63]">*</span>
                        </label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(+977) 98XXXXXXXX"
                          className="h-11 rounded-[10px] text-sm"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Service */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Email Address <span className="text-[#2CBC63]">*</span>
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className="h-11 rounded-[10px] text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                          Practice Area <span className="text-[#2CBC63]">*</span>
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="flex h-11 w-full rounded-[10px] border border-[#E8EBEF] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#023A51] transition-all duration-200 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2CBC63]/40 focus-visible:border-[#2CBC63]"
                        >
                          {servicesData.map((s) => (
                            <option key={s.slug} value={s.title}>
                              {s.shortTitle}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Subject */}
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                        Subject
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Tax Planning / Statutory Audit Inquiry"
                        className="h-11 rounded-[10px] text-sm"
                      />
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label className="block text-xs font-bold text-[#023A51] mb-1.5">
                        Consultation Requirement
                      </label>
                      <Textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe your entity, industry, or specific audit/tax mandate..."
                        className="rounded-[10px] text-sm"
                      />
                    </div>

                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-6 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Request Consultation
                      </button>
                      <div className="text-center pt-1">
                        <Link
                          href="/book-appointment"
                          className="text-xs font-semibold text-[#023A51] hover:text-[#2CBC63] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>Prefer instant online scheduling? Book on Calendly &rarr;</span>
                        </Link>
                      </div>
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
