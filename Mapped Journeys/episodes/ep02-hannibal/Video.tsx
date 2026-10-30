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
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../../Style Library/kit-common";
import { KaraokeSubs } from "../../../Style Library/subs";
import {
  along, Army, BigWord, camAt, camSpeed, Cross, FullFrame, GeoLine, GlowRoute, type JKey, JourneySub, type Plate, PhotoCard,
  project, projectLine, Ring, SatMap, SourceLine, StopLabel, SubWord,
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
const PLATES: Plate[] = (["world", "mid", "midwest", "cartagena", "alps"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
/** Coordinates from each place's Wikipedia page (2026-10-27); Traversette and the Guil from FINAL, Gate 4. */
const P = {
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
const LEGS: LL[][] = [
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
const THEORY_FROM = 5;

/** The "two weeks' sail" of the hook: New Carthage → south of Sardinia → the Tiber (ledger #G3). */
const DIRECT: LL[] = [[-0.98, 37.55], [1.5, 37.6], [5.0, 37.8], [8.6, 38.7], [10.5, 39.8], P.ostia];
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
  { at: 0, lon: 6, lat: 40.3, zoom: 55, tilt: 14, bearing: -3, push: 0.02, orbit: 0.5 },
  { at: at("03") - 20, lon: -0.9, lat: 37.85, zoom: 220, tilt: 26, bearing: 4 },
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
  { at: at("14") + 4, lon: 6.2, lat: 44.4, zoom: 120, tilt: 26, bearing: 0 },
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

/** Subtitle text per line (numerals; *keywords* in pale gold). */
const CAPTIONS: Record<string, string> = {
  "01": "Why did *Hannibal*, Carthage's greatest general, march for *5 months* over the *Alps*, when *Italy* was *2 weeks'* sail away?",
  "02": "The answer is on this route, and in the one thing *Carthage* had lost: the *sea*.",
  "03": "*Spain*, *218 BC*.",
  "04": "*Hannibal* leads his army north from *New Carthage*.",
  "05": "At *9*, he had sworn to his father never to be a friend of *Rome*.",
  "06": "He crosses the *Ebro* and the *Pyrenees*, leaving troops behind to hold *Spain*.",
  "07": "About *46,000* men cross the *Rhône*.",
  "08": "*37 elephants* follow, ferried over on rafts.",
  "09": "But a *Roman army* has already landed at the river's mouth.",
  "10": "It came by *sea*.",
  "11": "*Rome* had won the last war, and taken *Sicily* and *Sardinia*.",
  "12": "That year, *Rome* put *220 ships* to sea.",
  "13": "The *sea* belonged to *Rome*.",
  "14": "So the only way into *Italy* was over the *mountains*, where *Celtic* tribes were ready to join him.",
  "15": "At a place called the *Island*, where two rivers meet, he turns toward the *Alps*.",
  "17": "The climb to the pass takes *9 days*.",
  "20": "So *Hannibal* shows them the plains of *Italy*, far below.",
  "25": "It takes *3 days* to rebuild it for the starving elephants.",
  "26": "In the plain of the *Po*, he counts what is left.",
  "27": "About *26,000* men.",
  "28": "*Hannibal* later had that number engraved in *bronze*.",
  "29": "In Virgil's *Aeneid*, Queen *Dido* prays for an *avenger* to rise from her bones.",
  "30": "Many readers take that *avenger* to be *Hannibal*.",
  "31": "*2 weeks* of sailing became *5 months*, *1,600 km*, and *half an army*.",
  "32": "*Rome* held the *sea*, so *Hannibal* took the *mountains*.",
  "33": "*Dido's avenger* had come, not by sea, but over the *Alps*.",
};

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
      {f >= at("04") && f < at("29") && cam.zoom > 80 && <Army x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />}

      {/* ---- hook ---- */}
      <SourceLine text="According to Polybius, Histories" f={f} at={6} out={w("01", 8) - 6} />
      {/* on screen from the first frame: the hook number has to land inside the first 3 s */}
      <BigWord text="5 MONTHS" f={f} at={0} out={w("02", 14) - 4} y={300} />
      <SubWord text="vs. 2 weeks" f={f} at={w("01", 16)} out={w("02", 14) - 4} y={480} />
      <SubWord text="THE SEA" f={f} at={w("02", 14)} out={at("03") - 8} y={330} size={72} color="#F2C14E" />

      {/* ---- act 1: Spain to the Rhône ---- */}
      {label("cartagena", "NEW CARTHAGE", w("04", 6), w("06", 1))}
      <SubWord text="AGE 9" f={f} at={w("05", 1)} out={at("06")} y={330} size={72} color="#F2C14E" />
      {label("ebro", "EBRO", w("06", 3), at("07"))}
      {label("pyrenees", "PYRENEES", w("06", 6), at("07") + 10)}
      {label("rhone", "RHÔNE", w("07", 6), at("09"))}
      {card("rhone", "rhone", w("08", 1), at("09") - 4)}

      {/* ---- act 2: the root cause, Rome owns the sea ---- */}
      {label("sicily", "SICILY", w("11", 8), at("13"))}
      <Ring x={pt.sicily[0]} y={pt.sicily[1]} f={f} at={w("11", 8)} out={at("13")} color="#E5383B" />
      {label("sardinia", "SARDINIA", w("11", 10), at("13"))}
      <Ring x={pt.sardinia[0]} y={pt.sardinia[1]} f={f} at={w("11", 10)} out={at("13")} color="#E5383B" />
      {HAVE.fullFleet && <FullFrame src={`${IMG}/full-fleet.jpg`} f={f} at={at("12")} out={at("13") - 4} />}
      <BigWord text="220 SHIPS" f={f} at={w("12", 4)} out={at("13") - 2} y={300} />
      <Cross x={at2([5.0, 37.8])[0]} y={at2([5.0, 37.8])[1]} f={f} at={w("13", 1)} out={at("14") + 10} />
      {label("island", "THE ISLAND", w("15", 5), at("17"))}
      <SourceLine text="One leading theory" f={f} at={w("15", 11)} out={at("17")} />

      {/* ---- act 3: the Alps ---- */}

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
      <SubWord text="1,600 KM" f={f} at={w("31", 7)} out={at("33") - 4} y={480} size={72} />
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
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[1].at, level: -17 },
  { file: "sfx/drum/perc-military-snare-drum-sound-effect-502886.mp3", at: w("09", 2), level: -18 },
  { file: "sfx/whoosh/simple-whoosh-382724.mp3", at: KEYS[7].at, level: -20 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("13", 1), level: -22 },
  { file: "sfx/whoosh/whoosh-cinematic-5-376880.mp3", at: KEYS[9].at, level: -19 },
  { file: "sfx/ambience/mixkit-transition-windy-swoosh-1474.mp3", at: at("22") - 6, level: -19 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("27", 1), level: -16 },
  { file: "sfx/whoosh/epic-whoosh-478371.mp3", at: KEYS[KEYS.length - 2].at, level: -17 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("31", 5), level: -16 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("33", 10), level: -23 },
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
    <KaraokeSubs timing={timing} words={words} captions={CAPTIONS} Skin={JourneySub} oneLine maxWords={3} maxChars={18} />
    <Audio name="VO" src={staticFile("voiceover/hannibal/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    {/* music bed (Pixabay), −28 LUFS under the voice before the headroom trim */}
    <MusicBed file={MUSIC} duck={duck} level={-28 + TRIM_DB} />
    {SFX.map((s, i) => (
      <Sfx key={i} {...s} level={(s.level ?? -15) + TRIM_DB} />
    ))}
    <SafeGuide />
  </AbsoluteFill>
);

/** Last word + 0.8 s. */
export const hannibalDuration = (fps: number) => Math.round((end("33") / FPS + 0.8) * fps);
