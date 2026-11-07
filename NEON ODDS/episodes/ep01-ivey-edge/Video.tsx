/**
 * NEON ODDS ep01 · ivey-edge. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-ivey-edge-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * Table layout: players on −z facing the camera, dealer on +z with her back to it. Shots of her face swap the sides
 * (DealerFront, players' backs on +z), so the key light stays on the face and the teal rim stays behind it.
 */
import React from "react";
import { interpolate } from "remotion";
import * as THREE from "three";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, Box, Chip, ctex, cyl, glide, handAt, N, P, Panel, Person, type Pose, Shot3D, signTex, SIT, talk, type V3 } from "../../../Style Library/N-low-poly/lowpoly";
import { Balance, Bundle, Card, CardShoe, Chair, ChipHill, ChipStack, Folder, GavelBlock, GavelHeld, PressHand, ShuffleMachine, Stamp, strike, strikeArm } from "../../../Style Library/N-low-poly/props";
import { CAST, CashCage, Casino, Chamber, extra, Office, TABLE_Y, Void } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/ivey-edge.timing.json";
import rawWords from "../../../src/voiceover/ivey-edge.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, sec, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/ivey-edge.mp3";

const AMBER = "#FFB347";
const TEAL = "#62D2DC";
const TOP = TABLE_Y + 0.008;
const LONDON = "CROCKFORDS";
const US = "BORGATA";

// ---------------- the people at the table ----------------
const CROSS_L = { f: 50, e: -92, o: 2, tw: -38 };
const CROSS_R = { f: 58, e: -88, o: 2, tw: 38 };
const ON_TABLE = { f: 42, e: -48, o: 8 };
const IVEY_X = 0.42;
const PARTNER_X = -0.42;
const SEAT_Z = -0.98;
const seated = (x: number, p: Pose = {}): Pose => ({ x, z: SEAT_Z, ...SIT, ...p });
const Ivey: React.FC<{ pose?: Pose; x?: number }> = ({ pose, x = IVEY_X }) => <Person look={CAST.ivey} pose={seated(x, { armL: CROSS_L, armR: CROSS_R, ...pose })} />;
const Partner: React.FC<{ pose?: Pose; x?: number }> = ({ pose, x = PARTNER_X }) => <Person look={CAST.partner} pose={seated(x, { armL: ON_TABLE, armR: ON_TABLE, ...pose })} />;
const DEALER_ARM = { f: 34, e: -22, o: 8 };
const Dealer: React.FC<{ pose?: Pose }> = ({ pose }) => <Person look={CAST.dealer} pose={{ z: 1.06, ry: 180, lean: 10, armL: DEALER_ARM, armR: DEALER_ARM, ...pose }} />;
/** her face to the camera: she stands on −z here */
const DealerFront: React.FC<{ pose?: Pose }> = ({ pose }) => <Person look={CAST.dealer} pose={{ z: -1.06, lean: 10, armL: DEALER_ARM, armR: DEALER_ARM, ...pose }} />;
const Boss: React.FC<{ pose?: Pose }> = ({ pose }) => <Person look={CAST.pitboss} pose={{ armL: { o: 8 }, armR: { o: 8 }, ...pose }} />;
const Chairs: React.FC = () => (
  <>
    <Chair p={[IVEY_X, 0, SEAT_Z]} ry={0} c="#4A1E1E" />
    <Chair p={[PARTNER_X, 0, SEAT_Z]} ry={0} c="#4A1E1E" />
  </>
);
const Shoe: React.FC<{ edge?: string; glow?: number }> = ({ edge, glow }) => <CardShoe p={[-0.72, TOP + 0.01, 0.14]} ry={38} edge={edge} glow={glow} />;
/** a dealer's forearm reaching in from the +z side, fingertips at p */
const DealerHand: React.FC<{ p: V3; s?: number; turn?: number }> = ({ p, s = 1, turn = 0 }) => <PressHand p={p} r={[1.05, turn, 0]} s={s} sleeve={CAST.dealer.top} skin={CAST.dealer.skin} />;
/** a straight string between two points */
const Str: React.FC<{ a: V3; b: V3; c?: string }> = ({ a, b, c = AMBER }) => {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
  const r = new THREE.Euler().setFromQuaternion(q);
  return <P g={cyl(0.003, 0.003, 1, 4)} c={c} p={a} r={[r.x, r.y, r.z]} s={[1, A.distanceTo(B), 1]} o={{ e: c, ei: 1.4 }} shadow={false} />;
};
const pounds = (m: number) => `£${m.toFixed(1)}M`;
const thousands = (n: number) => `£${Math.round(n).toLocaleString("en-US")}`;
/** straight down on the felt, for the card shots; `y` above the table */
const topCam = (y: number, fov = 34, z = 0.34) => cm([0, TOP + y, z], [0, TOP, 0.02], fov);
const CardLight: React.FC = () => <pointLight position={[0.2, 2.1, 0.5]} intensity={1.2} distance={3.2} color="#FFE6C0" />;

// ---------------- first and last picture (the loop) ----------------
const LOOP_CAM = cm([0.06, 1.42, 2.75], [0.06, 1.2, -0.98], 36);
const LOOP_POSE: Pose = { smirk: 0.5, brow: 0.2, lookX: 0, lookY: 0, blink: 0 };
const LoopWorld: React.FC<{ g: number; hill: number; pose?: Pose; turn?: number }> = ({ g, hill, pose, turn = 0 }) => (
  <Casino f={g} sign="" board="£7.7M">
    <Chairs />
    <Ivey pose={{ ...LOOP_POSE, ...pose }} x={0.24} />
    <ChipHill p={[-0.28, TOP, -0.42]} k={hill} cols={3} rows={2} max={38} />
    <Card p={[0.14, TOP + 0.012 + Math.sin(turn * Math.PI) * 0.09, -0.34]} flip={turn} s={1.1} />
    <PressHand p={[0.26, TOP + 0.05 + Math.sin(turn * Math.PI) * 0.09, -0.26]} r={[0.28, 0, -1.42]} sleeve={CAST.dealer.top} skin={CAST.dealer.skin} />
  </Casino>
);
const LOOP_HILL = 0.8;

const S: Record<string, ShotFn> = {
  // ---------- hook ----------
  S1: (t, len, g) => ({
    light: "stage",
    cam: glide(LOOP_CAM, cm([0.06, 1.42, 2.55], [0.06, 1.2, -0.98], 36), t, len),
    world: <LoopWorld g={g} hill={LOOP_HILL + ramp(t, 0, len, 0, 0.2)} turn={ramp(t, 12, 28)} />,
  }),
  S2: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.42, 1.34, 1.75], [0.42, 1.02, -0.6], 34), cm([0.42, 1.34, 1.6], [0.42, 1.02, -0.6], 34), t, len),
    world: (
      <Casino f={g} sign={LONDON}>
        <Chairs />
        <Ivey pose={act(t, [[0, { smirk: 0.2, lookY: -0.7, pitch: 6 }], [len * 0.55, { smirk: 0.8, lookY: 0, pitch: 0, browL: 0.8 }]])} />
        <Card p={[0.42, TOP + 0.02 + Math.sin(ramp(t, 4, 18) * Math.PI) * 0.1, -0.08]} flip={ramp(t, 4, 18)} s={1.4} />
        <DealerHand p={[0.42 + ramp(t, 18, 28) * -0.3, TOP + 0.12, 0.12 + ramp(t, 18, 28) * 0.5]} />
      </Casino>
    ),
  }),
  // ---------- the flaw ----------
  S3: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([-0.1, 2.1, 4.6], [0, 1.58, -0.5], 38), cm([0, 2.1, 4.3], [0, 1.58, -0.5], 38), t, len),
    world: (
      <Casino f={g} sign={LONDON} board="HOUSE 1%">
        <Chairs />
        <Ivey pose={{ armL: ON_TABLE, armR: ON_TABLE, lookY: -0.6 }} />
        <Partner pose={{ lookY: -0.6 }} />
        <Dealer pose={{ x: -0.62, z: 1.2, ...act(t, [[0, { armR: DEALER_ARM }], [12, { armR: { f: 46, e: -28, o: -6 } }], [24, { armR: DEALER_ARM }], [36, { armR: { f: 46, e: -28, o: -6 } }], [48, { armR: DEALER_ARM }]]) }} />
        <Shoe />
        {[0, 1, 2, 3].map((i) => <Card key={i} p={[-0.2 + i * 0.2 - ramp(t, i * 12, i * 12 + 9, 0.46 + i * 0.2, 0), TOP + 0.003, 0.1 + ramp(t, i * 12, i * 12 + 9, 0.1, 0)]} />)}
      </Casino>
    ),
  }),
  S4: (t, len, g) => {
    const off = ramp(g, wd("03", "off") - 6, wd("03", "center") + 4);
    return {
      light: "stage",
      cam: glide(topCam(1.5), topCam(1.44), t, len),
      world: (
        <Casino f={g} sign={LONDON} lamp={3}>
          <Card p={[0, TOP + 0.004, 0.02]} s={1.9} shift={off} />
          <CardLight />
        </Casino>
      ),
      over: <Chip x={500} y={300} at={wd("03", "less")} text="< 1 MM" kind="pop" size={78} color={AMBER} />,
    };
  },
  S5: (t, len, g) => ({
    light: "stage",
    cam: topCam(2.2),
    world: (
      <Casino f={g} sign={LONDON} lamp={3}>
        <Card p={[-0.2, TOP + 0.004, 0.02]} s={1.9} edge={AMBER} glow={ramp(t, 4, 12)} />
        <Card p={[0.2, TOP + 0.004, 0.02]} s={1.9} r={[0, ramp(t, 14, 32) * Math.PI, 0]} edge={TEAL} glow={ramp(t, 30, 38)} />
        <CardLight />
      </Casino>
    ),
  }),
  S6: (t, len, g) => {
    const every = ramp(g, wd("05", "every") - 3, wd("05", "flaw") + 2);
    return {
      light: "stage",
      cam: glide(topCam(2.55, 34, 0.4), topCam(2.65, 34, 0.4), t, len),
      world: (
        <Casino f={g} sign={LONDON} lamp={3}>
          {Array.from({ length: 12 }, (_, i) => <Card key={i} p={[((i % 3) - 1) * 0.21, TOP + 0.004, (Math.floor(i / 3) - 1.5) * 0.29]} s={1.05} edge={AMBER} glow={every * 12 > i ? 1 : 0} />)}
          <CardLight />
        </Casino>
      ),
    };
  },
  S7: (t, len, g) => {
    const split = ramp(g, wd("06", "needed") - 2, wd("06", "other") + 2);
    return {
      light: "stage",
      cam: glide(cm([0.36, 2.25, 2.1], [0.3, 1.0, -0.44], 34), cm([0.36, 2.22, 2.0], [0.3, 1.0, -0.44], 34), t, len),
      world: (
        <Casino f={g} sign={LONDON}>
          <Chairs />
          <Ivey pose={act(t, [[0, { lookY: -0.8, pitch: 10, heavy: 0.3 }], [len * 0.65, { lookY: -0.8, pitch: 10, smirk: 0.7, browL: 0.7 }]])} />
          {Array.from({ length: 12 }, (_, i) => {
            const good = i % 3 === 0;
            const home: V3 = [0.3 + ((i % 4) - 1.5) * 0.17, TOP + 0.004, -0.2 + Math.floor(i / 4) * 0.2];
            const pile: V3 = good ? [0.04, TOP + 0.004 + i * 0.002, 0.08] : [0.56, TOP + 0.004 + i * 0.002, 0.08];
            return <Card key={i} p={[home[0] + (pile[0] - home[0]) * split, home[1] + (pile[1] - home[1]) * split, home[2] + (pile[2] - home[2]) * split]} edge={good ? AMBER : TEAL} s={0.9} />;
          })}
        </Casino>
      ),
      over: <Chip x={500} y={300} at={wd("06", "phil")} text="PHIL IVEY" kind="slide" size={72} out={lineEnd("06")} />,
    };
  },
  // ---------- the favor ----------
  S8: (t, len, g) => {
    const reach = { f: 44, e: -30, o: 2 };
    return {
      light: "stage",
      cam: glide(cm([0.05, 1.52, 2.85], [0.05, 1.22, -0.6], 36), cm([0.05, 1.52, 2.65], [0.05, 1.22, -0.6], 36), t, len),
      world: (
        <Casino f={g} sign={LONDON}>
          <Person look={CAST.ivey} pose={{ x: 0.5, z: 0.98, ry: 180, ...SIT, armL: CROSS_L, armR: CROSS_R }} />
          <DealerFront pose={act(t, [[0, { lookY: -0.7, pitch: 8, smile: 0.2, armL: DEALER_ARM, armR: DEALER_ARM }], [14, { lookY: -0.7, pitch: 8, smile: 0.2, armL: reach, armR: reach }], [len - 8, { lookY: -0.3, pitch: 2, smile: 0.3, armL: reach, armR: reach }]])} />
          {[0, 1, 2].map((i) => <Card key={i} p={[-0.2 + i * 0.2, TOP + 0.003, -0.26]} />)}
        </Casino>
      ),
    };
  },
  S9: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([-0.72, 1.46, 2.4], [-0.42, 1.2, -0.98], 30), cm([-0.72, 1.46, 2.22], [-0.42, 1.2, -0.98], 30), t, len),
    world: (
      <Casino f={g} sign={LONDON}>
        <Chairs />
        <Partner pose={{ ...act(t, [[0, { lean: 2, smile: 0.3, yaw: 6, armL: ON_TABLE, armR: ON_TABLE }], [14, { lean: 14, smile: 0.6, brow: 0.6, yaw: 6, armL: ON_TABLE, armR: { f: 62, e: -60, o: 8 } }]]), mouth: talk(g, g < lineEnd("08")) }} />
        <Dealer pose={act(t, [[0, { x: -0.12, z: 1.04, yaw: 6 }], [16, { x: -0.12, z: 1.04, yaw: 2, roll: 5 }]])} />
      </Casino>
    ),
  }),
  S10: (t, len, g) => {
    const a = ramp(g, wd("09", "good") - 3, wd("09", "way") + 3);
    const b = ramp(g, wd("09", "bad") - 3, wd("09", "way", 2) + 3);
    const hop = (k: number) => Math.sin(k * Math.PI) * 0.17;
    return {
      light: "stage",
      cam: glide(topCam(2.2, 34, 0.5), topCam(2.14, 34, 0.5), t, len),
      world: (
        <Casino f={g} sign={LONDON} lamp={3}>
          <Card p={[-0.2, TOP + 0.005 + hop(a), 0.03]} s={1.7} tumble={a} edge={AMBER} glow={a} />
          <Card p={[0.2, TOP + 0.005 + hop(b), 0.03]} s={1.7} flip={b} edge={TEAL} glow={b} />
          <DealerHand p={[-0.2, TOP + 0.09 + hop(a), 0.27]} turn={-0.15} s={1.3} />
          {b > 0 ? <DealerHand p={[0.2, TOP + 0.09 + hop(b), 0.27]} turn={0.15} s={1.3} /> : null}
          <CardLight />
        </Casino>
      ),
    };
  },
  S11: (t, len, g) => ({
    light: "stage",
    cam: cm([0.02, 1.36, 2.3], [0.02, 1.2, -0.98], 30),
    world: (
      <Casino f={g} sign={LONDON}>
        <Partner x={-0.24} pose={{ ...act(t, [[0, { smile: 0.5, yaw: 6, brow: 0.4, armL: ON_TABLE, armR: ON_TABLE }], [10, { smile: 0.9, squint: 0.4, yaw: 8, roll: 4, armL: ON_TABLE, armR: ON_TABLE }]]), mouth: talk(g, g < lineEnd("10") - 4) }} />
        <Ivey x={0.28} pose={act(t, [[0, { pitch: 0, yaw: -14, lookX: -0.6 }], [10, { pitch: 7, yaw: -14, smile: 0.3 }], [18, { pitch: 0, yaw: -10, smile: 0.4 }]])} />
      </Casino>
    ),
  }),
  S12: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([-1.15, 1.6, 2.1], [-1.5, 1.42, -1.5], 28), cm([-1.15, 1.6, 1.95], [-1.5, 1.44, -1.5], 28), t, len),
    world: (
      <Casino f={g} sign={LONDON}>
        <Boss pose={{ x: -1.5, z: -1.5, ...act(t, [[0, { yaw: 8, smile: 0.2 }], [10, { yaw: 8, smile: 0.6, shrug: 1, brow: 0.8, armL: { f: 14, e: -60, o: 26 }, armR: { f: 14, e: -60, o: 26 } }], [24, { yaw: 6, smile: 0.5, shrug: 0, armL: { o: 8 }, armR: { o: 8 } }]]) }} />
      </Casino>
    ),
  }),
  S13: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.7, 1.12], [0, 1.6, -1.06], 26), cm([0, 1.7, 1.04], [0, 1.6, -1.06], 26), t, len),
    world: (
      <Casino f={g} sign={LONDON}>
        <DealerFront pose={act(t, [[0, { lean: 4, smile: 0.35, lookX: -0.4, lookY: -0.4 }], [12, { lean: 4, smile: 0.35, lookX: 0.3, brow: 0.5, blink: 0 }], [24, { lean: 4, smile: 0.25, lookX: 0, brow: 0.2, blink: 0 }]])} />
      </Casino>
    ),
  }),
  // ---------- keep the cards ----------
  S14: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.56, 1.5, 1.85], [0.42, 1.06, -0.6], 32), cm([0.56, 1.5, 1.7], [0.42, 1.06, -0.6], 32), t, len),
    world: (
      <Casino f={g} sign={LONDON}>
        <Chairs />
        <Ivey pose={{ ...act(t, [[0, { armL: ON_TABLE, armR: ON_TABLE, yaw: -6 }], [14, { smile: 0.4, brow: 0.5, yaw: -6, armL: ON_TABLE, armR: { f: 60, e: -50, o: 4 } }], [len * 0.7, { smile: 0.5, yaw: -2, armL: ON_TABLE, armR: { f: 48, e: -46, o: -6 } }]]), mouth: talk(g, g < lineEnd("13") - 3) }} />
        {Array.from({ length: 10 }, (_, i) => <Card key={i} p={[0.42, TOP + 0.004 + i * 0.006, -0.1]} r={[0, i * 0.02, 0]} s={1.2} />)}
      </Casino>
    ),
  }),
  S15: (t, len, g) => ({
    light: "stage",
    cam: cm([-1.2, 1.62, 1.75], [-1.5, 1.52, -1.5], 24),
    world: (
      <Casino f={g} sign={LONDON}>
        <Boss pose={{ x: -1.5, z: -1.5, ...act(t, [[0, { yaw: 6, smile: 0.4 }], [7, { yaw: 6, pitch: 10, smile: 0.6 }], [15, { yaw: 6, pitch: 0, smile: 0.6 }]]) }} />
      </Casino>
    ),
  }),
  S16: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.3, 2.1, 1.95], [0, TOP + 0.12, 0.2], 30), cm([0.26, 2.06, 1.82], [0, TOP + 0.12, 0.2], 30), t, len),
    world: (
      <Casino f={g} sign={LONDON} lamp={4}>
        <ShuffleMachine p={[0, TOP, -0.12]} f={g} />
        {/* cards drop in at the top in a loop, then come out one by one along the felt, none turned round */}
        {Array.from({ length: 6 }, (_, i) => {
          const k = ((t + i * 6) % 36) / 36;
          return <Card key={`in${i}`} p={[0, TOP + 0.3 + (1 - k) * 0.34, -0.12]} s={Math.min(1, k * 8, (1 - k) * 8)} />;
        })}
        {Array.from({ length: 10 }, (_, i) => {
          const k = ramp(t, 6 + i * 6, 12 + i * 6);
          return k > 0 ? <Card key={i} p={[-0.34 + (i % 5) * 0.17, TOP + 0.004, 0.28 + Math.floor(i / 5) * 0.27 - (1 - k) * 0.2]} s={0.95} edge={i % 3 === 0 ? AMBER : TEAL} glow={k} /> : null;
        })}
      </Casino>
    ),
  }),
  S17: (t, len, g) => ({
    light: "stage",
    cam: cm([0.02, 1.2, 1.28], [0.04, 1.02, -0.5], 34),
    world: (
      <Casino f={g} sign={LONDON} lamp={4}>
        <Chair p={[0.05, 0, SEAT_Z]} ry={0} c="#4A1E1E" />
        <Ivey pose={act(t, [[0, { lookY: 0 }], [len * 0.45, { lookY: -0.7, pitch: 8, smirk: 0.8, browL: 0.7 }]])} x={0.05} />
        <CardShoe p={[0.02, TOP + 0.01, 0.12]} edge={AMBER} glow={ramp(g, wd("16", "back") - 2, wd("16", "next"))} />
      </Casino>
    ),
  }),
  S18: (t, len, g) => {
    const tilt = interpolate(g, [wd("17", "become") - 4, wd("17", "six") + 6], [-1, 1], CLAMP);
    return {
      light: "stage",
      cam: glide(cm([0, 1.5, 4.0], [0, 1.24, 0], 30), cm([0, 1.5, 3.8], [0, 1.24, 0], 30), t, len),
      world: (
        <Casino f={g} sign={LONDON}>
          <Balance p={[0, TOP, 0.05]} tilt={tilt} left={<ChipStack n={8} c="#B8342C" r={0.07} />} right={<ChipStack n={8} c="#1F4F8C" r={0.07} />} />
          <Panel map={signTex("HOUSE", "rgba(0,0,0,0)", "#F3E9D2", 512, 128, 90)} w={0.34} h={0.085} p={[-0.38, TOP + 0.02, 0.2]} r={[-0.6, 0, 0]} alpha />
          <Panel map={signTex("HIM", "rgba(0,0,0,0)", "#F3E9D2", 512, 128, 90)} w={0.34} h={0.085} p={[0.38, TOP + 0.02, 0.2]} r={[-0.6, 0, 0]} alpha />
          <Ivey pose={{ smirk: 0.6, lookX: 0, lookY: -0.3 }} x={0} />
        </Casino>
      ),
      over: (
        <>
          <Chip x={290} y={300} at={lineStart("17")} text="1%" kind="pop" size={90} color="#FF7A6A" />
          <Chip x={715} y={300} at={wd("17", "six")} text="6.5%" kind="pop" size={90} color={AMBER} />
        </>
      ),
    };
  },
  // ---------- the money ----------
  S19: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.42, 1.56, 1.65], [0.42, 1.08, -0.5], 34), cm([0.42, 1.54, 1.52], [0.42, 1.08, -0.5], 34), t, len),
    world: (
      <Casino f={g} sign={LONDON}>
        <Chairs />
        <Ivey pose={act(t, [[0, { armL: ON_TABLE, armR: ON_TABLE, lookY: -0.5, pitch: 6 }], [14, { armL: ON_TABLE, armR: { f: 58, e: -28, o: 2 }, lookY: -0.5, pitch: 6 }], [len, { armL: ON_TABLE, armR: ON_TABLE, lookY: -0.2, pitch: 2 }]])} />
        <ChipStack p={[0.32, TOP, -0.42 + ramp(t, 4, 20) * 0.34]} n={5} c="#B8342C" r={0.06} />
      </Casino>
    ),
    over: <Chip x={500} y={300} at={wd("18", "four")} text="£4,000" kind="pop" size={88} color={AMBER} />,
  }),
  S20: (t, len, g) => {
    const k = ramp(g, wd("19", "hit") - 2, wd("19", "thousand") + 6);
    return {
      light: "stage",
      cam: glide(cm([0.2, 1.72, 3.75], [0.1, 1.56, -0.6], 38), cm([0.2, 1.7, 3.5], [0.1, 1.56, -0.6], 38), t, len),
      world: (
        <Casino f={g} sign={LONDON} board={thousands(4000 + (150000 - 4000) * k)}>
          <Chairs />
          <Ivey pose={act(t, [[0, { armL: ON_TABLE, armR: { f: 58, e: -28, o: 2 }, lookY: -0.4 }], [len * 0.6, { armL: ON_TABLE, armR: ON_TABLE, smirk: 0.6, lookY: 0 }]])} />
          <Partner pose={{ smile: 0.3 }} />
          <ChipStack p={[0.0, TOP, 0.04]} n={8 + 22 * k} c="#B8342C" r={0.06} />
          <ChipStack p={[0.14, TOP, 0.04]} n={6 + 24 * k} c="#1E1A22" r={0.06} seed={2} />
          <ChipStack p={[0.07, TOP, 0.17]} n={4 + 20 * k} c="#1F4F8C" r={0.06} seed={3} />
        </Casino>
      ),
    };
  },
  S21: (t, len, g) => {
    const from = wd("20", "read") - 2;
    const to = wd("20", "nineteen") + 2;
    const shown = interpolate(g, [from, to], [0, 19], CLAMP);
    const MISS = new Set([6, 13]);
    const hits = Array.from({ length: Math.floor(shown) }, (_, i) => i).filter((i) => !MISS.has(i)).length;
    return {
      light: "stage",
      post: { bloom: 0.08 },
      cam: topCam(3.55, 34, 0.5),
      world: (
        <Casino f={g} sign={LONDON} lamp={2.5}>
          {Array.from({ length: 19 }, (_, i) => {
            const k = Math.max(0, Math.min(1, shown - i));
            return <Card key={i} p={[((i % 4) - 1.5) * 0.19, TOP + 0.004 + Math.sin(k * Math.PI) * 0.06, (Math.floor(i / 4) - 2) * 0.27 + 0.13]} s={1} flip={MISS.has(i) ? 0 : k} edge={MISS.has(i) ? "#FF5A4A" : AMBER} glow={k >= 1 ? 1 : 0} />;
          })}
        </Casino>
      ),
      over: shown > 0 ? <Chip x={500} y={300} at={from} text={`${hits} / 19`} kind="still" size={92} color={AMBER} /> : null,
    };
  },
  S22: (t, len, g) => {
    const k = ramp(g, lineStart("21"), wd("21", "pounds") + 3);
    return {
      light: "stage",
      cam: glide(cm([0.02, 1.7, 4.3], [0.02, 1.54, -0.5], 38), cm([0.02, 1.7, 3.95], [0.02, 1.54, -0.5], 38), t, len),
      world: (
        <Casino f={g} sign={LONDON} board={pounds(0.1 + 7.6 * k)}>
          <Chairs />
          <Ivey pose={act(t, [[0, { armL: ON_TABLE, armR: ON_TABLE, lookY: -0.3 }], [len * 0.7, { lean: -7, smile: 0.5, smirk: 0.7, armL: { f: 8, o: 22 }, armR: { f: 8, o: 22 } }]])} />
          <Partner pose={{ smile: 0.4, yaw: 16, lookX: 0.7 }} />
          <ChipHill p={[0, TOP, 0.04]} k={0.15 + 0.85 * k} cols={3} rows={4} max={44} />
        </Casino>
      ),
    };
  },
  S23: (t, len, g) => {
    const k = ramp(g, wd("22", "nine") - 2, wd("22", "dollars") + 3);
    return {
      light: "day",
      cam: glide(cm([-0.12, 1.74, 4.3], [0, 1.54, -0.5], 38), cm([-0.02, 1.74, 4.0], [0, 1.54, -0.5], 38), t, len),
      world: (
        <Casino f={g} sign={US} neon="#C77DFF" board={k > 0 ? `$${(9.6 * k).toFixed(1)}M` : "ATLANTIC CITY"} boardC={k > 0 ? "#7CE07C" : AMBER}>
          <Chairs />
          <Ivey pose={{ armL: ON_TABLE, armR: ON_TABLE, smile: 0.4 }} />
          <Partner pose={{ smile: 0.4 }} />
          <ChipHill p={[0, TOP, 0.04]} k={0.2 + 0.8 * k} cols={3} rows={4} max={40} seed={5} />
        </Casino>
      ),
    };
  },
  S24: (t, len, g) => ({
    light: "day",
    cam: cm([1.0, 1.56, 3.1], [-0.02, 1.34, -0.1], 34),
    world: (
      <CashCage sign="CASHIER">
        <Person look={extra(44, { top: "#2E6E7A", shirt: "#F3EFE6", hairStyle: "short", glasses: false, moustache: false })} pose={{ z: -1.0, smile: 0.5, armL: { f: 52, e: -30, o: 4 }, armR: { f: 52, e: -30, o: 4 } }} />
        {Array.from({ length: 8 }, (_, i) => {
          const k = ramp(t, i * 2, i * 2 + 12);
          return <Bundle key={i} p={[-0.34 + (i % 4) * 0.23, 1.075 + Math.floor(i / 4) * 0.075, -0.5 + k * 0.42]} c="#9CC29A" />;
        })}
        <Person look={CAST.ivey} pose={{ x: -0.36, z: 0.7, ry: 158, ...act(t, [[0, { armL: { o: 8 }, armR: { o: 8 } }], [18, { smile: 0.6, armL: { f: 44, e: -30, o: 6 }, armR: { f: 44, e: -30, o: 6 } }]]) }} />
      </CashCage>
    ),
  }),
  // ---------- the turn ----------
  S25: (t, len, g) => {
    const land = lineEnd("24") + 2;
    const k = ramp(g, land - 16, land);
    const dark = ramp(g, land + 4, land + 14);
    return {
      light: "cool",
      cam: cm([1.0, 1.56, 3.1], [-0.02, 1.4, -0.1], 34),
      world: (
        <CashCage sign={LONDON} shutter={k} lit={1 - dark * 0.8}>
          <Person look={CAST.ivey} pose={{ x: -0.36, z: 0.7, ry: 158, ...act(g - land, [[-16, { armL: { f: 34, e: -30, o: 6 }, armR: { f: 34, e: -30, o: 6 } }], [2, { lean: -5, armL: { o: 8 }, armR: { o: 8 } }]]) }} />
        </CashCage>
      ),
    };
  },
  S26: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.02, 1.62, 3.2], [0.02, 1.16, -0.6], 32), cm([0.02, 1.62, 3.05], [0.02, 1.16, -0.6], 32), t, len),
    world: (
      <Office f={g} night plate={LONDON}>
        <Person look={{ ...CAST.lawmaker, hair: "#9A9288", glasses: true, top: "#1E2430", pants: "#1E2430" }} pose={{ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, yaw: Math.sin(ramp(g, wd("25", "told") - 2, lineEnd("25")) * Math.PI * 4) * 10, mouth: talk(g, g < lineEnd("25") - 2) }} />
        <Person look={CAST.ivey} pose={{ x: 0.56, z: 1.0, ry: 180, armL: { o: 8 }, armR: { o: 8 }, ...act(t, [[0, {}], [len * 0.6, { lean: 3, roll: 3 }]]) }} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={lineStart("25")} text="9 DAYS" kind="pop" size={84} color={AMBER} />,
  }),
  S27: (t, len, g) => {
    const slide = ramp(t, 6, 24);
    return {
      light: "cool",
      cam: glide(cm([0.04, 1.86, 1.62], [0, 1.2, -0.3], 32), cm([0.04, 1.84, 1.5], [0, 1.2, -0.3], 32), t, len),
      world: (
        <CashCage sign={LONDON} shutter={0.45} lit={0.6}>
          <Bundle p={[0, 1.075, -0.42 + slide * 0.34]} c="#C8B8D8" />
          <PressHand p={[0, 1.13, -0.46 + slide * 0.34]} r={[-1.1, 0, 0]} s={1} sleeve="#2E6E7A" />
        </CashCage>
      ),
      over: <Chip x={500} y={300} at={wd("26", "one")} text="£1M" kind="pop" size={90} color="#FFFFFF" />,
    };
  },
  // ---------- court ----------
  S28: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([1.5, 1.62, 3.9], [0.15, 1.36, 0.45], 36), cm([1.44, 1.62, 3.72], [0.15, 1.36, 0.45], 36), t, len),
    world: (
      <Chamber f={g}>
        <Person look={JUDGE} pose={{ z: -0.75, armL: { f: 24, e: -30, o: 8 }, armR: { f: 24, e: -30, o: 8 }, yaw: 8 }} />
        <GavelBlock p={[0.3, 1.17, -0.12]} />
        <Person look={CAST.ivey} pose={{ x: 0.28, z: 1.5, ry: 180, ...act(t, [[0, { armL: { o: 8 }, armR: { o: 8 } }], [14, { brow: 0.5, armL: { f: 30, e: -60, o: 12 }, armR: { f: 30, e: -60, o: 12 } }], [len * 0.65, { shrug: 0.5, brow: 0.8, armL: { f: 36, e: -70, o: 18 }, armR: { f: 36, e: -70, o: 18 } }]]), mouth: talk(g, g < lineEnd("27") - 3) }} />
      </Chamber>
    ),
  }),
  S29: (t, len, g) => ({
    light: "warm",
    cam: cm([0.1, 1.68, 1.3], [0, 1.66, -0.75], 28),
    world: (
      <Chamber f={g}>
        <Person look={JUDGE} pose={{ z: -0.75, ...act(t, [[0, { lookY: 0, heavy: 0.2, armL: { f: 24, e: -30, o: 8 }, armR: { f: 24, e: -30, o: 8 } }], [10, { pitch: 8, heavy: 0.2, armL: { f: 24, e: -30, o: 8 }, armR: { f: 24, e: -30, o: 8 } }], [18, { pitch: 0, smile: 0.1, armL: { f: 24, e: -30, o: 8 }, armR: { f: 24, e: -30, o: 8 } }]]) }} />
      </Chamber>
    ),
  }),
  S30: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0, 2.6, 7.2], [0, 2.0, -1], 34), cm([0, 2.6, 6.85], [0, 2.0, -1], 34), t, len),
    world: (
      <Chamber f={g}>
        <Panel map={signTex("SUPREME COURT", "#0B0B10", N.gold, 1024, 170, 104)} w={2.1} h={0.35} p={[0, 3.46, -2.9]} glow={0.95} />
        {JUSTICES.map((x, i) => <Person key={i} look={justice(i)} pose={{ x, z: -0.75, armL: { f: 24, e: -30, o: 8 }, armR: { f: 24, e: -30, o: 8 } }} />)}
        <Person look={CAST.ivey} pose={{ z: 2.5, ry: 180, armL: { o: 8 }, armR: { o: 8 } }} />
      </Chamber>
    ),
  }),
  S31: (t, len, g) => {
    const hits = HITS.map((x) => x - at("S31"));
    return {
      light: "warm",
      cam: glide(cm([0, 1.84, 6.7], [0, 1.66, -0.75], 34), cm([0, 1.84, 6.5], [0, 1.66, -0.75], 34), t, len),
      world: (
        <Chamber f={g}>
          {JUSTICES.map((x, i) => (
            <group key={i}>
              <GavelBlock p={[x - 0.18, 1.17, -0.15]} />
              <Person look={justice(i)} pose={{ x, z: -0.75, armL: { f: 24, e: -30, o: 8 }, armR: strikeArm(strike(t, [hits[i]])) }} holdR={<GavelHeld />} />
            </group>
          ))}
        </Chamber>
      ),
      over: <Chip x={500} y={300} at={HITS[4]} text="5 – 0" kind="pop" size={100} color={AMBER} />,
    };
  },
  S32: (t, len, g) => {
    const up = Math.sin(t / 11) * 8;
    const armI = { f: 118 + up, e: -18, o: 16 };
    const armI2 = { f: 118 - up, e: -18, o: 16 };
    const armD = { f: 42 + up * 1.4, e: -30, o: 6 };
    const armD2 = { f: 42 - up * 1.4, e: -30, o: 6 };
    const I: V3 = [0, 0.74, -0.7];
    const Dd: V3 = [0, 0, 0.1];
    return {
      light: "stage",
      cam: glide(cm([0, 1.86, 4.5], [0, 1.74, -0.2], 34), cm([0, 1.86, 4.25], [0, 1.74, -0.2], 34), t, len),
      world: (
        <Void>
          <P g={cyl(0.8, 0.9, 0.74, 12)} c="#2A2224" p={[I[0], 0, I[2]]} />
          <Person look={CAST.ivey} pose={{ x: I[0], y: I[1], z: I[2], armL: armI, armR: armI2, smirk: 0.7, lookY: -0.5, pitch: 8, browL: 0.5 }} />
          <Person look={CAST.dealer} pose={{ x: Dd[0], z: Dd[2], armL: armD, armR: armD2, smile: 0.3, lookY: -0.2 }} holdR={<Card p={[0, -0.01, 0.08]} r={[Math.PI / 2, 0, 0]} s={1.1} edge={AMBER} />} />
          {[1, -1].map((s) => <Str key={s} a={handAt(s as 1 | -1, Dd, s > 0 ? armD : armD2)} b={handAt(s as 1 | -1, I, s > 0 ? armI : armI2)} />)}
          <pointLight position={[0, 3.2, 2.2]} intensity={12} distance={8} color="#FFE2BE" />
        </Void>
      ),
    };
  },
  S33: (t, len, g) => {
    const hit = lineEnd("32") - 2;
    const k = interpolate(g, [hit - 9, hit - 1], [0, 1], CLAMP);
    return {
      light: "stage",
      cam: topCam(1.55, 34, 0.36),
      world: (
        <Casino f={g} sign={LONDON} lamp={3}>
          <Card p={[0, TOP + 0.004, 0.02]} s={2.1} edge={AMBER} />
          {g >= hit - 1 ? <Box w={0.34} h={0.002} d={0.12} c="#F4EFE2" p={[0, TOP + 0.009, 0.02]} shadow={false} /> : null}
          <Stamp p={[0, TOP + 0.009, 0.02]} k={g >= hit + 7 ? 1 - ramp(g, hit + 7, hit + 18) : k} word="CHEATING" printed={g >= hit - 1} />
          <CardLight />
        </Casino>
      ),
      over: (
        <>
          <Chip x={290} y={300} at={wd("32", "clever") - 1} text="CLEVER" kind="pop" size={70} color={TEAL} out={hit - 1} />
          <Chip x={700} y={300} at={wd("32", "skillful") - 1} text="SKILLFUL" kind="pop" size={70} color={TEAL} out={hit - 1} />
        </>
      ),
    };
  },
  // ---------- America ----------
  S34: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.7, 1.72, 3.2], [0.05, 1.46, -0.6], 32), cm([0.66, 1.72, 3.0], [0.05, 1.46, -0.6], 32), t, len),
    world: (
      <Chamber f={g}>
        <Panel map={usFlag()} w={0.72} h={0.43} p={[-0.56, 2.32, -3.72]} glow={0.75} />
        <Person look={{ ...CAST.lawmaker, hair: "#3A2E2A", top: "#14141A", pants: "#14141A", shirt: "#F3EFE6", tie: "#14141A" }} pose={{ z: -0.75, armL: { f: 24, e: -30, o: 8 }, armR: { f: 24, e: -30, o: 8 }, mouth: talk(g, g < lineEnd("33") - 2) * 0.5, ...act(t, [[0, { yaw: 3 }], [len * 0.6, { yaw: -3, pitch: 5 }]]) }} />
        {Array.from({ length: 6 }, (_, i) => <Bundle key={i} p={[-0.6 + (i % 3) * 0.23 + ramp(g, wd("33", "ordered") + i * 2, wd("33", "back") + i * 2) * 0.6, 1.17 + Math.floor(i / 3) * 0.075, 0.18]} c="#9CC29A" />)}
      </Chamber>
    ),
    over: (
      <>
        <Chip x={300} y={300} at={wd("33", "fraud")} text="NO FRAUD" kind="pop" size={62} color={TEAL} />
        <Chip x={720} y={300} at={wd("33", "ten")} text="$10.1M" kind="pop" size={74} color={AMBER} />
      </>
    ),
  }),
  S35: (t, len, g) => {
    const close = ramp(g, wd("34", "terms") - 2, lineEnd("34") - 4);
    return {
      light: "warm",
      cam: topCam(1.7, 34, 0.42),
      world: (
        <Casino f={g} sign={LONDON} lamp={3}>
          <group position={[0, TOP + 0.006, 0.02]} scale={1.5}>
            <Box w={0.2} h={0.003} d={0.28} c="#F3EAD6" p={[-0.12, 0.011, 0]} shadow={false} />
            <Folder open={close} />
          </group>
          <PressHand p={[0.36 - close * 0.3, TOP + 0.12 + Math.sin(close * Math.PI) * 0.18, 0.12]} r={[1.05, 0.5, 0]} s={1.3} sleeve="#1E2430" />
          <CardLight />
        </Casino>
      ),
    };
  },
  // ---------- the question ----------
  S36: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.92, 1.42], [0, TOP + 0.06, 0.02], 26), cm([0, 1.9, 1.34], [0, TOP + 0.06, 0.02], 26), t, len),
    world: (
      <Casino f={g} sign={LONDON} lamp={3}>
        {Array.from({ length: 22 }, (_, i) => <Card key={i} p={[0, TOP + 0.004 + i * 0.0045, 0]} s={1.9} edge={i === 21 ? AMBER : undefined} glow={ramp(t, 6, 16)} />)}
        <CardLight />
      </Casino>
    ),
  }),
  S37: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.42, 1.24, 1.5], [0.42, 1.14, -0.98], 28), cm([0.42, 1.24, 1.4], [0.42, 1.14, -0.98], 28), t, len),
    world: (
      <Casino f={g} sign={LONDON}>
        <Chairs />
        <Ivey pose={{ smirk: 0.4, lookX: 0, lookY: 0, brow: 0.3, blink: 0 }} />
      </Casino>
    ),
  }),
  S38: (t, len, g) => ({
    light: "stage",
    cam: LOOP_CAM,
    world: <LoopWorld g={g} hill={LOOP_HILL} />,
  }),
};

// ---------------- the court ----------------
const JUDGE = { ...CAST.lawmaker, hair: "#D8D2C8", top: "#1A1A22", pants: "#1A1A22", tie: "#F3EFE6" };
const JUSTICES = [-1.04, -0.52, 0, 0.52, 1.04];
const JUSTICE_LOOK = [
  { skin: "#E6B693", hair: "#CFCAC2", hairStyle: "recede" as const, top: "#20202A" },
  { skin: "#E2A882", hair: "#D8D2C8", hairStyle: "long" as const, top: "#2A2030" },
  { skin: "#E6B693", hair: "#8E8880", hairStyle: "short" as const, top: "#1E2430" },
  { skin: "#D9A47E", hair: "#3A2E2A", hairStyle: "short" as const, top: "#20242C", glasses: true },
  { skin: "#F0C8A8", hair: "#B8B2A8", hairStyle: "recede" as const, top: "#1A1A22" },
];
const justice = (i: number) => ({ ...JUSTICE_LOOK[i], pants: "#1A1A22", shirt: "#F3EFE6", tie: "#3A2E2A" });
/** five gavels in the pause after "against him" */
const HITS = [0, 5, 10, 15, 20].map((d) => lineEnd("30") + d - 2);
const usFlag = () =>
  ctex("usflag", 512, 306, (x) => {
    for (let i = 0; i < 13; i++) {
      x.fillStyle = i % 2 ? "#E8E2D4" : "#A8332C";
      x.fillRect(0, (i * 306) / 13, 512, 306 / 13 + 1);
    }
    x.fillStyle = "#28386A";
    x.fillRect(0, 0, 210, 165);
  });

const ROOMS = [
  ["S1", "S23", "sfx/synth/room-casino.wav"],
  ["S26", "S26", "sfx/synth/room-office.wav"],
  ["S28", "S31", "sfx/synth/room-chamber.wav"],
  ["S35", "S38", "sfx/synth/room-casino.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence before "London did not" and before the last question
  const duck = (g: number) =>
    interpolate(
      g,
      [lineEnd("23") - 4, lineEnd("23") + 4, lineEnd("24") + 8, lineEnd("24") + 26, lineEnd("36") - 2, lineEnd("36") + 8, lineStart("37"), lineEnd("37") + 8],
      [1, 0, 0, 0.7, 0.7, 0.25, 0.25, 0.7],
      CLAMP,
    );
  const land = lineEnd("24") + 2;
  const flicks = [wd("01", "cards") - 3, wd("02", "pure") + 6, wd("02", "percent") - 4, wd("09", "good") + 3, wd("09", "bad") + 3];
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="ivey-edge" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      {flicks.map((x) => <Sfx key={x} file="sfx/synth/card-flick.wav" at={x} level={-27} align="onset" />)}
      <Sfx file="sfx/synth/chip-stack.wav" at={wd("01", "won") + 2} level={-29} align="onset" />
      <Sfx file="sfx/synth/card-shuffle.wav" at={at("S16") + 2} level={-27} seconds={sec("S16", "S17")} />
      <Sfx file="sfx/click/digital-click-357350.mp3" at={wd("16", "next")} level={-26} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={wd("17", "six") + 6} level={-27} align="onset" seconds={1} />
      <Sfx file="sfx/synth/chip-stack.wav" at={at("S19") + 4} level={-28} align="onset" />
      <Sfx file="sfx/synth/chip-stack.wav" at={wd("19", "thousand") + 4} level={-25} align="onset" />
      <Sfx file="sfx/synth/chip-stack.wav" at={wd("21", "pounds") + 2} level={-24} align="onset" />
      <Sfx file="sfx/synth/shutter-down.wav" at={land - Math.round(1.05 * 30)} level={-22} seconds={2} />
      <Sfx file="sfx/synth/chip-stack.wav" at={at("S24") + 6} level={-30} align="onset" />
      {HITS.map((x) => <Sfx key={x} file="sfx/tick/typewriter-soft-hit-1366.mp3" at={x} level={-20} align="onset" />)}
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={HITS[4]} level={-24} align="onset" seconds={1} />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("32") - 1} level={-23} align="onset" />
      <Sfx file="sfx/pop/page-turn-single-1104.mp3" at={lineEnd("34") - 5} level={-24} align="onset" />
    </Episode>
  );
};

/** 9:16 thumbnail: his face, arms crossed, the chips he never got; the money and the question. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" post={{ bloom: 0.2 }} cam={cm([0.42, 1.24, 2.15], [0.42, 1.2, -0.98], 32)} over={<ThumbText top="£7.7M" bottom="UNPAID" size={150} y={250} />}>
    <Casino f={0} sign={LONDON}>
      <Chairs />
      <Ivey pose={{ blink: 0, smirk: 1, browL: 1, lookX: 0, lookY: 0, yaw: -4, roll: -3 }} />
      <Card p={[0.42, TOP + 0.02, 0.2]} s={1.8} edge={AMBER} />
      <pointLight position={[0.9, 2, 1.8]} intensity={2.4} distance={4} color="#FFD9B8" />
    </Casino>
  </Shot3D>
);
