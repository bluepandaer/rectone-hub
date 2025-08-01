import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';

const CookieNotice = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if analytics is enabled and cookie consent is required
    const settings = localStorage.getItem('rectone-settings');
    const hasAccepted = localStorage.getItem('cookie-consent-accepted');
    
    if (settings && !hasAccepted) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.analytics !== 'none' && parsed.cookieConsent) {
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Error checking cookie settings:', error);
      }
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent-accepted', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent-declined', 'true');
    setIsVisible(false);
    // Disable analytics
    const settings = localStorage.getItem('rectone-settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        parsed.analytics = 'none';
        localStorage.setItem('rectone-settings', JSON.stringify(parsed));
      } catch (error) {
        console.error('Error disabling analytics:', error);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  {t('cookie.title', language)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t('cookie.description', language)}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={acceptCookies}
                  className="flex-1"
                >
                  {t('cookie.accept', language)}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={declineCookies}
                  className="flex-1"
                >
                  {t('cookie.decline', language)}
                </Button>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieNotice;