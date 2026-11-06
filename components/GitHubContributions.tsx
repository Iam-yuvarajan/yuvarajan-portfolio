'use client';

import { useEffect, useState } from 'react';
import { github as copy, profile } from '@/data/content';

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

  useEffect(() => {
    const controller = new AbortController();
    let live = true;

    fetch('/api/github-contributions', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('GitHub contributions are unavailable.');
        const data = (await res.json()) as Payload;
        if (!Array.isArray(data.contributions) || data.contributions.length === 0) {
          throw new Error('GitHub contributions are empty.');
        }
        if (live) setState({ status: 'ready', data });
      })
      .catch((error: Error) => {
        if (live && error.name !== 'AbortError') setState({ status: 'error' });
      });

    return () => {
      live = false;
      controller.abort();
    };
  }, []);

  const weeks = state.status === 'ready' ? buildWeeks(state.data.contributions) : [];
  const labels = state.status === 'ready' ? monthLabels(weeks) : [];
  const width = LEFT + weeks.length * STEP;
  const height = TOP + 7 * STEP;
  const profileHref = profile.links.github || `https://github.com/${copy.username}`;

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
            <strong>{state.data.total}</strong> {copy.totalSuffix}
          </p>

          <div className="gh__body">
            <div
              className="gh__scroll"
              tabIndex={0}
              role="region"
              aria-label={`GitHub contributions for @${copy.username}, last year`}
            >
              <svg
                className="gh__chart"
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
                          className={`gh__cell gh__cell--${day.level}`}
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
