# How Ambushes Actually Work — progress

One-off episode (Lucas 2026-11-05: "tập ngoại lệ", channel rules do not apply). 16:9, 1920×1080 @ 30 fps, ~9:52.

## Files
- Script (locked, light TTS edits: "20 m" → "twenty meters", "50 m" → "fifty meters", "killer zone" → "kill zone",
  "Their job is stop" → "Their job is to stop", "The anti-armor being fired" → "The anti-armor fires first"):
  `kich-ban-ambush-FINAL.md` · spec (5 TTS scenes = the 5 chapters): `01_EPISODE-SPEC_ambush.md`
- VO: `voiceover/ambush.json` (Gemini `gemini-3.8-flash-tts`, voice Charon, 25 takes) → `public/voiceover/ambush/vo.mp3`,
  `src/voiceover/ambush.timing.json`, `src/voiceover/ambush.words.json` (Whisper), `vo-timestamps.md`
- Video: `src/compositions/Ambush/Ambush.tsx` (23 scenes, every cue on a VO word) + `kit.tsx` (top-down map kit).
  Composition `Ambush-HowAmbushesWork` (prop `subtitles`, default on).
- Sound: music `public/sfx/music/own/ambush-tension.mp3` (code-made, `make-music.py ambush-tension`);
  gunfire / drone / radio SFX code-made by `scripts/make-sfx-ambush.py` (no realistic auto-fire on Mixkit);
  explosions, truck, wind = library files.

## Next
Done 2026-11-05: `Test/ambush/how-ambushes-actually-work.mp4` (1920×1080, 30 fps, 17 750 frames, 591.7 s, −13.9 LUFS).
Re-render: `npx remotion render Ambush-HowAmbushesWork out/ambush-raw.mp4 --crf=18` (~20 min). Audio (round 6): repeated
AAC limiter passes give unpredictable true peaks, so master once from lossless: `npx remotion render Ambush-HowAmbushesWork
mix.wav --codec=wav` (~5 min), two-pass `loudnorm=I=-14:TP=-2.5` + `alimiter=limit=0.63`, one AAC 256k encode, mux with the
video stream (`-map 0:v -map 1:a -c:v copy`). v5 result: −14.0 LUFS, −2.4 dBTP. 4K: add `--scale=2`.
2026-11-05 round 2: frame review (`REVIEW-khung-hinh.md`), 15 visual problems fixed in `Ambush.tsx`, lint clean.
2026-11-05 round 3 (Lucas: "fix + thêm các đề xuất"): proposals 1–5, 7–9 built (see `REVIEW-khung-hinh.md`), VO pauses
lengthened (no new TTS), music bed extended to 1176 s, video ~10:08. Proposal 6 (real cases) not built: needs sourced facts.
2026-11-05 round 4: 5 sourced real-case cards (`FACTS-real-cases.md`), v3 rendered; honest review + score in `DANH-GIA-v2.md` (6/10, v3 ≈ 6.2).
2026-11-05 round 5 (Lucas: "làm luôn"): visual upgrade in `kit.tsx` (textured ground `public/images/ambush/ground.jpg`
from `scripts/make-ground-ambush.py`, lit tree crowns, rutted roads, top-down soldiers with helmet/arms/rifle and facing,
tracked vehicles, glowing tracers + muzzle flashes, blasts with sparks/smoke/scorch); 5 dead scenes rebuilt (21–23 site
selection map, 35–38 cover vs concealment with shooters + chips, 112–115 drill reps, 137–142 kill box that follows its
target, 146–151 scanning cone + DRONE FEED picture-in-picture with thermal). v4 = `how-ambushes-actually-work-v4.mp4`.
2026-11-05 round 6 ("làm tiếp"): ambient motion (clouds, wind, camera float) + story motion in the most static
scenes; v5 near-static 15% (v4 62%). `how-ambushes-actually-work-v5.mp4`.
2026-11-05: thumbnails A/B/C (`THUMBNAIL.md`, composition `Ambush-Thumbnail`).
Open: TTS split warnings on lines 08, 09, 26, 31, 72, 139 (checks.md); not listened to by a human yet.
