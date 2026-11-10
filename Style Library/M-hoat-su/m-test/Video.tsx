/**
 * Style M "Hoạt Sử" test (2026-11-03): ~33 s about Juan Pujol García, "Garbo", the spy both sides decorated.
 * Script + checks: kich-ban-m-test-FINAL.md · spec: 01_EPISODE-SPEC_m-test.md · cuts: shots.json → shots.timeline.json
 * (`node scripts/shotlist.mjs`), every cut on a spoken word. Characters, rooms and light: ../../toon-engine.
 * Composition `Style-M-HoatSu-Test`. The last frame is frame 0 (D6: loop by the picture).
 * Pass 2 (critic + studio:compare, 2026-11-03): numbers land on their word, medals pinned right after their word and
 * the hand leaves, four different rooms, idle life (blinks, glances), the map dated from its first frame, louder bed.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "../../../src/voiceover/m-test.timing.json";
import WORDS from "../../../src/voiceover/m-test.words.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import { kf } from "../../toon-engine/anim";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { stand } from "../../toon-engine/furnish";
import { basePose, faceAt, Hero, joints, type Look, type Pose, poseAt, toWorld } from "../../toon-engine/rig";
import { alive, Base, Cap, CAST, ghostSpots, HAND, HoatSuSub, IronCross, Ledger, M, Mbe, Moustache, Office, OnChest, PinnedMap, ROOM, SignPost } from "../hoat-su";
import SHOTS from "./shots.timeline.json";

const FPS = 30;
const MUSIC = "sfx/music/own/m-quirky.mp3"; // code-made (Lucas 2026-11-04: no Pixabay music, Content ID)
const END = 32.8; // 0.3 s after the last word (D6), as in shots.json "end"
export const mTestDuration = (fps: number) => Math.round(END * fps) + 1; // + the loop frame (= frame 0)
const BED = 4; // dB: pass 2 raised the bed (background − voice was −17.7 vs −11.4 at the reference)

const line = (id: string) => timing.lines.find((l) => l.id === id)!;
/** Global frame where script word k of line `id` is spoken (same mapping as the L kit's w()). */
const w = (id: string, k: number) => {
  const heard = (WORDS as Record<string, number[]>)[id];
  const n = line(id).text.split(/\s+/).length;
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / n))] * FPS);
};
const lineEnd = (id: string) => Math.round(line(id).end * FPS);
const shot = (id: string) => SHOTS.find((s) => s.id === id)!;
/** Local frame (inside shot `id`) of a global frame. */
const loc = (id: string, g: number) => g - shot(id).from;

/** Frame the world point (cx, cy) at zoom z, centred on the safe zone's focal point (subtitles sit below it). */
const cam = (cx: number, cy: number, z: number) => `translate(500 760) scale(${z}) translate(${-cx} ${-cy})`;
const at = (u: number, w2: number, p: Partial<Pose> = {}): Pose => ({ ...basePose, ...stand(ROOM, u, w2), ...p });
/** Medal glint 0→1 over 12 frames from `g` (local frame). */
const glint = (t: number, g: number) => (t < g ? 0 : interpolate(t, [g, g + 12], [0.01, 1], CLAMP));

/** A character with its costume pieces; `seed` gives it its own blinks and glances (pose keys still win). */
const Actor: React.FC<{ look: Look; pose: Pose; seed: number; cap?: "brit" | "ger"; moustache?: boolean; rim?: string; medals?: { iron?: number; mbe?: number; s?: number } }> = ({ look, pose, seed, cap, moustache, rim = "rimR", medals }) => {
  const g = useCurrentFrame();
  const life = alive(g, seed);
  const p = { ...pose, blink: Math.max(pose.blink, life.blink ?? 0), look: pose.look + (life.look ?? 0), headTilt: pose.headTilt + (life.headTilt ?? 0), tilt: pose.tilt + (life.tilt ?? 0), sway: pose.sway + (life.sway ?? 0) };
  return (
    <>
      <Hero look={look} pose={p} rimId={rim} />
      {moustache ? <Moustache pose={p} /> : null}
      {cap ? <Cap pose={p} kind={cap} /> : null}
      {medals ? (
        <OnChest pose={p}>
          {medals.iron !== undefined ? <IronCross glint={medals.iron} s={medals.s} /> : null}
          {medals.mbe !== undefined ? <Mbe glint={medals.mbe} s={medals.s} /> : null}
        </OnChest>
      ) : null}
    </>
  );
};
/** A sleeve + mitten coming in from off frame to a point (for close-ups the rig's own arms can't reach). */
const Sleeve: React.FC<{ from: [number, number]; to: [number, number]; color: string; cuff: string }> = ({ from, to, color, cuff }) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const n = Math.hypot(dx, dy) || 1;
  const cuffAt: [number, number] = [to[0] - (dx / n) * 34, to[1] - (dy / n) * 34];
  return (
    <g>
      <path d={`M ${from[0]} ${from[1]} L ${cuffAt[0]} ${cuffAt[1]}`} stroke={M.ink} strokeWidth={84} strokeLinecap="round" />
      <path d={`M ${from[0]} ${from[1]} L ${cuffAt[0]} ${cuffAt[1]}`} stroke={color} strokeWidth={74} strokeLinecap="round" />
      <path d={`M ${cuffAt[0] - (dy / n) * 38} ${cuffAt[1] + (dx / n) * 38} L ${cuffAt[0] + (dy / n) * 38} ${cuffAt[1] - (dx / n) * 38}`} stroke={cuff} strokeWidth={16} strokeLinecap="round" />
      <ellipse cx={to[0]} cy={to[1]} rx={34} ry={30} fill="#F6EFE3" stroke={M.ink} strokeWidth={5} />
      <ellipse cx={to[0] - (dy / n) * 26} cy={to[1] + (dx / n) * 26 - 6} rx={11} ry={16} fill="#F6EFE3" stroke={M.ink} strokeWidth={4} />
    </g>
  );
};

const SPY = CAST.spy;
// hands on hips: proud, and the hands stay clear of the subtitle line in the chest close-ups
const SPY_AT = at(0.5, 0.62, { yaw: 0.15, armL: { a: 38, b: -95 }, armR: { a: 38, b: -95 } });
const spyChest = (p: Pose) => [p.x, p.y - 70 * p.scale] as const;
/** Pin moment of a medal: the frame just after its word ends (W6 rule for the hit; the picture lands with it). */
const PIN_IRON = w("12", 7) + 10;
const PIN_MBE = w("13", 6) + 12;

type ShotFC = React.FC<{ t: number; len: number }>;
const S: Record<string, ShotFC> = {
  // HOOK — the paradox image, closer so the two medals read at phone size; frame 0 = the last frame
  S1: ({ t }) => {
    const tap = loc("S1", w("01", 5));
    const pose = { ...poseAt(t, [{ f: 0, p: SPY_AT }, { f: tap - 6, p: { armR: SPY_AT.armR, tilt: 0 } }, { f: tap, p: { armR: { a: -20, b: -110 }, tilt: -3 } }, { f: tap + 14, p: { armR: { a: -18, b: -108 }, tilt: -2 } }, { f: tap + 26, p: { armR: SPY_AT.armR, tilt: 0 } }]), ...faceAt(t + 20, [[0, "smug"]]) };
    const [cx, cy] = spyChest(SPY_AT);
    return (
      <g transform={cam(cx, cy - 60, 2.4)}>
        <Office id="s1" t={t + 40} desk={false} />
        <Actor look={SPY} pose={pose} seed={1} moustache medals={{ iron: glint(t, loc("S1", w("01", 5)) + 4), mbe: 0, s: 1.25 }} />
      </g>
    );
  },
  S2: ({ t }) => {
    const [cx, cy] = spyChest(SPY_AT);
    return (
      <g transform={cam(cx + 10, cy - 70, 3)}>
        <Office id="s2" t={t + 90} desk={false} veil={0.3} />
        <Actor look={SPY} pose={{ ...SPY_AT, expr: "smug" }} seed={1} moustache medals={{ iron: 0, mbe: glint(t, loc("S2", w("02", 3)) + 6), s: 1.25 }} />
      </g>
    );
  },
  // Madrid 1941: the British say no
  S3: ({ t }) => {
    const brit = at(0.58, 0.36, { yaw: -0.35, expr: "tired", armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 }, tilt: kf(t, [[0, 0], [30, -5]]) });
    const pump = Math.sin(t * 0.45) * 14;
    const spy = at(0.28, 0.72, { yaw: 0.55, expr: "worried", armL: { a: -24 + pump, b: -74 }, armR: { a: -24 + pump, b: -74 }, headTilt: -6 + pump * 0.4, tilt: 3 + pump * 0.2 });
    return (
      <g transform={cam(470, 760, 1.05)}>
        <Office id="s3" t={t + 140} layout="embassy">
          <Actor look={CAST.brit} pose={brit} seed={2} cap="brit" rim="rimL" />
        </Office>
        <SignPost x={ROOM.P(0.62, 0.66, 0.5).x} y={ROOM.P(0.62, 0.66, 0.5).y - 20} text="MADRID 1941" f={t} at={6} w={300} />
        <Actor look={SPY} pose={spy} seed={1} moustache />
      </g>
    );
  },
  S4: ({ t }) => {
    // a stern head shake on "no"
    const brit = { ...at(0.58, 0.36, { yaw: -0.2 }), ...faceAt(t, [[0, "tired"]]), headTilt: Math.sin(t * 0.55) * 10 * Math.exp(-t / 30) };
    const head = toWorld(brit, joints(brit).head);
    return (
      <g transform={cam(head.x, head.y + 20, 2.7)}>
        <Office id="s4" t={t + 180} layout="embassy">
          <Actor look={CAST.brit} pose={brit} seed={2} cap="brit" rim="rimL" />
        </Office>
      </g>
    );
  },
  // he signs up with the Germans: the officer behind his desk slides the papers over
  S5: ({ t }) => {
    const ger = at(0.6, 0.34, { yaw: -0.4, expr: "smug" });
    const spy = { ...at(0.3, 0.7, { yaw: 0.55, armR: { a: kf(t, [[0, 10], [18, 70]]), b: kf(t, [[0, -10], [18, -20]]) }, tilt: kf(t, [[0, 0], [18, 6]]) }), ...faceAt(t, [[0, "neutral"], [16, "happy"]]) };
    const top = ROOM.P(0.44, 0.66, 0.5);
    const slide = interpolate(t, [4, 18], [80, 0], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 3 });
    return (
      <g transform={cam(480, 760, 1.25)}>
        <Office id="s5" t={t + 220} layout="hq" tone="grey">
          <Actor look={CAST.ger} pose={ger} seed={3} cap="ger" rim="rimL" />
        </Office>
        <g transform={`translate(${top.x + slide} ${top.y - 22}) rotate(-8)`}>
          <rect x={-60} y={-40} width={120} height={80} rx={4} fill={M.paper} stroke={M.ink} strokeWidth={4} />
          <path d="M -44 -18 l 80 0 M -44 0 l 64 0 M -44 18 l 72 0" stroke="#8A7A62" strokeWidth={5} />
        </g>
        <Actor look={SPY} pose={spy} seed={1} moustache />
      </g>
    );
  },
  // Lisbon: faking London, a page rolling out of the typewriter
  S6: ({ t, len }) => {
    const tap = Math.sin(t * 2.2);
    const spy = at(0.52, 0.4, { yaw: -0.1, expr: "smug", armL: { a: 30 + tap * 14, b: -52 - tap * 10 }, armR: { a: 30 - tap * 14, b: -52 + tap * 10 }, headTilt: Math.sin(t * 0.3) * 6 });
    const top = ROOM.P(0.5, 0.66, 0.5);
    const page = interpolate(t, [0, len], [10, 70], CLAMP);
    return (
      <g transform={cam(500, 700, 1.6)}>
        <Office id="s6" t={t + 260} layout="lodging" window="roofs" tone="green">
          <Actor look={SPY} pose={spy} seed={1} moustache />
        </Office>
        <g transform={`translate(${top.x} ${top.y - 18})`}>
          <rect x={-56} y={-24 - page} width={112} height={page + 10} fill={M.paper} stroke={M.ink} strokeWidth={3} />
          <rect x={-70} y={-30} width={140} height={46} rx={8} fill="#2B2B30" stroke={M.ink} strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={-48 + i * 24} cy={0} r={6} fill="#C9C3B5" />)}
        </g>
        <SignPost x={400} y={470} text="LISBON 1941" w={380} f={t} at={4} rot={3} kind="paper" />
      </g>
    );
  },
  S7: ({ t }) => {
    const turn = interpolate(t, [8, 40], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 3 });
    const film = interpolate(t, [loc("S7", w("06", 12)) - 2, loc("S7", w("06", 12)) + 8], [0, 1], CLAMP);
    return (
      <g>
        <rect x={0} y={0} width={1080} height={1920} fill="#5B4038" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M 0 ${300 + i * 260} Q 540 ${330 + i * 260} 1080 ${290 + i * 260}`} stroke="#4E362F" strokeWidth={6} fill="none" />)}
        <g transform="translate(500 700) rotate(-4)">
          <rect x={-380} y={-260} width={760} height={520} rx={10} fill="#7A2E2A" stroke={M.ink} strokeWidth={6} />
          <rect x={-360} y={-240} width={360} height={480} fill={M.paper} stroke={M.ink} strokeWidth={4} />
          <rect x={0} y={-240} width={360} height={480} fill="#F1E5C8" stroke={M.ink} strokeWidth={4} />
          <text x={-180} y={-130} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={72} fill={M.ink}>
            LONDON
          </text>
          <text x={-180} y={-62} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={52} fill="#5A4A3A">
            GUIDE
          </text>
          <path d="M 40 -180 L 320 -150 M 60 -60 L 300 -90 M 120 -220 L 160 200 M 240 -220 L 210 200 M 40 80 Q 180 40 330 110" stroke="#8A7A62" strokeWidth={6} fill="none" />
          <path d="M 190 -200 Q 230 -20 170 190" stroke="#6F8FA8" strokeWidth={14} fill="none" opacity={0.8} />
          <path d={`M 0 -240 Q ${360 - turn * 300} ${-250 + turn * 10} ${360 - turn * 720} -230 L ${360 - turn * 720} 230 Q ${360 - turn * 300} ${250 - turn * 10} 0 240 Z`} fill="#F7EDD6" stroke={M.ink} strokeWidth={4} opacity={turn > 0 && turn < 1 ? 1 : 0} />
        </g>
        {/* a strip of newsreel film slides in on "cinema" */}
        <g transform={`translate(${interpolate(film, [0, 1], [1200, 560])} 1110) rotate(8)`}>
          <rect x={-300} y={-60} width={600} height={120} fill="#22201F" stroke={M.ink} strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-280 + i * 145} y={-38} width={120} height={76} fill="#8A8580" />)}
          {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-292 + i * 50} y={-56} width={16} height={10} fill="#D8D2C4" />)}
        </g>
        <Sleeve from={[1150, 1380]} to={[kf(t, [[0, 880], [8, 860], [40, 340], [70, 420]]), kf(t, [[0, 960], [40, 930], [70, 880]])]} color="#6B4E3A" cuff="#EDE8DE" />
      </g>
    );
  },
  S8: ({ t }) => {
    const ger = { ...at(0.5, 0.6, { yaw: 0.1, armL: { a: -10, b: -70 }, armR: { a: -10, b: -70 } }), ...faceAt(t, [[0, "neutral"], [12, "happy"]]) };
    const [cx, cy] = spyChest(ger);
    const hand = toWorld(ger, joints(ger).armR.end);
    return (
      <g transform={cam(cx, cy - 30, 1.8)}>
        <Office id="s8" t={t + 300} layout="hq" tone="grey" desk={false} />
        <Actor look={CAST.ger} pose={ger} seed={3} cap="ger" />
        <rect x={hand.x - 120} y={hand.y - 70} width={180} height={120} rx={4} fill={M.paper} stroke={M.ink} strokeWidth={4} />
        <path d={`M ${hand.x - 100} ${hand.y - 40} l 140 0 M ${hand.x - 100} ${hand.y - 10} l 120 0 M ${hand.x - 100} ${hand.y + 20} l 130 0`} stroke="#8A7A62" strokeWidth={6} />
      </g>
    );
  },
  // London 1942: hired after all
  S9: ({ t }) => {
    const brit0 = at(0.64, 0.56, { yaw: -0.5 });
    const spy0 = at(0.36, 0.58, { yaw: 0.5 });
    const midY = (brit0.y + spy0.y) / 2 - 40 * brit0.scale;
    const shake = Math.sin(t * 0.9) * 12;
    const brit = { ...brit0, armL: { a: 62 + shake, b: 8 }, ...faceAt(t, [[0, "smug"]]) };
    const spy = { ...spy0, armR: { a: 62 - shake, b: 8 }, ...faceAt(t, [[0, "happy"]]) };
    return (
      <g transform={cam(500, midY - 60, 1.5)}>
        <Office id="s9" t={t + 340} layout="bureau" desk={false} />
        <SignPost x={500} y={midY - 335} text="LONDON 1942" w={360} f={t} at={4} rot={-2} />
        <Actor look={CAST.brit} pose={brit} seed={4} cap="brit" rim="rimL" />
        <Actor look={SPY} pose={spy} seed={1} moustache />
      </g>
    );
  },
  // twenty-seven agents who never existed: they fill the room, the notebook says 27 on the word
  S10: ({ t, len }) => {
    const n = Math.floor(interpolate(t, [2, len * 0.75], [0, 27], CLAMP));
    const spy = { ...at(0.5, 0.5, { yaw: 0 }), ...faceAt(t, [[0, "smug"]]) };
    return (
      <g transform={cam(500, 740, 1.05)}>
        <Office id="s10" t={t + 380} layout="lodging" tone="green" window="roofs" desk={false}>
          {ghostSpots(27)
            .slice(0, n)
            .sort((a, b) => a.w - b.w)
            .map((g, i) => (
              <g key={i} opacity={0.5}>
                <Hero look={CAST.ghost} pose={at(g.u, g.w, { yaw: (i % 3) - 1, squash: interpolate(t - (2 + ((len * 0.75 - 2) * i) / 27), [0, 4, 8], [-0.25, 0.12, 0], CLAMP) })} rimId="rimL" shadow={0} />
              </g>
            ))}
        </Office>
        <Actor look={SPY} pose={spy} seed={1} moustache />
        <Ledger x={300} y={1060} value="27" label="AGENTS" f={t} at={loc("S10", w("09", 2))} />
      </g>
    );
  },
  // D-Day: the map is dated from its first frame; Calais + the red arrow on "trick" (the one slow push, ≤ 5 % / 3 s)
  S11: ({ t, len }) => {
    const z = interpolate(t, [0, len], [1, 1.04], CLAMP);
    const trick = loc("S11", w("10", 11));
    return (
      <g transform={`translate(500 800) scale(${z}) translate(-500 -800)`}>
        <PinnedMap
          f={t}
          arrowAt={trick - 6}
          route="M 330 620 Q 520 690 700 760"
          labels={[
            { x: 300, y: 1040, text: "NORMANDY", at: loc("S11", w("10", 9)) - 4 },
            { x: 740, y: 840, text: "CALAIS", at: trick },
          ]}
        />
        <g transform="rotate(5 760 520)">
          <rect x={505} y={440} width={385} height={110} fill="#F7EFD9" stroke={M.ink} strokeWidth={5} />
          <text x={697} y={515} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={56} fill={M.accent}>
            9 JUNE 1944
          </text>
        </g>
      </g>
    );
  },
  S12: ({ t }) => {
    const ger = { ...at(0.36, 0.58, { yaw: 0.6, headTilt: kf(t, [[0, 0], [5, 14], [10, -4], [15, 12], [22, 0]]), tilt: kf(t, [[0, 0], [8, 4], [22, 0]]) }), ...faceAt(t, [[0, "smug"]]) };
    const head = toWorld(ger, joints(ger).head);
    return (
      <g transform={cam(head.x + 120, head.y + 140, 1.8)}>
        <Office id="s12" t={t + 420} layout="hq" tone="grey" desk={false} />
        <Actor look={CAST.ger} pose={ger} seed={3} cap="ger" />
      </g>
    );
  },
  // two medals for the same lies: each pinned just after its word, then the hand leaves
  S13: ({ t }) => {
    const landed = loc("S13", PIN_IRON);
    const [cx, cy] = spyChest(SPY_AT);
    const pin = toWorld(SPY_AT, { x: -28, y: -78 });
    const p: [number, number] = [kf(t, [[0, pin.x - 260], [landed, pin.x - 22], [landed + 12, pin.x - 300]]), kf(t, [[0, pin.y + 60], [landed, pin.y + 8], [landed + 12, pin.y + 120]])];
    return (
      <g transform={cam(cx, cy - 70, 3)}>
        <Office id="s13" t={t + 460} desk={false} veil={0.3} />
        <Actor look={SPY} pose={{ ...SPY_AT, expr: t >= landed ? "smug" : "neutral" }} seed={1} moustache medals={t >= landed ? { iron: glint(t, landed + 2), s: 1.25 } : {}} />
        <Sleeve from={[p[0] - 340, p[1] + 120]} to={p} color="#6E746A" cuff="#2E3B2E" />
      </g>
    );
  },
  S14: ({ t }) => {
    const landed = loc("S14", PIN_MBE);
    const [cx, cy] = spyChest(SPY_AT);
    const pin = toWorld(SPY_AT, { x: 28, y: -82 });
    const p: [number, number] = [kf(t, [[0, pin.x + 260], [landed, pin.x + 22], [landed + 12, pin.x + 300]]), kf(t, [[0, pin.y + 60], [landed, pin.y + 8], [landed + 12, pin.y + 120]])];
    return (
      <g transform={cam(cx, cy - 70, 3)}>
        <Office id="s14" t={t + 500} desk={false} veil={0.3} />
        <Actor look={SPY} pose={{ ...SPY_AT, expr: t >= landed ? "smug" : "neutral" }} seed={1} moustache medals={{ iron: 0, s: 1.25, ...(t >= landed ? { mbe: glint(t, landed + 2) } : {}) }} />
        <Sleeve from={[p[0] + 340, p[1] + 120]} to={p} color="#1F2A44" cuff={M.gold} />
      </g>
    );
  },
  S15: ({ t }) => {
    const pose = { ...SPY_AT, tilt: kf(t, [[0, 0], [16, -4], [40, -2], [60, 0]]), headTilt: kf(t, [[0, 0], [16, -6], [60, 0]]), ...faceAt(t, [[0, "neutral"], [14, "smug"]]) };
    const [cx, cy] = spyChest(pose);
    return (
      <g transform={cam(cx, cy - 60, 2.4)}>
        <Office id="s15" t={t + 540} desk={false} />
        <Actor look={SPY} pose={pose} seed={1} moustache medals={{ iron: 0, mbe: 0, s: 1.25 }} />
      </g>
    );
  },
};

const Picture: React.FC = () => {
  const f = useCurrentFrame();
  const seg = [...SHOTS].reverse().find((s) => f >= s.from) ?? SHOTS[0];
  const Shot = S[seg.id];
  return (
    <>
      <Base />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <KitDefs />
        <SetDefs />
        <Shot t={f - seg.from} len={seg.len} />
      </svg>
      <KaraokeSubs timing={timing} words={WORDS} Skin={HoatSuSub} oneLine maxWords={3} maxChars={18} />
    </>
  );
};

export const MTest: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const duck = (g: number) => (g >= w("14", 0) - 6 ? 0.55 : g >= lineEnd("11") - 4 && g < line("12").start * FPS ? 0.6 : 1);
  return (
    <AbsoluteFill>
      {/* D6: the last frame is frame 0, so the replay joins without a seam */}
      <Freeze frame={0} active={f >= durationInFrames - 1}>
        <Picture />
      </Freeze>
      <Audio name="VO" src={staticFile("voiceover/m-test/vo.mp3")} />
      <MusicBed file={MUSIC} level={-27 + BED} duck={duck} />
      {/* W6: each hit lands in the pause after its word (or with the action it shows), aligned by the sound's attack / peak */}
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={lineEnd("01")} level={-24 + BED} align="onset" />
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={shot("S2").from + loc("S2", w("02", 3)) + 6} level={-24 + BED} align="onset" />
      <Sfx file="sfx/pop/page-turn-single-1104.mp3" at={shot("S5").from + 6} level={-26 + BED} align="onset" />
      <Sfx file="sfx/tick/data-short-input-on-typewriter-1379.mp3" at={shot("S6").from + 4} level={-28 + BED} align="onset" />
      <Sfx file="sfx/pop/page-turn-single-1104.mp3" at={shot("S7").from + 12} level={-24 + BED} align="onset" />
      <Sfx file="sfx/pen/fast-writing-3196.mp3" at={w("09", 2) - 2} level={-26 + BED} align="onset" />
      <Sfx file="sfx/swish/fast-air-sweep-transition-168.mp3" at={shot("S11").from + loc("S11", w("10", 11))} level={-27 + BED} align="peak" />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("11") + 2} level={-22} align="onset" seconds={1.4} />
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={PIN_IRON} level={-22 + BED} align="onset" />
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={PIN_MBE} level={-22 + BED} align="onset" />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
