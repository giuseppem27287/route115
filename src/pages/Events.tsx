import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { DataState } from '@/components/ui/DataState';
import { Modal } from '@/components/ui/Modal';
import { PageHero } from '@/components/ui/PageHero';
import { Stamp } from '@/components/ui/Stamp';
import { FALLBACK_EVENTS } from '@/config/fallbacks';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { useStrapi } from '@/hooks/useStrapi';
import { formatEventBadge, formatLongDate, formatMonthShort, formatWeekdayLong, monthKey } from '@/i18n/format';
import { mediaUrl } from '@/services/api';
import { submitLead } from '@/services/leads';
import type { Event, StrapiDocument } from '@/types';

/** Normalised event row — CMS-driven with design fallback. */
interface EventVM {
  id: string;
  iso: string;
  badge: string;
  day: string;
  band: string;
  genre: string;
  time: string;
  free: boolean;
  month: string;
  monthLabel: string;
  img: string;
}

/**
 * Events — filterable show grid + table booking modal.
 * The list always comes from the `events` Strapi collection; the Figma design
 * placeholders render while the CMS is empty.
 */
export default function EventsPage() {
  const { lang, t } = useLanguage();
  const [genre, setGenre] = useState('all');
  const [month, setMonth] = useState('all');
  const [booking, setBooking] = useState<EventVM | null>(null);

  const { data: events, loading, error, refetch } = useStrapi<StrapiDocument<Event>[]>(
    '/events',
    {
      locale: lang,
      sort: 'date:asc',
      populate: 'cover',
      pagination: { page: 1, pageSize: 24 },
    },
  );

  const rows: EventVM[] = useMemo(() => {
    const cms: EventVM[] = (events ?? []).map((event, index) => ({
      id: event.documentId,
      iso: event.date,
      badge: formatEventBadge(event.date, lang),
      day: formatWeekdayLong(event.date, lang),
      band: event.title,
      genre: event.genre || 'Live Rock',
      time: event.startTime || '22:00',
      free: event.freeEntry !== false,
      month: monthKey(event.date),
      monthLabel: formatMonthShort(event.date, lang),
      img: mediaUrl(event.cover?.url) ?? FALLBACK_EVENTS[index % FALLBACK_EVENTS.length]?.img ?? IMG.crowd1,
    }));

    const fallback: EventVM[] = FALLBACK_EVENTS.map((event) => ({
      id: event.date,
      iso: event.date,
      badge: formatEventBadge(event.date, lang),
      day: formatWeekdayLong(event.date, lang),
      band: event.band,
      genre: event.genre,
      time: event.time,
      free: event.free,
      month: monthKey(event.date),
      monthLabel: formatMonthShort(event.date, lang),
      img: event.img,
    }));

    return cms.length > 0 ? cms : fallback;
  }, [events, lang]);

  const genreOptions = useMemo(() => {
    const unique = [...new Set(rows.map((row) => row.genre))];
    return unique.sort();
  }, [rows]);

  const monthOptions = useMemo(() => {
    const seen = new Map<string, string>();
    rows.forEach((row) => seen.set(row.month, row.monthLabel));
    return [...seen.entries()].map(([key, label]) => ({ key, label }));
  }, [rows]);

  const filtered = rows.filter(
    (row) =>
      (genre === 'all' || row.genre === genre) && (month === 'all' || row.month === month),
  );

  const chipBase =
    'border px-4 py-2 font-condensed text-sm font-semibold uppercase tracking-wider transition-colors';
  const chipActive = 'border-ignition-500 bg-ignition-500 text-black';
  const chipIdle = 'border-white/15 text-steel-300 hover:border-ignition-500/60 hover:text-chalk-50';

  return (
    <div>
      <PageHero img={IMG.crowd3} kicker={t('events.kicker')} title={t('sec.events')} />

      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10">
        {/* FILTER BAR */}
        <div className="mb-12 space-y-5 border border-white/10 bg-coal-800 p-5 md:p-6">
          <div>
            <span className="mb-3 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
              {t('filter.genre')}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setGenre('all')}
                className={`${chipBase} ${genre === 'all' ? chipActive : chipIdle}`}
              >
                {t('filter.all')}
              </button>
              {genreOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGenre(option)}
                  className={`${chipBase} ${genre === option ? chipActive : chipIdle}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-3 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
              {t('filter.month')}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMonth('all')}
                className={`${chipBase} ${month === 'all' ? chipActive : chipIdle}`}
              >
                {t('filter.all')}
              </button>
              {monthOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setMonth(option.key)}
                  className={`${chipBase} ${month === option.key ? chipActive : chipIdle}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataState
          loading={loading}
          error={error}
          loadingMessage={t('common.loading')}
          errorMessage={t('common.error')}
          onRetry={refetch}
        />

        {/* EVENT GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <article
              key={event.id}
              className="group flex flex-col overflow-hidden border border-white/10 bg-coal-800 transition-colors hover:border-ignition-500/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-coal-700">
                <img
                  src={event.img}
                  alt={`${event.band} live`}
                  className="size-full object-cover opacity-75 grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal-800 via-transparent" />
                <div className="absolute left-4 top-4 bg-ignition-500 px-3 py-1 font-condensed text-sm font-bold tracking-wide text-black">
                  {event.badge} // {event.day}
                </div>
                <span
                  className={`absolute right-4 top-4 border px-2 py-1 font-condensed text-xs font-bold uppercase tracking-widest ${
                    event.free ? 'border-chalk-50/40 text-chalk-50' : 'border-rust-500 text-rust-500'
                  }`}
                >
                  {event.free ? t('common.freeEntry') : t('common.ticketRequired')}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
                  {event.genre}
                </span>
                <h3 className="mt-1 font-display text-3xl leading-none">{event.band}</h3>
                <span className="mt-2 font-condensed text-sm text-steel-300">
                  {t('events.doors')} {event.time} · {t('events.liveSet')}
                </span>
                <button
                  type="button"
                  onClick={() => setBooking(event)}
                  className="glow-orange slash-r mt-5 bg-ignition-500 px-5 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500"
                >
                  {t('cta.reserve')}
                </button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && !loading && !error ? (
          <p className="py-20 text-center font-condensed text-lg uppercase tracking-widest text-steel-300">
            {t('events.empty')}
          </p>
        ) : null}

        <div className="mt-16">
          <Link
            to="/"
            className="font-condensed text-sm uppercase tracking-widest text-steel-300 hover:text-ignition-500"
          >
            {t('back')}
          </Link>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {booking ? <BookingModal event={booking} onClose={() => setBooking(null)} /> : null}
    </div>
  );
}

/* ------------------------------ Booking modal ----------------------------- */

type BookingStatus = 'idle' | 'sending' | 'error';

function BookingModal({ event, onClose }: { event: EventVM; onClose: () => void }) {
  const { lang, t } = useLanguage();
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<BookingStatus>('idle');

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    setStatus('sending');
    const form = new FormData(formEvent.currentTarget);
    try {
      await submitLead({
        type: 'table-booking',
        name: String(form.get('contact') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('contact') ?? ''),
        message: `${event.band} — ${event.iso} · ${String(form.get('guests') ?? '')} pax · ${String(form.get('timeslot') ?? '')} · ${String(form.get('area') ?? '')}`,
      });
      setDone(true);
    } catch {
      setStatus('error');
    }
  };

  const entry = event.free ? t('common.freeEntry') : t('common.ticketRequired');

  return (
    <Modal isOpen onClose={onClose} className="max-w-lg border-ignition-500/40">
      {done ? (
        <div className="py-10 text-center">
          <div className="font-display text-5xl text-ignition-500">{t('events.confirmTitle')}</div>
          <p className="mt-3 font-condensed text-lg text-steel-300">
            {t('events.confirmText', {
              band: event.band,
              date: formatLongDate(event.iso, lang),
            })}
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
          <Stamp className="mb-4">
            <span className="size-2 animate-pulse rounded-full bg-rust-500" /> {event.badge} ·{' '}
            {event.day}
          </Stamp>
          <h3 className="font-display text-4xl leading-none">{event.band}</h3>
          <p className="mt-1 font-condensed text-base text-steel-300">
            {event.genre} · {t('events.doors')} {event.time} · {entry}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
                {t('guests')}
              </label>
              <div className="flex flex-wrap gap-2">
                {['2', '4', '6', '8+'].map((guests) => (
                  <label key={guests} className="cursor-pointer">
                    <input
                      type="radio"
                      name="guests"
                      defaultChecked={guests === '2'}
                      className="peer sr-only"
                      required
                    />
                    <span className="block border border-white/15 px-5 py-2 font-condensed font-semibold text-steel-300 peer-checked:border-ignition-500 peer-checked:bg-ignition-500 peer-checked:text-black">
                      {guests}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
                {t('timeslot')}
              </label>
              <select
                name="timeslot"
                className="w-full border border-white/15 bg-coal-700 px-4 py-3 font-condensed text-base text-chalk-50 focus:border-ignition-500 focus:outline-none"
              >
                <option>{t('events.slotEarly')}</option>
                <option>{t('events.slotPreshow')}</option>
                <option>{t('events.slotLive')}</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
                {t('area')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[t('events.areaIndoor'), t('events.areaOutdoor')].map((area, index) => (
                  <label key={area} className="cursor-pointer">
                    <input
                      type="radio"
                      name="area"
                      defaultChecked={index === 0}
                      className="peer sr-only"
                    />
                    <span className="block border border-white/15 px-4 py-3 text-center font-condensed font-semibold text-steel-300 peer-checked:border-ignition-500 peer-checked:bg-ignition-500 peer-checked:text-black">
                      {area}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <input
              name="contact"
              required
              type="text"
              placeholder={`${t('form.name')} · ${t('form.phone')}`}
              className="w-full border border-white/15 bg-coal-700 px-4 py-3 font-condensed text-base tracking-wide text-chalk-50 placeholder:text-steel-400 focus:border-ignition-500 focus:outline-none"
            />

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
              {t('cta.reserve')}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
