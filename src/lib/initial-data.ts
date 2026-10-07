import {
  SiteSettings,
  TaxUpdate,
  BlogPost,
  Vacancy,
  JobApplication,
  Appointment,
  GovernmentLink,
  DownloadResource,
  ServiceItem,
} from '@/types';

export const initialSiteSettings: SiteSettings = {
  company_name: '',
  email: '',
  phone: '',
  whatsapp_number: '',
  address: '',
  careers_enabled: false,
};

export const initialTaxUpdates: TaxUpdate[] = [];

// Blog posts are dynamically loaded from Supabase database and CMS portal
export const initialBlogPosts: BlogPost[] = [];

export const initialServices: ServiceItem[] = [];

export const initialVacancies: Vacancy[] = [];

export const initialJobApplications: JobApplication[] = [];

export const initialAppointments: Appointment[] = [];

export const initialGovernmentLinks: GovernmentLink[] = [];

export const initialDownloads: DownloadResource[] = [];
