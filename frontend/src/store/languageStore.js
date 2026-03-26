import { create } from 'zustand';

const useLanguageStore = create((set) => ({
  language: localStorage.getItem('app_language') || 'en',

  setLanguage: (lang) => {
    localStorage.setItem('app_language', lang);

    // Apply to document immediately
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

    // Swap font
    document.documentElement.setAttribute('data-lang', lang);

    set({ language: lang });
  },
}));

export default useLanguageStore;
