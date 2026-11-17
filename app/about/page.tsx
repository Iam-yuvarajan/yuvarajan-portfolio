import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { about, education, person } from '@/data/portfolio';
import PageShell from '@/components/site/PageShell';
import { Reveal } from '@/components/site/Chrome';

export const metadata: Metadata = {
  title: 'About | Yuvarajan J',
  description: 'A little about Yuvarajan J, his education and what he is learning next.',
};

export default function AboutPage() {
  return (
    <PageShell index={about.index} ghost={about.ghost} title="About">
      <h1 className="page-title">About {person.name}</h1>

      <div className="about-layout">
        <Reveal className="about-copy">
          <div className="about-paragraphs">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <p className="about-more">
            More about my work: <Link href="/experience">experience</Link>, <Link href="/work">projects</Link> and <Link href="/skills">skills</Link>.
          </p>
        </Reveal>

        <div className="about-portrait" aria-hidden="true">
          <span className="font-script about-portrait__note">that&apos;s me!</span>
          <Image src={person.cutout} alt="" width={520} height={680} className="cutout-img" priority />
        </div>
      </div>

      <Reveal className="about-education">
        <h2 className="section-title">Education</h2>
        <div className="education-grid">
          {education.map((item) => (
            <article key={item.degree} className="panel education-card">
              <h3>{item.degree}</h3>
              <p className="education-card__meta">{item.institution} · {item.period}</p>
              <dl>
                {item.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="eyebrow">{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Reveal>
    </PageShell>
  );
}
