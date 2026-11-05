import Link from 'next/link';
import { legal } from '@/data/content';

export const metadata = { title: 'Terms', alternates: { canonical: '/legal/terms' } };

export default function TermsPage() {
  return (
    <main id="main" className="legal wrap">
      <p className="mono sec-head__path">
        <Link href="/">← back home</Link>
      </p>
      <h1 className="sec-head__title">Terms</h1>
      <p className="legal__meta mono">Last updated {legal.updated}</p>
      {legal.terms.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </section>
      ))}
      <p className="legal__note mono">{legal.disclaimer}</p>
    </main>
  );
}
