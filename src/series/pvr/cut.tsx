import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { CueProvider } from "./cues";
import { sceneRange, type Timing } from "./episode";
import { SafeGuide } from "./safe";
import { Subtitles } from "./subs";

/** Bed levels: ≈ −24 LUFS each, ~10 LU under the VO (Ep01, Lucas). */
const MUSIC = { poor: 0.38, rich: 0.35 };

type Props = {
  timing: Timing;
  /** "s1".."s8" → scene component */
  scenes: Record<string, React.FC>;
  captions: Record<string, string>;
  /** public/ path of the episode VO */
  vo: string;
  /** VO line id where the music turns from the poor bed to the rich bed */
  pivot: string;
  /** subtitles as approved before the 2026-10-08 rules (Ep01–Ep03) */
  legacySubs?: boolean;
};

/** Any episode: hard-cut scenes from the VO timing, subtitles, VO, music bed. */
export const EpisodeCut: React.FC<Props> = ({
  timing,
  scenes,
  captions,
  vo,
  pivot,
  legacySubs,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const turn = Math.round(
    timing.lines.find((l) => l.id === pivot)!.start * fps,
  );
  const fade = (f: number, a: number, b: number, level: number) =>
    interpolate(f, [a, a + 15, b - 20, b], [0, level, level, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#D9C6A3" }}>
      {Object.entries(scenes).map(([id, Scene]) => {
        const r = sceneRange(timing, id, fps);
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
      <Subtitles lines={timing.lines} captions={captions} legacy={legacySubs} />
      <Audio name="VO" src={staticFile(vo)} />
      <Audio
        name="Music (poor)"
        src={staticFile("audio/bed-dark.wav")}
        loop
        durationInFrames={turn + 10}
        volume={(f) => fade(f, 0, turn + 10, MUSIC.poor)}
      />
      <Sequence name="Music (rich)" from={turn - 5} layout="none">
        <Audio
          src={staticFile("audio/bed-bright.wav")}
          loop
          volume={(f) => fade(f, 0, durationInFrames - turn + 5, MUSIC.rich)}
        />
      </Sequence>
      <SafeGuide />
    </AbsoluteFill>
  );
};

/** Gate 4 test: one scene with its slice of the VO and subtitles. */
export const SceneTest: React.FC<
  Omit<Props, "scenes" | "pivot"> & { scene: string; Scene: React.FC }
> = ({ timing, captions, vo, scene, Scene, legacySubs }) => {
  const { fps } = useVideoConfig();
  const { from } = sceneRange(timing, scene, fps);
  const local = timing.lines.map((l) => ({
    ...l,
    start: l.start - from / fps,
    end: l.end - from / fps,
  }));
  return (
    <AbsoluteFill>
      <CueProvider value={{ cues: timing, sceneFrom: from }}>
        <Scene />
      </CueProvider>
      <Subtitles lines={local} captions={captions} legacy={legacySubs} />
      <Audio src={staticFile(vo)} trimBefore={from} />
      <SafeGuide />
    </AbsoluteFill>
  );
};
