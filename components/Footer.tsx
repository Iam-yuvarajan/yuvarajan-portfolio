import Link from 'next/link';
import { site } from '@/data/content';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner mono">
        <span>{site.copyright}</span>
        <span>{site.builtWith}</span>
        <nav aria-label="Legal" className="footer__links">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
