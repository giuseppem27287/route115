import { useCallback, useEffect, useState } from 'react';

import { strapiFetch, type StrapiParams } from '@/services/api';

interface UseStrapiOptions {
  /** Set to `false` to skip the request (e.g. while another dependency is missing). */
  enabled?: boolean;
}

export interface UseStrapiResult<T> {
  /** The `data` member of the Strapi response (single document, array, or null). */
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Re-runs the request (resets `loading`). */
  refetch: () => void;
}

/**
 * Generic Strapi GET hook with loading/error state, request cancellation and
 * re-fetch support.
 *
 * The generic `T` is the expected shape of the response `data` member:
 *
 * @example
 * const { data, loading, error, refetch } = useStrapi<StrapiDocument<Event>[]>(
 *   '/events',
 *   { locale: lang, sort: 'date:asc', populate: 'cover' },
 * );
 *
 * @param path   REST path relative to `/api` (e.g. `/events`). Pass `null` to disable.
 * @param params Strapi query params (filters, sort, populate, pagination, locale…)
 */
export function useStrapi<T>(
  path: string | null,
  params?: StrapiParams,
  { enabled = true }: UseStrapiOptions = {},
): UseStrapiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(path) && enabled);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Params are plain objects: serialise them to get a stable dependency.
  const requestKey = JSON.stringify({ path, params, enabled, reloadKey });

  useEffect(() => {
    if (!path || !enabled) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    strapiFetch<{ data: T }>(path, { params, signal: controller.signal })
      .then((res) => setData(res.data ?? null))
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause : new Error(String(cause)));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { data, loading, error, refetch };
}
