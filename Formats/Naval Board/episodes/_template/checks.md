# [Tiêu đề] — checks

*One row per check: requirement · pass / fail / unresolved · evidence (a file, real command output, or frames looked at; never just "checked"). A `fail` gets at most 3 fix attempts, then ask Lucas. The episode is done when no `fail` is left and every `unresolved` has been reported to Lucas.*

| Check | Result | Evidence |
| --- | --- | --- |
| Every number and claim in the VO is in `FACTS-SLUG.md` | | |
| Deadly Mistakes: each event has a source, official report where one exists | | |
| Structure: 7 parts, Deadly Mistakes, outro as agreed with Lucas | | |
| No "how to attack" language, no casualty detail | | |
| Spec matches the script (`episode.mjs prep`) | | |
| Length 487–555 s and pace ≥ 175 wpm (`vo.mp3`) | | |
| Voice covers the script (`words.py`), lines to listen to named | | |
| Shot cues resolve on the real voice (`shotlist.mjs`) | | |
| On-screen text ≤ 5 words, ≤ 2 per shot, numbers in the fact table | | |
| 3D share about 20%, Blender under 6 h, neighbouring frames compared | | |
| Hits on spoken words (`listen --precheck`) fixed or kept on purpose | | |
| `npm run lint` clean | | |
| Final file: 1920×1080, 30 fps, h264 + AAC (`ffprobe`) | | |
| Loudness −14 LUFS ±1, true peak ≤ −1.5 dBTP (`QA.md`) | | |
| Near-static under 35% (`QA.md`) | | |
| Listening gate with `--words`: every "Cần nghe" row decided, key words not covered (`NGHE.md`) | | |
| Lucas watched and listened | | |
| Production pack: titles, description with sources, hashtags, tags, 3 thumbnails at 320×180 (`xuat-ban.md`) | | |
