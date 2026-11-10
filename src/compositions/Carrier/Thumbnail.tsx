/**
 * YouTube thumbnails for "How an Aircraft Carrier Defends Itself" (Formats/Naval Board/episodes/ep01-carrier,
 * 2026-11-09), built to the channel's thumbnail notes (Formats/Naval Board/00_he-thong/02_CONG-THUC.md §6):
 * A and C on frames of the episode's own Blender shots (public/images/carrier/thumb-*.jpg, from out/3d/fleet/0005 and
 * out/3d/phalanx/0262), B drawn in code. All three show the 3 rings the title promises (Lucas 2026-11-09: the first A
 * and C did not), each with its own words. Render:
 *   npx remotion still Carrier-Thumbnail "Formats/Naval Board/episodes/ep01-carrier/thumb-b.jpg" --props='{"variant":"b"}' --image-format=jpeg --jpeg-quality=92
 * ≤ 3 words, nothing important in the bottom-right corner (YouTube puts the duration there).
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C } from "../Ambush/kit";
import { Word } from "../Ambush/Thumbnail";

export type CarrierThumbVariant = "a" | "b" | "c";

/** Top-down carrier silhouette: angled deck, island on the starboard side. */
const Deck: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -150 -18 L 120 -22 L 160 -10 L 165 12 L 120 24 L -120 22 L -160 6 L -175 -30 L -120 -40 Z" fill="#ffffff" />
    <rect x={30} y={14} width={34} height={10} fill="#9aa3ab" />
  </g>
);

/** B: the three rings on black, missiles coming in; one reaches the last ring. */
const Rings: React.FC = () => {
  const cx = 1230;
  const cy = 650;
  const rings: [number, string][] = [
    [450, RING_COLORS[0]],
    [320, RING_COLORS[1]],
    [195, RING_COLORS[2]],
  ];
  const tracks: [number, number, number][] = [
    // angle (deg), stop radius, burst
    [0, 450, 1],
    [300, 320, 1],
    [55, 450, 1],
    [140, 195, 1],
  ];
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width={1920} height={1080} fill="#000" />
      {rings.map(([r, col]) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={8} opacity={0.9} />
      ))}
      {tracks.map(([a, stop], i) => {
        const rad = (a * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * 760;
        const y1 = cy + Math.sin(rad) * 760;
        const x2 = cx + Math.cos(rad) * stop;
        const y2 = cy + Math.sin(rad) * stop;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeDasharray="28 18" />
            <circle cx={x2} cy={y2} r={i === 3 ? 46 : 32} fill={i === 3 ? "#ff9a3c" : C.red} />
          </g>
        );
      })}
      <Deck x={cx} y={cy} s={0.95} />
    </svg>
  );
};

const RING_COLORS = ["#4da3ff", "#7fe3d0", C.tracer];

/** A: the three rings laid flat on the sea around the formation (perspective ellipses, outer to inner). */
const FleetRings: React.FC = () => {
  const cx = 1156;
  const cy = 619; // the carrier after the zoom below
  const sizes: [number, number][] = [
    [700, 245],
    [440, 160],
    [215, 80],
  ];
  return (
    <>
      {sizes.map(([rx, ry], i) => (
        <g key={rx}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#000" strokeWidth={16} opacity={0.35} />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={RING_COLORS[i]} strokeWidth={9} />
        </g>
      ))}
    </>
  );
};

/** C: small ring diagram, the innermost ring hit: this is the last ring. */
const MiniRings: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={175} fill="rgba(0,0,0,0.6)" />
    {[150, 105, 60].map((r, i) => (
      <circle key={r} r={r} fill="none" stroke={i === 2 ? C.red : RING_COLORS[i]} strokeWidth={i === 2 ? 10 : 6} opacity={i === 2 ? 1 : 0.8} />
    ))}
    <rect x={-22} y={-8} width={44} height={16} rx={4} fill="#ffffff" />
    <circle cx={42} cy={-42} r={20} fill="#ff9a3c" />
  </g>
);

export const CarrierThumbnail: React.FC<{ variant?: CarrierThumbVariant }> = ({ variant = "a" }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {variant === "b" ? (
      <Rings />
    ) : (
      <Img
        src={staticFile(`images/carrier/thumb-${variant}.jpg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "contrast(1.15) saturate(1.3)",
          // A: zoom 1.3 on the carrier (966, 549 in the frame) and move it right and down, out from under the words
          ...(variant === "a" ? { transformOrigin: "966px 549px", scale: "1.3", translate: "190px 70px" } : {}),
        }}
      />
    )}
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="carShade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.55} />
          <stop offset="60%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>
      {variant === "a" ? (
        <>
          <FleetRings />
          <rect width={1920} height={1080} fill="url(#carShade)" />
          <Word x={70} y={210} text="65 PLANES." color="#ffffff" size={180} />
          <Word x={70} y={390} text="1 TARGET." color={C.tracer} size={180} />
        </>
      ) : variant === "b" ? (
        <Word x={60} y={230} text="UNSINKABLE?" color="#ffffff" size={200} />
      ) : (
        <>
          <rect width={1920} height={1080} fill="url(#carShade)" />
          <g transform="translate(1090 300) scale(1.35)">
            <MiniRings x={0} y={0} />
          </g>
          <Word x={70} y={250} text="1 MILE" color="#ffffff" size={230} />
          <Word x={70} y={480} text="AWAY." color={C.tracer} size={230} />
        </>
      )}
    </svg>
  </AbsoluteFill>
);
