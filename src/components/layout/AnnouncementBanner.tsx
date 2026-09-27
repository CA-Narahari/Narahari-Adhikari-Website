'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function AnnouncementBanner() {
  const { settings } = useApp();

  if (!settings.announcement_active || !settings.announcement_text) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-amber-300 text-xs md:text-sm py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-200 line-clamp-1">{settings.announcement_text}</span>
        </div>
        {settings.announcement_link && (
          <Link
            href={settings.announcement_link}
            className="shrink-0 flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors underline-offset-4 hover:underline"
          >
            <span>Read Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
