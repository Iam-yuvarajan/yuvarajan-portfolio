'use client';

import { useState } from 'react';
import { journey, languages } from '@/data/content';
import type { ExperiencePayload } from '@/lib/data';
import { shortHash, useApi } from '@/lib/client';
import { Rich } from '@/lib/text';
import SectionHead from './SectionHead';

export default function Journey({ initial }: { initial: ExperiencePayload }) {
  const { data } = useApi('/api/experience', initial);
  const { metrics, stages, education } = data;

  // Most recent stage by end, then start, then position in the list (later = newer).
  const placed = stages.map((s, i) => ({ s, i })).filter(({ s }) => s.chart);
  const mostRecent =
    [...placed].sort(
      (a, b) => b.s.chart!.to - a.s.chart!.to || b.s.chart!.from - a.s.chart!.from || b.i - a.i,
    )[0]?.s ?? stages[0];
  const [sel, setSel] = useState<string>(mostRecent?.id ?? '');
  const active = stages.find((s) => s.id === sel) ?? mostRecent;

  const min = journey.timelineStart;
  const max = journey.timelineEnd;
  const span = Math.max(1, max - min);
  const years = Array.from({ length: span + 1 }, (_, i) => min + i);
  // Each year occupies one slot: a bar from 2020 to 2021 covers both years.
  const slot = 100 / (span + 1);
  const left = (y: number) => `${(Math.min(Math.max(y, min), max) - min) * slot}%`;
  const width = (from: number, to: number) => `${(Math.min(to, max) - Math.max(from, min) + 1) * slot}%`;

  return (
    <section id="experience" className="section section--alt" aria-labelledby="experience-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHead id="experience" heading={journey.heading} sub={journey.sub} />

        <dl className="impact" data-reveal>
          {metrics.map((m) => (
            <div key={m.label} className="impact__item">
              <dd className="impact__value">
                <span data-count={m.value}>{m.value}</span>
              </dd>
              <dt className="impact__label">{m.label}</dt>
              <dd className="impact__src mono">{m.source}</dd>
            </div>
          ))}
        </dl>

        <div className="journey" data-reveal>
          <div className="timeline" role="group" aria-label="Timeline of stages">
            <div className="timeline__grid">
              <div className="timeline__axis mono" aria-hidden="true">
                {years.map((y) => (
                  <span key={y} style={{ left: `calc(${left(y)} + ${slot / 2}%)` }}>
                    {y}
                  </span>
                ))}
              </div>
            </div>
            <ul className="timeline__rows">
              {stages.map((s) => {
                const isActive = s.id === active?.id;
                const c = s.chart;
                const marker = c && c.from === c.to && !c.ongoing;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`trow${isActive ? ' is-active' : ''}`}
                      aria-pressed={isActive}
                      onClick={() => setSel(s.id)}
                    >
                      <span className="trow__label">
                        <Rich text={s.label} />
                      </span>
                      <span className="trow__track" style={{ backgroundSize: `${slot}% 100%` }}>
                        {c ? (
                          marker ? (
                            <span className="marker" style={{ left: `calc(${left(c.from)} + ${slot / 2}%)` }}>
                              <span className="sr-only">{c.from}</span>★
                            </span>
                          ) : (
                            <span className={`bar${c.ongoing ? ' is-ongoing' : ''}`} style={{ left: left(c.from), width: width(c.from, c.to) }}>
                              {c.ongoing && <span className="bar__more mono">present</span>}
                            </span>
                          )
                        ) : (
                          <span className="trow__nodate mono">dates to follow</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {active && (
            <article className="commit" aria-live="polite" aria-labelledby="commit-title">
              <div className="commit__head mono">
                <span>
                  commit <span className="commit__hash">{shortHash(active.id + active.title)}</span>
                </span>
                <span className="commit__ref">HEAD → main</span>
              </div>
              <h3 id="commit-title" className="commit__title">
                <Rich text={active.title} />
              </h3>
              <p className="commit__org mono">
                {active.org} · <Rich text={active.location} /> · <Rich text={active.range} />
              </p>
              <ul className="commit__list mono">
                {active.bullets.map((b) => (
                  <li key={b}>
                    <span className="plus" aria-hidden="true">
                      +
                    </span>{' '}
                    <Rich text={b} />
                  </li>
                ))}
              </ul>
              <p className="commit__hl mono">
                <span aria-hidden="true">▲</span> <Rich text={active.highlight} />
              </p>
              {active.stack.length > 0 && (
                <div className="commit__stack">
                  <span className="mono">Stack</span>
                  <ul className="chips">
                    {active.stack.map((t) => (
                      <li key={t} className="chip mono">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )}
        </div>

        <div className={`edu-grid${languages.length ? '' : ' edu-grid--single'}`} data-reveal>
          <div className="edu">
            <p className="edu__kicker mono">Education</p>
            <h3 className="edu__degree">
              B.E. <Rich text={education.college.branch} />
            </h3>
            <p className="edu__school">
              {education.college.name} · {education.college.place}
            </p>
            <p className="edu__cgpa mono">
              CGPA {education.college.cgpa} · {education.college.years} · graduating {education.college.graduation}
            </p>
            <ol className="edu__mini">
              <li>
                <span className="edu__n mono">01</span>
                <div>
                  <strong>
                    {education.school.name}, {education.school.place}
                  </strong>
                  <span className="mono">
                    10th: {education.school.tenthPercent}% · 12th: {education.school.twelfthPercent}%
                  </span>
                </div>
              </li>
              <li>
                <span className="edu__n mono">02</span>
                <div>
                  <strong>{education.college.name}</strong>
                  <span className="mono">CGPA {education.college.cgpa}</span>
                </div>
              </li>
            </ol>
          </div>
          {languages.length > 0 && (
            <div className="edu">
              <p className="edu__kicker mono">Languages</p>
              <ul className="langs">
                {languages.map((l) => (
                  <li key={l.name}>
                    <strong>{l.name}</strong> <span className="mono">{l.level}</span>
                    <p>{l.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
