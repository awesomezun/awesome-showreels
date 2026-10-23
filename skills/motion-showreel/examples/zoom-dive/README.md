# Example: zoom-dive (끝없는 확대)

A made-up exhibition goes in (끝없는 확대: a science museum's show that dives from one ginkgo leaf to one
magnesium atom); a powers-of-ten reel comes out. The camera starts a metre above the exhibit table and falls into the
centre of the screen ten times closer at a steady rate: the leaf, its veins, the skin cells, a stoma, chloroplasts,
thylakoid stacks, a membrane with its proteins, a light-harvesting trimer, a chlorophyll molecule and the electron
cloud of its magnesium atom. Each next world first shows as a small framed picture labelled with its size; a readout
counts 10^0 m down to 10^-10 m. Inside the atom: 한 번 더 들여다보면, 또 하나의 세계; then the camera rushes back out
to the table. The 15-second cut takes the middle eight steps in eight beats. One of the 24 styles studied from eight
repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/zoom-dive-v1.0.0.html`](dist/zoom-dive-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/zoom-dive/dist/zoom-dive-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 끝없는 확대 is fictional. Every layer is drawn by code; the glockenspiel and tubular bell are recordings from a CC0 library.

## Folder

```
zoom-dive/
  source/                 5 file(s)
    BRIEF.md
    fonts/Hahmlet.woff2
    fonts/IBMPlexSansKR-Bold.woff2
    fonts/IBMPlexSansKR-Medium.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    dive.js
  scenes/                 7 file(s)
    atom.js
    cell.js
    dive.js
    end.js
    hook.js
    leaf.js
    molecule.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/zoom-dive
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/zoom-dive-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/zoom-dive.html
```

## How the zoom is built

1. **One number for the camera.** `modules/dive.js` keeps eleven layers, each drawn in its own units where the
   screen is 10^-k m tall and the centre is the next target. For zoom z the layer floor(z) is drawn at scale 10^(z-k)
   and the next one at a tenth of that, clipped to its own frame, so z + 1 is exactly ten times closer and the dive is
   one straight line in log scale.
2. **Nested worlds.** The 10 cm leaf and the 1 cm veins are the same drawing (a fan of forking veins solved as a
   binary tree) at two scales; below that each layer puts its next subject at the centre: a stoma, a chloroplast, a
   granum, a light-harvesting complex, a chlorophyll, its magnesium.
3. **The readout.** A HUD shows 10^-k m, the plain size and the name, and a log track of all eleven steps; the
   glockenspiel climbs the lydian scale one note per step, and the electron cloud is a stipple redrawn twelve times a
   second.

## What the tone pass decided

- **palette.** Each step brings its own world: walnut and leaf green, the pale greens of cells and chloroplasts, the pink and gold of lipid membranes, navy for the molecule and black for the atom with a blue and violet electron cloud; type and HUD in white over a dark band.

- **type.** Hahmlet, a modern serif with sharp contrast, for names and lines; IBM Plex Sans KR for the readout and the scale.

- **motion.** One continuous logarithmic zoom into the centre of the screen: ten times closer every four beats in the 30-second cut and every beat in the 15-second dive; the next world first shows as a small framed picture labelled with its size and grows until it covers the screen; at the end the camera rushes back out through all ten steps in a beat and a half.

- **sound.** Ambient at 96 BPM in D lydian: a soft pad, sub and shaker, and a recorded glockenspiel (VSCO 2 CE, CC0) that climbs the lydian scale one note per tenfold step; a whoosh for the rush back out and a tubular bell when the table returns.

- **visuals.** All code: eleven layers drawn in their own units, each one ten times smaller than the last, nested so the camera target is always the centre; the leaf and its veins are the same drawing at both 10 cm and 1 cm; cells, a stoma, chloroplasts, grana, a membrane with proteins, a light-harvesting trimer, a ball-and-stick chlorophyll and a stippled electron cloud.

- **narration.** Not recommended: the readout says where we are.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `dive` | 2 | - |
| `leaf` | - | 2 |
| `cell` | - | 2 |
| `molecule` | - | 2 |
| `atom` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the exhibit table from a metre up, a ginkgo leaf in the middle; the camera starts its dive at once, ten times closer every four beats; 끝없는 확대, 과학관 특별전.

**`dive`**: dive (15-second cut, 2 bars): from the veins to the molecule in eight beats, ten times closer on every beat, one glockenspiel note per step.

**`leaf`**: leaf (30-second cut, 2 bars): the dive from layer 2 to layer 4, ten times closer every four beats; 열 배씩, 더 가까이.

**`cell`**: cell (30-second cut, 2 bars): the dive from layer 4 to layer 6, ten times closer every four beats; 세포 속의 작은 공장.

**`molecule`**: molecule (30-second cut, 2 bars): the dive from layer 6 to layer 8, ten times closer every four beats; 햇빛을 붙잡는 분자들.

**`atom`**: atom (30-second cut, 2 bars): the dive from layer 8 to layer 10, ten times closer every four beats; 그리고, 원자 하나.

**`end`**: end (2 bars): inside the magnesium atom the cloud shimmers: 한 번 더 들여다보면, 또 하나의 세계; then the camera rushes back out through all ten steps in a beat and a half and lands on the table: 끝없는 확대, 과학관 특별전 · 가상의 전시입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: some cues are recordings too (real-glock, tubular-bells), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
