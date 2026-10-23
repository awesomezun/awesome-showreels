# Example: variety-captions (냥이네 하숙집)

A made-up show goes in (냥이네 하숙집: a vertical variety show that follows its cat lodgers); a 9:16 variety clip
comes out with the genre's captions. On a turning sunburst the show's name pops in character by character; in the
warm room the cheese cat sleeps as a loaf while 오늘의 하숙생: 낮잠 대장 pops in; awake, it swipes a cup off the table,
the frame punches in and freezes in concentration lines (와장창!!) and a red ring is drawn round the culprit; the end
card waves goodbye. The 30-second cut adds the innocent look away (모르는 척), a snack that brings the cat in 0.8
seconds, and this week's napping champion. The only vertical reel on the wall. One of the 24 styles studied from
eight repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/variety-captions-v1.0.0.html`](dist/variety-captions-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/variety-captions/dist/variety-captions-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 냥이네 하숙집 is fictional, and its "footage" is drawn by code. The xylophone, flexatone, slapstick and cowbell are recordings from a CC0 library.

## Folder

```
variety-captions/
  source/                 5 file(s)
    BRIEF.md
    fonts/BagelFatOne-Regular.woff2
    fonts/BlackHanSans-Regular.woff2
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    nyang.js
  scenes/                 7 file(s)
    end.js
    hook.js
    incident.js
    intro.js
    rank.js
    reaction.js
    snack.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/variety-captions
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/variety-captions-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/variety-captions.html
```

## How the captions were made

1. **Three passes per character.** `modules/nyang.js` draws every caption character three times (a thick plum outer
   stroke, a white inner stroke, a two-tone gradient fill) and scales each on its own spring, 0 to 1.15 to 1 in about
   eight frames, one after another; captions can tilt and bob.
2. **Footage without a camera.** The room (window light, a plant, a table, a cup that tips and breaks) and the cheese
   cat (a loaf or sitting; asleep, open, shocked, looking away or star-eyed; a paw that swipes) are drawn in code and
   filmed through a camera transform that creeps, punches and shakes; the freeze slows the picture's clock.
3. **The marks.** White concentration lines, a sweat drop, sparkles, floating Z, a red ring drawn round the culprit,
   confetti and a corner bug; vertical 1080 x 1920 throughout.

## What the tone pass decided

- **palette.** Variety captions over warm footage: a peach room #FCE3C8 with a wood floor and a cheese cat #F2A04E; captions in yellow #FFC400, pink #FF5C93, sky #3FB6FF, white and red #FF3B3B, each with a two-tone gradient, a white inner stroke and a thick plum #3B1E54 outer stroke; sunbursts for the title cards.

- **type.** Bagel Fat One for the captions, fat and round so they survive three strokes; Jua for tags; Black Han Sans for sound words.

- **motion.** Every character of a caption pops on its own spring (0 to 1.15 to 1 in eight frames) one after another; the camera creeps in, punches and shakes; one freeze frame with white concentration lines; captions bob, a ring is drawn round the culprit, confetti falls; vertical 9:16 throughout.

- **sound.** Bright pop at 128 BPM in G major with a recorded xylophone (VCSL, CC0) on the arpeggios; variety sound words: a flexatone boing, a slapstick and a glass shatter for the crash, pops for the captions, a cowbell for the tag, sparkles for the logo.

- **visuals.** All code, no footage: the room and the cat (a loaf or sitting, sleeping, open, shocked, looking away or star-eyed, a paw that swipes) are drawn and filmed by a camera transform; captions are three passes per character (outer stroke, white stroke, gradient fill) scaled by a per-character spring.

- **narration.** Not recommended: the captions are the voice.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `intro` | 2 | 3 |
| `incident` | 2 | 2 |
| `reaction` | - | 2 |
| `snack` | - | 3 |
| `rank` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): a yellow sunburst turning, confetti falling; the show's name pops in character by character in two fat lines, 냥이네 / 하숙집, with sparkles around it; then the tag 오늘의 하숙생은?

**`intro`**: intro (2 bars; 3 in the 30-second cut): the footage: a warm room, the cheese cat asleep as a loaf on a pink cushion, breathing, zzz floating up; the camera creeps in. 오늘의 하숙생: pops in yellow, then 낮잠 대장 big in pink; the tag 1호실 · 나비 (3살) at the foot; the show's bug in the corner.

**`incident`**: incident (2 bars): the cat, awake now, sits by the low table and lifts a paw; on the second beat it swipes and the cup tips off and smashes on the third; the frame punches in, shakes and freezes inside white concentration lines: 와장창!! in red, tilted; 범인은 바로… at the top, and a red circle drawn round the culprit.

**`reaction`**: reaction (30-second cut, 2 bars): a close-up on the cat's face looking away as if nothing happened, a sweat drop sliding; (모르는 척) bobbing in sky blue, question marks popping.

**`snack`**: snack (30-second cut, 3 bars): a hand comes in from the right with a treat; the cat's eyes turn to stars and it is there in no time; 간식 앞에선 / 1초 출석, and a stopwatch caption 0.8초.

**`rank`**: rank (30-second cut, 2 bars): a podium on a sky-blue burst; the cat sleeps on top with a gold crown that drops on; 이번 주 낮잠 순위 and 1위.

**`end`**: end (2 bars): the sunburst again with confetti; the cat sits in the middle waving a paw; 냥이네 / 하숙집 above it, 매주 금요일 밤 9시 on a tag and 가상의 예능입니다 at the foot.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (xylophone); some cues are recordings too (cowbell, flexatone, slapstick), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
