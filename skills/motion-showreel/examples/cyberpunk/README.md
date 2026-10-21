# Example: cyberpunk (네온 레인 2087)

A made-up SF action game goes in (네온 레인 2087: Seoul in 2087, where the rain never stops); a cyberpunk
trailer comes out, in Korean. The skyline in the rain, Korean neon signs stuttering on, a hologram koi, a flying
car, and the title breaking in with a glitch; then the street: a hooded walker under the signs, the wet road
mirroring everything in ripples: 2087년, 비는 그치지 않는다. The 30-second cut adds a chase between the towers and a
hack that flips a sign from 라면 to 2087. One of the 24 styles from the series after the video *모션그래픽 20가지
톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/cyberpunk-v1.0.0.html`](dist/cyberpunk-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/cyberpunk/dist/cyberpunk-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 네온 레인 2087 is fictional. The city, the rain and the signs are drawn by code.

## Folder

```
cyberpunk/
  source/                 4 file(s)
    BRIEF.md
    fonts/DoHyeon-Regular.woff2
    fonts/OFL.txt
    fonts/Orbit-Regular.woff2
  modules/                1 file(s)
    cyber.js
  scenes/                 5 file(s)
    chase.js
    end.js
    hack.js
    hook.js
    street.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/cyberpunk
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/cyberpunk-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/cyberpunk.html
```

## How the city was made

1. **Towers.** `modules/cyber.js` seeds towers in three depths with window grids, blinking aircraft lights, neon
   strips down their edges and vertical Korean signs (라면, 전당포, 여관, 노래방...) that stutter like failing tubes;
   each depth scrolls at its own speed.
2. **Rain and the wet street.** Rain is streaks whose positions are a function of time; the street copies the band
   of the frame above the horizon and draws it upside down in thin strips, each nudged sideways by a moving wave, then
   darkens it and adds splashes.
3. **Glitch.** Lettering is drawn in magenta and cyan a few pixels apart under the white, jumping on glitch frames;
   a burst throws horizontal slices of the finished frame sideways.

## What the tone pass decided

- **palette.** Night in violet and navy (#07041A to #2A0E3E, a magenta city glow at the horizon); neon in magenta #FF2E88, cyan #2EE6FF, yellow #FFD23A, green #3AFF9E and orange on Korean signs; everything doubled and smeared in the wet street.

- **type.** Do Hyeon for the title, the lines and the signs (tall, condensed, sign-painter Korean), Orbit for the UI, the HUD and the numbers; both in RGB-split glitch lettering.

- **motion.** A trailer in the rain: slow push-ins, parallax towers in three depths, signs that stutter, rain that never stops, reflections that ripple, cars that streak; glitch bursts (slices of the frame thrown sideways) on the cuts and on the hack.

- **sound.** Dark synth at 112 BPM in E minor (7 bars in 15 s, 14 in 30 s), saw pad, saw-pluck arps, rolling saw bass; digital SFX: glitches on the titles, whooshes for the cars, keystrokes and a lock for the hack.

- **visuals.** All code: seeded towers with window grids, vertical neon signs, a hologram koi billboard, rain streaks and splashes, a street that mirrors the frame above it in rippling strips, a hooded walker, flying cars, a HUD.

- **narration.** Not recommended: a trailer of lines on screen.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `street` | 3 | 4 |
| `chase` | - | 3 |
| `hack` | - | 3 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the skyline in the rain, pushing in slowly; signs stutter on across the towers, a hologram koi turns on a billboard, a flying car crosses; the title breaks in with a glitch: 네온 레인 / 2087, and SF 액션 게임 above.

**`street`**: street (3-4 bars): the core message. Street level in the rain: towers with signs close above, a wet street that mirrors them in ripples, splashes; the hooded walker crosses under the signs, visor lit; a car's lights sweep past. 2087년, / 비는 그치지 않는다.

**`chase`**: chase (3 bars, 30-s cut): between the towers at speed: flying cars streak past at three depths, the signs smear into light trails, the rain flies sideways; 빗속의 서울을 / 달려라.

**`hack`**: hack (3 bars, 30-s cut): through the walker's visor: a HUD locks onto a sign across the street, code types, a bar fills to 100% and the sign flips from 라면 to 2087 in cyan; 도시의 불빛을 / 해킹하라.

**`end`**: end (2 bars): the title over the rain-blurred city glow: 네온 레인 2087, the line, the platforms and the fiction label; a glitch now and then.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
