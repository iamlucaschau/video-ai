"""
Final render + master for a Naval Board episode (16:9, 1080p30), the chain used for Carrier and Submarines.

  python -P scripts/naval-final.py <composition-id> "<episode>/<slug>.mp4"
  python -P scripts/naval-final.py <composition-id> "<episode>/<slug>.mp4" --audio-only

Picture (crf 18, muted) and audio (wav) are rendered separately; the audio goes through lowpass 15.5 kHz + limiter
0.63 + two-pass loudnorm (-14 LUFS, -2.5 dBTP, linear), AAC 320k, then is muxed onto the picture with -c:v copy.
--audio-only re-renders only the sound and muxes it onto the picture kept from the last run (out/<id>-picture.mp4):
a sound-only fix then takes about 25 min instead of about 1 h (Naval Board #2, 2026-11-08). Keep that picture file
until the episode is approved. Prints the loudness of the result. Then run short-qa.py and `npm run listen`.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import time

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if len(sys.argv) < 3:
    raise SystemExit(__doc__)
ID, OUT = sys.argv[1], sys.argv[2]
AUDIO_ONLY = "--audio-only" in sys.argv
PIC, WAV, AAC, BUNDLE = f"out/{ID}-picture.mp4", f"out/{ID}-audio.wav", f"out/{ID}-master.m4a", f"out/bundle-{ID}"
CLI = ["node", "node_modules/@remotion/cli/remotion-cli.js"]


def run(cmd, what):
    t = time.time()
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, encoding="utf8", errors="replace")
    print(f"{what}: exit {r.returncode}, {time.time() - t:.0f} s", flush=True)
    if r.returncode:
        print((r.stderr or r.stdout)[-1500:], flush=True)
        raise SystemExit(1)
    return r


if AUDIO_ONLY and not os.path.exists(os.path.join(ROOT, PIC)):
    raise SystemExit(f"--audio-only needs {PIC} from an earlier full run")
os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
run(CLI + ["bundle", "--out-dir", BUNDLE], "bundle")
try:
    if not AUDIO_ONLY:
        run(CLI + ["render", BUNDLE, ID, PIC, "--crf=18", "--muted", "--timeout=90000", "--overwrite"], "picture")
    run(CLI + ["render", BUNDLE, ID, WAV, "--codec=wav", "--timeout=90000", "--overwrite"], "audio")
finally:
    shutil.rmtree(os.path.join(ROOT, BUNDLE), ignore_errors=True)  # ~700 MB, Remotion never removes it
pre = "lowpass=f=15500,alimiter=limit=0.63:level=false"
r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", WAV, "-af", f"{pre},loudnorm=I=-14:TP=-2.5:LRA=11:print_format=json", "-f", "null", "-"], "measure")
m = json.loads(re.search(r"\{[^{}]*input_i[^{}]*\}", r.stderr, re.S).group(0))
af = f"{pre},loudnorm=I=-14:TP=-2.5:LRA=11:linear=true:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", WAV, "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "320k", AAC], "master")
run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", PIC, "-i", AAC, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "copy", "-movflags", "+faststart", OUT], "mux")
for f in (WAV, AAC):
    os.remove(os.path.join(ROOT, f))
r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", OUT, "-af", "ebur128=peak=true", "-f", "null", "-"], "loudness")
s = r.stderr[r.stderr.rfind("Summary:"):]
print("integrated", re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1), "LUFS, true peak", re.search(r"Peak:\s+(-?[\d.]+) dBFS", s).group(1), "dBTP")
print(f"done: {OUT} (picture kept at {PIC} for --audio-only fixes)")
