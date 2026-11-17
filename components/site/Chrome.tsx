'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { contactInfo, nav, person, socials } from '@/data/portfolio';
import { ArrowLeftIcon, GithubIcon, LinkedinIcon, MailIcon, YinYangIcon } from '@/components/ref/Icons';

/* -------------------------------------------------------------- particles */

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dots = 14;
    const color = '252, 246, 244';
    let width = 0;
    let height = 0;
    let frame = 0;
    const particles = Array.from({ length: dots }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: 0.8 + Math.random() * 1.6,
      a: 0.18 + Math.random() * 0.45,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = Math.max(window.innerHeight, document.body.scrollHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx / width;
          p.y += p.vy / height;
          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;
        }
        ctx.fillStyle = `rgba(${color}, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ header */

export function Header() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <div className="site-header">
      <Link className="site-logo" href="/" aria-label={`${person.name}, back to home`}>
        {person.initials}
      </Link>
      <span className="eyebrow site-header__role">{person.eyebrowRole}</span>
      <Link className="back-button" href="/" aria-label="Back to home">
        <ArrowLeftIcon size={24} />
      </Link>
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="social-icon">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LeetcodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="social-icon">
      <path d="M13.48 0a1.38 1.38 0 0 0-.96.44L7.12 6.23l-3.86 4.12a5.3 5.3 0 0 0-1.2 2.11 5.6 5.6 0 0 0-.06 2.87c.1.36.22.7.4 1.02.32.64.76 1.24 1.3 1.78l4.27 4.2.04.03a5.8 5.8 0 0 0 8.06-.07l2.4-2.4a1.38 1.38 0 0 0-1.96-1.95l-2.4 2.39a3.02 3.02 0 0 1-4.2.04l-4.28-4.2a2.52 2.52 0 0 1-.88-1.79 2.7 2.7 0 0 1 .07-.52c.12-.42.35-.81.68-1.16L9.13 8.12c1.06-1.14 3.2-1.28 4.43-.28l3.5 2.83a1.38 1.38 0 0 0 1.73-2.15l-3.5-2.83c-.8-.65-1.77-1.04-2.77-1.2l2.02-2.16A1.38 1.38 0 0 0 13.48 0Zm-2.87 12.82a1.38 1.38 0 0 0 0 2.76h9.18a1.38 1.38 0 0 0 0-2.76Z" />
    </svg>
  );
}

export function SocialRail() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const links = [
    { label: 'LinkedIn', href: socials.linkedin, icon: <LinkedinIcon size={18} /> },
    { label: 'GitHub', href: socials.github, icon: <GithubIcon size={18} /> },
    { label: 'LeetCode', href: socials.leetcode, icon: <LeetcodeIcon /> },
    { label: 'Instagram', href: socials.instagram, icon: <InstagramIcon /> },
    { label: 'Email', href: `mailto:${contactInfo.email}`, icon: <MailIcon size={18} /> },
  ];

  return (
    <nav className="social-rail" aria-label="Social links">
      {links.map((link) => (
        <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={link.label}>
          {link.icon}
        </a>
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------- quick nav */

export function QuickNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nav;
    return nav.filter((item) => item.label.toLowerCase().includes(q) || item.to.includes(q));
  }, [query]);

  const show = useCallback(() => {
    setQuery('');
    setActive(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) setOpen(false);
        else show();
      } else if (e.key === '/' && !open && !typing) {
        e.preventDefault();
        show();
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, show]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const go = (to: string) => {
    setOpen(false);
    router.push(to);
  };

  return (
    <>
      {pathname !== '/' && (
        <button type="button" className="quick-nav-hint" onClick={show} title="Quick navigation (⌘K /)" aria-label="Quick navigation">
          ⌘K
        </button>
      )}
      {open && (
        <div className="quick-nav-overlay" role="presentation" onMouseDown={() => setOpen(false)}>
          <div className="quick-nav-panel" role="dialog" aria-modal="true" aria-label="Quick navigation" onMouseDown={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActive((i) => Math.min(i + 1, results.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                } else if (e.key === 'Enter' && results[active]) {
                  go(results[active].to);
                }
              }}
              placeholder="Jump to a page…"
              aria-label="Search pages"
            />
            <ul>
              {results.map((item, i) => (
                <li key={item.to}>
                  <button type="button" className={i === active ? 'active' : ''} onMouseEnter={() => setActive(i)} onClick={() => go(item.to)}>
                    <span>{item.label}</span>
                    <span className="path">{item.to}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="empty">No matching page</li>}
            </ul>
            <p className="quick-nav-foot">↑↓ move · ↵ open · esc close</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------ cursor glow */

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    let x = -400;
    let y = -400;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        });
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}

/* ------------------------------------------------------------- reveal/copy */

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="email-copy-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(contactInfo.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          window.location.href = `mailto:${contactInfo.email}`;
        }
      }}
    >
      <span className="font-display email-copy-button__address">{contactInfo.email}</span>
      <span className="eyebrow email-copy-button__hint">{copied ? 'Copied to clipboard' : 'Click to copy'}</span>
    </button>
  );
}

/* ------------------------------------------------------------------- gate */

export function GateMark() {
  return <YinYangIcon size={96} />;
}
