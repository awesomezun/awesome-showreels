# Example: clay (말랑베이커리)

A made-up neighbourhood bread delivery goes in (말랑베이커리: a bakery that brings the morning's bread to the door
within half an hour); a claymation reel comes out, in Korean. A loaf with a face hops out of a pastel oven, lands
with a squash and steams while 말랑베이커리 squishes in; then the loaf rides a coral scooter down a clay street to a
mint door and leaves the bread box on the step: 갓 구운 빵, 말랑하게 문 앞까지. The 30-second cut adds three loaves
with their prices and a clay clock that sweeps 30 minutes. One of the 24 styles from the series after the video
*모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/clay-v1.0.0.html`](dist/clay-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/clay/dist/clay-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 말랑베이커리 is fictional. The clay is code: no model was sculpted or photographed.

## Folder

```
clay/
  source/                 4 file(s)
    BRIEF.md
    fonts/Dongle-Bold.woff2
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    clay.js
  scenes/                 5 file(s)
    delivery.js
    end.js
    hook.js
    menu.js
    time.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/clay
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/clay-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/clay.html
```

## How the clay was made

1. **Plasticine fills.** `modules/clay.js` builds every shape as a closed path of points smoothed with curves,
   fills it in its colour, adds a highlight from the top left and a darker rim, dusts it with a fine speckle like
   fingerprints, and drops a soft shadow under it.
2. **Stop motion.** Scenes step their time at 12 frames a second (the clock at 8), and every outline is jittered
   anew on each stepped frame, so the clay boils the way hand-animated plasticine does.
3. **Characters.** Loaves (a square milk loaf, a curled salt roll, a round red-bean bun) with blinking faces and
   cheeks squash on landing and bounce on the beat; the scooter, the houses, the oven, the steam and the clock are
   the same clay.

## What the tone pass decided

- **palette.** Plasticine pastels: a cream wall #FCE9D8 on a clay table #F2C9A0, golden crusts #D9954F to #B8732F, a pastel blue oven #9FD3E6, a coral scooter #F28B82, mint and soft roofs; chocolate brown #7A4A32 for type and faces.

- **type.** Jua for every title, squashed letter by letter with a thick white edge and a soft drop; Dongle for small lines, set big since it runs small.

- **motion.** Stop motion: the scenes step their time at 12 frames a second and every outline boils a little on each new frame; things hop in arcs, squash on landing and wobble back; loaves blink and bounce on the beat.

- **sound.** Bright pop at 112 BPM in F major (7 bars in 15 s, 14 in 30 s), marimba, pluck and bell on a full kit; organic SFX: bloops and pops for landings, a ding for the door.

- **visuals.** All code: wobbly closed paths filled in clay (base, a highlight from the top left, a darker rim, speckle), soft contact shadows, loaves with faces, an oven, a scooter, houses, steam, a clay clock.

- **narration.** Not recommended: the pictures say it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `delivery` | 3 | 4 |
| `menu` | - | 3 |
| `time` | - | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): a pastel oven on a clay table; a loaf hops out of its mouth, lands with a squash, blinks and steams; 동네 빵 배달, then 말랑베이커리 squishes in letter by letter. Time steps at 12 frames a second, like stop motion.

**`delivery`**: delivery (3-4 bars): the core message. A loaf in a helmet rides a coral scooter down a clay street, houses rolling by; the street slows and stops at a mint door; the door opens and a bread box is set on the step; 갓 구운 빵, / 말랑하게 문 앞까지.

**`menu`**: menu (3 bars, 30-s cut): three loaves pop up, one a bar: 우유식빵, 소금빵, 단팥빵, each with its price; once up they bounce on the beat.

**`time`**: time (2 bars, 30-s cut): a clay clock; its minute hand sweeps half an hour in stepped jumps while a round bun hops beside it; 주문하면 30분.

**`end`**: end (2-3 bars): the three loaves in a row, swaying and blinking; 말랑베이커리, 앱에서 주문하세요, the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
