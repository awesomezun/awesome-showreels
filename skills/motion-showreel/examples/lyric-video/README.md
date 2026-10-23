# Example: lyric-video (파란 버스)

A made-up song goes in (「파란 버스」 by the band 여름잠, with lyrics written for this example); a lyric video
comes out, and the engine sings it. A blue city bus to 여름 drives along a summer coast, bouncing on the beat with the
band in its windows; every syllable pops and turns yellow on the note that sings it: 파란 버스를 타고 / 여름으로
가요; the last line is held as the bus drives off: 파란 버스, 여름으로. The 30-second cut adds the window sliding
open inside the bus, the route map with the stop board (다음 정류장은 여름입니다) and the chorus under confetti.
One of the 24 styles studied from eight repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/lyric-video-v1.0.0.html`](dist/lyric-video-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/lyric-video/dist/lyric-video-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 여름잠 and 「파란 버스」 are fictional, and the lyrics were written for this example. The voice is the engine's formant voice; the glockenspiel is a recording from a CC0 library.

## Folder

```
lyric-video/
  source/                 4 file(s)
    BRIEF.md
    fonts/GowunDodum-Regular.woff2
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    bus.js
  scenes/                 6 file(s)
    bridge.js
    chorus.js
    end.js
    hook.js
    verse1.js
    verse2.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/lyric-video
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/lyric-video-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/lyric-video.html
```

## How the song is sung and shown

1. **One cue per syllable.** The spec writes the melody as `sing:파 deg=4 oct=4 dur=0.46b` cues, one per
   syllable, on eighth notes; the engine's `sing` voice splits each Hangul syllable into its initial, vowel and final,
   sings the vowel through four formants with a scoop and vibrato, leads in with the consonant just ahead of the beat
   and closes with a hum, an l or a stop.
2. **Letters from the same list.** `modules/bus.js` reads the sing cues from `env.cues`, matches them to the
   letters of the scene's lines in order, and pops each letter (a springy scale and lift, white to yellow) at its
   cue, with the next line waiting small below; so the words and the voice cannot drift apart.
3. **The ride.** A flat summer coast in parallax (clouds, sea sparkles, pines, road marks), a bus that bounces on
   every beat and jumps in the chorus, a window view clipped to its frame with a curtain in the wind, and a route
   map with a dotted line and the stop board.

## What the tone pass decided

- **palette.** Sky blue #6EC3F0 to a pale #D3F0FF, the sea #2F8FD8, a blue bus #2E6BE6 with a white band, a yellow sun #FFD84D, pines #2F7D4A, sand and a grey road; lyrics white with a navy outline #173A7A, filled yellow #FFE15C as they are sung.

- **type.** Jua, round and friendly, for the lyrics and the title; Gowun Dodum for the band name and the small print.

- **motion.** The words are the motion: every syllable pops (a springy scale and lift) and turns yellow on the note that sings it, the next line waits small below; the bus bounces on every beat with the band bobbing in its windows, jumps every second beat in the chorus under confetti; a window slides open and the curtain catches the wind; the route map runs the bus to the last stop.

- **sound.** Bright pop at 112 BPM in A major (pad, pluck, bass, kick, clap, hats, shaker) with no lead, because the lead is the voice: the engine sings every syllable from its own cue with a formant voice (a Hangul syllable split into consonant, vowel and final; the vowel lands on the beat, the consonant leads in); a bell for the bus stop.

- **visuals.** All code: flat summer illustration with parallax (clouds, sea sparkles, pines, road marks), a bus drawn from rounded rectangles, a window view clipped to the frame, a dotted route on a top-down coast; the lyric layout reads the sing cues, so the letters and the voice share one list.

- **narration.** Not applicable: the reel is sung.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `verse1` | 2 | 2 |
| `verse2` | - | 2 |
| `bridge` | - | 2 |
| `chorus` | - | 4 |
| `end` | 3 | 2 |

## Scenes

**`hook`**: hook (2 bars): a summer coast; the blue bus to 여름 drives in from the left and settles in the middle, bouncing on the beat with the band in its windows; the title: 여름잠, 「파란 버스」.

**`verse1`**: verse1 (2 bars): the bus runs along the coast road, the sea and pines streaming past; the first two lines, each syllable popping yellow as it is sung: 파란 버스를 타고 / 여름으로 가요.

**`verse2`**: verse2 (30-second cut, 2 bars): inside the bus by the window; the window slides open, the curtain catches the wind and the coast streams past: 창문을 열면 / 바다 냄새가 나.

**`bridge`**: bridge (30-second cut, 2 bars): the route map, the bus icon running along the dotted coast line towards the last stop; the bell, and the destination board: 다음 정류장은 여름입니다.

**`chorus`**: chorus (30-second cut, 4 bars): the bus jumps on every second beat with confetti, the sun turning behind; the chorus: 파란 버스, 파란 하늘 / 우리 노래 싣고 가요 / 파란 버스, 파란 하늘 / 여름잠에서 깨어나.

**`end`**: end (2 bars, 3 in the 15-second cut): the last line, held: 파란 버스, 여름으로; then the bus drives off to the right and the card: 여름잠 「파란 버스」 · 가상의 밴드와 노래입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: some cues are recordings too (real-glock), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
