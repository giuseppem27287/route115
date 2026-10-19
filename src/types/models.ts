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
  /** e.g. "Tribute Bands", "Heavy Metal". */
  genre?: string | null;
  /** e.g. "22:00" — doors opening time. */
  startTime?: string | null;
  /** `false` = ticket required, `true`/null = free entry. */
  freeEntry?: boolean | null;
  excerpt?: string | null;
  description?: string | null;
  cover?: UploadFile | null;
  gallery?: UploadFile[];
}

/** Key/value pair used by Strapi components (bike specs…). */
export interface KeyValueComponent {
  label: string;
  value: string;
}

/** `rental-item` collection type (motorcycles of the fleet) */
export interface RentalItem {
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  pricePerDay: number;
  available: boolean;
  /** Repeating component: engine, torque, seat height… */
  specs?: KeyValueComponent[] | null;
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
  /** Guest artist fields. */
  city?: string | null;
  guestDates?: string | null;
  guestNote?: string | null;
  portfolio?: UploadFile[];
}

/** `product` collection type (concept store) */
export interface Product {
  name: string;
  slug: string;
  price: number;
  /** Original price shown struck-through (optional promo). */
  compareAtPrice?: number | null;
  description?: string | null;
  /** Ribbon text, e.g. "Limited Rock Edition". */
  badge?: string | null;
  sizes?: string[] | null;
  /** Bullet feature badges, e.g. "100% Heavy Cotton". */
  features?: string[] | null;
  featured?: boolean | null;
  images?: UploadFile[];
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

/** `lead` collection type (form submissions: bookings, waiting lists, press kits) */
export interface Lead {
  type: 'table-booking' | 'rental-booking' | 'barber-list' | 'tattoo-consult' | 'garage-appt' | 'band-booking';
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message?: string | null;
  /** File name / reference of an optional upload. */
  attachmentName?: string | null;
}
