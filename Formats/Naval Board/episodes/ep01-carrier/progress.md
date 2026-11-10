# How an Aircraft Carrier Defends Itself — progress

Naval Board #1 (was a one-off 16:9 episode, Lucas 2026-11-05: "dựng thêm 1 tập mới trước khi mình chốt", script pasted by Lucas). Same
look and pipeline as `Test/ambush`. 1920×1080 @ 30 fps, ~10:42.

## Files
- Script: `kich-ban-carrier-FINAL.md` (Lucas's text; 2 fact fixes, see `FACTS-carrier.md`) · spec: `01_EPISODE-SPEC_carrier.md`
  (8 TTS scenes = the 8 sections). Generator: scratch `mkcarrier.mjs` (dashes → commas/colons for TTS).
- VO: `voiceover/carrier.json` (gemini-3.8-flash-tts, voice Charon, naval narrator style, 22 takes; 2.2 s pause before
  each chapter, 1.2 s after the hook question) → `public/voiceover/carrier/`, `src/voiceover/carrier.{json,timing.json,words.json}`
- Video: `src/compositions/Carrier/Carrier.tsx` (27 scenes, chapter cards + progress strip, keyword subtitles, sound)
  + `navkit.tsx` (sea, ships, aircraft, missiles, rings, radar, data links, VLS, CIWS) + `maps.json`
  (`scripts/carrier-maps.mjs`: Natural Earth via world-atlas + d3-geo; Red Sea, Black Sea, Bab-el-Mandeb).
  Composition `Carrier-HowACarrierDefends`.
- Assets: sea `public/images/carrier/sea.jpg` (`scripts/make-sea-carrier.py`); SFX `scripts/make-sfx-carrier.py`
  (jet pass, missile launch, CIWS burst, radar/sonar ping, jamming, alarm); music `carrier-watch` preset
  (`scripts/make-music.py`, 340 s ×2 acrossfade → `public/sfx/music/own/carrier-watch.mp3`).

## Render
`npx remotion render Carrier-HowACarrierDefends out/carrier-raw.mp4 --crf=18 --muted` (~22 min) + audio
`npx remotion render Carrier-HowACarrierDefends mix.wav --codec=wav`, two-pass loudnorm I=-14 TP=-2.5 + alimiter 0.63,
one AAC encode, mux (`-map 0:v -map 1:a -c:v copy`) → `how-a-carrier-defends-itself.mp4`.

## Rounds
- v1: first cut, near-static 76%.
- v2 ("làm vòng chuyển động"): ambient + story motion, near-static 55%. `how-a-carrier-defends-itself-v2.mp4`.
- v3 (3D): four Blender shots (hook, fleet, VLS, Phalanx; 40 s) laid over the 2D scenes as `<Video>` with labels on top,
  near-static 51%. `how-a-carrier-defends-itself-v3.mp4`. Source `scripts/blender/carrier3d.py` (usage in its header) →
  `out/3d/<shot>/####.jpg` → `ffmpeg -framerate 30 … -crf 14 -pix_fmt yuv420p public/video/carrier/<shot>.mp4`;
  `shots3d.json` is written by the script and read by `Carrier.tsx`. The script has moved on since hook and fleet were
  rendered (slightly less warm sun): re-render all four if a shot must match exactly.
  Lessons: Cycles paints paths past `transparent_max_bounces` black, so smoke needs a high limit (128); sphere puffs read
  as smoke only with a silhouette + noise alpha fade (`soften`); under AgX fire above strength ~5 turns peach.
- v4 (Lucas 2026-11-06: 3D = 20% of the runtime, the rest stays 2D): eight more shots (hawkeye, drones, cap, escort,
  gravely, moskva, strait, dusk), 12 in total, 3 861 frames = 128.7 s = 20.06%. Near-static 41%.
  `how-a-carrier-defends-itself-v4.mp4`. Hawkeye and escort are encoded with `huesaturation=saturation=-0.75:colors=r+y`
  (the warm sun turned grey paint tan); hook, fleet, VLS and Phalanx were not, so their hulls still look tan.
  Render times: new 3D shots 13 h 46 min wall clock (Moskva alone about 2.2 min/frame at 18 threads, 55 s at 56);
  Remotion picture 20 min + WAV 9 min at default concurrency (`--concurrency=36` died on "Timeout while extracting
  frame" from hook.mp4; more concurrency measured slower, see Environment notes in `AGENTS.md`); master 2 min; QA 1 min.
  After v4 the script changed (default 8 samples, `preview` mode, Moskva 360 puffs at alpha 0.62): `out/3d/` and the v4
  MP4 still hold the 14-sample, 720-puff Moskva. Re-render Moskva only if the shot must change.

## Production pack (2026-11-09)
- `xuat-ban.md`: titles by the channel formula (main "How Aircraft Carriers Defend Themselves in 3 Rings"), description with chapters and sources, hashtags, 15 tags, pre-publish list. Thumbnails `thumb-a/b/c.jpg` (65 PLANES. 1 TARGET. / UNSINKABLE? / 1 MILE AWAY.) from composition `Carrier-Thumbnail`, checked at 320×180 on dark.

## Guide promise cut (2026-11-09)
- Lucas: cut "If you want the full ring diagram from this video as a printable guide, it is linked below." Removed from the FINAL script, the spec, `voiceover/carrier.json` and the manifest (line 123); `episode.mjs export … --tail=1.5` rebuilt `vo.mp3` and the timing from the same WAVs (no TTS request); words of line 124 shifted by −5.13 s. The outro title card now comes up on line 124.
- First run of `listen --precheck` on this episode: 3 hits on words. Radar ping under "One" moved to frame 0 and lowered to −30; the intercept blast on "yet." moved with its explosion sound to the end of line 66; the launch on "only" (line 31) stays with its missile on screen, lowered −24 → −30.
- Re-render (`naval-final.py`, picture 20 min + audio 9 min + master 2 min): 636.5 s, 19,096 frames, −14.0 LUFS, true peak −4.3 dBTP; same three pops as v4. Outro checked on stills: key line, title card, NEXT card. First listening gate (`NGHE.md`, with `--words`): 74% within a frame (chance 32%), 71% on accents (6%); 7 rows to hear (3 quiet: jet passes at 0:18 and 3:54, short explosion at 6:55; 4 slow or swelling sounds); covered words 7 in the speech band, the one that matters is "hunting" (1:59) under the sonar ping, 2 dB over the voice. Fixed the same day: the ping stays with its ring on screen and came down −24 → −30; audio-only re-render (audio 9 min + master 2 min, picture kept) and a new gate: "hunting" no longer covered, the ping is not among the quiet rows, covered words 4 in the speech band ("in", "and", and two music/timing gaps), 71% / 68% (chance 32% / 6%). 8 rows still to hear by ear (4 quiet: jet passes 0:18 and 3:54, short explosions 6:55 and 7:37; 4 slow or swelling sounds).
- If `npm run voiceover` is ever re-run, take t22 has new text and will cost one request.

## Open
- 2026-11-08: the v2, v3 and v4 MP4s were deleted by mistake while packaging (the unnumbered file was v1). **v4 rebuilt the same day** with `scripts/naval-final.py` from the committed code (only comments and a cue-log line changed since 1281eb7) and the 12 clips in `public/video/carrier/`: 641.7 s, 19,250 frames, −13.9 LUFS, true peak −3.9 dBTP, near-static 41.4%, the same three pops as `QA-v4.md` (41.3%, −14.1 LUFS). It replaces v1 as `how-a-carrier-defends-itself.mp4`; `QA.md` is its frame QA. Picture kept at `out/Carrier-HowACarrierDefends-picture.mp4` for `--audio-only` fixes.
- Moved from `Test/carrier` to `Formats/Naval Board/episodes/ep01-carrier` on 2026-11-08 (Lucas). The QA files keep the old path in their first line.
- The outro promises "a printable guide linked below" and a next video on submarines: neither exists yet.
- Nobody has listened to the whole VO yet; Whisper flagged line 72 only (likely "And" heard as "Then").
- Close-up ship and aircraft models are still untextured; bright 3D vs dark 2D look unresolved; 3D motion not watched in
  real time. Moskva is a generic Slava-like model; the strait launcher truck stays below frame (only the trail shows).
  Waiting on Lucas's verdict.
- `public/video/carrier/*.mp4` (about 520 MB) is not git-ignored and the 3D work is uncommitted: decide before committing.
