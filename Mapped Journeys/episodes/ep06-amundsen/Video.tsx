/**
 * Mapped Journeys Ep06 (style J "Satellite Journey", EN, Lucas locked Gate 2 on 2026-11-04):
 * "Why did Amundsen's voyage through the Northwest Passage take three years?" Oslo → Greenland →
 * Beechey Island → down the east side of King William Island → two winters at Gjoa Haven with the
 * Netsilik → "Vessel in sight" (1905) → iced in off the Yukon, the ski trip to Eagle → Nome (1906).
 * Script, claim ledger, coordinates, image sources: kich-ban-amundsen-FINAL.md; spec: 01_EPISODE-SPEC_amundsen.md.
 * Every cue comes from the VO timing + Whisper word times.
 */
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import timing from "../../../src/voiceover/amundsen.timing.json";
import words from "../../../src/voiceover/amundsen.words.json";
import plates from "../../../public/images/amundsen/map/plates.json";
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
const IMG = "images/amundsen";
/** Bible §2: P2 Explorers → Cinematic Documentary (Lexin_Music). */
const MUSIC = PILLAR_MUSIC.P4;
export const RED = "#E5383B";
const ICE_BLUE = "#7FD3FF";

/** Images in public/images/amundsen. AI frames wait for Lucas (image-prompts.md); a false flag leaves the frame out. */
const HAVE = {
  amundsen: true, // portrait, 1907, Commons PD
  gjoa: true, // visitors aboard Gjøa at Nome, 1 Sep 1906 (F. Howell, Library of Congress), Commons PD
  whaler: true, // "Gjøa's first meeting with whalers", frontispiece of The North West Passage vol. 2 (1908), PD
  garb: true, // "Ahiva and Alo-Alo in hunting garb", ibid.
  snowhut: true, // "Lindström being instructed in the Nechilli Eskimo method of building snow huts", ibid.
  pole: true, // Olav Bjaaland, Amundsen's party at the South Pole, Dec 1911, Commons PD
  fullHarbour: true, // AI, Lucas
  fullSki: true, // AI, Lucas
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

/** Coarse first, finest last (make-plates.py, Gate 4; arcticw / arctice / kwi are Ep05's). */
export const PLATES: Plate[] = (["world", "alaska", "atlantic", "west", "norway", "arcticw", "arctice", "kwi"] as const).map((k) => ({ src: `${IMG}/map/${k}.jpg`, ...plates[k] }));

type LL = [number, number];
/** FINAL Gate 4: Wikipedia, or the Victory Point note (beechey, as Ep05). */
export const P = {
  oslo: [10.7389, 59.9133],
  godhavn: [-53.5333, 69.2472],
  beechey: [-91.6542, 74.7244],
  gjoa: [-95.8778, 68.625],
  kwi: [-97.4167, 69.1667],
  herschel: [-139.0992, 69.5897],
  eagle: [-141.2014, 64.7875],
  nome: [-165.3994, 64.5039],
} satisfies Record<string, LL>;

/** Sea legs in order; points between stops only keep the line at sea (schematic). */
export const LEGS: LL[][] = [
  // 1903: out of the Oslofjord, north of Scotland, round Cape Farewell to Godhavn
  [P.oslo, [10.6, 59.4], [10.2, 58.9], [8.5, 57.9], [4.5, 58.6], [-1.6, 59.5], [-10, 60], [-30, 59.8], [-43.6, 59.2], [-48.6, 60.8], [-52.6, 64.4], [-54.2, 67.8], P.godhavn],
  // Melville Bay, Lancaster Sound, Beechey Island (22 Aug 1903)
  [P.godhavn, [-56, 70.6], [-59.4, 73.4], [-61, 75.75], [-67.5, 75.2], [-76, 74.3], [-84, 74.2], [-89, 74.4], P.beechey],
  // Peel Sound, then the east side: James Ross and Rae Straits, along the south coast to the harbour
  [P.beechey, [-92.2, 74.25], [-95.6, 73.9], [-96.5, 73], [-96.5, 71.5], [-96.2, 70.5], [-96.5, 69.83], [-94.85, 68.83], [-95.4, 68.55], P.gjoa],
  // 1905: Simpson Strait, Queen Maud Gulf, Cambridge Bay, Dolphin and Union Strait, into Amundsen Gulf
  [P.gjoa, [-96.2, 68.55], [-97.5, 68.53], [-99.5, 68.3], [-102, 68.33], [-104, 68.75], [-105.05, 69.0], [-107, 68.9], [-109, 68.5], [-112, 68.2], [-114.5, 68.6], [-116.04, 69.09], [-119, 69.6], [-121.5, 70.3], [-123, 70.75]],
  // the Beaufort Sea to the third winter, off Herschel Island
  [[-123, 70.75], [-127, 70.4], [-130, 70.2], [-134, 69.8], [-137.5, 69.6], [-138.7, 69.45]],
  // 1906: past Point Barrow, the Chukchi Sea and Bering Strait to Nome
  [[-138.7, 69.45], [-141, 69.9], [-145, 70.4], [-150, 70.9], [-155, 71.6], [-156.5, 71.6], [-160, 70.9], [-163.5, 69.8], [-167.5, 68.4], [-168.5, 66.5], [-168.98, 65.75], [-167.5, 64.9], P.nome],
];
const SAIL: [number, number][] = [
  [w("06", 8), end("07")],
  [at("08"), w("08", 6)],
  [at("09"), w("12", 9)],
  [w("19", 4), w("20", 9)],
  [at("25"), w("25", 9)],
  [w("26", 9), w("27", 2)],
];
/** Franklin's way (Ep05): down Peel Sound, then the west side into the ice (ledger Ep05 F5). */
export const FRANKLIN: LL[] = [[-92.2, 74.25], [-95.6, 73.9], [-96.5, 73], [-96.5, 71.5], [-97.6, 70.6], [-98.3833, 70.0833], [-99.6, 69.4], [-99.4, 68.4]];
/** 1903–05: sledge trips north towards the Boothia Peninsula; the pole's surveyed spot has no source, so no pin. */
const SLEDGE: LL[] = [P.gjoa, [-95.6, 69.15], [-95.2, 69.75], [-94.6, 70.4]];
/** Winter 1905–06: skis, Herschel Island → Eagle (schematic; the real track is not sourced). */
const SKI: LL[] = [P.herschel, [-139.8, 68.2], [-140.6, 66.4], P.eagle];
/** The whaler came from the west, near Nelson Head (book vol. 2 ch. X); approximate, no pin. */
const WHALER: LL = [-127, 70.45];

// ------------------------------------------------------------------ camera

const KEYS: JKey[] = [
  // hook: the Canadian Arctic from Herschel Island to Baffin Bay, then down onto the harbour
  { at: 0, lon: -100, lat: 68, zoom: 12, tilt: 10, bearing: 0, push: 0.02, orbit: 0.3 },
  { at: w("04", 7) - 10, lon: -95.9, lat: 68.8, zoom: 60, tilt: 20, bearing: 0, dur: 40 },
  // Oslo, the rainy night
  { at: at("05") - 4, lon: 10.2, lat: 59.5, zoom: 60, tilt: 18, bearing: 0, dur: 40 },
  // wide before the boat leaves, then ahead of it over the Atlantic (the camera lagged the boat off screen)
  { at: w("06", 8), lon: -6, lat: 60, zoom: 20, tilt: 14, bearing: 0 },
  { at: at("07"), lon: -38, lat: 62.5, zoom: 16, tilt: 12, bearing: 0 },
  { at: end("07") - 10, lon: -52, lat: 68.5, zoom: 36, tilt: 18, bearing: 0 },
  { at: at("08") + 10, lon: -72, lat: 74.6, zoom: 30, tilt: 18, bearing: -2 },
  { at: w("08", 5), lon: -91.4, lat: 74.5, zoom: 90, tilt: 24, bearing: 2 },
  // south: Franklin's strait, then the two sides of King William Island
  { at: at("09"), lon: -96.3, lat: 72.4, zoom: 45, tilt: 18, bearing: 0 },
  { at: at("10"), lon: -97, lat: 70.0, zoom: 60, tilt: 20, bearing: 0 },
  { at: at("12"), lon: -95.7, lat: 69.0, zoom: 90, tilt: 22, bearing: 0 },
  { at: w("12", 9), lon: -95.9, lat: 68.75, zoom: 140, tilt: 24, bearing: 0 },
  // the harbour: hold still, barely a push
  { at: at("13"), lon: -95.9, lat: 68.7, zoom: 145, tilt: 24, bearing: 0, push: 0.006, orbit: 0 },
  { at: at("14"), lon: -95.4, lat: 69.4, zoom: 60, tilt: 20, bearing: 0 },
  { at: at("16"), lon: -95.9, lat: 68.8, zoom: 110, tilt: 22, bearing: 0, push: 0.008, orbit: 0 },
  { at: at("18"), lon: -97.2, lat: 69.0, zoom: 55, tilt: 18, bearing: 0 },
  // 1905: west along the coast to the whaler
  { at: at("19"), lon: -100, lat: 68.7, zoom: 40, tilt: 18, bearing: 0 },
  { at: at("20"), lon: -112, lat: 69.2, zoom: 30, tilt: 16, bearing: 0 },
  { at: w("20", 9), lon: -123.3, lat: 70.6, zoom: 70, tilt: 22, bearing: 0 },
  // quiet beat: "Vessel in sight"; no orbit, the slowest push
  { at: at("21"), lon: -123.3, lat: 70.65, zoom: 75, tilt: 22, bearing: 0, push: 0.006, orbit: 0 },
  // hold through the beat: without this key the camera drifts towards the Yukon from line 21 on
  { at: end("24") + 10, lon: -123.3, lat: 70.65, zoom: 78, tilt: 22, bearing: 0, push: 0.006, orbit: 0 },
  // iced in again off the Yukon, the skis to Eagle, Nome
  { at: at("25"), lon: -131, lat: 70, zoom: 30, tilt: 16, bearing: 0 },
  { at: w("25", 9), lon: -138.8, lat: 69.4, zoom: 60, tilt: 20, bearing: 0 },
  { at: at("26"), lon: -140, lat: 67.4, zoom: 40, tilt: 18, bearing: 0 },
  { at: w("26", 9), lon: -156, lat: 68.4, zoom: 26, tilt: 14, bearing: 0 },
  { at: at("27") + 15, lon: -165, lat: 65.2, zoom: 60, tilt: 20, bearing: 0 },
  // payoff: the Arctic route, then home to the harbour
  { at: at("28") - 4, lon: -95, lat: 68, zoom: 11, tilt: 10, bearing: 0, push: 0.015, orbit: 0.2, dur: 40 },
  { at: at("30"), lon: -95.9, lat: 68.75, zoom: 70, tilt: 20, bearing: 0, push: 0.02, dur: 40 },
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
  const franklinO = interpolate(f, [at("09"), at("09") + 8, at("11") + 10, at("12")], [0, 0.6, 0.9, 0], CLAMP)
    + interpolate(f, [at("18"), at("18") + 8, end("18"), end("18") + 10], [0, 0.8, 0.8, 0], CLAMP)
    // payoff (Bible §7.2): the way that failed comes back beside the way that worked
    + interpolate(f, [at("30"), at("30") + 12], [0, 0.85], CLAMP);
  const sledgeO = interpolate(f, [w("14", 8), w("14", 8) + 6, at("15"), at("15") + 8], [0, 1, 1, 0], CLAMP);
  const skiO = interpolate(f, [w("26", 2), w("26", 2) + 6, at("27"), at("27") + 10], [0, 1, 1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={PLATES} />
      <GeoLine pts={projectLine(cam, FRANKLIN, 0.1)} p={interpolate(f, [at("09"), end("10")], [0, 1], CLAMP)} color={RED} o={franklinO} width={6} />
      <GeoLine pts={projectLine(cam, SLEDGE, 0.05)} p={interpolate(f, [w("14", 8), end("14")], [0, 1], CLAMP)} color={J.white} o={sledgeO} width={5} />
      <GeoLine pts={projectLine(cam, SKI, 0.1)} p={interpolate(f, [w("26", 2), w("26", 8)], [0, 1], CLAMP)} color={ICE_BLUE} o={skiO} width={5} />
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
  const whaler = at2(WHALER);

  /** A place label anchored to P[key]. */
  const label = (key: keyof typeof P, name: string, from: number, to: number, size?: number, onSide?: "left" | "right") => (
    <StopLabel key={`${key}-${name}-${from}`} name={name} x={pt[key][0]} y={pt[key][1]} f={f} at={from} out={to} side={onSide ?? side(pt[key][0])} size={size} />
  );
  /** A picture card on a leader line from P[key] (only once its file is in public/). */
  const card = (key: keyof typeof P, src: keyof typeof HAVE, from: number, to: number) =>
    HAVE[src] && (
      <PhotoCard key={`${key}-${src}-${from}`} src={`${IMG}/${src}.jpg`} x={pt[key][0]} y={pt[key][1]} cx={cardX(pt[key][0])} cy={cardY(pt[key][1])} f={f} at={from} out={to} />
    );
  /** A card with no pin (the place is not sourced, or the picture is not of a place). */
  const free = (src: keyof typeof HAVE, from: number, to: number, cy = CARD_Y) =>
    HAVE[src] && <PhotoCard key={`free-${src}-${from}`} src={`${IMG}/${src}.jpg`} x={540} y={cy} cx={540} cy={cy} f={f} at={from} out={to} />;

  return (
    <AbsoluteFill>
      <CameraMotionBlur shutterAngle={180} samples={blur ? 7 : 1}>
        <MapLayer />
      </CameraMotionBlur>
      {f >= SAIL[0][0] && cam.zoom > 15 && <Vessel x={head.head[0]} y={head.head[1] - 18} heading={head.heading} f={f} zoom={cam.zoom} />}
      {/* the American whaler: a second ship coming the other way */}
      {f >= at("21") && f < at("25") && <Vessel x={whaler[0]} y={whaler[1] - 18} heading={0} f={f + 11} zoom={150} />}

      {/* ---- hook ---- */}
      {/* from the first frames (already half drawn on frame 6, the thumbnail) through "the answer is on this route" */}
      <RoutePreview legs={LEGS.map((leg) => projectLine(cam, leg, 0.3))} f={f} at={-12} out={w("04", 8)} />
      {/* on screen from the first frame: the hook number has to land inside the first 3 s (lesson E1) */}
      <BigWord text="129 MEN" f={f} at={0} out={at("02")} y={300} color={RED} />
      <SubWord text="NEVER CAME BACK" f={f} at={w("01", 3)} out={at("02")} y={525} />
      <BigWord text="7 MEN" f={f} at={w("02", 2)} out={at("03")} y={300} />
      <SubWord text="1 HERRING BOAT" f={f} at={w("02", 5)} out={at("03")} y={525} />
      <BigWord text="3 YEARS" f={f} at={w("03", 5)} out={at("04") + 10} y={300} />
      {label("gjoa", "GJOA HAVEN", w("04", 9), at("05") - 6)}
      <Ring x={pt.gjoa[0]} y={pt.gjoa[1]} f={f} at={w("04", 9)} out={at("05") - 6} />

      {/* ---- leaving ---- */}
      {label("oslo", "OSLO", w("05", 1), w("06", 8))}
      {card("oslo", "amundsen", w("05", 2), at("06") + 4)}
      <SubWord text="JUNE 1903" f={f} at={w("06", 5)} out={at("07") - 4} y={330} size={110} color={J.gold} />
      <SubWord text="5 YEARS OF FOOD" f={f} at={w("07", 9)} out={end("07") + 6} y={330} size={110} color={J.gold} />
      {label("godhavn", "GREENLAND", end("07") - 6, at("08") + 20, undefined, "left")}
      {/* left, over Wellington Channel: to the right the label sits on the snow of Devon Island */}
      {label("beechey", "BEECHEY ISLAND", w("08", 5), at("09") + 10, 60, "left")}
      <Ring x={pt.beechey[0]} y={pt.beechey[1]} f={f} at={w("08", 6)} out={at("09") + 10} color={RED} />
      {/* his last safe winter harbour (Amundsen, vol. 1 ch. III): Franklin's last winter was 1846–47, in the ice */}
      <SubWord text="LAST SAFE WINTER" f={f} at={w("08", 10)} out={at("09") - 4} y={330} size={110} color={RED} />

      {/* ---- the east side ---- */}
      <SubWord text="SAME STRAIT" f={f} at={w("09", 6)} out={at("10") - 4} y={330} size={110} />
      {/* the island name only while it is said: then the two side chips, one at a time (≤ 2 blocks) */}
      <RegionFill cam={cam} rings={regions.kwi} f={f} at={at("10")} out={w("10", 5)} kind="glow" name="KING WILLIAM ISLAND" size={70} nameAt={[-97.2, 69.0]} />
      <SubWord text="FRANKLIN: WEST" f={f} at={w("10", 6)} out={at("11")} y={330} size={110} color={RED} />
      <SubWord text="AMUNDSEN: EAST" f={f} at={at("11")} out={at("12")} y={330} size={110} color={J.gold} />
      {label("gjoa", "GJOA HAVEN", w("12", 9), at("15"), 60)}
      <SubWord text="ICED IN" f={f} at={w("12", 14)} out={at("13") - 4} y={330} size={110} color={ICE_BLUE} />

      {/* ---- the harbour (root cause) ---- */}
      <BigWord text="NEARLY 2 YEARS" f={f} at={w("13", 3)} out={at("14")} y={300} size={150} />
      <SubWord text="MAGNETIC POLE" f={f} at={w("14", 14)} out={at("15")} y={330} size={110} color={J.gold} />
      {HAVE.fullHarbour && <FullFrame src={`${IMG}/full-harbour.jpg`} f={f} at={w("15", 3)} out={end("15") + 6} />}
      <SubWord text="THE NETSILIK INUIT" f={f} at={w("15", 4)} out={at("16") - 4} y={330} size={110} color={J.gold} />
      {free("garb", at("16"), end("16") + 4)}
      <SubWord text="ANIMAL SKINS" f={f} at={w("16", 7)} out={at("17") - 4} y={1000} size={110} color={J.gold} />
      {free("snowhut", at("17"), end("17") + 4)}
      <SubWord text="SNOW HOUSES" f={f} at={w("17", 5)} out={w("17", 10)} y={1000} size={110} color={J.gold} />
      <SubWord text="SLED DOGS" f={f} at={w("17", 11)} out={at("18") - 4} y={1000} size={110} color={J.gold} />
      <SubWord text="NOT TRAINED FOR THIS" f={f} at={w("18", 3)} out={at("19") - 4} y={330} size={100} color={RED} />

      {/* ---- quiet beat: "Vessel in sight" ---- */}
      <SubWord text="AUGUST 1905" f={f} at={w("19", 1)} out={at("20") - 4} y={330} size={110} color={J.gold} />
      <BigWord text="VESSEL IN SIGHT" f={f} at={at("21")} out={at("22") + 4} y={300} size={130} />
      {free("whaler", at("22"), end("23") + 10)}

      {/* ---- iced in again, the skis, Nome ---- */}
      {/* left, over the Beaufort Sea: the boat sits on the pin and would cover a label to the right */}
      {label("herschel", "YUKON", w("25", 11), at("26") + 10, undefined, "left")}
      <SubWord text="ICED IN AGAIN" f={f} at={w("25", 2)} out={at("26") - 4} y={330} size={110} color={ICE_BLUE} />
      {label("eagle", "EAGLE", w("26", 7), w("26", 9) + 10)}
      <BigWord text="~800 KM" f={f} at={w("26", 4)} out={w("26", 9)} y={300} />
      {HAVE.fullSki && <FullFrame src={`${IMG}/full-ski.jpg`} f={f} at={w("26", 9)} out={w("27", 2)} />}
      {label("nome", "NOME", w("27", 3), at("28") - 6, undefined, "left")}
      {card("nome", "gjoa", w("27", 5), at("28") - 4)}
      {/* low: the Nome card fills the top band */}
      <BigWord text="3 YEARS" f={f} at={w("27", 6)} out={end("27")} y={1150} />

      {/* ---- payoff ---- */}
      {free("pole", w("28", 3), end("28") + 4)}
      <BigWord text="1911" f={f} at={w("28", 6)} out={end("28")} y={1000} />
      <BigWord text="3 YEARS" f={f} at={at("29")} out={at("30")} y={300} />
      <SubWord text="NEARLY 2 YEARS LEARNING" f={f} at={w("29", 5)} out={at("30")} y={525} size={84} color={J.gold} />
      {label("gjoa", "GJOA HAVEN", w("30", 1), Infinity, 60)}
      <Ring x={pt.gjoa[0]} y={pt.gjoa[1]} f={f} at={w("31", 4)} />
    </AbsoluteFill>
  );
};

/** Accent sounds (≤ 1 per beat): the hook numbers, the long flights, the rain, the ice, the whaler, the payoff. */
const SFX: { file: string; at: number; level?: number; seconds?: number }[] = [
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: w("02", 2), level: -17 },
  { file: "sfx/whoosh/whoosh-cinematic-376875.mp3", at: KEYS[2].at, level: -17 },
  { file: "sfx/amb-rain/heavy-rain-drops-2399.mp3", at: at("06"), level: -27, seconds: 6 },
  { file: "sfx/whoosh/epic-whoosh-478371.mp3", at: KEYS[4].at, level: -19 },
  { file: "sfx/hit/deep-cinematic-subtle-drum-impact-549.mp3", at: w("10", 6), level: -21 },
  { file: "sfx/creak/ship-hull-creak-3076.mp3", at: w("12", 14), level: -22, seconds: 5 },
  { file: "sfx/ping/bell-of-promise-930.mp3", at: at("21"), level: -24, seconds: 4 },
  { file: "sfx/creak/ship-hull-creak-3076.mp3", at: w("25", 2), level: -23, seconds: 4 },
  { file: "sfx/whoosh/whoosh-cinematic-5-376880.mp3", at: at("28") - 4, level: -19 },
  { file: "sfx/riser/cinematic-trailer-riser-790.mp3", at: at("29") - 70, level: -22 },
  { file: "sfx/hit/cinematic-piano-hit-567216.mp3", at: at("29"), level: -16 },
  { file: "sfx/deephit/impact-thud-291047.mp3", at: w("31", 4), level: -23 },
];

const BIG_WHOOSH = SFX.filter((s) => s.file.includes("whoosh")).map((s) => s.at);
const QUIET = [at("21") - 6, at("25") - 12];

/**
 * One small sound per visual event (Bible §6), same cue expressions as the Scene.
 * Nothing in the quiet beat (lines 21–24) except the bell above.
 * shortcut: cues are listed beside the JSX, not derived from it; see ep02-hannibal/Video.tsx.
 */
const EVENTS: [EventKind, number][] = [
  ["pen", 2],
  ["chip", w("01", 3)],
  ["chip", w("02", 5)],
  ["chip", w("03", 5)],
  ["label", w("04", 9)],
  ["label", w("05", 1)],
  ["card", w("05", 2) + 4],
  ["chip", w("06", 5)],
  ["chip", w("07", 9)],
  ["label", end("07") - 6],
  ["label", w("08", 5)],
  ["chip", w("08", 10)],
  ["chip", w("09", 6)],
  ["pen", at("10")],
  ["chip", at("11")],
  ["label", w("12", 9)],
  ["chip", w("13", 3)],
  ["pen", w("14", 8)],
  ["chip", w("14", 14)],
  ["chip", w("15", 4)],
  ["card", at("16") + 4],
  ["chip", w("16", 7)],
  ["card", at("17") + 4],
  ["chip", w("17", 5)],
  ["chip", w("17", 11)],
  ["chip", w("18", 3)],
  ["chip", w("19", 1)],
  ["chip", w("25", 2)],
  ["label", w("25", 11)],
  ["pen", w("26", 2)],
  ["chip", w("26", 4)],
  ["label", w("26", 7)],
  ["label", w("27", 3)],
  ["card", w("27", 5) + 4],
  ["chip", w("27", 6)],
  ["card", w("28", 3) + 4],
  ["chip", w("28", 6)],
  ["chip", w("29", 7)],
  ["label", w("30", 1)],
  ["ping", w("31", 4) + 8],
  ...KEYS.map((k): [EventKind, number] => ["fly", k.at]).filter(
    ([, a], i) => i > 0 && BIG_WHOOSH.every((b) => Math.abs(b - a) > 6) && (a < QUIET[0] || a > QUIET[1]),
  ),
];

/** Ambience by place: Arctic hum → the small boat at sea → Arctic wind → the harbour → the whaler → the Yukon winter → wind to the end. */
const BEDS: Bed[] = [
  { file: "amb-air/deep-cinematic-wind-hum-1177.mp3", from: 0, to: at("06") + 15, level: -33 },
  { file: "amb-ship/wooden-ship-on-the-sea-1187.mp3", from: at("06") + 60, to: at("09") + 15, level: -33 },
  { file: "amb-wind/winter-wind-loop-1175.mp3", from: at("09"), to: at("13") + 15, level: -33 },
  { file: "amb-wind/light-wind-1165.mp3", from: at("13"), to: at("19") + 15, level: -34 },
  { file: "amb-ship/wooden-ship-on-the-sea-1187.mp3", from: at("19"), to: at("21") + 15, level: -34 },
  { file: "amb-air/deep-cinematic-wind-hum-1177.mp3", from: at("21"), to: at("25") + 15, level: -31 },
  { file: "amb-wind/blizzard-cold-winds-1153.mp3", from: at("25"), to: at("27") + 15, level: -32 },
  { file: "amb-wind/winter-wind-loop-1175.mp3", from: at("27"), to: end("31") + 24, level: -34 },
];

/** Same headroom as Ep01–Ep05: the whole mix 3 dB down, mastered back to −14 LUFS by render:j. */
const TRIM_DB = -3;

/** Music dips (≈ −9 dB) under "Vessel in sight". */
const duck = (f: number) => interpolate(f, [at("21") - 10, at("21") + 10, at("25") - 8, at("25") + 4], [1, 0.35, 0.35, 1], CLAMP);

export const Amundsen: React.FC = () => (
  <AbsoluteFill>
    <Scene />
    <Handle />
    <Audio name="VO" src={staticFile("voiceover/amundsen/vo.mp3")} volume={10 ** (TRIM_DB / 20)} />
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
export const amundsenDuration = (fps: number) => Math.round((end("31") / FPS + 0.8) * fps);
