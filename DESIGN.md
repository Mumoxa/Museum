# The Ink Atlas

Design assessment, design system and interaction architecture for
**Luchelle's Museum**, the interactive history book for a nine-year-old reader.

This document is written for whoever maintains the thing. It says what the art
direction is, why each decision was made, which rules govern the code, and where
a rule was deliberately broken and why. Every number in it was measured from the
code, not estimated.

---

## 1. The design read

> Reading this as: a **long-form interactive publication** for **one nine-year-old
> reader, with a parent reading alongside**, with a **cinematic museum-at-night**
> language, leaning toward **native CSS, real geographic data and an editorial
> book engine** rather than any component library.

Dials, read from the brief rather than from a baseline:

| Dial | Value | Why |
|---|---|---|
| `DESIGN_VARIANCE` | **9** | An illustrated book is not a grid. Asymmetric plates, bleeding illustrations, staves of type, an atlas sheet that is not a card grid. |
| `MOTION_INTENSITY` | **8** | The brief asks for a directed sequence: a cover that opens, light that sweeps, a map that rises, mountains that unfold. Motion here is storytelling. |
| `VISUAL_DENSITY` | **3** | It is a book for a child. Generous margins, one idea per page, long vertical rhythm, real whitespace on the paper. |

Redesign mode: **overhaul** (`+2` variance, `+2` motion, density unchanged), with
navigation, content and features preserved exactly. Every chapter, page, source
and interactive device from the original is still here, and the smoke suite
counts them: 14 chapters, 116 pages, 15 devices, 32 structural checks.

The problem with the previous interface was not its content, which was strong. It
was a set of nested cards, chips and rounded boxes under a navy toolbar with four
competing accents, with a page turn done as a CSS `rotateY` on a div. It read as
a form, and a nine-year-old does not fall in love with a form.

---

## 2. Art direction: the Ink Atlas

> A museum at night. One vitrine is lit. Inside it is a book.

Everything in the interface belongs to one of two physical roles and never swaps:

* **The environment.** The dark room. Near-black blue-charcoal (`#0b0f16`), the
  density of an unlit gallery. All chrome lives here.
* **The page.** Vellum under museum light. A cool ivory (`#e9e6db`), chosen
  deliberately against the warm-cream default, lit by a radial pool that fades
  into a darker edge where the lamp does not reach.

The **chapter plate** sits behind the page as a fixed painted backdrop at
`opacity: .5` with `saturate(.72)`, under a vignette. You can always see which
world you are in, and the page always wins for contrast. This is how the book
gets fourteen distinct chapter identities without ever changing the theme.

Each chapter also owns a tint family (deep / mid / glow) used only on surfaces
that explicitly claim a period: a backdrop, a contents row, a passport stamp, an
atlas index swatch. The smoke suite asserts that all fourteen tints are
different from one another.

### Non-negotiables, as built

* No cards. Grouping is done with **rules, hairlines, night plates and space**.
  The only boxes in the interface are the night plate on the page, the atlas
  sheet and the passport's stamp cards, and each of those earns its box.
* No rounded-rectangle soup: three shapes, see §5.
* No emoji, anywhere, ever. Every glyph is a Phosphor icon at a consistent
  weight, or hand-built SVG for the instruments (compass, globe, castle, atlas
  plate, ship route).
* No gradient mesh, no AI purple, no neon, no outer glow. The only gradients are
  paper light, leather, and the gold on the one primary button.

---

## 3. Colour

One theme, one accent, two grounds. Tokens live in `src/styles/tokens.css`.

**Accent: antique gold** (`--gold` `#c9a227`, text-tier `--gold-ink` `#74590f`
on paper). Gold is the *only* interactive colour: every button, focus ring,
progress mark, find-point and saved state. Nothing else in the interface is
allowed to mean "you can touch this".

**Measured contrast** (WCAG 2.1, computed from the tokens):

| Pair | Ratio | Use |
|---|---|---|
| `--ink` on `--vellum` | **12.97:1** | all body prose |
| `--ink-soft` on `--vellum` | **6.03:1** | captions, hints |
| `--ink-faint` on `--vellum` | **5.31:1** | figure credits, metadata |
| `--gold-ink` on `--vellum` | **5.29:1** | gold-family text on paper |
| `--seal` on `--vellum` | **6.30:1** | wrong answers, danger |
| `--verify` on `--vellum` | **5.44:1** | found and correct |
| `--link` on `--vellum` | **7.23:1** | Commons and source links |
| `--d-text` on `--void` | **15.12:1** | chrome |
| `--d-text-soft` on `--void` | **8.97:1** | secondary chrome |
| `--d-text-faint` on `--void` | **6.92:1** | metadata on dark, 4.75:1 even on the lightest dark panel |
| `--gold-lit` on `--void` | **11.74:1** | the primary button label |

Every ratio here clears 4.5:1 for normal text. That is a change the audit forced:
the faint tiers originally measured 3.66:1 on paper and 4.31:1 on the dark panel,
because a "faint" token had been picked by eye. Both were darkened until they
passed on every surface they are actually used on, which is the whole point of
measuring.

**Semantic pair** are never colour alone: the quiz prints "Correct." or "Not
quite." beside the mark, and a found object prints its name.

**Theme lock.** There is no dark-mode toggle, because the environment is already
dark and the paper already lit. Instead there are three *lamp temperatures*
(warm, cool, dim) that change only the temperature of the paper light. Nothing
in the app ever inverts mid-page.

**Palette note.** The skill bans warm cream + brass + oxblood as a default reach.
This project is a heritage publication, which is one of the two documented
exceptions, and the palette was chosen against the reasoning of the ban rather
than by accident: the paper is cool rather than cream, the leather is lit by a
lamp rather than flat, the accent is gilt rather than brass, and every colour has
one defined job. It is not the palette the skill suggests rotating to: there is
no beige field and no terracotta accent anywhere.

---

## 4. Typography

Two families, self-hosted through `@fontsource`, no network fonts.

**Display: Cormorant Garamond.** A high-contrast old-style serif at large sizes,
used sparingly: book and chapter titles, the lead paragraph, questions, pull
quotes. The skill's serif rule names editorial, heritage and manuscript aesthetics
as the exception, so this is the exception being taken deliberately rather than a
default. Fraunces and Instrument Serif were avoided as instructed.

**Body: Atkinson Hyperlegible.** Drawn by the Braille Institute specifically for
legibility, and the right choice for a nine-year-old reading a lot of prose. Not
Inter. Letterforms are genuinely distinguishable, which matters at 17px in a
phone column.

**Reading sizes.** Primary body copy is `clamp(17px, 1.05rem + .2vw, 19px)`, line
height 1.62, exactly the range the brief asks for. Measure is capped at 66
characters (`.page > * { max-width: 66ch }`). The "Larger text" setting raises the
whole reading scale rather than zooming the page, so the layout does not break.

**Emphasis rule.** Italics and weight of the same family, never a family switch
inside a headline. Italic display type carries padding so descenders cannot clip.

**Metadata.** One label style: 700 weight, `.17em` tracking, uppercase, gold. It
is reserved for real information (a chapter number, a date, a find count), which
is why the project has no decorative eyebrow above any headline.

---

## 5. Layout, shape and depth

**Shape lock.** Three shapes exist, and nothing else:

| Shape | Radius | Used for |
|---|---|---|
| Cut paper | `3px` | plates, panels, buttons, inputs, images, night blocks |
| Seal | `999px` | stamps, medallions, icon buttons, turn controls, progress track |
| Nothing else | — | no 8/10/12/16px mixture anywhere |

**Spacing.** A 4-and-8 rhythm (`--s-1` 4px to `--s-9` 96px) for every gap, inset
and section break, at all three tiers: component, section, page.

**Depth.** Four shadows, all tinted warm or blue-black, never pure black. Paper
casts the deepest shadow in the interface because it is the only lit object in
the room.

**Z scale.** Every `z-index` comes from the `--z-*` ramp in `tokens.css`. There is
no arbitrary `z-50` anywhere in the project.

---

## 6. The page, block by block

The reading surface is deliberately narrow in its vocabulary: seven block types,
each with one unmistakable shape, so a child learns how a page works during the
first chapter.

| Block | Shape | Job |
|---|---|---|
| Lead | Cormorant italic with a raised initial | the opening line of a story |
| Paragraph | plain vellum prose | the story |
| Subhead | display serif over a hairline | a step in the telling |
| **Night plate** (`blockquote.night`) | dark panel, inset, lit left edge | "Did you know", "What would you ask", "Ask Mum or Dad", "A mystery to carry" |
| Figure (`.fig`) | photographic plate, caption and credit line | real evidence, with the Commons link |
| Dateline (`.anchor`) | two ruled rows: WHEN and WHERE | the anchor in time and place |
| Tell me more (`details`) | a ruled drawer that opens | optional depth, never mandatory |

The **night plate** is the most important of these. It is the one structural break
on any page: dark where the page is light, inset, with its own lit edge, 3px cut
corners. It carries every interruption a museum would put on a small backlit
panel, so a page of prose never becomes a stack of identical blocks. Its inner
text is `#e4e2da` on `--deep-2`, which measures 12.04:1.

Everything else a page needs is a **device**, framed as an instrument
(`.device`): a ruled plate that says "you operate this", as distinct from prose
you read.

---

## 7. Motion

Six moments are choreographed. Everything else is a 140 to 620ms response to a
touch, from one shared duration and easing family in `tokens.css`.
Every choreographed moment is switched off under reduced motion, and the smoke
suite checks that the reduced path exists.

1. **Arrival** (once, on the first open). The gilt title catches a specular band
   that travels across it. The leather board swings to `rotateY(-172deg)` over
   1180ms. A warm flood of light takes the screen. The map is already there
   underneath: the coastline is present, the mountain marks unfold upward from
   their own base lines (`scaleY(.08)` to `none`, 900ms), the site marks scale in
   behind them (520ms, staggered), two cloud bands drift over the land, and the
   first chapter offers itself 3.4 seconds in. Under reduced motion the whole
   sequence is 150ms.
2. **The page turn.** A real 3D leaf on a wide screen, following the finger with
   a shade that moves with it, `cubic-bezier(.44,.05,.2,1)` over 760ms. On a phone
   the page lifts and slides instead, because a 3D leaf in a 390px column reads
   as a glitch, not as paper.
3. **The atlas as a device.** Plate changes cross-fade the sheet; the era drawer
   rises over the plate rather than replacing it, so the map is never lost.
4. **The find.** A slow pulse on the find-point, which is the one loop allowed
   because it is telling you something is touchable. On the tap: a stamped ring
   that expands once, and a specimen label that drops into the page. One burst,
   no confetti.
5. **The stamp.** A passport entry lands with a 620ms scale-and-rotate, like a
   rubber stamp, once.
6. **The reveal.** Night plates, drawers and discovered objects rise 8 to 20px on
   entry (`--d-rise` 620ms).

**Every animation can be justified in one sentence.** The travelling highlight
says *touch this*. The leaf says *the page moved*. The unfolding ridges say *this
is a map being drawn*. The stamp says *this is recorded*. Anything that cannot be
justified that way was cut.

**Banned and verified absent:** `window.addEventListener('scroll')`,
`requestAnimationFrame` loops touching React state, animated
`width`/`height`/`top`/`left` (all movement is `transform` and `opacity`),
infinite micro-animation on content, and any animation that survives reduced
motion.

---

## 8. Interaction architecture

### On a phone (the primary target)

* **The rail**, pinned to the bottom edge: previous page, page state with a
  chapter progress hairline, next page. Two 58px circular turn controls (54px at
  the narrowest breakpoint) sit where a thumb already rests. This is the only
  chrome that matters.
* **The tools**, one strip above the rail: Map, Contents, Passport, Read aloud,
  Plain view, Settings. Icon plus word, 52px tall, out of the reading path.
* **The page** is one column. Swipe anywhere to turn; the outer edge is also a
  real button, so a tap works as well as a swipe.
* **The drawers** (a word definition, a found object) arrive above the rail and
  leave the page visible behind them.

### On a wide screen

A true two-page spread with a pointer-draggable leaf, and the same rail. Every
hover style has a touch equivalent; nothing is hover-only.

### The atlas explorer

The centrepiece, and the answer to "touch an illustration and find yourself
inside that moment":

* Three plates: the whole country, the Cape, the Highveld. All drawn at runtime
  with `d3-geo` from real coordinates.
* Every mark is a chapter. Tapping one opens an **era drawer**: the painted plate,
  the chapter number and title, the line that says what the period feels like, and
  the objects to look for on its pages.
* Where several chapters share one place (four in central Cape Town, two on the
  Witwatersrand), the atlas groups them into one ringed mark and lists them by
  name. That is what a real atlas does, and it is why the two enlarged plates
  exist: those places are kilometres apart and cannot be lettered honestly on one
  plate.
* Its provenance is printed on the plate and in full in the Evidence panel.

### The gamification layer, for a nine-year-old

Built as *collection*, not scoring:

* **Finds.** Every chapter with an illustration hides two real objects on it (a
  lump of red ochre, a glass trade bead, a chip of limestone, a ballot paper, the
  Bill of Rights). They are drawn at fixed positions on the plate as gold
  find-points. Catching one opens a specimen label with one genuinely interesting
  fact and a link to the evidence. Chapters 7 and 9 have no painted plate, so their
  finds attach to their real photographs instead, and the Prologue does the same on
  its photograph. The Epilogue has no finds at all and instead hands over the
  certificate, because there is nothing on an endpaper to hide an object in. Which
  era uses which arrangement is declared per era in `src/design/era.ts`, and the
  smoke suite asserts every find sits inside the plate it belongs to.
* **The passport** is a traveller's document, not a dashboard: stamped pages for
  chapters finished, a cabinet shelf listing what is still hidden, the words
  learned, the puzzles solved, and the name for the certificate. An unfound object
  reads "Still hidden", which is an invitation rather than a zero.
* Two pieces of progress, each with one job: the **thread** at the very top of the
  app is what you have collected and finished (bookmarks, finds, completed
  chapters), and the **hairline in the rail** is where you are. There is no third
  meter, no score, no streak counter, no comparison, and nothing leaves the device.
  The running head carries the place, not a percentage.

---

## 9. Content preservation map

Every page of the original book is still here, and each original block type maps
onto a new surface:

| Original | In this interface |
|---|---|
| `lead`, `p`, `h` | vellum prose, same words, new typography |
| `note` | the dark night plate |
| `fact` | the dark night plate, "Did you know", with its source button |
| `ask` | the dark night plate, "What would you ask", with the saved-answer field |
| `mum` | the dark night plate, "Ask Mum or Dad" |
| `mystery` | the dark night plate, "A mystery to carry" |
| `fig` | photographic plate with caption, credit and Commons link |
| `anchor` | the ruled WHEN / WHERE dateline |
| `quiz` | a printed examination: ruled questions, seal-lettered options, printed score |
| `interactive` | a device framed on the page, loaded only when read |
| `tellmore` | a ruled drawer that opens on tap |
| `parent` | a dashed margin note, off by default |
| `toc` | the contents page, one ruled row per chapter with its own tint |

All fourteen chapters, 116 pages, the glossary, the parent notes, the puzzles, the
certificate and the sources are intact. Nothing was shortened, reworded or
removed. New words appear only where the interface itself has to speak: labels,
buttons, empty states, and the find notes, which are new content and are sourced
in `src/content/sources.ts` like everything else.

---

## 10. The pre-flight audit

Run against the delivered interface, with the numbers pulled from the code.

**Locked correctly**

* [x] No em-dashes anywhere in the project, including code comments and docs.
      15 pre-existing en-dashes remain inside historical date ranges and source
      titles; see the deviations below.
* [x] One theme, no mid-page inversion
* [x] One accent colour on every control, everywhere
* [x] One shape system, documented, three shapes only
* [x] Every text pair measured, all clear 4.5:1 (see §3), both grounds
* [x] One primary action per view; no two controls promise the same thing
* [x] No emoji as icons; one icon family (Phosphor), one stroke philosophy
* [x] No decorative eyebrow, no section numbering as a label, no status dot
* [x] No pills over photographs, no logo wall, no decorative photo-credit string
* [x] No scroll cue, no locale or time strip, no version footer
* [x] Real images: 14 Commons photographs with checked licences, and 10
      illustrations painted for this book and labelled as such on the page
* [x] Real maps from real data, not decorative hand-drawn SVG
* [x] No `scroll` listener; no Motion dependency; `transform` and `opacity` only
* [x] Reduced motion honoured for every choreographed moment
* [x] No horizontal overflow at 390px (asserted in the e2e suite)
* [x] Every thumb target at least 44 by 44 (asserted in the e2e suite)
* [x] Empty, loading and error states exist: device skeletons, "nothing saved
      yet", "still hidden", narration-unsupported copy, storage-blocked fallback
* [x] Long lists use ruled rows or drawers, never a bulleted wall
* [x] `100dvh` equivalents throughout, never a fixed viewport height

**Deliberate, documented deviations**

* **Serif as the display face.** The skill discourages serif by default; this is
  a printed book, which the rule itself names as the exception. Body text is
  nonetheless a sans (Atkinson Hyperlegible).
* **15 en-dashes in historical content** (`1666–1679`, `1994–2026`, `900–1300 CE`)
  and in source titles. The skill would hyphenate them. Content fidelity wins,
  because rewriting historical date ranges is exactly what the brief forbids. The
  em-dash ban, which is the actual AI tell, is honoured everywhere.
* **The hero here is a book cover**, not a landing-page hero: type on leather in a
  gilt frame, a designed object rather than text over a gradient.
* **The chapter backdrop is an illustration behind text.** It is held at 50
  percent behind a vignette, and no body copy ever sits on it: prose is always on
  full-contrast vellum.
* **One accent plus era tints**, as documented in §3.

**The audit changed the build, and so did the browser.** The first real run of
the interface in Chromium found four things no amount of server rendering would
have:

1. The tools strip was 441px wide on a 390px phone, so the whole book sat 51px
   past the edge of the screen. It is three columns on a phone now, with
   `overflow-x: clip` on the shell as a backstop.
2. A sideways swipe never turned the page: the browser claimed the drag as a
   scroll gesture. The reading surface now declares `touch-action: pan-y`, and
   images no longer start a native drag. Verified by swiping at it.
3. On a phone the strip floated over the middle of the page. It now sits in the
   page's own flow at three quarters opacity, and the page carries the extra
   room at its foot so the last lines are still readable.
4. Page-foot buttons and glossary words were 40px and 30px tall. Both now hold
   the 44px floor, the glossary word by growing its padding and giving the room
   back with a negative margin, so the line rhythm is untouched.

**The audit changed the build.** Three things it caught, all fixed:

1. The faint ink and faint dark-ink tiers failed contrast (3.66:1 and 4.31:1).
   Both were darkened until every surface they are used on clears 4.5:1.
2. The running head printed "37% of the museum seen" next to the rail's own
   meter: two meters doing one job. The percentage was removed. A running head
   carries the place.
3. The illustration caption repeated the whole alt text, which is useful to a
   screen reader and a wall of small print to a child. The caption is now one
   short honest line; the description stays in the alt text.

---

## 11. Performance and accessibility

* **First load**: 81 kB gzipped of application JavaScript, 45 kB of React, 15 kB
  of CSS. The atlas, all fifteen interactive devices, the certificate and the
  world map are split into separate chunks and fetched when they are read.
* **Map data**: the full 50m boundary set is 739 KB. This book draws seven
  countries, so only those arcs are kept and re-indexed into a 15 KB file
  (`src/data/southern-africa-50m.json`). The extraction is verified by projecting
  both versions through the same projection and comparing the output paths, which
  are identical for all seven. The whole-world 110m set (105 KB) is used only by
  the globe and the sea-route device, which is why it is its own chunk.
* **Images**: photographic plates below the fold are lazy; a chapter's
  illustration loads eagerly on its opener, because it is the point of it.
* **Grain and vignette** live on fixed, `pointer-events: none` overlays, so they
  never repaint while scrolling.
* **Accessibility**: keyboard page turning, a visible gold focus ring on both
  grounds, a skip link, `aria-live` page announcements, real buttons at the page
  edges as well as swipe, a focus trap and Escape in every dialog, an atlas that
  is reachable by keyboard with labelled marks, narration that highlights the
  sentence being read, and a plain scrolling mode for anyone who wants no theatre
  at all.
* **Tests.** Three suites, all green:
  * `npm run test:smoke` renders all 116 pages, the atlas, every panel and every
    device through React's server renderer and asserts 32 structural facts with
    no browser at all.
  * `npm run test:contract` reads the project as text and checks the things a
    screenshot cannot: every class the components ask for has a rule, every
    custom property read without a fallback is defined, every stylesheet is
    imported, one icon family, no banned pattern, and the shape lock holds.
  * `npm run test:e2e` drives the real interface in headless Chromium: 61 checks,
    including the arrival sequence, the page turn, the atlas, the find, the
    quiz, narration, plain view, reduced motion, the 44 by 44 tap audit and the
    overflow check. `npm run shots` photographs 23 screens to `/tmp/shots`.
  * Where the browser comes from is documented in `tests/browser.mjs` and
    `tests/install-browser.mjs`; the suite exits 2 with instructions if there is
    none, rather than passing silently.
