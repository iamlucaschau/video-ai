import timing from "../../../voiceover/give-discounts.timing.json";
import { EpisodeCut, SceneTest } from "../cut";
import { episodeDuration, sceneRange } from "../episode";
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

const VO = "voiceover/give-discounts/vo.mp3";

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

/** Full episode in style A. */
export const Ep02: React.FC = () => <Ep02Cut scenes={SCENES} />;

/** Ep02's VO, subtitles and music around any set of 8 scenes (styles A–D). */
export const Ep02Cut: React.FC<{ scenes: Record<string, React.FC> }> = ({
  scenes,
}) => (
  <EpisodeCut
    timing={timing}
    scenes={scenes}
    captions={EP02_CAPTIONS}
    vo={VO}
    pivot="33"
    legacySubs
  />
);

/** Gate 4 test: Scene 3 (the poor math). */
export const Ep02TestScene3: React.FC = () => (
  <SceneTest
    timing={timing}
    captions={EP02_CAPTIONS}
    vo={VO}
    scene="s3"
    Scene={Scene3}
    legacySubs
  />
);
