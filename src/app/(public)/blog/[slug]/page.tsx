'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';

function ArticleContent({ content }: { content: string }) {
  return (
    <div className="space-y-5">
      {content.split('\n').map((line, index) => {
        const text = line.trim();
        if (!text) return null;
        const heading = text.endsWith(':');
        const numbered = text.match(/^(\d+)\.\s(.+)/);
        if (heading) return <h2 key={index} className="pt-3 text-lg font-bold text-[#023A51]">{text}</h2>;
        if (numbered) return <div key={index} className="rounded-xl bg-[#F8FAFC] px-4 py-3 text-[15px] leading-relaxed text-[#33475B]"><strong className="mr-2 text-[#023A51]">{numbered[1]}.</strong>{numbered[2]}</div>;
        return <p key={index} className="text-[16px] leading-[1.9] text-[#33475B]">{text}</p>;
      })}
    </div>
  );
}

export default function BlogArticlePage() {
  const { blogPosts } = useApp();
  const params = useParams();
  const post = blogPosts.find((item) => item.status === 'published' && item.slug === params.slug);

  if (!post) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[#023A51]">Article not found</h1>
        <p className="mt-2 text-sm text-[#59667D]">This article has not been published or is no longer available.</p>
        <Link href="/blog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#023A51] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2CBC63]"><ArrowLeft className="h-4 w-4" /> Back to articles</Link>
      </div>
    );
  }

  return (
    <article className="pb-24">
      <section id="hero-section" className="bg-hero-gradient pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="mx-auto max-w-[1000px] px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#023A51] hover:text-[#2CBC63]"><ArrowLeft className="h-4 w-4" /> All articles</Link>
          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#023A51]"><span>{post.category}</span><span className="flex items-center gap-1.5 text-[#33475B]"><Calendar className="h-3.5 w-3.5" />{post.published_at}</span><span className="flex items-center gap-1.5 text-[#33475B]"><Clock className="h-3.5 w-3.5" />{post.read_time}</span></div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-[#023A51] sm:text-5xl">{post.title}<span className="text-[#2CBC63]">.</span></h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#33475B] sm:text-lg">{post.excerpt}</p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-[760px] px-6 pt-10 sm:pt-16">
        <ArticleContent content={post.content} />
        <div className="mt-10 border-t border-[#E8EBEF] pt-6"><p className="text-sm leading-relaxed text-[#59667D]">Have a question about this topic? Bring it to a direct consultation with the practice.</p><Link href="/book-appointment" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#023A51] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2CBC63]">Discuss your situation <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </article>
  );
}
