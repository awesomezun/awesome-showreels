# Example: stained-glass (빛뜰 미술관)

A made-up museum goes in (빛뜰 미술관: a museum of glass art whose south wall is one stained-glass window, so the
colour on its floor moves with the sun all day); a stained-glass reel comes out. In a dark stone room the lead of an
arched window is drawn out from its sun and the glass lights piece by piece in the same order while a band of sun
slides across it: 빛뜰 미술관; the window then lies on the floor as coloured light with dust in the shafts; at the end
the glass warms toward evening: 햇빛이 시간을 칠합니다. The 30-second cut adds the same window at nine, noon and six,
and the collection (a vase, a bowl, a lampshade of glass petals). One of the 24 styles studied from eight repositories
of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/stained-glass-v1.0.0.html`](dist/stained-glass-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/stained-glass/dist/stained-glass-v1.0.0.html))
- Cuts: `short` (5 bars = 15.0 s), `30` (10 bars = 30.0 s), all at 80 BPM.

> 빛뜰 미술관 is fictional. Every piece of glass is drawn by code; the music plays a pipe organ, chimes, bells and a flute recorded for two CC0 libraries.

## Folder

```
stained-glass/
  source/                 5 file(s)
    BRIEF.md
    fonts/GowunBatang-Bold.woff2
    fonts/GowunBatang-Regular.woff2
    fonts/GrandifloraOne-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    glass.js
  scenes/                 5 file(s)
    end.js
    floor.js
    gallery.js
    hook.js
    hours.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/stained-glass
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/stained-glass-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/stained-glass.html
```

## How the window was leaded

1. **Pieces from a drawing.** `modules/glass.js` scatters seeds over an arched frame and adds them in pairs on each
   figure's outline (the sun and its rays, three flowers, the border band, the green foot), then cuts a Voronoi cell
   for every seed by clipping the arch with the bisectors to its neighbours: the lead follows the drawing, and each
   piece takes its colour from the figure its seed sits in.
2. **Lit glass.** A piece is a gradient from a bright centre with its own shade, multiplied by the time of day (cool,
   white, amber) and lifted where a band of sun passes; a blurred copy added on top makes the light spill past the
   dark came, which is drawn with a thin highlight.
3. **Light on the floor.** The same pieces go through a skew onto a stone floor as soft added light that drifts with
   the sun, under shafts with dust; the lampshade in the collection is the window again, clipped to a dome.

## What the tone pass decided

- **palette.** Jewel glass against dark stone: cobalt #2856A8 and sky #4A8CD0, ruby #B8243A, amber #E8A33C and gold #F4CD55, emerald #2E8B57 and leaf #6DB04B, violet #7A4DA8, clear #D6E6EA, lead #26262B; walls and floor near black #16151B so the glass carries all the light; the time of day tints it (cool at nine, white at noon, amber at six).

- **type.** Grandiflora One, an elegant high-contrast display face with an art-nouveau swing, for the name and the line; Gowun Batang for everything small.

- **motion.** Light is the motion: the lead is drawn out from the sun, then the pieces light in the same order; a brighter band of sun slides across the glass; the window lies on the floor as coloured light that drifts as the sun moves, with dust in the shafts; the evening warms the colour.

- **sound.** Ambient at 80 BPM in F lydian on recorded instruments (VCSL and VSCO 2 CE, CC0): a quiet pipe organ bed, hand chimes for the motion, tubular bells on top, a flute hook, a soft kick and shaker; chimes and swells for the pieces lighting, a reveal for the name.

- **visuals.** All code: a Voronoi tessellation clipped to an arched frame with its seeds placed in pairs on each figure's outline (the sun, three flowers, leaves, a bird), so the lead follows the drawing; pieces lit by a gradient from a bright centre with a per-piece shade and a blurred copy added for the glow; the floor light is the same pieces through a skew; a vase, a bowl and a lampshade made of the window's pieces.

- **narration.** Not recommended: the light is enough.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `floor` | 1 | 2 |
| `hours` | - | 2 |
| `gallery` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): a dark stone interior. The lead of an arched window is drawn out from its sun, then the glass lights piece by piece in the same order (the sun first, then its rays, the sky, three flowers, leaves, the border) while a brighter band of sun slides across; 유리공예 미술관 · 2027년 봄 개관 and 빛뜰 미술관 come up on the left.

**`floor`**: floor (1 bar; 2 in the 30-second cut): the room from further back: the window high on the wall, shafts of light with dust drifting in them, and the window lying on the stone floor as coloured light that slides as the sun moves; 오전 10시, 바닥 위의 정원.

**`hours`**: hours (30-second cut, 2 bars): the same window three times, lit one per beat: cool at 아침 9시, white at 정오, amber at 저녁 6시, each with its light on the floor below; 같은 창, 세 가지 빛 above them.

**`gallery`**: gallery (30-second cut, 2 bars): the permanent collection under the window's light: a cobalt vase, an amber bowl and a lampshade of small glass petals lit from inside, each on a plinth with its coloured light pooled on top, coming up one per beat; 상설 전시 · 유리 정원.

**`end`**: end (2 bars): the window at full light, its colour warming from white toward evening amber as a band of sun crosses it; 햇빛이 / 시간을 칠합니다 glowing beside it, then 빛뜰 미술관 · 2027년 봄 개관 and 가상의 미술관입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (pipe-organ, hand-chimes, tubular-bells, flute); some cues are recordings too (wine-glass), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
