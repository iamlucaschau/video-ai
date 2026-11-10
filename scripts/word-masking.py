"""
Spoken words the background covers, word by word (AGENTS.md W5), for the listening gate (scripts/listen.mjs --words).

  python -P scripts/word-masking.py <stems dir> <timing.json> <words.json> <cues.json> <out.json>
  python -P scripts/word-masking.py --selftest

<stems dir> holds demucs' vocals.wav and no_vocals.wav. A word is covered when the background comes within MARGIN dB of
the voice over that word. Measured twice: in the speech band (300-3400 Hz, where words are understood; a low thump there
barely counts) and full band. Each covered word gets the nearest SFX cue within 1.5 s, which is usually the fix.
Same idea as the 0.4 s windows of scripts/stems.py (studio:compare), but per word and named, so a row says what to move.
First used by hand on Naval Board #2 (2026-11-08): 26 -> 12 covered words in the speech band after moving the hits.
Demucs leaks a little: read dB as ƯỚC. Writes {"band": {...}, "full": {...}}, each {"words", "covered": [rows]}.
"""
import json
import sys
import wave

import numpy as np

MARGIN = 3  # dB, same as stems.py
NEAR = 1.5  # s: a cue this close to a covered word is named as the likely cause
SILENT = -50  # dB: quieter "words" are gaps in the split, not speech


def load(p):
    with wave.open(p, "rb") as w:
        sr, ch, sw, n = w.getframerate(), w.getnchannels(), w.getsampwidth(), w.getnframes()
        b = w.readframes(n)
    if sw not in (2, 4):
        raise SystemExit(f"{p}: {8 * sw}-bit wav not handled")
    a = np.frombuffer(b, np.int16 if sw == 2 else np.int32).astype(np.float32) / (32768.0 if sw == 2 else 2147483648.0)
    return a.reshape(-1, ch).mean(axis=1), sr


def speech_band(x, sr):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / sr)
    X[(f < 300) | (f > 3400)] = 0
    return np.fft.irfft(X, len(x)).astype(np.float32)


def db(x):
    return float(10 * np.log10(np.mean(x * x) + 1e-12))


def covered(v, bg, sr, lines, words, cues, fps):
    """Rows for words where the background is within MARGIN dB of the voice."""
    rows, total = [], 0
    for l in lines:
        ts = words.get(l["id"], [])
        toks = l["text"].split()
        for k, t in enumerate(ts):
            t1 = min(ts[k + 1] if k + 1 < len(ts) else l["end"], t + 0.6)
            a, b = int(t * sr), int(t1 * sr)
            if b - a < sr * 0.05:
                continue
            vd, bd = db(v[a:b]), db(bg[a:b])
            if vd < SILENT:
                continue
            total += 1
            if bd > vd - MARGIN:
                near = min(cues, key=lambda c: abs(c["f"] / fps - t), default=None)
                cue = near["id"] if near and abs(near["f"] / fps - t) < NEAR else None
                word = toks[min(len(toks) - 1, k * len(toks) // len(ts))] if toks else "?"
                rows.append({"t": round(t, 2), "line": l["id"], "word": word, "voice": round(vd, 1), "bg": round(bd, 1), "cue": cue})
    return {"words": total, "covered": rows}


def main(stems, timing, words_path, cues_path, out):
    v, sr = load(f"{stems}/vocals.wav")
    bg, _ = load(f"{stems}/no_vocals.wav")
    lines = json.load(open(timing, encoding="utf-8"))["lines"]
    words = json.load(open(words_path, encoding="utf-8"))
    c = json.load(open(cues_path, encoding="utf-8"))
    full = covered(v, bg, sr, lines, words, c["events"], c["fps"])
    band = covered(speech_band(v, sr), speech_band(bg, sr), sr, lines, words, c["events"], c["fps"])
    json.dump({"band": band, "full": full}, open(out, "w", encoding="utf-8"), indent=1)
    print(f"covered words: {len(band['covered'])} speech band, {len(full['covered'])} full band, of {full['words']}")


def selftest():
    sr = 8000
    t = np.arange(sr * 3) / sr
    voice = (0.3 * np.sin(2 * np.pi * 800 * t)).astype(np.float32)
    bg = np.zeros_like(voice)
    bg[int(1.0 * sr) : int(1.5 * sr)] = 0.6 * np.sin(2 * np.pi * 1000 * t[int(1.0 * sr) : int(1.5 * sr)])  # loud hit over word 2
    bg[int(2.0 * sr) : int(2.5 * sr)] = 0.6 * np.sin(2 * np.pi * 60 * t[int(2.0 * sr) : int(2.5 * sr)])  # low thump over word 3
    lines = [{"id": "01", "end": 3.0, "text": "one two three"}]
    words = {"01": [0.2, 1.0, 2.0]}
    cues = [{"f": 30, "id": "hit:0"}, {"f": 61, "id": "boom:1"}]
    full = covered(voice, bg, sr, lines, words, cues, 30)
    band = covered(speech_band(voice, sr), speech_band(bg, sr), sr, lines, words, cues, 30)
    assert [r["word"] for r in full["covered"]] == ["two", "three"], full
    assert [r["word"] for r in band["covered"]] == ["two"], band  # the 60 Hz thump does not cover speech
    assert full["covered"][0]["cue"] == "hit:0"
    print("selftest ok")


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        selftest()
    elif len(sys.argv) == 6:
        main(*sys.argv[1:6])
    else:
        raise SystemExit(__doc__)
