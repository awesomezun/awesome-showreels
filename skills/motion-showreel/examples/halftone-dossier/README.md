# Example: halftone-dossier (어디쯤 택배)

A made-up app goes in (어디쯤 택배: a parcel tracker that shows where your parcel is on a map); a deadpan case file
comes out, printed like a newspaper. A manila folder slides up the desk, 사라진 택배 is stencilled on it and 사건 파일
is stamped in red; a camera flash and the mugshot, the parcel in halftone against a height chart, while the last
sighting is typed and a redaction bar slides off the terminal's name; on the cork board four pins pop with their times
and red string runs to the door; the case closes on a halftone photo of the parcel on the doormat, stamped 해결:
사건 종결: 택배는 문 앞에. The 30-second cut adds the waybill under a magnifying glass and the app itself. One of the
24 styles studied from eight repositories of code-rendered video; only the style is borrowed.

- Web version with every cut: [`dist/halftone-dossier-v1.0.0.html`](dist/halftone-dossier-v1.0.0.html) ([play in the browser](https://raw.githack.com/AwesomeZun/Awesome-Showreels/main/skills/motion-showreel/examples/halftone-dossier/dist/halftone-dossier-v1.0.0.html))
- Cuts: `short` (8 bars = 15.0 s), `30` (16 bars = 30.0 s), all at 128 BPM.

> 어디쯤 택배 is fictional. Every halftone, stamp and card is drawn by code; the band plays recorded instruments from two CC0 libraries.

## Folder

```
halftone-dossier/
  source/                 4 file(s)
    BRIEF.md
    fonts/BlackHanSans-Regular.woff2
    fonts/NanumGothicCoding-Bold.woff2
    fonts/OFL.txt
  modules/                1 file(s)
    dossier.js
  scenes/                 6 file(s)
    app.js
    clue.js
    end.js
    hook.js
    suspect.js
    trail.js
  style.json
  reel.config.json
  STORYBOARD.md
  dist/
```

## Run it

```bash
S=skills/motion-showreel; P=$S/examples/halftone-dossier
python3 $S/tools/extract_style.py --source $P/source --project $P --board      # draft style (review by hand)
python3 $S/timing/plan_cut.py --project $P --cut short,30
for c in short 30; do python3 $S/audio/arrange.py --project $P --cut $c; done
python3 $S/audio/verify_sync.py --wav $P/build/music-short.wav --cut $P/build/cut-short.json
node $S/runtime/render.mjs --project $P --cut short --out out/halftone-dossier-short.mp4
node $S/runtime/build.mjs --project $P --cuts short,30 --out out/halftone-dossier.html
```

## How the case file was printed

1. **Halftone from greys.** `modules/dossier.js` draws each picture once in greys (a shaded parcel with tape and a
   label, its mugshot with a height chart, a district map, the parcel at a front door), reads the pixels back and
   re-draws them as a 45-degree grid of ink dots whose radius follows the darkness; the result is cached and mounted
   with a white border, a shadow and a paperclip.
2. **Paperwork on the beat.** A typewriter lands one character at a time with a little jitter and a caret; stamps
   are cut once with specks and slam in from 1.6x; pins pop one per beat and red string sags from pin to pin;
   redaction bars slide off; a magnifier redraws the waybill enlarged inside its glass.
3. **The dot wipe.** Every scene ends with red dots growing over the frame along a diagonal and the next one starts
   with them shrinking away, so cuts land inside a full field of dots.

## What the tone pass decided

- **palette.** A case file printed like a newspaper: newsprint #EDE8DC and cream card for the prints, ink #1D1B19 for every halftone dot and typed letter, one rubber-stamp red #D23B2E (stamps, pins, string, the route and the dot wipe), a manila folder #D8B878 on a dark lamp-lit desk #3B2F27 and a cork board.

- **type.** Black Han Sans for the stencilled and stamped words; Nanum Gothic Coding as the typewriter, each character landing with a tiny jitter and a caret.

- **motion.** Police-procedural beats on the beat: a folder slides up, stamps slam in from 1.6x, a camera flash, typing, a redaction bar sliding off, pins popping one per beat with red string running pin to pin, a magnifier sliding over the evidence; scenes change through a dot wipe of red halftone dots.

- **sound.** Swing at 128 BPM in F minor, a detective cue on recorded instruments (VCSL and VSCO 2 CE, CC0): vibraphone comping on the Charleston rhythm, a pizzicato walking bass, a clarinet hook, ride and brushes; typewriter keys and a bell, stamps, pin pops, a flash, a swish for each dot wipe.

- **visuals.** All code: every picture (the parcel, its mugshot, the district map, the parcel at the door) is drawn once in greys, read back, and re-drawn as a rotated grid of ink dots sized by darkness; mounts with borders and paperclips, rough stamps cut with specks, index cards, a phone with the route drawing on its halftone map.

- **narration.** Not recommended: the case file is read, not told.

## Same BPM, more bars

The 30-second cut is the same reel with longer holds (and optional scenes where they exist); the tempo never changes.

| Scene | short | 30 s |
|---|---|---|
| `hook` | 2 | 2 |
| `suspect` | 2 | 3 |
| `trail` | 2 | 3 |
| `clue` | - | 2 |
| `app` | - | 3 |
| `end` | 2 | 3 |

## Scenes

**`hook`**: hook (2 bars): out of a red dot field, a manila folder slides up the desk. 사라진 택배 is stencilled on it, the tab is typed (No.0427 · 어디쯤 택배 수사 기록), 사건 파일 is stamped in red on the second beat and a halftone photo of the parcel is clipped on; red dots grow over everything on the last beat.

**`suspect`**: suspect (2 bars; 3 in the 30-second cut): a flash, and the mugshot: the parcel in halftone against a height chart, a placard 피의자 · 택배 상자 · 2.4 kg; beside it 마지막 목격, 어제 오후 1시 40분 is typed and a redaction bar slides off 장소: 한빛 터미널.

**`trail`**: trail (2 bars; 3 in the 30-second cut): the cork board. A halftone map of the district is pinned up under 행적 추적; four pins pop one per beat with their index cards (09:12 출고, 13:40 터미널, 16:05 배송 출발, 18:22 문 앞) and red string runs from pin to pin to the door.

**`clue`**: clue (30-second cut, 2 bars): evidence 1, the waybill. A label with a barcode and typed lines lies under the lamp; a magnifying glass slides across it, enlarging what it passes, and stops on 배송 예정: 오늘 18시.

**`app`**: app (30-second cut, 3 bars): the culprit is a tracker. A phone shows 어디쯤 택배: the halftone map with the route drawing on in red and the parcel's dot moving along it; a notice pops, 두 정거장 전이에요; beside it the app's name, 지금 어디쯤인지, 지도에서 바로, and its three features typed.

**`end`**: end (2 bars; 3 in the 30-second cut): the last photo, the parcel on the doormat before the front door, in halftone; 해결 is stamped across its corner on the first beat; 사건 종결: / 택배는 문 앞에, then 어디쯤 택배 and 가상의 앱입니다.

## Provenance and credits

- The material in `source/` was written for this example; the project is fictional and the reel says so on screen.
- Music and sound effects are made by `audio/`: the arrangement plays recorded instruments (vibraphone, bass-pizz, clarinet-real), from VCSL and VSCO 2 Community Edition (both CC0, by Versilian Studios); everything else is synthesized.
- Fonts ship with their licences: `source/fonts/OFL.txt`.
