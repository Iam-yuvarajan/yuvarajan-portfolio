import { BackButton, QuickNav, SiteLogo, ThemeToggle } from './Chrome';

export default function PageChrome({ dark = false }: { dark?: boolean }) {
  return (
    <>
      <SiteLogo dark={dark} />
      <BackButton />
      <ThemeToggle />
      <QuickNav />
    </>
  );
}
