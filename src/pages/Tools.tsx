import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/tools/ToolCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import toolsData from "@/data/tools.json";
import categoriesData from "@/data/categories.json";

const Tools = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguage] = useState("zh");
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "trending");
  const [priceFilter, setPriceFilter] = useState(searchParams.get("price") || "");
  const [platformFilter, setPlatformFilter] = useState(searchParams.get("platform") || "");
  
  // Get all unique tags
  const allTags = Array.from(new Set(toolsData.flatMap(tool => tool.tags)));
  const allPlatforms = Array.from(new Set(toolsData.flatMap(tool => tool.platforms)));

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let filtered = toolsData.filter(tool => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!tool.name.toLowerCase().includes(query) && 
            !tool.slogan.toLowerCase().includes(query) &&
            !tool.tags.some(tag => tag.toLowerCase().includes(query)) &&
            !tool.categories.some(cat => cat.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && !tool.categories.includes(selectedCategory)) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => tool.tags.includes(tag))) {
        return false;
      }

      // Price filter
      if (priceFilter === "free" && !tool.pricing.some(p => p.price === "$0")) {
        return false;
      }
      if (priceFilter === "paid" && !tool.pricing.some(p => p.price !== "$0")) {
        return false;
      }

      // Platform filter
      if (platformFilter && !tool.platforms.includes(platformFilter)) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "updated":
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "rating":
        filtered.sort((a, b) => {
          const avgA = a.score ? (a.score.ease + a.score.value + a.score.features + a.score.docs) / 4 : 0;
          const avgB = b.score ? (b.score.ease + b.score.value + b.score.features + b.score.docs) / 4 : 0;
          return avgB - avgA;
        });
        break;
      default: // trending
        // Mock trending based on score and recency
        filtered.sort((a, b) => {
          const scoreA = a.score ? (a.score.ease + a.score.value + a.score.features + a.score.docs) / 4 : 0;
          const scoreB = b.score ? (b.score.ease + b.score.value + b.score.features + b.score.docs) / 4 : 0;
          const recentA = new Date(a.updatedAt).getTime();
          const recentB = new Date(b.updatedAt).getTime();
          return (scoreB * 0.7 + recentB * 0.3) - (scoreA * 0.7 + recentA * 0.3);
        });
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedTags, sortBy, priceFilter, platformFilter]);

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (sortBy !== "trending") params.set("sort", sortBy);
    if (priceFilter) params.set("price", priceFilter);
    if (platformFilter) params.set("platform", platformFilter);
    setSearchParams(params);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTags([]);
    setSortBy("trending");
    setPriceFilter("");
    setPlatformFilter("");
    setSearchParams(new URLSearchParams());
  };

  const text = {
    zh: {
      title: "AI & 开发工具库",
      subtitle: "发现最优秀的AI和开发工具",
      searchPlaceholder: "搜索工具名称、标签或分类...",
      filters: "筛选",
      sort: "排序",
      category: "分类",
      allCategories: "所有分类",
      tags: "标签",
      price: "价格",
      platform: "平台",
      allPlatforms: "所有平台",
      trending: "热门",
      newest: "最新",
      updated: "最近更新",
      rating: "评分",
      name: "名称",
      free: "免费",
      paid: "付费",
      clearFilters: "清除筛选",
      results: "个结果",
      noResults: "未找到匹配的工具",
      noResultsDesc: "尝试调整搜索条件或",
      submitTool: "提交新工具"
    },
    en: {
      title: "AI & Dev Tools",
      subtitle: "Discover the best AI and development tools",
      searchPlaceholder: "Search tools, tags, or categories...",
      filters: "Filters",
      sort: "Sort",
      category: "Category",
      allCategories: "All Categories",
      tags: "Tags",
      price: "Price",
      platform: "Platform",
      allPlatforms: "All Platforms",
      trending: "Trending",
      newest: "Newest",
      updated: "Recently Updated",
      rating: "Rating",
      name: "Name",
      free: "Free",
      paid: "Paid",
      clearFilters: "Clear Filters",
      results: "results",
      noResults: "No tools found",
      noResultsDesc: "Try adjusting your search criteria or",
      submitTool: "submit a new tool"
    }
  };

  const t = text[language as keyof typeof text];

  return (
    <div className="min-h-screen bg-background">
      <NavBar language={language} onLanguageChange={setLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-xl text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateSearchParams()}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.allCategories}</SelectItem>
                {categoriesData.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {language === "zh" ? category.name_zh : category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t.price} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.price}</SelectItem>
                <SelectItem value="free">{t.free}</SelectItem>
                <SelectItem value="paid">{t.paid}</SelectItem>
              </SelectContent>
            </Select>

            {/* Platform */}
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t.platform} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t.allPlatforms}</SelectItem>
                {allPlatforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">{t.trending}</SelectItem>
                <SelectItem value="newest">{t.newest}</SelectItem>
                <SelectItem value="updated">{t.updated}</SelectItem>
                <SelectItem value="rating">{t.rating}</SelectItem>
                <SelectItem value="name">{t.name}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedTags.length > 0 || priceFilter || platformFilter) && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                {t.clearFilters}
              </Button>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredTools.length} {t.results}
          </p>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} language={language} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">{t.noResults}</h3>
            <p className="text-muted-foreground mb-4">
              {t.noResultsDesc}{" "}
              <Button variant="link" className="p-0 h-auto">
                {t.submitTool}
              </Button>
            </p>
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  );
};

export default Tools;