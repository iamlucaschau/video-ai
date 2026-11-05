/**
 * "How Ambushes Actually Work" (Test/ambush, 2026-11-05): 16:9 top-down tactical explainer, ~9:50.
 * One-off episode outside the channel rules (Lucas: "không cần tuân theo các tiêu chí trước đó").
 * Every cue comes from the VO: A(id) line start, E(id) line end, W(id, word) the frame a word is spoken
 * (src/voiceover/ambush.words.json, Whisper). Scenes are listed in SCENES; each draws a full map.
 */
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import timing from "../../voiceover/ambush.timing.json";
import WORDS from "../../voiceover/ambush.words.json";
import { MusicBed, Sfx } from "../../series/pvr/sfx";
import {
  Arrow,
  Blast,
  Bush,
  C,
  CLAMP,
  Check,
  Column,
  COND,
  Cone,
  Cross,
  Drone,
  ease,
  Forest,
  Heading,
  Hill,
  INTER,
  inOut,
  KillZone,
  lin,
  Line,
  Ring,
  River,
  Road,
  Rock,
  Rocket,
  Soldier,
  Tag,
  Terrain,
  Tracer,
  Vehicle,
  Vignette,
  along,
} from "./kit";

export const FPS = 30;
type L = { id: string; start: number; end: number; text: string };
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

/** Seconds after the VO tail: the recap of the three rules + the end screen (frame review 2026-11-05). */
const END_EXTRA = 8;
export const ambushDuration = Math.ceil((timing.durationInSeconds + ((timing as { tail?: number }).tail ?? 0) + END_EXTRA) * FPS);

/** Scene canvas with a slow, bounded camera float (ambient motion; scale ≥ 1.025 keeps the edges covered). */
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = 1.045 + 0.015 * Math.sin(f / 260);
  const x = 22 * Math.sin(f / 170);
  const y = 12 * Math.sin(f / 230 + 1);
  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
      <g transform={`translate(${(960 + x).toFixed(2)} ${(540 + y).toFixed(2)}) scale(${s.toFixed(4)}) translate(-960 -540)`}>{children}</g>
    </svg>
  );
};
const cam = (s: number, cx: number, cy: number) => `translate(960 540) scale(${s}) translate(${-cx} ${-cy})`;
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** Camera that eases (in-out, `dur` frames) to each key [frame, scale, cx, cy] in turn. */
const camPath = (g: number, keys: [number, number, number, number][], dur = 24) => {
  let [, s, x, y] = keys[0];
  for (const [f, ks, kx, ky] of keys.slice(1)) {
    const k = inOut(g, f, f + dur);
    s = mix(s, ks, k);
    x = mix(x, kx, k);
    y = mix(y, ky, k);
  }
  return cam(s, x, y);
};

// ═════════════════════════ 1. Hook (01–03) ═════════════════════════
const ROAD1 = "M -200 650 C 300 610, 700 720, 1100 630 S 1700 560, 2150 600";
const S01: React.FC<{ g: number }> = ({ g: gt }) => {
  const hit = W("01", "late");
  // cold open: time stops a few frames into the blast for the pause after line 01 (the hook question)
  const fz = hit + 5;
  const hold = A("02") - 6 - fz;
  const frozen = gt >= fz && gt < fz + hold;
  const g = gt < fz ? gt : gt < fz + hold ? fz : gt - hold;
  const q = ease(gt, fz + 2, 10) * (1 - ease(gt, A("02") - 10, 8));
  const head = 520 + Math.min(g, hit) * 3.4;
  const reveal = ease(g, W("01", "ambush"), 24);
  const title = ease(gt, A("03"), 20);
  // tight on the convoy at frame 0, pull back on "ambush" so the line in the trees is revealed with the word
  const pull = inOut(g, W("01", "ambush") - 8, W("01", "ambush") + 26);
  const lead = along(ROAD1, head);
  const chips: [string, string][] = [
    ["TEUTOBURG · 9 AD", "teutoburg"],
    ["WINTER WAR · 1939–40", "winter"],
    ["VIETNAM · 1955–75", "vietnam"],
  ];
  const dim = 1 - 0.55 * title;
  return (
    <Svg>
      <g transform={cam(mix(1.9, 1, pull), mix(lead.x - 120, 960, pull), mix(lead.y, 600, pull))}>
        <Terrain seed="hook" />
        <Road d={ROAD1} />
        <Forest x={-200} y={150} w={2320} h={380} seed="h1" />
        <Forest x={-200} y={760} w={2320} h={400} seed="h2" />
        <Column d={ROAD1} head={head} n={4} dead={[g >= hit ? 1 : 0]} />
        <g opacity={reveal}>
          <Line x1={900} y1={540} x2={1500} y2={505} n={7} glow={ease(g, hit, 10)} />
        </g>
        <Rocket g={g} x1={1440} y1={507} x2={along(ROAD1, 520 + hit * 3.4).x} y2={along(ROAD1, 520 + hit * 3.4).y} at={hit - 10} dur={10} />
        <Blast g={g} x={along(ROAD1, 520 + hit * 3.4).x} y={along(ROAD1, 520 + hit * 3.4).y} at={hit} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Tracer key={i} g={g} seed={i} x1={900 + i * 100} y1={540 - i * 6} x2={along(ROAD1, head - 110 - (i % 3) * 110).x} y2={along(ROAD1, head - 110 - (i % 3) * 110).y} on={hit + 6 + i * 3} off={A("03") + 10} />
        ))}
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={1 - dim} />
      {/* the freeze: white flash on the hit, then darken + the question */}
      <rect x={0} y={0} width={1920} height={1080} fill="#fff" opacity={0.55 * (1 - ease(gt, fz, 8)) * (gt >= hit - 1 ? 1 : 0)} />
      <rect x={0} y={0} width={1920} height={1080} fill="#120606" opacity={0.6 * q} />
      {frozen || q > 0 ? (
        <g opacity={q}>
          <Heading text="WHAT DO YOU DO?" sub="YOU HAVE SECONDS" p={q} y={500} size={150} />
        </g>
      ) : null}
      {chips.map(([t, w], i) => (
        <Tag key={t} x={420 + i * 540} y={175} text={t} p={ease(gt, W("02", w), 14)} size={44} kind="wipe" out={title} />
      ))}
      <Heading text="HOW AMBUSHES" sub="ACTUALLY WORK" p={title} y={520} size={170} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 2. Agenda (04) ═════════════════════════
const S04: React.FC<{ g: number }> = ({ g }) => {
  const items: [string, string][] = [
    ["BUILD", "constructed"],
    ["UNFOLD", "unfolds"],
    ["REACT", "reacts"],
    ["DRONES", "drones"],
  ];
  return (
    <Svg>
      <Terrain seed="agenda" tint="#161b13" />
      {items.map(([t, w], i) => {
        const p = ease(g, W("04", w), 16);
        const x = 270 + i * 460;
        return (
          <g key={t} opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
            <rect x={x - 190} y={330} width={380} height={420} rx={14} fill="rgba(10,12,9,0.7)" stroke="rgba(255,255,255,0.14)" strokeWidth={3} />
            <text x={x} y={410} textAnchor="middle" fill={C.tracer} fontFamily={COND} fontWeight={700} fontSize={48}>
              {`0${i + 1}`}
            </text>
            <g transform={`translate(${x} 540)`}>
              {i === 0 ? (
                <g>
                  <Line x1={-120} y1={-40} x2={60} y2={-40} n={5} />
                  <Line x1={110} y1={-60} x2={110} y2={20} n={3} />
                  <rect x={-130} y={10} width={220} height={40} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="14 10" />
                </g>
              ) : i === 1 ? (
                <g>
                  {/* static burst icon: the card holds for seconds, a one-off flash left it empty */}
                  {[-40, -10, 20].map((dy, k) => (
                    <line key={k} x1={-120} y1={dy - 20} x2={30} y2={dy + 10} stroke={C.tracer} strokeWidth={6} strokeLinecap="round" strokeDasharray="26 14" strokeDashoffset={-g * 3} />
                  ))}
                  <circle cx={70} cy={10} r={44} fill={C.red} opacity={0.35} />
                  <circle cx={70} cy={10} r={24} fill={C.tracer} />
                  <Blast g={g} x={70} y={10} at={W("04", w) + 8} s={0.5} />
                </g>
              ) : i === 2 ? (
                <Arrow d="M -100 60 C -40 0, 20 -20, 100 -60" p={ease(g, W("04", w) + 4, 20)} w={12} />
              ) : (
                <Drone x={0} y={0} g={g} s={1.3} shadow={0.6} />
              )}
            </g>
            <text x={x} y={700} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={66} letterSpacing={4}>
              {t}
            </text>
          </g>
        );
      })}
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 3. Three ingredients (05–06) ═════════════════════════
const S05: React.FC<{ g: number }> = ({ g }) => {
  const gone = ease(g, W("06", "away"), 20);
  const fade = ease(g, W("06", "disappears"), 24);
  const items: [string, string][] = [
    ["SURPRISE", "surprise"],
    ["CONCEALMENT", "concealment"],
    ["ON THE MOVE", "move"],
  ];
  return (
    <Svg>
      <Terrain seed="three" tint="#171c14" />
      {items.map(([t, w], i) => {
        const p = ease(g, W("05", w), 18);
        const x = 480 + i * 480;
        const out = i === 0 ? gone : 0;
        return (
          <g key={t} opacity={p * (1 - 0.55 * fade) * (1 - 0.6 * out)} transform={`translate(0 ${(1 - p) * 30 + out * 60})`}>
            <circle cx={x} cy={470} r={160} fill="rgba(10,12,9,0.65)" stroke={out ? "#666" : C.tracer} strokeWidth={6} strokeDasharray={`${1005 * p} 1005`} />
            <g transform={`translate(${x} 470)`}>
              {i === 0 ? (
                <text y={50} textAnchor="middle" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={170}>
                  !
                </text>
              ) : i === 1 ? (
                <g>
                  <Soldier x={0} y={10} />
                  <Bush x={0} y={0} s={1.5} />
                </g>
              ) : (
                <g>
                  <Vehicle x={-20} y={0} s={1.5} />
                  <Arrow d="M 50 0 L 120 0" p={p} w={10} />
                </g>
              )}
            </g>
            <text x={x} y={710} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={60} letterSpacing={3}>
              {t}
            </text>
          </g>
        );
      })}
      <Cross x={480} y={470} p={ease(g, W("06", "away") + 4, 14)} s={1.4} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 4. Passive but offensive (07–11) ═════════════════════════
const S07: React.FC<{ g: number }> = ({ g }) => {
  const passive = ease(g, W("08", "passive"), 14);
  const off = ease(g, W("09", "offensive"), 10);
  const table = ease(g, A("10"), 20);
  const rows: [string, string][] = [
    ["WHERE", "where"],
    ["WHEN", "when"],
    ["CONDITIONS", "conditions"],
  ];
  return (
    <Svg>
      <Terrain seed="passive" />
      <Forest x={-100} y={-100} w={900} h={1300} seed="p1" density={0.5} dim={0.6} />
      <g transform={`translate(${mix(960, 420, table)} 470) scale(${mix(1.6, 1.1, table)})`}>
        <Bush x={0} y={0} s={1.8} />
        {/* the hidden ambusher shows through the bush, or the shot reads as an empty bush */}
        <g opacity={0.9}>
          <Soldier x={6} y={8} r={14} />
        </g>
      </g>
      <g transform={`translate(${mix(960, 420, table)} ${mix(760, 720, table)})`}>
        <Tag x={0} y={0} text="PASSIVE?" p={passive} size={56} kind="rise" out={off * 0.6} />
        {off > 0 ? <line x1={-130} y1={0} x2={-130 + 260 * off} y2={0} stroke={C.red} strokeWidth={8} /> : null}
        <g transform={`translate(0 ${110}) rotate(${-6 * off}) scale(${mix(1.6, 1, off)})`} opacity={off}>
          <rect x={-200} y={-50} width={400} height={100} fill="none" stroke={C.red} strokeWidth={8} rx={6} />
          <text y={26} textAnchor="middle" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={74} letterSpacing={6}>
            OFFENSIVE
          </text>
        </g>
      </g>
      <g opacity={table} transform={`translate(${(1 - table) * 80} 0)`}>
        <text x={1340} y={300} textAnchor="middle" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={50} letterSpacing={3}>
          AMBUSHER
        </text>
        <text x={1640} y={300} textAnchor="middle" fill={C.blue} fontFamily={COND} fontWeight={800} fontSize={50} letterSpacing={3}>
          ENEMY
        </text>
        {rows.map(([t, w], i) => (
          <g key={t}>
            <line x1={940} y1={350 + i * 150} x2={1780} y2={350 + i * 150} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
            <text x={960} y={445 + i * 150} fill={C.text} fontFamily={COND} fontWeight={700} fontSize={56}>
              {t}
            </text>
            <Check x={1340} y={428 + i * 150} p={ease(g, W("10", w), 12)} />
            <Cross x={1640} y={428 + i * 150} p={ease(g, W("11", "none") + i * 5, 10)} s={0.42} />
          </g>
        ))}
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 5. The kill zone (12–20) ═════════════════════════
const ROADX = "M -200 600 L 2120 600";
const S12: React.FC<{ g: number }> = ({ g }) => {
  const box = ease(g, W("12", "kill"), 30);
  const pos = ease(g, W("13", "position"), 20);
  const stop = W("16", "box");
  const head = interpolate(g, [A("15"), stop], [-60, 1480], { ...CLAMP, easing: (t) => 1 - (1 - t) * (1 - t) });
  const fire = stop + 4;
  const done = W("18", "done");
  const leave = ease(g, done, 40);
  const pulse = 0.5 + 0.5 * Math.sin(g / 6);
  const vx = (i: number) => along(ROADX, 1480 - i * 110).x; // where the stopped column's vehicles sit
  const qs: [string, number, number][] = [
    ["WHERE?", A("13"), A("15")],
    ["WHEN?", A("15"), A("17")],
    ["LEAVE?", A("17"), A("19")],
  ];
  return (
    <Svg>
      <Terrain seed="kz" />
      <Road d={ROADX} />
      <Forest x={-200} y={130} w={2320} h={330} seed="k1" />
      <Forest x={-200} y={740} w={2320} h={400} seed="k2" />
      <KillZone x={610} y={500} w={760} h={200} p={box} pulse={g > A("19") ? pulse * ease(g, A("19"), 10) : 0} label="KILL ZONE" lp={box} />
      <Column d={ROADX} head={head} n={4} dead={[0, 1, 2, 3].map(() => ease(g, fire + 20, 30))} />
      <g opacity={pos * (1 - leave)} transform={`translate(0 ${-leave * 200})`}>
        <Line x1={660} y1={450} x2={1320} y2={450} n={7} p={pos} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={660 + i * 110} y1={462} x2={660 + i * 110} y2={500} stroke={C.red} strokeWidth={3} strokeDasharray="6 8" opacity={ease(g, W("14", "cover"), 14)} />
        ))}
      </g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Tracer key={i} g={g} seed={i} x1={660 + i * 110} y1={450} x2={vx(i % 4)} y2={600} on={fire + i * 2} off={fire + 50} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Blast key={i} g={g} x={vx(i)} y={600} at={fire + 10 + i * 6} s={0.6} />
      ))}
      {qs.map(([t, a, b]) => (
        <Tag key={t} x={960} y={110} text={t} p={ease(g, a, 12)} out={ease(g, b - 6, 6)} size={60} kind="drop" />
      ))}
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 6. Location matters most (21–23) ═════════════════════════
// A planner's reticle tours three candidate sites, rejects two, locks on the third on "location".
const ROADL = "M -200 790 C 200 790, 420 730, 640 712 S 980 660, 1180 580 C 1330 515, 1410 410, 1560 345 S 1900 300, 2150 320";
const SITES: [number, number, string][] = [
  [470, 735, "OPEN FIELD"],
  [930, 668, "STRAIGHT ROAD"],
  [1420, 440, "BLIND BEND"],
];
const S21: React.FC<{ g: number }> = ({ g }) => {
  const a = A("21");
  const loc = W("21", "location");
  const t2 = Math.round(mix(a, loc, 0.42));
  const t3 = loc - 6;
  const k1 = inOut(g, t2 - 22, t2);
  const k2 = inOut(g, t3 - 22, t3);
  const rx = mix(mix(SITES[0][0], SITES[1][0], k1), SITES[2][0], k2);
  const ry = mix(mix(SITES[0][1], SITES[1][1], k1), SITES[2][1], k2);
  const rp = ease(g, a + 10, 14);
  const locked = ease(g, t3, 12);
  const panel = ease(g, A("22"), 16);
  const b = ease(g, W("22", "outcome"), 30);
  const ex = ease(g, W("23", "execution"), 24);
  const seen = [a + 10, t2, t3];
  const out = [t2 - 26, t3 - 26];
  return (
    <Svg>
      <Terrain seed="loc" tint="#1d2418" />
      <Forest x={600} y={420} w={520} h={150} seed="l2" density={0.9} />
      <Forest x={560} y={790} w={600} h={260} seed="l3" density={0.9} />
      <Forest x={1150} y={90} w={520} h={240} seed="l4" density={1.1} />
      <Forest x={1480} y={430} w={640} h={420} seed="l5" density={1.1} />
      <Forest x={1700} y={-100} w={420} h={330} seed="l6" />
      <Road d={ROADL} />
      {SITES.map(([x, y, t], i) => {
        const p = ease(g, seen[i], 12);
        const dim = i < 2 ? ease(g, out[i], 10) : 0;
        return (
          <g key={t} opacity={p * (1 - 0.45 * dim)}>
            <Tag x={x} y={y + 110} text={t} p={1} size={38} color={i === 2 ? C.red : C.text} />
            {i < 2 ? <Cross x={x} y={y} p={dim} s={0.9} /> : null}
          </g>
        );
      })}
      <KillZone x={1300} y={360} w={250} h={160} p={locked} pulse={locked * (0.5 + 0.5 * Math.sin(g / 6))} />
      <g opacity={rp * (1 - 0.6 * locked)} transform={`translate(${rx} ${ry})`}>
        <circle r={74} fill="none" stroke={C.tracer} strokeWidth={4} />
        <circle r={6} fill={C.tracer} />
        {[0, 90, 180, 270].map((r) => (
          <line key={r} x1={0} y1={-96} x2={0} y2={-58} stroke={C.tracer} strokeWidth={4} transform={`rotate(${r})`} />
        ))}
      </g>
      <Heading text="LOCATION" p={ease(g, loc, 16)} y={170} size={110} />
      <g opacity={panel} transform={`translate(${(1 - panel) * -60} 0)`}>
        <rect x={70} y={250} width={820} height={200} rx={14} fill="rgba(10,12,9,0.86)" />
        <text x={330} y={330} textAnchor="end" fill={C.text} fontFamily={COND} fontWeight={700} fontSize={48} letterSpacing={3}>
          GROUND
        </text>
        <rect x={360} y={292} width={490 * b} height={48} rx={6} fill={C.tracer} />
        <g opacity={ex}>
          <text x={330} y={410} textAnchor="end" fill={C.muted} fontFamily={COND} fontWeight={700} fontSize={48} letterSpacing={3}>
            EXECUTION
          </text>
          <rect x={360} y={372} width={150 * ex} height={48} rx={6} fill="rgba(255,255,255,0.35)" />
        </g>
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 7a. Open ground (24) ═════════════════════════
const S24: React.FC<{ g: number }> = ({ g }) => (
  <Svg>
    <Terrain seed="open" tint="#2a3121" />
    <Road d={ROADX} />
    <Column d={ROADX} head={760 + (g - A("24")) * 1.5} n={4} />
    <Line x1={900} y1={780} x2={1400} y2={790} n={6} />
    <Tag x={960} y={150} text="OPEN GROUND" p={ease(g, A("24"), 14)} size={60} kind="wipe" />
    <Cross x={1150} y={785} p={ease(g, W("24", "out"), 14)} s={1.2} />
    <Vignette />
  </Svg>
);

// ═════════════════════════ 7b. Straight road (25–26) ═════════════════════════
const S25: React.FC<{ g: number }> = ({ g }) => {
  const t0 = A("25");
  const fast = W("26", "drive");
  const head = 500 + (Math.min(g, fast) - t0) * 1.6 + Math.max(0, g - fast) * 9;
  const lead = along(ROADX, head);
  const spot = ease(g, W("26", "wrong"), 10);
  const cone = ease(g, W("25", "sight"), 24);
  return (
    <Svg>
      <Terrain seed="straight" />
      <Road d={ROADX} />
      <Forest x={-200} y={120} w={2320} h={360} seed="s1" />
      <Forest x={-200} y={740} w={2320} h={400} seed="s2" />
      <Cone id="c25" x={lead.x + 40} y={lead.y} a={0} len={1300 * cone} spread={10} op={cone} />
      <Column d={ROADX} head={head} n={4} />
      <Line x1={1500} y1={480} x2={1800} y2={480} n={4} glow={spot} />
      <Ring x={1650} y={480} g={g} at={W("26", "wrong")} color={C.blue} r={160} />
      <Tag x={960} y={860} text="LINE OF SIGHT" p={cone} size={54} kind="wipe" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 7c. Blind bend (27–28) ═════════════════════════
const ROADB = "M -200 900 C 400 900, 700 905, 950 880 C 1330 840, 1480 700, 1460 540 C 1440 360, 1300 240, 1000 210 L -200 200";
const S27: React.FC<{ g: number }> = ({ g }) => {
  const head = interpolate(g, [A("27"), E("28")], [800, 1850], CLAMP);
  const lead = along(ROADB, head);
  const close = ease(g, W("28", "already"), 14);
  return (
    <Svg>
      <Terrain seed="bend" />
      <Road d={ROADB} />
      <Forest x={1560} y={-100} w={500} h={1300} seed="b1" density={0.8} />
      <Forest x={-200} y={-100} w={1900} h={230} seed="b2" density={0.8} />
      <Cone id="c27" x={lead.x} y={lead.y} a={lead.a} len={700} spread={16} />
      <Hill cx={930} cy={560} rx={420} ry={250} />
      <Line x1={1190} y1={300} x2={1360} y2={380} n={4} glow={close} />
      <Column d={ROADB} head={head} n={4} />
      <Tag x={760} y={560} text="BLIND CORNER" p={ease(g, W("27", "bend"), 14)} size={56} kind="rise" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 8. The bridge (29–34) ═════════════════════════
const RIVER = "M 1000 -120 C 950 300, 1070 700, 990 1200";
const S29: React.FC<{ g: number }> = ({ g }) => {
  const head = interpolate(g, [A("29"), A("31")], [200, 860], { ...CLAMP, easing: (t) => 1 - (1 - t) * (1 - t) });
  const kz = ease(g, W("31", "choke"), 24);
  const red = ease(g, A("32"), 20);
  const gauge = inOut(g, W("33", "probability"), W("34", "certainty") + 10);
  const ang = -180 + 180 * mix(0.35, 0.96, gauge);
  return (
    <Svg>
      <Terrain seed="bridge" />
      <Forest x={-200} y={-120} w={1100} h={600} seed="r1" />
      <Forest x={-200} y={700} w={1100} h={500} seed="r2" />
      <Forest x={1120} y={-120} w={1000} h={590} seed="r3" />
      <Forest x={1120} y={720} w={1000} h={500} seed="r4" />
      <River d={RIVER} w={150} />
      <Road d={ROADX} />
      <rect x={905} y={555} width={200} height={90} fill="#8a7b5f" stroke="#3d3528" strokeWidth={6} />
      <line x1={905} y1={560} x2={1105} y2={560} stroke="#d9c9a6" strokeWidth={6} />
      <line x1={905} y1={640} x2={1105} y2={640} stroke="#d9c9a6" strokeWidth={6} />
      <KillZone x={880} y={500} w={520} h={200} p={kz} />
      <Column d={ROADX} head={head} n={4} />
      <g opacity={red}>
        <Line x1={1180} y1={455} x2={1440} y2={455} n={4} />
        <Line x1={1180} y1={745} x2={1440} y2={745} n={4} />
      </g>
      <Tag x={1000} y={130} text="ONLY CROSSING" p={ease(g, W("30", "way"), 14)} size={54} kind="wipe" out={ease(g, A("33"), 10)} />
      <g opacity={ease(g, A("33"), 16)} transform="translate(1600 330)">
        <rect x={-260} y={-260} width={520} height={300} rx={14} fill="rgba(10,12,9,0.8)" />
        <path d="M -190 0 A 190 190 0 0 1 190 0" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={26} />
        <path d="M -190 0 A 190 190 0 0 1 190 0" fill="none" stroke={C.red} strokeWidth={26} strokeDasharray={`${597 * mix(0.35, 0.96, gauge)} 600`} />
        <line x1={0} y1={0} x2={Math.cos((ang * Math.PI) / 180) * 160} y2={Math.sin((ang * Math.PI) / 180) * 160} stroke={C.text} strokeWidth={8} strokeLinecap="round" />
        <circle r={14} fill={C.text} />
        <text y={-200} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={44}>
          {gauge > 0.6 ? "CERTAINTY" : "PROBABILITY"}
        </text>
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 9. Cover vs concealment (35–38) ═════════════════════════
const Chip: React.FC<{ x: number; y: number; text: string; ok: boolean; p: number }> = ({ x, y, text, ok, p }) => (
  <g opacity={p} transform={`translate(${x} ${y + (1 - p) * 24})`}>
    <rect x={-190} y={-36} width={380} height={72} rx={36} fill="rgba(10,12,9,0.9)" stroke={ok ? "#7be07b" : C.red} strokeWidth={4} />
    <text x={-150} y={15} fill={C.text} fontFamily={COND} fontWeight={800} fontSize={42} letterSpacing={2}>
      {text}
    </text>
    {ok ? (
      <path d="M 120 2 L 136 18 L 162 -16" fill="none" stroke="#7be07b" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <g stroke={C.red} strokeWidth={7} strokeLinecap="round">
        <line x1={124} y1={-14} x2={154} y2={16} />
        <line x1={154} y1={-14} x2={124} y2={16} />
      </g>
    )}
  </g>
);
const S35: React.FC<{ g: number }> = ({ g }) => {
  const exit = inOut(g, A("38"), A("38") + 24);
  const hides = W("36", "hides");
  const t1 = hides + 26;
  const t2 = W("37", "stops");
  // the enemy (blue) sweeps its eyes over the bush and finds nothing; then both sides take fire
  const look = ease(g, A("35") + 20, 20) * (1 - ease(g, t1 - 4, 8));
  const sweep = 90 + 38 * Math.sin((g - A("35")) / 16);
  const what = ease(g, hides + 4, 10) * (1 - ease(g, t1, 8));
  return (
    <Svg>
      <Terrain seed="cover" tint="#20271b" />
      <g opacity={1 - exit}>
        <line x1={960} y1={140} x2={960} y2={940} stroke="rgba(255,255,255,0.15)" strokeWidth={3} />
        {/* concealment: the bush hides him, bullets go straight through */}
        <Cone id="c35" x={480} y={222} a={sweep} len={430 * look} spread={13} color="#cfe8ff" op={look} />
        <Soldier x={480} y={195} color={C.blue} r={22} a={90} />
        <text x={548} y={200} fill={C.text} fontFamily={COND} fontWeight={800} fontSize={64} opacity={what}>
          ?
        </text>
        <Soldier x={480} y={560} r={20} />
        <Bush x={480} y={540} s={3.2} />
        {[0, 1, 2].map((k) => (
          <Tracer key={k} g={g} seed={k} x1={480} y1={228} x2={486 - k * 6} y2={585} on={t1 + k * 16} off={t1 + k * 16 + 11} />
        ))}
        <Blast g={g} x={480} y={565} at={t1 + 5} s={0.32} />
        {/* cover: the rock stops every round */}
        <Soldier x={1440} y={195} color={C.blue} r={22} a={90} />
        <Soldier x={1440} y={705} r={20} />
        <Rock x={1440} y={560} s={3.2} />
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <Tracer g={g} seed={k + 3} x1={1440} y1={228} x2={1432 + k * 10} y2={448} on={t2 + k * 14} off={t2 + k * 14 + 10} />
            <Blast g={g} x={1432 + k * 10} y={448} at={t2 + k * 14 + 4} s={0.26} />
          </g>
        ))}
        <Tag x={480} y={86} text="CONCEALMENT" p={ease(g, W("35", "concealment"), 12)} size={52} kind="wipe" />
        <Tag x={1440} y={86} text="COVER" p={ease(g, W("35", "cover"), 12)} size={52} kind="wipe" />
        <Chip x={270} y={860} text="HIDES YOU" ok p={ease(g, hides, 12)} />
        <Chip x={690} y={860} text="STOPS BULLETS" ok={false} p={ease(g, t1 + 8, 12)} />
        <Chip x={1440} y={860} text="STOPS BULLETS" ok p={ease(g, t2 + 8, 12)} />
      </g>
      <g opacity={exit}>
        <Forest x={-200} y={-100} w={2320} h={700} seed="c3" density={0.8} />
        <Road d="M -200 820 L 2120 820" />
        <Line x1={700} y1={640} x2={1200} y2={640} n={6} />
        <Arrow d="M 950 600 C 950 450, 1100 330, 1300 160" p={ease(g, W("38", "way"), 30)} color={C.red} w={14} />
        <Tag x={1450} y={130} text="WAY OUT" p={ease(g, W("38", "way") + 10, 14)} size={54} />
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 10. Both sides = friendly fire (39–45) ═════════════════════════
const S39: React.FC<{ g: number }> = ({ g }) => {
  const sides = ease(g, A("41"), 20);
  const fire = W("44", "fire");
  const hurt = ease(g, W("44", "own"), 8);
  return (
    <Svg>
      <Terrain seed="both" />
      <Road d={ROADX} />
      <Forest x={-200} y={120} w={2320} h={340} seed="o1" />
      <Forest x={-200} y={760} w={2320} h={400} seed="o2" />
      <Column d={ROADX} head={1360} n={4} s={1} />
      <g opacity={sides}>
        <Line x1={700} y1={455} x2={1300} y2={455} n={6} glow={hurt} />
        <Line x1={700} y1={745} x2={1300} y2={745} n={6} glow={hurt} />
      </g>
      <KillZone x={690} y={560} w={620} h={80} p={ease(g, W("43", "crossing"), 18)} color={C.tracer} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <Tracer g={g} seed={i} x1={700 + i * 120} y1={455} x2={760 + i * 110} y2={745} on={fire + i * 2} off={E("45")} />
          <Tracer g={g} seed={i + 9} x1={700 + i * 120} y1={745} x2={640 + i * 120} y2={455} on={fire + 6 + i * 2} off={E("45")} />
        </g>
      ))}
      <Heading text="POSITIONING" p={ease(g, A("39"), 14)} out={ease(g, A("40") + 20, 10)} />
      <Tag x={960} y={860} text="FRIENDLY FIRE" p={hurt} color={C.red} size={60} kind="drop" />
      <Cross x={960} y={600} p={ease(g, W("45", "once"), 14)} s={2} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 11. The L-shaped ambush, start to finish (46–85) ═════════════════════════
const KZ = { x: 560, y: 520, w: 840, h: 160 };
const LONG = { x1: 620, x2: 1320, y: 455, n: 8 };
const SHORT = { x: 1470, y1: 395, y2: 535, n: 4 };
const longX = (i: number) => LONG.x1 + ((LONG.x2 - LONG.x1) * i) / (LONG.n - 1);
const shortY = (i: number) => SHORT.y1 + ((SHORT.y2 - SHORT.y1) * i) / (SHORT.n - 1);
const COL_GAP = 110;

/** Shared L map: also used by the "flip it" scenes (86–111). */
const LMap: React.FC<{ g: number; head: number; dead?: number[]; ghost?: number; ghostHead?: number; redOp?: number; shortShift?: number; children?: React.ReactNode; redColor?: string }> = ({
  head,
  dead = [],
  ghost = 0,
  ghostHead = 1500,
  redOp = 1,
  shortShift = 0,
  children,
}) => (
  <>
    <Terrain seed="L" />
    <Road d={ROADX} />
    <Forest x={-200} y={110} w={2320} h={330} seed="L1" />
    <Forest x={-200} y={740} w={2320} h={420} seed="L2" />
    {ghost > 0 ? (
      <g opacity={ghost * 0.45}>
        <Column d={ROADX} head={ghostHead} n={5} gap={COL_GAP} />
      </g>
    ) : null}
    <Column d={ROADX} head={head} n={5} gap={COL_GAP} dead={dead} />
    <g opacity={redOp}>{children}</g>
    <g opacity={redOp}>
      {Array.from({ length: SHORT.n }).map((_, i) => (
        <Soldier key={i} x={SHORT.x - shortShift * (180 + i * 60)} y={shortY(i) + shortShift * (130 - i * 10)} />
      ))}
    </g>
  </>
);

const S46: React.FC<{ g: number }> = ({ g }) => {
  const long = ease(g, W("47", "long"), 30);
  const short = ease(g, W("53", "short"), 20);
  const ghost = 1 - ease(g, A("60"), 20);
  const t0 = W("68", "anti");
  const mg = W("69", "machine");
  // the column rolls in on 60–62 so it is inside the box when the VO says "enters the kill zone", then creeps on
  const head = interpolate(g, [A("60"), E("62"), t0], [-60, 860, 1500], CLAMP);
  const dead = [0, 1, 2, 3, 4].map((i) => (i === 0 || i === 4 ? ease(g, t0 + 12, 10) : ease(g, mg + 40 + i * 12, 20)));
  const assault = inOut(g, W("79", "assault"), W("79", "assault") + 60);
  const leave = inOut(g, W("85", "leave"), W("85", "leave") + 45);
  // re-frame on each part as the VO explains it, so the picture changes every 10–20 s (was one frame for ~2 min)
  const camera = camPath(g, [
    [A("46"), 1, 960, 540],
    [W("50", "fire") - 12, 1.3, 980, 540], // enfilade: the box and the long leg
    [W("53", "short") - 8, 1.55, 1300, 500], // short leg + danger area
    [A("57"), 1.15, 960, 520], // MG / AT along the long leg
    [W("59", "security") - 8, 1, 960, 540], // security at both ends needs the full width
    [A("63"), 1.35, 860, 540], // the hold: tight on the column creeping in
    [t0 - 30, 1, 960, 540], // wide for the initiation
    [A("70"), 1.45, 1050, 600], // inside the kill zone
    [A("75"), 1, 960, 540],
    [W("79", "assault") - 10, 1.5, 1200, 540], // assault + search
    [W("81", "withdrawal"), 1, 960, 540], // withdrawal, reinforcements from both ends
  ]);
  const fireOff = W("79", "assault") + 10;
  const vpos = (i: number) => along(ROADX, head - i * COL_GAP);
  const ooda = ["OBSERVE", "ORIENT", "DECIDE", "ACT"];
  const crash = ease(g, W("74", "collapses"), 30);
  const clock = lin(g, W("82", "clock"), E("85"));
  const liability = ease(g, W("84", "liability"), 14);
  // tags shown one at a time in the top band
  const tags: [string, number, number, string?][] = [
    ["SUPPORT ELEMENT", W("48", "support"), A("49")],
    ["ALONG, NOT ACROSS", W("50", "along"), W("52", "that")],
    ["ENFILADE FIRE", W("52", "enfilade"), A("53") + 10],
    ["SHORT LEG", W("53", "short"), W("55", "risk")],
    ["DANGER AREA", W("55", "area"), A("57")],
    ["SECURITY", W("59", "security"), A("60") + 20],
    ["DISCIPLINE", W("61", "discipline"), A("62") + 40],
    ["HOLD", W("63", "nobody"), A("67")],
    ["SUPPRESSION", W("75", "suppression"), A("78")],
    ["ASSAULT", W("79", "assault"), A("81")],
    ["WITHDRAWAL", W("81", "withdrawal"), W("84", "liability") - 4],
    ["LIABILITY", W("84", "liability"), E("85") + 20, C.red],
  ];
  return (
    <Svg>
      <g transform={camera}>
        <LMap g={g} head={head} dead={dead} ghost={ghost} ghostHead={interpolate(g, [A("46"), A("57") - 30], [450, 1500], CLAMP)} shortShift={0} redOp={0}>
          {null}
        </LMap>
        <KillZone x={KZ.x} y={KZ.y} w={KZ.w} h={KZ.h} p={ease(g, A("46"), 24)} pulse={liability * (0.5 + 0.5 * Math.sin(g / 4))} />
        <Arrow d="M 140 600 L 1800 600" p={ease(g, W("47", "route"), 30) * ghost} dash color={C.blue} w={10} op={0.8} />
        {/* the route keeps flowing left to right while it is explained */}
        <line x1={140} y1={600} x2={1780} y2={600} stroke="#9fd0ff" strokeWidth={4} strokeDasharray="10 40" strokeDashoffset={-g * 2.4} opacity={ease(g, W("47", "route") + 20, 20) * ghost * 0.7} />
        {/* long leg (support) */}
        <g opacity={1 - leave} transform={`translate(0 ${-leave * 320})`}>
          {Array.from({ length: LONG.n }).map((_, i) => (
            <g key={i} opacity={interpolate(long * LONG.n - i, [0, 1], [0, 1], CLAMP)}>
              <Soldier a={90 + 16 * Math.sin(g / 47 + i * 1.3)} x={longX(i)} y={LONG.y} glow={i === 5 ? ease(g, W("66", "fires"), 8) * (1 - ease(g, A("67"), 10)) : 0} color={i === 5 && g > W("66", "fires") && g < A("67") ? C.tracer : C.red} />
            </g>
          ))}
          {/* short leg */}
          {Array.from({ length: SHORT.n }).map((_, i) => {
            const x = mix(SHORT.x, 1180 + i * 60, assault);
            const y = mix(shortY(i), 545 + (i % 2) * 110, assault);
            return (
              <g key={i} opacity={interpolate(short * SHORT.n - i, [0, 1], [0, 1], CLAMP)}>
                <Soldier x={x} y={y} a={180 + 14 * Math.sin(g / 53 + i)} />
              </g>
            );
          })}
          {/* security */}
          <g opacity={ease(g, W("59", "security"), 20)}>
            <Line x1={140} y1={470} x2={260} y2={470} n={3} />
            <Line x1={1700} y1={470} x2={1820} y2={470} n={3} />
          </g>
          {/* MG / AT labels */}
          {[1, 3, 6].map((i) => (
            <Tag key={i} x={longX(i)} y={LONG.y - 50} text="MG" p={ease(g, W("57", "machine") + i, 10)} out={ease(g, A("60"), 10)} size={38} />
          ))}
          {[0, 7].map((i) => (
            <Tag key={i} x={longX(i)} y={LONG.y - 50} text="AT" color={C.red} p={ease(g, W("57", "anti"), 10)} out={ease(g, A("60"), 10)} size={38} />
          ))}
          {/* commander */}
          <g opacity={ease(g, W("67", "commander"), 10)}>
            <path d="M 960 360 l 10 22 24 2 -18 16 6 24 -22 -13 -22 13 6 -24 -18 -16 24 -2 z" fill={C.tracer} />
          </g>
          <Ring x={960 + 2} y={385} g={g} at={W("67", "signal")} color={C.tracer} r={120} />
        </g>
        {/* aim lines to front and rear vehicle (57–59, ghost column) */}
        {ghost > 0.05
          ? [
              [longX(7), 1300, "front"],
              [longX(0), 1300 - 4 * COL_GAP, "back"],
            ].map(([x1, x2, w]) => (
              <g key={String(w)} opacity={ease(g, W("58", String(w)), 12) * ghost}>
                <line x1={Number(x1)} y1={LONG.y} x2={Number(x2)} y2={600} stroke={C.red} strokeWidth={4} strokeDasharray="10 10" />
                <rect x={Number(x2) - 55} y={545} width={110} height={110} fill="none" stroke={C.red} strokeWidth={5} />
              </g>
            ))
          : null}
        {/* enfilade demo: fire raking the length of the box (50–52) */}
        {[0, 1, 2].map((i) => (
          <Tracer key={`e${i}`} g={g} seed={i} x1={longX(7)} y1={LONG.y} x2={KZ.x + 40 + i * 30} y2={570 + i * 30} on={W("50", "fire") + i * 4} off={A("53")} w={5} />
        ))}
        {/* short leg stops the patrol walking forward (54) */}
        {[0, 1, 2, 3].map((i) => (
          <Tracer key={`s${i}`} g={g} seed={i + 4} x1={SHORT.x} y1={shortY(i)} x2={1250 - i * 40} y2={585 + i * 10} on={W("54", "forward") + i * 3} off={W("54", "forward") + 60} />
        ))}
        {/* danger area */}
        <g opacity={ease(g, W("55", "area"), 14) * (1 - ease(g, A("57"), 14))}>
          <circle cx={1400} cy={470} r={120} fill={C.red} opacity={0.18} />
          <circle cx={1400} cy={470} r={120} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="14 10" />
        </g>
        {/* the "one person fires now" ghost shot */}
        {/* initiation: anti-armor, then machine guns */}
        <Rocket g={g} x1={longX(7)} y1={LONG.y} x2={1300} y2={600} at={t0 - 10} dur={10} />
        <Rocket g={g} x1={longX(0)} y1={LONG.y} x2={1300 - 4 * COL_GAP} y2={600} at={t0 - 8} dur={10} />
        <Blast g={g} x={1300} y={600} at={t0} />
        <Blast g={g} x={1300 - 4 * COL_GAP} y={600} at={t0 + 2} />
        {Array.from({ length: LONG.n }).map((_, i) => {
          if (i === 0 || i === 7) return null;
          const tgt = vpos(i % 5);
          const cycles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
          return cycles.map((c) => {
            const on = mg + i * 3 + c * 70;
            const off = c === 0 ? on + 140 : on + 34;
            if (on > fireOff) return null;
            return <Tracer key={`${i}-${c}`} g={g} seed={i + c} x1={longX(i)} y1={LONG.y} x2={tgt.x + ((c * 37) % 60) - 30} y2={tgt.y + ((c * 23) % 40) - 20} on={on} off={Math.min(off, fireOff)} />;
          });
        })}
        {Array.from({ length: SHORT.n }).map((_, i) => (
          <Tracer key={`sf${i}`} g={g} seed={i + 20} x1={SHORT.x} y1={shortY(i)} x2={vpos(i).x} y2={vpos(i).y} on={mg + 10 + i * 4} off={W("79", "assault") - 30} />
        ))}
        {/* OODA loop */}
        <g opacity={ease(g, W("73", "observe"), 12) * (1 - crash)}>
          {ooda.map((t, i) => {
            const a = (-90 + i * 90) * (Math.PI / 180);
            const r = 190 + crash * 200;
            const px = 1050 + Math.cos(a) * r;
            const py = 600 + Math.sin(a) * r * 0.75;
            return (
              <g key={t} opacity={ease(g, W("73", t.toLowerCase()), 8)}>
                <path
                  d={`M ${1050 + Math.cos(a - 0.6) * 190} ${600 + Math.sin(a - 0.6) * 142} A 190 142 0 0 1 ${1050 + Math.cos(a + 0.6) * 190} ${600 + Math.sin(a + 0.6) * 142}`}
                  fill="none"
                  stroke={C.blue}
                  strokeWidth={8}
                  transform={`translate(${Math.cos(a) * crash * 160} ${Math.sin(a) * crash * 160}) rotate(${crash * 40 * (i % 2 ? 1 : -1)} 1050 600)`}
                />
                <Tag x={px} y={py} text={t} p={1} size={30} color={C.blue} />
              </g>
            );
          })}
        </g>
        {/* dismounts going down */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const v = vpos(1 + (i % 3));
          return (
            <g key={`d${i}`} opacity={ease(g, mg + 60 + i * 8, 10)}>
              <Soldier x={v.x - 30 + (i % 2) * 60} y={v.y + 55 + (i % 2) * 8} color={C.blue} r={9} down={g > W("78", "down") + i * 4 ? 1 : 0} />
            </g>
          );
        })}
        {/* documents, radios, maps */}
        {(["documents", "radios", "maps"] as const).map((w, i) => {
          const p = ease(g, W("80", w), 12);
          const fly = inOut(g, W("80", w) + 30, W("80", w) + 55);
          const x0 = 1200 + i * 110;
          return (
            <g key={w} opacity={p * (1 - fly)} transform={`translate(${mix(x0, 1250, fly)} ${mix(470, 430, fly)}) scale(${p})`}>
              <rect x={-38} y={-30} width={76} height={60} rx={8} fill="rgba(10,12,9,0.85)" stroke={C.tracer} strokeWidth={3} />
              {i === 0 ? (
                <g stroke={C.text} strokeWidth={4}>
                  <line x1={-18} y1={-12} x2={18} y2={-12} />
                  <line x1={-18} y1={0} x2={18} y2={0} />
                  <line x1={-18} y1={12} x2={8} y2={12} />
                </g>
              ) : i === 1 ? (
                <g>
                  <rect x={-14} y={-12} width={28} height={30} rx={4} fill={C.text} />
                  <line x1={8} y1={-12} x2={14} y2={-26} stroke={C.text} strokeWidth={4} />
                </g>
              ) : (
                <path d="M -24 -16 L -8 -10 L 8 -16 L 24 -10 L 24 16 L 8 10 L -8 16 L -24 10 Z" fill="none" stroke={C.text} strokeWidth={4} />
              )}
            </g>
          );
        })}
        {/* reinforcements */}
        <Arrow d="M -150 600 L 300 600" p={ease(g, W("83", "reinforcements"), 40)} color={C.blue} w={22} />
        <Arrow d="M 2070 600 L 1640 600" p={ease(g, W("83", "reinforcements") + 8, 40)} color={C.blue} w={22} />
        <Arrow d="M 1000 400 C 1000 320, 1000 260, 1000 200" p={ease(g, W("85", "leave"), 30)} color={C.red} w={16} />
        {/* 20 m: inside the camera so it stays on the soldiers when the frame is tight */}
        <Tag x={960} y={LONG.y - 120} text="20 m" p={ease(g, W("65", "twenty"), 10) * (1 - ease(g, A("66") + 20, 10))} size={44} kind="drop" />
        <g opacity={ease(g, W("65", "twenty"), 10) * (1 - ease(g, A("66") + 20, 10))}>
          <line x1={960} y1={LONG.y + 16} x2={960} y2={575} stroke={C.text} strokeWidth={4} strokeDasharray="8 8" />
        </g>
      </g>
      {/* clock */}
      <g opacity={ease(g, W("82", "clock"), 12) * (1 - ease(g, E("85"), 10))} transform="translate(1760 150)">
        <circle r={72} fill="rgba(10,12,9,0.85)" stroke="rgba(255,255,255,0.2)" strokeWidth={6} />
        <circle r={72} fill="none" stroke={C.red} strokeWidth={10} strokeDasharray={`${452 * clock} 452`} transform="rotate(-90)" />
        <line x1={0} y1={0} x2={Math.sin(clock * Math.PI * 8) * 52} y2={-Math.cos(clock * Math.PI * 8) * 52} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
      </g>
      {tags.map(([t, a, b, col]) => (
        <Tag key={t} x={960} y={120} text={t} p={ease(g, a, 12)} out={ease(g, b - 6, 6)} size={58} color={col ?? C.text} kind={t === "HOLD" ? "type" : "rise"} />
      ))}
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 12. Flip it: you're in the patrol (86–97) ═════════════════════════
const PATROL_HEAD = 1500;
const S86: React.FC<{ g: number }> = ({ g }) => {
  const flip = inOut(g, A("86"), A("86") + 24);
  const sx = Math.abs(Math.cos(flip * Math.PI));
  const you = ease(g, W("87", "patrol"), 14);
  const odds = ease(g, W("88", "odds"), 30);
  const contact = W("90", 0);
  const back = ease(g, W("93", "back"), 40);
  const sec = ease(g, W("96", "security"), 14);
  const xed = ease(g, W("97", "expect"), 14);
  const redOp = ease(g, contact, 10);
  const dead = [0, 1, 2, 3, 4].map((i) => (i === 0 || i === 4 ? 1 : 0));
  return (
    <Svg>
      <g transform={`translate(960 0) scale(${Math.max(0.02, sx)} 1) translate(-960 0)`}>
        <LMap g={g} head={PATROL_HEAD} dead={dead} redOp={redOp}>
          <Line x1={LONG.x1} y1={LONG.y} x2={LONG.x2} y2={LONG.y} n={LONG.n} />
        </LMap>
        <g opacity={redOp}>
          <Soldier x={160} y={470} glow={sec} />
          <Soldier x={210} y={470} glow={sec} />
          <Soldier x={260} y={470} glow={sec} />
        </g>
        <g opacity={you}>
          <circle cx={along(ROADX, PATROL_HEAD - 2 * COL_GAP).x} cy={600} r={70} fill="none" stroke={C.blue} strokeWidth={6} />
          <Tag x={along(ROADX, PATROL_HEAD - 2 * COL_GAP).x} y={720} text="YOU" p={you} color={C.blue} size={48} />
        </g>
        {Array.from({ length: LONG.n }).map((_, i) => (
          <Tracer key={i} g={g} seed={i} x1={longX(i)} y1={LONG.y} x2={along(ROADX, PATROL_HEAD - (i % 5) * COL_GAP).x} y2={600} on={contact + i * 2} off={E("97") + 30} />
        ))}
        {Array.from({ length: SHORT.n }).map((_, i) => (
          <Tracer key={`s${i}`} g={g} seed={i + 5} x1={SHORT.x} y1={shortY(i)} x2={along(ROADX, PATROL_HEAD - i * COL_GAP).x} y2={600} on={contact + 4 + i * 3} off={E("97") + 30} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <Soldier key={`b${i}`} x={along(ROADX, PATROL_HEAD - (1 + (i % 3)) * COL_GAP).x - 30 + (i % 2) * 60} y={660} color={C.blue} r={9} down={g > W("91", "down") + i * 3 && i % 2 === 0 ? 1 : 0} />
        ))}
        <Arrow d="M 1050 640 C 800 660, 500 660, 260 620" p={back} color={C.blue} w={14} dash />
        {[0, 1, 2].map((i) => (
          <Tracer key={`w${i}`} g={g} seed={i + 9} x1={160 + i * 50} y1={470} x2={300 + i * 150} y2={640} on={W("96", "security") + i * 3} off={E("97") + 30} />
        ))}
        <Cross x={500} y={650} p={xed} />
      </g>
      <Tag x={960} y={120} text="CONTACT!" p={ease(g, contact, 6)} out={ease(g, A("92") + 20, 8)} size={64} color={C.red} kind="drop" />
      <g opacity={odds * (1 - redOp)} transform="translate(960 870)">
        <rect x={-400} y={-30} width={800} height={60} rx={8} fill="rgba(10,12,9,0.8)" />
        <rect x={-396} y={-26} width={792} height={52} rx={6} fill={C.red} />
        <rect x={-396} y={-26} width={792 * mix(0.5, 0.18, odds)} height={52} rx={6} fill={C.blue} />
        <text x={0} y={-50} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={700} fontSize={44} letterSpacing={4}>
          ODDS
        </text>
        <text x={-400} y={-50} fill={C.blue} fontFamily={COND} fontWeight={800} fontSize={40} letterSpacing={3}>
          YOU
        </text>
        <text x={400} y={-50} textAnchor="end" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={40} letterSpacing={3}>
          THEM
        </text>
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 13. Take cover? (98–102) ═════════════════════════
const S98: React.FC<{ g: number }> = ({ g }) => {
  const side = W("101", "exposed");
  return (
    <Svg>
      <g transform={cam(1.9, 1000, 610)}>
        <LMap g={g} head={PATROL_HEAD} dead={[1, 0, 0, 0, 1]}>
          <Line x1={LONG.x1} y1={LONG.y} x2={LONG.x2} y2={LONG.y} n={LONG.n} />
        </LMap>
        <Rock x={1000} y={672} s={0.9} />
        <Soldier x={1000} y={715} color={C.blue} r={10} glow={ease(g, side, 8)} down={g > side + 14 ? 1 : 0} />
        {[0, 1, 2].map((i) => (
          <Tracer key={i} g={g} seed={i} x1={900 + i * 100} y1={LONG.y} x2={980 + i * 20} y2={650} on={A("98") + i * 5} off={E("102") + 20} />
        ))}
        {[0, 1].map((i) => (
          <Tracer key={`e${i}`} g={g} seed={i + 7} x1={SHORT.x} y1={shortY(i + 2)} x2={1006} y2={714} on={side + i * 3} off={E("102") + 20} />
        ))}
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 14. Push into them (103–111) ═════════════════════════
const S103: React.FC<{ g: number }> = ({ g }) => {
  const push = W("104", "push");
  const move = inOut(g, push, W("106", "chance"));
  const brk = ease(g, W("109", "fall"), 40);
  const even = ease(g, W("111", "even"), 30);
  const blue = [0, 1, 2, 3, 4, 5];
  return (
    <Svg>
      <LMap g={g} head={PATROL_HEAD} dead={[1, 0, 0, 0, 1]}>
        {Array.from({ length: LONG.n }).map((_, i) => (
          <Soldier key={i} x={longX(i) + brk * ((i % 2 ? 1 : -1) * 40)} y={LONG.y - brk * (i % 3) * 30} />
        ))}
      </LMap>
      {blue.map((i) => {
        const x0 = along(ROADX, PATROL_HEAD - (1 + (i % 3)) * COL_GAP).x - 30 + (i % 2) * 60;
        const y0 = mix(650, 500, move);
        return (
          <g key={i}>
            <Soldier x={x0} y={y0} color={C.blue} r={10} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
              <Tracer key={c} g={g} seed={i + c} x1={x0} y1={y0} x2={longX((i + c) % LONG.n)} y2={LONG.y} on={push + 8 + i * 5 + c * 44} off={push + 8 + i * 5 + c * 44 + 16} color="#9fd0ff" w={3} />
            ))}
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const x = 900 + i * 180;
        return <Arrow key={i} d={`M ${x} 680 L ${x} 500`} p={ease(g, push + i * 4, 18)} color={C.blue} w={16} />;
      })}
      {/* their fire lanes: aimed at the road; after the push they no longer meet anyone */}
      {Array.from({ length: LONG.n }).map((_, i) => {
        const a = brk * (i % 2 ? 35 : -35);
        const x2 = longX(i) + Math.sin((a * Math.PI) / 180) * 200;
        return (
          <line key={`f${i}`} x1={longX(i)} y1={LONG.y} x2={x2} y2={LONG.y + 160} stroke={C.red} strokeWidth={4} strokeDasharray="10 10" opacity={ease(g, W("108", "fire"), 14) * 0.9} />
        );
      })}
      <Tag x={960} y={120} text="DISTANCE" p={ease(g, W("107", "distance"), 10)} out={ease(g, W("109", "fall") - 6, 6)} size={56} />
      <Tag x={960} y={120} text="PLAN FALLS APART" p={ease(g, W("109", "fall"), 10)} size={56} color={C.red} out={ease(g, A("111") - 6, 6)} />
      <g opacity={ease(g, A("111"), 14)} transform="translate(960 870)">
        <rect x={-400} y={-30} width={800} height={60} rx={8} fill="rgba(10,12,9,0.8)" />
        <rect x={-396} y={-26} width={792} height={52} rx={6} fill={C.red} />
        <rect x={-396} y={-26} width={792 * mix(0.18, 0.5, even)} height={52} rx={6} fill={C.blue} />
        <text x={0} y={-50} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={700} fontSize={44} letterSpacing={4}>
          ODDS
        </text>
        <text x={-400} y={-50} fill={C.blue} fontFamily={COND} fontWeight={800} fontSize={40} letterSpacing={3}>
          YOU
        </text>
        <text x={400} y={-50} textAnchor="end" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={40} letterSpacing={3}>
          THEM
        </text>
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 15. Drilled until automatic (112–115) ═════════════════════════
/** Drill reps for 112–115: each rep is ~82% the length of the last (min 26 frames): the reaction gets automatic. */
const REPS112: [number, number][] = (() => {
  const out: [number, number][] = [];
  let t = A("112") + 6;
  let d = 80;
  while (t < E("115") - 10) {
    out.push([t, d]);
    t += d;
    d = Math.max(26, Math.round(d * 0.82));
  }
  return out;
})();
const S112: React.FC<{ g: number }> = ({ g }) => {
  const cur = REPS112.filter(([s]) => g >= s).length - 1;
  const ambush = [700, 900, 1100, 1300];
  const squad = [0, 1, 2, 3];
  return (
    <Svg>
      <Terrain seed="drill" tint="#171c14" />
      <Road d="M -200 770 L 2120 770" />
      <Forest x={-200} y={160} w={2320} h={360} seed="d1" density={0.75} dim={0.9} />
      {ambush.map((x, i) => (
        <Soldier key={i} x={x} y={520} />
      ))}
      {REPS112.map(([s, d], r) => {
        if (g < s) return null;
        const k = (g - s) / d;
        const done = r < cur;
        if (done && cur - r > 3) return null;
        const rush = done ? 1 : inOut(g, s + d * 0.16, s + d * 0.8);
        const op = done ? 0.16 * (1 - (cur - r - 1) / 3) : 1;
        return (
          <g key={r} opacity={op}>
            {!done
              ? ambush.map((x, i) => (
                  <Tracer key={i} g={g} seed={i + r} x1={x} y1={530} x2={760 + i * 140} y2={770} on={s + Math.round(d * 0.05)} off={s + Math.round(d * 0.32)} />
                ))
              : null}
            {squad.map((i) => {
              const x = 760 + i * 140 + (done ? 0 : Math.min(1, k / 0.16) * 30);
              const y = mix(770, 575, rush);
              return (
                <g key={i}>
                  {!done && rush > 0 && rush < 1 ? <line x1={x} y1={770} x2={x} y2={y} stroke={C.blue} strokeWidth={6} opacity={0.35} /> : null}
                  <Soldier x={x} y={y} color={C.blue} r={12} />
                </g>
              );
            })}
          </g>
        );
      })}
      <g opacity={ease(g, REPS112[0][0], 10)} transform="translate(1680 150)">
        <rect x={-150} y={-62} width={300} height={124} rx={14} fill="rgba(10,12,9,0.86)" />
        <text x={-110} y={22} fill={C.muted} fontFamily={COND} fontWeight={700} fontSize={44} letterSpacing={6}>
          REP
        </text>
        <text x={110} y={34} textAnchor="end" fill={C.tracer} fontFamily={COND} fontWeight={800} fontSize={88}>
          {Math.max(1, cur + 1)}
        </text>
      </g>
      <Heading text="AUTOMATIC" p={ease(g, W("112", "automatic"), 14)} y={150} size={110} />
      <Tag x={960} y={880} text="DRILLED IN" p={ease(g, W("115", "drilled"), 12)} size={56} color={C.blue} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 16. Far ambush: break contact (116–121) ═════════════════════════
const S116: React.FC<{ g: number }> = ({ g }) => {
  const ret = W("117", "return");
  const brk = W("117", "break");
  const split = ease(g, A("120"), 16);
  const cycle = 60;
  // bounding: two groups leapfrog to the west, one firing while the other moves
  const phase = Math.max(0, g - brk) / cycle;
  const step = Math.floor(phase);
  const frac = phase - step;
  const posA = 1100 - (Math.floor((step + 1) / 2) + (step % 2 === 0 ? frac : 0)) * 150;
  const posB = 1300 - (Math.floor(step / 2) + (step % 2 === 1 ? frac : 0)) * 150;
  const aMoving = g > brk && step % 2 === 0;
  return (
    <Svg>
      <Terrain seed="far" />
      <Road d="M -200 800 L 2120 800" />
      <Forest x={-200} y={-100} w={2320} h={420} seed="f1" />
      <Forest x={-200} y={900} w={2320} h={300} seed="f2" density={0.5} />
      <Line x1={600} y1={290} x2={1400} y2={290} n={8} />
      <g opacity={ease(g, W("116", "fifty"), 14) * (1 - split)}>
        <line x1={1600} y1={300} x2={1600} y2={790} stroke={C.text} strokeWidth={4} />
        <line x1={1570} y1={300} x2={1630} y2={300} stroke={C.text} strokeWidth={4} />
        <line x1={1570} y1={790} x2={1630} y2={790} stroke={C.text} strokeWidth={4} />
        <Tag x={1720} y={545} text="50 m +" p={1} size={50} />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <Tracer key={i} g={g} seed={i} x1={700 + i * 200} y1={290} x2={1100 + i * 60} y2={850} on={A("116") + i * 5} off={E("119")} w={3} />
      ))}
      <Column d="M -200 800 L 2120 800" head={1500} n={4} dead={[1]} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Soldier x={posA + i * 40} y={860 + (aMoving ? 0 : 0)} color={C.blue} r={10} />
          <Soldier x={posB + i * 40} y={880} color="#8ccaff" r={10} />
          <Tracer g={g} seed={i + 4} x1={posA + i * 40} y1={860} x2={800 + i * 200} y2={300} on={ret} off={aMoving ? ret : E("119")} color="#9fd0ff" w={3} />
          <Tracer g={g} seed={i + 8} x1={posB + i * 40} y1={880} x2={900 + i * 200} y2={300} on={ret + 6} off={g > brk && step % 2 === 1 ? ret : E("119")} color="#9fd0ff" w={3} />
        </g>
      ))}
      <Tag x={960} y={120} text="RETURN FIRE" p={ease(g, ret, 10)} out={ease(g, brk - 6, 6)} size={56} color={C.blue} />
      <Tag x={960} y={120} text="ONE COVERS, ONE MOVES" p={ease(g, W("118", "covers"), 10)} out={ease(g, A("120") - 6, 6)} size={56} color={C.blue} />
      <g opacity={split}>
        <rect x={0} y={0} width={1920} height={1080} fill="#0b0e09" opacity={0.88} />
        <line x1={960} y1={260} x2={960} y2={820} stroke="rgba(255,255,255,0.2)" strokeWidth={3} />
        <text x={480} y={470} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={90}>
          CLOSE
        </text>
        <text x={480} y={580} textAnchor="middle" fill={C.blue} fontFamily={COND} fontWeight={700} fontSize={60}>
          PUSH THROUGH
        </text>
        <text x={1440} y={470} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={90}>
          FAR
        </text>
        <text x={1440} y={580} textAnchor="middle" fill={C.blue} fontFamily={COND} fontWeight={700} fontSize={60}>
          BREAK CONTACT
        </text>
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 17. Drones change it (122–124) ═════════════════════════
const S122: React.FC<{ g: number }> = ({ g }) => {
  const fly = lin(g, W("123", "drones"), E("123") + 30);
  const three = ease(g, W("124", "three"), 14);
  return (
    <Svg>
      <g opacity={1 - 0.8 * ease(g, A("123"), 20)}>
        <LMap g={g} head={1500} redOp={0.8}>
          <Line x1={LONG.x1} y1={LONG.y} x2={LONG.x2} y2={LONG.y} n={LONG.n} />
        </LMap>
      </g>
      <Drone x={mix(-150, 2100, fly)} y={mix(780, 300, fly)} a={-20} g={g} s={2.2} />
      <g opacity={three}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${560 + i * 400} 540) scale(${ease(g, W("124", "three") + i * 6, 14)})`}>
            <circle r={110} fill="rgba(10,12,9,0.85)" stroke={C.tracer} strokeWidth={6} />
            <text y={48} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={140}>
              {i + 1}
            </text>
          </g>
        ))}
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 18. The sitting drone (125–133) ═════════════════════════
const S125: React.FC<{ g: number }> = ({ g }) => {
  const strike = W("130", "strike");
  const truck = interpolate(g, [A("130"), strike], [-100, 1060], CLAMP);
  const lift = ease(g, strike - 14, 14);
  const hours = lin(g, W("128", "hours"), E("128"));
  const thermal = ease(g, W("129", "heat"), 10) * (1 - ease(g, A("130"), 12));
  const t2 = W("133", "impact");
  const truck2 = interpolate(g, [A("132"), t2], [-100, 1060], CLAMP);
  const reset = g > A("131");
  const dx = 1110;
  const dy = 600;
  const debris = [
    [1040, 575, 0.4],
    [1180, 625, 0.35],
    [1150, 570, 0.3],
    [990, 630, 0.3],
  ];
  // framed close on the drone (it is the subject of 125–129), one eased pull-back when the vehicle comes (130)
  const wide = inOut(g, A("130"), A("130") + 30);
  return (
    <Svg>
      <g transform={cam(mix(2.1 + 0.4 * lin(g, A("125"), A("130")), 1, wide), mix(1110, 960, wide), mix(560, 540, wide))}>
      <Terrain seed="sit" thermal={thermal} />
      <Road d={ROADX} />
      <Forest x={-200} y={130} w={2320} h={330} seed="sd1" dim={1 - thermal * 0.7} />
      <Forest x={-200} y={740} w={2320} h={400} seed="sd2" dim={1 - thermal * 0.7} />
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.35 * Math.sin(hours * Math.PI)} />
      {/* fiber-optic cable */}
      <path
        d={`M ${dx} ${dy} C 1250 520, 1400 430, 1560 260 S 1800 60, 2050 -40`}
        fill="none"
        stroke="#e7f0ff"
        strokeWidth={3}
        opacity={0.35 + 0.5 * ease(g, W("127", "fiber"), 10) * (1 - ease(g, A("128"), 20))}
        strokeDasharray="4 6"
        strokeDashoffset={-g * 1.5}
      />
      {debris.map(([x, y, s], i) => (
        <Rock key={i} x={x} y={y} s={s} />
      ))}
      {!reset ? (
        <>
          <Column d={ROADX} head={truck} n={1} />
          {g < strike ? (
            <Drone x={mix(dx, truck - 260, lift)} y={dy} s={mix(0.7, 0.9, lift)} g={lift > 0 ? g : 0} shadow={lift * 0.6} />
          ) : null}
          <Blast g={g} x={along(ROADX, truck).x} y={600} at={strike} />
        </>
      ) : (
        <>
          <Column d={ROADX} head={truck2} n={1} />
          <Blast g={g} x={along(ROADX, truck2).x} y={600} at={t2} />
        </>
      )}
      </g>
      <Tag x={960} y={120} text="SITTING DRONE" p={ease(g, W("125", "sitting"), 12)} out={ease(g, A("126") + 10, 6)} size={58} kind="wipe" />
      <Tag x={960} y={120} text="UKRAINE · BOTH SIDES" p={ease(g, W("126", "ukraine"), 12)} out={ease(g, W("127", "fiber") - 6, 6)} size={56} kind="wipe" />
      <Tag x={960} y={120} text="FIBER-OPTIC FPV" p={ease(g, W("127", "fiber"), 12)} out={ease(g, A("128") + 30, 6)} size={56} />
      <Tag x={960} y={120} text="HOURS" p={ease(g, W("128", "hours"), 10)} out={ease(g, A("129"), 6)} size={60} kind="type" />
      <Tag x={960} y={120} text="NO HEAT SIGNATURE" p={ease(g, W("129", "heat"), 10)} out={ease(g, A("130"), 6)} size={56} color={C.hot} />
      <Tag x={960} y={120} text="SUPPLY ROUTES" p={ease(g, W("131", "supply"), 10)} out={ease(g, A("132"), 6)} size={56} />
      <Tag x={960} y={120} text="SURPRISE" p={ease(g, W("132", "surprise"), 10)} out={ease(g, A("133"), 6)} size={60} color={C.red} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 19. Hunter + killer (134–136) ═════════════════════════
const S134: React.FC<{ g: number }> = ({ g }) => {
  const orbit = (g - A("134")) / 50;
  const rx = 1050 + Math.cos(orbit) * 300;
  const ry = 470 + Math.sin(orbit) * 170;
  const found = W("136", "identifies");
  const relay = ease(g, W("136", "relays"), 20);
  const launch = W("136", "launch");
  const hit = Math.max(launch + 40, E("136") - 4);
  const fpvK = inOut(g, launch, hit);
  const fpvD = "M 240 900 C 600 900, 900 800, 1260 600";
  const fpv = along(fpvD, fpvK * 1200);
  const tx = 1260;
  const ty = 600;
  return (
    <Svg>
      <Terrain seed="hk" tint="#232a1d" />
      <Road d="M -200 600 C 500 640, 900 560, 2120 620" />
      <Forest x={1400} y={-100} w={800} h={420} seed="hk1" />
      <Forest x={-200} y={-100} w={700} h={380} seed="hk2" />
      <Vehicle x={tx} y={ty} a={2} dead={g > hit ? 1 : 0} />
      <circle cx={rx + 40} cy={ry + 80} r={150} fill="#cfe8ff" opacity={0.09} />
      <Drone x={rx} y={ry} g={g} s={1.1} a={orbit * 57} />
      <Tag x={rx} y={ry - 90} text="RECON" p={ease(g, W("135", "reconnaissance"), 10)} size={34} />
      <g opacity={ease(g, found, 10) * (g < hit ? 1 : 0)}>
        <rect x={tx - 80} y={ty - 70} width={160} height={140} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="30 70" />
      </g>
      <line x1={rx} y1={ry} x2={240} y2={900} stroke={C.tracer} strokeWidth={4} strokeDasharray="12 12" strokeDashoffset={-g * 3} opacity={relay * (1 - ease(g, hit, 10))} />
      <g transform="translate(240 900)">
        <circle r={34} fill="rgba(10,12,9,0.85)" stroke={C.red} strokeWidth={4} />
        <rect x={-14} y={-10} width={28} height={20} rx={3} fill={C.red} />
      </g>
      {g >= launch && g < hit ? <Drone x={fpv.x} y={fpv.y} g={g} s={0.7} a={fpv.a + 90} /> : null}
      <Tag x={240} y={810} text="STRIKE" p={ease(g, W("135", "strike"), 10)} size={34} color={C.red} />
      <Blast g={g} x={tx} y={ty} at={hit} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 20. The kill zone moves with the target (137–142) ═════════════════════════
const ROAD137 = "M -200 250 L 2120 260";
const S137: React.FC<{ g: number }> = ({ g }) => {
  const unpin = ease(g, W("137", "fixed"), 20);
  const pre = ease(g, W("138", "pre"), 12);
  const t1 = W("139", "demand");
  const t2 = W("140", "field");
  const t3 = W("140", "dug");
  const t4 = W("142", "routine");
  const carAt = (f: number) => along(ROAD137, interpolate(f, [A("137"), E("142")], [100, 2200], CLAMP));
  const walkAt = (f: number) => interpolate(f, [A("137"), E("142")], [0, 120], CLAMP);
  const car = carAt(g);
  const walk = walkAt(g);
  // targets the box locks on, in turn: the vehicle on the road, a squad in the field, a trench, the camp
  const tg = [
    { x: car.x, y: car.y, w: 230, h: 130, label: "ROAD" },
    { x: 860 + walk, y: 540, w: 260, h: 150, label: "FIELD" },
    { x: 1300, y: 800, w: 280, h: 140, label: "DUG-IN" },
    { x: 1690, y: 430, w: 380, h: 190, label: "'SAFE' AREA" },
  ];
  const at = [t1, t2, t3, t4];
  const k = [1, 2, 3].map((i) => inOut(g, at[i] - 4, at[i] + 18));
  const pick = (f: (o: (typeof tg)[number]) => number) => mix(mix(mix(f(tg[0]), f(tg[1]), k[0]), f(tg[2]), k[1]), f(tg[3]), k[2]);
  const bx = pick((o) => o.x);
  const by = pick((o) => o.y);
  const bw = pick((o) => o.w);
  const bh = pick((o) => o.h);
  const boxP = ease(g, t1, 14);
  const step = at.filter((t) => g >= t).length - 1;
  // the drone sits beside the box (not on its label)
  const dx = mix(1000, bx + bw / 2 + 80, ease(g, t1 - 10, 24));
  const dy = mix(700, by - bh / 2 + 10, ease(g, t1 - 10, 24));
  return (
    <Svg>
      <Terrain seed="any" tint="#262e1f" />
      <Road d={ROAD137} />
      <path d="M 1050 820 l 60 -40 60 40 60 -40 60 40 60 -40 60 40 60 -40 60 40" fill="none" stroke="#4a3f2c" strokeWidth={30} strokeLinejoin="round" />
      <Forest x={-200} y={-100} w={2320} h={250} seed="an1" density={0.7} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1550 + i * 90} y={380} width={70} height={50} rx={6} fill="#4f5a3c" stroke="#2b3220" strokeWidth={4} />
      ))}
      {[0, 1, 2].map((i) => (
        <Soldier key={`c${i}`} x={1600 + i * 80} y={480} color={C.blue} r={10} a={-90 + i * 60} />
      ))}
      {[0, 1, 2].map((i) => (
        <Soldier key={`t${i}`} x={1170 + i * 120} y={i % 2 ? 790 : 812} color={C.blue} r={10} />
      ))}
      {[0, 1, 2].map((i) => (
        <Soldier key={`f${i}`} x={800 + i * 60 + walk} y={530 + (i % 2) * 24} color={C.blue} r={10} a={0} />
      ))}
      <Vehicle x={car.x} y={car.y} a={car.a} />
      {/* the old idea: a fixed, pre-selected box on the road that the enemy must enter */}
      <g opacity={1 - 0.6 * unpin}>
        <KillZone x={700} y={190} w={500} h={130} p={1} color={C.red} />
      </g>
      <Cross x={950} y={255} p={pre} s={1.1} />
      {/* ghosts of the places it already struck (where the target was when the box moved on) */}
      {[carAt(t2).x, 860 + walkAt(t3), tg[2].x].map((x, i) =>
        step > i ? (
          <rect key={i} x={x - tg[i].w / 2} y={tg[i].y - tg[i].h / 2} width={tg[i].w} height={tg[i].h} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="12 10" opacity={0.5} />
        ) : null,
      )}
      <g opacity={boxP}>
        <rect x={bx - bw / 2} y={by - bh / 2} width={bw} height={bh} fill={C.red} opacity={0.14 + 0.08 * Math.sin(g / 5)} />
        <rect x={bx - bw / 2} y={by - bh / 2} width={bw} height={bh} fill="none" stroke={C.red} strokeWidth={5} />
        <Tag x={bx} y={step <= 0 ? by + bh / 2 + 46 : by - bh / 2 - 40} text={tg[Math.max(0, step)].label} p={ease(g, at[Math.max(0, step)], 10)} size={40} color={C.red} />
      </g>
      {at.map((t, i) => (
        <Ring key={i} x={tg[i].x} y={tg[i].y} g={g} at={t + 16} color={C.red} r={170} />
      ))}
      <line x1={dx} y1={dy} x2={bx} y2={by} stroke={C.red} strokeWidth={3} strokeDasharray="8 10" opacity={boxP * 0.7} />
      <Drone x={dx} y={dy} g={g} s={1.1} />
      <Tag x={960} y={120} text="ON DEMAND" p={ease(g, t1, 10)} out={ease(g, t2 - 6, 6)} size={58} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 21. Defensive: your own eye in the sky (143–153) ═════════════════════════
const RECAP: [string, string][] = [
  ["01", "THE GROUND DECIDES MOST OF IT"],
  ["02", "CLOSE: PUSH THROUGH · FAR: BREAK CONTACT"],
  ["03", "DRONES MAKE THE KILL ZONE MOVE"],
];
const AVOID = "M 1100 880 C 900 700, 900 500, 1100 200";
const ROADD = "M -200 920 C 500 920, 900 910, 1150 860 C 1450 800, 1560 650, 1560 480 C 1560 320, 1500 200, 1400 -100";
const S143: React.FC<{ g: number }> = ({ g }) => {
  const walk = 300 + (g - A("143")) * 0.9;
  const squad = Math.min(walk, 1050);
  const pair = ease(g, W("145", "pair"), 14);
  const pairX = interpolate(g, [W("145", "pair"), A("146")], [0, 260], CLAMP);
  const launch = W("146", "launched");
  const dK = inOut(g, launch, launch + 90);
  const dPath = "M 1000 900 C 1200 820, 1400 700, 1500 560";
  const dr = along(dPath, dK * 640);
  const focus = inOut(g, A("147"), A("147") + 30) * (1 - inOut(g, A("151") + 20, A("151") + 60));
  const thermal = ease(g, W("150", "thermal"), 16) * (1 - ease(g, W("151", "identified"), 20));
  const found = ease(g, W("151", "identified"), 12);
  const avoid = ease(g, W("152", "avoided"), 30);
  const counter = ease(g, W("152", "counter"), 30);
  const end = ease(g, W("153", "standard"), 30);
  const rS = E("153") + 20;
  const rE = rS + Math.round(4.5 * FPS);
  const recapIn = ease(g, rS - 6, 12);
  const sway = Math.sin(g / 9) * 3 * ease(g, W("149", "subtle"), 10);
  const hide = mix(0.12, 1, Math.max(thermal, found));
  const feed = ease(g, A("148"), 14) * (1 - ease(g, A("152") + 20, 12));
  const thP = ease(g, W("150", "thermal"), 16);
  const pipX = (i: number) => 280 + ((i % 2) * 50 - 25) * 2.6 + sway * 2.6;
  const pipY = (i: number) => 160 + (i * 70 - 105) * 1.15;
  return (
    <Svg>
      {/* wide frame centred 110 px lower so the squad on the road clears the subtitles */}
      <g transform={cam(mix(1, 1.6, focus), mix(960, 1480, focus), mix(650, 470, focus))}>
        <Terrain seed="def" thermal={thermal} />
        <Road d={ROADD} />
        <Forest x={1640} y={-100} w={500} h={1300} seed="df1" density={1.2} dim={1 - thermal * 0.75} />
        <Forest x={-200} y={-100} w={1300} h={620} seed="df2" density={0.8} dim={1 - thermal * 0.75} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} opacity={hide}>
            <Soldier x={1700 + (i % 2) * 50 + sway} y={420 + i * 70} glow={thermal} color={thermal > 0.5 ? C.hot : C.red} a={180} />
          </g>
        ))}
        {/* the tree line the VO names (147), then the drone's eye sweeps it until something is found */}
        <ellipse cx={1725} cy={525} rx={130} ry={220} fill="none" stroke={C.tracer} strokeWidth={4} strokeDasharray="16 12" opacity={ease(g, A("147"), 12) * (1 - ease(g, A("148") + 40, 14))} />
        <Cone id="c143" x={dr.x} y={dr.y} a={found > 0 ? -10 : -10 + 26 * Math.sin((g - launch - 60) / 20) * ease(g, launch + 60, 30)} len={420 * ease(g, launch + 60, 30)} spread={28} op={1 - thermal} />
        {[0, 1, 2, 3].map((i) => (
          <Ring key={`m${i}`} x={1700 + (i % 2) * 50} y={420 + i * 70} g={g} at={W("149", "movement") + i * 14} color={C.tracer} r={80} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          // halted while the drone looks, scanning outward; then they walk the detour (152)
          const sA = (g - W("152", "avoided")) * 1.8 - i * 45;
          if (sA > 0) {
            const q = along(AVOID, sA);
            return <Soldier key={i} x={q.x} y={q.y} color={C.blue} r={10} a={q.a} />;
          }
          const p = along(ROADD, squad - i * 45);
          return <Soldier key={i} x={p.x} y={p.y + (i % 2 ? 14 : -14)} color={C.blue} r={10} a={walk < 1050 ? 0 : -90 + (i % 2 ? 50 : -50) + 25 * Math.sin(g / 60 + i)} />;
        })}
        <g opacity={pair * (1 - ease(g, A("146"), 10))}>
          {[0, 1].map((i) => {
            const p = along(ROADD, squad + 120 + pairX + i * 40);
            return <Soldier key={i} x={p.x} y={p.y} color={C.blue} r={10} />;
          })}
          <Cross x={along(ROADD, squad + 160 + pairX).x} y={along(ROADD, squad + 160 + pairX).y} p={ease(g, W("145", "pair") + 20, 12)} s={0.6} />
        </g>
        <Drone x={g < launch ? 1000 : dr.x} y={g < launch ? 900 : dr.y} g={g} s={0.8} color={C.blue} shadow={dK} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={`b${i}`} x={1675 + (i % 2) * 50} y={395 + i * 70} width={50} height={50} fill="none" stroke={C.red} strokeWidth={4} opacity={found * (1 - end)} />
        ))}
        <Arrow d={AVOID} p={avoid} color={C.blue} w={14} dash />
        {[0, 1, 2].map((i) =>
          [0, 1, 2, 3].map((c) => (
            <Tracer key={`${i}-${c}`} g={g} seed={i + c} x1={1300 + i * 40} y1={840 - i * 30} x2={1700 + (c % 2) * 50} y2={420 + c * 70} on={W("152", "counter") + 10 + i * 6 + c * 38} off={W("152", "counter") + 26 + i * 6 + c * 38} color="#9fd0ff" w={3} />
          )),
        )}
        <Arrow d="M 1300 840 C 1500 760, 1620 680, 1660 560" p={counter} color={C.blue} w={14} />
      </g>
      {/* picture-in-picture: what the drone camera sees; daylight, then thermal shows the men under the canopy */}
      {feed > 0 ? (
        <g opacity={feed} transform={`translate(70 ${170 + (1 - feed) * 30})`}>
          <defs>
            <clipPath id="pip143">
              <rect width={560} height={320} rx={10} />
            </clipPath>
            <radialGradient id="hot143">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#ffe08a" />
              <stop offset="70%" stopColor="#ff7a2a" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ff7a2a" stopOpacity={0} />
            </radialGradient>
          </defs>
          <g clipPath="url(#pip143)">
            <rect width={560} height={320} fill="#1f2b19" />
            {[0, 1, 2, 3].map((i) => (
              <Soldier key={i} x={pipX(i)} y={pipY(i)} r={16} />
            ))}
            <Forest x={-40} y={-40} w={640} h={400} seed="pip" density={1.4} dim={1 - 0.8 * thP} />
            <rect width={560} height={320} fill="#08101f" opacity={thP * 0.82} />
            {[0, 1, 2, 3].map((i) => (
              <g key={`h${i}`}>
                <circle cx={pipX(i)} cy={pipY(i)} r={40} fill="url(#hot143)" opacity={thP * (0.8 + 0.2 * Math.sin(g / 4 + i))} />
                <Ring x={pipX(i)} y={pipY(i)} g={g} at={W("149", "movement") + i * 14} color={C.tracer} r={60} />
                <rect x={pipX(i) - 40} y={pipY(i) - 40} width={80} height={80} fill="none" stroke={C.red} strokeWidth={4} opacity={found} />
              </g>
            ))}
            <line x1={280} y1={130} x2={280} y2={190} stroke="#fff" strokeWidth={2} opacity={0.6} />
            <line x1={250} y1={160} x2={310} y2={160} stroke="#fff" strokeWidth={2} opacity={0.6} />
            <rect y={(g * 5) % 320} width={560} height={3} fill="#fff" opacity={0.08} />
          </g>
          <rect width={560} height={320} rx={10} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={3} />
          <circle cx={26} cy={28} r={8} fill={C.red} opacity={0.5 + 0.5 * Math.sin(g / 5)} />
          <text x={44} y={37} fill={C.text} fontFamily={COND} fontWeight={700} fontSize={28} letterSpacing={4}>
            DRONE FEED
          </text>
          <text x={540} y={37} textAnchor="end" fill={thP > 0.5 ? C.hot : C.text} fontFamily={COND} fontWeight={700} fontSize={28} letterSpacing={4}>
            {thP > 0.5 ? "THERMAL" : "DAY"}
          </text>
        </g>
      ) : null}
      <Tag x={960} y={120} text="DEFENSIVE" p={ease(g, W("143", "defensive"), 12)} out={ease(g, A("145"), 6)} size={60} color={C.blue} kind="wipe" />
      <Tag x={960} y={120} text="THERMAL" p={ease(g, W("150", "thermal"), 10)} out={ease(g, A("151"), 6)} size={60} color={C.hot} kind="type" />
      <Tag x={960} y={120} text="THREAT FOUND" p={found} out={ease(g, A("153"), 6)} size={58} color={C.red} />
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={end * 0.6 + recapIn * 0.25} />
      <Heading text="HOW AMBUSHES" sub="ACTUALLY WORK" p={end} out={recapIn} y={500} size={150} />
      {/* recap of the three rules, then the closing title (room below it for YouTube end-screen elements) */}
      <g opacity={1 - ease(g, rE, 12)}>
        {RECAP.map(([n, t], i) => {
          const p = ease(g, rS + i * 12, 16);
          return (
            <g key={n} opacity={p} transform={`translate(${(1 - p) * -60} 0)`}>
              <text x={330} y={420 + i * 150} fill={C.tracer} fontFamily={COND} fontWeight={800} fontSize={76}>
                {n}
              </text>
              <text x={450} y={420 + i * 150} fill={C.text} fontFamily={COND} fontWeight={800} fontSize={64} letterSpacing={3}>
                {t}
              </text>
            </g>
          );
        })}
      </g>
      <Heading text="HOW AMBUSHES" sub="ACTUALLY WORK" p={ease(g, rE + 6, 20)} y={330} size={120} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ scene list ═════════════════════════
const SCENES: [string, React.FC<{ g: number }>][] = [
  ["01", S01],
  ["04", S04],
  ["05", S05],
  ["07", S07],
  ["12", S12],
  ["21", S21],
  ["24", S24],
  ["25", S25],
  ["27", S27],
  ["29", S29],
  ["35", S35],
  ["39", S39],
  ["46", S46],
  ["86", S86],
  ["98", S98],
  ["103", S103],
  ["112", S112],
  ["116", S116],
  ["122", S122],
  ["125", S125],
  ["134", S134],
  ["137", S137],
  ["143", S143],
];
const XF = 8; // crossfade frames
const sceneStart = (i: number) => (i === 0 ? 0 : A(SCENES[i][0]) - 10);

const SceneWrap: React.FC<{ from: number; first: boolean; C: React.FC<{ g: number }> }> = ({ from, first, C: Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], CLAMP) }}>
      <Comp g={f + from} />
    </AbsoluteFill>
  );
};

// ═════════════════════════ overlays on the whole video ═════════════════════════
/** "What do you do?" row (93–106): the instincts get crossed out as the VO rules them out, then the answer. */
const Choices: React.FC = () => {
  const g = useCurrentFrame();
  const inP = ease(g, A("93"), 14) * (1 - ease(g, A("107") - 6, 8));
  if (inP <= 0) return null;
  const reveal = ease(g, W("104", "push"), 10);
  const items = [
    { t: "GO BACK", on: [A("93"), A("98")], x: ease(g, W("95", "covered"), 10) },
    { t: "TAKE COVER", on: [A("98"), E("102")], x: ease(g, W("102", "safe"), 10) },
    { t: reveal > 0.5 ? "PUSH THROUGH" : "?", on: [E("102"), A("107")], x: 0 },
  ];
  const w = [250, 330, 390];
  const gap = 34;
  const total = w[0] + w[1] + w[2] + 2 * gap;
  const pulse = 0.5 + 0.5 * Math.sin(g / 5);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={inP}>
          <text x={960} y={66} textAnchor="middle" fill={C.muted} fontFamily={COND} fontWeight={700} fontSize={34} letterSpacing={8}>
            WHAT DO YOU DO?
          </text>
          {items.map((it, i) => {
            const x0 = 960 - total / 2 + w.slice(0, i).reduce((a, b) => a + b + gap, 0);
            const active = g >= it.on[0] && g < it.on[1];
            const last = i === 2;
            const stroke = last && reveal > 0 ? C.blue : active ? C.tracer : "rgba(255,255,255,0.18)";
            const fg = it.x > 0.5 ? "#7a7a72" : last && reveal > 0 ? C.blue : last ? C.tracer : C.text;
            return (
              <g key={i} opacity={ease(g, A("93") + i * 5, 10)}>
                <rect x={x0} y={84} width={w[i]} height={76} rx={10} fill="rgba(10,12,9,0.88)" stroke={stroke} strokeWidth={last && !reveal && active ? 3 + 3 * pulse : 4} />
                <text x={x0 + w[i] / 2} y={140} textAnchor="middle" fill={fg} fontFamily={COND} fontWeight={800} fontSize={52} letterSpacing={3}>
                  {it.t}
                </text>
                {it.x > 0 ? <line x1={x0 + 20} y1={122} x2={x0 + 20 + (w[i] - 40) * it.x} y2={122} stroke={C.red} strokeWidth={7} /> : null}
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Chapter cards in the pause before each chapter, plus a thin chapter progress strip at the top edge. */
const CHAPTERS: [string, string, string][] = [
  ["21", "20", "LOCATION AND TERRAIN"],
  ["39", "38", "SETTING UP AN AMBUSH"],
  ["86", "85", "RESPONDING TO AN AMBUSH"],
  ["122", "121", "THE DRONE AMBUSH"],
];
const ChapterCards: React.FC = () => {
  const g = useCurrentFrame();
  const starts = CHAPTERS.map(([id]) => A(id));
  const cur = starts.filter((s) => g >= s - 30).length - 1; // chapter index (−1 = intro)
  const card = CHAPTERS.map(([id, prev], i) => ({ i, p: ease(g, E(prev) + 3, 10) * (1 - ease(g, A(id) - 6, 8)) })).find((c) => c.p > 0);
  const strip = ease(g, starts[0] - 30, 20);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {card ? (
          <g opacity={card.p}>
            <rect x={0} y={0} width={1920} height={1080} fill="#0b0e09" />
            <text x={960} y={400} textAnchor="middle" fill={C.tracer} fontFamily={COND} fontWeight={700} fontSize={46} letterSpacing={12}>
              {`CHAPTER 0${card.i + 1}`}
            </text>
            <Heading text={CHAPTERS[card.i][2]} p={card.p} y={560} size={120} />
            {CHAPTERS.map((_, k) => (
              <rect key={k} x={960 - 2 * 216 + k * 216 + 8} y={680} width={200} height={10} rx={5} fill={k < card.i ? C.muted : k === card.i ? C.tracer : "rgba(255,255,255,0.15)"} />
            ))}
          </g>
        ) : null}
        {cur >= 0 ? (
          <g opacity={strip * 0.75}>
            {CHAPTERS.map((_, k) => {
              const a = starts[k];
              const b = k + 1 < starts.length ? starts[k + 1] : ambushDuration - END_EXTRA * FPS;
              const fill = interpolate(g, [a, b], [0, 1], CLAMP);
              const x = 8 + k * 478;
              return (
                <g key={k}>
                  <rect x={x} y={8} width={470} height={6} rx={3} fill="rgba(255,255,255,0.14)" />
                  <rect x={x} y={8} width={470 * fill} height={6} rx={3} fill={k === cur ? C.tracer : C.muted} />
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

/** One real case per chapter (sources: Test/ambush/FACTS-real-cases.md), shown while the VO explains the same idea. */
const CASES: { from: string; to: string; label: string; title: string; lines: string[] }[] = [
  { from: "31", to: "32", label: "REAL CASE", title: "TEUTOBURG FOREST · 9 AD", lines: ["Caught on a narrow strip", "between hill and bog", "3 Roman legions destroyed"] },
  { from: "46", to: "48", label: "REAL CASE", title: "RAATE ROAD · JAN 1940", lines: ["A Soviet division stuck to one road", 'cut into pockets ("motti")'] },
  { from: "88", to: "89", label: "REAL CASE", title: "LZ ALBANY · 17 NOV 1965", lines: ["US battalion ambushed", "while marching in column", "about 155 killed"] },
  { from: "104", to: "106", label: "DOCTRINE", title: "US ARMY BATTLE DRILL", lines: ["Near ambush: assault through", "Far ambush: break contact"] },
  { from: "126", to: "127", label: "REAL CASE", title: "UKRAINE · 2025", lines: ['"Waiting drones" parked by roads', "on standby for hours"] },
];
const CaseCards: React.FC = () => {
  const g = useCurrentFrame();
  // the doctrine card waits for "push": earlier it would give away the answer to "what do you do?"
  const start = (k: (typeof CASES)[number]) => (k.label === "DOCTRINE" ? W("104", "push") + 14 : A(k.from) + 4);
  const c = CASES.find((k) => g >= start(k) - 8 && g < E(k.to) + 14);
  if (!c) return null;
  const p = ease(g, start(c), 16) * (1 - ease(g, E(c.to) - 4, 12));
  const h = 120 + c.lines.length * 44;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={p} transform={`translate(${(1 - p) * 90} 0)`}>
          <rect x={1370} y={196} width={510} height={h} rx={12} fill="rgba(10,12,9,0.9)" stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
          <rect x={1370} y={196} width={8} height={h} rx={4} fill={c.label === "DOCTRINE" ? C.blue : C.tracer} />
          <text x={1402} y={238} fill={c.label === "DOCTRINE" ? C.blue : C.tracer} fontFamily={COND} fontWeight={700} fontSize={26} letterSpacing={6}>
            {c.label}
          </text>
          <text x={1402} y={290} fill={C.text} fontFamily={COND} fontWeight={800} fontSize={44} letterSpacing={1}>
            {c.title}
          </text>
          {c.lines.map((l, i) => (
            <text key={i} x={1402} y={340 + i * 44} fill={C.text} opacity={0.82} fontFamily={COND} fontWeight={600} fontSize={34}>
              {l}
            </text>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═════════════════════════ subtitles ═════════════════════════
type Chunk = { text: string; from: number; to: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const l of LINES) {
    const t = toks(l.id);
    let cur: number[] = [];
    const groups: number[][] = [];
    t.forEach((w, k) => {
      cur.push(k);
      if (cur.length >= 6 || /[,.!?:;]$/.test(w) || k === t.length - 1) {
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

/** Terms the viewer should keep: shown in tracer yellow inside the subtitles. */
const KEYWORDS = [
  "kill zone", "enfilade", "support element", "short leg", "security", "discipline", "suppression", "assault",
  "withdrawal", "concealment", "cover", "location", "chokepoint", "push", "break contact", "sitting drone",
  "fiber-optic", "thermal", "reconnaissance", "defensive", "L-shaped",
];
const KEY_RE = new RegExp(String.raw`\b(${KEYWORDS.join("|")})\b`, "i");
const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const c = CHUNKS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 46,
          color: "#fff",
          background: "rgba(0,0,0,0.62)",
          padding: "10px 26px",
          borderRadius: 10,
          letterSpacing: 0.2,
        }}
      >
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

// ═════════════════════════ sound ═════════════════════════
const SX = (n: string) => `sfx/synth/${n}.wav`;
const SoundTrack: React.FC = () => {
  const hit01 = W("01", "late");
  const t68 = W("68", "anti");
  const mg = W("69", "machine");
  const cues: [string, number, number?][] = [
    [SX("radio-static"), W("01", "ambush") - 4, -24],
    ["sfx/explosion/short-explosion-1694.mp3", hit01, -16],
    // the freeze after the hit: ringing ears; the gunfire resumes when time does (line 02)
    [SX("ear-ring"), hit01 + 3, -22],
    [SX("mg-burst-long"), A("02") - 6, -21],
    [SX("rifles-distant"), A("02") + 20, -26],
    // sub hits: chapter cards, the answer to "what do you do?", the recap
    ...CHAPTERS.map(([, prev]) => [SX("sub-hit"), E(prev) + 3, -17] as [string, number, number]),
    [SX("sub-hit"), W("104", "push"), -19],
    [SX("sub-hit"), E("153") + 20, -18],
    [SX("mg-burst-short"), W("04", "unfolds"), -24],
    [SX("drone-buzz"), W("04", "drones"), -26],
    [SX("mg-burst-long"), W("16", "box") + 4, -21],
    ["sfx/explosion/explosive-impact-from-afar-2758.mp3", W("16", "box") + 14, -20],
    [SX("mg-burst-short"), W("26", "wrong"), -26],
    [SX("rifle-double"), W("36", "hides") + 26, -22],
    [SX("rifle-double"), W("36", "hides") + 58, -24],
    [SX("rifle-double"), W("37", "stops"), -22],
    [SX("rifle-double"), W("37", "stops") + 28, -24],
    ["sfx/arrow/metal-arrow-hit-2769.mp3", W("37", "stops") + 4, -22],
    // drill reps (112–115): a short burst on each, closer together as the reaction gets automatic
    ...REPS112.map(([s, d]) => [SX("rifle-double"), s + Math.round(d * 0.05), -27] as [string, number, number]),
    [SX("mg-sustained"), W("44", "fire"), -22],
    [SX("mg-burst-short"), W("50", "fire"), -24],
    [SX("mg-burst-short"), W("54", "forward"), -24],
    [SX("radio-static"), W("67", "signal") - 2, -20],
    ["sfx/explosion/bomb-explosion-in-battle-2800.mp3", t68, -15],
    ["sfx/explosion/short-explosion-1694.mp3", t68 + 2, -17],
    [SX("mg-sustained"), mg, -18],
    [SX("mg-burst-long"), mg + 50, -20],
    [SX("mg-sustained"), mg + 120, -22],
    [SX("rifles-distant"), A("71"), -24],
    [SX("mg-sustained"), A("75"), -24],
    [SX("mg-burst-long"), A("77"), -24],
    [SX("radio-static"), W("90", 0) - 4, -18],
    [SX("mg-sustained"), W("90", 0), -19],
    [SX("rifles-distant"), A("92"), -24],
    [SX("mg-burst-long"), W("96", "security"), -21],
    [SX("rifle-double"), A("98") + 2, -22],
    [SX("mg-burst-short"), W("101", "exposed"), -21],
    [SX("rifles-distant"), A("116"), -26],
    [SX("rifle-double"), W("117", "return"), -22],
    [SX("drone-buzz"), W("123", "drones") - 20, -20],
    [SX("fpv-dive"), W("130", "strike") - 60, -22],
    ["sfx/explosion/short-explosion-1694.mp3", W("130", "strike"), -16],
    [SX("fpv-dive"), W("133", "impact") - 60, -24],
    ["sfx/explosion/explosive-impact-from-afar-2758.mp3", W("133", "impact"), -18],
    [SX("drone-buzz"), A("134"), -28],
    [SX("radio-static"), W("136", "relays"), -22],
    [SX("fpv-dive"), W("136", "launch"), -22],
    ["sfx/explosion/short-explosion-1694.mp3", Math.max(W("136", "launch") + 40, E("136") - 4), -16],
    [SX("drone-buzz"), W("146", "launched"), -26],
  ];
  return (
    <>
      {cues.map(([file, at, level], i) => (
        <Sfx key={i} file={file} at={at} level={level} align={file.includes("/synth/") ? "start" : "onset"} />
      ))}
      <Sfx file="sfx/vehicle/truck-driving-steady-1621.mp3" at={A("60")} level={-30} seconds={(t68 - A("60")) / FPS} />
      <Sfx file="sfx/amb-air/meadow-wind-light-1166.mp3" at={0} level={-34} seconds={20} />
      {/* low pulse under the hold (63–67), cut just before the anti-armor fires */}
      <Sfx file={SX("heartbeat-low")} at={A("63")} level={-23} seconds={(t68 - 24 - A("63")) / FPS} />
    </>
  );
};

export const Ambush: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  const t0 = W("68", "anti");
  const quiet = A("75") + 60;
  const hit01 = W("01", "late");
  const music = (f: number) =>
    // rises chapter by chapter
    interpolate(f, [A("21"), A("39"), A("86"), A("122")], [0.85, 0.95, 1.05, 1.12], CLAMP) *
    // near silence on the cold-open freeze
    interpolate(f, [hit01 - 2, hit01 + 4, A("02") - 8, A("02") + 10], [1, 0.12, 0.12, 1], CLAMP) *
    // the music drops out a beat before the anti-armor, then sits low under the heavy fire
    interpolate(f, [t0 - 50, t0 - 22, t0 + 15, quiet, quiet + 60], [1, 0.03, 0.45, 0.45, 1], CLAMP) *
    // a held breath after "no truly safe spot"
    interpolate(f, [E("102"), E("102") + 10, W("104", "push") - 4, W("104", "push") + 6], [1, 0.4, 0.4, 1], CLAMP) *
    // fade over the end screen
    interpolate(f, [ambushDuration - 90, ambushDuration], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map(([id, Comp], i) => {
        const from = sceneStart(i);
        const to = i + 1 < SCENES.length ? sceneStart(i + 1) + XF : ambushDuration;
        return (
          <Sequence key={id} from={from} durationInFrames={to - from} name={`Scene ${id}`}>
            <SceneWrap from={from} first={i === 0} C={Comp} />
          </Sequence>
        );
      })}
      <Choices />
      <CaseCards />
      <ChapterCards />
      {subtitles ? <Subtitles /> : null}
      <Audio src={staticFile("voiceover/ambush/vo.mp3")} name="VO" />
      <MusicBed file="sfx/music/own/ambush-tension.mp3" level={-31} duck={music} />
      <SoundTrack />
    </AbsoluteFill>
  );
};
