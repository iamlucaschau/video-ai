import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { COLORS } from "../../theme";

/** Props editable in the Studio sidebar (and via --props when rendering). */
export const showcaseSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  features: z
    .array(z.object({ label: z.string(), caption: z.string() }))
    .length(3),
  outroTitle: z.string(),
  outroSubtitle: z.string(),
  backgroundColor: zColor(),
  accentColor: zColor(),
  secondaryColor: zColor(),
  soundEffects: z.boolean(),
});

export type ShowcaseProps = z.infer<typeof showcaseSchema>;

/**
 * Shared defaults for the full video and its standalone scene previews, so
 * they never drift apart.
 */
export const showcaseDefaults: ShowcaseProps = {
  eyebrow: "Remotion · Motion Graphics",
  title: "Motion, programmed.",
  subtitle: "Polished video, written in React.",
  features: [
    { label: "Typography", caption: "Kinetic, frame-perfect text" },
    { label: "Shapes", caption: "Vector graphics that move" },
    { label: "Transitions", caption: "Smooth scene-to-scene flow" },
  ],
  outroTitle: "Your turn.",
  outroSubtitle: "npm run dev  →  edit  →  npm run render",
  backgroundColor: COLORS.background,
  accentColor: COLORS.accent,
  secondaryColor: COLORS.secondary,
  soundEffects: true,
};
