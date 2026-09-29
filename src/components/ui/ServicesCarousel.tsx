'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/lib/services-data';

export default function ServicesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive items per view: 1 on mobile, 2 on tablet, 3 on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, servicesData.length - visibleCount);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Outer Slider Wrapper with Side Controls */}
      <div className="relative flex items-center">
        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          type="button"
          aria-label="Previous service"
          className="absolute -left-3 sm:-left-5 z-20 w-10 h-10 rounded-full border border-[#023A51]/40 bg-white/90 hover:bg-[#023A51] hover:text-white text-[#023A51] flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Carousel Viewport */}
        <div ref={containerRef} className="w-full overflow-hidden px-1 py-4">
          <div
            className="flex transition-transform duration-500 ease-out gap-5 sm:gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount + (visibleCount === 3 ? 0.7 : visibleCount === 2 ? 1 : 0))}%)`,
            }}
          >
            {servicesData.map((service) => (
              <div
                key={service.slug}
                className="shrink-0 flex flex-col"
                style={{
                  width: `calc(${100 / visibleCount}% - ${
                    visibleCount === 3 ? '16px' : visibleCount === 2 ? '12px' : '0px'
                  })`,
                }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex flex-col h-full bg-[#E5F1F6] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-white/60"
                >
                  {/* Service Top Image (matching reference photo) */}
                  <div className="relative h-[210px] sm:h-[220px] w-full overflow-hidden bg-slate-200 shrink-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Service Bottom Details (pale light-blue matching reference image) */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#E5F1F6]">
                    <div>
                      <h3 className="text-[18px] sm:text-[19px] font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-[13px] sm:text-[13.5px] text-[#1D5367] leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Explore Link + Yellow Arrow Circle */}
                    <div className="mt-6 flex items-center gap-2">
                      <span className="text-[13.5px] font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors">
                        Explore
                      </span>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFD000] flex items-center justify-center text-[#023A51] shadow-xs group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          type="button"
          aria-label="Next service"
          className="absolute -right-3 sm:-right-5 z-20 w-10 h-10 rounded-full border border-[#023A51]/40 bg-white/90 hover:bg-[#023A51] hover:text-white text-[#023A51] flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? 'w-7 h-2 bg-[#023A51]'
                : 'w-2 h-2 bg-[#023A51]/25 hover:bg-[#023A51]/50'
            }`}
            aria-label={`Go to slide group ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
