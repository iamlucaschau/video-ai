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
| 3D shots rendered and merged | pass | hook 283, fleet 285, VLS 309, Phalanx 325 frames at 1080p; `<Video>`, labels and subtitles seen in frames sampled from the v3 MP4 |
| 3D looks (stills) | pass after 3 rounds | smoke, fire, Phalanx gun and VLS grid fixed; ship close-ups still untextured. Motion itself not watched in real time |
| Final render v3 | pass | `how-a-carrier-defends-itself-v3.mp4`: 19 250 frames, 641.7 s, −14.1 LUFS, −4.0 dBTP |
| Frame QA v3 (`QA-v3.md`) | fail (motion) | near-static 329 s = 51% (v2 55%); 0 s inside the 3D shots; one-frame jump at f9921 is the first launch flash (intended), two others outside the 3D shots |
| Explosion on the SFX | pass | audio peak at 414.8 s, kill frame 12446 = 414.87 s |
| 3D share of the runtime (Lucas: 20%) | pass | 12 shots, 3 861 / 19 250 frames = 20.06% (`shots3d.json`) |
| New 3D shots rendered and merged | pass | all frame counts match; labels, subtitles and crossfades seen on boundary stills (`npm run sheet`) and on one frame per shot from the v4 MP4; black propeller blades fixed, Escort and Hawkeye paint graded |
| Final render v4 | pass | `how-a-carrier-defends-itself-v4.mp4`: 1920×1080, 30 fps, 19 250 frames, 641.7 s, −14.1 LUFS, −4.0 dBTP |
| Frame QA v4 (`QA-v4.md`) | fail (motion) | near-static 41% (v3 51%); no black or white frames; the 3 one-frame jumps are the same frames as v3 (f9921 = first launch flash, intended) |
| Motion and audio in real time | unresolved | not watched or listened to end to end |
| v4 rebuilt after the accidental delete (2026-11-08) | pass | ffprobe 1920×1080, 19,250 frames, 641.7 s, h264 + AAC; `QA.md` −13.9 LUFS, TP −3.9 dBTP, near-static 41.4% and pops at 330.7 / 477.5 / 596.5 s, matching `QA-v4.md` |
| Production pack (2026-11-09) | pass, 1 open | `xuat-ban.md`: every number in titles, thumbnails and description is in `FACTS-carrier.md`; thumbnails seen at 320×180 on dark, ≤ 3 words. Open: the outro's guide promise |
| Guide line cut and re-render (2026-11-09) | pass | ffprobe 1920×1080, 19,096 frames, 636.5 s; `QA.md` −14.0 LUFS, TP −4.3 dBTP, pops as v4; outro stills 619–634 s |
| Listening gate with --words (2026-11-09) | pass, rows to hear | `NGHE.md` after the ping fix: 71% / 68% (chance 32% / 6%); no key word covered (4 in the speech band: "in", "and", music and timing gaps). 8 rows still need an ear: 4 quiet SFX, 4 slow or swelling sounds |
