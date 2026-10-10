'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ServiceItem } from '@/types';
import ContentEditor, { ContentEditorData } from '@/components/admin/ContentEditor';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { serviceArticleHtml } from '@/lib/article-content';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Search,
  Star,
  ArrowRight,
  FileText,
  ShieldCheck,
  TrendingUp,
  Building2,
  Handshake,
  MessageSquareQuote,
  HeartHandshake,
  LineChart,
  GraduationCap,
  Trash2,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ReceiptText: FileText,
  ShieldCheck: ShieldCheck,
  TrendingUp: TrendingUp,
  Building2: Building2,
  Handshake: Handshake,
  MessageSquareQuote: MessageSquareQuote,
  HeartHandshake: HeartHandshake,
  LineChart: LineChart,
  GraduationCap: GraduationCap,
};

export default function AdminServicesPage() {
  const { services, addService, updateService, deleteService } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'featured'>('all');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  const filteredServices = services.filter((srv) => {
    const matchesQuery =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterTab === 'all' || (filterTab === 'featured' && srv.is_featured);
    return matchesQuery && matchesFilter;
  });

  const handleEditorSave = async (data: ContentEditorData): Promise<boolean> => {
    const payload = {
      title: data.title,
      slug: data.slug,
      short_description: data.excerpt || data.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160),
      full_description: sanitizeHtml(data.content),
      deliverables: [],
      target_audience: editingService?.target_audience || '',
      icon: editingService?.icon || 'Briefcase',
      display_order: editingService?.display_order ?? services.length,
      image: data.featuredImage,
      image_name: data.featuredImageName,
      image_alt: data.featuredImageAlt,
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,
      focus_keyword: data.focusKeyword,
      is_featured: data.status === 'published',
    } satisfies Omit<ServiceItem, 'id'>;
    const saved = editingService
      ? await updateService(editingService.id, payload)
      : await addService(payload);
    if (!saved) {
      setToastMessage('Service could not be saved. Check your CMS session and try again.');
      return false;
    }

    setToastMessage(`Service "${data.title}" ${editingService ? 'updated' : 'created'} successfully`);
    setTimeout(() => setToastMessage(null), 3000);
    setEditingService(null);
    setIsCreatingService(false);
    return true;
  };

  const handleDeleteService = async (service: ServiceItem) => {
    const deleted = await deleteService(service.id);
    if (!deleted) {
      setToastMessage('Service could not be deleted. Check your CMS session and try again.');
      return;
    }
    setToastMessage(`Service "${service.title}" deleted`);
    setEditingService(null);
    setServiceToDelete(null);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // If in Editor Mode
  if (editingService || isCreatingService) {
    const editorInitialData: ContentEditorData = {
      title: editingService?.title || '',
      slug: editingService?.slug || '',
      content: editingService ? serviceArticleHtml(editingService) : '',
      excerpt: editingService?.short_description || '',
      category: 'Practice Services',
      tags: ['Tax', 'Advisory', 'Compliance'],
      featuredImage: editingService?.image,
      featuredImageName: editingService?.image_name || '',
      featuredImageAlt: editingService?.image_alt || '',
      status: editingService?.is_featured ? 'published' : 'draft',
      metaTitle: editingService?.meta_title || '',
      metaDescription: editingService?.meta_description || '',
      focusKeyword: editingService?.focus_keyword || '',
    };

    return (
        <ContentEditor
        itemTypeLabel="Service"
        storageFolder="services"
        initialData={editorInitialData}
        availableCategories={['Audit & Assurance', 'Tax Advisory', 'Corporate Law', 'Accounting']}
        draftsEnabled={false}
        onSave={handleEditorSave}
        onCancel={() => { setEditingService(null); setIsCreatingService(false); }}
        onDelete={editingService ? () => { void handleDeleteService(editingService); } : undefined}
      />
    );
  }

  return (
    <div className="space-y-7 max-w-[1400px] mx-auto pb-14 text-slate-800 font-sans">
      <ConfirmModal
        isOpen={!!serviceToDelete}
        title="Delete Service Article"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? This removes the service from the public site.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger
        onConfirm={() => { if (serviceToDelete) void handleDeleteService(serviceToDelete); }}
        onCancel={() => setServiceToDelete(null)}
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
            Practice Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your public service catalog with rich formatting and SEO controls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => { setEditingService(null); setIsCreatingService(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A8F4B] text-white text-xs font-semibold hover:bg-[#146F3A]"
          >
            <Plus className="w-3.5 h-3.5" /> Add service
          </button>
          <Link
            href="/services"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar (Clean, no bloated stat numbers) */}
      <div className="bg-white border border-[#E8EFF0] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name, description..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[#1A8F4B] focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-[#0D3B3E] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Services ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('featured')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterTab === 'featured'
                ? 'bg-white text-[#0D3B3E] shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Featured ({services.filter((s) => s.is_featured).length})
          </button>
        </div>
      </div>

      {/* Services Grid (Matching EXACTLY the Public Services Page Card Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service, index) => {
          const Icon = iconMap[service.icon] || Briefcase;
          const serviceImage = service.image || '/Logo.png';

          return (
            <div
              key={service.id}
              className="group flex flex-col justify-between bg-white rounded-3xl border border-[#E8EBEF] overflow-hidden hover:shadow-xl hover:border-[#CCD7DC] transition-all duration-300"
            >
              <div>
                {/* Service Photo with 16/10 aspect ratio and zoom */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={serviceImage}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Floating icon pill in top-left matching public page */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-xs text-[#023A51] flex items-center justify-center shadow-md">
                    <Icon className="w-4 h-4 text-[#023A51]" />
                  </div>

                  {service.is_featured && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10.5px] font-bold border border-white/20">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Card Content matching public page */}
                <div className="p-6 sm:p-7 space-y-3">
                  <h2 className="text-xl font-bold text-[#023A51] leading-snug group-hover:text-[#2CBC63] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-xs sm:text-[13.5px] text-[#4A5259] leading-relaxed line-clamp-3">
                    {service.short_description}
                  </p>
                </div>
              </div>

              {/* Direct Actions in Card Footer */}
              <div className="px-6 sm:px-7 pb-6 pt-2">
                <div className="pt-4 border-t border-[#E8EBEF] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingService(service)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0C4A4E] hover:bg-[#083639] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setServiceToDelete(service)} title="Delete service article" className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#023A51] hover:text-[#2CBC63] transition-colors"
                  >
                    <span>Preview page</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2CBC63]" />
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
