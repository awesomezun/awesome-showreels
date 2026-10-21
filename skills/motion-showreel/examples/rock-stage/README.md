# Example: rock-stage (번개다방 〈볼륨 업〉)

A made-up rock trio and its first solo show go in (번개다방, 〈볼륨 업〉: guitar, bass, drums); a rock
visualisation comes out, in Korean, where every instrument moves its own part of the picture. An amp knob turns to
11 on the ringing intro chords and 볼륨 업 slams in; then the stage plays: the kick lifts the floor light, the
frame and the crowd, the snare strikes the band's bolt, the guitar pumps the left amps and lights the red guitar, the
bass sends rings across the floor, the hats shake the cymbals, and a meter panel shows the four channels while
볼륨 올리고 / 보세요 lands on the first two snares. The 30-second cut adds a guitar solo under one spotlight and a
drop where every snare cracks real lightning. One of the 24 styles from the series after the video *모션그래픽
20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/rock-stage-v1.0.0.html`](dist/rock-stage-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/rock-stage/dist/rock-stage-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 번개다방 is fictional. The music is the arranger's `rock` preset, added for this example; the picture reads the arranger's own notes.

## Folder

```
rock-stage/
  source/                 3 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/OFL.txt
  modules/                2 file(s)
    envmap.js
    rock.js
  scenes/                 5 file(s)
    drop.js
    end.js
    hook.js
    solo.js
    stage.js
  envmap.py
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/rock-stage
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $P/envmap.py                                                             # the instrument events the stage reacts to
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/rock-stage-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/rock-stage.html
```

## How the stage hears the band

1. **A rock preset.** `audio/arrange.py` gained `rock` (128 BPM, E minor by default): a double-tracked
   overdriven guitar (`dist-guitar` in `audio/synth.py`: Karplus-Strong strings summed into power chords, asymmetric
   soft clipping, a cabinet filter) playing palm-muted eighths between open accents, ringing chords in intros and
   breakdowns and muted sixteenths into drops; round bass on eighths; kick, a big snare, hats, toms.
2. **What each instrument does.** A small recorder (`envmap.py` in this folder) runs the arranger for both cuts and writes every drum hit and
   every guitar and bass note into `modules/envmap.js`; `K.ev()` turns them into envelopes at any time, so each
   part of the stage follows one instrument, and the players strum on their own notes.
3. **The stage.** Truss and beams, amp stacks whose speakers pump, a kit with the band's mark on the kick, three
   players in rim-lit silhouette, a crowd with horns up, a channel meter, lightning that branches from the bolt.

## What the tone pass decided

- **palette.** A dark stage in poster colours: black #050506 and stage red going hot with the kick, lightning yellow #FFE14D for the band's bolt, the type and the guitarist's rim light, red #FF3B30 for the bassist, white for the strobe; a red guitar and an orange bass.

- **type.** Black Han Sans, heavy and square: slammed in with a thick black stroke and a little overshoot, on the snare.

- **motion.** Music-driven, per instrument: the arranger's own drum hits and guitar and bass notes are recorded into modules/envmap.js and turned into envelopes, so the kick lifts the floor light, the frame and the crowd, the snare strikes the bolt, the strobe and (in the drop) real lightning, the guitar pumps the left amps and lights the red guitar, the bass sends rings across the floor and pumps the right amps, the hats shake the cymbals, and the players strum on their own notes.

- **sound.** Rock at 128 BPM in E minor (8 bars in 15 s, 16 in 30 s): the arranger's rock preset, a double-tracked overdriven guitar on power chords (palm-muted eighths between open accents, ringing chords in the intro and breakdown, muted sixteenths into the drops), bass on eighths, kick, a big snare, hats and toms.

- **visuals.** All code: the stage (truss, beams, amp stacks with pumping speakers, a drum kit with the band's mark on the kick, the bolt), three players in rim-lit silhouette, a crowd, a meter panel, an amp knob that goes to 11.

- **narration.** Not recommended: it is a gig.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `stage` | 4 | 4 |
| `solo` | - | 3 |
| `drop` | - | 4 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars, the intro): the amp's volume knob in the dark. The guitar rings one chord a bar and the knob turns from 0 to 11, the numbers lighting as it passes; the muted sixteenths of the build shake it; 볼륨 업 slams in on the last beat. The band and the show are named from the first beat.

**`stage`**: stage (4 bars): the core message. The full stage plays and every part answers its own instrument: the kick lifts the floor light and the crowd, the snare strikes the band's bolt, the guitar pumps the left amps and lights the red guitar, the bass sends rings across the floor and pumps the right amps, the hats shake the cymbals. A meter panel shows the four channels; 볼륨 올리고 / 보세요 slam in on the first two snares.

**`solo`**: solo (3 bars, the breakdown, 30-s cut): the lights go down to one white spot on the guitarist; the others stand in the dark; each ringing chord swells the spot; 기타 한 대, / 조명 하나. In the build bar the muted sixteenths flicker the strobe and the stage lights climb back.

**`drop`**: drop (4 bars, 30-s cut): everything at once. Every snare cracks real lightning from the band's bolt down to the stage and flashes the strobe; the beams cross; the crowd jumps higher; the date and the hall slam in.

**`end`**: end (2-3 bars, the outro): the poster. The last chord rings and the band's bolt glows with it as it fades; the beams still sweep behind; 번개다방 단독 공연, 볼륨 업, the date and the hall, the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
