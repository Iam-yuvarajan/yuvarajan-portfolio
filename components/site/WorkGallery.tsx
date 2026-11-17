'use client';

import { useEffect, useRef } from 'react';
import { projects } from '@/data/portfolio';
import { GithubIcon, LinkIcon } from '@/components/ref/Icons';

export default function WorkGallery() {
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;

    const begin = (clientX: number) => {
      down = true;
      track.classList.add('is-dragging');
      startX = clientX;
      startScroll = track.scrollLeft;
    };
    const end = () => {
      down = false;
      track.classList.remove('is-dragging');
    };
    const move = (clientX: number, e: Event) => {
      if (!down) return;
      e.preventDefault();
      track.scrollLeft = startScroll - (clientX - startX) * 1.4;
    };
    const pointerDown = (e: PointerEvent) => begin(e.clientX);
    const pointerMove = (e: PointerEvent) => move(e.clientX, e);
    const touchStart = (e: TouchEvent) => begin(e.touches[0].clientX);
    const touchMove = (e: TouchEvent) => move(e.touches[0].clientX, e);
    const keys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: 348, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -348, behavior: 'smooth' });
    };

    track.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', end);
    track.addEventListener('pointermove', pointerMove);
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchend', end);
    track.addEventListener('touchmove', touchMove, { passive: false });
    track.addEventListener('keydown', keys);
    return () => {
      track.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', end);
      track.removeEventListener('pointermove', pointerMove);
      track.removeEventListener('touchstart', touchStart);
      track.removeEventListener('touchend', end);
      track.removeEventListener('touchmove', touchMove);
      track.removeEventListener('keydown', keys);
    };
  }, []);

  return (
    <>
      <p className="page-intro">Four builds I&apos;m proudest of from <a href="https://jyuvarajan.vercel.app/#work" target="_blank" rel="noopener noreferrer">my main projects</a> — AI companions, retail agents, computer-vision defense, and supply pipelines. Drag the row sideways, hover a card to flip it, and explore the live demos or code.</p>
      <section className="work-gallery" aria-label="Projects">
        <ul className="work-track" ref={trackRef} tabIndex={0} aria-label="Project cards — drag or use arrow keys">
          {projects.map((project, i) => (
            <li className="flip-card" key={project.title}>
              <div className="flip-card-inner">
                <article className="flip-face panel flip-front">
                  <div className="flip-front__top">
                    <p className="eyebrow">{String(i + 1).padStart(2, '0')} / {project.domain}</p>
                    {project.status === 'public' && project.live ? (
                      <span className="project-status-badge status-live">Live</span>
                    ) : project.status === 'public' ? (
                      <span className="project-status-badge status-source">Source</span>
                    ) : (
                      <span className="project-status-badge status-private">Private</span>
                    )}
                  </div>
                  <div>
                    <h2 className="flip-front__title">{project.title}</h2>
                    <p className="flip-front__outcome">{project.outcome}</p>
                    <p className="flip-front__tags">{project.tags.join(' · ')}</p>
                  </div>
                </article>
                <article className="flip-face panel flip-back">
                  <div>
                    <div className="flip-back__header">
                      <h3 className="flip-back__title">{project.title}</h3>
                      <span className="eyebrow flip-back__domain">{project.domain}</span>
                    </div>
                    <p className="flip-back__desc">{project.description}</p>
                  </div>
                  <dl className="flip-back__meta">
                    <div>
                      <dt className="eyebrow">Outcome</dt>
                      <dd className="flip-back__outcome-text">{project.outcome}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow">Stack</dt>
                      <dd>{project.tags.slice(0, 3).join(', ')}</dd>
                    </div>
                  </dl>
                  <div className="flip-back__links">
                    {project.live ? (
                      <a className="pill pill--small pill--accent" href={project.live} target="_blank" rel="noopener noreferrer">
                        Live Demo <LinkIcon size={14} />
                      </a>
                    ) : null}
                    {project.github ? (
                      <a className="pill pill--icon" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source on GitHub`}>
                        <GithubIcon size={18} />
                      </a>
                    ) : null}
                    {project.status === 'private' ? (
                      <span className="pill pill--small pill--ghost">Walkthrough on request</span>
                    ) : null}
                  </div>
                </article>
              </div>
            </li>
          ))}
        </ul>
        <p className="font-script work-more">more AI projects coming soon..</p>
      </section>
    </>
  );
}
