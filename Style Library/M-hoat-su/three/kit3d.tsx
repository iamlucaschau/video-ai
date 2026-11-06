/**
 * Style M in 3D (Lucas 2026-11-04: "dùng Three.js qua @remotion/three … dựng lại toàn bộ video m-doss"): the world is a
 * three.js scene, the people stay our 2D rig drawn as SVG cards placed by projecting their feet through the same camera
 * (the "2D characters in a 3D world" look of Squire and of reference/claude-animated-shorts, MIT, which this follows).
 *
 * Here: toon materials (2–3 tone cel shading), ink (edge lines on hard shapes, inverted hull on round ones), sky dome,
 * light presets, procedural textures, the shot camera and `place()` (3D feet → rig pose on screen).
 * Rules: every motion from useCurrentFrame (no useFrame), all randomness seeded.
 */
import { useThree } from "@react-three/fiber";
import React, { useMemo } from "react";
import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { basePose, LEG_LEN, type Pose } from "../../toon-engine/rig";
import type { SceneLight } from "../look";

export type V3 = [number, number, number];
export const W = 1080;
export const H = 1920;
export const INK = "#1A1420";

// ---------------- camera + projection ----------------
export type Cam = { pos: V3; look: V3; fov?: number };
export const makeCam = (c: Cam) => {
  const k = new THREE.PerspectiveCamera(c.fov ?? 40, W / H, 0.1, 600);
  k.position.set(...c.pos);
  k.lookAt(...c.look);
  k.updateMatrixWorld();
  k.updateProjectionMatrix();
  return k;
};
/**
 * A camera framed on a person standing at (x, z): `hp` = their height on screen in px, `feet` = where their feet land
 * (screen y, may be below 1920 for a close-up), `camY` = lens height, `dx` = the lens moved sideways (it still looks
 * at the person, a little turned). fov 40 unless given.
 */
export const shotCam = ({ at, hp, feet, camY = 1.5, dx = 0, fov = 40, h = 1.75 }: { at: [number, number]; hp: number; feet: number; camY?: number; dx?: number; fov?: number; h?: number }): Cam => {
  const f = H / 2 / Math.tan((fov * Math.PI) / 360);
  const d = (h * f) / hp;
  const pitch = Math.atan(camY / d) - Math.atan((feet - H / 2) / f);
  return { pos: [at[0] + dx, camY, at[1] + d], look: [at[0] + dx * 0.4, camY - Math.tan(pitch) * d, at[1]], fov };
};
/** lerp two cameras (an eased pan / dolly between two keys, camera rule C) */
export const camLerp = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3,
  look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: (a.fov ?? 40) + ((b.fov ?? 40) - (a.fov ?? 40)) * k,
});
const tmp = new THREE.Vector3();
/** world point → SVG screen coordinates (1080×1920) */
export const toScreen = (k: THREE.PerspectiveCamera, p: V3) => {
  tmp.set(...p).project(k);
  return { x: (tmp.x + 1) * 0.5 * W, y: (1 - tmp.y) * 0.5 * H };
};
/** rig height at scale 1: feet to the top of the head (LEG_LEN + |HEAD.y| + r) */
const RIG_H = LEG_LEN + 176 + 62;
/** A person standing with the feet at (x, y0, z), `h` metres tall: the rig pose that sits there on screen. */
export const place = (k: THREE.PerspectiveCamera, x: number, z: number, extra: Partial<Pose> = {}, y0 = 0, h = 1.75): Pose => {
  const f = toScreen(k, [x, y0, z]);
  const top = toScreen(k, [x, y0 + h, z]);
  const s = (f.y - top.y) / RIG_H;
  return { ...basePose, x: f.x, y: f.y - LEG_LEN * s, scale: s, ...extra };
};
/** pixels per metre at a world point (for 2D props drawn next to a placed person) */
export const pxPerM = (k: THREE.PerspectiveCamera, p: V3) => {
  const a = toScreen(k, p);
  const b = toScreen(k, [p[0], p[1] + 1, p[2]]);
  return Math.abs(a.y - b.y);
};

/** Inside a ThreeCanvas: copy the shot camera into R3F's default camera every render. */
export const CamSync: React.FC<{ cam: THREE.PerspectiveCamera }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.copy(cam.position);
  camera.quaternion.copy(cam.quaternion);
  camera.fov = cam.fov;
  camera.aspect = W / H;
  camera.near = cam.near;
  camera.far = cam.far;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return null;
};

// ---------------- seeded noise ----------------
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// ---------------- materials ----------------
/** 3-step ramp: shade, mid, lit (the shade step is not black, reference shade ~.3 of lit) */
const GRAD = (() => {
  const t = new THREE.DataTexture(new Uint8Array([92, 92, 92, 255, 178, 178, 178, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
})();
const matCache = new Map<string, THREE.Material>();
export const toon = (color: string, map?: THREE.Texture, emissive?: string) => {
  const key = `${color}|${map?.uuid ?? ""}|${emissive ?? ""}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color, map, gradientMap: GRAD, emissive: emissive ?? "#000000", emissiveIntensity: emissive ? 1 : 0 });
    matCache.set(key, m);
  }
  return m;
};
/** inverted-hull outline: the back faces pushed out along the (smooth) normals, flat ink colour */
const HULL = (() => {
  const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uInk = { value: 0.022 };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nuniform float uInk;").replace("#include <begin_vertex>", "vec3 transformed = position + normal * uInk;");
  };
  return m;
})();

// ---------------- ink lines on hard edges ----------------
const lineMats: LineMaterial[] = [];
const LINE = (() => {
  const m = new LineMaterial({ color: new THREE.Color(INK).getHex(), linewidth: 3, fog: true });
  lineMats.push(m);
  return m;
})();
/** keeps the ink ~3 px at 1080 wide whatever the render scale */
export const InkSize: React.FC = () => {
  const gl = useThree((s) => s.gl);
  const v = gl.getDrawingBufferSize(new THREE.Vector2());
  for (const m of lineMats) {
    m.resolution.set(v.x, v.y);
    m.linewidth = 3 * (v.y / H);
  }
  return null;
};
const edgeCache = new WeakMap<THREE.BufferGeometry, LineSegmentsGeometry>();
const edgesOf = (g: THREE.BufferGeometry, deg = 28) => {
  let e = edgeCache.get(g);
  if (!e) {
    const eg = new THREE.EdgesGeometry(g, deg);
    e = new LineSegmentsGeometry().setPositions(eg.attributes.position.array as Float32Array);
    edgeCache.set(g, e);
  }
  return e;
};

export type SolidProps = {
  g: THREE.BufferGeometry;
  color: string;
  p?: V3;
  r?: V3;
  s?: V3 | number;
  map?: THREE.Texture;
  /** "edges": ink on hard edges (boxes, planks); "hull": silhouette ink for round shapes; "none" */
  ink?: "edges" | "hull" | "none";
  emissive?: string;
  shadow?: boolean;
  visible?: boolean;
};
/** One inked toon object. */
export const Solid: React.FC<SolidProps> = ({ g, color, p = [0, 0, 0], r = [0, 0, 0], s = 1, map, ink = "edges", emissive, shadow = true, visible = true }) => {
  const line = useMemo(() => (ink === "edges" ? new LineSegments2(edgesOf(g), LINE) : null), [g, ink]);
  const sc = typeof s === "number" ? ([s, s, s] as V3) : s;
  return (
    <group position={p} rotation={r} scale={sc} visible={visible}>
      <mesh geometry={g} material={toon(color, map, emissive)} castShadow={shadow} receiveShadow />
      {ink === "hull" ? <mesh geometry={g} material={HULL} /> : null}
      {line ? <primitive object={line} /> : null}
    </group>
  );
};

// ---------------- shared geometry ----------------
const geoCache = new Map<string, THREE.BufferGeometry>();
const geo = (key: string, make: () => THREE.BufferGeometry) => {
  let g = geoCache.get(key);
  if (!g) {
    g = make();
    geoCache.set(key, g);
  }
  return g;
};
export const BOX = geo("box", () => new THREE.BoxGeometry(1, 1, 1));
/** unit box with its base at y = 0 */
export const BOX0 = geo("box0", () => new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0));
export const PLANE = geo("plane", () => new THREE.PlaneGeometry(1, 1));
export const cyl = (rt: number, rb: number, h: number, n = 16) => geo(`cyl${rt}|${rb}|${h}|${n}`, () => new THREE.CylinderGeometry(rt, rb, h, n).translate(0, h / 2, 0));
export const ball = (r: number, n = 20) => geo(`ball${r}|${n}`, () => new THREE.SphereGeometry(r, n, Math.round(n * 0.7)));
/** a lumpy rock: a sphere pushed in and out by seeded noise, smooth normals so the hull ink holds */
export const rock = (seed: number, r = 1, flat = 0.6) =>
  geo(`rock${seed}|${r}|${flat}`, () => {
    const g = mergeVertices(new THREE.IcosahedronGeometry(r, 2));
    const R = rng(seed);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const bumps = Array.from({ length: 6 }, () => [R() * 2 - 1, R() * 2 - 1, R() * 2 - 1, 0.15 + R() * 0.25]);
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      let k = 1;
      for (const [x, y, z, a] of bumps) k += a * Math.max(0, n.dot(new THREE.Vector3(x, y, z).normalize())) ** 3;
      v.multiplyScalar(k);
      v.y = v.y > 0 ? v.y * flat : v.y * 0.3;
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  });

// ---------------- procedural textures (seeded, made once) ----------------
const texCache = new Map<string, THREE.Texture>();
const canvasTex = (key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D, R: () => number) => void, repeat: [number, number] = [1, 1]) => {
  let t = texCache.get(key);
  if (!t) {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const c = cv.getContext("2d")!;
    draw(c, rng(key.length * 7919 + w));
    t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
    t.anisotropy = 4;
    texCache.set(key, t);
  }
  return t;
};
/** draw at (x, y) and at its wrapped copies, so a repeating texture shows no seam */
const wrap = (x: number, y: number, fn: (x: number, y: number) => void, S = 512) => {
  for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]) fn(x + dx, y + dy);
};
/** white-based so the material colour tints it; dark seams painted in */
export const TEX = {
  planks: (rep: [number, number] = [2, 2]) =>
    canvasTex(`planks${rep}`, 512, 512, (c, R) => {
      c.fillStyle = "#fff";
      c.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 8; i++) {
        c.fillStyle = `rgba(0,0,0,${0.04 + R() * 0.08})`;
        c.fillRect(0, i * 64, 512, 64);
        c.fillStyle = "rgba(20,10,10,.55)";
        c.fillRect(0, i * 64, 512, 3);
        const x = R() * 512;
        c.fillRect(x, i * 64, 3, 64);
        for (let k = 0; k < 6; k++) {
          c.strokeStyle = `rgba(60,30,10,${0.06 + R() * 0.06})`;
          c.beginPath();
          const y = i * 64 + 8 + R() * 48;
          c.moveTo(0, y);
          c.bezierCurveTo(170, y + R() * 6 - 3, 340, y + R() * 6 - 3, 512, y);
          c.stroke();
        }
      }
    }, rep),
  plaster: (rep: [number, number] = [1, 1]) =>
    canvasTex(`plaster${rep}`, 512, 512, (c, R) => {
      c.fillStyle = "#fff";
      c.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 900; i++) {
        c.fillStyle = `rgba(0,0,0,${R() * 0.05})`;
        const r = 4 + R() * 26;
        wrap(R() * 512, R() * 512, (x, y) => {
          c.beginPath();
          c.arc(x, y, r, 0, 7);
          c.fill();
        });
      }
      c.fillStyle = "rgba(0,0,0,.12)";
      c.fillRect(0, 470, 512, 42); // a darker dado band low on the wall
    }, rep),
  ground: (key: string, rep: [number, number], dots: string) =>
    canvasTex(`ground${key}${rep}`, 512, 512, (c, R) => {
      c.fillStyle = "#fff";
      c.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 1400; i++) {
        c.fillStyle = `rgba(${dots},${0.05 + R() * 0.12})`;
        const r = 2 + R() * 12;
        wrap(R() * 512, R() * 512, (x, y) => {
          c.beginPath();
          c.ellipse(x, y, r * 1.6, r * 0.7, 0, 0, 7);
          c.fill();
        });
      }
      for (let i = 0; i < 160; i++) {
        c.strokeStyle = `rgba(${dots},${0.15 + R() * 0.15})`;
        c.lineWidth = 2;
        const dx = R() * 6 - 3;
        const dy = -6 - R() * 8;
        wrap(R() * 512, R() * 512, (x, y) => {
          c.beginPath();
          c.moveTo(x, y);
          c.lineTo(x + dx, y + dy);
          c.stroke();
        });
      }
    }, rep),
  rockFace: (rep: [number, number] = [1, 1]) =>
    canvasTex(`rockface${rep}`, 512, 1024, (c, R) => {
      c.fillStyle = "#fff";
      c.fillRect(0, 0, 512, 1024);
      for (let i = 0; i < 26; i++) {
        // strata: horizontal bands with dark cracks
        const y = i * 40 + R() * 20;
        c.fillStyle = `rgba(0,0,0,${0.03 + R() * 0.08})`;
        c.fillRect(0, y, 512, 20 + R() * 30);
        c.strokeStyle = "rgba(30,20,20,.45)";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(0, y);
        for (let x = 0; x <= 512; x += 32) c.lineTo(x, y + R() * 10 - 5);
        c.stroke();
      }
      for (let i = 0; i < 40; i++) {
        c.strokeStyle = "rgba(30,20,20,.35)";
        c.lineWidth = 2;
        let x = R() * 512;
        let y = R() * 1024;
        c.beginPath();
        c.moveTo(x, y);
        for (let k = 0; k < 4; k++) {
          x += R() * 30 - 15;
          y += 15 + R() * 30;
          c.lineTo(x, y);
        }
        c.stroke();
      }
    }, rep),
};

// ---------------- sky + light ----------------
const SKY: Record<SceneLight, { top: string; hor: string; fog: string; near: number; far: number }> = {
  day: { top: "#3E7FD2", hor: "#BFD8EE", fog: "#C4DAEC", near: 30, far: 260 },
  golden: { top: "#6A5AA8", hor: "#FFC27A", fog: "#E8A880", near: 25, far: 220 },
  night: { top: "#0E1838", hor: "#36508A", fog: "#26365E", near: 14, far: 120 },
  indoor: { top: "#3A3040", hor: "#3A3040", fog: "#3A3040", near: 40, far: 200 },
};
export const Sky: React.FC<{ light: SceneLight }> = ({ light }) => {
  const k = SKY[light];
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: new THREE.Color(k.top) }, hor: { value: new THREE.Color(k.hor) } },
        vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "uniform vec3 top; uniform vec3 hor; varying vec3 vP; void main(){ float k = smoothstep(-0.05, 0.55, vP.y); gl_FragColor = vec4(mix(hor, top, k), 1.0); }",
      }),
    [k.top, k.hor],
  );
  return (
    <>
      <mesh geometry={ball(400, 32)} material={mat} renderOrder={-1} />
      <fog attach="fog" args={[k.fog, k.near, k.far]} />
    </>
  );
};

/** Light presets. The sun is a shadow-casting directional light; shade gets a cool fill (never lavender faces). */
export const Lights: React.FC<{ light: SceneLight; sun?: V3; target?: V3 }> = ({ light, sun, target = [0, 0, 0] }) => {
  const set = {
    day: { sun: sun ?? ([30, 50, 25] as V3), sunC: "#FFF1D6", sunI: 2.4, hemiS: "#BFD8EE", hemiG: "#8A7A5A", hemiI: 1.15 },
    golden: { sun: sun ?? ([-40, 14, -20] as V3), sunC: "#FFB36B", sunI: 2.6, hemiS: "#8A80C8", hemiG: "#6A4A50", hemiI: 1.0 },
    night: { sun: sun ?? ([-20, 40, 10] as V3), sunC: "#9CB4FF", sunI: 1.25, hemiS: "#4A5E9A", hemiG: "#2A2A3A", hemiI: 0.95 },
    indoor: { sun: sun ?? ([4, 8, 6] as V3), sunC: "#FFE2B0", sunI: 1.5, hemiS: "#FFE6C8", hemiG: "#5A4A48", hemiI: 1.1 },
  }[light];
  const dir = useMemo(() => {
    const d = new THREE.DirectionalLight(set.sunC, set.sunI);
    d.castShadow = true;
    d.shadow.mapSize.set(2048, 2048);
    d.shadow.bias = -0.0004;
    d.shadow.normalBias = 0.03;
    const c = d.shadow.camera;
    c.left = c.bottom = -30;
    c.right = c.top = 30;
    c.near = 1;
    c.far = 200;
    return d;
  }, [set.sunC, set.sunI]);
  dir.position.set(target[0] + set.sun[0], target[1] + set.sun[1], target[2] + set.sun[2]);
  dir.target.position.set(...target);
  dir.target.updateMatrixWorld();
  return (
    <>
      <primitive object={dir} />
      <primitive object={dir.target} />
      <hemisphereLight args={[set.hemiS, set.hemiG, set.hemiI]} />
    </>
  );
};
