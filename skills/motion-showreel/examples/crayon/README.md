# Example: crayon (꼬마 화가)

A made-up picture-book app's one-page brief goes in (꼬마 화가: a child's crayon drawings become a picture book); a
reel drawn in crayon comes out, in Korean. Every mark is wax on yellowed drawing paper: three thin offset passes per
line, zig-zag scribbles for colour, the paper's tooth breaking it all, the lines boiling eight times a second like
hand-drawn animation. The name pops on a letter at a time, a child's drawing (hills, a house, a tree, a girl with a
kite) draws itself at hand speed with a crayon stick riding the line, then shrinks onto the right-hand page of an
open book while the story writes itself on the left: 그림이 동화책이 돼요. The 30-second cut adds a field of flowers
and two turning pages. One of the 24 styles from the series after the video *모션그래픽 20가지 톤* (Ai-Con Lab); only
the style is borrowed.

- Web version with every cut: [`dist/crayon-v1.0.0.html`](dist/crayon-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/crayon/dist/crayon-v1.0.0.html))
- Cuts: `short` (7 bars = 15.0 s), `30` (14 bars = 30.0 s), all at 112 BPM.

> 꼬마 화가 is fictional. Every name, line and drawing is made for this example, in code; no image files.

## Folder

```
crayon/
  source/                 3 file(s)
    BRIEF.md
    fonts/Gaegu-Bold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    crayon.js
  scenes/                 6 file(s)
    book.js
    draw.js
    end.js
    field.js
    hook.js
    pages.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/crayon
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/crayon-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/crayon.html
```

## How the crayon was made

1. **One layer, one tooth.** `modules/crayon.js` draws every mark of a frame on one canvas and then punches a fixed
   paper grain out of it (`destination-out`), so lines, fills and letters all break the same way, as wax does.
2. **Lines and fills.** A line is three thin passes offset by smooth noise; a fill is one zig-zag polyline clipped to
   its shape and drawn up to a fraction, so colouring happens at hand speed. Clouds trace the outer contour of their
   bumps, the sun spins its rays, the kite's tail waves.
3. **The boil.** The noise is re-seeded at 8 fps (`floor(t * 8)`), a pure function of time, so held frames keep
   trembling like hand-drawn animation and the motion audit finds no static span.

## What the tone pass decided

- **palette.** The brief asks for the basic crayon box on yellowed drawing paper: paper #F7EFDC, a soft charcoal ink #34323C, and the box itself (red #E2483A, orange #F2952B, yellow #F6C33B, green #58A846, sky #68B6E8, blue #3E7FD0, purple #8B5CC4, pink #EF7BA5, brown #8A5A2E). Each sentence takes one crayon.

- **type.** Gaegu, a handwritten Korean face, at 60-250 px: letters pop on one at a time with a slight tilt that settles, and they sit in the crayon layer, so the paper tooth breaks them like everything else.

- **motion.** Hand speed: every mark is drawn on along its own path (three thin offset passes per line, zig-zag scribbles for fills), the lines boil at 8 fps like hand-drawn animation, a crayon stick rides the line being drawn; pages slide up like a sketchbook and the drawing shrinks into a book.

- **sound.** Bright pop at 112 BPM in F major (7 bars in 15 s, 14 in 30 s) on ukulele, marimba and bells with a light kit; organic SFX: a crayon drawon for every mark, pops for the letters, a page flip.

- **visuals.** Everything is code: the paper (fibres, a fixed tooth), the crayon marks, the drawing (hills, a house, a tree, a child with a kite, the sun, clouds, flowers), the book and its turning pages. No images.

- **narration.** Not recommended: a short, music-led launch reel; every sentence is on screen.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `draw` | 2 | 3 |
| `field` | - | 2 |
| `book` | 2 | 3 |
| `pages` | - | 2 |
| `end` | 1 | 2 |

## Scenes

**`hook`**: hook (2 bars): the name, in crayon. A sun scribbles itself in the corner; 꼬마 화가 pops on a letter at a time in the crayon box's colours; a crayon stick rides the underline it scribbles; the kicker says what it is (그림책 만드는 앱) and the subline says what it does.

**`draw`**: draw (2-3 bars): a child's drawing draws itself at hand speed: the hills, the house, the tree, the child, the kite and its string, the sun and the clouds; a crayon stick rides the hills' edge, then the roof. The line 아이가 그리면, sits top left. In the hold the lines keep boiling and the kite keeps flying.

**`field`**: field (2 bars, 30-s cut): the same drawing, and the child keeps colouring: flowers pop up along the hills one by one in six colours, the kite climbs; 크레파스 한 통이면 충분해요.

**`book`**: book (2-3 bars): the core message. The whole drawing shrinks onto the right-hand page of an open book drawn in crayon; the story is written on the left page a line at a time (옛날 옛적에…); above the book, 그림이 동화책이 돼요.

**`pages`**: pages (2 bars, 30-s cut): the book keeps going. Two pages turn, each on a beat pair, showing more of the child's drawings (a night with the moon, a birthday cake); 한 장씩 넘기면, 우리 아이 이야기.

**`end`**: end (1-2 bars): the name again, one crayon colour per letter, a scribbled star, the child waving; 오늘 그린 그림이 내일 동화책으로, and the fiction label.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are synthesized by `audio/` (no samples).
- Fonts ship with their licences: `source/fonts/OFL.txt`.
