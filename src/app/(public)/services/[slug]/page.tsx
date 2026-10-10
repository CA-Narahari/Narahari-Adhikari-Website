'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { serviceArticleHtml } from '@/lib/article-content';
import { normalizeMediaHtml, publicMediaUrl } from '@/lib/media-url';
import type { ServiceItem } from '@/types';
import { ArrowLeft, ArrowRight, Briefcase, FileText } from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const { settings, services } = useApp();
  const [directService, setDirectService] = useState<ServiceItem | null>(null);
  const [checkedSlug, setCheckedSlug] = useState('');
  const loading =
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) && checkedSlug !== slug;

  useEffect(() => {
    let active = true;
    const client = createSupabaseBrowserClient();
    if (!client || !slug)
      return () => {
        active = false;
      };
    void client
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(
        ({ data }) => {
          if (!active) return;
          setDirectService(data as ServiceItem | null);
          setCheckedSlug(slug);
        },
        () => {
          if (active) setCheckedSlug(slug);
        }
      );
    return () => {
      active = false;
    };
  }, [slug]);

  const service =
    services.find((item) => item.slug === slug) ||
    (directService?.slug === slug ? directService : null);

  if (!service && loading) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-6 text-sm text-[#4A5259]">
        Loading service article…
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <FileText className="mb-4 h-10 w-10 text-slate-300" />
        <h1 className="text-2xl font-bold text-[#023A51]">Service article not found</h1>
        <Link
          href="/services"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2CBC63] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </div>
    );
  }

  const articleHtml = serviceArticleHtml(service);
  const otherServices = services.filter((item) => item.slug !== service.slug).slice(0, 5);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.short_description,
    url: `/services/${slug}`,
    provider: { '@type': 'AccountingService', name: settings.company_name },
  };

  return (
    <article className="min-h-screen bg-[#FAFCFD] pb-24 text-[#023A51]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') }}
      />

      {/* 1. Header Section with Matching Gradient */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-12 sm:pt-10 sm:pb-14 border-b border-[#E8EBEF]/60 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#59667D] hover:text-[#023A51] transition mb-4"
          >
            <ArrowLeft className="h-4 w-4 text-[#2CBC63]" /> Back to Services
          </Link>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              {service.title}
            </h1>
            {service.short_description && (
              <p className="text-base sm:text-[17px] text-[#4A5259] leading-relaxed">
                {service.short_description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Main Body Grid */}
      <div className="max-w-[1240px] mx-auto px-6 pt-10 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.9fr)_minmax(320px,1fr)] gap-10 items-start">
          <main className="min-w-0">
            {service.image && (
              <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#E8EBEF] bg-slate-100 shadow-sm mb-8">
                <Image
                  src={publicMediaUrl(service.image) || service.image}
                  alt={service.image_alt || service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-cover"
                />
              </figure>
            )}

            <div
              className="cms-article-content prose prose-slate max-w-none text-[15px] leading-[1.85] text-[#33475B] prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#023A51] prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:border-[#E8EBEF] prose-h2:pb-2 prose-h2:text-[22px] prose-h3:mb-2 prose-h3:mt-6 prose-h3:text-lg prose-p:my-4 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-blockquote:border-l-4 prose-blockquote:border-[#2CBC63] prose-blockquote:pl-5 prose-blockquote:text-[#4A5259] prose-img:my-6 prose-img:rounded-xl prose-a:text-[#2CBC63] prose-a:font-semibold hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: normalizeMediaHtml(
                  articleHtml || '<p>Service details will be published here.</p>'
                ),
              }}
            />
          </main>

          {/* Sidebar: Only Services */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {otherServices.length > 0 && (
              <section className="rounded-2xl border border-[#E8EBEF] bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#E8EBEF] pb-4">
                  <h2 className="flex items-center gap-2 text-[15px] font-bold text-[#023A51]">
                    <Briefcase className="h-4 w-4 text-[#2CBC63]" /> Other Services
                  </h2>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#59667D] hover:text-[#2CBC63] transition-colors uppercase tracking-wider"
                  >
                    All Services <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {otherServices.map((related) => (
                    <Link
                      key={`service-${related.id || related.slug}`}
                      href={`/services/${related.slug}`}
                      className="group flex gap-3.5 items-start py-1"
                    >
                      <ArticleThumbnail src={related.image} alt={related.title} />
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[13px] font-bold text-[#023A51] group-hover:text-[#2CBC63] transition-colors leading-snug">
                          {related.title}
                        </h3>
                        <p className="mt-1 text-[11px] text-[#59667D] line-clamp-2 leading-relaxed">
                          {related.short_description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Quick Contact Box in Sidebar */}
            <div className="rounded-2xl bg-[#023A51] p-6 text-white shadow-sm space-y-3">
              <h3 className="text-base font-bold text-white">Need Advisory Assistance?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with Narahari Adhikari for confidential corporate consultations and statutory advisory.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#2CBC63] hover:bg-[#25a556] text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
                >
                  <span>Send an Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

function ArticleThumbnail({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative h-[68px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#EAF2F2] border border-[#E8EBEF]">
      {src ? (
        <Image
          src={publicMediaUrl(src) || src}
          alt={alt}
          fill
          sizes="76px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <FileText className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#8AA4A8]" />
      )}
    </div>
  );
}
