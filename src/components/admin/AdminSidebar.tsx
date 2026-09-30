'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  ReceiptText,
  BookOpen,
  Briefcase,
  Users,
  Building2,
  Megaphone,
  Landmark,
  Calendar,
  Clock,
  Settings,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { settings, toggleCareers } = useApp();

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Tax Articles', href: '/admin/tax-updates', icon: ReceiptText },
    { name: 'Blogs & Guides', href: '/admin/blog', icon: BookOpen },
    { name: 'Careers & Hiring', href: '/admin/careers', icon: Briefcase, badge: settings.careers_enabled ? 'ON' : 'OFF' },
    { name: 'Job Applications', href: '/admin/applications', icon: Users },
    { name: 'Services Manager', href: '/admin/services', icon: Building2 },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Govt Links & Downloads', href: '/admin/resources', icon: Landmark },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Office Hours', href: '/admin/office-hours', icon: Clock },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-[#023A51] border-r border-[#012C3D] text-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#2CBC63] flex items-center justify-center font-bold text-white">
              CA
            </div>
            <div>
              <div className="text-sm font-bold text-white leading-tight">CA Firm Admin</div>
              <div className="text-[11px] text-slate-300">Content and operations</div>
            </div>
          </div>
        </div>

        {/* Quick Master Switch: Careers Toggle */}
        <div className="p-4 mx-3 my-3 rounded-lg bg-white/10 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-white block">Careers Status</span>
              <span className="text-[10px] text-slate-300">
                {settings.careers_enabled ? 'Hiring Active on Navbar' : 'Hidden from Public Site'}
              </span>
            </div>
            <button
              onClick={() => toggleCareers()}
              className="p-1 focus:outline-none"
              title="Toggle Careers Page On/Off"
            >
              {settings.careers_enabled ? (
                <ToggleRight className="w-7 h-7 text-[#65BC7B]" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation items */}
      <nav className="px-3 py-2 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#2CBC63] text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      link.badge === 'ON'
                        ? 'bg-[#65BC7B] text-[#023A51]'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Strip */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Live Website</span>
        </Link>
        <div className="text-[10px] text-center text-slate-300 pt-1">
          CMS workspace • Version 1.0
        </div>
      </div>
    </aside>
  );
}
