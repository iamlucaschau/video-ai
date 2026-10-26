/**
 * Style J "Satellite Journey" sample (EN, Lucas 2026-10-26): Aeneas, Aeneid book 3, first
 * four stops (Troy → Thrace → Delos → Crete). Script + sources: kich-ban-j-aeneas-FINAL.md.
 * One continuous satellite map; the camera never stops (style J exception). Every cue is
 * taken from the VO timing and Whisper word times, so regenerating the voice re-times it.
 */
import { CameraMotionBlur } from "@remotion/motion-blur";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/j-aeneas.timing.json";
import words from "../../../src/voiceover/j-aeneas.words.json";
import plates from "../../../public/images/j-aeneas/map/plates.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, PILLAR_MUSIC } from "../../../src/series/pvr/sfx";
import { KaraokeSubs } from "../../subs";
import {
  BigWord, camAt, camSpeed, GlowRoute, type JKey, JourneySub, type Plate, PhotoCard, project, projectLine, Ring, SatMap, StopLabel, SubWord, Vessel, along,
} from "../satellite-journey";

const FPS = 30;
const IMG = "images/j-aeneas";

/** Frame where VO line `id` starts, or `k` of the way through it. */
const at = (id: string, k = 0) => {
  const l = timing.lines.find((x) => x.id === id);
  if (!l) throw new Error(`no VO line ${id}`);
  return Math.round((l.start + (l.end - l.start) * k) * FPS);
};

/** Frame where script word k (0-based) of line `id` is spoken; same word mapping as the subtitles. */
const w = (id: string, k: number) => {
  const l = timing.lines.find((x) => x.id === id);
  const heard = (words as Record<string, number[]>)[id];
  if (!l || !heard?.length) return at(id);
  const n = l.text.split(/\s+/).length;
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / n))] * FPS);
};

const PLATES: Plate[] = (["world", "mid", "detail"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
const TROY: LL = [26.239, 39.957];
const THRACE: LL = [26.083, 40.723]; // Aenus (Enez), the traditional site of Aeneas' first city
const DELOS: LL = [25.268, 37.396];
const CRETE: LL = [24.95, 35.33];
const ITALY: LL = [16.2, 40.6];

/** Sea legs (waypoints keep the ship off the land). */
const LEGS: LL[][] = [
  [[26.15, 39.98], [26.0, 40.2], [25.98, 40.45], [26.06, 40.66]],
  [[26.06, 40.66], [25.85, 40.45], [25.6, 40.0], [25.6, 39.4], [25.3, 38.7], [25.3, 38.0], [25.45, 37.6], [25.3, 37.43]],
  [[25.3, 37.43], [25.3, 37.2], [25.28, 36.9], [25.2, 36.5], [25.0, 36.0], [24.92, 35.47]],
];
/** Leg i sails between these frames. */
const SAIL: [number, number][] = [
  [at("04"), at("04") + 40],
  [at("05") - 26, at("05") + 14],
  [at("06") - 8, at("06") + 34],
];

const KEYS: JKey[] = [
  { at: 0, lon: 21, lat: 38.5, zoom: 40, tilt: 14, bearing: -4, push: 0.025, orbit: 0.6 },
  { at: at("02") + 4, lon: 26.0, lat: 40.15, zoom: 300, tilt: 28, bearing: 6 },
  { at: at("04"), lon: 26.1, lat: 40.42, zoom: 300, tilt: 26, bearing: 2 },
  { at: SAIL[1][0], lon: 25.45, lat: 37.85, zoom: 240, tilt: 26, bearing: -3, dur: 40 },
  { at: SAIL[2][0], lon: 25.05, lat: 36.35, zoom: 215, tilt: 26, bearing: 3, dur: 36 },
  { at: at("08"), lon: 19.5, lat: 38.6, zoom: 46, tilt: 14, bearing: 0, push: 0.03, orbit: 0.4 },
];

/** Subtitle text per line (numerals; *keywords* in pale gold). */
const CAPTIONS: Record<string, string> = {
  "01": "Why did *Aeneas* wander for *7 years*, when *Italy* was only a few weeks' sail from *Troy*?",
  "03": "It begins in *Troy*, in flames, on the coast of modern Turkey.",
  "04": "First stop: *Thrace*, where a bleeding myrtle warns him to leave.",
  "05": "On *Delos*, Apollo's oracle tells him: seek your *ancient mother*.",
  "06": "His father reads it as *Crete*.",
  "07": "Then a *plague* drives them out.",
  "08": "So which *mother* did the god mean?",
};

/** Card centre: above the pin, kept inside the safe zone. */
const cardX = (x: number) => Math.min(660, Math.max(380, x - 40));
const CARD_Y = 470;

/** Route progress at frame f: the leg being sailed and how far along it is. */
const sailAt = (f: number) => {
  const next = SAIL.findIndex(([, end]) => f < end);
  const current = next === -1 ? SAIL.length - 1 : next;
  const p = Math.min(1, Math.max(0, (f - SAIL[current][0]) / (SAIL[current][1] - SAIL[current][0])));
  return { current, p, sailing: f >= SAIL[0][0] };
};

/** Map + route: the layer that gets motion blur while the camera flies (samples read their own frame). */
const MapLayer: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const { current, p, sailing } = sailAt(f);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={PLATES} />
      {sailing && <GlowRoute legs={LEGS.map((leg) => projectLine(cam, leg))} current={current} p={p} />}
    </AbsoluteFill>
  );
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f, FPS);
  const P = (ll: LL) => project(cam, ll[0], ll[1]);
  const { current, p, sailing } = sailAt(f);
  const head = along(projectLine(cam, LEGS[current]), sailing ? p : 0);
  const wide = f >= at("08") + 10;
  // style J: motion blur only while the camera is really flying
  const blur = camSpeed(KEYS, f, FPS) > 14;

  const troy = P(TROY);
  const thrace = P(THRACE);
  const delos = P(DELOS);
  const crete = P(CRETE);
  const italy = P(ITALY);
  const side = (x: number) => (x > 620 ? "left" : "right");

  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={blur ? 7 : 1}>
        <MapLayer />
      </CameraMotionBlur>
      {f >= at("03") && !wide && <Vessel x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} />}

      {/* labels land on the spoken place name; cards on the line's key image word */}
      <StopLabel name="TROY" x={troy[0]} y={troy[1]} f={f} at={w("03", 3)} out={at("05")} side={side(troy[0])} />
      <StopLabel name="THRACE" x={thrace[0]} y={thrace[1]} f={f} at={w("04", 2)} out={at("06")} side={side(thrace[0])} />
      <StopLabel name="DELOS" x={delos[0]} y={delos[1]} f={f} at={w("05", 1)} out={at("07") - 4} side={side(delos[0])} />
      <StopLabel name="CRETE" x={crete[0]} y={crete[1]} f={f} at={w("06", 5)} out={at("08") + 10} side={side(crete[0])} />
      <StopLabel name="ITALY" x={italy[0]} y={italy[1]} f={f} at={w("08", 3)} side={side(italy[0])} />
      <Ring x={italy[0]} y={italy[1]} f={f} at={w("08", 3)} />

      <PhotoCard src={`${IMG}/troy.jpg`} x={troy[0]} y={troy[1]} cx={cardX(troy[0])} cy={CARD_Y} f={f} at={w("03", 5)} out={at("04") - 4} />
      <PhotoCard src={`${IMG}/thrace.jpg`} x={thrace[0]} y={thrace[1]} cx={cardX(thrace[0])} cy={CARD_Y} f={f} at={w("04", 6)} out={SAIL[1][0] + 4} lean={3} />
      <PhotoCard src={`${IMG}/delos.jpg`} x={delos[0]} y={delos[1]} cx={cardX(delos[0])} cy={CARD_Y} f={f} at={w("05", 3)} out={SAIL[2][0] + 2} />
      <PhotoCard src={`${IMG}/crete.jpg`} x={crete[0]} y={crete[1]} cx={cardX(crete[0])} cy={CARD_Y} f={f} at={w("07", 2)} out={at("08") + 4} lean={3} />

      {/* hook: keyword + number only; the VO and subtitles carry the sentence */}
      <BigWord text="7 YEARS" f={f} at={w("01", 5)} out={at("02") + 2} y={300} />
      <SubWord text="vs. a few weeks" f={f} at={w("01", 11)} out={at("02") + 2} y={480} />
    </AbsoluteFill>
  );
};

export const JAeneas: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <KaraokeSubs timing={timing} words={words} captions={CAPTIONS} Skin={JourneySub} oneLine maxWords={3} maxChars={18} />
    <Audio name="VO" src={staticFile("voiceover/j-aeneas/vo.mp3")} />
    {/* music bed (Pixabay), levelled to −28 LUFS under the voice */}
    <MusicBed file={PILLAR_MUSIC.P1} />
    <SafeGuide />
  </AbsoluteFill>
);

/** Last word + 0.8 s. */
export const jAeneasDuration = (fps: number) => Math.round((timing.lines[timing.lines.length - 1].end + 0.8) * fps);
