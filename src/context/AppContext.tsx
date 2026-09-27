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
  addAppointment: (apt: Omit<Appointment, 'id' | 'created_at'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  governmentLinks: GovernmentLink[];
  downloads: DownloadResource[];
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
  const [governmentLinks] = useState<GovernmentLink[]>(initialGovernmentLinks);
  const [downloads] = useState<DownloadResource[]>(initialDownloads);
  const [officeHours, setOfficeHours] = useState<OfficeHourDay[]>(initialOfficeHours);

  // Load from local storage for persistence across admin and public views
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('ca_site_settings');
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedTax = localStorage.getItem('ca_tax_updates');
      if (storedTax) setTaxUpdates(JSON.parse(storedTax));

      const storedVac = localStorage.getItem('ca_vacancies');
      if (storedVac) setVacancies(JSON.parse(storedVac));

      const storedApps = localStorage.getItem('ca_applications');
      if (storedApps) setApplications(JSON.parse(storedApps));

      const storedApts = localStorage.getItem('ca_appointments');
      if (storedApts) setAppointments(JSON.parse(storedApts));

      const storedHours = localStorage.getItem('ca_office_hours');
      if (storedHours) setOfficeHours(JSON.parse(storedHours));
    } catch {
      // ignore
    }
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
  };

  const updateTaxUpdate = (id: string, item: Partial<TaxUpdate>) => {
    setTaxUpdates((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...item } : t));
      localStorage.setItem('ca_tax_updates', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTaxUpdate = (id: string) => {
    setTaxUpdates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem('ca_tax_updates', JSON.stringify(updated));
      return updated;
    });
  };

  const addBlogPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
    };
    setBlogPosts((prev) => [newPost, ...prev]);
  };

  const updateBlogPost = (id: string, post: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...post } : p)));
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
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
  };

  const updateVacancy = (id: string, vac: Partial<Vacancy>) => {
    setVacancies((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, ...vac } : v));
      localStorage.setItem('ca_vacancies', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteVacancy = (id: string) => {
    setVacancies((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      localStorage.setItem('ca_vacancies', JSON.stringify(updated));
      return updated;
    });
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
  };

  const updateApplicationStatus = (id: string, status: JobApplication['status']) => {
    setApplications((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem('ca_applications', JSON.stringify(updated));
      return updated;
    });
  };

  const addAppointment = (apt: Omit<Appointment, 'id' | 'created_at'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      created_at: formattedDate,
    };
    setAppointments((prev) => {
      const updated = [newApt, ...prev];
      localStorage.setItem('ca_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      localStorage.setItem('ca_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const updateOfficeHours = (day: string, hours: string, is_open: boolean) => {
    setOfficeHours((prev) => {
      const updated = prev.map((h) => (h.day === day ? { ...h, hours, is_open } : h));
      localStorage.setItem('ca_office_hours', JSON.stringify(updated));
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
        downloads,
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
