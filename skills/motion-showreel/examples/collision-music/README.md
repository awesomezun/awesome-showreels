# Example: collision-music (통통 악기 놀이)

A made-up music app goes in (통통 악기 놀이: drop a ball and the bars it hits play a tune); a toy-like reel comes out
in which every bounce is a note. A pink marble drops on the top bar and bounces down a rainbow slope one bar per beat,
a scale climbing from C to C; two marbles half a beat apart make an arpeggio in eighth notes; three land at once for
a chord: 떨어지는 모든 것이 노래가 돼요. A staff card in the corner shows the notes before the balls reach them. The
30-second cut adds the same slope as a vibraphone and a glockenspiel and a duet in call and answer. One of the 24
styles studied from eight repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/collision-music-v1.0.0.html`](dist/collision-music-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/collision-music/dist/collision-music-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 통통 악기 놀이 is fictional. Every bar and marble is drawn by code; the marimba, vibraphone and glockenspiel are recordings from a CC0 library.

## Folder

```
collision-music/
  source/                 3 file(s)
    BRIEF.md
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    tong.js
  scenes/                 5 file(s)
    cascade.js
    duet.js
    end.js
    hook.js
    instruments.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/collision-music
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/collision-music-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/collision-music.html
```

## How the notes move the balls

1. **The notes come first.** Every hit is a cue in `reel.config` (`note:real-marimba deg=4 bar=4 ball=0`): the
   arranger plays it as a recorded note and the scenes read the same cue list from `env.cues`, so picture and sound
   come from one list and cannot drift.
2. **Flights solved backwards.** `modules/tong.js` takes two consecutive hits of one ball and solves the parabola
   under fixed gravity that leaves the first bar at the first time and lands on the second exactly at the second
   (`vx = dx/T`, `vy = (dy - G T²/2)/T`); a fall leads into the first hit and a hop off follows the last.
3. **Hits.** A hit lights its bar, dips it with a damped wobble, sends a ring and a note mark up and flashes the note
   head on the staff card, where the scene's notes scroll towards a playhead.

## What the tone pass decided

- **palette.** A toy on mint: a pale mint ground #E6F4EE with a dot grid, eight rainbow mallet bars (red to violet), glossy marbles in pink, blue and yellow, ink #264653 for type; metal bars go silver for the vibraphone and the glockenspiel.

- **type.** Jua, round and friendly, for the name and the lines.

- **motion.** Every motion is a note: marbles fall and bounce from bar to bar on parabolas solved backwards so each one lands exactly on its beat; a hit lights the bar, dips it with a ring and sends a note mark up; two marbles half a beat apart make eighth notes; three landing together make a chord.

- **sound.** The melody is the picture: every hit is a note cue on a recorded marimba, vibraphone or glockenspiel (VCSL, CC0) in C major, written first; under it a soft ambient bed at 128 BPM (pad, sub, a soft kick and shaker).

- **visuals.** All code: the scenes read their hits from the same cue list the arranger renders (note:<instrument> deg= bar= ball=), and solve each flight as a parabola under fixed gravity between two hit times; bars are rounded keys with a highlight and pins.

- **narration.** Not recommended: the marbles play the tune.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `cascade` | 3 | 3 |
| `instruments` | - | 4 |
| `duet` | - | 4 |
| `end` | 3 | 3 |

## Scenes

**`hook`**: hook (2 bars): a pink marble drops onto the top bar and bounces down the rainbow slope one bar per beat, each bar lighting, dipping and ringing as it is hit, a scale climbing from C to C; 통통 악기 놀이 at the top.

**`cascade`**: cascade (3 bars): two marbles, pink and blue, bounce in turn half a beat apart, so the bars play an arpeggio in eighth notes, up and down the slope; 음표가 먼저, 공은 그 박자에 맞춰.

**`instruments`**: instruments (30-second cut, 4 bars): the bars turn to metal and the same slope plays as a vibraphone, then brighter as a glockenspiel, one marble a beat; 마림바, 비브라폰, 글로켄슈필.

**`duet`**: duet (30-second cut, 4 bars): call and answer: the pink marble plays four notes, the yellow one answers with four, twice; 둘이 하면 이중주.

**`end`**: end (3 bars): three marbles fall together and land on three bars at once, a chord; then another; the bars keep glowing and notes drift up; 떨어지는 모든 것이 / 노래가 돼요, 통통 악기 놀이 · 가상의 앱입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: some cues are recordings too (real-glock, real-marimba, vibraphone), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
