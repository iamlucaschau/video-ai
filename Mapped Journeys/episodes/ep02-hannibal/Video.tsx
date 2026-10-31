/**
 * Mapped Journeys Ep02 (style J "Satellite Journey", EN, Lucas locked Gate 2 on 2026-10-27):
 * "Why did Hannibal march five months over the Alps?" New Carthage → the Po plain, after
 * Polybius, Histories 3. Script, claim ledger, image sources: kich-ban-hannibal-FINAL.md;
 * spec: 01_EPISODE-SPEC_hannibal.md. Route (Lucas 2026-10-27): Rhône crossed near
 * Beaucaire–Tarascon, the Alps by the Col de la Traversette (one leading theory, drawn faint).
 * Every cue comes from the VO timing + Whisper word times, so regenerating the voice re-times it.
 */
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/hannibal.timing.json";
import words from "../../../src/voiceover/hannibal.words.json";
import plates from "../../../public/images/hannibal/map/plates.json";
import regions from "./regions.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../../Style Library/kit-common";
import { Ambience, type Bed, EventSounds, type EventKind } from "../../../Style Library/J-satellite-journey/journey-sound";
import {
  along, Army, BigWord, camAt, camSpeed, Cross, FullFrame, GeoLine, GlowRoute, type JKey, type Plate, PhotoCard,
  Handle, project, projectLine, RegionFill, Ring, RoutePreview, SatMap, Scribble, SourceLine, StopLabel, SubWord,
} from "../../../Style Library/J-satellite-journey/satellite-journey";

const FPS = 30;
const IMG = "images/hannibal";

/**
 * Images that are in public/images/hannibal (all of them since 2026-10-27). A card or full
 * frame whose flag is false is left out, so a missing file never breaks a render.
 */
const HAVE = {
  rhone: true, // Henri-Paul Motte, Hannibal traverse le Rhône (1878), Commons PD-Art
  goya: true, // Goya, Aníbal vencedor… (1771, Prado), Commons PD-Art; cropped to Hannibal, allegories out of frame
  snowstorm: true, // Turner, Snow Storm: Hannibal and his Army Crossing the Alps (1812, Tate), Commons PD-Art
  carthage: true, // Turner, Dido building Carthage (1815), reused from Ep01
  fullFleet: true, // AI, Lucas 2026-10-27 (image-prompts.md #1)
  fullSummit: true, // AI, Lucas 2026-10-27 (image-prompts.md #2)
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

/** Coarse first, finest last: world + mid reused from Ep01; midwest, cartagena, alps cut from tiles B1 / C1. */
export const PLATES: Plate[] = (["world", "mid", "midwest", "cartagena", "alps"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
/** Coordinates from each place's Wikipedia page (2026-10-27); Traversette and the Guil from FINAL, Gate 4. */
export const P = {
  cartagena: [-0.9842, 37.6019],
  ebro: [0.5808, 40.7106], // Amposta, on the lower Ebro (Polybius names no crossing point)
  emporium: [3.1206, 42.1347], // Empúries
  pyrenees: [2.88, 42.5], // label on the coastal road over the range
  narbo: [3.0042, 43.1836], // Narbonne
  rhone: [4.6603, 43.8058], // Tarascon, facing Beaucaire (Lucas 2026-10-27)
  rhoneMouth: [4.8456, 43.3308],
  island: [4.8522, 44.9822], // Rhône–Isère confluence (Loeb reading of Polybius 3.49)
  guillestre: [6.65, 44.66], // the Guil joins the Durance
  ristolas: [6.9564, 44.7747], // head of the Guil valley
  pass: [7.0664, 44.7105], // Col de la Traversette, 2,947 m
  crissolo: [7.1667, 44.7], // upper Po valley
  turin: [7.6761, 45.0792], // the Taurini's chief town (Polybius 3.60)
  sardinia: [9, 40],
  sicily: [14, 37.5],
  pisa: [10.4, 43.7167],
  carthage: [10.323, 36.853],
  rome: [12.496, 41.903],
  ostia: [12.2917, 41.7558],
} satisfies Record<string, LL>;

/** Land legs in marching order (waypoints keep the road on land; checked on stills). */
export const LEGS: LL[][] = [
  [P.cartagena, [-1.13, 37.98], [-0.9, 38.6], [-0.6, 39.4], [-0.2, 39.95], [0.3, 40.45], P.ebro],
  [P.ebro, [1.0, 41.1], [1.6, 41.45], [2.2, 41.6], [2.75, 41.95], P.emporium],
  [P.emporium, [2.95, 42.4], [2.8956, 42.6986], [2.85, 42.95], P.narbo],
  [P.narbo, [3.4, 43.4], [3.877, 43.611], [4.36, 43.84], P.rhone],
  [P.rhone, [4.8, 44.1], [4.72, 44.45], [4.78, 44.75], P.island],
  // from here on: one leading theory (Traversette), drawn faint
  [P.island, [5.3, 44.9], [5.8, 44.75], [6.2, 44.68], P.guillestre],
  [P.guillestre, [6.8, 44.73], P.ristolas, P.pass],
  [P.pass, P.crissolo, [7.4, 44.75], P.turin],
];
export const THEORY_FROM = 5;
/** Natural Earth marine polygons (public domain) that make up the sea Rome held. */
/** Mainland Italy only: the Natural Earth country also carries Sicily and Sardinia (Rome's already). */
const ITALY = [regions.italy.reduce((a, b) => (b.length > a.length ? b : a))];
const SEA = [...regions.mediterranean, ...regions.tyrrhenian, ...regions.ionian, ...regions.adriatic, ...regions.aegean];

/** The "two weeks' sail" of the hook: New Carthage → south of Sardinia → the Tiber (ledger #G3). */
export const DIRECT: LL[] = [[-0.98, 37.55], [1.5, 37.6], [5.0, 37.8], [8.6, 38.7], [10.5, 39.8], P.ostia];
/** Publius Scipio's fleet: Pisa → along Liguria → the mouth of the Rhône (Polybius 3.41.4–6). */
const FLEET: LL[] = [P.pisa, [9.6, 43.6], [8.4, 43.6], [7.2, 43.4], [6.0, 43.0], [5.3, 43.15], P.rhoneMouth];

/** Leg i marches between these frames (each lands on the place's name in the VO). */
const MARCH: [number, number][] = [
  [at("04"), w("06", 3)],
  [w("06", 3), w("06", 6)],
  [w("06", 6), at("07")],
  [at("07") - 10, w("07", 6)],
  [at("14"), w("15", 5)],
  [w("15", 11), w("16", 8)],
  [at("17"), w("17", 7)],
  [at("22"), w("26", 5)],
];

// ------------------------------------------------------------------ camera

const KEYS: JKey[] = [
  // hook: never one map view for more than ~4 s (lesson E10, VidIQ 2026-10-30)
  { at: 0, lon: 6, lat: 40.3, zoom: 55, tilt: 14, bearing: -3, push: 0.02, orbit: 0.5 },
  { at: w("01", 8), lon: 6.8, lat: 44.8, zoom: 130, tilt: 24, bearing: 2, dur: 24 }, // "five months over the Alps": push into the snow
  { at: w("01", 14), lon: 6, lat: 40.3, zoom: 55, tilt: 14, bearing: 0, dur: 28 }, // "when Italy…": back out for the sea route
  // the journey starts with the bridge line, not after it
  { at: at("02") + 4, lon: -0.9, lat: 37.85, zoom: 220, tilt: 26, bearing: 4, dur: 40 },
  // centred a little east so "NEW CARTHAGE" (right of its pin) clears the safe zone's right edge
  { at: at("04") + 10, lon: 0.1, lat: 39.0, zoom: 110, tilt: 22, bearing: 0, dur: 60 },
  { at: w("06", 1), lon: 1.6, lat: 41.5, zoom: 110, tilt: 22, bearing: -2 },
  { at: at("07") - 10, lon: 3.9, lat: 43.4, zoom: 130, tilt: 24, bearing: 0 },
  { at: at("08"), lon: 4.65, lat: 43.75, zoom: 240, tilt: 26, bearing: 3 },
  // the Roman fleet: Pisa to the river's mouth in one frame
  { at: at("09") + 4, lon: 7.4, lat: 43.6, zoom: 110, tilt: 20, bearing: 0 },
  // the sea war: Spain, Sardinia, Sicily, Italy
  { at: at("11"), lon: 9, lat: 39.5, zoom: 52, tilt: 16, bearing: 0, push: 0.015 },
  { at: at("13"), lon: 6, lat: 40, zoom: 52, tilt: 14, bearing: 0, push: 0.015 },
  // the only way left: the Alps rise
  // pulled out far enough to show all of Italy on "Italy", the Alps between it and the army
  { at: at("14") + 4, lon: 9.4, lat: 43.2, zoom: 62, tilt: 20, bearing: 0 },
  { at: at("15"), lon: 4.9, lat: 44.5, zoom: 200, tilt: 26, bearing: 3 },
  { at: w("15", 11), lon: 5.8, lat: 44.8, zoom: 180, tilt: 26, bearing: 0 },
  { at: at("16"), lon: 6.6, lat: 44.7, zoom: 260, tilt: 28, bearing: -3 },
  { at: at("17"), lon: 6.9, lat: 44.73, zoom: 300, tilt: 28, bearing: 2 },
  // quiet beat on the pass: no orbit, the slowest push
  { at: at("18"), lon: 7.07, lat: 44.71, zoom: 320, tilt: 28, bearing: 2, push: 0.006, orbit: 0 },
  { at: at("22") - 10, lon: 7.35, lat: 44.85, zoom: 220, tilt: 26, bearing: 0 },
  { at: at("26"), lon: 7.6, lat: 45.0, zoom: 240, tilt: 26, bearing: -2, push: 0.012 },
  // Dido's avenger: Carthage against Rome
  { at: at("29"), lon: 9.5, lat: 39.5, zoom: 52, tilt: 16, bearing: 0, push: 0.015 },
  // payoff: the long road against the short sea route
  { at: at("31") - 6, lon: 5.5, lat: 40.8, zoom: 52, tilt: 14, bearing: 0, push: 0.015, orbit: 0.3 },
  { at: at("33"), lon: 6.5, lat: 43.5, zoom: 85, tilt: 20, bearing: 0, push: 0.02 },
];

// ------------------------------------------------------------------ text


/** Card centre: above the pin, kept inside the safe zone. */
const cardX = (x: number) => Math.min(660, Math.max(380, x - 40));
const CARD_Y = 470;
/** A pin high on the screen would sit under the card: then the card hangs below it instead. */
const cardY = (y: number) => (y < 760 ? Math.min(880, y + 330) : CARD_Y);

// ------------------------------------------------------------------ scene

const marchAt = (f: number) => {
  const next = MARCH.findIndex(([, e]) => f < e);
  const current = next === -1 ? MARCH.length - 1 : next;
  const [a, b] = MARCH[current];
  return { current, p: Math.min(1, Math.max(0, (f - a) / (b - a))), marching: f >= MARCH[0][0] };
};

/** Map + route + map-bound lines: the layer that gets motion blur while the camera flies. */
const MapLayer: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const { current, p, marching } = marchAt(f);
  const direct = projectLine(cam, DIRECT);
  const directO =
    f < at("31") ? 1 - interpolate(f, [at("14") - 10, at("14") + 10], [0, 1], CLAMP) : interpolate(f, [at("31"), at("31") + 20], [0, 1], CLAMP);
  const fleetO = 1 - interpolate(f, [at("14") - 10, at("14") + 6], [0, 1], CLAMP);
  const rival = projectLine(cam, [P.carthage, P.rome]);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={PLATES} />
      <GeoLine pts={direct} p={interpolate(f, [w("01", 16), w("01", 16) + 40], [0, 1], CLAMP)} color="#F2C14E" o={directO * 0.85} width={4} />
      <GeoLine pts={projectLine(cam, FLEET)} p={interpolate(f, [at("09"), w("09", 10)], [0, 1], CLAMP)} color="#E5383B" o={fleetO} width={6} />
      <GeoLine
        pts={rival}
        p={interpolate(f, [w("29", 4), w("29", 4) + 45], [0, 1], CLAMP)}
        color="#E5383B"
        o={1 - interpolate(f, [at("31") - 10, at("31") + 6], [0, 1], CLAMP)}
        width={7}
      />
      {/* T4: the whole march flashes up on "when Italy", next to the two-week sea route */}
      <RoutePreview legs={LEGS.map((leg) => projectLine(cam, leg))} f={f} at={w("01", 14)} out={at("02") + 6} />
      {marching && <GlowRoute legs={LEGS.map((leg) => projectLine(cam, leg))} current={current} p={p} theoryFrom={THEORY_FROM} />}
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const at2 = (ll: LL) => project(cam, ll[0], ll[1]);
  const { current, p, marching } = marchAt(f);
  const head = along(projectLine(cam, LEGS[current]), marching ? p : 0);
  // style J: motion blur only while the camera is really flying
  const blur = camSpeed(KEYS, f, FPS) > 14;
  const side = (x: number) => (x > 620 ? "left" : "right");
  const pt = Object.fromEntries(Object.entries(P).map(([k, ll]) => [k, at2(ll as LL)])) as Record<keyof typeof P, [number, number, number]>;

  /** A place label anchored to P[key]. */
  const label = (key: keyof typeof P, name: string, from: number, to: number) => (
    <StopLabel key={`${key}-${name}-${from}`} name={name} x={pt[key][0]} y={pt[key][1]} f={f} at={from} out={to} side={side(pt[key][0])} />
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
      {f >= at("04") && f < at("29") && cam.zoom > 80 && <Army x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />}

      {/* ---- hook ---- */}
      <SourceLine text="According to Polybius, Histories" f={f} at={6} out={w("01", 8) - 6} />
      {/* on screen from the first frame: the hook number has to land inside the first 3 s */}
      <BigWord text="5 MONTHS" f={f} at={0} out={w("02", 14) - 4} y={300} />
      <SubWord text="vs. 2 weeks" f={f} at={w("01", 16)} out={w("02", 14) - 4} y={525} />
      <SubWord text="THE SEA" f={f} at={w("02", 14)} out={at("03") - 8} y={330} size={96} color="#F2C14E" />

      {/* ---- act 1: Spain to the Rhône ---- */}
      {label("cartagena", "NEW CARTHAGE", w("04", 6), w("06", 1))}
      <SubWord text="AGE 9" f={f} at={w("05", 1)} out={at("06")} y={330} size={96} color="#F2C14E" />
      {label("ebro", "EBRO", w("06", 3), at("07"))}
      {label("pyrenees", "PYRENEES", w("06", 6), at("07") + 10)}
      {label("rhone", "RHÔNE", w("07", 6), at("09"))}
      <Scribble x={pt.rhone[0]} y={pt.rhone[1]} f={f} at={w("07", 6)} out={at("08") + 20} seed="rhone" />
      {card("rhone", "rhone", w("08", 1), at("09") - 4)}

      {/* ---- act 2: the root cause, Rome owns the sea ---- */}
      {/* BOC-TACH-HINH.md T1: the islands Rome took, filled red; then the whole sea */}
      <RegionFill cam={cam} rings={regions.sicily} f={f} at={w("11", 8)} out={at("13")} color="#E5383B" name="SICILY" size={110} />
      <RegionFill cam={cam} rings={regions.sardinia} f={f} at={w("11", 10)} out={at("13")} color="#E5383B" name="SARDINIA" size={96} angle={-80} />
      <RegionFill cam={cam} rings={SEA} f={f} at={w("13", 1)} out={at("14") + 6} kind="sea" outline={false} color="#E5383B" name="ROME'S SEA" size={170} angle={-8} nameAt={[6.0, 40.4]} spotlight />
      {HAVE.fullFleet && <FullFrame src={`${IMG}/full-fleet.jpg`} f={f} at={at("12")} out={at("13") - 4} />}
      <BigWord text="220 SHIPS" f={f} at={w("12", 4)} out={at("13") - 2} y={300} />
      <Cross x={at2([5.0, 37.8])[0]} y={at2([5.0, 37.8])[1]} f={f} at={w("13", 1)} out={at("14") + 10} />
      <RegionFill cam={cam} rings={ITALY} f={f} at={w("14", 5)} out={at("15") + 4} kind="glow" name="ITALY" size={170} angle={-48} nameAt={[13.2, 42.6]} spotlight />
      {label("island", "THE ISLAND", w("15", 5), at("17"))}
      <SourceLine text="One leading theory" f={f} at={w("15", 11)} out={at("17")} />

      {/* ---- act 3: the Alps ---- */}
      <Scribble x={pt.pass[0]} y={pt.pass[1]} f={f} at={w("17", 4)} out={at("18") - 4} seed="pass" />

      {/* ---- quiet beat: the pass ---- */}
      {label("pass", "THE PASS", w("18", 2), at("22"))}
      {/* the Goya card comes down over Turin's pin on line 21: Italy's label and ring leave first */}
      {label("turin", "ITALY", w("20", 7), at("21") - 8)}
      <Ring x={pt.turin[0]} y={pt.turin[1]} f={f} at={w("20", 7)} out={at("21") - 8} />
      {HAVE.fullSummit && <FullFrame src={`${IMG}/full-summit.jpg`} f={f} at={w("20", 1)} out={at("21") - 4} />}
      {card("pass", "goya", at("21") - 4, at("22") - 4, { mono: interpolate(f, [w("21", 3), w("21", 3) + 45], [0, 1], CLAMP) })}

      {/* ---- descent + arrival ---- */}
      {card("crissolo", "snowstorm", w("23", 0), at("24"))}
      {label("turin", "PO PLAIN", w("26", 5), at("29"))}

      {/* ---- why it matters: Dido's avenger ---- */}
      {label("carthage", "CARTHAGE", w("29", 4), at("31"))}
      {/* the card hangs over Rome's pin: Rome's label waits until the card is gone */}
      {card("carthage", "carthage", w("29", 4), at("30"))}
      {label("rome", "ROME", at("30") + 6, at("31"))}

      {/* ---- payoff ---- */}
      <BigWord text="5 MONTHS" f={f} at={w("31", 5)} out={at("33") - 4} y={300} />
      <SubWord text="1,600 KM" f={f} at={w("31", 7)} out={at("33") - 4} y={525} size={96} />
      {label("pass", "ALPS", w("33", 10), Infinity)}
      <Ring x={pt.pass[0]} y={pt.pass[1]} f={f} at={w("33", 10)} />
    </AbsoluteFill>
  );
};

/**
 * Sound effects (real recordings: Pixabay + Mixkit ambience, levelled by `Sfx`). At most one per
 * beat: whooshes on the long flights, a hit on each big number, a snare on the Roman army, wind on
 * the descent. The quiet beat (the pass) has none.
 */
const SFX: { file: string; at: number; level?: number; seconds?: number }[] = [
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("01", 8), level: -17 },
  // KEYS indices: 3 = flight to New Carthage, 9 = the sea war, 11 = the Alps rise
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[3].at, level: -17 },
  { file: "sfx/drum/perc-military-snare-drum-sound-effect-502886.mp3", at: w("09", 2), level: -18 },
  { file: "sfx/whoosh/simple-whoosh-382724.mp3", at: KEYS[9].at, level: -20 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("13", 1), level: -22 },
  { file: "sfx/whoosh/whoosh-cinematic-5-376880.mp3", at: KEYS[11].at, level: -19 },
  { file: "sfx/ambience/mixkit-transition-windy-swoosh-1474.mp3", at: at("22") - 6, level: -19 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("27", 1), level: -16 },
  { file: "sfx/whoosh/epic-whoosh-478371.mp3", at: KEYS[KEYS.length - 2].at, level: -17 },
  { file: "sfx/riser/cinematic-trailer-riser-790.mp3", at: w("31", 5) - 70, level: -22 }, // swells into the payoff number
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("31", 5), level: -16 },
  { file: "sfx/water/sea-water-splash-1198.mp3", at: w("08", 3), level: -26 }, // "ferried": rafts on the river
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("33", 10), level: -23 },
];

/** KEYS that already carry a cinematic whoosh above, or sit in the quiet beat: no small flight whoosh. */
const BIG_FLIGHTS = new Set([3, 9, 11, KEYS.length - 2]);
const QUIET = [at("18"), at("22") - 12];

/**
 * One small sound per visual event (Bible §6, 2026-10-30). Cue frames are the same expressions as
 * the Scene above; nothing in the quiet beat.
 * shortcut: cues are listed beside the JSX, not derived from it; move labels / cards into data
 * arrays (one list for picture and sound) when a third episode copies this.
 */
const EVENTS: [EventKind, number][] = [
  ["chip", w("01", 16)],
  ["chip", w("02", 14)],
  ["label", w("04", 6)],
  ["chip", w("05", 1)],
  ["label", w("06", 3)],
  ["label", w("06", 6)],
  ["label", w("07", 6)],
  ["pen", w("07", 6) + 6],
  ["card", w("08", 1)],
  ["cardOut", at("09") - 4],
  ["label", w("11", 8)],
  ["label", w("11", 10)],
  ["chip", w("12", 4)],
  ["label", w("15", 5)],
  ["chip", w("15", 11)],
  ["pen", w("17", 4)],
  ["card", w("23", 0)],
  ["cardOut", at("24")],
  ["label", w("26", 5)],
  ["label", w("29", 4)],
  ["card", w("29", 4) + 6],
  ["cardOut", at("30")],
  ["label", at("30") + 6],
  ["chip", w("31", 7)],
  ["label", w("33", 10)],
  ["ping", w("33", 10) + 8],
  ...KEYS.map((k): [EventKind, number] => ["fly", k.at]).filter(([, a], i) => i > 0 && !BIG_FLIGHTS.has(i) && (a < QUIET[0] || a > QUIET[1])),
];

/** Ambience by place: air → the march → Rome's sea → the climb → the pass (wind only) → the descent → the plain. */
const BEDS: Bed[] = [
  { file: "amb-air/meadow-wind-light-1166.mp3", from: 0, to: at("04") + 15 },
  { file: "amb-army/small-military-parade-marching-troops-630.mp3", from: at("04"), to: at("09") + 15, level: -33 },
  { file: "amb-sea/distant-sea-humming-ambiance-1191.mp3", from: at("09"), to: at("14") + 15, level: -31 },
  { file: "amb-army/small-military-parade-marching-troops-630.mp3", from: at("14"), to: at("18") + 15, level: -34 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("14"), to: at("18") + 15, level: -33 },
  { file: "amb-wind/blizzard-cold-winds-1153.mp3", from: at("18"), to: at("22") + 15, level: -33 },
  { file: "amb-wind/winter-wind-loop-1175.mp3", from: at("22"), to: at("26") + 15, level: -31 },
  { file: "amb-air/meadow-wind-light-1166.mp3", from: at("26"), to: end("33") + 24, level: -33 },
];

/** Same headroom as Ep01: the whole mix 3 dB down, mastered back to −14 LUFS by render:j. */
const TRIM_DB = -3;

/** Music dips (≈ −9 dB) under the quiet beat on the pass. */
const duck = (f: number) =>
  interpolate(f, [at("18") - 10, at("18") + 10, at("22") - 8, at("22") + 4], [1, 0.35, 0.35, 1], CLAMP);

/** P3 Armies & Marches bed (Bible §2: the P1 backup "History", Tatamusic). */
const MUSIC = "sfx/music/p1-history-history-music-569200.mp3";

export const Hannibal: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <Handle />
    <Audio name="VO" src={staticFile("voiceover/hannibal/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    {/* music bed (Pixabay), −25 LUFS before the trim (was −28; lesson F3: the bed sat ~16 dB under the voice) */}
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
export const hannibalDuration = (fps: number) => Math.round((end("33") / FPS + 0.8) * fps);
