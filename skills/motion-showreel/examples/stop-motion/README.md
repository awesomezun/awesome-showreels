# Example: stop-motion (털뭉치 공방)

A made-up felt doll workshop goes in (털뭉치 공방: felt cut sheet by sheet and sewn stitch by stitch into bears,
rabbits and cats, with a one-day class at weekends); a stop-motion reel comes out, in Korean, shot (so it seems)
frame by frame on a cutting mat. Felt pieces land one after another and become a bear while a paper label names the
workshop; then a needle goes round the bear's head and a stitch appears on every beat (한 땀씩,) and felt sheets
land on a stack (한 장씩.). The 30-second cut adds the finished dolls with their price tags and the weekend class.
One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/stop-motion-v1.0.0.html`](dist/stop-motion-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/stop-motion/dist/stop-motion-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 털뭉치 공방 is fictional. The felt is code, and so is the hand-held camera.

## Folder

```
stop-motion/
  source/                 3 file(s)
    BRIEF.md
    fonts/GamjaFlower-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    felt.js
  scenes/                 5 file(s)
    dolls.js
    end.js
    hook.js
    lesson.js
    stitch.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/stop-motion
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/stop-motion-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/stop-motion.html
```

## How the felt was made

1. **Shot by hand.** `modules/felt.js` steps every scene's time at 8 frames a second; each frame the camera
   shifts a few pixels and turns a hair, and the exposure flickers lighter or darker, as if every frame had been
   photographed separately.
2. **Felt and thread.** A felt shape is a fill dusted with hundreds of short fibres in a lighter and a darker shade
   of its colour, with a soft lifted shadow and a fuzzy edge; stitches are dashed cream thread with a tiny shadow;
   buttons have four holes and a thread cross.
3. **The bear.** Built from felt parts in order (ears, body, arms and feet, head, muzzle, button eyes, cheeks, a red
   button), so it can be assembled piece by piece; the rabbit and the cat share its body.

## What the tone pass decided

- **palette.** A workbench: a green cutting mat #2F7D5B with a pale grid on a wooden table #8A6A4A; felt in bear brown #A8754F, cream, pink #F2A6B3, ginger #E8A15A and off-white; cream thread #FFF4E0 for stitches, red yarn #E8574F, wooden and dark buttons; paper labels #FFF8EA with rose stitching.

- **type.** Gamja Flower, a soft Korean handwriting, written on paper labels with a stitched border.

- **motion.** Stop motion at 8 frames a second: the scenes step their time, the camera shifts a few pixels and the exposure flickers from frame to frame, pieces land rather than glide, a stitch appears per beat, the bear waves in four poses.

- **sound.** Lofi at 96 BPM in D major (6 bars in 15 s, 12 in 30 s), e-piano and soft swing drums; organic SFX: snips and taps for each piece and stitch.

- **visuals.** All code: felt fills (a colour dusted with short fibres in two shades and a fuzzy edge), dashed thread stitches, buttons with thread crosses, a needle with yarn, a cutting mat with a grid and numbers, paper labels with torn edges.

- **narration.** Not recommended: quiet suits it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `stitch` | 2 | 3 |
| `dolls` | - | 3 |
| `lesson` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): a cutting mat, shot frame by frame; felt pieces land one after another and become a bear (ears, body, arms and feet, head, muzzle, button eyes, cheeks, a red button); a paper label slides in: 수제 인형 공방, 털뭉치 공방.

**`stitch`**: stitch (2-3 bars): the core message, close up. A needle trailing red yarn goes round the bear's head and a stitch appears on every beat (한 땀씩,); then felt sheets in five colours land on a stack one at a time (한 장씩.).

**`dolls`**: dolls (3 bars, 30-s cut): the finished dolls land one a bar (곰, 토끼, 고양이), each with a paper tag on a string giving its name and price.

**`lesson`**: lesson (2 bars, 30-s cut): a weekend class: a big paper note pinned to the mat (주말 원데이 클래스 / 토·일 오후 2시 / 인형 하나, 하루면 완성) while a ball of yarn rolls across in steps.

**`end`**: end (2 bars): the bear waves, frame by frame; the label: 털뭉치 공방, the address, the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
