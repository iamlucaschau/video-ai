/**
 * 9:16 check of the toon engine (rig + room kit + light): one lit room in perspective with the cast standing in it,
 * one walking, and the expression row below. Not a style: the style that uses the engine draws its own sets and looks.
 * Composition `Toon-Engine-Check` (1080×1920, 30 fps, 4 s); register it in Root.tsx when a style starts using the engine.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { KitDefs } from "./kit";
import { Dust, Glow, LightVeil, SetDefs } from "./light";
import { makeRoom } from "./room";
import { BackWindow, FloorShadow, Pendant, RoomShell, stand, WallLight } from "./furnish";
import { basePose, Expr, faceAt, Hero, LOOKS, poseAt, walkPose } from "./rig";
import { easeOut } from "./anim";

// back wall inside the safe zone (x 60–940, y 220–1440)
const R = makeRoom({ x: 500, y: 560 }, { x0: 190, x1: 810, y0: 360, y1: 860 }, 3.4);
const EXPR: Expr[] = ["neutral", "happy", "smug", "shock", "worried", "oops", "cool", "dizzy", "tired"];

export const ToonCheck: React.FC = () => {
  const f = useCurrentFrame();
  const a = stand(R, 0.24, 0.28);
  const b = stand(R, 0.5, 0.08);
  // a reach with anticipation and overshoot, and a face swap through a blink (rig.tsx poseAt / faceAt)
  const reach = poseAt(f, [
    { f: 0, p: { ...a, yaw: 0.45, armR: { a: 14, b: -6 } } },
    { f: 10, p: { armR: { a: 4, b: -10 } } },
    { f: 18, p: { armR: { a: 78, b: 0 } }, ease: easeOut },
    { f: 22, p: { armR: { a: 70, b: -4 } } },
  ]);
  const walk = walkPose(330 + ((f * 1.6) % 380), f * 0.6, b.y, b.scale, { yaw: 0.9 });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0C1E" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        <KitDefs />
        <SetDefs />
        <RoomShell r={R} id="tc" floor="boards" />
        <BackWindow r={R} id="tcw" t={f} x0={380} x1={620} y0={430} y1={640} sun={{ x: 520, y: 630 }} />
        <Pendant r={R} u={0.72} w={0.35} t={f} />
        <WallLight r={R} u={0} v={0.4} w={0.5} />
        <FloorShadow r={R} u={[0.16, 0.32]} w={[0.24, 0.32]} />
        {/* draw order is depth: the far walker first */}
        <Hero look={LOOKS.mo} pose={{ ...walk, expr: "happy" }} rimId="rimL" />
        <Hero look={LOOKS.pipHood} pose={{ ...reach, ...faceAt(f, [[0, "neutral"], [20, "smug"]]) }} rimId="rimR" />
        <Hero look={LOOKS.suit} pose={{ ...basePose, ...stand(R, 0.8, 0.25), yaw: -0.3, expr: "worried" }} rimId="rimL" />
        <LightVeil id="tcv" lights={[[500, 560, 300], [R.P(0.72, 0.3, 0.35).x, R.P(0.72, 0.3, 0.35).y, 220]]} o={0.42} />
        <Glow x={500} y={540} r={260} o={0.5} />
        <Dust t={f} seed={3} x0={380} y0={430} w={240} h={420} n={30} />
        {/* the expression row: one rig, nine faces */}
        {EXPR.map((e, i) => (
          <Hero
            key={e}
            look={i % 2 ? LOOKS.sis : LOOKS.pip}
            pose={{ ...basePose, x: 130 + (i % 5) * 190, y: 1130 + Math.floor(i / 5) * 230, scale: 0.55, yaw: 0, expr: e }}
            rimId="rimR"
            shadow={0}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
