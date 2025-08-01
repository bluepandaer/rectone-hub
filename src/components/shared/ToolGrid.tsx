import { Link } from "react-router-dom";
import ToolCard from "@/components/tools/ToolCard";
import { Button } from "@/components/ui/button";
import { t, type Language } from "@/lib/i18n";
import type { Tool } from "@/lib/types";

interface ToolGridProps {
  tools: Tool[];
  title: string;
  language?: Language;
  showAll?: boolean;
  linkTo?: string;
  limit?: number;
}

const ToolGrid = ({ 
  tools, 
  title, 
  language = "en", 
  showAll = false, 
  linkTo,
  limit = 6 
}: ToolGridProps) => {
  const displayTools = showAll ? tools : tools.slice(0, limit);

  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {!showAll && tools.length > limit && linkTo && (
          <Button variant="outline" asChild>
            <Link to={linkTo}>{t("categories.viewAll", language)}</Link>
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} language={language} />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;