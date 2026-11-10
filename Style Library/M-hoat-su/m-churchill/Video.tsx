/**
 * Style M "Hoạt Sử" demo (Giai đoạn 3, 2026-11-04): ~62 s about Jack Churchill, the officer who fought WWII with a
 * sword, a longbow and bagpipes. Script + checks: kich-ban-m-churchill-FINAL.md · spec: 01_EPISODE-SPEC_m-churchill.md ·
 * cuts: shots.json → shots.timeline.json (`node scripts/shotlist.mjs`), every cut on a spoken word.
 * Composition `Style-M-HoatSu-Churchill`. The last frame is frame 0 (D6). Outdoor sets: Lucas's AI pictures
 * (public/images/m-churchill/a1–a6) once they exist, flat code stand-ins until then (ww2.tsx `Outside`).
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "../../../src/voiceover/m-churchill.timing.json";
import WORDS from "../../../src/voiceover/m-churchill.words.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import { kf } from "../../toon-engine/anim";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { stand } from "../../toon-engine/furnish";
import { basePose, faceAt, Hero, joints, type Look, type Pose, poseAt, toWorld, walkPose } from "../../toon-engine/rig";
import { alive, Base, Cap, CAST, HAND, HoatSuSub, Ledger, M, Moustache, Office, PinnedMap, ROOM, SignPost } from "../hoat-su";
import { Arrow, Bow, BowOnBack, Brodie, Burst, HANDS_UP, handAt, HORIZON, LandingCraft, Lorry, Notes, Outside, PIPE_ARMS, Pipes, Rifle, Rocks, Scabbard, SnowBank, Sparkle, Stahl, Sword, Target, TROOPS, vary, WhiteOut } from "../ww2";
import SHOTS from "./shots.timeline.json";

const FPS = 30;
/** The pipes play from S17 until the grenade lands in S19 (its `land` frame: 6 frames after "grenade"). */
const PIPES_END_AT = () => w("14", 2) + 6;
const MUSIC = "sfx/music/own/m-quirky.mp3"; // code-made (Lucas 2026-11-04: no Pixabay music, Content ID)
const END = 61.6; // 0.3 s after the last word (D6), as in shots.json "end"
export const mChurchillDuration = (fps: number) => Math.round(END * fps) + 1; // + the loop frame (= frame 0)
const IMG = (n: string) => `images/m-churchill/${n}.jpg`;

const line = (id: string) => timing.lines.find((l) => l.id === id)!;
/** Global frame where script word k of line `id` is spoken. */
const w = (id: string, k: number) => {
  const heard = (WORDS as Record<string, number[]>)[id];
  const n = line(id).text.split(/\s+/).length;
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / n))] * FPS);
};
const lineEnd = (id: string) => Math.round(line(id).end * FPS);
const shot = (id: string) => SHOTS.find((s) => s.id === id)!;
const loc = (id: string, g: number) => g - shot(id).from;

/** Frame the world point (cx, cy) at zoom z, centred on the safe zone's focal point. */
const cam = (cx: number, cy: number, z: number) => `translate(500 760) scale(${z}) translate(${-cx} ${-cy})`;
const at = (u: number, w2: number, p: Partial<Pose> = {}): Pose => ({ ...basePose, ...stand(ROOM, u, w2), ...p });
const chest = (p: Pose) => [p.x, p.y - 70 * p.scale] as const;
const ground = (w2: number) => ROOM.P(0.5, 1, w2).y;

type Gear = { hat?: "brit" | "ger" | "brodie" | "stahl"; moustache?: boolean; scabbard?: "full" | "empty"; bow?: boolean; pipes?: number; carry?: boolean };
/** A character with costume + gear; `seed` gives it its own blinks and glances (pose keys still win). */
const Actor: React.FC<{ look: Look; pose: Pose; seed: number; gear?: Gear; rim?: string; still?: boolean }> = ({ look, pose, seed, gear = {}, rim = "rimR", still }) => {
  const g = useCurrentFrame();
  const life = still ? {} : alive(g, seed);
  // pass 1 (still frames 56 %): breathing and a little arm drift on top of the kit's blinks and glances
  const breath = still ? 0 : Math.sin(g / 14 + seed);
  const drift = still ? 0 : Math.sin(g / 17 + seed * 2) * 5;
  const p = {
    ...pose,
    blink: Math.max(pose.blink, life.blink ?? 0),
    look: pose.look + (life.look ?? 0),
    headTilt: pose.headTilt + (life.headTilt ?? 0),
    tilt: pose.tilt + (life.tilt ?? 0),
    sway: pose.sway + (life.sway ?? 0),
    squash: pose.squash + breath * 0.03,
    armL: { ...pose.armL, a: pose.armL.a + drift },
    armR: { ...pose.armR, a: pose.armR.a - drift },
  };
  return (
    <>
      {gear.bow ? <BowOnBack pose={p} /> : null}
      <Hero look={seed === 1 ? look : vary(look, seed)} pose={p} rimId={rim} />
      {gear.scabbard ? <Scabbard pose={p} empty={gear.scabbard === "empty"} /> : null}
      {gear.pipes !== undefined ? <Pipes pose={p} squeeze={gear.pipes} carry={gear.carry} /> : null}
      {gear.moustache ? <Moustache pose={p} /> : null}
      {gear.hat === "brit" || gear.hat === "ger" ? <Cap pose={p} kind={gear.hat} /> : null}
      {gear.hat === "brodie" ? <Brodie pose={p} /> : null}
      {gear.hat === "stahl" ? <Stahl pose={p} /> : null}
    </>
  );
};
const JACK = { ...TROOPS.jack, girth: 1 }; // his moustache is gear.moustache; a set girth keeps vary() off him
const JACK_GEAR: Gear = { hat: "brit", moustache: true, scabbard: "full", bow: true };
/** Hook + close: all three things readable at once, the pipes carried under the arm (critic #3). */
const HOOK_GEAR: Gear = { ...JACK_GEAR, pipes: 0, carry: true };
/** Frame 0 / last frame: proud, hands on hips, the three things on him. */
const JACK_AT = at(0.5, 0.6, { yaw: 0.12, armL: { a: 38, b: -95 }, armR: { a: 38, b: -95 } });
const squeeze = (t: number) => 0.5 + 0.5 * Math.sin(t / 5);
const PIPE = (t: number): Partial<Pose> => ({ ...PIPE_ARMS, headTilt: Math.sin(t / 9) * 4, tilt: Math.sin(t / 13) * 2 });
/** Rifle held at the side, butt on the ground by the right foot. */
const OrderArms: React.FC<{ p: Pose }> = ({ p }) => {
  const h = handAt(p, "R");
  return <Rifle x={h.x + 8 * p.scale} y={p.y + 150 * p.scale} s={p.scale * 1.25} />;
};

type ShotFC = React.FC<{ t: number; len: number }>;
const S: Record<string, ShotFC> = {
  // HOOK — the whole paradox in one picture; frame 0 = the last frame
  S1: ({ t }) => {
    const [cx, cy] = chest(JACK_AT);
    return (
      <g transform={cam(cx, cy - 40, 1.45)}>
        <Office id="s1" t={t + 40} layout="hq" tone="green" desk={false} />
        <Actor look={JACK} pose={{ ...poseAt(t, [{ f: 0, p: { armR: JACK_AT.armR, headTilt: 0 } }, { f: 14, p: { armR: JACK_AT.armR, headTilt: -7 } }, { f: 32, p: { armR: { a: -28, b: -50 }, headTilt: -4 } }], JACK_AT), ...faceAt(t + 30, [[0, "smug"]]) }} seed={1} gear={HOOK_GEAR} />
      </g>
    );
  },
  // "sword": the blade comes out and catches the light
  S2: ({ t }) => {
    const p = { ...poseAt(t, [{ f: 0, p: { armR: JACK_AT.armR } }, { f: 8, p: { armR: { a: 130, b: -30 } } }, { f: 40, p: { armR: { a: 126, b: -26 } } }], JACK_AT), ...faceAt(t, [[0, "cool"]]) };
    const h = handAt(p, "R");
    const [cx, cy] = chest(JACK_AT);
    return (
      <g transform={cam(cx + 40, cy - 110, 2.0)}>
        <Office id="s2" t={t + 80} layout="hq" tone="green" desk={false} veil={0.3} />
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, scabbard: "empty" }} />
        <Sword x={h.x} y={h.y} deg={interpolate(t, [0, 8], [150, 20], CLAMP)} s={p.scale} glint={interpolate(t, [8, 20], [0.01, 1], CLAMP)} />
      </g>
    );
  },
  // "longbow": he turns so the bow on his back shows
  S3: ({ t }) => {
    const p = { ...JACK_AT, yaw: -0.2, armR: { a: kf(t, [[0, 38], [8, 64]]), b: kf(t, [[0, -95], [8, -70]]) }, ...faceAt(t, [[0, "smug"]]) };
    const [cx, cy] = chest(p);
    const h = handAt(p, "R");
    return (
      <g transform={cam(cx + 30, cy - 90, 1.9)}>
        <Office id="s3" t={t + 120} layout="hq" tone="green" desk={false} veil={0.3} />
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, bow: false }} />
        <Bow x={h.x} y={h.y - 30} s={p.scale * 0.9} />
      </g>
    );
  },
  // "bagpipes": the bag breathes, notes rise from the drones
  S4: ({ t }) => {
    const p = { ...JACK_AT, ...PIPE(t), ...faceAt(t, [[0, "cool"]]) };
    const [cx, cy] = chest(p);
    const top = toWorld(p, { x: -130, y: -252 });
    return (
      <g transform={cam(cx - 20, cy - 60, 1.9)}>
        <Office id="s4" t={t + 160} layout="hq" tone="green" desk={false} veil={0.3} />
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, pipes: squeeze(t) }} />
        <Notes t={t} x={top.x} y={top.y} />
      </g>
    );
  },
  // "Everyone else carried rifles": the line of rifles, and him at the end with a bow
  S5: ({ t }) => {
    const turn = interpolate(t, [10, 22], [0, 1], CLAMP);
    // critic #10: bigger men with readable rifles; he has stepped out of the line, the bow taller than any of them
    const men = [0.12, 0.3, 0.48].map((u, i) => at(u, 0.42, { yaw: 0.5 * turn, ...faceAt(t + i * 7, [[0, "neutral"]]) }));
    const jack = at(0.74, 0.62, { yaw: -0.3, armL: { a: 30, b: -40 }, ...faceAt(t, [[0, "smug"]]) });
    const bh = handAt(jack, "L");
    return (
      <g transform={cam(500, men[0].y - 20, 1.05)}>
        <Outside kind="field" id="s5" t={t} img={IMG("a6-field")} />
        {men.map((p, i) => (
          <g key={i}>
            <Actor look={TROOPS.tommy} pose={p} seed={10 + i} gear={{ hat: "brodie" }} />
            <OrderArms p={p} />
          </g>
        ))}
        <Actor look={JACK} pose={jack} seed={1} gear={{ hat: "brit", moustache: true, scabbard: "full" }} />
        <Bow x={bh.x} y={bh.y - 60} s={jack.scale * 1.05} />
      </g>
    );
  },
  // world championships: draw, loose, the arrow lands in the gold just after the word (W6)
  S6: ({ t }) => {
    const hit = loc("S6", lineEnd("03")) - 2;
    const loose = hit - 8;
    const p = at(0.3, 0.55, { yaw: 1, facing: 1, armR: { a: 92, b: -2 }, armL: { a: -78, b: interpolate(t, [0, loose - 4], [-60, -10], CLAMP) }, tilt: -3, ...faceAt(t, [[0, "cool"], [hit + 4, "smug"]]) });
    const bowHand = handAt(p, "R");
    const pullHand = handAt(p, "L");
    const pull = t < loose ? Math.max(0, bowHand.x - pullHand.x) / p.scale / 0.8 : 0;
    const tgt = { x: 870, y: ground(0.25) - 260 };
    const fly = interpolate(t, [loose, hit], [0, 1], CLAMP);
    const ax = t < loose ? null : interpolate(fly, [0, 1], [bowHand.x, tgt.x - 60]);
    return (
      <g transform={cam(560, bowHand.y + 40, 1.05)}>
        <Outside kind="field" id="s6" t={t + 40} img={IMG("a6-field")} />
        <Target x={tgt.x} y={tgt.y} s={0.9} shake={t > hit ? Math.sin((t - hit) * 1.6) * 6 * Math.exp(-(t - hit) / 6) : 0} />
        <Actor look={JACK} pose={p} seed={1} gear={{ hat: "brit", moustache: true, scabbard: "full" }} />
        <Bow x={bowHand.x} y={bowHand.y} s={p.scale * 0.8} pull={pull} />
        {ax !== null ? <Arrow x={ax} y={interpolate(fly, [0, 0.5, 1], [bowHand.y, bowHand.y - 40, tgt.y])} deg={90} s={p.scale * 0.8} /> : null}
      </g>
    );
  },
  // Norway 1941: the landing craft runs up onto the snow
  S7: ({ t }) => {
    // critic #15: the boat whole in frame, him at the bow with the pipes (cap, not a helmet)
    const x = kf(t, [[0, 470], [36, 640]]);
    const ramp = interpolate(t, [36, 50], [0, 1], CLAMP);
    const gy = ground(0.4);
    const jack = { ...basePose, x: x - 20, y: gy - 150, scale: 0.6, yaw: 0.5, ...PIPE(t), ...faceAt(t, [[0, "cool"]]) };
    return (
      <g transform={cam(520, gy - 260, 1.0)}>
        <Outside kind="fjord" id="s7" t={t} img={IMG("a1-vagsoy")} />
        {[0, 1, 2].map((i) => {
          const p = { ...basePose, x: x - 360 + i * 100, y: gy - 140, scale: 0.55, ...faceAt(t + i * 9, [[0, "neutral"]]) };
          return <Actor key={i} look={TROOPS.tommy} pose={p} seed={20 + i} gear={{ hat: "brodie" }} />;
        })}
        <Actor look={JACK} pose={jack} seed={1} gear={{ hat: "brit", moustache: true, pipes: squeeze(t) }} still />
        <LandingCraft x={x} y={gy - 40} s={0.9} ramp={ramp} />
        <SnowBank y={gy - 20} x0={560} />
        <SignPost x={690} y={gy - 440} text="NORWAY 1941" w={340} f={t} at={6} rot={4} />
      </g>
    );
  },
  // "ashore playing the bagpipes": he walks down onto the beach, pipes going
  S8: ({ t }) => {
    const gy = ground(0.6);
    const ph = t * 0.22;
    const p = { ...walkPose(kf(t, [[0, 300], [60, 560]]), ph, gy, stand(ROOM, 0.5, 0.6).scale, { ...PIPE(t), yaw: 0.7 }), ...faceAt(t, [[0, "cool"]]) };
    const top = toWorld(p, { x: -130, y: -252 });
    return (
      <g transform={cam(520, gy - 380, 1.3)}>
        <Outside kind="fjord" id="s8" t={t + 50} img={IMG("a1-vagsoy")} />
        <SnowBank y={gy - 30} />
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, pipes: squeeze(t) }} still />
        <Notes t={t} x={top.x} y={top.y} />
      </g>
    );
  },
  // Italy 1943: a pinned map, the red line up from the beach to the hill post
  S9: ({ t }) => (
    <>
    <PinnedMap
      f={t}
      arrowAt={4}
      arrowLen={40}
      route="M 430 1010 Q 500 960 580 900"
      land={[
        // Italy's boot, drawn by hand (ƯỚC, critic #13): the Alps across the top, the spur, the heel, the toe; Sicily off the toe
        "M 230 440 Q 450 410 700 440 L 660 540 Q 700 640 780 740 Q 820 800 860 830 L 830 870 Q 870 930 900 990 L 860 1000 Q 810 950 770 960 Q 760 1030 720 1070 Q 700 1110 660 1120 Q 640 1060 650 1010 Q 610 950 580 900 Q 520 850 480 780 Q 420 700 360 640 Q 300 580 240 560 Z",
        "M 560 1130 Q 620 1120 680 1150 Q 640 1180 580 1178 Z",
      ]}
      labels={[{ x: 470, y: 600, text: "ITALY", at: 0 }]}
    />
    <g transform="rotate(-1.5 500 800)">
      <circle cx={580} cy={900} r={26 + 10 * Math.sin(t / 4)} fill="none" stroke={M.accent} strokeWidth={8} opacity={interpolate(t, [40, 46], [0, 1], CLAMP)} />
      <text x={440} y={930} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={54} fill={M.ink} opacity={interpolate(t, [44, 50], [0, 1], CLAMP)}>
        SALERNO
      </text>
    </g>
    </>
  ),
  S10: ({ t }) => {
    const post = { x: 540, y: 380 };
    const ring = interpolate(t, [4, 18], [0, 1], CLAMP);
    return (
      <g>
        <Outside kind="town" id="s10" t={t} img={IMG("a2-molina")} />
        <g transform={`translate(${post.x} ${post.y})`}>
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={-80 + i * 40} cy={0} rx={26} ry={14} fill="#B49C72" stroke={M.ink} strokeWidth={4} />)}
          <path d="M -40 -12 Q -40 -40 -20 -40 Q 0 -40 0 -12 Z M 20 -12 Q 20 -36 38 -36 Q 56 -36 56 -12 Z" fill="#4E5548" stroke={M.ink} strokeWidth={4} />
          <circle r={130} fill="none" stroke={M.accent} strokeWidth={12} strokeDasharray={`${ring * 817} 817`} transform="rotate(-90)" />
        </g>
        <SignPost x={540} y={620} text="SALERNO 1943" w={380} f={t} at={2} rot={-3} />
      </g>
    );
  },
  // "He took one corporal": the two of them going up the road
  S11: ({ t }) => {
    const gy = ground(0.5);
    const sc = stand(ROOM, 0.5, 0.5).scale;
    const jack = { ...walkPose(kf(t, [[0, 260], [70, 520]], (x) => x), t * 0.2, gy, sc, { yaw: 0.75 }), ...faceAt(t, [[0, "cool"]]) };
    const cpl = { ...walkPose(kf(t, [[0, 90], [70, 350]], (x) => x), t * 0.2 + 1.3, gy + 20, sc * 1.04, { yaw: 0.75 }), ...faceAt(t, [[0, "worried"]]) };
    return (
      <g transform={cam(420, gy - 360, 1.2)}>
        <Outside kind="town" id="s11" t={t + 30} img={IMG("a2-molina")} />
        <Actor look={TROOPS.tommy} pose={cpl} seed={30} gear={{ hat: "brodie" }} still />
        <Actor look={JACK} pose={jack} seed={1} gear={JACK_GEAR} still />
      </g>
    );
  },
  // forty-two prisoners: they keep coming, hands up; the number is written as it's said; a mortar tube on "mortar"
  S12: ({ t, len }) => {
    const n = Math.floor(interpolate(t, [0, len * 0.8], [3, 9], CLAMP));
    const mortar = loc("S12", w("07", 7));
    return (
      <g transform={cam(500, 760, 1.0)}>
        <Outside kind="town" id="s12" t={t + 60} img={IMG("a2-molina")} />
        {Array.from({ length: n }, (_, i) => {
          const wv = 0.12 + (i % 3) * 0.16;
          const u = 1.05 - ((t * 0.006 + i * 0.13) % 1.1);
          const p = { ...at(u, wv, { ...HANDS_UP, yaw: -0.5 }), ...faceAt(t + i * 5, [[0, i % 2 ? "worried" : "tired"]]) };
          return (
            <g key={i}>
              <Actor look={TROOPS.landser} pose={p} seed={40 + i} gear={{ hat: "stahl" }} />
              {i === 1 && t >= mortar - 4 ? <rect x={p.x - 30 * p.scale} y={p.y - 360 * p.scale} width={60 * p.scale} height={240 * p.scale} rx={10} fill="#3C4036" stroke={M.ink} strokeWidth={5} transform={`rotate(-34 ${p.x} ${p.y - 240 * p.scale})`} /> : null}
            </g>
          );
        })}
        {/* critic #11: the corporal at the back, rifle on them; Churchill in front */}
        {(() => {
          const cpl = { ...at(0.84, 0.16, { yaw: -0.6, armR: { a: 80, b: -10 } }), ...faceAt(t, [[0, "cool"]]) };
          const h = handAt(cpl, "R");
          return (
            <>
              <Actor look={TROOPS.tommy} pose={cpl} seed={30} gear={{ hat: "brodie" }} rim="rimL" />
              <Rifle x={h.x + 40 * cpl.scale} y={h.y} deg={-80} s={cpl.scale} />
            </>
          );
        })()}
        <Actor look={JACK} pose={{ ...at(0.64, 0.68, { yaw: -0.4, armR: { a: 40, b: -20 } }), ...faceAt(t, [[0, "smug"]]) }} seed={1} gear={JACK_GEAR} />
        <Ledger x={300} y={1180} value="42" label="PRISONERS" f={t} at={loc("S12", w("07", 3))} />
      </g>
    );
  },
  // "he'd lost his sword": the hand finds an empty scabbard
  S13: ({ t }) => {
    // critic #4: still in the Italian town (not back at base); he pats the empty scabbard twice
    const touch = 10;
    const pat = t > touch ? Math.abs(Math.sin((t - touch) / 3)) * 10 * Math.exp(-(t - touch) / 20) : 0;
    const p = { ...JACK_AT, armL: { a: kf(t, [[0, 38], [touch, 16]]) + pat, b: kf(t, [[0, -95], [touch, -30]]) }, ...faceAt(t, [[0, "neutral"], [touch + 4, "shock"]]), headTilt: kf(t, [[0, 0], [touch, 10]]) };
    const [cx, cy] = chest(p);
    return (
      <g transform={cam(cx - 40, cy + 10, 1.9)}>
        <Outside kind="alley" id="s13" t={t + 200} img={IMG("a3-alley")} />
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, scabbard: "empty" }} />
      </g>
    );
  },
  // back into the town for it: walks to the sword, bends, comes up with it on "get it"
  S14: ({ t, len }) => {
    const gy = ground(0.5);
    const sc = stand(ROOM, 0.5, 0.5).scale;
    const stop = Math.round(len * 0.55);
    const grab = loc("S14", w("09", 9));
    const x = kf(t, [[0, 200], [stop, 520]], (k) => k);
    const walking = t < stop;
    const p = walking
      ? { ...walkPose(x, t * 0.24, gy, sc, { yaw: 0.7 }), ...faceAt(t, [[0, "tired"]]) }
      : { ...basePose, x, y: gy - 120 * sc, scale: sc, yaw: 0.7, tilt: kf(t, [[stop, 0], [grab - 4, 34], [grab + 6, 0]]), armR: { a: kf(t, [[stop, 10], [grab - 4, 40], [grab + 8, 140]]), b: -20 }, ...faceAt(t, [[0, "neutral"], [grab + 4, "smug"]]) };
    const held = t >= grab;
    const h = handAt(p, "R");
    return (
      <g transform={cam(500, gy - 300, 1.25)}>
        <Outside kind="alley" id="s14" t={t} img={IMG("a3-alley")} />
        {held ? null : <Sword x={600} y={gy - 10} deg={96} s={sc} glint={((t % 30) / 30) * 0.8} />}
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, scabbard: "empty" }} still={walking} />
        {held ? <Sword x={h.x} y={h.y} deg={kf(t, [[grab, 100], [grab + 8, 20]])} s={sc} /> : null}
      </g>
    );
  },
  // Brač 1944, night: the commandos behind the rocks, him standing
  S15: ({ t }) => {
    const gy = ground(0.45);
    return (
      <g transform={cam(520, gy - 300, 1.1)}>
        <Outside kind="hill" id="s15" t={t} img={IMG("a4-brac")} />
        {[0.2, 0.42, 0.78].map((u, i) => <Actor key={i} look={TROOPS.tommy} pose={{ ...at(u, 0.45, { yaw: 0.3 * Math.sin(t / 11 + i * 2), squash: 0.2 + 0.08 * Math.sin(t / 7 + i), tilt: 14 }), ...faceAt(t + i * 4, [[0, "worried"]]) }} seed={50 + i} gear={{ hat: "brodie" }} />)}
        <Rocks x={330} y={gy + 40} s={1.2} seed={3} />
        <Rocks x={860} y={gy + 50} s={1.1} seed={5} />
        <Actor look={JACK} pose={{ ...at(0.6, 0.5, { yaw: 0.2 }), ...faceAt(t, [[0, "cool"]]) }} seed={1} gear={JACK_GEAR} />
        <SignPost x={500} y={gy - 640} text="BRAČ 1944" w={320} f={t} at={4} rot={-3} />
      </g>
    );
  },
  // the shell: a flash; the men go down behind the rocks; only he is still standing
  S16: ({ t }) => {
    const gy = ground(0.45);
    const hit = loc("S16", w("11", 2));
    const down = (i: number) => interpolate(t, [hit + 2 + i * 2, hit + 10 + i * 2], [0, 1], CLAMP);
    return (
      <g transform={cam(520, gy - 300, 1.1)}>
        <Outside kind="hill" id="s16" t={t + 40} img={IMG("a4-brac")} />
        {/* critic #6: they go down behind the rocks and stay there, helmets showing; a shell burst, not a white disc */}
        <clipPath id="s16low">
          <rect x={-400} y={-400} width={1880} height={gy + 410} />
        </clipPath>
        <g clipPath="url(#s16low)">
          {[0.2, 0.42, 0.78].map((u, i) => (
            <Actor key={i} look={TROOPS.tommy} pose={{ ...at(u, 0.45, { yaw: 0.3, squash: 0.25, tilt: 14 + down(i) * 60 }), y: at(u, 0.45).y + down(i) * 150, ...faceAt(t, [[0, "worried"], [hit + 2, "dizzy"]]) }} seed={50 + i} gear={{ hat: "brodie" }} still={t > hit} />
          ))}
        </g>
        <Rocks x={330} y={gy + 40} s={1.2} seed={3} />
        <Rocks x={860} y={gy + 50} s={1.1} seed={5} />
        {/* he ducks from the blast, then straightens up alone */}
        <Actor look={JACK} pose={{ ...at(0.6, 0.5, { yaw: 0.2, squash: kf(t, [[hit, 0], [hit + 4, 0.22], [hit + 26, 0.22], [hit + 40, 0]]), tilt: kf(t, [[hit, 0], [hit + 4, -16], [hit + 26, -12], [hit + 40, 0]]) }), ...faceAt(t, [[0, "cool"], [hit + 3, "shock"], [hit + 34, "tired"]]) }} seed={1} gear={JACK_GEAR} />
        <Burst t={t} at={hit} x={260} y={gy + 20} s={1.1} />
      </g>
    );
  },
  // he plays while the Germans come up the hill (small, dark, far)
  S17: ({ t, len }) => {
    const gy = ground(0.6);
    const p = { ...at(0.42, 0.62, { yaw: 0.35, ...PIPE(t) }), ...faceAt(t, [[0, "cool"]]) };
    const top = toWorld(p, { x: -130, y: -252 });
    return (
      <g transform={cam(520, gy - 380, 1.15)}>
        <Outside kind="hill" id="s17" t={t + 80} img={IMG("a4-brac")} />
        {/* critic #7: small on the skyline, well clear of him, coming closer step by step */}
        {[0, 1, 2, 3].map((i) => {
          const k = interpolate(t, [0, len], [0, 1], CLAMP);
          const sc = 0.26 + 0.1 * k;
          const q = walkPose(700 + i * 62 - k * 70, t * 0.2 + i, HORIZON - 150 + k * 40, sc, { yaw: -0.8 }, -1);
          return (
            <g key={i} opacity={0.9} style={{ filter: "brightness(0.45)" }}>
              <Actor look={TROOPS.landser} pose={q} seed={60 + i} gear={{ hat: "stahl" }} still />
            </g>
          );
        })}
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, pipes: squeeze(t) }} />
        <Notes t={t} x={top.x} y={top.y} />
      </g>
    );
  },
  S18: ({ t }) => {
    const p = { ...at(0.42, 0.62, { yaw: 0.35, ...PIPE(t) }), ...faceAt(t, [[0, "cool"], [30, "tired"]]) };
    const head = toWorld(p, joints(p).head);
    const top = toWorld(p, { x: -130, y: -252 });
    return (
      <g transform={cam(head.x - 40, head.y + 60, 1.7)}>
        <Outside kind="hill" id="s18" t={t + 120} img={IMG("a4-brac")} />
        <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, pipes: squeeze(t) }} />
        <Notes t={t} x={top.x} y={top.y} n={5} />
      </g>
    );
  },
  // the grenade: it tumbles in, a white flash on "out", then black for the pause
  S19: ({ t }) => {
    const gy = ground(0.6);
    // critic #8: a bigger grenade with a trail, landing on "grenade"; eyes wide; white on "knocked", black on "out"
    const land = loc("S19", w("14", 2)) + 6;
    const knock = loc("S19", lineEnd("14")); // W6: the blast in the pause after "out", not on "knocked"
    const out = knock + 6;
    const p = { ...at(0.42, 0.62, { yaw: 0.35, ...PIPE(t) }), ...faceAt(t, [[0, "cool"], [land - 2, "shock"]]) };
    const path = (k: number) => [kf(k, [[0, 1040], [land, 640]], (x) => x), kf(k, [[0, gy - 560], [land * 0.5, gy - 660], [land, gy - 20]])];
    const [gx, gyy] = path(t);
    return (
      <g>
        <g transform={cam(520, gy - 380, 1.15)}>
          <Outside kind="hill" id="s19" t={t + 160} img={IMG("a4-brac")} />
          <Actor look={JACK} pose={p} seed={1} gear={{ ...JACK_GEAR, pipes: t < land ? squeeze(t) : 0 }} />
          {[3, 6, 9].map((d) => {
            const [tx, ty] = path(Math.max(0, t - d));
            return t < land + 2 ? <circle key={d} cx={tx} cy={ty - 40} r={22 - d} fill="#EDE6D6" opacity={0.5 - d * 0.04} /> : null;
          })}
          <g transform={`translate(${gx} ${gyy}) rotate(${t < land ? t * 24 : land * 24}) scale(2)`}>
            <rect x={-8} y={-40} width={16} height={56} rx={4} fill="#6D5649" stroke={M.ink} strokeWidth={4} />
            <rect x={-20} y={-74} width={40} height={40} rx={8} fill="#4E5548" stroke={M.ink} strokeWidth={4} />
          </g>
        </g>
        <WhiteOut t={t} at={knock} black={out} />
      </g>
    );
  },
  // Berlin: the interrogation room
  S20: ({ t }) => {
    // critic #5: a different room (bookcases, tall window, no map); officer behind the desk, Churchill across it
    const ger = { ...at(0.64, 0.34, { yaw: -0.4, armL: { a: 40, b: -70 }, armR: { a: 40, b: -70 } }), ...faceAt(t, [[0, "neutral"]]) };
    const jack = { ...at(0.3, 0.74, { yaw: 0.65, tilt: kf(t, [[0, 6], [40, 3]]) }), ...faceAt(t, [[0, "tired"], [24, "cool"]]) };
    const top = ROOM.P(0.5, 0.66, 0.5);
    return (
      <g transform={cam(490, 760, 1.15)}>
        <Office id="s20" t={t + 200} layout="bureau" tone="grey">
          <Actor look={CAST.ger} pose={ger} seed={3} gear={{ hat: "ger" }} rim="rimL" />
        </Office>
        <g transform={`translate(${top.x} ${top.y - 20}) rotate(-6)`}>
          <rect x={-80} y={-50} width={160} height={100} rx={4} fill="#C9B48A" stroke={M.ink} strokeWidth={4} />
        </g>
        <SignPost x={680} y={460} text="BERLIN" w={260} f={t} at={4} rot={3} kind="paper" />
        <Actor look={JACK} pose={jack} seed={1} gear={{ hat: "brit", moustache: true }} />
      </g>
    );
  },
  // "because of his surname": the file, the one slow push of the video (≤ 5 % / 3 s, D3)
  S21: ({ t, len }) => {
    const z = interpolate(t, [0, len], [1, 1.04], CLAMP);
    const stamp = loc("S21", w("15", 11)) + 4;
    return (
      <g transform={`translate(500 760) scale(${z}) translate(-500 -760)`}>
        <rect x={0} y={0} width={1080} height={1920} fill="#5B4038" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M 0 ${300 + i * 260} Q 540 ${330 + i * 260} 1080 ${290 + i * 260}`} stroke="#4E362F" strokeWidth={6} fill="none" />)}
        <g transform="translate(500 760) rotate(-3)">
          <rect x={-360} y={-300} width={720} height={600} rx={10} fill="#C9B48A" stroke={M.ink} strokeWidth={6} />
          <rect x={-330} y={-270} width={660} height={540} fill={M.paper} stroke={M.ink} strokeWidth={4} />
          <rect x={-290} y={-230} width={170} height={210} fill="#B9A37C" stroke={M.ink} strokeWidth={4} />
          {[0, 1, 2].map((i) => <path key={i} d={`M -80 ${-200 + i * 60} L 280 ${-200 + i * 60}`} stroke="#8A7A62" strokeWidth={6} />)}
          <text x={0} y={112} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={88} fill={M.ink}>
            CHURCHILL
          </text>
          <g opacity={interpolate(t, [stamp, stamp + 3], [0, 1], CLAMP)} transform={`translate(0 120) scale(${interpolate(t, [stamp, stamp + 5], [1.3, 1], CLAMP)})`}>
            <rect x={-310} y={-110} width={620} height={150} rx={12} fill="none" stroke={M.accent} strokeWidth={12} />
          </g>
        </g>
      </g>
    );
  },
  // "related to Winston Churchill": the officer holds a drawn portrait up beside him
  S22: ({ t }) => {
    const jack = { ...at(0.34, 0.6, { yaw: 0.3 }), ...faceAt(t, [[0, "neutral"], [20, "smug"]]) };
    const ger = { ...at(0.7, 0.5, { yaw: -0.5, armL: { a: 120, b: -40 } }), ...faceAt(t, [[0, "smug"]]) };
    const h = handAt(ger, "L");
    const rise = interpolate(t, [0, 10], [120, 0], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 3 });
    return (
      <g transform={cam(500, jack.y - 120 * jack.scale, 1.6)}>
        <Office id="s22" t={t + 240} layout="bureau" tone="grey" desk={false} />
        <Actor look={CAST.ger} pose={ger} seed={3} gear={{ hat: "ger" }} rim="rimL" />
        <g transform={`translate(${h.x - 40} ${h.y - 140 + rise})`}>
          <rect x={-110} y={-130} width={220} height={260} rx={6} fill="#7A5A3A" stroke={M.ink} strokeWidth={6} />
          <rect x={-90} y={-110} width={180} height={220} fill="#D9CDB0" stroke={M.ink} strokeWidth={3} />
          <path d="M -60 110 Q -70 40 0 30 Q 70 40 60 110 Z" fill="#2B2F3A" />
          <circle cx={0} cy={-20} r={52} fill="#E8D6BE" stroke={M.ink} strokeWidth={4} />
          <path d="M -14 36 L 0 26 L 14 36 L 0 46 Z" fill={M.accent} />
          <path d="M 20 0 L 62 8" stroke="#5A3A2A" strokeWidth={9} strokeLinecap="round" />
          <path d="M -24 -30 l 12 0 M 12 -30 l 12 0 M -14 4 Q 0 12 14 4" stroke={M.ink} strokeWidth={4} fill="none" />
        </g>
        <Actor look={JACK} pose={jack} seed={1} gear={{ hat: "brit", moustache: true }} />
      </g>
    );
  },
  // "He wasn't.": a slow head shake
  S23: ({ t }) => {
    // critic #12: the shake is a turn of the head (yaw) left-right-left; a bust shot, the subtitle below the shoulders
    const p = { ...at(0.34, 0.6, { yaw: 0.1 + Math.sin(t * 0.55) * 0.5 * Math.exp(-t / 30) }), ...faceAt(t, [[0, "smug"]]) };
    const head = toWorld(p, joints(p).head);
    return (
      <g transform={cam(head.x, head.y + 115, 1.8)}>
        <Office id="s23" t={t + 280} layout="bureau" tone="grey" desk={false} />
        <Actor look={JACK} pose={p} seed={1} gear={{ hat: "brit", moustache: true }} still />
      </g>
    );
  },
  // Sachsenhausen: only the wire and the tower (C3: no prisoners drawn)
  S24: ({ t }) => (
    <g transform={cam(540, 820, 1.0)}>
      <Outside kind="fence" id="s24" t={t} img={IMG("a5-fence")} />
    </g>
  ),
  // the tunnel, in section: he crawls under the wire
  S25: ({ t, len }) => {
    const x = interpolate(t, [0, len], [140, 760], CLAMP);
    const crawl = Math.sin(t * 0.5);
    const p = { ...basePose, x, y: 1160, scale: 0.8, spin: 88, yaw: 0, armL: { a: 150 + crawl * 20, b: 10 }, armR: { a: 150 - crawl * 20, b: 10 }, legL: { a: 10 + crawl * 12, b: 0 }, legR: { a: -10 - crawl * 12, b: 0 }, ...faceAt(t, [[0, "worried"]]) };
    return (
      <g>
        <rect x={0} y={0} width={1080} height={760} fill="#141C30" />
        <rect x={0} y={760} width={1080} height={1160} fill="#5A4234" />
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 137) % 1080} cy={820 + ((i * 251) % 1000)} r={6 + (i % 4) * 3} fill="#4A3428" />)}
        <path d="M 0 1160 Q 300 1110 540 1150 Q 800 1190 1080 1140 L 1080 1290 Q 800 1330 540 1300 Q 300 1260 0 1310 Z" fill="#2A1E18" />
        {[420, 520, 620].map((fx) => <rect key={fx} x={fx} y={540} width={14} height={240} fill="#5A4E44" stroke={M.ink} strokeWidth={3} />)}
        {[0, 1, 2].map((i) => <path key={i} d={`M 380 ${600 + i * 50} L 680 ${600 + i * 50}`} stroke="#9A9A9E" strokeWidth={4} />)}
        <Actor look={JACK} pose={p} seed={1} gear={{ hat: "brit", moustache: true }} still />
      </g>
    );
  },
  // "they caught him again": he comes up into a torch beam
  S26: ({ t }) => {
    const up = interpolate(t, [0, 10], [140, 0], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 3 });
    const gy = ground(0.55);
    const jack = { ...at(0.36, 0.55, { yaw: 0.4, ...(t > 16 ? HANDS_UP : {}) }), ...faceAt(t, [[0, "neutral"], [8, "oops"]]) };
    const guard = { ...at(0.74, 0.5, { yaw: -0.6, armR: { a: 70, b: -20 } }), ...faceAt(t, [[0, "smug"]]) };
    const torch = handAt(guard, "R");
    return (
      <g transform={cam(520, gy - 340, 1.3)}>
        <Outside kind="fence" id="s26" t={t + 60} img={IMG("a5-fence")} />
        <g transform={`translate(0 ${up})`}>
          <Actor look={JACK} pose={{ ...jack, y: jack.y }} seed={1} gear={{ hat: "brit", moustache: true }} />
        </g>
        <rect x={-400} y={gy - 40} width={1880} height={900} fill="#2A3038" />
        <ellipse cx={jack.x} cy={gy - 34} rx={130} ry={28} fill="#14110E" />
        <Actor look={TROOPS.landser} pose={guard} seed={70} gear={{ hat: "stahl" }} rim="rimL" />
        <path d={`M ${torch.x} ${torch.y} L ${jack.x - 160} ${jack.y - 300} L ${jack.x + 120} ${jack.y + 40} Z`} fill="#FFF3C8" opacity={0.28} />
      </g>
    );
  },
  // "Videos online say…": a phone, a drawn clip of the story, the place + year on the clip
  S27: ({ t, len }) => {
    // critic #1: the clip shows the claim (a German soldier, an arrow on "killed"), and a red "?" marks it as a rumour
    const prog = interpolate(t, [0, len], [0, 1], CLAMP);
    const hit = loc("S27", w("20", 9)) + 2;
    const loose = hit - 8;
    const p = { ...basePose, x: 380, y: 1010, scale: 0.7, yaw: 1, armR: { a: 92, b: -2 }, armL: { a: -78, b: interpolate(t, [0, loose], [-60, -15], CLAMP) }, ...faceAt(t, [[0, "cool"]]) };
    const bh = handAt(p, "R");
    const fall = interpolate(t, [hit, hit + 10], [0, 1], { ...CLAMP, easing: (x) => x * x });
    const ger = { ...basePose, x: 720, y: 1010, scale: 0.7, yaw: -0.8, facing: -1 as const, spin: fall * 80, ...faceAt(t, [[0, "neutral"], [hit, "dizzy"]]) };
    const q = interpolate(t, [4, 8], [0, 1], CLAMP);
    return (
      <g>
        <rect x={0} y={0} width={1080} height={1920} fill="#2A2230" />
        <g transform={`rotate(${kf(t, [[0, -4], [len, -2]])} 540 820)`}>
          <rect x={230} y={300} width={620} height={1060} rx={60} fill="#151419" stroke={M.ink} strokeWidth={8} />
          <clipPath id="s27clip">
            <rect x={262} y={370} width={556} height={920} rx={24} />
          </clipPath>
          <g clipPath="url(#s27clip)">
            <rect x={262} y={370} width={556} height={920} fill="#8FA56A" />
            <rect x={262} y={370} width={556} height={420} fill="#B9C3C6" />
            <Actor look={TROOPS.landser} pose={ger} seed={71} gear={{ hat: "stahl" }} still rim="rimL" />
            <Actor look={JACK} pose={p} seed={1} gear={{ hat: "brit", moustache: true }} still />
            <Bow x={bh.x} y={bh.y} s={0.6} pull={t < loose ? interpolate(t, [0, loose], [10, 60], CLAMP) : 0} />
            {t >= loose && t < hit + 30 ? <Arrow x={interpolate(t, [loose, hit], [bh.x, 650], CLAMP)} y={bh.y - 10} deg={90} s={0.6} /> : null}
            <rect x={290} y={1240} width={500} height={10} rx={5} fill="#5A5A60" />
            <rect x={290} y={1240} width={500 * prog} height={10} rx={5} fill={M.accent} />
          </g>
          <SignPost x={540} y={500} text="FRANCE 1940" w={360} f={t} at={loc("S27", w("20", 5))} rot={-3} kind="paper" />
          <g transform={`translate(800 360) scale(${q}) rotate(12)`}>
            <circle r={78} fill={M.accent} stroke={M.ink} strokeWidth={6} />
            <text x={0} y={36} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={110} fill="#FFF3DC">
              ?
            </text>
          </g>
        </g>
      </g>
    );
  },
  // "a truck had crushed his bows": the lorry backs over the bow on the road; it snaps just after "crushed" (W6)
  S28: ({ t }) => {
    const gy = ground(0.55);
    const crush = loc("S28", lineEnd("21")) - 2; // W6: the snap lands in the pause after "bows"
    // critic #2: the lorry backs in from the start; its rear wheel (x − 414) reaches the bow (x 600) on "crushed"
    const lx = kf(t, [[0, 1500], [crush, 1014], [crush + 24, 940]]);
    const snap = t >= crush;
    const jack = { ...at(0.33, 0.66, { yaw: 0.6, armL: snap ? { a: 70, b: -30 } : basePose.armL }), ...faceAt(t, [[0, "neutral"], [crush - 12, "worried"], [crush + 2, "shock"]]) };
    const bow = (d: string, k = 0) => (
      <g transform={`rotate(${k})`}>
        <path d={d} stroke={M.ink} strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d={d} stroke="#A0703F" strokeWidth={16} fill="none" strokeLinecap="round" />
      </g>
    );
    return (
      <g transform={cam(560, gy - 260, 1.1)}>
        <Outside kind="road" id="s28" t={t + 80} img={IMG("a6-field")} />
        <g transform={`translate(600 ${gy + 20})`}>
          {snap ? (
            <>
              {bow("M -230 0 Q -110 -40 -14 -6", -10)}
              {bow("M 14 -6 Q 110 -40 230 0", 12)}
              <Sparkle x={0} y={-30} k={interpolate(t, [crush, crush + 8], [0.01, 1], CLAMP)} r={60} />
            </>
          ) : (
            bow("M -230 0 Q 0 -70 230 0")
          )}
        </g>
        <Lorry x={lx} y={gy + 40} s={0.9} />
        <Actor look={JACK} pose={jack} seed={1} gear={{ hat: "brit", moustache: true, scabbard: "full" }} />
      </g>
    );
  },
  // the close: back to the opening picture; the dates on the wall on "fifty", gone before the last frame (= frame 0)
  S29: ({ t, len }) => {
    const [cx, cy] = chest(JACK_AT);
    const on = loc("S29", w("22", 12));
    const off = len - 10;
    return (
      <g transform={cam(cx, cy - 40, 1.45)}>
        <Office id="s1" t={t + 40} layout="hq" tone="green" desk={false} />
        <Actor look={JACK} pose={{ ...JACK_AT, ...faceAt(t, [[0, "neutral"], [on, "smug"]]) }} seed={1} gear={HOOK_GEAR} />
        {t < off ? <SignPost x={cx} y={cy - 360} text="1945–1996" w={300} f={t} at={on} rot={-3} kind="paper" /> : null}
      </g>
    );
  },
};

/**
 * Camera (Lucas chose "c" on 2026-11-04 after cam-so-sanh.mp4): "a" = D3 as first approved (no moves), "c" = one slow eased pan on the
 * wide outdoor shots that open a new place, "b" = a slow push or pan on almost every shot (like the reference).
 * Moves are single, eased in-out, no overshoot, no shake (AGENTS short-form rule 2's allowed shape); scale 1.05 hides the edges.
 */
export type CamMode = "a" | "b" | "c";
const OPENERS = ["S7", "S10", "S15", "S24"];
const camMove = (mode: CamMode, seg: { id: string; len: number }, t: number) => {
  if (mode === "a" || seg.id === "S1" || seg.id === "S29" || seg.id === "S21") return "";
  if (mode === "c" && !OPENERS.includes(seg.id)) return "";
  const k = interpolate(t, [0, seg.len], [0, 1], { ...CLAMP, easing: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2) });
  const pan = OPENERS.includes(seg.id) || Number(seg.id.slice(1)) % 2 === 1;
  return pan ? `translate(500 760) scale(1.05) translate(${-500 + 36 - 72 * k} -760)` : `translate(500 760) scale(${1 + 0.04 * k}) translate(-500 -760)`;
};

const Picture: React.FC<{ camMode: CamMode }> = ({ camMode }) => {
  const f = useCurrentFrame();
  const seg = [...SHOTS].reverse().find((s) => f >= s.from) ?? SHOTS[0];
  const Shot = S[seg.id];
  return (
    <>
      <Base />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <KitDefs />
        <SetDefs />
        <g transform={camMove(camMode, seg, f - seg.from)}>
          <Shot t={f - seg.from} len={seg.len} />
        </g>
      </svg>
      <KaraokeSubs timing={timing} words={WORDS} Skin={HoatSuSub} oneLine maxWords={3} maxChars={18} />
    </>
  );
};

export const MChurchill: React.FC<{ safeGuide?: boolean; camMode?: CamMode }> = ({ safeGuide, camMode = "c" }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // the bed drops away before the grenade (its hit lands in a gap) and under the last line
  // a dip under lines 07–09 (bed 2.5 dB under the voice there) made the master's loudnorm push the voice peaks to −0.6 dBTP: left out
  // the bed steps back while the real bagpipes play (Norway, Brač) and before the grenade, and under the last line
  const pipes = (g: number) => (g >= shot("S7").from && g < shot("S9").from) || (g >= shot("S17").from && g < PIPES_END_AT());
  const duck = (g: number) => (g >= line("22").start * FPS - 6 ? 0.5 : g >= lineEnd("13") && g < line("15").start * FPS ? 0.3 : pipes(g) ? 0.4 : 1);
  return (
    <AbsoluteFill>
      <Freeze frame={0} active={f >= durationInFrames - 1}>
        <Picture camMode={camMode} />
      </Freeze>
      <Audio name="VO" src={staticFile("voiceover/m-churchill/vo.mp3")} />
      <MusicBed file={MUSIC} level={-23} duck={duck} />
      {/* W6: each hit lands in the pause after its word or with the action it shows, aligned by attack / peak */}
      <Sfx file="sfx/sword/metallic-sword-scrape-2799.mp3" at={shot("S2").from + 2} level={-24} align="onset" />
      <Sfx file="sfx/bagpipe/bagpipes-lone-piper-auld-lang-syne-237759.mp3" at={shot("S4").from} level={-31} seconds={shot("S4").len / FPS} />
      <Sfx file="sfx/amb-army/small-military-parade-marching-troops-630.mp3" at={shot("S5").from} level={-30} seconds={2.2} />
      <Sfx file="sfx/arrow/arrow-shot-through-air-2771.mp3" at={lineEnd("03") - 10} level={-28} align="onset" />
      <Sfx file="sfx/arrow/metal-arrow-hit-2769.mp3" at={lineEnd("03")} level={-22} align="onset" />
      <Sfx file="sfx/amb-sea/sea-waves-ambience-1189.mp3" at={shot("S7").from} level={-30} seconds={4.2} />
      <Sfx file="sfx/bagpipe/bagpipe-victory-28720.mp3" at={shot("S7").from} level={-30} seconds={(shot("S9").from - shot("S7").from) / FPS} />
      <Sfx file="sfx/pen/fast-writing-3196.mp3" at={w("07", 3) - 2} level={-24} align="onset" />
      <Sfx file="sfx/amb-wind/wind-in-the-top-of-the-mountain-1267.mp3" at={shot("S15").from} level={-30} seconds={11} />
      <Sfx file="sfx/explosion/bomb-explosion-in-battle-2800.mp3" at={shot("S16").from + loc("S16", w("11", 2))} level={-24} align="onset" seconds={1.8} />
      <Sfx file="sfx/bagpipe/bagpipes-lone-piper-auld-lang-syne-237759.mp3" at={shot("S17").from} level={-30} seconds={(PIPES_END_AT() - shot("S17").from) / FPS} />
      <Sfx file="sfx/explosion/short-explosion-1694.mp3" at={lineEnd("14")} level={-21} align="onset" />
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={shot("S21").from + loc("S21", w("15", 11)) + 4} level={-25} align="onset" />
      <Sfx file="sfx/pop/page-turn-single-1104.mp3" at={shot("S22").from + 2} level={-24} align="onset" />
      <Sfx file="sfx/vehicle/truck-driving-steady-1621.mp3" at={shot("S28").from} level={-32} seconds={(lineEnd("21") - shot("S28").from) / FPS + 0.4} />
      <Sfx file="sfx/wood/tree-branch-brake-2943.mp3" at={lineEnd("21") - 2} level={-21} align="onset" />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
