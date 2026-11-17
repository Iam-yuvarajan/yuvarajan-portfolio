import type { Metadata } from 'next';
import { legal } from '@/data/content';
import PageShell from '@/components/site/PageShell';

export const metadata: Metadata = { title: 'Privacy', alternates: { canonical: '/legal/privacy' } };

export default function PrivacyPage() {
  return (
    <PageShell index="—" ghost="PRIVACY" title="Legal" className="prose-page">
      <h1 className="page-title">Privacy</h1>
      <div className="prose">
        <p className="eyebrow">Last updated {legal.updated}</p>
        {legal.privacy.map((section) => (
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
