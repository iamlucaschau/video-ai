import { Circle, Rect, Triangle } from "@remotion/shapes";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AccentLine,
  AnimatedText,
  Background,
  FloatingShape,
  Stage,
} from "../../../components";
import { COLORS, FONTS, TYPE } from "../../../theme";
import type { ShowcaseProps } from "../schema";

/** Scene 1: geometric shapes fly in, then a masked headline reveal. */
export const IntroScene: React.FC<ShowcaseProps> = ({
  eyebrow,
  title,
  subtitle,
  backgroundColor,
  accentColor,
  secondaryColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background
        backgroundColor={backgroundColor}
        accentColor={accentColor}
        secondaryColor={secondaryColor}
      />
      <Stage>
        {/* Decorative shapes */}
        <FloatingShape x={1580} y={250} start={0} spin={8} phase={0}>
          <Circle
            radius={120}
            fill="none"
            stroke={accentColor}
            strokeWidth={14}
          />
        </FloatingShape>
        <FloatingShape
          x={330}
          y={820}
          start={0.15}
          rotate={18}
          spin={-6}
          phase={1.4}
        >
          <Rect
            width={170}
            height={170}
            cornerRadius={34}
            fill={secondaryColor}
          />
        </FloatingShape>
        <FloatingShape
          x={1490}
          y={840}
          start={0.3}
          rotate={-12}
          spin={10}
          phase={2.2}
        >
          <Triangle
            length={150}
            direction="up"
            cornerRadius={18}
            fill={COLORS.highlight}
          />
        </FloatingShape>
        <FloatingShape x={420} y={230} start={0.45} drift={10} phase={3}>
          <Circle radius={22} fill={COLORS.text} />
        </FloatingShape>
        <FloatingShape x={1720} y={560} start={0.55} drift={8} phase={4}>
          <Circle radius={12} fill={secondaryColor} />
        </FloatingShape>

        {/* Headline block */}
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Interactive.Div
            name="Eyebrow"
            style={{
              fontFamily: FONTS.body,
              fontWeight: 600,
              fontSize: TYPE.eyebrow,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: secondaryColor,
              marginBottom: 36,
              opacity: interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [0.3 * fps, 1 * fps],
                ["0px 24px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {eyebrow}
          </Interactive.Div>

          <AnimatedText
            text={title}
            start={0.5}
            style={{
              justifyContent: "center",
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: TYPE.hero,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: COLORS.text,
            }}
          />

          <div style={{ marginTop: 44, marginBottom: 44 }}>
            <AccentLine
              width={360}
              colors={[accentColor, secondaryColor]}
              start={1.2}
              origin="center"
            />
          </div>

          <Interactive.Div
            name="Subtitle"
            style={{
              fontFamily: FONTS.body,
              fontWeight: 400,
              fontSize: TYPE.body,
              color: COLORS.muted,
              opacity: interpolate(frame, [1.5 * fps, 2.3 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }),
              translate: interpolate(
                frame,
                [1.5 * fps, 2.3 * fps],
                ["0px 30px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                },
              ),
            }}
          >
            {subtitle}
          </Interactive.Div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
