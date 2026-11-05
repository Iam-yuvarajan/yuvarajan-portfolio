'use client';

import { useSyncExternalStore } from 'react';
import { DEFAULT_WORLD, allSections, stepWorld, themeColors, worldById, worldOf, type WorldId } from '@/data/worlds';

/**
 * The one place that changes the active world and section.
 * Scroll-spy, the header menu, the ID card, the command palette and the shell all go through here.
 */

interface Active {
  section: string;
  world: WorldId;
}

let active: Active = { section: 'top', world: DEFAULT_WORLD };
const listeners = new Set<() => void>();
const SERVER: Active = { section: 'top', world: DEFAULT_WORLD };

/** While a programmatic jump is scrolling, scroll-spy must not flip worlds on the way. */
let lockUntil = 0;
let lockTarget: string | null = null;

function apply(next: Active) {
  if (next.section === active.section && next.world === active.world) return;
  const worldChanged = next.world !== active.world;
  active = next;
  if (worldChanged) {
    document.documentElement.dataset.world = next.world;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[next.world]);
  }
  listeners.forEach((l) => l());
}

export function getActive() {
  return active;
}

/** Called by scroll-spy. Ignored while a jump is in flight, unless it reached its target. */
export function spySection(section: string) {
  if (Date.now() < lockUntil && section !== lockTarget) return;
  if (section === lockTarget) lockUntil = 0;
  apply({ section, world: worldOf(section) });
}

/** Sync with the DOM on mount (the inline head script may already have set a world from the hash). */
export function hydrateActive() {
  const w = document.documentElement.dataset.world as WorldId | undefined;
  if (w && w !== active.world) active = { ...active, world: w };
  listeners.forEach((l) => l());
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------ curtain hookup */

/** Screen point the curtain grows from (viewport px). */
export interface Origin {
  x: number;
  y: number;
}

/** Implemented by <WorldCurtain/>: cover the screen in `world`'s colour, call `onCovered`, then reveal. */
export type Curtain = (opts: { world: WorldId; origin: Origin; onCovered: () => void; onDone: () => void }) => void;

let curtain: Curtain | null = null;
/** True while a curtain transition runs. Extra clicks are ignored until it finishes. */
let busy = false;

export function registerCurtain(c: Curtain | null) {
  curtain = c;
}
export const isTransitioning = () => busy;

/**
 * Where a click came from. Mouse and touch use the pointer; keyboard "clicks" (detail 0,
 * coordinates 0,0) use the centre of the element that was activated.
 */
export function originFrom(e: { clientX: number; clientY: number; detail: number; currentTarget?: EventTarget | null }, el?: Element | null): Origin {
  if (e.detail > 0 && (e.clientX || e.clientY)) return { x: e.clientX, y: e.clientY };
  const target = el ?? (e.currentTarget instanceof Element ? e.currentTarget : null);
  const r = target?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : centre();
}
const centre = (): Origin => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

/**
 * First section of a world that actually exists in the document. Config order wins
 * (`agents` → ask → notes), so a not-yet-built section is skipped, never crashed on.
 */
export function entryFor(world: WorldId): string | null {
  const def = worldById(world);
  return (
    def.sections.find((id) => document.getElementById(id)) ??
    allSections.find((s) => s.world === world)?.id ??
    def.entry ??
    null
  );
}

/**
 * The world switcher: one step through the fixed order, with the curtain growing
 * from `origin`. Returns false when a transition is already running (click ignored).
 */
export function cycleWorld(step: number, origin?: Origin): boolean {
  if (busy) return false;
  const world = stepWorld(active.world, step);
  const section = entryFor(world);
  if (!section) return false;
  goTo(section, { origin });
  return true;
}

/**
 * Go to a section. If it lives in another world (and motion is allowed), the curtain covers the
 * screen first, the palette and scroll position change underneath, then it reveals the new world.
 * Same world, or reduced motion: swap + scroll straight away.
 */
export function goTo(section: string, opts: { push?: boolean; origin?: Origin } = {}) {
  if (busy) return;
  const el = document.getElementById(section);
  if (!el) return;
  const world = worldOf(section);

  if (world !== active.world && curtain && !reduced()) {
    busy = true;
    try {
      curtain({
        world,
        origin: opts.origin ?? centre(),
        onCovered: () => jump(section, el, opts.push, true),
        onDone: () => {
          busy = false;
        },
      });
    } catch {
      // A broken curtain must never eat the click: fall back to an instant swap.
      busy = false;
      jump(section, el, opts.push, false);
    }
    return;
  }
  jump(section, el, opts.push, false);
}

/** Apply the section's world, scroll to it and update the hash. `instant`: under the curtain. */
function jump(section: string, el: HTMLElement, push: boolean | undefined, instant: boolean) {
  const html = document.documentElement;
  if (instant) html.classList.add('world-swap'); // no 500ms crossfade, the curtain hides the swap
  apply({ section, world: worldOf(section) });
  lockTarget = section;
  lockUntil = Date.now() + (instant ? 600 : 1500);
  el.scrollIntoView({ behavior: instant || reduced() ? 'auto' : 'smooth', block: 'start' });
  if (instant) {
    // Re-enable crossfades once the new colours have been painted.
    requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('world-swap')));
  } else {
    settleOn(el);
  }
  const hash = section === 'top' ? ' ' : `#${section}`;
  if (push !== false) history.pushState(null, '', hash === ' ' ? location.pathname + location.search : hash);
  // Move focus for keyboard and screen-reader users without scrolling again.
  el.focus({ preventScroll: true });
}

/**
 * After the scroll finishes, make sure we actually landed on the section: a layout change
 * during a smooth scroll (lazy content, a lock being released) can stop it short.
 */
let settleCleanup: (() => void) | null = null;
function settleOn(el: HTMLElement) {
  settleCleanup?.();
  let done = false;
  const check = () => {
    if (done) return;
    done = true;
    cleanup();
    const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const top = el.getBoundingClientRect().top;
    const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2;
    if (Math.abs(top - offset) > 4 && !atBottom) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  const timer = window.setTimeout(check, 2000);
  const cleanup = () => {
    window.clearTimeout(timer);
    window.removeEventListener('scrollend', check);
    settleCleanup = null;
  };
  window.addEventListener('scrollend', check, { once: true });
  settleCleanup = cleanup;
}

export function useActive(): Active {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
    () => SERVER,
  );
}
