'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { tokensFor, worldById } from '@/data/worlds';
import { registerCurtain, type Curtain, type Origin } from '@/lib/world';

/** Timings (seconds). Total ≈ 0.5 + 0.08 + 0.42 = 1.0s. */
const COVER = 0.5;
const HOLD = 0.08;
const REVEAL = 0.42;
/** If anything goes wrong, the curtain is force-removed after this many ms. */
const FAILSAFE_MS = 2500;

/** Distance from the origin to the farthest viewport corner, plus a little slack. */
const radiusFrom = ({ x, y }: Origin) => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
};
const circle = (r: number, o: Origin) => `circle(${r}px at ${o.x}px ${o.y}px)`;

/**
 * Full-screen world transition.
 * 1. A layer in the target world's background grows from the click point (clip-path circle).
 * 2. While it covers the screen, `onCovered` swaps data-world and jumps to the section.
 *    The target world label (e.g. ~/server) flashes in the middle.
 * 3. The layer slides up and away to reveal the new world.
 * Only clip-path, transform and opacity are animated.
 */
export default function WorldCurtain() {
  const layer = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = layer.current!;
    const lab = label.current!;
    let tl: gsap.core.Timeline | null = null;
    let origin: Origin = { x: 0, y: 0 };
    let covered = false;
    let failsafe = 0;

    const reset = () => {
      tl?.kill();
      tl = null;
      covered = false;
      window.clearTimeout(failsafe);
      gsap.set(el, { clearProps: 'clipPath,transform,visibility' });
      gsap.set(lab, { clearProps: 'opacity,transform' });
    };

    const play: Curtain = ({ world, origin: o, onCovered, onDone }) => {
      reset();
      origin = o;
      const t = tokensFor(worldById(world));
      el.style.setProperty('--curtain-bg', t.bg);
      el.style.setProperty('--curtain-ink', t.ink);
      el.style.setProperty('--curtain-accent', t.accent);
      lab.textContent = worldById(world).path;

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        reset();
        onDone();
      };
      let swapped = false;
      const swap = () => {
        if (swapped) return;
        swapped = true;
        covered = true;
        onResize(); // the viewport may have changed while the circle was growing
        onCovered();
      };
      // Never leave the screen covered or the nav locked, whatever happens to the timeline.
      failsafe = window.setTimeout(() => {
        swap();
        finish();
      }, FAILSAFE_MS);

      tl = gsap
        .timeline({ onComplete: finish })
        .set(el, { visibility: 'visible', yPercent: 0, clipPath: circle(0, o) })
        .set(lab, { opacity: 0, y: 12 })
        .to(el, { clipPath: circle(radiusFrom(o), o), duration: COVER, ease: 'expo.inOut' })
        .to(lab, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }, COVER * 0.55)
        .add(swap, COVER)
        .to(lab, { opacity: 0, y: -12, duration: 0.2, ease: 'power3.in' }, COVER + HOLD)
        .to(el, { yPercent: -100, duration: REVEAL, ease: 'power3.inOut' }, COVER + HOLD);
    };

    // A resize while covered: keep the circle reaching the farthest corner.
    const onResize = () => {
      if (tl && covered) gsap.set(el, { clipPath: circle(radiusFrom(origin), origin) });
    };

    registerCurtain(play);
    window.addEventListener('resize', onResize);
    return () => {
      registerCurtain(null);
      window.removeEventListener('resize', onResize);
      reset();
    };
  }, []);

  return (
    <div ref={layer} className="curtain" aria-hidden="true">
      <p ref={label} className="curtain__label mono" />
    </div>
  );
}
