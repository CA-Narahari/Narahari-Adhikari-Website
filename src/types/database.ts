export type UserRole = 'admin' | 'editor'

export interface Profile {
  id: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Post {
  id: string
  type: 'blog' | 'news'
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  cover_image_url: string | null
  category: string | null
  published: boolean
  published_at: string | null
  author_id: string | null
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  slug: string
  summary: string | null
  body: string | null
  icon: string | null
  sort_order: number
}

export interface Industry {
  id: string
  title: string
  slug: string
  summary: string | null
  body: string | null
  image_url: string | null
  sort_order: number
}

export interface TeamMember {
  id: string
  name: string
  designation: string | null
  photo_url: string | null
  bio: string | null
  sort_order: number
}

export interface JobOpening {
  id: string
  title: string
  description: string | null
  is_open: boolean
  created_at: string
}

export interface Inquiry {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  message: string | null
  type: 'contact' | 'career'
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string
}
