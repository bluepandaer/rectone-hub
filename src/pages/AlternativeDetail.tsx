import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/shared/SEOHead';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import ToolCard from '@/components/tools/ToolCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { t, getLocalizedContent } from '@/lib/i18n';
import { buildMeta, buildAlternativesJsonLD } from '@/lib/seo';
import type { Alternative, Tool } from '@/lib/types';
import { getAlternativeByBrand, getToolBySlug } from '@/lib/api';

const AlternativeDetail = () => {
  const { brand } = useParams<{ brand: string }>();
  const { language, setLanguage } = useLanguage();
  const [alternative, setAlternative] = useState<Alternative | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlternative = async () => {
      if (!brand) return;
      
      try {
        setLoading(true);
        
        // Parse brand from URL (format: "brand-name-alternatives")
        const brandName = brand.replace(/-alternatives$/, '').replace(/-/g, ' ');
        const alternativeData = await getAlternativeByBrand(brandName);
        
        if (!alternativeData) {
          throw new Error('Alternative not found');
        }
        
        setAlternative(alternativeData);
        
        // Load tool data for each alternative
        const toolsData = await Promise.all(
          alternativeData.items.map(item => getToolBySlug(item.tool_slug))
        );
        
        setTools(toolsData.filter(Boolean) as Tool[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load alternatives');
      } finally {
        setLoading(false);
      }
    };

    loadAlternative();
  }, [brand]);

  const brandName = alternative ? getLocalizedContent(alternative, 'brand', language) : '';
  const description = alternative ? getLocalizedContent(alternative, 'description', language) : '';

  const meta = buildMeta({
    title: `${brandName} Alternatives - Find Better Options`,
    description: description || `Discover the best alternatives to ${brandName}. Compare features, pricing, and find the perfect tool for your needs.`,
    path: `/alternatives/${brand}`,
    language,
    ...(alternative && tools.length > 0 && {
      structuredData: buildAlternativesJsonLD(alternative, tools),
    }),
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

  if (error || !alternative) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar language={language} onLanguageChange={setLanguage} />
        <ErrorState error={error || 'Alternative not found'} />
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead meta={meta} />
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Best {brandName} Alternatives
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {description || `Discover powerful alternatives to ${brandName} that might be a better fit for your specific needs, budget, or workflow.`}
          </p>
        </div>

        {/* Why Consider Alternatives Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t('alternatives.reasons', language)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Better Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Find tools with more affordable pricing models or better value for money.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Specific Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover tools that excel in specific areas important to your workflow.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Better Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Find alternatives that work better with your existing tech stack.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternatives List */}
        {tools.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {tools.length} Alternative{tools.length !== 1 ? 's' : ''} to {brandName}
              </h2>
              <Badge variant="secondary">
                {tools.length} {tools.length === 1 ? 'option' : 'options'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => {
                const reason = alternative.items.find(item => item.tool_slug === tool.slug)?.reason;
                
                return (
                  <div key={tool.id} className="space-y-3">
                    <ToolCard tool={tool} language={language} />
                    {reason && (
                      <Card className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-1">Why consider this alternative?</h4>
                          <p className="text-sm text-muted-foreground">{reason}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Selection Advice */}
            <Card>
              <CardHeader>
                <CardTitle>How to Choose the Right Alternative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Consider Your Needs</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• What features are most important to you?</li>
                      <li>• What's your budget for this tool?</li>
                      <li>• How many team members will use it?</li>
                      <li>• What platforms do you need support for?</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Evaluation Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Try free trials when available</li>
                      <li>• Read user reviews and case studies</li>
                      <li>• Check integration capabilities</li>
                      <li>• Consider long-term scalability</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Differences Section */}
            <Card>
              <CardHeader>
                <CardTitle>Key Differences from {brandName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alternative.items.map((item, index) => {
                    const tool = tools.find(t => t.slug === item.tool_slug);
                    if (!tool) return null;
                    
                    return (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-mono">
                            {tool.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.reason}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {tool.pricing[0]?.price || 'Custom'}
                            </Badge>
                            {tool.is_open_source && (
                              <Badge variant="secondary" className="text-xs">
                                Open Source
                              </Badge>
                            )}
                            {tool.has_free_trial && (
                              <Badge variant="secondary" className="text-xs">
                                Free Trial
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/tools/${tool.slug}`}>
                            View Details
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No alternatives found</h3>
            <p className="text-muted-foreground mb-4">
              We're working on adding alternatives for {brandName}. Check back soon!
            </p>
            <Button asChild>
              <Link to="/tools">Browse All Tools</Link>
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Found the right alternative?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Compare more tools, read detailed reviews, or discover new alternatives in our directory.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/alternatives">More Alternatives</Link>
                </Button>
                <Button asChild>
                  <Link to="/tools">Browse All Tools</Link>
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

export default AlternativeDetail;