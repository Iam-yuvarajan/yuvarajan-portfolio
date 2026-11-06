'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { allSections } from '@/data/worlds';
import { goTo, hydrateActive, spySection } from '@/lib/world';

/** The section whose box contains the middle of the viewport. */
function sectionAtCenter(): string {
  const mid = window.innerHeight / 2;
  let current: string = allSections[0].id;
  for (const s of allSections) {
    const el = document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top <= mid) current = s.id;
  }
  return current;
}

/**
 * Sets the active world as each section crosses the middle of the viewport.
 * Registered once; StrictMode's double effect is cleaned up by `kill()` / `disconnect()`.
 */
export default function WorldSpy() {
  useEffect(() => {
    // A fresh link always opens on the hero. In-page navigation writes hashes later.
    history.scrollRestoration = 'manual';
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    hydrateActive();

    // Coalesce to one update per frame: when scrolling fast, only the last section applies.
    let raf = 0;
    let pending: string | null = null;
    const schedule = (id: string) => {
      pending = id;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (pending) spySection(pending);
        });
    };

    let teardown: () => void;
    try {
      gsap.registerPlugin(ScrollTrigger);
      const triggers = allSections.flatMap((s) => {
        const el = document.getElementById(s.id);
        if (!el) return [];
        return [
          ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => schedule(s.id),
            onEnterBack: () => schedule(s.id),
          }),
        ];
      });
      teardown = () => triggers.forEach((t) => t.kill());
    } catch {
      // Fallback: a 1px band across the middle of the viewport.
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && schedule(e.target.id)),
        { rootMargin: '-50% 0px -50% 0px' },
      );
      allSections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) io.observe(el);
      });
      teardown = () => io.disconnect();
    }

    // First load: the hero is the only valid landing point (the hash was cleared above).
    schedule(sectionAtCenter());

    // In-page anchors (#work, #contact …) switch world first, then scroll.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      if (!allSections.some((s) => s.id === id)) return;
      e.preventDefault();
      // Every in-page link goes through the same sweep + HUD as the world pill.
      goTo(id);
    };
    // Back / forward: scroll restoration is manual now, so settle on the hash target
    // (or the hero when there is no hash) instead of whatever was left on screen.
    const onPop = () =>
      window.setTimeout(() => {
        const id = window.location.hash.slice(1);
        const el = id ? document.getElementById(id) : null;
        if (el && allSections.some((s) => s.id === id)) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
          schedule(id);
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        schedule(allSections[0].id);
      }, 60);

    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      teardown();
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, []);
  return null;
}
