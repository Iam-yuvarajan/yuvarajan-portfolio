'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { profile } from '@/data/content';
import { sections, stepWorld, worldById } from '@/data/worlds';
import { openPalette } from '@/lib/client';
import { cycleWorld, goTo, originFrom, useActive, type Origin } from '@/lib/world';

const noop = () => () => {};

export default function Header() {
  const { section, world } = useActive();
  const [open, setOpen] = useState(false);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const mac = useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) opener.current?.focus();
  };
  const toggleFrom = (btn: HTMLButtonElement | null) => {
    opener.current = btn;
    setOpen((o) => !o);
  };

  // Esc, outside click, focus into the panel, body scroll lock on small screens.
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    if (window.matchMedia('(max-width: 960px)').matches) document.documentElement.classList.add('menu-open');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        opener.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panel.current?.contains(t) || mobileButton.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);

  const choose = (id: string, origin: Origin) => {
    close(false);
    // Let the panel close and the scroll lock lift before scrolling, so nothing interrupts it.
    requestAnimationFrame(() => requestAnimationFrame(() => goTo(id, { origin })));
  };

  // Arrow keys move between menu items.
  const onMenuKey = (e: React.KeyboardEvent) => {
    const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items.at(-1)?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const worldPath = worldById(world).path;
  const nextPath = worldById(stepWorld(world, 1)).path;

  // One click = next world; shift-click = previous. The curtain grows from the pill.
  const switchWorld = (e: React.MouseEvent<HTMLButtonElement>) => {
    cycleWorld(e.shiftKey ? -1 : 1, originFrom(e, e.currentTarget));
  };

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#top" className="header__name">
          {profile.name}
        </a>
        <nav aria-label="Primary" className="nav">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={section === s.id ? 'is-active' : undefined}
                  aria-current={section === s.id ? 'true' : undefined}
                >
                  <span className="nav__num mono">{s.num}</span>
                  {s.nav}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="header__tools">
          <button type="button" className="kbd-hint mono" onClick={openPalette} aria-label="Open command palette">
            Jump to <kbd>{mac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </button>
          <button
            type="button"
            className="world-btn mono"
            aria-label={`Switch world. Current: ${worldPath}. Next: ${nextPath}`}
            title={`Next: ${nextPath}`}
            onClick={switchWorld}
          >
            <span className="dot" aria-hidden="true" />
            <span className="world-btn__path">{worldPath}</span>
            <span className="world-btn__next" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 8h8" />
                <path d="M8.5 4.5 12 8l-3.5 3.5" />
              </svg>
            </span>
          </button>
          <a className="btn btn--primary btn--sm hire" href={`mailto:${profile.email}`}>
            Hire me →
          </a>
          <button
            ref={mobileButton}
            type="button"
            className="menu-btn mono"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="pages-menu"
            onClick={() => toggleFrom(mobileButton.current)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div
        id="pages-menu"
        ref={panel}
        className={`pages${open ? ' is-open' : ''}`}
        role="menu"
        aria-label="Pages"
        hidden={!open}
        onKeyDown={onMenuKey}
      >
        <p className="pages__title mono" aria-hidden="true">
          pages · {worldPath}
        </p>
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            role="menuitem"
            className={`pages__item${section === s.id ? ' is-active' : ''}`}
            aria-current={section === s.id ? 'true' : undefined}
            onClick={(e) => choose(s.id, originFrom(e))}
          >
            <span className="pages__num mono">{s.num}</span>
            <span className="pages__label">{s.nav}</span>
            <span className="pages__world mono">{worldById(s.world).path}</span>
          </button>
        ))}
        <div className="pages__foot">
          <button
            type="button"
            role="menuitem"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              close(false);
              openPalette();
            }}
          >
            Jump to… <kbd>{mac ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </button>
          <a role="menuitem" className="btn btn--primary btn--sm" href={`mailto:${profile.email}`}>
            Hire me →
          </a>
        </div>
      </div>
    </header>
  );
}
