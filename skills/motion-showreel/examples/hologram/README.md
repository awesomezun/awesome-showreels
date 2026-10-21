# Example: hologram (오르빗 컨트롤)

A made-up satellite operations platform goes in (오르빗 컨트롤: 300 satellites from low orbit to geostationary,
watched on one screen, one at a time when needed, and moved before debris can hit them); a hologram reel comes out,
in Korean. A projector on a control-room table switches on and the globe draws itself in its cone of light; then
the satellites switch on across three shells as a counter runs to 300: 궤도 위 300기를 한 화면에. The 30-second cut
adds one satellite in wireframe with its telemetry and a collision warning it steps out of. One of the 24 styles
from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only the style is borrowed.

- Web version with every cut: [`dist/hologram-v1.0.0.html`](dist/hologram-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/hologram/dist/hologram-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 오르빗 컨트롤 is fictional. The globe, the orbits and the satellites are drawn by code.

## Folder

```
hologram/
  source/                 4 file(s)
    BRIEF.md
    fonts/NanumGothicCoding-Bold.woff2
    fonts/OFL.txt
    fonts/Orbit-Regular.woff2
  modules/                1 file(s)
    holo.js
  scenes/                 5 file(s)
    alert.js
    end.js
    fleet.js
    hook.js
    zoom.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/hologram
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/hologram-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/hologram.html
```

## How the hologram was made

1. **The globe.** `modules/holo.js` projects a wireframe of latitude and longitude lines (the far side dimmer)
   and a dot-matrix land mask, a procedural pattern sampled on a Fibonacci lattice, with a mild perspective; it can
   draw itself from the bottom up.
2. **300 satellites.** Fourteen orbital planes in three shells: eight low planes of 25, three medium planes of 20 and
   a geostationary ring of 40, each plane with its inclination, node and speed; a satellite behind the globe is
   drawn faint.
3. **Projected light.** Everything is additive light blue over a dark room: a projector cone, panels with corner
   brackets, rolling scanlines and a band of light, a flicker that drops out now and then.

## What the tone pass decided

- **palette.** A dark control room (#04060E with a blue-black glow) and one hologram colour: light blue #56D8FF for lines, #A8ECFF for land and highlights, near-white #E8F8FF for satellites and type; orange #FF9A3C only for the one satellite in focus, debris and warnings.

- **type.** Orbit for names and lines, glowing; Nanum Gothic Coding (bold) for every figure, counter and readout.

- **motion.** Projected light: the projector stutters on, the globe draws itself from the bottom up, satellites switch on as a counter runs; everything turns slowly; scanlines roll and the hologram flickers now and then; orbits move at their own speeds.

- **sound.** Dark synth at 112 BPM in A minor (7 bars in 15 s, 14 in 30 s), soft saw pad, saw-pluck arps, rolling saw bass; digital SFX: beeps for the counter, a lock for the satellite in focus, an alarm and a whoosh for the manoeuvre.

- **visuals.** All code: a wireframe globe with a procedural dot-matrix land mask, 300 satellites on fourteen planes in three shells (low, medium, geostationary), rings, a projector cone, floating panels with corner brackets, a wireframe satellite, scanlines.

- **narration.** Not recommended: the readouts carry it.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `fleet` | 3 | 4 |
| `zoom` | - | 3 |
| `alert` | - | 3 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): a dark control room; the projector on the table switches on, its cone of light flickers up, and the globe draws itself from the bottom up in wireframe and land dots; the orbit rings follow; 오르빗 컨트롤, 위성 관제 플랫폼.

**`fleet`**: fleet (3-4 bars): the core message, shown. Satellites switch on across the three shells as a counter runs to 300, low orbits fast, the geostationary ring slow; the globe turns; 궤도 위 300기를 / 한 화면에; a panel breaks the count down by shell.

**`zoom`**: zoom (3 bars, 30-s cut): one satellite. It lights orange in the fleet, a leader line runs to a panel, and the panel shows it in turning wireframe with its telemetry typing in: 배터리 92%, 고도 550km, 속도 7.6km/s; 한 기씩, 자세히.

**`alert`**: alert (3 bars, 30-s cut): a collision warning. A piece of debris (orange) crosses towards one satellite; a counter reads 충돌 위험 03:00; the satellite raises its orbit along a short arc and the paths part: 회피 완료; 충돌 위험, / 3분 전에 피해요.

**`end`**: end (2 bars): the globe and the fleet turning over the projector; 오르빗 컨트롤, 위성 관제 플랫폼, the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
