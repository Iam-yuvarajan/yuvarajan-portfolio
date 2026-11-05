import { addNote, isClean, listNotes, moderate, notesAvailable, rateLimited } from '@/lib/notes';

const OFFLINE = 'The notes wall is not connected yet. Please try again later.';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!notesAvailable()) return Response.json({ count: 0, notes: [], offline: true });
  const { count, notes } = await listNotes();
  return Response.json(
    { count, notes },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(req: Request) {
  if (!notesAvailable()) return Response.json({ error: OFFLINE }, { status: 503 });
  let body: { text?: unknown; name?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return Response.json({ error: 'Rejected.' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.replace(/\s+/g, ' ').trim() : '';
  const name = typeof body.name === 'string' ? body.name.replace(/\s+/g, ' ').trim().slice(0, 40) : '';

  const problem = moderate(text) ?? (name && !isClean(name) ? 'Please keep the name friendly.' : null);
  if (problem) return Response.json({ error: problem }, { status: 422 });

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
  if (await rateLimited(ip)) {
    return Response.json({ error: 'Slow down: three notes per ten minutes.' }, { status: 429 });
  }

  const note = await addNote(text, name || 'anonymous');
  return Response.json({ note }, { status: 201 });
}
