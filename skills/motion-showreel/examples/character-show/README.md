# Example: character-show (콩이 첫 팬미팅)

A made-up convenience-store mascot goes in (콩이: a green bean with a sprout, holding its first fan meeting); a
one-character show comes out, in Korean. Velvet curtains part, the spotlight lands and 콩이 pops up and waves; then
it changes face and prop every two beats (안녕!, 찡긋 in a party hat, 깜짝! in sunglasses, 사랑해요 with a bow, 최고!
in a crown) while 콩이 하나면 / 충분해요 lands beside it. The 30-second cut adds a dance with the fans' light sticks
and the limited goods. One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only
the style is borrowed.

- Web version with every cut: [`dist/character-show-v1.0.0.html`](dist/character-show-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/character-show/dist/character-show-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 콩이 is fictional. It is drawn by code in gradients and highlights, with no outlines.

## Folder

```
character-show/
  source/                 3 file(s)
    BRIEF.md
    fonts/Jua-Regular.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    kong.js
  scenes/                 5 file(s)
    dance.js
    end.js
    goods.js
    hook.js
    show.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/character-show
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/character-show-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/character-show.html
```

## How 콩이 was made

1. **A character-IP finish.** `modules/kong.js` draws 콩이 without ink lines (unlike the cartoon example): a
   kidney-shaped body in a radial green gradient, a long highlight and a glint, blush, glossy eyes with two
   catchlights, capsule arms and feet, a sprout with two leaves.
2. **Faces and props.** Five faces (smile, happy, wink, surprised, love with heart eyes) and four props (a party
   hat, sunglasses, a crown, a bow) combine into poses; arms take a raise per side.
3. **The show.** Each pose lands with a hop and a squash on the beat under a spotlight; curtains, a bulb frame that
   chases, fans' light sticks that sway on the beat and tumbling confetti make the stage.

## What the tone pass decided

- **palette.** A show stage in violet and pink (#3A2470 to #B04A9A), red velvet curtains #C8283C, gold bulbs and confetti #FFD15C; 콩이 in a soft green gradient from #B8EC93 to #4E9A3A with pink blush; white type with a pink glow and a violet edge.

- **type.** Jua for everything: big titles with a soft glow, captions in white or gold pills that pop.

- **motion.** A one-character show: the curtains part, the spotlight lands, 콩이 pops up and settles with a squash; every two beats a new face and prop with a hop; dancing on every beat with the arms in turn; light sticks sway on the beat; confetti tumbles.

- **sound.** Bright pop at 128 BPM in E major (8 bars in 15 s, 16 in 30 s), pluck, bell and marimba over a full kit; glassy SFX: sparkles on each pose, a shimmer when the curtains open, pops for the goods.

- **visuals.** All code: 콩이 drawn with gradients and highlights, no outlines (a character-IP finish, unlike the inked cartoon), five faces and four props, a stage with a bulb frame, a spotlight, curtains, light sticks, confetti, pedestals.

- **narration.** Not recommended: 콩이 does not talk; it performs.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `show` | 4 | 5 |
| `dance` | - | 3 |
| `goods` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): velvet curtains part, the spotlight lands, and 콩이 pops up from below with a bounce and waves; 편의점 마스코트, then 콩이 in big letters and 첫 팬미팅.

**`show`**: show (4-5 bars): the one-character show, and the core message. Every two beats 콩이 hops into a new face and prop (안녕! / 찡긋 / 깜짝! / 사랑해요 / 최고!) with a caption over its head; 콩이 하나면 / 충분해요 lands at the left.

**`dance`**: dance (3 bars, 30-s cut): 콩이 dances on every beat, arms up and down in turn; the fans' light sticks sway on the beat and confetti falls; 다 같이 콩콩!

**`goods`**: goods (3 bars, 30-s cut): limited goods pop in one after another on pedestals: a keyring, a plush, a mug; 한정 굿즈.

**`end`**: end (2-3 bars): 콩이 with its crown waving under the spotlight, confetti; 콩이 첫 팬미팅, the date and the hall, the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
