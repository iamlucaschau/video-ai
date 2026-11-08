/**
 * NEON ODDS ep02 · tipton-lottery. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-tipton-lottery-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * The draw room is shot through its glass from +z: faces stay on the key light, the teal rim stays behind them.
 * Numbers rolling on the computers are illustration, never the real draw.
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Crowd, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, Box, Cctv, Chip, ctex, glide, Panel, Person, type Pose, Shot3D, signTex, SIT, talk, type V3 } from "../../../Style Library/N-low-poly/lowpoly";
import { CeilingCam, Chair, Clock, Coin, Crt, Folder, LedBoard, PressHand, RngRack, Stamp, Ticket, WallCalendar } from "../../../Style Library/N-low-poly/props";
import { CAST, Chamber, CoinTower, DrawRoom, GLASS_Z, Interview, Kiosk, Office, Studio, Void } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/tipton-lottery.timing.json";
import rawWords from "../../../src/voiceover/tipton-lottery.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, sec, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/tipton-lottery.mp3";

const AMBER = "#FFB347";
const TEAL = "#62D2DC";
const CCTV = "grayscale(0.85) sepia(0.2) contrast(1.08) brightness(0.98)";
const DESK_Y = 0.77;
const TYPE = { f: 50, e: -50, o: 8 };
const TYPE2 = { f: 56, e: -44, o: 8 };
const REST = { o: 8 };
const talking = (g: number, end: number) => talk(g, g < end - 3);

/** seated at the console in the draw room */
const TiptonSeated: React.FC<{ pose?: Pose; g: number }> = ({ pose, g }) => (
  <Person look={CAST.tipton} pose={{ z: -0.92, ...SIT, armL: Math.floor(g / 7) % 2 ? TYPE : TYPE2, armR: Math.floor(g / 7) % 2 ? TYPE2 : TYPE, lookY: -0.5, pitch: 6, ...pose }} />
);
const Official: React.FC<{ pose?: Pose }> = ({ pose }) => <Person look={CAST.official} pose={{ armL: REST, armR: REST, ...pose }} />;
const OfficeSeat = (p: Pose = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...p });
const DeskLight: React.FC = () => <pointLight position={[0.2, 2.0, 0.6]} intensity={1.4} distance={3} color="#FFE6C0" />;
/** straight down on a desk, for the paper shots */
const topCam = (y: number, fov = 34, z = 0.32) => cm([0, DESK_Y + y, z], [0, DESK_Y, 0.02], fov);

// ---------------- first and last picture (the loop) ----------------
const LOOP_CAM = cm([0.02, 1.36, 2.4], [0.02, 1.34, -0.9], 36);
const LOOP_POSE: Pose = { lookY: 0, pitch: 0, smirk: 0.6, browL: 0.5, blink: 0 };

const S: Record<string, ShotFn> = {
  S1: (t, len, g) => ({
    light: "stage",
    cam: glide(LOOP_CAM, cm([0.02, 1.36, 2.2], [0.02, 1.34, -0.9], 36), t, len),
    world: (
      <DrawRoom f={g} fixed={ramp(g, wd("01", "winning") - 6, wd("01", "winning"))}>
        <TiptonSeated g={g} pose={act(t, [[0, LOOP_POSE], [14, { lookY: -0.5, pitch: 6, smirk: 0.3, armL: TYPE, armR: TYPE2 }], [len - 18, { lookY: -0.5, pitch: 6, smirk: 0.3, armL: TYPE, armR: TYPE2 }], [len - 4, { ...LOOP_POSE, armL: TYPE, armR: TYPE2 }]])} />
      </DrawRoom>
    ),
  }),
  S2: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.05, 1.6, 4.3], [0.05, 1.42, -0.6], 36), cm([0.05, 1.6, 4.0], [0.05, 1.42, -0.6], 36), t, len),
    world: (
      <DrawRoom f={g}>
        <TiptonSeated g={g} />
        <Official pose={{ x: 1.2, z: 2.0, ry: 200 }} />
      </DrawRoom>
    ),
    over: <Chip x={500} y={300} at={lineStart("02")} text="EDDIE TIPTON" kind="slide" size={70} />,
  }),
  S3: (t, len, g) => {
    const shut = ramp(g, wd("03", "locked") - 8, wd("03", "locked") + 4);
    return {
      light: "stage",
      cam: cm([0.2, 1.26, 3.0], [0.24, 1.14, GLASS_Z], 28),
      world: (
        <DrawRoom f={g} door={1 - shut}>
          <TiptonSeated g={g} />
          <Box w={0.14} h={0.26} d={0.05} c="#C8A23C" p={[0.46, 1.0, GLASS_Z + 0.03]} o={{ metal: 0.7, rough: 0.3 }} />
          <Box w={0.05} h={0.05} d={0.012} c={shut >= 1 ? "#FF3B30" : "#5CFF8A"} p={[0.46, 1.18, GLASS_Z + 0.06]} o={{ e: shut >= 1 ? "#FF3B30" : "#5CFF8A", ei: 3 }} shadow={false} />
          <PressHand p={[0.5 + (1 - shut) * 0.1, 1.1, GLASS_Z + 0.12]} r={[0.35, 0, -1.3]} sleeve={CAST.official.top} skin={CAST.official.skin} />
        </DrawRoom>
      ),
    };
  },
  S4: (t, len, g) => ({
    light: "stage",
    post: { bloom: 0.06 },
    cam: cm([0.12, 1.66, 1.75], [0, 1.96, 0], 30),
    world: (
      <DrawRoom f={g} glass={false}>
        <CeilingCam p={[0, 2.0, 0]} pitch={0.25} f={g} s={1.7} />
      </DrawRoom>
    ),
  }),
  S5: (t, len, g) => {
    const pull = ramp(g, wd("03", "internet") - 10, wd("03", "internet") + 2);
    return {
      light: "stage",
      post: { bloom: 0.06 },
      cam: cm([0.42, 1.16, 0.0], [0.42, 0.98, -1.05], 34),
      world: (
        <DrawRoom f={g} glass={false}>
          <pointLight position={[0.42, 1.6, -0.2]} intensity={0.7} distance={2.4} color="#FFE6C0" />
          <Box w={0.26} h={0.16} d={0.03} c="#3A4048" p={[0.42, 0.9, -1.04]} />
          <Box w={0.13} h={0.08} d={0.16} c="#B89A2C" p={[0.42, 0.94, -0.95 + pull * 0.24]} />
          <Box w={0.035} h={0.035} d={0.7} c="#B89A2C" p={[0.42, 0.96 - pull * 0.02, -0.5 + pull * 0.24]} shadow={false} />
          <PressHand p={[0.5, 0.99, -0.86 + pull * 0.24]} r={[0.4, 0, -1.2]} sleeve={CAST.official.top} skin={CAST.official.skin} />
        </DrawRoom>
      ),
    };
  },
  S6: (t, len, g) => {
    const from = wd("04", "flipped") - 3;
    const k = ramp(g, from, from + 24);
    const hand: V3 = [0.2, 1.22, -0.05];
    const y = hand[1] + Math.sin(k * Math.PI) * 0.72;
    return {
      light: "stage",
      cam: glide(cm([0, 1.5, 3.2], [0, 1.5, -0.6], 36), cm([0, 1.5, 3.0], [0, 1.5, -0.6], 36), t, len),
      world: (
        <DrawRoom f={g}>
          <Official pose={{ z: -0.05, smile: 0.2, lookY: k > 0 && k < 1 ? 0.8 : 0, armL: REST, armR: act(g - from, [[-6, { armR: { f: 46, e: -90, o: 4 } }], [0, { armR: { f: 80, e: -70, o: 4 } }], [14, { armR: { f: 46, e: -90, o: 4 } }]]).armR }} />
          <Coin p={[hand[0], y, hand[2] + 0.1]} spin={k * 22} s={2.2} />
        </DrawRoom>
      ),
    };
  },
  S7: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.1, 1.5, 2.85], [0.05, 1.32, -0.3], 34), cm([0.1, 1.5, 2.7], [0.05, 1.32, -0.3], 34), t, len),
    world: (
      <DrawRoom f={g} glass={false}>
        <Person
          look={CAST.tipton}
          pose={{ z: 0.1, ...act(t, [[0, { smile: 0.2, armL: REST, armR: { f: 84, e: -74, o: 10 } }], [len * 0.55, { smile: -0.2, shrug: 1, brow: 0.9, armL: { f: 16, e: -60, o: 24 }, armR: { f: 84, e: -74, o: 10 } }]]) }}
          holdR={<Ticket p={[0, -0.03, 0.04]} r={[-0.5, 0, 0]} s={2} />}
        />
      </DrawRoom>
    ),
    over: <Chip x={500} y={300} at={wd("05", "not")} text="STAFF: NO PRIZE" kind="pop" size={62} color="#FF7A6A" />,
  }),
  S8: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.05, 1.4, 2.5], [0, 1.22, -0.5], 34), cm([0.05, 1.4, 2.35], [0, 1.22, -0.5], 34), t, len),
    world: (
      <Office f={g} night plate="E. TIPTON">
        <Person look={CAST.tipton} pose={OfficeSeat({ smile: 0.3, lookX: 0, lookY: 0 })} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("06", "security")} text="SECURITY EXPERT" kind="pop" size={64} color={TEAL} />,
  }),
  S9: (t, len, g) => ({
    light: "studio",
    cam: glide(cm([0, 3.0, 7.0], [0, 1.72, 0], 30), cm([0, 3.0, 6.7], [0, 1.72, 0], 30), t, len),
    world: (
      <Studio f={g} dim={0.55}>
        <Panel map={signTex("LOTTERY SECURITY", "#0B0B10", AMBER, 1024, 200, 92)} w={2.2} h={0.43} p={[0, 2.75, -3.6]} glow={1.1} />
        <Person look={CAST.tipton} pose={{ y: 0.25, ...act(t, [[0, { armL: REST, armR: { f: 40, e: -60, o: 10 } }], [len * 0.5, { armL: REST, armR: { f: 66, e: -40, o: 16 }, brow: 0.6 }]]), mouth: talking(g, lineEnd("07")) }} />
        <Crowd g={g} n={9} z0={3.1} seed={72} spread={0.42} pose={{ ry: 180 }} />
      </Studio>
    ),
  }),
  S10: (t, len, g) => ({
    light: "stage",
    post: { bloom: 0.08 },
    cam: glide(cm([0.2, 1.74, 3.2], [0.1, 1.64, -1.1], 34), cm([0.2, 1.74, 3.0], [0.1, 1.64, -1.1], 34), t, len),
    world: (
      <DrawRoom f={g}>
        <Clock p={[0.02, 2.3, -1.58]} h={10 + ramp(t, 14, len) * 1} r={0.3} />
        <Person look={CAST.tipton} pose={{ x: 0.1 + (1 - ramp(t, 0, 16)) * 0.5, z: -1.0, ry: 180, ...act(t, [[10, { armL: REST, armR: REST }], [24, { armL: REST, armR: { f: 150, e: -18, o: 2 } }]]) }} />
      </DrawRoom>
    ),
    over: <Chip x={500} y={300} at={wd("08", "november")} text="NOV 2010" kind="pop" size={78} color={AMBER} />,
  }),
  S11: (t, len, g) => ({
    light: "stage",
    post: { bloom: 0.06 },
    cam: cm([-0.12, 1.66, 1.65], [0, 1.96, 0], 30),
    world: (
      <DrawRoom f={g} glass={false}>
        <CeilingCam p={[0, 2.0, 0]} pitch={0.25} f={g * 7} s={1.7} />
      </DrawRoom>
    ),
  }),
  S12: (t, len, g) => {
    // the picture only moves once in a long while: each step is a jump, like a camera that keeps one second of every minute
    const step = Math.floor(t / 14);
    const SPOTS: { x: number; z: number; ry: number; pose: Pose }[] = [
      { x: 0.62, z: 0.5, ry: 200, pose: {} },
      { x: 0.1, z: -0.65, ry: 180, pose: { armR: { f: 60, e: -40, o: 8 } } },
      { x: -0.5, z: -0.72, ry: 170, pose: { armL: { f: 70, e: -30, o: 8 } } },
      { x: -0.5, z: -0.72, ry: 180, pose: {} },
      { x: 0.66, z: -0.72, ry: 180, pose: { armR: { f: 70, e: -30, o: 8 } } },
      { x: 0.2, z: 0.1, ry: 10, pose: {} },
    ];
    const a = SPOTS[Math.min(step, SPOTS.length - 1)];
    return {
      light: "cool",
      filter: CCTV,
      cam: cm([-1.05, 2.5, 1.95], [0.1, 0.9, -0.6], 44),
      world: (
        <DrawRoom f={step * 11} glass={false}>
          <Person look={CAST.tipton} pose={{ x: a.x, z: a.z, ry: a.ry, armL: REST, armR: REST, ...a.pose }} />
        </DrawRoom>
      ),
      over: (
        <>
          <Cctv cam="CAM 2" />
          <Chip x={500} y={430} at={wd("10", "one")} text="1 SEC / MIN" kind="pop" size={78} color={AMBER} />
        </>
      ),
    };
  },
  S13: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.5, 3.4], [0, 1.36, -0.5], 34), cm([0, 1.5, 3.2], [0, 1.36, -0.5], 34), t, len),
    world: (
      <DrawRoom f={g} glass={false}>
        <TiptonSeated g={g} />
        <Official pose={{ x: -0.34, z: 0.3, yaw: 8, smile: 0.2, ...act(g - lineStart("12"), [[0, { pitch: 0 }], [8, { pitch: 8 }], [16, { pitch: 0 }]]) }} />
        <Person look={{ ...CAST.clerk, top: "#2E5A6A" }} pose={{ x: 0.36, z: 0.3, yaw: -6, armL: { f: 30, e: -80, o: 6 }, armR: REST, lookY: -0.2 }} />
      </DrawRoom>
    ),
  }),
  // ---------- the ticket ----------
  S14: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.1, 1.9, 4.2], [0.05, 1.86, -1.2], 36), cm([0.1, 1.9, 3.95], [0.05, 1.86, -1.2], 36), t, len),
    world: (
      <Kiosk f={g} sign="STORE" board="HOT LOTTO" clerk={{ smile: 0.3, armL: { f: 50, e: -30, o: 4 }, armR: REST }}>
        <Person look={CAST.tipton} pose={{ x: 0.3, z: 0.1, ry: 180, armL: REST, armR: { f: 44, e: -30, o: 4 } }} />
        <Ticket p={[0.2, 1.08, -0.92 + ramp(t, 10, 26) * 0.2]} s={1.3} />
      </Kiosk>
    ),
    over: <Chip x={500} y={660} at={wd("13", "thirty-three")} text="33 DAYS" kind="pop" size={80} color={AMBER} />,
  }),
  S15: (t, len, g) => {
    const lock = ramp(g, wd("14", "jackpot") - 6, wd("14", "jackpot"));
    return {
      light: "stage",
      cam: cm([-0.42, 1.34, 0.42], [-0.42, 1.26, -1.3], 30),
      world: (
        <DrawRoom f={g} glass={false} fixed={lock}>
          <Official pose={{ x: 0.1, z: -0.5, yaw: -24, lookX: -0.7 }} />
        </DrawRoom>
      ),
      over: <Chip x={500} y={300} at={wd("14", "six")} text="6 DAYS" kind="pop" size={70} color={TEAL} out={wd("14", "jackpot")} />,
    };
  },
  S16: (t, len, g) => {
    const k = ramp(g, lineStart("15") - 2, wd("15", "dollars"));
    return {
      light: "night",
      cam: glide(cm([2.3, 1.9, 3.5], [2.3, 1.78, -2.84], 36), cm([2.3, 1.9, 3.3], [2.3, 1.78, -2.84], 36), t, len),
      world: (
        <Kiosk f={g} sign="STORE" jackpot={Math.round(16500000 * k / 100000) * 100000} clerk={null} />
      ),
    };
  },
  S17: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.82, 3.6], [0.3, 1.74, -1], 34), cm([0.3, 1.82, 3.4], [0.3, 1.74, -1], 34), t, len),
    world: <Office f={g} night plate="CLAIMS" clockH={10 + t * 0.25} />,
  }),
  S18: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.05, 1.4, 2.5], [0, 1.22, -0.5], 34), cm([0.05, 1.4, 2.35], [0, 1.22, -0.5], 34), t, len),
    world: (
      <Office f={g} night plate="CLAIMS" clockH={3.2}>
        <Person look={CAST.official} pose={OfficeSeat({ armR: { f: 148, e: -130, o: 22 }, yaw: 8, lookX: 0.4, brow: 0.5, mouth: talking(g, lineEnd("17")) * 0.4 })} holdR={<Box w={0.04} h={0.2} d={0.05} c="#14161C" p={[0, -0.1, 0.03]} />} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("17", "quebec")} text="QUEBEC" kind="pop" size={80} color={TEAL} />,
  }),
  S19: (t, len, g) => ({
    light: "warm",
    cam: glide(topCam(1.9), topCam(1.84), t, len),
    world: (
      <Office f={g} night plate="CLAIMS">
        <Box w={0.54} h={0.004} d={0.3} c="#F3EAD6" p={[0, DESK_Y + 0.004, 0.04]} />
        {Array.from({ length: 15 }, (_, i) => <Box key={i} w={0.028} h={0.002} d={0.05} c={i < ramp(g, wd("18", "knew"), lineEnd("18")) * 15 ? AMBER : "#3A3030"} p={[-0.224 + i * 0.032, DESK_Y + 0.009, 0.05]} o={i < ramp(g, wd("18", "knew"), lineEnd("18")) * 15 ? { e: AMBER, ei: 1 } : undefined} shadow={false} />)}
        <DeskLight />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("18", "fifteen-digit")} text="15 DIGITS" kind="pop" size={74} color={AMBER} />,
  }),
  S20: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.02, 1.42, 2.6], [0.02, 1.26, -0.6], 34), cm([0.02, 1.42, 2.45], [0.02, 1.26, -0.6], 34), t, len),
    world: (
      <Office f={g} night plate="CLAIMS">
        <Person look={CAST.official} pose={OfficeSeat({ frown: 0.3, lookX: 0.6, lookY: -0.2, yaw: 14 + Math.sin(ramp(g, wd("19", "not") - 2, lineEnd("19")) * Math.PI * 4) * 12 })} />
        <Crt p={[0.48, DESK_Y, 0.02]} r={[0, -2.6, 0]} seed={2} f={g} />
      </Office>
    ),
  }),
  S21: (t, len, g) => ({
    light: "warm",
    cam: topCam(2.4),
    world: (
      <Office f={g} night plate="CLAIMS">
        <group position={[0, DESK_Y + 0.01, 0.03]} scale={1.5}>
          <Box w={0.2} h={0.003} d={0.28} c="#F3EAD6" p={[-0.12, 0.011, 0]} shadow={false} />
          <Folder open={0} />
        </group>
        <Panel map={signTex("BLIND TRUST", "#F3EAD6", "#3A3030", 512, 128, 56)} w={0.28} h={0.07} p={[-0.18, DESK_Y + 0.03, -0.04]} r={[-Math.PI / 2, 0, 0]} />
        <DeskLight />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("20", "belize")} text="BELIZE" kind="pop" size={80} color={TEAL} />,
  }),
  S22: (t, len, g) => {
    const put = ramp(g, wd("21", "lawyer"), wd("21", "ticket"));
    return {
      light: "warm",
      cam: glide(cm([-0.1, 1.72, 3.3], [0.1, 1.32, -0.2], 36), cm([-0.1, 1.72, 3.15], [0.1, 1.32, -0.2], 36), t, len),
      world: (
        <Office f={g} night plate="CLAIMS" clockH={11.05}>
          <Person look={CAST.official} pose={OfficeSeat({ lookY: -0.4, brow: 0.5 })} />
          <Person look={{ ...CAST.lawmaker, top: "#3A2E2A", pants: "#3A2E2A", tie: "#B8342C" }} pose={{ x: 0.46, z: 0.72, ry: 205, armL: REST, armR: { f: 20 + put * 34, e: -24, o: 2 } }} />
          <Ticket p={[0.14, DESK_Y + 0.008, 0.12]} s={1.3 * Math.min(1, put * 3)} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("21", "hour")} text="1 HOUR" kind="pop" size={80} color={AMBER} />,
    };
  },
  S23: (t, len, g) => {
    const hit = lineEnd("23") + 3;
    const k = interpolate(g, [hit - 9, hit - 1], [0, 1], CLAMP);
    return {
      light: "warm",
      cam: topCam(2.0),
      world: (
        <Office f={g} night plate="CLAIMS">
          <Box w={0.5} h={0.004} d={0.62} c="#F3EAD6" p={[0, DESK_Y + 0.004, 0.02]} />
          <Ticket p={[0, DESK_Y + 0.012, -0.14]} s={1.4} />
          <Stamp p={[0, DESK_Y + 0.012, 0.12]} k={k} word="REFUSED" printed={g >= hit - 1} />
          <DeskLight />
        </Office>
      ),
    };
  },
  // ---------- the hunt ----------
  S24: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.02, 1.62, 3.0], [0.02, 1.4, -1], 36), cm([0.02, 1.62, 2.85], [0.02, 1.4, -1], 36), t, len),
    world: (
      <Office f={g} night plate="DCI" clockH={2.4}>
        <Box w={0.76} h={0.9} d={0.03} c="#2A1A12" p={[0, 1.76, -2.28]} />
        <Panel map={signTex("?", "#14241E", AMBER, 256, 300, 230)} w={0.68} h={0.8} p={[0, 2.21, -2.26]} glow={0.95} />
        <Person look={CAST.agent2} pose={OfficeSeat({ pitch: 8, heavy: 0.6, armL: { f: 92, e: -130, o: 12 }, roll: -5, armR: { f: 45, e: -50, o: 10 } })} />
        {Array.from({ length: 5 }, (_, i) => <group key={i} position={[0.48, DESK_Y + 0.012 + i * 0.03, 0.08]} scale={1.3}><Folder open={0} r={[0, i * 0.2, 0]} /></group>)}
      </Office>
    ),
  }),
  S25: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0, 1.5, 3.5], [0, 1.42, 0], 34), cm([0, 1.5, 3.3], [0, 1.42, 0], 34), t, len),
    world: (
      <Void>
        {Array.from({ length: 9 }, (_, i) => <VideoWall key={i} p={[((i % 3) - 1) * 0.62, 0.72 + Math.floor(i / 3) * 0.56, -0.4]} t={t + i * 3} />)}
        <pointLight position={[0, 2.4, 2]} intensity={7} distance={7} color="#E8F2FF" />
        <Person look={CAST.agent2} pose={{ x: 0.2, z: 1.1, ry: 180, armL: REST, armR: { f: 40, e: -40, o: 6 } }} />
      </Void>
    ),
  }),
  S26: (t, len, g) => {
    const stop = wd("26", "maine");
    return {
      light: "warm",
      cam: glide(cm([0.04, 1.42, 2.6], [0.04, 1.26, -0.6], 34), cm([0.04, 1.42, 2.45], [0.04, 1.26, -0.6], 34), t, len),
      world: (
        <Office f={g} night plate="MAINE LOTTERY">
          <Person look={{ ...CAST.official, top: "#4A5A42", pants: "#2A2C34", tie: undefined, hair: "#8A5A3A", hairStyle: "long" }} pose={OfficeSeat(act(g - stop, [[-10, { lookX: 0.6, yaw: 14 }], [2, { lookX: 0.7, yaw: 18, lean: 8, brow: 1, mouth: 0.3 }], [20, { lookX: 0.7, yaw: 18, lean: 8, brow: 1, mouth: 0.3, armR: { f: 70, e: -20, o: -18 }, armL: { f: 45, e: -50, o: 10 } }]]))} />
          <VideoWall p={[0.46, DESK_Y + 0.02, 0.06]} t={g} ry={-2.6} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("26", "six")} text="6 DAYS" kind="pop" size={80} color={AMBER} />,
    };
  },
  S27: (t, len, g) => {
    const turn = ramp(g, wd("27", "said") - 2, wd("27", "tipton") - 2);
    return {
      light: "cool",
      filter: CCTV,
      cam: cm([0.5, 2.5, 2.3], [0, 1.28, 0], 34),
      world: (
        <Kiosk f={g} sign="STORE" clerk={{ armL: REST, armR: REST }}>
          <Person look={CAST.tipton} pose={{ x: 0, z: 0.1, ry: 180 - turn * 180, armL: REST, armR: REST, lookY: turn * 0.4, pitch: -turn * 6, blink: 0 }} />
        </Kiosk>
      ),
      over: (
        <>
          <Cctv cam="STORE" />
          <Chip x={500} y={1130} at={wd("27", "tipton") - 1} text="EDDIE TIPTON" kind="pop" size={72} color={AMBER} />
        </>
      ),
    };
  },
  S28: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.34, 2.5], [0.02, 1.16, -0.75], 32), cm([0.42, 1.34, 2.35], [0.02, 1.16, -0.75], 32), t, len),
    world: (
      <Interview f={g}>
        <Chair p={[0, 0, -0.78]} ry={0} />
        <Person look={CAST.tipton} pose={OfficeSeat({ z: -0.78, shrug: 0.4, brow: 0.5, mouth: talking(g, lineEnd("28")), armL: { f: 48, e: -56, o: 14 }, armR: { f: 48, e: -56, o: 14 } })} />
        <Person look={CAST.agent2} pose={{ x: 0.64, z: 1.05, ry: 200, armL: REST, armR: REST }} />
      </Interview>
    ),
    over: <Chip x={500} y={300} at={wd("28", "houston")} text="HOUSTON" kind="pop" size={80} color={TEAL} />,
  }),
  S29: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.1, 1.62, 3.5], [0.02, 1.52, 0.8], 32), cm([0.1, 1.62, 3.3], [0.02, 1.52, 0.8], 32), t, len),
    world: (
      <Chamber f={g}>
        <Person look={{ ...CAST.lawmaker, hair: "#D8D2C8", top: "#1A1A22", pants: "#1A1A22", tie: "#F3EFE6" }} pose={{ x: -0.5, z: -0.75, armL: { f: 24, e: -30, o: 8 }, armR: { f: 24, e: -30, o: 8 }, yaw: 8 }} />
        <Person look={{ ...CAST.tipton, top: "#23262E", shirt: "#F3EFE6", tie: "#3A3030" }} pose={{ z: 1.0, pitch: 4, lookY: -0.2, armL: REST, armR: REST, mouth: talking(g, lineEnd("29")) * 0.6 }} />
      </Chamber>
    ),
    over: <Chip x={500} y={300} at={wd("29", "twenty")} text="2017" kind="pop" size={84} color={AMBER} />,
  }),
  S30: (t, len, g) => {
    const lit = [3, 11, 19, 24].filter((_, i) => g > wd("30", "certain") + i * 8);
    return {
      light: "stage",
      cam: glide(cm([0, 1.6, 3.5], [0, 1.42, 0], 34), cm([0, 1.6, 3.35], [0, 1.42, 0], 34), t, len),
      world: (
        <Void>
          <WallCalendar p={[0, 1.42, -0.3]} s={0.6} lit={lit} />
          <RngRack p={[0, -0.36, 0.1]} w={0.62} f={g} fixed={ramp(g, wd("30", "predictable") - 8, wd("30", "predictable"))} seed={5} />
          <pointLight position={[0, 2.4, 2]} intensity={6} distance={6} color="#FFE6C0" />
        </Void>
      ),
    };
  },
  S31: (t, len, g) => {
    const y = Math.round(interpolate(g, [lineStart("31"), lineEnd("31")], [2010, 2005], CLAMP));
    return {
      light: "stage",
      cam: cm([0, 1.7, 3.6], [0, 1.72, 0], 34),
      world: (
        <Void>
          <LedBoard p={[0, 2.5, -0.5]} text={String(y)} w={1.3} c={AMBER} />
          <RngRack p={[-0.5, 0, -0.5]} f={g} seed={3} w={0.42} />
          <RngRack p={[0.5, 0, -0.5]} f={g + 2} seed={7} w={0.42} />
          <Person look={CAST.tipton} pose={{ z: 0.4, armL: REST, armR: REST, smirk: 0.3, lookX: 0, lookY: 0.3 }} />
          <pointLight position={[0.4, 2.8, 2]} intensity={8} distance={7} color="#FFE2BE" />
        </Void>
      ),
    };
  },
  S32: (t, len, g) => {
    const k = ramp(g, wd("32", "played"), lineEnd("32") - 8);
    return {
      light: "night",
      cam: glide(cm([0.02, 1.84, 4.5], [0.02, 1.72, -0.2], 34), cm([0.02, 1.84, 4.3], [0.02, 1.72, -0.2], 34), t, len),
      world: (
        <Kiosk f={g} sign="LOTTO" clerk={null}>
          <Person look={{ ...CAST.tipton, hair: "#3A3028", hairStyle: "short", top: "#6A4A34", pants: "#2A2C34" }} pose={{ x: -0.36, z: 0.1, smile: 0.5, yaw: 8, armL: REST, armR: { f: 74, e: -60, o: 4 } }} holdR={<Ticket p={[0, -0.02, 0.05]} r={[0.2, 0, 0]} s={1.2} />} />
          <Person look={{ ...CAST.lawmaker, top: "#3B6EA8", shirt: undefined, tie: undefined, pants: "#2A2C34", hair: "#1E1618", build: 1.0 }} pose={{ x: 0.4, z: 0.1, smile: 0.5, yaw: -8, armL: { f: 74, e: -60, o: 4 }, armR: REST }} holdL={<Ticket p={[0, -0.02, 0.05]} r={[0.2, 0, 0]} s={1.2} />} />
          <CoinTower p={[0.02, 0, 0.5]} h={0.1 + k * 1.0} />
        </Kiosk>
      ),
      over: <Chip x={500} y={440} at={wd("32", "two")} text="$2.2M" kind="pop" size={88} color={AMBER} />,
    };
  },
  S33: (t, len, g) => {
    const shut = ramp(g, wd("33", "sentence") - 2, wd("33", "up") + 6);
    return {
      light: "cool",
      cam: cm([0, 1.56, 3.0], [0, 1.5, 0], 32),
      world: (
        <Void c="#14181E">
          <Person look={{ ...CAST.tipton, top: "#B8742C", pants: "#B8742C" }} pose={{ z: -0.5, armL: REST, armR: REST, lookY: -0.3, pitch: 5, heavy: 0.4 }} />
          {Array.from({ length: 9 }, (_, i) => <Box key={i} w={0.03} h={2.6} d={0.03} c="#8A9096" p={[-1.5 + i * 0.13 + shut * 0.98, 0, 0.3]} o={{ metal: 0.6, rough: 0.4 }} />)}
          <pointLight position={[0.3, 2.6, 1.6]} intensity={7} distance={6} color="#E8F2FF" />
        </Void>
      ),
      over: <Chip x={500} y={300} at={wd("33", "up")} text="UP TO 25 YEARS" kind="pop" size={66} color="#FF7A6A" />,
    };
  },
  // ---------- the question ----------
  S34: (t, len, g) => ({
    light: "warm",
    cam: glide(topCam(1.02), topCam(0.98), t, len),
    world: (
      <Office f={g} night plate="CLAIMS">
        <Ticket p={[0, DESK_Y + 0.012, 0.02]} s={2.4} />
        <Box w={0.5} h={0.004} d={0.42} c="#DCEFF2" p={[0, DESK_Y + 0.02, 0.02]} o={{ op: 0.22, rough: 0.12 }} shadow={false} />
        <Box w={0.5} h={0.002} d={0.03} c={AMBER} p={[0, DESK_Y + 0.024, -0.17]} o={{ e: AMBER, ei: 1.2 }} shadow={false} />
        <DeskLight />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("34", "sixteen")} text="$16.5M" kind="pop" size={92} color={AMBER} strike={Math.max(4, lineEnd("34") - wd("34", "sixteen") - 18)} />,
  }),
  S35: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.4, 3.2], [0, 1.34, -1.3], 34), cm([0, 1.4, 3.05], [0, 1.34, -1.3], 34), t, len),
    world: (
      <DrawRoom f={g} fixed={1}>
        <Box w={0.14} h={0.26} d={0.05} c="#C8A23C" p={[0.46, 1.0, GLASS_Z + 0.03]} o={{ metal: 0.7, rough: 0.3 }} />
        <Box w={0.05} h={0.05} d={0.012} c="#FF3B30" p={[0.46, 1.18, GLASS_Z + 0.06]} o={{ e: "#FF3B30", ei: 3 }} shadow={false} />
      </DrawRoom>
    ),
  }),
  S36: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.2, 1.78, 2.7], [0.05, 1.64, 0.3], 34), cm([0.2, 1.78, 2.6], [0.05, 1.64, 0.3], 34), t, len),
    world: (
      <Kiosk f={g} sign="" clerk={null}>
        <CeilingCam p={[0.02, 2.05, 0.75]} ry={0} pitch={0.3} f={g} s={1.3} />
        <Person look={CAST.tipton} pose={{ x: -0.14, z: -0.2, armL: REST, armR: REST, lookY: 0.7, lookX: 0.4, pitch: -10, worry: 0.3, yaw: 10 }} />
      </Kiosk>
    ),
  }),
  S37: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.02, 1.36, 2.2], [0.02, 1.34, -0.9], 36), LOOP_CAM, t, len),
    world: (
      <DrawRoom f={g}>
        <TiptonSeated g={g} pose={{ ...LOOP_POSE, armL: TYPE, armR: TYPE2 }} />
      </DrawRoom>
    ),
  }),
};

// ---------------- helpers ----------------
/** a small monitor playing the store's video: a shadow at a counter */
const storeTex = () =>
  ctex("storevid", 256, 192, (c) => {
    c.fillStyle = "#4A5258";
    c.fillRect(0, 0, 256, 192);
    c.fillStyle = "#6A747A";
    c.fillRect(0, 120, 256, 72);
    c.fillStyle = "#A8B0B6";
    c.fillRect(150, 90, 90, 60);
    c.fillStyle = "#14181C";
    c.beginPath();
    c.arc(100, 66, 22, 0, 7);
    c.fill();
    c.fillRect(74, 88, 52, 80);
  });
const VideoWall: React.FC<{ p: V3; t: number; ry?: number }> = ({ p, t, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box w={0.56} h={0.46} d={0.1} c="#14161C" />
    <Panel map={storeTex()} w={0.5} h={0.38} p={[0, 0.23, 0.052]} glow={0.85 + 0.15 * Math.sin(t * 0.5)} />
  </group>
);

const ROOMS = [
  ["S1", "S7", "sfx/synth/room-interview.wav"],
  ["S8", "S8", "sfx/synth/room-office.wav"],
  ["S10", "S13", "sfx/synth/room-interview.wav"],
  ["S14", "S14", "sfx/synth/room-shop.wav"],
  ["S17", "S24", "sfx/synth/room-office.wav"],
  ["S28", "S28", "sfx/synth/room-interview.wav"],
  ["S29", "S29", "sfx/synth/room-chamber.wav"],
  ["S35", "S37", "sfx/synth/room-interview.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence after "And nobody came", around the name, and under the last question
  const duck = (g: number) =>
    interpolate(
      g,
      [lineEnd("16") - 4, lineEnd("16") + 2, lineStart("17") + 2, lineStart("17") + 18, lineEnd("27") - 18, lineEnd("27") - 8, lineEnd("27") + 14, lineStart("29"), lineEnd("36") - 4, lineEnd("36") + 8],
      [1, 0, 0, 0.8, 0.8, 0, 0, 0.7, 0.7, 0.3],
      CLAMP,
    );
  const coinAt = wd("04", "flipped") - 3;
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="tipton-lottery" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      <Sfx file="sfx/click/keyboard-click-327728.mp3" at={at("S1") + 18} level={-30} align="onset" />
      <Sfx file="sfx/click/pen-click-411629.mp3" at={wd("03", "locked") + 3} level={-24} align="onset" />
      <Sfx file="sfx/click/mouse-click-351398.mp3" at={wd("03", "internet") + 2} level={-27} align="onset" />
      <Sfx file="sfx/synth/coin-flip.wav" at={coinAt} level={-27} align="onset" />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={lineEnd("10") + 5} level={-27} align="onset" seconds={1} />
      <Sfx file="sfx/synth/card-flick.wav" at={at("S14") + 24} level={-28} align="onset" />
      <Sfx file="sfx/click/digital-click-357350.mp3" at={wd("14", "jackpot")} level={-26} align="onset" />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("15")} level={-25} align="onset" seconds={1.2} />
      <Sfx file="sfx/synth/clock-tick.wav" at={at("S17") + 2} level={-29} seconds={sec("S17", "S18")} />
      <Sfx file="sfx/synth/phone-ring.wav" at={at("S18") - 4} level={-30} seconds={1.2} />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("23") + 4} level={-24} align="onset" />
      <Sfx file="sfx/deephit/big-cinematic-impact-788.mp3" at={lineEnd("27")} level={-23} align="onset" seconds={1.6} />
      <Sfx file="sfx/synth/shutter-down.wav" at={wd("33", "up") + 6 - Math.round(1.05 * 30)} level={-27} seconds={2} />
      <Sfx file="sfx/deephit/impact-thud-291047.mp3" at={lineEnd("36")} level={-27} align="onset" seconds={1} />
    </Episode>
  );
};

/** 9:16 thumbnail: his face at the console, the numbers lit behind him; the money and the twist. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" post={{ bloom: 0.2 }} cam={cm([0.02, 1.34, 2.5], [0.02, 1.34, -0.9], 36)} over={<ThumbText top="$16.5M" bottom="INSIDE JOB" size={140} y={235} />}>
    <DrawRoom f={0} fixed={1} glass={false}>
      <TiptonSeated g={0} pose={LOOP_POSE} />
      <pointLight position={[0.9, 2, 1.8]} intensity={2.4} distance={4} color="#FFD9B8" />
    </DrawRoom>
  </Shot3D>
);
