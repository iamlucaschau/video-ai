/**
 * Style M 3D sets for m-doss (2026-11-04). Units: metres, y up, the camera usually looks down −z.
 * Indoor: a room box (floor at y 0, back wall at z = −d) with furniture built from inked toon boxes and cylinders.
 * Outdoor: textured ground, hills, trees, rocks, the cliff, all inked; fog = horizon colour.
 */
import React, { useMemo } from "react";
import * as THREE from "three";
import { BOX, BOX0, ball, cyl, PLANE, rng, rock, Solid, TEX, toon, type V3 } from "./kit3d";

// ---------------- room ----------------
export type RoomProps = { w?: number; d?: number; h?: number; wall: string; floor?: string; trim?: string; children?: React.ReactNode; front?: number };
/** Floor, back and side walls, a dado rail and skirting; open toward the camera (z = front). */
export const Room: React.FC<RoomProps> = ({ w = 9, d = 7, h = 4.6, wall, floor = "#9A6E48", trim = "#4A3A30", children, front = 6 }) => {
  const zc = (front - d) / 2;
  const len = front + d;
  return (
    <group>
      <Solid g={BOX} color={floor} map={TEX.planks([3, 4])} p={[0, -0.05, zc]} s={[w, 0.1, len]} ink="none" />
      <Solid g={BOX0} color={wall} map={TEX.plaster([2, 1])} p={[0, 0, -d - 0.1]} s={[w, h, 0.2]} />
      <Solid g={BOX0} color={wall} map={TEX.plaster([2, 1])} p={[-w / 2 - 0.1, 0, zc]} s={[0.2, h, len]} />
      <Solid g={BOX0} color={wall} map={TEX.plaster([2, 1])} p={[w / 2 + 0.1, 0, zc]} s={[0.2, h, len]} />
      <Solid g={BOX} color="#2A2228" p={[0, h + 0.05, zc]} s={[w + 0.4, 0.1, len]} ink="none" />
      {/* exposed rafters and a picture rail high on the wall, so the top of a tall frame has structure, not a void */}
      {Array.from({ length: Math.ceil(len / 1.8) }, (_, i) => (
        <Solid key={`r${i}`} g={BOX} color={trim} p={[0, h - 0.2, -d + 0.9 + i * 1.8]} s={[w, 0.22, 0.18]} />
      ))}
      <Solid g={BOX} color={trim} p={[0, h - 0.9, -d + 0.03]} s={[w, 0.08, 0.06]} />
      {/* dado rail and skirting on the three walls */}
      {[0.12, 1.0].map((y, i) => (
        <group key={y}>
          <Solid g={BOX} color={trim} p={[0, y, -d + 0.02]} s={[w, i ? 0.06 : 0.24, 0.06]} />
          <Solid g={BOX} color={trim} p={[-w / 2 + 0.02, y, zc]} s={[0.06, i ? 0.06 : 0.24, len]} />
          <Solid g={BOX} color={trim} p={[w / 2 - 0.02, y, zc]} s={[0.06, i ? 0.06 : 0.24, len]} />
        </group>
      ))}
      {children}
    </group>
  );
};

/** A window in a wall at (x, y) on the back wall plane z: frame, bars, glowing panes (day / night). */
export const Win: React.FC<{ p: V3; w?: number; h?: number; night?: boolean; ry?: number }> = ({ p, w = 1.4, h = 1.6, night, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Solid g={BOX} color="#E8E0CE" p={[0, 0, 0]} s={[w + 0.2, h + 0.2, 0.08]} />
    <Solid g={BOX} color={night ? "#22346A" : "#CFE6F7"} emissive={night ? "#1C2C5C" : "#BFDCF2"} p={[0, 0, 0.05]} s={[w, h, 0.02]} ink="none" shadow={false} />
    <Solid g={BOX} color="#E8E0CE" p={[0, 0, 0.07]} s={[0.07, h, 0.04]} />
    <Solid g={BOX} color="#E8E0CE" p={[0, 0, 0.07]} s={[w, 0.07, 0.04]} />
    <Solid g={BOX} color="#D8CEB8" p={[0, -h / 2 - 0.1, 0.12]} s={[w + 0.3, 0.08, 0.22]} />
    {night ? <Solid g={ball(0.12)} color="#FFF6D8" emissive="#FFF2C8" p={[w * 0.28, h * 0.28, 0.06]} s={[1, 1, 0.2]} ink="none" shadow={false} /> : null}
  </group>
);

/** A hanging lamp: cord, enamel shade, a glowing bulb, and a warm point light. */
export const Lamp: React.FC<{ p: V3; on?: number; color?: string }> = ({ p, on = 1, color = "#2F4A3A" }) => (
  <group position={p}>
    <Solid g={cyl(0.01, 0.01, 0.8)} color="#222" p={[0, 0, 0]} ink="none" />
    <Solid g={cyl(0.08, 0.32, 0.22, 20)} color={color} p={[0, -0.22, 0]} r={[Math.PI, 0, 0]} ink="hull" />
    <Solid g={ball(0.09)} color="#FFF4D0" emissive="#FFE8A8" p={[0, -0.25, 0]} ink="none" shadow={false} />
    <pointLight position={[0, -0.4, 0]} color="#FFD9A0" intensity={on * 6} distance={9} decay={1.4} />
  </group>
);

/** Two-high army bunk with a grey blanket. */
export const Bunk: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    {[-0.95, 0.95].map((x) => [-0.42, 0.42].map((z) => <Solid key={`${x}${z}`} g={BOX0} color="#4E5A44" p={[x, 0, z]} s={[0.07, 1.7, 0.07]} />))}
    {[0.45, 1.3].map((y) => (
      <group key={y}>
        <Solid g={BOX} color="#4E5A44" p={[0, y, 0]} s={[2, 0.08, 0.9]} />
        <Solid g={BOX} color="#7A7E78" p={[0, y + 0.1, 0]} s={[1.85, 0.12, 0.82]} />
        <Solid g={BOX} color="#EDE6D6" p={[-0.72, y + 0.2, 0]} s={[0.36, 0.1, 0.62]} />
      </group>
    ))}
  </group>
);

/** A steel locker. */
export const Locker: React.FC<{ p: V3; ry?: number; color?: string }> = ({ p, ry = 0, color = "#5E6A5A" }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Solid g={BOX0} color={color} s={[0.6, 1.9, 0.5]} />
    {[-0.12, 0.12].map((x) => <Solid key={x} g={BOX} color="#3A4238" p={[x, 1.6, 0.26]} s={[0.12, 0.05, 0.01]} ink="none" />)}
    <Solid g={BOX} color="#3A4238" p={[0.22, 1.0, 0.26]} s={[0.03, 0.16, 0.02]} ink="none" />
  </group>
);

/** A pinned map board on a wall. */
export const Board: React.FC<{ p: V3; w?: number; h?: number; ry?: number }> = ({ p, w = 1.6, h = 1.1, ry = 0 }) => {
  const map = useMemo(() => mapTex(), []);
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Solid g={BOX} color="#6A4A30" s={[w + 0.14, h + 0.14, 0.05]} />
      <Solid g={BOX} color="#FFFFFF" map={map} p={[0, 0, 0.03]} s={[w, h, 0.01]} ink="none" />
    </group>
  );
};
let mapT: THREE.Texture | null = null;
const mapTex = () => {
  if (mapT) return mapT;
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 352;
  const c = cv.getContext("2d")!;
  c.fillStyle = "#EFE4C6";
  c.fillRect(0, 0, 512, 352);
  c.fillStyle = "#A8C89A";
  c.beginPath();
  c.moveTo(60, 60);
  c.bezierCurveTo(200, 30, 260, 140, 220, 220);
  c.bezierCurveTo(200, 300, 330, 320, 420, 280);
  c.lineTo(470, 330);
  c.lineTo(40, 330);
  c.closePath();
  c.fill();
  c.strokeStyle = "#B23A36";
  c.lineWidth = 6;
  c.beginPath();
  c.moveTo(120, 280);
  c.lineTo(300, 150);
  c.stroke();
  c.fillStyle = "#B23A36";
  for (const [x, y] of [[40, 40], [470, 40], [40, 310], [470, 310]]) {
    c.beginPath();
    c.arc(x, y, 9, 0, 7);
    c.fill();
  }
  mapT = new THREE.CanvasTexture(cv);
  mapT.colorSpace = THREE.SRGBColorSpace;
  return mapT;
};

/** Rifle rack against a wall: three rifles standing (the guns he would not carry). */
export const RifleRack: React.FC<{ p: V3; ry?: number; n?: number }> = ({ p, ry = 0, n = 3 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Solid g={BOX} color="#5A3E2A" p={[0, 0.12, 0]} s={[0.25 * n + 0.2, 0.12, 0.3]} />
    <Solid g={BOX} color="#5A3E2A" p={[0, 1.0, -0.1]} s={[0.25 * n + 0.2, 0.08, 0.1]} />
    {Array.from({ length: n }, (_, i) => (
      <group key={i} position={[(i - (n - 1) / 2) * 0.25, 0.18, 0]} rotation={[-0.12, 0, 0]}>
        <Solid g={BOX0} color="#9A6A3E" s={[0.07, 0.42, 0.1]} />
        <Solid g={BOX0} color="#2E2E2E" p={[0, 0.42, 0]} s={[0.04, 0.7, 0.04]} />
      </group>
    ))}
  </group>
);

/** Desk with a blotter, papers, a phone. */
export const Desk: React.FC<{ p: V3; ry?: number; w?: number }> = ({ p, ry = 0, w = 1.8 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Solid g={BOX} color="#6E4A30" map={TEX.planks([1, 1])} p={[0, 0.76, 0]} s={[w, 0.06, 0.85]} />
    <Solid g={BOX0} color="#5E3E28" p={[-w / 2 + 0.25, 0, 0]} s={[0.46, 0.73, 0.8]} />
    <Solid g={BOX0} color="#5E3E28" p={[w / 2 - 0.25, 0, 0]} s={[0.46, 0.73, 0.8]} />
    {[0.2, 0.45].map((y) => <Solid key={y} g={BOX} color="#4A3020" p={[-w / 2 + 0.25, y, 0.41]} s={[0.36, 0.02, 0.01]} ink="none" />)}
    <Solid g={BOX} color="#3E5A46" p={[0, 0.8, 0.05]} s={[0.8, 0.01, 0.5]} ink="none" />
    <Solid g={BOX} color="#2A2A2E" p={[w / 2 - 0.35, 0.83, -0.15]} s={[0.22, 0.08, 0.16]} />
  </group>
);
export const Chair: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Solid g={BOX} color="#6E4A30" p={[0, 0.46, 0]} s={[0.46, 0.05, 0.44]} />
    {[-0.2, 0.2].map((x) => [-0.19, 0.19].map((z) => <Solid key={`${x}${z}`} g={BOX0} color="#5E3E28" p={[x, 0, z]} s={[0.04, 0.46, 0.04]} />))}
    <Solid g={BOX} color="#6E4A30" p={[0, 0.82, -0.2]} s={[0.46, 0.5, 0.04]} />
  </group>
);
export const Cabinet: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Solid g={BOX0} color="#6A6E66" s={[0.55, 1.35, 0.6]} />
    {[0.25, 0.68, 1.1].map((y) => <Solid key={y} g={BOX} color="#4A4E48" p={[0, y, 0.31]} s={[0.16, 0.04, 0.02]} ink="none" />)}
  </group>
);
/** A US flag on a staff: a canvas-textured cloth with a fixed wave. */
export const FlagStaff: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => {
  const { g, map } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1.5, 0.9, 24, 4);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin((pos.getX(i) + 0.75) * 4) * 0.06 * (pos.getX(i) + 0.75));
    geo.computeVertexNormals();
    const cv = document.createElement("canvas");
    cv.width = 380;
    cv.height = 200;
    const c = cv.getContext("2d")!;
    for (let i = 0; i < 13; i++) {
      c.fillStyle = i % 2 ? "#F4F1E8" : "#B23A36";
      c.fillRect(0, (i * 200) / 13, 380, 200 / 13 + 1);
    }
    c.fillStyle = "#2F4A86";
    c.fillRect(0, 0, 152, 108);
    c.fillStyle = "#F4F1E8";
    for (let i = 0; i < 30; i++) {
      c.beginPath();
      c.arc(12 + (i % 6) * 25, 12 + Math.floor(i / 6) * 21, 3.5, 0, 7);
      c.fill();
    }
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    return { g: geo, map: t };
  }, []);
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Solid g={cyl(0.025, 0.025, 2.6)} color="#C9A64A" ink="hull" />
      <Solid g={ball(0.06)} color="#D9B45A" p={[0, 2.62, 0]} ink="hull" />
      <Solid g={g} color="#FFFFFF" map={map} p={[0.78, 2.1, 0]} ink="none" />
    </group>
  );
};
/** A heavy curtain: a pleated slab. */
export const Curtain: React.FC<{ p: V3; h?: number; color?: string; ry?: number }> = ({ p, h = 3, color = "#8A2E36", ry = 0 }) => {
  const g = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.9, h, 0.12, 18, 1, 1).translate(0, h / 2, 0);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) + Math.sin(pos.getX(i) * 22) * 0.05);
    geo.computeVertexNormals();
    return geo;
  }, [h]);
  return <Solid g={g} color={color} p={p} r={[0, ry, 0]} ink="none" />;
};
export const Pilaster: React.FC<{ p: V3; h?: number; color?: string }> = ({ p, h = 3.3, color = "#EDE3CC" }) => (
  <group position={p}>
    <Solid g={BOX0} color={color} s={[0.45, h, 0.2]} />
    <Solid g={BOX} color={color} p={[0, h - 0.12, 0.04]} s={[0.6, 0.18, 0.28]} />
    <Solid g={BOX} color={color} p={[0, 0.1, 0.04]} s={[0.6, 0.2, 0.28]} />
  </group>
);
/** A small bedside table with a lamp (lit at night). */
export const BedLamp: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <Solid g={BOX0} color="#6E4A30" s={[0.5, 0.62, 0.45]} />
    <Solid g={cyl(0.09, 0.12, 0.08)} color="#3A3A3A" p={[0, 0.62, 0]} ink="hull" />
    <Solid g={cyl(0.015, 0.015, 0.3)} color="#3A3A3A" p={[0, 0.66, 0]} ink="none" />
    <Solid g={cyl(0.1, 0.2, 0.22, 20)} color="#E8C27A" emissive="#B08038" p={[0, 0.9, 0]} ink="hull" />
    <pointLight position={[0, 1.0, 0.1]} color="#FFC878" intensity={5} distance={6} decay={1.5} />
  </group>
);
export const Bed: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <Solid g={BOX0} color="#6E4A30" s={[2, 0.42, 1]} />
    <Solid g={BOX} color="#8A9AA6" p={[0, 0.5, 0]} s={[1.9, 0.16, 0.95]} />
    <Solid g={BOX} color="#EDE6D6" p={[-0.7, 0.62, 0]} s={[0.4, 0.12, 0.7]} />
    <Solid g={BOX0} color="#5E3E28" p={[-1.02, 0, 0]} s={[0.08, 0.95, 1]} />
  </group>
);

// ---------------- outdoor ----------------
/** A ground plane with gentle seeded humps; `tex` dots colour (r,g,b) */
export const Ground: React.FC<{ color: string; dots?: string; size?: number; seed?: number; hump?: number; rep?: number }> = ({ color, dots = "40,30,20", size = 240, seed = 1, hump = 0.25, rep = 30 }) => {
  const g = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, 120, 120).rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const R = rng(seed);
    const waves = Array.from({ length: 5 }, () => [R() * 0.3 + 0.05, R() * 0.3 + 0.05, R() * 6]);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let y = 0;
      for (const [a, b, ph] of waves) y += Math.sin(x * a + ph) * Math.cos(z * b + ph) * hump;
      // flat where people stand (|x| < 6, -8 < z < 6)
      const far = Math.min(1, Math.max(0, (Math.hypot(x / 7, (z + 1) / 8) - 1) / 2));
      pos.setY(i, y * far);
    }
    geo.computeVertexNormals();
    return geo;
  }, [size, seed, hump]);
  return <Solid g={g} color={color} map={TEX.ground(dots, [rep, rep], dots)} ink="none" />;
};
/** A ridge of hills far away: a row of flattened inked spheres. */
export const Hills: React.FC<{ z: number; color: string; seed?: number; n?: number; y?: number; w?: number; hgt?: number }> = ({ z, color, seed = 2, n = 7, y = -2, w = 160, hgt = 14 }) => {
  const R = rng(seed);
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + (i + R() * 0.6) * (w / n);
        const r = 16 + R() * 14;
        return <Solid key={i} g={ball(1, 28)} color={color} p={[x, y, z - R() * 10]} s={[r, hgt * (0.7 + R() * 0.6), r * 0.8]} ink="hull" shadow={false} />;
      })}
    </group>
  );
};
/** A palm: a leaning, curved trunk of rings and a crown of long drooping leaves. */
export const Palm: React.FC<{ p: V3; h?: number; lean?: number; seed?: number }> = ({ p, h = 7, lean = 0.25, seed = 1 }) => {
  const R = rng(seed);
  const segs = 8;
  const pts = Array.from({ length: segs + 1 }, (_, i) => {
    const k = i / segs;
    return [Math.sin(k * 1.4) * lean * h * 0.5, k * h, 0] as V3;
  });
  const top = pts[segs];
  return (
    <group position={p} rotation={[0, R() * 6, 0]}>
      {pts.slice(0, -1).map((a, i) => {
        const b = pts[i + 1];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const ang = Math.atan2(b[0] - a[0], b[1] - a[1]);
        return <Solid key={i} g={cyl(0.16 - i * 0.008, 0.18 - i * 0.008, len * 1.05, 10)} color={i % 2 ? "#8A6A48" : "#7A5A3E"} p={a} r={[0, 0, -ang]} ink="hull" />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2 + R();
        return (
          <group key={i} position={top} rotation={[0, a, 0]}>
            <Solid g={ball(1, 14)} color={i % 2 ? "#4E8A3A" : "#3F7A32"} p={[1.3, -0.35, 0]} r={[0, 0, -0.45]} s={[1.6, 0.12, 0.42]} ink="hull" />
          </group>
        );
      })}
      <Solid g={ball(0.35, 12)} color="#5A4A2E" p={top} ink="hull" />
    </group>
  );
};
/** Round bush: a cluster of inked balls. */
export const Bush: React.FC<{ p: V3; s?: number; color?: string; seed?: number }> = ({ p, s = 1, color = "#4E8A3A", seed = 3 }) => {
  const R = rng(seed);
  return (
    <group position={p} scale={s}>
      {Array.from({ length: 5 }, (_, i) => (
        <Solid key={i} g={ball(0.6, 14)} color={i % 2 ? color : new THREE.Color(color).multiplyScalar(0.85).getStyle()} p={[R() * 1.2 - 0.6, 0.4 + R() * 0.4, R() * 0.8 - 0.4]} s={0.7 + R() * 0.5} ink="hull" />
      ))}
    </group>
  );
};
export const Stone: React.FC<{ p: V3; s?: number | V3; color?: string; seed?: number; ry?: number }> = ({ p, s = 1, color = "#8A8070", seed = 1, ry = 0 }) => (
  <Solid g={rock(seed)} color={color} p={p} s={s} r={[0, ry, 0]} ink="hull" />
);
/** A dead tree: trunk and two bare branches. */
export const DeadTree: React.FC<{ p: V3; h?: number; seed?: number }> = ({ p, h = 3.2, seed = 1 }) => {
  const R = rng(seed);
  return (
    <group position={p} rotation={[0, R() * 6, 0]}>
      <Solid g={cyl(0.08, 0.16, h, 8)} color="#3A2E28" ink="hull" />
      {[0.55, 0.75].map((k, i) => (
        <Solid key={i} g={cyl(0.03, 0.07, h * 0.4, 6)} color="#3A2E28" p={[0, h * k, 0]} r={[0, 0, (i ? -1 : 1) * (0.6 + R() * 0.3)]} ink="hull" />
      ))}
    </group>
  );
};
/** A shell crater: a dark sunken disc with a raised rim. */
export const Crater: React.FC<{ p: V3; r?: number }> = ({ p, r = 1.2 }) => (
  <group position={p}>
    <Solid g={geoTorus} color="#4A3A2E" s={[r, r * 0.5, r]} r={[Math.PI / 2, 0, 0]} ink="none" />
    <Solid g={cyl(1, 1, 0.02, 24)} color="#2A2018" s={[r * 0.9, 1, r * 0.9]} p={[0, 0.01, 0]} ink="none" shadow={false} />
  </group>
);
const geoTorus = new THREE.TorusGeometry(1, 0.22, 8, 24);
const smokeCache = new Map<string, THREE.Material>();
const smokeMat = (color: string, o: number) => {
  const key = color + Math.round(o * 20);
  let m = smokeCache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: Math.round(o * 20) / 20, depthWrite: false });
    smokeCache.set(key, m);
  }
  return m;
};
/** Smoke: soft grey balls rising and growing with t (frames), seeded per column. */
export const Smoke: React.FC<{ p: V3; t: number; seed?: number; color?: string; s?: number }> = ({ p, t, seed = 1, color = "#8A8890", s = 1 }) => {
  const R = rng(seed);
  return (
    <group position={p} scale={s}>
      {Array.from({ length: 6 }, (_, i) => {
        const k = ((t / 90 + i / 6 + R() * 0.1) % 1 + 1) % 1;
        // soft and see-through, thinning as it rises (opaque grey balls read as boulders)
        return <mesh key={i} geometry={ball(1, 14)} material={smokeMat(color, 0.5 * (1 - k))} position={[Math.sin(i * 2 + t / 40) * 0.6 + k * 1.5, k * 6, 0]} scale={0.6 + k * 1.6} />;
      })}
    </group>
  );
};

/** The escarpment face (Hacksaw Ridge): a tall slab of strata rock, its top lip uneven, seen from the foot or the top. */
export const Cliff: React.FC<{ p?: V3; w?: number; h?: number; seed?: number }> = ({ p = [0, 0, 0], w = 40, h = 28, seed = 7 }) => {
  const g = useMemo(() => {
    const geo = new THREE.BoxGeometry(w, h, 4, 60, 40, 1).translate(0, h / 2, -2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const R = rng(seed);
    const ph = [R() * 6, R() * 6, R() * 6];
    for (let i = 0; i < pos.count; i++) {
      if (pos.getZ(i) < -0.1) continue;
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.7 + ph[0]) * 0.35 + Math.sin(y * 1.3 + ph[1]) * 0.3 + Math.sin((x + y) * 2.1 + ph[2]) * 0.15);
      if (y > h - 0.1) pos.setY(i, h + Math.sin(x * 0.5 + ph[1]) * 0.6);
    }
    geo.computeVertexNormals();
    return geo;
  }, [w, h, seed]);
  return <Solid g={g} color="#B89A70" map={TEX.rockFace([3, 2])} p={p} ink="none" />;
};
/** A cargo net hanging on the cliff face: rope grid of thin cylinders. */
export const Net: React.FC<{ p: V3; w?: number; h?: number }> = ({ p, w = 3, h = 24 }) => {
  const cols = 6;
  const rows = Math.floor(h / 1.2);
  return (
    <group position={p}>
      {Array.from({ length: cols + 1 }, (_, i) => (
        <Solid key={`v${i}`} g={cyl(0.03, 0.03, h, 5)} color="#D8C49A" p={[-w / 2 + (i * w) / cols, 0, 0.1]} ink="none" shadow={false} />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <Solid key={`h${i}`} g={cyl(0.025, 0.025, w, 5)} color="#D8C49A" p={[-w / 2, 0.6 + i * 1.2, 0.12]} r={[0, 0, -Math.PI / 2]} ink="none" shadow={false} />
      ))}
    </group>
  );
};
/** Aid tent with a red cross. */
export const Tent: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => {
  const g = useMemo(() => {
    const shape = new THREE.Shape([new THREE.Vector2(-1.4, 0), new THREE.Vector2(0, 1.8), new THREE.Vector2(1.4, 0)]);
    return new THREE.ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false }).translate(0, 0, -1.5);
  }, []);
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Solid g={g} color="#6E6A44" />
      <Solid g={cyl(0.32, 0.32, 0.01, 24)} color="#F4F1E8" p={[0, 0.8, 1.51]} r={[Math.PI / 2, 0, 0]} ink="none" shadow={false} />
      <Solid g={BOX} color="#C7302C" p={[0, 0.8, 1.53]} s={[0.12, 0.42, 0.01]} ink="none" shadow={false} />
      <Solid g={BOX} color="#C7302C" p={[0, 0.8, 1.53]} s={[0.42, 0.12, 0.01]} ink="none" shadow={false} />
    </group>
  );
};
/** Moon: a glowing disc high in the night sky. */
export const Moon: React.FC<{ p: V3 }> = ({ p }) => <Solid g={ball(3, 24)} color="#FFF6D8" emissive="#FFF0C0" p={p} ink="none" shadow={false} />;
/** A thin plane (paper, cloth) */
export const Sheet: React.FC<{ p: V3; s: [number, number]; color: string; r?: V3 }> = ({ p, s, color, r = [-Math.PI / 2, 0, 0] }) => (
  <mesh geometry={PLANE} material={toon(color)} position={p} rotation={r} scale={[s[0], s[1], 1]} receiveShadow />
);
