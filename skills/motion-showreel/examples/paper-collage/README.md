# Example: paper-collage (종이비행 페스티벌 2026)

A made-up indie music festival's brief goes in (종이비행 페스티벌 2026: three days, one stage, every poster cut from
paper); a cut-paper collage reel comes out, in Korean. The board is newsprint under trembling scraps; every piece
has a torn edge, a white cut border and a shadow, and slaps down on the beat. The name lands in ransom letters, a
letter per half beat, each on its own chip in one of four faces; a skyline of paper strips rises under the band
names; the core line 올여름, 오려 붙인 사흘 fills the board with an eye, a sun, a star and a flower around it; the end
is the poster. The 30-second cut adds a paper stage with a halftone crowd and a stamped ticket. One of the 24
styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/paper-collage-v1.0.0.html`](dist/paper-collage-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/paper-collage/dist/paper-collage-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 종이비행 페스티벌 is fictional, and so are its bands, place and dates. Everything is cut paper drawn in code.

## Folder

```
paper-collage/
  source/                 6 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/DoHyeon-Regular.woff2
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
    fonts/SongMyung-Regular.woff2
  modules/                1 file(s)
    collage.js
  scenes/                 6 file(s)
    crowd.js
    end.js
    hook.js
    lineup.js
    message.js
    ticket.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/paper-collage
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/paper-collage-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/paper-collage.html
```

## How the paper was cut

1. **A piece.** `modules/collage.js` builds a torn outline by jittering points along each edge, fills it (flat
   colour, or halftone dots, stripes or printed text as a pattern), strokes a white cut border and lays a blurred
   shadow under it.
2. **Ransom letters.** Each letter gets its own chip, face (Black Han Sans, Do Hyeon, Song Myung, Jua), colour pair,
   size and tilt from a hash of its index, so a word looks cut from four magazines and stays the same every frame.
3. **Moved by hand.** Positions are quantized to twos (12 fps) and every piece slaps down (scale 1.35 to 1, a
   back-out settle, the shadow landing); background scraps tremble a pixel on twos so a held board stays alive.

## What the tone pass decided

- **palette.** The brief: newsprint board #EFE9DC and black ink #1E1B1A, with red #E8402E, cobalt #2F55D4, yellow #F7C531, pink #F49AC1, green #37A169 and kraft #C9A57B paper. Every piece keeps a white cut border so the colours never touch.

- **type.** Ransom letters: each Korean letter on its own torn chip in one of four faces (Black Han Sans, Do Hyeon, Song Myung, Jua) and its own colour pair, as if cut from four magazines; plain lines sit on torn strips in Do Hyeon.

- **motion.** Paper moved by hand and photographed: every move is held on twos (12 fps), pieces slap down on the beat (scale 1.35 to 1 with a small back-out settle, the shadow lands), a paper plane crosses the board; new posters push in from the side.

- **sound.** Bright pop at 128 BPM in G major (8 bars in 15 s, 16 in 30 s) with guitar, claps and bells; organic SFX: a pop for every slapped piece, a swish for each push, a thud for the stamp.

- **visuals.** All code: torn outlines, white borders, drop shadows, halftone, stripe and printed-text fills, tape, ransom letters, a skyline of paper strips, a halftone crowd, a ticket stub. No images.

- **narration.** Not recommended: a loud, music-led poster reel.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `lineup` | 2 | 3 |
| `crowd` | - | 3 |
| `message` | 2 | 3 |
| `ticket` | - | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the name in ransom letters. A kicker strip (독립 음악 축제) is taped up, 종이비행 slaps down a letter per half beat, each on its own chip in its own face and colour, then a torn strip says 페스티벌 2026; a paper plane crosses on twos, a star and a flower land on the beat.

**`lineup`**: lineup (2-3 bars): who plays. A skyline of paper strips (newsprint, dots, stripes, kraft) slaps up from the bottom a building per beat; the band names land on torn strips one per beat, then 외 20팀.

**`crowd`**: crowd (2-3 bars, 30-s cut): the stage. Two speaker stacks and a stage edge cut from black paper; a crowd of halftone heads and raised hands slaps up row by row; strips count it: 사흘 · 24팀 · 한 무대.

**`message`**: message (2-3 bars): the core line, louder than everything: 올여름, / 오려 붙인 / 사흘 in ransom letters, a letter per eighth; around it an eye, a mouth-red sun, a star and a flower slap down on the beats; the plane comes back.

**`ticket`**: ticket (2 bars, 30-s cut): a ticket stub cut from kraft paper slaps down with its perforated edge; a red stamp thuds onto it on beat 3: 7월 1일 오픈.

**`end`**: end (2-3 bars): the poster. 종이비행 in ransom letters at the top, the dates big on a red strip, the place, the ticket line; the plane lands, taped; the fiction label on a scrap.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
