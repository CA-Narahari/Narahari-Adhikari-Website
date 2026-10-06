'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSettings,
  TaxUpdate,
  BlogPost,
  ServiceItem,
  Vacancy,
  JobApplication,
  Appointment,
  GovernmentLink,
  DownloadResource,
} from '@/types';
import {
  initialSiteSettings,
  initialTaxUpdates,
  initialBlogPosts,
  initialServices,
  initialVacancies,
  initialJobApplications,
  initialAppointments,
  initialGovernmentLinks,
  initialDownloads,
} from '@/lib/initial-data';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface AppContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  toggleCareers: (forced?: boolean) => Promise<boolean>;
  toggleAnnouncement: (active?: boolean) => Promise<boolean>;

  taxUpdates: TaxUpdate[];
  addTaxUpdate: (item: Omit<TaxUpdate, 'id'>) => Promise<boolean>;
  updateTaxUpdate: (id: string, item: Partial<TaxUpdate>) => Promise<boolean>;
  deleteTaxUpdate: (id: string) => Promise<boolean>;

  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<boolean>;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => Promise<boolean>;
  deleteBlogPost: (id: string) => Promise<boolean>;

  services: ServiceItem[];
  addService: (srv: Omit<ServiceItem, 'id'>) => Promise<boolean>;
  updateService: (id: string, srv: Partial<ServiceItem>) => Promise<boolean>;

  vacancies: Vacancy[];
  addVacancy: (vac: Omit<Vacancy, 'id'>) => Promise<boolean>;
  updateVacancy: (id: string, vac: Partial<Vacancy>) => Promise<boolean>;
  deleteVacancy: (id: string) => Promise<boolean>;

  applications: JobApplication[];
  addApplication: (app: Omit<JobApplication, 'id' | 'submitted_at'>) => Promise<boolean>;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => Promise<boolean>;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<boolean>;

  governmentLinks: GovernmentLink[];
  addGovernmentLink: (link: Omit<GovernmentLink, 'id'>) => Promise<boolean>;
  updateGovernmentLink: (id: string, link: Partial<GovernmentLink>) => Promise<boolean>;
  deleteGovernmentLink: (id: string) => Promise<boolean>;

  downloads: DownloadResource[];
  addDownload: (item: Omit<DownloadResource, 'id' | 'downloads_count'>) => Promise<boolean>;
  updateDownload: (id: string, item: Partial<DownloadResource>) => Promise<boolean>;
  deleteDownload: (id: string) => Promise<boolean>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [taxUpdates, setTaxUpdates] = useState<TaxUpdate[]>(initialTaxUpdates);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies);
  const [applications, setApplications] = useState<JobApplication[]>(initialJobApplications);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [governmentLinks, setGovernmentLinks] = useState<GovernmentLink[]>(initialGovernmentLinks);
  const [downloads, setDownloads] = useState<DownloadResource[]>(initialDownloads);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    const supabase = client;

    let cancelled = false;

    async function loadPublishedContent() {
      const [settingsResult, taxResult, postsResult, vacanciesResult, applicationsResult, appointmentsResult, linksResult, downloadsResult, servicesResult] = await Promise.all([
        supabase.from('site_settings').select('key,value'),
        supabase.from('tax_updates').select('*').eq('status', 'published').order('published_at', { ascending: false }),
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('vacancies').select('*').eq('is_active', true).order('deadline', { ascending: true }),
        supabase.from('applications').select('*').order('submitted_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('government_links').select('*').order('display_order', { ascending: true }),
        supabase.from('download_resources').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('display_order', { ascending: true }),
      ]);

      if (cancelled) return;
      if (!settingsResult.error && settingsResult.data?.length) {
        const dbSettings = settingsResult.data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {} as Partial<SiteSettings>);
        setSettings((previous) => ({ ...previous, ...dbSettings }));
      }
      if (!taxResult.error && taxResult.data) setTaxUpdates(taxResult.data as TaxUpdate[]);
      if (!postsResult.error && postsResult.data) {
        setBlogPosts(postsResult.data as BlogPost[]);
      }
      if (!vacanciesResult.error && vacanciesResult.data) setVacancies(vacanciesResult.data as Vacancy[]);
      if (!applicationsResult.error && applicationsResult.data) {
        setApplications(applicationsResult.data.map((item) => ({
          ...item,
          qualification: item.qualification || item.cover_note?.match(/^Qualification:\s*(.+?)(?:\r?\n\r?\n|$)/)?.[1] || '',
          cover_note: item.cover_note?.replace(/^Qualification:\s*.+?(?:\r?\n\r?\n|$)/, '') || '',
        })) as JobApplication[]);
      }
      if (!appointmentsResult.error && appointmentsResult.data) {
        setAppointments(appointmentsResult.data.map((item) => ({
          ...item,
          company_name: item.company_name || item.notes?.match(/^Organization:\s*(.+?)(?:\r?\n\r?\n|$)/)?.[1] || '',
          notes: item.notes?.replace(/^Organization:\s*.+?(?:\r?\n\r?\n|$)/, '') || '',
          date: item.requested_date,
          time_slot: item.requested_time,
        })) as Appointment[]);
      }
      if (!linksResult.error && linksResult.data) setGovernmentLinks(linksResult.data as GovernmentLink[]);
      if (!downloadsResult.error && downloadsResult.data) setDownloads(downloadsResult.data as DownloadResource[]);
      if (!servicesResult.error && servicesResult.data && servicesResult.data.length > 0) {
        const imageMap: Record<string, string> = {
          'audit-and-assurance': '/Logo.png',
          'taxation-consultancy': '/Logo.png',
          'mergers-and-acquisitions': '/Logo.png',
          'advisory-services': '/Logo.png',
          'business-support-outsourcing': '/Logo.png',
          'nfrs-ifrs-implementation': '/Logo.png',
          'training-and-seminar': '/Logo.png',
        };
        setServices(servicesResult.data.map((item: any) => ({
          ...item,
          image: item.image || imageMap[item.slug] || '/Logo.png',
        })) as ServiceItem[]);
      }
    }

    void loadPublishedContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const rows = Object.entries(newSettings).map(([key, value]) => ({ key, value }));
    const { error } = await client.from('site_settings').upsert(rows, { onConflict: 'key' });
    if (error) return false;
    setSettings((prev) => ({ ...prev, ...newSettings }));
    return true;
  };

  const toggleCareers = async (forced?: boolean) => updateSettings({ careers_enabled: forced ?? !settings.careers_enabled });
  const toggleAnnouncement = async (active?: boolean) => updateSettings({ announcement_active: active ?? !settings.announcement_active });

  const addTaxUpdate = async (item: Omit<TaxUpdate, 'id'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('tax_updates').insert(item).select().single();
    if (error || !data) return false;
    setTaxUpdates((prev) => [data as TaxUpdate, ...prev]);
    return true;
  };

  const updateTaxUpdate = async (id: string, item: Partial<TaxUpdate>) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('tax-')) return false;
    const { error } = await client.from('tax_updates').update(item).eq('id', id);
    if (error) return false;
    setTaxUpdates((prev) => prev.map((t) => (t.id === id ? { ...t, ...item } : t)));
    return true;
  };

  const deleteTaxUpdate = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('tax-')) return false;
    const { error } = await client.from('tax_updates').delete().eq('id', id);
    if (error) return false;
    setTaxUpdates((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  const addBlogPost = async (post: Omit<BlogPost, 'id'>) => {
    const tempId = `blog-${Date.now()}`;
    const newPost: BlogPost = {
      ...post,
      id: tempId,
    };

    const client = createSupabaseBrowserClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('posts')
          .insert({
            title: post.title,
            slug: post.slug,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            read_time: post.read_time,
            featured_image: post.featured_image,
            tags: post.tags,
            status: post.status,
            published_at: post.published_at || new Date().toISOString().split('T')[0],
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
            focus_keyword: post.focus_keyword || '',
          })
          .select()
          .single();

        if (error || !data) return false;
        newPost.id = data.id;
      } catch { return false; }
    }

    setBlogPosts((prev) => {
      const updated = [newPost, ...prev.filter((p) => p.slug !== newPost.slug)];
      return updated;
    });
    return true;
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('blog-')) {
      const dbPayload: Record<string, unknown> = {};
      const allowedCols = ['title', 'slug', 'category', 'excerpt', 'content', 'author', 'read_time', 'featured_image', 'tags', 'status', 'published_at', 'meta_title', 'meta_description', 'focus_keyword', 'image_alt'];
      for (const key of allowedCols) if (key in post && post[key as keyof BlogPost] !== undefined) dbPayload[key] = post[key as keyof BlogPost];
      const { error } = await client.from('posts').update(dbPayload).eq('id', id);
      if (error) return false;
    }
    setBlogPosts((prev) => {
      return prev.map((p) => (p.id === id ? { ...p, ...post } : p));
    });

    return true;
  };

  const deleteBlogPost = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('blog-')) return false;
    const { error } = await client.from('posts').delete().eq('id', id);
    if (error) return false;
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const addService = async (srv: Omit<ServiceItem, 'id'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('services').insert({
      title: srv.title, slug: srv.slug, short_description: srv.short_description, full_description: srv.full_description,
      deliverables: srv.deliverables, target_audience: srv.target_audience, icon: srv.icon, display_order: srv.display_order,
      is_featured: srv.is_featured, image: srv.image, meta_title: srv.meta_title, meta_description: srv.meta_description, focus_keyword: srv.focus_keyword,
    }).select().single();
    if (error || !data) return false;
    setServices((prev) => [...prev, data as ServiceItem]);
    return true;
  };

  const updateService = async (id: string, srv: Partial<ServiceItem>) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('service-')) return false;
    const { error } = await client.from('services').update(srv).eq('id', id);
    if (error) return false;
    setServices((prev) => {
      return prev.map((s) => (s.id === id ? { ...s, ...srv } : s));
    });
    return true;
  };

  const addVacancy = async (vac: Omit<Vacancy, 'id'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('vacancies').insert(vac).select().single();
    if (error || !data) return false;
    setVacancies((prev) => [data as Vacancy, ...prev]);
    return true;
  };

  const updateVacancy = async (id: string, vac: Partial<Vacancy>) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('vac-')) return false;
    const { error } = await client.from('vacancies').update(vac).eq('id', id);
    if (error) return false;
    setVacancies((prev) => prev.map((v) => (v.id === id ? { ...v, ...vac } : v)));
    return true;
  };

  const deleteVacancy = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('vac-')) return false;
    const { error } = await client.from('vacancies').delete().eq('id', id);
    if (error) return false;
    setVacancies((prev) => prev.filter((v) => v.id !== id));
    return true;
  };

  const addApplication = async (app: Omit<JobApplication, 'id' | 'submitted_at'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('applications').insert({ ...app, status: 'new' }).select().single();
    if (error || !data) return false;
    setApplications((prev) => [data as JobApplication, ...prev]);
    return true;
  };

  const updateApplicationStatus = async (id: string, status: JobApplication['status']) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('app-')) return false;
    const { error } = await client.from('applications').update({ status }).eq('id', id);
    if (error) return false;
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    return true;
  };

  const addAppointment = async (apt: Omit<Appointment, 'id' | 'created_at'>) => {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apt),
    });
    if (!response.ok) return false;
    const saved = (await response.json()) as { id: string; created_at: string };

    const newApt: Appointment = {
      ...apt,
      id: saved.id,
      created_at: saved.created_at,
    };
    setAppointments((prev) => [newApt, ...prev]);
    return true;
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('apt-')) return false;
    const { error } = await client.from('appointments').update({ status }).eq('id', id);
    if (error) return false;
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    return true;
  };

  const addGovernmentLink = async (link: Omit<GovernmentLink, 'id'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('government_links').insert(link).select().single();
    if (error || !data) return false;
    setGovernmentLinks((prev) => [...prev, data as GovernmentLink]);
    return true;
  };

  const updateGovernmentLink = async (id: string, link: Partial<GovernmentLink>) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('gov-')) return false;
    const { error } = await client.from('government_links').update(link).eq('id', id);
    if (error) return false;
    setGovernmentLinks((prev) => prev.map((g) => (g.id === id ? { ...g, ...link } : g)));
    return true;
  };

  const deleteGovernmentLink = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('gov-')) return false;
    const { error } = await client.from('government_links').delete().eq('id', id);
    if (error) return false;
    setGovernmentLinks((prev) => prev.filter((g) => g.id !== id));
    return true;
  };

  const addDownload = async (item: Omit<DownloadResource, 'id' | 'downloads_count'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('download_resources').insert({ ...item, downloads_count: 0 }).select().single();
    if (error || !data) return false;
    setDownloads((prev) => [data as DownloadResource, ...prev]);
    return true;
  };

  const updateDownload = async (id: string, item: Partial<DownloadResource>) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('dl-')) return false;
    const { error } = await client.from('download_resources').update(item).eq('id', id);
    if (error) return false;
    setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, ...item } : d)));
    return true;
  };

  const deleteDownload = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('dl-')) return false;
    const { error } = await client.from('download_resources').delete().eq('id', id);
    if (error) return false;
    setDownloads((prev) => prev.filter((d) => d.id !== id));
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        toggleCareers,
        toggleAnnouncement,
        taxUpdates,
        addTaxUpdate,
        updateTaxUpdate,
        deleteTaxUpdate,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        services,
        addService,
        updateService,
        vacancies,
        addVacancy,
        updateVacancy,
        deleteVacancy,
        applications,
        addApplication,
        updateApplicationStatus,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        governmentLinks,
        addGovernmentLink,
        updateGovernmentLink,
        deleteGovernmentLink,
        downloads,
        addDownload,
        updateDownload,
        deleteDownload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
