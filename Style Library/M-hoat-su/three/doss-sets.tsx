/**
 * The m-doss places in 3D (2026-11-04). Each set is a world centred on the acting area: people stand around x −3…3,
 * z −2…2 (outdoors) or on the room floor (indoors, back wall at z = −7).
 */
import React from "react";
import { BOX, BOX0, ball, cyl, rng, Solid, TEX, type V3 } from "./kit3d";
import {
  Bed, BedLamp, Board, Bunk, Bush, Cabinet, Chair, Cliff, Crater, Curtain, DeadTree, Desk, FlagStaff, Ground, Hills, Lamp, Locker, Moon, Net,
  Palm, Pilaster, RifleRack, Room, Smoke, Stone, Tent, Win,
} from "./sets3d";

/** small grass / weed tufts scattered on the ground (inked cones), away from the acting area */
export const Tufts: React.FC<{ seed?: number; n?: number; color?: string; area?: [number, number, number, number] }> = ({ seed = 1, n = 70, color = "#5E8A3A", area = [-14, 14, -30, 6] }) => {
  const R = rng(seed);
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const x = area[0] + R() * (area[1] - area[0]);
        const z = area[2] + R() * (area[3] - area[2]);
        if (Math.abs(x) < 2.4 && z > -2.5 && z < 2.5) return null;
        const s = 0.5 + R() * 0.7;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, R() * 6, 0]} scale={s}>
            {[-0.12, 0, 0.12].map((dx, j) => (
              <Solid key={j} g={cyl(0, 0.05, 0.35 + j * 0.08, 5)} color={color} p={[dx, 0, 0]} r={[0, 0, dx * 2]} ink="hull" shadow={false} />
            ))}
          </group>
        );
      })}
    </group>
  );
};

// ---------------- indoor ----------------
/** The barracks / HQ (green): bunks, lockers, the rifle rack on the back wall, a map board, a lamp. */
export const HQ: React.FC = () => (
  <Room wall="#5E7A62" trim="#3E3430" floor="#9A6E48">
    <Win p={[-2.4, 1.95, -6.95]} />
    <Board p={[2.2, 1.8, -6.95]} />
    <RifleRack p={[-0.1, 0, -6.65]} n={5} />
    <Lamp p={[0, 3.6, -2]} />
    <Solid g={BOX} color="#3E3430" p={[0, 3.0, -6.92]} s={[6, 0.06, 0.25]} />
    {[-2.4, -1.6, -0.8, 0.8, 1.6].map((x, i) => <Solid key={x} g={BOX0} color={i % 2 ? "#6A5A3E" : "#4E5A44"} p={[x, 3.03, -6.85]} s={[0.6, 0.35, 0.3]} />)}
    <Bunk p={[-3.9, 0, -3.4]} ry={Math.PI / 2} />
    <Bunk p={[-3.9, 0, -0.6]} ry={Math.PI / 2} />
    {[-4.6, -3.95, -3.3, -2.65].map((z) => <Locker key={z} p={[4.15, 0, z]} ry={-Math.PI / 2} />)}
    <Solid g={BOX0} color="#6E4A30" p={[3.2, 0, -6.5]} s={[1.2, 0.9, 0.6]} />
    <Solid g={BOX0} color="#4E5A44" p={[3.2, 0.9, -6.5]} s={[0.4, 0.3, 0.3]} />
  </Room>
);
/** The draft board office, 1942 (warm): desk across the room, filing cabinets, window, flag. */
export const DraftOffice: React.FC = () => (
  <Room wall="#B07A5E" trim="#5A3A2E" floor="#8A5E3E">
    <Win p={[-2.2, 1.95, -6.95]} />
    <Win p={[1.2, 1.95, -6.95]} />
    <Cabinet p={[3.4, 0, -6.4]} />
    <Cabinet p={[2.8, 0, -6.4]} />
    <FlagStaff p={[-3.8, 0, -6.2]} />
    <Lamp p={[0.6, 3.6, -2.6]} color="#3A3A3A" />
    <Solid g={BOX} color="#EDE3CC" p={[2.2, 2.4, -6.9]} s={[0.9, 0.6, 0.02]} ink="edges" />
  </Room>
);
/** His lodging at night: a bed, a bedside lamp, a night window. */
export const Lodging: React.FC = () => (
  <Room wall="#4E6A56" trim="#3A2E2A" floor="#7A5238" w={7} d={6}>
    <Win p={[1.2, 1.8, -5.95]} night />
    <Bed p={[-1.6, 0, -4.9]} />
    <BedLamp p={[0.3, 0, -5.4]} />
    <Solid g={BOX} color="#8A3A3A" p={[-0.4, 0.01, -2]} s={[2.6, 0.02, 1.6]} ink="none" />
  </Room>
);
/** A grey army office (the Bronze Stars). */
export const GreyOffice: React.FC = () => (
  <Room wall="#6A747C" trim="#3A3E44" floor="#7A6A58">
    <Win p={[-2.2, 1.95, -6.95]} />
    <Board p={[1.8, 1.8, -6.95]} w={1.3} h={0.9} />
    <FlagStaff p={[3.3, 0, -6.3]} />
    <Desk p={[0, 0, -5.2]} />
    <Chair p={[0, 0, -6]} />
    <Lamp p={[0, 3.6, -2.2]} color="#3A3A3A" />
  </Room>
);
/** The White House ceremony (warm): pilasters, red curtains, flags. */
export const Bureau: React.FC = () => (
  <Room wall="#E8D8B8" trim="#B8A07A" floor="#8A5A3A">
    {[-3.2, -1.2, 1.2, 3.2].map((x) => <Pilaster key={x} p={[x, 0, -6.85]} />)}
    <Curtain p={[-2.2, 0, -6.7]} />
    <Curtain p={[2.2, 0, -6.7]} />
    <Win p={[-2.2, 1.95, -6.95]} h={2.2} />
    <Win p={[2.2, 1.95, -6.95]} h={2.2} />
    <FlagStaff p={[-0.5, 0, -6.2]} />
    <Solid g={BOX} color="#8A2E36" p={[0, 0.012, -2]} s={[3.4, 0.02, 7]} ink="none" />
    <group position={[0, 3.8, -3]}>
      <Solid g={cyl(0.01, 0.01, 0.4)} color="#222" ink="none" />
      <Solid g={ball(0.35, 16)} color="#E8C878" emissive="#B89040" s={[1, 0.5, 1]} ink="hull" />
      <pointLight position={[0, -0.3, 0]} color="#FFD8A0" intensity={6} distance={10} decay={1.3} />
    </group>
  </Room>
);

// ---------------- outdoor ----------------
/** Guam, 1944: sandy clearing, palms, bushes, far green hills, smoke columns. */
export const Jungle: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Ground color="#C8A868" dots="90,60,20" seed={3} />
    <Hills z={-110} color="#4E8A4A" seed={3} />
    <Hills z={-70} color="#5E9A4A" seed={4} n={6} hgt={9} />
    {[[-4.5, -6, 8, 0.3], [5.2, -9, 9, -0.3], [-9, -16, 8.5, 0.2], [9, -20, 10, -0.2], [-2, -26, 9, 0.1], [14, -12, 8, -0.25], [-14, -10, 9, 0.3]].map(([x, z, h, l], i) => (
      <Palm key={i} p={[x, 0, z]} h={h} lean={l} seed={i + 2} />
    ))}
    {[[3.2, -3], [-3.4, -2], [6, -5], [-6.5, -4], [1, -9]].map(([x, z], i) => <Bush key={i} p={[x, 0, z]} s={0.8 + (i % 3) * 0.2} seed={i + 5} color={i % 2 ? "#4E8A3A" : "#5E9A44"} />)}
    {[[2.6, -1.8], [-3, -2.4], [4.5, -3]].map(([x, z], i) => <Stone key={i} p={[x, 0, z]} s={0.4 + i * 0.12} seed={i + 2} color="#9A8A70" />)}
    <Tufts seed={4} color="#6E9A40" />
    <Smoke p={[8, 0, -30]} t={t} seed={1} s={1.6} />
    <Smoke p={[-12, 0, -40]} t={t + 30} seed={2} s={2} />
  </group>
);
/** Hacksaw Ridge from the foot (day): the escarpment wall with two cargo nets. */
export const CliffFoot: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Ground color="#A89070" dots="60,40,30" seed={5} hump={0.15} />
    <Cliff p={[0, 0, -4]} w={60} h={28} />
    <Net p={[-2.2, 0, -3.9]} />
    <Net p={[2.4, 0, -3.9]} />
    {[[-7, 1], [6.5, 0.5], [-4, 3], [9, 3]].map(([x, z], i) => <Stone key={i} p={[x, 0, z]} s={0.6 + i * 0.15} seed={i + 9} color="#8A7A62" />)}
    <Tufts seed={6} color="#7A8A50" n={40} area={[-14, 14, -3, 8]} />
    <Smoke p={[6, 28, -6]} t={t} seed={3} s={1.2} />
  </group>
);
/** The top of the ridge at dusk: broken ground, rocks for cover, craters, smoke, the far rock line where the fire comes from. */
export const RidgeTop: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Ground color="#9A8468" dots="50,30,30" seed={7} hump={0.5} />
    <Hills z={-60} color="#6E5A5A" seed={8} hgt={6} y={-1} />
    {[[-6, -14, 3], [-1, -16, 4], [5, -15, 3.5], [10, -13, 3]].map(([x, z, s], i) => <Stone key={i} p={[x, 0, z]} s={[s, s * 0.7, s]} seed={i + 20} color="#7E6E62" />)}
    {[[-3.5, 1.5], [3.4, 1.2], [0.2, -6], [-6, -4]].map(([x, z], i) => <Crater key={i} p={[x, 0, z]} r={1 + (i % 2) * 0.4} />)}
    {[[-2.2, 2.6, 1.1], [2.2, 2.8, 0.9], [-5, 0, 1.3], [5.5, -1, 1.2]].map(([x, z, s], i) => <Stone key={`c${i}`} p={[x, 0, z]} s={s} seed={i + 30} color="#8A7A6A" />)}
    {[[-8, -8], [7, -9]].map(([x, z], i) => <DeadTree key={i} p={[x, 0, z]} seed={i + 3} />)}
    <Tufts seed={8} color="#7A7A48" n={36} />
    <Smoke p={[2, 0, -18]} t={t} seed={5} s={1.4} color="#6A6670" />
    <Smoke p={[-9, 0, -22]} t={t + 40} seed={6} s={1.8} color="#6A6670" />
  </group>
);
/** The lip of the escarpment seen from the side (golden): the plateau on the right at y = H, the drop on the left. */
export const CliffLip: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Ground color="#8A7458" dots="50,30,20" seed={9} hump={0.1} />
    <group rotation={[0, -Math.PI / 2, 0]}>
      <Cliff p={[0, 0, 0]} w={60} h={18} seed={11} />
    </group>
    {/* the plateau on top, to the right of the edge */}
    <Solid g={BOX} color="#9A8468" map={TEX.ground("50,30,20", [6, 6], "50,30,20")} p={[3, 17.9, 0]} s={[6.2, 0.4, 60]} ink="none" />
    {[[3.5, -2], [5, 3], [2.4, 4]].map(([x, z], i) => <Stone key={i} p={[x, 18.1, z]} s={0.5 + i * 0.2} seed={i + 40} color="#8A7A6A" />)}
    <Smoke p={[10, 18, -20]} t={t} seed={7} s={1.4} color="#6A6670" />
  </group>
);
/** The night battlefield: mud, craters, dead trees, a moon, a far ridge. */
export const NightField: React.FC<{ t: number; tent?: V3 }> = ({ t, tent }) => (
  <group>
    <Ground color="#6A5A48" dots="20,15,10" seed={11} hump={0.35} />
    <Hills z={-70} color="#2A3048" seed={12} hgt={8} />
    <Moon p={[-30, 60, -150]} />
    {[[-3.6, 1.2], [3, -1.5], [-1, -6], [5.5, -6], [-6, -8]].map(([x, z], i) => <Crater key={i} p={[x, 0, z]} r={0.9 + (i % 3) * 0.3} />)}
    {[[-6, -10], [4, -14], [9, -6], [-11, -16]].map(([x, z], i) => <DeadTree key={i} p={[x, 0, z]} h={3 + i * 0.4} seed={i + 7} />)}
    {[[2.8, 2.6], [-4.4, -2.8], [6.5, 1]].map(([x, z], i) => <Stone key={i} p={[x, 0, z]} s={0.5 + i * 0.2} seed={i + 50} color="#5A5048" />)}
    {tent ? <Tent p={tent} ry={-0.5} /> : null}
    <Smoke p={[6, 0, -25]} t={t} seed={9} s={1.6} color="#4A4A58" />
  </group>
);
