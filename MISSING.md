# Still missing

Everything personal lives in `data/content.ts`. A value written as `{{PLACEHOLDER}}` renders on the site as a
yellow, hatched, dashed-border marker so it can't ship unnoticed.

## Placeholders still on the page

None. The five project placeholders (YUVA AI tech + outcome, Sollunga Bot outcome, Discovery Agent
tech + outcome) are filled.

## Missing, so the item is hidden

- **LinkedIn URL:** `profile.links.linkedin` is empty. The LinkedIn button, palette action and shell line appear automatically once it's filled.
- **Custom domain:** none yet. The canonical Vercel address is `https://jyuvarajan.vercel.app`; `site.url` and `metadataBase` are already set in `data/content.ts` and `app/layout.tsx`. Update both when a custom domain is ready.
- **Internship / work experience:** none supplied, so no stage is rendered.

## Provisional design defaults (not marked on the page, change freely)

- World palettes (`data/worlds.ts`): first guesses from the reference site, edit freely
- Fonts: Instrument Serif / Inter / JetBrains Mono (`app/layout.tsx`)

## Out of scope by design

- A notes wall. Removed in November 2026: the sticky-note wall, `/api/notes`, `lib/notes.ts` and the Upstash/file storage are gone. Section 05 is now **Ask** (`components/Ask.tsx`): the click-only bot (`components/AskBot.tsx`, answers in `askBot` in `data/content.ts`) plus the GitHub contribution graph.
