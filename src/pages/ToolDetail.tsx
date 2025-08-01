import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ExternalLink, Star, Shield, Globe, Zap, Users, Calendar, Tag } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ToolGrid from "@/components/shared/ToolGrid";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { t, type Language } from "@/lib/i18n";
import { getToolBySlug, getTools } from "@/lib/api";
import type { Tool } from "@/lib/types";

const ToolDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, setLanguage } = useLanguage();
  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const toolData = await getToolBySlug(slug);
        
        if (!toolData) {
          setError("Tool not found");
          return;
        }

        setTool(toolData);

        // Load related tools from same categories
        const relatedResult = await getTools({
          category: toolData.categories[0],
          limit: 6
        });
        
        // Filter out current tool
        const related = relatedResult.data.filter(t => t.slug !== slug);
        setRelatedTools(related.slice(0, 3));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tool');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <LoadingState />
        <Footer />
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <ErrorState error={error || "Tool not found"} language={language} />
        <Footer />
      </div>
    );
  }

  const averageScore = tool.score 
    ? (tool.score.ease + tool.score.value + tool.score.features + tool.score.docs) / 4 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <img
                src={tool.logo_url || "/api/placeholder/80/80"}
                alt={tool.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{tool.name}</h1>
                {tool.is_open_source && (
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    {t("tools.openSource", language)}
                  </Badge>
                )}
                {tool.supports_cn && (
                  <Badge variant="secondary">
                    <Globe className="h-3 w-3 mr-1" />
                    {t("tools.chineseSupport", language)}
                  </Badge>
                )}
                {tool.has_free_trial && (
                  <Badge variant="secondary">
                    <Zap className="h-3 w-3 mr-1" />
                    {t("tools.freeTrial", language)}
                  </Badge>
                )}
              </div>
              
              <p className="text-xl text-muted-foreground mb-4">{tool.slogan}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.categories.map((category) => (
                  <Badge key={category} variant="outline">
                    <Link to={`/tools?category=${category}`}>
                      {category}
                    </Link>
                  </Badge>
                ))}
                {tool.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    <Link to={`/tools?tag=${tag}`}>
                      {tag}
                    </Link>
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a 
                    href={tool.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("tools.visitWebsite", language)}
                  </a>
                </Button>
                
                {tool.docs_url && (
                  <Button variant="outline" asChild>
                    <a 
                      href={tool.docs_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {t("tools.documentation", language)}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t("toolDetail.overview", language)}</TabsTrigger>
                <TabsTrigger value="features">{t("toolDetail.features", language)}</TabsTrigger>
                <TabsTrigger value="pricing">{t("toolDetail.pricing", language)}</TabsTrigger>
                <TabsTrigger value="faq">{t("toolDetail.faq", language)}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("toolDetail.about", language)} {tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p>{tool.description_md}</p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-600">{t("toolDetail.pros", language)}</h4>
                        <ul className="space-y-1">
                          {tool.pros.map((pro, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-red-600">{t("toolDetail.cons", language)}</h4>
                        <ul className="space-y-1">
                          {tool.cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">✗</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("toolDetail.features", language)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">{t("toolDetail.platforms", language)}</h4>
                        <div className="flex flex-wrap gap-2">
                          {tool.platforms.map((platform) => (
                            <Badge key={platform} variant="secondary">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">{t("toolDetail.integrations", language)}</h4>
                        <div className="flex flex-wrap gap-2">
                          {tool.integrations.map((integration) => (
                            <Badge key={integration} variant="outline">
                              {integration}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">{t("toolDetail.loginMethods", language)}</h4>
                        <div className="flex flex-wrap gap-2">
                          {tool.login_methods.map((method) => (
                            <Badge key={method} variant="outline">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pricing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("toolDetail.pricing", language)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {tool.pricing.map((plan, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{plan.plan}</h4>
                            <span className="text-lg font-bold">{plan.price}</span>
                          </div>
                          {plan.notes && (
                            <p className="text-sm text-muted-foreground">{plan.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("toolDetail.faq", language)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tool.faq.map((item, index) => (
                        <div key={index}>
                          <h4 className="font-semibold mb-2">{item.q}</h4>
                          <p className="text-muted-foreground">{item.a}</p>
                          {index < tool.faq.length - 1 && <Separator className="mt-4" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="space-y-6">
              {/* Score Card */}
              {tool.score && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      {t("toolDetail.rating", language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold">
                        {averageScore.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("toolDetail.outOf5", language)}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(tool.score).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}</span>
                          <span>{value}/5</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Meta Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("toolDetail.information", language)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {tool.is_open_source ? t("toolDetail.openSource", language) : t("toolDetail.proprietary", language)}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {t("toolDetail.updated", language)}: {new Date(tool.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {tool.supports_cn ? t("toolDetail.supportsChina", language) : t("toolDetail.noChineseSupport", language)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="mt-12">
            <ToolGrid
              tools={relatedTools}
              title={t("toolDetail.relatedTools", language)}
              language={language as Language}
              showAll={false}
              limit={3}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ToolDetail;