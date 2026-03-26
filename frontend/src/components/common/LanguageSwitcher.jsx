/**
 * LanguageSwitcher.jsx
 *
 * A small toggle button that switches between English and Arabic.
 * Drops into any nav bar — just render <LanguageSwitcher />.
 *
 * When Arabic is selected:
 *  - document.dir  = "rtl"
 *  - document.lang = "ar"
 *  - Arabic Cairo font is active (via CSS data-lang attribute)
 *  - All t() calls return Arabic strings
 */

import useLanguageStore from '../../store/languageStore';

export default function LanguageSwitcher({ className = '' }) {
  const { language, setLanguage } = useLanguageStore();
  const isArabic = language === 'ar';

  return (
    <button
      onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
      title={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
      className={`
        flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5
        rounded-lg border transition-all min-h-[36px]
        ${isArabic
          ? 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <span className="text-base leading-none">{isArabic ? '🇬🇧' : '🇸🇦'}</span>
      <span>{isArabic ? 'EN' : 'ع'}</span>
    </button>
  );
}
