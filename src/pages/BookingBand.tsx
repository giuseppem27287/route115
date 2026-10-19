import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Modal } from '@/components/ui/Modal';
import { PageHero } from '@/components/ui/PageHero';
import { Stamp } from '@/components/ui/Stamp';
import { IMG } from '@/config/images';
import { useLanguage } from '@/hooks/useLanguage';
import { submitLead } from '@/services/leads';

const GENRES = ['Hard Rock', 'Heavy Metal', 'Blues', 'Tribute Band', 'Alternative', 'Punk', 'Other'];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-condensed text-xs uppercase tracking-[0.25em] text-steel-300">
        {label} {required ? <span className="text-rust-500">*</span> : null}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full border border-white/15 bg-coal-700 px-4 py-3 font-condensed text-base tracking-wide text-chalk-50 placeholder:text-steel-400/60 focus:border-ignition-500 focus:outline-none';

/**
 * Booking Band — press-kit application form. Submits a `band-booking` lead to
 * Strapi when `VITE_STRAPI_TOKEN` is configured (simulated otherwise).
 */
export default function BookingBandPage() {
  const { t } = useLanguage();
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [members, setMembers] = useState(4);
  const [file, setFile] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const form = new FormData(event.currentTarget);
    try {
      await submitLead({
        type: 'band-booking',
        name: String(form.get('band') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: String(form.get('phone') ?? ''),
        service: String(form.get('genre') ?? ''),
        attachmentName: file,
        message: [
          `${String(form.get('city') ?? '')} · ${members} members`,
          `video: ${String(form.get('video') ?? '')}`,
          `audio: ${String(form.get('audio') ?? '')}`,
          `social: ${String(form.get('social') ?? '')}`,
          `contact: ${String(form.get('contact') ?? '')}`,
        ].join(' | '),
      });
      setDone(true);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <PageHero img={IMG.crowd1} kicker={t('booking.kicker')} title={t('booking.title')} />

      <section className="mx-auto max-w-[900px] px-5 py-14 md:px-10">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-lg font-condensed text-lg text-steel-300">{t('booking.intro')}</p>
          <Stamp>
            <span className="size-2 animate-pulse rounded-full bg-rust-500" /> {t('booking.stamp')}
          </Stamp>
        </div>

        <form className="border border-ignition-500/40 bg-coal-800 p-6 md:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('booking.bandName')} required>
              <input required name="band" placeholder="e.g. Highway Kings" className={inputCls} />
            </Field>

            <Field label={t('booking.genre')} required>
              <select required name="genre" defaultValue="" className={inputCls}>
                <option value="" disabled>
                  {t('booking.genrePlaceholder')}
                </option>
                {GENRES.map((genre) => (
                  <option key={genre}>{genre}</option>
                ))}
              </select>
            </Field>

            <Field label={t('booking.city')} required>
              <input required name="city" placeholder="Catania, Italy" className={inputCls} />
            </Field>

            <Field label={t('booking.members')}>
              <div className="flex items-stretch border border-white/15 bg-coal-700">
                <button
                  type="button"
                  onClick={() => setMembers((current) => Math.max(1, current - 1))}
                  className="grid w-12 place-items-center border-r border-white/15 font-display text-2xl text-ignition-500 hover:bg-ignition-500 hover:text-black"
                >
                  −
                </button>
                <span className="flex flex-1 items-center justify-center font-display text-2xl text-chalk-50">
                  {members}
                </span>
                <button
                  type="button"
                  onClick={() => setMembers((current) => Math.min(12, current + 1))}
                  className="grid w-12 place-items-center border-l border-white/15 font-display text-2xl text-ignition-500 hover:bg-ignition-500 hover:text-black"
                >
                  +
                </button>
              </div>
            </Field>

            <Field label={t('booking.video')} required>
              <input
                required
                name="video"
                type="url"
                placeholder="https://youtu.be/…"
                className={inputCls}
              />
            </Field>

            <Field label={t('booking.audio')}>
              <input
                name="audio"
                type="url"
                placeholder="https://open.spotify.com/…"
                className={inputCls}
              />
            </Field>

            <Field label={t('booking.social')}>
              <input name="social" placeholder="@yourband" className={inputCls} />
            </Field>

            <Field label={t('booking.rider')}>
              <div className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center justify-between border border-dashed border-white/25 bg-coal-700 px-4 py-3 font-condensed text-base text-steel-300 hover:border-ignition-500">
                  <span className="truncate">{file ?? t('booking.riderUpload')}</span>
                  <span className="ml-3 shrink-0 border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-chalk-50">
                    {t('common.browse')}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(event) => setFile(event.target.files?.[0]?.name ?? null)}
                  />
                </label>
                <input type="url" placeholder={t('booking.riderOr')} className={inputCls} />
              </div>
            </Field>
          </div>

          {/* Direct contact */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="mb-4 font-display text-2xl tracking-wide">
              {t('booking.direct').split(' ')[0]}{' '}
              <span className="text-ignition-500">
                {t('booking.direct').split(' ').slice(1).join(' ')}
              </span>
            </h3>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={t('booking.contactName')} required>
                <input required name="contact" placeholder={t('form.name')} className={inputCls} />
              </Field>
              <Field label={t('booking.email')} required>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="band@email.com"
                  className={inputCls}
                />
              </Field>
              <Field label={t('booking.phone')} required>
                <input required name="phone" type="tel" placeholder="+39 …" className={inputCls} />
              </Field>
            </div>
          </div>

          {status === 'error' ? (
            <p className="mt-4 font-condensed text-sm uppercase tracking-widest text-rust-400">
              {t('form.error')}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="glow-orange slash-both mt-8 w-full bg-ignition-500 px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500 disabled:opacity-50"
          >
            {t('booking.submit')}
          </button>
        </form>

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
        isOpen={done}
        onClose={() => {
          setDone(false);
          setStatus('idle');
        }}
        className="max-w-lg border-ignition-500/40"
      >
        <div className="py-6 text-center">
          <div className="font-display text-5xl leading-[0.95] text-ignition-500">
            {t('booking.receivedTitle')}
          </div>
          <p className="mt-4 font-condensed text-lg text-steel-300">{t('booking.receivedText')}</p>
          <Link
            to="/events"
            onClick={() => {
              setDone(false);
              setStatus('idle');
            }}
            className="glow-orange slash-both mt-6 inline-block bg-ignition-500 px-8 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500"
          >
            {t('booking.seeWho')}
          </Link>
        </div>
      </Modal>
    </div>
  );
}
