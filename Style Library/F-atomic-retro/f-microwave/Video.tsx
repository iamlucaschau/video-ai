/**
 * Style test F "Atomic Retro": "The chocolate bar that invented the microwave".
 * Original script (kich-ban-f-microwave-FINAL.md), loop ending: line 14 runs
 * into line 01, and the last beat returns to the opening frame.
 * v2: illustrations by Lucas (image-prompts.md) as plates + cut-outs; numbers,
 * plaques, isotype, waves and molecule stay vector.
 */
import { AbsoluteFill } from "remotion";
import timing from "../../../src/voiceover/f-microwave.timing.json";
import words from "../../../src/voiceover/f-microwave.words.json";
import { useCues } from "../../../src/series/pvr/cues";
import { EpisodeCut } from "../../../src/series/pvr/cut";
import { episodeDuration } from "../../../src/series/pvr/episode";
import { SfxCues, type SfxCue } from "../../../src/series/pvr/sfx";
import { KaraokeSubs } from "../../subs";
import { CANVAS, CX, prog } from "../../kit-common";
import {
  Backdrop, BigNumber, Burst, Cutout, Dish, GROUND, House, Plaque, RetroBg, RETRO, Shadow,
  Waves, WaterMolecule, RetroSub,
} from "../atomic-retro";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={CANVAS.width} height={CANVAS.height} style={{ position: "absolute" }}>
    {children}
  </svg>
);

const IMG = "images/f-microwave";

/** The opening frame (also the last beat, so the replay joins seamlessly). */
const Opening: React.FC<{ f: number; melt?: number }> = ({ f, melt = 0 }) => (
  <AbsoluteFill>
    <RetroBg color={RETRO.teal} f={f} ground={RETRO.tealDeep} />
    <Svg>
      <Shadow x={CX} w={420} />
    </Svg>
    <Cutout src={`${IMG}/cut/f-01-engineer.png`} x={CX} bottom={GROUND + 10} height={860} o={1 - melt} />
    <Cutout src={`${IMG}/cut/f-02-engineer-melting.png`} x={CX} bottom={GROUND + 10} height={860} o={melt} />
  </AbsoluteFill>
);

const S1: React.FC = () => {
  const { frame: f, at } = useCues();
  return (
    <AbsoluteFill>
      <Opening f={f} melt={prog(f, at("01", 0.6), 8)} />
      <Svg>
        <BigNumber text="1945" f={f} at={at("01", 0.08)} out={at("02")} y={350} size={150} />
        <Plaque text="NO STOVE" f={f} at={at("02", 0.1)} y={330} />
      </Svg>
    </AbsoluteFill>
  );
};

/** Radar lab plate: magnetron on the bench at about (715, 770). */
const S2: React.FC = () => {
  const { frame: f, at } = useCues();
  const eng = prog(f, at("04"), 10) * (1 - prog(f, at("05"), 6));
  const corn = prog(f, at("06", 0.05), 8);
  return (
    <AbsoluteFill>
      <Backdrop src={`${IMG}/f-03-radar-lab.png`} />
      <Cutout src={`${IMG}/cut/f-02-engineer-melting.png`} x={270} bottom={1260} height={780} enter={eng} o={eng} />
      <Cutout src={`${IMG}/cut/f-04-popcorn.png`} x={300} bottom={1230} height={440} enter={corn} o={corn} />
      <Svg>
        {/* waves travel from the magnetron towards the snack (leftwards) */}
        <g style={{ rotate: "180deg", transformOrigin: "640px 780px" }}>
          <Waves x={640} y={780} f={f} o={prog(f, at("04"), 12)} reach={260} color={RETRO.coral} />
        </g>
        <Plaque text="MAGNETRON" f={f} at={at("03", 0.1)} out={at("03", 0.55)} y={300} />
        <Plaque text="WARTIME RADAR" f={f} at={at("03", 0.6)} out={at("04")} y={300} />
        <Plaque text="INVISIBLE WAVES" f={f} at={at("04", 0.15)} out={at("05")} y={300} />
        <Plaque text="POPCORN" f={f} at={at("05", 0.3)} out={at("06")} y={300} />
        <Burst text="POP!" f={f} at={at("06", 0.1)} x={620} y={420} r={150} />
      </Svg>
    </AbsoluteFill>
  );
};

/** Restaurant plate: the Radarange cabinet stands at x 40–560, y 460–1560. */
const S3: React.FC = () => {
  const { frame: f, at } = useCues();
  const plate = 1 - prog(f, at("09"), 6);
  return (
    <AbsoluteFill>
      <Backdrop src={`${IMG}/f-05-radarange.png`} o={plate} />
      <AbsoluteFill style={{ opacity: 1 - plate }}>
        <RetroBg color={RETRO.paper} f={f} ornament={RETRO.teal} ground="#E3D3AC" />
        <Cutout src={`${IMG}/cut/f-07-dinner.png`} x={230} bottom={820} height={250} enter={prog(f, at("09", 0.05), 8)} />
        <Cutout src={`${IMG}/cut/f-08-ship.png`} x={650} bottom={820} height={200} enter={prog(f, at("09", 0.25), 8)} />
        <Cutout src={`${IMG}/cut/f-09-house.png`} x={CX} bottom={1220} height={330} enter={prog(f, at("09", 0.45), 8)} />
        <Svg>
          <g stroke={RETRO.accent} strokeWidth={18} strokeLinecap="round" opacity={0.92}>
            <line x1={CX - 190} y1={900} x2={CX - 190 + 380 * prog(f, at("09", 0.62), 8)} y2={900 + 300 * prog(f, at("09", 0.62), 8)} />
            <line x1={CX + 190} y1={900} x2={CX + 190 - 380 * prog(f, at("09", 0.7), 8)} y2={900 + 300 * prog(f, at("09", 0.7), 8)} />
          </g>
        </Svg>
      </AbsoluteFill>
      <Svg>
        <BigNumber text="1947" f={f} at={at("07", 0.55)} out={at("08")} y={380} size={170} fill={RETRO.mustard} />
        <Plaque text="6 FT" f={f} at={at("08", 0.2)} out={at("09")} x={300} y={330} />
        <Plaque text="750 LB" f={f} at={at("08", 0.6)} out={at("09")} x={680} y={330} color={RETRO.accent} />
        <Plaque text="NOT HOMES" f={f} at={at("09", 0.55)} y={400} color={RETRO.accent} />
      </Svg>
    </AbsoluteFill>
  );
};

/** 1967 kitchen plate: the countertop oven sits at about (756, 1040). */
const S4: React.FC = () => {
  const { frame: f, at } = useCues();
  const iso = prog(f, at("11"), 6);
  return (
    <AbsoluteFill>
      <Backdrop src={`${IMG}/f-06-kitchen-1967.png`} o={1 - iso} />
      <AbsoluteFill style={{ opacity: iso }}>
        <RetroBg color={RETRO.sky} f={f} ornament={RETRO.paper} ground="#7CBDB4" />
      </AbsoluteFill>
      <Svg>
        <BigNumber text="1967" f={f} at={at("10", 0.1)} out={at("11")} x={620} y={370} size={150} />
        <Plaque text="$495" f={f} at={at("10", 0.75)} out={at("11")} x={760} y={760} size={90} color={RETRO.accent} />
        {Array.from({ length: 10 }, (_, i) => {
          const on = i < 9 && f >= at("11", 0.35) + i * 3;
          return (
            <g key={i} opacity={iso}>
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
  const dinner = prog(f, at("13"), 6);
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
        <g opacity={dinner}>
          <Dish x={200} y={GROUND - 420} s={1.4} />
          <Waves x={350} y={GROUND - 420} f={f} reach={220} />
          <Shadow x={680} w={420} />
        </g>
        <Plaque text="WATER SPINS" f={f} at={at("12", 0.15)} out={at("12", 0.6)} y={430} />
        <Plaque text="SPIN = HEAT" f={f} at={at("12", 0.62)} out={at("13")} y={430} color={RETRO.accent} />
        <Plaque text="RADAR, FOR DINNER" f={f} at={at("13", 0.1)} out={at("14")} y={430} />
      </Svg>
      <Cutout src={`${IMG}/cut/f-07-dinner.png`} x={680} bottom={GROUND - 120} height={330} o={dinner} enter={dinner} />
    </AbsoluteFill>
  );
};

/** On-screen words per VO line: numerals, *keywords* in the accent colour. */
const CAPTIONS: Record<string, string> = {
  "01": "In 1945, a *chocolate bar* melted in an engineer's pocket.",
  "02": "Nobody had turned on a *stove*.",
  "03": "Percy Spencer was testing *magnetrons*, the tubes that powered wartime *radar*.",
  "04": "He guessed the *invisible waves* had cooked his snack.",
  "05": "So he held *popcorn* kernels up to the tube.",
  "06": "They *popped* all over the lab.",
  "07": "His company built the first *microwave oven* in 1947.",
  "08": "It stood almost 6 feet tall and weighed about 750 pounds.",
  "09": "It went to restaurants and ships, *not homes*.",
  "10": "20 years later, a *countertop* model hit stores for $495.",
  "11": "Today, more than 9 in 10 American homes have one.",
  "12": "The waves make the *water* in food spin back and forth, and that motion becomes *heat*.",
  "13": "*Radar*, pointed at *dinner*.",
  "14": "And it all *started* because…",
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
      captions={CAPTIONS} vo="voiceover/f-microwave/vo.mp3"
      subtitles={<KaraokeSubs timing={timing} words={words} captions={CAPTIONS} Skin={RetroSub} />} music="bright" />
    <SfxCues timing={timing} cues={SFX} />
  </AbsoluteFill>
);

export const fMicrowaveDuration = (fps: number) => episodeDuration(timing, fps);
