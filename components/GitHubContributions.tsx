'use client';

import { useEffect, useRef, useState } from 'react';
import { github as copy, profile } from '@/data/content';
import { prefersReducedMotion } from '@/lib/client';

type Level = 0 | 1 | 2 | 3 | 4;

interface ContributionDay {
  date: string;
  count: number;
  level: Level;
}

interface Payload {
  username: string;
  total: number;
  contributions: ContributionDay[];
}

type State = { status: 'loading' } | { status: 'ready'; data: Payload } | { status: 'error' };

const DAY_MS = 86_400_000;
const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 28;
const TOP = 18;

/** How often the graph re-checks GitHub while the tab is visible. */
const POLL_MS = 60_000;
/** How long a day that just gained contributions stays highlighted. */
const BUMP_MS = 2600;
const COUNT_UP_MS = 900;

const utc = (date: string) => new Date(`${date}T00:00:00Z`);

/** Group the year into Sunday-to-Saturday columns for the heatmap. */
function buildWeeks(days: ContributionDay[]) {
  if (!days.length) return [] as (ContributionDay | null)[][];

  const start = utc(days[0].date);
  const end = utc(days[days.length - 1].date);
  const gridStart = new Date(start);
  gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());

  const totalDays = Math.round((end.getTime() - gridStart.getTime()) / DAY_MS) + 1;
  const weeks = Array.from({ length: Math.ceil(totalDays / 7) }, () =>
    Array<ContributionDay | null>(7).fill(null),
  );

  for (const day of days) {
    const diff = Math.round((utc(day.date).getTime() - gridStart.getTime()) / DAY_MS);
    const week = Math.floor(diff / 7);
    const weekday = diff % 7;
    if (weeks[week] && weekday >= 0 && weekday < 7) weeks[week][weekday] = day;
  }

  return weeks;
}

function monthLabels(weeks: (ContributionDay | null)[][]) {
  const labels: { week: number; label: string }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, index) => {
    const first = week.find((day): day is ContributionDay => day !== null);
    if (!first) return;
    const month = utc(first.date).getUTCMonth();
    if (month === lastMonth) return;
    lastMonth = month;
    labels.push({
      week: index,
      label: utc(first.date).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
    });
  });

  return labels;
}

/** "just now", "3 min ago", "2 h ago" — how fresh the numbers on screen are. */
function freshness(at: number, now: number) {
  const mins = Math.floor((now - at) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  return `${Math.floor(mins / 60)} h ago`;
}

export default function GitHubContributions() {
  const [state, setState] = useState<State>({ status: 'loading' });
  /** Days that gained contributions since the last poll, highlighted for a moment. */
  const [bumped, setBumped] = useState<string[]>([]);
  /** The number on screen, which counts up to the real total. */
  const [shown, setShown] = useState(0);
  const [checkedAt, setCheckedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [entering, setEntering] = useState(true);

  const counts = useRef<Map<string, number> | null>(null);
  const shownRef = useRef(0);

  // Poll while the tab is visible, and re-check the moment it is focused again.
  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setInterval> | null = null;
    let bumpTimer: ReturnType<typeof setTimeout> | null = null;
    const controllers = new Set<AbortController>();

    const load = async () => {
      const controller = new AbortController();
      controllers.add(controller);
      try {
        const res = await fetch('/api/github-contributions', { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error('GitHub contributions are unavailable.');
        const data = (await res.json()) as Payload;
        if (!Array.isArray(data.contributions) || data.contributions.length === 0) {
          throw new Error('GitHub contributions are empty.');
        }
        if (!live) return;

        // Which days went up since the previous poll? Those cells flash.
        const previous = counts.current;
        const next = new Map(data.contributions.map((d) => [d.date, d.count]));
        if (previous) {
          const risen = data.contributions.filter((d) => d.count > (previous.get(d.date) ?? 0)).map((d) => d.date);
          if (risen.length) {
            setBumped(risen);
            if (bumpTimer) clearTimeout(bumpTimer);
            bumpTimer = setTimeout(() => live && setBumped([]), BUMP_MS);
          }
        }
        counts.current = next;

        setState({ status: 'ready', data });
        setCheckedAt(Date.now());
        setNow(Date.now());
      } catch (error) {
        if (live && (error as Error).name !== 'AbortError') {
          // A failed re-check keeps the graph that is already on screen.
          setState((s) => (s.status === 'ready' ? s : { status: 'error' }));
        }
      } finally {
        controllers.delete(controller);
      }
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };

    load();
    timer = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, POLL_MS);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      live = false;
      if (timer) clearInterval(timer);
      if (bumpTimer) clearTimeout(bumpTimer);
      controllers.forEach((c) => c.abort());
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);

  const total = state.status === 'ready' ? state.data.total : 0;

  // Count the headline number up to its new value instead of snapping to it.
  useEffect(() => {
    if (!total) return;
    if (prefersReducedMotion()) {
      const jump = requestAnimationFrame(() => {
        shownRef.current = total;
        setShown(total);
      });
      return () => cancelAnimationFrame(jump);
    }
    let raf = 0;
    let startedAt = 0;
    const from = shownRef.current;
    const tick = (t: number) => {
      if (!startedAt) startedAt = t;
      const p = Math.min(1, (t - startedAt) / COUNT_UP_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(from + (total - from) * eased);
      shownRef.current = value;
      setShown(value);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  // The entry wave runs once, then cells are left alone so re-polls do not re-animate.
  useEffect(() => {
    if (state.status !== 'ready' || !entering) return;
    const t = setTimeout(() => setEntering(false), 2400);
    return () => clearTimeout(t);
  }, [state.status, entering]);

  // Keep the "updated …" label honest between polls.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const weeks = state.status === 'ready' ? buildWeeks(state.data.contributions) : [];
  const labels = state.status === 'ready' ? monthLabels(weeks) : [];
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;
  const profileHref = profile.links.github || `https://github.com/${copy.username}`;
  const lastDate = state.status === 'ready' ? state.data.contributions.at(-1)?.date : undefined;
  const bumpedSet = new Set(bumped);

  return (
    <section className="gh" aria-labelledby="github-contributions-title" data-reveal>
      <div className="gh__head">
        <div>
          <p className="gh__kicker mono">~/agents/github</p>
          <h3 id="github-contributions-title" className="gh__title">
            {copy.heading}
          </h3>
        </div>
        <a className="gh__profile mono" href={profileHref} target="_blank" rel="noopener noreferrer">
          @{copy.username} ↗
        </a>
      </div>

      <p className="gh__sub">{copy.sub}</p>

      {state.status === 'loading' && (
        <div className="gh__loading" role="status" aria-live="polite">
          <span className="gh__spinner" aria-hidden="true" />
          <span>{copy.loading}</span>
        </div>
      )}

      {state.status === 'error' && (
        <div className="gh__error" role="alert">
          <span className="mono">graph unavailable</span>
          <span>{copy.error}</span>
          <a className="mono" href={profileHref} target="_blank" rel="noopener noreferrer">
            {copy.profile} ↗
          </a>
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <p className="gh__total mono">
            <strong aria-live="polite">{shown.toLocaleString('en-US')}</strong>
            <span>{copy.totalSuffix}</span>
            {checkedAt && (
              <span className={`gh__live${bumped.length ? ' is-new' : ''}`}>
                <span className="gh__live-dot" aria-hidden="true" />
                {copy.live} · {freshness(checkedAt, now)}
              </span>
            )}
          </p>

          <div className="gh__body">
            <div
              className="gh__scroll"
              tabIndex={0}
              role="region"
              aria-label={`GitHub contributions for @${copy.username}, last year`}
            >
              <svg
                className={`gh__chart${entering ? ' is-entering' : ''}`}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={`${state.data.total} GitHub contributions in the last year for @${copy.username}.`}
              >
                {labels.map(({ week, label }) => (
                  <text key={`${week}-${label}`} className="gh__month" x={LEFT + week * STEP} y={10}>
                    {label}
                  </text>
                ))}
                {['Mon', 'Wed', 'Fri'].map((label, index) => (
                  <text
                    key={label}
                    className="gh__weekday"
                    x={0}
                    y={TOP + (index * 2 + 1) * STEP + CELL - 1}
                  >
                    {label}
                  </text>
                ))}
                {weeks.map((week, weekIndex) => (
                  <g key={weekIndex}>
                    {week.map((day, dayIndex) =>
                      day ? (
                        <rect
                          key={day.date}
                          className={[
                            'gh__cell',
                            `gh__cell--${day.level}`,
                            day.date === lastDate ? 'is-today' : '',
                            bumpedSet.has(day.date) ? 'is-bumped' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{ '--col': weekIndex, '--row': dayIndex } as React.CSSProperties}
                          x={LEFT + weekIndex * STEP}
                          y={TOP + dayIndex * STEP}
                          width={CELL}
                          height={CELL}
                          rx={2}
                        >
                          <title>
                            {`${day.date}: ${day.count} ${day.count === 1 ? 'contribution' : 'contributions'}`}
                          </title>
                        </rect>
                      ) : null,
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="gh__legend mono" aria-hidden="true">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} className={`gh__swatch gh__swatch--${level}`} />
            ))}
            <span>More</span>
          </div>
        </>
      )}
    </section>
  );
}
