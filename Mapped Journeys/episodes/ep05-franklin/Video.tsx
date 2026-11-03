/**
 * Mapped Journeys Ep05 (style J "Satellite Journey", EN, Lucas locked Gate 2 on 2026-11-03):
 * "Why did it take 169 years to find Franklin's ships?" Greenhithe → Greenland → Lancaster Sound
 * → Beechey Island → down the west side of King William Island, beset 1846; the Victory Point
 * note (McClintock 1859); Inuit testimony (Rae 1854); the wrecks (2014, 2016). Script, claim
 * ledger, coordinates, image sources: kich-ban-franklin-FINAL.md; spec: 01_EPISODE-SPEC_franklin.md.
 * Every cue comes from the VO timing + Whisper word times.
 */
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/franklin.timing.json";
import words from "../../../src/voiceover/franklin.words.json";
import plates from "../../../public/images/franklin/map/plates.json";
import regions from "./regions.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, PILLAR_MUSIC, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../../Style Library/kit-common";
import { Ambience, type Bed, EventSounds, type EventKind } from "../../../Style Library/J-satellite-journey/journey-sound";
import {
  along, BigWord, camAt, camSpeed, FullFrame, GeoLine, GlowRoute, Handle, J, type JKey, type Plate, PhotoCard,
  project, projectLine, RegionFill, Ring, RoutePreview, SatMap, StopLabel, SubWord, Vessel,
} from "../../../Style Library/J-satellite-journey/satellite-journey";

const FPS = 30;
const IMG = "images/franklin";
/** Gate 4 (Lucas 2026-11-03): Historical Documentary (Tunetank, Ep01) instead of P5 Mystery Quirky (leberch, Content ID risk, wrong mood). */
const MUSIC = PILLAR_MUSIC.P1;
const RED = "#E5383B";
const ICE_BLUE = "#7FD3FF";

/** Images in public/images/franklin. AI frames wait for Lucas (image-prompts.md); a false flag leaves the frame out. */
const HAVE = {
  franklin: true, // daguerreotype, 1845, Commons PD
  ships: true, // "Departure of the Erebus and Terror", Illustrated London News, 24 May 1845, Commons PD
  note: true, // the Victory Point note (1847 + 1848), Commons PD
  rae: true, // Stephen Pearce, John Rae (1853), Commons PD
  desk: true, // Robert Knudsen, the Resolute desk (1961), White House photo, Commons PD
  fullIce: true, // AI, Lucas
  fullMarch: true, // AI, Lucas
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
export const PLATES: Plate[] = (["world", "atlantic", "uk", "arcticw", "arctice", "kwi"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
/** FINAL Gate 4: Wikipedia, or the Victory Point note itself (beechey, beset, victory). */
export const P = {
  greenhithe: [0.2823, 51.4504],
  stromness: [-3.3, 58.96],
  disko: [-52, 69],
  melville: [-61, 75.75],
  beechey: [-91.6542, 74.7244],
  beset: [-98.3833, 70.0833],
  victory: [-98.6833, 69.6283],
  kwi: [-97.4167, 69.1667],
  simpson: [-97.5, 68.5333],
  adelaide: [-97.8, 68.1],
  pelly: [-90.0833, 68.8833],
  london: [-0.1275, 51.5072],
  // Viscount Melville Sound centre: the card only, no pin (exact spot unsourced)
  resolute: [-105, 74.25],
  // corner A of the 10 × 10 km protected area (the wreck's exact spot is withheld)
  erebus: [-98.8729, 68.2458],
  terror: [-98.9383, 68.9036],
} satisfies Record<string, LL>;

/** Sea legs in order; points between stops only keep the line at sea (schematic). */
export const LEGS: LL[][] = [
  [P.greenhithe, [1.4, 51.6], [2.3, 53.4], [0.6, 56.5], [-2.2, 58.75], P.stromness],
  [P.stromness, [-6, 59.4], [-20, 59.6], [-43.6, 59.2], [-48.6, 60.8], [-52.6, 64.4], [-54.2, 67.8], P.disko],
  [P.disko, [-56, 70.6], [-59.4, 73.4], P.melville],
  [P.melville, [-67.5, 75.2], [-76, 74.3], [-84, 74.2], [-89, 74.4], P.beechey],
  // 1846: down Peel Sound and Franklin Strait, into the ice off King William Island
  [P.beechey, [-92.2, 74.25], [-95.6, 73.9], [-96.5, 73], [-96.5, 71.5], [-97.6, 70.6], P.beset],
];
const SAIL: [number, number][] = [
  [w("04", 2), at("05") - 6],
  [at("05"), w("05", 8)],
  [w("05", 8), at("06") + 6],
  [at("07") - 10, w("07", 8)],
  [w("10", 1), w("13", 4)],
];
/** The side they took: Victoria Strait, ice that "does not always clear" (ledger F5). */
const WEST: LL[] = [[-96.5, 71.5], [-97.6, 70.6], P.beset, [-99.6, 69.4], [-99.4, 68.4]];
/** The east side, which clears in summer (Amundsen's way): James Ross and Rae Straits. */
export const EAST: LL[] = [[-96.5, 71.5], [-96.2, 70.5], [-96.5, 69.83], [-94.85, 68.83], [-96.2, 68.55], P.simpson];
/** 1848: the 105 walk south from Victory Point down the west coast to the Adelaide Peninsula (schematic). */
const WALK: LL[] = [P.victory, [-98.45, 69.2], [-98.2, 68.85], [-97.9, 68.6], P.simpson, P.adelaide];

// ------------------------------------------------------------------ camera

const KEYS: JKey[] = [
  // hook: the whole North Atlantic and Arctic, then down onto King William Island on "a note"
  // King William Island has to be on screen in the hook (the note is there): centre well west of Greenland
  { at: 0, lon: -62, lat: 66, zoom: 12, tilt: 10, bearing: 0, push: 0.02, orbit: 0.3 },
  { at: w("03", 9) - 10, lon: -97.8, lat: 69.4, zoom: 60, tilt: 20, bearing: 0, dur: 40 },
  // Greenhithe and the North Sea
  { at: at("04") - 4, lon: -1.5, lat: 54.5, zoom: 40, tilt: 18, bearing: 0, dur: 40 },
  { at: at("05"), lon: -48, lat: 66, zoom: 17, tilt: 12, bearing: 0 },
  { at: at("06"), lon: -62, lat: 75.5, zoom: 34, tilt: 18, bearing: -2 },
  { at: at("07") - 10, lon: -88, lat: 74.3, zoom: 55, tilt: 20, bearing: 0 },
  { at: at("08"), lon: -91.6, lat: 74.5, zoom: 100, tilt: 24, bearing: 2 },
  // 1846: south to King William Island, both sides of it in view
  { at: at("10"), lon: -96.5, lat: 72, zoom: 40, tilt: 18, bearing: 0 },
  // the ships sit mid-screen, clear of the "WRONG SIDE" chip; the island below them
  { at: at("11"), lon: -97.6, lat: 70.2, zoom: 62, tilt: 20, bearing: 0 },
  { at: at("13"), lon: -98.3, lat: 69.85, zoom: 110, tilt: 24, bearing: -2 },
  { at: w("14", 6), lon: -98.6, lat: 69.45, zoom: 130, tilt: 24, bearing: 0 },
  { at: at("16"), lon: -98, lat: 69.0, zoom: 70, tilt: 20, bearing: 0 },
  // quiet beat: the note; no orbit, the slowest push
  { at: at("17"), lon: -98.6, lat: 69.4, zoom: 130, tilt: 22, bearing: 0, push: 0.006, orbit: 0 },
  { at: w("19", 4), lon: -98.1, lat: 68.75, zoom: 85, tilt: 22, bearing: 0, push: 0.006, orbit: 0 },
  // the twist: the Inuit at Pelly Bay, London, the Resolute
  { at: at("21"), lon: -95.5, lat: 69.0, zoom: 42, tilt: 16, bearing: 0 },
  { at: at("22"), lon: -91.5, lat: 68.6, zoom: 65, tilt: 20, bearing: 2 },
  { at: at("23") - 6, lon: -1.6, lat: 53.6, zoom: 38, tilt: 18, bearing: 0, dur: 40 },
  { at: at("25") - 6, lon: -101, lat: 74.0, zoom: 45, tilt: 18, bearing: 0, dur: 40 },
  { at: at("27"), lon: -98.6, lat: 69.45, zoom: 120, tilt: 24, bearing: 0 },
  { at: at("28"), lon: -97.8, lat: 69.0, zoom: 52, tilt: 16, bearing: 0, push: 0.015 },
  // the wrecks
  { at: at("29"), lon: -98.8, lat: 68.4, zoom: 110, tilt: 24, bearing: 0 },
  { at: at("30"), lon: -98.9, lat: 68.95, zoom: 120, tilt: 24, bearing: 0 },
  // payoff: the whole route, then back to the two ships
  { at: at("32") - 4, lon: -62, lat: 66, zoom: 12, tilt: 10, bearing: 0, push: 0.015, orbit: 0.2, dur: 40 },
  { at: at("34"), lon: -98.4, lat: 68.7, zoom: 70, tilt: 20, bearing: 0, push: 0.02, dur: 40 },
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
  const westO = interpolate(f, [w("11", 0), w("11", 0) + 8, at("14") - 10, at("14")], [0, 1, 1, 0], CLAMP);
  const eastO = interpolate(f, [at("12"), at("12") + 8, at("13") + 20, at("13") + 30], [0, 0.85, 0.85, 0], CLAMP);
  const walkO = interpolate(f, [w("19", 4), w("19", 4) + 6, at("21") - 6, at("21") + 4], [0, 0.9, 0.9, 0], CLAMP);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={PLATES} />
      <GeoLine pts={projectLine(cam, WEST, 0.1)} p={interpolate(f, [w("11", 0), at("12")], [0, 1], CLAMP)} color={RED} o={westO} width={7} />
      <GeoLine pts={projectLine(cam, EAST, 0.1)} p={interpolate(f, [at("12"), end("12")], [0, 1], CLAMP)} color={ICE_BLUE} o={eastO} width={5} />
      <GeoLine pts={projectLine(cam, WALK, 0.1)} p={interpolate(f, [w("19", 4), end("19") + 10], [0, 1], CLAMP)} color={RED} o={walkO} width={5} />
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
  const label = (key: keyof typeof P, name: string, from: number, to: number, size?: number, onSide?: "left" | "right") => (
    <StopLabel key={`${key}-${name}-${from}`} name={name} x={pt[key][0]} y={pt[key][1]} f={f} at={from} out={to} side={onSide ?? side(pt[key][0])} size={size} />
  );
  /** A picture card on a leader line from P[key] (only once its file is in public/). */
  const card = (key: keyof typeof P, src: keyof typeof HAVE, from: number, to: number, mono?: number) =>
    HAVE[src] && (
      <PhotoCard key={`${key}-${src}`} src={`${IMG}/${src}.jpg`} x={pt[key][0]} y={pt[key][1]} cx={cardX(pt[key][0])} cy={cardY(pt[key][1])} f={f} at={from} out={to} mono={mono} />
    );
  // the note turns grey while the second message is read
  const noteMono = interpolate(f, [at("18"), end("19")], [0, 1], CLAMP);

  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={blur ? 7 : 1}>
        <MapLayer />
      </CameraMotionBlur>
      {/* the ships sail until the ice holds them, and stay there until they are left (line 19) */}
      {f >= SAIL[0][0] && cam.zoom > 15 && f < w("19", 3) && <Vessel x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />}

      {/* ---- hook ---- */}
      <RoutePreview legs={LEGS.map((leg) => projectLine(cam, leg, 0.3))} f={f} at={w("01", 3)} out={w("01", 12)} />
      {/* on screen from the first frame: the hook number has to land inside the first 3 s (lesson E1) */}
      <BigWord text="3 YEARS" f={f} at={0} out={at("02")} y={300} />
      <SubWord text="OF FOOD" f={f} at={w("01", 10)} out={at("02")} y={525} />
      <BigWord text="169 YEARS" f={f} at={w("02", 4)} out={w("03", 6)} y={300} color={RED} />
      <SubWord text="ONE NOTE" f={f} at={w("03", 9)} out={at("04") - 6} y={330} size={96} color={J.gold} />

      {/* ---- leaving ---- */}
      {label("greenhithe", "GREENHITHE", w("04", 0), at("05"))}
      {/* after the flight lands (KEYS[2] + 40 frames), so the leader line has its pin */}
      {card("greenhithe", "franklin", w("04", 5), at("05") + 4)}
      {/* below: the Franklin card fills the top */}
      <SubWord text="129 MEN" f={f} at={w("04", 5)} out={at("05") - 4} y={1250} size={110} color={J.gold} />
      {label("melville", "BAFFIN BAY", w("05", 9), at("07"))}
      {card("melville", "ships", w("05", 5), at("06") + 10)}
      {/* below: the Baffin Bay pin is still high while the camera settles */}
      <SubWord text="LAST SEEN" f={f} at={at("06")} out={at("07") - 4} y={1250} size={110} color={RED} />

      {/* ---- Beechey Island ---- */}
      {/* left, over Wellington Channel: to the right the label sits on the snow of Devon Island */}
      {label("beechey", "BEECHEY ISLAND", w("07", 8), at("10"), 60, "left")}
      <SubWord text="3 GRAVES" f={f} at={at("08")} out={at("09") + 10} y={330} size={110} />
      <Ring x={pt.beechey[0]} y={pt.beechey[1]} f={f} at={w("08", 1)} out={end("09")} />
      <SubWord text="NO NOTE" f={f} at={w("09", 7)} out={at("10") - 4} y={330} size={110} color={RED} />

      {/* ---- into the ice (root cause) ---- */}
      <RegionFill cam={cam} rings={regions.kwi} f={f} at={w("10", 9)} out={at("12")} kind="glow" name="KING WILLIAM ISLAND" size={70} nameAt={[-97.2, 69.0]} />
      <SubWord text="WRONG SIDE" f={f} at={at("11")} out={at("13") - 4} y={330} size={110} color={RED} />
      {HAVE.fullIce && <FullFrame src={`${IMG}/full-ice.jpg`} f={f} at={w("13", 3)} out={end("13") + 6} />}
      <BigWord text="19 MONTHS" f={f} at={w("13", 11)} out={at("14")} y={300} />
      {label("victory", "VICTORY POINT", w("14", 6), at("16"), 60)}
      <BigWord text="ALL WELL" f={f} at={w("15", 2)} out={at("16")} y={300} />
      {label("simpson", "ALREADY MAPPED", w("16", 8), at("17"), 60)}
      <Ring x={pt.simpson[0]} y={pt.simpson[1]} f={f} at={w("16", 8)} out={at("17")} color={ICE_BLUE} />
      <SubWord text="< 150 KM" f={f} at={w("16", 3)} out={at("17") - 4} y={330} size={110} color={ICE_BLUE} />

      {/* ---- quiet beat: the note ---- */}
      {/* fixed low on the screen: the camera moves the pin during the beat, and the chips sit at the top */}
      {HAVE.note && <PhotoCard src={`${IMG}/note.jpg`} x={pt.victory[0]} y={pt.victory[1]} cx={540} cy={1130} f={f} at={at("17")} out={end("20") + 6} mono={noteMono} />}
      <SubWord text="24 DEAD" f={f} at={w("18", 0)} out={at("19")} y={330} size={96} />
      <BigWord text="105" f={f} at={w("19", 2)} out={at("20")} y={300} />

      {/* ---- the twist: the Inuit ---- */}
      <SubWord text="THE TWIST" f={f} at={w("21", 1)} out={at("22") + 6} y={330} size={110} color={J.gold} />
      {label("pelly", "PELLY BAY", w("22", 3), at("23") - 6)}
      {card("pelly", "rae", w("22", 4), w("22", 9))}
      {HAVE.fullMarch && <FullFrame src={`${IMG}/full-march.jpg`} f={f} at={w("22", 9)} out={end("22") + 6} />}
      {label("london", "LONDON", w("23", 1), at("25") - 6)}
      <SubWord text="ATTACKED" f={f} at={w("23", 5)} out={at("25") - 8} y={330} size={110} color={RED} />
      {/* the Resolute: no pin, the card floats over Viscount Melville Sound */}
      {HAVE.desk && <PhotoCard src={`${IMG}/desk.jpg`} x={540} y={CARD_Y} cx={540} cy={CARD_Y} f={f} at={w("26", 1)} out={at("27") - 4} />}
      <SubWord text="THE OVAL OFFICE" f={f} at={w("26", 6)} out={at("27") - 4} y={1000} size={96} color={J.gold} />
      {label("victory", "VICTORY POINT", at("27"), at("28"), 60)}
      <BigWord text="1859" f={f} at={w("27", 5)} out={at("28")} y={300} />
      <SubWord text="STILL LOST" f={f} at={w("28", 3)} out={at("29") - 4} y={330} size={110} color={RED} />

      {/* ---- found ---- */}
      {/* wreck labels go left, over the water of Queen Maud Gulf: to the right they sit on snow */}
      {label("erebus", "EREBUS", w("29", 3), at("30"), undefined, "left")}
      <Ring x={pt.erebus[0]} y={pt.erebus[1]} f={f} at={w("29", 3) + 4} out={at("30")} />
      <BigWord text="2014" f={f} at={w("29", 1)} out={at("30")} y={300} />
      {label("terror", "TERROR", w("31", 0), at("32"), undefined, "left")}
      <Ring x={pt.terror[0]} y={pt.terror[1]} f={f} at={w("31", 0) + 4} out={at("32")} />
      <BigWord text="2016" f={f} at={w("30", 1)} out={at("32")} y={300} />

      {/* ---- payoff ---- */}
      <BigWord text="3 YEARS" f={f} at={at("32")} out={at("33")} y={300} />
      <BigWord text="169 YEARS" f={f} at={w("33", 4)} out={at("34") + 10} y={300} color={RED} />
      {label("erebus", "EREBUS", w("34", 2), Infinity, undefined, "left")}
      {label("terror", "TERROR", w("34", 2), Infinity, undefined, "left")}
      <Ring x={pt.terror[0]} y={pt.terror[1]} f={f} at={w("34", 6)} />
    </AbsoluteFill>
  );
};

/** Accent sounds (≤ 1 per beat): the hook number, the long flights, the ice on the hulls, the pencil, the finds. */
const SFX: { file: string; at: number; level?: number; seconds?: number }[] = [
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("02", 4), level: -17 },
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[2].at, level: -17 },
  { file: "sfx/whoosh/epic-whoosh-478371.mp3", at: KEYS[3].at, level: -19 },
  { file: "sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3", at: at("11"), level: -21 },
  { file: "sfx/creak/ship-hull-creak-3076.mp3", at: w("13", 3), level: -22, seconds: 5 },
  { file: "sfx/pen/writing-pencil-3194.mp3", at: at("17") + 6, level: -24 },
  { file: "sfx/whoosh/whoosh-cinematic-5-376880.mp3", at: KEYS[16].at, level: -19 },
  { file: "sfx/whoosh/whoosh-cinematic-sound-effect-376889.mp3", at: KEYS[17].at, level: -19 },
  { file: "sfx/ping/bell-of-promise-930.mp3", at: w("29", 3), level: -24, seconds: 4 },
  { file: "sfx/riser/cinematic-trailer-riser-790.mp3", at: at("32") - 70, level: -22 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("33", 4), level: -16 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("34", 6), level: -23 },
];

const BIG_WHOOSH = SFX.filter((s) => s.file.includes("whoosh")).map((s) => s.at);
const QUIET = [at("17") - 6, at("21") - 12];

/**
 * One small sound per visual event (Bible §6), same cue expressions as the Scene.
 * Nothing in the quiet beat (lines 17–20) except the pencil above.
 * shortcut: cues are listed beside the JSX, not derived from it; see ep02-hannibal/Video.tsx.
 */
const EVENTS: [EventKind, number][] = [
  ["pen", w("01", 3)],
  ["chip", w("01", 10)],
  ["chip", w("03", 9)],
  ["label", w("04", 0)],
  ["card", w("04", 5) + 4],
  ["chip", w("04", 5)],
  ["cardOut", at("05") + 4],
  ["card", w("05", 5) + 4],
  ["label", w("05", 9)],
  ["chip", at("06")],
  ["label", w("07", 8)],
  ["chip", at("08")],
  ["chip", w("09", 7)],
  ["pen", w("10", 9)],
  ["pen", w("11", 0)],
  ["pen", at("12")],
  ["chip", w("13", 11)],
  ["label", w("14", 6)],
  ["chip", w("15", 2)],
  ["chip", w("16", 3)],
  ["label", w("16", 8)],
  ["chip", w("21", 1)],
  ["label", w("22", 3)],
  ["card", w("22", 4) + 4],
  ["label", w("23", 1)],
  ["chip", w("23", 5)],
  ["card", w("26", 1) + 4],
  ["chip", w("26", 6)],
  ["label", at("27")],
  ["chip", w("27", 5)],
  ["chip", w("28", 3)],
  ["label", w("29", 3)],
  ["chip", w("30", 1)],
  ["label", w("31", 0)],
  ["chip", at("32")],
  ["label", w("34", 2)],
  ["ping", w("34", 6) + 8],
  ...KEYS.map((k): [EventKind, number] => ["fly", k.at]).filter(
    ([, a], i) => i > 0 && BIG_WHOOSH.every((b) => Math.abs(b - a) > 6) && (a < QUIET[0] || a > QUIET[1]),
  ),
];

/** Ambience by place: open sea → the wooden ships at sea → Arctic wind → the ice → the quiet beat → wind to the end. */
const BEDS: Bed[] = [
  { file: "amb-air/deep-cinematic-wind-hum-1177.mp3", from: 0, to: at("04") + 15, level: -33 },
  { file: "amb-ship/wooden-ship-on-the-sea-1187.mp3", from: at("04"), to: at("07") + 15, level: -33 },
  { file: "amb-wind/winter-wind-loop-1175.mp3", from: at("07"), to: at("13") + 15, level: -33 },
  { file: "amb-wind/blizzard-cold-winds-1153.mp3", from: at("13"), to: at("17") + 15, level: -32 },
  { file: "amb-air/deep-cinematic-wind-hum-1177.mp3", from: at("17"), to: at("21") + 15, level: -31 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("21"), to: at("23"), level: -34 },
  { file: "amb-wind/winter-wind-loop-1175.mp3", from: at("25"), to: end("34") + 24, level: -34 },
];

/** Same headroom as Ep01–Ep04: the whole mix 3 dB down, mastered back to −14 LUFS by render:j. */
const TRIM_DB = -3;

/** Music dips (≈ −9 dB) under the note. */
const duck = (f: number) => interpolate(f, [at("17") - 10, at("17") + 10, at("21") - 8, at("21") + 4], [1, 0.35, 0.35, 1], CLAMP);

export const Franklin: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <Handle />
    <Audio name="VO" src={staticFile("voiceover/franklin/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
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
export const franklinDuration = (fps: number) => Math.round((end("34") / FPS + 0.8) * fps);
