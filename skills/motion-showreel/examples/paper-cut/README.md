# Example: paper-cut (오림 공방)

A made-up class goes in (오림 공방: a New Year class in cutting patterns from folded hanji); a paper-cut reel comes
out. A square of red hanji is folded three times on the beat; close on the folded eighth, scissors open and close
along each outline and every cut piece falls away; then the paper unfolds crease by crease and the cuts bloom into one
pattern with the square's symmetry, half shapes on the creases turning whole; at the end it lies on the table among
its bits: 접고, 오리고, 펼치면 복이 피어요. The 30-second cut adds three more sheets (a snowflake, a plum blossom and a
pinwheel) and the red pattern glowing on a lattice window at night. One of the 24 styles studied from eight
repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/paper-cut-v1.0.0.html`](dist/paper-cut-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/paper-cut/dist/paper-cut-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 오림 공방 is fictional. Every fold and cut is drawn by code; the zither, glockenspiel and flute are recordings from a CC0 library.

## Folder

```
paper-cut/
  source/                 4 file(s)
    BRIEF.md
    fonts/GowunDodum-Regular.woff2
    fonts/OFL.txt
    fonts/SongMyung-Regular.woff2
  modules/                1 file(s)
    orim.js
  scenes/                 5 file(s)
    cut.js
    end.js
    hook.js
    more.js
    window.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/paper-cut
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/paper-cut-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/paper-cut.html
```

## How the paper was folded and cut

1. **One eighth, eight times.** `modules/orim.js` defines each pattern as holes in one eighth of the square (the
   triangle between the centre, an edge's midpoint and a corner) and cuts them through all eight symmetries of the
   square into a cached sheet with hanji fibres; shapes that straddle a crease come out whole.
2. **Folds as flaps.** Unfolding is three steps (the diagonal, then the vertical, then the horizontal crease); each
   moving flap is the sheet clipped to a half, quarter or eighth and squashed across its crease by cos θ, so at −1 it
   lies folded on top with its back darkened; folding is the same played backwards, and a blurred black pass draws
   the sheet's shadow with its holes.
3. **Cutting.** While folded, the eighth is rebuilt every frame with the holes finished so far; the scissors ride
   each outline with their blades flapping, the cut line appears behind them and each piece drops and spins away.

## What the tone pass decided

- **palette.** Coloured hanji on a cream sheet #F1E9DA with fibres: festive red #C8372D for the main pattern, indigo #2E4677, pink #E06C8A and green #4E8F5A for the others, ink brown #3A2A22 for type; at night the red glows over a warm lamp #FFE296.

- **type.** Song Myung, a brushed serif, for the name and the line; Gowun Dodum, round and friendly, for the step labels.

- **motion.** The craft is the motion: three folds on the beat, each flap swinging over its crease and showing its back; scissors opening and closing along every outline with the piece falling away; the unfold, crease by crease, as the camera pulls back so the pattern blooms at once; finished sheets turn a little on the table.

- **sound.** Bright pop at 112 BPM in G major on a pentatonic scale (0 2 4 7 9) with recorded instruments (VCSL, CC0): a plucked zither (dan tranh) like a gayageum carries the arpeggios over a soft pad, recorded glockenspiel on top and a flute hook; paper flips for the folds, scissor snips for the cuts, a sparkle as the pattern opens.

- **visuals.** All code: a pattern is a set of holes in one eighth of the square, cut eight times by the square's symmetries into a cached sheet; folding is the reverse of unfolding, each flap being the sheet clipped to a half, quarter or eighth and squashed across its crease by cos θ (a reflection when folded); a shadow pass draws the same regions blurred and black.

- **narration.** Not recommended: the paper shows it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `cut` | 3 | 3 |
| `more` | - | 3 |
| `window` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): a square of red hanji on the cream table is folded three times on the beat (in half, in half again, on the diagonal), each flap swinging over its crease and showing its back; 설맞이 한지 오리기 클래스 and 오림 공방 beside it.

**`cut`**: cut (3 bars): close on the folded eighth. Scissors open and close along each outline in turn, every finished piece falling away; then the paper is unfolded crease by crease as the camera pulls back, and the cuts open into one pattern with the square's symmetry, half shapes on the creases turning whole; ② 한 번 오려, ③ 펼치면 여덟 갈래.

**`more`**: more (30-second cut, 3 bars): three more sheets in indigo, pink and green, unfolded one per beat into a snowflake, a plum blossom and a pinwheel, under 무늬는 오리는 대로; their names below.

**`window`**: window (30-second cut, 3 bars): night. The red pattern is pasted on a lattice window lit warmly from behind: the paper glows a deep red and every hole lets the lamp through, the light breathing; 창에 붙이면, 빛이 들어와요.

**`end`**: end (2 bars; 3 in the 30-second cut): the red pattern on the table among its cut-out bits, turning a little; 접고, 오리고, / 펼치면 복이 피어요, then 오림 공방 · 설맞이 한지 오리기 클래스 and 가상의 공방입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (dan-tranh, real-glock, flute), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
