# Example: cartoon (산책왕 멍멍)

A made-up dog-walking app goes in (산책왕 멍멍: it counts the steps, ranks the dogs of the neighbourhood and
suggests new walks); a Saturday-morning cartoon reel comes out, in Korean. 멍멍 shoots in on speed lines, skids to a
stop with a squash and a 멍! balloon while the app's name slams in; then it runs flat out through the park as an
app card counts its steps, and a 동네 1등 burst drops a crown on its head: 오늘도 산책 1등! The 30-second cut adds the
neighbourhood podium and a recommended route traced in paw prints. One of the 24 styles from the series after the
video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/cartoon-v1.0.0.html`](dist/cartoon-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/cartoon/dist/cartoon-v1.0.0.html))
- Cuts: `short` (9 bars = 15.0 s), `30` (18 bars = 30.0 s), all at 144 BPM.

> 산책왕 멍멍 is fictional. 멍멍 is drawn by code, legs and all.

## Folder

```
cartoon/
  source/                 4 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    toon.js
  scenes/                 5 file(s)
    end.js
    friends.js
    hook.js
    map.js
    walk.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/cartoon
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/cartoon-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/cartoon.html
```

## How the cartoon was made

1. **Ink and paint.** `modules/toon.js` fills every shape flat and inks it with an 8 px round-jointed line; a
   cel shade is the shape filled darker, then the shape again shifted up and left in its own colour, leaving a
   crescent of shadow on the lower right.
2. **멍멍.** Ellipses for the body, head and floppy ear, a white muzzle and belly, rubber-hose legs swung by a run
   phase (the far pair a shade darker), a tail on its own wag, a red collar with a tag, a crown when it wins; any
   colour for its friends.
3. **Cartoon timing.** Entrances smear on speed lines and skid with puffs; stops squash and wobble; stars, burst
   balloons and lines of type pop with an overshoot; the podium dogs drop in on the beat.

## What the tone pass decided

- **palette.** Saturday-morning flats inside thick #1B1B1B ink: sky #6EC8FF, grass #7ED957, a tan dog #F4A259 with a white muzzle, a red collar #FF5A5F, star and crown yellow #FFD23F, numbers in blue #3D7CFF.

- **type.** Black Han Sans for the shouted lines, in white or yellow with an ink outline and a hard drop; Jua for small lines and names.

- **motion.** Cartoon physics: smears and speed lines, skids with puffs, squash on every stop, rubber-hose legs on a run cycle, a tail that never stops, stars and burst balloons that pop with an overshoot, a podium the dogs drop onto.

- **sound.** Bright pop at 144 BPM in C major (9 bars in 15 s, 18 in 30 s), pluck, marimba and bell over a full kit; cartoon SFX: whips for the entrances, pops and boings for the balloons and landings, a confirm for the crown.

- **visuals.** All code: inked paths with one shadow tone, 멍멍 built from ellipses and hose legs, a scrolling park, a phone card that counts steps, a podium on sunburst rays, a map with a dotted route and paw prints.

- **narration.** Not recommended: the dog speaks for itself.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `walk` | 4 | 5 |
| `friends` | - | 4 |
| `map` | - | 3 |
| `end` | 3 | 4 |

## Scenes

**`hook`**: hook (2 bars): 멍멍 shoots in from the left on a smear of speed lines, skids to a stop with a squash and a puff, wags; a burst balloon pops (멍!); 반려견 산책 앱 above, 산책왕 멍멍 slammed in below.

**`walk`**: walk (4-5 bars): the core message. 멍멍 runs flat out through the park as it scrolls by; an app card counts the steps up; on the downbeat of the third bar a 동네 1등 burst pops and a crown drops onto the dog's head; 오늘도 / 산책 1등!

**`friends`**: friends (4 bars, 30-s cut): the neighbourhood ranking: a podium; two friends land on the lower steps (a white puppy, a black one), then 멍멍 on the top with its crown; names and step counts pop on the beat; 동네 친구들과 랭킹 대결.

**`map`**: map (3 bars, 30-s cut): a cartoon map of the neighbourhood; a dotted route draws itself between houses and a park and paw prints follow it on the beat to a flag; 처음 가 보는 / 산책길 추천.

**`end`**: end (3-4 bars): the app's name with 멍멍 jumping for joy on every other beat, crown on; where to get it; the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
