import { useContext } from 'react';

import { LanguageContext, type LanguageContextValue } from '@/context/LanguageContext';

/** Access the current locale, the `t()` translator and `setLang()`. */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage() must be used inside <LanguageProvider>');
  }
  return ctx;
}
