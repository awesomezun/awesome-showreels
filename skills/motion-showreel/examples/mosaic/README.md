# Example: mosaic (유리 타일 정원)

A made-up public artwork goes in (유리 타일 정원: a wall of 14,400 glass tiles in the passage of 가람역 exit 2);
a glass-mosaic reel comes out. A plain white subway wall with the line's blue band turns, tile by tile, in a wave from
the left into a spring garden: a blossoming tree, hills, tulips, butterflies. Every beat a gust sweeps the wall and
every tile turns once, the petals moving on; the last wave opens one big cherry blossom: 조각 만 개가 모여 하나의 봄.
The 30-second cut adds a seed growing into a flower, where only the changing tiles flip, and a pull back to the
corridor while a counter runs to 14,400. One of the 24 styles studied from eight repositories of code-rendered
video; only the style is borrowed.

- Web version with every cut: [`dist/mosaic-v1.0.0.html`](dist/mosaic-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/mosaic/dist/mosaic-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 유리 타일 정원 is fictional. Every tile is drawn by code; the glockenspiel, marimba, wine glass and tubular bell are recordings from CC0 libraries.

## Folder

```
mosaic/
  source/                 4 file(s)
    BRIEF.md
    fonts/GowunDodum-Regular.woff2
    fonts/GrandifloraOne-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    tile.js
  scenes/                 5 file(s)
    count.js
    end.js
    grow.js
    hook.js
    wave.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/mosaic
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/mosaic-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/mosaic.html
```

## How the tiles turn

1. **One shader, 14,400 tiles.** `modules/tile.js` draws the whole wall in a WebGL2 fragment shader: each pixel
   finds its tile, reads the tile's colour from two pictures of 160 × 90 pixels (before and after) and turns the
   tile about its vertical axis by an angle that comes from the flip wave, a radial ripple or a straight gust with a
   hashed delay per tile; the tile narrows, darkens edge-on and opens on the other colour.
2. **Pictures at tile size.** The garden, the growing plant and the blossom are drawn by code at one pixel per tile,
   with a little noise, and snapped to a palette of twenty-three glass colours, so gradients break into mixed tiles
   the way a mosaicist would set them.
3. **Glass.** Bevel light from the top left, a per-tile tint, a glint band that crosses the wall and a few tiles
   that turn in place keep it alive; in the growth scene only the tiles whose colour changes flip, like a flip-disc
   sign.

## What the tone pass decided

- **palette.** Subway white tile #F4F1EA with warm grout #C9C4BA and the line blue #2F6FD0 and navy #1E3D7A; the garden in a glass palette of twenty-three colours: sky blues, blossom pinks, tulip red, yellow and violet, three greens, bark browns.

- **type.** Grandiflora One, a display face with a floral swing, for the name and the lines; Gowun Dodum for the label plate, the station sign and the counter.

- **motion.** Tiles turn: every picture change is a wave of flips (a radial ripple from a point or a straight gust) where each tile narrows, shows its dark edge and opens on the other colour; a gust every beat in the wind scene; only the changed tiles flip as the seed grows; a glint band crosses the glass and a few tiles twinkle in place; the camera pulls back to show the wall in its corridor.

- **sound.** Ambient at 112 BPM in E major with a soft pluck, pad, sub, kick, hats and shaker; a recorded glockenspiel note for every gust and a marimba note for every growth stage (VSCO 2 CE and VCSL, CC0), a wine glass and sparkle for the big flips, a tubular bell under the last line.

- **visuals.** All code: one WebGL2 fragment shader draws 160 × 90 tiles (14,400) from two pictures of 160 × 90 pixels (before and after), with the flip angle per tile from the wave front and a hashed delay; the pictures are drawn by code at tile resolution and quantised to the glass palette; the corridor, the sign and the commuters are 2D.

- **narration.** Not recommended: the wall speaks in flips.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `grow` | - | 3 |
| `wave` | 2 | 2 |
| `count` | - | 4 |
| `end` | 3 | 3 |

## Scenes

**`hook`**: hook (2 bars): a plain white tile wall in a subway corridor with the line's blue band and a station sign; on beat 1.5 a wave of tiles flips out from the left and the wall becomes a spring garden; the label plate: 유리 타일 정원.

**`grow`**: grow (30-second cut, 3 bars): the wall turns to soil and sky and a seed grows into a flower, two beats a stage; only the tiles that change flip, rippling out from the plant like a flip-disc sign; 싹이 트고, 꽃이 피고.

**`wave`**: wave (2 bars): every beat a gust sweeps the wall from the left and every tile turns once; the petals move on, the tree sways and the tulips lean; 바람이 불면, 조각이 뒤집혀요.

**`count`**: count (30-second cut, 4 bars): the camera pulls back and the garden is one wall of a subway corridor, commuters walking past; a diagonal sweep turns every tile once while the counter runs to 14,400 장의 유리 조각.

**`end`**: end (3 bars): one more wave from the flower's heart turns the wall into a single cherry blossom on the sky; 조각 만 개가 모여 / 하나의 봄; 유리 타일 정원 · 가람역 2번 출구 · 가상의 공공미술입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: some cues are recordings too (wine-glass, real-glock, real-marimba, tubular-bells), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
