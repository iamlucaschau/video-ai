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
    # carrier-watch (Test/carrier, 2026-11-05): E minor i – VI – III – VII, slow, open fifths over the sea
    "carrier-watch": {
        "bar": 7.5,
        "chords": [(28, [47, 52, 55, 59]), (24, [48, 52, 55, 60]), (31, [47, 50, 55, 59]), (26, [50, 54, 57, 62])],
        "arp": [12, 19, 24, 19, 12, 19, 24, 31],
        "seed": 12,
    },
    # ambush-tension (Test/ambush, 2026-11-05): A minor i – VI – iv – V, slow, dark military explainer bed
    "ambush-tension": {
        "bar": 8.0,
        "chords": [(33, [45, 52, 57, 60]), (29, [45, 53, 57, 60]), (38, [50, 53, 57, 62]), (28, [47, 52, 56, 59])],
        "arp": [12, 19, 15, 19, 12, 24, 15, 19],
        "seed": 9,
    },
    # P2 Explorers: D minor, i – VI – III – VII, slow and wide (cold sea, long voyage)
    "p2-explorers": {
        "bar": 8.0,
        "chords": [(38, [50, 57, 62, 65]), (34, [53, 58, 62, 65]), (41, [53, 57, 60, 65]), (36, [52, 55, 60, 64])],
        "arp": [12, 19, 24, 15, 19, 12, 24, 19],  # semitones over the bass, octave up
        "seed": 6,
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


def make(preset, seconds):
    p = PRESETS[preset]
    rng = np.random.default_rng(p["seed"])
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

    # synthetic hall: decorrelated decaying noise per channel, darkened
    L = int(3.2 * SR)
    ti = np.arange(L) / SR
    ir = rng.standard_normal((L, 2)) * np.exp(-6.9 * ti / 2.8)[:, None]
    ir = lowpass(ir, 3500)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    N = 1 << int(np.ceil(np.log2(n + L)))
    wet = np.fft.irfft(np.fft.rfft(mix, N, axis=0) * np.fft.rfft(ir, N, axis=0), N, axis=0)[:n]
    out = 0.65 * mix + 0.6 * wet
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
