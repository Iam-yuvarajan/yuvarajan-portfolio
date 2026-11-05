'use client';

import { useEffect, useState } from 'react';
import { notes as copy, profile } from '@/data/content';
import type { Note } from '@/lib/notes';
import { timedFetch, toast } from '@/lib/client';
import SectionHead from './SectionHead';
import AskBot from './AskBot';

const pad = (n: number) => String(n).padStart(4, '0');

export default function Notes() {
  const [list, setList] = useState<Note[] | null>(null);
  const [total, setTotal] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [hp, setHp] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    timedFetch<{ count: number; notes: Note[]; offline?: boolean }>('/api/notes')
      .then((r) => {
        setOffline(!!r.data.offline);
        setList(r.data.notes);
        setTotal(r.data.count);
      })
      .catch(() => setList([]));
  }, []);

  const left = copy.maxLength - text.length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 2) return setErr('Write at least a couple of characters.');
    setSending(true);
    setErr(null);
    try {
      const r = await timedFetch<{ note?: Note; error?: string }>('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, name, website: hp }),
      });
      if (r.status >= 400 || !r.data.note) throw new Error(r.data.error || 'Could not post the note.');
      const note = r.data.note;
      setList((l) => [note, ...(l ?? [])]);
      setTotal((t) => t + 1);
      setText('');
      toast(`Pinned note #${pad(note.id)}`);
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="notes" className="section" aria-labelledby="notes-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHead id="notes" heading={copy.heading} sub={copy.sub} />

        <AskBot />

        <form className="composer" onSubmit={submit} data-reveal noValidate>
          <div className="composer__head mono">
            <span>#{pad(total + 1)} draft</span>
            <span className={left < 20 ? 'warn' : undefined} aria-live="polite">
              {left} / {copy.maxLength}
            </span>
          </div>
          <label htmlFor="note-text" className="sr-only">
            Your note
          </label>
          <textarea
            id="note-text"
            value={text}
            maxLength={copy.maxLength}
            onChange={(e) => {
              setText(e.target.value);
              setErr(null);
            }}
            placeholder={copy.placeholder}
            rows={4}
            aria-invalid={!!err}
            aria-describedby={err ? 'note-err' : undefined}
          />
          <div className="hp" aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
            </label>
          </div>
          <div className="composer__foot">
            <label className="composer__name mono">
              <span>— signed</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="anonymous"
                aria-label="Your name (optional)"
              />
            </label>
            <button type="submit" className="btn btn--primary btn--sm" disabled={sending}>
              {sending ? 'Pinning…' : 'Pin it →'}
            </button>
          </div>
          {err && (
            <p id="note-err" className="form-err mono" role="alert">
              {err}
            </p>
          )}
        </form>

        <ul className="wall" aria-label="Notes wall" aria-busy={list === null}>
          {list === null && <li className="wall__empty mono">loading the wall…</li>}
          {list?.length === 0 && (
            <li className="wall__empty mono">
              {offline ? 'The notes wall is not connected yet. Check back soon.' : 'The wall is empty. Be the first.'}
            </li>
          )}
          {list?.map((n) => (
            <li key={n.id} className="sticky" style={{ '--rot': `${n.rotation}deg` } as React.CSSProperties}>
              <span className="sticky__pin" aria-hidden="true" />
              <p className="sticky__text">{n.text}</p>
              <p className="sticky__meta mono">
                #{pad(n.id)} · {n.name} ·{' '}
                <time dateTime={n.createdAt}>{new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</time>
              </p>
            </li>
          ))}
        </ul>

        <p className="footnote mono">
          {copy.footnote.replace('email me.', '')}
          <a href={`mailto:${profile.email}?subject=Note%20removal`}>email me</a>.
        </p>
      </div>
    </section>
  );
}
