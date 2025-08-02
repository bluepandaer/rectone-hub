
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { Language } from '@/lib/i18n';

const LANGUAGE_STORAGE_KEY = 'rect-one-language';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback for components that might not be wrapped in provider
    const [language, setLanguage] = useState<Language>(() => {
      if (typeof window === 'undefined') return 'en';
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored && ['en', 'zh', 'es', 'de', 'ja'].includes(stored)) {
        return stored as Language;
      }
      // Auto-detect from browser
      if (navigator.language?.toLowerCase().startsWith('zh')) return 'zh';
      return 'en';
    });

    return { language, setLanguage };
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    
    // Get from localStorage or auto-detect
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && ['en', 'zh', 'es', 'de', 'ja'].includes(stored)) {
      return stored as Language;
    }
    
    // Auto-detect from browser
    if (navigator.language?.toLowerCase().startsWith('zh')) return 'zh';
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    // Save to localStorage and update document language whenever language changes
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
