'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  LANGUAGES,
  UI_STRINGS,
  CATEGORY_LOCALIZED,
  COURSES_LOCALIZED,
  ARTICLE_LOCALIZED,
  REVIEWS_LOCALIZED
} from '@/lib/translations';

const LanguageContext = createContext({
  lang: 'en',
  setLanguage: () => {},
  t: (key) => key,
  getCategoryData: (cat) => cat,
  getCourseData: (course) => course,
  getArticleData: (art) => art,
  getReviewData: (rev) => rev,
  languages: LANGUAGES
});

const STORAGE_KEY = 'nature1_lang_preference';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'hinglish')) {
        setLangState(savedLang);
        document.documentElement.lang = savedLang === 'hi' ? 'hi' : 'en';
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setMounted(true);
  }, []);

  const setLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'hi' || newLang === 'hinglish') {
      setLangState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
        document.documentElement.lang = newLang === 'hi' ? 'hi' : 'en';
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }
  };

  // Translation helper function
  const t = (key, fallback = '') => {
    const langDict = UI_STRINGS[lang] || UI_STRINGS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return UI_STRINGS.en[key] || fallback || key;
  };

  // Localized category helper
  const getCategoryData = (cat) => {
    if (!cat) return cat;
    const catKey = cat.key || cat.slug;
    const localized = CATEGORY_LOCALIZED[catKey]?.[lang];
    if (!localized) return cat;
    return {
      ...cat,
      name: localized.name || cat.name,
      shortName: localized.shortName || cat.shortName,
      pill: localized.pill || cat.pill,
      description: localized.description || cat.description,
      tagline: localized.tagline || cat.tagline
    };
  };

  // Localized course helper
  const getCourseData = (course) => {
    if (!course) return course;
    const localized = COURSES_LOCALIZED[course.id]?.[lang];
    if (!localized) return course;
    return {
      ...course,
      title: localized.title || course.title,
      desc: localized.desc || course.desc,
      level: localized.level || course.level,
      tag: localized.tag || course.tag,
      duration: localized.duration || course.duration,
      modulesCount: localized.modulesCount || course.modulesCount,
      syllabus: localized.syllabus || course.syllabus
    };
  };

  // Localized article helper
  const getArticleData = (art) => {
    if (!art) return art;
    const localized = ARTICLE_LOCALIZED[art.id]?.[lang];
    const catLocalized = CATEGORY_LOCALIZED[art.category]?.[lang];
    if (!localized && !catLocalized) return art;
    return {
      ...art,
      title: localized?.title || art.title,
      excerpt: localized?.excerpt || art.excerpt,
      readTime: localized?.readTime || art.readTime,
      keyTakeaways: localized?.keyTakeaways || art.keyTakeaways,
      categoryLabel: catLocalized?.name || art.categoryLabel,
      categoryPill: catLocalized?.pill || art.categoryPill
    };
  };

  // Localized review helper
  const getReviewData = (rev) => {
    if (!rev) return rev;
    const localized = REVIEWS_LOCALIZED[rev.id]?.[lang];
    if (!localized) return rev;
    return {
      ...rev,
      quote: localized.quote || rev.quote,
      role: localized.role || rev.role,
      tag: localized.tag || rev.tag
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLanguage,
        t,
        getCategoryData,
        getCourseData,
        getArticleData,
        getReviewData,
        languages: LANGUAGES,
        mounted
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
