# Example: woodcut (솔뫼 양조장)

A made-up brewery goes in (솔뫼 양조장: a makgeolli brewery under a pine mountain since 1926, turning a hundred);
a woodcut reel comes out, a relief print that carves itself. A black block fills the frame and a V-gouge cuts the
light out of it: a sun in rings with the vermilion plate showing through, a sky of lines that widen toward the sun,
two ranges of mountains, and 솔뫼 양조장 carved out of the dark; three small prints follow on the beat (rice washed,
nuruk pressed, a jar waiting a hundred days); the sheet is pulled off the block and the finished print appears with
its red seal: 깎아 새긴 손맛, 백 년. The 30-second cut adds a jar opened to its bubbling brew and the village at
dusk. One of the 24 styles studied from eight repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/woodcut-v1.0.0.html`](dist/woodcut-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/woodcut/dist/woodcut-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 솔뫼 양조장 is fictional. Every cut, plate and letter is drawn by code; the music plays recorded instruments from two CC0 libraries.

## Folder

```
woodcut/
  source/                 4 file(s)
    BRIEF.md
    fonts/BlackAndWhitePicture-Regular.woff2
    fonts/OFL.txt
    fonts/SongMyung-Regular.woff2
  modules/                1 file(s)
    pan.js
  scenes/                 5 file(s)
    craft.js
    end.js
    hook.js
    jar.js
    village.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/woodcut
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/woodcut-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/woodcut.html
```

## How the block was cut

1. **Ink you can cut.** `modules/pan.js` draws the key block into its own buffer and takes every cut out of it
   (`destination-out`), so the paper shows through each one; a cut is a tapered, ragged sliver along a path, cut along
   its length over time with a chip curling off the tip and the gouge riding the newest one. The ink then loses its
   wood grain and specks where it did not take.
2. **Tone is width.** Sky lines widen toward the sun and break around it, the sun is cut in rings, contour cuts
   under each ridge thin as they go down, a jar's lit side is a column of short wide cuts: light is where the most
   wood is taken away.
3. **Two plates and the pull.** The vermilion plate prints under the key block (multiply) and springs into register
   when pressed; the end builds the finished print once, mirrors its ink into a wet block, and peels the sheet off
   it with a lit curl before the seal is stamped.

## What the tone pass decided

- **palette.** A relief print and nothing else: rice paper #EFE6D2 with fibres, one key block of ink #191512 that carries wood grain and specks where it did not take, and one vermilion plate #B4432A printed under it (the sun, the sign, the seal), slightly out of register.

- **type.** Black And White Picture for the display lines, rough like letters cut in wood; Song Myung for the small carved and printed labels.

- **motion.** Carving is the motion: every white line is cut along its length by a V-gouge with a chip curling off the tip, the light appearing where wood is taken away; the colour plate settles into register when it is pressed; the end is the pull, the sheet peeling off the block with a curl. Slow pushes keep finished prints alive.

- **sound.** Corporate at 96 BPM in D major on recorded instruments (VCSL and VSCO 2 CE, CC0): a cello section bed, harp in broken eighths, pizzicato double bass, a French horn hook, tubular bells in the drop; the cuts scrape (carve), woodblock and timpani mark the panels and the title, the pull crackles (peel) and the seal is stamped.

- **visuals.** All code: the ink is a buffer the gouges are taken out of (destination-out), so paper shows through every cut; sky lines widen toward the sun and break around it, sun rings, contour cuts under the ridges that thin as they go down, pine silhouettes, an onggi jar with ring bands and a lit side of short cuts, a hanok roof with scalloped tile rows, smoke, carved and printed type.

- **narration.** Not recommended: the cuts carry it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `craft` | 2 | 3 |
| `jar` | - | 2 |
| `village` | - | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): a black block fills the frame. A V-gouge cuts the sun out in rings (the vermilion plate under it shows through the cuts), the sky in lines that are widest near the sun, two ranges of mountains and pines; then 1926년부터, 소나무 산 아래 and 솔뫼 양조장 are carved out of the dark near range.

**`craft`**: craft (2 bars; 3 in the 30-second cut): three prints in a row, carved one by one on the beat: rice washed in a bowl (ripples spreading, grains), the nuruk cake pressed in straw (it turns), and the jar waiting under a sun that crosses the sky, the days counting to 100. Under them 쌀을 씻고 / 누룩을 빚고 / 백 일을 기다려요.

**`jar`**: jar (30-second cut, 2 bars): close on one jar, its right half cut away: inside, the brew with bubbles rising and bursting at the surface; 항아리 속에서, 천천히 printed in the margin and 백 일 carved below.

**`village`**: village (30-second cut, 2 bars): the print of the village at dusk is cut: the red sun low behind the ranges, the sky, pines, the brewery's tiled roof and its chimney smoke drifting; 백 년째, 같은 자리 in the paper margin above.

**`end`**: end (2 bars; 3 in the 30-second cut): the pull. The sheet peels off the inked block left to right with a curl and the finished print appears: the village at dusk, 깎아 새긴 손맛, 백 년 above it, 솔뫼 양조장 · 1926–2026 in red; then the red seal 백년 is stamped; 가상의 양조장입니다 small at the foot.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (cellos, concert-harp, bass-pizz, tubular-bells, french-horn); some cues are recordings too (timpani, woodblock), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
