# B2 — revision brief

This branch revises Direction B after Giacomo reviewed all three directions live.
Read `docs/BRIEF.md` and `docs/CONTENT.md` first — they still apply. This file overrides them
where they conflict.

**B was chosen as the base.** A (editorial) was rejected. C (tactile) contributes its typeface.

---

## What Giacomo said

On B: *"I love the cmd+K search popup. The machine readable block is cool but I want the Claude
and ChatGPT ready prompts in button/icon format and the section doesn't need to be that present.
The brand I would change, typical AI, warm beige and orange accent, numbered list not needed.
The work is shown well, clean with a featured image and a couple of extra thumbnails."*

On A: *"I don't like much of it, it screams AI-built. I want to see one beautiful featured image,
not make them appear on hover. Too editorial."*

On C: *"I like Figtree."*

---

## Required changes

### 1. Palette — this is the most important change

Three independent agents produced near-identical palettes: warm off-white grounds
(`#f7f5f0` / `#fafaf7` / `#faf6f0`) with burnt-orange accents (`#9c4227` / `#bf400b` / `#d9552b`).
Giacomo correctly identified this as a generic AI-default look. **Do not use warm beige. Do not
use orange.**

Replace with a **cool neutral ground and one sharp accent**:

```
bg     #fbfbfc
ink    #0e0f11
muted  #6b6f76
line   #e3e5e8
```

Define the accent as a **single CSS custom property** so it can be swapped in one line, and
provide all three candidates as commented alternates:

```
--accent: #2b4cff;   /* electric blue */
/* --accent: #00c07f;   acid green */
/* --accent: #6b2bff;   deep violet */
```

Ship with electric blue active. Verify all three meet ≥4.5:1 contrast where used for text, and
derive a dark-mode variant of each. Build a small `/palette` route (dev aid, fine to keep in the
export) that renders the page's key components under each accent so Giacomo can compare by eye.

Also purge the other AI-default tells: no drop caps, no asterism dividers, no `№` folios, no
Roman numerals, no numbered list in the work section.

### 2. Voice — first person

Rewrite ALL copy in first person. "I designed…", "I led…", "I'm currently at Passionfruit."
No third-person self-reference anywhere, including meta description, `llms.txt` and `index.md`.
Keep testimonials in their original third person — they're quotes from other people.

### 3. Machine-readable block — demote to icon buttons

The concept stays, the panel goes. Replace the full-width MACHINE-READABLE console with a
compact control: **a "Copy for Claude" and a "Copy for ChatGPT" button**, icon-led, sitting
unobtrusively (near the hero contact line or in the footer — your judgement, but it must not
dominate). Keep `/llms.txt`, `/index.md`, the `alternates` metadata, and the guarantee that the
copied prompt is derived from the published markdown twin so they cannot drift.

### 4. Work presentation

Per Giacomo: **one beautiful featured image per project, plus a couple of smaller thumbnails.**
Nothing hover-to-reveal — imagery is visible at rest. Clean, generous, not a card grid.

Keep the strong data treatment: PwC's tabular stats, IPC's six-figure outcome callout.
Keep the PwC Lorem-ipsum handling (tight crops, honest caption).

### 5. Typeface

**Figtree** for reading copy and display (Giacomo liked it in C). Keep a mono for labels,
metadata and tabular figures. Both self-hosted via `next/font` — no runtime CDN calls.

### 6. Floating menu + IA signposting

Add a **floating menu** (persistent, unobtrusive). It must signpost the planned IA even where
pages don't exist yet: `/work`, `/lab`, `/photography`, `/about`. Non-existent routes should be
clearly marked as coming rather than 404ing — a disabled state with a tooltip, or stub pages
with a short honest placeholder. Your call, but no broken links.

### 7. Keep

⌘K command palette exactly as it is — Giacomo called it out as the thing he loves.
The structured field table in the hero.
Light-first with real dark mode, `prefers-reduced-motion`, transform/opacity-only motion,
static export, zero new dependencies unless justified.

---

## Explicitly NOT in this pass

Do not build these — they need decisions Giacomo hasn't made yet:

- **Web Audio interaction sounds** (agreed in principle: synthesized, off by default, visible
  toggle, initialised on first user gesture — but not this pass)
- **The music player** (content source unresolved; copyright constraints under discussion)
- **The `/work` gallery** (planned, after the homepage settles)
- Case study pages, `/lab` and `/photography` content

Leave clean seams where these will go. Do not stub them with fake content.

---

## Deliverable

`npm run build` must pass. Commit to `direction/b2`. Dev server on port **3004**.

Report: what changed, the final palette values, how the accent swap works, where the
Claude/ChatGPT buttons ended up and why, and anything you think is now weaker than in B.
Be honest about weaknesses — Giacomo reviews this live and has a sharp eye for generic output.
