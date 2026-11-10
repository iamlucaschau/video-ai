# reference/ — public repos pulled for study (2026-10-08)

Shallow clones, **read-only reference**: nothing here is installed, built or
run. The clones themselves are git-ignored (re-pull with the commands below);
only this file is committed. Project rules (AGENTS.md "Short-form rules")
win over anything these repos suggest.

```sh
cd reference
git clone --depth 1 https://github.com/veedstudio/open-edit.git
git clone --depth 1 https://github.com/LottieFiles/motion-design-skill.git
git clone --depth 1 https://github.com/kylezantos/design-motion-principles.git
git clone --depth 1 https://github.com/Remocn/remocn.git
git clone --depth 1 https://github.com/reactvideoeditor/remotion-templates.git
git clone --depth 1 https://github.com/fliptheweb/motion-ui-design.git
git clone --depth 1 https://github.com/kelano86/what-if-animation.git
git clone --depth 1 https://github.com/mromidev/claude-animated-shorts.git
```

| Repo | License | What it is | Use here |
|---|---|---|---|
| [veedstudio/open-edit](https://github.com/veedstudio/open-edit) | Apache-2.0 | VEED's agent-driven editing pipeline (OpenEdit): transcribe → design in HTML/CSS → render with VEED's renderer; agent skill in `.claude/skills/open-edit/` | Not adopted as a pipeline (it replaces Remotion and its hosted transcription needs a VEED login). **Worth taking later:** its local WhisperX transcription (free, offline) for word-level VO timestamps → exact word-synced subtitles, and for transcribing reference videos |
| [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill) | MIT | Motion-director skill for AI agents: timing/easing tables, choreography, Disney principles, quality checklist | **Installed** as `.claude/skills/motion-design/` (copied with its LICENSE). Use for timing/easing/choreography; AGENTS.md overrides it (no camera shake, no zoom transitions, overshoot ≤ 5% unless a style says otherwise) |
| [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) | MIT | Web-UI motion skill (Emil Kowalski / Jakub Krehel / Jhey Tompkins references, audit + anti-checklists) | Reading only: `references/anti-checklist.md` and `audit-checklist.md` are good QA prompts. Not installed (aimed at interactive web UI) |
| [Remocn/remocn](https://github.com/Remocn/remocn) | MIT | 184 copy-paste Remotion components (shadcn registry): text reveals, transitions, charts, shaders | Vendor single components **on demand** into `src/components/` (keep the MIT notice in the file header), after checking them against our rules — see lists below |
| [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) | **none stated** | 81 small Remotion effect templates | Ideas only. **Do not copy code** (no license = all rights reserved) |
| [fliptheweb/motion-ui-design](https://github.com/fliptheweb/motion-ui-design) | none stated | Curated list of motion-design resources | Reading list |
| [kelano86/what-if-animation](https://github.com/kelano86/what-if-animation) | MIT (© 2026 FreshStack) | Claude Code skill: a 15–25 s "What If" cartoon from one line, every frame SVG in Remotion; ElevenLabs voice + SFX | **Adopted 2026-11-03** (Lucas approved W1–W10, `studio/DE-XUAT-WHAT-IF-ANIMATION.md`): rig + room kit + light → `Style Library/toon-engine/` (MIT notice kept); storyboard, word cues, pace → `scripts/shotlist.mjs`; covered-word check → `scripts/stems.py` + `studio:compare`; SFX onset / peak → `scripts/sfx-onsets.mjs` + `<Sfx align>`; board / motion checklists → `review-loop`. **Not taken:** ElevenLabs voice and AI-generated SFX (paid, non-commercial on the free plan, and against "real SFX only"), camera shake, its 16:9-only frame |
| [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts) | MIT (read at commit `e3b817b`, 2026-11-01) | Claude Code skill for animated shorts: 2D characters in 3D worlds, numpy-synthesized SFX / music | **Adopted 2026-11-04** (Lucas approved N1–N14, `studio/DE-XUAT-CLAUDE-ANIMATED-SHORTS.md`): ideas rewritten into `Style Library/M-hoat-su/`; its `templates/audio/` is the model for code-made SFX (AGENTS "Sound design"). **Not taken:** N15, N16, and the frames / sheets of another channel in its examples (private study, never in our videos) |

## Remocn components vs our short-form rules

**Fit (candidates to vendor when a script needs them):** `rolling-number`,
`number-wheel`, `slot-machine-roll`, `value-swap` (money counters) ·
`marker-highlight`, `ink-underline`, `scribble-circle`, `strikethrough-replace`,
`inline-highlight` (mark one keyword) · `check-list` (numbered rich steps) ·
`animated-bar-chart`, `animated-line-chart` (poor vs rich totals) ·
`mask-reveal-up`, `staggered-fade-up`, `spring-settle`, `micro-scale-fade`,
`soft-blur-in`, `per-word-crossfade` (short keyword entrances) ·
`ink-arrow`, `path-ride` (routes on a map, style E) · `fade-through`,
`slide-swap`, `wave-wipe` (clean scene changes) · `paper-sticker`, `polaroid`
(style A props).

**Banned by the rules:** zoom/camera tricks — `lens-zoom`, `zoom-blur`,
`zoom-words`, `ripple-zoom`, `focus-pull`, `camera-lens`, `whip-pan`,
`push-through`, `terminal-cursor-zoom`, `infinite-bento-pan`, `drift`,
`paper-wobble`; noisy/cartoon effects — `glitch-cut`, `rgb-glitch-text`,
`sustained-glitch`, `vhs-filter`, `crt-screen`, `confetti`, `speed-lines`,
`radial-burst`, `trim-burst`; dense text walls — `type-wall`, `word-stream`,
`type-repeater`, `line-by-line-slide`.
