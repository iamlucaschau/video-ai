/**
 * NEON ODDS ep08 · watanabe. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-watanabe-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * The blackjack table sits at the origin: Watanabe on −z facing +z, the dealer at the +z side off to −x, so the camera on
 * +z sees his face. A bottle tilted in from above the frame pours into his glass (the server's hand stays off frame).
 * Casino names are on signs only (no logos); the drinking is shown as the workers described it, never the pills.
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, alive, Box, Chip, glide, P, Person, type Pose, Shot3D, SIT, sph, talk, type V3, walk } from "../../../Style Library/N-low-poly/lowpoly";
import { Bottle, Bundle, Chair, ChipHill, ChipStack, Contract, Crate, Folder, Glass, LedBoard, PieChart, Stamp } from "../../../Style Library/N-low-poly/props";
import { BlackjackTable, CashCage, Casino, CAST, extra, Interview, Office, TABLE_Y, Void, Warehouse } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/watanabe.timing.json";
import rawWords from "../../../src/voiceover/watanabe.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/watanabe.mp3";

const AMBER = "#FFB347";
const TEAL = "#62D2DC";
const RED = "#FF6A5A";
const TOP = TABLE_Y;
/** cards, chips and glasses sit above the felt texture (TOP + 0.007), or the felt hides them */
const FELT = TOP + 0.012;
const DESK_Y = 0.77;
const REST = { o: 8 };
const talking = (g: number, end: number) => talk(g, g < end - 3);
const WAT = CAST.watanabe;
const W_AT = { x: 0, z: -0.82 };
const SEAT: Pose = { ...SIT, armL: { f: 42, e: -52, o: 8 }, armR: { f: 42, e: -52, o: 8 } };
const DEALER_AT = { x: -0.78, z: 0.5 };
const OfficeSeat = (p: Pose = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...p });
/** the slow sway of a man who has been drinking for hours (`k` 0→1 how drunk) */
const drunk = (g: number, k = 1): Pose => ({ roll: Math.sin(g * 0.06) * 5 * k, lean: 5 * k + Math.sin(g * 0.045) * 3 * k, heavy: 0.55 * k, lookY: -0.12 * k });

// ---------------- the table ----------------
const GLASS: V3 = [0.16, FELT, -0.4];
/** a bottle tilted in from above, its neck over the glass; the stream runs while `pour` is true */
const Pour: React.FC<{ fill: number; pour: boolean }> = ({ fill, pour }) => {
  const a = 2.2;
  const tipY = GLASS[1] + 0.16;
  const liq = GLASS[1] + 0.012 + 0.075 * Math.min(1, fill);
  return (
    <>
      <Glass p={GLASS} fill={fill} />
      <Bottle p={[GLASS[0] + Math.sin(a) * 0.31, tipY - Math.cos(a) * 0.31, GLASS[2]]} r={[0, 0, a]} />
      {pour ? <Box w={0.008} h={tipY - liq} d={0.008} c="#C8781E" p={[GLASS[0], liq, GLASS[2]]} o={{ e: "#8A4A10", ei: 0.8, op: 0.9 }} shadow={false} /> : null}
    </>
  );
};
/** the high-limit room: a blackjack table at the origin, Watanabe seated on −z, the dealer at the shoe */
const Room: React.FC<{ f: number; sign?: string; board?: string | null; boardC?: string; children?: React.ReactNode; wat?: Pose | null; dealer?: Pose | null; dim?: number; lamp?: number; chair?: boolean }> = ({ f, sign = "CAESARS PALACE", board = null, boardC = AMBER, children, wat = {}, dealer = {}, dim = 1, lamp = 8, chair = true }) => (
  <Casino f={f} sign={sign} board={board} boardC={boardC} table={false} lamp={lamp} dim={dim}>
    <BlackjackTable />
    {wat ? (
      <>
        {chair ? <Chair p={[W_AT.x, 0, W_AT.z - 0.12]} c="#4A1E22" /> : null}
        <Person look={WAT} pose={{ ...W_AT, ...alive(f, 4), ...SEAT, ...wat }} />
      </>
    ) : null}
    {dealer ? <Person look={CAST.dealer} pose={{ ...DEALER_AT, ry: 150, armL: REST, armR: { f: 40, e: -50, o: 8 }, lookY: -0.4, ...dealer }} /> : null}
    {children}
  </Casino>
);
const LOOP_CAM = cm([0.3, 1.5, 1.8], [0.06, 1.02, -0.4], 38);
/** the hook picture: he sways over a tall stack while the bottle tops up his glass */
const HookSet: React.FC<{ g: number; fill: number; pour: boolean }> = ({ g, fill, pour }) => (
  <Room f={g} wat={{ ...drunk(g), armR: { f: 48, e: -40, o: 6 }, smile: 0.15 }} dealer={{ lookX: 0.4, lookY: 0 }}>
    <Pour fill={fill} pour={pour} />
    <ChipHill p={[-0.3, FELT, -0.42]} k={0.85} cols={3} rows={2} max={22} seed={5} />
    <pointLight position={[0.4, 1.9, 0.6]} intensity={2.2} distance={3.4} color="#FFE2BE" />
  </Room>
);

// ---------------- other helpers ----------------
/** a bunch of party balloons tied to a crate (Oriental Trading sold party supplies) */
const Balloons: React.FC<{ p: V3; seed: number }> = ({ p, seed }) => (
  <group position={p}>
    {[0, 1, 2, 3].map((i) => {
      const x = Math.sin(seed + i * 1.7) * 0.16;
      const z = Math.cos(seed * 1.3 + i * 2.1) * 0.1;
      const y = 0.75 + ((seed + i * 3) % 4) * 0.08;
      return (
        <group key={i}>
          <Box w={0.005} h={y} d={0.005} c="#D8D0C0" p={[x * 0.3, 0, z * 0.3]} r={[z * 0.4, 0, -x * 0.4]} shadow={false} />
          <P g={sph(0.11, 1)} c={["#E8574A", "#F2C14E", "#4AA8C8", "#9A5AC8"][(seed + i) % 4]} p={[x, y + 0.1, z]} s={[1, 1.18, 1]} o={{ rough: 0.35 }} />
        </group>
      );
    })}
  </group>
);
/** a money counter on the casino's LED board: 0 → `to` (millions) between frames a and b */
const count = (g: number, a: number, b: number, to: number) => `$${Math.round(to * ramp(g, a, b))}M`;

const S: Record<string, ShotFn> = {
  // ---------- hook ----------
  S1: (t, len, g) => ({
    light: "stage",
    cam: glide(LOOP_CAM, cm([0.3, 1.5, 1.68], [0.06, 1.02, -0.4], 38), t, len),
    world: <HookSet g={g} fill={0.35 + 0.4 * ramp(t, 0, 30)} pour={t < 30} />,
  }),
  S2: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.2, 1.5, 2.9], [0.12, 1.25, -0.7], 36), cm([0.2, 1.5, 2.75], [0.12, 1.25, -0.7], 36), t, len),
    world: (
      <Room f={g} wat={null} dealer={{ lookX: 0.5, lookY: 0.1 }}>
        <Glass p={GLASS} fill={0.75} />
        <Person
          look={WAT}
          pose={{
            x: -0.05,
            z: -0.95,
            roll: Math.sin(g * 0.09) * 9,
            lean: 8 + Math.sin(g * 0.07) * 5,
            heavy: 0.6,
            armL: { f: 30, e: -20, o: 12 },
            armR: { f: 45, e: -15, o: 4 },
            ...act(t, [[0, { worry: 0 }], [20, { worry: 0.3 }]]),
          }}
        />
        <Person look={CAST.bellman} pose={{ x: 0.4, z: -0.75, ry: -35, armL: REST, armR: { f: 55, e: -25, o: -12 }, lookX: -0.5, worry: 0.3 }} />
      </Room>
    ),
  }),
  S3: (t, len, g) => ({
    light: "stage",
    cam: cm([0.12, 1.66, 0.85], [0, 1.62, -0.6], 30),
    world: (
      <Casino f={g} sign="CAESARS PALACE" table={false} lamp={6} dim={0.8}>
        <Person
          look={CAST.pitboss}
          pose={{
            z: -0.6,
            armL: REST,
            ...act(t, [
              [0, { armR: REST, worry: 0.3, lookX: -0.3, brow: 0.2 }],
              [14, { armR: REST, worry: 0.1, lookX: 0.4, brow: 0 }],
              [26, { armR: { f: 70, e: -60, o: 30 }, smile: 0.25, lookX: 0.5, pitch: 6 }],
            ]),
          }}
        />
      </Casino>
    ),
  }),
  // ---------- who he was ----------
  S4: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.9, 4.6], [0.1, 1.9, -2.5], 38), cm([0.3, 1.88, 4.4], [0.1, 1.9, -2.5], 38), t, len),
    world: (
      <Warehouse f={g} t={t} sign="OMAHA" workers={false}>
        {Array.from({ length: 6 }, (_, i) => (
          <group key={i}>
            <Crate p={[(i % 3 - 1) * 0.9, 0, -1.1 - Math.floor(i / 3) * 0.9]} />
            <Balloons p={[(i % 3 - 1) * 0.9, 0.42, -1.1 - Math.floor(i / 3) * 0.9]} seed={i * 5 + 1} />
          </group>
        ))}
        <Person look={WAT} pose={{ x: 0.2, z: 0.5, armL: REST, armR: { f: 30, e: -60, o: 10 }, lookX: -0.2, smile: 0.35 }} holdR={<Folder p={[0, -0.02, 0.05]} r={[Math.PI / 2, 0, 0]} />} />
      </Warehouse>
    ),
    over: <Chip x={500} y={300} at={wd("04", "twenty")} text="20+ YEARS" kind="pop" size={88} color={AMBER} />,
  }),
  S5: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.4, 1.45, 1.7], [0, 1.0, -0.45], 32), cm([0.38, 1.45, 1.6], [0, 1.0, -0.45], 32), t, len),
    world: (
      <Office f={g} night plate="">
        <Contract p={[0.02, DESK_Y + 0.01, -0.22]} r={[0, 0.1, 0]} s={1.3} title="SALE" lines={6} sign={ramp(t, 6, 34)} />
        <Person look={WAT} pose={OfficeSeat({ armR: { f: 52, e: -62, o: 6 }, lookY: -0.5, pitch: 8, smile: 0.3 })} />
      </Office>
    ),
  }),
  S6: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.3, 1.6, 3.6], [0, 1.55, 0], 34), cm([0.3, 1.6, 3.4], [0, 1.55, 0], 34), t, len),
    world: (
      <Void c="#1A1E2C">
        <LedBoard p={[0, 2.3, -1.4]} text="LAS VEGAS" w={1.6} c={AMBER} />
        <Person look={WAT} pose={{ x: 0, z: -1.0 + t * 0.016, ...walk(t * 0.3, 20), armL: REST, armR: REST, smile: 0.4, lookY: 0.2 }} />
        <pointLight position={[0.4, 2.6, 2.2]} intensity={7} distance={7} color="#FFE6C0" />
      </Void>
    ),
  }),
  S7: (t, len, g) => {
    const stop = ramp(t, 18, 30);
    return {
      light: "stage",
      cam: glide(cm([0.15, 1.7, 4.4], [0.1, 1.95, -2.0], 36), cm([0.15, 1.7, 4.25], [0.1, 1.95, -2.0], 36), t, len),
      world: (
        <Casino f={g} sign="WYNN" table={false} lamp={6}>
          <Person
            look={WAT}
            pose={{ x: -0.15, z: -1.0 + Math.min(t, 30) * 0.012, ...(stop < 1 ? walk(t * 0.3, 18 * (1 - stop)) : {}), ...drunk(g, 0.8), armL: REST, armR: { f: 40, e: -60, o: 6 }, worry: stop * 0.4 }}
            holdR={<Glass p={[0, -0.04, 0.04]} fill={0.6} s={1.2} />}
          />
          <Person look={CAST.guard} pose={{ x: 0.35, z: 0.3, ry: 200, armL: REST, ...act(t, [[0, { armR: REST }], [16, { armR: { f: 70, e: -10, o: 40 } }]]) }} />
        </Casino>
      ),
    };
  },
  // ---------- Caesars ----------
  S8: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([-0.1, 1.7, 4.2], [0.05, 1.95, -2.0], 36), cm([-0.1, 1.7, 4.05], [0.05, 1.95, -2.0], 36), t, len),
    world: (
      <Casino f={g} sign="CAESARS PALACE" table={false} lamp={7}>
        <Person look={CAST.pitboss} pose={{ x: 0.1, z: -0.9, armL: { f: 30, o: 45, e: -20 }, armR: { f: 30, o: 45, e: -20 }, smile: 0.6, squint: 0.3 }} />
        <Person look={WAT} pose={{ x: -0.35, z: 0.6 - Math.min(t, 40) * 0.01, ry: 170, ...walk(t * 0.3, 16), armL: REST, armR: REST }} />
      </Casino>
    ),
  }),
  S9: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.6, 4.6], [0, 1.4, -0.2], 36), cm([0, 1.6, 4.4], [0, 1.4, -0.2], 36), t, len),
    world: (
      <Casino f={g} sign="CAESARS PALACE" table={false} lamp={7}>
        <Person look={CAST.bellman} pose={{ x: -0.6, z: -1.3 + t * 0.014, ...walk(t * 0.3 + 1, 18), armL: REST, armR: REST }} />
        <Person look={WAT} pose={{ x: 0, z: -1.1 + t * 0.014, ...walk(t * 0.3, 18), armL: REST, armR: REST, smile: 0.3 }} />
        <Person look={CAST.guard} pose={{ x: 0.62, z: -1.3 + t * 0.014, ...walk(t * 0.3 + 2, 18), armL: REST, armR: REST }} />
      </Casino>
    ),
  }),
  S10: (t, len, g) => {
    const k = ramp(g, wd("09", "fifteen") - 6, lineEnd("09"));
    return {
      light: "stage",
      cam: glide(cm([0.1, TOP + 1.35, 0.7], [0, TOP, -0.2], 34), cm([0.1, TOP + 1.3, 0.66], [0, TOP, -0.2], 34), t, len),
      world: (
        <Room f={g} wat={{ armL: { f: 48, e: -46, o: 8 }, armR: { f: 48, e: -46, o: 8 }, lookY: -0.5, smile: 0.2 }} dealer={{ armR: { f: 62, e: -20, o: 4 } }}>
          <ChipStack p={[0.05, FELT, 0.2 - k * 0.45]} n={9} c={AMBER} seed={4} />
          <ChipStack p={[-0.08, FELT, 0.24 - k * 0.45]} n={6} c={AMBER} seed={6} />
          <Glass p={GLASS} fill={0.5} />
        </Room>
      ),
      over: (
        <>
          <Chip x={500} y={300} at={wd("09", "fifteen")} text="15%" kind="pop" size={110} color={AMBER} />
          <Chip x={500} y={440} at={wd("09", "reportedly")} text="REPORTEDLY" kind="slide" size={56} color={TEAL} />
        </>
      ),
    };
  },
  // ---------- the money ----------
  S11: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.3, 1.75, 3.4], [0, 1.75, -1.5], 38), cm([0.3, 1.75, 3.2], [0, 1.75, -1.5], 38), t, len),
    world: (
      <Room f={g} board={count(g, wd("10", "eight"), wd("10", "dollars"), 825)} wat={{ ...drunk(g, 0.5), armR: { f: 55, e: -30, o: 4 }, lookY: 0.4 }} dealer={{ armR: { f: 55, e: -25, o: 4 } }}>
        <Glass p={GLASS} fill={0.6} />
        <ChipHill p={[-0.3, FELT, -0.42]} k={0.85} cols={3} rows={2} max={22} seed={5} />
      </Room>
    ),
    over: <Chip x={500} y={1060} at={wd("10", "two")} text="2007" kind="pop" size={92} color={AMBER} />,
  }),
  S12: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.25, 1.6, 2.6], [0, 1.6, -1.5], 38), cm([0.25, 1.6, 2.45], [0, 1.6, -1.5], 38), t, len),
    world: (
      <Room f={g} board={count(g, wd("11", "hundred") - 4, lineEnd("11"), 127)} boardC={RED} wat={act(t, [[0, { lookY: 0.3, worry: 0 }], [24, { lookY: -0.4, pitch: 10, heavy: 0.6, worry: 0.4, lean: 8 }]])} dealer={null}>
        <Glass p={GLASS} fill={0.15} />
        <ChipHill p={[-0.3, FELT, -0.42]} k={0.15} cols={3} rows={2} max={22} seed={5} />
      </Room>
    ),
  }),
  S13: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.2, 1.55, 2.5], [0.3, 1.45, -1.2], 34), cm([0.2, 1.55, 2.35], [0.3, 1.45, -1.2], 34), t, len),
    world: (
      <Office f={g} night plate="" frames={0}>
        <PieChart p={[0.55, 1.15, -2.25]} w={1.4} slice={0.056} k={ramp(g, wd("12", "five") - 4, wd("12", "percent"))} />
        <Person look={CAST.exec} pose={{ x: -0.35, z: -0.9, ry: 20, armL: REST, armR: { f: 60, e: -20, o: 20 }, lookX: 0.5, lookY: 0.2, mouth: 0.2 }} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("12", "five")} text="5.6%" kind="pop" size={110} color={AMBER} />,
  }),
  // ---------- the drinking ----------
  S14: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.42, 2.2], [0, 1.25, -0.5], 32), cm([0.3, 1.42, 2.08], [0, 1.25, -0.5], 32), t, len),
    world: (
      <Interview f={g}>
        <Person look={CAST.bellman} pose={{ z: -0.62, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -70, o: 10 }, lookX: 0.2, brow: 0.3, mouth: talking(g, lineEnd("13")) }} />
      </Interview>
    ),
  }),
  S15: (t, len, g) => {
    const wake = wd("14", "woke") - 3;
    const up = ramp(g, wake, wake + 14);
    const push = ramp(g, wd("14", "kept"), wd("14", "kept") + 12);
    return {
      light: "stage",
      cam: glide(cm([0.3, 1.45, 1.9], [0.04, 0.98, -0.45], 36), cm([0.3, 1.45, 1.8], [0.04, 0.98, -0.45], 36), t, len),
      world: (
        <Room f={g} wat={{ pitch: 38 * (1 - up), lean: 22 * (1 - up) + 6, heavy: 1 - 0.4 * up, blink: up < 0.5 ? 1 : 0, armL: { f: 60, e: -80, o: 20 }, armR: { f: 48 + push * 20, e: -40 + push * 25, o: 6 } }} dealer={{ lookX: 0.4 }}>
          <Glass p={GLASS} fill={0.7} />
          <ChipStack p={[0.0, FELT, -0.42 + push * 0.18]} n={8} c={AMBER} seed={3} />
        </Room>
      ),
    };
  },
  S16: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.2, 1.6, 3.8], [0, 1.45, 0], 34), cm([0.2, 1.6, 3.6], [0, 1.45, 0], 34), t, len),
    world: (
      <Casino f={g} sign="CAESARS PALACE" table={false} lamp={5} dim={0.6}>
        <Person look={CAST.wSister} pose={{ x: -0.3, z: -1.2 + t * 0.016, ...walk(t * 0.32, 20), armL: { f: 15, e: -10, o: 8 }, armR: { f: 20, e: -10, o: -20 }, frown: 0.3 }} holdL={<Box w={0.36} h={0.5} d={0.18} c="#2A3A4A" p={[0, -0.5, 0.02]} />} />
        <Person look={WAT} pose={{ x: 0.25, z: -1.5 + t * 0.016, ...walk(t * 0.32 + 2, 14), armL: { f: 20, e: -10, o: -15 }, armR: REST, heavy: 0.6, pitch: 10, lookY: -0.4 }} />
      </Casino>
    ),
  }),
  // ---------- the debt ----------
  S17: (t, len, g) => {
    const n = Math.floor(ramp(g, at("S17") + 4, lineEnd("16")) * 9);
    return {
      light: "warm",
      cam: glide(cm([0.35, 1.55, 2.2], [0, 1.15, -0.4], 32), cm([0.35, 1.55, 2.08], [0, 1.15, -0.4], 32), t, len),
      world: (
        <CashCage sign="CASHIER">
          {Array.from({ length: n }, (_, i) => <Bundle key={i} p={[-0.3 + (i % 3) * 0.12, 1.07 + Math.floor(i / 3) * 0.085, -0.3 + ((i * 7) % 3) * 0.02]} />)}
          <Person look={extra(92, { top: "#17171E", shirt: "#F3EFE6", tie: "#C9A04A" })} pose={{ z: -1.0, armL: REST, armR: { f: 60, e: -30, o: 8 }, lookY: -0.3, smile: 0.3 }} />
        </CashCage>
      ),
    };
  },
  S18: (t, len, g) => {
    const hit = lineEnd("17") + 2;
    return {
      light: "warm",
      cam: cm([0.15, DESK_Y + 0.85, 0.75], [0, DESK_Y, -0.12], 34),
      world: (
        <Office f={g} night plate="">
          <Contract p={[0, DESK_Y + 0.012, -0.08]} s={1.4} title="MARKER" lines={5} />
          <Stamp p={[0, DESK_Y + 0.02, -0.08]} k={ramp(g, hit - 8, hit)} word="UNPAID" printed={g >= hit} />
          <Person look={CAST.pitboss} pose={OfficeSeat({ lookY: -0.6, pitch: 8, frown: 0.4 })} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("17", "fourteen")} text="$14.7M" kind="pop" size={110} color={RED} />,
    };
  },
  // ---------- the turn ----------
  S19: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.35, 1.5, 2.6], [0.1, 1.2, -0.6], 34), cm([0.35, 1.5, 2.45], [0.1, 1.2, -0.6], 34), t, len),
    world: (
      <Office f={g} night plate="DA OFFICE">
        <Folder p={[0.0, DESK_Y + 0.01, 0.05 + (1 - ramp(t, 4, 22)) * 0.3]} />
        <Person look={CAST.official} pose={OfficeSeat({ lookY: -0.4, pitch: 6, brow: 0.3 })} />
        <Person look={CAST.pitboss} pose={{ x: 0.75, z: 0.55, ry: 215, armL: REST, ...act(t, [[0, { armR: { f: 55, e: -20, o: 8 } }], [22, { armR: REST }]]) }} />
      </Office>
    ),
  }),
  S20: (t, len, g) => {
    const drops = [wd("19", "charged"), wd("19", "four"), wd("19", "felonies") - 2, wd("19", "felonies") + 6];
    return {
      light: "warm",
      cam: cm([0.1, DESK_Y + 0.95, 0.85], [0, DESK_Y, -0.15], 34),
      world: (
        <Office f={g} night plate="DA OFFICE">
          {drops.map((d, i) => {
            const k = ramp(g, d - 5, d);
            return g >= d - 5 ? <Contract key={i} p={[-0.15 + i * 0.1, DESK_Y + 0.012 + i * 0.003 + (1 - k) * 0.3, -0.1 + (i % 2) * 0.05]} r={[0, -0.3 + i * 0.18, 0]} s={1.1} title="FELONY" lines={5} /> : null;
          })}
          <Person look={CAST.official} pose={OfficeSeat({ lookY: -0.5, pitch: 8 })} />
        </Office>
      ),
      over: (
        <>
          <Chip x={500} y={300} at={wd("19", "four")} text="4 FELONIES" kind="pop" size={92} color={AMBER} />
          <Chip x={500} y={430} at={wd("19", "twenty-eight")} text="28 YEARS" kind="slide" size={80} color={RED} />
        </>
      ),
    };
  },
  S21: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.35, 1.42, 2.3], [0.05, 1.2, -0.5], 32), cm([0.35, 1.42, 2.18], [0.05, 1.2, -0.5], 32), t, len),
    world: (
      <Interview f={g}>
        <Glass p={[0.32, DESK_Y + 0.01, -0.05]} fill={0} />
        <Person look={WAT} pose={{ z: -0.62, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 50, e: -60, o: 10 }, brow: 0.3, worry: 0.2, mouth: talking(g, lineEnd("20")) }} />
        <Person look={CAST.lawmaker} pose={{ x: -0.62, z: -0.75, ry: 20, armL: REST, armR: { f: 20, e: -30, o: 8 }, lookX: 0.5 }} />
      </Interview>
    ),
  }),
  S22: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.35, 1.45, 1.75], [0, 1.0, -0.4], 32), cm([0.33, 1.45, 1.65], [0, 1.0, -0.4], 32), t, len),
    world: (
      <Office f={g} night plate="">
        <Contract p={[0.02, DESK_Y + 0.01, -0.2]} r={[0, -0.1, 0]} s={1.3} title="SETTLEMENT" lines={6} sign={ramp(g, wd("21", "settled") - 6, lineEnd("21"))} />
        <Person look={CAST.lawmaker} pose={OfficeSeat({ armR: { f: 52, e: -62, o: 6 }, lookY: -0.5, pitch: 8 })} />
        <Person look={CAST.pitboss} pose={{ x: 0.75, z: -0.55, ry: -30, armL: REST, armR: REST, lookX: -0.5, lookY: -0.3 }} />
      </Office>
    ),
  }),
  S23: (t, len, g) => {
    const hit = wd("22", "fined") + 2;
    return {
      light: "warm",
      cam: glide(cm([0.3, 1.5, 2.1], [0, 1.05, -0.4], 32), cm([0.3, 1.5, 2.0], [0, 1.05, -0.4], 32), t, len),
      world: (
        <Office f={g} night plate="NEW JERSEY">
          <Contract p={[0.2, DESK_Y + 0.012, 0.18]} s={1.2} title="PENALTY" lines={5} />
          <Stamp p={[0.2, DESK_Y + 0.02, 0.18]} k={ramp(g, hit - 8, hit)} word="FINED" printed={g >= hit} />
          <Person look={CAST.official} pose={OfficeSeat({ lookY: -0.5, pitch: 8, frown: 0.2 })} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("22", "two")} text="$225,000" kind="pop" size={100} color={AMBER} />,
    };
  },
  S24: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.15, 1.62, 2.3], [0.02, 0.98, -0.4], 38), cm([0.15, 1.6, 2.2], [0.02, 0.98, -0.4], 38), t, len),
    world: (
      <Room f={g} wat={{ lookY: -0.5, lookX: 0.2, pitch: 10, heavy: 0.5, armL: { f: 30, e: -40, o: 8 }, armR: { f: 30, e: -40, o: 8 } }} dealer={null}>
        <ChipHill p={[-0.28, FELT, -0.28]} k={1} cols={4} rows={3} max={34} seed={9} />
        <ChipStack p={[0.32, FELT, -0.25]} n={3} c={AMBER} seed={2} />
      </Room>
    ),
    over: (
      <>
        <Chip x={500} y={300} at={at("S24") + 4} text="$127M vs $225K" kind="pop" size={72} color={AMBER} />
        <Chip x={500} y={430} at={wd("23", "fifth")} text="0.18%" kind="slide" size={96} color={RED} />
      </>
    ),
  }),
  S25: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.3, 1.5, 1.95], [0.06, 1.02, -0.4], 38), LOOP_CAM, t, len),
    world: <HookSet g={g} fill={0.1 + 0.25 * ramp(t, len - 40, len)} pour={t >= len - 40} />,
  }),
};

const ROOMS = [
  ["S1", "S3", "sfx/synth/room-casino.wav"],
  ["S5", "S5", "sfx/synth/room-office.wav"],
  ["S7", "S12", "sfx/synth/room-casino.wav"],
  ["S13", "S13", "sfx/synth/room-office.wav"],
  ["S14", "S14", "sfx/synth/room-interview.wav"],
  ["S15", "S17", "sfx/synth/room-casino.wav"],
  ["S18", "S20", "sfx/synth/room-office.wav"],
  ["S21", "S21", "sfx/synth/room-interview.wav"],
  ["S22", "S23", "sfx/synth/room-office.wav"],
  ["S25", "S25", "sfx/synth/room-casino.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence after "stayed unpaid", after "twenty-eight years" and after "what he lost", low under the last question
  const duck = (g: number) =>
    interpolate(
      g,
      [lineEnd("17") - 4, lineEnd("17") + 2, lineStart("18") - 2, lineStart("18") + 10, lineEnd("19") - 4, lineEnd("19") + 2, lineStart("20") - 2, lineStart("20") + 12, lineEnd("23") - 4, lineEnd("23") + 2, lineStart("24"), lineStart("24") + 12],
      [1, 0, 0, 0.9, 0.9, 0, 0, 0.7, 0.7, 0, 0, 0.35],
      CLAMP,
    );
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="watanabe" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      <Sfx file="sfx/synth/chip-stack.wav" at={lineEnd("09") + 1} level={-22} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={lineEnd("17") + 2} level={-19} align="onset" />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("19") + 3} level={-21} align="onset" />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("23") + 1} level={-20} align="onset" seconds={1.2} />
    </Episode>
  );
};

/** 9:16 thumbnail: the whale at the table, glass being topped up. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" post={{ bloom: 0.12 }} cam={cm([0.38, 1.3, 1.85], [0.06, 1.1, -0.45], 38)} over={<ThumbText top="$127 MILLION" bottom="ONE YEAR" size={110} y={200} />}>
    <Room f={20} wat={{ ...drunk(20), armR: { f: 48, e: -40, o: 6 }, smile: 0.2 }} dealer={null}>
      <Pour fill={0.6} pour />
      <ChipHill p={[-0.3, FELT, -0.42]} k={0.85} cols={3} rows={2} max={22} seed={5} />
      <pointLight position={[0.4, 1.9, 0.6]} intensity={2.2} distance={3.4} color="#FFE2BE" />
    </Room>
  </Shot3D>
);
