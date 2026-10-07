import timing from "../../../voiceover/get-paid.timing.json";
import { EpisodeCut, SceneTest } from "../cut";
import { episodeDuration, sceneRange } from "../episode";
import { EP03_CAPTIONS } from "./captions";
import {
  Scene1,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
  Scene6,
  Scene7,
  Scene8,
} from "./Scenes";

const VO = "voiceover/get-paid/vo.mp3";

export const ep03SceneRange = (scene: string, fps: number) =>
  sceneRange(timing, scene, fps);
export const ep03Duration = (fps: number) => episodeDuration(timing, fps);

/** Gate 4 test: Scene 3 (the loan). */
export const Ep03TestScene3: React.FC = () => (
  <SceneTest
    timing={timing}
    captions={EP03_CAPTIONS}
    vo={VO}
    scene="s3"
    Scene={Scene3}
    legacySubs
  />
);

const SCENES = {
  s1: Scene1,
  s2: Scene2,
  s3: Scene3,
  s4: Scene4,
  s5: Scene5,
  s6: Scene6,
  s7: Scene7,
  s8: Scene8,
};

/** Full episode, style D "Text Thread". Music turns at the transition (line 33). */
export const Ep03: React.FC = () => (
  <EpisodeCut
    timing={timing}
    scenes={SCENES}
    captions={EP03_CAPTIONS}
    vo={VO}
    pivot="33"
    legacySubs
  />
);
