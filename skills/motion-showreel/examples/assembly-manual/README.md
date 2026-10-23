# Example: assembly-manual (반듯 선반)

A made-up shelf goes in (반듯 선반: a three-tier shelf one person puts together in ten minutes with one
screwdriver); a wordless assembly-manual reel comes out in black line on white. On the cover the shelf assembles
itself part by part while a faceless helper waves (반듯 선반); the parts list pops up tile by tile (A ×2, B ×3, C ×12,
a screwdriver); steps one to three run at speed: side panels slide in, shelves slide in along dotted arrows, the
screws turn in under the screwdriver; the finished shelf fills with books and a plant: 공구 하나, 4단계, 10분. The
30-second cut gives each step its own page with an OK or wrong-way panel. One of the 24 styles studied from eight
repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/assembly-manual-v1.0.0.html`](dist/assembly-manual-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/assembly-manual/dist/assembly-manual-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 반듯 선반 is fictional. Every line is drawn by code; the xylophone and woodblock are recordings from a CC0 library.

## Folder

```
assembly-manual/
  source/                 5 file(s)
    BRIEF.md
    fonts/GothicA1-Black.woff2
    fonts/GothicA1-Bold.woff2
    fonts/GothicA1-Medium.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    manual.js
  scenes/                 8 file(s)
    build.js
    end.js
    hook.js
    parts.js
    stand.js
    step1.js
    step2.js
    step3.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/assembly-manual
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/assembly-manual-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/assembly-manual.html
```

## How the manual was drawn

1. **Isometric boxes.** `modules/manual.js` projects every part with a 30-degree isometric transform and draws its
   three visible faces (white, light grey, grey) with even black edges in painter's order, so the hidden edges are
   simply covered; the shelf is two side panels and three shelves, each with its own offset.
2. **Manual grammar.** Parts drop from above or slide along dotted arrows into exact places; step discs pop with the
   step's name; the screwdriver hops from screw to screw while each turns in; OK and crossed-out panels show the right
   and wrong way.
3. **A helper.** A faceless line figure bobs on the beat, raises its arms to work and steps back with a heart at the
   end, next to a clock that ticks to 10:00.

## What the tone pass decided

- **palette.** An instruction sheet: white paper, black line #1A1A1A at an even weight, two pale greys for the shaded faces of each box; nothing else, so the steps read at a glance.

- **type.** Gothic A1 in heavy weights for step names, part letters and counts, and the line; the pictures carry most of it.

- **motion.** Manual logic: parts drop in or slide along dotted arrows into exact places, step discs pop, screws turn in one after another under the screwdriver, OK and wrong-way panels appear, the faceless helper bobs, works and steps back with a heart.

- **sound.** Corporate at 112 BPM in C major with a recorded xylophone (VCSL, CC0) for the motion, a light kit; a woodblock for every part that lands, clicks for the screws, a ding for each step and a confirm at the end.

- **visuals.** All code: every part is a box in isometric projection drawn face by face (top, front, side in white and two greys) with black edges in painter's order, so hidden edges are covered; the shelf is assembled from offsets per part.

- **narration.** Not recommended: an assembly manual has no words to say.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `parts` | 1 | 2 |
| `build` | 2 | - |
| `step1` | - | 2 |
| `step2` | - | 2 |
| `step3` | - | 2 |
| `stand` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the cover of the manual. The shelf assembles itself in line art, one part dropping in per beat (the left side, three shelves, the right side) while the little faceless person waves beside it; 조립 설명서 and 반듯 선반, then 3단 선반 · 혼자서 10분.

**`parts`**: parts (1 bar; 2 in the 30-second cut): the parts list, one tile per half beat: side panel A ×2, shelf B ×3, screw C ×12, screwdriver ×1, each in its own frame with its letter and count.

**`build`**: build (15-second cut, 2 bars): steps one to three at speed: ① the side panels slide in and stand, ② three shelves slide in from the front along dotted arrows, ③ the screws turn in one after another under the screwdriver.

**`step1`**: step1 (30-second cut, 2 bars): ① 옆판 세우기: the two side panels slide in along dotted arrows and stand upright; a small OK panel shows the right way up.

**`step2`**: step2 (30-second cut, 2 bars): ② 선반 끼우기: three shelves slide in from the front one per beat along dotted arrows; a small wrong-way panel shows a shelf upside down, crossed out.

**`step3`**: step3 (30-second cut, 2 bars): ③ 나사 조이기: the screwdriver moves from screw to screw and each turns in, two per beat; C ×12.

**`stand`**: stand (30-second cut, 2 bars): ④ 세워서 완성: books, a plant and a cup appear on the shelves; the person steps back with a heart over its head.

**`end`**: end (2 bars): the finished shelf with its things, the person beside it with a heart; 공구 하나, 4단계, 10분 and a small clock ticking to 10:00; 반듯 선반 · 가상의 가구입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (xylophone); some cues are recordings too (woodblock), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
