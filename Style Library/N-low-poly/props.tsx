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
