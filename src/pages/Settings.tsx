import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/hooks/useLanguage';
import { t, type Language } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Database, BarChart3, Globe, Cookie } from 'lucide-react';

interface SettingsData {
  dataSource: 'supabase' | 'fallback';
  analytics: 'none' | 'ga4' | 'plausible' | 'umami';
  analyticsId: string;
  refTracking: boolean;
  cookieConsent: boolean;
  language: Language;
}

const Settings = () => {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<SettingsData>({
    dataSource: 'supabase',
    analytics: 'none',
    analyticsId: '',
    refTracking: false,
    cookieConsent: false,
    language: language,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('rectone-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('rectone-settings', JSON.stringify(settings));
    
    // Apply language change
    if (settings.language !== language) {
      setLanguage(settings.language);
    }
    
    // Apply data source change (would require app reload)
    if (settings.dataSource === 'fallback') {
      localStorage.setItem('VITE_USE_FALLBACK_DATA', 'true');
    } else {
      localStorage.removeItem('VITE_USE_FALLBACK_DATA');
    }
    
    setHasChanges(false);
    toast({
      title: t('settings.saved', language),
      description: t('settings.savedDescription', language),
    });
  };

  const resetSettings = () => {
    setSettings({
      dataSource: 'supabase',
      analytics: 'none',
      analyticsId: '',
      refTracking: false,
      cookieConsent: false,
      language: 'en',
    });
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">{t('settings.title', language)}</h1>
          </div>
          <p className="text-muted-foreground">
            {t('settings.description', language)}
          </p>
        </div>

        <div className="space-y-6">
          {/* Data Source Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <CardTitle>{t('settings.dataSource.title', language)}</CardTitle>
              </div>
              <CardDescription>
                {t('settings.dataSource.description', language)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="data-source">{t('settings.dataSource.label', language)}</Label>
                <Select
                  value={settings.dataSource}
                  onValueChange={(value: 'supabase' | 'fallback') => updateSetting('dataSource', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">
                      <div className="flex items-center gap-2">
                        <span>Supabase</span>
                        <Badge variant="secondary">{t('settings.dataSource.recommended', language)}</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="fallback">
                      <div className="flex items-center gap-2">
                        <span>{t('settings.dataSource.fallback', language)}</span>
                        <Badge variant="outline">{t('settings.dataSource.static', language)}</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {settings.dataSource === 'fallback' && (
                  <p className="text-sm text-muted-foreground">
                    {t('settings.dataSource.fallbackNote', language)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <CardTitle>{t('settings.analytics.title', language)}</CardTitle>
              </div>
              <CardDescription>
                {t('settings.analytics.description', language)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="analytics">{t('settings.analytics.provider', language)}</Label>
                <Select
                  value={settings.analytics}
                  onValueChange={(value: 'none' | 'ga4' | 'plausible' | 'umami') => updateSetting('analytics', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('settings.analytics.none', language)}</SelectItem>
                    <SelectItem value="ga4">Google Analytics 4</SelectItem>
                    <SelectItem value="plausible">Plausible Analytics</SelectItem>
                    <SelectItem value="umami">Umami Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.analytics !== 'none' && (
                <div className="space-y-3">
                  <Label htmlFor="analytics-id">{t('settings.analytics.id', language)}</Label>
                  <Input
                    id="analytics-id"
                    value={settings.analyticsId}
                    onChange={(e) => updateSetting('analyticsId', e.target.value)}
                    placeholder={
                      settings.analytics === 'ga4' ? 'G-XXXXXXXXXX' :
                      settings.analytics === 'plausible' ? 'yourdomain.com' :
                      'tracking-id'
                    }
                  />
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="ref-tracking">{t('settings.analytics.refTracking', language)}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.analytics.refTrackingDescription', language)}
                  </p>
                </div>
                <Switch
                  id="ref-tracking"
                  checked={settings.refTracking}
                  onCheckedChange={(checked) => updateSetting('refTracking', checked)}
                />
              </div>

              {settings.analytics !== 'none' && (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="cookie-consent">{t('settings.analytics.cookieConsent', language)}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.analytics.cookieConsentDescription', language)}
                    </p>
                  </div>
                  <Switch
                    id="cookie-consent"
                    checked={settings.cookieConsent}
                    onCheckedChange={(checked) => updateSetting('cookieConsent', checked)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <CardTitle>{t('settings.language.title', language)}</CardTitle>
              </div>
              <CardDescription>
                {t('settings.language.description', language)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="language">{t('settings.language.label', language)}</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value: Language) => updateSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="zh">🇨🇳 简体中文</SelectItem>
                    <SelectItem value="es">🇪🇸 Español</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                    <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          {settings.analytics !== 'none' && settings.cookieConsent && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-amber-800 dark:text-amber-200">
                    {t('settings.privacy.title', language)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  {t('settings.privacy.description', language)}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button
              variant="outline"
              onClick={resetSettings}
              disabled={!hasChanges}
            >
              {t('settings.reset', language)}
            </Button>
            
            <Button
              onClick={saveSettings}
              disabled={!hasChanges}
            >
              {t('settings.save', language)}
            </Button>
          </div>
        </div>
      </div>

      <Footer language={language} />
    </div>
  );
};

export default Settings;