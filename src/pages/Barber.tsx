import { Card, CardTitle } from '@/components/ui/Card';
import { DataState } from '@/components/ui/DataState';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import type { BarberService, StrapiDocument } from '@/types';

const priceFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

/** Barber — `barber-service` collection type. */
export default function BarberPage() {
  const { lang, t } = useLanguage();

  const { data: services, loading, error, refetch } = useStrapi<StrapiDocument<BarberService>[]>(
    '/barber-services',
    {
      locale: lang,
      sort: 'name:asc',
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  );

  return (
    <>
      <PageHeader title={t('barber.title')} subtitle={t('barber.subtitle')} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <DataState
          loading={loading}
          error={error}
          empty={!services?.length}
          emptyMessage={t('barber.empty')}
          loadingMessage={t('barber.loading')}
          errorMessage={t('barber.error')}
          onRetry={refetch}
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services?.map((service) => (
            <li key={service.documentId}>
              <Card interactive className="flex h-full flex-col gap-3">
                <CardTitle>{service.name}</CardTitle>
                {service.description ? (
                  <p className="text-sm leading-relaxed text-chrome-200">{service.description}</p>
                ) : null}
                <div className="mt-auto flex items-baseline justify-between pt-2">
                  {typeof service.price === 'number' ? (
                    <span className="font-display text-xl text-rust-400">
                      {priceFormatter.format(service.price)}
                    </span>
                  ) : (
                    <span />
                  )}
                  {typeof service.durationMinutes === 'number' ? (
                    <span className="font-condensed text-xs uppercase tracking-widest text-steel-300">
                      {service.durationMinutes} {t('barber.minutes')}
                    </span>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
