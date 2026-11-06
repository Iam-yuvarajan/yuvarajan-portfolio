# Still missing

Everything personal lives in `data/content.ts`. A value written as `{{PLACEHOLDER}}` renders on the site as a
yellow, hatched, dashed-border marker so it can't ship unnoticed.

## Placeholders still on the page

None. The five project placeholders (YUVA AI tech + outcome, Sollunga Bot outcome, Discovery Agent
tech + outcome) are filled.

## Missing, so the item is hidden

- **Upstash Redis on Vercel:** not connected yet, so the live notes wall shows "not connected yet". See README → "Adding Upstash on Vercel".

- **LinkedIn URL:** `profile.links.linkedin` is empty. The LinkedIn button, palette action and shell line appear automatically once it's filled.
- **Custom domain:** none yet. The canonical Vercel address is `https://jyuvarajan.vercel.app`; `site.url` and `metadataBase` are already set in `data/content.ts` and `app/layout.tsx`. Update both when a custom domain is ready.
- **Internship / work experience:** none supplied, so no stage is rendered.

## Provisional design defaults (not marked on the page, change freely)

- World palettes (`data/worlds.ts`): first guesses from the reference site, edit freely
- Fonts: Instrument Serif / Inter / JetBrains Mono (`app/layout.tsx`)

## Out of scope by design

- A standalone "Ask / Interview me, async" section between Shell and Notes. A click-only bot now lives inside Notes (`components/AskBot.tsx`), with answers in `askBot` in `data/content.ts`.
