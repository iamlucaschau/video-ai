/**
 * "How Submarines Actually Fight" (Formats/Naval Board/episodes/ep02-submarines): Naval Board #2, 16:9 explainer, about 8:52.
 * Facts: FACTS-submarines.md there. Cuts come from its shots.json on the voice's words
 * (node scripts/shotlist.mjs "Formats/Naval Board/episodes/ep02-submarines"); A(id) line start, E(id) line end, W(id, word) the frame a word is spoken.
 */
import { Audio, Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import PLAN from "../../../Formats/Naval Board/episodes/ep02-submarines/shots.json";
import TIMELINE from "../../../Formats/Naval Board/episodes/ep02-submarines/shots.timeline.json";
import timing from "../../voiceover/submarines.timing.json";
import WORDS from "../../voiceover/submarines.words.json";
import { MusicBed, Sfx } from "../../series/pvr/sfx";
import { getLength } from "@remotion/paths";
import { along, Blast, C, CLAMP, COND, ease, Heading, INTER, inOut, lin, Tag, Vignette } from "../Ambush/kit";
import { Carrier, Land, N, Sea, Sub, Warship } from "../Carrier/navkit";
import MAPS from "./maps.json";
import RENDERED from "./rendered3d.json";
import { Big, Board, Cutaway, Dial, Doc, Dot, Incoming, Label, Meter, OldSub, Pin, Pulse, ShipSide, Stamp, SubSide, Svg, Torp, U, Water, Waves } from "./subkit";

export const FPS = 30;
type L = { id: string; start: number; end: number; text: string; scene: string };
const LINES = timing.lines as L[];
const line = (id: string) => {
  const l = LINES.find((x) => x.id === id);
  if (!l) throw new Error(`No VO line ${id}`);
  return l;
};
const A = (id: string) => Math.round(line(id).start * FPS);
const E = (id: string) => Math.round(line(id).end * FPS);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const toks = (id: string) => line(id).text.split(/\s+/);
/** Frame where word `w` (prefix match, or index) of line `id` is spoken. */
const W = (id: string, w: string | number) => {
  const t = toks(id);
  const k = typeof w === "number" ? w : t.findIndex((x) => norm(x).startsWith(norm(w)));
  if (k < 0) throw new Error(`Word "${w}" not in line ${id}`);
  const heard = (WORDS as Record<string, number[]>)[id];
  if (!heard?.length) return Math.round(A(id) + ((E(id) - A(id)) * k) / t.length);
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / t.length))] * FPS);
};
const END_EXTRA = 5;
export const submarinesDuration = Math.ceil((timing.durationInSeconds + END_EXTRA) * FPS);
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

type P = { g: number };
const TOP = 130; // tags sit here, above the action and clear of the progress strip
const MapBase: React.FC<{ map: keyof typeof MAPS; children?: React.ReactNode; dim?: number; seed?: string }> = ({ map, children, dim = 0, seed }) => (
  <>
    <Sea seed={seed ?? map} flow={0.8} />
    <Land d={MAPS[map].d} />
    {children}
    {dim > 0 ? <rect x={-200} y={-200} width={2320} height={1480} fill="#02070c" opacity={dim} /> : null}
    <Vignette />
  </>
);
const pt = (map: keyof typeof MAPS, n: string) => (MAPS[map].pts as Record<string, number[]>)[n];

// ═════════════════════════ 1. Intro ═════════════════════════
const A02: React.FC<P> = ({ g }) => {
  const off = lin(g, W("08", "radar"), W("08", "seawater") + 6);
  return (
    <Svg>
      <Water surface={300} seed="a02" />
      <ShipSide x={520} y={300} />
      {[-34, -14, 8, 30].map((a, i) => {
        const r = 150;
        const b = ((a + 90) * Math.PI) / 180;
        return <line key={i} x1={520} y1={250} x2={520 + r * Math.cos(b)} y2={250 + r * Math.sin(b)} stroke={C.tracer} strokeWidth={5} opacity={0.2 + 0.7 * off * (0.6 + 0.4 * Math.sin(g / 5 + i))} />;
      })}
      <SubSide x={1180} y={720} s={1.5} />
      <Incoming g={g} x={1020} y={720} from={180} size={620} op={1 - off * 0.5} />
      <Tag x={520} y={TOP} text="RADAR" p={ease(g, W("08", "radar"), 10)} size={58} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const A03: React.FC<P> = ({ g }) => {
  const up = inOut(g, A("09"), W("09", "periscope") + 8);
  const y = mix(760, 372, up);
  const mast = ease(g, W("09", "periscope") - 6, 22) * 74;
  const seen = ease(g, W("09", "showing"), 12);
  return (
    <Svg>
      <Water surface={300} seed="a03" />
      <SubSide x={960} y={y} s={1.5} mast={mast / 1.5} />
      {seen > 0 ? <Waves g={g} x={996} y={298} at={W("09", "showing")} color={C.red} n={3} gap={70} speed={4} op={seen} /> : null}
      <Tag x={960} y={TOP} text="PERISCOPE" p={ease(g, W("09", "periscope"), 10)} size={58} />
      <Vignette />
    </Svg>
  );
};
const A04: React.FC<P> = ({ g }) => {
  const first = W("12", "first");
  const k = lin(g, A("10"), first);
  const r1 = 60 + k * 860;
  const r2 = 60 + k * 620;
  const won = ease(g, first, 10);
  return (
    <Svg>
      <Water seed="a04" dark={0.35} />
      <SubSide x={330} y={560} color={U.us} s={1.2} />
      <SubSide x={1590} y={560} color={U.foe} s={1.2} flip />
      <circle cx={1590} cy={560} r={r2} fill="none" stroke={U.foe} strokeWidth={4} opacity={0.7} />
      <circle cx={330} cy={560} r={r1} fill="none" stroke={U.sound} strokeWidth={5} opacity={0.85} />
      <Tag x={960} y={TOP} text="SOUND" p={ease(g, W("10", "sound"), 10)} out={ease(g, W("12", "whoever") - 6, 6)} size={60} color={U.sound} />
      <Big x={960} y={250} text="HEARS FIRST, WINS" p={won} size={108} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const ROAD: [string, React.FC<{ on: number }>][] = [
  ["THE OLD IDEA", ({ on }) => <path d="M -90 40 L 50 -20 M 50 -20 C 70 -40, 96 -20, 86 4" fill="none" stroke={on ? C.tracer : "#5c7180"} strokeWidth={10} strokeLinecap="round" />],
  ["TWO WAYS TO LISTEN", ({ on }) => <g fill="none" stroke={on ? U.sound : "#5c7180"} strokeWidth={8} strokeLinecap="round"><path d="M -30 -50 A 70 70 0 0 0 -30 50" /><path d="M -60 -30 A 40 40 0 0 0 -60 30" /><path d="M 30 -50 A 70 70 0 0 1 30 50" /><path d="M 60 -30 A 40 40 0 0 1 60 30" /></g>],
  ["STAYING HIDDEN", ({ on }) => <SubSide x={0} y={0} s={0.55} color={on ? U.us : "#5c7180"} />],
  ["CARRIERS + DRONES", ({ on }) => <g><rect x={-90} y={-20} width={170} height={22} fill={on ? "#8fa3b0" : "#3a4a55"} /><rect x={20} y={-44} width={26} height={24} fill={on ? "#8fa3b0" : "#3a4a55"} /><circle cx={-60} cy={52} r={14} fill={on ? C.red : "#3a4a55"} /></g>],
  ["DEADLY MISTAKES", ({ on }) => <path d="M -70 -60 L -10 -10 L -36 16 L 22 70 M -10 -10 L 56 -40" fill="none" stroke={on ? C.red : "#5c7180"} strokeWidth={10} strokeLinejoin="round" />],
];
const Road: React.FC<{ g: number; on: number; at: number; title?: boolean }> = ({ g, on, at, title }) => (
  <Svg>
    <Board />
    {title ? <Big x={960} y={260} text="HOW SUBMARINES FIGHT" p={ease(g, at, 14)} size={110} /> : null}
    {ROAD.map(([, Icon], i) => {
      const x = 960 + (i - 2) * 310;
      const lit = i <= on;
      const now = i === on;
      const k = now ? ease(g, at, 12) : lit ? 1 : 0;
      return (
        <g key={i} transform={`translate(${x} 540) scale(${0.86 * (1 + 0.1 * k * (now ? 1 : 0))})`}>
          <rect x={-150} y={-130} width={300} height={260} rx={12} fill={lit ? "rgba(13,34,48,0.95)" : "rgba(10,22,32,0.7)"} stroke={now ? (i === 4 ? C.red : C.tracer) : lit ? "#5c7180" : "#22333f"} strokeWidth={now ? 5 : 2} />
          <Icon on={lit ? 1 : 0} />
        </g>
      );
    })}
    {on >= 0 ? <Big x={960} y={830} text={ROAD[on][0]} p={ease(g, at, 12)} size={86} color={on === 4 ? C.red : C.text} /> : null}
    <Vignette />
  </Svg>
);
const A05: React.FC<P> = ({ g }) => <Road g={g} on={-1} at={A("13")} title />;
const A06: React.FC<P> = ({ g }) => <Road g={g} on={0} at={A("14")} />;
const A07: React.FC<P> = ({ g }) => <Road g={g} on={1} at={A("15")} />;
const A08: React.FC<P> = ({ g }) => <Road g={g} on={2} at={A("16")} />;
const A09: React.FC<P> = ({ g }) => <Road g={g} on={3} at={A("17")} />;
const A10: React.FC<P> = ({ g }) => <Road g={g} on={4} at={W("18", "deadly")} />;

// ═════════════════════════ 2. The oldest trick ═════════════════════════
const Paper: React.FC<{ children: React.ReactNode; waterY?: number }> = ({ children, waterY = 470 }) => {
  const f = useCurrentFrame();
  return (
    <>
      <rect x={-200} y={-200} width={2320} height={1480} fill={U.paper} />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#6b4f2a" opacity={0.14} />
      <path d={`M -200 ${waterY} ${Array.from({ length: 30 }).map((_, i) => `L ${-200 + i * 80} ${waterY + 5 * Math.sin(i * 1.2 + f / 22)}`).join(" ")}`} fill="none" stroke={U.ink} strokeWidth={4} />
      {[1, 2, 3, 4].map((i) => (
        <path key={i} d={`M -200 ${waterY + i * 70} ${Array.from({ length: 30 }).map((_, k) => `L ${-200 + k * 80} ${waterY + i * 70 + 3 * Math.sin(k * 1.4 + i + f / 30)}`).join(" ")}`} fill="none" stroke={U.ink} strokeWidth={1.5} opacity={0.3} />
      ))}
      {children}
    </>
  );
};
const InkBoat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={U.ink} strokeWidth={5} strokeLinecap="round">
    <path d="M -130 -36 C -90 16, 90 16, 130 -36 Z" fill={U.paper} />
    <line x1={0} y1={-20} x2={0} y2={-170} />
    <path d="M 0 -160 C 40 -130, 40 -80, 0 -50" />
  </g>
);
const B01: React.FC<P> = ({ g }) => (
  <Svg>
    <Paper>
      <InkBoat x={960} y={470} s={1.5} />
    </Paper>
    <Big x={420} y={300} text="1490" p={ease(g, W("20", "1490"), 12)} size={150} color={U.ink} halo="none" />
  </Svg>
);
const Tube: React.FC<{ p: number }> = ({ p }) => (
  <g fill="none" stroke={U.ink} strokeLinecap="round">
    <line x1={1120} y1={380} x2={mix(1120, 1120, 1)} y2={mix(380, 800, p)} strokeWidth={13} />
    <line x1={1120} y1={380} x2={1120} y2={mix(380, 800, p)} stroke={U.paper} strokeWidth={6} />
    {/* an ear at the top of the tube */}
    <path d="M 1102 330 C 1090 280, 1160 270, 1160 320 C 1160 345, 1132 346, 1132 372" strokeWidth={6} opacity={p} />
  </g>
);
const B02: React.FC<P> = ({ g }) => (
  <Svg>
    <Paper>
      <InkBoat x={960} y={470} s={1.5} />
      <Tube p={inOut(g, W("21", "tube") - 8, W("21", "water") + 6)} />
    </Paper>
  </Svg>
);
const B03: React.FC<P> = ({ g }) => (
  <Svg>
    <Paper>
      <InkBoat x={860} y={470} s={1} />
      <g transform="translate(-160 0)">
        <Tube p={1} />
      </g>
      {[1560, 1800].map((x, i) => (
        <InkBoat key={x} x={x} y={470} s={0.55 - i * 0.12} />
      ))}
      <Incoming g={g} x={960} y={780} from={345} span={40} color={U.ink} size={720} />
    </Paper>
  </Svg>
);
const B04: React.FC<P> = ({ g }) => {
  const k = inOut(g, A("23") + 2, A("23") + 34);
  return (
    <Svg>
      <Water seed="b04" />
      <SubSide x={840} y={560} s={2.1} />
      <ellipse cx={1140} cy={560} rx={34} ry={48} fill={U.sound} opacity={0.3 + 0.5 * k} />
      <Incoming g={g} x={1160} y={560} from={0} span={70} size={700} op={k} />
      <Vignette />
    </Svg>
  );
};
const SURF = 380;
const B05: React.FC<P> = ({ g }) => {
  const hit = W("25", "explosive");
  const k = inOut(g, A("24"), hit);
  const sx = 1160;
  return (
    <Svg>
      <Water surface={SURF} seed="b05" />
      <ShipSide x={sx} y={SURF} kind="sloop" s={1.5} />
      <g transform={`translate(${mix(240, 760, k)} ${SURF + 80})`}>
        <path d="M 110 0 C 110 -22, 70 -30, 40 -30 L -80 -30 C -110 -24, -130 -10, -130 0 C -130 12, -110 26, -80 30 L 40 30 C 70 30, 110 22, 110 0 Z" fill={U.hull} stroke={U.us} strokeWidth={3} />
        <rect x={-34} y={-46} width={30} height={18} fill={U.hull} stroke={U.us} strokeWidth={2.5} />
        <line x1={108} y1={-2} x2={290} y2={-34} stroke="#c7d2da" strokeWidth={5} />
      </g>
      <Blast g={g} x={sx - 90} y={SURF + 20} at={hit} s={1.6} />
      <Tag x={960} y={TOP} text="1864" p={ease(g, W("25", "17"), 10)} size={66} />
      <Vignette />
    </Svg>
  );
};
const B06: React.FC<P> = ({ g }) => {
  const k = lin(g, A("26") - 8, E("26") + 20);
  return (
    <Svg>
      <Water surface={SURF} seed="b05" />
      <ShipSide x={1160} y={SURF} kind="sloop" s={1.5} a={-k * 16} sink={k * 120} />
      <rect x={-200} y={SURF + 3} width={2320} height={0} />
      <Tag x={960} y={TOP} text="FIRST WARSHIP SUNK" p={ease(g, W("26", "first"), 10)} size={64} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const B07: React.FC<P> = ({ g }) => {
  const k = lin(g, A("27"), E("27"));
  return (
    <Svg>
      <Water seed="b07" dark={0.1 + 0.2 * k} />
      <g transform={`translate(960 ${mix(460, 620, k)})`} opacity={1 - k * 0.45}>
        <path d="M 110 0 C 110 -22, 70 -30, 40 -30 L -80 -30 C -110 -24, -130 -10, -130 0 C -130 12, -110 26, -80 30 L 40 30 C 70 30, 110 22, 110 0 Z" fill={U.hull} stroke={U.us} strokeWidth={3} />
      </g>
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={960 + (i - 3.5) * 54} cy={820} r={13} fill="#ffe2a8" opacity={ease(g, W("27", "eight"), 8) * (1 - lin(g, W("27", "eight") + 4 + i * 2, E("27") + 12))} />
      ))}
      <Vignette />
    </Svg>
  );
};
// three cruisers in line abreast steaming east, U-9 waits ahead
const CR = [
  { x: 980, y: 360 },
  { x: 980, y: 560 },
  { x: 980, y: 760 },
];
const U9 = { x: 1560, y: 500 };
const Cruisers: React.FC<{ g: number; dead: number[]; close?: number }> = ({ dead, close = 0 }) => (
  <>
    {CR.map((c, i) => (
      <Warship key={i} x={c.x + (dead[i] ? 0 : close * 90)} y={i === 0 ? c.y : mix(c.y, 400 + (i - 1) * 90, close && !dead[i] ? close : 0)} kind="cruiser" s={1.5} dead={dead[i]} color="#c3ccd3" wake={dead[i] ? 0 : 1} />
    ))}
  </>
);
const B08: React.FC<P> = ({ g }) => {
  const hit = W("29", "aboukir");
  return (
    <Svg>
      <Sea seed="b08" flow={0.7} />
      <Cruisers g={g} dead={[g > hit ? 1 : 0, 0, 0]} />
      <Sub x={U9.x} y={U9.y} a={190} s={1.6} color={C.red} depth={0.2} />
      <Label x={U9.x + 20} y={U9.y + 76} text="U-9" p={ease(g, W("29", "u-9"), 10)} color={C.red} size={46} />
      <Torp g={g} x1={U9.x - 40} y1={U9.y - 6} x2={CR[0].x + 60} y2={CR[0].y + 20} at={W("29", "put")} dur={hit - W("29", "put")} />
      <Blast g={g} x={CR[0].x + 40} y={CR[0].y + 10} at={hit} />
      <Tag x={960} y={TOP} text="22 SEP 1914" p={ease(g, W("29", "22"), 10)} size={58} />
      <Vignette />
    </Svg>
  );
};
const B09: React.FC<P> = ({ g }) => {
  const k = inOut(g, W("30", "closed") - 12, E("30") + 6);
  return (
    <Svg>
      <Sea seed="b08" flow={0.3} />
      <Warship x={CR[0].x} y={CR[0].y} kind="cruiser" s={1.5} dead={1} color="#c3ccd3" wake={0} />
      {[1, 2].map((i) => (
        <Warship key={i} x={mix(CR[i].x, 1090, k)} y={mix(CR[i].y, 300 + i * 150, k)} a={-16 * k} kind="cruiser" s={1.5} color="#c3ccd3" />
      ))}
      <Sub x={U9.x} y={U9.y} a={190} s={1.4} color={C.red} depth={0.6} />
      <Big x={CR[0].x} y={250} text="MINE?" p={ease(g, W("30", "mine"), 10)} size={90} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const B10: React.FC<P> = ({ g }) => {
  const a = A("31") + 4;
  const b = E("31");
  return (
    <Svg>
      <Sea seed="b08" flow={0.1} />
      <Warship x={CR[0].x} y={CR[0].y} kind="cruiser" s={1.5} dead={1} color="#c3ccd3" wake={0} />
      {[1, 2].map((i) => (
        <Warship key={i} x={1090} y={300 + i * 150} a={-16} kind="cruiser" s={1.5} color="#c3ccd3" dead={g > (i === 1 ? b - 12 : b + 10) ? 1 : 0} wake={0} />
      ))}
      <Sub x={U9.x} y={U9.y} a={190} s={1.4} color={C.red} depth={0.6} />
      <Torp g={g} x1={U9.x - 40} y1={U9.y} x2={1180} y2={450} at={a} dur={b - 12 - a} />
      <Torp g={g} x1={U9.x - 40} y1={U9.y + 6} x2={1180} y2={600} at={a + 8} dur={b + 10 - a - 8} />
      <Blast g={g} x={1170} y={450} at={b - 12} />
      <Blast g={g} x={1170} y={600} at={b + 10} />
      <Vignette />
    </Svg>
  );
};
const B11: React.FC<P> = ({ g }) => (
  <Svg>
    <Sea seed="b08" flow={0.05} tint="#071b2d" night={0.8} />
    {[0, 1, 2].map((i) => (
      <g key={i} opacity={ease(g, A("32") + i * 6, 10)}>
        <Warship x={520 + i * 440} y={420} kind="cruiser" s={1.6} dead={1} color="#c3ccd3" wake={0} />
      </g>
    ))}
    <Big x={560} y={760} text="~1 HOUR" p={ease(g, W("32", "hour") - 6, 10)} size={96} color={C.tracer} />
    <Big x={1360} y={760} text="~1,400 LOST" p={ease(g, W("32", "1,400"), 10)} size={96} color={C.text} />
    <Vignette />
  </Svg>
);
const B12: React.FC<P> = ({ g }) => {
  const k = lin(g, W("34", "best") - 14, E("34"));
  return (
    <Svg>
      <Sea seed="b08" flow={0.05} tint="#071b2d" night={1} />
      <Warship x={CR[0].x} y={CR[0].y} kind="cruiser" s={1.5} dead={1} color="#8e979e" wake={0} />
      {[1, 2].map((i) => (
        <Warship key={i} x={1090} y={300 + i * 150} a={-16} kind="cruiser" s={1.5} color="#8e979e" dead={1} wake={0} />
      ))}
      <Sub x={U9.x} y={U9.y} a={190} s={1.4} color={C.red} depth={0.3} />
      <path d={`M ${CR[1].x} ${CR[1].y} L ${mix(CR[1].x, U9.x - 60, k)} ${mix(CR[1].y, U9.y, k)}`} stroke={C.tracer} strokeWidth={6} strokeDasharray="20 14" />
      <path d={`M ${CR[2].x} ${CR[2].y} L ${mix(CR[2].x, U9.x - 60, k)} ${mix(CR[2].y, U9.y + 20, k)}`} stroke={C.tracer} strokeWidth={6} strokeDasharray="20 14" />
      <circle cx={U9.x} cy={U9.y} r={120 + 6 * Math.sin(g / 8)} fill="none" stroke={C.red} strokeWidth={5} opacity={ease(g, A("34"), 14)} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 3. How far sound goes ═════════════════════════
const Ruler: React.FC<{ x?: number; y0?: number; y1?: number }> = ({ x = 110, y0 = 300, y1 = 980 }) => (
  <g>
    <line x1={x} y1={y0} x2={x} y2={y1} stroke="#9fc4d8" strokeWidth={3} />
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={x} y1={y0 + (i * (y1 - y0)) / 7} x2={x + (i % 2 ? 16 : 30)} y2={y0 + (i * (y1 - y0)) / 7} stroke="#9fc4d8" strokeWidth={3} />
    ))}
  </g>
);
const C01: React.FC<P> = ({ g }) => (
  <Svg>
    <Water surface={240} floor={960} seed="c01" />
    <Ruler y0={240} y1={960} />
    <SubSide x={mix(700, 860, lin(g, A("35") - 10, A("36")))} y={620} s={1.3} />
    <Incoming g={g} x={1040} y={620} from={350} span={60} />
    <Vignette />
  </Svg>
);
const C02: React.FC<P> = ({ g }) => {
  const k = lin(g, W("36", "sound"), A("37") + 34);
  return (
    <Svg>
      <Board />
      <Label x={220} y={390} text="WATER" anchor="start" size={58} color={U.sound} />
      <rect x={220} y={420} width={1480} height={46} rx={8} fill="rgba(255,255,255,0.07)" />
      <rect x={220} y={420} width={1480 * k} height={46} rx={8} fill={U.sound} />
      <Label x={220} y={650} text="AIR" anchor="start" size={58} color="#c3ccd3" />
      <rect x={220} y={680} width={1480} height={46} rx={8} fill="rgba(255,255,255,0.07)" />
      <rect x={220} y={680} width={(1480 * k) / 4.4} height={46} rx={8} fill="#c3ccd3" />
      <Tag x={700} y={TOP + 60} text="~1,500 M/S" p={ease(g, W("36", "1,500"), 10)} size={66} color={U.sound} />
      <Tag x={1320} y={TOP + 60} text="4× AIR" p={ease(g, W("37", "four"), 10)} size={66} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const RAYS = [
  { dip: 660, ph: 0, op: 1 },
  { dip: 590, ph: 0, op: 0.45 },
  { dip: 730, ph: 0, op: 0.45 },
];
const rayPath = (dip: number, x0 = 170, y0 = 250, step = 560) => {
  let d = `M ${x0} ${y0}`;
  for (let i = 0; i < 4; i++) {
    const a = x0 + i * step;
    d += ` C ${a + step * 0.3} ${y0 + dip}, ${a + step * 0.7} ${y0 + dip}, ${a + step} ${y0}`;
  }
  return d;
};
const C03: React.FC<P> = ({ g }) => {
  const k = lin(g, W("39", "bends"), W("39", "several"));
  const brk = ease(g, W("39", "30"), 10);
  return (
    <Svg>
      <Water surface={250} floor={1010} seed="c03" />
      <ShipSide x={170} y={250} s={0.8} />
      {RAYS.map((r, i) => (
        <path key={i} d={rayPath(r.dip)} fill="none" stroke={U.sound} strokeWidth={i === 0 ? 6 : 3} opacity={r.op} pathLength={1} strokeDasharray={`${k} 1`} />
      ))}
      {[730, 1290, 1850].map((x, i) => (
        <circle key={x} cx={x} cy={250} r={12} fill={C.tracer} opacity={k > (i + 1) * 0.25 ? 1 : 0} />
      ))}
      <g opacity={brk}>
        <path d="M 170 205 L 170 185 L 730 185 L 730 205" fill="none" stroke={C.tracer} strokeWidth={5} />
      </g>
      <Tag x={450} y={TOP - 10} text="~30 MILES" p={brk} size={60} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const C04: React.FC<P> = ({ g }) => {
  const a = W("41", "water");
  const b = W("41", "speed");
  const c = W("41", "target");
  const r = 200 + 150 * inOut(g, a - 6, a + 10) - 110 * inOut(g, b - 6, b + 10) + 180 * inOut(g, c - 6, c + 10) + 14 * Math.sin(g / 9);
  const wob = (t: number) => r * (1 + 0.17 * Math.sin(t * 3 + g / 24) + 0.09 * Math.sin(t * 7 - g / 18));
  const d = Array.from({ length: 60 }).map((_, i) => {
    const t = (i / 60) * Math.PI * 2;
    return `${i ? "L" : "M"} ${960 + wob(t) * Math.cos(t)} ${560 + wob(t) * 0.78 * Math.sin(t)}`;
  }).join(" ");
  return (
    <Svg>
      <Sea seed="c04" flow={0.3} night={0.9} />
      <path d={`${d} Z`} fill="rgba(127,227,208,0.09)" stroke={U.sound} strokeWidth={5} />
      <Sub x={960} y={560} s={1.4} />
      <Tag x={960} y={TOP} text="NO SINGLE NUMBER" p={ease(g, W("40", "one"), 10)} size={62} color={C.tracer} />
      <Label x={360} y={850} text="WATER" p={ease(g, a, 10)} size={60} color={U.sound} />
      <Label x={960} y={930} text="SPEED" p={ease(g, b, 10)} size={60} color={U.sound} />
      <Label x={1560} y={850} text="TARGET" p={ease(g, c, 10)} size={60} color={U.sound} />
      <Vignette />
    </Svg>
  );
};
const ARR = (() => {
  const [nx, ny] = pt("atlantic", "nova");
  const [bx, by] = pt("atlantic", "barbados");
  const [mx, my] = pt("atlantic", "mid");
  return { d: `M ${nx + 70} ${ny + 30} C ${mx + 200} ${my - 160}, ${mx + 260} ${my + 120}, ${bx + 70} ${by - 20}`, nx, ny, bx, by, mx, my };
})();
const Array3: React.FC<{ k: number; g: number; ring?: number }> = ({ k, g, ring = 0 }) => (
  <>
    <path d={ARR.d} fill="none" stroke={U.sound} strokeWidth={6} pathLength={1} strokeDasharray={`${k} 1`} />
    {Array.from({ length: 9 }).map((_, i) => {
      const t = (i + 0.5) / 9;
      const x = (1 - t) ** 3 * (ARR.nx + 70) + 3 * (1 - t) ** 2 * t * (ARR.mx + 200) + 3 * (1 - t) * t * t * (ARR.mx + 260) + t ** 3 * (ARR.bx + 70);
      const y = (1 - t) ** 3 * (ARR.ny + 30) + 3 * (1 - t) ** 2 * t * (ARR.my - 160) + 3 * (1 - t) * t * t * (ARR.my + 120) + t ** 3 * (ARR.by - 20);
      if (t > k) return null;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={9} fill={U.sound} />
          {i % 3 === 1 ? <line x1={x} y1={y} x2={x - 260} y2={y - 20} stroke={U.sound} strokeWidth={2} strokeDasharray="6 8" opacity={0.7} /> : null}
          {ring > 0 ? <Waves g={g + i * 7} x={x} y={y} n={2} gap={120} speed={2.2} max={240} op={ring} /> : null}
        </g>
      );
    })}
  </>
);
const C05: React.FC<P> = ({ g }) => (
  <Svg>
    <MapBase map="atlantic">
      <Array3 g={g} k={lin(g, W("44", "laid"), W("45", "barbados") + 10)} />
      <Pin g={g} x={ARR.nx} y={ARR.ny} p={ease(g, W("45", "nova"), 10)} label="NOVA SCOTIA" side="left" color={U.sound} />
      <Pin g={g} x={ARR.bx} y={ARR.by} p={ease(g, W("45", "barbados"), 10)} label="BARBADOS" side="left" color={U.sound} />
    </MapBase>
  </Svg>
);
const C06: React.FC<P> = ({ g }) => (
  <Svg>
    <MapBase map="atlantic">
      <Array3 g={g} k={1} ring={ease(g, A("46") - 4, 12)} />
    </MapBase>
  </Svg>
);

// ═════════════════════════ 4. Two ways to listen ═════════════════════════
const D01: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="d01" />
    <line x1={960} y1={-100} x2={960} y2={1180} stroke="#9fc4d8" strokeWidth={4} opacity={0.5} />
    <SubSide x={500} y={560} s={1.1} />
    <Incoming g={g} x={380} y={560} from={180} size={420} />
    <SubSide x={1420} y={560} s={1.1} />
    <Waves g={g} x={1420} y={560} at={A("47") + 14} n={3} gap={140} speed={4} max={480} />
    <Vignette />
  </Svg>
);
const D02: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="d02" />
    <SubSide x={1180} y={600} s={1.7} />
    <Incoming g={g} x={940} y={600} from={180} span={70} size={760} />
    <Tag x={960} y={TOP} text="PASSIVE" p={ease(g, W("48", "passive"), 10)} size={70} color={U.sound} />
    <Vignette />
  </Svg>
);
const D03: React.FC<P> = ({ g }) => {
  const at = W("49", "and") - 2; // the ping sits at the end of "pulse", not on the words
  return (
    <Svg>
      <Water seed="d03" />
      <SubSide x={420} y={600} s={1.5} />
      <SubSide x={1540} y={600} s={1.1} color={U.foe} flip op={0.7 + 0.3 * ease(g, at + 34, 8)} />
      <Pulse g={g} x1={640} y1={600} x2={1400} y2={600} at={at} dur={34} />
      <Tag x={960} y={TOP} text="ACTIVE" p={ease(g, W("49", "active"), 10)} size={70} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const D04: React.FC<P> = ({ g }) => {
  const at = W("50", "about") - 3;
  return (
    <Svg>
      <Water surface={360} seed="d04" />
      <ShipSide x={360} y={360} kind="motor" s={1.5} />
      <path d="M 1380 360 L 1460 210 L 1560 270 L 1660 170 L 1760 360 L 1820 620 L 1560 780 L 1340 600 Z" fill="#d6eef6" stroke="#fff" strokeWidth={4} opacity={0.92} />
      <Pulse g={g} x1={420} y1={420} x2={1340} y2={520} at={at} dur={34} />
      <Tag x={760} y={TOP + 40} text="1914" p={ease(g, W("50", "1914"), 10)} size={66} />
      <Tag x={1180} y={TOP + 40} text="~2 MILES" p={ease(g, W("50", "two"), 10)} size={66} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const D05: React.FC<P> = ({ g }) => {
  const a = -18 + 26 * inOut(g, A("51"), E("51") + 10);
  const rad = (a * Math.PI) / 180;
  const x = 300 + 1500 * Math.cos(rad);
  const y = 620 + 1500 * Math.sin(rad);
  return (
    <Svg>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#04070a" />
      {[420, 760, 1120, 1460].map((rx) => (
        <rect key={rx} x={rx} y={600} width={140} height={260} fill="#141b20" />
      ))}
      <path d={`M 320 620 L ${x - 300 * Math.sin(rad)} ${y - 420} L ${x + 300 * Math.sin(rad)} ${y + 420} Z`} fill="#fff5c4" opacity={0.38} />
      <rect x={210} y={600} width={110} height={40} rx={8} fill="#7d8b95" />
      <Vignette />
    </Svg>
  );
};
const D07: React.FC<P> = ({ g }) => {
  const fade = 1 - lin(g, W("54", "passive"), W("54", "quiet") + 10);
  return (
    <Svg>
      <Board tint="#04100a" />
      <circle cx={960} cy={570} r={350} fill="rgba(45,120,80,0.1)" stroke="#59d08a" strokeWidth={4} />
      {[120, 235].map((r) => (
        <circle key={r} cx={960} cy={570} r={r} fill="none" stroke="#59d08a" strokeWidth={2} opacity={0.4} />
      ))}
      <line x1={960} y1={570} x2={960 + 350 * Math.cos(g / 22)} y2={570 + 350 * Math.sin(g / 22)} stroke="#59d08a" strokeWidth={4} opacity={0.8} />
      <Dot x={1130} y={430} r={14} color="#ffd24a" op={fade} />
      <Tag x={520} y={TOP + 20} text="US NAVY" p={ease(g, W("54", "navy"), 10)} size={56} />
      <Tag x={1290} y={TOP + 20} text="NO LONGER ENOUGH" p={ease(g, W("54", "longer"), 10)} size={56} color={C.red} />
      <Vignette />
    </Svg>
  );
};
const D08: React.FC<P> = ({ g }) => {
  const at = W("55", "and") - 4;
  const red = ease(g, W("55", "gives"), 10);
  return (
    <Svg>
      <Sea seed="d08" flow={0.25} night={0.8} />
      <Sub x={1360} y={420} s={1.5} color={U.foe} depth={1} a={200} />
      <Warship x={560} y={640} s={1.6} />
      <circle cx={560} cy={640} r={lin(g, at, at + 70) * 900} fill="none" stroke={red > 0 ? C.red : U.sound} strokeWidth={7} opacity={g > at ? 1 - lin(g, at + 40, at + 80) * 0.7 : 0} />
      {red > 0 ? <circle cx={560} cy={640} r={190 + 8 * Math.sin(g / 7)} fill="none" stroke={C.red} strokeWidth={6} opacity={red} /> : null}
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 5. Noise is everything ═════════════════════════
const E01: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="e01" />
    <SubSide x={820} y={560} s={2.1} />
    <Waves g={g} x={820} y={560} at={A("56")} n={3} gap={150} speed={1.6} max={460} op={0.6} />
    <Meter x={1600} y={840} v={0.25} label="NOISE" />
    <Vignette />
  </Svg>
);
const E02: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="e01" />
    <Cutaway x={800} y={560} s={0.85} machinery={ease(g, W("57", "machinery"), 10)} />
    <Waves g={g} x={500} y={560} at={W("57", "machinery")} n={3} gap={120} speed={2.2} max={420} color={C.red} op={0.7} />
    <Meter x={1680} y={840} v={0.25 + 0.2 * ease(g, W("57", "noise"), 14)} label="NOISE" />
    <Vignette />
  </Svg>
);
const E04: React.FC<P> = ({ g }) => {
  const k = lin(g, A("61"), E("61"));
  return (
    <Svg>
      <Water surface={250} floor={970} seed="e04" />
      <rect x={-200} y={210} width={700} height={70} fill="#3a4a55" />
      <rect x={40} y={280} width={26} height={700} fill="#2a3842" />
      <rect x={360} y={280} width={26} height={700} fill="#2a3842" />
      <SubSide x={240} y={330} s={0.95} color="#c3ccd3" />
      <SubSide x={mix(940, 1260, k)} y={650} s={1.15} />
      <Meter x={190} y={920} h={260} v={0.42} />
      <Meter x={1740} y={840} h={260} v={0.36} />
      <Tag x={1270} y={TOP - 10} text="25 KN" p={ease(g, W("61", "25"), 10)} size={60} color={C.tracer} />
      <Tag x={800} y={TOP - 10} text="BUILDER'S CLAIM" p={ease(g, W("61", "builder"), 10)} size={56} color={C.muted} />
      <Vignette />
    </Svg>
  );
};
const E05: React.FC<P> = ({ g }) => {
  const at = A("62");
  const own = lin(g, W("62", "deaf") - 14, W("62", "sonar"));
  return (
    <Svg>
      <Water seed="e05" />
      <SubSide x={460} y={570} s={1.5} />
      <SubSide x={1640} y={570} s={0.8} color={U.foe} flip op={1 - own * 0.7} />
      <Incoming g={g} x={720} y={570} from={0} span={40} size={760} color={U.sound} op={1 - own} />
      <circle cx={460} cy={570} r={200 + own * 700 + 8 * Math.sin(g / 5)} fill={C.red} opacity={0.14} />
      <Waves g={g} x={460} y={570} at={at} n={6} gap={110} speed={5} max={900} color={C.red} op={0.5 + own * 0.5} />
      <Tag x={960} y={TOP} text="LOUD + DEAF" p={ease(g, W("62", "deaf"), 10)} size={68} color={C.red} />
      <Vignette />
    </Svg>
  );
};
const Propeller: React.FC<{ x: number; y: number; r?: number; k?: number; color?: string }> = ({ x, y, r = 170, k = 1, color = "#c7d2da" }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <g key={i} transform={`rotate(${(i * 360) / 7})`} opacity={i / 7 <= k ? 1 : 0.15}>
        <path d={`M 18 -14 C ${r * 0.5} -${r * 0.42}, ${r} -${r * 0.34}, ${r} -${r * 0.06} C ${r * 0.8} ${r * 0.12}, ${r * 0.34} ${r * 0.08}, 18 14 Z`} fill={color} stroke="#51606b" strokeWidth={2} />
      </g>
    ))}
    <circle r={32} fill="#6d7c87" />
  </g>
);
const E06: React.FC<P> = ({ g }) => {
  const k = lin(g, W("66", "1987"), E("66"));
  const a = (k * 6.28).toFixed(3);
  return (
    <Svg>
      <Board />
      <Propeller x={960} y={580} r={270} k={k} />
      <g transform={`translate(${960 + 210 * Math.cos(+a)} ${580 + 210 * Math.sin(+a) - 150})`}>
        <rect x={-14} y={-170} width={28} height={150} fill="#9aa8b3" />
        <path d={`M -14 -20 L 14 -20 L ${3 * Math.sin(g)} 16 Z`} fill={C.tracer} />
      </g>
      <Tag x={960} y={TOP} text="1987" p={ease(g, W("66", "1987"), 10)} size={70} />
      <Vignette />
    </Svg>
  );
};
const E07: React.FC<P> = ({ g }) => {
  const k = inOut(g, A("67"), W("67", "track"));
  const q = ease(g, W("68", "disputed"), 10);
  return (
    <Svg>
      <Sea seed="e07" flow={0.25} night={0.7} />
      <Sub x={560} y={570} s={1.4} />
      <Sub x={1350} y={570} s={1.4} color={U.foe} a={180} depth={mix(0.3, 1, k)} />
      <circle cx={560} cy={570} r={mix(860, 500, k)} fill="rgba(127,227,208,0.07)" stroke={U.sound} strokeWidth={5} />
      <Big x={1350} y={430} text="?" p={q} size={160} color={C.tracer} />
      <Tag x={960} y={TOP} text="DISPUTED" p={q} size={68} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const E08: React.FC<P> = ({ g }) => {
  const v = inOut(g, W("70", "more") - 6, W("70", "knots") + 8) * 25;
  const d = inOut(g, A("71") - 2, A("71") + 24);
  const cls = ease(g, E("72") - 8, 8);
  return (
    <Svg>
      <Board />
      <Dial x={560} y={680} r={340} v={v} max={35} step={5} />
      <rect x={560 - 300} y={260} width={0} height={0} />
      <g>
        <rect x={1240} y={230} width={140} height={720} fill="#0a1a25" stroke="#5f7d8f" strokeWidth={4} />
        <rect x={1240} y={230} width={140} height={d * 360} fill="#1f7fa8" opacity={0.7} />
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={i} x1={1240} y1={230 + i * 60} x2={i % 3 ? 1266 : 1290} y2={230 + i * 60} stroke="#cfe2ee" strokeWidth={3} />
        ))}
        <rect x={1240} y={590} width={140} height={360} fill="#000" opacity={cls * 0.9} />
      </g>
      <Label x={1420} y={606} text="800+ FT" p={ease(g, A("71"), 10)} anchor="start" size={66} color={C.tracer} />
      <Label x={560} y={820} text="25+ KN" p={ease(g, W("70", "25"), 10)} size={66} color={C.tracer} />
      <Stamp x={960} y={320} text="CLASSIFIED" p={cls} size={92} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 6. Staying down ═════════════════════════
const F01: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="f01" />
    <Cutaway x={960} y={560} s={1.05} tint={ease(g, W("73", "ballast"), 12)} />
    <Label x={1500} y={800} text="BALLAST" p={ease(g, W("73", "ballast"), 10)} size={56} color={U.sound} />
    <Label x={360} y={800} text="BALLAST" p={ease(g, W("73", "ballast"), 10)} size={56} color={U.sound} />
    <Vignette />
  </Svg>
);
const AirArrows: React.FC<{ g: number; p: number }> = ({ g, p }) =>
  p > 0 ? (
    <g opacity={p}>
      {[1400, 1520, 1600, 300, 380].map((x, i) => {
        const y = 660 + ((-(g * 6 + i * 40)) % 180);
        return <circle key={i} cx={x} cy={y} r={11} fill="#d8f2ff" opacity={0.85} />;
      })}
    </g>
  ) : null;
const F03: React.FC<P> = ({ g }) => {
  const k = inOut(g, W("75", "compressed") - 4, E("75") + 10);
  return (
    <Svg>
      <Water surface={100} seed="f03" />
      <g transform={`translate(0 ${mix(120, 40, k)})`}>
        <Cutaway x={960} y={560} s={1.05} tanks={1 - k} tint={1} />
        <AirArrows g={g} p={1 - k * 0.2} />
      </g>
      <Vignette />
    </Svg>
  );
};
const F04: React.FC<P> = ({ g }) => {
  const k = inOut(g, A("76"), A("76") + 26);
  return (
    <Svg>
      <Water surface={100} seed="f03" />
      <g transform={`translate(0 ${mix(250, -60, k)}) rotate(${-3 * k} 960 560)`}>
        <Cutaway x={960} y={560} s={1.05} tanks={1 - k} tint={1} />
        <AirArrows g={g * 3} p={1} />
      </g>
      <Tag x={960} y={TOP + 720} text="EMERGENCY BLOW" p={ease(g, W("76", "emergency"), 10)} size={72} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const F05: React.FC<P> = ({ g }) => {
  const r = ease(g, W("79", "reactor"), 12);
  const o = ease(g, W("80", "oxygen"), 12);
  return (
    <Svg>
      <Water seed="f05" />
      <Cutaway x={960} y={520} s={1.05} reactor={r} />
      {o > 0
        ? Array.from({ length: 8 }).map((_, i) => {
            const y = 520 + ((-(g * 1.6 + i * 22)) % 150);
            return <circle key={i} cx={1150 + i * 34} cy={y} r={11 + (i % 3) * 3} fill="#b4f5e4" opacity={0.75 * o} />;
          })
        : null}
      <Big x={1290} y={780} text="O₂" p={o} size={110} color="#b4f5e4" />
      <Vignette />
    </Svg>
  );
};
const F06: React.FC<P> = ({ g }) => {
  const k = lin(g, W("82", "food"), E("82") + 18);
  return (
    <Svg>
      <Board />
      {[0, 1, 2].map((row) =>
        Array.from({ length: 14 }).map((_, i) => (
          <rect key={`${row}${i}`} x={330 + i * 90} y={320 + row * 150} width={72} height={110} rx={6} fill={(row * 14 + i) / 42 >= k ? "#c9a56a" : "rgba(255,255,255,0.05)"} stroke="#6b5635" strokeWidth={2} />
        )),
      )}
      <Big x={960} y={880} text="~90 DAYS" p={ease(g, W("82", "90"), 10)} size={110} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const F08: React.FC<P> = ({ g }) => {
  const m = 1 - inOut(g, W("86", "needs") - 8, W("86", "needs") + 16);
  const on = ease(g, W("86", "extra"), 10);
  return (
    <Svg>
      <Water surface={250} seed="f08" />
      <SubSide x={960} y={560} s={2.2} mast={m * 120} />
      <circle cx={660} cy={565} r={36} fill={C.tracer} opacity={on * (0.55 + 0.3 * Math.sin(g / 6))} />
      <Label x={660} y={680} text="EXTRA ENGINE" p={on} size={46} color={C.tracer} />
      <Tag x={960} y={TOP} text="~2 WEEKS" p={ease(g, W("86", "two"), 10)} size={66} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 7. The modern hunt ═════════════════════════
const GROUP: [number, number, "cruiser" | "destroyer"][] = [
  [1450, 480, "cruiser"],
  [560, 340, "destroyer"],
  [600, 790, "destroyer"],
  [1240, 860, "destroyer"],
];
const Group: React.FC<{ g: number }> = ({ g }) => (
  <>
    <Sea seed="grp" flow={1} />
    {GROUP.map(([x, y, k], i) => (
      <Warship key={i} x={x + 4 * Math.sin(g / 90 + i)} y={y + 5 * Math.sin(g / 70 + i)} kind={k} s={1.25} />
    ))}
    <Carrier x={960} y={560} s={1.05} />
  </>
);
const G02: React.FC<P> = ({ g }) => {
  const q = ease(g, A("89"), 12);
  const hunt = ease(g, A("90") - 4, 14);
  return (
    <Svg>
      <Group g={g} />
      {[
        [1620, 720],
        [300, 560],
        [1040, 200],
      ].map(([x, y], i) => (
        <g key={i} opacity={q * (1 - hunt) * (0.5 + 0.5 * Math.sin(g / 8 + i * 2))}>
          <Sub x={x} y={y} s={1.1} depth={1} />
          <Label x={x} y={y - 34} text="?" size={60} color={C.tracer} />
        </g>
      ))}
      <g opacity={hunt}>
        <Sub x={1620} y={760} s={1.2} a={-20} />
        <Sub x={1780} y={620} s={1.2} a={150} color={U.foe} depth={0.8} />
        <Waves g={g} x={1620} y={760} n={3} gap={80} speed={3} max={240} />
      </g>
      <Vignette />
    </Svg>
  );
};
const GOT = "M 120 960 C 360 880, 330 640, 500 590 C 660 540, 720 720, 860 720";
const G03: React.FC<P> = ({ g }) => {
  const k = lin(g, W("92", "gotland"), E("92"));
  const pos = along(GOT, k * getLength(GOT));
  return (
    <Svg>
      <Group g={g} />
      <path d={GOT} fill="none" stroke={C.tracer} strokeWidth={5} pathLength={1} strokeDasharray={`${k} 1`} opacity={0.9} />
      <Sub x={pos.x} y={pos.y} s={0.9} color={C.tracer} depth={0.2} a={pos.a} />
      <Tag x={700} y={TOP} text="GOTLAND" p={ease(g, W("92", "gotland"), 10)} size={58} color={C.tracer} />
      <Tag x={1170} y={TOP} text="EXERCISE" p={ease(g, W("92", "exercise") - 2, 10)} size={58} />
      <Vignette />
    </Svg>
  );
};
const G05: React.FC<P> = ({ g }) => {
  const [x, y] = pt("southatl", "belgrano");
  return (
    <Svg>
      <MapBase map="southatl">
        <Pin g={g} x={x} y={y} p={ease(g, A("95") + 6, 10)} />
      </MapBase>
      <Tag x={960} y={TOP} text="2 MAY 1982" p={ease(g, A("95"), 12)} size={62} />
    </Svg>
  );
};
const G07: React.FC<P> = ({ g }) => {
  const k = lin(g, A("98") - 6, A("99") + 110);
  return (
    <Svg>
      <Sea seed="g07" flow={0.3} night={0.6} />
      <Warship x={960} y={560} kind="cruiser" s={1.8} dead={1} color="#c3ccd3" wake={0} />
      {[-1, 1].map((sgn) => (
        <Warship key={sgn} x={mix(760, 1710, k)} y={560 + sgn * 240} s={1.4} color="#c3ccd3" />
      ))}
      <Tag x={960} y={TOP} text="2ND SINCE WWII" p={ease(g, W("99", "second"), 10)} size={62} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const G08: React.FC<P> = ({ g }) => {
  const [x, y] = pt("srilanka", "dena");
  const k = lin(g, W("101", "torpedoed") - 40, W("101", "sank"));
  return (
    <Svg>
      <MapBase map="srilanka">
        <path d={`M ${x - 340} ${y - 200} L ${mix(x - 340, x, k)} ${mix(y - 200, y, k)}`} stroke="#c3ccd3" strokeWidth={4} strokeDasharray="14 12" />
        <Dot x={mix(x - 340, x, k)} y={mix(y - 200, y, k)} r={11} color="#c3ccd3" op={1 - ease(g, W("101", "sank") + 4, 8)} />
        <Pin g={g} x={x} y={y} p={ease(g, W("101", "sank"), 10)} color={C.red} />
      </MapBase>
      <Tag x={960} y={TOP} text="4 MAR 2026" p={ease(g, W("101", "4"), 10)} size={62} />
    </Svg>
  );
};
const G09: React.FC<P> = ({ g }) => {
  const [x, y] = pt("srilanka", "dena");
  return (
    <Svg>
      <MapBase map="srilanka" dim={0.35}>
        <Pin g={g} x={x} y={y} color={C.muted} />
      </MapBase>
      <Tag x={960} y={TOP} text="32 RESCUED" p={ease(g, W("102", "32"), 12)} out={ease(g, A("104") - 6, 8)} size={60} />
      <Tag x={960} y={TOP} text="FIRST US KILL: REPORTED" p={ease(g, A("104"), 12)} size={56} color={C.muted} />
    </Svg>
  );
};
const G10: React.FC<P> = ({ g }) => {
  const [x, y] = pt("blacksea", "novo");
  return (
    <Svg>
      <MapBase map="blacksea">
        <Pin g={g} x={x} y={y} p={ease(g, W("106", "novorossiysk") - 6, 10)} side="left" label="NOVOROSSIYSK" />
      </MapBase>
      <Tag x={960} y={TOP} text="UKRAINE CLAIMS A HIT" p={ease(g, W("106", "ukraine"), 10)} size={58} color={C.tracer} />
    </Svg>
  );
};
const G11: React.FC<P> = ({ g }) => {
  const [x, y] = pt("blacksea", "novo");
  return (
    <Svg>
      <MapBase map="blacksea" dim={0.25}>
        <Pin g={g} x={x} y={y} />
      </MapBase>
      <Tag x={600} y={TOP + 60} text="RUSSIA: NO DAMAGE" p={ease(g, W("107", "russia"), 10)} size={58} color="#c3ccd3" />
      <Tag x={1320} y={TOP + 60} text="UK: LIKELY DAMAGE" p={ease(g, W("108", "british"), 10)} size={58} color={C.tracer} />
    </Svg>
  );
};
const G12: React.FC<P> = ({ g }) => {
  const k = lin(g, A("109"), E("109"));
  return (
    <Svg>
      <Water surface={300} floor={950} seed="g12" />
      <rect x={-200} y={260} width={760} height={70} fill="#3a4a55" />
      <rect x={160} y={330} width={26} height={640} fill="#2a3842" />
      <rect x={470} y={330} width={26} height={640} fill="#2a3842" />
      <SubSide x={850} y={370} s={1.4} color="#c3ccd3" />
      <circle cx={850} cy={370} r={300} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray={`${30 * (1 - k) + 8} ${10 + 30 * k}`} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 8. Deadly mistakes ═════════════════════════
const MISTAKE: Record<number, string> = { 1: "A KNOWN NOISE", 2: "A MISJUDGED CONTACT", 3: "TOO FAST TO SENSE", 4: "TOO QUIET TO HEAR" };
const H01: React.FC<P> = ({ g }) => (
  <Svg>
    <Board tint="#110709" />
    <Big x={960} y={420} text="DEADLY MISTAKES" p={ease(g, W("111", "deadly") - 4, 12)} size={150} color={C.red} />
    {[1, 2, 3, 4].map((n) => (
      <g key={n} opacity={ease(g, A("110") + n * 7, 10)}>
        <rect x={960 + (n - 2.5) * 260 - 100} y={560} width={200} height={200} rx={10} fill="rgba(255,90,60,0.08)" stroke={C.red} strokeWidth={3} />
        <text x={960 + (n - 2.5) * 260} y={700} textAnchor="middle" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={120}>
          {n}
        </text>
      </g>
    ))}
    <Vignette />
  </Svg>
);
const MCard: React.FC<{ g: number; n: number; at: number }> = ({ g, n, at }) => (
  <Svg>
    <Board tint="#110709" />
    <Heading text={`MISTAKE ${n}`} p={ease(g, at, 12)} y={500} size={170} color={C.red} sub={MISTAKE[n]} />
    <Vignette />
  </Svg>
);
const H02: React.FC<P> = ({ g }) => <MCard g={g} n={1} at={A("112")} />;
const H07: React.FC<P> = ({ g }) => <MCard g={g} n={2} at={A("120")} />;
const H14: React.FC<P> = ({ g }) => <MCard g={g} n={3} at={A("127")} />;
const H22: React.FC<P> = ({ g }) => <MCard g={g} n={4} at={A("137")} />;
const H03: React.FC<P> = ({ g }) => {
  const [x, y] = pt("northsea", "fedje");
  const beat = [0, 18, 26, 62, 80, 88, 120].some((b) => ((g - A("113")) % 140) >= b && ((g - A("113")) % 140) < b + 6);
  return (
    <Svg>
      <MapBase map="northsea">
        <Dot x={x} y={y} r={13} color={C.red} />
        <circle cx={x} cy={y} r={beat ? 56 : 22} fill="none" stroke={C.red} strokeWidth={5} opacity={beat ? 0.9 : 0.3} />
        <Label x={x - 30} y={y + 14} text="U-864" anchor="end" size={50} color={C.red} p={ease(g, W("113", "u-864"), 10)} />
      </MapBase>
      <Tag x={960} y={TOP} text="FEB 1945" p={ease(g, W("113", "february"), 10)} size={60} />
    </Svg>
  );
};
const H05: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="h05" dark={0.55} snow={40} />
    <Big x={960} y={570} text="73 LOST" p={ease(g, W("118", "73") - 4, 16)} size={170} />
    <Vignette />
  </Svg>
);
const H06: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="h06" dark={0.2} />
    <OldSub x={520} y={470} s={1.6} />
    <OldSub x={1400} y={650} s={1.6} color={C.red} flip />
    <Big x={960} y={850} text="ONLY ONE ON RECORD" p={ease(g, W("119", "only"), 10)} size={96} color={C.tracer} />
    <Vignette />
  </Svg>
);
const H08: React.FC<P> = ({ g }) => {
  const [x, y] = pt("oahu", "site");
  return (
    <Svg>
      <MapBase map="oahu">
        <Pin g={g} x={x} y={y} p={ease(g, W("121", "oahu") - 4, 10)} color={U.us} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={x + 60 + i * 30} cy={y + 60} r={10} fill="#ffe2a8" opacity={ease(g, W("121", "civilian") + i * 3, 8)} />
        ))}
        <Label x={x + 120} y={y + 120} text="VISITORS" p={ease(g, W("121", "civilian"), 10)} size={46} color="#ffe2a8" />
      </MapBase>
      <Tag x={960} y={TOP} text="9 FEB 2001" p={ease(g, W("121", "9"), 10)} size={60} />
    </Svg>
  );
};
const H10: React.FC<P> = ({ g }) => {
  const hit = W("123", "struck");
  const up = inOut(g, A("123") - 14, hit);
  const sink = lin(g, W("123", "sank"), E("123") + 40);
  return (
    <Svg>
      <Water surface={320} seed="h10" />
      <ShipSide x={1100} y={320} kind="motor" s={1.5} a={-sink * 14} sink={sink * 180} />
      <SubSide x={960} y={mix(860, 400, up)} s={1.25} a={-14} />
      <path d="M 700 980 C 760 800, 880 620, 960 460" stroke={U.sound} strokeWidth={4} strokeDasharray="14 12" fill="none" opacity={0.6} />
      {g > hit ? <circle cx={1080} cy={340} r={lin(g, hit, hit + 16) * 150} fill="none" stroke={C.tracer} strokeWidth={6} opacity={1 - lin(g, hit, hit + 22)} /> : null}
      <Tag x={960} y={TOP} text="EHIME MARU" p={ease(g, W("123", "ehime"), 10)} size={60} />
      <Vignette />
    </Svg>
  );
};
const H11: React.FC<P> = ({ g }) => {
  const k = lin(g, W("124", "nine"), W("124", "died") + 8);
  return (
    <Svg>
      <Water seed="h11" dark={0.55} snow={40} />
      {Array.from({ length: 35 }).map((_, i) => {
        const dim = i < 9;
        return <circle key={i} cx={960 + ((i % 7) - 3) * 104} cy={220 + Math.floor(i / 7) * 98} r={27} fill="#ffe2a8" opacity={dim ? 1 - 0.85 * lin(g, A("124") + i * 2, A("124") + i * 2 + 18) : 0.95 * ease(g, A("124") - 6, 8)} />;
      })}
      <Big x={960} y={830} text="9 OF 35" p={k} size={110} />
      <Vignette />
    </Svg>
  );
};
const H12: React.FC<P> = ({ g }) => (
  <Svg>
    <Board />
    <Doc x={540} y={500} p={ease(g, A("125"), 14)} title="NTSB" h={760} lines={12} w={560} />
    <Big x={1290} y={590} text="CONTACT ANALYSIS" p={ease(g, W("125", "failure"), 12)} size={96} color={C.tracer} />
    <Vignette />
  </Svg>
);
const H13: React.FC<P> = ({ g }) => {
  const off = ease(g, W("126", "knowing") - 10, 12);
  return (
    <Svg>
      <Board tint="#04100a" />
      <circle cx={960} cy={560} r={360} fill="rgba(45,120,80,0.1)" stroke="#59d08a" strokeWidth={4} />
      <line x1={960} y1={560} x2={960 + 360 * Math.cos(g / 18)} y2={560 + 360 * Math.sin(g / 18)} stroke="#59d08a" strokeWidth={4} opacity={0.7} />
      <Dot x={1120} y={420} r={14} color={C.tracer} />
      <rect x={680 - 54} y={620 - 54} width={108} height={108} fill="none" stroke={C.red} strokeWidth={6} opacity={off} />
      <line x1={680} y1={620} x2={1120} y2={420} stroke={C.red} strokeWidth={3} strokeDasharray="10 10" opacity={off} />
      <Tag x={960} y={TOP} text="HEARING ≠ KNOWING" p={ease(g, A("126"), 10)} size={66} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const H15: React.FC<P> = ({ g }) => {
  const [x, y] = pt("indopac", "boat");
  return (
    <Svg>
      <MapBase map="indopac">
        <Dot x={x + 40 * lin(g, A("128"), E("128"))} y={y} r={12} color={U.us} />
        <circle cx={x} cy={y} r={200} fill="rgba(89,184,255,0.1)" stroke={U.us} strokeWidth={3} strokeDasharray="10 10" />
      </MapBase>
      <Tag x={960} y={TOP} text="OCT 2021" p={ease(g, W("128", "october"), 10)} size={60} />
    </Svg>
  );
};
const H16: React.FC<P> = ({ g }) => {
  const v = mix(16, 24, inOut(g, W("129", "raised"), W("129", "24")));
  return (
    <Svg>
      <Board />
      <Dial x={960} y={780} r={480} v={v} max={35} step={5} red={16} />
      <Tag x={960} y={TOP} text="16 → 24 KN" p={ease(g, W("129", "16"), 8)} size={72} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const CHIPS: [string, string][] = [
  ["navigation", "NAVIGATION PLANNING"],
  ["watch-team", "WATCH TEAM"],
  ["risk", "RISK MANAGEMENT"],
];
const H18: React.FC<P> = ({ g }) => (
  <Svg>
    <Board />
    <Big x={960} y={280} text="NOT ONE DECISION" p={ease(g, W("132", "any") - 6, 10)} size={92} color={C.tracer} />
    {CHIPS.map(([w, t], i) => {
      const p = ease(g, W("133", w), 10);
      return (
        <g key={w} opacity={p} transform={`translate(0 ${(1 - p) * 30})`}>
          <rect x={460} y={420 + i * 150} width={1000} height={120} rx={10} fill="rgba(255,90,60,0.1)" stroke={C.red} strokeWidth={4} />
          <Label x={960} y={500 + i * 150} text={t} size={64} />
        </g>
      );
    })}
    <Vignette />
  </Svg>
);
const H19: React.FC<P> = ({ g }) => (
  <Svg>
    <Board />
    <Doc x={960} y={560} p={1} w={640} />
    <Stamp x={960} y={560} text="PREVENTABLE" p={ease(g, W("134", "not") - 22, 6)} size={120} />
    <Vignette />
  </Svg>
);
const H20: React.FC<P> = ({ g }) => {
  const k = inOut(g, A("135"), W("135", "seamount") + 12);
  return (
    <Svg>
      <Water seed="h20" floor={1010} />
      <path d="M 1120 1100 L 1420 620 L 1560 520 L 1720 640 L 2120 1100 Z" fill="#1f3a48" stroke="#5f8aa0" strokeWidth={5} />
      <line x1={110} y1={600} x2={1900} y2={600} stroke="#9fc4d8" strokeWidth={2} strokeDasharray="10 12" opacity={0.6} />
      <SubSide x={mix(300, 1270, k)} y={600} s={1.25} />
      <Tag x={520} y={TOP + 40} text="2005" p={ease(g, W("135", "2005"), 10)} size={66} />
      <Tag x={1000} y={TOP + 40} text="525 FT" p={ease(g, W("135", "525"), 10)} size={66} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};
const Chart: React.FC<{ x: number; p: number; mark?: number }> = ({ x, p, mark = 0 }) => (
  <g transform={`translate(${x} 560)`} opacity={p}>
    <rect x={-340} y={-300} width={680} height={600} fill="#d9dfd6" stroke="#6d7c87" strokeWidth={3} />
    {[-220, -110, 0, 110, 220].map((d) => (
      <g key={d}>
        <line x1={-340} y1={d} x2={340} y2={d} stroke="#9aa8ad" strokeWidth={1.5} />
        <line x1={d} y1={-300} x2={d} y2={300} stroke="#9aa8ad" strokeWidth={1.5} />
      </g>
    ))}
    {mark > 0 ? (
      <g opacity={mark}>
        <circle cx={40} cy={-30} r={70} fill="rgba(200,50,30,0.2)" stroke="#c0301c" strokeWidth={6} />
        <path d="M 8 -30 L 72 -30 M 40 -62 L 40 2" stroke="#c0301c" strokeWidth={6} />
      </g>
    ) : null}
  </g>
);
const H21: React.FC<P> = ({ g }) => (
  <Svg>
    <Board />
    <Chart x={530} p={1} />
    <Chart x={1390} p={ease(g, W("136", "other") - 4, 12)} mark={ease(g, W("136", "danger") - 2, 10)} />
    <Vignette />
  </Svg>
);
const H23: React.FC<P> = ({ g }) => {
  const [x, y] = pt("natl", "a");
  return (
    <Svg>
      <MapBase map="natl">
        <circle cx={x} cy={y} r={190} fill="rgba(255,210,74,0.08)" stroke={C.tracer} strokeWidth={3} strokeDasharray="10 10" />
        <Dot x={x - 70 + 30 * lin(g, A("138"), E("138"))} y={y - 16} r={11} color={U.us} op={ease(g, A("138"), 12)} />
        <Dot x={x + 70 - 30 * lin(g, A("138"), E("138"))} y={y + 16} r={11} color="#b4c8ff" op={ease(g, A("138"), 12)} />
      </MapBase>
      <Tag x={960} y={TOP} text="3 FEB 2009" p={ease(g, W("138", "3"), 10)} size={60} />
    </Svg>
  );
};
const H25: React.FC<P> = ({ g }) => (
  <Svg>
    <Board />
    <Doc x={960} y={570} p={ease(g, A("141") - 2, 14)} lines={0} w={640} />
    <Stamp x={960} y={560} text="NO INQUIRY FOUND" p={ease(g, W("141", "published"), 8)} size={82} color={C.muted} />
    <Vignette />
  </Svg>
);
const Shrimp: React.FC<{ x: number; y: number; s?: number; g: number }> = ({ x, y, s = 1, g }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#ffc9a8" strokeWidth={8} strokeLinecap="round">
    <path d="M 120 -30 C 40 -110, -90 -80, -100 10 C -104 60, -60 90, -20 76 C -60 40, -40 -20, 20 -20 C 60 -20, 100 -16, 120 -30 Z" fill="rgba(255,201,168,0.3)" />
    <path d="M 76 -66 L 54 -28 M 34 -86 L 20 -38 M -10 -86 L -8 -36 M -56 -66 L -40 -22" strokeWidth={5} />
    <path d={`M 120 -30 C 170 -70, 210 -70, ${250 + 6 * Math.sin(g / 7)} -100 M 120 -30 C 170 -20, 210 -30, ${260 + 6 * Math.sin(g / 9)} -40`} strokeWidth={4} />
    <circle cx={106} cy={-46} r={7} fill="#ffc9a8" stroke="none" />
  </g>
);
const H26: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="h26" dark={0.3} />
    <Shrimp x={960} y={410} s={1.15} g={g} />
    <Big x={960} y={700} text="LESS NOISE THAN A SHRIMP" p={ease(g, W("142", "less"), 10)} size={92} color={C.tracer} />
    <Label x={960} y={810} text="FRENCH DEFENCE MINISTER" p={ease(g, W("142", "france"), 12)} size={48} color="#c3ccd3" />
    <Vignette />
  </Svg>
);
const H27: React.FC<P> = ({ g }) => {
  const at = W("142", "when");
  const k = lin(g, at - 6, at + 80);
  return (
    <Svg>
      <Water seed="h27" dark={0.45} />
      <SubSide x={mix(260, 680, k)} y={540} s={1.1} op={0.5} />
      <SubSide x={mix(1660, 1240, k)} y={590} s={1.1} op={0.5} flip color="#b4c8ff" />
      <circle cx={mix(260, 680, k)} cy={540} r={340} fill="none" stroke={U.sound} strokeWidth={3} opacity={0.5} />
      <circle cx={mix(1660, 1240, k)} cy={590} r={340} fill="none" stroke={U.sound} strokeWidth={3} opacity={0.5} />
      <Vignette />
    </Svg>
  );
};
const RECAP: [string, string][] = [
  ["144", "NOISE"],
  ["145", "CONTACT"],
  ["146", "SPEED"],
  ["147", "SILENCE"],
];
const H28: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="h28" dark={0.45} />
    {RECAP.map(([id, t], i) => {
      const p = ease(g, A(id), 10);
      const x = 960 + (i - 1.5) * 385;
      return (
        <g key={id} opacity={0.25 + 0.75 * p} transform={`translate(${x} 540) scale(${0.88 * (1 + 0.06 * p)})`}>
          <rect x={-190} y={-180} width={380} height={360} rx={12} fill="rgba(10,22,32,0.85)" stroke={p > 0 ? C.red : "#3a4a55"} strokeWidth={4} />
          <text x={0} y={-30} textAnchor="middle" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={130}>
            {i + 1}
          </text>
          <Label x={0} y={110} text={t} size={64} p={p} />
          {/* a ping keeps leaving the card being named */}
          {p > 0 && (i === RECAP.length - 1 || g < A(RECAP[i + 1][0])) ? <circle cx={0} cy={0} r={190 + ((g - A(id)) % 45) * 7} fill="none" stroke={C.red} strokeWidth={4} opacity={0.6 * (1 - ((g - A(id)) % 45) / 45)} /> : null}
        </g>
      );
    })}
    <Vignette />
  </Svg>
);

// ═════════════════════════ 9. Outro ═════════════════════════
const I01: React.FC<P> = ({ g }) => (
  <Svg>
    <Water seed="i01" />
    <Cutaway x={960} y={560} s={1.05} crew={lin(g, A("149") - 6, E("149") + 4)} />
    <Tag x={960} y={TOP} text="A STEEL TUBE" p={ease(g, W("149", "steel"), 10)} size={66} color={C.tracer} />
    <Vignette />
  </Svg>
);
const I04: React.FC<P> = ({ g }) => {
  const k = lin(g, A("154"), E("154"));
  const brand = ease(g, E("154") + 30, 20);
  return (
    <Svg>
      <Sea seed="i04" flow={0.2} night={0.3 + brand} />
      <Land d="M -200 -200 L 900 -200 C 960 80, 760 300, 700 480 C 640 660, 300 760, -200 860 Z" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 5) * 1.5 + 0.03 + k * 0.03;
        return (
          <g key={i} opacity={ease(g, A("154") + i * 6, 10) * (1 - brand)}>
            <Warship x={540 + 960 * Math.cos(a)} y={260 + 700 * Math.sin(a)} a={(a * 180) / Math.PI + 90} s={0.85} color={N.friend} wake={0} />
          </g>
        );
      })}
      <Pin g={g} x={560} y={400} p={1 - brand} color={C.tracer} />
      <Tag x={1240} y={TOP} text="NEXT: BLOCKADE" p={ease(g, W("154", "naval") - 8, 10)} out={brand} size={60} color={C.tracer} />
      <Big x={960} y={570} text="NAVAL BOARD" p={brand} size={150} />
      <Vignette />
    </Svg>
  );
};

const SCENES: Record<string, React.FC<P>> = {
  A02, A03, A04, A05, A06, A07, A08, A09, A10,
  B01, B02, B03, B04, B05, B06, B07, B08, B09, B10, B11, B12,
  C01, C02, C03, C04, C05, C06,
  D01, D02, D03, D04, D05, D07, D08,
  E01, E02, E04, E05, E06, E07, E08,
  F01, F03, F04, F05, F06, F08,
  G02, G03, G05, G07, G08, G09, G10, G11, G12,
  H01, H02, H03, H05, H06, H07, H08, H10, H11, H12, H13, H14, H15, H16, H18, H19, H20, H21, H22, H23, H25, H26, H27, H28,
  I01, I04,
};

// ═════════════════════════ 3D shots (Blender: scripts/blender/sub3d.py, cued on the same VO) ═════════════════════════
// Glow of a blast over a 3D clip, at the hit's position in the picture.
const BlastGlow: React.FC<{ g: number; at: number; x: number; y: number; r: number }> = ({ g, at, x, y, r }) => {
  const t = g - at;
  if (t < 0 || t > 36) return null;
  const id = `blast${at}`;
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#fff8e6" />
          <stop offset="0.2" stopColor="#ffd696" stopOpacity={0.8} />
          <stop offset="0.48" stopColor="#ffa75a" stopOpacity={0.28} />
          <stop offset="1" stopColor="#ff9650" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * interpolate(t, [0, 5, 30], [0.3, 1, 1.35], CLAMP)} fill={`url(#${id})`} opacity={interpolate(t, [0, 2, 12, 36], [0, 1, 0.6, 0], CLAMP)} />
    </g>
  );
};

const HERO_LABELS: Record<string, React.FC<P>> = {
  hook: ({ g }) => (
    <>
      <Tag x={960} y={TOP} text="140 SAILORS" p={ease(g, A("01"), 8)} out={ease(g, A("03") - 4, 6)} size={70} />
      <Tag x={960} y={TOP} text="800+ FT" p={ease(g, W("03", "800"), 8)} out={ease(g, A("06") - 6, 6)} size={70} color={C.tracer} />
    </>
  ),
  ping: () => null,
  flow: ({ g }) => (
    <>
      <Tag x={960} y={TOP} text="35 KN" p={ease(g, W("59", "35"), 10)} out={ease(g, A("60") - 4, 6)} size={70} color={C.red} />
      <Tag x={960} y={TOP} text="~20 KN SILENT" p={ease(g, W("60", "20"), 10)} size={64} color={U.sound} />
    </>
  ),
  dive: () => null,
  snorkel: ({ g }) => <Tag x={960} y={TOP} text="SNORKEL" p={ease(g, W("84", "snorkel"), 10)} size={62} color={C.tracer} />,
  fleet: () => null,
  periscope: ({ g }) => (
    <>
      <defs>
        <mask id="scope">
          <rect width={1920} height={1080} fill="#fff" />
          <circle cx={960} cy={540} r={470} fill="#000" />
        </mask>
      </defs>
      <rect width={1920} height={1080} fill="#02060a" mask="url(#scope)" />
      <circle cx={960} cy={540} r={470} fill="none" stroke="#2a3842" strokeWidth={8} />
      <path d="M 490 540 L 880 540 M 1040 540 L 1430 540 M 960 70 L 960 460 M 960 620 L 960 1010" stroke="#d8f2ff" strokeWidth={2} opacity={0.7} />
      {[-2, -1, 1, 2].map((n) => (
        <line key={n} x1={960 + n * 100} y1={526} x2={960 + n * 100} y2={554} stroke="#d8f2ff" strokeWidth={2} opacity={0.7} />
      ))}
      <Tag x={960} y={TOP - 30} text="REPORTED" p={ease(g, A("93") + 6, 10)} size={52} color={C.muted} />
    </>
  ),
  belgrano: ({ g }) => (
    <>
      <BlastGlow g={g} at={W("97", "two")} x={705} y={498} r={210} />
      <BlastGlow g={g} at={W("97", "two") + 9} x={1267} y={503} r={190} />
      <Tag x={960} y={TOP} text="323 DIED" p={ease(g, W("97", "323"), 10)} size={66} />
    </>
  ),
  u864: ({ g }) => (
    <>
      <Tag x={960} y={TOP} text="NOISE: PROBABLY THAT FAULT" p={ease(g, A("115"), 8)} out={ease(g, A("116") - 4, 6)} size={56} color={C.tracer} />
      <BlastGlow g={g} at={E("117") - 10} x={1165} y={478} r={150} />
      <Tag x={960} y={TOP} text="4 FIRED" p={ease(g, W("117", "four"), 8)} size={62} />
    </>
  ),
  blow: ({ g }) => <Tag x={960} y={TOP} text="EMERGENCY BLOW" p={ease(g, W("122", "emergency"), 8)} size={60} color={C.tracer} />,
  seamount: ({ g }) => <Tag x={960} y={TOP} text="11 INJURED" p={ease(g, W("131", "11"), 8)} size={64} />,
  vanguard: ({ g }) => <Tag x={960} y={TOP} text="VERY LOW SPEED" p={ease(g, W("139", "very"), 10)} size={60} color={C.tracer} />,
  final: ({ g }) => <Big x={960} y={560} text="WHOEVER HEARS FIRST, WINS" p={ease(g, A("152") - 4, 12)} size={104} color={C.tracer} />,
};
/** Until a clip is rendered the slot shows a plain undersea plate, so timing can be checked without Blender. */
const Plate: React.FC<{ clip: string; g: number }> = ({ clip, g }) => (
  <Svg>
    <Water seed={`pl${clip}`} surface={["snorkel", "dive", "blow", "periscope"].includes(clip) ? 300 : undefined} dark={0.2} />
    <SubSide x={960 + 40 * Math.sin(g / 60)} y={560} s={2} />
    <Label x={960} y={880} text={`3D: ${clip}`} size={46} color={C.muted} />
  </Svg>
);
const XF = 8;
const CUT = 6; // frames a shot starts before its timeline slot, for the crossfade
const Hero: React.FC<{ clip: string; from: number; frames: number }> = ({ clip, from, frames }) => {
  const f = useCurrentFrame();
  const g = f + from;
  const Labels = HERO_LABELS[clip];
  const done = (RENDERED as string[]).includes(clip);
  return (
    <AbsoluteFill style={{ opacity: from === 0 ? interpolate(f, [frames - XF, frames], [1, 0], CLAMP) : interpolate(f, [0, XF, frames - XF, frames], [0, 1, 1, 0], CLAMP) }}>
      {done ? <Video src={staticFile(clip === "fleet" ? "video/carrier/fleet.mp4" : `video/submarines/${clip}.mp4`)} muted name={`3D ${clip}`} /> : <Plate clip={clip} g={g} />}
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
          <Labels g={g} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const SceneWrap: React.FC<{ from: number; first: boolean; C: React.FC<P> }> = ({ from, first, C: Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], CLAMP) }}>
      <Comp g={f + from} />
    </AbsoluteFill>
  );
};
type Seg = { id: string; from: number; len: number };
const SEGS = TIMELINE as Seg[];
const META = Object.fromEntries((PLAN.shots as { id: string; kind: string; clip?: string }[]).map((s) => [s.id, s]));
const slot = (i: number) => {
  const s = SEGS[i];
  const from = i === 0 ? 0 : s.from - CUT;
  const to = i + 1 < SEGS.length ? SEGS[i + 1].from - CUT + XF : submarinesDuration;
  return { from, frames: to - from };
};

// ═════════════════════════ chapter cards + progress strip ═════════════════════════
const CHAPTERS: [string, string, string][] = [
  ["19", "18", "THE OLDEST TRICK"],
  ["35", "34", "HOW FAR SOUND GOES"],
  ["47", "46", "TWO WAYS TO LISTEN"],
  ["56", "55", "NOISE IS EVERYTHING"],
  ["73", "72", "STAYING DOWN"],
  ["87", "86", "THE MODERN HUNT"],
  ["110", "109", "DEADLY MISTAKES"],
  ["148", "147", "WHO HEARS FIRST"],
];
const ChapterCards: React.FC = () => {
  const g = useCurrentFrame();
  const starts = CHAPTERS.map(([id]) => A(id));
  const cur = starts.filter((s) => g >= s - 30).length - 1;
  const card = CHAPTERS.map(([id, prev], i) => ({ i, p: ease(g, E(prev) + 2, 8) * (1 - ease(g, A(id) + 8, 8)) })).find((c) => c.p > 0);
  const n = CHAPTERS.length;
  const segW = (1904 - (n - 1) * 8) / n;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {card ? (
          <g opacity={card.p}>
            <rect x={0} y={0} width={1920} height={1080} fill="#050c13" />
            <text x={960} y={400} textAnchor="middle" fill={C.tracer} fontFamily={COND} fontWeight={700} fontSize={46} letterSpacing={12}>
              {`CHAPTER 0${card.i + 1}`}
            </text>
            <Heading text={CHAPTERS[card.i][2]} p={card.p} y={560} size={116} />
            {CHAPTERS.map((_, k) => (
              <rect key={k} x={960 - (n * 140) / 2 + k * 140 + 6} y={680} width={128} height={10} rx={5} fill={k < card.i ? C.muted : k === card.i ? C.tracer : "rgba(255,255,255,0.15)"} />
            ))}
          </g>
        ) : null}
        {cur >= 0 ? (
          <g opacity={0.75 * ease(g, starts[0] - 30, 20)}>
            {CHAPTERS.map((_, k) => {
              const a = starts[k];
              const b = k + 1 < n ? starts[k + 1] : submarinesDuration - END_EXTRA * FPS;
              const fill = interpolate(g, [a, b], [0, 1], CLAMP);
              const x = 8 + k * (segW + 8);
              return (
                <g key={k}>
                  <rect x={x} y={8} width={segW} height={6} rx={3} fill="rgba(255,255,255,0.14)" />
                  <rect x={x} y={8} width={segW * fill} height={6} rx={3} fill={k === cur ? C.tracer : C.muted} />
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

// ═════════════════════════ subtitles (key terms in yellow) ═════════════════════════
type Chunk = { text: string; from: number; to: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const l of LINES) {
    const t = toks(l.id);
    let cur: number[] = [];
    const groups: number[][] = [];
    t.forEach((w, k) => {
      cur.push(k);
      if (cur.length >= 6 || /[,.!?:;"]$/.test(w) || k === t.length - 1) {
        if (cur.length >= 2 || k === t.length - 1 || groups.length === 0) {
          groups.push(cur);
          cur = [];
        }
      }
    });
    if (cur.length) groups.push(cur);
    groups.forEach((gr, i) => {
      const from = W(l.id, gr[0]);
      const next = groups[i + 1];
      const to = next ? W(l.id, next[0]) : E(l.id) + 6;
      out.push({ text: gr.map((k) => t[k]).join(" "), from, to: Math.max(to, from + 8) });
    });
  }
  return out;
})();
const KEYWORDS = [
  "passive sonar", "active sonar", "sonar", "hydrophones", "ballast tanks", "emergency blow", "snorkel", "Seawolf", "Hunley", "Housatonic", "U-9", "Aboukir", "Gotland",
  "Conqueror", "Belgrano", "Dena", "Novorossiysk", "U-864", "Venturer", "Greeneville", "Ehime Maru", "Connecticut", "San Francisco", "Vanguard", "Le Triomphant", "deadly mistakes",
  "hears first",
];
const KEY_RE = new RegExp(String.raw`\b(${KEYWORDS.map((k) => k.replace(/[-]/g, "\\-")).join("|")})\b`, "i");
const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const c = CHUNKS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
      <div style={{ fontFamily: INTER, fontWeight: 700, fontSize: 46, color: "#fff", background: "rgba(0,0,0,0.62)", padding: "10px 26px", borderRadius: 10, letterSpacing: 0.2 }}>
        {c.text.split(KEY_RE).map((part, i) =>
          i % 2 ? (
            <span key={i} style={{ color: C.tracer }}>
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </div>
    </AbsoluteFill>
  );
};

export const SubmarinesVideo: React.FC<{ subtitles?: boolean; safeGuide?: boolean }> = ({ subtitles = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SEGS.map((s, i) => {
        const { from, frames } = slot(i);
        const Comp = SCENES[s.id];
        return Comp ? (
          <Sequence key={s.id} from={from} durationInFrames={frames} name={`Shot ${s.id}`}>
            <SceneWrap from={from} first={i === 0} C={Comp} />
          </Sequence>
        ) : null;
      })}
      {SEGS.map((s, i) => {
        const clip = META[s.id].clip;
        if (!clip) return null;
        const { from, frames } = slot(i);
        return (
          <Sequence key={clip} from={from} durationInFrames={frames} name={`3D ${clip}`}>
            <Hero clip={clip} from={from} frames={frames} />
          </Sequence>
        );
      })}
      <ChapterCards />
      {subtitles ? <Subtitles /> : null}
      <Audio src={staticFile("voiceover/submarines/vo.mp3")} name="VO" />
      <Sound />
    </AbsoluteFill>
  );
};

// ═════════════════════════ sound ═════════════════════════
const SX = (n: string) => `sfx/synth/${n}.wav`;
const Sound: React.FC = () => {
  const cues: [string, number, number?][] = [
    [SX("sonar-ping"), E("01") - 2, -26],
    [SX("sonar-ping"), E("10") - 4, -26],
    ...CHAPTERS.map(([, prev]) => [SX("sub-hit"), E(prev) + 2, -20] as [string, number, number]),
    [SX("sonar-ping"), W("49", "and") - 2, -27],
    [SX("sonar-ping"), W("50", "about") - 3, -28],
    [SX("sonar-ping"), W("52", "but") - 4, -27],
    [SX("sonar-ping"), W("55", "and") - 4, -26],
    ["sfx/creak/ship-hull-creak-3076.mp3", W("03", "800"), -28],
    ["sfx/explosion/explosive-impact-from-afar-2758.mp3", W("25", "explosive"), -24],
    [SX("under-blast"), E("29") - 2, -27],
    [SX("under-blast"), E("31") - 2, -25],
    [SX("air-blow"), W("74", "opens"), -26],
    [SX("air-blow"), W("76", "emergency") - 4, -22],
    [SX("sub-hit"), E("72") - 2, -24],
    [SX("torpedo-run"), W("96", "fired"), -24],
    [SX("under-blast"), W("97", "two") - 4, -27],
    [SX("engine-misfire"), A("113"), -24],
    [SX("engine-misfire"), W("114", "faint"), -25],
    [SX("sonar-ping"), W("116", "because") - 4, -28],
    [SX("torpedo-run"), W("117", "fired"), -21],
    [SX("under-blast"), W("117", "hit") + 2, -34], // on "hit" on purpose (the glow lands there) and no pause before "All 73": quiet instead of moved
    [SX("air-blow"), W("122", "emergency") - 4, -22],
    ["sfx/deephit/impact-thud-291047.mp3", W("123", "struck"), -24],
    ["sfx/deephit/impact-thud-291047.mp3", W("131", "and") - 4, -20],
    [SX("sub-hit"), W("134", "not") - 20, -22],
    ["sfx/deephit/impact-thud-291047.mp3", W("135", "and") - 4, -26],
    [SX("hull-touch"), W("139", "collided"), -21],
    [SX("sonar-ping"), E("152") + 2, -25],
  ];
  const beds: [string, number, number, number][] = [
    ["sfx/amb-sea/sea-waves-ambience-1189.mp3", A("83"), 9, -32],
    ["sfx/amb-sea/sea-waves-ambience-1189.mp3", A("93"), 7, -32],
  ];
  const duck = (f: number) =>
    interpolate(f, [A("19"), A("56"), A("87"), A("110")], [0.9, 1, 1.05, 1], CLAMP) *
    interpolate(f, [A("118") - 12, A("118"), E("119"), E("119") + 20], [1, 0.25, 0.25, 1], CLAMP) *
    interpolate(f, [A("124") - 12, A("124"), E("124"), E("124") + 20], [1, 0.25, 0.25, 1], CLAMP) *
    interpolate(f, [A("97") - 12, A("97"), E("98"), E("98") + 20], [1, 0.3, 0.3, 1], CLAMP) *
    interpolate(f, [A("103") - 12, A("103"), E("103"), E("103") + 20], [1, 0.3, 0.3, 1], CLAMP) *
    interpolate(f, [submarinesDuration - 90, submarinesDuration], [1, 0], CLAMP);
  return (
    <>
      {cues.map(([file, at, level], i) => (
        <Sfx key={i} file={file} at={at} level={level} align={file.includes("/synth/") ? "start" : "onset"} />
      ))}
      {beds.map(([file, at, seconds, level], i) => (
        <Sfx key={`bed${i}`} file={file} at={at} level={level} seconds={seconds} />
      ))}
      <MusicBed file="sfx/music/own/carrier-watch.mp3" level={-31} duck={duck} />
    </>
  );
};
