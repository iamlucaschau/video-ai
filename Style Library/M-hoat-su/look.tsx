/**
 * Style M "Hoạt Sử" shot look (claude-animated-shorts N1–N4, N8, N14; Lucas approved 2026-11-04). The video's Picture
 * wraps each shot in <ShotLook> with the shot's size and light; the kit reads it:
 * - N1 depth of field: `Office` (its walls) and `Outside` blur when the shot is a close / medium one (reference: blur on
 *   about a third of screen time, 10–16 px at 1080 on close-ups, 7–12 on medium shots, wide shots sharp).
 * - N2 foreground: a blurred near object at a frame edge on the shots that ask for it (reference: ~20 % of frames).
 * - N3 grade: one colour treatment per light for the whole picture (reference: lifted, warm darks; vivid lit colour).
 * - N4 scene light on people: a tint per light, a shadow tail away from the sun by day.
 * - N8 textures: SVG patterns for plaster, boards, grass, mud and rock that the sets lay over their flat fills.
 * - N14 transitions: a 6–8 f crossfade where the place changes, a 4 f white flash after the hook.
 */
import React from "react";
import { rnd } from "../toon-engine/anim";
import { LEG_LEN, type Pose } from "../toon-engine/rig";

export type SceneLight = "indoor" | "day" | "golden" | "night";
export type ShotLookValue = { dof: number; light: SceneLight };
const Ctx = React.createContext<ShotLookValue>({ dof: 0, light: "indoor" });
export const useShotLook = () => React.useContext(Ctx);

/** Blur in world units for a shot size from shots.json ("rộng", "vừa", "cận", "cận ngực", …), at the size's usual zoom. */
export const dofFor = (size: string) => (size.startsWith("cận ngực") ? 13 / 2.4 : size.startsWith("cận") ? 13 / 2.0 : size.startsWith("vừa") ? 8 / 1.4 : 0);

export const ShotLook: React.FC<{ value: ShotLookValue; children: React.ReactNode }> = ({ value, children }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;

/** Wrap a background layer: blurred when the shot has depth of field (N1). */
export const Defocus: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { dof } = useShotLook();
  if (dof <= 0) return <>{children}</>;
  return (
    <g>
      <defs>
        <filter id={`${id}-dof`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={dof} />
        </filter>
      </defs>
      <g filter={`url(#${id}-dof)`}>{children}</g>
    </g>
  );
};

/** N3: whole-picture grade per light (CSS filter on the picture's svg) + a soft-light colour wash drawn on top. */
export const GRADE: Record<SceneLight, { css: string; wash: string; o: number }> = {
  indoor: { css: "brightness(1.14) saturate(1.28) contrast(1.03)", wash: "#FFD9A0", o: 0.12 },
  day: { css: "brightness(1.08) saturate(1.32) contrast(1.04)", wash: "#FFF2DA", o: 0.1 },
  golden: { css: "brightness(1.08) saturate(1.34) contrast(1.03)", wash: "#FF9E5E", o: 0.2 },
  night: { css: "brightness(1.18) saturate(1.2) contrast(1.04)", wash: "#4E62C8", o: 0.16 }, // faces must not go lavender (reference trap)
};
export const GradeWash: React.FC<{ light: SceneLight }> = ({ light }) => (
  <rect x={0} y={0} width={1080} height={1920} fill={GRADE[light].wash} opacity={GRADE[light].o} style={{ mixBlendMode: "soft-light" }} />
);

/** N4: filters that tint people by the scene light (ids used by <Lit>); put once in the picture's svg. */
export const LookDefs: React.FC = () => (
  <defs>
    <filter id="lit-golden" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="1.03 0 0 0 0.01  0 0.98 0 0 0  0 0 0.92 0 0  0 0 0 1 0" />
    </filter>
    <filter id="lit-night" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0.88 0 0 0 0  0 0.91 0 0 0  0 0 0.98 0 0.02  0 0 0 1 0" />
    </filter>
    <filter id="lit-day" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="1.02 0 0 0 0  0 1.01 0 0 0  0 0 0.98 0 0  0 0 0 1 0" />
    </filter>
    {/* N8 textures */}
    <pattern id="tex-plaster" width={90} height={90} patternUnits="userSpaceOnUse">
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={rnd(81, i) * 90} cy={rnd(83, i) * 90} r={1.5 + rnd(85, i) * 3} fill="#000" opacity={0.18} />)}
      <path d="M 10 70 q 20 -6 34 2 M 52 24 q 16 -4 28 4" stroke="#000" strokeWidth={2} fill="none" opacity={0.1} />
    </pattern>
    <pattern id="tex-grass" width={70} height={50} patternUnits="userSpaceOnUse">
      <path d="M 8 46 q 3 -14 8 -20 M 16 46 q 0 -16 2 -24 M 24 46 q -3 -12 -8 -18 M 44 30 q 3 -12 7 -16 M 50 30 q 0 -12 2 -18" stroke="#2E4A20" strokeWidth={3} fill="none" opacity={0.35} strokeLinecap="round" />
    </pattern>
    <pattern id="tex-mud" width={80} height={60} patternUnits="userSpaceOnUse">
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={rnd(87, i) * 80} cy={rnd(89, i) * 60} rx={3 + rnd(91, i) * 7} ry={2 + rnd(93, i) * 3} fill="#000" opacity={0.18} />)}
    </pattern>
    <pattern id="tex-rock" width={120} height={80} patternUnits="userSpaceOnUse">
      <path d="M 0 30 L 40 26 L 70 34 L 120 28 M 20 60 L 60 56 L 100 64" stroke="#000" strokeWidth={2.5} fill="none" opacity={0.16} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={rnd(95, i) * 120} cy={rnd(97, i) * 80} r={2 + rnd(99, i) * 2} fill="#000" opacity={0.15} />)}
    </pattern>
    <pattern id="tex-boards" width={160} height={40} patternUnits="userSpaceOnUse">
      <path d="M 0 39 L 160 39 M 70 0 L 70 39" stroke="#000" strokeWidth={3} opacity={0.22} />
      <ellipse cx={30} cy={20} rx={7} ry={3} fill="none" stroke="#000" strokeWidth={2} opacity={0.15} />
      <path d="M 90 12 q 30 4 60 0" stroke="#000" strokeWidth={1.5} fill="none" opacity={0.12} />
    </pattern>
  </defs>
);

/** N4: a person in the scene light (tint) with a sun-side shadow tail by day / at golden hour. Wrap the Hero + gear. */
export const Lit: React.FC<{ pose: Pose; children: React.ReactNode }> = ({ pose, children }) => {
  const { light } = useShotLook();
  const feet = pose.y + LEG_LEN * pose.scale + 10;
  const tail = light === "day" || light === "golden" ? (
    <ellipse
      cx={pose.x + (light === "golden" ? -60 : 60) * pose.scale}
      cy={feet + 4 * pose.scale}
      rx={(light === "golden" ? 170 : 110) * pose.scale}
      ry={14 * pose.scale}
      fill="#2A2440"
      opacity={0.22}
      transform={`rotate(${light === "golden" ? 6 : -4} ${pose.x} ${feet})`}
    />
  ) : null;
  return (
    <>
      {pose.spin === 0 ? tail : null}
      <g filter={light === "indoor" ? undefined : `url(#lit-${light})`}>{children}</g>
    </>
  );
};

/** N2: a blurred near object at a frame edge, in screen space (draw it after the shot, before the subtitles). */
export type FgKind = "leaves" | "wire" | "rock" | "wall";
export const Foreground: React.FC<{ kind: FgKind; side?: "left" | "right"; t: number; id: string }> = ({ kind, side = "left", t, id }) => {
  const flip = side === "right" ? "translate(1080 0) scale(-1 1)" : "";
  const drift = Math.sin(t / 30) * 6;
  return (
    <g transform={flip}>
      <defs>
        <filter id={`${id}-fg`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
      </defs>
      <g filter={`url(#${id}-fg)`} transform={`translate(${drift} 0)`}>
        {kind === "leaves"
          ? [0, 1, 2, 3].map((k) => <path key={k} d={`M -60 ${1500 + k * 90} Q ${120 + k * 30} ${1360 + k * 60} ${260 + k * 10} ${1430 + k * 110} Q ${110 + k * 30} ${1480 + k * 80} -60 ${1500 + k * 90} Z`} fill={k % 2 ? "#26381C" : "#2E4422"} />)
          : null}
        {kind === "wire" ? (
          <g stroke="#1A1A1E" strokeWidth={10} fill="none">
            <path d="M -40 300 L 1120 420" />
            <path d="M 200 330 l 30 -30 M 215 300 l 0 46 M 600 372 l 30 -30 M 615 342 l 0 46" strokeWidth={8} />
          </g>
        ) : null}
        {kind === "rock" ? <path d="M -60 1920 L -60 1380 Q 80 1300 190 1420 Q 280 1520 300 1920 Z" fill="#2C2A26" /> : null}
        {kind === "wall" ? <path d="M -60 -60 L 150 -60 L 120 1980 L -60 1980 Z" fill="#1E1A1C" /> : null}
      </g>
    </g>
  );
};

/** N14: white flash after the hook (4 f) and crossfade frames where the place changes. */
export const flashAlpha = (t: number) => (t < 0 || t > 4 ? 0 : [0.9, 0.7, 0.45, 0.2, 0][t]);
