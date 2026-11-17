'use client';

import { useEffect, useRef } from 'react';

/** Lightweight take on the reference portfolio's two particle configurations. */
export default function ParticleField({ theme }: { theme: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = theme === 'dark' ? 12 : 78;
    const color = theme === 'dark' ? '252, 246, 244' : '0, 0, 0';
    const linkDistance = theme === 'dark' ? 0 : 150;
    const lineColor = theme === 'dark' ? '252, 246, 244' : '0, 0, 0';

    let width = 0;
    let height = 0;
    let frame = 0;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    const mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (theme === 'dark' ? 1.5 : 0.55),
          vy: (Math.random() - 0.5) * (theme === 'dark' ? 1.5 : 0.55),
          r: theme === 'dark' ? 1 + Math.random() * 2 : 1 + Math.random() * 2.5,
          a: theme === 'dark' ? 0.45 + Math.random() * 0.5 : 0.25 + Math.random() * 0.4,
        });
      }
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      if (linkDistance) {
        for (let i = 0; i < particles.length; i += 1) {
          for (let j = i + 1; j < particles.length; j += 1) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < linkDistance * linkDistance) {
              ctx.strokeStyle = `rgba(${lineColor}, ${0.16 * (1 - Math.sqrt(d2) / linkDistance)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const p of particles) {
        if (!reduce) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 18000 && d2 > 1) {
            const force = 0.7 / Math.sqrt(d2);
            p.vx += dx * force * 0.12;
            p.vy += dy * force * 0.12;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.995;
          p.vy *= 0.995;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
        ctx.fillStyle = `rgba(${color}, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resize();
    seed();
    frame = requestAnimationFrame(step);
    window.addEventListener('resize', resize);
    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
