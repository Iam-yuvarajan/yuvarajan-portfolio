import { ask as copy } from '@/data/content';
import SectionHead from './SectionHead';
import AskBot from './AskBot';
import GitHubContributions from './GitHubContributions';

export default function Ask() {
  return (
    <section id="ask" className="section" aria-labelledby="ask-title" tabIndex={-1}>
      <div className="wrap">
        <SectionHead id="ask" heading={copy.heading} sub={copy.sub} />
        <AskBot />
        <GitHubContributions />
      </div>
    </section>
  );
}
