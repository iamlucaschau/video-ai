/**
 * Style E "Map Story": a dark, flat, top-down town map (after the two
 * Turkish map explainers in Test/phan-tich). Lots light up in side colours,
 * routes draw themselves, round-head avatars stand in for people, short
 * keyword/number tags sit in the safe zone. The camera is fixed except for
 * an explicit flight between two places (short-form rule 2): one eased move
 * of FLIGHT frames, no shake, no drift.
 *
 * World units: at zoom 1 one unit = one screen px and world (0, 0) sits at
 * the centre of the safe zone (CENTER). The client's street is at y = 170.
 */
import { createContext, useContext } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { FONT } from "../paper";
import { INK, PVR, SAFE } from "../theme";
import { prog } from "./chipTable";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const MAP = {
  land: "#46523F",
  block: "#505D48",
  lot: "#5C6D4D",
  road: "#2E3741",
  roadLine: "#8A939C",
  water: "#132847",
  house: "#6E7568",
  roof: "#C9C1B0",
  roofShade: "#A99F8C",
  ink: "#1B232B",
  white: "#F4F1EA",
} as const;

/** Centre of the safe zone: world (cam.x, cam.y) is drawn here. */
export const CENTER = {
  x: (SAFE.left + PVR.width - SAFE.right) / 2,
  y: (SAFE.top + PVR.height - SAFE.bottom) / 2,
};
export const FLIGHT = 26;
export const STREET_Y = 170;
export const LOT_X = [-310, 0, 310];
export const LOT = { w: 260, h: 300, top: -200 };
export const DEPOT = { x: -1430, y: -2330 };

export type Cam = { at: number; x: number; y: number; z: number };
export const STREET: Cam = { at: -999, x: 0, y: 0, z: 1 };
export const TOWN: Cam = { at: -999, x: -650, y: -1060, z: 0.3 };

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

const CamCtx = createContext<Cam>(STREET);
/** World point → screen point under the current camera. */
export const useAnchor = (wx: number, wy: number): [number, number] => {
  const c = useContext(CamCtx);
  return [CENTER.x + (wx - c.x) * c.z, CENTER.y + (wy - c.y) * c.z];
};

const pop = (f: number, at: number) =>
  interpolate(f, [at, at + 5, at + 10], [0.6, 1.04, 1], CLAMP);
const fadeOut = (f: number, out?: number) =>
  out === undefined ? 1 : 1 - prog(f, out, 6);

// ------------------------------------------------------------------ the town

const V_ROADS = [-1950, -1300, -650, 650, 1300, 1950];
const H_ROADS = [-2830, -2230, -1630, -1030, -430, STREET_Y, 770, 1370];
const ROAD_W = 90;

const BaseMap: React.FC = () => {
  const xs = [-4200, ...V_ROADS, 4200];
  const ys = [-5200, ...H_ROADS, 3600];
  const blocks: React.ReactNode[] = [];
  for (let i = 0; i < xs.length - 1; i++)
    for (let j = 0; j < ys.length - 1; j++) {
      const x0 = xs[i] + ROAD_W / 2 + 18;
      const y0 = ys[j] + ROAD_W / 2 + 18;
      const w = xs[i + 1] - xs[i] - ROAD_W - 36;
      const h = ys[j + 1] - ys[j] - ROAD_W - 36;
      blocks.push(
        <rect
          key={`b${i}-${j}`}
          x={x0}
          y={y0}
          width={w}
          height={h}
          rx={22}
          fill={MAP.block}
        />,
      );
      const lotsBlock = xs[i] === -650 && ys[j] === -430;
      if (lotsBlock) continue;
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
            fill={MAP.house}
            opacity={0.55}
          />,
        );
      }
    }
  return (
    <g>
      <rect x={-5000} y={-6000} width={10000} height={11000} fill={MAP.land} />
      {blocks}
      {V_ROADS.map((x) => (
        <rect
          key={`v${x}`}
          x={x - ROAD_W / 2}
          y={-6000}
          width={ROAD_W}
          height={11000}
          fill={MAP.road}
        />
      ))}
      {H_ROADS.map((y) => (
        <g key={`r${y}`}>
          <rect
            x={-5000}
            y={y - ROAD_W / 2}
            width={10000}
            height={ROAD_W}
            fill={MAP.road}
          />
          <line
            x1={-5000}
            y1={y}
            x2={5000}
            y2={y}
            stroke={MAP.roadLine}
            strokeWidth={5}
            strokeDasharray="34 30"
            opacity={0.5}
          />
        </g>
      ))}
      {/* river (top right) and lake (bottom left) swallow the roads */}
      <path
        d="M 900 -6000 C 1000 -3000, 2300 -2300, 2500 -1100 C 2620 -400, 3300 -200, 5000 -300 L 5000 -6000 Z"
        fill={MAP.water}
      />
      <ellipse cx={-2500} cy={1650} rx={1100} ry={560} fill={MAP.water} />
      {/* the three lots on the client's street */}
      {LOT_X.map((x) => (
        <g key={`lot${x}`}>
          <rect
            x={x - LOT.w / 2}
            y={LOT.top}
            width={LOT.w}
            height={LOT.h}
            rx={14}
            fill={MAP.lot}
          />
          <rect
            x={x - 80}
            y={LOT.top + 26}
            width={160}
            height={110}
            rx={6}
            fill={MAP.roof}
          />
          <rect
            x={x - 80}
            y={LOT.top + 81}
            width={160}
            height={55}
            rx={6}
            fill={MAP.roofShade}
          />
          <line
            x1={x - 80}
            y1={LOT.top + 81}
            x2={x + 80}
            y2={LOT.top + 81}
            stroke={MAP.ink}
            strokeOpacity={0.35}
            strokeWidth={4}
          />
        </g>
      ))}
      {/* the poor person's garage across town */}
      <rect
        x={DEPOT.x - 120}
        y={DEPOT.y - 90}
        width={240}
        height={170}
        rx={10}
        fill={MAP.roof}
      />
      <rect
        x={DEPOT.x - 120}
        y={DEPOT.y - 5}
        width={240}
        height={85}
        rx={10}
        fill={MAP.roofShade}
      />
    </g>
  );
};

const Defs: React.FC = () => (
  <defs>
    {[
      ["poor", INK.poor],
      ["rich", INK.rich],
    ].map(([id, c]) => (
      <pattern
        key={id}
        id={`hatch-${id}`}
        width={22}
        height={22}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width={22} height={22} fill={c} opacity={0.55} />
        <rect width={8} height={22} fill={c} opacity={0.9} />
      </pattern>
    ))}
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation={10} />
    </filter>
  </defs>
);

/** Map with camera; `world` is drawn in world units, children are screen-space overlays. */
export const MapScene: React.FC<{
  cams?: Cam[];
  world?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ cams = [STREET], world, children }) => {
  const f = useCurrentFrame();
  const cam = camAt(cams, f);
  return (
    <CamCtx.Provider value={cam}>
      <AbsoluteFill style={{ background: MAP.land }}>
        <svg
          width={PVR.width}
          height={PVR.height}
          style={{ position: "absolute", inset: 0 }}
        >
          <Defs />
          <g
            transform={`translate(${CENTER.x} ${CENTER.y}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}
          >
            <BaseMap />
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

// ------------------------------------------------------------------ world layers

/** Light a lot in a side colour: fill + glowing outline, hatched while `hatch`. */
export const LotMark: React.FC<{
  k: number;
  at: number;
  out?: number;
  side: "poor" | "rich";
  hatch?: boolean;
  dashed?: boolean;
}> = ({ k, at, out, side, hatch, dashed }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = prog(f, at, 8) * fadeOut(f, out);
  if (o <= 0) return null;
  const c = INK[side];
  const x = LOT_X[k] - LOT.w / 2;
  if (dashed)
    return (
      <rect
        x={x + 6}
        y={LOT.top + 6}
        width={LOT.w - 12}
        height={LOT.h - 12}
        rx={12}
        fill="none"
        stroke={MAP.white}
        strokeWidth={6}
        strokeDasharray="22 16"
        opacity={0.7 * o}
      />
    );
  return (
    <g opacity={o}>
      <rect
        x={x}
        y={LOT.top}
        width={LOT.w}
        height={LOT.h}
        rx={14}
        fill="none"
        stroke={c}
        strokeWidth={22}
        filter="url(#glow)"
      />
      <rect
        x={x}
        y={LOT.top}
        width={LOT.w}
        height={LOT.h}
        rx={14}
        fill={hatch ? `url(#hatch-${side})` : c}
        opacity={hatch ? 1 : 0.6}
      />
      <rect
        x={x}
        y={LOT.top}
        width={LOT.w}
        height={LOT.h}
        rx={14}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.85}
        strokeWidth={5}
      />
    </g>
  );
};

/** Highlight a stretch of the client's street. */
export const StreetGlow: React.FC<{
  at: number;
  out?: number;
  x1: number;
  x2: number;
}> = ({ at, out, x1, x2 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = prog(f, at, 12);
  const mid = (x1 + x2) / 2;
  return (
    <rect
      x={mid - ((x2 - x1) / 2) * p}
      y={STREET_Y - ROAD_W / 2}
      width={(x2 - x1) * p}
      height={ROAD_W}
      fill="#FFD54F"
      opacity={0.45 * fadeOut(f, out)}
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

/** Dashed route that draws itself over `dur` frames (world units; width scales with the map). */
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
  const id = `route-${at}-${pts.length}`;
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

/** Top-down truck driving along a route. */
export const Truck: React.FC<{
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

type Kind = "poor" | "rich" | "client" | "neighbor";
const RING: Record<Kind, string> = {
  poor: INK.poor,
  rich: INK.rich,
  client: "#ECEFF1",
  neighbor: "#90A4AE",
};
const MOUTH = {
  happy: "M -22 14 Q 0 34 22 14",
  sad: "M -20 26 Q 0 10 20 26",
  flat: "M -18 20 L 18 20",
};

/** Round-head avatar (world units), the map's stand-in for a person. */
export const Face: React.FC<{
  x: number;
  y: number;
  kind: Kind;
  at?: number;
  out?: number;
  mood?: keyof typeof MOUTH;
  talk?: boolean;
}> = ({ x, y, kind, at = -999, out, mood = "flat", talk }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const o = fadeOut(f, out);
  if (o <= 0) return null;
  const s = pop(f, at);
  const open = talk && Math.floor(f / 4) % 2 === 0;
  const blink = (f + Math.abs(x)) % 101 < 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <ellipse cx={0} cy={70} rx={58} ry={14} fill="#000" opacity={0.35} />
      <circle r={66} fill={RING[kind]} />
      <circle r={56} fill="#E9B48A" />
      {kind === "neighbor" ? (
        <path
          d="M -56 -8 Q -50 -64 0 -66 Q 50 -64 56 -8 L 76 -2 L 70 -16 Q 56 -70 0 -70 Q -60 -70 -62 -10 Z"
          fill="#37474F"
        />
      ) : kind === "rich" ? (
        <path
          d="M -56 -6 Q -52 -62 0 -64 Q 52 -62 56 -6 Q 30 -40 -56 -6 Z"
          fill="#4E342E"
        />
      ) : kind === "client" ? (
        <path
          d="M -54 -10 Q -46 -60 0 -62 Q 46 -60 54 -10 Q 0 -38 -54 -10 Z"
          fill="#9E9E9E"
        />
      ) : (
        <path
          d="M -56 -4 L -48 -44 L -30 -34 L -20 -62 L 0 -44 L 16 -64 L 26 -40 L 46 -50 L 56 -4 Q 0 -30 -56 -4 Z"
          fill="#3A2A20"
        />
      )}
      {blink ? (
        <g stroke={MAP.ink} strokeWidth={5} strokeLinecap="round">
          <path d="M -26 0 h 14" />
          <path d="M 12 0 h 14" />
        </g>
      ) : (
        <g fill={MAP.ink}>
          <circle cx={-19} cy={0} r={6.5} />
          <circle cx={19} cy={0} r={6.5} />
        </g>
      )}
      {open ? (
        <ellipse cx={0} cy={22} rx={11} ry={9} fill={MAP.ink} />
      ) : (
        <path
          d={MOUTH[mood]}
          stroke={MAP.ink}
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
  fontFamily: FONT.paper,
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

/** Big keyword stamp with a ring ripple (BOMBOŞ-style). */
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
          border: `6px solid ${MAP.white}`,
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
        color: MAP.white,
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
          background: MAP.white,
          color: MAP.ink,
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
          borderTop: `22px solid ${MAP.white}`,
        }}
      />
    </div>
  );
};

/** Round icon badge (no text) anchored to a world point. */
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
        background: MAP.white,
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
                background: INK.poor,
                rotate: `${r}deg`,
              }}
            />
          ))
        : null}
    </div>
  );
};
