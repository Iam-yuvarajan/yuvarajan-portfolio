'use client';

import { work } from '@/data/content';
import type { ProjectsPayload } from '@/lib/data';
import { prefersReducedMotion, useApi } from '@/lib/client';
import { Rich } from '@/lib/text';
import SectionHead from './SectionHead';
import Cover from './Cover';

function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse' || prefersReducedMotion()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-3px)`;
}
const untilt = (e: React.PointerEvent<HTMLElement>) => (e.currentTarget.style.transform = '');

export default function Work({ initial }: { initial: ProjectsPayload }) {
  const { data, ms, status } = useApi('/api/projects', initial);

  return (
    <section id="work" className="section" aria-labelledby="work-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHead id="work" heading={work.heading} sub={work.sub} />

        <div className="req mono" data-reveal aria-label="Live request to the projects API">
          <div className="req__line">
            <span className="req__verb">GET</span> /api/projects{' '}
            <span className={status && status >= 400 ? 'req__err' : 'req__ok'}>
              {status === null ? '··· pending' : status === 0 ? 'offline' : `${status} OK`}
            </span>{' '}
            · {ms === null ? '…' : `${ms}ms`}
          </div>
          <div className="req__json">
            {'{ '}
            <span className="tok-k">&quot;count&quot;</span>: <span className="tok-n">{data.count}</span>,{' '}
            <span className="tok-k">&quot;public&quot;</span>: <span className="tok-n">{data.projects.filter((p) => p.links.length).length}</span>
            {' }'}
          </div>
          <div className="req__cap">{work.caption}</div>
        </div>

        <ul className="projects">
          {data.projects.map((p) => (
            <li key={p.id} data-reveal>
              <article className="card" onPointerMove={tilt} onPointerLeave={untilt} aria-labelledby={`proj-${p.id}`}>
                <div className="card__cover">
                  <Cover seed={p.title} />
                  <span className="card__num mono">0{p.id}</span>
                </div>
                <div className="card__body">
                  <div className="card__top mono">
                    <span className="card__domain">
                      <Rich text={p.domain} />
                    </span>
                    <span className={`badge${p.links.length ? ' badge--public' : ''}`}>
                      {p.links.some((l) => l.kind === 'live')
                        ? work.badges.live
                        : p.links.length
                          ? work.badges.source
                          : work.badges.private}
                    </span>
                  </div>
                  <h3 id={`proj-${p.id}`} className="card__title">
                    {p.title}
                  </h3>
                  <p className="card__desc">
                    <Rich text={p.desc} />
                  </p>
                  <p className="card__outcome mono">
                    <span aria-hidden="true">▲ </span>
                    <Rich text={p.outcome} />
                  </p>
                  <ul className="chips" aria-label="Tech">
                    {p.tech.map((t) => (
                      <li key={t} className="chip mono">
                        <Rich text={t} />
                      </li>
                    ))}
                  </ul>
                  <div className="card__actions mono">
                    {p.links.map((l) => (
                      <a
                        key={l.href}
                        className="card__link"
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${l.label}: ${p.title} (opens in a new tab)`}
                      >
                        {l.label} ↗
                      </a>
                    ))}
                    <a className="card__ask" href="#contact">
                      {work.ask}
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
