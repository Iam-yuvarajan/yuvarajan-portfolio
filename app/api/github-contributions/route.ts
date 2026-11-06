import { github } from '@/data/content';

type Level = 0 | 1 | 2 | 3 | 4;

interface SourceDay {
  date?: unknown;
  count?: unknown;
  level?: unknown;
}

interface SourcePayload {
  total?: { lastYear?: unknown };
  contributions?: unknown;
}

const SOURCE = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(github.username)}?y=last`;
const REVALIDATE_SECONDS = 60 * 60 * 6;

const clampLevel = (value: number): Level => Math.max(0, Math.min(4, Math.round(value))) as Level;

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(SOURCE, {
      headers: { Accept: 'application/json', 'User-Agent': 'jyuvarajan-portfolio' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`GitHub contribution source returned ${res.status}.`);

    const payload = (await res.json()) as SourcePayload;
    const raw = Array.isArray(payload.contributions) ? (payload.contributions as SourceDay[]) : [];
    const contributions = raw.flatMap((day) => {
      if (typeof day.date !== 'string' || typeof day.count !== 'number' || typeof day.level !== 'number') return [];
      return [{ date: day.date, count: Math.max(0, Math.round(day.count)), level: clampLevel(day.level) }];
    });
    if (!contributions.length) throw new Error('GitHub contribution source returned no days.');

    const total =
      typeof payload.total?.lastYear === 'number'
        ? Math.max(0, Math.round(payload.total.lastYear))
        : contributions.reduce((sum, day) => sum + day.count, 0);

    return Response.json(
      { username: github.username, total, contributions },
      { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' } },
    );
  } catch {
    return Response.json(
      { error: 'GitHub contributions are unavailable right now.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
