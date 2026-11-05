'use client';

import { useMemo, useState } from 'react';
import { stack } from '@/data/content';
import type { SkillsPayload } from '@/lib/data';
import { useApi } from '@/lib/client';
import { Rich } from '@/lib/text';
import SectionHead from './SectionHead';

type Skill = SkillsPayload['skills'][number];

export default function Stack({ initial }: { initial: SkillsPayload }) {
  const { data } = useApi('/api/skills', initial);
  const [cat, setCat] = useState<string>('All');
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState<Skill | null>(null);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.skills.filter(
      (s) =>
        (cat === 'All' || s.category === cat) &&
        (!needle || `${s.name} ${s.category} ${s.note}`.toLowerCase().includes(needle)),
    );
  }, [data.skills, cat, q]);

  const cats = [{ name: 'All', count: data.total }, ...data.categories.filter((c) => c.count > 0)];
  const tierTitle = (id: string) => data.tiers.find((t) => t.id === id)?.title ?? id;

  return (
    <section id="stack" className="section" aria-labelledby="stack-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHead id="stack" heading={stack.heading} sub={stack.sub} />

        <div className="stack-tools" data-reveal>
          <div className="pills" role="group" aria-label="Filter by category">
            {cats.map((c) => (
              <button
                key={c.name}
                type="button"
                className={`pill-btn mono${cat === c.name ? ' is-active' : ''}`}
                aria-pressed={cat === c.name}
                onClick={() => setCat(c.name)}
              >
                {c.name} <span className="pill-btn__n">{c.count}</span>
              </button>
            ))}
          </div>
          <label className="search mono">
            <span className="sr-only">Search skills</span>
            <span aria-hidden="true">/</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="search skills" type="search" />
            <span className="search__count" aria-live="polite">
              {shown.length}/{data.total}
            </span>
          </label>
        </div>

        <div className="tiers" data-reveal>
          {data.tiers.map((t) => {
            const all = data.skills.filter((s) => s.tier === t.id);
            if (all.length === 0) return null;
            const list = shown.filter((s) => s.tier === t.id);
            return (
              <div key={t.id} className="tier">
                <div className="tier__head">
                  <h3 className="tier__title">{t.title}</h3>
                  <span className="tier__count mono">{list.length}</span>
                </div>
                <p className="tier__desc">{t.desc}</p>
                <ul className="chips chips--lg">
                  {list.length === 0 && <li className="tier__empty mono">no match</li>}
                  {list.map((s) => (
                    <li key={s.name}>
                      <button
                        type="button"
                        className={`chip chip--btn mono${focus?.name === s.name ? ' is-active' : ''}`}
                        onMouseEnter={() => setFocus(s)}
                        onFocus={() => setFocus(s)}
                        onClick={() => setFocus(s)}
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="readout mono" aria-live="polite" data-reveal>
          <div className="readout__cmd">
            $ grep -r &quot;{focus?.name ?? '…'}&quot; ~/projects
          </div>
          {focus ? (
            <div className="readout__out">
              <span className="readout__name">{focus.name}</span>
              <span>· {focus.category}</span>
              <span>· {tierTitle(focus.tier)}</span>
              <div>
                → <Rich text={focus.note} />
              </div>
            </div>
          ) : (
            <div className="readout__out readout__idle">hover or tap a skill to grep for it</div>
          )}
        </div>
      </div>
    </section>
  );
}
