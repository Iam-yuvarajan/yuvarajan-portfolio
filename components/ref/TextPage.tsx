import Link from 'next/link';
import type { ReactNode } from 'react';
import { nav, profile, type NavLink } from '@/data/site';
import { CursorGlow, GhostLabel, Reveal, ScrollChain, SocialRail } from './Chrome';
import PageChrome from './PageChrome';
import ParticleField from './ParticleField';

export default function TextPage({
  theme = 'dark',
  bigTitle,
  heading,
  related,
  chain = false,
  children,
}: {
  theme?: 'light' | 'dark';
  bigTitle: string;
  heading: string;
  related?: NavLink[];
  chain?: boolean;
  children: ReactNode;
}) {
  const links = related ?? nav.filter((n) => n.to !== '/contact');

  return (
    <main className={`page page-text theme-${theme}`}>
      <PageChrome dark={theme === 'dark'} />
      <SocialRail dark={theme === 'dark'} />
      <ParticleField theme={theme} />
      <h1 className="sr-only">{heading}</h1>
      <GhostLabel text={bigTitle} className="ghost-text" />
      <Reveal className="text-wrap">
        <article className="text-article">
          {children}
          <nav className="more-nav" aria-label="Related pages">
            <span>More</span>
            <ul>
              {links.map((link) => (
                <li key={link.to}>
                  <Link href={link.to}>{link.label}</Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${profile.email}`}>Say hi..</a>
              </li>
            </ul>
          </nav>
        </article>
      </Reveal>
      {chain && <ScrollChain links={5} />}
      <CursorGlow />
    </main>
  );
}
