# Current state and outstanding work

Written 19 Jul 2026, as a handoff so no context is lost on a session clear.
Branch `direction/b2`. Read alongside `BRIEF.md`, `REVISION.md`, `CONTENT.md`, `MAP.md`, `PASS3.md`.
The Notion doc "Portfolio" (under "Build") holds the decision history.

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

---

## Sequenced plan (Giacomo confirmed: do it in sequences)

### Group 1: corrections

- **Fix the asset pipeline.** `sips -Z` resamples in both directions, so it upscaled anything
  smaller than the target. Eight of fourteen graphic design assets were blown up past their
  real resolution. Worst: the Compliance3 business card, source **238x156**, shipped at 2000px.
  Re-export only downscaling, and re-check the 34 product screenshots in `public/work/` for the
  same fault.
- **Re-render Compliance3 from vector.** The archive has
  `Desktop PDFs/Assets/Old/C3_bizcard_front_NO_BLEED.eps` and `C3.pdf`. Rendering those gives a
  crisp card at any size. Archive: `~/Downloads/Portfolio.zip`.
- **Remove from the graphic design sheet:** Custodia (both, cover alignment) and the Sensée
  infographic (unshowable at row height). `CUSTODIA_brochure.pdf` exists if ever wanted properly.
- **Rewrite the hero copy.** Friendlier and human, not a tech pitch. Two corrections of fact:
  he does **not** build front-end any more, that was years ago on static sites, so
  "I build the front-end when it counts" must go. He is experimenting with AI and working
  toward becoming a design engineer. Draft he reacted to, refine rather than adopt verbatim:
  > I'm Giacomo, a product designer in Florence. For over a decade I've been making complicated
  > products easier to live with, most recently the AI workspace at Passionfruit. Lately I'm deep
  > in AI tooling, working out what a design engineer actually is and whether I can become one.
- **Sweep em-dashes** from all copy and docs.
- **Apply the widow rule.**
- **Fix `/work`.** It is marked "coming soon" in the menu because an earlier brief of mine
  treated it as a future route. A `#work` section exists on the homepage, so it should link to
  `/#work` now, and become a real gallery page later. This was my briefing error.

### Group 2: image zoom, default everywhere

Every image on the site should be zoomable so viewers can inspect UI detail.

- Native `<dialog>` plus CSS. No library.
- Needs a **two-variant asset pipeline**: a display image (page weight) and a full resolution
  zoom image loaded only on open.
- Zoom must not exceed the source resolution. Several sources are genuinely low-res, so cap
  honestly rather than scaling into mush.
- Giacomo also wants to change how featured images are presented generally. Zoom should be
  built so it survives that change.

### Group 3: the two effects, own pass, iterate by eye

- **End-of-page reveal** (vladsavruk.com): page scales in near the end of the scroll, revealing
  a background where the footer sits.
  - **Giacomo's call: not essential. If it carries performance or rendering risk, drop it.**
  - Critical trap: a CSS transform on an ancestor creates a containing block and **breaks
    `position: sticky` and `fixed` for descendants**. The floating menu is sticky, so it must
    live outside the scaled wrapper.
  - Needs `animation-timeline: view()` progressive enhancement plus a reduced-motion path.
- **Particle formation effect** (rows.gg logo): particles converge to form a shape.
  - Raw Canvas 2D, roughly 5KB. Do not reintroduce p5.
  - There is no logo, only the `gpcodes.com` wordmark, so that is the honest target.
  - **Open: hero or footer?** My recommendation is the footer, combined with the end-of-page
    reveal as one signature moment. A particle effect above copy meant to read as warm and
    human works against the copy. Giacomo has not decided.
  - Reduced motion renders the settled state immediately.

### Group 4: possible `/lab` interaction study

A small to-do app, framed as an **interaction study** rather than a to-do app. The craft is the
subject: what happens when a row is added, completed, reordered, killed. Reference rows.gg
("kill row, add new row"). Use the `emil-design-eng`, `make-interfaces-feel-better` and
`transitions-dev` skills. Static export, no dependencies, localStorage persistence.

Risk to manage: a to-do app is the most clichéd demo there is. It only earns a place on a senior
designer's portfolio if the interaction craft is explicitly the point.

---

## References to fetch (agents should read the real sites, not summaries)

New this round, not yet in earlier briefs:
- https://rows.gg/ — interactions, kill row / add new row, particle logo formation
- https://zeviarnovitz.com/ — interactions, transitions, hover effects
- https://amicro.vercel.app/ — interactions, transitions, hover effects

Full reference list with Giacomo's own notes is in `BRIEF.md` and the Notion doc.

---

## Open questions

- Particle effect: hero or footer?
- Music player content source. Copyright makes hosting other artists' tracks a problem. Cleanest
  route is his own labels, Never Ready and Five Fold. Also, rotating a fixed set is not really
  "new tunes every day".
- Where humour lives. Still unsolved and still the biggest gap between this site and the
  personality he wants. Candidates: microcopy, the empty state of ⌘K, 404.
- Tonic-lab: to be featured as a working link, the only live product on the site. Needs
  description, role, URL.
- Copy still to write: Octopus Powerloop, Redington FRANK-E.
- Photography: coming, slow. Route stays signposted and empty.
- Asset rework: Giacomo is redesigning some older assets, FRANK-E named. Open question whether
  reworked screens are shown as today's design or as then/now pairs.

---

## Technical debt

- Homepage references ~640KB uncompressed JS. Not urgent, but "not laggy" was an explicit
  requirement, so it wants a look before launch.
- Below 44rem the menu drops the planned-route signposts entirely, so mobile users get no IA
  hint. ⌘K is the only escape hatch.
- "Coming soon" tooltips are hover/focus only, invisible on touch.
- The architecture map is pointer-only. The data table is the accessible equivalent.
- Map layout is deterministic per viewport size but not across sizes.

---

## Repo

- `main` — old site, still live on gpcodes.com, untouched
- `redesign` — Next scaffold baseline, old site in `legacy/`, CNAME in `public/`
- `direction/a-editorial`, `direction/b-instrument`, `direction/c-tactile` — the explorations
- `direction/b2` — **the working branch**
- Worktrees at `~/code/gpcodes-{a-editorial,b-instrument,c-tactile,b2}`
- Dev server: `cd ~/code/gpcodes-b2 && npm run dev -- -p 3004`
- Source archive: `~/Downloads/Portfolio.zip` (950MB, extracted subset in the session scratchpad
  which will not survive a clear, re-extract as needed)
