import Loader from '@/components/Loader';
import Header from '@/components/Header';
import CommandPalette from '@/components/CommandPalette';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import Journey from '@/components/Journey';
import Stack from '@/components/Stack';
import Shell from '@/components/Shell';
import Notes from '@/components/Notes';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Toaster from '@/components/Toaster';
import WorldSpy from '@/components/WorldSpy';
import WorldCurtain from '@/components/WorldCurtain';
import { getExperience, getProjects, getSkills } from '@/lib/data';

export default function Page() {
  return (
    <>
      <a className="skip" href="#work">
        Skip to content
      </a>
      <Loader />
      <Header />
      <CommandPalette />
      <main id="main">
        <Hero />
        <Work initial={getProjects()} />
        <Journey initial={getExperience()} />
        <Stack initial={getSkills()} />
        <Shell />
        {/* TODO: re-add Ask section between Shell and Notes */}
        <Notes />
        <Contact />
      </main>
      <Footer />
      <Motion />
      <Toaster />
      <WorldSpy />
      <WorldCurtain />
    </>
  );
}
