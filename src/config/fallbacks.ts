import { IMG } from '@/config/images';
import type { Localized } from '@/i18n';

/**
 * Design-phase fallback content from the Figma Make UI.
 *
 * Every dynamic section renders the Strapi data *first* (`useStrapi`) and only
 * falls back to these placeholders while the CMS is empty or unreachable, so
 * the full design stays visible during development. Remove entries as the CMS
 * gets populated — pages never read them when real data exists.
 */

/* --------------------------------- Events -------------------------------- */

export interface EventFallback {
  /** ISO date. */
  date: string;
  band: string;
  genre: string;
  time: string;
  free: boolean;
  img: string;
}

export const FALLBACK_EVENTS: readonly EventFallback[] = [
  { date: '2026-11-14', band: 'THUNDERSTRUCK', genre: 'AC/DC Tribute', time: '22:00', free: true, img: IMG.crowd1 },
  { date: '2026-11-20', band: 'BLACK OIL BLUES', genre: 'Southern Blues', time: '21:30', free: true, img: IMG.crowd2 },
  { date: '2026-11-28', band: 'IRON MOTHER', genre: 'Heavy Metal', time: '22:30', free: false, img: IMG.crowd3 },
  { date: '2026-12-05', band: 'HIGHWAY KINGS', genre: 'Hard Rock', time: '22:00', free: true, img: IMG.crowd1 },
  { date: '2026-12-12', band: 'DELTA SMOKE', genre: 'Blues', time: '21:00', free: false, img: IMG.crowd2 },
  { date: '2026-12-19', band: 'THE IRON FIST', genre: 'Heavy Metal', time: '22:00', free: false, img: IMG.crowd3 },
];

/* --------------------------------- Rental -------------------------------- */

/** Technical specs are language-neutral (model names / units). */
export const FALLBACK_SPECS: ReadonlyArray<readonly [string, string]> = [
  ['Engine', '1868 cc'],
  ['Torque', '155 Nm'],
  ['Seat Height', '680 mm'],
  ['Luggage', '2× Panniers'],
  ['Fuel Range', '340 km'],
  ['Weight', '330 kg'],
];

export const FALLBACK_ADDONS: ReadonlyArray<{ id: string; label: Localized; price: number }> = [
  { id: 'helmet', label: { it: 'Noleggio Casco', en: 'Helmet Rental' }, price: 12 },
  { id: 'gps', label: { it: 'GPS / Tour Guide', en: 'GPS / Tour Guide' }, price: 25 },
  { id: 'insurance', label: { it: 'Assicurazione integrale', en: 'Full Insurance' }, price: 30 },
  { id: 'panniers', label: { it: 'Valigie laterali', en: 'Side Panniers' }, price: 10 },
];

export const FALLBACK_ROUTES: ReadonlyArray<{ name: string; km: string; note: Localized; img: string }> = [
  {
    name: 'Ionian Coast Loop',
    km: '180 km',
    note: { it: 'Fritto di pesce a Marzamemi', en: 'Seafood stop in Marzamemi' },
    img: IMG.sicily,
  },
  {
    name: 'Etna Ascent',
    km: '220 km',
    note: { it: 'Strade del vulcano e campi di lava', en: 'Volcano roads & lava fields' },
    img: IMG.crew1,
  },
  {
    name: 'Baroque Val di Noto',
    km: '160 km',
    note: { it: 'Città UNESCO e vino', en: 'UNESCO towns & wine' },
    img: IMG.crowd2,
  },
];

/* --------------------------------- Garage -------------------------------- */

export const FALLBACK_GARAGE_SERVICES: ReadonlyArray<{
  name: string;
  desc: Localized;
  price: number;
}> = [
  { name: 'Maintenance', desc: { it: 'Tagliandi programmati e ispezioni complete.', en: 'Scheduled servicing & full inspections.' }, price: 89 },
  { name: 'Custom Painting', desc: { it: 'Airbrush, flake e pinstripe dipinta a mano.', en: 'Airbrush, flake & hand-laid pinstripe.' }, price: 450 },
  { name: 'Performance Exhausts', desc: { it: 'Slip-on, sistemi completi, mappatura dyno.', en: 'Slip-ons, full systems, dyno mapping.' }, price: 320 },
  { name: 'Tire Replacement', desc: { it: 'Gomme premium, bilanciatura in sede.', en: 'Premium rubber, balancing on site.' }, price: 120 },
  { name: 'Official H-D Diagnostics', desc: { it: 'Diagnostica computerizzata certificata.', en: 'Certified computer diagnostics.' }, price: 75 },
  { name: 'Spare Parts', desc: { it: 'OEM e aftermarket, reperiti al volo.', en: 'OEM & aftermarket, sourced fast.' }, price: 0 },
];

/* --------------------------------- Barber -------------------------------- */

export const FALLBACK_BARBER_SERVICES: ReadonlyArray<{
  name: string;
  note: Localized;
  price: number;
}> = [
  { name: 'Full Rockabilly / Fade Cut', note: { it: 'Forbici e tagliacapelli, piegato con pomata.', en: 'Scissor & clipper, styled with pomade.' }, price: 25 },
  { name: 'Traditional Hot Towel Razor Shave', note: { it: 'Rasoio a mano libera, asciugamano caldo, finitura fredda.', en: 'Straight razor, hot towel, cold finish.' }, price: 22 },
  { name: 'Beard Sculpting & Oil Treatment', note: { it: 'Modellata, rasata e condita con oli.', en: 'Shaped, trimmed, conditioned with oils.' }, price: 18 },
  { name: 'Biker Quick Trim & Refresh', note: { it: 'Entrato e uscito — pronto in strada in 20 minuti.', en: 'In and out — road-ready in 20 min.' }, price: 14 },
];

/* --------------------------------- Tattoo -------------------------------- */

export const FALLBACK_TATTOO_STYLES: ReadonlyArray<{ name: Localized; desc: Localized }> = [
  {
    name: { it: 'Traditional Biker', en: 'Traditional Biker' },
    desc: { it: 'Linee decise, aquile, fiamme, colori old-school.', en: 'Bold lines, eagles, flames, old-school color.' },
  },
  {
    name: { it: 'Heavy Blackwork', en: 'Heavy Blackwork' },
    desc: { it: 'Neri pieni, ornamenti e motivi geometrici.', en: 'Solid black fills, ornamental & geometric.' },
  },
  {
    name: { it: 'Custom Lettering', en: 'Custom Lettering' },
    desc: { it: 'Script, gotico e tipografia stencil.', en: 'Script, gothic and stencil typography.' },
  },
  {
    name: { it: 'Japanese & Rock Flash', en: 'Japanese & Rock Flash' },
    desc: { it: 'Motivi irezumi e flash puro da rock.', en: 'Irezumi motifs and pure rock flash art.' },
  },
];

export const FALLBACK_TATTOO_GUESTS: ReadonlyArray<{
  name: string;
  city: string;
  date: string;
  style: string;
  slot: Localized;
}> = [
  {
    name: "KAI 'BLACKOUT'",
    city: 'Berlin',
    date: '18–20 OCT',
    style: 'Blackwork',
    slot: { it: 'Nel weekend di Iron Mother', en: 'During Iron Mother weekend' },
  },
  {
    name: 'MIRA VOLT',
    city: 'London',
    date: '01–03 NOV',
    style: 'Neo-Traditional',
    slot: { it: 'Nella serata di Highway Kings', en: 'During Highway Kings night' },
  },
  {
    name: 'REN TAKEDA',
    city: 'Osaka',
    date: '22–24 NOV',
    style: 'Japanese',
    slot: { it: 'Nella sessione di Delta Smoke', en: 'During Delta Smoke session' },
  },
];

export const FALLBACK_FLASH_IMAGES: readonly string[] = [
  IMG.engine,
  IMG.jacket2,
  IMG.crew2,
  IMG.garage2,
  IMG.bike,
  IMG.crowd3,
];

/* --------------------------------- Store --------------------------------- */

export interface ProductFallback {
  name: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  description: Localized;
  features: string[];
  gallery: string[];
}

export const FALLBACK_PRODUCT: ProductFallback = {
  name: 'Official Route 115 T-Shirt',
  price: 29,
  badge: 'Limited Rock Edition',
  description: {
    it: 'Maglia ufficiale Route 115 in cotone pesante, stampa schermo gigante sul retro e crest sul cuore. Taglio moderno, sopravvive a qualsiasi scorciatoia.',
    en: 'The official Route 115 heavyweight tee with a giant screen-printed back print and crest on the chest. Modern fit, survives any shortcut.',
  },
  features: ['100% Heavy Cotton', 'Pre-shrunk', 'Screen-printed in Siracusa'],
  gallery: [IMG.jacket, IMG.jacket2, IMG.crew2, IMG.engine],
};

export const FALLBACK_RELATED_PRODUCTS: ReadonlyArray<{
  name: string;
  price: string;
  tag: Localized;
  img: string;
}> = [
  { name: 'Rider Leather Jacket', price: '€289', tag: { it: 'Limitata', en: 'Limited' }, img: IMG.jacket2 },
  { name: 'Skull Signet Ring', price: '€79', tag: { it: 'Fatto a mano', en: 'Handmade' }, img: IMG.engine },
  { name: '115 Full-Face Helmet', price: '€199', tag: { it: 'Novità', en: 'New' }, img: IMG.crew1 },
  { name: 'Route Patch Set', price: '€19', tag: { it: 'Bestseller', en: 'Bestseller' }, img: IMG.crew2 },
];

/* --------------------------------- About --------------------------------- */

export const FALLBACK_TIMELINE: ReadonlyArray<{ year: string; title: string; text: Localized }> = [
  {
    year: '2015',
    title: 'THE FIRST SPARK',
    text: {
      it: 'Un bar di retrovia in Via Elorina diventa il punto d’incontro dei rider di Siracusa.',
      en: "A backstreet bar on Via Elorina becomes a meeting point for Siracusa's riders.",
    },
  },
  {
    year: '2017',
    title: 'ROUTE 66 DREAM',
    text: {
      it: 'Due fondatori percorrono la madre strada americana e ne riportano lo spirito in Sicilia.',
      en: 'Two founders ride the American mother road and bring its spirit home to Sicily.',
    },
  },
  {
    year: '2019',
    title: 'AMPS TURNED UP',
    text: {
      it: 'Il pub cresce e ha un palco — le prime tribute night fanno tremare i muri ogni weekend.',
      en: 'The pub grows a stage — the first tribute nights shake the walls every weekend.',
    },
  },
  {
    year: '2021',
    title: 'THE GARAGE OPENS',
    text: {
      it: 'Apre un’officina custom completa: verniciatura, preparazione e Harley da zero.',
      en: 'A full custom workshop is added: paint, tuning and ground-up Harley builds.',
    },
  },
  {
    year: '2024',
    title: 'A BIKER HUB',
    text: {
      it: 'Flotta di noleggio, concept store e tour: Route 115 diventa uno stile di vita, non un posto.',
      en: 'Rental fleet, concept store and tours make Route 115 a way of life, not a place.',
    },
  },
];

export const FALLBACK_VALUES: ReadonlyArray<{ title: Localized; text: Localized }> = [
  {
    title: { it: 'Custom Culture', en: 'Custom Culture' },
    text: { it: 'Ogni build è un pezzo unico.', en: 'Every build is one of one.' },
  },
  {
    title: { it: 'Live Rock', en: 'Live Rock' },
    text: { it: 'Amplificatori alti, birra fredda, nessun coperto.', en: 'Loud amps, cold beer, no cover.' },
  },
  {
    title: { it: 'Authentic Hospitality', en: 'Authentic Hospitality' },
    text: { it: 'Sconosciuti in entrata, famiglia in uscita.', en: 'Strangers in, family out.' },
  },
  {
    title: { it: 'Sicilian Road Freedom', en: 'Sicilian Road Freedom' },
    text: { it: 'L’isola è il nostro playground.', en: 'The island is our playground.' },
  },
];

export const FALLBACK_CREW: ReadonlyArray<{ name: string; role: Localized; img: string }> = [
  { name: "MARCO 'IGNITION'", role: { it: 'Fondatore / Front of House', en: 'Founder / Front of House' }, img: IMG.crew1 },
  { name: "LUCA 'TORQUE'", role: { it: 'Capo Meccanico', en: 'Chief Mechanic' }, img: IMG.garage1 },
  { name: "SARA 'SLAPSHOT'", role: { it: 'Booking / Eventi', en: 'Booking / Events' }, img: IMG.crew2 },
  { name: "TONY 'BLACKLINE'", role: { it: 'Artista Tattoo', en: 'Tattoo Artist' }, img: IMG.engine },
  { name: "NICO 'THE CLIPPER'", role: { it: 'Barber', en: 'Barber' }, img: IMG.jacket2 },
];
