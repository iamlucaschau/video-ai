/**
 * Style test H "Paper Dossier": "The Radium Girls".
 * Original script (kich-ban-h-radium-girls-FINAL.md), loop ending: line 14
 * runs into line 01, and the last beat returns to the opening frame.
 * v2: engravings by Lucas (image-prompts.md): white-ground plates multiplied onto
 * the paper, full-bleed plates as taped prints; tapes, stamps, numbers stay vector.
 */
import { AbsoluteFill } from "remotion";
import timing from "../../../src/voiceover/h-radium-girls.timing.json";
import words from "../../../src/voiceover/h-radium-girls.words.json";
import { useCues } from "../../../src/series/pvr/cues";
import { EpisodeCut } from "../../../src/series/pvr/cut";
import { episodeDuration } from "../../../src/series/pvr/episode";
import { SfxCues, type SfxCue } from "../../../src/series/pvr/sfx";
import { KaraokeSubs } from "../../subs";
import { CANVAS, CX, prog } from "../../kit-common";
import {
  Doc, DOSSIER, Engr, Engraving, MarkerCircle, PaperBg, Print, RadGlow, Stamp, Stat, Tape, DossierSub,
} from "../paper-dossier";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
    <Engraving />
    {children}
  </svg>
);

const IMG = "images/h-radium-girls";

/** Opening frame (also the last beat): jar, brush and watch, the paint glowing. */
const Opening: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    <PaperBg />
    <Engr src={`${IMG}/h-01-still-life.png`} x={CX} y={800} w={860} />
    <RadGlow x={276} y={843} r={150} o={0.75 + 0.15 * Math.sin(f / 9)} />
    <RadGlow x={603} y={697} r={170} o={0.55 + 0.15 * Math.sin(f / 11)} />
  </AbsoluteFill>
);

const S1: React.FC = () => {
  const { frame: f, at } = useCues();
  return (
    <AbsoluteFill>
      <Opening f={f} />
      <Svg>
        <Tape text={'"SAFE"'} f={f} at={at("01", 0.35)} y={300} size={80} />
        <MarkerCircle x={CX} y={300} rx={170} ry={78} p={prog(f, at("01", 0.6), 16)} />
      </Svg>
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const { frame: f, at } = useCues();
  const night = prog(f, at("02", 0.62), 20) * (1 - prog(f, at("03"), 8));
  const painter = 1 - prog(f, at("03"), 6);
  const lips = prog(f, at("03"), 8);
  return (
    <AbsoluteFill>
      <PaperBg dark={night} />
      <Print src={`${IMG}/h-02-dial-painter.png`} x={CX} y={850} w={600} aspect={1086 / 1448} rot={-2} o={painter}
        enter={prog(f, at("02"), 8)} />
      <RadGlow x={CX + 120} y={980} r={110 + 40 * night} o={painter * (0.35 + 0.65 * night)} />
      <Print src={`${IMG}/h-03-brush-lips.png`} x={CX} y={830} w={720} rot={1.5} o={lips} enter={lips} />
      <Svg>
        <Stat text="1917" f={f} at={at("02", 0.02)} out={at("02", 0.6)} y={360} size={150} />
        <Tape text="NEW JERSEY" f={f} at={at("02", 0.2)} out={at("02", 0.6)} y={430} rot={1.5} />
        <Tape text="READ IN THE DARK" f={f} at={at("02", 0.7)} out={at("03")} y={380} color={DOSSIER.accent} />
        <Tape text="SHAPED WITH LIPS" f={f} at={at("03", 0.45)} out={at("04")} y={380} />
        <Tape text="LIP · DIP · PAINT" f={f} at={at("04", 0.05)} y={380} color={DOSSIER.accent} size={60} />
      </Svg>
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const { frame: f, at } = useCues();
  const jaw = 1 - prog(f, at("07"), 6);
  const crumble = prog(f, at("06", 0.5), 30);
  const dots = prog(f, at("05", 0.2), 50);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Engr src={`${IMG}/h-04-mandible.png`} x={CX} y={820} w={880} o={jaw * (1 - 0.55 * crumble)} />
      {Array.from({ length: 16 }, (_, i) => (
        // radium settling along the bone body
        i / 16 < dots ? <RadGlow key={i} x={CX - 260 + ((i * 7) % 16) * 36} y={880 + 50 * Math.sin(i * 1.7)} r={46} o={jaw * 0.9} /> : null
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Print key={i} src={`${IMG}/h-05-portrait.png`} x={CX + (i - 2) * 172} y={830} w={150} aspect={1086 / 1448}
          rot={i % 2 ? 2 : -2} o={prog(f, at("07") - 4, 4)} enter={prog(f, at("07") - 4 + i, 4)}
          gone={i === 1 || i === 3 ? prog(f, at("07", 0.2 + i * 0.08), 8) : 0} />
      ))}
      <Svg>
        <g opacity={jaw}>
          <MarkerCircle x={CX + 40} y={900} rx={380} ry={170} p={prog(f, at("06", 0.55), 18)} />
        </g>
        <Tape text="RADIUM IN BONE" f={f} at={at("05", 0.3)} out={at("06")} y={380} />
        <Tape text="LIKE CALCIUM" f={f} at={at("05", 0.65)} out={at("06")} y={1150} rot={1.5} />
        <Tape text="JAWS CRUMBLED" f={f} at={at("06", 0.55)} out={at("07")} y={380} color={DOSSIER.accent} />
      </Svg>
    </AbsoluteFill>
  );
};

const S4: React.FC = () => {
  const { frame: f, at } = useCues();
  const report = prog(f, at("09"), 6);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Svg>
        <g opacity={1 - report}>
          <Doc x={CX} y={830} w={560} h={640} rot={-2} />
          <Stamp text="OTHER CAUSES" f={f} at={at("08", 0.45)} x={CX} y={870} rot={-10} />
        </g>
        <g opacity={report}>
          <Doc x={CX - 20} y={870} w={600} h={620} rows={3} rot={2} />
        </g>
      </Svg>
      <Engr src={`${IMG}/h-04-mandible.png`} x={CX - 20} y={960} w={500} o={report} />
      <Svg>
        <g opacity={report}>
          <MarkerCircle x={CX - 10} y={980} rx={240} ry={115} p={prog(f, at("09", 0.6), 16)} />
        </g>
        <Stat text="1925" f={f} at={at("09", 0.05)} y={420} size={150} />
        <Tape text="RADIUM" f={f} at={at("09", 0.7)} x={CX + 170} y={1170} color={DOSSIER.accent} rot={3} />
      </Svg>
    </AbsoluteFill>
  );
};

const S5: React.FC = () => {
  const { frame: f, at } = useCues();
  const money = prog(f, at("11"), 6);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Engr src={`${IMG}/h-06-courthouse.png`} x={CX} y={760} w={760} o={1 - money} enter={prog(f, at("10"), 8)} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Print key={i} src={`${IMG}/h-05-portrait.png`} x={CX + (i - 2) * 168} y={1110} w={140} aspect={1086 / 1448}
          rot={i % 2 ? 2.5 : -2} o={1 - money} enter={prog(f, at("10", 0.3) + i * 4, 6)} />
      ))}
      <Svg>
        <Stat text="1927" f={f} at={at("10", 0.05)} out={at("11")} y={400} size={150} />
        <Tape text="5 WOMEN SUED" f={f} at={at("10", 0.55)} out={at("11")} y={950} color={DOSSIER.accent} />
        <Stat text="$10,000" f={f} at={at("11", 0.02)} y={780} size={190} />
        <Tape text="EACH" f={f} at={at("11", 0.25)} out={at("11", 0.62)} y={880} color={DOSSIER.accent} />
        <Tape text="+ $600 A YEAR" f={f} at={at("11", 0.65)} y={880} color={DOSSIER.accent} />
        <Stamp text="SETTLED" f={f} at={at("11", 0.85)} x={CX + 120} y={1080} rot={-12} />
      </Svg>
    </AbsoluteFill>
  );
};

const S6: React.FC = () => {
  const { frame: f, at } = useCues();
  if (f >= at("14")) return <Opening f={f} />;
  const atom = prog(f, at("13"), 6);
  const limit = prog(f, at("12", 0.55), 20);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Svg>
        <g opacity={1 - atom}>
          <g stroke={DOSSIER.ink} strokeWidth={5} fill="none">
            <line x1={160} y1={1150} x2={880} y2={1150} />
            <line x1={160} y1={1150} x2={160} y2={560} />
          </g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={210 + i * 110} y={1150 - (120 + i * 70) * prog(f, at("12", 0.1) + i * 3, 10)}
              width={70} height={(120 + i * 70) * prog(f, at("12", 0.1) + i * 3, 10)}
              fill={i > 2 ? DOSSIER.accent : "url(#dz-cross)"} stroke={DOSSIER.ink} strokeWidth={4} />
          ))}
          <line x1={160} y1={870} x2={160 + 720 * limit} y2={870} stroke={DOSSIER.accent} strokeWidth={8} strokeDasharray="24 14" />
        </g>
      </Svg>
      <Engr src={`${IMG}/h-07-atom.png`} x={CX} y={820} w={820} o={atom} enter={atom} />
      <Svg>
        <Tape text="SAFETY LIMITS" f={f} at={at("12", 0.6)} out={at("13")} y={430} color={DOSSIER.accent} />
        <Tape text="ATOMIC AGE" f={f} at={at("13", 0.6)} y={380} />
      </Svg>
    </AbsoluteFill>
  );
};

/** On-screen words per VO line: numerals, *keywords* in the accent colour. */
const CAPTIONS: Record<string, string> = {
  "01": "They were told the glowing paint was *safe* enough to put in their mouths.",
  "02": "In 1917, young women in New Jersey painted watch dials with *radium*, so soldiers could read the time in the dark.",
  "03": "To keep a fine tip, they shaped each brush with their *lips*.",
  "04": "*Lip*, *dip*, *paint*.",
  "05": "Radium settles in *bone*, like calcium.",
  "06": "Within a few years, some workers' *jaws* began to crumble.",
  "07": "Some *died*.",
  "08": "The company blamed *other causes*.",
  "09": "In 1925, a medical examiner tied the deaths to *radium*.",
  "10": "In 1927, 5 of the women *sued*.",
  "11": "They settled for $10,000 each, and $600 a year for life.",
  "12": "Their bones became the data behind the first radiation *safety limits*.",
  "13": "Limits that later protected the workers of the *atomic age*.",
  "14": "They exist because, a century ago…",
};

const SFX: SfxCue[] = [
  ["click/mouse-click-351398.mp3", "01", 0.35],
  ["click/pen-click-411629.mp3", "01", 0.6],
  ["shutter/camera-shutter-199580.mp3", "02", 0.02],
  ["click/mouse-click-351398.mp3", "02", 0.2],
  ["whoosh/whoosh-cinematic-161021.mp3", "02", 0.62, 0, -20],
  ["click/mouse-click-351398.mp3", "03", 0.45],
  ["click/pen-click-411629.mp3", "04", 0.05],
  ["whoosh/simple-whoosh-382724.mp3", "05", 0, -5],
  ["click/mouse-click-351398.mp3", "05", 0.3],
  ["deephit/low-thumpy-kick-reverb-hit-494833.mp3", "06", 0.5, 0, -18],
  ["hit/cinematic-piano-hit-567216.mp3", "07", 0.4, 0, -18],
  ["whoosh/clean-whoosh-382726.mp3", "08", 0, -5],
  ["deephit/impact-thud-291047.mp3", "08", 0.45],
  ["shutter/camera-shutter-199580.mp3", "09", 0.05],
  ["click/pen-click-411629.mp3", "09", 0.6],
  ["shutter/camera-shutter-390292.mp3", "10", 0.05],
  ["click/mouse-click-351398.mp3", "10", 0.55],
  ["deephit/impact-cinematic-boom-02-487858.mp3", "11", 0.08, 0, -18],
  ["click/mouse-click-351398.mp3", "11", 0.65],
  ["deephit/impact-thud-291047.mp3", "11", 0.85],
  ["whoosh/simple-whoosh-382724.mp3", "12", 0, -5],
  ["click/mouse-click-351398.mp3", "12", 0.6],
  ["whoosh/whoosh-cinematic-sound-effect-376889.mp3", "13", 0, -5],
  ["click/mouse-click-351398.mp3", "13", 0.6],
  ["whoosh/whoosh-cinematic-5-376880.mp3", "14", 0, -5, -20],
];

export const HRadiumGirls: React.FC = () => (
  <AbsoluteFill>
    <EpisodeCut timing={timing} scenes={{ s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6 }}
      captions={CAPTIONS} vo="voiceover/h-radium-girls/vo.mp3"
      subtitles={<KaraokeSubs timing={timing} words={words} captions={CAPTIONS} Skin={DossierSub} />} />
    <SfxCues timing={timing} cues={SFX} />
  </AbsoluteFill>
);

export const hRadiumGirlsDuration = (fps: number) => episodeDuration(timing, fps);
