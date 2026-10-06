import { useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "./paper";

type Line = { id: string; start: number; end: number; text: string };

const MAX_CHARS = 30;

/** Split a sentence into readable chunks of ≤ MAX_CHARS at word boundaries. */
const chunk = (text: string) => {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    if (cur && (cur + " " + w).length > MAX_CHARS) {
      out.push(cur);
      cur = w;
    } else cur = cur ? cur + " " + w : w;
  }
  if (cur) out.push(cur);
  return out;
};

/**
 * Burned-in subtitles from the approved VO timing. Each sentence is shown in
 * chunks timed by their share of the sentence; `captions` overrides a line's
 * text (e.g. numerals instead of spelled-out numbers).
 */
export const Subtitles: React.FC<{
  lines: Line[];
  captions?: Record<string, string>;
  y?: number;
}> = ({ lines, captions = {}, y = 1600 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const i = lines.findIndex(
    (l, k) => t >= l.start && t < (lines[k + 1]?.start ?? l.end + 0.6),
  );
  if (i < 0) return null;
  const line = lines[i];
  const parts = chunk(captions[line.id] ?? line.text);
  const total = parts.reduce((n, p) => n + p.length, 0);
  let acc = 0;
  let text = parts[parts.length - 1];
  for (const p of parts) {
    if (t < line.start + (acc / total) * (line.end - line.start)) break;
    text = p;
    acc += p.length;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT.sub,
          fontWeight: FONT.subWeight,
          fontSize: 58,
          lineHeight: 1.15,
          color: "white",
          textAlign: "center",
          WebkitTextStroke: "10px #1b1b1b",
          paintOrder: "stroke fill",
          textShadow: "0 6px 14px rgba(0,0,0,0.35)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
