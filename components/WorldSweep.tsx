'use client';

import { useEffect, useRef, useState } from 'react';
import { tokensFor, worldById, type WorldId } from '@/data/worlds';
import { registerTransition, type ShiftDirection, type WorldTransition } from '@/lib/world';

/**
 * Reference-style world transition: an accent-glowing band sweeps down (or up when
 * moving backwards through the world order) while a centre HUD reports
 * `~/from ↓ ~/to · palette`. The palette, theme-color and scroll position swap
 * under the band at 260ms; the lock lifts at 900ms.
 *
 * Timings mirror yazji.dev: sweep .82s, swap 260ms, unlock 900ms, HUD lives 1.5s.
 */
const SWAP_MS = 260;
const DONE_MS = 900;
const HUD_MS = 1500;
const FAILSAFE_MS = 2500;

interface Hud {
  key: number;
  from: string;
  to: string;
  palette: string;
  direction: ShiftDirection;
  accent: string;
}

const currentWorld = (): WorldId => (document.documentElement.dataset.world as WorldId) || 'client';

export default function WorldSweep() {
  const [hud, setHud] = useState<Hud | null>(null);
  const timers = useRef<number[]>([]);
  const failsafe = useRef(0);
  const seq = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const html = document.documentElement;

    const clearTimers = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      window.clearTimeout(failsafe.current);
    };

    const play: WorldTransition = ({ world, direction, onCovered, onDone }) => {
      clearTimers();
      const target = worldById(world);
      const tokens = tokensFor(target);
      seq.current += 1;

      // Restart the CSS sweep even if a previous HUD is still fading out.
      html.classList.remove('world-shift');
      void html.offsetWidth;
      html.style.setProperty('--shift-accent', tokens.accent);
      html.dataset.shiftDir = direction;
      setHud({
        key: seq.current,
        from: worldById(currentWorld()).path,
        to: target.path,
        palette: target.palette.name,
        direction,
        accent: tokens.accent,
      });
      html.classList.add('world-shift');

      let swapped = false;
      const swap = () => {
        if (swapped) return;
        swapped = true;
        try {
          onCovered();
        } catch (err) {
          console.error('[world] swap failed', err);
        }
      };

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        html.classList.remove('world-shift');
        onDone();
      };

      timers.current.push(window.setTimeout(swap, SWAP_MS));
      timers.current.push(window.setTimeout(finish, DONE_MS));
      timers.current.push(window.setTimeout(() => mounted.current && setHud(null), HUD_MS));

      // Whatever happens, never leave the page mid-shift or the switcher locked.
      failsafe.current = window.setTimeout(() => {
        try {
          swap();
        } finally {
          finish();
          if (mounted.current) setHud(null);
        }
      }, FAILSAFE_MS);
    };

    registerTransition(play);
    return () => {
      mounted.current = false;
      registerTransition(null);
      clearTimers();
      html.classList.remove('world-shift');
      html.removeAttribute('data-shift-dir');
      html.style.removeProperty('--shift-accent');
    };
  }, []);

  return (
    <div className="shift" aria-hidden="true">
      <div className="shift-sweep">
        <i />
      </div>
      {hud && (
        <div className="shift-hud mono" key={hud.key}>
          <span
            className="shift-hud-dot"
            style={{ background: hud.accent, boxShadow: `0 0 10px ${hud.accent}` }}
          />
          <span className="shift-hud-from">{hud.from}</span>
          <span className="shift-hud-arrow">{hud.direction === 'down' ? '↓' : '↑'}</span>
          <span className="shift-hud-to" style={{ color: hud.accent }}>
            {hud.to}
          </span>
          <span className="shift-hud-sub">{hud.palette}</span>
          <i className="shift-hud-bar" style={{ background: hud.accent }} />
        </div>
      )}
    </div>
  );
}
