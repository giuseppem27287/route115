/**
 * Generic typings for the Strapi v5 REST API.
 *
 * Strapi v5 responses are *flattened*: user fields sit directly on each item
 * (no `data.attributes` wrapper) and `documentId` (string) is the stable
 * identifier used to address a document.
 */

export type Locale = 'it' | 'en';

/** System fields present on every Strapi v5 document. */
export interface StrapiSystemFields {
  /** Numeric id (positional). Prefer `documentId` to address a document. */
  id: number;
  /** Stable, unique identifier used in REST lookups (`/api/{ct}/{documentId}`). */
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  /** Locale of this document variant. */
  locale: Locale;
}

/** A content-type's fields combined with the Strapi system fields. */
export type StrapiDocument<T> = T & StrapiSystemFields;

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

/** Top-level shape of a Content API response (`data` may be one, many or null). */
export interface StrapiResponse<T> {
  data: T | T[] | null;
  meta: {
    pagination?: StrapiPagination;
    [key: string]: unknown;
  };
}

/** Error payload returned by Strapi when a request fails. */
export interface StrapiErrorPayload {
  data: null | Record<string, unknown>;
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/** Shape of Strapi's media fields (`formats`, `url`, ...). */
export interface UploadFile {
  id: number;
  documentId?: string;
  url: string;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  size?: number;
  mime?: string;
  formats?: Record<string, { url: string; width: number; height: number }>;
}
