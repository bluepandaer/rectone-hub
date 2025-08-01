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
import { ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { t, getLocalizedContent } from '@/lib/i18n';
import { buildMeta } from '@/lib/seo';
import type { VSPair, Tool } from '@/lib/types';
import { getVSPairs, getToolBySlug } from '@/lib/api';

const Vs = () => {
  const { language, setLanguage } = useLanguage();
  const [vsPairs, setVsPairs] = useState<(VSPair & { toolA?: Tool; toolB?: Tool })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = buildMeta({
    title: `${t('vs.title', language)} - rect.one`,
    description: t('vs.subtitle', language),
    path: '/vs',
    language,
  });

  useEffect(() => {
    const loadVsPairs = async () => {
      try {
        setLoading(true);
        const pairs = await getVSPairs();
        
        // Load tool data for each pair
        const pairsWithTools = await Promise.all(
          pairs.map(async (pair) => {
            const [toolA, toolB] = await Promise.all([
              getToolBySlug(pair.a_slug),
              getToolBySlug(pair.b_slug),
            ]);
            return { ...pair, toolA: toolA || undefined, toolB: toolB || undefined };
          })
        );
        
        setVsPairs(pairsWithTools);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comparisons');
      } finally {
        setLoading(false);
      }
    };

    loadVsPairs();
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
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">{t('vs.title', language)}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('vs.subtitle', language)}
          </p>
        </div>

        {/* VS Pairs Grid */}
        {vsPairs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vsPairs.map((pair) => (
              <Card key={pair.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span className="font-semibold">
                        {pair.toolA?.name || pair.a_slug}
                      </span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="font-semibold">
                        {pair.toolB?.name || pair.b_slug}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tool Images/Logos */}
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-2">
                        <span className="text-xs font-mono">
                          {(pair.toolA?.name || pair.a_slug).slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">
                        {pair.toolA?.name || pair.a_slug}
                      </p>
                    </div>
                    
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-2">
                        <span className="text-xs font-mono">
                          {(pair.toolB?.name || pair.b_slug).slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">
                        {pair.toolB?.name || pair.b_slug}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  {pair.summary && (
                    <p className="text-sm text-muted-foreground text-center">
                      {getLocalizedContent(pair, 'summary', language)}
                    </p>
                  )}

                  {/* Key Differences */}
                  <div className="space-y-2">
                    {pair.matrix?.features && (
                      <div className="flex flex-wrap gap-1">
                        {pair.matrix.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {pair.matrix.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{pair.matrix.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Compare Button */}
                  <Button asChild className="w-full">
                    <Link to={`/vs/${pair.a_slug}-vs-${pair.b_slug}`}>
                      {t('vs.compare', language)}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No comparisons available</h3>
            <p className="text-muted-foreground mb-4">
              We're working on adding more tool comparisons. Check back soon!
            </p>
            <Button asChild>
              <Link to="/tools">Browse Tools</Link>
            </Button>
          </div>
        )}
      </div>

      <Footer language={language} />
    </div>
  );
};

export default Vs;