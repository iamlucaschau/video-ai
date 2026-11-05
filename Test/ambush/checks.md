# How Ambushes Actually Work — checks

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run lint` | pass | eslint + tsc clean, 2026-11-05 |
| VO covers the whole script | pass | `episode.mjs prep`: spec ↔ FINAL match, 153 sentences, 1570 words heard by Whisper |
| TTS split (each line starts/ends on its own words) | unresolved | `words.py`: lines 08, 09, 26, 31, 72, 139 flagged (08 holds "You're hiding" of 09; 26/31 likely Whisper mishearing "If"/"The"). Audio itself is continuous; only cue timing on those lines may be off by a few words |
| Every visual cue on a spoken word | pass | all cues use `A()/E()/W()` from timing + words json |
| Stills review | pass after fixes | `out/sheets/ambush-1…6.png`, `ambush-fix-1.png`: fixed AT blasts off the vehicles, bottom tags under subtitles, KILL ZONE label under soldiers, black edge in final zoom, early security element |
| Frame review, 1 still per VO line (2026-11-05, round 2) | pass after fixes | 15 problems in `REVIEW-khung-hinh.md`, all fixed in code (stills `out/sheets/ambush-fix2-1…3.png`); the MP4 is NOT re-rendered yet |
| Retention build, round 3 (cold open, L camera, choice row, chapters, keywords, sound, recap) | pass on stills | `out/sheets/ambush-new-1…4.png`; not listened to end to end by a human |
| Final render v2 | pass | `how-ambushes-actually-work-v2.mp4`: 1920×1080, 30 fps, 18 229 frames, 607.7 s, −14.0 LUFS, true peak −1.9 dBFS; 2 frames sampled from the MP4 |
| Real-case cards (5, sourced) + render v3 | pass | `FACTS-real-cases.md`, stills `out/sheets/ambush-cases-1.png`; `how-ambushes-actually-work-v3.mp4` 607.7 s, −14.0 LUFS, −1.8 dBTP |
| Frame QA v3 (`short-qa.py`) | fail (motion) | 66% of the time near-static (402 s); dark frames only on cards/recap (intended); jumps only on the flash / card cuts |
| Visual upgrade + 5 scenes rebuilt, render v4 | pass | stills `out/sheets/ambush-rebuilt-1…6.png`, `ambush-v4-1…4.png`; `how-ambushes-actually-work-v4.mp4` 607.7 s, −14.0 LUFS, −1.8 dBTP; 4 frames sampled from the MP4 |
| Frame QA v4 (`short-qa.py`) | fail (motion), better | near-static 377 s = 62% (v3: 402 s = 66%); 41 holds ≥ 2 s (v3: 46); dark frames only on chapter card / recap |
| Ambient + story motion, render v5 | pass | cloud shadows, wind in the trees, slow camera float, ghost patrol on the route, blue return fire, squad detour + counter fire, drone push-in, flowing fiber, burning wrecks; doctrine card moved after "push" (it gave the answer away) |
| Final render v5 | pass | `how-ambushes-actually-work-v5.mp4`: 1920×1080, 30 fps, 18 229 frames, 607.6 s, −14.0 LUFS, −2.4 dBTP (lossless-mix master); doctrine card checked after "push" in the MP4 |
| Frame QA v5 (`short-qa.py`) | pass (motion) | near-static 93 s = 15% (v4: 62%); holds ≥ 2 s: 3 (v4: 41) |
| Music has no Content ID risk | pass | code-made `ambush-tension.mp3` |
| Gunfire / drone SFX | pass (code-made) | no realistic auto-fire on Mixkit gun/war pages; `scripts/make-sfx-ambush.py` |
| Final render | pass | 1920×1080, 30 fps, 17 750 frames, 591.7 s, −13.9 LUFS integrated; 4 frames sampled from the MP4 | `how-ambushes-actually-work.mp4` |
