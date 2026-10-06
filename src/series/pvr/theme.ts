/** Poor vs Rich Daily — locked by 00_SERIES-BIBLE.md. Do not change per episode. */
export const PVR = {
  width: 1080,
  height: 1920,
  fps: 30,
  /** Hold after the last VO line (tech spec §2). */
  tailSeconds: 1.5,
} as const;

/** Side colors (bible §3): POOR always red, RICH always green. */
export const INK = {
  poor: "#D32F2F",
  rich: "#388E3C",
} as const;
