# Example: spy-titles (작전명 비단)

A made-up series goes in (작전명 비단: a six-part spy drama set in Seoul in 1966); a 1960s title sequence comes out in
flat cut paper. On orange, black bars sweep in on the diagonal, a cream disc slides into place, a red silk ribbon
unrolls and 작전명 비단 drops in letter by letter; on teal the agent in hat and trench coat walks in while the cast is
set into the panels; match cuts keep one centre as a spotlight becomes an eye and the eye becomes the moon over the
night skyline (1966년 서울, 밤 11시); the end card: 그 밤, 서울에는 비밀이 하나 더 있었다. The 30-second cut adds a
stop-time (two hands, a briefcase, the band cut to silence, then 기밀 stamped) and a chase through diagonal strips.
One of the 24 styles studied from eight repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/spy-titles-v1.0.0.html`](dist/spy-titles-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/spy-titles/dist/spy-titles-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 작전명 비단 is fictional. Every shape is drawn by code; the band plays vibraphone, bass, trumpet and saxophone recorded for two CC0 libraries.

## Folder

```
spy-titles/
  source/                 5 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/GothicA1-Bold.woff2
    fonts/GothicA1-Medium.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    spy.js
  scenes/                 6 file(s)
    agent.js
    chase.js
    end.js
    freeze.js
    hook.js
    match.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/spy-titles
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/spy-titles-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/spy-titles.html
```

## How the paper was cut

1. **Scissor-cut shapes.** `modules/spy.js` subdivides the edges of every polygon and nudges each point sideways by a
   seeded amount, then lays it with a thin offset shadow, so bars, discs, figures and the ribbon look cut and stacked
   on a grainy colour field.
2. **Title-sequence moves.** Bars sweep in on one diagonal with an eased length; letters drop in one by one with a
   little spin; match cuts keep the centre and the size while the shape changes; strips open one after another.
3. **Stop-time.** A new `hush` cue in `audio/arrange.py` cuts the music bus to digital silence for its length (the
   verifier treats it as a control cue); the picture freezes on the same beat and the stamp lands after the silence.
   Brass stabs are `note` cues on the recorded trumpet, in key, on the hits.

## What the tone pass decided

- **palette.** A 1960s title sequence in flat cut paper: orange #E2702A, teal #1E6C74, cream #EEE4CF, ink #151311 and mustard #E2B13A as fields and shapes, and one red #C81E2C kept for the silk ribbon, the hat band, the eye and the stamp.

- **type.** Black Han Sans, heavy and condensed like cut letters, dropped in one by one for the title and the names; Gothic A1 Bold for roles and small lines.

- **motion.** Title-sequence grammar: diagonal bars sweep in on the beat, shapes slide and snap into place, match cuts keep one centre while the shape changes (a spotlight, an eye, the moon), panels open as strips, and one stop-time where everything freezes with the music before a stamp lands.

- **sound.** Swing at 128 BPM in D minor as a spy band on recorded instruments (VCSL and VSCO 2 CE, CC0): vibraphone comping, a pizzicato walking bass, a trumpet hook, tenor saxophone and trumpet stabs in key on the hits, ride and brushes; a hush cue cuts the band to silence for the freeze.

- **visuals.** All code: every shape is a polygon with subdivided, nudged edges and a thin offset shadow, like paper cut with scissors and stacked; an agent figure on a walk cycle, an almond eye, a skyline of tiled roofs and blocks, a ribbon swept along a curve with a twisting width.

- **narration.** Not recommended: the band carries it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `agent` | 2 | 3 |
| `match` | 2 | 3 |
| `freeze` | - | 2 |
| `chase` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): an orange field. Three black bars sweep in on the diagonal one per beat, a cream disc slides into place, a red silk ribbon unrolls across it, and 작전명 비단 drops in letter by letter; 6부작 첩보 드라마 above.

**`agent`**: agent (2 bars; 3 in the 30-second cut): a teal field cut by one diagonal. The agent in hat and trench coat walks in along it, a long shadow behind; the cast comes up in the empty panels one per beat: 주연 · 요원 K, 비단 장수, 그림자.

**`match`**: match (2 bars; 3 in the 30-second cut): match cuts on one centre. A cream spotlight on black becomes an eye that looks about, which becomes the moon over a night skyline of tiled roofs and boxy buildings on teal; 1966년 서울, 밤 11시.

**`freeze`**: freeze (30-second cut, 2 bars): two hands reach for a briefcase from either side; on the third beat everything stops dead with the music (stop-time), and after the silence 기밀 is stamped across it; 멈춘 그 순간.

**`chase`**: chase (30-second cut, 3 bars): the frame splits into diagonal strips in the four colours; silhouettes run through them at different speeds, a car's headlights sweep one strip; the crew credit 제작 · 가상 스튜디오 1966 rides a strip.

**`end`**: end (2 bars; 3 in the 30-second cut): back on orange: the bars, the cream disc with the agent's silhouette in it, the ribbon, 작전명 비단 dropping in again; 그 밤, 서울에는 비밀이 하나 더 있었다 and 6부작 · 가상의 드라마입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (vibraphone, bass-pizz, trumpet); some cues are recordings too (real-glock, trumpet-stac), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
