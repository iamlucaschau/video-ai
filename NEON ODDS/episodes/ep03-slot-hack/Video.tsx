/**
 * NEON ODDS ep03 · slot-hack. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-slot-hack-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * Faces: a player who must be seen sits on −z facing +z at a machine turned round (ry 180), so the key light is on his
 * face and the teal rim stays behind him. Machine names, reel symbols and the numbers on the tape are made up.
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, Box, Cctv, Chip, glide, Panel, Person, type Pose, Shot3D, signTex, SIT, talk, useLiveTex, type V3, walk } from "../../../Style Library/N-low-poly/lowpoly";
import { Balance, Clock, Crt, Desk, LedBoard, Phone, type PhoneScreen, PressHand, SLOT, SlotMachine, Stamp } from "../../../Style Library/N-low-poly/props";
import { CAST, CoinTower, extra, Interview, Office, SLOT_STEP, SlotFloor, Void, Warehouse } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/slot-hack.timing.json";
import rawWords from "../../../src/voiceover/slot-hack.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/slot-hack.mp3";

const AMBER = "#FFB347";
const TEAL = "#62D2DC";
const CCTV = "grayscale(0.85) sepia(0.2) contrast(1.08) brightness(0.98)";
const DESK_Y = 0.77;
const REST = { o: 8 };
const talking = (g: number, end: number) => talk(g, g < end - 3);
/** seated on a slot stool (seat 0.66, a chair's is 0.46) */
const STOOL: Pose = { ...SIT, y: -0.24 };
const PLAY: Pose = { ...STOOL, armL: { f: 44, e: -50, o: 8 }, armR: { f: 50, e: -46, o: 6 } };
const LAND = [1, 2, 3];
const WIN = [0, 0, 0];
const SLEEVE = CAST.bliev.top;
const SKIN = CAST.bliev.skin;
const OfficeSeat = (p: Pose = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...p });
const TYPE = { f: 50, e: -50, o: 8 };
const TYPE2 = { f: 56, e: -44, o: 8 };
const typing = (g: number) => (Math.floor(g / 7) % 2 ? { armL: TYPE, armR: TYPE2 } : { armL: TYPE2, armR: TYPE });

// ---------------- the hero close-up: phone at the screen, finger on the button (first and last picture) ----------------
const LOOP_CAM = cm([0.3, 1.32, 2.05], [-0.02, 1.08, 0.25], 34);
const BTN = SLOT.button;
/** the phone held up beside the screen (left hand), the finger over the spin button (right hand, from the right) */
const HeroClose: React.FC<{ f: number; screen?: PhoneScreen; k?: number; buzz?: number; hover?: number; press?: number; spin?: number; win?: number; land?: number[] }> = ({ f, screen = "app", k = 0, buzz = 0, hover = 0.06, press = 0, spin = 0, win = 0, land = LAND }) => (
  <SlotFloor f={f} rows={2} stools={false}>
    <SlotMachine f={f} land={land} spin={spin} win={win} press={press} />
    <Phone p={[-0.13, 1.02, 0.62]} r={[-0.15, 0.25, 0]} s={1.3} f={f} screen={screen} k={k} buzz={buzz} />
    <PressHand p={[-0.19, 0.93, 0.62]} r={[0.3, 0.2, 1.3]} sleeve={SLEEVE} skin={SKIN} />
    <PressHand p={[BTN[0], BTN[1] + 0.012 + hover - press * 0.012, BTN[2] + 0.02]} r={[0.28, 0, -1.42]} sleeve={SLEEVE} skin={SKIN} />
    <pointLight position={[0.3, 1.5, 1.0]} intensity={1.2} distance={2.2} color="#FFE6C0" />
  </SlotFloor>
);

// ---------------- the turned-round machine: his face on the key light ----------------
/** a machine at z = 0 facing −z, the player on −z facing +z, a row of lit machines far behind him */
const FaceSet: React.FC<{ f: number; children?: React.ReactNode; win?: number; spin?: number }> = ({ f, children, win = 0, spin = 0 }) => (
  <group>
    <group position={[0, 0, -2.6]}>
      <SlotFloor f={f} rows={1} hero={false} stools={false} />
    </group>
    <SlotMachine p={[0, 0, 0]} ry={180} f={f} win={win} spin={spin} />
    <pointLight position={[-0.6, 1.9, 0.4]} intensity={3} distance={3.6} color="#FFE2BE" />
    {children}
  </group>
);
const FACE_CAM = cm([-1.7, 1.62, 0.7], [0, 1.42, -0.72], 32);
const FACE_CAM2 = cm([-1.65, 1.62, 0.6], [0, 1.42, -0.72], 32);

// ---------------- number tape: the "random" numbers (illustration only) ----------------
/** six cells; `mode` random (changes every 4 frames), loop (one short sequence repeating, amber), or walk (cursor on cell `cur`) */
const NumTape: React.FC<{ p: V3; w?: number; f: number; mode: "random" | "loop" | "walk"; cur?: number; lit?: number }> = ({ p, w = 1.0, f, mode, cur = -1, lit = 0 }) => {
  const SEQ = [17, 42, 8, 17, 42, 8];
  const tex = useLiveTex(1024, 192, (c) => {
    c.fillStyle = "#06120E";
    c.fillRect(0, 0, 1024, 192);
    c.font = "900 104px Consolas, monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    for (let i = 0; i < 6; i++) {
      const x = 86 + i * 170;
      const n = mode === "random" ? (Math.floor(f / 4) * 37 + i * 53 + ((i * Math.floor(f / 4)) % 7) * 11) % 99 : SEQ[i];
      if (mode === "walk" && Math.round(cur) === i) {
        c.fillStyle = AMBER;
        c.fillRect(x - 78, 14, 156, 164);
      }
      c.fillStyle = mode === "walk" && Math.round(cur) === i ? "#06120E" : mode === "loop" && lit > 0 && i % 3 === Math.floor(f / 6) % 3 ? AMBER : mode === "loop" ? "#FFD08A" : "#5CFF8A";
      c.fillText(String(n).padStart(2, "0"), x, 100);
    }
  });
  return (
    <group position={p}>
      <Box w={w + 0.1} h={w * 0.1875 + 0.1} d={0.06} c="#14161C" p={[0, -(w * 0.1875) / 2 - 0.05, -0.04]} />
      <Panel map={tex} w={w} h={w * 0.1875} glow={1.1} />
    </group>
  );
};

// ---------------- other helpers ----------------
/** the accountants' screen: money in vs money out; `k` grows the out bar past the in bar */
const InOut: React.FC<{ p: V3; k: number }> = ({ p, k }) => {
  const tex = useLiveTex(512, 384, (c) => {
    c.fillStyle = "#0C1A1E";
    c.fillRect(0, 0, 512, 384);
    c.fillStyle = "#3A4A50";
    c.fillRect(40, 320, 432, 4);
    c.fillStyle = TEAL;
    c.fillRect(110, 320 - 170, 110, 170);
    c.fillStyle = AMBER;
    const h = 120 + k * 140;
    c.fillRect(292, 320 - h, 110, h);
    c.fillStyle = "#F3EFE6";
    c.font = "900 44px Arial Black, Arial, sans-serif";
    c.textAlign = "center";
    c.fillText("IN", 165, 365);
    c.fillText("OUT", 347, 365);
  });
  return (
    <group position={p}>
      <Box w={1.2} h={0.94} d={0.06} c="#14161C" p={[0, -0.47, -0.04]} />
      <Panel map={tex} w={1.1} h={0.82} glow={1} />
    </group>
  );
};
/** a monitor on a desk or wall, its picture a slot machine's reels or the tape */
const Monitor: React.FC<{ p: V3; ry?: number; w?: number; children: React.ReactNode }> = ({ p, ry = 0, w = 0.62, children }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box w={w + 0.06} h={w * 0.62 + 0.06} d={0.05} c="#101216" p={[0, -(w * 0.31) - 0.03, -0.03]} />
    {children}
  </group>
);
const reelPic = () =>
  signTex("7  BAR  ★", "#0A0810", "#F7F1E4", 512, 320, 90);
const Bag: React.FC = () => <Box w={0.2} h={0.16} d={0.07} c="#6A4428" p={[0, -0.16, 0.02]} />;
/** a man walking toward +z along a straight line, `t` frames in */
const walker = (t: number, z0: number, speed = 0.022): Pose => ({ z: z0 + t * speed, ...walk(t * 0.32, 22) });
const CHAIR_EXTRA = (seed: number) => extra(seed, { top: ["#3A3A44", "#2E4A5A", "#4A3A2E"][seed % 3] });

const S: Record<string, ShotFn> = {
  // ---------- hook ----------
  S1: (t, len, g) => {
    const cue = wd("01", "moment");
    const press = ramp(g, wd("01", "spin") - 2, wd("01", "spin") + 2) - ramp(g, wd("01", "spin") + 6, wd("01", "spin") + 12);
    return {
      light: "stage",
      cam: glide(LOOP_CAM, cm([0.3, 1.32, 1.95], [-0.02, 1.08, 0.25], 34), t, len),
      world: <HeroClose f={g} k={ramp(g, at("S1"), cue)} buzz={ramp(g, cue - 2, cue + 2) - ramp(g, cue + 14, cue + 20)} hover={0.06 - ramp(g, cue, wd("01", "spin")) * 0.06} press={press} spin={ramp(g, wd("01", "spin"), wd("01", "spin") + 40)} win={ramp(g, wd("01", "spin") + 40, wd("01", "spin") + 44)} land={g > wd("01", "spin") ? WIN : LAND} />,
    };
  },
  // ---------- St. Louis ----------
  S2: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([2.6, 2.3, 3.8], [0, 1.1, -0.4], 36), cm([2.4, 2.25, 3.55], [0, 1.1, -0.4], 36), t, len),
    world: (
      <SlotFloor f={g} sign="ST. LOUIS">
        <SlotMachine f={g} spin={(t % 50) / 50} />
        <Person look={CAST.bliev} pose={{ z: 0.72, ry: 180, ...PLAY, armR: { f: 80, e: -50, o: 12 } }} holdR={<Phone p={[0, -0.04, 0.05]} r={[0, Math.PI, 0]} s={0.9} screen="rec" f={g} />} holdL={<Bag />} />
        <Person look={CHAIR_EXTRA(4)} pose={{ x: -2 * SLOT_STEP, z: 0.72, ry: 180, ...PLAY }} />
      </SlotFloor>
    ),
    over: <Chip x={500} y={300} at={wd("02", "june")} text="JUNE 2014" kind="pop" size={78} color={AMBER} />,
  }),
  S3: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([1.5, 1.6, 2.3], [-0.05, 1.22, 0.3], 32), cm([1.42, 1.6, 2.15], [-0.05, 1.22, 0.3], 32), t, len),
    world: (
      <SlotFloor f={g}>
        <SlotMachine f={g} />
        <Person look={CAST.bliev} pose={{ z: 0.72, ry: 180, ...PLAY, ...act(t, [[0, { armR: { f: 50, e: -46, o: 6 } }], [14, { armR: { f: 92, e: -38, o: 14 } }]]) }} holdR={<Phone p={[0, -0.04, 0.05]} r={[0, Math.PI, 0]} s={0.9} screen="rec" f={g} />} />
      </SlotFloor>
    ),
  }),
  S4: (t, len, g) => {
    const jab = wd("04", "jabbed");
    const hover = interpolate(g, [at("S4"), jab - 4, jab], [0.07, 0.05, 0], CLAMP) + Math.sin(t * 0.4) * 0.004 * (g < jab - 4 ? 1 : 0);
    return {
      light: "stage",
      cam: cm([0.62, 1.32, 1.45], [0.1, 0.98, 0.2], 32),
      world: (
        <SlotFloor f={g} rows={1} stools={false}>
          <SlotMachine f={g} press={ramp(g, jab - 1, jab + 1) - ramp(g, jab + 6, jab + 10)} spin={ramp(g, jab, jab + 40)} />
          <PressHand p={[BTN[0], BTN[1] + 0.012 + hover, BTN[2] + 0.02]} r={[0.28, 0, -1.42]} sleeve={SLEEVE} skin={SKIN} />
          <pointLight position={[0.4, 1.4, 0.9]} intensity={1.2} distance={2} color="#FFE6C0" />
        </SlotFloor>
      ),
    };
  },
  S5: (t, len, g) => ({
    light: "stage",
    cam: glide(FACE_CAM, FACE_CAM2, t, len),
    world: (
      <FaceSet f={g} win={ramp(t, 4, 10)}>
        <Person look={CAST.bliev} pose={{ z: -0.72, ...PLAY, ...act(t, [[0, { smile: 0 }], [16, { smirk: 0.5, browL: 0.4, smile: 0.1 }]]), lookY: -0.1 }} />
      </FaceSet>
    ),
    over: <Chip x={500} y={300} at={wd("05", "twenty-one")} to={21000} pre="$" kind="count" dur={20} size={86} color={AMBER} />,
  }),
  S6: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.6, 1.55, 2.7], [0.1, 1.42, -1.2], 34), cm([0.6, 1.55, 2.55], [0.1, 1.42, -1.2], 34), t, len),
    world: (
      <Office f={g} night plate="ACCOUNTS">
        <InOut p={[0.2, 1.95, -2.25]} k={ramp(g, wd("06", "paid"), wd("06", "took"))} />
        <Person look={CHAIR_EXTRA(7)} pose={OfficeSeat({ yaw: -24, lookX: -0.2, lookY: 0.6, pitch: -6, brow: ramp(g, wd("06", "took"), wd("06", "took") + 8) })} />
      </Office>
    ),
  }),
  S7: (t, len, g) => ({
    light: "cool",
    filter: CCTV,
    cam: cm([-1.4, 3.0, 2.6], [0.1, 0.9, 0], 42),
    world: (
      <SlotFloor f={Math.floor(g / 3) * 3}>
        <SlotMachine f={g} />
        <Person look={CAST.bliev} pose={{ z: 0.72, ry: 180, ...PLAY, armR: { f: 84, e: -46, o: 12 } }} holdR={<Phone p={[0, -0.04, 0.05]} r={[0, Math.PI, 0]} s={0.9} screen="rec" f={g} />} />
        <Person look={CHAIR_EXTRA(9)} pose={{ x: 2 * SLOT_STEP, z: 0.72, ry: 180, ...PLAY }} />
      </SlotFloor>
    ),
    over: <Cctv cam="CAM 4" />,
  }),
  // ---------- Russia ----------
  S8: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.6, 1.6, 3.6], [0, 1.55, 0], 34), cm([0.6, 1.6, 3.4], [0, 1.55, 0], 34), t, len),
    world: (
      <Void c="#1A242C">
        <LedBoard p={[0, 2.5, -1.4]} text="MOSCOW" w={1.6} c={AMBER} />
        <Person look={CAST.bliev} pose={{ x: 0.1, ...walker(t, -0.9, -0.012), ry: 160, armL: { f: 10, e: -14, o: 6 } }} holdL={<Bag />} />
        <pointLight position={[0.4, 2.6, 2.2]} intensity={7} distance={7} color="#E8F2FF" />
      </Void>
    ),
  }),
  S9: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0, 2.6, 5.2], [0, 1.3, -2.4], 36), cm([0, 2.55, 4.95], [0, 1.3, -2.4], 36), t, len),
    world: <SlotFloor f={g} hero={false} rows={3} stools dark={ramp(g, wd("09", "banned"), lineEnd("09") + 10)} />,
    over: <Chip x={500} y={300} at={wd("09", "twenty")} text="2009" kind="pop" size={92} color={AMBER} />,
  }),
  S10: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([1.4, 2.4, 6.0], [0, 1.1, -2], 36), cm([1.3, 2.35, 5.7], [0, 1.1, -2], 36), t, len),
    world: (
      <Warehouse f={g} t={t} sign="SALE" workers>
        {Array.from({ length: 12 }, (_, i) => <SlotMachine key={i} p={[(i % 4 - 1.5) * 0.9, 0, -1.2 - Math.floor(i / 4) * 1.1]} f={0} land={[(i * 2) % 6, (i + 1) % 6, (i + 4) % 6]} live={false} lit={0} c={["#2C2236", "#22303A", "#3A2430"][i % 3]} />)}
        <SlotMachine p={[0.9 + t * 0.012, 0, 0.6]} ry={-90} f={0} live={false} lit={0} />
        <Person look={CHAIR_EXTRA(12)} pose={{ x: 0.3 + t * 0.012, z: 0.6, ry: 90, lean: 12, ...walk(t * 0.3, 16), armL: { f: 70, e: -30, o: 6 }, armR: { f: 70, e: -30, o: 6 } }} />
      </Warehouse>
    ),
  }),
  S11: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.2, 1.7, 3.2], [0, 1.25, -1.2], 34), cm([0.2, 1.7, 3.0], [0, 1.25, -1.2], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <SlotMachine p={[0, 0, -1.55]} f={g} open={0.7} />
        <Person look={CHAIR_EXTRA(21)} pose={{ x: -0.55, z: -1.05, ry: 35, armL: REST, armR: { f: 40, e: -60, o: 8 }, lookX: 0.5 }} />
        <Person look={CHAIR_EXTRA(22)} pose={{ x: 0.55, z: -1.0, ry: -40, armL: { f: 30, e: -80, o: 8 }, armR: REST, lookX: -0.5, lookY: -0.2 }} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("11", "st")} text="ST. PETERSBURG" kind="slide" size={70} color={TEAL} />,
  }),
  S12: (t, len, g) => {
    const back = ramp(t, 10, 24);
    return {
      light: "stage",
      cam: cm([0.62, 1.32, 1.45], [0.1, 0.98, 0.2], 32),
      world: (
        <SlotFloor f={g} rows={1} stools={false}>
          <SlotMachine f={g} />
          <PressHand p={[BTN[0] + back * 0.12, BTN[1] + 0.03 + back * 0.08, BTN[2] + 0.02 + back * 0.05]} r={[0.28, 0, -1.42]} sleeve="#34343E" skin={CAST.alex.skin} />
          <pointLight position={[0.4, 1.4, 0.9]} intensity={1.2} distance={2} color="#FFE6C0" />
        </SlotFloor>
      ),
    };
  },
  S13: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.1, 1.45, 2.5], [0, 1.2, -0.8], 34), cm([0.1, 1.45, 2.35], [0, 1.2, -0.8], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <SlotMachine p={[-0.95, 0, -1.3]} ry={25} f={g} open={1} lit={0.6} />
        <Crt p={[0.42, DESK_Y, 0.02]} r={[0, -2.6, 0]} seed={3} f={g} />
        <Person look={CHAIR_EXTRA(22)} pose={OfficeSeat({ ...typing(g), lookX: 0.5, lookY: -0.3, yaw: 18 })} />
      </Office>
    ),
  }),
  // ---------- the formula ----------
  S14: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.85, 3.7], [0, 1.85, -0.3], 34), cm([0, 1.85, 3.5], [0, 1.85, -0.3], 34), t, len),
    world: (
      <Void>
        <SlotMachine p={[0, 0, -0.4]} f={g} spin={(t % 30) / 30} />
        <NumTape p={[0, 2.55, -0.3]} f={g} mode="random" />
        <pointLight position={[0, 2.4, 2]} intensity={6} distance={6} color="#FFE6C0" />
      </Void>
    ),
  }),
  S15: (t, len, g) => {
    const freeze = wd("15", "random") - 4;
    return {
      light: "stage",
      cam: cm([0, 2.15, 3.0], [0, 2.15, -0.3], 34),
      world: (
        <Void>
          <SlotMachine p={[0, 0, -0.4]} f={g} />
          <NumTape p={[0, 2.55, -0.3]} f={g} mode={g < freeze ? "random" : "loop"} lit={g >= freeze + 6 ? 1 : 0} />
          <pointLight position={[0, 2.4, 2]} intensity={6} distance={6} color="#FFE6C0" />
        </Void>
      ),
    };
  },
  S16: (t, len, g) => {
    const tick = Math.floor(t / 8);
    return {
      light: "stage",
      cam: glide(cm([0, 2.3, 3.1], [0, 2.4, -0.3], 34), cm([0, 2.3, 2.95], [0, 2.4, -0.3], 34), t, len),
      world: (
        <Void>
          <SlotMachine p={[0, 0, -0.6]} f={g} />
          <Clock p={[0, 3.05, -0.35]} h={10 + tick / 60} r={0.2} />
          <NumTape p={[0, 2.5, -0.3]} w={0.95} f={tick * 4} mode="walk" cur={tick % 6} />
          <pointLight position={[0, 2.4, 2]} intensity={6} distance={6} color="#FFE6C0" />
        </Void>
      ),
    };
  },
  S17: (t, len, g) => {
    const stop = wd("17", "place") - 2;
    const cur = interpolate(g, [at("S17"), stop], [0, 4], { ...CLAMP, easing: (x) => 1 - (1 - x) ** 3 });
    return {
      light: "stage",
      cam: cm([0, 2.1, 3.1], [0, 1.95, -0.3], 34),
      world: (
        <Void>
          <NumTape p={[0, 2.25, -0.3]} f={g} mode="walk" cur={cur} />
          <Person look={CAST.alex} pose={{ x: 0.1, z: 0.9, ry: 180, armL: REST, armR: { f: 70, e: -20, o: 4 } }} />
          <pointLight position={[0, 2.4, 2]} intensity={5} distance={6} color="#FFE6C0" />
        </Void>
      ),
    };
  },
  // ---------- the buzz ----------
  S18: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.8, 1.72, 2.35], [-0.08, 1.3, 0.2], 34), cm([0.78, 1.72, 2.2], [-0.08, 1.3, 0.2], 34), t, len),
    world: (
      <SlotFloor f={g}>
        <SlotMachine f={g} spin={(t % 40) / 40} />
        <Person look={CAST.bliev} pose={{ z: 0.72, ry: 180, ...PLAY, armR: { f: 84, e: -42, o: 14 } }} holdR={<Phone p={[0, -0.04, 0.05]} r={[0, Math.PI, 0]} s={0.9} screen="rec" f={g} />} />
      </SlotFloor>
    ),
    over: <Chip x={500} y={300} at={wd("18", "two")} to={24} pre="~" post=" SPINS" kind="count" dur={30} size={78} color={AMBER} />,
  }),
  S19: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.05, 1.42, 2.5], [0, 1.26, -0.6], 34), cm([0.05, 1.42, 2.35], [0, 1.26, -0.6], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Monitor p={[0.45, DESK_Y + 0.42, -0.05]} ry={-0.5}>
          <Panel map={reelPic()} w={0.58} h={0.36} p={[0, 0, 0.001]} glow={0.95} />
        </Monitor>
        <Person look={CHAIR_EXTRA(21)} pose={OfficeSeat({ lookX: 0.6, lookY: -0.1, yaw: 20, lean: ramp(t, 6, 20) * 8 })} />
      </Office>
    ),
  }),
  S20: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.1, 1.6, 2.9], [0, 1.55, -1.2], 34), cm([0.1, 1.6, 2.75], [0, 1.55, -1.2], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <NumTape p={[0, 2.1, -2.25]} w={1.5} f={g} mode={t < 16 ? "random" : "loop"} lit={t >= 20 ? 1 : 0} />
        <Person look={CHAIR_EXTRA(21)} pose={OfficeSeat({ ...typing(g), lookY: 0.3, pitch: -4 })} />
      </Office>
    ),
  }),
  S21: (t, len, g) => {
    const buzz = wd("20", "buzzes");
    const tap = buzz + 8;
    return {
      light: "stage",
      cam: glide(cm([0.1, 1.28, 1.7], [-0.08, 1.1, 0.3], 32), cm([0.1, 1.28, 1.6], [-0.08, 1.1, 0.3], 32), t, len),
      world: <HeroClose f={g} k={ramp(g, at("S21"), buzz)} buzz={ramp(g, buzz - 2, buzz + 2) - ramp(g, buzz + 16, buzz + 22)} hover={0.06 - ramp(g, buzz, tap) * 0.06} press={ramp(g, tap - 2, tap) - ramp(g, tap + 6, tap + 10)} spin={ramp(g, tap, tap + 40)} />,
      over: <Chip x={500} y={300} at={wd("20", "quarter")} text="0.25 s" kind="pop" size={86} color={AMBER} />,
    };
  },
  S22: (t, len, g) => ({
    light: "stage",
    cam: glide(FACE_CAM, FACE_CAM2, t, len),
    world: (
      <FaceSet f={g}>
        <Person look={CAST.bliev} pose={{ z: -0.72, ...PLAY, armL: { f: 70, e: -60, o: 10 }, lookX: -0.5, lookY: -0.3, yaw: -12, pitch: 6, blink: 0 }} holdL={<Phone p={[0, -0.04, 0.05]} r={[0.2, 0.6, 0]} s={0.9} screen="app" k={ramp(t, 0, len)} f={g} />} />
      </FaceSet>
    ),
  }),
  S23: (t, len, g) => {
    const buzz = at("S23") + 6;
    const tap = buzz + 8;
    return {
      light: "stage",
      cam: LOOP_CAM,
      post: { bloom: 0.08 },
      world: <HeroClose f={g} k={ramp(g, at("S23") - 10, buzz)} buzz={ramp(g, buzz - 2, buzz + 2) - ramp(g, buzz + 14, buzz + 20)} hover={0.06 - ramp(g, buzz, tap) * 0.06} press={ramp(g, tap - 2, tap) - ramp(g, tap + 6, tap + 10)} spin={ramp(g, tap, tap + 22)} win={ramp(g, tap + 22, tap + 26)} land={g > tap ? WIN : LAND} />,
    };
  },
  // ---------- the money ----------
  S24: (t, len, g) => {
    const up = ramp(g, wd("23", "nobody") - 6, wd("23", "nobody") + 10);
    return {
      light: "stage",
      cam: glide(cm([1.6, 1.75, 3.4], [0.2, 1.15, 0.5], 36), cm([1.55, 1.75, 3.2], [0.2, 1.15, 0.5], 36), t, len),
      world: (
        <SlotFloor f={g}>
          <SlotMachine f={g} win={1 - up} />
          <Person look={CAST.bliev} pose={{ x: up * 0.45, z: 0.72 + up * 0.25, ry: 180 - up * 70, ...(up > 0 ? { ...walk(t * 0.3, 18 * up), y: -0.24 * (1 - up) } : PLAY), armL: REST, armR: REST }} holdL={<Bag />} />
        </SlotFloor>
      ),
      over: <Chip x={500} y={300} at={wd("23", "thousand")} text="< $1,000" kind="pop" size={84} color={TEAL} />,
    };
  },
  S25: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.34, 2.5], [0.02, 1.16, -0.75], 32), cm([0.42, 1.34, 2.35], [0.02, 1.16, -0.75], 32), t, len),
    world: (
      <Interview f={g}>
        <Person look={CAST.consultant} pose={{ ...OfficeSeat({ z: -0.78 }), armL: { f: 30, e: -70, o: 10 }, armR: act(t, [[0, { armR: { f: 30, e: -70, o: 10 } }], [20, { armR: { f: 60, e: -60, o: 16 } }], [44, { armR: { f: 40, e: -70, o: 12 } }]]).armR, brow: 0.4, mouth: talking(g, lineEnd("24")) }} />
      </Interview>
    ),
    over: <Chip x={500} y={300} at={wd("24", "ten")} text="$10,000 / DAY" kind="pop" size={74} color={AMBER} />,
  }),
  S26: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([3.4, 2.2, 4.3], [0.4, 1.1, 0], 36), cm([3.25, 2.15, 4.1], [0.4, 1.1, 0], 36), t, len),
    world: (
      <SlotFloor f={g} hero={false}>
        {[-1, 0, 1, 2].map((i) => (
          <Person key={i} look={i === 0 ? CAST.bliev : CHAIR_EXTRA(30 + i)} pose={{ x: i * SLOT_STEP, z: 0.72, ry: 180, ...PLAY, armR: { f: 82, e: -46, o: 12 } }} holdR={<Phone p={[0, -0.04, 0.05]} r={[0, Math.PI, 0]} s={0.9} screen="rec" f={g + i * 5} />} />
        ))}
      </SlotFloor>
    ),
  }),
  S27: (t, len, g) => {
    const k = ramp(g, at("S27"), lineEnd("26"));
    return {
      light: "warm",
      cam: glide(cm([0.05, 1.5, 2.7], [0, 1.2, -0.4], 34), cm([0.05, 1.5, 2.55], [0, 1.2, -0.4], 34), t, len),
      world: (
        <Office f={g} night plate="">
          {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <group key={x} position={[x, DESK_Y, 0.1]} scale={0.26}><CoinTower h={0.1 + k * (1.0 + i * 0.2)} /></group>)}
          <Person look={CAST.bliev} pose={OfficeSeat({ smile: 0.3, lookY: -0.4, pitch: 6 })} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("26", "quarter")} to={250000} pre="$" post=" / WEEK" kind="count" dur={24} size={72} color={AMBER} />,
    };
  },
  S28: (t, len, g) => {
    const go = ramp(g, wd("27", "went") - 4, lineEnd("27"));
    return {
      light: "warm",
      cam: cm([0.05, 1.9, 1.9], [0, DESK_Y, -0.2], 34),
      world: (
        <Office f={g} night plate="">
          {Array.from({ length: 10 }, (_, i) => <group key={i} position={[-0.36 + (i % 5) * 0.18, DESK_Y, -0.05 + Math.floor(i / 5) * 0.2 - (i > 0 ? go * 1.4 : 0)]} scale={0.22}><CoinTower h={0.6} /></group>)}
          <Person look={CAST.bliev} pose={OfficeSeat({ worry: go * 0.4, lookY: -0.6, pitch: 8 })} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("27", "ninety")} text="90%" kind="pop" size={96} color={AMBER} />,
    };
  },
  // ---------- caught ----------
  S29: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.3, 1.6, 3.6], [0, 1.55, 0], 34), cm([0.3, 1.6, 3.4], [0, 1.55, 0], 34), t, len),
    world: (
      <Void c="#1A242C">
        <LedBoard p={[-0.3, 2.05, -2.2]} text="ARRIVALS" w={1.3} c={TEAL} />
        <Person look={CAST.bliev} pose={{ x: -0.1, ...walker(t, -1.1, 0.016), armL: { f: 10, e: -14, o: 6 } }} holdL={<Bag />} />
        <pointLight position={[0.4, 2.6, 2.2]} intensity={7} distance={7} color="#E8F2FF" />
      </Void>
    ),
    over: <Chip x={500} y={300} at={wd("28", "december")} text="DEC 2014" kind="pop" size={80} color={AMBER} />,
  }),
  S30: (t, len, g) => {
    const reach = ramp(g, wd("29", "arrested") - 10, wd("29", "arrested") + 4);
    return {
      light: "stage",
      cam: glide(cm([3.4, 2.2, 4.6], [0.5, 1.1, 0.6], 36), cm([3.25, 2.15, 4.4], [0.5, 1.1, 0.6], 36), t, len),
      world: (
        <SlotFloor f={g} hero={false}>
          {[-1, 0, 1, 2].map((i) => (
            <Person key={i} look={i === 0 ? CAST.bliev : CHAIR_EXTRA(30 + i)} pose={{ x: i * SLOT_STEP, z: 0.72, ry: 180 - reach * 40, ...PLAY, armL: REST, armR: REST, lookX: reach * 0.6 }} />
          ))}
          <Person look={CAST.agent} pose={{ x: 0.3, z: 2.4 - ramp(t, 0, 24) * 1.0, ry: 190, armL: REST, armR: { f: 30 + reach * 50, e: -20, o: 4 } }} />
          <Person look={CAST.agent2} pose={{ x: 1.5, z: 2.5 - ramp(t, 4, 28) * 1.0, ry: 175, armL: REST, armR: REST }} />
        </SlotFloor>
      ),
    };
  },
  S31: (t, len, g) => {
    const shut = ramp(g, wd("30", "got") - 2, wd("30", "years") + 6);
    return {
      light: "cool",
      cam: cm([0, 1.56, 3.4], [0, 1.45, 0], 34),
      world: (
        <Void c="#14181E">
          {[-0.6, 0, 0.6].map((x, i) => <Person key={x} look={{ ...(i === 1 ? CAST.bliev : CHAIR_EXTRA(31 + i)), top: "#B8742C", pants: "#B8742C", shirt: undefined, tie: undefined }} pose={{ x, z: -0.5, armL: REST, armR: REST, lookY: -0.3, pitch: 5, heavy: 0.4 }} />)}
          {Array.from({ length: 12 }, (_, i) => <Box key={i} w={0.03} h={2.6} d={0.03} c="#8A9096" p={[-2.1 + i * 0.13 + shut * 1.3, 0, 0.3]} o={{ metal: 0.6, rough: 0.4 }} />)}
          <pointLight position={[0.3, 2.6, 1.6]} intensity={7} distance={6} color="#E8F2FF" />
        </Void>
      ),
      over: <Chip x={500} y={300} at={wd("30", "two")} text="2 YEARS" kind="pop" size={80} color="#FF7A6A" />,
    };
  },
  S32: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.3, 1.55, 2.4], [0, 1.35, -0.8], 34), cm([0.3, 1.55, 2.25], [0, 1.35, -0.8], 34), t, len),
    world: (
      <Void c="#101418">
        {Array.from({ length: 6 }, (_, i) => (
          <Monitor key={i} p={[((i % 3) - 1) * 0.66, 1.05 + Math.floor(i / 3) * 0.48, -0.9]} w={0.6}>
            {i === 4 ? <group position={[0, 0, 0.001]}><NumTape p={[0, 0, 0]} w={0.56} f={g + i * 3} mode="loop" lit={1} /></group> : <Panel map={reelPic()} w={0.56} h={0.35} p={[0, 0, 0.001]} glow={0.7} />}
          </Monitor>
        ))}
        <Person look={CAST.alex} pose={{ z: 0.15, ry: 180, ...SIT, y: -0.44, armL: TYPE, armR: TYPE2, pitch: -6 }} />
        <pointLight position={[0, 1.6, -0.3]} intensity={2.2} distance={3} color={TEAL} />
      </Void>
    ),
    over: <Chip x={500} y={300} at={wd("31", "alex")} text="ALEX" kind="pop" size={92} color={TEAL} />,
  }),
  // ---------- the twist ----------
  S33: (t, len, g) => {
    const k = ramp(t, 0, len);
    return {
      light: "stage",
      cam: glide(cm([3.0, 2.3, 4.4], [0.6, 1.0, 0.3], 36), cm([2.85, 2.25, 4.2], [0.6, 1.0, 0.3], 36), t, len),
      world: (
        <SlotFloor f={g} stools={false}>
          <SlotMachine p={[k * 1.2, 0, k * 0.9]} ry={-k * 40} f={g} lit={0} live={false} />
          <Person look={CHAIR_EXTRA(40)} pose={{ x: -0.5 + k * 1.2, z: 0.4 + k * 0.9, ry: 90, lean: 14, ...walk(t * 0.28, 14), armL: { f: 70, e: -30, o: 6 }, armR: { f: 70, e: -30, o: 6 } }} />
          <Person look={CHAIR_EXTRA(41)} pose={{ x: 0.55 + k * 1.2, z: 0.5 + k * 0.9, ry: 270, lean: 14, ...walk(t * 0.28 + 3, 14), armL: { f: 70, e: -30, o: 6 }, armR: { f: 70, e: -30, o: 6 } }} />
        </SlotFloor>
      ),
    };
  },
  S34: (t, len, g) => {
    const on = lineEnd("33") + 6;
    return {
      light: "stage",
      cam: glide(cm([1.9, 1.8, 3.4], [0.3, 1.2, 0.2], 34), cm([1.8, 1.8, 3.2], [0.3, 1.2, 0.2], 34), t, len),
      world: (
        <SlotFloor f={g} stools>
          <SlotMachine f={g} lit={ramp(g, on, on + 3)} />
          <Person look={CHAIR_EXTRA(40)} pose={{ x: 1.0, z: 0.9, ry: 230, armL: REST, armR: REST, shrug: ramp(g, on, on + 10) * 0.6 }} />
        </SlotFloor>
      ),
    };
  },
  S35: (t, len, g) => {
    const tilt = ramp(g, wd("34", "keeping"), wd("34", "replacing"));
    return {
      light: "stage",
      cam: glide(cm([0.05, 1.45, 2.5], [0.05, 1.08, 0], 38), cm([0.05, 1.45, 2.35], [0.05, 1.08, 0], 38), t, len),
      world: (
        <Void>
          <Desk p={[0, 0, 0]} w={1.4} d={0.7} c="#3A2A20" />
          <Balance p={[0, DESK_Y, 0.05]} tilt={-tilt} left={<group scale={0.15}><SlotMachine f={g} live={false} /></group>} right={<group scale={0.26}><CoinTower h={0.3} /></group>} />
          <Person look={CAST.pitboss} pose={{ x: 0.62, z: -0.7, armL: REST, armR: REST, lookY: -0.5, pitch: 8, shrug: ramp(g, wd("34", "cheaper"), wd("34", "cheaper") + 12) * 0.7 }} />
          <pointLight position={[0, 2.4, 1.8]} intensity={6} distance={6} color="#FFE6C0" />
        </Void>
      ),
      over: (
        <>
          <Chip x={300} y={1000} at={wd("34", "replacing")} text="REPLACE" kind="pop" size={58} color="#FF7A6A" />
          <Chip x={720} y={1000} at={wd("34", "keeping")} text="KEEP" kind="pop" size={58} color={TEAL} />
        </>
      ),
    };
  },
  S36: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.35, 1.45, 3.0], [0, 1.35, -0.8], 34), cm([0.35, 1.45, 2.85], [0, 1.35, -0.8], 34), t, len),
    world: (
      <Void c="#101418">
        <Monitor p={[0, 1.55, -0.95]} w={0.8}>
          <Panel map={signTex("THE FIX: FOR SALE", "#0C1A1E", "#F3EFE6", 1024, 620, 96)} w={0.76} h={0.46} p={[0, 0, 0.001]} glow={0.95} />
        </Monitor>
        <Person look={CAST.alex} pose={{ z: 0.15, ry: 180, ...SIT, y: -0.44, ...typing(g), pitch: -6 }} />
        <pointLight position={[0, 1.6, -0.3]} intensity={2.2} distance={3} color={TEAL} />
      </Void>
    ),
  }),
  S37: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.2, 1.7, 2.6], [0, 1.8, -0.9], 34), cm([0.2, 1.7, 2.45], [0, 1.8, -0.9], 34), t, len),
    world: (
      <Void c="#101418">
        <LedBoard p={[0, 2.3, -1.0]} text="$##,###,###" w={1.1} c={AMBER} />
        <Person look={CAST.alex} pose={{ z: 0.1, ry: 180, armL: REST, armR: REST, pitch: -10 }} />
        <pointLight position={[0, 1.8, -0.4]} intensity={2.4} distance={3.2} color={AMBER} />
      </Void>
    ),
    over: <Chip x={500} y={300} at={wd("36", "eight")} text="8 FIGURES" kind="pop" size={82} color={AMBER} />,
  }),
  S38: (t, len, g) => {
    const hit = lineEnd("37") + 4;
    const k = interpolate(g, [hit - 9, hit - 1], [0, 1], CLAMP);
    return {
      light: "warm",
      cam: cm([0, DESK_Y + 2.0, 0.32], [0, DESK_Y, 0.02], 34),
      world: (
        <Office f={g} night plate="">
          <Box w={0.5} h={0.004} d={0.62} c="#F3EAD6" p={[0, DESK_Y + 0.004, 0.02]} />
          {Array.from({ length: 6 }, (_, i) => <Box key={i} w={0.34 - (i % 2) * 0.08} h={0.002} d={0.014} c="#8A8070" p={[-0.04, DESK_Y + 0.007, -0.22 + i * 0.05]} shadow={false} />)}
          <Stamp p={[0, DESK_Y + 0.012, 0.14]} k={k} word="NO" printed={g >= hit - 1} />
          <pointLight position={[0.2, 2.0, 0.6]} intensity={1.4} distance={3} color="#FFE6C0" />
        </Office>
      ),
    };
  },
  // ---------- the question ----------
  S39: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0, 2.2, 3.2], [0, 1.3, -3], 38), cm([0, 3.4, 6.6], [0, 1.2, -3], 38), t, len),
    world: <SlotFloor f={g} n={13} rows={5} hero={false} stools />,
    over: <Chip x={500} y={300} at={wd("38", "hundred")} text="100,000+" kind="pop" size={96} color={AMBER} />,
  }),
  S40: (t, len, g) => ({
    light: "stage",
    cam: glide(FACE_CAM, FACE_CAM2, t, len),
    world: (
      <FaceSet f={g}>
        <Person look={CAST.bliev} pose={{ z: -0.72, ...PLAY, armR: { f: 62, e: -40, o: 6 }, lookX: 0, lookY: -0.4, pitch: 8, blink: 0 }} />
      </FaceSet>
    ),
  }),
  S41: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.3, 1.32, 2.2], [-0.02, 1.08, 0.25], 34), LOOP_CAM, t, len),
    world: <HeroClose f={g} k={0} />,
  }),
};

const ROOMS = [
  ["S1", "S7", "sfx/synth/room-casino.wav"],
  ["S10", "S10", "sfx/synth/room-warehouse.wav"],
  ["S11", "S13", "sfx/synth/room-office.wav"],
  ["S18", "S18", "sfx/synth/room-casino.wav"],
  ["S19", "S20", "sfx/synth/room-office.wav"],
  ["S21", "S24", "sfx/synth/room-casino.wav"],
  ["S25", "S25", "sfx/synth/room-interview.wav"],
  ["S26", "S26", "sfx/synth/room-casino.wav"],
  ["S30", "S30", "sfx/synth/room-casino.wav"],
  ["S33", "S34", "sfx/synth/room-casino.wav"],
  ["S39", "S41", "sfx/synth/room-casino.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence after "nobody had touched them", "The phone does", "No." and "The company said no", low under the last line
  const duck = (g: number) =>
    interpolate(
      g,
      [lineEnd("07") - 4, lineEnd("07") + 2, lineStart("08") + 2, lineStart("08") + 16, lineEnd("22") - 4, lineEnd("22") + 2, lineStart("23") + 4, lineStart("23") + 16, lineEnd("32"), lineEnd("33") + 2, lineStart("34") + 6, lineStart("34") + 20, lineEnd("37") - 4, lineEnd("37") + 2, lineStart("38") + 4, lineStart("38") + 18, lineStart("39"), lineStart("39") + 12],
      [1, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0.35],
      CLAMP,
    );
  const buzz1 = wd("01", "moment");
  const buzz2 = wd("20", "buzzes");
  const buzz3 = at("S23") + 6;
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="slot-hack" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      <Sfx file="sfx/synth/phone-buzz.wav" at={buzz1 - 5} level={-26} align="onset" />
      <Sfx file="sfx/click/digital-click-357350.mp3" at={wd("01", "spin")} level={-28} align="onset" />
      <Sfx file="sfx/click/digital-click-357350.mp3" at={wd("04", "jabbed")} level={-27} align="onset" />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("07") + 1} level={-26} align="onset" seconds={1.2} />
      <Sfx file="sfx/synth/shutter-down.wav" at={wd("09", "banned")} level={-24} seconds={1.6} />
      <Sfx file="sfx/synth/phone-buzz.wav" at={buzz2 - 2} level={-19} align="onset" />
      <Sfx file="sfx/click/digital-click-357350.mp3" at={buzz2 + 8} level={-21} align="onset" />
      <Sfx file="sfx/synth/phone-buzz.wav" at={buzz3 - 2} level={-25} align="onset" />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("22") + 4} level={-25} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={wd("30", "years") + 6} level={-27} align="onset" seconds={1} />
      <Sfx file="sfx/click/mouse-click-351398.mp3" at={lineEnd("33") + 6} level={-24} align="onset" />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("37") + 3} level={-24} align="onset" />
      <Sfx file="sfx/synth/phone-buzz.wav" at={lineEnd("39") + 2} level={-30} align="onset" />
    </Episode>
  );
};

/** 9:16 thumbnail: his face lit by the machine, the phone in his hand; the money and the trick. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" post={{ bloom: 0.2 }} cam={cm([-1.45, 1.48, 0.62], [-0.08, 1.6, -0.72], 34)} over={<ThumbText top="$250,000/WEEK" bottom="THE PHONE KNEW" size={100} y={250} />}>
    <FaceSet f={0} win={1}>
      <Person look={CAST.bliev} pose={{ z: -0.72, ...PLAY, armR: { f: 34, e: -100, o: 34 }, lookX: -0.7, lookY: -0.45, yaw: -14, pitch: 6, smirk: 0.5, browL: 0.4 }} holdR={<Phone p={[0, 0.02, 0.06]} r={[-0.9, -0.7, 0]} s={1.4} screen="go" f={3} />} />
    </FaceSet>
  </Shot3D>
);
