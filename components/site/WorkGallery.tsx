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
      <p className="page-intro">A few things I&apos;ve built — web apps, bots and computer-vision experiments. Drag the row sideways, hover a card to flip it, and tap an icon to see the code or the live version.</p>
      <section className="work-gallery" aria-label="Projects">
        <ul className="work-track" ref={trackRef} tabIndex={0} aria-label="Project cards — drag or use arrow keys">
          {projects.map((project, i) => (
            <li className="flip-card" key={project.title}>
              <div className="flip-card-inner">
                <article className="flip-face panel flip-front">
                  <p className="eyebrow">{String(i + 1).padStart(2, '0')} / Project</p>
                  <div>
                    <h2 className="flip-front__title">{project.title}</h2>
                    <p className="flip-front__tags">{project.tags.join(' · ')}</p>
                  </div>
                </article>
                <article className="flip-face panel flip-back">
                  <h3 className="flip-back__title">{project.title}</h3>
                  <p className="flip-back__desc">{project.description}</p>
                  <dl className="flip-back__meta">
                    <dt className="eyebrow">Language</dt>
                    <dd>{project.language}</dd>
                  </dl>
                  <div className="flip-back__links">
                    {project.live ? (
                      <a className="pill pill--small" href={project.live} target="_blank" rel="noopener noreferrer">
                        Live <LinkIcon size={14} />
                      </a>
                    ) : null}
                    {project.github ? (
                      <a className="pill pill--icon" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source on GitHub`}>
                        <GithubIcon size={18} />
                      </a>
                    ) : null}
                  </div>
                </article>
              </div>
            </li>
          ))}
        </ul>
        <p className="font-script work-more">more things coming soon..</p>
      </section>
    </>
  );
}
