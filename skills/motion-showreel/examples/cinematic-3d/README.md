# Example: cinematic-3d (궤도 일곱)

A made-up documentary goes in (궤도 일곱: the seventh crewed station in orbit, the first built to stay); a
cinematic trailer comes out, in Korean, in scope (2.39:1). The sun breaks over the Earth's limb into a flare; the
station glides over the dawn with its ring turning while two cards say it was built six times and came down six
times, then 이번엔, 남는다. The 30-second cut adds the whole Earth with its night side lit by cities and the orbit
drawn round it (하루 열여섯 번 해가 뜬다) and a release card. The title lands on a boom: 궤도 일곱, 인류의 일곱
번째 궤도. One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style
is borrowed.

- Web version with every cut: [`dist/cinematic-3d-v1.0.0.html`](dist/cinematic-3d-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/cinematic-3d/dist/cinematic-3d-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 궤도 일곱 is fictional. The Earth is a shader and the station is code; nothing is a photograph.

## Folder

```
cinematic-3d/
  source/                 4 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/NotoSerifKR.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    orbit.js
  scenes/                 5 file(s)
    end.js
    night.js
    open.js
    station.js
    title.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/cinematic-3d
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/cinematic-3d-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/cinematic-3d.html
```

## How the Earth was made

1. **The planet.** `modules/orbit.js` draws the Earth in one WebGL2 fragment shader: a ray meets an analytic
   sphere; domain-warped fbm gives coasts, shelves, forest, desert and ice; clouds are a second, banded fbm; the sea
   has a sun glint; city lights come up only on the night side, where there is land and no cloud.
2. **Air and light.** A thin shell is sampled twelve times along each ray: blue where it is lit, orange at the
   terminator, much brighter towards the sun. Rays that miss the planet get the sun disc, stars and a soft halo.
   The flare (a starburst, an anamorphic streak and ghosts through the centre) is 2D, faded by how much of the sun
   clears the limb.
3. **The station.** Flat-shaded 3D on Canvas2D (tiny3d): a spine, a turning ring of 28 segments on four spokes,
   four solar wings, a radiator, lit by the same sun direction as the shader.

## What the tone pass decided

- **palette.** Space and light only: black #03050A, the atmosphere blue #6FA8FF and its dawn orange #FF9A4D (in the shader), city gold #E8B964 for the orbit and the one line about the sun, off-white #EEF2F8 for cards, grey-blue #AAB4C4 for the small print.

- **type.** Trailer cards in Noto Serif KR SemiBold, letter-spaced and centred or set on the left; the title in Black Han Sans, huge and tracked in from wide, with a sweep of light across it.

- **motion.** A trailer: long, slow camera moves with nothing hurried; cards fade in and out; the sun breaking the limb is the event of the opening, the boom on the title the event of the end. Scope bars (2.39:1) throughout.

- **sound.** Cinematic-lite at 96 BPM in C minor (6 bars in 15 s, 12 in 30 s): low strings and pad, sparse; a swell into the sunrise, a boom and a shimmer on the title.

- **visuals.** All code: the Earth is a WebGL2 shader (an analytic sphere with fbm continents and clouds, sun glint, city lights on the night side, a 12-sample scattering shell); the station is flat-shaded 3D (tiny3d) lit by the same sun; the flare (starburst, anamorphic streak, ghosts), the orbit line and the cards are 2D.

- **narration.** Not recommended: the cards are the voice of a trailer.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `open` | 2 | 2 |
| `station` | 2 | 3 |
| `night` | - | 3 |
| `title` | 2 | 2 |
| `end` | - | 2 |

## Scenes

**`open`**: open (2 bars): black, then the Earth's limb in the scope frame; the dawn line brightens along it and the sun breaks over the edge into a flare. The film's name sits small in the top bar from the start; 지상 400킬로미터.

**`station`**: station (2-3 bars): the station glides in above the Earth, its ring turning, the sun behind it flaring at its edge; 여섯 번 지었고, / 여섯 번 내려왔다. then 이번엔, 남는다.

**`night`**: night (3 bars, 30-s cut): the whole Earth, half in night with its cities lit; the orbit draws itself round the globe and the station's light runs along it, passing into the dark and out into the dawn; 90분에 한 바퀴, then 하루 열여섯 번 해가 뜬다.

**`title`**: title (2 bars): the boom. The sun stands just over the limb behind the title, its flare full; 궤도 일곱 comes up out of a blur with a light sweep across it; 인류의 일곱 번째 궤도 below; the fiction label in the bottom bar.

**`end`**: end (2 bars, 30-s cut): the night side under the limb, cities lit, stars; the date card, then the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
