// Unified API layer that switches between Supabase and fallback data
import { isSupabaseAvailable } from './supabase';
import * as supabaseApi from './supabase';
import * as fallbackApi from './fallback-data';
import type { Tool, Category, Tag, Deal, Alternative, VSPair, PendingSubmission, ToolFilters, SearchResult } from './types';

// Check data source preference
const shouldUseFallback = (): boolean => {
  const useFallback = import.meta.env.VITE_USE_FALLBACK_DATA === 'true';
  const usesFallback = useFallback || !isSupabaseAvailable();
  
  // Log data source in development
  if (import.meta.env.DEV) {
    console.log(`Data source: ${usesFallback ? 'json' : 'supabase'}`);
  }
  
  return usesFallback;
};

// Tools API
export const getTools = async (filters: ToolFilters = {}): Promise<SearchResult<Tool>> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetTools(filters);
  }
  return supabaseApi.getTools(filters);
};

export const getToolBySlug = async (slug: string): Promise<Tool | null> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetToolBySlug(slug);
  }
  return supabaseApi.getToolBySlug(slug);
};

export const getFeaturedTools = async (limit: number = 6): Promise<Tool[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetFeaturedTools(limit);
  }
  return supabaseApi.getFeaturedTools(limit);
};

export const getTrendingTools = async (limit: number = 6): Promise<Tool[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetTrendingTools(limit);
  }
  return supabaseApi.getTrendingTools(limit);
};

export const getLatestTools = async (limit: number = 6): Promise<Tool[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetLatestTools(limit);
  }
  return supabaseApi.getLatestTools(limit);
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetCategories();
  }
  return supabaseApi.getCategories();
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetCategoryBySlug(slug);
  }
  return supabaseApi.getCategoryBySlug(slug);
};

// Tags API
export const getTags = async (): Promise<Tag[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetTags();
  }
  return supabaseApi.getTags();
};

export const getTagBySlug = async (slug: string): Promise<Tag | null> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetTagBySlug(slug);
  }
  return supabaseApi.getTagBySlug(slug);
};

// Deals API
export const getActiveDeals = async (): Promise<Deal[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetActiveDeals();
  }
  return supabaseApi.getActiveDeals();
};

export const getDealsByToolSlug = async (toolSlug: string): Promise<Deal[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetDealsByToolSlug(toolSlug);
  }
  return supabaseApi.getDealsByToolSlug(toolSlug);
};

// Alternatives API
export const getAlternatives = async (): Promise<Alternative[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetAlternatives();
  }
  return supabaseApi.getAlternatives();
};

export const getAlternativeByBrand = async (brand: string): Promise<Alternative | null> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetAlternativeByBrand(brand);
  }
  return supabaseApi.getAlternativeByBrand(brand);
};

// VS Pairs API
export const getVSPairs = async (): Promise<VSPair[]> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetVSPairs();
  }
  return supabaseApi.getVSPairs();
};

export const getVSPair = async (aSlug: string, bSlug: string): Promise<VSPair | null> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGetVSPair(aSlug, bSlug);
  }
  return supabaseApi.getVSPair(aSlug, bSlug);
};

// Submit tool (only available with Supabase)
export const submitTool = async (submission: Omit<PendingSubmission, 'id' | 'created_at'>): Promise<PendingSubmission> => {
  if (shouldUseFallback()) {
    throw new Error('Tool submission requires Supabase connection');
  }
  return supabaseApi.submitTool(submission);
};

// Search
export const globalSearch = async (query: string): Promise<{
  tools: Tool[];
  categories: Category[];
  tags: Tag[];
}> => {
  if (shouldUseFallback()) {
    return fallbackApi.fallbackGlobalSearch(query);
  }
  return supabaseApi.globalSearch(query);
};

// Get related tools by category/tags
export const getRelatedTools = async (tool: Tool, limit: number = 6): Promise<Tool[]> => {
  const filters: ToolFilters = {
    limit: limit + 1, // Get one extra to exclude the current tool
  };

  // Prefer same category, then same tags
  if (tool.categories.length > 0) {
    filters.category = tool.categories[0];
  } else if (tool.tags.length > 0) {
    filters.tags = [tool.tags[0]];
  }

  const result = await getTools(filters);
  return result.data.filter(t => t.slug !== tool.slug).slice(0, limit);
};

// Get platform-specific tools
export const getToolsByPlatform = async (platform: string, limit: number = 12): Promise<Tool[]> => {
  const result = await getTools({
    platforms: [platform],
    limit,
  });
  return result.data;
};

// Get tools by multiple filters for better recommendations
export const getRecommendedTools = async (filters: Partial<ToolFilters>, limit: number = 6): Promise<Tool[]> => {
  const result = await getTools({
    ...filters,
    limit,
    sort: 'rating',
  });
  return result.data;
};