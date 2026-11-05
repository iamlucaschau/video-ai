/**
 * Naval kit for "How an Aircraft Carrier Defends Itself" (Test/carrier): top-down ships, aircraft, missiles, rings,
 * radar and data links on a 1920×1080 SVG canvas. Motion only from the frame (`g` props or useCurrentFrame).
 * Shared pieces (tags, headings, blasts, tracers, easing) come from the Ambush kit.
 */
import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C, CLAMP, COND } from "../Ambush/kit";

export const N = {
  sea: "#0b2740",
  deck: "#4d5258",
  hull: "#6c737b",
  hullDark: "#3f454c",
  island: "#8c939b",
  land: "#3a3a2c",
  landEdge: "#6b6a52",
  friend: C.blue,
  foe: C.red,
  link: "#7fd4ff",
  foam: "#dbeaf2",
};

// ───────────────────────── sea ─────────────────────────

const SEA = staticFile("images/carrier/sea.jpg");
let seaReady: Promise<void> | null = null;
const useSea = () => {
  const [handle] = useState(() => delayRender("carrier sea texture"));
  useEffect(() => {
    seaReady ??= new Promise<void>((res) => {
      const im = new Image();
      im.onload = () => im.decode().then(() => res(), () => res());
      im.onerror = () => res();
      im.src = SEA;
    });
    seaReady.then(() => continueRender(handle));
  }, [handle]);
};

/** Open ocean: texture (scripts/make-sea-carrier.py), a tint, and whitecaps that drift with the wind. */
/** `flow` px/frame: the water streams back past the fleet (it is under way); maps use a slow drift. */
export const Sea: React.FC<{ seed?: string; tint?: string; tintOp?: number; night?: number; flow?: number }> = ({ seed = "s", tint = N.sea, tintOp = 0.18, night = 0, flow = 1.6 }) => {
  useSea();
  const f = useCurrentFrame();
  const caps = useMemo(
    () =>
      Array.from({ length: 460 }).map((_, i) => ({
        x: random(`${seed}cx${i}`) * 5000 - 1500,
        y: random(`${seed}cy${i}`) * 3300 - 1100,
        l: 8 + random(`${seed}cl${i}`) * 28,
        v: 0.4 + random(`${seed}cv${i}`) * 0.5,
        ph: random(`${seed}cp${i}`) * 200,
      })),
    [seed],
  );
  const fx = random(`${seed}fx`) > 0.5 ? -1 : 1;
  return (
    <g>
      <rect x={-3000} y={-2400} width={7920} height={5880} fill={tint} />
      {/* stretched so zoomed-out fleet shots (camera ≥ 0.4) never show the edge */}
      <g transform={`translate(${(-f * flow).toFixed(1)} 0)`}>
        <g transform={`translate(960 540) scale(${fx} 1) translate(-960 -540)`}>
          <image href={SEA} x={-1500} y={-1100} width={4920} height={3280} preserveAspectRatio="none" />
          {/* mirrored copy to the right: the seam is a mirror line, invisible */}
          <g transform="translate(6840 0) scale(-1 1)">
            <image href={SEA} x={-1500} y={-1100} width={4920} height={3280} preserveAspectRatio="none" />
          </g>
        </g>
      </g>
      <rect x={-3000} y={-2400} width={7920} height={5880} fill={tint} opacity={tintOp} />
      {caps.map((c, i) => {
        const life = ((f + c.ph) % 200) / 200; // each cap forms, drifts, breaks up
        const x = ((((c.x + 1500 + f * (c.v - flow)) % 5000) + 5000) % 5000) - 1500;
        return <line key={i} x1={x} y1={c.y} x2={x + c.l} y2={c.y + 1} stroke={N.foam} strokeWidth={2.4} strokeLinecap="round" opacity={0.36 * Math.sin(life * Math.PI)} />;
      })}
      {night > 0 ? <rect x={-3000} y={-2400} width={7920} height={5880} fill="#020814" opacity={night * 0.55} /> : null}
    </g>
  );
};

/** Coastline from scripts/carrier-maps.mjs (Natural Earth, projected to the canvas). */
export const Land: React.FC<{ d: string; op?: number }> = ({ d, op = 1 }) => (
  <g opacity={op}>
    <path d={d} fill="rgba(0,0,0,0.35)" transform="translate(6 8)" />
    <path d={d} fill={N.land} stroke={N.landEdge} strokeWidth={3} strokeLinejoin="round" />
    <path d={d} fill="none" stroke="rgba(220,235,240,0.18)" strokeWidth={9} strokeLinejoin="round" />
  </g>
);

// ───────────────────────── ships (bow at +x in local coords) ─────────────────────────

/** Foam wake behind a moving ship (local coords, trailing to −x). */
export const Wake: React.FC<{ len?: number; w?: number; op?: number }> = ({ len = 320, w = 40, op = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={op}>
      <path d={`M 0 ${-w * 0.3} L ${-len} ${-w * 1.6} M 0 ${w * 0.3} L ${-len} ${w * 1.6}`} stroke={N.foam} strokeWidth={3} opacity={0.25} fill="none" />
      <path d={`M 0 0 L ${-len} 0`} stroke={N.foam} strokeWidth={w * 0.9} strokeLinecap="round" opacity={0.1} />
      <path d={`M 0 0 L ${-len * 0.55} 0`} stroke={N.foam} strokeWidth={w * 0.4} strokeLinecap="round" opacity={0.16} />
      {/* churned foam: soft blobs drifting back from the stern (no cross-dashes: they read as rails) */}
      {Array.from({ length: 9 }).map((_, i) => {
        const k = ((f * 2 + i * (len / 9)) % len) / len;
        return <ellipse key={i} cx={-k * len} cy={Math.sin(i * 2.1 + f / 20) * w * 0.15 * k} rx={w * (0.3 + 0.5 * k)} ry={w * (0.18 + 0.35 * k)} fill={N.foam} opacity={0.16 * (1 - k)} />;
      })}
    </g>
  );
};

const Shadowed: React.FC<{ children: React.ReactNode; dx?: number; dy?: number }> = ({ children, dx = 7, dy = 9 }) => (
  <>
    <g transform={`translate(${dx} ${dy})`} opacity={0.4} style={{ filter: "brightness(0)" }}>
      {children}
    </g>
    {children}
  </>
);

/** Supercarrier, top-down: angled landing deck to port (−y), island to starboard (+y), catapults at the bow. */
export const Carrier: React.FC<{ x: number; y: number; a?: number; s?: number; wake?: number; parked?: number; glow?: number }> = ({
  x,
  y,
  a = 0,
  s = 1,
  wake = 1,
  parked = 1,
  glow = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    {wake > 0 ? (
      <g transform="translate(-160 0)">
        <Wake len={520} w={60} op={wake} />
      </g>
    ) : null}
    {glow > 0 ? <ellipse rx={260} ry={110} fill={C.tracer} opacity={0.12 * glow} /> : null}
    <Shadowed dx={10} dy={14}>
      <path d="M 180 0 L 150 -24 L 70 -30 L -60 -52 L -165 -54 L -172 -40 L -168 26 L -150 34 L 120 30 L 160 18 Z" fill={N.deck} stroke={N.hullDark} strokeWidth={3} />
    </Shadowed>
    {/* angled landing deck: lines and the landing area */}
    <path d="M 70 -28 L -165 -50" stroke="#e8e8e0" strokeWidth={2.5} strokeDasharray="12 10" opacity={0.75} />
    <path d="M 40 -16 L -160 -40 M 60 -40 L -160 -62" stroke="#c8c8bc" strokeWidth={1.5} opacity={0.35} />
    {/* bow catapults */}
    {[-9, 9].map((dy) => (
      <line key={dy} x1={40} y1={dy} x2={168} y2={dy * 0.4} stroke="#c8c8bc" strokeWidth={2} opacity={0.6} />
    ))}
    {/* island */}
    <rect x={6} y={20} width={42} height={14} rx={3} fill={N.island} stroke={N.hullDark} strokeWidth={2} />
    <circle cx={30} cy={27} r={5} fill="#d6dbe0" />
    {/* parked aircraft along the starboard side */}
    {parked > 0
      ? [-120, -96, -72, -48, 70, 94].map((px, i) => (
          <g key={i} opacity={parked} transform={`translate(${px} ${i < 4 ? 18 : -2}) rotate(${i < 4 ? 210 : 30}) scale(0.24)`}>
            <JetShape kind="fighter" color="#9aa4ae" />
          </g>
        ))
      : null}
  </g>
);

/** Cruiser / destroyer / supply ship, top-down. */
export const Warship: React.FC<{ x: number; y: number; a?: number; s?: number; kind?: "destroyer" | "cruiser" | "supply" | "corvette"; color?: string; wake?: number; dead?: number }> = ({
  x,
  y,
  a = 0,
  s = 1,
  kind = "destroyer",
  color = N.friend,
  wake = 1,
  dead = 0,
}) => {
  const L = kind === "cruiser" ? 1.15 : kind === "supply" ? 1.25 : kind === "corvette" ? 0.75 : 1;
  const hull =
    kind === "supply"
      ? "M 80 0 L 66 -14 L -74 -15 L -78 -10 L -78 10 L -74 15 L 66 14 Z"
      : "M 84 0 C 62 -9, 24 -13, -70 -12 L -76 -8 L -76 8 L -70 12 C 24 13, 62 9, 84 0 Z";
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s * L} ${s})`}>
      {wake > 0 && !dead ? (
        <g transform="translate(-76 0)">
          <Wake len={240} w={22} op={wake} />
        </g>
      ) : null}
      <Shadowed>
        <path d={hull} fill={dead ? "#2e3134" : N.hull} stroke={dead ? "#555" : color} strokeWidth={2.5} />
      </Shadowed>
      {kind === "supply" ? (
        <g>
          {[-40, -10, 20].map((cx) => (
            <g key={cx}>
              <rect x={cx - 10} y={-10} width={22} height={20} rx={2} fill="#5d646b" />
              <line x1={cx} y1={0} x2={cx + 6} y2={-22} stroke="#c9ced3" strokeWidth={2} />
            </g>
          ))}
          <rect x={-72} y={-9} width={20} height={18} rx={3} fill={N.island} />
        </g>
      ) : (
        <g>
          <rect x={-24} y={-7} width={kind === "cruiser" ? 50 : 40} height={14} rx={3} fill={N.island} stroke={N.hullDark} strokeWidth={1.5} />
          {kind === "cruiser" ? <rect x={-44} y={-6} width={14} height={12} rx={2} fill={N.island} /> : null}
          <circle cx={-4} cy={0} r={4} fill="#d6dbe0" />
          {/* VLS cells fore and aft */}
          {[30, -56].map((vx) => (
            <rect key={vx} x={vx} y={-6} width={18} height={12} fill="none" stroke="#2a2f34" strokeWidth={1.2} strokeDasharray="2 2" />
          ))}
          <circle cx={66} cy={0} r={3.5} fill="#2a2f34" />
          <line x1={66} y1={0} x2={80} y2={0} stroke="#2a2f34" strokeWidth={2} />
        </g>
      )}
      {dead ? <circle r={26} fill="#ff7a2a" opacity={0.4 * dead} /> : null}
    </g>
  );
};

/** Attack submarine: dark hull and sail; `depth` 0 = surfaced, 1 = deep (faint, dashed outline). */
export const Sub: React.FC<{ x: number; y: number; a?: number; s?: number; depth?: number; color?: string }> = ({ x, y, a = 0, s = 1, depth = 1, color = N.friend }) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`} opacity={1 - 0.45 * depth}>
    <ellipse rx={72} ry={9} fill="#1a2027" stroke={color} strokeWidth={2} strokeDasharray={depth > 0.5 ? "8 6" : undefined} />
    <rect x={10} y={-4} width={16} height={8} rx={3} fill="#262d35" />
    <path d="M -70 0 L -82 -8 L -82 8 Z" fill="#1a2027" />
  </g>
);

// ───────────────────────── aircraft (nose at +x) ─────────────────────────

export type JetKind = "fighter" | "hawkeye" | "growler" | "bomber" | "tanker";
export const JetShape: React.FC<{ kind?: JetKind; color?: string }> = ({ kind = "fighter", color = N.friend }) => {
  if (kind === "hawkeye")
    return (
      <g>
        <path d="M -36 -64 L -26 -64 L -18 64 L -28 64 Z" fill={color} transform="translate(8 0)" />
        <rect x={-48} y={-5} width={96} height={10} rx={5} fill={color} />
        <path d="M -40 -22 L -46 -22 L -46 22 L -40 22 Z M -44 -26 L -52 -26 L -52 26 L -44 26 Z" fill={color} />
        {[-26, 26].map((ey) => (
          <rect key={ey} x={6} y={ey - 4} width={14} height={8} rx={3} fill="#2a2f34" />
        ))}
        <ellipse cx={-6} rx={22} ry={22} fill="#e4e9ee" stroke="#2a2f34" strokeWidth={2} />
        <line x1={-24} y1={0} x2={12} y2={0} stroke="#2a2f34" strokeWidth={3} />
      </g>
    );
  if (kind === "bomber")
    return (
      <g>
        <path d="M 60 0 L 36 -6 L -10 -6 L -40 -70 L -54 -70 L -30 -6 L -56 -6 L -66 -26 L -72 -26 L -68 0 L -72 26 L -66 26 L -56 6 L -30 6 L -54 70 L -40 70 L -10 6 L 36 6 Z" fill={color} stroke="#1a0c0a" strokeWidth={2} />
        {[-40, -22, 22, 40].map((ey) => (
          <rect key={ey} x={-22} y={ey - 3} width={14} height={6} rx={2} fill="#3a1a14" />
        ))}
      </g>
    );
  if (kind === "tanker")
    return (
      <g>
        <path d="M 54 0 L 40 -7 L -40 -7 L -50 0 L -40 7 L 40 7 Z" fill={color} />
        <path d="M 14 -6 L -16 -62 L -26 -62 L -8 -6 Z M 14 6 L -16 62 L -26 62 L -8 6 Z" fill={color} />
        <path d="M -40 -4 L -54 -22 L -58 -22 L -50 0 L -58 22 L -54 22 L -40 4 Z" fill={color} />
      </g>
    );
  return (
    <g>
      <path d="M 46 0 L 30 -5 L 8 -6 L -6 -32 L -16 -32 L -12 -7 L -30 -7 L -40 -20 L -46 -20 L -42 0 L -46 20 L -40 20 L -30 7 L -12 7 L -16 32 L -6 32 L 8 6 L 30 5 Z" fill={color} stroke="#0d1218" strokeWidth={2} />
      <ellipse cx={22} rx={8} ry={3} fill="#cfe6ff" opacity={0.85} />
      {kind === "growler" ? (
        <g fill="#e4e9ee">
          <ellipse cx={-6} cy={-30} rx={9} ry={3.5} />
          <ellipse cx={-6} cy={30} rx={9} ry={3.5} />
        </g>
      ) : null}
    </g>
  );
};
/** Aircraft with a ground shadow (it is flying). */
export const Jet: React.FC<{ x: number; y: number; a?: number; s?: number; kind?: JetKind; color?: string; alt?: number }> = ({ x, y, a = 0, s = 1, kind = "fighter", color = N.friend, alt = 1 }) => (
  <g>
    <g transform={`translate(${x + 26 * alt} ${y + 34 * alt}) rotate(${a}) scale(${s})`} opacity={0.28} style={{ filter: "brightness(0)" }}>
      <JetShape kind={kind} color="#000" />
    </g>
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <JetShape kind={kind} color={color} />
    </g>
  </g>
);

// ───────────────────────── missiles ─────────────────────────

/** Point at k ∈ [0,1] on a gentle curve from a to b (`bend` = sideways bow in px). */
export const mpos = (x1: number, y1: number, x2: number, y2: number, k: number, bend = 0) => {
  const mx = (x1 + x2) / 2 - ((y2 - y1) / Math.hypot(x2 - x1, y2 - y1 || 1)) * bend;
  const my = (y1 + y2) / 2 + ((x2 - x1) / Math.hypot(x2 - x1, y2 - y1 || 1)) * bend;
  const u = 1 - k;
  const x = u * u * x1 + 2 * u * k * mx + k * k * x2;
  const y = u * u * y1 + 2 * u * k * my + k * k * y2;
  const dx = 2 * u * (mx - x1) + 2 * k * (x2 - mx);
  const dy = 2 * u * (my - y1) + 2 * k * (y2 - my);
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
};

/** A missile flying a→b over [at, at+dur): body + flame, smoke trail behind; stops at b (impact/intercept). */
export const Missile: React.FC<{
  g: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  dur: number;
  bend?: number;
  color?: string;
  s?: number;
  trail?: number;
  linger?: number;
}> = ({ g, x1, y1, x2, y2, at, dur, bend = 0, color = N.foe, s = 1, trail = 0.6, linger = 40 }) => {
  if (g < at || g > at + dur + linger) return null;
  const k = Math.min(1, (g - at) / dur);
  const p = mpos(x1, y1, x2, y2, k, bend);
  const pts = Array.from({ length: 14 }).map((_, i) => mpos(x1, y1, x2, y2, Math.max(0, k - (i * trail) / 14), bend));
  const fade = interpolate(g, [at + dur, at + dur + Math.max(1, linger)], [1, 0], CLAMP);
  return (
    <g>
      <path d={`M ${pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" L ")}`} fill="none" stroke="#dfe6ea" strokeWidth={5 * s} strokeLinecap="round" opacity={0.35 * fade} />
      {k < 1 ? (
        <g transform={`translate(${p.x} ${p.y}) rotate(${p.a}) scale(${s})`}>
          <ellipse cx={-14} rx={10} ry={4} fill="#ffcf60" opacity={0.9} />
          <path d="M 12 0 L 4 -3 L -8 -3 L -12 -7 L -12 7 L -8 3 L 4 3 Z" fill={color} stroke="#0d1218" strokeWidth={1.2} />
        </g>
      ) : null}
    </g>
  );
};

// ───────────────────────── sensors, rings, links ─────────────────────────

/** Defence ring around (cx, cy): dashed circle that slowly turns, with a label on top. */
export const RangeRing: React.FC<{ cx: number; cy: number; r: number; p: number; color?: string; label?: string; lp?: number; w?: number; op?: number }> = ({
  cx,
  cy,
  r,
  p,
  color = N.link,
  label,
  lp = 1,
  w = 4,
  op = 1,
}) => {
  const f = useCurrentFrame();
  const per = 2 * Math.PI * r;
  if (p <= 0) return null;
  return (
    <g opacity={op}>
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.04 * p} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={w} strokeDasharray={p < 1 ? `${per * p} ${per}` : "22 14"} strokeDashoffset={p < 1 ? 0 : -f * 0.6} opacity={0.8} transform={`rotate(-90 ${cx} ${cy})`} />
      {label ? (
        <text x={cx} y={cy - r - 18} textAnchor="middle" fill={color} fontFamily={COND} fontWeight={800} fontSize={38} letterSpacing={4} opacity={lp * p}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

/** Rotating radar beam (wedge fading behind the leading edge). */
export const RadarSweep: React.FC<{ x: number; y: number; r: number; color?: string; speed?: number; op?: number; id: string }> = ({ x, y, r, color = N.link, speed = 3, op = 1, id }) => {
  const f = useCurrentFrame();
  const a = (f * speed) % 360;
  const wedge = (deg: number) => {
    const t = (deg * Math.PI) / 180;
    return `${x + Math.cos(t) * r},${y + Math.sin(t) * r}`;
  };
  return (
    <g opacity={op}>
      <defs>
        <radialGradient id={`rs-${id}`} cx={x} cy={y} r={r} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={`${x},${y} ${wedge(a - i * 9)} ${wedge(a - (i + 1) * 9)}`} fill={`url(#rs-${id})`} opacity={1 - i * 0.24} />
      ))}
      <line x1={x} y1={y} x2={x + Math.cos((a * Math.PI) / 180) * r} y2={y + Math.sin((a * Math.PI) / 180) * r} stroke={color} strokeWidth={2} opacity={0.6} />
    </g>
  );
};

/** Data link: a dashed line with packets flowing from a to b. */
export const DataLink: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number; color?: string; speed?: number }> = ({ x1, y1, x2, y2, p = 1, color = N.link, speed = 3 }) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const xe = x1 + (x2 - x1) * Math.min(1, p);
  const ye = y1 + (y2 - y1) * Math.min(1, p);
  return (
    <g>
      <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={2} opacity={0.35} />
      <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={color} strokeWidth={4} strokeDasharray="6 26" strokeDashoffset={-f * speed} strokeLinecap="round" opacity={0.85} />
    </g>
  );
};

/** Radar contact blip with a pulsing ring; `foe` red, else cyan. */
export const Blip: React.FC<{ x: number; y: number; p?: number; foe?: boolean; size?: number }> = ({ x, y, p = 1, foe = true, size = 1 }) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const col = foe ? N.foe : N.link;
  const k = (f % 40) / 40;
  return (
    <g opacity={p}>
      <circle cx={x} cy={y} r={(8 + k * 22) * size} fill="none" stroke={col} strokeWidth={2} opacity={1 - k} />
      <rect x={x - 7 * size} y={y - 7 * size} width={14 * size} height={14 * size} fill="none" stroke={col} strokeWidth={2.5} transform={`rotate(45 ${x} ${y})`} />
      <circle cx={x} cy={y} r={3 * size} fill={col} />
    </g>
  );
};

/** Phalanx CIWS mount, top-down (base, dome, barrel along +x). */
export const Ciws: React.FC<{ x: number; y: number; a?: number; s?: number; firing?: number }> = ({ x, y, a = 0, s = 1, firing = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
    <circle r={30} fill="#59606a" stroke="#2a2f34" strokeWidth={3} />
    <rect x={0} y={-6} width={70} height={12} rx={4} fill="#3a4048" />
    <ellipse cx={-4} rx={22} ry={20} fill="#f1f3f5" stroke="#2a2f34" strokeWidth={2} />
    {firing > 0 ? <circle cx={76} r={16 + 6 * firing} fill="#fff1b8" opacity={0.85 * firing} /> : null}
  </g>
);

/** Vertical launch system: `n` cells in a grid, the first `fired` of them empty. */
export const Vls: React.FC<{ x: number; y: number; cols: number; n: number; fired: number; cell?: number; color?: string; flash?: number }> = ({
  x,
  y,
  cols,
  n,
  fired,
  cell = 30,
  color = N.link,
  flash = -1,
}) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }).map((_, i) => {
      const cx = (i % cols) * (cell + 4);
      const cy = Math.floor(i / cols) * (cell + 4);
      const empty = i < fired;
      return (
        <g key={i}>
          <rect x={cx} y={cy} width={cell} height={cell} rx={3} fill={empty ? "#101418" : "#56606a"} stroke={empty ? "#2a2f34" : color} strokeWidth={1.5} opacity={empty ? 0.9 : 1} />
          {!empty ? <rect x={cx + 5} y={cy + 5} width={cell - 10} height={cell - 10} rx={2} fill="#8a96a2" /> : null}
          {i === flash ? <circle cx={cx + cell / 2} cy={cy + cell / 2} r={cell} fill="#ffcf60" opacity={0.7} /> : null}
        </g>
      );
    })}
  </g>
);

/** Parachute (ejected aircrew), top-down. */
export const Chute: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={20} fill="#f0f0e8" stroke="#2a2f34" strokeWidth={2} />
    {[0, 60, 120].map((r) => (
      <line key={r} x1={-20} y1={0} x2={20} y2={0} stroke="#c9c3b0" strokeWidth={1.5} transform={`rotate(${r})`} />
    ))}
    <circle r={5} fill="#d96a2b" />
  </g>
);
