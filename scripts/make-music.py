"""
Channel-made music beds (Lucas 2026-11-04, after two Content ID claims on Pixabay music): every
sound is synthesised here, so no one else holds the recording and Content ID has nothing to match.

  python -I scripts/make-music.py <preset> <out.mp3> [--seconds 150]

Layers: string-like pad (detuned saws, low-passed), bass, piano-like arpeggio, soft low pulse in the
build, a high shimmer near the end, then a synthetic hall reverb. numpy only; ffmpeg encodes the MP3.
Presets are chord loops; add one per pillar as needed.
"""
import subprocess
import sys
import wave

import numpy as np

SR = 48000

# chord = (bass midi, pad voicing); each chord lasts `bar` seconds
PRESETS = {
    # P2 Explorers: D minor, i – VI – III – VII, slow and wide (cold sea, long voyage)
    "p2-explorers": {
        "bar": 8.0,
        "chords": [(38, [50, 57, 62, 65]), (34, [53, 58, 62, 65]), (41, [53, 57, 60, 65]), (36, [52, 55, 60, 64])],
        "arp": [12, 19, 24, 15, 19, 12, 24, 19],  # semitones over the bass, octave up
        "seed": 6,
    },
    # carrier-watch (Naval Board ep01-carrier, 2026-11-05): E minor i – VI – III – VII, slow, open fifths over the sea
    "carrier-watch": {
        "bar": 7.5,
        "chords": [(28, [47, 52, 55, 59]), (24, [48, 52, 55, 60]), (31, [47, 50, 55, 59]), (26, [50, 54, 57, 62])],
        "arp": [12, 19, 24, 19, 12, 19, 24, 31],
        "seed": 12,
    },
    # o-flyway (Style O Data Loop test, 2026-11-09): D major I – vi – IV – V, calm wonder; 4 bars × 7.5 s = one 30 s loop
    # (render 90 s, keep 30–60 s: keys and bass are steady there, so the cut loops cleanly)
    "o-flyway": {
        "bar": 7.5,
        "chords": [(38, [57, 62, 66, 69]), (35, [54, 59, 62, 66]), (31, [55, 59, 62, 67]), (33, [57, 61, 64, 69])],
        "arp": [12, 19, 24, 16, 19, 24, 28, 19],
        "seed": 5,
    },
    # ambush-tension (Test/ambush, 2026-11-05): A minor i – VI – iv – V, slow, dark military explainer bed
    "ambush-tension": {
        "bar": 8.0,
        "chords": [(33, [45, 52, 57, 60]), (29, [45, 53, 57, 60]), (38, [50, 53, 57, 62]), (28, [47, 52, 56, 59])],
        "arp": [12, 19, 15, 19, 12, 24, 15, 19],
        "seed": 9,
    },
    # Style M (Hoạt Sử, 2D history cartoon): light pizzicato bass + offbeat stabs + a celesta motif that follows the
    # chords, a soft brush, a quiet string pad. Any length (arrangement is in bars, not seconds).
    # m-quirky: D minor i – VI – iv – V, sneaky and playful (a mad-but-true story)
    "m-quirky": {
        "kind": "pizz",
        "bpm": 108,
        "chords": [(38, [62, 65, 69]), (46, [62, 65, 70]), (43, [62, 67, 70]), (45, [61, 64, 67])],
        "pad": 0.35,
        "seed": 11,
    },
    # n-heist (Style N, n-mandel 2026-11-05): A minor i – VI – III – VII, sneaky and brisk (a math heist)
    "n-heist": {
        "kind": "pizz",
        "bpm": 112,
        "chords": [(45, [64, 69, 72]), (41, [65, 69, 72]), (48, [64, 67, 72]), (43, [62, 67, 71])],
        "pad": 0.45,
        "seed": 21,
        # layer gains over the 92 s VO: quiet hook, full under the rule, a driving race, stripped for the fear, back at the win
        "arc": {
            "bass": [(0.0, 0.7), (61.43, 1), (61.73, 0.6), (63.23, 0), (70.23, 0), (70.63, 0.8), (89.53, 1), (89.83, 0.4)],
            "stab": [(0.0, 0), (8.4, 0), (8.7, 1), (61.43, 1), (61.73, 0), (73.43, 0), (73.73, 0.8), (84.23, 0.8), (84.53, 1), (89.53, 1), (89.83, 0)],
            "mel": [(0.0, 0), (8.4, 0), (8.8, 1), (47.23, 1), (54.23, 0.5), (61.43, 0.5), (61.73, 0), (73.43, 0), (73.73, 1), (89.53, 1), (89.83, 0.5)],
            "pad": [(0.0, 1), (61.43, 1), (61.73, 1.8), (73.43, 1.8), (73.73, 1), (89.53, 1), (89.83, 1.6)],
            "brush": [(0.0, 0.4), (8.6, 1), (47.23, 1), (54.53, 3), (61.43, 3), (61.73, 0), (73.73, 0), (73.93, 1), (89.53, 1), (89.83, 0)],
            "drive": [(0.0, 0), (47.43, 0), (49.23, 0.3), (54.53, 0.9), (61.43, 1), (61.73, 0), (70.53, 0), (73.23, 0.7), (73.43, 0)],
        },
    },
    # ivey-edge (NEON ODDS ep01, 2026-11-07): D minor i – VI – iv – V, a slow card-room prowl; stops dead at "London did not"
    "ivey-edge": {
        "kind": "pizz",
        "bpm": 96,
        "chords": [(38, [62, 65, 69]), (46, [62, 65, 70]), (43, [62, 67, 70]), (45, [61, 64, 69])],
        "pad": 0.55,
        "seed": 33,
        # layer gains over the 104 s VO: quiet flaw, the plan builds, the money drives, nothing at the turn, court is pad only, thin at the end
        "arc": {
            "bass": [(0.0, 0.6), (23.5, 0.9), (49.0, 1), (67.9, 1), (68.1, 0), (73.0, 0), (75.0, 0.6), (98.9, 0.6), (100.0, 0.25)],
            "stab": [(0.0, 0), (23.5, 0), (23.9, 0.7), (49.0, 1), (67.9, 1), (68.1, 0), (91.0, 0)],
            "mel": [(0.0, 0), (6.3, 0), (6.8, 0.6), (49.0, 1), (67.9, 1), (68.1, 0), (91.9, 0), (92.4, 0.5), (98.9, 0.5), (99.4, 0)],
            "pad": [(0.0, 1), (67.9, 1), (68.1, 0), (70.0, 0), (72.0, 1.6), (91.0, 1.6), (92.0, 1), (104.0, 1.2)],
            "brush": [(0.0, 0.3), (23.5, 0.8), (49.0, 1.4), (67.9, 1.6), (68.1, 0), (92.0, 0), (92.4, 0.5), (99.0, 0)],
            "drive": [(0.0, 0), (49.0, 0), (55.0, 0.4), (62.0, 0.9), (67.9, 1), (68.1, 0)],
        },
    },
    # tipton-lottery (NEON ODDS ep02, 2026-11-07): E minor i – iv – VI – V, cold and patient; drops out for the name
    "tipton-lottery": {
        "kind": "pizz",
        "bpm": 92,
        "chords": [(40, [64, 67, 71]), (45, [64, 69, 72]), (48, [64, 67, 72]), (47, [63, 66, 71])],
        "pad": 0.6,
        "seed": 41,
        # layer gains over the 95 s VO: a cold room, the clock, the ticket builds, nothing after "nobody came", the hunt, nothing for the name, court is pad only
        "arc": {
            "bass": [(0.0, 0.5), (23.2, 0.8), (35.2, 1), (43.7, 1), (43.9, 0), (44.5, 0.8), (65.4, 1), (65.6, 0), (71.0, 0), (72.0, 0.6), (92.0, 0.3)],
            "stab": [(0.0, 0), (16.5, 0), (16.9, 0.5), (35.2, 0.9), (43.7, 0.9), (43.9, 0), (44.8, 0.8), (65.4, 0.9), (65.6, 0), (85.0, 0)],
            "mel": [(0.0, 0), (4.2, 0), (4.8, 0.5), (35.2, 0.9), (43.7, 0.9), (43.9, 0), (46.0, 0.8), (65.4, 0.9), (65.6, 0), (85.5, 0), (86.0, 0.4), (91.5, 0.4), (92.0, 0)],
            "pad": [(0.0, 1), (65.4, 1), (65.6, 0), (68.7, 0), (70.5, 1.6), (85.0, 1.6), (86.0, 1), (96.0, 1.2)],
            "brush": [(0.0, 0.3), (35.2, 1), (43.7, 1), (43.9, 0), (44.8, 1), (65.4, 1.4), (65.6, 0), (86.0, 0)],
            "drive": [(0.0, 0), (52.0, 0), (58.0, 0.4), (64.0, 0.9), (65.4, 1), (65.6, 0)],
        },
    },
    "slot-hack": {
        "kind": "pizz",
        "bpm": 96,
        "chords": [(45, [64, 69, 72]), (41, [65, 69, 72]), (43, [67, 71, 74]), (40, [64, 67, 71])],
        "pad": 0.6,
        "seed": 53,
        # layer gains over the 103 s VO: a quiet floor, Russia and the code build, the buzz drives, nothing after "The phone does",
        # the money at full, the arrest thins out, a hole for "No." and for "The company said no", pad alone under the question
        "arc": {
            "bass": [(0.0, 0.5), (20.7, 0.8), (32.9, 1), (54.8, 1), (55.0, 0), (56.0, 0.9), (68.4, 1), (68.7, 0.6), (81.4, 0.6), (81.6, 0), (82.6, 0), (83.2, 0.8), (91.4, 0.8), (91.6, 0), (93.0, 0), (94.0, 0.4)],
            "stab": [(0.0, 0), (18.0, 0), (20.7, 0.4), (32.9, 0.8), (54.8, 0.9), (55.0, 0), (56.0, 0.8), (68.4, 0.9), (68.7, 0), (83.2, 0), (84.0, 0.6), (91.4, 0.6), (91.6, 0)],
            "mel": [(0.0, 0.3), (17.6, 0.3), (17.8, 0), (20.7, 0), (21.5, 0.5), (42.2, 0.8), (54.8, 0.9), (55.0, 0), (57.0, 0.8), (68.4, 0.9), (68.7, 0), (75.4, 0), (76.0, 0.5), (81.4, 0.5), (81.6, 0), (91.4, 0), (93.0, 0), (96.4, 0.3), (101.0, 0)],
            "pad": [(0.0, 1), (54.8, 1), (55.0, 0.6), (56.0, 1), (68.7, 1.4), (81.4, 1.4), (81.6, 0.4), (83.0, 1), (91.4, 1), (91.6, 0.4), (93.0, 1.4), (103.0, 1.2)],
            "brush": [(0.0, 0.3), (32.9, 0.8), (42.2, 1), (54.8, 1.2), (55.0, 0), (56.0, 1), (68.4, 1.2), (68.7, 0.4), (81.4, 0.4), (81.6, 0), (83.2, 0.5), (91.4, 0.5), (91.6, 0)],
            "drive": [(0.0, 0), (42.2, 0), (46.5, 0.5), (52.0, 0.9), (54.8, 1), (55.0, 0), (56.0, 0.6), (66.0, 0.9), (68.4, 1), (68.7, 0)],
        },
    },
    "ritz-roulette": {
        "kind": "pizz",
        "bpm": 92,
        "chords": [(50, [62, 65, 69]), (46, [62, 65, 70]), (48, [60, 64, 67]), (45, [61, 64, 69])],
        "pad": 0.6,
        "seed": 71,
        # layer gains over the 99 s VO: a quiet floor at the table, the streak at full, the arrest thins out, the papers build,
        # a hole after "The laser scam." and after "There was no laser.", the twist on the melody, pad alone under the last line
        "arc": {
            "bass": [(0.0, 0.5), (20.2, 0.8), (24.0, 1), (36.0, 0.6), (48.3, 0.8), (55.5, 0.8), (55.7, 0), (56.4, 0), (57.0, 0.7), (68.8, 0.7), (69.0, 0), (72.0, 0), (72.8, 0.6), (89.4, 0.6), (89.6, 0)],
            "stab": [(0.0, 0), (17.0, 0), (20.2, 0.5), (24.0, 0.9), (36.0, 0.3), (48.3, 0.6), (55.5, 0.9), (55.7, 0), (69.0, 0), (78.0, 0), (79.0, 0.5), (89.4, 0.5), (89.6, 0)],
            "mel": [(0.0, 0.3), (4.6, 0.3), (5.0, 0.5), (24.0, 0.8), (36.0, 0.5), (48.3, 0.5), (55.5, 0.8), (55.7, 0), (57.0, 0.4), (68.8, 0.4), (69.0, 0), (72.0, 0), (72.8, 0.8), (89.4, 0.8), (89.6, 0), (94.0, 0), (95.0, 0.3), (99.0, 0)],
            "pad": [(0.0, 1), (36.0, 1.2), (55.5, 1), (55.7, 0.5), (56.4, 1), (68.8, 1), (69.0, 0.4), (72.0, 1.2), (89.6, 1.2), (90.2, 1.4), (100.0, 1.2)],
            "brush": [(0.0, 0.3), (24.0, 1), (36.0, 0.4), (48.3, 0.8), (55.5, 1), (55.7, 0), (57.0, 0.6), (68.8, 0.6), (69.0, 0), (72.8, 0.5), (89.4, 0.5), (89.6, 0)],
            "drive": [(0.0, 0), (24.0, 0.6), (34.0, 0.9), (36.0, 0), (50.0, 0), (53.0, 0.6), (55.5, 0.9), (55.7, 0)],
        },
    },
    "don-johnson": {
        "kind": "pizz",
        "bpm": 100,
        "chords": [(43, [62, 67, 71]), (40, [64, 67, 71]), (36, [64, 67, 72]), (38, [62, 66, 69])],
        "pad": 0.6,
        "seed": 89,
        # layer gains over the 83 s VO: a quiet floor for 2010, Don and the rules build, a hole after "twenty percent",
        # the money at full, a hole after "No." and after "themselves", pad alone under the last question
        "arc": {
            "bass": [(0.0, 0.5), (15.6, 0.8), (24.6, 1), (37.8, 1), (38.0, 0), (38.8, 0.9), (60.8, 1), (66.0, 0.5), (68.1, 0.5), (68.3, 0), (69.1, 0.6), (75.1, 0.6), (75.3, 0), (76.2, 0)],
            "stab": [(0.0, 0), (15.6, 0.4), (24.6, 0.8), (37.8, 0.8), (38.0, 0), (45.4, 0.9), (60.8, 0.9), (61.0, 0.3), (68.1, 0.3), (68.3, 0)],
            "mel": [(0.0, 0.3), (4.8, 0.5), (24.6, 0.7), (37.8, 0.8), (38.0, 0), (39.0, 0.6), (60.8, 0.9), (68.1, 0.5), (68.3, 0), (69.4, 0.6), (75.1, 0.6), (75.3, 0), (78.8, 0), (79.5, 0.3), (83.0, 0)],
            "pad": [(0.0, 1), (37.8, 1), (38.0, 0.5), (38.8, 1), (68.1, 1.2), (68.3, 0.4), (69.1, 1.2), (75.1, 1.2), (75.3, 0.5), (76.2, 1.4), (85.0, 1.2)],
            "brush": [(0.0, 0.3), (24.6, 0.8), (37.8, 1), (38.0, 0), (38.8, 0.8), (60.8, 1.2), (61.0, 0.4), (68.1, 0.4), (68.3, 0)],
            "drive": [(0.0, 0), (45.4, 0), (48.0, 0.6), (55.0, 1), (60.8, 1), (61.0, 0)],
        },
    },
    "bill-benter": {
        "kind": "pizz",
        "bpm": 94,
        "chords": [(45, [64, 67, 72]), (41, [65, 69, 72]), (38, [65, 69, 74]), (40, [64, 68, 71])],
        "pad": 0.6,
        "seed": 107,
        # layer gains over the 93 s VO: night and Vegas quiet, Hong Kong builds, the model and the club at full, a thinner
        # 1997, a hole after "sixteen million dollars", after "unsporting" and after "charity", pad alone under the question
        "arc": {
            "bass": [(0.0, 0.5), (16.7, 0.8), (27.5, 1), (59.6, 0.7), (67.6, 0.9), (76.5, 0.9), (76.7, 0), (77.4, 0.6), (80.1, 0.6), (80.3, 0), (81.0, 0.5), (83.5, 0.5), (83.7, 0), (84.4, 0)],
            "stab": [(0.0, 0), (16.7, 0.4), (27.5, 0.8), (59.6, 0.4), (67.6, 0.7), (76.5, 0.8), (76.7, 0)],
            "mel": [(0.0, 0.3), (6.4, 0.5), (27.5, 0.7), (40.0, 0.9), (59.6, 0.6), (67.6, 0.8), (76.5, 0.8), (76.7, 0), (81.0, 0.5), (83.5, 0.5), (83.7, 0), (87.0, 0), (88.0, 0.3), (93.0, 0)],
            "pad": [(0.0, 1), (59.6, 1.1), (76.5, 1.1), (76.7, 0.5), (77.4, 1.2), (83.5, 1.2), (83.7, 0.5), (84.4, 1.4), (95.0, 1.2)],
            "brush": [(0.0, 0.3), (16.7, 0.7), (27.5, 1), (59.6, 0.5), (67.6, 0.8), (76.5, 1), (76.7, 0)],
            "drive": [(0.0, 0), (40.0, 0), (44.0, 0.6), (50.0, 1), (59.6, 0.6), (67.6, 0.8), (76.5, 1), (76.7, 0)],
        },
    },
    "ron-harris": {
        "kind": "pizz",
        "bpm": 98,
        "chords": [(38, [62, 65, 69]), (34, [62, 65, 70]), (36, [60, 64, 67]), (33, [61, 64, 69])],
        "pad": 0.6,
        "seed": 131,
        # layer gains over the 80 s VO: a quiet floor for the inspector, the rigging builds, keno and Atlantic City at full,
        # a hole after "a hundred thousand dollars" and "what sank them", a thin arrest, a hole after the judge, pad alone at the end
        "arc": {
            "bass": [(0.0, 0.5), (11.6, 0.8), (19.0, 1), (36.4, 1), (55.6, 1), (55.8, 0), (59.5, 0), (60.2, 0.6), (72.5, 0.6), (72.7, 0), (73.4, 0)],
            "stab": [(0.0, 0), (11.6, 0.4), (19.0, 0.8), (46.7, 0.9), (55.6, 0.9), (55.8, 0), (60.2, 0.3), (72.5, 0.3), (72.7, 0)],
            "mel": [(0.0, 0.3), (4.0, 0.5), (19.0, 0.7), (36.4, 0.9), (55.6, 0.9), (55.8, 0), (60.2, 0.4), (72.5, 0.4), (72.7, 0), (76.0, 0), (77.0, 0.3), (80.0, 0)],
            "pad": [(0.0, 1), (55.6, 1), (55.8, 0.5), (59.5, 0.5), (60.2, 1.2), (72.5, 1.2), (72.7, 0.5), (73.4, 1.4), (82.0, 1.2)],
            "brush": [(0.0, 0.3), (11.6, 0.7), (19.0, 1), (55.6, 1.2), (55.8, 0), (60.2, 0.5), (72.5, 0.5), (72.7, 0)],
            "drive": [(0.0, 0), (36.4, 0), (40.0, 0.6), (46.7, 1), (55.6, 1), (55.8, 0)],
        },
    },
    "watanabe": {
        "kind": "pizz",
        "bpm": 90,
        "chords": [(33, [57, 60, 64]), (29, [57, 60, 65]), (31, [55, 59, 62]), (28, [56, 59, 64])],
        "pad": 0.7,
        "seed": 149,
        # layer gains over the 79 s VO: a lounge floor for the hook and Omaha, the whale treatment builds, the money at full,
        # thinner for the drinking, a hole after "stayed unpaid" and "twenty-eight years", a thin settlement, a hole after the fine
        "arc": {
            "bass": [(0.0, 0.5), (15.0, 0.8), (23.6, 1), (35.4, 0.8), (51.2, 0.8), (51.4, 0), (52.0, 0), (52.2, 1), (58.1, 1), (58.3, 0), (58.9, 0), (59.2, 0.6), (74.0, 0.6), (74.2, 0)],
            "stab": [(0.0, 0), (15.0, 0.4), (23.6, 0.9), (35.4, 0.5), (51.2, 0.5), (51.4, 0), (52.2, 0.8), (58.1, 0.8), (58.3, 0), (59.2, 0.3), (74.0, 0.3), (74.2, 0)],
            "mel": [(0.0, 0.4), (15.0, 0.6), (23.6, 0.9), (35.4, 0.6), (51.2, 0.6), (51.4, 0), (52.2, 0.6), (58.1, 0.6), (58.3, 0), (59.2, 0.4), (74.0, 0.4), (74.2, 0), (77.0, 0.3), (80.0, 0)],
            "pad": [(0.0, 1), (51.2, 1), (51.4, 0.5), (52.0, 0.5), (52.2, 1), (58.1, 1), (58.3, 0.5), (59.2, 1.1), (74.0, 1.1), (74.2, 0.5), (74.9, 1.4), (82.0, 1.2)],
            "brush": [(0.0, 0.3), (15.0, 0.7), (23.6, 1), (35.4, 0.7), (51.2, 0.8), (51.4, 0), (52.2, 0.8), (58.1, 0.8), (58.3, 0), (59.2, 0.4), (74.0, 0.4), (74.2, 0)],
            "drive": [(0.0, 0), (23.6, 0), (26.0, 0.7), (35.4, 0.7), (36.0, 0), (52.2, 0.6), (58.1, 0.8), (58.3, 0)],
        },
    },
    # m-resolve: F major I – vi – IV – V, slower and warmer (a quiet-courage story)
    "m-resolve": {
        "kind": "pizz",
        "bpm": 88,
        "chords": [(41, [60, 65, 69]), (38, [62, 65, 69]), (46, [62, 65, 70]), (48, [60, 64, 67])],
        "pad": 0.8,
        "seed": 4,
    },
}

hz = lambda m: 440.0 * 2 ** ((m - 69) / 12)


def env(n, attack, release):
    """Raised-cosine attack and release over n samples."""
    e = np.ones(n)
    a, r = int(attack * SR), int(release * SR)
    e[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    e[n - r:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r))
    return e


def lowpass(x, fc, order=4):
    """Zero-phase low-pass in the frequency domain (static filter, whole signal at once)."""
    X = np.fft.rfft(x, axis=0)
    f = np.fft.rfftfreq(x.shape[0], 1 / SR)
    g = 1 / np.sqrt(1 + (f / fc) ** (2 * order))
    return np.fft.irfft(X * (g[:, None] if x.ndim == 2 else g), n=x.shape[0], axis=0)


def highpass(x, fc, order=4):
    X = np.fft.rfft(x, axis=0)
    f = np.maximum(np.fft.rfftfreq(x.shape[0], 1 / SR), 1e-3)
    return np.fft.irfft(X * (1 / np.sqrt(1 + (fc / f) ** (2 * order)))[:, None], n=x.shape[0], axis=0)


def ramp(t, pts):
    """Piecewise-linear automation: pts = [(seconds, gain), …]."""
    return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])


def pizz(p, seconds, rng):
    """Style M bed: bars of 4 beats; pluck bass on 1 and 3, chord stabs on 2 and 4, celesta motif from bar 2."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    beat = 60 / p["bpm"]
    bar = 4 * beat
    bass, stab, mel, pad, brush = (np.zeros((n, 2)) for _ in range(5))

    def put(buf, at, sig, pan):
        s0 = int(at * SR)
        L = min(len(sig), n - s0)
        if L > 0:
            buf[s0:s0 + L, 0] += sig[:L] * (1 - pan)
            buf[s0:s0 + L, 1] += sig[:L] * pan

    def pluck(f0, dur, decay, harm=5):
        tt = np.arange(int(dur * SR)) / SR
        x = sum((1 / h) * np.sin(2 * np.pi * f0 * h * tt) * np.exp(-tt * decay * (1 + 0.7 * h)) for h in range(1, harm + 1))
        return x * np.minimum(1, tt / 0.003)

    def bell(f0, dur=1.6):
        tt = np.arange(int(dur * SR)) / SR
        x = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 2.4) + 0.3 * np.sin(2 * np.pi * f0 * 4 * tt) * np.exp(-tt * 7)
        return (x + 0.12 * np.sin(2 * np.pi * f0 * 2.76 * tt) * np.exp(-tt * 5)) * np.minimum(1, tt / 0.002)

    # two 2-bar motifs of (eighth slot 0–15, chord-tone index 0–5); played A A B A over 8 bars, on the current chord
    def motif():
        slots = sorted(rng.choice(16, size=int(rng.integers(5, 8)), replace=False))
        return [(int(k), int(rng.integers(0, 6))) for k in slots]

    A, B = motif(), motif()
    bars = int(np.ceil(seconds / bar))
    for i in range(bars):
        root, triad = p["chords"][i % len(p["chords"])]
        t0 = i * bar
        put(bass, t0, pluck(hz(root), 1.2, 3.0), 0.5)
        put(bass, t0 + 2 * beat, pluck(hz(root + 7), 1.2, 3.0) * 0.8, 0.5)
        if i % 4 == 3:  # walk-up pickup into the next bar
            put(bass, t0 + 3.5 * beat, pluck(hz(root + 5), 0.6, 4.0) * 0.6, 0.5)
        for b in (1, 3):
            for k, note in enumerate(triad):
                put(stab, t0 + b * beat + 0.006 * k, pluck(hz(note), 0.35, 9.0, 3) * 0.35, 0.3 + 0.2 * k)
        for e in range(8):
            put(brush, t0 + e * beat / 2, rng.standard_normal(int(0.05 * SR)) * np.exp(-np.arange(int(0.05 * SR)) / SR * 90) * (0.5 if e % 2 else 0.25), 0.6)
        # quiet string pad on the triad, an octave down
        L = int((bar + 0.6) * SR)
        tt = np.arange(L) / SR
        e = env(L, 0.4, 0.6)
        for k, note in enumerate(triad):
            saw = 2 * ((hz(note - 12) * tt + rng.random()) % 1) - 1
            put(pad, t0, saw * e * 0.05 * p["pad"], 0.3 + 0.2 * k)
        # celesta motif from bar 2; bar 7 of every 8 rests so it breathes
        if i >= 2 and i % 8 != 7:
            m = (A, A, B, A)[(i // 2) % 4]
            half = i % 2
            tones = [triad[0] + 12, triad[1] + 12, triad[2] + 12, triad[0] + 24, triad[1] + 24, triad[2] + 24]
            for slot, idx in m:
                if slot // 8 == half:
                    put(mel, t0 + (slot % 8) * beat / 2, bell(hz(tones[idx])) * 0.22, 0.35 + 0.3 * (slot % 2))

    pad = lowpass(pad, 1400)
    brush = highpass(brush, 5000)
    stab = lowpass(stab, 3000)
    fade = ramp(t, [(0, 0), (0.05, 1), (seconds - 3, 1), (seconds, 0)])[:, None]
    if "arc" in p:
        drive = np.zeros((n, 2))
        for b in range(int(seconds / beat)):  # a soft kick on every beat: only the race opens it
            tq = np.arange(int(0.22 * SR)) / SR
            put(drive, b * beat, np.sin(2 * np.pi * np.cumsum(55 + 70 * np.exp(-tq * 30)) / SR) * np.exp(-tq * 16) * 0.9, 0.5)
        gain = lambda k: ramp(t, p["arc"][k])[:, None]
        return (bass * 0.5 * gain("bass") + stab * gain("stab") + mel * gain("mel") + pad * gain("pad") + brush * 0.04 * gain("brush") + drive * 0.5 * gain("drive")) * fade
    return (bass * 0.5 + stab + mel + pad + brush * 0.04) * fade


def make(preset, seconds):
    p = PRESETS[preset]
    rng = np.random.default_rng(p["seed"])
    if p.get("kind") == "pizz":
        return hall(pizz(p, seconds, rng), rng, int(seconds * SR), 1.8)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    pad, bass, keys, pulse, shimmer = (np.zeros((n, 2)) for _ in range(5))
    bar, tail = p["bar"], 3.5

    for i in range(int(np.ceil(seconds / bar))):
        root, voicing = p["chords"][i % len(p["chords"])]
        s0 = int(i * bar * SR)
        m = min(int((bar + tail) * SR), n - s0)
        if m <= 0:
            break
        tt = np.arange(m) / SR
        e = env(m, min(2.5, m / SR / 2), min(tail + 0.5, m / SR / 2))
        for k, note in enumerate(voicing):
            pan = 0.25 + 0.5 * k / (len(voicing) - 1)  # spread the voicing left → right
            for cents in (-7, 0, 6):
                ph = rng.random()
                saw = 2 * ((hz(note) * 2 ** (cents / 1200) * tt + ph) % 1) - 1
                pad[s0:s0 + m, 0] += saw * e * (1 - pan) * 0.06
                pad[s0:s0 + m, 1] += saw * e * pan * 0.06
            # high shimmer: the voicing an octave up as soft sines (only opened late in the piece)
            sh = np.sin(2 * np.pi * hz(note + 12) * tt + rng.random() * 6.28) * e * 0.05
            shimmer[s0:s0 + m, 0] += sh * pan
            shimmer[s0:s0 + m, 1] += sh * (1 - pan)
        b = np.sin(2 * np.pi * hz(root) * tt) + 0.3 * np.sin(4 * np.pi * hz(root) * tt)
        bass[s0:s0 + m] += (np.tanh(1.5 * b) * e * 0.08)[:, None]

        # arpeggio: one note a second, a few left out so it breathes
        for j, step in enumerate(p["arp"]):
            if rng.random() < 0.2:
                continue
            a0 = s0 + int(j * bar / len(p["arp"]) * SR)
            L = min(int(3.0 * SR), n - a0)
            if L <= 0:
                continue
            ta = np.arange(L) / SR
            f0 = hz(root + 12 + step)
            tone = sum((0.6 / h) * np.sin(2 * np.pi * f0 * h * (1 + 0.0004 * h * h) * ta) * np.exp(-ta * (1.4 + 0.9 * h)) for h in range(1, 7))
            tone *= np.minimum(1, ta / 0.006) * (0.8 + 0.2 * rng.random())
            pan = 0.35 + 0.3 * (j % 2)
            keys[a0:a0 + L, 0] += tone * (1 - pan) * 0.5
            keys[a0:a0 + L, 1] += tone * pan * 0.5

        # low pulse on each half bar (only heard where the automation opens it)
        for h in (0, 0.5):
            q0 = s0 + int(h * bar * SR)
            L = min(int(1.6 * SR), n - q0)
            if L <= 0:
                continue
            tq = np.arange(L) / SR
            f = 50 * np.exp(-tq * 1.5) + 55
            boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tq * 3.0) * np.minimum(1, tq / 0.01)
            pulse[q0:q0 + L] += (boom * 0.18)[:, None]

    pad = lowpass(pad, 2200)
    bass = highpass(bass, 50)  # tanh of an asymmetric wave leaves DC that follows the envelope
    shimmer = lowpass(shimmer, 5000)

    mix = (
        pad * ramp(t, [(0, 0), (6, 1), (seconds - 10, 1), (seconds, 0)])[:, None]
        + bass * ramp(t, [(0, 0), (10, 0.8), (seconds - 12, 0.8), (seconds, 0)])[:, None]
        + keys * ramp(t, [(0, 0), (16, 0), (24, 1), (seconds - 22, 1), (seconds - 8, 0)])[:, None]
        + pulse * ramp(t, [(0, 0), (60, 0), (68, 0.7), (124, 0.7), (130, 0)])[:, None]
        + shimmer * ramp(t, [(0, 0), (92, 0), (100, 1), (130, 1), (140, 0)])[:, None]
    )

    return hall(mix, rng, n, 2.8)


def hall(mix, rng, n, rt):
    """Synthetic hall: decorrelated decaying noise per channel, darkened; peak −1 dBFS."""
    L = int((rt + 0.4) * SR)
    ti = np.arange(L) / SR
    ir = rng.standard_normal((L, 2)) * np.exp(-6.9 * ti / rt)[:, None]
    ir = lowpass(ir, 3500)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    N = 1 << int(np.ceil(np.log2(n + L)))
    wet = np.fft.irfft(np.fft.rfft(mix, N, axis=0) * np.fft.rfft(ir, N, axis=0), N, axis=0)[:n]
    out = 0.65 * mix + (0.6 if rt > 2 else 0.35) * wet
    out = highpass(out, 45)  # nothing under ~45 Hz: phones can't play it and it only eats headroom
    out *= 10 ** (-1 / 20) / np.abs(out).max()  # peak −1 dBFS; MusicBed levels it from the measured LUFS
    return out


def main():
    args = sys.argv[1:]
    if len(args) < 2 or args[0] not in PRESETS:
        sys.exit(f"usage: make-music.py <{'|'.join(PRESETS)}> <out.mp3> [--seconds 150]")
    seconds = float(args[args.index("--seconds") + 1]) if "--seconds" in args else 150.0
    out = make(args[0], seconds)
    assert np.isfinite(out).all() and out.shape == (int(seconds * SR), 2)
    wav_path = args[1].rsplit(".", 1)[0] + ".wav"
    with wave.open(wav_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((out * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav_path, "-c:a", "libmp3lame", "-b:a", "192k", args[1]], check=True)
    print(f"{args[1]}: {seconds:.0f} s, preset {args[0]}")


if __name__ == "__main__":
    main()
