import en from './en.json';
import it from './it.json';

/**
 * Local i18n dictionaries (Italian default, English). Keys are dot-notated;
 * `translate()` resolves nested keys and interpolates `{placeholders}`.
 */

export const dictionaries = { it, en } as const;

export type Dictionary = keyof typeof dictionaries;

/** Union of every valid dot-notated translation key (based on the `it` dictionary). */
type Leaves<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? `${K}.${Leaves<T[K]>}` : `${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = Leaves<(typeof it)>;

export type TranslationValues = Record<string, string | number>;

/** A piece of brand content available in both locales (timeline, crew, styles…). */
export interface Localized {
  it: string;
  en: string;
}

/** Picks the localized variant for the active language. */
export function pick(lang: keyof Localized, value: Localized): string {
  return value[lang];
}

/** Resolves `it.events.title` style keys against a dictionary. */
export function translate(
  dictionary: Dictionary,
  key: TranslationKey,
  values?: TranslationValues,
): string {
  const result = key
    .split('.')
    .reduce<unknown>(
      (branch, part) => (branch && typeof branch === 'object' ? (branch as Record<string, unknown>)[part] : undefined),
      dictionaries[dictionary],
    );

  if (typeof result !== 'string') {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing key "${key}" for locale "${dictionary}"`);
    }
    return key;
  }

  if (!values) return result;

  return result.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
