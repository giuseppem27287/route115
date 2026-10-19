import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { LANGUAGE_STORAGE_KEY, SUPPORTED_LOCALES } from '@/config/constants';
import { config } from '@/config/env';
import { translate, type TranslationKey, type TranslationValues } from '@/i18n';
import type { Locale } from '@/types';

export interface LanguageContextValue {
  /** Current locale. */
  lang: Locale;
  /** Switches the locale (persisted to localStorage and applied to `<html lang>`). */
  setLang: (lang: Locale) => void;
  /** Translates a dictionary key, with optional `{placeholder}` interpolation. */
  t: (key: TranslationKey, values?: TranslationValues) => string;
  /** `true` once the persisted locale has been hydrated on mount. */
  ready: boolean;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return config.defaultLocale as Locale;

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (SUPPORTED_LOCALES.includes(stored as Locale)) return stored as Locale;

  const browserLocale = window.navigator.language.slice(0, 2);
  if (SUPPORTED_LOCALES.includes(browserLocale as Locale)) return browserLocale as Locale;

  return config.defaultLocale as Locale;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(readStoredLocale);
  const [ready, setReady] = useState(false);

  // Hydration flag: lets the shell show the <Preloader /> for the first paint.
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) => translate(lang, key, values),
    [lang],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t, ready }),
    [lang, setLang, t, ready],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
