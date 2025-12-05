
import React, { createContext, useContext, useState, useEffect } from 'react';
import { content } from './content';

type Language = 'ru' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: typeof content.ru;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ru');

  useEffect(() => {
    // 1. Check localStorage
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang === 'ru' || savedLang === 'en') {
      setLang(savedLang);
      return;
    }

    // 2. Check Cookie (as requested)
    const match = document.cookie.match(new RegExp('(^| )app_lang=([^;]+)'));
    if (match && (match[2] === 'ru' || match[2] === 'en')) {
      setLang(match[2] as Language);
      return;
    }

    // 3. Fallback to navigator
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'en') {
      setLang('en');
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ru' ? 'en' : 'ru';
    setLang(newLang);
    localStorage.setItem('app_lang', newLang);
    document.cookie = `app_lang=${newLang}; path=/; max-age=31536000`; // 1 year
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: content[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
