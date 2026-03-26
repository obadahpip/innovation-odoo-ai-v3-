import useLanguageStore from '../store/languageStore';
import translations from './translations';

export default function useTranslation() {
  const { language } = useLanguageStore();
  const isRTL = language === 'ar';
  const strings = translations[language] || translations.en;

  const t = (key) => strings[key] ?? translations.en[key] ?? key;

  return { t, isRTL, language };
}
