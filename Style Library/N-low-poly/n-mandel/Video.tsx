/**
 * n-mandel — "The man who won the lottery 14 times" (style N · Low-poly 3D, Lucas 2026-11-05).
 * Every cut sits on a VO word (shots.json → shots.timeline.json, scripts/shotlist.mjs); every number on screen is in
 * the verification table of kich-ban-n-mandel-FINAL.md. Camera: one eased glide per shot at most, hard cuts, no shake,
 * no zoom transitions. Last frame = frame 0 (loop). Composition `Style-N-LowPoly-Mandel`.
 */
import { Audio } from "@remotion/media";
import React from "react";
import * as THREE from "three";
import { AbsoluteFill, Freeze, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "../../../src/voiceover/n-mandel.timing.json";
import WORDS from "../../../src/voiceover/n-mandel.words.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import { act, alive, Box, handAt, type Cam, Cctv, Chip, D, glide, ico, type LightKind, limb, N, NSub, P, Panel, Person, type Pose, rng, Shot3D, signTex, SIT, type V3, walk } from "../lowpoly";
import { Ball, Bill, Book, Bundle, Calculator, Crate, DrawMachine, Folder, GavelBlock, GavelHeld, HeroTicket, LedBoard, Pile, Pin, PressHand, scatter, Stamp, strike, strikeArm, Ticket, Van } from "../props";
import { AU, CAST, Chamber, CoinTower, extra, Interview, Kiosk, MapTable, mapXZ, MiniMap, Office, Street, Studio, TicketTower, VA, Void, Warehouse } from "../sets";
import SHOTS from "./shots.timeline.json";

const FPS = 30;
const END = SHOTS[SHOTS.length - 1].from + SHOTS[SHOTS.length - 1].len;
export const nMandelDuration = () => END + 1; // + the loop frame (= frame 0)
const MUSIC = "sfx/music/own/n-heist.mp3"; // code-made (no library music: Content ID)

const line = (id: string) => timing.lines.find((l) => l.id === id)!;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
/** global frame where `word` (nth time) is spoken in line `id` */
const wd = (id: string, word: string, nth = 1) => {
  const ws = line(id).text.split(/\s+/);
  let k = -1;
  let c = 0;
  ws.forEach((x, i) => {
    if (k < 0 && norm(x) === norm(word) && ++c === nth) k = i;
  });
  if (k < 0) throw new Error(`no "${word}" in line ${id}`);
  const heard = (WORDS as Record<string, number[]>)[id];
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / ws.length))] * FPS);
};
const lineEnd = (id: string) => Math.round(line(id).end * FPS);
const shot = (id: string) => SHOTS.find((s) => s.id === id)!;
const loc = (id: string, g: number) => g - shot(id).from;
const cm = (pos: V3, look: V3, fov = 40): Cam => ({ pos, look, fov });
const ramp = (t: number, a: number, b: number, from = 0, to = 1) => interpolate(t, [a, b], [from, to], CLAMP);

type Out = { light: LightKind; cam: Cam; world: React.ReactNode; over?: React.ReactNode; filter?: string; target?: V3; box?: number; post?: { bloom?: number } };
type ShotFn = (t: number, len: number, g: number) => Out;

const CCTV_FILTER = "grayscale(0.85) sepia(0.2) contrast(1.08) brightness(0.98)";
const sit = (extra: Partial<Pose> = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...extra });
const mandelLife = (g: number) => alive(g, 1);

/** the viewer's own forearm + hand holding a ticket (POV, S2) */
const PovHand: React.FC<{ t: number }> = ({ t }) => (
  <group position={[0.15, 1.22 + Math.sin(t / 14) * 0.006, 1.05]} rotation={[119 * D, 0, -12 * D]}>
    <P g={limb(0.075, 0.062, 0.48)} c="#3B5E8A" />
    <P g={ico(0.065, 0)} c="#E2A882" p={[0, -0.5, 0]} s={[1, 1.2, 0.8]} />
  </group>
);
/** the investor crowd: rows behind a spot, varied people, idle; `cheer` 0→1 raises the arms, a few at a time */
const Crowd: React.FC<{ g: number; n: number; z0?: number; seed?: number; spread?: number; cheer?: number }> = ({ g, n, z0 = -0.5, seed = 50, spread = 1, cheer = 0 }) => {
  const R = rng(seed);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const row = Math.floor(i / 9);
        const x = ((i % 9) - 4) * 0.85 * spread + (row % 2) * 0.42 + (R() - 0.5) * 0.25;
        const z = z0 - row * 0.95 + (R() - 0.5) * 0.3;
        const ry = (R() - 0.5) * 20;
        const up = Math.min(1, Math.max(0, cheer * 1.6 - R() * 0.6));
        const arm = { f: up * 165 + Math.sin(g / 6 + i) * 8 * up, o: 8 + up * 10, e: -12 * up };
        return <Person key={i} look={extra(seed + i)} pose={{ x, z, ry, ...alive(g, seed + i), armL: arm, armR: arm, smile: up, mouth: up * 0.6 }} />;
      })}
    </>
  );
};
/** tickets flying from the shop terminal onto the counter pile; each grows out of the terminal and shrinks into the pile, so the loop never pops */
const TicketStream: React.FC<{ t: number }> = ({ t }) => (
  <>
    {Array.from({ length: 8 }, (_, i) => {
      const k = ((t + i * 5) % 40) / 40;
      return <Ticket key={i} p={[0.85 - k * 0.65, 1.28 + Math.sin(k * Math.PI) * 0.22 - k * 0.08, -1.1 + k * 0.08]} r={[-1.2 + k, k * 3, k]} s={Math.min(1, k * 6, (1 - k) * 6)} seed={i} />;
    })}
  </>
);
/** falling tickets: each starts at its own frame, gone once it reaches `floor` */
const Rain: React.FC<{ t: number; len: number; x?: number; z?: number; w: number; d: number; n: number; top: number; speed: number; floor: number; seed: number }> = ({ t, len, x = 0, z = 0, w, d, n, top, speed, floor, seed }) => {
  const R = rng(seed);
  const drops = Array.from({ length: n }, () => [x + (R() - 0.5) * w, z + (R() - 0.5) * d, R() * len * 0.8, R() * 6] as const);
  return (
    <>
      {drops.map(([px, pz, at, s], i) => {
        const y = top - Math.max(0, t - at) * speed;
        return t > at && y > floor ? <Ticket key={i} p={[px, y, pz]} r={[(t + s) * 0.3, (t + s) * 0.2, s]} seed={i} /> : null;
      })}
    </>
  );
};
/** the 16th worker crossing the floor with a crate (the desks seat 15) */
const FloorLife: React.FC<{ g: number }> = ({ g }) => {
  const z = 2.2 - ((g * 0.035) % 8);
  return (
    <>
      <Person look={extra(36)} pose={{ x: 1.6, z, ry: 180, ...walk(g * 0.32, 18), armL: { f: 70, e: -30, o: 5 }, armR: { f: 70, e: -30, o: 5 } }} />
      <Crate p={[1.6, 0.85, z - 0.36]} s={0.7} />
    </>
  );
};
/** first and last picture (the loop): the camera in front of the globe, Mandel behind it, balls flying between him and you */
const GLOBE_A = cm([0, 2.1, 2.35], [0, 1.95, -1.3], 30);
const GLOBE_B = cm([0, 2.1, 2.2], [0, 1.95, -1.3], 30);
const REST = { o: 6, e: -8 };
const HOLD = { f: 85, e: -85, o: 14 };
const GLOBE_AT: V3 = [0, 0.47, -1.3];
const BALL_AT: V3 = [-0.14, 2.12, 0.7];
const GLOBE_POSE: Pose = { brow: 0.6, smile: 0.25, lookX: 0, lookY: 0, armL: REST, armR: REST };
/** ball 14: hangs in the air at k = 0, flies in an arc to the open hand at k = 1, then rests on it */
const FlyBall: React.FC<{ hand: V3; k: number }> = ({ hand, k }) => {
  const q = k * k * (3 - 2 * k);
  return <Ball n={14} p={[BALL_AT[0] + (hand[0] - BALL_AT[0]) * q, BALL_AT[1] + (hand[1] + 0.12 - BALL_AT[1]) * q + Math.sin(q * Math.PI) * 0.12, BALL_AT[2] + (hand[2] - BALL_AT[2]) * q]} r={0.11} />;
};
const GlobeFace: React.FC<{ g: number; balls: number; pose: Pose; children?: React.ReactNode }> = ({ g, balls, pose, children }) => (
  <Studio f={g} dim={0.65}>
    <DrawMachine f={balls} clear={0.3} skip={14} trail={0.6} />
    <Person look={CAST.mandel} pose={{ x: GLOBE_AT[0], y: GLOBE_AT[1], z: GLOBE_AT[2], ...pose }} />
    {children}
    {/* far and warm, so the face is lit and the near balls do not burn out */}
    <pointLight position={[0, 2.3, 4]} intensity={11} distance={8} color="#FFD9B0" />
  </Studio>
);
const AbandonedCrates: React.FC = () => (
  <>
    {Array.from({ length: 12 }, (_, i) => (
      <Crate key={i} p={[-2.4 - (i % 4) * 0.66, 0.15 + Math.floor(i / 4) * 0.43, -2.7 + (i % 2) * 0.12]} r={[0, ((i * 37) % 9) * 0.03, 0]} />
    ))}
    <pointLight position={[-2.6, 2.4, -1.4]} intensity={12} distance={6} color="#FFD49A" />
  </>
);
/** room tone per place: you only notice it when it cuts out at "They ran out of time" */
const ROOMS = [
  ["S2", "S5", "sfx/synth/room-shop.wav"],
  ["S6", "S6", "sfx/synth/room-office.wav"],
  ["S7", "S7", "sfx/synth/room-shop.wav"],
  ["S8", "S10", "sfx/synth/room-office.wav"],
  ["S13", "S13", "sfx/synth/room-warehouse.wav"],
  ["S17", "S17", "sfx/synth/room-shop.wav"],
  ["S21", "S21", "sfx/synth/room-chamber.wav"],
  ["S23", "S23", "sfx/synth/room-office.wav"],
  ["S28", "S28", "sfx/synth/room-shop.wav"],
  ["S29", "S30", "sfx/synth/room-warehouse.wav"],
  ["S36", "S36", "sfx/synth/room-shop.wav"],
  ["S41", "S41", "sfx/synth/room-office.wav"],
  ["S44", "S44", "sfx/synth/room-warehouse.wav"],
  ["S45", "S48", "sfx/synth/room-interview.wav"],
  ["S50", "S50", "sfx/synth/room-chamber.wav"],
  ["S54", "S54", "sfx/synth/room-office.wav"],
] as const;
/** the real draw of 15 Feb 1992 (Roanoke Times, 1992; see the fact table) */
const DRAWN = [8, 11, 13, 15, 19, 20];
const vaPins = scatter(VA, 125, 4);
const auXZ = scatter(AU, 12, 9)
  .map(([lon, lat]) => mapXZ("au", lon, lat))
  .sort((a, b) => a[0] - b[0]);

const S: Record<string, ShotFn> = {
  // ---- 1 · the guarantee
  S1: (t, len, g) => {
    const pose = act(t, [[0, GLOBE_POSE], [7, { lookX: 0.7, lookY: 0.4, yaw: 7, brow: 0.5, armL: REST, armR: REST }], [14, { lookX: 0.1, lookY: 0.3, yaw: -3, brow: 0.5, armL: REST, armR: { f: 18, e: -40, o: 10 }, tilt: 2, lean: 3 }], [24, { lookX: -0.8, lookY: 0.1, yaw: -14, brow: 0.9, armL: REST, armR: HOLD, tilt: -3, lean: -2 }], [31, { lookX: 0, lookY: 0, yaw: -6, pitch: 2, smile: 0.2, smirk: 0.9, browL: 1, armL: REST, armR: HOLD, tilt: -2 }], [len, { lookX: 0, lookY: 0, yaw: -1, pitch: -2, smile: 0.25, smirk: 1, browL: 1.1, heavy: 0.15, armL: REST, armR: HOLD, tilt: -1 }]]);
    return {
      light: "studio",
      cam: glide(GLOBE_A, GLOBE_B, t, len),
      world: (
        <GlobeFace g={g} balls={t * 0.3} pose={{ blink: t > 2 ? undefined : 0, ...pose }}>
          <FlyBall hand={handAt(-1, GLOBE_AT, pose.armR!)} k={ramp(t, 8, 24)} />
        </GlobeFace>
      ),
      over: <Chip x={500} y={300} at={0} text="14 JACKPOTS" kind="still" color={N.gold} size={70} />,
    };
  },
  S2: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0, 1.62, 1.3], [0.05, 1.3, -1.2], 50), cm([0, 1.6, 1.15], [0.05, 1.3, -1.2], 50), t, len),
    world: (
      <Kiosk f={g} board="" clerk={{ blink: alive(g, 3).blink, ...act(t, [[0, { armL: { f: 25, e: -40 }, armR: { f: 25, e: -40 }, yaw: -14, lookX: 0.6 }], [24, { armL: { f: 42, e: -55, o: 10 }, armR: { f: 42, e: -55, o: 10 }, lean: 12, lookY: -0.4, pitch: 8, brow: 0.9 }], [len, { armL: { f: 46, e: -55, o: 10 }, armR: { f: 46, e: -55, o: 10 }, lean: 16, lookY: -0.4, pitch: 10, brow: 1, smile: 0.5 }]]) }}>
        <PovHand t={t} />
        <Ticket p={[0.04, 1.5, 0.6]} r={[-0.15, 0, 0.1]} s={1.25} seed={1} />
      </Kiosk>
    ),
  }),
  S3: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0, 1.8, 3.4], [0, 1.0, -0.6], 50), cm([0, 2.3, 5.6], [0, 1.0, -0.6], 50), t, len),
    world: (
      <Kiosk f={g} board="" clerk={{ blink: alive(g, 3).blink, ...act(t, [[0, { lookY: -0.5, pitch: 12, armL: { f: 30, e: -40 }, armR: { f: 30, e: -40 } }], [len * 0.55, { lookY: 0.2, pitch: -6, mouth: 0.5, brow: 1, armL: { f: 60, o: 30, e: -70 }, armR: { f: 60, o: 30, e: -70 } }], [len, { lookY: 0.5, pitch: -14, mouth: 0.9, brow: 1, lean: -6, armL: { f: 95, o: 40, e: -80 }, armR: { f: 95, o: 40, e: -80 } }]]) }}>
        <Pile n={2600} r={1.9} h={1.5} p={[0, 0, 0.9]} k={ramp(t, 0, len * 0.75)} seed={5} />
        <Rain t={t} len={len} z={0.9} w={3} d={1.6} n={90} top={3.6} speed={0.2} floor={0.5} seed={3} />
      </Kiosk>
    ),
  }),
  S4: (t, len, g) => {
    const a = act(t, [[0, { pitch: 2, mouth: 0.2, smile: 0.5, armL: { f: 30, e: -50 }, armR: { f: 40, e: -50 } }], [10, { pitch: -22, mouth: 1, smile: 1, blink: 0.9, lean: -8, armL: { f: 30, e: -95, o: 5 }, armR: { f: 60, e: -60, o: 12 } }], [30, { pitch: -24, mouth: 1, smile: 1, blink: 0.9, lean: -10, armL: { f: 30, e: -95, o: 5 }, armR: { f: 40, e: -30, o: 12 } }], [len, { pitch: 5, mouth: 0.75, smile: 1, squint: 0.7, lean: 8, yaw: 8, armL: { f: 30, e: -80, o: 5 }, armR: { f: 92, e: -6, o: -6 } }]]);
    return {
      light: "warm",
      cam: glide(cm([0.35, 1.68, 0.9], [0, 1.6, -1.9], 42), cm([0.3, 1.68, 0.75], [0, 1.62, -1.9], 42), t, len),
      world: <Kiosk f={g} clerk={{ ...a, lean: (a.lean ?? 0) + Math.sin(t * 0.9) * 3.5, roll: Math.sin(t * 1.1) * 3, y: Math.abs(Math.sin(t * 0.9)) * 0.03 }}><pointLight position={[0.2, 1.9, -1.0]} intensity={1.6} distance={2.2} color="#FFD6A0" /></Kiosk>,
    };
  },
  S5: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([-0.32, 1.45, -0.58], [-0.4, 1.06, -1.08], 38), cm([-0.34, 1.4, -0.66], [-0.4, 1.06, -1.08], 38), t, len),
    world: (
      <Kiosk f={g} board="" clerk={null}>
        <Calculator p={[-0.4, 1.06, -1.08]} r={[0, 0.15, 0]} text={String(Math.floor(ramp(t, 0, len, 0, 7_059_052)))} />
        <PressHand p={[-0.4, 1.125, -1.02]} r={[1.35, 0, -1.0]} s={0.75} sleeve={CAST.clerk.top} dip={Math.abs(Math.sin(t * 0.9)) * 0.016} />
      </Kiosk>
    ),
  }),
  // ---- 2 · the rule
  S6: (t, len, g) => {
    const eco = loc("S6", wd("05", "economist"));
    const not = loc("S6", wd("05", "not"));
    const L_ = { f: 45, e: -50, o: 10 };
    const up = { f: 56, e: -92, o: 3 };
    return {
      light: "warm",
      cam: glide(cm([0.85, 1.3, 2.7], [0.1, 0.9, -0.5], 38), cm([0.25, 1.24, 1.3], [0, 1.12, -0.75], 38), t, len),
      world: (
        <Office f={g}>
          <Person look={CAST.mandel} pose={sit(act(t, [[0, { pitch: 14, lookY: -0.95, heavy: 0.4, yaw: -4, armL: L_, armR: { f: 48 + Math.sin(t * 0.9) * 4, e: -56, o: 10 } }], [12, { pitch: 14, lookY: -0.95, heavy: 0.4, yaw: -4, armL: L_, armR: { f: 48, e: -56, o: 10 } }], [24, { pitch: 1, lookY: 0.1, yaw: 9, brow: 0.8, smile: 0.25, armL: L_, armR: { f: 46, e: -55, o: 10 } }], [Math.max(30, eco), { pitch: -2, yaw: -5, roll: -4, brow: 0.5, smile: 0.5, armL: L_, armR: up }], [Math.max(40, not - 5), { pitch: 1, yaw: 3, roll: 2, smile: 0.4, armL: L_, armR: up }], [Math.max(45, not), { yaw: -13, smile: 0.3, brow: 0.5, armL: L_, armR: up }], [Math.max(51, not + 6), { yaw: 13, smile: 0.3, brow: 0.5, armL: L_, armR: up }], [Math.max(57, not + 12), { yaw: -5, smile: 0.7, brow: 0.9, armL: L_, armR: { f: 48, e: -62, o: 8 } }]]))} />
        </Office>
      ),
    };
  },
  S7: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([2.3, 1.65, 1.5], [0.2, 1.3, -0.6], 42), cm([2.15, 1.65, 1.35], [0.2, 1.3, -0.6], 42), t, len),
    world: (
      <Kiosk f={g} board="" clerk={{ x: -0.5, blink: alive(g, 3).blink, mouth: 0.6, brow: 1, lookY: -0.5, pitch: 12, armL: { f: 40, e: -40 }, armR: { f: 40, e: -40 } }}>
        <Person look={CAST.mandel} pose={{ z: -0.3, x: 0.2, ry: 180, ...walk(0), ...act(t, [[0, { armL: { f: 60, e: -35, o: 12 }, armR: { f: 60, e: -35, o: 12 } }], [len, { lean: 8, armL: { f: 82, e: -15, o: 8 }, armR: { f: 82, e: -15, o: 8 } }]]), y: 0, legL: {}, legR: {} }} />
        <Pile n={500} r={0.5} h={0.35} p={[0.2, 1.06, -1.15]} seed={8} />
      </Kiosk>
    ),
  }),
  S8: (t, len, g) => {
    const k = ramp(t, 1, len * 0.6);
    return {
      light: "warm",
      cam: glide(cm([-1.84, 2.85, 0.85], [-1.84, 2.85, -2.27], 44), cm([-1.82, 2.85, 0.72], [-1.84, 2.85, -2.27], 44), t, len),
      world: (
        <Office f={g} board={{ lines: ["COUNT", "WAIT", "BUY"], k }}>
          <PressHand p={[-2.58 + ((60 + 480 * k) / 1024) * 2.16, 2.95 + Math.sin(t * 1.6) * 0.03, -2.18]} r={[2.2, 0, -0.35]} s={1.5} sleeve={CAST.mandel.top} skin={CAST.mandel.skin} hold={<Box w={0.018} h={0.09} d={0.018} c="#F4F1E8" p={[0, -0.05, 0]} shadow={false} />} />
        </Office>
      ),
    };
  },
  S9: (t, len, g) => {
    const n = 14 * 16;
    return {
      light: "stage",
      cam: glide(cm([0, 4.7, 3.3], [0, 0.5, -1.25], 44), cm([0, 4.5, 3.1], [0, 0.5, -1.25], 44), t, len),
      world: (
        <Void>
          {Array.from({ length: n }, (_, i) => {
            const k = ramp(t, (i / n) * len * 0.8, (i / n) * len * 0.8 + 3);
            return k > 0 ? <Ticket key={i} p={[((i % 14) - 6.5) * 0.175, 0.002, (Math.floor(i / 14) - 7.5) * 0.245]} s={k * 1.35} seed={i} /> : null;
          })}
          <Person look={CAST.mandel} pose={{ z: -2.15, blink: alive(g, 1).blink, ...act(t, [[0, { pitch: 26, lookY: -0.8, yaw: -18, lookX: -0.5, armR: { f: 40, e: -70 }, armL: { o: 8 } }], [len, { pitch: 26, lookY: -0.8, yaw: 18, lookX: 0.5, armR: { f: 40, e: -70 }, armL: { o: 8 }, brow: 0.5 }]]) }} />
        </Void>
      ),
    };
  },
  S10: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([-0.9, 2.0, 4.2], [-0.9, 1.9, -1.5], 50), cm([-0.85, 2.0, 4.0], [-0.9, 1.9, -1.5], 50), t, len),
    world: (
      <Office f={g} clockH={10 + t * 0.12} board={{ lines: ["COUNT", "WAIT", "BUY"], k: 1 + ramp(t, 0, len * 0.7), tick: 1 }}>
        <Person look={CAST.mandel} pose={sit({ blink: mandelLife(g).blink, armL: { f: 45, e: -100, o: -25 }, armR: { f: 40, e: -100, o: -25 }, ...act(t, [[0, { yaw: 28, pitch: -8, lookX: 1, lookY: 0.5 }], [len, { yaw: 34, pitch: -12, lookX: 1, lookY: 0.7, roll: -4, brow: 0.4 }]]) })} />
      </Office>
    ),
  }),
  S11: (t, len, g) => {
    const x = loc("S11", wd("09", "three"));
    const h = t < x ? ramp(t, 0, x, 0.1, 3.0) : ramp(t, x, len, 3.0, 3.3);
    return {
      light: "stage",
      cam: glide(cm([0, 1.7, 7.2], [0, 1.5, 0], 42), cm([0, 2.0, 7.4], [0, 2.0, 0], 42), t, len),
      world: (
        <Void>
          <TicketTower p={[-0.9, 0, 0]} h={1.0} />
          <Panel map={signTex("COST", "#0C0C12", N.cream, 512, 128, 84)} w={0.95} h={0.24} p={[-0.9, 1.2, 0.1]} glow={1.1} />
          <CoinTower p={[0.1, 0, 0]} h={h} />
          <Person look={CAST.mandel} pose={{ x: 0.85, z: 0.6, blink: alive(g, 1).blink, ...act(t, [[0, { yaw: -22, pitch: -6, lookX: -0.6, armR: { f: 25, e: -15 }, armL: { o: 8 } }], [x, { yaw: -24, pitch: -18, lookX: -0.7, lookY: 0.6, brow: 0.8, smile: 0.3, armR: { f: 148, e: -8, o: 14 }, armL: { o: 8 } }], [len, { yaw: -24, pitch: -24, lookX: -0.7, lookY: 0.7, brow: 0.8, smile: 0.7, armR: { f: 152, e: -8, o: 14 }, armL: { o: 8 } }]]) }} />
        </Void>
      ),
      over: <Chip x={560} y={340} at={shot("S11").from + x} text="3×" color={N.gold} size={110} />,
    };
  },
  S12: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 3.2, 6.8], [0, 0.75, -1.2], 46), cm([0, 3.8, 7.6], [0, 0.6, -1.6], 46), t, len),
    world: (
      <Void>
        <Person look={CAST.mandel} pose={{ z: 1.6, blink: mandelLife(g).blink, ...act(t, [[0, { pitch: -8, smile: 0.3, armL: { o: 8 }, armR: { o: 8 } }], [18, { pitch: -14, smile: 0.9, brow: 0.6, armL: { f: 45, o: 30, e: -45 }, armR: { f: 45, o: 30, e: -45 } }], [len, { pitch: -14, smile: 1, brow: 0.5, armL: { f: 62, o: 42, e: -38 }, armR: { f: 62, o: 42, e: -38 } }]]) }} />
        <Crowd g={g} n={90} />
      </Void>
    ),
  }),
  S13: (t, len, g) => ({ light: "warm", cam: glide(cm([-1.15, 1.3, 2.25], [-1.75, 0.8, 1.05], 40), cm([-1.2, 1.28, 2.15], [-1.75, 0.8, 1.05], 40), t, len), world: <Warehouse f={g} t={g * 2} /> }),
  S14: (t, len) => ({ light: "stage", cam: glide(cm([0, 0.42, 0.16], [0, 0, 0], 40), cm([0, 0.38, 0.14], [0, 0, 0], 40), t, len), world: <Void><Ticket p={[0, 0.002 + 0.33 * (1 - (Math.min(t, 16) / 16) ** 2), 0]} seed={2} glow={0.15} /></Void> }),
  S15: (t, len) => {
    const y = (i: number) => 2.4 * (1 - ramp(t, 2 + i * 3, 14 + i * 3) ** 2);
    return {
      light: "stage",
      cam: glide(cm([0.6, 1.0, 1.1], [0, 0.35, 0], 40), cm([0.55, 0.95, 1.0], [0, 0.35, 0], 40), t, len),
      world: (
        <Void>
          <group position={[0, y(0), 0]}>
            <Crate p={[0, 0, 0]} />
            {Array.from({ length: 8 }, (_, i) => (
              <Bundle key={i} p={[-0.18 + (i % 4) * 0.12, 0.43, -0.1 + Math.floor(i / 4) * 0.17]} />
            ))}
          </group>
          <Crate p={[-0.7, y(1), -0.3]} r={[0, 0.3, 0]} />
          <Crate p={[0.65, y(2), -0.5]} r={[0, -0.2, 0]} />
        </Void>
      ),
    };
  },
  S16: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([2.4, 0.9, 6.6], [0, 1.4, 0], 46), cm([2.6, 1.0, 7.4], [0, 1.4, 0], 46), t, len),
    world: (
      <Void>
        <Pile n={5000} r={3.2} h={2.5} k={ramp(t, 0, 12, 0.35, 1)} seed={6} />
        <Rain t={t} len={len} w={5} d={4} n={70} top={6} speed={0.3} floor={0.8} seed={16} />
        <Person look={CAST.mandel} pose={{ x: 1.2, z: 3.0, ry: -20, blink: alive(g, 1).blink, ...act(t, [[0, { pitch: -6, armL: { f: 20, o: 25, e: -100 }, armR: { f: 20, o: 25, e: -100 } }], [len, { pitch: -28, lookY: 0.8, smile: 0.7, armL: { f: 20, o: 25, e: -100 }, armR: { f: 20, o: 25, e: -100 } }]]) }} />
      </Void>
    ),
  }),
  // ---- 3 · Romania → Australia
  S17: (t, len, g) => {
    const up = loc("S17", wd("14", "and"));
    const pose = act(t, [[0, { pitch: 16, yaw: -6, lookY: -0.7, armR: { f: 30, e: -62, o: 6 }, armL: { o: 6 } }], [up - 2, { pitch: 14, yaw: -4, lookY: -0.7, armR: { f: 30, e: -62, o: 6 }, armL: { o: 6 } }], [up + 4, { pitch: 10, lookY: -0.2, lean: 7, brow: 0.6, armR: { f: 16, e: -92, o: 6 }, armL: { o: 8, f: 6, e: -18 }, shrug: 0.3 }], [up + 12, { pitch: 2, lookY: 0.1, lean: 1, tilt: -2, brow: 0.9, smile: 0.6, mouth: 0.4, armR: { f: 82, e: -112, o: 10 }, armL: { o: 10, f: 8, e: -24 }, shrug: 0.4 }], [up + 20, { pitch: -8, lookY: 0.2, lean: -5, tilt: -6, smile: 1, mouth: 0.8, brow: 1, squint: 0.3, armR: { f: 148, e: -30, o: 14 }, armL: { o: 14, f: 12, e: -30 }, shrug: 0.5 }], [up + 28, { pitch: -3, lookY: 0, lean: -2, tilt: -4, smile: 1, mouth: 0.55, brow: 0.8, squint: 0.35, armR: { f: 136, e: -24, o: 12 }, armL: { o: 10, f: 8, e: -22 }, shrug: 0.2 }], [len, { pitch: -4, lookY: 0, yaw: 5, lean: -2, tilt: -3, smile: 1, mouth: 0.5, brow: 0.7, squint: 0.4, armR: { f: 138, e: -26, o: 12 }, armL: { o: 10, f: 8, e: -22 } }]]);
    const ar = pose.armR!;
    return {
      light: "warm",
      filter: "sepia(0.35) saturate(0.85)",
      cam: glide(cm([0, 1.55, 3.3], [0, 1.7, -0.5], 42), cm([0, 1.55, 3.0], [0, 1.72, -0.5], 42), t, len),
      world: (
        <Kiosk f={g} sign="LOTO" board="ROMANIA" jackpot={null} clerk={{ ...alive(g, 3), lookY: 0.2 }}>
          <Person look={CAST.mandel} pose={{ z: 0.2, ...pose }} holdR={<Ticket r={[((ar.f ?? 0) - (ar.e ?? 0)) * D, 0, 0]} p={[0, -0.05, 0.03]} s={1.5} seed={3} />} />
        </Kiosk>
      ),
    };
  },
  S18: (t, len) => {
    const at12 = loc("S18", wd("15", "twelve"));
    const i = Math.max(0, Math.min(10.99, (t - at12) / 2.6));
    const a = auXZ[Math.floor(i)];
    const b = auXZ[Math.floor(i) + 1];
    const q = i - Math.floor(i);
    const inK = ramp(t, at12 - 12, at12);
    return {
      light: "day",
      cam: glide(cm([0.4, 27, 9.2], [0.4, 0, 0.6], 45), cm([0.4, 26, 8.8], [0.4, 0, 0.6], 45), t, len),
      world: (
        <MapTable m="au" k={ramp(t, 0, 16)}>
          {auXZ.map(([x, z], n) => <Pin key={n} p={[x, 0.3, z]} k={ramp(t, at12 + n * 2.6, at12 + 6 + n * 2.6)} c={N.gold} s={3.6} />)}
          {inK > 0 ? <PressHand p={[a[0] + (b[0] - a[0]) * q + (1 - inK) * 6, 2.3 + (1 - inK) * 5, a[1] + (b[1] - a[1]) * q + (1 - inK) * 7]} r={[0.9, 0, -0.45]} s={13} sleeve={CAST.mandel.top} skin={CAST.mandel.skin} /> : null}
        </MapTable>
      ),
      box: 18,
      over: <Chip x={500} y={330} at={shot("S18").from + at12} to={12} post=" JACKPOTS" kind="count" dur={28} color={N.gold} />,
    };
  },
  S20: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 2.1, 6.2], [0, 1.4, 0], 44), cm([0, 2.0, 5.8], [0, 1.4, 0], 44), t, len),
    world: (
      <Void>
        <Pile n={3000} r={2.6} h={1.1} k={ramp(t, 0, len)} seed={11} />
        <Rain t={t} len={len} w={5} d={3} n={140} top={6.5} speed={0.22} floor={0.3} seed={20} />
        <Person look={CAST.mandel} pose={{ z: 2.75, blink: alive(g, 1).blink, ...act(t, [[0, { pitch: -14, lookY: 0.5, smile: 0.4, armL: { f: 20, o: 20 }, armR: { f: 20, o: 20 } }], [30, { pitch: -24, lookY: 0.7, smile: 1, brow: 0.8, mouth: 0.4, armL: { f: 150, o: 26, e: -10 }, armR: { f: 150, o: 26, e: -10 } }], [len, { pitch: -26, lookY: 0.7, smile: 1, brow: 0.8, mouth: 0.5, armL: { f: 160, o: 24, e: -10 }, armR: { f: 160, o: 24, e: -10 } }]]) }} />
      </Void>
    ),
    over: <Chip x={540} y={330} at={shot("S20").from + 3} to={400_000} pre="~" post=" PRIZES" kind="count" dur={len - 20} />,
  }),
  S21: (t, len, g) => {
    const hit = loc("S21", wd("15", "laws"));
    const st = loc("S21", wd("15", "stop"));
    return {
      light: "warm",
      cam: glide(cm([-0.6, 1.5, 1.75], [-0.15, 1.42, 0], 40), cm([0.02, 2.02, 1.1], [0, 1.22, 0.1], 40), t, len),
      world: (
        <Chamber f={g}>
          <GavelBlock p={[-0.48, 1.17, 0.12]} />
          {Array.from({ length: 6 }, (_, i) => (
            <Bundle key={i} p={[-0.11 + (i % 3) * 0.11, 1.17, 0.07 + Math.floor(i / 3) * 0.16]} />
          ))}
          <Person look={CAST.lawmaker} pose={{ z: -0.75, ...act(t, [[0, { pitch: 6, yaw: 8, frown: 0.5, lean: 2 }], [hit, { pitch: 14, yaw: -4, frown: 0.9, lean: 8 }], [hit + 8, { pitch: 8, yaw: 0, frown: 0.8, lean: 4 }], [st, { pitch: 16, yaw: 0, frown: 0.7, lookY: -0.6, lean: 6 }]]), armL: { f: 40, e: -40 }, armR: { ...strikeArm(strike(t, [hit])), o: 26 } }} holdR={<GavelHeld />} />
          <Stamp p={[0, 1.25, 0.15]} k={t < st ? ramp(t, st - 5, st) : ramp(t, st + 4, st + 12, 1, 0)} word="NEW LAW" printed={t >= st} />
        </Chamber>
      ),
    };
  },
  // ---- 4 · the Virginia target
  S23: (t, len, g) => {
    const up = loc("S23", wd("16", "bigger"));
    return {
      light: "warm",
      cam: glide(cm([1.4, 1.62, 3.0], [0, 0.88, -0.2], 42), cm([1.3, 1.6, 2.75], [0, 0.88, -0.2], 42), t, len),
      world: (
        <Office f={g} night>
          <Person look={CAST.mandel} pose={{ z: -0.6, blink: alive(g, 1).blink, ...act(t, [[0, { lean: 14, pitch: 28, lookY: -0.7, armL: { f: 40, e: -40, o: 8 }, armR: { f: 40, e: -40, o: 8 } }], [up, { lean: 14, pitch: 26, lookY: -0.7, armL: { f: 40, e: -40, o: 8 }, armR: { f: 40, e: -40, o: 8 } }], [up + 12, { lean: 6, pitch: 2, yaw: 18, lookX: 0.6, smile: 0.7, brow: 0.8, armL: { f: 40, e: -40, o: 8 }, armR: { f: 62, e: -35, o: -4 } }], [len, { lean: 6, pitch: 0, yaw: 20, lookX: 0.6, smile: 0.8, brow: 0.6, armL: { f: 40, e: -40, o: 8 }, armR: { f: 62, e: -35, o: -4 } }]]) }} />
          <MiniMap m="va" p={[-0.1, 0.775, 0.12]} s={0.1} glow={ramp(t, 10, 40)} />
          <Box w={1.12} h={0.62} d={0.03} c="#2A1A12" p={[-1.75, 1.3, -2.28]} />
          <Panel map={signTex("1992", "#F3EAD6", "#8A2A34", 512, 256, 150)} w={1.04} h={0.52} p={[-1.75, 1.61, -2.26]} />
        </Office>
      ),
    };
  },
  S24: (t, len) => ({
    light: "day",
    cam: glide(cm([0, 23.5, 6.6], [0, 0, 0.4], 45), cm([0, 22.8, 6.4], [0, 0, 0.4], 45), t, len),
    world: (
      <MapTable m="va" k={ramp(t, 0, 10)} glow={ramp(t, 6, 20)}>
        <PressHand p={[-0.8, 0.45 + (1 - ramp(t, 2, 12)) * 6, 0.4]} r={[0.9, 0, -0.45]} s={11} sleeve={CAST.mandel.top} skin={CAST.mandel.skin} />
      </MapTable>
    ),
    box: 18,
    over: <Chip x={500} y={330} at={shot("S24").from + 4} text="VIRGINIA" kind="slide" />,
  }),
  S25: (t, len, g) => ({
    light: "studio",
    cam: glide(cm([1.92, 1.45, 3.65], [1.92, 1.3, 0.6], 40), cm([1.92, 1.45, 3.45], [1.92, 1.3, 0.6], 40), t, len),
    world: (
      <Studio f={g}>
        <DrawMachine f={g} drawn={DRAWN} k={Math.floor(ramp(t, 0, len * 0.7, 0.5, 6.99))} />
        <LedBoard p={[1.92, 2.05, -0.6]} text="6 OF 44" w={1.5} c={N.gold} glow={1.25} />
        <Box w={1.5} h={0.03} d={0.03} c={N.gold} p={[1.92, 0.86, 0.72]} o={{ e: N.gold, ei: 1.1 }} shadow={false} />
        <pointLight position={[1.92, 2.3, 2.2]} intensity={0.9} distance={5} color="#FFE2B8" />
      </Studio>
    ),
  }),
  S26: (t, len, g) => {
    const end = loc("S26", wd("19", "combinations"));
    return {
      light: "stage",
      cam: glide(cm([0, 2.2, 7.6], [0, 1.0, 0], 44), cm([0, 2.4, 8.2], [0, 1.0, 0], 44), t, len),
      world: (
        <Void>
          <Pile n={5000} r={3.1} h={2.2} k={ramp(t, 0, end)} seed={12} />
          <LedBoard p={[0, 3.3, -1.5]} text={Math.round(7_059_052 * (1 - (1 - ramp(t, 2, end)) ** 3)).toLocaleString("en-US")} w={3.3} c={N.gold} glow={1.25} />
          <Person look={CAST.mandel} pose={{ x: 0.7, z: 2.9, ...act(t, [[0, { ry: 18, yaw: 6, pitch: 0, lookX: 0.2, armL: { o: 8 }, armR: { o: 8 } }], [end * 0.3, { ry: -45, yaw: -14, pitch: -10, lookY: 0.5, brow: 0.6, armL: { o: 8 }, armR: { o: 8 } }], [end, { ry: -52, yaw: -18, pitch: -24, lookY: 0.8, brow: 1, mouth: 0.5, armL: { f: 18, o: 22, e: -20 }, armR: { f: 18, o: 22, e: -20 } }], [len, { ry: -40, yaw: 6, pitch: -8, lookX: 0.5, lookY: 0.2, brow: 0.8, smirk: 0.7, armL: { f: 18, o: 22, e: -20 }, armR: { f: 18, o: 22, e: -20 } }]]) }} />
        </Void>
      ),
    };
  },
  S27: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.04, 2.0, -0.9], [0.04, 1.06, -1.2], 40), cm([0.04, 1.94, -0.92], [0.04, 1.06, -1.2], 40), t, len),
    world: (
      <Kiosk f={g} board="" clerk={null}>
        <HeroTicket p={[-0.06, 1.066, -1.2]} r={[-Math.PI / 2, 0, 0]} s={1} row={[3, 14, 22, 27, 35, 41]} lit={0} seed={4} single />
        <Bill p={[ramp(t, 0, 10, 0.5, 0.08), 1.068, -1.18]} r={[-Math.PI / 2, 0, 0.2]} />
      </Kiosk>
    ),
    over: <Chip x={540} y={330} at={shot("S27").from + 8} text="$1 EACH" kind="pop" />,
  }),
  S28: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([2.05, 1.85, 2.5], [2.3, 2.05, -2.84], 50), cm([2.1, 1.85, 2.25], [2.3, 2.05, -2.84], 50), t, len),
    world: (
      <Kiosk f={g} jackpot={Math.round(ramp(t, 0, len - 14, 15_500_000, 27_000_000) / 1000) * 1000} clerk={null}>
        <Person look={CAST.mandel} pose={{ x: 1.72, z: 0.3, ry: 172, pitch: -16, armL: { o: 6 }, armR: { o: 6 } }} />
      </Kiosk>
    ),
  }),
  // ---- 5 · the race
  S29: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([2.0, 3.4, 6.2], [0.3, 1.8, -6], 46), cm([1.6, 3.2, 5.8], [0.3, 1.8, -6], 46), t, len),
    world: (
      <Warehouse f={g} t={g * 2}>
        <FloorLife g={g} />
      </Warehouse>
    ),
    box: 14,
  }),
  S30: (t, len, g) => ({
    light: "warm",
    // one glide along the row; the number changes on the wall board as each word is spoken
    cam: glide(cm([-1.5, 2.1, 3.3], [-2.4, 1.75, -3], 46), cm([-0.9, 1.95, 1.7], [-1.9, 1.75, -3], 46), t, len),
    world: (
      <Warehouse f={g} t={g * 2} sign="">
        <FloorLife g={g} />
        <LedBoard p={[-2.1, 3.05, -3.4]} text={g < wd("21", "thirty") ? "16 WORKERS" : g < wd("21", "twelve") ? "30 COMPUTERS" : "12 PRINTERS"} w={1.9} c={N.gold} glow={1.25} />
      </Warehouse>
    ),
    box: 14,
  }),
  S33: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 4.4, 8.6], [0, 0.4, -2], 46), cm([0, 4.1, 8.1], [0, 0.4, -2], 46), t, len),
    world: <Void><Crowd g={g} n={130} z0={1} seed={90} spread={1.1} cheer={ramp(t, 8, 42)} /></Void>,
    over: <Chip x={540} y={330} at={shot("S33").from + 2} to={2500} post=" INVESTORS" kind="count" dur={30} />,
  }),
  S34: (t, len, g) => {
    // the courier backs out of the van's rear doors with a crate (camera behind the van, shop beyond)
    const k = ramp(t, 6, len);
    const px = -3.6 - k * 0.9;
    return {
      light: "night",
      cam: glide(cm([-7.6, 1.7, 2.2], [-1.9, 1.5, -2.6], 46), cm([-7.3, 1.68, 2.0], [-1.9, 1.5, -2.6], 46), t, len),
      world: (
        <Street f={g}>
          <Van p={[-1.2, 0, -1.4]} ry={90} doors={ramp(t, 0, 8)} />
          {Array.from({ length: 6 }, (_, i) => (
            <Crate key={i} p={[-2.5 + Math.floor(i / 2) * 0.65, 0.4 + (i % 2) * 0.43, -1.4]} r={[0, Math.PI / 2, 0]} />
          ))}
          <Person look={CAST.courier} pose={{ x: px, z: -1.25, ry: -90, ...walk(t * 0.3, 14), armL: { f: 70, e: -30, o: 5 }, armR: { f: 70, e: -30, o: 5 } }} />
          <Crate p={[px - 0.36, 0.85, -1.25]} r={[0, Math.PI / 2, 0]} s={0.7} />
        </Street>
      ),
    };
  },
  S35: (t, len) => ({
    light: "day",
    cam: glide(cm([0, 23.5, 6.6], [0, 0, 0.4], 45), cm([0, 22.4, 6.3], [0, 0, 0.4], 45), t, len),
    world: (
      <MapTable m="va">
        {vaPins.map(([lon, lat], i) => {
          const [x, z] = mapXZ("va", lon, lat);
          return <Pin key={i} p={[x, 0.3, z]} k={ramp(t, 4 + (i / 125) * (len - 20), 10 + (i / 125) * (len - 20))} s={0.9} />;
        })}
        {[0, 1, 2, 3, 4].map((i) => {
          const a = vaPins[i * 20];
          const b = vaPins[i * 20 + 7];
          const [ax, az] = mapXZ("va", a[0], a[1]);
          const [bx, bz] = mapXZ("va", b[0], b[1]);
          const k = ramp(t, 0, len);
          return (
            <group key={i} position={[ax + (bx - ax) * k, 0.3, az + (bz - az) * k]} scale={0.16}>
              <Van ry={Math.atan2(bx - ax, bz - az) / D} />
            </group>
          );
        })}
      </MapTable>
    ),
    box: 18,
    over: <Chip x={500} y={330} at={shot("S35").from + 4} to={125} post=" SHOPS" kind="count" dur={len - 20} />,
  }),
  S36: (t, len, g) => {
    const flail = Math.sin(t * 0.9);
    return {
      light: "warm",
      filter: CCTV_FILTER,
      cam: cm([3.4, 3.2, 2.6], [0, 0.9, -1.2], 62),
      world: (
        <Kiosk f={g} board="" clerk={{ armL: { f: 62 - flail * 12, e: -55 }, armR: { f: 62 + flail * 14, e: -58 }, pitch: 14, yaw: flail * 10, lookY: -0.5, worry: ramp(t, 30, len), lean: 6 + flail * 2 }}>
          <Person look={CAST.courier} pose={{ x: 0.3 + Math.sin(t * 0.05) * 0.5, z: -0.35, ry: 180 + Math.cos(t * 0.05) * 40, ...walk(t * 0.4, 16), armL: { f: 60, e: -30 }, armR: { f: 60, e: -30 } }} />
          {Array.from({ length: Math.floor(ramp(t, 0, len, 3, 12)) }, (_, i) => (
            <Crate key={i} p={[-0.9 - (i % 3) * 0.66, Math.floor(i / 3) * 0.43, -0.3]} />
          ))}
          <Pile n={800} r={0.55} h={0.42} p={[0.2, 1.06, -1.05]} k={ramp(t, 0, len, 0.2, 1)} seed={15} />
          <TicketStream t={t} />
        </Kiosk>
      ),
      over: (
        <>
          <Cctv cam="CAM 04" />
          <Chip x={540} y={440} at={shot("S36").from + 4} text="72 HOURS" kind="type" dur={10} />
        </>
      ),
    };
  },
  // ---- 6 · the terrifying gap
  S38: (t, len, g) => {
    const left = Math.max(0, 3 - Math.floor(t / 15));
    const chest = { f: 44, e: -112, o: -10 };
    return {
      light: "studio",
      filter: "saturate(1.1) brightness(0.95)",
      cam: glide(cm([0, 1.74, 2.4], [0, 1.85, 0], 40), cm([0, 1.74, 2.15], [0, 1.85, 0], 40), t, len),
      world: (
        <Void c="#1A0E12">
          <LedBoard p={[0, 2.45, -0.6]} text={`00:00:0${left}`} w={1.05} glow={left ? 1.5 : 2.3} />
          {/* rim only: the skin stays skin, the red is on his edge */}
          <pointLight position={[0.15, 2.05, -0.42]} intensity={left ? 2 : 3.6} distance={1.5} color="#FF4A3A" />
          <pointLight position={[0.5, 2.0, 2.2]} intensity={2.2} distance={3.4} color="#FFD9B8" />
          <Person look={CAST.mandel} pose={act(t, [[0, { pitch: 0, yaw: 4, lookX: 0.2, lookY: 0, worry: 0.3, armL: REST, armR: REST }], [8, { pitch: 0, yaw: 4, lookX: 0.2, worry: 0.3, armL: REST, armR: REST }], [14, { pitch: -14, yaw: -38, lookX: -1, lookY: 0.9, worry: 0.7, shrug: 0.7, twist: -8, armL: { f: 16, e: -30, o: 10 }, armR: { f: 16, e: -30, o: 10 } }], [38, { pitch: -16, yaw: -40, lookX: -1, lookY: 0.9, worry: 0.8, shrug: 0.8, twist: -10, mouth: 0.15, armL: chest, armR: { f: 20, e: -40, o: 10 } }], [46, { pitch: 3, yaw: 2, lookX: 0, lookY: 0, worry: 1, mouth: 0.55, smile: -0.5, shrug: 1, armL: chest, armR: chest }], [len, { pitch: 4, yaw: 2, worry: 1, mouth: 0.6, smile: -0.6, shrug: 1, armL: chest, armR: chest }]])} />
        </Void>
      ),
    };
  },
  S39: (t, len, g) => {
    // the shutter accelerates down the whole line and lands right after "time"; then the lamp dies and the pause holds
    const land = lineEnd("26") - shot("S39").from;
    const run = Math.min(t, land);
    const after = Math.max(0, t - land);
    return {
      light: "night",
      cam: glide(cm([2.0, 1.6, 6.0], [0.35, 1.6, -4], 44), cm([1.8, 1.6, 5.7], [0.35, 1.6, -4], 44), t, len),
      world: (
        <Street f={g} closed={t >= land + 4} shutter={ramp(t, 1, land) ** 2} dark={t >= land + 4}>
          <Person look={CAST.courier} pose={{ x: 1.15, z: -1.9 - run * 0.042, ry: 200, ...(after ? {} : walk(run * 0.5, 28)), pitch: after ? ramp(after, 0, 10, -5, 26) : -5, lean: ramp(after, 0, 10, 0, 12), armL: { f: ramp(after, 0, 8, 70, 8), e: ramp(after, 0, 8, -30, -10) }, armR: { f: ramp(after, 0, 8, 70, 8), e: ramp(after, 0, 8, -30, -10) } }} />
          <Crate p={[1.02, Math.max(0, 0.85 - after * after * 0.03), -2.25 - run * 0.042]} r={[0, (20 + after * 2) * D, 0]} s={0.7} />
        </Street>
      ),
    };
  },
  S40: (t, len, g) => {
    const stand = { legL: {}, legR: {}, y: 0, pitch: 10, lookY: -0.3, worry: 0.5, armL: { o: 8 }, armR: { o: 8 } };
    const down = { legL: { f: 86, k: 86 }, legR: { f: 86, k: 86 }, y: -0.4, lean: 14, pitch: 2, lookY: -0.5, worry: 1, smile: -0.6, heavy: 0.3, armL: { f: 42, e: -72, o: 4 }, armR: { f: 42, e: -72, o: 4 } };
    return {
      light: "night",
      cam: glide(cm([0.7, 1.75, 2.5], [-2.7, 0.9, -3], 44), cm([-0.8, 1.08, 0.2], [-2.05, 0.9, -2.5], 44), t, len),
      world: (
        <Street f={g} closed shutter={1} dark>
          <AbandonedCrates />
          <Crate p={[-1.75, 0, -2.5]} r={[0, 0.3, 0]} />
          <pointLight position={[-1.1, 1.7, -1.2]} intensity={2.4} distance={3} color="#FFD9A8" />
          <Person look={CAST.courier} pose={{ x: -1.72, z: -2.32, ry: 22, ...act(t, [[0, stand], [8, stand], [26, down], [len, { ...down, pitch: 5 }]]) }} />
        </Street>
      ),
      over: <Chip x={540} y={330} at={shot("S40").from + 3} to={700_000} pre="~" kind="count" dur={30} color={N.red} />,
    };
  },
  S41: (t, len, g) => {
    const arm = { f: 45, e: -50, o: 10 };
    const head = { f: 104, o: 15, e: -130 };
    return {
      light: "warm",
      cam: glide(cm([0.2, 1.25, 1.15], [0, 1.2, -0.75], 38), cm([0.12, 1.22, 0.75], [0, 1.2, -0.75], 38), t, len),
      world: (
        <Office f={g} night>
          <Person look={CAST.mandel} pose={sit(act(t, [[0, { pitch: 8, yaw: -6, lookY: -0.3, worry: 0.3, armL: arm, armR: arm }], [12, { pitch: 4, yaw: -10, lookX: -0.7, lookY: 0, worry: 0.5, armL: arm, armR: arm }], [28, { pitch: 14, yaw: 0, lookX: 0, lookY: -0.5, worry: 1, mouth: 0.3, smile: -0.5, armL: head, armR: head }], [len, { pitch: 20, roll: 3, yaw: 2, lookY: -0.6, worry: 1, mouth: 0.4, smile: -0.7, heavy: 0.3, armL: head, armR: head }]]))} />
          <P g={ico(0.012, 0)} c="#BFE4FF" p={[0.095, 1.29 - ramp(t, 22, len) * 0.13, -0.65]} s={1 - ramp(t, len - 14, len) * 0.9} o={{ rough: 0.2 }} shadow={false} />
        </Office>
      ),
    };
  },
  // ---- 7 · the draw and the investigation
  S42: (t, len, g) => ({
    light: "studio",
    cam: glide(cm([-2.0, 2.4, 6.4], [0.6, 1.6, 0], 44), cm([2.0, 1.55, 3.9], [1.94, 1.3, 0.6], 40), t, len),
    world: (
      <Studio f={g}>
        <DrawMachine f={g * 1.6} drawn={DRAWN} k={Math.floor(ramp(t, len * 0.12, len - 3, 0.5, 6.49))} />
        <pointLight position={[1.9, 2.4, 2.2]} intensity={1.4} distance={5} color="#FFE2B8" />
      </Studio>
    ),
  }),
  S44: (t, len, g) => {
    // the room goes dark, THE ticket rises out of the heap, the camera goes to the row, it lights number by number
    const up = 1 - (1 - ramp(t, 0, 14)) ** 3;
    return {
      light: "night",
      cam: glide(cm([0.3, 1.5, 5.2], [0, 1.15, 3.55], 40), cm([0.03, 1.2, 4.52], [0, 1.2, 3.6], 40), t, len),
      world: (
        <Warehouse f={g} workers={false} sign="" dim={ramp(t, 0, 10, 0.7, 0.04)}>
          <Pile n={2500} r={1.7} h={1.0} p={[0, 0, 3.5]} seed={14} />
          <HeroTicket p={[0, 0.72 + up * 0.5, 3.6]} r={[-1.2 + up * 1.15, 0, 0.25 - up * 0.2]} s={3.3} row={DRAWN} lit={Math.floor(ramp(t, 16, len - 6, 0, 6.99))} />
          <pointLight position={[0, 0.95 + up * 0.5, 3.9]} intensity={0.25 + up * 0.9} distance={1.7} color={N.gold} />
        </Warehouse>
      ),
    };
  },
  S45: (t, len, g) => {
    const slam = loc("S45", wd("31", "him"));
    const still = { f: 45, e: -50, o: 10 };
    return {
      light: "cool",
      cam: glide(cm([0.3, 2.1, 3.6], [0.25, 1.08, -0.8], 42), cm([0.28, 2.05, 3.25], [0.25, 1.1, -0.8], 42), t, len),
      world: (
        <Interview f={g} lamp={false}>
          <Person look={CAST.mandel} pose={sit({ x: 0.35, z: -0.8, ...act(t, [[0, { yaw: 24, lookX: 0.6, lookY: 0.3, pitch: -4, armL: still, armR: still }], [slam - 12, { yaw: 18, lookX: 0.5, lookY: 0.4, pitch: -5, armL: still, armR: still }], [slam, { yaw: -8, lookX: -0.4, lookY: 0.5, pitch: -6, brow: 0.5, armL: still, armR: still }], [len, { yaw: -10, lookX: -0.4, lookY: 0.5, pitch: -7, smirk: 0.3, browL: 0.4, armL: still, armR: still }]]) })} />
          <Person look={CAST.agent} back="FBI" pose={{ x: -0.05, z: 0.95, ry: 180, ...act(t, [[0, { lean: 2, pitch: 2, armR: { o: 6 }, armL: { f: 18, e: -30, o: 10 } }], [slam - 7, { lean: -3, pitch: -4, armR: { o: 6 }, armL: { f: 74, e: -96, o: 14 }, frown: 0.6 }], [slam, { lean: 26, pitch: 14, armR: { o: 8 }, armL: { f: 66, e: -14, o: 10 }, frown: 1, mouth: 0.35 }], [slam + 10, { lean: 22, pitch: 10, armR: { o: 8 }, armL: { f: 62, e: -16, o: 10 }, frown: 1, mouth: 0.2 }], [len, { lean: 21, pitch: 10, armR: { o: 8 }, armL: { f: 62, e: -16, o: 10 }, frown: 1 }]]) }} />
          <Person look={CAST.agent2} pose={{ x: 1.2, z: -0.3, ry: 250, ...alive(g, 32), frown: 0.5, armL: { f: 45, e: -100, o: -25 }, armR: { f: 40, e: -100, o: -25 } }} />
          <Folder p={[0.1, 0.775 + (t >= slam && t < slam + 4 ? 0.03 : 0), 0.1]} />
          <Folder p={[-0.25, 0.785 + (t >= slam && t < slam + 3 ? 0.05 : 0), 0.0]} r={[0, 0.4, 0]} />
          <pointLight position={[0.2, 1.8, 0.1]} intensity={2.4} distance={2.6} color="#FFE2B8" />
        </Interview>
      ),
      over: <Chip x={500} y={330} at={wd("31", "FBI")} text="FBI + CIA" kind="drop" />,
    };
  },
  S47: (t, len, g) => {
    const down = { f: 12, o: 4, e: -10 };
    const palm = { f: 34, o: 42, e: -92 };
    return {
      light: "cool",
      cam: glide(cm([-0.25, 1.55, -1.4], [0.35, 1.12, 0.7], 46), cm([-0.22, 1.53, -1.28], [0.35, 1.12, 0.7], 46), t, len),
      world: (
        <Interview f={g} lamp={false}>
          <Folder p={[0.2, 0.775, 0.33]} open={ramp(t, 0, 10)} />
          <Person look={CAST.agent2} pose={{ x: 0.5, z: 1.0, ry: 195, ...act(t, [[0, { pitch: 22, lookY: -0.7, armL: down, armR: down }], [10, { pitch: 22, lookY: -0.7, frown: 0.3, armL: down, armR: down }], [20, { pitch: -2, lookY: 0.1, roll: 7, brow: 1, smile: -0.6, shrug: 1, armL: palm, armR: palm }], [len, { pitch: 0, lookY: 0, roll: 6, brow: 0.8, smile: -0.7, shrug: 0.7, armL: palm, armR: palm }]]) }} />
          <pointLight position={[0.3, 1.8, 0.1]} intensity={2.6} distance={3} color="#FFE2B8" />
        </Interview>
      ),
    };
  },
  S48: (t, len, g) => {
    const buy = loc("S48", wd("33", "buy"));
    const shut = len - 22;
    const arm = { f: 45, e: -50, o: 10 };
    const read = (o: number) => ({ f: 54, e: -70, o });
    return {
      light: "warm",
      post: { bloom: 0.12 },
      cam: glide(cm([0.25, 1.42, 0.95], [0, 1.08, -0.35], 40), cm([0.16, 1.28, 0.55], [0, 1.16, -0.65], 38), t, len),
      world: (
        <Interview f={g}>
          <Book p={[0, 0.775, -0.12]} open={t < shut ? ramp(t, 0, 10, 0.25, 1) : ramp(t, shut, shut + 12, 1, 0.02)} />
          <pointLight position={[0.15, 1.5, 0.15]} intensity={0.9} distance={2} color="#FFD9B0" />
          <Person look={CAST.mandel} pose={sit({ z: -0.8, ...act(t, [[0, { pitch: 13, lookY: -0.95, heavy: 0.4, yaw: -8, armL: arm, armR: read(14) }], [buy * 0.5, { pitch: 13, lookY: -0.95, heavy: 0.4, yaw: 4, armL: arm, armR: read(2) }], [buy - 4, { pitch: 13, lookY: -0.95, heavy: 0.4, yaw: 6, armL: arm, armR: read(-4) }], [buy + 8, { pitch: 8, lookY: 0.3, yaw: 2, heavy: 0.2, armL: arm, armR: read(-4) }], [shut, { pitch: -3, lookY: 0.1, yaw: 3, roll: 4, smirk: 0.8, browL: 0.8, heavy: 0.35, armL: arm, armR: read(-4) }], [shut + 10, { pitch: -4, yaw: 3, roll: 6, smirk: 1, browL: 1.1, heavy: 0.35, armL: arm, armR: { f: 58, e: -40, o: 0 } }], [len, { pitch: -5, yaw: 5, roll: 7, smirk: 1, browL: 1.1, heavy: 0.3, armL: arm, armR: arm }]]) })} />
        </Interview>
      ),
    };
  },
  // ---- 8 · the system strikes back
  S50: (t, len, g) => {
    const hit = loc("S50", wd("34", "wrote"));
    const st = loc("S50", wd("34", "stop"));
    return {
      light: "warm",
      cam: glide(cm([0, 1.5, 3.6], [0, 1.35, 0], 40), cm([0.2, 2.0, 1.25], [0.03, 1.5, 0.2], 40), t, len),
      world: (
        <Chamber f={g}>
          <GavelBlock p={[-0.48, 1.17, 0.12]} />
          <Crate p={[0.05, 1.17, 0.22]} s={0.6} />
          <Person look={CAST.lawmaker} pose={{ z: -0.75, ...act(t, [[0, { pitch: 6, yaw: 6, frown: 0.5 }], [hit, { pitch: 14, yaw: -6, frown: 0.9, lean: 8 }], [hit + 10, { pitch: 8, frown: 0.7, lean: 4 }], [st, { pitch: 18, lookY: -0.6, frown: 0.6, lean: 7 }]]), armR: { ...strikeArm(strike(t, [hit])), o: 26 }, armL: { f: 40, e: -40 } }} holdR={<GavelHeld />} />
          <Person look={extra(41, { top: "#2C3A5A", shirt: "#F3EFE6", tie: N.red, hairStyle: "short", glasses: false })} pose={{ x: -0.6, z: -1.35, ...act(t, [[0, { yaw: 24, lookX: 0.6 }], [st - 8, { yaw: 24, lookX: 0.6, pitch: 6 }], [st, { yaw: 8, pitch: 16, lookY: -0.5, frown: 0.5 }]]) }} />
          <Person look={extra(42, { top: "#3A2C2A", shirt: "#F3EFE6", tie: N.blue, hairStyle: "bald" })} pose={{ x: 0.6, z: -1.35, ...act(t, [[0, { yaw: -24, lookX: -0.6 }], [hit + 6, { yaw: -24, pitch: 10, lookX: -0.6 }], [hit + 14, { yaw: -22, pitch: -2, lookX: -0.6 }], [st, { yaw: -8, pitch: 16, lookY: -0.5, frown: 0.5 }]]) }} />
          <Stamp p={[0.05, 1.46, 0.22]} k={t < st ? ramp(t, st - 5, st) : ramp(t, st + 4, st + 12, 1, 0)} word="NEW LAW" printed={t >= st} />
        </Chamber>
      ),
    };
  },
  S52: (t, len, g) => {
    const stop = loc("S52", wd("36", "deleted"));
    const ff = Math.min(g, shot("S52").from + stop);
    const away = { f: 16, o: 44, e: -58 };
    const pulled = { f: 46, o: 30, e: -52 };
    const pose = act(t, [[0, { yaw: 30, lookX: 0.8, lookY: 0.4, pitch: -6, armR: { o: 8 }, armL: { f: 2, o: 30, e: -30 } }], [stop * 0.45, { yaw: 22, lookX: 0.7, lookY: 0.2, pitch: -2, roll: 4, smile: -0.2, armR: { o: 8 }, armL: { f: 2, o: 30, e: -30 } }], [stop - 12, { yaw: 12, lookX: 0.3, pitch: 2, smirk: 0.3, armR: { o: 8 }, armL: away, tilt: 3 }], [stop - 6, { yaw: 8, lookX: 0.2, pitch: 2, smirk: 0.3, armR: { o: 8 }, armL: away, tilt: 3 }], [stop, { yaw: 14, lookX: 0.6, lookY: 0.2, pitch: 2, smirk: 0.4, browL: 0.5, armR: { o: 8 }, armL: pulled, lean: 7, tilt: 6 }], [stop + 12, { yaw: 5, lookX: 0, lookY: 0, pitch: 0, smirk: 0.9, browL: 1.1, heavy: 0.2, armR: { o: 8 }, armL: pulled, lean: 2, tilt: 3 }], [len, { yaw: 3, lookX: 0, pitch: -3, smile: 0.3, smirk: 1, browL: 1.2, heavy: 0.25, armR: { o: 8 }, armL: pulled, lean: 0, tilt: 2 }]]);
    const hand = handAt(1, [-1.0, 0.25, 1.3], pose.armL!);
    const base: V3 = [-0.42, 0.72, 1.36];
    const to = new THREE.Vector3(hand[0] - base[0], hand[1] - base[1], hand[2] - base[2]);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().normalize());
    return {
      light: "studio",
      cam: glide(cm([-0.75, 1.98, 5.1], [-0.55, 1.72, 0], 40), cm([-0.75, 1.98, 4.6], [-0.55, 1.72, 0], 40), t, len),
      world: (
        <Studio f={ff} off={t >= stop} dim={ramp(t, stop, stop + 14)}>
          <DrawMachine f={ff} calm={ramp(t, stop, stop + 8)} drain={ramp(t, stop + 6, stop + 36)} rim={ramp(t, stop, stop + 14)} />
          <Box w={0.24} h={0.72} d={0.24} c="#2A2230" p={[base[0], 0, base[2]]} />
          <group position={base} quaternion={[q.x, q.y, q.z, q.w]}>
            <Box w={0.04} h={to.length() + 0.1} d={0.04} c="#D8DEE4" o={{ metal: 0.4, rough: 0.4 }} />
            <P g={ico(0.05, 1)} c={N.red} p={[0, to.length() + 0.13, 0]} />
          </group>
          <Person look={CAST.mandel} pose={{ x: -1.0, y: 0.25, z: 1.3, ...pose }} />
          <pointLight position={[-1.0, 2.5, 2.6]} intensity={2.6} distance={3.2} color="#FFD9A8" />
        </Studio>
      ),
      over: <Chip x={540} y={330} at={shot("S52").from + 3} text="1 IN 7,059,052" kind="type" dur={12} del={stop} size={76} />,
    };
  },
  S54: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([2.21, 1.93, 3.2], [2.21, 1.93, -2.27], 40), cm([2.21, 1.93, 3.0], [2.21, 1.93, -2.27], 40), t, len),
    world: <Office f={g} frames={ramp(t, 0, len * 0.72, 0, 14)} />,
    over: <Chip x={500} y={1215} at={shot("S54").from} text="14 JACKPOTS" kind="pop" color={N.gold} size={72} />,
  }),
  S56: (t, len, g) => {
    const cheat = loc("S56", wd("39", "cheating"));
    const math = loc("S56", wd("39", "math"));
    const free = len - 18;
    const pose = act(t, [[0, { yaw: 6, pitch: 6, lookX: 0, lookY: 0.1, smirk: 0.5, browL: 0.4, armL: REST, armR: HOLD }], [Math.max(8, cheat - 8), { yaw: 0, pitch: 0, smirk: 0.3, heavy: 0.2, armL: REST, armR: HOLD }], [cheat + 6, { yaw: -7, pitch: -4, roll: -3, brow: 0.5, browL: 0.7, smirk: 0.5, armL: REST, armR: { ...HOLD, f: 94 } }], [math, { yaw: 5, pitch: -2, roll: 5, smirk: 0.9, browL: 1.2, armL: REST, armR: HOLD }], [Math.max(math + 6, free), { yaw: 2, pitch: -1, roll: 3, smirk: 1, browL: 1.1, armL: REST, armR: HOLD }], [len - 6, GLOBE_POSE]]);
    return {
      light: "studio",
      cam: glide(GLOBE_B, GLOBE_A, t, len),
      world: (
        <GlobeFace g={g} balls={(t - len) * 0.3} pose={{ blink: t < len - 6 ? undefined : 0, ...pose }}>
          <FlyBall hand={handAt(-1, GLOBE_AT, pose.armR!)} k={1 - ramp(t, free, len - 8)} />
        </GlobeFace>
      ),
      over: <Chip x={500} y={300} at={shot("S56").from} text="14 JACKPOTS" kind="still" color={N.gold} size={70} />,
    };
  },
};

const ShotLayer: React.FC<{ seg: (typeof SHOTS)[number]; t: number; g: number }> = ({ seg, t, g }) => {
  const o = S[seg.id](t, seg.len, g);
  return (
    <Shot3D cam={o.cam} light={o.light} target={o.target} box={o.box} filter={o.filter} over={o.over} post={o.post}>
      {o.world}
    </Shot3D>
  );
};

const Picture: React.FC = () => {
  const f = useCurrentFrame();
  const i = SHOTS.length - 1 - [...SHOTS].reverse().findIndex((s) => f >= s.from);
  const seg = SHOTS[Math.max(0, i)];
  return (
    <AbsoluteFill style={{ background: "#141018" }}>
      <ShotLayer key={seg.id} seg={seg} t={f - seg.from} g={f} />
      <KaraokeSubs timing={timing} words={WORDS} Skin={NSub} oneLine maxWords={3} maxChars={18} hold={0.3} />
    </AbsoluteFill>
  );
};

export const NMandel: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const at = (id: string) => shot(id).from;
  // Sfx fades need ≥ 1 s (shorter `seconds` gives a non-monotonic volume range)
  const sec = (a: string, b: string) => Math.max(1, (at(b) - at(a)) / FPS);
  const lf = (id: string) => Math.round(line(id).start * FPS);
  // the music is gone a beat before "They ran out of time" and only the low pad comes back until the draw
  const duck = (g: number) => interpolate(g, [lf("26") - 6, lf("26") - 2, lf("27"), lf("27") + 12, lf("29") - 2, lf("29") + 2, lf("38") - 6, lf("38")], [1, 0, 0, 0.6, 0.6, 1, 1, 0.5], CLAMP);
  const room = ([a, b, file]: readonly [string, string, string]) => <Sfx key={a} file={file} at={at(a)} level={-36} seconds={Math.max(1, (shot(b).from + shot(b).len - at(a)) / FPS)} />;
  const ballsAt = (id: string, a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => at(id) + a + ((i + 0.5) / n) * (b - a));
  return (
    <AbsoluteFill>
      <Freeze frame={0} active={f >= durationInFrames - 1}>
        <Picture />
      </Freeze>
      <Audio name="VO" src={staticFile("voiceover/n-mandel/vo.mp3")} />
      <MusicBed file={MUSIC} level={-25} duck={duck} />
      {ROOMS.map(room)}
      <Sfx file="sfx/synth/ball-rattle.wav" at={0} level={-27} seconds={sec("S1", "S2")} />
      <Sfx file="sfx/tick/typewriter-soft-click-1125.mp3" at={24} level={-24} align="onset" />
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S3") + 2} level={-27} seconds={sec("S3", "S4")} />
      <Sfx file="sfx/click/keyboard-click-327728.mp3" at={at("S5") + 3} level={-26} align="onset" />
      <Sfx file="sfx/pen/writing-scribble-on-paper-2369.mp3" at={at("S8") + 2} level={-26} align="onset" />
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S9") + 4} level={-33} seconds={sec("S9", "S10")} />
      <Sfx file="sfx/synth/clock-tick.wav" at={at("S10")} level={-24} align="onset" seconds={sec("S10", "S11")} />
      <Sfx file="sfx/click/digital-click-357350.mp3" at={wd("09", "three")} level={-24} align="onset" />
      <Sfx file="sfx/synth/dot-matrix.wav" at={at("S13")} level={-28} seconds={sec("S13", "S14")} />
      <Sfx file="sfx/pop/page-turn-single-1104.mp3" at={lineEnd("11") - 1} level={-22} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={lineEnd("12")} level={-26} align="onset" seconds={1} />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("13")} level={-23} align="onset" seconds={1.6} />
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S16") + 2} level={-27} seconds={1.2} />
      <Sfx file="sfx/ping/page-turn-chime-1106.mp3" at={lineEnd("14")} level={-25} align="onset" />
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S20")} level={-28} seconds={sec("S20", "S21")} />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={wd("15", "laws")} level={-25} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={wd("15", "stop")} level={-24} align="onset" />
      {ballsAt("S25", 0, shot("S25").len * 0.7, 6).map((x) => <Sfx key={x} file="sfx/synth/ball-drop.wav" at={x} level={-31} align="peak" />)}
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S26")} level={-30} seconds={sec("S26", "S27")} />
      <Sfx file="sfx/pop/quick-swoosh-1462.mp3" at={at("S27") + 2} level={-30} align="peak" />
      <Sfx file="sfx/tick/data-short-input-on-typewriter-1379.mp3" at={at("S28")} level={-28} align="onset" />
      <Sfx file="sfx/synth/dot-matrix.wav" at={at("S29")} level={-32} seconds={sec("S29", "S33")} />
      {[wd("21", "thirty"), wd("21", "twelve")].map((x) => <Sfx key={x} file="sfx/click/digital-click-357350.mp3" at={x} level={-30} align="onset" />)}
      <Sfx file="sfx/amb-wind/light-wind-1165.mp3" at={at("S34")} level={-36} seconds={sec("S34", "S35")} />
      <Sfx file="sfx/vehicle/truck-driving-steady-1621.mp3" at={at("S34")} level={-30} seconds={sec("S34", "S35")} />
      <Sfx file="sfx/synth/clock-tick.wav" at={at("S38")} level={-20} align="onset" seconds={sec("S38", "S39")} />
      <Sfx file="sfx/deephit/deep-heartbeat-impact-498.mp3" at={at("S38") + 10} level={-24} align="onset" seconds={2} />
      <Sfx file="sfx/synth/shutter-down.wav" at={lineEnd("26") - 31} level={-25} />
      <Sfx file="sfx/deephit/big-cinematic-impact-788.mp3" at={lineEnd("26")} level={-25} align="onset" seconds={2.5} />
      <Sfx file="sfx/amb-wind/light-wind-1165.mp3" at={at("S40")} level={-34} seconds={sec("S40", "S41")} />
      <Sfx file="sfx/synth/ball-rattle.wav" at={at("S42")} level={-30} seconds={sec("S42", "S44")} />
      <Sfx file="sfx/riser/tension-and-suspense-drum-roll-577.mp3" at={at("S42")} level={-32} seconds={sec("S42", "S44")} />
      {[0.2, 0.36, 0.52, 0.68, 0.84, 0.97].map((k) => <Sfx key={k} file="sfx/synth/ball-drop.wav" at={at("S42") + k * shot("S42").len} level={-27} align="peak" />)}
      <Sfx file="sfx/synth/clock-tick.wav" at={at("S44") + 12} level={-30} align="onset" seconds={1} />
      <Sfx file="sfx/hit/cinematic-piano-hit-567216.mp3" at={lineEnd("30")} level={-22} align="onset" seconds={2.5} />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={wd("31", "him")} level={-27} align="onset" seconds={1} />
      <Sfx file="sfx/pop/page-turn-single-1104.mp3" at={at("S47") + 2} level={-26} align="onset" />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={wd("34", "wrote")} level={-25} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={wd("34", "stop")} level={-24} align="onset" />
      <Sfx file="sfx/synth/ball-rattle.wav" at={at("S52")} level={-27} seconds={(wd("36", "deleted") - at("S52")) / FPS + 0.5} />
      <Sfx file="sfx/tick/typewriter-soft-hit-1366.mp3" at={wd("36", "deleted") - 2} level={-24} align="onset" />
      <Sfx file="sfx/synth/balls-fall.wav" at={wd("36", "deleted")} level={-21} />
      <Sfx file="sfx/tick/digital-typewriter-1363.mp3" at={wd("36", "deleted")} level={-27} align="onset" seconds={1} />
      <Sfx file="sfx/ping/page-forward-single-chime-1107.mp3" at={lineEnd("37")} level={-26} align="onset" />
      <Sfx file="sfx/synth/ball-rattle.wav" at={at("S56")} level={-27} seconds={shot("S56").len / FPS} />
      {safeGuide && <SafeGuide />}
    </AbsoluteFill>
  );
};
