import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/shared/SEOHead';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, ExternalLink, Users, Building2, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { t, getLocalizedContent } from '@/lib/i18n';
import { buildMeta, buildVSJsonLD } from '@/lib/seo';
import type { VSPair, Tool } from '@/lib/types';
import { getVSPair, getToolBySlug } from '@/lib/api';

const VsDetail = () => {
  const { comparison } = useParams<{ comparison: string }>();
  const { language, setLanguage } = useLanguage();
  const [vsPair, setVsPair] = useState<VSPair | null>(null);
  const [toolA, setToolA] = useState<Tool | null>(null);
  const [toolB, setToolB] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComparison = async () => {
      if (!comparison) return;
      
      try {
        setLoading(true);
        
        // Parse comparison string (format: "tool-a-vs-tool-b")
        const parts = comparison.split('-vs-');
        if (parts.length !== 2) {
          throw new Error('Invalid comparison format');
        }
        
        const [aSlug, bSlug] = parts;
        
        const [pairData, toolAData, toolBData] = await Promise.all([
          getVSPair(aSlug, bSlug),
          getToolBySlug(aSlug),
          getToolBySlug(bSlug),
        ]);
        
        if (!pairData) {
          throw new Error('Comparison not found');
        }
        
        setVsPair(pairData);
        setToolA(toolAData);
        setToolB(toolBData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comparison');
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [comparison]);

  const meta = buildMeta({
    title: toolA && toolB ? `${toolA.name} vs ${toolB.name} - Comparison` : 'Tool Comparison',
    description: vsPair ? getLocalizedContent(vsPair, 'summary', language) : 'Compare tools side by side',
    path: `/vs/${comparison}`,
    language,
    ...(vsPair && toolA && toolB && {
      structuredData: buildVSJsonLD(vsPair, toolA, toolB),
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

  if (error || !vsPair || !toolA || !toolB) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar language={language} onLanguageChange={setLanguage} />
        <ErrorState error={error || 'Comparison not found'} />
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
            {toolA.name} vs {toolB.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {getLocalizedContent(vsPair, 'summary', language) || 
             `Compare ${toolA.name} and ${toolB.name} to find the best tool for your needs.`}
          </p>
        </div>

        {/* Quick Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { tool: toolA, side: 'a' },
            { tool: toolB, side: 'b' },
          ].map(({ tool, side }) => (
            <Card key={side} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-sm font-mono">
                      {tool.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    <p className="text-muted-foreground">{tool.slogan}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tool.categories.slice(0, 3).map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Starting Price</span>
                    <span className="font-medium">
                      {tool.pricing[0]?.price || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Platforms</span>
                    <span className="font-medium text-right">
                      {tool.platforms.join(', ')}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                    Visit {tool.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Verdict Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { 
              icon: GraduationCap, 
              title: t('vs.verdict.beginner', language), 
              verdict: vsPair.verdict_for.beginner 
            },
            { 
              icon: Users, 
              title: t('vs.verdict.team', language), 
              verdict: vsPair.verdict_for.team 
            },
            { 
              icon: Building2, 
              title: t('vs.verdict.enterprise', language), 
              verdict: vsPair.verdict_for.enterprise 
            },
          ].map(({ icon: Icon, title, verdict }) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{verdict}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link to={`/tools/${toolA.slug}`}>
              Learn more about {toolA.name}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/tools/${toolB.slug}`}>
              Learn more about {toolB.name}
            </Link>
          </Button>
          <Button asChild>
            <Link to="/vs">
              View more comparisons
            </Link>
          </Button>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default VsDetail;