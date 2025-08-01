import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, TrendingUp, Sparkles, ArrowRight, Star } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/shared/HeroSearch";
import CategoryGrid from "@/components/shared/CategoryGrid";
import ToolGrid from "@/components/shared/ToolGrid";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { t, Language } from "@/lib/i18n";
import { 
  getFeaturedTools, 
  getTrendingTools, 
  getLatestTools, 
  getCategories, 
  getActiveDeals 
} from "@/lib/api";
import type { Tool, Category, Deal } from "@/lib/types";

const Index = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [latestTools, setLatestTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          featuredData,
          trendingData,
          latestData,
          categoriesData,
          dealsData
        ] = await Promise.all([
          getFeaturedTools(6),
          getTrendingTools(6),
          getLatestTools(6),
          getCategories(),
          getActiveDeals()
        ]);

        setFeaturedTools(featuredData);
        setTrendingTools(trendingData);
        setLatestTools(latestData);
        setCategories(categoriesData);
        setActiveDeals(dealsData.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <LoadingState />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <ErrorState error={error} language={language} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("home.heroTitle", language)}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("home.heroSubtitle", language)}
            </p>
            
            <HeroSearch language={language} />
            
            <div className="flex flex-wrap justify-center items-center gap-4 mt-8 text-sm text-muted-foreground">
              <span>{t("home.popularTags", language)}:</span>
              {["AI Writing", "Code Assistant", "Design", "Productivity"].map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("home.browseCategories", language)}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.categoriesDescription", language)}
            </p>
          </div>
          
          <CategoryGrid categories={categories} language={language} />
        </div>
      </section>

      {/* Featured Tools Section */}
      {featuredTools.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center">
                  <Star className="h-8 w-8 mr-3 text-primary" />
                  {t("home.featuredTools", language)}
                </h2>
                <p className="text-muted-foreground">{t("home.featuredDescription", language)}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/tools?sort=trending">
                  {t("common.viewAll", language)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <ToolGrid 
              tools={featuredTools} 
              title=""
              language={language as Language}
              showAll={true}
            />
          </div>
        </section>
      )}

      {/* Trending Tools Section */}
      {trendingTools.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center">
                  <TrendingUp className="h-8 w-8 mr-3 text-primary" />
                  {t("home.trendingTools", language)}
                </h2>
                <p className="text-muted-foreground">{t("home.trendingDescription", language)}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/tools?sort=trending">
                  {t("common.viewAll", language)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <ToolGrid 
              tools={trendingTools} 
              title=""
              language={language as Language}
              showAll={true}
            />
          </div>
        </section>
      )}

      {/* Latest Tools Section */}
      {latestTools.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center">
                  <Sparkles className="h-8 w-8 mr-3 text-primary" />
                  {t("home.latestTools", language)}
                </h2>
                <p className="text-muted-foreground">{t("home.latestDescription", language)}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/tools?sort=newest">
                  {t("common.viewAll", language)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <ToolGrid 
              tools={latestTools} 
              title=""
              language={language as Language}
              showAll={true}
            />
          </div>
        </section>
      )}

      {/* Deals Section */}
      {activeDeals.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">{t("home.activeDeals", language)}</h2>
                <p className="text-muted-foreground">{t("home.dealsDescription", language)}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/deals">
                  {t("common.viewAll", language)}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDeals.map((deal) => (
                <Card key={deal.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {deal.title}
                      </h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {t("deals.active", language)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{deal.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {deal.ends_at && (
                          <span>{t("deals.endsAt", language)}: {new Date(deal.ends_at).toLocaleDateString()}</span>
                        )}
                      </div>
                      <Button asChild size="sm">
                        <a href={deal.url} target="_blank" rel="noopener noreferrer">
                          {t("deals.claimDeal", language)}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;