# Example: anime (벚꽃 정류장)

A made-up coming-of-age webtoon goes in (벚꽃 정류장: the last spring of school, two students, one bus that was
always three minutes late); an anime teaser comes out, in Korean, painted like an anime background. The camera tilts
down from a deep blue sky of cumulus and power lines to a bus stop under a cherry tree in bloom; the two sit side by
side on the bench, seen from behind, the board blinking 3분 후 도착: 그 봄, 버스는 늘 3분 늦었다. The 30-second cut
adds the sky with a gust of petals (그 3분이 우리의 전부였다) and the bus finally pulling in. One of the 24 styles
from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/anime-v1.0.0.html`](dist/anime-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/anime/dist/anime-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 벚꽃 정류장 is fictional. The sky, the tree and the people are painted by code.

## Folder

```
anime/
  source/                 3 file(s)
    BRIEF.md
    fonts/GowunDodum-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    haru.js
  scenes/                 5 file(s)
    bus.js
    end.js
    glance.js
    hook.js
    wait.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/anime
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/anime-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/anime.html
```

## How the painting was made

1. **Clouds and blossom as masses.** `modules/haru.js` builds a cumulus or a cluster of blossom from many circles
   but fills them as one shape: the union in the shade tone, then the union nudged up and left in the light tone, so
   only the underside stays shaded; blossom gets a third, paler pass and a sprinkle of tiny flowers.
2. **Light.** A sun with soft rays and lens ghosts across the frame, a warm wash at the horizon, rim light on the
   students' hair and shoulders; the end turns the sky to golden hour.
3. **The details anime backgrounds love.** Power lines sagging from a pole, a bus-stop sign and shelter with an
   amber arrival board, a bench, a pavement, petals that flip as they fall, a green city bus.

## What the tone pass decided

- **palette.** An anime background painting: a deep-to-pale sky #1F5FC8 to #7FC4F2 warming to #FFE8C8 at the horizon, white cumulus shaded blue-grey #B9C7E6 underneath, cherry pinks #FFC3D7, #F49BBB and #FFE4EE, a blue bus-stop sign #2E6FD8, a green city bus; a golden-hour variant for the end.

- **type.** Gowun Dodum, a gentle rounded Korean face, in white with a soft blue shadow over the sky, fading up line by line.

- **motion.** Unhurried: a tilt down from the sky, a slow push-in, clouds drifting, petals falling and flipping, a gust when the bus arrives; the light is the event: rays and a flare from the sun.

- **sound.** Corporate-lite at 112 BPM in D major (7 bars in 15 s, 14 in 30 s), strings and piano, a gentle kit; glassy SFX: chimes on the title and the bus.

- **visuals.** All code: cumulus from shaded puffs, a sun with rays and lens ghosts, power lines on a pole, a cherry tree of pink clusters, petals, a street, a bus stop with an arrival board, two students seen from behind, a bus.

- **narration.** Not recommended: two lines of text carry it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `wait` | 3 | 4 |
| `glance` | - | 3 |
| `bus` | - | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the camera tilts down out of a deep blue sky full of cumulus and power lines to a bus stop under a cherry tree in bloom, petals drifting through the sunlight; 청춘 웹툰, then 벚꽃 정류장.

**`wait`**: wait (3-4 bars): the core message. At the stop, two students sit side by side on the bench, seen from behind, the sun rimming their hair; the board blinks 3분 후 도착; petals fall; 그 봄, 버스는 / 늘 3분 늦었다.

**`glance`**: glance (3 bars, 30-s cut): looking up: clouds drift past the sun, a gust carries a stream of petals across the sky and the wires; 그 3분이 / 우리의 전부였다.

**`bus`**: bus (2 bars, 30-s cut): the bus finally pulls in from the right and stops in front of the shelter; the gust of its arrival lifts the petals; 매주 토요일 연재.

**`end`**: end (2-3 bars): golden hour at the stop; petals; 벚꽃 정류장, where and when, the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
