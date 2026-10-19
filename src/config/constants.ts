import type { Locale } from '@/types';

export const SITE_NAME = 'Route 115';

export const SUPPORTED_LOCALES: readonly Locale[] = ['it', 'en'] as const;

export interface LocaleOption {
  code: Locale;
  /** Label shown in the language switcher. */
  label: string;
  flag: string;
}

export const LOCALE_OPTIONS: readonly LocaleOption[] = [
  { code: 'it', label: 'Italiano', flag: 'IT' },
  { code: 'en', label: 'English', flag: 'EN' },
] as const;

export interface NavItem {
  /** Route path (also the key used by the i18n dictionaries). */
  key: string;
  path: string;
}

/** Main navigation — shared by Header, Footer and any sitemap logic. */
export const NAV_ITEMS: readonly NavItem[] = [
  { key: 'home', path: '/' },
  { key: 'events', path: '/events' },
  { key: 'rental', path: '/rental' },
  { key: 'garage', path: '/garage' },
  { key: 'barber', path: '/barber' },
  { key: 'tattoo', path: '/tattoo' },
] as const;

/** Default page size for paginated Strapi collections. */
export const DEFAULT_PAGE_SIZE = 12;

/** localStorage key used to persist the language preference. */
export const LANGUAGE_STORAGE_KEY = 'route115:lang';
