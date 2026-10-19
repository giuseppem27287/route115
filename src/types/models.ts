import type { UploadFile } from './strapi';

/**
 * Content models mirroring the Strapi v5 schemas.
 *
 * NOTE: field names below are the agreed starting point for the CMS schema —
 * keep this file in sync with the actual content-types defined in Strapi
 * (Content-Type Builder). Relations are typed by their *populated* shape,
 * i.e. what the REST API returns after `populate` is applied.
 */

/** `event` collection type */
export interface Event {
  title: string;
  slug: string;
  /** ISO date string. */
  date: string;
  location: string;
  excerpt?: string | null;
  description?: string | null;
  cover?: UploadFile | null;
  gallery?: UploadFile[];
}

/** `rental-item` collection type (motos, gear, ...) */
export interface RentalItem {
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  pricePerDay: number;
  available: boolean;
  images?: UploadFile[];
}

/** `garage-service` collection type */
export interface GarageService {
  name: string;
  slug: string;
  description?: string | null;
  price?: number | null;
  icon?: string | null;
}

/** `barber-service` collection type */
export interface BarberService {
  name: string;
  slug: string;
  description?: string | null;
  price?: number | null;
  durationMinutes?: number | null;
}

/** `tattoo-artist` collection type */
export interface TattooArtist {
  name: string;
  slug: string;
  bio?: string | null;
  styles?: string[] | null;
  portfolio?: UploadFile[];
}

/** `home-page` single type */
export interface HomePage {
  heroTitle: string;
  heroSubtitle?: string | null;
  heroImage?: UploadFile | null;
  intro?: string | null;
}

/** `global` single type (shared site settings) */
export interface Global {
  siteName: string;
  tagline?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  socialLinks?: { platform: string; url: string }[];
}
