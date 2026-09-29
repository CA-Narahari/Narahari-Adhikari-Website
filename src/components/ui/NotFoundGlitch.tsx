'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { Home, Briefcase } from 'lucide-react';

const NUMBERS = '0123456789404';
const SCRAMBLE_MS = 600;
const TICK_MS = 40;

export interface NotFoundProps {
  className?: string;
  code?: string;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}

export const NOT_FOUND_DEFAULTS = {
  code: '404',
  title: 'Page Not Found',
  description:
    'The page or financial record you are trying to access does not exist, has been removed, or has had its name changed.',
  homeHref: '/',
  homeLabel: 'Return to Home',
  browseHref: '/services',
  browseLabel: 'Our Services',
};

/**
 * Clean numeric scramble on mount that settles quickly into the 404 code,
 * styled to fit our institutional Chartered Accountant theme.
 */
function Scramble({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }
    const chars = text.split('');
    const start = performance.now();
    let raf = 0;
    let last = 0;

    const loop = (now: number) => {
      if (now - last >= TICK_MS) {
        last = now;
        const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
        const settled = Math.floor(progress * chars.length);
        setDisplay(
          chars
            .map((ch, i) =>
              i < settled || ch === ' '
                ? ch
                : NUMBERS[Math.floor(Math.random() * NUMBERS.length)]
            )
            .join('')
        );
      }
      if (now - start < SCRAMBLE_MS) {
        raf = requestAnimationFrame(loop);
      } else {
        setDisplay(text);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [text, reduce]);

  return <span className="tabular-nums font-extrabold tracking-tight">{display}</span>;
}

export function NotFoundStage({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 relative overflow-hidden bg-hero-gradient ${className}`}
    >
      {/* Soft decorative luminous aura matching Avada Accountant hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#2CBC63]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center space-y-6">
        {children}
      </div>
    </div>
  );
}

export function NotFoundActions({
  homeHref = NOT_FOUND_DEFAULTS.homeHref,
  homeLabel = NOT_FOUND_DEFAULTS.homeLabel,
  browseHref = NOT_FOUND_DEFAULTS.browseHref,
  browseLabel = NOT_FOUND_DEFAULTS.browseLabel,
}: {
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
      <Link
        href={homeHref}
        className="px-7 py-3 rounded-full bg-[#2CBC63] hover:bg-[#25A456] text-white font-bold text-[14.5px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span>{homeLabel}</span>
      </Link>
      <Link
        href={browseHref}
        className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#023A51] font-bold text-[14.5px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer border border-[#E8EBEF]"
      >
        <Briefcase className="w-4 h-4 text-[#2CBC63]" />
        <span>{browseLabel}</span>
      </Link>
    </div>
  );
}

export default function NotFoundGlitch({
  className = '',
  code = NOT_FOUND_DEFAULTS.code,
  title = NOT_FOUND_DEFAULTS.title,
  description = NOT_FOUND_DEFAULTS.description,
  homeHref = NOT_FOUND_DEFAULTS.homeHref,
  homeLabel = NOT_FOUND_DEFAULTS.homeLabel,
  browseHref = NOT_FOUND_DEFAULTS.browseHref,
  browseLabel = NOT_FOUND_DEFAULTS.browseLabel,
}: NotFoundProps) {
  return (
    <NotFoundStage className={className}>
      {/* Category Tag */}
      <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#E8EBEF] text-[#023A51] text-xs font-bold uppercase tracking-wider shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#2CBC63]" />
        Error 404
      </span>

      {/* Brand-Themed 404 Code with Subtle Dual-Layer Shadow */}
      <div className="group relative select-none font-sans font-extrabold leading-none tracking-tighter text-[#023A51] [font-size:clamp(5.5rem,18vw,10.5rem)] cursor-default">
        {/* Subtle Brand Green layer nudged on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-[#2CBC63] opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:translate-x-[4px] group-hover:opacity-40 motion-reduce:hidden"
        >
          <Scramble text={code} />
        </span>
        {/* Subtle Deep Teal layer nudged on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-[#023A51] opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:-translate-x-[4px] group-hover:opacity-30 motion-reduce:hidden"
        >
          <Scramble text={code} />
        </span>
        <h1 className="relative">
          <Scramble text={code} />
        </h1>
      </div>

      {/* Copy */}
      <div className="flex flex-col items-center gap-2 max-w-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#023A51] tracking-tight">
          {title}<span className="text-[#2CBC63]">.</span>
        </h2>
        <p className="text-sm sm:text-[15px] text-[#33475B] leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* Actions */}
      <NotFoundActions
        homeHref={homeHref}
        homeLabel={homeLabel}
        browseHref={browseHref}
        browseLabel={browseLabel}
      />
    </NotFoundStage>
  );
}
