import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

/**
 * Fonts are loaded once at module level. @remotion/google-fonts blocks
 * rendering until the font is ready, so frames never render with a fallback.
 */
const display = loadDisplay("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});
const body = loadBody("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const FONTS = {
  display: display.fontFamily,
  body: body.fontFamily,
} as const;

/** Default palette. Compositions can override colors via props. */
export const COLORS = {
  background: "#0B0D17",
  surface: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.12)",
  text: "#F5F7FF",
  muted: "rgba(245, 247, 255, 0.62)",
  accent: "#7C5CFF",
  secondary: "#22D3EE",
  highlight: "#F472B6",
} as const;

/** Type scale for the 1920×1080 design canvas. */
export const TYPE = {
  hero: 156,
  title: 96,
  heading: 64,
  body: 40,
  caption: 30,
  eyebrow: 26,
} as const;

/** Safe-area padding for the 1920×1080 design canvas. */
export const SAFE = {
  x: 140,
  y: 110,
} as const;
