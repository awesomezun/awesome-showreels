# Example: silkscreen-poster (바람섬 다섯 길)

A made-up island goes in (바람섬 다섯 길: five walking courses round a small windy island, with a poster for each);
a silkscreen reel comes out, posters printed one ink at a time on a studio wall. A blank sheet takes five pulls of
the squeegee, one per beat (yellow sky, orange sun, the sea, the green island, then the dark ink with 바람섬 and its
band), while the run sheet ticks off each ink; the courses follow, each poster printed beside its number, name,
distance and time; at the end the five posters drop onto their pegs: 다섯 길, 한 장씩 찍어 갑니다. The 15-second cut
shows two courses, the 30-second cut all five. One of the 24 styles studied from eight repositories of code-rendered
video; only the style is borrowed.

- Web version with every cut: [`dist/silkscreen-poster-v1.0.0.html`](dist/silkscreen-poster-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/silkscreen-poster/dist/silkscreen-poster-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 바람섬 and its five courses are fictional. Every poster is drawn by code; the harmonica is a recorded instrument from a CC0 library.

## Folder

```
silkscreen-poster/
  source/                 5 file(s)
    BRIEF.md
    fonts/GasoekOne-Regular.woff2
    fonts/GothicA1-Bold.woff2
    fonts/GothicA1-Medium.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    silk.js
  scenes/                 7 file(s)
    coast.js
    end.js
    forest.js
    hook.js
    oreum.js
    sunset.js
    wall.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/silkscreen-poster
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/silkscreen-poster-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/silkscreen-poster.html
```

## How the posters were printed

1. **One ink per layer.** `modules/silk.js` describes each poster as a list of layers in print order, light to
   dark, each a set of flat shapes in one of five opaque inks on cream paper (sky bands, sun discs, the sea, hills,
   cedars, stone walls, a lighthouse, a crater), with the title and the info band in the darkest ink.
2. **The pull.** A layer is drawn behind a clip with a ragged edge that moves across the sheet with an eased
   squeegee: a rubber blade and its ink bead in the layer's colour. Each ink lands a few pixels out of register and
   springs in when the pull ends; paper grain is multiplied over the sheet.
3. **Folk on the beat.** A new `folk` preset in `audio/arrange.py` (strummed guitar, fingerpicked ukulele, a two-feel
   bass, kick, brushes and shaker) with a recorded harmonica hook; every pull is a `squeegee` cue on the beat it starts.

## What the tone pass decided

- **palette.** Five opaque inks on cream paper #F3EAD7, the limit of a silkscreen run: yellow #F2B84B, orange #E8743B, sea blue #2F7F93, grass green #7FA36B and a deep teal #1E3E48 for the key line and type; posters hang on a dark studio wall #2B3A3F so the inks glow.

- **type.** Gasoek One, a heavy poster face, for titles and the course names; Gothic A1 for numbers and the run sheet.

- **motion.** Printing is the motion: each ink arrives behind a squeegee blade that crosses the sheet with its ink bead, landing a few pixels out of register and snapping in on the hit; one ink every beat in the hook, every three quarters of a beat for the courses; finished posters sway on the wall and drop onto their pegs at the end.

- **sound.** A new folk preset at 112 BPM in G major: strummed guitar, fingerpicked ukulele in broken eighths, a two-feel upright bass, kick, brushes and shaker, and a recorded harmonica hook (VCSL, CC0); every pull is a squeegee drag with a squeak.

- **visuals.** All code: each poster is a list of layers, one ink each, drawn as flat shapes (bands of sky, sun discs, the sea, hills, cedars, stone walls, a lighthouse, a crater) and printed behind a ragged moving clip; paper grain is multiplied over the sheet; the run sheet shows a swatch per ink.

- **narration.** Not recommended: the posters say it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `coast` | 2 | 2 |
| `oreum` | 1 | 2 |
| `wall` | - | 2 |
| `forest` | - | 2 |
| `sunset` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the studio wall and a blank sheet. Five inks are pulled one by one, every beat: a yellow sky, the orange sun, the sea, the green island, then the darkest ink with 바람섬, the trail and the band 다섯 길; each lands a little out of register and snaps in. Beside it the run sheet ticks off 1도 하늘 … 5도 먹, then 한 장에 다섯 번.

**`coast`**: coast (2 bars): 1길 해안길: the coastal course: the sea, a green headland, a lighthouse with orange bands, waves. The poster is pulled ink by ink on the left; the course number, name, distance and time and a short line (바다를 끼고 등대까지) come in beside it.

**`oreum`**: oreum (1 bar; 2 in the 30-second cut): 2길 오름길: a dark crater cone under a big yellow sun, a dotted path zig-zagging up it. The poster is pulled ink by ink on the right; the course number, name, distance and time and a short line (분화구 둘레를 한 바퀴) come in beside it.

**`wall`**: wall (30-second cut, 2 bars): 3길 돌담길: tangerine trees in rows behind black stone walls. The poster is pulled ink by ink on the left; the course number, name, distance and time and a short line (귤밭 사이 검은 돌담) come in beside it.

**`forest`**: forest (30-second cut, 2 bars): 4길 숲길: stacked cedar trees, shafts of light, a green floor. The poster is pulled ink by ink on the right; the course number, name, distance and time and a short line (삼나무 그늘 아래로) come in beside it.

**`sunset`**: sunset (30-second cut, 2 bars): 5길 노을길: a huge orange sun half down in the sea, its reflection in stripes, a walker on the headland. The poster is pulled ink by ink on the left; the course number, name, distance and time and a short line (해 지는 곶에서 끝) come in beside it.

**`end`**: end (2 bars): the five course posters hang in a row on the wall, dropping in one per beat on their pegs, swaying; 다섯 길, 한 장씩 찍어 갑니다 above them, 바람섬 다섯 길 · 섬 한 바퀴 48.4 km and 가상의 섬과 트레일입니다 below.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (harmonica), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
