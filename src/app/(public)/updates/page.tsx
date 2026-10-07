'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, FileText, Landmark, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function UpdatesPage() {
  const { taxUpdates, taxUpdatesLoaded, governmentLinks } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All topics');
  const categories = useMemo(() => ['All topics', ...new Set(taxUpdates.map((item) => item.category).filter(Boolean))], [taxUpdates]);
  const updates = useMemo(() => {
    const search = query.trim().toLowerCase();
    return taxUpdates.filter((item) => (category === 'All topics' || item.category === category)
      && (!search || [item.title, item.summary, item.content, item.source_name, item.category].some((value) => value?.toLowerCase().includes(search))));
  }, [taxUpdates, query, category]);
  const featured = updates[0];
  const remaining = featured ? updates.slice(1) : updates;

  return <div className="overflow-x-hidden pb-20">
    <section id="hero-section" className="relative overflow-hidden bg-hero-gradient py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#BFE6D0] bg-white/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#13824B]"><FileText className="size-3.5" /> Tax and regulatory updates</span>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-[#073E43] sm:text-5xl">Stay informed.<br className="hidden sm:block" /> Make confident decisions.</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#587174]">Browse published practice notes, statutory changes, and compliance updates saved by our team.</p>
      </div>
    </section>

    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
      <main className="min-w-0">
        {featured && <article className="overflow-hidden rounded-3xl border border-[#DFEAE4] bg-white shadow-[0_14px_40px_-28px_rgba(7,62,67,.38)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="p-6 sm:p-8"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#EAF8F1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#177449]">{featured.category}</span>{featured.is_urgent && <span className="rounded-full bg-[#FFF4DC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8B5D0B]">Urgent</span>}</div>
              <h2 className="mt-4 text-2xl font-bold leading-tight text-[#073E43] sm:text-3xl">{featured.title}</h2>
              {featured.summary && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66797A]">{featured.summary}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#708583]">{featured.published_at && <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5 text-[#168A4A]" />{formatDate(featured.published_at)}</span>}{featured.source_name && <span className="inline-flex items-center gap-1.5"><Landmark className="size-3.5 text-[#168A4A]" />{featured.source_name}</span>}</div>
              {featured.content && <details className="mt-5 rounded-2xl border border-[#E7EFEB] bg-[#F8FBF9] p-4"><summary className="cursor-pointer text-sm font-semibold text-[#0B6E42]">Read full update</summary><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#425E60]">{featured.content}</p></details>}
              {featured.source_url && <a href={featured.source_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#117740] hover:underline">Official source <ArrowUpRight className="size-4" /></a>}
            </div>
            <div className="flex flex-col justify-between bg-gradient-to-br from-[#EAF8F1] to-[#F3F8FA] p-6 sm:p-8 lg:border-l lg:border-[#E3ECE7]"><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#6C8581]">Latest published notice</p><p className="mt-3 text-5xl font-bold tracking-tight text-[#0B4B4C]">{taxUpdatesLoaded ? taxUpdates.length : '—'}</p><p className="mt-1 text-sm text-[#607976]">Updates in the library</p></div><div className="mt-6 rounded-2xl border border-white/80 bg-white/80 p-4"><p className="text-xs font-semibold text-[#315B56]">Need help applying an update?</p><Link href="/book-appointment" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#128448] hover:underline">Book a consultation <ArrowRight className="size-3.5" /></Link></div></div>
          </div>
        </article>}

        <section className="mt-9" aria-labelledby="updates-heading">
          <div className="flex flex-col gap-4 border-b border-[#E5ECE8] pb-5 sm:flex-row sm:items-end sm:justify-between"><div><h2 id="updates-heading" className="text-2xl font-bold text-[#073E43]">All updates</h2><p className="mt-1 text-sm text-[#728482]">{updates.length} {updates.length === 1 ? 'record' : 'records'} from the content library</p></div><label className="relative block w-full sm:max-w-xs"><Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#82918D]" /><input aria-label="Search updates" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search updates…" className="h-10 w-full rounded-xl border border-[#D8E4DE] bg-white pl-9 pr-3 text-sm text-[#143F40] outline-none focus:border-[#168A4A]" /></label></div>
          {categories.length > 1 && <div className="my-5 flex flex-wrap gap-2" aria-label="Filter updates by topic">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${category === item ? 'bg-[#20B866] text-white shadow-sm' : 'border border-[#DFEAE4] bg-white text-[#55706C] hover:border-[#BFE6D0] hover:bg-[#F2FAF5]'}`}>{item}</button>)}</div>}
          {!taxUpdatesLoaded ? <div role="status" className="mt-5 rounded-2xl border border-[#E2ECE6] bg-white px-6 py-12 text-center text-sm text-[#66797A]">Loading updates…</div> : remaining.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{remaining.map((item) => <article key={item.id} className="flex min-h-64 flex-col rounded-2xl border border-[#E2ECE6] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#BFDCCB] hover:shadow-[0_16px_34px_-28px_rgba(7,62,67,.55)] sm:p-6">
            <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-[#EAF8F1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#177449]">{item.category}</span>{item.is_urgent && <span className="text-[10px] font-bold uppercase tracking-wide text-[#A06A0B]">Urgent</span>}</div>
            <h3 className="mt-4 text-lg font-bold leading-snug text-[#103F42]">{item.title}</h3>{item.summary && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#687D7B]">{item.summary}</p>}
            {item.content && <details className="mt-3 rounded-xl bg-[#F8FBF9] px-3.5 py-3"><summary className="cursor-pointer text-xs font-semibold text-[#137647]">Read full update</summary><p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#425E60]">{item.content}</p></details>}
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF2EF] pt-4"><span className="inline-flex items-center gap-1.5 text-xs text-[#82918D]">{item.published_at && <><Clock3 className="size-3.5 text-[#168A4A]" />{formatDate(item.published_at)}</>}</span>{item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#13824B] hover:underline">Source <ArrowUpRight className="size-3.5" /></a>}</div>
          </article>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-[#D7E5DD] bg-white px-6 py-12 text-center"><FileText className="mx-auto size-8 text-[#98B8A6]" /><h3 className="mt-3 font-semibold text-[#143F40]">{taxUpdates.length ? 'No updates match these filters' : 'No updates have been published yet'}</h3><p className="mt-1 text-sm text-[#718181]">{taxUpdates.length ? 'Change the search or topic to see more updates.' : 'Published updates will appear here when they are added in the CMS.'}</p>{(query || category !== 'All topics') && <button type="button" onClick={() => { setQuery(''); setCategory('All topics'); }} className="mt-4 text-sm font-semibold text-[#168A4A] hover:underline">Clear filters</button>}</div>}
        </section>
      </main>

      <aside className="space-y-5">
        <section className="rounded-2xl border border-[#E2ECE6] bg-white p-5 sm:p-6"><h2 className="flex items-center gap-2 font-bold text-[#123F40]"><Landmark className="size-4 text-[#168A4A]" />Reference links</h2><p className="mt-1 text-xs leading-5 text-[#718181]">Official resources maintained in the CMS.</p>{governmentLinks.length ? <ul className="mt-3 divide-y divide-[#EDF2EF]">{governmentLinks.map((item) => <li key={item.id}><a href={item.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 py-3 text-sm font-medium text-[#405B59] transition hover:text-[#168A4A]"><span className="min-w-0"><span className="block truncate">{item.short_name || item.name}</span>{item.description && <span className="mt-0.5 block line-clamp-2 text-[11px] font-normal leading-4 text-[#82918D]">{item.description}</span>}</span><ArrowUpRight className="size-4 shrink-0" /></a></li>)}</ul> : <p className="mt-4 rounded-xl bg-[#F7FAF8] p-3 text-xs text-[#718181]">No reference links are available.</p>}</section>
        <section className="rounded-2xl bg-[#073F43] p-5 text-white sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#76DDA3]">Consultation</p><h2 className="mt-2 text-lg font-bold">Questions about an update?</h2><p className="mt-2 text-sm leading-6 text-white/75">Discuss how a published notice applies to your organisation.</p><Link href="/book-appointment" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#20B866] px-4 text-sm font-bold text-white transition hover:bg-[#159A53]">Book consultation <ArrowRight className="size-4" /></Link></section>
      </aside>
    </div>
  </div>;
}
