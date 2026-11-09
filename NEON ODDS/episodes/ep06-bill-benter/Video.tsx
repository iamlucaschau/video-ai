/**
 * NEON ODDS ep06 · bill-benter. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-bill-benter-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * The racetrack (Racetrack, TRACK) is drawn at the origin; horse names, odds and the lines of bets on the screens are made up.
 * The 27th-floor office looks out over the course through a window drawn as a live 2D picture (RaceWindow).
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, alive, Box, Chip, cyl, glide, P, Panel, Person, type Pose, Shot3D, SIGN_FONT, signTex, SIT, talk, useLiveTex, type V3, walk } from "../../../Style Library/N-low-poly/lowpoly";
import { BlackjackTable, Casino, CAST, CoinTower, extra, Office, Racetrack, TRACK, trackAt, Void } from "../../../Style Library/N-low-poly/sets";
import { Book, Chair, Crt, Desk, Phone, Pile, Ticket } from "../../../Style Library/N-low-poly/props";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/bill-benter.timing.json";
import rawWords from "../../../src/voiceover/bill-benter.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/bill-benter.mp3";

const AMBER = "#FFB347";
const RED = "#FF6A5A";
const DESK_Y = 0.77;
const REST = { o: 8 };
const talking = (g: number, end: number) => talk(g, g < end - 3);
const OfficeSeat = (p: Pose = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...p });
const TYPE = { f: 50, e: -50, o: 8 };
const TYPE2 = { f: 56, e: -44, o: 8 };
const typing = (g: number) => (Math.floor(g / 7) % 2 ? { armL: TYPE, armR: TYPE2 } : { armL: TYPE2, armR: TYPE });
const MATE = extra(64, { top: "#2E3440", shirt: "#F3EFE6", hairStyle: "short", glasses: true });
/** racing speed along the oval, radians per frame */
const SPEED = 0.009;

// ---------------- the 27th floor ----------------
/** the view from the office: towers, the floodlit oval, horses as dots going round (`f` drives them) */
const RaceWindow: React.FC<{ p: V3; w: number; h: number; f: number }> = ({ p, w, h, f }) => {
  const tex = useLiveTex(768, 432, (c) => {
    c.fillStyle = "#0A1018";
    c.fillRect(0, 0, 768, 432);
    for (let i = 0; i < 14; i++) {
      const bx = i * 56 + ((i * 37) % 20);
      const bh = 120 + ((i * 53) % 160);
      c.fillStyle = "#121820";
      c.fillRect(bx, 432 - bh - 120, 46, bh);
      for (let y = 0; y < bh - 10; y += 14) for (let x = 4; x < 42; x += 10) {
        if ((x * 7 + y * 3 + i * 11) % 5 < 3) {
          c.fillStyle = (x + y + i) % 3 ? "rgba(255,214,150,.75)" : "rgba(160,220,235,.6)";
          c.fillRect(bx + x, 432 - bh - 120 + y + 4, 5, 6);
        }
      }
    }
    c.fillStyle = "#3F7A3A";
    c.beginPath();
    c.ellipse(384, 360, 330, 70, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#26482A";
    c.beginPath();
    c.ellipse(384, 360, 270, 46, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#F3F1EA";
    c.lineWidth = 2;
    c.stroke();
    for (let i = 0; i < 8; i++) {
      const u = f * SPEED - i * 0.07;
      c.fillStyle = ["#B8342C", "#2F78B8", "#E2B24A", "#3F9A5A", "#8A5AA8", "#F3EFE6", "#D8682A", "#1E1A22"][i];
      c.beginPath();
      c.arc(384 + Math.cos(u) * 300, 360 + Math.sin(u) * 58, 5, 0, Math.PI * 2);
      c.fill();
    }
    const gl = c.createRadialGradient(384, 330, 10, 384, 330, 380);
    gl.addColorStop(0, "rgba(255,240,200,.18)");
    gl.addColorStop(1, "rgba(255,240,200,0)");
    c.fillStyle = gl;
    c.fillRect(0, 0, 768, 432);
  });
  return (
    <group position={p}>
      <Box w={w + 0.12} h={h + 0.12} d={0.08} c="#14161C" p={[0, -(h + 0.12) / 2, -0.05]} />
      <Panel map={tex} w={w} h={h} glow={1} />
    </group>
  );
};
/** a screen with rows of bets (`n` rows lit, the rest filtered out; `win` lights one row amber) */
const BetScreen: React.FC<{ p: V3; ry?: number; f: number; n?: number; win?: number; w?: number }> = ({ p, ry = 0, f, n = 18, win = 0, w = 0.6 }) => {
  const tex = useLiveTex(512, 384, (c) => {
    c.fillStyle = "#06120E";
    c.fillRect(0, 0, 512, 384);
    for (let i = 0; i < 18; i++) {
      const lit = i < n;
      const hit = win > 0 && i === 7;
      c.fillStyle = hit ? AMBER : lit ? "#5CFF8A" : "#14281C";
      for (let k = 0; k < 9; k++) c.fillRect(16 + k * 54, 14 + i * 20, 30 + (((i * 7 + k * 3 + Math.floor(f / 3)) % 5) * 3), 9);
    }
  });
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Box w={w + 0.06} h={w * 0.75 + 0.06} d={0.05} c="#101216" p={[0, -(w * 0.375) - 0.03, -0.03]} />
      <Panel map={tex} w={w} h={w * 0.75} p={[0, 0, 0.001]} glow={1} />
    </group>
  );
};
/** the office: Benter and his associate at three screens, the race outside behind them */
const Floor27: React.FC<{ g: number; n?: number; win?: number; benter?: Pose; mate?: Pose; children?: React.ReactNode }> = ({ g, n = 18, win = 0, benter = {}, mate = {}, children }) => (
  <Office f={g} night plate="">
    <RaceWindow p={[0, 1.85, -2.22]} w={2.6} h={1.46} f={g} />
    <Desk p={[0, 0, 0.15]} w={1.6} d={0.7} c="#3A2A20" />
    {[-0.5, 0, 0.5].map((x, i) => <BetScreen key={x} p={[x, DESK_Y + 0.2, 0.3]} ry={Math.PI + (i - 1) * -0.25} f={g + i * 5} n={n} win={win} w={0.4} />)}
    <Person look={CAST.benter} pose={OfficeSeat({ x: -0.24, z: -0.45, lookY: -0.2, ...alive(g, 6), ...benter })} />
    <Person look={MATE} pose={OfficeSeat({ x: 0.28, z: -0.45, lookY: -0.2, lookX: -0.1, ...alive(g + 5, 7), ...mate })} />
    <pointLight position={[0, 1.0, 0.5]} intensity={0.8} distance={2.0} color="#9EF0C0" />
    <pointLight position={[0.6, 2.0, 1.2]} intensity={1.4} distance={3.2} color="#FFE2BE" />
    {children}
  </Office>
);
const LOOP_CAM = cm([0.1, 1.55, 2.6], [0, 1.32, -1.0], 36);

// ---------------- other helpers ----------------
/** the course's odds board: rows of horse numbers and odds; `k` 0→1 turns some odds amber (the model's corrections) */
const OddsBoard: React.FC<{ p: V3; w?: number; f: number; k?: number }> = ({ p, w = 3.2, f, k = 0 }) => {
  const tex = useLiveTex(768, 432, (c) => {
    c.fillStyle = "#08080C";
    c.fillRect(0, 0, 768, 432);
    c.font = `900 40px ${SIGN_FONT}`;
    c.textBaseline = "middle";
    for (let i = 0; i < 8; i++) {
      const odd = 2 + ((i * 7 + Math.floor(f / 20)) % 19) * 0.5 + i;
      c.fillStyle = "#5A5A60";
      c.fillText(String(i + 1), 40, 40 + i * 50);
      c.fillStyle = k > 0 && i % 3 === 1 ? AMBER : "#E8E4DA";
      c.fillText((k > 0 && i % 3 === 1 ? odd * 0.7 : odd).toFixed(1), 160, 40 + i * 50);
      c.fillStyle = "#3A6A50";
      c.fillRect(320, 26 + i * 50, 40 + ((i * 53 + Math.floor(f / 6)) % 300), 26);
    }
  });
  return (
    <group position={p}>
      <Box w={w + 0.2} h={w * 0.5625 + 0.2} d={0.2} c="#14161C" p={[0, -(w * 0.5625 + 0.2) / 2, -0.12]} />
      <Panel map={tex} w={w} h={w * 0.5625} glow={1.1} />
    </group>
  );
};
/** a list of factors that grows (`n` rows) on a green screen */
const FactorList: React.FC<{ p: V3; n: number }> = ({ p, n }) => {
  const tex = useLiveTex(384, 512, (c) => {
    c.fillStyle = "#06120E";
    c.fillRect(0, 0, 384, 512);
    const rows = Math.min(48, n);
    for (let i = 0; i < rows; i++) {
      c.fillStyle = "#5CFF8A";
      c.fillRect(14 + (i % 2) * 190, 10 + Math.floor(i / 2) * 20, 60 + ((i * 37) % 100), 9);
    }
  });
  return (
    <group position={p}>
      <Box w={0.98} h={1.3} d={0.05} c="#101216" p={[0, -0.65, -0.03]} />
      <Panel map={tex} w={0.9} h={1.2} glow={1} />
    </group>
  );
};
/** a message on a terminal screen */
const screenMsg = (text: string, fg: string) => signTex(text, "#06120E", fg, 1024, 680, Math.min(120, 1500 / text.length));
/** a floor safe, door hinged on its left; `open` 1 → 0 shuts it */
const Safe: React.FC<{ p: V3; open: number }> = ({ p, open }) => (
  <group position={p}>
    <Box w={0.62} h={0.7} d={0.55} c="#3A3E46" o={{ metal: 0.5, rough: 0.4 }} />
    <Box w={0.5} h={0.58} d={0.02} c="#0E0E12" p={[0, 0.06, 0.27]} />
    <group position={[-0.29, 0.06, 0.29]} rotation={[0, -open * 1.7, 0]}>
      <Box w={0.58} h={0.62} d={0.06} c="#4A4E58" p={[0.29, 0, 0]} o={{ metal: 0.6, rough: 0.35 }} />
      <P g={cyl(0.06, 0.06, 0.03, 10)} c="#C9A04A" p={[0.42, 0.3, 0.04]} r={[Math.PI / 2, 0, 0]} o={{ metal: 0.7, rough: 0.3 }} />
    </group>
  </group>
);
const PinkSlip: React.FC<{ p: V3; r?: V3 }> = ({ p, r = [-Math.PI / 2, 0, 0] }) => (
  <group position={p} rotation={r}>
    <Box w={0.1} h={0.16} d={0.002} c="#F2A8C0" p={[0, -0.08, 0]} shadow={false} />
  </group>
);
const Bag: React.FC = () => <Box w={0.24} h={0.18} d={0.08} c="#2A2224" p={[0, -0.18, 0.02]} />;
const RACE_CAM_WIDE = cm([0, 9, -TRACK.b - 12], [0, 1, 3], 42);

const S: Record<string, ShotFn> = {
  // ---------- hook ----------
  S1: (t, len, g) => ({
    light: "night",
    cam: glide(LOOP_CAM, cm([0.1, 1.55, 2.48], [0, 1.32, -1.0], 36), t, len),
    world: <Floor27 g={g} benter={{ lookY: -0.3 }} />,
  }),
  // ---------- Las Vegas ----------
  S2: (t, len, g) => {
    const grab = ramp(g, wd("02", "blacklisted") - 10, wd("02", "blacklisted") + 4);
    return {
      light: "stage",
      cam: glide(cm([0.35, 1.6, 2.4], [0.1, 1.2, -0.5], 34), cm([0.33, 1.6, 2.28], [0.1, 1.2, -0.5], 34), t, len),
      world: (
        <Casino f={g} sign="LAS VEGAS" table={false} lamp={7}>
          <BlackjackTable />
          <Chair p={[0, 0, -0.94]} c="#4A1E22" />
          <Person look={CAST.benterYoung} pose={{ x: 0, z: -0.82, ...SIT, armL: { f: 42, e: -52, o: 8 }, armR: { f: 42, e: -52, o: 8 }, lookY: -0.5 + grab * 0.4, lookX: grab * 0.6, brow: grab * 0.5 }} />
          <Person look={CAST.pitboss} pose={{ x: 0.75 - grab * 0.35, z: -1.0, ry: -60, armL: REST, armR: { f: 20 + grab * 70, e: -10, o: 10 }, frown: 0.5 }} />
        </Casino>
      ),
    };
  },
  S3: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.6, 1.6, 3.4], [0, 1.4, -0.6], 36), cm([0.58, 1.6, 3.25], [0, 1.4, -0.6], 36), t, len),
    world: (
      <Void c="#101418">
        <Box w={6} h={0.04} d={6} c="#22262C" />
        <Box w={2.6} h={3.2} d={0.2} c="#2A2420" p={[0, 0, -3.0]} />
        <Box w={1.2} h={2.2} d={0.06} c="#3A2A1E" p={[0, 0, -2.88]} o={{ e: "#FFD08A", ei: 0.5 }} />
        <Person look={CAST.benterYoung} pose={{ x: 0.2, z: -2.3 + t * 0.02, ...walk(t * 0.32, 22), armL: { f: 8, e: -10, o: 6 }, armR: REST, lookY: -0.2 }} holdL={<Bag />} />
        <pointLight position={[0, 2.4, -1.8]} intensity={5} distance={5} color="#FFD6A0" />
        <pointLight position={[1.5, 3, 1]} intensity={2} distance={6} color="#9EC8E0" />
      </Void>
    ),
  }),
  // ---------- Hong Kong ----------
  S4: (t, len, g) => ({
    light: "night",
    cam: glide(cm(trackAt(0.15, 9).p.map((v, i) => (i === 1 ? 3.2 : v)) as V3, trackAt(0.15, 0).p.map((v, i) => (i === 1 ? 1.0 : v)) as V3, 40), cm(trackAt(0.15, 8.6).p.map((v, i) => (i === 1 ? 3.2 : v)) as V3, trackAt(0.15, 0).p.map((v, i) => (i === 1 ? 1.0 : v)) as V3, 40), t, len),
    world: <Racetrack f={g} u={-0.3 + t * SPEED * 1.4} stand={false} />,
  }),
  S5: (t, len, g) => ({
    light: "night",
    cam: glide(cm([3, 2.6, TRACK.b - 6], [0, 3.2, TRACK.b + 6], 44), cm([2.8, 2.6, TRACK.b - 6.3], [0, 3.2, TRACK.b + 6], 44), t, len),
    world: <Racetrack f={g} u={1.2 + t * SPEED} horses={0} />,
  }),
  S6: (t, len, g) => {
    const k = ramp(t, 0, len);
    return {
      light: "stage",
      cam: cm([0, 2.3, 2.1], [0, 0.6, 0], 38),
      world: (
        <Void c="#14181E">
          <P g={cyl(0.7, 0.75, 0.12, 24)} c="#2A2E36" o={{ metal: 0.4, rough: 0.4 }} />
          <Pile n={160} r={0.6} h={0.45} p={[0, 0.12, 0]} k={0.3 + k * 0.7} seed={5} />
          {Array.from({ length: 30 }, (_, i) => {
            const d = i / 30;
            const y = 2.2 - interpolate(k - d * 0.6, [0, 0.25], [0, 1.6], CLAMP);
            return y < 2.15 && y > 0.65 ? <Ticket key={i} p={[Math.sin(i * 2.1) * 0.35, y, Math.cos(i * 1.7) * 0.35]} r={[i, i * 0.5, i * 0.3]} seed={i} /> : null;
          })}
          <pointLight position={[0, 2.4, 1.6]} intensity={6} distance={6} color="#FFE6C0" />
        </Void>
      ),
    };
  },
  S7: (t, len, g) => {
    const take = ramp(g, wd("06", "seventeen") - 4, wd("06", "seventeen") + 16);
    return {
      light: "stage",
      cam: glide(cm([0.1, 1.5, 2.6], [0.1, 0.6, 0], 36), cm([0.1, 1.5, 2.45], [0.1, 0.6, 0], 36), t, len),
      world: (
        <Void c="#14181E">
          <Box w={2.0} h={0.3} d={1.0} c="#3A2216" />
          {[-0.6, -0.36, -0.12, 0.12, 0.36].map((x) => <group key={x} position={[x, 0.3, 0]} scale={0.3}><CoinTower h={1.4} /></group>)}
          <group position={[0.6 + take * 0.9, 0.3 + take * 0.4, 0]} scale={0.3}><CoinTower h={1.4} /></group>
          <pointLight position={[0, 2.4, 1.8]} intensity={6} distance={6} color="#FFE6C0" />
        </Void>
      ),
      over: <Chip x={500} y={300} at={wd("06", "seventeen")} text="17%" kind="pop" size={100} color={AMBER} />,
    };
  },
  S8: (t, len, g) => ({
    light: "night",
    cam: glide(cm([1.2, 1.7, TRACK.b + 2.6], [0.4, 2.0, -2], 36), cm([1.15, 1.7, TRACK.b + 2.45], [0.4, 2.0, -2], 36), t, len),
    world: (
      <Racetrack f={g} u={2.6} horses={0}>
        <OddsBoard p={[0.4, 3.6, TRACK.b - 3.5]} f={g} />
        <Person look={CAST.benterYoung} pose={{ x: 1.0, z: TRACK.b + 0.4, ry: 200, armL: REST, armR: REST, lookY: 0.4 }} />
        <pointLight position={[0.8, 2.6, TRACK.b + 1.6]} intensity={4} distance={5} color="#FFE2BE" />
      </Racetrack>
    ),
  }),
  S9: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.34, 2.5], [0.02, 1.16, -0.75], 32), cm([0.42, 1.34, 2.35], [0.02, 1.16, -0.75], 32), t, len),
    world: (
      <Office f={g} night plate="">
        <Crt p={[0.42, DESK_Y, 0.02]} r={[0, -2.6, 0]} seed={2} f={g} />
        <Book p={[-0.3, DESK_Y + 0.03, -0.15]} open={1} c="#2E4A6A" />
        <Person look={CAST.benterYoung} pose={OfficeSeat({ lookX: -0.3, lookY: -0.6, pitch: 8, ...act(t, [[0, { armR: { f: 45, e: -50, o: 10 } }], [20, { armR: { f: 60, e: -40, o: 10 } }]]) })} />
      </Office>
    ),
  }),
  S10: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.2, 1.55, 2.7], [0, 1.15, -0.6], 34), cm([0.2, 1.55, 2.55], [0, 1.15, -0.6], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Crt p={[-0.45, DESK_Y, 0.02]} r={[0, Math.PI, 0]} seed={1} f={g} />
        <Crt p={[0.45, DESK_Y, 0.02]} r={[0, Math.PI, 0]} seed={3} f={g} />
        {[0, 1, 2, 3].map((i) => <Book key={i} p={[0, DESK_Y + 0.03 + i * 0.055, 0.15]} open={0} c={["#6E2430", "#2E4A6A", "#3F6A3A", "#6A5A2A"][i]} />)}
        <Person look={extra(71, { hairStyle: "long", top: "#7A3A4A" })} pose={OfficeSeat({ x: -0.45, ...typing(g), lookY: -0.3 })} />
        <Person look={extra(72, { hairStyle: "long", top: "#3A5A7A" })} pose={OfficeSeat({ x: 0.45, ...typing(g + 3), lookY: -0.3 })} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("09", "nine")} text="9 MONTHS" kind="pop" size={84} color={AMBER} />,
  }),
  S11: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.6, 1.6, 3.4], [0, 1.1, 0], 34), cm([0.58, 1.6, 3.2], [0, 1.1, 0], 34), t, len),
    world: (
      <Void c="#1A242C">
        <Box w={0.9} h={0.08} d={0.6} c="#5A5E66" p={[0 + t * 0.006, 0.25, 0]} />
        {[[-0.25, 0], [0.22, 0], [0, 0.38]].map(([x, y], i) => <Crt key={i} p={[x + t * 0.006, 0.33 + y, -0.05]} seed={i} />)}
        <Person look={{ ...CAST.benterYoung, top: "#3A4A5E" }} pose={{ x: -0.75 + t * 0.006, z: 0.1, ry: 90, lean: 10, ...walk(t * 0.3, 14), armL: { f: 70, e: -30, o: 6 }, armR: { f: 70, e: -30, o: 6 } }} />
        <pointLight position={[0.4, 2.6, 2.2]} intensity={7} distance={7} color="#E8F2FF" />
      </Void>
    ),
    over: <Chip x={500} y={300} at={wd("10", "nineteen")} text="1985" kind="pop" size={96} color={AMBER} />,
  }),
  S12: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.45, 2.3], [0, 1.0, -0.6], 34), cm([0.3, 1.45, 2.18], [0, 1.0, -0.6], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Crt p={[0.5, DESK_Y, 0.25]} r={[0, Math.PI + 0.4, 0]} seed={2} f={g} />
        <Person look={CAST.benterYoung} pose={OfficeSeat({ x: -0.3, worry: ramp(t, 20, 40) * 0.6, lookY: -0.4, heavy: 0.3 })} />
        <Person look={extra(73, { top: "#4A4A54", hairStyle: "short", hair: "#9A9A9A" })} pose={OfficeSeat({ x: 0.35, frown: 0.4, lookX: -0.3, armL: { f: 40, e: -110, o: 22 }, armR: { f: 40, e: -110, o: 22 } })} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("11", "hundred")} text="−$120,000" kind="pop" size={84} color={RED} />,
  }),
  // ---------- the key ----------
  S13: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0, 3.0, TRACK.b + 6], [0, 3.6, -2], 40), cm([0, 3.0, TRACK.b + 5.7], [0, 3.6, -2], 40), t, len),
    world: (
      <Racetrack f={g} u={1.8 + t * SPEED}>
        <OddsBoard p={[0, 5.2, TRACK.b - 4]} w={4.2} f={g} />
      </Racetrack>
    ),
  }),
  S14: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.2, 1.5, 2.2], [0, 1.6, -1.2], 34), cm([0.2, 1.5, 2.08], [0, 1.6, -1.2], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <OddsBoard p={[0, 2.25, -2.2]} w={1.8} f={g} k={ramp(g, wd("13", "correcting") - 6, wd("13", "correcting"))} />
        <Crt p={[0.42, DESK_Y, 0.02]} r={[0, -2.6, 0]} seed={2} f={g} />
        <Person look={CAST.benter} pose={OfficeSeat({ ...typing(g), lookY: 0.4, pitch: -4, lookX: -0.1 })} />
      </Office>
    ),
  }),
  S15: (t, len, g) => {
    const k = ramp(g, at("S15"), wd("14", "three") + 6);
    return {
      light: "warm",
      cam: glide(cm([0.05, 1.5, 2.6], [0, 1.1, -0.4], 34), cm([0.05, 1.5, 2.45], [0, 1.1, -0.4], 34), t, len),
      world: (
        <Office f={g} night plate="">
          {[-0.3, -0.1, 0.1, 0.3].map((x, i) => <group key={x} position={[x, DESK_Y, 0.1]} scale={0.24}><CoinTower h={0.1 + k * (1.0 + i * 0.2)} /></group>)}
          <Person look={CAST.benter} pose={OfficeSeat({ smile: 0.25, lookY: -0.4, pitch: 6 })} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("14", "three")} text="$3M" kind="pop" size={100} color={AMBER} />,
    };
  },
  // ---------- the club ----------
  S16: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.34, 2.5], [0.02, 1.2, -0.75], 32), cm([0.42, 1.34, 2.35], [0.02, 1.2, -0.75], 32), t, len),
    world: (
      <Office f={g} night plate="">
        <Person look={CAST.official} pose={OfficeSeat({ z: -0.78, armR: { f: 20, e: -140, o: 30 }, smile: 0.45, mouth: talking(g, lineEnd("16")) })} holdR={<Phone p={[0, 0.02, 0.04]} r={[0, Math.PI, 0]} s={0.8} screen="off" f={g} />} />
      </Office>
    ),
  }),
  S17: (t, len, g) => {
    const plug = ramp(g, wd("16", "plug") - 6, wd("16", "plug") + 8);
    return {
      light: "warm",
      cam: cm([0.1, 1.65, 1.9], [0.02, DESK_Y + 0.15, 0], 34),
      world: (
        <Office f={g} night plate="">
          <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#3A2A20" />
          <Crt p={[-0.35, DESK_Y, 0]} seed={1} f={g} />
          <Box w={0.34} h={0.26} d={0.26} c="#2A3A4A" p={[0.4, DESK_Y, -0.02]} o={{ metal: 0.3, rough: 0.5 }} />
          <Box w={0.08} h={0.04} d={0.02} c={plug > 0.95 ? "#5CFF8A" : "#1A2A1E"} p={[0.4, DESK_Y + 0.18, 0.12]} o={plug > 0.95 ? { e: "#5CFF8A", ei: 2 } : {}} shadow={false} />
          <Box w={0.62 * (0.55 + plug * 0.45)} h={0.025} d={0.025} c="#141216" p={[-0.1 + plug * 0.07, DESK_Y + 0.06, 0.1]} shadow={false} />
          <pointLight position={[0.2, DESK_Y + 0.9, 0.6]} intensity={1.6} distance={2.4} color="#FFE6C0" />
        </Office>
      ),
    };
  },
  S18: (t, len, g) => {
    const n = Math.round(interpolate(g, [at("S18"), wd("17", "factors")], [6, 48], CLAMP));
    return {
      light: "night",
      cam: glide(cm([0.3, 1.5, 2.2], [0, 1.55, -1.0], 34), cm([0.3, 1.5, 2.08], [0, 1.55, -1.0], 34), t, len),
      world: (
        <Office f={g} night plate="">
          <FactorList p={[0, 2.3, -2.2]} n={n} />
          <Person look={CAST.benter} pose={OfficeSeat({ ...typing(g), lookY: 0.5, pitch: -6 })} />
        </Office>
      ),
      over: <Chip x={500} y={300} at={wd("17", "hundred")} text="120+ FACTORS" kind="pop" size={78} color={AMBER} />,
    };
  },
  S19: (t, len, g) => {
    const off = wd("18", "suspended") - 2;
    return {
      light: "cool",
      cam: cm([0.05, 1.05, 2.1], [0, 1.0, 0], 34),
      world: (
        <Void c="#2A3440">
          <Box w={3} h={2.4} d={0.1} c="#3A4A58" p={[0, 0, -0.9]} />
          <Box w={1.4} h={0.73} d={0.7} c="#3A2216" p={[0, 0, -0.1]} />
          <Box w={0.74} h={0.54} d={0.08} c="#1A1C22" p={[0, 0.73, -0.06]} />
          <Panel map={g >= off ? screenMsg("SUSPENDED", RED) : screenMsg("TELEBET", "#5CFF8A")} w={0.64} h={0.43} p={[0, 1.0, 0]} glow={1} />
          <pointLight position={[0.6, 1.8, 1.4]} intensity={9} distance={5} color="#E8F2FF" />
        </Void>
      ),
      over: <Chip x={500} y={300} at={wd("18", "nineteen")} text="1997" kind="pop" size={96} color={RED} />,
    };
  },
  S20: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.4, 1.6, 2.8], [0, 1.0, -0.4], 34), cm([0.38, 1.6, 2.65], [0, 1.0, -0.4], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Box w={0.42} h={0.18} d={0.32} c="#D8D2C4" p={[-0.25, DESK_Y, 0.05]} />
        {Array.from({ length: 6 }, (_, i) => <PinkSlip key={i} p={[-0.25, DESK_Y + 0.2 + i * 0.004, 0.24 + Math.min(1, Math.max(0, (t - i * 6) / 10)) * 0.12]} r={[-Math.PI / 2 + 0.3, 0, 0]} />)}
        <Person look={CAST.benter} pose={OfficeSeat({ x: -0.2, lookY: -0.5, pitch: 8, lookX: 0.2 })} />
        <Person look={extra(75, { top: "#2A5A7A" })} pose={{ x: 0.3 + t * 0.03, z: 0.3, ry: 90, ...walk(t * 0.4, 26), armL: { f: 60, e: -40, o: 8 }, armR: REST }} holdL={<Ticket p={[0, -0.02, 0.06]} s={0.9} />} />
      </Office>
    ),
  }),
  // ---------- 2001 ----------
  S21: (t, len, g) => ({
    light: "night",
    cam: glide(RACE_CAM_WIDE, cm([0, 8.6, -TRACK.b - 11.4], [0, 1, 3], 42), t, len),
    world: <Racetrack f={g} u={0.9 + t * SPEED} />,
    over: <Chip x={500} y={300} at={wd("20", "two")} text="2001" kind="pop" size={96} color={AMBER} />,
  }),
  S22: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.25, 1.5, -1.3], [0, 0.95, 0.3], 34), cm([0.24, 1.48, -1.2], [0, 0.95, 0.3], 34), t, len),
    world: <Floor27 g={g} n={18} benter={{ lookY: -0.2 }} />,
    over: <Chip x={500} y={300} at={wd("21", "fifty-one")} text="51,000 BETS" kind="pop" size={80} color={AMBER} />,
  }),
  S23: (t, len, g) => {
    const n = Math.round(interpolate(t, [0, 30], [18, 0], CLAMP));
    const hit = wd("22", "hit");
    return {
      light: "night",
      cam: cm([0.05, 1.3, -0.95], [0, 0.97, 0.3], 30),
      world: <Floor27 g={g} n={n} win={g >= hit ? 1 : 0} benter={{ lookY: -0.2, brow: g >= hit ? 0.6 : 0 }} />,
      over: <Chip x={500} y={300} at={wd("22", "sixteen")} text="$16M" kind="pop" size={100} color={AMBER} />,
    };
  },
  S24: (t, len, g) => ({
    light: "warm",
    cam: cm([0, DESK_Y + 1.8, 0.45], [0, DESK_Y, 0.05], 34),
    world: (
      <Office f={g} night plate="">
        <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#3A2A20" />
        {[-0.12, 0, 0.12].map((x, i) => <PinkSlip key={x} p={[x, DESK_Y + 0.004, 0.05 + i * 0.02]} r={[-Math.PI / 2, 0, (i - 1) * 0.12]} />)}
        <pointLight position={[0.2, DESK_Y + 0.8, 0.4]} intensity={1.2} distance={2} color="#FFE6C0" />
      </Office>
    ),
  }),
  S25: (t, len, g) => ({
    light: "night",
    cam: glide(cm([-0.25, 1.5, 1.35], [-0.32, 1.25, -0.45], 30), cm([-0.25, 1.5, 1.27], [-0.32, 1.25, -0.45], 30), t, len),
    world: <Floor27 g={g} n={0} win={1} benter={{ yaw: Math.sin(t * 0.3) * 10 * ramp(t, 2, 8) * (1 - ramp(t, 26, 34)), smile: 0.2, mouth: talking(g, lineEnd("24")), lookY: 0 }} />,
  }),
  S26: (t, len, g) => {
    const shut = ramp(g, lineEnd("25") - 16, lineEnd("25") - 4);
    return {
      light: "warm",
      cam: glide(cm([1.0, 1.4, 2.4], [0, 0.45, 0], 34), cm([0.96, 1.4, 2.28], [0, 0.45, 0], 34), t, len),
      world: (
        <Void c="#1A1E24">
          <Safe p={[0, 0, 0]} open={1 - shut} />
          {shut < 0.5 ? [0, 1, 2].map((i) => <PinkSlip key={i} p={[0, 0.4 + i * 0.002, 0.05]} r={[-Math.PI / 2, 0, i * 0.1]} />) : null}
          <pointLight position={[0.8, 1.8, 1.4]} intensity={12} distance={5} color="#FFE6C0" />
        </Void>
      ),
    };
  },
  S27: (t, len, g) => {
    const k = ramp(g, at("S27"), wd("26", "billion") + 4);
    return {
      light: "night",
      cam: glide(cm([0, 2.0, 4.2], [0, 1.6, 0], 38), cm([0, 2.0, 4.0], [0, 1.6, 0], 38), t, len),
      world: (
        <Void c="#101418">
          {Array.from({ length: 7 }, (_, i) => <group key={i} position={[(i - 3) * 0.5, 0, (i % 2) * -0.4]} scale={0.6}><CoinTower h={0.8 + k * (1.6 + ((i * 37) % 7) * 0.3)} /></group>)}
          <pointLight position={[0, 3.4, 2.2]} intensity={16} distance={9} color="#FFE6C0" />
        </Void>
      ),
      over: <Chip x={500} y={300} at={wd("26", "billion")} text="~$1B" kind="pop" size={100} color={AMBER} />,
    };
  },
  S28: (t, len, g) => ({
    light: "night",
    cam: cm([TRACK.a + 0.5, 1.3, TRACK.b * 0.2 + 3.5], [TRACK.a - 0.5, 1.2, 0], 40),
    world: <Racetrack f={g} u={-0.45 + t * SPEED * 1.2} stand={false} />,
  }),
  S29: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.1, 1.55, 2.72], [0, 1.32, -1.0], 36), LOOP_CAM, t, len),
    world: <Floor27 g={g} benter={{ lookY: -0.3 }} />,
  }),
};
const ROOMS = [
  ["S1", "S1", "sfx/synth/room-office.wav"],
  ["S2", "S2", "sfx/synth/room-casino.wav"],
  ["S9", "S12", "sfx/synth/room-office.wav"],
  ["S14", "S16", "sfx/synth/room-office.wav"],
  ["S18", "S18", "sfx/synth/room-office.wav"],
  ["S20", "S20", "sfx/synth/room-office.wav"],
  ["S22", "S25", "sfx/synth/room-office.wav"],
  ["S29", "S29", "sfx/synth/room-office.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence after "sixteen million dollars", after "unsporting" and after "charity", low under the last line
  const duck = (g: number) =>
    interpolate(
      g,
      [lineStart("07") - 6, lineStart("07"), lineEnd("11"), lineEnd("11") + 8, lineEnd("21") - 4, lineStart("22"), lineEnd("22") + 2, lineStart("23") + 4, lineStart("23") + 16, lineEnd("24") - 4, lineEnd("24") + 2, lineStart("25") + 4, lineStart("25") + 16, lineEnd("25") - 4, lineEnd("25") + 2, lineStart("26") + 4, lineStart("26") + 16, lineStart("27"), lineStart("27") + 12],
      [1, 0.65, 0.65, 1, 1, 0.25, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0.35],
      CLAMP,
    );
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="bill-benter" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      <Sfx file="sfx/synth/chip-stack.wav" at={lineEnd("06") + 2} level={-22} align="onset" />
      <Sfx file="sfx/synth/dot-matrix.wav" at={at("S20") + 4} level={-18} seconds={2} />
      <Sfx file="sfx/click/mouse-click-351398.mp3" at={wd("16", "plug") + 8} level={-24} align="onset" />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("22") + 3} level={-22} align="onset" />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("25") - 3} level={-19} align="onset" seconds={1.2} />
    </Episode>
  );
};

/** 9:16 thumbnail: Benter at the screens with the race behind; the jackpot he left. */
export const Thumb: React.FC = () => (
  <Shot3D light="night" post={{ bloom: 0.15 }} cam={cm([0.0, 1.45, 1.5], [-0.15, 1.35, -0.8], 40)} over={<ThumbText top="$16 MILLION" bottom="NEVER CASHED" size={96} y={240} />}>
    <Floor27 g={40} n={0} win={1} benter={{ lookY: -0.1, smirk: 0.35, browL: 0.3 }} />
  </Shot3D>
);

