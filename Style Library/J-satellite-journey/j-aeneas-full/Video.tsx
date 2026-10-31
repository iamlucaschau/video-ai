/**
 * Style J "Satellite Journey" — full episode (EN, Lucas approved script v2, 2026-10-26):
 * "Why did Aeneas wander for seven years?" Troy → the Tiber, after Virgil's Aeneid 1–7.
 * Script, claim ledger, image sources: kich-ban-j-aeneas-full-FINAL.md; spec: 01_EPISODE-SPEC_….
 * One continuous satellite map; the camera never stops (style J exception). Every cue comes
 * from the VO timing + Whisper word times, so regenerating the voice re-times the video.
 */
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/j-aeneas-full.timing.json";
import words from "../../../src/voiceover/j-aeneas-full.words.json";
import plates from "../../../public/images/j-aeneas-full/map/plates.json";
import regions from "./regions.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, PILLAR_MUSIC, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { Ambience, type Bed, EventSounds, type EventKind } from "../journey-sound";
import {
  along, BigWord, camAt, camSpeed, Cross, FullFrame, GeoLine, GlowRoute, type JKey, type Plate, PhotoCard, project,
  Handle, projectLine, RegionFill, Ring, RoutePreview, SatMap, Scribble, SourceLine, StopLabel, SubWord, Vessel,
} from "../satellite-journey";

const FPS = 30;
const IMG = "images/j-aeneas-full";

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

const PLATES: Plate[] = (["world", "mid", "detail", "west"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
const P = {
  troy: [26.239, 39.957],
  thrace: [26.083, 40.723], // Aenus (Enez), the traditional site of Aeneas' first city
  delos: [25.268, 37.396],
  crete: [24.95, 35.33], // Pergamea is unlocated: the pin only says "Crete"
  italyDream: [16.2, 40.6],
  strophades: [21.01, 37.25],
  buthrotum: [20.02, 39.746],
  messina: [15.63, 38.25],
  castrum: [18.425, 40.007], // Castrum Minervae (Castro, Apulia): first sight of Italy
  etna: [14.995, 37.751],
  drepanum: [12.51, 38.02],
  carthage: [10.323, 36.853],
  cumae: [14.054, 40.848],
  tiber: [12.25, 41.74],
  rome: [12.496, 41.903],
} satisfies Record<string, LL>;

/** Sea legs in travel order (waypoints keep the ship off the land). */
const LEGS: LL[][] = [
  [[26.15, 39.98], [26.0, 40.2], [25.98, 40.45], [26.06, 40.66]],
  [[26.06, 40.66], [25.85, 40.45], [25.6, 40.0], [25.6, 39.4], [25.3, 38.7], [25.3, 38.0], [25.45, 37.6], [25.3, 37.43]],
  [[25.3, 37.43], [25.3, 37.2], [25.28, 36.9], [25.2, 36.5], [25.0, 36.0], [24.92, 35.47]],
  [[24.92, 35.47], [24.0, 35.62], [23.55, 35.72], [22.9, 36.0], [22.2, 36.35], [21.5, 36.75], [21.05, 37.2]],
  [[21.05, 37.2], [20.45, 37.5], [20.15, 38.1], [20.0, 38.7], [20.25, 39.2], [20.15, 39.55], [20.03, 39.73]],
  [[20.03, 39.73], [19.95, 39.85], [19.4, 39.95], [18.5, 39.98]],
  [[18.5, 39.98], [18.35, 39.6], [17.4, 39.1], [16.85, 38.5], [16.25, 37.8], [15.45, 37.62], [15.25, 37.45]],
  [[15.25, 37.45], [15.38, 36.95], [15.1, 36.62], [14.4, 36.62], [13.4, 37.05], [12.6, 37.55], [12.32, 37.85], [12.45, 38.0]],
  [[12.45, 38.0], [12.1, 37.85], [11.3, 37.35], [10.7, 37.12], [10.4, 36.88]],
  // back past Sicily (book 5, not narrated) and north to Cumae
  [[10.4, 36.88], [10.8, 37.2], [11.6, 37.65], [12.3, 38.15], [12.8, 38.6], [13.6, 39.6], [13.75, 40.6], [13.8, 40.8], [14.02, 40.85]],
  [[14.02, 40.85], [13.95, 40.97], [13.5, 41.15], [13.05, 41.17], [12.6, 41.38], [12.2, 41.72]],
];
/** The "three weeks" sea route of the hook: Troy → Cape Malea → Strait of Messina → the Tiber. */
const DIRECT: LL[] = [[26.15, 39.98], [25.3, 38.2], [23.2, 36.35], [21.5, 37.0], [16.6, 38.2], [15.62, 38.25], [14.3, 40.2], [12.25, 41.73]];

/** Leg i sails between these frames (each lands on the place's name in the VO). */
const SAIL: [number, number][] = [
  [at("05"), at("05") + 40],
  [at("06") - 26, at("06") + 14],
  [at("07") - 12, w("07", 5)],
  [at("11") - 6, w("11", 9)],
  [at("13") - 30, w("13", 1) + 6],
  [at("15") - 10, w("15", 3)],
  [at("16") - 12, w("16", 8)],
  [at("17") - 34, w("17", 1)],
  [at("21") - 6, w("21", 9)],
  [at("26") - 50, w("26", 1)],
  [at("27") - 10, w("27", 7) + 10],
];

/** Natural Earth (public domain): mainland Italy, and the seas of the voyage. */
const ITALY = [regions.italy.reduce((a, b) => (b.length > a.length ? b : a))];
const SEA = [...regions.mediterranean, ...regions.tyrrhenian, ...regions.ionian, ...regions.adriatic, ...regions.aegean];

// ------------------------------------------------------------------ camera

const KEYS: JKey[] = [
  // hook: never one map view for more than ~4 s (lesson E10, VidIQ 2026-10-30)
  { at: 0, lon: 18.5, lat: 38.5, zoom: 34, tilt: 14, bearing: -3, push: 0.02, orbit: 0.5 },
  { at: w("01", 5), lon: 12.8, lat: 41.6, zoom: 110, tilt: 22, bearing: 2, dur: 30 }, // "the hero Rome called its founder": push to Rome
  { at: w("01", 9), lon: 18.5, lat: 38.5, zoom: 34, tilt: 14, bearing: 0, dur: 30 }, // "wander…": back out for the whole sea
  // the journey starts with the bridge line, not after it
  { at: at("02") + 4, lon: 26.0, lat: 40.15, zoom: 300, tilt: 28, bearing: 6, dur: 40 },
  { at: at("05"), lon: 26.1, lat: 40.42, zoom: 300, tilt: 26, bearing: 2 },
  { at: SAIL[1][0], lon: 25.45, lat: 37.85, zoom: 240, tilt: 26, bearing: -3, dur: 40 },
  { at: SAIL[2][0], lon: 25.05, lat: 36.35, zoom: 215, tilt: 26, bearing: 3, dur: 36 },
  // the dream: pull out until Italy is in the frame
  { at: at("09") + 10, lon: 17.5, lat: 39.6, zoom: 60, tilt: 18, bearing: 0, push: 0.015 }, // all of Italy in frame for the region glow
  { at: SAIL[3][0], lon: 22.4, lat: 36.6, zoom: 170, tilt: 24, bearing: -2, dur: 40 },
  { at: SAIL[4][0], lon: 20.4, lat: 38.7, zoom: 170, tilt: 24, bearing: -4 },
  // the forbidden strait, with Buthrotum still in the frame
  { at: at("14") - 4, lon: 17.7, lat: 38.9, zoom: 95, tilt: 22, bearing: 0 },
  { at: SAIL[5][0], lon: 18.9, lat: 39.9, zoom: 200, tilt: 26, bearing: 3 },
  { at: SAIL[6][0], lon: 16.4, lat: 38.4, zoom: 130, tilt: 24, bearing: 0, dur: 40 },
  { at: SAIL[7][0], lon: 13.7, lat: 37.6, zoom: 170, tilt: 24, bearing: -3 },
  // quiet beat: no orbit, the slowest push
  { at: at("17") + 6, lon: 12.62, lat: 37.98, zoom: 230, tilt: 26, bearing: -3, push: 0.006, orbit: 0 },
  // Juno: wide enough for Carthage, Sicily and Rome
  { at: at("19"), lon: 13.6, lat: 38.4, zoom: 60, tilt: 16, bearing: 0, push: 0.02 },
  { at: SAIL[8][0], lon: 11.2, lat: 37.4, zoom: 190, tilt: 24, bearing: 2, dur: 40 },
  // the curse → Rome against Carthage
  { at: w("24", 1), lon: 11.6, lat: 39.4, zoom: 92, tilt: 18, bearing: 0 },
  { at: SAIL[9][0], lon: 12.9, lat: 38.9, zoom: 105, tilt: 22, bearing: 0, dur: 40 },
  { at: at("26") + 8, lon: 14.1, lat: 40.85, zoom: 260, tilt: 26, bearing: 3 },
  { at: SAIL[10][0], lon: 13.1, lat: 41.3, zoom: 170, tilt: 24, bearing: -2 },
  { at: at("28"), lon: 12.35, lat: 41.75, zoom: 300, tilt: 26, bearing: 2, push: 0.012 },
  // payoff: the whole tangled route against the straight one
  { at: at("31") - 6, lon: 18.2, lat: 38.6, zoom: 34, tilt: 14, bearing: 0, push: 0.015, orbit: 0.3 },
  { at: at("33"), lon: 12.8, lat: 41.4, zoom: 120, tilt: 24, bearing: 0, push: 0.02 },
];

// ------------------------------------------------------------------ text


/** Card centre: above the pin, kept inside the safe zone. */
const cardX = (x: number) => Math.min(660, Math.max(380, x - 40));
const CARD_Y = 470;
/** A pin high on the screen would sit under the card: then the card hangs below it instead. */
const cardY = (y: number) => (y < 760 ? Math.min(880, y + 330) : CARD_Y);
/** Keyword chips sit just above the subtitles. */
const KEY_Y = 1150;

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
  const direct = projectLine(cam, DIRECT);
  const directO = f < at("31") ? 1 - interpolate(f, [at("03") - 10, at("03") + 10], [0, 1], CLAMP) : interpolate(f, [at("31"), at("31") + 20], [0, 1], CLAMP);
  const rival = projectLine(cam, [P.carthage, P.rome]);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={PLATES} />
      <GeoLine pts={direct} p={interpolate(f, [w("01", 16), w("01", 16) + 40], [0, 1], CLAMP)} color="#F2C14E" o={directO * 0.85} width={4} />
      <GeoLine
        pts={rival}
        p={interpolate(f, [at("25"), at("25") + 45], [0, 1], CLAMP)}
        color="#E5383B"
        o={1 - interpolate(f, [at("26") - 10, at("26") + 6], [0, 1], CLAMP)}
        width={7}
      />
      {/* T4: the whole seven-year tangle flashes up on "wander" */}
      <RoutePreview legs={LEGS.map((leg) => projectLine(cam, leg))} f={f} at={w("01", 9)} out={at("02") + 6} />
      {sailing && <GlowRoute legs={LEGS.map((leg) => projectLine(cam, leg))} current={current} p={p} />}
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const at2 = (ll: LL) => project(cam, ll[0], ll[1]);
  const { current, p, sailing } = sailAt(f);
  const head = along(projectLine(cam, LEGS[current]), sailing ? p : 0);
  // style J: motion blur only while the camera is really flying
  const blur = camSpeed(KEYS, f, FPS) > 14;
  const side = (x: number) => (x > 620 ? "left" : "right");
  const pt = Object.fromEntries(Object.entries(P).map(([k, ll]) => [k, at2(ll as LL)])) as Record<keyof typeof P, [number, number, number]>;

  /** A place label anchored to P[key]. */
  const label = (key: keyof typeof P, name: string, from: number, to: number) => (
    <StopLabel key={`${key}-${name}`} name={name} x={pt[key][0]} y={pt[key][1]} f={f} at={from} out={to} side={side(pt[key][0])} />
  );
  /** A painting card on a leader line from P[key]. */
  const card = (key: keyof typeof P, src: string, from: number, to: number, extra: { lean?: number; mono?: number } = {}) => (
    <PhotoCard key={`${key}-${src}`} src={`${IMG}/${src}.jpg`} x={pt[key][0]} y={pt[key][1]} cx={cardX(pt[key][0])} cy={cardY(pt[key][1])} f={f} at={from} out={to} {...extra} />
  );

  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={blur ? 7 : 1}>
        <MapLayer />
      </CameraMotionBlur>
      {f >= at("03") && cam.zoom > 80 && <Vessel x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />}

      {/* ---- hook ---- */}
      <SourceLine text="According to Virgil's Aeneid" f={f} at={6} out={w("01", 11) - 6} />
      {/* on screen from the first frame: the hook number has to land inside the first 3 s (lesson E1) */}
      <BigWord text="7 YEARS" f={f} at={0} out={w("02", 8) - 4} y={300} />
      <SubWord text="vs. 3 weeks" f={f} at={w("01", 16)} out={w("02", 8) - 4} y={525} />
      <SubWord text="ONE GODDESS'S GRUDGE" f={f} at={w("02", 8)} out={at("03") - 8} y={330} size={96} color="#F2C14E" />

      {/* ---- act 1: the wrong mother ---- */}
      {label("troy", "TROY", w("03", 4), at("06"))}
      <Scribble x={pt.troy[0]} y={pt.troy[1]} f={f} at={w("03", 4)} out={at("05") - 4} seed="troy" />
      {card("troy", "troy", w("04", 1), at("05") - 4)}
      {label("thrace", "THRACE", w("05", 2), at("07"))}
      {card("thrace", "thrace", w("05", 6), SAIL[1][0] + 4, { lean: 3 })}
      {label("delos", "DELOS", w("06", 1), at("07") + 10)}
      {card("delos", "delos", w("06", 3), SAIL[2][0] + 2)}
      {label("crete", "CRETE", w("07", 5), at("10"))}
      {card("crete", "crete", w("08", 2), at("09") - 2, { lean: 3 })}
      {/* waits for the pull-out to land: earlier, Italy's pin is off screen and the card sits over the top edge */}
      {card("italyDream", "dream", w("09", 4), w("10", 2))}
      {/* BOC-TACH-HINH.md T2: the "ancient mother" lights up, everything else dims */}
      <RegionFill cam={cam} rings={ITALY} f={f} at={w("10", 3)} out={at("11") + 6} kind="glow" name="ITALY" size={160} angle={-48} nameAt={[14.2, 42.2]} spotlight />

      {/* ---- act 2: the long way round ---- */}
      {label("strophades", "STROPHADES", w("11", 6), at("13"))}
      {card("strophades", "harpies", w("11", 9), at("13") - 6)}
      <SubWord text="EAT YOUR TABLES" f={f} at={w("12", 10)} out={at("13") - 2} y={KEY_Y} size={96} color="#F2C14E" />
      {label("buthrotum", "BUTHROTUM", w("13", 1), at("15"))}
      <SubWord text="NO SHORTCUT" f={f} at={w("13", 9)} out={at("15") - 4} y={KEY_Y} size={96} color="#F2C14E" />
      <Cross x={pt.messina[0]} y={pt.messina[1]} f={f} at={w("14", 0)} out={at("16")} />
      {label("castrum", "ITALY", at("16") - 6, at("16") + 50)}
      {label("etna", "MOUNT ETNA", w("16", 7), at("17") + 10)}
      {card("etna", "etna", w("16", 5), at("17") - 6)}

      {/* ---- quiet beat: the man he carried out of Troy ---- */}
      {label("drepanum", "DREPANUM", w("17", 1), at("19"))}
      {card("drepanum", "troy", w("18", 3), at("19") - 4, {
        mono: interpolate(f, [w("18", 6), w("18", 6) + 45], [0, 1], CLAMP),
      })}

      {/* ---- act 3: Juno ---- */}
      <BigWord text="JUNO" f={f} at={at("19") + 4} out={at("21") - 6} y={300} />
      {label("carthage", "CARTHAGE", w("20", 6), at("25") + 4)}
      <Ring x={pt.carthage[0]} y={pt.carthage[1]} f={f} at={w("20", 6)} out={at("26")} color="#E5383B" />
      {card("carthage", "storm", w("21", 1), at("22") - 4)}
      {card("carthage", "carthage", w("22", 1), w("24", 1) - 2, { lean: 3 })}
      <SubWord text="7TH SUMMER" f={f} at={w("22", 7)} out={at("23") + 30} y={KEY_Y} size={96} color="#F2C14E" />
      {label("rome", "ROME", w("25", 6), at("26"))}
      <SubWord text="3 PUNIC WARS" f={f} at={w("25", 11)} out={at("26")} y={KEY_Y} size={96} color="#E5383B" />
      {label("cumae", "CUMAE", w("26", 1), at("27"))}
      {card("cumae", "cumae", w("26", 3), at("27") - 6)}
      <SubWord text="THE UNDERWORLD" f={f} at={w("26", 8)} out={at("27") - 4} y={KEY_Y} size={96} color="#F2C14E" />

      {/* ---- arrival ---- */}
      {label("tiber", "TIBER", w("27", 7), at("31") - 6)}
      <Scribble x={pt.tiber[0]} y={pt.tiber[1]} f={f} at={w("27", 7)} out={at("29")} seed="tiber" />
      {card("tiber", "tiber", w("27", 10), at("30") + 10)}
      <SubWord text="THEY ARRIVED" f={f} at={w("30", 0)} out={at("31") - 4} y={KEY_Y} size={96} color="#F2C14E" />

      {/* ---- payoff ---- */}
      {/* T3: the whole sea he wandered, outlined behind the payoff */}
      <RegionFill cam={cam} rings={SEA} f={f} at={w("31", 0)} out={at("33") - 4} kind="sea" outline={false} />
      <BigWord text="7 YEARS" f={f} at={w("31", 5)} out={at("33") - 4} y={300} />
      <SubWord text="3,000+ KM" f={f} at={w("31", 10)} out={at("33") - 4} y={525} size={96} />
      {label("rome", "ROME", w("33", 8), Infinity)}
      <Ring x={pt.rome[0]} y={pt.rome[1]} f={f} at={w("33", 8)} />

      {/* ---- peak moments, full frame ---- */}
      <FullFrame src={`${IMG}/full-italy.jpg`} f={f} at={w("15", 2)} out={at("16") - 4} />
      <FullFrame src={`${IMG}/full-curse.jpg`} f={f} at={w("24", 1)} out={at("25") + 4} />
    </AbsoluteFill>
  );
};

/**
 * Sound effects (real recordings: Pixabay + Mixkit ambience, levelled by `Sfx`). At most one per
 * beat: whooshes on the long flights, a hit on each big number / name, storms on the two storms,
 * a snare on the wars. The quiet beat (Drepanum) has none.
 */
const SFX: { file: string; at: number; level?: number; seconds?: number }[] = [
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("01", 11), level: -17 },
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[3].at, level: -17 }, // the flight to Troy
  { file: "sfx/whoosh/simple-whoosh-382724.mp3", at: at("09") + 8, level: -20 },
  { file: "sfx/ambience/mixkit-calm-thunderstorm-jungle-2415.mp3", at: at("11") - 6, level: -23, seconds: 4.5 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("14", 0), level: -22 },
  { file: "sfx/whoosh/whoosh-cinematic-5-376880.mp3", at: SAIL[6][0], level: -19 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: at("19") + 4, level: -16 },
  { file: "sfx/ambience/mixkit-transition-windy-swoosh-1474.mp3", at: at("21") - 8, level: -17 },
  { file: "sfx/ambience/mixkit-calm-thunderstorm-jungle-2415.mp3", at: at("21") - 2, level: -24, seconds: 4 },
  { file: "sfx/ambience/mixkit-calm-thunderstorm-jungle-2415.mp3", at: w("24", 1), level: -26, seconds: 3.6 },
  { file: "sfx/drum/perc-military-snare-drum-sound-effect-502886.mp3", at: w("25", 11), level: -18 },
  { file: "sfx/whoosh/whoosh-cinematic-sound-effect-376889.mp3", at: SAIL[9][0], level: -18 },
  { file: "sfx/whoosh/epic-whoosh-478371.mp3", at: KEYS[KEYS.length - 2].at, level: -17 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("31", 5), level: -16 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("33", 8), level: -23 },
];

/** Small flight whooshes skip frames that already carry a cinematic whoosh, and the quiet beat. */
const BIG_WHOOSH = SFX.filter((s) => s.file.includes("whoosh")).map((s) => s.at);
const QUIET = [at("17") - 6, at("19") - 12];

/**
 * One small sound per visual event (Bible §6, 2026-10-30), same cue expressions as the Scene.
 * Nothing in the quiet beat (Drepanum).
 * shortcut: cues are listed beside the JSX, not derived from it; see ep02-hannibal/Video.tsx.
 */
const EVENTS: [EventKind, number][] = [
  ["chip", w("01", 16)],
  ["chip", w("02", 8)],
  ["label", w("03", 4)],
  ["pen", w("03", 4) + 6],
  ["card", w("04", 1)],
  ["cardOut", at("05") - 4],
  ["label", w("05", 2)],
  ["card", w("05", 6)],
  ["label", w("06", 1)],
  ["card", w("06", 3) + 4],
  ["label", w("07", 5)],
  ["card", w("08", 2)],
  ["card", w("09", 4)],
  ["label", w("10", 3)],
  ["ping", w("10", 3) + 8],
  ["label", w("11", 6)],
  ["card", w("11", 9)],
  ["chip", w("12", 10)],
  ["label", w("13", 1)],
  ["chip", w("13", 9)],
  ["label", at("16") - 6],
  ["card", w("16", 5)],
  ["label", w("16", 7)],
  ["label", w("20", 6)],
  ["card", w("21", 1)],
  ["card", w("22", 1)],
  ["chip", w("22", 7)],
  ["label", w("25", 6)],
  ["label", w("26", 1)],
  ["card", w("26", 3) + 4],
  ["chip", w("26", 8)],
  ["label", w("27", 7)],
  ["pen", w("27", 7) + 6],
  ["card", w("27", 10)],
  ["chip", w("30", 0)],
  ["chip", w("31", 10)],
  ["ping", w("33", 8) + 8],
  ...KEYS.map((k): [EventKind, number] => ["fly", k.at]).filter(
    ([, a], i) => i > 0 && BIG_WHOOSH.every((b) => Math.abs(b - a) > 6) && (a < QUIET[0] || a > QUIET[1]),
  ),
];

/** Ambience by place: open air → the sea voyage (+ creaking ship) → Drepanum (wind only) → Juno's sea → the Tiber. */
const BEDS: Bed[] = [
  { file: "amb-air/meadow-wind-light-1166.mp3", from: 0, to: at("03") + 15 },
  { file: "amb-sea/sea-waves-ambience-1189.mp3", from: at("03"), to: at("17") + 15, level: -33 },
  { file: "amb-ship/wooden-ship-on-the-sea-1187.mp3", from: at("05"), to: at("17"), level: -36 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("17"), to: at("19") + 15, level: -33 },
  { file: "amb-sea/distant-sea-humming-ambiance-1191.mp3", from: at("19"), to: at("27") + 15, level: -32 },
  { file: "amb-air/meadow-wind-light-1166.mp3", from: at("27"), to: end("33") + 24, level: -33 },
];

/**
 * Headroom: voice peaks at −2 dBFS, so a hit on top of a word clipped in the render
 * (2026-10-26). Everything goes 3 dB down together (balance unchanged); mastering to
 * −14 LUFS / −1.5 dBTP afterwards brings the level back.
 */
const TRIM_DB = -3;

/** Music dips (≈ −9 dB) under the quiet beat, from Drepanum until Juno strikes. */
const duck = (f: number) =>
  interpolate(f, [at("17") - 10, at("17") + 10, at("19") - 8, at("19") + 4], [1, 0.35, 0.35, 1], CLAMP);

export const JAeneasFull: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <Handle />
    <Audio name="VO" src={staticFile("voiceover/j-aeneas-full/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    {/* music bed (Pixabay), −25 LUFS before the trim (was −28; lesson F3) */}
    <MusicBed file={PILLAR_MUSIC.P1} duck={duck} level={-25 + TRIM_DB} />
    <Ambience beds={BEDS} trim={TRIM_DB} />
    <EventSounds events={EVENTS} trim={TRIM_DB} />
    {SFX.map((s, i) => (
      <Sfx key={i} {...s} level={(s.level ?? -15) + TRIM_DB} />
    ))}
    <SafeGuide />
  </AbsoluteFill>
);

/** Last word + 0.8 s. */
export const jAeneasFullDuration = (fps: number) => Math.round((end("33") / FPS + 0.8) * fps);
