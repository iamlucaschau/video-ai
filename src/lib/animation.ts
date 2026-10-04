import { Easing, interpolate } from "remotion";

/**
 * Animation helpers for reusable components.
 *
 * Every animation is a pure function of the current frame. Never use CSS
 * transitions/animations or timers: they don't render deterministically.
 *
 * For one-off layers inside a scene, prefer writing `interpolate()` inline in
 * the `style` prop of an <Interactive.Div> so it stays editable in Studio.
 * Use these helpers inside reusable components where values are computed.
 */

export const EASE = {
  /** Fast start, long soft landing. The default for entrances. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Symmetric ease for moves between two states. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Accelerating ease for exits. */
  in: Easing.bezier(0.7, 0, 0.84, 0),
  /** Critically damped spring: smooth, no overshoot. */
  spring: Easing.spring({ damping: 200 }),
  /** Spring with a little overshoot for playful pops. */
  bouncy: Easing.spring({ damping: 12, stiffness: 120 }),
} as const;

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type ProgressOptions = {
  /** When the animation starts, in seconds. */
  start?: number;
  /** How long it lasts, in seconds. */
  duration?: number;
  easing?: (t: number) => number;
};

/** 0 → 1 progress over a time window given in seconds. */
export const progress = (
  frame: number,
  fps: number,
  { start = 0, duration = 0.8, easing = EASE.out }: ProgressOptions = {},
) =>
  interpolate(frame, [start * fps, (start + duration) * fps], [0, 1], {
    ...CLAMP,
    easing,
  });

/** Map a 0 → 1 progress value onto any numeric range. */
export const mix = (p: number, from: number, to: number) =>
  from + (to - from) * p;

/** Delay (in seconds) for the n-th item of a staggered group. */
export const stagger = (index: number, step = 0.08, base = 0) =>
  base + index * step;

/**
 * Fade + rise + un-blur entrance. Returns style properties to spread onto an
 * element.
 */
export const fadeUp = (
  frame: number,
  fps: number,
  {
    start = 0,
    duration = 0.8,
    distance = 40,
    blur = 8,
    easing = EASE.out,
  }: ProgressOptions & {
    distance?: number;
    blur?: number;
  } = {},
): React.CSSProperties => {
  const p = progress(frame, fps, { start, duration, easing });
  return {
    opacity: p,
    translate: `0px ${mix(p, distance, 0)}px`,
    filter: blur > 0 ? `blur(${mix(p, blur, 0)}px)` : undefined,
  };
};

/** Scale-in pop. Uses perceptual scaling so growth looks linear to the eye. */
export const popIn = (
  frame: number,
  fps: number,
  { start = 0, duration = 0.7, easing = EASE.bouncy }: ProgressOptions = {},
): React.CSSProperties => ({
  opacity: progress(frame, fps, { start, duration: duration * 0.5 }),
  scale: String(
    interpolate(frame, [start * fps, (start + duration) * fps], [0, 1], {
      ...CLAMP,
      easing,
      output: "perceptual-scale",
    }),
  ),
});

/** Gentle looping float for ambient motion. `period` is in seconds. */
export const float = (
  frame: number,
  fps: number,
  amplitude = 12,
  period = 4,
  phase = 0,
) => Math.sin((frame / fps / period) * Math.PI * 2 + phase) * amplitude;
