import { getStats } from '@/lib/data';
import { listNotes, notesAvailable } from '@/lib/notes';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { count } = notesAvailable() ? await listNotes(1) : { count: 0 };
  return Response.json(getStats(count), { headers: { 'Cache-Control': 'no-store' } });
}
