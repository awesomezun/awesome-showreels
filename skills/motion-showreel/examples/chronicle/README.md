# Example: chronicle (소리상회 100년)

A made-up music shop goes in (소리상회: a hundred years on the same corner, 1925 to 2025); a chronicle reel comes
out. A spotlight on dark wood: 소리상회, 1925 — 2025, 백 년 동안,; then the same shopfront five times, once per era:
sepia film and a gramophone, a hand-tinted print with a radio and a trumpet, warm 1970s colour with marquee bulbs,
guitars and LPs, a pink neon sign at night over a synthesizer and a CD, and clean daylight with headphones, an app
and still a guitar; the year rolls up like an odometer, the tree beside the shop grows; the five signs in a row:
백 년 동안, 음악을 팔았습니다. The 30-second cut gives every era two bars. One of the 24 styles studied from eight
repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/chronicle-v1.0.0.html`](dist/chronicle-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/chronicle/dist/chronicle-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 소리상회 is fictional. Every era is drawn by code; the upright piano, trumpet, kalimba and glockenspiel are recordings from CC0 libraries.

## Folder

```
chronicle/
  source/                 7 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/DoHyeon-Regular.woff2
    fonts/OFL.txt
    fonts/PretendardVariable.woff2
    fonts/SongMyung-Regular.woff2
    fonts/YeonSung-Regular.woff2
  modules/                1 file(s)
    era.js
  scenes/                 7 file(s)
    e1925.js
    e1955.js
    e1975.js
    e1995.js
    e2025.js
    end.js
    hook.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/chronicle
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/chronicle-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/chronicle.html
```

## How one shop becomes five

1. **One drawing, five sets of parameters.** `modules/era.js` draws the shopfront once with the era's sign shape and
   face, awning, wall courses, colours and window display (a gramophone, a radio and trumpet, guitars and LPs, a
   synthesizer, CD and cassettes, headphones and a tablet), and grows the tree beside it.
2. **Five surfaces.** Over each frame goes the era's picture surface: grain, scratches, flicker and an iris for 1925;
   halftone for 1955; a light leak for 1975; scanlines and a neon-lit street for 1995; nothing for 2025.
3. **One tempo, five riffs.** The reel stays at 112 BPM over a quiet bed; each era plays its own recorded riff on the
   beat (ragtime upright piano, trumpet stabs, strummed guitar, a glassy synth, kalimba), so the eras change by
   instrument rather than by tempo; the year rolls from the last era like an odometer.

## What the tone pass decided

- **palette.** One palette per era on one dark-wood frame #1E160E: 1925 sepia browns, 1955 hand-tinted teal and tomato on cream, 1975 burnt orange and brown with bulb yellow, 1995 night violet with a pink neon #FF4FC3, 2025 off-white with ink #1E2A36 and green #2E7D6A.

- **type.** One face per era through the five font roles: Song Myung (1925, and the frame), Yeon Sung (1955), Do Hyeon (1975), Black Han Sans (1995), Pretendard (2025 and the small print).

- **motion.** The same shopfront in the same place five times: the camera eases in, the year rolls up from the last era like an odometer, the window comes alive in its own way (a record turning under a horn, a radio needle and waves, marquee bulbs chasing and LPs spinning, a neon sign flickering on and a CD sheen, a waveform on a tablet); the tree beside the shop grows from era to era.

- **sound.** One tempo, 112 BPM in C major, under a quiet bed (pad, pluck, bass, light drums); each era brings its own recorded riff on the beat (VCSL and VSCO 2 CE, CC0): ragtime upright piano, trumpet stabs, strummed guitar, a glassy synth, a kalimba.

- **visuals.** All code: the shop is one drawing with per-era parameters (sign shape and face, awning, wall courses, window display) and per-era surfaces drawn over the frame (film grain, scratches, flicker and an iris; halftone; a light leak; scanlines and a neon street).

- **narration.** Possible: a line per era, but the years carry it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 1 | 2 |
| `e1925` | 1 | 2 |
| `e1955` | 1 | 2 |
| `e1975` | 1 | 2 |
| `e1995` | 1 | 2 |
| `e2025` | 1 | 2 |
| `end` | 1 | 2 |

## Scenes

**`hook`**: hook (1 bar, 2 in the 30-second cut): a warm spotlight on dark wood: 소리상회, 1925 — 2025; 백 년 동안,

**`e1925`**: e1925 (1 bar, 2 in the 30-second cut): the shop in 1925: its sign, its window, its picture surface; the year rolls up from 1900.

**`e1955`**: e1955 (1 bar, 2 in the 30-second cut): the shop in 1955: its sign, its window, its picture surface; the year rolls up from 1925.

**`e1975`**: e1975 (1 bar, 2 in the 30-second cut): the shop in 1975: its sign, its window, its picture surface; the year rolls up from 1955.

**`e1995`**: e1995 (1 bar, 2 in the 30-second cut): the shop in 1995: its sign, its window, its picture surface; the year rolls up from 1975.

**`e2025`**: e2025 (1 bar, 2 in the 30-second cut): the shop in 2025: its sign, its window, its picture surface; the year rolls up from 1995.

**`end`**: end (1 bar, 2 in the 30-second cut): the five signs in a row, each in its era's face and colours, popping in one by one; 백 년 동안, 음악을 팔았습니다; 소리상회 · 가상의 악기점입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: some cues are recordings too (kalimba, real-glock, trumpet-stac, upright-piano), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
