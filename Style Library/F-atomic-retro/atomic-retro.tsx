/**
 * F "ATOMIC RETRO": reusable Remotion kit, 9:16. Style guide: ./README.md.
 *
 * 1950s Atomic-Age illustration: flat colour-block backgrounds that change
 * per beat, paper grain, boomerang + starburst ornaments at the edges,
 * gouache-flat characters and objects with an ink outline, big retro years
 * with a hard offset shadow, cream plaques for keywords, isotype grids.
 * Static frame: only the elements move. Everything is SVG on the 1080×1920
 * canvas; every motion is derived from the frame passed in.
 */
import { AbsoluteFill, Img, interpolate, random, staticFile } from "remotion";
import { CANVAS, CX, FONT, pop, prog, SAFE, SUB_BOTTOM } from "../kit-common";
import type { SubSkin } from "../subs";

export const RETRO = {
  teal: "#2B8C84",
  tealDeep: "#1F6B65",
  mustard: "#D9A63A",
  coral: "#E2574C",
  cream: "#F3E7CB",
  paper: "#FBF3DF",
  sky: "#9ED4CC",
  ink: "#2A2622",
  skin: "#EFC39B",
  steel: "#B9C3C2",
  choc: "#6B3F2A",
  /** keyword/number accent: override per project */
  accent: "#E2574C",
} as const;

const INK = 5; // outline width
/** Floor line: figures and objects stand here; the ground band sits under the subtitles. */
export const GROUND = 1240;

/** Soft contact shadow under a figure/object. */
export const Shadow: React.FC<{ x: number; y?: number; w: number }> = ({ x, y = GROUND, w }) => (
  <ellipse cx={x} cy={y} rx={w / 2} ry={w / 11} fill={RETRO.ink} opacity={0.22} />
);

// ------------------------------------------------------------------ background

const Boomerang: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => (
  <path
    d="M -60 10 Q 0 -40 60 10 Q 0 -10 -60 10 Z"
    fill={color}
    style={{ translate: `${x}px ${y}px`, rotate: `${r}deg` }}
  />
);

const Sparkle: React.FC<{ x: number; y: number; s: number; color: string; f: number; seed: number }> = ({
  x, y, s, color, f, seed,
}) => {
  // ambient twinkle of the ornament itself, never the frame
  const k = 1 + 0.12 * Math.sin(f / 18 + seed * 3);
  return (
    <g style={{ translate: `${x}px ${y}px`, scale: s * k }} stroke={color} strokeWidth={4} strokeLinecap="round">
      {[0, 45, 90, 135].map((a) => (
        <line key={a} x1={0} y1={a % 90 ? -16 : -30} x2={0} y2={a % 90 ? 16 : 30} style={{ rotate: `${a}deg` }} />
      ))}
    </g>
  );
};

/** Colour-block page: grain + edge ornaments. Bleeds past the safe zone (decoration only). */
export const RetroBg: React.FC<{ color: string; f: number; ornament?: string; ground?: string }> = ({
  color, f, ornament = RETRO.cream, ground,
}) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
      {ground && <rect x={0} y={GROUND} width={CANVAS.width} height={CANVAS.height - GROUND} fill={ground} />}
      <filter id="retro-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={4} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#retro-grain)" opacity={0.16} style={{ mixBlendMode: "multiply" }} />
      <radialGradient id="retro-vig" cx="50%" cy="45%" r="75%">
        <stop offset="60%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.22} />
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#retro-vig)" />
      <Boomerang x={70} y={330} r={-30} color={ornament} />
      <Boomerang x={990} y={1500} r={150} color={RETRO.coral} />
      <Boomerang x={1010} y={250} r={20} color={RETRO.mustard} />
      <Sparkle x={120} y={1520} s={1.2} color={ornament} f={f} seed={1} />
      <Sparkle x={980} y={420} s={0.9} color={ornament} f={f} seed={2} />
      <Sparkle x={70} y={760} s={0.7} color={RETRO.mustard} f={f} seed={3} />
    </svg>
  </AbsoluteFill>
);

// ------------------------------------------------------------------ illustrations (AI / hand-made images)

/** Full-frame illustrated plate (9:16 image in public/). Static: no pan, no zoom. */
export const Backdrop: React.FC<{ src: string; o?: number }> = ({ src, o = 1 }) => (
  <AbsoluteFill style={{ opacity: o }}>
    <Img src={staticFile(src)} style={{ width: CANVAS.width, height: CANVAS.height, objectFit: "cover" }} />
  </AbsoluteFill>
);

/**
 * Cut-out figure/object (transparent PNG, trimmed) standing with its bottom
 * centre at (x, bottom). `enter` 0→1 rises it into place.
 */
export const Cutout: React.FC<{
  src: string; x: number; bottom: number; height: number; o?: number; enter?: number;
}> = ({ src, x, bottom, height, o = 1, enter = 1 }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left: x,
      top: bottom - height,
      height,
      translate: `-50% ${(1 - enter) * 60}px`,
      opacity: o * Math.min(1, enter * 2),
    }}
  />
);

// ------------------------------------------------------------------ type

/** Big retro year/number with a hard offset shadow. Pops in at `at`. */
export const BigNumber: React.FC<{
  text: string; f: number; at: number; out?: number; x?: number; y: number; size?: number; fill?: string;
}> = ({ text, f, at, out, x = CX, y, size = 200, fill = RETRO.cream }) => {
  const o = out === undefined ? 1 : 1 - prog(f, out, 5);
  return (
    <g style={{ translate: `${x}px ${y}px`, scale: pop(f, at), opacity: o }}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} x={12} y={12} fill={RETRO.ink}>
        {text}
      </text>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={fill}
        stroke={RETRO.ink} strokeWidth={6} paintOrder="stroke">
        {text}
      </text>
    </g>
  );
};

/** Cream keyword plaque (≤ 5 words). */
export const Plaque: React.FC<{
  text: string; f: number; at: number; out?: number; x?: number; y: number; color?: string; size?: number;
}> = ({ text, f, at, out, x = CX, y, color = RETRO.ink, size = 56 }) => {
  const w = text.length * size * 0.7 + 80;
  const h = size + 44;
  const o = out === undefined ? 1 : 1 - prog(f, out, 5);
  return (
    <g style={{ translate: `${x}px ${y}px`, scale: pop(f, at), opacity: o }}>
      <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w} height={h} rx={14} fill={RETRO.ink} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={RETRO.paper} stroke={RETRO.ink} strokeWidth={INK} />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

/** Comic starburst with a word ("ZAP", "POP"). */
export const Burst: React.FC<{ text: string; f: number; at: number; x: number; y: number; r?: number }> = ({
  text, f, at, x, y, r = 130,
}) => {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const rr = i % 2 ? r * 0.62 : r;
    const a = (i / 24) * Math.PI * 2;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
  return (
    <g style={{ translate: `${x}px ${y}px`, scale: pop(f, at), rotate: "-8deg" }}>
      <polygon points={pts} fill={RETRO.accent} stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round" />
      <text textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={800} fontSize={r * 0.5}
        fill={RETRO.cream} stroke={RETRO.ink} strokeWidth={4} paintOrder="stroke">
        {text}
      </text>
    </g>
  );
};

// ------------------------------------------------------------------ characters

/**
 * Mid-century engineer, 400×800 local box, feet at the bottom. `melt` 0→1
 * drips the chocolate bar in his breast pocket.
 */
export const Engineer: React.FC<{ x: number; y: number; s?: number; melt?: number; bar?: boolean }> = ({
  x, y, s = 1, melt = 0, bar = true,
}) => (
  <g style={{ translate: `${x - 200 * s}px ${y - 800 * s}px`, scale: s, transformOrigin: "0 0" }}
    stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round" strokeLinecap="round">
    {/* legs + shoes */}
    <rect x={140} y={600} width={50} height={170} fill="#3E4A57" />
    <rect x={210} y={600} width={50} height={170} fill="#3E4A57" />
    <ellipse cx={160} cy={778} rx={42} ry={18} fill={RETRO.ink} />
    <ellipse cx={240} cy={778} rx={42} ry={18} fill={RETRO.ink} />
    {/* arms (behind coat) */}
    <path d="M 110 250 Q 70 400 92 560" fill="none" stroke={RETRO.ink} strokeWidth={58} />
    <path d="M 110 250 Q 70 400 92 560" fill="none" stroke={RETRO.paper} strokeWidth={46} />
    <path d="M 290 250 Q 330 400 308 560" fill="none" stroke={RETRO.ink} strokeWidth={58} />
    <path d="M 290 250 Q 330 400 308 560" fill="none" stroke={RETRO.paper} strokeWidth={46} />
    <circle cx={92} cy={580} r={26} fill={RETRO.skin} />
    <circle cx={308} cy={580} r={26} fill={RETRO.skin} />
    {/* lab coat */}
    <path d="M 120 230 L 280 230 Q 300 420 312 640 L 88 640 Q 100 420 120 230 Z" fill={RETRO.paper} />
    {/* shirt + tie */}
    <path d="M 165 230 L 235 230 L 200 330 Z" fill="#DCE8E6" />
    <path d="M 200 248 L 212 270 L 205 340 L 200 352 L 195 340 L 188 270 Z" fill={RETRO.coral} strokeWidth={3} />
    <line x1={200} y1={360} x2={200} y2={640} strokeWidth={3} />
    {/* chocolate bar + pocket */}
    {bar && (
      <g>
        <rect x={232} y={262} width={36} height={56} rx={4} fill={RETRO.choc} />
        <rect x={232} y={262} width={36} height={14} fill="#C9B9A0" strokeWidth={3} />
        {melt > 0 && (
          <path
            d={`M 236 340 L 236 ${340 + 120 * melt} Q 242 ${352 + 120 * melt} 248 ${340 + 120 * melt}
                L 248 ${340 + 60 * melt} Q 254 ${350 + 60 * melt} 260 ${340 + 60 * melt}
                L 260 ${340 + 90 * melt} Q 265 ${350 + 90 * melt} 268 ${340 + 90 * melt} L 268 340 Z`}
            fill={RETRO.choc}
            strokeWidth={3}
          />
        )}
      </g>
    )}
    <rect x={222} y={296} width={58} height={50} rx={4} fill={RETRO.paper} />
    {/* head */}
    <rect x={182} y={190} width={36} height={44} fill={RETRO.skin} />
    <circle cx={128} cy={130} r={16} fill={RETRO.skin} />
    <circle cx={272} cy={130} r={16} fill={RETRO.skin} />
    <ellipse cx={200} cy={125} rx={72} ry={82} fill={RETRO.skin} />
    <path d="M 128 112 Q 120 40 200 38 Q 290 36 276 110 Q 250 70 196 78 Q 150 82 128 112 Z" fill="#4A2F22" />
    <circle cx={172} cy={130} r={20} fill="#FFFFFF" fillOpacity={0.4} strokeWidth={4} />
    <circle cx={228} cy={130} r={20} fill="#FFFFFF" fillOpacity={0.4} strokeWidth={4} />
    <line x1={192} y1={130} x2={208} y2={130} strokeWidth={4} />
    <circle cx={172} cy={132} r={4} fill={RETRO.ink} />
    <circle cx={228} cy={132} r={4} fill={RETRO.ink} />
    <path d="M 178 172 Q 200 188 222 172" fill="none" strokeWidth={4} />
  </g>
);

// ------------------------------------------------------------------ objects

/** Microwave waves leaving (x, y) towards +x. Ambient: rings travel with the frame. */
export const Waves: React.FC<{ x: number; y: number; f: number; reach?: number; o?: number; color?: string }> = ({
  x, y, f, reach = 380, o = 1, color = RETRO.cream,
}) => (
  <g style={{ translate: `${x}px ${y}px`, opacity: o }} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round">
    {[0, 1, 2, 3].map((i) => {
      const t = ((f / 40 + i / 4) % 1 + 1) % 1;
      const r = 60 + t * reach;
      return (
        <path key={i} d={`M ${r * Math.cos(-0.5)} ${r * Math.sin(-0.5)} A ${r} ${r} 0 0 1 ${r * Math.cos(0.5)} ${r * Math.sin(0.5)}`}
          opacity={interpolate(t, [0, 0.15, 0.8, 1], [0, 1, 1, 0])} strokeDasharray="22 16" />
      );
    })}
  </g>
);

/** Magnetron tube with cooling fins. */
export const Magnetron: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round">
    <rect x={-20} y={-230} width={40} height={90} fill={RETRO.steel} />
    <circle cx={0} cy={-240} r={22} fill={RETRO.coral} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={-130} y={-140 + i * 34} width={260} height={18} rx={4} fill={RETRO.steel} />
    ))}
    <rect x={-80} y={-150} width={160} height={230} rx={18} fill="#8D9897" />
    <circle cx={0} cy={-35} r={46} fill={RETRO.ink} />
    <circle cx={0} cy={-35} r={24} fill={RETRO.mustard} />
    <rect x={-110} y={80} width={220} height={40} rx={8} fill={RETRO.tealDeep} />
  </g>
);

export const ChocolateBar: React.FC<{ x: number; y: number; melt: number; s?: number }> = ({ x, y, melt, s = 1 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round">
    <path
      d={`M -90 -150 L 90 -150 L 90 ${150 - 60 * melt} Q 60 ${150 + 70 * melt} 30 ${150 - 20 * melt}
          Q 0 ${150 + 110 * melt} -30 ${150 - 10 * melt} Q -60 ${150 + 50 * melt} -90 ${150 - 40 * melt} Z`}
      fill={RETRO.choc}
    />
    {[0, 1].map((c) =>
      [0, 1, 2].map((r) => (
        <rect key={`${c}${r}`} x={-70 + c * 75} y={-130 + r * 80} width={65} height={68} rx={6}
          fill="#7F4C33" strokeWidth={3} opacity={1 - melt * 0.8} />
      )),
    )}
    <path d="M -100 40 L 100 40 L 100 170 L -100 170 Z" fill={RETRO.coral} opacity={1 - melt} />
  </g>
);

/** Kernels on a tray that pop into flying puffs at `at`. */
export const Popcorn: React.FC<{ x: number; y: number; f: number; at: number; n?: number; s?: number }> = ({
  x, y, f, at, n = 14, s = 1,
}) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={4} strokeLinejoin="round">
    <rect x={-150} y={20} width={300} height={36} rx={10} fill={RETRO.tealDeep} strokeWidth={INK} />
    {Array.from({ length: n }, (_, i) => {
      const t0 = at + Math.round(random(`pc${i}`) * 30);
      const p = prog(f, t0, 26, (t) => t);
      const sx = -120 + (i % 7) * 40;
      const tx = (random(`px${i}`) - 0.5) * 760;
      const ty = -260 - random(`py${i}`) * 380;
      const cx = sx + tx * p;
      const cy = 10 + ty * p + 900 * p * p * 0.55;
      if (p <= 0) return <ellipse key={i} cx={sx + (i < 7 ? 0 : 20)} cy={i < 7 ? 2 : -22} rx={17} ry={13} fill={RETRO.mustard} />;
      return (
        <g key={i} style={{ translate: `${cx}px ${cy}px`, rotate: `${p * 360 * (random(`pr${i}`) - 0.5)}deg` }}>
          {[[-12, 0], [12, -4], [0, -16], [2, 10]].map(([a, b], k) => (
            <circle key={k} cx={a} cy={b} r={16} fill={RETRO.paper} />
          ))}
        </g>
      );
    })}
  </g>
);

/** 1947 Radarange: a fridge-sized steel cabinet, 300×720 box, bottom at y. */
export const Radarange: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 720 }) => {
  const s = h / 720;
  return (
    <g style={{ translate: `${x - 150 * s}px ${y - h}px`, scale: s, transformOrigin: "0 0" }}
      stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round">
      <rect x={0} y={0} width={300} height={700} rx={16} fill={RETRO.steel} />
      <rect x={20} y={20} width={260} height={120} rx={8} fill="#97A3A2" />
      {[60, 130, 200].map((cx) => (
        <circle key={cx} cx={cx + 20} cy={80} r={24} fill={RETRO.paper} />
      ))}
      <rect x={30} y={180} width={240} height={200} rx={12} fill={RETRO.ink} />
      <rect x={50} y={200} width={200} height={160} rx={8} fill={RETRO.tealDeep} />
      <rect x={250} y={250} width={14} height={70} rx={6} fill={RETRO.paper} />
      {[440, 500, 560, 620].map((yy) => (
        <line key={yy} x1={40} y1={yy} x2={260} y2={yy} strokeWidth={4} />
      ))}
      <rect x={30} y={690} width={40} height={20} fill={RETRO.ink} />
      <rect x={230} y={690} width={40} height={20} fill={RETRO.ink} />
    </g>
  );
};

/** 1967 countertop oven, centred on (x, y), 460 wide. */
export const Countertop: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round">
    <rect x={-240} y={-150} width={480} height={300} rx={26} fill={RETRO.cream} />
    <rect x={-210} y={-115} width={300} height={230} rx={16} fill={RETRO.ink} />
    <rect x={-190} y={-95} width={260} height={190} rx={10} fill={RETRO.tealDeep} />
    <rect x={110} y={-115} width={100} height={230} rx={12} fill={RETRO.mustard} />
    <circle cx={160} cy={-50} r={28} fill={RETRO.paper} />
    <circle cx={160} cy={30} r={28} fill={RETRO.paper} />
    <rect x={-200} y={150} width={50} height={18} fill={RETRO.ink} />
    <rect x={150} y={150} width={50} height={18} fill={RETRO.ink} />
  </g>
);

export const House: React.FC<{ x: number; y: number; s?: number; fill: string; cross?: number }> = ({
  x, y, s = 1, fill, cross = 0,
}) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round">
    <path d="M -70 -10 L 0 -75 L 70 -10 L 70 70 L -70 70 Z" fill={fill} />
    <rect x={-18} y={20} width={36} height={50} fill={RETRO.ink} />
    {cross > 0 && (
      <g stroke={RETRO.accent} strokeWidth={16} strokeLinecap="round">
        <line x1={-90} y1={-90} x2={-90 + 180 * cross} y2={-90 + 180 * cross} />
        <line x1={90} y1={-90} x2={90 - 180 * Math.max(0, cross * 2 - 1)} y2={-90 + 180 * Math.max(0, cross * 2 - 1)} />
      </g>
    )}
  </g>
);

export const Ship: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round">
    <rect x={-40} y={-100} width={36} height={60} fill={RETRO.coral} />
    <rect x={14} y={-100} width={36} height={60} fill={RETRO.coral} />
    <rect x={-80} y={-44} width={160} height={40} fill={RETRO.paper} />
    <path d="M -120 -4 L 120 -4 L 90 60 L -90 60 Z" fill={RETRO.ink} />
  </g>
);

export const Plate: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={INK} strokeLinecap="round">
    <ellipse cx={0} cy={0} rx={100} ry={40} fill={RETRO.paper} />
    <ellipse cx={0} cy={-6} rx={60} ry={22} fill={RETRO.coral} />
    <line x1={-140} y1={-40} x2={-140} y2={40} />
    <line x1={140} y1={-40} x2={140} y2={40} />
  </g>
);

/** H₂O that spins back and forth (amp°) with heat squiggles rising. */
export const WaterMolecule: React.FC<{ x: number; y: number; f: number; amp: number; heat: number }> = ({
  x, y, f, amp, heat,
}) => (
  <g style={{ translate: `${x}px ${y}px` }}>
    {[-110, 0, 110].map((dx, i) => (
      <path key={i}
        d={`M ${dx} ${-200 - ((f * 3 + i * 40) % 120)} q 20 -25 0 -50 q -20 -25 0 -50`}
        fill="none" stroke={RETRO.coral} strokeWidth={10} strokeLinecap="round"
        opacity={heat * interpolate((f * 3 + i * 40) % 120, [0, 30, 120], [0, 1, 0])} />
    ))}
    <g style={{ rotate: `${amp * Math.sin(f / 2.2)}deg` }} stroke={RETRO.ink} strokeWidth={INK}>
      <line x1={0} y1={0} x2={-115} y2={95} strokeWidth={22} />
      <line x1={0} y1={0} x2={115} y2={95} strokeWidth={22} />
      <circle cx={-115} cy={95} r={62} fill={RETRO.paper} />
      <circle cx={115} cy={95} r={62} fill={RETRO.paper} />
      <circle cx={0} cy={0} r={110} fill={RETRO.coral} />
      {[["O", 0, 0, 90], ["H", -115, 95, 60], ["H", 115, 95, 60]].map(([t, cx, cy, fs]) => (
        <text key={`${cx}`} x={cx as number} y={cy as number} textAnchor="middle" dominantBaseline="central"
          fontFamily={FONT} fontWeight={800} fontSize={fs as number} fill={RETRO.ink} stroke="none">
          {t}
        </text>
      ))}
    </g>
  </g>
);

/** Radar dish facing +x. */
export const Dish: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g style={{ translate: `${x}px ${y}px`, scale: s }} stroke={RETRO.ink} strokeWidth={INK} strokeLinejoin="round">
    <rect x={-30} y={60} width={60} height={140} fill={RETRO.steel} />
    <path d="M -40 -160 Q 90 0 -40 160 Z" fill={RETRO.paper} />
    <line x1={10} y1={0} x2={90} y2={0} />
    <circle cx={92} cy={0} r={14} fill={RETRO.coral} />
  </g>
);


// ------------------------------------------------------------------ subtitles

/** Karaoke subtitle skin: cream paper plaque, ink border, hard accent shadow (as in the reference). */
export const RetroSub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM, display: "flex", justifyContent: "center" }}>
    <div style={{
      background: RETRO.paper, border: `5px solid ${RETRO.ink}`, borderRadius: 18, padding: "14px 34px 18px",
      boxShadow: `10px 10px 0 ${RETRO.accent}`, textAlign: "center",
      fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.12,
    }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {ln.map((w, k) => (
            <span key={k} style={{ color: w.key ? RETRO.accent : w.said ? RETRO.ink : "#A9A194", opacity: w.key && !w.said ? 0.55 : 1 }}>
              {k ? " " : ""}{w.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
