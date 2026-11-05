import { getProjects } from '@/lib/data';

export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(getProjects(), { headers: { 'Cache-Control': 'no-store' } });
}
