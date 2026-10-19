import { useState, type FormEvent } from 'react';

import { Stamp } from '@/components/ui/Stamp';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/hooks/useLanguage';
import { submitLead, type LeadSubmitResult } from '@/services/leads';
import type { Lead } from '@/types';

export interface LeadConfig {
  /** `Lead.type` persisted to Strapi. */
  type: Lead['type'];
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  confirmTitle: string;
  confirmText: string;
  /** Optional select of services shown in the form. */
  services?: string[];
  /** Shows the tattoo-reference upload field. */
  upload?: boolean;
}

type Status = 'idle' | 'sending' | 'error';

/**
 * Lead capture modal (waiting lists, priority consultations…).
 * Figma Make design running on our portal-based `Modal`.
 * Submits to the Strapi `lead` collection when `VITE_STRAPI_TOKEN` is set,
 * otherwise simulates the confirmation client-side.
 */
export function LeadModal({ config, onClose }: { config: LeadConfig; onClose: () => void }) {
  const { t } = useLanguage();
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('sending');

    const serviceValue = String(form.get('service') ?? '');
    const lead: Lead = {
      type: config.type,
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? '') || null,
      service: serviceValue || null,
      attachmentName: file,
    };

    try {
      const result: LeadSubmitResult = await submitLead(lead);
      if (result === 'sent') console.info('[leads] persisted to Strapi.');
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
            {config.confirmTitle}
          </div>
          <p className="mt-3 font-condensed text-lg text-steel-300">{config.confirmText}</p>
          <button
            onClick={onClose}
            className="slash-both mt-6 border-2 border-ignition-500 px-6 py-3 font-condensed text-sm font-bold uppercase tracking-widest text-ignition-500 transition-colors hover:bg-ignition-500 hover:text-black"
          >
            {t('lead.rideOn')}
          </button>
        </div>
      ) : (
        <>
          <Stamp className="mb-4">
            <span className="size-2 animate-pulse rounded-full bg-rust-500" /> {config.eyebrow}
          </Stamp>
          <h3 className="font-display text-3xl leading-none">{config.title}</h3>
          <p className="mt-2 font-condensed text-base text-steel-300">{config.subtitle}</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {[
              { name: 'name', ph: t('form.name'), type: 'text' },
              { name: 'email', ph: t('form.email'), type: 'email' },
              { name: 'phone', ph: t('form.phone'), type: 'tel' },
            ].map((f) => (
              <input
                key={f.name}
                name={f.name}
                required
                type={f.type}
                placeholder={f.ph}
                className="w-full border border-steel-700 bg-coal-700 px-4 py-3 font-condensed text-base tracking-wide text-chalk-50 placeholder:text-steel-300 focus:border-ignition-500 focus:outline-none"
              />
            ))}

            {config.services && (
              <select
                name="service"
                required
                defaultValue=""
                className="w-full border border-steel-700 bg-coal-700 px-4 py-3 font-condensed text-base text-steel-300 focus:border-ignition-500 focus:outline-none"
              >
                <option value="" disabled>
                  {t('lead.servicePlaceholder')}
                </option>
                {config.services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {config.upload && (
              <label className="flex cursor-pointer items-center justify-between border border-dashed border-steel-600 bg-coal-700 px-4 py-3 font-condensed text-base text-steel-300 hover:border-rust-500">
                <span>{file ?? t('lead.uploadTattoo')}</span>
                <span className="border border-steel-600 px-3 py-1 text-xs uppercase tracking-widest text-chalk-50">
                  {t('common.browse')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            )}

            {status === 'error' && (
              <p className="font-condensed text-sm uppercase tracking-widest text-rust-400">
                {t('form.error')}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="glow-orange slash-both w-full bg-ignition-500 px-6 py-4 font-condensed text-base font-bold uppercase tracking-widest text-black transition-colors hover:bg-rust-500 disabled:opacity-50"
            >
              {config.cta}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
