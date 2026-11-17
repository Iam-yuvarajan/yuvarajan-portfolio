import Link from 'next/link';
import PageShell from '@/components/site/PageShell';

export default function NotFound() {
  return (
    <PageShell index="!" ghost="404" title="Not found">
      <h1 className="page-title">This page is not available.</h1>
      <p className="page-intro">Use the home button above or pick a page below to keep exploring.</p>
      <div className="not-found-actions">
        <Link className="pill" href="/">Back home ↗</Link>
        <Link className="pill" href="/work">Projects ↗</Link>
        <Link className="pill" href="/contact">Contact ↗</Link>
      </div>
    </PageShell>
  );
}
