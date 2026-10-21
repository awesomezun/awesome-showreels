# Example: blueprint (폴드원 E1)

A made-up folding e-bike's spec sheet goes in (폴드원 E1: 20-inch wheels, one hinge, folded in three seconds); a
blueprint reel comes out, in Korean. The sheet starts at an angle and turns flat while the side view draws itself
in white line work; dimensions grow from their middle to their arrowheads, callouts name the parts and the title
block fills in; then the bike folds the way a folding bike does (the front half round the hinge, the stem down,
the seat post down) while a counter runs to 3.0초 and the folded size takes over: 3초면 접혀요. The 30-second cut
adds an exploded view. One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only
the style is borrowed.

- Web version with every cut: [`dist/blueprint-v1.0.0.html`](dist/blueprint-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/blueprint/dist/blueprint-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 폴드원 E1 is fictional, and so are its numbers. The drawing is code.

## Folder

```
blueprint/
  source/                 6 file(s)
    BRIEF.md
    fonts/IBMPlexSansKR-Bold.woff2
    fonts/IBMPlexSansKR-Medium.woff2
    fonts/NanumGothicCoding-Bold.woff2
    fonts/NanumGothicCoding-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    bp.js
  scenes/                 5 file(s)
    draw.js
    end.js
    exploded.js
    fold.js
    hook.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/blueprint
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/blueprint-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/blueprint.html
```

## How the drawing was made

1. **Line work.** `modules/bp.js` keeps the bike as a list of strokes tagged by part (rear, front, stem, seat,
   battery, hinge) and draws them in order by length, so the side view appears the way a pen would draw it.
2. **The fold.** The front half and the stem are projected through the hinge's vertical axis (x' = hinge + (x -
   hinge) cos θ, with a small lift mid-turn), the stem then rotates down about its base and the seat post drops; the
   parts that have swung behind are drawn fainter.
3. **Drawing-office details.** Dimensions have extension lines, arrowheads and a label boxed on the line; callouts
   have a dot, an elbow and two lines of text; numbers are set in a monospaced face.

## What the tone pass decided

- **palette.** A blueprint, as the brief says: deep blue #0F3A78 to #0A2C5E with a minor (24 px) and a major (120 px) grid, white #EAF2FF line work, sky #8FD8FF for every annotation (dimensions, callouts, notes), and one yellow #FFD45E for the hinge and the payoff.

- **type.** IBM Plex Sans KR for names and lines (700 for the name), Nanum Gothic Coding for every number, as a drawing office would set dimensions.

- **motion.** Drawn, not animated: every line draws itself along its length; the sheet starts at an angle and turns flat; dimensions grow from their middle to the arrowheads; callouts dot, elbow and label; then the bike folds as a real one does (the front half round the hinge, the stem down, the seat post down) while a counter runs to 3.0.

- **sound.** Cinematic-lite at 112 BPM in D minor (7 bars in 15 s, 14 in 30 s): strings and a low pulse, sparse; minimal SFX: drawon for the line work, a tick for each dimension, a lock for the hinge.

- **visuals.** All code: the sheet, the grid, the frame and the title block, the bike in two halves of strokes with a hinge, dimensions with arrowheads and extension lines, leader callouts, a counter.

- **narration.** Not recommended: a muted-first product reveal; the numbers are on the drawing.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `draw` | 2 | 3 |
| `exploded` | - | 3 |
| `fold` | 2 | 3 |
| `end` | 1 | 3 |

## Scenes

**`hook`**: hook (2 bars): the name on a sheet seen at an angle. The grid and the drawing frame come up, the wheels start to draw themselves in white; top left, 접이식 전기자전거 · 설계도 and 폴드원 E1 with a ruled underline.

**`draw`**: draw (2-3 bars): the side view. The sheet turns flat; the whole bike finishes drawing itself (frame, battery, crank, seat, the front half, the hinge in yellow); dimensions come on one after another (1,520 overall, 1,050 wheelbase), callouts name 20″ 바퀴 and 16.4 kg; the title block fills in.

**`exploded`**: exploded (3 bars, 30-s cut): the parts. The battery slides out of the down tube, the hub, the hinge and the battery light up in cyan and are named: 허브 모터 250W, 배터리 36V 10Ah · 최대 60km, 알루미늄 경첩.

**`fold`**: fold (2-3 bars): the core message, shown. 3초면 접혀요. sits top left; a counter runs 0.0 to 3.0초 while the front half swings round the hinge, the stem folds down and the seat drops; the overall dimension gives way to the folded size, 접은 크기 78 × 66 × 38 cm.

**`end`**: end (1-3 bars): the name again, the line under it, the launch line and the fiction label, over the folded bike in faint line work; the title block stays.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
