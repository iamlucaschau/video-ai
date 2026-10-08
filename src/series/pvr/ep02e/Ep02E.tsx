import timing from "../../../voiceover/give-discounts.timing.json";
import { EpisodeCut } from "../cut";
import { EP02_CAPTIONS } from "../ep02/captions";
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

/** Ep02 in style E "Map Story", built to the 2026-10-08 short-form rules (new subtitles). */
export const Ep02E: React.FC = () => (
  <EpisodeCut
    timing={timing}
    scenes={SCENES}
    captions={EP02_CAPTIONS}
    vo="voiceover/give-discounts/vo.mp3"
    pivot="33"
  />
);
