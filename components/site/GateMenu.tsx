'use client';

import Link from 'next/link';
import { useState } from 'react';
import { contactInfo, person } from '@/data/portfolio';
import { GateMark } from './Chrome';

const menu = [
  { label: 'Say hi..', href: `mailto:${contactInfo.email}`, external: true, script: true },
  { label: 'Resume', href: contactInfo.resume, external: true, download: true },
  { label: 'Projects', href: '/work' },
  { label: 'Experience', href: '/experience' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Contact', href: '/contact' },
];

export default function GateMenu() {
  const [open, setOpen] = useState(false);

  return (
    <section className="gate">
      <div className="gate__identity">
        <p className="gate__name">{person.name}</p>
        <p className="eyebrow gate__role">{person.role}</p>
        <p className="eyebrow gate__location">{person.location}</p>
      </div>

      {open ? (
        <nav className="gate__menu" aria-label="Main menu">
          {menu.map((item, i) => {
            const inner = (
              <span className={`${item.script ? 'font-script gate__script' : 'gate__display'} gate__label`}>
                {item.label}
                {item.external && !item.script ? ' ↗' : ''}
              </span>
            );
            const style = { animationDelay: `${i * 70}ms` } as React.CSSProperties;
            const className = `gate__item ${i % 2 === 0 ? 'gate__item--left' : 'gate__item--right'}`;

            if (item.external) {
              return (
                <a key={item.label} className={className} style={style} href={item.href} download={item.download ? contactInfo.resumeFile : undefined}>
                  {inner}
                </a>
              );
            }
            return (
              <Link key={item.label} className={className} style={style} href={item.href}>
                {inner}
              </Link>
            );
          })}
        </nav>
      ) : (
        <div className="gate__trigger">
          <button type="button" className="gate__button" onClick={() => setOpen(true)} aria-label="Enter the site">
            <GateMark />
          </button>
          <span className="font-script gate__click">click here</span>
        </div>
      )}

      <p className="eyebrow gate__copyright">© {new Date().getFullYear()} {person.name}</p>
    </section>
  );
}
