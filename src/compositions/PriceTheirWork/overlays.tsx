import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { easeOut, lerp, pop, ramp } from "./beats";
import { CAPTIONS } from "./captions";
import { C, F, sideColor, Z } from "./theme";
import { SCENE_META, type Timeline } from "./timeline";

const sceneAt = (timeline: Timeline, frame: number) => {
  let current = timeline.scenes[0];
  for (const s of timeline.scenes) if (frame >= s.from) current = s;
  return current;
};

/** Full-bleed background; its glow follows the poor (red) / rich (green) side. */
export const Backdrop: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pivot = timeline.scenes.find((s) => s.id === "pivot")!.from;
  const outro = timeline.scenes.find((s) => s.id === "outro")!.from;
  const glow = interpolateColors(
    frame,
    [0, fps * 1.5, pivot - 5, pivot + 20, outro, outro + 20],
    ["#3A3412", "#5A1214", "#5A1214", "#0E5A3C", "#0E5A3C", "#3A3412"],
  );
  const drift = Math.sin(frame / fps / 3) * 40;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% ${38 + drift / 40}%, ${glow} 0%, transparent 70%)`,
          opacity: 0.85,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.035) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${(frame * 0.6) % 90}px`,
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 10%, transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Chapter label at the top; re-animates whenever the chapter changes. */
export const ChapterChip: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = sceneAt(timeline, frame);
  const meta = SCENE_META[scene.id];
  if (!meta.chip) return null;
  const p = pop(frame, fps, scene.from + 4, 15);
  const color = sideColor(meta.side);

  return (
    <div
      style={{
        position: "absolute",
        top: Z.chipY,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 30px",
          borderRadius: 999,
          background: `${color}1F`,
          border: `3px solid ${color}`,
          color,
          fontFamily: F.ui,
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: "0.12em",
          opacity: Math.min(1, p * 2),
          translate: `0px ${lerp(Math.min(p, 1), -40, 0)}px`,
        }}
      >
        <div
          style={{ width: 14, height: 14, borderRadius: 7, background: color }}
        />
        {meta.chip}
      </div>
    </div>
  );
};

/** Thin progress bar at the very top. */
export const Progress: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scene = sceneAt(timeline, frame);
  const color = sideColor(SCENE_META[scene.id].side);
  return (
    <div
      style={{
        position: "absolute",
        top: 130,
        left: Z.sideX,
        right: Z.sideX,
        height: 8,
        borderRadius: 8,
        background: C.line,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 8,
          background: color,
          transformOrigin: "left",
          scale: `${interpolate(frame, [0, durationInFrames - 1], [0, 1])} 1`,
        }}
      />
    </div>
  );
};

type Token = { word: string; hot: boolean };

const tokenize = (caption: string): Token[] => {
  const tokens: Token[] = [];
  caption.split(/(\*[^*]+\*)/).forEach((part) => {
    if (!part) return;
    const hot = part.startsWith("*");
    part
      .replace(/\*/g, "")
      .split(" ")
      .filter(Boolean)
      .forEach((word) => tokens.push({ word, hot }));
  });
  return tokens;
};

/** Spoken-length weight of a caption word (numerals take longer to say). */
const weight = (w: string) => {
  const digits = w.replace(/[^0-9]/g, "").length;
  return (
    Math.max(2, w.replace(/[^A-Za-z]/g, "").length) +
    digits * 4 +
    (w.includes("$") ? 5 : 0)
  );
};

/**
 * Word-by-word captions. Each word appears when it is (approximately) spoken,
 * based on its share of the line's audio duration.
 */
export const Captions: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = [...timeline.lines].reverse().find((l) => frame >= l.from - 2);
  if (!line) return null;
  // Keep a line on screen through the gap until the next one starts
  const next = timeline.lines[timeline.lines.indexOf(line) + 1];
  const hideAt = next ? next.from - 2 : line.end + fps * 1.2;
  if (frame >= hideAt) return null;

  const scene = sceneAt(timeline, frame);
  const side = SCENE_META[scene.id].side;
  const hotColor =
    line.id === "01" || line.id === "56" ? C.gold : sideColor(side);

  const tokens = tokenize(CAPTIONS[line.id] ?? line.text);
  const weights = tokens.map((t) => weight(t.word));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const starts = weights.map((w) => {
    const s = line.from + (acc / total) * line.durationInFrames * 0.92;
    acc += w;
    return s;
  });
  const exit = ramp(frame, hideAt - 4, 4);

  return (
    <div
      style={{
        position: "absolute",
        top: Z.captionTop,
        left: Z.sideX,
        right: Z.sideX,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "flex-start",
        columnGap: 18,
        rowGap: 6,
        opacity: 1 - exit,
      }}
    >
      {tokens.map((t, i) => {
        const p = ramp(frame, starts[i] - 2, 6, easeOut);
        const lit = frame >= starts[i] - 2;
        return (
          <span
            key={i}
            style={{
              fontFamily: F.ui,
              fontWeight: 900,
              fontSize: t.hot ? 74 : 66,
              lineHeight: 1.15,
              color: t.hot ? hotColor : C.text,
              opacity: lit ? lerp(p, 0.25, 1) : 0.0,
              scale: String(lerp(p, 0.8, 1)),
              translate: `0px ${lerp(p, 14, 0)}px`,
              textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.6)",
              WebkitTextStroke: "2px rgba(0,0,0,0.35)",
            }}
          >
            {t.word}
          </span>
        );
      })}
    </div>
  );
};
