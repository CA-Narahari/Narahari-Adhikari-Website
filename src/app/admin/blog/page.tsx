'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

export default function AdminBlogPage() {
  const { blogPosts, addBlogPost, deleteBlogPost } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Corporate Compliance');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const today = new Date().toISOString().split('T')[0];

    addBlogPost({
      title,
      slug,
      category,
      excerpt: excerpt || title,
      content,
      author: 'CA Narahari Adhikari, FCA',
      read_time: '5 min read',
      status: 'published',
      published_at: today,
    });

    setShowModal(false);
    setTitle('');
    setExcerpt('');
    setContent('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Knowledge Center & Guides
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish educational articles and corporate compliance blueprints.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-200">
        {blogPosts.map((post) => (
          <div key={post.id} className="p-6 flex items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {post.category}
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">{post.title}</h2>
              <p className="text-xs text-slate-600 line-clamp-1">{post.excerpt}</p>
              <div className="text-[11px] text-slate-400 font-mono">
                {post.author} • {post.published_at}
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('Delete article?')) deleteBlogPost(post.id);
              }}
              className="p-2 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100"
              title="Delete Article"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-3">
              Write New Blog Article
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Content *</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
