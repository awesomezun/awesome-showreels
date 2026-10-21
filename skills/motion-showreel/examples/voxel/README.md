# Example: voxel (블록 마을)

A made-up summer coding camp goes in (블록 마을: children aged 8 to 12 write easy Korean code and every line
puts a block into a village); a voxel reel comes out, in Korean. The ground pops up tile by tile and 블록 마을
drops in letter by letter; then a code panel types 놓기(벽돌) and one brick lands, again, then a loop drops six,
a line puts the roof on and another the windows: 코드 한 줄에 블록 하나. The 30-second cut adds a loop that plants
five trees, two lamps, and night falling on the village with its windows lit. One of the 24 styles from the series
after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/voxel-v1.0.0.html`](dist/voxel-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/voxel/dist/voxel-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 블록 마을 is fictional. Every block is drawn by code, and every line of code on screen lands on a beat.

## Folder

```
voxel/
  source/                 3 file(s)
    BRIEF.md
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    vox.js
  scenes/                 5 file(s)
    code.js
    end.js
    grow.js
    hook.js
    night.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/voxel
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/voxel-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/voxel.html
```

## How the blocks were made

1. **Isometric voxels.** `modules/vox.js` draws each unit cube as three faces (top, and the two sides that face
   the viewer) in three shades with a dark outline, sorted back to front by x + y then z; a face is skipped when a
   landed block sits against it. Grass has a green band on its dirt sides, windows are painted on brick faces.
2. **Landing.** A block falls on an ease-in from seven blocks up with its shadow growing under it, lands on the
   beat, bounces once, squashes and throws six little squares of dust. Each line of code flashes when it runs, a
   beat or more before its block lands.
3. **One village, many scenes.** The village is one list of blocks in groups (ground, deco, house, more), so each
   scene shows what the earlier ones built; night dims every colour towards navy except the windows and lamps.

## What the tone pass decided

- **palette.** A toy world: sky blue #7FCBFF to #DDF3FF, grass #7CCB4F over dirt #A06C3E, sand #F2D27A, water #52BDF2, orange bricks #F08A5D, a red roof #EF4B3C, wood, two greens for leaves, lamp yellow #FFD84A; the code panel deep navy #1F2347 with candy syntax colours. Night turns everything towards #1A2456 except what glows.

- **type.** Jua throughout, round and friendly: the name in white with a navy block extrusion, its letters dropping like blocks; the code in Jua too, coloured by token.

- **motion.** Everything lands: tiles pop up from the middle out, blocks fall with a shadow growing under them, bounce once, squash and throw a puff; text pops with a small overshoot; each line of code flashes when it runs, a beat before its block lands.

- **sound.** Bright pop at 128 BPM in G major (8 bars in 15 s, 16 in 30 s), marimba, pluck and bell on a full kit; pops on each landing, a riser into the loop, chimes for the night and the golden block.

- **visuals.** All code: an isometric voxel renderer on Canvas2D (three shaded faces per cube, outlines, culling against neighbours, back-to-front order), a code panel that types, block clouds, stars and fireflies.

- **narration.** Not recommended: the code on screen is the story.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `code` | 4 | 5 |
| `grow` | - | 3 |
| `night` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): a sky with drifting block clouds; the ground pops up tile by tile from the middle out (grass, a sand path, a pond) and two trees drop in piece by piece; 어린이 코딩 캠프, then 블록 마을 letters dropping like blocks.

**`code`**: code (4-5 bars): the core message, shown. The code panel slides in; each line types itself and runs (a yellow flash), and its brick drops onto the plot: one line, one block; then a loop drops six at once, a line puts the roof on, a line puts in the windows. A chip counts the blocks; 코드 한 줄에 블록 하나 above the panel.

**`grow`**: grow (3 bars, 30-s cut): a loop. A new file: 5번 반복 { 나무 심기() } and five trees sprout round the village one after another, then 가로등 세우기(2) puts up two lamps; 반복하면 한 번에!

**`night`**: night (3 bars, 30-s cut): 밤 되기() runs and the sky turns to night; the world dims, the windows and the two lamps light up, stars and fireflies come out; 내 마을에 불이 켜져요.

**`end`**: end (2-3 bars): back to day; the whole village (with the 30-s cut's trees and lamps) turns slowly bigger; one last block, a golden one, drops onto the roof; 블록 마을, the camp line and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
