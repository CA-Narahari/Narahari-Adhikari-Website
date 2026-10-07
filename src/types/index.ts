export interface SiteSettings {
  company_name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  careers_enabled: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  link_url?: string | null;
  poster_url?: string | null;
  is_active: boolean;
  display_location: 'all_pages' | 'home_page' | 'specific_page';
  target_path?: string | null;
  expires_at?: string | null;
  created_at?: string;
}

export interface TaxUpdate {
  id: string;
  title: string;
  slug: string;
  category: 'Income Tax' | 'VAT' | 'Customs' | 'Corporate Tax' | 'Finance Acts' | 'Circulars';
  summary: string;
  content: string;
  source_name: string;
  source_url: string;
  is_urgent: boolean;
  status: 'draft' | 'published';
  published_at: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  image_alt?: string;
  update_type?: 'Update' | 'Deadline' | 'Guide' | 'Sector Note';
  effective_date?: string;
  topic?: string;
  sector?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  read_time: string;
  featured_image?: string;
  image_name?: string;
  image_alt?: string;
  tags?: string[];
  status: 'draft' | 'published';
  published_at: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  deliverables: string[];
  target_audience: string;
  icon: string;
  is_featured: boolean;
  display_order?: number;
  image?: string;
  image_name?: string;
  image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Article Trainee';
  description: string;
  requirements: string[];
  deadline: string;
  is_active: boolean;
  attachment_url?: string | null;
}

export interface JobApplication {
  id: string;
  vacancy_id: string;
  vacancy_title: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  qualification?: string;
  cover_note: string;
  cv_filename: string;
  cv_file_url?: string | null;
  status: 'new' | 'review' | 'shortlisted' | 'rejected';
  submitted_at: string;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name?: string;
  service_title: string;
  consultation_type: 'Office Meeting' | 'Phone Consultation' | 'Online Meeting';
  date: string;
  time_slot: string;
  notes?: string;
  privacy_consent?: boolean;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled';
  created_at: string;
}

export interface GovernmentLink {
  id: string;
  name: string;
  short_name: string;
  description: string;
  url: string;
  category: string;
}

export interface DownloadResource {
  id: string;
  title: string;
  category: 'Tax Form' | 'Checklist' | 'Template' | 'Guide';
  file_format: string;
  file_size: string;
  download_url: string;
  downloads_count: number;
}
