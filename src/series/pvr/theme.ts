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

/**
 * Platform-UI safe zone for 9:16 (Reels / TikTok / Shorts), Lucas 2026-10-08.
 * Top bar, bottom caption/account/audio/progress stack, right action rail,
 * left edge. Every word, number, face and key shape stays inside
 * x 60–940, y 220–1440. Check with --props='{"safeGuide":true}'.
 */
export const SAFE = { top: 220, bottom: 480, left: 60, right: 140 } as const;
