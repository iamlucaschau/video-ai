/**
 * Style test H "Paper Dossier": "The Radium Girls".
 * Original script (kich-ban-h-radium-girls-FINAL.md), loop ending: line 14
 * runs into line 01, and the last beat returns to the opening frame.
 */
import { AbsoluteFill } from "remotion";
import timing from "../../../src/voiceover/h-radium-girls.timing.json";
import { useCues } from "../../../src/series/pvr/cues";
import { EpisodeCut } from "../../../src/series/pvr/cut";
import { episodeDuration } from "../../../src/series/pvr/episode";
import { SfxCues, type SfxCue } from "../../../src/series/pvr/sfx";
import { CANVAS, CX, prog } from "../../kit-common";
import {
  Atom, Brush, Bust, Doc, DOSSIER, Engraving, Jar, Jaw, MarkerCircle, PaperBg, Stamp, Stat, Tape, Watch,
} from "../paper-dossier";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
    <Engraving />
    {children}
  </svg>
);

/** Opening frame (also the last beat): the glowing jar, a brush and a dial. */
const Opening: React.FC = () => (
  <AbsoluteFill>
    <PaperBg />
    <Svg>
      <Jar x={330} y={1060} s={1.1} />
      <Brush x={500} y={700} s={1.0} rot={-12} />
      <Watch x={720} y={760} r={150} glow={0.9} />
    </Svg>
  </AbsoluteFill>
);

const S1: React.FC = () => {
  const { frame: f, at } = useCues();
  return (
    <AbsoluteFill>
      <Opening />
      <Svg>
        <Tape text={'"SAFE"'} f={f} at={at("01", 0.35)} y={420} size={90} />
        <MarkerCircle x={CX} y={420} rx={190} ry={95} p={prog(f, at("01", 0.6), 16)} />
      </Svg>
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const { frame: f, at } = useCues();
  const night = prog(f, at("02", 0.62), 20) * (1 - prog(f, at("03"), 8));
  const step = (k: number) => prog(f, at("04", k * 0.3), 6);
  return (
    <AbsoluteFill>
      <PaperBg dark={night} />
      <Svg>
        <g opacity={1 - prog(f, at("03"), 6)}>
          <Watch x={CX} y={900} r={200} glow={0.4 + 0.6 * night} paint={prog(f, at("02", 0.3), 50)} />
        </g>
        <Stat text="1917" f={f} at={at("02", 0.02)} out={at("02", 0.6)} y={400} />
        <Tape text="NEW JERSEY" f={f} at={at("02", 0.2)} out={at("02", 0.6)} y={470} rot={1.5} />
        <Tape text="READ IN THE DARK" f={f} at={at("02", 0.7)} out={at("03")} y={450} color={DOSSIER.accent} />
        {/* lip → dip → paint */}
        <g opacity={prog(f, at("03"), 6)}>
          <Brush x={230} y={720} s={0.95} rot={-10} />
          <g opacity={step(1)}>
            <Jar x={CX} y={1020} s={0.8} />
          </g>
          <g opacity={step(2)}>
            <Watch x={780} y={860} r={120} glow={0.8} />
          </g>
        </g>
        <Tape text="SHAPED WITH LIPS" f={f} at={at("03", 0.45)} out={at("04")} y={450} />
        <Tape text="LIP · DIP · PAINT" f={f} at={at("04", 0.05)} y={450} color={DOSSIER.accent} size={60} />
      </Svg>
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const { frame: f, at } = useCues();
  const jawOn = 1 - prog(f, at("07"), 6);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Svg>
        <g opacity={jawOn}>
          <Jaw x={CX} y={860} s={1.25} dots={prog(f, at("05", 0.2), 50)} crumble={prog(f, at("06", 0.5), 30)} />
        </g>
        <Tape text="RADIUM IN BONE" f={f} at={at("05", 0.3)} out={at("06")} y={450} />
        <Tape text="LIKE CALCIUM" f={f} at={at("05", 0.65)} out={at("06")} y={1110} rot={1.5} />
        <Tape text="JAWS CRUMBLED" f={f} at={at("06", 0.55)} out={at("07")} y={450} color={DOSSIER.accent} />
        <g opacity={prog(f, at("07"), 6)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Bust key={i} x={CX + (i - 2) * 175} y={860} s={1.05}
              gone={i === 1 || i === 3 ? prog(f, at("07", 0.3 + i * 0.1), 12) : 0} />
          ))}
        </g>
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
          <Doc x={CX} y={860} w={560} h={640} rot={-2} />
          <Stamp text="OTHER CAUSES" f={f} at={at("08", 0.45)} x={CX} y={900} rot={-10} />
        </g>
        <g opacity={report}>
          <Doc x={CX - 20} y={900} w={560} h={600} rows={8} rot={2} />
          <Jaw x={CX - 20} y={930} s={0.6} dots={1} />
          <MarkerCircle x={CX - 20} y={930} rx={230} ry={110} p={prog(f, at("09", 0.6), 16)} />
        </g>
        <Stat text="1925" f={f} at={at("09", 0.05)} y={470} />
        <Tape text="RADIUM" f={f} at={at("09", 0.7)} x={CX + 150} y={1180} color={DOSSIER.accent} rot={3} />
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
      <Svg>
        <g opacity={1 - money}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} opacity={prog(f, at("10", 0.25) + i * 4, 5)}>
              <Bust x={CX + (i - 2) * 175} y={880} s={1.05} />
            </g>
          ))}
        </g>
        <Stat text="1927" f={f} at={at("10", 0.05)} out={at("11")} y={470} />
        <Tape text="5 WOMEN SUED" f={f} at={at("10", 0.55)} out={at("11")} y={1110} color={DOSSIER.accent} />
        <Stat text="$10,000" f={f} at={at("11", 0.08)} y={800} size={190} />
        <Tape text="EACH" f={f} at={at("11", 0.25)} out={at("11", 0.62)} y={900} color={DOSSIER.accent} />
        <Tape text="+ $600 A YEAR" f={f} at={at("11", 0.65)} y={900} color={DOSSIER.accent} />
        <Stamp text="SETTLED" f={f} at={at("11", 0.85)} x={CX + 120} y={1100} rot={-12} />
      </Svg>
    </AbsoluteFill>
  );
};

const S6: React.FC = () => {
  const { frame: f, at } = useCues();
  if (f >= at("14")) return <Opening />;
  const atom = prog(f, at("13"), 6);
  const limit = prog(f, at("12", 0.55), 20);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Svg>
        <g opacity={1 - atom}>
          <g stroke={DOSSIER.ink} strokeWidth={5} fill="none">
            <line x1={160} y1={1180} x2={880} y2={1180} />
            <line x1={160} y1={1180} x2={160} y2={600} />
          </g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={210 + i * 110} y={1180 - (120 + i * 70) * prog(f, at("12", 0.1) + i * 3, 10)}
              width={70} height={(120 + i * 70) * prog(f, at("12", 0.1) + i * 3, 10)}
              fill={i > 2 ? DOSSIER.accent : "url(#dz-cross)"} stroke={DOSSIER.ink} strokeWidth={4} />
          ))}
          <line x1={160} y1={900} x2={160 + 720 * limit} y2={900} stroke={DOSSIER.accent} strokeWidth={8} strokeDasharray="24 14" />
        </g>
        <Tape text="SAFETY LIMITS" f={f} at={at("12", 0.6)} out={at("13")} y={470} color={DOSSIER.accent} />
        <g opacity={atom}>
          <Atom x={CX} y={840} r={300} f={f} />
        </g>
        <Tape text="ATOMIC AGE" f={f} at={at("13", 0.6)} y={470} />
      </Svg>
    </AbsoluteFill>
  );
};

const CAPTIONS: Record<string, string> = {
  "14": "They exist because, a century ago…",
  "02": "In 1917, young women in New Jersey painted watch dials with radium, so soldiers could read the time in the dark.",
  "09": "In 1925, a medical examiner tied the deaths to radium.",
  "10": "In 1927, 5 of the women sued.",
  "11": "They settled for $10,000 each, and $600 a year for life.",
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
      captions={CAPTIONS} vo="voiceover/h-radium-girls/vo.mp3" />
    <SfxCues timing={timing} cues={SFX} />
  </AbsoluteFill>
);

export const hRadiumGirlsDuration = (fps: number) => episodeDuration(timing, fps);
