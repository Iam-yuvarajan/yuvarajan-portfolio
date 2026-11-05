# Still missing

Everything personal lives in `data/content.ts`. A value written as `{{PLACEHOLDER}}` renders on the site as a
yellow, hatched, dashed-border marker so it can't ship unnoticed.

## Placeholders still on the page

| Placeholder | Where |
|---|---|
| `{{YUVA_AI_TECH}}` | YUVA AI card, tech chips |
| `{{YUVA_AI_OUTCOME}}` | YUVA AI card, outcome line |
| `{{SOLLUNGA_OUTCOME}}` | Sollunga Bot card, outcome line |
| `{{DISCOVERY_TECH}}` | Discovery Agent card, tech chips |
| `{{DISCOVERY_OUTCOME}}` | Discovery Agent card, outcome line |

## Missing, so the item is hidden

- **Upstash Redis on Vercel:** not connected yet, so the live notes wall shows "not connected yet". See README → "Adding Upstash on Vercel".

- **LinkedIn URL:** `profile.links.linkedin` is empty. The LinkedIn button, palette action and shell line appear automatically once it's filled.
- **Domain:** none yet. The loader and shell use the display hostname `yuvarajan`, and metadata uses no absolute URLs. When there is a domain, add `metadataBase` in `app/layout.tsx` if you want absolute OG/canonical URLs.
- **Internship / work experience:** none supplied, so no stage is rendered.
- **Spoken languages:** `languages` is empty, so the block is hidden.

## Provisional design defaults (not marked on the page, change freely)

- World palettes (`data/worlds.ts`): first guesses from the reference site, edit freely
- Fonts: Instrument Serif / Inter / JetBrains Mono (`app/layout.tsx`)

## Out of scope by design

- The "Ask / Interview me, async" AI section. See `// TODO: re-add Ask section between Shell and Notes`.
