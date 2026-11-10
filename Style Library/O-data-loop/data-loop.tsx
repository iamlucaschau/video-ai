/**
 * Style O "Data Loop" kit (Lucas approved 2026-11-09, Test/Mapped Earth/BAO-CAO.md D1–D8).
 * One cycle of real data (a year, a week) drawn as light on a dark relief globe; no voice, no camera cuts,
 * the last frame flows back into the first. Data is prepared by `scripts/data-loop.py` into public/data-loop/<slug>/.
 * Contract: studio/KIT-CONTRACT.md.
 */
import { useEffect, useRef, useState } from "react";
import { AbsoluteFill, Img, continueRender, delayRender, interpolate, staticFile } from "remotion";
import { CANVAS, CX, FONT, SAFE, SUB_BOTTOM, pop, prog, CLAMP } from "../kit-common";
import type { SubSkin } from "../subs";

/** Roles. Birds and the accent are per-species / per-project (Style Library §2.3). */
export const O = {
  bg: "#030B16", // sea and the space beyond the globe
  land: "#232C42", // land base before relief (baked into base.png by data-loop.py)
  ink: "#EEF2F7", // every word
  dim: "#9AA6B8", // credit line, month ticks
  bird: "#FFA3BC", // birds on the move: pale pink trails (additive, cores burn white)
  rest: "#FF5A3C", // birds at rest + the density glow ("bright: many birds")
  accent: "#FFB46B", // season word, clock arc
  swatches: ["#030B16", "#232C42", "#EEF2F7", "#9AA6B8", "#FFA3BC", "#FF5A3C", "#FFB46B"],
} as const;

/** What data-loop.py writes to flock.json. */
export type FlockInfo = {
  slug: string;
  common: string;
  sci: string;
  birds: number;
  days: number;
  fps: number;
  seconds: number;
  canvas: number[]; // [w, h] of base.png and of the flock's pixel space
  cam: number[][]; // per day [ox, oy]: where the 1080×1920 frame sits on the canvas
  startDay: number;
  frameDay: number[];
  meanLat: number[];
  move: number[];
  sampled: number;
  cite: string;
};

/** Frame offset on the canvas at fractional `day` (D5: the frame slides slowly after the flock; no zoom). */
export const camAt = (info: FlockInfo, day: number): [number, number] => {
  const n = info.cam.length;
  const d0 = Math.floor(day);
  const k = day - d0;
  const a = info.cam[((d0 % n) + n) % n];
  const b = info.cam[(((d0 + 1) % n) + n) % n];
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
};

/** Relief globe baked by `data-loop.py terrain` on the big canvas, shifted by the camera (frame 0 is never black). */
export const Base: React.FC<{ slug?: string; info?: FlockInfo; cam?: [number, number] }> = ({ slug, info, cam = [0, 0] }) => (
  <AbsoluteFill style={{ background: O.bg, overflow: "hidden" }}>
    {slug && (
      <Img
        src={staticFile(`data-loop/${slug}/base.png`)}
        style={{ position: "absolute", left: -cam[0], top: -cam[1], width: info?.canvas[0] ?? CANVAS.width, height: info?.canvas[1] ?? CANVAS.height }}
      />
    )}
  </AbsoluteFill>
);

/** A cut-out photo of the subject (T13), bottom edge at y; credit it in the Credit block. */
export const SubjectPhoto: React.FC<{ src: string; x: number; y: number; height: number }> = ({ src, x, y, height }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", left: x, top: y - height, height, filter: `drop-shadow(0 6px 18px ${O.bg})` }} />
);

const cache = new Map<string, Int16Array>();

/** flock.bin: int16 (days × birds × 2) pixel positions; loaded once per render process. */
const useFlock = (slug: string) => {
  const [data, setData] = useState<Int16Array | null>(() => cache.get(slug) ?? null);
  const [handle] = useState(() => (cache.has(slug) ? null : delayRender(`flock ${slug}`)));
  useEffect(() => {
    if (!handle) return;
    fetch(staticFile(`data-loop/${slug}/flock.bin`))
      .then((r) => r.arrayBuffer())
      .then((b) => {
        const a = new Int16Array(b);
        cache.set(slug, a);
        setData(a);
        continueRender(handle);
      });
  }, [handle, slug]);
  return data;
};

/**
 * T2: the simulated flock. Each bird is a trail of its last `tail` days, older segments fainter, drawn with
 * additive light so crowded places glow. Birds that barely move are red-orange dots, birds on the move pale pink;
 * every bird also adds a faint red-orange halo, so dense places glow ("bright: many birds").
 * `day` is fractional (0–365, wraps), from info.frameDay[frame]; `cam` shifts the canvas under the frame.
 */
export const Flock: React.FC<{ slug: string; info: FlockInfo; day: number; cam?: [number, number]; tail?: number; width?: number; maxStep?: number }> = ({
  slug,
  info,
  day,
  cam = [0, 0],
  tail = 9,
  width = 1.2,
  maxStep = 90,
}) => {
  const data = useFlock(slug);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx || !data) return;
    const { birds: n, days } = info;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.setTransform(1, 0, 0, 1, -cam[0], -cam[1]);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    // position of bird i at fractional day t (wraps around the year)
    const at = (i: number, t: number): [number, number] => {
      const t0 = Math.floor(t);
      const k = t - t0;
      const a = (((t0 % days) + days) % days) * n * 2 + i * 2;
      const b = ((((t0 + 1) % days) + days) % days) * n * 2 + i * 2;
      return [data[a] + (data[b] - data[a]) * k, data[a + 1] + (data[b + 1] - data[a + 1]) * k];
    };
    // halo first: a soft density glow under everything
    ctx.fillStyle = O.rest;
    ctx.globalAlpha = 0.035;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const [x, y] = at(i, day);
      ctx.moveTo(x + 7, y);
      ctx.arc(x, y, 7, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.strokeStyle = O.bird;
    for (let s = 0; s < tail; s++) {
      ctx.globalAlpha = 0.16 * (1 - s / tail);
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const [x0, y0] = at(i, day - s);
        const [x1, y1] = at(i, day - s - 1);
        const step = Math.abs(x1 - x0) + Math.abs(y1 - y0);
        // resting birds leave no trail (only their dot); a jump of > maxStep px in one day is a simulation leap between
        // two clusters where sightings are thin, not a flight path: drawn, it hatches the map with long straight lines
        if (step < 1.5 || step > maxStep) continue;
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }
      ctx.stroke();
    }
    for (const moving of [false, true]) {
      ctx.fillStyle = moving ? O.bird : O.rest;
      ctx.globalAlpha = moving ? 0.45 : 0.55;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const [x, y] = at(i, day);
        const [px, py] = at(i, day - 1);
        if (Math.abs(x - px) + Math.abs(y - py) >= 3 !== moving) continue;
        ctx.rect(x - 1, y - 1, 2, 2);
      }
      ctx.fill();
    }
  }, [data, info, day, cam, tail, width, maxStep]);
  return <canvas ref={ref} width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0 }} />;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_START = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

/** "Aug 12" for day of year 0–364 (non-leap). */
export const dateLabel = (day: number) => {
  const d = ((Math.floor(day) % 365) + 365) % 365;
  let m = 11;
  while (MONTH_START[m] > d) m--;
  return `${MONTHS[m]} ${d - MONTH_START[m] + 1}`;
};

/** T4: year clock, month ticks round a ring, the arc fills from Jan 1, the date in the middle. Centre (x, y); keep r ≥ 96 so a 48 px date fits; the month ticks reach r + 26. */
export const YearClock: React.FC<{ day: number; x: number; y: number; r?: number }> = ({ day, x, y, r = 92 }) => {
  const a = ((day % 365) / 365) * Math.PI * 2;
  const arc = (ang: number) => [x + r * Math.sin(ang), y - r * Math.cos(ang)];
  const [ex, ey] = arc(a);
  return (
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute", inset: 0 }}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={`${O.ink}33`} strokeWidth={10} />
      <path d={`M ${x} ${y - r} A ${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${ex} ${ey}`} fill="none" stroke={O.ink} strokeWidth={10} strokeLinecap="round" />
      {Array.from({ length: 12 }, (_, i) => {
        // month ticks, not letters: no text under 48 px besides the credit line (D4)
        const t = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={x + (r + 10) * Math.sin(t)}
            y1={y - (r + 10) * Math.cos(t)}
            x2={x + (r + (i % 3 ? 18 : 26)) * Math.sin(t)}
            y2={y - (r + (i % 3 ? 18 : 26)) * Math.cos(t)}
            stroke={O.dim}
            strokeWidth={i % 3 ? 3 : 5}
            strokeLinecap="round"
          />
        );
      })}
      <text x={x} y={y + r * 0.18} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={Math.max(48, r * 0.5)} fill={O.ink}>
        {dateLabel(day)}
      </text>
    </svg>
  );
};

/**
 * Season word from the flock's own movement: "Autumn" while it flows south, "Spring" while it flows north,
 * faded out when the mean latitude barely moves. Returns the word and its opacity.
 */
export const season = (info: FlockInfo, day: number): { word: string; opacity: number } => {
  const d = ((Math.round(day) % 365) + 365) % 365;
  const lat = (k: number) => info.meanLat[(((d + k) % 365) + 365) % 365];
  const v = (lat(14) - lat(-2)) / 16; // degrees per day, looking ~2 weeks ahead: the word is up as the season turns (frame 0 too)
  const max = Math.max(...info.meanLat.map((l, i) => Math.abs(info.meanLat[(i + 1) % 365] - l)));
  return { word: v < 0 ? "Autumn" : "Spring", opacity: interpolate(Math.abs(v), [0.1 * max, 0.22 * max], [0, 1], CLAMP) };
};

/** Season word, big sans (no display serif: AGENTS short-form rule 3). */
export const SeasonWord: React.FC<{ word: string; opacity: number; x: number; y: number }> = ({ word, opacity, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity, fontFamily: FONT, fontWeight: 800, fontSize: 104, color: O.accent, letterSpacing: -1, textShadow: `0 4px 24px ${O.bg}` }}>
    {word}
  </div>
);

/** Two-tier title: small caps kicker (48 px) over the subject (96 px). Top-left corner (x, y). */
export const TitleBlock: React.FC<{ kicker: string; title: string; x: number; y: number }> = ({ kicker, title, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, color: O.ink, textShadow: `0 3px 18px ${O.bg}` }}>
    <div style={{ fontWeight: 800, fontSize: 48, letterSpacing: 3, color: O.dim }}>{kicker}</div>
    <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1.0 }}>{title}</div>
  </div>
);

/** Source / method lines. The one text allowed under 48 px (style O exception, D4): ≥ 24 px, inside the safe zone. */
export const Credit: React.FC<{ lines: string[]; x: number; y: number }> = ({ lines, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 700, fontSize: 24, lineHeight: 1.3, color: O.dim, textShadow: `0 2px 8px ${O.bg}` }}>
    {lines.map((l) => (
      <div key={l}>{l}</div>
    ))}
  </div>
);

/** Keyword or number (≤ 5 words, ≥ 56 px), pops in at frame `at`; x is the centre, kept inside the safe zone by the caller. */
export const Chip: React.FC<{ text: string; f: number; at: number; y: number; x?: number }> = ({ text, f, at, y, x = CX }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: pop(f, at),
      opacity: prog(f, at, 4),
      padding: "14px 32px",
      borderRadius: 14,
      background: `${O.bg}CC`,
      border: `2px solid ${O.ink}55`,
      color: O.ink,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 64,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/** Karaoke subtitle skin, for a narrated Data Loop film later (the silent loop has no subtitles, D2). */
export const DataLoopSub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.12, textAlign: "center" }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {ln.map((w, k) => (
            <span key={k} style={{ color: w.said ? (w.key ? O.accent : O.ink) : `${O.ink}66`, WebkitTextStroke: `8px ${O.bg}`, paintOrder: "stroke fill" }}>
              {k ? " " : ""}
              {w.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
