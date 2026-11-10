/**
 * One shot in 3D: the three.js world behind, our 2D people (SVG) in front, placed through the same camera.
 *   <Stage3D cam={k} light="day" blur={8} world={<Barracks />}> …SVG people… </Stage3D>
 * `front` is a second, transparent 3D layer drawn over the people (a desk, a rock edge they stand behind).
 * The background blur is the depth of field (N1): the people stay sharp, as in the 2D version.
 */
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill } from "remotion";
import type * as THREE from "three";
import { KitDefs } from "../../toon-engine/kit";
import { SetDefs } from "../../toon-engine/light";
import { LookDefs, type SceneLight } from "../look";
import { CamSync, H, InkSize, Lights, Sky, type V3, W } from "./kit3d";

const Canvas3D: React.FC<{ cam: THREE.PerspectiveCamera; light: SceneLight; sun?: V3; target?: V3; sky: boolean; children: React.ReactNode }> = ({ cam, light, sun, target, sky, children }) => (
  <ThreeCanvas width={W} height={H} shadows flat gl={{ antialias: true, alpha: !sky, preserveDrawingBuffer: true }} style={{ position: "absolute", inset: 0 }}>
    <CamSync cam={cam} />
    <InkSize />
    {sky ? <Sky light={light} /> : null}
    <Lights light={light} sun={sun} target={target} />
    {children}
  </ThreeCanvas>
);

export const Stage3D: React.FC<{
  cam: THREE.PerspectiveCamera;
  light: SceneLight;
  world: React.ReactNode;
  front?: React.ReactNode;
  blur?: number;
  sun?: V3;
  /** where the sun's shadow box is centred (the action) */
  target?: V3;
  sky?: boolean;
  children?: React.ReactNode;
  /** SVG drawn over the front layer (signs, numbers, flashes) */
  over?: React.ReactNode;
}> = ({ cam, light, world, front, blur = 0, sun, target, sky = true, children, over }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ filter: blur > 0 ? `blur(${blur}px)` : undefined }}>
      <Canvas3D cam={cam} light={light} sun={sun} target={target} sky={sky}>
        {world}
      </Canvas3D>
    </AbsoluteFill>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <KitDefs />
      <SetDefs />
      <LookDefs />
      {children}
    </svg>
    {front ? (
      <Canvas3D cam={cam} light={light} sun={sun} target={target} sky={false}>
        {front}
      </Canvas3D>
    ) : null}
    {over ? (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {over}
      </svg>
    ) : null}
  </AbsoluteFill>
);
