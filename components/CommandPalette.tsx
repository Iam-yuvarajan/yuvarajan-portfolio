'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { profile, sections, visibleLinks } from '@/data/content';
import { copyText, toast } from '@/lib/client';
import { goTo } from '@/lib/world';

interface Item {
  id: string;
  label: string;
  hint: string;
  group: 'Sections' | 'Actions';
  run: () => void;
}

/** Subsequence fuzzy score: higher is better, -1 means no match. */
function score(query: string, text: string) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t.includes(q)) return 100 - t.indexOf(q);
  let ti = 0;
  let s = 0;
  let streak = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    streak = found === ti ? streak + 1 : 0;
    s += 1 + streak;
    ti = found + 1;
  }
  return s;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => goTo(id);
    const secs: Item[] = [
      { id: 'top', label: 'Top', hint: '~/client', group: 'Sections', run: go('top') },
      ...sections.map((s) => ({
        id: s.id,
        label: `${s.num} ${s.nav}`,
        hint: s.path,
        group: 'Sections' as const,
        run: go(s.id),
      })),
    ];
    const actions: Item[] = [
      {
        id: 'copy-email',
        label: 'Copy email',
        hint: profile.email,
        group: 'Actions',
        run: async () => toast((await copyText(profile.email)) ? 'Email copied' : 'Copy failed'),
      },
      {
        id: 'resume',
        label: 'Download resume',
        hint: profile.resume.file,
        group: 'Actions',
        run: () => {
          const a = document.createElement('a');
          a.href = profile.resume.href;
          a.download = profile.resume.file;
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      },
      ...visibleLinks().map((l) => ({
        id: l.id,
        label: `Open ${l.label}`,
        hint: '↗ new tab',
        group: 'Actions' as const,
        run: () => window.open(l.href, '_blank', 'noopener,noreferrer'),
      })),
    ];
    return [...secs, ...actions];
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return items;
    return items
      .map((it) => ({ it, s: Math.max(score(q, it.label), score(q, it.hint) - 5) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.it);
  }, [q, items]);

  useEffect(() => {
    const reset = () => {
      restore.current = document.activeElement as HTMLElement | null;
      setQ('');
      setIdx(0);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => {
          if (!o) reset();
          return !o;
        });
      }
    };
    const onOpen = () => {
      reset();
      setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('app:palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('app:palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => input.current?.focus());
    else restore.current?.focus?.();
  }, [open]);

  if (!open) return null;

  const choose = (it: Item | undefined) => {
    if (!it) return;
    setOpen(false);
    it.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[idx]);
    } else if (e.key === 'Tab') {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  return (
    <div className="palette" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="palette__box" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKeyDown}>
        <div className="palette__search">
          <span className="mono" aria-hidden="true">
            →
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            placeholder="Jump to a section or run an action…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[idx] ? `pal-${results[idx].id}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="mono">esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="palette__list" aria-label="Results">
          {results.length === 0 && <li className="palette__empty mono">no matches for “{q}”</li>}
          {results.map((it, i) => {
            const header = i === 0 || results[i - 1].group !== it.group ? it.group : null;
            return (
              <li key={it.id} role="presentation">
                {header && <div className="palette__group mono">{header}</div>}
                <div
                  id={`pal-${it.id}`}
                  role="option"
                  aria-selected={i === idx}
                  className={`palette__item${i === idx ? ' is-active' : ''}`}
                  onMouseMove={() => setIdx(i)}
                  onClick={() => choose(it)}
                >
                  <span>{it.label}</span>
                  <span className="mono palette__hint">{it.hint}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="palette__foot mono">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
