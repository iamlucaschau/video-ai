# AGENTS.md — Remotion motion-graphics project

Instructions for AI coding agents (Claude Code, Codex, Cursor, …) working in
this repo. Videos here are **React components rendered frame by frame** with
[Remotion](https://www.remotion.dev) 4.0.532.

Remotion Agent Skills are installed in `.claude/skills/` and `.agents/skills/`.
**Load `remotion-best-practices` before writing Remotion code**. It routes to
topic guides for markup, timing, transitions, audio, fonts, captions,
rendering, etc. If a skill and this file disagree on project conventions, this
file wins. For anything else, the skill (and https://www.remotion.dev/docs) wins.

## Commands

| Task | Command |
| --- | --- |
| Open Studio (preview + timeline) | `npm run dev` → http://localhost:3000 |
| Open Studio headless (agents) | `npx remotion studio --no-open` |
| Open one composition | `http://localhost:3000/<composition-id>` |
| List compositions | `npx remotion compositions` |
| Render the sample MP4 | `npm run render` → `out/showcase.mp4` |
| Render any composition | `npx remotion render <id> out/<name>.mp4` |
| Render a still | `npx remotion still <id> out/frame.png --frame=60` |
| Typecheck + lint | `npm run lint` (run after every change) |
| Add a Remotion package | `npx remotion add @remotion/<pkg>` (keeps versions in sync) |
| Upgrade Remotion | `npx remotion upgrade` |

Useful render flags: `--props='{"title":"Hi"}'` or `--props=./props.json`,
`--scale=2` (e.g. 1080p → 4K), `--width/--height` overrides,
`--codec=h264|h265|vp9|prores`, `--crf=18` (higher quality),
`--frames=0-89` (render a range), `--muted`.

## Project layout

```
src/
  index.ts                 registerRoot(), don't touch
  Root.tsx                 registers every <Composition> (id, size, fps, duration, schema, defaultProps)
  config.ts                VIDEO (width/height/fps), DESIGN canvas, scene timings in SECONDS, toFrames()
  theme.ts                 FONTS (Google Fonts), COLORS, TYPE scale, SAFE area
  lib/voiceover.ts         voiceoverTimeline(), voiceoverDurationInFrames() for TTS manifests
  voiceover/*.json         generated TTS manifests (durations), do not edit by hand
  lib/animation.ts         EASE presets, CLAMP, progress(), fadeUp(), popIn(), float(), stagger(), mix()
  components/              reusable building blocks (import from "../components")
    Stage.tsx              1920×1080 design canvas scaled to the real output size
    Background.tsx         animated gradient orbs + grid + vignette (full-bleed)
    AnimatedText.tsx       masked per-word / per-char staggered text reveal
    AccentLine.tsx         gradient bar that draws in
    FloatingShape.tsx      positions a shape with springy entrance + ambient drift
    GlassCard.tsx          frosted card with rise-in entrance
    Counter.tsx            eased number count-up
    Voiceover.tsx          plays a TTS manifest line by line
  compositions/
    Showcase/              the sample video
      Showcase.tsx         TransitionSeries of scenes + synced sound effects
      schema.ts            Zod props schema + showcaseDefaults (Studio-editable props)
      scenes/*.tsx         one file per scene
    _template/             SceneTemplate.tsx, a copyable starter (not registered)
scripts/tts.mjs            Gemini TTS generator (check / say / build), multi-key rotation
voiceover/*.json           voiceover scripts (input for npm run voiceover)
public/
  audio/                   whoosh.wav, pop.wav (generated, royalty-free). Add music/VO here
  images/  fonts/          static assets, referenced with staticFile("images/x.png")
out/                       render output (git-ignored)
```

## Changing resolution, frame rate, duration

- **Resolution / fps**: edit `VIDEO` in `src/config.ts`. Everything is laid
  out on the 1920×1080 `DESIGN` canvas inside `<Stage>`, so other 16:9 sizes
  (720p, 4K) scale automatically. For vertical/square formats, register a new
  composition with its own layout rather than relying on scaling.
- **Duration**: edit `SHOWCASE_TIMING` (seconds) in `src/config.ts`. Total
  duration is computed by `getShowcaseDuration()`, which already subtracts the
  transition overlaps. Never hard-code frame counts.

## Core rules (non-negotiable)

1. **Animate only with the frame.** Derive all motion from `useCurrentFrame()`
   via `interpolate()` / `spring()` / `Easing`. CSS `transition`,
   `@keyframes`, `animation`, Tailwind animation classes, `setTimeout`, and
   `Date.now()` do NOT render correctly. Use `random("seed")` from `remotion`,
   never `Math.random()`.
2. **Think in seconds, convert with fps.** Write ranges as `[0.5 * fps, 1.2 * fps]`
   and get `fps` from `useVideoConfig()`. `durationInFrames` and `from` props
   must be integers, so use `toFrames(seconds, fps)` from `config.ts`.
3. **Always clamp.** Pass `extrapolateLeft/Right: "clamp"` (or spread `CLAMP`)
   unless overshoot is intentional.
4. **Use `scale`, `translate`, `rotate` CSS properties**, not `transform`
   strings. For scale animations add `output: "perceptual-scale"`.
5. **Assets go in `public/`** and are referenced with `staticFile()`. Images:
   `<Img>` or `<CanvasImage>` from `remotion`. Video/audio: `<Video>` /
   `<Audio>` from `@remotion/media`. Never use raw `<img>`, `<video>`, or `<audio>`.
6. **Fonts** come from `@remotion/google-fonts/<Font>` and are loaded once in
   `theme.ts`. Use `FONTS.display` / `FONTS.body`. Local fonts: put them in
   `public/fonts` and load them with `@remotion/fonts`.
7. **Run `npm run lint`** after changes, then visually verify (see below).

## Studio-editable markup

Remotion Studio can select, drag and keyframe elements when markup follows
these conventions (see the `remotion-interactivity` skill):

- Wrap one-off layers in `<Interactive.Div name="Descriptive name">` (also
  `.Span`, `.H1`, `.Svg`, …), and give `<Sequence>`, `<Audio>`, and shapes a `name`.
- Keep `style` as an inline object literal with inline `interpolate(frame, …)`
  calls and hard-coded output ranges/easing. Ranges may use `fps`,
  `durationInFrames`, `width`, `height` (e.g. `2 * fps`).
- Reusable components in `src/components` compute their styles from props;
  that's fine. Use them for repeated patterns, and inline `Interactive.*` for
  scene-specific layers.

## How to create a new video

1. Create `src/compositions/<Name>/` with `<Name>.tsx`, `schema.ts` (if it
   takes props), and `scenes/` (one file per substantial scene). Start from
   `src/compositions/_template/SceneTemplate.tsx`.
2. Add timings (in seconds) to `src/config.ts`, next to `SHOWCASE_TIMING`.
3. Register the composition in `src/Root.tsx`, using `VIDEO.width/height/fps`.
   Also register each scene as its own composition inside a `<Folder>`
   ("connected compositions") so it can be previewed and edited alone. Give
   each scene the same props it receives in the parent.
4. Follow the `remotion-markup` skill's video-layout rules: one focal point per
   scene, key content inside `SAFE` (140px sides / 110px top & bottom), and
   headline ≥ 96px, body text ≥ 40px on the 1920 canvas.

### Scenes and transitions

- `<TransitionSeries>` (from `@remotion/transitions`) for scenes with
  transitions: `fade()`, `slide({direction})`, `wipe()`, `flip()`,
  `clockWipe()`. Timing: `linearTiming({durationInFrames, easing})` or
  `springTiming({config: {damping: 200}})`.
- Transitions **overlap** scenes: total = Σscenes − Σtransitions.
- `<Series>` for back-to-back scenes without transitions; `<Sequence from>` to
  place a layer at an absolute time. Inside a sequence, `useCurrentFrame()`
  starts at 0.

### Typography

- `AnimatedText` handles masked word/char reveals (`by`, `start`, `stagger`, `duration`).
- Stagger groups with `stagger(i, step, base)` from `lib/animation.ts`.
- Entrances: `EASE.out` (bezier 0.16,1,0.3,1). Moves: `EASE.inOut`. Pops:
  `EASE.bouncy`. Settles with no overshoot: `EASE.spring`.
- Fitting or measuring text: see the `measuring-text` guide in the markup skill
  (`@remotion/layout-utils`).

### Graphics

- Vector shapes: `@remotion/shapes` (`Circle`, `Rect`, `Triangle`, `Star`,
  `Polygon`, `Ellipse`, `Pie`, `Heart`, `Arrow`…). Wrap them in `FloatingShape`
  for entrance + drift.
- Path animation (draw-on strokes, morphing): `npx remotion add @remotion/paths`
  (`evolvePath`, `interpolatePath`).
- Colors over time: `interpolateColors(frame, [0, 30], ["#000", "#fff"])`.
- 3D: `@remotion/three` (see the `3d` guide in the markup skill). Lottie: `@remotion/lottie`.

### Audio and sync

- `<Audio src={staticFile("audio/music.mp3")} volume={0.6} />` from
  `@remotion/media`. Delay with `from={toFrames(2.5, fps)}`. Trim with
  `trimBefore`/`trimAfter` (frames). Fade with
  `volume={(f) => interpolate(f, [0, fps], [0, 1], CLAMP)}`.
- **Sync rule:** compute audio `from` from the *same* constants that time the
  visuals (see `Showcase.tsx`: whooshes start 0.15 s before each transition;
  `FeaturesScene.tsx`: pops use the card stagger timing). Never hand-tune
  separate numbers.
- Audio inside a scene component is relative to that scene's start.
- For music-driven cuts, get the duration with `parseMedia` or `ffprobe` and
  set `calculateMetadata` on the composition (see the `calculate-metadata` guide).
- Voiceover / captions: see the `voiceover.md` guide and the `remotion-captions` skill.

## Verifying your work

1. `npm run lint` must pass.
2. Spot-check frames with `npx remotion still <id> out/check.png --frame=<n>`
   and view the image. For several frames, either run `still` per frame or
   render a range as images: `npx remotion render <id> out/seq --sequence --frames=90-100 --image-format=jpeg`.
   ⚠️ Known Remotion 4.0.532 bug: a comma list (`--frames=20,96,212`) can
   crash with `EINVAL ... inline-audio-mixing` when a listed frame overlaps an
   `<Audio>` clip (even with `--muted`). Use `still` or contiguous ranges instead.
3. Preview playback in Studio (`npx remotion studio --no-open`, then open
   `http://localhost:3000/<id>`).
4. Full render: `npx remotion render <id> out/<id>.mp4`. Confirm with
   `ffprobe out/<id>.mp4` (dimensions, fps, frame count, audio stream).
5. Delete scratch outputs in `out/` that the user didn't ask for.

## Voiceover (Gemini TTS)

`scripts/tts.mjs` generates narration with the Gemini API
(`POST /v1beta/interactions`, model `gemini-3.8-flash-tts`, 24 kHz mono WAV).

- **Keys**: two keys are configured in `gemini_key.txt.txt` (git-ignored).
  The script also accepts `GEMINI_API_KEYS=key1,key2` in `.env` (see
  `.env.example`). Requests rotate across keys round-robin and automatically
  fail over to the next key on 401/403/429/5xx. **Never print, log, or commit keys.**
- **Check keys** (no quota used): `npm run tts:check`
- **One-off line**: `npm run tts -- say "Xin chào" --out public/voiceover/hello.wav --voice Kore --style "warm, calm"`
- **Full script** (preferred): write `voiceover/<name>.json` (see
  `voiceover/example.json`: `lines[]` with `id`, `text`, optional
  `voice`/`style`/`model`), then `npm run voiceover -- voiceover/<name>.json`.
  This writes `public/voiceover/<name>/<id>.wav` plus a manifest at
  `src/voiceover/<name>.json` with each line's exact duration. Unchanged lines
  are cached by hash; `--force` regenerates everything.
- **Voices**: Zephyr, Puck, Charon, Kore, Fenrir, Leda, Orus, Aoede,
  Callirrhoe, Autonoe, Enceladus, Iapetus, Umbriel, Algieba, Despina, Erinome,
  Algenib, Rasalgethi, Laomedeia, Achernar, Alnilam, Schedar, Gacrux,
  Pulcherrima, Achird, Zubenelgenubi, Vindemiatrix, Sadachbia, Sadaltager,
  Sulafat. Vietnamese and 130+ languages are supported; language is detected
  from the text. Steer delivery with `style` (emotion, pace, tone). Inline tags
  like `<short pause>` work inside `text`.
- **Use in a video** (timing comes from real audio durations):

  ```tsx
  import manifest from "../../voiceover/example.json";
  import { Voiceover } from "../../components";
  import { voiceoverTimeline, voiceoverDurationInFrames } from "../../lib/voiceover";

  <Voiceover manifest={manifest} gapSeconds={0.35} startSeconds={0.5} />
  // Sync visuals: voiceoverTimeline(manifest, fps, {...})[i].from / .durationInFrames
  // Size the composition: durationInFrames={voiceoverDurationInFrames(manifest, VIDEO.fps, {...}) + tail}
  ```

  Pass the same `gapSeconds`/`startSeconds` to the component and the timeline
  helpers so audio and visuals stay locked together. Lower music under VO
  (`volume={0.25}`).
- Windows note: send Vietnamese text via a UTF-8 JSON file (as the script
  does), not inline in a `curl -d` argument, or the request body gets corrupted.

## Props

`showcaseSchema` (Zod) exposes props in the Studio sidebar. Defaults live in
`showcaseDefaults` (`schema.ts`), shared by the full video and the scene
previews. Studio edits apply live, but because defaults are shared rather than
inline, Studio can't save them back. To persist a change, edit
`showcaseDefaults`. Colors use `zColor()` from `@remotion/zod-types`.

## Environment notes

- Node 24, npm (keep `package-lock.json`), Windows. The project path contains
  a space (`VIDEO AI`), so quote paths in shell commands.
- Rendering uses Remotion's bundled Chrome Headless Shell (downloaded on first
  render) and bundled FFmpeg. System FFmpeg 9 is also available for audio/video prep.
- All `remotion` and `@remotion/*` packages must share the exact same version.
  Use `npx remotion add` / `npx remotion upgrade`, never a bare `npm i @remotion/x`.
- Licensing: Remotion is free for individuals and companies of up to 3 people.
  Larger companies need a license (https://remotion.pro/license).
