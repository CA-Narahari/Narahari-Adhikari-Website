'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  X,
  Search,
  Globe,
  Heading1,
  Heading2,
  Code,
  FolderOpen,
  LoaderCircle,
} from 'lucide-react';
import MediaLibraryModal from './MediaLibraryModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { sanitizeHtml } from '@/lib/sanitize-html';

export interface ContentEditorData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  categoriesList?: string[];
  tags: string[];
  featuredImage?: string;
  status: 'draft' | 'published';
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
}

interface ContentEditorProps {
  initialData: ContentEditorData;
  availableCategories: string[];
  storageFolder: 'blog' | 'services';
  onSave: (data: ContentEditorData) => Promise<boolean> | boolean;
  onCancel: () => void;
  onDelete?: () => void;
  itemTypeLabel?: string;
  draftsEnabled?: boolean;
}

function decodeEditorHtml(content: string): string {
  if (typeof document === 'undefined' || !/&lt;\/?(?:p|h[1-6]|div|ul|ol|li|blockquote|table|section|article|style)\b/i.test(content)) return content;
  const decoder = document.createElement('textarea');
  decoder.innerHTML = content;
  const decoded = decoder.value.trim();
  return /^<(?:p|h[1-6]|div|ul|ol|li|blockquote|table|section|article|style)\b/i.test(decoded) ? decoded : content;
}

function normalizeHtmlContent(content: string): string {
  content = decodeEditorHtml(content);
  if (!content || !content.trim()) {
    return '<p>Write your article content here...</p>';
  }
  // If content already contains HTML tags, return it
  if (/<(p|h1|h2|h3|h4|div|ul|ol|blockquote|img|table)[^>]*>/i.test(content)) {
    return content;
  }
  // Otherwise, split by double newlines into clean paragraphs
  return content
    .split(/\n\s*\n/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('');
}

export default function ContentEditor({
  initialData,
  availableCategories,
  storageFolder,
  onSave,
  onCancel,
  onDelete,
  itemTypeLabel = 'Item',
  draftsEnabled = true,
}: ContentEditorProps) {
  const [title, setTitle] = useState(initialData.title);
  const [slug, setSlug] = useState(initialData.slug);
  const [contentHtml, setContentHtml] = useState(() => normalizeHtmlContent(initialData.content));
  const [excerpt, setExcerpt] = useState(initialData.excerpt);
  const [category, setCategory] = useState(initialData.category || availableCategories[0] || 'General');
  const [categoriesList, setCategoriesList] = useState<string[]>(availableCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(initialData.featuredImage);
  const [status, setStatus] = useState<'draft' | 'published'>(initialData.status);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(initialData.metaTitle || initialData.title || '');
  const [metaDescription, setMetaDescription] = useState(
    initialData.metaDescription || initialData.excerpt || ''
  );
  const [focusKeyword, setFocusKeyword] = useState(initialData.focusKeyword || '');

  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'seo'>('visual');

  // Media Library modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalMode, setMediaModalMode] = useState<'featured' | 'insert'>('featured');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const visualEditorRef = useRef<HTMLDivElement>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData.title) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
      if (!metaTitle) setMetaTitle(val);
    }
  };

  // Switch tabs smoothly while keeping visual DOM and code textarea in sync
  const switchEditorMode = (newMode: 'visual' | 'code' | 'seo') => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      const updated = visualEditorRef.current.innerHTML;
      setContentHtml(updated);
    } else if (editorMode === 'code' && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = sanitizeHtml(contentHtml);
    }

    if (newMode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = contentHtml;
    }

    setEditorMode(newMode);
  };

  // WYSIWYG command execution
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (editorMode !== 'visual') return;
    visualEditorRef.current?.focus();
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setContentHtml(visualEditorRef.current.innerHTML);
    }
  };

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      setContentHtml(visualEditorRef.current.innerHTML);
    }
  };

  // Open Media Library
  const handleOpenMediaLibrary = (mode: 'featured' | 'insert') => {
    setMediaModalMode(mode);
    setIsMediaModalOpen(true);
  };

  // Media selected from modal
  const handleSelectMedia = (result: {
    url: string;
    altText?: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
  }) => {
    const { url, altText = 'Article Illustration', caption, alignment = 'center' } = result;
    if (mediaModalMode === 'featured') {
      if (featuredImage && featuredImage !== url && featuredImage.includes('supabase.co')) {
        void fetch('/api/admin/storage/orphan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: featuredImage }),
        });
      }
      setFeaturedImage(url);
    } else {
      // Insert inline image into content
      if (editorMode !== 'visual') {
        switchEditorMode('visual');
      }
      setTimeout(() => {
        visualEditorRef.current?.focus();
        const alignStyle =
          alignment === 'left'
            ? 'margin-right:auto; margin-left:0;'
            : alignment === 'right'
            ? 'margin-left:auto; margin-right:0;'
            : 'margin-left:auto; margin-right:auto;';
        const imgHtml = `<figure style="margin:1.5rem 0; text-align:${alignment};"><img src="${url}" alt="${altText}" style="max-width:100%; height:auto; border-radius:0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display:inline-block; ${alignStyle}" />${
          caption
            ? `<figcaption style="font-size:0.75rem; color:#64748B; margin-top:0.5rem; font-style:italic;">${caption}</figcaption>`
            : ''
        }</figure><p><br></p>`;
        document.execCommand('insertHTML', false, imgHtml);
        if (visualEditorRef.current) {
          setContentHtml(visualEditorRef.current.innerHTML);
        }
      }, 50);
    }
    setIsMediaModalOpen(false);
  };

  const handleRemoveFeaturedImage = async () => {
    if (featuredImage && featuredImage.includes('supabase.co')) {
      await fetch('/api/admin/storage/orphan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: 'website-media', url: featuredImage }),
      }).catch(() => {});
    }
    setFeaturedImage(undefined);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const cat = newCategoryName.trim();
    if (!categoriesList.includes(cat)) {
      setCategoriesList([...categoriesList, cat]);
      setCategory(cat);
    }
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTagInput('');
  };

  const handleSave = async (forcedStatus?: 'draft' | 'published') => {
    if (isSaving) return;
    const currentHtml =
      visualEditorRef.current && editorMode === 'visual'
      ? decodeEditorHtml(visualEditorRef.current.innerHTML)
        : contentHtml;
    const nextStatus = forcedStatus || status;
    const plainText = currentHtml.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/\s+/g, ' ').trim();
    const isEditorPlaceholder = plainText === 'Write your article content here...';
    const cleanTitle = title.trim();
    const cleanSlug = (slug || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)+/g, '');

    if (!cleanTitle) {
      setSaveError(`Add a title before saving this ${itemTypeLabel.toLowerCase()}.`);
      return;
    }
    if (!cleanSlug) {
      setSaveError('Add a valid URL slug before saving.');
      return;
    }
    if (nextStatus === 'published' && (!plainText || isEditorPlaceholder)) {
      setSaveError('Add some article content before publishing.');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      const saved = await onSave({
      title: cleanTitle,
      slug: cleanSlug,
      content: isEditorPlaceholder ? '' : currentHtml,
      excerpt,
      category,
      categoriesList,
      tags,
      featuredImage,
      status: nextStatus,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      });
      if (!saved) setSaveError(`Could not save this ${itemTypeLabel.toLowerCase()}. Check your connection and CMS access, then try again.`);
    } catch {
      setSaveError(`Could not save this ${itemTypeLabel.toLowerCase()}. Check your connection and try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#F5F8F7] min-h-screen text-[#1E293B] font-sans p-4 sm:p-6 lg:p-8">
      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleSelectMedia}
        folder={storageFolder}
        mode={mediaModalMode}
      />

      {/* Bespoke Confirm Modal for Delete */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title={`Delete ${itemTypeLabel}`}
        message={`Are you sure you want to delete "${title || 'this article'}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete?.();
        }}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E6EFEA]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0D3B3E] tracking-tight">
            {initialData.title ? `Edit ${itemTypeLabel}` : `Create New ${itemTypeLabel}`}
          </h1>
          <p className="text-xs text-[#556E70] mt-0.5">
            Content creation, media integration, and search optimization editor.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {saveError && <p role="alert" className="max-w-xs text-xs font-medium text-rose-700">{saveError}</p>}
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-[#DCE5E2] rounded-xl text-xs font-bold bg-white text-[#0D3B3E] hover:bg-[#F6FAF8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {draftsEnabled && <button
            type="button"
            onClick={() => void handleSave('draft')}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#DCE5E2] rounded-xl text-xs font-bold bg-white text-[#0D3B3E] hover:bg-[#F6FAF8] disabled:cursor-wait disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isSaving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : null}
            {isSaving ? 'Saving…' : 'Save Draft'}
          </button>}
          <button
            type="button"
            onClick={() => void handleSave(draftsEnabled ? 'published' : undefined)}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#0C4A4E] hover:bg-[#083639] disabled:cursor-wait disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {isSaving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : null}
            {isSaving ? 'Saving…' : draftsEnabled ? (status === 'published' ? 'Update' : 'Publish') : 'Save Service'}
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        {/* Left Column: Title, WYSIWYG Body, SEO (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title and Permalink */}
          <div className="bg-white border border-[#E6EFEA] rounded-2xl p-5 shadow-xs space-y-2.5">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={`Enter ${itemTypeLabel.toLowerCase()} title...`}
              className="w-full text-xl sm:text-2xl font-extrabold text-[#0D3B3E] placeholder:text-slate-400 focus:outline-hidden py-1"
            />

            <div className="flex items-center gap-2 text-xs text-[#556E70] bg-[#F9FCFA] p-2.5 rounded-xl border border-[#E6EFEA]">
              <span className="font-bold text-[#0D3B3E]">Slug:</span>
              <span className="text-slate-400 font-mono">/{storageFolder}/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-white border border-[#DCE5E2] rounded-lg px-2.5 py-1 text-xs text-[#0D3B3E] font-mono focus:outline-hidden focus:border-[#1A8F4B]"
              />
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-between bg-white border border-[#E6EFEA] rounded-t-2xl px-4 pt-3 border-b-0">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => switchEditorMode('visual')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer ${
                  editorMode === 'visual'
                    ? 'bg-white border-[#E6EFEA] text-[#0D3B3E] -mb-px shadow-xs'
                    : 'bg-[#F9FCFA] border-transparent text-[#627A7D] hover:text-[#0D3B3E]'
                }`}
              >
                Visual Editor
              </button>
              <button
                type="button"
                onClick={() => switchEditorMode('code')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-1.5 ${
                  editorMode === 'code'
                    ? 'bg-white border-[#E6EFEA] text-[#0D3B3E] -mb-px shadow-xs'
                    : 'bg-[#F9FCFA] border-transparent text-[#627A7D] hover:text-[#0D3B3E]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>HTML Code</span>
              </button>
              <button
                type="button"
                onClick={() => switchEditorMode('seo')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer flex items-center gap-1.5 ${
                  editorMode === 'seo'
                    ? 'bg-white border-[#E6EFEA] text-[#1A8F4B] -mb-px shadow-xs'
                    : 'bg-[#F9FCFA] border-transparent text-[#627A7D] hover:text-[#0D3B3E]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Search Optimization</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenMediaLibrary('insert')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#DCE5E2] bg-white hover:bg-[#F6FAF8] text-[#0D3B3E] transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#1A8F4B]" />
              <span>Insert Image</span>
            </button>
          </div>

          {/* Visual WYSIWYG Mode (Kept mounted to preserve state!) */}
          <div className={editorMode === 'visual' ? 'block' : 'hidden'}>
            <div className="bg-white border border-[#E6EFEA] rounded-b-2xl shadow-xs overflow-hidden">
              {/* Formatting Toolbar */}
              <div onMouseDown={(event) => event.preventDefault()} className="flex flex-wrap items-center gap-1 p-2.5 bg-[#FAFDFB] border-b border-[#EEF4F0] text-[#33475B]">
                <button
                  type="button"
                  onClick={() => executeCommand('bold')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('italic')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('underline')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => executeCommand('formatBlock', '<h2>')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Heading 2"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('formatBlock', '<h3>')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Heading 3"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => executeCommand('insertUnorderedList')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Bullet list"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('insertOrderedList')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Numbered list"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('formatBlock', '<blockquote>')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => executeCommand('justifyLeft')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('justifyCenter')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('justifyRight')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer"
                  title="Align Right"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                  type="button"
                  onClick={() => handleOpenMediaLibrary('insert')}
                  className="p-1.5 rounded-lg hover:bg-[#EAF6F0] hover:text-[#1A8F4B] cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title="Insert Image from Media Library"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Image</span>
                </button>
              </div>

              {/* Visual ContentEditable Area with rich typography */}
              <div
                ref={(element) => {
                  visualEditorRef.current = element;
                  if (element && element.dataset.editorInitialized !== 'true') {
                    element.innerHTML = sanitizeHtml(contentHtml);
                    element.dataset.editorInitialized = 'true';
                  }
                }}
                contentEditable
                onInput={handleVisualInput}
                className="cms-article-content w-full p-6 min-h-[420px] focus:outline-hidden prose prose-slate max-w-none text-sm text-[#33475B] leading-relaxed [&>p]:mb-4 [&>p]:leading-relaxed [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#0D3B3E] [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#0D3B3E] [&>h3]:mt-5 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[#1A8F4B] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 [&>img]:rounded-xl [&>img]:my-4 [&>img]:max-w-full"
                style={{ minHeight: '420px' }}
              />

              <div className="p-3 bg-[#FAFDFB] border-t border-[#EEF4F0] text-[11px] text-[#627A7D] flex items-center justify-between font-mono">
                <span>Visual WYSIWYG Mode &bull; Real-time rendering</span>
                <span>Rich format enabled</span>
              </div>
            </div>
          </div>

          {/* HTML Code Mode */}
          <div className={editorMode === 'code' ? 'block' : 'hidden'}>
            <div className="bg-white border border-[#E6EFEA] rounded-b-2xl p-4 shadow-xs">
              <p className="mb-3 text-xs leading-5 text-[#627A7D]">Custom HTML is sanitized for safety. Inline styles are supported; CSS in a <code>&lt;style&gt;</code> block is scoped to this article on the public page.</p>
              <textarea
                rows={18}
                value={contentHtml}
                onChange={(e) => {
                  setContentHtml(e.target.value);
                  if (visualEditorRef.current) {
                    visualEditorRef.current.innerHTML = sanitizeHtml(e.target.value);
                  }
                }}
                className="w-full font-mono text-xs p-3.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#1A8F4B] bg-slate-50 leading-relaxed text-slate-800"
              />
            </div>
          </div>

          {/* Search Optimization / SEO Mode */}
          <div className={editorMode === 'seo' ? 'block' : 'hidden'}>
            <div className="bg-white border border-[#E6EFEA] rounded-b-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-[#0D3B3E] flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-[#1A8F4B]" />
                  <span>Google Search SERP Preview</span>
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF6F0] text-[#16723B]">
                  Search Ready
                </span>
              </div>

              {/* Google SERP Preview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs max-w-xl space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-[#0C4A4E] text-white flex items-center justify-center text-[9px] font-bold">
                    NA
                  </div>
                  <span className="font-semibold text-slate-800">narahariadhikari.com</span>
                  <span className="text-slate-400">&rsaquo;</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {storageFolder}/{slug || 'item-slug'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                  {metaTitle || title || 'Narahari Adhikari Chartered Accountants'}
                </h3>
                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {metaDescription || excerpt || 'Official advisory, statutory audit, and tax consulting publication by CA Narahari Adhikari.'}
                </p>
              </div>

              {/* SEO Inputs */}
              <div className="space-y-4 pt-2 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1 font-bold text-[#0D3B3E]">
                    <label>Meta Title</label>
                    <span className="text-[11px] text-[#627A7D] font-normal">
                      {metaTitle.length}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Enter meta title for Google results..."
                    className="w-full p-2.5 border border-[#DCE5E2] rounded-xl focus:border-[#1A8F4B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 font-bold text-[#0D3B3E]">
                    <label>Meta Description</label>
                    <span className="text-[11px] text-[#627A7D] font-normal">
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Compelling description for searchers..."
                    className="w-full p-2.5 border border-[#DCE5E2] rounded-xl focus:border-[#1A8F4B] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-[#0D3B3E]">
                    Focus Target Keyword
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. Corporate Tax Nepal, Statutory Audit"
                    className="w-full p-2.5 border border-[#DCE5E2] rounded-xl focus:border-[#1A8F4B] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt Box */}
          <div className="bg-white border border-[#E6EFEA] rounded-2xl p-5 shadow-xs space-y-2 text-xs">
            <span className="font-extrabold text-[#0D3B3E] block">Summary Excerpt</span>
            <p className="text-[11px] text-[#556E70]">
              Brief preview displayed on public cards and index listings.
            </p>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary..."
              className="w-full p-2.5 border border-[#DCE5E2] rounded-xl focus:border-[#1A8F4B] focus:outline-hidden bg-[#F9FCFA]"
            />
          </div>
        </div>

        {/* Right Column: Status, Featured Image, Categories, Tags (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Status & Publication Box */}
          <div className="bg-white border border-[#E6EFEA] rounded-2xl p-5 shadow-xs space-y-4 text-xs">
            <span className="font-extrabold text-[#0D3B3E] block pb-2 border-b border-slate-100">
              Publication Settings
            </span>

            <div className="flex items-center justify-between">
              <span className="text-[#556E70]">{draftsEnabled ? 'Status:' : 'Homepage placement:'}</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="font-bold text-[#0D3B3E] bg-[#F9FCFA] border border-[#DCE5E2] rounded-xl px-3 py-1.5 text-xs cursor-pointer"
              >
                <option value="published">{draftsEnabled ? 'Published Live' : 'Featured service'}</option>
                <option value="draft">{draftsEnabled ? 'Draft Review' : 'Standard service'}</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {onDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-rose-600 hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0C4A4E] hover:bg-[#083639] disabled:cursor-wait disabled:opacity-60 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isSaving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : null}
                {isSaving ? 'Saving…' : draftsEnabled ? (status === 'published' ? 'Update' : 'Publish') : 'Save Service'}
              </button>
            </div>
          </div>

          {/* Featured Image Box (Integrated with Media Library) */}
          <div className="bg-white border border-[#E6EFEA] rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-[#0D3B3E]">Featured Image</span>
              <button
                type="button"
                onClick={() => handleOpenMediaLibrary('featured')}
                className="text-[11px] font-bold text-[#1A8F4B] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FolderOpen className="w-3 h-3" />
                <span>Media Library</span>
              </button>
            </div>

            {featuredImage ? (
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image
                    src={featuredImage}
                    alt="Featured Image Preview"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenMediaLibrary('featured')}
                    className="text-[#1A8F4B] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Replace Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveFeaturedImage}
                    className="text-rose-600 hover:underline font-medium text-xs cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleOpenMediaLibrary('featured')}
                className="border-2 border-dashed border-[#DCE5E2] hover:border-[#1A8F4B] rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2 bg-[#F9FCFA]"
              >
                <Upload className="w-6 h-6 mx-auto text-[#1A8F4B]" />
                <div>
                  <span className="text-xs font-bold text-[#0D3B3E] block">Set Featured Image</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Choose from Media Library or upload new
                  </span>
                </div>
              </div>
            )}
          </div>

          {storageFolder === 'blog' && <>
          {/* Categories Box */}
          <div className="bg-white border border-[#E6EFEA] rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <span className="font-extrabold text-[#0D3B3E] block pb-2 border-b border-slate-100">
              Category
            </span>

            <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
              {categoriesList.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 text-[#33475B] hover:text-[#0D3B3E] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="contentCategory"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="rounded text-[#1A8F4B] focus:ring-[#1A8F4B]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              {!showAddCategory ? (
                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="text-[#1A8F4B] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Category</span>
                </button>
              ) : (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category Name"
                    className="w-full p-2 border border-[#DCE5E2] rounded-xl text-xs"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-3 py-1 bg-[#0C4A4E] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(false)}
                      className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags Box */}
          <div className="bg-white border border-[#E6EFEA] rounded-2xl p-5 shadow-xs space-y-3 text-xs">
            <span className="font-extrabold text-[#0D3B3E] block pb-2 border-b border-slate-100">
              Tags
            </span>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 p-2 border border-[#DCE5E2] rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[#EAF6F0] text-[#1A8F4B] rounded-xl font-bold text-xs cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-[#F4F8F6] text-[#0D3B3E] px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-[#E4EEE8]"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          </>}
        </div>
      </div>
    </div>
  );
}
