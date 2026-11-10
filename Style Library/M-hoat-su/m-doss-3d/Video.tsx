/**
 * m-doss rebuilt in 3D (Lucas 2026-11-04: "dùng Three.js qua @remotion/three … dựng lại toàn bộ video tập m-doss"):
 * same script, voice, cuts (../m-doss/shots.timeline.json), music and SFX as the 2D version; every place is a three.js
 * world (../three/doss-sets.tsx), shot through a real camera; the people are our 2D rig placed by projecting their feet
 * (../three/kit3d.tsx `place`). Camera rule C kept: static frames + hard cuts; the shots that open a new place glide
 * once (a slow eased dolly, real parallax); the map insert stays flat (S11). Composition `Style-M-HoatSu-Doss3D`.
 * E3: the Japanese side is never drawn as people, only muzzle flashes and smoke on the ridge.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type * as THREE from "three";
import timing from "../../../src/voiceover/m-doss.timing.json";
import WORDS from "../../../src/voiceover/m-doss.words.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import { kf } from "../../toon-engine/anim";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { faceAt, Hero, joints, LEG_LEN, type Look, type Pose, toWorld, walkPose } from "../../toon-engine/rig";
import { Foreground, type FgKind, flashAlpha, GRADE, GradeWash, Lit, LookDefs, type SceneLight, ShotLook } from "../look";
import { alive, Cap, HoatSuSub, Ledger, M, OnChest, PinnedMap, SignPost } from "../hoat-su";
import { DustPuff, Gunfire, handAt, HeightMark, Litter, M1Helmet, Medals, MedicKit, Rifle, Sparkle, Specs, SpeedLines, TROOPS, vary } from "../ww2";
import SHOTS from "../m-doss/shots.timeline.json";
import { camLerp, makeCam, place, pxPerM, shotCam, toScreen, type Cam, type V3 } from "../three/kit3d";
import { Bureau, CliffFoot, CliffLip, DraftOffice, GreyOffice, HQ, Jungle, Lodging, NightField, RidgeTop } from "../three/doss-sets";
import { Desk, Stone } from "../three/sets3d";
import { Stage3D } from "../three/stage";

const FPS = 30;
const MUSIC = "sfx/music/own/m-resolve.mp3"; // code-made (Lucas 2026-11-04: no Pixabay music, Content ID)
const END = 62.5;
export const mDoss3dDuration = (fps: number) => Math.round(END * fps) + 1; // + the loop frame (= frame 0)

const line = (id: string) => timing.lines.find((l) => l.id === id)!;
const w = (id: string, k: number) => {
  const heard = (WORDS as Record<string, number[]>)[id];
  const n = line(id).text.split(/\s+/).length;
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / n))] * FPS);
};
const lineEnd = (id: string) => Math.round(line(id).end * FPS);
const shot = (id: string) => SHOTS.find((s) => s.id === id)!;
const loc = (id: string, g: number) => g - shot(id).from;

const chest = (p: Pose) => [p.x, p.y - 70 * p.scale] as const;
/** feet of a pose on screen */
const feetY = (p: Pose) => p.y + LEG_LEN * p.scale;
/** lying on the ground at world (x, z): the rig turned on its side (head screen-right) */
const lyingAt = (k: THREE.PerspectiveCamera, x: number, z: number, p: Partial<Pose> = {}, y0 = 0): Pose => {
  const b = place(k, x, z, {}, y0);
  const s = b.scale * (p.scale ?? 1);
  const { scale: _drop, ...rest } = p;
  return { ...b, y: feetY(b) - 40 * s, scale: s, spin: 90, yaw: 0.6, armL: { a: 20, b: -20 }, armR: { a: 30, b: -40 }, ...rest };
};
/** walking along x in the world: one step ≈ 0.59 m (the rig's STEP_LEN at 1.75 m) */
const walkAt = (k: THREE.PerspectiveCamera, x0: number, z: number, t: number, facing: 1 | -1, stepF: number, extra: Partial<Pose> = {}): Pose => {
  const phase = (t * Math.PI) / stepF;
  const b = place(k, x0 + facing * (phase / Math.PI) * 0.59, z);
  return walkPose(b.x, phase, feetY(b), b.scale, extra, facing);
};
const HURT = { expr: "worried" as const, blink: 1 };
const PORT: Partial<Pose> = { armL: { a: -30, b: -80 }, armR: { a: 40, b: -110 } };
const PortArms: React.FC<{ p: Pose }> = ({ p }) => {
  const [cx, cy] = chest(p);
  return <Rifle x={cx - 50 * p.scale} y={cy + 70 * p.scale} deg={32} s={p.scale * 1.3} wood="#B5844E" />;
};

type Gear = { hat?: "m1" | "medic" | "officer"; medic?: boolean; honor?: number; bronze?: number; glint?: number; sling?: boolean; specs?: boolean };
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
const TRUMAN = { ...TROOPS.suitGrey, girth: 1.05 };
const DOSS_GEAR: Gear = { hat: "medic", medic: true };
const HOOK_GEAR: Gear = { ...DOSS_GEAR, honor: 1 };
const STAND: Partial<Pose> = { yaw: 0.1, armL: { a: 30, b: -14 }, armR: { a: 30, b: -14 }, handL: "open", handR: "open" };

/** Night rain over the picture: seeded streaks, falling with the frame. */
const Rain: React.FC<{ t: number; n?: number }> = ({ t, n = 90 }) => (
  <g stroke="#C8D4F0" strokeWidth={2.2} strokeLinecap="round" opacity={0.45}>
    {Array.from({ length: n }, (_, i) => {
      const x = (i * 137.5) % 1180 - 50;
      const y = ((i * 311 + t * 46) % 2100) - 120;
      return <path key={i} d={`M ${x} ${y} l -10 38`} />;
    })}
  </g>
);

type ShotOut = { cam: THREE.PerspectiveCamera; world: React.ReactNode; people: React.ReactNode; front?: React.ReactNode; over?: React.ReactNode; sky?: boolean; sun?: V3; target?: V3; flat?: React.ReactNode };
type ShotFn = (a: { t: number; len: number; k?: number }) => ShotOut;

// ---------------- cameras ----------------
const C = {
  hqWide: shotCam({ at: [0, 0.3], hp: 540, feet: 1330 }) as Cam,
};

const hook = (t: number, on?: number, len = 0): ShotOut => {
  const k = makeCam(C.hqWide);
  const doss = place(k, 0, 0.3, { ...STAND, ...faceAt(t + 30, [[0, "neutral"]]) });
  const l = place(k, -1.05, -0.4, { yaw: 0.3, ...PORT });
  const r = place(k, 1.05, -0.4, { yaw: -0.3, ...PORT });
  const [cx, cy] = chest(doss);
  return {
    cam: k,
    sky: false,
    world: <HQ />,
    people: (
      <>
        <Actor look={TROOPS.gi} pose={l} seed={11} gear={{ hat: "m1" }} />
        <PortArms p={l} />
        <Actor look={TROOPS.gi} pose={r} seed={12} gear={{ hat: "m1" }} rim="rimL" />
        <PortArms p={r} />
        <Actor look={DOSS} pose={doss} seed={1} gear={HOOK_GEAR} />
      </>
    ),
    over:
      on === undefined ? null : (
        <g opacity={interpolate(t, [len - 14, len - 8], [1, 0], CLAMP)}>
          <Ledger x={cx + 150} y={cy + 120} value="75" f={t} at={on} s={0.7} pop />
        </g>
      ),
  };
};

const S: Record<string, ShotFn> = {
  // HOOK: rifles on both sides of him; his hands empty; the medal. Frame 0 = the last frame.
  S1: ({ t }) => hook(t),
  // "gun": a rifle is pushed at him from the right, his palm comes up, it goes back
  S2: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.4], hp: 1050, feet: 2050, dx: 0.35, camY: 1.45 }));
    const p = place(k, 0, 0.4, { ...STAND, armR: { a: kf(t, [[0, 30], [8, 96]]), b: kf(t, [[0, -14], [8, -12]]) }, yaw: 0.35, ...faceAt(t, [[0, "neutral"]]) });
    const [cx, cy] = chest(p);
    const u = p.scale;
    const rx = kf(t, [[0, 1250], [8, cx + 300 * u], [24, cx + 300 * u], [40, 1300]]);
    return {
      cam: k,
      sky: false,
      world: <HQ />,
      people: (
        <>
          <Actor look={DOSS} pose={p} seed={1} gear={DOSS_GEAR} />
          <path d={`M 1300 ${cy + 80 * u} L ${rx + 60 * u} ${cy - 10 * u}`} stroke={M.ink} strokeWidth={60 * u} strokeLinecap="round" />
          <path d={`M 1300 ${cy + 80 * u} L ${rx + 60 * u} ${cy - 10 * u}`} stroke="#77714A" strokeWidth={50 * u} strokeLinecap="round" />
          <Rifle x={rx + 40 * u} y={cy + 40 * u} deg={-38} s={u * 1.3} wood="#B5844E" />
        </>
      ),
    };
  },
  S3: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.4], hp: 1380, feet: 2420, camY: 1.4 }));
    const p = place(k, 0, 0.4, { ...STAND, ...faceAt(t, [[0, "neutral"]]) });
    return { cam: k, sky: false, world: <HQ />, people: <Actor look={DOSS} pose={p} seed={1} gear={{ ...HOOK_GEAR, glint: interpolate(t, [2, 16], [0.01, 1], CLAMP) }} /> };
  },
  // 1942: the draft desk, the deferment paper slid across to him (the desk is in front of the officer)
  S4: ({ t }) => {
    const k = makeCam(shotCam({ at: [-0.15, 0.2], hp: 640, feet: 1390, camY: 1.55 }));
    const off = place(k, 0.7, -1.5, { yaw: -0.4, armR: { a: 20 + Math.sin(t / 3) * 8, b: -60 + Math.sin(t / 2) * 10 }, headTilt: Math.sin(t / 11) * 6 });
    const doss = place(k, -0.85, 0.6, { yaw: 0.6, tilt: kf(t, [[0, 0], [30, 5], [60, 2]]), headTilt: kf(t, [[0, 0], [24, 8], [60, 3]]), ...faceAt(t, [[0, "neutral"]]) });
    const top = toScreen(k, [0.15, 0.8, -0.5]);
    const u = pxPerM(k, [0.15, 0.8, -0.5]) / 300;
    const slide = interpolate(t, [4, 18], [140 * u, 0], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 3 });
    return {
      cam: k,
      sky: false,
      world: <DraftOffice />,
      people: <Actor look={TROOPS.gi} pose={off} seed={13} gear={{ hat: "officer" }} rim="rimL" />,
      front: <Desk p={[0.55, 0, -0.75]} w={1.9} />,
      over: (
        <>
          <g transform={`translate(${top.x + slide} ${top.y}) rotate(-6) scale(${u})`}>
            <rect x={-60} y={-40} width={120} height={80} rx={4} fill={M.paper} stroke={M.ink} strokeWidth={4} />
            <path d="M -44 -18 l 80 0 M -44 0 l 64 0 M -44 18 l 72 0" stroke="#8A7A62" strokeWidth={5} />
          </g>
          <SignPost x={660} y={470} text="1942" w={200} f={t} at={4} rot={3} />
          <Actor look={TROOPS.gi} pose={doss} seed={1} />
        </>
      ),
    };
  },
  // "He said no.": a head shake and the paper pushed back
  S5: ({ t }) => {
    const k = makeCam(shotCam({ at: [-1.0, 0.4], hp: 1050, feet: 2050, dx: 0.3, camY: 1.45 }));
    const p = place(k, -1.0, 0.4, { yaw: 0.1 + Math.sin(t * 0.55) * 0.45 * Math.exp(-t / 26), armR: { a: kf(t, [[0, 10], [8, 60]]), b: kf(t, [[0, -10], [8, -40]]) }, ...faceAt(t, [[0, "neutral"]]) });
    const h = handAt(p, "R");
    return {
      cam: k,
      sky: false,
      world: <DraftOffice />,
      people: (
        <>
          <Actor look={TROOPS.gi} pose={p} seed={1} still />
          <g transform={`translate(${h.x + 30 * p.scale + kf(t, [[8, 0], [24, 180 * p.scale]])} ${h.y}) rotate(-8) scale(${p.scale})`}>
            <rect x={-60} y={-40} width={120} height={80} rx={4} fill={M.paper} stroke={M.ink} strokeWidth={4} />
          </g>
        </>
      ),
    };
  },
  // "his faith said he must never kill": reading a small book by the lamp at night
  S6: ({ t }) => {
    const k = makeCam({ pos: [0.2, 1.5, 3.4], look: [-0.3, 1.25, -1.6], fov: 40 });
    const p = place(k, -0.35, -1.2, { yaw: 0.25, armL: { a: -8, b: -112 }, armR: { a: 26, b: -118 }, headTilt: 10 + Math.sin(t / 16) * 3, ...faceAt(t, [[0, "neutral"], [30, "tired"]]) });
    const h = handAt(p, "R");
    const turn = Math.floor(t / 26) % 2;
    return {
      cam: k,
      sky: false,
      world: <Lodging />,
      people: (
        <>
          <Actor look={TROOPS.gi} pose={p} seed={1} />
          <g transform={`translate(${h.x - 30 * p.scale} ${h.y - 30 * p.scale}) rotate(-12) scale(${p.scale})`}>
            <rect x={-46} y={-34} width={92} height={68} rx={4} fill="#3A2E3A" stroke={M.ink} strokeWidth={4} />
            <rect x={turn ? -40 : 2} y={-30} width={38} height={60} fill="#EDE3CC" />
          </g>
        </>
      ),
    };
  },
  // "no rifle, only a medic's bag": the column passes behind with rifles; he shoulders the bag
  S7: ({ t }) => {
    const k = makeCam({ pos: [0, 1.5, 7.2], look: [0, 1.05, -0.5], fov: 38 });
    const doss = place(k, 0.1, 0.9, { yaw: 0.2, armR: { a: kf(t, [[0, 10], [10, -20], [24, 10]]), b: kf(t, [[0, -10], [10, -100], [24, -10]]) }, ...faceAt(t, [[0, "neutral"]]) });
    return {
      cam: k,
      sky: false,
      world: <HQ />,
      people: (
        <>
          {[0, 1, 2].map((i) => {
            const q = walkAt(k, 2.0 + i * 1.2, -2, t + i * 3, -1, 11, { yaw: -0.8 });
            const h = handAt(q, "R");
            return (
              <g key={i}>
                <Actor look={TROOPS.gi} pose={q} seed={20 + i} gear={{ hat: "m1" }} still />
                <Rifle x={h.x} y={h.y + 40 * q.scale} deg={-24} s={q.scale * 1.2} />
              </g>
            );
          })}
          <Actor look={DOSS} pose={doss} seed={1} gear={DOSS_GEAR} />
        </>
      ),
    };
  },
  // Guam 1944 (the one glide of this place): he runs in under the smoke
  S8: ({ t, k: m = 0 }) => {
    const k = makeCam(camLerp({ pos: [-0.8, 1.7, 9.5], look: [-0.4, 1.6, 0], fov: 40 }, { pos: [0.8, 1.7, 9.5], look: [0.4, 1.6, 0], fov: 40 }, m));
    const p = walkAt(k, -3.4, 0.5, t, 1, 7, { yaw: 0.8, ...faceAt(t, [[0, "worried"]]) });
    p.tilt += 10;
    const fire = [toScreen(k, [9, 3, -30]), toScreen(k, [12, 2, -26]), toScreen(k, [-14, 3, -34])].map((s) => [s.x, s.y] as [number, number]);
    return {
      cam: k,
      world: <Jungle t={t} />,
      people: (
        <>
          <Gunfire t={t} points={fire} />
          <SpeedLines x={p.x} y={p.y - 60 * p.scale} dir={1} t={t} s={p.scale} />
          <Actor look={DOSS} pose={p} seed={1} gear={DOSS_GEAR} still />
        </>
      ),
      over: <SignPost x={520} y={430} text="GUAM 1944" w={320} f={t} at={4} rot={-3} />,
    };
  },
  // "he ran to the wounded": kneeling over a man, bandaging
  S9: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.4], hp: 720, feet: 1360, camY: 1.3, dx: 0.4 }));
    const wrap = Math.sin(t * 0.7) * 1.6;
    const doss = place(k, -0.55, 0.4, { yaw: 0.6, squash: 0.22, tilt: 16, armL: { a: -40 + wrap * 14, b: -40 }, armR: { a: 50 - wrap * 14, b: -60 }, ...faceAt(t, [[0, "worried"]]) });
    const fire = [toScreen(k, [9, 3, -30]), toScreen(k, [-10, 3, -34])].map((s) => [s.x, s.y] as [number, number]);
    return {
      cam: k,
      world: <Jungle t={t + 40} />,
      people: (
        <>
          <Gunfire t={t + 20} points={fire} />
          <Actor look={TROOPS.gi} pose={lyingAt(k, 0.45, 0.5, HURT)} seed={31} gear={{ hat: "m1" }} still />
          <Actor look={DOSS} pose={doss} seed={1} gear={DOSS_GEAR} />
        </>
      ),
    };
  },
  // "two Bronze Stars": pinned one, then two, on the words
  S10: ({ t }) => {
    const k = makeCam(shotCam({ at: [0.1, 0.1], hp: 780, feet: 1420 }));
    const pin1 = loc("S10", w("07", 5)) + 2;
    const pin2 = loc("S10", w("07", 6)) + 2;
    const off = place(k, 0.6, -0.1, { yaw: -0.5, armL: { a: kf(t, [[0, 20], [pin1 - 4, 70], [pin2 + 6, 70], [pin2 + 16, 20]]), b: -10 }, ...faceAt(t, [[0, "smug"]]) });
    const doss = place(k, -0.45, 0.3, { yaw: 0.5, ...faceAt(t, [[0, "neutral"], [pin2 + 4, "happy"]]) });
    const n = (t >= pin1 ? 1 : 0) + (t >= pin2 ? 1 : 0);
    return {
      cam: k,
      sky: false,
      world: <GreyOffice />,
      people: (
        <>
          <Actor look={TROOPS.gi} pose={off} seed={14} gear={{ hat: "officer" }} rim="rimL" />
          <Actor look={DOSS} pose={doss} seed={1} gear={{ ...DOSS_GEAR, bronze: n }} />
        </>
      ),
    };
  },
  // S11 (Okinawa map) is a flat insert: see FLAT below
  S11: () => ({ cam: makeCam(C.hqWide), world: null, people: null }),
  // the cliff from its foot (the one glide of this place): nets down the rock, men climbing
  S12: ({ t, len, k: m = 0 }) => {
    const k = makeCam(camLerp({ pos: [-1, 1.6, 10], look: [-0.4, 7.5, -4], fov: 52 }, { pos: [1, 1.6, 10], look: [0.4, 7.5, -4], fov: 52 }, m));
    const up = interpolate(t, [0, len], [0, 1.4], CLAMP);
    return climbShot(k, t, up, 1e9);
  },
  // "four hundred feet": the same plate; the height mark draws up the rock on the number
  S13: ({ t }) => {
    const k = makeCam({ pos: [1, 1.6, 10], look: [0.4, 7.5, -4], fov: 52 });
    const kk = interpolate(t, [2, loc("S13", w("10", 4))], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 2 });
    return climbShot(k, t + shot("S12").len, 1.4 + t / 60, kk);
  },
  // "Japanese troops hit back hard": flashes along the far rocks (no figures, E3); the men go down behind cover
  S14: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.8], hp: 470, feet: 1250, camY: 1.6 }));
    const fire = loc("S14", w("11", 4)) - 2;
    const hit = loc("S14", w("11", 5));
    const down = (i: number) => interpolate(t, [hit + i * 5, hit + 8 + i * 5], [0, 1], CLAMP);
    const xs = [-1.1, 0, 1.1];
    const flashes = [[-6, 3.2, -14], [-1, 4.2, -16], [5, 3.8, -15], [10, 3.3, -13]].map((v) => toScreen(k, v as V3)).map((s) => [s.x, s.y] as [number, number]);
    return {
      cam: k,
      world: <RidgeTop t={t} />,
      people: (
        <>
          <Gunfire t={t} on={t >= fire} points={flashes} />
          {xs.map((x, i) => {
            const b = place(k, x, 0.8, { yaw: 0.6, tilt: 10 + down(i) * 60, ...faceAt(t, [[0, "worried"]]), blink: t > hit + i * 5 ? 1 : 0 });
            return <Actor key={i} look={TROOPS.gi} pose={{ ...b, y: b.y + down(i) * 150 * b.scale }} seed={50 + i} gear={{ hat: "m1" }} still={t > hit + i * 5} />;
          })}
          {xs.map((x, i) => {
            const s = toScreen(k, [x, 0, 1.3]);
            return <DustPuff key={i} t={t} at={hit + i * 5 + 8} x={s.x} y={s.y} s={0.8} />;
          })}
        </>
      ),
      front: (
        <>
          <Stone p={[-1.2, 0, 1.6]} s={[0.75, 0.62, 0.5]} seed={31} color="#8A7A6A" />
          <Stone p={[0.05, 0, 1.75]} s={[0.65, 0.55, 0.45]} seed={32} color="#8A7A6A" />
          <Stone p={[1.2, 0, 1.6]} s={[0.75, 0.6, 0.5]} seed={33} color="#8A7A6A" />
        </>
      ),
    };
  },
  // "about seventy-five went down, and the rest pulled back": men run back; the wounded stay; 75 on the word
  S15: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.2], hp: 470, feet: 1300, camY: 1.8 }));
    const fire = [toScreen(k, [-1, 4.2, -16]), toScreen(k, [5, 3.8, -15])].map((s) => [s.x, s.y] as [number, number]);
    return {
      cam: k,
      world: <RidgeTop t={t + 60} />,
      people: (
        <>
          <Gunfire t={t} points={fire} />
          {[[-0.5, 1.4, 1], [0.6, -0.4, 0.95], [-0.7, -2.2, 0.9]].map(([x, z, s], i) => (
            <Actor key={i} look={TROOPS.gi} pose={lyingAt(k, x, z, { ...HURT, scale: s })} seed={60 + i} gear={{ hat: "m1" }} still />
          ))}
          {[0, 1].map((i) => <Actor key={i} look={TROOPS.gi} pose={walkAt(k, 1.2 + i * 1.1, -4.2, t + i * 4, -1, 7, { yaw: -0.8 })} seed={70 + i} gear={{ hat: "m1" }} still />)}
        </>
      ),
      over: <Ledger x={720} y={560} value="75" f={t} at={loc("S15", w("12", 1)) - 2} s={0.8} pop />,
    };
  },
  // "He stayed.": kneeling alone on the top, looking round
  S16: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.6], hp: 820, feet: 1420, camY: 1.2, dx: 0.3 }));
    const p = place(k, 0, 0.6, { yaw: kf(t, [[0, -0.6], [18, 0.5]]), squash: 0.2, ...faceAt(t, [[0, "worried"], [16, "neutral"]]) });
    return {
      cam: k,
      world: <RidgeTop t={t + 90} />,
      people: (
        <>
          <Actor look={TROOPS.gi} pose={lyingAt(k, -0.9, -1.6, { ...HURT, scale: 0.9 })} seed={64} gear={{ hat: "m1" }} still />
          <Actor look={TROOPS.gi} pose={lyingAt(k, 1.1, -2.4, { ...HURT, scale: 0.92 })} seed={65} gear={{ hat: "m1" }} still />
          <Actor look={DOSS} pose={p} seed={1} gear={DOSS_GEAR} />
        </>
      ),
    };
  },
  // "one by one… lowered them down on a rope": the lip from the side, Doss braced on top, the litter going down the face
  S17: ({ t, len }) => {
    const top = 18;
    const k = makeCam({ pos: [-5.2, 20.4, 9.8], look: [0.5, 16.9, 0.3], fov: 42 });
    const ly = interpolate(t, [0, len], [top - 1.0, top - 3.6], CLAMP);
    const pull = Math.sin(t / 4);
    const doss = place(k, 1.1, 0.3, { yaw: -0.6, tilt: 18, armL: { a: -60 + pull * 16, b: -30 }, armR: { a: -40 - pull * 16, b: -40 }, legL: { a: 24, b: 0 }, legR: { a: -6, b: 0 }, ...faceAt(t, [[0, "worried"]]) }, top);
    const hand = handAt(doss, "L");
    const edge = toScreen(k, [0, top, 0.3]);
    const lit = toScreen(k, [-0.7, ly, 0.3]);
    const u = pxPerM(k, [-0.7, ly, 0.3]) / 260;
    const man = lyingAt(k, -0.7, 0.3, { ...HURT, scale: 0.75 }, ly);
    return {
      cam: k,
      world: <CliffLip t={t + 80} />,
      people: (
        <>
          <path d={`M ${hand.x} ${hand.y} L ${edge.x} ${edge.y} L ${lit.x} ${lit.y - 80 * u}`} stroke="#E0CDA0" strokeWidth={6} fill="none" />
          <Litter x={lit.x} y={lit.y} s={u} rope={[lit.x, lit.y - 80 * u]} />
          <Actor look={TROOPS.gi} pose={{ ...man, y: lit.y - 14 * u - LEG_LEN * man.scale + 40 * man.scale }} seed={61} gear={{ hat: "m1" }} still />
          <Actor look={DOSS} pose={doss} seed={1} gear={DOSS_GEAR} still />
        </>
      ),
    };
  },
  // "Weeks later, a grenade tore into his legs": night (the one glide of the night); it lands, a white flash, he is down
  S18: ({ t, k: m = 0 }) => {
    const c0 = shotCam({ at: [0, 0.5], hp: 640, feet: 1360, dx: -0.5 });
    const k = makeCam(camLerp(c0, { ...c0, pos: [c0.pos[0] + 1, c0.pos[1], c0.pos[2]], look: [c0.look[0] + 0.4, c0.look[1], c0.look[2]] }, m));
    const land = loc("S18", w("15", 3)) + 2;
    const blast = loc("S18", w("15", 4)) - 4;
    const fall = interpolate(t, [blast + 2, blast + 10], [0, 1], { ...CLAMP, easing: (x) => x * x });
    const down = fall >= 1;
    const g0 = toScreen(k, [2.2, 2.6, -1]);
    const g1 = toScreen(k, [0.5, 0, 0.7]);
    const gx = kf(t, [[0, g0.x], [land, g1.x]], (x) => x);
    const gyy = kf(t, [[0, g0.y], [land * 0.5, g0.y - 120], [land, g1.y]]);
    const boom = toScreen(k, [0.3, 0, 0.7]);
    const stand = place(k, -0.1, 0.5, { yaw: 0.6, squash: 0.2, tilt: 14 + fall * 70, ...faceAt(t, [[0, "worried"], [land - 4, "shock"]]) });
    return {
      cam: k,
      world: <NightField t={t} />,
      people: (
        <>
          {down ? (
            <Actor look={DOSS} pose={lyingAt(k, -0.3, 0.7, { ...faceAt(t, [[0, "shock"], [blast + 20, "worried"]]), armL: { a: 120, b: -60 } })} seed={1} gear={DOSS_GEAR} still />
          ) : (
            <Actor look={DOSS} pose={stand} seed={1} gear={DOSS_GEAR} />
          )}
          {t >= blast ? null : (
            <g transform={`translate(${gx} ${gyy}) rotate(${t < land ? t * 24 : land * 24}) scale(${stand.scale * 1.8})`}>
              <ellipse cx={0} cy={0} rx={16} ry={20} fill="#3E4232" stroke="#D8D0B4" strokeWidth={4} />
              <path d="M -6 -20 L 6 -20 L 6 -28 L -6 -28 Z" fill="#6A6A60" stroke={M.ink} strokeWidth={3} />
            </g>
          )}
          <DustPuff t={t} at={blast + 10} x={boom.x} y={boom.y} s={1.1} color="#5A4A3A" />
        </>
      ),
      over: (
        <>
          <Rain t={t} />
          <rect x={0} y={0} width={1080} height={1920} fill="#FFFBEE" opacity={interpolate(t, [blast, blast + 2, blast + 14], [0, 0.95, 0], CLAMP)} />
        </>
      ),
    };
  },
  // "On the stretcher, he saw another wounded man": bearers at the two ends, him on it, the other man ahead
  S19: ({ t, len }) => {
    const k = makeCam(shotCam({ at: [0, 0.3], hp: 520, feet: 1330, camY: 1.7 }));
    const x = interpolate(t, [0, len], [-0.25, 0.15], CLAMP);
    const ph = (x / 0.59) * Math.PI;
    const a = place(k, x - 1.1, 0.3);
    const b = place(k, x + 1.1, 0.3);
    const b1 = walkPose(a.x, ph, feetY(a), a.scale * 0.95, { yaw: 0.8, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 } });
    const b2 = walkPose(b.x, ph + 2, feetY(b), b.scale * 0.95, { yaw: 0.8, armL: { a: -40, b: 20 }, armR: { a: -40, b: 20 } });
    const ly = handAt(b1, "R").y;
    const mid = place(k, x, 0.3);
    return {
      cam: k,
      world: <NightField t={t + 60} />,
      people: (
        <>
          <Actor look={TROOPS.gi} pose={lyingAt(k, 0.9, -2.6, { ...HURT, scale: 0.85 })} seed={62} gear={{ hat: "m1" }} still />
          <Actor look={TROOPS.gi} pose={b1} seed={90} gear={{ hat: "m1" }} still />
          <Actor look={TROOPS.gi} pose={b2} seed={91} gear={{ hat: "m1" }} still />
          <Litter x={mid.x} y={ly} s={mid.scale * 1.1} />
          <Actor look={DOSS} pose={{ ...lyingAt(k, x, 0.3, { ...faceAt(t, [[0, "worried"]]), look: 1, headTilt: kf(t, [[0, 0], [20, 14]]), scale: 0.8 }), y: ly - 14 * mid.scale - 40 * mid.scale * 0.8 }} seed={1} gear={DOSS_GEAR} still />
        </>
      ),
      over: <Rain t={t + 30} />,
    };
  },
  // "So he crawled off and gave him his place": the litter set down, he rolls off and points; the bearers turn to the man
  S20: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.3], hp: 520, feet: 1330, camY: 1.7 }));
    const roll = interpolate(t, [4, 22], [0, 1], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 2 });
    const bend = interpolate(t, [26, 44], [0, 1], CLAMP);
    const lit = place(k, -0.4, 0.5);
    return {
      cam: k,
      world: <NightField t={t + 100} />,
      people: (
        <>
          <Litter x={lit.x} y={feetY(lit) - 10 * lit.scale} s={lit.scale * 1.1} />
          <Actor look={TROOPS.gi} pose={lyingAt(k, 0.7, -1.6, { ...HURT, scale: 0.85 })} seed={62} gear={{ hat: "m1" }} still />
          {[0.1, 1.35].map((x, i) => <Actor key={i} look={TROOPS.gi} pose={place(k, x, -2.2, { yaw: i ? -0.6 : 0.6, tilt: (i ? -1 : 1) * bend * 30 })} seed={90 + i} gear={{ hat: "m1" }} />)}
          <Actor
            look={DOSS}
            pose={lyingAt(k, -0.4 - roll * 0.6, 0.5 + roll * 0.4, { ...faceAt(t, [[0, "worried"], [22, "neutral"]]), spin: 90 - roll * 30, armR: { a: kf(t, [[16, 30], [26, 128]]), b: kf(t, [[16, -20], [26, 0]]) }, scale: 0.85 })}
            seed={1}
            gear={DOSS_GEAR}
            still
          />
        </>
      ),
      over: <Rain t={t + 60} />,
    };
  },
  // "Then he was hit again, and his arm broke": a flash at the arm, then the sling
  S21: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.3], hp: 760, feet: 1250, camY: 1.3, dx: 0.3 }));
    const hit = loc("S21", w("18", 4)) - 4;
    const hurt = t >= hit;
    const p = lyingAt(k, 0, 0.3, { yaw: 0.5, spin: kf(t, [[0, 70], [hit, 70], [hit + 20, 52], [hit + 50, 60]]), armR: hurt ? { a: -10, b: -120 } : { a: 60, b: -20 }, armL: { a: kf(t, [[hit, 20], [hit + 20, 70]]), b: -30 }, ...faceAt(t, [[0, "worried"], [hit, "shock"], [hit + 24, "worried"]]) });
    const arm = handAt(p, "R");
    return {
      cam: k,
      world: <NightField t={t + 140} />,
      people: (
        <>
          <Actor look={DOSS} pose={p} seed={1} gear={{ ...DOSS_GEAR, sling: hurt }} still />
          <Sparkle x={arm.x} y={arm.y} k={interpolate(t, [hit, hit + 10], [0.01, 1], CLAMP)} r={70} />
        </>
      ),
      over: <Rain t={t + 90} />,
    };
  },
  // "He crawled three hundred yards to get help": a long crawl over the mud toward the aid tent, a track behind him
  S22: ({ t, len }) => {
    const k = makeCam(shotCam({ at: [0, 0.6], hp: 520, feet: 1330, camY: 1.7 }));
    const x = interpolate(t, [0, len], [-1.3, 0.5], CLAMP);
    const c = Math.sin(t * 0.5);
    const a = toScreen(k, [-3.5, 0, 0.6]);
    const b = toScreen(k, [x - 0.4, 0, 0.6]);
    return {
      cam: k,
      world: <NightField t={t + 180} tent={[1.3, 0, -3.2]} />,
      people: (
        <>
          <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#241C16" strokeWidth={22} strokeLinecap="round" opacity={0.7} />
          <Actor look={DOSS} pose={lyingAt(k, x, 0.6, { spin: 84, armL: { a: 150 + c * 20, b: 10 }, legL: { a: 10 + c * 12, b: 0 }, legR: { a: -10 - c * 12, b: 0 }, ...faceAt(t, [[0, "worried"]]), scale: 0.85 })} seed={1} gear={{ ...DOSS_GEAR, sling: true }} still />
        </>
      ),
      over: <Rain t={t + 120} />,
    };
  },
  // "So did the army ever make him carry a gun? No.": a rifle stands beside him, untouched; on "No." the head shake
  S23: ({ t }) => {
    const k = makeCam(shotCam({ at: [0, 0.4], hp: 1000, feet: 1980, dx: 0.35, camY: 1.45 }));
    const no = loc("S23", line("21").start * FPS);
    const p = place(k, 0, 0.4, { yaw: t >= no ? 0.1 + Math.sin((t - no) * 0.6) * 0.6 * Math.exp(-(t - no) / 28) : kf(t, [[0, 0.1], [20, 0.7]]), look: t < no ? kf(t, [[0, 0], [20, 1]]) : 0, ...faceAt(t, [[0, "neutral"]]) });
    const head = toWorld(p, joints(p).head);
    return {
      cam: k,
      sky: false,
      world: <HQ />,
      people: (
        <>
          <Rifle x={head.x + 200 * p.scale} y={feetY(p) - 30 * p.scale} deg={6} s={p.scale * 1.3} />
          <Actor look={DOSS} pose={p} seed={1} gear={{ ...DOSS_GEAR, bronze: 2 }} still={t >= no} />
        </>
      ),
    };
  },
  // "That October, President Truman put the Medal of Honor around his neck"
  S24: ({ t }) => {
    const k = makeCam(shotCam({ at: [0.05, 0.1], hp: 720, feet: 1400 }));
    const put = loc("S24", w("22", 8));
    const tr = place(k, 0.6, -0.1, { yaw: -0.5, armL: { a: kf(t, [[0, 20], [put - 10, 100], [put + 6, 100], [put + 18, 20]]), b: kf(t, [[0, -10], [put - 10, -30], [put + 18, -10]]) }, armR: { a: 12, b: -12 }, ...faceAt(t, [[0, "neutral"], [put, "happy"]]) });
    const doss = place(k, -0.5, 0.3, { yaw: 0.5, ...faceAt(t, [[0, "neutral"], [put + 6, "happy"]]) });
    return {
      cam: k,
      sky: false,
      world: <Bureau />,
      people: (
        <>
          <Actor look={TRUMAN} pose={tr} seed={15} rim="rimL" gear={{ specs: true }} />
          <Actor look={DOSS} pose={doss} seed={1} gear={{ medic: true, bronze: 2, honor: t >= put ? 1 : 0 }} />
        </>
      ),
      over: <SignPost x={560} y={420} text="OCTOBER 1945" w={420} f={t} at={4} rot={-3} kind="paper" />,
    };
  },
  // "the first conscientious objector ever to receive it": the medal catches the light
  S25: ({ t }) => {
    const k = makeCam(shotCam({ at: [-0.5, 0.3], hp: 1350, feet: 2380, camY: 1.4 }));
    const doss = place(k, -0.55, 0.3, { yaw: 0.3, armR: { a: kf(t, [[10, 14], [26, -10]]), b: kf(t, [[10, -12], [26, -120]]) }, ...faceAt(t, [[0, "neutral"], [24, "happy"]]) });
    const [cx, cy] = chest(doss);
    return {
      cam: k,
      sky: false,
      world: <Bureau />,
      people: (
        <>
          <Actor look={DOSS} pose={doss} seed={1} gear={{ medic: true, bronze: 2, honor: 1, glint: interpolate(t, [loc("S25", w("23", 3)), loc("S25", w("23", 3)) + 16], [0.01, 1], CLAMP) }} />
          <Sparkle x={cx + 90 * doss.scale} y={cy - 150 * doss.scale} k={interpolate(t, [20, 40], [0.01, 1], CLAMP)} r={30} />
        </>
      ),
    };
  },
  // the close: back to the opening picture; 75 on the word, gone before the last frame (= frame 0)
  S26: ({ t, len }) => hook(t, loc("S26", w("24", 10)) - 2, len),
};

/** The cliff plate (S12, S13): two nets, four climbers, the sign; `mark` 0→1 draws the height mark (>1: none). */
const climbShot = (k: THREE.PerspectiveCamera, t: number, up: number, mark: number): ShotOut => {
  const climbers = [0, 1, 2, 3].map((i) => {
    const x = i < 2 ? -2.2 : 2.4;
    const y0 = 1.6 + (i % 2) * 2.6 + up;
    return place(k, x, -3.6, { yaw: 0, armL: { a: 160 + Math.sin(t / 5 + i) * 14, b: 10 }, armR: { a: 160 - Math.sin(t / 5 + i) * 14, b: 10 }, legL: { a: 12, b: -30 }, legR: { a: -12, b: -10 } }, y0);
  });
  const foot = toScreen(k, [4.6, 0.3, -3.6]);
  const lip = toScreen(k, [4.6, 27.5, -3.6]);
  return {
    cam: k,
    world: <CliffFoot t={t} />,
    people: (
      <>
        {climbers.map((p, i) => <Actor key={i} look={TROOPS.gi} pose={p} seed={40 + i} gear={{ hat: i === 3 ? "medic" : "m1", medic: i === 3 }} still />)}
        {mark <= 1 ? <HeightMark x={foot.x} y0={Math.max(lip.y, 560)} y1={Math.min(foot.y, 1420)} label="400 FT" k={mark} /> : null}
      </>
    ),
    over: <SignPost x={520} y={400} text="HACKSAW RIDGE" w={460} f={mark > 1 ? t : t + 99} at={mark > 1 ? loc("S12", w("09", 8)) - 4 : 0} rot={-2} />,
  };
};

/** Flat inserts drawn in 2D (the map has no depth to show). */
const FLAT: Record<string, (t: number, len: number) => React.ReactNode> = {
  S11: (t, len) => {
    const z = interpolate(t, [0, len], [1, 1.04], CLAMP);
    return (
      <g transform={`translate(500 800) scale(${z}) translate(-500 -800)`}>
        <PinnedMap
          f={t}
          arrowAt={6}
          arrowLen={30}
          route="M 330 1060 Q 420 980 520 900"
          land={["M 700 440 Q 760 470 740 540 Q 700 620 640 700 Q 600 760 600 820 Q 610 880 560 940 Q 500 1000 430 1020 Q 380 1030 400 980 Q 460 930 470 880 Q 480 800 540 730 Q 600 640 640 560 Q 670 480 700 440 Z"]}
          labels={[]}
        />
        <g transform="rotate(-1.5 500 800)">
          <circle cx={520} cy={900} r={24 + 8 * Math.sin(t / 4)} fill="none" stroke={M.accent} strokeWidth={8} opacity={interpolate(t, [34, 40], [0, 1], CLAMP)} />
        </g>
        <SignPost x={500} y={500} text="OKINAWA 1945" w={420} f={t} at={2} rot={-3} kind="paper" />
      </g>
    );
  },
};

/** Camera C: the shots that open a new place glide once, eased in-out (S8 Guam, S12 the cliff, S18 the night). */
const OPENERS = ["S8", "S12", "S18"];
const glide = (id: string, t: number, len: number) => (OPENERS.includes(id) ? interpolate(t, [0, len], [0, 1], { ...CLAMP, easing: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2) }) : 0);

const LIGHT: Record<string, SceneLight> = { S8: "day", S9: "day", S12: "day", S13: "day", S14: "golden", S15: "golden", S16: "golden", S17: "golden", S18: "night", S19: "night", S20: "night", S21: "night", S22: "night" };
const FG: Record<string, [FgKind, "left" | "right"]> = { S5: ["wall", "right"], S8: ["leaves", "left"], S9: ["leaves", "right"], S16: ["rock", "right"], S19: ["rock", "left"], S22: ["rock", "right"], S23: ["wall", "left"] };
const XFADE: Record<string, number> = { S8: 7, S11: 6, S18: 8, S24: 7 };
const FLASH = "S4";
/** depth of field: background blur in px at 1080 wide, by shot size (people stay sharp) */
const blurFor = (size: string) => (size.startsWith("cận") ? 11 : size.startsWith("vừa") ? 6 : 0);

const ShotLayer: React.FC<{ seg: (typeof SHOTS)[number]; t: number }> = ({ seg, t }) => {
  const light = LIGHT[seg.id] ?? "indoor";
  const fg = FG[seg.id];
  const flat = FLAT[seg.id];
  const wash = (
    <>
      <GradeWash light={light} />
      {fg ? <Foreground kind={fg[0]} side={fg[1]} t={t} id={`fg-${seg.id}`} /> : null}
      {seg.id === FLASH ? <rect x={0} y={0} width={1080} height={1920} fill="#FFFFFF" opacity={flashAlpha(t)} /> : null}
    </>
  );
  if (flat) {
    return (
      <AbsoluteFill style={{ filter: GRADE[light].css, background: "#3A2E34" }}>
        <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <KitDefs />
          <SetDefs />
          <LookDefs />
          {flat(t, seg.len)}
          {wash}
        </svg>
      </AbsoluteFill>
    );
  }
  const o = S[seg.id]({ t, len: seg.len, k: glide(seg.id, t, seg.len) });
  return (
    <ShotLook value={{ dof: 0, light }}>
      <AbsoluteFill style={{ filter: GRADE[light].css }}>
        <Stage3D cam={o.cam} light={light} world={o.world} front={o.front} blur={blurFor(seg.size)} sky={o.sky ?? true} sun={o.sun} target={o.target ?? [0, 0, 0]}
          over={<>{o.over}{wash}</>}>
          {o.people}
        </Stage3D>
      </AbsoluteFill>
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
  return (
    <AbsoluteFill style={{ background: "#2A2230" }}>
      {fade < 1 && prev ? <ShotLayer key={`p${prev.id}`} seg={prev} t={f - prev.from} /> : null}
      <AbsoluteFill key={`c${seg.id}`} style={{ opacity: fade }}>
        <ShotLayer seg={seg} t={t} />
      </AbsoluteFill>
      <KaraokeSubs timing={timing} words={WORDS} Skin={HoatSuSub} oneLine maxWords={3} maxChars={18} />
    </AbsoluteFill>
  );
};

export const MDoss3D: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const duck = (g: number) => (g >= line("24").start * FPS - 6 ? 0.5 : g >= w("15", 2) && g < line("16").start * FPS ? 0.3 : g >= shot("S14").from && g < shot("S16").from ? 0.6 : 1);
  return (
    <AbsoluteFill>
      <Freeze frame={0} active={f >= durationInFrames - 1}>
        <Picture />
      </Freeze>
      <Audio name="VO" src={staticFile("voiceover/m-doss/vo.mp3")} />
      <MusicBed file={MUSIC} level={-24} duck={duck} />
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
