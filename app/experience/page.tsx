import type { Metadata } from 'next';
import { experience, nav, person, stats } from '@/data/portfolio';
import PageShell from '@/components/site/PageShell';
import { Reveal } from '@/components/site/Chrome';

export const metadata: Metadata = {
  title: 'Experience | Yuvarajan J',
  description: 'Experience, roles and a few numbers behind Yuvarajan J.',
};

export default function ExperiencePage() {
  return (
    <PageShell index="02" ghost="WORK" title="Experience">
      <h1 className="page-title">Experience — {person.name}</h1>

      <div className="experience-lead">
        <Reveal className="panel profile-card">
          <h2 className="profile-card__name">{person.name}</h2>
          <p className="profile-card__role">{person.role}</p>
          <p className="profile-card__intro">{person.introExtra}</p>
          <ul className="pill-row">
            {person.roles.map((role) => (
              <li key={role} className="pill">{role}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="stats-grid" >
          {stats.map((stat) => (
            <div key={stat.label} className="panel stat-card">
              <p className="stat-card__value">{stat.value}</p>
              <p className="eyebrow stat-card__label">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal className="timeline">
        <h2 className="section-title">Timeline</h2>
        <div className="timeline-list">
          {experience.map((item) => (
            <article key={item.role} className="panel timeline-card">
              <p className="eyebrow timeline-card__meta">{item.period} · {item.location}</p>
              <h3>{item.role}</h3>
              <p className="timeline-card__org">{item.organization}</p>
              <ul className="timeline-card__points">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>

      <nav className="page-next" aria-label="More pages">
        {nav.slice(1).map((item) => (
          <a key={item.to} href={item.to} className="eyebrow">{item.index} / {item.label} ↗</a>
        ))}
      </nav>
    </PageShell>
  );
}
