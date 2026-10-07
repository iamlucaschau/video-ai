import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import timing from "../../../voiceover/give-discounts.timing.json";
import { CueProvider } from "../cues";
import { episodeDuration, sceneRange } from "../episode";
import { Subtitles } from "../subs";
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
import { EP02_CAPTIONS } from "./captions";

const VO = staticFile("voiceover/give-discounts/vo.mp3");
/** Same bed levels as Ep01 (≈ −24 LUFS, ~10 LU under the VO). */
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

export const ep02SceneRange = (scene: string, fps: number) =>
  sceneRange(timing, scene, fps);
export const ep02Duration = (fps: number) => episodeDuration(timing, fps);

/** Full episode: 8 hard-cut scenes, VO, subtitles, music bed. */
export const Ep02: React.FC = () => <Ep02Cut scenes={SCENES} />;

/** The episode around any set of 8 scenes (style A = SCENES, style B = ../ep02b). */
export const Ep02Cut: React.FC<{ scenes: Record<string, React.FC> }> = ({
  scenes,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  // Music turns brighter on the transition line ("Same question. Rich person…")
  const pivot = Math.round(
    timing.lines.find((l) => l.id === "33")!.start * fps,
  );
  const fade = (f: number, a: number, b: number, level: number) =>
    interpolate(f, [a, a + 15, b - 20, b], [0, level, level, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#D9C6A3" }}>
      {Object.entries(scenes).map(([id, Scene]) => {
        const r = ep02SceneRange(id, fps);
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
      <Subtitles lines={timing.lines} captions={EP02_CAPTIONS} />
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

/** Gate 4 test: Scene 3 (the poor math) with its slice of the VO and subtitles. */
export const Ep02TestScene3: React.FC = () => {
  const { fps } = useVideoConfig();
  const { from } = ep02SceneRange("s3", fps);
  const local = timing.lines.map((l) => ({
    ...l,
    start: l.start - from / fps,
    end: l.end - from / fps,
  }));
  return (
    <AbsoluteFill>
      <CueProvider value={{ cues: timing, sceneFrom: from }}>
        <Scene3 />
      </CueProvider>
      <Subtitles lines={local} captions={EP02_CAPTIONS} />
      <Audio src={VO} trimBefore={from} />
    </AbsoluteFill>
  );
};
