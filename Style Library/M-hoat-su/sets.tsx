/**
 * Style M "Hoạt Sử" outdoor sets drawn in code (Lucas 2026-11-04: no AI pictures from now on). Flat 2D illustration
 * like the reference: layered planes (far, mid, near) with the kit's thick ink line, a horizon haze, one light source,
 * a little texture on the ground, and something that moves (clouds, smoke, snow, rain, stars, water). The ground line is
 * HORIZON (= the room's floor line), so people placed with stand(ROOM, …) stand on the ground. Used by ww2.tsx `Outside`.
 */
import React from "react";
import { rnd } from "../toon-engine/anim";
import { M } from "./hoat-su";

export const HORIZON = 880;
const INK = M.ink;
const W0 = -400; // sets bleed past the frame so camera pans and zooms never show an edge
const W1 = 1480;

export type SetKind = "field" | "road" | "fjord" | "town" | "alley" | "hill" | "fence" | "jungle" | "ridge" | "cliff" | "night";

// ---------- shared pieces

const Sky: React.FC<{ id: string; stops: string[]; y1?: number }> = ({ id, stops, y1 = HORIZON + 40 }) => (
  <>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        {stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}
      </linearGradient>
    </defs>
    <rect x={W0} y={-600} width={W1 - W0} height={y1 + 600} fill={`url(#${id}sky)`} />
  </>
);
/** A soft band of haze sitting on the horizon (depth). */
const Haze: React.FC<{ id: string; color: string; y?: number; h?: number; o?: number }> = ({ id, color, y = HORIZON - 160, h = 220, o = 0.55 }) => (
  <>
    <defs>
      <linearGradient id={`${id}hz`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color} stopOpacity={0} />
        <stop offset="0.6" stopColor={color} stopOpacity={o} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x={W0} y={y} width={W1 - W0} height={h} fill={`url(#${id}hz)`} />
  </>
);
/** A glowing disc: sun or moon, with a halo. */
const Orb: React.FC<{ id: string; x: number; y: number; r: number; color: string; halo: string }> = ({ id, x, y, r, color, halo }) => (
  <>
    <defs>
      <radialGradient id={`${id}orb`}>
        <stop offset="0" stopColor={halo} stopOpacity={0.55} />
        <stop offset="1" stopColor={halo} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r * 5} fill={`url(#${id}orb)`} />
    <circle cx={x} cy={y} r={r} fill={color} />
  </>
);
/** Darker corners, as in the reference frames (draws the eye to the middle). */
const Vignette: React.FC<{ id: string; o?: number }> = ({ id, o = 0.45 }) => (
  <>
    <defs>
      <radialGradient id={`${id}vg`} cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={o} />
      </radialGradient>
    </defs>
    <rect x={W0} y={-600} width={W1 - W0} height={3200} fill={`url(#${id}vg)`} />
  </>
);
/** A ridge line of hills from a seed: smooth bumps across the width, filled down to `bottom`. */
const ridge = (seed: number, y: number, amp: number, n: number, bottom = 2400) => {
  let d = `M ${W0} ${bottom} L ${W0} ${y}`;
  const step = (W1 - W0) / n;
  for (let i = 0; i < n; i++) {
    const x0 = W0 + i * step;
    const top = y - amp * (0.4 + 0.6 * rnd(seed, i));
    d += ` Q ${x0 + step / 2} ${top} ${x0 + step} ${y - amp * 0.3 * rnd(seed + 1, i)}`;
  }
  return `${d} L ${W1} ${bottom} Z`;
};
const Hills: React.FC<{ seed: number; y: number; amp: number; n: number; fill: string; line?: boolean }> = ({ seed, y, amp, n, fill, line = true }) => (
  <path d={ridge(seed, y, amp, n)} fill={fill} stroke={line ? INK : "none"} strokeWidth={5} strokeLinejoin="round" />
);
/** Drifting clouds with an ink edge. */
const Clouds: React.FC<{ t: number; y: number; color: string; n?: number; speed?: number; line?: boolean }> = ({ t, y, color, n = 3, speed = 1, line = true }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = ((i * 610 + t * speed * (0.6 + i * 0.25)) % 2000) - 500;
      const s = 0.8 + rnd(7, i) * 0.6;
      return (
        <g key={i} transform={`translate(${x} ${y + i * 80}) scale(${s})`}>
          <path d="M -150 30 Q -160 -10 -110 -14 Q -100 -60 -40 -50 Q -10 -90 50 -60 Q 110 -70 120 -20 Q 170 -10 160 30 Z" fill={color} stroke={line ? INK : "none"} strokeWidth={4} strokeLinejoin="round" opacity={0.92} />
        </g>
      );
    })}
  </g>
);
/** Grass tufts / stones scattered over the ground, bigger toward the bottom (perspective). */
const Tufts: React.FC<{ seed: number; color: string; n?: number; y0?: number; kind?: "grass" | "stone" }> = ({ seed, color, n = 26, y0 = HORIZON + 30, kind = "grass" }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = rnd(seed, i);
      const y = y0 + k * k * (1900 - y0);
      const x = W0 + rnd(seed + 3, i) * (W1 - W0);
      const s = 0.4 + ((y - y0) / (1900 - y0)) * 1.6;
      return kind === "grass" ? (
        <path key={i} d={`M ${x - 14 * s} ${y} q ${4 * s} ${-22 * s} ${10 * s} ${-30 * s} M ${x} ${y} q 0 ${-26 * s} ${2 * s} ${-38 * s} M ${x + 14 * s} ${y} q ${-4 * s} ${-20 * s} ${-10 * s} ${-28 * s}`} stroke={color} strokeWidth={4 * s} fill="none" strokeLinecap="round" />
      ) : (
        <ellipse key={i} cx={x} cy={y} rx={18 * s} ry={8 * s} fill={color} stroke={INK} strokeWidth={2.5 * s} />
      );
    })}
  </g>
);
/** Smoke columns rising and drifting. */
const Smoke: React.FC<{ t: number; x: number; y: number; color?: string; n?: number; o?: number }> = ({ t, x, y, color = "#8E8C8A", n = 5, o = 0.35 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = ((t * 0.6 + i * 60) % 300) / 300;
      return <circle key={i} cx={x + Math.sin(k * 5 + i) * 30 + k * 60} cy={y - k * 420} r={30 + k * 90} fill={color} opacity={o * (1 - k)} />;
    })}
  </g>
);
const Tree: React.FC<{ x: number; y: number; s?: number; leaf?: string; trunk?: string }> = ({ x, y, s = 1, leaf = "#4E6A3A", trunk = "#5A4632" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinejoin="round">
    <path d="M -14 0 L -10 -220 L 10 -220 L 14 0 Z" fill={trunk} />
    <path d="M 0 -480 Q 110 -470 120 -360 Q 170 -300 110 -230 Q 60 -180 0 -200 Q -60 -180 -110 -230 Q -170 -300 -120 -360 Q -110 -470 0 -480 Z" fill={leaf} />
    <path d="M -60 -330 Q -20 -360 20 -330 M 30 -400 Q 60 -420 90 -390" stroke="#3A5228" strokeWidth={4} fill="none" />
  </g>
);
const Palm: React.FC<{ x: number; y: number; s?: number; t: number; i: number; leaf?: string }> = ({ x, y, s = 1, t, i, leaf = "#3E6A3A" }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t / 40 + i) * 1.5})`} stroke={INK} strokeLinejoin="round" strokeLinecap="round">
    <path d="M -12 0 Q 10 -260 30 -520 L 46 -520 Q 30 -260 14 0 Z" fill="#6A5438" strokeWidth={5} />
    {/* fronds: drooping leaf blades of different lengths, each with a midrib */}
    {[-2.4, -1.4, -0.5, 0.5, 1.4, 2.4].map((k, j) => {
      const len = 150 + (j % 3) * 30;
      const dx = Math.sin(k * 0.62) * len;
      const dy = -Math.cos(k * 0.62) * len * 0.5 + Math.abs(k) * 46;
      const nx = -dy / len;
      const ny = dx / len;
      const w = 34;
      return (
        <g key={j}>
          <path d={`M 38 -520 Q ${38 + dx * 0.5 + nx * w} ${-520 + dy * 0.3 + ny * w - 30} ${38 + dx} ${-520 + dy} Q ${38 + dx * 0.5 - nx * w} ${-520 + dy * 0.3 - ny * w - 10} 38 -520 Z`} fill={leaf} strokeWidth={4} />
          <path d={`M 38 -520 Q ${38 + dx * 0.5} ${-520 + dy * 0.3 - 22} ${38 + dx} ${-520 + dy}`} stroke={INK} strokeWidth={2.5} fill="none" opacity={0.6} />
        </g>
      );
    })}
  </g>
);
const House: React.FC<{ x: number; y: number; w: number; h: number; wall: string; roof: string; lit?: boolean; snow?: boolean }> = ({ x, y, w, h, wall, roof, lit, snow }) => (
  <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
    <rect x={x} y={y - h} width={w} height={h} fill={wall} />
    <path d={`M ${x - 8} ${y - h} L ${x + w / 2} ${y - h - w * 0.45} L ${x + w + 8} ${y - h} Z`} fill={snow ? "#E6EAEC" : roof} />
    <rect x={x + w * 0.35} y={y - h * 0.62} width={w * 0.3} height={h * 0.32} fill={lit ? "#F2C66A" : "#3A3040"} strokeWidth={3} />
  </g>
);

// ---------- the sets

export const CodeSet: React.FC<{ kind: SetKind; id: string; t: number }> = ({ kind, id, t }) => {
  switch (kind) {
    case "field":
    case "road":
      return (
        <g>
          <Sky id={id} stops={["#3F86D8", "#86B6E8", "#E2EEF2"]} />
          <Clouds t={t} y={260} color="#E8E6DE" n={4} speed={0.7} />
          <Hills seed={3} y={HORIZON - 90} amp={90} n={5} fill="#9BAA8A" />
          {/* a village and its spire on the far hill */}
          <g opacity={0.9}>
            {[0, 1, 2, 3].map((i) => <House key={i} x={560 + i * 54} y={HORIZON - 100 - (i % 2) * 8} w={44} h={34} wall="#B8B0A0" roof="#8A5A48" />)}
            <path d={`M 700 ${HORIZON - 120} L 712 ${HORIZON - 230} L 724 ${HORIZON - 120} Z`} fill="#8C8676" stroke={INK} strokeWidth={4} />
          </g>
          <Haze id={id} color="#E4E0D0" />
          <Hills seed={9} y={HORIZON - 10} amp={60} n={7} fill="#6E8650" />
          {/* hedgerow: a band of round bush crowns */}
          {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={W0 + 40 + i * 120} cy={HORIZON - 10 - rnd(5, i) * 20} r={60 + rnd(6, i) * 26} fill={i % 2 ? "#4E6A3A" : "#57733F"} stroke={INK} strokeWidth={5} />)}
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="#8DB45E" />
          {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${W0} ${HORIZON + 90 + i * i * 70} Q 540 ${HORIZON + 60 + i * i * 70} ${W1} ${HORIZON + 100 + i * i * 70}`} stroke="#7A9358" strokeWidth={8 + i * 3} fill="none" />)}
          {kind === "road" ? (
            <g>
              <path d={`M 140 2000 L 470 ${HORIZON} L 600 ${HORIZON} L 980 2000 Z`} fill="#B49870" stroke={INK} strokeWidth={5} />
              <path d={`M 535 ${HORIZON + 20} L 560 2000`} stroke="#9A7E58" strokeWidth={10} strokeDasharray="60 50" />
              {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1040 - i * 90} y={HORIZON + 30 + i * i * 60} width={12 + i * 4} height={70 + i * 30} fill="#6A5438" stroke={INK} strokeWidth={3} />)}
            </g>
          ) : null}
          <Tufts seed={11} color="#5E7A40" n={30} />
          <Tree x={-40} y={HORIZON + 160} s={1.3} />
          <Vignette id={id} o={0.2} />
        </g>
      );
    case "fjord":
      return (
        <g>
          <Sky id={id} stops={["#5C88B8", "#A6C4DC", "#E4ECEE"]} />
          <Clouds t={t} y={230} color="#B8BFC4" n={3} speed={0.5} />
          {/* two ranges of snowy mountains */}
          <path d={`M ${W0} ${HORIZON - 40} L -60 420 L 120 540 L 320 360 L 520 560 L 720 400 L 980 600 L 1160 450 L ${W1} ${HORIZON - 40} Z`} fill="#7C8894" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {/* snow caps: a jagged white cap on each peak */}
          {[[-60, 420, 0.9], [320, 360, 1], [720, 400, 1], [1160, 450, 0.8]].map(([x, y, k], i) => (
            <path key={i} d={`M ${x} ${y} L ${x + 92 * k} ${y + 66 * k} L ${x + 60 * k} ${y + 58 * k} L ${x + 34 * k} ${y + 84 * k} L ${x + 6 * k} ${y + 60 * k} L ${x - 24 * k} ${y + 80 * k} L ${x - 48 * k} ${y + 56 * k} L ${x - 80 * k} ${y + 70 * k} Z`} fill="#EEF1F2" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          ))}
          <Haze id={id} color="#D6DADC" y={HORIZON - 260} h={260} />
          <path d={`M ${W0} ${HORIZON - 40} L 100 640 L 300 ${HORIZON - 80} L 480 700 L 700 ${HORIZON - 60} L 900 680 L ${W1} ${HORIZON - 40} Z`} fill="#4E5A66" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {/* the harbour: red houses on a jetty, a smoking chimney */}
          {[0, 1, 2, 3, 4].map((i) => <House key={i} x={520 + i * 92} y={HORIZON - 30} w={78} h={60 + (i % 2) * 22} wall={i % 2 ? "#A2473C" : "#8E3C34"} roof="#5A2E2A" snow />)}
          <rect x={500} y={HORIZON - 34} width={500} height={14} fill="#5A4636" stroke={INK} strokeWidth={4} />
          <Smoke t={t} x={700} y={HORIZON - 140} color="#9A9A9A" n={4} o={0.3} />
          <rect x={W0} y={HORIZON - 20} width={W1 - W0} height={260} fill="#3A4856" />
          {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${W0 + ((i * 210 + t * 1.5) % (W1 - W0))} ${HORIZON + 20 + (i % 4) * 50} q 30 -8 60 0`} stroke="#6E8090" strokeWidth={5} fill="none" />)}
          {/* the houses' reflection */}
          <rect x={520} y={HORIZON - 4} width={460} height={60} fill="#8E3C34" opacity={0.25} />
          <path d={`M ${W0} ${HORIZON + 230} Q 300 ${HORIZON + 180} ${W1} ${HORIZON + 250} L ${W1} 2400 L ${W0} 2400 Z`} fill="#C9D1D6" stroke={INK} strokeWidth={5} />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${W0} ${HORIZON + 360 + i * i * 120} Q 540 ${HORIZON + 320 + i * i * 120} ${W1} ${HORIZON + 380 + i * i * 120}`} stroke="#B4BEC6" strokeWidth={10 + i * 6} fill="none" />)}
          <Tufts seed={77} color="#6A6E72" n={12} y0={HORIZON + 260} kind="stone" />
          {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={((rnd(7, i) * 1300 - 100 + Math.sin(t / 15 + i) * 20) % 1180)} cy={((rnd(9, i) * 1920 + t * (3 + rnd(3, i) * 3)) % 2000) - 40} r={4 + rnd(5, i) * 5} fill="#FFFFFF" opacity={0.8} />)}
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-rock)" />
          <Vignette id={id} o={0.2} />
        </g>
      );
    case "town":
      return (
        <g>
          <Sky id={id} stops={["#5A5EA8", "#D2788A", "#FFB45E"]} />
          <Orb id={id} x={180} y={HORIZON - 260} r={46} color="#FFD8A0" halo="#FFB070" />
          <Clouds t={t} y={200} color="#E9A88A" n={3} speed={0.4} line={false} />
          <Hills seed={21} y={HORIZON - 120} amp={70} n={4} fill="#7A6E8A" line={false} />
          <Haze id={id} color="#F2B884" />
          {/* the hill and its stacked houses, a bell tower, cypresses */}
          <path d={`M ${W0} ${HORIZON + 60} Q 100 420 560 330 Q 1000 380 ${W1} ${HORIZON + 40} Z`} fill="#8A7454" stroke={INK} strokeWidth={5} />
          {Array.from({ length: 18 }, (_, i) => {
            const row = Math.floor(i / 5);
            const x = 160 + ((i * 131) % 760) + row * 20;
            const y = 470 + row * 110 + (i % 3) * 10;
            return <House key={i} x={x} y={y} w={86} h={66} wall={["#D8BE90", "#C9A878", "#E2CCA2", "#BC9A6A"][i % 4]} roof={i % 3 ? "#B0583A" : "#9A4A34"} lit={i % 4 === 1} />;
          })}
          <g stroke={INK} strokeWidth={5} strokeLinejoin="round">
            <rect x={600} y={240} width={60} height={160} fill="#D2B488" />
            <path d="M 594 240 L 630 190 L 666 240 Z" fill="#9A4A34" />
            <rect x={618} y={268} width={24} height={36} fill="#3A3040" />
          </g>
          {[[300, 560], [880, 600], [960, 520]].map(([x, y], i) => <path key={i} d={`M ${x} ${y} Q ${x - 26} ${y - 120} ${x} ${y - 220} Q ${x + 26} ${y - 120} ${x} ${y} Z`} fill="#3E5A34" stroke={INK} strokeWidth={4} />)}
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="#9A845E" />
          <path d={`M 180 2000 Q 460 1260 520 ${HORIZON} L 600 ${HORIZON} Q 660 1260 920 2000 Z`} fill="#BCA27A" stroke={INK} strokeWidth={5} />
          {/* a stone wall along the near left */}
          <path d={`M ${W0} ${HORIZON + 260} L 260 ${HORIZON + 170} L 280 ${HORIZON + 260} L ${W0} ${HORIZON + 420} Z`} fill="#B49C78" stroke={INK} strokeWidth={5} />
          <Tufts seed={13} color="#7A8A4E" n={18} />
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-rock)" />
          <Vignette id={id} o={0.2} />
        </g>
      );
    case "alley":
      return (
        <g>
          <Sky id={id} stops={["#18224A", "#3A3E72"]} y1={HORIZON} />
          <Orb id={id} x={560} y={300} r={30} color="#F2E6C4" halo="#BFC8E8" />
          {/* the far end: a house across the alley, one lit window */}
          <rect x={330} y={420} width={420} height={HORIZON - 420} fill="#4A4054" stroke={INK} strokeWidth={5} />
          <rect x={500} y={560} width={70} height={90} fill="#F2C66A" stroke={INK} strokeWidth={4} />
          {/* side walls in perspective, stone courses, an arch and a balcony */}
          <path d={`M ${W0} -600 L 330 420 L 330 ${HORIZON} L ${W0} 2400 Z`} fill="#8A6E50" stroke={INK} strokeWidth={6} />
          <path d={`M ${W1} -600 L 750 420 L 750 ${HORIZON} L ${W1} 2400 Z`} fill="#7A6046" stroke={INK} strokeWidth={6} />
          {/* stone courses receding to the far end, with a few joints */}
          {Array.from({ length: 12 }, (_, i) => <path key={`l${i}`} d={`M ${W0} ${-400 + i * 230} L 330 ${430 + i * 38}`} stroke="#6E5640" strokeWidth={4} />)}
          {Array.from({ length: 12 }, (_, i) => <path key={`r${i}`} d={`M ${W1} ${-400 + i * 230} L 750 ${430 + i * 38}`} stroke="#624C38" strokeWidth={4} />)}
          {Array.from({ length: 14 }, (_, i) => {
            const k = 0.15 + rnd(71, i) * 0.8;
            const row = i % 11;
            const xl = 330 + (W0 - 330) * k;
            const yTop = 430 + row * 38 + ((-400 + row * 230) - (430 + row * 38)) * k;
            const yBot = 430 + (row + 1) * 38 + ((-400 + (row + 1) * 230) - (430 + (row + 1) * 38)) * k;
            return <path key={`j${i}`} d={`M ${xl} ${yTop} L ${xl} ${yBot}`} stroke="#6E5640" strokeWidth={4} />;
          })}
          <path d="M 60 1300 L 60 900 Q 160 760 260 860 L 260 1080" fill="#3A2E2A" stroke={INK} strokeWidth={6} />
          <g stroke={INK} strokeWidth={5}>
            <rect x={790} y={560} width={150} height={20} fill="#5A4632" />
            {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${800 + i * 32} 580 L ${800 + i * 32} 640`} />)}
            <path d="M 790 640 L 940 640" />
          </g>
          {/* the lamp and its warm pool of light */}
          <path d="M 760 470 L 820 470 L 820 500" stroke={INK} strokeWidth={6} fill="none" />
          <rect x={806} y={500} width={30} height={40} rx={4} fill="#FFE2A0" stroke={INK} strokeWidth={4} />
          <path d={`M 821 540 L 560 ${HORIZON + 400} L 1080 ${HORIZON + 400} Z`} fill="#FFD48A" opacity={0.1 + 0.04 * Math.sin(t / 3) * Math.sin(t / 7)} />
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="#4E4450" />
          {Array.from({ length: 36 }, (_, i) => {
            const row = Math.floor(i / 6);
            const y = HORIZON + 30 + row * row * 60;
            const s = 0.4 + row * 0.35;
            return <ellipse key={i} cx={240 + (i % 6) * 130 * s + (row % 2) * 60 * s - row * 40} cy={y} rx={50 * s} ry={18 * s} fill="#5E5462" stroke={INK} strokeWidth={3} />;
          })}
          <Tufts seed={17} color="#6A6058" n={10} kind="stone" />
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-rock)" />
          <Vignette id={id} o={0.3} />
        </g>
      );
    case "hill":
      return (
        <g>
          <Sky id={id} stops={["#142048", "#2C4478", "#4E6E9E"]} />
          <Twinkle t={t} n={30} />
          <Orb id={id} x={820} y={300} r={52} color="#ECE6D2" halo="#AFC0DA" />
          <path d={`M 180 ${HORIZON - 200} Q 320 ${HORIZON - 260} 480 ${HORIZON - 200} Z`} fill="#26344C" stroke={INK} strokeWidth={4} />
          <rect x={W0} y={HORIZON - 200} width={W1 - W0} height={260} fill="#1E2C46" />
          <path d={`M 820 ${HORIZON - 196} L 780 ${HORIZON - 20} L 860 ${HORIZON - 20} Z`} fill="#C8D2E0" opacity={0.25} />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M ${W0 + ((i * 260 + t) % (W1 - W0))} ${HORIZON - 150 + (i % 3) * 50} q 24 -6 48 0`} stroke="#4A5E7A" strokeWidth={4} fill="none" />)}
          <path d={`M ${W0} ${HORIZON - 100} Q 200 ${HORIZON - 250} 640 ${HORIZON - 150} Q 980 ${HORIZON - 70} ${W1} ${HORIZON - 130} L ${W1} 2400 L ${W0} 2400 Z`} fill="#46523C" stroke={INK} strokeWidth={5} />
          {/* a stone hut, dry stone walls, dark scrub */}
          <g stroke={INK} strokeWidth={5} strokeLinejoin="round">
            <rect x={120} y={HORIZON - 250} width={170} height={100} fill="#8A8676" />
            <path d={`M 110 ${HORIZON - 250} L 205 ${HORIZON - 300} L 300 ${HORIZON - 250} Z`} fill="#6A665A" />
            <rect x={190} y={HORIZON - 210} width={34} height={60} fill="#2A2A30" />
          </g>
          <Smoke t={t} x={250} y={HORIZON - 300} color="#8A8A92" n={4} o={0.22} />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${W0} ${HORIZON + 40 + i * 260} Q 540 ${HORIZON - 30 + i * 270} ${W1} ${HORIZON + 60 + i * 260}`} stroke="#77736A" strokeWidth={26 + i * 8} strokeDasharray={`${40 + i * 10} 10`} fill="none" />)}
          {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={W0 + rnd(29, i) * (W1 - W0)} cy={HORIZON - 40 + rnd(31, i) * 900} r={26 + rnd(33, i) * 40} fill="#2E3C2A" stroke={INK} strokeWidth={4} />)}
          <Tufts seed={19} color="#6A6A5E" n={16} kind="stone" />
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-rock)" />
          <Vignette id={id} o={0.3} />
        </g>
      );
    case "fence": {
      const sweep = Math.sin(t / 18) * 30;
      return (
        <g>
          <Sky id={id} stops={["#101A3C", "#22346A", "#3A5088"]} />
          <Twinkle t={t} n={24} />
          <Orb id={id} x={240} y={260} r={34} color="#E6E2D2" halo="#9AAAC8" />
          {/* rows of barracks going back */}
          {[0, 1, 2].map((r) => (
            <g key={r} opacity={1 - r * 0.2}>
              {[0, 1, 2, 3].map((i) => (
                <g key={i} stroke={INK} strokeWidth={4}>
                  <rect x={-80 + i * 300 + r * 60} y={HORIZON - 140 + r * 36} width={240 - r * 30} height={90 - r * 10} fill="#3E4048" />
                  <path d={`M ${-90 + i * 300 + r * 60} ${HORIZON - 140 + r * 36} L ${40 + i * 300 + r * 46} ${HORIZON - 180 + r * 36} L ${170 + i * 300 + r * 30} ${HORIZON - 140 + r * 36} Z`} fill="#D8DEE4" />
                </g>
              ))}
            </g>
          ))}
          {/* the tower and its searchlight */}
          <g stroke={INK} strokeWidth={10}>
            <path d={`M 760 ${HORIZON + 80} L 790 400 M 920 ${HORIZON + 80} L 890 400 M 770 600 L 910 700 M 910 600 L 770 700`} />
          </g>
          <rect x={720} y={330} width={240} height={90} fill="#4A3E36" stroke={INK} strokeWidth={6} />
          <path d="M 700 330 L 840 270 L 980 330 Z" fill="#3A302A" stroke={INK} strokeWidth={6} />
          <circle cx={840} cy={378} r={16} fill="#FFF3C8" />
          <path d={`M 840 378 L ${180 + sweep * 10} ${HORIZON + 260} L ${560 + sweep * 10} ${HORIZON + 320} Z`} fill="#FFF3C8" opacity={0.16} />
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="#2E343E" />
          <path d={`M ${W0} ${HORIZON + 300} Q 500 ${HORIZON + 240} ${W1} ${HORIZON + 320} L ${W1} 2400 L ${W0} 2400 Z`} fill="#C8D0D8" opacity={0.25} />
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-60 + i * 130} y={HORIZON + 30} width={16} height={440} fill="#5A4E44" stroke={INK} strokeWidth={4} />)}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M ${W0} ${HORIZON + 80 + i * 80} ${Array.from({ length: 26 }, (_, k) => `L ${W0 + k * 76} ${HORIZON + 80 + i * 80 + (k % 2 ? 10 : -6)}`).join(" ")}`} stroke="#A8AAAE" strokeWidth={4} fill="none" />
          ))}
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-mud)" />
          <Vignette id={id} o={0.32} />
        </g>
      );
    }
    case "jungle":
      return (
        <g>
          <Sky id={id} stops={["#3F8CC8", "#9ACBD8", "#E6F0C8"]} />
          {/* far palms as pale silhouettes, a light haze, mid palms with ink, broad leaves at the edges */}
          {Array.from({ length: 7 }, (_, i) => <Palm key={i} x={W0 + 160 + i * 260} y={HORIZON - 40} s={0.6} t={t} i={i + 10} leaf="#8CA67A" />)}
          <Haze id={id} color="#D8DCC0" y={HORIZON - 360} h={360} o={0.7} />
          {[0, 1, 2, 3].map((i) => <Palm key={i} x={-40 + i * 380} y={HORIZON + 40} s={1.1} t={t} i={i} />)}
          {/* light rays through the canopy */}
          {[0, 1, 2].map((i) => <path key={i} d={`M ${300 + i * 220} -100 L ${200 + i * 220} ${HORIZON + 100} L ${300 + i * 220} ${HORIZON + 100} L ${380 + i * 220} -100 Z`} fill="#F6F2C8" opacity={0.08 + 0.03 * Math.sin(t / 20 + i)} />)}
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="#8A6A3E" />
          {[0, 1, 2].map((i) => <ellipse key={i} cx={180 + i * 360} cy={HORIZON + 160 + (i % 2) * 220} rx={130 + i * 20} ry={26 + i * 6} fill="#8A9AA0" opacity={0.45} stroke={INK} strokeWidth={3} />)}
          <Tufts seed={23} color="#4E6A30" n={34} />
          {[[W0 + 330, 1300, 1], [W1 - 330, 1180, -1]].map(([x, y, d], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${d} 1)`}>
              {[0, 1, 2].map((k) => <path key={k} d={`M 0 0 Q ${120 + k * 30} ${-200 - k * 60} ${260 + k * 20} ${-120 - k * 90} Q ${140 + k * 30} ${-60 - k * 30} 0 0 Z`} fill={k % 2 ? "#3E5E2E" : "#4A6E36"} stroke={INK} strokeWidth={5} />)}
            </g>
          ))}
          <Smoke t={t} x={820} y={HORIZON - 60} color="#C8CCC0" n={4} o={0.3} />
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-mud)" />
          <Vignette id={id} o={0.22} />
        </g>
      );
    case "ridge":
      return (
        <g>
          <Sky id={id} stops={["#6A5A9A", "#D08A78", "#FFC27A"]} />
          <Clouds t={t} y={240} color="#8E8680" n={3} speed={0.5} />
          <Hills seed={41} y={HORIZON - 110} amp={70} n={6} fill="#7E7466" />
          <Haze id={id} color="#C8B49A" />
          <Smoke t={t} x={820} y={HORIZON - 120} color="#5E5E64" n={6} o={0.35} />
          <Smoke t={t + 90} x={240} y={HORIZON - 100} color="#6A6A70" n={5} o={0.3} />
          <rect x={W0} y={HORIZON - 20} width={W1 - W0} height={1600} fill="#B49A72" stroke={INK} strokeWidth={5} />
          {/* limestone slabs, craters, a shattered stump */}
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${W0 + rnd(43, i) * (W1 - W0)} ${HORIZON + 60 + rnd(45, i) * 700} l ${80 + rnd(47, i) * 120} -10 l 30 30 l -${100 + rnd(49, i) * 80} 14 Z`} fill="#A49A82" stroke={INK} strokeWidth={4} />)}
          {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={120 + i * 290} cy={HORIZON + 130 + (i % 2) * 180} rx={110 + i * 10} ry={30 + i * 4} fill="#5E5644" stroke={INK} strokeWidth={4} />)}
          <path d={`M 940 ${HORIZON + 20} L 950 ${HORIZON - 160} L 970 ${HORIZON - 110} L 990 ${HORIZON - 190} L 1000 ${HORIZON + 20} Z`} fill="#4A3E32" stroke={INK} strokeWidth={5} />
          <Tufts seed={51} color="#6A6650" n={22} />
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-rock)" />
          <Vignette id={id} o={0.22} />
        </g>
      );
    case "cliff":
      return (
        <g>
          <Sky id={id} stops={["#4A8AD0", "#9EC4E6", "#DDE8EE"]} />
          <Clouds t={t} y={120} color="#C4C6C2" n={3} speed={0.4} />
          {/* the face: strata, cracks, ledges, scrub along the top */}
          <path d={`M ${W0} 1500 L ${W0} 250 Q 200 210 540 240 Q 900 220 ${W1} 250 L ${W1} 1500 Z`} fill="#C8B48C" stroke={INK} strokeWidth={6} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${W0} ${330 + i * 130} Q 540 ${310 + i * 132 + (i % 2) * 20} ${W1} ${336 + i * 128}`} stroke="#948A72" strokeWidth={6} fill="none" />)}
          {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M ${(i * 97) % 1080} ${300 + ((i * 173) % 1000)} l ${20 + (i % 3) * 16} ${60 + (i % 4) * 30} l -12 ${40 + (i % 3) * 20}`} stroke="#6E6450" strokeWidth={5} fill="none" />)}
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={W0 + 60 + i * 160} cy={236 - rnd(53, i) * 20} r={24 + rnd(55, i) * 20} fill="#5A6A40" stroke={INK} strokeWidth={4} />)}
          <rect x={W0} y={1480} width={W1 - W0} height={900} fill="#6E624C" stroke={INK} strokeWidth={5} />
          <Tufts seed={57} color="#5A5040" n={14} y0={1500} kind="stone" />
          <rect x={W0} y={1480} width={W1 - W0} height={1600} fill="url(#tex-rock)" />
          <Vignette id={id} o={0.2} />
        </g>
      );
    case "night":
      return (
        <g>
          <Sky id={id} stops={["#0E1838", "#1E3062", "#36508A"]} />
          {/* a flare drifting down, lighting the slope */}
          <Orb id={id} x={700 - t * 0.3} y={220 + t * 0.6} r={12} color="#FFF0B8" halo="#FFE08A" />
          <Hills seed={61} y={HORIZON - 80} amp={80} n={6} fill="#1E2434" />
          {[0, 1, 2].map((i) => (
            <g key={i} stroke={INK} strokeWidth={6} transform={`translate(${160 + i * 380} ${HORIZON - 30})`}>
              <path d="M 0 0 L -6 -200 M -6 -150 L -60 -210 M -4 -110 L 40 -170" stroke="#2A2420" strokeWidth={12} strokeLinecap="round" />
            </g>
          ))}
          <rect x={W0} y={HORIZON - 10} width={W1 - W0} height={1600} fill="#4E3E30" stroke={INK} strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={140 + i * 300} cy={HORIZON + 150 + (i % 2) * 170} rx={130} ry={34} fill="#261E18" stroke={INK} strokeWidth={4} />)}
          {[0, 1].map((i) => <ellipse key={i} cx={360 + i * 380} cy={HORIZON + 420 + i * 120} rx={150} ry={30} fill="#5A6478" opacity={0.35} />)}
          <Tufts seed={63} color="#4A4034" n={16} kind="stone" />
          {Array.from({ length: 50 }, (_, i) => <path key={i} d={`M ${((rnd(3, i) * 1300 + t * 6) % 1300) - 110} ${(rnd(5, i) * 1920 + t * 40) % 1920} l -10 40`} stroke="#9AA6B8" strokeWidth={2.5} opacity={0.5} />)}
          <rect x={W0} y={HORIZON} width={W1 - W0} height={1600} fill="url(#tex-mud)" />
          <Vignette id={id} o={0.3} />
        </g>
      );
  }
};

const Twinkle: React.FC<{ t: number; n?: number }> = ({ t, n = 28 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={rnd(13, i) * 1080} cy={rnd(17, i) * 560} r={2.5 + rnd(19, i) * 2} fill="#F2EEDC" opacity={0.3 + 0.7 * Math.abs(Math.sin(t / 9 + i * 1.7))} />
    ))}
  </g>
);
