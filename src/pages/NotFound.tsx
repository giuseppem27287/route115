import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';

/** 404 — shown for any unmatched route. */
export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6">
      <p className="font-display text-7xl text-rust-500">404</p>
      <h1 className="font-display text-3xl text-chrome-100">{t('notFound.title')}</h1>
      <p className="font-condensed text-lg uppercase tracking-wide text-steel-300">
        {t('notFound.subtitle')}
      </p>
      <Link to="/">
        <Button>{t('notFound.cta')}</Button>
      </Link>
    </section>
  );
}
