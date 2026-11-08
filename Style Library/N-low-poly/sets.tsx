/**
 * Style N sets (one world per place, built once, shot from many angles) + the cast.
 * Every set is centred on its action at the origin; the camera of each shot picks the angle.
 */
import React from "react";
import { Box, ctex, cyl, D, ico, type Look, N, P, Panel, Person, plate as plateGeo, PLANE, type Pose, rng, signTex, SIGN_FONT, useLiveTex, type V3 } from "./lowpoly";
import { Chair, Chalkboard, Clock, Crate, Crt, Desk, DeskLamp, Frame, LedBoard, Pile, Printer, RngRack, CeilingCam, scatter, Ticket, Van } from "./props";
import { cone, torus } from "./lowpoly";

// ---------------- cast ----------------
export const CAST = {
  /** Stefan Mandel: grey receding hair, glasses, moustache, brown suit (no photo face) */
  mandel: { skin: "#E6B693", hair: "#CFCAC2", hairStyle: "recede", glasses: true, moustache: true, top: "#7A5236", shirt: "#F3EFE6", tie: "#8A2A34", pants: "#4A3426", shoes: "#2A1E18", eye: "#4A5E3A" } as Look,
  clerk: { skin: "#C98E6A", hair: "#2A1A14", hairStyle: "short", top: "#2E7D5B", shirt: "#F3EFE6", pants: "#2A2A34" } as Look,
  agent: { skin: "#D9A47E", hair: "#1E1618", hairStyle: "short", shades: true, top: "#1C1C24", shirt: "#F3EFE6", tie: "#111116", pants: "#1C1C24", build: 1.1 } as Look,
  agent2: { skin: "#8E5C3E", hair: "#141012", hairStyle: "short", top: "#22222A", shirt: "#F3EFE6", tie: "#5A1E22", pants: "#22222A", build: 1.05 } as Look,
  courier: { skin: "#D8A27C", hair: "#3A2A1E", hairStyle: "cap", capColor: N.blue, top: "#2F5D9A", pants: "#3A3A44" } as Look,
  lawmaker: { skin: "#D9A47E", hair: "#3A2E2A", hairStyle: "short", top: "#2C3A5A", shirt: "#F3EFE6", tie: N.red, pants: "#2C3A5A", build: 1.15 } as Look,
  /** casino staff */
  dealer: { skin: "#D9A47E", hair: "#2A1A14", hairStyle: "long", top: "#17171E", shirt: "#F3EFE6", tie: N.gold, pants: "#17171E" } as Look,
  pitboss: { skin: "#E2A882", hair: "#5A4632", hairStyle: "short", top: "#2A2E3A", shirt: "#F3EFE6", tie: "#8A2A34", pants: "#2A2E3A", build: 1.08 } as Look,
  /** Phil Ivey: close-cropped hair, dark jacket (no photo face) */
  ivey: { skin: "#6E4630", hair: "#141012", hairStyle: "short", top: "#20242C", shirt: "#3A4048", pants: "#191A20", eye: "#2A1A14", lip: "#6E3A34", build: 1.04 } as Look,
  /** Eddie Tipton: thinning grey-brown hair, plain work shirt (no photo face) */
  tipton: { skin: "#E2B08C", hair: "#6E6052", hairStyle: "recede", top: "#3F4E5C", pants: "#2A2C34", eye: "#3A3A34", build: 1.08 } as Look,
  /** a lottery official */
  official: { skin: "#E6B693", hair: "#3A3028", hairStyle: "short", top: "#26303E", shirt: "#F3EFE6", tie: "#2E6E7A", pants: "#26303E" } as Look,
  /** his partner at the table */
  partner: { skin: "#E6BE9C", hair: "#15100F", hairStyle: "long", top: "#7A2434", pants: "#20202A" } as Look,
};
const SKINS = ["#F0C8A8", "#E2A882", "#C98E6A", "#9C6644", "#6E4630", "#F5D2B8"];
const HAIRS = ["#2A1A14", "#5A3A22", "#C9A15A", "#1A1416", "#8A5A3A", "#D8D2C8"];
const TOPS = ["#C0563F", "#3B6EA8", "#E2B24A", "#5E8A5A", "#8A5AA8", "#D9D0BE", "#2E6E7A", "#B84A6A"];
/** a seeded extra (workers, investors, crowd) */
export const extra = (seed: number, over: Partial<Look> = {}): Look => {
  const R = rng(seed * 977 + 3);
  const pick = <T,>(a: T[]) => a[Math.floor(R() * a.length)];
  const style = pick(["short", "short", "long", "recede", "bald", "cap"] as const);
  const specs = R() < 0.2;
  const tache = R() < 0.15;
  return {
    skin: pick(SKINS),
    hair: pick(HAIRS),
    hairStyle: style,
    capColor: pick(TOPS),
    top: pick(TOPS),
    pants: pick(["#2A2A34", "#3A3428", "#4A5A72", "#5A4632"]),
    // a receding hairline with glasses and a moustache is Mandel: no clones in his own crowd
    glasses: specs && style !== "recede",
    moustache: tache && style !== "recede",
    build: 0.92 + R() * 0.2,
    tall: 0.94 + R() * 0.1,
    ...over,
  };
};

// ---------------- shared shell ----------------
const tiles = (a: string, b: string, n = 8) =>
  ctex(`tiles${a}${b}${n}`, 512, 512, (c) => {
    const s = 512 / n;
    for (let i = 0; i < n; i++)
      for (let k = 0; k < n; k++) {
        c.fillStyle = (i + k) % 2 ? a : b;
        c.fillRect(i * s, k * s, s, s);
      }
  });
const concrete = () =>
  ctex("concrete", 512, 512, (c, R) => {
    c.fillStyle = "#8C8C88";
    c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 600; i++) {
      c.fillStyle = `rgba(0,0,0,${R() * 0.08})`;
      c.fillRect(R() * 512, R() * 512, 6 + R() * 30, 6 + R() * 30);
    }
    c.fillStyle = "rgba(0,0,0,.25)";
    c.fillRect(0, 0, 512, 3);
    c.fillRect(0, 0, 3, 512);
  });
export const Floor: React.FC<{ w: number; d: number; c: string; map?: ReturnType<typeof ctex>; p?: V3 }> = ({ w, d, c, map, p = [0, 0, 0] }) => (
  <P g={PLANE} c={c} p={p} r={[-Math.PI / 2, 0, 0]} s={[w, d, 1]} o={{ map }} shadow={false} />
);
/** back wall at z, side walls at ±w/2 */
const Shell: React.FC<{ w: number; d: number; h: number; z: number; wall: string; side?: string }> = ({ w, d, h, z, wall, side }) => (
  <>
    <Box w={w} h={h} d={0.2} c={wall} p={[0, 0, z]} />
    <Box w={0.2} h={h} d={d} c={side ?? wall} p={[w / 2, 0, z + d / 2]} />
    <Box w={0.2} h={h} d={d} c={side ?? wall} p={[-w / 2, 0, z + d / 2]} />
  </>
);

// ---------------- 1 · lottery shop ----------------
/** jackpot board text: "$27,000,000" style */
export const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const JackpotBoard: React.FC<{ p: V3; amount: number | null; label?: string }> = ({ p, amount, label = "JACKPOT" }) => {
  const tex = useLiveTex(1024, 512, (c) => {
    c.fillStyle = "#120E16";
    c.fillRect(0, 0, 1024, 512);
    c.fillStyle = N.gold;
    c.font = `900 110px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(label, 512, amount === null ? 256 : 120);
    if (amount === null) return;
    c.fillStyle = "#FF5A4A";
    c.font = `900 150px Consolas, monospace`;
    c.fillText(money(amount), 512, 330);
  });
  return (
    <group position={p}>
      <Box w={2.3} h={1.25} d={0.12} c="#2A2230" p={[0, -0.62, -0.06]} />
      <Panel map={tex} w={2.16} h={1.08} p={[0, 0, 0.01]} />
    </group>
  );
};
export const panelWall = (base: string, line: string, key: string) =>
  ctex(`wall${key}${base}`, 512, 512, (c, R) => {
    c.fillStyle = base;
    c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 8; i++) {
      c.fillStyle = line;
      c.fillRect(i * 64, 0, 3, 512);
      c.fillStyle = `rgba(0,0,0,${0.03 + R() * 0.05})`;
      c.fillRect(i * 64 + 3, 0, 61, 512);
    }
    for (let i = 0; i < 300; i++) {
      c.fillStyle = `rgba(255,255,255,${R() * 0.012})`;
      c.fillRect(R() * 512, R() * 512, 2 + R() * 18, 2 + R() * 18);
    }
  }, [3, 1]);
export const woodTex = (key: string, base: string) =>
  ctex(`wood${key}${base}`, 512, 512, (c, R) => {
    c.fillStyle = base;
    c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) {
      c.strokeStyle = `rgba(20,8,0,${0.05 + R() * 0.12})`;
      c.lineWidth = 1 + R() * 2;
      const y = R() * 512;
      c.beginPath();
      c.moveTo(0, y);
      c.bezierCurveTo(170, y + R() * 14 - 7, 340, y + R() * 14 - 7, 512, y + R() * 6 - 3);
      c.stroke();
    }
  });
/** a lamp you can see: shade, glowing bulb, its own pool of light */
export const Pendant: React.FC<{ p: V3; c?: string; i?: number; drop?: number }> = ({ p, c = "#FFC27A", i = 9, drop = 1.2 }) => (
  <group position={p}>
    <P g={cyl(0.008, 0.008, drop, 4)} c="#15110F" />
    <P g={cone(0.26, 0.2, 10)} c="#17302E" p={[0, -0.2, 0]} o={{ metal: 0.3, rough: 0.5 }} />
    <P g={ico(0.07, 1)} c="#FFF2D0" p={[0, -0.21, 0]} o={{ e: "#FFD08A", ei: 7 }} shadow={false} />
    <pointLight position={[0, -0.3, 0]} intensity={i} distance={7} decay={2} color={c} />
  </group>
);
/** glowing tube: a thin emissive bar that the bloom pass turns into neon */
export const Neon: React.FC<{ p: V3; w: number; h?: number; c: string }> = ({ p, w, h = 0.035, c }) => <Box w={w} h={h} d={0.03} c={c} p={p} o={{ e: c, ei: 2.2 }} shadow={false} />;
const Plant: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <P g={cyl(0.17, 0.13, 0.32, 8)} c="#3E2A20" />
    {Array.from({ length: 9 }, (_, i) => (
      <P key={i} g={cone(0.075, 0.62, 4)} c={i % 2 ? "#1F5A42" : "#2A6E50"} p={[0, 0.28, 0]} r={[Math.cos(i * 2.4) * 0.55, i, Math.sin(i * 2.4) * 0.55]} s={[1, 1, 0.3]} />
    ))}
  </group>
);
export const Kiosk: React.FC<{ f: number; jackpot?: number | null; board?: string; clerk?: Pose | null; sign?: string; children?: React.ReactNode }> = ({ f, jackpot = null, board, clerk = {}, sign = "LOTTO", children }) => {
  const R = rng(9);
  const rack = Array.from({ length: 6 * 12 }, (_, i) => ({ x: -2.9 + (i % 12) * 0.2, y: 0.95 + Math.floor(i / 12) * 0.22, c: ["#E0A93C", "#C23A30", "#2F78B8", "#2F8E58", "#D8682A", "#E8C8BE"][Math.floor(R() * 6)] }));
  const wood = woodTex("kiosk", "#4A2A1C");
  const flick = 0.92 + 0.08 * Math.sin(f * 0.37) * Math.sin(f * 0.11);
  return (
    <group>
      <Floor w={12} d={12} c="#FFFFFF" map={tiles("#16302F", "#6E664E", 12)} p={[0, 0, 2]} />
      <Box w={9} h={3.6} d={0.2} c="#FFFFFF" p={[0, 0, -3]} o={{ map: panelWall("#1C3F42", "#0F2628", "kiosk") }} />
      <Box w={0.2} h={3.6} d={9} c="#FFFFFF" p={[4.5, 0, 1.5]} o={{ map: panelWall("#1A3A3D", "#0F2628", "kioskS") }} />
      <Box w={0.2} h={3.6} d={9} c="#FFFFFF" p={[-4.5, 0, 1.5]} o={{ map: panelWall("#1A3A3D", "#0F2628", "kioskS") }} />
      <Box w={9} h={0.9} d={0.24} c="#FFFFFF" p={[0, 0, -2.96]} o={{ map: wood }} />
      <Box w={9} h={0.06} d={0.26} c={N.gold} p={[0, 0.9, -2.96]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
      {/* neon sign: dark board, letters and a tube frame that bloom */}
      <Box w={3} h={0.86} d={0.1} c="#0C0C12" p={[0.2, 2.72, -2.86]} />
      <Panel map={signTex(sign, "#0B0B10", "#FF6A3C")} w={2.7} h={0.68} p={[0.2, 3.15, -2.8]} glow={1.25 * flick} />
      <Neon p={[0.2, 3.56, -2.78]} w={2.96} c="#FFB347" />
      <Neon p={[0.2, 2.74, -2.78]} w={2.96} c="#FFB347" />
      <JackpotBoard p={[2.3, 2.1, -2.84]} amount={jackpot} label={board} />
      {/* ticket rack on the back wall */}
      <Box w={2.6} h={1.5} d={0.12} c="#2A1A12" p={[-1.8, 0.85, -2.9]} />
      {rack.map((r, i) => (
        <Box key={i} w={0.16} h={0.18} d={0.02} c={r.c} p={[r.x + 0.1, r.y, -2.83]} shadow={false} />
      ))}
            {/* counter: dark wood, brass rail, a lit strip of tickets under glass */}
      <Box w={3.6} h={1.0} d={0.8} c="#FFFFFF" p={[0, 0, -1.2]} o={{ map: wood }} />
      <Box w={3.7} h={0.06} d={0.9} c="#2A1A12" p={[0, 1.0, -1.2]} o={{ rough: 0.35 }} />
      <Box w={3.3} h={0.34} d={0.02} c="#FFE9C0" p={[0, 0.5, -0.79]} o={{ e: "#FFD9A0", ei: 0.75 }} shadow={false} />
      {Array.from({ length: 16 }, (_, i) => (
        <Box key={i} w={0.15} h={0.26} d={0.012} c={["#C23A30", "#E0A93C", "#2F78B8", "#2F8E58"][i % 4]} p={[-1.55 + i * 0.207, 0.54, -0.775]} shadow={false} />
      ))}
      <Box w={3.62} h={0.05} d={0.82} c={N.gold} p={[0, 0.9, -1.2]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
      <group position={[0.9, 1.06, -1.3]}>
        <Box w={0.5} h={0.18} d={0.4} c="#1A1A22" />
        <Box w={0.44} h={0.3} d={0.06} c="#1A1A22" p={[0, 0.18, -0.12]} r={[-0.3, 0, 0]} />
        <Panel map={signTex("", "#0A2038", "#7FD0FF", 512, 256, 100)} w={0.38} h={0.24} p={[0, 0.34, -0.06]} r={[-0.3, 0, 0]} glow={1.5} />
      </group>
      <Pendant p={[-1.2, 3.6, -1.2]} i={7} />
      <Pendant p={[1.2, 3.6, -1.2]} i={7} />
      <pointLight position={[0, 2.5, 2.4]} intensity={6} distance={9} color="#FFD6A0" />
      <Plant p={[-3.8, 0, -2.3]} />
      <Plant p={[3.9, 0, -2.3]} />
      {clerk ? <Person look={CAST.clerk} pose={{ z: -1.9, ...clerk }} /> : null}
      {children}
    </group>
  );
};

// ---------------- 2 · draw studio ----------------
export const Studio: React.FC<{ f: number; off?: boolean; dim?: number; children?: React.ReactNode }> = ({ f, off, dim = 0, children }) => {
  const bulbs = Array.from({ length: 26 }, (_, i) => i);
  const step = Math.floor(f / 4);
  return (
    <group>
      <P g={PLANE} c="#1A1426" r={[-Math.PI / 2, 0, 0]} s={[30, 30, 1]} o={{ metal: 0.35, rough: 0.35 }} shadow={false} />
      <P g={cyl(2.3, 2.5, 0.25, 12)} c="#2E2440" o={{ metal: 0.3, rough: 0.4 }} />
      <P g={torus(2.34, 0.04, 16)} c={N.gold} p={[0, 0.25, 0]} r={[Math.PI / 2, 0, 0]} o={{ e: N.gold, ei: 0.7 }} shadow={false} />
      {/* backdrop arch with chasing bulbs */}
      {[-1, 1].map((s) => (
        <Box key={s} w={0.7} h={5.2} d={0.5} c="#3A1E4A" p={[s * 3.6, 0, -3.5]} />
      ))}
      <Box w={7.9} h={0.7} d={0.5} c="#3A1E4A" p={[0, 4.6, -3.5]} />
      <Box w={7} h={4.6} d={0.2} c="#1E1430" p={[0, 0, -3.8]} />
      {bulbs.map((i) => {
        const pos: V3 = i < 8 ? [-3.6, 0.6 + i * 0.55, -3.2] : i < 18 ? [-3.2 + (i - 8) * 0.71, 4.95, -3.2] : [3.6, 4.45 - (i - 18) * 0.55, -3.2];
        const on = !off && (i + step) % 3 === 0;
        return <P key={i} g={ico(0.09, 1)} c="#FFF2C8" p={pos} o={{ e: on ? "#FFD98A" : "#5A4A30", ei: on ? 3 : 0.6 }} shadow={false} />;
      })}
      <spotLight position={[0, 9, 4]} angle={0.42} penumbra={0.6} intensity={70 * (1 - dim * 0.8)} distance={22} color="#FFF0DA" castShadow />
      <pointLight position={[-4, 2, 1]} intensity={14 * (1 - dim)} distance={10} color="#8A6CFF" />
      <pointLight position={[4, 2, 1]} intensity={14 * (1 - dim)} distance={10} color="#FF6C8A" />
      {children}
    </group>
  );
};

// ---------------- 3 · Mandel's office ----------------
export const Office: React.FC<{
  f: number;
  clockH?: number;
  board?: { lines: string[]; k: number; tick?: number };
  /** undefined = no framed tickets on the wall */
  frames?: number;
  night?: boolean;
  plate?: string;
  children?: React.ReactNode;
}> = ({ f, clockH = 10.1, board, frames, night, plate = "S. MANDEL", children }) => (
  <group>
    <Floor w={10} d={10} c="#FFFFFF" map={ctex("parquet", 512, 512, (c, R) => {
      for (let i = 0; i < 16; i++) {
        c.fillStyle = `hsl(22, 38%, ${15 + R() * 8}%)`;
        c.fillRect(0, i * 32, 512, 32);
        c.fillStyle = "rgba(0,0,0,.35)";
        c.fillRect(0, i * 32, 512, 2);
        c.fillRect(R() * 512, i * 32, 2, 32);
      }
    })} p={[0, 0, 1.5]} />
    <Box w={8} h={3.4} d={0.2} c="#FFFFFF" p={[0, 0, -2.4]} o={{ map: panelWall("#1E3F3A", "#142C28", "office") }} />
    <Box w={0.2} h={3.4} d={7} c="#FFFFFF" p={[4, 0, 1.1]} o={{ map: panelWall("#1C3A36", "#142C28", "officeS") }} />
    <Box w={0.2} h={3.4} d={7} c="#FFFFFF" p={[-4, 0, 1.1]} o={{ map: panelWall("#1C3A36", "#142C28", "officeS") }} />
    <Box w={8} h={0.95} d={0.24} c="#FFFFFF" p={[0, 0, -2.36]} o={{ map: woodTex("office", "#3C2216") }} />
    <Box w={8} h={0.05} d={0.26} c="#7A5A2A" p={[0, 0.95, -2.36]} shadow={false} />
    {/* window with a city at night */}
    <Box w={1.4} h={1.6} d={0.1} c="#2A1A12" p={[-3.98, 1.0, -0.6]} r={[0, Math.PI / 2, 0]} />
    <Panel map={ctex("citywin", 256, 300, (c, R) => {
      c.fillStyle = night ? "#0A1430" : "#1A3458";
      c.fillRect(0, 0, 256, 300);
      for (let i = 0; i < 12; i++) {
        const x = i * 22;
        const h = 60 + R() * 130;
        c.fillStyle = "#070B18";
        c.fillRect(x, 300 - h, 20, h);
        for (let k = 0; k < 18; k++) if (R() > 0.55) {
          c.fillStyle = "#FFCF80";
          c.fillRect(x + 3 + R() * 12, 300 - R() * h, 3, 4);
        }
      }
    })} w={1.25} h={1.45} p={[-3.88, 1.82, -0.6]} r={[0, Math.PI / 2, 0]} glow={1.1} />
    {board ? <Chalkboard p={[-1.5, 2.55, -2.27]} lines={board.lines} k={board.k} tick={board.tick} /> : null}
    <Clock p={[0.6, 2.75, -2.26]} h={clockH} r={0.32} />
    {frames === undefined
      ? null
      : Array.from({ length: 14 }, (_, i) => <Frame key={i} p={[1.41 + (i % 5) * 0.36 + (i >= 10 ? 0.18 : 0), 3.0 - Math.floor(i / 5) * 0.55, -2.27]} lit={Math.max(0, Math.min(1, frames - i))} seed={i} />)}
    <Desk p={[0, 0, 0]} w={1.8} d={0.85} c="#6A3E24" />
    <DeskLamp p={[-0.6, 0.77, -0.15]} on />
    <group position={[0.12, 0.77, 0.36]} rotation={[0, 0.12, 0]}>
      <Box w={0.46} h={0.11} d={0.05} c="#2A1A12" />
      <Panel map={signTex(plate, "#2A1A12", N.gold, 1024, 200, 120)} w={0.42} h={0.082} p={[0, 0.055, 0.027]} />
    </group>
    <Box w={0.24} h={0.02} d={0.32} c="#F3EAD6" p={[-0.15, 0.77, 0.1]} r={[0, -0.2, 0]} shadow={false} />
    <Box w={0.3} h={0.1} d={0.22} c="#7A2630" p={[0.62, 0.77, -0.18]} r={[0, 0.3, 0]} />
    <Box w={0.28} h={0.05} d={0.2} c="#2C3A5A" p={[0.6, 0.87, -0.18]} r={[0, -0.1, 0]} />
    <P g={cyl(0.045, 0.04, 0.1, 8)} c="#D8CFC0" p={[-0.2, 0.77, -0.28]} />
    <Chair p={[0, 0, -0.75]} ry={0} c="#4A1E1E" />
    {/* bookshelf */}
    <Box w={1.4} h={2.2} d={0.4} c="#2A1A12" p={[-3.2, 0, -2.1]} />
    {Array.from({ length: 36 }, (_, i) => (
      <Box key={i} w={0.1} h={0.3 + ((i * 7) % 5) * 0.015} d={0.28} c={["#6E2430", "#22304E", "#3E6A44", "#A8843C", "#4A3A5A"][i % 5]} p={[-3.75 + (i % 9) * 0.13, 0.25 + Math.floor(i / 9) * 0.5, -2.0]} shadow={false} />
    ))}
    <Plant p={[3.2, 0, -2]} />
    <pointLight position={[0, 2.8, 1.6]} intensity={night ? 1.6 : 3} distance={8} color="#FFD6A0" />
    {children}
    <group visible={f >= 0} />
  </group>
);

// ---------------- 4 · Melbourne warehouse ----------------
/** desks in rows along z: 16 workers, 30 computers, 12 printers (the counts the VO says) */
export const WAREHOUSE = (() => {
  const desks: { x: number; z: number; ry: number; crt: number; printer: boolean; worker: boolean }[] = [];
  let c = 0;
  let pr = 0;
  let wk = 0;
  for (let row = 0; row < 3; row++)
    for (let i = 0; i < 5; i++) {
      const x = (row - 1) * 3.2;
      const z = 1 - i * 2.2;
      desks.push({ x, z, ry: 0, crt: 2, printer: pr < 12 && (i + row) % 5 !== 4, worker: wk < 16 });
      c += 2;
      if ((i + row) % 5 !== 4) pr++;
      wk++;
    }
  // the 16th worker carries a crate in the aisle
  return { desks, computers: c, printers: Math.min(pr, 12) };
})();
const brick = () =>
  ctex("brick", 512, 512, (c, R) => {
    c.fillStyle = "#14191C";
    c.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 16; y++)
      for (let x = -1; x < 9; x++) {
        c.fillStyle = `hsl(${12 + R() * 10}, 26%, ${14 + R() * 7}%)`;
        c.fillRect(x * 64 + (y % 2) * 32 + 2, y * 32 + 2, 60, 28);
      }
  }, [4, 2]);
export const Warehouse: React.FC<{ f: number; t?: number; workers?: boolean; sign?: string; dim?: number; children?: React.ReactNode }> = ({ f, t = 0, workers = true, sign = "MELBOURNE", dim = 1, children }) => (
  <group>
    <Floor w={24} d={30} c="#FFFFFF" map={concrete()} p={[0, 0, -4]} />
    <Box w={14} h={6} d={0.2} c="#FFFFFF" p={[0, 0, -12]} o={{ map: brick() }} />
    <Box w={0.2} h={6} d={20} c="#FFFFFF" p={[7, 0, -2]} o={{ map: brick() }} />
    <Box w={0.2} h={6} d={20} c="#FFFFFF" p={[-7, 0, -2]} o={{ map: brick() }} />
    {sign ? <Panel map={signTex(sign, "#101418", "#F2D9A8", 1024, 200, 130)} w={4.4} h={0.86} p={[0, 4.6, -11.88]} glow={0.95} /> : null}
    {[-3.2, 0, 3.2].map((x) => [0, -4, -8].map((z) => (
      <group key={`${x}${z}`} position={[x, 5.4, z]}>
        <P g={cyl(0.02, 0.02, 0.6, 4)} c="#2A2A30" />
        <P g={cyl(0.12, 0.55, 0.35, 8)} c="#3A4A3A" p={[0, -0.35, 0]} />
        <P g={ico(0.12, 1)} c="#FFF4DC" p={[0, -0.32, 0]} o={{ e: "#FFF4DC", ei: 3 }} shadow={false} />
      </group>
    )))}
    <pointLight position={[0, 4.5, -2]} intensity={30 * dim} distance={18} color="#FFF1D6" />
    <pointLight position={[0, 4.5, -8]} intensity={20 * dim} distance={14} color="#FFF1D6" />
    {WAREHOUSE.desks.map((d, i) => (
      <group key={i} position={[d.x, 0, d.z]}>
        <Desk w={2.2} d={0.8} c="#9A8A70" />
        <Crt p={[-0.5, 0.75, -0.1]} seed={i} f={f} />
        <Crt p={[0.5, 0.75, -0.1]} seed={i + 7} f={f} />
        {d.printer ? <Printer p={[1.45, 0.55, 0.1]} t={t} seed={i} /> : null}
        {d.printer ? <Box w={0.6} h={0.55} d={0.45} c="#5A5A60" p={[1.45, 0, 0.1]} /> : null}
        {workers && d.worker ? (
          <>
            <Chair p={[0, 0, 0.75]} ry={180} />
            <Person look={extra(i + 20)} pose={{ z: 0.75, ry: 180, ...{ legL: { f: 88, k: 88 }, legR: { f: 88, k: 88 }, y: -0.44 }, armL: { f: 60, e: -40, o: 8 }, armR: { f: 55 + Math.sin(f / 5 + i) * 6, e: -45, o: 8 }, pitch: 8 }} />
          </>
        ) : null}
      </group>
    ))}
    {Array.from({ length: 14 }, (_, i) => (
      <Crate key={i} p={[5.6 + (i % 2) * 0.7, Math.floor(i / 2) % 3 * 0.43, -1 - Math.floor(i / 6) * 1.2]} r={[0, (i % 3) * 0.1, 0]} />
    ))}
    {children}
  </group>
);

// ---------------- 5 · map table ----------------
/** Virginia, simplified (lon, lat), and Australia + Tasmania (for the plates) */
export const VA: [number, number][] = [[-83.68, 36.6], [-81.65, 36.6], [-78.5, 36.55], [-75.87, 36.55], [-75.97, 36.92], [-76.3, 37.05], [-76.35, 37.6], [-76.9, 38.15], [-77.05, 38.8], [-77.5, 39.2], [-77.83, 39.32], [-78.35, 39.45], [-78.95, 38.8], [-79.65, 38.45], [-80.3, 37.65], [-80.95, 37.3], [-81.9, 37.35], [-82.6, 37.0], [-83.2, 36.85]];
export const AU: [number, number][] = [[113.9, -22], [116.7, -20.6], [121, -19.5], [122.3, -17], [125, -14.5], [129, -15], [130.8, -12.4], [132.6, -11.5], [136, -12], [136.8, -15.5], [139.5, -17.5], [141.5, -12.5], [142.5, -10.7], [143.5, -14], [145.4, -15], [146.3, -19], [149, -21.5], [153, -25.5], [153.6, -28.5], [152.5, -32.5], [150.8, -34.5], [150, -37.5], [146.4, -39.1], [143.5, -38.8], [140.6, -38], [138, -35.5], [137.7, -33], [135.6, -34.8], [134, -32.7], [131, -31.5], [126, -32.3], [124, -33.9], [119.8, -34], [117, -35], [115, -34.3], [115.7, -31.6], [114.9, -29], [113.4, -26.5], [113.9, -25]];
export const TAS: [number, number][] = [[144.7, -40.7], [148.3, -40.9], [148, -43.2], [146.8, -43.6], [145.2, -42.2]];
export const MAPS = {
  va: { c: [-79.4, 37.9] as [number, number], k: 1.15, land: "#7FB069" },
  au: { c: [133.5, -27] as [number, number], k: 0.27, land: "#D9A05B" },
};
/** lon/lat → table x/z for a map */
export const mapXZ = (m: keyof typeof MAPS, lon: number, lat: number): [number, number] => [(lon - MAPS[m].c[0]) * MAPS[m].k, -(lat - MAPS[m].c[1]) * MAPS[m].k];
const local = (m: keyof typeof MAPS, pts: [number, number][]) => pts.map(([lon, lat]) => [(lon - MAPS[m].c[0]) * MAPS[m].k, (lat - MAPS[m].c[1]) * MAPS[m].k] as [number, number]);
/** a land plate rising out of the sea by `k` (0→1), `glow` lights it */
export const MapTable: React.FC<{ m: keyof typeof MAPS; k?: number; glow?: number; children?: React.ReactNode; dim?: boolean }> = ({ m, k = 1, glow = 0, children, dim }) => {
  const R = rng(m.length * 7);
  const grow = Math.max(0.001, k >= 1 ? 1 : 1 - (1 - k) ** 3 + Math.sin(k * Math.PI) * 0.08);
  const H2 = rng(m === "va" ? 77 : 78);
  const shades = m === "va" ? ["#5E9A58", "#6FAE62", "#4F8A4E"] : ["#C48A4A", "#B87A40", "#D0965A"];
  return (
    <group>
      <P g={PLANE} c="#123A46" r={[-Math.PI / 2, 0, 0]} s={[60, 60, 1]} o={{ rough: 0.4, metal: 0.2 }} shadow={false} />
      <spotLight position={[0, 22, 6]} angle={0.5} penumbra={0.8} intensity={520} distance={40} color="#FFE2B8" castShadow />
      {Array.from({ length: 30 }, (_, i) => (
        <P key={i} g={PLANE} c="#1C5260" p={[(R() - 0.5) * 30, 0.005, (R() - 0.5) * 30]} r={[-Math.PI / 2, 0, R()]} s={[0.8 + R() * 2, 0.08, 1]} shadow={false} />
      ))}
      {[-1, 1].map((sx) => <Box key={sx} w={2} h={0.6} d={24} c="#FFFFFF" p={[sx * 7, 0, 0]} o={{ map: woodTex("table", "#4A2A1C") }} />)}
      {[-1, 1].map((sz) => <Box key={sz} w={16} h={0.6} d={2} c="#FFFFFF" p={[0, 0, sz * 10]} o={{ map: woodTex("table", "#4A2A1C") }} />)}
      <group scale={[grow, 1, grow]}>
        <P g={plateGeo(m, local(m, m === "va" ? VA : AU), 0.3)} c={MAPS[m].land} o={{ e: MAPS[m].land, ei: glow * 0.35 + (dim ? 0 : 0.05) }} />
        {m === "au" ? <P g={plateGeo("tas", local("au", TAS), 0.3)} c={MAPS[m].land} /> : null}
        {scatter(m === "va" ? VA : AU, m === "va" ? 12 : 22, 5).map(([lon, lat], i) => {
          const [x, z] = mapXZ(m, lon, lat);
          return <P key={i} g={cyl(0.62, 0.68, 0.03, 6)} c={shades[i % 3]} p={[x, 0.3, z]} r={[0, i, 0]} s={[0.6 + H2() * 0.9, 1, 0.6 + H2() * 0.9]} shadow={false} />;
        })}
      </group>
      {children}
    </group>
  );
};

/** the same land plate as a small model on a desk (no sea) */
export const MiniMap: React.FC<{ m: keyof typeof MAPS; p: V3; s: number; glow?: number }> = ({ m, p, s, glow = 0 }) => (
  <group position={p} scale={s}>
    <P g={plateGeo(m, local(m, m === "va" ? VA : AU), 0.3)} c={MAPS[m].land} o={{ e: MAPS[m].land, ei: glow * 0.4 }} />
  </group>
);

// ---------------- 6 · street at night ----------------
/** `shutter` 0→1: the roller shutter comes down over the shop front, slat by slat behind a moving bottom bar */
export const Street: React.FC<{ f: number; sign?: string; closed?: boolean; shutter?: number; dark?: boolean; children?: React.ReactNode }> = ({ f, sign = "MINI MART", closed, shutter = 0, dark, children }) => (
  <group>
    <Floor w={40} d={40} c="#2A2A32" p={[0, 0, 0]} />
    <Box w={40} h={0.15} d={3} c="#6A6A70" p={[0, 0, -3.5]} />
    {Array.from({ length: 8 }, (_, i) => (
      <Box key={i} w={1.4} h={0.01} d={0.15} c="#E8D27A" p={[-14 + i * 4, 0, 1.5]} shadow={false} />
    ))}
    {/* the shop */}
    <Box w={7} h={3.6} d={4} c="#C9B79A" p={[0, 0, -7]} />
    <Box w={7.2} h={0.25} d={4.2} c="#5A3A26" p={[0, 3.6, -7]} />
    <Panel map={signTex(closed ? "CLOSED" : sign, closed ? "#2A2A30" : N.red, closed ? "#8A8A90" : "#FFFFFF")} w={3.6} h={0.8} p={[0, 3.05, -4.98]} glow={closed ? 0.7 : 1.2} />
    <Panel map={ctex("shopwin", 512, 256, (c, R) => {
      c.fillStyle = "#FFE7B0";
      c.fillRect(0, 0, 512, 256);
      for (let i = 0; i < 24; i++) {
        c.fillStyle = ["#D9483B", "#3B8ED8", "#3FAE6A", "#F2C14E"][i % 4];
        c.fillRect(20 + (i % 8) * 60, 60 + Math.floor(i / 8) * 60, 40 + R() * 10, 36);
      }
    })} w={4.2} h={1.9} p={[-0.9, 1.35, -4.98]} glow={closed ? 0.12 : 1.1} />
    <Box w={1.1} h={2.3} d={0.05} c="#2A3A4A" p={[2.4, 0.15, -4.97]} o={{ e: "#FFE0A0", ei: 0.4 }} />
    {closed ? null : <pointLight position={[0, 2.2, -3.5]} intensity={22} distance={9} color="#FFDDA0" />}
    {shutter > 0
      ? Array.from({ length: 14 }, (_, i) => {
          const y = 2.5 - (i + 1) * 0.18;
          return y >= 2.5 * (1 - shutter) - 0.18 ? <Box key={i} w={6.8} h={0.17} d={0.05} c={i % 2 ? "#6A7074" : "#5C6266"} p={[0, Math.max(y, 0), -4.93]} o={{ metal: 0.5, rough: 0.5 }} /> : null;
        })
      : null}
    {shutter > 0 ? <Box w={6.84} h={0.09} d={0.08} c="#2A2D30" p={[0, 2.5 * (1 - shutter), -4.92]} /> : null}
    {/* street lamp */}
    <P g={cyl(0.07, 0.09, 4.8, 6)} c="#2A2A30" p={[-4.5, 0, -2.8]} />
    <Box w={0.9} h={0.12} d={0.3} c="#2A2A30" p={[-4.1, 4.8, -2.8]} />
    <P g={ico(0.14, 1)} c="#FFF2C8" p={[-3.8, 4.75, -2.8]} o={dark ? { rough: 0.6 } : { e: "#FFE0A0", ei: 3 }} shadow={false} />
    <pointLight position={[-3.8, 4.5, -2.6]} intensity={dark ? 5 : 18} distance={10} color="#FFD49A" />
    {children}
    <group visible={f >= 0} />
  </group>
);

// ---------------- 7 · interview room (FBI / CIA) ----------------
export const Interview: React.FC<{ f: number; lamp?: boolean; children?: React.ReactNode }> = ({ f, lamp = true, children }) => (
  <group>
    <Floor w={10} d={10} c="#FFFFFF" map={tiles("#454F54", "#394247", 10)} p={[0, 0, 1]} />
    <Shell w={6} d={7} h={3.2} z={-2.6} wall="#34454B" side="#2C3B41" />
    <Box w={1.6} h={0.9} d={0.08} c="#1A2026" p={[1.6, 1.3, -2.5]} o={{ rough: 0.15, metal: 0.5 }} />
    <Desk w={1.8} d={0.9} c="#6E7478" />
    {lamp ? <P g={cyl(0.02, 0.02, 1.0, 4)} c="#2A2A30" p={[0, 2.2, 0]} /> : null}
    {lamp ? <P g={cone(0.4, 0.3, 8)} c="#3A3A40" p={[0, 1.95, 0]} /> : null}
    {lamp ? <P g={ico(0.1, 1)} c="#FFF6E0" p={[0, 1.92, 0]} o={{ e: "#FFF6E0", ei: 3 }} shadow={false} /> : null}
    <spotLight position={[0, 2.0, 0]} angle={0.8} penumbra={0.5} intensity={5} distance={6} color="#FFE2B8" castShadow />
    <pointLight position={[0, 1.7, -1.7]} intensity={3} distance={6} color="#CFE4F0" />
    {children}
    <group visible={f >= 0} />
  </group>
);

// ---------------- 8 · state chamber ----------------
export const Chamber: React.FC<{ f: number; children?: React.ReactNode }> = ({ f, children }) => (
  <group>
    <Floor w={16} d={16} c="#FFFFFF" map={tiles("#3A3A3A", "#2A2C2E", 8)} p={[0, 0, 0]} />
    <Box w={14} h={6} d={0.3} c="#FFFFFF" p={[0, 0, -4]} o={{ map: panelWall("#1E3036", "#101C20", "chamber") }} />
    <P g={cyl(0.85, 0.85, 0.05, 24)} c="#5A4620" p={[0, 2.5, -3.85]} r={[Math.PI / 2, 0, 0]} o={{ metal: 0.5, rough: 0.45 }} />
    <P g={torus(0.85, 0.05, 24)} c={N.gold} p={[0, 2.5, -3.8]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
    {[-3.4, -1.15, 1.15, 3.4].map((x) => (
      <group key={x} position={[x, 0, -3.4]}>
        <P g={cyl(0.32, 0.36, 4.6, 8)} c="#6E7C7C" />
        <Box w={0.9} h={0.3} d={0.9} c="#4E5A5A" p={[0, 4.6, 0]} />
        <Box w={0.9} h={0.3} d={0.9} c="#4E5A5A" />
      </group>
    ))}
    <Box w={12} h={0.6} d={0.9} c="#4E5A5A" p={[0, 4.9, -3.4]} />
    {/* the bench */}
    <Box w={3.6} h={1.1} d={0.9} c="#5A3A26" p={[0, 0, 0]} />
    <Box w={3.7} h={0.07} d={1.0} c="#6B4A35" p={[0, 1.1, 0]} />
    <Box w={3.62} h={0.05} d={0.05} c="#8A6A2A" p={[0, 0.82, 0.45]} shadow={false} />
    <pointLight position={[0, 3, 2]} intensity={10} distance={10} color="#FFE8C8" />
    {children}
    <group visible={f >= 0} />
  </group>
);

// ---------------- 9 · dark stage for numbers (bars, crowd) ----------------
export const Void: React.FC<{ children?: React.ReactNode; c?: string }> = ({ children, c = "#16222A" }) => (
  <group>
    <P g={PLANE} c={c} r={[-Math.PI / 2, 0, 0]} s={[60, 60, 1]} o={{ rough: 0.42, metal: 0.25, map: ctex("grid", 512, 512, (x) => {
      x.fillStyle = "#FFFFFF";
      x.fillRect(0, 0, 512, 512);
      x.fillStyle = "rgba(0,0,0,.4)";
      x.fillRect(0, 0, 4, 512);
      x.fillRect(0, 0, 512, 4);
    }, [30, 30]) }} shadow={false} />
    {/* one hard pool of light from above, everything else falls to dark */}
    <spotLight position={[0, 11, 3]} angle={0.5} penumbra={0.75} intensity={120} distance={26} color="#FFD9A8" castShadow />
    {children}
  </group>
);
/** tickets as a stacked tower `h` metres tall (a bar made of bundles) */
export const TicketTower: React.FC<{ p?: V3; h: number; c?: string }> = ({ p = [0, 0, 0], h, c = "#FBF4E2" }) => {
  const n = Math.max(0, Math.floor(h / 0.1));
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} w={0.7} h={0.095} d={0.7} c={i % 2 ? c : "#F1E6CC"} p={[0, i * 0.1, 0]} r={[0, (i % 3) * 0.05, 0]} />
      ))}
    </group>
  );
};
/** gold coin stack bar */
export const CoinTower: React.FC<{ p?: V3; h: number }> = ({ p = [0, 0, 0], h }) => {
  const n = Math.max(0, Math.floor(h / 0.08));
  return (
    <group position={p}>
      {Array.from({ length: n }, (_, i) => (
        <P key={i} g={cyl(0.38, 0.38, 0.07, 12)} c={N.gold} p={[Math.sin(i * 1.7) * 0.02, i * 0.08, Math.cos(i * 1.3) * 0.02]} o={{ metal: 0.15, rough: 0.4 }} />
      ))}
    </group>
  );
};
// ---------------- 10 · casino ----------------
export const TABLE_Y = 0.82;
const carpet = () =>
  ctex("carpet", 512, 512, (c) => {
    c.fillStyle = "#10262A";
    c.fillRect(0, 0, 512, 512);
    c.strokeStyle = "rgba(242,193,78,.2)";
    c.lineWidth = 5;
    for (let i = -4; i < 8; i++) {
      c.beginPath();
      c.moveTo(i * 96, 0);
      c.lineTo(i * 96 + 512, 512);
      c.moveTo(i * 96 + 512, 0);
      c.lineTo(i * 96, 512);
      c.stroke();
    }
  }, [5, 5]);
const feltMarks = () =>
  ctex("feltmarks", 1024, 576, (c) => {
    c.clearRect(0, 0, 1024, 576);
    c.strokeStyle = "rgba(242,226,180,.55)";
    c.fillStyle = "rgba(242,226,180,.6)";
    c.lineWidth = 6;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = `900 56px ${SIGN_FONT}`;
    ([["PUNTO", 300], ["BANCO", 724]] as const).forEach(([word, x]) => {
      c.strokeRect(x - 170, 300, 340, 150);
      c.fillText(word, x, 375);
    });
  });
/** the baccarat table: oval, centred on the origin, felt at TABLE_Y; players on −z, the dealer on +z */
export const BaccaratTable: React.FC<{ felt?: string }> = ({ felt = "#114A4C" }) => (
  <group>
    <P g={cyl(0.34, 0.44, TABLE_Y - 0.05, 10)} c="#1A1214" />
    <P g={cyl(1, 0.96, 0.06, 28)} c="#3A2216" p={[0, TABLE_Y - 0.06, 0]} s={[1.36, 1, 0.8]} o={{ rough: 0.35 }} />
    <P g={cyl(1, 1, 0.006, 28)} c={N.gold} p={[0, TABLE_Y - 0.004, 0]} s={[1.33, 1, 0.77]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
    <P g={cyl(1, 1, 0.006, 28)} c={felt} p={[0, TABLE_Y, 0]} s={[1.28, 1, 0.73]} o={{ rough: 0.95 }} />
    <Panel map={feltMarks()} w={1.9} h={1.05} p={[0, TABLE_Y + 0.007, 0.02]} r={[-Math.PI / 2, 0, 0]} alpha glow={0.75} />
  </group>
);
/** the gaming floor: slots and a lit sign on the back wall, an LED board, two pendants over the table at the origin */
export const Casino: React.FC<{ f: number; sign?: string; board?: string | null; boardC?: string; neon?: string; dim?: number; table?: boolean; lamp?: number; children?: React.ReactNode }> = ({ f, sign = "CASINO", board = null, boardC = "#FFB347", neon = "#62D2DC", dim = 1, table = true, lamp = 9, children }) => {
  const flick = (i: number) => 0.55 + 0.45 * Math.sin(f * 0.13 + i * 1.9) * Math.sin(f * 0.041 + i);
  return (
    <group>
      <Floor w={18} d={18} c="#FFFFFF" map={carpet()} p={[0, 0, 2]} />
      <Box w={13} h={4.4} d={0.2} c="#FFFFFF" p={[0, 0, -3.7]} o={{ map: panelWall("#16343A", "#0C2024", "casino") }} />
      {[-1, 1].map((s) => <Box key={s} w={0.2} h={4.4} d={10} c="#FFFFFF" p={[s * 6.5, 0, 1.3]} o={{ map: panelWall("#143036", "#0C2024", "casinoS") }} />)}
      <Box w={13} h={0.9} d={0.24} c="#FFFFFF" p={[0, 0, -3.64]} o={{ map: woodTex("casino", "#3C2216") }} />
      <Box w={13} h={0.05} d={0.26} c={N.gold} p={[0, 0.9, -3.64]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
      <Neon p={[0, 4.02, -3.55]} w={12.6} c={neon} />
      {/* narrow on purpose: a 9:16 frame only sees about 3 m of this wall */}
      <Box w={2.3} h={0.52} d={0.1} c="#0C0C12" p={[0, 2.86, -3.56]} />
      <Panel map={signTex(sign, "#0B0B10", N.gold, 1024, 200, Math.min(130, 1440 / sign.length))} w={2.14} h={0.42} p={[0, 3.12, -3.5]} glow={1.2 * dim} />
      {board ? <LedBoard p={[0, 2.42, -3.45]} text={board} w={2.1} c={boardC} glow={1.5} /> : null}
      {/* slots along the back wall: only colour, no numbers */}
      {[-5.4, -4.4, -3.4, 3.4, 4.4, 5.4].map((x, i) => (
        <group key={x} position={[x, 0, -3.1]}>
          <Box w={0.78} h={1.72} d={0.6} c="#26222C" o={{ metal: 0.3, rough: 0.5 }} />
          <Box w={0.56} h={0.44} d={0.02} c="#0E0A12" p={[0, 1.06, 0.3]} o={{ e: i % 2 ? "#FFB347" : "#62D2DC", ei: flick(i) * 1.1 * dim }} shadow={false} />
          <Box w={0.56} h={0.05} d={0.02} c={N.gold} p={[0, 1.58, 0.3]} o={{ e: N.gold, ei: 0.9 * dim }} shadow={false} />
        </group>
      ))}
      {table ? <BaccaratTable /> : null}
      <Pendant p={[-0.7, 3.5, 0]} i={lamp * dim} />
      <Pendant p={[0.7, 3.5, 0]} i={lamp * dim} />
      <pointLight position={[0, 2.4, 3]} intensity={7 * dim} distance={9} color="#FFD6A0" />
      {children}
    </group>
  );
};
/** the cashier's window, its counter front at z = 0: bars, a cashier's lamp behind, a roller shutter `shutter` 0→1, `lit` for the room behind */
export const CashCage: React.FC<{ sign?: string; shutter?: number; lit?: number; children?: React.ReactNode }> = ({ sign = "CASHIER", shutter = 0, lit = 1, children }) => {
  const H = 1.25;
  const y0 = 1.02;
  return (
    <group>
      <Floor w={14} d={14} c="#FFFFFF" map={carpet()} p={[0, 0, 3]} />
      <Box w={10} h={4} d={0.2} c="#FFFFFF" p={[0, 0, -2.4]} o={{ map: panelWall("#101E22", "#0A1418", "cageback") }} />
      {/* the wall the window is cut into */}
      {[-1, 1].map((s) => <Box key={s} w={3.4} h={4} d={0.16} c="#FFFFFF" p={[s * 2.3, 0, -0.5]} o={{ map: panelWall("#16343A", "#0C2024", "casino") }} />)}
      <Box w={1.3} h={4 - y0 - H} d={0.16} c="#FFFFFF" p={[0, y0 + H, -0.5]} o={{ map: panelWall("#16343A", "#0C2024", "casino") }} />
      <Box w={1.3} h={y0} d={0.5} c="#FFFFFF" p={[0, 0, -0.3]} o={{ map: woodTex("cage", "#3C2216") }} />
      <Box w={1.42} h={0.05} d={0.62} c="#2A1A12" p={[0, y0, -0.3]} o={{ rough: 0.35 }} />
      <Box w={1.42} h={0.02} d={0.02} c={N.gold} p={[0, y0 + 0.04, 0.02]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
      {Array.from({ length: 7 }, (_, i) => <P key={i} g={cyl(0.012, 0.012, H, 6)} c={N.gold} p={[-0.54 + i * 0.18, y0 + (i === 3 ? 0.42 : 0.05), -0.46]} s={[1, i === 3 ? 0.66 : 1, 1]} o={{ metal: 0.6, rough: 0.35 }} />)}
      <Panel map={signTex(sign, "#0B0B10", N.gold, 1024, 200, 120)} w={1.5} h={0.3} p={[0, y0 + H + 0.32, -0.41]} glow={0.7 + 0.5 * lit} />
      <Neon p={[0, y0 + H + 0.1, -0.41]} w={1.3} c="#FFB347" />
      {/* the shutter comes down in front of the bars, slat by slat behind its bottom bar */}
      {shutter > 0 ? Array.from({ length: 11 }, (_, i) => {
        const y = y0 + 0.05 + H - (i + 1) * 0.115;
        return y >= y0 + 0.05 + (H - 0.05) * (1 - shutter) - 0.115 ? <Box key={i} w={1.3} h={0.11} d={0.04} c={i % 2 ? "#5C6266" : "#6A7074"} p={[0, Math.max(y, y0 + 0.05), -0.4]} o={{ metal: 0.5, rough: 0.5 }} /> : null;
      }) : null}
      {shutter > 0 ? <Box w={1.34} h={0.06} d={0.06} c="#2A2D30" p={[0, y0 + 0.05 + (H - 0.05) * (1 - shutter), -0.39]} /> : null}
      <pointLight position={[0, 2.1, -1.3]} intensity={4 * lit} distance={4.5} color="#FFD6A0" />
      <Pendant p={[0, 3.3, 1.1]} i={6 * (0.25 + 0.75 * lit)} />
      {children}
    </group>
  );
};
// ---------------- 11 · draw room ----------------
/** the room where the numbers are drawn: two number computers at the back, a console, a glass wall at z = GLASS_Z with a door; shoot through the glass from +z */
export const GLASS_Z = 1.35;
export const DrawRoom: React.FC<{ f: number; fixed?: number; glass?: boolean; door?: number; children?: React.ReactNode }> = ({ f, fixed = 0, glass = true, door = 0, children }) => (
  <group>
    <Floor w={14} d={14} c="#FFFFFF" map={tiles("#1A2C30", "#142226", 12)} p={[0, 0, 2]} />
    <Box w={6} h={3.2} d={0.2} c="#FFFFFF" p={[0, 0, -1.7]} o={{ map: panelWall("#1A3238", "#0F2024", "drawroom") }} />
    {[-1, 1].map((x) => <Box key={x} w={0.2} h={3.2} d={3.2} c="#FFFFFF" p={[x * 1.9, 0, -0.2]} o={{ map: panelWall("#16282E", "#0F2024", "drawroomS") }} />)}
    <Neon p={[0, 3.0, -1.58]} w={3.6} c="#62D2DC" />
    <RngRack p={[-0.42, 0, -1.3]} w={0.5} f={f} fixed={fixed} seed={3} />
    <RngRack p={[0.42, 0, -1.3]} w={0.5} f={f + 2} seed={7} />
    <Desk p={[0, 0, -0.3]} w={1.3} d={0.6} c="#3A3E46" />
    <Chair p={[0, 0, -0.92]} ry={0} />
    <Box w={0.36} h={0.018} d={0.14} c="#1A1C22" p={[0, 0.77, -0.16]} shadow={false} />
    <Pendant p={[-0.5, 3.7, -0.3]} c="#E8F2FF" i={6} />
    <Pendant p={[0.5, 3.7, -0.3]} c="#E8F2FF" i={6} />
    <CeilingCam p={[-1.2, 2.72, 0.9]} ry={150} f={f} s={1.1} />
    {glass ? (
      <group>
        {[-1.9, -1.25, 1.42, 1.9].map((x) => <Box key={x} w={0.05} h={3.1} d={0.05} c="#3A4048" p={[x, 0, GLASS_Z]} o={{ metal: 0.5, rough: 0.4 }} />)}
        <Box w={3.8} h={0.05} d={0.05} c="#3A4048" p={[0, 3.08, GLASS_Z]} shadow={false} />
        <Box w={3.8} h={0.05} d={0.05} c="#3A4048" p={[0, 2.3, GLASS_Z]} shadow={false} />
        <Box w={1.75} h={3.1} d={0.012} c="#BFE6EC" p={[-0.38, 0, GLASS_Z]} o={{ op: 0.08, rough: 0.1 }} shadow={false} />
        <group position={[1.42, 0, GLASS_Z]} rotation={[0, door * 1.2, 0]}>
          <Box w={0.92} h={2.3} d={0.012} c="#BFE6EC" p={[-0.46, 0, 0]} o={{ op: 0.1, rough: 0.1 }} shadow={false} />
        </group>
      </group>
    ) : null}
    {children}
  </group>
);
export { Ticket, Van, Pile, ico, D };
