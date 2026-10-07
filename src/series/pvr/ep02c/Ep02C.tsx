import { Ep02Cut } from "../ep02/Ep02";
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

/** Ep02 in style C "Street Sim": same script, VO, subtitles and music. */
export const Ep02C: React.FC = () => <Ep02Cut scenes={SCENES} />;
