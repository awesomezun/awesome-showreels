# Example: cutaway-3d (브루큐브)

A made-up home coffee roaster goes in (브루큐브: a drum, a heater, an exhaust fan and a cooling tray in a box the
size of a toaster); a product cutaway reel comes out, in Korean. The machine turns under one spotlight with 220°C
on its display, then the front and the right panels slide away and the inside works: the drum turns its beans, the
heater glows, the fan spins, the arm sweeps the tray, and a pin lands on each part on the beat: 속까지 보여
드릴게요. The 30-second cut flies into the drum (green beans turn brown while the gauge climbs to 220°C) and round
to the tray, where steam rises. One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con
Lab); only the style is borrowed.

- Web version with every cut: [`dist/cutaway-3d-v1.0.0.html`](dist/cutaway-3d-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/cutaway-3d/dist/cutaway-3d-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 브루큐브 is fictional. The machine is code: boxes and cylinders in a small 3D renderer.

## Folder

```
cutaway-3d/
  source/                 5 file(s)
    BRIEF.md
    fonts/GothicA1-Black.woff2
    fonts/GothicA1-Bold.woff2
    fonts/NanumGothicCoding-Bold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    brew.js
  scenes/                 5 file(s)
    cool.js
    cutaway.js
    end.js
    hook.js
    roast.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/cutaway-3d
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/cutaway-3d-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/cutaway-3d.html
```

## How the machine was made

1. **A tiny 3D renderer.** `modules/brew.js` carries tiny3d: a perspective camera, boxes and cylinders as flat
   faces, back-face culling, a painter's sort by depth and Lambert light with a touch of specular, all on Canvas2D.
2. **The cutaway.** The casing is four walls plus two panels that slide out and fade; inside walls are a lighter
   grey so the parts read. Every moving part is a function of one state (open, drum, fan, arm, heat, roast), so a
   scene only animates numbers.
3. **2D on top.** Beans are projected points drawn as small ellipses with a crease, coloured from green to brown;
   steam, the heater's glow, the gauge, the label pins and the display are drawn in 2D over the render.

## What the tone pass decided

- **palette.** A machine on a dark stage: night #0E1116, a graphite casing #2C3139 with an orange trim #F28C28 (the brand, and every label pin), silver metal #A9B2BC, the heater glowing #FF7A1A, beans from green #8DA35A to roasted #5A3A22. Text is off-white #F3F1EC.

- **type.** Gothic A1 Black for the name and lines, set large on the left of the stage; label pins in Gothic A1 ExtraBold on dark tags with an orange rim; the display in a monospaced face.

- **motion.** A product cutaway: a slow turntable orbit under one spotlight, then the front and right panels slide off and the inside works (the drum turns, the fan spins, the arm sweeps, the heater breathes); pins land on the beat; the camera flies into the drum and round to the tray; the casing slides shut at the end.

- **sound.** Corporate at 112 BPM in A minor (7 bars in 15 s, 14 in 30 s), strings and piano with a firm kick; digital SFX for the mechanism: a whoosh for the panels, blips for the pins.

- **visuals.** All code: a small flat-shaded 3D renderer (tiny3d) on Canvas2D builds the roaster from boxes and cylinders; beans, steam, the glow, the gauge, the pins and the display are 2D on top.

- **narration.** Not recommended: the labels carry the explanation.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `cutaway` | 3 | 4 |
| `roast` | - | 3 |
| `cool` | - | 3 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the machine under one spotlight on a dark stage, turning slowly; its display counts up to 220°C; on the left, 가정용 원두 로스터, 브루큐브 and 집에서 볶는 커피.

**`cutaway`**: cutaway (3-4 bars): the core message, shown. The front and the right panels slide away and the inside lights up: the drum turning with its beans, the heater glowing beneath it, the exhaust fan at the back, the cooling tray in front; each part gets a pin on a beat (회전 드럼, 히터 220°C, 배기 팬, 냉각 트레이); 속까지 / 보여 드릴게요.

**`roast`**: roast (3 bars, 30-s cut): inside the drum. The camera flies up to its open end; the beans tumble and turn from green to brown while a gauge climbs 180 to 220°C; 12분, 고르게.

**`cool`**: cool (3 bars, 30-s cut): the tray. The camera comes round to the cooling tray at the front; the arm sweeps the roasted beans, wisps of steam rise and thin out; 바로 식혀서 / 향을 붙잡아요.

**`end`**: end (2 bars): the casing slides shut again and the camera pulls back to the whole machine on its stage; 브루큐브, 집에서 볶는 12분 and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
