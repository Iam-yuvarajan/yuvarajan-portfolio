import type { Metadata } from 'next';
import { person, skillGroups } from '@/data/portfolio';
import PageShell from '@/components/site/PageShell';
import { Reveal } from '@/components/site/Chrome';

export const metadata: Metadata = {
  title: 'Skills | Yuvarajan J',
  description: 'The tools and technologies Yuvarajan J reaches for.',
};

function SkillGlyph({ icon }: { icon?: string }) {
  if (!icon) return <span className="skill-glyph">•</span>;
  if (icon.startsWith('http')) {
    // eslint-disable-next-line @next/next/no-img-element -- tiny remote devicon, no optimization needed
    return <img className="skill-glyph-img" src={icon} alt="" aria-hidden="true" width={24} height={24} />;
  }
  const glyphs: Record<string, string> = {
    send: '➤',
    sparkles: '✦',
    'circuit-board': '⌗',
    cpu: '▦',
    cloud: '☁',
    shield: '◇',
  };
  return <span className="skill-glyph" aria-hidden="true">{glyphs[icon] ?? '•'}</span>;
}

export default function SkillsPage() {
  return (
    <PageShell index="04" ghost="SKILLS" title="Skills">
      <h1 className="page-title">Skills of {person.name}</h1>
      <p className="page-intro">The tools I reach for — grouped by where they show up in my work.</p>

      <div className="skill-groups">
        {skillGroups.map((group) => (
          <Reveal key={group.title} className="skill-group">
            <div className="skill-group__head">
              <h2 className="section-title">{group.title}</h2>
              <span className="eyebrow">{String(group.items.length).padStart(2, '0')}</span>
            </div>
            <ul className="skill-grid">
              {group.items.map((item) => (
                <li key={item.name} className="panel skill-card">
                  <SkillGlyph icon={item.icon} />
                  <span className="skill-card__name">{item.name}</span>
                  {item.note ? <span className="eyebrow skill-card__note">{item.note}</span> : null}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
