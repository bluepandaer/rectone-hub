// Fallback data when Supabase is not available
import type { Tool, Category, Tag, Deal, Alternative, VSPair, ToolFilters, SearchResult } from './types';

// Import JSON data as fallback
// Convert existing JSON data to new types
const convertToolData = (oldTool: any): Tool => ({
  ...oldTool,
  description_md: oldTool.description,
  website_url: oldTool.website,
  logo_url: oldTool.logo,
  docs_url: oldTool.docs,
  is_open_source: oldTool.isOpenSource,
  has_free_trial: oldTool.hasFreeTrial,
  supports_cn: oldTool.supportsCN,
  is_featured: oldTool.is_featured || false,
  status: 'published' as const,
  created_at: oldTool.createdAt,
  updated_at: oldTool.updatedAt,
});

// Import and convert data
const rawToolsData = [
  {
    "id": "chatgpt",
    "slug": "chatgpt", 
    "name": "ChatGPT",
    "slogan": "AI assistant for conversations and tasks",
    "description": "OpenAI's ChatGPT is a conversational AI assistant",
    "logo": "https://cdn.openai.com/brand-guidelines/chatgpt-logo.png",
    "website": "https://chat.openai.com/",
    "docs": "https://platform.openai.com/docs",
    "pricing": [{"plan":"Free","price":"$0","notes":"Limited usage"}],
    "isOpenSource": false,
    "hasFreeTrial": true,
    "supportsCN": true,
    "platforms": ["Web", "iOS", "Android"],
    "integrations": ["Zapier", "API"],
    "categories": ["writing", "productivity"],
    "tags": ["ai-writing", "chinese-support"],
    "login_methods": ["Google"],
    "score": {"ease": 4.8, "value": 4.6, "features": 4.7, "docs": 4.5},
    "pros": ["Easy to use"],
    "cons": ["Usage limits"],
    "faq": [{"q":"Is ChatGPT free?","a":"Yes, with limits"}],
    "alt_of": [],
    "deal_ids": [],
    "is_featured": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
];

const toolsData = rawToolsData.map(convertToolData);

const categoriesData = [
  {
    id: "writing",
    slug: "writing",
    name: "Writing",
    count: 4,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

const dealsData = [
  {
    id: "deal-1",
    tool_slug: "chatgpt",
    title: "ChatGPT Deal",
    url: "https://chat.openai.com/",
    description: "Special offer",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// Generate tags from tools data
const generateTags = (): Tag[] => {
  const tagCounts: Record<string, number> = {};
  
  toolsData.forEach(tool => {
    tool.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts).map(([name, count], index) => ({
    id: `tag-${index}`,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    count,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }));
};

const tagsData = generateTags();

// Mock alternatives data
const alternativesData: Alternative[] = [
  {
    id: 'alt-chatgpt',
    brand: 'ChatGPT',
    description: 'Looking for alternatives to ChatGPT? Here are the best AI assistants for different use cases.',
    items: [
      { tool_slug: 'claude', reason: 'Better for analysis and reasoning tasks, more safety-focused' },
      { tool_slug: 'perplexity', reason: 'Combines search with AI, provides real-time information with citations' },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'alt-notion',
    brand: 'Notion',
    description: 'Explore alternatives to Notion for productivity and note-taking.',
    items: [
      { tool_slug: 'obsidian', reason: 'Better for knowledge management with graph view and local files' },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock VS pairs data
const vsPairsData: VSPair[] = [
  {
    id: 'vs-chatgpt-claude',
    a_slug: 'chatgpt',
    b_slug: 'claude',
    matrix: {
      price: { chatgpt: '$20/mo Plus', claude: '$20/mo Pro' },
      features: ['Conversation', 'Code generation', 'Analysis', 'Creative writing'],
      platforms: {
        chatgpt: ['Web', 'iOS', 'Android', 'API'],
        claude: ['Web', 'API']
      },
      strengths: {
        chatgpt: 'Broader platform support, larger knowledge base',
        claude: 'Better reasoning, safety-focused, longer context'
      }
    },
    summary: 'Both are excellent AI assistants with similar pricing. ChatGPT has broader platform support and integration ecosystem, while Claude excels at reasoning and analysis tasks.',
    verdict_for: {
      beginner: 'ChatGPT for easier access and tutorials',
      team: 'Claude for analysis work, ChatGPT for general use',
      enterprise: 'ChatGPT for broader integration options'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Fallback API functions
export const fallbackGetTools = async (filters: ToolFilters = {}): Promise<SearchResult<Tool>> => {
  let filtered = [...toolsData];

  // Apply filters
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.slogan.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query)) ||
      tool.categories.some(cat => cat.toLowerCase().includes(query))
    );
  }

  if (filters.category) {
    filtered = filtered.filter(tool => tool.categories.includes(filters.category!));
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(tool => 
      filters.tags!.some(tag => tool.tags.includes(tag))
    );
  }

  if (filters.platforms && filters.platforms.length > 0) {
    filtered = filtered.filter(tool => 
      filters.platforms!.some(platform => tool.platforms.includes(platform))
    );
  }

  if (filters.is_open_source !== undefined) {
    filtered = filtered.filter(tool => tool.is_open_source === filters.is_open_source);
  }

  if (filters.supports_cn !== undefined) {
    filtered = filtered.filter(tool => tool.supports_cn === filters.supports_cn);
  }

  if (filters.has_free_trial !== undefined) {
    filtered = filtered.filter(tool => tool.has_free_trial === filters.has_free_trial);
  }

  // Apply sorting
  switch (filters.sort) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'updated':
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      filtered.sort((a, b) => {
        const avgA = a.score ? (a.score.ease + a.score.value + a.score.features + a.score.docs) / 4 : 0;
        const avgB = b.score ? (b.score.ease + b.score.value + b.score.features + b.score.docs) / 4 : 0;
        return avgB - avgA;
      });
      break;
    default: // trending
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 24;
  const offset = (page - 1) * limit;
  const paginatedData = filtered.slice(offset, offset + limit);

  return {
    data: paginatedData,
    total: filtered.length,
    page,
    limit,
    has_more: filtered.length > offset + limit,
  };
};

export const fallbackGetToolBySlug = async (slug: string): Promise<Tool | null> => {
  return toolsData.find(tool => tool.slug === slug) || null;
};

export const fallbackGetFeaturedTools = async (limit: number = 6): Promise<Tool[]> => {
  return toolsData.filter(tool => tool.is_featured).slice(0, limit);
};

export const fallbackGetTrendingTools = async (limit: number = 6): Promise<Tool[]> => {
  return [...toolsData]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, limit);
};

export const fallbackGetLatestTools = async (limit: number = 6): Promise<Tool[]> => {
  return [...toolsData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};

export const fallbackGetCategories = async (): Promise<Category[]> => {
  return categoriesData;
};

export const fallbackGetCategoryBySlug = async (slug: string): Promise<Category | null> => {
  return categoriesData.find(cat => cat.slug === slug) || null;
};

export const fallbackGetTags = async (): Promise<Tag[]> => {
  return tagsData;
};

export const fallbackGetTagBySlug = async (slug: string): Promise<Tag | null> => {
  return tagsData.find(tag => tag.slug === slug) || null;
};

export const fallbackGetActiveDeals = async (): Promise<Deal[]> => {
  return dealsData.filter(deal => {
    const now = new Date();
    const endDate = deal.ends_at ? new Date(deal.ends_at) : null;
    return !endDate || endDate > now;
  });
};

export const fallbackGetDealsByToolSlug = async (toolSlug: string): Promise<Deal[]> => {
  return dealsData.filter(deal => deal.tool_slug === toolSlug);
};

export const fallbackGetAlternatives = async (): Promise<Alternative[]> => {
  return alternativesData;
};

export const fallbackGetAlternativeByBrand = async (brand: string): Promise<Alternative | null> => {
  return alternativesData.find(alt => 
    alt.brand.toLowerCase() === brand.toLowerCase()
  ) || null;
};

export const fallbackGetVSPairs = async (): Promise<VSPair[]> => {
  return vsPairsData;
};

export const fallbackGetVSPair = async (aSlug: string, bSlug: string): Promise<VSPair | null> => {
  return vsPairsData.find(pair => 
    (pair.a_slug === aSlug && pair.b_slug === bSlug) ||
    (pair.a_slug === bSlug && pair.b_slug === aSlug)
  ) || null;
};

export const fallbackGlobalSearch = async (query: string): Promise<{
  tools: Tool[];
  categories: Category[];
  tags: Tag[];
}> => {
  const queryLower = query.toLowerCase();
  
  const tools = toolsData.filter(tool =>
    tool.name.toLowerCase().includes(queryLower) ||
    tool.slogan.toLowerCase().includes(queryLower) ||
    tool.tags.some(tag => tag.toLowerCase().includes(queryLower))
  ).slice(0, 10);

  const categories = categoriesData.filter(cat =>
    cat.name.toLowerCase().includes(queryLower) ||
    (cat.description && cat.description.toLowerCase().includes(queryLower))
  ).slice(0, 5);

  const tags = tagsData.filter(tag =>
    tag.name.toLowerCase().includes(queryLower)
  ).slice(0, 5);

  return { tools, categories, tags };
};