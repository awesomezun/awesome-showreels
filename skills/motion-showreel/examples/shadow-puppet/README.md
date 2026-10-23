# Example: shadow-puppet (그림자 토끼전)

A made-up show goes in (그림자 토끼전: a children's shadow play of the old tale of the rabbit and the turtle, by a
fictional company); a shadow-theatre reel comes out. The house goes dark, the lamp catches behind the cloth, a board
with the title cut through it drops in on strings and the rabbit pops up on its rods; on the shore the turtle swims in
and bows to the hopping rabbit; at the end the boards swing in under the moon: 불을 끄면, 이야기가 켜져요. The
30-second cut follows the whole tale: under the sea on the turtle's back, the dragon king's palace (“간은 뭍에 두고
왔는걸요!”) and the escape in leaps past the moon. One of the 24 styles studied from eight repositories of
code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/shadow-puppet-v1.0.0.html`](dist/shadow-puppet-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/shadow-puppet/dist/shadow-puppet-v1.0.0.html))
- Cuts: `short` (6 bars = 15.0 s), `30` (12 bars = 30.0 s), all at 96 BPM.

> 그림자 토끼전 is a fictional show of a public folk tale. Every puppet is drawn by code; the music plays a bowed psaltery, a zither, a flute, a gong and a frame drum recorded for two CC0 libraries.

## Folder

```
shadow-puppet/
  source/                 4 file(s)
    BRIEF.md
    fonts/GowunBatang-Bold.woff2
    fonts/OFL.txt
    fonts/SongMyung-Regular.woff2
  modules/                1 file(s)
    grim.js
  scenes/                 6 file(s)
    end.js
    escape.js
    hook.js
    meet.js
    palace.js
    sea.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/shadow-puppet
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/shadow-puppet-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/shadow-puppet.html
```

## How the puppets were cut

1. **Leather with holes.** `modules/grim.js` draws each puppet into its own buffer as a warm dark silhouette, cuts its
   carved holes out so the lamp shows through, and lays translucent dye (red, green, blue, gold, pink) into some of
   them; jointed parts (ears, flippers, a sleeve) turn on pivots and rods run down past the stage edge.
2. **A lamp behind cloth.** The screen is a radial gradient from a cream centre to burnt orange that flickers with
   three slow sines, with a woven texture multiplied in; a puppet lifted off the cloth is drawn larger and blurred
   until it is pressed to it.
3. **Boards and the stage.** Titles are boards with their letters cut through, dropped in on two strings with a
   swing; the proscenium, red curtains and the subtitle strip are drawn over the screen's edge last.

## What the tone pass decided

- **palette.** Lamplight through cloth: a screen that glows from cream #FFE2A8 at the lamp to burnt orange and deep brown at its edges, flickering; shadows a warm dark brown #24150E, never black; dyed holes in the leather in red #D9503A, green #5FA35A, blue #3F7FC4, gold #F2B640 and pink; a dark wooden proscenium with red curtains.

- **type.** Song Myung, a brushed serif, cut through the hanging boards so the lamp shows through the letters; Gowun Batang for the subtitles under the stage.

- **motion.** Puppet motion: jointed parts turning on pivots (ears, flippers, a sleeve), hops on the beat in arcs, a turtle that swims and stretches its neck, boards that drop in on strings and sway, the moon lowered on its rod; a puppet lifted off the screen is soft and large until it is pressed to the cloth; the lamp flickers all the time.

- **sound.** Folk at 96 BPM in D major on a pentatonic scale (0 2 4 7 9) with recorded instruments (VCSL and VSCO 2 CE, CC0): a bowed psaltery bed like a haegeum, a plucked zither (dan tranh) like a gayageum, a flute hook like a daegeum, an upright bass, kick and shaker; a gong (jing) opens and closes the play, a frame drum (buk) marks the hops.

- **visuals.** All code: each puppet is drawn into its own buffer as a silhouette, its carved holes cut out (destination-out) so the screen shows through, translucent dye laid into some; rods run down past the stage edge; the screen is a radial lamp gradient with a woven texture multiplied in.

- **narration.** Not recommended: the subtitles tell the tale.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `meet` | 2 | 2 |
| `sea` | - | 2 |
| `palace` | - | 2 |
| `escape` | - | 2 |
| `end` | 2 | 2 |

## Scenes

**`hook`**: hook (2 bars): the house is dark; the lamp catches behind the screen and the cloth warms up, flickering; a board with 그림자 토끼전 cut through it drops in on two strings and sways; the rabbit pops up from below on its rods, blurred while it is off the screen, then hops twice on the beat. Under the stage: 달빛 극단 어린이 그림자극.

**`meet`**: meet (2 bars): the shore. A hill with a pine on the left, the sea on the right; the turtle swims in, climbs out and stretches its neck in a bow; the rabbit hops in from the hill and flicks its ears. 바닷속 자라가 뭍에 올라 토끼를 만났어요.

**`sea`**: sea (30-second cut, 2 bars): under the sea. Back and front strips of waves roll the other way; fish cross; the turtle swims across with the rabbit riding on its shell, bubbles rising. 토끼를 등에 태우고 용궁으로.

**`palace`**: palace (30-second cut, 2 bars): the dragon king's palace with its windows glowing through gold dye; the king waves his sleeve; the rabbit, ears twitching, answers. “간은 뭍에 두고 왔는걸요!”

**`escape`**: escape (30-second cut, 2 bars): a moon is lowered on its rod; the rabbit leaps from the turtle's back to the shore in big arcs, one per beat, past the moon. 꾀 많은 토끼는 뭍으로 깡충.

**`end`**: end (2 bars): under the moon the rabbit sits on its hill; the board 그림자 토끼전 swings in, then a second board, 불을 끄면, 이야기가 켜져요; the lamp flickers; under the stage: 달빛 극단 · 토요일 오후 3시 · 가상의 공연입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (bowed-psaltery, dan-tranh, flute); some cues are recordings too (frame-drum, gong, woodblock), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
