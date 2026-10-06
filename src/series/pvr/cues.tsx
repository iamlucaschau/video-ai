import { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

type Cues = { lines: { id: string; start: number; end: number }[] };
const CueCtx = createContext<{ cues: Cues; sceneFrom: number } | null>(null);
export const CueProvider = CueCtx.Provider;

/**
 * Inside a scene: `at("15")` = local frame where VO line 15 starts,
 * `at("15", 0.6)` = 60% through that line. Lines from other scenes give
 * negative/out-of-range frames, which is how a receipt can "already be
 * printed" when a scene starts. All cues come from the approved VO timing.
 */
export const useCues = () => {
  const ctx = useContext(CueCtx);
  if (!ctx) throw new Error("useCues() outside a scene");
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const at = (id: string, k = 0) => {
    const l = ctx.cues.lines.find((x) => x.id === id);
    if (!l) throw new Error(`No VO line ${id}`);
    return Math.round((l.start + (l.end - l.start) * k) * fps) - ctx.sceneFrom;
  };
  return { frame, fps, at };
};
