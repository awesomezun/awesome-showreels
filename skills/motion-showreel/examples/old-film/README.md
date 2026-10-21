# Example: old-film (동명극장 재개관)

A made-up single-screen cinema goes in (동명극장: opened in 1962, closed for years, reopening with its old sign
and its 35mm projector); an old-film reel comes out, in Korean, in sepia with every flaw of a worn print. The leader
counts 3, 2, 1 on the beats and the first intertitle names the theatre; then its front at night: the name lights up
letter by letter in bulbs and the bulbs start to chase, over a subtitle: 1962년의 불이 다시 켜집니다. The 30-second
cut adds the projector with its reels turning and three intertitles for the opening programme. One of the 24 styles
from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/old-film-v1.0.0.html`](dist/old-film-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/old-film/dist/old-film-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 동명극장 is fictional, and so are the three films. The worn print is code.

## Folder

```
old-film/
  source/                 3 file(s)
    BRIEF.md
    fonts/NanumMyeongjo-ExtraBold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    reel.js
  scenes/                 5 file(s)
    end.js
    hook.js
    marquee.js
    program.js
    projector.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/old-film
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/old-film-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/old-film.html
```

## How the film was aged

1. **A projector pass.** `modules/reel.js` draws each scene in sepia browns, then runs `K.film()` over the finished
   frame: a warm tint multiplied in, an exposure flicker per film frame (18 a second), crawling grain from a tiled
   noise texture, one or two scratches that last a few frames, dust and the odd hair, and an iris vignette; the
   picture itself weaves a few pixels every film frame.
2. **Cinema furniture.** The countdown leader (crosshair, rings and a clock wipe), intertitle cards with double
   borders, corner flourishes and lines stacked by their own sizes, a brick front with a bulb sign that lights in
   order and then chases, a marquee, a projector with turning reels and dust drifting in the beam.
3. **Swing.** The arranger's swing preset: piano comping, walking upright bass, clarinet, ride and brushes, with a
   beep on each number of the countdown.

## What the tone pass decided

- **palette.** Sepia film: everything is drawn in browns from #1E1812 to cream #F4EAD2 and multiplied by a warm tint; only the bulbs glow warm yellow #FFE6A0 and #F2C46A; intertitles are cream on near-black #100C08.

- **type.** Nanum Myeongjo ExtraBold, the serif of old Korean cinema posters and intertitles, centred on the cards and set as subtitles under the pictures.

- **motion.** The projector, not the camera: the frame weaves every film frame (18 a second), the exposure flickers, grain crawls, scratches and dust pass; the leader counts down on the beats; bulbs light one at a time, then chase; cards cut on the bar.

- **sound.** Swing at 128 BPM in Bb major (8 bars in 15 s, 16 in 30 s): piano comping, walking upright bass, clarinet, ride and brushes; a beep on each countdown number, a soft thud for the cards.

- **visuals.** All code: a countdown leader with a clock wipe and crosshair, intertitle cards with double borders and corner flourishes, a brick front with a bulb sign and a marquee, a projector with turning reels and a dusty beam, a film pass (tint, flicker, grain, scratches, dust, a hair, an iris vignette).

- **narration.** Not recommended: it is a silent-film look.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `marquee` | 4 | 5 |
| `projector` | - | 3 |
| `program` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): the leader counts 3, 2, 1 on the beats with its sweeping wedge, a white flash, then the first intertitle: 동명극장 / 재개관 / 1962 – 2026. The film weaves, flickers and crawls with grain throughout.

**`marquee`**: marquee (4-5 bars): the core message. The theatre front at night: the name lights up letter by letter in bulbs, the bulbs round the board follow and then chase; under it, as a subtitle band, 1962년의 불이 다시 켜집니다.

**`projector`**: projector (3 bars, 30-s cut): the booth. The two reels turn, the beam fans out with dust drifting in it; 그때 그 필름 영사기로.

**`program`**: program (3 bars, 30-s cut): three intertitles, one a bar, the opening programme: 〈봄날의 기차〉, 〈달빛 무도회〉, 〈동명 거리의 아이들〉, each with its year.

**`end`**: end (2-3 bars): the last intertitle: 동명극장, the reopening date, the fiction label; the film runs on.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
