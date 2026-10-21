# Example: whiteboard (피싱 메일 3초 판별법)

A made-up company's security-training brief goes in (피싱 메일 3초 판별법: check three things before clicking a link);
a whiteboard animation comes out, in Korean. One long board, a camera that travels between its panels, and a hand
holding a black marker that draws every line and writes every word at hand speed, moving from stroke to stroke,
coming into the frame and leaving it. An envelope caught on a fishing hook and the title; the three checks (the
sender, the link, the rush), one column at a time, then all three; a stopwatch that ticks three seconds beside the
line 링크 누르기 전, 3초만. The 30-second cut adds a phishing mail with its tricks circled in red and what to do
instead. Different from `sketchnote` (colour visual notes): this is the classic hand-and-camera explainer. One of
the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/whiteboard-v1.0.0.html`](dist/whiteboard-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/whiteboard/dist/whiteboard-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 한결상사 and its addresses are fictional. The board, the drawings and the hand are code.

## Folder

```
whiteboard/
  source/                 3 file(s)
    BRIEF.md
    fonts/NanumPenScript-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    wb.js
  scenes/                 5 file(s)
    checks.js
    example.js
    hook.js
    message.js
    report.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/whiteboard
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/whiteboard-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/whiteboard.html
```

## How the board was drawn

1. **Panels on one board.** `modules/wb.js` holds five panels in world coordinates (title, checks, example, report,
   message), each a list of timed tasks: marker strokes along point lists, hatching, and handwriting revealed left
   to right. A scene draws the panels of its cut that came before it, finished, and its own at its local time.
2. **The hand.** Each task knows where it starts and ends, so `K.run` puts the marker tip on the stroke being drawn,
   carries the hand from the end of one task to the start of the next (with a small lift), and walks it in and out
   of the frame. The hand is flat vector: palm, wrapped fingers, thumb, a navy cuff, the marker.
3. **The camera.** It flies from the previous scene's panel with a small zoom dip, follows the three columns of the
   checks and pulls back to show all of them.

## What the tone pass decided

- **palette.** A whiteboard and four markers, as the brief says: board #FBFBF8, black #1E1F22 for most lines and words, red #D9392B for danger (the hook, the @, the circled tricks, 3초만), blue #2563C9 for checking, green #2E9E5B for safe (the shield, 보안팀으로 전달).

- **type.** Nanum Pen Script, a Korean marker hand, 46-240 px, revealed left to right as if written, with the marker tip riding the edge.

- **motion.** A whiteboard animation: one long board, a camera that travels between panels (dipping out a little as it goes), a hand holding a marker that draws every line at hand speed, moves to the next stroke, enters and leaves the frame; on the checks panel the camera follows each column and pulls back to show all three.

- **sound.** Corporate at 112 BPM in C major (7 bars in 15 s, 14 in 30 s): strings and a broken piano figure, a light kit; minimal SFX: a drawon for each drawing, a swish for each camera move, a tick for each second of the stopwatch.

- **visuals.** All code: the board with ghosts of erased marker, marker strokes and hatching, an envelope, a fishing hook, a chain link and magnifier, a clock, a phishing mail window, a shield, a stopwatch, and the hand (palm, fingers, thumb, cuff) holding the marker.

- **narration.** Not recommended here: the reel is muted-first; a training version could add a voice.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `checks` | 3 | 4 |
| `example` | - | 3 |
| `report` | - | 2 |
| `message` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the name, by hand. The hand draws an envelope and a fishing hook through its flap, then writes 사내 보안 교육, 피싱 메일 and 3초 판별법 (red) and underlines it; the camera eases in a little.

**`checks`**: checks (3-4 bars): the three checks, one column at a time: a circled number, a marker icon (an envelope with a red @, a chain link under a magnifier, a clock with an exclamation mark), the label and the hint; the camera travels in from the title, follows each column and pulls back to show all three.

**`example`**: example (3 bars, 30-s cut): a phishing mail drawn as a window: the sender line, the urgent subject, a blue button; red loops ring the 0 in hangye0l and the 24-hour deadline, an arrow points from the button to its real address.

**`report`**: report (2 bars, 30-s cut): what to do: 의심되면 누르지 말고, an envelope, a green arrow to a shield with a tick, 보안팀으로 전달 and the (fictional) security address.

**`message`**: message (2-3 bars): the core line: a stopwatch is drawn and its hand ticks three seconds; 링크 누르기 전, and a big red 3초만.; the fiction label underneath.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
