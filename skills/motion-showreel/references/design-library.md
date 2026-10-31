# Design directions: borrowing a look when the material has none

Most material carries its own look: a logo, a site's CSS, a deck theme, an app's UI. Some carries none: a text
brief, a paper set in a default template, a bare README, an outline in a word processor. For those, the reel can
borrow a **design direction** from a curated library instead of inventing one from tone alone. The library this skill
knows is the **shiraki.design YAML Library** (<https://shiraki.design/en/library>) by Shiraki (しらき＠パワポ図解,
X @kumiko_shiraki), operated by Chikamori Sangyo Co., Ltd.: free design specifications ("YAML") for slides and
infographics made with generative tools such as Gemini Notebook. Each entry names a palette, type, motifs, layout
rules and bans, with a sample image. On 2026-10-30 it held 256 entries: 236 slide looks (16:9) and 20 infographic
looks (Z01–Z20, portrait or 4:3) in 15 categories.

A direction is not a preset. It fills only what the material leaves open, the user chooses it, and two reels from
different material still look different. `tools/design_library.py` fetches entries one at a time into a cache outside
the repo and drafts palette roles from them; this file says when and how.

Contents: 1 when · 2 the library's terms · 3 procedure · 4 picking entries · 5 YAML fields → the spec · 6 motifs →
motion · 7 pitfalls.

## 1. When it earns its place

Reach for it when:

- **The material has no look of its own.** The extractor says so: `review` lists "no brand/accent colour found in
  the material", "no measured background", or accents "only from hex codes written in the text", and the board shows
  a palette derived from tone. Typical sources: a Korean or Japanese outline document, a LaTeX paper with black text
  and default plots, a README with no logo, screenshots or badges in a brand colour, a brief in chat.
- **The user names a look.** "Isometric", "editorial", "glass", "Memphis", "risograph", "Swiss", "Windows 98",
  "newspaper", "like this one" with a library link. Find the entries with `index --grep` or `--category`.
- **One scene type the material cannot style.** A branded reel with a data, process or timeline scene the brand guide
  never designed: borrow the entry's composition (chart forms, card structure, how numbers sit), drawn in the
  material's own colours and type.
- **A matching deck later.** The user can paste the same entry's YAML into Gemini Notebook for slides that look
  like the reel. They do that themselves from the site; the skill never hands the YAML out.

Leave it alone when:

- **The material has a design system.** Brand guide, CSS tokens, deck theme, app UI, a logo with colours: the
  extractor's evidence is the look. At most borrow a layout or a motif that agrees with it.
- **It would become a habit.** Never reach for the library on every reel, and never as the default when the
  extractor would have found something with one more source (add the site, the logo or a screenshot first).
- **The entry's bans fight the story.** "No 3D" while the claim is spatial, "no photos" for a hotel reel: pick
  another entry.

## 2. The library's terms, and what follows

The terms (<https://shiraki.design/en/terms>, updated 2026-10-28) grant a non-exclusive licence to make slides and
infographics with the YAML for personal, business or commercial use, to edit and adapt it for your own use, and to
share links to its pages. They forbid distributing, selling or publishing any YAML in whole or in part (modified
versions included; social media, blogs, template markets and shared folders are named), building a YAML library or
a similar service from the content, and bulk downloading with automated tools. On every page: "Please do not
redistribute or resell YAML from the Library."

So, binding for this skill and every project made with it:

- **The YAML text never enters a committed or published file.** Not `style.json` rationale, STORYBOARD, scenes,
  README, examples, tests, issues or this skill. Write rationale and copy rules in your own words and cite the entry
  by number, title and link. A style.json may hold the colours and type choices the reel actually uses; it never
  holds the entry's concept, rules or motif text.
- **No mirror.** The index and the entries live in the per-user cache (`design_library.py where`, default
  `~/.cache/motion-showreel/design-library/shiraki/`), never in a repo. This file names a few entries per category as
  links, nothing more. The derived `P/build/design-direction.{md,json}` sits in `build/`, which git ignores; do not
  copy it out.
- **No bulk download.** `get` takes at most 3 entries per run and 10 per 24 hours, pauses between requests, and
  serves the cache afterwards. Shortlist from the index first; open the site in a browser to browse thumbnails.
- **Credit.** The reel's credits or README carry a line such as "Design direction: shiraki.design No.236 Turquoise
  Corner Cut (link)". `meta.direction` in style.json records the same.
- No example in this repo is built from a library entry, so nothing derived from one is published here.

## 3. Procedure

```bash
S=<skill>                                                   # skills/motion-showreel
python3 "$S/tools/design_library.py" index                  # the live list by category (cached for 7 days)
python3 "$S/tools/design_library.py" index --category isometric --series slide
python3 "$S/tools/design_library.py" index --grep "glass|chrome"
python3 "$S/tools/design_library.py" get 049 070 Z14        # <= 3: YAML text + sample image into the cache
python3 "$S/tools/design_library.py" draft 049 --project P  # P/build/design-direction.md / .json
python3 "$S/tools/design_library.py" --help                 # --offline (cache only), --refresh
```

1. **Shortlist two or three** entries from the material's purpose, audience and mood (section 4), after the tone
   pass so the axes are known. `get` them and look at each sample image (`entries/<id>.webp` in the cache) and
   read the YAML.
2. **Let the user choose**, unless they named an entry: number, title, link and one sentence on why each fits.
   This is a creative decision the material cannot answer. Set `meta.direction.approved` to `true` once chosen.
3. **Draft.** `draft <id> --project P` writes palette roles with their contrast on bg and where each came from
   (the entry, or derived to reach 7:1 for ink, 4.5:1 for ink2, muted and accentInk, 3:1 for ok/warn/deny), the
   type groups, motifs mapped to engine moves, layouts mapped to scenes, and bans mapped to the look and `post`.
4. **Merge by hand into `style.json`** where the material is silent (section 5). Exact colours, fonts, wording and
   rules from the material win every conflict. Keep each rationale true: "palette after the design direction
   shiraki.design No.049, chosen by the client, because the paper has no colours of its own".
5. **Add provenance:** `meta.direction` `{library, id, title, url, why, approved}` and a `source` item
   `{url, kind: "design-library", notes}` (the draft prints both). Validate, render the board, show it.
6. **Motion and storyboard.** The entry is still; the reel moves at its own pace (section 6). Its layout system
   becomes the scene list (section 5), and its bans hold in motion too.
7. **Credit** the entry in the delivery (credits line, README of the reel).

## 4. Picking entries

| category (count) | suits | entries to look at first |
|---|---|---|
| Business (31) | pitch decks, corporate news, recruiting, reports | [033](https://shiraki.design/en/library/033) Black Data Report, [044](https://shiraki.design/en/library/044) Orange Pitch, [233](https://shiraki.design/en/library/233) Cobalt AI Platform, [236](https://shiraki.design/en/library/236) Turquoise Corner Cut |
| Editorial (32) | brand stories, lifestyle, fashion, health | [005](https://shiraki.design/en/library/005) Dark Editorial, [126](https://shiraki.design/en/library/126) Lifestyle Magazine, [207](https://shiraki.design/en/library/207) Corporate Healthcare Editorial, [215](https://shiraki.design/en/library/215) Luxury Fashion |
| Minimal & Mono (14) | papers, architecture, calm pitches | [022](https://shiraki.design/en/library/022) Monochrome Architecture, [122](https://shiraki.design/en/library/122) Neo Swiss, [123](https://shiraki.design/en/library/123) Cinematic Infographic |
| UI & Modern (20) | SaaS, developer tools, AI products | [085](https://shiraki.design/en/library/085) Aurora Glass, [161](https://shiraki.design/en/library/161) Brutalist UI, [163](https://shiraki.design/en/library/163) Minimal Dashboard, [228](https://shiraki.design/en/library/228) Cosmic Wireframe Grid |
| Photo & 3D (28) | products, hardware, launches (pairs with `G3`) | [105](https://shiraki.design/en/library/105) Miniature Metaphor, [185](https://shiraki.design/en/library/185) Multi 3D-Typo, [219](https://shiraki.design/en/library/219) Glass Bubble Brutalist, [224](https://shiraki.design/en/library/224) Iridescent Chrome Editorial |
| Pop & Colorful (24) | consumer launches, events, fitness, learning | [120](https://shiraki.design/en/library/120) Neon Poster, [169](https://shiraki.design/en/library/169) Neo Memphis, [203](https://shiraki.design/en/library/203) Bold Fitness |
| Art & Creative (22) | culture, festivals, studios | [062](https://shiraki.design/en/library/062) Neo Mondrian, [078](https://shiraki.design/en/library/078) Neo Risograph, [181](https://shiraki.design/en/library/181) Ukiyo-e Editorial, [227](https://shiraki.design/en/library/227) Holographic Swiss Editorial |
| Characters (22) | playful apps, education, children | [097](https://shiraki.design/en/library/097) Bauhaus Cartoon, [129](https://shiraki.design/en/library/129) Cat Magazine, [160](https://shiraki.design/en/library/160) Friendly Blob |
| Isometric (14) | systems, platforms, cities, logistics, labs | [049](https://shiraki.design/en/library/049) Academic Isometric, [053](https://shiraki.design/en/library/053) City Isometric, [056](https://shiraki.design/en/library/056) Cyber Isometric, [070](https://shiraki.design/en/library/070) Architectural Isometric |
| Infographic (12) | data-heavy explainers, surveys | [084](https://shiraki.design/en/library/084) Digital Blueprint, [094](https://shiraki.design/en/library/094) Dark Infographic, [168](https://shiraki.design/en/library/168) Survey Infographic |
| Retro & Fun (9) | nostalgia, games, news-style | [146](https://shiraki.design/en/library/146) Windows98 UI, [178](https://shiraki.design/en/library/178) Monochrome Newspaper, [180](https://shiraki.design/en/library/180) American Comic |
| Brand (8) | brand-guide reels | [025](https://shiraki.design/en/library/025) Soft Brand System, [155](https://shiraki.design/en/library/155) Brand Guideline, [176](https://shiraki.design/en/library/176) Geometric Guideline |
| Isometric, pictogram and illustrated diagrams (Z01–Z20) | one data scene, a vertical cut, a public-service reel | [Z05](https://shiraki.design/en/library/z05) Blue Turquoise Statistics Tiles, [Z13](https://shiraki.design/en/library/z13) Yellow Cyan Isometric KPI Network, [Z19](https://shiraki.design/en/library/z19) Teal Data Illustration, [Z20](https://shiraki.design/en/library/z20) Yellow Black Poster |

By the extractor's purpose:

| purpose | look first in |
|---|---|
| paper | Minimal & Mono, Infographic, Isometric (Academic), Editorial |
| pitch | Business, UI & Modern, Infographic |
| launch (consumers) | Pop & Colorful, Photo & 3D, Characters |
| tool, docs (developers) | UI & Modern (Tech, Brutalist UI, Wireframe), Infographic (Blueprint) |
| brand | Brand, Editorial |
| explainer | Infographic, Isometric, Characters, the Z diagrams |
| recruiting | Business (the Recruit entries) |

Slide entries are 16:9, the reel's default. The Z entries are portrait (2:3, 3:4) or 4:3: they suit a vertical cut
(storyboard aspect variants) or one infographic scene. New entries arrive often; `index --refresh` shows them.

## 5. YAML fields → the spec

Entries share a vocabulary but not a schema, and they are written flat (no indentation). `draft` rebuilds the
outline: a key with no value after a blank line opens a section, consecutive empty keys nest.

| YAML | goes to | notes |
|---|---|---|
| Name, Concept | `meta.direction.title`; your own one-line `why` | never copy the concept text |
| Canvas: Ratio, Background, Margin, Grid | aspect variant; `palette.bg`; `layout.margin` ("Wide" ≈ 120–160 px at 1080p); `layout.grid` ("modular grid" ≈ 12 columns) | |
| Mood | `mood`, only the words the material agrees with; pace through the tone tables | the entry says nothing about motion |
| Color Palette (Primary, Secondary, Accent…) | the twelve palette roles via `draft`; leftovers to `swatches` | fills under 3:1 stay fills; text in the accent hue is `accentInk` |
| Typography (Heading, Body, Label, Numeric…) | `fonts` stacks matched by weight and width; `type.scale` | Japanese sans (ゴシック) → the reel's Korean sans (Pretendard, SUIT, Noto Sans KR); Mincho (明朝) → Noto Serif KR; embed what you use |
| Rules, Content Rules | STORYBOARD copy rules, in your words | "big bold numbers" → impact numbers (recipe 27) |
| Graphic Motif, Visual Elements, Decorative | scene motifs (section 6) | |
| Layout System (Cover, SectionDivider, Standard, Timeline, Data, Profiles), Layout, Charts | the scene list and each scene's composition | Cover → opener; SectionDivider → an act card or the transition; Data/Charts → counters and charts from real numbers; Profiles → tile wall (recipe 24) |
| Photography | `photos` carriers and their grade in `post` | |
| Overall Rules, Restrictions | bans on the look, carriers, transitions and `post` | "no shadows" → no drop shadows on flying cards, `post.vignette.a` 0; "no 3D" → no `solid-3d`, no 3D transitions; "no gradients" → flat fills |

Lines like "do not reuse the sample image's wording, numbers or logos" are instructions to a generator; the reel's
copy and numbers come from the material anyway.

## 6. Motifs → motion

The entry describes a still page. The reel adds time, at the BPM and pace from the tone pass.

| motif (as entries write it) | in motion | engine |
|---|---|---|
| corner cuts, diagonals (斜め, カット) | slanted masks wipe content in; scene changes cut along the diagonal | clip paths, `match` or `cut` on the beat |
| geometric lines, connectors (罫線, 接続線) | lines draw on, nodes land on beats | stroke dash offset, `beatAt` |
| info cards, panels (カード) | cards rise and settle with little overshoot, one claim each | springs from `motion.spring` |
| glass, bubbles (ガラス, バブル) | refraction drifts as the camera moves | `G3` `glass`/`crystal` with something behind; 2D: blur and a light edge |
| liquid chrome, metal (クローム) | reflections slide across a slowly morphing blob | `G3` `chrome`, `deform.wave`/`morph` |
| iridescent, holographic (ホログラ, オーロラ) | hue drifts across the surface | `G3` `iridescent`; 2D gradient hue drift |
| 3D type (立体文字) | letters fly in from depth | `G3.geo.text` from the reel's own font |
| miniature (ミニチュア) | a high camera over a tilt-shifted world | `G3` render with `dof: {mode: 'tilt'}` |
| isometric (アイソメ) | blocks rise into a fixed iso view, flows run along edges | a `G3` rig with `ortho` set; 2D iso grid (examples/pixel-isometric) |
| Memphis, pop shapes | primitives bounce on beats | springs with overshoot |
| risograph, halftone, newsprint | misregistered inks, dot screens, a press reveal | examples/riso-zine, examples/newsprint |
| Swiss grid, brutalist | a visible grid, hard cuts, snap moves | examples/swiss-grid, examples/neo-brutal |
| collage, cutouts | paper pieces stepped at 12 fps | step `t` to 1/12 s |
| watercolour, ink | bleeding reveals | examples/botanical-organic, examples/sumi-wabi |
| neon | a night stage, bloom ramped in | `env.fx` bloom, `G3` `neon` |
| retro UI (Windows 98/XP), pixels | windows pop in with bevels, pixel type on its native grid | examples/pixel-* |
| charts, KPIs, statistics | counters, bars and donuts grow from real numbers | recipes 23, 27; vector charts |
| icons, pictograms | icons pop in on beats | drawn in code |
| characters | drawn in code; generated poses only extend the client's own mascot | references/imagery.md |

## 7. Pitfalls

- **Material first.** A direction that overrides measured brand colours is a bug, not a choice.
- **Flat YAML.** `draft` guesses the outline from blank lines. Check the "from" column in the draft: a colour
  under the wrong group gets the wrong role.
- **Fills vs text.** Bright accents (turquoise, lemon) on white are fills under 3:1. The draft picks the entry's own
  deeper shade for `accentInk` when one exists; otherwise it darkens the accent to 4.5:1. Sample images sometimes
  set white type on a bright fill; `onAccent` keeps 4.5:1 instead (ink on turquoise, not white).
- **Derived semantics.** Entries rarely name ok/warn/deny; the draft derives them at 3:1. With a one-accent entry,
  show data as accent against neutral, not red against green.
- **Engine defaults vs bans.** Grain, vignette, bloom and 3D transitions are easy to leave on; set `post` and the
  transitions from the bans.
- **Shortlist, then fetch.** The caps exist because of the terms; the cache serves repeats, `--offline` works from
  it. The site may change shape; then `draft` fails loudly and `parse_entry` needs an update.
- **The terms can change.** They were updated on 2026-10-28; re-read them before using an entry in a new way.
