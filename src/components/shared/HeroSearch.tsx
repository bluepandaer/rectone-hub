import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { t, type Language } from "@/lib/i18n";

interface HeroSearchProps {
  language?: Language;
}

const HeroSearch = ({ language = "en" }: HeroSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("hero.search.placeholder", language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg bg-background border-2 focus:border-primary"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 px-8">
          {t("hero.search.button", language)}
        </Button>
      </form>
    </div>
  );
};

export default HeroSearch;