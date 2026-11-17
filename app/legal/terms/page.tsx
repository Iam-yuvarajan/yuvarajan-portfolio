import type { Metadata } from 'next';
import { legal } from '@/data/content';
import PageShell from '@/components/site/PageShell';

export const metadata: Metadata = { title: 'Terms', alternates: { canonical: '/legal/terms' } };

export default function TermsPage() {
  return (
    <PageShell index="—" ghost="TERMS" title="Legal" className="prose-page">
      <h1 className="page-title">Terms</h1>
      <div className="prose">
        <p className="eyebrow">Last updated {legal.updated}</p>
        {legal.terms.map((section) => (
          <section key={section.h}>
            <h2>{section.h}</h2>
            <p>{section.p}</p>
          </section>
        ))}
        <p className="eyebrow">{legal.disclaimer}</p>
      </div>
    </PageShell>
  );
}
