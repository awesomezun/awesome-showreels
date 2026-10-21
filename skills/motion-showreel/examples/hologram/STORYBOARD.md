# 오르빗 컨트롤: storyboard and build contract

Generated from the project files (reel.config.json, the cut plans, the scene headers and style.json); the scene
headers are the authority for the beat-by-beat choreography.

## 1. Brief

- **Material:** `source/BRIEF.md` (markdown); `source/fonts/` (other)
- **Mood:** calm, precise, futuristic, luminous, in control
- **Purpose:** launch
- **Fiction:** the platform, the operator, the satellites and every figure are invented (`source/BRIEF.md`); the end card says so.

## 2. Style summary (read-only; from `style.json`)

- Theme dark · bg `#04060E` · ink `#E8F8FF` · accent `#56D8FF` · accent2 `#FF9A3C` · accent3 `#A8ECFF`
- Display `"Orbit"` · body `"Orbit"`
- Motion: medium pace, `ioC`, transitions cut, glitch
- Sound: dark-synth · 112 BPM · A minor · pad, saw-pluck, saw-bass, stab, lead, kick, clap, snare, hats

## 3. Cuts

| Cut | Bars | Length |
|---|---|---|
| `short` | 7 | 15.0 s |
| `30` | 14 | 30.0 s |

One bar = 2.143 s at 112 BPM; every scene starts on a bar line in every cut.

## 4. Scenes

### 4.1 `hook`: 오르빗 컨트롤

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 1 beats · entrance `cut` · music part `intro`
- Cues: buzz @ start+0.5b, swell @ start+1b, beep @ start+2b

hook (2 bars): a dark control room; the projector on the table switches on, its cone of light flickers up, and the globe draws itself from the bottom up in wireframe and land dots; the orbit rings follow; 오르빗 컨트롤, 위성 관제 플랫폼.

### 4.2 `fleet`: 궤도 위 300기를 한 화면에

- Bars: short 3 · 30 s 4 (min 3, max 4) · in 11 beats, out 1 beats · entrance `cut` · music part `groove`
- Cues: tick n=16 gap=0.04 @ start+0.5b, confirm @ start+5b

fleet (3-4 bars): the core message, shown. Satellites switch on across the three shells as a counter runs to 300, low orbits fast, the geostationary ring slow; the globe turns; 궤도 위 300기를 / 한 화면에; a panel breaks the count down by shell.

### 4.3 `zoom`: 한 기씩, 자세히

- Bars: short - · 30 s 3 (min 3, max 3) · in 11 beats, out 1 beats · entrance `cut` · music part `breakdown`
- Cues: lock @ start+0.75b, beep n=4 gap=0.33 @ start+2b

zoom (3 bars, 30-s cut): one satellite. It lights orange in the fleet, a leader line runs to a panel, and the panel shows it in turning wireframe with its telemetry typing in: 배터리 92%, 고도 550km, 속도 7.6km/s; 한 기씩, 자세히.

### 4.4 `alert`: 충돌 위험, 3분 전에 피해요

- Bars: short - · 30 s 3 (min 3, max 3) · in 11 beats, out 1 beats · entrance `cut` · music part `drop`
- Cues: buzz @ start+0b, whoosh @ start+4.5b, confirm @ start+6.75b

alert (3 bars, 30-s cut): a collision warning. A piece of debris (orange) crosses towards one satellite; a counter reads 충돌 위험 03:00; the satellite raises its orbit along a short arc and the paths part: 회피 완료; 충돌 위험, / 3분 전에 피해요.

### 4.5 `end`: 오르빗 컨트롤

- Bars: short 2 · 30 s 2 (min 2, max 2) · in 7 beats, out 0 beats · entrance `cut` · music part `outro`
- Cues: chime @ start+0.25b

end (2 bars): the globe and the fleet turning over the projector; 오르빗 컨트롤, 위성 관제 플랫폼, the fiction label.

