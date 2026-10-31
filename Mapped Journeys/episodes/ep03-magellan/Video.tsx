/**
 * Mapped Journeys Ep03 (style J "Satellite Journey", EN, Lucas locked Gate 2 on 2026-10-30):
 * "Why did Magellan's shortcut take three years?" Sanlúcar → right round the world → Sanlúcar,
 * after Pigafetta's account (Lord Stanley's translation, Hakluyt Society 1874). Script, claim
 * ledger, image sources: kich-ban-magellan-FINAL.md; spec: 01_EPISODE-SPEC_magellan.md.
 * Upgrade B1: longitudes are unwrapped (west of −180 keeps counting down) and the plates are laid
 * a second time 360° to the west, so one continuous map carries the whole circumnavigation.
 * Every cue comes from the VO timing + Whisper word times.
 */
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/magellan.timing.json";
import words from "../../../src/voiceover/magellan.words.json";
import plates from "../../../public/images/magellan/map/plates.json";
import regions from "./regions.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, PILLAR_MUSIC, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../../Style Library/kit-common";
import { Ambience, type Bed, EventSounds, type EventKind } from "../../../Style Library/J-satellite-journey/journey-sound";
import {
  along, BigWord, camAt, camSpeed, Cross, FullFrame, GeoLine, GlowRoute, Handle, type JKey, type Plate, PhotoCard,
  project, projectLine, RegionFill, Ring, RoutePreview, SatMap, Scribble, shiftPlates, SourceLine, StopLabel, SubWord, Vessel,
} from "../../../Style Library/J-satellite-journey/satellite-journey";

const FPS = 30;
const IMG = "images/magellan";

/** Images in public/images/magellan. AI frames wait for Lucas (image-prompts.md); a false flag leaves the frame out. */
const HAVE = {
  magellan: true, // Retrato de Hernando de Magallanes, Commons PD
  schoner: true, // Johannes Schöner, globe of 1520 (1853 facsimile), Commons PD
  ortelius: true, // Abraham Ortelius, Maris Pacifici (1589), the Victoria, Commons PD
  fullStrait: true, // AI, Lucas
  fullHunger: true, // AI, Lucas
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
/** Frame where script word k (0-based) of line `id` is spoken; same word mapping as the subtitles. */
const w = (id: string, k: number) => {
  const l = line(id);
  const heard = (words as Record<string, number[]>)[id];
  if (!heard?.length) return at(id);
  const n = l.text.split(/\s+/).length;
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / n))] * FPS);
};

// ------------------------------------------------------------------ geography

const BASE: Plate[] = (["world", "atlantic", "southam", "strait"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));
const EAST: Plate[] = (["philippines", "visayas"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));
/** World + the west: once as cut, and again 360° west for the far side of the voyage (B1). */
export const PLATES: Plate[] = [...shiftPlates(BASE.slice(0, 1), -360), ...BASE, ...shiftPlates([BASE[1]], -360), ...shiftPlates(EAST, -360)];

type LL = [number, number];
/** Wikipedia coordinates (FINAL, Gate 4); longitudes west of −180 unwrapped (original + −360). */
export const P = {
  sanlucar: [-6.35, 36.767],
  tenerife: [-16.606, 28.269],
  rio: [-43.206, -22.911],
  plata: [-55.783, -35.667],
  julian: [-67.75, -49.333],
  santacruz: [-68.522, -50.019],
  virgenes: [-68.354, -52.333],
  froward: [-71.306, -53.893],
  pacific: [-120, -20], // a point in the empty ocean for the root-cause card
  guam: [-215.341, 13.298],
  homonhon: [-234.261, 10.756],
  cebu: [-236.098, 10.293],
  mactan: [-236.033, 10.3],
  bohol: [-236.15, 9.65], // Tagbilaran
  brunei: [-245.333, 4.5],
  tidore: [-232.6, 0.683],
  timor: [-235.067, -9.233],
  goodhope: [-341.524, -34.358],
  capeverde: [-383.633, 15.067],
  sanlucarHome: [-366.35, 36.767],
  africa: [18.476, -34.358], // the Cape of Good Hope on the Portuguese route east (not unwrapped)
  moluccasEast: [127.4, 0.683], // Tidore reached the Portuguese way
} satisfies Record<string, LL>;

/** Sea legs in sailing order; waypoints keep the ship off land (checked on stills). The Pacific track is schematic. */
export const LEGS: LL[][] = [
  [[-6.4, 36.6], [-7.6, 35.4], [-12, 31], [-15.4, 28.8], [-16.1, 28.3]],
  [[-16.1, 28.3], [-20, 18], [-24, 5], [-30, -8], [-37, -18], [-43.15, -23.05]],
  [[-43.15, -23.05], [-47, -26.5], [-51, -31.5], [-54, -35.2], [-56.4, -35.3]],
  [[-56.4, -35.3], [-56, -38], [-60, -41], [-63.5, -43.5], [-65.5, -46.5], [-67.3, -49.3]],
  [[-67.3, -49.3], [-67.6, -50.0], [-68.3, -50.1]],
  [[-68.3, -50.1], [-68.0, -51.2], [-68.2, -52.4], [-69.5, -52.5], [-70.5, -53.0], [-71.2, -53.8], [-72.2, -53.6], [-73.3, -53.1], [-74.7, -52.7]],
  [[-74.7, -52.7], [-80, -45], [-90, -32], [-105, -22], [-130, -14], [-160, -5], [-185, 6], [-205, 12], [-215.5, 13.3]],
  [[-215.5, 13.3], [-225, 12], [-234.0, 10.8]],
  [[-234.0, 10.8], [-234.7, 10.0], [-235.4, 10.0], [-235.95, 10.25]],
  [[-235.95, 10.25], [-236.1, 9.8]],
  [[-236.1, 9.6], [-238, 8.5], [-241, 7.5], [-244.5, 6.5], [-245.2, 5.0]],
  [[-245.2, 5.0], [-243, 6.5], [-238, 6], [-235, 3.5], [-233, 1.5], [-232.65, 0.75]],
  [[-232.65, 0.6], [-232.5, -3], [-234, -6.5], [-235, -8.7]],
  [[-235, -9.6], [-250, -14], [-280, -25], [-310, -33], [-330, -37], [-341.5, -34.6]],
  [[-341.5, -34.6], [-346, -28], [-352, -15], [-358, 0], [-370, 10], [-383.4, 14.9]],
  [[-383.4, 14.9], [-378, 22], [-372, 30], [-367.5, 35.5], [-366.4, 36.75]],
];
const SAIL: [number, number][] = [
  [w("04", 2), at("05")],
  [at("06"), w("07", 1)],
  [w("07", 3), w("07", 8)],
  [at("08"), w("08", 9)],
  [at("10"), w("10", 2)],
  [at("11"), end("11")],
  [at("16"), end("21")], // the whole Pacific draws on through the quiet beat
  [at("22") - 6, w("23", 2)],
  [w("23", 2), w("24", 1)],
  [at("26"), w("26", 7)],
  [at("27"), w("27", 3)],
  [w("27", 3), w("27", 7)],
  [at("28"), w("28", 2)],
  [w("28", 3), w("29", 1)],
  [w("29", 2), w("30", 2)],
  [at("32"), w("32", 8)],
];

/** "A few days wide": the small sea Magellan expected, drawn out of the strait (ledger #2). */
export const IMAGINED: LL[] = [[-74.7, -52.7], [-80, -49], [-85, -46]];
/** The short way east, Portugal's by treaty (ledger #9): around Africa to the Spice Islands. */
/**
 * Natural Earth (regions.json): the open Pacific plus its marginal seas (without them the fill has straight edges).
 * It is cut at ±180°: the western pieces move −360° onto the unwrapped map.
 */
const PACIFIC = [
  ...regions.northpacific, ...regions.southpacific, ...regions.philippinesea, ...regions.coralsea,
  ...regions.tasmansea, ...regions.solomonsea, ...regions.bismarcksea, ...regions.beringsea,
].map((r) => (r[0][0] > 0 ? r.map(([x, y]) => [x - 360, y]) : r));

const EASTWAY: LL[] = [[-8, 37], [-17, 20], [-12, 3], [5, -20], [18.5, -36], [35, -30], [55, -10], [75, 5], [95, 5], [115, 0], [127.4, 0.68]];

// ------------------------------------------------------------------ camera

const KEYS: JKey[] = [
  // hook (lesson E10): wide, then into the empty Pacific on "Pacific", then home to Spain from the bridge line
  { at: 0, lon: -195, lat: 2, zoom: 4.6, tilt: 8, bearing: -2, push: 0.02, orbit: 0.4 },
  { at: w("01", 15) - 6, lon: -120, lat: -18, zoom: 9, tilt: 12, bearing: 0, dur: 30 },
  { at: at("02") + 4, lon: -6.35, lat: 36.7, zoom: 60, tilt: 22, bearing: 3, dur: 40 },
  { at: at("04") + 6, lon: -12, lat: 31, zoom: 28, tilt: 18, bearing: 0 },
  { at: at("06") - 4, lon: -28, lat: 2, zoom: 9, tilt: 14, bearing: 0, dur: 40 },
  { at: w("07", 3), lon: -50, lat: -30, zoom: 22, tilt: 18, bearing: -2 },
  { at: at("08"), lon: -63, lat: -44, zoom: 24, tilt: 20, bearing: 0 },
  { at: at("10"), lon: -68, lat: -50, zoom: 60, tilt: 22, bearing: 2 },
  { at: at("11"), lon: -71, lat: -53, zoom: 110, tilt: 26, bearing: -2 },
  // root cause: the Pacific, then the Portuguese way east, then back into the Pacific
  { at: at("13"), lon: -110, lat: -20, zoom: 6, tilt: 10, bearing: 0, push: 0.015 },
  { at: at("15"), lon: 45, lat: 0, zoom: 4.2, tilt: 8, bearing: 0, dur: 40 },
  { at: at("16"), lon: -120, lat: -15, zoom: 7, tilt: 12, bearing: 0, dur: 40 },
  // quiet beat: no orbit, the slowest push
  { at: at("17") + 6, lon: -150, lat: -5, zoom: 7.5, tilt: 12, bearing: 0, push: 0.006, orbit: 0 },
  { at: at("22") - 10, lon: -215, lat: 13, zoom: 40, tilt: 20, bearing: 0 },
  { at: at("23"), lon: -235, lat: 10.4, zoom: 90, tilt: 24, bearing: 2 },
  { at: w("24", 1), lon: -236.05, lat: 10.2, zoom: 220, tilt: 26, bearing: -2 },
  { at: at("27"), lon: -238.5, lat: 5, zoom: 32, tilt: 20, bearing: 0 },
  { at: at("28") + 6, lon: -290, lat: -15, zoom: 7, tilt: 12, bearing: 0, dur: 40 },
  { at: w("29", 2), lon: -360, lat: -8, zoom: 7, tilt: 12, bearing: 0 },
  { at: at("30"), lon: -383.6, lat: 15, zoom: 50, tilt: 20, bearing: 2 },
  // why it matters + payoff: the whole world
  { at: at("32"), lon: -200, lat: 0, zoom: 4.4, tilt: 8, bearing: 0, push: 0.015, orbit: 0.2, dur: 40 },
  { at: at("36"), lon: -236.03, lat: 10.3, zoom: 40, tilt: 18, bearing: 0, push: 0.02, dur: 40 },
];

// ------------------------------------------------------------------ text


/** Card centre: above the pin, kept inside the safe zone. */
const cardX = (x: number) => Math.min(660, Math.max(380, x - 40));
const CARD_Y = 470;
/** A pin high on the screen would sit under the card: then the card hangs below it instead. */
const cardY = (y: number) => (y < 760 ? Math.min(880, y + 330) : CARD_Y);

// ------------------------------------------------------------------ scene

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
  // the imagined "few days" sea shows twice: in the hook, and again when the root cause names it
  const inHook = f < at("13");
  const imaginedO = inHook
    ? 1 - interpolate(f, [at("02") - 6, at("02") + 10], [0, 1], CLAMP)
    : interpolate(f, [at("13"), at("13") + 8], [0, 1], CLAMP) * (1 - interpolate(f, [at("15"), at("15") + 10], [0, 1], CLAMP));
  const imaginedP = interpolate(f, inHook ? [w("01", 17), w("01", 17) + 30] : [w("13", 7), w("13", 7) + 30], [0, 1], CLAMP);
  const eastO = 1 - interpolate(f, [at("16") - 6, at("16") + 10], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={PLATES} />
      <GeoLine pts={projectLine(cam, IMAGINED)} p={imaginedP} color="#F2C14E" o={imaginedO * 0.9} width={5} />
      <GeoLine pts={projectLine(cam, EASTWAY, 0.5)} p={interpolate(f, [w("15", 3), w("15", 9)], [0, 1], CLAMP)} color="#E5383B" o={eastO} width={6} />
      {sailing && <GlowRoute legs={LEGS.map((leg) => projectLine(cam, leg, 0.3))} current={current} p={p} />}
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const at2 = (ll: LL) => project(cam, ll[0], ll[1]);
  const { current, p, sailing } = sailAt(f);
  const head = along(projectLine(cam, LEGS[current], 0.3), sailing ? p : 0);
  // style J: motion blur only while the camera is really flying
  const blur = camSpeed(KEYS, f, FPS) > 14;
  const side = (x: number) => (x > 620 ? "left" : "right");
  const pt = Object.fromEntries(Object.entries(P).map(([k, ll]) => [k, at2(ll as LL)])) as Record<keyof typeof P, [number, number, number]>;

  /** A place label anchored to P[key]. */
  const label = (key: keyof typeof P, name: string, from: number, to: number) => (
    <StopLabel key={`${key}-${name}`} name={name} x={pt[key][0]} y={pt[key][1]} f={f} at={from} out={to} side={side(pt[key][0])} />
  );
  /** A painting card on a leader line from P[key] (only once its file is in public/). */
  const card = (key: keyof typeof P, src: keyof typeof HAVE, from: number, to: number, extra: { lean?: number; mono?: number } = {}) =>
    HAVE[src] && (
      <PhotoCard key={`${key}-${src}`} src={`${IMG}/${src}.jpg`} x={pt[key][0]} y={pt[key][1]} cx={cardX(pt[key][0])} cy={cardY(pt[key][1])} f={f} at={from} out={to} {...extra} />
    );

  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={blur ? 7 : 1}>
        <MapLayer />
      </CameraMotionBlur>
      {f >= at("04") && cam.zoom > 15 && <Vessel x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />}

      {/* ---- hook ---- */}
      <RoutePreview legs={LEGS.map((leg) => projectLine(cam, leg, 0.3))} f={f} at={w("01", 8)} out={w("01", 15) - 8} />
      <SourceLine text="According to Antonio Pigafetta, who sailed with him" f={f} at={6} out={w("01", 9) - 6} />
      {/* on screen from the first frame: the hook number has to land inside the first 3 s (lesson E1) */}
      <BigWord text="3 YEARS" f={f} at={0} out={w("02", 9) - 4} y={300} />
      <SubWord text="vs. a few days" f={f} at={w("01", 18)} out={w("02", 9) - 4} y={525} />
      <SubWord text="A MAP TOO SMALL" f={f} at={w("02", 9)} out={at("03") - 8} y={330} size={96} color="#F2C14E" />

      {/* ---- act 1: the Atlantic ---- */}
      <RegionFill cam={cam} rings={regions.spain} f={f} at={w("03", 0)} out={at("04") + 6} kind="glow" name="SPAIN" size={150} angle={-6} nameAt={[-3.6, 40.2]} spotlight />
      {label("sanlucar", "SANLÚCAR", w("04", 0), at("05"))}
      {card("sanlucar", "magellan", w("04", 0), at("05") + 10)}
      <SubWord text="1519" f={f} at={w("03", 1)} out={at("04") + 10} y={330} size={96} color="#F2C14E" />
      {label("rio", "BRAZIL", w("07", 1), w("07", 6))}
      {label("plata", "RÍO DE LA PLATA", w("07", 7), at("08"))}
      <Cross x={pt.plata[0]} y={pt.plata[1]} f={f} at={w("07", 12)} out={at("08") + 6} />
      {label("julian", "SAN JULIÁN", w("08", 8), at("10"))}
      <BigWord text="5 MONTHS" f={f} at={w("08", 11)} out={at("10") - 4} y={300} />
      {label("santacruz", "SANTA CRUZ", w("10", 1), at("11"))}

      {/* ---- act 2: the strait ---- */}
      {label("froward", "THE STRAIT", w("11", 2), at("13"))}
      <Scribble x={pt.froward[0]} y={pt.froward[1]} f={f} at={w("11", 3)} out={at("12") + 10} seed="strait" r={110} />
      {HAVE.fullStrait && <FullFrame src={`${IMG}/full-strait.jpg`} f={f} at={w("11", 6)} out={at("12") + 4} />}
      {/* after the frame: the number stays on screen over the painting */}
      <BigWord text="38 DAYS" f={f} at={w("11", 4)} out={at("12") + 4} y={300} />

      {/* ---- act 3: the root cause ---- */}
      <BigWord text="3 OR 4 DAYS?" f={f} at={w("13", 7)} out={at("14") + 6} y={300} />
      {card("pacific", "schoner", w("14", 1), at("15") + 4)}
      <SubWord text="PORTUGAL'S ROUTE" f={f} at={w("15", 9)} out={at("16") - 4} y={330} size={96} color="#E5383B" />

      <RegionFill cam={cam} rings={PACIFIC} f={f} at={w("16", 5)} out={at("17") + 10} kind="sea" outline={false} name="PACIFIC" size={190} nameAt={[-140, -12]} spotlight />

      {/* ---- quiet beat: the empty Pacific ---- */}
      <BigWord text="98 DAYS" f={f} at={w("17", 0)} out={at("18") + 20} y={300} />
      {HAVE.fullHunger && <FullFrame src={`${IMG}/full-hunger.jpg`} f={f} at={w("18", 2)} out={at("21") - 4} />}

      {/* ---- act 4: the Philippines ---- */}
      {label("guam", "GUAM", w("22", 0), at("23") + 6)}
      <RegionFill cam={cam} rings={regions.philippines} dLon={-360} f={f} at={w("23", 2)} out={at("24")} kind="glow" name="PHILIPPINES" size={130} angle={-60} nameAt={[124.6, 11.4]} spotlight />
      {label("mactan", "MACTAN", w("24", 1), at("26") + 10)}
      <Scribble x={pt.mactan[0]} y={pt.mactan[1]} f={f} at={w("24", 1) + 4} out={at("25")} seed="mactan" r={80} />
      <Ring x={pt.mactan[0]} y={pt.mactan[1]} f={f} at={w("25", 6)} out={at("26") + 6} color="#E5383B" />
      {label("bohol", "BOHOL", w("26", 7), at("27") + 6)}

      {/* ---- the Spice Islands and home ---- */}
      {label("tidore", "SPICE ISLANDS", w("27", 6), at("28") + 10)}
      {label("goodhope", "CAPE OF GOOD HOPE", w("29", 1), at("30"))}
      {label("capeverde", "CAPE VERDE", w("30", 1), at("32"))}
      <BigWord text="1 DAY BEHIND" f={f} at={w("31", 3)} out={at("32") - 4} y={300} />
      {card("sanlucarHome", "ortelius", w("32", 6), at("33") - 4)}

      {/* ---- payoff ---- */}
      <RegionFill cam={cam} rings={PACIFIC} f={f} at={w("33", 4)} out={at("34") + 6} kind="sea" outline={false} />
      <BigWord text="98 DAYS" f={f} at={w("33", 4)} out={at("34")} y={300} />
      <BigWord text="3 YEARS" f={f} at={w("34", 3)} out={at("35")} y={300} />
      <BigWord text="18 MEN" f={f} at={w("35", 5)} out={at("36") + 10} y={300} />
      {label("mactan", "MACTAN", w("36", 1), Infinity)}
      <Ring x={pt.mactan[0]} y={pt.mactan[1]} f={f} at={w("36", 4)} />
    </AbsoluteFill>
  );
};

/**
 * Accent sounds (≤ 1 per beat): the hook number, the long flights, the false strait, Magellan's death,
 * the riser into the payoff. Small event sounds and the ambience are in EVENTS / BEDS below.
 */
const SFX: { file: string; at: number; level?: number; seconds?: number }[] = [
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("01", 9), level: -17 },
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[2].at, level: -17 },
  { file: "sfx/whoosh/simple-whoosh-02-433006.mp3", at: KEYS[4].at, level: -20 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("07", 12), level: -22 },
  { file: "sfx/ambience/mixkit-calm-thunderstorm-jungle-2415.mp3", at: at("10") - 4, level: -24, seconds: 3.6 },
  { file: "sfx/whoosh/whoosh-cinematic-5-376880.mp3", at: KEYS[10].at, level: -19 },
  { file: "sfx/whoosh/epic-whoosh-478371.mp3", at: KEYS[11].at, level: -18 },
  { file: "sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3", at: w("25", 6), level: -21 },
  { file: "sfx/whoosh/whoosh-cinematic-sound-effect-376889.mp3", at: KEYS[17].at, level: -19 },
  { file: "sfx/riser/cinematic-trailer-riser-790.mp3", at: w("33", 4) - 70, level: -22 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("33", 4), level: -16 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("36", 4), level: -23 },
];

const BIG_WHOOSH = SFX.filter((s) => s.file.includes("whoosh")).map((s) => s.at);
const QUIET = [at("17") - 6, at("22") - 12];

/**
 * One small sound per visual event (Bible §6, 2026-10-30), same cue expressions as the Scene.
 * Nothing in the quiet beat (lines 17–21).
 * shortcut: cues are listed beside the JSX, not derived from it; see ep02-hannibal/Video.tsx.
 */
const EVENTS: [EventKind, number][] = [
  ["chip", w("01", 18)],
  ["chip", w("02", 9)],
  ["label", w("04", 0)],
  ["chip", w("03", 0)],
  ["chip", w("03", 1)],
  ["card", w("04", 0) + 4],
  ["cardOut", at("05") + 10],
  ["label", w("07", 1)],
  ["label", w("07", 7)],
  ["label", w("08", 8)],
  ["chip", w("08", 11)],
  ["label", w("10", 1)],
  ["label", w("11", 2)],
  ["pen", w("11", 3) + 6],
  ["chip", w("11", 4)],
  ["chip", w("13", 7)],
  ["card", w("14", 1)],
  ["cardOut", at("15") + 4],
  ["pen", w("15", 3)],
  ["chip", w("15", 9)],
  ["chip", w("16", 5)],
  ["label", w("22", 0)],
  ["label", w("23", 2)],
  ["label", w("24", 1)],
  ["pen", w("24", 1) + 8],
  ["label", w("26", 7)],
  ["label", w("27", 6)],
  ["label", w("29", 1)],
  ["label", w("30", 1)],
  ["chip", w("31", 3)],
  ["card", w("32", 6)],
  ["cardOut", at("33") - 4],
  ["chip", w("34", 3)],
  ["chip", w("35", 5)],
  ["label", w("36", 1)],
  ["ping", w("36", 4) + 8],
  ...KEYS.map((k): [EventKind, number] => ["fly", k.at]).filter(
    ([, a], i) => i > 0 && BIG_WHOOSH.every((b) => Math.abs(b - a) > 6) && (a < QUIET[0] || a > QUIET[1]),
  ),
];

/** Ambience by place: open air → the Atlantic (+ creaking ship) → the cold strait → the Pacific → the islands → the way home. */
const BEDS: Bed[] = [
  { file: "amb-air/meadow-wind-light-1166.mp3", from: 0, to: at("03") + 15 },
  { file: "amb-sea/sea-waves-ambience-1189.mp3", from: at("03"), to: at("11") + 15, level: -33 },
  { file: "amb-ship/wooden-ship-on-the-sea-1187.mp3", from: at("04"), to: at("11"), level: -36 },
  { file: "amb-wind/winter-wind-loop-1175.mp3", from: at("11"), to: at("13") + 15, level: -31 },
  { file: "amb-sea/distant-sea-humming-ambiance-1191.mp3", from: at("13"), to: at("22") + 15, level: -32 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("17"), to: at("22"), level: -35 },
  { file: "amb-sea/sea-waves-ambience-1189.mp3", from: at("22"), to: at("32") + 15, level: -33 },
  { file: "amb-ship/wooden-ship-on-the-sea-1187.mp3", from: at("27"), to: at("32"), level: -37 },
  { file: "amb-air/meadow-wind-light-1166.mp3", from: at("32"), to: end("36") + 24, level: -33 },
];

/** Same headroom as Ep01 / Ep02: the whole mix 3 dB down, mastered back to −14 LUFS by render:j. */
const TRIM_DB = -3;

/** Music dips (≈ −9 dB) under the quiet beat on the empty Pacific. */
const duck = (f: number) =>
  interpolate(f, [at("17") - 10, at("17") + 10, at("22") - 8, at("22") + 4], [1, 0.35, 0.35, 1], CLAMP);

export const Magellan: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <Handle />
    <Audio name="VO" src={staticFile("voiceover/magellan/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    {/* P2 Explorers bed (Bible §2: Cinematic Documentary), −25 LUFS before the trim (lesson F3) */}
    <MusicBed file={PILLAR_MUSIC.P4} duck={duck} level={-25 + TRIM_DB} />
    <Ambience beds={BEDS} trim={TRIM_DB} />
    <EventSounds events={EVENTS} trim={TRIM_DB} />
    {SFX.map((s, i) => (
      <Sfx key={i} {...s} level={(s.level ?? -15) + TRIM_DB} />
    ))}
    <SafeGuide />
  </AbsoluteFill>
);

/** Last word + 0.8 s. */
export const magellanDuration = (fps: number) => Math.round((end("36") / FPS + 0.8) * fps);
