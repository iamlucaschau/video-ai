/**
 * NEON ODDS ep04 · ritz-roulette. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-ritz-roulette-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * The table (RouletteTable) is centred on the origin, long side along x, the wheel at −x; the players sit on −z facing +z,
 * so the camera on +z sees their faces with the teal rim behind them. Newspaper names and the history board are made up.
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, alive, Box, Cctv, Chip, ctex, cyl, glide, N, P, Panel, Person, type Pose, Shot3D, signTex, SIGN_FONT, SIT, talk, useLiveTex, type V3, walk } from "../../../Style Library/N-low-poly/lowpoly";
import { Book, Bundle, Chair, ChipHill, ChipStack, Desk, DeskLamp, Phone, PressHand, RouletteWheel, spinAt, WHEEL_ORDER } from "../../../Style Library/N-low-poly/props";
import { Casino, CashCage, CAST, cellAt, extra, Interview, Office, ROUL, RouletteTable, TABLE_Y, Void } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/ritz-roulette.timing.json";
import rawWords from "../../../src/voiceover/ritz-roulette.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineEnd, lineStart, wd } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
const MUSIC = "sfx/music/own/ritz-roulette.mp3";

const AMBER = "#FFB347";
const TEAL = "#62D2DC";
const RED = "#FF6A5A";
const CCTV = "grayscale(0.85) sepia(0.2) contrast(1.08) brightness(0.98)";
const REST = { o: 8 };
const DESK_Y = 0.77;
const talking = (g: number, end: number) => talk(g, g < end - 3);
const WX = ROUL.wheelX;
const WHEEL_Y = TABLE_Y - 0.05;
/** seated at the table on −z, facing +z */
const SEAT: Pose = { ...SIT, armL: { f: 40, e: -50, o: 8 }, armR: { f: 40, e: -50, o: 8 } };
const LUNGE: Pose = { lean: 26, armL: { f: 82, e: -14, o: 10 }, armR: { f: 92, e: -10, o: 6 }, lookY: -0.5, pitch: 6 };
const TOSA_AT = { x: 0.05, z: -0.8 };
const MATE_AT = { x: 0.62, z: -0.8 };
/** fifteen numbers: three groups of five neighbours on the wheel */
const BETS = [2, 25, 17, 34, 6, 22, 18, 29, 7, 28, 33, 1, 20, 14, 31];
const CHIP_C = ["#B8342C", "#1F4F8C", "#2E8B57"];

// ---------------- the Ritz table ----------------
/** the gaming floor at the Ritz with the roulette table at the origin, the croupier at the wheel end */
const Ritz: React.FC<{ f: number; children?: React.ReactNode; spin?: ReturnType<typeof spinAt>; croupier?: Pose; dim?: number; tilt?: number }> = ({ f, children, spin, croupier = {}, dim = 1, tilt = 0 }) => (
  <Casino f={f} sign="THE RITZ" table={false} lamp={7} dim={dim}>
    <RouletteTable ball={spin} rot={spin?.rot ?? f * 0.03} tilt={tilt} />
    <Person look={CAST.dealer} pose={{ x: WX - 0.62, z: 0.05, ry: 90, armL: REST, armR: { f: 30, e: -40, o: 8 }, ...croupier }} />
    {children}
  </Casino>
);
/** chairs and the two players; `lunge` 0→1 leans them over the layout */
const Players: React.FC<{ g: number; tosa?: Pose; mate?: Pose; lunge?: number; blonde?: boolean }> = ({ g, tosa = {}, mate = {}, lunge = 0, blonde = true }) => {
  const lean = (p: Pose): Pose => ({ ...SEAT, lean: (LUNGE.lean ?? 0) * lunge, armL: lunge > 0.05 ? LUNGE.armL : SEAT.armL, armR: lunge > 0.05 ? LUNGE.armR : SEAT.armR, lookY: -0.5 * lunge, ...p });
  return (
    <>
      <Chair p={[TOSA_AT.x, 0, TOSA_AT.z - 0.12]} c="#4A1E22" />
      <Chair p={[MATE_AT.x, 0, MATE_AT.z - 0.12]} c="#4A1E22" />
      <Person look={CAST.tosa} pose={{ ...TOSA_AT, ...alive(g, 3), ...lean(tosa) }} />
      <Person look={CAST.tosaMate} pose={{ ...MATE_AT, ...alive(g + 9, 5), heavy: 0.35, ...lean(mate) }} />
      {blonde ? <Person look={CAST.tosaBlonde} pose={{ x: 1.15, z: -1.15, ry: -20, ...alive(g + 4, 7), armL: REST, armR: { f: 40, e: -90, o: 10 }, lookX: -0.4 }} /> : null}
    </>
  );
};
/** chips on `n` of the fifteen numbers (k 0→1 lays them one after another) */
const Bets: React.FC<{ k: number; tall?: number }> = ({ k, tall = 4 }) => (
  <>
    {BETS.slice(0, Math.round(k * BETS.length)).map((n, i) => {
      const [x, y, z] = cellAt(n);
      return <ChipStack key={n} p={[x, y, z]} n={tall} r={0.032} c={CHIP_C[i % 3]} seed={n} />;
    })}
  </>
);
/** a pocket on the wheel that carries chips (for a hit) */
const pocketOf = (n: number) => WHEEL_ORDER.indexOf(n);

// ---------------- the loop: the hook picture, frame 0 = last frame ----------------
const LOOP_CAM = cm([-0.62, 1.5, 2.3], [-0.28, 1.0, -0.4], 40);
const loopSpin = (x: number) => spinAt(x + 150, { drop: 262, zone: 2.4, pocket: pocketOf(17), rot0: 0.4 });
const HookSet: React.FC<{ g: number; x: number; hill?: number }> = ({ g, x, hill = 1 }) => {
  const sp = loopSpin(x);
  return (
    <Ritz f={g} spin={sp}>
      <Players g={g} tosa={{ lookX: -0.7, lookY: -0.45, yaw: -18, pitch: 6 }} mate={{ lookX: -0.6, lookY: -0.4, yaw: -10 }} blonde={false} />
      <ChipHill p={[0.4, TABLE_Y + 0.006, -0.34]} k={hill} cols={4} rows={2} max={26} seed={5} />
      <pointLight position={[-0.3, 1.9, 0.6]} intensity={2.2} distance={3.4} color="#FFE2BE" />
    </Ritz>
  );
};

// ---------------- the laser story (as the papers told it) ----------------
/** a straight red beam on the felt from `a` to `b` (world x/z, height y) */
const Beam: React.FC<{ a: V3; b: V3; k: number }> = ({ a, b, k }) => {
  if (k <= 0) return null;
  const dx = b[0] - a[0];
  const dz = b[2] - a[2];
  const len = Math.hypot(dx, dz) * k;
  return (
    <group position={a} rotation={[0, -Math.atan2(dz, dx), 0]}>
      <Box w={len} h={0.006} d={0.006} c={RED} p={[len / 2, 0, 0]} o={{ e: RED, ei: 3 }} shadow={false} />
    </group>
  );
};
const PHONE_AT: V3 = [WX + 0.55, TABLE_Y + 0.006, -0.42];
/** the phone on the rail aiming at the wheel, a wire to a small computer: the 2004 story, drawn as a diagram */
const LaserRig: React.FC<{ g: number; beam: number; spin: ReturnType<typeof spinAt> }> = ({ g, beam, spin }) => {
  const ballW: V3 = [WX + Math.cos(spin.a) * spin.rr, WHEEL_Y + spin.y + 0.011, Math.sin(spin.a) * spin.rr];
  return (
    <>
      <Phone p={[PHONE_AT[0], PHONE_AT[1], PHONE_AT[2]]} r={[0, 2.5, 0]} s={0.9} screen={beam > 0 ? "rec" : "off"} f={g} />
      <Beam a={[PHONE_AT[0], PHONE_AT[1] + 0.08, PHONE_AT[2]]} b={ballW} k={beam} />
      {Array.from({ length: 8 }, (_, i) => <P key={i} g={cyl(0.005, 0.005, 0.09, 4)} c="#1A1A20" p={[PHONE_AT[0] + 0.04 + i * 0.07, TABLE_Y + 0.008, PHONE_AT[2] - 0.02 + Math.sin(i * 1.3) * 0.03]} r={[0, 0, Math.PI / 2]} shadow={false} />)}
      <Box w={0.12} h={0.04} d={0.08} c="#2A2E36" p={[PHONE_AT[0] + 0.66, TABLE_Y + 0.006, PHONE_AT[2]]} />
      <Box w={0.02} h={0.006} d={0.01} c={beam > 0 ? "#5CFF8A" : "#1A2A1E"} p={[PHONE_AT[0] + 0.62, TABLE_Y + 0.046, PHONE_AT[2] + 0.041]} o={beam > 0 ? { e: "#5CFF8A", ei: 2 } : {}} shadow={false} />
    </>
  );
};
/** a tabloid front page (made-up name): masthead, headline, the phone-and-beam drawing */
const paperTex = () =>
  ctex("ritz-paper", 768, 1024, (c) => {
    c.fillStyle = "#F1ECE0";
    c.fillRect(0, 0, 768, 1024);
    c.fillStyle = "#B8261E";
    c.fillRect(0, 0, 768, 150);
    c.fillStyle = "#FFFFFF";
    c.font = `900 92px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("DAILY GLOBE", 384, 80);
    c.fillStyle = "#111014";
    c.font = `900 118px ${SIGN_FONT}`;
    c.fillText("THE LASER", 384, 270);
    c.fillText("SCAM", 384, 400);
    // the drawing: a wheel, a phone, a red beam
    c.strokeStyle = "#111014";
    c.lineWidth = 10;
    c.beginPath();
    c.arc(510, 690, 150, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(510, 690, 70, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = "#111014";
    c.fillRect(110, 600, 90, 170);
    c.strokeStyle = "#E0201A";
    c.lineWidth = 12;
    c.beginPath();
    c.moveTo(200, 640);
    c.lineTo(440, 650);
    c.stroke();
    c.fillStyle = "#8A8478";
    for (let i = 0; i < 6; i++) c.fillRect(70, 880 + i * 22, i % 2 ? 560 : 628, 10);
  });
const Newspaper: React.FC<{ p: V3; r?: V3; s?: number }> = ({ p, r = [-Math.PI / 2, 0, 0], s = 1 }) => (
  <group position={p} rotation={r} scale={s}>
    <Box w={0.42} h={0.56} d={0.006} c="#E8E2D4" p={[0, -0.28, -0.004]} />
    <Panel map={paperTex()} w={0.4} h={0.533} glow={0.92} />
  </group>
);

// ---------------- other helpers ----------------
/** a monitor showing a grey CCTV picture of a table */
const cctvPic = (seed: number) =>
  ctex(`ritz-cctv${seed}`, 512, 320, (c, R) => {
    c.fillStyle = "#1A1E20";
    c.fillRect(0, 0, 512, 320);
    c.fillStyle = "#3E5A50";
    c.beginPath();
    c.ellipse(256, 200, 200, 70, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#6A6A66";
    for (let i = 0; i < 3; i++) c.fillRect(140 + i * 90 + R() * 20, 90, 26, 60);
    c.fillStyle = "#D8D8D0";
    c.font = "700 26px Consolas, monospace";
    c.fillText(`CAM ${seed}`, 18, 34);
  });
const Monitor: React.FC<{ p: V3; ry?: number; w?: number; seed: number; glow?: number }> = ({ p, ry = 0, w = 0.62, seed, glow = 0.85 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Box w={w + 0.06} h={w * 0.62 + 0.06} d={0.05} c="#101216" p={[0, -(w * 0.31) - 0.03, -0.03]} />
    <Panel map={cctvPic(seed)} w={w} h={w * 0.62} p={[0, 0, 0.001]} glow={glow} />
  </group>
);
/** the table's history board: the last numbers, the hits in amber */
const HistoryBoard: React.FC<{ p: V3; n: number }> = ({ p, n }) => {
  const tex = useLiveTex(256, 768, (c) => {
    c.fillStyle = "#08080C";
    c.fillRect(0, 0, 256, 768);
    c.font = `900 72px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    for (let i = 0; i < 8; i++) {
      const num = BETS[(i * 7 + n) % BETS.length];
      c.fillStyle = i < Math.min(8, n) ? AMBER : "#5A5A60";
      c.fillText(String(num), 128, 60 + i * 92);
    }
  });
  return (
    <group position={p} scale={0.6}>
      <Box w={0.36} h={1.04} d={0.08} c="#14161C" p={[0, -0.52, -0.05]} />
      <Panel map={tex} w={0.32} h={0.96} glow={1.1} />
    </group>
  );
};
const Bag: React.FC = () => <Box w={0.24} h={0.18} d={0.08} c="#2A2224" p={[0, -0.18, 0.02]} />;
const walker = (t: number, z0: number, speed = 0.022): Pose => ({ z: z0 + t * speed, ...walk(t * 0.32, 22) });
const OfficeSeat = (p: Pose = {}): Pose => ({ z: -0.75, ...SIT, armL: { f: 45, e: -50, o: 10 }, armR: { f: 45, e: -50, o: 10 }, ...p });
const BARNETT = extra(77, { hair: "#B8B0A2", hairStyle: "recede", top: "#3A4048", shirt: "#F3EFE6", pants: "#2A2C34", glasses: false, moustache: false });
const WORKER = (seed: number) => extra(seed, { top: "#3A3A44", hairStyle: "short" });
/** the seaside cafe in Croatia: a small table, a window on a grey sea */
const seaTex = () =>
  ctex("ritz-sea", 512, 512, (c) => {
    const gr = c.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, "#4A5A68");
    gr.addColorStop(0.55, "#7A8A96");
    gr.addColorStop(0.56, "#2E4A5A");
    gr.addColorStop(1, "#1E3440");
    c.fillStyle = gr;
    c.fillRect(0, 0, 512, 512);
  });
const Cafe: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Void c="#22262A">
    <Box w={4} h={3} d={0.1} c="#3A3430" p={[0, 0, -1.6]} />
    <Panel map={seaTex()} w={1.6} h={1.1} p={[0.2, 1.7, -1.54]} glow={0.9} />
    <Box w={1.7} h={0.08} d={0.12} c="#2A2420" p={[0.2, 1.11, -1.52]} />
    <P g={cyl(0.34, 0.34, 0.03, 12)} c="#E8E2D4" p={[0, 0.74, 0]} />
    <P g={cyl(0.04, 0.06, 0.74, 6)} c="#2A2224" />
    <P g={cyl(0.04, 0.035, 0.08, 8)} c="#F3EFE6" p={[0.12, 0.77, 0.08]} />
    <pointLight position={[0, 2.0, 0.6]} intensity={3.2} distance={4} color="#FFE2BE" />
    {children}
  </Void>
);

const S: Record<string, ShotFn> = {
  // ---------- hook ----------
  S1: (t, len, g) => ({
    light: "stage",
    cam: glide(LOOP_CAM, cm([-0.62, 1.5, 2.18], [-0.28, 1.0, -0.4], 40), t, len),
    world: <HookSet g={g} x={g} />,
    over: <Chip x={500} y={300} at={wd("01", "million")} text="£1.3M" kind="pop" size={96} color={AMBER} />,
  }),
  // ---------- the table ----------
  S2: (t, len, g) => ({
    light: "night",
    cam: glide(cm([1.6, 2.4, 5.0], [0, 1.2, -1.2], 38), cm([1.5, 2.35, 4.7], [0, 1.2, -1.2], 38), t, len),
    world: (
      <Ritz f={g} spin={spinAt(t, { drop: 200 })}>
        <Players g={g} />
        {[-2.4, 2.4].map((x) => <Person key={x} look={extra(x > 0 ? 61 : 62)} pose={{ x, z: 0.6, ry: x > 0 ? -150 : 150, ...walk(g * 0.3, 18), armL: REST, armR: REST }} />)}
      </Ritz>
    ),
    over: <Chip x={500} y={300} at={wd("02", "march")} text="MARCH 2004" kind="pop" size={80} color={AMBER} />,
  }),
  S3: (t, len, g) => {
    const sit = ramp(g, wd("03", "sits") - 12, wd("03", "sits") + 6);
    const walkIn = 1 - ramp(g, wd("03", "sits") - 14, wd("03", "sits") - 10);
    return {
      light: "stage",
      cam: glide(cm([0.6, 1.6, 2.6], [0.05, 1.15, -0.6], 34), cm([0.55, 1.6, 2.45], [0.05, 1.15, -0.6], 34), t, len),
      world: (
        <Ritz f={g}>
          <Chair p={[TOSA_AT.x, 0, TOSA_AT.z - 0.12]} c="#4A1E22" />
          <Person
            look={CAST.tosa}
            pose={{
              x: TOSA_AT.x + (1 - ramp(t, 0, wd("03", "sits") - at("S3") - 12)) * 1.4,
              z: TOSA_AT.z,
              ry: interpolate(sit, [0, 1], [-80, 0]) * (sit < 1 ? 1 : 0),
              ...(walkIn > 0 && sit === 0 ? walk(t * 0.32, 20) : {}),
              y: (SIT.y ?? 0) * sit,
              legL: sit > 0 ? { f: 88 * sit, k: 88 * sit } : undefined,
              legR: sit > 0 ? { f: 88 * sit, k: 88 * sit } : undefined,
              armL: REST,
              armR: REST,
              lookX: -0.3 * sit,
              ...alive(g, 3),
            }}
          />
        </Ritz>
      ),
    };
  },
  S4: (t, len, g) => ({
    light: "stage",
    cam: cm([WX, 3.0, 0.4], [WX, WHEEL_Y + 0.05, 0], 40),
    world: <Ritz f={g} spin={spinAt(t + 40, { drop: 400, zone: 1 })} />,
    over: <Chip x={500} y={300} at={wd("04", "thirty-seven")} text="37" kind="pop" size={100} color={AMBER} />,
  }),
  S5: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([-0.1, 1.42, 0.75], [0.05, 1.32, -0.8], 30), cm([-0.1, 1.42, 0.68], [0.05, 1.32, -0.8], 30), t, len),
    world: (
      <Ritz f={g} spin={spinAt(t + 60, { drop: 400 })}>
        <Players g={g} tosa={{ lookX: -0.75, lookY: -0.35, yaw: -16, pitch: 4, blink: 0 }} blonde={false} />
        <pointLight position={[-0.2, 1.8, 0.2]} intensity={1.6} distance={2.4} color="#FFE2BE" />
      </Ritz>
    ),
    over: <Chip x={500} y={300} at={wd("05", "niko")} text="NIKO TOSA" kind="slide" size={72} color={TEAL} />,
  }),
  S6: (t, len, g) => {
    const launch = wd("06", "waits") - at("S6") - 6;
    return {
      light: "stage",
      cam: glide(cm([-0.35, 1.7, 2.4], [-0.2, 1.0, -0.4], 36), cm([-0.35, 1.7, 2.25], [-0.2, 1.0, -0.4], 36), t, len),
      world: (
        <Ritz f={g} spin={spinAt(t - launch, { drop: 400 })} croupier={act(t, [[launch - 8, { armR: { f: 30, e: -40, o: 8 } }], [launch, { armR: { f: 70, e: -10, o: 20 } }], [launch + 10, { armR: { f: 30, e: -40, o: 8 } }]])}>
          <Players g={g} tosa={{ lookX: -0.7, lookY: -0.45, yaw: -18 }} mate={{ lookX: -0.6, lookY: -0.4, yaw: -10 }} />
        </Ritz>
      ),
      over: <Chip x={500} y={300} at={wd("06", "six")} to={6} pre="~" post=" s" kind="count" dur={40} size={88} color={AMBER} />,
    };
  },
  S7: (t, len, g) => {
    const go = wd("07", "lunge") - at("S7");
    const lunge = ramp(t, go - 4, go + 8) - ramp(t, len - 22, len - 8) * 0.8;
    return {
      light: "stage",
      cam: glide(cm([0.55, 1.95, 2.2], [0.35, 0.9, -0.3], 36), cm([0.55, 1.95, 2.05], [0.35, 0.9, -0.3], 36), t, len),
      world: (
        <Ritz f={g} spin={spinAt(t + 190, { drop: 400 })}>
          <Players g={g} lunge={lunge} />
          <Bets k={ramp(t, go + 4, go + 34)} />
        </Ritz>
      ),
      over: <Chip x={500} y={300} at={wd("07", "fifteen")} to={15} post=" NUMBERS" kind="count" dur={18} size={74} color={AMBER} />,
    };
  },
  S8: (t, len, g) => {
    const sp = spinAt(t + 230, { drop: 246, zone: 0.6, pocket: pocketOf(17) });
    return {
      light: "stage",
      cam: cm([WX + 0.15, 1.75, 0.95], [WX + 0.05, WHEEL_Y + 0.05, 0], 34),
      world: (
        <Ritz f={g} spin={sp}>
          <Bets k={1} />
        </Ritz>
      ),
    };
  },
  S9: (t, len, g) => {
    const n = Math.round(interpolate(g, [at("S9"), wd("09", "thirteen")], [5, 13], CLAMP));
    return {
      light: "stage",
      cam: glide(cm([-0.9, 1.65, 1.9], [-1.0, 1.35, -0.6], 34), cm([-0.9, 1.65, 1.8], [-1.0, 1.35, -0.6], 34), t, len),
      world: (
        <Ritz f={g} spin={spinAt(t + 60, { drop: 400 })} croupier={{ lookX: 0.6, brow: 0.5, worry: 0.3 }}>
          <HistoryBoard p={[WX - 0.15, 1.45, -0.45]} n={n} />
          <Person look={CAST.pitboss} pose={{ x: WX - 0.75, z: -0.85, ry: 30, armL: REST, armR: REST, lookX: 0.6, worry: ramp(t, 10, 30) * 0.5 }} />
        </Ritz>
      ),
      over: <Chip x={500} y={300} at={wd("09", "thirteen")} text="13 IN A ROW" kind="pop" size={76} color={AMBER} />,
    };
  },
  S10: (t, len, g) => {
    const push = ramp(t, 4, 26);
    const [cx, cy, cz] = cellAt(17);
    return {
      light: "stage",
      cam: cm([cx + 0.1, 1.55, cz + 0.62], [cx, cy, cz - 0.05], 34),
      world: (
        <Ritz f={g}>
          <Bets k={1} />
          <PressHand p={[cx - 0.12 + push * 0.1, cy + 0.04, cz - 0.42 + push * 0.32]} r={[0.2, 0, -1.42]} sleeve={CAST.tosa.top} skin={CAST.tosa.skin} hold={<Box w={0.09} h={0.012} d={0.06} c={AMBER} p={[0.0, -0.02, 0.07]} />} />
          {[0, 1, 2].map((i) => <Box key={i} w={0.09} h={0.012} d={0.06} c={i === 1 ? "#E8D8A8" : AMBER} p={[cx, cy + 0.014 * i, cz]} o={{ metal: 0.3, rough: 0.4 }} />)}
        </Ritz>
      ),
      over: <Chip x={500} y={300} at={wd("10", "fifteen")} text="£15,000" kind="pop" size={92} color={AMBER} />,
    };
  },
  S11: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0.35, 1.55, 2.2], [0.3, 1.05, -0.5], 34), cm([0.35, 1.55, 2.05], [0.3, 1.05, -0.5], 34), t, len),
    world: (
      <Ritz f={g}>
        <Players g={g} tosa={{ lookY: -0.3, smile: 0.05 }} mate={{ lookX: 0.5, smirk: 0.3 }} />
        <ChipHill p={[0.1, TABLE_Y + 0.006, -0.36]} k={ramp(g, at("S11"), wd("11", "million"))} cols={5} rows={2} max={26} seed={5} />
        <ChipHill p={[0.66, TABLE_Y + 0.006, -0.36]} k={ramp(g, at("S11") + 10, wd("11", "million"))} cols={4} rows={2} max={30} seed={9} />
      </Ritz>
    ),
    over: <Chip x={500} y={300} at={wd("11", "million")} text="£1.3M" kind="pop" size={96} color={AMBER} />,
  }),
  S12: (t, len, g) => {
    const up = ramp(t, 2, 16);
    return {
      light: "stage",
      cam: glide(cm([0.8, 1.62, 2.9], [0.45, 1.35, -0.6], 34), cm([0.76, 1.62, 2.75], [0.45, 1.35, -0.6], 34), t, len),
      world: (
        <Ritz f={g}>
          <Chair p={[MATE_AT.x, 0, MATE_AT.z - 0.12]} c="#4A1E22" />
          <Person look={CAST.tosaMate} pose={{ ...MATE_AT, ...SEAT, heavy: 0.35, lookX: -0.5 }} />
          <Person look={CAST.tosa} pose={{ x: TOSA_AT.x, z: TOSA_AT.z + 0.1, y: (SIT.y ?? 0) * (1 - up), legL: { f: 88 * (1 - up), k: 88 * (1 - up) }, legR: { f: 88 * (1 - up), k: 88 * (1 - up) }, ry: 30 * up, armL: REST, armR: act(t, [[16, { armR: REST }], [28, { armR: { f: 40, e: -60, o: 20 } }]]).armR, smirk: ramp(t, 18, 30) * 0.5, browL: 0.3, mouth: talking(g, lineEnd("12")), lookX: 0.6 }} />
          <Person look={CAST.pitboss} pose={{ x: 0.95, z: -0.2, ry: -110, armL: REST, armR: REST, lookX: -0.3, brow: 0.3 }} />
        </Ritz>
      ),
    };
  },
  // ---------- caught ----------
  S13: (t, len, g) => ({
    light: "cool",
    cam: glide(cm([0.9, 1.6, 1.6], [-0.1, 1.45, -1.6], 34), cm([0.85, 1.6, 1.45], [-0.1, 1.45, -1.6], 34), t, len),
    world: (
      <Office f={g} night plate="">
        {Array.from({ length: 6 }, (_, i) => <Monitor key={i} p={[((i % 3) - 1) * 0.7, 1.35 + Math.floor(i / 3) * 0.5, -2.2]} seed={i + 1} />)}
        <Person look={CAST.secChief} pose={{ z: -0.9, ry: 200, armL: { f: 30, e: -80, o: 12 }, armR: { f: 50, e: -70, o: 10 }, lookY: 0.2, lean: 6 + ramp(t, 10, 40) * 6 }} />
        <pointLight position={[0, 1.6, -1.6]} intensity={2.6} distance={3.4} color="#CFE4F0" />
      </Office>
    ),
  }),
  S14: (t, len, g) => {
    const go = len - 14;
    return {
      light: "cool",
      filter: CCTV,
      cam: cm([1.7, 3.3, 2.5], [0, 0.8, -0.3], 44),
      world: (
        <Ritz f={Math.floor(g / 3) * 3} spin={spinAt(Math.floor(t / 2) * 2 + 10, { drop: 400 })}>
          <Players g={g} lunge={ramp(t, go, go + 10)} />
        </Ritz>
      ),
      over: <Cctv cam="CAM 3" />,
    };
  },
  S15: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.2, 1.6, 2.8], [0, 1.4, -0.6], 34), cm([0.2, 1.6, 2.65], [0, 1.4, -0.6], 34), t, len),
    world: (
      <Casino f={g} sign="THE RITZ" table={false} lamp={5} dim={0.7}>
        <Person look={CAST.agent} pose={{ x: -0.45, z: -0.6, armL: { f: 30, e: -100, o: 20 }, armR: { f: 30, e: -100, o: 20 }, lookX: 0.2 }} />
        <Person look={CAST.agent2} pose={{ x: 0.45, z: -0.7, armL: REST, armR: REST, lookX: -0.1 }} />
        <Person look={CAST.secChief} pose={{ x: 1.3, z: -1.2, ry: -30, armL: REST, armR: REST, lookX: -0.5 }} />
      </Casino>
    ),
  }),
  S16: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.3, 1.6, 3.6], [0, 1.35, -0.4], 36), cm([0.3, 1.6, 3.4], [0, 1.35, -0.4], 36), t, len),
    world: (
      <Casino f={g} sign="THE RITZ" table={false} lamp={6}>
        {[CAST.tosaMate, CAST.tosa, CAST.tosaBlonde].map((look, i) => (
          <Person key={i} look={look} pose={{ x: -0.6 + i * 0.6, ...walker(t + i * 4, -1.0), armL: REST, armR: REST, lookY: -0.2, heavy: i === 1 ? 0 : 0.3 }} />
        ))}
        <Person look={CAST.agent} pose={{ x: -1.1, ...walker(t, -1.3), armL: REST, armR: REST }} />
        <Person look={CAST.agent2} pose={{ x: 1.1, ...walker(t + 2, -1.35), armL: REST, armR: REST }} />
      </Casino>
    ),
  }),
  S17: (t, len, g) => ({
    light: "warm",
    cam: cm([0, DESK_Y + 1.7, 0.35], [0, DESK_Y, 0.02], 34),
    world: (
      <Interview f={g} lamp={false}>
        <pointLight position={[0.3, DESK_Y + 1.2, 0.5]} intensity={2.2} distance={3} color="#FFE6C0" />
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <group key={x} visible={t >= i * 5}>
            <Phone p={[x, DESK_Y + 0.012, -0.08]} r={[-Math.PI / 2, 0, 0]} s={0.9} screen="off" f={g} />
          </group>
        ))}
        <group visible={t >= 22}>
          <Box w={0.12} h={0.016} d={0.18} c="#3A3E46" p={[0, DESK_Y + 0.004, 0.18]} />
          <Box w={0.09} h={0.002} d={0.09} c="#5A7A5A" p={[0, DESK_Y + 0.021, 0.15]} shadow={false} />
        </group>
      </Interview>
    ),
    over: <Chip x={500} y={300} at={wd("17", "four")} text="4 PHONES" kind="pop" size={80} color={AMBER} />,
  }),
  // ---------- the laser story ----------
  S18: (t, len, g) => {
    const lift = ramp(t, 8, 24);
    return {
      light: "warm",
      cam: glide(cm([0.1, 1.6, 1.4], [0, DESK_Y + 0.05, -0.1], 34), cm([0.1, 1.6, 1.3], [0, DESK_Y + 0.05, -0.1], 34), t, len),
      world: (
        <Office f={g} night plate="">
          <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#5A3A26" />
          {[0, 1, 2, 3].map((i) => <Newspaper key={i} p={[-0.2 + i * 0.03, DESK_Y + 0.012 + i * 0.008, -0.05 + i * 0.02]} r={[-Math.PI / 2, 0, 0.08 * i]} />)}
          <Newspaper p={[0.25, DESK_Y + 0.05 + lift * 0.35, 0.0 + lift * 0.1]} r={[-Math.PI / 2 + lift * 1.1, 0, -0.1]} />
          <DeskLamp p={[-0.5, DESK_Y, -0.2]} />
        </Office>
      ),
    };
  },
  S19: (t, len, g) => {
    const sp = spinAt(t + 60, { drop: 600 });
    return {
      light: "cool",
      cam: glide(cm([WX + 0.95, 1.45, 0.75], [WX + 0.2, TABLE_Y, -0.2], 34), cm([WX + 0.9, 1.45, 0.65], [WX + 0.2, TABLE_Y, -0.2], 34), t, len),
      world: (
        <Ritz f={g} spin={sp} dim={0.55}>
          <LaserRig g={g} beam={ramp(g, wd("19", "laser"), wd("19", "laser") + 8)} spin={sp} />
        </Ritz>
      ),
    };
  },
  S20: (t, len, g) => ({
    light: "warm",
    cam: cm([0, DESK_Y + 1.15, 0.1], [0, DESK_Y, 0.0], 34),
    post: { bloom: 0.08 },
    world: (
      <Office f={g} night plate="">
        <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#5A3A26" />
        <Newspaper p={[0, DESK_Y + 0.012, 0]} r={[-Math.PI / 2, 0, 0.04]} />
        <pointLight position={[0.2, DESK_Y + 0.9, 0.4]} intensity={0.9} distance={2} color="#FFE6C0" />
      </Office>
    ),
  }),
  S21: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.35, 1.55, 2.7], [0, 1.2, -0.5], 34), cm([0.35, 1.55, 2.55], [0, 1.2, -0.5], 34), t, len),
    world: (
      <Interview f={g} lamp={false}>
        <pointLight position={[0.8, 1.9, 0.9]} intensity={3} distance={4} color="#FFE6C0" />
        {[-0.3, -0.1, 0.1, 0.3].map((x) => <Phone key={x} p={[x, DESK_Y + 0.012, 0.1]} r={[-Math.PI / 2, 0, 0]} s={0.9} screen="off" f={g} />)}
        <Box w={0.3} h={0.14} d={0.2} c="#2A2224" p={[0.55, DESK_Y, -0.1]} />
        <Person look={CAST.agent2} pose={{ z: -0.6, ...act(t, [[0, { armL: { f: 50, e: -50, o: 10 }, armR: { f: 55, e: -45, o: 8 }, lookY: -0.6, pitch: 10 }], [30, { armL: { f: 55, e: -40, o: 10 }, armR: { f: 62, e: -30, o: 10 }, lookY: -0.6, pitch: 10 }], [70, { armL: { f: 30, e: -60, o: 30 }, armR: { f: 30, e: -60, o: 30 }, lookY: 0, pitch: 0, shrug: 0.6, brow: 0.4 }]]) }} />
      </Interview>
    ),
  }),
  S22: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.05, DESK_Y + 1.0, 0.75], [0, DESK_Y + 0.05, -0.05], 34), cm([0.05, DESK_Y + 0.95, 0.65], [0, DESK_Y + 0.05, -0.05], 34), t, len),
    world: (
      <Office f={g} night plate="">
        <Desk p={[0, 0, 0]} w={1.4} d={0.75} c="#5A3A26" />
        <Book p={[0, DESK_Y + 0.006, -0.02]} open={ramp(t, 0, 16)} c="#4A2A1E" />
        <DeskLamp p={[-0.5, DESK_Y, -0.25]} />
      </Office>
    ),
    over: <Chip x={500} y={300} at={wd("22", "eighteen")} text="1845" kind="pop" size={100} color={AMBER} />,
  }),
  S23: (t, len, g) => {
    const slide = ramp(t, 8, 30);
    return {
      light: "warm",
      cam: glide(cm([0.3, 1.6, 2.7], [0, 1.25, -0.6], 34), cm([0.28, 1.6, 2.55], [0, 1.25, -0.6], 34), t, len),
      world: (
        <CashCage sign="CASHIER">
          <Person look={extra(83, { top: "#17171E", shirt: "#F3EFE6", tie: N.gold })} pose={{ z: -1.0, armL: REST, armR: { f: 60, e: -30, o: 8 }, lookY: -0.4 }} />
          {[0, 1, 2, 3, 4].map((i) => <Bundle key={i} p={[-0.2 + i * 0.1, 1.06, -0.3 + slide * 0.3]} />)}
          <Person look={CAST.tosa} pose={{ x: 0.8, z: 0.95, ry: 210, armL: REST, armR: { f: 40, e: -40, o: 8 } }} />
        </CashCage>
      ),
      over: <Chip x={500} y={300} at={wd("24", "drop")} text="NO CHARGES" kind="pop" size={78} color={TEAL} />,
    };
  },
  S24: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0.9, 1.7, 2.6], [0, 1.65, -1.6], 36), cm([0.86, 1.7, 2.45], [0, 1.65, -1.6], 36), t, len),
    world: (
      <Void c="#101418">
        <Box w={6} h={0.04} d={6} c="#22262C" p={[0, 0, 0]} />
        <Box w={2.6} h={3.2} d={0.2} c="#2A2420" p={[0, 0, -3.4]} />
        <Box w={1.2} h={2.2} d={0.06} c="#3A2A1E" p={[0, 0, -3.28]} o={{ e: "#FFD08A", ei: 0.5 }} />
        <Box w={2.4} h={0.12} d={1.4} c="#141218" p={[0, 2.3, -2.7]} />
        <Panel map={signTex("THE RITZ", "#0B0B10", N.gold, 1024, 200, 130)} w={1.6} h={0.31} p={[0, 2.62, -2.0]} glow={1.2} />
        <pointLight position={[0, 2.4, -2.2]} intensity={5} distance={5} color="#FFD6A0" />
        <pointLight position={[1.5, 3, 1]} intensity={2} distance={6} color="#9EC8E0" />
        {[CAST.tosaMate, CAST.tosa, CAST.tosaBlonde].map((look, i) => (
          <Person key={i} look={look} pose={{ x: -0.5 + i * 0.55 + t * 0.008, z: -2.2 + t * 0.022 + i * 0.1, ry: 15, ...walk(t * 0.32 + i, 22), armL: { f: 8, e: -10, o: 6 }, armR: REST, smile: i === 1 ? 0.2 : 0 }} holdL={<Bag />} />
        ))}
      </Void>
    ),
  }),
  // ---------- the twist ----------
  S25: (t, len, g) => {
    const sp = spinAt(t + 60, { drop: 600 });
    return {
      light: "cool",
      cam: cm([WX + 0.9, 1.45, 0.7], [WX + 0.2, TABLE_Y, -0.2], 34),
      world: (
        <Ritz f={g} spin={sp} dim={0.55}>
          <LaserRig g={g} beam={1} spin={sp} />
        </Ritz>
      ),
    };
  },
  S26: (t, len, g) => {
    const sp = spinAt(t + 90, { drop: 600 });
    const off = wd("27", "no");
    return {
      light: "cool",
      cam: cm([WX + 0.9, 1.45, 0.7], [WX + 0.2, TABLE_Y, -0.2], 34),
      world: (
        <Ritz f={g} spin={sp} dim={0.55}>
          <LaserRig g={g} beam={g < off ? 1 : 0} spin={sp} />
        </Ritz>
      ),
      over: <Chip x={500} y={300} at={wd("27", "laser")} text="NO LASER" kind="pop" size={92} color={RED} />,
    };
  },
  S27: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.75, 1.4, 1.9], [0, 1.1, -0.4], 34), cm([0.7, 1.4, 1.78], [0, 1.1, -0.4], 34), t, len),
    world: (
      <Cafe>
        <Person look={CAST.tosa} pose={{ z: -0.5, ...SIT, armL: { f: 40, e: -60, o: 10 }, armR: { f: 40, e: -60, o: 10 }, lookX: 0.5, smile: 0.25 }} />
        <Person look={CAST.reporter} pose={{ x: 0.62, z: 0.25, ry: -60, ...SIT, armL: { f: 40, e: -60, o: 10 }, armR: { f: 50, e: -70, o: 10 } }} />
      </Cafe>
    ),
    over: <Chip x={500} y={300} at={wd("28", "croatia")} text="CROATIA" kind="slide" size={76} color={TEAL} />,
  }),
  S28: (t, len, g) => ({
    light: "warm",
    cam: cm([0.15, 1.36, 0.75], [0, 1.3, -0.5], 30),
    world: (
      <Cafe>
        <Person look={CAST.tosa} pose={{ z: -0.5, ...SIT, yaw: Math.sin(t * 0.32) * 14 * ramp(t, 4, 10) * (1 - ramp(t, 30, 38)), armL: { f: 40, e: -60, o: 10 + ramp(t, 20, 32) * 25 }, armR: { f: 40, e: -60, o: 10 + ramp(t, 20, 32) * 25 }, brow: 0.5, mouth: talking(g, lineEnd("29")) }} />
      </Cafe>
    ),
  }),
  S29: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.1, 1.45, 1.6], [0, 1.0, -0.4], 34), cm([0.1, 1.45, 1.48], [0, 1.0, -0.4], 34), t, len),
    world: (
      <Void c="#1E1A18">
        <Desk p={[0, 0, 0]} w={1.2} d={0.8} c="#4A3020" />
        <RouletteWheel p={[0, DESK_Y, 0.05]} s={0.75} ball={spinAt(t + 30, { drop: 400 })} />
        <Person look={CAST.tosa} pose={{ z: -0.72, ...SIT, armL: { f: 40, e: -50, o: 8 }, armR: { f: 40, e: -50, o: 8 }, lookY: -0.55, pitch: 10, lookX: Math.sin(g * 0.18) * 0.3 }} />
        <pointLight position={[0.2, 1.9, 0.5]} intensity={3.4} distance={3.4} color="#FFD6A0" />
      </Void>
    ),
  }),
  S30: (t, len, g) => ({
    light: "stage",
    cam: cm([WX + 0.55, 1.28, 0.8], [WX, WHEEL_Y + 0.04, 0], 34),
    world: <Ritz f={g} spin={spinAt(t + 120, { drop: 600, w0: 0.2 })} dim={0.6} />,
  }),
  S31: (t, len, g) => {
    const C = Math.floor(len / 3);
    const i = Math.min(2, Math.floor(t / C));
    const ZONE = 2.2;
    return {
      light: "stage",
      cam: cm([WX, 3.0, 0.4], [WX, WHEEL_Y + 0.05, 0], 40),
      world: (
        <Casino f={g} sign="THE RITZ" table={false} lamp={7}>
          <RouletteWheel p={[WX, WHEEL_Y, 0]} tilt={3} ball={spinAt(t - i * C, { drop: C - 14, zone: ZONE, pocket: [3, 19, 30][i], w0: 0.26 })} mark={ramp(t, C - 14, C - 8)} zone={ZONE} />
          <Box w={2.4} h={0.06} d={1.2} c="#3A2216" p={[WX + 0.6, WHEEL_Y - 0.06, 0]} />
        </Casino>
      ),
    };
  },
  S32: (t, len, g) => ({
    light: "warm",
    cam: glide(cm([0.42, 1.34, 2.5], [0.02, 1.16, -0.75], 32), cm([0.42, 1.34, 2.35], [0.02, 1.16, -0.75], 32), t, len),
    world: (
      <Office f={g} night plate="">
        <Person look={BARNETT} pose={OfficeSeat({ z: -0.78, armR: act(t, [[0, { armR: { f: 30, e: -70, o: 10 } }], [24, { armR: { f: 62, e: -58, o: 16 } }], [60, { armR: { f: 40, e: -70, o: 12 } }]]).armR, brow: 0.4, smirk: 0.2, mouth: talking(g, lineEnd("33")) })} />
      </Office>
    ),
  }),
  S33: (t, len, g) => {
    const k = ramp(t, 0, len);
    return {
      light: "stage",
      cam: glide(cm([0.5, 2.0, 4.0], [-0.1, 1.0, -0.1], 36), cm([0.45, 2.0, 3.8], [-0.1, 1.0, -0.1], 36), t, len),
      world: (
        <Casino f={g} sign="THE RITZ" table={false} lamp={7}>
          <RouletteTable rot={g * 0.03} />
          <group position={[WX - 0.2 + k * 1.8, 0.95, -1.25]}>
            <RouletteWheel p={[0, 0, 0]} rot={0.3} />
          </group>
          <Person look={WORKER(90)} pose={{ x: WX - 0.65 + k * 1.8, z: -1.25, ry: 90, lean: 10, ...walk(t * 0.28, 14), armL: { f: 70, e: -30, o: 6 }, armR: { f: 70, e: -30, o: 6 } }} />
          <Person look={WORKER(91)} pose={{ x: WX + 0.25 + k * 1.8, z: -1.25, ry: 270, lean: 10, ...walk(t * 0.28 + 3, 14), armL: { f: 70, e: -30, o: 6 }, armR: { f: 70, e: -30, o: 6 } }} />
        </Casino>
      ),
    };
  },
  // ---------- the end ----------
  S34: (t, len, g) => {
    const launch = 8;
    return {
      light: "stage",
      cam: glide(cm([0.55, 1.95, 2.2], [0.1, 0.9, -0.3], 36), cm([0.55, 1.95, 2.05], [0.1, 0.9, -0.3], 36), t, len),
      world: (
        <Ritz f={g} spin={spinAt(t - launch, { drop: 400 })} croupier={act(t, [[0, { armR: { f: 30, e: -40, o: 8 } }], [launch, { armR: { f: 70, e: -10, o: 20 } }], [launch + 10, { armR: { f: 30, e: -40, o: 8 } }]])}>
          <Players g={g} lunge={ramp(t, launch + 30, launch + 42)} />
          <Bets k={ramp(t, launch + 40, launch + 70)} />
        </Ritz>
      ),
    };
  },
  S35: (t, len, g) => ({
    light: "stage",
    cam: cm([-0.4, 1.6, 1.6], [-0.6, 1.5, -0.6], 32),
    world: (
      <Ritz f={g}>
        <Person look={CAST.pitboss} pose={{ x: -0.6, z: -0.75, armL: REST, armR: REST, shrug: ramp(t, 2, 12) * 0.7, brow: 0.4, smirk: 0.3, lookX: 0.3 }} />
      </Ritz>
    ),
  }),
  S36: (t, len, g) => ({
    light: "night",
    cam: glide(cm([0, 2.6, 6.2], [0, 1.1, -1.5], 38), cm([0, 2.55, 5.9], [0, 1.1, -1.5], 38), t, len),
    world: (
      <Casino f={g} sign="ROULETTE" table={false} lamp={5} dim={0.8}>
        {[[-1.4, -0.9], [1.4, -0.9], [0, 1.4]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]} scale={0.85}>
            <RouletteTable ball={spinAt(t + i * 40, { drop: 600 })} />
            {[0, 1].map((k) => <Person key={k} look={extra(100 + i * 3 + k)} pose={{ x: k * 0.6, z: -0.8, armL: REST, armR: REST, lookX: -0.6, lookY: -0.4 }} />)}
          </group>
        ))}
      </Casino>
    ),
  }),
  S37: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([-0.62, 1.5, 2.45], [-0.28, 1.0, -0.4], 40), LOOP_CAM, t, len),
    world: <HookSet g={g} x={g - (duration() - 1)} />,
  }),
};

const ROOMS = [
  ["S1", "S12", "sfx/synth/room-casino.wav"],
  ["S13", "S13", "sfx/synth/room-office.wav"],
  ["S14", "S16", "sfx/synth/room-casino.wav"],
  ["S17", "S17", "sfx/synth/room-interview.wav"],
  ["S19", "S19", "sfx/synth/room-casino.wav"],
  ["S21", "S21", "sfx/synth/room-interview.wav"],
  ["S23", "S23", "sfx/synth/room-casino.wav"],
  ["S30", "S31", "sfx/synth/room-casino.wav"],
  ["S32", "S32", "sfx/synth/room-office.wav"],
  ["S33", "S37", "sfx/synth/room-casino.wav"],
] as const;

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // silence after "The laser scam." and "There was no laser.", low under the last line
  const duck = (g: number) =>
    interpolate(
      g,
      [lineEnd("19"), lineEnd("20") + 2, lineStart("21") + 4, lineStart("21") + 16, lineEnd("26"), lineEnd("27") + 2, lineStart("28") + 4, lineStart("28") + 20, lineStart("37"), lineStart("37") + 12],
      [1, 0, 0, 0.8, 0.8, 0, 0, 0.8, 0.8, 0.35],
      CLAMP,
    );
  const lunge = wd("07", "lunge");
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="ritz-roulette" music={MUSIC} duck={duck} rooms={ROOMS} safeGuide={safeGuide}>
      <Sfx file="sfx/synth/ball-rattle.wav" at={at("S1")} level={-30} seconds={4} />
      <Sfx file="sfx/synth/ball-rattle.wav" at={wd("06", "waits") - 6} level={-28} seconds={3} />
      <Sfx file="sfx/synth/chip-stack.wav" at={lunge + 4} level={-24} align="onset" />
      <Sfx file="sfx/synth/ball-drop.wav" at={at("S8") + 16} level={-17} align="onset" />
      <Sfx file="sfx/synth/chip-stack.wav" at={at("S10") + 24} level={-22} align="onset" />
      <Sfx file="sfx/synth/chip-stack.wav" at={wd("11", "million")} level={-24} align="onset" />
      <Sfx file="sfx/synth/paper-rush.wav" at={at("S18") + 8} level={-20} seconds={1.2} />
      <Sfx file="sfx/hit/punch-impact-hit-567196.mp3" at={lineEnd("20") + 3} level={-24} align="onset" />
      <Sfx file="sfx/click/mouse-click-351398.mp3" at={wd("27", "no")} level={-24} align="onset" />
      <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={lineEnd("27")} level={-25} align="onset" seconds={1.2} />
      <Sfx file="sfx/synth/ball-drop.wav" at={at("S31") + Math.floor((SHOTS.find((s) => s.id === "S31")?.len ?? 90) / 3) - 14} level={-18} align="onset" />
      <Sfx file="sfx/synth/ball-rattle.wav" at={at("S34") + 8} level={-22} seconds={2} />
      <Sfx file="sfx/synth/ball-rattle.wav" at={at("S37")} level={-30} seconds={3} />
    </Episode>
  );
};

/** 9:16 thumbnail: his face behind the wheel, the chip hill; the money and the twist. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" post={{ bloom: 0.15 }} cam={cm([-0.5, 1.5, 1.75], [-0.12, 1.12, -0.5], 40)} over={<ThumbText top="£1.3 MILLION" bottom="NO LASER" size={110} y={250} />}>
    <Ritz f={0} spin={loopSpin(0)}>
      <Players g={0} tosa={{ lookX: -0.7, lookY: -0.5, yaw: -18, pitch: 6, smirk: 0.45, browL: 0.4 }} blonde={false} />
      <ChipHill p={[0.4, TABLE_Y + 0.006, -0.34]} k={1} cols={4} rows={2} max={26} seed={5} />
      <pointLight position={[-0.3, 1.8, 0.5]} intensity={2.4} distance={3.2} color="#FFE2BE" />
    </Ritz>
  </Shot3D>
);
