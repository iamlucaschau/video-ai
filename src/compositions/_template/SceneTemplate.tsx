/**
 * Starter scene. Copy this file into a new composition folder, rename it,
 * and register it in src/Root.tsx. Not registered by default.
 */
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AnimatedText, Background, Stage } from "../../components";
import { COLORS, FONTS, TYPE } from "../../theme";

export const SceneTemplate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Full-bleed layers go outside <Stage> */}
      <Background
        backgroundColor={COLORS.background}
        accentColor={COLORS.accent}
        secondaryColor={COLORS.secondary}
      />

      {/* Everything inside <Stage> is laid out on a 1920×1080 canvas */}
      <Stage>
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <AnimatedText
            text="Headline goes here"
            start={0.2}
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: TYPE.title,
              color: COLORS.text,
            }}
          />
          <Interactive.Div
            name="Supporting line"
            style={{
              marginTop: 32,
              fontFamily: FONTS.body,
              fontSize: TYPE.body,
              color: COLORS.muted,
              opacity: interpolate(frame, [0.8 * fps, 1.5 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
            }}
          >
            Supporting text
          </Interactive.Div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
