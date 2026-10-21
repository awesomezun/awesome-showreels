# Example: infographic (한빛시 자전거 리포트 2026)

A made-up city's cycling report goes in (한빛시 자전거 리포트 2026, every number fictional and labelled so); an
infographic reel comes out, in Korean. An isometric city assembles itself on a paper map; four isometric bars grow
a beat apart while their numbers count up, a dashed trend line runs to a red ×2; the bike lanes draw themselves
across the map with riders running along them, six hubs pulse and 112km counts up; the core line 자전거 출근, 3년 새
두 배. closes it. The 30-second cut adds a donut of how people get to work and a three-year timeline. Every chart
carries the label 가상 데이터. One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab);
only the style is borrowed.

- Web version with every cut: [`dist/infographic-v1.0.0.html`](dist/infographic-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/infographic/dist/infographic-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 한빛시 and its numbers are fictional; every chart says 가상 데이터.

## Folder

```
infographic/
  source/                 5 file(s)
    BRIEF.md
    fonts/GothicA1-Black.woff2
    fonts/GothicA1-Bold.woff2
    fonts/GothicA1-Medium.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    info.js
  scenes/                 6 file(s)
    bars.js
    donut.js
    hook.js
    map.js
    message.js
    timeline.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/infographic
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/infographic-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/infographic.html
```

## How the charts were drawn

1. **One projection.** `modules/info.js` maps a 1000 x 1000 ground to the screen isometrically, so the plate, the
   road grid, the river, the parks, the blocks, the bike lanes and the hubs all sit on one surface.
2. **Bars and numbers.** An isometric prism is three faces of one colour (the side darker, the top lighter) with a
   soft ground shadow; it grows with a small overshoot while its number counts up with the same progress.
3. **Running riders.** Each lane is drawn on with a dash offset; once drawn, three riders run along its length on
   their own phase, so the map never stops moving.

## What the tone pass decided

- **palette.** A paper map: ground #F4EFE6 with a faint 48 px grid, ink #23262B; the data in the classic infographic run navy #234E70, steel #5C8DA8, teal #2A9D8F and a red-orange #E76F51 that is kept for the news (the 2026 bar, ×2, 112km, 12%, the core line). Water #BFD9E6, parks #CFE3B4, roads #E2D6C1.

- **type.** Gothic A1 at 800-900 for every word and number, so a figure reads from across a room; labels at 30-44 px in 700. Lines rise out of a mask on an expo ease.

- **motion.** Data that builds: the city assembles block by block, bars grow out of the ground a beat apart with a small overshoot, numbers count up while they grow, a dashed trend line draws to a ×2 badge, bike lanes draw themselves and riders run along them, hubs pulse. Scenes push in from the side.

- **sound.** Corporate at 128 BPM in D major (8 bars in 15 s, 16 in 30 s): piano and strings, a light kit; glassy SFX: a count roll under every number, pops for bars and badges.

- **visuals.** All code: an isometric map (plate, road grid, river, parks, blocks), isometric bars, a donut, a timeline, a bicycle with turning wheels, and the 가상 데이터 label on every chart.

- **narration.** Not recommended: the numbers are on screen; a public-screen version plays muted.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `bars` | 2 | 3 |
| `map` | 2 | 3 |
| `donut` | - | 3 |
| `timeline` | - | 2 |
| `message` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the name and what it is. On the right the isometric city builds itself (the ground plate, the road grid, the river, the parks, the blocks); on the left 한빛시 자전거 리포트, a big 2026 that rolls up to its year, 숫자로 본 출근길, and a bicycle riding along the baseline.

**`bars`**: bars (2-3 bars): the count. Four isometric bars grow out of the ground a beat apart (2023: 4.1만 to 2026: 8.3만), their numbers counting up on top; a dashed trend line joins the tops and a red ×2 badge lands on the last one.

**`map`**: map (2-3 bars): where. The whole isometric city at once, then the bike lanes draw themselves in red and riders run along them; the six hubs pop up and pulse; on the right, 자전거 도로 112km counts up and 대여소 거점 6곳 follows.

**`donut`**: donut (3 bars, 30-s cut): how people get to work in 2026. The donut sweeps round (subway, bus, car, bike) with its labels; the bike's share pulls out of the ring and a big 12% and a bicycle sit beside it.

**`timeline`**: timeline (2 bars, 30-s cut): how it got here. A line runs across the years 2023-2026 and a milestone lands on each beat: 공공자전거 시작, 강변 자전거길 개통, 출근 지원금, 도로 112km.

**`message`**: message (2-3 bars): the core line, centred: 자전거 출근, / 3년 새 두 배. (the second line in red), a bicycle rides across under it, and the report's name and the fictional-data label close it.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
