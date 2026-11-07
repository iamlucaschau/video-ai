/**
 * "How an Aircraft Carrier Defends Itself" (Test/carrier, 2026-11-05): 16:9 top-down naval explainer, ~10:40.
 * Script by Lucas (fact-checked: Test/carrier/FACTS-carrier.md). Same pipeline as Test/ambush: every cue comes from
 * the VO, A(id) line start, E(id) line end, W(id, word) the frame a word is spoken (src/voiceover/carrier.words.json).
 */
import { Audio, Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import timing from "../../voiceover/carrier.timing.json";
import WORDS from "../../voiceover/carrier.words.json";
import { MusicBed, Sfx } from "../../series/pvr/sfx";
import { Blast, C, CLAMP, COND, Check, ease, Heading, INTER, inOut, lin, Ring, Tag, Tracer, Vignette } from "../Ambush/kit";
import MAPS from "./maps.json";
import SHOTS3D from "./shots3d.json";
import { Blip, Carrier, Chute, Ciws, DataLink, Jet, Land, Missile, mpos, N, RadarSweep, RangeRing, Sea, Sub, Vls, Warship } from "./navkit";

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
const END_EXTRA = 5; // end screen after the last word
export const carrierDuration = Math.ceil((timing.durationInSeconds + ((timing as { tail?: number }).tail ?? 0) + END_EXTRA) * FPS);

const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const cam = (s: number, cx: number, cy: number) => `translate(960 540) scale(${s}) translate(${-cx} ${-cy})`;
const camPath = (g: number, keys: [number, number, number, number][], dur = 26) => {
  let [, s, x, y] = keys[0];
  for (const [f, ks, kx, ky] of keys.slice(1)) {
    const k = inOut(g, f, f + dur);
    s = mix(s, ks, k);
    x = mix(x, kx, k);
    y = mix(y, ky, k);
  }
  return cam(s, x, y);
};
/** Scene canvas with a slow, bounded camera float. */
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const s = 1.06 + 0.025 * Math.sin(f / 200);
  const x = 34 * Math.sin(f / 150);
  const y = 18 * Math.sin(f / 190 + 1);
  return (
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
      <g transform={`translate(${(960 + x).toFixed(2)} ${(540 + y).toFixed(2)}) scale(${s.toFixed(4)}) translate(-960 -540)`}>{children}</g>
    </svg>
  );
};
const Big: React.FC<{ x: number; y: number; text: string; p: number; size?: number; color?: string; anchor?: "start" | "middle" | "end" }> = ({ x, y, text, p, size = 120, color = C.text, anchor = "middle" }) =>
  p > 0 ? (
    <text x={x} y={y + (1 - p) * 30} textAnchor={anchor} opacity={p} fill={color} stroke="#05090d" strokeWidth={size * 0.07} paintOrder="stroke" fontFamily={COND} fontWeight={800} fontSize={size} letterSpacing={3}>
      {text}
    </text>
  ) : null;

// ═════════════════════════ fleet layout (fleet view: carrier in the centre, bow east) ═════════════════════════
const CV = { x: 960, y: 560 };
const ESC: { k: "cruiser" | "destroyer" | "supply"; x: number; y: number; name: string }[] = [
  { k: "cruiser", x: 1330, y: 500, name: "CRUISER" },
  { k: "destroyer", x: 650, y: 390, name: "DESTROYER" },
  { k: "destroyer", x: 690, y: 770, name: "DESTROYER" },
  { k: "destroyer", x: 1180, y: 820, name: "DESTROYER" },
  { k: "supply", x: 820, y: 640, name: "SUPPLY" },
];
const SUBP = { x: 1560, y: 650 };
const R1 = 520; // fighters
const R2 = 360; // missile wall
const R3 = 170; // last kilometres

/** The strike group on the open sea; `show` fades groups of ships in. */
const Fleet: React.FC<{ g: number; esc?: number[]; sub?: number; cv?: number; drift?: number; parked?: number; tint?: string; night?: number; escColor?: string; cap?: number }> = ({
  esc = [1, 1, 1, 1, 1],
  sub = 0,
  cv = 1,
  drift = 0,
  parked = 1,
  tint,
  night = 0,
  escColor = N.friend,
  cap = 0,
}) => {
  const f = useCurrentFrame();
  // station-keeping: every ship drifts and yaws a little around its slot
  const sway = (i: number) => ({ x: 4 * Math.sin(f / 90 + i * 1.7), y: 6 * Math.sin(f / 70 + i * 1.3), a: 1.4 * Math.sin(f / 110 + i) });
  return (
  <>
    <g transform={`translate(${-drift} 0)`}>
      <Sea seed="fleet" tint={tint} night={night} />
    </g>
    {sub > 0 ? (
      <g opacity={sub}>
        <Sub x={SUBP.x} y={SUBP.y} depth={1} s={1.2} />
      </g>
    ) : null}
    {ESC.map((e, i) => (
      <g key={i} opacity={esc[i] ?? 0}>
        <Warship x={e.x + sway(i).x} y={e.y + sway(i).y} a={sway(i).a} kind={e.k} s={1.3} color={escColor} />
      </g>
    ))}
    <g opacity={cv}>
      <Carrier x={CV.x + sway(9).x * 0.5} y={CV.y + sway(9).y * 0.5} a={sway(9).a * 0.5} s={1.1} parked={parked} />
    </g>
    {cap > 0
      ? [0, 1, 2].map((i) => {
          const a = f / 120 + (i * Math.PI * 2) / 3;
          return (
            <g key={`cap${i}`} opacity={cap}>
              <Jet x={CV.x + Math.cos(a) * R1 * 1.15} y={CV.y + Math.sin(a) * R1 * 0.9} a={(a * 180) / Math.PI + 90} s={0.8} />
            </g>
          );
        })
      : null}
  </>
  );
};

// ═════════════════════════ 1. Hook: one ship, everyone wants it sunk (01–02) ═════════════════════════
const THREATS: [number, number, "bomber" | "missile" | "sub"][] = [
  [-200, 120, "bomber"],
  [2120, 200, "missile"],
  [2100, 980, "bomber"],
  [-180, 900, "missile"],
  [960, -160, "missile"],
  [1700, 1240, "sub"],
];
const C01: React.FC<{ g: number }> = ({ g }) => {
  const enemy = W("01", "enemy");
  const q = ease(g, W("02", "kill"), 12) * (1 - ease(g, A("03") - 6, 8));
  // tight on the carrier, then pull back on "enemy" so the threats closing in are seen
  const zoom = mix(1.9, 0.95, inOut(g, enemy - 10, enemy + 40));
  return (
    <Svg>
      <g transform={cam(zoom, CV.x, CV.y)}>
        <Sea seed="hook" />
        <Carrier x={CV.x} y={CV.y} s={1.1} glow={ease(g, W("01", "planes"), 12) * (1 - ease(g, enemy, 12))} />
        {THREATS.map(([x, y, k], i) => {
          const p = inOut(g, enemy + i * 5, enemy + 80 + i * 5);
          const pos = mpos(x, y, CV.x, CV.y, p * 0.62, 40);
          return k === "sub" ? (
            <g key={i} opacity={ease(g, enemy + i * 5, 10)}>
              <Sub x={pos.x} y={pos.y} a={pos.a} color={N.foe} depth={0.6} s={1.3} />
            </g>
          ) : k === "bomber" ? (
            <g key={i} opacity={ease(g, enemy + i * 5, 10)}>
              <Jet x={pos.x} y={pos.y} a={pos.a} kind="bomber" color={N.foe} s={0.8} />
            </g>
          ) : (
            <g key={i} opacity={ease(g, enemy + i * 5, 10)}>
              <Missile g={g} x1={x} y1={y} x2={mpos(x, y, CV.x, CV.y, 0.62, 40).x} y2={mpos(x, y, CV.x, CV.y, 0.62, 40).y} at={enemy + i * 5} dur={80} bend={40} s={2} linger={400} />
            </g>
          );
        })}
      </g>
      <Tag x={960} y={150} text="65 PLANES · 1 SHIP" p={ease(g, W("01", "planes"), 12)} out={ease(g, enemy + 20, 8)} size={56} kind="wipe" />
      <rect x={0} y={0} width={1920} height={1080} fill="#05080c" opacity={0.55 * q} />
      <Heading text="HARD TO KILL?" p={q} y={540} size={170} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 2. Only the middle of the target (03–07) ═════════════════════════
const C03: React.FC<{ g: number }> = ({ g }) => {
  const out = inOut(g, A("03"), A("03") + 50);
  const fighters = ease(g, W("04", "fighters"), 16);
  const ships = ease(g, W("04", "missile"), 16);
  const gun = W("04", "gun");
  const inGun = inOut(g, gun - 6, gun + 20) * (1 - inOut(g, A("05") + 10, A("05") + 40));
  const surround = ease(g, W("07", "surrounded"), 20);
  return (
    <Svg>
      <g transform={`${cam(mix(1.6, 0.8, out) * mix(1, 3.2, inGun), mix(CV.x, CV.x, out) + inGun * 40, mix(CV.y, 560, out) + inGun * 20)}`}>
        <Fleet g={g} esc={[ships, ships, ships, ships, ships]} sub={ships} />
        <RangeRing cx={CV.x} cy={CV.y} r={R3} p={ships} color={N.link} op={0.7} />
        <RangeRing cx={CV.x} cy={CV.y} r={R2} p={ships} color={N.link} op={0.6} />
        <RangeRing cx={CV.x} cy={CV.y} r={R1} p={fighters} color={N.link} op={0.5} />
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + g / 140;
          return (
            <g key={i} opacity={fighters}>
              <Jet x={CV.x + Math.cos(a) * R1} y={CV.y + Math.sin(a) * R1 * 0.95} a={(a * 180) / Math.PI + 90} s={0.7} />
            </g>
          );
        })}
        <Ciws x={CV.x + 150} y={CV.y + 22} s={0.18} firing={g > gun && g < gun + 40 ? 0.5 + 0.5 * Math.sin(g * 2) : 0} />
        {surround > 0 ? <circle cx={CV.x} cy={CV.y} r={mix(R1, R3, (g * 0.01) % 1)} fill="none" stroke={C.tracer} strokeWidth={3} opacity={0.4 * surround} /> : null}
      </g>
      <Tag x={960} y={150} text="FIGHTERS" p={fighters} out={ease(g, W("04", "missile") - 4, 6)} size={56} color={N.link} />
      <Tag x={960} y={150} text="MISSILE SHIPS" p={ships} out={ease(g, gun - 4, 6)} size={56} color={N.link} />
      <Tag x={960} y={150} text="4,500 ROUNDS / MIN" p={ease(g, gun, 10)} out={ease(g, A("05"), 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="NOT ARMOURED" p={ease(g, W("05", "armoured"), 10)} out={ease(g, A("07"), 6)} size={56} />
      <Tag x={960} y={150} text="SURROUNDED" p={surround} size={60} color={C.tracer} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 3. The record (08) ═════════════════════════
const C08: React.FC<{ g: number }> = ({ g }) => {
  const p = ease(g, W("08", "no"), 14);
  return (
    <Svg>
      <g transform={cam(0.85, CV.x, CV.y)}>
        <Fleet g={g} sub={0.6} cap={1} />
        <RangeRing cx={CV.x} cy={CV.y} r={R2} p={1} op={0.5} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#05080c" opacity={0.62 * p} />
      <Big x={960} y={600} text="0" p={p} size={360} color={C.tracer} />
      <Big x={960} y={720} text="US CARRIERS SUNK SINCE 1945" p={ease(g, W("08", "sunk"), 14)} size={64} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 4. Title + agenda (09–12) ═════════════════════════
const C09: React.FC<{ g: number }> = ({ g }) => {
  const title = ease(g, A("09"), 18);
  const up = inOut(g, A("10") - 6, A("10") + 18);
  const items: [string, string, string][] = [
    ["10", "3", "THREE RINGS"],
    ["11", "RED SEA", "ONE NIGHT"],
    ["12", "MISTAKES", "THAT BREAK THEM"],
  ];
  return (
    <Svg>
      <g transform={cam(0.7, CV.x, CV.y)}>
        <Fleet g={g} sub={0.6} cap={1} />
        {[R3, R2, R1].map((r, i) => (
          <RangeRing key={r} cx={CV.x} cy={CV.y} r={r} p={ease(g, W("10", "rings") + i * 8, 20)} op={0.6} />
        ))}
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#05080c" opacity={0.5 * title} />
      <Heading text="HOW A CARRIER" sub="DEFENDS ITSELF" p={title} y={mix(500, 260, up)} size={mix(150, 110, up)} />
      {items.map(([id, big, small], i) => {
        const p = ease(g, A(id), 16);
        const x = 480 + i * 480;
        return (
          <g key={id} opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
            <rect x={x - 200} y={470} width={400} height={300} rx={16} fill="rgba(6,12,18,0.85)" stroke="rgba(127,212,255,0.35)" strokeWidth={3} />
            <text x={x} y={620} textAnchor="middle" fill={i === 2 ? C.red : C.tracer} fontFamily={COND} fontWeight={800} fontSize={i === 0 ? 140 : 84}>
              {big}
            </text>
            <text x={x} y={720} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={700} fontSize={46} letterSpacing={3}>
              {small}
            </text>
          </g>
        );
      })}
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 5. Alone, nearly defenceless (13–15) ═════════════════════════
const C13: React.FC<{ g: number }> = ({ g }) => {
  const own = ease(g, W("14", "short"), 16);
  const group = ease(g, W("15", "group"), 24);
  return (
    <Svg>
      <g transform={cam(mix(1.5, 0.95, group), CV.x, CV.y)}>
        <Fleet g={g} esc={[group, group, group, group, group]} />
        <RangeRing cx={CV.x} cy={CV.y} r={70} p={own} color={C.tracer} label="OWN WEAPONS" lp={1 - group} />
        {[0, 1, 2].map((i) => (
          <Missile key={i} g={g} x1={CV.x + 700} y1={CV.y - 300 + i * 260} x2={CV.x + 90} y2={CV.y - 10 + i * 10} at={A("13") + 20 + i * 18} dur={110} bend={30} s={1.4} linger={0} />
        ))}
      </g>
      <Tag x={960} y={150} text="ALONE" p={ease(g, W("13", "own"), 12)} out={ease(g, A("14"), 6)} size={60} color={C.red} />
      <Tag x={960} y={150} text="LAST-DITCH ONLY" p={own} out={ease(g, A("15"), 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="THE GROUP" p={group} size={60} color={N.link} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 6. The strike group (16–21) ═════════════════════════
const C16: React.FC<{ g: number }> = ({ g }) => {
  const shipIn = (i: number, w: number) => inOut(g, w + i * 6, w + i * 6 + 30);
  const cru = shipIn(0, W("18", "cruiser"));
  const des = [1, 2, 3].map((i) => shipIn(i, W("18", "destroyers")));
  const sub = ease(g, W("19", "submarine"), 20);
  const sup = shipIn(4, W("20", "supply"));
  const move = W("21", "moves");
  const drift = Math.max(0, g - move) * 3.5;
  const knots = ease(g, W("21", "knots"), 12);
  const vis = [cru, ...des, sup];
  return (
    <Svg>
      <g transform={camPath(g, [[A("16"), 1.35, CV.x, CV.y], [A("18") - 10, 0.95, CV.x, CV.y]])}>
        <g transform={`translate(${-drift} 0)`}>
          <Sea seed="group" />
        </g>
        {ESC.map((e, i) => (
          <g key={i} opacity={vis[i]} transform={`translate(${(1 - vis[i]) * (e.x > CV.x ? 300 : -300)} 0)`}>
            <Warship x={e.x} y={e.y} kind={e.k} s={1.05} />
            <Tag x={e.x} y={e.y - 56} text={e.name} p={vis[i]} out={ease(g, move - 10, 10)} size={30} color={N.link} />
          </g>
        ))}
        <g opacity={sub}>
          <Sub x={SUBP.x} y={SUBP.y} depth={0.6} s={1.2} />
          <Tag x={SUBP.x} y={SUBP.y - 50} text="SUBMARINE" p={sub} out={ease(g, move - 10, 10)} size={30} color={N.link} />
        </g>
        <Carrier x={CV.x} y={CV.y} s={1.1} parked={1} glow={ease(g, W("17", "air"), 12) * (1 - ease(g, A("18"), 10))} />
      </g>
      <Big x={960} y={190} text="≈ 7,500 PEOPLE" p={ease(g, W("16", "7"), 12) * (1 - ease(g, A("17"), 8))} size={96} color={C.tracer} />
      <Big x={960} y={190} text="65–70 AIRCRAFT" p={ease(g, W("17", "65"), 12) * (1 - ease(g, A("18"), 8))} size={96} color={C.tracer} />
      <Tag x={960} y={150} text="30+ KNOTS" p={knots} size={64} color={C.tracer} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 7. Spread out, every sector watched (22–24) ═════════════════════════
const C22: React.FC<{ g: number }> = ({ g }) => {
  const spread = inOut(g, A("22"), W("23", "spread") + 20);
  const sect = ease(g, W("23", "sector"), 16);
  const att = W("23", "attacker");
  const hunt = W("24", "hunting");
  const angles = [-20, 200, 140, 70, 260];
  return (
    <Svg>
      <g transform={cam(mix(0.95, 0.62, spread), CV.x, CV.y)}>
        <Sea seed="spread" />
        {ESC.map((e, i) => {
          const x = mix(e.x, CV.x + (e.x - CV.x) * 1.8, spread);
          const y = mix(e.y, CV.y + (e.y - CV.y) * 1.8, spread);
          return (
            <g key={i}>
              <g opacity={sect * (i === 4 ? 0 : 1)}>
                <RadarSweep x={x} y={y} r={420} id={`sw${i}`} speed={2 + i * 0.4} op={0.9} />
              </g>
              <Warship x={x} y={y} kind={e.k} s={1.2} />
            </g>
          );
        })}
        <Carrier x={CV.x} y={CV.y} s={1.1} />
        {[0, 1, 2].map((i) => {
          const a = (angles[i] * Math.PI) / 180;
          const x1 = CV.x + Math.cos(a) * 1500;
          const y1 = CV.y + Math.sin(a) * 1000;
          const e = ESC[[1, 0, 3][i]];
          const ex = CV.x + (e.x - CV.x) * 1.8;
          const ey = CV.y + (e.y - CV.y) * 1.8;
          const mid = mpos(x1, y1, ex, ey, 0.55);
          return (
            <g key={i}>
              <Missile g={g} x1={x1} y1={y1} x2={mid.x} y2={mid.y} at={att + i * 10} dur={70} s={2.2} linger={0} />
              <Blip x={mid.x} y={mid.y} p={ease(g, att + i * 10 + 60, 8) * (1 - ease(g, A("24") + 20, 10))} size={2} />
              <Blast g={g} x={mid.x} y={mid.y} at={att + i * 10 + 72} s={0.8} />
            </g>
          );
        })}
        <g opacity={ease(g, A("24"), 16)}>
          <Sub x={CV.x + 1250} y={CV.y + 380} a={170} depth={0.5} s={1.6} />
          <Sub x={CV.x + 1640} y={CV.y + 520} a={190} depth={0.6} s={1.5} color={N.foe} />
          {[0, 1, 2].map((k) => (
            <Ring key={k} x={CV.x + 1250} y={CV.y + 380} g={g} at={hunt + k * 26} color={N.link} r={520} />
          ))}
        </g>
      </g>
      <Tag x={960} y={150} text="TENS OF KILOMETRES" p={ease(g, W("23", "tens"), 12)} out={ease(g, att - 4, 6)} size={56} color={N.link} />
      <Tag x={960} y={150} text="ANY DIRECTION" p={ease(g, att, 12)} out={ease(g, A("24") - 4, 6)} size={56} color={C.red} />
      <Tag x={960} y={150} text="SUB HUNTS SUBS" p={ease(g, hunt, 12)} size={56} color={N.link} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 8. Defence in depth (25–31) ═════════════════════════
const C25: React.FC<{ g: number }> = ({ g }) => {
  const rings = [R1, R2, R3];
  const beat = W("30", "every");
  const one = W("31", "one");
  // an attacker crossing ring after ring; each ring it crosses lights up
  const path = (k: number) => mpos(CV.x + 900, CV.y - 520, CV.x + 120, CV.y - 20, k, 60);
  const k = interpolate(g, [beat, E("30")], [0, 1], CLAMP);
  const crossed = rings.map((r) => {
    const d = (kk: number) => Math.hypot(path(kk).x - CV.x, path(kk).y - CV.y);
    return d(k) < r ? 1 : (0 as number);
  });
  return (
    <Svg>
      <g transform={cam(0.78, CV.x, CV.y)}>
        <Fleet g={g} sub={0.6} cap={1} />
        {rings.map((r, i) => (
          <RangeRing key={r} cx={CV.x} cy={CV.y} r={r} p={ease(g, W("26", "rings") + i * 10, 24)} color={crossed[i] ? C.tracer : N.link} w={crossed[i] ? 7 : 4} />
        ))}
        {g >= beat && g < E("30") + 30 ? (
          <g transform={`translate(${path(k).x} ${path(k).y}) rotate(${path(k).a}) scale(2.4)`}>
            <path d="M 12 0 L 4 -3 L -8 -3 L -12 -7 L -12 7 L -8 3 L 4 3 Z" fill={N.foe} stroke="#000" strokeWidth={1} />
          </g>
        ) : null}
        {/* the defence: any one ring that works ends it */}
        <Missile g={g} x1={ESC[0].x} y1={ESC[0].y} x2={path(0.25).x} y2={path(0.25).y} at={one - 18} dur={18} color={N.link} s={1.6} />
        <Blast g={g} x={path(0.25).x} y={path(0.25).y} at={one} s={1.2} />
      </g>
      <Heading text="DEFENCE IN DEPTH" p={ease(g, W("28", "depth"), 14)} out={ease(g, A("29"), 8)} y={200} size={110} />
      <Tag x={960} y={150} text={`LAYERS BEATEN: ${crossed.reduce((a, b) => a + b, 0)} / 3`} p={ease(g, beat, 10)} out={ease(g, A("31") - 4, 6)} size={56} color={C.red} />
      <Tag x={960} y={150} text="ONE LAYER IS ENOUGH" p={ease(g, one, 10)} size={58} color={N.link} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 9. Side view: the radar horizon (32–37) ═════════════════════════
/** Side view: sea surface curving away (exaggerated), a ship with a 30 m mast on the left. */
const EARTH = { cx: 960, cy: 5000, r: 4400 };
const surfY = (x: number) => EARTH.cy - Math.sqrt(EARTH.r * EARTH.r - (x - EARTH.cx) ** 2);
/** Side-view weather: clouds drifting across the sky, waves running along the curved surface. */
const SideWeather: React.FC<{ g: number }> = ({ g }) => (
  <>
    {[0, 1, 2, 3, 4].map((i) => {
      const x = ((((i * 520 + g * (0.6 + i * 0.15)) % 2600) + 2600) % 2600) - 340;
      return <ellipse key={i} cx={x} cy={140 + ((i * 97) % 260)} rx={200 + i * 30} ry={34 + (i % 2) * 14} fill="#22384b" opacity={0.55} />;
    })}
    <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r - 8} fill="none" stroke="#7fb6d6" strokeWidth={3} strokeDasharray="16 46" strokeDashoffset={g * 2.2} opacity={0.5} />
    <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r - 26} fill="none" stroke="#5f9fc4" strokeWidth={2} strokeDasharray="10 60" strokeDashoffset={-g * 1.4} opacity={0.35} />
  </>
);
const SideShip: React.FC<{ x: number; color?: string; g?: number }> = ({ x, color = N.friend, g = 0 }) => {
  const y = surfY(x) + Math.sin(g / 18) * 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${Math.sin(g / 23) * 1.2})`}>
      <path d="M -120 0 L 110 0 L 90 26 L -100 26 Z" fill={N.hull} stroke={color} strokeWidth={3} transform="translate(0 -18)" />
      <rect x={-40} y={-70} width={70} height={52} fill={N.island} />
      <line x1={-5} y1={-70} x2={-5} y2={-150} stroke="#c9ced3" strokeWidth={5} />
      <rect x={-22} y={-158} width={34} height={14} rx={3} fill="#d6dbe0" />
    </g>
  );
};
const C32: React.FC<{ g: number }> = ({ g }) => {
  const shipX = 260;
  const mast = { x: shipX - 5, y: surfY(shipX) - 152 };
  // the tangent from the mast top to the curved surface: the radar horizon
  const tanX = 1180;
  const sight = { x: tanX, y: surfY(tanX) };
  const slope = (sight.y - mast.y) / (sight.x - mast.x);
  const lineP = ease(g, W("35", "radar"), 30);
  const t0 = W("34", "missile");
  const mx = interpolate(g, [t0, W("35", "pops") + 30, E("37")], [2000, tanX + 60, shipX + 160], CLAMP);
  const my = surfY(mx) - 26;
  const seen = mx < tanX + 80 ? 1 : 0;
  const timer = interpolate(g, [W("36", "minutes"), E("37")], [120, 0], CLAMP);
  return (
    <Svg>
      <defs>
        <linearGradient id="sky32" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#0a1622" />
          <stop offset="100%" stopColor="#1b3346" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#sky32)" />
      <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r} fill="#0d3150" stroke="#5f9fc4" strokeWidth={4} />
      <SideWeather g={g} />
      <SideShip x={shipX} g={g} />
      {/* radar line of sight, tangent to the surface */}
      <line x1={mast.x} y1={mast.y} x2={mast.x + (2100 - mast.x) * lineP} y2={mast.y + slope * (2100 - mast.x) * lineP} stroke={N.link} strokeWidth={4} strokeDasharray="18 12" />
      <path d={`M ${mast.x} ${mast.y} L 2100 ${mast.y + slope * (2100 - mast.x)} L 2100 ${surfY(2100)} L ${tanX} ${sight.y} Z`} fill="#000" opacity={0.25 * lineP} />
      <Tag x={tanX + 260} y={sight.y + 120} text="HIDDEN BELOW THE HORIZON" p={ease(g, W("34", "horizon"), 12)} out={ease(g, W("35", "pops"), 8)} size={40} color={C.red} />
      <line x1={shipX} y1={surfY(shipX) + 70} x2={tanX} y2={sight.y + 70} stroke={C.text} strokeWidth={3} opacity={ease(g, W("35", "30"), 12)} />
      <Tag x={(shipX + tanX) / 2} y={(surfY(shipX) + sight.y) / 2 + 130} text="≈ 30 KM" p={ease(g, W("35", "kilometres"), 12)} size={46} />
      <Tag x={shipX + 110} y={mast.y - 30} text="30 M" p={ease(g, W("35", "metres"), 12)} size={38} color={N.link} />
      <g transform={`translate(${mx} ${my}) rotate(${-Math.atan2(surfY(mx + 1) - surfY(mx), 1) * 0}) scale(2.2) rotate(180)`}>
        <path d="M 12 0 L 4 -3 L -8 -3 L -12 -7 L -12 7 L -8 3 L 4 3 Z" fill={N.foe} stroke="#000" strokeWidth={1} />
        <ellipse cx={-15} rx={8} ry={3} fill="#ffcf60" />
      </g>
      <Blip x={mx} y={my} p={seen * ease(g, W("35", "pops"), 6)} size={2} />
      <g opacity={ease(g, W("36", "minutes"), 12)} transform="translate(1600 200)">
        <rect x={-190} y={-70} width={380} height={140} rx={14} fill="rgba(6,12,18,0.85)" />
        <text x={0} y={30} textAnchor="middle" fill={timer < 40 ? C.red : C.tracer} fontFamily={COND} fontWeight={800} fontSize={90}>
          {`${Math.floor(timer / 60)}:${String(Math.floor(timer % 60)).padStart(2, "0")}`}
        </text>
      </g>
      <Tag x={1600} y={320} text="1–2 MIN WARNING" p={ease(g, W("36", "minutes"), 12)} size={40} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 10. The Hawkeye lifts the eyes (38–45) ═════════════════════════
const C38: React.FC<{ g: number }> = ({ g }) => {
  const shipX = 260;
  const rise = inOut(g, A("38"), W("39", "orbits") + 20);
  const hx = mix(shipX + 80, 760, rise);
  const hy = mix(surfY(shipX) - 160, 260, rise);
  const far = ease(g, W("40", "hundreds"), 30);
  const top = inOut(g, A("41") - 4, A("41") + 30); // to the top-down picture
  const links = ease(g, W("41", "talks"), 20);
  const aimed = ease(g, W("42", "aimed"), 16);
  const blind = ease(g, W("43", "blind"), 6) * (1 - ease(g, A("44") + 20, 12));
  const remember = ease(g, W("44", "remember"), 10);
  const hk = { x: CV.x - 120 + Math.cos(g / 70) * 160, y: CV.y - 260 + Math.sin(g / 70) * 90 };
  const targets = [
    { x: 1700, y: 180 },
    { x: 1820, y: 760 },
    { x: 260, y: 860 },
  ];
  const noise = Array.from({ length: 60 }).map((_, i) => ({ x: ((i * 397 + g * 53) % 1920), y: ((i * 211 + g * 31) % 1080), w: 40 + ((i * 13) % 160) }));
  return (
    <Svg>
      <g opacity={1 - top}>
        <rect x={-200} y={-200} width={2320} height={1480} fill="#0f2130" />
        <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r} fill="#0d3150" stroke="#5f9fc4" strokeWidth={4} />
        <SideWeather g={g} />
        <SideShip x={shipX} g={g} />
        <line x1={hx} y1={hy} x2={mix(hx, 2100, far)} y2={mix(hy, surfY(2100) - 30, far)} stroke={N.link} strokeWidth={4} strokeDasharray="18 12" />
        <g transform={`translate(${hx} ${hy}) scale(1.2)`}>
          <path d="M -60 0 L 60 0 L 46 10 L -50 10 Z" fill={N.friend} />
          <ellipse cx={0} cy={-18} rx={40} ry={8} fill="#e4e9ee" stroke="#2a2f34" strokeWidth={2} />
          <line x1={0} y1={-10} x2={0} y2={0} stroke="#2a2f34" strokeWidth={4} />
        </g>
        <Tag x={hx} y={hy - 70} text="E-2 HAWKEYE" p={ease(g, W("39", "hawkeye"), 12)} size={44} color={N.link} />
        <Tag x={1400} y={420} text="HUNDREDS OF KM" p={far} size={52} color={N.link} />
        <g transform={`translate(1900 ${surfY(1900) - 30}) scale(2) rotate(180)`} opacity={far}>
          <path d="M 12 0 L 4 -3 L -8 -3 L -12 -7 L -12 7 L -8 3 L 4 3 Z" fill={N.foe} />
        </g>
        <Blip x={1900} y={surfY(1900) - 30} p={far} size={2} />
      </g>
      <g opacity={top}>
        <g transform={cam(0.72, CV.x, CV.y)}>
          <Fleet g={g} sub={0.5} />
          {[R3, R2, R1].map((r) => (
            <RangeRing key={r} cx={CV.x} cy={CV.y} r={r} p={aimed} color={blind > 0.5 ? "#5a6670" : C.tracer} op={0.8} w={5} />
          ))}
          {[...ESC.slice(0, 4), CV, { x: CV.x + R1, y: CV.y }, { x: CV.x - R1, y: CV.y - 100 }].map((t, i) => (
            <DataLink key={i} x1={hk.x} y1={hk.y} x2={t.x} y2={t.y} p={links * (1 - blind)} />
          ))}
          {[{ x: CV.x + R1, y: CV.y }, { x: CV.x - R1, y: CV.y - 100 }].map((t, i) => (
            <Jet key={i} x={t.x} y={t.y} a={i ? 200 : 20} s={0.8} />
          ))}
          {targets.map((t, i) => (
            <Blip key={i} x={mix(CV.x, t.x * 1.4 - 400, 1)} y={t.y * 1.3 - 150} p={links * (1 - blind)} size={2.2} />
          ))}
          <Jet x={hk.x} y={hk.y} a={(g / 70) * (180 / Math.PI) + 90} kind="hawkeye" s={1.1} alt={2} />
        </g>
        {blind > 0
          ? noise.map((n, i) => <rect key={i} x={n.x} y={n.y} width={n.w} height={3} fill="#cfe6ff" opacity={0.25 * blind} />)
          : null}
      </g>
      <Tag x={960} y={150} text="ONE SHARED PICTURE" p={ease(g, W("42", "picture"), 10)} out={ease(g, W("43", "blind") - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="BLIND IT = LATE / WRONG" p={ease(g, W("43", "blind"), 8)} out={ease(g, A("44"), 6)} size={56} color={C.red} />
      <Tag x={960} y={150} text="REMEMBER THIS" p={remember} size={60} color={C.tracer} kind="type" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 11. Small, slow, cheap: drones (46–50) ═════════════════════════
const C46: React.FC<{ g: number }> = ({ g }) => {
  const small = ease(g, W("47", "small"), 12);
  const cmp = ease(g, W("48", "bird"), 14);
  const late = W("50", "early");
  return (
    <Svg>
      <g transform={cam(0.9, CV.x, CV.y)}>
        <Fleet g={g} />
        {Array.from({ length: 6 }).map((_, i) => {
          const x = interpolate(g, [A("46") + i * 12, E("50")], [2300 + i * 60, 1500 + i * 40], CLAMP);
          const y = 180 + i * 140;
          return (
            <g key={i} opacity={small}>
              <g transform={`translate(${x} ${y}) rotate(180) scale(1.1)`}>
                <path d="M 16 0 L -12 -16 L -6 0 L -12 16 Z" fill={N.foe} stroke="#000" strokeWidth={1.5} />
              </g>
              <Blip x={x} y={y} p={g > late + i * 8 ? 1 : 0} size={0.8} />
            </g>
          );
        })}
      </g>
      {/* radar return sizes */}
      <g opacity={cmp} transform="translate(300 830)">
        <rect x={-230} y={-160} width={1060} height={250} rx={16} fill="rgba(6,12,18,0.88)" />
        {[
          ["BOMBER", 70, C.red],
          ["DRONE", 12, C.red],
          ["BIRD", 9, C.muted],
        ].map(([t, r, col], i) => (
          <g key={String(t)} transform={`translate(${i * 330} 0)`}>
            <circle cx={0} cy={-40} r={Number(r)} fill={String(col)} opacity={0.75} />
            <text x={0} y={70} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={44} letterSpacing={3}>
              {String(t)}
            </text>
          </g>
        ))}
        <text x={300} y={-110} textAnchor="middle" fill={C.muted} fontFamily={COND} fontWeight={700} fontSize={32} letterSpacing={5}>
          RADAR PICTURE
        </text>
      </g>
      <Tag x={960} y={150} text="LOW · SLOW · CHEAP" p={small} out={ease(g, W("49", "finding") - 4, 6)} size={56} color={C.red} />
      <Tag x={960} y={150} text="FIND THEM EARLY" p={ease(g, W("50", "early"), 10)} size={58} color={C.tracer} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 12. Ring one: combat air patrols, kill the archer (51–55) ═════════════════════════
const C51: React.FC<{ g: number }> = ({ g }) => {
  const cap = ease(g, W("52", "combat"), 20);
  const archer = W("53", "archer");
  const split = inOut(g, archer - 6, archer + 20) * (1 - inOut(g, A("55"), A("55") + 24));
  const push = ease(g, W("55", "push"), 30);
  const stations = [
    { x: CV.x + 700, y: CV.y - 300 },
    { x: CV.x + 760, y: CV.y + 260 },
    { x: CV.x - 720, y: CV.y - 120 },
  ];
  const kill = W("54", "destroy");
  const bomber = { x: 1500, y: 300 };
  return (
    <Svg>
      <g opacity={1 - split}>
        <g transform={cam(0.55, CV.x, CV.y)}>
          <Fleet g={g} />
          <RangeRing cx={CV.x} cy={CV.y} r={R1 + 240} p={cap} color={N.link} label="RING 1 · FIGHTERS" />
          {stations.map((s, i) => {
            const a = g / 40 + i * 2;
            const ox = s.x + (s.x - CV.x) * 0.5 * push;
            const oy = s.y + (s.y - CV.y) * 0.5 * push;
            return (
              <g key={i} opacity={cap}>
                <ellipse cx={ox} cy={oy} rx={170} ry={70} fill="none" stroke={N.link} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />
                <Jet x={ox + Math.cos(a) * 170} y={oy + Math.sin(a) * 70} a={(a * 180) / Math.PI + 90} s={1.1} />
                <Jet x={ox - Math.cos(a) * 170} y={oy - Math.sin(a) * 70} a={(a * 180) / Math.PI - 90} s={1.1} kind="fighter" />
              </g>
            );
          })}
          <Jet x={CV.x - 120 + Math.cos(g / 70) * 160} y={CV.y - 260 + Math.sin(g / 70) * 90} a={(g / 70) * (180 / Math.PI) + 90} kind="hawkeye" s={1.1} alt={2} />
          {stations.map((s, i) => (
            <DataLink key={i} x1={CV.x - 120 + Math.cos(g / 70) * 160} y1={CV.y - 260 + Math.sin(g / 70) * 90} x2={s.x + (s.x - CV.x) * 0.5 * push} y2={s.y + (s.y - CV.y) * 0.5 * push} p={push} />
          ))}
        </g>
      </g>
      <g opacity={split}>
        <Sea seed="archer" />
        <Jet x={bomber.x} y={bomber.y} a={160} kind="bomber" color={N.foe} s={1.6} />
        <Jet x={600} y={560} a={-20} s={1.4} />
        <Missile g={g} x1={640} y1={545} x2={bomber.x - 30} y2={bomber.y + 20} at={kill} dur={40} color={N.link} s={2} />
        <Blast g={g} x={bomber.x} y={bomber.y} at={kill + 40} s={1.4} />
        <Tag x={bomber.x} y={bomber.y - 140} text="ARCHER" p={1} size={52} color={C.red} />
        <Check x={bomber.x + 150} y={bomber.y - 150} p={ease(g, kill + 44, 10)} />
        <g opacity={0.45}>
          <Missile g={g} x1={1500} y1={820} x2={300} y2={860} at={A("54") - 30} dur={200} s={1.6} linger={300} />
          <Tag x={900} y={960} text="ARROW: HARD TO CATCH" p={ease(g, W("54", "chase"), 12)} size={40} color={C.muted} />
        </g>
      </g>
      <Tag x={960} y={150} text="KILL THE ARCHER" p={ease(g, archer, 10)} out={ease(g, A("55") - 4, 6)} size={60} color={C.tracer} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 13. The Growler: jamming (56–59) ═════════════════════════
const C56: React.FC<{ g: number }> = ({ g }) => {
  const jam = ease(g, W("56", "jams"), 14);
  const turn = inOut(g, W("57", "turns"), W("57", "turns") + 60);
  const gx = 800 + Math.sin(g / 60) * 30;
  const gy = 560;
  return (
    <Svg>
      <Sea seed="jam" />
      <Jet x={gx} y={gy} a={0} kind="growler" s={1.5} />
      <Tag x={gx} y={gy - 120} text="GROWLER" p={ease(g, W("56", "growler"), 12)} size={46} color={N.link} />
      {[0, 1, 2, 3, 4].map((k) => {
        const r = ((g * 4 + k * 90) % 450) + 60;
        return <circle key={k} cx={gx + 40} cy={gy} r={r} fill="none" stroke="#b48cff" strokeWidth={4} opacity={jam * (1 - r / 510) * 0.8} strokeDasharray="4 10" />;
      })}
      {[0, 1, 2].map((i) => {
        const bx = mix(1600, 1700, turn) - i * 10;
        const by = 300 + i * 220;
        const a = mix(180, 360 - 30 + i * 20, turn);
        return (
          <g key={i}>
            <Jet x={bx} y={by} a={a} kind="bomber" color={N.foe} s={0.9} />
            {/* their radar cone, scrambled by the jamming */}
            <path d={`M ${bx - 50} ${by} L ${bx - 520} ${by - 120} L ${bx - 520} ${by + 120} Z`} fill={N.foe} opacity={0.12 * (1 - jam * 0.6)} />
            {jam > 0
              ? Array.from({ length: 12 }).map((_, k) => (
                  <line key={k} x1={bx - 80 - ((k * 37 + g * 9) % 420)} y1={by - 100 + ((k * 53 + g * 13) % 200)} x2={bx - 40 - ((k * 37 + g * 9) % 420)} y2={by - 100 + ((k * 53 + g * 13) % 200)} stroke="#ffffff" strokeWidth={3} opacity={0.4 * jam * (1 - turn)} />
                ))
              : null}
          </g>
        );
      })}
      <Tag x={960} y={150} text="LATE · BADLY · TURNS AWAY" p={ease(g, W("57", "late"), 10)} out={ease(g, A("58") - 4, 6)} size={52} color={C.red} />
      <Tag x={960} y={150} text="NO SHOT FIRED" p={ease(g, W("58", "without"), 10)} size={58} color={N.link} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 14. Logistics, then the leak (60–64) ═════════════════════════
const C60: React.FC<{ g: number }> = ({ g }) => {
  const tank = ease(g, W("61", "tankers"), 14);
  const shift = ease(g, W("61", "shifts"), 12);
  const alert = W("61", "alert");
  const launch = W("61", "launched");
  const leak = W("63", "leak");
  const wide = inOut(g, A("62") - 4, A("62") + 30);
  const tk = { x: 520 + Math.cos(g / 80) * 120, y: 330 + Math.sin(g / 80) * 60 };
  const cat = interpolate(g, [launch, launch + 36], [0, 1], CLAMP);
  return (
    <Svg>
      <g transform={cam(mix(1.2, 0.55, wide), mix(900, CV.x, wide), mix(470, CV.y, wide))}>
        <Fleet g={g} />
        <RangeRing cx={CV.x} cy={CV.y} r={R1 + 240} p={wide} color={N.link} label="RING 1" />
        <g opacity={tank}>
          <Jet x={tk.x} y={tk.y} a={(g / 80) * (180 / Math.PI) + 90} kind="tanker" s={1.2} />
          <line x1={tk.x} y1={tk.y} x2={tk.x - 80} y2={tk.y + 40} stroke="#dfe6ea" strokeWidth={3} />
          <Jet x={tk.x - 100} y={tk.y + 50} a={(g / 80) * (180 / Math.PI) + 90} s={0.9} />
        </g>
        {/* deck alert: jets launched off the bow catapults */}
        {[0, 1].map((i) => {
          const k = Math.max(0, Math.min(1, cat - i * 0.3));
          return <Jet key={i} x={CV.x + 60 + k * 900} y={CV.y - 6 + i * 14 - k * 200} a={-10} s={0.32 + k * 0.6} alt={k} />;
        })}
        <Missile g={g} x1={CV.x + 1500} y1={CV.y - 800} x2={CV.x + R2 + 60} y2={CV.y - R2 * 0.6} at={leak - 30} dur={90} bend={-80} s={3} linger={200} />
      </g>
      <g opacity={shift * (1 - wide)} transform="translate(1600 300)">
        <circle r={90} fill="rgba(6,12,18,0.85)" stroke="rgba(255,255,255,0.2)" strokeWidth={5} />
        <line x1={0} y1={0} x2={Math.sin(g / 12) * 66} y2={-Math.cos(g / 12) * 66} stroke={C.tracer} strokeWidth={6} strokeLinecap="round" />
        <text y={140} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={40} letterSpacing={3}>
          24 / 7
        </text>
      </g>
      <Tag x={960} y={150} text="TANKERS" p={tank} out={ease(g, W("61", "patrols") - 4, 6)} size={56} color={N.link} />
      <Tag x={960} y={150} text="ALERT ON DECK" p={ease(g, alert, 10)} out={ease(g, A("62") - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="LEAKERS" p={ease(g, leak, 10)} out={ease(g, A("64") + 10, 6)} size={60} color={C.red} kind="drop" />
      <Tag x={960} y={150} text="NEXT: THE WALL" p={ease(g, W("64", "wall"), 10)} size={58} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 15. Ring two: Aegis, fire on a target you cannot see (65–66) ═════════════════════════
const C65: React.FC<{ g: number }> = ({ g }) => {
  const net = ease(g, W("65", "aegis"), 20);
  const remote = W("66", "fire");
  const dd = ESC[1];
  const tgt = { x: dd.x - 900, y: dd.y - 420 };
  const hk = { x: CV.x - 200, y: CV.y - 420 };
  return (
    <Svg>
      <g transform={cam(0.62, CV.x - 120, CV.y - 80)}>
        <Fleet g={g} />
        <RangeRing cx={CV.x} cy={CV.y} r={R2 + 120} p={ease(g, A("65"), 30)} color={C.tracer} label="RING 2 · MISSILE WALL" />
        {ESC.slice(0, 4).map((a, i) =>
          ESC.slice(0, 4).map((b, j) => (j > i ? <DataLink key={`${i}${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} p={net} color={C.tracer} speed={2} /> : null)),
        )}
        {/* the destroyer's own radar does not reach the target; the Hawkeye's picture does */}
        <circle cx={dd.x} cy={dd.y} r={560} fill="none" stroke={N.link} strokeWidth={3} strokeDasharray="6 10" opacity={ease(g, A("66"), 14) * 0.7} />
        <Jet x={hk.x + Math.cos(g / 70) * 120} y={hk.y + Math.sin(g / 70) * 60} a={(g / 70) * (180 / Math.PI) + 90} kind="hawkeye" s={1.2} alt={2} />
        <DataLink x1={hk.x} y1={hk.y} x2={tgt.x} y2={tgt.y} p={ease(g, A("66"), 20)} />
        <DataLink x1={hk.x} y1={hk.y} x2={dd.x} y2={dd.y} p={ease(g, A("66") + 10, 20)} />
        <Jet x={tgt.x + interpolate(g, [A("65"), E("66")], [-200, 0], CLAMP)} y={tgt.y} a={30} kind="bomber" color={N.foe} s={1.1} />
        <Blip x={tgt.x} y={tgt.y} p={ease(g, A("66"), 10)} size={2.4} />
        <Missile g={g} x1={dd.x} y1={dd.y} x2={tgt.x} y2={tgt.y} at={remote} dur={70} bend={-140} color={N.link} s={2.2} />
        <Blast g={g} x={tgt.x} y={tgt.y} at={remote + 70} s={1.5} />
      </g>
      <Tag x={960} y={150} text="AEGIS: ONE NETWORK" p={net} out={ease(g, A("66") - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="FIRE ON WHAT YOU CAN'T SEE" p={ease(g, A("66"), 10)} size={54} color={N.link} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 16. SM-6, SM-2, the cells (67–70) ═════════════════════════
const C67: React.FC<{ g: number }> = ({ g }) => {
  const sm6 = ease(g, W("67", "range"), 30);
  const cells = ease(g, W("69", "cells"), 16);
  const storm = W("70", "storm");
  const dd = ESC[0];
  return (
    <Svg>
      <g transform={cam(mix(0.62, 0.42, sm6), dd.x, dd.y)}>
        <Fleet g={g} />
        <circle cx={dd.x} cy={dd.y} r={1100 * sm6} fill={C.tracer} opacity={0.05} />
        <circle cx={dd.x} cy={dd.y} r={1100 * sm6} fill="none" stroke={C.tracer} strokeWidth={6} strokeDasharray="22 14" opacity={0.9} />
        <Tag x={dd.x} y={dd.y - 1100 * sm6 - 30} text="SM-6 · 240+ KM" p={sm6} size={80} color={C.tracer} />
        {Array.from({ length: 16 }).map((_, i) => {
          const e = ESC[i % 4];
          const a = (i / 16) * Math.PI * 2;
          return <Missile key={i} g={g} x1={e.x} y1={e.y} x2={e.x + Math.cos(a) * 900} y2={e.y + Math.sin(a) * 700} at={storm + (i % 8) * 4} dur={60} color={N.link} s={2.4} />;
        })}
      </g>
      <g opacity={cells} transform="translate(250 560)">
        <rect x={-60} y={-130} width={900} height={560} rx={16} fill="rgba(6,12,18,0.9)" />
        <text x={0} y={-70} fill={C.text} fontFamily={COND} fontWeight={800} fontSize={52} letterSpacing={3}>
          DESTROYER · ~90 CELLS
        </text>
        <Vls x={0} y={-20} cols={18} n={90} fired={0} cell={38} />
        <text x={0} y={380} fill={C.muted} fontFamily={COND} fontWeight={700} fontSize={44} letterSpacing={3}>
          CRUISER · 100+
        </text>
      </g>
      <Tag x={960} y={150} text="SM-2s BEHIND IT" p={ease(g, A("68"), 10)} out={ease(g, A("69") - 4, 6)} size={56} color={N.link} />
      <Tag x={960} y={150} text="A STORM OF INTERCEPTORS" p={ease(g, storm, 10)} size={56} color={N.link} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 17. Hundreds of tracks, two shots each (71–72) ═════════════════════════
const C71: React.FC<{ g: number }> = ({ g }) => {
  const tracks = ease(g, W("71", "hundreds"), 20);
  const share = W("71", "share");
  const twice = W("72", "twice");
  const dds = [ESC[0], ESC[1]];
  const tg = [
    { x: CV.x + 900, y: CV.y - 520 },
    { x: CV.x - 860, y: CV.y - 560 },
  ];
  const blips = Array.from({ length: 90 }).map((_, i) => ({ x: CV.x + Math.cos(i * 2.4) * (500 + ((i * 97) % 700)), y: CV.y + Math.sin(i * 2.4) * (380 + ((i * 53) % 420)) }));
  return (
    <Svg>
      <g transform={cam(0.5, CV.x, CV.y - 40)}>
        <Fleet g={g} />
        {blips.map((b, i) => (
          <Blip key={i} x={b.x} y={b.y} p={tracks * (i % 4 ? 0.6 : 1)} foe={i % 5 === 0} size={1.4} />
        ))}
        {dds.map((d, i) => (
          <g key={i}>
            <line x1={d.x} y1={d.y} x2={tg[i].x} y2={tg[i].y} stroke={i ? "#9fd0ff" : C.tracer} strokeWidth={5} strokeDasharray="14 10" opacity={ease(g, share, 14)} />
            <Tag x={tg[i].x} y={tg[i].y - 70} text={`TARGET ${i + 1}`} p={ease(g, share + 6, 10)} size={44} color={i ? "#9fd0ff" : C.tracer} />
            <Blip x={tg[i].x} y={tg[i].y} p={1} size={3} />
          </g>
        ))}
        {[0, 1].map((k) => (
          <Missile key={k} g={g} x1={dds[0].x} y1={dds[0].y} x2={tg[0].x} y2={tg[0].y} at={twice + k * 8} dur={60} bend={k ? 90 : -90} color={N.link} s={2.6} />
        ))}
        <Blast g={g} x={tg[0].x} y={tg[0].y} at={twice + 62} s={1.8} />
      </g>
      <Tag x={960} y={150} text="HUNDREDS OF TRACKS" p={tracks} out={ease(g, share - 4, 6)} size={56} color={N.link} />
      <Tag x={960} y={150} text="NO DOUBLE-SHOOTING" p={ease(g, share, 10)} out={ease(g, A("72") - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="TWO PER MISSILE" p={ease(g, twice, 10)} size={58} color={N.link} kind="drop" />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 18. Finite: the wall can be emptied (73–78) ═════════════════════════
const C73: React.FC<{ g: number }> = ({ g }) => {
  const oneShot = W("74", "one");
  const finite = W("75", "finite");
  const empty = W("76", "empty");
  const fired = Math.round(interpolate(g, [oneShot, E("76")], [0, 90], CLAMP));
  const sec = ease(g, W("78", "seconds"), 14);
  return (
    <Svg>
      <Sea seed="vls" tint="#0a1c2c" tintOp={0.6} />
      <g transform="translate(300 260)">
        <Vls x={0} y={0} cols={18} n={90} fired={fired} cell={60} flash={fired - 1} />
      </g>
      <text x={960} y={720} textAnchor="middle" fill={fired > 80 ? C.red : C.text} fontFamily={COND} fontWeight={800} fontSize={72} opacity={ease(g, oneShot, 10)}>
        {`${90 - fired} / 90 LEFT`}
      </text>
      <g opacity={ease(g, W("74", "crane"), 12)} transform="translate(1680 150)">
        <rect x={-180} y={-60} width={360} height={110} rx={12} fill="rgba(6,12,18,0.9)" />
        <text x={0} y={18} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={44} letterSpacing={2}>
          NO RELOAD AT SEA
        </text>
      </g>
      <Tag x={960} y={150} text="ONE SHOT PER CELL" p={ease(g, oneShot, 10)} out={ease(g, finite - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="FINITE" p={ease(g, finite, 10)} out={ease(g, empty - 4, 6)} size={64} color={C.red} kind="drop" />
      <Tag x={960} y={150} text="THE PLAN: EMPTY THE WALL" p={ease(g, empty, 10)} out={ease(g, A("77") - 4, 6)} size={56} color={C.red} />
      <rect x={0} y={0} width={1920} height={1080} fill="#05080c" opacity={0.7 * ease(g, A("77"), 16)} />
      <Big x={960} y={540} text="MINUTES → SECONDS" p={sec} size={130} color={C.tracer} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 19. Ring three: ESSM, SeaRAM (79–80) ═════════════════════════
const C79: React.FC<{ g: number }> = ({ g }) => {
  const ram = ease(g, W("80", "searam"), 14);
  const quad = ease(g, W("79", "four"), 12);
  return (
    <Svg>
      <g transform={cam(mix(0.9, 1.4, ram), CV.x, CV.y)}>
        <Fleet g={g} />
        <RangeRing cx={CV.x} cy={CV.y} r={R3 + 120} p={ease(g, A("79"), 24)} color={C.red} label="RING 3 · ~50 KM" lp={1 - ram} />
        <RangeRing cx={CV.x} cy={CV.y} r={110} p={ram} color={C.tracer} label="SEARAM · ~10 KM" />
        {Array.from({ length: 8 }).map((_, i) => {
          const e = ESC[i % 4];
          const a = (i / 8) * Math.PI * 2;
          return <Missile key={i} g={g} x1={e.x} y1={e.y} x2={CV.x + Math.cos(a) * 380} y2={CV.y + Math.sin(a) * 300} at={W("79", "many") + i * 5} dur={40} color={N.link} s={1.6} />;
        })}
      </g>
      <g opacity={quad * (1 - ram)} transform="translate(1560 760)">
        <rect x={-150} y={-150} width={300} height={300} rx={14} fill="rgba(6,12,18,0.9)" stroke={N.link} strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={-55 + (i % 2) * 110} cy={-55 + Math.floor(i / 2) * 110} r={42} fill="#8a96a2" stroke="#2a2f34" strokeWidth={3} />
        ))}
        <text y={200} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={44} letterSpacing={3}>
          4 ESSM / CELL
        </text>
      </g>
      <Tag x={960} y={150} text="MANY, CLOSE, AT ONCE" p={ease(g, W("79", "many"), 10)} out={ease(g, A("80") - 4, 6)} size={56} color={N.link} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 20. The Phalanx, decoys, the hard turn (81–85) ═════════════════════════
/** Phalanx in side view: pedestal, white radar dome, the gun cluster aimed along `aim` (radians). */
const CiwsSide: React.FC<{ x: number; y: number; aim: number; firing?: number }> = ({ x, y, aim, firing = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-70} y={-30} width={140} height={30} rx={6} fill="#59606a" stroke="#2a2f34" strokeWidth={3} />
    <rect x={-46} y={-140} width={92} height={112} rx={10} fill="#d9dde1" stroke="#2a2f34" strokeWidth={3} />
    <path d="M -46 -140 Q -46 -230 0 -232 Q 46 -230 46 -140 Z" fill="#f1f3f5" stroke="#2a2f34" strokeWidth={3} />
    <g transform={`translate(30 ${-70}) rotate(${(aim * 180) / Math.PI})`}>
      <rect x={-30} y={-22} width={60} height={44} rx={8} fill="#8a939c" stroke="#2a2f34" strokeWidth={3} />
      <rect x={20} y={-9} width={150} height={18} rx={4} fill="#3a4048" stroke="#1b1f24" strokeWidth={2} />
      {firing > 0 ? <circle cx={182} r={22 + 10 * firing} fill="#fff1b8" opacity={0.9 * firing} /> : null}
    </g>
  </g>
);
const C81: React.FC<{ g: number }> = ({ g }) => {
  const ph = W("81", "phalanx");
  const spray = W("81", "spraying");
  const drum = W("82", "drum");
  const drain = interpolate(g, [W("82", "twenty"), W("82", "twenty") + 20 * FPS * 0.25], [1, 0], CLAMP);
  const soft = ease(g, W("84", "soft"), 14);
  const ghost = W("84", "ghost");
  const turn = inOut(g, W("85", "turns"), W("85", "turns") + 60);
  const closeup = 1 - inOut(g, A("84") - 6, A("84") + 26);
  const mk = interpolate(g, [spray - 40, spray + 20], [0, 1], CLAMP);
  const m = mpos(1900, 120, 1160, 460, mk);
  return (
    <Svg>
      <g opacity={closeup}>
        {/* side view: night sky over a dark sea line, the deck edge below */}
        <defs>
          <linearGradient id="sky81" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#050b14" />
            <stop offset="100%" stopColor="#13263a" />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={2320} height={760} fill="url(#sky81)" />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={((i * 760 + g * 0.9) % 2600) - 340} cy={160 + i * 90} rx={240} ry={40} fill="#1a2e42" opacity={0.6} />
        ))}
        <rect x={-200} y={470} width={2320} height={90} fill="#0b2033" />
        <line x1={-200} y1={500} x2={2120} y2={500} stroke="#4f86a8" strokeWidth={3} strokeDasharray="20 50" strokeDashoffset={g * 2} opacity={0.5} />
        <rect x={-100} y={560} width={2120} height={600} fill={N.deck} />
        <line x1={-100} y1={560} x2={2020} y2={560} stroke="#2a2f34" strokeWidth={6} />
        <CiwsSide x={860} y={560} aim={g < spray - 40 ? -0.5 + 0.35 * Math.sin(g / 14) : Math.atan2(m.y - 490, m.x - 890)} firing={g > spray && g < spray + 50 ? 0.6 + 0.4 * Math.sin(g * 2.7) : 0} />
        <Tag x={560} y={760} text="PHALANX" p={ease(g, ph, 12)} size={60} color={C.tracer} />
        {Array.from({ length: 6 }).map((_, i) => (
          <Tracer key={i} g={g} seed={i} x1={890 + Math.cos(Math.atan2(m.y - 490, m.x - 890)) * 180} y1={490 + Math.sin(Math.atan2(m.y - 490, m.x - 890)) * 180} x2={m.x + ((i * 17) % 30) - 15} y2={m.y + ((i * 23) % 30) - 15} on={spray + i * 2} off={spray + 46} w={6} />
        ))}
        {g < spray + 22 ? (
          <g transform={`translate(${m.x} ${m.y}) rotate(${m.a}) scale(3)`}>
            <path d="M 12 0 L 4 -3 L -8 -3 L -12 -7 L -12 7 L -8 3 L 4 3 Z" fill={N.foe} stroke="#000" strokeWidth={1} />
          </g>
        ) : null}
        <Blast g={g} x={m.x} y={m.y} at={spray + 22} s={1.6} />
        <g opacity={ease(g, drum, 12)} transform="translate(1560 820)">
          <rect x={-250} y={-60} width={500} height={120} rx={14} fill="rgba(6,12,18,0.9)" />
          <rect x={-220} y={-24} width={440} height={48} rx={8} fill="#1b2026" />
          <rect x={-220} y={-24} width={440 * drain} height={48} rx={8} fill={drain < 0.3 ? C.red : C.tracer} />
          <text y={-80} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={44} letterSpacing={2}>
            {`${Math.round(1550 * drain)} ROUNDS · ≈ 20 S`}
          </text>
        </g>
      </g>
      <g opacity={1 - closeup}>
        <g transform={cam(1.2, CV.x + 200, CV.y)}>
          <Sea seed="decoy" />
          <Carrier x={CV.x} y={CV.y} a={-turn * 50} s={1.1} />
          {soft > 0
            ? Array.from({ length: 40 }).map((_, i) => (
                <circle key={i} cx={CV.x + 420 + Math.cos(i * 1.7) * (40 + i * 3)} cy={CV.y - 240 + Math.sin(i * 1.3) * (30 + i * 2)} r={4} fill="#dfe6ea" opacity={0.6 * soft} />
              ))
            : null}
          <g opacity={ease(g, ghost, 12) * 0.5}>
            <Carrier x={CV.x + 440} y={CV.y - 250} s={1.1} wake={0} parked={0} />
          </g>
          <Tag x={CV.x + 440} y={CV.y - 360} text="DECOY" p={ease(g, ghost, 12)} size={44} color={C.tracer} />
          {(() => {
            const k = interpolate(g, [A("84") + 20, ghost + 40], [0, 1], CLAMP);
            const q = mpos(CV.x + 1100, CV.y - 600, CV.x + 440, CV.y - 250, k, 60);
            return k > 0 && k < 1 ? (
              <g transform={`translate(${q.x} ${q.y}) rotate(${q.a}) scale(2.4)`}>
                <path d="M 12 0 L 4 -3 L -8 -3 L -12 -7 L -12 7 L -8 3 L 4 3 Z" fill={N.foe} />
              </g>
            ) : null;
          })()}
          <Blast g={g} x={CV.x + 440} y={CV.y - 250} at={ghost + 40} s={1.4} />
        </g>
      </g>
      <Tag x={960} y={150} text="SOFT LAYER: JAM · DECOY" p={soft} out={ease(g, A("85") - 4, 6)} size={54} color={C.tracer} />
      <Tag x={960} y={150} text="TURN HARD · FULL SPEED" p={ease(g, W("85", "turns"), 10)} size={54} color={N.link} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 21. The Red Sea night (86–91) ═════════════════════════
const C86: React.FC<{ g: number }> = ({ g }) => {
  const M = MAPS.redsea;
  const gr = M.pts.gravely;
  const launch = W("87", "houthi");
  const slip = W("87", "slipped");
  const kill = W("88", "destroyed");
  const ike = M.pts.ike;
  const study = ease(g, W("89", "200"), 14);
  const held = ease(g, A("90"), 14);
  const zoom = inOut(g, slip, slip + 40) * (1 - inOut(g, A("89") - 10, A("89") + 30));
  const k = interpolate(g, [launch, kill - 6], [0, 1], CLAMP);
  const mp = mpos(M.pts.hodeidah[0] + 30, M.pts.hodeidah[1], gr[0] + 4, gr[1], 0.96 * k, 30);
  const rings = [90, 60, 32];
  return (
    <Svg>
      <g transform={cam(mix(1.1, 3.2, zoom), mix(1050, gr[0], zoom), mix(640, gr[1], zoom))}>
        <Sea seed="red" night={0.7} tintOp={0.5} flow={0.35} />
        <Land d={M.d} />
        <text x={980} y={560} fill="rgba(160,200,220,0.55)" fontFamily={COND} fontWeight={700} fontSize={34} letterSpacing={10} transform="rotate(62 980 560)">
          RED SEA
        </text>
        <text x={1290} y={930} fill="rgba(220,220,200,0.6)" fontFamily={COND} fontWeight={700} fontSize={30} letterSpacing={6}>
          YEMEN
        </text>
        {rings.map((r, i) => (
          <circle key={r} cx={gr[0]} cy={gr[1]} r={r} fill="none" stroke={Math.hypot(mp.x - gr[0], mp.y - gr[1]) < r ? "#5a6670" : N.link} strokeWidth={2} strokeDasharray="6 5" opacity={ease(g, A("87") + i * 6, 12)} />
        ))}
        <g transform={`translate(${gr[0]} ${gr[1]}) rotate(-60) scale(0.12)`}>
          <Warship x={0} y={0} kind="destroyer" wake={0.6} />
        </g>
        <Tag x={gr[0] - 60} y={gr[1] - 46} text="USS GRAVELY" p={ease(g, W("87", "gravely"), 10)} size={18} color={N.link} />
        {g >= launch && g < kill ? (
          <g transform={`translate(${mp.x} ${mp.y}) rotate(${mp.a}) scale(0.5)`}>
            <path d="M 12 0 L 4 -3 L -8 -3 L -12 -7 L -12 7 L -8 3 L 4 3 Z" fill={N.foe} />
          </g>
        ) : null}
        {g >= launch ? <path d={`M ${M.pts.hodeidah[0] + 30} ${M.pts.hodeidah[1]} L ${mp.x} ${mp.y}`} stroke={N.foe} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.7} /> : null}
        <Blast g={g} x={mp.x} y={mp.y} at={kill} s={0.12} />
        <g opacity={ease(g, kill + 6, 10) * zoom}>
          <line x1={gr[0]} y1={gr[1] + 14} x2={mp.x} y2={mp.y + 14} stroke={C.tracer} strokeWidth={1.5} />
          <text x={(gr[0] + mp.x) / 2} y={(gr[1] + mp.y) / 2 + 30} textAnchor="middle" fill={C.tracer} fontFamily={COND} fontWeight={800} fontSize={14}>
            ≈ 1 MILE
          </text>
        </g>
        <g opacity={study}>
          <circle cx={ike[0]} cy={ike[1]} r={9} fill={N.link} />
          <Ring x={ike[0]} y={ike[1]} g={g} at={W("89", "200")} color={C.red} r={60} />
          <Tag x={ike[0] - 10} y={ike[1] - 30} text="USS EISENHOWER · ≈ 200 M (STUDY)" p={study} size={22} color={C.red} anchor="end" />
        </g>
      </g>
      <Tag x={960} y={150} text="30 JAN 2024 · RED SEA" p={ease(g, W("87", "30"), 10)} out={ease(g, kill - 6, 6)} size={56} />
      <Tag x={960} y={150} text="PHALANX · SECONDS FROM IMPACT" p={ease(g, kill, 10)} out={ease(g, A("89") - 4, 6)} size={52} color={C.tracer} />
      <Tag x={960} y={150} text="THE RINGS HELD" p={held} out={ease(g, A("91"), 6)} size={60} color={N.link} kind="drop" />
      <Tag x={960} y={150} text="BUT ONLY JUST" p={ease(g, A("91"), 10)} size={60} color={C.red} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 22. Killed by mistakes (92–95) ═════════════════════════
const MISTAKES = ["ASLEEP", "WRONG TARGET", "MAGAZINE MATHS", "NARROW WATER"];
const C92: React.FC<{ g: number }> = ({ g }) => {
  const head = ease(g, W("94", "mistakes"), 14);
  return (
    <Svg>
      <g transform={cam(0.7, CV.x, CV.y)}>
        <Fleet g={g} />
        {[R3, R2, R1].map((r) => (
          <RangeRing key={r} cx={CV.x} cy={CV.y} r={r} p={1} op={0.5} />
        ))}
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#05080c" opacity={0.6 * ease(g, A("93"), 14)} />
      <Heading text="KILLED BY MISTAKES" p={head} y={330} size={130} color={C.red} />
      {MISTAKES.map((t, i) => {
        const p = ease(g, W("95", "deadly") + i * 6, 12);
        const x = 300 + i * 440;
        return (
          <g key={t} opacity={p} transform={`translate(0 ${(1 - p) * 30})`}>
            <rect x={x - 190} y={560} width={380} height={200} rx={14} fill="rgba(20,8,8,0.85)" stroke={C.red} strokeWidth={3} />
            <text x={x} y={640} textAnchor="middle" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={60}>
              {`0${i + 1}`}
            </text>
            <text x={x} y={720} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={44} letterSpacing={2}>
              {t}
            </text>
          </g>
        );
      })}
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 23. Mistake one: Moskva, rings asleep (96–101) ═════════════════════════
const C96: React.FC<{ g: number }> = ({ g }) => {
  const M = MAPS.blacksea;
  const mk = M.pts.moskva;
  const hit = W("97", "hit");
  const sank = ease(g, W("101", "sank"), 40);
  const asleep = ease(g, W("96", "asleep"), 14);
  const zoom = inOut(g, A("97"), A("97") + 40);
  const launchP = [M.pts.odesa[0] + 10, M.pts.odesa[1] + 40];
  return (
    <Svg>
      <g transform={cam(mix(1, 2.2, zoom), mix(960, mk[0] + 60, zoom), mix(540, mk[1] - 40, zoom))}>
        <Sea seed="black" tint="#0a2030" tintOp={0.5} flow={0.35} />
        <Land d={M.d} />
        <text x={1000} y={600} fill="rgba(160,200,220,0.55)" fontFamily={COND} fontWeight={700} fontSize={40} letterSpacing={12}>
          BLACK SEA
        </text>
        <text x={launchP[0] - 30} y={launchP[1] - 60} fill="rgba(220,220,200,0.6)" fontFamily={COND} fontWeight={700} fontSize={24} letterSpacing={4}>
          UKRAINE
        </text>
        {[70, 45, 22].map((r) => (
          <circle key={r} cx={mk[0]} cy={mk[1]} r={r} fill="none" stroke="#5a6670" strokeWidth={2.5} strokeDasharray="6 6" opacity={asleep * (1 - sank)} />
        ))}
        <g transform={`translate(${mk[0]} ${mk[1]}) rotate(${-20 + sank * 25}) scale(0.24)`} opacity={1 - 0.7 * sank}>
          <Warship x={0} y={0} kind="cruiser" color={N.foe} wake={0} dead={ease(g, hit + 30, 20)} />
        </g>
        {g > hit
          ? Array.from({ length: 10 }).map((_, i) => {
              const life = ((g - hit + i * 18) % 180) / 180;
              return <circle key={i} cx={mk[0] + 4 + life * 70} cy={mk[1] - life * 90} r={6 + life * 26} fill="#2e2b27" opacity={0.6 * (1 - life) * ease(g, hit, 20)} />;
            })
          : null}
        <Tag x={mk[0]} y={mk[1] - 40} text="MOSKVA" p={ease(g, W("97", "moskva"), 10)} size={22} color={C.red} />
        {[0, 1].map((i) => (
          <g key={i}>
            <Missile g={g} x1={launchP[0]} y1={launchP[1]} x2={mk[0] + i * 6} y2={mk[1]} at={hit - 60 + i * 10} dur={60} bend={20 - i * 40} color={C.tracer} s={0.5} linger={20} />
            <Blast g={g} x={mk[0] + i * 6} y={mk[1]} at={hit + i * 10} s={0.3} />
          </g>
        ))}
      </g>
      <Tag x={960} y={150} text="APRIL 2022 · 2 NEPTUNE MISSILES" p={ease(g, A("97"), 10)} out={ease(g, A("99") - 4, 6)} size={52} />
      <Tag x={960} y={150} text="DEFENCES NEVER ENGAGED?" p={ease(g, A("99"), 10)} out={ease(g, A("101") - 4, 6)} size={52} color={C.muted} />
      <Tag x={960} y={150} text="SANK THE NEXT DAY" p={ease(g, W("101", "sank"), 10)} size={58} color={C.red} kind="drop" />
      <Tag x={70} y={90} anchor="start" text="MISTAKE 01 · ASLEEP" p={ease(g, A("96"), 12)} size={44} color={C.red} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 24. Mistake two: Gettysburg, the wrong target (102–106) ═════════════════════════
const C102: React.FC<{ g: number }> = ({ g }) => {
  const mistook = W("103", "mistook");
  const shot = W("103", "shot");
  const eject = W("104", "ejected");
  const jk = interpolate(g, [A("103"), shot + 40], [0, 0.75], CLAMP);
  const jp = mpos(1900, 160, 960, 620, jk, 60);
  const label = ease(g, mistook, 8);
  const chutes = ease(g, eject, 14);
  return (
    <Svg>
      <Sea seed="getty" night={0.3} />
      <Warship x={760} y={780} kind="cruiser" s={1.8} />
      <Tag x={760} y={690} text="USS GETTYSBURG" p={ease(g, W("103", "gettysburg"), 10)} size={36} color={N.link} />
      <Carrier x={300} y={420} s={0.8} />
      {g < shot + 40 ? <Jet x={jp.x} y={jp.y} a={jp.a} s={1.4} /> : null}
      {label > 0 && g < shot + 40 ? (
        <g opacity={label}>
          <rect x={jp.x - 70} y={jp.y - 70} width={140} height={140} fill="none" stroke={C.red} strokeWidth={5} />
          <text x={jp.x} y={jp.y - 86} textAnchor="middle" fill={C.red} fontFamily={COND} fontWeight={800} fontSize={40}>
            "CRUISE MISSILE"
          </text>
        </g>
      ) : null}
      <Missile g={g} x1={760} y1={780} x2={mpos(1900, 160, 960, 620, 0.75, 60).x} y2={mpos(1900, 160, 960, 620, 0.75, 60).y} at={shot} dur={40} color={N.link} s={2.2} />
      <Blast g={g} x={mpos(1900, 160, 960, 620, 0.75, 60).x} y={mpos(1900, 160, 960, 620, 0.75, 60).y} at={shot + 40} s={1.6} />
      {[0, 1].map((i) => (
        <g key={i} opacity={chutes}>
          <Chute x={mpos(1900, 160, 960, 620, 0.75, 60).x - 60 + i * 110} y={mpos(1900, 160, 960, 620, 0.75, 60).y + 90 + chutes * 60} s={1.6} />
        </g>
      ))}
      <Tag x={960} y={150} text="DEC 2024 · RED SEA" p={ease(g, A("103"), 10)} out={ease(g, mistook - 4, 6)} size={54} />
      <Tag x={960} y={150} text="A FRIENDLY JET" p={ease(g, mistook, 10)} out={ease(g, A("104") - 4, 6)} size={56} color={N.link} />
      <Tag x={960} y={150} text="BOTH PILOTS SURVIVED" p={chutes} out={ease(g, A("105") - 4, 6)} size={54} color={N.link} />
      <Tag x={960} y={150} text="MISIDENTIFIED" p={ease(g, W("105", "misidentification"), 10)} size={60} color={C.red} kind="drop" />
      <Tag x={70} y={90} anchor="start" text="MISTAKE 02 · WRONG TARGET" p={ease(g, A("102"), 12)} size={44} color={C.red} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 25. Mistake three: magazine maths (107–112) ═════════════════════════
const C107: React.FC<{ g: number }> = ({ g }) => {
  const bars = ease(g, W("108", "costs"), 20);
  const sm2 = ease(g, W("109", "two"), 30);
  const waves = W("111", "waves");
  const fired = Math.round(interpolate(g, [waves, E("112")], [0, 90], CLAMP));
  return (
    <Svg>
      <Sea seed="math" tint="#0a1c2c" tintOp={0.6} />
      <g opacity={bars} transform="translate(200 300)">
        <text x={0} y={0} fill={C.text} fontFamily={COND} fontWeight={800} fontSize={48} letterSpacing={3}>
          INTERCEPTOR
        </text>
        <rect x={0} y={30} width={780 * sm2} height={70} rx={8} fill={N.link} />
        <text x={790 * sm2 + 20} y={84} fill={N.link} fontFamily={COND} fontWeight={800} fontSize={56} opacity={sm2}>
          SM-2 ≈ $2M
        </text>
        <text x={0} y={200} fill={C.text} fontFamily={COND} fontWeight={800} fontSize={48} letterSpacing={3}>
          CHEAP DRONE
        </text>
        <rect x={0} y={230} width={60} height={70} rx={8} fill={C.red} />
        <text x={80} y={284} fill={C.red} fontFamily={COND} fontWeight={800} fontSize={48}>
          FAR LESS
        </text>
      </g>
      <g opacity={ease(g, waves - 10, 12)} transform="translate(1180 380)">
        <Vls x={0} y={0} cols={10} n={90} fired={fired} cell={42} flash={fired - 1} />
      </g>
      {Array.from({ length: 10 }).map((_, i) => {
        const x = interpolate(g, [waves + i * 12, waves + i * 12 + 90], [2100, 1300], CLAMP);
        return g > waves + i * 12 && g < waves + i * 12 + 90 ? (
          <g key={i} transform={`translate(${x} ${220 + (i % 5) * 50}) rotate(180)`}>
            <path d="M 16 0 L -12 -16 L -6 0 L -12 16 Z" fill={N.foe} />
          </g>
        ) : null;
      })}
      <Big x={960} y={560} text="03 · MAGAZINE MATHS" p={ease(g, A("107"), 14) * (1 - ease(g, W("108", "costs") - 6, 10))} size={120} color={C.red} />
      <Tag x={960} y={150} text="WAVES TO DRAIN THE WALL" p={ease(g, waves, 10)} size={56} color={C.red} />
      <Tag x={70} y={90} anchor="start" text="MISTAKE 03 · MAGAZINE MATHS" p={ease(g, A("107"), 12)} size={44} color={C.red} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 26. Mistake four: narrow water (113–117) ═════════════════════════
const C113: React.FC<{ g: number }> = ({ g }) => {
  const M = MAPS.strait;
  const open = 1 - inOut(g, A("115") - 10, A("115") + 30);
  const shore = ease(g, W("115", "launchers"), 14);
  const lesson = ease(g, A("116"), 20);
  const stop = ease(g, W("117", "stop"), 30);
  const c = M.pts.center;
  return (
    <Svg>
      <g opacity={open}>
        <g transform={cam(0.6, CV.x, CV.y)}>
          <Fleet g={g} />
          {[R3, R2, R1 + 240].map((r) => (
            <RangeRing key={r} cx={CV.x} cy={CV.y} r={r} p={1} op={0.6} />
          ))}
        </g>
        <Tag x={960} y={150} text="OPEN OCEAN: HUNDREDS OF KM" p={ease(g, A("114"), 10)} size={54} color={N.link} />
      </g>
      <g opacity={1 - open}>
        <Sea seed="strait" tintOp={0.45} flow={0.35} />
        <Land d={M.d} />
        {[60, 140, 260].map((r, i) => (
          <ellipse key={r} cx={c[0]} cy={c[1]} rx={r * 1.1} ry={r * mix(1, 0.32, 1 - open)} fill="none" stroke={N.link} strokeWidth={4} strokeDasharray="16 10" opacity={(0.8 - i * 0.15) * (1 - lesson * stop)} />
        ))}
        {(() => {
          // predictable track up the strait (south-east → north-west)
          const k = lin(g, A("115") - 20, E("117"));
          const cx = mix(c[0] + 170, c[0] - 150, k);
          const cy = mix(c[1] + 150, c[1] - 140, k);
          return (
            <g>
              <line x1={c[0] + 260} y1={c[1] + 240} x2={c[0] - 260} y2={c[1] - 250} stroke={N.link} strokeWidth={3} strokeDasharray="6 14" opacity={0.5} />
              <g transform={`translate(${cx} ${cy}) rotate(-135) scale(0.6)`}>
                <Carrier x={0} y={0} s={0.5} />
              </g>
              {[
                [c[0] - 260, c[1] - 280],
                [c[0] + 300, c[1] + 220],
                [c[0] - 380, c[1] + 40],
              ].map(([x, y], i) => (
                <Missile key={i} g={g} x1={x} y1={y} x2={cx + 10} y2={cy} at={W("115", "launchers") + 20 + i * 22} dur={40} bend={30} s={1.2} linger={10} />
              ))}
            </g>
          );
        })()}
        {[
          [c[0] - 260, c[1] - 280],
          [c[0] + 300, c[1] + 220],
          [c[0] - 380, c[1] + 40],
        ].map(([x, y], i) => (
          <g key={i} opacity={shore}>
            <rect x={x - 20} y={y - 12} width={40} height={24} rx={4} fill={N.foe} stroke="#000" strokeWidth={2} />
            <Ring x={x} y={y} g={g} at={W("115", "launchers") + i * 8} color={C.red} r={70} />
          </g>
        ))}
        <text x={c[0] + 140} y={c[1] - 40} fill="rgba(160,200,220,0.6)" fontFamily={COND} fontWeight={700} fontSize={30} letterSpacing={6}>
          BAB-EL-MANDEB
        </text>
        <Tag x={960} y={150} text="RINGS CRUSHED FLAT" p={ease(g, W("115", "crushes"), 10)} out={ease(g, A("116") - 4, 6)} size={56} color={C.red} />
        <Tag x={960} y={150} text="PEOPLE FAIL FIRST" p={ease(g, W("116", "hardware"), 10)} size={58} color={C.tracer} />
      </g>
      <Tag x={70} y={90} anchor="start" text="MISTAKE 04 · NARROW WATER" p={ease(g, A("113"), 12) * (1 - lesson)} size={44} color={C.red} />
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ 27. Outro: fortress rings, the order, the next video (118–124) ═════════════════════════
const ORDER = ["EYES", "FIGHTERS", "WALL", "GUN"];
const C118: React.FC<{ g: number }> = ({ g }) => {
  const fort = ease(g, W("119", "fortress"), 20) * (1 - inOut(g, W("119", "steel"), W("119", "steel") + 40));
  const order = ["eyes", "fighters", "wall", "gun"].map((w) => W("120", w));
  const one = ease(g, A("121"), 12);
  const all = ease(g, A("122"), 12);
  const end = ease(g, A("123"), 20);
  const next = ease(g, W("124", "submarines"), 20);
  return (
    <Svg>
      <g transform={cam(mix(0.62, 0.86, lin(g, A("118"), A("123"))), CV.x, CV.y)}>
        <Fleet g={g} sub={next} cap={1} />
        {/* a pulse runs out through the rings each time the VO names a layer */}
        {order.map((o, i) =>
          [0, 1].map((k) => <Ring key={`${i}${k}`} x={CV.x} y={CV.y} g={g} at={o + k * 14} color={C.tracer} r={[R1, R2, R3, 120][i] + 40} />),
        )}
        {[R3, R2, R1].map((r, i) => (
          <RangeRing key={r} cx={CV.x} cy={CV.y} r={r} p={1} op={0.6 + 0.4 * ease(g, order[3 - i] ?? 0, 10)} color={g > (order[3 - i] ?? 1e9) ? C.tracer : N.link} />
        ))}
        {/* the old fortress: concentric walls under the fleet */}
        <g opacity={fort}>
          {[R3, R2, R1].map((r) => (
            <circle key={r} cx={CV.x} cy={CV.y} r={r} fill="none" stroke="#c9b48a" strokeWidth={26} strokeDasharray="40 12" opacity={0.7} />
          ))}
        </g>
      </g>
      <g opacity={1 - end}>
        {ORDER.map((t, i) => {
          const p = ease(g, order[i], 10);
          return (
            <g key={t} opacity={p} transform={`translate(${330 + i * 420} 820)`}>
              <rect x={-180} y={-60} width={360} height={110} rx={14} fill="rgba(6,12,18,0.88)" stroke={C.tracer} strokeWidth={3} />
              <text y={16} textAnchor="middle" fill={C.text} fontFamily={COND} fontWeight={800} fontSize={54} letterSpacing={3}>
                {`${i + 1} · ${t}`}
              </text>
            </g>
          );
        })}
        <Tag x={960} y={150} text="FORTRESS RINGS" p={fort} size={56} color="#e0c99a" />
        <Tag x={960} y={150} text="DEFENCE: ONE GOOD MOMENT" p={one} out={ease(g, A("122") - 4, 6)} size={54} color={N.link} />
        <Tag x={960} y={150} text="ATTACKER: EVERYTHING MUST FAIL" p={all} out={ease(g, A("123") - 4, 6)} size={54} color={C.red} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#05080c" opacity={0.55 * end} />
      <Heading text="HOW A CARRIER" sub="DEFENDS ITSELF" p={end} out={next} y={480} size={130} />
      <g opacity={next}>
        <text x={960} y={420} textAnchor="middle" fill={C.muted} fontFamily={COND} fontWeight={700} fontSize={46} letterSpacing={10}>
          NEXT
        </text>
        <Big x={960} y={540} text="HOW SUBMARINES ACTUALLY FIGHT" p={next} size={96} color={C.tracer} />
      </g>
      <Vignette />
    </Svg>
  );
};

// ═════════════════════════ scene list ═════════════════════════
const SCENES: [string, React.FC<{ g: number }>][] = [
  ["01", C01],
  ["03", C03],
  ["08", C08],
  ["09", C09],
  ["13", C13],
  ["16", C16],
  ["22", C22],
  ["25", C25],
  ["32", C32],
  ["38", C38],
  ["46", C46],
  ["51", C51],
  ["56", C56],
  ["60", C60],
  ["65", C65],
  ["67", C67],
  ["71", C71],
  ["73", C73],
  ["79", C79],
  ["81", C81],
  ["86", C86],
  ["92", C92],
  ["96", C96],
  ["102", C102],
  ["107", C107],
  ["113", C113],
  ["118", C118],
];
const XF = 8;
const sceneStart = (i: number) => (i === 0 ? 0 : A(SCENES[i][0]) - 10);
const SceneWrap: React.FC<{ from: number; first: boolean; C: React.FC<{ g: number }> }> = ({ from, first, C: Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, XF], [0, 1], CLAMP) }}>
      <Comp g={f + from} />
    </AbsoluteFill>
  );
};

// ═════════════════════════ chapter cards + progress strip ═════════════════════════
const CHAPTERS: [string, string, string][] = [
  ["13", "12", "THE CARRIER NEVER SAILS ALONE"],
  ["32", "31", "FIRST, IT HAS TO SEE YOU"],
  ["51", "50", "RING ONE: THE FIGHTERS"],
  ["65", "64", "RING TWO: THE MISSILE WALL"],
  ["79", "78", "RING THREE: THE LAST KILOMETRES"],
  ["92", "91", "DEADLY MISTAKES"],
  ["118", "117", "THE BLUEPRINT"],
];
const ChapterCards: React.FC = () => {
  const g = useCurrentFrame();
  const starts = CHAPTERS.map(([id]) => A(id));
  const cur = starts.filter((s) => g >= s - 30).length - 1;
  const card = CHAPTERS.map(([id, prev], i) => ({ i, p: ease(g, E(prev) + 3, 10) * (1 - ease(g, A(id) - 6, 8)) })).find((c) => c.p > 0);
  const n = CHAPTERS.length;
  const segW = (1904 - (n - 1) * 8) / n;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {card ? (
          <g opacity={card.p}>
            <rect x={0} y={0} width={1920} height={1080} fill="#060b10" />
            <text x={960} y={400} textAnchor="middle" fill={C.tracer} fontFamily={COND} fontWeight={700} fontSize={46} letterSpacing={12}>
              {`CHAPTER 0${card.i + 1}`}
            </text>
            <Heading text={CHAPTERS[card.i][2]} p={card.p} y={560} size={110} />
            {CHAPTERS.map((_, k) => (
              <rect key={k} x={960 - (n * 140) / 2 + k * 140 + 6} y={680} width={128} height={10} rx={5} fill={k < card.i ? C.muted : k === card.i ? C.tracer : "rgba(255,255,255,0.15)"} />
            ))}
          </g>
        ) : null}
        {cur >= 0 ? (
          <g opacity={0.75 * ease(g, starts[0] - 30, 20)}>
            {CHAPTERS.map((_, k) => {
              const a = starts[k];
              const b = k + 1 < n ? starts[k + 1] : carrierDuration - END_EXTRA * FPS;
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
const KEYWORDS = [
  "strike group", "defence in depth", "Hawkeye", "horizon", "Super Hornets", "F-35s", "Growler", "archer", "Aegis", "SM-6", "SM-2s", "SM-2",
  "vertical launch cells", "ESSM", "SeaRAM", "Phalanx", "decoys", "Gravely", "Eisenhower", "Moskva", "Neptune", "Gettysburg", "mistakes",
  "rings", "ring", "wall",
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

// ═════════════════════════ sound ═════════════════════════
const SX = (n: string) => `sfx/synth/${n}.wav`;
const SoundTrack: React.FC = () => {
  const cues: [string, number, number?][] = [
    [SX("radar-ping"), A("01"), -26],
    [SX("missile-launch"), W("01", "enemy") + 10, -24],
    [SX("sub-hit"), W("02", "kill"), -18],
    [SX("jet-pass"), W("04", "fighters"), -24],
    [SX("ciws-burst"), W("04", "gun"), -22],
    [SX("sub-hit"), W("08", "no"), -18],
    ...CHAPTERS.map(([, prev]) => [SX("sub-hit"), E(prev) + 3, -18] as [string, number, number]),
    [SX("sonar-ping"), W("24", "hunting"), -24],
    [SX("missile-launch"), W("31", "one") - 18, -24],
    [SX("radar-ping"), W("35", "pops"), -22],
    [SX("radar-ping"), W("41", "talks"), -26],
    [SX("jam-static"), W("43", "blind"), -24],
    [SX("jet-pass"), W("52", "combat"), -24],
    [SX("missile-launch"), W("54", "destroy"), -24],
    ["sfx/explosion/explosive-impact-from-afar-2758.mp3", W("54", "destroy") + 40, -22],
    [SX("jam-static"), W("56", "jams"), -26],
    [SX("jet-pass"), W("61", "launched"), -22],
    [SX("missile-launch"), W("66", "fire"), -22],
    ["sfx/explosion/explosive-impact-from-afar-2758.mp3", W("66", "fire") + 70, -22],
    [SX("missile-launch"), A("69") + 29, -22], // first shot of the 3D launch (carrier3d.py: shot start + 40)
    [SX("missile-launch"), W("70", "storm"), -20],
    [SX("missile-launch"), W("72", "twice"), -22],
    [SX("missile-launch"), W("79", "many"), -24],
    [SX("ciws-burst"), W("81", "spraying"), -18],
    ["sfx/explosion/short-explosion-1694.mp3", W("81", "spraying") + 22, -18],
    [SX("alarm"), W("87", "houthi"), -26],
    [SX("ciws-burst"), W("88", "destroyed") - 20, -22],
    ["sfx/explosion/short-explosion-1694.mp3", W("88", "destroyed"), -20],
    ["sfx/explosion/bomb-explosion-in-battle-2800.mp3", W("97", "hit"), -20],
    [SX("missile-launch"), W("103", "shot"), -22],
    ["sfx/explosion/explosive-impact-from-afar-2758.mp3", W("103", "shot") + 40, -20],
    [SX("missile-launch"), W("115", "launchers"), -24], // the launch in the 3D strait shot
  ];
  return (
    <>
      {cues.map(([file, at, level], i) => (
        <Sfx key={i} file={file} at={at} level={level} align={file.includes("/synth/") ? "start" : "onset"} />
      ))}
    </>
  );
};

// ═════════════════════════ 3D hero shots (Blender: scripts/blender/carrier3d.py, cued on the same VO) ═════════════════════════
const HERO_LABELS: Record<keyof typeof SHOTS3D, React.FC<{ g: number }>> = {
  hook: ({ g }) => {
    const enemy = W("01", "enemy");
    const q = ease(g, W("02", "kill"), 12);
    return (
      <>
        {[
          [120, 130],
          [1800, 170],
          [1820, 900],
          [90, 880],
          [960, 60],
        ].map(([x, y], i) => {
          const k = inOut(g, enemy + i * 6, enemy + 90 + i * 6);
          return <Blip key={i} x={mix(x, mix(x, 960, 0.45), k)} y={mix(y, mix(y, 540, 0.45), k)} p={ease(g, enemy + i * 6, 8) * (1 - q)} size={2.4} />;
        })}
        <Tag x={960} y={150} text="65 PLANES · 1 SHIP" p={ease(g, W("01", "planes"), 12)} out={ease(g, enemy + 20, 8)} size={56} kind="wipe" />
        <rect x={0} y={0} width={1920} height={1080} fill="#05080c" opacity={0.5 * q} />
        <Heading text="HARD TO KILL?" p={q} y={540} size={170} />
      </>
    );
  },
  fleet: ({ g }) => <Tag x={960} y={150} text="30+ KNOTS" p={ease(g, W("21", "knots"), 12)} size={64} color={C.tracer} kind="drop" />,
  vls: ({ g }) => (
    <>
      <Tag x={960} y={150} text="DESTROYER · ~90 CELLS" p={ease(g, W("69", "cells") - 8, 10)} out={ease(g, W("69", "cruiser") - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="CRUISER · 100+" p={ease(g, W("69", "cruiser"), 10)} out={ease(g, W("70", "storm") - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="A STORM OF INTERCEPTORS" p={ease(g, W("70", "storm"), 10)} size={56} color={N.link} />
    </>
  ),
  phalanx: ({ g }) => (
    <>
      <Tag x={960} y={150} text="PHALANX" p={ease(g, W("81", "phalanx"), 12)} out={ease(g, W("81", "spraying") - 4, 6)} size={60} color={C.tracer} />
      <Tag x={960} y={150} text="4,500 ROUNDS / MIN" p={ease(g, W("81", "spraying"), 10)} size={56} color={C.tracer} />
    </>
  ),
  hawkeye: ({ g }) => (
    <>
      <Tag x={960} y={150} text="E-2 HAWKEYE" p={ease(g, W("39", "hawkeye"), 12)} out={ease(g, W("40", "horizon") - 4, 6)} size={60} color={N.link} />
      <Tag x={960} y={150} text="HUNDREDS OF KM" p={ease(g, W("40", "hundreds"), 10)} size={60} color={N.link} kind="drop" />
    </>
  ),
  drones: ({ g }) => <Tag x={960} y={150} text="LOW · SLOW · CHEAP" p={ease(g, W("48", "cheap"), 10)} size={56} color={C.red} />,
  cap: ({ g }) => <Tag x={960} y={150} text="COMBAT AIR PATROL" p={ease(g, W("52", "combat"), 12)} size={56} color={C.tracer} />,
  escort: ({ g }) => (
    <>
      <Tag x={960} y={150} text="FLOATING MISSILE BATTERY" p={ease(g, W("65", "floating"), 10)} out={ease(g, W("65", "aegis") - 4, 6)} size={56} color={C.tracer} />
      <Tag x={960} y={150} text="AEGIS: ONE NETWORK" p={ease(g, W("65", "aegis"), 10)} size={56} color={C.tracer} />
    </>
  ),
  gravely: ({ g }) => {
    const kill = W("88", "destroyed");
    return (
      <>
        <Tag x={960} y={150} text="30 JAN 2024 · RED SEA" p={ease(g, W("87", "30"), 10)} out={ease(g, W("87", "gravely") - 4, 6)} size={56} />
        <Tag x={960} y={150} text="USS GRAVELY" p={ease(g, W("87", "gravely"), 10)} out={ease(g, kill - 6, 6)} size={56} color={N.link} />
        <Tag x={960} y={150} text="PHALANX · SECONDS FROM IMPACT" p={ease(g, kill, 10)} size={52} color={C.tracer} />
      </>
    );
  },
  moskva: ({ g }) => (
    <>
      <Tag x={960} y={150} text="DEFENCES NEVER ENGAGED?" p={ease(g, A("99"), 10)} out={ease(g, A("101") - 4, 6)} size={52} color={C.muted} />
      <Tag x={960} y={150} text="SANK THE NEXT DAY" p={ease(g, W("101", "sank"), 10)} size={58} color={C.red} kind="drop" />
      <Tag x={70} y={90} anchor="start" text="MISTAKE 01 · ASLEEP" p={1} size={44} color={C.red} />
    </>
  ),
  strait: ({ g }) => (
    <>
      <Tag x={960} y={150} text="RINGS CRUSHED FLAT" p={ease(g, W("115", "crushes"), 10)} out={ease(g, W("115", "launchers") - 4, 6)} size={56} color={C.red} />
      <Tag x={960} y={150} text="LAUNCHERS ON THE SHORE" p={ease(g, W("115", "launchers"), 10)} size={56} color={C.red} />
      <Tag x={70} y={90} anchor="start" text="MISTAKE 04 · NARROW WATER" p={1} size={44} color={C.red} />
    </>
  ),
  dusk: () => <Tag x={960} y={150} text="PEOPLE FAIL FIRST" p={1} size={58} color={C.tracer} />,
};
const HeroShot: React.FC<{ id: keyof typeof SHOTS3D }> = ({ id }) => {
  const f = useCurrentFrame();
  const { from, frames } = SHOTS3D[id];
  const Labels = HERO_LABELS[id];
  return (
    <AbsoluteFill style={{ opacity: from === 0 ? interpolate(f, [frames - XF, frames], [1, 0], CLAMP) : interpolate(f, [0, XF, frames - XF, frames], [0, 1, 1, 0], CLAMP) }}>
      <Video src={staticFile(`video/carrier/${id}.mp4`)} muted name={`3D ${id}`} />
      <AbsoluteFill>
        <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
          <Labels g={f + from} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CarrierVideo: React.FC<{ subtitles?: boolean }> = ({ subtitles = true }) => {
  const music = (f: number) =>
    interpolate(f, [A("13"), A("51"), A("79"), A("92")], [0.85, 0.95, 1.05, 1.0], CLAMP) *
    interpolate(f, [W("02", "kill") - 2, W("02", "kill") + 4, A("03") - 8, A("03") + 10], [1, 0.2, 0.2, 1], CLAMP) *
    interpolate(f, [W("81", "spraying") - 30, W("81", "spraying") - 8, W("81", "spraying") + 40, W("81", "spraying") + 80], [1, 0.25, 0.25, 1], CLAMP) *
    interpolate(f, [carrierDuration - 90, carrierDuration], [1, 0], CLAMP);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map(([id, Comp], i) => {
        const from = sceneStart(i);
        const to = i + 1 < SCENES.length ? sceneStart(i + 1) + XF : carrierDuration;
        return (
          <Sequence key={id} from={from} durationInFrames={to - from} name={`Scene ${id}`}>
            <SceneWrap from={from} first={i === 0} C={Comp} />
          </Sequence>
        );
      })}
      {(Object.keys(SHOTS3D) as (keyof typeof SHOTS3D)[]).map((id) => (
        <Sequence key={id} from={SHOTS3D[id].from} durationInFrames={SHOTS3D[id].frames} name={`3D ${id}`}>
          <HeroShot id={id} />
        </Sequence>
      ))}
      <ChapterCards />
      {subtitles ? <Subtitles /> : null}
      <Audio src={staticFile("voiceover/carrier/vo.mp3")} name="VO" />
      <MusicBed file="sfx/music/own/carrier-watch.mp3" level={-31} duck={music} />
      <SoundTrack />
    </AbsoluteFill>
  );
};

