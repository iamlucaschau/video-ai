/**
 * Mapped Journeys covers (Shorts thumbnails, 1080×1920; upgrade B6). Three style options for Lucas
 * to pick from (2026-10-30), Ep02 first:
 *   A "Map hero"   — the whole route on the satellite map, the hook number on top
 *   B "Scene hero" — the AI peak frame full-bleed, hook on top, the route as an inset card
 *   C "Split"      — peak frame above, route map below, the contrast on the seam
 * The map is drawn from the episode's own route data (not a frozen video frame: those carry the
 * video's chips and motion blur). Hooks use only the episode's sourced numbers.
 * Render: npx remotion still MJ-Cover-<slug>-<v> out/cover.png, then JPG (< 2 MB) into the episode folder.
 * Text stays in y 220–1300: the Shorts shelf crops the edges and YouTube lays the title over the bottom.
 */
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT } from "../Style Library/kit-common";
import { GeoLine, GlowRoute, J, type JCam, type Plate, project, projectLine, Ring, SatMap } from "../Style Library/J-satellite-journey/satellite-journey";
import * as Ep02 from "./episodes/ep02-hannibal/Video";
import * as Ep03 from "./episodes/ep03-magellan/Video";
import * as Ep04 from "./episodes/ep04-xuanzang/Video";
import * as Ep05 from "./episodes/ep05-franklin/Video";

export type Variant = "A" | "B" | "C";
type Line = { text: string; punch?: boolean };
type CoverSpec = {
  slug: string;
  plates: Plate[];
  legs: [number, number][][];
  direct: [number, number][];
  theoryFrom: number;
  /** the one place to look at: a gold ring */
  focus: [number, number];
  cam: JCam;
  peak: string;
  hook: Line[];
  seam: [string, string];
  name: string;
};

export const MJ_COVERS: CoverSpec[] = [
  // ledger G1 (5 months, Polybius 3.56.3) vs G3 (~2 weeks by sea, our estimate)
  {
    slug: "ep02-hannibal",
    plates: Ep02.PLATES,
    legs: Ep02.LEGS,
    direct: Ep02.DIRECT,
    theoryFrom: Ep02.THEORY_FROM,
    focus: Ep02.P.pass,
    cam: { lon: 5.6, lat: 41.6, zoom: 70, tilt: 14, bearing: 0 },
    peak: "images/hannibal/full-summit.jpg",
    hook: [{ text: "2 WEEKS BY SEA?" }, { text: "5 MONTHS", punch: true }, { text: "OVER THE ALPS" }],
    seam: ["2 WEEKS", "5 MONTHS"],
    name: "HANNIBAL",
  },
  // ledger #2 (three or four days expected, Cameron / Bergreen) vs #1 (nearly 3 years, Pigafetta)
  {
    slug: "ep03-magellan",
    plates: Ep03.PLATES,
    legs: Ep03.LEGS,
    direct: Ep03.IMAGINED,
    theoryFrom: Infinity,
    focus: Ep03.P.mactan,
    cam: { lon: -200, lat: 22, zoom: 4.6, tilt: 8, bearing: 0 },
    peak: "images/magellan/full-strait.jpg",
    hook: [{ text: "A FEW DAYS?" }, { text: "3 YEARS", punch: true }, { text: "AROUND THE WORLD" }],
    seam: ["A FEW DAYS", "3 YEARS"],
    name: "MAGELLAN",
  },
  // ledger X2 (Chang'an → Nalanda 2,479 km, our great-circle sum) vs X1 (17 years, his own words)
  {
    slug: "ep04-xuanzang",
    plates: Ep04.PLATES,
    legs: Ep04.LEGS,
    direct: Ep04.STRAIGHT,
    theoryFrom: Infinity,
    focus: Ep04.P.nalanda,
    cam: { lon: 88, lat: 31, zoom: 17, tilt: 10, bearing: 0 },
    peak: "images/xuanzang/full-desert.jpg",
    hook: [{ text: "2,500 KM?" }, { text: "17 YEARS", punch: true }, { text: "TO INDIA AND BACK" }],
    seam: ["2,500 KM", "17 YEARS"],
    name: "XUANZANG",
  },
  // ledger F2 (food for 3 years, Wikipedia + McClintock 1859) vs F9 (1845 → Erebus 2014 = 169 years)
  {
    slug: "ep05-franklin",
    plates: Ep05.PLATES,
    legs: Ep05.LEGS,
    direct: Ep05.EAST,
    theoryFrom: Infinity,
    focus: Ep05.P.erebus,
    cam: { lon: -72, lat: 71, zoom: 12, tilt: 10, bearing: 0 },
    peak: "images/franklin/full-ice.jpg",
    hook: [{ text: "3 YEARS OF FOOD" }, { text: "169 YEARS", punch: true }, { text: "TO FIND THEM" }],
    seam: ["3 YEARS", "169 YEARS"],
    name: "FRANKLIN",
  },
];

/** Largest size ≤ max that fits a 940 px column (Bricolage 800 caps ≈ 0.62 em per character). */
const fit = (text: string, max: number) => Math.min(max, Math.floor(940 / (text.length * 0.62)));

const Hook: React.FC<{ lines: Line[]; top: number }> = ({ lines, top }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    {lines.map((l, i) => (
      <div
        key={i}
        style={{
          fontFamily: FONT, fontWeight: 800, lineHeight: 1.05, whiteSpace: "nowrap", textAlign: "center",
          fontSize: fit(l.text, l.punch ? 230 : 96), color: l.punch ? J.gold : J.white,
          WebkitTextStroke: `${l.punch ? 20 : 14}px ${J.ink}`, paintOrder: "stroke fill", textShadow: "0 12px 30px rgba(0,0,0,0.65)",
        }}
      >
        {l.text}
      </div>
    ))}
  </div>
);

/** The whole route (finished), the faint "should have" sea route, a gold ring on the focus. */
const RouteMap: React.FC<{ spec: CoverSpec }> = ({ spec }) => {
  const { cam } = spec;
  const [fx, fy] = project(cam, ...spec.focus);
  return (
    <AbsoluteFill>
      <SatMap cam={cam} plates={spec.plates} />
      <GeoLine pts={projectLine(cam, spec.direct)} p={1} color={J.gold} o={0.85} width={5} />
      <GlowRoute legs={spec.legs.map((leg) => projectLine(cam, leg))} current={spec.legs.length} p={1} theoryFrom={spec.theoryFrom} />
      <Ring x={fx} y={fy} f={60} at={0} color={J.gold} />
    </AbsoluteFill>
  );
};

const Brand: React.FC<{ top?: number }> = ({ top = 1330 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, letterSpacing: 4, color: J.white, padding: "8px 30px", borderRadius: 40, background: "rgba(11,20,36,0.85)", border: `5px solid ${J.gold}` }}>
      MAPPED JOURNEYS
    </div>
  </div>
);

const Peak: React.FC<{ src: string; top?: number }> = ({ src, top = 0 }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", top, width: 1080, height: 1920, objectFit: "cover" }} />
);

/** Props must be JSON, so compositions pass the slug + variant only. */
export const MJCover: React.FC<{ slug: string; variant: Variant }> = ({ slug, variant }) => {
  const spec = MJ_COVERS.find((c) => c.slug === slug)!;
  if (variant === "A")
    return (
      <AbsoluteFill style={{ backgroundColor: J.ink }}>
        {/* map pushed down so the Alps and the ring sit under the hook, not behind it */}
        <AbsoluteFill style={{ top: 260 }}>
          <RouteMap spec={spec} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(rgba(11,20,36,0.95) 0%, rgba(11,20,36,0.6) 24%, rgba(11,20,36,0) 36%)" }} />
        <Hook lines={spec.hook} top={240} />
        <Brand />
      </AbsoluteFill>
    );
  if (variant === "B")
    return (
      <AbsoluteFill style={{ backgroundColor: J.ink }}>
        <Peak src={spec.peak} />
        <AbsoluteFill style={{ background: "linear-gradient(rgba(11,20,36,0.85) 0%, rgba(11,20,36,0.4) 28%, rgba(11,20,36,0) 42%, rgba(11,20,36,0) 62%, rgba(11,20,36,0.7) 100%)" }} />
        <Hook lines={spec.hook} top={240} />
        {/* the route as a card: the map's middle band, scaled down */}
        <div style={{ position: "absolute", left: 575, top: 900, width: 430, height: 380, overflow: "hidden", borderRadius: 22, border: `6px solid ${J.white}`, boxShadow: "0 14px 40px rgba(0,0,0,0.6)", rotate: "3deg" }}>
          <div style={{ position: "absolute", left: -55, top: -235, width: 1080, height: 1920, scale: "0.5", transformOrigin: "0 0" }}>
            <RouteMap spec={spec} />
          </div>
        </div>
        <Brand />
      </AbsoluteFill>
    );
  // C: peak above the seam, map below it
  return (
    <AbsoluteFill style={{ backgroundColor: J.ink }}>
      <div style={{ position: "absolute", left: 0, top: 960, width: 1080, height: 960, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -380, width: 1080, height: 1920 }}>
          <RouteMap spec={spec} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 960, overflow: "hidden" }}>
        <Peak src={spec.peak} top={-330} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(rgba(11,20,36,0.8) 0%, rgba(11,20,36,0) 30%, rgba(11,20,36,0) 70%, rgba(11,20,36,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 905, height: 110, background: J.ink, borderTop: `6px solid ${J.gold}`, borderBottom: `6px solid ${J.gold}` }} />
      <Hook lines={[{ text: spec.name }]} top={250} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 910, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, color: J.white, whiteSpace: "nowrap" }}>
        {spec.seam[0]}
        <span style={{ color: J.gold, margin: "0 24px" }}>→</span>
        <span style={{ color: J.gold }}>{spec.seam[1]}</span>
      </div>
      <Brand />
    </AbsoluteFill>
  );
};
