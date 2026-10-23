# Example: bauhaus (조형 연구소 여름 학교)

A made-up workshop goes in (조형 연구소 여름 학교: two weeks from the circle, the square and the triangle to one
poster); a constructivist reel comes out on a module grid, one action per beat. A red circle rolls in, a blue square
drops, a yellow triangle slides under them and a black bar runs beneath (조형 연구소, 여름 학교 2027); a bar turns a
quarter about its corner on every beat while 원, 사각, 삼각. land one by one; the shapes assemble a person (그리고
당신); at the end the poster freezes together with a quarter still turning. The 30-second cut adds a field of cards
flipping in a diagonal wave and the ten class days filling in. One of the 24 styles studied from eight repositories
of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/bauhaus-v1.0.0.html`](dist/bauhaus-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/bauhaus/dist/bauhaus-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 조형 연구소 여름 학교 is fictional. Every shape is drawn by code; the music is synthesized, with one recorded concert bass drum from a CC0 library.

## Folder

```
bauhaus/
  source/                 4 file(s)
    BRIEF.md
    fonts/DoHyeon-Regular.woff2
    fonts/GothicA1-Black.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    bau.js
  scenes/                 6 file(s)
    cascade.js
    end.js
    hook.js
    schedule.js
    shapes.js
    you.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/bauhaus
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/bauhaus-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/bauhaus.html
```

## How the poster was set

1. **Modules and beats.** `modules/bau.js` rules the sheet into 120-pixel modules and moves every shape along a list
   of module positions, one step per beat with an eased landing, so nothing ever stops between modules; bars turn in
   quarter turns about a corner and the triangle flips by a cosine squash.
2. **Overprinted inks.** Each colour is drawn with multiply and its own small offset, like a plate a little out of
   register, so where red, blue and black overlap they darken instead of covering each other.
3. **Type in modules.** Each letter rises out of a clip the height of its line, one after another, so the words build
   like the shapes do.

## What the tone pass decided

- **palette.** Constructivist print: cream paper #EFE8D8 with a faint 120-pixel module grid, and three primaries plus black, red #D7263D, blue #1B4F9C, yellow #F2C230 and ink #161616, each printed by multiply a few pixels out of register so overlaps darken like overprinted plates.

- **type.** Gothic A1 Black, a heavy grotesque, for the words, each letter rising out of its own module; Do Hyeon for dates and small lines.

- **motion.** One action per beat, in whole modules: shapes roll, drop and slide two modules at a time, bars turn a quarter about a corner, a triangle flips, cards flip in a diagonal wave; everything lands exactly on the grid and the end freezes into a poster whose quarter keeps turning.

- **sound.** Dark synth at 128 BPM in A dorian, kept minimal: a pad, saw plucks, a rolling saw bass, four-on-the-floor; a woodblock click for every move, claves for the words, a recorded concert bass drum (VCSL, CC0) under the end.

- **visuals.** All code: shapes are circles, rectangles, triangles and quarter arcs positioned in module units and stepped with eased beat-by-beat paths; every ink is drawn with multiply and its own small offset.

- **narration.** Not recommended: the grid speaks.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `shapes` | 2 | 3 |
| `you` | 2 | 3 |
| `cascade` | - | 3 |
| `schedule` | - | 2 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the module grid comes up on cream paper; one move per beat: a red circle rolls in two modules at a time, a blue square drops onto its row, a yellow triangle slides in, a black bar runs under them; 조형 연구소 slides up letter by letter on the right, then 여름 학교 2027.

**`shapes`**: shapes (2 bars; 3 in the 30-second cut): the composition works on the beat: a blue bar turns a quarter about its corner each beat, the red circle's quarter arcs swap colours, the triangle flips over; 원, / 사각, / 삼각. land one per two beats on the right, each with its colour.

**`you`**: you (2 bars; 3 in the 30-second cut): the shapes assemble a person, one part per beat: a red circle head drops in, a blue body slides under it, black arms turn up from the shoulders, a yellow triangle stands it on the floor; 그리고 당신 comes up beside it.

**`cascade`**: cascade (30-second cut, 3 bars): a field of cards flips over in a diagonal wave, one diagonal per half beat, each back a shape in one of the three colours; 기본 도형부터, 포스터 한 장까지.

**`schedule`**: schedule (30-second cut, 2 bars): ten blocks fill in for the ten class days, two per beat; 7월 20일 – 7월 31일, 월–금 · 10:00–17:00, 정원 24명.

**`end`**: end (2 bars; 3 in the 30-second cut): the poster freezes together: a large red circle with a turning quarter, a blue square overprinted on it, a yellow triangle, black bars; 원, 사각, 삼각. / 그리고 당신. and 조형 연구소 여름 학교 · 가상의 워크숍입니다 set in the corner.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: some cues are recordings too (claves, concert-bd, woodblock), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
