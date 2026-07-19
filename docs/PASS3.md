# Pass 3: navigation, hero, and the two missing entries

Read `docs/BRIEF.md`, `docs/REVISION.md`, `docs/MAP.md` and `docs/CONTENT.md` first.
All prior constraints still apply. This file is the current task list.

Giacomo's words this round:

> "I want to update the hero table. That info doesn't need that much exposure and it repeats
> mostly of what the hero says. What about Passionfruit entry? What about my graphic design
> entries, some of my best work is there… Should that be a single graphic design entry with a
> gallery? Also lab is not on the top header and I wonder if we could turn the top header into a
> floating menu, removing it from the bottom and maybe adding my avatar there?"

---

## 1. Merge the two navigation systems into one floating menu

Currently there are two: a sticky top header (wordmark, section anchors, ⌘K, theme toggle) and a
bottom `Dock` (site IA). That's more chrome than the design wants, and on `/lab/architecture`
**the dock physically overlaps the canvas**.

Collapse them into **one floating menu**:

- Remove the bottom dock entirely. Delete `Dock.tsx` if nothing else uses it.
- The top header becomes the floating menu: floating, rounded, with the site's `--radius-lg`,
  a translucent/blurred ground so content passing under it reads as depth.
- It must contain: **the avatar** (`/avatar-96.jpg`, already in `public/`), the wordmark, the
  site IA including **`/lab`, which is live and currently missing from the header**, the ⌘K
  affordance and the theme toggle.
- `/work`, `/photography`, `/about` do not exist yet; keep them visible but clearly disabled,
  as the dock did (`aria-disabled` + a "coming soon" tooltip). No broken links.
- It must not overlap page content, particularly the architecture canvas. Check that page.
- Narrow viewports: it must degrade gracefully, not clip. The ⌘K palette is the escape hatch for
  anything that has to drop out.

Reference: Giacomo cites kyh.io's floating menu as the thing he likes.

## 2. Rework the hero table

The six-cell field table (ROLE / LOCATION / PRACTICE / FOCUS / CURRENT / CONTACT) mostly repeats
the hero paragraph: role, location, "over a decade" and Passionfruit are all said twice.

Cut the duplication. Keep only what the prose does *not* already say, and give it far less
visual weight: a quiet metadata line rather than a bordered six-cell grid. The copy-as-prompt
row currently hangs off the bottom of the table; keep it, and make sure it still reads as
deliberate once the table shrinks.

This also frees the hero's empty right side. You may leave it as breathing room, but do **not**
fill it with decoration for its own sake.

## 3. Build the Passionfruit entry properly

It is currently a placeholder slot. Real copy now exists in `docs/CONTENT.md` and three
screenshots are in `public/work/passionfruit/`: `pip-welcome`, `agents-leads`, `onboarding-goals`.

Render it like the other entries (featured image plus thumbnails) as the most recent work,
2026, current role. The copy is long; edit it down for the homepage to match the length of the
other entries. The full version belongs on the future case study page.

"Quotient" visible in the screenshots is a **placeholder customer name inside the product**: a
demo tenant. Not a client, not a rebrand. No caveat or caption is needed about it.

## 4. Add a consolidated Graphic design & branding entry, with a gallery

Giacomo: *"some of my best work is there."* Copy is in `docs/CONTENT.md`; 14 images are in
`public/work/graphic-design/`.

Make it **one entry with a gallery**, not six entries. Collectively it reads as range, whereas
six separate entries would dilute the product work that carries the page. Place it after the
product work.

The gallery is the first real multi-image surface on the site, so it sets the pattern for the
future `/work` gallery. Keep it restrained and make it work without JavaScript where possible.
Reference: Giacomo cites vladsavruk.com for gallery display. No lightbox library.

## 5. Drop p5 from the architecture map

The map stays exactly as it is visually. Replace p5 with the raw Canvas 2D API.

Rationale, from the agent that built it: p5 2.3's pointer events never fired, so pointer
handling is already owned by DOM listeners; p5 is doing only rendering and the render loop, for
a **1.3 MB route chunk**. Raw canvas does the same job at zero cost.

Requirements: no visual change, same determinism (hash-seeded positions, settles and stops),
same theme/accent following, same reduced-motion behaviour, same accessible table. Remove the
`p5` and `@types/p5` dependencies. Regenerate `graph.json`; it will change, since p5 is no
longer an import, and the map is honest about depicting itself.

## 6. Homepage weight

The homepage references ~736 KB of uncompressed JS. Report the actual figure before and after
your changes. If removing the dock and shrinking the table moves it, say so. Do not add
dependencies.

---

## Deliverable

`npm run build` passes, lint 0 errors (the `no-img-element` warnings are deliberate).
Verify in a real browser on port 3004: the floating menu on the homepage AND on
`/lab/architecture` (the overlap case), light and dark, and a narrow viewport.
Commit to `direction/b2`.

Report: what the floating menu contains and how it degrades, what you cut from the hero table
and why, how the gallery works, the before/after homepage JS figure, and anything you think is
weak.
