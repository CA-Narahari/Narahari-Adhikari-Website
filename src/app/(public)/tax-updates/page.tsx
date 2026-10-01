'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

const officialSources = [
  { name: 'Inland Revenue Department', short: 'IRD', href: 'https://ird.gov.np/' },
  { name: 'Ministry of Finance', short: 'MoF', href: 'https://mof.gov.np/' },
  { name: 'Nepal Rastra Bank', short: 'NRB', href: 'https://www.nrb.org.np/' },
  { name: 'Office of Company Registrar', short: 'OCR', href: 'https://ocr.gov.np/' },
];

export default function TaxUpdatesPage() {
  const { taxUpdates } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');

  const categories = useMemo(
    () => ['All topics', ...new Set(taxUpdates.map((item) => item.category).filter(Boolean))],
    [taxUpdates],
  );

  const updates = useMemo(() => {
    const search = query.trim().toLowerCase();
    return taxUpdates.filter((item) => {
      const matchesCategory = category === 'All topics' || item.category === category;
      const matchesSearch = !search || [item.title, item.summary, item.content, item.source_name]
        .some((value) => value?.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [taxUpdates, query, category]);

  return (
    <div className="pb-24 overflow-x-hidden">
      {/* 1. Header Section */}
      <section
        id="hero-section"
        className="relative bg-hero-gradient pt-8 pb-14 sm:pt-12 sm:pb-16 overflow-hidden"
      >
        <div className="max-w-[1240px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2CBC63]">
              Official Circulars & Compliance Directives
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#023A51] tracking-tight leading-tight">
              Tax Updates<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base sm:text-[17px] text-[#33475B] font-normal leading-relaxed">
              Timely analysis, statutory circulars, and tax compliance updates issued by the Inland Revenue Department (IRD), Ministry of Finance, and regulatory authorities in Nepal.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section aria-labelledby="updates-heading">
          <div className="mb-7 flex flex-col gap-4 border-b border-[#E8EBEF] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="updates-heading" className="text-2xl font-bold text-[#023A51]">Practice updates</h2>
              <p className="mt-1 text-sm text-[#59667D]">Notices are added after the source has been checked.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#59667D]" />
              <Input
                aria-label="Search tax updates"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notices"
                className="pl-9"
              />
            </div>
          </div>

          {categories.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter by topic">
              {categories.map((item) => (
                <Button
                  key={item}
                  type="button"
                  size="sm"
                  variant={category === item ? 'default' : 'outline'}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                >
                  {item}
                </Button>
              ))}
            </div>
          )}

          {updates.length ? (
            <div className="divide-y divide-[#E8EBEF] border-y border-[#E8EBEF] bg-white">
              {updates.map((item) => (
                <article key={item.id} className="px-5 py-7 sm:px-7">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#59667D]">
                    <span className="font-semibold text-[#2CBC63]">{item.category}</span>
                    {item.published_at && <time dateTime={item.published_at}>{item.published_at}</time>}
                    {item.source_name && <span>From {item.source_name}</span>}
                  </div>
                  <h3 className="text-xl font-bold leading-snug text-[#023A51]">{item.title}</h3>
                  {item.summary && <p className="mt-3 text-sm leading-7 text-[#4A5259]">{item.summary}</p>}
                  <div className="mt-5 whitespace-pre-line border-l-2 border-[#2CBC63] pl-4 text-sm leading-7 text-[#33475B]">
                    {item.content}
                  </div>
                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#023A51] underline decoration-[#2CBC63] underline-offset-4 hover:text-[#2CBC63] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#023A51]"
                    >
                      Read the original source <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="border-y border-[#E8EBEF] bg-white px-6 py-12 text-center sm:px-10">
              <p className="text-lg font-semibold text-[#023A51]">
                {query ? 'No notices match that search.' : 'No practice updates have been published yet.'}
              </p>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#59667D]">
                Check the issuing authority for the latest circulars. We will add a practice note here when there is useful guidance to share.
              </p>
              {query && <Button className="mt-5" variant="outline" onClick={() => setQuery('')}>Clear search</Button>}
            </div>
          )}
        </section>

        <aside className="space-y-7">
          <div className="border-t-2 border-[#023A51] bg-white p-5">
            <h2 className="text-lg font-bold text-[#023A51]">Check the original source</h2>
            <p className="mt-2 text-sm leading-6 text-[#59667D]">
              Deadlines and rates can change. Confirm the current rule with the authority before acting.
            </p>
            <ul className="mt-4 divide-y divide-[#E8EBEF]">
              {officialSources.map((source) => (
                <li key={source.short}>
                  <a href={source.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 py-3 text-sm font-medium text-[#33475B] hover:text-[#2CBC63] focus-visible:outline-2 focus-visible:outline-[#023A51]">
                    <span>{source.name}</span><ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t-2 border-[#2CBC63] bg-[#E8F4F8] p-5">
            <h2 className="text-lg font-bold text-[#023A51]">Need help with a notice?</h2>
            <p className="mt-2 text-sm leading-6 text-[#4A5259]">Bring the circular or letter to a consultation and we can discuss how it applies to your situation.</p>
            <Button asChild className="mt-4 w-full"><Link href="/book-appointment">Request a consultation</Link></Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
