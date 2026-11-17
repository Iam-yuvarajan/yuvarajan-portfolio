'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { contactInfo, person, socials } from '@/data/portfolio';
import { ArrowLeftIcon, GithubIcon, LinkedinIcon } from '@/components/ref/Icons';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="home-social-icon">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LeetcodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="home-social-icon">
      <path d="M13.48 0a1.38 1.38 0 0 0-.96.44L7.12 6.23l-3.86 4.12a5.3 5.3 0 0 0-1.2 2.11 5.6 5.6 0 0 0-.06 2.87c.1.36.22.7.4 1.02.32.64.76 1.24 1.3 1.78l4.27 4.2.04.03a5.8 5.8 0 0 0 8.06-.07l2.4-2.4a1.38 1.38 0 0 0-1.96-1.95l-2.4 2.39a3.02 3.02 0 0 1-4.2.04l-4.28-4.2a2.52 2.52 0 0 1-.88-1.79 2.7 2.7 0 0 1 .07-.52c.12-.42.35-.81.68-1.16L9.13 8.12c1.06-1.14 3.2-1.28 4.43-.28l3.5 2.83a1.38 1.38 0 0 0 1.73-2.15l-3.5-2.83c-.8-.65-1.77-1.04-2.77-1.2l2.02-2.16A1.38 1.38 0 0 0 13.48 0Zm-2.87 12.82a1.38 1.38 0 0 0 0 2.76h9.18a1.38 1.38 0 0 0 0-2.76Z" />
    </svg>
  );
}

/** Distinctive Quantum Core emblem featuring Yuvarajan's YJ monogram and orbital rings */
function QuantumCoreIcon({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="quantum-core-svg">
      <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.4" className="core-orbit-dash" />
      <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="2.5" opacity="0.8" />
      <path
        d="M100 18 A82 82 0 0 1 100 182 A41 41 0 0 1 100 100 A41 41 0 0 0 100 18 Z"
        fill="currentColor"
        className="core-yin"
      />
      <circle cx="100" cy="59" r="10" fill="var(--core-dot-top, #fcf6f4)" className="core-dot-top" />
      <circle cx="100" cy="141" r="10" fill="var(--core-dot-bot, #000000)" className="core-dot-bot" />
      <circle cx="100" cy="100" r="26" fill="currentColor" stroke="var(--core-dot-top, #fcf6f4)" strokeWidth="2.5" />
      <text x="100" y="106" textAnchor="middle" fill="var(--core-dot-top, #fcf6f4)" fontFamily="var(--font-display)" fontSize="15" fontWeight="700" letterSpacing="-0.02em">
        YJ
      </text>
    </svg>
  );
}

export default function HomeExperience({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  useEffect(() => {
    document.body.dataset.page = 'home';
    document.body.dataset.homeOpen = open ? 'true' : 'false';

    return () => {
      delete document.body.dataset.page;
      delete document.body.dataset.homeOpen;
    };
  }, [open]);

  return (
    <div className="home-container">
      {/* Dark curtain for left 50% split screen */}
      <div className={`home-curtain ${open ? 'is-open' : ''}`} aria-hidden="true" />

      {/* Top Left Branding */}
      <div className={`home-brand-wrap ${open ? 'is-open' : ''}`}>
        <Link href="/" className="home-logo" aria-label={`${person.name} Home`}>
          {person.initials}
        </Link>
        <span className="home-brand-status">
          <span className="pulse-dot" /> Open to Roles
        </span>
      </div>

      {/* Top Center Back Button (visible when open to close modal) */}
      {open && (
        <button
          type="button"
          className="home-back-button"
          onClick={() => setOpen(false)}
          aria-label="Close introduction"
        >
          <ArrowLeftIcon size={22} />
        </button>
      )}

      {/* Top Right "Let's connect" */}
      <a className="home-sayhi" href={`mailto:${contactInfo.email}`}>
        Say hello ↗
      </a>

      {/* Left Vertical Rail */}
      <div className={`home-rail-left ${open ? 'is-open' : ''}`}>
        <a className="home-rail-link home-resume-link" href={contactInfo.resume} target="_blank" rel="noopener noreferrer">
          Resume
        </a>
        <Link className="home-rail-link home-projects-link" href="/work">
          Projects
        </Link>
        <div className="home-socials">
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <LinkedinIcon size={20} />
          </a>
          <a href={socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <GithubIcon size={20} />
          </a>
          <a href={socials.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode">
            <LeetcodeIcon />
          </a>
          <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <span className="home-socials-line" />
        </div>
      </div>

      {/* Right Vertical Rail */}
      <div className="home-rail-right">
        <Link className="home-rail-link home-feats-link" href="/experience">
          Journey
        </Link>
      </div>

      {/* Bottom Center Navigation */}
      <div className="home-bottom">
        <Link className={`home-bottom-link home-about-link ${open ? 'is-open' : ''}`} href="/about">
          About
        </Link>
        <Link className="home-bottom-link home-skills-link" href="/skills">
          Skills
        </Link>
      </div>

      {/* Center Intro Card with Architectural Corner Accents */}
      {open && (
        <div className="home-intro-card" role="region" aria-label="Introduction">
          <span className="card-bracket bracket-tl" />
          <span className="card-bracket bracket-tr" />
          <span className="card-bracket bracket-bl" />
          <span className="card-bracket bracket-br" />

          <div className="home-intro-sub home-intro-copy">
            <div className="home-intro-meta-pill">
              <span className="pulse-dot-indigo" /> SIH 2026 Top 40 Finalist
            </div>
            <h1 className="home-intro-greeting">Hi,</h1>
            <h2 className="home-intro-name">I&apos;m {person.name}.</h2>
            <p className="home-intro-role-lead">AI Engineer · ECE Student · Builder</p>
            <p className="home-intro-desc">
              Building AI companions, computer-vision defense, and multilingual voice agents.
              Passionate about shipping end-to-end intelligent systems.
            </p>
            <div className="home-intro-actions">
              <Link href="/work" className="home-intro-btn home-intro-btn--primary">
                View 4 Main Projects →
              </Link>
              <Link href="/about" className="home-intro-btn home-intro-btn--secondary">
                About Me
              </Link>
            </div>
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

      {/* Center Signature Quantum Core Button */}
      <button
        type="button"
        className={`home-yinyang-button ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Close introduction' : 'Explore introduction'}
      >
        <div className="yinyang-spin">
          <QuantumCoreIcon size={open ? 96 : 190} />
        </div>
        {!open && <span className="yinyang-click-text">explore portfolio</span>}
      </button>
    </div>
  );
}
