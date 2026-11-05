/** Neutral abstract cover generated from a seed. Never a screenshot. ({{PROJECT_IMAGE}}) */
function seeded(seed: string) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return () => ((h = (h * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export default function Cover({ seed }: { seed: string }) {
  const rnd = seeded(seed);
  const shapes = Array.from({ length: 5 }, (_, i) => ({
    cx: 20 + rnd() * 260,
    cy: 15 + rnd() * 130,
    r: 18 + rnd() * 60,
    o: 0.12 + rnd() * 0.3,
    i,
  }));
  const lines = Array.from({ length: 7 }, (_, i) => 18 + i * 20 + rnd() * 6);
  return (
    <svg className="cover" viewBox="0 0 300 160" role="img" aria-label={`Abstract cover for ${seed}`} preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="160" className="cover__bg" />
      {lines.map((y, i) => (
        <line key={i} x1="0" x2="300" y1={y} y2={y} className="cover__rule" />
      ))}
      {shapes.map((s) =>
        s.i % 2 ? (
          <circle key={s.i} cx={s.cx} cy={s.cy} r={s.r} className="cover__shape" style={{ opacity: s.o }} />
        ) : (
          <rect
            key={s.i}
            x={s.cx - s.r / 2}
            y={s.cy - s.r / 2}
            width={s.r}
            height={s.r}
            transform={`rotate(${Math.round(s.cx % 45)} ${s.cx} ${s.cy})`}
            className="cover__shape cover__shape--alt"
            style={{ opacity: s.o + 0.1 }}
          />
        ),
      )}
    </svg>
  );
}
