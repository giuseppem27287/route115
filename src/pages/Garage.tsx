import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { DataState } from '@/components/ui/DataState';
import { Modal } from '@/components/ui/Modal';
import { PageHero } from '@/components/ui/PageHero';
import { Stamp } from '@/components/ui/Stamp';
import { SITE_CONTACT } from '@/config/constants';
import { FALLBACK_GARAGE_SERVICES } from '@/config/fallbacks';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { pick } from '@/i18n';
import { submitLead } from '@/services/leads';
import type { GarageService, StrapiDocument } from '@/types';

interface ServiceVM {
  id: string;
  name: string;
  desc: string;
}

function BeforeAfter() {
  const { t } = useLanguage();
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[16/10] w-full select-none overflow-hidden border border-white/10 bg-coal-700">
      <img
        src={IMG.garage2}
        alt="Before build"
        className="absolute inset-0 size-full object-cover grayscale"
      />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={IMG.bike}
          alt="After custom build"
          className="absolute inset-0 h-full max-w-none object-cover"
          style={{ width: 'min(1440px, 100%)' }}
        />
      </div>

      <span className="absolute left-4 top-4 bg-black/70 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-widest text-chalk-50 backdrop-blur">
        {t('garage.before')}
      </span>
      <span className="absolute right-4 top-4 bg-ignition-500 px-3 py-1 font-condensed text-xs font-bold uppercase tracking-widest text-black">
        {t('garage.after')}
      </span>

      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div
          className="h-full w-0.5 -translate-x-1/2 bg-ignition-500"
          style={{ boxShadow: '0 0 12px rgba(255,85,0,0.9)' }}
        />
        <div className="absolute top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ignition-500 bg-coal-950 font-condensed text-ignition-500">
          ↔
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(event) => setPos(Number(event.target.value))}
        aria-label={t('garage.transformTitle')}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

/**
 * Garage — service grid + before/after slider + appointment form.
 * Services come from the `garage-services` collection; the form submits a
 * `garage-appt` lead (design fallbacks while the CMS is empty).
 */
export default function GaragePage() {
  const { lang, t } = useLanguage();
  const [file, setFile] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  const { data: services, loading, error, refetch } = useStrapi<StrapiDocument<GarageService>[]>(
    '/garage-services',
    { locale: lang, sort: 'name:asc' },
  );

  const rows: ServiceVM[] = useMemo(() => {
    const cms: ServiceVM[] = (services ?? []).map((service) => ({
      id: service.documentId,
      name: service.name,
      desc: service.description || '',
    }));
    if (cms.length > 0) return cms;
    return FALLBACK_GARAGE_SERVICES.map((service, index) => ({
      id: `fallback-${index}`,
      name: service.name,
      desc: pick(lang, service.desc),
    }));
  }, [services, lang]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const form = new FormData(event.currentTarget);
    try {
      await submitLead({
        type: 'garage-appt',
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        service: String(form.get('service') ?? ''),
        message: `${String(form.get('bike') ?? '')} (${String(form.get('year') ?? '')}) — ${String(form.get('details') ?? '')}`,
        attachmentName: file,
      });
      setSent(true);
    } catch {
      setStatus('error');
    }
  };

  const inputCls =
    'w-full border border-white/15 bg-coal-700 px-4 py-3 font-condensed text-base text-chalk-50 placeholder:text-steel-400 focus:border-ignition-500 focus:outline-none';

  return (
    <div>
      <PageHero img={IMG.garage1} kicker={t('garage.kicker')} title={t('sec.garage')} />

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10">
        <DataState
          loading={loading}
          error={error}
          loadingMessage={t('garage.loading')}
          errorMessage={t('garage.error')}
          onRetry={refetch}
        />

        {/* SERVICE GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((service, index) => (
            <div
              key={service.id}
              className="group border border-white/10 bg-coal-800 p-6 transition-colors hover:border-ignition-500/60"
            >
              <div className="mb-4 font-display text-5xl text-white/10 transition-colors group-hover:text-ignition-500/30">
                0{index + 1}
              </div>
              <h3 className="font-display text-2xl leading-none">{service.name}</h3>
              <p className="mt-2 font-condensed text-base text-steel-300">{service.desc}</p>
            </div>
          ))}
        </div>

        {/* BEFORE / AFTER */}
        <div className="mt-20">
          <h2 className="mb-2 font-display text-4xl tracking-wide">{t('garage.transformTitle')}</h2>
          <p className="mb-6 max-w-lg font-condensed text-lg text-steel-300">
            {t('garage.transformIntro')}
          </p>
          <BeforeAfter />
        </div>

        {/* APPOINTMENT FORM */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div className="border border-ignition-500/40 bg-coal-800 p-6 md:p-8">
            <Stamp className="mb-5">Custom Built</Stamp>
            <h2 className="font-display text-3xl leading-none">{t('garage.apptTitle')}</h2>
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
              <input
                required
                name="name"
                placeholder={t('form.name')}
                className={inputCls}
              />
              <input
                required
                name="email"
                type="email"
                placeholder={t('form.email')}
                className={inputCls}
              />
              <input required name="bike" placeholder={t('garage.formBike')} className={inputCls} />
              <input required name="year" placeholder={t('garage.formYear')} className={inputCls} />
              <select name="service" defaultValue="" className={`${inputCls} sm:col-span-2`}>
                <option value="" disabled>
                  {t('garage.formServicePlaceholder')}
                </option>
                {rows.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
              <textarea
                rows={3}
                name="details"
                placeholder={t('garage.formDesc')}
                className={`${inputCls} sm:col-span-2`}
              />

              <label className="flex cursor-pointer items-center justify-between border border-dashed border-white/25 bg-coal-700 px-4 py-3 font-condensed text-base text-steel-300 hover:border-ignition-500 sm:col-span-2">
                <span>{file ?? t('garage.formUpload')}</span>
                <span className="border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-chalk-50">
                  {t('common.browse')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setFile(event.target.files?.[0]?.name ?? null)}
                />
              </label>

              {status === 'error' ? (
                <p className="font-condensed text-sm uppercase tracking-widest text-rust-400 sm:col-span-2">
                  {t('form.error')}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="glow-orange slash-both bg-ignition-500 px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500 disabled:opacity-50 sm:col-span-2"
              >
                {t('garage.formSubmit')}
              </button>
            </form>
          </div>

          {/* quick contact */}
          <div className="flex flex-col justify-between border border-white/10 bg-coal-900 p-6 md:p-8">
            <div>
              <h3 className="font-display text-3xl leading-[0.9]">
                {t('garage.needFastA')}
                <br />
                <span className="text-ignition-500">{t('garage.needFastB')}</span>
              </h3>
              <p className="mt-3 font-condensed text-lg text-steel-300">
                {t('garage.needFastSub')}
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <a
                href={SITE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="glow-orange slash-r flex items-center justify-center gap-2 bg-[#25D366] px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition hover:brightness-110"
              >
                {t('cta.chief')}
              </a>
              <a
                href={`tel:${SITE_CONTACT.phone.replace(/\s/g, '')}`}
                className="slash-l flex items-center justify-center border-2 border-ignition-500 px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-ignition-500 transition-colors hover:bg-ignition-500 hover:text-black"
              >
                {t('garage.callLabel')} {SITE_CONTACT.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Link
            to="/"
            className="font-condensed text-sm uppercase tracking-widest text-steel-300 hover:text-ignition-500"
          >
            {t('back')}
          </Link>
        </div>
      </section>

      {/* CONFIRMATION MODAL */}
      <Modal
        isOpen={sent}
        onClose={() => {
          setSent(false);
          setStatus('idle');
        }}
        className="max-w-md border-ignition-500/40"
      >
        <div className="py-6 text-center">
          <div className="font-display text-4xl leading-[0.95] text-ignition-500">
            {t('garage.sentTitle')}
          </div>
          <p className="mt-3 font-condensed text-lg text-steel-300">{t('garage.sentText')}</p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setStatus('idle');
            }}
            className="slash-both mt-6 border-2 border-ignition-500 px-6 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-ignition-500 transition-colors hover:bg-ignition-500 hover:text-black"
          >
            {t('lead.rideOn')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
