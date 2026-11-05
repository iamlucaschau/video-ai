# How Ambushes Actually Work: frame review (2026-11-05)

Method: one frame per VO line (153 frames, at 75 % of the line) cut from the rendered MP4 and tiled 3×3
(`out/sheets/ambush-shots/sheet-01…17.jpg`). Each frame was checked as a viewer would see it: what am I looking at,
does it match what I am hearing, can I read it. Fixes are verified on new stills (`out/sheets/ambush-fix2-1…3.png`).

## Problems found and fixed

| # | Line(s) | What a viewer sees | Fix |
| --- | --- | --- | --- |
| 1 | 16–20 | Kill zone: the blasts and tracers land to the right of the vehicles, partly outside the box | Aimed at the real vehicle positions (`vx(i)`) |
| 2 | 62–63 | "The patrol enters the kill zone" / "Nobody fires" with no vehicle on screen (it arrived 15 s later) | Column rolls in on 60–62 and is in the box on "enters", then creeps on; truck sound starts with it |
| 3 | 33–34 | The probability gauge sits under the subtitles and covers them | Moved to the top right, above the ambush line |
| 4 | 120–121 | Split screen CLOSE / FAR: "50 m +" shows through next to "BREAK CONTACT" | Measure hidden under the split, overlay darker |
| 5 | 143–145 | The squad and the drone sit right on the subtitle bar | Wide frame centred 110 px lower |
| 6 | 98–102 | The "cover" rock is drawn on top of a vehicle | Rock and soldier moved to the road edge, tracers re-aimed |
| 7 | 04 | Agenda card 02 "UNFOLD" is empty for most of its time (one flash, then nothing) | Static burst icon (tracers + impact) |
| 8 | 07–09 | Just a bush on the screen: nothing tells you someone is hiding | The ambusher (red dot) shows through the bush |
| 9 | 21–23 | A blurred green blob ("hill") in a corner reads as a stain and touches the EXECUTION bar | Removed |
| 10 | 35–38 | Cover vs concealment: bush, rock and soldiers tiny in a big empty frame | 1.45× larger, tracers re-aimed |
| 11 | 57–59 | MG / AT labels too small to read | 30 → 38 px |
| 12 | 125–129 | Sitting drone: the subject of 20 s is a speck on the road | Framed close (2.1×) on the drone, one eased pull-back when the vehicle comes (130) |
| 13 | 88–89, 111 | ODDS bar: no way to tell which colour is you | YOU (blue) / THEM (red) labels |
| 14 | 85 | "You leave" arrow runs into the LIABILITY tag | Arrow shortened |
| 15 | 124 | "1 2 3" circles over a busy map | Map dimmed more |

Not changed (checked, fine): line 08 "PASSIVE?" appears on the word itself (it is the last word of the line);
line 97 cross and 150 thermal come on their words, after the sampled frame.

## Proposals to make it hold viewers better (round 3: 1–5, 7–9 built; 6 not built, see below)

Ranked by expected effect on retention.

1. **Cold open on the hit.** Today the first 10 s are a slow map with small dots, then a title card that stops the
   momentum. Open on the blast (frame 0), freeze, put up the question "You have two seconds. What do you do?", and
   promise the answer ("the right move goes against every instinct"). Pay it off at 103 (push through). Title card
   shorter or gone (YouTube already shows the title).
2. **Break the 2-minute static frame (46–85).** The L-shaped ambush is one camera position for ~2:10, the biggest
   drop-off risk. Re-frame on each part as it is explained (support leg, short leg, security, initiation, assault)
   with short eased moves or cut-ins, so the picture changes every 10–20 s.
3. **"What would you do?" beat before the answer (97–103).** Three options on screen (GO BACK / TAKE COVER / PUSH
   THROUGH), a 2-second hold, then cross out the wrong two as the VO rules them out. Engagement, and comments.
4. **Bigger, readable units.** Soldiers are 11 px dots and vehicles small rectangles; on a phone they disappear.
   Top-down soldier silhouettes (or NATO-style symbols) and vehicles ~1.5× with a clear front.
5. **Chapter markers.** Re-use the agenda cards (01 BUILD … 04 DRONES) as a 1-second card at each chapter start, and
   a thin progress strip; add matching YouTube chapters in the description.
6. **One real case per chapter.** A small map inset with place and date (Teutoburg 9 AD, Winter War motti, a Vietnam
   L-ambush, a documented Ukraine FPV strike), only with sourced facts. Makes the theory concrete.
7. **Sound that builds tension.** Drop the music for ~0.5 s before the initiation (68), a low pulse under HOLD
   (63–67), a sub hit on chapter cards; music intensity rising chapter by chapter.
8. **Keyword highlight in subtitles** (kill zone, enfilade, push through) in the tracer yellow.
9. **A real ending.** Today it fades to the title. Recap the three rules in 5 s, then a hook to the next video.

### What was built (round 3)

- **1 Cold open**: frame 0 is tight on the convoy; the camera pulls back on "ambush" to reveal the line in the trees;
  white flash on "late", time freezes ~1.8 s (VO pause added after line 01) with "WHAT DO YOU DO? / YOU HAVE SECONDS",
  ringing ears, music almost silent; the gunfire resumes with line 02.
- **2 L-ambush camera**: 11 eased re-frames (`camPath`) on enfilade, short leg, MG/AT, security, the hold, initiation
  (wide), inside the kill zone, assault, withdrawal. The 20 m marker moved inside the camera.
- **3 Choice row** (93–106): GO BACK · TAKE COVER · ? at the top; each instinct is crossed out on its word, then a
  1.6 s held pause (VO gap after 102, music dips) and "?" turns into PUSH THROUGH on "push" with a sub hit.
- **4 Units**: soldiers ×1.25 with a highlight, vehicles ×1.15 (`UNIT` in kit.tsx).
- **5 Chapters**: full-screen card in a 2.2 s VO pause before each of the 4 chapters (sub hit), a thin 4-segment
  progress strip at the top edge, `youtube-chapters.md` for the description.
- **7 Sound**: music cut a beat before the anti-armor, heartbeat under HOLD (63–67), sub hits on cards / answer /
  recap, music rising by chapter, fade over the end screen. New code-made SFX: `sub-hit`, `ear-ring`, `heartbeat-low`.
- **8 Keywords** in tracer yellow inside the subtitles (kill zone, enfilade, short leg, push, thermal …).
- **9 Ending**: recap of 3 rules (8 s added after the VO), then the closing title at the top, room for end-screen cards.

**6 (one real case per chapter) not built**: the narration never mentions those cases, so an inset would put facts on
screen that are neither spoken nor sourced in this episode. It needs a short sourced fact table first (place, date,
what happened), then 4 small map insets.

The VO is the same take (no new TTS): only pauses changed (`gapAfter` on lines 01, 20, 38, 85, 102, 121), re-exported
with `episode.mjs export`, and Whisper word times shifted by each line's new start. Total ~10:08.
