import { Composition, Folder } from "remotion";
import {
  Ep01,
  ep01Duration,
  Ep01TestScene3,
  sceneRange,
} from "./series/pvr/ep01/Ep01";
import {
  Ep02,
  ep02Duration,
  Ep02TestScene3,
  ep02SceneRange,
} from "./series/pvr/ep02/Ep02";
import { Ep02B } from "./series/pvr/ep02b/Ep02B";
import { Ep02C } from "./series/pvr/ep02c/Ep02C";
import { Ep02D } from "./series/pvr/ep02d/Ep02D";
import { Ep02E } from "./series/pvr/ep02e/Ep02E";
import {
  Ep03,
  ep03Duration,
  Ep03TestScene3,
  ep03SceneRange,
} from "./series/pvr/ep03/Ep03";
import { PVR } from "./series/pvr/theme";
import { PriceTheirWork } from "./compositions/PriceTheirWork/PriceTheirWork";
import { buildTimeline } from "./compositions/PriceTheirWork/timeline";
import {
  getShowcaseDuration,
  SHOWCASE_TIMING,
  toFrames,
  VERTICAL,
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
      <Folder name="PoorVsRich-Ep03">
        <Composition
          id="PBR-Ep03-GetPaid"
          component={Ep03}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep03Duration(PVR.fps)}
        />
        <Composition
          id="PBR-Ep03-Test-Scene3"
          component={Ep03TestScene3}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep03SceneRange("s3", PVR.fps).durationInFrames}
        />
      </Folder>
      <Folder name="PoorVsRich-Ep02">
        <Composition
          id="PBR-Ep02-GiveDiscounts"
          component={Ep02}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep02Duration(PVR.fps)}
        />
        <Composition
          id="PBR-Ep02-GiveDiscounts-B"
          component={Ep02B}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep02Duration(PVR.fps)}
        />
        <Composition
          id="PBR-Ep02-GiveDiscounts-C"
          component={Ep02C}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep02Duration(PVR.fps)}
        />
        <Composition
          id="PBR-Ep02-GiveDiscounts-D"
          component={Ep02D}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep02Duration(PVR.fps)}
        />
        <Composition
          id="PBR-Ep02-GiveDiscounts-E"
          component={Ep02E}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep02Duration(PVR.fps)}
        />
        <Composition
          id="PBR-Ep02-Test-Scene3"
          component={Ep02TestScene3}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep02SceneRange("s3", PVR.fps).durationInFrames}
        />
      </Folder>
      <Folder name="PoorVsRich-Ep01">
        <Composition
          id="PBR-Ep01-BuyTheirTools"
          component={Ep01}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={ep01Duration(PVR.fps)}
        />
        <Composition
          id="PBR-Ep01-Test-Scene3"
          component={Ep01TestScene3}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={sceneRange("s3", PVR.fps).durationInFrames}
        />
      </Folder>

      {/* 9:16 explainer, timed by its Gemini TTS voiceover */}
      <Composition
        id="PriceTheirWork"
        component={PriceTheirWork}
        width={VERTICAL.width}
        height={VERTICAL.height}
        fps={VERTICAL.fps}
        durationInFrames={buildTimeline(VERTICAL.fps).durationInFrames}
      />

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
