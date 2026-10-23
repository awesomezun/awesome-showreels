# Example: engraving (한반도 곤충 도감)

A made-up book goes in (한반도 곤충 도감 개정판: a field guide to Korean insects with all 128 plates re-engraved on
copper); a copperplate reel comes out, each plate engraving itself. The title is cut behind a burin glint and a
ladybird is engraved beside it, its dome hatched and a red wash blooming over it; plate 7, a stag beetle, is cut in the
order an engraver works (outlines, mandibles, legs, then hatching that thins where the light falls) and a magnifying
roundel opens on its mandible; at the end the beetle is coloured by hand: 가장 작은 것을, 가장 정확하게. The
30-second cut adds a swallowtail washed in yellow with its blue lunules and red eyespot, and a specimen sheet of four
more insects. One of the 24 styles studied from eight repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/engraving-v1.0.0.html`](dist/engraving-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/engraving/dist/engraving-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 한반도 곤충 도감 is fictional, and its insects are decorative drawings, not scientific plates. Every line is drawn by code; the music plays recorded instruments from two CC0 libraries.

## Folder

```
engraving/
  source/                 5 file(s)
    BRIEF.md
    fonts/Diphylleia-Regular.woff2
    fonts/NanumMyeongjo-Bold.woff2
    fonts/NanumMyeongjo-ExtraBold.woff2
    fonts/OFL.txt
  modules/                2 file(s)
    dong.js
    insects.js
  scenes/                 5 file(s)
    beetle.js
    butterfly.js
    end.js
    hook.js
    plate.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/engraving
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/engraving-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/engraving.html
```

## How the plates were engraved

1. **A burin line.** `modules/dong.js` draws every line as a filled strip whose width swells along it (thin at both
   ends, full in the middle) and scales with the tone it has to carry; it is cut along its length over time with a
   glint at the tip.
2. **Hatching from a lit dome.** Each body part is an ellipsoid: lines run along its meridians or parallels and take
   their width from how far the surface turns from the light, so highlights are just where the lines thin out, and a
   crossing family is added in deep shade. Dark wing bands are dense crossing hatch clipped to the band.
3. **Plates and colour.** `modules/insects.js` builds each insect from those parts in its own coordinates, outlines
   first, then limbs, then hatching; magnifying roundels redraw the plate zoomed inside a clipped circle; watercolour
   washes bloom from a point with a ragged, darker edge and are multiplied over the ink.

## What the tone pass decided

- **palette.** Copperplate printing: plate paper #F3EEE2 with a plate mark and the faint plate tone left by wiping, ink #1C1A17 in lines only (no fills), and hand colouring last in a few watercolour washes: brown #7A4524 and amber for the beetle, yellow #E2B53A, blue #3D6FA8 and red #B5372B for the butterfly and the ladybird.

- **type.** Nanum Myeongjo ExtraBold for the engraved titles and names, revealed behind the burin; Diphylleia, a light serif, for plate numbers and small captions, like the italic legends of old plates.

- **motion.** Engraving order is the motion: outlines, then limbs, then hatching layer by layer, each line cut along its length with a glint at the burin; magnification roundels spring open on a detail; washes bloom from a point with a ragged, darker edge. Slow pushes and a light sliding across the lens keep finished plates alive.

- **sound.** Corporate at 112 BPM in G major on recorded instruments (VCSL and VSCO 2 CE, CC0): a violin section bed, a harpsichord playing broken eighths, cello pizzicato bass, a solo violin hook and glockenspiel in the drop, no kit but a shaker; burin scrapes (engrave) on the lines, ticks for labels, a soft swell for each wash.

- **visuals.** All code: every line is a filled strip whose width swells along it and scales with the tone it carries; domes are hatched along meridians or parallels with the width taken from a lit ellipsoid, so highlights appear where the lines thin, and a crossing family is added in deep shade; dark wing bands are dense crossing hatch clipped to the band; the insects are built from these parts in their own coordinates.

- **narration.** Not recommended: the plates speak for themselves.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `beetle` | 3 | 3 |
| `butterfly` | - | 3 |
| `plate` | - | 2 |
| `end` | 2 | 4 |

## Scenes

**`hook`**: hook (2 bars): plate paper with its plate mark. 한반도 곤충 도감 is engraved left to right behind a burin glint, a swelling rule under it, 개정판 · 도판 128점; on the right a ladybird is engraved, dome hatching and spots, and a red wash blooms over it: the colouring that will come last.

**`beetle`**: beetle (3 bars): plate 7, a stag beetle seen from above, engraved in order: outlines, the suture, mandibles with their inner teeth, legs with spines, antennae, then the hatching that shades each dome (wide where it turns from the light, crossed in deep shade). A magnification roundel opens on the mandible's tooth; 도판 7 · 사슴벌레, 1 cm.

**`butterfly`**: butterfly (30-second cut, 3 bars): plate 23, a swallowtail with its wings spread. Outlines and veins are engraved, the dark bands are filled with crossing hatch, the body is shaded; then the colouring: a yellow wash blooms out from the body over both wings, blue lunules and the red eyespot; a roundel on the eyespot. 도판 23 · 호랑나비.

**`plate`**: plate (30-second cut, 2 bars): the specimen sheet. Four insects are engraved one per two beats (무당벌레, 매미, 잠자리, 메뚜기), each with its name and plate number, under 도판 128점, 모두 새로 새겼습니다.

**`end`**: end (2 bars; 4 in the 30-second cut): the beetle's plate is coloured by hand: a brown wash blooms out from the body over the wing cases, the head and the mandibles; 가장 작은 것을, / 가장 정확하게 is engraved beside it, then 한반도 곤충 도감 · 개정판 and 가상의 도감입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (violins, harpsichord, cello-pizz, real-glock, solo-violin), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
