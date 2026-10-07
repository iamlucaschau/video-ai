import { PVR } from "./theme";

export type Timing = {
  durationInSeconds: number;
  lines: {
    id: string;
    scene: string;
    start: number;
    end: number;
    text: string;
  }[];
};

/** Hard cut this long before a scene's first VO line. */
const CUT_LEAD = 0.15;

/** Scene boundaries (frames) derived from an episode's approved VO timestamps. */
export const sceneRange = (timing: Timing, scene: string, fps: number) => {
  const lines = timing.lines.filter((l) => l.scene === scene);
  const order = [...new Set(timing.lines.map((l) => l.scene))];
  const next = order[order.indexOf(scene) + 1];
  const from =
    order[0] === scene ? 0 : Math.round((lines[0].start - CUT_LEAD) * fps);
  const end = next
    ? Math.round(
        (timing.lines.find((l) => l.scene === next)!.start - CUT_LEAD) * fps,
      )
    : episodeDuration(timing, fps);
  return { from, durationInFrames: end - from };
};

/** VO length + the series' 1.5 s hold. */
export const episodeDuration = (timing: Timing, fps: number) =>
  Math.round((timing.durationInSeconds + PVR.tailSeconds) * fps);
