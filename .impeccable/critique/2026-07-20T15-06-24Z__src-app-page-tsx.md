---
target: the portfolio homepage
total_score: 29
p0_count: 2
p1_count: 3
timestamp: 2026-07-20T15-06-24Z
slug: src-app-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | /photography and /about greyed at opacity .5; "soon" only via hover tooltip |
| 2 | Match System / Real World | 2 | File-path captions, footer column headed MACHINE, "markdown twin" |
| 3 | User Control and Freedom | 3 | Skip link, ⌘K, ESC lightbox, theme persists |
| 4 | Consistency and Standards | 3 | .sec-meta duplicates .mono-label; .outcome 2px border breaks hairline rule |
| 5 | Error Prevention | 3 | 404 exists and routes onward; nav degrades deliberately |
| 6 | Recognition Rather Than Recall | 3 | ⌘K visible; undercut by file-path captions |
| 7 | Flexibility and Efficiency | 4 | ⌘K, /index.md, /llms.txt, /palette, copy-as-prompt |
| 8 | Aesthetic and Minimalist Design | 2 | Accent on 10 of ~1600 colour slots; minimal but no voice |
| 9 | Error Recovery | 3 | Only surface is the 404, well written |
| 10 | Help and Documentation | 3 | /palette documents accent; alt text exemplary |
| **Total** | | **29/40** | **Good** |

## Anti-Patterns Verdict

LLM assessment: passes the first-order reflex check (not white/cream/serif/cards). Fails the
second-order check: category plus anti-references predicts cool grey + mono metadata + hairlines
+ ⌘K + /lab + llms.txt exactly. Terminal-native / instrument-utility lane, adjacent to the
editorial-typographic lane brand.md already flags.

.mono-label ruling: not a deliberate named brand system. 12 instances doing 5 unrelated jobs
(identity eyebrow, section counter, stat labels, callout label, footer column heads). No rule
means "scaffolding", not voice. Mono is ~25% of homepage characters.

Deterministic scan: 1 finding, exit 2. globals.css:822 `.outcome` side-tab accent border
(border-left: 2px solid var(--accent-ink)), an absolute-ban match. 1 rendered instance.

Visual overlays: not available. The live-server + detect.js injection step was not performed,
so there is no user-visible overlay. CLI scan and browser measurement are the fallback signal.

## Priority Issues

P0 .outcome uses a banned side-stripe, and it is the accent's loudest appearance.
P0 The accent effectively does not exist (10 of ~1600 slots); Restrained is the wrong strategy
   for the brand register, which permits Committed/Drenched.
P1 --muted dips to 4.45:1 against --bg-far. background-attachment: fixed makes the gradient
   viewport-relative, so muted text in the bottom ~10% of the screen fails AA at any scroll.
P1 Sticky menu pill is transparent to body text; the code comment claims otherwise.
P1 The stats block is the hero-metric template (banned): big number, small label, supporting stats.
P2 No call to action anywhere; email is styled identically to the latitude beside it.
P2 16 touch targets under 44px at 360px; effective hit heights 37/37/41 after pseudo-element
   expansion, so the earlier "40px floor" claim was not met.
P3 Type scale: 4 of 7 steps under the 1.25 ratio, carrying 166 of ~197 text elements.

## Persona Red Flags

Jordan (hiring lead, 90s): six entries in one template, no summary line, only 1 of 6 has an
outcome callout, no CTA, current role visually identical to 2015 contact sheet.
Riley (recruiter/founder): MACHINE column, /llms.txt, file-path captions, two greyed nav items
read as broken, 25% mono reads as a developer's site.
Casey (designer peer): places the lane in seconds, spots the side-stripe as the one non-hairline
edge, notes the accent is absent on a site shipping a /palette route, notes client work is more
colourful than the portfolio.

## Minor Observations

- .sec-meta duplicates .mono-label byte-for-byte apart from alignment.
- .fmenu comment claims sticky "cannot overlap content"; it is top:0 over a scrolling document.
- .fmenu-soon is a button with cursor:default and no disabled/aria-disabled.
- Hero right half empty at >=1024px, ~45% of first screen.
- --bg-far chroma ~.005 buys nothing and pushes --muted under AA.
- Avatar is grayscale(1): the register enforcing itself against its own content.
- .stats-ruler hatched gradient is the best decorative element and appears once.
- stats-caption runs 90ch desktop / 106ch at 768px, the longest measure at the smallest size.

## Questions to Consider

1. The hero says "working out whether I can become" a design engineer; the typography already
   claims it. Which is telling the truth?
2. /palette exists to make the accent one line to change. When was it last changed?
3. The client work is more colourful than the portfolio. What does a visitor conclude?
4. If every uppercase mono label were deleted, what information is actually lost?
5. Six entries, one template. Which deserves to break it?
6. Is the machine-readable layer a genuine second reader, or the part of the brief that let the
   human hero go undecided?
