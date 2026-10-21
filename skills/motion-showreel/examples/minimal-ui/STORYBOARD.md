# 하루 세 칸: storyboard and build contract

Generated from the project files (reel.config.json, the cut plans, the scene headers and style.json); the scene
headers are the authority for the beat-by-beat choreography.

## 1. Brief

- **Material:** `source/BRIEF.md` (markdown); `source/fonts/` (other)
- **Mood:** clean, calm, precise, light, quietly delightful
- **Purpose:** launch
- **Fiction:** 하루 세 칸, its screens and its numbers are invented (`source/BRIEF.md`); the end card says so.

## 2. Style summary (read-only; from `style.json`)

- Theme light · bg `#F4F5F7` · ink `#1F2430` · accent `#3B6EF5` · accent2 `#2BB673` · accent3 `#8C6CF2`
- Display `"Pretendard Variable"` · body `"Pretendard Variable"`
- Motion: medium pace, `ioC`, transitions cut
- Sound: bright-pop · 128 BPM · E major · pad, bell, glass, marimba, bass, kick, clap, hats

## 3. Cuts

| Cut | Bars | Length |
|---|---|---|
| `short` | 8 | 15.0 s |
| `30` | 16 | 30.0 s |

One bar = 1.875 s at 128 BPM; every scene starts on a bar line in every cut.

## 4. Scenes

### 4.1 `hook`: 하루 세 칸

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `intro`
- Cues: bloop @ start+0b, blip @ start+1b, blip @ start+2b, blip @ start+3b

hook (2 bars): the icon and the name. The app icon springs up in the middle of a near-white desk and its three bars fill a beat apart; 하루 세 칸 and the line that says what it is (할 일은 세 개만 적는 습관 앱) rise under it.

### 4.2 `tasks`: 오늘의 세 칸

- Bars: short 3 · 30 s 4 (min 3, max 4) · in 11 beats, out 1 beats · entrance `dissolve` · music part `groove`
- Cues: click @ start+2b, click @ start+4b, click @ start+6b, confirm @ start+6.25b, sparkle dur=2b @ start+6.5b

tasks (3-4 bars): the day, used for real. One card: 오늘, the date, a progress ring; three rows (물 2L 마시기, 20분 걷기, 책 10쪽 읽기). The cursor glides to each check and clicks on the beat; the row ticks, greys and strikes through, the ring steps 1/3, 2/3, 3/3; on the third an iridescent bloom opens behind the card, confetti bursts and a 오늘 완료 chip slides up. The hold breathes; the ring glints on each bar line.

### 4.3 `week`: 이번 주

- Bars: short - · 30 s 4 (min 3, max 4) · in 11 beats, out 1 beats · entrance `dissolve` · music part `groove`
- Cues: tick x21 gap=0.25b @ start+0.75b, click @ start+5b

week (3 bars, 30-s cut): the week as 21 dots that fill day by day, a 연속 12일 streak badge, and the one setting the app has: the cursor flips 저녁 알림 on (알림은 저녁에 한 번만).

### 4.4 `message`: 할 일은 딱 세 칸

- Bars: short 2 · 30 s 4 (min 2, max 4) · in 7 beats, out 1 beats · entrance `dissolve` · music part `drop`
- Cues: shimmer @ start+0b

message (2 bars): the core line, alone on the desk: 할 일은 / 딱 세 칸. (the second line blue), and under it 많이 말고, 꾸준히.; the bloom glows behind the words on the beat.

### 4.5 `end`: 하루 세 칸

- Bars: short 1 · 30 s 2 (min 1, max 2) · in 3 beats, out 0 beats · entrance `dissolve` · music part `outro`
- Cues: chime @ start+0b

end (1-2 bars): the icon again with its bars full, the name, and the fiction label.

