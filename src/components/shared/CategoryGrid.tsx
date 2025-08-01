import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PenTool, 
  Code, 
  Palette, 
  Zap, 
  TrendingUp, 
  BarChart, 
  Video, 
  Headphones,
  LucideIcon
} from "lucide-react";
import { t, getLocalizedContent, type Language } from "@/lib/i18n";
import type { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
  language?: Language;
  showAll?: boolean;
  limit?: number;
}

const iconMap: Record<string, LucideIcon> = {
  PenTool,
  Code,
  Palette,
  Zap,
  TrendingUp,
  BarChart,
  Video,
  Headphones,
};

const CategoryGrid = ({ categories, language = "en", showAll = false, limit = 8 }: CategoryGridProps) => {
  const displayCategories = showAll ? categories : categories.slice(0, limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("categories.title", language)}</h2>
        {!showAll && categories.length > limit && (
          <Button variant="outline" asChild>
            <Link to="/categories">{t("categories.viewAll", language)}</Link>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayCategories.map((category) => {
          const IconComponent = iconMap[category.icon || 'Code'];
          const name = getLocalizedContent(category, 'name', language);
          const description = getLocalizedContent(category, 'description', language);
          
          return (
            <Link key={category.id} to={`/categories/${category.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${category.color}15`, color: category.color }}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        {category.count} {t("categories.tools", language)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {description && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;