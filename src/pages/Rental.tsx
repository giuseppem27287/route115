import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { DataState } from '@/components/ui/DataState';
import { Modal } from '@/components/ui/Modal';
import { PageHero } from '@/components/ui/PageHero';
import { Stamp } from '@/components/ui/Stamp';
import { FALLBACK_ADDONS, FALLBACK_ROUTES, FALLBACK_SPECS } from '@/config/fallbacks';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { pick } from '@/i18n';
import { mediaUrl } from '@/services/api';
import { submitLead } from '@/services/leads';
import type { RentalItem, StrapiDocument } from '@/types';

interface BikeVM {
  id: string;
  name: string;
  pricePerDay: number;
  available: boolean;
  gallery: string[];
  specs: ReadonlyArray<readonly [string, string]>;
  description?: string;
}

const FALLBACK_BIKE: BikeVM = {
  id: 'fallback',
  name: 'HERITAGE CLASSIC',
  pricePerDay: 149,
  available: true,
  gallery: [IMG.bike, IMG.engine, IMG.crew1, IMG.sicily],
  specs: FALLBACK_SPECS,
};

function daysBetween(from: string, to: string): number {
  if (!from || !to) return 1;
  const diff = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000;
  return diff > 0 ? Math.ceil(diff) : 1;
}

/**
 * Rental — Harley showcase driven by the `rental-items` collection: the fleet
 * selector picks the bike, its gallery/specs/base price feed the calculator.
 * Design placeholders render while the CMS is empty.
 */
export default function RentalPage() {
  const { lang, t } = useLanguage();
  const [bikeIndex, setBikeIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [addons, setAddons] = useState<string[]>(['helmet']);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: items, loading, error, refetch } = useStrapi<StrapiDocument<RentalItem>[]>(
    '/rental-items',
    {
      locale: lang,
      sort: 'pricePerDay:asc',
      populate: 'images,specs',
      pagination: { page: 1, pageSize: 12 },
    },
  );

  const bikes: BikeVM[] = useMemo(() => {
    const cms: BikeVM[] = (items ?? []).map((item) => ({
      id: item.documentId,
      name: item.name.toUpperCase(),
      pricePerDay: item.pricePerDay,
      available: item.available,
      gallery:
        item.images?.map((image) => mediaUrl(image.url)).filter((url): url is string => Boolean(url)) ??
        [],
      specs:
        item.specs?.map((spec) => [spec.label, spec.value] as const) ?? FALLBACK_SPECS,
      description: item.description ?? undefined,
    }));
    return cms.length > 0 ? cms : [FALLBACK_BIKE];
  }, [items]);

  const bike = bikes[Math.min(bikeIndex, bikes.length - 1)] ?? FALLBACK_BIKE;

  // Reset the photo carousel whenever the selected bike changes.
  useEffect(() => setPhotoIndex(0), [bike.id]);

  const gallery = bike.gallery.length > 0 ? bike.gallery : FALLBACK_BIKE.gallery;
  const days = daysBetween(pickup, dropoff);
  const addonTotal = useMemo(
    () =>
      FALLBACK_ADDONS.filter((addon) => addons.includes(addon.id)).reduce(
        (sum, addon) => sum + addon.price,
        0,
      ),
    [addons],
  );
  const total = (bike.pricePerDay + addonTotal) * days;

  const toggleAddon = (id: string) =>
    setAddons((previous) =>
      previous.includes(id) ? previous.filter((entry) => entry !== id) : [...previous, id],
    );

  return (
    <div>
      <PageHero img={gallery[0]} kicker={t('rental.kicker')} title={bike.name} />

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10">
        <DataState
          loading={loading}
          error={error}
          loadingMessage={t('rental.loading')}
          errorMessage={t('rental.error')}
          onRetry={refetch}
        />

        {/* FLEET SELECTOR */}
        {bikes.length > 1 ? (
          <div className="mb-8">
            <span className="mb-3 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
              {t('rental.fleet')}
            </span>
            <div className="flex flex-wrap gap-2">
              {bikes.map((entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setBikeIndex(index)}
                  className={`border px-4 py-2 font-condensed text-sm font-semibold uppercase tracking-wider transition-colors ${
                    index === bikeIndex
                      ? 'border-ignition-500 bg-ignition-500 text-black'
                      : 'border-white/15 text-steel-300 hover:border-ignition-500/60 hover:text-chalk-50'
                  }`}
                >
                  {entry.name}
                  <span className="ml-2 font-normal opacity-70">
                    {entry.available ? t('common.available') : t('common.unavailable')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* GALLERY */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-coal-700">
              <img src={gallery[photoIndex]} alt={bike.name} className="size-full object-cover" />
              <span className="absolute left-4 top-4 bg-black/70 px-3 py-1 font-condensed text-xs uppercase tracking-widest text-ignition-500 backdrop-blur">
                {t('rental.multiAngle')} · {photoIndex + 1}/{gallery.length}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((photo, index) => (
                <button
                  key={photo}
                  type="button"
                  onClick={() => setPhotoIndex(index)}
                  aria-label={`${bike.name} — ${index + 1}`}
                  className={`aspect-square overflow-hidden border transition-colors ${
                    photoIndex === index
                      ? 'border-ignition-500'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={photo}
                    alt=""
                    className={`size-full object-cover ${photoIndex === index ? '' : 'opacity-60'}`}
                  />
                </button>
              ))}
            </div>

            {bike.description ? (
              <p className="mt-6 font-condensed text-lg leading-snug text-steel-300">
                {bike.description}
              </p>
            ) : null}

            {/* SPECS */}
            <h2 className="mb-5 mt-12 font-display text-3xl tracking-wide">{t('specs')}</h2>
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
              {bike.specs.map(([label, value]) => (
                <div key={label} className="bg-coal-800 p-5">
                  <div className="font-condensed text-xs uppercase tracking-widest text-steel-300">
                    {label}
                  </div>
                  <div className="mt-1 font-display text-2xl text-chalk-50">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING CALCULATOR */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-ignition-500/40 bg-coal-800 p-6 md:p-8">
              <Stamp className="mb-5">{t('rental.calculator')}</Stamp>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block font-condensed text-xs uppercase tracking-widest text-steel-300">
                    {t('rental.pickup')}
                  </span>
                  <input
                    type="date"
                    value={pickup}
                    onChange={(event) => setPickup(event.target.value)}
                    className="w-full border border-white/15 bg-coal-700 px-3 py-2.5 font-condensed text-chalk-50 focus:border-ignition-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block font-condensed text-xs uppercase tracking-widest text-steel-300">
                    {t('rental.dropoff')}
                  </span>
                  <input
                    type="date"
                    value={dropoff}
                    onChange={(event) => setDropoff(event.target.value)}
                    className="w-full border border-white/15 bg-coal-700 px-3 py-2.5 font-condensed text-chalk-50 focus:border-ignition-500 focus:outline-none"
                  />
                </label>
              </div>

              <span className="mb-3 mt-6 block font-condensed text-xs uppercase tracking-widest text-steel-300">
                {t('addons')}
              </span>
              <div className="space-y-2">
                {FALLBACK_ADDONS.map((addon) => {
                  const on = addons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`flex w-full items-center justify-between border px-4 py-3 text-left transition-colors ${
                        on ? 'border-ignition-500 bg-ignition-500/10' : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid size-5 place-items-center border text-xs ${
                            on
                              ? 'border-ignition-500 bg-ignition-500 text-black'
                              : 'border-white/30 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className="font-condensed font-semibold uppercase tracking-wide text-chalk-50">
                          {pick(lang, addon.label)}
                        </span>
                      </span>
                      <span className="font-condensed text-steel-300">+€{addon.price}/d</span>
                    </button>
                  );
                })}
              </div>

              {/* SUMMARY */}
              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 font-condensed text-sm text-steel-300">
                <div className="flex justify-between">
                  <span>
                    {t('rental.base')} · {days} {days > 1 ? t('rental.days') : t('rental.day')}
                  </span>
                  <span>€{bike.pricePerDay * days}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('addons')}</span>
                  <span>€{addonTotal * days}</span>
                </div>
                <div className="flex items-end justify-between border-t border-white/10 pt-4">
                  <span className="font-condensed text-sm uppercase tracking-widest text-chalk-50">
                    {t('total')}
                  </span>
                  <span className="font-display text-5xl leading-none text-ignition-500">
                    €{total}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="glow-orange slash-both mt-6 w-full bg-rust-500 px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-ignition-500"
              >
                {t('cta.lock')}
              </button>
            </div>
          </div>
        </div>

        {/* SUGGESTED ROUTES */}
        <h2 className="mb-6 mt-20 font-display text-4xl tracking-wide">
          {t('rental.routesTitle').split(' ')[0]}{' '}
          <span className="text-ignition-500">
            {t('rental.routesTitle').split(' ').slice(1).join(' ')}
          </span>
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {FALLBACK_ROUTES.map((route) => (
            <article
              key={route.name}
              className="group relative overflow-hidden border border-white/10 bg-coal-800 transition-colors hover:border-ignition-500/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-coal-700">
                <img
                  src={route.img}
                  alt={route.name}
                  className="size-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal-800 via-transparent" />
                <span className="absolute bottom-3 left-4 bg-ignition-500 px-3 py-1 font-condensed text-sm font-bold text-black">
                  {route.km}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl leading-none">{route.name}</h3>
                <p className="mt-2 font-condensed text-base text-steel-300">
                  {pick(lang, route.note)}
                </p>
              </div>
            </article>
          ))}
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

      {/* RESERVATION MODAL */}
      {bookingOpen ? (
        <RentalBookingModal
          bike={bike}
          days={days}
          total={total}
          addons={FALLBACK_ADDONS.filter((addon) => addons.includes(addon.id)).map((addon) =>
            pick(lang, addon.label),
          )}
          pickup={pickup}
          dropoff={dropoff}
          onClose={() => setBookingOpen(false)}
        />
      ) : null}
    </div>
  );
}

/* --------------------------- Reservation modal ---------------------------- */

interface RentalBookingModalProps {
  bike: BikeVM;
  days: number;
  total: number;
  addons: string[];
  pickup: string;
  dropoff: string;
  onClose: () => void;
}

function RentalBookingModal({
  bike,
  days,
  total,
  addons,
  pickup,
  dropoff,
  onClose,
}: RentalBookingModalProps) {
  const { t } = useLanguage();
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const form = new FormData(event.currentTarget);
    try {
      await submitLead({
        type: 'rental-booking',
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''),
        message: `${bike.name} · ${days} ${t('rental.days')} · ${pickup} → ${dropoff} · €${total}${
          addons.length ? ` · ${addons.join(', ')}` : ''
        }`,
      });
      setDone(true);
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal isOpen onClose={onClose} className="max-w-md border-ignition-500/40">
      {done ? (
        <div className="py-10 text-center">
          <div className="font-display text-4xl leading-[0.95] text-ignition-500">
            {t('events.confirmTitle')}
          </div>
          <p className="mt-3 font-condensed text-lg text-steel-300">
            {bike.name} — €{total}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="slash-both mt-6 border-2 border-ignition-500 px-6 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-ignition-500 transition-colors hover:bg-ignition-500 hover:text-black"
          >
            {t('lead.rideOn')}
          </button>
        </div>
      ) : (
        <>
          <Stamp className="mb-4">{t('rental.calculator')}</Stamp>
          <h3 className="font-display text-3xl leading-none">{bike.name}</h3>
          <p className="mt-2 font-condensed text-base text-steel-300">
            {days} {days > 1 ? t('rental.days') : t('rental.day')} · €{total}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {[
              { name: 'name', ph: t('form.name'), type: 'text' },
              { name: 'email', ph: t('form.email'), type: 'email' },
              { name: 'phone', ph: t('form.phone'), type: 'tel' },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                required
                type={field.type}
                placeholder={field.ph}
                className="w-full border border-white/15 bg-coal-700 px-4 py-3 font-condensed text-base tracking-wide text-chalk-50 placeholder:text-steel-400 focus:border-ignition-500 focus:outline-none"
              />
            ))}

            {status === 'error' ? (
              <p className="font-condensed text-sm uppercase tracking-widest text-rust-400">
                {t('form.error')}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="glow-orange slash-both w-full bg-ignition-500 px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500 disabled:opacity-50"
            >
              {t('cta.lock')}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
