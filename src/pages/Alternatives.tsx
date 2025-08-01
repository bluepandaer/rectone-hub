import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/shared/SEOHead';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { t, getLocalizedContent } from '@/lib/i18n';
import { buildMeta } from '@/lib/seo';
import type { Alternative } from '@/lib/types';
import { getAlternatives } from '@/lib/api';

const Alternatives = () => {
  const { language, setLanguage } = useLanguage();
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = buildMeta({
    title: `${t('alternatives.title', language)} - rect.one`,
    description: t('alternatives.subtitle', language),
    path: '/alternatives',
    language,
  });

  useEffect(() => {
    const loadAlternatives = async () => {
      try {
        setLoading(true);
        const data = await getAlternatives();
        setAlternatives(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alternatives');
      } finally {
        setLoading(false);
      }
    };

    loadAlternatives();
  }, []);

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
        <ErrorState error={error} />
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">{t('alternatives.title', language)}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('alternatives.subtitle', language)}
          </p>
        </div>

        {/* Alternatives Grid */}
        {alternatives.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map((alternative) => {
              const brandName = getLocalizedContent(alternative, 'brand', language);
              const description = getLocalizedContent(alternative, 'description', language);
              const slug = brandName.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <Card key={alternative.id} className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{brandName} Alternatives</span>
                      <Badge variant="secondary">
                        {alternative.items.length} {alternative.items.length === 1 ? 'option' : 'options'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {description}
                      </p>
                    )}

                    {/* Preview of alternatives */}
                    {alternative.items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Popular alternatives:</h4>
                        <div className="space-y-1">
                          {alternative.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              <span className="font-medium">{item.tool_slug}</span>
                              <span className="text-muted-foreground">-</span>
                              <span className="text-muted-foreground text-xs truncate">
                                {item.reason}
                              </span>
                            </div>
                          ))}
                          {alternative.items.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{alternative.items.length - 3} more alternatives
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button asChild className="w-full">
                      <Link to={`/alternatives/${slug}-alternatives`}>
                        {t('alternatives.viewAlternatives', language)}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No alternatives available</h3>
            <p className="text-muted-foreground mb-4">
              We're working on adding more tool alternatives. Check back soon!
            </p>
            <Button asChild>
              <Link to="/tools">Browse Tools</Link>
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Can't find what you're looking for?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Let us know what tool alternatives you'd like to see, or suggest new tools for our directory.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/contact">Request Alternatives</Link>
                </Button>
                <Button asChild>
                  <Link to="/submit">Submit a Tool</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default Alternatives;