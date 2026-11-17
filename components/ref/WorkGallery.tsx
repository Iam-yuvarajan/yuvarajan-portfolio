'use client';

import { useEffect, useRef } from 'react';
import { projects } from '@/data/site';
import { CursorGlow, GhostLabel, SocialRail } from './Chrome';
import { GithubIcon, YinYangIcon } from './Icons';
import PageChrome from './PageChrome';
import ParticleField from './ParticleField';

export default function WorkGallery() {
  const trackRef = useRef<HTMLUListElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let down = false;
    let startX = 0;
    let startScroll = 0;

    const pos = (e: PointerEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length) return e.touches[0].pageX;
      return (e as PointerEvent).pageX;
    };
    const begin = (e: PointerEvent | TouchEvent) => {
      down = true;
      track.classList.add('is-dragging');
      startX = pos(e);
      startScroll = track.scrollLeft;
    };
    const end = () => {
      down = false;
      track.classList.remove('is-dragging');
    };
    const move = (e: PointerEvent | TouchEvent) => {
      if (!down) return;
      e.preventDefault();
      track.scrollLeft = startScroll - 2 * (pos(e) - startX);
      if (anchorRef.current) anchorRef.current.style.transform = `rotate(${track.scrollLeft / 3}deg)`;
    };
    const keys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') track.scrollBy({ left: 380, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -380, behavior: 'smooth' });
    };

    track.addEventListener('pointerdown', begin as EventListener);
    window.addEventListener('pointerup', end);
    track.addEventListener('pointermove', move as EventListener);
    track.addEventListener('touchstart', begin as EventListener, { passive: true });
    track.addEventListener('touchend', end);
    track.addEventListener('touchmove', move as EventListener, { passive: false });
    track.addEventListener('keydown', keys as EventListener);

    return () => {
      track.removeEventListener('pointerdown', begin as EventListener);
      window.removeEventListener('pointerup', end);
      track.removeEventListener('pointermove', move as EventListener);
      track.removeEventListener('touchstart', begin as EventListener);
      track.removeEventListener('touchend', end);
      track.removeEventListener('touchmove', move as EventListener, { capture: false });
      track.removeEventListener('keydown', keys as EventListener);
    };
  }, []);

  return (
    <main className="page page-work">
      <h1 className="sr-only">Projects by Yuvarajan J</h1>
      <PageChrome dark />
      <SocialRail dark />
      <ParticleField theme="dark" />
      <GhostLabel text="WORK" className="ghost-work" />
      <GhostLabel text="Swipe.." className="ghost-swipe" />

      <ul className="work-track" ref={trackRef} tabIndex={0} aria-label="Project cards — drag or use arrow keys">
        {projects.map((project) => (
          <li className="work-item" key={project.id}>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-face flip-front">
                  <div className="work-surface">
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                  </div>
                </div>
                <div className="flip-face flip-back">
                  <div className="work-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.image} alt={`${project.title} artwork`} />
                    <div className="work-tags">
                      {project.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                    </div>
                    <div className="work-links">
                      {(project.demo || project.source) ? (
                        <a className="work-visit" href={project.demo || project.source} target="_blank" rel="noopener noreferrer">
                          Visit
                        </a>
                      ) : <span />}
                      {project.source ? (
                        <a href={project.source} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code`}>
                          <GithubIcon size={28} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
        <li className="work-item work-end" aria-hidden="true">
          <div className="work-surface work-end-surface">
            <p>More builds are on the way.</p>
            <span>↞ drag back</span>
          </div>
        </li>
      </ul>

      <div className="work-anchor" ref={anchorRef} aria-hidden="true">
        <YinYangIcon size={80} />
      </div>
      <CursorGlow />
    </main>
  );
}
