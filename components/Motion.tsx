'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/client';

/** Section reveals and count-up numbers. Content is fully visible without JS. */
export default function Motion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('has-motion');

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const raw = el.dataset.count ?? '';
        const m = raw.match(/^([\d.]+)(.*)$/);
        if (!m) return;
        const target = parseFloat(m[1]);
        const decimals = (m[1].split('.')[1] ?? '').length;
        const suffix = m[2];
        const obj = { v: 0 };
        el.textContent = `${(0).toFixed(decimals)}${suffix}`;
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => (el.textContent = `${obj.v.toFixed(decimals)}${suffix}`),
        });
      });
    });

    return () => {
      ctx.revert();
      document.documentElement.classList.remove('has-motion');
    };
  }, []);
  return null;
}
