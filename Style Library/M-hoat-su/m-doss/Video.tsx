/**
 * Style M "Hoạt Sử" test 2 (format Hoat Su, 2026-11-04): ~63 s about Desmond Doss, the medic who refused to carry a gun
 * and was given the Medal of Honor. Script + checks: kich-ban-m-doss-FINAL.md · spec: 01_EPISODE-SPEC_m-doss.md ·
 * cuts: shots.json → shots.timeline.json, every cut on a spoken word. Composition `Style-M-HoatSu-Doss`.
 * Same frame as m-churchill/Video.tsx: camera C (one pan on wide outdoor shots that open a place), last frame = frame 0.
 * E3: the Japanese side is never drawn as people, only muzzle flashes and smoke on the ridge.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "../../../src/voiceover/m-doss.timing.json";
import WORDS from "../../../src/voiceover/m-doss.words.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import { kf } from "../../toon-engine/anim";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { stand } from "../../toon-engine/furnish";
import { basePose, faceAt, Hero, joints, type Look, type Pose, toWorld, walkFrom, walkPose } from "../../toon-engine/rig";
import { dofFor, Foreground, type FgKind, flashAlpha, GRADE, GradeWash, Lit, LookDefs, type SceneLight, ShotLook } from "../look";
import { alive, Base, Cap, HoatSuSub, Ledger, M, Office, OnChest, PinnedMap, ROOM, SignPost } from "../hoat-su";
import { CargoNet, DustPuff, SpeedLines, Specs, Gunfire, handAt, HeightMark, Litter, M1Helmet, MedicKit, Medals, Outside, Rifle, Rocks, Sparkle, TROOPS, vary } from "../ww2";
import SHOTS from "./shots.timeline.json";

const FPS = 30;
const MUSIC = "sfx/music/own/m-resolve.mp3"; // code-made (Lucas 2026-11-04: no Pixabay music, Content ID)
const END = 62.5; // 0.3 s after the last word (D6), as in shots.json "end"
export const mDossDuration = (fps: number) => Math.round(END * fps) + 1; // + the loop frame (= frame 0)
const IMG = (n: string) => `images/m-doss/${n}.jpg`;

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

const cam = (cx: number, cy: number, z: number) => `translate(500 760) scale(${z}) translate(${-cx} ${-cy})`;
const at = (u: number, w2: number, p: Partial<Pose> = {}): Pose => ({ ...basePose, ...stand(ROOM, u, w2), ...p });
const chest = (p: Pose) => [p.x, p.y - 70 * p.scale] as const;
const ground = (w2: number) => ROOM.P(0.5, 1, w2).y;

type Gear = { hat?: "m1" | "medic" | "officer"; medic?: boolean; honor?: number; bronze?: number; glint?: number; sling?: boolean; specs?: boolean };
/** A character with costume + gear; `seed` gives it its own blinks, glances, breathing (pose keys still win). */
const Actor: React.FC<{ look: Look; pose: Pose; seed: number; gear?: Gear; rim?: string; still?: boolean }> = ({ look, pose, seed, gear = {}, rim = "rimR", still }) => {
  const g = useCurrentFrame();
  const life = still ? {} : alive(g, seed);
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
    <Lit pose={p}>
      <Hero look={seed === 1 ? look : vary(look, seed)} pose={p} rimId={rim} />
      {gear.medic ? <MedicKit pose={p} /> : null}
      {gear.honor || gear.bronze ? <Medals pose={p} honor={gear.honor} bronze={gear.bronze} glint={gear.glint} /> : null}
      {gear.sling ? (
        <OnChest pose={p}>
          <path d="M -34 -116 L 30 -40 L -10 -36" stroke={M.ink} strokeWidth={22} fill="none" strokeLinejoin="round" />
          <path d="M -34 -116 L 30 -40 L -10 -36" stroke="#B8AC7E" strokeWidth={14} fill="none" strokeLinejoin="round" />
        </OnChest>
      ) : null}
      {gear.hat === "m1" || gear.hat === "medic" ? <M1Helmet pose={p} medic={gear.hat === "medic"} /> : null}
      {gear.hat === "officer" ? <Cap pose={p} kind="brit" /> : null}
      {gear.specs ? <Specs pose={p} /> : null}
    </Lit>
  );
};
const DOSS = TROOPS.gi;
/** Truman: clean-shaven, glasses (gear.specs); a set girth keeps vary() off him. */
const TRUMAN = { ...TROOPS.suitGrey, girth: 1.05 };
const DOSS_GEAR: Gear = { hat: "medic", medic: true };
/** Frame 0 / last frame: empty hands, the bag, the medal on its ribbon. */
const DOSS_AT = at(0.5, 0.6, { yaw: 0.1, armL: { a: 30, b: -14 }, armR: { a: 30, b: -14 }, handL: "open", handR: "open" });
const HOOK_GEAR: Gear = { ...DOSS_GEAR, honor: 1 };
/** Lying on the ground at (x, groundY): the rig turned on its side (head screen-right). */
const lying = (x: number, gy: number, s: number, p: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: gy - 40 * s, scale: s, spin: 90, yaw: 0.6, armL: { a: 20, b: -20 }, armR: { a: 30, b: -40 }, ...p });
/** A wounded man: eyes shut, pained (critic: X eyes / hollow eyes read as dead, against "brought back 75"). */
const HURT = { expr: "worried" as const, blink: 1 };
/** Port arms: the rifle held diagonally across the chest, bright wood, so "men with rifles" reads at once (critic #10). */
const PORT: Partial<Pose> = { armL: { a: -30, b: -80 }, armR: { a: 40, b: -110 } };
const PortArms: React.FC<{ p: Pose }> = ({ p }) => {
  const [cx, cy] = chest(p);
  return <Rifle x={cx - 50 * p.scale} y={cy + 70 * p.scale} deg={32} s={p.scale * 1.3} wood="#B5844E" />;
};
/** A US flag on a wall (drawn, simplified). */
const Flag: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={0} y={i * 20} width={220} height={10} fill="#B23A36" />)}
    <rect x={0} y={0} width={220} height={130} fill="none" stroke={M.ink} strokeWidth={4} />
    <rect x={0} y={0} width={92} height={70} fill="#2F4A86" />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={12 + (i % 4) * 22} cy={12 + Math.floor(i / 4) * 22} r={4} fill="#F4F1E8" />)}
  </g>
);

type ShotFC = React.FC<{ t: number; len: number }>;
const S: Record<string, ShotFC> = {
  // HOOK: the paradox in one picture (rifles on both sides of him; his hands empty; the medal); frame 0 = the last frame
  S1: ({ t }) => {
    const [cx, cy] = chest(DOSS_AT);
    const l = at(0.3, 0.5, { yaw: 0.3, ...PORT });
    const r = at(0.7, 0.5, { yaw: -0.3, ...PORT });
    return (
      <g transform={cam(cx, cy - 110, 1.6)}>
        <Office id="d1" t={t + 40} layout="hq" tone="green" desk={false} />
        <Actor look={TROOPS.gi} pose={l} seed={11} gear={{ hat: "m1" }} />
        <PortArms p={l} />
        <Actor look={TROOPS.gi} pose={r} seed={12} gear={{ hat: "m1" }} rim="rimL" />
        <PortArms p={r} />
        <Actor look={DOSS} pose={{ ...DOSS_AT, ...faceAt(t + 30, [[0, "neutral"]]) }} seed={1} gear={HOOK_GEAR} />
      </g>
    );
  },
  // "gun": a rifle is pushed at him, his palm comes up, it goes back
  S2: ({ t }) => {
    const p = { ...DOSS_AT, armR: { a: kf(t, [[0, 30], [8, 96]]), b: kf(t, [[0, -14], [8, -12]]) }, handR: "open" as const, yaw: 0.35, ...faceAt(t, [[0, "neutral"]]) };
    const [cx, cy] = chest(p);
    const rx = kf(t, [[0, 1250], [8, cx + 300], [24, cx + 300], [40, 1300]]);
    return (
      <g transform={cam(cx + 80, cy - 80, 2.0)}>
        <Office id="d2" t={t + 80} layout="hq" tone="green" desk={false} veil={0.3} />
        <Actor look={DOSS} pose={p} seed={1} gear={DOSS_GEAR} />
        <path d={`M 1300 ${cy + 80} L ${rx + 60} ${cy - 10}`} stroke={M.ink} strokeWidth={60} strokeLinecap="round" />
        <path d={`M 1300 ${cy + 80} L ${rx + 60} ${cy - 10}`} stroke="#77714A" strokeWidth={50} strokeLinecap="round" />
        <Rifle x={rx + 40} y={cy + 40} deg={-38} s={p.scale * 1.3} wood="#B5844E" />
      </g>
    );
  },
  S3: ({ t }) => {
    const [cx, cy] = chest(DOSS_AT);
    return (
      <g transform={cam(cx, cy - 150, 2.2)}>
        <Office id="d3" t={t + 120} layout="hq" tone="green" desk={false} veil={0.3} />
        <Actor look={DOSS} pose={{ ...DOSS_AT, ...faceAt(t, [[0, "neutral"]]) }} seed={1} gear={{ ...HOOK_GEAR, glint: interpolate(t, [2, 16], [0.01, 1], CLAMP) }} />
      </g>
    );
  },
  // 1942: the draft desk, the deferment paper slid across to him
  S4: ({ t }) => {
    const off = at(0.6, 0.34, { yaw: -0.4, armR: { a: 20 + Math.sin(t / 3) * 8, b: -60 + Math.sin(t / 2) * 10 }, headTilt: Math.sin(t / 11) * 6 });
    const doss = at(0.3, 0.72, { yaw: 0.6, tilt: kf(t, [[0, 0], [30, 5], [60, 2]]), headTilt: kf(t, [[0, 0], [24, 8], [60, 3]]), ...faceAt(t, [[0, "neutral"]]) });
    const top = ROOM.P(0.46, 0.66, 0.5);
    const slide = interpolate(t, [4, 18], [120, 0], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 3 });
    return (
      <g transform={cam(480, 760, 1.2)}>
        <Office id="d4" t={t + 160} layout="embassy" tone="warm">
          <Actor look={TROOPS.gi} pose={off} seed={13} gear={{ hat: "officer" }} rim="rimL" />
        </Office>
        <g transform={`translate(${top.x + slide} ${top.y - 22}) rotate(-6)`}>
          <rect x={-60} y={-40} width={120} height={80} rx={4} fill={M.paper} stroke={M.ink} strokeWidth={4} />
          <path d="M -44 -18 l 80 0 M -44 0 l 64 0 M -44 18 l 72 0" stroke="#8A7A62" strokeWidth={5} />
        </g>
        <SignPost x={660} y={470} text="1942" w={200} f={t} at={4} rot={3} />
        <Actor look={TROOPS.gi} pose={doss} seed={1} />
      </g>
    );
  },
  // "He said no.": a head shake and the paper pushed back
  S5: ({ t }) => {
    const p = { ...at(0.4, 0.62, { yaw: 0.1 + Math.sin(t * 0.55) * 0.45 * Math.exp(-t / 26), armR: { a: kf(t, [[0, 10], [8, 60]]), b: kf(t, [[0, -10], [8, -40]]) } }), ...faceAt(t, [[0, "neutral"]]) };
    const head = toWorld(p, joints(p).head);
    const h = handAt(p, "R");
    return (
      <g transform={cam(head.x + 60, head.y + 130, 2.0)}>
        <Office id="d5" t={t + 200} layout="embassy" tone="warm" desk={false} />
        <Actor look={TROOPS.gi} pose={p} seed={1} still />
        <g transform={`translate(${h.x + 30 + kf(t, [[8, 0], [24, 160]])} ${h.y}) rotate(-8)`}>
          <rect x={-60} y={-40} width={120} height={80} rx={4} fill={M.paper} stroke={M.ink} strokeWidth={4} />
        </g>
      </g>
    );
  },
  // "his faith said he must never kill": reading a small book by the lamp at night
  S6: ({ t }) => {
    const p = { ...at(0.48, 0.6, { yaw: 0.25, armL: { a: -8, b: -112 }, armR: { a: 26, b: -118 }, headTilt: 10 + Math.sin(t / 16) * 3 }), ...faceAt(t, [[0, "neutral"], [30, "tired"]]) };
    const h = handAt(p, "R");
    const turn = Math.floor(t / 26) % 2;
    return (
      <g transform={cam(p.x, p.y - 140 * p.scale, 1.8)}>
        <Office id="d6" t={t + 240} layout="lodging" tone="green" window="night" desk={false} />
        <Actor look={TROOPS.gi} pose={p} seed={1} />
        <g transform={`translate(${h.x - 30} ${h.y - 30}) rotate(-12)`}>
          <rect x={-46} y={-34} width={92} height={68} rx={4} fill="#3A2E3A" stroke={M.ink} strokeWidth={4} />
          <rect x={turn ? -40 : 2} y={-30} width={38} height={60} fill="#EDE3CC" />
        </g>
      </g>
    );
  },
  // "no rifle, only a medic's bag": the column passes with rifles; he shoulders the bag
  S7: ({ t }) => {
    const doss = { ...at(0.5, 0.66, { yaw: 0.2, armR: { a: kf(t, [[0, 10], [10, -20], [24, 10]]), b: kf(t, [[0, -10], [10, -100], [24, -10]]) } }), ...faceAt(t, [[0, "neutral"]]) };
    const gy = ground(0.36);
    return (
      <g transform={cam(500, 790, 1.3)}>
        <Office id="d7" t={t + 280} layout="hq" tone="green" desk={false} />
        {[0, 1, 2].map((i) => {
          const q = walkFrom(1100 + i * 220, t + i * 3, gy, stand(ROOM, 0.5, 0.36).scale, { yaw: -0.8 }, -1, 11);
          const h = handAt(q, "R");
          return (
            <g key={i}>
              <Actor look={TROOPS.gi} pose={q} seed={20 + i} gear={{ hat: "m1" }} still />
              <Rifle x={h.x} y={h.y + 40 * q.scale} deg={-24} s={q.scale * 1.2} />
            </g>
          );
        })}
        <Actor look={DOSS} pose={doss} seed={1} gear={DOSS_GEAR} />
      </g>
    );
  },
  // Guam 1944 (camera C pan): he runs in under the smoke
  S8: ({ t }) => {
    const gy = ground(0.55);
    // a hurried run across the frame: x follows the steps (N6), speed lines behind (N7)
    const p = { ...walkFrom(160, t, gy, stand(ROOM, 0.5, 0.55).scale, { yaw: 0.8 }, 1, 16), ...faceAt(t, [[0, "worried"]]) };
    p.tilt += 10;
    return (
      <g transform={cam(520, gy - 310, 1.3)}>
        <Outside kind="jungle" id="d8" t={t} img={IMG("b1-jungle")} />
        <Gunfire t={t} points={[[880, gy - 420], [960, gy - 360], [180, gy - 440]]} />
        <SpeedLines x={p.x} y={p.y - 60 * p.scale} dir={1} t={t} s={p.scale} />
        <Actor look={DOSS} pose={p} seed={1} gear={DOSS_GEAR} still />
        <SignPost x={520} y={gy - 660} text="GUAM 1944" w={320} f={t} at={4} rot={-3} />
      </g>
    );
  },
  // "he ran to the wounded": kneeling over a man, bandaging
  S9: ({ t }) => {
    const gy = ground(0.6);
    const sc = stand(ROOM, 0.5, 0.6).scale;
    const wrap = Math.sin(t * 0.7) * 1.6;
    const doss = { ...at(0.36, 0.6, { yaw: 0.6, squash: 0.22, tilt: 16, armL: { a: -40 + wrap * 14, b: -40 }, armR: { a: 50 - wrap * 14, b: -60 } }), ...faceAt(t, [[0, "worried"]]) };
    return (
      <g transform={cam(520, gy - 300, 1.3)}>
        <Outside kind="jungle" id="d9" t={t + 40} img={IMG("b1-jungle")} />
        <Gunfire t={t + 20} points={[[900, gy - 480], [200, gy - 520]]} />
        <Actor look={TROOPS.gi} pose={lying(640, gy, sc, HURT)} seed={31} gear={{ hat: "m1" }} still />
        <Actor look={DOSS} pose={doss} seed={1} gear={DOSS_GEAR} />
      </g>
    );
  },
  // "two Bronze Stars": pinned one, then two, on the words
  S10: ({ t }) => {
    const pin1 = loc("S10", w("07", 5)) + 2;
    const pin2 = loc("S10", w("07", 6)) + 2;
    const off = { ...at(0.66, 0.56, { yaw: -0.5, armL: { a: kf(t, [[0, 20], [pin1 - 4, 70], [pin2 + 6, 70], [pin2 + 16, 20]]), b: -10 } }), ...faceAt(t, [[0, "smug"]]) };
    const doss = { ...at(0.36, 0.58, { yaw: 0.5 }), ...faceAt(t, [[0, "neutral"], [pin2 + 4, "happy"]]) };
    const n = (t >= pin1 ? 1 : 0) + (t >= pin2 ? 1 : 0);
    const [cx, cy] = chest(doss);
    return (
      <g transform={cam(cx + 120, cy - 60, 1.7)}>
        <Office id="d10" t={t + 320} layout="hq" tone="grey" desk={false} />
        <Actor look={TROOPS.gi} pose={off} seed={14} gear={{ hat: "officer" }} rim="rimL" />
        <Actor look={DOSS} pose={doss} seed={1} gear={{ ...DOSS_GEAR, bronze: n }} />
      </g>
    );
  },
  // Okinawa 1945: the pinned map; the red line up to the escarpment (the one slow push)
  S11: ({ t, len }) => {
    const z = interpolate(t, [0, len], [1, 1.04], CLAMP);
    return (
      <g transform={`translate(500 800) scale(${z}) translate(-500 -800)`}>
        <PinnedMap
          f={t}
          arrowAt={6}
          arrowLen={30}
          route="M 330 1060 Q 420 980 520 900"
          land={[
            // Okinawa, drawn by hand (ƯỚC): a long island running north-east, the southern end where the line goes
            "M 700 440 Q 760 470 740 540 Q 700 620 640 700 Q 600 760 600 820 Q 610 880 560 940 Q 500 1000 430 1020 Q 380 1030 400 980 Q 460 930 470 880 Q 480 800 540 730 Q 600 640 640 560 Q 670 480 700 440 Z",
          ]}
          labels={[]}
        />
        <g transform="rotate(-1.5 500 800)">
          <circle cx={520} cy={900} r={24 + 8 * Math.sin(t / 4)} fill="none" stroke={M.accent} strokeWidth={8} opacity={interpolate(t, [34, 40], [0, 1], CLAMP)} />
        </g>
        <SignPost x={500} y={500} text="OKINAWA 1945" w={420} f={t} at={2} rot={-3} kind="paper" />
      </g>
    );
  },
  // the cliff (camera C pan): nets down the rock, men climbing
  S12: ({ t, len }) => {
    const climbers = [0, 1, 2, 3].map((i) => {
      const k = interpolate(t, [0, len], [0, 0.35], CLAMP);
      const y = 1300 - (i % 2) * 260 - k * 500;
      return { ...basePose, x: i < 2 ? 330 : 620, y, scale: 0.68, yaw: 0, armL: { a: 160 + Math.sin(t / 5 + i) * 14, b: 10 }, armR: { a: 160 - Math.sin(t / 5 + i) * 14, b: 10 }, legL: { a: 12, b: -30 }, legR: { a: -12, b: -10 } };
    });
    return (
      <g>
        <Outside kind="cliff" id="d12" t={t} img={IMG("b3-cliff")} />
        <CargoNet x={330} y0={300} y1={1460} />
        <CargoNet x={620} y0={300} y1={1460} />
        {climbers.map((p, i) => <Actor key={i} look={TROOPS.gi} pose={p} seed={40 + i} gear={{ hat: i === 3 ? "medic" : "m1", medic: i === 3 }} still />)}
        <SignPost x={530} y={420} text="HACKSAW RIDGE" w={460} f={t} at={loc("S12", w("09", 8)) - 4} rot={-2} />
      </g>
    );
  },
  // "four hundred feet": the same plate as S12 (critic #8); the height mark draws up the rock on the number
  S13: ({ t }) => {
    const k = interpolate(t, [2, loc("S13", w("10", 4))], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 2 });
    const t0 = t + shot("S12").len;
    const climbers = [0, 1, 2, 3].map((i) => {
      const y = 1300 - (i % 2) * 260 - (0.35 + t / 300) * 500;
      return { ...basePose, x: i < 2 ? 330 : 620, y, scale: 0.68, yaw: 0, armL: { a: 160 + Math.sin(t0 / 5 + i) * 14, b: 10 }, armR: { a: 160 - Math.sin(t0 / 5 + i) * 14, b: 10 }, legL: { a: 12, b: -30 }, legR: { a: -12, b: -10 } };
    });
    return (
      <g>
        <Outside kind="cliff" id="d12" t={t0} img={IMG("b3-cliff")} />
        <CargoNet x={330} y0={300} y1={1460} />
        <CargoNet x={620} y0={300} y1={1460} />
        {climbers.map((p, i) => <Actor key={i} look={TROOPS.gi} pose={p} seed={40 + i} gear={{ hat: i === 3 ? "medic" : "m1", medic: i === 3 }} still />)}
        <SignPost x={500} y={420} text="HACKSAW RIDGE" w={460} f={t + 99} at={0} rot={-2} />
        <HeightMark x={790} y0={560} y1={1420} label="400 FT" k={k} />
      </g>
    );
  },
  // "Japanese troops hit back hard": flashes along the far rocks (no figures, E3); the men go down behind cover
  S14: ({ t }) => {
    const gy = ground(0.5);
    const fire = loc("S14", w("11", 4)) - 2;
    const hit = loc("S14", w("11", 5));
    const down = (i: number) => interpolate(t, [hit + i * 5, hit + 8 + i * 5], [0, 1], CLAMP);
    return (
      <g transform={cam(520, gy - 300, 1.25)}>
        <Outside kind="ridge" id="d14" t={t} img={IMG("b2-ridge-top")} />
        <g transform={`translate(800 ${gy - 340}) scale(1.8) translate(-800 ${-(gy - 340)})`}>
          <Gunfire t={t} on={t >= fire} points={[[640, gy - 330], [760, gy - 350], [860, gy - 320], [950, gy - 345]]} />
        </g>
        <clipPath id="d14low">
          <rect x={-400} y={-400} width={1880} height={gy + 410} />
        </clipPath>
        <g clipPath="url(#d14low)">
          {[0.26, 0.44, 0.62].map((u, i) => (
            <Actor key={i} look={TROOPS.gi} pose={{ ...at(u, 0.5, { yaw: 0.6, tilt: 10 + down(i) * 60 }), y: at(u, 0.5).y + down(i) * 150, ...faceAt(t, [[0, "worried"]]), blink: t > hit + i * 5 ? 1 : 0 }} seed={50 + i} gear={{ hat: "m1" }} still={t > hit + i * 5} />
          ))}
        </g>
        <Rocks x={300} y={gy + 40} s={1.3} seed={3} />
        <Rocks x={720} y={gy + 50} s={1.1} seed={5} />
        {[0.26, 0.44, 0.62].map((u, i) => <DustPuff key={i} t={t} at={hit + i * 5 + 8} x={at(u, 0.5).x} y={gy + 20} s={0.8} />)}
      </g>
    );
  },
  // "about seventy-five went down, and the rest pulled back": men run back to the nets; the wounded stay; 75 on the word
  S15: ({ t }) => {
    const gy = ground(0.55);
    const sc = stand(ROOM, 0.5, 0.55).scale;
    return (
      <g transform={cam(520, gy - 300, 1.25)}>
        <Outside kind="ridge" id="d15" t={t + 60} img={IMG("b2-ridge-top")} />
        <Gunfire t={t} points={[[700, gy - 360], [900, gy - 330]]} />
        {[[310, 0.85], [520, 1], [730, 0.9]].map(([x, s], i) => <Actor key={i} look={TROOPS.gi} pose={lying(x, gy + 40 + i * 30, sc * s, HURT)} seed={60 + i} gear={{ hat: "m1" }} still />)}
        {[0, 1].map((i) => {
          return <Actor key={i} look={TROOPS.gi} pose={walkFrom(700 + i * 120, t + i * 4, gy - 60, sc * 0.8, { yaw: -0.8 }, -1, 7)} seed={70 + i} gear={{ hat: "m1" }} still />;
        })}
        <Ledger x={720} y={gy - 560} value="75" f={t} at={loc("S15", w("12", 1)) - 2} s={0.8} pop />
      </g>
    );
  },
  // "He stayed.": kneeling alone on the top, looking round
  S16: ({ t }) => {
    const p = { ...at(0.46, 0.6, { yaw: kf(t, [[0, -0.6], [18, 0.5]]), squash: 0.2 }), ...faceAt(t, [[0, "worried"], [16, "neutral"]]) };
    const head = toWorld(p, joints(p).head);
    return (
      <g transform={cam(head.x, head.y + 190, 1.6)}>
        <Outside kind="ridge" id="d16" t={t + 90} img={IMG("b2-ridge-top")} />
        {[[p.x - 150, 0.6], [p.x + 150, 0.62]].map(([x, s], i) => <Actor key={i} look={TROOPS.gi} pose={lying(x, p.y + 140 * p.scale, p.scale * s, HURT)} seed={64 + i} gear={{ hat: "m1" }} still />)}
        <Actor look={DOSS} pose={p} seed={1} gear={DOSS_GEAR} />
      </g>
    );
  },
  // "one by one… lowered them down on a rope" (critic #4): closer; a clear cliff lip, Doss braced on top hauling the rope, the litter going down past the edge
  S17: ({ t, len }) => {
    const lip = 760;
    const y = interpolate(t, [0, len], [lip + 140, 1280], CLAMP);
    const pull = Math.sin(t / 4);
    const doss = { ...basePose, x: 620, y: lip - 128 * 0.8, scale: 0.8, yaw: -0.6, tilt: 18, armL: { a: -60 + pull * 16, b: -30 }, armR: { a: -40 - pull * 16, b: -40 }, legL: { a: 24, b: 0 }, legR: { a: -6, b: 0 }, ...faceAt(t, [[0, "worried"]]) };
    const hand = handAt(doss, "L");
    return (
      <g>
        <Outside kind="cliff" id="d17" t={t + 80} img={IMG("b3-cliff")} />
        {/* the lip: the top of the escarpment in silhouette, the drop on the left */}
        <path d={`M 300 ${lip} Q 700 ${lip - 30} 1480 ${lip - 20} L 1480 ${lip + 90} Q 700 ${lip + 70} 320 ${lip + 90} Z`} fill="#7E7462" stroke={M.ink} strokeWidth={6} />
        <path d={`M ${hand.x} ${hand.y} L 300 ${lip} L 240 ${y - 80}`} stroke="#E0CDA0" strokeWidth={7} fill="none" />
        <Litter x={240} y={y} s={1.1} rope={[240, y - 80]} />
        <Actor look={TROOPS.gi} pose={lying(240, y - 10, 0.6, HURT)} seed={61} gear={{ hat: "m1" }} still />
        <Actor look={DOSS} pose={doss} seed={1} gear={DOSS_GEAR} still />
      </g>
    );
  },
  // "Weeks later, a grenade tore into his legs": night; it lands, a white flash just after "grenade", then he is down
  S18: ({ t }) => {
    const gy = ground(0.6);
    const sc = stand(ROOM, 0.5, 0.6).scale;
    const land = loc("S18", w("15", 3)) + 2;
    const blast = loc("S18", w("15", 4)) - 4;
    const gx = kf(t, [[0, 1000], [land, 620]], (x) => x);
    const gyy = kf(t, [[0, gy - 520], [land * 0.5, gy - 620], [land, gy - 20]]);
    const fall = interpolate(t, [blast + 2, blast + 10], [0, 1], { ...CLAMP, easing: (x) => x * x });
    const down = fall >= 1;
    return (
      <g>
        <g transform={cam(520, gy - 300, 1.3)}>
          <Outside kind="night" id="d18" t={t} img={IMG("b4-night-field")} />
          {down ? (
            <Actor look={DOSS} pose={lying(470, gy + 20, sc, { ...faceAt(t, [[0, "shock"], [blast + 20, "worried"]]), armL: { a: 120, b: -60 } })} seed={1} gear={DOSS_GEAR} still />
          ) : (
            <Actor look={DOSS} pose={{ ...at(0.42, 0.6, { yaw: 0.6, squash: 0.2, tilt: 14 + fall * 70 }), ...faceAt(t, [[0, "worried"], [land - 4, "shock"]]) }} seed={1} gear={DOSS_GEAR} />
          )}
          {t >= blast ? null : (
            <g transform={`translate(${gx} ${gyy}) rotate(${t < land ? t * 24 : land * 24}) scale(1.8)`}>
              <ellipse cx={0} cy={0} rx={16} ry={20} fill="#3E4232" stroke="#D8D0B4" strokeWidth={4} />
              <path d="M -6 -20 L 6 -20 L 6 -28 L -6 -28 Z" fill="#6A6A60" stroke={M.ink} strokeWidth={3} />
            </g>
          )}
        </g>
        <g transform={cam(520, gy - 300, 1.3)}>
          <DustPuff t={t} at={blast + 10} x={470} y={gy + 40} s={1.1} color="#5A4A3A" />
        </g>
        <rect x={0} y={0} width={1080} height={1920} fill="#FFFBEE" opacity={interpolate(t, [blast, blast + 2, blast + 14], [0, 0.95, 0], CLAMP)} />
      </g>
    );
  },
  // "On the stretcher, he saw another wounded man" (critic #5): bearers at the two ends, him clearly on it (red-cross helmet), the other man ahead
  S19: ({ t, len }) => {
    const gy = ground(0.55);
    const sc = stand(ROOM, 0.5, 0.55).scale;
    const x = interpolate(t, [0, len], [480, 520], CLAMP);
    // the bearers' steps carry the litter: x follows their phase (N6)
    const b1 = walkPose(x - 200, ((x - 400) / (128 * sc * 0.9)) * Math.PI, gy, sc * 0.9, { yaw: 0.8, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 } });
    const b2 = walkPose(x + 200, ((x - 400) / (128 * sc * 0.9)) * Math.PI + 2, gy, sc * 0.9, { yaw: 0.8, armL: { a: -40, b: 20 }, armR: { a: -40, b: 20 } });
    const ly = handAt(b1, "R").y;
    return (
      <g transform={cam(520, gy - 280, 1.3)}>
        <Outside kind="night" id="d19" t={t + 60} img={IMG("b4-night-field")} />
        <Actor look={TROOPS.gi} pose={lying(760, gy + 40, sc * 0.8, HURT)} seed={62} gear={{ hat: "m1" }} still />
        <Actor look={TROOPS.gi} pose={b1} seed={90} gear={{ hat: "m1" }} still />
        <Actor look={TROOPS.gi} pose={b2} seed={91} gear={{ hat: "m1" }} still />
        <Litter x={x} y={ly} s={sc * 1.1} />
        <Actor look={DOSS} pose={lying(x, ly - 14, sc * 0.8, { ...faceAt(t, [[0, "worried"]]), look: 1, headTilt: kf(t, [[0, 0], [20, 14]]) })} seed={1} gear={DOSS_GEAR} still />
      </g>
    );
  },
  // "So he crawled off and gave him his place": the litter set down, he rolls off, a big point at the other man; the bearers turn to him
  S20: ({ t }) => {
    const gy = ground(0.55);
    const sc = stand(ROOM, 0.5, 0.55).scale;
    const roll = interpolate(t, [4, 22], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 2 });
    const bend = interpolate(t, [26, 44], [0, 1], CLAMP);
    return (
      <g transform={cam(520, gy - 280, 1.3)}>
        <Outside kind="night" id="d20" t={t + 100} img={IMG("b4-night-field")} />
        <Litter x={430} y={gy + 10} s={sc * 1.1} />
        <Actor look={TROOPS.gi} pose={lying(660, gy + 40, sc * 0.8, HURT)} seed={62} gear={{ hat: "m1" }} still />
        {[520, 770].map((x, i) => <Actor key={i} look={TROOPS.gi} pose={at(0.5, 0.55, { x, yaw: i ? -0.6 : 0.6, tilt: (i ? -1 : 1) * bend * 30 })} seed={90 + i} gear={{ hat: "m1" }} />)}
        <Actor look={DOSS} pose={lying(430 - roll * 120, gy + 10 + roll * 40, sc * 0.85, { ...faceAt(t, [[0, "worried"], [22, "neutral"]]), spin: 90 - roll * 30, armR: { a: kf(t, [[16, 30], [26, 128]]), b: kf(t, [[16, -20], [26, 0]]) } })} seed={1} gear={DOSS_GEAR} still />
      </g>
    );
  },
  // "Then he was hit again, and his arm broke": a flash at the arm, then the sling
  S21: ({ t }) => {
    const gy = ground(0.6);
    const sc = stand(ROOM, 0.5, 0.6).scale;
    const hit = loc("S21", w("18", 4)) - 4; // W6: in the gap after "hit", before "again"
    const hurt = t >= hit;
    const p = lying(500, gy + 20, sc, { yaw: 0.5, spin: kf(t, [[0, 70], [hit, 70], [hit + 20, 52], [hit + 50, 60]]), armR: hurt ? { a: -10, b: -120 } : { a: 60, b: -20 }, armL: { a: kf(t, [[hit, 20], [hit + 20, 70]]), b: -30 }, ...faceAt(t, [[0, "worried"], [hit, "shock"], [hit + 24, "worried"]]) });
    const arm = handAt(p, "R");
    return (
      <g transform={cam(520, gy - 260, 1.4)}>
        <Outside kind="night" id="d21" t={t + 140} img={IMG("b4-night-field")} />
        <Actor look={DOSS} pose={p} seed={1} gear={{ ...DOSS_GEAR, sling: hurt }} still />
        <Sparkle x={arm.x} y={arm.y} k={interpolate(t, [hit, hit + 10], [0.01, 1], CLAMP)} r={70} />
      </g>
    );
  },
  // "He crawled three hundred yards to get help": a long crawl over the mud toward the aid tent, a track behind him
  S22: ({ t, len }) => {
    const gy = ground(0.6);
    const sc = stand(ROOM, 0.5, 0.6).scale * 0.8;
    const x = interpolate(t, [0, len], [260, 640], CLAMP);
    const c = Math.sin(t * 0.5);
    return (
      <g transform={cam(520, gy - 240, 1.3)}>
        <Outside kind="night" id="d22" t={t + 180} img={IMG("b4-night-field")} />
        <path d={`M 40 ${gy + 40} L ${x - 60} ${gy + 30}`} stroke="#241C16" strokeWidth={30} strokeLinecap="round" opacity={0.7} />
        <g transform={`translate(880 ${gy - 140}) scale(0.5)`}>
          <path d="M -120 0 L 0 -150 L 120 0 Z" fill="#6A6440" stroke={M.ink} strokeWidth={6} />
          <circle cx={0} cy={-60} r={22} fill="#F4F1E8" />
          <path d="M -5 -75 L 5 -75 L 5 -65 L 15 -65 L 15 -55 L 5 -55 L 5 -45 L -5 -45 L -5 -55 L -15 -55 L -15 -65 L -5 -65 Z" fill="#C7302C" />
        </g>
        <Actor look={DOSS} pose={lying(x, gy + 10, sc, { spin: 84, armL: { a: 150 + c * 20, b: 10 }, legL: { a: 10 + c * 12, b: 0 }, legR: { a: -10 - c * 12, b: 0 }, ...faceAt(t, [[0, "worried"]]) })} seed={1} gear={{ ...DOSS_GEAR, sling: true }} still />
      </g>
    );
  },
  // "So did the army ever make him carry a gun? No.": a rifle stands beside him, untouched; on "No." the head shake
  S23: ({ t }) => {
    const no = loc("S23", line("21").start * FPS);
    const p = { ...at(0.42, 0.6, { yaw: t >= no ? 0.1 + Math.sin((t - no) * 0.6) * 0.6 * Math.exp(-(t - no) / 28) : kf(t, [[0, 0.1], [20, 0.7]]), look: t < no ? kf(t, [[0, 0], [20, 1]]) : 0 }), ...faceAt(t, [[0, "neutral"]]) };
    const head = toWorld(p, joints(p).head);
    return (
      <g transform={cam(head.x + 80, head.y + 120, 1.7)}>
        <Office id="d23" t={t + 360} layout="hq" tone="green" desk={false} />
        <Rifle x={head.x + 230} y={p.y + 150 * p.scale} deg={6} s={p.scale * 1.3} />
        <Actor look={DOSS} pose={p} seed={1} gear={{ ...DOSS_GEAR, bronze: 2 }} still={t >= no} />
      </g>
    );
  },
  // "That October, President Truman put the Medal of Honor around his neck"
  S24: ({ t }) => {
    const put = loc("S24", w("22", 8));
    const tr = { ...at(0.64, 0.56, { yaw: -0.5, armL: { a: kf(t, [[0, 20], [put - 10, 100], [put + 6, 100], [put + 18, 20]]), b: kf(t, [[0, -10], [put - 10, -30], [put + 18, -10]]) }, armR: { a: 12, b: -12 } }), ...faceAt(t, [[0, "neutral"], [put, "happy"]]) };
    const doss = { ...at(0.38, 0.6, { yaw: 0.5 }), ...faceAt(t, [[0, "neutral"], [put + 6, "happy"]]) };
    const [cx, cy] = chest(doss);
    return (
      <g transform={cam(cx + 130, cy - 80, 1.55)}>
        <Office id="d24" t={t + 400} layout="bureau" tone="warm" desk={false} />
        <Flag x={460} y={430} s={0.9} />
        <SignPost x={cx + 130} y={cy - 320} text="OCTOBER 1945" w={420} f={t} at={4} rot={-3} kind="paper" />
        <Actor look={TRUMAN} pose={tr} seed={15} rim="rimL" gear={{ specs: true }} />
        <Actor look={DOSS} pose={doss} seed={1} gear={{ medic: true, bronze: 2, honor: t >= put ? 1 : 0 }} />
      </g>
    );
  },
  // "the first conscientious objector ever to receive it": the medal catches the light
  S25: ({ t }) => {
    const doss = { ...at(0.38, 0.6, { yaw: 0.3, armR: { a: kf(t, [[10, 14], [26, -10]]), b: kf(t, [[10, -12], [26, -120]]) } }), ...faceAt(t, [[0, "neutral"], [24, "happy"]]) };
    const [cx, cy] = chest(doss);
    return (
      <g transform={cam(cx, cy - 150, 2.2)}>
        <Office id="d25" t={t + 440} layout="bureau" tone="warm" desk={false} veil={0.3} />
        <Actor look={DOSS} pose={doss} seed={1} gear={{ medic: true, bronze: 2, honor: 1, glint: interpolate(t, [loc("S25", w("23", 3)), loc("S25", w("23", 3)) + 16], [0.01, 1], CLAMP) }} />
        <Sparkle x={cx + 90} y={cy - 150} k={interpolate(t, [20, 40], [0.01, 1], CLAMP)} r={30} />
      </g>
    );
  },
  // the close: back to the opening picture; 75 on the word, gone before the last frame (= frame 0)
  S26: ({ t, len }) => {
    const [cx, cy] = chest(DOSS_AT);
    const l = at(0.3, 0.5, { yaw: 0.3, ...PORT });
    const r = at(0.7, 0.5, { yaw: -0.3, ...PORT });
    const on = loc("S26", w("24", 10)) - 2;
    return (
      <g transform={cam(cx, cy - 110, 1.6)}>
        <Office id="d1" t={t + 40} layout="hq" tone="green" desk={false} />
        <Actor look={TROOPS.gi} pose={l} seed={11} gear={{ hat: "m1" }} />
        <PortArms p={l} />
        <Actor look={TROOPS.gi} pose={r} seed={12} gear={{ hat: "m1" }} rim="rimL" />
        <PortArms p={r} />
        <Actor look={DOSS} pose={{ ...DOSS_AT, ...faceAt(t, [[0, "neutral"]]) }} seed={1} gear={HOOK_GEAR} />
        {/* the 75 next to him, on its word, gone 10 frames before the end (critic #9) */}
        {/* short-qa caught a one-frame pop when it vanished: it fades out over 6 frames, gone 8 frames before the end */}
        <g opacity={interpolate(t, [len - 14, len - 8], [1, 0], CLAMP)}>
          <Ledger x={cx + 120} y={cy + 150} value="75" f={t} at={on} s={0.7} pop />
        </g>
      </g>
    );
  },
};

/** Camera C (Lucas 2026-11-04): one slow eased pan on the wide outdoor shots that open a new place. */
const OPENERS = ["S8", "S12", "S18"];
const camMove = (seg: { id: string; len: number }, t: number) => {
  if (!OPENERS.includes(seg.id)) return "";
  const k = interpolate(t, [0, seg.len], [0, 1], { ...CLAMP, easing: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2) });
  return `translate(500 760) scale(1.05) translate(${-500 + 36 - 72 * k} -760)`;
};

/** Light of each shot (N3 / N4): the barracks, offices and the ceremony are indoor; Guam and the cliff by day; the ridge at dusk; the night battle. */
const LIGHT: Record<string, SceneLight> = { S8: "day", S9: "day", S12: "day", S13: "day", S14: "golden", S15: "golden", S16: "golden", S17: "golden", S18: "night", S19: "night", S20: "night", S21: "night", S22: "night" };
/** N2: a blurred near object on about a third of the shots. */
const FG: Record<string, [FgKind, "left" | "right"]> = { S5: ["wall", "right"], S8: ["leaves", "left"], S9: ["leaves", "right"], S14: ["rock", "left"], S16: ["rock", "right"], S19: ["rock", "left"], S22: ["rock", "right"], S23: ["wall", "left"] };
/** N14: crossfade frames where the place changes; the white flash after the hook. */
const XFADE: Record<string, number> = { S8: 7, S11: 6, S18: 8, S24: 7 };
const FLASH = "S4";

const ShotLayer: React.FC<{ seg: (typeof SHOTS)[number]; t: number }> = ({ seg, t }) => {
  const Shot = S[seg.id];
  const light = LIGHT[seg.id] ?? "indoor";
  const fg = FG[seg.id];
  return (
    <ShotLook value={{ dof: dofFor(seg.size), light }}>
      <g transform={camMove(seg, t)}>
        <Shot t={t} len={seg.len} />
      </g>
      <GradeWash light={light} />
      {fg ? <Foreground kind={fg[0]} side={fg[1]} t={t} id={`fg-${seg.id}`} /> : null}
    </ShotLook>
  );
};

const Picture: React.FC = () => {
  const f = useCurrentFrame();
  const i = SHOTS.length - 1 - [...SHOTS].reverse().findIndex((s) => f >= s.from);
  const seg = SHOTS[Math.max(0, i)];
  const t = f - seg.from;
  const prev = i > 0 ? SHOTS[i - 1] : null;
  const fade = XFADE[seg.id] && prev && t < XFADE[seg.id] ? t / XFADE[seg.id] : 1;
  const light = LIGHT[seg.id] ?? "indoor";
  return (
    <>
      <Base />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0, filter: GRADE[light].css }}>
        <KitDefs />
        <SetDefs />
        <LookDefs />
        {fade < 1 && prev ? <ShotLayer seg={prev} t={f - prev.from} /> : null}
        <g opacity={fade}>
          <ShotLayer seg={seg} t={t} />
        </g>
        {seg.id === FLASH ? <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={flashAlpha(t)} /> : null}
      </svg>
      <KaraokeSubs timing={timing} words={WORDS} Skin={HoatSuSub} oneLine maxWords={3} maxChars={18} />
    </>
  );
};

export const MDoss: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // the bed steps back under the fight on the ridge and under the last line
  const duck = (g: number) => (g >= line("24").start * FPS - 6 ? 0.5 : g >= w("15", 2) && g < line("16").start * FPS ? 0.3 : g >= shot("S14").from && g < shot("S16").from ? 0.6 : 1);
  return (
    <AbsoluteFill>
      <Freeze frame={0} active={f >= durationInFrames - 1}>
        <Picture />
      </Freeze>
      <Audio name="VO" src={staticFile("voiceover/m-doss/vo.mp3")} />
      <MusicBed file={MUSIC} level={-24} duck={duck} />
      {/* W6: each hit lands in the pause after its word or with the action it shows, aligned by attack / peak */}
      <Sfx file="sfx/pop/page-turn-single-1104.mp3" at={shot("S4").from + 8} level={-25} align="onset" />
      <Sfx file="sfx/amb-river/river-in-the-forest-with-birds-1216.mp3" at={shot("S8").from} level={-32} seconds={(shot("S10").from - shot("S8").from) / FPS} />
      <Sfx file="sfx/explosion/explosive-impact-from-afar-2758.mp3" at={shot("S9").from + 4} level={-30} align="onset" seconds={2} />
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={shot("S10").from + loc("S10", w("07", 5)) + 2} level={-24} align="onset" />
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={shot("S10").from + loc("S10", w("07", 6)) + 2} level={-24} align="onset" />
      <Sfx file="sfx/amb-wind/wind-in-the-top-of-the-mountain-1267.mp3" at={shot("S12").from} level={-31} seconds={(shot("S14").from - shot("S12").from) / FPS} />
      <Sfx file="sfx/explosion/war-field-explosion-1702.mp3" at={lineEnd("11")} level={-29} align="onset" seconds={3.2} />
      <Sfx file="sfx/pen/fast-writing-3196.mp3" at={w("12", 1) - 2} level={-25} align="onset" />
      <Sfx file="sfx/creak/ship-hull-creak-3076.mp3" at={shot("S17").from} level={-30} seconds={shot("S17").len / FPS} />
      <Sfx file="sfx/amb-rain/heavy-rain-drops-2399.mp3" at={shot("S18").from} level={-32} seconds={(shot("S23").from - shot("S18").from) / FPS} />
      <Sfx file="sfx/explosion/short-explosion-1694.mp3" at={w("15", 4) - 4} level={-22} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={w("18", 4) - 4} level={-24} align="onset" />
      <Sfx file="sfx/shutter/shutter-click-3-494029.mp3" at={shot("S24").from + loc("S24", w("22", 8))} level={-24} align="onset" />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
