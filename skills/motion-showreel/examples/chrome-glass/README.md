# Example: chrome-glass (글래스 노트 No.3)

A made-up eau de parfum goes in (글래스 노트 No.3: a thick glass bottle with a chrome cap; bergamot, white tea, musk);
a chrome-and-glass reel comes out, in Korean. In a dark studio a long strip of light finds the bottle; the name
is set in chrome. Then 투명한 향, drifts behind the bottle and the glass bends it like a lens, each colour a little
differently at the edges, and the chrome cap comes down and lands: 단단한 잔향. The 30-second cut adds the three
notes, each a field of colour seen through the glass. One of the 24 styles from the series after the video
*모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/chrome-glass-v1.0.0.html`](dist/chrome-glass-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/chrome-glass/dist/chrome-glass-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 글래스 노트 No.3 is fictional. The bottle is not a picture: it is raymarched in a WebGL2 shader every frame.

## Folder

```
chrome-glass/
  source/                 4 file(s)
    BRIEF.md
    fonts/NanumMyeongjo-Bold.woff2
    fonts/NanumMyeongjo-ExtraBold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    glass.js
  scenes/                 5 file(s)
    clear.js
    end.js
    hook.js
    notes.js
    solid.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/chrome-glass
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/chrome-glass-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/chrome-glass.html
```

## How the glass was made

1. **A raymarched bottle.** `modules/glass.js` holds one WebGL2 fragment shader with signed distance fields: a
   thick, bevelled glass body whose front and back bow out slightly (so it magnifies like a lens), a cavity with a
   champagne liquid and a moving surface, a round chrome cap with two grooves, and a soft reflection on the floor.
2. **Glass that bends the scene.** The 2D layer drawn so far (studio, lines, words) is uploaded as a texture; each
   ray enters the glass, travels to the far side and leaves with one index of refraction per colour channel, then
   reads that texture where it meets a plane behind the bottle. Light held in the liquid and its surface line are
   added on the way.
3. **Chrome.** The studio's softboxes are real rectangles in the room, so a strip of light slides across flat
   faces as it moves; the cap reflects them. The lettering is 2D chrome: an extruded steel edge, a horizon gradient
   and a sheen that passes once.

## What the tone pass decided

- **palette.** A dark studio: near-black navy #090B11 to #121620 so glass and chrome have something to shine against; silver #C9D1DC and white light; a faint iridescence (lilac #B9A7FF, aqua #8FE3E8) in the reflections only; the liquid a pale champagne #F2E3C6. The notes scene adds one soft field of colour per note.

- **type.** Nanum Myeongjo ExtraBold, a Korean serif with fine contrast, set in chrome (an extruded steel edge, a horizon gradient, a passing sheen) for the name and the solid half of the line, and in plain white where the glass has to bend it.

- **motion.** Slow and expensive: the camera drifts and orbits, the bottle turns, a long strip of light sweeps across the glass; the text behind the bottle drifts so the glass bends it as it passes; the chrome cap comes down and lands with weight. Soft blur-in for the small lines.

- **sound.** Ambient at 96 BPM in F lydian (6 bars in 15 s, 12 in 30 s), pad, bell, glass and piano with light drums; glassy SFX: a chime for the name, swells into the notes, a thud when the cap lands.

- **visuals.** All code: one WebGL2 raymarcher (signed distance fields) draws the thick bevelled glass, the champagne liquid with its surface, the octagonal chrome cap and a soft floor reflection; the glass reads the 2D layer behind it through refracted rays, one index of refraction per colour. Lettering and the studio are 2D.

- **narration.** Not recommended: a fragrance film is music and light.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `clear` | 2 | 3 |
| `notes` | - | 3 |
| `solid` | 1 | 2 |
| `end` | 1 | 2 |

## Scenes

**`hook`**: hook (2 bars): the dark studio; a long strip of light sweeps across and finds the bottle turning slowly; on the left, 오 드 퍼퓸, then 글래스 노트 in chrome and No.3.

**`clear`**: clear (2-3 bars): 투명한 향, set large on the backdrop and drifting left behind the bottle, so the thick glass bends it as it passes (each colour a little differently at the edges); the liquid sways; below, 첫 향은 맑게.

**`notes`**: notes (3 bars, 30-s cut): the three notes, one per bar. Behind the turning bottle a field of colour (bergamot, white tea, musk) changes on the bar line and the note's name sits large on the backdrop, bent through the glass; a small label (처음 / 가운데 / 끝) and a thin line count the three.

**`solid`**: solid (1-2 bars): the chrome cap comes down onto the neck and lands with weight (a short settle); the camera is low and close; 단단한 잔향. in chrome, its sheen passing as the cap lands.

**`end`**: end (1-2 bars): the bottle whole, capped, turning under the sweeping strip; 글래스 노트 No.3 in chrome, 오 드 퍼퓸 50ml and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
