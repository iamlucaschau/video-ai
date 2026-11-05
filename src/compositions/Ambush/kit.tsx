/**
 * Top-down tactical-map kit for "How Ambushes Actually Work" (Test/ambush). Everything is SVG on a
 * 1920×1080 viewBox; motion comes only from the global frame `g` passed in.
 */
import {
  evolvePath,
  getLength,
  getPointAtLength,
  getTangentAtLength,
} from "@remotion/paths";
import { loadFont as loadCond } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import React, { useEffect, useMemo, useState } from "react";
import {
  continueRender,
  delayRender,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const COND = loadCond("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;
export const INTER = loadInter("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const C = {
  bg: "#1c2218",
  field: "#262e1f",
  contour: "rgba(190,210,150,0.07)",
  road: "#857a60",
  roadEdge: "#3f392c",
  tree: "#22381f",
  tree2: "#2c4a27",
  treeHi: "#3b6232",
  water: "#2a4d61",
  red: "#ff5a3c",
  blue: "#4da3ff",
  tracer: "#ffd24a",
  text: "#eef0e6",
  muted: "rgba(238,240,230,0.62)",
  hot: "#fff3b0",
};

/** Size factor for soldiers (dots were 11 px, too small on a phone). */
export const UNIT = 1.25;
export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
/** 0→1 from frame a over d frames, eased out. */
export const ease = (
  g: number,
  a: number,
  d = 15,
  e = Easing.bezier(0.16, 1, 0.3, 1),
) => interpolate(g, [a, a + d], [0, 1], { ...CLAMP, easing: e });
export const lin = (g: number, a: number, b: number) =>
  interpolate(g, [a, Math.max(a + 1, b)], [0, 1], CLAMP);
export const inOut = (g: number, a: number, b: number) =>
  interpolate(g, [a, Math.max(a + 1, b)], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

/** Point + heading (degrees) at distance `s` along an SVG path. */
export const along = (d: string, s: number) => {
  const L = getLength(d);
  const t = Math.max(0, Math.min(L, s));
  const p = getPointAtLength(d, t);
  const tg = getTangentAtLength(d, t);
  return {
    x: p?.x ?? 0,
    y: p?.y ?? 0,
    a: tg ? (Math.atan2(tg.y, tg.x) * 180) / Math.PI : 0,
  };
};

// ───────────────────────── terrain ─────────────────────────

const GROUND = staticFile("images/ambush/ground.jpg");
let groundReady: Promise<void> | null = null;
/** Hold the frame until the ground texture is decoded (an SVG <image> is not tracked by Remotion). */
const useGround = () => {
  const [handle] = useState(() => delayRender("ambush ground texture"));
  useEffect(() => {
    groundReady ??= new Promise<void>((res) => {
      const im = new Image();
      im.onload = () =>
        im.decode().then(
          () => res(),
          () => res(),
        );
      im.onerror = () => res();
      im.src = GROUND;
    });
    groundReady.then(() => continueRender(handle));
  }, [handle]);
};

/** Textured ground (public/images/ambush/ground.jpg, scripts/make-ground-ambush.py) + a tint per scene. */
export const Terrain: React.FC<{
  seed?: string;
  tint?: string;
  thermal?: number;
}> = ({ seed = "t", tint = C.bg, thermal = 0 }) => {
  useGround();
  const rings = useMemo(() => {
    const out: string[] = [];
    for (let h = 0; h < 6; h++) {
      const cx = random(`${seed}x${h}`) * 1920;
      const cy = random(`${seed}y${h}`) * 1080;
      for (let k = 1; k <= 5; k++) {
        const pts: string[] = [];
        for (let i = 0; i <= 36; i++) {
          const a = (i / 36) * Math.PI * 2;
          const r =
            k *
            70 *
            (1 + 0.25 * Math.sin(a * 3 + h) + 0.12 * Math.cos(a * 5 + k));
          pts.push(
            `${(cx + Math.cos(a) * r * 1.4).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`,
          );
        }
        out.push(`M ${pts.join(" L ")} Z`);
      }
    }
    return out;
  }, [seed]);
  // four variants of the one texture: flip it by seed so scenes don't share the same patches
  const fx = random(`${seed}fx`) > 0.5 ? -1 : 1;
  const fy = random(`${seed}fy`) > 0.5 ? -1 : 1;
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1880} fill={tint} />
      <g
        transform={`translate(960 540) scale(${fx} ${fy}) translate(-960 -540)`}
      >
        <image
          href={GROUND}
          x={-400}
          y={-400}
          width={2720}
          height={1880}
          preserveAspectRatio="none"
        />
      </g>
      <rect
        x={-400}
        y={-400}
        width={2720}
        height={1880}
        fill={tint}
        opacity={0.42}
      />
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={C.contour} strokeWidth={2} />
      ))}
      {thermal > 0 ? (
        <rect
          x={-400}
          y={-400}
          width={2720}
          height={1880}
          fill="#050a1c"
          opacity={thermal * 0.85}
        />
      ) : null}
    </g>
  );
};

/** Cloud shadows drifting over the map (ambient motion), then the vignette. Drawn last in every scene. */
const CLOUDS = [
  { x0: 200, y: 240, rx: 700, ry: 400, v: 2.5 },
  { x0: 1500, y: 860, rx: 640, ry: 360, v: 3.1 },
  { x0: 2700, y: 520, rx: 780, ry: 440, v: 2.2 },
];
export const Vignette: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <defs>
        <radialGradient id="vig" cx="50%" cy="50%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.7} />
        </radialGradient>
        <radialGradient id="cloud" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity={0.36} />
          <stop offset="55%" stopColor="#000" stopOpacity={0.24} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      {CLOUDS.map((c, i) => {
        // wraps around a 3600 px loop, entering from the left
        const x = ((((c.x0 + f * c.v) % 3600) + 3600) % 3600) - 900;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={c.y + Math.sin(f / 300 + i) * 30}
            rx={c.rx}
            ry={c.ry}
            fill="url(#cloud)"
          />
        );
      })}
      <rect x={0} y={0} width={1920} height={1080} fill="url(#vig)" />
    </>
  );
};

/** Dirt road: grass fringe, edge, two darker wheel ruts and a lighter crown. */
export const Road: React.FC<{ d: string; w?: number; p?: number }> = ({
  d,
  w = 70,
  p = 1,
}) => {
  const ev = evolvePath(p, d);
  const dash =
    p < 1
      ? {
          strokeDasharray: ev.strokeDasharray,
          strokeDashoffset: ev.strokeDashoffset,
        }
      : {};
  const s = (
    stroke: string,
    width: number,
    extra: React.SVGProps<SVGPathElement> = {},
  ) => (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      {...dash}
      {...extra}
    />
  );
  return (
    <g>
      {s("rgba(0,0,0,0.28)", w + 30)}
      {s(C.roadEdge, w + 14)}
      {s(C.road, w)}
      {s("#71674f", w * 0.64)}
      {s("#8c8166", w * 0.32)}
      {/* lengthwise wear lines (cross-dashes read as railway sleepers) */}
      {s("rgba(40,34,24,0.35)", 2, { transform: `translate(0 ${-w * 0.24})` })}
      {s("rgba(40,34,24,0.35)", 2, { transform: `translate(0 ${w * 0.24})` })}
    </g>
  );
};

export const River: React.FC<{ d: string; w?: number }> = ({ d, w = 120 }) => (
  <g>
    <path
      d={d}
      fill="none"
      stroke="#1d3644"
      strokeWidth={w + 24}
      strokeLinecap="round"
    />
    <path
      d={d}
      fill="none"
      stroke={C.water}
      strokeWidth={w}
      strokeLinecap="round"
    />
    <path
      d={d}
      fill="none"
      stroke="rgba(255,255,255,0.08)"
      strokeWidth={3}
      strokeDasharray="40 60"
    />
  </g>
);

/** A patch of tree crowns filling a rectangle (deterministic): lit from the top left, shadow to the bottom right. */
export const Forest: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  seed: string;
  density?: number;
  dim?: number;
}> = ({ x, y, w, h, seed, density = 1, dim = 1 }) => {
  const crowns = useMemo(() => {
    const n = Math.round(((w * h) / 2600) * density);
    return Array.from({ length: n })
      .map((_, i) => {
        const r = 18 + random(`${seed}c${i}`) * 22;
        return {
          cx: x + random(`${seed}a${i}`) * w,
          cy: y + random(`${seed}b${i}`) * h,
          r,
          c: random(`${seed}d${i}`),
          bits: [0, 1, 2].map((k) => ({
            dx: (random(`${seed}e${i}${k}`) - 0.6) * r * 1.1,
            dy: (random(`${seed}f${i}${k}`) - 0.6) * r * 1.1,
            r: r * (0.22 + random(`${seed}g${i}${k}`) * 0.16),
          })),
        };
      })
      .sort((a, b) => a.cy - b.cy);
  }, [x, y, w, h, seed, density]);
  const id = `fg-${seed}`;
  const f = useCurrentFrame(); // wind
  return (
    <g opacity={dim}>
      <defs>
        <radialGradient id={`${id}a`} cx="36%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#4f7c3b" />
          <stop offset="55%" stopColor="#2a4724" />
          <stop offset="100%" stopColor="#14230e" />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="36%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#62894a" />
          <stop offset="55%" stopColor="#35592b" />
          <stop offset="100%" stopColor="#192b12" />
        </radialGradient>
      </defs>
      {crowns.map((t, i) => (
        <ellipse
          key={`s${i}`}
          cx={t.cx + 11}
          cy={t.cy + 13}
          rx={t.r * 1.05}
          ry={t.r}
          fill="rgba(0,0,0,0.42)"
        />
      ))}
      {crowns.map((t, i) => (
        <g
          key={i}
          transform={`translate(${(Math.sin(f / 38 + i * 1.7) * 1.6 + Math.sin(f / 97) * 1.2).toFixed(2)} ${(Math.cos(f / 45 + i * 2.3) * 1.1).toFixed(2)})`}
        >
          <circle
            cx={t.cx}
            cy={t.cy}
            r={t.r}
            fill={`url(#${id}${t.c > 0.5 ? "a" : "b"})`}
          />
          {t.bits.map((b, k) => (
            <circle
              key={k}
              cx={t.cx + b.dx}
              cy={t.cy + b.dy}
              r={b.r}
              fill="#7aa858"
              opacity={0.16}
            />
          ))}
        </g>
      ))}
    </g>
  );
};

export const Hill: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}> = ({ cx, cy, rx, ry }) => (
  <g>
    {[1, 0.78, 0.56, 0.34].map((k, i) => (
      <ellipse
        key={i}
        cx={cx + (1 - k) * 30}
        cy={cy - (1 - k) * 20}
        rx={rx * k}
        ry={ry * k}
        fill={["#2b3422", "#323d27", "#3a462c", "#435133"][i]}
        stroke="rgba(220,230,180,0.12)"
        strokeWidth={2}
      />
    ))}
  </g>
);

export const Rock: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M -46 18 L -38 -22 L -8 -36 L 30 -28 L 48 2 L 34 28 L -20 34 Z"
      fill="#6b6a62"
      stroke="#3a3933"
      strokeWidth={4}
    />
    <path
      d="M -30 -14 L -6 -26 L 20 -20"
      fill="none"
      stroke="#8d8c82"
      strokeWidth={4}
      strokeLinecap="round"
    />
  </g>
);

export const Bush: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[
      [-26, -6, 30],
      [14, -18, 30],
      [22, 16, 28],
      [-12, 22, 26],
      [0, 0, 28],
    ].map(([cx, cy, r], i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={r}
        fill={i % 2 ? C.tree2 : C.treeHi}
        opacity={0.92}
      />
    ))}
  </g>
);

// ───────────────────────── units ─────────────────────────

/** Top-down patrol vehicle: tracks, hull, cab at the front (+x), hatch with a gun. */
export const Vehicle: React.FC<{
  x: number;
  y: number;
  a?: number;
  color?: string;
  dead?: number;
  s?: number;
  you?: boolean;
}> = ({ x, y, a = 0, color = C.blue, dead = 0, s = 1 }) => {
  const f = useCurrentFrame(); // burning wrecks flicker
  const fl = 0.75 + 0.25 * Math.sin(f / 2.3 + x) * Math.sin(f / 3.7 + y);
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s * 1.15})`}>
      <rect
        x={-40}
        y={-23}
        width={86}
        height={48}
        rx={9}
        fill="rgba(0,0,0,0.45)"
        transform="translate(6 8)"
      />
      {[-24, 14].map((ty) => (
        <g key={ty}>
          <rect x={-43} y={ty} width={88} height={10} rx={4} fill="#1b1d1a" />
          <line
            x1={-41}
            y1={ty + 5}
            x2={43}
            y2={ty + 5}
            stroke="#3a3d36"
            strokeWidth={6}
            strokeDasharray="3 5"
          />
        </g>
      ))}
      <rect
        x={-40}
        y={-17}
        width={84}
        height={34}
        rx={7}
        fill={dead ? "#242422" : "#33475c"}
        stroke={dead ? "#4a4a46" : color}
        strokeWidth={3.5}
      />
      <rect
        x={-36}
        y={-14}
        width={74}
        height={7}
        rx={3}
        fill="#fff"
        opacity={dead ? 0.03 : 0.1}
      />
      <rect
        x={20}
        y={-13}
        width={18}
        height={26}
        rx={4}
        fill={dead ? "#2e2e2b" : color}
        opacity={0.75}
      />
      <line
        x1={36}
        y1={-10}
        x2={36}
        y2={10}
        stroke={dead ? "#333" : "#d8ecff"}
        strokeWidth={3}
        opacity={0.7}
      />
      <circle
        cx={-8}
        cy={0}
        r={10}
        fill={dead ? "#3a3a37" : color}
        stroke="#0d0f0b"
        strokeWidth={2}
      />
      <line
        x1={-8}
        y1={0}
        x2={10}
        y2={0}
        stroke="#151613"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {dead ? (
        <g>
          <circle cx={0} cy={0} r={34} fill="#000" opacity={0.28 * dead} />
          <circle
            cx={-6}
            cy={2}
            r={9 + 3 * fl}
            fill="#ff7a2a"
            opacity={0.55 * dead * fl}
          />
          <circle
            cx={-6}
            cy={2}
            r={4 + 1.5 * fl}
            fill="#ffd27a"
            opacity={0.7 * dead * fl}
          />
        </g>
      ) : null}
    </g>
  );
};

export const Column: React.FC<{
  d: string;
  head: number;
  n?: number;
  gap?: number;
  color?: string;
  dead?: number[];
  s?: number;
}> = ({ d, head, n = 4, gap = 110, color = C.blue, dead = [], s = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const p = along(d, head - i * gap);
      return (
        <Vehicle
          key={i}
          x={p.x}
          y={p.y}
          a={p.a}
          color={color}
          dead={dead[i] ?? 0}
          s={s}
        />
      );
    })}
  </g>
);

/**
 * Top-down soldier: shoulders, pack, helmet and rifle, facing `a` degrees (0 = +x). Red (ambushers) face the road
 * to the south by default, everyone else north. `down` = lying, grey.
 */
export const Soldier: React.FC<{
  x: number;
  y: number;
  color?: string;
  down?: number;
  r?: number;
  glow?: number;
  a?: number;
}> = ({ x, y, color = C.red, down = 0, r: r0 = 11, glow = 0, a }) => {
  const r = r0 * UNIT; // bigger units read on a phone (frame review 2026-11-05)
  const face = a ?? (color === C.red ? 90 : -90);
  return (
    <g>
      {glow > 0 ? (
        <circle cx={x} cy={y} r={r * 3} fill={color} opacity={0.25 * glow} />
      ) : null}
      <g transform={`translate(${x} ${y}) rotate(${down ? face + 90 : face})`}>
        <ellipse
          cx={3}
          cy={4}
          rx={r * 1.25}
          ry={r * 1.1}
          fill="rgba(0,0,0,0.45)"
        />
        {down ? (
          <g>
            <ellipse
              rx={r * 1.5}
              ry={r * 0.62}
              fill="#5a5a56"
              stroke="#0d0f0b"
              strokeWidth={2}
            />
            <circle
              cx={r * 1.25}
              r={r * 0.5}
              fill="#6a6a64"
              stroke="#0d0f0b"
              strokeWidth={2}
            />
          </g>
        ) : (
          <g>
            <line
              x1={r * 0.2}
              y1={r * 0.6}
              x2={r * 1.9}
              y2={r * 0.6}
              stroke="#151613"
              strokeWidth={r * 0.3}
              strokeLinecap="round"
            />
            <ellipse
              cx={-r * 0.1}
              rx={r * 0.72}
              ry={r * 1.02}
              fill={color}
              stroke="#0d0f0b"
              strokeWidth={2}
            />
            <rect
              x={-r * 0.98}
              y={-r * 0.55}
              width={r * 0.55}
              height={r * 1.1}
              rx={r * 0.2}
              fill="#000"
              opacity={0.3}
            />
            <circle
              cx={r * 0.15}
              r={r * 0.62}
              fill={color}
              stroke="#0d0f0b"
              strokeWidth={2}
            />
            {/* arms forward to the rifle, darker helmet: reads as a person, not a dot */}
            {[-1, 1].map((k) => (
              <ellipse
                key={k}
                cx={r * 0.55}
                cy={k * r * 0.5}
                rx={r * 0.5}
                ry={r * 0.24}
                fill={color}
                stroke="#0d0f0b"
                strokeWidth={1.5}
              />
            ))}
            <circle
              cx={r * 0.15}
              r={r * 0.62}
              fill={color}
              stroke="#0d0f0b"
              strokeWidth={2}
            />
            <circle cx={r * 0.15} r={r * 0.62} fill="#000" opacity={0.4} />
            <circle
              cx={r * 0.02}
              cy={-r * 0.2}
              r={r * 0.22}
              fill="#fff"
              opacity={0.35}
            />
          </g>
        )}
      </g>
    </g>
  );
};

/** A row of soldiers from (x1,y1) to (x2,y2). */
export const Line: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  n: number;
  color?: string;
  p?: number;
  glow?: number;
}> = ({ x1, y1, x2, y2, n, color = C.red, p = 1, glow = 0 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const k = n === 1 ? 0 : i / (n - 1);
      const vis = interpolate(p * n - i, [0, 1], [0, 1], CLAMP);
      return (
        <g key={i} opacity={vis}>
          <Soldier
            x={x1 + (x2 - x1) * k}
            y={y1 + (y2 - y1) * k}
            color={color}
            glow={glow}
          />
        </g>
      );
    })}
  </g>
);

// ───────────────────────── fire ─────────────────────────

/** Dashed, glowing tracer stream from a to b, visible on [on, off), with a flickering muzzle flash. */
export const Tracer: React.FC<{
  g: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  on: number;
  off?: number;
  color?: string;
  w?: number;
  speed?: number;
  seed?: number;
}> = ({
  g,
  x1,
  y1,
  x2,
  y2,
  on,
  off = 1e9,
  color = C.tracer,
  w = 4,
  speed = 38,
  seed = 0,
}) => {
  if (g < on || g >= off) return null;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const grow = Math.min(1, (g - on) / 4);
  const fade = interpolate(g, [off - 6, off], [1, 0], CLAMP);
  const flicker = 0.75 + 0.25 * Math.sin(g * 2.3 + seed);
  const dash = {
    strokeDasharray: `${Math.min(60, len / 4)} ${Math.min(90, len / 3)}`,
    strokeDashoffset: -(g - on) * speed + seed * 37,
  };
  const xe = x1 + (x2 - x1) * grow;
  const ye = y1 + (y2 - y1) * grow;
  const fl = 10 + 7 * Math.abs(Math.sin(g * 1.7 + seed));
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const flash = [0, 1, 2, 3, 4, 5, 6, 7]
    .map((i) => {
      const t = ang + (i * Math.PI) / 4;
      const rr = i % 2 ? fl * 0.4 : i === 0 ? fl * 1.6 : fl;
      return `${(x1 + Math.cos(t) * rr).toFixed(1)},${(y1 + Math.sin(t) * rr).toFixed(1)}`;
    })
    .join(" ");
  return (
    <g opacity={fade * flicker}>
      <line
        x1={x1}
        y1={y1}
        x2={xe}
        y2={ye}
        stroke={color}
        strokeWidth={w * 3.4}
        strokeLinecap="round"
        opacity={0.22}
        {...dash}
      />
      <line
        x1={x1}
        y1={y1}
        x2={xe}
        y2={ye}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        {...dash}
      />
      <line
        x1={x1}
        y1={y1}
        x2={xe}
        y2={ye}
        stroke="#fffbe8"
        strokeWidth={w * 0.4}
        strokeLinecap="round"
        {...dash}
      />
      <polygon points={flash} fill="#fff1b8" opacity={0.9} />
      <circle cx={x1} cy={y1} r={fl * 1.6} fill="#ffcf60" opacity={0.18} />
    </g>
  );
};

/** Explosion at frame `at`: fireball, sparks, shock ring, then rolling smoke and a scorch mark that stays. */
export const Blast: React.FC<{
  g: number;
  x: number;
  y: number;
  at: number;
  s?: number;
}> = ({ g, x, y, at, s = 1 }) => {
  if (g < at) return null;
  const t = g - at;
  const key = `${Math.round(x)}-${Math.round(y)}`;
  const flash = interpolate(t, [0, 3, 14], [0, 1, 0], CLAMP);
  const fire = interpolate(t, [0, 4, 26], [0, 0.9, 0], CLAMP);
  const ring = interpolate(t, [0, 18], [10, 140], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const smoke = interpolate(t, [3, 26, 240], [0, 0.6, 0.28], CLAMP);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse
        rx={52}
        ry={44}
        fill="#100d09"
        opacity={Math.min(0.55, t * 0.06)}
      />
      {Array.from({ length: 9 }).map((_, i) => {
        const r1 = random(`${key}r${i}`);
        const r2 = random(`${key}q${i}`);
        const ang = i * 0.7 + r1 * 0.9;
        const dist = Math.min(95, 10 + t * 0.55 * (0.6 + r2));
        return (
          <circle
            key={i}
            cx={
              Math.cos(ang) * dist +
              Math.min(t, 260) * 0.12 +
              Math.sin(t / 47 + i) * 8
            }
            cy={
              Math.sin(ang) * dist * 0.85 -
              Math.min(t, 260) * 0.22 +
              Math.cos(t / 59 + i) * 5
            }
            r={22 + Math.min(62, t * 0.9 * (0.7 + r1))}
            fill={i % 3 ? "#3b3731" : "#4a453d"}
            opacity={smoke * (0.55 + 0.45 * r2)}
          />
        );
      })}
      <circle r={30 + Math.min(55, t * 3)} fill="#ff8a2a" opacity={fire} />
      <circle r={20 + Math.min(30, t * 2)} fill="#ffc25a" opacity={fire} />
      {t < 18
        ? Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2 + random(`${key}s${i}`) * 0.5;
            const d1 = 24 + t * (6 + random(`${key}v${i}`) * 4);
            return (
              <line
                key={`k${i}`}
                x1={Math.cos(ang) * d1}
                y1={Math.sin(ang) * d1}
                x2={Math.cos(ang) * (d1 + 16)}
                y2={Math.sin(ang) * (d1 + 16)}
                stroke="#ffd98a"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={1 - t / 18}
              />
            );
          })
        : null}
      <circle
        r={ring}
        fill="none"
        stroke="#ffcf70"
        strokeWidth={6}
        opacity={interpolate(t, [0, 18], [0.9, 0], CLAMP)}
      />
      <circle r={70} fill="#ffb347" opacity={flash * 0.8} />
      <circle r={36} fill="#fff4d0" opacity={flash} />
    </g>
  );
};

/** Rocket from a to b launched at `at`, flying `dur` frames, leaving a smoke trail. */
export const Rocket: React.FC<{
  g: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  dur?: number;
}> = ({ g, x1, y1, x2, y2, at, dur = 12 }) => {
  if (g < at) return null;
  const k = Math.min(1, (g - at) / dur);
  const x = x1 + (x2 - x1) * k;
  const y = y1 + (y2 - y1) * k;
  const trail = interpolate(g - at, [dur, dur + 40], [0.7, 0], CLAMP);
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x}
        y2={y}
        stroke="#d8d2c4"
        strokeWidth={8}
        strokeLinecap="round"
        opacity={trail}
      />
      {k < 1 ? <circle cx={x} cy={y} r={9} fill="#fff1c4" /> : null}
    </g>
  );
};

// ───────────────────────── marks & labels ─────────────────────────

export const KillZone: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  pulse?: number;
  color?: string;
  label?: string;
  lp?: number;
}> = ({ x, y, w, h, p, pulse = 0, color = C.red, label, lp = 0 }) => {
  const per = 2 * (w + h);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={color}
        opacity={0.1 * p + 0.12 * pulse}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={`${per * p} ${per}`}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray="22 16"
        opacity={p >= 1 ? 0.0 : 0}
      />
      {label ? (
        <text
          x={x + 14}
          y={y + h + 50}
          fill={color}
          fontFamily={COND}
          fontWeight={800}
          fontSize={44}
          letterSpacing={3}
          opacity={lp}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** Text tag on the map. `kind` varies the entrance so not everything fades. */
export const Tag: React.FC<{
  x: number;
  y: number;
  text: string;
  p: number;
  size?: number;
  color?: string;
  bg?: string;
  anchor?: "start" | "middle" | "end";
  kind?: "rise" | "wipe" | "type" | "drop";
  out?: number;
}> = ({
  x,
  y,
  text,
  p,
  size = 46,
  color = C.text,
  bg = "rgba(10,12,9,0.78)",
  anchor = "middle",
  kind = "rise",
  out = 0,
}) => {
  if (p <= 0) return null;
  const shown =
    kind === "type"
      ? text.slice(0, Math.ceil(text.length * Math.min(1, p * 1.4)))
      : text;
  const w = text.length * size * 0.5 + size * 0.9;
  const h = size * 1.35;
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const dy =
    kind === "rise" ? (1 - p) * 24 : kind === "drop" ? -(1 - p) * 30 : 0;
  const op = (kind === "wipe" || kind === "type" ? 1 : p) * (1 - out);
  const clipW = kind === "wipe" ? w * p : w;
  const id = `clip-${Math.round(x)}-${Math.round(y)}-${text.length}`;
  return (
    <g opacity={op} transform={`translate(0 ${dy})`}>
      <defs>
        <clipPath id={id}>
          <rect x={x0} y={y - h / 2 - 4} width={clipW} height={h + 8} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x0} y={y - h / 2} width={w} height={h} rx={8} fill={bg} />
        <rect
          x={x0}
          y={y - h / 2}
          width={6}
          height={h}
          fill={color === C.text ? C.tracer : color}
        />
        <text
          x={x0 + w / 2 + 3}
          y={y + size * 0.36}
          textAnchor="middle"
          fill={color}
          fontFamily={COND}
          fontWeight={700}
          fontSize={size}
          letterSpacing={2}
        >
          {shown}
        </text>
      </g>
    </g>
  );
};

/** Big centred heading (chapter cards, key words). */
export const Heading: React.FC<{
  text: string;
  p: number;
  y?: number;
  size?: number;
  color?: string;
  sub?: string;
  out?: number;
}> = ({ text, p, y = 540, size = 150, color = C.text, sub, out = 0 }) => {
  if (p <= 0 || out >= 1) return null;
  return (
    <g opacity={(1 - out) * Math.min(1, p * 2)}>
      <defs>
        <clipPath id={`hd-${text.length}-${y}`}>
          <rect x={0} y={y - size} width={1920} height={size * 1.25} />
        </clipPath>
      </defs>
      <g clipPath={`url(#hd-${text.length}-${y})`}>
        <text
          x={960}
          y={y + (1 - p) * size}
          textAnchor="middle"
          fill={color}
          fontFamily={COND}
          fontWeight={800}
          fontSize={size}
          letterSpacing={6}
        >
          {text}
        </text>
      </g>
      <rect
        x={960 - 140 * p}
        y={y + 34}
        width={280 * p}
        height={6}
        fill={C.tracer}
      />
      {sub ? (
        <text
          x={960}
          y={y + 104}
          textAnchor="middle"
          fill={C.muted}
          fontFamily={COND}
          fontWeight={600}
          fontSize={46}
          letterSpacing={8}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

export const Cross: React.FC<{
  x: number;
  y: number;
  p: number;
  s?: number;
}> = ({ x, y, p, s = 1 }) => {
  if (p <= 0) return null;
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={C.red}
      strokeWidth={18}
      strokeLinecap="round"
    >
      <line x1={-60} y1={-60} x2={-60 + 120 * a} y2={-60 + 120 * a} />
      {b > 0 ? (
        <line x1={60} y1={-60} x2={60 - 120 * b} y2={-60 + 120 * b} />
      ) : null}
    </g>
  );
};

export const Check: React.FC<{
  x: number;
  y: number;
  p: number;
  color?: string;
  s?: number;
}> = ({ x, y, p, color = "#7be07b", s = 1 }) => {
  if (p <= 0) return null;
  const d = "M -30 0 L -8 24 L 34 -26";
  const ev = evolvePath(p, d);
  return (
    <path
      d={d}
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeWidth={12}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={ev.strokeDasharray}
      strokeDashoffset={ev.strokeDashoffset}
    />
  );
};

/** Path that draws on, with an arrow head at its tip. */
export const Arrow: React.FC<{
  d: string;
  p: number;
  color?: string;
  w?: number;
  dash?: boolean;
  op?: number;
}> = ({ d, p, color = C.blue, w = 12, dash, op = 1 }) => {
  if (p <= 0) return null;
  const L = getLength(d);
  const tip = along(d, L * p);
  const ev = evolvePath(p, d);
  return (
    <g opacity={op}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
        strokeDasharray={dash ? undefined : ev.strokeDasharray}
        strokeDashoffset={dash ? undefined : ev.strokeDashoffset}
        style={dash ? { strokeDasharray: `${w * 1.6} ${w * 1.4}` } : undefined}
        clipPath={undefined}
        opacity={dash ? Math.min(1, p * 3) : 1}
      />
      <g transform={`translate(${tip.x} ${tip.y}) rotate(${tip.a})`}>
        <path
          d={`M ${w * 2.6} 0 L ${-w * 0.6} ${-w * 2} L ${-w * 0.6} ${w * 2} Z`}
          fill={color}
        />
      </g>
    </g>
  );
};

/** Sight cone from (x,y) pointing `a` degrees. */
export const Cone: React.FC<{
  x: number;
  y: number;
  a: number;
  len: number;
  spread?: number;
  color?: string;
  op?: number;
  id: string;
}> = ({ x, y, a, len, spread = 22, color = "#cfe8ff", op = 1, id }) => {
  const r = (deg: number) => (deg * Math.PI) / 180;
  const p1 = [
    x + Math.cos(r(a - spread)) * len,
    y + Math.sin(r(a - spread)) * len,
  ];
  const p2 = [
    x + Math.cos(r(a + spread)) * len,
    y + Math.sin(r(a + spread)) * len,
  ];
  return (
    <g opacity={op}>
      <defs>
        <radialGradient
          id={id}
          cx={x}
          cy={y}
          r={len}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path
        d={`M ${x} ${y} L ${p1[0]} ${p1[1]} A ${len} ${len} 0 0 1 ${p2[0]} ${p2[1]} Z`}
        fill={`url(#${id})`}
      />
    </g>
  );
};

/** Quadcopter seen from above; rotors blur with the frame. */
export const Drone: React.FC<{
  x: number;
  y: number;
  s?: number;
  a?: number;
  g: number;
  color?: string;
  shadow?: number;
}> = ({ x, y, s = 1, a = 0, g, color = C.red, shadow = 1 }) => (
  <g>
    {shadow > 0 ? (
      <ellipse
        cx={x + 30 * shadow}
        cy={y + 40 * shadow}
        rx={46 * s}
        ry={30 * s}
        fill="#000"
        opacity={0.3}
      />
    ) : null}
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <line
        x1={-34}
        y1={-34}
        x2={34}
        y2={34}
        stroke="#2a2a2a"
        strokeWidth={9}
      />
      <line
        x1={-34}
        y1={34}
        x2={34}
        y2={-34}
        stroke="#2a2a2a"
        strokeWidth={9}
      />
      {[
        [-34, -34],
        [34, -34],
        [-34, 34],
        [34, 34],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle
            cx={cx}
            cy={cy}
            r={22}
            fill="rgba(220,220,220,0.18)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={2}
          />
          <line
            x1={cx - 20 * Math.cos(g * 1.3 + i)}
            y1={cy - 20 * Math.sin(g * 1.3 + i)}
            x2={cx + 20 * Math.cos(g * 1.3 + i)}
            y2={cy + 20 * Math.sin(g * 1.3 + i)}
            stroke="#ddd"
            strokeWidth={4}
            opacity={0.7}
          />
        </g>
      ))}
      <rect
        x={-16}
        y={-20}
        width={32}
        height={40}
        rx={8}
        fill="#3a3a3a"
        stroke={color}
        strokeWidth={4}
      />
      <circle cx={0} cy={-12} r={5} fill={color} />
    </g>
  </g>
);

export const Ring: React.FC<{
  x: number;
  y: number;
  g: number;
  at: number;
  color?: string;
  r?: number;
}> = ({ x, y, g, at, color = C.red, r = 90 }) => {
  if (g < at) return null;
  const t = (g - at) % 40;
  return (
    <circle
      cx={x}
      cy={y}
      r={20 + (t / 40) * r}
      fill="none"
      stroke={color}
      strokeWidth={5}
      opacity={1 - t / 40}
    />
  );
};
