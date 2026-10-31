#!/usr/bin/env python3
"""Design directions from the shiraki.design YAML Library, one entry at a time, for reels whose material has no look.

    design_library.py index [--category isometric] [--series slide|infographic] [--grep glass] [--refresh] [--json]
    design_library.py get ID [ID ID]          # at most 3: the entry's YAML text and sample image into the cache
    design_library.py draft ID --project P    # P/build/design-direction.{md,json}: palette roles with contrast,
                                              # type, motifs -> engine moves, layouts -> scenes, bans -> post
    design_library.py where                   # the cache folder

shiraki.design (by Shiraki, operated by Chikamori Sangyo) publishes free design specifications ("YAML") for slides
and infographics: palette, type, motifs, layout rules and bans, each with a sample image. Its terms
(https://shiraki.design/en/terms) let you use and adapt the YAML for your own work and share links to its pages.
They forbid distributing or publishing any YAML in whole or in part (modified versions too), building a library
from it, and bulk downloading. So this tool:
  - keeps the YAML and images in a per-user cache outside every repo ($SHOWREEL_CACHE or ~/.cache/motion-showreel),
  - fetches at most 3 entries per run and 10 per 24 hours, with a pause between requests, and serves the cache after,
  - writes only drafts derived for one project into P/build/ (generated, git-ignored), never into style.json,
    STORYBOARD.md, a README or any committed file. Cite the entry by number, title and link instead.
The library's YAML is written flat (no indentation, pasted as-is into a slide generator); `draft` rebuilds a
section > group outline from blank lines and empty keys, which is enough to find colours and their roles.
"""
import argparse
import colorsys
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SITE = "https://shiraki.design"
LIBRARY = "shiraki.design YAML Library"
TERMS = SITE + "/en/terms"
UA = "motion-showreel design_library.py (one entry at a time; https://github.com/AwesomeZun/Awesome-Showreels)"
PER_RUN, PER_DAY, PAUSE = 3, 10, 1.5
INDEX_TTL = 7 * 86400
NOTICE = ("Cached for your own use under the shiraki.design terms (" + TERMS + "): do not redistribute, publish or "
          "commit these files, in whole or in part. Cite entries by number, title and link.\n")


# ═════════════════════════════════════════ cache and fetching ═════════════════════════════════════════
def cache_dir():
    root = Path(os.environ.get("SHOWREEL_CACHE") or Path.home() / ".cache" / "motion-showreel")
    d = root / "design-library" / "shiraki"
    (d / "entries").mkdir(parents=True, exist_ok=True)
    if not (d / "NOTICE.txt").exists():
        (d / "NOTICE.txt").write_text(NOTICE)
    return d


def norm_id(s):
    s = re.sub(r"^NO\.?\s*", "", str(s).strip().upper())
    if re.fullmatch(r"\d{1,3}", s):
        return s.zfill(3)
    if re.fullmatch(r"Z\d{1,2}", s):
        return "Z" + s[1:].zfill(2)
    raise SystemExit(f"not an entry id: {s!r} (numbers like 236, or Z01-Z99 for infographics; ranges are refused)")


def entry_url(eid):
    return f"{SITE}/en/library/{eid.lower()}"


def _fetch_log(d):
    p = d / "fetch-log.jsonl"
    now = time.time()
    rows = [json.loads(l) for l in p.read_text().splitlines() if l.strip()] if p.exists() else []
    return p, [r for r in rows if now - r["t"] < 86400]


def http_get(url, binary=False):
    """GET one public page or image (no cookies, no credentials): urllib with certifi when present, then curl."""
    import ssl
    err = None
    try:
        try:
            import certifi
            ctx = ssl.create_default_context(cafile=certifi.where())
        except ImportError:
            ctx = ssl.create_default_context()
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            data = r.read()
        return data if binary else data.decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{url}: HTTP {e.code}")
    except Exception as e:  # certificate store missing, proxy, timeout
        err = e
    curl = shutil.which("curl")
    if curl:
        r = subprocess.run([curl, "-fsSL", "--max-time", "30", "-A", UA, "-H", "Accept-Language: en", url], capture_output=True)
        if r.returncode == 0 and r.stdout:
            return r.stdout if binary else r.stdout.decode("utf-8", "replace")
        err = r.stderr.decode("utf-8", "replace").strip() or f"curl exit {r.returncode}"
    raise SystemExit(f"{url}: {err} (offline? cached entries still work)")


def rsc_payload(page):
    """Next.js pages carry their data as self.__next_f.push([1, "..."]) string chunks; join them."""
    out = []
    for c in re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>', page, re.S):
        try:
            out.append(json.loads('"' + c + '"'))
        except ValueError:
            pass
    return "".join(out)


def parse_index(page):
    raw = rsc_payload(page) or page
    seen, rows = set(), []
    for m in re.finditer(r'\{\s*"id"\s*:\s*"[^"]+"\s*,\s*"series"\s*:\s*"[^"]+"[^{}]*?"categoryLabel"\s*:\s*"[^"]*"\s*\}', raw):
        try:
            o = json.loads(m.group(0))
        except ValueError:
            continue
        if o["id"] in seen:
            continue
        seen.add(o["id"])
        rows.append({"id": o["id"], "series": o.get("series", ""), "title": o.get("title", ""),
                     "category": o.get("categoryLabel", ""), "categoryJa": o.get("category", ""),
                     "ratio": o.get("ratio", ""), "chars": o.get("chars")})
    return sorted(rows, key=lambda r: (r["series"] != "slide", r["id"]))


def parse_entry(page):
    """The YAML is an RSC text chunk 'NN:T<hex byte length>,<text>' starting with a 'Design Style:' line."""
    raw = rsc_payload(page)
    for m in re.finditer(r"(?:^|\n)[0-9a-z]+:T([0-9a-f]+),", raw):
        b = raw[m.end():].encode("utf-8")[: int(m.group(1), 16)]
        text = b.decode("utf-8", "ignore")
        if re.search(r"^\s*(Design Style|Name)\s*:", text, re.M):
            return text.strip() + "\n"
    return None


def load_index(refresh=False, offline=False):
    d = cache_dir()
    p = d / "index.json"
    if p.exists() and not refresh:
        idx = json.loads(p.read_text())
        if offline or time.time() - idx.get("t", 0) < INDEX_TTL:
            return idx
    if offline:
        raise SystemExit("no cached index; run once online: design_library.py index")
    rows = parse_index(http_get(SITE + "/en/library"))
    if not rows:
        raise SystemExit("the library page changed shape: no entries found (update parse_index)")
    idx = {"t": time.time(), "fetched": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
           "source": SITE + "/en/library", "entries": rows}
    p.write_text(json.dumps(idx, ensure_ascii=False, indent=1))
    return idx


def get_entries(ids, offline=False, refresh=False):
    if len(ids) > PER_RUN:
        raise SystemExit(f"at most {PER_RUN} entries per run (the library's terms forbid bulk downloading); "
                         "shortlist with `index` and look at the sample images first")
    d = cache_dir()
    out, fetched = [], 0
    for eid in map(norm_id, ids):
        meta_p, yaml_p, img_p = d / "entries" / f"{eid}.json", d / "entries" / f"{eid}.yaml.txt", d / "entries" / f"{eid}.webp"
        if meta_p.exists() and yaml_p.exists() and not refresh:
            out.append(json.loads(meta_p.read_text()))
            continue
        if offline:
            raise SystemExit(f"{eid} is not cached (offline)")
        log_p, recent = _fetch_log(d)
        if len(recent) >= PER_DAY:
            raise SystemExit(f"{PER_DAY} entries fetched in the last 24 hours; use the cached ones or wait "
                             "(no bulk downloading)")
        if fetched:
            time.sleep(PAUSE)
        page = http_get(entry_url(eid))
        text = parse_entry(page)
        if not text:
            raise SystemExit(f"{entry_url(eid)}: no YAML found (the page changed shape, or the entry does not exist)")
        title = re.search(r'^Name\s*:\s*"?([^"\n]+)"?', text, re.M)
        cat = re.search(r'"id":"%s"[^{}]*?"categoryLabel":"([^"]*)"' % eid, rsc_payload(page))
        cat = cat.group(1) if cat else next((r["category"] for r in json.loads((d / "index.json").read_text())["entries"]
                                             if r["id"] == eid), "") if (d / "index.json").exists() else ""
        yaml_p.write_text(text)
        img = None
        m = re.search(r'/full/%s\.(?:webp|png|jpg)' % eid, page, re.I)
        if m:
            time.sleep(PAUSE)
            img_p = img_p.with_suffix(Path(m.group(0)).suffix)
            img_p.write_bytes(http_get(SITE + m.group(0), binary=True))
            img = str(img_p)
        meta = {"id": eid, "title": title.group(1).strip() if title else "", "category": cat,
                "url": entry_url(eid), "yaml": str(yaml_p), "image": img, "chars": len(text),
                "fetched": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")}
        meta_p.write_text(json.dumps(meta, ensure_ascii=False, indent=1))
        with log_p.open("a") as f:
            f.write(json.dumps({"t": time.time(), "id": eid}) + "\n")
        fetched += 1
        out.append(meta)
    return out


# ═════════════════════════════════════════ flat YAML outline ═════════════════════════════════════════
KEY = re.compile(r"^([^\s\-#][^:]{0,60}?)\s*:\s*(.*)$")


def outline(text):
    """Items (line, path, key, value) from the flat YAML. A key with no value after a blank line (or at the top) opens
    a section; inside a section, consecutive empty keys nest and an empty key after a value is a sibling; list items
    and folded '>' lines belong to the open group."""
    items, section, stack = [], None, []
    blank, last_was_group, folding = True, False, None
    for n, line in enumerate(text.splitlines(), 1):
        s = line.strip()
        if not s:
            blank, folding = True, None
            continue
        m = KEY.match(s) if not s.startswith("- ") else None
        if folding is not None and not m:
            folding["value"] += s
            continue
        folding = None
        if m and not m.group(2):
            k = m.group(1).strip()
            if blank or section is None:
                section, stack = k, []
            elif last_was_group:
                stack.append(k)
            else:
                stack = stack[:-1] + [k] if stack else [k]
            last_was_group = True
        elif m:
            v = m.group(2).strip()
            it = {"line": n, "path": [section, *stack], "key": m.group(1).strip(), "value": "" if v in (">", "|", ">-", "|-") else v.strip('"')}
            items.append(it)
            if v in (">", "|", ">-", "|-"):
                folding = it
            last_was_group = False
        else:
            items.append({"line": n, "path": [section, *stack], "key": "-", "value": s[1:].strip().strip('"')})
            last_was_group = False
        blank = False
    return items


# ═════════════════════════════════════════ colour ═════════════════════════════════════════
HEX = re.compile(r"#[0-9A-Fa-f]{6}\b")


def rgb(h):
    return tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))


def to_hex(c):
    return "#" + "".join(f"{round(max(0, min(1, x)) * 255):02X}" for x in c)


def lum(h):
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(f, rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def chroma(h):
    c = rgb(h)
    return max(c) - min(c)


def hue(h):
    return colorsys.rgb_to_hls(*rgb(h))[0] * 360


def mix(a, b, t):
    return to_hex(tuple(x + (y - x) * t for x, y in zip(rgb(a), rgb(b))))


def reach(c, bg, target):
    """Move c away from bg in lightness (towards black on light stages, white on dark) until contrast >= target."""
    if contrast(c, bg) >= target:
        return c
    end = "#000000" if lum(bg) > 0.18 else "#FFFFFF"
    for i in range(1, 51):
        x = mix(c, end, i / 50)
        if contrast(x, bg) >= target:
            return x
    return end


def colours(items):
    out = []
    for it in items:
        for h in HEX.findall(it["value"]):
            out.append({"hex": h.upper(), "path": [p for p in it["path"] if p], "key": it["key"], "line": it["line"]})
    return out


def where(c):
    return " › ".join([*c["path"], c["key"]])


def draft_roles(items):
    cols = colours(items)
    pal = [c for c in cols if re.search(r"colou?r|palette|カラー|配色", " ".join(c["path"][:1]), re.I)]
    typ = [c for c in cols if re.search(r"typo|font|書体|文字", " ".join(c["path"][:1]), re.I)]
    canvas = [c for c in cols if c["path"] and re.search(r"canvas|キャンバス", c["path"][0], re.I) and re.search(r"background|背景|bg", c["key"], re.I)]
    pick, why = {}, {}

    def put(role, h, src):
        pick[role], why[role] = h.upper(), src

    if canvas:
        put("bg", canvas[0]["hex"], where(canvas[0]))
    else:
        cand = pal or cols
        if not cand:
            return None
        c = max(cand, key=lambda c: (chroma(c["hex"]) < 0.12, lum(c["hex"])))
        put("bg", c["hex"], where(c) + " (lightest neutral; no canvas background given)")
    bg = pick["bg"]
    dark = lum(bg) < 0.18
    uniq = {}
    for c in pal + typ + cols:
        uniq.setdefault(c["hex"], c)

    def typo(rx):
        for c in typ:
            if re.search(rx, " ".join(c["path"][1:]), re.I) and re.search(r"colou?r|色", c["key"], re.I):
                return c
        return None

    head, body, label = typo(r"head|title|hero|display|見出し"), typo(r"body|text|本文"), typo(r"label|caption|note|meta|small|注")
    best = max(uniq.values(), key=lambda c: contrast(c["hex"], bg))
    for c, need in ((head, 7), (body, 7), (best, 7)):
        if c and contrast(c["hex"], bg) >= need:
            put("ink", c["hex"], where(c))
            break
    else:
        put("ink", reach(best["hex"], bg, 7), f"{where(best)} pushed to 7:1")
    ink = pick["ink"]
    if body and body["hex"] != ink and contrast(body["hex"], bg) >= 4.5:
        put("ink2", body["hex"], where(body))
    else:
        put("ink2", reach(mix(ink, bg, 0.25), bg, 4.5), "derived: ink towards bg, held at 4.5:1")
    if label and chroma(label["hex"]) < 0.15 and contrast(label["hex"], bg) >= 4.5:
        put("muted", label["hex"], where(label))
    else:
        put("muted", reach(mix(ink, bg, 0.42), bg, 4.6), "derived: ink towards bg, held at 4.6:1")
    near = sorted((c for c in uniq.values() if c["hex"] != bg and contrast(c["hex"], bg) < 1.35 and chroma(c["hex"]) < 0.25),
                  key=lambda c: contrast(c["hex"], bg))
    if near:
        put("surface", near[0]["hex"], where(near[0]))
    else:
        put("surface", mix(bg, "#FFFFFF", 0.06) if dark else mix(bg, ink, 0.03) if lum(bg) > 0.9 else mix(bg, "#FFFFFF", 0.5),
            "derived: a step off bg")
    rest = [c for c in near[1:] if c["hex"] != pick["surface"]]
    if rest:
        put("bg2", rest[0]["hex"], where(rest[0]))
    else:
        put("bg2", mix(bg, ink, 0.06), "derived: bg towards ink by 6%")
    used = set(pick.values())
    acc = [c for c in uniq.values() if c["hex"] not in used and chroma(c["hex"]) >= 0.22 and c in pal]
    acc += [c for c in uniq.values() if c["hex"] not in used and chroma(c["hex"]) >= 0.22 and c not in acc]
    rank = lambda c: (0 if re.search(r"primary|main|brand|key|メイン", " ".join(c["path"][1:]), re.I) else
                      1 if re.search(r"accent|アクセント", " ".join(c["path"][1:]), re.I) else 2, -chroma(c["hex"]))
    acc.sort(key=rank)
    for role, c in zip(("accent", "accent2", "accent3"), acc):
        put(role, c["hex"], where(c))
    if "accent" not in pick:
        put("accent", ink, "monochrome entry: the accent is the ink")
    a = pick["accent"]
    for i, role in enumerate(("accent2", "accent3")):
        if role not in pick:
            put(role, mix(a, bg if i else ink, 0.45), "derived: accent towards " + ("bg" if i else "ink"))
    kin = [c for c in uniq.values() if chroma(c["hex"]) >= 0.2 and min(abs(hue(c["hex"]) - hue(a)), 360 - abs(hue(c["hex"]) - hue(a))) <= 20
           and contrast(c["hex"], bg) >= 4.5]
    if contrast(a, bg) >= 4.5:
        put("accentInk", a, "accent (already 4.5:1)")
    elif kin:
        c = min(kin, key=lambda c: contrast(c["hex"], bg))
        put("accentInk", c["hex"], where(c) + " (the entry's own deeper shade of the accent)")
    else:
        put("accentInk", reach(a, bg, 4.5), "accent pushed to 4.5:1 for text")
    put("onAccent", "#FFFFFF" if contrast("#FFFFFF", a) >= contrast(ink, a) else ink, "the better of white and ink on the accent")
    put("line", mix(ink, bg, 0.82), "derived: ink at 18% on bg (decoration only)")
    for role, (lo, hi), base in (("ok", (85, 170), "#2E9E5B"), ("warn", (30, 60), "#C98A00"), ("deny", (345, 20), "#D64545")):
        inh = lambda h: (lo <= hue(h) <= hi) if lo < hi else (hue(h) >= lo or hue(h) <= hi)
        c = next((c for c in uniq.values() if chroma(c["hex"]) >= 0.3 and inh(c["hex"]) and contrast(c["hex"], bg) >= 3), None)
        if c:
            put(role, c["hex"], where(c))
        else:
            put(role, reach(base, bg, 3), "derived: semantic hue, held at 3:1 (the entry has none)")
    ratios = {k: round(contrast(v, bg), 2) for k, v in pick.items() if k != "bg"}
    ratios["onAccent"] = round(contrast(pick["onAccent"], a), 2)
    return {"theme": "dark" if dark else "light", "palette": pick, "from": why, "contrast": ratios,
            "unused": [{"hex": c["hex"], "at": where(c)} for c in uniq.values() if c["hex"] not in set(pick.values())]}


# ═════════════════════════════════════════ reading the rest ═════════════════════════════════════════
# motif words (English and Japanese, as the library writes them) -> what the engine already does well
MOTIFS = [
    (r"glass|ガラス|bubble|バブル", "glass and bubbles", "G3 `glass`/`crystal` materials need something behind them; a 2D frosted panel is blur + a light edge"),
    (r"chrome|クローム|liquid metal|メタル|金属", "liquid chrome", "G3 `chrome`/`metal` under RoomEnvironment light; `deform.wave`/`morph` for liquid"),
    (r"iridescen|holograph|ホログラ|虹|aurora|オーロラ|prism", "iridescence", "G3 `iridescent`; in 2D a slow hue drift in a gradient"),
    (r"isometric|アイソメ", "isometric", "a G3 rig with `ortho` (half-height) at the true isometric angle, or a 2D iso grid (examples/pixel-isometric)"),
    (r"miniature|ミニチュア|diorama|ジオラマ|tilt", "miniature", "G3 tilt-shift band (`dof: {mode: 'tilt'}`), small objects, a high camera"),
    (r"3d.?typo|立体文字|extrud|3D文字", "3D type", "G3 `geo.text` extruded from the reel's own font, letters fly in from depth"),
    (r"risograph|リソ", "risograph", "two or three inks with a misregistration offset and grain (examples/riso-zine)"),
    (r"halftone|ハーフトーン|網点|newspaper|新聞", "halftone and newsprint", "halftone dots and a printing-press reveal (examples/newsprint)"),
    (r"swiss|スイス|international typographic", "Swiss grid", "a visible column grid, hard cuts on the beat, one strong colour (examples/swiss-grid)"),
    (r"memphis|メンフィス|squiggle", "Memphis", "springy primitives (triangles, squiggles, dots) bouncing on beats"),
    (r"brutalis|ブルータリ", "brutalist", "hard offset shadows, thick outlines, snap moves without easing (examples/neo-brutal)"),
    (r"neumo|ニューモ|soft ui", "neumorphism", "double soft shadows on one surface tone; presses sink in instead of moving"),
    (r"collage|コラージュ|cutout|切り抜き", "collage", "paper cutouts with torn edges, stepped at 12 fps for a stop-motion feel"),
    (r"watercolou?r|水彩", "watercolour", "bleeding reveals and paper texture (examples/botanical-organic)"),
    (r"blueprint|設計図|wireframe|ワイヤー|line drawing|線画", "line drawing", "strokes drawn on (dash offset), G3 `wire` for 3D wireframes"),
    (r"ukiyo|浮世絵|和柄|japanese pattern|墨", "Japanese print", "flat woodblock colour, ink textures (examples/sumi-wabi)"),
    (r"windows ?(98|xp)|retro ui|レトロUI|pixel|ピクセル|ドット", "retro UI and pixels", "window pop-ins with bevels, pixel type on its native grid (examples/pixel-*)"),
    (r"neon|ネオン", "neon", "a night stage, bloom ramped in (`env.fx`), G3 `neon` material"),
    (r"comic|コミック|漫画|manga|speech bubble|吹き出し", "comic", "speed lines, impact frames, panels that cut on the beat (transition `impact`)"),
    (r"corner cut|斜めカット|diagonal|斜め|slash", "diagonal cuts", "diagonal wipes and slanted masks on scene changes"),
    (r"gradient|グラデーション|mesh", "gradients", "slow drifting gradient fields behind type"),
    (r"chart|グラフ|graph|data|データ|数値|kpi|統計", "data", "counters and impact numbers (recipes 23, 27), charts drawn in vector from real numbers"),
    (r"timeline|タイムライン|年表", "timeline", "a line drawing itself with nodes landing on beats"),
    (r"icon|アイコン|pictogram|ピクト", "icons", "vector icons drawn in code, popping in on beats"),
    (r"character|キャラクター|mascot|マスコット|creature|animal|動物", "characters", "draw characters in code; generated poses only extend the client's own mascot"),
    (r"photo|写真", "photography", "real photos as `photos` sources (2.5D parallax, recipe 34); their treatment goes to `post`"),
    (r"magazine|雑誌|editorial|エディトリアル", "editorial", "large serif or grotesk headlines, generous margins, hairline rules (examples/editorial-luxe)"),
]
LAYOUTS = [
    (r"cover|表紙|title", "opener: the title or logo scene"),
    (r"section|divider|章扉|chapter", "section card: a full-colour field between acts, or the transition between them"),
    (r"standard|content|本文|body", "claim scenes: one message per scene"),
    (r"timeline|年表", "timeline scene"),
    (r"data|chart|graph|kpi|数値|グラフ|trend|donut|pie|bar|distribution", "data scene: counters, bars, a donut drawn from real numbers"),
    (r"process|flow|step|手順|フロー", "process scene: steps linked by arrows that draw on beat by beat"),
    (r"header|hero|ヘッダー", "opener: the headline and the key visual"),
    (r"contact|cta|action|連絡|相談", "end card: the call to action"),
    (r"panel|card|カード", "card scenes: one panel per claim"),
    (r"profile|team|member|人物|メンバー", "team scene: a tile wall of portraits (recipe 24)"),
    (r"closing|end|cta|まとめ|結び", "end card"),
]
BANS = [
    (r"影|shadow", "no drop shadows: flat cards, `post.vignette.a` 0"),
    (r"立体|3D|three.?dimensional", "no 3D: keep `solid-3d` out of the carriers"),
    (r"グラデーション|gradient", "flat fills, no gradient backdrops"),
    (r"写真|photo", "no photos"),
    (r"装飾|decorat", "minimal decoration"),
    (r"以外.*(鮮やか|アクセント)|other (bright|vivid|accent)|only one accent", "one accent only: the other roles stay neutral"),
]
NEG = re.compile(r"禁止|しない|避け|使わない|\bno |\bnot |avoid|never|without", re.I)


def reading(items):
    text = [(it["line"], f"{it['key']} {it['value']}") for it in items]
    motifs = []
    for rx, name, how in MOTIFS:
        lines = [n for n, s in text if re.search(rx, s, re.I) and not NEG.search(s)]     # a ban is not a motif
        if lines:
            motifs.append({"motif": name, "engine": how, "lines": lines[:6]})
    lay = []
    for it in items:
        sec = it["path"][0] or ""
        if re.search(r"layout|レイアウト|structure|構成|chart|グラフ|図表", sec, re.I) and len(it["path"]) > 1:
            g = it["path"][1]
            for rx, role in LAYOUTS:
                if re.search(rx, g, re.I) and not any(x["group"] == g for x in lay):
                    lay.append({"group": g, "scene": role, "line": it["line"]})
                    break
    bans = []
    for it in items:
        if NEG.search(it["value"]):
            for rx, what in BANS:
                if re.search(rx, it["value"], re.I) and not any(b["post"] == what for b in bans):
                    bans.append({"post": what, "line": it["line"]})
    mood = [it["value"] for it in items if it["key"] == "-" and re.search(r"mood|ムード|雰囲気", it["path"][0] or "", re.I)]
    typ = {}
    for it in items:
        if re.search(r"typo|font|書体", it["path"][0] or "", re.I) and len(it["path"]) > 1 and re.search(r"style|weight|family|font", it["key"], re.I):
            typ.setdefault(it["path"][1], {})[it["key"].lower()] = it["value"]
    fonts = []
    for g, o in typ.items():
        st, w = o.get("style", "") or o.get("family", "") or o.get("font", ""), o.get("weight", "")
        kind = ("mono" if re.search(r"mono|code|等幅", st, re.I) else "serif" if re.search(r"serif|明朝|mincho|antiqua|didone|bodoni", st, re.I) and not re.search(r"sans", st, re.I)
                else "display" if re.search(r"head|title|hero|display|見出し", g, re.I) else "sans")
        fonts.append({"group": g, "style": st, "weight": w, "role": kind,
                      "korean": "the reel's own Korean family at the same weight (Pretendard, SUIT, Noto Sans KR; serif: Noto Serif KR)"
                      if re.search(r"japanese|和文|日本語|ゴシック|明朝", st, re.I) else ""})
    return {"mood": mood, "fonts": fonts, "motifs": motifs, "layouts": lay, "bans": bans}


# ═════════════════════════════════════════ commands ═════════════════════════════════════════
def cmd_index(a):
    idx = load_index(refresh=a.refresh, offline=a.offline)
    rows = idx["entries"]
    if a.category:
        rows = [r for r in rows if a.category.lower() in (r["category"] + " " + r["categoryJa"]).lower()]
    if a.series:
        rows = [r for r in rows if r["series"].startswith(a.series)]
    if a.grep:
        rows = [r for r in rows if re.search(a.grep, r["title"], re.I)]
    if a.json:
        print(json.dumps(rows, ensure_ascii=False, indent=1))
        return
    cats = {}
    for r in idx["entries"]:
        cats[r["category"]] = cats.get(r["category"], 0) + 1
    print(f"{LIBRARY}: {len(idx['entries'])} entries (index fetched {idx['fetched']}; {SITE}/en/library)")
    if not (a.category or a.series or a.grep):
        print("categories: " + ", ".join(f"{k} {v}" for k, v in sorted(cats.items(), key=lambda kv: -kv[1])))
    for r in rows:
        print(f"{r['id']:>4}  {r['series'][:5]:5}  {r['ratio'][:12]:12}  {r['category'][:20]:20}  {r['title']}")
    if rows and not a.json:
        print(f"\nlook first: {SITE}/en/library/<id>   then: design_library.py get <id> (at most {PER_RUN})")


def cmd_get(a):
    for m in get_entries(a.ids, offline=a.offline, refresh=a.refresh):
        print(f"{m['id']}  {m['title']}  [{m['category']}]  {m['url']}")
        print(f"      yaml  {m['yaml']}  ({m['chars']} chars)")
        if m.get("image"):
            print(f"      image {m['image']}  (the library's sample: look at it before choosing)")
    print("\n" + NOTICE.strip())


def cmd_draft(a):
    m = get_entries([a.id], offline=a.offline)[0]
    text = Path(m["yaml"]).read_text()
    items = outline(text)
    roles = draft_roles(items)
    if not roles:
        raise SystemExit(f"{m['id']}: no colours found in the YAML")
    rd = reading(items)
    P = Path(a.project).resolve()
    out = P / "build"
    out.mkdir(parents=True, exist_ok=True)
    data = {"tool": "design_library.py", "library": LIBRARY, "terms": TERMS, "entry": {k: m[k] for k in ("id", "title", "category", "url")},
            "cache": {"yaml": m["yaml"], "image": m.get("image")}, **roles, **rd,
            "styleJson": {"meta.direction": {"library": LIBRARY, "id": m["id"], "title": m["title"], "url": m["url"],
                                             "why": "<why this entry fits the material, in one sentence>", "approved": False},
                          "source[]": {"url": m["url"], "kind": "design-library",
                                       "notes": f"No.{m['id']} {m['title']}: design direction (the YAML is not copied)"}}}
    (out / "design-direction.json").write_text(json.dumps(data, ensure_ascii=False, indent=1))
    L = [f"# Design direction draft: No.{m['id']} {m['title']}", "",
         f"From the {LIBRARY} ({m['url']}), for this project only. Generated in `build/` (git-ignored): never commit or",
         f"publish this file or the cached YAML; cite the entry by number, title and link ({TERMS}).", "",
         f"Full text: `{m['yaml']}`" + (f" · sample image: `{m['image']}`" if m.get("image") else ""), "",
         "The material outranks the entry: exact brand colours, fonts, wording and rules from the source win every",
         "conflict, and the entry fills only what the material leaves open. Merge by hand into `style.json`, keep each",
         "rationale true (\"palette after the design direction No.… because the material has no palette of its own\"),",
         "then validate and render the board.", "",
         f"## Palette roles ({roles['theme']} stage)", "", "| role | hex | contrast on bg | from |", "|---|---|---|---|"]
    for k, v in roles["palette"].items():
        L.append(f"| {k} | `{v}` | {roles['contrast'].get(k, '')}{':1' if k in roles['contrast'] else ''} | {roles['from'][k]} |")
    if roles["unused"]:
        L += ["", "Also in the entry (decoration, swatches): " + ", ".join(f"`{u['hex']}` ({u['at']})" for u in roles["unused"])]
    if rd["mood"]:
        L += ["", "## Mood", "", "The entry's mood words: " + ", ".join(rd["mood"]) + ". Map them onto the reel's own mood and pace",
              "(references/tone-and-manner.md section 4); the entry says nothing about motion."]
    if rd["fonts"]:
        L += ["", "## Type", "", "| group | style | weight | role | Korean reel |", "|---|---|---|---|---|"]
        L += [f"| {f['group']} | {f['style']} | {f['weight']} | {f['role']} | {f['korean']} |" for f in rd["fonts"]]
        L += ["", "Use families the reel can embed (`fonts.files`), matched by weight and width, not by name."]
    if rd["motifs"]:
        L += ["", "## Motifs -> engine", "", "| motif | how the engine does it | YAML lines |", "|---|---|---|"]
        L += [f"| {x['motif']} | {x['engine']} | {', '.join(map(str, x['lines']))} |" for x in rd["motifs"]]
    if rd["layouts"]:
        L += ["", "## Layouts -> scenes", ""] + [f"- {x['group']} (line {x['line']}): {x['scene']}" for x in rd["layouts"]]
    if rd["bans"]:
        L += ["", "## Bans -> look and post", ""] + [f"- {x['post']} (line {x['line']})" for x in rd["bans"]]
    L += ["", "## style.json provenance", "", "```json", json.dumps(data["styleJson"], ensure_ascii=False, indent=1), "```", ""]
    (out / "design-direction.md").write_text("\n".join(L))
    print(f"wrote {out / 'design-direction.md'} and .json")
    print(f"{roles['theme']} stage, bg {roles['palette']['bg']}, ink {roles['palette']['ink']} ({roles['contrast']['ink']}:1), "
          f"accent {roles['palette']['accent']}; {len(rd['motifs'])} motifs, {len(rd['layouts'])} layouts, {len(rd['bans'])} bans")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0], formatter_class=argparse.RawDescriptionHelpFormatter,
                                 epilog=__doc__.split("\n\n", 1)[1])
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--offline", action="store_true", help="cache only, no network")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("index", parents=[common], help="the list of entries (cached for 7 days)")
    s.add_argument("--category"); s.add_argument("--series", choices=["slide", "infographic"]); s.add_argument("--grep")
    s.add_argument("--refresh", action="store_true"); s.add_argument("--json", action="store_true")
    s = sub.add_parser("get", parents=[common], help=f"fetch up to {PER_RUN} entries into the cache")
    s.add_argument("ids", nargs="+"); s.add_argument("--refresh", action="store_true")
    s = sub.add_parser("draft", parents=[common], help="derive palette roles and a reading for one project")
    s.add_argument("id"); s.add_argument("--project", required=True)
    sub.add_parser("where", help="print the cache folder")
    a = ap.parse_args(argv)
    if a.cmd == "where":
        print(cache_dir())
    else:
        {"index": cmd_index, "get": cmd_get, "draft": cmd_draft}[a.cmd](a)


if __name__ == "__main__":
    sys.exit(main())
