import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataState } from '@/components/ui/DataState';
import { LeadModal, type LeadConfig } from '@/components/ui/LeadModal';
import { Stamp } from '@/components/ui/Stamp';
import {
  FALLBACK_FLASH_IMAGES,
  FALLBACK_TATTOO_GUESTS,
  FALLBACK_TATTOO_STYLES,
} from '@/config/fallbacks';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { pick } from '@/i18n';
import { mediaUrl } from '@/services/api';
import type { StrapiDocument, TattooArtist } from '@/types';

interface GuestVM {
  id: string;
  name: string;
  city: string;
  date: string;
  style: string;
  slot: string;
}

/**
 * Tattoo studio — styles, flash wall and guest artists.
 * Artists/portfolio come from the `tattoo-artists` collection; design
 * placeholders render while the CMS is empty.
 */
export default function TattooPage() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const { data: artists, loading, error, refetch } = useStrapi<StrapiDocument<TattooArtist>[]>(
    '/tattoo-artists',
    { locale: lang, sort: 'name:asc', populate: 'portfolio' },
  );

  const guests: GuestVM[] = useMemo(() => {
    const cms: GuestVM[] = (artists ?? []).map((artist) => ({
      id: artist.documentId,
      name: artist.name,
      city: artist.city || 'Siracusa',
      date: artist.guestDates || t('soon'),
      style: artist.styles?.[0] || 'Custom',
      slot: artist.guestNote || t('lead.eyebrow'),
    }));
    if (cms.length > 0) return cms;
    return FALLBACK_TATTOO_GUESTS.map((guest) => ({
      id: guest.name,
      name: guest.name,
      city: guest.city,
      date: guest.date,
      style: guest.style,
      slot: pick(lang, guest.slot),
    }));
  }, [artists, lang, t]);

  const flash: string[] = useMemo(() => {
    const portfolio =
      artists
        ?.flatMap((artist) => artist.portfolio ?? [])
        .map((image) => mediaUrl(image.url))
        .filter((url): url is string => Boolean(url)) ?? [];
    return portfolio.length > 0 ? portfolio.slice(0, 9) : [...FALLBACK_FLASH_IMAGES];
  }, [artists]);

  const config: LeadConfig = {
    type: 'tattoo-consult',
    eyebrow: t('lead.eyebrow'),
    title: t('lead.tattooName'),
    subtitle: t('lead.tattooSubtitle'),
    cta: t('lead.tattooCta'),
    confirmTitle: t('lead.onListTitle'),
    confirmText: t('lead.tattooConfirmText'),
    upload: true,
  };

  return (
    <div className="bg-coal-950">
      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pt-20">
        <img
          src={IMG.engine}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/85 to-coal-950/55" />
        <div className="pointer-events-none absolute left-[12%] top-[30%] size-72 rounded-full bg-rust-500/25 blur-[110px]" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10">
          <Stamp className="mb-6 border-rust-500/70 text-rust-500">{t('lead.eyebrow')}</Stamp>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.85] tracking-wide sm:text-6xl md:text-8xl">
            {t('tattoo.titleA')}
            <br />
            <span
              className="text-rust-500"
              style={{ textShadow: '0 0 30px rgba(226,84,43,0.5)' }}
            >
              {t('tattoo.titleB')}
            </span>
          </h1>
          <p className="mt-5 max-w-xl font-condensed text-lg text-steel-300">{t('tattoo.sub')}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="slash-r mt-8 bg-rust-500 px-8 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-shadow hover:shadow-[0_0_28px_-2px_rgba(226,84,43,0.8)]"
          >
            {t('tattoo.bookCta')}
          </button>
        </div>
      </section>

      {/* STYLES + FLASH GALLERY */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <h2 className="mb-10 font-display text-4xl tracking-wide md:text-5xl">
          {t('tattoo.stylesTitle')}{' '}
          <span className="text-rust-500">{t('tattoo.stylesAccent')}</span>
        </h2>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {FALLBACK_TATTOO_STYLES.map((style, index) => (
              <div
                key={style.name.en}
                className="group border border-white/10 bg-coal-800 p-6 transition-colors hover:border-rust-500/60"
              >
                <div className="mb-4 font-display text-5xl text-white/10 transition-colors group-hover:text-rust-500/40">
                  0{index + 1}
                </div>
                <h3 className="font-display text-2xl leading-none">{pick(lang, style.name)}</h3>
                <p className="mt-2 font-condensed text-base text-steel-300">
                  {pick(lang, style.desc)}
                </p>
              </div>
            ))}
          </div>

          <div>
            <span className="mb-3 block font-condensed text-xs uppercase tracking-[0.3em] text-rust-500">
              {t('tattoo.flash')}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {flash.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-square overflow-hidden border border-white/10 bg-coal-700"
                >
                  <img
                    src={image}
                    alt="Flash art reference"
                    className="size-full object-cover grayscale contrast-125 transition-all duration-500 hover:scale-105 hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GUEST ARTISTS */}
      <section className="border-y border-white/10 bg-coal-800">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <h2 className="mb-3 font-display text-4xl tracking-wide md:text-5xl">
            {t('tattoo.guestsTitle')}{' '}
            <span className="text-rust-500">{t('tattoo.guestsAccent')}</span>
          </h2>
          <p className="mb-10 max-w-lg font-condensed text-lg text-steel-300">
            {t('tattoo.guestsSub')}
          </p>

          <DataState
            loading={loading}
            error={error}
            loadingMessage={t('tattoo.loading')}
            errorMessage={t('tattoo.error')}
            onRetry={refetch}
          />

          <div className="grid gap-4 md:grid-cols-3">
            {guests.map((guest) => (
              <article
                key={guest.id}
                className="group border border-white/10 bg-coal-950 p-6 transition-colors hover:border-rust-500/60"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-rust-500 px-3 py-1 font-condensed text-sm font-bold tracking-wide text-black">
                    {guest.date}
                  </span>
                  <span className="font-condensed text-xs uppercase tracking-widest text-steel-300">
                    {guest.city}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-3xl leading-none">{guest.name}</h3>
                <p className="mt-2 font-condensed text-base text-rust-500">{guest.style}</p>
                <p className="mt-4 border-t border-white/10 pt-4 font-condensed text-sm text-steel-300">
                  {guest.slot}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 text-center md:px-10">
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-[0.9] tracking-wide md:text-6xl">
            {t('tattoo.ctaA')}
            <br />
            <span className="text-rust-500">{t('tattoo.ctaB')}</span>
          </h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="slash-both mt-8 bg-rust-500 px-10 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-shadow hover:shadow-[0_0_28px_-2px_rgba(226,84,43,0.8)]"
          >
            {t('tattoo.bookCta')}
          </button>
          <div className="mt-14">
            <Link
              to="/"
              className="font-condensed text-sm uppercase tracking-widest text-steel-300 hover:text-ignition-500"
            >
              {t('back')}
            </Link>
          </div>
        </div>
      </section>

      {open ? <LeadModal config={config} onClose={() => setOpen(false)} /> : null}
    </div>
  );
}
