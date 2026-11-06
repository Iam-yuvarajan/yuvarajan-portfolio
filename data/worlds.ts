/**
 * Single source of truth for the four worlds: which sections belong to each,
 * their palettes, and the boot-loader lines. Used by the loader, header menu,
 * ID card, command palette, scroll-spy and the colour system.
 *
 * To change a palette, edit `palette` below. Every other colour on the site is
 * derived from these three values and checked for WCAG AA (4.5:1) contrast.
 */

export type WorldId = 'client' | 'server' | 'agents' | 'whoami';

interface WorldSeed {
  id: WorldId;
  path: string;
  label: string;
  /** Sections belonging to this world, in order. The first one is the entry point. */
  sections: readonly string[];
  palette: { name: string; bg: string; ink: string; accent: string };
  bootLines: string[];
}

export type WorldDef = WorldSeed;

/**
 * THE config object: order, palettes and section mapping all live here.
 * Palettes expose the same tokens as `tokensFor` below (--bg, --surface, --text,
 * --muted, --accent, --border), so editing bg / ink / accent here is enough.
 */
const seeds: WorldSeed[] = [
  {
    id: 'client',
    path: '~/client',
    label: 'Client',
    // `top` is the hero/name page, so the client world always enters there.
    sections: ['top', 'work'],
    palette: { name: 'paper + marker violet', bg: '#F5F0EB', ink: '#16130F', accent: '#5B34D9' },
    bootLines: ['[client] compiling client.tsx', '[client] palette: paper + marker violet'],
  },
  {
    id: 'server',
    path: '~/server',
    label: 'Server',
    sections: ['experience', 'stack', 'shell'],
    palette: { name: 'terminal + phosphor green', bg: '#0A100C', ink: '#DDEFE2', accent: '#3DF58A' },
    bootLines: ['[server] mounting /api/projects /api/stats /api/experience', '[server] palette: terminal + phosphor green'],
  },
  {
    id: 'agents',
    path: '~/agents',
    label: 'Agents',
    sections: ['ask'],
    palette: { name: 'deep indigo + amber', bg: '#13132E', ink: '#ECEBFA', accent: '#FFB547' },
    bootLines: ['[agents] loading answers + contribution graph', '[agents] palette: deep indigo + amber'],
  },
  {
    id: 'whoami',
    path: '~/whoami',
    label: 'Whoami',
    sections: ['contact'],
    palette: { name: 'cream + coral', bg: '#FFF4E8', ink: '#1E1411', accent: '#F4583F' },
    bootLines: ['[whoami] resolving contact ... ok', '[whoami] palette: cream + coral'],
  },
];

/** Worlds in switching order: client → server → agents → whoami → client. */
export const worlds: WorldDef[] = seeds;

export const WORLD_ORDER: WorldId[] = worlds.map((w) => w.id);

/** The world `step` places away in the fixed order (wraps in both directions). */
export function stepWorld(id: WorldId, step: number): WorldId {
  const i = WORLD_ORDER.indexOf(id);
  return WORLD_ORDER[(i + step + WORLD_ORDER.length) % WORLD_ORDER.length];
}

/** Every section on the page, in order. `top` is the hero and is not in the nav. */
export const allSections = [
  { id: 'top', nav: 'Top', num: '00', world: 'client', path: '~/client' },
  { id: 'work', nav: 'Work', num: '01', world: 'client', path: '~/client/work' },
  { id: 'experience', nav: 'Journey', num: '02', world: 'server', path: '~/server/experience' },
  { id: 'stack', nav: 'Stack', num: '03', world: 'server', path: '~/server/stack' },
  { id: 'shell', nav: 'Shell', num: '04', world: 'server', path: '~/server/shell' },
  { id: 'ask', nav: 'Ask', num: '05', world: 'agents', path: '~/agents/ask' },
  { id: 'contact', nav: 'Contact', num: '06', world: 'whoami', path: '~/whoami/contact' },
] as const satisfies readonly { id: string; nav: string; num: string; world: WorldId; path: string }[];

export type SectionId = (typeof allSections)[number]['id'];

/** The six numbered sections shown in the nav, menu and palette. */
export const sections = allSections.slice(1);

export const worldOf = (sectionId: string): WorldId =>
  (allSections.find((s) => s.id === sectionId)?.world as WorldId) ?? 'client';
export const worldById = (id: WorldId) => worlds.find((w) => w.id === id)!;
export const DEFAULT_WORLD: WorldId = 'client';

/** First section of a world that exists in the section registry (SSR-safe). */
export function entrySection(id: WorldId): string {
  const def = worldById(id);
  return (
    allSections.find((s) => s.world === id && def.sections.includes(s.id))?.id ??
    allSections.find((s) => s.world === id)?.id ??
    def.sections[0]
  );
}

/* ===================================================================== colour */

/** Shared hues mixed into every palette (status colours, placeholder marker). */
const BASE = { white: '#FFFFFF', black: '#000000', ok: '#2F9E5B', err: '#E5484D', warn: '#F5C842' };

type RGB = [number, number, number];
const toRgb = (hex: string): RGB => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
};
const toHex = (c: RGB) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
/** Mix `a` toward `b` by `t` (0 = a, 1 = b). */
const mix = (a: string, b: string, t: number) => {
  const x = toRgb(a);
  const y = toRgb(b);
  return toHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as RGB);
};
const lum = (hex: string) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
};
/** Push `fg` toward `toward` until it reaches `min` contrast against every surface. */
const ensure = (fg: string, surfaces: string[], toward: string, min = 4.6) => {
  for (let t = 0; t <= 1.0001; t += 0.02) {
    const c = mix(fg, toward, t);
    if (surfaces.every((s) => contrast(c, s) >= min)) return c;
  }
  return toward;
};
/** The most muted version of `fg` (mixed toward `bg`) that still passes on every surface. */
const muted = (fg: string, bg: string, surfaces: string[], max = 0.5) => {
  for (let t = max; t >= 0; t -= 0.02) {
    const c = mix(fg, bg, t);
    if (surfaces.every((s) => contrast(c, s) >= 4.6)) return c;
  }
  return fg;
};
const bestOn = (bg: string, options: string[]) => options.reduce((a, b) => (contrast(b, bg) > contrast(a, bg) ? b : a));

export type Tokens = Record<string, string>;

/** Derive the full set of CSS colour tokens for one world from bg / ink / accent. */
export function tokensFor(w: WorldDef): Tokens {
  const { bg, ink, accent } = w.palette;
  const dark = lum(bg) < 0.2;
  const bgElev = mix(bg, ink, dark ? 0.06 : 0.035);
  const bgSunk = mix(bg, ink, dark ? 0.12 : 0.07);
  const card = dark ? mix(bg, ink, 0.08) : mix(bg, BASE.white, 0.55);
  const surfaces = [bg, bgElev, card];

  const panel = dark ? mix(bg, BASE.black, 0.45) : ink;
  const panelInk = dark ? ink : bg;

  const phBg = mix(bg, BASE.warn, dark ? 0.28 : 0.5);

  return {
    bg,
    'bg-elev': bgElev,
    'bg-sunk': bgSunk,
    card,
    ink,
    'ink-muted': muted(ink, bg, [...surfaces, bgSunk]),
    line: mix(bg, ink, dark ? 0.2 : 0.16),
    'line-strong': mix(bg, ink, dark ? 0.38 : 0.34),
    accent,
    'accent-ink': bestOn(accent, [bg, ink]),
    'accent-text': ensure(accent, surfaces, ink),
    'accent-soft': mix(bg, accent, dark ? 0.24 : 0.16),
    ok: ensure(BASE.ok, surfaces, ink),
    err: ensure(BASE.err, surfaces, ink),
    warn: ensure(BASE.warn, surfaces, ink),
    panel,
    'panel-ink': panelInk,
    'panel-muted': muted(panelInk, panel, [panel, mix(panel, panelInk, 0.08)]),
    'panel-line': mix(panel, panelInk, 0.18),
    'panel-elev': mix(panel, panelInk, 0.08),
    'panel-accent': ensure(accent, [panel, mix(panel, panelInk, 0.08)], panelInk),
    'panel-ok': ensure(BASE.ok, [panel], panelInk),
    'panel-err': ensure(BASE.err, [panel], panelInk),
    'panel-warn': ensure(BASE.warn, [panel], panelInk),
    'ph-bg': phBg,
    'ph-ink': bestOn(phBg, [ink, bg]),
    'ph-line': mix(phBg, ink, 0.4),
    selection: accent,
    shadow: dark ? BASE.black : mix(ink, BASE.black, 0.4),
    // Short aliases (same values as above) for new code: --bg --surface --text --muted --accent --border.
    surface: card,
    text: ink,
    muted: muted(ink, bg, [...surfaces, bgSunk]),
    border: mix(bg, ink, dark ? 0.2 : 0.16),
  };
}

/** Text/background pairs that must meet WCAG AA, for the verification script. */
export function contrastPairs(t: Tokens): [string, string, number][] {
  const pairs: [string, string][] = [
    ['ink', 'bg'], ['ink', 'bg-elev'], ['ink', 'card'],
    ['ink-muted', 'bg'], ['ink-muted', 'bg-elev'], ['ink-muted', 'card'], ['ink-muted', 'bg-sunk'],
    ['accent-text', 'bg'], ['accent-text', 'bg-elev'], ['accent-text', 'card'],
    ['accent-ink', 'accent'], ['bg', 'ink'],
    ['ok', 'bg'], ['ok', 'card'], ['err', 'bg'], ['err', 'card'],
    ['panel-ink', 'panel'], ['panel-muted', 'panel'], ['panel-muted', 'panel-elev'], ['panel-accent', 'panel'],
    ['panel-ok', 'panel'], ['panel-err', 'panel'], ['panel-warn', 'panel'],
    ['ph-ink', 'ph-bg'],
  ];
  return pairs.map(([fg, bg]) => [fg, bg, contrast(t[fg], t[bg])]);
}

/** Palette crossfade for plain scrolling (no sweep). */
const TRANSITION_MS = 500;
const LOADER_FADE_MS = 250;

/** CSS for every world: registered properties (so colours can animate) and one rule per world. */
export function worldsCss(): string {
  const all = worlds.map((w) => [w.id, tokensFor(w)] as const);
  const first = all[0][1];
  const names = Object.keys(first);
  const props = names
    .map((n) => `@property --${n}{syntax:'<color>';inherits:true;initial-value:${first[n]}}`)
    .join('');
  const rules = all
    .map(([id, t], i) => {
      const sel = i === 0 ? `:root,[data-world="${id}"]` : `[data-world="${id}"]`;
      const scheme = lum(t.bg) < 0.2 ? 'dark' : 'light';
      return `${sel}{${names.map((n) => `--${n}:${t[n]}`).join(';')};color-scheme:${scheme}}`;
    })
    .join('');
  const fade = (ms: number) => names.map((n) => `--${n} ${ms}ms ease`).join(',');
  return (
    props +
    rules +
    `html{transition:${fade(TRANSITION_MS)}}` +
    // Each loader phase lasts ~650ms, so its crossfade must be short enough to settle.
    `.loader{transition:${fade(LOADER_FADE_MS)},opacity .45s,transform .45s}` +
    `@media (prefers-reduced-motion:reduce){html,.loader{transition:none}}`
  );
}

/** Theme-color meta value per world. */
export const themeColors = Object.fromEntries(worlds.map((w) => [w.id, w.palette.bg])) as Record<WorldId, string>;

/**
 * Inline, pre-paint: every fresh visit starts on the hero in the default world.
 * In-page navigation still writes section hashes, but opening or reloading a URL
 * with a hash should not bypass the name page. Disabling scroll restoration here
 * also stops the browser from reopening the previous scroll position.
 */
export const initialWorldScript = `try{var w='${DEFAULT_WORLD}';document.documentElement.dataset.world=w;if('scrollRestoration'in history)history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search);var mt=document.querySelector('meta[name="theme-color"]');if(mt)mt.setAttribute('content',${JSON.stringify(
  themeColors,
)}[w])}catch(e){}`;
