import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import timing from "../../../voiceover/buy-their-tools.timing.json";
import { CueProvider } from "../cues";
import { Subtitles } from "../subs";
import { EP01_CAPTIONS } from "./captions";
import { PVR } from "../theme";
import { Scene3 } from "./Scene3";
import {
  Scene1,
  Scene2,
  Scene4,
  Scene5,
  Scene6,
  Scene7,
  Scene8,
} from "./Scenes";

const VO = staticFile("voiceover/buy-their-tools/vo.mp3");
/** Hard cut this long before a scene's first VO line. */
const CUT_LEAD = 0.15;
/**
 * Music bed gains: each bed lands at ≈ −24 LUFS, ~10 LU under the VO
 * (−14 LUFS) — clearly audible on phones, voice stays on top.
 */
const MUSIC = { poor: 0.38, rich: 0.35 };

const SCENES: Record<string, React.FC> = {
  s1: Scene1,
  s2: Scene2,
  s3: Scene3,
  s4: Scene4,
  s5: Scene5,
  s6: Scene6,
  s7: Scene7,
  s8: Scene8,
};

/** Scene boundaries (frames) derived from the approved VO timestamps. */
export const sceneRange = (scene: string, fps: number) => {
  const lines = timing.lines.filter((l) => l.scene === scene);
  const order = [...new Set(timing.lines.map((l) => l.scene))];
  const next = order[order.indexOf(scene) + 1];
  const from =
    order[0] === scene ? 0 : Math.round((lines[0].start - CUT_LEAD) * fps);
  const end = next
    ? Math.round(
        (timing.lines.find((l) => l.scene === next)!.start - CUT_LEAD) * fps,
      )
    : Math.round((timing.durationInSeconds + PVR.tailSeconds) * fps);
  return { from, durationInFrames: end - from };
};

export const ep01Duration = (fps: number) =>
  Math.round((timing.durationInSeconds + PVR.tailSeconds) * fps);

/** Full episode: 8 hard-cut scenes, VO, printer foley (inside scenes), music bed. */
export const Ep01: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  // Music turns brighter exactly on the transition line ("Here's what a rich person does…")
  const pivot = Math.round(
    timing.lines.find((l) => l.id === "34")!.start * fps,
  );
  const fade = (f: number, a: number, b: number, level: number) =>
    interpolate(f, [a, a + 15, b - 20, b], [0, level, level, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#D9C6A3" }}>
      {Object.entries(SCENES).map(([id, Scene]) => {
        const r = sceneRange(id, fps);
        return (
          <Sequence
            key={id}
            name={`Scene ${id.slice(1)}`}
            from={r.from}
            durationInFrames={r.durationInFrames}
          >
            <CueProvider value={{ cues: timing, sceneFrom: r.from }}>
              <Scene />
            </CueProvider>
          </Sequence>
        );
      })}
      <Subtitles lines={timing.lines} captions={EP01_CAPTIONS} />
      <Audio name="VO" src={VO} />
      <Audio
        name="Music (poor)"
        src={staticFile("audio/bed-dark.wav")}
        loop
        durationInFrames={pivot + 10}
        volume={(f) => fade(f, 0, pivot + 10, MUSIC.poor)}
      />
      <Sequence name="Music (rich)" from={pivot - 5} layout="none">
        <Audio
          src={staticFile("audio/bed-bright.wav")}
          loop
          volume={(f) => fade(f, 0, durationInFrames - pivot + 5, MUSIC.rich)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

/** Gate 4 test: Scene 3 (the math board) on its own, with its slice of the VO. */
export const Ep01TestScene3: React.FC = () => {
  const { fps } = useVideoConfig();
  const { from } = sceneRange("s3", fps);
  return (
    <AbsoluteFill>
      <CueProvider value={{ cues: timing, sceneFrom: from }}>
        <Scene3 />
      </CueProvider>
      <Audio src={VO} trimBefore={from} />
    </AbsoluteFill>
  );
};
