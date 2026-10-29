# Example: solid-3d (모노블록)

A made-up palm-sized speaker's one-page brief goes in (모노블록: one block of aluminium, four finishes); a launch reel
in real 3D comes out, in Korean. The brand word is extruded from the reel's own font and flies in letter by letter
from depth while the camera arcs in and focus pulls onto it; the speaker turns on a mirror floor while a key light
sweeps its anodised aluminium; then it comes apart along its depth into an exploded view, the shell lifting to glass
and a leader line landing on each part on the beat. The 30-second cut adds the four finishes stepping past in a cover
flow and a night stage where the speaker pumps inside an arc of equaliser bars and rings of light. Between scenes the
frame pushes into depth, turns on a cube, flips tile by tile, folds and flips. It is the example for the skill's solid
3D layer (`runtime/g3.js` on three.js); nothing here picks a preset: palette, type, motion and music come from
`source/` and are written to `style.json` with the reasoning for every decision.

- Web version with every cut: [`dist/solid-3d-v1.0.0.html`](dist/solid-3d-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/solid-3d/dist/solid-3d-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 모노블록 is fictional. The speaker is code: rounded boxes, a lathe, discs and a grille texture drawn in code, lit in 3D.

## Folder

```
solid-3d/
  source/                 3 file(s)
    BRIEF.md
    fonts/OFL.txt
    fonts/PretendardVariable.woff2
  modules/                1 file(s)
    monoblock.js
  scenes/                 6 file(s)
    beat.js
    colors.js
    end.js
    hero.js
    inside.js
    logo.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/solid-3d
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/solid-3d-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/solid-3d.html
```

## How the 3D was made

1. **One cast.** `modules/monoblock.js` builds the speaker from `G3` parts: a rounded block in anodised metal, the
   grille as a texture card on its front, a chrome ring button and a status light (children of the shell, so they
   travel with it), and the insides (a lathe-turned driver with its magnet, the passive radiator, the battery and the
   board) in their assembled places.
2. **Stages built once, posed from time.** Each scene builds its stage on the first frame (`G3.stage`) and sets every
   transform, light and material value from `t` on every frame, so frames rendered out of order by the parallel
   renderer match bit for bit.
3. **Type in 3D.** 모노블록 is traced from Pretendard as the page draws it and extruded with a bevel, one mesh per
   letter, so each letter can fly in on its own spring; focus pulls with the camera's depth of field.
4. **The exploded view.** `G3.explode` spreads the parts along their own depth while the shell lifts and fades to
   glass; each label is a 2D leader line on a point projected from the part it names, landing on its blip.
5. **The night stage and the cuts.** Instanced bars and neon rings react to `beatPulse`; the camera shakes on the
   impact cues; bloom ramps in only once the stage shows. The cuts between scenes are the compositor's 3D
   transitions (`depthPush`, `cube`, `flipBoard`, `fold`, `flip`).

## What the tone pass decided

- **palette.** A bright product studio: a warm light-grey stage #ECEAE6 with a deeper floor tone #DEDBD5, graphite text #1C1E22, and one accent, vermilion #E0502D (the button, the status light, the brand word). The four finishes from the brief are the product colours: graphite #2E3136, sand #CDBFA8, sage #8FA392 and vermilion. The beat scene turns the lights down onto a night stage #121316 so the equaliser can glow.

- **type.** Pretendard Variable only: ExtraBold for the brand word (also extruded in 3D) and the lines, Medium for labels and the fine print, set on the left of a centred product.

- **motion.** A product reel in real 3D: the brand word flies in letter by letter from depth while the camera arcs in and focus pulls onto it; the speaker turns under a key light that sweeps across its aluminium; it comes apart along its depth into an exploded view with leader lines landing on beats; the four colours step past in a cover flow; on a night stage the equaliser and rings pulse on every beat. Springs settle with little overshoot; 3D transitions (depth push, cube, flip board, fold, flip) move from side to side of one object.

- **sound.** Bright pop at 128 BPM in E major (8 bars in 15 s, 16 in 30 s): pad, glass, bell, bass and a full kit; glassy SFX for the metal (whooshes on the turns, blips on each label, a shimmer at the end).

- **visuals.** Solid 3D (runtime g3.js): lit meshes with physical materials (anodised metal, clearcoat letters), soft shadows on a shadow-catcher floor, a mirror floor for the hero, depth of field, an exploded view, instanced equaliser bars. Copy, labels and leader lines are 2D on top.

- **narration.** Not recommended: a short launch reel whose labels carry the facts.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `logo` | 2 | 2 |
| `hero` | 2 | 3 |
| `inside` | 2 | 3 |
| `colors` | - | 2 |
| `beat` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`logo`**: logo (2 bars): the brand word in solid 3D flies in letter by letter from depth while the camera arcs in and focus pulls onto it; a vermilion clearcoat with a sage rim light. 2D: kicker and the fiction tag.

**`hero`**: hero (2-3 bars): the speaker turns on a mirror floor while the key light sweeps across its aluminium; the camera pushes in on an arc. 2D: two lines on the left; a light glint per bar line in the hold.

**`inside`**: inside (2-3 bars): the speaker comes apart along its depth into an exploded view; the shell lifts and turns to glass; a leader line lands on each part on beats 3-6 (blips). 2D: the line and the labels.

**`colors`**: colors (2 bars, 30-s cut): the four finishes step past in a cover flow, one per beat (ticks), the name under the one in front; a ding when the last lands.

**`beat`**: beat (3 bars, 30-s cut, night stage): the lights go down; the speaker pumps on every beat, rings of light leave its grille, and an arc of equaliser bars behind it jumps with the music. 2D: 작아도, / 크게.

**`end`**: end (2-3 bars): the speaker turns slowly on a soft shadow; the brand word, the line and three facts land on the left; the fiction label stays for the whole card.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- The 3D is drawn by the skill's `runtime/g3.js` on three.js 0.186 (MIT, vendored in `runtime/vendor/`).
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
