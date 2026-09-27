'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  MessageSquare,
  Shield,
  FileCheck,
  Send,
} from 'lucide-react';

export default function Footer() {
  const { settings, officeHours } = useApp();
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Firm Overview (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-serif text-lg font-bold">
                CA
              </div>
              <div>
                <div className="text-slate-900 font-serif font-bold text-base leading-tight">
                  {settings.company_name}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Chartered Accountant Firm • {settings.ca_reg_number}
                </div>
              </div>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed pr-6">
              Regulated chartered accountancy practice providing specialized corporate tax advisory, statutory assurance, internal audits, and company secretarial compliance in Nepal.
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#F26430] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F26430] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#F26430] transition-colors">Services</Link>
              </li>
              {settings.careers_enabled && (
                <li>
                  <Link href="/careers" className="text-emerald-700 font-semibold hover:underline">
                    Careers (Hiring)
                  </Link>
                </li>
              )}
              <li>
                <Link href="/contact" className="hover:text-[#F26430] transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/book-appointment" className="text-[#F26430] font-semibold hover:underline">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Resources & Updates
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tax-updates" className="hover:text-[#F26430] transition-colors">Tax Updates & Directives</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#F26430] transition-colors">Knowledge Center & Blog</Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#F26430] transition-colors">Financial Calculators</Link>
              </li>
              <li>
                <Link href="/resources#downloads" className="hover:text-[#F26430] transition-colors">Statutory Forms & Checklists</Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#F26430] transition-colors">Government Directories</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Get the Latest Updates
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Subscribe to our newsletter and never miss important tax circulars and financial deadlines.
            </p>

            {subscribed ? (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-xs">
                ✓ Subscribed successfully!
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="space-y-2 text-xs"
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-[#F26430] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#F26430] hover:bg-[#DC5322] text-white font-semibold rounded-lg transition-colors text-xs shadow-xs"
                >
                  Subscribe →
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div>Phone: <a href={`tel:${settings.phone}`} className="text-slate-700 hover:text-slate-900">{settings.phone}</a></div>
              <div>Office: {settings.address}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.company_name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms & Conditions</Link>
            <Link href="/admin" className="hover:text-[#F26430] transition-colors font-semibold">Staff Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
