# route115

Route 115 — garage, noleggio, barber e tattoo. Frontend **React 18 + TypeScript + Vite** consumendo un backend **Strapi v5** locale, con i18n `it`/`en` e palette *Dark Mode Industrial Biker* (Tailwind CSS v4).

## Quick start

```bash
npm install
cp .env.example .env      # opzionale: punta a un'istanza Strapi diversa
npm run dev               # http://localhost:5173
```

Il backend atteso è Strapi v5 su `http://localhost:1337` (configurabile via `VITE_STRAPI_URL`). Finché Strapi non risponde, le pagine mostrano fallback dai dizionari i18n e lo stato di errore con bottone *Riprova*.

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
├── assets/          # Logo, noise/grain texture, icone statiche
├── components/      # UI riutilizzabile
│   ├── ui/          # Atomici generici: Button, Card, Modal, Gauge, Spinner, PageHeader, DataState
│   └── layout/      # Header, Footer, Layout, Preloader, LanguageSwitcher
├── config/          # env.ts (VITE_* tipizzate) + constants.ts (nav, locales, pagination)
├── context/         # LanguageContext (i18n + persistenza) · ModalContext (modale globale)
├── hooks/           # useLanguage · useModal · useStrapi (GET generica con loading/error/refetch)
├── i18n/            # Dizionari it.json / en.json + translate() con interpolazione {placeholder}
├── pages/           # Home · Events · Rental · Garage · Barber · Tattoo · NotFound
├── services/        # api.ts (fetch client Strapi) · content.ts (fetcher tipizzati per content-type)
└── types/           # strapi.ts (StrapiResponse, StrapiDocument, UploadFile…) · models.ts
```

### Flusso dei dati

```text
page → hooks/useStrapi(path, params) → services/api.strapiFetch → Strapi v5 REST
```

- **`services/api.ts`** — client HTTP generico: base URL da `config/env.ts`, auth Bearer opzionale (`VITE_STRAPI_TOKEN`), costruzione query string in notazione bracket (`filters[slug][$eq]=…`, `pagination[pageSize]=12`), `ApiError` tipizzata, `mediaUrl()` per risolvere gli URL media relativi.
- **`services/content.ts`** — fetcher tipizzati (`getEvents`, `getRentalItems`, `getGarageServices`, `getBarberServices`, `getTattooArtists`, `getHomePage`, `getGlobal`): unico punto in cui tenere in sincronia endpoint e `populate` con lo schema Strapi.
- **`hooks/useStrapi.ts`** — hook generico con `data/loading/error/refetch`, cancellazione via `AbortController` e re-fetch automatico al cambio `lang`/params.

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
- La scelta è persistita in `localStorage` (`route115:lang`) e applicata a `<html lang>`.
- Copy delle pagine dai dizionari `src/i18n/*.json` (chiavi dot-notate, type-safe via `TranslationKey`); i dati CMS arrivano con `?locale=it|en`.
- I content-type i18n in Strapi devono avere `it` come locale predefinito.

### Routing

| Path        | Pagina     |
| ----------- | ---------- |
| `/`         | Home       |
| `/events`   | Events     |
| `/rental`   | Rental     |
| `/garage`   | Garage     |
| `/barber`   | Barber     |
| `/tattoo`   | Tattoo     |
| `*`         | NotFound   |

### Styling

Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` in `src/index.css`) con token del tema industrial biker: **coal** (fondi), **steel** ( bordi/superfici), **chrome** (testo), **rust** (accento primario), **brass** (secondario); font `Archivo Black` (display), `Barlow Condensed` (UI), `Inter` (testo). Utility `.grain` per l'overlay noise.

### Componenti pronti per l'integrazione UI

`Button` (varianti primary/outline/ghost), `Card`/`CardTitle`, `Modal` (portal + `ModalContext`, Escape/backdrop/scroll-lock), `Gauge` (dashboard SVG senza dipendenze), `Spinner`, `PageHeader`, `DataState` (stati loading/error/empty uniformi). I blocchi visivi da Figma/Make si integrano sopra questa base senza toccare API layer, context o i18n.

## Strapi — schema atteso

`src/types/models.ts` riflette i content-type concordati (da allineare con il Content-Type Builder): `event`, `rental-item`, `garage-service`, `barber-service`, `tattoo-artist`, plus i single type `home-page` e `global`. Abilita i permessi **find** per i ruoli public nei *Settings → Users & Permissions Plugin → Roles*.
