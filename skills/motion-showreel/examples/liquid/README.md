# Example: liquid (톡톡 스파클링)

A made-up drink goes in (톡톡 스파클링: a fruit-flavoured sparkling water in grapefruit, lime and grape); a liquid
reel comes out in glossy candy colours. Pink drops fall one per beat into a rising pool, each throwing up a crown of
droplets, and the pool swells up into the word 톡톡; three wobbling blobs pop in with their satellites (자몽, 라임,
청포도), bubbles rising inside, then drift together and mix where they meet; at the end the colours gather into the
name again: 한 방울이 모이면, 톡! The 30-second cut adds a glass filling from a pouring stream (설탕 0g) and three
drops landing on a pink surface, each with its 톡!. One of the 24 styles studied from eight repositories of
code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/liquid-v1.0.0.html`](dist/liquid-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/liquid/dist/liquid-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 톡톡 스파클링 is fictional. The liquid is rendered by a WebGL2 shader written for this example; the kalimba and glockenspiel are recordings from a CC0 library.

## Folder

```
liquid/
  source/                 4 file(s)
    BRIEF.md
    fonts/BagelFatOne-Regular.woff2
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    tok.js
  scenes/                 5 file(s)
    end.js
    flavors.js
    hook.js
    pour.js
    splash.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/liquid
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/liquid-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/liquid.html
```

## How the liquid was rendered

1. **Metaballs with colours.** `modules/tok.js` renders a full-screen WebGL2 fragment shader that sums the field of up
   to 40 balls (r² over distance²), each with its own colour mixed by its share of the field, so blobs merge and their
   colours blend where they touch; the brand name joins the field as a blurred text texture.
2. **Gloss from the gradient.** The normal comes from the analytic gradient of the field, steep at the rim and flat
   inside, and the surface is lit with a soft diffuse, a sharp white specular, a darker saturated rim and a brighter
   core; a soft shadow is the same field offset down and right. It renders at half size and is scaled up.
3. **Behaviour in plain functions.** Drops fall accelerating with two trailing balls, crowns throw droplets on arcs,
   satellites orbit the flavour blobs, and 2D bubbles rise only where a CPU copy of the field says there is liquid.

## What the tone pass decided

- **palette.** Candy liquid on cream #FFF4E8 with faint pink dots: candy pink #FF7A93 for the brand, grapefruit #FF5C7A, lime #6ED04E and grape #9B5DE5 for the flavours, a plum ink #3B2440 for type; highlights are pure white.

- **type.** Bagel Fat One, a round heavy display face that reads as liquid when it becomes the liquid itself; Jua for the small lines.

- **motion.** Liquid behaviour: drops fall accelerating and stretch, land in a pool with a crown of droplets, blobs wobble with orbiting satellites that merge and split, the three flavours drift together and their colours mix, the name swells out of the pool; words pop with an overshoot.

- **sound.** Bright pop at 128 BPM in D major with a recorded kalimba (VCSL, CC0) for the plucked arpeggios; each landing is a plink, each 톡! a pop, wine-glass taps for the flavours, a swell as the name forms.

- **visuals.** All code: a WebGL2 fragment shader sums up to 40 metaballs (r² / d², each with its colour, mixed by contribution) plus a blurred text field, takes the normal from the analytic gradient and lights it with a soft diffuse, a sharp specular, a darker rim, a brighter core and a soft offset shadow; bubbles are drawn in 2D only where the CPU copy of the field says it is liquid.

- **narration.** Not recommended: the fizz is enough.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `flavors` | 3 | 4 |
| `pour` | - | 3 |
| `splash` | - | 3 |
| `end` | 3 | 4 |

## Scenes

**`hook`**: hook (2 bars): candy-pink drops fall one per beat into a pool rising from the bottom, each throwing up a crown of droplets; on the fifth beat the liquid swells up into the word 톡톡, glossy and gooey; 스파클링 and 탄산수 · 세 가지 맛.

**`flavors`**: flavors (3 bars; 4 in the 30-second cut): three wobbling blobs pop in one per beat (grapefruit pink, lime green, grape purple), each a big drop with satellites orbiting, merging and splitting off, bubbles rising inside, its name under it: 자몽, 라임, 청포도; then they drift together and merge, their colours mixing where they meet.

**`pour`**: pour (30-second cut, 3 bars): a stream pours from the top into a tall glass; the liquid rises in it with bubbles streaming up; 설탕 0g and 톡 쏘는 탄산 beside it.

**`splash`**: splash (30-second cut, 3 bars): drops of the three flavours land one per two beats on a pink surface, each throwing a crown of droplets; 톡! pops above every landing.

**`end`**: end (3 bars; 4 in the 30-second cut): the three colours swirl up and gather into the glossy name 톡톡 with a few drops still orbiting it; 한 방울이 모이면, 톡! and 톡톡 스파클링 · 가상의 탄산수입니다 below.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (kalimba, real-glock); some cues are recordings too (wine-glass), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
