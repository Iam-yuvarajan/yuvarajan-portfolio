'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { contactInfo, person, socials } from '@/data/portfolio';
import {
  ArrowLeftIcon,
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  YinYangIcon,
  YoutubeIcon,
} from '@/components/ref/Icons';

export default function HomeExperience({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    document.body.dataset.page = 'home';
    document.body.dataset.homeOpen = open ? 'true' : 'false';

    return () => {
      delete document.body.dataset.page;
      delete document.body.dataset.homeOpen;
    };
  }, [open]);

  return (
    <div className={`home-container ${open ? 'is-open' : ''}`}>
      {/* Dark curtain for left 50% split screen */}
      <div className={`home-curtain ${open ? 'is-open' : ''}`} aria-hidden="true" />

      {/* Top Left Branding */}
      <div className={`home-brand-wrap ${open ? 'is-open' : ''}`}>
        <Link href="/" className="home-logo font-script" aria-label={`${person.name} Home`}>
          {person.initials}
        </Link>
      </div>

      {open && (
        <button
          type="button"
          className="home-back-button"
          onClick={() => setOpen(false)}
          aria-label="Back to home"
        >
          <ArrowLeftIcon size={20} />
        </button>
      )}

      {/* Top Right "Say hi.." in cursive script */}
      <a className="home-sayhi font-script" href={`mailto:${contactInfo.email}`}>
        Say hi..
      </a>

      {/* Left Vertical Rail (Resume & Projects) */}
      <div className={`home-rail-left ${open ? 'is-open' : ''}`}>
        <a className="home-rail-link home-resume-link" href={contactInfo.resume} target="_blank" rel="noopener noreferrer">
          Resume
        </a>
        <Link className="home-rail-link home-projects-link" href="/work">
          Projects
        </Link>
      </div>

      {/* Bottom Left Social Rail (LinkedIn, GitHub, Twitter, Facebook, YouTube) */}
      <div className={`home-socials ${open ? 'is-open' : ''}`}>
        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <LinkedinIcon size={20} />
        </a>
        <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GithubIcon size={20} />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <TwitterIcon size={20} />
        </a>
        <a href={socials.instagram || 'https://facebook.com/'} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FacebookIcon size={20} />
        </a>
        <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <YoutubeIcon size={20} />
        </a>
        <span className="home-socials-line" />
      </div>

      {/* Right Vertical Rail (Feats) */}
      <div className="home-rail-right">
        <Link className="home-rail-link home-feats-link" href="/experience">
          Feats
        </Link>
      </div>

      {/* Bottom Center Links (About & My Skills) */}
      <div className="home-bottom">
        <Link className={`home-bottom-link home-about-link ${open ? 'is-open' : ''}`} href="/about">
          About
        </Link>
        <Link className="home-bottom-link home-skills-link" href="/skills">
          My Skills
        </Link>
      </div>

      {/* Center Intro Card (visible when open) */}
      {open && (
        <div className="home-intro-card" role="region" aria-label="Introduction">
          <div className="home-intro-sub home-intro-copy">
            <h1 className="home-intro-greeting">Hi,</h1>
            <h2 className="home-intro-name">I&apos;m {person.name}.</h2>
            <p className="home-intro-desc">
              Founder · Software Engineer · AI Developer. I build AI Agents, intelligent systems, and agentic workflows.
            </p>
          </div>
          <div className="home-intro-sub home-intro-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/intro.png"
              alt={person.name}
              className="home-intro-pic"
            />
          </div>
        </div>
      )}

      {/* Center Signature Yin-Yang Button */}
      <button
        type="button"
        className={`home-yinyang-button ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Close introduction' : 'Open introduction'}
      >
        <div className="yinyang-spin">
          <YinYangIcon size={open ? 85 : 170} />
        </div>
        {!open && <span className="font-script yinyang-click-text">click here</span>}
      </button>
    </div>
  );
}
