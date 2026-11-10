# How Submarines Actually Fight — checks

| Check | Result | Evidence |
| --- | --- | --- |
| Depth and speed by class | pass with hedges | `FACTS-submarines.md` §1: speed read in the Navy fact file; that page lists no depth, so 800 ft rests on commissioning reports |
| Sonar range | unresolved by design | §2: no public single figure; the script says so and uses sound speed and the 30-mile bending instead |
| Mistake event with an official report | pass | §6: NTSB MAB-05-01 (Greeneville), Navy investigations (Connecticut, San Francisco) |
| Official report that one noise gave a position away | fail | None found; U-864 rests on historians, and the script says "probably" |
| Length | pass | `vo.mp3` 532 s (window 487–555), 1,573 words |
| Every number in the VO is in the fact table | pass | Script comparison run 2026-11-07 |
| Structure: 7 parts, Deadly Mistakes, 1 CTA + 1 tease | pass | Read through against the formula |
| "How to attack" language | pass | Text search plus read-through |
| Spec matches the script | pass | `episode.mjs prep`: 9 scenes, 154 sentences, 1,573 words |
| Shot cues resolve on the real voice | pass | `shotlist.mjs`: 96 shots, 10.7 cuts/min, median 5.0 s, longest 13.8 s |
| On-screen text ≤ 5 words, ≤ 2 per shot, numbers in the fact table | pass | Same check |
| 3D share (Lucas: about 20%) | pass | 3,124 / 15,959 frames = 19.6% on the real voice |
| Blender under 6 hours | pass, measured | 4.0 h for 2,919 new frames + 0.7 h re-render = 4.7 h, `out/3d/sub-render.log` |
| Pace at least 175 wpm | pass | 177 wpm with pauses, tempo 1.14; raw take 166 wpm |
| Blocked sources read | pass, 1 left | Navy fact files and Navy sonar page read 2026-11-07; USNI 2018 blocked |
| Hook crew number against the Navy | pass | Navy: Virginia 145, Seawolf 140, Los Angeles 143; hook says 140 |
| Voice covers the script | pass by Whisper; Lucas approved the voice 2026-11-07 | `words.py` 1,580 heard / 1,573 written. Mishearings only (Fifty, U-9, Aboard, Le Triomphant). Split: "Two hit," fell in line 96, reads correctly. To listen: lines 31, 96, 104, 130, 139 |
| Final file | pass | ffprobe: 1920×1080, 30 fps, 16,110 frames, 537.0 s, h264 + AAC |
| Length with outro, window 487–555 s | pass | 537.0 s |
| Loudness | pass | `QA.md`: −13.9 LUFS, true peak −4.3 dBTP |
| Near-static under 35% (temporary target) | fail, close | 37.5%: 2D 36%, 3D 44%. Was 65.8% before the background motion fix; Carrier v4 41% |
| White frames, frozen shots to a blank picture | pass | `QA.md`: no white frames. Black frames are 1–3 frame crossfades between the darkest cards; pop at 363.0 s is the same crossfade (looked at, 10886–10896) |
| 3D flicker | pass after fix | Own frame comparison on all 12 clips. `seamount` hull went black in runs of frames with `use_persistent_data`; off for that clip, 0 jumps now |
| Lint | pass | `npm run lint` |
| Text inside the frame at full drift | pass | Two edge rows narrowed; stills checked on the final MP4 |
| SFX sync (earshot on the demucs background stem) | pass | `NGHE.md`: 83% within a frame (chance 35%), 77% on accents (chance 7%), 35 SFX. 3 flagged rows are slow-attack sounds (torpedo run, hull groan, distant blast), kept |
| Words masked by the background (W5), speech band 300–3400 Hz | pass after fix | Before: 26 of 1,573 words, worst "You can see" 20 dB under a ping. After: 12, all within about 2 dB except weak words ("and", a breath) |
| Words masked, full band | pass after fix | Before: 30 words, worst "and 323" 18 dB under the Belgrano blast. After: 23, none more than 4 dB |
| Mix heard by a person | unresolved | Measured only; nobody has listened yet |
| Thumbnails readable at phone size (320×180), ≤ 3 words, bottom-right free | pass | `thumb-a/b/c.jpg` seen at 320×180 side by side; red ring on B moved onto the pinging boat after the first look |
| Titles and description claim only what the fact table supports | pass | `xuat-ban.md`: title 3 follows AFP ("didn't know they'd hit each other"), not the minister's "too quiet"; "reported" / "publicly credited" kept |
| Guide named in the outro exists | resolved by removal | Lucas 2026-11-08: drop the promise. Line 153 cut from the VO (no new TTS), the guide card I03 removed, the description no longer mentions a guide |
| Outro after the guide line was cut (2026-11-08) | pass | Re-render 532.0 s, −14.0 LUFS, TP −3.7 dBTP; stills at 516–531 s: key line, Blockade tease, NAVAL BOARD card; earshot 80% / 74% (chance 34% / 7%); masking 11 words speech band, 21 full band |
| Listening gate, new form with --words (2026-11-08) | pass, 1 open | `NGHE.md` on the final mp4: 83% within a frame (chance 34%), 74% on accents (7%). 4 rows to hear: hull creak 0:02.9 and torpedo run (quiet beds, kept), distant blast and hull touch (slow attack, kept); none heard by ear yet. Hits on words: 1, the blast on "hit." (6:30), on purpose but it covers the word in full band: open, Lucas to decide. Covered words: 12 speech band (weak words, except "hit."), 23 full band; the worst full-band row (6.6 dB) is "He" at 6:27.9, where the voice reads −44 dB, i.e. a timing gap, not a covered word |
| Blast on "hit." (6:30) after Lucas said fix it (2026-11-08) | pass | Kept on the word (the glow lands there, and there is no pause before "All 73"), lowered −28 → −34. Audio-only render (10 min) + master onto the unchanged picture, no picture render. `NGHE.md`: "hit." no longer covered; the blast is not in the quiet rows, so it still rises over the bed. Covered words 11 speech band, 20 full band. −14.0 LUFS, TP −4.3 dBTP |
