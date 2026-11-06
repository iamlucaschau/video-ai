// Adapted from kelano86/what-if-animation studio/src/engine/anim.ts (MIT © 2026 FreshStack, see LICENSE here).
// Tiny animation helpers shared by the whole engine. Every shot is a pure function of its own clock t
// (frames), so nothing here keeps state: the same t always draws the same frame, which is what lets the
// engine play any shot backwards.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** Piecewise value from [frame, value] keys with an ease between neighbours. */
export const kf = (f: number, keys: [number, number][], ease = easeInOut) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (f <= f1) return lerp(v0, v1, ease((f - f0) / Math.max(1e-6, f1 - f0)));
  }
  return keys[keys.length - 1][1];
};
/** A repeatable pseudo-random number in 0..1 for (seed, i): sets scatter books, stars and dust with it. */
export const rnd = (seed: number, i: number) => Math.abs(Math.sin(seed * 31.7 + i * 12.9898) * 43758.5453) % 1;
/** A wobble that dies away: for things that land, get hit or get knocked. */
export const settle = (t: number, amp: number, speed = 1.4, decay = 8) => (t > 0 ? Math.sin(t * speed) * amp * Math.exp(-t / decay) : 0);

/**
 * Shot framing (SVG attribute, not a CSS transform): centre the world point (cx, cy) at zoom s on a w x h frame
 * (default 9:16, 1080 x 1920). Wide ≈ 0.75–1.1, medium 1.6–2, close-up 3–4.5. Per AGENTS short-form rule 2 the
 * framing changes by hard cut only; a slow push needs the style's camera exception. (The original `shake` helper
 * is left out: no camera shake in this repo.)
 */
export const camT = (cx: number, cy: number, s: number, w = 1080, h = 1920) => `translate(${w / 2} ${h / 2}) scale(${s}) translate(${-cx} ${-cy})`;
