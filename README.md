# route115

Route 115 — garage, noleggio, barber e tattoo. Frontend **React 18 + TypeScript + Vite** consumendo un backend **Strapi v5** locale, con i18n `it`/`en` e palette *Dark Mode Industrial Biker* (Tailwind CSS v4, design Figma Make).

## Quick start

```bash
npm install
cp .env.example .env      # opzionale: punta a un'istanza Strapi diversa
npm run dev               # http://localhost:5173
```

Il backend atteso è Strapi v5 su `http://localhost:1337` (configurabile via `VITE_STRAPI_URL`). Finché Strapi non risponde — o le collection sono vuote — le pagine mostrano il **contenuto di design** (placeholder Figma Make) insieme agli stati loading/error con bottone *Riprova*: il design resta sempre visibile durante lo sviluppo.

### Variabili d'ambiente (`.env.example`)

| Variabile | Default | Descrizione |
| ------- | ------- | ----------- |
| `VITE_STRAPI_URL` | `http://localhost:1337` | Base URL Strapi (no slash finale) |
| `VITE_STRAPI_TOKEN` | *(vuoto)* | API token Bearer; se impostato, i form inviano lead reali al CMS (collection `lead`), altrimenti la submit è simulata client-side |
| `VITE_DEFAULT_LOCALE` | `it` | Locale iniziale |

## Scripts

| Comando             | Descrizione                            |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Dev server Vite con HMR                |
| `npm run build`     | Typecheck (`tsc --noEmit`) + build     |
| `npm run preview`   | Anteprima della build di produzione    |
| `npm run typecheck` | Solo typecheck                         |

## Architettura

```text
src/
├── assets/          # Logo Route 115 (crest PNG)
├── components/
│   ├── ui/          # Atomici: Button, Card, Modal, Gauge, Spinner, DataState,
│   │                #   Logo, Stamp, SectionLabel, PageHero, LeadModal
│   └── layout/      # Header (dropdown Moto/Servizi + menu mobile), Footer,
│                    #   Layout, Preloader (tachimetro), LanguageSwitcher (ITA/ENG)
├── config/          # env.ts (VITE_* tipizzate) · constants.ts (nav, contatti, locales)
│                    #   images.ts (placeholder design) · fallbacks.ts (contenuti fallback)
├── context/         # LanguageContext (i18n + persistenza) · ModalContext (modale globale)
├── hooks/           # useLanguage · useModal · useStrapi (GET generica con loading/error/refetch)
├── i18n/            # Dizionari it.json / en.json + translate() con {placeholder}
│                    #   + pick() per contenuti bilingui + format.ts (date locale-aware)
├── pages/           # Home · Events · Rental · Garage · Store · About · Barber ·
│                    #   Tattoo · BookingBand · NotFound
├── services/        # api.ts (fetch client Strapi) · content.ts (fetcher tipizzati)
│                    #   leads.ts (submitLead → collection `lead`)
└── types/           # strapi.ts (StrapiResponse, StrapiDocument, UploadFile…) · models.ts
```

### Flusso dei dati

```text
page → hooks/useStrapi(path, params) → services/api.strapiFetch → Strapi v5 REST
form → services/leads.submitLead      → POST /api/leads (o simulazione client-side)
```

- **`services/api.ts`** — client HTTP generico: base URL da `config/env.ts`, auth Bearer opzionale (`VITE_STRAPI_TOKEN`), costruzione query string in notazione bracket (`filters[slug][$eq]=…`, `pagination[pageSize]=12`), `ApiError` tipizzata, `mediaUrl()` per risolvere gli URL media relativi.
- **`services/content.ts`** — fetcher tipizzati (`getEvents`, `getEventBySlug`, `getRentalItems`, `getGarageServices`, `getBarberServices`, `getTattooArtists`, `getHomePage`, `getProducts`, `getGlobal`): unico punto in cui tenere in sincronia endpoint e `populate` con lo schema Strapi.
- **`services/leads.ts`** — `submitLead(lead)` invia `POST /api/leads` (collection `lead`) quando `VITE_STRAPI_TOKEN` è configurato; senza token simula la submit e logga un avviso. Restituisce `'sent' | 'simulated'`.
- **`hooks/useStrapi.ts`** — hook generico con `data/loading/error/refetch`, cancellazione via `AbortController` e re-fetch automatico al cambio `lang`/params.

### Strategia di fallback (Strapi-first + design fallback)

Ogni sezione dinamica legge **prima** il CMS via `useStrapi`; quando la collection è vuota o irraggiungibile renderizza i placeholder del design:

- immagini → `config/images.ts` (`IMG.*`, placeholder Unsplash);
- liste/conteggiuti → `config/fallbacks.ts` (eventi, specs moto, addon, percorsi, servizi garage/barber, stili tattoo, guest, prodotti, timeline/values/crew About) con coppie `{it, en}` selezionate via `pick(lang, value)`;
- testi UI brevi → dizionari i18n (`t()`).

Man mano che il CMS viene popolato, i fallback spariscono automaticamente dalle pagine.

### Convenzioni Strapi v5

Le risposte sono **appiattite**: i campi stanno subito su `data` (niente `data.attributes`) e l'identificatore stabile è **`documentId`** (stringa). I tipi in `types/strapi.ts` rispecchiano questo formato:

```ts
const { data: events } = useStrapi<StrapiDocument<Event>[]>('/events', {
  locale: lang,
  sort: 'date:asc',
  populate: 'cover',
  pagination: { pageSize: 12 },
});
```

### Internazionalizzazione

- `it` è la lingua di default (fallback su lingua del browser), `en` secondaria.
- La scelta è persistita in `localStorage` (`route115:lang`) e applicata a `<html lang>`; il `Preloader` attende l'hydration prima di mostrare le rotte.
- Copy delle pagine dai dizionari `src/i18n/*.json` (chiavi dot-notate, type-safe via `TranslationKey`); i dati CMS arrivano con `?locale=it|en`.
- Contenuti bilingui lunghi (timeline About, stili tattoo, addon noleggio…) usano `pick(lang, { it, en } | { en, it })` da `src/i18n/index.ts`.
- Date localizzate (badge evento "SAT 14.11", mesi filtro, date conferma) via `src/i18n/format.ts` (`formatEventBadge`, `formatWeekdayLong`, `formatMonthShort`, `formatLongDate`, `monthKey`).
- I content-type i18n in Strapi devono avere `it` come locale predefinito.

### Routing

| Path              | Pagina      | Note |
| ----------------- | ----------- | ---- |
| `/`               | Home        | hero CMS + teaser eventi + crew + "Hub in espansione" (lead barber/tattoo) |
| `/events`         | Events      | filtri genere/mese + modale prenotazione tavolo |
| `/rental`         | Rental      | showcase flotta (`rental-items`) + calcolatore giorni/addon |
| `/garage`         | Garage      | servizi + slider before/after + form appuntamento |
| `/store`          | Store       | prodotto in evidenza (`products`) + carosello correlati |
| `/about`          | About       | storia (timeline), valori, crew, community wall |
| `/barber-shop`    | Barber      | menu servizi + waiting list VIP |
| `/tattoo-studio`  | Tattoo      | stili, flash, guest artists + consulti |
| `/booking-band`   | BookingBand | press kit per band (lead `band-booking`) |
| `/barber`         | → `/barber-shop` | redirect legacy |
| `/tattoo`         | → `/tattoo-studio` | redirect legacy |
| `*`               | NotFound    | 404 |

### Styling

Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` in `src/index.css`) con token del tema industrial biker: **coal** (fondi `coal-950…800`), **steel** (bordi/superfici `steel-700…300`), **chrome** (`steel-300` per testo muted), **rust** (accento primario `rust-500`), **brass** (barber `brass-400/500`), **ignition** (arancione caldo `#ff5500`), **chalk** (`chalk-50` per titoli/testo chiari). Font: **Anton** (display), **Barlow Condensed** (UI/condensed), **Inter** (testo).

Utility in `index.css`: `.grain` (overlay rumore/scanline), `.slash-r/.slash-l/.slash-both` (barra diagonale signature sui bottoni), `.glow-orange` (bagliore ignition), `.text-stroke`, keyframe `flicker`/`logo-flicker`/`preloader`, scrollbar sottile.

### Componenti UI

`Button` (varianti primary/outline/ghost), `Card`/`CardTitle`, `Modal` (portal + `ModalContext`, Escape/backdrop/scroll-lock), `LeadModal` (form lead riusabile: name/email/phone/textarea/select servizi/telefono, upload opzionale, conferma con `lead.rideOn`), `Gauge` (dashboard SVG), `Spinner`, `DataState` (stati loading/error/empty uniformi), `Logo` (crest con variant `flicker`), `Stamp` (badge ruotato), `SectionLabel` (`// 01 — EVENTS`), `PageHero` (hero di pagina con kicker + titolo display).

## Strapi — schema atteso

`src/types/models.ts` riflette i content-type concordati (da allineare con il Content-Type Builder):

- collection: `event` (title, date, genre, startTime, freeEntry, cover, locale), `rental-item` (name, description, pricePerDay, available, images, specs: componenti label/value), `garage-service` (name, description), `barber-service` (name, description, price), `tattoo-artist` (name, city, styles, guestDates, guestNote, portfolio), `product` (name, description, price, compareAtPrice, badge, features, sizes, images, locale);
- single type: `home-page` (heroTitle, heroSubtitle, heroImage, intro), `global` (siteName, contactPhone, contactEmail, address, socialLinks);
- collection `lead` (type, name, email, phone, service, message, attachmentName) — creata per raccogliere i form; abilita **create** al ruolo public con token, oppure lascia simulata senza `VITE_STRAPI_TOKEN`.

Abilita i permessi **find** per i ruoli public nei *Settings → Users & Permissions Plugin → Roles*.
