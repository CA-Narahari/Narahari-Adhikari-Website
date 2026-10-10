'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Megaphone, X, Check } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { Announcement } from '@/types';

export default function AnnouncementBanner() {
  const { announcements, announcementsLoaded } = useApp();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setDismissed(JSON.parse(sessionStorage.getItem('dismissed_site_notices') || '[]') as string[]);
      } catch {
        setDismissed([]);
      }
      setCurrentTime(Date.now());
      setReady(true);
    }, 0);
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 60_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  const visible = currentTime === null ? [] : announcements.filter((item) => {
    if (!item.is_active) return false;
    if (item.expires_at && new Date(item.expires_at).getTime() <= currentTime) return false;

    // Scope targeting: all_pages vs specific_page
    if (item.display_location === 'home_page') {
      return pathname === '/';
    }
    if (item.display_location === 'specific_page' && item.target_path) {
      const target = item.target_path.trim().toLowerCase();
      const current = (pathname || '/').toLowerCase();
      return current === target || current === `${target}/` || (target !== '/' && current.startsWith(`${target}/`));
    }
    return true;
  });
  const notice = ready ? visible.find((item) => !dismissed.includes(item.id)) : undefined;

  const dismiss = (item: Announcement) => {
    const next = [...dismissed, item.id];
    setDismissed(next);
    try {
      sessionStorage.setItem('dismissed_site_notices', JSON.stringify(next));
    } catch {
      /* Browser storage may be disabled. */
    }
  };

  if (!announcementsLoaded || !notice) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-notice-title"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#023A51]/70 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* MODE A: Custom Uploaded Poster Image */}
      {notice.poster_url ? (
        <section className="relative my-auto w-full max-w-[580px] overflow-hidden rounded-[28px] sm:rounded-[32px] border border-[#DCE4EC] bg-white shadow-[0_28px_80px_rgba(2,58,81,0.35)] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          {/* Floating Close Button */}
          <button
            type="button"
            onClick={() => dismiss(notice)}
            className="absolute right-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-white/95 text-[#023A51] shadow-md transition-all hover:bg-white hover:scale-105 active:scale-95 border border-slate-200 cursor-pointer"
            aria-label="Close announcement"
          >
            <X className="size-4" />
          </button>

          {/* Top Header Badge Strip */}
          <div className="bg-[#023A51] px-6 py-3.5 flex items-center gap-2 text-white shrink-0">
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400">
              <Megaphone className="size-3.5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[.15em] text-emerald-300">
              Official Announcement
            </span>
          </div>

          {/* Poster Image (Centered, Responsive, Never Distorted) */}
          <div className="relative w-full h-[260px] sm:h-[320px] bg-gradient-to-b from-[#0B2533] to-[#04141C] flex items-center justify-center overflow-hidden border-b border-[#DCE4EC] shrink-0">
            <Image
              src={notice.poster_url}
              alt={notice.title || 'Official Announcement Poster'}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 580px"
              className="object-contain p-2"
              priority
            />
          </div>

          {/* Notice Details */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
            <div>
              <h2
                id="site-notice-title"
                className="text-2xl sm:text-[26px] font-bold text-[#023A51] leading-snug tracking-tight font-serif"
              >
                {notice.title}
              </h2>
            </div>

            {notice.message && (
              <p className="text-sm sm:text-[15px] leading-relaxed text-[#33475B] whitespace-pre-line font-normal">
                {notice.message}
              </p>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => dismiss(notice)}
                className="w-full py-3 px-6 rounded-full bg-[#023A51] hover:bg-[#034B68] text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="size-4 text-emerald-400" />
                <span>Acknowledge &amp; Continue</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* MODE B: Text Notice adjusted directly onto the Built-in Codebase Template */
        <section className="relative my-auto w-full max-w-[540px] overflow-hidden rounded-[28px] sm:rounded-[32px] border border-[#DCE4EC] bg-white shadow-[0_28px_80px_rgba(2,58,81,0.38)] animate-in zoom-in-95 duration-200 aspect-square flex flex-col">
          {/* Background Template from codebase */}
          <Image
            src="/important-notice-template.jpg"
            alt="Official Notice"
            fill
            priority
            unoptimized
            className="object-cover"
          />

          {/* Floating Close Button */}
          <button
            type="button"
            onClick={() => dismiss(notice)}
            className="absolute right-4 top-4 z-30 grid size-9 place-items-center rounded-full bg-white/95 text-[#023A51] shadow-md transition-all hover:bg-white hover:scale-105 active:scale-95 border border-slate-200 cursor-pointer"
            aria-label="Close announcement"
          >
            <X className="size-4" />
          </button>

          {/* Texts adjusted into the rounded rectangular frame of the template */}
          <div className="relative z-10 flex flex-col justify-between h-full pt-[35%] pb-[14%] px-[11%]">
            <div className="flex-1 overflow-y-auto px-2 flex flex-col justify-center text-center">
              <h2
                id="site-notice-title"
                className="text-lg sm:text-[22px] font-extrabold text-[#062E86] leading-snug tracking-tight"
              >
                {notice.title}
              </h2>

              {notice.message && (
                <p className="mt-3 text-xs sm:text-[14px] font-medium leading-relaxed text-[#173A68] whitespace-pre-line max-w-full">
                  {notice.message}
                </p>
              )}
            </div>

            <div className="pt-3 px-4">
              <button
                type="button"
                onClick={() => dismiss(notice)}
                className="w-full py-2.5 px-5 rounded-full bg-[#062E86] hover:bg-[#083D9E] text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Acknowledge Notice
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
