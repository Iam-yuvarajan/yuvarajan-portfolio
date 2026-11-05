'use client';

import { useSyncExternalStore } from 'react';
import {
  DEFAULT_WORLD,
  WORLD_ORDER,
  entrySection,
  stepWorld,
  themeColors,
  worldById,
  worldOf,
  type WorldId,
} from '@/data/worlds';

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

/* ------------------------------------------------------------ sweep hookup */

export type ShiftDirection = 'up' | 'down';

export interface TransitionOpts {
  world: WorldId;
  direction: ShiftDirection;
  /** Fired under the sweep: swap the palette and scroll to the target section. */
  onCovered: () => void;
  /** Fired when the lock can lift. */
  onDone: () => void;
}

/** Implemented by <WorldSweep/>: play the full-screen sweep and centre HUD. */
export type WorldTransition = (opts: TransitionOpts) => void;

let transition: WorldTransition | null = null;
/** True while a world transition runs. Extra clicks are ignored until it finishes. */
let busy = false;

export function registerTransition(t: WorldTransition | null) {
  transition = t;
}
export const isTransitioning = () => busy;

/**
 * First section of a world that actually exists in the document. Config order wins
 * (`agents` → ask → notes), so a not-yet-built section is skipped, never crashed on.
 */
export function entryFor(world: WorldId): string {
  const def = worldById(world);
  return def.sections.find((id) => document.getElementById(id)) ?? entrySection(world);
}

/**
 * The world switcher: one step through the fixed order. Returns false when a
 * transition is already running (click ignored).
 */
export function cycleWorld(step: number): boolean {
  if (busy) return false;
  const world = stepWorld(active.world, step);
  goTo(entryFor(world));
  return true;
}

/** Which way the sweep band travels between two worlds in the fixed order. */
export function shiftDirection(from: WorldId, to: WorldId): ShiftDirection {
  return WORLD_ORDER.indexOf(to) > WORLD_ORDER.indexOf(from) ? 'down' : 'up';
}

/**
 * Go to a section. If it lives in another world (and motion is allowed), the full-screen
 * sweep plays: the palette and scroll position swap under it, then it clears.
 * Same world, or reduced motion: swap + scroll straight away.
 */
export function goTo(section: string, opts: { push?: boolean } = {}) {
  if (busy) return;
  const el = document.getElementById(section);
  if (!el) return;
  const world = worldOf(section);

  if (world !== active.world && transition && !reduced()) {
    busy = true;
    try {
      transition({
        world,
        direction: shiftDirection(active.world, world),
        onCovered: () => jump(section, el, opts.push, true),
        onDone: () => {
          busy = false;
        },
      });
    } catch {
      // A broken transition must never eat the click: fall back to an instant swap.
      busy = false;
      jump(section, el, opts.push, false);
    }
    return;
  }
  jump(section, el, opts.push, false);
}

/** Jump without the page's global `scroll-behavior: smooth` turning it into a glide. */
function scrollToInstant(el: HTMLElement) {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
  html.style.scrollBehavior = previous;
}

/** Apply the section's world, scroll to it and update the hash. `instant`: under the sweep. */
function jump(section: string, el: HTMLElement, push: boolean | undefined, instant: boolean) {
  // A pending settle from an earlier smooth scroll must not fire and drag us back here.
  settleCleanup?.();
  apply({ section, world: worldOf(section) });
  lockTarget = section;
  lockUntil = Date.now() + (instant ? 600 : 1500);

  if (instant || reduced()) {
    scrollToInstant(el);
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    if (Math.abs(top - offset) > 4 && !atBottom) scrollToInstant(el);
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
