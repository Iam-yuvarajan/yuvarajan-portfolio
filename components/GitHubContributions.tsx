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
/** Snake: trail length in squares, travel speed, and the gap between segments. */
const SNAKE_LENGTH = 5;
const SNAKE_SPEED_PX = 150;
const SNAKE_GAP_PX = STEP;

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

export default function GitHubContributions() {
  const [state, setState] = useState<State>({ status: 'loading' });
  /** Days that gained contributions since the last poll, highlighted for a moment. */
  const [bumped, setBumped] = useState<string[]>([]);
  /** The number on screen, which counts up to the real total. */
  const [shown, setShown] = useState(0);
  const [entering, setEntering] = useState(true);

  const counts = useRef<Map<string, number> | null>(null);
  const snake = useRef<SVGGElement>(null);
  /** Pixels travelled along the loop, kept across pauses and re-polls. */
  const progress = useRef(0);
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

  const weeks = state.status === 'ready' ? buildWeeks(state.data.contributions) : [];
  const labels = state.status === 'ready' ? monthLabels(weeks) : [];
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;
  const profileHref = profile.links.github || `https://github.com/${copy.username}`;
  const lastDate = state.status === 'ready' ? state.data.contributions.at(-1)?.date : undefined;
  const bumpedSet = new Set(bumped);

  /** Grid positions of the days that have contributions — the snake's whole route. */
  const route = weeks
    .flatMap((week, col) => week.map((day, row) => (day && day.level > 0 ? `${col},${row}` : '')))
    .filter(Boolean)
    .join(' ');

  /**
   * The snake: a short trail that visits only the days that actually have
   * contributions, gliding from one filled square to the next at a steady pixel
   * speed so long gaps are crossed smoothly. It walks the year out and then back,
   * so the loop closes with no jump. Segments are moved by writing x/y straight on
   * the SVG nodes, so no cell re-renders for it; it rests while the tab is hidden
   * and never starts under prefers-reduced-motion.
   */
  useEffect(() => {
    const group = snake.current;
    if (!group || !route || prefersReducedMotion()) return;

    const filled = route.split(' ').map((pair) => {
      const [col, row] = pair.split(',').map(Number);
      return [LEFT + col * STEP, TOP + row * STEP] as [number, number];
    });
    if (filled.length < 2) return;

    // Out along the filled days and back again: one continuous closed loop.
    const path = [...filled, ...filled.slice(1, -1).reverse()];
    const spans = path.map((point, i) => {
      const next = path[(i + 1) % path.length];
      return Math.hypot(next[0] - point[0], next[1] - point[1]);
    });
    const length = spans.reduce((sum, d) => sum + d, 0);
    if (!length) return;

    /** The point `distance` pixels along the loop. */
    const pointAt = (distance: number): [number, number] => {
      let left = ((distance % length) + length) % length;
      for (let i = 0; i < path.length; i++) {
        if (left <= spans[i]) {
          const f = spans[i] ? left / spans[i] : 0;
          const [x, y] = path[i];
          const [nx, ny] = path[(i + 1) % path.length];
          return [x + (nx - x) * f, y + (ny - y) * f];
        }
        left -= spans[i];
      }
      return path[0];
    };

    const segments = Array.from(group.querySelectorAll<SVGRectElement>('rect'));
    let raf = 0;
    let startedAt = 0;

    const frame = (t: number) => {
      if (!startedAt) startedAt = t;
      const head = progress.current + ((t - startedAt) / 1000) * SNAKE_SPEED_PX;
      progress.current = head;
      segments.forEach((segment, i) => {
        const [x, y] = pointAt(head - i * SNAKE_GAP_PX);
        segment.setAttribute('x', String(x));
        segment.setAttribute('y', String(y));
      });
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf) return;
      startedAt = 0; // the next frame re-bases the clock, so no time is "owed"
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [route]);

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
                <g className="gh__snake" ref={snake} aria-hidden="true">
                  {Array.from({ length: SNAKE_LENGTH }, (_, i) => (
                    <rect
                      key={i}
                      className={`gh__snake-seg${i === 0 ? ' is-head' : ''}`}
                      style={{ '--i': i } as React.CSSProperties}
                      x={-STEP * 2}
                      y={-STEP * 2}
                      width={CELL}
                      height={CELL}
                      rx={3}
                    />
                  ))}
                </g>
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
