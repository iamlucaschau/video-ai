/**
 * Style L "Thế Trận" test (~30 s, EN): Thermopylae, 480 BC, up to the moment before the battle.
 * Script + claim ledger + map sources: kich-ban-l-thermopylae-FINAL.md; spec: 01_EPISODE-SPEC_l-thermopylae.md.
 * Every cue is tied to a spoken word (VO timing + Whisper word times).
 */
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/l-thermopylae.timing.json";
import words from "../../../src/voiceover/l-thermopylae.words.json";
import plates from "../../../public/images/l-thermopylae/map/plates.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import { AtlasMap, AtlasSub, Banner, CampaignArrow, DateChip, EndCard, Flag, L, Magnifier, NumberChip, Pinch, Plaque, type Plate, camAt, key, project, projectLine } from "../siege-atlas";

const FPS = 30;
const IMG = "images/l-thermopylae";
const MUSIC = "sfx/music/p1-historical-documentary-music-349042.mp3";
const PERSIA = "#B8452E";
const GREEKS = "#2F6FA8";

const line = (id: string) => {
  const l = timing.lines.find((x) => x.id === id);
  if (!l) throw new Error(`no VO line ${id}`);
  return l;
};
const at = (id: string) => Math.round(line(id).start * FPS);
const end = (id: string) => Math.round(line(id).end * FPS);
/** Frame where script word k (0-based) of line `id` is spoken. */
const w = (id: string, k: number) => {
  const heard = (words as Record<string, number[]>)[id];
  if (!heard?.length) return at(id);
  const n = line(id).text.split(/\s+/).length;
  return Math.round(heard[Math.min(heard.length - 1, Math.floor((k * heard.length) / n))] * FPS);
};

const PLATES: Plate[] = (["world", "mid", "detail"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
/** Wikipedia coordinates. */
const P = {
  persepolis: [52.89, 29.935] as LL,
  memphis: [31.255, 29.849] as LL,
  indus: [67.9, 26.6] as LL,
  // label anchors, not places
  persiaName: [40.0, 37.0] as LL,
  greeksName: [24.0, 37.8] as LL,
  sardis: [28.04, 38.488] as LL,
  abydos: [26.405, 40.196] as LL,
  doriscus: [26.15, 40.87] as LL,
  therma: [22.95, 40.64] as LL,
  thessaly: [22.42, 39.64] as LL,
  thermopylae: [22.536, 38.796] as LL,
  athens: [23.727, 37.984] as LL,
};
const MARCH: LL[] = [P.sardis, P.abydos, P.doriscus, P.therma, P.thessaly, P.thermopylae, P.athens];

const KEYS = [
  key({ at: 0, lon: 47, lat: 33.5, zoom: 17.5, push: 0.012 }),
  key({ at: at("03") - 4, lon: 25.3, lat: 39.0, zoom: 120, dur: 40 }),
];
const LANDED = at("03") - 4 + 40;

const captions: Record<string, string> = {
  "02": "Its king, *Xerxes*, ruled from *Egypt* to the *Indus*.",
  "04": "*Thermopylae*.",
  "06": "Waiting there: about *seven thousand* Greeks, led by a *Spartan king* and *three hundred* of his men.",
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f);
  const pt = (ll: LL) => project(cam, ll[0], ll[1]);
  const [px, py] = pt(P.persepolis);
  const [tx, ty] = pt(P.thermopylae);
  const [ax, ay] = pt(P.athens);
  const [ex, ey] = pt(P.memphis);
  const [ix, iy] = pt(P.indus);

  const [sx, sy] = pt(P.sardis);
  const [rx, ry] = pt(P.persiaName);
  const [gx, gy] = pt(P.greeksName);

  // word indices: line 01 "In 480 BC, the largest(4) empire(5) … Greece(13)"; 06 "… seven(3) … Spartan(9) king(10) and three(12) …"
  const reveal = interpolate(f, [w("01", 4), w("01", 4) + 36], [0, 1], CLAMP);
  const greeks = interpolate(f, [w("01", 13), w("01", 13) + 10], [0, 1], CLAMP);
  const march = interpolate(f, [w("03", 4), w("03", 10)], [0, 1], { ...CLAMP, easing: (t) => 1 - (1 - t) ** 2 });
  const marchOut = 1 - interpolate(f, [at("04"), at("04") + 10], [0, 1], CLAMP);
  const layers = [
    { id: "persia", o: 1, from: P.persepolis, reveal },
    { id: "greeks", o: greeks },
  ];
  // magnifier circle; the "one cart wide" chip hangs under it
  const M = { x: 640, y: 560, r: 220 };

  return (
    <AbsoluteFill>
      <AtlasMap cam={cam} plates={PLATES} layers={layers} />
      {/* hook: ≤ 2 text blocks — the year, then the two sides named on their colour */}
      <DateChip text="480 BC" f={f} at={w("01", 1) - 4} out={w("01", 13) - 2} />
      <Flag x={px} y={py} f={f} at={w("01", 5)} out={at("03")} color={PERSIA} mark="disc" />
      <Plaque name="PERSIAN EMPIRE" x={rx} y={ry} f={f} at={w("01", 5) + 6} out={at("02") + 4} side="right" />
      <Plaque name="GREEKS" x={gx} y={gy} f={f} at={w("01", 13)} out={at("02") + 4} side="right" />
      <Plaque name="EGYPT" x={ex} y={ey} f={f} at={w("02", 5)} out={at("03")} side="right" />
      <Plaque name="INDUS" x={ix} y={iy} f={f} at={w("02", 8)} out={at("03")} side="left" />
      {/* the march starts at Sardis, under a Persian flag, so the line reads as one route */}
      <Flag x={sx} y={sy} f={f} at={w("03", 4)} out={at("04") + 6} color={PERSIA} mark="disc" scale={0.8} />
      <CampaignArrow pts={projectLine(cam, MARCH, 0.2)} p={march} color={PERSIA} o={marchOut} />
      {/* the name is spoken mid-flight: the label waits until the camera has landed */}
      <Plaque name="ATHENS" x={ax} y={ay} f={f} at={Math.max(w("03", 2), LANDED)} out={at("04") - 2} side="right" />
      {/* no faction tint inside: the point is the relief; the wedges show the squeeze the coarse map can't */}
      <Magnifier plates={PLATES} target={P.thermopylae} zoom={380} tx={tx} ty={ty} x={M.x} y={M.y} r={M.r} f={f} at={at("04")} out={at("06") - 4} />
      <Pinch x={M.x} y={M.y} f={f} at={w("05", 2)} out={at("06") - 4} angle={-25} />
      <NumberChip text="ONE CART WIDE" x={M.x + 90} y={M.y + M.r + 260} f={f} at={w("05", 7)} out={at("06") - 4} color={L.ink} size={64} />
      <Plaque name="THERMOPYLAE" x={tx} y={ty} f={f} at={at("04") + 4} out={w("06", 3)} side="right" />
      <Flag x={tx} y={ty} f={f} at={at("06")} color={GREEKS} mark="lambda" />
      <NumberChip text="7,000" x={tx + 190} y={ty - 20} f={f} at={w("06", 3)} out={w("06", 12)} color={GREEKS} />
      <NumberChip text="300 SPARTANS" x={tx + 230} y={ty - 20} f={f} at={w("06", 12)} out={end("06") - 10} color="#A23B2C" />
      <Banner src={`${IMG}/leonidas.jpg`} name="LEONIDAS" x={300} y={290} f={f} at={w("06", 9)} out={end("06") - 10} color={GREEKS} w={250} />
      <EndCard place="THERMOPYLAE" year="480 BC" f={f} at={end("06") - 8} />
    </AbsoluteFill>
  );
};

/** Same headroom as style J: mix 3 dB down, mastered back to −14 LUFS by render:j. */
const TRIM_DB = -3;

export const LThermopylae: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <KaraokeSubs timing={timing} words={words} captions={captions} Skin={AtlasSub} />
    <Audio name="VO" src={staticFile("voiceover/l-thermopylae/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    <MusicBed file={MUSIC} level={-25 + TRIM_DB} />
    {/* D-SFX "few sounds": one accent, on the name of the pass */}
    <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={at("04")} level={-18 + TRIM_DB} />
    <SafeGuide />
  </AbsoluteFill>
);

/** D10: end card lands on the last words, cut 0.5 s after the card has settled. */
export const lThermopylaeDuration = (fps: number) => Math.round(((end("06") + 22) / FPS + 0.5) * fps);
