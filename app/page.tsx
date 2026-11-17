import HomeExperience from '@/components/site/HomeExperience';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ open?: string }>;
}) {
  const params = await searchParams;
  const initialOpen = params?.open === 'true';
  return <HomeExperience defaultOpen={initialOpen} />;
}
