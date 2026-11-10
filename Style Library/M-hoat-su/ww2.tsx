/**
 * Style M "Hoạt Sử", WWII pieces for the demo (2026-11-04, m-churchill): soldiers' looks and helmets, the props a
 * character holds (sword, longbow, bagpipes, rifle), vehicles, and the outdoor sets. Lucas 2026-11-04: outdoor sets are
 * drawn in code from now on (no AI pictures); `Outside` still uses a picture if one exists in `public/images/<slug>/`
 * (only m-churchill has them).
 * Everything draws in the 1080×1920 SVG world, like hoat-su.tsx.
 */
import React from "react";
import { getStaticFiles, interpolate, staticFile } from "remotion";
import { CLAMP } from "../kit-common";
import { rnd } from "../toon-engine/anim";
import { armShift, HEAD, joints, type Look, type Pose, toWorld } from "../toon-engine/rig";
import { HAND, M, OnChest, OnHead, PLUM } from "./hoat-su";
import { CodeSet, HORIZON, type SetKind } from "./sets";
import { Defocus } from "./look";
import { LOOKS } from "../toon-engine/rig";

const look = (jacket: string, shade: string, accent: string, skin = "#FBF8F2"): Look => ({ ...LOOKS.suit, skin, hand: skin, jacket, jacketShade: shade, accent, limb: shade, extra: "suit", line: PLUM, face: PLUM, head: "bean", body: "chunky", skinShade: "#DCD6CE", shoe: "#3E2E26" });
/** Battledress khaki (British), field grey (German). Jack's webbing strap is the darker accent. */
export const TROOPS = {
  jack: look("#9A8657", "#7C6B44", "#5A4A2E"),
  tommy: look("#8F8158", "#746845", "#5E5236"),
  landser: look("#69705F", "#555B4D", "#3C4036"),
  /** US Army olive drab (m-doss, 2026-11-04) and a civilian grey suit (Truman). */
  gi: look("#77714A", "#5E5A3A", "#4A4630"),
  suitGrey: look("#5C6068", "#4A4E56", "#7A2E36"),
} satisfies Record<string, Look>;
/** Extras drawn from one look still differ (Lucas 2026-11-04 "chưa đa dạng"): build, facial hair and hair colour from the seed.
 *  A look with its own `girth` is a named person (real face) and is left as it is. */
export const vary = (l: Look, seed: number): Look => (l.girth !== undefined ? l : {
  ...l,
  girth: [0.9, 1, 1.12, 1.24, 0.95][seed % 5],
  facial: ([undefined, "mustache", "stubble", undefined, "goatee", "handlebar", undefined] as const)[seed % 7],
  hair: ["#2A1C18", "#5A3A26", "#7A5A3A", "#3A2A20"][seed % 4],
});

/** Cel shading for a helmet shell `d` (prototype, Lucas 2026-11-04 "3d như họ"): shade on the far side, a sheen arc on the lit side. */
const Cel: React.FC<{ d: string; cx: number; cy: number; rx: number; ry: number }> = ({ d, cx, cy, rx, ry }) => {
  const id = React.useId().replace(/:/g, "");
  return (
    <g stroke="none">
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <ellipse cx={cx + rx * 0.95} cy={cy} rx={rx * 0.55} ry={ry * 1.4} fill="#000" opacity={0.24} />
        <path d={`M ${cx - rx * 0.7} ${cy + ry * 0.35} Q ${cx - rx * 0.62} ${cy - ry * 0.6} ${cx - rx * 0.05} ${cy - ry * 0.78}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};
/** US M1 helmet: a round dome with a slight rim; a medic's has a white disc with a red cross on the front. */
/** Round wire spectacles (the rig's `glasses` draws dark sunglasses). */
export const Specs: React.FC<{ pose: Pose }> = ({ pose }) => (
  <OnHead pose={pose}>
    <g transform={`translate(${pose.yaw * 24} 0)`} fill="none" stroke={M.ink} strokeWidth={4}>
      <circle cx={-20} cy={HEAD.y - 6} r={15} />
      <circle cx={20} cy={HEAD.y - 6} r={15} />
      <path d={`M -5 ${HEAD.y - 8} L 5 ${HEAD.y - 8}`} />
    </g>
  </OnHead>
);
const M1 = `M -74 ${HEAD.y - 30} Q -70 ${HEAD.y - 108} 0 ${HEAD.y - 110} Q 70 ${HEAD.y - 108} 74 ${HEAD.y - 30} Q 0 ${HEAD.y - 44} -74 ${HEAD.y - 30} Z`;
export const M1Helmet: React.FC<{ pose: Pose; medic?: boolean; cel?: boolean }> = ({ pose, medic, cel = true }) => (
  <OnHead pose={pose}>
    <g stroke={M.ink} strokeWidth={4} strokeLinejoin="round">
      <path d={M1} fill="#5E5A3A" />
      {cel ? <Cel d={M1} cx={0} cy={HEAD.y - 72} rx={74} ry={40} /> : null}
      {medic ? (
        <g transform={`translate(${pose.yaw * 40} ${HEAD.y - 76})`}>
          <circle r={22} fill="#F4F1E8" strokeWidth={3} />
          <path d="M -5 -15 L 5 -15 L 5 -5 L 15 -5 L 15 5 L 5 5 L 5 15 L -5 15 L -5 5 L -15 5 L -15 -5 L -5 -5 Z" fill="#C7302C" stroke="none" />
        </g>
      ) : null}
    </g>
  </OnHead>
);
/** The medic's kit in torso space: a red-cross armband on the left sleeve top, a bag on the right hip. */
export const MedicKit: React.FC<{ pose: Pose }> = ({ pose }) => (
  <OnChest pose={pose}>
    <rect x={-58} y={-104} width={20} height={26} rx={3} fill="#F4F1E8" stroke={M.ink} strokeWidth={3} />
    <path d="M -50 -100 L -46 -100 L -46 -93 L -40 -93 L -40 -89 L -46 -89 L -46 -82 L -50 -82 L -50 -89 L -56 -89 L -56 -93 L -50 -93 Z" fill="#C7302C" />
    <path d="M -40 -112 L 52 -10" stroke="#4A4630" strokeWidth={8} />
    <g transform="translate(46 -6)">
      <rect x={-30} y={-24} width={60} height={50} rx={8} fill="#6A6440" stroke={M.ink} strokeWidth={4} />
      <circle cx={0} cy={0} r={13} fill="#F4F1E8" />
      <path d="M -3 -9 L 3 -9 L 3 -3 L 9 -3 L 9 3 L 3 3 L 3 9 L -3 9 L -3 3 L -9 3 L -9 -3 L -3 -3 Z" fill="#C7302C" />
    </g>
  </OnChest>
);
/** Medals in torso space: the Medal of Honor on its blue neck ribbon (a gold star), and `bronze` Bronze Stars on the chest. */
export const Medals: React.FC<{ pose: Pose; honor?: number; bronze?: number; glint?: number }> = ({ pose, honor = 0, bronze = 0, glint = 0 }) => (
  <OnChest pose={pose}>
    {Array.from({ length: bronze }, (_, i) => (
      <g key={i} transform={`translate(${-34 + i * 22} -80)`}>
        <rect x={-8} y={-18} width={16} height={12} fill="#C7302C" stroke={M.ink} strokeWidth={2} />
        <rect x={-3} y={-18} width={6} height={12} fill="#2F4A86" />
        <path d="M 0 -6 L 4 3 L 13 3 L 6 9 L 9 18 L 0 12 L -9 18 L -6 9 L -13 3 L -4 3 Z" fill="#B07A3A" stroke={M.ink} strokeWidth={2} />
      </g>
    ))}
    {honor > 0 ? (
      <g opacity={honor}>
        <path d="M -26 -118 L 0 -70 L 26 -118" stroke="#4A78C8" strokeWidth={12} fill="none" />
        <rect x={-14} y={-78} width={28} height={12} fill="#4A78C8" stroke={M.ink} strokeWidth={2} />
        <path d="M 0 -64 L 7 -48 L 24 -48 L 10 -38 L 15 -22 L 0 -32 L -15 -22 L -10 -38 L -24 -48 L -7 -48 Z" fill={M.gold} stroke={M.ink} strokeWidth={3} />
        {glint > 0 ? <Sparkle x={14} y={-56} k={glint} r={40} /> : null}
      </g>
    ) : null}
  </OnChest>
);
/** A canvas litter (stretcher) in world space, centred at (x, y), tilted `deg`; `rope` draws the rope bridle up to that point. */
export const Litter: React.FC<{ x: number; y: number; deg?: number; s?: number; rope?: [number, number] }> = ({ x, y, deg = 0, s = 1, rope }) => (
  <g>
    {rope ? <path d={`M ${x - 80 * s} ${y} L ${rope[0]} ${rope[1]} L ${x + 80 * s} ${y}`} stroke="#C9B48A" strokeWidth={5} fill="none" /> : null}
    <g transform={`translate(${x} ${y}) rotate(${deg}) scale(${s})`} stroke={M.ink} strokeLinejoin="round">
      <path d="M -130 -8 L 130 -8 M -130 18 L 130 18" strokeWidth={9} stroke="#5A4A3A" />
      <rect x={-104} y={-14} width={208} height={38} rx={4} fill="#9A9272" strokeWidth={4} />
    </g>
  </g>
);
/** Muzzle flashes along a ridge line (no figures drawn, E3): each flickers on its own seed, smoke rises. */
export const Gunfire: React.FC<{ t: number; points: [number, number][]; on?: boolean }> = ({ t, points, on = true }) => (
  <g>
    {points.map(([x, y], i) => {
      const k = on && Math.floor(t / 2 + i * 3) % 5 === 0;
      return (
        <g key={i}>
          <circle cx={x + Math.sin(t / 20 + i) * 10} cy={y - 40 - ((t * 0.8 + i * 30) % 120)} r={30 + i * 3} fill="#8A8A90" opacity={0.25} />
          {k ? <path d={`M ${x} ${y - 22} L ${x + 10} ${y - 6} L ${x + 26} ${y} L ${x + 10} ${y + 6} L ${x} ${y + 22} L ${x - 10} ${y + 6} L ${x - 26} ${y} L ${x - 10} ${y - 6} Z`} fill="#FFD66A" stroke="#F2A23A" strokeWidth={3} /> : null}
        </g>
      );
    })}
  </g>
);
/** A cargo net hanging down a cliff face from (x, y0) to y1. */
export const CargoNet: React.FC<{ x: number; y0: number; y1: number; w?: number }> = ({ x, y0, y1, w = 160 }) => (
  <g stroke="#C9B48A" strokeWidth={4} opacity={0.9}>
    {Array.from({ length: 5 }, (_, i) => <path key={`v${i}`} d={`M ${x - w / 2 + (i * w) / 4} ${y0} L ${x - w / 2 + (i * w) / 4 + (i - 2) * 6} ${y1}`} />)}
    {Array.from({ length: Math.floor((y1 - y0) / 50) }, (_, i) => <path key={`h${i}`} d={`M ${x - w / 2} ${y0 + 25 + i * 50} L ${x + w / 2} ${y0 + 25 + i * 50}`} />)}
  </g>
);
/** A height mark painted beside the cliff: a tape with ticks that draws up (k 0→1), then its label. */
export const HeightMark: React.FC<{ x: number; y0: number; y1: number; label: string; k?: number }> = ({ x, y0, y1, label, k = 1 }) => {
  const top = y1 - (y1 - y0) * k;
  const step = (y1 - y0) / 8;
  return (
    <g>
      <path d={`M ${x} ${y1} L ${x} ${top}`} stroke={M.paper} strokeWidth={8} />
      {Array.from({ length: 9 }, (_, i) => (y1 - i * step >= top ? <path key={i} d={`M ${x - 18} ${y1 - i * step} L ${x + 18} ${y1 - i * step}`} stroke={M.paper} strokeWidth={6} /> : null))}
      <g opacity={k >= 1 ? 1 : 0}>
        <rect x={x - 120} y={y0 - 90} width={240} height={76} rx={10} fill={M.paper} stroke={M.ink} strokeWidth={5} />
        <text x={x} y={y0 - 36} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={54} fill={M.ink}>
          {label}
        </text>
      </g>
    </g>
  );
};

/** World position of a hand (props held in it follow the arm). */
export const handAt = (p: Pose, side: "L" | "R") => {
  const e = joints(p)[side === "L" ? "armL" : "armR"].end;
  // every style M look is chunky (look() above), so the hands hang armShift further out than joints() says
  return toWorld(p, { x: e.x + (side === "L" ? -1 : 1) * armShift({ body: "chunky" } as Look, p.yaw), y: e.y });
};

/** British "Brodie" helmet: a shallow dome on a wide flat brim. */
const BRODIE = `M -58 ${HEAD.y - 42} Q -56 ${HEAD.y - 98} 0 ${HEAD.y - 100} Q 56 ${HEAD.y - 98} 58 ${HEAD.y - 42} Z`;
export const Brodie: React.FC<{ pose: Pose; cel?: boolean }> = ({ pose, cel = true }) => (
  <OnHead pose={pose}>
    <g stroke={M.ink} strokeWidth={4} strokeLinejoin="round">
      <ellipse cx={0} cy={HEAD.y - 40} rx={96} ry={18} fill="#6A6145" />
      {cel ? <ellipse cx={0} cy={HEAD.y - 34} rx={90} ry={9} fill="#000" opacity={0.22} stroke="none" /> : null}
      <path d={BRODIE} fill="#7A7050" />
      {cel ? <Cel d={BRODIE} cx={0} cy={HEAD.y - 70} rx={58} ry={30} /> : null}
    </g>
  </OnHead>
);
/** German steel helmet: a deep dome with a flared skirt over the ears. Plain: no decals. */
const STAHL = `M -76 ${HEAD.y + 6} L -66 ${HEAD.y - 30} Q -64 ${HEAD.y - 104} 0 ${HEAD.y - 106} Q 64 ${HEAD.y - 104} 66 ${HEAD.y - 30} L 76 ${HEAD.y + 6} L 56 ${HEAD.y - 8} L -56 ${HEAD.y - 8} Z`;
export const Stahl: React.FC<{ pose: Pose; cel?: boolean }> = ({ pose, cel = true }) => (
  <OnHead pose={pose}>
    <path d={STAHL} fill="#4E5548" stroke={M.ink} strokeWidth={4} strokeLinejoin="round" />
    {cel ? <Cel d={STAHL} cx={0} cy={HEAD.y - 60} rx={70} ry={46} /> : null}
  </OnHead>
);

/** Basket-hilted broadsword in world space: hilt at (x, y), blade pointing `deg` (0 = up, 90 = right). */
export const Sword: React.FC<{ x: number; y: number; deg: number; s?: number; glint?: number }> = ({ x, y, deg, s = 1, glint = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${deg}) scale(${s})`}>
    <path d="M -7 -18 L -6 -190 L 0 -206 L 6 -190 L 7 -18 Z" fill="#D9DEE2" stroke={M.ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 0 -30 L 0 -180" stroke="#AEB6BC" strokeWidth={3} />
    <path d="M -24 -14 Q -30 14 0 22 Q 30 14 24 -14 Q 0 -24 -24 -14 Z" fill="#B8A26A" stroke={M.ink} strokeWidth={4} />
    <path d="M -16 -8 L 16 10 M 16 -8 L -16 10" stroke="#8C7848" strokeWidth={3} />
    <rect x={-6} y={18} width={12} height={34} rx={4} fill="#3A2826" stroke={M.ink} strokeWidth={3} />
    {glint > 0 ? <Sparkle x={0} y={-150} k={glint} /> : null}
  </g>
);
/** Scabbard on the left hip (torso space); with the sword's hilt in it unless `empty`. */
export const Scabbard: React.FC<{ pose: Pose; empty?: boolean }> = ({ pose, empty }) => (
  <OnChest pose={pose}>
    <g transform="translate(-44 -6) rotate(24)">
      <rect x={-8} y={0} width={16} height={150} rx={6} fill="#3A2826" stroke={M.ink} strokeWidth={4} />
      {empty ? <ellipse cx={0} cy={2} rx={12} ry={5} fill="#1B1A1F" /> : <Sword x={0} y={-4} deg={180} s={0.8} />}
    </g>
  </OnChest>
);
/** Longbow slung across the back: drawn BEFORE the body so the figure covers its middle. */
export const BowOnBack: React.FC<{ pose: Pose }> = ({ pose }) => (
  <OnChest pose={pose}>
    <path d="M -96 -330 Q 50 -170 74 60" stroke={M.ink} strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M -96 -330 Q 50 -170 74 60" stroke="#A0703F" strokeWidth={13} fill="none" strokeLinecap="round" />
    <path d="M -96 -330 L 74 60" stroke="#EDE6D6" strokeWidth={3} />
  </OnChest>
);
/** Longbow held upright at (x, y), string pulled back `pull` px toward the screen-left (an arrow on it if pulled). */
export const Bow: React.FC<{ x: number; y: number; s?: number; pull?: number; arrow?: boolean }> = ({ x, y, s = 1, pull = 0, arrow = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M 0 -200 L ${-pull} 0 L 0 200`} stroke="#EDE6D6" strokeWidth={3} fill="none" />
    <path d="M 0 -200 Q 46 0 0 200" stroke={M.ink} strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M 0 -200 Q 46 0 0 200" stroke="#8B6240" strokeWidth={9} fill="none" strokeLinecap="round" />
    {arrow && pull > 0 ? <Arrow x={-pull} y={0} deg={90} /> : null}
  </g>
);
/** An arrow, nock at (x, y), pointing `deg` (90 = right). */
export const Arrow: React.FC<{ x: number; y: number; deg: number; s?: number }> = ({ x, y, deg, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${deg}) scale(${s})`}>
    <path d="M 0 0 L 0 -150" stroke={M.ink} strokeWidth={7} />
    <path d="M 0 0 L 0 -150" stroke="#C9B48A" strokeWidth={3.5} />
    <path d="M -9 -146 L 0 -168 L 9 -146 Z" fill="#9AA3AA" stroke={M.ink} strokeWidth={3} />
    <path d="M 0 -4 L -10 10 M 0 -4 L 10 10 M 0 -14 L -10 0 M 0 -14 L 10 0" stroke={M.accent} strokeWidth={4} />
  </g>
);
/** Archery target on a stand. */
export const Target: React.FC<{ x: number; y: number; s?: number; shake?: number }> = ({ x, y, s = 1, shake = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${shake}) scale(${s})`}>
    <path d="M -50 60 L -70 200 M 50 60 L 70 200" stroke="#5B4038" strokeWidth={12} strokeLinecap="round" />
    {[100, 78, 56, 34, 14].map((r, i) => <circle key={r} r={r} fill={["#EDE6D6", "#1B1A1F", "#4A7AB0", M.accent, M.gold][i]} stroke={M.ink} strokeWidth={4} />)}
  </g>
);
/**
 * Bagpipes in torso space: the bag under the left arm, three drones over the left shoulder, the chanter down the
 * front. `squeeze` 0..1 breathes the bag. Pose the arms with PIPE_ARMS so the hands sit on the chanter.
 */
export const Pipes: React.FC<{ pose: Pose; squeeze?: number; carry?: boolean }> = ({ pose, squeeze = 0, carry }) => (
  <OnChest pose={pose}>
    <g stroke={M.ink} strokeLinecap="round">
      {[[-150, -236], [-130, -252], [-108, -246]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M -40 -86 L ${x} ${y}`} strokeWidth={14} />
          <path d={`M -40 -86 L ${x} ${y}`} stroke="#2E2420" strokeWidth={8} />
          <rect x={x - 9} y={y - 14} width={18} height={14} rx={3} fill="#D9D5CC" strokeWidth={3} />
        </g>
      ))}
      <ellipse cx={-34} cy={-74} rx={46 - squeeze * 4} ry={34 + squeeze * 3} fill="#2F5A46" strokeWidth={5} />
      <path d={`M -70 -88 L 2 -60 M -66 -64 L 0 -40 M -50 -104 L -4 -84`} stroke={M.accent} strokeWidth={4} />
      {/* the chanter: in the mouth when playing, hanging from the bag when carried */}
      <path d={carry ? "M -20 -50 L -6 40" : "M -6 -150 L 4 -8"} strokeWidth={12} />
      <path d={carry ? "M -20 -50 L -6 40" : "M -6 -150 L 4 -8"} stroke="#2E2420" strokeWidth={7} />
    </g>
  </OnChest>
);
/** Arms on the chanter (both hands meet in front of the chest). */
export const PIPE_ARMS: Partial<Pose> = { armL: { a: -18, b: -96 }, armR: { a: 22, b: -118 } };
/** Arms up: a prisoner. */
export const HANDS_UP: Partial<Pose> = { armL: { a: 124, b: 40 }, armR: { a: 124, b: 40 } }; // elbows out: straight up hid behind the helmet
/** Rifle in world space: butt at (x, y), barrel pointing `deg` (0 = up). */
export const Rifle: React.FC<{ x: number; y: number; deg?: number; s?: number; wood?: string }> = ({ x, y, deg = 0, s = 1, wood = "#6D5649" }) => (
  <g transform={`translate(${x} ${y}) rotate(${deg}) scale(${s})`} stroke={M.ink} strokeLinejoin="round">
    <path d="M -10 0 L 10 0 L 8 -70 L 4 -100 L -4 -100 L -8 -70 Z" fill={wood} strokeWidth={4} />
    <path d="M -3 -100 L -3 -230 L 3 -230 L 3 -100 Z" fill="#2B2B30" strokeWidth={3} />
  </g>
);

// ---------- vehicles

/** A 1940 army lorry, side view, facing right; `x` is the cab's front. Wheels turn with x. */
export const Lorry: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={M.ink} strokeWidth={6} strokeLinejoin="round">
    <path d="M -560 -220 Q -560 -300 -460 -300 L -200 -300 Q -170 -300 -170 -260 L -170 -60 L -560 -60 Z" fill="#7A7050" />
    <path d="M -170 -220 L -60 -220 L -10 -140 L 0 -60 L -170 -60 Z" fill="#6A6145" />
    <path d="M -150 -200 L -72 -200 L -38 -146 L -150 -146 Z" fill="#9DB4C6" />
    <rect x={-580} y={-70} width={590} height={30} fill="#3A3A34" />
    {[-460, -80].map((cx) => (
      <g key={cx} transform={`translate(${cx} -30) rotate(${(-x / 60 / s) * 57})`}>
        <circle r={56} fill="#22201F" />
        <circle r={22} fill="#8A8580" />
        <path d="M -22 0 L 22 0" stroke="#5A5650" strokeWidth={5} />
      </g>
    ))}
  </g>
);
/** Landing craft, side view, bow to the right; `ramp` 0 closed … 1 down on the sand. */
export const LandingCraft: React.FC<{ x: number; y: number; s?: number; ramp?: number }> = ({ x, y, s = 1, ramp = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={M.ink} strokeWidth={6} strokeLinejoin="round">
    <path d="M -420 -150 L 120 -150 L 140 0 L -400 0 Z" fill="#5E6865" />
    <path d="M -420 -150 L 120 -150 L 120 -120 L -420 -120 Z" fill="#4C5552" />
    <g transform={`translate(130 -150) rotate(${ramp * 62})`}>
      <rect x={-10} y={0} width={24} height={170} fill="#6E7875" />
    </g>
  </g>
);

// ---------- outdoor sets: drawn in code (sets.tsx); a picture in public/ still wins (only m-churchill has them)

export type OutsideKind = SetKind;
export { HORIZON };
/** Per set: [scale, top y, colour below the picture]. Measured on Lucas's pictures (2026-11-04, storyboard). */
const FIT: Record<OutsideKind, [number, number, string]> = {
  field: [1, 0, "#6B7A44"],
  road: [1, 0, "#6B7A44"],
  fjord: [1.25, -620, "#2E3A44"],
  town: [1.15, -300, "#6E5A44"],
  alley: [1.15, -300, "#4A3A30"],
  hill: [1.2, -380, "#3E4A36"],
  fence: [1, 0, "#1E2A3A"],
  // m-doss: the prompts ask for the ground in the lower third, like the Brač picture
  jungle: [1.2, -380, "#3E4A2E"],
  ridge: [1.2, -380, "#5A5444"],
  cliff: [1.2, -380, "#4A4438"],
  night: [1.2, -380, "#1E2430"],
};
/** A snow bank in front of the water (Norway): where the boat lands and he walks ashore. */
export const SnowBank: React.FC<{ y: number; x0?: number }> = ({ y, x0 = -400 }) => (
  <g>
    <path d={`M ${x0} ${y + 20} Q ${x0 + 160} ${y - 30} ${x0 + 420} ${y - 10} Q 900 ${y - 40} 1480 ${y} L 1480 2400 L ${x0} 2400 Z`} fill="#D9E0E4" stroke={M.ink} strokeWidth={6} />
    <path d={`M ${x0} ${y + 120} Q 500 ${y + 60} 1480 ${y + 140} L 1480 2400 L ${x0} 2400 Z`} fill="#C7D0D6" />
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={x0 + 80 + ((i * 263) % 1100)} cy={y + 50 + (i % 3) * 120} rx={46 - (i % 2) * 14} ry={20} fill="#6A6E72" stroke={M.ink} strokeWidth={4} />
    ))}
  </g>
);
const has = (file: string) => getStaticFiles().some((f) => f.name === file);

export const Outside: React.FC<{ kind: OutsideKind; id: string; t: number; img?: string }> = ({ kind, id, t, img }) => {
  if (img && has(img)) {
    // the AI pictures put their ground lower than the rig's floor line: lift (and enlarge) them per kind so people stand on it
    const [k, dy, under] = FIT[kind];
    return (
      <Defocus id={id}>
        <rect x={-400} y={1700} width={1880} height={800} fill={under} />
        <image href={staticFile(img)} x={540 - 540 * k} y={dy} width={1080 * k} height={1920 * k} preserveAspectRatio="xMidYMid slice" />
      </Defocus>
    );
  }
  return (
    <Defocus id={id}>
      <CodeSet kind={kind} id={id} t={t} />
    </Defocus>
  );
};

/** Rocks to hide fallen men behind (no injuries shown). */
export const Rocks: React.FC<{ x: number; y: number; s?: number; seed?: number }> = ({ x, y, s = 1, seed = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${-160 + i * 110} 0 Q ${-150 + i * 110} ${-90 - rnd(seed, i) * 50} ${-90 + i * 110} ${-110 - rnd(seed, i + 3) * 30} Q ${-20 + i * 110} ${-80} ${-10 + i * 110} 0 Z`} fill={["#6A6658", "#5A5648", "#74705E"][i]} stroke={M.ink} strokeWidth={5} />
    ))}
  </g>
);
/** A white flash (shell, grenade) that pops at `at` and fades; returns null outside. */
export const Flash: React.FC<{ t: number; at: number; x: number; y: number; r?: number }> = ({ t, at, x, y, r = 700 }) => {
  const k = interpolate(t, [at, at + 2, at + 14], [0, 1, 0], CLAMP);
  return k > 0 ? (
    <g opacity={k}>
      <circle cx={x} cy={y} r={r * (0.6 + 0.4 * k)} fill="#FFF6DC" opacity={0.7} />
      <circle cx={x} cy={y} r={r * 0.35} fill="#FFFFFF" />
    </g>
  ) : null;
};
/** Music notes rising from a point (shapes, not text). */
export const Notes: React.FC<{ t: number; x: number; y: number; n?: number }> = ({ t, x, y, n = 4 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = ((t + i * 14) % 56) / 56;
      return (
        <g key={i} transform={`translate(${x + Math.sin(k * 6 + i) * 30 + k * 90} ${y - k * 180})`} opacity={k < 0.15 ? k / 0.15 : 1 - k}>
          <ellipse cx={0} cy={0} rx={14} ry={10} fill={M.paper} stroke={M.ink} strokeWidth={3} transform="rotate(-20)" />
          <path d="M 12 -4 L 12 -48 Q 26 -40 30 -28" stroke={M.paper} strokeWidth={5} fill="none" />
        </g>
      );
    })}
  </g>
);

/** A four-point sparkle (a blade catching the light). */
export const Sparkle: React.FC<{ x: number; y: number; k: number; r?: number }> = ({ x, y, k, r = 46 }) => {
  const s = Math.sin(Math.min(1, k) * Math.PI);
  return s > 0.01 ? (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${k * 40})`}>
      <path d={`M 0 ${-r} Q 6 -6 ${r} 0 Q 6 6 0 ${r} Q -6 6 ${-r} 0 Q -6 -6 0 ${-r} Z`} fill="#FFF8E0" stroke={M.gold} strokeWidth={3} />
    </g>
  ) : null;
};
/** Mortar shell burst on the ground: a jagged orange flash, dirt thrown up, then smoke that rolls out. */
export const Burst: React.FC<{ t: number; at: number; x: number; y: number; s?: number }> = ({ t, at, x, y, s = 1 }) => {
  const k = t - at;
  if (k < 0 || k > 70) return null;
  const flash = interpolate(k, [0, 2, 10], [0.4, 1.15, 0], CLAMP);
  const smoke = interpolate(k, [2, 70], [0.3, 1.4], CLAMP);
  const so = interpolate(k, [2, 10, 70], [0, 0.85, 0], CLAMP);
  const spikes = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    const r = i % 2 ? 90 : 200 + rnd(31, i) * 80;
    return `${Math.cos(a) * r},${Math.sin(a) * r * 0.8}`;
  }).join(" ");
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={(i - 1.5) * 90 * smoke} cy={-120 * smoke - i * 20} r={110 * smoke} fill="#55565C" opacity={so} />)}
      {Array.from({ length: 14 }, (_, i) => {
        const a = -Math.PI * (0.1 + 0.8 * rnd(41, i));
        const v = 14 + rnd(43, i) * 16;
        return <circle key={i} cx={Math.cos(a) * v * k} cy={Math.sin(a) * v * k + 0.9 * k * k} r={8 + rnd(47, i) * 8} fill="#5A4234" opacity={k < 24 ? 1 : 0} />;
      })}
      {flash > 0 ? (
        <g transform={`scale(${flash})`}>
          <polygon points={spikes} fill="#F2A23A" stroke={M.ink} strokeWidth={5} />
          <circle r={80} fill="#FFE9A8" />
        </g>
      ) : null}
    </g>
  );
};
/** The grenade: the whole frame goes white, then fades into black (knocked out). Full-frame, draw last. */
export const WhiteOut: React.FC<{ t: number; at: number; black: number }> = ({ t, at, black }) => {
  if (t < at) return null;
  const white = interpolate(t, [at, at + 2, black], [0.6, 1, 1], CLAMP);
  const dark = interpolate(t, [black, black + 4], [0, 1], CLAMP);
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#FFFDF4" opacity={white} />
      <rect x={0} y={0} width={1080} height={1920} fill="#050507" opacity={dark} />
    </g>
  );
};

// ---------- N7 (claude-animated-shorts): small 2D effects composited over the scene

/** Speed lines behind a moving figure (x, y = the figure's middle), pointing away from `dir`. */
export const SpeedLines: React.FC<{ x: number; y: number; dir: 1 | -1; t: number; s?: number }> = ({ x, y, dir, t, s = 1 }) => (
  <g stroke="#F4F1E8" strokeLinecap="round" opacity={0.7}>
    {[0, 1, 2, 3, 4].map((i) => {
      const k = ((t * 0.9 + i * 7) % 10) / 10;
      const len = (90 + i * 20) * s * (1 - k * 0.5);
      const yy = y + (i - 2) * 50 * s;
      return <path key={i} d={`M ${x - dir * (60 + k * 60) * s} ${yy} l ${-dir * len} 0`} strokeWidth={6 * s} opacity={1 - k} />;
    })}
  </g>
);
/** A dust puff where something hits the ground at frame `at` (x, y = the ground point). */
export const DustPuff: React.FC<{ t: number; at: number; x: number; y: number; s?: number; color?: string }> = ({ t, at, x, y, s = 1, color = "#B8AC94" }) => {
  const k = (t - at) / 22;
  if (k < 0 || k > 1) return null;
  return (
    <g opacity={1 - k}>
      {[-2, -1, 0, 1, 2].map((i) => (
        <circle key={i} cx={x + i * (30 + k * 70) * s} cy={y - (10 + k * 40 - Math.abs(i) * 6) * s} r={(18 + k * 30) * s} fill={color} stroke={M.ink} strokeWidth={3} />
      ))}
    </g>
  );
};
/** Water splashing up at frame `at` (x, y = the water line). */
export const Splash: React.FC<{ t: number; at: number; x: number; y: number; s?: number }> = ({ t, at, x, y, s = 1 }) => {
  const k = (t - at) / 18;
  if (k < 0 || k > 1) return null;
  return (
    <g opacity={1 - k} fill="#DDEBF2" stroke={M.ink} strokeWidth={3}>
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
        const h = (60 + (3 - Math.abs(i)) * 30) * s * Math.sin(k * Math.PI);
        return <ellipse key={i} cx={x + i * 34 * s * (1 + k)} cy={y - h} rx={10 * s} ry={16 * s} />;
      })}
    </g>
  );
};
