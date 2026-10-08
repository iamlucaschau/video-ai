/**
 * MAP STORY — reusable Remotion kit for 9:16 map explainers.
 * Style guide: ./README.md. First used: Poor vs Rich Daily Ep02 (style E).
 *
 * A dark, flat, top-down map; areas light up in a colour (fill + glow +
 * hatch), routes draw themselves, round-head avatars stand in for people,
 * short keyword/number tags, a numbered step title, big stamps for the
 * key numbers. The camera is fixed except for explicit flights between
 * places (one eased move of FLIGHT frames, no shake, no drift).
 *
 * World units: at zoom 1 one unit = one screen px, and the camera's
 * (x, y) is drawn at CENTER, the centre of the platform safe zone.
 * Self-contained: needs only remotion + @remotion/google-fonts.
 */
import { loadFont } from "@remotion/google-fonts/BricolageGrotesque";
import { createContext, useContext } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";

// ------------------------------------------------------------------ constants

export const CANVAS = { width: 1080, height: 1920 } as const;
/** Platform UI (Reels / TikTok / Shorts): keep every word, number and face inside. */
export const SAFE = { top: 220, bottom: 480, left: 60, right: 140 } as const;
export const CENTER = {
  x: (SAFE.left + CANVAS.width - SAFE.right) / 2,
  y: (SAFE.top + CANVAS.height - SAFE.bottom) / 2,
};
/** Length of a camera flight, frames. */
export const FLIGHT = 26;

export const FONT = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const PALETTE = {
  land: "#46523F",
  block: "#505D48",
  road: "#2E3741",
  roadLine: "#8A939C",
  water: "#132847",
  house: "#6E7568",
  roof: "#C9C1B0",
  roofShade: "#A99F8C",
  ink: "#1B232B",
  white: "#F4F1EA",
  slate: "#263238",
  highlight: "#FFD54F",
  /** default pair for "two sides" stories; override per project */
  a: "#D32F2F",
  b: "#388E3C",
} as const;

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const prog = (
  f: number,
  at: number,
  d: number,
  easing: (t: number) => number = Easing.out(Easing.cubic),
) => interpolate(f, [at, at + d], [0, 1], { ...CLAMP, easing });
const pop = (f: number, at: number) =>
  interpolate(f, [at, at + 5, at + 10], [0.6, 1.04, 1], CLAMP);
const fadeOut = (f: number, out?: number) =>
  out === undefined ? 1 : 1 - prog(f, out, 6);

// ------------------------------------------------------------------ camera

export type Cam = { at: number; x: number; y: number; z: number };

/** Camera at frame f: each key flies in from wherever the camera is (eased, zoom geometric). */
export const camAt = (keys: Cam[], f: number): Cam => {
  let cur = keys[0];
  for (const k of keys.slice(1)) {
    if (f < k.at) break;
    const t = prog(f, k.at, FLIGHT, Easing.inOut(Easing.cubic));
    cur = {
      at: k.at,
      x: cur.x + (k.x - cur.x) * t,
      y: cur.y + (k.y - cur.y) * t,
      z: cur.z * (k.z / cur.z) ** t,
    };
  }
  return cur;
};

const CamCtx = createContext<Cam>({ at: 0, x: 0, y: 0, z: 1 });
/** World point → screen point under the current camera. */
export const useAnchor = (wx: number, wy: number): [number, number] => {
  const c = useContext(CamCtx);
  return [CENTER.x + (wx - c.x) * c.z, CENTER.y + (wy - c.y) * c.z];
};

/**
 * The map. `base` = the static map (e.g. <Town/>), `world` = animated layers
 * in world units (areas, routes, avatars), children = screen-space overlays.
 */
export const MapScene: React.FC<{
  cams: Cam[];
  base: React.ReactNode;
  world?: React.ReactNode;
  children?: React.ReactNode;
  background?: string;
}> = ({ cams, base, world, children, background = PALETTE.land }) => {
  const f = useCurrentFrame();
  const cam = camAt(cams, f);
  return (
    <CamCtx.Provider value={cam}>
      <AbsoluteFill style={{ background }}>
        <svg
          width={CANVAS.width}
          height={CANVAS.height}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <filter id="ms-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation={10} />
            </filter>
          </defs>
          <g
            transform={`translate(${CENTER.x} ${CENTER.y}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}
          >
            {base}
            {world}
          </g>
        </svg>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 75% 60% at 46% 43%, transparent 55%, rgba(5,10,16,0.75) 100%)",
          }}
        />
        {children}
      </AbsoluteFill>
    </CamCtx.Provider>
  );
};

// ------------------------------------------------------------------ base map

/**
 * A generic town: blocks between a grid of roads, faint house footprints,
 * then `water` (and anything else) drawn on top. `keepClear(x0, y0)` returns
 * true for blocks (by their top-left road crossing) that should stay empty
 * so the story's own lots can be drawn there.
 */
export const Town: React.FC<{
  vRoads: number[];
  hRoads: number[];
  roadWidth?: number;
  keepClear?: (x0: number, y0: number) => boolean;
  children?: React.ReactNode;
}> = ({
  vRoads,
  hRoads,
  roadWidth = 90,
  keepClear = () => false,
  children,
}) => {
  const xs = [-4200, ...vRoads, 4200];
  const ys = [-5200, ...hRoads, 3600];
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < xs.length - 1; i++)
    for (let j = 0; j < ys.length - 1; j++) {
      const x0 = xs[i] + roadWidth / 2 + 18;
      const y0 = ys[j] + roadWidth / 2 + 18;
      const w = xs[i + 1] - xs[i] - roadWidth - 36;
      const h = ys[j + 1] - ys[j] - roadWidth - 36;
      blocks.push(
        <rect
          key={`b${i}-${j}`}
          x={x0}
          y={y0}
          width={w}
          height={h}
          rx={22}
          fill={PALETTE.block}
        />,
      );
      if (keepClear(xs[i], ys[j])) continue;
      for (let n = 0; n < 6; n++) {
        const s = `${i}-${j}-${n}`;
        const hw = 70 + random(`hw${s}`) * 70;
        const hh = 60 + random(`hh${s}`) * 50;
        blocks.push(
          <rect
            key={`h${s}`}
            x={x0 + 30 + random(`hx${s}`) * Math.max(0, w - hw - 60)}
            y={y0 + 30 + random(`hy${s}`) * Math.max(0, h - hh - 60)}
            width={hw}
            height={hh}
            rx={6}
            fill={PALETTE.house}
            opacity={0.55}
          />,
        );
      }
    }
  return (
    <g>
      <rect
        x={-5000}
        y={-6000}
        width={10000}
        height={11000}
        fill={PALETTE.land}
      />
      {blocks}
      {vRoads.map((x) => (
        <rect
          key={`v${x}`}
          x={x - roadWidth / 2}
          y={-6000}
          width={roadWidth}
          height={11000}
          fill={PALETTE.road}
        />
      ))}
      {hRoads.map((y) => (
        <g key={`r${y}`}>
          <rect
            x={-5000}
            y={y - roadWidth / 2}
            width={10000}
            height={roadWidth}
            fill={PALETTE.road}
          />
          <line
            x1={-5000}
            y1={y}
            x2={5000}
            y2={y}
            stroke={PALETTE.roadLine}
            strokeWidth={5}
            strokeDasharray="34 30"
            opacity={0.5}
          />
        </g>
      ))}
      {children}
    </g>
  );
};

/** A house seen from above (two-tone roof with a ridge), centred on (x, y). */
export const Roof: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
}> = ({ x, y, w = 160, h = 110 }) => (
  <g>
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      rx={6}
      fill={PALETTE.roof}
    />
    <rect
      x={x - w / 2}
      y={y}
      width={w}
      height={h / 2}
      rx={6}
      fill={PALETTE.roofShade}
    />
    <line
      x1={x - w / 2}
      y1={y}
      x2={x + w / 2}
      y2={y}
      stroke={PALETTE.ink}
      strokeOpacity={0.35}
      strokeWidth={4}
    />
  </g>
);

// ------------------------------------------------------------------ world layers

export type Rect = { x: number; y: number; w: number; h: number };

/** Light an area: colour fill + glowing outline (hatched while `hatch`), or a dashed "empty slot". */
export const Area: React.FC<{
  rect: Rect;
  at: number;
  out?: number;
  color: string;
  hatch?: boolean;
  dashed?: boolean;
}> = ({ rect: r, at, out, color, hatch, dashed }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = prog(f, at, 8) * fadeOut(f, out);
  if (o <= 0) return null;
  if (dashed)
    return (
      <rect
        x={r.x + 6}
        y={r.y + 6}
        width={r.w - 12}
        height={r.h - 12}
        rx={12}
        fill="none"
        stroke={PALETTE.white}
        strokeWidth={6}
        strokeDasharray="22 16"
        opacity={0.7 * o}
      />
    );
  const id = `ms-hatch-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <g opacity={o}>
      <defs>
        <pattern
          id={id}
          width={22}
          height={22}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width={22} height={22} fill={color} opacity={0.55} />
          <rect width={8} height={22} fill={color} opacity={0.9} />
        </pattern>
      </defs>
      <rect
        x={r.x}
        y={r.y}
        width={r.w}
        height={r.h}
        rx={14}
        fill="none"
        stroke={color}
        strokeWidth={22}
        filter="url(#ms-glow)"
      />
      <rect
        x={r.x}
        y={r.y}
        width={r.w}
        height={r.h}
        rx={14}
        fill={hatch ? `url(#${id})` : color}
        opacity={hatch ? 1 : 0.6}
      />
      <rect
        x={r.x}
        y={r.y}
        width={r.w}
        height={r.h}
        rx={14}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.85}
        strokeWidth={5}
      />
    </g>
  );
};

/** A strip (road stretch, border) that grows from its middle. */
export const Strip: React.FC<{
  at: number;
  out?: number;
  rect: Rect;
  color?: string;
  opacity?: number;
}> = ({ at, out, rect: r, color = PALETTE.highlight, opacity = 0.45 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 12);
  return (
    <rect
      x={r.x + (r.w / 2) * (1 - p)}
      y={r.y}
      width={r.w * p}
      height={r.h}
      fill={color}
      opacity={opacity * fadeOut(f, out)}
    />
  );
};

const lengthOf = (pts: [number, number][]) =>
  pts
    .slice(1)
    .reduce((a, p, i) => a + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** Point at fraction t along a polyline. */
export const along = (pts: [number, number][], t: number): [number, number] => {
  let d = lengthOf(pts) * Math.min(1, Math.max(0, t));
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(
      pts[i][0] - pts[i - 1][0],
      pts[i][1] - pts[i - 1][1],
    );
    if (d <= seg) {
      const k = seg ? d / seg : 0;
      return [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k,
      ];
    }
    d -= seg;
  }
  return pts[pts.length - 1];
};

/** Dashed route that draws itself over `dur` frames (world units). */
export const Route: React.FC<{
  at: number;
  out?: number;
  pts: [number, number][];
  color: string;
  width?: number;
  dur?: number;
}> = ({ at, out, pts, color, width = 14, dur = 30 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const len = lengthOf(pts);
  const p = prog(f, at, dur, Easing.inOut(Easing.cubic));
  const id = `ms-route-${at}-${pts.length}-${Math.round(pts[0][0])}`;
  const d = `M ${pts.map((q) => q.join(" ")).join(" L ")}`;
  return (
    <g opacity={fadeOut(f, out)}>
      <mask
        id={id}
        maskUnits="userSpaceOnUse"
        x={-6000}
        y={-6000}
        width={12000}
        height={12000}
      >
        <path
          d={d}
          stroke="#fff"
          strokeWidth={width * 3}
          fill="none"
          strokeDasharray={`${len * p} ${len}`}
          strokeLinecap="round"
        />
      </mask>
      <path
        d={d}
        stroke={color}
        strokeWidth={width}
        fill="none"
        strokeDasharray={`${width * 2.4} ${width * 1.6}`}
        strokeLinecap="round"
        mask={`url(#${id})`}
      />
    </g>
  );
};

/** Top-down vehicle driving along a route. */
export const Vehicle: React.FC<{
  at: number;
  pts: [number, number][];
  dur?: number;
  color: string;
  scale?: number;
}> = ({ at, pts, dur = 30, color, scale = 1 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const t = prog(f, at, dur, Easing.inOut(Easing.cubic));
  const [x, y] = along(pts, t);
  const [nx, ny] = along(pts, Math.min(1, t + 0.01));
  const a = (Math.atan2(ny - y, nx - x) * 180) / Math.PI;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${t >= 1 ? 0 : a}) scale(${scale})`}
    >
      <rect x={-60} y={-32} width={84} height={64} rx={8} fill={color} />
      <rect x={28} y={-32} width={38} height={64} rx={10} fill={color} />
      <rect x={42} y={-24} width={18} height={48} rx={4} fill="#B3E5FC" />
    </g>
  );
};

const HAIR = {
  messy:
    "M -56 -4 L -48 -44 L -30 -34 L -20 -62 L 0 -44 L 16 -64 L 26 -40 L 46 -50 L 56 -4 Q 0 -30 -56 -4 Z",
  neat: "M -56 -6 Q -52 -62 0 -64 Q 52 -62 56 -6 Q 30 -40 -56 -6 Z",
  gray: "M -54 -10 Q -46 -60 0 -62 Q 46 -60 54 -10 Q 0 -38 -54 -10 Z",
  cap: "M -56 -8 Q -50 -64 0 -66 Q 50 -64 56 -8 L 76 -2 L 70 -16 Q 56 -70 0 -70 Q -60 -70 -62 -10 Z",
} as const;
const HAIR_COLOR: Record<keyof typeof HAIR, string> = {
  messy: "#3A2A20",
  neat: "#4E342E",
  gray: "#9E9E9E",
  cap: "#37474F",
};
const MOUTH = {
  happy: "M -22 14 Q 0 34 22 14",
  sad: "M -20 26 Q 0 10 20 26",
  flat: "M -18 20 L 18 20",
} as const;

/** Round-head avatar (world units). `ring` carries the side colour; it pops in, blinks, talks. */
export const Avatar: React.FC<{
  x: number;
  y: number;
  ring: string;
  hair?: keyof typeof HAIR;
  at?: number;
  out?: number;
  mood?: keyof typeof MOUTH;
  talk?: boolean;
}> = ({ x, y, ring, hair = "neat", at = -999, out, mood = "flat", talk }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = fadeOut(f, out);
  if (o <= 0) return null;
  const open = talk && Math.floor(f / 4) % 2 === 0;
  const blink = (f + Math.abs(x)) % 101 < 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${pop(f, at)})`} opacity={o}>
      <ellipse cx={0} cy={70} rx={58} ry={14} fill="#000" opacity={0.35} />
      <circle r={66} fill={ring} />
      <circle r={56} fill="#E9B48A" />
      <path d={HAIR[hair]} fill={HAIR_COLOR[hair]} />
      {blink ? (
        <g stroke={PALETTE.ink} strokeWidth={5} strokeLinecap="round">
          <path d="M -26 0 h 14" />
          <path d="M 12 0 h 14" />
        </g>
      ) : (
        <g fill={PALETTE.ink}>
          <circle cx={-19} cy={0} r={6.5} />
          <circle cx={19} cy={0} r={6.5} />
        </g>
      )}
      {open ? (
        <ellipse cx={0} cy={22} rx={11} ry={9} fill={PALETTE.ink} />
      ) : (
        <path
          d={MOUTH[mood]}
          stroke={PALETTE.ink}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

// ------------------------------------------------------------------ screen overlays (≥ 48 px, ≤ 5 words)

const label: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 800,
  whiteSpace: "nowrap",
  lineHeight: 1.1,
};

/** Coloured pill anchored to a world point (centred above it). */
export const Tag: React.FC<{
  at: number;
  out?: number;
  wx: number;
  wy: number;
  color: string;
  children: React.ReactNode;
  size?: number;
  text?: string;
}> = ({ at, out, wx, wy, color, children, size = 56, text = "#fff" }) => {
  const f = useCurrentFrame();
  const [x, y] = useAnchor(wx, wy);
  if (f < at) return null;
  const o = Math.min(1, prog(f, at, 4)) * fadeOut(f, out);
  if (o <= 0) return null;
  return (
    <div
      style={{
        ...label,
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -100%",
        scale: String(pop(f, at)),
        transformOrigin: "50% 100%",
        opacity: o,
        background: color,
        color: text,
        fontSize: size,
        padding: `${size * 0.12}px ${size * 0.42}px ${size * 0.18}px`,
        borderRadius: size * 0.5,
        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
};

export type TagStep = { at: number; text: React.ReactNode; color: string };

/** A tag whose text changes (and re-pops) at each step. */
export const TagSteps: React.FC<{
  wx: number;
  wy: number;
  steps: TagStep[];
  out?: number;
  size?: number;
}> = ({ wx, wy, steps, out, size }) => {
  const f = useCurrentFrame();
  const cur = [...steps].reverse().find((s) => f >= s.at);
  if (!cur) return null;
  return (
    <Tag
      key={cur.at}
      at={cur.at}
      out={out}
      wx={wx}
      wy={wy}
      color={cur.color}
      size={size}
    >
      {cur.text}
    </Tag>
  );
};

/** Big keyword/number stamp with a ring ripple — for the one number that matters. */
export const Stamp: React.FC<{
  at: number;
  out?: number;
  wx: number;
  wy: number;
  color: string;
  children: React.ReactNode;
}> = ({ at, out, wx, wy, color, children }) => {
  const f = useCurrentFrame();
  const [x, y] = useAnchor(wx, wy);
  if (f < at) return null;
  const o = fadeOut(f, out);
  if (o <= 0) return null;
  const r = prog(f, at, 18);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 260 * (0.6 + r),
          top: y - 260 * (0.6 + r),
          width: 520 * (0.6 + r),
          height: 520 * (0.6 + r),
          borderRadius: "50%",
          border: `6px solid ${PALETTE.white}`,
          opacity: (1 - r) * 0.7 * o,
        }}
      />
      <div
        style={{
          ...label,
          position: "absolute",
          left: x,
          top: y,
          translate: "-50% -50%",
          scale: String(
            interpolate(f, [at, at + 4, at + 9], [1.25, 0.97, 1], CLAMP),
          ),
          opacity: Math.min(1, prog(f, at, 3)) * o,
          background: color,
          color: "#fff",
          fontSize: 96,
          padding: "10px 46px 18px",
          borderRadius: 60,
          boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
        }}
      >
        {children}
      </div>
    </>
  );
};

/** Numbered step title at the top of the safe zone: ① TRADE IT. */
export const StepTitle: React.FC<{
  at: number;
  out?: number;
  n?: number;
  color: string;
  children: React.ReactNode;
}> = ({ at, out, n, color, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = Math.min(1, prog(f, at, 5)) * fadeOut(f, out);
  if (o <= 0) return null;
  return (
    <div
      style={{
        ...label,
        position: "absolute",
        left: CENTER.x,
        top: SAFE.top + 40,
        translate: `-50% ${(1 - prog(f, at, 8)) * -20}px`,
        opacity: o,
        display: "flex",
        alignItems: "center",
        gap: 20,
        fontSize: 64,
        color: PALETTE.white,
        textShadow: "0 4px 16px rgba(0,0,0,0.6)",
      }}
    >
      {n !== undefined ? (
        <span
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
            textShadow: "none",
          }}
        >
          {n}
        </span>
      ) : null}
      {children}
    </div>
  );
};

/** White speech bubble above a world point. */
export const Bubble: React.FC<{
  at: number;
  out?: number;
  wx: number;
  wy: number;
  children: React.ReactNode;
}> = ({ at, out, wx, wy, children }) => {
  const f = useCurrentFrame();
  const [x, y] = useAnchor(wx, wy);
  if (f < at) return null;
  const o = Math.min(1, prog(f, at, 4)) * fadeOut(f, out);
  if (o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: "-50% -100%",
        scale: String(pop(f, at)),
        transformOrigin: "50% 100%",
        opacity: o,
      }}
    >
      <div
        style={{
          ...label,
          background: PALETTE.white,
          color: PALETTE.ink,
          fontSize: 52,
          padding: "8px 32px 14px",
          borderRadius: 30,
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        {children}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          margin: "-2px auto 0",
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: `22px solid ${PALETTE.white}`,
        }}
      />
    </div>
  );
};

/** Round icon badge (no text) anchored to a world point; `cross` strikes it out. */
export const IconDot: React.FC<{
  at: number;
  out?: number;
  wx: number;
  wy: number;
  children: React.ReactNode;
  cross?: number;
}> = ({ at, out, wx, wy, children, cross }) => {
  const f = useCurrentFrame();
  const [x, y] = useAnchor(wx, wy);
  if (f < at) return null;
  const o = fadeOut(f, out);
  if (o <= 0) return null;
  const c = cross === undefined ? 0 : prog(f, cross, 6);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 60,
        top: y - 60,
        width: 120,
        height: 120,
        borderRadius: 60,
        background: PALETTE.white,
        padding: 18,
        boxSizing: "border-box",
        scale: String(pop(f, at)),
        opacity: o,
        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
      }}
    >
      {children}
      {c > 0
        ? [45, -45].map((r) => (
            <div
              key={r}
              style={{
                position: "absolute",
                left: 60 - 70 * c,
                top: 52,
                width: 140 * c,
                height: 16,
                borderRadius: 8,
                background: PALETTE.a,
                rotate: `${r}deg`,
              }}
            />
          ))
        : null}
    </div>
  );
};

/** QA overlay: paints the platform-UI danger zones red (render with it, check, remove). */
export const SafeZoneGuide: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {[
      { left: 0, right: 0, top: 0, height: SAFE.top },
      { left: 0, right: 0, bottom: 0, height: SAFE.bottom },
      { left: 0, width: SAFE.left, top: SAFE.top, bottom: SAFE.bottom },
      { right: 0, width: SAFE.right, top: SAFE.top, bottom: SAFE.bottom },
    ].map((z, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          background: "rgba(255,0,60,0.35)",
          ...z,
        }}
      />
    ))}
  </AbsoluteFill>
);
