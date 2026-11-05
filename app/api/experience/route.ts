import { getExperience } from '@/lib/data';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(getExperience(), { headers: { 'Cache-Control': 'no-store' } });
}
