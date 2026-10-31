/**
 * Mapped Journeys Ep04 (style J "Satellite Journey", EN, Lucas locked Gate 2 on 2026-10-31):
 * "Why did the monk behind Journey to the West need seventeen years?" Chang'an → the Silk Road
 * north of the Taklamakan → India → home south of the Taklamakan, after his disciple Huili's
 * biography (Samuel Beal's translation, 1911). Script, claim ledger, coordinates, image sources:
 * kich-ban-xuanzang-FINAL.md; spec: 01_EPISODE-SPEC_xuanzang.md.
 * Every cue comes from the VO timing + Whisper word times.
 */
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/xuanzang.timing.json";
import words from "../../../src/voiceover/xuanzang.words.json";
import plates from "../../../public/images/xuanzang/map/plates.json";
import regions from "./regions.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../../Style Library/kit-common";
import { Ambience, type Bed, EventSounds, type EventKind } from "../../../Style Library/J-satellite-journey/journey-sound";
import {
  along, BigWord, camAt, camSpeed, FullFrame, GeoLine, GlowRoute, Handle, J, type JKey, type Plate, PhotoCard, Pilgrim,
  project, projectLine, RegionFill, Ring, RoutePreview, SatMap, Scribble, SourceLine, StopLabel, SubWord,
} from "../../../Style Library/J-satellite-journey/satellite-journey";

const FPS = 30;
const IMG = "images/xuanzang";
/** Bible §2: P4 Sacred Journeys → Documentary Nature (leberch), calm. */
const MUSIC = "sfx/music/p3-documentary-nature-516419.mp3";

/** Images in public/images/xuanzang. AI frames wait for Lucas (image-prompts.md); a false flag leaves the frame out. */
const HAVE = {
  xuanzang: true, // portrait with book pack, 14th c. (Kamakura), Tokyo National Museum, Commons PD
  bamiyan: true, // Émile Thérond, the Buddhas of Bamiyan (1885), Commons PD
  dunhuang: true, // Dunhuang Cave 103 mural, Xuanzang returning from India (8th c.), Commons PD
  pagoda: true, // William Edgar Geil, the Giant Wild Goose Pagoda (1911), Commons PD
  fullDesert: true, // AI, Lucas
  fullGlacier: true, // AI, Lucas
};

// ------------------------------------------------------------------ VO timing helpers

const line = (id: string) => {
  const l = timing.lines.find((x) => x.id === id);
  if (!l) throw new Error(`no VO line ${id}`);
  return l;
};
/** Frame where VO line `id` starts. */
const at = (id: string) => Math.round(line(id).start * FPS);
/** Frame where VO line `id` ends. */
const end = (id: string) => Math.round(line(id).end * FPS);
/** Frame where script word k (0-based) of line `id` is spoken. */
const w = (id: string, k: number) => {
  const l = line(id);
  const heard = (words as Record<string, number[]>)[id];
  if (!heard?.length) return at(id);
  const n = l.text.split(/\s+/).length;
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / n))] * FPS);
};

// ------------------------------------------------------------------ geography

/** Coarse first, finest last (make-plates.py, Gate 4). */
export const PLATES: Plate[] = (["world", "west", "east", "desert", "tianshan", "indus"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
/** Wikipedia coordinates (FINAL, Gate 4). */
export const P = {
  changan: [108.942, 34.261],
  guazhou: [96.205, 40.246],
  hami: [93.515, 42.819],
  gaochang: [89.529, 42.853],
  bedel: [78.408, 41.408],
  samarkand: [66.976, 39.655],
  bamiyan: [67.833, 34.825],
  kapisa: [69.255, 34.94],
  nalanda: [85.443, 25.137],
  hund: [72.431, 34.017],
  khotan: [79.917, 37.117],
  pagoda: [108.959, 34.22],
} satisfies Record<string, LL>;

/**
 * Overland legs in travel order; points between stops only keep the line in the valleys and
 * oases (schematic, "the route is approximate" in the description). North of the Taklamakan out,
 * south of it home.
 */
export const LEGS: LL[][] = [
  [P.changan, [105.7, 34.6], [103.8, 36.1], [102.638, 37.929]],
  [[102.638, 37.929], [100.45, 38.93], [98.5, 39.75], P.guazhou],
  [P.guazhou, [95.6, 41.0], [94.6, 41.9], P.hami],
  [P.hami, [91.5, 42.9], P.gaochang],
  [P.gaochang, [87.4, 42.2], [86.5, 42.05], [84.0, 41.8], [82.932, 41.716], [80.3, 41.2], P.bedel],
  [P.bedel, [78.3, 42.1], [77.25, 42.2], [76.3, 42.5], [75.2, 42.805]],
  [[75.2, 42.805], [71.4, 42.9], [69.3, 41.3], P.samarkand],
  [P.samarkand, [66.973, 38.211], [67.2, 37.2], [66.898, 36.758], [67.4, 35.6], P.bamiyan],
  [P.bamiyan, P.kapisa, [70.45, 34.4], [71.568, 34.014], [72.8, 33.75], [74.79, 34.09], [75.58, 31.33], [77.67, 27.49], [79.914, 27.051], [81.85, 25.44], [83.0, 25.32], P.nalanda],
  // home
  [P.nalanda, [79.914, 27.051], [75.58, 31.33], [73.1, 33.0], P.hund],
  [P.hund, [71.0, 34.5], P.kapisa, [68.86, 36.73], [71.0, 37.0], [73.5, 37.0], [75.224, 37.773], [75.994, 39.468], [77.24, 38.42], P.khotan],
  [P.khotan, [82.7, 37.06], [85.5, 38.1], [89.0, 39.3], [92.0, 39.9], [94.664, 40.141], P.guazhou, [98.5, 39.75], [100.45, 38.93], [102.638, 37.929], [103.8, 36.1], P.changan],
];
const SAIL: [number, number][] = [
  [at("05"), at("06") + 10],
  [at("07"), end("07")],
  [at("08"), end("13")], // the desert draws on through the quiet beat
  [at("14"), w("14", 3)],
  [w("16", 9), at("17") + 10],
  [w("17", 2), end("18")],
  [at("19"), w("19", 1)],
  [w("19", 1), w("19", 2) + 8],
  [w("19", 4), w("22", 8)],
  [at("23"), w("23", 8)],
  [at("24"), w("25", 1)],
  [w("26", 0), w("27", 2)],
];

/** "Travelling across India" (2 s, schematic loop down to Kanchipuram and back). */
const INDIA_LOOP: LL[] = [
  P.nalanda, [87.9, 22.6], [86.0, 20.0], [83.2, 17.7], [80.3, 15.0], [79.704, 12.832], [77.6, 14.5], [75.0, 18.5],
  [73.0, 21.5], [71.5, 22.3], [68.5, 25.4], [71.5, 30.2], [76.0, 29.0], [79.914, 27.051], P.nalanda,
];
/** The straight line the hook promises: Chang'an to Nalanda over the mountains (2,479 km, ledger X2). */
export const STRAIGHT: LL[] = [P.changan, P.nalanda];

// ------------------------------------------------------------------ camera

const KEYS: JKey[] = [
  // hook: the whole region, then down onto the Himalayas on "beyond the Himalayas", then to Chang'an
  { at: 0, lon: 90, lat: 32, zoom: 17, tilt: 10, bearing: -2, push: 0.02, orbit: 0.4 },
  { at: w("01", 18) - 6, lon: 86, lat: 30, zoom: 26, tilt: 14, bearing: 0, dur: 30 },
  { at: at("03") - 4, lon: 108.6, lat: 34.6, zoom: 70, tilt: 22, bearing: 3, dur: 40 },
  { at: at("05"), lon: 103.5, lat: 37, zoom: 34, tilt: 18, bearing: 0 },
  { at: at("07"), lon: 96.6, lat: 40.0, zoom: 80, tilt: 22, bearing: -2 },
  // quiet beat: no orbit, the slowest push
  { at: at("08"), lon: 95.0, lat: 41.4, zoom: 70, tilt: 20, bearing: 0, push: 0.006, orbit: 0 },
  { at: at("14"), lon: 90.6, lat: 42.6, zoom: 70, tilt: 22, bearing: 2 },
  // the Himalayas block the straight road: pull out
  { at: w("16", 1), lon: 86, lat: 34, zoom: 16, tilt: 10, bearing: 0, dur: 36 },
  { at: at("17"), lon: 78.2, lat: 41.7, zoom: 75, tilt: 24, bearing: -2 },
  { at: at("19"), lon: 68, lat: 39, zoom: 40, tilt: 20, bearing: 0 },
  { at: w("19", 2), lon: 68.3, lat: 34.9, zoom: 55, tilt: 20, bearing: 2 },
  { at: w("19", 6), lon: 74, lat: 31, zoom: 22, tilt: 16, bearing: 0 },
  // the twist: all of India
  { at: at("21"), lon: 79, lat: 24, zoom: 17, tilt: 12, bearing: 0, push: 0.015 },
  { at: w("22", 7), lon: 84.6, lat: 25.4, zoom: 50, tilt: 20, bearing: 0, dur: 30 },
  { at: w("22", 9), lon: 79, lat: 21, zoom: 14, tilt: 10, bearing: 0 },
  // home
  { at: at("23"), lon: 72.6, lat: 34.0, zoom: 85, tilt: 24, bearing: -2 },
  { at: at("25"), lon: 79.5, lat: 37.3, zoom: 36, tilt: 18, bearing: 0 },
  { at: w("26", 0), lon: 95, lat: 37, zoom: 16, tilt: 12, bearing: 0, dur: 40 },
  // Chang'an sits above the centre so the Dunhuang card hangs below the pin, clear of "657 BOOKS"
  { at: at("27"), lon: 108.4, lat: 30.0, zoom: 60, tilt: 22, bearing: 2 },
  { at: at("29"), lon: 108.95, lat: 34.3, zoom: 120, tilt: 26, bearing: 0 },
  // why it matters + payoff: the whole loop
  { at: at("31"), lon: 90, lat: 33, zoom: 16, tilt: 10, bearing: 0, push: 0.015, orbit: 0.2, dur: 40 },
  { at: at("35"), lon: 108.6, lat: 34.6, zoom: 45, tilt: 18, bearing: 0, push: 0.02, dur: 40 },
];

// ------------------------------------------------------------------ scene

/** Card centre: above the pin, kept inside the safe zone. */
const cardX = (x: number) => Math.min(660, Math.max(380, x - 40));
const CARD_Y = 470;
/** A pin high on the screen would sit under the card: then the card hangs below it instead. */
const cardY = (y: number) => (y < 760 ? Math.min(880, y + 330) : CARD_Y);

const sailAt = (f: number) => {
  const next = SAIL.findIndex(([, e]) => f < e);
  const current = next === -1 ? SAIL.length - 1 : next;
  const [a, b] = SAIL[current];
  return { current, p: Math.min(1, Math.max(0, (f - a) / (b - a))), sailing: f >= SAIL[0][0] };
};

/** Map + route + map-bound lines: the layer that gets motion blur while the camera flies. */
const MapLayer: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const { current, p, sailing } = sailAt(f);
  // the straight line over the mountains: in the hook, and again when the Himalayas block it
  const straightO = f < at("03")
    ? interpolate(f, [w("01", 17), w("01", 17) + 8, at("02") + 20, at("03")], [0, 1, 1, 0], CLAMP)
    : interpolate(f, [w("16", 3), w("16", 3) + 8, at("17") - 10, at("17")], [0, 1, 1, 0], CLAMP);
  const straightP = interpolate(f, f < at("03") ? [w("01", 17), w("01", 17) + 24] : [w("16", 3), w("16", 3) + 24], [0, 1], CLAMP);
  const indusO = interpolate(f, [at("23"), at("23") + 10, at("25") - 10, at("25")], [0, 0.9, 0.9, 0], CLAMP);
  const loopO = interpolate(f, [w("22", 9), w("22", 9) + 6, at("23") - 6, at("23") + 4], [0, 1, 1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={PLATES} />
      {regions.indus.map((r, i) => (
        <GeoLine key={i} pts={projectLine(cam, r as LL[], 0.2)} p={1} color="#7FD3FF" o={indusO} width={7} />
      ))}
      <GeoLine pts={projectLine(cam, STRAIGHT, 0.5)} p={straightP} color={J.gold} o={straightO * 0.9} width={5} />
      <GeoLine pts={projectLine(cam, INDIA_LOOP, 0.3)} p={interpolate(f, [w("22", 9), end("22")], [0, 1], CLAMP)} color={J.gold} o={loopO * 0.85} width={5} />
      {sailing && <GlowRoute legs={LEGS.map((leg) => projectLine(cam, leg, 0.15))} current={current} p={p} />}
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const at2 = (ll: LL) => project(cam, ll[0], ll[1]);
  const { current, p, sailing } = sailAt(f);
  const head = along(projectLine(cam, LEGS[current], 0.15), sailing ? p : 0);
  // style J: motion blur only while the camera is really flying
  const blur = camSpeed(KEYS, f, FPS) > 14;
  const side = (x: number) => (x > 620 ? "left" : "right");
  const pt = Object.fromEntries(Object.entries(P).map(([k, ll]) => [k, at2(ll as LL)])) as Record<keyof typeof P, [number, number, number]>;

  /** A place label anchored to P[key]. */
  const label = (key: keyof typeof P, name: string, from: number, to: number) => (
    <StopLabel key={`${key}-${name}-${from}`} name={name} x={pt[key][0]} y={pt[key][1]} f={f} at={from} out={to} side={side(pt[key][0])} />
  );
  /** A painting card on a leader line from P[key] (only once its file is in public/). */
  const card = (key: keyof typeof P, src: keyof typeof HAVE, from: number, to: number) =>
    HAVE[src] && (
      <PhotoCard key={`${key}-${src}`} src={`${IMG}/${src}.jpg`} x={pt[key][0]} y={pt[key][1]} cx={cardX(pt[key][0])} cy={cardY(pt[key][1])} f={f} at={from} out={to} />
    );

  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={blur ? 7 : 1}>
        <MapLayer />
      </CameraMotionBlur>
      {f >= at("05") && cam.zoom > 15 && f < end("35") && <Pilgrim x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />}

      {/* ---- hook ---- */}
      <RoutePreview legs={LEGS.map((leg) => projectLine(cam, leg, 0.3))} f={f} at={w("01", 11)} out={w("01", 17)} />
      {/* before the hook words: the spotlight must not dim them */}
      <RegionFill cam={cam} rings={regions.himalayas} f={f} at={w("01", 20)} out={at("02") + 10} kind="glow" name="HIMALAYAS" size={130} angle={18} nameAt={[84.5, 29.4]} spotlight />
      <SourceLine text="According to his disciple Huili's biography" f={f} at={6} out={w("01", 9) - 6} />
      {/* on screen from the first frame: the hook number has to land inside the first 3 s (lesson E1) */}
      <BigWord text="17 YEARS" f={f} at={0} out={w("02", 9) - 4} y={300} />
      <SubWord text="2,500 km away" f={f} at={w("01", 17)} out={w("02", 9) - 4} y={525} />
      <SubWord text="ONE EMPEROR'S BAN" f={f} at={w("02", 8)} out={at("03") - 8} y={330} size={96} color="#E5383B" />

      {/* ---- the ban ---- */}
      {label("changan", "CHANG'AN", w("03", 0), at("05"))}
      {card("changan", "xuanzang", w("04", 3), at("05") + 6)}
      <SubWord text="NO ONE MAY LEAVE" f={f} at={at("06")} out={at("07") + 6} y={330} size={96} color="#E5383B" />
      {label("guazhou", "THE FRONTIER", w("07", 5), at("08") + 10)}

      {/* ---- quiet beat: the desert ---- */}
      <RegionFill cam={cam} rings={regions.gobi} f={f} at={w("09", 3)} out={at("10") + 6} kind="glow" name="GOBI" size={150} nameAt={[96.6, 42.8]} />
      {HAVE.fullDesert && <FullFrame src={`${IMG}/full-desert.jpg`} f={f} at={at("10")} out={end("13") + 6} />}
      <BigWord text="4 NIGHTS · 5 DAYS" f={f} at={w("11", 0)} out={at("12")} y={300} size={150} />

      {/* ---- Turpan, around the Himalayas ---- */}
      {label("gaochang", "TURPAN", w("14", 1), at("16"))}
      <Scribble x={pt.gaochang[0]} y={pt.gaochang[1]} f={f} at={w("14", 3) + 4} out={at("15") + 20} seed="turpan" r={90} />
      <SubWord text="NO FOOD · 3 DAYS" f={f} at={w("15", 5)} out={at("16") - 4} y={330} size={96} color={J.gold} />
      <RegionFill cam={cam} rings={regions.himalayas} f={f} at={w("16", 7)} out={at("17") - 6} color="#E5383B" name="HIMALAYAS" size={120} angle={18} nameAt={[84.5, 29.4]} spotlight />
      <SubWord text="BLOCKED" f={f} at={w("16", 5)} out={at("17") - 6} y={330} size={110} color="#E5383B" />
      <RegionFill cam={cam} rings={regions.tianshan} f={f} at={w("17", 4)} out={at("18") + 6} kind="glow" name="TIAN SHAN" size={130} angle={-8} nameAt={[79.4, 42.3]} />
      {/* the glacier painting comes in on the deaths (line 18), after the Tian Shan has been shown on the map */}
      {HAVE.fullGlacier && <FullFrame src={`${IMG}/full-glacier.jpg`} f={f} at={at("18")} out={end("18") + 6} />}
      <BigWord text="7 DAYS" f={f} at={w("17", 0)} out={at("18") + 10} y={300} />
      {label("samarkand", "SAMARKAND", w("19", 1), w("19", 2) + 6)}
      {label("bamiyan", "BAMIYAN", w("19", 2), w("19", 6))}
      {card("bamiyan", "bamiyan", w("19", 2) + 6, w("19", 6) + 4)}
      <RegionFill cam={cam} rings={regions.hindukush} f={f} at={w("19", 6)} out={at("20") + 6} kind="glow" name="HINDU KUSH" size={110} angle={-20} nameAt={[68.6, 35.0]} />

      {/* ---- the twist ---- */}
      <SubWord text="THE TWIST" f={f} at={w("20", 1)} out={at("21") + 6} y={330} size={110} color={J.gold} />
      <BigWord text="10+ YEARS" f={f} at={w("22", 2)} out={w("22", 9)} y={300} />
      {label("nalanda", "NALANDA", w("22", 8), at("23"))}
      <Ring x={pt.nalanda[0]} y={pt.nalanda[1]} f={f} at={w("22", 8) + 4} out={at("23")} />

      {/* ---- home ---- */}
      {label("hund", "INDUS", w("23", 8), at("25"))}
      <SubWord text="50 MANUSCRIPTS LOST" f={f} at={w("24", 0)} out={at("25") - 4} y={330} size={96} color="#7FD3FF" />
      {label("khotan", "KHOTAN", w("25", 1), w("26", 0))}
      <BigWord text="17 YEARS" f={f} at={w("25", 10)} out={at("26") + 10} y={300} />
      {label("changan", "CHANG'AN", w("27", 2), at("29"))}
      {card("changan", "dunhuang", w("27", 4), at("29") - 4)}
      <BigWord text="657 BOOKS" f={f} at={w("27", 7)} out={at("28") + 6} y={300} />
      <SubWord text="20 HORSES" f={f} at={w("28", 2)} out={at("29") - 4} y={330} size={110} color={J.gold} />

      {/* ---- why it matters ---- */}
      {label("pagoda", "XI'AN", w("30", 4), at("31"))}
      {card("pagoda", "pagoda", w("29", 1), at("31") - 4)}
      <SubWord text="JOURNEY TO THE WEST" f={f} at={w("31", 8)} out={at("32") - 4} y={330} size={110} color={J.gold} />

      {/* ---- payoff ---- */}
      <BigWord text="17 YEARS" f={f} at={w("32", 4)} out={at("33")} y={300} />
      <SubWord text="2,500 km" f={f} at={w("32", 0)} out={at("33")} y={525} />
      <SubWord text="1 HORSE → 20" f={f} at={w("33", 5)} out={at("35")} y={330} size={110} color={J.gold} />
      {label("changan", "CHANG'AN", w("35", 6), Infinity)}
      <Ring x={pt.changan[0]} y={pt.changan[1]} f={f} at={w("35", 8)} />
    </AbsoluteFill>
  );
};

/**
 * Accent sounds (≤ 1 per beat): the hook number, the long flights, the dropped water bag, the
 * blocked road, the bell at Nalanda, the boat on the Indus, the riser into the payoff.
 */
const SFX: { file: string; at: number; level?: number; seconds?: number }[] = [
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("01", 10), level: -17 },
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[2].at, level: -17 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("10", 3), level: -24 },
  { file: "sfx/whoosh/epic-whoosh-478371.mp3", at: KEYS[7].at, level: -19 },
  { file: "sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3", at: w("16", 5), level: -21 },
  { file: "sfx/whoosh/whoosh-cinematic-5-376880.mp3", at: KEYS[12].at, level: -19 },
  { file: "sfx/ping/bell-of-promise-930.mp3", at: w("22", 8), level: -24, seconds: 4 },
  { file: "sfx/water/sea-water-splash-1198.mp3", at: w("23", 5), level: -22 },
  { file: "sfx/whoosh/whoosh-cinematic-sound-effect-376889.mp3", at: KEYS[17].at, level: -19 },
  { file: "sfx/riser/cinematic-trailer-riser-790.mp3", at: w("32", 4) - 70, level: -22 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("32", 4), level: -16 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("35", 8), level: -23 },
];

const BIG_WHOOSH = SFX.filter((s) => s.file.includes("whoosh")).map((s) => s.at);
const QUIET = [at("08") - 6, at("14") - 12];

/**
 * One small sound per visual event (Bible §6), same cue expressions as the Scene.
 * Nothing in the quiet beat (lines 08–13) except the dropped water bag above.
 * shortcut: cues are listed beside the JSX, not derived from it; see ep02-hannibal/Video.tsx.
 */
const EVENTS: [EventKind, number][] = [
  ["pen", w("01", 11)],
  ["chip", w("01", 17)],
  ["pen", w("01", 20)],
  ["chip", w("02", 8)],
  ["label", w("03", 0)],
  ["card", w("04", 3) + 4],
  ["cardOut", at("05") + 6],
  ["chip", at("06")],
  ["label", w("07", 5)],
  ["label", w("14", 1)],
  ["pen", w("14", 3) + 8],
  ["chip", w("15", 5)],
  ["pen", w("16", 3)],
  ["chip", w("16", 5)],
  ["pen", w("16", 7) + 6],
  ["chip", w("17", 0)],
  ["label", w("17", 7)],
  ["label", w("19", 1)],
  ["label", w("19", 2)],
  ["card", w("19", 2) + 10],
  ["cardOut", w("19", 6) + 4],
  ["pen", w("19", 6) + 8],
  ["chip", w("20", 1)],
  ["chip", w("22", 2)],
  ["label", w("22", 8)],
  ["pen", w("22", 9)],
  ["label", w("23", 8)],
  ["chip", w("24", 0)],
  ["label", w("25", 1)],
  ["chip", w("25", 10)],
  ["label", w("27", 2)],
  ["card", w("27", 4) + 4],
  ["chip", w("27", 7)],
  ["chip", w("28", 2)],
  ["card", w("29", 1) + 4],
  ["label", w("30", 4)],
  ["chip", w("31", 8)],
  ["chip", w("32", 0)],
  ["chip", w("33", 5)],
  ["label", w("35", 6)],
  ["ping", w("35", 8) + 8],
  ...KEYS.map((k): [EventKind, number] => ["fly", k.at]).filter(
    ([, a], i) => i > 0 && BIG_WHOOSH.every((b) => Math.abs(b - a) > 6) && (a < QUIET[0] || a > QUIET[1]),
  ),
];

/** Ambience by place: open air → the Gansu road (+ hooves) → the desert → the oases → the ice → the passes → India → the Indus → the road home. */
const BEDS: Bed[] = [
  { file: "amb-air/meadow-wind-light-1166.mp3", from: 0, to: at("05") + 15 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("05"), to: at("08") + 15, level: -33 },
  { file: "horse/horse-fast-walking-on-dirt-ground-78.mp3", from: at("05"), to: at("08"), level: -36 },
  { file: "amb-air/deep-cinematic-wind-hum-1177.mp3", from: at("08"), to: at("14") + 15, level: -31 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("14"), to: at("17") + 15, level: -33 },
  { file: "horse/horse-fast-walking-on-dirt-ground-78.mp3", from: at("14"), to: at("16"), level: -37 },
  { file: "amb-wind/blizzard-cold-winds-1153.mp3", from: at("17"), to: at("19") + 15, level: -31 },
  { file: "amb-wind/wind-in-the-top-of-the-mountain-1267.mp3", from: at("19"), to: at("20") + 15, level: -36 },
  { file: "amb-air/meadow-wind-light-1166.mp3", from: at("20"), to: at("23") + 15, level: -33 },
  { file: "amb-river/river-in-the-forest-with-birds-1216.mp3", from: at("23"), to: at("25") + 15, level: -32 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("25"), to: end("35") + 24, level: -33 },
  { file: "horse/horse-fast-walking-on-dirt-ground-78.mp3", from: at("27"), to: at("29"), level: -35 },
];

/** Same headroom as Ep01–Ep03: the whole mix 3 dB down, mastered back to −14 LUFS by render:j. */
const TRIM_DB = -3;

/** Music dips (≈ −9 dB) under the quiet beat in the desert. */
const duck = (f: number) => interpolate(f, [at("08") - 10, at("08") + 10, at("14") - 8, at("14") + 4], [1, 0.35, 0.35, 1], CLAMP);

export const Xuanzang: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <Handle />
    <Audio name="VO" src={staticFile("voiceover/xuanzang/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    <MusicBed file={MUSIC} duck={duck} level={-25 + TRIM_DB} />
    <Ambience beds={BEDS} trim={TRIM_DB} />
    <EventSounds events={EVENTS} trim={TRIM_DB} />
    {SFX.map((s, i) => (
      <Sfx key={i} {...s} level={(s.level ?? -15) + TRIM_DB} />
    ))}
    <SafeGuide />
  </AbsoluteFill>
);

/** Last word + 0.8 s. */
export const xuanzangDuration = (fps: number) => Math.round((end("35") / FPS + 0.8) * fps);
