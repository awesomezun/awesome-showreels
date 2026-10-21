# Example: pixel-platformer (8비트 장터 2026)

A made-up retro game fair goes in (8비트 장터 2026: two days of old consoles, cartridges, pixel art and high
scores, one coin token for the day); a side-scrolling platformer reel comes out, in Korean. The title screen asks
for a coin and gets one; then the hero runs down a dusk market street, jumps on the beat, takes a coin at the top
of every jump and bumps a ? block while a box types 다시, 동전 하나의 모험. The 30-second cut adds stage 1-2 past
three booths and a high-score table; both end at the market gate under pixel fireworks. One of the 24 styles from
the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/pixel-platformer-v1.0.0.html`](dist/pixel-platformer-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/pixel-platformer/dist/pixel-platformer-v1.0.0.html))
- Cuts: `short` (9 bars = 15.0 s), `30` (18 bars = 30.0 s), all at 144 BPM.

> 8비트 장터 2026 is fictional. Every pixel is drawn by code at 480 x 270 and shown at 4x.

## Folder

```
pixel-platformer/
  source/                 4 file(s)
    BRIEF.md
    fonts/Galmuri11.woff2
    fonts/OFL-Galmuri.txt
    fonts/OFL.txt
  modules/                1 file(s)
    px8.js
  scenes/                 5 file(s)
    boot.js
    booths.js
    end.js
    run.js
    score.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/pixel-platformer
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/pixel-platformer-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/pixel-platformer.html
```

## How the pixels were made

1. **One grid.** `modules/px8.js` draws every frame into a 480 x 270 buffer and scales it 4x with smoothing off.
   Galmuri11 is drawn at 12 px (its design grid: 1200 units per em, outlines on a 100-unit step) or 24 and 36,
   through an alpha threshold, so letters land on the same 4 x 4 blocks as the sprites.
2. **A game you can't play.** The hero's position is a function of the beat: it runs 32 px a beat and jumps in
   two-beat parabolas, coins wait at the top of each jump, the ? block sits where a shorter jump bumps it, and the
   score and coin count are counted from what the hero has passed.
3. **The street.** A sky in dithered bands, a parallax skyline with lit windows and hills, lantern strings, stalls
   with striped, scalloped awnings and signs, cobbles, a gate, fireworks in 3-pixel sparks, a HUD.

## What the tone pass decided

- **palette.** A dusk market in a small palette: sky bands from #2B1B4A through #8A2F6B and #F2784B to #FFB37A, dithered where they meet; lantern orange #FF8A3D, coin gold #FFD84A, awnings red #E8475F or blue #3B7DD8 against cream #FFF3E0, cobbles #7A5A50; outlines #1A1423.

- **type.** Galmuri11 only, always at its 12 px grid or a whole multiple (24, 36) in a 480 x 270 buffer shown at 4x, through an alpha threshold so every letter pixel is a crisp 4 x 4 block; a 1-pixel shadow under HUD and labels.

- **motion.** Game motion: the hero runs on two frames and jumps on the beat in parabolas, coins spin in four widths, the ? block bumps, scores float up; text types a character at a time; the boot screen flashes in stepped tones; fireworks burst in pixels.

- **sound.** Chiptune at 144 BPM in C major (9 bars in 15 s, 18 in 30 s): square leads, a triangle bass and noise drums; coin pings on every pickup, a stamp for the block.

- **visuals.** All code: string sprites (the hero, the ? glyph, a heart), coins and blocks from rectangles, a dithered sky, a parallax skyline and hills, stalls with striped awnings and signs, lantern strings, a gate, fireworks, a HUD.

- **narration.** Not recommended: a game speaks in pings.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `boot` | 2 | 2 |
| `run` | 4 | 5 |
| `booths` | - | 4 |
| `score` | - | 3 |
| `end` | 3 | 4 |

## Scenes

**`boot`**: boot (2 bars): the title screen over a dusk skyline: 레트로 게임 박람회, 8비트 장터 dropping in at 3x the font's grid, 2026; 동전을 넣으세요 blinks; a coin drops into the slot, the credit counter ticks to 01 and the screen flashes white.

**`run`**: run (4-5 bars): the core message, played. Stage 1-1, a dusk market street: the hero runs right, jumps on the beat, takes a coin at the top of each jump and bumps a ? block for one more; the score and the coin count climb; a box up top types 다시, / 동전 하나의 모험.

**`booths`**: booths (4 bars, 30-s cut): stage 1-2, the booths. The hero runs on past three big booths; as each comes up, a box names it (카트리지 장터 / 도트 공방 / 고수 대전) with what it offers; a crate to jump, a heart to take.

**`score`**: score (3 bars, 30-s cut): the high-score table. 최고 점수 in yellow; the rows type in one per beat; the last row is yours, its name blinking; 대회 상품: 황금 동전.

**`end`**: end (3-4 bars): the gate. The hero runs in under 장터 입구 and jumps on the beat while pixel fireworks go up; the card: 8비트 장터 2026, the dates and the place, and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL-Galmuri.txt`, `source/fonts/OFL.txt`.
