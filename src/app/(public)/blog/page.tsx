'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function BlogPage() {
  const { blogPosts } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const publishedPosts = blogPosts.filter((post) => post.status === 'published');

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (newsletterEmail) {
      setNewsletterEmail('');
      setIsSubscribed(true);
    }
  };

  return (
    <div className="pb-24 overflow-x-hidden">
      <section id="hero-section" className="relative bg-hero-gradient pt-8 pb-12 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#023A51] sm:text-5xl">
              Notes from the practice<span className="text-[#2CBC63]">.</span>
            </h1>
            <p className="text-base leading-relaxed text-[#33475B] sm:text-[17px]">
              Useful explanations on tax, audit, reporting, and the decisions businesses make every day.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] space-y-12 px-6 pt-10 sm:pt-14">
        {publishedPosts.length === 0 ? (
          <section className="border-y border-[#E8EBEF] py-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2CBC63]">The journal is being prepared</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#023A51]">There are no published articles yet.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#59667D]">
              New notes will appear here after they have been reviewed and published by the practice. For a question that cannot wait, request a direct consultation.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/book-appointment">Request a consultation <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-[#E8EBEF] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2CBC63]">From the practice</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#023A51]">Recent notes</h2>
              </div>
              <span className="hidden text-sm text-[#59667D] sm:block">{publishedPosts.length} articles</span>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {publishedPosts.map((post) => (
                <article key={post.id} className="group flex h-full flex-col border-t-2 border-[#2CBC63] pt-5">
                  <div className="flex items-center justify-between text-xs text-[#59667D]">
                    <span className="font-bold text-[#023A51]">{post.category}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.read_time}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold leading-snug text-[#023A51] group-hover:text-[#2CBC63]">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#59667D]">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#023A51] hover:text-[#2CBC63]">
                    Read article <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#CCD7DC] bg-[#E8F4F8] p-6 md:flex-row sm:p-8">
          <div className="max-w-lg text-center md:text-left">
            <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#023A51] md:justify-start"><Mail className="h-4 w-4 text-[#2CBC63]" /> Receive occasional updates</div>
            <p className="mt-1 text-xs leading-relaxed text-[#59667D]">A short email when there is something useful to share.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full items-center gap-2 md:w-auto">
            <label htmlFor="blog-email" className="sr-only">Email address</label>
            <Input id="blog-email" type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Your email address" className="h-10 w-full rounded-full border-[#CCD7DC] bg-white text-xs sm:w-64" />
            <Button type="submit" size="sm" className="h-10 shrink-0 rounded-full px-5 text-xs">{isSubscribed ? 'Subscribed' : 'Subscribe'}</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
