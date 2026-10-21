# Example: generative-art (흐름의 지도)

A made-up media art exhibition goes in (흐름의 지도: wind, water and light drawn in thousands of points and
lines, never the same twice); a generative reel comes out, in Korean. In the dark one point blooms into a field of
flowing lines, the lines gather into the letters of the title and let go; then the field keeps moving under
같은 순간은 / 두 번 오지 않아요 while a clock counts this very moment. The 30-second cut adds the three rooms (wind,
water, light, each its own field and colour) and a visitor the lines part round. One of the 24 styles from the series
after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/generative-art-v1.0.0.html`](dist/generative-art-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/generative-art/dist/generative-art-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 흐름의 지도 is fictional. Every line is drawn by code from a seed and the time.

## Folder

```
generative-art/
  source/                 3 file(s)
    BRIEF.md
    fonts/Hahmlet.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    flow.js
  scenes/                 5 file(s)
    end.js
    hook.js
    moment.js
    rooms.js
    you.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/generative-art
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/generative-art-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/generative-art.html
```

## How the flow was made

1. **Particles with their own clocks.** `modules/flow.js` gives every particle a seeded birth place, a lifetime and a
   phase; to draw a frame it integrates each one from its birth to now through a time-varying field and strokes the
   last few steps additively, so any frame can be drawn on its own (stills, seeking and export all agree).
2. **Fields.** Drift is a sum of moving sines; wind runs sideways with slow waves; water turns round a wandering
   centre; light pushes out from the middle in rays. A visitor adds a push away from a moving point.
3. **Letters out of lines.** The title is drawn once off screen and sampled into points; gathering moves each
   particle onto its point and shrinks its trail to a short stroke that keeps the flow's direction, so the letters
   are made of the same fibres as the field.

## What the tone pass decided

- **palette.** Dark and deep: night navy #06070C with a faint centre glow; the lines in light blues and lilac (#7FA8FF, #B9A7FF, #8FE3E8) for the drift, blue for wind, teal for water (#2EC4B6), gold for light (#FFD27A); white type, grey-blue small print.

- **type.** Hahmlet, a Korean serif with a calm, wide stance: light for the title made of lines, regular for the lines, letter-spacing closing in as each line fades up.

- **motion.** Generative: thousands of particles ride a time-varying flow field, each born on its own clock and integrated from its birth to now, so every frame can be drawn on its own; they bloom from one point, gather into letters and let go, part round a visitor; the rooms change the field itself.

- **sound.** Ambient at 96 BPM in A major (6 bars in 15 s, 12 in 30 s), pad, bell, glass and piano with a soft kick and shaker; glassy SFX: a swell into the title, chimes on the rooms.

- **visuals.** All code: analytic fields (drift, wind, water, light), additive trails, text sampled into points for the particles to gather on, a visitor that pushes the flow aside, a clock counting this moment.

- **narration.** Not recommended: the work is silent but for the music.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `moment` | 2 | 3 |
| `rooms` | - | 3 |
| `you` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): darkness, then one point that blooms into a field of flowing lines; the lines gather into the letters of 흐름의 지도 and the title settles crisp over them; the exhibition is named small from the start.

**`moment`**: moment (2-3 bars): the core message. The field keeps flowing and never repeats; a clock under the lines counts this very moment to the millisecond; 같은 순간은 / 두 번 오지 않아요.

**`rooms`**: rooms (3 bars, 30-s cut): the three rooms, one a bar: 1관 바람 (long horizontal streams in blue), 2관 물 (a slow whirlpool in teal), 3관 빛 (rays from the centre in gold); each room fades into the next on the bar line.

**`you`**: you (2 bars, 30-s cut): a visitor, a soft white glow, walks through the field and the lines part round them and close behind; 당신이 움직이면 / 흐름도 비켜 가요.

**`end`**: end (2 bars): the lines gather into the title once more and hold, breathing; the dates and the museum, the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
