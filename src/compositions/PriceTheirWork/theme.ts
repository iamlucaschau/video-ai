import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const inter = loadInter("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin"],
});
const mono = loadMono("normal", {
  weights: ["500", "800"],
  subsets: ["latin"],
});

export const F = {
  /** Condensed poster headline. */
  display: anton.fontFamily,
  /** Captions and UI. */
  ui: inter.fontFamily,
  /** Receipts and math. */
  mono: mono.fontFamily,
} as const;

export const C = {
  bg: "#0C0D11",
  panel: "#16181F",
  line: "rgba(255,255,255,0.10)",
  text: "#F6F4EE",
  muted: "rgba(246,244,238,0.55)",
  poor: "#FF4D4F",
  poorDeep: "#7A1517",
  rich: "#2EE59D",
  richDeep: "#0C5C3E",
  gold: "#FFD23F",
  paper: "#F3EFE6",
  ink: "#1B1B1F",
} as const;

export type Side = "poor" | "rich" | "neutral";

export const sideColor = (side: Side) =>
  side === "poor" ? C.poor : side === "rich" ? C.rich : C.gold;

/** Vertical layout zones on the 1080×1920 canvas (platform-UI safe). */
export const Z = {
  chipY: 210,
  stageTop: 330,
  stageBottom: 1260,
  captionTop: 1330,
  sideX: 70,
} as const;
