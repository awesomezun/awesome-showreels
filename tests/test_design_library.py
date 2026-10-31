"""tools/design_library.py: page parsing, the flat-YAML outline, palette roles, the fetch caps and the draft.

No network: the pages below are synthetic (written for this test in the library's shape, not copied from it).
Run from the repo root:  python3 -m unittest tests.test_design_library -v
"""
from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import os
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skills" / "motion-showreel"
spec = importlib.util.spec_from_file_location("design_library", SKILL / "tools" / "design_library.py")
dl = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dl)

YAML = """Design Style:
Name: "Test Harbour"
Concept: >
A calm harbour look made up for this test,
with lemon buoys and diagonal corner cuts.

Canvas:
Ratio: "16:9"
Background: "#F7F7F2"
Margin: "Wide"

Mood:
- Calm
- Clear

Color Palette:
Primary:
Lemon: "#FFF200"
Harbour: "#0FA3B1"
DeepHarbour: "#0B5D66"
Secondary:
Fog: "#EDEFEA"

Typography:
Heading:
Style: "Bold Japanese Sans Serif"
Weight: "800"
Color: "#1B1E1F"
Body:
Style: "Japanese Sans Serif"
Weight: "400"
Color: "#3A3F41"

Layout System:
Cover:
- "a big lemon field with the title bottom left"
Data:
- "one bar chart per page"

Overall Rules:
- "gradients and drop shadows are not allowed"
- "keep wide margins"
"""


def rsc(*chunks: str) -> str:
    """A page in the Next.js shape: data in self.__next_f.push([1, "..."]) string chunks."""
    return "<html><body>" + "".join(f"<script>self.__next_f.push([1,{json.dumps(c)}])</script>" for c in chunks) + "</body></html>"


def entry_page(text: str, eid: str = "901") -> str:
    n = len(text.encode("utf-8"))
    return rsc(f'0:{{"x":1}}\n:HL["/full/{eid}.webp","image"]\n', f"12:T{n:x},{text}", '13:["$","div",null,{}]\n')


class Parsing(unittest.TestCase):
    def test_index_from_the_listing_payload(self):
        rows = [{"id": "901", "series": "slide", "title": "Test Harbour", "category": "テスト", "ratio": "16:9", "chars": 900, "categoryLabel": "Business"},
                {"id": "Z91", "series": "infographic", "title": "Test Poster", "category": "図解", "ratio": "2:3 Portrait", "chars": 1200, "categoryLabel": "Illustrated diagrams"}]
        page = rsc('5:["$","main",null,{"items":' + json.dumps(rows, ensure_ascii=False) + "}]\n")
        idx = dl.parse_index(page)
        self.assertEqual([r["id"] for r in idx], ["901", "Z91"])
        self.assertEqual(idx[0]["category"], "Business")
        self.assertEqual(idx[1]["series"], "infographic")

    def test_entry_text_is_cut_by_its_byte_length(self):
        text = YAML.replace("calm", "静かな")          # multi-byte characters: the length prefix counts bytes
        self.assertEqual(dl.parse_entry(entry_page(text)), text.strip() + "\n")

    def test_ids_are_normalised_and_ranges_refused(self):
        self.assertEqual(dl.norm_id("7"), "007")
        self.assertEqual(dl.norm_id("z5"), "Z05")
        self.assertEqual(dl.norm_id("No.236"), "236")
        with self.assertRaises(SystemExit):
            dl.norm_id("1-20")
        with self.assertRaises(SystemExit):
            dl.norm_id("all")


class Reading(unittest.TestCase):
    def setUp(self):
        self.items = dl.outline(YAML)

    def test_outline_puts_colours_under_their_groups(self):
        at = {c["hex"]: dl.where(c) for c in dl.colours(self.items)}
        self.assertEqual(at["#F7F7F2"], "Canvas › Background")
        self.assertEqual(at["#0FA3B1"], "Color Palette › Primary › Harbour")
        self.assertEqual(at["#EDEFEA"], "Color Palette › Secondary › Fog")
        self.assertEqual(at["#3A3F41"], "Typography › Body › Color")

    def test_roles_meet_their_contrast_targets(self):
        r = dl.draft_roles(self.items)
        p, bg = r["palette"], r["palette"]["bg"]
        self.assertEqual(r["theme"], "light")
        self.assertEqual(bg, "#F7F7F2")
        self.assertGreaterEqual(dl.contrast(p["ink"], bg), 7)
        for k in ("ink2", "muted", "accentInk"):
            self.assertGreaterEqual(dl.contrast(p[k], bg), 4.5, k)
        for k in ("ok", "warn", "deny"):
            self.assertGreaterEqual(dl.contrast(p[k], bg), 3, k)

    def test_a_bright_accent_is_not_mistaken_for_a_surface(self):
        r = dl.draft_roles(self.items)
        self.assertEqual(r["palette"]["surface"], "#EDEFEA")          # the near-white neutral
        self.assertIn(r["palette"]["accent"], ("#FFF200", "#0FA3B1"))  # lemon is a fill, not a card colour
        self.assertNotEqual(r["palette"]["surface"], "#FFF200")

    def test_text_in_the_accent_hue_uses_the_entry_s_deeper_shade(self):
        items = dl.outline(YAML.replace('Lemon: "#FFF200"\n', ""))
        r = dl.draft_roles(items)
        self.assertEqual(r["palette"]["accent"], "#0FA3B1")
        self.assertEqual(r["palette"]["accentInk"], "#0B5D66")

    def test_bans_reach_post_and_are_not_motifs(self):
        rd = dl.reading(self.items)
        bans = " ".join(b["post"] for b in rd["bans"])
        self.assertIn("no drop shadows", bans)
        self.assertIn("flat fills", bans)
        self.assertNotIn("gradients", [m["motif"] for m in rd["motifs"]])
        self.assertIn("diagonal cuts", [m["motif"] for m in rd["motifs"]])
        self.assertEqual([x["group"] for x in rd["layouts"]], ["Cover", "Data"])
        self.assertEqual(rd["mood"], ["Calm", "Clear"])
        self.assertTrue(rd["fonts"][0]["korean"])


class CacheAndCaps(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.env = os.environ.get("SHOWREEL_CACHE")
        os.environ["SHOWREEL_CACHE"] = self.tmp.name
        self.d = dl.cache_dir()

    def tearDown(self):
        if self.env is None:
            os.environ.pop("SHOWREEL_CACHE", None)
        else:
            os.environ["SHOWREEL_CACHE"] = self.env
        self.tmp.cleanup()

    def seed(self, eid="901"):
        (self.d / "entries" / f"{eid}.yaml.txt").write_text(YAML)
        (self.d / "entries" / f"{eid}.json").write_text(json.dumps({"id": eid, "title": "Test Harbour", "category": "Business",
                                                                    "url": dl.entry_url(eid), "yaml": str(self.d / "entries" / f"{eid}.yaml.txt"),
                                                                    "image": None, "chars": len(YAML)}))

    def test_cache_lives_outside_the_repo_with_a_notice(self):
        self.assertFalse(str(self.d.resolve()).startswith(str(ROOT)))
        self.assertIn("do not redistribute", (self.d / "NOTICE.txt").read_text())

    def test_more_than_three_entries_per_run_are_refused(self):
        with self.assertRaises(SystemExit):
            dl.get_entries(["001", "002", "003", "004"], offline=True)

    def test_the_daily_cap_stops_before_any_request(self):
        now = time.time()
        (self.d / "fetch-log.jsonl").write_text("".join(json.dumps({"t": now - i, "id": f"{i:03d}"}) + "\n" for i in range(dl.PER_DAY)))
        with self.assertRaises(SystemExit) as cm:
            dl.get_entries(["902"])
        self.assertIn("24 hours", str(cm.exception))

    def test_cached_entries_need_no_network(self):
        self.seed()
        self.assertEqual(dl.get_entries(["901"], offline=True)[0]["title"], "Test Harbour")

    def test_draft_writes_only_into_build_and_validates_as_provenance(self):
        self.seed()
        with tempfile.TemporaryDirectory() as P:
            with contextlib.redirect_stdout(io.StringIO()):
                dl.main(["draft", "901", "--project", P, "--offline"])
            files = sorted(p.name for p in Path(P).rglob("*") if p.is_file())
            self.assertEqual(files, ["design-direction.json", "design-direction.md"])
            data = json.loads((Path(P) / "build" / "design-direction.json").read_text())
            self.assertIn("never commit", (Path(P) / "build" / "design-direction.md").read_text())
            # the provenance the draft suggests is valid style.json
            st = json.loads((SKILL / "examples" / "solid-3d" / "style.json").read_text())
            st["meta"]["direction"] = {**data["styleJson"]["meta.direction"], "why": "test", "approved": True}
            st["source"].append(data["styleJson"]["source[]"])
            sp = Path(P) / "style.json"
            sp.write_text(json.dumps(st, ensure_ascii=False))
            r = subprocess.run([sys.executable, "-B", str(SKILL / "tools" / "extract_style.py"), "--validate", str(sp)], capture_output=True, text=True)
            self.assertEqual(r.returncode, 0, r.stdout + r.stderr)


class Policy(unittest.TestCase):
    def test_no_cached_library_file_is_committed(self):
        files = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True).stdout.splitlines()
        self.assertFalse([f for f in files if f.endswith(".yaml.txt") or "design-direction." in f or "design-library/shiraki" in f])


if __name__ == "__main__":
    unittest.main()
