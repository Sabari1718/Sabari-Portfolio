export interface Profile {
  id: number;
  name: string;
  display_name: string | null;
  headline: string | null;
  bio: string | null;
  profile_image: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  twitter_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  category: string | null;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  status: string;
  type: string;
  display_order: number;
  is_visible: boolean;
  technologies?: ProjectTechnology[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectTechnology {
  id: number;
  project_id: number;
  technology: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string | null;
  proficiency: number;
  icon: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: number;
  company: string;
  logo_url: string | null;
  role: string;
  description: string | null;
  technologies: string | null;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
  location: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string | null;
  field: string | null;
  grade: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  replied_at: string | null;
  created_at: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
