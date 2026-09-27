'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Menu,
  X,
  Search,
  ArrowRight,
  Shield,
  ChevronDown,
  Lock,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { settings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Exact 8 items requested by user
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services', hasDropdown: true },
    { name: 'Tax Updates', href: '/tax-updates' },
    { name: 'Blog', href: '/blog' },
    { name: 'Resources', href: '/resources' },
    ...(settings.careers_enabled
      ? [{ name: 'Careers', href: '/careers', isHiringBadge: true }]
      : []),
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name (matching screenshots: "CA" in rounded square + Firm Name + "Chartered Accountant Firm") */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm transition-transform group-hover:scale-105">
              CA
            </div>
            <div>
              <div className="text-base sm:text-lg font-serif font-bold tracking-tight text-slate-900 leading-tight">
                {settings.company_name}
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide">
                Chartered Accountant Firm
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setServicesDropdown(true)}
                  onMouseLeave={() => item.hasDropdown && setServicesDropdown(false)}
                >
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 text-[13px] font-medium transition-colors rounded-md flex items-center gap-1 ${
                      active
                        ? 'text-[#F26430] font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    )}
                    {item.isHiringBadge && (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Hiring
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#F26430] rounded-full" />
                    )}
                  </Link>

                  {/* Services Mini Dropdown */}
                  {item.hasDropdown && servicesDropdown && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <Link
                        href="/services#tax-advisory-compliance"
                        className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#F26430]"
                      >
                        <div className="font-semibold">Tax & Compliance</div>
                        <div className="text-[11px] text-slate-400">Direct & indirect advisory</div>
                      </Link>
                      <Link
                        href="/services#audit-assurance"
                        className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#F26430]"
                      >
                        <div className="font-semibold">Audit & Assurance</div>
                        <div className="text-[11px] text-slate-400">Statutory & internal reviews</div>
                      </Link>
                      <Link
                        href="/services#accounting-business-advisory"
                        className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#F26430]"
                      >
                        <div className="font-semibold">Accounting & Bookkeeping</div>
                        <div className="text-[11px] text-slate-400">Financial controller services</div>
                      </Link>
                      <Link
                        href="/services#corporate-secretarial-legal"
                        className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#F26430]"
                      >
                        <div className="font-semibold">Corporate & Secretarial</div>
                        <div className="text-[11px] text-slate-400">Company registration & OCR</div>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Area: Search Trigger + Book Appointment Button (matching screenshots) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
              title="Search website"
              aria-label="Search website"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Discreet Admin CMS Link */}
            <Link
              href="/admin"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors text-xs flex items-center gap-1 font-medium"
              title="Admin CMS Portal"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline text-[11px]">CMS</span>
            </Link>

            {/* Primary CTA: Book Appointment (Matching screenshots: Coral Orange #F26430) */}
            <Link
              href="/book-appointment"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F26430] hover:bg-[#DC5322] text-white text-[13px] font-semibold rounded-lg shadow-sm transition-all hover:shadow active:translate-y-px"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/book-appointment"
              className="px-3 py-1.5 bg-[#F26430] text-white text-xs font-semibold rounded-md flex items-center gap-1"
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3 animate-in slide-in-from-top-1">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search services, tax circulars, articles, calculators..."
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-xl animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-orange-50 text-[#F26430] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{item.name}</span>
                {item.isHiringBadge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    We Are Hiring
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/book-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#F26430] text-white font-semibold rounded-lg text-sm"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 text-slate-600 hover:text-slate-900 text-xs font-medium border border-slate-200 rounded-lg"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin CMS Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
