# Example: sticker-explainer (궁금상자)

A made-up channel goes in (궁금상자: a science channel; this episode follows one plastic bottle from the bin to a
T-shirt); a sticker explainer comes out on one big board. The channel's badge, the title 페트병 한 개의 여행 and a
bottle slap down (버린 병은 어디로 갈까?); the camera glides from station to station and each sticker slaps down with
its step label while a dotted path grows between them (sorting, flakes with a chart of fictional recycling rates, the
shirt); at the end the camera pulls back until the whole journey fits: 버린 줄 알았던 병, 옷이 돼요. The 30-second cut
adds the bin, the collection truck and the spool of thread. One of the 24 styles studied from eight repositories of
code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/sticker-explainer-v1.0.0.html`](dist/sticker-explainer-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/sticker-explainer/dist/sticker-explainer-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 궁금상자 is fictional and its numbers are made up; the steps are the common recycling process, simplified. Every sticker is drawn by code; the marimba, pizzicato and glockenspiel are recordings from two CC0 libraries.

## Folder

```
sticker-explainer/
  source/                 4 file(s)
    BRIEF.md
    fonts/GothicA1-Bold.woff2
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    sticker.js
  scenes/                 8 file(s)
    bin.js
    end.js
    flakes.js
    hook.js
    shirt.js
    sort.js
    thread.js
    truck.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/sticker-explainer
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/sticker-explainer-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/sticker-explainer.html
```

## How the stickers were made

1. **Stickers from silhouettes.** `modules/sticker.js` draws each object once into its own canvas, stamps its
   silhouette in white at 24 offsets round a circle to grow a border, puts the object back on top and caches the
   result; labels and the bar chart are stickers too.
2. **One board, one camera.** Stations sit at fixed places on a large board in world coordinates; each scene starts
   the camera at the previous scene's station in that cut and glides to its own, so the 15- and 30-second cuts take
   different routes over the same board; the dotted path grows with the camera.
3. **The slap.** A sticker lands from 1.5x with an overshoot and a tilt that settles, over a blurred shadow, then
   keeps a slight idle wobble.

## What the tone pass decided

- **palette.** A sticker board: blue-grey #DCE5EC with a dot grid, every picture cut out with a thick white border and a soft shadow; one colour per station (blue #3B82F6, green #3FAE6A, purple #8B5CF6, red #EF5B4C, amber, blue again), ink #22303F for labels, a yellow badge for the channel.

- **type.** Jua, round and friendly, for every label and caption; Gothic A1 for the chart numbers.

- **motion.** Explainer travel: the camera glides across one big board from station to station, each sticker slaps down from 1.5x with an overshoot and a tilt, the step label follows, the dotted path grows to it; the end pulls back until the whole journey is on screen.

- **sound.** Corporate at 112 BPM in C major on recorded instruments (VCSL and VSCO 2 CE, CC0): a recorded marimba for the motion, pizzicato strings, glockenspiel on top, a light kit; every sticker lands with a pop and a soft thud, every glide is a swish, the chart counts.

- **visuals.** All code: each object (a bottle, a recycling bin, a truck, a sorting belt, flakes, a spool of thread, a T-shirt, the badge, a bar chart of fictional data) is drawn once into its own canvas, given a white border by stamping its silhouette round a circle, cached, and slapped onto the board in world coordinates.

- **narration.** Optional: a short voice-over would fit, but the captions carry it without one.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `bin` | - | 2 |
| `truck` | - | 1 |
| `sort` | 1 | 2 |
| `flakes` | 1 | 2 |
| `thread` | - | 2 |
| `shirt` | 1 | 1 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the board. The channel's badge 궁금상자 slaps down, then the title sticker 페트병 한 개의 여행, then a bottle sticker with a tilt; 버린 병은 어디로 갈까? in a pill at the foot.

**`bin`**: bin (30-second cut, 2 bars): the camera glides across the board from the previous station to this one, its sticker slaps down with an overshoot and a tilt, the step label follows and the dotted path reaches it; 다 마신 병은 분리배출함으로.

**`truck`**: truck (30-second cut, 1 bar): the camera glides across the board from the previous station to this one, its sticker slaps down with an overshoot and a tilt, the step label follows and the dotted path reaches it; 수거차가 한 번에 모아 가요.

**`sort`**: sort (1 bar; 2 in the 30-second cut): the camera glides across the board from the previous station to this one, its sticker slaps down with an overshoot and a tilt, the step label follows and the dotted path reaches it; 페트병만 골라내요.

**`flakes`**: flakes (1 bar; 2 in the 30-second cut): the camera glides across the board from the previous station to this one, its sticker slaps down with an overshoot and a tilt, the step label follows and the dotted path reaches it; 씻고 잘게 부수면 플레이크.

**`thread`**: thread (30-second cut, 2 bars): the camera glides across the board from the previous station to this one, its sticker slaps down with an overshoot and a tilt, the step label follows and the dotted path reaches it; 녹여서 길게 뽑으면 실.

**`shirt`**: shirt (1 bar; 2 in the 30-second cut): the camera glides across the board from the previous station to this one, its sticker slaps down with an overshoot and a tilt, the step label follows and the dotted path reaches it; 실을 짜면 티셔츠 한 벌.

**`end`**: end (2 bars): the camera pulls back from the shirt until the whole board is in view, the journey from bottle to shirt along its dotted path; 버린 줄 알았던 병, / 옷이 돼요 on a white sticker, and 궁금상자 · 가상의 과학 채널 · 수치는 가상 데이터입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (real-marimba, violin-pizz, real-glock), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
