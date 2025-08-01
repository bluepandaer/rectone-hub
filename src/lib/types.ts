// TypeScript types for rect.one tools hub

export interface Tool {
  id: string;
  slug: string;
  name: string;
  name_zh?: string;
  name_es?: string;
  name_de?: string;
  name_ja?: string;
  slogan: string;
  slogan_zh?: string;
  slogan_es?: string;
  slogan_de?: string;
  slogan_ja?: string;
  description_md: string;
  description_md_zh?: string;
  description_md_es?: string;
  description_md_de?: string;
  description_md_ja?: string;
  logo_url?: string;
  website_url: string;
  docs_url?: string;
  pricing: PricingPlan[];
  is_open_source: boolean;
  has_free_trial: boolean;
  supports_cn: boolean;
  platforms: string[];
  integrations: string[];
  categories: string[];
  tags: string[];
  login_methods: string[];
  score: ToolScore;
  pros: string[];
  cons: string[];
  faq: FAQ[];
  alt_of: string[];
  deal_ids: string[];
  is_featured: boolean;
  status: 'published' | 'draft' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  plan: string;
  price: string;
  notes?: string;
}

export interface ToolScore {
  ease: number;
  value: number;
  features: number;
  docs: number;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_zh?: string;
  name_es?: string;
  name_de?: string;
  name_ja?: string;
  description?: string;
  description_zh?: string;
  description_es?: string;
  description_de?: string;
  description_ja?: string;
  icon?: string;
  color?: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
  name_zh?: string;
  name_es?: string;
  name_de?: string;
  name_ja?: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  tool_slug: string;
  title: string;
  title_zh?: string;
  title_es?: string;
  title_de?: string;
  title_ja?: string;
  code?: string;
  url: string;
  description: string;
  description_zh?: string;
  description_es?: string;
  description_de?: string;
  description_ja?: string;
  starts_at?: string;
  ends_at?: string;
  source: string;
  discount_percentage?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Alternative {
  id: string;
  brand: string;
  brand_zh?: string;
  brand_es?: string;
  brand_de?: string;
  brand_ja?: string;
  description?: string;
  description_zh?: string;
  description_es?: string;
  description_de?: string;
  description_ja?: string;
  items: AlternativeItem[];
  created_at: string;
  updated_at: string;
}

export interface AlternativeItem {
  tool_slug: string;
  reason: string;
}

export interface VSPair {
  id: string;
  a_slug: string;
  b_slug: string;
  matrix: VSMatrix;
  summary?: string;
  summary_zh?: string;
  summary_es?: string;
  summary_de?: string;
  summary_ja?: string;
  verdict_for: VSVerdict;
  created_at: string;
  updated_at: string;
}

export interface VSMatrix {
  price?: Record<string, string>;
  features?: string[];
  platforms?: Record<string, string[]>;
  strengths?: Record<string, string>;
  [key: string]: any;
}

export interface VSVerdict {
  beginner: string;
  team: string;
  enterprise: string;
}

export interface PendingSubmission {
  id?: string;
  name: string;
  website_url: string;
  slogan: string;
  description?: string;
  category?: string;
  tags: string[];
  platforms: string[];
  pricing_type?: string;
  has_free_trial: boolean;
  is_open_source: boolean;
  supports_cn: boolean;
  logo_url?: string;
  contact_email?: string;
  additional_notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface ToolFilters {
  query?: string;
  category?: string;
  tags?: string[];
  platforms?: string[];
  pricing?: 'free' | 'paid' | 'freemium';
  is_open_source?: boolean;
  supports_cn?: boolean;
  has_free_trial?: boolean;
  sort?: 'trending' | 'newest' | 'updated' | 'rating' | 'name';
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export type Language = 'en' | 'zh' | 'es' | 'de' | 'ja';

export interface LocalizedContent {
  [key: string]: string | undefined;
}