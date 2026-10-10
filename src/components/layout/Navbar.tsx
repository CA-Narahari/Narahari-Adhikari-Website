'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const { settings, services } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [resourcesDropdown, setResourcesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  // Detect scroll to handle color change and stickiness strictly until hero section ends
  //
  // Behaviour contract:
  //   • At the very top (scrollY ≈ 0) → hero gradient bg, sticky
  //   • Scrolling within the hero     → white bg + shadow, still sticky
  //   • Past the hero section         → white bg, NOT sticky (relative)
  //
  const headerRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);

      const heroSection = document.getElementById('hero-section');
      const navHeight = headerRef.current?.offsetHeight || 80;

      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        // Stickiness ends when reaching the next section (hero bottom reaches navbar)
        setIsPastHero(rect.bottom <= navHeight);
      } else {
        // Pages without hero-section: un-stick after ~85% of viewport height
        setIsPastHero(scrollY > window.innerHeight * 0.85);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    const rafId = requestAnimationFrame(onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Approved navbar navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', hasDropdown: true },
    { name: 'Updates', href: '/updates' },
    { name: 'Resources', href: '/resources', hasDropdown: true },
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    ...(settings.careers_enabled
      ? [{ name: 'Careers', href: '/careers', isHiringBadge: true }]
      : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      ref={headerRef}
      style={{
        transform: isPastHero ? 'translateY(-100%)' : 'translateY(0)',
        transition:
          'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      className={`sticky top-0 z-50 w-full ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(2,58,81,0.08)] border-b border-[#E8EBEF]'
          : 'bg-hero-gradient border-b-0'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Desktop Header Layout */}
        <div className="hidden lg:flex items-stretch justify-between">
          {/* LEFT: Cleanly Proportioned Logo */}
          <div className="shrink-0 flex items-center pr-8 py-3.5">
            <Link href="/" className="flex items-center group">
              <Image
                src="/Logo.png"
                alt="Narahari Adhikari"
                width={280}
                height={70}
                priority
                className="h-[52px] xl:h-[58px] w-auto object-contain transition-transform duration-200 group-hover:opacity-95"
              />
            </Link>
          </div>

          {/* RIGHT: Two-tier layout with dividing line */}
          <div className="flex-1 flex flex-col justify-between pl-4">
            {/* Top Tier: Generous padding, crisp uppercase links on left, contacts on right */}
            <div className="flex items-center justify-between pt-5 pb-3 text-[12px] text-[#4A5259]">
              {/* Left: Quick links */}
              <div className="flex items-center gap-7 font-semibold tracking-[0.12em] uppercase text-[11px]">
                <Link
                  href="/updates"
                  className="hover:text-[#2CBC63] transition-colors duration-150"
                >
                  Updates
                </Link>
                {settings.careers_enabled && (
                  <Link
                    href="/careers"
                    className="hover:text-[#2CBC63] transition-colors duration-150 flex items-center gap-1.5"
                  >
                    <span>Careers</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2CBC63] animate-pulse" />
                  </Link>
                )}
                <Link
                  href="/about#faqs"
                  className="hover:text-[#2CBC63] transition-colors duration-150"
                >
                  FAQs
                </Link>
              </div>

              {/* Right: Phone + Email + Socials */}
              <div className="flex items-center gap-6">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-1.5 hover:text-[#2CBC63] transition-colors duration-150"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2CBC63]" />
                  <span className="font-semibold text-[#023A51] text-[12.5px]">{settings.phone}</span>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-1.5 hover:text-[#2CBC63] transition-colors duration-150"
                >
                  <Mail className="w-3.5 h-3.5 text-[#2CBC63]" />
                  <span className="font-medium text-[#4A5259] text-[12.5px]">Email Us</span>
                </a>

                {/* Social Icons */}
                <div className="flex items-center gap-3.5 ml-1 pl-4 border-l border-[#CCD7DC]">
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-[#59667D] hover:text-[#3B5998] transition-colors" aria-label="Facebook">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg>
                  </a>
                  <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-[#59667D] hover:text-[#023A51] transition-colors" aria-label="X / Twitter">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-[#59667D] hover:text-[#3F729B] transition-colors" aria-label="Instagram">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/ca-narahari-adhikari/" target="_blank" rel="noopener noreferrer" className="text-[#59667D] hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Divider Line under the top row */}
            <div className="border-b border-[#023A51]/15" />

            {/* Bottom Tier: Nav items with top and bottom indicator lines + CTA Button */}
            <div className="flex items-center justify-between py-3">
              {/* Nav links */}
              <nav className="flex items-center gap-7 xl:gap-8">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <div
                      key={item.name}
                      className="relative group py-2"
                      onMouseEnter={() => {
                        if (item.name === 'Services') setServicesDropdown(true);
                        if (item.name === 'Resources') setResourcesDropdown(true);
                      }}
                      onMouseLeave={() => {
                        if (item.name === 'Services') setServicesDropdown(false);
                        if (item.name === 'Resources') setResourcesDropdown(false);
                      }}
                    >
                      {/* Top Green Indicator Line */}
                      <span
                        className={`absolute top-0 left-0 right-0 h-[2px] bg-[#2CBC63] transition-all duration-200 ${
                          active
                            ? 'opacity-100 scale-x-100'
                            : 'opacity-0 scale-x-75 group-hover:opacity-100 group-hover:scale-x-100'
                        }`}
                      />

                      {item.name === 'Resources' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setResourcesDropdown((prev) => !prev);
                          }}
                          className={`flex items-center gap-1.5 text-[15px] font-medium tracking-normal transition-colors duration-150 cursor-pointer ${
                            pathname.startsWith('/resources')
                              ? 'text-[#023A51]'
                              : 'text-[#33475B] group-hover:text-[#023A51]'
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              resourcesDropdown
                                ? 'rotate-180 text-[#2CBC63]'
                                : 'text-[#7A889B] group-hover:text-[#023A51]'
                            }`}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`flex items-center gap-1.5 text-[15px] font-medium tracking-normal transition-colors duration-150 ${
                            active
                              ? 'text-[#023A51]'
                              : 'text-[#33475B] group-hover:text-[#023A51]'
                          }`}
                        >
                          <span>{item.name}</span>
                          {item.hasDropdown && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                item.name === 'Services' && servicesDropdown
                                  ? 'rotate-180 text-[#2CBC63]'
                                  : 'text-[#7A889B] group-hover:text-[#023A51]'
                              }`}
                            />
                          )}
                          {item.isHiringBadge && (
                            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#2CBC63]/15 text-[#2CBC63] rounded-full">
                              Hiring
                            </span>
                          )}
                        </Link>
                      )}

                      {/* Bottom Green Indicator Line */}
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#2CBC63] transition-all duration-200 ${
                          active
                            ? 'opacity-100 scale-x-100'
                            : 'opacity-0 scale-x-75 group-hover:opacity-100 group-hover:scale-x-100'
                        }`}
                      />

                      {/* Services Dropdown (2 Columns) */}
                      <AnimatePresence>
                        {item.name === 'Services' && servicesDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute top-full left-0 -translate-x-12 w-[600px] bg-white border border-[#E8EBEF] rounded-[16px] shadow-[0_18px_40px_rgba(2,58,81,0.12)] p-4 z-50 mt-1.5"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              {services.map((srv) => (
                                <Link
                                  key={srv.id}
                                  href={`/services/${srv.slug}`}
                                  onClick={() => setServicesDropdown(false)}
                                  className="group/item block p-3 rounded-[10px] text-[13px] text-[#33475B] hover:bg-[#E8F4F8] hover:text-[#023A51] transition-all duration-150"
                                >
                                  <div className="font-bold text-[#023A51] group-hover/item:text-[#2CBC63] transition-colors flex items-center justify-between">
                                    <span>{srv.title}</span>
                                    <span className="text-[11px] opacity-0 group-hover/item:opacity-100 transition-opacity text-[#2CBC63]">→</span>
                                  </div>
                                  <div className="text-[11.5px] text-[#7A889B] mt-0.5 leading-snug line-clamp-1">{srv.short_description}</div>
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-[#E8EBEF] mt-3 pt-3 flex items-center justify-between px-2">
                              <span className="text-[12px] text-[#7A889B]">
                                Explore all {services.length} services
                              </span>
                              <Link
                                href="/services"
                                onClick={() => setServicesDropdown(false)}
                                className="text-[12.5px] font-bold text-[#2CBC63] hover:text-[#25A456] transition-colors inline-flex items-center gap-1"
                              >
                                View all services &rarr;
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Resources Dropdown (2 Distinct Pages) */}
                      <AnimatePresence>
                        {item.name === 'Resources' && resourcesDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="absolute top-full left-0 -translate-x-16 w-[440px] bg-white border border-[#E8EBEF] rounded-[16px] shadow-[0_18px_40px_rgba(2,58,81,0.12)] p-4 z-50 mt-1.5"
                          >
                            <div className="space-y-2">
                              <Link
                                href="/resources/tools"
                                onClick={() => setResourcesDropdown(false)}
                                className="group/res block p-3.5 rounded-xl hover:bg-[#E8F4F8] transition-all"
                              >
                                <div className="font-bold text-[#023A51] group-hover/res:text-[#2CBC63] transition-colors flex items-center justify-between text-[13.5px]">
                                  <span>EMI Calculator</span>
                                  <span className="text-[11px] opacity-0 group-hover/res:opacity-100 transition-opacity text-[#2CBC63]">→</span>
                                </div>
                                <p className="text-[11.5px] text-[#7A889B] mt-1 leading-snug">
                                  Estimate loan installments and view the repayment schedule.
                                </p>
                              </Link>

                              <Link
                                href="/resources/downloads"
                                onClick={() => setResourcesDropdown(false)}
                                className="group/res block p-3.5 rounded-xl hover:bg-[#E8F4F8] transition-all"
                              >
                                <div className="font-bold text-[#023A51] group-hover/res:text-[#2CBC63] transition-colors flex items-center justify-between text-[13.5px]">
                                  <span>Portals & Downloads</span>
                                  <span className="text-[11px] opacity-0 group-hover/res:opacity-100 transition-opacity text-[#2CBC63]">→</span>
                                </div>
                                <p className="text-[11.5px] text-[#7A889B] mt-1 leading-snug">
                                  Official links and useful filing schedules.
                                </p>
                              </Link>
                            </div>


                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* Right: Green CTA button */}
              <div className="shrink-0 pl-6">
                <Link
                  href="/book-appointment"
                  className="px-6 py-2.5 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center cursor-pointer"
                >
                  Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="flex lg:hidden items-center justify-between h-[74px]">
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="Narahari Adhikari"
              width={200}
              height={50}
              priority
              className="h-[44px] w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              size="sm"
              className="bg-[#2CBC63] hover:bg-[#25A456] text-white rounded-[32px] text-[12px] font-bold px-3.5 h-8"
            >
              <Link href="/book-appointment">
                Consult
              </Link>
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-[8px] text-[#023A51] hover:bg-black/5 transition-colors duration-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden border-t border-[#CCD7DC] bg-white overflow-hidden shadow-lg"
          >
            <div className="px-6 pt-3 pb-6 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <div key={item.name} className="space-y-1">
                    {item.name === 'Resources' ? (
                      <button
                        type="button"
                        onClick={() => setResourcesDropdown((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-[8px] text-[15px] font-medium transition-colors duration-200 cursor-pointer ${
                          pathname.startsWith('/resources')
                            ? 'bg-[#9ec2c0]/30 text-[#023A51] border-l-4 border-[#2CBC63]'
                            : 'text-[#33475B] hover:bg-[#F8FAFC] hover:text-[#023A51]'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            resourcesDropdown ? 'rotate-180 text-[#2CBC63]' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-[8px] text-[15px] font-medium transition-colors duration-200 ${
                          active
                            ? 'bg-[#9ec2c0]/30 text-[#023A51] border-l-4 border-[#2CBC63]'
                            : 'text-[#33475B] hover:bg-[#F8FAFC] hover:text-[#023A51]'
                        }`}
                      >
                        <span>{item.name}</span>
                        {item.isHiringBadge && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-[#2CBC63]/15 text-[#2CBC63] rounded-full">
                            We Are Hiring
                          </span>
                        )}
                      </Link>
                    )}

                    {item.name === 'Resources' && resourcesDropdown && (
                      <div className="pl-6 space-y-1 pb-1">
                        <Link
                          href="/resources/tools"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-xs text-[#59667D] hover:text-[#023A51] hover:bg-slate-50 rounded-md"
                        >
                          &bull; EMI Calculator
                        </Link>
                        <Link
                          href="/resources/downloads"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-1.5 text-xs text-[#59667D] hover:text-[#023A51] hover:bg-slate-50 rounded-md"
                        >
                          &bull; Regulatory Portals & Downloads
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-4 border-t border-[#E8EBEF]">
                <Link
                  href="/book-appointment"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-center block text-sm shadow-sm"
                >
                  Free Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
