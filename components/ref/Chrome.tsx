'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { nav, profile } from '@/data/site';
import {
  AnchorIcon,
  ArrowLeftIcon,
  GithubIcon,
  MailIcon,
  YinYangIcon,
} from './Icons';
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeTheme,
  toggleTheme,
} from './theme';

export function SiteLogo({ dark = false, home = false }: { dark?: boolean; home?: boolean }) {
  return (
    <div className={`site-logo ${dark ? 'site-logo-dark' : ''} ${home ? 'site-logo-home' : ''}`}>
      <Link href="/" aria-label="Yuvarajan J home">
        {profile.initials}
      </Link>
    </div>
  );
}

export function BackButton() {
  return (
    <Link className="back-button" href="/" aria-label="Back to home">
      <ArrowLeftIcon size={30} />
    </Link>
  );
}

export function SocialRail({ dark = false }: { dark?: boolean }) {
  const links = [
    { label: 'GitHub', href: profile.links.github, icon: <GithubIcon size={25} /> },
    { label: 'LeetCode', href: profile.links.leetcode, icon: <span className="rail-badge">LC</span> },
    { label: 'Hugging Face', href: profile.links.huggingface, icon: <span className="rail-badge">HF</span> },
    { label: 'Email', href: `mailto:${profile.email}`, icon: <MailIcon size={25} /> },
  ];

  return (
    <div className={`social-rail ${dark ? 'social-rail-dark' : ''}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel="me noopener noreferrer"
          aria-label={link.label}
          className="rail-link"
        >
          {link.icon}
        </a>
      ))}
      <span className="rail-line" />
    </div>
  );
}

export function GhostLabel({ text, className = '' }: { text: string; className?: string }) {
  return <span aria-hidden="true" className={`ghost-label ${className}`}>{text}</span>;
}

export function ScrollChain({ links = 4 }: { links?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.body.offsetHeight - window.innerHeight;
      const remaining = max > 0 ? (100 * Math.max(max - window.scrollY, 0)) / max : 0;
      el.style.transform = `translateY(${-remaining}%)`;
      el.classList.toggle('chain-hidden', window.scrollY < 5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-chain" ref={ref} aria-hidden="true">
      {Array.from({ length: links }).map((_, i) => (
        <span key={i} className="chain-link"><YinYangIcon size={24} /></span>
      ))}
      <AnchorIcon size={70} />
    </div>
  );
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title="Toggle theme (T)"
      onClick={() => toggleTheme()}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}

export function QuickNav() {
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) setOpen(false);
        else show();
      } else if (e.key.toLowerCase() === 't' && !open && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        toggleTheme();
      } else if (e.key === '/' && !open && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
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
      <button type="button" className="quick-nav-hint" onClick={show} title="Quick navigation (⌘K)">
        ⌘K
      </button>
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
                  <button
                    type="button"
                    className={i === active ? 'active' : ''}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item.to)}
                  >
                    <span>{item.label}</span>
                    <span className="path">{item.to}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="empty">No matching page</li>}
            </ul>
            <p className="quick-nav-foot">↑↓ to move · ↵ to open · esc to close</p>
          </div>
        </div>
      )}
    </>
  );
}

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0;
    let x = -300;
    let y = -300;
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

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
