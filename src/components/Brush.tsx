import { useMemo } from 'react';

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPaths(seed: number) {
  const r = rng(seed);
  const pts: string[] = [];
  const P = (x: number, y: number) => pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  for (let x = 30; x <= 970; x += 18) P(x, 20 + (r() - 0.5) * 20);
  for (let y = 22; y <= 278; y += 9) P(968 + r() * 34 - (r() < 0.25 ? 22 : 0), y);
  for (let x = 970; x >= 30; x -= 18) P(x, 280 + (r() - 0.5) * 20);
  for (let y = 278; y >= 22; y -= 9) P(32 - r() * 34 + (r() < 0.25 ? 22 : 0), y);
  const main = 'M' + pts.join(' L') + ' Z';

  // bristle streaks shooting out of the left & right edges
  const streaks: string[] = [];
  for (let i = 0; i < 14; i++) {
    const y = 26 + r() * 248;
    const h = 3 + r() * 10;
    const right = i % 2 === 0;
    const x0 = right ? 900 + r() * 60 : 100 - r() * 60;
    const x1 = right ? 1010 + r() * 40 : -10 - r() * 40;
    streaks.push(`M${x0} ${y - h / 2} L${x1} ${y - h / 6} L${x1} ${y + h / 6} L${x0} ${y + h / 2} Z`);
  }
  // dry-brush highlights inside the stroke
  const lights: string[] = [];
  for (let i = 0; i < 9; i++) {
    const y = 34 + r() * 232;
    const h = 1.5 + r() * 4;
    const x0 = 40 + r() * 500;
    const len = 120 + r() * 420;
    lights.push(`M${x0} ${y} L${x0 + len} ${y - h / 2} L${x0 + len} ${y + h / 2} L${x0} ${y + h} Z`);
  }
  return { main, streaks: streaks.join(' '), lights: lights.join(' ') };
}

export function Brush({ color, color2, seed = 11 }: { color: string; color2: string; seed?: number }) {
  const p = useMemo(() => buildPaths(seed), [seed]);
  const gid = `bg${seed}`;
  return (
    <svg className="pz-brush" viewBox="-50 0 1100 300" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="0.65" stopColor={color} />
          <stop offset="1" stopColor={color2} />
        </linearGradient>
      </defs>
      <path d={p.streaks} fill={color} />
      <path d={p.main} fill={`url(#${gid})`} />
      <path d={p.lights} fill="#ffffff" opacity="0.16" />
    </svg>
  );
}
