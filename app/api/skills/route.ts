import { getSkills } from '@/lib/data';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(getSkills(), { headers: { 'Cache-Control': 'no-store' } });
}
