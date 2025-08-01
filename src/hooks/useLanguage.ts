import { useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n';

const LANGUAGE_STORAGE_KEY = 'rect-one-language';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or default to 'en'
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    setLanguage,
  };
};