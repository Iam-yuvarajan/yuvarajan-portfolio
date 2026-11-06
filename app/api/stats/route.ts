import { getStats } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(getStats(), { headers: { 'Cache-Control': 'no-store' } });
}
