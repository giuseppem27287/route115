import { Card, CardTitle } from '@/components/ui/Card';
import { DataState } from '@/components/ui/DataState';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { mediaUrl } from '@/services/api';
import type { StrapiDocument, TattooArtist } from '@/types';

/** Tattoo — `tattoo-artist` collection type with portfolio. */
export default function TattooPage() {
  const { lang, t } = useLanguage();

  const { data: artists, loading, error, refetch } = useStrapi<StrapiDocument<TattooArtist>[]>(
    '/tattoo-artists',
    {
      locale: lang,
      sort: 'name:asc',
      populate: 'portfolio',
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  );

  return (
    <>
      <PageHeader title={t('tattoo.title')} subtitle={t('tattoo.subtitle')} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <DataState
          loading={loading}
          error={error}
          empty={!artists?.length}
          emptyMessage={t('tattoo.empty')}
          loadingMessage={t('tattoo.loading')}
          errorMessage={t('tattoo.error')}
          onRetry={refetch}
        />

        <ul className="grid gap-6 lg:grid-cols-2">
          {artists?.map((artist) => (
            <li key={artist.documentId}>
              <Card interactive className="flex h-full flex-col gap-4">
                <CardTitle>{artist.name}</CardTitle>

                {artist.bio ? (
                  <p className="text-sm leading-relaxed text-chrome-200">{artist.bio}</p>
                ) : null}

                {artist.styles?.length ? (
                  <p className="font-condensed text-sm uppercase tracking-widest text-rust-400">
                    {t('tattoo.stylesLabel')}: {artist.styles.join(' · ')}
                  </p>
                ) : null}

                {artist.portfolio?.length ? (
                  <div>
                    <p className="mb-2 font-condensed text-xs uppercase tracking-widest text-steel-300">
                      {t('tattoo.portfolioLabel')}
                    </p>
                    <ul className="grid grid-cols-4 gap-2">
                      {artist.portfolio.slice(0, 8).map((image) => (
                        <li key={image.id}>
                          <img
                            src={mediaUrl(image.url)}
                            alt={image.alternativeText ?? `${artist.name} portfolio`}
                            className="aspect-square w-full rounded-sm object-cover"
                            loading="lazy"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
