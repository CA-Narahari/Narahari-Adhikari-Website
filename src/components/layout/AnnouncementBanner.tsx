'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertCircle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Announcement } from '@/types';

export default function AnnouncementBanner() {
  const { announcements, announcementsLoaded } = useApp();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setDismissed(JSON.parse(sessionStorage.getItem('dismissed_site_notices') || '[]') as string[]); } catch { setDismissed([]); }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const now = Date.now();
  const visible = announcements.filter((item) => item.is_active && (!item.expires_at || new Date(item.expires_at).getTime() > now));
  const notice = ready ? visible.find((item) => !dismissed.includes(item.id)) : undefined;

  const dismiss = (item: Announcement) => {
    const next = [...dismissed, item.id];
    setDismissed(next);
    try { sessionStorage.setItem('dismissed_site_notices', JSON.stringify(next)); } catch { /* Browser storage may be disabled. */ }
  };

  if (!announcementsLoaded || !notice) return null;

  return <div role="dialog" aria-modal="true" aria-labelledby="site-notice-title" className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#062F35]/70 p-4 backdrop-blur-sm sm:p-6">
    <section className="relative my-auto w-full max-w-[560px] overflow-hidden rounded-[30px] shadow-[0_28px_90px_rgba(0,35,45,.38)]">
      <Image src="/important-notice-template.jpg" alt="" fill priority unoptimized sizes="(max-width: 640px) 100vw, 560px" className="object-fill" />
      <button type="button" onClick={() => dismiss(notice)} className="absolute right-[5%] top-[5%] z-20 grid size-9 place-items-center rounded-full bg-white/90 text-[#123F63] shadow-sm transition hover:bg-white" aria-label="Close announcement"><X className="size-5" /></button>
      <div className="relative z-10 flex aspect-square flex-col items-center px-[11%] pb-[12%] pt-[39%] text-center">
        {notice.poster_url && <div className="relative max-h-[47%] min-h-0 w-full flex-1 overflow-hidden rounded-xl">
          <Image src={notice.poster_url} alt={notice.title} fill unoptimized sizes="(max-width: 640px) 78vw, 430px" className="object-contain" />
        </div>}
        <div className={`${notice.poster_url ? 'mt-2' : 'flex-1'} flex min-h-0 w-full flex-col items-center justify-center overflow-y-auto px-2`}>
          <h2 id="site-notice-title" className="text-base font-bold leading-tight text-[#062E86] sm:text-lg">{notice.title}</h2>
          {notice.message && <p className="mt-2 max-w-full whitespace-pre-line text-xs font-medium leading-5 text-[#173A68] sm:text-sm sm:leading-6">{notice.message}</p>}
        </div>
        <span className="sr-only"><AlertCircle /> Important notice</span>
      </div>
    </section>
  </div>;
}
