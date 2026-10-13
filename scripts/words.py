"""
Word timestamps for karaoke subtitles: runs faster-whisper on an episode's VO
and writes, per VO line, the start time of every spoken word.

  python -P scripts/words.py <slug> [lang]   (lang: en default, vi, …; reads public/voiceover/<slug>/vo.mp3
                                              and src/voiceover/<slug>.timing.json)

Output: src/voiceover/<slug>.words.json  { "<line id>": [t0, t1, ...] } in seconds,
one entry per word Whisper heard inside that line. The subtitle maps displayed
words onto these times by position, so numerals ("1945") and spelled-out VO
("nineteen forty-five") still line up. Needs: pip install faster-whisper numpy.
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

slug = sys.argv[1]
root = Path(__file__).resolve().parent.parent
mp3 = root / "public" / "voiceover" / slug / "vo.mp3"
timing = json.loads((root / "src" / "voiceover" / f"{slug}.timing.json").read_text(encoding="utf-8"))
wav = root / "voiceover" / ".cache" / f"{slug}-16k.wav"
wav.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ac", "1", "-ar", "16000", str(wav)], check=True)

w = wave.open(str(wav))
audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
model = WhisperModel("small", device="cpu", compute_type="int8")
segs, _ = model.transcribe(audio, language=sys.argv[2] if len(sys.argv) > 2 else "en", word_timestamps=True)
heard = [(x.start, x.end) for s in segs for x in s.words]

out = {}
for line in timing["lines"]:
    a, b = line["start"] - 0.08, line["end"] + 0.08
    out[line["id"]] = [round(s, 3) for s, e in heard if a <= (s + e) / 2 <= b]
dst = root / "src" / "voiceover" / f"{slug}.words.json"
dst.write_text(json.dumps(out, indent=1) + "\n", encoding="utf-8")
print(f"OK {dst.relative_to(root)}: {sum(len(v) for v in out.values())} words in {len(out)} lines")
