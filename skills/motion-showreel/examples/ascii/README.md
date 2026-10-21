# Example: ascii (글자판 termpan)

A made-up terminal dashboard goes in (글자판, termpan: server state in a terminal, every graph, table and logo
drawn in characters, installed with one line); an ASCII reel comes out, in Korean. A prompt, a blinking cursor,
`termpan` typed and run, and the name 글자판 assembles out of flying characters; then `termpan draw donut`: hundreds
of characters fly in and land as the shaded donut, which spins: 글자가 모이면 / 그림이 돼요. The 30-second cut adds
the dashboard itself (CPU, memory, network, processes) and a one-line install. One of the 24 styles from the series
after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/ascii-v1.0.0.html`](dist/ascii-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/ascii/dist/ascii-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> termpan is fictional. Every picture in it is characters on one grid.

## Folder

```
ascii/
  source/                 3 file(s)
    BRIEF.md
    fonts/NanumGothicCoding-Bold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    tty.js
  scenes/                 5 file(s)
    dash.js
    end.js
    hook.js
    image.js
    install.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/ascii
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/ascii-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/ascii.html
```

## How the characters were made

1. **One grid.** `modules/tty.js` keeps a buffer of cells on a 20 x 44 grid and draws it with Nanum Gothic
   Coding Bold at 40 px, where Latin takes one cell and Hangul two. The font's box-drawing glyphs are full width and
   it has no block elements, so box outlines, bars and sparklines are drawn as strokes and fills fitted to the cells.
2. **Pictures from characters.** Big letters are the text rendered small off screen and sampled per cell, each
   cell given a character from a ramp by how much ink covers it; the donut is computed into the grid the way
   donut.c does it, with the cell's character chosen by the light on the torus and a depth buffer.
3. **Characters that land.** Each target cell's character starts somewhere on the screen and eases onto its cell,
   scrambling until it lands; typing reveals text at a typist's pace behind a block cursor.

## What the tone pass decided

- **palette.** A Tokyo Night-like terminal: background #14151F, text #C0CAF5, dim #565F89 for prompts and comments, and five accents by role: cyan #7DCFFF, blue #7AA2F7, magenta #BB9AF7, green #9ECE6A (prompt, memory, success), yellow #E0AF68 (the message), red #F7768E (shading).

- **type.** Nanum Gothic Coding Bold at 40 px only, on a 20 x 44 grid where Latin takes one cell and Hangul two; big letters are made of characters chosen by coverage, never of a bigger font.

- **motion.** Terminal motion: typing at a typist's pace with a block cursor, characters flying in from anywhere to land on their cells (scrambling until they land), the donut spinning, sparklines scrolling, process lists ticking, boxes drawing in one after another.

- **sound.** Chiptune at 128 BPM in G major (8 bars in 15 s, 16 in 30 s), pulse arps, triangle bass, noise drums; keystrokes for typing, blips for landings, a confirm on install.

- **visuals.** All code: a cell buffer rendered with one font, box outlines and block bars drawn to the grid (the font has no half-width box glyphs), text rasterised into cells by coverage, the donut from donut.c computed into the grid, live sparklines.

- **narration.** Not recommended: the terminal speaks in text.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `image` | 4 | 5 |
| `dash` | - | 4 |
| `install` | - | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): a prompt, a blinking cursor; termpan is typed and run; the name 글자판 assembles out of flying characters, each landing on its cell with a character chosen by how much of the letter covers it; the tagline types.

**`image`**: image (4-5 bars): the core message, shown. termpan draw: a thousand characters fly in from everywhere and land as the shaded donut (each cell's character set by the light on the torus), which then spins; on the right, 글자가 모이면 / 그림이 돼요 and a count of the characters.

**`dash`**: dash (4 bars, 30-s cut): the dashboard. Boxes draw in one after another (CPU with a live sparkline, memory as a bar of blocks, network up and down, a process list that scrolls), all on the same grid of characters; 서버 상태도 한눈에.

**`install`**: install (2 bars, 30-s cut): brew install termpan is typed; a progress bar of blocks fills; [완료]; 설치는 한 줄.

**`end`**: end (2-3 bars): the name again in characters, the install line, the fiction label; a small donut keeps turning in the corner.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
