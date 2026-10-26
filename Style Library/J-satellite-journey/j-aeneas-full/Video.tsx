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
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, PILLAR_MUSIC, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import {
  along, BigWord, camAt, camSpeed, Cross, FullFrame, GeoLine, GlowRoute, type JKey, JourneySub, type Plate, PhotoCard, project,
  projectLine, Ring, SatMap, SourceLine, StopLabel, SubWord, Vessel,
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

// ------------------------------------------------------------------ camera

const KEYS: JKey[] = [
  { at: 0, lon: 18.5, lat: 38.5, zoom: 34, tilt: 14, bearing: -3, push: 0.02, orbit: 0.5 },
  { at: at("03") - 22, lon: 26.0, lat: 40.15, zoom: 300, tilt: 28, bearing: 6 },
  { at: at("05"), lon: 26.1, lat: 40.42, zoom: 300, tilt: 26, bearing: 2 },
  { at: SAIL[1][0], lon: 25.45, lat: 37.85, zoom: 240, tilt: 26, bearing: -3, dur: 40 },
  { at: SAIL[2][0], lon: 25.05, lat: 36.35, zoom: 215, tilt: 26, bearing: 3, dur: 36 },
  // the dream: pull out until Italy is in the frame
  { at: at("09") + 10, lon: 20.5, lat: 38.4, zoom: 70, tilt: 18, bearing: 0, push: 0.015 },
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

/** Subtitle text per line (numerals; *keywords* in pale gold). */
const CAPTIONS: Record<string, string> = {
  "01": "Why did *Aeneas*, the hero *Rome* called its founder, wander for *7 years*, when *Italy* was *3 weeks'* sail from *Troy*?",
  "02": "The answer is on this route, and in one *goddess's grudge*.",
  "03": "It begins in burning *Troy*, in modern Turkey.",
  "05": "First stop: *Thrace*, where a bleeding myrtle warns him to leave.",
  "06": "On *Delos*, Apollo's oracle tells him: seek your *ancient mother*.",
  "07": "His father reads it as *Crete*.",
  "10": "The mother is *Italy*, where his ancestors came from.",
  "11": "A storm throws them onto the islands of the *Harpies*.",
  "12": "Their curse: one day, you will be hungry enough to *eat your tables*.",
  "13": "At *Buthrotum*, a prophet warns him: don't take the *short way*.",
  "14": "*Scylla* and *Charybdis* guard the strait.",
  "15": "So they see *Italy* for the very first time, and have to sail on.",
  "16": "They circle *Sicily*, past the *Cyclops* under Mount *Etna*.",
  "17": "At *Drepanum*, his father dies.",
  "19": "Now the *goddess* strikes.",
  "20": "*Juno* loves one city above all, *Carthage*, and a prophecy says Aeneas' descendants will destroy it.",
  "21": "Her storm throws the fleet to *Africa*, right into *Carthage*.",
  "22": "Queen *Dido* tells him: this is your *7th summer* at sea.",
  "24": "*Dido* curses his people: our nations will be *enemies forever*.",
  "25": "That is how Virgil explains why *Rome* and *Carthage* later fought *3 wars*.",
  "26": "At *Cumae*, the Sibyl leads him into the *underworld*, where his father shows him *Rome*.",
  "27": "At last, at the mouth of the *Tiber*, they use flat bread as plates, and eat them.",
  "28": "His son laughs: we're *eating our tables*.",
  "31": "*3 weeks* of sailing became *7 years* and more than *3,000 km*.",
  "33": "And his descendants, *Romulus* and *Remus*, would found *Rome*.",
};

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
      <BigWord text="7 YEARS" f={f} at={w("01", 11)} out={w("02", 8) - 4} y={300} />
      <SubWord text="vs. 3 weeks" f={f} at={w("01", 16)} out={w("02", 8) - 4} y={480} />
      <SubWord text="ONE GODDESS'S GRUDGE" f={f} at={w("02", 8)} out={at("03") - 8} y={330} size={72} color="#F2C14E" />

      {/* ---- act 1: the wrong mother ---- */}
      {label("troy", "TROY", w("03", 4), at("06"))}
      {card("troy", "troy", w("04", 1), at("05") - 4)}
      {label("thrace", "THRACE", w("05", 2), at("07"))}
      {card("thrace", "thrace", w("05", 6), SAIL[1][0] + 4, { lean: 3 })}
      {label("delos", "DELOS", w("06", 1), at("07") + 10)}
      {card("delos", "delos", w("06", 3), SAIL[2][0] + 2)}
      {label("crete", "CRETE", w("07", 5), at("10"))}
      {card("crete", "crete", w("08", 2), at("09") - 2, { lean: 3 })}
      {card("italyDream", "dream", w("09", 1), at("11") - 4)}
      {label("italyDream", "ITALY", w("10", 3), at("11") + 6)}
      <Ring x={pt.italyDream[0]} y={pt.italyDream[1]} f={f} at={w("10", 3)} out={at("11") + 6} />

      {/* ---- act 2: the long way round ---- */}
      {label("strophades", "STROPHADES", w("11", 6), at("13"))}
      {card("strophades", "harpies", w("11", 9), at("13") - 6)}
      <SubWord text="EAT YOUR TABLES" f={f} at={w("12", 10)} out={at("13") - 2} y={KEY_Y} size={72} color="#F2C14E" />
      {label("buthrotum", "BUTHROTUM", w("13", 1), at("15"))}
      <SubWord text="NO SHORTCUT" f={f} at={w("13", 9)} out={at("15") - 4} y={KEY_Y} size={72} color="#F2C14E" />
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
      <SubWord text="7TH SUMMER" f={f} at={w("22", 7)} out={at("23") + 30} y={KEY_Y} size={72} color="#F2C14E" />
      {label("rome", "ROME", w("25", 6), at("26"))}
      <SubWord text="3 PUNIC WARS" f={f} at={w("25", 11)} out={at("26")} y={KEY_Y} size={72} color="#E5383B" />
      {label("cumae", "CUMAE", w("26", 1), at("27"))}
      {card("cumae", "cumae", w("26", 3), at("27") - 6)}
      <SubWord text="THE UNDERWORLD" f={f} at={w("26", 8)} out={at("27") - 4} y={KEY_Y} size={72} color="#F2C14E" />

      {/* ---- arrival ---- */}
      {label("tiber", "TIBER", w("27", 7), at("31") - 6)}
      {card("tiber", "tiber", w("27", 10), at("30") + 10)}
      <SubWord text="THEY ARRIVED" f={f} at={w("30", 0)} out={at("31") - 4} y={KEY_Y} size={72} color="#F2C14E" />

      {/* ---- payoff ---- */}
      <BigWord text="7 YEARS" f={f} at={w("31", 5)} out={at("33") - 4} y={300} />
      <SubWord text="3,000+ KM" f={f} at={w("31", 10)} out={at("33") - 4} y={480} size={72} />
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
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[1].at, level: -17 },
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
    <KaraokeSubs timing={timing} words={words} captions={CAPTIONS} Skin={JourneySub} oneLine maxWords={3} maxChars={18} />
    <Audio name="VO" src={staticFile("voiceover/j-aeneas-full/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    {/* music bed (Pixabay), −28 LUFS under the voice before the headroom trim */}
    <MusicBed file={PILLAR_MUSIC.P1} duck={duck} level={-28 + TRIM_DB} />
    {SFX.map((s, i) => (
      <Sfx key={i} {...s} level={(s.level ?? -15) + TRIM_DB} />
    ))}
    <SafeGuide />
  </AbsoluteFill>
);

/** Last word + 0.8 s. */
export const jAeneasFullDuration = (fps: number) => Math.round((end("33") / FPS + 0.8) * fps);
