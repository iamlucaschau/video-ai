"""
Voice vs background of a reference video (Studio ingest, KHA-THI §3: demucs, Lucas approved 2026-11-01).

  python -P scripts/stems.py <video> <out.json>

Splits the audio with demucs (htdemucs, two stems: vocals / no_vocals) in a temp folder, then measures
the loudness of each stem (ffmpeg ebur128) and the hits in the background stem: frames 20 ms long whose
level jumps ≥ 8 dB over the median of the second before, louder than −45 dBFS, ≥ 0.25 s apart. Hits are
SFX *and* strong music accents (ƯỚC): read them as "how busy the background is", not as an exact SFX count.
Also (W6/W5, 2026-11-03, idea from kelano86/what-if-animation mixcheck.py, MIT): "masked" = the 0.4 s windows, while
someone is speaking, where the background comes within MARGIN dB of the voice ([time s, dB over the voice]). On our own
render (studio:compare) that is the list of words a hit or the music may cover; demucs leaks a little, so read it as ƯỚC.
Writes {"voiceLufs", "bedLufs", "bedMinusVoice", "hits": [s], "hitsPerMin", "masked"}. Stems are not kept (third-party audio).
Needs: pip install demucs (pulls torch), ffmpeg on PATH.
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

src, out = (sys.argv[1:3] + [None, None])[:2]  # --selftest needs neither
SR = 22050
HOP = int(SR * 0.02)
MARGIN = 3  # dB: background this close to the voice while words are spoken = a covered word
JUMP = 8  # dB rise that counts as a hit. Calibrated 2026-11-01 on Ep02 Hannibal: its code places 41 SFX (18.8/min), 8 dB finds 39 (17.9/min); 6 dB finds 115, 10 dB 18


def lufs(path):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True, encoding="utf-8", errors="replace").stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", log[log.rfind("Summary:"):])
    return float(m[0]) if m else None


def hits(path, jump):
    """[time, jump dB] of every rise ≥ `jump` dB over the median of the second before (≥ 0.25 s apart)."""
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    n = len(x) // HOP
    rms = np.sqrt(np.mean(x[: n * HOP].reshape(n, HOP) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    look = int(1 / 0.02)
    found = []
    for i in range(look, n):
        rise = db[i] - np.median(db[i - look : i])
        if db[i] > -45 and rise >= jump and (not found or i * 0.02 - found[-1][0] >= 0.25):
            found.append([round(i * 0.02, 2), round(float(rise), 1)])
    return found, n * 0.02


def mono(path):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def masked(voice, bed, margin=MARGIN):
    """[time, dB over the voice] of 0.4 s windows (hop 0.2 s) with words in them where the background is within `margin`."""
    w, hop = int(0.4 * SR), int(0.2 * SR)
    n = min(len(voice), len(bed))
    db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    starts = range(0, max(0, n - w), hop)
    v = [db(voice[i : i + w]) for i in starts]
    loud = [x for x in v if x > -60]
    if not loud:
        return []
    speaking = float(np.percentile(loud, 70)) - 8  # windows this loud hold words, not pauses
    out = []
    for i, vi in zip(starts, v):
        if vi >= speaking:
            over = db(bed[i : i + w]) - vi
            if over > -margin:
                out.append([round(i / SR, 1), round(float(over), 1)])
    return out


if "--selftest" in sys.argv:
    t = np.arange(SR * 4) / SR
    voice = np.where((t % 1) < 0.6, 0.3 * np.sin(2 * np.pi * 200 * t), 0.0).astype(np.float32)
    bed = (0.01 * np.sin(2 * np.pi * 50 * t)).astype(np.float32)
    bed[int(2.0 * SR) : int(2.4 * SR)] = 0.4  # a hit on a word at 2.0 s
    m = masked(voice, bed)
    assert m and all(1.6 <= x[0] <= 2.4 for x in m), m
    print("selftest ok", m)
    sys.exit(0)

with tempfile.TemporaryDirectory() as tmp:
    wav = Path(tmp) / "audio.wav"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-vn", "-ac", "2", "-ar", "44100", str(wav)], check=True)
    subprocess.run([sys.executable, "-m", "demucs", "--two-stems", "vocals", "-n", "htdemucs", "-o", tmp, str(wav)], check=True, capture_output=True)
    stem = Path(tmp) / "htdemucs" / "audio"
    voice, bed = lufs(stem / "vocals.wav"), lufs(stem / "no_vocals.wav")
    candidates, dur = hits(stem / "no_vocals.wav", 6)
    covered = masked(mono(stem / "vocals.wav"), mono(stem / "no_vocals.wav"))

found = [t for t, rise in candidates if rise >= JUMP]
data = {
    "voiceLufs": voice,
    "bedLufs": bed,
    "bedMinusVoice": round(bed - voice, 1) if voice is not None and bed is not None else None,
    "jump": JUMP,
    "hits": found,
    "hitsPerMin": round(len(found) / (dur / 60), 1) if dur else None,
    "candidates": candidates,  # every rise ≥ 6 dB, to re-threshold without running demucs again
    "seconds": round(dur, 2),
    "masked": covered,
}
with open(out, "w", encoding="utf-8") as fh:
    json.dump(data, fh, indent=1)
print(f"voice {voice} LUFS, background {bed} LUFS, {len(found)} hits ({data['hitsPerMin']}/min) -> {out}")
