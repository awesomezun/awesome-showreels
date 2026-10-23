# Example: synthwave (네온 하이웨이 1986)

A made-up game goes in (네온 하이웨이 1986: an arcade racing game from a 1980s that never was); a synthwave reel
comes out, played from a videotape. A CRT line opens into a violet sky, a striped sun rises over wireframe mountains,
the magenta grid rushes in and 네온 하이웨이 slams down in chrome with a cyan neon 1986; on the road the red car's tail
lights glow while palms flick past and the speed counts to 260 km/h: 밤은 길고, 도로는 끝이 없다; at the end the tape
stops and the CRT folds to a line. The 30-second cut adds the neon city and a blue rival passing close, the tape
tearing as it goes by. One of the 24 styles studied from eight repositories of code-rendered video; only the style is
borrowed.

- Web version with every cut: [`dist/synthwave-v1.0.0.html`](dist/synthwave-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/synthwave/dist/synthwave-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 네온 하이웨이 1986 is fictional. Every frame is drawn by code and the music is synthesized (a new synthwave preset).

## Folder

```
synthwave/
  source/                 4 file(s)
    BRIEF.md
    fonts/Gugi-Regular.woff2
    fonts/OFL.txt
    fonts/Orbit-Regular.woff2
  modules/                1 file(s)
    outrun.js
  scenes/                 5 file(s)
    city.js
    drive.js
    end.js
    hook.js
    rival.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/synthwave
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/synthwave-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/synthwave.html
```

## How the tape was made

1. **The outrun world.** `modules/outrun.js` draws a violet sky burning pink at the horizon, a sun clipped into bands
   that thicken toward the horizon and slide down, wireframe mountains, and a perspective grid whose rows scroll in
   1/z with a road and dashes; palms scale by depth and the car is drawn from behind with glowing tail lights.
2. **Chrome and neon.** Chrome type is a sky-to-ground gradient with a dark horizon line and a magenta outline, built
   in its own buffer so a sheen can sweep across the letters only; neon is a glowing stroke with a white core that
   flickers.
3. **VHS over everything.** A ghost copy, a tracking band and tears copied sideways out of the frame itself,
   scanlines, the PLAY sign and a counter; a CRT that opens from a line and folds back to one. The music is a new
   `synthwave` preset with a gated-reverb snare.

## What the tone pass decided

- **palette.** Outrun at night: a violet sky #0E0420 to #2D0B4E burning pink #FF4F9A at the horizon, a sun from yellow #FFE45C to magenta #FF2E88, a magenta grid #FF3CC8, cyan neon #3CF0FF, a red car #E8203C; chrome is a sky-to-ground gradient with a dark horizon line.

- **type.** Gugi, a heavy rounded display face, for the chrome title and the neon lines; Orbit, a geometric face, for the speed, the OSD and the small print.

- **motion.** Speed and tape: the grid and the road dashes rush at the camera in perspective, palms flick past, the car banks; the title slams down with a shake and a sheen; neon flickers; a VHS tracking band tears the picture sideways, the tape tears hard as the rival passes, and the reel ends with the CRT folding to a line.

- **sound.** A new synthwave preset at 96 BPM in A minor: a detuned poly pad, a running saw bass on eighths, bright sixteenth saw arpeggios, offbeat stabs, a saw lead, kick on every beat and a gated-reverb snare on two and four, toms for fills; whooshes for the passes, an impact for the title, a glitch for the tear.

- **visuals.** All code: a sun clipped into bands that thicken toward the horizon, wireframe mountains, a perspective grid whose rows scroll by 1/z, a road with dashes, palm silhouettes scaled by depth, a car drawn from behind, chrome and neon type, a VHS pass (a ghost, a tracking band and tears copied sideways from the frame, scanlines, PLAY and a counter).

- **narration.** Not recommended: the engine is the voice.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `drive` | 2 | 3 |
| `city` | - | 2 |
| `rival` | - | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the tape starts: a CRT line opens into the picture and PLAY blinks. A striped sun rises over wireframe mountains, the magenta grid rushes in; 1986 아케이드 레이싱, then 네온 하이웨이 slams down in chrome on the fifth beat with a sheen, and a cyan neon 1986 flickers on.

**`drive`**: drive (2 bars; 3 in the 30-second cut): on the road. The car from behind, tail lights glowing, banking a little; the grid and the road dashes rush at it, palms flick past on both sides; the speed counts to 260 km/h; 밤은 길고, / 도로는 끝이 없다 in neon.

**`city`**: city (30-second cut, 2 bars): the road runs through a neon city: building silhouettes slide past with lit window grids and glowing signs, the sun sinking behind them; 네온 시티를 지나, 8개 코스.

**`rival`**: rival (30-second cut, 2 bars): a blue rival pulls up from behind on the left and passes, close; the tape tears for a moment as it goes by; 라이벌 12대.

**`end`**: end (2 bars; 3 in the 30-second cut): the sun on the horizon, the grid running on; the chrome 네온 하이웨이 with a sheen and the neon 1986; 밤은 길고, 도로는 끝이 없다 and 1986 아케이드 레이싱 · 가상의 게임입니다; on the last beat the tape stops and the CRT folds to a line.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
