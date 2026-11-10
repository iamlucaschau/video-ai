/**
 * Style L "Thế Trận" full test (~103 s, EN): Thermopylae, 480 BC. Script locked by Lucas 2026-11-01:
 * kich-ban-l-thermopylae-full-FINAL.md (claims, image sources); spec: 01_EPISODE-SPEC_l-thermopylae-full.md.
 * Every cue is tied to a spoken word (VO timing + Whisper word times): w(line, k).
 */
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/l-thermopylae-full.timing.json";
import words from "../../../src/voiceover/l-thermopylae-full.words.json";
import plates from "../../../public/images/l-thermopylae-full/map/plates.json";
import { SafeGuide } from "../../../src/series/pvr/safe";
import { MusicBed, Sfx } from "../../../src/series/pvr/sfx";
import { CLAMP } from "../../kit-common";
import { KaraokeSubs } from "../../subs";
import { Cross, FullFrame } from "../../J-satellite-journey/satellite-journey";
import {
  AtlasMap, AtlasSub, Banner, CampaignArrow, DateChip, EndCard, Fleet, Flag, Host, L, Magnifier, NumberChip, Pinch, Plaque,
  type Plate, Trail, camAt, key, project, projectLine,
} from "../siege-atlas";

const FPS = 30;
const IMG = "images/l-thermopylae-full";
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
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: (t) => 1 - (1 - t) ** 2 });

const PLATES: Plate[] = (["world", "mid", "detail"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));
/** Terrain Tiles close-up (atlas-terrain.py); "ancient" = land under 10 m drawn as sea (shoreline of 480 BC, after Kraft et al. 1987). */
const PASS: Plate = { src: `${IMG}/map/pass.jpg`, ...plates.pass };
const PASS_480: Plate = { ...PASS, src: `${IMG}/map/pass-ancient.jpg` };

type LL = [number, number];
/** Wikipedia coordinates; label anchors marked. */
const P = {
  persepolis: [52.89, 29.935] as LL,
  memphis: [31.255, 29.849] as LL,
  indus: [66.5, 27.0] as LL,
  sardis: [28.04, 38.488] as LL,
  abydos: [26.405, 40.196] as LL,
  doriscus: [26.15, 40.87] as LL,
  therma: [22.95, 40.64] as LL,
  thessaly: [22.42, 39.64] as LL,
  thermopylae: [22.536, 38.796] as LL,
  athens: [23.727, 37.984] as LL,
  marathon: [23.963, 38.118] as LL,
  naxos: [25.38, 37.1] as LL,
  eretria: [23.79, 38.39] as LL,
  salamis: [23.5, 37.95] as LL,
  plataea: [23.27, 38.215] as LL,
  persiaName: [40.0, 37.0] as LL,
  greeksName: [24.0, 37.8] as LL,
};
const MARCH: LL[] = [P.sardis, P.abydos, P.doriscus, P.therma, P.thessaly, P.thermopylae];
/** The fleet hugs the coast beside the army (Herodotus 7.121, 7.179–183): Hellespont → Chalcidice → Magnesia → Artemisium. */
const SEA_ROUTE: LL[] = [[26.3, 40.05], [25.5, 40.35], [24.5, 40.15], [23.85, 39.9], [23.45, 39.5], [23.3, 39.1]];
/** Into the Saronic gulf to Salamis (book 8). */
const TO_SALAMIS: LL[] = [[23.3, 39.1], [24.15, 38.6], [24.35, 37.85], [23.95, 37.65], [23.55, 37.92]];
/** 490 BC: Darius's fleet across the Aegean via Naxos and Eretria to Marathon (Herodotus 6.95–107). */
const MARATHON_RUN: LL[] = [[27.0, 38.4], P.naxos, [24.6, 37.9], P.eretria, P.marathon];
/** Persian thrust into the pass and its bounce, and the retreat after Plataea. */
const THRUST: LL[] = [[21.95, 39.3], [22.3, 39.02], [22.45, 38.88], P.thermopylae];
const RETREAT: LL[] = [P.plataea, [22.9, 38.7], [22.5, 39.3], [22.6, 40.2]];
/** The Anopaea track over Mount Kallidromo (Herodotus 7.216); one reconstruction, approximate. */
const ANOPAEA: LL[] = [[22.43, 38.79], [22.47, 38.765], [22.52, 38.746], [22.57, 38.745], [22.61, 38.762], [22.625, 38.785]];

const LANDED_GREECE = at("05") - 4 + 36;
const KEYS = [
  key({ at: 0, lon: 47, lat: 33.5, zoom: 17.5, push: 0.012 }),
  key({ at: at("03") - 2, lon: 25.0, lat: 38.4, zoom: 75, dur: 34 }),
  key({ at: at("05") - 4, lon: 25.3, lat: 39.0, zoom: 120, dur: 36 }),
  key({ at: at("12") - 2, lon: 22.6, lat: 39.0, zoom: 260, dur: 30 }),
  key({ at: at("22") - 2, lon: 23.4, lat: 38.45, zoom: 170, dur: 30 }),
  key({ at: at("27") - 4, lon: 22.6, lat: 38.95, zoom: 260, dur: 1, push: 0.008 }),
];

const captions: Record<string, string> = {
  "02": "Its king, *Xerxes*, ruled from *Egypt* to the *Indus*.",
  "03": "Ten years earlier, *Athens* had beaten his father's army at *Marathon*.",
  "07": "*Thermopylae*.",
  "08": "Waiting there: about *seven thousand* Greeks.",
  "09": "Their leader, the Spartan king *Leonidas*, had brought *three hundred* of his own men, all fathers with sons at home.",
  "10": "According to *Plutarch*, Xerxes told them to hand over their weapons.",
  "11": "Leonidas replied: *come and take them*.",
  "12": "*Herodotus* claimed over *two million* men.",
  "17": "Not even his elite guard, the *Immortals*.",
  "18": "Then a local Greek, *Ephialtes*, showed the Persians a path over the mountain.",
  "24": "Weeks later, his fleet was crushed at *Salamis*.",
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(KEYS, f);
  const pt = (ll: LL) => project(cam, ll[0], ll[1]);
  const xy = (ll: LL) => pt(ll).slice(0, 2) as [number, number];
  const line$ = (ll: LL[]) => projectLine(cam, ll, 0.05);
  const [tx, ty] = xy(P.thermopylae);

  // factions: Persia spreads from Persepolis on "largest"; Greeks on "Greece"; Attica turns red when Athens burns,
  // back to blue when the army is driven out
  const layers = [
    { id: "persia", o: 1, from: P.persepolis, reveal: ramp(f, w("01", 4), w("01", 4) + 36) },
    { id: "greeks", o: ramp(f, w("01", 17), w("01", 17) + 10) },
    { id: "attica", o: ramp(f, w("22", 4), w("22", 4) + 20) * (1 - ramp(f, w("25", 6), w("25", 6) + 20)), from: P.athens, reveal: ramp(f, w("22", 4), w("22", 4) + 24) },
  ];

  // day chip (4 days of waiting count up, then 5, 6, 7)
  const waited = Math.min(4, 1 + Math.floor(interpolate(f, [at("14"), end("14")], [0, 4], CLAMP)));
  const day = f >= at("18") ? 7 : f >= w("16", 2) ? 6 : f >= w("15", 2) ? 5 : waited;

  // magnifier geometry: line 07 (wide Greek view) and line 18 (pass view)
  const M7 = { x: 640, y: 560, r: 220 };
  const M18 = { x: 600, y: 610, r: 240 };
  const MZ = 1500;
  // children of <Magnifier> live in its inner map, where the target sits at the stage centre
  const inner = (ll: LL[]) => ll.map(([lon, lat]) => project({ lon: P.thermopylae[0], lat: P.thermopylae[1], zoom: MZ, bearing: 0, tilt: 0 }, lon, lat).slice(0, 2) as [number, number]);

  const thrust = (a: number) => interpolate(f, [a, a + 14, a + 26], [0, 1, 0.72], CLAMP);
  const hosts = f >= at("12") && f < at("18") + 10;

  return (
    <AbsoluteFill>
      <AtlasMap cam={cam} plates={PLATES} layers={layers} />

      {/* H — the year, the two sides */}
      <DateChip text="480 BC" f={f} at={w("01", 1) - 4} out={w("01", 17) - 2} />
      <Flag {...xyp(xy(P.persepolis))} f={f} at={w("01", 5)} out={at("03")} color={PERSIA} mark="disc" />
      <Plaque name="PERSIAN EMPIRE" {...xyp(xy(P.persiaName))} f={f} at={w("01", 5) + 6} out={at("02") + 4} side="right" />
      <Plaque name="GREEKS" {...xyp(xy(P.greeksName))} f={f} at={w("01", 17) + 8} out={at("02") + 4} side="right" />

      {/* B — Xerxes, his reach, Marathon */}
      <Banner src={`${IMG}/xerxes-banner.jpg`} name="XERXES" x={760} y={290} f={f} at={w("02", 2)} out={w("02", 8) - 2} color={PERSIA} w={240} />
      <Plaque name="EGYPT" {...xyp(xy(P.memphis))} f={f} at={w("02", 5)} out={at("03")} side="right" />
      <Plaque name="INDUS" {...xyp(xy(P.indus))} f={f} at={w("02", 8)} out={at("03")} side="left" />
      <DateChip text="490 BC" f={f} at={w("03", 0) + 6} out={at("04")} />
      <CampaignArrow pts={line$(MARATHON_RUN)} p={ramp(f, w("03", 3), w("03", 9))} color={PERSIA} o={1 - ramp(f, at("04"), at("04") + 10)} />
      <Flag {...xyp(xy(P.athens))} f={f} at={w("03", 3)} out={at("05")} color={GREEKS} mark="disc" scale={0.8} />
      <Plaque name="MARATHON" {...xyp(xy(P.marathon))} f={f} at={w("03", 10)} out={at("04") + 6} side="right" />
      <Cross x={xy(P.marathon)[0]} y={xy(P.marathon)[1]} f={f} at={w("03", 5)} out={at("04") + 6} />

      {/* BC — army and fleet side by side, the gap */}
      <Flag {...xyp(xy(P.sardis))} f={f} at={w("04", 0)} out={LANDED_GREECE + 10} color={PERSIA} mark="disc" scale={0.8} />
      <CampaignArrow pts={line$(MARCH)} p={ramp(f, w("05", 1), end("06"))} color={PERSIA} o={1 - ramp(f, at("08"), at("08") + 10)} />
      <Fleet pts={line$(SEA_ROUTE)} p={ramp(f, w("05", 9), end("06"))} color={PERSIA} f={f} o={1 - ramp(f, at("08"), at("08") + 10)} />
      <Plaque name="ATHENS" {...xyp(xy(P.athens))} f={f} at={Math.max(w("06", 2), LANDED_GREECE)} out={at("07") - 2} side="right" />
      <Magnifier plates={[PASS_480]} target={P.thermopylae} zoom={MZ} tx={tx} ty={ty} x={M7.x} y={M7.y} r={M7.r} f={f} at={w("06", 8) - 4} out={at("08") + 6} />
      <Pinch x={M7.x} y={M7.y} f={f} at={w("06", 9)} out={at("08") + 6} angle={-20} gap={20} />
      <NumberChip text="COAST IN 480 BC" x={M7.x - 20} y={M7.y + M7.r + 250} f={f} at={at("07")} out={at("08") + 6} color={L.ink} size={56} />
      <Plaque name="THERMOPYLAE" x={tx} y={ty} f={f} at={at("07") + 2} out={w("08", 3)} side="right" />

      {/* N — who waited there */}
      <Flag x={tx} y={ty} f={f} at={at("08")} out={at("10")} color={GREEKS} mark="lambda" />
      <NumberChip text="7,000" x={tx + 190} y={ty - 20} f={f} at={w("08", 3)} out={w("09", 3)} color={GREEKS} />
      <Banner src={`${IMG}/leonidas-face.jpg`} name="LEONIDAS" x={300} y={290} f={f} at={w("09", 3)} out={at("10") - 6} color={GREEKS} w={250} />
      <NumberChip text="300 SPARTANS" x={tx + 270} y={ty - 20} f={f} at={w("09", 8)} out={at("10") - 6} color="#24527F" />

      {/* X — the demand and the answer, on David's painting */}
      <FullFrame src={`${IMG}/leonidas-916.jpg`} f={f} at={at("10")} out={at("12")} />

      {/* T — how many: Herodotus's crowd, then thinned to "far fewer, still many times" */}
      {hosts && (
        <>
          <Host x={xy([22.25, 39.25])[0]} y={xy([22.25, 39.25])[1]} rx={210} ry={130} n={260} f={f} at={w("12", 3)} out={at("18")} keep={1 - 0.6 * ramp(f, w("13", 3), w("13", 3) + 30)} color={PERSIA} seed="persians" />
          <Host x={tx} y={ty} rx={16} ry={10} n={9} f={f} at={w("12", 3) + 6} out={at("18")} color={GREEKS} seed="greeks" dot={6} />
        </>
      )}
      <Flag x={tx} y={ty} f={f} at={at("12")} out={at("19")} color={GREEKS} mark="lambda" />

      {/* V — the days */}
      <DateChip text={`DAY ${day}`} f={f} at={at("14")} out={at("19")} />
      <CampaignArrow pts={line$(THRUST)} p={thrust(w("15", 3))} color={PERSIA} o={1 - ramp(f, at("16") + 10, at("16") + 16)} />
      <FullFrame src={`${IMG}/thermopylae-davis.jpg`} f={f} at={w("16", 4)} out={at("17") + 4} />
      <CampaignArrow pts={line$(THRUST)} p={thrust(at("17") + 6)} color={PERSIA} o={1 - ramp(f, end("17"), end("17") + 8)} width={22} />
      <Banner src={`${IMG}/immortals-banner.jpg`} name="IMMORTALS" x={780} y={380} f={f} at={at("17")} out={at("18") - 2} color={PERSIA} w={240} />

      {/* Đ — the track over the mountain, the stand */}
      <Magnifier plates={[PASS_480]} target={P.thermopylae} zoom={MZ} tx={tx} ty={ty} x={M18.x} y={M18.y} r={M18.r} f={f} at={at("18")} out={w("18", 9) + 4}>
        <Trail pts={inner(ANOPAEA)} p={ramp(f, w("18", 4), w("18", 9))} color={PERSIA} />
      </Magnifier>
      <FullFrame src={`${IMG}/full-anopaea.jpg`} f={f} at={w("18", 9)} out={at("19") + 12} />
      <Host x={tx} y={ty + 6} rx={26} ry={14} n={20} f={f} at={at("19")} out={at("20")} keep={1 - 0.8 * ramp(f, w("19", 2), w("19", 6))} color={GREEKS} seed="allies" dot={10} />
      <FullFrame src={`${IMG}/full-last-stand.jpg`} f={f} at={at("20")} out={at("22")} />
      <NumberChip text="300 + 700" x={540} y={SAFE_TOP + 170} f={f} at={w("20", 6)} out={at("21")} color={GREEKS} />

      {/* K — Athens burns, Salamis, Plataea */}
      {/* flag left of the point: its cloth runs right, where the label sits */}
      <Flag x={xy(P.athens)[0] - 95} y={xy(P.athens)[1]} f={f} at={w("22", 4)} out={w("25", 6)} color={PERSIA} mark="disc" />
      <Plaque name="ATHENS" {...xyp(xy(P.athens))} f={f} at={w("22", 4)} out={w("23", 3)} side="right" />
      <Fleet pts={line$(TO_SALAMIS)} p={ramp(f, at("23"), w("24", 5))} color={PERSIA} f={f} o={1 - ramp(f, w("24", 5), w("24", 5) + 10)} />
      <Plaque name="SALAMIS" {...xyp(xy(P.salamis))} f={f} at={at("24")} out={w("24", 6) + 6} side="left" />
      <Cross x={xy(P.salamis)[0]} y={xy(P.salamis)[1]} f={f} at={w("24", 5)} out={at("25")} />
      <FullFrame src={`${IMG}/salamis-916.jpg`} f={f} at={w("24", 6) + 6} out={at("25") + 4} />
      <DateChip text="479 BC" f={f} at={at("25") + 4} out={at("26")} />
      <Plaque name="PLATAEA" {...xyp(xy(P.plataea))} f={f} at={w("25", 3)} out={at("26")} side="left" />
      <CampaignArrow pts={line$(RETREAT)} p={ramp(f, w("25", 5), end("25"))} color={PERSIA} o={1 - ramp(f, at("26"), at("26") + 8)} />

      {/* the epitaph, then place · year */}
      {/* FullFrame needs a finite out: hold past the last frame */}
      <FullFrame src={`${IMG}/full-epitaph.jpg`} f={f} at={at("26")} out={at("27") + 6} />
      {/* the epitaph is heard over the pass itself, where the stand happened; then place · year */}
      <Flag x={tx} y={ty} f={f} at={at("27") + 4} out={end("27") - 8} color={GREEKS} mark="lambda" />
      <EndCard place="THERMOPYLAE" year="480 BC" f={f} at={end("27") - 8} y={760} />
    </AbsoluteFill>
  );
};

const SAFE_TOP = 220;
const xyp = ([x, y]: [number, number]) => ({ x, y });

/** Same headroom as style J: mix 3 dB down, mastered back to −14 LUFS by render:j. */
const TRIM_DB = -3;
/** Music dips under the last stand and the epitaph. */
const duck = (f: number) => interpolate(f, [at("20") - 10, at("20") + 10, at("22") - 6, at("22") + 6, at("26") - 10, at("26") + 10], [1, 0.4, 0.4, 1, 1, 0.45], CLAMP);

export const LThermopylaeFull: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <KaraokeSubs timing={timing} words={words} captions={captions} Skin={AtlasSub} />
    <Audio name="VO" src={staticFile("voiceover/l-thermopylae-full/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
    <MusicBed file={MUSIC} level={-25 + TRIM_DB} duck={duck} />
    {/* D-SFX "few sounds": only where something lands — the name of the pass, the fleet broken at Salamis */}
    <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={at("07")} level={-18 + TRIM_DB} />
    <Sfx file="sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3" at={w("24", 5)} level={-18 + TRIM_DB} />
    <SafeGuide />
  </AbsoluteFill>
);

/** D10: end card lands on the last words, cut 0.5 s after it settles. */
export const lThermopylaeFullDuration = (fps: number) => Math.round(((end("27") + 22) / FPS + 0.5) * fps);
