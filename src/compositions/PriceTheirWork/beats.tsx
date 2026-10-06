import { createContext, useContext } from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Timeline } from "./timeline";

type SceneCtx = { timeline: Timeline; sceneFrom: number };

export const SceneContext = createContext<SceneCtx | null>(null);

/**
 * Inside a scene: `at("14")` is the local frame where voiceover line 14
 * starts, `end("14")` where it ends. Animate against these so visuals stay
 * locked to the voice whatever the audio length.
 */
export const useBeats = () => {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useBeats() must be used inside a scene");
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (id: string) => ctx.timeline.byId[id].from - ctx.sceneFrom;
  const end = (id: string) => ctx.timeline.byId[id].end - ctx.sceneFrom;
  return { frame, fps, at, end };
};

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 from `start` over `frames`. */
export const ramp = (
  frame: number,
  start: number,
  frames = 12,
  easing = easeOut,
) => interpolate(frame, [start, start + frames], [0, 1], { ...CLAMP, easing });

/** Springy 0 → 1 (slight overshoot) starting at `start`. */
export const pop = (frame: number, fps: number, start: number, damping = 13) =>
  spring({
    frame: frame - start,
    fps,
    config: { damping, stiffness: 170, mass: 0.8 },
  });

/** Linear map helper. */
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;
