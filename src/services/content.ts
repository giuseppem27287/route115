import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import type {
  BarberService,
  Event,
  GarageService,
  Global,
  HomePage,
  Locale,
  RentalItem,
  StrapiDocument,
  StrapiPagination,
  StrapiResponse,
  TattooArtist,
} from '@/types';

import { strapiFetch, type StrapiParams } from './api';

/**
 * Typed fetchers (one per content-type) — the single source of truth for the
 * queries used by hooks/pages. Keep endpoint paths and `populate` values in
 * sync with the Strapi schema.
 */

interface CollectionOptions {
  locale?: Locale;
  page?: number;
  pageSize?: number;
  sort?: string;
}

interface CollectionResult<T> {
  items: StrapiDocument<T>[];
  pagination?: StrapiPagination;
}

async function fetchCollection<T>(
  endpoint: string,
  params: StrapiParams,
): Promise<CollectionResult<T>> {
  const res = await strapiFetch<StrapiResponse<StrapiDocument<T>>>(`/${endpoint}`, { params });
  const data = res.data ?? [];
  return { items: Array.isArray(data) ? data : [data], pagination: res.meta.pagination };
}

/* ---------------------------------- Home --------------------------------- */

export function getHomePage(locale: Locale) {
  return strapiFetch<StrapiResponse<StrapiDocument<HomePage>>>('/home-page', {
    params: { locale, populate: '*' },
  }).then((res) => res.data);
}

/* --------------------------------- Events -------------------------------- */

export function getEvents(locale: Locale, options: CollectionOptions = {}) {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, sort = 'date:asc' } = options;
  return fetchCollection<Event>('events', {
    locale,
    sort,
    populate: 'cover',
    pagination: { page, pageSize },
  });
}

export function getEventBySlug(locale: Locale, slug: string) {
  return strapiFetch<StrapiResponse<StrapiDocument<Event>[]>>('/events', {
    params: { locale, filters: { slug: { $eq: slug } }, populate: 'cover,gallery' },
  }).then((res) => res.data?.[0] ?? null);
}

/* --------------------------------- Rental -------------------------------- */

export function getRentalItems(locale: Locale, options: CollectionOptions = {}) {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, sort = 'name:asc' } = options;
  return fetchCollection<RentalItem>('rental-items', {
    locale,
    sort,
    populate: 'images',
    pagination: { page, pageSize },
  });
}

/* --------------------------------- Garage -------------------------------- */

export function getGarageServices(locale: Locale, options: CollectionOptions = {}) {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, sort = 'name:asc' } = options;
  return fetchCollection<GarageService>('garage-services', {
    locale,
    sort,
    pagination: { page, pageSize },
  });
}

/* --------------------------------- Barber -------------------------------- */

export function getBarberServices(locale: Locale, options: CollectionOptions = {}) {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, sort = 'name:asc' } = options;
  return fetchCollection<BarberService>('barber-services', {
    locale,
    sort,
    pagination: { page, pageSize },
  });
}

/* ---------------------------------- Tattoo --------------------------------- */

export function getTattooArtists(locale: Locale, options: CollectionOptions = {}) {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, sort = 'name:asc' } = options;
  return fetchCollection<TattooArtist>('tattoo-artists', {
    locale,
    sort,
    populate: 'portfolio',
    pagination: { page, pageSize },
  });
}

/* ---------------------------------- Global -------------------------------- */

export function getGlobal(locale: Locale) {
  return strapiFetch<StrapiResponse<StrapiDocument<Global>>>('/global', {
    params: { locale, populate: '*' },
  }).then((res) => res.data);
}
