'use client';

import { useEffect, useState } from 'react';
import { loader, profile } from '@/data/content';
import { worlds } from '@/data/worlds';
import { prefersReducedMotion } from '@/lib/client';

const KEY = 'yj:booted';
const DURATION = 2600; // never blocks for more than ~3s
const FADE = 450;
const GLYPHS = '!<>-_/[]{}—=+*^?#$%&@01';
const TICK_MS = 70;

/** Replace the tail of a word with changing symbols until `reveal` characters are clear. */
function scramble(word: string, tick: number, reveal = 0) {
  return word
    .split('')
    .map((char, index) => {
      if (char === ' ' || index < reveal) return char;
      return GLYPHS[(tick * 11 + index * 17 + tick * index) % GLYPHS.length];
    })
    .join('');
}

/**
 * Boot loader. The progress counter drives everything: 0–25% client, 25–50% server,
 * 50–75% agents, 75–100% whoami. The loader carries its own `data-world`, so exactly one
 * palette is applied at a time and the registered colour properties crossfade between them.
 * At 100% it fades out over the page (already in its own world) and unmounts.
 */
export default function Loader() {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === '1';
    } catch {}
    document.documentElement.classList.remove('boot-pending');
    if (seen || prefersReducedMotion()) return;
    // The decision depends on sessionStorage, which only exists after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    document.documentElement.classList.add('is-booting');

    let finished = false;
    let raf = 0;
    let removeTimer = 0;
    const t0 = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      // Mark as booted only once it actually ran, so a StrictMode re-run still shows it.
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {}
      cancelAnimationFrame(raf);
      setPct(100);
      setLeaving(true);
      document.documentElement.classList.remove('is-booting');
      removeTimer = window.setTimeout(() => setShow(false), FADE); // unmount: nothing left to block clicks
    };
    const tick = (t: number) => {
      // rAF timestamps can be slightly earlier than t0 on the first frame: clamp to 0.
      const p = Math.min(1, Math.max(0, (t - t0) / DURATION));
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(removeTimer);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
      document.documentElement.classList.remove('is-booting');
    };
  }, []);

  useEffect(() => {
    if (!show || leaving) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), TICK_MS);
    return () => window.clearInterval(timer);
  }, [show, leaving]);

  if (!show) return null;

  const slice = 100 / worlds.length;
  const phase = Math.max(0, Math.min(worlds.length - 1, Math.floor(pct / slice)));
  const world = worlds[phase];
  const within = (pct - phase * slice) / slice;
  const label = world.label.toUpperCase();
  const reveal = pct === 100 ? label.length : Math.floor(Math.min(1, within * 1.65) * label.length);
  const bigWord = scramble(label, tick, reveal);
  const worldLabels = worlds.map((w, index) => {
    const text = w.label.toUpperCase();
    if (pct === 100 || index < phase) return text;
    return scramble(text, tick, index === phase ? reveal : 0);
  });
  const lines = worlds
    .slice(0, phase + 1)
    .flatMap((w, i) => (i < phase || pct === 100 ? w.bootLines : w.bootLines.slice(0, within >= 0.5 ? 2 : 1)));

  return (
    <div
      className={`loader${leaving ? ' is-leaving' : ''}`}
      data-world={world.id}
      role="status"
      aria-live="polite"
      aria-label="Loading site"
    >
      <div className="loader__box">
        <div className="loader__top mono">
          <span>{profile.host} · cold start</span>
          <span className="loader__pct">{String(pct).padStart(3, '0')}%</span>
        </div>
        <div className="loader__word-wrap" aria-hidden="true">
          <p className="loader__word-kicker mono">
            {world.path} · {pct === 100 ? 'ready' : 'decoding'}
          </p>
          <p className="loader__word">{bigWord}</p>
          <p className="loader__worlds mono">
            {worlds.map((w, index) => (
              <span
                key={w.id}
                className={index === phase ? 'is-active' : index < phase ? 'is-done' : undefined}
              >
                {worldLabels[index]}
              </span>
            ))}
          </p>
        </div>
        <div className="loader__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <ol className="loader__tabs mono" aria-label="Worlds">
          {worlds.map((w, i) => (
            <li
              key={w.id}
              className={i === phase ? 'is-active' : i < phase ? 'is-done' : undefined}
              aria-current={i === phase ? 'step' : undefined}
            >
              {w.path}
            </li>
          ))}
        </ol>
        <pre className="loader__log mono">
          <span className="loader__cmd">{loader.command}</span>
          {'\n'}
          {lines.map((l) => (
            <span key={l} className="loader__line">
              {l}
              {'\n'}
            </span>
          ))}
          {pct === 100 ? <span className="loader__ok">✓ ready{'\n'}</span> : <span className="caret" />}
        </pre>
        <p className="loader__skip mono">{world.palette.name} · press any key to skip</p>
      </div>
    </div>
  );
}
