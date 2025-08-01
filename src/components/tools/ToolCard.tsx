import { Link } from "react-router-dom";
import { ExternalLink, Star, Heart, Globe, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

import type { Tool } from "@/lib/types";
import type { Language } from "@/lib/i18n";

interface ToolCardProps {
  tool: Tool;
  language?: Language;
}

const ToolCard = ({ tool, language = "en" }: ToolCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFreePlan = () => {
    return tool.pricing.find(p => p.plan.toLowerCase().includes('free') || p.price === '$0');
  };

  const getLowestPricePlan = () => {
    return tool.pricing
      .filter(p => p.price !== '$0' && !p.price.includes('定制') && !p.price.includes('Custom'))
      .sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || Infinity;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || Infinity;
        return priceA - priceB;
      })[0];
  };

  const displayPrice = () => {
    const freePlan = getFreePlan();
    const paidPlan = getLowestPricePlan();
    
    if (freePlan && paidPlan) {
      return language === "zh" ? "免费试用" : "Free trial";
    } else if (freePlan) {
      return language === "zh" ? "免费" : "Free";
    } else if (paidPlan) {
      return paidPlan.price;
    }
    return language === "zh" ? "询价" : "Contact";
  };

  const averageScore = tool.score 
    ? ((tool.score.ease + tool.score.value + tool.score.features + tool.score.docs) / 4).toFixed(1)
    : null;

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: Implement favorites functionality
  };

  return (
    <Card className="group h-full flex flex-col hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {!imageError ? (
                <img
                  src={tool.logo_url || ''}
                  alt={`${tool.name} logo`}
                  className="w-12 h-12 rounded-lg object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {tool.name[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {tool.slogan}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tool.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tool.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center space-x-4 mb-4">
          {tool.is_open_source && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <span>{language === "zh" ? "开源" : "Open Source"}</span>
            </div>
          )}
          {tool.supports_cn && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>{language === "zh" ? "中文" : "Chinese"}</span>
            </div>
          )}
          {tool.has_free_trial && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>{language === "zh" ? "试用" : "Trial"}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        {averageScore && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{averageScore}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({language === "zh" ? "综合评分" : "Overall"})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-primary">
              {displayPrice()}
            </span>
            {getLowestPricePlan() && (
              <span className="text-sm text-muted-foreground ml-1">
                {language === "zh" ? "起" : "from"}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {tool.categories[0]}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex space-x-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/tools/${tool.slug}`}>
            {language === "zh" ? "查看详情" : "View Details"}
          </Link>
        </Button>
        <Button asChild size="sm" className="flex-1">
          <a 
            href={`${tool.website_url}?ref=rect.one`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1"
          >
            <span>{language === "zh" ? "访问" : "Visit"}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;