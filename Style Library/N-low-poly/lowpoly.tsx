/**
 * Style N · Low-poly 3D (Lucas 2026-11-05): the whole picture is a three.js world, people included.
 * Faceted (flatShading) standard materials, no ink, warm key light + coloured fill, soft fog.
 * People are low-poly figures built from 6–8 sided limbs, an icosahedron head and a code-drawn face
 * (no photo textures: real people are recognised by hair, glasses, moustache and clothes).
 * Rules: every motion from useCurrentFrame (no useFrame), all randomness seeded (rng).
 */
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { CamSync, type Cam, makeCam, rng, type V3 } from "../M-hoat-su/three/kit3d";
import { CANVAS, CLAMP, FONT, SAFE, SUB_BOTTOM } from "../kit-common";
import type { SubSkin } from "../subs";
import { Post, type PostOpts } from "./post";

export { rng, makeCam, type Cam, type V3 };
export const W = 1080;
export const H = 1920;
export const D = Math.PI / 180;
export const easeIO = Easing.inOut(Easing.cubic);
export const N = {
  ink: "#141018",
  gold: "#F2C14E",
  red: "#D9483B",
  green: "#2E8B57",
  cream: "#F3E9D2",
  blue: "#3B6EA8",
};

// ---------------- materials + geometry (cached) ----------------
type MatOpt = { e?: string; ei?: number; map?: THREE.Texture | null; op?: number; metal?: number; rough?: number; smooth?: boolean };
const mats = new Map<string, THREE.Material>();
export const mat = (color: string, o: MatOpt = {}) => {
  const key = `${color}|${o.e ?? ""}|${o.ei ?? 1}|${o.map?.uuid ?? ""}|${o.op ?? 1}|${o.metal ?? 0}|${o.rough ?? 0.8}|${o.smooth ? 1 : 0}`;
  let m = mats.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color,
      flatShading: !o.smooth,
      roughness: o.rough ?? 0.8,
      metalness: o.metal ?? 0,
      emissive: o.e ?? "#000000",
      emissiveIntensity: o.e ? (o.ei ?? 1) : 0,
      map: o.map ?? null,
      transparent: (o.op ?? 1) < 1,
      opacity: o.op ?? 1,
      depthWrite: (o.op ?? 1) >= 1,
    });
    mats.set(key, m);
  }
  return m;
};
const geos = new Map<string, THREE.BufferGeometry>();
const geo = (key: string, make: () => THREE.BufferGeometry) => {
  let g = geos.get(key);
  if (!g) {
    g = make();
    geos.set(key, g);
  }
  return g;
};
/** unit box, base at y = 0 */
export const BOX0 = geo("box0", () => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0));
/** unit box, centred */
export const BOX = geo("box", () => new THREE.BoxGeometry(1, 1, 1));
export const PLANE = geo("plane", () => new THREE.PlaneGeometry(1, 1));
/** cylinder from y = 0 up to h */
export const cyl = (rt: number, rb: number, h: number, n = 8) => geo(`c${rt}|${rb}|${h}|${n}`, () => new THREE.CylinderGeometry(rt, rb, h, n).translate(0, h / 2, 0));
/** limb hanging from its joint: y = 0 down to −h */
export const limb = (rt: number, rb: number, h: number, n = 6) => geo(`l${rt}|${rb}|${h}|${n}`, () => new THREE.CylinderGeometry(rt, rb, h, n).translate(0, -h / 2, 0));
export const ico = (r: number, d = 1) => geo(`i${r}|${d}`, () => new THREE.IcosahedronGeometry(r, d));
export const sph = (r: number, w = 10, h = 7) => geo(`s${r}|${w}|${h}`, () => new THREE.SphereGeometry(r, w, h));
export const dome = (r: number, w = 8, h = 4) => geo(`d${r}|${w}|${h}`, () => new THREE.SphereGeometry(r, w, h, 0, Math.PI * 2, 0, Math.PI / 2));
export const cone = (r: number, h: number, n = 6) => geo(`k${r}|${h}|${n}`, () => new THREE.ConeGeometry(r, h, n).translate(0, h / 2, 0));
export const torus = (r: number, t: number, n = 6) => geo(`t${r}|${t}|${n}`, () => new THREE.TorusGeometry(r, t, 4, n));
/** flat land plate from lon/lat points: x = east, z = south, base at y = 0, `h` thick */
export const plate = (key: string, pts: [number, number][], h = 0.25) =>
  geo(`p${key}|${h}`, () => {
    const s = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false });
    g.rotateX(-Math.PI / 2); // shape y (north) → −z
    return g;
  });

export type MeshProps = { g: THREE.BufferGeometry; c: string; p?: V3; r?: V3; s?: V3 | number; o?: MatOpt; shadow?: boolean; visible?: boolean };
/** one faceted part */
export const P: React.FC<MeshProps> = ({ g, c, p = [0, 0, 0], r = [0, 0, 0], s = 1, o, shadow = true, visible = true }) => (
  <mesh geometry={g} material={mat(c, o)} position={p} rotation={r} scale={typeof s === "number" ? [s, s, s] : s} castShadow={shadow} receiveShadow visible={visible} />
);
/** a box sitting on y = p[1]: size [w, h, d] */
export const Box: React.FC<{ w: number; h: number; d: number; c: string; p?: V3; r?: V3; o?: MatOpt; shadow?: boolean }> = ({ w, h, d, c, p = [0, 0, 0], r, o, shadow }) => <P g={BOX0} c={c} p={p} r={r} s={[w, h, d]} o={o} shadow={shadow} />;

// ---------------- canvas textures ----------------
const texs = new Map<string, THREE.CanvasTexture>();
/** a texture drawn once on a canvas (signs, labels, tiles) */
export const ctex = (key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D, R: () => number) => void, repeat: [number, number] = [1, 1]) => {
  let t = texs.get(key);
  if (!t) {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    let hash = 0;
    for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    draw(cv.getContext("2d")!, rng(hash));
    t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
    t.anisotropy = 8;
    texs.set(key, t);
  }
  return t;
};
/** in-world lettering (signs, boards): system bold sans so the canvas never waits for a web font */
export const SIGN_FONT = "Arial Black, Arial, sans-serif";
export const signTex = (text: string, bg: string, fg: string, w = 1024, h = 256, size = 150) =>
  ctex(`sign|${text}|${bg}|${fg}|${w}|${h}|${size}`, w, h, (c) => {
    c.fillStyle = bg;
    c.fillRect(0, 0, w, h);
    c.fillStyle = fg;
    c.font = `900 ${size}px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, w / 2, h / 2 + size * 0.04);
  });
/** a texture redrawn every frame (counters, clocks, screens) */
export const useLiveTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const { cv, t } = useMemo(() => {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return { cv, t };
  }, [w, h]);
  draw(cv.getContext("2d")!);
  t.needsUpdate = true;
  return t;
};
/** an unlit texture panel (screens, boards): MeshBasic so it reads at full brightness */
export const Panel: React.FC<{ map: THREE.Texture; w: number; h: number; p?: V3; r?: V3; glow?: number; alpha?: boolean }> = ({ map, w, h, p = [0, 0, 0], r = [0, 0, 0], glow = 1, alpha = false }) => {
  const m = useMemo(() => new THREE.MeshBasicMaterial({ map, toneMapped: false, color: new THREE.Color(glow, glow, glow), transparent: alpha, depthWrite: !alpha }), [map, glow, alpha]);
  return <mesh geometry={PLANE} material={m} position={p} rotation={r} scale={[w, h, 1]} />;
};

// ---------------- people ----------------
export type Look = {
  skin: string;
  hair: string;
  /** short · recede (high forehead) · bald · cap · long */
  hairStyle?: "short" | "recede" | "bald" | "cap" | "long";
  top: string;
  pants: string;
  shoes?: string;
  shirt?: string;
  tie?: string;
  glasses?: boolean;
  shades?: boolean;
  moustache?: boolean;
  capColor?: string;
  eye?: string;
  lip?: string;
  moustacheC?: string;
  /** shoulder width ×, height × */
  build?: number;
  tall?: number;
};
type Arm = { f?: number; o?: number; e?: number; tw?: number };
type Leg = { f?: number; k?: number };
export type Pose = {
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  armL?: Arm;
  armR?: Arm;
  legL?: Leg;
  legR?: Leg;
  yaw?: number;
  pitch?: number;
  roll?: number;
  lean?: number;
  mouth?: number;
  blink?: number;
  brow?: number;
  smile?: number;
  /** eyes: −1…1 left/right, up/down */
  lookX?: number;
  lookY?: number;
  /** 0 normal, 1 frowning / angry; brow (above) raises them */
  frown?: number;
  /** one brow on its own (his left / right), added to brow */
  browL?: number;
  browR?: number;
  /** cheeks push the eyes half shut (a real laugh) */
  squint?: number;
  /** one corner of the mouth up, on his left side */
  smirk?: number;
  /** tired lids: the upper lid low, no cheek push */
  heavy?: number;
  /** inner brows up (fear, pleading); frown is inner brows down */
  worry?: number;
  /** torso: side bend and turn, degrees, on top of lean */
  tilt?: number;
  twist?: number;
  /** both shoulders up, 0→1 */
  shrug?: number;
};
type PoseObj = Record<string, unknown>;
const mixPose = (a: PoseObj, b: PoseObj, k: number): PoseObj => {
  const out: PoseObj = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[key];
    const y = b[key];
    if ((x && typeof x === "object") || (y && typeof y === "object")) out[key] = mixPose((x ?? {}) as PoseObj, (y ?? {}) as PoseObj, k);
    else out[key] = ((x as number) ?? 0) + (((y as number) ?? 0) - ((x as number) ?? 0)) * k;
  }
  return out;
};
const EASE_ACT = Easing.bezier(0.33, 0, 0.2, 1.06); // a hair of overshoot: a limb arrives, then settles
const mixAt = (t: number, keys: [number, Pose][]): Pose => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) return mixPose(keys[i - 1][1] as PoseObj, keys[i][1] as PoseObj, EASE_ACT((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]))) as Pose;
  }
  return keys[keys.length - 1][1];
};
/**
 * Keyed acting: [[frame, pose], …], held before the first key and after the last. Overlap is built in, so nothing moves
 * as one block: the eyes lead by 3 frames, the head by 1, the body is on the key, upper arms trail by 2, forearms by 4.
 */
export const act = (t: number, keys: [number, Pose][]): Pose => {
  const out: Pose = { ...mixAt(t, keys) };
  const eyes = mixAt(t + 3, keys);
  const head = mixAt(t + 1, keys);
  const arm = mixAt(t - 2, keys);
  const fore = mixAt(t - 4, keys);
  if (eyes.lookX !== undefined) out.lookX = eyes.lookX;
  if (eyes.lookY !== undefined) out.lookY = eyes.lookY;
  if (head.yaw !== undefined) out.yaw = head.yaw;
  if (head.pitch !== undefined) out.pitch = head.pitch;
  if (head.roll !== undefined) out.roll = head.roll;
  if (arm.armL) out.armL = { ...arm.armL, ...(fore.armL?.e !== undefined ? { e: fore.armL.e } : {}) };
  if (arm.armR) out.armR = { ...arm.armR, ...(fore.armR?.e !== undefined ? { e: fore.armR.e } : {}) };
  return out;
};
/** walking cycle at phase (radians), stride in degrees */
export const walk = (ph: number, stride = 26): Partial<Pose> => {
  const s = Math.sin(ph);
  return {
    legL: { f: -s * stride, k: Math.max(0, Math.cos(ph)) * stride * 1.3 },
    legR: { f: s * stride, k: Math.max(0, -Math.cos(ph)) * stride * 1.3 },
    armL: { f: s * stride * 0.8, o: 6, e: -14 },
    armR: { f: -s * stride * 0.8, o: 6, e: -14 },
    y: Math.abs(Math.cos(ph)) * 0.03,
  };
};
/** seated on a chair of seat height ~0.46 (root y stays 0, the figure lowers itself) */
export const SIT: Partial<Pose> = { legL: { f: 88, k: 88 }, legR: { f: 88, k: 88 }, y: -0.44 };
/** idle life: breathing, blinks, small head moves */
export const alive = (f: number, seed: number): Partial<Pose> => {
  const R = rng(seed);
  const period = 70 + Math.floor(R() * 50);
  const ph = (f + Math.floor(R() * period)) % period;
  return { blink: ph < 4 ? 1 : 0, yaw: Math.sin(f / 37 + seed) * 4, pitch: Math.sin(f / 29 + seed * 2) * 2 };
};
/** mouth while speaking (frame-driven flap, 0 when silent) */
export const talk = (f: number, on: boolean) => (on ? Math.max(0, Math.sin(f * 0.9) * 0.6 + Math.sin(f * 2.3) * 0.4) : 0);

/** a raised arm takes the shoulder up with it */
const armUp = (a: Arm) => Math.max(0, (a.f ?? 0) - 100) * 0.0012;
/** where a hand ends up for a person at `at` (ry 0, no lean, build 1, standing): same joints as ArmRig, so a prop can meet the hand */
export const handAt = (side: 1 | -1, at: V3, a: Arm): V3 => {
  const v = new THREE.Vector3(0, -0.3, 0).applyEuler(new THREE.Euler((a.e ?? -8) * D, 0, 0));
  v.y -= 0.3;
  v.applyEuler(new THREE.Euler(-(a.f ?? 0) * D, (a.tw ?? 0) * D, (a.o ?? 4) * D * side));
  return [at[0] + 0.2 * side + v.x, at[1] + 1.43 + armUp(a) + v.y, at[2] + v.z];
};
const ArmRig: React.FC<{ side: 1 | -1; a: Arm; look: Look; up?: number; hold?: React.ReactNode }> = ({ side, a, look, up = 0, hold }) => (
  <group position={[0.2 * side * (look.build ?? 1), 1.43 + armUp(a) + up, 0]} rotation={[-(a.f ?? 0) * D, (a.tw ?? 0) * D, (a.o ?? 4) * D * side]}>
    <P g={limb(0.062, 0.052, 0.3)} c={look.top} />
    <group position={[0, -0.3, 0]} rotation={[(a.e ?? -8) * D, 0, 0]}>
      <P g={limb(0.052, 0.045, 0.26)} c={look.top} />
      <P g={BOX} c={look.skin} p={[0, -0.3, 0]} s={[0.075, 0.09, 0.04]} />
      <P g={BOX} c={look.skin} p={[-0.045 * side, -0.29, 0.012]} r={[0, 0, 0.5 * side]} s={[0.024, 0.06, 0.028]} />
      {hold ? <group position={[0, -0.3, 0.02]}>{hold}</group> : null}
    </group>
  </group>
);
const LegRig: React.FC<{ side: 1 | -1; l: Leg; look: Look }> = ({ side, l, look }) => (
  <group position={[0.095 * side, 0.9, 0]} rotation={[-(l.f ?? 0) * D, 0, 0]}>
    <P g={limb(0.08, 0.066, 0.45)} c={look.pants} />
    <group position={[0, -0.45, 0]} rotation={[(l.k ?? 0) * D, 0, 0]}>
      <P g={limb(0.064, 0.052, 0.41)} c={look.pants} />
      <Box w={0.11} h={0.07} d={0.24} c={look.shoes ?? "#2A2224"} p={[0, -0.45, 0.04]} />
    </group>
  </group>
);
/** the skull: a fine icosahedron shaped by hand (narrow jaw, brow ridge, flat back), facets still visible */
const SKULL = geo("skull", () => {
  const g = new THREE.IcosahedronGeometry(0.128, 2);
  const a = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < a.count; i++) {
    v.fromBufferAttribute(a, i);
    const low = Math.max(0, -v.y / 0.128);
    v.x *= 0.96 - low * 0.26;
    v.z *= 1.02 - low * 0.14;
    v.y *= 1.14;
    if (v.z > 0.05 && v.y > 0.02 && v.y < 0.07) v.z += 0.008; // brow ridge
    if (v.z < -0.06) v.z *= 0.9;
    a.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
});
/**
 * The mouth as curves, bent round the face: corners lift with smile (down when negative) and with smirk on his left,
 * the lower lip drops with `open`. Values are quantised so the geometries can be cached.
 */
const mouthGeo = (w: number, open: number, smile: number, smirk: number) => {
  const q = (v: number, st: number) => Math.round(v / st) * st;
  const W = q(w, 0.004);
  const O = q(open, 0.1);
  const S = q(smile, 0.1);
  const K = q(smirk, 0.1);
  const key = `m${W.toFixed(3)}|${O.toFixed(1)}|${S.toFixed(1)}|${K.toFixed(1)}`;
  const lift = (u: number) => S * 0.014 * u * u + K * 0.02 * Math.max(0, u) ** 2;
  const span = (u: number) => Math.max(0, 1 - u * u);
  const upper = (u: number) => lift(u) - 0.0004 * span(u);
  const lower = (u: number) => lift(u) - (O * 0.05 * span(u) ** 0.8 + 0.0016 * span(u));
  const poly = (id: string, top: (u: number) => number, bot: (u: number) => number) =>
    geo(key + id, () => {
      const us = Array.from({ length: 11 }, (_, i) => -1 + i / 5);
      const sh = new THREE.Shape([...us.map((u) => new THREE.Vector2((u * W) / 2, top(u))), ...[...us].reverse().map((u) => new THREE.Vector2((u * W) / 2, bot(u)))]);
      const g = new THREE.ShapeGeometry(sh);
      const a = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < a.count; i++) a.setZ(i, -((a.getX(i) / (W / 2)) ** 2) * 0.018);
      g.computeVertexNormals();
      return g;
    });
  return {
    lip: poly("l", (u) => upper(u) + 0.0034 * span(u) ** 0.6 + 0.0004, (u) => lower(u) - 0.0044 * span(u) ** 0.6 - 0.0004),
    dark: poly("d", upper, lower),
    teeth: O > 0.1 ? poly("t", upper, (u) => upper(u) - Math.min(0.013, 0.004 + O * 0.012) * span(u) ** 0.5) : null,
  };
};
const Head: React.FC<{ look: Look; pose: Pose }> = ({ look, pose }) => {
  const m = pose.mouth ?? 0;
  const bl = pose.blink ?? 0;
  const smile = pose.smile ?? 0;
  const raise = (sx: number) => ((pose.brow ?? 0) + (sx > 0 ? (pose.browL ?? 0) : (pose.browR ?? 0))) * 0.016;
  const squint = pose.squint ?? 0;
  const smirk = pose.smirk ?? 0;
  const mw = 0.056 + Math.max(0, smile) * 0.02 + m * 0.012 - Math.max(0, -smile) * 0.006;
  const worry = pose.worry ?? 0;
  const mouth = mouthGeo(mw, m, smile, smirk);
  const frown = pose.frown ?? 0;
  const lx = (pose.lookX ?? 0) * 0.011;
  const ly = (pose.lookY ?? 0) * 0.008;
  const hs = look.hairStyle ?? "short";
  const dark = "#17100F";
  const browC = look.hair === "#CFCAC2" ? "#8E8880" : look.hair;
  const lid = 0.12 + Math.max(bl, squint * 0.55, (pose.heavy ?? 0) * 0.5) * 0.88; // how far the upper lid is down
  return (
    <group position={[0, 1.5, 0]} rotation={[(pose.pitch ?? 0) * D, (pose.yaw ?? 0) * D, (pose.roll ?? 0) * D]}>
      <P g={cyl(0.054, 0.062, 0.08, 6)} c={look.skin} />
      {/* the N caricature: heads a little big, so a face reads on a phone */}
      <group position={[0, 0.175, 0]} scale={1.16}>
        <P g={SKULL} c={look.skin} />
        <P g={ico(0.03, 0)} c={look.skin} p={[0.112, 0, -0.005]} s={[0.55, 1.1, 0.9]} />
        <P g={ico(0.03, 0)} c={look.skin} p={[-0.112, 0, -0.005]} s={[0.55, 1.1, 0.9]} />
        <P g={ico(0.03, 0)} c={look.skin} p={[0, -0.012, 0.122]} s={[0.7, 1.12, 0.95]} />
        {[1, -1].map((sx) => (
          <group key={sx} position={[0.046 * sx, 0.02, 0.116]}>
            <P g={ico(0.024, 1)} c="#F4F1EA" s={[1.05, 0.92, 0.55]} shadow={false} o={{ rough: 0.35 }} />
            <P g={ico(0.0135, 1)} c={look.eye ?? "#3A2A1E"} p={[lx, ly, 0.0105]} s={[1, 1, 0.45]} shadow={false} />
            <P g={ico(0.0075, 1)} c={dark} p={[lx, ly, 0.0145]} s={[1, 1, 0.4]} shadow={false} />
            <P g={ico(0.0031, 0)} c="#FFFFFF" p={[lx + 0.0042, ly + 0.0048, 0.0186]} o={{ e: "#FFFFFF", ei: 1.1 }} shadow={false} />
            {/* upper lid + lid line: the expression lives here */}
            <P g={ico(0.03, 1)} c={look.skin} p={[0, 0.036 - lid * 0.042, 0.002]} r={[0, 0, (frown * 0.3 - worry * 0.22) * sx]} s={[1.05, 0.62, 0.62]} shadow={false} />
            {squint > 0 ? <P g={ico(0.03, 1)} c={look.skin} p={[0, -0.04 + squint * 0.018, 0]} s={[1.05, 0.6, 0.55]} shadow={false} /> : null}
            <P g={BOX} c={browC} p={[0, 0.038 + raise(sx) - frown * 0.006, 0.012]} r={[0, 0, (frown * 0.42 - worry * 0.5 - (pose.brow ?? 0) * 0.08) * sx]} s={[0.058, 0.0125, 0.016]} shadow={false} />
          </group>
        ))}
        {/* mouth: curves, not boxes */}
        <group position={[0, -0.066, 0.113]}>
          <mesh geometry={mouth.lip} material={mat(look.lip ?? "#94564C")} receiveShadow />
          <mesh geometry={mouth.dark} material={mat("#3A1214")} position={[0, 0, 0.0009]} />
          {mouth.teeth ? <mesh geometry={mouth.teeth} material={mat("#F2EDE2")} position={[0, 0, 0.0017]} /> : null}
        </group>
        {look.moustache
          ? [1, -1].map((sx) => <P key={sx} g={BOX} c={look.moustacheC ?? "#7E776E"} p={[0.024 * sx, -0.046 + smile * 0.003 + (sx > 0 ? smirk * 0.003 : 0), 0.116]} r={[0, 0.3 * sx, (-0.28 + smile * 0.1 + (sx > 0 ? smirk * 0.1 : 0)) * sx]} s={[0.052, 0.017, 0.018]} />)
          : null}
        {look.glasses ? (
          <>
            <P g={torus(0.031, 0.0042, 12)} c="#201A18" p={[0.046, 0.02, 0.134]} shadow={false} o={{ metal: 0.5, rough: 0.4 }} />
            <P g={torus(0.031, 0.0042, 12)} c="#201A18" p={[-0.046, 0.02, 0.134]} shadow={false} o={{ metal: 0.5, rough: 0.4 }} />
            <P g={BOX} c="#201A18" p={[0, 0.024, 0.136]} s={[0.03, 0.005, 0.005]} shadow={false} />
            {[1, -1].map((sx) => <P key={sx} g={BOX} c="#201A18" p={[0.08 * sx, 0.024, 0.08]} s={[0.005, 0.005, 0.11]} shadow={false} />)}
          </>
        ) : null}
        {look.shades ? (
          <>
            {[1, -1].map((sx) => (
              <group key={sx} position={[0.047 * sx, 0.02, 0.131]} rotation={[0, 0.16 * sx, 0]}>
                <P g={cyl(0.036, 0.036, 0.008, 14)} c="#0E0E14" r={[Math.PI / 2, 0, 0]} s={[1.02, 1, 0.82]} o={{ metal: 0.8, rough: 0.14 }} shadow={false} />
                <P g={BOX} c="#8E96A0" p={[-0.012, 0.014, 0.0048]} r={[0, 0, 0.6]} s={[0.022, 0.003, 0.001]} o={{ e: "#8E96A0", ei: 0.5 }} shadow={false} />
              </group>
            ))}
            <P g={BOX} c="#0E0E14" p={[0, 0.03, 0.134]} s={[0.03, 0.005, 0.005]} shadow={false} />
          </>
        ) : null}
        {hs === "short" || hs === "long" ? <P g={dome(0.134, 10, 5)} c={look.hair} p={[0, 0.03, -0.012]} r={[-0.22, 0, 0]} s={[0.98, 0.98, 1.06]} /> : null}
        {hs === "short" || hs === "long" ? <P g={dome(0.132, 10, 5)} c={look.hair} p={[0, 0.004, -0.012]} r={[-1.9, 0, 0]} s={[0.96, 1, 1.02]} /> : null}
        {hs === "long" ? <P g={BOX} c={look.hair} p={[0, -0.12, -0.06]} s={[0.25, 0.24, 0.11]} /> : null}
        {hs === "recede" ? <P g={dome(0.133, 10, 5)} c={look.hair} p={[0, 0.006, -0.01]} r={[-2.2, 0, 0]} s={[0.98, 1, 1.02]} /> : null}
        {hs === "recede"
          ? // a fringe of tufts round the back and sides, a bare crown
            Array.from({ length: 15 }, (_, i) => {
              const a = -0.25 + (i / 14) * (Math.PI + 0.5);
              if (Math.sin(a) > 0.55) return null;
              return <P key={i} g={ico(0.034, 0)} c={look.hair} p={[Math.cos(a) * 0.112, 0.03 + Math.sin(i * 2.3) * 0.01 + Math.sin(a) * 0.02, -Math.sin(a) * 0.1 - 0.012]} s={[0.8, 1, 0.8]} />;
            })
          : null}
        {hs === "cap" ? (
          <>
            <P g={dome(0.136, 10, 5)} c={look.capColor ?? N.blue} p={[0, 0.035, -0.005]} r={[-0.12, 0, 0]} />
            <Box w={0.19} h={0.016} d={0.13} c={look.capColor ?? N.blue} p={[0, 0.055, 0.125]} r={[-0.18, 0, 0]} />
          </>
        ) : null}
      </group>
    </group>
  );
};
/** A low-poly person, ~1.75 m, facing +z at ry = 0. `holdL` / `holdR` hang from the hands. */
export const Person: React.FC<{ look: Look; pose?: Pose; holdL?: React.ReactNode; holdR?: React.ReactNode; back?: string }> = ({ look, pose: given = {}, holdL, holdR, back }) => {
  const b = look.build ?? 1;
  const f = useCurrentFrame();
  // every person breathes, shifts weight, blinks and glances on their own clock, whatever the shot asks for
  let h = 0;
  for (const ch of look.top + look.skin + look.hair) h = (h * 31 + ch.charCodeAt(0)) % 9973;
  const breath = Math.sin(f / 24 + h);
  const sway = Math.sin(f / 67 + h * 1.7);
  const period = 83 + (h % 47);
  const glance = 41 + (h % 37);
  const n = Math.floor((f + h) / glance);
  const pose: Pose = {
    ...given,
    blink: given.blink ?? ((f + h) % period < 3 ? 1 : 0),
    lookX: (given.lookX ?? 0) + Math.sin(n * 12.99 + h) * 0.2,
    lookY: (given.lookY ?? 0) + Math.sin(n * 78.23 + h) * 0.1,
    pitch: (given.pitch ?? 0) + breath * 0.5,
  };
  const up = breath * 0.004 + (pose.shrug ?? 0) * 0.06;
  return (
    <group position={[pose.x ?? 0, pose.y ?? 0, pose.z ?? 0]} rotation={[0, (pose.ry ?? 0) * D, 0]} scale={look.tall ?? 1}>
      <LegRig side={1} l={pose.legL ?? {}} look={look} />
      <LegRig side={-1} l={pose.legR ?? {}} look={look} />
      <group position={[0, 0.88, 0]} rotation={[(pose.lean ?? 0) * D, (pose.twist ?? 0) * D, ((pose.tilt ?? 0) + sway * 0.8) * D]}>
        <group position={[0, -0.88, 0]}>
          <P g={cyl(0.17, 0.16, 0.14, 6)} c={look.pants} p={[0, 0.84, 0]} s={[b, 1, 0.75]} />
          <P g={cyl(0.24, 0.17, 0.58, 6)} c={look.top} p={[0, 0.9, 0]} s={[b, 1 + breath * 0.006, 0.62 + breath * 0.006]} />
          <P g={cyl(0.07, 0.16, 0.08, 6)} c={look.top} p={[0, 1.48 + up, 0]} s={[b, 1, 0.7]} />
          {look.shirt ? <P g={cone(0.075, 0.26, 3)} c={look.shirt} p={[0, 1.5, 0.138]} r={[Math.PI, 0, 0]} s={[1, 1, 0.3]} shadow={false} /> : null}
          {look.shirt
            ? [1, -1].map((sx) => <P key={sx} g={BOX} c={look.top} p={[0.062 * sx, 1.36, 0.135]} r={[-0.1, 0, 0.42 * sx]} s={[0.05, 0.3, 0.018]} />)
            : null}
          {look.tie ? <P g={BOX0} c={look.tie} p={[0, 1.16, 0.15]} s={[0.036, 0.3, 0.01]} shadow={false} /> : null}
          {back ? <Panel map={signTex(back, "rgba(0,0,0,0)", N.gold, 512, 256, 170)} w={0.34} h={0.17} p={[0, 1.24, -0.142]} r={[0, Math.PI, 0]} alpha /> : null}
          <ArmRig side={1} a={pose.armL ?? {}} look={look} up={up} hold={holdL} />
          <ArmRig side={-1} a={pose.armR ?? {}} look={look} up={up} hold={holdR} />
          <Head look={look} pose={pose} />
        </group>
      </group>
    </group>
  );
};

// ---------------- light + world shell ----------------
export type LightKind = "warm" | "studio" | "stage" | "night" | "day" | "cool";
const LIGHT: Record<LightKind, { bg: string; fog: [number, number]; hemi: [string, string, number]; key: [string, number]; keyPos: V3; amb: number; rim: [string, number]; rimPos: V3 }> = {
  // the N look: dark teal rooms, amber pools of light from lamps you can see, a cool rim on the far side
  warm: { bg: "#0B1216", fog: [12, 34], hemi: ["#8FB0BC", "#2A1E16", 0.5], key: ["#FFCB90", 2.3], keyPos: [3, 8, 6], amb: 0.1, rim: ["#62D2DC", 1.5], rimPos: [-6, 5, -5] },
  studio: { bg: "#080B14", fog: [12, 36], hemi: ["#6E7CFF", "#120C1A", 0.45], key: ["#FFF1DA", 3], keyPos: [2, 12, 5], amb: 0.08, rim: ["#FF5C8A", 1.6], rimPos: [6, 4, -5] },
  stage: { bg: "#090E13", fog: [12, 36], hemi: ["#8FB0BC", "#1C1A20", 0.6], key: ["#FFD6A0", 3.4], keyPos: [3, 10, 6], amb: 0.14, rim: ["#62D2DC", 2], rimPos: [-6, 5, -6] },
  night: { bg: "#070E1E", fog: [16, 60], hemi: ["#5E7CC8", "#141620", 0.6], key: ["#AFC4FF", 1.2], keyPos: [-8, 14, 6], amb: 0.1, rim: ["#FFB46A", 0.8], rimPos: [6, 4, -8] },
  day: { bg: "#0A1216", fog: [24, 70], hemi: ["#9CC4CC", "#1A2026", 0.55], key: ["#FFE0B0", 3.2], keyPos: [7, 18, 8], amb: 0.14, rim: ["#62D2DC", 1], rimPos: [-8, 6, -8] },
  cool: { bg: "#0E151A", fog: [12, 40], hemi: ["#B8D0DC", "#20262C", 0.6], key: ["#E8F2FF", 2.1], keyPos: [3, 10, 4], amb: 0.14, rim: ["#62D2DC", 1], rimPos: [-5, 4, 5] },
};
export const Lights: React.FC<{ kind: LightKind; target?: V3; box?: number }> = ({ kind, target = [0, 0, 0], box = 12 }) => {
  const L = LIGHT[kind];
  const dir = useMemo(() => {
    const d = new THREE.DirectionalLight(L.key[0], L.key[1]);
    d.castShadow = true;
    d.shadow.mapSize.set(2048, 2048);
    d.shadow.bias = -0.0005;
    d.shadow.normalBias = 0.02;
    return d;
  }, [L.key]);
  const c = dir.shadow.camera;
  c.left = c.bottom = -box;
  c.right = c.top = box;
  c.near = 0.5;
  c.far = 80;
  c.updateProjectionMatrix();
  dir.position.set(target[0] + L.keyPos[0], target[1] + L.keyPos[1], target[2] + L.keyPos[2]);
  dir.target.position.set(...target);
  dir.target.updateMatrixWorld();
  return (
    <>
      <color attach="background" args={[L.bg]} />
      <fog attach="fog" args={[L.bg, L.fog[0], L.fog[1]]} />
      <primitive object={dir} />
      <primitive object={dir.target} />
      <hemisphereLight args={L.hemi} />
      <ambientLight intensity={L.amb} />
      <directionalLight color={L.rim[0]} intensity={L.rim[1]} position={[target[0] + L.rimPos[0], target[1] + L.rimPos[1], target[2] + L.rimPos[2]]} />
    </>
  );
};

/** One shot: the 3D world through `cam`, 2D overlay (numbers, HUD) on top. */
export const Shot3D: React.FC<{ cam: Cam; light: LightKind; target?: V3; box?: number; children: React.ReactNode; over?: React.ReactNode; filter?: string; post?: PostOpts }> = ({ cam, light, target, box, children, over, filter, post }) => {
  const k = makeCam(cam);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter }}>
        <ThreeCanvas width={W} height={H} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
          <CamSync cam={k} />
          <Lights kind={light} target={target} box={box} />
          {children}
          <Post {...post} />
        </ThreeCanvas>
      </AbsoluteFill>
      {over ? <AbsoluteFill>{over}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};
/** the one camera move a shot may have: eased in-out from a to b over the shot */
export const glide = (a: Cam, b: Cam, t: number, len: number) => {
  const k = easeIO(Math.min(1, Math.max(0, t / Math.max(1, len))));
  return {
    pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3,
    look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
    fov: (a.fov ?? 40) + ((b.fov ?? 40) - (a.fov ?? 40)) * k,
  };
};

// ---------------- 2D overlay: number chips, CCTV HUD, subtitles ----------------
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
export type ChipIn = "pop" | "slide" | "count" | "type" | "drop" | "still";
/**
 * A burned-in number chip (the only text on the frame besides subtitles). `count` rolls a number from `from` to `to`;
 * `type` types the text in; `del` (frames after `at`) deletes it again, char by char.
 */
export const Chip: React.FC<{
  x: number;
  y: number;
  at: number;
  text?: string;
  to?: number;
  from?: number;
  pre?: string;
  post?: string;
  dur?: number;
  kind?: ChipIn;
  color?: string;
  bg?: string;
  size?: number;
  out?: number;
  del?: number;
  strike?: number;
}> = ({ x, y, at, text, to, from = 0, pre = "", post = "", dur = 24, kind = "pop", color = "#FFFFFF", bg = "rgba(16,12,20,.82)", size = 84, out, del, strike }) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f >= out)) return null;
  const t = f - at;
  let s = text ?? "";
  if (to !== undefined) s = pre + fmt(kind === "count" ? interpolate(t, [0, dur], [from, to], { ...CLAMP, easing: Easing.out(Easing.cubic) }) : to) + post;
  if (kind === "type") s = s.slice(0, Math.ceil(interpolate(t, [0, dur], [0, s.length], CLAMP)));
  if (del !== undefined && t >= del) s = s.slice(0, Math.max(0, s.length - Math.floor((t - del) / 1.4)));
  if (!s) return null;
  const sc = kind === "pop" ? interpolate(t, [0, 4, 8, 11], [0.4, 1.12, 0.97, 1], CLAMP) : 1;
  const dy = kind === "drop" ? interpolate(t, [0, 7], [-60, 0], { ...CLAMP, easing: Easing.out(Easing.back(2)) }) : 0;
  const dx = kind === "slide" ? interpolate(t, [0, 8], [-120, 0], { ...CLAMP, easing: Easing.out(Easing.cubic) }) : 0;
  const op = kind === "slide" || kind === "drop" ? interpolate(t, [0, 5], [0, 1], CLAMP) : 1;
  const st = strike !== undefined ? interpolate(t, [strike, strike + 6], [0, 1], CLAMP) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: `calc(-50% + ${dx}px) calc(-50% + ${dy}px)`, scale: String(sc), opacity: op }}>
      <div style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1, color, background: bg, padding: `${size * 0.22}px ${size * 0.34}px`, borderRadius: size * 0.22, whiteSpace: "nowrap", border: `5px solid ${color}`, boxShadow: "0 10px 0 rgba(0,0,0,.35)" }}>
        {s}
        {st > 0 ? <div style={{ position: "absolute", left: size * 0.2, top: "50%", height: size * 0.12, width: `calc(${st * 100}% - ${size * 0.4}px)`, background: N.red, borderRadius: 6 }} /> : null}
      </div>
    </div>
  );
};
/** security-camera frame: corner brackets, CAM id, REC dot (no clock: every number on screen must be in the fact table) */
export const Cctv: React.FC<{ cam: string }> = ({ cam }) => {
  const f = useCurrentFrame();
  const L = SAFE.left + 30;
  const R = CANVAS.width - SAFE.right - 30;
  const T = SAFE.top + 30;
  const B = 1180;
  const br = (x: number, y: number, sx: number, sy: number) => <path d={`M ${x} ${y + 70 * sy} L ${x} ${y} L ${x + 70 * sx} ${y}`} stroke="#FFFFFF" strokeWidth={7} fill="none" opacity={0.85} />;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)" }} />
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {br(L, T, 1, 1)}
        {br(R, T, -1, 1)}
        {br(L, B, 1, -1)}
        {br(R, B, -1, -1)}
        <circle cx={L + 40} cy={T + 60} r={14} fill="#FF3B30" opacity={Math.floor(f / 15) % 2 ? 0.25 : 1} />
      </svg>
      <div style={{ position: "absolute", left: L + 70, top: T + 34, fontFamily: "Consolas, monospace", fontWeight: 700, fontSize: 50, color: "#FFFFFF", textShadow: "0 0 6px #000" }}>
        {cam} REC
      </div>
    </AbsoluteFill>
  );
};
/** subtitles: white, black outline, one line, bottom of the safe zone (the reference look, project chunk rule 1–3 words) */
export const NSub: SubSkin = ({ lines }) => (
  <div style={{ position: "absolute", left: SAFE.left, right: SAFE.right, bottom: CANVAS.height - SUB_BOTTOM + 14, display: "flex", justifyContent: "center" }}>
    {/* a soft dark pool: white words must stay readable on white tickets */}
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.1, textAlign: "center", textTransform: "uppercase", letterSpacing: 1, padding: "30px 120px", background: "radial-gradient(closest-side, rgba(8,8,12,.86), rgba(8,8,12,.62) 62%, rgba(8,8,12,0))" }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {ln.map((w, k) => (
            <span key={k} style={{ color: w.key ? N.gold : "#FFFFFF", WebkitTextStroke: `15px ${N.ink}`, paintOrder: "stroke fill" }}>
              {k ? " " : ""}
              {w.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
