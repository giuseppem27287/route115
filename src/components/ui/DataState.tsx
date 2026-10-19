import { useLanguage } from '@/hooks/useLanguage';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export interface DataStateProps {
  loading: boolean;
  error: Error | null;
  /** Message shown when the request succeeded but returned no items. */
  empty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

/**
 * Uniform loading / error / empty handling for every Strapi-backed page.
 * Renders `null` while content is present so callers compose it freely.
 */
export function DataState({
  loading,
  error,
  empty = false,
  emptyMessage,
  loadingMessage,
  errorMessage,
  onRetry,
}: DataStateProps) {
  const { t } = useLanguage();
  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 text-steel-300">
        <Spinner size={24} />
        {loadingMessage ? (
          <span className="font-condensed text-sm uppercase tracking-widest">
            {loadingMessage}
          </span>
        ) : null}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <p className="font-condensed text-sm uppercase tracking-widest text-rust-400">
          {errorMessage ?? error.message}
        </p>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            ↻ {t('common.retry')}
          </Button>
        ) : null}
      </div>
    );
  }

  if (empty && emptyMessage) {
    return (
      <p className="py-12 font-condensed text-sm uppercase tracking-widest text-steel-400">
        {emptyMessage}
      </p>
    );
  }

  return null;
}
