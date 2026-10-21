# Example: minimal-ui (하루 세 칸)

A made-up habit app's brief goes in (하루 세 칸: only three things to do a day); a minimal-UI reel comes out, in
Korean. A near-white desk, white cards with layered shadows, one blue for every action, and a cursor that uses the
app for real: the icon springs up and its three bars fill a beat apart; on one card the cursor clicks the three
checks on the beat, the rows strike through, the ring steps to 3/3, and only then an iridescent bloom opens behind
the card and confetti bursts; the core line 할 일은 딱 세 칸. closes it. The 30-second cut adds the week as 21 dots,
a streak badge and the one setting the app has. One of the 24 styles from the series after the video
*모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/minimal-ui-v1.0.0.html`](dist/minimal-ui-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/minimal-ui/dist/minimal-ui-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 하루 세 칸 is fictional. Every screen is drawn in code; there is no app behind it.

## Folder

```
minimal-ui/
  source/                 3 file(s)
    BRIEF.md
    fonts/OFL.txt
    fonts/PretendardVariable.woff2
  modules/                1 file(s)
    ui.js
  scenes/                 5 file(s)
    end.js
    hook.js
    message.js
    tasks.js
    week.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/minimal-ui
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/minimal-ui-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/minimal-ui.html
```

## How the UI was drawn

1. **Cards.** `modules/ui.js` draws each card twice under two shadows (a tight one and a wide soft one) with a
   hairline, so it lifts off the desk the way current UIs do.
2. **Use, not decoration.** The cursor follows a list of stops (time, place, click?): it glides with a small arc,
   presses (a slight scale-down) and leaves a ripple; checks fill, tick and strike their row through on the click.
3. **The earned moment.** The bloom is a conic gradient of six pastels blurred by 60 px, turning slowly; it opens
   only at 3/3, with confetti thrown on simple ballistic paths.

## What the tone pass decided

- **palette.** The brief asks for almost nothing: a near-white desk #F4F5F7, white cards, a dark blue-grey ink #1F2430 with #5A6170 and #646B78 for the quiet text, one blue #3B6EF5 for every action, and green #2BB673 only for done. The one exception is earned: an iridescent bloom when the day is complete.

- **type.** Pretendard Variable, as clean UIs set Korean: 800 for titles, 600 for rows, 500 for meta, tight tracking.

- **motion.** Real use, not decoration: springs that settle without wobble, a macOS arrow that glides between targets with a small arc and clicks (a press and a ripple), checks that fill and tick, rows that strike through, a ring that steps; confetti and the bloom only at 3/3. Scenes dissolve.

- **sound.** Bright pop at 128 BPM in E major (8 bars in 15 s, 16 in 30 s), soft; glassy SFX: a click for every click, a confirm at 3/3, sparkles, a tick per dot of the week.

- **visuals.** All code: cards with two layered shadows and a hairline, checks, a progress ring, a toggle, a week of 21 dots, the arrow cursor, the app icon, the bloom (a blurred conic gradient) and confetti.

- **narration.** Not recommended: a quiet product teaser that reads without sound.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `tasks` | 3 | 4 |
| `week` | - | 4 |
| `message` | 2 | 4 |
| `end` | 1 | 2 |

## Scenes

**`hook`**: hook (2 bars): the icon and the name. The app icon springs up in the middle of a near-white desk and its three bars fill a beat apart; 하루 세 칸 and the line that says what it is (할 일은 세 개만 적는 습관 앱) rise under it.

**`tasks`**: tasks (3-4 bars): the day, used for real. One card: 오늘, the date, a progress ring; three rows (물 2L 마시기, 20분 걷기, 책 10쪽 읽기). The cursor glides to each check and clicks on the beat; the row ticks, greys and strikes through, the ring steps 1/3, 2/3, 3/3; on the third an iridescent bloom opens behind the card, confetti bursts and a 오늘 완료 chip slides up. The hold breathes; the ring glints on each bar line.

**`week`**: week (3 bars, 30-s cut): the week as 21 dots that fill day by day, a 연속 12일 streak badge, and the one setting the app has: the cursor flips 저녁 알림 on (알림은 저녁에 한 번만).

**`message`**: message (2 bars): the core line, alone on the desk: 할 일은 / 딱 세 칸. (the second line blue), and under it 많이 말고, 꾸준히.; the bloom glows behind the words on the beat.

**`end`**: end (1-2 bars): the icon again with its bars full, the name, and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
