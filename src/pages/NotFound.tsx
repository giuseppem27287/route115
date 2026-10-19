import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';

/** 404 — shown for any unmatched route. */
export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-[1440px] flex-col items-start justify-center gap-6 px-5 pt-32 pb-24 md:px-10">
      <p className="font-display text-7xl text-ignition-500 md:text-9xl">404</p>
      <h1 className="font-display text-3xl text-chalk-50 md:text-5xl">{t('notFound.title')}</h1>
      <p className="font-condensed text-lg uppercase tracking-wide text-steel-300">
        {t('notFound.subtitle')}
      </p>
      <Link to="/">
        <Button>{t('notFound.cta')}</Button>
      </Link>
    </section>
  );
}
