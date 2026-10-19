import type { TranslationKey } from '@/i18n';
import type { Locale } from '@/types';

export const SITE_NAME = 'Route 115';

export const SUPPORTED_LOCALES: readonly Locale[] = ['it', 'en'] as const;

export interface LocaleOption {
  code: Locale;
  /** Label shown in the language switcher. */
  label: string;
  /** Short badge shown in the switcher buttons. */
  flag: string;
}

export const LOCALE_OPTIONS: readonly LocaleOption[] = [
  { code: 'it', label: 'Italiano', flag: 'ITA' },
  { code: 'en', label: 'English', flag: 'ENG' },
] as const;

/* ------------------------------- Navigation ------------------------------- */

export interface NavItem {
  /** i18n key of the label. */
  key: TranslationKey;
  path: string;
  /** Emoji icon used in dropdowns / mobile menu (Figma Make design). */
  icon: string;
  /** Renders the "Prossima Apertura" badge. */
  soon?: boolean;
}

export interface NavGroup {
  key: TranslationKey;
  icon: string;
  items: readonly NavItem[];
}

/** Top-level links (rendered in order by the Header). */
export const NAV_LINKS: readonly NavItem[] = [
  { key: 'nav.events', path: '/events', icon: '🎸' },
  { key: 'nav.play', path: '/booking-band', icon: '🎤' },
  { key: 'nav.store', path: '/store', icon: '🛍️' },
  { key: 'nav.about', path: '/about', icon: '🏆' },
] as const;

/** Dropdown groups: "Moto" and "Servizi" (Figma Make design). */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    key: 'nav.moto',
    icon: '🏍️',
    items: [
      { key: 'hub.garage', path: '/garage', icon: '🛠️' },
      { key: 'hub.rental', path: '/rental', icon: '🏍️' },
    ],
  },
  {
    key: 'nav.hub',
    icon: '💈',
    items: [
      { key: 'hub.barber', path: '/barber-shop', icon: '💈', soon: true },
      { key: 'hub.tattoo', path: '/tattoo-studio', icon: '🎨', soon: true },
    ],
  },
] as const;

/** Quick-contact entry used by the Footer and Garage page. */
export const SITE_CONTACT = {
  addressLine: 'Via Elorina n.68',
  cityLine: '96100 Siracusa, Italy',
  phone: '+39 0931 00 00 00',
  email: 'ride@route115.it',
  whatsappUrl: 'https://wa.me/390931000000',
  mapsUrl: 'https://maps.google.com/?q=Via+Elorina+68+Siracusa',
} as const;

/* --------------------------------- Misc ---------------------------------- */

/** Default page size for paginated Strapi collections. */
export const DEFAULT_PAGE_SIZE = 12;

/** localStorage key used to persist the language preference. */
export const LANGUAGE_STORAGE_KEY = 'route115:lang';
