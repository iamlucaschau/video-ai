/**
 * YouTube thumbnails for "How Submarines Actually Fight" (Formats/Naval Board/episodes/ep02-submarines, 2026-11-08), the Test & compare set chosen
 * against the top thumbnails on the same search (THAM-KHAO-THUMB.md there): C and D on frames of the episode's
 * own Blender shots (public/images/submarines/thumb-*.jpg, copied from out/3d/sub-<shot>/), E drawn in code. Render:
 *   npx remotion still Submarines-Thumbnail "Formats/Naval Board/episodes/ep02-submarines/thumb-e.jpg" --props='{"variant":"e"}' --image-format=jpeg --jpeg-quality=92
 * One focal point each, ≤ 3 words, nothing important in the bottom-right corner (YouTube puts the duration there).
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C } from "../Ambush/kit";
import { Word } from "../Ambush/Thumbnail";

export type SubThumbVariant = "c" | "d" | "e";

const BG: Record<Exclude<SubThumbVariant, "e">, string> = {
  c: "images/submarines/thumb-c.jpg", // vanguard f100: the two missile boats side by side, about to touch
  d: "images/submarines/thumb-d.jpg", // hook f20: hull and sail filling the frame (big subject, bright water, as the top channels do)
};

/** Plain boat silhouette for the diagram variant (E): the outlier sonar thumbnails are a white boat on black. */
const WhiteSub: React.FC<{ x: number; y: number; s: number; color: string; flip?: boolean }> = ({ x, y, s, color, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill={color}>
    <path d="M -128 0 L -152 -22 L -160 -22 L -156 0 L -160 22 L -152 22 L -128 8 Z" />
    <path d="M 150 0 C 150 -18, 120 -24, 90 -24 L -110 -24 C -128 -20, -140 -8, -146 0 C -140 8, -128 18, -110 22 L 90 24 C 120 24, 150 18, 150 0 Z" />
    <path d="M 8 -24 L 14 -48 L 46 -48 L 54 -24 Z" />
  </g>
);

/** E: diagram on black. The enemy pings (orange arcs); the quiet boat hears it first. */
const Diagram: React.FC = () => (
  <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <rect width={1920} height={1080} fill="#000" />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M ${1420 - 120 - i * 130} ${640 - 150 - i * 70} A ${170 + i * 130} ${170 + i * 130} 0 0 0 ${1420 - 120 - i * 130} ${640 + 150 + i * 70}`} fill="none" stroke="#ff9a3c" strokeWidth={11 - i * 2} opacity={1 - i * 0.18} />
    ))}
    <WhiteSub x={1560} y={640} s={1.15} color="#ff5a3c" flip />
    <WhiteSub x={470} y={650} s={2.3} color="#ffffff" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${830 + i * 44} ${590 - i * 34} Q ${870 + i * 52} 650 ${830 + i * 44} ${710 + i * 34}`} fill="none" stroke="#7fe3d0" strokeWidth={12} opacity={1 - i * 0.25} />
    ))}
  </svg>
);

const Ring: React.FC<{ x: number; y: number; r: number; color: string; w?: number; o?: number }> = ({ x, y, r, color, w = 10, o = 1 }) => (
  <circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={w} opacity={o} />
);

export const SubmarinesThumbnail: React.FC<{ variant?: SubThumbVariant }> = ({ variant = "e" }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {variant === "e" ? (
      <Diagram />
    ) : (
      // the renders are dark for the video; a thumbnail at 320 px wide needs more light, D most (big subject, bright water)
      <Img src={staticFile(BG[variant as Exclude<SubThumbVariant, "e">])} style={{ width: "100%", height: "100%", objectFit: "cover", filter: variant === "d" ? "brightness(1.9) contrast(1.15) saturate(1.5)" : "brightness(1.45) contrast(1.2) saturate(1.25)" }} />
    )}
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="subTop" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0.7} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="subVig" cx="50%" cy="55%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.7} />
        </radialGradient>
        <radialGradient id="subGlow">
          <stop offset="0%" stopColor="#ffb070" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#ffb070" stopOpacity={0} />
        </radialGradient>
      </defs>
      {variant === "e" ? null : <rect x={0} y={0} width={1920} height={1080} fill="url(#subVig)" />}
      {variant === "d" ? (
        <>
          <Word x={70} y={800} text="HEARS YOU" color="#ffffff" size={210} />
          <Word x={70} y={1000} text="FIRST." color={C.tracer} size={210} />
        </>
      ) : variant === "e" ? (
        <>
          <Word x={80} y={210} text="HEARS" color={C.tracer} size={180} />
          <Word x={560} y={210} text="YOU FIRST." color="#ffffff" size={180} />
        </>
      ) : (
        <>
          {/* where the hulls meet: bow of the near boat against the far boat's flank */}
          <circle cx={1500} cy={470} r={260} fill="url(#subGlow)" />
          <Ring x={1500} y={470} r={120} color={C.red} w={12} />
          <rect x={0} y={0} width={1920} height={360} fill="url(#subTop)" />
          <Word x={80} y={250} text="TOO QUIET" color="#ffffff" size={240} />
        </>
      )}
    </svg>
  </AbsoluteFill>
);
