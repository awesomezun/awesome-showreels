# 5초 미션: storyboard and build contract

Generated from the project files (reel.config.json, the cut plans, the scene headers and style.json); the scene
headers are the authority for the beat-by-beat choreography.

## 1. Brief

- **Material:** `source/BRIEF.md` (markdown); `source/fonts/` (other)
- **Mood:** frantic, funny, loud, colourful, playful
- **Purpose:** launch
- **Fiction:** the game, its missions and its name are invented (`source/BRIEF.md`). The end card says the game is fictional.

## 2. Style summary (read-only; from `style.json`)

- Theme dark · bg `#1B1B2F` · ink `#FFFFFF` · accent `#FFE14D` · accent2 `#FF2E4D` · accent3 `#3DA5FF`
- Display `"Bagel Fat One"` · body `"Galmuri11"`
- Motion: energetic pace, `outBack`, transitions cut
- Sound: chiptune · 144 BPM · D major · pulse, tri-bass, pulse-lead, kick, snare, hats

## 3. Cuts

| Cut | Bars | Length |
|---|---|---|
| `short` | 9 | 15.0 s |
| `30` | 18 | 30.0 s |

One bar = 1.667 s at 144 BPM; every scene starts on a bar line in every cut.

## 4. Scenes

### 4.1 `hook`: 5초 미션

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `intro`
- Cues: blip @ start+0.5b, beep @ start+4b, beep @ start+5b, beep @ start+6b, confirm @ start+7b

hook (2 bars): the logo pops onto flashing stripes with a lit bomb; then the count: 3, 2, 1, 시작!

### 4.2 `rules`: 규칙은 하나

- Bars: short - · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `breakdown`
- Cues: blip @ start+1b, blip @ start+2b, blip @ start+4b, blip @ start+5b

rules (30-second cut, 2 bars): how to play: a word appears (눌러!), the fuse burns; 지시어를 보고, 도화선이 다 타기 전에!

### 4.3 `level1`: 레벨 1

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `groove`
- Cues: blip @ start+0b, blip @ start+4b, coin @ start+3b, coin @ start+7b

level1: games of 4 beat(s) each from game 0 on; the instruction pops, the fuse burns, 성공! and the score goes up.

### 4.4 `speed`: 속도 UP!

- Bars: short 1 · 30 s 1 (min 1, max 1) · in 3 beats, out 1 beats · entrance `cut` · music part `breakdown`
- Cues: zoom @ start+0b, confirm @ start+2b

speed (1 bar): 속도 UP! on rushing speed lines, then LEVEL 2.

### 4.5 `level2`: 레벨 2

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `groove`
- Cues: blip @ start+0b, blip @ start+2b, blip @ start+4b, blip @ start+6b, coin @ start+1.5b, coin @ start+3.5b, coin @ start+5.5b, coin @ start+7.5b

level2: games of 2 beat(s) each from game 2 on; the instruction pops, the fuse burns, 성공! and the score goes up.

### 4.6 `speed2`: 속도 UP!

- Bars: short - · 30 s 1 (min 1, max 1) · in 3 beats, out 1 beats · entrance `cut` · music part `breakdown`
- Cues: zoom @ start+0b, confirm @ start+2b

speed2 (1 bar): 속도 UP! on rushing speed lines, then LEVEL 3.

### 4.7 `level3`: 레벨 3

- Bars: short - · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `drop`
- Cues: blip @ start+0b, blip @ start+1b, blip @ start+2b, blip @ start+3b, blip @ start+4b, blip @ start+5b, blip @ start+6b, blip @ start+7b

level3: games of 1 beat(s) each from game 6 on; the instruction pops, the fuse burns, 성공! and the score goes up.

### 4.8 `boss`: 모두 터뜨려!

- Bars: short - · 30 s 3 (min 3, max 3) · in 11 beats, out 1 beats · entrance `cut` · music part `drop`
- Cues: pop @ start+2b, pop @ start+3b, pop @ start+4b, pop @ start+5b, pop @ start+6b, pop @ start+7b, pop @ start+8b, pop @ start+9b, pop @ start+10b, coin @ start+11b

boss (30-second cut, 3 bars): 모두 터뜨려! a wall of balloons, one popping on every beat, then the last big one.

### 4.9 `end`: 5초면 충분해!

- Bars: short 2 · 30 s 3 (min 2, max 3) · in 7 beats, out 0 beats · entrance `cut` · music part `outro`
- Cues: sparkle dur=2b @ start+0b, coin @ start+2b

end (2 bars, 3 in the 30-second cut): confetti and the logo: 5초면 충분해!, 5초 미션 · 가상의 파티 게임입니다.

