# Example: watercolour-toon (비 오는 날의 밤톨이)

A made-up picture book goes in (비 오는 날의 밤톨이: a little hedgehog who shares his leaf umbrella on a rainy
day); a watercolour cartoon reel comes out on cream paper. The title blooms onto the page like wet paint; 밤톨이
waddles in and the first raindrop lands on his nose: he squashes, blinks and looks up; under a big leaf he finds a
bunny shivering in the rain, holds the leaf over both of them and her ears spring up: 비가 와도, 같이 쓰면 돼요; a
rainbow blooms band by band. The 30-second cut adds him pulling up the leaf, finding her, and the two hopping into
a puddle together. One of the 24 styles studied from eight repositories of code-rendered video; only the style is
borrowed.

- Web version with every cut: [`dist/watercolour-toon-v1.0.0.html`](dist/watercolour-toon-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/watercolour-toon/dist/watercolour-toon-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 비 오는 날의 밤톨이 is fictional. Every wash is painted by code; the harp, violins, pizzicato, flute and glockenspiel are recordings from CC0 libraries.

## Folder

```
watercolour-toon/
  source/                 4 file(s)
    BRIEF.md
    fonts/GowunDodum-Regular.woff2
    fonts/HiMelody-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    wc.js
  scenes/                 6 file(s)
    end.js
    friend.js
    hook.js
    puddle.js
    rain.js
    share.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/watercolour-toon
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/watercolour-toon-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/watercolour-toon.html
```

## How the paint and the acting work

1. **Washes.** `modules/wc.js` lays each shape as a wobbly closed path in two uneven layers of pigment with a
   darker edge where the paint dried, multiplies paper grain inside it, and boils the outline slightly on twos;
   the landscape is painted once per weather and cached, and the paper's tooth is multiplied over the finished
   frame. Paint can bloom in from a point through a soft growing mask (the title, the rainbow).
2. **Rigs.** The hedgehog (a chestnut-burr back of short brush strokes, a cream face, arms, feet) and the bunny
   (ears that droop or stand) are drawn from a handful of pose values: position, squash, tilt, where the eyes look,
   blink, arm angle, smile, ears.
3. **Acting.** `W.act` eases poses between keyframes on beats (with an overshoot where a key asks for it), and
   breathing, blinking and a walk cycle are added on top; the crouch before he pulls the leaf, the jolt when he
   sees her and the ears springing up are just keys.

## What the tone pass decided

- **palette.** Cream paper #FBF6EC under everything; a grey-blue rainy sky and rain #7E9DB5; soft greens for hills and grass; a chestnut hedgehog #8B5A3C with a cream face; a pale lilac-grey bunny with pink ears; a leaf green #6BA34A; a rainbow at the end; brown brush-pen ink #4A3426.

- **type.** Hi Melody, a soft handwritten face, for the story lines, set with a little bleed; Gowun Dodum for the small print.

- **motion.** Acting first: the hedgehog waddles, squashes when a drop hits his nose, blinks and looks up, crouches before he pulls the leaf (anticipation) and springs up with it; the bunny shivers on twos, her ears droop and then spring up when the leaf covers her; both hop into the puddle with squash on landing; paint blooms in from a point; shapes boil slightly on twos.

- **sound.** Corporate at 96 BPM in G major on recorded instruments (VSCO 2 CE and VCSL, CC0): a soft violin bed, harp in broken eighths, a flute hook, cello pizzicato bass and a light shaker; a violin pizzicato for every raindrop on the leaf, a harp arpeggio as the title blooms, low pizzicato chords for the puddle hops.

- **visuals.** All code: washes are wobbly closed shapes in two uneven layers with a darker pigment edge and paper grain multiplied inside; lines are a brush pen; the landscape is painted once per weather and cached; paper grain is multiplied over the finished frame; characters are rigs posed from keyframes with breathing, blinking and a walk cycle on top.

- **narration.** Possible: a warm voice reading the two lines, but the reel works without it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `rain` | - | 2 |
| `friend` | - | 2 |
| `share` | 2 | 2 |
| `puddle` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the title blooms onto the page like wet paint; 밤톨이 waddles in from the left, stops, and the first raindrop lands on his nose: he squashes, blinks and looks up; then the rain begins.

**`rain`**: rain (30-second cut, 2 bars): the rain comes down; 밤톨이 looks left and right, crouches (the anticipation) and pulls up the big leaf growing beside him, holding it over his head as an umbrella; 비가 와도,

**`friend`**: friend (30-second cut, 2 bars): a little bunny sits in the rain, ears drooping, shivering, dripping; 밤톨이 comes along under his leaf, stops, and notices her (a jolt, a painted !); 저기, 비를 맞는 친구가 있어요.

**`share`**: share (2 bars): 밤톨이 steps over and holds the leaf over both of them; the bunny looks up, her ears spring up and she smiles; raindrops land on the leaf on the beats (pizzicato); little hearts; 비가 와도, 같이 쓰면 돼요.

**`puddle`**: puddle (30-second cut, 2 bars): the rain eases; the two of them hop into the puddle together on beats 2, 4 and 6, squashing as they land, splashing; 물웅덩이도 같이 첨벙.

**`end`**: end (2 bars): the rain stops and a rainbow blooms across the sky band by band; the two stand together under the lowered leaf; the title, 비 오는 날의 밤톨이, and 가상의 그림책입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (violins, concert-harp, cello-pizz, flute); some cues are recordings too (real-glock, violin-pizz), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
