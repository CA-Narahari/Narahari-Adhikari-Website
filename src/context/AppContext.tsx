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
  OfficeHourDay,
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
  initialOfficeHours,
} from '@/lib/initial-data';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface AppContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  toggleCareers: (forced?: boolean) => void;
  toggleAnnouncement: (active?: boolean) => void;

  taxUpdates: TaxUpdate[];
  addTaxUpdate: (item: Omit<TaxUpdate, 'id'>) => void;
  updateTaxUpdate: (id: string, item: Partial<TaxUpdate>) => void;
  deleteTaxUpdate: (id: string) => void;

  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  services: ServiceItem[];
  updateService: (id: string, srv: Partial<ServiceItem>) => void;

  vacancies: Vacancy[];
  addVacancy: (vac: Omit<Vacancy, 'id'>) => void;
  updateVacancy: (id: string, vac: Partial<Vacancy>) => void;
  deleteVacancy: (id: string) => void;

  applications: JobApplication[];
  addApplication: (app: Omit<JobApplication, 'id' | 'submitted_at'>) => void;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => void;

  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>) => Promise<boolean>;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  governmentLinks: GovernmentLink[];
  addGovernmentLink: (link: Omit<GovernmentLink, 'id'>) => void;
  updateGovernmentLink: (id: string, link: Partial<GovernmentLink>) => void;
  deleteGovernmentLink: (id: string) => void;

  downloads: DownloadResource[];
  addDownload: (item: Omit<DownloadResource, 'id' | 'downloads_count'>) => void;
  updateDownload: (id: string, item: Partial<DownloadResource>) => void;
  deleteDownload: (id: string) => void;

  officeHours: OfficeHourDay[];
  updateOfficeHours: (day: string, hours: string, is_open: boolean) => void;
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
  const [officeHours, setOfficeHours] = useState<OfficeHourDay[]>(initialOfficeHours);

  // Load from local storage for persistence across admin and public views
  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const storedSettings = localStorage.getItem('ca_site_settings');
        if (storedSettings) setSettings(JSON.parse(storedSettings));

        const storedTax = localStorage.getItem('ca_tax_updates');
        if (storedTax) {
          const saved = JSON.parse(storedTax) as TaxUpdate[];
          const cleaned = saved.filter((item) => !/^tax-[1-9]\d*$/.test(item.id));
          setTaxUpdates(cleaned);
          if (cleaned.length !== saved.length) localStorage.setItem('ca_tax_updates', JSON.stringify(cleaned));
        }

        const storedVac = localStorage.getItem('ca_vacancies');
        if (storedVac) {
          const saved = JSON.parse(storedVac) as Vacancy[];
          const cleaned = saved.filter((item) => !/^vac-[1-9]\d*$/.test(item.id));
          setVacancies(cleaned);
          if (cleaned.length !== saved.length) localStorage.setItem('ca_vacancies', JSON.stringify(cleaned));
        }

        const storedApps = localStorage.getItem('ca_applications');
        if (storedApps) {
          const saved = JSON.parse(storedApps) as JobApplication[];
          const cleaned = saved.filter((item) => !/^app-10[1-9]$/.test(item.id));
          setApplications(cleaned);
          if (cleaned.length !== saved.length) localStorage.setItem('ca_applications', JSON.stringify(cleaned));
        }

        const storedApts = localStorage.getItem('ca_appointments');
        if (storedApts) {
          const saved = JSON.parse(storedApts) as Appointment[];
          const cleaned = saved.filter((item) => !/^apt-20[1-9]$/.test(item.id));
          setAppointments(cleaned);
          if (cleaned.length !== saved.length) localStorage.setItem('ca_appointments', JSON.stringify(cleaned));
        }

        const storedGov = localStorage.getItem('ca_gov_links');
        if (storedGov) {
          const parsed = JSON.parse(storedGov);
          setGovernmentLinks(Array.isArray(parsed) && parsed.length >= 11 ? parsed : initialGovernmentLinks);
        }

        const storedDl = localStorage.getItem('ca_downloads');
        if (storedDl) {
          const saved = JSON.parse(storedDl) as DownloadResource[];
          const cleaned = saved.filter((item) => !/^dl-[1-9]\d*$/.test(item.id));
          setDownloads(cleaned);
          if (cleaned.length !== saved.length) localStorage.setItem('ca_downloads', JSON.stringify(cleaned));
        }

        const storedHours = localStorage.getItem('ca_office_hours');
        if (storedHours) setOfficeHours(JSON.parse(storedHours));
      } catch {
        // ignore malformed local data and keep the initial fallback
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const client = createSupabaseBrowserClient();
    if (!client) return;
    const supabase = client;

    let cancelled = false;

    async function loadPublishedContent() {
      const [taxResult, postsResult, vacanciesResult, applicationsResult, appointmentsResult, linksResult, downloadsResult, hoursResult] = await Promise.all([
        supabase.from('tax_updates').select('*').eq('status', 'published').order('published_at', { ascending: false }),
        supabase.from('posts').select('*').eq('status', 'published').order('published_at', { ascending: false }),
        supabase.from('vacancies').select('*').eq('is_active', true).order('deadline', { ascending: true }),
        supabase.from('applications').select('*').order('submitted_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('government_links').select('*').order('display_order', { ascending: true }),
        supabase.from('download_resources').select('*').order('created_at', { ascending: false }),
        supabase.from('office_hours').select('*'),
      ]);

      if (cancelled) return;
      if (!taxResult.error && taxResult.data) setTaxUpdates(taxResult.data as TaxUpdate[]);
      if (!postsResult.error && postsResult.data) setBlogPosts(postsResult.data as BlogPost[]);
      if (!vacanciesResult.error && vacanciesResult.data) setVacancies(vacanciesResult.data as Vacancy[]);
      if (!applicationsResult.error && applicationsResult.data) setApplications(applicationsResult.data as JobApplication[]);
      if (!appointmentsResult.error && appointmentsResult.data) {
        setAppointments(appointmentsResult.data.map((item) => ({
          ...item,
          date: item.requested_date,
          time_slot: item.requested_time,
        })) as Appointment[]);
      }
      if (!linksResult.error && linksResult.data) setGovernmentLinks(linksResult.data as GovernmentLink[]);
      if (!downloadsResult.error && downloadsResult.data) setDownloads(downloadsResult.data as DownloadResource[]);
      if (!hoursResult.error && hoursResult.data) setOfficeHours(hoursResult.data as OfficeHourDay[]);
    }

    void loadPublishedContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('ca_site_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCareers = (forced?: boolean) => {
    setSettings((prev) => {
      const nextVal = forced !== undefined ? forced : !prev.careers_enabled;
      const updated = { ...prev, careers_enabled: nextVal };
      localStorage.setItem('ca_site_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleAnnouncement = (active?: boolean) => {
    setSettings((prev) => {
      const nextVal = active !== undefined ? active : !prev.announcement_active;
      const updated = { ...prev, announcement_active: nextVal };
      localStorage.setItem('ca_site_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const addTaxUpdate = (item: Omit<TaxUpdate, 'id'>) => {
    const newItem: TaxUpdate = {
      ...item,
      id: `tax-${Date.now()}`,
    };
    setTaxUpdates((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('ca_tax_updates', JSON.stringify(updated));
      return updated;
    });

    const client = createSupabaseBrowserClient();
    if (client) {
      void client.from('tax_updates').insert({
        title: item.title,
        slug: item.slug,
        category: item.category,
        update_type: item.update_type,
        topic: item.topic,
        sector: item.sector,
        effective_date: item.effective_date,
        summary: item.summary,
        content: item.content,
        source_name: item.source_name,
        source_url: item.source_url,
        is_urgent: item.is_urgent,
        status: item.status,
        published_at: item.published_at || new Date().toISOString().split('T')[0],
      });
    }
  };

  const updateTaxUpdate = (id: string, item: Partial<TaxUpdate>) => {
    setTaxUpdates((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...item } : t));
      localStorage.setItem('ca_tax_updates', JSON.stringify(updated));
      return updated;
    });

    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('tax-')) {
      void client.from('tax_updates').update(item).eq('id', id);
    }
  };

  const deleteTaxUpdate = (id: string) => {
    setTaxUpdates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem('ca_tax_updates', JSON.stringify(updated));
      return updated;
    });

    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('tax-')) {
      void client.from('tax_updates').delete().eq('id', id);
    }
  };

  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
    };
    setBlogPosts((prev) => [newPost, ...prev]);

    const client = createSupabaseBrowserClient();
    if (client) {
      void client.from('posts').insert({
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
      });
    }
  };

  const updateBlogPost = (id: string, post: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...post } : p)));

    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('blog-')) {
      void client.from('posts').update(post).eq('id', id);
    }
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));

    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('blog-')) {
      void client.from('posts').delete().eq('id', id);
    }
  };

  const updateService = (id: string, srv: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...srv } : s)));
  };

  const addVacancy = (vac: Omit<Vacancy, 'id'>) => {
    const newVac: Vacancy = {
      ...vac,
      id: `vac-${Date.now()}`,
    };
    setVacancies((prev) => {
      const updated = [newVac, ...prev];
      localStorage.setItem('ca_vacancies', JSON.stringify(updated));
      return updated;
    });

    const client = createSupabaseBrowserClient();
    if (client) {
      void client.from('vacancies').insert({
        title: vac.title,
        department: vac.department,
        location: vac.location,
        employment_type: vac.employment_type,
        description: vac.description,
        requirements: vac.requirements,
        deadline: vac.deadline,
        is_active: vac.is_active,
      });
    }
  };

  const updateVacancy = (id: string, vac: Partial<Vacancy>) => {
    setVacancies((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, ...vac } : v));
      localStorage.setItem('ca_vacancies', JSON.stringify(updated));
      return updated;
    });

    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('vac-')) {
      void client.from('vacancies').update(vac).eq('id', id);
    }
  };

  const deleteVacancy = (id: string) => {
    setVacancies((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      localStorage.setItem('ca_vacancies', JSON.stringify(updated));
      return updated;
    });

    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('vac-')) {
      void client.from('vacancies').delete().eq('id', id);
    }
  };

  const addApplication = (app: Omit<JobApplication, 'id' | 'submitted_at'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newApp: JobApplication = {
      ...app,
      id: `app-${Date.now()}`,
      submitted_at: formattedDate,
    };
    setApplications((prev) => {
      const updated = [newApp, ...prev];
      localStorage.setItem('ca_applications', JSON.stringify(updated));
      return updated;
    });

    const client = createSupabaseBrowserClient();
    if (client) {
      void client.from('applications').insert({
        vacancy_title: app.vacancy_title,
        applicant_name: app.applicant_name,
        applicant_email: app.applicant_email,
        applicant_phone: app.applicant_phone,
        cover_note: app.cover_note,
        cv_filename: app.cv_filename,
        status: 'new',
      });
    }
  };

  const updateApplicationStatus = (id: string, status: JobApplication['status']) => {
    setApplications((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem('ca_applications', JSON.stringify(updated));
      return updated;
    });
    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('app-')) {
      void client.from('applications').update({ status }).eq('id', id);
    }
  };

  const addAppointment = async (apt: Omit<Appointment, 'id' | 'created_at'>) => {
    const client = createSupabaseBrowserClient();
    if (!client) return false;
    const { error } = await client.from('appointments').insert({
      client_name: apt.client_name,
      client_email: apt.client_email,
      client_phone: apt.client_phone,
      service_title: apt.service_title,
      consultation_type: apt.consultation_type,
      requested_date: apt.date,
      requested_time: apt.time_slot,
      notes: apt.notes,
      privacy_consent: true,
      status: 'pending',
    });
    if (error) return false;

    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
    return true;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem('ca_appointments', JSON.stringify(updated));
      return updated;
    });
    const client = createSupabaseBrowserClient();
    if (client && !id.startsWith('apt-')) {
      void client.from('appointments').update({ status }).eq('id', id);
    }
  };

  const updateOfficeHours = (day: string, hours: string, is_open: boolean) => {
    setOfficeHours((prev) => {
      const updated = prev.map((h) => (h.day === day ? { ...h, hours, is_open } : h));
      localStorage.setItem('ca_office_hours', JSON.stringify(updated));
      return updated;
    });
  };

  const addGovernmentLink = (link: Omit<GovernmentLink, 'id'>) => {
    const newItem: GovernmentLink = {
      ...link,
      id: `gov-${Date.now()}`,
    };
    setGovernmentLinks((prev) => {
      const updated = [...prev, newItem];
      localStorage.setItem('ca_gov_links', JSON.stringify(updated));
      return updated;
    });
  };

  const updateGovernmentLink = (id: string, link: Partial<GovernmentLink>) => {
    setGovernmentLinks((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, ...link } : g));
      localStorage.setItem('ca_gov_links', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteGovernmentLink = (id: string) => {
    setGovernmentLinks((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      localStorage.setItem('ca_gov_links', JSON.stringify(updated));
      return updated;
    });
  };

  const addDownload = (item: Omit<DownloadResource, 'id' | 'downloads_count'>) => {
    const newItem: DownloadResource = {
      ...item,
      id: `dl-${Date.now()}`,
      downloads_count: 0,
    };
    setDownloads((prev) => {
      const updated = [newItem, ...prev];
      localStorage.setItem('ca_downloads', JSON.stringify(updated));
      return updated;
    });
  };

  const updateDownload = (id: string, item: Partial<DownloadResource>) => {
    setDownloads((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, ...item } : d));
      localStorage.setItem('ca_downloads', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteDownload = (id: string) => {
    setDownloads((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem('ca_downloads', JSON.stringify(updated));
      return updated;
    });
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
        officeHours,
        updateOfficeHours,
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
