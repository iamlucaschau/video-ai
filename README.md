# VIDEO AI: programmatic motion graphics with Remotion

Polished motion-graphics videos written as React components, built to be
extended by AI coding agents. Uses Remotion 4.0.532, React 19, TypeScript, and Rspack.

## Quick start

```bash
npm i                # install dependencies
npm run dev          # open Remotion Studio at http://localhost:3000
npm run render       # render the sample to out/showcase.mp4
npm run still        # render frame 60 to out/showcase.png
npm run lint         # eslint + typecheck
npm run tts:check    # validate Gemini TTS keys
npm run voiceover -- voiceover/example.json   # generate narration
```

## The sample: `Showcase`

A 10.8 s, 1920×1080, 30 fps video in three scenes, joined by slide and fade
transitions:

1. **Intro**: springy geometric shapes and a masked, staggered headline reveal
2. **Features**: glass cards with shape icons, synced "pop" sounds, and an eased progress counter
3. **Outro**: a circular color reveal, a per-character title, and a fade to black

Each scene is also registered on its own under **Showcase-Scenes** in Studio.
Text and colors are editable live in the Studio props panel. Their defaults
live in `src/compositions/Showcase/schema.ts`.

## Customize

- **Resolution and fps**: `VIDEO` in `src/config.ts`
- **Scene and transition durations** (in seconds): `SHOWCASE_TIMING` in `src/config.ts`
- **Palette, fonts and type scale**: `src/theme.ts`
- **Reusable animation building blocks**: `src/components/` and `src/lib/animation.ts`

See **[AGENTS.md](AGENTS.md)** for the full guide to creating scenes,
animating typography and graphics, syncing audio, previewing, and rendering.

## Voiceover

Narration is generated with Gemini TTS (two API keys, rotated with automatic
failover). Keys live in the git-ignored `gemini_key.txt` (4 keys) or in `.env` (see
`.env.example`). Write lines in `voiceover/<name>.json`, run
`npm run voiceover -- voiceover/<name>.json`, then drop
`<Voiceover manifest={...} />` into a composition. Details are in AGENTS.md.

## Rendering options

```bash
npx remotion render Showcase out/showcase-4k.mp4 --scale=2        # 3840×2160
npx remotion render Showcase out/custom.mp4 --props='{"title":"Hello there."}'
npx remotion render Showcase out/hq.mp4 --crf=16                  # higher quality
npx remotion render Showcase out/clip.mp4 --frames=0-104          # intro only
```

## License note

Remotion is free for individuals and companies of up to 3 people. See the
[Remotion license](https://remotion.pro/license). The bundled sound effects in
`public/audio/` were generated for this project with FFmpeg.
