# How an Aircraft Carrier Defends Itself — checks

| Check | Result | Evidence |
| --- | --- | --- |
| Facts in the script | pass after 2 fixes | `FACTS-carrier.md` (Gravely "about a mile"; Moskva defences hedged) |
| `npm run lint` | pass | eslint + tsc clean, 2026-11-05 |
| VO covers the whole script | pass | `episode.mjs prep`: spec ↔ FINAL, 124 sentences, 1597 words; Whisper heard 1604 |
| TTS split | 1 warning | line 72: "And" heard as "Then" (likely mishearing, not a split) |
| Every cue on a spoken word | pass | all cues use `A()/E()/W()` |
| Stills review round 1 (62 stills) | ~20 problems, fixed | `out/sheets/carrier-r1-1…7.png` → `carrier-r2-1…2.png`: black edges on zoom-outs, wake read as rails, text on subtitles, strait map filled wrong, "MINE" label, top-down Phalanx unreadable, hook showed no threats |
| Final render | pass | `how-a-carrier-defends-itself.mp4`: 1920×1080, 30 fps, 19 250 frames, 641.7 s |
| Loudness | pass | −14.1 LUFS, −4.0 dBTP (AAC overshot +3.9 dB on the synthetic CIWS clicks: master now low-passed 15.5 kHz, limited at 192 kHz, AAC 320k) |
| Frame QA (`QA.md`) | fail (motion) | near-static 488 s = 76% (Ambush v5: 15%); dark frames none; jumps only on chapter-card cuts |
| Music Content ID | pass | code-made `carrier-watch.mp3` |
| Motion round (v2) | better, not passing | sea streams past the fleet (mirrored texture, livelier swell, 460 whitecaps), ships station-keep, CAP jets orbit, side-view clouds/waves/bob, Phalanx slews, strait transit + shore launches, Moskva smoke, outro push-in + ring pulses, more camera float. QA near-static 351 s = 55% (v1 76%); holds ≥ 2 s 29 (v1 44); at 480×270 60% (v1 80%). Dark low-contrast sea measures as static even when it moves |
| Final render v2 | pass | `how-a-carrier-defends-itself-v2.mp4`: 19 250 frames, 641.7 s, −14.1 LUFS, −4.0 dBTP |
