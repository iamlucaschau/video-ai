/**
 * G "HOLOGRAM HUD": reusable Remotion kit, 9:16. Style guide: ./README.md.
 *
 * Black stage, glowing amber wireframes standing on a light pedestal,
 * focus brackets, typed HUD labels, gauges, a sliding year ruler, counters.
 * Results switch to the accent colour (teal by default). Static frame: only
 * the holograms move. All SVG on the 1080×1920 canvas, driven by the frame.
 */
import { AbsoluteFill, interpolate } from "remotion";
import { CANVAS, CX, FONT, prog, SAFE, SUB_BOTTOM } from "../kit-common";
import type { SubSkin } from "../subs";

export const HUD = {
  bg: "#050505",
  amber: "#FF9A2E",
  dim: "#7A4512",
  white: "#F4EEE6",
  red: "#FF4A3D",
  /** result / "good" colour: override per project */
  accent: "#3EE6C8",
} as const;

/** Pedestal (light projector) height; holograms float above it, subtitles sit below. */
export const PEDESTAL = 1230;

export const glow = (color: string = HUD.amber, k = 1) =>
  `drop-shadow(0 0 ${4 * k}px ${color}) drop-shadow(0 0 ${16 * k}px ${color}88)`;

/** Draw-on for a path with pathLength={1}. */
export const drawOn = (p: number) => ({ strokeDasharray: 1, strokeDashoffset: 1 - p });

// ------------------------------------------------------------------ stage

export const HudBg: React.FC<{ f: number; pedestal?: number }> = ({ f, pedestal = 1 }) => (
  <AbsoluteFill style={{ backgroundColor: HUD.bg }}>
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
      <radialGradient id="hud-bg" cx="50%" cy="38%" r="70%">
        <stop offset="0%" stopColor="#1A1209" />
        <stop offset="100%" stopColor={HUD.bg} />
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#hud-bg)" />
      <g stroke={HUD.amber} strokeOpacity={0.05} strokeWidth={1}>
        {Array.from({ length: 19 }, (_, i) => <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={1920} />)}
        {Array.from({ length: 33 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 60} x2={1080} y2={i * 60} />)}
      </g>
      {/* projector: light cone + rings */}
      <linearGradient id="hud-cone" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor={HUD.amber} stopOpacity={0.22 * pedestal} />
        <stop offset="100%" stopColor={HUD.amber} stopOpacity={0} />
      </linearGradient>
      <path d={`M ${CX - 170} ${PEDESTAL} L ${CX - 380} ${PEDESTAL - 760} L ${CX + 380} ${PEDESTAL - 760} L ${CX + 170} ${PEDESTAL} Z`}
        fill="url(#hud-cone)" />
      <g style={{ filter: glow() }} fill="none" stroke={HUD.amber} opacity={pedestal}>
        <ellipse cx={CX} cy={PEDESTAL} rx={190} ry={30} strokeWidth={5} />
        <ellipse cx={CX} cy={PEDESTAL} rx={140 + 10 * Math.sin(f / 12)} ry={20} strokeWidth={3} opacity={0.7} />
        <ellipse cx={CX} cy={PEDESTAL + 10} rx={230} ry={40} strokeWidth={2} opacity={0.35} />
      </g>
    </svg>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ type

/** HUD label: types on letter by letter with a block cursor, framed by [ ]. */
export const HudLabel: React.FC<{
  text: string; f: number; at: number; out?: number; x?: number; y: number; color?: string; size?: number;
}> = ({ text, f, at, out, x = CX, y, color = HUD.amber, size = 54 }) => {
  if (f < at) return null;
  const n = Math.min(text.length, Math.floor((f - at) * 1.6));
  const o = out === undefined ? 1 : 1 - prog(f, out, 5);
  const w = text.length * size * 0.66 + 70;
  const cursor = n < text.length || Math.floor(f / 8) % 2 === 0;
  return (
    <g style={{ translate: `${x}px ${y}px`, opacity: o }}>
      <g stroke={color} strokeWidth={4} fill="none" style={{ filter: glow(color, 0.6) }}>
        <path d={`M ${-w / 2 + 22} ${-size} L ${-w / 2} ${-size} L ${-w / 2} ${size * 0.6} L ${-w / 2 + 22} ${size * 0.6}`} />
        <path d={`M ${w / 2 - 22} ${-size} L ${w / 2} ${-size} L ${w / 2} ${size * 0.6} L ${w / 2 - 22} ${size * 0.6}`} />
      </g>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={HUD.white}
        style={{ filter: glow(color, 0.4) }}>
        {text.slice(0, n)}
        <tspan fill={color} opacity={cursor ? 1 : 0}>▌</tspan>
      </text>
    </g>
  );
};

/** Big glowing number / year. */
export const HudNumber: React.FC<{
  text: string; f: number; at: number; out?: number; x?: number; y: number; size?: number; color?: string;
}> = ({ text, f, at, out, x = CX, y, size = 150, color = HUD.amber }) => {
  const o = prog(f, at, 6) * (out === undefined ? 1 : 1 - prog(f, out, 5));
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={color}
      opacity={o} style={{ filter: glow(color) }}>
      {text}
    </text>
  );
};

// ------------------------------------------------------------------ instruments

/** Four corner brackets that snap in around a box. */
export const Brackets: React.FC<{
  x: number; y: number; w: number; h: number; f: number; at: number; out?: number; color?: string;
}> = ({ x, y, w, h, f, at, out, color = HUD.amber }) => {
  const p = prog(f, at, 10);
  const o = p * (out === undefined ? 1 : 1 - prog(f, out, 5));
  const k = 1.25 - 0.25 * p;
  const L = 44;
  return (
    <g style={{ translate: `${x}px ${y}px`, scale: k, opacity: o, filter: glow(color, 0.6) }}
      stroke={color} strokeWidth={6} fill="none">
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => (
        <path key={`${sx}${sy}`}
          d={`M ${(sx * w) / 2} ${(sy * h) / 2 - sy * L} L ${(sx * w) / 2} ${(sy * h) / 2} L ${(sx * w) / 2 - sx * L} ${(sy * h) / 2}`} />
      ))}
    </g>
  );
};

/** Year ruler: ticks every year, a marker sliding to `year`. */
export const YearRuler: React.FC<{
  from: number; to: number; year: number; prevYear?: number; f: number; at: number; y: number;
}> = ({ from, to, year, prevYear = from, f, at, y }) => {
  const x0 = 120;
  const x1 = 880;
  const xs = (yr: number) => x0 + ((yr - from) / (to - from)) * (x1 - x0);
  const cur = interpolate(prog(f, at, 24), [0, 1], [prevYear, year]);
  return (
    <g opacity={prog(f, at - 6, 6)}>
      <g stroke={HUD.amber} strokeOpacity={0.6} style={{ filter: glow(HUD.amber, 0.4) }}>
        <line x1={x0} y1={y} x2={x1} y2={y} strokeWidth={3} />
        {Array.from({ length: to - from + 1 }, (_, i) => (
          <line key={i} x1={xs(from + i)} y1={y} x2={xs(from + i)} y2={y - ((from + i) % 5 ? 14 : 30)} strokeWidth={3} />
        ))}
      </g>
      <g style={{ translate: `${xs(cur)}px ${y}px`, filter: glow() }}>
        <path d="M -16 22 L 16 22 L 0 2 Z" fill={HUD.amber} />
      </g>
      <text x={CX} y={y - 60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={120}
        fill={HUD.amber} style={{ filter: glow() }}>
        {Math.round(cur)}
      </text>
    </g>
  );
};

/** Ring gauge with a needle; value 0..1. */
export const Gauge: React.FC<{ x: number; y: number; r: number; value: number; color?: string }> = ({
  x, y, r, value, color = HUD.amber,
}) => {
  const a0 = -220;
  const a1 = 40;
  const a = a0 + (a1 - a0) * value;
  const pt = (deg: number, rr: number) => [x + rr * Math.cos((deg * Math.PI) / 180), y + rr * Math.sin((deg * Math.PI) / 180)];
  const [sx, sy] = pt(a0, r);
  const [ex, ey] = pt(a, r);
  const [nx, ny] = pt(a, r - 26);
  return (
    <g fill="none" strokeLinecap="round" style={{ filter: glow(color, 0.7) }}>
      <circle cx={x} cy={y} r={r} stroke={HUD.dim} strokeWidth={10} />
      <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${a - a0 > 180 ? 1 : 0} 1 ${ex} ${ey}`} stroke={color} strokeWidth={12} />
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={color} strokeWidth={6} />
      <circle cx={x} cy={y} r={10} fill={color} />
    </g>
  );
};

// ------------------------------------------------------------------ objects

/** Comet-style jet airliner, side view, ~820 wide, centred on (x, y). `p` draws it on. */
export const Airliner: React.FC<{ x: number; y: number; s?: number; p?: number; color?: string; windows?: "square" | "round" }> = ({
  x, y, s = 1, p = 1, color = HUD.amber, windows = "square",
}) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s, filter: glow(color) }} fill="none" stroke={color} strokeLinejoin="round">
    <path pathLength={1} style={drawOn(p)} strokeWidth={5}
      d="M -410 0 Q -410 -46 -340 -52 L 300 -52 L 380 -170 L 420 -170 L 400 -40 Q 400 30 330 40 L -330 46 Q -410 46 -410 0 Z" />
    <path pathLength={1} style={drawOn(p)} strokeWidth={4} d="M -80 30 L 120 30 L 250 110 L 190 110 Z" />
    <path pathLength={1} style={drawOn(p)} strokeWidth={3} d="M 300 -10 L 420 -10 L 440 20 L 330 20 Z" />
    <g opacity={p} strokeWidth={2} strokeOpacity={0.4}>
      {[-250, -150, -50, 50, 150, 250].map((xx) => <line key={xx} x1={xx} y1={-52} x2={xx} y2={44} />)}
      <line x1={-400} y1={0} x2={395} y2={0} />
    </g>
    <g opacity={prog(p, 0.7, 0.3, (t) => t)} strokeWidth={3}>
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={-300 + i * 46} y={-34} width={22} height={24} rx={windows === "round" ? 9 : 2} />
      ))}
      <path d="M -395 -14 L -365 -34 L -340 -34 L -340 -14 Z" />
    </g>
  </g>
);

/** Fuselage cross-section that swells with cabin pressure (0..1) and shows pressure arrows. */
export const CabinSection: React.FC<{ x: number; y: number; r: number; swell: number; o?: number; color?: string }> = ({
  x, y, r, swell, o = 1, color = HUD.amber,
}) => {
  const R = r * (1 + 0.06 * swell);
  return (
    <g style={{ translate: `${x}px ${y}px`, opacity: o, filter: glow(color) }} fill="none" stroke={color}>
      <circle r={R} strokeWidth={7} />
      <circle r={R - 26} strokeWidth={2} strokeOpacity={0.5} />
      <line x1={-R + 30} y1={R * 0.35} x2={R - 30} y2={R * 0.35} strokeWidth={3} strokeOpacity={0.6} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const r0 = r * 0.35;
        const r1 = r0 + (R - 60 - r0) * (0.4 + 0.6 * swell);
        return (
          <g key={i} opacity={0.3 + 0.7 * swell} strokeWidth={5}>
            <line x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} />
            <path d={`M ${Math.cos(a - 0.12) * (r1 - 18)} ${Math.sin(a - 0.12) * (r1 - 18)} L ${Math.cos(a) * r1} ${Math.sin(a) * r1} L ${Math.cos(a + 0.12) * (r1 - 18)} ${Math.sin(a + 0.12) * (r1 - 18)}`} />
          </g>
        );
      })}
    </g>
  );
};

/** Window opening with stress contours. radius small = sharp corners (stress piles up, red hot spots). */
export const StressWindow: React.FC<{
  x: number; y: number; w: number; h: number; radius: number; stress: number; f: number; color?: string;
}> = ({ x, y, w, h, radius, stress, f, color = HUD.amber }) => {
  const sharp = radius < 40;
  const hot = sharp ? stress * (0.85 + 0.15 * Math.sin(f / 3)) : 0;
  const ringColor = sharp ? color : HUD.accent;
  return (
    <g style={{ translate: `${x}px ${y}px` }}>
      {[1, 2, 3, 4].map((k) => {
        // sharp: contours hug the opening and bunch at the corners; round: evenly spread
        const d = sharp ? 10 * k * k : 34 * k;
        return (
          <rect key={k} x={-w / 2 - d} y={-h / 2 - d} width={w + 2 * d} height={h + 2 * d}
            rx={radius + d * (sharp ? 0.15 : 1)} fill="none" stroke={ringColor} strokeWidth={3}
            opacity={stress * (0.75 - k * 0.12)} style={{ filter: glow(ringColor, 0.4) }} />
        );
      })}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={radius} fill="#0B0B0B" stroke={color} strokeWidth={8}
        style={{ filter: glow(color) }} />
      {sharp && hot > 0 && [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => (
        <circle key={`${sx}${sy}`} cx={(sx * w) / 2} cy={(sy * h) / 2} r={34 + 26 * hot} fill={HUD.red}
          opacity={0.75 * hot} style={{ filter: `blur(10px)` }} />
      ))}
    </g>
  );
};

/** Jagged crack drawing on from (x, y). */
export const Crack: React.FC<{ x: number; y: number; p: number; s?: number; r?: number }> = ({ x, y, p, s = 1, r = 0 }) => (
  <path pathLength={1} style={{ ...drawOn(p), translate: `${x}px ${y}px`, scale: s, rotate: `${r}deg`, filter: glow(HUD.red) }}
    d="M 0 0 L 24 -14 L 40 10 L 66 -6 L 84 18 L 110 4 L 130 30 L 160 14 L 190 40"
    fill="none" stroke={HUD.red} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
);

/** Water tank outline with moving surface lines. */
export const Tank: React.FC<{ x: number; y: number; w: number; h: number; f: number; o?: number }> = ({ x, y, w, h, f, o = 1 }) => (
  <g style={{ translate: `${x - w / 2}px ${y - h / 2}px`, opacity: o, filter: glow(HUD.amber, 0.6) }} fill="none" stroke={HUD.amber}>
    <rect width={w} height={h} strokeWidth={5} />
    {[0, 1, 2].map((i) => {
      const yy = 60 + i * 26;
      const ph = f / 10 + i;
      const d = Array.from({ length: 21 }, (_, k) => `${k ? "L" : "M"} ${(k / 20) * w} ${yy + 8 * Math.sin(ph + k * 0.8)}`).join(" ");
      return <path key={i} d={d} strokeWidth={3} strokeOpacity={0.6 - i * 0.15} />;
    })}
  </g>
);


// ------------------------------------------------------------------ subtitles

/** Karaoke subtitle skin: dark glass panel with amber corner brackets and a typing cursor. */
export const HudSub: SubSkin = ({ lines, f }) => {
  const last = lines.flat().filter((w) => w.said).length - 1;
  let n = -1;
  const corner = (v: "top" | "bottom", h: "left" | "right"): React.CSSProperties => ({
    position: "absolute", [v]: -6, [h]: -6, width: 34, height: 34,
    [`border${v === "top" ? "Top" : "Bottom"}`]: `5px solid ${HUD.amber}`,
    [`border${h === "left" ? "Left" : "Right"}`]: `5px solid ${HUD.amber}`,
  });
  return (
    <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
      <div style={{
        position: "relative", background: "rgba(8,6,4,0.78)", padding: "16px 34px 20px", textAlign: "center",
        fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.14, filter: `drop-shadow(0 0 10px ${HUD.amber}55)`,
      }}>
        <div style={corner("top", "left")} /><div style={corner("top", "right")} />
        <div style={corner("bottom", "left")} /><div style={corner("bottom", "right")} />
        {lines.map((ln, i) => (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            {ln.map((w, k) => {
              n++;
              return (
                <span key={k} style={{ color: w.key ? HUD.amber : w.said ? HUD.white : "#5E5146", textShadow: w.said ? `0 0 12px ${w.key ? HUD.amber : HUD.white}66` : "none" }}>
                  {k ? " " : ""}{w.text}
                  {n === last && <span style={{ color: HUD.amber, opacity: Math.floor(f / 8) % 2 ? 0 : 1 }}>▌</span>}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
