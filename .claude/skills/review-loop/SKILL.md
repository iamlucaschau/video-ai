---
name: review-loop
description: Visual self-review loop for this repo's videos (style J / Mapped Journeys first) — shoot safe-guide stills at every VO line, tile them into contact sheets, look at them, check against the channel rules, fix, repeat. Use after any change to a video's visuals or timing, and before calling a video (or a render) done.
license: MIT
metadata:
  adapted-from: whaleyxbt/claude-motion .claude/skills/review-loop (MIT, © 2026 whaleyxbt)
---

# Review loop

You can't watch the video, but you can look at frames. Never report a video as done without looking at contact sheets of the current code (and, for a final, of the rendered MP4).

Rules this checks against: `AGENTS.md` (short-form 9:16), `Style Library/J-satellite-journey/README.md`, `Mapped Journeys/00_he-thong/01_CHANNEL-BIBLE.md` §5–§7.

## Loop

1. `npm run sheet:j -- <CompositionId> --slug <slug>` — bundles once, shoots one still per VO line (0.6 s after the line starts, so labels and chips have landed) plus frame 6, all with `safeGuide`, tiled 4×2 into `out/sheets/<slug>-lines-N.png`. Each tile is labelled with its frame and time. ~6 min for 34 lines. A style J render takes ~20 min (motion blur), so this, not a draft render, is the inner loop.
2. Open **every** sheet and go through the checklist below. Then run the **fresh-eyes critic** (below) on the same sheets.
3. Zoom in on anything suspicious (add `--no-bundle` when the code hasn't changed):
   - `npm run sheet:j -- <id> --from 60 --to 64 --every 0.2` to scrub a flight or a card coming in,
   - `npm run sheet:j -- <id> --frames 1000,2400` for exact frames,
   - `npx remotion still out/bundle <id> out/check.png --frame=<n> --props='{"safeGuide":true}'` for one full-size frame.
4. Fix **the 3 worst problems** of the pass (order: wrong or missing → readability → timing → visual detail), each written as a scoped fix (below), then go back to step 1 (or re-shoot just the frames you touched with `--frames`). Stop when a full pass, critic included, finds nothing worth fixing.
5. Final: `npm run render:j -- <id> --to <mp4>`, then `npm run sheet:j -- --video "<mp4>" --slug <slug>` and look at those sheets too (no guide: this is what viewers see). Phone test: tiles are 360 px wide (`--size 360`, the default), which is phone width, so if a label is hard to read on the sheet it is hard to read on a phone. For a whole-video glance: `npm run sheet:j -- --video "<mp4>" --every 3 --to <duration> --cols 6 --rows 4 --name <slug>-phone`.
6. Write every check you ran into the episode's `checks.md` (requirement · pass / fail / unresolved · evidence = sheet + tile frame or command output) and update `progress.md`.

## Fresh-eyes critic (Lucas 2026-11-01)

The maker grades its own work too kindly. After your own pass, spawn a subagent that did **not** build the video. Give it only: the sheet paths, the rules files listed at the top, the episode's verification table, and this brief:

> You did not make this. You are the harshest short-form editor you know. Open every sheet. List every problem with its tile frame and time: text touching the red guide or unreadable at this size, more than 2 text blocks at once, a stretch of ~8 s with nothing new, a card covering a label or pin, a number or claim on screen that is not in the verification table, everything entering the same way (all fades), anything that reads as generic AI. Rank them, worst first. Do not suggest fixes for things that are fine.

Take its top 3 (merged with yours) into step 4. Its list goes into `checks.md` as `unresolved` until fixed or rejected with a reason.

## Scoped fix (Lucas 2026-11-01)

Write each fix before you edit, with four fields, so the edit can't wander:

```
WHERE    frames 1248–1266 (scene / VO line id)
PROBLEM  the card lands at 1268, 6 frames after its word at 1262
CHANGE   only the card's entrance: start at 1258, settled at 1262
KEEP     camera keys, the label timing, every other card
```

Then re-shoot the frames at the edges of WHERE plus one in between, and check nothing else moved.

## Return and learning edges

- **Return:** a failed check goes back to the one thing that made it (one scene, one card, one SFX), never a full rebuild. At most **3 attempts** per failing check; on the third failure stop and ask Lucas, with the evidence.
- **Learning:** when a mistake shows up in **two episodes**, it becomes a fixed line in the checklist below (with the episode it came from, like E1–E7), so the next episode starts from it.

## Checklist

Safe area and layout (`AGENTS.md`, README style J)
- Everything readable sits inside x 60–940, y 220–1440 (inside the red guide). `StopLabel` fades near the edge, but a long name (e.g. "NEW CARTHAGE") can still poke out: flip its side or shorten it.
- Painting cards sit in the top band; a card never covers a label, a pin or a ring (Ep01 Drepanum, Ep02 Rome and Italy). Leader lines stay in the frame.
- Key text ≤ 5 words, at most 2 blocks at once besides the subtitle; subtitles one line, ≤ 3 words / 18 chars.
- No key-text chip that repeats the words the subtitle is showing at that moment (the subtitle already golds them). Ep02 lesson E2.
- Frame 6 is a real image, not black (it is the thumbnail fallback), and the hook number is already on it. Ep02 lesson E1.
- Nothing that must be seen (label, ring, chip) sits under a `FullFrame`. Ep02 lesson E7.
- No stretch of ~8 s without a new place, card or route progress (scan the sheet: tiles 2+ in a row that look alike). Ep02 lesson E3.
- Banned (AGENTS.md): every element entering with the same fade; a number or claim on screen that is not in the verification table.

Map and route
- Land legs stay on land, sea legs stay at sea (Ep01 Gallipoli). Disputed stretches use `theoryFrom` and a "One leading theory" line.
- The traveller (`Vessel` / `Army` / `Pilgrim`) is on the head of the route and readable at the current zoom: it gets `zoom={cam.zoom}`, so it grows to 1.3× when the camera is far out. Ep02 lesson E6.
- No coordinates on screen; place names in caps.

Timing
- Each label / card / chip lands on its spoken word (`w(line, k)`), and is gone before the next thing needs its space.
- The quiet beat: camera barely moving, no orbit, no SFX, music ducked, mono card.
- Full frames (AI images) hold long enough to read the chip on top of them.

Consistency
- Palette from `J` in `satellite-journey.tsx` (gold for numbers / keywords, red for Rome / enemies / forbidden).
- The same place keeps the same name and pin all video long.

Sound (after `render:j`, it prints these)
- −14 LUFS ±1, true peak ≤ −1.5 dBTP (`render:j` fails above that).
- At most one SFX per beat, real recordings only (no synthesised SFX in this repo), none on the quiet beat.

## Report

When you finish, say what you checked, what you fixed, and which sheet (and tile frame) shows it. Don't claim a fix you haven't re-shot and looked at.
