/**
 * Style test F "Atomic Retro": "The chocolate bar that invented the microwave".
 * Original script (kich-ban-f-microwave-FINAL.md), loop ending: line 14 runs
 * into line 01, and the last beat returns to the opening frame.
 */
import { AbsoluteFill } from "remotion";
import timing from "../../../src/voiceover/f-microwave.timing.json";
import { useCues } from "../../../src/series/pvr/cues";
import { EpisodeCut } from "../../../src/series/pvr/cut";
import { episodeDuration } from "../../../src/series/pvr/episode";
import { SfxCues, type SfxCue } from "../../../src/series/pvr/sfx";
import { CANVAS, CX, prog } from "../../kit-common";
import {
  BigNumber, Burst, GROUND, Shadow, ChocolateBar, Countertop, Dish, Engineer, House, Magnetron, Plaque,
  Plate, Popcorn, Radarange, RetroBg, RETRO, Ship, Waves, WaterMolecule,
} from "../atomic-retro";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
    {children}
  </svg>
);

/** The opening frame (also the last beat, so the replay joins seamlessly). */
const Opening: React.FC<{ f: number; melt?: number }> = ({ f, melt = 0 }) => (
  <AbsoluteFill>
    <RetroBg color={RETRO.teal} f={f} ground={RETRO.tealDeep} />
    <Svg>
      <Shadow x={CX} w={360} />
      <Engineer x={CX} y={GROUND + 4} s={1.05} melt={melt} />
    </Svg>
  </AbsoluteFill>
);

const S1: React.FC = () => {
  const { frame: f, at } = useCues();
  return (
    <AbsoluteFill>
      <Opening f={f} melt={prog(f, at("01", 0.55), 60)} />
      <Svg>
        <BigNumber text="1945" f={f} at={at("01", 0.08)} out={at("02")} y={410} />
        <Plaque text="NO STOVE" f={f} at={at("02", 0.1)} y={380} />
      </Svg>
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const { frame: f, at } = useCues();
  const wave = prog(f, at("04"), 12);
  const choc = Math.min(prog(f, at("04"), 8), 1 - prog(f, at("05"), 8));
  return (
    <AbsoluteFill>
      <RetroBg color={RETRO.mustard} f={f} ornament={RETRO.paper} ground="#B9862A" />
      <Svg>
        <Shadow x={290} w={380} />
        <Magnetron x={290} y={GROUND - 170} s={1.4} />
        <Waves x={450} y={GROUND - 250} f={f} o={wave} reach={300} />
        <g opacity={choc}>
          <ChocolateBar x={740} y={GROUND - 260} melt={prog(f, at("04", 0.3), 50)} s={1.05} />
        </g>
        <g opacity={prog(f, at("05"), 8)}>
          <Popcorn x={720} y={GROUND - 60} f={f} at={at("06", 0.05)} s={1.4} />
        </g>
        <Plaque text="MAGNETRON" f={f} at={at("03", 0.1)} out={at("03", 0.55)} y={380} />
        <Plaque text="WARTIME RADAR" f={f} at={at("03", 0.6)} out={at("04")} y={380} />
        <Plaque text="INVISIBLE WAVES" f={f} at={at("04", 0.15)} out={at("05")} y={380} />
        <Plaque text="POPCORN" f={f} at={at("05", 0.3)} out={at("06")} y={380} />
        <Burst text="POP!" f={f} at={at("06", 0.1)} x={680} y={560} r={150} />
      </Svg>
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const { frame: f, at } = useCues();
  const scene = 1 - prog(f, at("09"), 6);
  const ruler = prog(f, at("08"), 20);
  return (
    <AbsoluteFill>
      <RetroBg color={RETRO.paper} f={f} ornament={RETRO.teal} ground="#E3D3AC" />
      <Svg>
        <g opacity={scene}>
          <Shadow x={400} w={380} />
          <Shadow x={770} w={300} />
          <Radarange x={400} y={GROUND} h={740} />
          <Engineer x={770} y={GROUND + 4} s={0.93} bar={false} />
          <g stroke={RETRO.ink} strokeWidth={6} strokeLinecap="round" opacity={ruler}>
            <line x1={170} y1={GROUND} x2={170} y2={GROUND - 740 * ruler} />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <line key={i} x1={150} y1={GROUND - i * 123} x2={190} y2={GROUND - i * 123} opacity={ruler * 6 > i ? 1 : 0} />
            ))}
          </g>
        </g>
        <BigNumber text="1947" f={f} at={at("07", 0.55)} out={at("08")} y={430} fill={RETRO.mustard} size={180} />
        <Plaque text="6 FT" f={f} at={at("08", 0.2)} out={at("09")} x={300} y={420} />
        <Plaque text="750 LB" f={f} at={at("08", 0.6)} out={at("09")} x={700} y={420} color={RETRO.accent} />
        <g opacity={prog(f, at("09"), 6)}>
          <Plate x={210} y={GROUND - 330} s={1.0} />
          <Ship x={480} y={GROUND - 340} s={1.35} />
          <House x={760} y={GROUND - 360} s={1.2} fill={RETRO.cream} cross={prog(f, at("09", 0.6), 14)} />
        </g>
        <Plaque text="NOT HOMES" f={f} at={at("09", 0.55)} y={500} color={RETRO.accent} />
      </Svg>
    </AbsoluteFill>
  );
};

const S4: React.FC = () => {
  const { frame: f, at } = useCues();
  const oven = 1 - prog(f, at("11"), 6);
  return (
    <AbsoluteFill>
      <RetroBg color={RETRO.sky} f={f} ornament={RETRO.paper} ground="#7CBDB4" />
      <Svg>
        <g opacity={oven}>
          <Shadow x={CX} w={700} />
          <Countertop x={CX} y={GROUND - 270} s={1.6} />
        </g>
        <BigNumber text="1967" f={f} at={at("10", 0.1)} out={at("11")} y={430} />
        <Plaque text="$495" f={f} at={at("10", 0.75)} out={at("11")} x={CX + 220} y={680} size={90} color={RETRO.accent} />
        {Array.from({ length: 10 }, (_, i) => {
          const on = i < 9 && f >= at("11", 0.35) + i * 3;
          return (
            <g key={i} opacity={prog(f, at("11"), 8)}>
              <House x={CX + ((i % 5) - 2) * 170} y={760 + Math.floor(i / 5) * 260} s={1.0}
                fill={on ? RETRO.accent : RETRO.paper} />
            </g>
          );
        })}
        <Plaque text="9 IN 10 HOMES" f={f} at={at("11", 0.6)} y={430} />
      </Svg>
    </AbsoluteFill>
  );
};

const S5: React.FC = () => {
  const { frame: f, at } = useCues();
  if (f >= at("14")) return <Opening f={f} />;
  const mol = 1 - prog(f, at("13"), 6);
  return (
    <AbsoluteFill>
      <RetroBg color={RETRO.teal} f={f} ground={RETRO.tealDeep} />
      <Svg>
        <g opacity={mol}>
          <Waves x={40} y={860} f={f} reach={240} />
          <g style={{ scale: 1.35, transformOrigin: "560px 860px" }}>
            <WaterMolecule x={560} y={860} f={f} amp={30 * prog(f, at("12", 0.1), 20)} heat={prog(f, at("12", 0.6), 15)} />
          </g>
        </g>
        <g opacity={prog(f, at("13"), 6)}>
          <Dish x={230} y={GROUND - 420} s={1.5} />
          <Waves x={400} y={GROUND - 420} f={f} reach={280} />
          <Plate x={700} y={GROUND - 330} s={1.25} />
        </g>
        <Plaque text="WATER SPINS" f={f} at={at("12", 0.15)} out={at("12", 0.6)} y={430} />
        <Plaque text="SPIN = HEAT" f={f} at={at("12", 0.62)} out={at("13")} y={430} color={RETRO.accent} />
        <Plaque text="RADAR, FOR DINNER" f={f} at={at("13", 0.1)} out={at("14")} y={430} />
      </Svg>
    </AbsoluteFill>
  );
};

const CAPTIONS: Record<string, string> = {
  "14": "And it all started because…",
  "01": "In 1945, a chocolate bar melted in an engineer's pocket.",
  "07": "His company built the first microwave oven in 1947.",
  "08": "It stood almost 6 feet tall and weighed about 750 pounds.",
  "10": "20 years later, a countertop model hit stores for $495.",
  "11": "Today, more than 9 in 10 American homes have one.",
};

const SFX: SfxCue[] = [
  ["deephit/impact-thud-291047.mp3", "01", 0.08],
  ["click/mouse-click-351398.mp3", "02", 0.1],
  ["whoosh/simple-whoosh-382724.mp3", "03", 0, -5],
  ["click/mouse-click-351398.mp3", "03", 0.1],
  ["whoosh/whoosh-motion-405445.mp3", "04", 0, 0, -20],
  ["hit/punch-impact-hit-567196.mp3", "06", 0.1, 0, -20],
  ["whoosh/clean-whoosh-382726.mp3", "07", 0, -5],
  ["deephit/impact-thud-291047.mp3", "07", 0.55],
  ["click/pen-click-411629.mp3", "08", 0.2],
  ["deephit/low-thumpy-kick-reverb-hit-494833.mp3", "08", 0.6, 0, -18],
  ["click/pen-click-411629.mp3", "09", 0.6],
  ["whoosh/simple-whoosh-382724.mp3", "10", 0, -5],
  ["deephit/impact-thud-291047.mp3", "10", 0.1],
  ["click/pen-click-411629.mp3", "10", 0.75],
  ["click/digital-click-357350.mp3", "11", 0.35],
  ["click/mouse-click-351398.mp3", "11", 0.6],
  ["whoosh/clean-whoosh-382726.mp3", "12", 0, -5],
  ["click/mouse-click-351398.mp3", "12", 0.62],
  ["click/mouse-click-351398.mp3", "13", 0.1],
  ["whoosh/whoosh-cinematic-5-376880.mp3", "14", 0, -5, -20],
];

export const FMicrowave: React.FC = () => (
  <AbsoluteFill>
    <EpisodeCut timing={timing} scenes={{ s1: S1, s2: S2, s3: S3, s4: S4, s5: S5 }}
      captions={CAPTIONS} vo="voiceover/f-microwave/vo.mp3" music="bright" />
    <SfxCues timing={timing} cues={SFX} />
  </AbsoluteFill>
);

export const fMicrowaveDuration = (fps: number) => episodeDuration(timing, fps);
