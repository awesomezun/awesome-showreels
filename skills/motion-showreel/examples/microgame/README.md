# Example: microgame (5초 미션)

A made-up party game goes in (5초 미션: one-word missions against a burning fuse); a microgame reel comes out.
The logo pops onto flashing stripes, a count of 3, 2, 1, 시작!, then the missions: 잡아! (catch the apple), 피해!
(jump the ball), 눌러!, 터뜨려!, each a few seconds of action on its own colour, a 성공! stamp and a coin; 속도 UP!
and the missions get shorter; 5초면 충분해!. The 30-second cut adds the one rule, a third level where every beat is
a new mission, and a boss wave of balloons. One of the 24 styles studied from eight repositories of code-rendered
video; only the style is borrowed, and no real game is copied.

- Web version with every cut: [`dist/microgame-v1.0.0.html`](dist/microgame-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/microgame/dist/microgame-v1.0.0.html))
- Cuts: `short` (9 bars = 15.0 s), `30` (18 bars = 30.0 s), all at 144 BPM.

> 5초 미션 is fictional. Every mission is drawn by code, and the chiptune and its blips and coins are synthesized.

## Folder

```
microgame/
  source/                 5 file(s)
    BRIEF.md
    fonts/BagelFatOne-Regular.woff2
    fonts/Galmuri11-Bold.woff2
    fonts/OFL-Galmuri.txt
    fonts/OFL.txt
  modules/                1 file(s)
    mini.js
  scenes/                 9 file(s)
    boss.js
    end.js
    hook.js
    level1.js
    level2.js
    level3.js
    rules.js
    speed.js
    ... 1 more
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/microgame
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/microgame-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/microgame.html
```

## How the missions run

1. **A mission is one number.** `modules/mini.js` draws each of the eight missions from a single progress value u,
   0 at the instruction and 1 at the end: the apple falls as u², the ball rolls across, the finger presses at 0.55,
   the balloon pops at 0.72; the instruction pops in with a spring, the 성공! stamp lands at 0.75, the fuse burns
   with u.
2. **Shorter, not faster.** The tempo stays at 144 BPM: a mission lasts four beats at level 1, two at level 2 and one
   at level 3, the stripes run faster, and the chiptune's sections get denser (sixteenth hats in the drops), so the
   reel accelerates without a tempo change; every instruction is a blip and every success a coin on its beat.
3. **Pixel type on its grid.** The status bar and the small print use Galmuri11 only at whole multiples of its
   12-pixel design grid (48 px), so its pixels stay square.

## What the tone pass decided

- **palette.** A new primary for every mission (red #FF5A5F, blue #3DA5FF, yellow #FFC531, violet #7B61FF, green #2ECC71, orange, pink, teal) under moving white diagonal stripes; heavy black outlines #141018; a dark status bar #1B1B2F; yellow #FFE14D for the logo and the level.

- **type.** Bagel Fat One, fat and bouncy, for the one-word instructions and the logo, outlined in black; Galmuri11, a Korean pixel font, for the status bar and the small print, always at a whole multiple of its 12-pixel grid.

- **motion.** Every mission is one progress value from instruction to success: the word pops in with a spring, the action plays (catch, dodge, press, pop, feed, wipe, wake, score), a 성공! stamp slams in, the fuse burns down; the missions shrink from four beats to two to one with 속도 UP! cards between, and the stripes run faster.

- **sound.** Chiptune at 144 BPM in D major (pulse arps, triangle bass, a pulse lead, kick, snare and hats); the tempo never changes: the sections get denser (sixteenth hats in the drops) as the missions get shorter; a blip for every instruction, a coin for every success, beeps for the count, pops for the boss balloons.

- **visuals.** All code: eight missions drawn from simple shapes with thick outlines, each a function of its progress; striped backgrounds; a star-burst for success; the fuse is a line with a sparking star.

- **narration.** Not recommended: the words are the commands.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `rules` | - | 2 |
| `level1` | 2 | 2 |
| `speed` | 1 | 1 |
| `level2` | 2 | 2 |
| `speed2` | - | 1 |
| `level3` | - | 2 |
| `boss` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the logo pops onto flashing stripes with a lit bomb; then the count: 3, 2, 1, 시작!

**`rules`**: rules (30-second cut, 2 bars): how to play: a word appears (눌러!), the fuse burns; 지시어를 보고, 도화선이 다 타기 전에!

**`level1`**: level1: games of 4 beat(s) each from game 0 on; the instruction pops, the fuse burns, 성공! and the score goes up.

**`speed`**: speed (1 bar): 속도 UP! on rushing speed lines, then LEVEL 2.

**`level2`**: level2: games of 2 beat(s) each from game 2 on; the instruction pops, the fuse burns, 성공! and the score goes up.

**`speed2`**: speed2 (1 bar): 속도 UP! on rushing speed lines, then LEVEL 3.

**`level3`**: level3: games of 1 beat(s) each from game 6 on; the instruction pops, the fuse burns, 성공! and the score goes up.

**`boss`**: boss (30-second cut, 3 bars): 모두 터뜨려! a wall of balloons, one popping on every beat, then the last big one.

**`end`**: end (2 bars, 3 in the 30-second cut): confetti and the logo: 5초면 충분해!, 5초 미션 · 가상의 파티 게임입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL-Galmuri.txt`, `source/fonts/OFL.txt`.
