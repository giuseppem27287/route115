import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { DataState } from '@/components/ui/DataState';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { useLanguage } from '@/hooks/useLanguage';
import { useModal } from '@/hooks/useModal';
import { useStrapi } from '@/hooks/useStrapi';
import { mediaUrl } from '@/services/api';
import type { Event, StrapiDocument } from '@/types';

function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-GB', { dateStyle: 'long' }).format(
    new Date(iso),
  );
}

/** Events — `event` collection type, ordered by date, with a details modal. */
export default function EventsPage() {
  const { lang, t } = useLanguage();
  const { openModal } = useModal();

  const { data: events, loading, error, refetch } = useStrapi<StrapiDocument<Event>[]>(
    '/events',
    {
      locale: lang,
      sort: 'date:asc',
      populate: 'cover',
      pagination: { pageSize: DEFAULT_PAGE_SIZE },
    },
  );

  return (
    <>
      <PageHeader title={t('events.title')} subtitle={t('events.subtitle')} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <DataState
          loading={loading}
          error={error}
          empty={!events?.length}
          emptyMessage={t('events.empty')}
          loadingMessage={t('events.loading')}
          errorMessage={t('events.error')}
          onRetry={refetch}
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => (
            <li key={event.documentId}>
              <Card interactive className="flex h-full flex-col gap-4">
                {event.cover?.url ? (
                  <img
                    src={mediaUrl(event.cover.url)}
                    alt={event.cover.alternativeText ?? event.title}
                    className="-mx-6 -mt-6 aspect-video w-[calc(100%+3rem)] object-cover"
                    loading="lazy"
                  />
                ) : null}

                <div className="flex flex-1 flex-col gap-2">
                  <CardTitle>{event.title}</CardTitle>
                  <p className="font-condensed text-sm uppercase tracking-widest text-rust-400">
                    {formatDate(event.date, lang)}
                  </p>
                  <p className="font-condensed text-sm uppercase tracking-widest text-steel-300">
                    {event.location}
                  </p>
                  {event.excerpt ? (
                    <p className="text-sm leading-relaxed text-chrome-200">{event.excerpt}</p>
                  ) : null}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => openModal(event.documentId)}
                >
                  {t('common.learnMore')}
                </Button>
              </Card>

              <Modal id={event.documentId} title={t('events.detailsTitle')}>
                <div className="flex flex-col gap-3">
                  <p className="font-condensed text-sm uppercase tracking-widest text-rust-400">
                    {formatDate(event.date, lang)} — {event.location}
                  </p>
                  <p className="whitespace-pre-line leading-relaxed">
                    {event.description ?? event.excerpt ?? t('common.empty')}
                  </p>
                </div>
              </Modal>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
