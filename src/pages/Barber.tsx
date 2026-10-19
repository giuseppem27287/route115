import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { DataState } from '@/components/ui/DataState';
import { LeadModal, type LeadConfig } from '@/components/ui/LeadModal';
import { Stamp } from '@/components/ui/Stamp';
import { FALLBACK_BARBER_SERVICES } from '@/config/fallbacks';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { pick } from '@/i18n';
import type { BarberService, StrapiDocument } from '@/types';

interface ServiceVM {
  id: string;
  name: string;
  note: string;
  price: number;
}

/**
 * Barber Shop — grooming menu from the `barber-services` collection plus the
 * VIP waiting-list lead capture (brass/vintage accent of the palette).
 */
export default function BarberPage() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const { data: services, loading, error, refetch } = useStrapi<StrapiDocument<BarberService>[]>(
    '/barber-services',
    { locale: lang, sort: 'name:asc' },
  );

  const rows: ServiceVM[] = useMemo(() => {
    const cms: ServiceVM[] = (services ?? []).map((service) => ({
      id: service.documentId,
      name: service.name,
      note: service.description || '',
      price: service.price ?? 0,
    }));
    if (cms.length > 0) return cms;
    return FALLBACK_BARBER_SERVICES.map((service, index) => ({
      id: `fallback-${index}`,
      name: service.name,
      note: pick(lang, service.note),
      price: service.price,
    }));
  }, [services, lang]);

  const config: LeadConfig = {
    type: 'barber-list',
    eyebrow: t('lead.eyebrow'),
    title: t('lead.barberName'),
    subtitle: t('lead.barberSubtitle'),
    cta: t('lead.barberCta'),
    confirmTitle: t('lead.onListTitle'),
    confirmText: t('lead.barberConfirmText'),
    services: rows.map((service) => service.name),
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pt-20">
        <img
          src={IMG.jacket}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-900/85 to-coal-950/50" />
        {/* warm edison glow */}
        <div className="pointer-events-none absolute right-[15%] top-[25%] size-72 rounded-full bg-brass-400/20 blur-[100px]" />
        <div className="grain absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10">
          <Stamp className="mb-6 border-dashed">{t('lead.eyebrow')}</Stamp>
          <h1 className="max-w-4xl font-display text-5xl leading-[0.85] tracking-wide sm:text-6xl md:text-8xl">
            {t('barber.titleA')}
            <br />
            <span className="text-brass-400">{t('barber.titleB')}</span>
          </h1>
          <p className="mt-5 max-w-xl font-condensed text-lg text-steel-300">{t('barber.sub')}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="glow-orange slash-r mt-8 bg-brass-400 px-8 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-ignition-500"
          >
            {t('barber.vipCta')}
          </button>
        </div>
      </section>

      {/* SERVICE MENU */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="font-display text-4xl tracking-wide md:text-5xl">
            {t('barber.menuTitle')} <span className="text-brass-400">{t('barber.menuAccent')}</span>
          </h2>
          <span className="hidden font-condensed text-sm uppercase tracking-[0.3em] text-steel-300 sm:block">
            {t('barber.est')}
          </span>
        </div>

        <DataState
          loading={loading}
          error={error}
          loadingMessage={t('barber.loading')}
          errorMessage={t('barber.error')}
          onRetry={refetch}
        />

        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          {rows.map((service, index) => (
            <div
              key={service.id}
              className="group bg-coal-800 p-7 transition-colors hover:bg-coal-700"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl text-white/15 transition-colors group-hover:text-brass-400/50">
                    0{index + 1}
                  </span>
                  <h3 className="font-display text-2xl leading-none">{service.name}</h3>
                </div>
                <span className="font-display text-2xl text-brass-400">€{service.price}</span>
              </div>
              <p className="mt-3 pl-12 font-condensed text-base text-steel-300">{service.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-coal-900">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-400/10 blur-[120px]" />
        <div className="relative mx-auto max-w-[1440px] px-5 py-24 text-center md:px-10">
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-[0.9] tracking-wide md:text-6xl">
            {t('barber.beFirstA')}
            <br />
            <span className="text-brass-400">{t('barber.beFirstB')}</span>
          </h2>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="glow-orange slash-both mt-8 bg-brass-400 px-10 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-ignition-500"
          >
            {t('barber.vipCta')}
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
