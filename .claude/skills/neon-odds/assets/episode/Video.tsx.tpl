/**
 * NEON ODDS EPNN · SLUG. Every cut sits on a VO word (shots.json → shots.timeline.json); every number on screen is in
 * the fact table of kich-ban-SLUG-FINAL.md. One eased glide per shot at most, hard cuts. Last frame = frame 0.
 * Guide: .claude/skills/neon-odds/references/dung-video.md. Full example: Style Library/N-low-poly/n-mandel/Video.tsx.
 */
import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "../../../Style Library/kit-common";
import { cm, Episode, episodeDuration, epTools, ramp, type ShotFn, ThumbText, type Words } from "../../../Style Library/N-low-poly/episode";
import { act, alive, glide, N, Person, Shot3D } from "../../../Style Library/N-low-poly/lowpoly";
import { CAST, Void } from "../../../Style Library/N-low-poly/sets";
import { Sfx } from "../../../src/series/pvr/sfx";
import timing from "../../../src/voiceover/SLUG.timing.json";
import rawWords from "../../../src/voiceover/SLUG.words.json";
import SHOTS from "./shots.timeline.json";

const WORDS = rawWords as Words;
const { at, lineStart, sec } = epTools(timing, WORDS, SHOTS);
export const duration = () => episodeDuration(SHOTS);
// TODO: own bed once the voice is final (dung-video.md, Âm thanh); this one has an arc written for another episode
const MUSIC = "sfx/music/own/n-heist.mp3";

const S: Record<string, ShotFn> = {
  // TODO: one function per shot in shots.json. Replace these two; the last shot must end on the picture of frame 0.
  S1: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.5, 3.2], [0, 1.45, 0], 40), cm([0, 1.5, 3.0], [0, 1.45, 0], 40), t, len),
    world: (
      <Void>
        <Person look={CAST.clerk} pose={{ ...alive(g, 1), ...act(t, [[0, { smile: 0.2, armL: { o: 6 }, armR: { o: 6 } }], [len, { smile: 0.6, brow: 0.6, armL: { o: 6 }, armR: { f: 40, e: -60, o: 8 } }]]) }} />
      </Void>
    ),
  }),
  S2: (t, len, g) => ({
    light: "stage",
    cam: glide(cm([0, 1.5, 3.0], [0, 1.45, 0], 40), cm([0, 1.5, 3.2], [0, 1.45, 0], 40), t, len),
    world: (
      <Void>
        <Person look={CAST.clerk} pose={{ ...alive(g, 1), smile: ramp(t, 0, len, 0.6, 0.2), armL: { o: 6 }, armR: { o: 6 } }} />
      </Void>
    ),
  }),
};

export const Video: React.FC<{ safeGuide?: boolean }> = ({ safeGuide }) => {
  // TODO: 0 for silence before a turning point, e.g. interpolate(g, [lineStart("26") - 6, lineStart("26") - 2], [1, 0], CLAMP)
  const duck = (g: number) => interpolate(g, [lineStart("01"), lineStart("01") + 1], [1, 1], CLAMP);
  return (
    <Episode S={S} shots={SHOTS} timing={timing} words={WORDS} slug="SLUG" music={MUSIC} duck={duck} safeGuide={safeGuide}>
      {/* TODO: one sound per visible action. A hit that illustrates a word lands in the pause after it. */}
      <Sfx file="sfx/synth/ball-rattle.wav" at={at("S1")} level={-27} seconds={sec("S1", "S2")} />
    </Episode>
  );
};

/** TODO: 9:16 thumbnail. One big face reacting, one big object, at most four huge words, all inside the safe zone. */
export const Thumb: React.FC = () => (
  <Shot3D light="stage" cam={cm([0, 1.55, 1.5], [0, 1.5, 0], 40)} over={<ThumbText top="BIG" bottom="WORDS" />}>
    <Void>
      <Person look={CAST.clerk} pose={{ blink: 0, mouth: 0.8, smile: 0.4, brow: 1, armL: { o: 6 }, armR: { o: 6 } }} />
      <pointLight position={[0.6, 2, 1.4]} intensity={3} distance={4} color={N.cream} />
    </Void>
  </Shot3D>
);
