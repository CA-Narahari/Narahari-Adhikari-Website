'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { BlogPost } from '@/types';
import ContentEditor, { ContentEditorData } from '@/components/admin/ContentEditor';
import ConfirmModal from '@/components/ui/ConfirmModal';
import {
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const CATEGORIES = [
  'Corporate Tax',
  'Audit & Assurance',
  'VAT & Invoicing',
  'Business Advisory',
  'Regulatory Law',
  'Foreign Investment (FDI)',
];

export default function AdminBlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'published' | 'draft'>('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State for in-app deletion confirmation
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterTab === 'all' || post.status === filterTab;
    return matchesSearch && matchesStatus;
  });

  const handleEditorSave = async (data: ContentEditorData): Promise<boolean> => {
    const today = new Date().toISOString().split('T')[0];

    if (editingPost) {
      const saved = await updateBlogPost(editingPost.id, {
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        content: sanitizeHtml(data.content),
        author: 'CA Narahari Adhikari, FCA',
        read_time: `${Math.max(3, Math.ceil(data.content.split(/\s+/).length / 180))} min read`,
        featured_image: data.featuredImage,
        tags: data.tags,
        status: data.status,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        focus_keyword: data.focusKeyword,
      });
      if (!saved) return false;
      setToastMessage(data.status === 'draft' ? `Draft "${data.title}" saved` : `Article "${data.title}" published`);
    } else {
      const saved = await addBlogPost({
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        content: sanitizeHtml(data.content),
        author: 'CA Narahari Adhikari, FCA',
        read_time: `${Math.max(3, Math.ceil(data.content.split(/\s+/).length / 180))} min read`,
        featured_image: data.featuredImage,
        tags: data.tags,
        status: data.status,
        published_at: today,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        focus_keyword: data.focusKeyword,
      });
      if (!saved) return false;
      setToastMessage(data.status === 'draft' ? `Draft "${data.title}" saved` : `New article "${data.title}" published`);
    }

    setTimeout(() => setToastMessage(null), 3000);
    setEditingPost(null);
    setIsCreatingNew(false);
    return true;
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    const deleted = await deleteBlogPost(postToDelete.id);
    if (!deleted) {
      setToastMessage('Article could not be deleted. Check your CMS session and try again.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setToastMessage(`Article "${postToDelete.title}" deleted`);
    setTimeout(() => setToastMessage(null), 3000);
    setPostToDelete(null);
    setEditingPost(null);
  };

  const deleteFromEditor = async (post: BlogPost) => {
    const deleted = await deleteBlogPost(post.id);
    if (!deleted) {
      setToastMessage('Article could not be deleted. Check your CMS session and try again.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setToastMessage(`Article "${post.title}" deleted`);
    setEditingPost(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // If in Editor Mode
  if (editingPost || isCreatingNew) {
    const initialEditorData: ContentEditorData = editingPost
      ? {
          title: editingPost.title,
          slug: editingPost.slug,
          content: editingPost.content,
          excerpt: editingPost.excerpt,
          category: editingPost.category,
          tags: editingPost.tags || [],
          featuredImage: editingPost.featured_image,
          status: editingPost.status,
          metaTitle: editingPost.meta_title || `${editingPost.title} | Narahari Adhikari & Co.`,
          metaDescription: editingPost.meta_description || editingPost.excerpt,
          focusKeyword: editingPost.focus_keyword || editingPost.category,
        }
      : {
          title: '',
          slug: '',
          content: '',
          excerpt: '',
          category: 'Corporate Tax',
          tags: ['Tax', 'Compliance', 'Nepal Law'],
          featuredImage: undefined, // Let user upload or pick their own image
          status: 'published',
          metaTitle: '',
          metaDescription: '',
          focusKeyword: '',
        };

    return (
      <ContentEditor
        itemTypeLabel="Article"
        storageFolder="blog"
        initialData={initialEditorData}
        availableCategories={CATEGORIES}
        onSave={handleEditorSave}
        onCancel={() => {
          setEditingPost(null);
          setIsCreatingNew(false);
        }}
        onDelete={editingPost ? () => { void deleteFromEditor(editingPost); } : undefined}
      />
    );
  }

  return (
    <div className="space-y-7 max-w-[1400px] mx-auto pb-14 text-slate-800 font-sans">
      {/* Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={!!postToDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setPostToDelete(null)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#053243] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 border border-emerald-400/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A8F4B]">
            <span>Workspace</span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-500">Website Content</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B3E] tracking-tight mt-0.5">
            Articles &amp; Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Publish educational articles and compliance blueprints with rich formatting, media gallery, and SEO controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Public Knowledge Base</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (Clean: search + status tabs) */}
      <div className="bg-white border border-[#E8EFF0] rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search article titles, keywords..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#1A8F4B] focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-[#0D3B3E] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All ({blogPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('published')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterTab === 'published'
                ? 'bg-white text-[#0D3B3E] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Published ({blogPosts.filter((b) => b.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('draft')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterTab === 'draft'
                ? 'bg-white text-[#0D3B3E] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Drafts ({blogPosts.filter((b) => b.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No articles found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No articles matched "${searchQuery}". Try a different keyword.`
              : 'Write your first article or insight to publish on the knowledge base.'}
          </p>
          <button
            type="button"
            onClick={() => setIsCreatingNew(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C4A4E] text-white text-xs font-bold hover:bg-[#083639] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      )}

      {/* Unified Cards Grid - Styled Cleanly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Top Preview Block */}
            <div className="flex-1 flex flex-col">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0C4A4E]/10 to-[#1A8F4B]/10 text-slate-400">
                    <BookOpen className="w-10 h-10 text-[#0C4A4E]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status Badge */}
                <div className="absolute top-3.5 right-3.5">
                  <span
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                      post.status === 'published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>

                {/* Clean Category Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Card Content matching Home Card Body */}
              <div className="p-6 space-y-2.5 bg-[#E5F1F6] flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#1D5367]/80 mb-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#023A51]">
                      <Clock className="w-3.5 h-3.5 text-[#2CBC63]" />
                      {post.read_time || '5 min read'}
                    </span>
                    <span>{post.published_at}</span>
                  </div>

                  <h2 className="text-[18px] font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-[13px] text-[#1D5367] leading-relaxed line-clamp-3 mt-2">
                    {post.excerpt}
                  </p>
                </div>

                {/* Direct Actions in Card Footer */}
                <div className="pt-4 border-t border-[#CCD7DC]/60 flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingPost(post)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#023A51] hover:text-[#2CBC63] transition-colors"
                    >
                      <span>Preview</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63]" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setPostToDelete({ id: post.id, title: post.title })}
                      className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer text-xs font-semibold"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
