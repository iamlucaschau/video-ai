# Thumbnails + titles (2026-11-05)

Files (1920×1080 JPEG, ~350 KB each, under YouTube's 2 MB limit): `thumb-a.jpg`, `thumb-b.jpg`, `thumb-c.jpg`.
Source: composition `Ambush-Thumbnail` (`src/compositions/Ambush/Thumbnail.tsx`), drawn with the episode's own kit.
Re-render: `npx remotion still Ambush-Thumbnail Test/ambush/thumb-a.jpg --props=<file with {"variant":"a"}> --image-format=jpeg --jpeg-quality=92`

| | Thumbnail | Idea | Pairs best with title |
| --- | --- | --- | --- |
| A | TOO LATE | the trap closing: front and rear vehicles hit, fire from the L | How Ambushes Actually Work |
| B | WRONG MOVE | the instinct (retreat the way you came) crossed out | Why Running Back From an Ambush Gets You Killed |
| C | RUN AT THEM? | the counter-intuitive answer | The Ambush Rule That Goes Against Every Instinct |

How to test: keep the title "How Ambushes Actually Work" and put A, B, C into YouTube Studio's **Test & compare**
(thumbnail A/B test); YouTube picks by watch time. Title changes are tested by hand: swap after ~48 h and compare CTR.

Checked: readable at 320×180 (phone feed size); nothing important in the bottom-right corner (duration badge);
≤ 3 words each; every claim matches the video (B = lines 93–97, C = 104, A = the hook).
