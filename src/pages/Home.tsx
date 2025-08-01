import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/shared/HeroSearch";
import CategoryGrid from "@/components/shared/CategoryGrid";
import ToolGrid from "@/components/shared/ToolGrid";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Percent, Clock, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { t, formatDate, getLocalizedContent } from "@/lib/i18n";
import { 
  getCategories, 
  getFeaturedTools, 
  getTrendingTools, 
  getLatestTools, 
  getActiveDeals 
} from "@/lib/api";
import type { Category, Tool, Deal } from "@/lib/types";

const Home = () => {
  const { language, setLanguage } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [trendingTools, setTrendingTools] = useState<Tool[]>([]);
  const [latestTools, setLatestTools] = useState<Tool[]>([]);
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, featuredData, trendingData, latestData, dealsData] = await Promise.all([
          getCategories(),
          getFeaturedTools(6),
          getTrendingTools(6),
          getLatestTools(6),
          getActiveDeals(),
        ]);

        setCategories(categoriesData);
        setFeaturedTools(featuredData);
        setTrendingTools(trendingData);
        setLatestTools(latestData);
        setActiveDeals(dealsData.slice(0, 3)); // Show only first 3 deals
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
        <NavBar language={language} onLanguageChange={setLanguage} />
        <LoadingState variant="spinner" language={language} />
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
      <NavBar language={language} onLanguageChange={setLanguage} />

      <main className="space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-24">
          <div className="container mx-auto px-4 text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {t("hero.title", language)}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t("hero.subtitle", language)}
              </p>
            </div>
            <HeroSearch language={language} />
          </div>
        </section>

        <div className="container mx-auto px-4 space-y-16">
          {/* Categories */}
          <CategoryGrid 
            categories={categories} 
            language={language} 
            limit={8}
          />

          {/* Featured Tools */}
          {featuredTools.length > 0 && (
            <ToolGrid
              tools={featuredTools}
              title="Featured Tools"
              language={language}
              linkTo="/tools?featured=true"
            />
          )}

          {/* Trending Tools */}
          {trendingTools.length > 0 && (
            <ToolGrid
              tools={trendingTools}
              title="Trending Tools"
              language={language}
              linkTo="/tools?sort=trending"
            />
          )}

          {/* Latest Tools */}
          {latestTools.length > 0 && (
            <ToolGrid
              tools={latestTools}
              title="Latest Tools"
              language={language}
              linkTo="/tools?sort=newest"
            />
          )}

          {/* Active Deals */}
          {activeDeals.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <Percent className="w-6 h-6 mr-2 text-primary" />
                  {t("deals.title", language)}
                </h2>
                <Button variant="outline" asChild>
                  <Link to="/deals">View All Deals</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDeals.map((deal) => {
                  const title = getLocalizedContent(deal, 'title', language);
                  const description = getLocalizedContent(deal, 'description', language);
                  const isEndingSoon = deal.ends_at ? 
                    new Date(deal.ends_at).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 : false;

                  return (
                    <Card key={deal.id} className="relative overflow-hidden">
                      {isEndingSoon && (
                        <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground px-2 py-1 text-xs rounded-bl">
                          {t("deals.endingSoon", language)}
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <span className="truncate">{title}</span>
                        </CardTitle>
                        {deal.discount_percentage && (
                          <Badge variant="secondary" className="w-fit">
                            {deal.discount_percentage}% {t("deals.discount", language)}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {description}
                        </p>
                        
                        {deal.code && (
                          <div className="bg-muted p-2 rounded text-center">
                            <span className="text-xs text-muted-foreground">Code: </span>
                            <code className="font-mono font-bold">{deal.code}</code>
                          </div>
                        )}

                        {deal.ends_at && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            Ends {formatDate(deal.ends_at, language)}
                          </div>
                        )}

                        <Button asChild className="w-full">
                          <a href={deal.url} target="_blank" rel="noopener noreferrer">
                            {t("deals.getOffer", language)}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick Access Links */}
          <section className="bg-muted/50 rounded-lg p-8">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold">Explore More</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" size="lg" asChild className="h-auto p-4">
                  <Link to="/alternatives" className="flex flex-col items-center space-y-2">
                    <span className="text-lg">🔄</span>
                    <span>{t("nav.alternatives", language)}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-auto p-4">
                  <Link to="/vs" className="flex flex-col items-center space-y-2">
                    <span className="text-lg">⚖️</span>
                    <span>{t("nav.vs", language)}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-auto p-4">
                  <Link to="/deals" className="flex flex-col items-center space-y-2">
                    <span className="text-lg">💰</span>
                    <span>{t("nav.deals", language)}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-auto p-4">
                  <Link to="/submit" className="flex flex-col items-center space-y-2">
                    <span className="text-lg">➕</span>
                    <span>{t("nav.submit", language)}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
};

export default Home;