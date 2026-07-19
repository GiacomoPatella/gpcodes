# Brief: the architecture map

Build an interactive map of this site's own architecture, generated from the **real dependency
graph**, and ship it as the first real page under `/lab`.

Read `docs/BRIEF.md`, `docs/REVISION.md` and `docs/CONTENT.md` first; all constraints still apply.

---

## Why this exists

Giacomo wants "a complete understanding of the architecture and what's doing what, a visual
interactive map of how it is all put together", and said it could double as a side project.
It's also the justification for p5 being on the site at all.

The rule we agreed: **p5 earns its place only where it renders something true.** This map renders
the actual module graph of the site you are building it in. It is self-demonstrating: the page
explaining how the site is built is itself part of the site it describes.

If it degenerates into decorative particles, it has failed.

---

## 1. The graph generator

A build-time Node script (e.g. `scripts/graph.mjs`, wired into `npm run build` via a
`prebuild` script) that:

- Walks `src/**/*.{ts,tsx}` and `scripts/**`.
- Parses each file's **static imports**: relative imports resolved to real files, plus bare
  specifiers recorded as external packages (`react`, `next/font/google`, …).
- Emits `src/lib/graph.json` (committed, so the page has data without running the script) with
  a stable shape, roughly:

```json
{
  "generatedAt": "...",
  "nodes": [{ "id": "src/app/page.tsx", "label": "page.tsx", "kind": "route|component|lib|style|script|external", "loc": 812, "imports": 6, "importedBy": 0 }],
  "edges": [{ "from": "src/app/page.tsx", "to": "src/components/Dock.tsx" }],
  "stats": { "files": 0, "edges": 0, "loc": 0, "externals": 0 }
}
```

Requirements:
- **No new runtime dependencies.** Use Node's built-ins. A regex/lightweight parse over import
  statements is acceptable; this does not need to be a full TypeScript AST. Handle
  `import x from "y"`, `import { a } from "y"`, `import type`, side-effect imports and
  `next/dynamic`. Document what it does not handle.
- Deterministic output: stable ordering, so the committed JSON does not churn on every build.
- Do not emit absolute paths or anything machine-specific (no timestamps that change every run
  if that causes noise; prefer omitting `generatedAt` over a churning diff).

## 2. The `/lab/architecture` page

A real route rendering the graph interactively.

- **p5.js**, loaded **dynamically and only on this route** (`next/dynamic`, `ssr: false`), so
  it never enters the homepage bundle. This is the one place p5 is allowed.
- **Force-directed layout**: nodes repel, edges act as springs, gentle centring. Settle to a
  stable arrangement rather than jittering forever; stop or idle the simulation once it
  converges, and pause when the canvas is off-screen (`IntersectionObserver`) or the tab is
  hidden.
- **Interaction:** hover a node to highlight it and its direct edges, and show a readout:
  path, kind, lines of code, imports in/out. Click to pin. Nodes sized by lines of code, or by
  import count, whichever reads better; say which you chose and why.
- **Visual language must match the site:** cool neutrals, one accent (`--accent-ink`), hairlines,
  mono labels. Read the CSS custom properties from the DOM so the map follows the theme toggle
  and the accent picker. **No rainbow category colours**: differentiate kind by shape, weight or
  opacity, and use the accent for emphasis only.
- **`prefers-reduced-motion`: render the settled layout immediately with no animation**, still
  fully interactive. Not a blank canvas.
- **Accessibility:** a canvas is invisible to screen readers. Ship a real HTML table or list
  alongside (visually secondary, not `sr-only`-hidden if it can be useful to everyone) giving
  the same data: file, kind, LOC, imports, imported-by. The stats summary should be plain text.
- Static-export compatible. Deterministic first paint, no hydration mismatch.

## 3. `/lab` index

A simple index page listing lab pieces, with the architecture map as the first entry. Honest
about being new; do not pad it with invented experiments.

## 4. Wire up navigation

The `Dock` currently renders `/lab` as a disabled "coming soon" button. `/lab` now exists, so
it becomes a real `Link`. Leave `/work`, `/photography` and `/about` disabled as they are.

Add a ⌘K palette entry for the architecture map.

## 5. A note on honesty

The map will show a small graph: this site is a handful of files. **Do not inflate it.** A
small, precisely rendered, truthful graph is far better than a padded one. If the graph is
sparse, that is itself interesting: say so in the page copy, in first person.

---

## Deliverable

`npm run build` must pass, lint must have 0 errors. Commit to `direction/b2`.
Dev server on port **3004** (it may already be running, so reuse it).

Report: how the parser works and what it does not handle, the layout and sizing decisions,
how theme/accent following works, what the graph actually shows about this codebase, and
anything you think is weak.
