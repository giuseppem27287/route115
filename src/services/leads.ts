import { config } from '@/config/env';
import type { Lead } from '@/types';

import { strapiFetch } from './api';

/**
 * Lead submissions (table bookings, waiting lists, garage appointments,
 * band press kits) → POST /api/leads on the `lead` Strapi collection.
 *
 * Strapi create endpoints require an API token, so while `VITE_STRAPI_TOKEN`
 * is not configured (design/development phase) the submission is *simulated*
 * client-side and a notice is logged. As soon as the token is set — and the
 * `lead` collection type exists — every form starts persisting to the CMS.
 */

export type LeadSubmitResult = 'sent' | 'simulated';

export const leadsPersistEnabled = Boolean(config.strapiToken);

export async function submitLead(lead: Lead): Promise<LeadSubmitResult> {
  if (!leadsPersistEnabled) {
    console.info(
      '[leads] VITE_STRAPI_TOKEN not configured — lead submission simulated client-side.',
      lead,
    );
    return 'simulated';
  }

  await strapiFetch('/leads', { body: { data: lead } });
  return 'sent';
}
