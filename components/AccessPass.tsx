'use client';

import { useEffect, useRef, useState } from 'react';
import { hero, profile, visibleLinks } from '@/data/content';
import { contrast, entrySection, worlds, type WorldId } from '@/data/worlds';
import { goTo, useActive } from '@/lib/world';
import { Rich } from '@/lib/text';
import { prefersReducedMotion } from '@/lib/client';

const ROPE = 120; // rest lanyard length in px
const G = 2600; // "gravity" tuning constant
const DAMP = 1.6;

/** Ink that stays readable on a world's accent colour. */
const cellInk = (hex: string) => (contrast('#FFFFFF', hex) >= 4.5 ? '#FFFFFF' : '#0D0B08');

export default function AccessPass() {
  const rig = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const rope = useRef<SVGLineElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  // physics state lives in a ref to avoid re-rendering every frame
  const s = useRef({ th: 0.18, w: 0, len: ROPE, lv: 0, drag: false, gx: 0, gy: 0, moved: 0, sx: 0, sy: 0, reduced: false });

  useEffect(() => {
    const st = s.current;
    st.reduced = prefersReducedMotion();
    if (st.reduced) st.th = 0;
    let raf = 0;
    let last = performance.now();

    const render = () => {
      const x = Math.sin(st.th) * st.len;
      const y = Math.cos(st.th) * st.len;
      const tilt = st.th * 0.85 * (180 / Math.PI) - st.w * 2.2;
      if (card.current) {
        card.current.style.transform = `translate(calc(-50% + ${x.toFixed(2)}px), ${y.toFixed(2)}px) rotate(${(-tilt).toFixed(2)}deg)`;
      }
      if (rope.current) {
        rope.current.setAttribute('x2', String(150 + x));
        rope.current.setAttribute('y2', String(y + 4));
      }
    };

    const step = (t: number) => {
      const dt = Math.min(0.032, (t - last) / 1000);
      last = t;
      if (!st.drag && !st.reduced) {
        const acc = -(G / st.len) * Math.sin(st.th) - DAMP * st.w;
        st.w += acc * dt;
        st.th += st.w * dt;
        const la = -180 * (st.len - ROPE) - 14 * st.lv;
        st.lv += la * dt;
        st.len += st.lv * dt;
      }
      render();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pivot = () => {
    const r = rig.current!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top };
  };

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    const st = s.current;
    const p = pivot();
    const ax = p.x + Math.sin(st.th) * st.len;
    const ay = p.y + Math.cos(st.th) * st.len;
    st.gx = e.clientX - ax;
    st.gy = e.clientY - ay;
    st.sx = e.clientX;
    st.sy = e.clientY;
    st.moved = 0;
    st.drag = true;
    st.w = 0;
    st.lv = 0;
    card.current?.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onMove = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.drag) return;
    st.moved = Math.max(st.moved, Math.hypot(e.clientX - st.sx, e.clientY - st.sy));
    if (st.reduced) return;
    const p = pivot();
    const tx = e.clientX - st.gx - p.x;
    const ty = Math.max(20, e.clientY - st.gy - p.y);
    const th = Math.max(-1.2, Math.min(1.2, Math.atan2(tx, ty)));
    st.w = st.w * 0.6 + ((th - st.th) / 0.016) * 0.4; // remember throw speed
    st.th = th;
    st.len = Math.max(ROPE * 0.85, Math.min(ROPE * 1.35, Math.hypot(tx, ty)));
  };

  const onUp = (e: React.PointerEvent) => {
    const st = s.current;
    if (!st.drag) return;
    st.drag = false;
    st.w = Math.max(-8, Math.min(8, st.w));
    setDragging(false);
    card.current?.releasePointerCapture?.(e.pointerId);
    if (st.moved < 6) setFlipped((f) => !f);
  };

  const nudge = (dir: number) => {
    s.current.w += dir * 2.5;
  };

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    if (e.key === 'ArrowLeft') nudge(-1);
    if (e.key === 'ArrowRight') nudge(1);
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  const links = visibleLinks();
  const { world } = useActive();
  const jump = (id: WorldId) => goTo(entrySection(id));

  const copySerial = async () => {
    try {
      await navigator.clipboard.writeText(profile.serial);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard can be blocked; the serial stays visible either way
    }
  };

  const stop = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <div className="pass-wrap">
      <div className="pass-rig" ref={rig}>
        <svg className="pass-rope" viewBox="0 0 300 600" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
          <circle cx="150" cy="4" r="4" />
          <line ref={rope} x1="150" y1="4" x2="150" y2={ROPE} />
        </svg>
        <div
          ref={card}
          className={`pass${flipped ? ' is-flipped' : ''}${dragging ? ' is-dragging' : ''}`}
          role="group"
          tabIndex={0}
          aria-label={`Access pass for ${profile.name}. Drag or use the arrow keys to swing it, press Enter to flip.`}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          <div className="pass__clip" aria-hidden="true" />
          <div className="pass__strap mono" aria-hidden="true">
            <span>{profile.name} · 2026</span>
          </div>
          <div className="pass__inner">
            <section className="pass__face pass__front" aria-label="Access pass, front" inert={flipped}>
              <div className="pass__top mono">
                <span>access pass</span>
                <span>2026</span>
              </div>

              <div className="pass__chip" role="group" aria-label="Jump to a world by colour">
                {worlds.map((w) => {
                  const active = world === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      className={`pass__chip-cell${active ? ' is-active' : ''}`}
                      style={
                        {
                          '--cell': w.palette.accent,
                          '--cell-ink': cellInk(w.palette.accent),
                        } as React.CSSProperties
                      }
                      aria-label={`Go to ${w.label} (${w.path})`}
                      aria-pressed={active}
                      onPointerDown={stop}
                      onPointerUp={stop}
                      onClick={() => jump(w.id)}
                    >
                      <span className="mono">{w.path}</span>
                    </button>
                  );
                })}
                <span className="pass__initials" aria-hidden="true">
                  {profile.initials}
                </span>
              </div>

              <div className="pass__name">{profile.name}</div>
              <div className="pass__role mono">{profile.shortRole}</div>
              <dl className="pass__rows mono">
                <div>
                  <dt>base</dt>
                  <dd>
                    <Rich text={profile.baseLocation} />
                  </dd>
                </div>
                <div>
                  <dt>zone</dt>
                  <dd>{profile.timezoneShort}</dd>
                </div>
                <div>
                  <dt>status</dt>
                  <dd className="ok">{profile.passStatus}</dd>
                </div>
              </dl>
              <div className="pass__code mono">
                <span className="pass__barcode" aria-hidden="true" />
                <button
                  type="button"
                  className="pass__serial"
                  onClick={copySerial}
                  title="Copy serial"
                  aria-label={copied ? 'Serial copied' : `Copy serial ${profile.serial}`}
                >
                  {copied ? 'copied ✓' : profile.serial}
                </button>
                <span className="sr-only" role="status">
                  {copied ? 'Serial copied to clipboard' : ''}
                </span>
              </div>
            </section>

            <section className="pass__face pass__back" aria-label="Access pass, back" inert={!flipped}>
              <p className="pass__found mono">
                if found, return to
                <br />
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
              <div className="pass__links">
                {links.map((l) => (
                  <a key={l.id} className="chip-link mono" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
              <div className="pass__clear mono">
                <div className="pass__clear-title">clearance</div>
                <ul>
                  {worlds.map((w) => (
                    <li key={w.id}>
                      <button
                        type="button"
                        className={world === w.id ? 'is-active' : undefined}
                        aria-label={`Go to ${w.path}`}
                        onPointerDown={stop}
                        onPointerUp={stop}
                        onClick={() => jump(w.id)}
                      >
                        <span>{w.path}</span>
                        <span className="ok">granted</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="pass__flip pass__flipout mono"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
      >
        <span aria-hidden="true">↻</span> {flipped ? hero.passBackHint : hero.passFlipHint}
      </button>
      <p className="pass-caption mono" aria-hidden="true">
        {hero.passCaption}
      </p>
    </div>
  );
}
