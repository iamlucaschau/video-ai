/**
 * NEON ODDS ep07 · ron-harris. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-ron-harris-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * The hero slot machine stands at the origin facing +z (SlotFloor); the agent tests it from its right side with a laptop on a
 * cart. Code on screens, coin order and keno numbers are illustrations, never the real program or sequence.
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, alive, Box, Chip, glide, Person, type Pose, Shot3D, SIT, talk, walk } from "../../../Style Library/N-low-poly/lowpoly";
import { Book, Coin, Crt, Desk, Folder, KenoBoard, Laptop, LedBoard, Phone, SLOT, SlotMachine } from "../../../Style Library/N-low-poly/props";
import { CashCage, Casino, CAST, Chamber, extra, Office, SlotFloor, Void } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/ron-harris.timing.json";
import rawWords from "../../../src/voiceover/ron-harris.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/ron-harris.mp3";

const AMBER = "#FFB347";
const TEAL = "#62D2DC";
const RED = "#FF6A5A";
const DESK_Y = 0.77;
const REST = { o: 8 };
const talking = (g: number, end: number) => talk(g, g < end - 3);
const OfficeSeat = (p: Pose = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...p });
const TYPE = { f: 50, e: -50, o: 8 };
const TYPE2 = { f: 56, e: -44, o: 8 };
const typing = (g: number) => (Math.floor(g / 7) % 2 ? { armL: TYPE, armR: TYPE2 } : { armL: TYPE2, armR: TYPE });
const AGENT = extra(81, { top: "#3A4A5E", shirt: "#E8E4DA", tie: "#2E6E7A", hairStyle: "short" });
const MATE = CAST.harrisMate;
/** the eight numbers on the winning ticket (made up) */
const PICKS = [7, 18, 23, 34, 41, 56, 62, 75];
/** frames into S8 when each coin goes in: done before "jackpot" is spoken */
const COINS = [0, 5, 10];

// ---------------- the test: agent, cart, laptop, cable ----------------
const CART: [number, number, number] = [0.55, 0, 1.25];
/** the tester stands in front of the next machine, facing the camera, the laptop on a cart before him, a cable to the hero machine */
const TestRig: React.FC<{ f: number; screen?: "code" | "progress" | "off"; k?: number; who?: typeof AGENT; pose?: Pose }> = ({ f, screen = "progress", k = 0, who = AGENT, pose = {} }) => (
  <>
    <Box w={0.46} h={0.7} d={0.36} c="#3A3E46" p={CART} o={{ metal: 0.4, rough: 0.5 }} />
    <Laptop p={[CART[0], 0.7, CART[2]]} ry={Math.PI} f={f} screen={screen} k={k} />
    <Box w={0.014} h={0.014} d={0.95} c="#141216" p={[0.32, 0.72, 0.78]} shadow={false} />
    <Person look={who} pose={{ x: CART[0], z: 0.82, armL: { f: 50, e: -45, o: 8 }, armR: { f: 52, e: -42, o: 8 }, lookY: -0.45, pitch: 8, ...alive(f, 3), ...pose }} />
  </>
);
const LOOP_CAM = cm([0.3, 1.5, 3.9], [0.32, 1.05, 0.5], 38);
const HookSet: React.FC<{ g: number }> = ({ g }) => (
  <SlotFloor f={g} sign="CASINO" stools={false}>
    <SlotMachine f={g} lit={0.7 + 0.3 * (Math.floor(g / 5) % 2)} />
    <TestRig f={g} screen="progress" k={(g % 90) / 90} who={CAST.harris} />
    <pointLight position={[1.0, 1.9, 1.3]} intensity={2.4} distance={3.2} color="#FFE2BE" />
  </SlotFloor>
);

const S: Record<string, ShotFn> = {
  // ---------- hook ----------
  S1: (t, len, g) => ({
    light: "stage",
    cam: glide(LOOP_CAM, cm([0.3, 1.5, 3.76], [0.32, 1.05, 0.5], 38), t, len),
    world: <HookSet g={g} />,
  }),
  // ---------- the inspector ----------
  S2: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.4, 2.5], [0.02, 1.2, -0.75], 32), cm([0.42, 1.4, 2.35], [0.02, 1.2, -0.75], 32), t, len),
    world: (
      <Office f={g} night plate="GAMING CONTROL BOARD">
        <Crt p={[0.42, DESK_Y, 0.02]} r={[0, -2.6, 0]} seed={2} f={g} />
        <Person look={CAST.harris} pose={OfficeSeat({ ...typing(g), lookX: 0.5, lookY: -0.3, yaw: 18 })} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("02", "early")} text="1990s" kind="pop" size={92} color={AMBER} />,
  }),
  S3: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([-0.45, 1.36, 0.6], [0.05, 1.22, -0.75], 30), cm([-0.42, 1.36, 0.52], [0.05, 1.22, -0.75], 30), t, len),
    world: (
      <Office f={g} night plate="">
        <Laptop p={[0.0, DESK_Y, -0.25]} f={g} screen="code" s={1.4} />
        <Person look={CAST.harris} pose={OfficeSeat({ lookY: -0.5, pitch: 10, brow: 0.3, armL: { f: 50, e: -60, o: 10 }, armR: { f: 50, e: -60, o: 10 } })} />
      </Office>
    ),
  }),
  S4: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.5, 1.6, 3.9], [0.32, 1.05, 0.55], 36), cm([0.48, 1.6, 3.75], [0.32, 1.05, 0.55], 36), t, len),
    world: (
      <SlotFloor f={g} stools={false}>
        <SlotMachine f={g} />
        <TestRig f={g} screen="off" pose={act(t, [[0, { armR: { f: 20, e: -20, o: 8 }, lookY: 0 }], [16, { armR: { f: 52, e: -42, o: 8 }, lookY: -0.45 }]])} />
      </SlotFloor>
    ),
  }),
  S5: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.34, 2.5], [0.02, 1.15, -0.75], 32), cm([0.42, 1.34, 2.35], [0.02, 1.15, -0.75], 32), t, len),
    world: (
      <Office f={g} night plate="">
        <Laptop p={[0.0, DESK_Y, -0.35]} ry={Math.PI} f={g} screen="code" />
        <Person look={CAST.harris} pose={OfficeSeat({ ...typing(g), lookY: -0.4, pitch: 6, smirk: ramp(t, 20, 40) * 0.3 })} />
      </Office>
    ),
  }),
  S6: (t, len, g) => ({
    light: "stage",
    cam: cm([0, DESK_Y + 0.17, 0.3], [0, DESK_Y + 0.15, -0.12], 34),
    world: (
      <Void c="#101418">
        <Desk p={[0, 0, 0]} w={1.2} d={0.7} c="#3A2A20" />
        <Laptop p={[0, DESK_Y, -0.05]} f={g} screen="code" hidden={ramp(g, wd("06", "hid") - 4, wd("06", "inside"))} s={1.0} />
        <pointLight position={[0.2, 1.5, 0.6]} intensity={1.6} distance={2} color="#E8F2FF" />
      </Void>
    ),
  }),
  S7: (t, len, g) => {
    const done = wd("07", "changed");
    return {
      light: "stage",
      cam: glide(cm([0.45, 1.6, 4.0], [0.32, 1.1, 0.55], 36), cm([0.44, 1.6, 3.86], [0.32, 1.1, 0.55], 36), t, len),
      world: (
        <SlotFloor f={g} rows={2} stools={false}>
          <SlotMachine f={g} lit={g >= done && g < done + 4 ? 0.2 : 1} />
          <TestRig f={g} screen="progress" k={ramp(g, at("S7"), done)} />
        </SlotFloor>
      ),
    };
  },
  S8: (t, len, g) => {
    const coins = COINS;
    const win = wd("08", "jackpot") + 2;
    return {
      light: "stage",
      cam: cm([0.25, 1.2, 1.1], [0.15, 0.95, 0.2], 32),
      world: (
        <SlotFloor f={g} rows={1} stools={false}>
          <SlotMachine f={g} win={ramp(g, win, win + 4)} spin={ramp(g, win - 30, win)} />
          {coins.map((c0, i) => {
            const k = ramp(t, c0, c0 + 8);
            return k < 1 ? <Coin key={i} p={[SLOT.button[0] - 0.04, SLOT.deckY + 0.25 - k * 0.12, SLOT.front + 0.12 - k * 0.1]} spin={Math.PI / 2} s={0.7} /> : null;
          })}
          <pointLight position={[0.4, 1.4, 0.9]} intensity={1.2} distance={2} color="#FFE6C0" />
        </SlotFloor>
      ),
    };
  },
  S9: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.2, 1.45, 2.5], [0, 1.15, -0.5], 34), cm([0.2, 1.45, 2.38], [0, 1.15, -0.5], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#3A2A20" />
        <Person look={CAST.harris} pose={OfficeSeat({ z: -0.7, lookX: 0.4, smirk: 0.4, browL: 0.3, mouth: talking(g, lineEnd("09")) })} />
        <Person look={extra(82)} pose={OfficeSeat({ x: 0.62, z: -0.5, ry: -40, lookX: -0.5, smile: 0.3 })} />
        <Person look={extra(83, { hairStyle: "long" })} pose={OfficeSeat({ x: -0.62, z: -0.5, ry: 40, lookX: 0.5, smile: 0.3 })} />
      </Office>
    ),
  }),
  S10: (t, len, g) => {
    const sign = g < wd("10", "reno") ? "LAS VEGAS" : g < wd("10", "lake") ? "RENO" : "LAKE TAHOE";
    return {
      light: "stage",
      cam: glide(cm([2.6, 2.3, 4.0], [0, 1.4, -1.0], 38), cm([2.5, 2.25, 3.8], [0, 1.4, -1.0], 38), t, len),
      world: (
        <SlotFloor f={g} sign={sign}>
          <SlotMachine f={g} win={Math.floor(g / 10) % 3 === 0 ? 1 : 0} />
          <Person look={extra(82)} pose={{ z: 0.72, ry: 180, ...SIT, y: -0.24, armL: { f: 44, e: -50, o: 8 }, armR: { f: 120, e: -20, o: 20 } }} />
        </SlotFloor>
      ),
    };
  },
  S11: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.35, 1.5, 2.4], [0, 1.3, -0.6], 34), cm([0.35, 1.5, 2.28], [0, 1.3, -0.6], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#3A2A20" />
        <Folder p={[0.2, DESK_Y + 0.01, 0.1]} open={ramp(t, 4, 16)} />
        <Person look={CAST.lawmaker} pose={OfficeSeat({ z: -0.7, lookY: -0.4, pitch: 6, brow: 0.3, mouth: talking(g, lineEnd("11")) })} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("11", "forty-two")} text="$42,000+" kind="pop" size={92} color={AMBER} />,
  }),
  S12: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0, 2.6, 5.2], [0, 1.3, -2.4], 36), cm([0, 2.55, 4.95], [0, 1.3, -2.4], 36), t, len),
    world: <SlotFloor f={g} hero={false} rows={3} dark={0.55} />,
  }),
  // ---------- keno ----------
  S13: (t, len, g) => ({
    light: "night",
    cam: cm([0.3, 1.4, 1.9], [0, 1.15, -0.5], 32),
    world: (
      <Office f={g} night plate="">
        <Laptop p={[0.05, DESK_Y, -0.35]} ry={Math.PI} f={g} screen="keno" picks={PICKS.slice(0, 3)} />
        <Person look={CAST.harris} pose={OfficeSeat({ ...typing(g), lookY: -0.4, pitch: 6 })} />
      </Office>
    ),
  }),
  S14: (t, len, g) => {
    const n = Math.min(PICKS.length, Math.floor(ramp(g, wd("14", "predicted"), lineEnd("14")) * PICKS.length + 0.001));
    return {
      light: "stage",
      cam: glide(cm([0.2, 1.6, 2.6], [0, 1.6, -1.0], 36), cm([0.2, 1.6, 2.45], [0, 1.6, -1.0], 36), t, len),
      world: (
        <Void c="#14181E">
          <KenoBoard p={[0, 1.2, -1.4]} w={1.8} lit={PICKS.slice(0, n)} />
          <Desk p={[0, 0, 0.3]} w={1.0} d={0.6} c="#3A2A20" />
          <Laptop p={[0, DESK_Y, 0.35]} ry={Math.PI} f={g} screen="keno" picks={PICKS} />
          <pointLight position={[0, 2.6, 1.6]} intensity={5} distance={6} color="#FFE6C0" />
        </Void>
      ),
    };
  },
  S15: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([1.0, 1.6, 2.6], [0, 1.3, -0.4], 34), cm([0.96, 1.6, 2.45], [0, 1.3, -0.4], 34), t, len),
    world: (
      <SlotFloor f={g} rows={2} sign="LAS VEGAS">
        <SlotMachine f={g} name="KENO" win={g > wd("15", "ten") ? 1 : 0} />
        <Person look={MATE} pose={{ z: 0.72, ry: 180, ...SIT, y: -0.24, armL: { f: 44, e: -50, o: 8 }, armR: { f: 50, e: -46, o: 6 } }} />
        <Person look={CAST.harris} pose={{ x: 0.75, z: 1.0, ry: 200, armL: REST, armR: REST, lookY: -0.3 }} />
      </SlotFloor>
    ),
    over: (
      <>
        <Chip x={500} y={300} at={wd("15", "ten")} text="$10,000" kind="pop" size={92} color={AMBER} />
        <Chip x={500} y={430} at={wd("15", "five")} text="< 5 MIN" kind="slide" size={64} color={TEAL} />
      </>
    ),
  }),
  // ---------- Atlantic City ----------
  S16: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.3, 1.6, 3.6], [0, 1.55, 0], 34), cm([0.3, 1.6, 3.4], [0, 1.55, 0], 34), t, len),
    world: (
      <Void c="#1A242C">
        <LedBoard p={[0, 2.3, -1.4]} text="ATLANTIC CITY" w={1.6} c={AMBER} />
        <Person look={CAST.harris} pose={{ x: -0.35, z: -1.0 + t * 0.016, ...walk(t * 0.32, 22), armL: { f: 10, e: -14, o: 6 }, armR: REST }} holdL={<Box w={0.24} h={0.18} d={0.08} c="#2A2224" p={[0, -0.18, 0.02]} />} />
        <Person look={MATE} pose={{ x: 0.35, z: -1.1 + t * 0.016, ...walk(t * 0.32 + 2, 22), armL: REST, armR: REST }} />
        <pointLight position={[0.4, 2.6, 2.2]} intensity={7} distance={7} color="#E8F2FF" />
      </Void>
    ),
    over: <Chip x={500} y={300} at={wd("16", "january")} text="JAN 1995" kind="pop" size={86} color={AMBER} />,
  }),
  S17: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.9, 1.6, 2.7], [0, 1.35, -0.7], 34), cm([0.86, 1.6, 2.55], [0, 1.35, -0.7], 34), t, len),
    world: (
      <CashCage sign="BALLY'S KENO">
        <Person look={extra(84, { top: "#17171E", shirt: "#F3EFE6", tie: "#C9A04A" })} pose={{ z: -1.0, armL: REST, armR: { f: 60, e: -30, o: 8 }, lookY: -0.3 }} />
        <Person look={MATE} pose={{ x: 0.75, z: 0.75, ry: 220, armL: REST, armR: { f: 60, e: -30, o: 8 } }} />
      </CashCage>
    ),
  }),
  S18: (t, len, g) => {
    const n = Math.min(PICKS.length, Math.floor(ramp(g, at("S18") + 4, wd("18", "hit") + 6) * PICKS.length + 0.001));
    return {
      light: "stage",
      cam: glide(cm([0.2, 1.75, 3.7], [0, 1.85, -1.0], 36), cm([0.2, 1.75, 3.55], [0, 1.85, -1.0], 36), t, len),
      world: (
        <Casino f={g} sign="BALLY'S" table={false} lamp={6}>
          <KenoBoard p={[0, 1.1, -1.4]} w={2.0} lit={PICKS.slice(0, n)} title="BALLY'S KENO" />
          <Person look={MATE} pose={{ x: 0.5, z: 0.4, ry: 200, armL: REST, armR: { f: 60, e: -30, o: 8 } }} />
        </Casino>
      ),
      over: <Chip x={500} y={1080} at={wd("18", "hundred")} text="$100,000" kind="pop" size={96} color={AMBER} />,
    };
  },
  // ---------- caught ----------
  S19: (t, len, g) => ({
    light: "stage",
    cam: cm([0.12, 1.66, 0.85], [0, 1.62, -0.6], 30),
    world: (
      <Casino f={g} sign="BALLY'S" table={false} lamp={6} dim={0.7}>
        <Person look={MATE} pose={{ z: -0.6, armL: REST, armR: REST, ...act(t, [[0, { smile: 0.3 }], [12, { smile: 0, worry: 0.5, lookX: 0.4 }]]) }} />
      </Casino>
    ),
  }),
  S20: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.2, 1.55, 2.0], [0, 1.45, -0.6], 32), cm([0.2, 1.55, 1.9], [0, 1.45, -0.6], 32), t, len),
    world: (
      <Casino f={g} sign="BALLY'S" table={false} lamp={6}>
        <Person look={CAST.pitboss} pose={{ z: -0.6, armL: REST, armR: { f: 20, e: -140, o: 30 }, frown: 0.5, lookX: 0.3 }} holdR={<Phone p={[0, 0.02, 0.04]} r={[0, Math.PI, 0]} s={0.8} screen="off" f={g} />} />
      </Casino>
    ),
  }),
  S21: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.6, 2.9], [0, 1.3, -0.6], 34), cm([0.28, 1.6, 2.75], [0, 1.3, -0.6], 34), t, len),
    world: (
      <CashCage sign="BALLY'S KENO" shutter={ramp(g, wd("21", "cent") - 6, wd("21", "paid") + 4)}>
        <Person look={MATE} pose={{ x: 0.1 + ramp(t, 30, 70) * 0.8, z: 0.6, ry: 120, ...(t > 30 ? walk(t * 0.3, 18) : {}), armL: REST, armR: REST, lookY: -0.3 }} />
        <Person look={CAST.agent} pose={{ x: 0.6 + ramp(t, 30, 70) * 0.8, z: 0.9, ry: 120, ...(t > 30 ? walk(t * 0.3 + 2, 18) : {}), armL: REST, armR: { f: 40, e: -20, o: 10 } }} />
      </CashCage>
    ),
  }),
  S22: (t, len, g) => {
    const stop = ramp(t, 30, 44);
    return {
      light: "cool",
      cam: glide(cm([0.3, 1.6, 3.6], [0, 1.55, 0], 34), cm([0.3, 1.6, 3.4], [0, 1.55, 0], 34), t, len),
      world: (
        <Void c="#1A242C">
          <LedBoard p={[0, 2.3, -1.6]} text="LAS VEGAS ARRIVALS" w={1.8} c={TEAL} />
          <Person look={CAST.harris} pose={{ x: -0.1, z: -1.2 + Math.min(t, 36) * 0.016, ...(stop < 1 ? walk(t * 0.32, 22 * (1 - stop)) : {}), armL: REST, armR: REST, worry: stop * 0.6 }} />
          <Person look={CAST.agent} pose={{ x: 0.6, z: 0.5 - ramp(t, 10, 34) * 0.8, ry: 200, armL: REST, armR: { f: 40, e: -20, o: 10 } }} />
          <Person look={CAST.agent2} pose={{ x: -0.7, z: 0.6 - ramp(t, 12, 36) * 0.8, ry: 160, armL: REST, armR: REST }} />
          <pointLight position={[0.4, 2.6, 2.2]} intensity={7} distance={7} color="#E8F2FF" />
        </Void>
      ),
    };
  },
  S23: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0, 1.9, 4.0], [0, 1.6, 0], 36), cm([0, 1.9, 3.8], [0, 1.6, 0], 36), t, len),
    world: (
      <Chamber f={g}>
        <Person look={CAST.judge} pose={{ z: -0.5, y: 0.25, armL: REST, armR: { f: 40, e: -50, o: 8 }, lookY: -0.2, mouth: talking(g, lineEnd("23")) }} />
      </Chamber>
    ),
    over: <Chip x={500} y={300} at={wd("23", "seven")} text="7 YEARS" kind="pop" size={92} color={RED} />,
  }),
  S24: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.5, 2.4], [0, 1.35, 0.4], 34), cm([0.3, 1.5, 2.28], [0, 1.35, 0.4], 34), t, len),
    world: (
      <Chamber f={g}>
        <Person look={CAST.harris} pose={{ z: 1.0, ry: 180, armL: REST, armR: REST, pitch: 12, heavy: 0.5 }} />
        <Person look={CAST.judge} pose={{ z: -0.5, y: 0.25, armL: REST, armR: { f: 40, e: -50, o: 8 }, lookY: -0.3, frown: 0.4, mouth: talking(g, lineEnd("24")) }} />
      </Chamber>
    ),
  }),
  S25: (t, len, g) => ({
    light: "warm",
    cam: cm([0, DESK_Y + 1.2, 0.35], [0, DESK_Y, 0.02], 34),
    world: (
      <Office f={g} night plate="">
        <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#3A2A20" />
        <Book p={[0, DESK_Y + 0.006, 0]} open={ramp(t, 4, 20)} c="#141216" />
        <pointLight position={[0.2, DESK_Y + 0.9, 0.4]} intensity={1.2} distance={2} color="#FFE6C0" />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("25", "black")} text="BLACK BOOK" kind="pop" size={84} color={RED} />,
  }),
  S26: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.3, 1.5, 4.04], [0.32, 1.05, 0.5], 38), LOOP_CAM, t, len),
    world: <HookSet g={g} />,
  }),
};

const ROOMS = [
  ["S1", "S1", "sfx/synth/room-casino.wav"],
  ["S2", "S3", "sfx/synth/room-office.wav"],
  ["S4", "S4", "sfx/synth/room-casino.wav"],
  ["S5", "S5", "sfx/synth/room-office.wav"],
  ["S7", "S8", "sfx/synth/room-casino.wav"],
  ["S9", "S9", "sfx/synth/room-office.wav"],
  ["S10", "S10", "sfx/synth/room-casino.wav"],
  ["S15", "S15", "sfx/synth/room-casino.wav"],
  ["S17", "S21", "sfx/synth/room-casino.wav"],
  ["S23", "S24", "sfx/synth/room-chamber.wav"],
  ["S26", "S26", "sfx/synth/room-casino.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence after "a hundred thousand dollars", after "what sank them" and after the judge's words, low under the question
  const duck = (g: number) =>
    interpolate(
      g,
      [lineEnd("17") - 4, lineStart("18"), lineEnd("18") + 2, lineStart("19") + 2, lineEnd("19"), lineEnd("19") + 4, lineStart("20") + 4, lineStart("20") + 16, lineEnd("24") - 4, lineEnd("24") + 2, lineStart("25") + 4, lineStart("25") + 16, lineStart("26"), lineStart("26") + 12],
      [1, 0.3, 0, 0, 0, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0.35],
      CLAMP,
    );
  const coin0 = at("S8");
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="ron-harris" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      <Sfx file="sfx/click/mouse-click-351398.mp3" at={at("S4") + 16} level={-22} align="onset" />
      {COINS.map((c0) => <Sfx key={c0} file="sfx/synth/coin-flip.wav" at={coin0 + c0 + 7} level={-27} align="onset" />)}
      <Sfx file="sfx/synth/chip-stack.wav" at={lineEnd("08") + 1} level={-22} align="onset" />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("18") + 3} level={-21} align="onset" />
      <Sfx file="sfx/synth/shutter-down.wav" at={wd("21", "cent") - 6} level={-18} seconds={1.4} />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("24")} level={-20} align="onset" seconds={1.2} />
    </Episode>
  );
};

/** 9:16 thumbnail: the inspector at the machine with his laptop. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" post={{ bloom: 0.15 }} cam={cm([0.75, 1.42, 4.4], [0.45, 1.26, 0.7], 38)} over={<ThumbText top="HE CHECKED THEM" bottom="HE RIGGED THEM" size={88} y={150} />}>
    <SlotFloor f={20} sign="CASINO" stools={false}>
      <SlotMachine f={20} win={1} />
      {/* thumbnail only: laptop turned toward camera so the red code line reads */}
      <Box w={0.46} h={0.7} d={0.36} c="#3A3E46" p={CART} o={{ metal: 0.4, rough: 0.5 }} />
      <Laptop p={[CART[0], 0.7, CART[2]]} ry={0.35} f={90} screen="code" s={1.3} hidden={1} />
      <Person look={CAST.harris} pose={{ x: CART[0], z: 0.82, armL: { f: 50, e: -45, o: 8 }, armR: { f: 52, e: -42, o: 8 }, smirk: 0.45, browL: 0.4, lookY: -0.1, pitch: 0 }} />
      <pointLight position={[1.1, 1.9, 1.4]} intensity={2.6} distance={3.2} color="#FFE2BE" />
    </SlotFloor>
  </Shot3D>
);

