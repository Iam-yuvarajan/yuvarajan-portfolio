'use client';

import { useEffect, useRef, useState } from 'react';
import { profile, shell as copy, worlds } from '@/data/content';
import type { ExperiencePayload, StatsPayload } from '@/lib/data';
import { shortHash, timedFetch } from '@/lib/client';
import { Rich } from '@/lib/text';
import SectionHead from './SectionHead';

type Line = { kind: 'in' | 'out' | 'err' | 'ok' | 'dim' | 'link'; text: string; cwd?: string; href?: string };

const ROUTES = ['/api/stats', '/api/projects', '/api/experience', '/api/skills', '/api/notes'];
const COMMANDS = ['help', 'ls', 'cd', 'cat', 'curl', 'git', 'whoami', 'clear', 'sudo'];
const COMPLETIONS = [
  'help', 'ls', 'clear', 'whoami', 'git log', 'cat impact.json', 'cat links', 'cat resume', 'sudo hire yuvarajan',
  ...worlds.map((w) => `cd ${w.path}`), 'cd ~',
  ...ROUTES.map((r) => `curl ${r}`),
];

const LS: Record<string, string[]> = {
  '~': worlds.map((w) => `${w.id}/`),
  '~/client': ['work/'],
  '~/server': ['experience/', 'stack/', 'shell/', 'impact.json', 'links', 'resume'],
  '~/agents': ['notes/'],
  '~/whoami': ['contact/', 'links', 'resume'],
};

const json = (v: unknown) => JSON.stringify(v, null, 2);

function Prompt({ at }: { at: string }) {
  return (
    <span className="sh__prompt">
      guest@{profile.host}:{at}$
    </span>
  );
}

export default function Shell() {
  const [cwd, setCwd] = useState('~/server');
  const [lines, setLines] = useState<Line[]>([
    { kind: 'dim', text: 'Last login: just now on ttys001' },
    { kind: 'dim', text: "Type 'help' to see what this shell can do." },
  ]);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const hist = useRef<string[]>([]);
  const hIdx = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = (...ls: Line[]) => setLines((prev) => [...prev, ...ls].slice(-400));
  const out = (text: string, kind: Line['kind'] = 'out') => print({ kind, text });

  async function api<T>(route: string) {
    const r = await timedFetch<T>(route);
    out(`HTTP ${r.status} · ${route} · ${r.ms}ms`, r.status < 400 ? 'ok' : 'err');
    return r.data;
  }

  async function run(raw: string) {
    const cmd = raw.trim();
    print({ kind: 'in', text: cmd, cwd });
    if (!cmd) return;
    hist.current.push(cmd);
    hIdx.current = -1;
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ');

    try {
      switch (name) {
        case 'help':
          out(
            [
              'available commands:',
              '  help                 this list',
              '  ls                   list the current world',
              '  cd <world>           ~/client ~/server ~/agents ~/whoami',
              '  cat impact.json      headline numbers (GET /api/experience)',
              '  cat links            where to find me (GET /api/stats)',
              '  cat resume           download the resume (PDF)',
              '  curl <route>         ' + ROUTES.join(' '),
              '  git log              the journey, as commits',
              '  whoami               who runs this place',
              '  sudo hire yuvarajan  you know you want to',
              '  clear                wipe the screen',
              'tip: ↑/↓ for history, tab to complete',
            ].join('\n'),
          );
          break;
        case 'ls':
          out((LS[cwd] ?? []).join('   ') || '(empty)');
          break;
        case 'cd': {
          const t = arg.replace(/\/$/, '');
          if (!t || t === '~') return setCwd('~');
          if (t === '..') return setCwd(cwd === '~' ? '~' : '~');
          const target = t.startsWith('~/') ? t : `~/${t}`;
          if (LS[target]) setCwd(target);
          else out(`cd: no such world: ${arg}`, 'err');
          break;
        }
        case 'cat':
          if (arg === 'impact.json') {
            const d = await api<ExperiencePayload>('/api/experience');
            out(json(d.metrics.map((m) => ({ value: m.value, label: m.label, source: m.source }))));
          } else if (arg === 'links') {
            const d = await api<StatsPayload>('/api/stats');
            const l = d.links as Record<string, string>;
            out(
              ['leetcode', 'huggingface', 'linkedin', 'github']
                .filter((k) => l[k])
                .map((k) => `${k.padEnd(12)} ${l[k]}`)
                .join('\n'),
            );
          } else if (arg === 'resume') {
            const t0 = performance.now();
            const res = await fetch(profile.resume.href, { method: 'HEAD', cache: 'no-store' });
            const ms = Math.round(performance.now() - t0);
            out(`HTTP ${res.status} · ${profile.resume.href} · ${ms}ms`, res.ok ? 'ok' : 'err');
            if (res.ok) {
              const kb = Math.round(Number(res.headers.get('content-length') || 0) / 1024);
              out(`${profile.resume.file}  application/pdf${kb ? `  ${kb} KB` : ''}`);
              print({ kind: 'link', text: `↓ download ${profile.resume.file}`, href: profile.resume.href });
            }
          } else out(`cat: ${arg || '<file>'}: no such file. try impact.json, links or resume`, 'err');
          break;
        case 'curl': {
          const route = args.find((a) => a.startsWith('/')) ?? '';
          if (!ROUTES.includes(route)) {
            out(`curl: unknown route ${route || '(none)'}. try ${ROUTES.join(', ')}`, 'err');
            break;
          }
          const d = await api<unknown>(route);
          const text = json(d);
          const capped = text.split('\n');
          out(capped.length > 60 ? capped.slice(0, 60).join('\n') + `\n… ${capped.length - 60} more lines` : text);
          break;
        }
        case 'git':
          if (args[0] !== 'log') {
            out(`git: '${arg}' is not available here. try 'git log'`, 'err');
            break;
          } else {
            const d = await api<ExperiencePayload>('/api/experience');
            const commits = [...d.stages].reverse(); // stages are listed oldest first
            out(
              commits
                .map((s, i) =>
                  [
                    `commit ${shortHash(s.id + s.title)}${i === 0 ? '  (HEAD → main)' : ''}`,
                    `Author: ${profile.name}`,
                    `Date:   ${s.range}`,
                    '',
                    `    ${s.title}, ${s.org}`,
                    ...s.bullets.map((b) => `    + ${b}`),
                  ].join('\n'),
                )
                .join('\n\n'),
            );
          }
          break;
        case 'whoami': {
          const d = await api<StatsPayload>('/api/stats');
          out(`${d.name}\n${d.role}\n${d.availability} · ${d.timezone} · ${d.base}`);
          break;
        }
        case 'clear':
          setLines([]);
          break;
        case 'sudo':
          if (arg.toLowerCase() === 'hire yuvarajan') {
            copy.hireMessage.forEach((m, i) => out(m, i === copy.hireMessage.length - 1 ? 'ok' : 'out'));
          } else out(`sudo: '${arg}' is above your clearance. try 'sudo hire yuvarajan'`, 'err');
          break;
        default:
          out(`zsh: command not found: ${name}. type 'help' for the list.`, 'err');
      }
    } catch {
      out('network error: the API did not answer. try again in a moment.', 'err');
    }
  }

  const submit = async (cmd: string) => {
    setValue('');
    setBusy(true);
    await run(cmd);
    setBusy(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const h = hist.current;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!h.length) return;
      hIdx.current = hIdx.current < 0 ? h.length - 1 : Math.max(0, hIdx.current - 1);
      setValue(h[hIdx.current]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx.current < 0) return;
      hIdx.current += 1;
      if (hIdx.current >= h.length) {
        hIdx.current = -1;
        setValue('');
      } else setValue(h[hIdx.current]);
    } else if (e.key === 'Tab') {
      if (!value) return; // let Tab move focus when the line is empty
      e.preventDefault();
      const matches = COMPLETIONS.filter((c) => c.startsWith(value));
      if (matches.length === 1) setValue(matches[0]);
      else if (matches.length > 1) {
        let p = matches[0];
        for (const m of matches) while (!m.startsWith(p)) p = p.slice(0, -1);
        if (p.length > value.length) setValue(p);
        else out(matches.join('   '), 'dim');
      } else {
        const first = value.split(' ')[0];
        if (!COMMANDS.includes(first)) out(`no completion for '${value}'`, 'dim');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section id="shell" className="section section--alt" aria-labelledby="shell-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHead id="shell" heading={copy.heading} sub={copy.sub} />

        <div className="term" data-reveal>
          <div className="term__bar">
            <span className="term__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="term__title mono">
              guest@{profile.host}: {cwd} — zsh
            </span>
          </div>
          <div
            className="term__screen mono"
            ref={screen}
            onClick={() => window.getSelection()?.toString() || input.current?.focus()}
          >
            <div role="log" aria-live="polite" aria-label="Shell output">
              {lines.map((l, i) => (
                <div key={i} className={`sh__line sh__${l.kind}`}>
                  {l.kind === 'in' ? (
                    <>
                      <Prompt at={l.cwd ?? cwd} /> {l.text}
                    </>
                  ) : l.kind === 'link' && l.href ? (
                    <a className="sh__a" href={l.href} download={profile.resume.file}>
                      {l.text}
                    </a>
                  ) : (
                    <Rich text={l.text} />
                  )}
                </div>
              ))}
            </div>
            <form
              className="sh__form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!busy) submit(value);
              }}
            >
              <label htmlFor="sh-input">
                <Prompt at={cwd} />
              </label>
              <input
                id="sh-input"
                ref={input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Shell command"
                aria-busy={busy}
              />
            </form>
          </div>
        </div>

        <div className="tries" data-reveal>
          <span className="mono">Try</span>
          {copy.tries.map((t) => (
            <button
              key={t}
              type="button"
              className="chip chip--btn mono"
              onClick={() => {
                if (!busy) submit(t);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
