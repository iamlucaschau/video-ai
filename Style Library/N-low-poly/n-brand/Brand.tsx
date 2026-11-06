/**
 * NEON ODDS channel art (Lucas 2026-11-06), built from the style N kit: same facets, same dark teal + amber light.
 * Stills: `npx remotion still Neon-Odds-Logo …` · `npx remotion still Neon-Odds-Banner …`.
 * Banner safe area (YouTube): 1546 × 423 in the middle of 2560 × 1440; the name stays inside it, the rest may be cropped.
 */
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { Box, type Cam, ctex, type LightKind, Lights, makeCam, N, P, Panel, Person, sph, SIGN_FONT, torus, type V3 } from "../lowpoly";
import { Post } from "../post";
import { Ball, DrawMachine, Pile } from "../props";
import { CoinTower, extra, Neon, panelWall, Pendant, woodTex } from "../sets";

const StillCam: React.FC<{ cam: THREE.PerspectiveCamera; aspect: number }> = ({ cam, aspect }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.copy(cam.position);
  camera.quaternion.copy(cam.quaternion);
  camera.fov = cam.fov;
  camera.aspect = aspect;
  camera.near = cam.near;
  camera.far = cam.far;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return null;
};
const Stage: React.FC<{ w: number; h: number; cam: Cam; light: LightKind; box?: number; children: React.ReactNode }> = ({ w, h, cam, light, box, children }) => (
  <AbsoluteFill>
    <ThreeCanvas width={w} height={h} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
      <StillCam cam={makeCam(cam)} aspect={w / h} />
      <Lights kind={light} box={box} />
      {children}
      <Post />
    </ThreeCanvas>
  </AbsoluteFill>
);

const AMBER = "#FFB347";
const TEAL = "#62D2DC";

// ---------------- logo: a dark faceted lotto ball, its N and its circle lit like tubes, in a teal ring. Reads at 98 px, stays inside YouTube's circle ----------------
const logoBall = () =>
  ctex("neon-logo-ball-2", 2048, 1024, (c) => {
    c.fillStyle = "#0B171B";
    c.fillRect(0, 0, 2048, 1024);
    c.strokeStyle = AMBER;
    c.lineWidth = 34;
    c.beginPath();
    c.ellipse(512, 512, 330, 420, 0, 0, 7);
    c.stroke();
    c.fillStyle = AMBER;
    c.font = `900 560px ${SIGN_FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("N", 512, 535);
  });
const LogoBall: React.FC = () => {
  const m = useMemo(() => new THREE.MeshStandardMaterial({ map: logoBall(), emissiveMap: logoBall(), emissive: "#FFFFFF", emissiveIntensity: 1.5, flatShading: true, roughness: 0.32, metalness: 0.25 }), []);
  return <mesh geometry={sph(0.8, 24, 16)} material={m} rotation={[0.04, 0.05, -0.1]} castShadow />;
};
export const NeonOddsLogo: React.FC = () => (
  <Stage w={1024} h={1024} cam={{ pos: [0, 0, 4.4], look: [0, 0, 0], fov: 30 }} light="warm">
    <Box w={8} h={8} d={0.1} c="#FFFFFF" p={[0, -4, -1.3]} o={{ map: panelWall("#102A2E", "#081A1E", "logo") }} />
    <LogoBall />
    <P g={torus(0.98, 0.03, 48)} c="#1FA8B6" o={{ e: "#1FB4C4", ei: 1.9 }} shadow={false} />
    <pointLight position={[1.2, 1.5, 2]} intensity={1.6} distance={6} color="#FFD6A0" />
  </Stage>
);

// ---------------- banner: the neon sign in the safe strip, the machine and the money either side ----------------
const signArt = () =>
  ctex("neon-odds-sign", 2048, 440, (c) => {
    c.fillStyle = "#07090D";
    c.fillRect(0, 0, 2048, 440);
    c.font = `900 300px ${SIGN_FONT}`;
    c.textBaseline = "middle";
    const word = (text: string, x: number, color: string) => {
      c.textAlign = "left";
      c.shadowColor = color;
      c.shadowBlur = 30;
      c.fillStyle = color;
      c.fillText(text, x, 232);
      c.shadowBlur = 0;
    };
    const a = c.measureText("NEON").width;
    const b = c.measureText("ODDS").width;
    const x = (2048 - a - b - 90) / 2;
    word("NEON", x, AMBER);
    word("ODDS", x + a + 90, TEAL);
  });
const FLOAT: [number, V3, number][] = [
  [14, [-1.25, 3.1, 0.4], 0.17],
  [7, [1.05, 3.12, 0.2], 0.15],
  [41, [-2.35, 3.0, 0.3], 0.14],
  [23, [3.1, 3.05, 0.2], 0.18],
];
export const NeonOddsBanner: React.FC = () => (
  <Stage w={2560} h={1440} cam={{ pos: [0, 2.1, 11], look: [0, 2.1, 0], fov: 30 }} light="warm" box={12}>
    <Box w={20} h={7} d={0.2} c="#FFFFFF" p={[0, 0, -2.2]} o={{ map: panelWall("#1C3F42", "#0F2628", "banner") }} />
    <Box w={20} h={1.1} d={0.24} c="#FFFFFF" p={[0, 0, -2.16]} o={{ map: woodTex("banner", "#3C2216") }} />
    <Box w={20} h={0.05} d={0.26} c={N.gold} p={[0, 1.1, -2.16]} o={{ metal: 0.6, rough: 0.35 }} shadow={false} />
    <Box w={24} h={0.1} d={12} c="#FFFFFF" p={[0, -0.1, 2]} o={{ map: woodTex("bannerfloor", "#2A1A14") }} />
    {/* the sign: dark board, two-colour neon, a tube above and below */}
    <Box w={5.36} h={1.32} d={0.12} c="#0C0C12" p={[0, 1.44, -1.98]} />
    <Panel map={signArt()} w={5.1} h={1.1} p={[0, 2.1, -1.9]} glow={1.06} />
    <Neon p={[0, 2.72, -1.88]} w={5.3} c={AMBER} />
    <Neon p={[0, 1.46, -1.88]} w={5.3} c={TEAL} />
    <Pendant p={[-2.6, 5.4, -0.6]} i={9} drop={1.2} />
    <Pendant p={[2.6, 5.4, -0.6]} i={9} drop={1.2} />
    <Neon p={[-7.5, 4.3, -2.05]} w={3.4} c={TEAL} />
    <Neon p={[7.5, 4.3, -2.05]} w={3.4} c={AMBER} />
    {/* left: the machine. Right: the coins and the heap, and someone who cannot believe the number */}
    <group position={[-3.9, 0, 0.1]} scale={0.92}>
      <DrawMachine f={140} tray={false} />
    </group>
    <CoinTower p={[3.15, 0, -0.2]} h={2.7} />
    <Pile n={2400} r={1.5} h={0.8} p={[3.55, 0, 0.5]} seed={9} />
    <Person look={extra(7, { hairStyle: "short", hair: "#2A1A14", glasses: true, moustache: false, top: "#7A5236", shirt: "#F3EFE6", tie: "#8A2A34", pants: "#4A3426" })} pose={{ x: 1.56, y: 0.34, z: 5.2, ry: -30, yaw: -14, pitch: -10, lookX: -0.8, lookY: 0.7, brow: 1, mouth: 0.75, smile: 0.5, blink: 0, armL: { o: 8 }, armR: { f: 26, e: -60, o: 8 } }} />
    {FLOAT.map(([n, p, r]) => (
      <Ball key={n} n={n} p={p} r={r} shadow={false} />
    ))}
    <pointLight position={[0, 2.5, 3.2]} intensity={10} distance={9} color="#FFD6A0" />
    {/* his face, turned to the sign, away from the key light */}
    <pointLight position={[0.7, 2.3, 6.2]} intensity={2.4} distance={2.6} color="#FFE2B8" />
  </Stage>
);
