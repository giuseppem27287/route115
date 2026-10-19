/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Strapi instance (default: http://localhost:1337) */
  readonly VITE_STRAPI_URL?: string;
  /** Optional read-only API token sent as `Authorization: Bearer ...` */
  readonly VITE_STRAPI_TOKEN?: string;
  /** Locale used on first visit (default: it) */
  readonly VITE_DEFAULT_LOCALE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
