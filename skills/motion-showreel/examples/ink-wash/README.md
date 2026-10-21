# Example: ink-wash (도성 한 바퀴)

A made-up walking tour goes in (도성 한 바퀴: a day's walk round Seoul's old city wall over its four mountains,
through its great gates, with a night walk by moonlight); a Korean ink-landscape reel comes out, unrolling like a
hand scroll. On bare rice paper the ranges bleed in as washes, the wall paints itself along the near ridge with its
parapet, the title is brushed in and a red seal lands; then the scroll moves on with three tiny walkers on the wall:
먹빛 성곽을 따라, 하루. The 30-second cut adds the gates (숭례문, 흥인지문, 숙정문, 창의문) and the night walk. One of the
24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/ink-wash-v1.0.0.html`](dist/ink-wash-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/ink-wash/dist/ink-wash-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 도성 한 바퀴 is a fictional tour on a real wall. Every wash and stroke is drawn by code.

## Folder

```
ink-wash/
  source/                 4 file(s)
    BRIEF.md
    fonts/NanumBrushScript-Regular.woff2
    fonts/OFL.txt
    fonts/SongMyung-Regular.woff2
  modules/                1 file(s)
    meok.js
  scenes/                 5 file(s)
    end.js
    gates.js
    hook.js
    night.js
    wall.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/ink-wash
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/ink-wash-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/ink-wash.html
```

## How the ink was made

1. **Washes.** `modules/meok.js` makes each mountain range from summed sines and fills it down from the ridge,
   darkest at the ridge and fading to the foot, under a blur; ranges bleed in by darkening while the blur shrinks,
   and each range scrolls at its own depth like a hand scroll.
2. **Strokes.** A stroke follows a path with a pressure profile (thin start, full middle, tapering end) and is
   painted up to a fraction of its length; seven bristle lines of paper colour break it into dry brush toward the end.
   The wall is such a stroke a little under the ridge, with parapet ticks.
3. **The rest of the sheet.** Pines, gate pavilions with upturned eaves, drifting mist, a moon with a halo, warm
   lantern dots, a red seal with uneven edges and carved Song Myung characters, the title written in Nanum Brush
   Script.

## What the tone pass decided

- **palette.** Ink on rice paper and nothing else: paper #F1EADC with fibres and a darker edge, ink #16130F in many dilutions (the far ranges at a fifth of full strength, the near ridge at three quarters, strokes near full), one seal red #B8322A; a grey-blue night wash with a warm lantern glow for the night walk.

- **type.** Nanum Brush Script for the brushed lines, revealed left to right as if written; Song Myung for small labels and gate names; the seal carved in Song Myung.

- **motion.** A hand scroll: the landscape slides sideways with each range at its own depth; washes bleed in (blur shrinking as they darken), strokes paint themselves with a pressure profile and dry-brush streaks, mist drifts, the seal lands with a press.

- **sound.** Ambient at 96 BPM in D, snapped to a pentatonic scale (평조, 0 2 4 7 9), koto-like plucks over a pad with light drums; organic SFX: a soft thud for the seal, air for the scroll.

- **visuals.** All code: ridges from summed sines filled as washes under blur, a wall stroke that follows a ridge with parapet ticks, pines, gate pavilions with upturned eaves, mist, a moon, tiny walkers, a red seal with irregular edges.

- **narration.** Not recommended: the brush speaks.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `wall` | 2 | 3 |
| `gates` | - | 3 |
| `night` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): bare rice paper; the far ranges bleed in as washes, the near ridge darkens, and the fortress wall paints itself along it with its parapet ticks; 한양도성 걷기 투어, then 도성 한 바퀴 brushed in; the red seal lands.

**`wall`**: wall (2-3 bars): the core message. The scroll unrolls to the left: ranges pass at their own depths, mist drifts, the wall keeps painting itself ahead along the near ridge with three tiny walkers on it, pines go by; 먹빛 성곽을 따라, / 하루.

**`gates`**: gates (3 bars, 30-s cut): along the way, the great gates: each pavilion washes in on the ridge as the scroll moves, its name written beside it (숭례문, 흥인지문, 숙정문, 창의문); 성문 네 곳을 지나요.

**`night`**: night (2 bars, 30-s cut): the paper takes a grey-blue wash, a pale moon rises with a halo, the wall is a dark line with small warm lantern lights moving along it; 달빛 성곽 야간 코스.

**`end`**: end (2 bars): a small landscape on the right of the sheet, the title brushed on the left, the seal, the departure and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
