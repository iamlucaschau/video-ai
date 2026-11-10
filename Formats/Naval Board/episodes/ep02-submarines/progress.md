# How Submarines Actually Fight — progress

Naval Board #2. Formula: `Formats/Naval Board/00_he-thong/02_CONG-THUC.md`.

| Gate | Status |
| --- | --- |
| Fact table | Done, hand checks still open: `FACTS-submarines.md` |
| Script | Approved by Lucas 2026-11-07: `kich-ban-submarines-FINAL.md` |
| Spec + voice | Approved by Lucas 2026-11-07: `vo.mp3` (532 s, 177 wpm), `voiceover/submarines.json` (Charon, 26 takes, tempo 1.14) |
| Shot list | Done on the real voice: `shots.json`, `shots.timeline.json`, `shotlist.md` |
| Picture, render | Done 2026-11-07, waiting for Lucas to watch: `how-submarines-actually-fight.mp4` (537 s, 1080p30, −14.0 LUFS), `QA.md` |
| Commit | Not committed |

## Decisions

- Lucas 2026-11-07: new hook, four mistakes (U-864, Greeneville, Connecticut, Vanguard/Triomphant), script approved.
- USS San Francisco is a short backup inside mistake three.
- No sonar range given as one number; the script says why.
- Names changed for the voice after approval, same meaning: "H.L. Hunley" → "Hunley" (the sentence splitter broke on it), "HSwMS Gotland" → "Gotland".
- Lucas 2026-11-07: hook says "140 sailors" (Navy crews: 145, 140, 143).
- Lucas 2026-11-07: Dena line replaced, the first-day count of 87 is not used.
- 3D: no impact shown on people; Novorossiysk stays 2D because the hit is disputed; `fleet` reused from Carrier at no render cost.

## Open issues

- Nobody has watched the full video or heard the mix yet. Stills and contact sheets were checked, and the mix was measured with earshot and a masking check (`NGHE.md`, `checks.md`), not heard.
- "Two hit," is spoken at the end of line 96, not 97 (TTS split): cues named W("97", "two") land on "and". The blast now sits just before "and 323", quiet.
- Near-static 37.5% against the temporary target of 35% (Carrier v4 41%). `G09` (Dena, 285/322 frames) is still on purpose. The measure counts slow drift on dark scenes as static.
- Blast glow on `belgrano` and `u864` is a 2D layer placed at measured picture positions (`BlastGlow`); re-rendering those clips with a new camera means moving it.
- `blow` opens on about 1.5 s of empty sea, and its spray reads as chunky white pieces. Kept.
- USNI 2018 still unread (Cloudflare block), affects only the Carrier line below.
- Carrier script line 15 ("Usually an attack submarine") may overstate: see the end of `FACTS-submarines.md`.
- The guide promise was cut from this episode (Lucas 2026-11-08). Carrier's outro still names a guide.
- At commit, choose whether `public/voiceover/submarines/*.wav` go in (the episode `vo.mp3` copy is now git-ignored).

## Next step

1. Lucas watches the MP4 and lists what to change.
2. Episode #3: How a Naval Blockade Actually Works.

## Production pack (2026-11-08)

- `xuat-ban.md`: 3 titles, description with chapters and sources, hashtags, 15 tags, pre-publish list.
- Thumbnails `thumb-a/b/c.jpg` (WHO HEARS FIRST? / DON'T PING / TOO QUIET) from composition `Submarines-Thumbnail`, on frames of the episode's own Blender shots copied to `public/images/submarines/`. Checked at 320×180.
- The description carries a `[GUIDE LINK]` placeholder until the guide exists.
- After studying the top thumbnails on the same search (`THAM-KHAO-THUMB.md`): added D (bright, hull fills the frame) and E (diagram on black, like the 47× outlier). Suggested Test & compare set: E, D, C. A and B (dark, small boats) deleted on Lucas's request, with their code and background frames.
- Title changed after Lucas's title analysis (`C:/Users/ADMIN/Downloads/PHAN-TICH-TITLE-TAU-NGAM.md`): main title now "How Submarines Fight What They Can't See"; "How Submarines Actually Fight" is the backup. D and E now read "HEARS YOU FIRST." The VO still asks "So how do submarines actually fight?" at 0:26; the hook at 0:04–0:10 already asks the new title's paradox, so no re-record unless Lucas wants an exact match (line 13, one TTS request). Lucas 2026-11-08: keep it as is, no re-record.

## Decisions after earshot (2026-11-08)

- Every hit moved into the pause after its word; pings and long blasts lowered 3–9 dB. CLASSIFIED and PREVENTABLE stamps moved with their sound to the end of the word. The splash under the emergency blow was removed (not heard over the air blow).

## Guide promise removed (2026-11-08)

- Lucas: drop the line "The full diagram from this video … is in the guide linked below." Removed from the FINAL script, the spec, `voiceover/submarines.json` and the manifest (line 153). `episode.mjs export` rebuilt `vo.mp3` and the timing from the same per-line WAVs (no TTS request); words of line 154 shifted by −4.96 s. Shot I03 (guide card) removed; I02 now runs into I04. The outro is now the key line, then the Blockade tease, which departs from the formula's one-CTA rule (2.7) by Lucas's decision.
- If `npm run voiceover` is ever re-run, take t26 (scene 9) has new text and will cost one request.
- Description: guide link removed, "Thanks for watching!" added before the hashtags.
- Re-render: 532.0 s, 15,961 frames, 1080p30, −14.0 LUFS, true peak −3.7 dBTP. Near-static still 37.5%; black frames and the 363.0 s pop are the same 1–3 frame crossfades as before. earshot: 80% within a frame (chance 34%), 74% on accents (chance 7%), the same 3 slow-attack rows plus the hull creak at 0:02.9 (1 dB over the bed; a quiet bed sound under the hook, kept, not heard by ear yet). Masking: 11 words in the speech band, 21 full band, none worse than before. Outro checked on stills: key line, then the Blockade tease, then the NAVAL BOARD card.

## Listening gate in three stages (2026-11-08)

- `npm run listen` gained `--precheck` (hits on words, from code, ~20 s) and `--words` (covered words per word via `scripts/word-masking.py`); AGENTS.md, review-loop and the NEON ODDS skill updated. Run on this episode: precheck 1 row (blast on "hit."), full gate 11 min, `NGHE.md` rewritten in the new form.

- Lucas: fix the blast on "hit.". Lowered 6 dB in place; only the audio was re-rendered and muxed onto the existing picture (`out/sub-picture.mp4`, kept for further sound-only fixes). The precheck still lists it: it reads placement, not level.

## Packaging (2026-11-08)

- Moved from `Test/submarines` to `Formats/Naval Board/episodes/ep02-submarines` (Lucas); imports in `Submarines.tsx` and `sub3d.py` follow. `QA.md` keeps the old path in its first line.
- Render + master is now `scripts/naval-final.py` (was a scratch script); the kept picture is `out/Submarines-HowTheyFight-picture.mp4`, so a sound-only fix is `--audio-only`.
- `vo.mp3` in the episode folder is git-ignored as a listening copy (the tracked one is `public/voiceover/submarines/vo.mp3`).

## Time log

- 2026-11-07: fact research, script, shot list, voice. No render.
- 2026-11-07: build. Blender 4.0 h for 12 clips (39–60 tenths of a second per frame = 3.9–6.0 s/frame) + 0.7 h re-rendering 3 clips after review, 4.7 h total. Remotion picture about 17 min, audio about 7 min.
- 2026-11-08: earshot listen + masking check, 26 SFX changes, three renders (about 45 min each, unattended).
- 2026-11-08: production pack + 3 thumbnails (stills only, about 2 min of render).
- 2026-11-08: guide line cut, re-render + master + QA + earshot (about 1 h, unattended).
- 2026-11-08: blast on "hit." lowered: audio-only render 10 min + master/mux + QA + gate about 15 min (no picture render).
