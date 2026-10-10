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
  ContactMessage,
  GovernmentLink,
  DownloadResource,
  Announcement,
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
  settingsLoaded: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  toggleCareers: (forced?: boolean) => Promise<boolean>;
  announcements: Announcement[];
  announcementsLoaded: boolean;
  addAnnouncement: (item: Omit<Announcement, 'id' | 'created_at'>) => Promise<boolean>;
  updateAnnouncement: (id: string, item: Partial<Announcement>) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;

  taxUpdates: TaxUpdate[];
  taxUpdatesLoaded: boolean;
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
  deleteService: (id: string) => Promise<boolean>;

  vacancies: Vacancy[];
  vacanciesLoaded: boolean;
  addVacancy: (vac: Omit<Vacancy, 'id'>) => Promise<boolean>;
  updateVacancy: (id: string, vac: Partial<Vacancy>) => Promise<boolean>;
  deleteVacancy: (id: string) => Promise<boolean>;

  applications: JobApplication[];
  addApplication: (app: Omit<JobApplication, 'id' | 'submitted_at'>) => Promise<boolean>;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => Promise<boolean>;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<boolean>;

  contactMessages: ContactMessage[];
  updateContactMessageStatus: (id: string, status: ContactMessage['status']) => Promise<boolean>;

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
  const [settingsLoaded, setSettingsLoaded] = useState(() => !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const [taxUpdates, setTaxUpdates] = useState<TaxUpdate[]>(initialTaxUpdates);
  const [taxUpdatesLoaded, setTaxUpdatesLoaded] = useState(() => !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies);
  const [vacanciesLoaded, setVacanciesLoaded] = useState(() => !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const [applications, setApplications] = useState<JobApplication[]>(initialJobApplications);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [governmentLinks, setGovernmentLinks] = useState<GovernmentLink[]>(initialGovernmentLinks);
  const [downloads, setDownloads] = useState<DownloadResource[]>(initialDownloads);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoaded, setAnnouncementsLoaded] = useState(() => !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) {
      const timer = window.setTimeout(() => {
        setSettingsLoaded(true);
        setTaxUpdatesLoaded(true);
        setVacanciesLoaded(true);
        setAnnouncementsLoaded(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const supabase = client;

    let cancelled = false;

    async function loadPublishedContent() {
      const [settingsResult, taxResult, postsResult, vacanciesResult, applicationsResult, appointmentsResult, contactMessagesResult, linksResult, downloadsResult, servicesResult, announcementsResult] = await Promise.all([
        supabase.from('site_settings').select('key,value'),
        supabase.from('tax_updates').select('*').order('published_at', { ascending: false }),
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        // The admin career workspace needs archived listings too; public pages filter active jobs at render time.
        supabase.from('vacancies').select('*').order('deadline', { ascending: true }),
        supabase.from('applications').select('*').order('submitted_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('government_links').select('*').order('display_order', { ascending: true }),
        supabase.from('download_resources').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('display_order', { ascending: true }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;
      setTaxUpdatesLoaded(true);
      setVacanciesLoaded(true);
      setAnnouncementsLoaded(true);
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
      if (!contactMessagesResult.error && contactMessagesResult.data) setContactMessages(contactMessagesResult.data as ContactMessage[]);
      if (!linksResult.error && linksResult.data) setGovernmentLinks(linksResult.data as GovernmentLink[]);
      if (!downloadsResult.error && downloadsResult.data) setDownloads(downloadsResult.data as DownloadResource[]);
      if (!servicesResult.error && servicesResult.data) setServices(servicesResult.data as ServiceItem[]);
      if (!announcementsResult.error && announcementsResult.data) setAnnouncements(announcementsResult.data as Announcement[]);
    }

    void loadPublishedContent().catch(() => undefined).finally(() => {
      if (!cancelled) {
        setSettingsLoaded(true);
        setTaxUpdatesLoaded(true);
        setVacanciesLoaded(true);
        setAnnouncementsLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    try {
      const rows = Object.entries(newSettings).map(([key, value]) => ({ key, value }));
      const { data, error } = await client.from('site_settings').upsert(rows, { onConflict: 'key' }).select('key');
      if (error || data?.length !== rows.length) return false;
      setSettings((prev) => ({ ...prev, ...newSettings }));
      return true;
    } catch {
      return false;
    }
  };

  const toggleCareers = async (forced?: boolean) => updateSettings({ careers_enabled: forced ?? !settings.careers_enabled });
  const addAnnouncement = async (item: Omit<Announcement, 'id' | 'created_at'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('announcements').insert(item).select().single();
    if (error || !data) return false;
    setAnnouncements((current) => [data as Announcement, ...current]);
    return true;
  };

  const updateAnnouncement = async (id: string, item: Partial<Announcement>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('announcements').update(item).eq('id', id).select().maybeSingle();
    if (error || !data) return false;
    setAnnouncements((current) => current.map((announcement) => announcement.id === id ? { ...announcement, ...data } as Announcement : announcement));
    return true;
  };

  const deleteAnnouncement = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { error } = await client.from('announcements').delete().eq('id', id);
    if (error) return false;
    setAnnouncements((current) => current.filter((announcement) => announcement.id !== id));
    return true;
  };

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
    const response = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, published_at: post.published_at || new Date().toISOString().split('T')[0] }),
    });
    const result = await response.json() as { post?: BlogPost; error?: string };
    if (!response.ok || !result.post) throw new Error(result.error || 'The article could not be saved.');

    setBlogPosts((prev) => {
      const updated = [result.post!, ...prev.filter((p) => p.slug !== result.post!.slug)];
      return updated;
    });
    return true;
  };

  const updateBlogPost = async (id: string, post: Partial<BlogPost>) => {
    const response = await fetch('/api/admin/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...post }),
    });
    const result = await response.json() as { post?: BlogPost; error?: string };
    if (!response.ok || !result.post) throw new Error(result.error || 'The article could not be updated.');
    setBlogPosts((prev) => {
      return prev.map((p) => (p.id === id ? result.post! : p));
    });

    return true;
  };

  const deleteBlogPost = async (id: string) => {
    const response = await fetch('/api/admin/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) throw new Error(result.error || 'The article could not be deleted.');
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const addService = async (srv: Omit<ServiceItem, 'id'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { data, error } = await client.from('services').insert({
      title: srv.title, slug: srv.slug, short_description: srv.short_description, full_description: srv.full_description,
      deliverables: srv.deliverables, target_audience: srv.target_audience, icon: srv.icon, display_order: srv.display_order,
      is_featured: srv.is_featured, image: srv.image, image_name: srv.image_name || '', meta_title: srv.meta_title, meta_description: srv.meta_description, focus_keyword: srv.focus_keyword,
      image_alt: srv.image_alt || '',
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

  const deleteService = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('service-')) return false;
    const { error } = await client.from('services').delete().eq('id', id);
    if (error) return false;
    setServices((prev) => prev.filter((service) => service.id !== id));
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
    const { data, error } = await client.from('vacancies').update(vac).eq('id', id).select('id').maybeSingle();
    if (error || !data) return false;
    setVacancies((prev) => prev.map((v) => (v.id === id ? { ...v, ...vac } : v)));
    return true;
  };

  const deleteVacancy = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('vac-')) return false;
    const { data, error } = await client.from('vacancies').delete().eq('id', id).select('id').maybeSingle();
    if (error || !data) return false;
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
    if (id.startsWith('app-')) return false;
    const response = await fetch('/api/admin/records/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordType: 'applications', id, status }),
    });
    if (!response.ok) return false;
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
    if (id.startsWith('apt-')) return false;
    const response = await fetch('/api/admin/records/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordType: 'appointments', id, status }),
    });
    if (!response.ok) return false;
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    return true;
  };

  const updateContactMessageStatus = async (id: string, status: ContactMessage['status']) => {
    const response = await fetch('/api/admin/records/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordType: 'contact_messages', id, status }),
    });
    if (!response.ok) return false;
    setContactMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message));
    return true;
  };

  const addGovernmentLink = async (link: Omit<GovernmentLink, 'id'>) => {
    const response = await fetch('/api/admin/government-links', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(link),
    });
    if (!response.ok) {
      const result = await response.json() as { error?: string };
      throw new Error(result.error || 'The portal could not be saved.');
    }
    const { link: saved } = await response.json() as { link: GovernmentLink };
    setGovernmentLinks((prev) => [...prev, saved]);
    return true;
  };

  const updateGovernmentLink = async (id: string, link: Partial<GovernmentLink>) => {
    if (id.startsWith('gov-')) return false;
    const response = await fetch('/api/admin/government-links', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, changes: link }),
    });
    if (!response.ok) {
      const result = await response.json() as { error?: string };
      throw new Error(result.error || 'The portal changes could not be saved.');
    }
    const { link: saved } = await response.json() as { link: GovernmentLink };
    setGovernmentLinks((prev) => prev.map((g) => (g.id === id ? saved : g)));
    return true;
  };

  const deleteGovernmentLink = async (id: string) => {
    if (id.startsWith('gov-')) return false;
    const response = await fetch('/api/admin/government-links', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    });
    if (!response.ok) return false;
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
    const { data, error } = await client.from('download_resources').update(item).eq('id', id).select('id').maybeSingle();
    if (error || !data) return false;
    setDownloads((prev) => prev.map((d) => (d.id === id ? { ...d, ...item } : d)));
    return true;
  };

  const deleteDownload = async (id: string) => {
    const client = createSupabaseBrowserClient();
    if (!client || id.startsWith('dl-')) return false;
    const { data, error } = await client.from('download_resources').delete().eq('id', id).select('id').maybeSingle();
    if (error || !data) return false;
    setDownloads((prev) => prev.filter((d) => d.id !== id));
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        settingsLoaded,
        updateSettings,
        toggleCareers,
        announcements,
        announcementsLoaded,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        taxUpdates,
        taxUpdatesLoaded,
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
        deleteService,
        vacancies,
        vacanciesLoaded,
        addVacancy,
        updateVacancy,
        deleteVacancy,
        applications,
        addApplication,
        updateApplicationStatus,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        contactMessages,
        updateContactMessageStatus,
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
