import { Composition, Folder } from "remotion";
import {
  getShowcaseDuration,
  SHOWCASE_TIMING,
  toFrames,
  VIDEO,
} from "./config";
import {
  showcaseDefaults,
  showcaseSchema,
} from "./compositions/Showcase/schema";
import { Showcase } from "./compositions/Showcase/Showcase";
import { FeaturesScene } from "./compositions/Showcase/scenes/FeaturesScene";
import { IntroScene } from "./compositions/Showcase/scenes/IntroScene";
import { OutroScene } from "./compositions/Showcase/scenes/OutroScene";

/**
 * Every renderable video is registered here. The `id` is what you pass to
 * `npx remotion render <id>` and what appears in the Studio sidebar.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={getShowcaseDuration()}
        schema={showcaseSchema}
        defaultProps={showcaseDefaults}
      />

      {/* Each scene on its own timeline (connected compositions) */}
      <Folder name="Showcase-Scenes">
        <Composition
          id="Showcase-Intro"
          component={IntroScene}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={toFrames(SHOWCASE_TIMING.introSeconds)}
          schema={showcaseSchema}
          defaultProps={showcaseDefaults}
        />
        <Composition
          id="Showcase-Features"
          component={FeaturesScene}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={toFrames(SHOWCASE_TIMING.featuresSeconds)}
          schema={showcaseSchema}
          defaultProps={showcaseDefaults}
        />
        <Composition
          id="Showcase-Outro"
          component={OutroScene}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={toFrames(SHOWCASE_TIMING.outroSeconds)}
          schema={showcaseSchema}
          defaultProps={showcaseDefaults}
        />
      </Folder>
    </>
  );
};
