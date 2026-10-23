# Example: shape-morph (한 점 플래너)

A made-up app goes in (한 점 플래너: a day planner that starts from a single dot); a shape-morph reel comes out in
which one shape never cuts. An ink dot breathes on warm paper (한 점 플래너); it springs into a coral button (오늘 할 일
+) that is pressed, folds into a checkbox that ticks itself, opens into a calendar card with today in coral, and
springs back into the dot: 하나의 모양, 모든 순간. The words leave on the last beat, so the last frame is the first
and the reel loops. The 30-second cut adds a loader ring, a switch and a bar chart counting to 87%. Every change of
shape lands a marimba note a step higher. One of the 24 styles studied from eight repositories of code-rendered
video; only the style is borrowed.

- Web version with every cut: [`dist/shape-morph-v1.0.0.html`](dist/shape-morph-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/shape-morph/dist/shape-morph-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 한 점 플래너 is fictional. The shape is drawn by code; the marimba is a recording from a CC0 library.

## Folder

```
shape-morph/
  source/                 3 file(s)
    BRIEF.md
    fonts/OFL.txt
    fonts/PretendardVariable.woff2
  modules/                1 file(s)
    morph.js
  scenes/                 8 file(s)
    button.js
    calendar.js
    chart.js
    check.js
    end.js
    hook.js
    loader.js
    toggle.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/shape-morph
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/shape-morph-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/shape-morph.html
```

## How the shape was morphed

1. **One outline, many states.** `modules/morph.js` describes every state (a dot, a pill button, a checkbox, a loader
   ring with a gap, a switch, a calendar card, five bars on one base, a speech bubble) as an outline resampled to 240
   points with one winding.
2. **Least travel, then a spring.** Each scene starts from the previous scene's state in that cut; the target outline
   is shifted round its points to the alignment that moves them least, and the points are carried by a damped
   spring with overshoot, so the shape stretches past its target and settles; the colour crossfades with it and
   motion blur samples the fast moves.
3. **A loop.** The last scene springs back to the dot and fades its words out on the final beat, so the final frame
   equals the first.

## What the tone pass decided

- **palette.** One shape on warm paper #F5F3EE: ink #16161A and one coral #FF5A3C, swapped as the shape changes role; warm grey #8A867E for small text.

- **type.** Pretendard ExtraBold for labels and the line, set under the shape so it stays the hero; white inside the shape where it is a button.

- **motion.** One shape that never cuts: each scene springs it from the previous state (a dot, a pill button, a checkbox, a loader ring, a switch, a calendar card, a bar chart) with overshoot, so it stretches past its target and settles; secondary details (a press, a check drawing on, a knob, dates, a counter) land on the beat; the last frame is the first, so the reel loops.

- **sound.** Bright pop at 128 BPM in C major with a recorded marimba (VCSL, CC0) on the arpeggios and as Mickey-mousing: every change of shape lands a marimba note one scale step higher than the last.

- **visuals.** All code: every state is an outline resampled to 240 points with one winding; the next outline is cyclically shifted to the alignment that moves points least, then interpolated with a damped spring; motion blur samples the fast springs.

- **narration.** Not recommended: the shape carries it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 1 | 2 |
| `button` | 2 | 2 |
| `check` | 2 | 2 |
| `loader` | - | 2 |
| `toggle` | - | 2 |
| `calendar` | 1 | 2 |
| `chart` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (1 bar; 2 in the 30-second cut): a single ink dot on warm paper, breathing on the beat; 한 점 플래너 and 하루 일정 앱 come in under it. The reel's first frame is the dot alone, and so is its last, so it loops.

**`button`**: button (2 bars): the dot springs out into a coral pill button, overshooting and settling; 오늘 할 일 + appears in it; on the next bar it is pressed (a squash and a ring); under it 할 일은 버튼 하나로.

**`check`**: check (2 bars): the pill folds into an ink checkbox; a white check mark draws itself inside it, the box gives a little bounce; 체크하면 끝.

**`loader`**: loader (30-second cut, 2 bars): the box opens into a coral ring with a gap and spins as a loader, slowing on each beat; 자동 동기화.

**`toggle`**: toggle (30-second cut, 2 bars): the ring closes into an ink switch with a white knob; on the third beat the knob slides across and the switch turns coral; 알림 켜기.

**`calendar`**: calendar (1 bar; 2 in the 30-second cut): the shape opens into a large ink card; a week grid of dates fades in row by row and today pops as a coral dot; 한 주가 한눈에.

**`chart`**: chart (30-second cut, 2 bars): the card drops into five coral bars standing on one line; 87% counts up over them; 이번 주 달성률.

**`end`**: end (2 bars): everything springs back into the ink dot; 하나의 모양, 모든 순간, then 한 점 플래너 · 가상의 앱입니다; the words leave on the last beat so the final frame is the first: the dot alone.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (real-marimba), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
