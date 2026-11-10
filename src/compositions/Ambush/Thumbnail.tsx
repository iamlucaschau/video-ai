/**
 * YouTube thumbnails for "How Ambushes Actually Work" (Test/ambush, 2026-11-05): three A/B variants drawn with the
 * episode's own kit, so the thumbnail looks like the video. Render:
 *   npx remotion still Ambush-Thumbnail Test/ambush/thumb-a.jpg --props='{"variant":"a"}'
 * One focal point each, ≤ 3 words, nothing important in the bottom-right corner (YouTube puts the duration there).
 */
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Arrow, Blast, C, Column, COND, Forest, KillZone, Road, Soldier, Terrain, Tracer } from "./kit";

export type ThumbVariant = "a" | "b" | "c";

const ROAD = "M -400 600 L 2400 600";
const longX = (i: number) => 620 + (700 * i) / 7;
const shortY = (i: number) => 395 + (140 * i) / 3;
const cam = (s: number, cx: number, cy: number) => `translate(960 540) scale(${s}) translate(${-cx} ${-cy})`;

/** Big outlined word: black stroke under the fill, plus a soft drop shadow. */
export const Word: React.FC<{ x: number; y: number; text: string; color: string; size: number; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  text,
  color,
  size,
  anchor = "start",
}) => (
  <g>
    <text x={x + 10} y={y + 14} textAnchor={anchor} fill="#000" opacity={0.55} fontFamily={COND} fontWeight={800} fontSize={size} letterSpacing={2}>
      {text}
    </text>
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      stroke="#0a0a08"
      strokeWidth={size * 0.09}
      paintOrder="stroke"
      strokeLinejoin="round"
      fontFamily={COND}
      fontWeight={800}
      fontSize={size}
      letterSpacing={2}
    >
      {text}
    </text>
  </g>
);

/** Shared map: road between two forest bands, the L line of ambushers. */
const Map: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <>
    <Terrain seed="thumb" tint="#1c2318" />
    <Road d={ROAD} w={80} />
    <Forest x={-400} y={60} w={2800} h={370} seed="th1" density={1.1} />
    <Forest x={-400} y={735} w={2800} h={520} seed="th2" density={1.1} />
    {children}
  </>
);

const Glow: React.FC<{ x: number; y: number; r: number; color: string; o?: number }> = ({ x, y, r, color, o = 0.5 }) => (
  <>
    <defs>
      <radialGradient id={`gl-${x}-${y}`}>
        <stop offset="0%" stopColor={color} stopOpacity={o} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#gl-${x}-${y})`} />
  </>
);

const Fire: React.FC<{ fromShort?: boolean; g?: number; targets: number[] }> = ({ fromShort = true, g = 7, targets }) => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <Tracer key={i} g={g} seed={i * 3} x1={longX(i)} y1={455} x2={targets[i % targets.length] + ((i * 37) % 50) - 25} y2={600 + ((i * 23) % 30) - 15} on={0} w={6} />
    ))}
    {fromShort
      ? Array.from({ length: 4 }).map((_, i) => (
          <Tracer key={`s${i}`} g={g} seed={i * 5 + 1} x1={1470} y1={shortY(i)} x2={targets[i % targets.length]} y2={600} on={0} w={6} />
        ))
      : null}
  </>
);

const Ambushers: React.FC = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <Soldier key={i} x={longX(i)} y={455} r={14} />
    ))}
    {Array.from({ length: 4 }).map((_, i) => (
      <Soldier key={`s${i}`} x={1470} y={shortY(i)} r={14} a={180} />
    ))}
  </>
);

/** A still explosion for the thumbnail: uneven fireball, dark smoke around it, long sparks. */
const Boom: React.FC<{ x: number; y: number; s?: number; seed: string }> = ({ x, y, s = 1, seed }) => {
  const r = (k: string) => random(`${seed}${k}`);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + r(`sa${i}`);
        const d = 70 + r(`sd${i}`) * 50;
        return <circle key={`sm${i}`} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.8 - 10} r={48 + r(`sr${i}`) * 34} fill={i % 2 ? "#2b2824" : "#3a352e"} opacity={0.85} />;
      })}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2 + r(`ka${i}`) * 0.3;
        const d1 = 50 + r(`k1${i}`) * 30;
        const d2 = d1 + 50 + r(`k2${i}`) * 90;
        return <line key={`k${i}`} x1={Math.cos(a) * d1} y1={Math.sin(a) * d1} x2={Math.cos(a) * d2} y2={Math.sin(a) * d2} stroke="#ffd98a" strokeWidth={4} strokeLinecap="round" opacity={0.9} />;
      })}
      {[
        ["#d9431f", 1.0, 16],
        ["#ff8a2a", 0.8, 14],
        ["#ffc24a", 0.58, 11],
        ["#fff3c0", 0.34, 7],
      ].map(([col, k, n], L) =>
        Array.from({ length: Number(n) }).map((_, i) => {
          const a = r(`fa${L}${i}`) * Math.PI * 2;
          const d = r(`fd${L}${i}`) * 60 * Number(k);
          return <circle key={`f${L}${i}`} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={(26 + r(`fr${L}${i}`) * 26) * Number(k) + 8} fill={String(col)} />;
        }),
      )}
    </g>
  );
};

/** A: the trap closes. */
const ThumbA: React.FC = () => {
  const veh = [1300, 1190, 1080, 970, 860];
  return (
    <>
      <g transform={cam(1.85, 1070, 570)}>
        <Map>
          <KillZone x={560} y={520} w={840} h={160} p={1} pulse={0.6} />
          <Column d={ROAD} head={1700} n={5} gap={110} dead={[1, 0, 0, 0, 1]} />
          <Ambushers />
          <Fire targets={veh} />
          <Boom x={1300} y={598} s={0.66} seed="front" />
          <Boom x={860} y={602} s={0.56} seed="rear" />
          <Glow x={1300} y={600} r={260} color="#ffb347" o={0.55} />
          <Glow x={860} y={600} r={220} color="#ffb347" o={0.45} />
        </Map>
      </g>
      <rect x={0} y={0} width={760} height={1080} fill="url(#leftShade)" />
    </>
  );
};

/** B: the instinct, crossed out. */
const ThumbB: React.FC = () => (
  <>
    <g transform={cam(1.8, 1000, 600)}>
      <Map>
        <KillZone x={560} y={520} w={840} h={160} p={1} pulse={0.3} />
        <Column d={ROAD} head={1700} n={5} gap={110} dead={[1, 0, 0, 0, 1]} />
        <Ambushers />
        <Fire targets={[1190, 1080, 970]} g={9} />
        {[0, 1, 2, 3].map((i) => (
          <Soldier key={i} x={1000 + i * 70} y={662} color={C.blue} r={13} a={180} />
        ))}
        <Blast g={30} x={1300} y={600} at={0} />
        <Blast g={30} x={860} y={600} at={0} />
        <Arrow d="M 1180 700 C 1000 720, 760 720, 420 690" p={1} color={C.blue} w={30} />
        <g stroke={C.red} strokeWidth={46} strokeLinecap="round">
          <line x1={640} y1={590} x2={860} y2={810} />
          <line x1={860} y1={590} x2={640} y2={810} />
        </g>
      </Map>
    </g>
    <rect x={0} y={0} width={1920} height={330} fill="url(#topShade)" />
  </>
);

/** C: the counter-intuitive answer. */
const ThumbC: React.FC = () => (
  <>
    <g transform={cam(1.8, 1030, 590)}>
      <Map>
        <Column d={ROAD} head={1700} n={5} gap={110} dead={[1, 0, 0, 0, 1]} />
        <Ambushers />
        <Fire targets={[1240, 1080, 940]} g={11} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <Soldier x={760 + i * 105} y={520 + (i % 2) * 18} color={C.blue} r={14} a={-90} />
            <Tracer g={8} seed={i + 20} x1={760 + i * 105} y1={520 + (i % 2) * 18} x2={longX(Math.min(7, i + 1))} y2={455} on={0} color="#9fd0ff" w={5} />
          </g>
        ))}
        {[820, 1030, 1240].map((x) => (
          <Arrow key={x} d={`M ${x} 700 L ${x} 470`} p={1} color={C.blue} w={26} />
        ))}
        <Glow x={1030} y={520} r={360} color="#4da3ff" o={0.28} />
      </Map>
    </g>
    <rect x={0} y={0} width={1920} height={330} fill="url(#topShade)" />
  </>
);

export const AmbushThumbnail: React.FC<{ variant?: ThumbVariant }> = ({ variant = "a" }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="leftShade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="topShade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <radialGradient id="thumbVig" cx="55%" cy="55%" r="75%">
          <stop offset="55%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.75} />
        </radialGradient>
      </defs>
      {variant === "a" ? <ThumbA /> : variant === "b" ? <ThumbB /> : <ThumbC />}
      <rect x={0} y={0} width={1920} height={1080} fill="url(#thumbVig)" />
      {/* words last, above the vignette */}
      {variant === "a" ? (
        <>
          <Word x={70} y={330} text="TOO" color="#ffffff" size={260} />
          <Word x={70} y={570} text="LATE" color={C.red} size={260} />
        </>
      ) : variant === "b" ? (
        <Word x={960} y={250} text="WRONG MOVE" color="#ffffff" size={230} anchor="middle" />
      ) : (
        <Word x={960} y={250} text="RUN AT THEM?" color="#ffffff" size={230} anchor="middle" />
      )}
    </svg>
  </AbsoluteFill>
);

