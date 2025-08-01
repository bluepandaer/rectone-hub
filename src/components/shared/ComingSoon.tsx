import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { t, type Language } from "@/lib/i18n";

interface ComingSoonProps {
  language?: Language;
}

const ComingSoon = ({ language = "en" }: ComingSoonProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {t("comingSoon.title", language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t("comingSoon.description", language)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;