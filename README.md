# Yuvarajan J · Four Worlds portfolio

Next.js (App Router) + TypeScript + GSAP + plain CSS.

```bash
./run.sh            # dev server with hot reload → http://localhost:3000
./run.sh prod       # production build + start
./run.sh check      # lint + typecheck + build
./run.sh deploy     # lint + typecheck, then deploy to Vercel production
PORT=4000 ./run.sh  # any mode on another port
```

The script installs dependencies on first run.

**Live:** https://jyuvarajan.vercel.app (Vercel project `jyuvarajan`). The canonical address is `site.url` in `data/content.ts`.
`.vercelignore` uploads only the site's source; personal files in the repo root (photos, other PDFs) stay local.

- **Content:** every bit of personal text is in `data/content.ts`. Values that are still missing are listed in `MISSING.md`.
- **Landing:** every fresh visit opens at the hero, even if the URL contains a section hash. In-page navigation still updates hashes normally.
- **API:** `GET /api/projects`, `/api/stats`, `/api/experience`, `/api/skills`, `GET|POST /api/notes`, `GET /api/github-contributions`.
- **Notes bot:** the click-only Q&A panel in Notes. Questions and pre-written answers are in `askBot` in `data/content.ts`; there is no text input and no live model call.
- **Boot loader:** the large animated loader runs once per tab session, decodes the four world names with changing symbols, and can be skipped with any key or tap.
- **GitHub graph:** the heatmap in Notes is rendered by `components/GitHubContributions.tsx`. `/api/github-contributions` proxies and caches the public contribution data for six hours, so no GitHub token or extra package is needed. The account is set by `GITHUB_USERNAME` in `data/content.ts`.
- **Resume:** served from `public/Yuvarajan-J-Resume.pdf`.
- **Project links:** only the links listed in `projects[].links` in `data/content.ts` are published (YUVA AI live demo, Trust-CV and Sollunga Bot source). Discovery Agent has none and shows as private. Set `profile.showGithub = false` to hide the GitHub profile everywhere. Social buttons appear only for links that are non-empty in `profile.links` (LinkedIn is empty for now).

## Worlds and colours

`data/worlds.ts` is the single source of truth for the four worlds: their sections, entry points, boot-loader lines and palettes.
Every colour on the site is derived from each world's three values (`bg`, `ink`, `accent`), checked for WCAG AA (4.5:1),
and emitted as CSS custom properties on `[data-world="…"]`. No other file hard-codes a colour
(the only exception is the paper-grain noise texture in `app/globals.css`).

| World | Sections | Palette | `--bg` | `--ink` | `--accent` |
|---|---|---|---|---|---|
| `client` | `#top`, `#work` | paper + marker violet | `#F5F0EB` | `#16130F` | `#5B34D9` |
| `server` | `#experience`, `#stack`, `#shell` | ink + lilac | `#0E0E10` | `#F2F2F0` | `#B79CFF` |
| `agents` | `#notes` | paper + pink | `#FBF7F9` | `#1A1217` | `#E6458F` |
| `whoami` | `#contact` | night + orchid | `#141017` | `#F5F0F5` | `#E08BD0` |

When an accent is too light to read as text on its background (agents' pink), a darker `--accent-text` is derived automatically.

## Notes wall storage

`lib/notes.ts` uses **Upstash Redis** when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set,
and falls back to `.data/notes.json` otherwise (so `npm run dev` works with no setup).
Notes are capped at 280 characters, filtered for links, spam and profanity, and rate-limited to 3 per IP per 10 minutes
(a Redis counter with a 10-minute expiry; in memory with the file fallback).

### Adding Upstash on Vercel

1. Open the project on Vercel → **Storage** (or **Integrations → Marketplace**) → **Upstash** → **Redis** → create a database (the free plan is enough).
2. **Connect** it to this project for Production, Preview and Development. Vercel then adds `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as environment variables.
   If your integration names them differently (for example `KV_REST_API_URL`), add the two names above in **Settings → Environment Variables** with the same values.
3. Redeploy (`./run.sh deploy`). Until Redis is connected, the live wall shows "not connected yet" and posting returns 503: Vercel's filesystem is read-only, so the file fallback is disabled there. To use the same database locally, run `vercel env pull .env.local`; otherwise, leave them unset to keep the file fallback.

See `.env.example` for the variable names.
