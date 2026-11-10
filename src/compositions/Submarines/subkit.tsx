/**
 * Undersea kit for "How Submarines Actually Fight" (Formats/Naval Board/episodes/ep02-submarines): ocean cross-section, side-on boats, sound waves,
 * cutaways and gauges on a 1920×1080 SVG canvas. Motion only from the frame. Top-down ships, maps and tags come from
 * the Carrier and Ambush kits.
 */
import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { C, CLAMP, COND, ease, lin } from "../Ambush/kit";

export const U = {
  deep: "#030d17",
  mid: "#07263a",
  top: "#0f4a63",
  sky: "#0d1a24",
  sand: "#10202a",
  hull: "#1c2730",
  hullHi: "#3b4a56",
  us: "#59b8ff",
  foe: "#ff6a4d",
  sound: "#7fe3d0",
  ink: "#2b2117",
  paper: "#cdbb97",
};

/** Scene canvas with a slow, bounded float, same as Carrier. */
export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = 1.055 + 0.006 * Math.sin(f / 130); // never below 1.049: keeps map edges covered at full drift
  const x = 44 * Math.sin(f / 80);
  const y = 26 * Math.sin(f / 61 + 1);
  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
      <g transform={`translate(${(960 + x).toFixed(2)} ${(540 + y).toFixed(2)}) scale(${s.toFixed(4)}) translate(-960 -540)`}>{children}</g>
    </svg>
  );
};

export const Big: React.FC<{ x: number; y: number; text: string; p: number; size?: number; color?: string; anchor?: "start" | "middle" | "end"; halo?: string }> = ({ x, y, text, p, size = 120, color = C.text, anchor = "middle", halo = "#03090f" }) =>
  p > 0 ? (
    <text x={x} y={y + (1 - p) * 30} textAnchor={anchor} opacity={p} fill={color} stroke={halo} strokeWidth={size * 0.07} paintOrder="stroke" fontFamily={COND} fontWeight={800} fontSize={size} letterSpacing={3}>
      {text}
    </text>
  ) : null;

/** Small caption next to something (not a banner). */
export const Label: React.FC<{ x: number; y: number; text: string; p?: number; size?: number; color?: string; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, p = 1, size = 40, color = C.text, anchor = "middle" }) =>
  p > 0 ? (
    <text x={x} y={y} textAnchor={anchor} opacity={p} fill={color} stroke="#03090f" strokeWidth={size * 0.12} paintOrder="stroke" fontFamily={COND} fontWeight={700} fontSize={size} letterSpacing={2}>
      {text}
    </text>
  ) : null;

// ───────────────────────── water ─────────────────────────

/** Ocean cross-section. `surface` y of the sea surface (omit: deep water, no surface); `floor` y of the bed. */
export const Water: React.FC<{ surface?: number; floor?: number; seed?: string; dark?: number; snow?: number }> = ({ surface, floor, seed = "w", dark = 0, snow = 70 }) => {
  const f = useCurrentFrame();
  const id = `wg-${seed}`;
  const surf = surface ?? -200;
  const wave = (y: number, amp: number, ph: number) => {
    let d = `M -200 ${y}`;
    for (let x = -200; x <= 2120; x += 80) d += ` L ${x} ${(y + amp * Math.sin(x / 130 + f / 26 + ph) + amp * 0.5 * Math.sin(x / 57 - f / 19)).toFixed(1)}`;
    return d;
  };
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={surface === undefined ? U.mid : U.top} />
          <stop offset="0.45" stopColor={U.mid} />
          <stop offset="1" stopColor={U.deep} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill={U.sky} />
      <rect x={-200} y={surf} width={2320} height={1480 - surf} fill={`url(#${id})`} />
      {/* light shafts from above, moving slowly; open water gets them too or dark scenes stand still */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 150 + i * 330 + 70 * Math.sin(f / 50 + i * 1.7);
        const y0 = surface ?? -200;
        const len = surface === undefined ? 1500 : 520;
        return <path key={i} d={`M ${x - 50} ${y0} L ${x + 50} ${y0} L ${x + 220} ${y0 + len} L ${x + 40} ${y0 + len} Z`} fill="#bfeaff" opacity={0.045 + 0.02 * Math.sin(f / 40 + i)} />;
      })}
      {surface !== undefined ? (
        <>
          <path d={`${wave(surface, 5, 0)} L 2120 ${surface - 300} L -200 ${surface - 300} Z`} fill={U.sky} />
          <path d={wave(surface, 5, 0)} fill="none" stroke="#a6dff0" strokeWidth={4} opacity={0.75} />
        </>
      ) : null}
      {Array.from({ length: snow }).map((_, i) => {
        const x0 = random(`${seed}sx${i}`) * 2300 - 190;
        const y0 = random(`${seed}sy${i}`) * 1400 - 150;
        const v = 0.12 + random(`${seed}sv${i}`) * 0.3;
        const y = ((y0 + f * v + 150) % 1400) - 150;
        const x = x0 + 18 * Math.sin(f / 70 + i);
        if (y < surf + 6) return null;
        return <circle key={i} cx={x} cy={y} r={0.9 + random(`${seed}sr${i}`) * 1.9} fill="#d8f2ff" opacity={0.1 + random(`${seed}so${i}`) * 0.26} />;
      })}
      {floor !== undefined ? <path d={`M -200 ${floor} C 300 ${floor - 34}, 700 ${floor + 26}, 1100 ${floor - 10} S 1800 ${floor - 30}, 2120 ${floor} L 2120 1280 L -200 1280 Z`} fill={U.sand} stroke="#274353" strokeWidth={3} /> : null}
      {dark > 0 ? <rect x={-200} y={-200} width={2320} height={1480} fill="#01060b" opacity={dark} /> : null}
    </g>
  );
};

/** Plain tactical board for concepts, with a faint grid drifting sideways. */
export const Board: React.FC<{ tint?: string }> = ({ tint = "#071520" }) => {
  const f = useCurrentFrame();
  const dx = (f * 1.2) % 120;
  return (
    <g>
      <rect x={-200} y={-200} width={2320} height={1480} fill={tint} />
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1={-200 + i * 120 - dx} y1={-200} x2={-200 + i * 120 - dx} y2={1280} stroke="#7fd4ff" strokeWidth={2} opacity={0.08} />
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={-200} y1={-200 + i * 120} x2={2120} y2={-200 + i * 120} stroke="#7fd4ff" strokeWidth={1} opacity={0.06} />
      ))}
    </g>
  );
};

// ───────────────────────── boats (side view, bow at +x) ─────────────────────────

/** Modern submarine, side on. About 300 units long at s=1. */
export const SubSide: React.FC<{ x: number; y: number; s?: number; color?: string; a?: number; flip?: boolean; op?: number; mast?: number }> = ({ x, y, s = 1, color = U.us, a = 0, flip = false, op = 1, mast = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${flip ? -s : s} ${s})`} opacity={op}>
    {mast > 0 ? <rect x={19} y={-46 - mast} width={5} height={mast + 2} fill={U.hullHi} /> : null}
    <path d="M -128 0 L -152 -22 L -160 -22 L -156 0 L -160 22 L -152 22 L -128 8 Z" fill={U.hull} stroke={color} strokeWidth={1.6} />
    <path d="M 150 0 C 150 -18, 120 -24, 90 -24 L -110 -24 C -128 -20, -140 -8, -146 0 C -140 8, -128 18, -110 22 L 90 24 C 120 24, 150 18, 150 0 Z" fill={U.hull} stroke={color} strokeWidth={2.4} />
    <path d="M 8 -24 L 14 -48 L 46 -48 L 54 -24 Z" fill={U.hull} stroke={color} strokeWidth={2.4} />
    <path d="M 92 -18 C 60 -22, -40 -22, -100 -18" fill="none" stroke={U.hullHi} strokeWidth={4} opacity={0.65} strokeLinecap="round" />
    <path d="M 30 -36 L 48 -36 L 50 -32 L 30 -32 Z" fill={U.hullHi} />
  </g>
);

/** Second World War boat, low casing and conning tower. */
export const OldSub: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; op?: number }> = ({ x, y, s = 1, color = U.us, flip = false, op = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={op}>
    <path d="M 150 -2 L 120 -14 L -120 -14 L -150 -2 L -120 12 L 110 12 Z" fill={U.hull} stroke={color} strokeWidth={2.2} />
    <path d="M -10 -14 L -6 -36 L 30 -36 L 36 -14 Z" fill={U.hull} stroke={color} strokeWidth={2.2} />
    <rect x={8} y={-52} width={3} height={16} fill={U.hullHi} />
    <line x1={-120} y1={-16} x2={120} y2={-16} stroke={U.hullHi} strokeWidth={2} />
  </g>
);

/** Surface ship side on, waterline at y. */
export const ShipSide: React.FC<{ x: number; y: number; s?: number; kind?: "warship" | "sloop" | "motor" | "tanker"; color?: string; a?: number; flip?: boolean; op?: number; sink?: number }> = ({ x, y, s = 1, kind = "warship", color = "#aeb9c2", a = 0, flip = false, op = 1, sink = 0 }) => {
  const hull = kind === "sloop" ? "M 130 -24 L 100 16 L -110 16 L -125 -22 Z" : kind === "motor" ? "M 110 -34 L 90 16 L -100 16 L -110 -20 Z" : "M 170 -28 L 130 18 L -150 18 L -160 -20 Z";
  return (
    <g transform={`translate(${x} ${y + sink}) rotate(${a}) scale(${flip ? -s : s} ${s})`} opacity={op}>
      <path d={hull} fill="#27323a" stroke={color} strokeWidth={2.2} />
      {kind === "sloop" ? (
        <>
          {[-50, 10, 60].map((mx) => (
            <g key={mx}>
              <line x1={mx} y1={-24} x2={mx} y2={-120} stroke={color} strokeWidth={3} />
              <line x1={mx - 26} y1={-96} x2={mx + 26} y2={-96} stroke={color} strokeWidth={2} />
            </g>
          ))}
          <rect x={-18} y={-44} width={14} height={20} fill={color} />
        </>
      ) : kind === "motor" ? (
        <>
          <rect x={-60} y={-52} width={70} height={32} fill="#3a4750" stroke={color} strokeWidth={2} />
          <line x1={-20} y1={-52} x2={-20} y2={-92} stroke={color} strokeWidth={3} />
          <line x1={50} y1={-28} x2={50} y2={-74} stroke={color} strokeWidth={3} />
        </>
      ) : (
        <>
          <path d="M -70 -24 L -60 -60 L 40 -60 L 56 -24 Z" fill="#3a4750" stroke={color} strokeWidth={2} />
          <line x1={-10} y1={-60} x2={-10} y2={-108} stroke={color} strokeWidth={3} />
          <rect x={72} y={-36} width={30} height={12} fill={color} />
          <rect x={-120} y={-36} width={32} height={12} fill={color} />
        </>
      )}
    </g>
  );
};

/** Top-down boat for the tactical board. */
export const Dot: React.FC<{ x: number; y: number; r?: number; color?: string; op?: number }> = ({ x, y, r = 12, color = U.us, op = 1 }) => (
  <g opacity={op}>
    <circle cx={x} cy={y} r={r * 1.9} fill={color} opacity={0.2} />
    <circle cx={x} cy={y} r={r} fill={color} />
  </g>
);

// ───────────────────────── sound ─────────────────────────

/** Rings spreading from a point for as long as the shot runs; `span` limits them to an arc (degrees). */
export const Waves: React.FC<{ g: number; x: number; y: number; at?: number; color?: string; n?: number; gap?: number; speed?: number; max?: number; span?: [number, number]; op?: number; w?: number }> = ({
  g,
  x,
  y,
  at = 0,
  color = U.sound,
  n = 5,
  gap = 90,
  speed = 3.2,
  max = 620,
  span,
  op = 1,
  w = 3,
}) => {
  if (g < at) return null;
  const t = (g - at) * speed;
  return (
    <g opacity={op}>
      {Array.from({ length: n }).map((_, i) => {
        const r = t - i * gap;
        if (r <= 0) return null;
        const rr = r % (n * gap);
        const fade = 1 - rr / Math.min(max, n * gap);
        if (rr < 2 || fade <= 0) return null;
        if (span) {
          const [a0, a1] = span.map((v) => (v * Math.PI) / 180);
          const large = span[1] - span[0] > 180 ? 1 : 0;
          return <path key={i} d={`M ${x + rr * Math.cos(a0)} ${y + rr * Math.sin(a0)} A ${rr} ${rr} 0 ${large} 1 ${x + rr * Math.cos(a1)} ${y + rr * Math.sin(a1)}`} fill="none" stroke={color} strokeWidth={w} opacity={fade * 0.8} strokeLinecap="round" />;
        }
        return <circle key={i} cx={x} cy={y} r={rr} fill="none" stroke={color} strokeWidth={w} opacity={fade * 0.8} />;
      })}
    </g>
  );
};

/** Arcs converging on a point: the boat is listening. */
export const Incoming: React.FC<{ g: number; x: number; y: number; color?: string; from?: number; span?: number; n?: number; size?: number; op?: number }> = ({ g, x, y, color = U.sound, from = 180, span = 50, n = 5, size = 620, op = 1 }) => {
  const a0 = ((from - span / 2) * Math.PI) / 180;
  const a1 = ((from + span / 2) * Math.PI) / 180;
  return (
    <g opacity={op}>
      {Array.from({ length: n }).map((_, i) => {
        const k = (((g * 0.012 + i / n) % 1) + 1) % 1;
        const r = size * (1 - k) + 40;
        return <path key={i} d={`M ${x + r * Math.cos(a0)} ${y + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${x + r * Math.cos(a1)} ${y + r * Math.sin(a1)}`} fill="none" stroke={color} strokeWidth={3} opacity={Math.sin(k * Math.PI) * 0.75} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** One pulse out from (x1,y1) to (x2,y2), then the echo back. Drawn as a ring out and a smaller ring back. */
export const Pulse: React.FC<{ g: number; x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; color?: string; echo?: string }> = ({ g, x1, y1, x2, y2, at, dur = 40, color = U.sound, echo = C.tracer }) => {
  const d = Math.hypot(x2 - x1, y2 - y1);
  const out = lin(g, at, at + dur);
  const back = lin(g, at + dur, at + dur * 2);
  return (
    <g>
      {g >= at && out < 1 ? <circle cx={x1} cy={y1} r={d * out} fill="none" stroke={color} strokeWidth={5} opacity={1 - out * 0.5} /> : null}
      {g >= at + dur && back < 1 ? <circle cx={x2} cy={y2} r={d * back} fill="none" stroke={echo} strokeWidth={4} opacity={1 - back * 0.7} /> : null}
    </g>
  );
};

/** A torpedo running from A to B: a dashed bubble trail and a bright head. */
export const Torp: React.FC<{ g: number; x1: number; y1: number; x2: number; y2: number; at: number; dur?: number; color?: string }> = ({ g, x1, y1, x2, y2, at, dur = 50, color = "#e8f6ff" }) => {
  if (g < at) return null;
  const k = lin(g, at, at + dur);
  const x = x1 + (x2 - x1) * k;
  const y = y1 + (y2 - y1) * k;
  const done = lin(g, at + dur, at + dur + 30);
  return (
    <g opacity={1 - done}>
      <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" opacity={0.7} />
      {k < 1 ? <circle cx={x} cy={y} r={6} fill={color} /> : null}
    </g>
  );
};

// ───────────────────────── cutaway and gauges ─────────────────────────

/** Large submarine in section, about 1300 units long at s=1. `tanks` 0 empty, 1 flooded. */
export const Cutaway: React.FC<{ x: number; y: number; s?: number; tanks?: number; reactor?: number; machinery?: number; crew?: number; tint?: number; color?: string }> = ({ x, y, s = 1, tanks = 0, reactor = 0, machinery = 0, crew = 0, tint = 0, color = U.us }) => {
  const f = useCurrentFrame();
  const hull = "M 650 0 C 650 -90, 520 -120, 400 -120 L -480 -120 C -560 -105, -620 -40, -650 0 C -620 40, -560 105, -480 120 L 400 120 C 520 120, 650 90, 650 0 Z";
  const lvl = (tanks: number) => 110 - tanks * 220;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id="cut-hull">
          <path d={hull} />
        </clipPath>
      </defs>
      <path d="M 90 -120 L 110 -220 L 270 -220 L 300 -120 Z" fill={U.hull} stroke={color} strokeWidth={3} />
      <path d={hull} fill="#101a22" stroke={color} strokeWidth={4} />
      <g clipPath="url(#cut-hull)">
        {/* ballast tanks, bow and stern */}
        {[
          [430, 230],
          [-660, 180],
        ].map(([tx, tw], i) => (
          <g key={i}>
            <rect x={tx} y={-130} width={tw} height={260} fill={tint > 0 ? "#123244" : "#0d2230"} stroke="#6fa8c6" strokeWidth={2} strokeDasharray="8 8" />
            <rect x={tx} y={lvl(tanks) + 4 * Math.sin(f / 7 + i)} width={tw} height={260} fill="#1f7fa8" opacity={0.75} />
          </g>
        ))}
        {/* reactor */}
        <rect x={-340} y={-90} width={190} height={180} rx={10} fill={reactor > 0 ? `rgba(255,190,80,${0.2 + 0.4 * reactor})` : "#1b2730"} stroke={reactor > 0 ? C.tracer : "#3a4a55"} strokeWidth={3} />
        <circle cx={-245} cy={0} r={46} fill={reactor > 0 ? C.tracer : "#2a3842"} opacity={reactor > 0 ? 0.6 + 0.3 * Math.sin(f / 8) : 1} />
        {/* machinery aft */}
        <g>
          {[-460, -405].map((mx, i) => (
            <rect key={mx} x={mx} y={-50 + (machinery > 0 ? 3 * Math.sin(f * 1.4 + i) : 0)} width={46} height={100} rx={6} fill={machinery > 0 ? C.red : "#222f39"} opacity={machinery > 0 ? 0.45 + 0.5 * machinery : 1} />
          ))}
        </g>
        {/* decks */}
        <line x1={-140} y1={-20} x2={430} y2={-20} stroke="#3a4a55" strokeWidth={3} />
        <line x1={-140} y1={50} x2={430} y2={50} stroke="#3a4a55" strokeWidth={3} />
        {/* people */}
        {crew > 0
          ? Array.from({ length: 56 }).map((_, i) => {
              const px = -120 + ((i * 37) % 540) + 6 * Math.sin(f / 30 + i);
              const py = i % 3 === 0 ? -48 : i % 3 === 1 ? 22 : 88;
              return <circle key={i} cx={px} cy={py} r={8} fill="#ffe2a8" opacity={crew * (i / 56 < crew ? 0.95 : 0)} />;
            })
          : null}
      </g>
    </g>
  );
};

/** Vertical noise bar: 0–1, no numbers on purpose. */
export const Meter: React.FC<{ x: number; y: number; h?: number; v: number; label?: string; color?: string }> = ({ x, y, h = 420, v, label, color }) => {
  const n = 16;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const on = (i + 1) / n <= v;
        const c = color ?? (i / n > 0.7 ? C.red : i / n > 0.4 ? C.tracer : U.sound);
        return <rect key={i} x={x - 30} y={y - ((i + 1) * h) / n} width={60} height={h / n - 5} rx={2} fill={on ? c : "rgba(255,255,255,0.08)"} />;
      })}
      {label ? <Label x={x} y={y + 50} text={label} size={36} /> : null}
    </g>
  );
};

/** Half-circle speed dial. `v` current value, ticks every `step`, optional red line. */
export const Dial: React.FC<{ x: number; y: number; r?: number; v: number; max: number; step?: number; red?: number; unit?: string }> = ({ x, y, r = 240, v, max, step = 5, red, unit = "KN" }) => {
  const ang = (k: number) => Math.PI + (k / max) * Math.PI;
  const pt = (k: number, rr: number) => [x + rr * Math.cos(ang(k)), y + rr * Math.sin(ang(k))];
  const [nx, ny] = pt(v, r * 0.86);
  const ticks: number[] = [];
  for (let k = 0; k <= max; k += step) ticks.push(k);
  return (
    <g>
      <path d={`M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x + r} ${y}`} fill="#0b1a24" stroke="#5f7d8f" strokeWidth={5} />
      {red !== undefined ? <path d={`M ${pt(red, r - 10)[0]} ${pt(red, r - 10)[1]} A ${r - 10} ${r - 10} 0 0 1 ${x + r - 10} ${y}`} fill="none" stroke={C.red} strokeWidth={16} opacity={0.8} /> : null}
      {ticks.map((k) => {
        const [a, b] = pt(k, r - 26);
        const [c, d] = pt(k, r - 4);
        const [tx, ty] = pt(k, r - 62);
        return (
          <g key={k}>
            <line x1={a} y1={b} x2={c} y2={d} stroke="#cfe2ee" strokeWidth={3} />
            <text x={tx} y={ty + 12} textAnchor="middle" fill="#cfe2ee" fontFamily={COND} fontWeight={700} fontSize={34}>
              {k}
            </text>
          </g>
        );
      })}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={C.tracer} strokeWidth={7} strokeLinecap="round" />
      <circle cx={x} cy={y} r={16} fill={C.tracer} />
      <text x={x} y={y + 62} textAnchor="middle" fill={C.muted} fontFamily={COND} fontWeight={700} fontSize={40} letterSpacing={4}>
        {unit}
      </text>
    </g>
  );
};

/** A plain report on the desk, with lines of grey "text". */
export const Doc: React.FC<{ x: number; y: number; p: number; w?: number; h?: number; lines?: number; title?: string }> = ({ x, y, p, w = 560, h = 720, lines = 11, title }) =>
  p > 0 ? (
    <g transform={`translate(${x} ${y + (1 - p) * 40}) rotate(${-2 + p * 1})`} opacity={p}>
      <rect x={-w / 2 + 10} y={-h / 2 + 12} width={w} height={h} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#dfe4e2" />
      {title ? (
        <text x={0} y={-h / 2 + 76} textAnchor="middle" fill="#1b2730" fontFamily={COND} fontWeight={800} fontSize={58} letterSpacing={3}>
          {title}
        </text>
      ) : null}
      {Array.from({ length: lines }).map((_, i) => (
        <rect key={i} x={-w / 2 + 50} y={-h / 2 + 130 + i * 48} width={(w - 100) * (0.65 + 0.35 * random(`doc${i}`))} height={14} fill="#8d979b" />
      ))}
    </g>
  ) : null;

export const Stamp: React.FC<{ x: number; y: number; text: string; p: number; size?: number; a?: number; color?: string }> = ({ x, y, text, p, size = 90, a = -8, color = C.red }) =>
  p > 0 ? (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${interpolate(p, [0, 1], [1.5, 1], CLAMP)})`} opacity={p}>
      <rect x={(-text.length * size * 0.5) / 2 - 26} y={-size * 0.8} width={text.length * size * 0.5 + 52} height={size * 1.2} fill="rgba(3,9,15,0.82)" stroke={color} strokeWidth={8} rx={6} />
      <text x={0} y={size * 0.1} textAnchor="middle" fill={color} fontFamily={COND} fontWeight={800} fontSize={size} letterSpacing={4}>
        {text}
      </text>
    </g>
  ) : null;

/** Pulsing map pin. */
export const Pin: React.FC<{ g: number; x: number; y: number; p?: number; color?: string; label?: string; side?: "left" | "right"; at?: number }> = ({ g, x, y, p = 1, color = C.tracer, label, side = "right", at = 0 }) =>
  p > 0 ? (
    <g opacity={p}>
      <circle cx={x} cy={y} r={12} fill={color} />
      <circle cx={x} cy={y} r={14 + (((g - at) * 1.1) % 60)} fill="none" stroke={color} strokeWidth={3} opacity={1 - (((g - at) * 1.1) % 60) / 60} />
      {label ? <Label x={side === "right" ? x + 30 : x - 30} y={y + 14} text={label} anchor={side === "right" ? "start" : "end"} size={42} color={color} /> : null}
    </g>
  ) : null;

export { ease };
