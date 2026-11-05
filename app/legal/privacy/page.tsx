import Link from 'next/link';
import { legal } from '@/data/content';

export const metadata = { title: 'Privacy', alternates: { canonical: '/legal/privacy' } };

export default function PrivacyPage() {
  return (
    <main id="main" className="legal wrap">
      <p className="mono sec-head__path">
        <Link href="/">← back home</Link>
      </p>
      <h1 className="sec-head__title">Privacy</h1>
      <p className="legal__meta mono">Last updated {legal.updated}</p>
      {legal.privacy.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </section>
      ))}
      <p className="legal__note mono">{legal.disclaimer}</p>
    </main>
  );
}
