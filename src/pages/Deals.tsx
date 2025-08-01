import { useState, useEffect } from "react";
import { Clock, ExternalLink, Tag as TagIcon } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { getActiveDeals } from "@/lib/api";
import type { Deal } from "@/lib/types";

const Deals = () => {
  const { language, setLanguage } = useLanguage();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        setLoading(true);
        const dealsData = await getActiveDeals();
        setDeals(dealsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  const isEndingSoon = (endDate: string | undefined) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const getDaysRemaining = (endDate: string | undefined) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("deals.title", language)}</h1>
          <p className="text-muted-foreground">{t("deals.description", language)}</p>
        </div>

        {/* Deals Grid */}
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => {
              const daysRemaining = getDaysRemaining(deal.ends_at);
              const endingSoon = isEndingSoon(deal.ends_at);
              
              return (
                <Card key={deal.id} className={`relative ${endingSoon ? 'ring-2 ring-orange-500' : ''}`}>
                  {endingSoon && (
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="destructive" className="animate-pulse">
                        <Clock className="h-3 w-3 mr-1" />
                        {t("deals.endingSoon", language)}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      <Badge variant="secondary">
                        <TagIcon className="h-3 w-3 mr-1" />
                        {deal.tool_slug}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{deal.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {deal.code && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{t("deals.code", language)}:</span>
                          <Badge variant="outline" className="font-mono">
                            {deal.code}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t("deals.source", language)}:</span>
                        <span className="text-sm capitalize">{deal.source}</span>
                      </div>
                      
                      {deal.ends_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {daysRemaining !== null && daysRemaining > 0 
                              ? `${daysRemaining} ${t("deals.daysLeft", language)}`
                              : t("deals.expired", language)
                            }
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button asChild className="w-full">
                      <a 
                        href={deal.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("deals.claimDeal", language)}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">{t("deals.noDeals", language)}</h3>
            <p className="text-muted-foreground">
              {t("deals.noDealsDescription", language)}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Deals;