import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FALLBACK_BARBER_SERVICES, FALLBACK_EVENTS, type EventFallback } from '@/config/fallbacks';
import { IMG } from '@/config/images';
import { LeadModal, type LeadConfig } from '@/components/ui/LeadModal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Stamp } from '@/components/ui/Stamp';
import { DataState } from '@/components/ui/DataState';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { formatEventBadge } from '@/i18n/format';
import { mediaUrl } from '@/services/api';
import type { BarberService, Event, HomePage, StrapiDocument } from '@/types';

/* --------------------------- Coming-soon cards --------------------------- */

interface ExpansionCard {
  name: string;
  headline: string;
  desc: string;
  cta: string;
  to: string;
  config: Omit<LeadConfig, 'services'>;
  services?: string[];
}

/* ------------------------------- Teaser view ------------------------------ */

interface Teaser {
  id: string;
  badge: string;
  band: string;
  genre: string;
  img: string;
}

/**
 * Home — hero from the `home-page` single type, live events teaser from the
 * `events` collection (first 3 shows), crew atmosphere grid and the
 * "Hub is expanding" lead-capture section. Design placeholders fill in while
 * the CMS is empty.
 */
export default function HomePageView() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [active, setActive] = useState<ExpansionCard | null>(null);

  const { data: page } = useStrapi<StrapiDocument<HomePage>>(
    '/home-page',
    { locale: lang, populate: '*' },
  );

  const {
    data: events,
    loading,
    error,
    refetch,
  } = useStrapi<StrapiDocument<Event>[]>('/events', {
    locale: lang,
    sort: 'date:asc',
    populate: 'cover',
    pagination: { page: 1, pageSize: 3 },
  });

  const { data: barberServices } = useStrapi<StrapiDocument<BarberService>[]>(
    '/barber-services',
    { locale: lang, sort: 'name:asc' },
  );

  /* ----------------------------- Hero content ---------------------------- */

  const heroImage = mediaUrl(page?.heroImage?.url) ?? IMG.hero;
  const heroSubtitle = page?.heroSubtitle || t('hero.sub');

  /* ------------------------------ Event teasers -------------------------- */

  const cmsTeasers: Teaser[] = (events ?? []).map((event, index) => ({
    id: event.documentId,
    badge: formatEventBadge(event.date, lang),
    band: event.title,
    genre: event.genre || 'Live Rock',
    img: mediaUrl(event.cover?.url) ?? FALLBACK_EVENTS[index % FALLBACK_EVENTS.length]?.img ?? IMG.crowd1,
  }));

  const fallbackTeasers: Teaser[] = FALLBACK_EVENTS.slice(0, 3).map((event: EventFallback) => ({
    id: event.date,
    badge: formatEventBadge(event.date, lang),
    band: event.band,
    genre: event.genre,
    img: event.img,
  }));

  const teasers = cmsTeasers.length > 0 ? cmsTeasers : fallbackTeasers;

  /* --------------------------- Expansion lead configs -------------------- */

  const expansionCards: ExpansionCard[] = [
    {
      name: t('lead.barberName'),
      headline: t('exp.barberHeadline'),
      desc: t('exp.barberDesc'),
      cta: t('exp.barberCta'),
      to: '/barber-shop',
      services:
        (barberServices ?? []).length > 0
          ? (barberServices ?? []).map((service) => service.name)
          : FALLBACK_BARBER_SERVICES.map((service) => service.name),
      config: {
        type: 'barber-list',
        eyebrow: t('lead.eyebrow'),
        title: t('lead.barberName'),
        subtitle: t('lead.barberSubtitle'),
        cta: t('lead.barberCta'),
        confirmTitle: t('lead.onListTitle'),
        confirmText: t('lead.barberConfirmText'),
      },
    },
    {
      name: t('lead.tattooName'),
      headline: t('exp.tattooHeadline'),
      desc: t('exp.tattooDesc'),
      cta: t('exp.tattooCta'),
      to: '/tattoo-studio',
      config: {
        type: 'tattoo-consult',
        eyebrow: t('lead.eyebrow'),
        title: t('lead.tattooName'),
        subtitle: t('lead.tattooSubtitle'),
        cta: t('lead.tattooCta'),
        confirmTitle: t('lead.onListTitle'),
        confirmText: t('lead.tattooConfirmText'),
        upload: true,
      },
    },
  ];

  const stats: Array<[string, string]> = [
    [t('home.stats1Value'), t('home.stats1Label')],
    [t('home.stats2Value'), t('home.stats2Label')],
    [t('home.stats3Value'), t('home.stats3Label')],
  ];

  return (
    <div>
      {/* HERO */}
      <section id="top" className="relative flex min-h-screen items-end overflow-hidden">
        <div className="absolute inset-0 bg-coal-700">
          <img src={heroImage} alt="" aria-hidden className="size-full object-cover opacity-55" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/70 to-coal-950/30" />
        <div className="grain absolute inset-0" />

        <div className="absolute right-6 top-1/2 hidden origin-right -translate-y-1/2 rotate-90 font-condensed text-xs uppercase tracking-[0.6em] text-steel-300 md:block">
          {t('hero.address')}
        </div>

        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 md:px-10 md:pb-24">
          <Stamp className="mb-6">
            <span className="size-2 animate-pulse rounded-full bg-rust-500" /> {t('hero.tonight')}
          </Stamp>
          <h1 className="max-w-5xl font-display text-6xl leading-[0.85] tracking-wide sm:text-7xl md:text-8xl lg:text-9xl">
            {page?.heroTitle ? (
              page.heroTitle
            ) : (
              <>
                {t('hero.h1a')}
                <br />
                {t('hero.h1b')}
                <br />
                <span className="text-ignition-500">{t('hero.h1c')}</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-xl font-condensed text-lg font-medium leading-snug text-steel-300">
            {heroSubtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/events"
              className="glow-orange slash-r bg-rust-500 px-8 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-ignition-500"
            >
              {t('hero.explore')}
            </Link>
            <Link
              to="/rental"
              className="slash-l border-2 border-ignition-500 px-8 py-4 font-condensed text-base font-bold uppercase tracking-widest text-ignition-500 transition-colors hover:bg-ignition-500 hover:text-black"
            >
              {t('hero.rent')}
            </Link>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
            {stats.map(([value, label]) => (
              <div key={label} className="px-4 first:pl-0">
                <div className="font-display text-4xl text-chalk-50">{value}</div>
                <div className="mt-1 font-condensed text-xs uppercase tracking-widest text-steel-300">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS TEASER */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <SectionLabel index="// 01" title={t('sec.events')} />
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md font-condensed text-lg text-steel-300">{t('home.eventsIntro')}</p>
          <Stamp>{t('home.stampFree')}</Stamp>
        </div>

        <DataState
          loading={loading}
          error={error}
          loadingMessage={t('common.loading')}
          errorMessage={t('common.error')}
          onRetry={refetch}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teasers.map((event, i) => (
            <Link
              to="/events"
              key={event.id}
              className="group relative block overflow-hidden border border-white/10 bg-coal-800 transition-colors hover:border-ignition-500/60"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-coal-700">
                <img
                  src={event.img}
                  alt={`${event.band} live`}
                  className="size-full object-cover opacity-70 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal-800 via-transparent" />
                <div className="absolute left-4 top-4 bg-ignition-500 px-3 py-1 font-condensed text-sm font-bold tracking-wider text-black">
                  {event.badge}
                </div>
                {i === 0 && teasers.length > 1 ? (
                  <div className="absolute right-4 top-4 rotate-6 border-2 border-rust-500 px-2 py-1 font-condensed text-xs font-bold uppercase tracking-widest text-rust-500">
                    {t('events.soldFast')}
                  </div>
                ) : null}
              </div>
              <div className="p-5">
                <span className="font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
                  {event.genre}
                </span>
                <h3 className="mt-1 font-display text-3xl leading-none">{event.band}</h3>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 font-condensed text-sm font-bold uppercase tracking-widest text-chalk-50 transition-colors group-hover:text-ignition-500">
                  {t('cta.tickets')} <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CREW / ATMOSPHERE */}
      <section id="crew" className="border-t border-white/10 bg-coal-900">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <SectionLabel index="// 05" title={t('sec.crew')} />
          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <figure className="relative overflow-hidden border border-white/10 bg-coal-700 md:col-span-2 md:row-span-2">
              <img
                src={IMG.crew1}
                alt="Motorcycles lined up outside the pub"
                className="size-full object-cover opacity-80"
              />
              <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-coal-950 via-transparent p-6 md:p-10">
                <blockquote className="font-display text-4xl leading-[0.9] tracking-wide md:text-6xl">
                  “{t('home.crewQuoteA')}
                  <br />
                  <span className="text-ignition-500">{t('home.crewQuoteB')}</span>”
                </blockquote>
              </figcaption>
            </figure>
            <figure className="relative overflow-hidden border border-white/10 bg-coal-700">
              <img
                src={IMG.crew2}
                alt="The crew at the bar"
                className="aspect-square size-full object-cover opacity-80"
              />
            </figure>
            <figure className="relative overflow-hidden border border-white/10 bg-coal-700">
              <img
                src={IMG.engine}
                alt="Engine detail on the bench"
                className="aspect-square size-full object-cover opacity-80"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* COMING SOON EXPANSIONS */}
      <section id="coming-soon" className="border-t border-white/10 bg-coal-900">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <SectionLabel index="// 06" title={t('exp.title')} />
          <p className="mb-10 -mt-4 font-condensed text-lg uppercase tracking-[0.3em] text-ignition-500">
            {t('exp.comingSoon')}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {expansionCards.map((card) => (
              <article
                key={card.name}
                onClick={() => navigate(card.to)}
                className="group relative cursor-pointer overflow-hidden border border-white/10 bg-gradient-to-br from-coal-700 to-coal-800 p-7 transition-colors hover:border-ignition-500/60 md:p-10"
              >
                <div className="absolute right-5 top-5 rotate-6 border-2 border-dashed border-ignition-500/70 px-3 py-1.5 font-condensed text-xs font-bold uppercase tracking-[0.3em] text-ignition-500">
                  {t('exp.comingSoon')}
                </div>
                <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-rust-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0" />

                <div className="relative">
                  <Stamp className="mb-6">{card.name}</Stamp>
                  <h3 className="max-w-md font-display text-4xl leading-[0.9] tracking-wide md:text-5xl">
                    {card.headline}
                  </h3>
                  <p className="mt-4 max-w-md font-condensed text-lg text-steel-300">{card.desc}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setActive(card);
                      }}
                      className="glow-orange slash-r bg-ignition-500 px-7 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500"
                    >
                      {card.cta}
                    </button>
                    <Link
                      to={card.to}
                      className="font-condensed text-sm font-semibold uppercase tracking-widest text-steel-300 transition-colors group-hover:text-ignition-500"
                    >
                      {t('exp.discover')}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {active ? (
          <LeadModal
            config={{ ...active.config, services: active.services }}
            onClose={() => setActive(null)}
          />
        ) : null}
      </section>
    </div>
  );
}
