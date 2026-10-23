#!/usr/bin/env python3
"""samples.py: recorded instruments for the arranger, from two CC0 libraries by Versilian Studios.

    python3 samples.py list                      # every sampled instrument and hit, with its state in the cache
    python3 samples.py fetch [NAME ...|all]      # download and prepare (first use does this by itself)
    python3 samples.py audition NAME OUT.wav [--notes 48,55,60,67]

Which files each instrument uses is pinned in samples.json (repository and commit per library), so a reel renders the
same everywhere. Files are fetched on first use from raw.githubusercontent.com into the cache
(`$MOTION_SHOWREEL_SAMPLES`, default `~/.cache/motion-showreel/samples`), mixed to mono, resampled to 48 kHz, trimmed
to the attack, cut to a few seconds, level-matched and stored as float16; the download itself is not kept.
A note is the nearest recorded pitch shifted by resampling (soxr), with a crossfaded loop when a sustained note
outlasts its sample and a release fade on note-off. Everything is deterministic: the same files and notes give the
same samples. The rendered music is embedded in the reel, so a delivered HTML or MP4 never needs the cache.

Libraries (both CC0 1.0, no attribution required; credited in references/audio.md):
  VCSL, Versilian Community Sample Library   https://github.com/sgossner/VCSL
  VSCO 2 Community Edition                    https://github.com/sgossner/VSCO-2-CE
"""
import io
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

import numpy as np

SR = 48000
PROC = 2                      # bump when the preparation below changes (old caches are ignored, not reused)
HERE = os.path.dirname(os.path.abspath(__file__))
NOTE_RX = re.compile(r"(?<![A-Za-z])([A-G])(#|b)?(-?\d)(?=[_\-.]|$)")
PC = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
REF_RMS = 0.12                # every prepared sample: RMS of its body at about -18 dBFS


def cache_dir():
    return os.environ.get("MOTION_SHOWREEL_SAMPLES") or os.path.join(os.path.expanduser("~"), ".cache", "motion-showreel", "samples")


@lru_cache(maxsize=1)
def manifest():
    with open(os.path.join(HERE, "samples.json"), encoding="utf-8") as f:
        return json.load(f)


def names():
    m = manifest()
    return list(m["instruments"]) + list(m["hits"])


def entry(name):
    m = manifest()
    return m["instruments"].get(name) or m["hits"].get(name)


def is_instrument(name):
    return name in manifest()["instruments"]


def is_hit(name):
    return name in manifest()["hits"]


def kind(name):
    e = manifest()["instruments"].get(name)
    return e["kind"] if e else None


def docs():
    m = manifest()
    return {n: f"recorded {e['doc']} [{m['libs'][e['lib']]['name']}, CC0]" for n, e in m["instruments"].items()}


def hit_docs():
    m = manifest()
    return {n: f"recorded {e['doc']} [{m['libs'][e['lib']]['name']}, CC0]" for n, e in m["hits"].items()}


def _file_key(lib, path):
    sha = manifest()["libs"][lib]["sha"][:10]
    return os.path.join(cache_dir(), lib, f"{sha}-p{PROC}", path.replace("/", "__").replace(" ", "_").replace(",", "")[:-4])


def note_of(fname):
    """MIDI note from a sample file name (`..._A#3_...`), None when it carries none."""
    m = NOTE_RX.search(os.path.basename(fname))
    if not m:
        return None
    pc = PC[m.group(1)] + (1 if m.group(2) == "#" else -1 if m.group(2) == "b" else 0)
    return 12 * (int(m.group(3)) + 1) + pc


def _f0(x):
    """Fundamental of a steady stretch (normalised autocorrelation with a YIN-style threshold), Hz or None."""
    n = len(x)
    if n < 4096:
        return None
    a = int(min(n - 4096, 0.15 * SR)) if n > 0.4 * SR else n // 4
    seg = x[a:a + 4096] * np.hanning(4096)
    if np.sqrt(np.mean(seg ** 2)) < 1e-4:
        return None
    r = np.fft.irfft(np.abs(np.fft.rfft(seg, 8192)) ** 2)[:4096]
    if r[0] <= 0:
        return None
    # cumulative mean normalised difference
    d = 2 * (r[0] - r)
    cmnd = np.ones_like(d)
    cs = np.cumsum(d[1:])
    cmnd[1:] = d[1:] * np.arange(1, len(d)) / np.maximum(cs, 1e-12)
    lo, hi = int(SR / 2600), int(SR / 28)
    sub = cmnd[lo:hi]
    idx = np.where(sub < 0.15)[0]
    if len(idx):
        i = idx[0]
        while i + 1 < len(sub) and sub[i + 1] < sub[i]:
            i += 1
    else:
        i = int(np.argmin(sub))
        if sub[i] > 0.45:
            return None
    lag = lo + i
    if 1 <= lag < len(cmnd) - 1:      # parabolic refinement
        y0, y1, y2 = cmnd[lag - 1], cmnd[lag], cmnd[lag + 1]
        den = y0 - 2 * y1 + y2
        lag = lag + (0.5 * (y0 - y2) / den if abs(den) > 1e-12 else 0.0)
    return SR / lag


def _prepare(raw, e, path, hit):
    import soundfile as sf
    import soxr
    x, sr = sf.read(io.BytesIO(raw), dtype="float64", always_2d=True)
    x = x.mean(axis=1)
    if sr != SR:
        x = soxr.resample(x, sr, SR, quality="VHQ")
    pk = float(np.max(np.abs(x))) or 1.0
    on = int(np.argmax(np.abs(x) > pk * 0.03))
    x = x[max(0, on - int(0.0015 * SR)):]
    keep = float(e.get("keep", 8.0 if hit else 4.0))
    if len(x) > keep * SR:
        x = x[:int(keep * SR)]
        fl = int(0.25 * SR)
        x[-fl:] *= np.cos(np.linspace(0, np.pi / 2, fl)) ** 2
    body = x[int(0.02 * SR):int(0.6 * SR)] if len(x) > 0.6 * SR else x
    rms = float(np.sqrt(np.mean(body ** 2))) or 1e-6
    x = x * (REF_RMS / rms)
    x = x / max(1.0, float(np.max(np.abs(x))) / 0.98)
    meta = {"path": path, "len": round(len(x) / SR, 4)}
    if not hit:
        m = note_of(path)
        f = _f0(x)
        if m is not None and f:
            est = 69 + 12 * np.log2(f / 440.0)
            m2 = min((m - 12, m, m + 12, m - 24, m + 24), key=lambda c: abs(c - est))
            meta["named"], meta["measured"] = m, round(float(est), 2)
            m = m2
            if abs(est - m) < 0.35:                    # fine tuning of the recording, in semitones
                meta["tune"] = round(float(est - m), 3)
        meta["root"] = m
    return x.astype(np.float16), meta


def _url(lib, path):
    L = manifest()["libs"][lib]
    return f"https://raw.githubusercontent.com/{L['repo']}/{L['sha']}/" + urllib.parse.quote(path)


def _download(url):
    """curl when present (it uses the system certificates), else urllib (with certifi when installed)."""
    import shutil
    import subprocess
    if shutil.which("curl"):
        r = subprocess.run(["curl", "-sfL", "--retry", "3", "--max-time", "300", url], capture_output=True)
        if r.returncode == 0 and r.stdout:
            return r.stdout
        raise OSError(f"download failed ({r.returncode}): {url}")
    ctx = None
    try:
        import ssl
        import certifi
        ctx = ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        pass
    req = urllib.request.Request(url, headers={"User-Agent": "motion-showreel"})
    with urllib.request.urlopen(req, timeout=300, context=ctx) as r:
        return r.read()


def _have(lib, path):
    k = _file_key(lib, path)
    return os.path.exists(k + ".npy") and os.path.exists(k + ".json")


def fetch(which=None, jobs=6, quiet=False):
    """Download and prepare every file of the named instruments / hits (all when None). Returns the count fetched."""
    which = names() if not which or which == ["all"] else which
    todo = []
    for n in which:
        e = entry(n)
        if not e:
            raise ValueError(f"unknown sampled instrument {n!r} (python3 samples.py list)")
        for p in e["files"]:
            if not _have(e["lib"], p):
                todo.append((n, e, p))
    if not todo:
        return 0
    if not quiet:
        print(f"samples: fetching {len(todo)} file(s) for {', '.join(sorted({t[0] for t in todo}))} into {cache_dir()}",
              file=sys.stderr)

    def one(t):
        n, e, p = t
        x, meta = _prepare(_download(_url(e["lib"], p)), e, p, is_hit(n))
        k = _file_key(e["lib"], p)
        os.makedirs(os.path.dirname(k), exist_ok=True)
        np.save(k + ".npy.tmp.npy", x)
        os.replace(k + ".npy.tmp.npy", k + ".npy")
        with open(k + ".json", "w") as f:
            json.dump(meta, f)
        return n

    with ThreadPoolExecutor(max_workers=jobs) as ex:
        for i, _ in enumerate(ex.map(one, todo)):
            if not quiet and (i + 1) % 20 == 0:
                print(f"  {i + 1}/{len(todo)}", file=sys.stderr)
    _bank.cache_clear()
    return len(todo)


@lru_cache(maxsize=None)
def _bank(name):
    e = entry(name)
    if not e:
        raise ValueError(f"unknown sampled instrument {name!r}")
    if any(not _have(e["lib"], p) for p in e["files"]):
        fetch([name])
    out = []
    for p in e["files"]:
        k = _file_key(e["lib"], p)
        with open(k + ".json") as f:
            meta = json.load(f)
        out.append((meta, np.load(k + ".npy").astype(np.float64)))
    if is_instrument(name):
        out = [o for o in out if o[0].get("root") is not None]
        out.sort(key=lambda o: o[0]["root"])
    return out


def _loop(x, need, xf=0.12):
    """Extend a sustained sample to `need` samples: crossfade-loop a steady middle stretch (equal power)."""
    n = len(x)
    if need <= n:
        return x[:need]
    a, b = int(n * 0.35), int(n * 0.85)
    f = min(int(xf * SR), (b - a) // 3)
    if b - a < 3 * f or f < 64:
        return np.concatenate([x, np.zeros(need - n)])
    seg = x[a:b]
    up, dn = np.sin(np.linspace(0, np.pi / 2, f)), np.cos(np.linspace(0, np.pi / 2, f))
    out = [x[:b - f]]
    tail = x[b - f:b]
    total = b - f
    while total < need:
        head = seg[:f] * up + tail * dn
        mid = seg[f:len(seg) - f]
        out += [head, mid]
        tail = seg[len(seg) - f:]
        total += len(head) + len(mid)
    return np.concatenate(out)[:need]


@lru_cache(maxsize=512)
def _shifted(name, i, shift):
    import soxr
    x = _bank(name)[i][1]
    if abs(shift) > 1e-6:
        x = soxr.resample(x, SR * 2 ** (shift / 12.0), SR, quality="HQ")
    x.setflags(write=False)
    return x


def note(name, m, dur, vel=0.8, seed=0, rel=None):
    """One note (mono, SR) of a sampled instrument: MIDI `m` (may be fractional), held `dur` s, released over the
    instrument's release time. Plucked and struck instruments ring naturally until note-off."""
    import soxr
    e = manifest()["instruments"][name]
    bank = _bank(name)
    if not bank:
        return np.zeros(int(0.05 * SR))
    i = min(range(len(bank)), key=lambda k: (abs(bank[k][0]["root"] - m), bank[k][0]["root"] - m > 0))
    x = _shifted(name, i, round(float(m) - bank[i][0]["root"] - bank[i][0].get("tune", 0.0), 4))
    rel = float(e.get("rel", 0.2) if rel is None else rel)
    d = max(0.02, float(dur))
    n_on, n_rel = int(d * SR), int(rel * SR)
    if e["kind"] == "sustain":
        x = _loop(x, n_on + n_rel)
    else:
        x = x[:n_on + n_rel]
        if len(x) < n_on + n_rel:
            x = np.concatenate([x, np.zeros(n_on + n_rel - len(x))])
    y = x.copy()
    if n_rel > 0 and n_on < len(y):
        k = min(n_rel, len(y) - n_on)
        y[n_on:n_on + k] *= np.cos(np.linspace(0, np.pi / 2, k)) ** 2
        y[n_on + k:] = 0.0
    a = int(0.003 * SR)
    y[:a] *= np.linspace(0, 1, a)
    v = float(np.clip(vel, 0.05, 1.0))
    g = (0.3 + 0.7 * v) ** 1.3 * float(e.get("gain", 1.0))
    if e["kind"] == "sustain" and v < 0.75:        # softer playing is darker as well as quieter
        from scipy.signal import butter, sosfilt
        sos = butter(2, min(0.45 * SR, 1800 + 14000 * v), "lp", fs=SR, output="sos")
        y = sosfilt(sos, y)
    return y * g


def hit(name, vel=0.8, seed=0, pitch=0.0, dur=None):
    """One unpitched hit (mono, SR); round-robin over the recorded variants by `seed`; `pitch` in semitones."""
    import soxr
    bank = _bank(name)
    meta, x = bank[int(seed) % len(bank)]
    if abs(pitch) > 1e-6:
        x = soxr.resample(x, SR * 2 ** (pitch / 12.0), SR, quality="HQ")
    if dur is not None and len(x) > dur * SR:
        n = int(dur * SR)
        x = x[:n].copy()
        f = min(n // 4, int(0.08 * SR))
        x[-f:] *= np.cos(np.linspace(0, np.pi / 2, f)) ** 2
    v = float(np.clip(vel, 0.05, 1.0))
    return x * (0.3 + 0.7 * v) ** 1.3 * float(entry(name).get("gain", 1.0))


def state(name):
    e = entry(name)
    have = sum(_have(e["lib"], p) for p in e["files"])
    return have, len(e["files"])


def main(argv=None):
    import argparse
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    f = sub.add_parser("fetch")
    f.add_argument("names", nargs="*")
    a = sub.add_parser("audition")
    a.add_argument("name")
    a.add_argument("out")
    a.add_argument("--notes", default="48,55,60,64,67,72")
    a.add_argument("--dur", type=float, default=0.9)
    args = ap.parse_args(argv)
    if args.cmd == "list":
        m = manifest()
        for n, e in list(m["instruments"].items()) + list(m["hits"].items()):
            have, tot = state(n)
            tag = e.get("kind", "hit")
            print(f"{n:16s} {tag:8s} {have:3d}/{tot:<3d} {e['doc']}")
        print(f"cache: {cache_dir()}")
        return 0
    if args.cmd == "fetch":
        k = fetch(args.names or None)
        print(f"fetched {k} file(s)")
        return 0
    if args.cmd == "audition":
        sys.path.insert(0, HERE)
        import synth as S
        if is_hit(args.name):
            parts = [hit(args.name, 0.8, seed=i) for i in range(len(_bank(args.name)))]
        else:
            parts = [note(args.name, int(m), args.dur, 0.8) for m in args.notes.split(",")]
        gap = np.zeros(int(0.15 * SR))
        y = np.concatenate([np.concatenate([p, gap]) for p in parts])
        S.write_wav(args.out, np.vstack([y, y]) * 0.5, 24)
        print(args.out, f"{len(y) / SR:.1f} s")
        return 0


if __name__ == "__main__":
    sys.exit(main())
