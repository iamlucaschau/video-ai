/**
 * Style M "Hoạt Sử" kit (2026-11-03, Lucas approved D1–D9, Test/Squire Explains/BAO-CAO.md): 2D animated history
 * shorts about one person who broke the rules of their time. Characters, rooms and light come from
 * ../toon-engine (MIT); this file adds the period costumes, the props and the text the style allows.
 * Contract: studio/KIT-CONTRACT.md. Everything draws in a 1080×1920 SVG world (viewBox), inside the safe zone.
 */
import { loadFont as loadMali } from "@remotion/google-fonts/Mali";
import { evolvePath } from "@remotion/paths";
import React from "react";
import { AbsoluteFill } from "remotion";
import { CANVAS, CLAMP, FONT, SAFE, SUB_BOTTOM, pop, prog } from "../kit-common";
import type { SubSkin } from "../subs";
import { interpolate } from "remotion";
import { rnd } from "../toon-engine/anim";
import { BackWindow, FloorShadow, Pendant, RoomShell, WallFrame } from "../toon-engine/furnish";
import { Dust, Glow, LightVeil } from "../toon-engine/light";
import { HEAD, LEG_LEN, type Look, LOOKS, type Pose, turnWidth } from "../toon-engine/rig";
import { Box, makeRoom, type Room } from "../toon-engine/room";
import { Defocus } from "./look";

/** Roles (source palette, Squire Explains k-means): dark room, khaki / wood, paper, sky, the red accent. */
export const M = {
  bg: "#16121C", // night room around the lamp light
  ink: "#1B1A1F", // the thick outline of every shape, the subtitle stroke
  paper: "#EADBB8", // maps, signs, documents
  wood: "#6D5649",
  khaki: "#938161",
  sky: "#809DB6",
  accent: "#C74B46", // arrows, rings, crosses, the one red on a map
  gold: "#E7B651", // a medal's glint, a number that matters
  swatches: ["#16121C", "#1B1A1F", "#EADBB8", "#6D5649", "#938161", "#809DB6", "#C74B46", "#E7B651"],
} as const;

/** D7 (Lucas 2026-11-03): one bold handwritten face, only on things inside the scene (signs, maps, notebooks), ≥ 48 px, ≤ 4 words. */
export const HAND = loadMali("normal", { weights: ["700"], subsets: ["latin", "latin-ext", "vietnamese"] }).fontFamily;

/** Full-bleed base: frame 0 is never black (thumbnail fallback). */
export const Base: React.FC = () => <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, #5A4652 0%, #2A2230 70%)` }} />;

/** Keyword or number chip (≤ 5 words, ≥ 56 px). Rare in this style: numbers live on things in the scene (T19). */
export const Chip: React.FC<{ text: string; f: number; at: number; y: number; x?: number }> = ({ text, f, at, y, x = (SAFE.left + CANVAS.width - SAFE.right) / 2 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: pop(f, at), opacity: prog(f, at, 4), padding: "14px 32px", borderRadius: 14, background: M.ink, color: M.paper, fontFamily: FONT, fontWeight: 800, fontSize: 72, whiteSpace: "nowrap" }}>
    {text}
  </div>
);

/** Subtitles like the reference: 1–3 words, CAPS, white with a thick black outline, one line, the whole chunk at once. */
export const HoatSuSub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM + 40, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 68, lineHeight: 1.1, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {ln.map((w, k) => (
            <span key={k} style={{ color: "#FFFFFF", WebkitTextStroke: `12px ${M.ink}`, paintOrder: "stroke fill" }}>
              {k ? " " : ""}
              {w.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ---------- the cast: period costumes on the toon-engine rig

/** Plum ink for people (claude-animated-shorts N9: reference character ink #201628-#2f1d28), the world keeps M.ink. */
export const PLUM = "#241726";
const look = (jacket: string, shade: string, tie: string, extra: Look["extra"] = "suit", skin = "#FBF8F2"): Look => ({
  ...LOOKS.suit,
  skin,
  hand: skin,
  jacket,
  jacketShade: shade,
  accent: tie,
  limb: shade,
  extra,
  line: PLUM,
  face: PLUM,
  head: "bean",
  body: "chunky", skinShade: "#DCD6CE", shoe: "#3E2E26", // Lucas 2026-11-04: "Duyệt, áp dụng" (thân dày, đổ bóng khối)
});
/** Cast of the test (WWII): the spy in a brown suit, a British officer in khaki, a German officer in field grey. */
export const CAST = {
  spy: look("#6B4E3A", "#553D2D", "#2F4A66"),
  brit: look("#8A7A4E", "#6F6240", "#5A4A2E"),
  ger: look("#6E746A", "#585D55", "#2B2E2A"),
  ghost: { ...look("#4A4656", "#3C3946", "#4A4656"), skin: "#8E8A9C", hand: "#8E8A9C", face: "#3C3946", line: "#2B2833" },
} satisfies Record<string, Look>;

/** Children drawn in the rig's head space (head centre at 0, HEAD.y; radius HEAD.r), so hats and moustaches follow the pose. */
/** The rig's squash about the feet (Hero does the same), so hats and chest pieces stay on a crouching body (m-doss storyboard: helmets floated). */
const squashT = (p: Pose) => `translate(0 ${LEG_LEN}) scale(${1 + 0.6 * p.squash} ${1 - p.squash}) translate(0 ${-LEG_LEN})`;
export const OnHead: React.FC<{ pose: Pose; children: React.ReactNode }> = ({ pose, children }) => (
  <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.spin} 0 -90) ${squashT(pose)} rotate(${pose.tilt}) rotate(${pose.headTilt} 0 ${HEAD.y + 40})`}>{children}</g>
);
/** Children drawn in the rig's torso space (chest ≈ y −100…−20, x ±40), so medals sit on the jacket as it turns. */
export const OnChest: React.FC<{ pose: Pose; children: React.ReactNode }> = ({ pose, children }) => (
  <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.spin} 0 -90) ${squashT(pose)} rotate(${pose.tilt}) translate(${pose.yaw * 6} 0) scale(${turnWidth(pose.yaw)} 1)`}>{children}</g>
);

export const Moustache: React.FC<{ pose: Pose; color?: string }> = ({ pose, color = "#2A1C18" }) => (
  <OnHead pose={pose}>
    <path transform={`translate(${pose.yaw * 30} 0)`} d={`M -26 ${HEAD.y + 18} Q -12 ${HEAD.y + 8} 0 ${HEAD.y + 16} Q 12 ${HEAD.y + 8} 26 ${HEAD.y + 18} Q 12 ${HEAD.y + 26} 0 ${HEAD.y + 20} Q -12 ${HEAD.y + 26} -26 ${HEAD.y + 18} Z`} fill={color} />
  </OnHead>
);

/** Peaked service cap: British (khaki, brown peak) or German (field grey, high front, dark peak). No national emblems. */
export const Cap: React.FC<{ pose: Pose; kind: "brit" | "ger" }> = ({ pose, kind }) => {
  const [crown, band, peak] = kind === "brit" ? ["#8A7A4E", "#5A4A2E", "#3B2A1E"] : ["#6E746A", "#2E3B2E", "#1E1E22"];
  const top = kind === "ger" ? HEAD.y - 104 : HEAD.y - 92;
  const dx = -pose.yaw * 14;
  return (
    <OnHead pose={pose}>
      <g transform={`translate(${dx} 0)`} stroke={M.ink} strokeWidth={4} strokeLinejoin="round">
        <path d={`M -70 ${HEAD.y - 44} Q -76 ${top} 0 ${top - 6} Q 76 ${top} 70 ${HEAD.y - 44} Z`} fill={crown} />
        <path d={`M -64 ${HEAD.y - 52} L 64 ${HEAD.y - 52} L 62 ${HEAD.y - 36} L -62 ${HEAD.y - 36} Z`} fill={band} />
        <path d={`M ${-50 + pose.yaw * 30} ${HEAD.y - 38} Q ${pose.yaw * 40} ${HEAD.y - 14} ${50 + pose.yaw * 30} ${HEAD.y - 38} Z`} fill={peak} />
        <circle cx={pose.yaw * 20} cy={HEAD.y - 62} r={7} fill={M.gold} />
      </g>
    </OnHead>
  );
};

/** Iron Cross, drawn plain (no centre emblem, ƯỚC: platform rules), at (x, y) in chest space. */
export const IronCross: React.FC<{ x?: number; y?: number; s?: number; glint?: number }> = ({ x = -22, y = -78, s = 1, glint = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -7 -18 L 7 -18 L 5 -7 L 18 -7 L 18 7 L 5 7 L 7 18 L -7 18 L -5 7 L -18 7 L -18 -7 L -5 -7 Z" fill="#141416" stroke="#D9D5CC" strokeWidth={3} strokeLinejoin="round" />
    {glint > 0 ? <circle r={30 + 14 * glint} fill="none" stroke={M.gold} strokeWidth={5} opacity={1 - glint} /> : null}
  </g>
);
/** MBE badge: a small silver cross on a rose-and-grey ribbon. */
export const Mbe: React.FC<{ x?: number; y?: number; s?: number; glint?: number }> = ({ x = 22, y = -82, s = 1, glint = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -9 -26 L 9 -26 L 9 -8 L -9 -8 Z" fill="#C86A7A" stroke={M.ink} strokeWidth={3} />
    <path d="M -3 -26 L 3 -26 L 3 -8 L -3 -8 Z" fill="#9AA3AA" />
    <path d="M -4 -8 L 4 -8 L 2 2 L 12 0 L 12 8 L 2 6 L 4 18 L -4 18 L -2 6 L -12 8 L -12 0 L -2 2 Z" fill="#D4D8DC" stroke={M.ink} strokeWidth={3} strokeLinejoin="round" />
    {glint > 0 ? <circle cy={4} r={30 + 14 * glint} fill="none" stroke={M.gold} strokeWidth={5} opacity={1 - glint} /> : null}
  </g>
);

// ---------- text that lives in the scene (T9, T19)

/** A wooden plaque / painted board with handwritten text (place · year), on a desk, a wall or a door. */
export const SignPost: React.FC<{ x: number; y: number; text: string; w?: number; f: number; at: number; rot?: number; kind?: "wood" | "paper" }> = ({ x, y, text, w = 340, f, at, rot = -3, kind = "wood" }) => {
  const s = interpolate(f, [at, at + 6, at + 10], [0.6, 1.06, 1], CLAMP);
  const o = prog(f, at, 3);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={10} fill={kind === "wood" ? "#8B6240" : M.paper} stroke={M.ink} strokeWidth={6} />
      {kind === "wood" ? <path d={`M ${-w / 2 + 14} -18 L ${w / 2 - 14} -20 M ${-w / 2 + 14} 20 L ${w / 2 - 14} 22`} stroke="#6E4A2E" strokeWidth={3} opacity={0.6} /> : null}
      <text x={0} y={18} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={52} fill={kind === "wood" ? "#FFF3DC" : M.ink}>
        {text}
      </text>
    </g>
  );
};

/** A notebook page with a number written in it (the number is part of the scene, not a chip). */
/** `pop`: the whole page arrives with its number on the word (m-doss critic: a blank page first read as a glitch). */
export const Ledger: React.FC<{ x: number; y: number; value: string; f: number; at: number; label?: string; s?: number; pop?: boolean }> = ({ x, y, value, f, at, label, s = 1, pop }) => (
  <g transform={`translate(${x} ${y}) rotate(4) scale(${pop ? s * interpolate(f, [at - 2, at + 4, at + 8], [0.6, 1.08, 1], CLAMP) : s})`} opacity={pop ? prog(f, at - 2, 3) : 1}>
    <rect x={-150} y={-110} width={300} height={220} rx={8} fill={M.paper} stroke={M.ink} strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M -126 ${-56 + i * 40} L 126 ${-56 + i * 40}`} stroke="#B9A37C" strokeWidth={3} />)}
    {label ? <text x={0} y={-62} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={48} fill="#5A4A3A">{label}</text> : null}
    <text x={0} y={52} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={140} fill={M.accent} opacity={prog(f, at, 6)} style={{ scale: interpolate(f, [at, at + 8], [1.3, 1], CLAMP) }}>
      {value}
    </text>
  </g>
);

// ---------- sets (toon-engine room kit, 9:16)

/** The one room shape of the style: back wall inside the safe zone, the floor bleeding to the bottom edge. */
export const ROOM: Room = makeRoom({ x: 500, y: 600 }, { x0: 180, x1: 820, y0: 380, y1: 880 }, 3.4);

/** An office at night: back window, a pendant lamp, a desk, optional flag / map on the wall. `tone` tints the walls per place. */
/**
 * Where the window sits and what hangs on the wall, so each place reads differently (critic 2026-11-03: every place
 * was the same room). `embassy`: window left, painting, curtains. `hq`: no window, a pinned map + filing cabinet,
 * cold lamp. `lodging`: window right onto the roofs, a bed corner. `bureau`: tall window centre, a bookcase.
 */
export type Layout = "embassy" | "hq" | "lodging" | "bureau";
const WIN: Record<Layout, [number, number] | null> = { embassy: [250, 470], hq: null, lodging: [560, 760], bureau: [400, 600] };
export const Office: React.FC<{ id: string; t: number; layout?: Layout; tone?: "warm" | "grey" | "green"; window?: "night" | "dusk" | "roofs"; desk?: boolean; children?: React.ReactNode; veil?: number }> = ({
  id,
  t,
  layout = "embassy",
  tone = "warm",
  window = "night",
  desk = true,
  children,
  veil = 0.26, // "sáng và rực hơn" (Lucas 2026-11-04): was 0.4
}) => {
  const wall = tone === "grey" ? "#5C646C" : tone === "green" ? "#4E6A56" : "#7A5A50";
  const lu = layout === "lodging" ? 0.3 : layout === "bureau" ? 0.5 : 0.68;
  const lamp = ROOM.P(lu, 0.3, 0.32);
  const win = WIN[layout];
  return (
    <g>
      <Defocus id={id}>
      <RoomShell r={ROOM} id={id} floor={layout === "hq" ? "tiles" : "boards"} wall={wall} side={tone === "grey" ? "#4A5056" : "#5A4440"} />
      {/* N8: plaster on the back wall, wood grain on a boards floor */}
      <rect x={ROOM.back.x0} y={ROOM.back.y0} width={ROOM.back.x1 - ROOM.back.x0} height={ROOM.back.y1 - ROOM.back.y0} fill="url(#tex-plaster)" />
      {layout === "hq" ? null : <polygon points={ROOM.Q([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]])} fill="url(#tex-boards)" />}
      {win ? <BackWindow r={ROOM} id={`${id}w`} t={t} x0={win[0]} x1={win[1]} y0={layout === "bureau" ? 420 : 450} y1={660} sun={window === "night" ? undefined : { x: (win[0] + win[1]) / 2, y: 650 }} night={window === "night"} curtains={layout !== "bureau"} /> : null}
      {win && window === "roofs"
        ? // Lisbon: terracotta roofs in the window
          [0, 1, 2].map((i) => <path key={i} d={`M ${win[0] + i * 66} 660 L ${win[0] + 33 + i * 66} ${620 - (i % 2) * 18} L ${win[0] + 66 + i * 66} 660 Z`} fill="#B5553A" stroke={M.ink} strokeWidth={3} />)
        : null}
      {layout === "embassy" ? <WallFrame x={560} y={470} w={170} h={120} art={1} /> : null}
      {layout === "hq" ? (
        <g>
          {/* a pinned map with a red line, and a filing cabinet */}
          <rect x={250} y={430} width={300} height={210} fill={M.paper} stroke={M.ink} strokeWidth={5} transform="rotate(-2 400 535)" />
          <path d="M 270 560 Q 380 520 520 470" stroke={M.accent} strokeWidth={8} fill="none" />
          <Box r={ROOM} u={[0.72, 0.92]} v={[0.45, 1]} w={[0, 0.08]} front="#4C5552" top="#5E6865" side="#3A413F" />
        </g>
      ) : null}
      {layout === "lodging" ? <Box r={ROOM} u={[0.02, 0.34]} v={[0.78, 1]} w={[0, 0.3]} front="#7A6A5A" top="#C9B99A" side="#5A4A3A" /> : null}
      {layout === "bureau"
        ? [0, 1].map((k) => (
            <g key={k}>
              <Box r={ROOM} u={k ? [0.82, 0.98] : [0.02, 0.18]} v={[0.25, 1]} w={[0, 0.06]} front="#4A3426" side="#3A2826" />
              {[0, 1, 2, 3].map((i) => <rect key={i} x={k ? 700 : 205} y={460 + i * 100} width={95} height={56} fill={["#8A3B32", "#3B5B7A", "#6B7A3E", "#7A5A3A"][(i + k) % 4]} opacity={0.85} />)}
            </g>
          ))
        : null}
      <Pendant r={ROOM} u={lu} w={0.32} t={t} />
      </Defocus>
      {children}
      {desk ? (
        <>
          <FloorShadow r={ROOM} u={[0.3, 0.78]} w={[0.42, 0.58]} />
          <Box r={ROOM} u={[0.3, 0.78]} v={[0.66, 0.74]} w={[0.42, 0.58]} front="#5B4038" top="#7A5747" side="#3A2826" rim />
          <Box r={ROOM} u={[0.32, 0.36]} v={[0.74, 1]} w={[0.54, 0.57]} front="#3A2826" />
          <Box r={ROOM} u={[0.72, 0.76]} v={[0.74, 1]} w={[0.54, 0.57]} front="#3A2826" />
        </>
      ) : null}
      <LightVeil id={`${id}v`} lights={[[lamp.x, lamp.y + 120, 260], ...(win ? [[(win[0] + win[1]) / 2, 560, 200] as [number, number, number]] : [])]} o={veil} />
      <Glow x={lamp.x} y={lamp.y + 40} r={200} o={0.45} />
      <Dust t={t} seed={id.length * 7} x0={lamp.x - 120} y0={lamp.y} w={240} h={380} n={18} />
    </g>
  );
};

/** A paper map pinned to the wall (T5): coast lines, handwritten place labels, a red route drawn on with evolvePath. */
/** The Channel (England top, France bottom): the test's map. Coasts drawn by hand, schematic (ƯỚC). */
export const CHANNEL = [
  "M 110 430 L 110 600 Q 240 640 360 610 Q 470 590 560 620 Q 690 600 780 560 Q 840 540 900 520 L 900 430 Z",
  "M 110 980 Q 200 900 300 930 Q 380 960 440 900 Q 520 870 600 900 Q 700 860 780 760 Q 840 720 900 700 L 900 1180 L 110 1180 Z",
];
export const PinnedMap: React.FC<{ f: number; arrowAt: number; arrowLen?: number; labels: { x: number; y: number; text: string; at: number }[]; route: string; land?: string[] }> = ({ f, arrowAt, arrowLen = 24, labels, route, land = CHANNEL }) => {
  const draw = evolvePath(interpolate(f, [arrowAt, arrowAt + arrowLen], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 2 }), route);
  return (
    <g>
      <rect x={0} y={0} width={1080} height={1920} fill="#4A3B3E" />
      <g transform="rotate(-1.5 500 800)">
        <rect x={110} y={420} width={790} height={760} fill={M.paper} stroke={M.ink} strokeWidth={8} />
        {land.map((d, i) => <path key={i} d={d} fill={i % 2 ? "#B8C78F" : "#9DB48A"} stroke={M.ink} strokeWidth={5} />)}
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${190 + i * 140} ${700 + (i % 2) * 40} q 20 -10 40 0 t 40 0`} stroke="#6F8FA8" strokeWidth={4} fill="none" opacity={0.7} />)}
        <path d={route} stroke={M.accent} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={draw.strokeDasharray} strokeDashoffset={draw.strokeDashoffset} />
        {labels.map((l) => (
          <text key={l.text} x={l.x} y={l.y} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={54} fill={M.ink} opacity={prog(f, l.at, 4)}>
            {l.text}
          </text>
        ))}
        {[[130, 440], [880, 440], [130, 1160], [880, 1160]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill={M.accent} stroke={M.ink} strokeWidth={3} />)}
      </g>
    </g>
  );
};

/** Small life for a held pose (critic + studio:compare 2026-11-03: 77 % still frames vs 7 % at the reference):
 *  a 3-frame blink every ~2.5–3.5 s, a slow glance, a little head movement. Seeded per character, from the global frame g. */
/** Blink at frame g? Gaps of 0.5-2.3 s seeded per character, each blink 4 frames: half, shut, shut, half (N5). */
export const blinkAt = (g: number, seed: number) => {
  let t = Math.round(rnd(seed, 0) * 40);
  for (let k = 1; t <= g; k++) {
    const d = g - t;
    if (d < 4) return [0.5, 1, 1, 0.5][d];
    t += 15 + Math.round(rnd(seed, k) * 54);
  }
  return 0;
};
export const alive = (g: number, seed: number): Partial<Pose> => {
  // pass 3: visible weight shifts too (the reference's characters are never still; 2.5° head tilt read as frozen)
  return {
    blink: blinkAt(g, seed),
    look: Math.sin(g / 17 + seed) * 0.6,
    headTilt: Math.sin(g / 19 + seed * 2) * 5,
    tilt: Math.sin(g / 29 + seed * 3) * 2,
    sway: Math.sin(g / 11 + seed) * 6,
  };
};

/** Faint figures that multiply around the spy: invented agents. n of them visible at frame f (seeded positions). */
export const ghostSpots = (n: number) => Array.from({ length: n }, (_, i) => ({ u: 0.08 + rnd(11, i) * 0.84, w: 0.02 + rnd(23, i) * 0.3 }));
