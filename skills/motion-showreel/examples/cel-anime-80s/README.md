# Example: cel-anime-80s (한강 시티 라이트 1988)

A made-up TV anime goes in (한강 시티 라이트 1988: a summer by the Han river in 1988); an opening-style reel
comes out as if played from a VHS tape. PLAY: an airbrushed dusk over the river and the camera tilts down to a
skyline of lit windows mirrored in the water; on a bridge the heroine looks out at the city, her hair streaming in
the wind, drawn on twos and rim-lit cyan and pink: 그해 여름, 도시는 반짝였다; the chrome title slams in with a
flash, 1988 in pink neon, a lens flare sweeps across. The 30-second cut adds a red convertible on the riverside road,
her eye in close-up with the city in the iris, and fireworks over the river. One of the 24 styles studied from eight
repositories of code-rendered video; only the style is borrowed, and no real anime, song or studio is copied.

- Web version with every cut: [`dist/cel-anime-80s-v1.0.0.html`](dist/cel-anime-80s-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/cel-anime-80s/dist/cel-anime-80s-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 한강 시티 라이트 1988 is fictional. Every cel is drawn by code; the trumpet, tenor sax and glockenspiel are recordings from a CC0 library, and the city-pop band is the engine's new citypop preset.

## Folder

```
cel-anime-80s/
  source/                 4 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/NanumMyeongjo-Bold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    cel.js
  scenes/                 6 file(s)
    drive.js
    end.js
    eye.js
    fireworks.js
    girl.js
    hook.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/cel-anime-80s
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/cel-anime-80s-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/cel-anime-80s.html
```

## How the cels are painted

1. **Cel paint on twos.** `modules/cel.js` paints in two tones with dark ink lines; characters read the time
   through `C.q(t)`, which steps twelve times a second, so hair, the car's bounce and the blink move in drawings
   while the camera and the background pans stay smooth, as cel animation was shot.
2. **Painted backgrounds.** The skyline (buildings, lit windows, blinking red lights) is drawn once into a 2400-pixel
   strip, scrolled for parallax and mirrored into the river in rippling six-pixel strips; skies and glows are
   airbrush gradients; the heroine's hair is one mass with a wavy edge plus ribbon strands from wavy centrelines.
3. **Tape.** Each scene ends with `C.vhs`: the red channel shifted four pixels, scanlines, a jittering tracking
   band, specks and the PLAY display; the music is the new citypop preset (FM electric piano on major sevenths, slap
   bass, cutting guitar, recorded trumpet stabs and tenor sax).

## What the tone pass decided

- **palette.** An airbrushed dusk from night violet #140A33 through dusk #3A1E6B and rose #E8566C to a peach glow #FFB07A; navy buildings with warm #FFD27A and cyan #7FE8FF windows; a red convertible #E8364F; cyan and pink rim light; cel shadows in cool violet.

- **type.** Black Han Sans, heavy and square, for the chrome title and the VHS display; Nanum Myeongjo Bold, a classic serif, for the lines, outlined like subtitles on tape.

- **motion.** Characters on twos (12 drawings a second) against smooth camera moves, as cel animation was shot: hair streams in ribbons, the car bobs, the eye blinks in four drawings; the background pans past the car with a streetlight every beat; fireworks open every two beats; the title slams in with a flash and a flare sweep.

- **sound.** City pop at 112 BPM in F major: an FM electric piano on major sevenths (IVmaj7, V7, iii7, vi7), a slap bass of thumbed roots, popped octaves and ghost notes, a muted cutting guitar on sixteenths, recorded trumpet stabs and a tenor sax hook (VSCO 2 CE, CC0); booms for the fireworks, brass hits for the cards.

- **visuals.** All code: two-tone cel paint with dark ink outlines, airbrush gradients for sky and glows, a skyline of lit windows cached once and mirrored into the river in rippling strips, ribbon hair from wavy centrelines, an anime eye from four Bezier lids with an iris gradient and reflections; a VHS pass shifts the red channel, adds scanlines, a tracking band and specks.

- **narration.** Not recommended: the sax sings.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `girl` | 2 | 2 |
| `drive` | - | 3 |
| `eye` | - | 2 |
| `fireworks` | - | 2 |
| `end` | 3 | 3 |

## Scenes

**`hook`**: hook (2 bars): a VHS tape starts (PLAY): an airbrushed dusk over the river, the moon, and the camera tilts down as the skyline rises with its windows lit and its mirror in the water; a bridge of lamps; 제1화 · 여름의 시작.

**`girl`**: girl (2 bars): on the bridge at night she looks out at the city, her hair streaming in the river wind (drawn on twos), rim-lit cyan and pink by the lights; out-of-focus city lights behind; 그해 여름, 도시는 반짝였다.

**`drive`**: drive (30-second cut, 3 bars): the red convertible runs along the riverside road at night; streetlights sweep past on every beat, the lane marks stream, the skyline drifts across the water; 강변북로, 밤 열한 시.

**`eye`**: eye (30-second cut, 2 bars): her eye, close: the city's lights in the iris, a car's light sweeps across the face, she blinks once (on twos) and a star flashes in the highlight; 너를 처음 만난, 그 여름.

**`fireworks`**: fireworks (30-second cut, 2 bars): summer fireworks over the river, one burst every two beats, mirrored in the water; two friends in silhouette on the bank, rim-lit by each burst; 여름은 짧고, 불꽃은 높았다.

**`end`**: end (3 bars): the title: sun rays turn behind chrome type that slams in with a flash, 1988 in pink neon, a lens flare sweeps across; 그해 여름, 도시는 반짝였다; 한강 시티 라이트 1988 · 가상의 애니메이션입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (trumpet-stac, tenor-sax); some cues are recordings too (real-glock), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
