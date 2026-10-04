/**
 * Central video settings. Change resolution, frame rate and timing here.
 *
 * - All scene timing is expressed in SECONDS, so changing `fps` keeps the
 *   pacing identical (30 → 60 fps just doubles the frame count).
 * - Layouts are designed on a 1920×1080 canvas (`DESIGN`) and scaled by
 *   <Stage>, so changing `width`/`height` to 1280×720 or 3840×2160 keeps
 *   everything proportional. For a different aspect ratio (e.g. 1080×1920),
 *   build a dedicated layout instead of relying on scaling.
 */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/** The reference canvas all layouts are authored against. Don't change. */
export const DESIGN = {
  width: 1920,
  height: 1080,
} as const;

/** Durations (in seconds) for the Showcase sample composition. */
export const SHOWCASE_TIMING = {
  introSeconds: 3.5,
  featuresSeconds: 4.5,
  outroSeconds: 4,
  /** Overlap between consecutive scenes. */
  transitionSeconds: 0.6,
} as const;

/** Convert seconds to a whole number of frames. */
export const toFrames = (seconds: number, fps: number = VIDEO.fps) =>
  Math.round(seconds * fps);

/**
 * Total length of the Showcase composition. Transitions overlap scenes, so
 * their durations are subtracted.
 */
export const getShowcaseDuration = (fps: number = VIDEO.fps) =>
  toFrames(SHOWCASE_TIMING.introSeconds, fps) +
  toFrames(SHOWCASE_TIMING.featuresSeconds, fps) +
  toFrames(SHOWCASE_TIMING.outroSeconds, fps) -
  2 * toFrames(SHOWCASE_TIMING.transitionSeconds, fps);
