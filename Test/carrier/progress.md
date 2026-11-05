# How an Aircraft Carrier Defends Itself — progress

One-off 16:9 episode (Lucas 2026-11-05: "dựng thêm 1 tập mới trước khi mình chốt", script pasted by Lucas). Same
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

## Open
- The outro promises "a printable guide linked below" and a next video on submarines: neither exists yet.
- Nobody has listened to the whole VO yet; Whisper flagged line 72 only (likely "And" heard as "Then").
