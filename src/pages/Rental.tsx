import { Card, CardTitle } from '@/components/ui/Card';
import { DataState } from '@/components/ui/DataState';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { mediaUrl } from '@/services/api';
import type { RentalItem, StrapiDocument } from '@/types';

const priceFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

/** Rental — `rental-item` collection type (bikes & gear). */
export default function RentalPage() {
  const { lang, t } = useLanguage();

  const { data: items, loading, error, refetch } = useStrapi<StrapiDocument<RentalItem>[]>(
    '/rental-items',
    {
      locale: lang,
      sort: 'name:asc',
      populate: 'images',
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  );

  return (
    <>
      <PageHeader title={t('rental.title')} subtitle={t('rental.subtitle')} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <DataState
          loading={loading}
          error={error}
          empty={!items?.length}
          emptyMessage={t('rental.empty')}
          loadingMessage={t('rental.loading')}
          errorMessage={t('rental.error')}
          onRetry={refetch}
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items?.map((item) => (
            <li key={item.documentId}>
              <Card interactive className="flex h-full flex-col gap-4">
                {item.images?.[0]?.url ? (
                  <img
                    src={mediaUrl(item.images[0].url)}
                    alt={item.images[0].alternativeText ?? item.name}
                    className="-mx-6 -mt-6 aspect-video w-[calc(100%+3rem)] object-cover"
                    loading="lazy"
                  />
                ) : null}

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle>{item.name}</CardTitle>
                    <span
                      className={`font-condensed text-xs uppercase tracking-widest ${
                        item.available ? 'text-brass-400' : 'text-steel-400'
                      }`}
                    >
                      {item.available ? t('rental.available') : t('rental.unavailable')}
                    </span>
                  </div>

                  {item.category ? (
                    <p className="font-condensed text-sm uppercase tracking-widest text-steel-300">
                      {item.category}
                    </p>
                  ) : null}

                  {item.description ? (
                    <p className="text-sm leading-relaxed text-chrome-200">{item.description}</p>
                  ) : null}

                  <p className="mt-auto pt-2 font-display text-xl text-rust-400">
                    {priceFormatter.format(item.pricePerDay)}
                    <span className="ml-2 font-condensed text-xs uppercase tracking-widest text-steel-300">
                      {t('rental.priceLabel')}
                    </span>
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
