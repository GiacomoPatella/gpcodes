# Portfolio redesign — design direction brief

Giacomo Patella, Senior Product Designer, Florence. Personal site at **gpcodes.com**.

This brief is shared by three parallel design directions. Each direction builds the **same
homepage** from the same content and assets, differing only in aesthetic and interaction character.

---

## The thesis

Every reference site Giacomo chose is **light, typographic and restrained**. His most visually
striking work (hundo) is dark, Y2K, gradient-heavy and loud.

**The site must contrast with hundo, not echo it.** If the portfolio adopts a hundo-like
aesthetic it reads as hundo's brand rather than Giacomo's, and every other project gets
visually swamped.

The rule: **restraint everywhere, virtuosity in two or three places.** A quiet typographic base
with a small number of genuinely well-made interactive moments. That is what makes the
reference sites feel expensive. Decoration spread evenly across a page reads as noise.

---

## Reference sites

Fetch these and study the actual craft — do not work from these descriptions alone.

| Site | What Giacomo values |
|---|---|
| https://www.kyh.io/ | Aesthetics; the Claude/ChatGPT-ready prompts; the `.md` version of the site. *He notes it is "too minimal"* |
| https://www.carmen-elena.space/ | Music listening display, tools-used list, terminal-like callout box, stats |
| https://www.radbar.studio/ | Animated asset treatment (view-only — we have no such assets) |
| https://www.designjoy.co/ | Simplicity, typography, dynamism |
| https://emilkowal.ski/ | Simplicity and minimalism |
| https://www.userinterface.wiki/ | Section icons |
| https://valdelama.com/ | Simplicity; no links out to work |
| https://www.tommy-s.co.uk/ | Interactions, spacing, mascot, music player |
| https://www.lfs.gd/ | Lightness, hover transitions |

---

## Non-negotiables (all directions)

- **One type scale.** Pick it, define it in CSS custom properties, never deviate.
- **Motion budget.** CSS transitions/keyframes are the default. No animation library unless
  CSS genuinely cannot do it. No GSAP, no Motion, no parallax in this exploration.
- **`prefers-reduced-motion`** respected on every animated element.
- **Light-first**, with a real dark mode via `prefers-color-scheme` + a `data-theme` override.
- **No layout-shifting animation.** Animate `transform` and `opacity` only.
- **p5.js**, if used, is *fine generative marginalia* — hairline rules, plot marks, small
  data-driven ornament. Never a background spectacle. Lazy-loaded, paused when off-screen.
- **Accessible**: real focus states, semantic landmarks, alt text, ≥4.5:1 body contrast.
- Static export compatible — no server components doing runtime work, no API routes.

---

## Stack

Next 16 (App Router, `output: "export"`), React 19, TypeScript, Tailwind 4.
Already scaffolded. `npm run dev` works. Do not add dependencies without a clear reason;
if you do, justify it in your summary.

---

## Assets

In `public/work/<project>/`. Reference as `/work/hundo/desktop-1.jpg` etc.

| Project | Files |
|---|---|
| `hundo` | `desktop-1..3`, `mobile-1..2`, `trump-cards`, `employers`, `learn-tablet` |
| `octopus-powerloop` | `desktop`, `tablet`, `dashboard-cycles`, `dashboard-charge`, `history` |
| `redington-frank-e` | `dashboard`, `compliance`, `company-stats`, `governance`, `login` |
| `okappy` | `db-list`, `db-list-hover`, `db-list-click`, `db-concept-1..2`, `connections-notes`, `home` |
| `pwc-consulting-source` | `search-desktop`, `search-filters`, `search-mobile`, `methodology-light`, `overview` |
| `ipc-ecosystem` | `menu`, `licensing`, `modal`, `table` |

**Caveat:** the PwC screens contain Lorem ipsum placeholder copy. Crop tight on interaction
detail, or frame them explicitly as design-system artefacts. Do not show them full-bleed.

**Caveat:** the IPC screens are functional rather than beautiful. IPC is a *credential*, carried
by its outcome line, not a visual showpiece.

---

## Content

Full case study copy is in `docs/CONTENT.md`. Use the real copy — no Lorem ipsum anywhere.

Passionfruit is Giacomo's current work; **content is not yet available.** Leave a clearly
marked placeholder slot for it as the most recent project.

---

## Scope for this exploration

Build **the homepage only**, plus whatever shared primitives it needs (type scale, tokens,
layout, nav, footer). Not the case study pages, not `/lab`, not `/photography`.

The homepage must contain:

1. **Hero** — who he is, what he does, where. One signature moment lives here.
2. **Selected work** — hundo, PwC, Okappy, Octopus, Redington, IPC + the Passionfruit
   placeholder. This is the core of the page; give it the most thought.
3. **Testimonials** — six are available, and they are unusually strong. Do not bury them.
4. **Footer** — contact, `gp@gpcodes.com`.

Planned IA for context (not to be built now): `/`, `/work`, `/work/[slug]`, `/lab`,
`/photography`, `/about`.

---

## Deliverable

Working code in your worktree, on your branch. Then a summary containing:

1. The direction in **two sentences**.
2. Type scale, palette, spacing system — the actual values.
3. Where the two or three "virtuosity" moments are, and why those.
4. Anything you deliberately rejected.
5. Any dependency you added, and its justification.

`npm run build` must pass. Commit your work.
