import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, TrendingUp, Sparkles, ArrowRight, Star } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ToolCard from "@/components/tools/ToolCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toolsData from "@/data/tools.json";
import categoriesData from "@/data/categories.json";
import dealsData from "@/data/deals.json";

const Index = () => {
  const [language, setLanguage] = useState("zh");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get trending tools (mock trending logic)
  const trendingTools = toolsData
    .sort((a, b) => {
      const scoreA = a.score ? (a.score.ease + a.score.value + a.score.features + a.score.docs) / 4 : 0;
      const scoreB = b.score ? (b.score.ease + b.score.value + b.score.features + b.score.docs) / 4 : 0;
      return scoreB - scoreA;
    })
    .slice(0, 6);

  // Get newest tools
  const newestTools = toolsData
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get active deals
  const activeDeals = dealsData.filter(deal => {
    const now = new Date();
    const endDate = new Date(deal.endsAt);
    return endDate > now;
  }).slice(0, 3);

  const text = {
    zh: {
      heroTitle: "发现最优秀的",
      heroHighlight: "AI & 开发工具",
      heroSubtitle: "精选全球顶级AI工具和开发者资源，助力你的创意与效率",
      searchPlaceholder: "搜索ChatGPT、Cursor、Notion...",
      searchButton: "搜索",
      browseAll: "浏览所有工具",
      categories: "热门分类",
      categoriesDesc: "按分类探索工具",
      trending: "热门工具",
      trendingDesc: "最受欢迎的AI和开发工具",
      newest: "最新上架",
      newestDesc: "刚刚发布的新工具",
      deals: "优惠活动",
      dealsDesc: "限时折扣和特惠",
      viewAll: "查看全部",
      viewDeals: "查看优惠",
      getStarted: "开始探索",
      submitTool: "提交工具",
      featuredIn: "已收录",
      toolsCount: "款工具",
      stats: {
        tools: "精选工具",
        categories: "个分类", 
        deals: "活跃优惠",
        users: "用户使用"
      }
    },
    en: {
      heroTitle: "Discover the best",
      heroHighlight: "AI & Dev Tools",
      heroSubtitle: "Curated collection of top AI tools and developer resources to boost your creativity and productivity",
      searchPlaceholder: "Search ChatGPT, Cursor, Notion...",
      searchButton: "Search",
      browseAll: "Browse All Tools",
      categories: "Popular Categories",
      categoriesDesc: "Explore tools by category",
      trending: "Trending Tools",
      trendingDesc: "Most popular AI and development tools",
      newest: "Latest Additions",
      newestDesc: "Recently added new tools",
      deals: "Special Deals",
      dealsDesc: "Limited time discounts and offers",
      viewAll: "View All",
      viewDeals: "View Deals",
      getStarted: "Get Started",
      submitTool: "Submit Tool",
      featuredIn: "Featured",
      toolsCount: "tools",
      stats: {
        tools: "Curated Tools",
        categories: "Categories",
        deals: "Active Deals", 
        users: "Happy Users"
      }
    }
  };

  const t = text[language as keyof typeof text];

  return (
    <div className="min-h-screen bg-background">
      <NavBar language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              {t.featuredIn} {toolsData.length}+ {t.toolsCount}
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {t.heroTitle}
              <br />
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                {t.heroHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-2"
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8">
                  {t.searchButton}
                </Button>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/tools">
                  {t.browseAll}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/submit">
                  {t.submitTool}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{toolsData.length}+</div>
              <div className="text-muted-foreground">{t.stats.tools}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{categoriesData.length}</div>
              <div className="text-muted-foreground">{t.stats.categories}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{activeDeals.length}</div>
              <div className="text-muted-foreground">{t.stats.deals}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">{t.stats.users}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t.categories}</h2>
              <p className="text-muted-foreground">{t.categoriesDesc}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/tools">
                {t.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categoriesData.map((category) => (
              <Link
                key={category.id}
                to={`/tools?category=${category.name}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div 
                      className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white text-xl font-semibold"
                      style={{ backgroundColor: category.color }}
                    >
                      {(language === "zh" ? category.name_zh : category.name)[0]}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                      {language === "zh" ? category.name_zh : category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.toolCount} {language === "zh" ? "工具" : "tools"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tools Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <TrendingUp className="h-8 w-8 mr-3 text-primary" />
                {t.trending}
              </h2>
              <p className="text-muted-foreground">{t.trendingDesc}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/tools?sort=trending">
                {t.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                <Star className="h-8 w-8 mr-3 text-accent" />
                {t.newest}
              </h2>
              <p className="text-muted-foreground">{t.newestDesc}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/tools?sort=newest">
                {t.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newestTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} language={language} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      {activeDeals.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">{t.deals}</h2>
                <p className="text-muted-foreground">{t.dealsDesc}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/deals">
                  {t.viewDeals}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeDeals.map((deal) => {
                const tool = toolsData.find(t => t.slug === deal.toolSlug);
                return (
                  <Card key={deal.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        {tool && (
                          <>
                            <img
                              src={tool.logo}
                              alt={tool.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{tool.name}</h3>
                              <p className="text-sm text-muted-foreground">{deal.title}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{deal.desc}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{deal.code}</Badge>
                        <Button asChild size="sm">
                          <a href={deal.url} target="_blank" rel="noopener noreferrer">
                            {language === "zh" ? "获取优惠" : "Get Deal"}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer language={language} />
    </div>
  );
};

export default Index;
