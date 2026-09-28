'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  Calendar,
  ArrowRight,
  Shield,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function ContactPage() {
  const { settings, officeHours } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Tax Advisory');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 overflow-x-hidden">
      {/* 1. Hero Section with light aqua gradient */}
      <section className="relative bg-hero-gradient pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#023A51] leading-[1.12] tracking-tight">
              Get in touch with our team<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#33475B] font-normal leading-relaxed max-w-2xl">
              Whether you need corporate tax counsel, statutory audit support, or offshore accounting solutions, we are here to help. Reach out directly or send us an inquiry.
            </p>
          </div>

          {/* 3 Trust Badges */}
          <div className="mt-10 pt-6 border-t border-white/60 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-[#2CBC63] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#023A51]">Prompt Response</div>
                <div className="text-[#59667D]">Within 24 business hours</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-[#023A51] shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#023A51]">Confidential Advisory</div>
                <div className="text-[#59667D]">Direct partner oversight</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center text-[#2CBC63] shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#023A51]">ICAN Certified</div>
                <div className="text-[#59667D]">Reg. No. 1024/2078</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E8EBEF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <h3 className="text-xl font-bold text-[#023A51]">Headquarters</h3>

              <div className="space-y-5 text-xs text-[#33475B]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#023A51] block text-sm">Direct Line</span>
                    <a href={`tel:${settings.phone}`} className="hover:text-[#2CBC63] transition-colors block mt-0.5">
                      {settings.phone}
                    </a>
                    <span className="text-[11px] text-[#59667D] block mt-0.5">
                      Sunday – Friday, 9:30 AM – 5:30 PM
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#023A51] block text-sm">Official Email</span>
                    <a href={`mailto:${settings.email}`} className="hover:text-[#2CBC63] transition-colors block mt-0.5">
                      {settings.email}
                    </a>
                    <span className="text-[11px] text-[#59667D] block mt-0.5">
                      Official client & corporate correspondence
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#023A51] block text-sm">Kathmandu Office</span>
                    <span className="block mt-0.5 text-[#4A5259]">
                      {settings.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#2CBC63]/10 text-[#2CBC63] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#023A51] block text-sm">Office Hours</span>
                    <span className="block mt-0.5 text-[#4A5259]">
                      {settings.office_hours_summary}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct chat link */}
              <div className="pt-4 border-t border-[#E8EBEF]">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%20CA%20Narahari%20Adhikari%2C%20I%20have%20an%20inquiry%20regarding%20accounting%20and%20tax%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E8EBEF] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="mb-6 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
                  Inquiry Form
                </span>
                <h2 className="text-2xl font-extrabold text-[#023A51]">
                  How can we help your business<span className="text-[#2CBC63]">?</span>
                </h2>
                <p className="text-xs text-[#59667D]">
                  Submit your details below and our practice partner will follow up.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-[#2CBC63]/10 border border-[#2CBC63]/30 rounded-xl space-y-3">
                  <CheckCircle className="w-10 h-10 text-[#2CBC63] mx-auto" />
                  <h3 className="text-lg font-bold text-[#023A51]">Message Successfully Sent</h3>
                  <p className="text-xs text-[#33475B] leading-relaxed max-w-sm mx-auto">
                    Thank you, {name}. Your inquiry has been routed to our practice partners. We will reach you at {email}.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2 bg-[#023A51] text-white rounded-lg text-xs font-semibold hover:bg-[#034e6d] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#023A51] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#023A51] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#023A51] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+977 98..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#023A51] mb-1.5">
                        Service Practice Area
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                      >
                        <option value="Tax Advisory">Tax Planning & IRD Compliance</option>
                        <option value="Audit & Assurance">Statutory Audit / NSA</option>
                        <option value="Accounting & Bookkeeping">Accounting & Cloud Bookkeeping</option>
                        <option value="Offshore BPO">Offshore BPO & International Accounting</option>
                        <option value="Company Registration">Company Registration / OCR</option>
                        <option value="General Inquiry">General Firm Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#023A51] mb-1.5">
                      Message / Requirements *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Briefly describe your entity, tax inquiry, or statutory audit timeline..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#023A51] focus:ring-1 focus:ring-[#2CBC63] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
