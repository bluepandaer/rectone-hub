import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { t, type Language } from "@/lib/i18n";

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
  language?: Language;
}

const ErrorState = ({ error, onRetry, language = "en" }: ErrorStateProps) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">
            {t("common.error", language)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-muted-foreground">
              {error}
            </p>
          )}
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              {t("common.retry", language)}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;