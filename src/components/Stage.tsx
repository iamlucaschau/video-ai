import { AbsoluteFill, useVideoConfig } from "remotion";
import { DESIGN } from "../config";

/**
 * A fixed design canvas (1920×1080 by default, or e.g. VERTICAL_DESIGN for
 * 9:16), scaled to fit the actual composition size. Author layouts in design
 * pixels inside <Stage>; they stay proportional at any resolution with the
 * same aspect ratio. Put full-bleed backgrounds outside of it.
 */
export const Stage: React.FC<{
  children: React.ReactNode;
  design?: { width: number; height: number };
}> = ({ children, design = DESIGN }) => {
  const { width, height } = useVideoConfig();
  const scale = Math.min(width / design.width, height / design.height);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          width: design.width,
          height: design.height,
          scale: String(scale),
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
