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
import {
  FMicrowave,
  fMicrowaveDuration,
} from "../Style Library/F-atomic-retro/f-microwave/Video";
import {
  GRoundWindows,
  gRoundWindowsDuration,
} from "../Style Library/G-hologram-hud/g-round-windows/Video";
import {
  HRadiumGirls,
  hRadiumGirlsDuration,
} from "../Style Library/H-paper-dossier/h-radium-girls/Video";
import { JAeneas, jAeneasDuration } from "../Style Library/J-satellite-journey/j-aeneas/Video";
import { JAeneasFull, jAeneasFullDuration } from "../Style Library/J-satellite-journey/j-aeneas-full/Video";
import { ArmyTest, armyTestDuration } from "../Style Library/J-satellite-journey/kit-army-test";
import { Hannibal, hannibalDuration } from "../Mapped Journeys/episodes/ep02-hannibal/Video";
import { Magellan, magellanDuration } from "../Mapped Journeys/episodes/ep03-magellan/Video";
import { Xuanzang, xuanzangDuration } from "../Mapped Journeys/episodes/ep04-xuanzang/Video";
import { Franklin, franklinDuration } from "../Mapped Journeys/episodes/ep05-franklin/Video";
import { Amundsen, amundsenDuration } from "../Mapped Journeys/episodes/ep06-amundsen/Video";
import { MJ_COVERS, MJCover } from "../Mapped Journeys/covers";
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
import { Ambush, ambushDuration } from "./compositions/Ambush/Ambush";
import { AmbushThumbnail, type ThumbVariant } from "./compositions/Ambush/Thumbnail";

/**
 * Every renderable video is registered here. The `id` is what you pass to
 * `npx remotion render <id>` and what appears in the Studio sidebar.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Style-Tests">
        <Composition
          id="Style-F-AtomicRetro-Microwave"
          component={FMicrowave}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={fMicrowaveDuration(PVR.fps)}
        />
        <Composition
          id="Style-G-HologramHUD-RoundWindows"
          component={GRoundWindows}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={gRoundWindowsDuration(PVR.fps)}
        />
        <Composition
          id="Style-H-PaperDossier-RadiumGirls"
          component={HRadiumGirls}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={hRadiumGirlsDuration(PVR.fps)}
        />
        <Composition
          id="Style-J-SatelliteJourney-Aeneas"
          component={JAeneas}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={jAeneasDuration(PVR.fps)}
        />
        <Composition
          id="Style-J-SatelliteJourney-AeneasFull"
          component={JAeneasFull}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={jAeneasFullDuration(PVR.fps)}
        />
        <Composition
          id="Style-J-Kit-ArmyTest"
          component={ArmyTest}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={armyTestDuration}
        />
        <Composition
          id="MJ-ep02-hannibal"
          component={Hannibal}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={hannibalDuration(PVR.fps)}
        />
        <Composition
          id="MJ-ep03-magellan"
          component={Magellan}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={magellanDuration(PVR.fps)}
        />
        <Composition
          id="MJ-ep04-xuanzang"
          component={Xuanzang}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={xuanzangDuration(PVR.fps)}
        />
        <Composition
          id="MJ-ep05-franklin"
          component={Franklin}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={franklinDuration(PVR.fps)}
        />
        <Composition
          id="MJ-ep06-amundsen"
          component={Amundsen}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={amundsenDuration(PVR.fps)}
        />
      </Folder>
      <Folder name="MJ-Covers">
        {MJ_COVERS.flatMap((spec) =>
          (["A", "B", "C"] as const).map((v) => (
            <Composition key={`${spec.slug}-${v}`} id={`MJ-Cover-${spec.slug}-${v}`} component={MJCover} defaultProps={{ slug: spec.slug, variant: v }}
              width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
          )),
        )}
      </Folder>
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

      {/* One-off 16:9 tactical explainer (Test/ambush) */}
      <Composition id="Ambush-HowAmbushesWork" component={Ambush} width={1920} height={1080} fps={30} durationInFrames={ambushDuration} defaultProps={{ subtitles: true }} />
      <Composition id="Ambush-Thumbnail" component={AmbushThumbnail} width={1920} height={1080} fps={30} durationInFrames={1} defaultProps={{ variant: "a" as ThumbVariant }} />

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
