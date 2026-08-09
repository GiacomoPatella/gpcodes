"use client";

import { useEffect, useRef, useState } from "react";
import CopyPrompt from "@/components/CopyPrompt";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * HERO PROTOTYPE, VERSION 1. Dev aid, noindex, live site untouched.
 *
 * The idea (Giacomo, 21 Jul): the hero is left-aligned but the floating menu is
 * centred, so the two never quite reconcile. This replaces the floating island
 * with a full-width STATIC bar at rest, whose content aligns to the hero's left
 * edge; on the first scroll it detaches and morphs into the centred pill the
 * live site already uses. The morph is the point, so it is dialled up: a
 * squash-and-stretch rubber-band as the bar pulls off the top edge (tier 2 of
 * the three tiers in STATE.md; tier 3, true SVG goo, fights the backdrop-blur
 * material and was deliberately not built first).
 *
 * Two fixes carried in from the drench stand-in, both noted in STATE.md:
 *   1. The pill width is MEASURED from a hidden ghost of the condensed content,
 *      not the hardcoded `min(48rem, ...)` the drench prototype used.
 *   2. Scroll-up jitter is gone: the overshoot easing lives only on the DETACH
 *      direction. Re-attaching to the top uses a plain ease-out, so scrolling
 *      back up does not fight its own overshoot.
 *
 * The nav is a faithful visual stand-in for <Menu>, kept local so the shared
 * server component does not have to become a client component just to try this.
 * Only the theme toggle is wired for real, so light/dark can be reviewed.
 */

function NavInner({ ghost }: { ghost?: boolean }) {
  return (
    <div className="mnav-inner">
      <a className="mnav-home" href="#top" tabIndex={ghost ? -1 : undefined}>
        {/* Plain img mirrors the real Menu (static export, unoptimized). */}
        <img
          className="mnav-avatar"
          src="/avatar-96.jpg"
          srcSet="/avatar-96.jpg 1x, /avatar-192.jpg 2x"
          width={96}
          height={96}
          alt=""
          decoding="async"
        />
        <span className="wordmark">
          gp<span className="tld">codes.com</span>
        </span>
      </a>
      <div className="mnav-links">
        <a className="mnav-link" href="#work">/work</a>
        <a className="mnav-link" href="#work">/lab</a>
        <span className="mnav-link is-soon">/photography</span>
        <span className="mnav-link is-soon">/about</span>
      </div>
      <span className="mnav-rule" aria-hidden="true" />
      <span className="mnav-kbd">
        <kbd>⌘</kbd>
        <kbd>K</kbd>
        <span className="mnav-kbd-label">index</span>
      </span>
      {ghost ? (
        <span className="icon-btn" aria-hidden="true">
          ◐
        </span>
      ) : (
        <ThemeToggle />
      )}
    </div>
  );
}

function MorphNav({ condensed }: { condensed: boolean }) {
  return (
    <div className="mnav" data-condensed={condensed ? "" : undefined}>
      <div className="mnav-box">
        <NavInner />
      </div>
    </div>
  );
}

export default function MorphLab() {
  const [condensed, setCondensed] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  /* Detach the instant the page leaves the very top, and stay detached for as
     long as the user keeps scrolling further down, however slowly. Re-attach
     fires well before scroll actually gets back to the top (REATTACH_PX), so
     the return transition has time to finish before the gesture itself ends,
     rather than visibly still catching up after it does.

     Direction, comparing y against the PREVIOUS sample, decides which rule
     applies, not just position against a fixed pair of thresholds. Position
     alone is unstable here: for any y strictly between 0 and REATTACH_PX,
     "detach at y > 0" and "re-attach at y <= REATTACH_PX" both match at once,
     so which one wins depends only on which was evaluated last, and toggles
     on every single sample while y sits in that band. A fast, decisive
     scroll jumps clean over the band in one or two samples and never shows
     it; a slow one dwells there for many samples and visibly shakes, stretch
     and squash firing over and over, which is exactly what a slow downward
     scroll surfaced. Checking whether y grew or shrank since the last sample
     resolves the ambiguity correctly: moving down through the band condenses
     and stays condensed regardless of how slowly; only moving up through it
     can re-attach early. */
  useEffect(() => {
    const REATTACH_PX = 160;
    let ticking = false;
    const check = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      lastY.current = y;
      setCondensed((prev) => {
        if (y <= 0) return false;
        if (dy > 0) return true;
        if (dy < 0) return prev && y > REATTACH_PX;
        return prev;
      });
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Measure the condensed pill width from a hidden ghost rendered at the compact
     layout, instead of hardcoding it. The ghost is `width: max-content`, so its
     box is exactly the pill's natural width; a ResizeObserver keeps `--pill-w`
     correct across font load, viewport resize and label changes. */
  useEffect(() => {
    const wrap = wrapRef.current;
    const ghost = ghostRef.current;
    if (!wrap || !ghost) return;
    const measure = () => {
      const w = ghost.offsetWidth;
      if (w) wrap.style.setProperty("--pill-w", `${w}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ghost);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  return (
    <div id="top" className="mlab" ref={wrapRef}>
      <style>{CSS}</style>

      <MorphNav condensed={condensed} />

      {/* hidden measuring copy: compact layout, never shown, never focusable */}
      <div className="mnav-ghost" aria-hidden="true" ref={ghostRef}>
        <div className="mnav-box">
          <NavInner ghost />
        </div>
      </div>

      <main className="mlab-main">
        {/* ============ HERO (verbatim from the live homepage) ============ */}
        <section className="hero" aria-labelledby="m-hero-title">
          <div className="container">
            <p className="mono-label">
              Giacomo Patella · senior product designer
            </p>
            <h1 id="m-hero-title" style={{ marginTop: "var(--sp-4)" }}>
              I make complicated products easier to live&nbsp;with.
            </h1>
            <p className="dek">
              Over a decade of that now, most recently the AI workspace at{" "}
              <strong>Passionfruit</strong>. Lately I&rsquo;m deep in AI tooling,
              working out what a design engineer actually is and whether I can
              become&nbsp;one.
            </p>
            <div className="hero-meta">
              <p className="hero-meta-line">
                <a href="mailto:gp@gpcodes.com">gp@gpcodes.com</a>
              </p>
              <CopyPrompt />
            </div>
          </div>
        </section>

        {/* enough body to scroll the morph both ways */}
        <section className="section" id="work" aria-labelledby="m-work-title">
          <div className="container">
            <div className="sec-head">
              <h2 id="m-work-title">Selected work</h2>
              <span className="sec-meta">the light body resumes here</span>
            </div>
            <p style={{ color: "var(--muted)", maxWidth: "38rem" }}>
              Scroll up and down across the top edge. The full-width bar should
              detach on the first scroll, squash as it pulls off, and settle into
              the centred pill; returning to the top expands it back with no
              overshoot, so the reverse never jitters.
            </p>
            <div style={{ height: "120vh" }} />
          </div>
        </section>
      </main>

      <p className="mlab-tag" aria-hidden="true">
        prototype v1 · morphing nav · tier 2 rubber-band
      </p>
    </div>
  );
}

const CSS = `
.mlab { min-height: 220vh; }
/* fixed bar overlays the top, so the content starts below one bar height */
.mlab-main { padding-top: var(--header-h); }

/* ============================================================
   the morphing nav
   ============================================================ */
.mnav {
  --dur-morph: 460ms;
  /* RE-ATTACH is deliberately quicker than DETACH: it now triggers a little
     before scroll actually reaches the top (see the scroll effect in
     MorphLab), so a shorter duration is what makes it land at, rather than
     noticeably after, the moment the gesture itself ends. Detach keeps the
     slower --dur-morph, since it triggers instantly and can afford to take
     its time. */
  --dur-return: 320ms;
  /* DETACH: a soft decelerate, no overshoot past the pill shape (paired with
     a gentle single-squash keyframe below for the gooey feel, not a bounce).
     RE-ATTACH (the base rule) is the same calm ease-out with no keyframe. */
  --ease-detach: cubic-bezier(0.32, 0.9, 0.34, 1);
  --ease-return: cubic-bezier(0.2, 0, 0.2, 1);
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  display: flex; justify-content: center;
  pointer-events: none;
  /* the wrapper carries the float gap; the box carries the shape */
  transform: translateY(0);
  transition: transform var(--dur-return) var(--ease-return);
}
.mnav[data-condensed] {
  transform: translateY(var(--sp-3));
  transition: transform var(--dur-morph) var(--ease-detach);
}

.mnav-box {
  pointer-events: auto;
  box-sizing: border-box;
  width: 100%;
  /* Centres .mnav-inner inside the box at all times, so centring is never the
     job of the inner's own margin. Belt-and-braces with the inner's
     transitioned, always-100%-of-box sizing below: between the two, nothing
     about the inner's position or size is ever a single instantaneous jump. */
  display: flex;
  justify-content: center;
  color: var(--ink);
  /* one constant frosted surface, so hero content passes UNDER the bar and
     never through it; only the shape changes on scroll. */
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid transparent;
  border-bottom-color: var(--line);
  border-radius: 0;
  box-shadow: none;
  transform-origin: top center;
  transition:
    width var(--dur-return) var(--ease-return),
    border-color var(--dur-return) var(--ease-return),
    border-radius var(--dur-return) var(--ease-return),
    box-shadow var(--dur-return) var(--ease-return);
}
.mnav[data-condensed] .mnav-box {
  width: var(--pill-w, min(46rem, calc(100vw - var(--sp-4))));
  border-color: var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  transition:
    width var(--dur-morph) var(--ease-detach),
    border-color var(--dur-morph) var(--ease-detach),
    border-radius var(--dur-morph) var(--ease-detach),
    box-shadow var(--dur-morph) var(--ease-detach);
  /* the gloop: one gentle squash, no jiggle back past 1. Bound to the
     condensed state, so it plays once when the bar detaches and is simply
     absent on re-attach (the rule no longer matches), which is why scrolling
     back up never bounces. transform is free on the box (translateY lives on
     the wrapper). */
  animation: mnav-squash var(--dur-morph) both;
}
@keyframes mnav-squash {
  0%   { transform: scaleY(1) scaleX(1); }
  45%  { transform: scaleY(0.95) scaleX(1.012); }
  100% { transform: scaleY(1) scaleX(1); }
}

/* EXPANDED inner: container-aligned, so the wordmark sits on the hero's left
   edge. Controls are pushed right by the rule's auto margin.
   width used to be 100% of the box, deriving its size live from whatever the
   box's own width transition currently was. That kept them visually in sync
   at rest, but broke arrival timing: the box's rest width is the full
   viewport (edge-to-edge bar) while the inner's is capped to --container, a
   SMALLER number, so "inner = 100% of box, clamped" hit its cap and froze
   partway through the box's journey, well before the box's own ease-out
   reached its slower, longer tail. That is the "content springs into place,
   then the edges take forever to catch up" lag. Fix: give the inner its OWN
   width transition, targeting min(--container, 100vw) directly rather than
   deriving from the box. Same duration and easing as the box's width
   transition below (--dur-return here, --dur-morph on the condensed side),
   just a different endpoint, so both are just two ordinary length-to-length
   tweens sharing one clock: whatever their distances, they both finish at
   the same instant. (Two curves that share a start value, the same easing
   and duration, and end at B <= A are provably never inverted in between:
   the narrower one, this inner, can never outrun the box that contains it.)
   Same idea for .mnav-rule's auto margin below: left as "auto 0" in both
   states, so the pushed gap it creates shrinks continuously to zero as inner
   narrows, instead of being force-zeroed the instant detach starts.
   Padding-inline is the one deliberately different, packed-when-condensed
   value, and gets the same treatment: its own transition, same clock. */
.mnav-inner {
  box-sizing: border-box;
  width: min(var(--container), 100vw);
  height: var(--header-h);
  padding-inline: var(--sp-5);
  display: flex; align-items: center; gap: var(--sp-4);
  transition:
    width var(--dur-return) var(--ease-return),
    padding-inline var(--dur-return) var(--ease-return);
}
@media (min-width: 768px) { .mnav-inner { padding-inline: var(--sp-6); } }

.mnav[data-condensed] .mnav-inner {
  /* Same target as .mnav-box's condensed width below: at rest, condensed,
     the inner exactly fills the box, no separate chrome around it. */
  width: var(--pill-w, min(46rem, calc(100vw - var(--sp-4))));
  padding-inline: var(--sp-4) var(--sp-3);
  transition:
    width var(--dur-morph) var(--ease-detach),
    padding-inline var(--dur-morph) var(--ease-detach);
}

/* The measuring ghost is the one place that still wants a hard, untransitioned
   condensed layout: it exists only to report the pill's natural width, and
   width: auto (rather than a fixed target meant for the real, animated nav)
   is what makes that measurement well-defined. Its rule margin is pinned to
   0 for the same reason: an accurate "tightest possible" width. */
.mnav-ghost .mnav-inner {
  width: auto;
  padding-inline: var(--sp-4) var(--sp-3);
}
.mnav-ghost .mnav-rule { margin-inline: 0; }

.mnav-home { display: inline-flex; align-items: center; gap: var(--sp-3); text-decoration: none; min-width: 0; color: inherit; }
.mnav-avatar {
  flex-shrink: 0; width: 1.75rem; height: 1.75rem; border-radius: 999px;
  object-fit: cover; border: 1px solid var(--line-strong); filter: grayscale(1) contrast(1.02);
}
.mnav .wordmark { color: inherit; }
.mnav .wordmark .tld { color: var(--muted); }
.mnav-links { display: flex; align-items: center; gap: var(--sp-1); font-family: var(--font-mono); font-size: var(--text-sm); white-space: nowrap; }
.mnav-link { padding: var(--sp-1) var(--sp-2); border-radius: var(--radius); color: var(--muted); text-decoration: none; }
.mnav-link:not(.is-soon):hover { color: var(--ink); }
.mnav-link.is-soon { color: color-mix(in srgb, var(--muted) 55%, transparent); }
.mnav-rule { width: 1px; height: 1.25rem; background: var(--line-strong); margin-inline: auto 0; flex-shrink: 0; }
.mnav-kbd { display: inline-flex; align-items: center; gap: 0.25rem; font-family: var(--font-mono); font-size: var(--text-xs); color: var(--muted); white-space: nowrap; }
.mnav-kbd kbd { border: 1px solid var(--line-strong); border-radius: var(--radius-sm); padding: 0 0.3rem; font-family: inherit; }
.mnav-kbd-label { margin-left: 0.15rem; }

/* the measuring ghost: laid out, sized to content, but never seen or hit */
.mnav-ghost {
  position: fixed; top: 0; left: 0; z-index: -1;
  width: max-content; visibility: hidden; pointer-events: none;
}
.mnav-ghost .mnav-box { width: max-content; }

@media (prefers-reduced-motion: reduce) {
  .mnav, .mnav .mnav-box { transition: none; }
  .mnav[data-condensed] .mnav-box { animation: none; }
}

.mlab-tag {
  position: fixed; left: 50%; bottom: var(--sp-4); transform: translateX(-50%);
  z-index: 80; margin: 0;
  background: var(--surface); border: 1px solid var(--line-strong);
  border-radius: var(--radius); box-shadow: var(--shadow);
  padding: var(--sp-2) var(--sp-3);
  font-family: var(--font-mono); font-size: var(--text-xs); color: var(--muted);
  white-space: nowrap;
}
`;
