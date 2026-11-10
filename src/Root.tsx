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
import { KTest, kTestDuration } from "../Style Library/K-chibi-case/k-test/Video";
import { LThermopylae, lThermopylaeDuration } from "../Style Library/L-siege-atlas/l-thermopylae/Video";
import { LThermopylaeFull, lThermopylaeFullDuration } from "../Style Library/L-siege-atlas/l-thermopylae-full/Video";
import { MKit, mKitDuration } from "../Style Library/M-hoat-su/m-kit/Video";
import { MSets, mSetsDuration } from "../Style Library/M-hoat-su/m-kit/Sets";
import { MCast } from "../Style Library/M-hoat-su/m-kit/Cast";
import { Test3D } from "../Style Library/M-hoat-su/three/Test3D";
import { MTest, mTestDuration } from "../Style Library/M-hoat-su/m-test/Video";
import { MChurchill, mChurchillDuration } from "../Style Library/M-hoat-su/m-churchill/Video";
import { MDoss, mDossDuration } from "../Style Library/M-hoat-su/m-doss/Video";
import { MDoss3D, mDoss3dDuration } from "../Style Library/M-hoat-su/m-doss-3d/Video";
import { NSetsPreview, N_SETS_FRAMES } from "../Style Library/N-low-poly/n-kit/Preview";
import { NeonOddsBanner, NeonOddsLogo } from "../Style Library/N-low-poly/n-brand/Brand";
import { NMandel, nMandelDuration } from "../Style Library/N-low-poly/n-mandel/Video";
import { NMandelThumb } from "../Style Library/N-low-poly/n-mandel/Thumb";
import { OKit, oKitDuration } from "../Style Library/O-data-loop/o-kit/Video";
import { OShrike, oShrikeDuration } from "../Style Library/O-data-loop/o-shrike/Video";
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
import { Ambush, ambushDuration } from "./compositions/Ambush/Ambush";
import { AmbushThumbnail, type ThumbVariant } from "./compositions/Ambush/Thumbnail";
import { CarrierVideo, carrierDuration } from "./compositions/Carrier/Carrier";
import { CarrierThumbnail, type CarrierThumbVariant } from "./compositions/Carrier/Thumbnail";
import { SubmarinesVideo, submarinesDuration } from "./compositions/Submarines/Submarines";
import { SubmarinesThumbnail, type SubThumbVariant } from "./compositions/Submarines/Thumbnail";
import { duration as NOep01Duration, Thumb as NOep01Thumb, Video as NOep01 } from "../NEON ODDS/episodes/ep01-ivey-edge/Video";
import { duration as NOep02Duration, Thumb as NOep02Thumb, Video as NOep02 } from "../NEON ODDS/episodes/ep02-tipton-lottery/Video";
import { duration as NOep03Duration, Thumb as NOep03Thumb, Video as NOep03 } from "../NEON ODDS/episodes/ep03-slot-hack/Video";
import { duration as NOep04Duration, Thumb as NOep04Thumb, Video as NOep04 } from "../NEON ODDS/episodes/ep04-ritz-roulette/Video";
import { duration as NOep05Duration, Thumb as NOep05Thumb, Video as NOep05 } from "../NEON ODDS/episodes/ep05-don-johnson/Video";
import { duration as NOep06Duration, Thumb as NOep06Thumb, Video as NOep06 } from "../NEON ODDS/episodes/ep06-bill-benter/Video";
import { duration as NOep07Duration, Thumb as NOep07Thumb, Video as NOep07 } from "../NEON ODDS/episodes/ep07-ron-harris/Video";
import { duration as NOep08Duration, Thumb as NOep08Thumb, Video as NOep08 } from "../NEON ODDS/episodes/ep08-watanabe/Video";
import { OutroScene } from "./compositions/Showcase/scenes/OutroScene";

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
          id="Style-K-ChibiCase-Test"
          component={KTest}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={kTestDuration(PVR.fps)}
        />
        <Composition
          id="Style-L-SiegeAtlas-Thermopylae"
          component={LThermopylae}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={lThermopylaeDuration(PVR.fps)}
        />
        <Composition
          id="Style-L-SiegeAtlas-ThermopylaeFull"
          component={LThermopylaeFull}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={lThermopylaeFullDuration(PVR.fps)}
        />
        <Composition id="Style-M-HoatSu-Kit" component={MKit} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={mKitDuration} />
        <Composition id="Style-M-HoatSu-Sets" component={MSets} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={mSetsDuration} />
        <Composition id="Style-M-HoatSu-Cast" component={MCast} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={30} />
        <Composition id="Style-M-3D-Test" component={Test3D} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={2} />
        <Composition
          id="Style-M-HoatSu-Test"
          component={MTest}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={mTestDuration(PVR.fps)}
        />
        <Composition
          id="Style-M-HoatSu-Churchill"
          component={MChurchill}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={mChurchillDuration(PVR.fps)}
        />
        <Composition
          id="Style-M-HoatSu-Doss"
          component={MDoss}
          width={PVR.width}
          height={PVR.height}
          fps={PVR.fps}
          durationInFrames={mDossDuration(PVR.fps)}
        />
        <Composition id="Style-N-LowPoly-Mandel" component={NMandel} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={nMandelDuration()} />
        <Composition id="Style-N-LowPoly-Sets" component={NSetsPreview} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={N_SETS_FRAMES} />
        <Composition id="Style-N-LowPoly-Mandel-Thumb" component={NMandelThumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="Style-O-DataLoop-Kit" component={OKit} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={oKitDuration} />
        <Composition id="Style-O-DataLoop-Shrike" component={OShrike} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={oShrikeDuration} />
        <Composition id="NO-ep01-ivey-edge" component={NOep01} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep01Duration()} />
        <Composition id="NO-ep01-ivey-edge-Thumb" component={NOep01Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="NO-ep02-tipton-lottery" component={NOep02} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep02Duration()} />
        <Composition id="NO-ep02-tipton-lottery-Thumb" component={NOep02Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="NO-ep03-slot-hack" component={NOep03} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep03Duration()} />
        <Composition id="NO-ep03-slot-hack-Thumb" component={NOep03Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="NO-ep04-ritz-roulette" component={NOep04} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep04Duration()} />
        <Composition id="NO-ep04-ritz-roulette-Thumb" component={NOep04Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="NO-ep05-don-johnson" component={NOep05} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep05Duration()} />
        <Composition id="NO-ep05-don-johnson-Thumb" component={NOep05Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="NO-ep06-bill-benter" component={NOep06} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep06Duration()} />
        <Composition id="NO-ep06-bill-benter-Thumb" component={NOep06Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="NO-ep07-ron-harris" component={NOep07} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep07Duration()} />
        <Composition id="NO-ep07-ron-harris-Thumb" component={NOep07Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="NO-ep08-watanabe" component={NOep08} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={NOep08Duration()} />
        <Composition id="NO-ep08-watanabe-Thumb" component={NOep08Thumb} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={1} />
        <Composition id="Neon-Odds-Logo" component={NeonOddsLogo} width={1024} height={1024} fps={PVR.fps} durationInFrames={1} />
        <Composition id="Neon-Odds-Banner" component={NeonOddsBanner} width={2560} height={1440} fps={PVR.fps} durationInFrames={1} />
        <Composition id="Style-M-HoatSu-Doss3D" component={MDoss3D} width={PVR.width} height={PVR.height} fps={PVR.fps} durationInFrames={mDoss3dDuration(PVR.fps)} />
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
      {/* Naval Board #1 (Formats/Naval Board/episodes/ep01-carrier) */}
      <Composition id="Carrier-HowACarrierDefends" component={CarrierVideo} width={1920} height={1080} fps={30} durationInFrames={carrierDuration} defaultProps={{ subtitles: true }} />
      <Composition id="Carrier-Thumbnail" component={CarrierThumbnail} width={1920} height={1080} fps={30} durationInFrames={1} defaultProps={{ variant: "a" as CarrierThumbVariant }} />
      {/* Naval Board #2 (Formats/Naval Board/episodes/ep02-submarines) */}
      <Composition id="Submarines-HowTheyFight" component={SubmarinesVideo} width={1920} height={1080} fps={30} durationInFrames={submarinesDuration} defaultProps={{ subtitles: true }} />
      <Composition id="Submarines-Thumbnail" component={SubmarinesThumbnail} width={1920} height={1080} fps={30} durationInFrames={1} defaultProps={{ variant: "e" as SubThumbVariant }} />

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
