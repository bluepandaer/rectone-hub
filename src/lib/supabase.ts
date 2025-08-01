import { createClient } from '@supabase/supabase-js';
import type { Tool, Category, Tag, Deal, Alternative, VSPair, PendingSubmission, ToolFilters, SearchResult } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

// Tools API
export const getTools = async (filters: ToolFilters = {}): Promise<SearchResult<Tool>> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  let query = supabase
    .from('tools')
    .select('*')
    .eq('status', 'published');

  // Apply filters
  if (filters.query) {
    query = query.or(`name.ilike.%${filters.query}%,slogan.ilike.%${filters.query}%,description_md.ilike.%${filters.query}%`);
  }

  if (filters.category) {
    query = query.contains('categories', [filters.category]);
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.overlaps('tags', filters.tags);
  }

  if (filters.platforms && filters.platforms.length > 0) {
    query = query.overlaps('platforms', filters.platforms);
  }

  if (filters.is_open_source !== undefined) {
    query = query.eq('is_open_source', filters.is_open_source);
  }

  if (filters.supports_cn !== undefined) {
    query = query.eq('supports_cn', filters.supports_cn);
  }

  if (filters.has_free_trial !== undefined) {
    query = query.eq('has_free_trial', filters.has_free_trial);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'updated':
      query = query.order('updated_at', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'rating':
      query = query.order('score->ease', { ascending: false });
      break;
    default: // trending
      query = query.order('updated_at', { ascending: false });
  }

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 24;
  const offset = (page - 1) * limit;

  const { data, error, count } = await query
    .range(offset, offset + limit - 1);

  if (error) {
    throw error;
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > offset + limit,
  };
};

export const getToolBySlug = async (slug: string): Promise<Tool | null> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};

export const getFeaturedTools = async (limit: number = 6): Promise<Tool[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
};

export const getTrendingTools = async (limit: number = 6): Promise<Tool[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
};

export const getLatestTools = async (limit: number = 6): Promise<Tool[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('count', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};

// Tags API
export const getTags = async (): Promise<Tag[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('count', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};

// Deals API
export const getActiveDeals = async (): Promise<Deal[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('is_active', true)
    .order('ends_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getDealsByToolSlug = async (toolSlug: string): Promise<Deal[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('tool_slug', toolSlug)
    .eq('is_active', true);

  if (error) {
    throw error;
  }

  return data || [];
};

// Alternatives API
export const getAlternatives = async (): Promise<Alternative[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('alternatives')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getAlternativeByBrand = async (brand: string): Promise<Alternative | null> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('alternatives')
    .select('*')
    .ilike('brand', brand)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};

// VS Pairs API
export const getVSPairs = async (): Promise<VSPair[]> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('vspairs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

export const getVSPair = async (aSlug: string, bSlug: string): Promise<VSPair | null> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('vspairs')
    .select('*')
    .or(`and(a_slug.eq.${aSlug},b_slug.eq.${bSlug}),and(a_slug.eq.${bSlug},b_slug.eq.${aSlug})`)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
};

// Submit tool
export const submitTool = async (submission: Omit<PendingSubmission, 'id' | 'created_at'>): Promise<PendingSubmission> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('pending_submissions')
    .insert([submission])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Search across all content
export const globalSearch = async (query: string): Promise<{
  tools: Tool[];
  categories: Category[];
  tags: Tag[];
}> => {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const [toolsResult, categoriesResult, tagsResult] = await Promise.all([
    supabase
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .or(`name.ilike.%${query}%,slogan.ilike.%${query}%,description_md.ilike.%${query}%`)
      .limit(10),
    
    supabase
      .from('categories')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(5),
    
    supabase
      .from('tags')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(5)
  ]);

  return {
    tools: toolsResult.data || [],
    categories: categoriesResult.data || [],
    tags: tagsResult.data || [],
  };
};