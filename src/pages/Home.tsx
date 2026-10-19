import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { DataState } from '@/components/ui/DataState';
import { Gauge } from '@/components/ui/Gauge';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import type { HomePage, StrapiDocument } from '@/types';

/**
 * Home — hero driven by the `home-page` single type in Strapi.
 * Falls back to the i18n dictionaries while the CMS content is unavailable.
 */
export default function HomePageView() {
  const { lang, t } = useLanguage();

  const { data: page, loading, error, refetch } = useStrapi<StrapiDocument<HomePage>>(
    '/home-page',
    { locale: lang, populate: '*' },
  );

  const title = page?.heroTitle || t('home.title');
  const subtitle = page?.heroSubtitle || t('home.subtitle');
  const intro = page?.intro || t('home.intro');

  return (
    <div className="grain relative">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl tracking-tight text-chrome-100 md:text-7xl">
              {title}
            </h1>
            <p className="mt-4 font-condensed text-xl uppercase tracking-wide text-rust-400">
              {subtitle}
            </p>
            <p className="mt-6 leading-relaxed text-chrome-200">{intro}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/events">
                <Button size="lg">{t('home.ctaEvents')}</Button>
              </Link>
              <Link to="/rental">
                <Button size="lg" variant="outline">
                  {t('home.ctaRental')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative dashboard gauge — placeholder for the Figma/Make UI */}
          <div className="hidden shrink-0 md:block">
            <Gauge value={115} max={115} label={t('home.gaugeLabel')} unit="mi" />
          </div>
        </div>

        <div className="mt-10">
          <DataState
            loading={loading}
            error={error}
            loadingMessage={t('home.loading')}
            errorMessage={t('home.error')}
            onRetry={refetch}
          />
        </div>
      </section>
    </div>
  );
}
