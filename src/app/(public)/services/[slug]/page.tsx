'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { getArticleHeadings, serviceArticleHtml } from '@/lib/article-content';
import type { BlogPost, ServiceItem } from '@/types';
import { ArrowLeft, ArrowRight, Building, FileText, List, UserRound } from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const { settings, services, blogPosts } = useApp();
  const [directService, setDirectService] = useState<ServiceItem | null>(null);
  const [checkedSlug, setCheckedSlug] = useState('');
  const loading = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) && checkedSlug !== slug;

  useEffect(() => {
    let active = true;
    const client = createSupabaseBrowserClient();
    if (!client || !slug) return () => { active = false; };
    void client.from('services').select('*').eq('slug', slug).maybeSingle().then(({ data }) => {
      if (!active) return;
      setDirectService(data as ServiceItem | null);
      setCheckedSlug(slug);
    }, () => {
      if (active) setCheckedSlug(slug);
    });
    return () => { active = false; };
  }, [slug]);

  const service = services.find((item) => item.slug === slug) || (directService?.slug === slug ? directService : null);

  if (!service && loading) {
    return <div className="mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-6 text-sm text-[#688093]">Loading service article…</div>;
  }

  if (!service) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <FileText className="mb-4 h-10 w-10 text-slate-300" />
        <h1 className="text-2xl font-bold text-[#073F50]">Service article not found</h1>
        <Link href="/services" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#168A4A]">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>
      </div>
    );
  }

  const articleHtml = serviceArticleHtml(service);
  const headings = getArticleHeadings(articleHtml);
  const relatedPosts: BlogPost[] = blogPosts.filter((post) => post.status === 'published').slice(0, 2);
  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, Math.max(0, 4 - relatedPosts.length));
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.short_description,
    url: `/services/${slug}`,
    provider: { '@type': 'AccountingService', name: settings.company_name },
  };

  return (
    <article className="min-h-screen bg-[#F8FBFA] pb-20 text-[#073F50]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-start gap-8 px-5 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,1.9fr)_minmax(340px,1fr)] lg:gap-8">
        <main className="min-w-0">
          <Link href="/services" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#668092] transition hover:text-[#073F50]">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Link>

          <header className="mt-7">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E5F5EF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#078652]">
              <Building className="h-3.5 w-3.5" /> Practice Service
            </span>
            <h1 className="mt-3 max-w-3xl text-[32px] font-bold leading-[1.22] tracking-[-0.025em] text-[#073F50] sm:text-[36px]">{service.title}</h1>
            {service.short_description && <p className="mt-3.5 max-w-3xl text-[15px] leading-[1.7] text-[#668092]">{service.short_description}</p>}
          </header>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-[#E1E9E9] pb-4 text-[11px] text-[#698393] sm:text-xs">
            <span className="inline-flex items-center gap-2"><Building className="h-4 w-4 text-[#168A73]" /> Professional Services</span>
            <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-[#168A73]" />{settings.company_name}</span>
          </div>

          {service.image && <figure className="relative mt-6 aspect-[4/3] overflow-hidden rounded-lg border border-[#E2EAED] bg-slate-100 sm:aspect-[8/3]">
            <Image src={service.image} alt={service.title} fill priority sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
          </figure>}

          <div className="cms-article-content prose prose-slate mt-5 max-w-none text-[15px] leading-[1.85] text-[#5B7485] prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#073F50] prose-h2:mb-3 prose-h2:mt-8 prose-h2:border-b prose-h2:border-[#E5ECEF] prose-h2:scroll-mt-28 prose-h2:pb-2 prose-h2:text-[21px] prose-h3:mb-2 prose-h3:mt-6 prose-h3:scroll-mt-28 prose-h3:text-lg prose-p:my-4 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1.5 prose-blockquote:border-l-4 prose-blockquote:border-[#28B76A] prose-blockquote:pl-5 prose-blockquote:text-[#547083] prose-img:my-6 prose-img:rounded-lg prose-a:text-[#168A4A] prose-a:underline" dangerouslySetInnerHTML={{ __html: articleHtml || '<p>Service details will be published here.</p>' }} />
        </main>

        <aside className="space-y-6 lg:sticky lg:top-24">
          {headings.length > 0 && <nav aria-label="Service article table of contents" className="rounded-xl border border-[#E5ECEF] bg-white p-6 shadow-[0_8px_28px_rgba(7,63,80,0.04)]">
            <h2 className="flex items-center gap-2 border-b border-[#EDF1F3] pb-4 text-[15px] font-semibold"><List className="h-4 w-4 text-[#168A73]" /> Table of Contents</h2>
            <ol className="mt-2 space-y-0.5">
              {headings.map((heading, index) => <li key={heading.id} className={heading.level === 3 ? 'pl-5' : ''}>
                <a href={`#${heading.id}`} className="flex items-start gap-3 rounded-lg px-1.5 py-2.5 text-[12px] leading-5 text-[#3E5C6D] transition hover:bg-[#F0F8F5] hover:text-[#0B7358]">
                  {heading.level === 2 && <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DDF3EA] text-[10px] font-semibold text-[#168A73]">{headings.slice(0, index + 1).filter((item) => item.level === 2).length}</span>}
                  <span>{heading.text}</span>
                </a>
              </li>)}
            </ol>
          </nav>}

          {(relatedPosts.length > 0 || relatedServices.length > 0) && <section className="rounded-xl border border-[#E5ECEF] bg-white p-6 shadow-[0_8px_28px_rgba(7,63,80,0.04)]">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#EDF1F3] pb-4">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold"><FileText className="h-4 w-4 text-[#168A73]" /> Recent Articles</h2>
              <Link href="/blog" className="inline-flex items-center gap-1 text-[11px] font-medium text-[#608092] hover:text-[#168A4A]">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="space-y-4">
              {relatedPosts.map((related) => <Link key={`post-${related.id}`} href={`/blog/${related.slug}`} className="group flex gap-3">
                <ArticleThumbnail src={related.featured_image} alt="" />
                <div className="min-w-0 py-1">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7F9BAA]">{related.category || 'Blog Article'}</span>
                  <h3 className="mt-1 line-clamp-2 text-[12px] font-medium leading-[1.45] text-[#17495B] group-hover:text-[#168A4A]">{related.title}</h3>
                  <p className="mt-1 text-[10px] text-[#8398A4]">{related.read_time || ''}</p>
                </div>
              </Link>)}
              {relatedServices.map((related) => <Link key={`service-${related.id}`} href={`/services/${related.slug}`} className="group flex gap-3">
                <ArticleThumbnail src={related.image} alt="" />
                <div className="min-w-0 py-1">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7F9BAA]">Service Article</span>
                  <h3 className="mt-1 line-clamp-2 text-[12px] font-medium leading-[1.45] text-[#17495B] group-hover:text-[#168A4A]">{related.title}</h3>
                  <p className="mt-1 text-[10px] text-[#8398A4]">Read service details</p>
                </div>
              </Link>)}
            </div>
          </section>}
        </aside>
      </div>
    </article>
  );
}

function ArticleThumbnail({ src, alt }: { src?: string; alt: string }) {
  return <div className="relative h-[76px] w-[84px] shrink-0 overflow-hidden rounded-lg bg-[#EAF2F2]">
    {src ? <Image src={src} alt={alt} fill sizes="84px" className="object-cover transition duration-300 group-hover:scale-105" /> : <FileText className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-[#8AA4A8]" />}
  </div>;
}
