# Example: dark-neon (센티넬 X)

A made-up AI security platform goes in (센티넬 X: it watches a company network day and night and stops attacks
that hide in ordinary traffic before anyone can see them); a dark neon reel comes out, in Korean. The mark and the
name switch on with the stutter of a real neon sign; then a network draws itself and carries cyan packets while a
radar turns once a bar. Attacks travel the same edges unseen until the sweep crosses them, burn magenta and are
stopped at the next node: 보이지 않는 공격까지, 먼저. The 30-second cut adds three neon figures and a hexagon shield
that attacks break on. One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab);
only the style is borrowed.

- Web version with every cut: [`dist/dark-neon-v1.0.0.html`](dist/dark-neon-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/dark-neon/dist/dark-neon-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 센티넬 X is fictional, and so are its numbers. Every tube is drawn by code.

## Folder

```
dark-neon/
  source/                 3 file(s)
    BRIEF.md
    fonts/OFL.txt
    fonts/Orbit-Regular.woff2
  modules/                1 file(s)
    neon.js
  scenes/                 5 file(s)
    detect.js
    end.js
    hook.js
    shield.js
    stats.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/dark-neon
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/dark-neon-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/dark-neon.html
```

## How the neon was made

1. **Tubes.** `modules/neon.js` strokes every path four times with additive blending: a wide soft glow, a
   coloured halo, the tube and a near-white core; lettering gets a glow, a coloured outline and a white fill. Tubes
   switch on with a seeded stutter and hum a little when lit.
2. **The network.** Fourteen nodes and twenty edges, placed by hand and scaled per scene; packets ride the edges at
   their own speeds; the radar is a fading wedge that turns once a bar from the core.
3. **Unseen attacks.** Each attack has an entry point, a path and a start time; it is drawn only after the sweep
   first crosses its bearing, which is worked out from the time alone, so every frame agrees; at the end of its path
   a cyan ring and magenta sparks mark it stopped.

## What the tone pass decided

- **palette.** Neon on black: #030407 for the night, cyan #2EF2FF for everything that is normal (the network, the radar, the shield), magenta #FF2E9A only for attacks and the X, white cores in every tube, grey-blue #8FA6B2 for small print.

- **type.** Orbit, a squared sci-fi Korean face, drawn as neon: a wide glow, a coloured outline and a white core; small print plain.

- **motion.** Neon behaviour: tubes switch on with the stutter of a real sign and hum; the network draws itself edge by edge and carries packets; the radar turns once a bar; attacks are invisible until the sweep crosses them, then burn and are stopped with a shield pulse on the node.

- **sound.** Dark synth at 128 BPM in D minor (8 bars in 15 s, 16 in 30 s), saw pad, saw-pluck arps, rolling saw bass and stabs on a full kit; digital SFX: a lock-on beep for each attack seen, a hit for each one stopped.

- **visuals.** All code: additive three-pass neon strokes and lettering, a fixed network of fourteen nodes and twenty edges, a radar wedge, attacks with deterministic reveal times, a hexagon dome, a faint grid.

- **narration.** Not recommended: the cards carry it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `detect` | 4 | 5 |
| `stats` | - | 3 |
| `shield` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): black. The mark switches on with a neon stutter (a shield with a magenta X through it), then the name tube by tube: 센티넬 X; AI 보안 underneath; a faint grid comes up behind.

**`detect`**: detect (4-5 bars): the core message, shown. The network lights up edge by edge and carries cyan packets; the radar turns once a bar from the core. Attacks come in along the same edges but cannot be seen, until the sweep crosses them: they burn magenta, ringed, and are stopped at the next node with a shield pulse. 보이지 않는 공격까지, / 먼저.

**`stats`**: stats (3 bars, 30-s cut): three neon numbers switch on and count, one a bar: 탐지까지 0.2초, 오탐률 0.01%, 감시 24시간; the network turns small behind them; a note that the figures are invented.

**`shield`**: shield (3 bars, 30-s cut): a hexagon dome of neon closes round the whole network; attacks fly in from every side and burst on it in magenta sparks; 24시간, / 먼저 막아요.

**`end`**: end (2-3 bars): the mark and the name burn steady, with a slow hum in the tubes; AI 보안 플랫폼 and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
