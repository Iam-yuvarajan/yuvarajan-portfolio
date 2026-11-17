'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { profile } from '@/data/site';
import { CursorGlow, QuickNav, SiteLogo, SocialRail } from './Chrome';
import { YinYangIcon } from './Icons';
import ParticleField from './ParticleField';

export default function HomeExperience() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // A fresh visit always starts on the original, unopened landing.
    document.documentElement.removeAttribute('data-theme');
  }, []);

  return (
    <main className="page page-home">
      <h1 className="sr-only">Yuvarajan J — AI Engineer, builder and ECE student</h1>
      <SiteLogo home />
      <SocialRail />
      <ParticleField theme="light" />
      <div className={`home-curtain ${open ? 'is-open' : ''}`} aria-hidden="true" />

      <nav className="home-links" aria-label="Main navigation">
        <a className="home-link home-sayhi" href={`mailto:${profile.email}`}>
          <h3>Say hi..</h3>
        </a>
        <Link className="home-link home-feats" href="/blog" onClick={() => setOpen(false)}>
          <h2>Feats</h2>
        </Link>
        <Link className="home-link home-projects" href="/work" onClick={() => setOpen(false)}>
          <h2>Projects</h2>
        </Link>
        <a className="home-link home-resume" href={profile.resume} target="_blank" rel="noopener noreferrer">
          <h2>Resume</h2>
        </a>
        <div className="home-bottom">
          <Link href="/about" onClick={() => setOpen(false)}><h2>About</h2></Link>
          <Link href="/skills" onClick={() => setOpen(false)}><h2>My Skills</h2></Link>
        </div>
      </nav>

      {open && (
        <div className="intro-card" role="region" aria-label="Introduction">
          <div className="intro-copy">
            <h1>Hi,</h1>
            <h2>I&apos;m Yuvarajan J.</h2>
            <p>
              AI Engineer • ECE Student • Builder. I make AI-powered tools and web apps,
              and I was a top 40 finalist in Smart India Hackathon 2026.
            </p>
          </div>
          <div className="intro-portrait">
            {/* Replace this file with your own image at public/media/intro.png */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.introImage} alt="Yuvarajan J" />
          </div>
        </div>
      )}

      <button
        type="button"
        className={`yin-yang-button ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close introduction' : 'Open introduction'}
      >
        <YinYangIcon size={open ? 120 : 200} />
        <span>{open ? 'close' : 'click here'}</span>
      </button>

      <QuickNav />
      <CursorGlow />
    </main>
  );
}
