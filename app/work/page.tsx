import type { Metadata } from 'next';
import { person } from '@/data/portfolio';
import PageShell from '@/components/site/PageShell';
import WorkGallery from '@/components/site/WorkGallery';

export const metadata: Metadata = {
  title: 'Projects | Yuvarajan J',
  description: 'Selected projects by Yuvarajan J — web apps, bots and computer-vision experiments.',
};

export default function WorkPage() {
  return (
    <PageShell index="03" ghost="PROJECTS" title="Work" className="page-shell--work">
      <h1 className="page-title">Projects by {person.name}</h1>
      <WorkGallery />
    </PageShell>
  );
}
