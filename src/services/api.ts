import { config } from '@/config/env';
import type { StrapiErrorPayload } from '@/types';

/**
 * Low-level fetch wrapper for the Strapi v5 REST API.
 * Handles the base URL, auth header, query-string building and errors.
 */

export type QueryPrimitive = string | number | boolean | null | undefined;

/**
 * Strapi query params, e.g.
 * `{ sort: 'date:asc', filters: { title: { $eq: 'x' } }, pagination: { page: 1 } }`
 * → `?sort=date:asc&filters[title][$eq]=x&pagination[page]=1`
 */
export type StrapiParams = Record<string, QueryPrimitive | QueryPrimitive[] | object>;

export interface RequestOptions {
  /** Extra headers merged over the defaults. */
  headers?: Record<string, string>;
  /** Request body — serialized as JSON for non-GET methods. */
  body?: unknown;
  /** Abort signal (forwarded from `useStrapi` / `AbortController`). */
  signal?: AbortSignal;
  /** Overrides `config.strapiToken`. */
  token?: string;
  /** Strapi query params (filters, sort, populate, pagination, locale…). */
  params?: StrapiParams;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

/** Flattens nested param objects into bracket notation on a URLSearchParams. */
function appendParams(search: URLSearchParams, params: Record<string, unknown>, prefix = ''): void {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      search.set(name, value.join(','));
    } else if (typeof value === 'object') {
      appendParams(search, value as Record<string, unknown>, name);
    } else {
      search.set(name, String(value));
    }
  }
}

/** Builds the final request URL: `{strapiUrl}/api{path}?{queryString}`. */
export function buildUrl(path: string, params?: StrapiParams): string {
  const url = new URL(`${config.strapiUrl}/api${path.startsWith('/') ? path : `/${path}`}`);
  if (params) appendParams(url.searchParams, params);
  return url.toString();
}

/**
 * Resolves a Strapi media URL: absolute URLs pass through, relative ones
 * (`/uploads/...`) are prefixed with the Strapi base URL.
 */
export function mediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^(https?:)?\/\//.test(url)) return url;
  return `${config.strapiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * Performs a request against the Strapi REST API and returns the parsed JSON.
 *
 * @example
 * const res = await strapiFetch<StrapiResponse<Event>>('/events', {
 *   params: { locale: 'it', sort: 'date:asc', populate: 'cover' },
 * });
 */
export async function strapiFetch<T>(
  path: string,
  { headers = {}, body, signal, token, params }: RequestOptions = {},
): Promise<T> {
  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  const authToken = token || config.strapiToken;
  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method: body === undefined ? 'GET' : 'POST',
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new ApiError(`Network error while calling ${path}`, 0, cause);
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload as StrapiErrorPayload | null)?.error?.message ??
      `Request to ${path} failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
