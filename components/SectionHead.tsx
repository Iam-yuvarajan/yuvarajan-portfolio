import { sections } from '@/data/content';
import { Rich } from '@/lib/text';

export default function SectionHead({ id, heading, sub }: { id: (typeof sections)[number]['id']; heading: string; sub: string }) {
  const s = sections.find((x) => x.id === id)!;
  return (
    <header className="sec-head" data-reveal>
      <p className="sec-head__path mono">
        <span className="sec-head__num">§{s.num}</span>
        <span>{s.path}</span>
      </p>
      <h2 id={`${id}-title`} className="sec-head__title">
        <Rich text={heading} />
      </h2>
      {sub && (
        <p className="sec-head__sub">
          <Rich text={sub} />
        </p>
      )}
    </header>
  );
}
