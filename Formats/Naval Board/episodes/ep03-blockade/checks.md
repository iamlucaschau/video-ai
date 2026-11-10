# How a Naval Blockade Wins Without Firing a Shot — checks

*One row per check: requirement · pass / fail / unresolved · evidence (a file, real command output, or frames looked at; never just "checked"). A `fail` gets at most 3 fix attempts, then ask Lucas. The episode is done when no `fail` is left and every `unresolved` has been reported to Lucas.*

| Check | Result | Evidence |
| --- | --- | --- |
| Every number and claim in the VO is in `FACTS-blockade.md` | pass (draft) | 41 sentences with numbers listed and matched row by row 2026-11-09; "20 days" is 400 M barrels ÷ 20 M b/d from two rows |
| Deadly Mistakes: each event has a source, official report where one exists | pass with hedges | Lloyd's List (page), CFR (page), Wikipedia for the German figures with both numbers and who gave them; no official report fits a blockade "mistake" |
| Structure: 7 parts, Deadly Mistakes, outro as agreed with Lucas | pass (draft) | Hook, title read as a question, roadmap, classic rule, map + enforcement + shore/Hormuz, 4 mistakes, key line + tease; no guide CTA |
| No "how to attack" language, no casualty detail | pass (draft) | Text search for how-to phrasing: none; deaths given as numbers only |
| Spec matches the script (`episode.mjs prep`) | | |
| Length 487–555 s and pace ≥ 175 wpm (`vo.mp3`) | unresolved | 1492 words, estimated about 505 s at 177 wpm; measure on the real voice |
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
| Hormuz 2026: economic angle, no side taken, every figure dated | pass (draft) | Only CENTCOM, IEA, EIA and Lloyd's List figures, each attributed; "These figures are from autumn 2026" in the VO |
