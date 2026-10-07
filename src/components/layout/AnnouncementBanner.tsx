'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AlertCircle, Bell, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Announcement } from '@/types';

function appliesToPage(item: Announcement, pathname: string): boolean {
  if (item.display_location === 'all_pages') return true;
  if (item.display_location === 'home_page') return pathname === '/';
  return item.display_location === 'specific_page' && (item.target_path || '/') === pathname;
}

export default function AnnouncementBanner() {
  const pathname = usePathname();
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
  const visible = announcements.filter((item) => item.is_active && appliesToPage(item, pathname) && (!item.expires_at || new Date(item.expires_at).getTime() > now));
  const textNotices = visible.filter((item) => !item.poster_url);
  const poster = ready ? visible.find((item) => item.poster_url && !dismissed.includes(item.id)) : undefined;

  const dismiss = (item: Announcement) => {
    const next = [...dismissed, item.id]; setDismissed(next);
    try { sessionStorage.setItem('dismissed_site_notices', JSON.stringify(next)); } catch { /* Browser storage may be disabled. */ }
  };

  return <>
    {announcementsLoaded && textNotices.length > 0 && <div className="border-b border-[#C8E7D4] bg-[#EAF8F1] text-[#0B4B4C]" aria-label="Announcements">
      <div className="mx-auto flex max-w-[1280px] flex-col divide-y divide-[#D2EADF] px-5 sm:px-6">
        {textNotices.map((notice) => <div key={notice.id} className="flex min-h-11 items-center gap-3 py-2.5 text-sm">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-[#168A4A]"><AlertCircle className="size-4" /></span>
          <p className="min-w-0 flex-1"><strong className="mr-2 font-semibold">{notice.title}</strong><span className="text-[#456564]">{notice.message}</span></p>
        </div>)}
      </div>
    </div>}

    {poster && <div role="dialog" aria-modal="true" aria-labelledby="site-notice-title" className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#062F35]/65 p-4 backdrop-blur-sm">
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#D9E8E1] bg-[#FCFDFC] shadow-2xl">
        <div className="h-1.5 bg-gradient-to-r from-[#0B4B4C] via-[#2CBC63] to-[#0B4B4C]" />
        <div className="flex items-center justify-between border-b border-[#E8EFEA] px-5 py-4 sm:px-7"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#168A4A]"><Bell className="size-4" />Notice</span><button type="button" onClick={() => dismiss(poster)} className="grid size-9 place-items-center rounded-full border border-[#E1E9E5] text-[#536866] transition hover:bg-[#F2F7F4]" aria-label="Close notice"><X className="size-4" /></button></div>
        <div className="p-4 sm:p-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#EAF3F0]">{poster.poster_url && <Image src={poster.poster_url} alt={poster.title} fill unoptimized sizes="(max-width: 768px) 100vw, 640px" className="object-contain" />}</div>
          <h2 id="site-notice-title" className="mt-5 text-xl font-bold tracking-tight text-[#073E43] sm:text-2xl">{poster.title}</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#526A67]">{poster.message}</p>
          <div className="mt-5 flex justify-end"><button type="button" onClick={() => dismiss(poster)} className="min-h-10 rounded-full bg-[#20B866] px-5 text-sm font-bold text-white transition hover:bg-[#159A53]">Close notice</button></div>
        </div>
      </div>
    </div>}
  </>;
}
