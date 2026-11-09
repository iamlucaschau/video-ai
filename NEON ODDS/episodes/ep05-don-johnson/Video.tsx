/**
 * NEON ODDS ep05 · don-johnson. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-don-johnson-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * The table (BlackjackTable) is centred on the origin: Don sits on −z facing +z, the dealer stands at the +z side off to −x,
 * so the camera on +z sees Don's face. Casino names are on signs only (no logos); cards and chip amounts on the felt are drawn.
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Crowd, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, alive, Box, Chip, glide, Panel, Person, type Pose, Shot3D, SIT, talk, useLiveTex, type V3 } from "../../../Style Library/N-low-poly/lowpoly";
import { Balance, Card, CardShoe, Chair, ChipHill, ChipStack, Contract, LedBoard, Phone, Stamp, Ticket } from "../../../Style Library/N-low-poly/props";
import { BlackjackTable, CashCage, Casino, CAST, extra, Office, TABLE_Y, Void } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/don-johnson.timing.json";
import rawWords from "../../../src/voiceover/don-johnson.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/don-johnson.mp3";

const AMBER = "#FFB347";
const TEAL = "#62D2DC";
const RED = "#FF6A5A";
const TOP = TABLE_Y;
/** cards and paper sit above the felt texture (TOP + 0.007), or the felt hides them */
const FELT = TOP + 0.012;
const REST = { o: 8 };
const talking = (g: number, end: number) => talk(g, g < end - 3);
const DON = CAST.donJohnson;
const DON_AT = { x: 0, z: -0.82 };
const SEAT: Pose = { ...SIT, armL: { f: 42, e: -52, o: 8 }, armR: { f: 42, e: -52, o: 8 } };
const ARMS_X: Pose = { armL: { f: 40, e: -110, o: 22 }, armR: { f: 40, e: -110, o: 22 } };
const DEALER_AT = { x: -0.78, z: 0.5 };
/** a $100,000 plaque: a flat amber block */
const Plaque: React.FC<{ p: V3; n?: number; c?: string }> = ({ p, n = 1, c = AMBER }) => (
  <group position={p}>
    {Array.from({ length: n }, (_, i) => <Box key={i} w={0.1} h={0.012} d={0.065} c={i % 3 === 2 ? "#E8D8A8" : c} p={[0, i * 0.013, 0]} o={{ metal: 0.3, rough: 0.4 }} />)}
  </group>
);

// ---------------- the table ----------------
/** the high-limit room: a blackjack table at the origin, Don seated on −z, the dealer at the shoe */
const Room: React.FC<{ f: number; sign?: string; children?: React.ReactNode; don?: Pose | null; dealer?: Pose | null; dim?: number; lamp?: number }> = ({ f, sign = "HIGH LIMIT", children, don = {}, dealer = {}, dim = 1, lamp = 8 }) => (
  <Casino f={f} sign={sign} table={false} lamp={lamp} dim={dim}>
    <BlackjackTable />
    <CardShoe p={[-0.62, TOP + 0.01, 0.3]} ry={-40} />
    {don ? (
      <>
        <Chair p={[DON_AT.x, 0, DON_AT.z - 0.12]} c="#4A1E22" />
        <Person look={DON} pose={{ ...DON_AT, ...alive(f, 4), ...SEAT, ...don }} />
      </>
    ) : null}
    {dealer ? <Person look={CAST.dealer} pose={{ ...DEALER_AT, ry: 150, armL: REST, armR: { f: 40, e: -50, o: 8 }, lookY: -0.4, ...dealer }} /> : null}
    {children}
  </Casino>
);
const LOOP_CAM = cm([0.3, 1.55, 1.75], [0.02, 1.0, -0.35], 38);
/** the hook picture: Don slides the terms across the felt toward the viewer (`k` 0→1 slide) */
const HookSet: React.FC<{ g: number; k: number }> = ({ g, k }) => (
  <Room f={g} don={{ armR: { f: 70 + k * 10, e: -20, o: 10 }, lookY: -0.2, smirk: 0.35, browL: 0.3 }} dealer={null}>
    <Contract p={[0.06, FELT, -0.42 + k * 0.3]} r={[0, 0.12, 0]} s={1.5} lines={6} sign={0} />
    <ChipHill p={[0.48, FELT, -0.35]} k={0.7} cols={3} rows={2} max={24} seed={8} />
    <pointLight position={[0.3, 1.9, 0.6]} intensity={2.2} distance={3.4} color="#FFE2BE" />
  </Room>
);

// ---------------- other helpers ----------------
/** the marketing office's month chart: twelve bars, the last one red or teal as a whale wins or loses */
const MonthChart: React.FC<{ p: V3; k: number }> = ({ p, k }) => {
  const tex = useLiveTex(640, 384, (c) => {
    c.fillStyle = "#0C1A1E";
    c.fillRect(0, 0, 640, 384);
    c.fillStyle = "#3A4A50";
    c.fillRect(30, 200, 580, 3);
    for (let i = 0; i < 12; i++) {
      const h = i < 11 ? 40 + ((i * 53) % 70) : 140 * (1 - 2 * k);
      c.fillStyle = h >= 0 ? TEAL : RED;
      if (h >= 0) c.fillRect(44 + i * 47, 200 - h, 32, h);
      else c.fillRect(44 + i * 47, 203, 32, -h);
    }
  });
  return (
    <group position={p}>
      <Box w={1.3} h={0.84} d={0.06} c="#14161C" p={[0, -0.42, -0.04]} />
      <Panel map={tex} w={1.2} h={0.72} glow={1} />
    </group>
  );
};
const Bag: React.FC = () => <Box w={0.24} h={0.18} d={0.08} c="#2A2224" p={[0, -0.18, 0.02]} />;
const OfficeSeat = (p: Pose = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...p });
/** the basic-strategy card: a small grid of colour (no numbers) */
const StrategyCard: React.FC<{ p: V3 }> = ({ p }) => {
  const tex = useLiveTex(256, 320, (c) => {
    c.fillStyle = "#F1EBDD";
    c.fillRect(0, 0, 256, 320);
    const cols = ["#3F9A5A", "#C9A04A", "#B8342C", "#2F78B8"];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 8; x++) {
      c.fillStyle = cols[(x * 3 + y * 5 + (x > 4 ? 1 : 0)) % 4];
      c.fillRect(16 + x * 29, 16 + y * 29, 26, 26);
    }
  });
  return <Panel map={tex} w={0.16} h={0.2} p={p} r={[-Math.PI / 2, 0, 0.2]} glow={0.9} />;
};

const S: Record<string, ShotFn> = {
  // ---------- hook ----------
  S1: (t, len, g) => ({
    light: "stage",
    cam: glide(LOOP_CAM, cm([0.3, 1.55, 1.65], [0.02, 1.0, -0.35], 38), t, len),
    world: <HookSet g={g} k={ramp(t, 10, 40)} />,
  }),
  // ---------- 2010 ----------
  S2: (t, len, g) => ({
    light: "night",
    cam: glide(cm([1.2, 2.2, 5.2], [0, 1.6, -1.4], 38), cm([1.1, 2.15, 4.9], [0, 1.6, -1.4], 38), t, len),
    world: (
      <Casino f={g} sign="ATLANTIC CITY" table={false} lamp={4} dim={0.7}>
        <BlackjackTable />
        {[-0.6, 0, 0.6].map((x) => <Chair key={x} p={[x, 0, -0.95]} c="#4A1E22" />)}
        <Person look={CAST.dealer} pose={{ ...DEALER_AT, ry: 160, armL: REST, armR: REST, lookY: -0.3, heavy: 0.4 }} />
      </Casino>
    ),
    over: <Chip x={500} y={560} at={wd("02", "late")} text="LATE 2010" kind="pop" size={80} color={AMBER} />,
  }),
  S3: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.4, 1.6, 2.8], [0.1, 1.35, -0.6], 34), cm([0.38, 1.6, 2.65], [0.1, 1.35, -0.6], 34), t, len),
    world: (
      <Room f={g} don={null} dim={0.75}>
        {[-0.6, 0, 0.6].map((x) => <Chair key={x} p={[x, 0, -0.95]} c="#4A1E22" />)}
        <Person look={CAST.pitboss} pose={{ x: 0.3, z: -0.95, ry: -10, armL: { f: 10, e: -40, o: 6 }, armR: { f: 10, e: -40, o: 6 }, lookX: -0.4, heavy: 0.3 }} />
      </Room>
    ),
  }),
  S4: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.55, 1.6, 2.6], [0.1, 1.5, -1.2], 34), cm([0.55, 1.6, 2.45], [0.1, 1.5, -1.2], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <MonthChart p={[0.2, 2.0, -2.2]} k={ramp(g, wd("04", "decide"), wd("04", "red"))} />
        <Person look={CAST.marketer} pose={OfficeSeat({ lookY: 0.6, pitch: -6, lookX: 0.2, worry: ramp(g, wd("04", "red") - 6, wd("04", "red") + 6) * 0.6 })} />
      </Office>
    ),
  }),
  S5: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.2, 1.5, 2.6], [0, 1.25, -0.6], 34), cm([0.2, 1.5, 2.45], [0, 1.25, -0.6], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Person look={CAST.marketer} pose={OfficeSeat({ x: -0.45, armR: { f: 20, e: -140, o: 30 }, mouth: talking(g, lineEnd("05")), smile: 0.4 })} holdR={<Phone p={[0, 0.02, 0.04]} r={[0, Math.PI, 0]} s={0.8} screen="off" f={g} />} />
        <Person look={extra(51, { top: "#2A3A4A", shirt: "#F3EFE6" })} pose={OfficeSeat({ x: 0.5, armL: { f: 20, e: -140, o: 30 }, mouth: talking(g + 7, lineEnd("05")), smile: 0.3 })} holdL={<Phone p={[0, 0.02, 0.04]} r={[0, Math.PI, 0]} s={0.8} screen="off" f={g} />} />
      </Office>
    ),
  }),
  // ---------- Don ----------
  S6: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.3, 1.6, 3.4], [0, 1.65, -0.4], 34), cm([0.3, 1.6, 3.2], [0, 1.65, -0.4], 34), t, len),
    world: (
      <Void c="#1A2420">
        <LedBoard p={[0, 2.15, -1.2]} text="PHILADELPHIA PARK" w={1.6} c={AMBER} />
        <Box w={2.6} h={0.06} d={2.6} c="#2A4A2A" p={[0, 0, -0.5]} />
        <Person look={{ ...DON, hairStyle: "short" }} pose={{ z: -0.2, armL: REST, armR: { f: 60, e: -60, o: 10 }, lookY: -0.3, smile: 0.2 }} holdR={<Ticket p={[0, -0.02, 0.06]} r={[0, 0, 0]} s={0.9} />} />
        <pointLight position={[0.4, 2.6, 2.2]} intensity={7} distance={7} color="#E8F2FF" />
      </Void>
    ),
  }),
  S7: (t, len, g) => ({
    light: "warm",
    cam: cm([0.1, 1.35, 0.55], [0.0, TOP, -0.25], 34),
    world: (
      <Room f={g} sign="CASINO" dealer={null} don={{ lookY: -0.6, pitch: 10 }} dim={0.8}>
        <ChipStack p={[0, FELT, -0.28]} n={ramp(t, 4, 14) > 0 ? 1 : 0} c="#2E8B57" />
        <Card p={[-0.1, FELT, -0.18]} rank="9" flip={1} />
        <Card p={[0.08, FELT, -0.18]} rank="7" red flip={1} />
      </Room>
    ),
    over: <Chip x={500} y={300} at={wd("07", "twenty-five")} text="$25" kind="pop" size={96} color={AMBER} />,
  }),
  S8: (t, len, g) => {
    const push = ramp(t, 4, 22);
    return {
      light: "stage",
      cam: cm([0.15, 1.3, 0.45], [0.02, TOP, -0.3], 34),
      world: (
        <Room f={g} dealer={null} don={{ lookY: -0.5, pitch: 8 }}>
          <Plaque p={[0.02, FELT, -0.52 + push * 0.24]} n={3} />
        </Room>
      ),
      over: <Chip x={500} y={300} at={wd("08", "hundred")} text="$100,000" kind="pop" size={92} color={AMBER} />,
    };
  },
  S9: (t, len, g) => {
    const signAt = wd("09", "terms") - at("S9");
    return {
      light: "stage",
      cam: glide(cm([0.45, 1.6, 2.4], [0.1, 1.15, -0.5], 34), cm([0.42, 1.6, 2.28], [0.1, 1.15, -0.5], 34), t, len),
      world: (
        <Room f={g} dealer={null} don={{ ...ARMS_X, lookX: 0.5, smirk: 0.3 }}>
          <Contract p={[0.32, FELT, -0.2]} r={[0, -0.3, 0]} sign={ramp(t, signAt - 6, signAt + 14)} />
          <Person look={CAST.pitboss} pose={{ x: 0.75, z: 0.2, ry: 200, lean: 18, armL: REST, armR: { f: 70, e: -40, o: 10 }, lookY: -0.6, pitch: 10 }} />
        </Room>
      ),
    };
  },
  // ---------- the rules ----------
  S10: (t, len, g) => ({
    light: "stage",
    cam: cm([-0.12, 1.55, 1.0], [-0.12, TOP, 0.12], 34),
    world: (
      <Room f={g} don={null} dealer={null}>
        {Array.from({ length: 6 }, (_, i) => (
          <group key={i} visible={t >= i * 3}>
            {Array.from({ length: 7 }, (_, k) => <Card key={k} p={[-0.32 + (i % 3) * 0.2, FELT + k * 0.005, 0.0 + Math.floor(i / 3) * 0.28]} r={[0, 0.05 * i, 0]} />)}
          </group>
        ))}
      </Room>
    ),
    over: <Chip x={500} y={300} at={wd("10", "six")} text="6 DECKS" kind="pop" size={86} color={AMBER} />,
  }),
  S11: (t, len, g) => {
    const flipAt = wd("11", "soft") - at("S11") - 6;
    return {
      light: "stage",
      cam: cm([-0.05, 1.3, 0.75], [-0.05, TOP, 0.12], 34),
      world: (
        <Room f={g} don={null} dealer={{ armR: { f: 55, e: -40, o: 10 }, lookY: -0.6 }}>
          <Card p={[-0.14, FELT + Math.sin(ramp(t, flipAt, flipAt + 10) * Math.PI) * 0.06, 0.15]} rank="A" flip={ramp(t, flipAt, flipAt + 10)} s={1.2} />
          <Card p={[0.06, FELT, 0.15]} rank="6" red flip={1} s={1.2} />
        </Room>
      ),
      over: <Chip x={500} y={300} at={wd("11", "seventeen")} text="STAND ON SOFT 17" kind="pop" size={64} color={TEAL} />,
    };
  },
  S12: (t, len, g) => {
    const s1 = ramp(t, 4, 14);
    const s2 = ramp(t, 22, 32);
    return {
      light: "stage",
      cam: cm([0.0, 1.32, 0.42], [0.0, TOP, -0.3], 34),
      world: (
        <Room f={g} dealer={null} don={{ lookY: -0.6, pitch: 10 }}>
          <Card p={[-0.1 - s1 * 0.08 - s2 * 0.06, FELT, -0.3]} rank="A" flip={1} s={1.1} />
          <Card p={[0.0 + s1 * 0.1 - s2 * 0.04, FELT, -0.3]} rank="A" red flip={1} s={1.1} />
          {s2 > 0 ? <Card p={[0.04 + s2 * 0.18, FELT, -0.3]} rank="A" flip={1} s={1.1} /> : null}
        </Room>
      ),
    };
  },
  S13: (t, len, g) => {
    const level = ramp(g, at("S13") + 6, wd("13", "quarter"));
    return {
      light: "stage",
      cam: glide(cm([0.05, 1.45, 2.4], [0.05, 1.08, 0], 36), cm([0.05, 1.45, 2.28], [0.05, 1.08, 0], 36), t, len),
      world: (
        <Void>
          <Box w={1.4} h={TOP} d={0.7} c="#3A2216" p={[0, 0, 0]} />
          <Balance p={[0, TOP, 0.05]} tilt={0.9 * (1 - level) + 0.04} left={<group scale={0.26}><ChipHill k={1} cols={2} rows={2} max={20} seed={3} /></group>} right={<group scale={0.26}><ChipHill k={1} cols={2} rows={2} max={18} seed={6} /></group>} />
          <pointLight position={[0, 2.4, 1.8]} intensity={6} distance={6} color="#FFE6C0" />
        </Void>
      ),
      over: <Chip x={500} y={300} at={wd("13", "quarter")} text="0.25%" kind="pop" size={100} color={AMBER} />,
    };
  },
  // ---------- the discount ----------
  S14: (t, len, g) => ({
    light: "stage",
    cam: cm([0.0, TOP + 0.75, -0.05], [0.0, TOP, -0.3], 34),
    world: (
      <Room f={g} don={null} dealer={null}>
        <Contract p={[0, FELT, -0.3]} hi={ramp(t, 4, 6) > 0 ? 4 : -1} />
      </Room>
    ),
  }),
  S15: (t, len, g) => {
    const rake = ramp(g, wd("15", "half"), wd("15", "half") + 20);
    const back = ramp(g, wd("15", "twenty") - 4, wd("15", "twenty") + 14);
    return {
      light: "stage",
      cam: glide(cm([0.3, 1.75, 1.7], [-0.1, TOP, -0.2], 34), cm([0.3, 1.75, 1.6], [-0.1, TOP, -0.2], 34), t, len),
      world: (
        <Room f={g} don={{ lookY: -0.6, pitch: 8 }} dealer={{ armR: { f: 70, e: -20, o: 12 } }}>
          <ChipHill p={[0.0 - rake * 0.55, FELT, -0.3 + rake * 0.6]} k={1} cols={4} rows={2} max={22} seed={4} />
          <ChipHill p={[-0.55 + back * 0.6, FELT, 0.3 - back * 0.55]} k={back > 0 ? 0.6 : 0} cols={2} rows={1} max={22} seed={11} />
        </Room>
      ),
      over: (
        <>
          <Chip x={500} y={300} at={wd("15", "half")} text="> $500,000" kind="pop" size={72} color={RED} out={wd("15", "twenty") - 2} />
          <Chip x={500} y={300} at={wd("15", "twenty")} text="20% BACK" kind="pop" size={84} color={TEAL} />
        </>
      ),
    };
  },
  S16: (t, len, g) => {
    const go = ramp(t, 2, 22);
    const back = ramp(g, wd("16", "two") - 2, wd("16", "two") + 14);
    return {
      light: "stage",
      cam: cm([0.0, 1.85, 0.9], [-0.15, TOP, -0.05], 34),
      world: (
        <Room f={g} don={null} dealer={null}>
          <ChipHill p={[0.1 - go * 0.6, FELT, -0.25 + go * 0.5]} k={1} cols={5} rows={2} max={26} seed={7} />
          <ChipHill p={[-0.5 + back * 0.55, FELT, 0.25 - back * 0.45]} k={back > 0 ? 1 : 0} cols={1} rows={2} max={26} seed={13} />
        </Room>
      ),
      over: <Chip x={500} y={300} at={wd("16", "two")} text="$200,000" kind="pop" size={90} color={TEAL} />,
    };
  },
  S17: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.2, 1.42, 1.5], [0, 1.25, -0.6], 32), cm([0.2, 1.42, 1.42], [0, 1.25, -0.6], 32), t, len),
    world: <Room f={g} dealer={null} don={{ shrug: ramp(t, 8, 18) * 0.5 - ramp(t, 24, 34) * 0.5, smile: 0.15, lookX: 0.2 }} />,
  }),
  S18: (t, len, g) => {
    const push = ramp(t, 4, 24);
    return {
      light: "stage",
      cam: glide(cm([0.35, 1.6, 2.0], [0, 1.0, -0.4], 34), cm([0.35, 1.6, 1.9], [0, 1.0, -0.4], 34), t, len),
      world: (
        <Room f={g} don={{ smile: ramp(t, 16, 26) * 0.5, lookY: -0.4 }} dealer={{ armR: { f: 80, e: -10, o: 14 }, lean: 10 }}>
          <ChipHill p={[-0.4 + push * 0.42, FELT, 0.15 - push * 0.45]} k={1} cols={4} rows={2} max={24} seed={9} />
        </Room>
      ),
    };
  },
  // ---------- the money ----------
  S19: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.9, 2.2, 4.2], [0, 1.75, -1.2], 36), cm([0.85, 2.15, 4.0], [0, 1.75, -1.2], 36), t, len),
    world: (
      <Room f={g} sign="CAESARS" dealer={{}} don={{ lookY: -0.4 }}>
        <ChipHill p={[0.3, FELT, -0.35]} k={ramp(t, 0, 50)} cols={4} rows={2} max={24} seed={5} />
      </Room>
    ),
    over: <Chip x={500} y={560} at={wd("19", "four")} text="$4.2M" kind="pop" size={96} color={AMBER} />,
  }),
  S20: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([-0.9, 2.2, 4.2], [0, 1.75, -1.2], 36), cm([-0.85, 2.15, 4.0], [0, 1.75, -1.2], 36), t, len),
    world: (
      <Room f={g} sign="BORGATA" dealer={{}} don={{ lookY: -0.4, smirk: 0.3 }}>
        <ChipHill p={[0.3, FELT, -0.35]} k={ramp(t, 0, 40)} cols={4} rows={2} max={26} seed={6} />
      </Room>
    ),
    over: <Chip x={500} y={560} at={wd("20", "five")} text="$5M" kind="pop" size={96} color={AMBER} />,
  }),
  S21: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.2, 2.0, 3.8], [0, 1.7, -1.0], 38), cm([0.2, 1.95, 3.6], [0, 1.7, -1.0], 38), t, len),
    world: (
      <Room f={g} sign="TROPICANA" dealer={{}} don={{ lookY: -0.4 }}>
        <ChipHill p={[0.3, FELT, -0.35]} k={ramp(t, 0, len)} cols={4} rows={2} max={30} seed={2} />
        <group position={[0, 0, -2.1]}>
          <Crowd g={g} n={10} z0={0} seed={41} spread={1.6} cheer={ramp(t, 40, 70) * 0.6} />
        </group>
      </Room>
    ),
    over: (
      <>
        <Chip x={500} y={560} at={wd("21", "five")} text="$5.8M" kind="pop" size={96} color={AMBER} />
        <Chip x={500} y={690} at={wd("21", "twelve")} text="12 HOURS" kind="slide" size={64} color={TEAL} />
      </>
    ),
  }),
  S22: (t, len, g) => {
    const push = ramp(t, 20, 40);
    return {
      light: "stage",
      cam: cm([0.0, 1.55, 0.55], [0.0, TOP, -0.3], 34),
      world: (
        <Room f={g} dealer={null} don={{ lookY: -0.6, pitch: 10 }}>
          {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
            <group key={x}>
              <Card p={[x - 0.03, FELT, -0.42]} rank="8" red={i % 2 === 0} flip={1} s={0.8} />
              <Card p={[x + 0.03, FELT, -0.38]} rank={["3", "2", "3", "2"][i]} red={i % 2 === 1} flip={1} s={0.8} />
              <Plaque p={[x, FELT, -0.22]} n={2} />
              <Plaque p={[x - 0.3 + push * 0.3, FELT, 0.1 - push * 0.28]} n={push > 0 ? 2 : 0} />
            </group>
          ))}
        </Room>
      ),
      over: <Chip x={500} y={300} at={wd("22", "eight")} text="$800,000" kind="pop" size={92} color={AMBER} />,
    };
  },
  S23: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.34, 2.5], [0.02, 1.2, -0.75], 32), cm([0.42, 1.34, 2.35], [0.02, 1.2, -0.75], 32), t, len),
    world: (
      <Office f={g} night plate="">
        <Person look={CAST.pitboss} pose={OfficeSeat({ z: -0.78, ...act(t, [[0, { armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, worry: 0.3 }], [16, { armL: { f: 120, e: -130, o: 30 }, armR: { f: 120, e: -130, o: 30 }, worry: 0.8, pitch: 10, lookY: -0.4 }]]) })} />
      </Office>
    ),
  }),
  // ---------- banned ----------
  S24: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.3, 1.7, 2.3], [0.1, 1.05, -0.4], 36), cm([0.3, 1.7, 2.18], [0.1, 1.05, -0.4], 36), t, len),
    world: (
      <Room f={g} dealer={null} don={{ smile: 0.25, lookY: -0.3 }}>
        <ChipHill p={[0.0, FELT, -0.32]} k={1} cols={6} rows={3} max={30} seed={10} />
      </Room>
    ),
    over: <Chip x={500} y={300} at={wd("24", "fifteen")} text="$15M" kind="pop" size={100} color={AMBER} />,
  }),
  S25: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.6, 2.6], [0, 1.3, -0.6], 34), cm([0.28, 1.6, 2.45], [0, 1.3, -0.6], 34), t, len),
    world: (
      <CashCage sign="CAESARS" shutter={ramp(g, wd("25", "bans") - 4, wd("25", "bans") + 8)}>
        <Person look={DON} pose={{ x: 0.75, z: 0.95, ry: 210, armL: REST, armR: REST }} />
      </CashCage>
    ),
  }),
  S26: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.9, 1.7, 3.0], [0, 1.45, -1.4], 36), cm([0.86, 1.7, 2.85], [0, 1.45, -1.4], 36), t, len),
    world: (
      <Void c="#101418">
        <Box w={6} h={0.04} d={6} c="#22262C" p={[0, 0, 0]} />
        <Box w={2.6} h={3.2} d={0.2} c="#2A2420" p={[0, 0, -3.0]} />
        <Box w={1.2} h={2.2} d={0.06} c="#3A2A1E" p={[0, 0, -2.88]} o={{ e: "#FFD08A", ei: 0.5 }} />
        <Person look={CAST.agent} pose={{ x: 0.55, z: -2.3, armL: REST, armR: { f: 70, e: -10, o: 30 }, yaw: Math.sin(t * 0.3) * 12 * ramp(t, 6, 12), lookX: -0.3 }} />
        <Person look={DON} pose={{ x: -0.3, z: -1.5, ry: 160, armL: REST, armR: REST }} holdL={<Bag />} />
        <pointLight position={[0, 2.4, -1.8]} intensity={5} distance={5} color="#FFD6A0" />
        <pointLight position={[1.5, 3, 1]} intensity={2} distance={6} color="#9EC8E0" />
      </Void>
    ),
  }),
  // ---------- the twist ----------
  S27: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.16, 1.4, 1.0], [0, 1.24, -0.82], 30), cm([0.16, 1.4, 0.92], [0, 1.24, -0.82], 30), t, len),
    world: <Room f={g} dealer={null} don={{ lookY: -0.6, pitch: 10, lookX: Math.sin(t * 0.2) * 0.2, brow: 0.2 }} />,
  }),
  S28: (t, len, g) => ({
    light: "stage",
    cam: cm([0.16, 1.4, 0.92], [0, 1.25, -0.82], 30),
    world: <Room f={g} dealer={null} don={act(t, [[0, { lookY: -0.6, pitch: 10 }], [8, { lookY: 0, pitch: 0, blink: 0, smirk: 0.2 }]])} />,
  }),
  S29: (t, len, g) => ({
    light: "stage",
    cam: cm([0.1, 1.4, 0.4], [0.05, TOP, -0.3], 34),
    world: (
      <Room f={g} dealer={null} don={{ lookY: -0.6, pitch: 10 }}>
        <StrategyCard p={[0.22, FELT, -0.32]} />
        <Card p={[-0.1, FELT, -0.3]} rank="K" flip={1} />
        <Card p={[0.05, FELT, -0.28]} rank="6" red flip={1} />
      </Room>
    ),
  }),
  S30: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.2, 1.42, 1.4], [0, 1.28, -0.6], 32), cm([0.2, 1.42, 1.32], [0, 1.28, -0.6], 32), t, len),
    world: <Room f={g} dealer={null} don={act(t, [[0, { armR: { f: 42, e: -52, o: 8 } }], [12, { armR: { f: 120, e: -140, o: 30 }, smirk: 0.3 }], [34, { armR: { f: 120, e: -140, o: 30 }, yaw: 0, smirk: 0.3 }], [44, { armR: { f: 42, e: -52, o: 8 }, yaw: 0 }]])} />,
  }),
  S31: (t, len, g) => {
    const hit = lineEnd("31") - 6;
    const k = interpolate(g, [hit - 9, hit - 1, hit + 6, hit + 16], [0, 1, 1, 0], CLAMP);
    return {
      light: "stage",
      cam: cm([0, TOP + 1.7, 0.35], [0, TOP, -0.03], 34),
      world: (
        <Room f={g} don={null} dealer={null}>
          <Contract p={[0, FELT, -0.06]} sign={1} />
          <Stamp p={[0.0, TOP + 0.012, 0.0]} k={k} word="HOUSE" printed={g >= hit - 1} />
        </Room>
      ),
    };
  },
  S32: (t, len, g) => {
    const take = ramp(t, 6, 30);
    return {
      light: "stage",
      cam: glide(cm([0.35, 1.6, 2.2], [0.1, 1.1, -0.4], 34), cm([0.33, 1.6, 2.08], [0.1, 1.1, -0.4], 34), t, len),
      world: (
        <Room f={g} dealer={null} don={{ ...ARMS_X, lookX: 0.5 }}>
          <Contract p={[0.3 + take * 0.4, TOP + 0.008 + take * 0.3, -0.2 + take * 0.4]} r={[take * 0.8, -0.3, 0]} sign={1} />
          <Person look={CAST.pitboss} pose={{ x: 0.8, z: 0.25, ry: 200, armL: REST, armR: { f: 60 + take * 30, e: -40, o: 10 }, lookY: -0.3, brow: 0.3 }} />
        </Room>
      ),
    };
  },
  S33: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.3, 1.55, 1.9], [0.02, 1.0, -0.35], 38), LOOP_CAM, t, len),
    world: <HookSet g={g} k={0} />,
  }),
};

const ROOMS = [
  ["S1", "S3", "sfx/synth/room-casino.wav"],
  ["S4", "S5", "sfx/synth/room-office.wav"],
  ["S7", "S22", "sfx/synth/room-casino.wav"],
  ["S23", "S23", "sfx/synth/room-office.wav"],
  ["S24", "S25", "sfx/synth/room-casino.wav"],
  ["S27", "S33", "sfx/synth/room-casino.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence after "twenty percent", after "No." and after "wrote it into the deal themselves", low under the last line
  const duck = (g: number) =>
    interpolate(
      g,
      [lineEnd("15") - 4, lineEnd("15") + 2, lineStart("16") + 4, lineStart("16") + 16, lineEnd("27"), lineEnd("28") + 2, lineStart("29") + 4, lineStart("29") + 18, lineEnd("31") - 4, lineEnd("31") + 2, lineStart("32") + 4, lineStart("32") + 16, lineStart("33"), lineStart("33") + 12],
      [1, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0.35],
      CLAMP,
    );
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="don-johnson" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S1") + 10} level={-24} seconds={1} />
      <Sfx file="sfx/synth/chip-stack.wav" at={at("S8") + 18} level={-27} align="onset" />
      <Sfx file="sfx/synth/card-shuffle.wav" at={at("S10")} level={-22} seconds={1} />
      <Sfx file="sfx/synth/card-flick.wav" at={wd("11", "soft") - 6} level={-27} align="onset" />
      <Sfx file="sfx/synth/card-flick.wav" at={at("S12") + 22} level={-27} align="onset" />
      <Sfx file="sfx/synth/chip-stack.wav" at={lineEnd("15") + 4} level={-20} align="onset" />
      <Sfx file="sfx/synth/chip-stack.wav" at={at("S18") + 18} level={-21} align="onset" />
      <Sfx file="sfx/synth/chip-stack.wav" at={at("S22") + 36} level={-27} align="onset" />
      <Sfx file="sfx/synth/shutter-down.wav" at={wd("25", "bans") - 4} level={-16} seconds={1.4} />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("28") + 3} level={-24} align="onset" />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("31") - 6} level={-22} align="onset" />
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S32") + 6} level={-24} seconds={1} />
    </Episode>
  );
};

/** 9:16 thumbnail: Don behind the table with the terms in front of him; the money and the trick. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" post={{ bloom: 0.15 }} cam={cm([0.25, 1.62, 1.7], [0.02, 1.2, -0.4], 40)} over={<ThumbText top="$15 MILLION" bottom="NO CARD COUNTING" size={80} y={230} />}>
    <HookSet g={0} k={0.6} />
  </Shot3D>
);
