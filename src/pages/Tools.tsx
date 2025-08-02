
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SortDesc } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ToolGrid from "@/components/shared/ToolGrid";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import SEOHead from "@/components/shared/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { t, Language } from "@/lib/i18n";
import { buildMeta } from "@/lib/seo";
import { getTools, getCategories, getTags } from "@/lib/api";
import type { Tool, Category, Tag, ToolFilters, SearchResult } from "@/lib/types";

const Tools = () => {
  const { language, setLanguage } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState<SearchResult<Tool>>({ data: [], total: 0, page: 1, limit: 24, has_more: false });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get current filters from URL - ensure no empty strings
  const currentFilters: ToolFilters = {
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || undefined,
    tags: searchParams.getAll('tag'),
    platforms: searchParams.getAll('platform'),
    pricing: searchParams.get('pricing') as 'free' | 'paid' | 'freemium' || undefined,
    is_open_source: searchParams.get('open_source') === 'true' || undefined,
    supports_cn: searchParams.get('chinese') === 'true' || undefined,
    has_free_trial: searchParams.get('trial') === 'true' || undefined,
    sort: searchParams.get('sort') as 'trending' | 'newest' | 'updated' | 'rating' | 'name' || 'trending',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 24,
  };

  // State for select values with proper defaults
  const [categorySelect, setCategorySelect] = useState<string>('all');
  const [pricingSelect, setPricingSelect] = useState<string>('all');
  const [sortSelect, setSortSelect] = useState<string>('trending');

  // Sync select states with URL params
  useEffect(() => {
    setCategorySelect(currentFilters.category || 'all');
    setPricingSelect(currentFilters.pricing || 'all');
    setSortSelect(currentFilters.sort || 'trending');
  }, [currentFilters.category, currentFilters.pricing, currentFilters.sort]);

  // Validate and reset select values when data changes
  useEffect(() => {
    const validCategories = ['all', ...categories.map(c => c.slug)];
    if (!validCategories.includes(categorySelect)) {
      setCategorySelect('all');
      updateFilter('category', undefined);
    }
  }, [categories, categorySelect]);

  const updateFilter = (key: string, value: string | string[] | boolean | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === undefined || value === '' || value === 'all' || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach(v => newParams.append(key, v));
    } else {
      newParams.set(key, value.toString());
    }
    
    // Reset to page 1 when filters change
    if (key !== 'page') {
      newParams.delete('page');
    }
    
    setSearchParams(newParams);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [toolsResult, categoriesData, tagsData] = await Promise.all([
          getTools(currentFilters),
          getCategories(),
          getTags()
        ]);

        setResult(toolsResult);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tools');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  const handleSearch = (query: string) => {
    updateFilter('q', query);
  };

  const handleSort = (sort: string) => {
    setSortSelect(sort);
    updateFilter('sort', sort === 'trending' ? undefined : sort);
  };

  const handleCategoryChange = (value: string) => {
    setCategorySelect(value);
    updateFilter('category', value === 'all' ? undefined : value);
  };

  const handlePricingChange = (value: string) => {
    setPricingSelect(value);
    updateFilter('pricing', value === 'all' ? undefined : value);
  };

  const handlePageChange = (page: number) => {
    updateFilter('page', page.toString());
  };

  const clearFilters = () => {
    setCategorySelect('all');
    setPricingSelect('all');
    setSortSelect('trending');
    setSearchParams(new URLSearchParams());
  };

  const meta = buildMeta({
    title: `${t('tools.title', language)} - rect.one`,
    description: t('tools.subtitle', language),
    path: '/tools',
    language,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar language={language} onLanguageChange={setLanguage} />
        <LoadingState />
        <Footer language={language} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar language={language} onLanguageChange={setLanguage} />
        <ErrorState error={error} language={language} />
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("tools.title", language)}</h1>
          <p className="text-muted-foreground">{t("tools.subtitle", language)}</p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder={t("nav.search.placeholder", language)}
              value={currentFilters.query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortSelect} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px]">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">{t("tools.sort.trending", language)}</SelectItem>
                <SelectItem value="rating">{t("tools.sort.rating", language)}</SelectItem>
                <SelectItem value="newest">{t("tools.sort.newest", language)}</SelectItem>
                <SelectItem value="updated">{t("tools.sort.updated", language)}</SelectItem>
                <SelectItem value="name">{t("tools.sort.name", language)}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t("tools.filters.title", language)}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("tools.filters.title", language)}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    {t("tools.filters.clear", language)}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">{t("tools.filters.category", language)}</h3>
                  <Select value={categorySelect} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("tools.filters.allCategories", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("tools.filters.allCategories", language)}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="font-medium mb-3">{t("tools.filters.pricing", language)}</h3>
                  <Select value={pricingSelect} onValueChange={handlePricingChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("tools.filters.pricing", language)} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("tools.filters.pricing", language)}</SelectItem>
                      <SelectItem value="free">{t("tools.filters.free", language)}</SelectItem>
                      <SelectItem value="freemium">{t("tools.filters.freemium", language)}</SelectItem>
                      <SelectItem value="paid">{t("tools.filters.paid", language)}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-medium mb-3">{t("tools.filters.title", language)}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="open-source"
                        checked={currentFilters.is_open_source || false}
                        onCheckedChange={(checked) => updateFilter('open_source', checked || undefined)}
                      />
                      <label htmlFor="open-source" className="text-sm">
                        {t("tools.filters.openSource", language)}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="chinese"
                        checked={currentFilters.supports_cn || false}
                        onCheckedChange={(checked) => updateFilter('chinese', checked || undefined)}
                      />
                      <label htmlFor="chinese" className="text-sm">
                        {t("tools.filters.chineseSupport", language)}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="trial"
                        checked={currentFilters.has_free_trial || false}
                        onCheckedChange={(checked) => updateFilter('trial', checked || undefined)}
                      />
                      <label htmlFor="trial" className="text-sm">
                        {t("tools.filters.freeTrial", language)}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(currentFilters.query || currentFilters.category || currentFilters.tags?.length || currentFilters.pricing || currentFilters.is_open_source || currentFilters.supports_cn || currentFilters.has_free_trial) && (
                  <div>
                    <h3 className="font-medium mb-3">Active Filters</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentFilters.query && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('q', undefined)}>
                          "{currentFilters.query}" ×
                        </Badge>
                      )}
                      {currentFilters.category && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => handleCategoryChange('all')}>
                          {categories.find(c => c.slug === currentFilters.category)?.name} ×
                        </Badge>
                      )}
                      {currentFilters.pricing && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => handlePricingChange('all')}>
                          {t(`tools.filters.${currentFilters.pricing}`, language)} ×
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tools Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {result.total} {t("tools.results", language)}
              </p>
            </div>

            {/* Tools */}
            {result.data.length > 0 ? (
              <>
                <ToolGrid 
                  tools={result.data} 
                  title=""
                  language={language as Language}
                  showAll={true}
                />
                
                {/* Pagination */}
                {result.has_more && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={() => handlePageChange(result.page + 1)}
                      variant="outline"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">{t("tools.noResults", language)}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("tools.noResults.description", language)}
                </p>
                <Button asChild>
                  <a href="/submit">{t("nav.submit", language)}</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default Tools;
