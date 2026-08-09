# Current state and outstanding work

Written 19 Jul 2026, last updated 21 Jul, as a handoff so no context is lost on a session clear.
Branch `direction/b2`. Read alongside `BRIEF.md`, `REVISION.md`, `CONTENT.md`, `MAP.md`, `PASS3.md`.
The Notion doc "Portfolio" (under "Build") holds the decision history.

**Where things stand, 20 Jul.** `direction/b2` is pushed and in sync with `origin` at `0f26c0e`;
Vercel builds the preview from it, so the preview only moves when you push. Working tree clean,
`npm run build` passes, lint 0 errors (the 3 `no-img-element` warnings are deliberate). `main` is
untouched and gpcodes.com still serves the old site.

The commits of 20 Jul, newest first, from two audit passes (see below):

- `182a38a` impeccable critique: side-stripe and muted contrast fixed, findings recorded
- `e166cf8` STATE: branch is pushed, and note what to check on the preview
- `179b91a` STATE: record the audit and what it left open
- `9f85b0d` motion tokens, affordance consistency, and a 404 route
- `e237bee` correctness pass: pair alignment, accent default, typography
- `5c033ae` dialog exits, and fix the ⌘K scroll jitter

Two things from that pass are worth checking on the deployed preview, because neither can be seen
locally: the **dialog exits in the production build**, since the minifier is what turned `110ms`
into `.11s` and broke the JS hold once already, and **`scrollbar-gutter: stable`**, which is
invisible on macOS overlay scrollbars by design.

Earlier, 19 and 20 Jul:

- `d9119a7` STATE corrections: withheld entries, worktree cleanup
- `c729b41` menu ground settled; Okappy and FRANK-E withheld
- `e04977b` wordmark flash fixed; Tonic Lab added; PwC led with the composite
- `7d9c500` JS weight measured and closed as no cheap win
- `e5b28c9` Passionfruit screens sourced, `onboarding-goals` held back

**The two things waiting on Giacomo**, both detailed below: a corrected `onboarding-goals`
export, and whether Okappy and FRANK-E come back at all.

Next up, once Giacomo gives the go-ahead after a clear: **two hero prototypes** (Version 1 the
gloopy static-nav morph, Version 2 the interactive stippling-halftone face). Both specced under
"Next up: two hero prototypes" below. Read that first.

Longer-standing and still open: **where humour lives**, the biggest gap between this site and the
personality he wants. The 404 route now exists and is deliberately unfunny, so there is a real
surface waiting for that copy. It overlaps the hero hover-moments roadmap below.

---

## The to-do app lives elsewhere now. Settled 19 Jul, 20:50

It was briefed into the wrong place: my prompt said "Repo: `~/code/gpcodes-b2`" and "build a
to-do app for the /lab section of my portfolio", so it was built **inside** the site at
`/lab/rows`, inheriting the portfolio's design system. Giacomo always intended a **separate
entity with its own branding** that `/lab` merely links out to. My briefing error.

**Resolved.** The work was moved, not rebuilt, into `~/code/todo-app` (commits `ccb05cd` then
`ac5c45c`). This worktree is clean again and the portfolio branch never carried any of it.

- `RowsStudy.tsx` moved verbatim: no portfolio imports, no Tailwind, only its own `rows-*`
  classes. Its stylesheet was one contiguous block appended to `globals.css`, so `git diff`
  extracted it exactly.
- The study consumes ~22 design tokens, now declared at the top of todo-app's `globals.css` and
  marked as **the rebrand surface**: nothing in `rows-*` reads a hardcoded colour, size or
  radius, so changing those values rebrands the whole thing. They currently hold this
  portfolio's slate values, which is the starting point to move away from.
- Stage 1 and a working slice of Stage 2 came across, verified in a browser rather than by build
  alone: `add · sprout · 380ms`, `delete · crumple · 400ms` with gravity easing and a computed
  `--fall-x/--fall-y` trajectory, the 0.25x toggle still driving `--t` to 4, undo delete, and a
  live region announcing deletions.

**Do not re-embed it in the site.** `/lab` needs an entry linking **out**, with a short
description and its URL. Still to do, roughly ten minutes, once there is a URL.

### The dependency question, and why the answer is CSS

The no-dependencies rule was inherited from this portfolio's brief and does not apply to a
standalone motion study, so it was lifted and Motion or GSAP put on the table. The build session
chose **no library**, and the reasoning is better than the case I put to it, so it is recorded
here rather than lost:

**The 0.25x toggle is incompatible with springs, and the toggle is the best thing in the piece.**
It works because every duration is a number multiplied by `--t`. A spring has no duration; slowing
one means changing stiffness and damping, which alters its *character*, not just its speed. The
thing you inspected at quarter speed would no longer be the thing that plays at full speed, so
the toggle would become a lie. The toggle plus the readout are what make this an interaction
study rather than a to-do app.

On the three arguments I raised: velocity-on-interrupt is real, but the native fix is WAAPI,
`element.animate()` with `composite: "add"` layering onto the running animation, plus
`playbackRate` for exact time-scaling that a spring cannot give; drag-reorder already works, so
a library would buy a rewrite back to where it started; and the crumple plays on a ghost that is
already out of flow and never retargets, which is the one case where fire-and-forget keyframes
are genuinely correct.

Revisit only if burst-testing shows stutter that `composite: "add"` cannot fix.

---

## Standing rules

1. **No em-dashes anywhere.** Not in page copy, `index.md`, `llms.txt`, docs or commit messages.
   Use commas, colons, parentheses, or restructure the sentence. En-dashes are fine.
2. **No widows.** Never leave a single word stranded on the last line of a paragraph.
   `text-wrap: pretty` on body copy, `balance` on headings, non-breaking spaces where needed.
3. **First person**, always. Testimonials stay third person, they are quotes.
4. **Only downscale images, never upscale.** See the pipeline bug below.
5. **No new dependencies** without a stated justification.
6. Check every output against: would a person with taste have chosen this, or is it the first
   thing a model reaches for? This project has repeatedly caught generic output.
7. **Model choice: do not use Fable for portfolio work.** Giacomo's call, 19 Jul. Pick whatever
   fits the task: judgement-heavy design, copy and review work stays with the main model;
   mechanical bulk passes can go to a cheaper tier. Fable is reserved for the `/lab` to-do app.

---

## Sequenced plan (Giacomo confirmed: do it in sequences)

### Group 1: corrections. DONE, 19 Jul 2026

All seven items shipped. What the work turned up that the plan did not predict:

- **The upscaling was roughly three times wider than believed.** The estimate was 8 of 14
  graphic design assets. The true figure is 8 of 14 *plus* **24 of 37 product screenshots**.
  IPC, Okappy, FRANK-E and Powerloop were all 1440px-class sources shipped at 2400px.
- **`scripts/images.mjs` replaces the old script.** It resolves sources by basename against an
  extracted archive and computes `scale = min(capW/srcW, capH/srcH, 1)`. The `1` is what makes
  upscaling structurally impossible rather than merely avoided. Caps bound both axes, because a
  width-only cap would have scaled the 2880x9334 employers screenshot to 1600x5185.
- **Caps are derived from real display size**, not taste: the container is 72rem and a featured
  figure takes 7 of 12 columns, so it renders at about 640 CSS px. 1600 is a comfortable 2x, and
  the old 2400px files were both partly fake and wasteful. `public/work` went 19MB to 10MB with
  every image now at or below its true source resolution, which also dents the JS-and-assets
  weight logged under technical debt.
- **The Compliance3 `.eps` is unusable**: Apple dropped EPS rendering, and `sips` reports success
  while writing nothing. `C3.pdf` is the real fix. It is a fully vector portfolio page carrying
  the logo and both card faces; the shipped asset is the right-hand face, rendered at 900dpi and
  cropped just inside its hairline frame (`crop` in the manifest). Genuinely sharp now.
- ~~**`okappy/connections-notes.jpg` is misnamed.**~~ **RESOLVED 19 Jul**, see below.
- **Hero copy landed as** headline "I make complicated products easier to live with." plus a dek
  that repeats neither the name and role (already in the eyebrow) nor Florence (already in
  hero-meta). `layout.tsx` metadata carried the same stale "build when it counts" line and was
  updated to match.
- **Em-dashes: zero remain** across `src/`, `public/` and `docs/`.

Two assets still need Giacomo:

- ~~**Passionfruit's three screens have no source in the archive**~~ **RESOLVED for two of three,
  19 Jul**, see "Passionfruit sources landed" below.
- **`hundo/learn-tablet` has a 450x685 source**, far below the slot it occupies. Shrink its
  presentation, drop it, or re-export from Figma.

### Passionfruit sources landed, 19 Jul 2026

Giacomo exported the three screens. They were the last unsourced assets on the site: all three
shipped at 2400px against a **1440px original**, so roughly 960px per image were invented.

- **Two are now real.** `pip-welcome` and `agents-leads` are wired into `scripts/images.mjs` and
  ship source-limited at 1440, under the 1600 cap. Neither gets a zoom variant, correctly: the
  display image *is* the source, and the lightbox falls back to it. `unverified` in
  `images.json` went from 3 entries to 1.
- **`onboarding-goals` is deliberately still held back.** Its source carries two defects that are
  readable at full zoom now that every figure zooms: **"camapaign"** is a typo, and **"Retain
  customers" appears as two separate chips**. Giacomo's call, 19 Jul: fix in the design file and
  re-export rather than ship it. The old 2400px guess stays in place meanwhile, still flagged
  `unverified`, so the gap stays visible in the data rather than disappearing quietly.
  **This is the one outstanding Passionfruit item.**
- **The source filenames are crossed against the shipped names**, and this cost real time to
  establish. They are named for the flow they were cut from, not the screen:
  `Chat - Welcome screen.png` is the PIP welcome ("Welcome to PIP, Michael!"), and
  `PIP - Goal (selection).png` is the onboarding goal picker. Verified by eye, not inferred, and
  the two 1440x840 files are aspect-identical so dimensions cannot break the tie. The mapping is
  recorded in the manifest comment. **Do not "correct" it from the filenames.**

### Group 2: image zoom, default everywhere. DONE, 19 Jul 2026

Native `<dialog>`, no library, no new dependencies. How it is put together:

- **`src/components/Fig.tsx` is now the only image primitive.** Every figure renders through it,
  which is what makes "zoomable by default" true by construction rather than by remembering to
  opt each image in. It is also the answer to Giacomo wanting to change how featured images are
  presented: that change is now one file, not 23 call sites.
- **Dimensions come from `src/lib/images.json`**, generated by the pipeline from the real files.
  The hand-written `aspectRatio` strings are gone. They were a live bug source: one had already
  drifted from its file after the Compliance3 re-crop.
- **`src/components/Lightbox.tsx` is one dialog for the whole site**, mounted in `layout.tsx`,
  opened by delegation from any `[data-zoom]` trigger. A dialog per image would have put 48 in
  the document for a feature used occasionally.
- **The frame is a `<button>`, not a div with a click handler.** Zoom is keyboard reachable.
  The architecture map is already logged as pointer-only debt and this did not add more.
- **Zoom variants are capped by the source** like everything else, and are only emitted when
  they would be at least 1.25x the display image. 12 of 45 qualify. The rest fall back to the
  display image, because shipping a second identical file to "zoom" into would misrepresent how
  much detail exists. The dialog also sets `max-width` to the image's true pixel width so the
  browser cannot stretch it past that on a large display.
- Page weight is unchanged: zoom variants are only fetched on open. `public/work` is 15MB on
  disk, of which the initial payload is still the 10MB display set.

**A crop is a layout decision only.** Nine figures crop on purpose via a `ratio` override plus
`objectPosition`, because their frames deliberately disagree with the real file. That crop shapes
the frame on the page and stops there: **the lightbox always opens the whole image.** Giacomo's
call, 19 Jul, and it is the right one. A phone screen shown as a short window in the layout is
exactly the one you most want to read end to end when you open it. Tall shots therefore render at
their true width and the dialog scrolls rather than shrinking them to fit: Powerloop's charge
cycles screen opens at its real 640x2260 instead of being squashed to viewport height.

Consequence to know about: the PwC frames are cropped because they carry Lorem ipsum, and opening
them now shows that placeholder copy full size. The footnote under them already discloses it, and
Giacomo plans to re-edit and re-crop those assets, so this is accepted rather than worked around.

**Galleries page by group.** Opening an image opens its set: arrow keys or the on-screen
controls move through it, wrapping at both ends. The group is whatever `[data-gallery]` the
trigger sits in, falling back to the enclosing `<article>`, so each work entry is its own gallery
and the graphic design contact sheet is one set of 11 with nothing wired per image.

**Trap worth remembering:** the dialog `close` event does not bubble, so React's `onClose` never
fires, and it proved unreliable to observe even with a direct listener. The symptom was the
scroll lock surviving dismissal, leaving the page permanently unscrollable. Teardown is now
funnelled through one `dismiss()` used by every path (button, backdrop, and Esc via `cancel`,
which is preventable). Do not reintroduce a dependency on `close`.

### Group 3: DONE, 19 Jul 2026

- **End-of-page reveal (vladsavruk.com): DROPPED.** Giacomo's call, 19 Jul, do not revisit. Two
  reasons it was not worth the risk: a CSS transform on an ancestor creates a containing block
  and breaks `position: sticky` for descendants, and the floating menu is sticky, so the page
  would have had to be restructured around the effect. `animation-timeline: view()` also has no
  Firefox support. The particle wordmark is the footer's signature moment instead, and stacking
  a reveal on top of it would have made the foot of the page busier rather than better.
- **Particle formation effect: BUILT**, 19 Jul. `src/components/ParticleWordmark.tsx`, in the
  footer. Raw Canvas 2D, no p5, no dependencies. The wordmark is sampled by rendering it to an
  offscreen canvas and walking the alpha channel, so the particles trace the real letterforms.
  - **It settles and stops.** Verified: zero animation frames scheduled once the last particle
    lands. A permanently running RAF at the foot of every page is exactly how "not laggy" gets
    broken. It replays only on re-entry into view.
  - Build is gated on `document.fonts.ready` and a ResizeObserver. Sampling before the webfont
    lands would trace the fallback face, and the first layout pass can report zero width, which
    silently produced no particles at all.
  - The plain-text wordmark underneath is the no-JS fallback. A canvas is transparent and cannot
    cover it, so the component sets `data-ready` once it has particles and the text steps aside.
  - Accent colour is resolved once per settle, not per frame, and repaints on theme change.
  - **The string is `ciao :)`**, not the domain, and lives in one `WORDMARK` constant at the top
    of the component. Warmer than repeating the domain, which the menu already carries on every
    page. The `:)` is ASCII rather than an emoji: in a mono face it reads as machine-native, so
    the warmth arrives without breaking the instrument register. This is also the first real
    answer to the humour gap, which is the longest-standing open question on the site.
  - **Dot density doubled**, 19 Jul. The step is a grid pitch, so count goes as 1/step^2 and
    doubling the dots means dividing by sqrt(2): 4 to 2.8, and 3 to 2.1 on narrow viewports.
    The dot radius came down with it or the grid closes up into solid type, but not by the
    coverage maths alone: a ~1.2px rect lands on sub-pixel bounds and antialiasing eats its
    weight, so holding coverage constant read visibly fainter. Sized back up by eye to 0.78.
  - Size is fitted to width then clamped by height. Without the height clamp a short string
    like this one asks for a ~210px face in a 140px box and the caps get cut off.
  - **RESOLVED: the footer.** Giacomo's call, 19 Jul. Combined with the end-of-page reveal as
    one signature moment. The reasoning that decided it: the rewritten hero copy is deliberately
    warm ("whether I can become one"), and a particle spectacle directly above it fights that
    tone. The footer is also where a wordmark belongs.
  - Reduced motion renders the settled state immediately.

### Group 4: `/lab` interaction study, the to-do app

**Confirmed. Fable builds this one**, and only this one.

A small to-do app framed as an **interaction study** rather than a to-do app. The craft is the
subject: what happens when a row is added, completed, reordered, killed. Reference rows.gg
("kill row, add new row"). Use the `emil-design-eng`, `make-interfaces-feel-better` and
`transitions-dev` skills. Static export, no dependencies, localStorage persistence.

Risk to manage: a to-do app is the most clichéd demo there is. It only earns a place on a senior
designer's portfolio if the interaction craft is explicitly the point.

**Build it in two stages, not one.**

*Stage 1: fundamentals.* The app working, with restrained but genuinely well-judged motion.
Add, complete, reorder, delete, edit, empty state. Correct easing, no layout shift, keyboard
operable, reduced-motion path. Nothing decorative yet. Verify visually before going further.

*Stage 2: the special touches.* Giacomo's brief, in his words: "start adding actual special
touches for every action and reaction. Crumble up and throw in a bin for deleting, throwing a
seed and growing for a new task, I don't know, stuff like that."

Notes on that, to weigh rather than obey:

- **A true paper-crumple is expensive.** Doing it properly needs a canvas or WebGL simulation or
  a pre-rendered frame sequence, which fights the no-dependencies rule. A CSS-achievable cousin
  gets most of the feeling: the row folds along a couple of axes, rotates, shrinks and falls
  into the bin with gravity easing rather than a linear curve. Try that before reaching for
  anything heavier.
- **Seed to sprout works well in CSS/SVG**: a small mark drops in, springs, and an SVG stem
  draws via `stroke-dashoffset` as the row expands to full height.
- **Do not give every action a metaphor.** If everything is a small story the thing becomes a
  toy and slows down. Pick two or three signature moments and let the rest be quietly excellent.
  Emil's principle applies: restraint is what makes the flourishes land.
- **Delight must survive repetition.** An elaborate delete is charming once and irritating by
  the tenth. Keep signature animations under roughly 400ms, and make sure rapid repeated actions
  interrupt gracefully rather than queueing.
- Being showier here than on the rest of the site is fine. It is `/lab`, and experimentation is
  the stated point of the page.

---

## Portfolio audit, 20 Jul 2026

Ran the third-party skill at **github.com/hey-stefan/portfolio-audit**, a hiring-manager rubric
distilled from 143 Dive Club episodes. Read the SKILL.md before running it: it is benign, and it
usefully constrains the agent (no `eval`, no custom scripts, no `curl`). It drives
`npx agent-browser` (vercel-labs, Apache-2.0).

**Audited `localhost:3004`, not gpcodes.com**, which is still the old pre-redesign site. The
rubric's custom-domain criterion therefore does not apply and was ignored.

**Scored 35/40.** Gut check 5, Work is Hero 4, Curation 3, Storytelling 4, Ambition 5,
Soul 4, Portfolio as Product 5, Builder signals 5.

What it praised, worth not breaking: the hero, the machine-readable layer (`index.md`,
`llms.txt`, copy-as-prompt), the architecture map and its "sparse truth over padded diagram"
line, and the testimonials. It called the builder signals the thing that would actually earn a
reply.

Actioned:
- **Menu ground quieted** (see below).
- **Okappy and FRANK-E withheld**, taking the curation note down from eight entries to six.

Rejected or deferred, deliberately:
- **The menu-overlap diagnosis.** The audit called it the top defect. Giacomo disagrees that it
  hides content: it sits at the very top, replaces a static nav, and he likes it. The fix was
  therefore to quiet the ground, not restructure the menu.
- **"Cut to five or six entries" is one lens, not a verdict.** The rubric is tuned for hiring
  managers skimming at speed; this site doubles as a personal site. Eight entries and the
  consolidated graphic design gallery were deliberate Pass 3 calls.
- **"Lead each entry with the image, not the copy."** Not attempted. Still an open idea.
- **`/photography` and `/about` showing as disabled** was flagged as advertising an unfinished
  site. Unchanged for now.

### Menu ground, changed 20 Jul

`.fmenu` went from 80% ground over a 14px blur to **92% over 20px plus a little saturation**.
It stays translucent on purpose, because the depth cue is the point and Giacomo wants it kept.
What passes underneath now reads as a wash rather than as text with the contrast knocked out.

---

## Design-engineering audit, 20 Jul 2026

Ran the site against four skills: `emil-design-eng`, `make-interfaces-feel-better`,
`transitions-dev` and `find-animation-opportunities`, one agent per lens, then reconciled.
`improve-animations` and `fixing-motion-performance` were deliberately skipped: the first
overlaps the transitions review and emits plans rather than findings, and the second would
re-tread the JS-weight work already closed under technical debt.

Everything below was measured in a real browser via `npx agent-browser`, before and after.

**Shipped in `5c033ae`, dialog exits and the ⌘K scroll jitter.** Both dialogs entered with a
keyframe and vanished on the frame, so the exit was an omission rather than a decision. Enter and
exit now share one transition with `@starting-style`, with `overlay` and `display` on
`allow-discrete`. The asymmetry is free: a transition runs at the duration of the state it moves
*to*, so the closed rule owns the exit (110ms) and `[open]` owns the enter. Backdrops need their
own pair, since `opacity` on a dialog does not reach `::backdrop`.

The ⌘K list had three separate defects stacked: `scrollIntoView` walks every scrollable ancestor
so it moved the page behind the dialog; scrolling the list put fresh rows under a stationary
cursor, which the browser reports as a **synthetic pointermove**, which set active, which
scrolled again; and hovering ran the scroll effect at all. Fixed by writing `list.scrollTop`
directly, comparing pointer coordinates to spot the synthetic events, and letting only the
keyboard scroll.

**Shipped in `e237bee`, correctness.** `.fig-pair` sat 16px off level on all five pairs because
`.fig + .fig` has no child combinator and matched the figures *inside* a pair. Two entries carry a
`ratio` override specifically to sit level, which this was defeating. `AccentPicker` reported
`#2b4cff` as the default against a real accent of `#2c4a56`, so `/palette` misreported the live
colour. Stat cells were padded 20/16 with label and number touching, because the margin sat on the
`<dt>`, the first child. Plus `text-wrap: pretty` consolidated onto `body` (it was hand-applied to
ten blocks and missing from four), `tabular-nums` on the lightbox caption, `scrollbar-gutter:
stable`, and five straight apostrophes inside testimonial quotes.

**Shipped in `9f85b0d`, tokens and consistency.** Zero hardcoded durations remain in
`globals.css`. Four durations and four easings collapsed to `--dur-hover` (140ms) for every
affordance plus `--dur-wipe` (220ms) as the one exception, and `--press` holds the existing
`translateY(1px)` idiom. Eight snapping hover states fixed, and they were the whole floating menu
plus both lightbox controls: the most-touched surfaces were the ones missed. Hit areas grown to
40px with pseudo-elements, block-axis only on the nav links since they sit `--sp-1` apart and
touching hit areas are worse than small ones. `.u-link::after` was the one transform transition
with no reduced-motion guard, now closed. `.lb-count` moved into the fixed chrome. ⌘K locks
background scroll. The lightbox preloads neighbours.

### Two lessons worth more than the fixes

**Agreement between reviewers is not verification.** Three of the four lenses reported on
`.reveal`; two independently measured it as "constant, well-built" and cleared it, and one called
it a 4x defect. All three were wrong. The `entry` range caps at the scrollport height, so every
work entry (all taller than the viewport) clamped to an identical 190px ramp while the short quote
cards ran in ~79px. The two clearing lenses had only sampled `.entry`, where it genuinely is
constant; the flagging lens computed 340px by ignoring the cap. Real spread was 2.4x. **Two
independent measurements converged on a wrong answer because they sampled the same subset.** Fixed
with length offsets, verified by tracing a 1112px entry and a 265px quote to an identical curve.

**A CSS token read from JS is not the number you wrote.** The lightbox holds its image in the DOM
until the exit fade ends, reading the duration from `--dur-exit` so the two cannot drift. The
build minifies `110ms` to `.11s`, so `parseFloat` returned `0.11` and the hold fired after 0.11ms,
fading out an empty dialog. The unit has to be parsed. Anything else reading a duration token from
CSS has the same trap waiting.

### Still open from the audit, not done

Ordered roughly by value. None are blocking.

- **Copy-prompt success shifts its own trigger.** The label swap reflows ~184px to ~170px, so the
  buttons you just pressed jump left and back 2.6s later. The one confirmation moment in the
  product reads as a glitch. The fix is a reserved `min-width`, a layout fix, not a motion one.
- **`.fig-frame:hover` jumps two steps of the grey ramp**, `--line` straight to `--muted`, skipping
  `--line-strong`. Reads heavier than any other hover on the page.
- **Passionfruit's pair is unequal height** even now the 16px is gone: `agents-leads` is 1440/880
  and `onboarding-goals` is 2400/1400, an ~8px mismatch. Resolves itself if that screen is
  re-exported (see the outstanding Passionfruit item), so it was left alone.
- **Image outlines are tinted** (`--line` is cool-toned) where the rubric wants pure black/white at
  low alpha. Small, and arguably the one-hairline-token approach is the better taste call.
- **Quote marks are not optically hung.** `hanging-punctuation` plus a small negative `text-indent`
  on `.quote blockquote p`.
- **Particle wordmark replays on every re-entry** and runs ~1.66s. One lens argued for latching it
  to once per page load so the first arrival is the event. Deliberately not touched: it is the
  site's signature moment and the call is Giacomo's.
- **Architecture map labels collide** in the upper band of the default layout. The page's "sparse
  truth over padded diagram" claim is undercut by unreadable labels. A label-collision pass that
  hides an intersecting label while keeping its node dot would fix it.
- **The theme toggle is a static `◐`** in a fallback font, so its centring is a coincidence and it
  never reflects state. A 14px inline SVG would match how the rest of the site draws its marks.

Explicitly rejected during the audit, do not re-raise: count-up animation on the stats (unreadable
while spinning, and the most model-reachable idea in the file), a cross-fade on theme toggle
(paints everything, and instant is honest for a settings action), stagger on the contact sheet,
and animating the skip link.

---

## impeccable critique, 20 Jul 2026. SCORED 29/40. Discussion pending

Ran `/impeccable critique` against the homepage, dual-agent (A design review, B detector plus
browser evidence), register `brand.md`. Snapshot at
`.impeccable/critique/2026-07-20T15-06-24Z__src-app-page-tsx.md`. First run, no trend yet.

**Giacomo asked for a full greenfield judgement**, explicitly relaxing the standing rules and the
inherited bans, on the grounds that several were not written by him. He asked to be reminded where
a finding collides with something already decided, and for nothing to be fixed before discussion.
**Two things were fixed (below); everything else is waiting on that conversation.**

Note from Giacomo when the results landed: he has already cut the sections and hidden two entries,
so the "six entries, one template" finding should be read against work already done, not as a
first pass. See the Okappy / FRANK-E item under open questions.

### Fixed already, 20 Jul

- **`.outcome` side-stripe, P0.** `border-left: 2px solid var(--accent-ink)` was an absolute-ban
  match (side-stripe borders), the only detector finding, and independently the top P0 from the
  design review. It was also the loudest single use of the accent on the site, so the one place
  the brand colour became visible was the most templated element on the page, and it was the only
  non-1px edge on a site built from hairlines. Now a full 1px `--line` border with the wash kept
  and `--accent-ink` moved onto the label. **Detector is now clean, exit 0, zero findings.**
- **`--muted` contrast, P1.** `#6b6f76` measured 4.88:1 on `--bg` but **4.45:1 on `--bg-far`**,
  failing AA. The mechanism matters and both agents got it partly wrong: `body` uses
  `background-attachment: fixed`, so the gradient is **viewport-relative, not document-relative**.
  Muted text sitting in the bottom tenth of the *screen* met the darkest ground at any scroll
  position. Now `#5f636a`: worst case 5.32:1 light, 6.76:1 dark. Verified in both themes.

### The headline finding, unresolved and the thing to discuss first

**The site passes the first-order AI-slop test and fails the second-order one.** Category alone
predicts white/cream, display serif, project cards, and this is none of that. But category *plus
its own anti-references*, "designer portfolio that isn't editorial-serif, by someone who wants to
be a design engineer", predicts cool grey, mono metadata, hairline rules, ⌘K, a `/lab`,
`llms.txt`, an ASCII wordmark. That is this page item for item. The lane has a name,
terminal-native / instrument-utility, and it sits directly beside the editorial-typographic lane
`brand.md` already flags as saturated. `brand.md` names brutalist-utility as the next entry to
that reject list.

This is **not** slop in execution. The OKLCH accent derivation, the length-based `animation-range`,
the alt text and the generated dimension manifest are all above what an unattended model produces.
The verdict is that it is craft applied to a reflex *direction*.

**The second P0 was deliberately not actioned: the accent does not exist.** A colour census found
the accent on **10 of ~1600** computed colour slots, under 1%, plus one wash. Chroma 0.033 is
perceptually grey. The colour strategy is Restrained, which the skill calls the *product* default;
the brand register has explicit permission for Committed (one saturated colour carrying 30-60% of
the surface) and Drenched. The recommendation was to name a real reference, then drench the hero
in one saturated ground dropping into the light body at `Selected work`. **This is a direction
change, not a fix**, and the `--accent` architecture already makes it a one-line experiment on the
`/palette` route. Nothing was touched.

### The `.mono-label` ruling, which went against the site

Judged with no benefit of the doubt, per Giacomo's instruction. **Not a deliberate named brand
system.** 12 instances doing five unrelated jobs: identity eyebrow, section counter, stat labels,
callout label, footer column heads. A named system has a rule meaning one thing; this one means
"small", which is the definition of scaffolding. Two supporting tells, both verified:
`.sec-meta` is byte-identical to `.mono-label` apart from alignment, and the comment at
`page.tsx:92` already admits the hero eyebrow duplicates the h1 and dek. Monospace is roughly
**25% of homepage characters**, against a `brand.md` ban on mono as shorthand for
"technical/developer".

### Remaining issues, none actioned

- **P1 the stats block is the hero-metric template**, a named ban: big number, small label,
  supporting caption. Also supplies 4 of the 12 eyebrows. Suggested fix is structural, not
  stylistic: set the figures as one line of prose in the entry copy.
- **P2 there is no call to action anywhere.** The only contact affordance above the footer is the
  email at 13px mono muted, sharing a line with the latitude and styled identically to it.
  Meanwhile copy-as-prompt gets two bordered buttons, so **the page currently gives an LLM a
  stronger call to action than a hiring manager.**
- **P2 touch targets.** 16 under 44px at 360px. See the correction below.
- **P3 type scale is flat.** Measured steps 11/13/15/17/22/28/52/64 give ratios 1.18, 1.15, 1.13,
  1.29, 1.27, 1.86, 1.23. Four of seven are under the 1.25 rule and the three tightest carry
  **166 of ~197** text elements, which is why the small labels blur together.
- `.stats-caption` runs **90ch desktop, 106ch at 768px**, the longest measure on the page at the
  smallest size, against a 65-75ch rule.
- `.sec-meta` duplicates `.mono-label`; consolidate.
- The `.fmenu` comment claims sticky positioning means it "cannot overlap content". It is
  `top: 0` over a scrolling document and overlaps on every screen. Correct the comment or the code.
- `.fmenu-soon` is a `<button>` with `cursor: default` and no `disabled` / `aria-disabled`, so
  screen readers announce a working button that does nothing.
- Hero right half is empty at >=1024px, roughly 45% of the first screen.
- `--bg-far` at chroma ~0.005 buys nothing visually and was what pushed `--muted` under AA.
- `.stats-ruler` was called the best purely decorative element on the site, and it appears once.
  Named as the vocabulary worth extending.

### Collisions with decisions already recorded as Giacomo's

Flagged rather than actioned, which is what he asked for:

- **The translucent menu.** Settled 20 Jul: he disagreed that it hides content and had the ground
  quieted to 92% over a 20px blur. The critique reports testimonial copy **plainly readable
  through the bar** in screenshots, so the code comment and the render disagree. This is new
  evidence against that call rather than a re-litigation, and deserves a look on his own screen.
- **Six entries in one template.** The July portfolio audit said "cut to five or six" and he
  rejected it as one lens. This finding is different: not fewer entries, but that Passionfruit,
  the current role, deserves to break the template rather than being visually identical to a 2015
  contact sheet. `brand.md` grants art direction per section.
- **The greyscale avatar**, read as the register enforcing itself against its own content.
- **The deliberately unfunny 404**, which the critique agreed is the right surface.
- The `.reveal` length-range fix shipped earlier the same day was singled out as correctly done.

### Correction to an earlier claim in this document

The commit `9f85b0d` message and the summary of it said hit areas were "grown to the 40px floor".
**Measured with `elementFromPoint`, they were not.** Effective hit heights: `.icon-btn` 37px,
`.palette-trigger` 37px, `.fmenu-link` 41px. `inset: -4px` on a 32px box should give 40 and does
not, and none of the three reach the **44px** touch standard, which is the figure that actually
matters for the mobile persona. Unfixed, and worth redoing properly rather than trusting the
earlier claim.

### Two tooling lessons from this run

- **`getBoundingClientRect` does not measure a hit area.** Assessment B reported the visual boxes
  and missed that pseudo-element expansion had changed the targets. `elementFromPoint` probing is
  the honest measurement.
- **Assessment B produced two false negatives worth knowing about**: it reported contrast ratios
  of 1.09 and 2.09 from a parser bug on `color(srgb ...)` (it caught and corrected this itself),
  and it reported the theme toggle as broken. The toggle is fine: `toggleTheme` reads the
  *effective* theme and flips it, verified as one click taking `--bg` from `#0e0f11` to `#fbfbfc`.

---

## Tooling lesson: the Chrome tools go silent when the window is hidden

Cost real time on 20 Jul, and it produces false conclusions rather than errors.

When the Chrome window is minimised or backgrounded, `document.visibilityState` is `"hidden"` in
every tab, so **IntersectionObserver never delivers and rAF is paused**. Anything gated on
either, which here means the reveal animations and the whole particle wordmark, simply never
runs. It looks exactly like a bug in the code. Long `await`s in `javascript_tool` also start
timing out against a frozen renderer, and `computer` screenshots fail with script-injection
timeouts.

DOM reads still work fine in a hidden tab, so structural checks (`data-ready`, computed styles,
which images an entry renders) are trustworthy. Anything motion or visibility driven is not.

**The workaround is `npx agent-browser`**, which drives its own headless browser and is immune to
this. It is what the audit used, and it rendered, scrolled and screenshotted the whole site
without trouble. Two notes: it defaults to `prefers-color-scheme: dark`, so click the theme
toggle to review the light-first default, and scrolling occasionally does not register, so put a
`sleep` between scroll and screenshot. Also, a full-page screenshot captures the page with every
`.reveal` still at opacity 0 and comes back nearly blank: scroll progressively instead.

Same shape as the `curl`/TLS false negative below. **Verify what the sandbox tells you before
concluding something is broken.**

---

## References to fetch (agents should read the real sites, not summaries)

New this round, not yet in earlier briefs:
- https://rows.gg/: interactions, kill row / add new row, particle logo formation
- https://zeviarnovitz.com/: interactions, transitions, hover effects
- https://amicro.vercel.app/: interactions, transitions, hover effects

Full reference list with Giacomo's own notes is in `BRIEF.md` and the Notion doc.

---

## Two hero prototypes. BUILT 21 Jul, awaiting Giacomo's pick

**Both are built, untracked under `src/app/palette/` (drench precedent), live
site untouched. `npm run build` passes, lint 0 errors.** Findable from the
`/palette` accent page, which now carries a "hero prototypes" index. Verified in
a real browser (`npx agent-browser`, light and dark), screenshots taken.

- **V1: `/palette/morph`** (`src/app/palette/morph/page.tsx`). Full-width static
  bar with content on the hero's left edge, detaching on first scroll into the
  centred pill. Tier 2 rubber-band built (not tier 3 goo). Both STATE fixes
  landed: the pill width is **measured** from a hidden ghost of the condensed
  content (not the hardcoded 48rem), and the **scroll-up jitter is gone** because
  the overshoot easing and the squash keyframe live only on the DETACH direction
  (`[data-condensed]`); re-attaching to the top uses a plain ease-out, so the
  reverse cannot fight its own bounce. Local nav stand-in like drench, only the
  theme toggle wired for real. The squash is CSS-only (bound to the condensed
  state), so there is no setState-in-effect.
- **V2: `/palette/face`** (`page.tsx` + `FaceField.tsx`). Real `<Menu>` kept, an
  interactive halftone portrait fills the dead hero right half at >=1024px (hides
  below, hero goes single-column). Reuses the wordmark engine's discipline
  (offscreen sample, token() colour, gated build, **settle-and-stop**) with new
  physics: damped springs home + cursor repulsion. Background is dropped by
  **distance-from-corner-colour**, not a brightness threshold, so a skin highlight
  matching the backdrop's luminance does not punch a hole in the face. Reduced
  motion draws the settled portrait; touch gets a tap-impulse fallback. Dev
  sliders for density / dot size / cutout / repel radius / force / colour.

  **Face source (STATE open item a): RESOLVED 21 Jul.** Giacomo saved a
  high-res square headshot (2162x2162) to `public/face-source.jpg` (it arrived
  named `face-suorce.jpg`, a typo, renamed). `FaceField` still falls back to
  `/avatar-384.jpg` if the file is ever missing, so the route always renders.

  **Background separation took two tries, worth recording.** The subject's black
  t-shirt reaches the BOTTOM edge of the photo, so estimating the backdrop from
  the whole border ring poisoned it with dark pixels and cut the entire face. A
  four-corner average also failed: the backdrop is vignetted, so a single
  reference colour left a halo of surviving cells. What works: estimate the
  backdrop from the **top region only** (top row + upper 40% of the side
  columns, reliably above the shoulders), then drop every cell within a
  `cutout` fraction of the tonal range. `cutout` is a **slider**, default 0.20:
  it is the dial between a cleanly floating face (higher) and a fuller particle
  field (lower), which is a taste call left to Giacomo. At 0.20 the face floats
  clean, verified in-browser against the real headshot.

  Coherence (open item c) is now a live A/B: this is the second particle moment
  after the footer wordmark. Both exist for the comparison; whether both survive
  or the face becomes the sole signature is still Giacomo's call.

  **V2 likeness fix: DONE, 8 Aug 2026.** The two-stage map landed: distance
  from a fitted background model decides subject membership, luminance decides
  dot size, so internal facial shading (eyebrows, eyes, nose, mustache, beard)
  now reads instead of flattening into one blob. Three real bugs found and
  fixed along the way, in `FaceField.tsx`'s `build()`:
  1. **Gamma was inverted.** `gamma < 1` compresses luminance toward the
     large-dot end, so an ordinary midtone rendered at ~64% of max dot size and
     the face came out as one dark mass. Fixed to `gamma = 1.9` (>1 pushes
     midtones toward small dots, reserves large dots for genuinely dark areas),
     plus 3rd/97th-percentile clipping on the luminance range so one catchlight
     or tooth cannot skew the whole scale.
  2. **Floating halo at low `cutout`.** A single flat background-average colour
     could not account for the backdrop's vignette, so far corners registered
     as "far from background" purely from vignette falloff, producing a
     disconnected dot cluster near the shoulder. Traced by dumping the raw
     subject mask as ASCII art rather than guessing. Morphological cleanup
     (erosion + connected-component "largest blob wins") was tried as the fix
     and **caused a worse regression**: erosion fragments the porous face
     interior (eyes, nostrils, highlights create many internal single-cell
     gaps) faster than the solid shirt/shoulders, so the shirt won as "the
     subject" and the whole head was erased at default settings. That code was
     fully removed. The real fix is a **background model**: border samples
     (top row + upper 40% of the side columns, the only region guaranteed to
     be backdrop and not shirt) fit to a full **plane** over (x, y) per RGB
     channel via least squares (3x3 normal equations, Cramer's rule), not just
     a flat average or a radius-only model. `maxD` (the segmentation scale) is
     the 99th percentile of per-cell distance from this model, not the literal
     max, so one outlier cannot blow up the threshold.
  3. **Asymmetric fringe at heavy settings** (confirmed by direct pixel
     sampling: the backdrop is measurably brighter on the right than the left
     at matching radius, e.g. row 15 left ≈134 vs right ≈137) is why a
     radius-only model still left a fringe. The planar fit (independent linear
     terms in x and y, not just radius from centre) captures that directional
     gradient and reduced the fringe from a large prominent triangular cloud
     to faint, localised speckle near the hair/ear at the most extreme slider
     settings.

  **Remaining fringe at `cutout: 0.05` (the slider floor) is expected, not a
  bug.** At that threshold the algorithm trusts the background model to within
  5% of its max residual, which is inside the real noise floor of a JPEG photo
  (compression artefacts, sensor noise). No background model will be exact
  enough to stay clean that close to zero tolerance. Two options if it is ever
  worth chasing further: raise the slider's practical floor (e.g. 0.08-0.10),
  or denoise the source photo before sampling. Left alone for now, Giacomo's
  call, 8 Aug: **"let's keep it like this for the moment with the edited
  settings."**

  **Defaults changed, 8 Aug 2026**, to Giacomo's preferred settings from live
  testing: `pitch: 4, maxDotR: 4, cutout: 0.05, color: "ink"` (was `pitch: 6,
  maxDotR: 2.7, cutout: 0.2`). `repelRadius`/`repelStrength` untouched, the
  physics were never in question. Verified: `tsc`, lint (only pre-existing
  unrelated `no-img-element` warnings), and `npm run build` all clean.

  **V2 is done for now.** Both hero prototypes have had their known issues
  addressed; the morph (V1) is next, see below.

  **V2 addition, 8 Aug 2026: auto demo swipe.** A hover affordance is
  invisible until someone happens to move the cursor over the portrait, so
  `FaceField.tsx` now runs a one-time synthetic sweep to teach it. Once per
  mount, a beat (450ms) after the entrance formation settles, a fake pointer
  sweeps from just off the left edge to just off the right edge over ~1.1s
  (`easeInOutCubic`), then releases. It is not a separate canned effect: the
  sweep drives the exact same `pointer.x/y` + `pointer.active` state the real
  repel/spring code already reads in `step()`, so what plays is the real
  interaction, just cursor-less. Mechanism:
  - `demoPending` is set at both entrance triggers (the `rebuild(entrance)`
    path and the `IntersectionObserver` first-view path), and consumed the
    first time `step()`'s settle branch fires after entrance, i.e. once
    formation has fully stopped moving. `demoTimer` (a plain
    `setTimeout`) then fires `startDemo()` + `wake()` 450ms later, as its own
    RAF cycle, rather than idling the loop through the pause.
  - `startDemo()` sets `demo.active` and a `from`/`to` pair
    (`{x: -side*0.12, y: side*0.5}` to `{x: side*1.12, y: side*0.46}`);
    `step(now)` interpolates `pointer.x/y` along it every frame while
    `demo.active`, using the frame's own RAF timestamp for `demo.t0` so the
    duration is exact regardless of when the callback first fires.
  - **Cancels instantly on real interaction.** `onMove`/`onDown` set
    `userInteracted = true` and `demo.active = false` before anything else,
    so a genuine cursor arriving mid-sweep hands off cleanly with no fight
    between the synthetic and real positions. `userInteracted` also blocks
    the demo from ever being scheduled again for that mount.
  - Respects reduced motion at both the scheduling site and the fire site
    (`reduced()` re-checked inside the `setTimeout` callback, since
    preference can change between the two).
  - Verified in a real browser: RAF-frame-count sampling showed the expected
    three-phase shape (entrance settle, a stop, then a second motion burst
    matching the sweep plus spring-return tail, then a full stop), a 10fps
    `agent-browser` recording showed the visible repel wave crossing the
    face and resolving back to the settled portrait, and a
    `requestAnimationFrame`-count check under `prefers-reduced-motion`
    returned zero, confirming it never runs there.
  - **Not yet seen by Giacomo in a real browser.** Tuning knobs if he wants
    it faster/slower, sooner/later, or a different path: the 450ms delay,
    the 1100ms duration, and the `from`/`to` points, all in `startDemo()`.

  **V2 entrance rewritten, 9 Aug 2026: staggered pop-in, not spring/spiral.**
  The original formation entrance reused the same damped-spring physics as
  the cursor repel: `scatter()` flung every particle away from home, then the
  spring pulled it back, which could overshoot/oscillate before settling —
  the same bounce complaint as V1's morph nav, just in a different prototype.
  Landed via several rejected iterations, worth keeping so nobody re-tries
  them:
  1. **Fixed-angle spiral** (each particle's scatter offset rotated through a
     shared angle while shrinking to zero) removed the spring overshoot by
     construction, but every particle turning through the identical angle in
     lockstep read as "one rigid disk doing a quarter-turn," not organic.
     Per-particle stagger (delay by distance-from-centre) and per-particle
     swirl-angle variance softened but did not fix this — Giacomo's call:
     "don't use rotation."
  2. **Plain global white-flash fade** (dots drawn at final position/full
     opacity immediately, a white overlay fading out on top) removed motion
     entirely but read as "no intro animation" — a single uniform fade has no
     per-element texture.
  3. **What landed:** dots stay at home position (no travel), but each one
     starts ~4-8px offset (`POP_SHIFT`, per-particle deterministic angle) and
     invisible, then fades in (`ctx.globalAlpha`) while easing that small
     offset to zero (`easeOutCubic`). Each particle's start is delayed by
     distance from centre (`POP_STAGGER`, 300ms max), so the reveal ripples
     outward instead of firing at once. A brief white overlay (`FLASH_DURATION`,
     240ms) rides on top for the "photo just taken" beat. `scatter()` was
     removed; `primeEntrance()` (sets `ox`/`oy`/`delay` per particle) replaces
     it at both entrance-trigger sites (`rebuild`'s entrance branch and the
     `IntersectionObserver` first-view branch). Total entrance is fast
     (~300-560ms) and self-contained in `step()`'s `entranceActive` branch,
     which still returns before the interaction-spring code runs, same
     settle-and-stop discipline as before.
  4. **Verification technique, worth reusing:** sub-500ms transitions are too
     fast for `agent-browser` video-recording + `ffmpeg` frame extraction to
     reliably catch — individual frames land pre/post-transition, not mid-way,
     because the CLI round-trip has its own latency relative to the real
     animation clock. Fix: temporarily multiply the duration constants (used
     6x here) so the same code path plays out slowly enough to confirm the
     *shape* of the motion on video, then restore the real fast values
     afterward. `tsc --noEmit` and `eslint` both clean at every step.
  - **Not yet confirmed by Giacomo in a real browser.** Tuning knobs:
    `FLASH_DURATION`, `POP_DURATION`, `POP_STAGGER`, `POP_SHIFT`, all declared
    together near the top of the effect in `FaceField.tsx`.

- **V1 bounce dialled back, 8 Aug 2026.** Giacomo liked the morph animation
  but not the extra spring bounce on the transition between full-width and
  floating (and back); wanted it smooth, maybe slightly gooey, not as bouncy
  as the tier-2 build had been. Both stacking sources of overshoot (diagnosed
  in the previous STATE pass, kept below for the exact mechanism) were toned
  down in `src/app/palette/morph/page.tsx`:
  - `--ease-detach` changed from `cubic-bezier(0.5, 1.5, 0.55, 1)` (the `1.5`
    control point overshoots well past 1) to `cubic-bezier(0.32, 0.9, 0.34,
    1)`, a soft decelerate whose control points never exceed 1, so
    `transform`/`width`/`border-radius`/`box-shadow` all settle without
    overshoot-and-bounce-back.
  - `mnav-squash` collapsed from a four-keyframe squash-then-double-jiggle
    (scaleY swinging 0.7 to 1.075 to 0.97 to 1) to one gentle squash-and-
    release (scaleY dips to 0.95, scaleX to 1.012, straight back to 1, no
    second overshoot). This is what keeps the "gooey" character without the
    bounce: the shape still gives on detach, it just doesn't spring past its
    target and back.
  - Re-attach untouched: still the calm `--ease-return`, no keyframe, so the
    scroll-up jitter fix stays exactly as it was.
  - Verified by sampling, not just eyeballing: frame-by-frame `eval` polling
    in a real browser showed `.mnav-box` width decreasing monotonically from
    1440px to 638px with no overshoot-and-settle-back, and the squash
    keyframe's computed `transform` peaking once (scaleY ~0.95 around
    250ms) then recovering smoothly to `matrix(1,0,0,1,0,0)` with nothing
    exceeding 1 on the way back.
  - `--dur-morph: 460ms` unchanged.
  - **Not yet confirmed by Giacomo.** Shown as changed; still wants his own
    look before this is called settled.

- **V1 detach jump fixed, 9 Aug 2026.** Giacomo flagged (screenshot from a scroll
  recording) that content jumped from centred to left-aligned the instant the
  full-width bar started detaching, only on that direction: not on re-attach,
  and shouldn't happen on detach either. Root cause: `.mnav-box`'s `width`
  animates over `--dur-morph`, but `.mnav-inner`'s own centring
  (`margin-inline: auto` <-> `0`, plus `max-width`/`padding-inline`) has no
  transition and snaps the instant `[data-condensed]` flips. On detach that
  meant the inner packed itself flush-left inside a box still near full width,
  then the box caught up and the pill "recentred" a moment later, reading as a
  jump. Re-attach didn't show it because the wrapper's `justify-content:
  center` keeps the box itself centred either way, so a symmetric width change
  around a fixed centre masked the inner's own snap.
  - Fix: `.mnav-box` is now `display: flex; justify-content: center;`, so
    `.mnav-inner` is centred inside the box at all times regardless of its own
    margin/width. The inner's instant snap still happens (untouched, still no
    transition on it) but now always happens around the box's centre, so
    there's nothing to jump.
  - Verified by sampling, not eyeballing: `agent-browser eval` polled
    `getBoundingClientRect()` on `.mnav-box` and `.mnav-inner` every ~20-30ms
    across both directions. `innerCenter - boxCenter` stayed exactly `0` at
    every sample, detach and re-attach, including the instant the inner's
    width snaps from 1152px to 636px mid-transition.
  - Note for next session: this ran against the Chrome MCP tools first and
    silently produced flat/frozen samples because the window was hidden
    (`document.visibilityState === "hidden"`, see the hidden-window memory);
    switched to `npx agent-browser` and got real data. Same failure shape as
    always: check the tool before concluding the code is broken.
  - **Superseded same day, see below: the centring fix was correct but only
    treated one symptom of a bigger problem.**

- **V1 size snap fixed, 9 Aug 2026 (same day as above).** Giacomo tried the
  centring fix live and it made things feel *more* jittery, not less: content
  now jumped straight to its final condensed size and centred position the
  instant detach triggered, then the box's translucent background "shortened
  with a significant delay" around already-settled content. Correct diagnosis
  of the previous fix: centring the box masked the ALIGNMENT half of the snap
  (inner jumping flush-left) but the SIZE half (inner's `width`, `max-width`,
  `padding-inline`, `margin-inline` all switching value with no transition,
  same root cause as before) was still there and, once alignment stopped
  hiding it, became the dominant visible artefact: the wordmark itself now
  visibly leapt from the hero's left edge to viewport-centre in one frame.
  - Real fix this time: stop giving the inner two discrete layouts to snap
    between at all. `.mnav-inner` is now `width: 100%; max-width:
    var(--container)` in BOTH states (was `width: auto` / no max-width when
    condensed) — since the box's own `width` already animates smoothly
    between full-viewport and the pill, an inner that is always "100% of
    whatever the box currently is" tracks that animation for free, with
    nothing of its own to snap. `margin-inline: auto` came off entirely
    (redundant now that the box centres via flex from the earlier fix).
    `.mnav-rule`'s auto margin (pushes ⌘K/theme to the far right when
    expanded) is no longer force-zeroed on condense either: left as `auto 0`
    in both states, the pushed gap it creates just continuously shrinks to
    nothing as the inner narrows, which is the same "let an existing
    transition do the work for free" trick. The one property that is
    genuinely a two-value swap, `padding-inline` (roomy at rest, packed once
    condensed), now has its own `transition: padding-inline var(--dur-morph)
    var(--ease-detach|return)`, mirroring exactly how the box already splits
    its own transition by direction. The measuring ghost keeps the old hard
    `width: auto` / zeroed-rule layout (still correct and necessary there:
    it exists purely to report the pill's natural width, and that has to be
    computed against real "shrink to content" sizing, not "100% of a box
    that doesn't exist yet").
  - Verified the same way, sampling not eyeballing: `agent-browser eval`
    polled `.mnav-box` width, `.mnav-inner` width, and computed
    `padding-left` on `.mnav-inner` every ~25-30ms across both directions.
    All three now move together at every sample (e.g. detach: 1280/1152/32px
    -> 638/636/16px, strictly monotonic, no value ever jumping ahead of or
    lagging the others); `innerCenter - boxCenter` still holds at `0`
    throughout from the earlier fix.
  - The binary trigger itself (condense the instant the sentinel leaves view,
    no scroll-position hysteresis) is unchanged and was a deliberate earlier
    call, see the "Condense the instant..." comment in `MorphLab`'s effect.
    Giacomo's "detaches 1 nanosecond after I touch the scroll" complaint may
    partly be about that instant trigger rather than the animation quality;
    worth a direct question before touching it, since it was a deliberate
    fix for a different bug (scroll-position hysteresis jitter) and a
    scroll-linked (non-binary) alternative is a materially bigger change.
  - **Not yet confirmed by Giacomo.**

- **V1 re-attach arrival timing fixed, 9 Aug 2026 (same day).** Giacomo tried
  the size-snap fix live: much better, but on RE-ATTACH (floating back up to
  fixed) the content "springs too quickly to the fixed position" while "the
  bottom border lines take too long to reach the edges" — content arriving,
  then the bar visibly still growing around it for a beat after. Diagnosis:
  `.mnav-inner`'s `width: 100%` was still being read live off `.mnav-box`,
  which is correct for keeping them in sync AT REST, but wrong for arrival
  timing, because the box and inner have different rest widths by design
  (box = full viewport edge-to-edge bar, inner = capped to `--container` so
  content aligns with the hero). Deriving inner's width as "100% of box,
  clamped to --container" means the clamp engages, and inner FREEZES, the
  moment the box's live width crosses the container threshold, which on a
  typical viewport happens well before the box's own ease-out finishes its
  slower, longer decelerating tail out to full width. Content stops moving
  a good fraction of a second before the bar does, exactly the reported lag.
  - Fix: `.mnav-inner` now has its OWN `width` transition, target
    `min(var(--container), 100vw)`, no longer derived from the box at all.
    Same `--dur-morph` and the same `--ease-detach`/`--ease-return` split as
    the box's own width transition, just a different endpoint. Two lengths
    that share a start value and a clock, animated with the same easing and
    duration, always reach their own (possibly different) end values at
    exactly the same time — that's what makes "detach/attach at the same
    moment" hold regardless of how much further the box travels than the
    inner. It also can't overshoot: since the inner's target is never bigger
    than the box's, and both start equal and move via the same easing curve,
    the inner is mathematically guaranteed to stay <= the box at every
    instant in between, not just at the endpoints, so it can never visually
    escape the bar it lives in.
  - Condensed target for the inner is now literally the same expression as
    the box's own condensed width (`var(--pill-w, min(46rem, calc(100vw -
    var(--sp-4))))`), so detach was already fine (both had the same target
    already) and stays fine.
  - Verified by sampling: `agent-browser eval` polled both widths every
    20ms through a full re-attach. Before: inner froze at 1152px around
    t=570ms while the box kept animating to 1280px until t=791ms, a ~220ms
    gap. After: inner reaches 1152px at t=761ms and the box reaches 1280px
    at t=782ms, within one sampling tick of each other, i.e. effectively
    simultaneous. Detach re-verified unaffected (box/inner both still land
    on the shared pill width together, as before).
  - **Not yet confirmed by Giacomo.**

- **V1 re-attach speed and trigger point, 9 Aug 2026 (same day).** With
  arrival timing fixed, Giacomo asked for the re-attach transition itself to
  be faster, and to start a little before the scroll gesture actually reaches
  the top rather than only after: "it currently lags bc it starts after the
  scroll reaches the top."
  - **Trigger:** replaced the old 1px `IntersectionObserver` sentinel (which
    could only ever fire at exactly `scrollY === 0`, hence the lag Giacomo
    felt: nothing happens until the gesture is fully over) with a scroll
    listener carrying two distinct thresholds instead of one: detach still
    fires the instant `scrollY > 0` (unchanged, was already immediate and
    nobody asked to change it), but re-attach now fires as soon as `scrollY
    <= 64` (`--sp-8`) rather than requiring `scrollY === 0`. Kept binary
    (still just a `boolean`, `requestAnimationFrame`-batched), so the
    "no hysteresis to fight" property the old sentinel comment cared about
    still holds: a scroll position between 0 and 64 is stable either way, it
    just depends which edge you arrived from, so there's no rapid on/off
    flicker to worry about, only a deliberately earlier start point on the
    way up. The sentinel div and its CSS rule were dead code once this
    landed, removed both.
  - **Speed:** `--dur-morph` (460ms) now only drives the DETACH direction;
    re-attach gets its own `--dur-return: 320ms` on the wrapper transform,
    the box's width/border/radius/shadow, and the inner's width/padding
    transitions (everywhere the base, non-`[data-condensed]` rule applies).
    Detach keeps the slower duration; it triggers instantly, so it can
    afford to take longer, and Giacomo didn't ask to change it.
  - Verified: `agent-browser eval`, scroll-position + `data-condensed`
    reads confirmed condensed stays true at `y=70`, flips false at `y=50`,
    and detach still flips true instantly at `y=1`. Box-width sampling
    through a full re-attach showed the transition completing in ~300ms
    (started ~t=42-61ms after the scroll command, landed at 1280px by
    t=341ms), matching the new 320ms duration rather than the old 460ms.
  - **Not yet confirmed by Giacomo.**

- **V1 re-attach threshold widened, and a real slow-scroll bug found and
  fixed, 9 Aug 2026 (same day).** Giacomo: still felt laggy, wanted the
  return transition starting earlier than the 64px the previous pass landed.
  Separately, a slow, deliberate scroll DOWN from fixed made the bar "shake,
  dance, stretch and shrink" repeatedly, "undecided if to shrink to float or
  not." A fast, decisive scroll never showed it.
  - **Threshold:** `REATTACH_PX` raised from 64 to 160. Plain tuning, not a
    design-token value; picked for feel (more runway for the 320ms return
    transition to actually finish before a real scroll gesture's deceleration
    tail ends).
  - **The shake was a genuine bug in the previous pass's hysteresis, not a
    vague feeling: found and fixed.** The earlier fix, `setCondensed(prev =>
    scrollY > (prev ? REATTACH_PX : 0))`, reasoned that a position between 0
    and REATTACH_PX is "stable either way, just depends which edge you
    arrived from" — true only if the state updates atomically once per
    crossing. It does not: this is a per-scroll-sample check with no memory
    of direction, so for ANY y strictly between 0 and REATTACH_PX, "detach at
    y > 0" and "re-attach at y <= REATTACH_PX" are BOTH satisfied
    simultaneously, and which one the code evaluates depends only on `prev`,
    i.e. on the OUTCOME of the previous sample, not on which direction the
    user is actually scrolling. Slowly scrolling down through that band
    produces a new sample roughly every animation frame, and the two rules
    took turns winning on alternating samples: condense (prev was false, y >
    0) is followed immediately next frame by re-attach (prev is now true, but
    y still not > REATTACH_PX), which flips prev back to false, so the NEXT
    frame condenses again, and so on for every single frame spent inside the
    band. That is the shake, literally the squash keyframe and width
    transition re-triggering every ~16ms. A fast scroll jumps the whole band
    in one or two samples and never dwells there, which is why it looked
    fine.
  - Fix: track direction, not just position. A `lastY` ref compares each
    sample to the previous one (`dy = y - lastY.current`); moving down
    (`dy > 0`) always condenses and holds, regardless of position within the
    band; moving up (`dy > 0` false, `dy < 0`) is the only case allowed to
    re-attach, and only once past REATTACH_PX; no net movement holds
    whatever the state already was. This removes the ambiguity that made the
    old check position-only and direction-blind: the two rules can no longer
    both fire for the same y, because which one applies now depends on which
    way you got there.
  - Verified by simulating a slow scroll, not just a fast one, which is
    exactly the case the earlier eyeballing (and earlier `agent-browser`
    verification, which only ever tested single big jumps) missed: stepped
    `scrollY` in 3px increments across the whole 0-300px range (down) and
    300-0px range (up), reading `data-condensed` after every step. Zero
    flips-back-and-forth (`flapped: false`) in both directions; condensed
    turns on at the first step past 0 and stays on the whole way down;
    re-attach now flips at exactly y=160 on the way up, matching the new
    threshold.
  - Lesson for next time: the original binary sentinel comment's claim (single
    threshold, "no hysteresis to fight") was correct for THAT design because
    it only ever had one threshold in the first place. The moment a second,
    direction-dependent threshold was introduced, position alone stopped
    being sufficient information, and this needed catching by simulating a
    slow multi-sample crossing, not just checking the before/after value at
    two widely separated scroll positions.
  - **Not yet confirmed by Giacomo.**

- **Cleanup, 9 Aug 2026.** With the morph and face work committed
  (`683c49e`), Giacomo asked to clear out what the hero-prototype work had
  left behind:
  - **Branches:** `direction/a-editorial` and `direction/c-tactile` deleted.
    Both were full alternate homepage directions from the original A/B/C
    exploration (see `docs/STATE.md` history above and the Notion doc);
    `direction/b` was the one picked, and `direction/b2` is its continuation.
    Neither deleted branch was ever pushed to `origin` (only `main` and
    `direction/b2` are there), so this was unrecoverable. Confirmed with
    Giacomo first, including showing him a live screenshot of all three
    (`npx agent-browser`, via temporary `git worktree`s with their own
    `npm install`, torn down after) before he chose. `direction/b-instrument`
    (the un-continued "B" itself, as opposed to the A/C alternates) was left
    alone, not part of what was asked.
  - **`/palette/drench` removed.** It was Version 1's own precedent (the
    "drenched hero + morph" experiment the real morph nav was ported and
    tiered up from, see "Original specs" below), superseded once V1 landed
    on the homepage-hero route, so unlike `/palette/morph` and
    `/palette/face` (both still open, neither confirmed as final) it wasn't
    actually in play any more. Removed the route
    (`src/app/palette/drench/page.tsx`) and its entry in the
    `/palette` hero-prototypes index (`src/app/palette/page.tsx`),
    regenerated `src/lib/graph.json` via `npm run graph`. The comment in
    `morph/page.tsx` crediting drench as V1's precedent was left alone: true
    history, not a live link.

- **Both hero prototypes shipped to the real homepage together, 9 Aug 2026.**
  Giacomo's call: not a pick-one-of-two, both V1 and V2 land on `/` at once.
  This is the decision the "Not yet confirmed by Giacomo" notes above were
  waiting on.
  - **Nav (`src/components/Menu.tsx`).** Now a client component. Takes a new
    `morph` prop, default `false` (every other page: `/lab`, `/lab/architecture`,
    `/palette`, `/palette/face`, `/404`, unchanged, still the plain
    always-floating `.fmenu` pill, verified by checking `.mnav` does not
    exist in their DOM). The homepage passes `morph`, getting the full-width
    bar that detaches into that same pill on scroll. The actual nav content
    (avatar/wordmark, IA links, soon-tooltips, ⌘K, theme toggle) is now a
    shared `MenuInner`, rendered identically by both modes; a `ghost` variant
    swaps `CommandPalette`/`ThemeToggle` for inert same-size stand-ins for the
    hidden pill-width-measuring copy, since `CommandPalette` owns fixed DOM
    ids and a global ⌘K listener that must exist exactly once. The `.mnav`/
    `.mnav-box`/`.mnav-inner` mechanics moved from the prototype's inline
    `<style>` into `globals.css` as shared, permanent rules; the actual nav
    ITEMS reuse the existing `.fmenu-home`/`.fmenu-avatar`/`.wordmark`/
    `.fmenu-links`/`.fmenu-link`/`.fmenu-soon-wrap`/`.fmenu-tip`/
    `.fmenu-rule`/`.palette-trigger`/`.icon-btn` verbatim rather than a
    parallel `.mnav-*` item class family, which is also what guarantees the
    condensed end state is pixel-identical to the plain pill (verified: same
    padding-inline, border-radius, shadow, background, blur, sp-3 float
    offset) rather than two class families someone has to keep in sync by
    hand. One real difference had to be added: `.fmenu-rule` has no
    push-right margin in the compact pill (nothing to push into there), but
    the full-width bar needs it to send ⌘K/theme to the far right like a
    normal header, so `.mnav-inner .fmenu-rule { margin-inline: auto 0; }` is
    a new, scoped addition, left off `.fmenu-rule` itself. Also fixed in
    passing: the reduced-motion block never covered `.mnav-inner`'s own
    width/padding transition (a pre-existing gap from the prototype), added.
    `/palette/morph` itself was left untouched (own local `NavInner`
    stand-in, own inline `<style>` with the same class names): the page's own
    later-loaded styles win the cascade over the new global ones by DOM
    order, verified no visual regression, but it is now genuinely duplicated
    CSS rather than a single source of truth. Worth collapsing the prototype
    down to `<Menu current="/palette/morph" morph />` at some point, the way
    `/palette/face` already uses the real `<Menu>`; not done this pass to
    keep the diff to what was asked.
  - **Face (`src/components/FaceField.tsx`, moved from
    `src/app/palette/face/FaceField.tsx`).** Exports `FACE_DEFAULTS`, the
    same tuned constants `/palette/face` was already using, now the single
    source for both places. Homepage hero (`src/app/page.tsx`) restructured
    into a two-column grid at >=1024px (`.hero-grid`/`.hero-copy`/
    `.hero-face`, moved into `globals.css` from the prototype's inline
    `<style>`), face on the right, hidden and single-column below that,
    exactly as `/palette/face` already behaved.
  - **A real, non-obvious bug, found and fixed: the face never rendered on
    the homepage at first** (blank canvas, silent). Root cause: `page.tsx`
    is a Server Component; `<FaceField {...FACE_DEFAULTS} />` imported
    `FACE_DEFAULTS` as a plain data value from `FaceField.tsx`, a `"use
    client"` module. A named value export from a client module does not
    survive the server-to-client serialization boundary as real data, it
    resolves to a client-reference marker; every field of the spread came
    through `undefined`, `cols = Math.max(8, Math.round(side / pitch))`
    went `NaN`, and `getImageData(0, 0, NaN, NaN)` threw (WebIDL rejects
    `NaN` for a `long` argument), caught by Next's error overlay, canvas
    left blank since `build()` bailed before populating any particles.
    `/palette/face` never hit this because its own page is already a client
    component (`"use client"` at the top), so passing `FACE_DEFAULTS` there
    is an ordinary same-side import.
    - Fix attempt 1, wrong: a parameter default,
      `function FaceField(cfg: FaceConfig = FACE_DEFAULTS)`. Resolves the
      right value at runtime, but `<FaceField />` still failed to
      type-check: JSX with no attributes produces a props type of `{}`, and
      TypeScript checks `{}` against the parameter's own annotated type
      (`FaceConfig`), not what the default would resolve to; `{}` is missing
      every required field.
    - Fix attempt 2, also wrong: `cfgProp?: FaceConfig` resolved with
      `cfgProp ?? FACE_DEFAULTS` inside the body. Same failure, same reason:
      `{}` does not satisfy `FaceConfig | undefined` either (it is not
      literally `undefined`).
    - **What actually worked:** every field individually destructured with
      its own default from `FACE_DEFAULTS`, typed as `Partial<FaceConfig> =
      {}`. `{}` trivially satisfies `Partial`, so `<FaceField />`
      type-checks; `/palette/face`'s full `{...cfg}` spread still
      type-checks too, since a complete `FaceConfig` is always a valid
      `Partial<FaceConfig>`. Reproduced and confirmed the exact failing/
      passing pattern in isolation (a throwaway `src/repro.tsx`, deleted
      after) before touching the real component, rather than guessing
      between the three approaches against the full dev server each time.
  - Verified end to end in a real browser (`agent-browser`, the Chrome MCP
    window is backgrounded again this session, see the hidden-window
    memory): homepage screenshot at 1440px shows the full-width bar and the
    rendered halftone portrait together; scripted scroll confirms
    `data-condensed` still flips correctly and the condensed pill is
    visually identical to the old floating pill; `/lab` screenshot confirms
    the plain pill, unaffected, `/lab`'s own item highlighted; 768px and
    390px screenshots confirm the face hides and the nav's own existing
    breakpoints (soon-links drop, then the tld, then the ⌘K label) still
    fire correctly in morph mode; `/palette/morph` re-screenshotted, no
    visual regression from the now-duplicated CSS. `npx tsc --noEmit`,
    `npx eslint src` (0 errors, the same 3 deliberate `no-img-element`
    warnings plus one more from the same line now reached via `MenuInner`'s
    second call site) and `npm run build` all clean; also removed one
    genuinely stale `eslint-disable-next-line react-hooks/exhaustive-deps`
    in `FaceField.tsx` that ESLint flagged as unused once other things
    moved around it.
  - **Not yet confirmed by Giacomo in a real browser** (only verified by the
    agent so far, per the hidden-window constraint this session).

Original specs, kept for reference:

Giacomo wanted **two isolated prototypes to compare**, built the way the drenched
hero was (own route under `src/app/palette/`, live site untouched, he picks after
seeing them).

**Version 1: static nav morphing into the floating menu, on the homepage.** Port
the morph from the drench prototype (`src/app/palette/drench/`) to the real hero.
The argument for it is alignment: the hero is left-aligned but the floating menu
is centred; a full-width bar whose content aligns to the hero's left edge, morphing
into the centred pill, physically reconciles the two. Giacomo wants the morph
**more exaggerated, almost gloopy while detaching** from the static bar. Tiers:
(1) elastic overshoot, dialled up; (2) squash-and-stretch rubber-band; (3) true
SVG goo/metaball. **Recommended: build tier 2 first**; tier 3 (goo) fights the
frosted/backdrop-blur material and risks reading gimmicky. Also fix, as part of
this: the scroll-up jitter (overshoot fighting direction) and the fixed-width pill
(measure content instead of the hardcoded 48rem). Note: makes `Menu` a client
component (scroll state), a small move off the mostly-static architecture.

**Version 2: keep the floating menu, add an interactive element to the right of
the hero.** Giacomo's face (from the avatar photo) forming in a **stippling /
halftone particle** field, filling the empty hero right half the impeccable
critique flagged (~45% dead space >=1024px). The cursor moving through it breaks
the particles, which spring back home. Reuse the `ParticleWordmark` engine
(`src/components/ParticleWordmark.tsx`): sample source luminance on a grid, dot
size/density by darkness, cursor repulsion with damped spring return, and the same
settle-and-stop / reduced-motion discipline so it idles when undisturbed. Open
items: (a) **needs a higher-res square face export**, the avatar is only 96/192px;
(b) desktop-only interaction, needs a touch fallback (settled halftone, maybe
tap-to-disturb) and stacks/hides on narrow viewports; (c) **coherence**: two
particle moments (hero face + footer wordmark) may feel repetitive, decide whether
both live or the face becomes the signature.

### 21 Jul outcomes (this session), before the clear

- **Drenched-hero experiment parked** at `src/app/palette/drench/` (untracked,
  noindex, live hero untouched). Interactive: four grounds (lead = committed
  petrol) + a drenched/current toggle + the morphing nav. Built to answer the
  impeccable critique's second P0, "the accent does not exist" (accent on 10 of
  ~1600 colour slots, chroma 0.033, perceptually grey). Giacomo: "leave it there
  for the moment." Reason it's not a one-line swap: `--accent` drives ink and
  washes only, a drench is a surface change.
- **Homepage, done and verified (uncommitted at time of writing):** hero
  coordinates removed as rhythm noise, email returned to its original inline
  position (a CTA-promotion attempt was reverted, the hero is not a place for a
  CTA). Touch targets on the nav controls raised to a true 44px block axis,
  measured live with `elementFromPoint`: `.icon-btn` 44, `.palette-trigger` 46,
  `.fmenu-link` 46.
- **Impeccable critique tail, still open:** flat type scale (P3, wants a
  before/after, high blast radius, not silent), mono overuse (deliberately held,
  it is entangled with the unresolved headline direction question), and the
  smaller findings. The CTA finding was addressed differently than the critique
  proposed: not a CTA, see the hover-moments roadmap below.

## Roadmap: the hero as inline hover moments. Parked, Giacomo 21 Jul

Not for now, but the direction the hero metadata is being kept for. The flat
`Florence, Italy · 43.77°N 11.26°E` coordinate line was removed on 21 Jul as
rhythm noise precisely because it was the *lifeless* version of this idea, and
an earlier attempt to promote the email into a call-to-action was reverted the
same day: the hero is not a place for a CTA or a data readout.

The idea instead: rework the hero prose so the functional facts become
highlighted or underlined words woven into the sentences, each one an excuse for
a hover-reveal that shows personality.

- **Florence.** Copy along the lines of "...living in Florence..." with Florence
  underlined; on hover, a preview card with a photo of the city and a live
  weather card, e.g. "33°, Sunny". (The removed coordinates become this.)
- **The LLM prompt CTAs.** The copy-as-prompt affordance, mentioned inline in
  the prose rather than as a bare button row; on hover, a small preview card of
  the prompt / what it does.
- **Side projects.** The things he's currently experimenting with, named inline;
  each with a small preview card on hover.

Why it is good: it turns metadata (location, contact, machine CTAs, side work)
into delight embedded *in the sentence*, not a separate block, and it answers the
humour / personality gap on the one surface everyone sees first.

Things to weigh when it is picked up:
- **Weather needs live data** for Florence. Static export, so a client-side fetch
  or a tiny build-time step, not a hardcoded string.
- **Hover has no touch equivalent.** The preview cards need a tap/focus fallback,
  or they are desktop-only garnish. This is a reusable inline-popover primitive,
  not a one-off.
- It is a **hero copy rewrite plus an interaction system**, so it lands with the
  humour-gap work, not as a quick pass. See "Where humour lives" under open
  questions, and it sits alongside the drenched-hero experiment at
  `src/app/palette/drench/`.

---

## Open questions

- ~~Particle effect: hero or footer?~~ **RESOLVED: footer**, 19 Jul.
- ~~Which `connex` mockup the Okappy entry should show.~~ **RESOLVED 19 Jul: the image was right,
  the label was wrong.** It is now `okappy/db-cards.jpg`, captioned "Cards: fewer, with more
  detail". Reasoning worth keeping: the Okappy copy already weighs "more connections above the
  fold against fewer with richer detail", and `db-list.jpg` directly above shows the dense list,
  so `connex-1` (card grid) is the other half of that sentence. Swapping to `connex-2` would
  have been the actual mistake: it is a perspective mockup of the same list, so the entry would
  have made one point twice and left the trade-off unillustrated. Renamed rather than
  re-exported, since the pixels were always correct.
- `hundo/learn-tablet`: 450x685 source, too small for its slot. Shrink, drop, or re-export.
- ~~Passionfruit screenshots: no archive source.~~ **RESOLVED 19 Jul for two of three.** One left:
  `onboarding-goals` needs a re-export with the "camapaign" typo and the duplicated "Retain
  customers" chip fixed. See "Passionfruit sources landed".
- Music player content source. Copyright makes hosting other artists' tracks a problem. Cleanest
  route is his own labels, Never Ready and Five Fold. Also, rotating a fixed set is not really
  "new tunes every day".
- Where humour lives. Still unsolved and still the biggest gap between this site and the
  personality he wants. Candidates: microcopy, the empty state of ⌘K, 404. **The 404 now exists**
  (`src/app/not-found.tsx`, added 20 Jul) and its copy is deliberately plain: a joke written in
  someone else's voice reads worse than no joke, so the structure was built and the line left for
  Giacomo. It is the cheapest of the three surfaces to write for, since a 404 is seen once by
  someone already mildly annoyed. The ⌘K empty state (`no matches for "…"`) is the other strong
  candidate: it is the one surface that speaks only when someone has typed something that is not
  there, and it is currently the flattest string in the codebase.
- ~~Tonic-lab: to be featured as a working link.~~ **DONE 19 Jul.** It leads `/lab`, and is in
  the palette and `llms.txt`. Copy written from the running app, not guessed.
- **Okappy and Redington FRANK-E are withheld from the site, 20 Jul.** Giacomo's call, taken
  after a portfolio audit flagged eight entries as too many. They are hidden, not deleted:
  `hidden: true` on the entry in `src/data/site.ts` is the single switch, and the markup stays
  in `page.tsx` behind an `isHidden` guard. Open question is whether they come back, and if so
  whether FRANK-E returns as the reworked design or as a then/now pair (see asset rework below).
  If you flip either flag, remember `public/llms.txt` and `public/index.md` are hand-written and
  do not read `site.ts`.
- ~~Copy still to write: Octopus Powerloop, Redington FRANK-E.~~ **Stale, corrected 19 Jul.**
  Both have shipped copy in `page.tsx`, short but written. Giacomo's call: short is fine, the
  long version belongs on the future case study pages.
- Photography: coming, slow. Route stays signposted and empty.
- Asset rework: Giacomo is redesigning some older assets, FRANK-E named. Open question whether
  reworked screens are shown as today's design or as then/now pairs.

---

## Technical debt

- ~~Homepage references ~640KB uncompressed JS.~~ **Measured 20 Jul. Closing this: there is no
  cheap win, and the site is already fast.** Details below, because the obvious fix was tried
  and it made things worse.

  **The numbers.** 631KB is the *uncompressed* figure and it was the wrong one to worry about:
  the homepage transfers **189KB gzipped** across 9 chunks. On the production build served
  statically: `domInteractive` 237ms, `load` 344ms, one long task of **219ms** at startup, total
  blocking time **169ms**. The long task, not the byte count, is what "laggy" would actually be.

  **The architecture is already right, which is why there is nothing easy left.** `page.tsx` is
  a Server Component and only the genuinely interactive leaves carry `"use client"`. There is no
  misplaced client boundary to fix. The 219ms is React plus the Next App Router client runtime
  booting and hydrating, plus parsing the 60KB RSC flight payload inlined in the HTML.

  **Tried and reverted: code-splitting the three interaction-only islands.** `Lightbox` (204
  lines), `CommandPalette` (313) and `ParticleWordmark` (329) are all eagerly imported for
  features nobody has used at first paint, so `next/dynamic` looked like an easy ~850 lines off
  the critical path. It is not. **TBT went 169ms to 223ms** and a second 102ms long task
  appeared, while the original 221ms task did not shrink at all. The reason: with SSR left on
  you still pay the full hydration, and now also pay a chunk round-trip and a second hydration
  pass on top. Payload did not move either (631.4KB to 632.8KB), because Next preloads the
  split chunks anyway.

  **And SSR cannot simply be turned off on those three.** `ParticleWordmark` renders the
  plain-text `ciao :)` fallback that the canvas replaces, so `ssr: false` empties the footer
  until JS lands and forever without it. `CommandPalette` renders the visible ⌘K chip in the
  menu, not just the dialog, so it would pop into the header after load.

  **What would actually move it is architectural**, not tuning: not shipping a React runtime for
  a page that is ~95% static. That is a rewrite, and it is not worth doing before launch for
  169ms of blocking on a page that is otherwise entirely static content. Revisit only if real
  devices say otherwise: on a mid-tier phone that one task is roughly 4x longer.
- Below 44rem the menu drops the planned-route signposts entirely, so mobile users get no IA
  hint. ⌘K is the only escape hatch.
- "Coming soon" tooltips are hover/focus only, invisible on touch.
- The architecture map is pointer-only. The data table is the accessible equivalent.
- Map layout is deterministic per viewport size but not across sizes.

---

## Repo

- `main`: old site, still live on gpcodes.com, untouched
- `redesign`: Next scaffold baseline, old site in `legacy/`, CNAME in `public/`
- `direction/a-editorial`, `direction/b-instrument`, `direction/c-tactile`: the explorations.
  **Branches kept, worktrees removed 20 Jul**, since b2 settled it and the three checkouts were
  about 1.7GB of mostly `node_modules`. Nothing was lost: every commit is still on its branch,
  and `git worktree add ~/code/gpcodes-a-editorial direction/a-editorial` brings one back.
  Note these three are local-only and have never been pushed, so the branches are the only copy.
- `direction/b2`: **the working branch**
- Only two worktrees now: `~/code/gpcodes` (the primary repo, `.git` lives here) and
  `~/code/gpcodes-b2`. **Do not delete `~/code/gpcodes`**: besides being the real repo, it still
  holds the untracked Passionfruit source exports and the Powerloop PNG.
- Dev server: `cd ~/code/gpcodes-b2 && npm run dev -- -p 3004`
- Source archive: **`~/Downloads/Portfolio/`, extracted and complete.** The pipeline resolves
  every manifest entry against it (`node scripts/images.mjs ~/Downloads/Portfolio --dry` reports
  0 missing). Note the `Portfolio.zip` this came from is **gone** from `~/Downloads`, so the
  extracted tree is now the only copy. Run the pipeline from a root that resolves everything:
  `images.json` is regenerated wholesale, so a run against a partial root would silently demote
  every unresolved asset to `unverified`.
- **`~/Downloads/Portfolio/Passionfruit 2026/`**: the three 2026 exports, added 19 Jul. They sit
  inside the archive tree because the pipeline indexes it recursively by basename, which is why
  no multi-root support was needed. The 2023 archive predates this work and never had them.
  **These are the only copy of the Passionfruit sources**, and they deserve a more durable home
  than `~/Downloads` alongside a zip that has already disappeared once.
- **`~/code/todo-app`**: the interaction study, its own repo, its own branding. Not part of this
  site. `/lab` will link out to it.

### gpcodes.com expired and was renewed, 19 Jul. Resolved

While expired, the registrar parked it: `gpcodes.com` served a Vite-built lander with an empty
`<title>` instead of the portfolio. **Renewing fixed it.** The site is back and HTTPS is valid,
confirmed in a real browser (`isSecureContext: true`, title `GP Codes - UI/UX Design`).

**Lesson about tooling, worth more than the incident.** During this I reported that HTTPS was
broken on the server. That was wrong. `curl` from the agent sandbox returns status `000` with a
TLS handshake error for `https://gpcodes.com` even when the site is perfectly healthy, so the
sandbox produces false negatives on TLS. **Verify anything network-facing in the browser before
concluding it is broken.** The same caution applies to `dig` results from the sandbox.

**Still genuinely unconfirmed:** whether `gpcodes.com` is served by GitHub Pages. From the
sandbox, DNS resolved to `216.227.142.171` with `server: nginx/1.28.3 (Ubuntu)`, which is not a
Pages IP (Pages uses `185.199.108-111.153`), and GitHub Pages was seen 301-redirecting to
`https://gpcodes.com/`. If that is accurate, the live site is hosted elsewhere and **"launch is
a merge into `main`" would not hold**, because merging would update Pages while the domain is
served by another host. But given the sandbox's unreliability here, do not act on it: check
**GitHub repo, Settings, Pages**, which states plainly where the site is served from. Settle this
before planning a launch date, not on the day.

### Deploying a preview, decided 19 Jul

**Stay in the `gpcodes` repo.** A separate repo was considered and rejected: it would mean either
migrating the custom domain off GitHub Pages later (DNS propagation, possible cert re-issue,
downtime) or keeping two remotes in sync forever. The existing locked decision holds, launch is
still just a merge into `main`.

- The remote is `github.com/GiacomoPatella/gpcodes`, and it is **public**. Only `main` has ever
  been pushed; every direction branch is local-only, including `direction/b2`.
- **Use Vercel**, pointed at the repo with `direction/b2` as the production branch. Push updates
  the preview. It cannot touch `main`, DNS, or the live site, which is the point.
- Keep `output: "export"`. Vercel serves the static output fine, and GitHub Pages is still the
  real target: diverging the build config means previewing something other than what ships.
- `public/CNAME` is inert on Vercel, just a static file. It does not affect routing and Vercel
  will not claim the domain unless it is added in project settings.
- **Serving it at `gpcodes.com/some/path` was investigated and rejected.** GitHub Pages serves
  one source per repo, so a subpath cannot map to another branch. The only route is committing
  build output into the branch that serves the live site, which needs `basePath` plus
  `assetPrefix` (and note `basePath` does **not** rewrite raw `<img src="/...">`, which is what
  this site uses), and puts preview artefacts in the branch serving gpcodes.com. Not worth it
  during iteration. At launch, a GitHub Action building both sites into one Pages deploy is the
  clean version.
- Turn on Vercel Deployment Protection while iterating if it should not be crawlable.
- ~~Not yet pushed.~~ **Done.** `direction/b2` is on `origin` and Vercel is wired up, confirmed
  19 Jul. The branch is public, so treat history as permanent. Vercel builds from the pushed
  branch, so **the preview only moves when you push**: local commits do not update it.
