# 꼬마 화가: storyboard and build contract

Generated from the project files (reel.config.json, the cut plans, the scene headers and style.json); the scene
headers are the authority for the beat-by-beat choreography.

## 1. Brief

- **Material:** `source/BRIEF.md` (markdown); `source/fonts/` (other)
- **Mood:** warm, clumsy, unhurried, cheerful, handmade
- **Purpose:** launch
- **Fiction:** 꼬마 화가 is invented for this example (`source/BRIEF.md`); the end card says so.

## 2. Style summary (read-only; from `style.json`)

- Theme light · bg `#F7EFDC` · ink `#34323C` · accent `#E2483A` · accent2 `#3E7FD0` · accent3 `#58A846`
- Display `"Gaegu"` · body `"Gaegu"`
- Motion: medium pace, `outBack`, transitions cut, match
- Sound: bright-pop · 112 BPM · F major · ukulele, marimba, bell, tri-bass, kick, clap, shaker

## 3. Cuts

| Cut | Bars | Length |
|---|---|---|
| `short` | 7 | 15.0 s |
| `30` | 14 | 30.0 s |

One bar = 2.143 s at 112 BPM; every scene starts on a bar line in every cut.

## 4. Scenes

### 4.1 `hook`: 꼬마 화가

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `intro`
- Cues: drawon dur=2b @ start+0b, pop x5 gap=0.25b @ start+1b, drawon dur=1.5b @ start+3b

hook (2 bars): the name, in crayon. A sun scribbles itself in the corner; 꼬마 화가 pops on a letter at a time in the crayon box's colours; a crayon stick rides the underline it scribbles; the kicker says what it is (그림책 만드는 앱) and the subline says what it does.

### 4.2 `draw`: 아이가 그리면

- Bars: short 2 · 30 s 3 (min 2, max 3) · in 7 beats, out 1 beats · entrance `push` · music part `groove`
- Cues: swish @ start+0b, drawon dur=2b @ start+0.25b, drawon dur=2b @ start+2.5b, drawon dur=2b @ start+4.5b

draw (2-3 bars): a child's drawing draws itself at hand speed: the hills, the house, the tree, the child, the kite and its string, the sun and the clouds; a crayon stick rides the hills' edge, then the roof. The line 아이가 그리면, sits top left. In the hold the lines keep boiling and the kite keeps flying.

### 4.3 `field`: 크레파스 한 통

- Bars: short - · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `match` · music part `groove`
- Cues: pop x12 gap=0.5b @ start+0.5b

field (2 bars, 30-s cut): the same drawing, and the child keeps colouring: flowers pop up along the hills one by one in six colours, the kite climbs; 크레파스 한 통이면 충분해요.

### 4.4 `book`: 그림이 동화책이 돼요

- Bars: short 2 · 30 s 3 (min 2, max 3) · in 7 beats, out 1 beats · entrance `match` · music part `drop`
- Cues: swish @ start+0b, flip @ start+2b, drawon dur=3b @ start+3b

book (2-3 bars): the core message. The whole drawing shrinks onto the right-hand page of an open book drawn in crayon; the story is written on the left page a line at a time (옛날 옛적에…); above the book, 그림이 동화책이 돼요.

### 4.5 `pages`: 한 장씩 넘기면

- Bars: short - · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `match` · music part `drop`
- Cues: flip @ start+0.5b, flip @ start+2.5b

pages (2 bars, 30-s cut): the book keeps going. Two pages turn, each on a beat pair, showing more of the child's drawings (a night with the moon, a birthday cake); 한 장씩 넘기면, 우리 아이 이야기.

### 4.6 `end`: 꼬마 화가

- Bars: short 1 · 30 s 2 (min 1, max 2) · in 3 beats, out 0 beats · entrance `push` · music part `outro`
- Cues: swish @ start+0b, pop x5 gap=0.25b @ start+0.25b, chime @ start+2b

end (1-2 bars): the name again, one crayon colour per letter, a scribbled star, the child waving; 오늘 그린 그림이 내일 동화책으로, and the fiction label.

