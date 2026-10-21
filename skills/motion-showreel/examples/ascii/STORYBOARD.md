# 글자판 termpan: storyboard and build contract

Generated from the project files (reel.config.json, the cut plans, the scene headers and style.json); the scene
headers are the authority for the beat-by-beat choreography.

## 1. Brief

- **Material:** `source/BRIEF.md` (markdown); `source/fonts/` (other)
- **Mood:** clever, playful, plain, nerdy, tidy
- **Purpose:** launch
- **Fiction:** the tool, its command, the server and every number are invented (`source/BRIEF.md`); the end card says so.

## 2. Style summary (read-only; from `style.json`)

- Theme dark · bg `#14151F` · ink `#C0CAF5` · accent `#E0AF68` · accent2 `#7DCFFF` · accent3 `#BB9AF7`
- Display `"Nanum Gothic Coding"` · body `"Nanum Gothic Coding"`
- Motion: medium pace, `ioC`, transitions cut
- Sound: chiptune · 128 BPM · G major · pulse, tri-bass, pulse-lead, kick, snare, hats

## 3. Cuts

| Cut | Bars | Length |
|---|---|---|
| `short` | 8 | 15.0 s |
| `30` | 16 | 30.0 s |

One bar = 1.875 s at 128 BPM; every scene starts on a bar line in every cut.

## 4. Scenes

### 4.1 `hook`: 글자판

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `intro`
- Cues: keytap dur=1b @ start+0.25b, sparkle dur=2b @ start+2b, keytap dur=2b @ start+4.25b

hook (2 bars): a prompt, a blinking cursor; termpan is typed and run; the name 글자판 assembles out of flying characters, each landing on its cell with a character chosen by how much of the letter covers it; the tagline types.

### 4.2 `image`: 글자가 모이면 그림이 돼요

- Bars: short 4 · 30 s 5 (min 4, max 5) · in 15 beats, out 1 beats · entrance `cut` · music part `groove`
- Cues: keytap dur=1b @ start+0.25b, sparkle dur=3b @ start+1.5b, keytap dur=1b @ start+2b, keytap dur=1b @ start+4b

image (4-5 bars): the core message, shown. termpan draw: a thousand characters fly in from everywhere and land as the shaded donut (each cell's character set by the light on the torus), which then spins; on the right, 글자가 모이면 / 그림이 돼요 and a count of the characters.

### 4.3 `dash`: 서버 상태도 한눈에

- Bars: short - · 30 s 4 (min 4, max 4) · in 15 beats, out 1 beats · entrance `cut` · music part `drop`
- Cues: beep n=4 gap=0.75 @ start+0.5b, keytap dur=2b @ start+4b

dash (4 bars, 30-s cut): the dashboard. Boxes draw in one after another (CPU with a live sparkline, memory as a bar of blocks, network up and down, a process list that scrolls), all on the same grid of characters; 서버 상태도 한눈에.

### 4.4 `install`: 설치는 한 줄

- Bars: short - · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `breakdown`
- Cues: keytap dur=1.5b @ start+0.25b, confirm @ start+5.5b

install (2 bars, 30-s cut): brew install termpan is typed; a progress bar of blocks fills; [완료]; 설치는 한 줄.

### 4.5 `end`: 글자판

- Bars: short 2 · 30 s 3 (min 2, max 3) · in 7 beats, out 0 beats · entrance `cut` · music part `outro`
- Cues: chime @ start+0.5b

end (2-3 bars): the name again in characters, the install line, the fiction label; a small donut keeps turning in the corner.

