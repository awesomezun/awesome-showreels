# Example: one-line (이음 만년필)

A made-up pen goes in (이음 만년필: a fountain pen sold on a line that never breaks); a one-line reel comes out, a
single gold line on deep navy paper drawn by a pen the camera rides behind. It draws a nib with its slit and breather
hole, curls out through the top into cursive loops (이음 만년필), then sweeps over the top into a heart while the
camera pulls far back: the nib, the loops, a cup, an open notebook and a potted plant are one picture, drawn without
lifting the pen: 한 번도 떼지 않은 선. The 30-second cut follows the whole way: steam falling into the cup, the
notebook written in, the plant climbed leaf by leaf. One of the 24 styles studied from eight repositories of
code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/one-line-v1.0.0.html`](dist/one-line-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/one-line/dist/one-line-v1.0.0.html))
- Cuts: `short` (5 bars = 15.0 s), `30` (10 bars = 30.0 s), all at 80 BPM.

> 이음 만년필 is fictional. The line is drawn by code; the piano and cello are recordings from two CC0 libraries.

## Folder

```
one-line/
  source/                 5 file(s)
    BRIEF.md
    fonts/GowunBatang-Bold.woff2
    fonts/GowunBatang-Regular.woff2
    fonts/NanumMyeongjo-ExtraBold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    line.js
  scenes/                 4 file(s)
    end.js
    hook.js
    journey.js
    reveal.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/one-line
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/one-line-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/one-line.html
```

## How the line was drawn

1. **One path.** `modules/line.js` builds the whole drawing as a single polyline in world coordinates from
   parametric parts (a nib, a trochoid of loops, steam and a cup with its saucer, an open notebook with zigzag
   writing, a plant, a sweep and a heart), joined by cubic connectors that leave along the current direction, so the
   pen never lifts; some stretches are retraced, as a one-line drawing does.
2. **Time that slows at corners.** Each step costs its length plus a charge for how sharply it turns; the line is
   drawn to a cost that eases over each scene, so the pen hurries along straights and slows round the loops.
3. **A camera behind the nib.** The camera centre is the mean of points on the line a little behind the tip, so it
   follows without jitter while the line leads; the reveal blends it (zoom in log space) to a view of the whole
   picture, and at the end a brighter glint runs along the finished line.

## What the tone pass decided

- **palette.** Two colours only: deep navy paper #13203A darkening to #0D1729 at the edges, and one gold line #E3B657 with a soft glow; a pale gold #F6DA94 for the glint that runs along it at the end, cream #F2E8D2 for type.

- **type.** Nanum Myeongjo ExtraBold for the name and the line, a calligraphic serif that suits ink; Gowun Batang for the small labels.

- **motion.** One line drawn over the whole reel: the pen slows at every turn (corners cost more time than straights), the camera rides a little behind the nib so the line leads the eye, and the reveal pulls far back to show that everything was one picture; a glint then runs along the finished line.

- **sound.** Ambient at 80 BPM in E major on recorded instruments (VCSL and VSCO 2 CE, CC0): a soft pad, a softly played upright piano for the motion, a cello hook, a sine sub, a soft kick and shaker; a pen-on-paper whisper (pen) under every stretch of drawing, a chime as the heart closes.

- **visuals.** All code: the drawing is one polyline in world coordinates built from parametric parts (a nib, a trochoid of loops, a cup, an open notebook with zigzag writing, a plant, a sweep and a heart) joined by cubic connectors that keep the direction; it is drawn to a cost along its length, through a camera given by the mean of points behind the tip.

- **narration.** Not recommended: the line speaks.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `journey` | - | 3 |
| `reveal` | 1 | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): close on deep navy paper, a fountain pen draws one gold line: a nib with its slit and breather hole, a small curl, then out through the top into cursive loops; the camera rides just behind the pen. 이음 만년필.

**`journey`**: journey (30-second cut, 3 bars): the line never lifts: it falls as steam into a cup and draws the cup, its handle and saucer, runs along the table into an open notebook and writes a few lines, then climbs a potted plant leaf by leaf; the label follows it: 아침의 찻잔, 오후의 노트, 창가의 화분.

**`reveal`**: reveal (1 bar; 2 in the 30-second cut): the line sweeps over the top and ends in a heart while the camera pulls far back: everything it drew (the nib, the loops, the cup, the notebook, the plant) is one picture. 한 번도 떼지 않은 선.

**`end`**: end (2 bars; 3 in the 30-second cut): the whole drawing held, a brighter glint running along the line from the nib to the heart; 한 번도 떼지 않은 선, then 이음 만년필 · 가상의 브랜드입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (upright-piano, solo-cello), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
