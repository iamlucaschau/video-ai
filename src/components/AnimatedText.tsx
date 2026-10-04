import { useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, mix, progress } from "../lib/animation";

type Props = {
  text: string;
  /** Start time in seconds (relative to the parent sequence). */
  start?: number;
  /** Animate per word or per character. */
  by?: "word" | "char";
  /** Seconds between each unit. */
  stagger?: number;
  /** Duration of each unit's animation, in seconds. */
  duration?: number;
  style?: React.CSSProperties;
};

/**
 * Masked typographic reveal: each word (or character) slides up from behind
 * a clipping mask while fading and un-blurring, with a stagger.
 */
export const AnimatedText: React.FC<Props> = ({
  text,
  start = 0,
  by = "word",
  stagger = by === "word" ? 0.08 : 0.025,
  duration = 0.9,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const units = by === "word" ? text.split(" ") : Array.from(text);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "inherit",
        ...style,
      }}
    >
      {units.map((unit, i) => {
        const p = progress(frame, fps, {
          start: start + i * stagger,
          duration,
          easing: EASE.out,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              paddingBottom: "0.08em",
              marginBottom: "-0.08em",
              whiteSpace: "pre",
            }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0px ${mix(p, 105, 0)}%`,
                opacity: mix(p, 0, 1),
                filter: `blur(${mix(p, 10, 0)}px)`,
              }}
            >
              {unit}
              {by === "word" && i < units.length - 1 ? " " : ""}
            </span>
          </span>
        );
      })}
    </div>
  );
};
