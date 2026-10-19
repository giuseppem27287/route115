/**
 * Typed access to the environment variables (see `.env.example`).
 * All `VITE_*` variables are inlined at build time by Vite.
 */
const env = import.meta.env;

export const config = {
  /** Base URL of the Strapi v5 instance (no trailing slash). */
  strapiUrl: (env.VITE_STRAPI_URL ?? 'http://localhost:1337').replace(/\/+$/, ''),
  /** Optional API token; sent as `Authorization: Bearer <token>` when set. */
  strapiToken: env.VITE_STRAPI_TOKEN ?? '',
  /** Locale used on the first visit, before the user picks one. */
  defaultLocale: env.VITE_DEFAULT_LOCALE ?? 'it',
  isDev: env.DEV,
} as const;
