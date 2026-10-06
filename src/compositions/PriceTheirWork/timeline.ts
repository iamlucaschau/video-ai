import manifest from "../../voiceover/price-their-work.json";
import type { Side } from "./theme";

/** Pacing between voiceover lines, in seconds. */
export const PACING = {
  /** Silence before the first line. */
  leadSeconds: 0.35,
  /** Pause between lines of the same scene. */
  lineGapSeconds: 0.1,
  /** Pause when the scene changes. */
  sceneGapSeconds: 0.35,
  /** Visuals start this early, so they land with the words. */
  anticipationSeconds: 0.2,
  /** Hold after the last line. */
  tailSeconds: 1.8,
  /** Cross-fade overlap between scenes. */
  overlapSeconds: 0.25,
} as const;

export type SceneId =
  | "hook"
  | "poor"
  | "poorMath"
  | "backbone"
  | "pivot"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "richMath"
  | "outro";

/** Chapter label and color side for each scene. */
export const SCENE_META: Record<SceneId, { chip: string | null; side: Side }> =
  {
    hook: { chip: null, side: "neutral" },
    poor: { chip: "THE POOR WAY", side: "poor" },
    poorMath: { chip: "THE MATH", side: "poor" },
    backbone: { chip: "THE REAL PROBLEM", side: "poor" },
    pivot: { chip: null, side: "rich" },
    step1: { chip: "THE RICH WAY", side: "rich" },
    step2: { chip: "THE RICH WAY", side: "rich" },
    step3: { chip: "THE RICH WAY", side: "rich" },
    step4: { chip: "THE RICH WAY", side: "rich" },
    richMath: { chip: "THE REAL MATH", side: "rich" },
    outro: { chip: null, side: "neutral" },
  };

export type TimedLine = {
  id: string;
  scene: SceneId;
  text: string;
  src: string;
  /** Absolute frames. */
  from: number;
  durationInFrames: number;
  end: number;
};

export type TimedScene = {
  id: SceneId;
  /** Absolute start frame of the scene's visuals. */
  from: number;
  durationInFrames: number;
  /** Absolute start frame of the scene's first spoken line. */
  voiceFrom: number;
};

export type Timeline = {
  lines: TimedLine[];
  byId: Record<string, TimedLine>;
  scenes: TimedScene[];
  durationInFrames: number;
};

/** Lays the voiceover out in time; every visual cue derives from this. */
export const buildTimeline = (fps: number): Timeline => {
  const f = (s: number) => Math.round(s * fps);
  const lines: TimedLine[] = [];
  let t = PACING.leadSeconds;

  manifest.lines.forEach((line, i) => {
    const prev = manifest.lines[i - 1];
    if (prev) {
      t +=
        prev.scene === line.scene
          ? PACING.lineGapSeconds
          : PACING.sceneGapSeconds;
    }
    const from = f(t);
    const durationInFrames = Math.ceil(line.durationInSeconds * fps);
    lines.push({
      id: line.id,
      scene: line.scene as SceneId,
      text: line.text,
      src: line.src,
      from,
      durationInFrames,
      end: from + durationInFrames,
    });
    t += line.durationInSeconds;
  });

  const durationInFrames = f(t + PACING.tailSeconds);
  const order: SceneId[] = [];
  for (const l of lines)
    if (order[order.length - 1] !== l.scene) order.push(l.scene);

  const starts = order.map((id, i) => {
    const voiceFrom = lines.find((l) => l.scene === id)!.from;
    return i === 0 ? 0 : voiceFrom - f(PACING.anticipationSeconds);
  });
  const scenes: TimedScene[] = order.map((id, i) => {
    const from = starts[i];
    const next =
      i + 1 < order.length
        ? starts[i + 1] + f(PACING.overlapSeconds)
        : durationInFrames;
    return {
      id,
      from,
      durationInFrames: next - from,
      voiceFrom: lines.find((l) => l.scene === id)!.from,
    };
  });

  return {
    lines,
    byId: Object.fromEntries(lines.map((l) => [l.id, l])),
    scenes,
    durationInFrames,
  };
};
