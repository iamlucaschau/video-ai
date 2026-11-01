"""
Transcript with word times for a reference video (Studio ingest, QUY-TRINH-PHAN-TICH §1.2).

  python -P scripts/transcribe.py <video|audio> <out.json> [lang]   (lang: auto-detect when left out)

Writes [{start, end, text, words: [[start, end, word], ...]}, ...] in seconds.
Needs: pip install faster-whisper.
"""
import json
import sys

from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
lang = sys.argv[3] if len(sys.argv) > 3 else None
model = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = model.transcribe(src, language=lang, word_timestamps=True)
data = [
    {
        "start": round(s.start, 2),
        "end": round(s.end, 2),
        "text": s.text.strip(),
        "words": [[round(w.start, 2), round(w.end, 2), w.word.strip()] for w in s.words or []],
    }
    for s in segs
]
with open(out, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)
print(f"{len(data)} segments ({info.language}) -> {out}")
