import type { Locale } from '@/types';

/** Locale tag used for `Intl` formatting. */
const localeTag = (lang: Locale) => (lang === 'it' ? 'it-IT' : 'en-US');

const pad = (n: number) => String(n).padStart(2, '0');

/** "SAT 14.11" — the pill badge used across event cards. */
export function formatEventBadge(iso: string, lang: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const weekday = new Intl.DateTimeFormat(localeTag(lang), { weekday: 'short' })
    .format(date)
    .replace('.', '');
  return `${weekday} ${pad(date.getDate())}.${pad(date.getMonth() + 1)}`.toUpperCase();
}

/** "SATURDAY" — the long weekday shown under the date. */
export function formatWeekdayLong(iso: string, lang: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(localeTag(lang), { weekday: 'long' }).format(date).toUpperCase();
}

/** Stable month key for filters, e.g. "2026-11". */
export function monthKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

/** Short month label for filter chips, e.g. "nov". */
export function formatMonthShort(iso: string, lang: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(localeTag(lang), { month: 'short' }).format(date).replace('.', '');
}

/** "14 nov 2026" — used in confirmations. */
export function formatLongDate(iso: string, lang: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(localeTag(lang), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
