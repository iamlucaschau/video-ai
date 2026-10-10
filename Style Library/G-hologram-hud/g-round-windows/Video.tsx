/**
 * Style test G "Hologram HUD": "Why airplane windows have round corners".
 * Original script (kich-ban-g-round-windows-FINAL.md), loop ending: line 16
 * runs into line 01, and the last beat returns to the opening frame.
 */
import { AbsoluteFill, interpolate } from "remotion";
import timing from "../../../src/voiceover/g-round-windows.timing.json";
import words from "../../../src/voiceover/g-round-windows.words.json";
import { useCues } from "../../../src/series/pvr/cues";
import { EpisodeCut } from "../../../src/series/pvr/cut";
import { episodeDuration } from "../../../src/series/pvr/episode";
import { SfxCues, type SfxCue } from "../../../src/series/pvr/sfx";
import { KaraokeSubs } from "../../subs";
import { CANVAS, CX, FONT, prog } from "../../kit-common";
import {
  Airliner, Brackets, CabinSection, Crack, Gauge, glow, HUD, HudBg, HudLabel, HudNumber,
  StressWindow, Tank, YearRuler, HudSub,
} from "../hologram-hud";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
    {children}
  </svg>
);

const WIN = { x: CX, y: 800, w: 400, h: 580 };

/** Opening frame (also the last beat): a rounded window in focus brackets. */
const Opening: React.FC<{ f: number; bracketsAt?: number }> = ({ f, bracketsAt = -100 }) => (
  <AbsoluteFill>
    <HudBg f={f} />
    <Svg>
      <StressWindow {...WIN} radius={150} stress={0} f={f} />
      <Brackets x={WIN.x} y={WIN.y} w={WIN.w + 120} h={WIN.h + 120} f={f} at={bracketsAt} />
    </Svg>
  </AbsoluteFill>
);

const S1: React.FC = () => {
  const { frame: f, at } = useCues();
  const corners = prog(f, at("01", 0.45), 12);
  return (
    <AbsoluteFill>
      <Opening f={f} />
      <Svg>
        <g stroke={HUD.accent} strokeWidth={14} fill="none" strokeLinecap="round" opacity={corners}
          style={{ filter: glow(HUD.accent) }}>
          {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy]) => {
            const cx = WIN.x + sx * (WIN.w / 2 - 150);
            const cy = WIN.y + sy * (WIN.h / 2 - 150);
            const a0 = Math.atan2(sy, 0);
            const a1 = Math.atan2(0, sx);
            const p0 = [cx + 150 * Math.cos(a0), cy + 150 * Math.sin(a0)];
            const p1 = [cx + 150 * Math.cos(a1), cy + 150 * Math.sin(a1)];
            return <path key={`${sx}${sy}`} d={`M ${p0[0]} ${p0[1]} A 150 150 0 0 ${sx * sy > 0 ? 0 : 1} ${p1[0]} ${p1[1]}`} />;
          })}
        </g>
        <HudLabel text="ROUNDED CORNERS" f={f} at={at("01", 0.3)} out={at("02")} y={360} />
        <HudLabel text="NOT FOR STYLE" f={f} at={at("02", 0.1)} y={360} color={HUD.accent} />
      </Svg>
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const { frame: f, at } = useCues();
  const lift = prog(f, at("04"), 30);
  return (
    <AbsoluteFill>
      <HudBg f={f} />
      <Svg>
        <YearRuler from={1945} to={1960} prevYear={1945} year={1952} f={f} at={at("03", 0.05)} y={440} />
        <Airliner x={CX} y={820 - 90 * lift} s={1.0} p={prog(f, at("03", 0.2), 50)} />
        <CabinSection x={CX} y={1080} r={120} swell={lift} o={lift} />
        <HudLabel text="FIRST JET AIRLINER" f={f} at={at("03", 0.55)} out={at("04")} y={1100} />
        <HudLabel text="PRESSURIZED" f={f} at={at("04", 0.55)} y={590} color={HUD.accent} />
      </Svg>
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const { frame: f, at } = useCues();
  const brk = prog(f, at("05", 0.5), 30);
  const dim = 1 - 0.6 * prog(f, at("06"), 10);
  return (
    <AbsoluteFill>
      <HudBg f={f} />
      <Svg>
        <YearRuler from={1945} to={1960} prevYear={1952} year={1954} f={f} at={at("05", 0.02)} y={440} />
        <g opacity={dim}>
          <defs>
            <clipPath id="g-front"><rect x={0} y={0} width={CX - 40} height={1920} /></clipPath>
            <clipPath id="g-back"><rect x={CX - 40} y={0} width={1080} height={1920} /></clipPath>
          </defs>
          <g clipPath="url(#g-front)">
            <g style={{ translate: `${-25 * brk}px ${40 * brk}px`, rotate: `${-5 * brk}deg`, transformOrigin: `${CX}px 820px` }}>
              <Airliner x={CX - 10} y={820} s={0.92} color={brk > 0 ? HUD.red : HUD.amber} />
            </g>
          </g>
          <g clipPath="url(#g-back)">
            <g style={{ translate: `${25 * brk}px ${70 * brk}px`, rotate: `${6 * brk}deg`, transformOrigin: `${CX}px 820px` }}>
              <Airliner x={CX - 10} y={820} s={0.92} color={brk > 0 ? HUD.red : HUD.amber} />
            </g>
          </g>
        </g>
        <HudLabel text="2 BREAKUPS" f={f} at={at("05", 0.55)} out={at("06")} y={1100} color={HUD.red} />
        <g opacity={prog(f, at("06", 0.1), 4) * (Math.floor(f / 10) % 2 ? 1 : 0.75)}>
          <rect x={CX - 280} y={1010} width={560} height={130} fill="none" stroke={HUD.red} strokeWidth={8}
            style={{ filter: glow(HUD.red) }} />
          <text x={CX} y={1100} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={88} fill={HUD.red}
            style={{ filter: glow(HUD.red) }}>
            GROUNDED
          </text>
        </g>
      </Svg>
    </AbsoluteFill>
  );
};

const S4: React.FC = () => {
  const { frame: f, at } = useCues();
  const pumping = prog(f, at("08"), 10) * (1 - prog(f, at("09", 0.62), 4));
  const cycle = 0.5 + 0.5 * Math.sin(f / 3.2);
  const count = Math.round(
    interpolate(f, [at("08"), at("09", 0.6)], [0, 3000], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t,
    }),
  );
  const crack = prog(f, at("09", 0.62), 18);
  const detail = prog(f, at("10"), 10);
  return (
    <AbsoluteFill>
      <HudBg f={f} pedestal={0.4} />
      <Svg>
        <Tank x={CX} y={860} w={820} h={520} f={f} o={1 - detail} />
        <g style={{ scale: 1 + 0.015 * cycle * pumping, transformOrigin: `${CX}px 880px` }} opacity={1 - detail}>
          <Airliner x={CX} y={900} s={0.88} p={prog(f, at("07", 0.1), 30)} />
        </g>
        <g opacity={1 - detail}><Crack x={CX - 200} y={868} p={crack} s={0.9} r={-20} /></g>
        <g opacity={prog(f, at("08"), 8) * (1 - prog(f, at("10"), 6))}>
          <Gauge x={260} y={470} r={95} value={0.15 + 0.7 * cycle * pumping} />
          <HudNumber text={count.toLocaleString("en-US")} f={f} at={at("08")} x={660} y={470} size={130}
            color={count >= 3000 ? HUD.red : HUD.amber} />
        </g>
        <HudLabel text="WATER TANK TEST" f={f} at={at("07", 0.2)} out={at("08")} y={470} />
        <HudLabel text="FLIGHTS" f={f} at={at("08", 0.15)} out={at("10")} x={660} y={548} size={48} />
        {/* detail inset: the corner where the crack started */}
        <g opacity={detail}>
          <StressWindow x={CX + 110} y={880} w={320} h={420} radius={18} stress={0.6} f={f} />
          <Crack x={CX - 50} y={670} p={prog(f, at("10", 0.1), 20)} s={1.1} r={200} />
          <Brackets x={CX - 50} y={670} w={190} h={190} f={f} at={at("10", 0.2)} color={HUD.red} />
        </g>
        <HudLabel text="AT A CORNER" f={f} at={at("10", 0.3)} y={1150} color={HUD.red} />
      </Svg>
    </AbsoluteFill>
  );
};

const S5: React.FC = () => {
  const { frame: f, at } = useCues();
  const swellOn = 1 - prog(f, at("12"), 6);
  const sharpOn = prog(f, at("12"), 8);
  const both = prog(f, at("14"), 14);
  return (
    <AbsoluteFill>
      <HudBg f={f} />
      <Svg>
        <CabinSection x={CX} y={820} r={260} swell={0.5 + 0.5 * Math.sin(f / 5)} o={swellOn} />
        <g opacity={sharpOn}>
          <g style={{ translate: `${-200 * both}px 0px`, scale: 1 - 0.3 * both, transformOrigin: `${CX}px 820px` }}>
            <StressWindow x={CX} y={820} w={360} h={500} radius={16} stress={prog(f, at("12", 0.3), 30)} f={f} />
            <Crack x={CX - 180} y={570} p={prog(f, at("13", 0.4), 30)} s={1.2} r={-130} />
          </g>
          <g opacity={both}>
            <StressWindow x={CX + 190} y={820} w={250} h={350} radius={110} stress={both} f={f} />
          </g>
        </g>
        <HudLabel text="EVERY FLIGHT" f={f} at={at("11", 0.15)} out={at("12")} y={400} />
        <HudLabel text="STRESS PILES UP" f={f} at={at("12", 0.35)} out={at("13")} y={400} color={HUD.red} />
        <HudLabel text="METAL FATIGUE" f={f} at={at("13", 0.2)} out={at("14")} y={400} color={HUD.red} />
        <HudLabel text="SPREAD OUT" f={f} at={at("14", 0.3)} y={400} color={HUD.accent} />
      </Svg>
    </AbsoluteFill>
  );
};

const S6: React.FC = () => {
  const { frame: f, at } = useCues();
  if (f >= at("16")) return <Opening f={f} />;
  const r = interpolate(prog(f, at("15", 0.1), 24), [0, 1], [16, 150]);
  return (
    <AbsoluteFill>
      <HudBg f={f} />
      <Svg>
        <StressWindow {...WIN} radius={r} stress={0} f={f} color={r > 140 ? HUD.accent : HUD.amber} />
        <HudLabel text="ROUNDED" f={f} at={at("15", 0.4)} y={360} color={HUD.accent} />
      </Svg>
    </AbsoluteFill>
  );
};

/** On-screen words per VO line: numerals, *keywords* in the accent colour. */
const CAPTIONS: Record<string, string> = {
  "01": "Every airliner window has *rounded corners*.",
  "02": "That is *not for style*.",
  "03": "In 1952, the de Havilland *Comet* became the first *jet airliner* to carry passengers.",
  "04": "It flew high and fast, in a *pressurized* cabin.",
  "05": "Then, in 1954, two Comets *broke apart* in the sky, 3 months apart.",
  "06": "Every Comet was *grounded*.",
  "07": "Engineers put a whole Comet in a giant *water tank*.",
  "08": "They pumped the cabin *up and down*, flight after flight.",
  "09": "After about 3,000 flights' worth of pressure, the cabin *split open*.",
  "10": "The crack started at a *corner*.",
  "11": "Every flight, the cabin *swells* like a balloon.",
  "12": "A *sharp corner* piles that stress into one tiny point.",
  "13": "Metal bent there again and again gets *tired*, and cracks.",
  "14": "*Round corners* spread the stress out.",
  "15": "So the corners were *rounded*.",
  "16": "And that is why, to this day…",
};

const SFX: SfxCue[] = [
  ["click/digital-click-357350.mp3", "01", 0.45],
  ["click/keyboard-click-327728.mp3", "02", 0.1],
  ["whoosh/whoosh-short-realistic-379079.mp3", "03", 0, -5],
  ["click/keyboard-click-327728.mp3", "03", 0.55],
  ["click/keyboard-click-327728.mp3", "04", 0.55],
  ["whoosh/simple-whoosh-382724.mp3", "05", 0, -5],
  ["deephit/cinematic-low-hit-291095.mp3", "05", 0.5],
  ["hit/cinematic-impact-hit-352702.mp3", "06", 0.1, 0, -18],
  ["whoosh/simple-whoosh-382724.mp3", "07", 0, -5],
  ["click/keyboard-click-327728.mp3", "07", 0.2],
  ["progress/sharp-riser-407120.mp3", "09", 0.62, -45, -20],
  ["deephit/deep-metal-clang-87901.mp3", "09", 0.62],
  ["click/digital-click-357350.mp3", "10", 0.2],
  ["whoosh/clean-whoosh-382726.mp3", "11", 0, -5],
  ["deephit/deep-hit-175726.mp3", "12", 0.35, 0, -18],
  ["hit/ks-motion-metal-hit-351564.mp3", "13", 0.4],
  ["click/digital-click-357350.mp3", "14", 0.3],
  ["whoosh/clean-whoosh-382726.mp3", "15", 0, -5],
  ["click/digital-click-357350.mp3", "15", 0.4],
  ["whoosh/whoosh-cinematic-5-376880.mp3", "16", 0, -5, -20],
];

export const GRoundWindows: React.FC = () => (
  <AbsoluteFill>
    <EpisodeCut timing={timing} scenes={{ s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6 }}
      captions={CAPTIONS} vo="voiceover/g-round-windows/vo.mp3"
      subtitles={<KaraokeSubs timing={timing} words={words} captions={CAPTIONS} Skin={HudSub} />} />
    <SfxCues timing={timing} cues={SFX} />
  </AbsoluteFill>
);

export const gRoundWindowsDuration = (fps: number) => episodeDuration(timing, fps);
