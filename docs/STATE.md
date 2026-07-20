# Current state and outstanding work

Written 19 Jul 2026, last updated 20 Jul, as a handoff so no context is lost on a session clear.
Branch `direction/b2`. Read alongside `BRIEF.md`, `REVISION.md`, `CONTENT.md`, `MAP.md`, `PASS3.md`.
The Notion doc "Portfolio" (under "Build") holds the decision history.

**Where things stand, 20 Jul.** `direction/b2` is pushed and in sync with `origin` at the commit
below; Vercel builds the preview from it, so the preview only moves when you push. Working tree
clean, `npm run build` passes, lint 0 errors (the 3 `no-img-element` warnings are deliberate).
`main` is untouched and gpcodes.com still serves the old site.

The five commits of 19 and 20 Jul, newest first:

- `d9119a7` STATE corrections: withheld entries, worktree cleanup
- `c729b41` menu ground settled; Okappy and FRANK-E withheld
- `e04977b` wordmark flash fixed; Tonic Lab added; PwC led with the composite
- `7d9c500` JS weight measured and closed as no cheap win
- `e5b28c9` Passionfruit screens sourced, `onboarding-goals` held back

**The two things waiting on Giacomo**, both detailed below: a corrected `onboarding-goals`
export, and whether Okappy and FRANK-E come back at all.

Next unblocked piece of work, if you want one: **where humour lives**, still the longest-standing
open question and the biggest gap between this site and the personality he wants.

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
  personality he wants. Candidates: microcopy, the empty state of ⌘K, 404.
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
