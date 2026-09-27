'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  Search,
  Plus,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';

export default function AdminHeader() {
  const { settings } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded">
          {settings.company_name}
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-500 font-mono">
          Staff Console
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Website Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <span>Open Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs">
            CA
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900">Admin Staff</div>
            <div className="text-[10px] text-slate-500">Managing Partner</div>
          </div>
        </div>
      </div>
    </header>
  );
}
