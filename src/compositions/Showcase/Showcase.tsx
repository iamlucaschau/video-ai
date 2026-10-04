import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, Easing, staticFile, useVideoConfig } from "remotion";
import { SHOWCASE_TIMING, toFrames } from "../../config";
import type { ShowcaseProps } from "./schema";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";

/**
 * The full sample video: Intro → (slide) → Features → (fade) → Outro.
 * Scene lengths live in src/config.ts. Each scene is also registered as its
 * own composition in Root.tsx so it can be previewed in isolation.
 */
export const Showcase: React.FC<ShowcaseProps> = (props) => {
  const { fps } = useVideoConfig();

  const intro = toFrames(SHOWCASE_TIMING.introSeconds, fps);
  const features = toFrames(SHOWCASE_TIMING.featuresSeconds, fps);
  const outro = toFrames(SHOWCASE_TIMING.outroSeconds, fps);
  const transition = toFrames(SHOWCASE_TIMING.transitionSeconds, fps);
  const timing = linearTiming({
    durationInFrames: transition,
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  // Each transition starts where the previous scene's overlap begins.
  const firstCut = intro - transition;
  const secondCut = intro + features - 2 * transition;

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={intro}>
          <IntroScene {...props} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={timing}
        />
        <TransitionSeries.Sequence name="Features" durationInFrames={features}>
          <FeaturesScene {...props} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence name="Outro" durationInFrames={outro}>
          <OutroScene {...props} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* Whooshes synced to the transitions (starts slightly early so the peak lands mid-transition) */}
      {props.soundEffects ? (
        <>
          <Audio
            name="Whoosh 1"
            src={staticFile("audio/whoosh.wav")}
            from={Math.max(0, firstCut - toFrames(0.15, fps))}
            volume={0.7}
          />
          <Audio
            name="Whoosh 2"
            src={staticFile("audio/whoosh.wav")}
            from={Math.max(0, secondCut - toFrames(0.15, fps))}
            volume={0.5}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
