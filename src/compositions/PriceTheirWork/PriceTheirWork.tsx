import { Audio } from "@remotion/media";
import { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../../components";
import { VERTICAL_DESIGN } from "../../config";
import { lerp, ramp, SceneContext } from "./beats";
import { Backdrop, Captions, ChapterChip, Progress } from "./overlays";
import {
  BackboneScene,
  HookScene,
  PoorMathScene,
  PoorScene,
} from "./scenes/PoorScenes";
import { OutroScene, RichMathScene } from "./scenes/EndScenes";
import {
  PivotScene,
  Step1Scene,
  Step2Scene,
  Step3Scene,
  Step4Scene,
} from "./scenes/RichScenes";
import { buildTimeline, PACING, type SceneId } from "./timeline";

const SCENES: Record<SceneId, React.FC> = {
  hook: HookScene,
  poor: PoorScene,
  poorMath: PoorMathScene,
  backbone: BackboneScene,
  pivot: PivotScene,
  step1: Step1Scene,
  step2: Step2Scene,
  step3: Step3Scene,
  step4: Step4Scene,
  richMath: RichMathScene,
  outro: OutroScene,
};

/** Cross-fades each scene in and out over the overlap window. */
const SceneShell: React.FC<{ children: React.ReactNode; fadeIn: boolean }> = ({
  children,
  fadeIn,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const overlap = Math.round(PACING.overlapSeconds * fps);
  const pin = fadeIn ? ramp(frame, 0, overlap + 2) : 1;
  const pout = ramp(frame, durationInFrames - overlap, overlap);
  return (
    <AbsoluteFill
      style={{
        opacity: pin * (1 - pout),
        scale: String(lerp(pin, 1.04, 1) * lerp(pout, 1, 0.97)),
        filter:
          pin < 1 || pout > 0
            ? `blur(${(1 - pin) * 10 + pout * 10}px)`
            : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * "Price Their Work": 9:16 explainer. Every visual cue is derived from the
 * voiceover timeline (src/voiceover/price-their-work.json), so regenerating
 * the voice re-times the whole video automatically.
 */
export const PriceTheirWork: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const timeline = useMemo(() => buildTimeline(fps), [fps]);
  const pivot = timeline.scenes.find((s) => s.id === "pivot")!;
  const lastScene = timeline.scenes[timeline.scenes.length - 1];

  return (
    <AbsoluteFill>
      <Backdrop timeline={timeline} />
      <Stage design={VERTICAL_DESIGN}>
        {timeline.scenes.map((scene, i) => {
          const Scene = SCENES[scene.id];
          return (
            <Sequence
              key={scene.id}
              name={`Scene: ${scene.id}`}
              from={scene.from}
              durationInFrames={
                scene === lastScene
                  ? durationInFrames - scene.from
                  : scene.durationInFrames
              }
            >
              <SceneContext.Provider
                value={{ timeline, sceneFrom: scene.from }}
              >
                <SceneShell fadeIn={i > 0}>
                  <Scene />
                </SceneShell>
              </SceneContext.Provider>
            </Sequence>
          );
        })}
        <Progress timeline={timeline} />
        <ChapterChip timeline={timeline} />
        <Captions timeline={timeline} />
      </Stage>

      {/* Voiceover, one clip per line at its timeline position */}
      {timeline.lines.map((line) => (
        <Audio
          key={line.id}
          name={`VO ${line.id}`}
          src={staticFile(line.src)}
          from={line.from}
          durationInFrames={line.durationInFrames + 2}
          // Headroom so voice + music + SFX never clip
          volume={0.82}
        />
      ))}

      {/* Music: dark bed for the poor half, bright bed from the pivot */}
      <Audio
        name="Music (dark)"
        src={staticFile("audio/bed-dark.wav")}
        loop
        durationInFrames={pivot.voiceFrom + 6}
        volume={(f) =>
          interpolate(
            f,
            [0, 12, pivot.voiceFrom - 40, pivot.voiceFrom - 4],
            [0, 0.13, 0.13, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          )
        }
      />
      <Sequence
        name="Riser"
        from={pivot.voiceFrom - Math.round(1.8 * fps)}
        layout="none"
      >
        <Audio src={staticFile("audio/riser.wav")} volume={0.45} />
      </Sequence>
      <Sequence name="Music (bright)" from={pivot.voiceFrom} layout="none">
        <Audio
          src={staticFile("audio/bed-bright.wav")}
          loop
          volume={(f) =>
            interpolate(
              f,
              [
                0,
                6,
                durationInFrames - pivot.voiceFrom - 50,
                durationInFrames - pivot.voiceFrom - 2,
              ],
              [0, 0.14, 0.14, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      </Sequence>
    </AbsoluteFill>
  );
};
