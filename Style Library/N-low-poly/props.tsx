/**
 * Style N props: tickets, piles, lottery balls + draw machine, clock, calculator, CRT, printer, van, crates, gavel,
 * stamp, map plates and pins. All low-poly, all frame-driven (pass `f` / `t`), all randomness seeded.
 */
import React, { useMemo } from "react";
import * as THREE from "three";
import { Box, BOX, BOX0, cone, ctex, cyl, D, ico, limb, mat, N, P, Panel, PLANE, rng, sph, SIGN_FONT, signTex, torus, useLiveTex, type V3 } from "./lowpoly";

// ---------------- tickets ----------------
/** six different numbers in order, like a real lotto row */
const rowOf = (R: () => number) => {
  const pick = new Set<number>();
  while (pick.size < 6) pick.add(1 + Math.floor(R() * 44));
  return [...pick].sort((a, b) => a - b);
};
export const ticketTex = (seed: number) =>
  ctex(`ticket${seed}`, 256, 384, (c, R) => {
    c.fillStyle = "#FBF4E2";
    c.fillRect(0, 0, 256, 384);
    c.fillStyle = N.red;
    c.fillRect(0, 0, 256, 70);
    c.fillStyle = "#FFFFFF";
    c.font = `900 50px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.fillText("LOTTO", 128, 54);
    c.font = `700 23px ${SIGN_FONT}`;
    for (let row = 0; row < 5; row++) {
      rowOf(R).forEach((n, k) => {
        c.fillStyle = "#3A2E2A";
        c.fillText(String(n).padStart(2, "0"), 30 + k * 39, 120 + row * 52);
      });
    }
    c.fillStyle = "#1A1416";
    for (let i = 0; i < 30; i++) c.fillRect(20 + i * 7.4, 350, R() > 0.4 ? 4 : 2, 22);
  });
/** one ticket lying flat (face up), 9 × 13.5 cm, or standing when r is given */
export const Ticket: React.FC<{ p?: V3; r?: V3; s?: number; seed?: number; glow?: number }> = ({ p = [0, 0, 0], r = [-Math.PI / 2, 0, 0], s = 1, seed = 1, glow = 0 }) => (
  <group position={p} rotation={r} scale={s}>
    <Panel map={ticketTex(seed % 6)} w={0.09} h={0.135} glow={1 + glow} />
    <mesh geometry={PLANE} material={mat("#E8DFC8")} scale={[0.09, 0.135, 1]} rotation={[0, Math.PI, 0]} />
  </group>
);
/** THE ticket: one row is the numbers drawn, `lit` of them already marked in gold, a gold edge that blooms */
export const HeroTicket: React.FC<{ p?: V3; r?: V3; s?: number; row: number[]; lit: number; seed?: number; single?: boolean }> = ({ p = [0, 0, 0], r, s = 1, row, lit, seed = 5, single }) => {
  const tex = useLiveTex(512, 768, (c) => {
    const R = rng(seed);
    c.fillStyle = "#FBF4E2";
    c.fillRect(0, 0, 512, 768);
    c.fillStyle = N.red;
    c.fillRect(0, 0, 512, 140);
    c.fillStyle = "#FFFFFF";
    c.font = `900 100px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("LOTTO", 256, 74);
    c.font = `700 46px ${SIGN_FONT}`;
    for (let y = 0; y < 5; y++) {
      const nums = y === 2 ? row : rowOf(R);
      if (single && y !== 2) continue;
      nums.forEach((n, k) => {
        const x = 61 + k * 78;
        const yy = 232 + y * 100;
        if (y === 2 && k < lit) {
          c.fillStyle = N.gold;
          c.beginPath();
          c.arc(x, yy, 38, 0, 7);
          c.fill();
        }
        c.fillStyle = y === 2 ? "#1A1416" : "#8A7E72";
        c.fillText(String(n).padStart(2, "0"), x, yy);
      });
    }
    c.fillStyle = "#1A1416";
    for (let i = 0; i < 30; i++) c.fillRect(40 + i * 14.8, 700, R() > 0.4 ? 8 : 4, 44);
  });
  return (
    <group position={p} rotation={r} scale={s}>
      {single ? null : <P g={PLANE} c={N.gold} p={[0, 0, -0.001]} s={[0.095, 0.14, 1]} o={{ e: N.gold, ei: 1.15 }} shadow={false} />}
      <Panel map={tex} w={0.09} h={0.135} />
    </group>
  );
};
/** a mound / heap of tickets (instanced). `k` 0→1 grows it. */
export const Pile: React.FC<{ n: number; r: number; h: number; p?: V3; seed?: number; k?: number; flatTop?: boolean }> = ({ n, r, h, p = [0, 0, 0], seed = 3, k = 1 }) => {
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(BOX, new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9, emissive: "#40382A", emissiveIntensity: 0.55 }), n);
    const R = rng(seed);
    const o = new THREE.Object3D();
    const cols = ["#FBF4E2", "#FBF4E2", "#F6E3C0", "#F8D9D2", "#FBF4E2"].map((c) => new THREE.Color(c));
    for (let i = 0; i < n; i++) {
      const a = R() * Math.PI * 2;
      const d = Math.sqrt(R()) * r;
      const y = h * (1 - (d / r) ** 1.6) * (0.5 + R() * 0.5);
      o.position.set(Math.cos(a) * d, y, Math.sin(a) * d);
      o.rotation.set((R() - 0.5) * 0.9, R() * Math.PI, (R() - 0.5) * 0.9);
      o.scale.set(0.09, 0.004, 0.135);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, cols[i % cols.length]);
    }
    m.castShadow = true;
    m.receiveShadow = true;
    // the bounding sphere is computed once, at whatever count the first rendered frame had: a pile that starts
    // small would be culled in later frames of that render tab (4-frame flicker in the 2026-11-05 render)
    m.frustumCulled = false;
    return m;
  }, [n, r, h, seed]);
  mesh.count = Math.max(0, Math.round(n * k));
  return <primitive object={mesh} position={p} />;
};
/** a neat brick of tickets (a wrapped bundle) */
export const Bundle: React.FC<{ p?: V3; r?: V3; c?: string }> = ({ p = [0, 0, 0], r, c = "#FBF4E2" }) => (
  <group position={p} rotation={r}>
    <Box w={0.1} h={0.08} d={0.145} c={c} />
    <Box w={0.102} h={0.082} d={0.02} c={N.red} p={[0, -0.001, 0]} shadow={false} />
  </group>
);
/** a cardboard crate of tickets, lid open */
export const Crate: React.FC<{ p?: V3; r?: V3; full?: boolean; s?: number }> = ({ p = [0, 0, 0], r, full = true, s = 1 }) => (
  <group position={p} rotation={r} scale={s}>
    <Box w={0.6} h={0.42} d={0.45} c="#B98A55" />
    <Box w={0.61} h={0.05} d={0.12} c="#D9C49A" p={[0, 0.4, 0]} shadow={false} />
    {full ? <Box w={0.54} h={0.02} d={0.4} c="#FBF4E2" p={[0, 0.42, 0]} shadow={false} /> : null}
  </group>
);

// ---------------- lottery balls + machine ----------------
const BALL_C = ["#E84A3A", "#F2C14E", "#3B8ED8", "#3FAE6A", "#9B59D0", "#F07A2A"];
export const ballTex = (n: number) =>
  ctex(`ball${n}`, 256, 128, (c) => {
    c.fillStyle = BALL_C[n % 6];
    c.fillRect(0, 0, 256, 128);
    c.fillStyle = "#FFFFFF";
    c.beginPath();
    c.ellipse(64, 64, 34, 46, 0, 0, 7);
    c.fill();
    c.fillStyle = "#1A1416";
    c.font = `900 40px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(String(n), 64, 66);
  });
/** a numbered ball, number facing +z */
export const Ball: React.FC<{ n: number; p?: V3; r?: number; spin?: V3; shadow?: boolean; op?: number }> = ({ n, p = [0, 0, 0], r = 0.09, spin = [0, 0, 0], shadow = true, op = 1 }) => (
  <mesh geometry={sph(1, 16, 10)} material={mat("#FFFFFF", { map: ballTex(n), rough: 0.4, op })} position={p} rotation={spin} scale={r} castShadow={shadow} />
);
/** the draw machine: base, glass globe with 44 tumbling balls, chute, a tray of drawn balls (`drawn` numbers shown, `k` how many) */
/** `calm` 0→1: blower cut, the balls drop to a heap (freeze `f` at the same moment). `clear`: no ball inside this radius of the z axis, so a face behind the globe stays visible */
export const DrawMachine: React.FC<{ f: number; p?: V3; drawn?: number[]; k?: number; calm?: number; clear?: number; drain?: number; skip?: number; tray?: boolean; trail?: number; rim?: number }> = ({ f, p = [0, 0, 0], drawn = [], k = 0, calm = 0, clear = 0, drain = 0, skip, tray = true, trail = 0, rim = 0 }) => {
  const R = rng(44);
  const seeds = Array.from({ length: 44 }, () => [R() * 6, R() * 6, R() * 6, 0.6 + R() * 0.8]);
  return (
    <group position={p}>
      <P g={cyl(0.62, 0.8, 0.95, 8)} c={N.red} />
      <P g={cyl(0.66, 0.66, 0.08, 8)} c={N.gold} p={[0, 0.95, 0]} o={{ metal: 0.6, rough: 0.35 }} />
      <P g={cyl(0.2, 0.28, 0.25, 8)} c={N.gold} p={[0, 1.0, 0]} o={{ metal: 0.6, rough: 0.35 }} />
      {clear ? null : <P g={torus(0.98, 0.04, 16)} c={N.gold} p={[0, 2.15, 0]} r={[Math.PI / 2, 0, 0]} o={{ metal: 0.6, rough: 0.35 }} />}
      {seeds.map(([a, b, c, s], i) => {
        if (i + 1 === skip) return null;
        const orbit = (ff: number) => {
          const g = ff * 0.12 * s;
          const v = new THREE.Vector3(Math.sin(g + a) * Math.cos(g * 0.7 + b), Math.sin(g * 0.9 + c), Math.cos(g + a) * Math.sin(g * 0.6 + b + 1)).multiplyScalar(0.72);
          // the window is taller than wide, low and to his right: his face, his chest and the hand that catches
          const rd = Math.hypot((v.x + 0.1) / 1.3, (v.y + 0.2) / 1.5);
          if (rd < clear) {
            const g2 = clear / (rd || 0.001);
            v.x = (v.x + 0.1) * g2 - 0.1;
            v.y = (v.y + 0.2) * g2 - 0.2;
          }
          return v;
        };
        const v = orbit(f);
        const g = f * 0.12 * s;
        const q = Math.min(1, Math.max(0, calm * 1.5 - (i / 44) * 0.5)) ** 2;
        const rr = 0.1 + 0.6 * Math.sqrt(i / 44);
        const rest: V3 = [Math.cos(i * 2.399) * rr, -Math.sqrt(0.84 ** 2 - rr ** 2) + (i % 3) * 0.1, Math.sin(i * 2.399) * rr];
        // `drain`: one by one they sink through the neck until the globe is empty
        const out = Math.min(1, Math.max(0, drain * 1.7 - (i / 44) * 0.7)) ** 2;
        if (out >= 1) return null;
        const pos: V3 = [v.x + (rest[0] - v.x) * q, 2.15 + v.y + (rest[1] - v.y) * q, v.z + (rest[2] - v.z) * q];
        return (
          <React.Fragment key={i}>
            <Ball n={i + 1} p={[pos[0] * (1 - out), pos[1] + (0.95 - pos[1]) * out, pos[2] * (1 - out)]} r={0.11} spin={[g * 2 + a, g + b, c]} />
            {/* no real motion blur in a single render: two faint copies a moment behind it */}
            {trail
              ? [0.34, 0.16].map((op, n) => {
                  const w = orbit(f - (trail * (n + 1)) / 2);
                  return <Ball key={n} n={i + 1} p={[w.x, 2.15 + w.y, w.z]} r={0.11} spin={[g * 2 + a, g + b, c]} op={op} shadow={false} />;
                })
              : null}
          </React.Fragment>
        );
      })}
      {clear ? null : <mesh geometry={ico(1, 2)} material={mat("#CFE8FF", { op: 0.16 - rim * 0.11, rough: 0.05, metal: 0.1 })} position={[0, 2.15, 0]} />}
      {/* a lit edge, so the glass still reads as glass once it is empty */}
      {rim ? <P g={torus(1, 0.012, 48)} c="#62D2DC" p={[0, 2.15, 0]} o={{ e: "#62D2DC", ei: rim * 2 }} shadow={false} /> : null}
      {/* chute + tray */}
      {tray ? <P g={cyl(0.07, 0.07, 1.0, 8)} c="#D8E4EE" p={[0.95, 1.1, 0.2]} r={[0, 0, 0.5]} o={{ op: 0.5 }} shadow={false} /> : null}
      {tray ? <Box w={1.9} h={0.12} d={0.32} c="#2A2230" p={[1.9, 0.9, 0.55]} /> : null}
      {/* two rows of three: one row of six would not fit a 9:16 frame at a readable size */}
      {drawn.length ? (
        <>
          <Box w={1.1} h={0.03} d={0.32} c="#2A2230" p={[1.85, 1.29, 0.55]} />
          <Box w={0.03} h={0.33} d={0.03} c="#2A2230" p={[1.32, 0.98, 0.55]} />
          <Box w={0.03} h={0.33} d={0.03} c="#2A2230" p={[2.38, 0.98, 0.55]} />
        </>
      ) : null}
      {drawn.slice(0, k).map((n, i) => (
        <Ball key={n} n={n} p={[1.53 + (i % 3) * 0.32, i < 3 ? 1.44 : 1.14, 0.6]} r={0.14} />
      ))}
    </group>
  );
};

/** a lit digital board: a number that lives in the world instead of on a chip */
export const LedBoard: React.FC<{ p?: V3; text: string; w?: number; c?: string; glow?: number }> = ({ p = [0, 0, 0], text, w = 2.6, c = "#FF4A3A", glow = 1.5 }) => {
  const tex = useLiveTex(1024, 256, (x) => {
    x.fillStyle = "#0A0608";
    x.fillRect(0, 0, 1024, 256);
    x.fillStyle = c;
    x.font = `900 ${Math.min(170, 1560 / text.length)}px Consolas, monospace`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, 512, 134);
  });
  return (
    <group position={p}>
      <Box w={w + 0.14} h={w / 4 + 0.14} d={0.1} c="#17141A" p={[0, -(w / 8 + 0.07), -0.07]} />
      <Panel map={tex} w={w} h={w / 4} glow={glow} />
    </group>
  );
};
/** a forearm entering the frame, its fingertip (or `hold`) at `p`; +y of the group runs up the arm, `dip` presses along it */
export const PressHand: React.FC<{ p: V3; r: V3; sleeve: string; skin?: string; dip?: number; s?: number; hold?: React.ReactNode }> = ({ p, r, sleeve, skin = "#C98E6A", dip = 0, s = 1, hold }) => (
  <group position={p} rotation={r} scale={s}>
    <group position={[0, dip, 0]}>
      <P g={cyl(0.013, 0.015, 0.075, 6)} c={skin} p={[0.026, 0.006, 0.006]} />
      <P g={ico(0.013, 1)} c={skin} p={[0.026, 0.006, 0.006]} />
      {[0.002, -0.018, -0.036].map((x) => <P key={x} g={ico(0.016, 0)} c={skin} p={[x, 0.066, 0.016]} s={[0.95, 1.2, 1.05]} />)}
      <P g={ico(0.05, 0)} c={skin} p={[0, 0.115, -0.004]} s={[1, 1.15, 0.6]} />
      <P g={BOX} c={skin} p={[-0.052, 0.1, 0.012]} r={[0, 0, 0.5]} s={[0.022, 0.06, 0.026]} />
      <P g={cyl(0.055, 0.05, 1.6, 6)} c={sleeve} p={[0, 0.17, 0]} />
      {hold}
    </group>
  </group>
);

// ---------------- office things ----------------
/** wall clock facing +z; `h` = hours as a float (hands follow) */
export const Clock: React.FC<{ p?: V3; h: number; r?: number; red?: boolean }> = ({ p = [0, 0, 0], h, r = 0.35, red }) => (
  <group position={p}>
    <P g={cyl(r, r, 0.06, 16)} c={red ? N.red : "#2A2224"} r={[Math.PI / 2, 0, 0]} />
    <P g={cyl(r * 0.88, r * 0.88, 0.065, 16)} c="#F6F1E4" r={[Math.PI / 2, 0, 0]} />
    {Array.from({ length: 12 }, (_, i) => (
      <Box key={i} w={0.015 * (r / 0.35)} h={r * 0.12} d={0.01} c="#2A2224" p={[Math.sin((i * 30) * D) * r * 0.72, Math.cos(i * 30 * D) * r * 0.72 - r * 0.06, 0.07]} r={[0, 0, -i * 30 * D]} shadow={false} />
    ))}
    <group position={[0, 0, 0.075]} rotation={[0, 0, -((h % 12) / 12) * Math.PI * 2]}>
      <Box w={0.03 * (r / 0.35)} h={r * 0.5} d={0.01} c="#1A1416" shadow={false} />
    </group>
    <group position={[0, 0, 0.085]} rotation={[0, 0, -(h % 1) * Math.PI * 2]}>
      <Box w={0.02 * (r / 0.35)} h={r * 0.75} d={0.01} c={N.red} shadow={false} />
    </group>
  </group>
);
/** desk calculator with a live display */
export const Calculator: React.FC<{ p?: V3; r?: V3; text: string }> = ({ p = [0, 0, 0], r, text }) => {
  const tex = useLiveTex(512, 128, (c) => {
    c.fillStyle = "#9FB89A";
    c.fillRect(0, 0, 512, 128);
    c.fillStyle = "#1A2418";
    c.font = `700 92px Consolas, monospace`;
    c.textAlign = "right";
    c.textBaseline = "middle";
    c.fillText(text, 492, 68);
  });
  return (
    <group position={p} rotation={r}>
      <Box w={0.24} h={0.03} d={0.3} c="#3A3438" />
      <Panel map={tex} w={0.2} h={0.05} p={[0, 0.032, -0.09]} r={[-Math.PI / 2, 0, 0]} />
      {Array.from({ length: 16 }, (_, i) => (
        <Box key={i} w={0.035} h={0.015} d={0.035} c={i % 4 === 3 ? N.red : "#E8E2D6"} p={[-0.075 + (i % 4) * 0.05, 0.03, -0.02 + Math.floor(i / 4) * 0.05]} shadow={false} />
      ))}
    </group>
  );
};
/** desk lamp (warm bulb, adds a point light) */
export const DeskLamp: React.FC<{ p?: V3; on?: boolean }> = ({ p = [0, 0, 0], on = true }) => (
  <group position={p}>
    <P g={cyl(0.1, 0.12, 0.03, 8)} c="#2E3B2E" />
    <P g={cyl(0.015, 0.015, 0.42, 6)} c="#2E3B2E" />
    <P g={cone(0.15, 0.17, 8)} c="#2E6B4A" p={[0, 0.39, 0]} />
    <P g={ico(0.05, 1)} c="#FFF2C8" p={[0, 0.37, 0]} o={{ e: "#FFD98A", ei: on ? 3 : 0 }} shadow={false} />
    {on ? <pointLight position={[0, 0.5, 0.05]} intensity={1.1} distance={4} decay={2} color="#FFD49A" /> : null}
  </group>
);
/** beige CRT computer; `screen` draws the monitor */
export const Crt: React.FC<{ p?: V3; r?: V3; seed?: number; f?: number }> = ({ p = [0, 0, 0], r, seed = 1, f = 0 }) => {
  const tex = ctex(`crt${seed % 4}`, 256, 192, (c, R) => {
    c.fillStyle = "#0E2416";
    c.fillRect(0, 0, 256, 192);
    c.fillStyle = "#5CFF8A";
    for (let i = 0; i < 9; i++) for (let k = 0; k < 6; k++) c.fillRect(14 + k * 40, 14 + i * 19, 18 + R() * 12, 8);
  });
  const flick = 0.95 + 0.05 * Math.sin(f * 0.7 + seed);
  return (
    <group position={p} rotation={r}>
      <Box w={0.42} h={0.06} d={0.38} c="#D8CDB4" />
      <Box w={0.4} h={0.34} d={0.36} c="#E2D8C0" p={[0, 0.06, -0.02]} />
      <Panel map={tex} w={0.32} h={0.24} p={[0, 0.235, 0.161]} glow={flick} />
      <Box w={0.4} h={0.02} d={0.14} c="#CFC4AA" p={[0, 0, 0.3]} />
    </group>
  );
};
/** dot-matrix printer, a sheet of tickets feeding out (t frames) */
export const Printer: React.FC<{ p?: V3; r?: V3; t?: number; seed?: number }> = ({ p = [0, 0, 0], r, t = 0, seed = 0 }) => {
  const tex = useMemo(() => {
    const c = ticketTex(seed % 6).clone();
    c.needsUpdate = true;
    return c;
  }, [seed]);
  tex.offset.y = -(t + seed * 13) * 0.012;
  return (
    <group position={p} rotation={r}>
      <Box w={0.5} h={0.16} d={0.34} c="#CFC6B2" />
      <Box w={0.44} h={0.03} d={0.1} c="#3A3438" p={[0, 0.16, -0.05]} />
      <group position={[0, 0.17, 0.02]} rotation={[-0.35, 0, 0]}>
        <Panel map={tex} w={0.3} h={0.36} p={[0, 0.18, 0]} />
      </group>
      <Box w={0.04} h={0.02} d={0.02} c="#5CFF8A" p={[0.2, 0.16, 0.16]} o={{ e: "#5CFF8A", ei: 2 }} shadow={false} />
    </group>
  );
};
export const Desk: React.FC<{ p?: V3; r?: V3; w?: number; d?: number; c?: string }> = ({ p = [0, 0, 0], r, w = 1.4, d = 0.75, c = "#8A5A3A" }) => (
  <group position={p} rotation={r}>
    <Box w={w} h={0.05} d={d} c={c} p={[0, 0.72, 0]} />
    {[
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ].map(([a, b], i) => (
      <Box key={i} w={0.05} h={0.72} d={0.05} c="#3A2A22" p={[(w / 2 - 0.06) * a, 0, (d / 2 - 0.06) * b]} />
    ))}
  </group>
);
export const Chair: React.FC<{ p?: V3; ry?: number; c?: string }> = ({ p = [0, 0, 0], ry = 0, c = "#3A3438" }) => (
  <group position={p} rotation={[0, ry * D, 0]}>
    <Box w={0.46} h={0.06} d={0.44} c={c} p={[0, 0.42, 0]} />
    <Box w={0.46} h={0.5} d={0.05} c={c} p={[0, 0.46, -0.21]} />
    <P g={cyl(0.03, 0.03, 0.42, 6)} c="#2A2224" />
    <P g={cyl(0.24, 0.24, 0.03, 5)} c="#2A2224" />
  </group>
);
/** chalkboard with the rule written line by line (`k` lines shown, `tick` lines ticked) */
export const Chalkboard: React.FC<{ p?: V3; lines: string[]; k: number; tick?: number }> = ({ p = [0, 0, 0], lines, k, tick = 0 }) => {
  const tex = useLiveTex(1024, 640, (c) => {
    c.fillStyle = "#24382C";
    c.fillRect(0, 0, 1024, 640);
    c.fillStyle = "rgba(255,255,255,.05)";
    for (let i = 0; i < 40; i++) c.fillRect((i * 97) % 1024, (i * 53) % 640, 120, 6);
    c.font = `700 92px "Segoe Print", "Comic Sans MS", sans-serif`;
    c.textBaseline = "middle";
    lines.forEach((ln, i) => {
      const part = Math.max(0, Math.min(1, k - i));
      if (part <= 0) return;
      c.fillStyle = "#F4F1E8";
      c.fillText(`${i + 1}. ${ln}`.slice(0, Math.ceil((ln.length + 3) * part)), 60, 130 + i * 190);
      if (tick > i) {
        c.strokeStyle = N.gold;
        c.lineWidth = 16;
        c.beginPath();
        c.moveTo(520, 130 + i * 190);
        c.lineTo(560, 175 + i * 190);
        c.lineTo(650, 80 + i * 190);
        c.stroke();
      }
    });
  });
  return (
    <group position={p}>
      <Box w={2.3} h={1.5} d={0.06} c="#6B4A35" p={[0, -0.75, 0]} />
      <Panel map={tex} w={2.16} h={1.35} p={[0, 0, 0.035]} />
    </group>
  );
};
/** a framed golden ticket (the 14 jackpots wall); `lit` 0→1 */
export const Frame: React.FC<{ p?: V3; lit?: number; seed?: number }> = ({ p = [0, 0, 0], lit = 1, seed = 1 }) => (
  <group position={p} scale={1 + Math.sin(lit * Math.PI) * 0.14}>
    <Box w={0.34} h={0.44} d={0.04} c={N.gold} p={[0, -0.22, 0]} o={{ metal: 0.5, rough: 0.35, e: N.gold, ei: lit * 0.35 }} />
    <Panel map={ticketTex(seed)} w={0.24} h={0.34} p={[0, 0, 0.025]} glow={0.35 + lit * 0.75} />
  </group>
);

export const billTex = () =>
  ctex("bill1", 512, 220, (c) => {
    c.fillStyle = "#9CC29A";
    c.fillRect(0, 0, 512, 220);
    c.strokeStyle = "#3E6B47";
    c.lineWidth = 10;
    c.strokeRect(14, 14, 484, 192);
    c.fillStyle = "#E4EEDC";
    c.beginPath();
    c.ellipse(256, 110, 62, 74, 0, 0, 7);
    c.fill();
    c.fillStyle = "#2E5236";
    c.font = `900 64px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("1", 60, 60);
    c.fillText("1", 452, 162);
    c.fillText("$", 256, 114);
  });
/** a one-dollar note lying flat */
export const Bill: React.FC<{ p?: V3; r?: V3 }> = ({ p = [0, 0, 0], r = [-Math.PI / 2, 0, 0] }) => (
  <group position={p} rotation={r}>
    <Panel map={billTex()} w={0.156} h={0.067} />
  </group>
);

// ---------------- street + law ----------------
export const Van: React.FC<{ p?: V3; ry?: number; c?: string; doors?: number; wheel?: number }> = ({ p = [0, 0, 0], ry = 0, c = "#F1EEE6", doors = 0, wheel = 0 }) => (
  <group position={p} rotation={[0, ry * D, 0]}>
    <Box w={1.8} h={1.5} d={3.2} c={c} p={[0, 0.35, -0.3]} />
    <Box w={1.78} h={1.0} d={1.2} c={c} p={[0, 0.35, 1.7]} />
    <Box w={1.6} h={0.45} d={0.05} c="#22303E" p={[0, 0.85, 2.3]} r={[-0.35, 0, 0]} o={{ rough: 0.2, metal: 0.3 }} />
    <Box w={1.82} h={0.3} d={3.0} c={N.blue} p={[0, 0.9, -0.3]} shadow={false} />
    {[
      [0.9, 1.4],
      [-0.9, 1.4],
      [0.9, -1.2],
      [-0.9, -1.2],
    ].map(([x, z], i) => (
      <group key={i} position={[x, 0.36, z]} rotation={[wheel, 0, Math.PI / 2]}>
        <P g={cyl(0.36, 0.36, 0.25, 10)} c="#1A1A1E" p={[0, -0.125, 0]} />
      </group>
    ))}
    {/* rear doors open by `doors` (0 → 1) */}
    <group position={[0.9, 0.4, -1.91]} rotation={[0, -doors * 1.9, 0]}>
      <Box w={0.9} h={1.4} d={0.05} c={c} p={[-0.45, 0, 0]} />
    </group>
    <group position={[-0.9, 0.4, -1.91]} rotation={[0, doors * 1.9, 0]}>
      <Box w={0.9} h={1.4} d={0.05} c={c} p={[0.45, 0, 0]} />
    </group>
    <P g={ico(0.09, 0)} c="#FFF4C8" p={[0.65, 0.65, 2.31]} o={{ e: "#FFE7A0", ei: 2 }} shadow={false} />
    <P g={ico(0.09, 0)} c="#FFF4C8" p={[-0.65, 0.65, 2.31]} o={{ e: "#FFE7A0", ei: 2 }} shadow={false} />
  </group>
);
/** gavel arm: 1 raised → 0 on the block; `ats` = impact frames */
export const strike = (t: number, ats: number[]) => {
  const at = [...ats].reverse().find((a) => t >= a - 8);
  if (at === undefined) return 0.3;
  if (t < at - 2) return 0.3 + ((t - at + 8) / 6) * 0.7;
  if (t < at) return 1 - (t - at + 2) / 2;
  return t < at + 4 ? 0 : Math.min(0.3, ((t - at - 4) / 10) * 0.3);
};
/** arm angles for a gavel strike from behind the bench (bench top 1.17, block at the head's landing point) */
export const strikeArm = (r: number) => ({ f: 38 + 37 * r, e: -60 - 10 * r, o: 0 });
/** the gavel as it hangs from a hand (pass as holdR) */
export const GavelHeld: React.FC = () => (
  <group>
    <P g={limb(0.016, 0.016, 0.3)} c="#6B4A35" />
    <P g={cyl(0.055, 0.055, 0.22, 8)} c="#4A2E1E" p={[0.11, -0.32, 0]} r={[0, 0, Math.PI / 2]} />
  </group>
);
export const GavelBlock: React.FC<{ p: V3 }> = ({ p }) => <P g={cyl(0.14, 0.16, 0.05, 10)} c="#5A3A26" p={p} />;
/** a rubber stamp coming down by `k` (0 up → 1 stamped) with its print left on paper (`printed`) */
export const Stamp: React.FC<{ p?: V3; k: number; word: string; printed?: boolean }> = ({ p = [0, 0, 0], k, word, printed }) => {
  const tex = signTex(word, "rgba(0,0,0,0)", N.red, 1024, 320, Math.min(200, 1180 / word.length));
  return (
    <group position={p}>
      <group position={[0, 0.06 + (1 - k) * 0.7, 0]}>
        <Box w={0.36} h={0.012} d={0.16} c={N.red} />
        <Box w={0.36} h={0.07} d={0.16} c="#3A2A22" p={[0, 0.012, 0]} />
        <P g={cyl(0.05, 0.05, 0.22, 8)} c="#3A2A22" p={[0, 0.08, 0]} />
        <P g={ico(0.08, 1)} c="#3A2A22" p={[0, 0.32, 0]} />
        <P g={ico(0.075, 0)} c="#E2A882" p={[0, 0.37, 0]} />
        <P g={cyl(0.075, 0.085, 1.3, 6)} c="#2C3A5A" p={[0, 0.42, 0]} r={[0.25, 0, -1.05]} />
      </group>
      {printed ? <Panel map={tex} w={0.3} h={0.094} p={[0, 0.004, 0]} r={[-Math.PI / 2, 0, 0]} alpha /> : null}
    </group>
  );
};
const pageTex = () =>
  ctex("page", 256, 384, (c, R) => {
    c.fillStyle = "#F3EAD6";
    c.fillRect(0, 0, 256, 384);
    c.fillStyle = "#3A3030";
    c.fillRect(30, 26, 120, 14);
    for (let i = 0; i < 22; i++) c.fillRect(24, 60 + i * 14, 150 + R() * 60, 5);
  });
export const Book: React.FC<{ p?: V3; r?: V3; open?: number; c?: string }> = ({ p = [0, 0, 0], r, open = 1, c = "#6E2430" }) => (
  <group position={p} rotation={r}>
    <group rotation={[0, 0, open * 0]}>
      <Box w={0.3} h={0.05} d={0.42} c={c} p={[-0.15, 0, 0]} />
      <Box w={0.28} h={0.02} d={0.4} c="#F3EAD6" p={[-0.15, 0.05, 0]} />
      <Panel map={pageTex()} w={0.26} h={0.38} p={[-0.15, 0.071, 0]} r={[-Math.PI / 2, 0, 0]} glow={0.9} />
    </group>
    <group rotation={[0, 0, -(1 - open) * Math.PI]}>
      <Box w={0.3} h={0.05} d={0.42} c={c} p={[0.15, 0, 0]} />
      <Box w={0.28} h={0.02} d={0.4} c="#F3EAD6" p={[0.15, 0.05, 0]} />
      <Panel map={pageTex()} w={0.26} h={0.38} p={[0.15, 0.071, 0]} r={[-Math.PI / 2, 0, 0]} glow={0.9} />
    </group>
  </group>
);
export const Folder: React.FC<{ p?: V3; r?: V3; open?: number }> = ({ p = [0, 0, 0], r, open = 0 }) => (
  <group position={p} rotation={r}>
    <Box w={0.24} h={0.01} d={0.32} c="#D9B870" p={[-0.12, 0, 0]} />
    <group rotation={[0, 0, -open * Math.PI * 0.9]}>
      <Box w={0.24} h={0.01} d={0.32} c="#E3C57E" p={[0.12, 0.012, 0]} />
    </group>
  </group>
);
/** map pin: a cone with a ball head; pops up by `k` */
export const Pin: React.FC<{ p: V3; k: number; c?: string; s?: number }> = ({ p, k, c = N.red, s = 1 }) => {
  if (k <= 0) return null;
  const b = k < 1 ? 1 + Math.sin(k * Math.PI) * 0.4 : 1;
  return (
    <group position={p} scale={s * Math.min(1, k * 1.5) * b}>
      <P g={cone(0.05, 0.35, 5)} c="#E8E2D6" p={[0, 0.35, 0]} r={[Math.PI, 0, 0]} />
      <P g={ico(0.1, 1)} c={c} p={[0, 0.42, 0]} />
    </group>
  );
};
export const inPoly = (pts: [number, number][], x: number, y: number) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/** n seeded points inside a polygon */
export const scatter = (pts: [number, number][], n: number, seed: number) => {
  const R = rng(seed);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const out: [number, number][] = [];
  for (let guard = 0; out.length < n && guard < n * 200; guard++) {
    const x = x0 + R() * (x1 - x0);
    const y = y0 + R() * (y1 - y0);
    if (inPoly(pts, x, y)) out.push([x, y]);
  }
  return out;
};
export { BOX0, ico, cone, cyl };

// ---------------- casino ----------------
const cardPatternTex = () =>
  ctex("cardpattern", 256, 384, (c) => {
    c.fillStyle = "#1F4F8C";
    c.fillRect(0, 0, 256, 384);
    c.strokeStyle = "#F4EFE2";
    c.lineWidth = 5;
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 5; x++) {
        const cx = 26 + x * 51 + (y % 2) * 25;
        const cy = 24 + y * 48;
        c.beginPath();
        c.arc(cx, cy, 15, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.moveTo(cx - 15, cy);
        c.quadraticCurveTo(cx, cy - 12, cx + 15, cy);
        c.moveTo(cx - 15, cy);
        c.quadraticCurveTo(cx, cy + 12, cx + 15, cy);
        c.stroke();
      }
  });
/** a face with a rank ("A", "6", "8", "K"…) in the corners and big in the middle; no rank = the plain diamond face */
const rankFaceTex = (rank: string, red: boolean) =>
  ctex(`cardrank|${rank}|${red}`, 256, 384, (c) => {
    // drawn upside down: the face plane is turned over with the card, so this reads upright once `flip` is 1
    c.translate(256, 384);
    c.rotate(Math.PI);
    c.fillStyle = "#F1EBDD";
    c.fillRect(0, 0, 256, 384);
    c.fillStyle = red ? "#B8342C" : "#141216";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.font = `900 150px ${SIGN_FONT}`;
    c.fillText(rank, 128, 200);
    c.font = `900 54px ${SIGN_FONT}`;
    c.fillText(rank, 40, 46);
    c.save();
    c.translate(216, 338);
    c.rotate(Math.PI);
    c.fillText(rank, 0, 0);
    c.restore();
  });
const cardFaceTex = () =>
  ctex("cardface", 256, 384, (c) => {
    c.fillStyle = "#E4DCCA";
    c.fillRect(0, 0, 256, 384);
    c.fillStyle = "#B8342C";
    const pip = (x: number, y: number, s: number) => {
      c.beginPath();
      c.moveTo(x, y - s * 1.3);
      c.lineTo(x + s, y);
      c.lineTo(x, y + s * 1.3);
      c.lineTo(x - s, y);
      c.fill();
    };
    pip(128, 192, 60);
    pip(36, 50, 18);
    pip(220, 334, 18);
  });
export const CARD = { w: 0.16, d: 0.24 };
/**
 * A playing card lying flat, back up, long edges on ±x. `shift` (0→1) slides the back pattern towards +x, so the white margin
 * on −x grows: the flaw, far wider than the real sub-millimetre one or a phone could not show it. `flip` turns it side over
 * side (1 = face up), `tumble` end over end. `edge` lights the wide long edge.
 */
export const Card: React.FC<{ p?: V3; r?: V3; s?: number; shift?: number; flip?: number; tumble?: number; edge?: string; glow?: number; rank?: string; red?: boolean }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, shift = 1, flip = 0, tumble = 0, edge, glow = 1, rank, red = false }) => {
  const { w, d } = CARD;
  return (
    <group position={p} rotation={r} scale={s}>
      <group rotation={[tumble * Math.PI, 0, flip * Math.PI]}>
        <Box w={w} h={0.002} d={d} c="#F4EFE2" p={[0, -0.001, 0]} shadow={false} />
        <P g={PLANE} c="#FFFFFF" p={[shift * w * 0.05, 0.0012, 0]} r={[-Math.PI / 2, 0, 0]} s={[w * 0.84, d * 0.92, 1]} o={{ map: cardPatternTex() }} shadow={false} />
        <P g={PLANE} c="#FFFFFF" p={[0, -0.0012, 0]} r={[Math.PI / 2, 0, 0]} s={[w, d, 1]} o={{ map: rank ? rankFaceTex(rank, red) : cardFaceTex() }} shadow={false} />
        {edge && glow > 0 ? <Box w={0.011} h={0.004} d={d} c={edge} p={[-w / 2, -0.001, 0]} o={{ e: edge, ei: 1.3 * glow }} shadow={false} /> : null}
      </group>
    </group>
  );
};
/** the card box on the table, mouth towards +z; `edge` lights the long edge of the next card */
export const CardShoe: React.FC<{ p?: V3; ry?: number; edge?: string; glow?: number }> = ({ p = [0, 0, 0], ry = 0, edge, glow = 1 }) => (
  <group position={p} rotation={[0, ry * D, 0]}>
    <group rotation={[0.16, 0, 0]}>
      <Box w={0.22} h={0.15} d={0.46} c="#17141A" o={{ rough: 0.4 }} />
      <Box w={0.226} h={0.014} d={0.024} c={N.gold} p={[0, 0.142, 0.22]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
      <Card p={[0, 0.076, 0.27]} r={[-0.42, 0, 0]} />
      {edge && glow > 0 ? <Box w={0.16} h={0.006} d={0.006} c={edge} p={[0, 0.03, 0.35]} o={{ e: edge, ei: 2.6 * glow }} shadow={false} /> : null}
    </group>
  </group>
);
/** a stack of `n` casino chips */
export const ChipStack: React.FC<{ p?: V3; n: number; c?: string; r?: number; seed?: number }> = ({ p = [0, 0, 0], n, c = "#B8342C", r = 0.048, seed = 1 }) => {
  const R = rng(seed * 31 + 7);
  return (
    <group position={p}>
      {Array.from({ length: Math.max(0, Math.floor(n)) }, (_, i) => (
        <P key={i} g={cyl(r, r, 0.015, 10)} c={i % 4 === 3 ? "#F3E9D2" : c} p={[(R() - 0.5) * 0.004, i * 0.0155, (R() - 0.5) * 0.004]} shadow={i % 4 === 0} />
      ))}
    </group>
  );
};
/** a block of chip stacks that rises with `k`; the casino's colours in rows */
export const ChipHill: React.FC<{ p?: V3; k: number; cols?: number; rows?: number; max?: number; seed?: number }> = ({ p = [0, 0, 0], k, cols = 4, rows = 3, max = 30, seed = 3 }) => {
  const R = rng(seed);
  const heights = Array.from({ length: cols * rows }, () => 0.5 + R() * 0.5);
  return (
    <group position={p}>
      {heights.map((h, i) => (
        <ChipStack key={i} p={[((i % cols) - (cols - 1) / 2) * 0.1, 0, (Math.floor(i / cols) - (rows - 1) / 2) * 0.1]} n={h * max * k} c={["#B8342C", "#1F4F8C", "#1E1A22", "#2E8B57"][i % 4]} seed={seed + i} />
      ))}
    </group>
  );
};
/** the machine that shuffles without turning a card: cards in at the top, out at the front */
export const ShuffleMachine: React.FC<{ p?: V3; on?: number; f?: number }> = ({ p = [0, 0, 0], on = 1, f = 0 }) => (
  <group position={p}>
    <Box w={0.42} h={0.3} d={0.44} c="#20252C" o={{ metal: 0.4, rough: 0.4 }} />
    <Box w={0.26} h={0.012} d={0.3} c="#0A0A0E" p={[0, 0.3, 0]} shadow={false} />
    <Box w={0.26} h={0.05} d={0.012} c="#0A0A0E" p={[0, 0.06, 0.222]} shadow={false} />
    <P g={ico(0.016, 1)} c="#FFF2C8" p={[0.15, 0.24, 0.222]} o={{ e: Math.floor(f / 8) % 2 && on ? "#FFB347" : "#3A2A18", ei: 2.4 }} shadow={false} />
    <Box w={0.3} h={0.008} d={0.008} c="#62D2DC" p={[0, 0.27, 0.222]} o={{ e: "#62D2DC", ei: 1.6 * on }} shadow={false} />
  </group>
);
/** a beam balance for two amounts: `tilt` −1 (left pan down) → 1 (right pan down) */
export const Balance: React.FC<{ p?: V3; tilt: number; left: React.ReactNode; right: React.ReactNode }> = ({ p = [0, 0, 0], tilt, left, right }) => {
  const a = tilt * 0.26;
  const arm = 0.42;
  const dy = Math.sin(a) * arm;
  return (
    <group position={p}>
      <P g={cyl(0.1, 0.14, 0.03, 10)} c="#2A2224" />
      <P g={cyl(0.014, 0.018, 0.56, 6)} c={N.gold} o={{ metal: 0.6, rough: 0.35 }} />
      <group position={[0, 0.56, 0]} rotation={[0, 0, -a]}>
        <Box w={arm * 2} h={0.018} d={0.018} c={N.gold} p={[0, -0.009, 0]} o={{ metal: 0.6, rough: 0.35 }} />
      </group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * Math.cos(a) * arm, 0.56 - s * dy - 0.24, 0]}>
          <P g={cyl(0.003, 0.003, 0.24, 4)} c={N.gold} shadow={false} />
          <P g={cyl(0.13, 0.11, 0.014, 10)} c="#7A5A2A" o={{ metal: 0.5, rough: 0.4 }} />
          <group position={[0, 0.014, 0]}>{s < 0 ? left : right}</group>
        </group>
      ))}
    </group>
  );
};

// ---------------- draw room ----------------
/** the number computer: a dark cabinet whose screen rolls numbers (illustration only); `fixed` 0→1 turns them amber and stops them */
export const RngRack: React.FC<{ p?: V3; f?: number; fixed?: number; seed?: number; w?: number }> = ({ p = [0, 0, 0], f = 0, fixed = 0, seed = 1, w = 0.62 }) => {
  const step = fixed >= 1 ? 0 : Math.floor(f / 5);
  const tex = useLiveTex(512, 256, (c) => {
    const R = rng(seed * 101 + step);
    c.fillStyle = "#06120E";
    c.fillRect(0, 0, 512, 256);
    c.fillStyle = fixed > 0.5 ? "#FFB347" : "#5CFF8A";
    c.font = "900 76px Consolas, monospace";
    c.textAlign = "center";
    c.textBaseline = "middle";
    for (let i = 0; i < 6; i++) c.fillText(String(1 + Math.floor(R() * 47)).padStart(2, "0"), 86 + (i % 3) * 170, 72 + Math.floor(i / 3) * 112);
  });
  return (
    <group position={p}>
      <Box w={w} h={1.62} d={0.5} c="#14161C" o={{ metal: 0.4, rough: 0.45 }} />
      <Panel map={tex} w={w * 0.84} h={w * 0.42} p={[0, 1.26, 0.255]} glow={1.1} />
      {Array.from({ length: 6 }, (_, i) => <Box key={i} w={w * 0.8} h={0.014} d={0.01} c="#2A2E36" p={[0, 0.3 + i * 0.1, 0.252]} shadow={false} />)}
      <P g={ico(0.016, 1)} c="#5CFF8A" p={[w * 0.36, 1.02, 0.256]} o={{ e: "#5CFF8A", ei: 2 }} shadow={false} />
    </group>
  );
};
/** a security camera on an arm, looking along +z (turn it with `ry`); the red light blinks with `f` */
export const CeilingCam: React.FC<{ p?: V3; ry?: number; pitch?: number; f?: number; s?: number }> = ({ p = [0, 0, 0], ry = 0, pitch = 0.45, f = 0, s = 1 }) => (
  <group position={p} rotation={[0, ry * D, 0]} scale={s}>
    <P g={cyl(0.018, 0.018, 0.28, 6)} c="#2A2D34" />
    <group rotation={[pitch, 0, 0]}>
      <Box w={0.13} h={0.12} d={0.34} c="#8E9298" p={[0, -0.12, 0]} o={{ rough: 0.6 }} />
      <P g={cyl(0.05, 0.05, 0.06, 12)} c="#14161C" p={[0, -0.06, 0.17]} r={[Math.PI / 2, 0, 0]} o={{ metal: 0.5, rough: 0.2 }} />
      <P g={ico(0.012, 1)} c="#FF3B30" p={[0.045, -0.02, 0.172]} o={{ e: "#FF3B30", ei: Math.floor(f / 15) % 2 ? 0.4 : 3 }} shadow={false} />
    </group>
  </group>
);
/** a coin; `spin` in radians about its own axis */
export const Coin: React.FC<{ p?: V3; spin?: number; s?: number }> = ({ p = [0, 0, 0], spin = 0, s = 1 }) => (
  <group position={p} rotation={[spin, 0, 0]} scale={s}>
    <P g={cyl(0.05, 0.05, 0.008, 16)} c={N.gold} p={[0, -0.004, 0]} o={{ metal: 0.6, rough: 0.3 }} />
  </group>
);
/** a wall calendar with no dates, only squares; `lit` days glow amber */
export const WallCalendar: React.FC<{ p?: V3; s?: number; lit?: number[] }> = ({ p = [0, 0, 0], s = 1, lit = [] }) => (
  <group position={p} scale={s}>
    <Box w={1.5} h={1.24} d={0.04} c="#E8E0CE" />
    <Box w={1.5} h={0.2} d={0.05} c={N.red} p={[0, 1.04, 0]} />
    {Array.from({ length: 28 }, (_, i) => {
      const on = lit.includes(i);
      return <Box key={i} w={0.17} h={0.17} d={0.01} c={on ? "#FFB347" : "#C8BFA8"} p={[-0.585 + (i % 7) * 0.195, 0.81 - Math.floor(i / 7) * 0.2, 0.024]} o={on ? { e: "#FFB347", ei: 1.6 } : undefined} shadow={false} />;
    })}
  </group>
);
// ---------------- slot machines and phones ----------------
/** reel symbols: drawn shapes and short marks, no real game's art */
const SYM: { t: string; c: string }[] = [
  { t: "7", c: "#FF4A3A" },
  { t: "BAR", c: "#F3EFE6" },
  { t: "★", c: "#FFB347" },
  { t: "♦", c: "#62D2DC" },
  { t: "●", c: "#5CFF8A" },
  { t: "♣", c: "#C9A0FF" },
];
const drawReels = (c: CanvasRenderingContext2D, pos: number[], win: number) => {
  c.fillStyle = "#0A0810";
  c.fillRect(0, 0, 512, 384);
  c.textAlign = "center";
  c.textBaseline = "middle";
  pos.forEach((p, i) => {
    const x = 18 + i * 162;
    c.fillStyle = "#F7F1E4";
    c.fillRect(x, 24, 150, 300);
    c.save();
    c.beginPath();
    c.rect(x, 24, 150, 300);
    c.clip();
    const base = Math.floor(p);
    for (let k = -2; k <= 2; k++) {
      const s = SYM[(((base + k) % SYM.length) + SYM.length) % SYM.length];
      const y = 174 + (k - (p - base)) * 100;
      c.fillStyle = s.c === "#F3EFE6" ? "#3A3030" : s.c;
      c.font = `900 ${s.t.length > 1 ? 52 : 82}px Arial Black, Arial, sans-serif`;
      c.fillText(s.t, x + 75, y);
    }
    c.restore();
    c.fillStyle = "rgba(0,0,0,.28)";
    c.fillRect(x, 24, 150, 46);
    c.fillRect(x, 278, 150, 46);
  });
  c.fillStyle = win > 0 ? `rgba(255,179,71,${0.4 + 0.6 * win})` : "rgba(255,74,58,.55)";
  c.fillRect(0, 170, 512, 8);
  c.fillStyle = "#14101A";
  c.fillRect(0, 336, 512, 48);
  c.fillStyle = win > 0 ? "#FFB347" : "#62D2DC";
  c.font = "900 34px Arial Black, Arial, sans-serif";
  c.fillText(win > 0 ? "WIN" : "PLAY", 256, 361);
};
/** where reel i stands during a spin (`spin` 0→1): fast, then each reel stops on `land[i]`, left to right */
const reelPos = (land: number[], spin: number) => land.map((l, i) => (spin <= 0 || spin >= 0.55 + i * 0.2 ? l : l - (0.55 + i * 0.2 - spin) * 40));
/** the screen of a hero machine, redrawn each frame */
const LiveReels: React.FC<{ land: number[]; spin: number; win: number; glow: number }> = ({ land, spin, win, glow }) => {
  const tex = useLiveTex(512, 384, (c) => drawReels(c, reelPos(land, spin), win));
  return <Panel map={tex} w={0.52} h={0.39} p={[0, 0, 0.012]} glow={glow} />;
};
/** the screen of a background machine: one cached picture per `land` */
const StillReels: React.FC<{ land: number[]; glow: number }> = ({ land, glow }) => (
  <Panel map={ctex(`reels|${land.join(",")}`, 512, 384, (c) => drawReels(c, land, 0))} w={0.52} h={0.39} p={[0, 0, 0.012]} glow={glow} />
);
export const SLOT = { w: 0.72, screenY: 1.22, deckY: 0.84, front: 0.25, button: [0.2, 0.875, 0.27] as V3 };
/**
 * A slot machine facing +z, its foot on the floor at `p`. `spin` 0→1 runs one spin that lands on `land`; `win` 0→1 lights
 * it up; `press` 0→1 pushes the spin button; `lit` 0→1 is the power (0 = dark). `open` 0→1 swings the front door off its
 * left hinge to show the board. `live` false draws a cached screen (use it for the rows behind the hero machine).
 */
export const SlotMachine: React.FC<{
  p?: V3;
  ry?: number;
  f?: number;
  land?: number[];
  spin?: number;
  win?: number;
  press?: number;
  lit?: number;
  open?: number;
  live?: boolean;
  name?: string;
  c?: string;
}> = ({ p = [0, 0, 0], ry = 0, f = 0, land = [1, 2, 3], spin = 0, win = 0, press = 0, lit = 1, open = 0, live = true, name = "STAR RUN", c = "#2C2236" }) => {
  const glow = (0.9 + 0.1 * Math.sin(f * 0.3)) * lit + win * 0.5 * Math.abs(Math.sin(f * 0.5));
  const btn = lit > 0 ? 1.2 + win * 2 : 0;
  return (
    <group position={p} rotation={[0, ry * D, 0]}>
      <Box w={SLOT.w} h={0.8} d={0.6} c="#17141C" o={{ rough: 0.5 }} />
      <Box w={SLOT.w} h={0.04} d={0.6} c={N.gold} p={[0, 0.8, 0]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
      {/* the deck: spin button on the right, two small buttons */}
      <Box w={SLOT.w} h={0.05} d={0.26} c="#2A2630" p={[0, 0.8, 0.18]} r={[0.18, 0, 0]} />
      <group position={[SLOT.button[0], SLOT.button[1] - press * 0.012, SLOT.button[2]]} rotation={[0.18, 0, 0]}>
        <P g={cyl(0.048, 0.052, 0.03, 14)} c="#B8742C" o={{ e: "#FFB347", ei: btn }} />
      </group>
      {[-0.2, -0.08].map((x) => <Box key={x} w={0.07} h={0.02} d={0.05} c="#3A3440" p={[x, 0.86, 0.24]} r={[0.18, 0, 0]} o={{ e: "#62D2DC", ei: 0.4 * lit }} shadow={false} />)}
      {/* the cabinet behind the door */}
      <Box w={SLOT.w} h={1.0} d={0.48} c={c} p={[0, 0.86, -0.06]} o={{ metal: 0.3, rough: 0.45 }} />
      {open > 0 ? (
        <group>
          <Box w={0.58} h={0.62} d={0.02} c="#1E4A2E" p={[0, 0.94, 0.18]} />
          {Array.from({ length: 6 }, (_, i) => <Box key={i} w={0.08 + (i % 3) * 0.03} h={0.05} d={0.03} c={i === 2 ? "#14161C" : "#2A2E36"} p={[-0.18 + (i % 3) * 0.18, 1.06 + Math.floor(i / 3) * 0.2, 0.19]} shadow={false} />)}
          <Box w={0.1} h={0.08} d={0.035} c="#14161C" p={[0.02, 1.0, 0.195]} shadow={false} />
          <P g={ico(0.01, 1)} c="#5CFF8A" p={[0.2, 1.4, 0.2]} o={{ e: "#5CFF8A", ei: 2 }} shadow={false} />
        </group>
      ) : null}
      {/* the door: screen and bezel, hinged on the left edge */}
      <group position={[-SLOT.w / 2, 0, SLOT.front - 0.06]} rotation={[0, -open * 1.7, 0]}>
        <group position={[SLOT.w / 2, 0, 0]}>
          <Box w={SLOT.w} h={0.62} d={0.04} c="#1C1822" p={[0, 0.91, 0]} />
          <group position={[0, SLOT.screenY, 0.02]}>{live ? <LiveReels land={land} spin={spin} win={win} glow={glow} /> : <StillReels land={land} glow={glow} />}</group>
        </group>
      </group>
      {/* the topper: a made-up game name */}
      <Box w={SLOT.w} h={0.3} d={0.4} c="#1C1822" p={[0, 1.86, -0.08]} />
      <Panel map={signTex(name, "#140E1E", N.gold, 1024, 300, Math.min(190, 1500 / name.length))} w={0.66} h={0.2} p={[0, 2.01, 0.125]} glow={(0.95 + win * 0.6) * Math.max(lit, 0.04)} />
      <Box w={SLOT.w} h={0.03} d={0.03} c="#62D2DC" p={[0, 2.16, 0.11]} o={{ e: win > 0 ? "#FFB347" : "#62D2DC", ei: 1.8 * lit }} shadow={false} />
      {win > 0 ? <pointLight position={[0, 1.5, 0.95]} intensity={1.3 * win} distance={2.2} color="#FFB347" /> : null}
    </group>
  );
};
/** a round stool in front of a machine */
export const SlotStool: React.FC<{ p?: V3 }> = ({ p = [0, 0, 0] }) => (
  <group position={p}>
    <P g={cyl(0.03, 0.05, 0.6, 6)} c="#2A2A30" o={{ metal: 0.5, rough: 0.4 }} />
    <P g={cyl(0.19, 0.18, 0.08, 12)} c="#7A2434" p={[0, 0.58, 0]} o={{ rough: 0.6 }} />
  </group>
);
/** phone screens: a recording frame, the timing app (a bar and its cue at `k`), the cue firing, or off */
export type PhoneScreen = "rec" | "app" | "go" | "off" | "upload";
/**
 * A phone, screen on +z, centred on `p`. `buzz` 0→1 shakes it a little (the phone, never the camera) and sends rings out;
 * `k` 0→1 is where the cue is on the app's bar.
 */
export const Phone: React.FC<{ p?: V3; r?: V3; s?: number; f?: number; screen?: PhoneScreen; buzz?: number; k?: number }> = ({ p = [0, 0, 0], r, s = 1, f = 0, screen = "app", buzz = 0, k = 0 }) => {
  const tex = useLiveTex(256, 512, (c) => {
    c.fillStyle = screen === "go" ? "#FFB347" : screen === "off" ? "#06080C" : "#14222A";
    c.fillRect(0, 0, 256, 512);
    if (screen === "rec") {
      c.strokeStyle = "#F3EFE6";
      c.lineWidth = 6;
      c.strokeRect(24, 120, 208, 272);
      c.fillStyle = Math.floor(f / 15) % 2 ? "#5A1A18" : "#FF3B30";
      c.beginPath();
      c.arc(128, 448, 26, 0, 7);
      c.fill();
    } else if (screen === "upload") {
      c.fillStyle = "#1A2C30";
      c.fillRect(30, 240, 196, 26);
      c.fillStyle = "#62D2DC";
      c.fillRect(30, 240, 196 * k, 26);
      c.beginPath();
      c.moveTo(128, 120);
      c.lineTo(84, 176);
      c.lineTo(172, 176);
      c.fill();
      c.fillRect(114, 170, 28, 50);
    } else if (screen === "app") {
      c.fillStyle = "#2E4650";
      c.fillRect(110, 60, 36, 392);
      c.fillStyle = "#62D2DC";
      c.fillRect(92, 420, 72, 8);
      c.fillStyle = buzz > 0.5 ? "#FFB347" : "#F3EFE6";
      c.fillRect(100, 72 + k * 348, 56, 16);
    } else if (screen === "go") {
      c.fillStyle = "#06080C";
      c.fillRect(100, 236, 56, 40);
    }
  });
  const j = buzz > 0 ? Math.sin(f * 2.9) * 0.0025 * buzz : 0;
  const ring = (f % 10) / 10;
  return (
    <group position={p} rotation={r} scale={s}>
      <group position={[j, 0, 0]}>
        <Box w={0.075} h={0.155} d={0.009} c="#101216" p={[0, -0.0775, -0.0045]} o={{ metal: 0.4, rough: 0.3 }} />
        <Panel map={tex} w={0.067} h={0.14} p={[0, 0, 0.0005]} glow={screen === "off" ? 0.05 : 1} />
      </group>
      {buzz > 0
        ? [0, 0.5].map((o) => {
            const q = (ring + o) % 1;
            return <P key={o} g={torus(1, 0.012, 24)} c="#FFB347" s={[0.06 + q * 0.07, 0.1 + q * 0.07, 1]} o={{ e: "#FFB347", ei: 2 * buzz * (1 - q), op: buzz * (1 - q) }} shadow={false} />;
          })
        : null}
    </group>
  );
};

// ---------------- roulette ----------------
/** the European wheel, clockwise from zero */
export const WHEEL_ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
export const RED_NUMS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const POCKET = (Math.PI * 2) / 37;
/** pocket i's angle in the rotor's own frame (world angle = this − rot) */
const pocketAngle = (i: number) => i * POCKET;
export const WHEEL = { rim: 0.42, track: 0.37, pocket: 0.255, trackY: 0.105, pocketY: 0.088 };
const rotorTex = () =>
  ctex("roulette-rotor", 1024, 1024, (c) => {
    const C = 512;
    c.clearRect(0, 0, 1024, 1024);
    WHEEL_ORDER.forEach((n, i) => {
      const a0 = pocketAngle(i) - POCKET / 2;
      c.beginPath();
      c.moveTo(C, C);
      c.arc(C, C, 510, a0, a0 + POCKET);
      c.closePath();
      c.fillStyle = n === 0 ? "#1E8A4A" : RED_NUMS.has(n) ? "#B8261E" : "#141216";
      c.fill();
    });
    // the number ring outside, the pockets inside it, a wooden cone in the middle
    c.font = `900 40px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "#F3EAD6";
    WHEEL_ORDER.forEach((n, i) => {
      c.save();
      c.translate(C, C);
      c.rotate(pocketAngle(i) + Math.PI / 2);
      c.fillText(String(n), 0, -470);
      c.restore();
    });
    c.strokeStyle = "#C9A04A";
    c.lineWidth = 8;
    for (const r of [430, 300]) {
      c.beginPath();
      c.arc(C, C, r, 0, Math.PI * 2);
      c.stroke();
    }
    c.lineWidth = 5;
    for (let i = 0; i < 37; i++) {
      const a = pocketAngle(i) - POCKET / 2;
      c.beginPath();
      c.moveTo(C + Math.cos(a) * 300, C + Math.sin(a) * 300);
      c.lineTo(C + Math.cos(a) * 430, C + Math.sin(a) * 430);
      c.stroke();
    }
    c.beginPath();
    c.arc(C, C, 296, 0, Math.PI * 2);
    c.fillStyle = "#6A3E22";
    c.fill();
  });
export type BallState = { a: number; rr: number; y: number; rot: number; on: boolean };
/**
 * One spin, `t` frames after the croupier launches the ball: it circles the track, slowing, leaves the rim at world angle
 * `zone` at frame `drop`, bounces in, and from then on rides the rotor in pocket `pocket` (an index into WHEEL_ORDER).
 * The rotor turns the other way at `wr` rad/frame from `rot0`. Before t = 0 the ball is not on the wheel.
 */
export const spinAt = (t: number, { drop = 150, zone = 0, pocket = 0, wr = 0.03, rot0 = 0, w0 = 0.3 }: { drop?: number; zone?: number; pocket?: number; wr?: number; rot0?: number; w0?: number } = {}): BallState => {
  const rot = rot0 + wr * t;
  const T = drop * 1.7;
  const F = (x: number) => w0 * (x - (x * x) / (2 * T));
  const free = (x: number) => zone - (F(drop) - F(Math.min(x, T)));
  if (t < 0) return { a: 0, rr: WHEEL.track, y: WHEEL.trackY, rot, on: false };
  if (t < drop) return { a: free(t), rr: WHEEL.track, y: WHEEL.trackY, rot, on: true };
  const tl = drop + 26;
  const raw = (x: number) => pocketAngle(pocket) - (rot0 + wr * x);
  const n = Math.round((free(tl) - raw(tl)) / (Math.PI * 2));
  const k = Math.min(1, Math.max(0, (t - drop - 6) / 20));
  const kk = k * k * (3 - 2 * k);
  const a = free(t) * (1 - kk) + (raw(t) + n * Math.PI * 2) * kk;
  const d = t - drop;
  const fall = Math.min(1, d / 10);
  const rr = WHEEL.track + (WHEEL.pocket - WHEEL.track) * (1 - (1 - fall) ** 2);
  const y = WHEEL.trackY + (WHEEL.pocketY - WHEEL.trackY) * fall + 0.018 * Math.abs(Math.sin(d * 0.55)) * Math.exp(-d / 9);
  return { a, rr, y, rot, on: true };
};
/**
 * A European roulette wheel, its foot at `p` (sits in a table top), the rotor turned by `ball.rot`. `tilt` (degrees)
 * leans the whole wheel; `mark` 0→1 draws an amber arc on the track at world angle `zone` (the drop zone).
 */
export const RouletteWheel: React.FC<{ p?: V3; s?: number; ball?: BallState; rot?: number; tilt?: number; mark?: number; zone?: number }> = ({ p = [0, 0, 0], s = 1, ball, rot, tilt = 0, mark = 0, zone = 0 }) => {
  const r = ball?.rot ?? rot ?? 0;
  return (
    <group position={p} scale={s} rotation={[tilt * D, 0, tilt * 0.4 * D]}>
      {/* the bowl stays below the rotor; the track and the gold rim are rings, so the rotor shows through */}
      <P g={cyl(WHEEL.rim, WHEEL.rim + 0.02, 0.075, 28)} c="#3A2216" o={{ rough: 0.4 }} />
      <P g={torus(0.385, 0.04, 28)} c="#5A3420" p={[0, 0.088, 0]} r={[Math.PI / 2, 0, 0]} s={[1, 1, 0.45]} o={{ rough: 0.3 }} />
      <P g={torus(WHEEL.rim, 0.012, 28)} c={N.gold} p={[0, 0.105, 0]} r={[Math.PI / 2, 0, 0]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
      {mark > 0 ? (
        <P g={cyl(0.03, 0.03, 0.003, 8)} c="#FFB347" p={[Math.cos(zone) * WHEEL.track, WHEEL.trackY - 0.002, Math.sin(zone) * WHEEL.track]} s={[1.6 * mark, 1, 1.6 * mark]} o={{ e: "#FFB347", ei: 1.6 }} shadow={false} />
      ) : null}
      <group rotation={[0, r, 0]}>
        <Panel map={rotorTex()} w={0.62} h={0.62} p={[0, WHEEL.pocketY - 0.004, 0]} r={[-Math.PI / 2, 0, 0]} alpha glow={0.9} />
        <P g={cone(0.13, 0.06, 10)} c="#7A4A28" p={[0, WHEEL.pocketY - 0.004, 0]} o={{ rough: 0.35 }} />
        <P g={cyl(0.018, 0.024, 0.07, 8)} c={N.gold} p={[0, WHEEL.pocketY + 0.05, 0]} o={{ metal: 0.7, rough: 0.3 }} />
        {[0, 1].map((i) => <Box key={i} w={i ? 0.012 : 0.16} h={0.012} d={i ? 0.16 : 0.012} c={N.gold} p={[0, WHEEL.pocketY + 0.1, 0]} o={{ metal: 0.7, rough: 0.3 }} shadow={false} />)}
      </group>
      {ball?.on ? <P g={sph(0.011, 8, 6)} c="#F7F4EC" p={[Math.cos(ball.a) * ball.rr, ball.y + 0.011, Math.sin(ball.a) * ball.rr]} o={{ rough: 0.25 }} /> : null}
    </group>
  );
};

// ---------------- paperwork ----------------
/**
 * A sheet of terms lying flat (top edge toward −z): a title, `k` 0→1 brings the lines in one by one, `hi` lights one line
 * amber (the clause the shot is about), `sign` 0→1 draws the signature on the bottom line.
 */
export const Contract: React.FC<{ p?: V3; r?: V3; s?: number; title?: string; lines?: number; k?: number; hi?: number; sign?: number }> = ({ p = [0, 0, 0], r = [0, 0, 0], s = 1, title = "TERMS", lines = 6, k = 1, hi = -1, sign = 0 }) => {
  const tex = useLiveTex(384, 512, (c) => {
    c.fillStyle = "#F4EEDF";
    c.fillRect(0, 0, 384, 512);
    c.fillStyle = "#141216";
    c.font = `900 52px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.fillText(title, 192, 70);
    const shown = Math.round(k * lines);
    for (let i = 0; i < shown; i++) {
      c.fillStyle = i === hi ? "#E8962A" : "#7A7468";
      c.fillRect(40, 120 + i * 46, i === hi ? 304 : 250 + ((i * 37) % 54), i === hi ? 22 : 14);
    }
    c.fillStyle = "#141216";
    c.fillRect(40, 452, 200, 3);
    if (sign > 0) {
      c.strokeStyle = "#1F3F8C";
      c.lineWidth = 6;
      c.beginPath();
      const n = Math.max(2, Math.round(sign * 24));
      for (let i = 0; i < n; i++) {
        const x = 48 + i * 7.5;
        const y = 438 - Math.sin(i * 0.9) * 14 - (i % 5 === 0 ? 10 : 0);
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
  });
  return (
    <group position={p} rotation={r} scale={s}>
      <Box w={0.3} h={0.003} d={0.4} c="#E8E1CF" p={[0, -0.002, 0]} shadow={false} />
      <Panel map={tex} w={0.3} h={0.4} p={[0, 0.0015, 0]} r={[-Math.PI / 2, 0, 0]} glow={0.95} />
    </group>
  );
};
