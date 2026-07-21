"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import CopyPrompt from "@/components/CopyPrompt";

/**
 * Dev aid, noindex. Prototype for two linked ideas off the impeccable critique:
 *
 * 1. The drenched hero (critique's second P0: the accent effectively does not
 *    exist). One saturated ground on the first screen, dropping into the light
 *    body at "Selected work".
 * 2. The morphing nav (Giacomo, 20 Jul). At rest the nav is a full-width bar
 *    sitting transparent ON the petrol, so there is no light seam above the
 *    hero. On scroll past the hero it condenses into the floating island the
 *    live site already uses, now over the light body. The morph is tied to the
 *    hero->body boundary so the expanded bar owns the whole first screen, and
 *    condenses at exactly the moment the ground turns light.
 *
 * Everything is scoped under `.drench-lab`; the live hero and the shared Menu
 * are untouched. The nav here is a faithful visual stand-in for <Menu>, not the
 * real component: keeping it local avoids making the shared server component a
 * client component just to try this.
 */
const GROUNDS = [
  {
    key: "petrol",
    name: "committed petrol",
    ground: "oklch(0.31 0.086 216)",
    note: "The hue the site already gestures at, actually saturated. The honest evolution: we stop being timid about the colour we already chose.",
    lead: true,
  },
  {
    key: "petrol-deep",
    name: "petrol, deeper",
    ground: "oklch(0.26 0.078 220)",
    note: "Same hue, closer to ink. Quieter, more instrument-register, less of a statement.",
    lead: false,
  },
  {
    key: "indigo",
    name: "ink indigo",
    ground: "oklch(0.28 0.10 268)",
    note: "A swerve off petrol toward blue-violet. Cooler, reads more 'product'. A real direction change, not a commitment to the existing one.",
    lead: false,
  },
  {
    key: "slate",
    name: "current accent (reference)",
    ground: "#2c4a56",
    note: "The accent as it ships today, drenched. The critique's point made visible: at surface scale it is a grey block, not a colour.",
    lead: false,
  },
] as const;

function DrenchNav({ condensed }: { condensed: boolean }) {
  return (
    <div className="dl-nav" data-condensed={condensed ? "" : undefined}>
      <div className="dl-nav-inner">
        <a className="dl-nav-home" href="#top">
          {/* Plain img mirrors the real Menu (static export, unoptimized). */}
          <img
            className="dl-nav-avatar"
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
        <div className="dl-nav-links">
          <a className="dl-nav-link" href="#work">/work</a>
          <a className="dl-nav-link" href="#work">/lab</a>
          <span className="dl-nav-link is-soon">/photography</span>
          <span className="dl-nav-link is-soon">/about</span>
        </div>
        <span className="dl-nav-rule" aria-hidden="true" />
        <span className="dl-kbd">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
          <span className="dl-kbd-label">index</span>
        </span>
        <span className="dl-theme" aria-hidden="true">
          ◐
        </span>
      </div>
    </div>
  );
}

export default function DrenchLab() {
  const [idx, setIdx] = useState(0);
  const [drenched, setDrenched] = useState(true);
  const [condensed, setCondensed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const g = GROUNDS[idx];

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    // Condense the instant the page leaves the very top. The sentinel is a
    // 1px marker at scroll origin; as soon as it clears the viewport top the
    // bar contracts into the island, so the morph rides the first scroll
    // rather than waiting for the hero to end.
    const io = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      id="top"
      className="drench-lab"
      data-drenched={drenched ? "" : undefined}
      style={{ "--ground": g.ground } as CSSProperties}
    >
      <style>{CSS}</style>
      {/* scroll-origin marker: present => at top => nav expanded */}
      <div ref={sentinelRef} className="dl-sentinel" aria-hidden="true" />
      <DrenchNav condensed={condensed} />

      <main>
        {/* ============ HERO (drenched) ============ */}
        <section className="dl-hero" aria-labelledby="dl-hero-title">
          <div className="container">
            <p className="mono-label dl-eyebrow">
              Giacomo Patella · senior product designer
            </p>
            <h1 id="dl-hero-title" className="dl-h1">
              I make complicated products easier to live&nbsp;with.
            </h1>
            <p className="dek dl-dek">
              Over a decade of that now, most recently the AI workspace at{" "}
              <strong>Passionfruit</strong>. Lately I&rsquo;m deep in AI
              tooling, working out what a design engineer actually is and
              whether I can become&nbsp;one.
            </p>
            <div className="hero-meta dl-meta">
              <p className="hero-meta-line">
                Florence, Italy · 43.77°N 11.26°E ·{" "}
                <a href="mailto:gp@gpcodes.com">gp@gpcodes.com</a>
              </p>
              <CopyPrompt />
            </div>
          </div>
        </section>

        {/* ============ the drop into the light body ============ */}
        <section className="section dl-work" id="work">
          <div className="container">
            <div className="sec-head">
              <h2>Selected work</h2>
              <span className="sec-meta">6 entries · 2015 → now</span>
            </div>
            <p style={{ color: "var(--muted)", maxWidth: "38rem" }}>
              The light body resumes here, unchanged. Scroll up and down across
              this edge: the nav should condense into the floating island as the
              petrol turns to light, and expand back as you return to the top.
            </p>
            <div style={{ height: "70vh" }} />
          </div>
        </section>
      </main>

      {/* dev controls, fixed out of the way */}
      <div
        className="dl-controls"
        role="group"
        aria-label="Drench preview controls"
      >
        <button
          type="button"
          className="dl-toggle"
          onClick={() => setDrenched((d) => !d)}
          aria-pressed={drenched}
        >
          {drenched ? "showing: drenched" : "showing: current"}
        </button>
        <div className="dl-grounds">
          {GROUNDS.map((cand, i) => (
            <button
              type="button"
              key={cand.key}
              className="dl-swatch"
              data-active={i === idx ? "" : undefined}
              onClick={() => setIdx(i)}
              title={cand.name}
            >
              <span
                className="dl-swatch-dot"
                style={{ background: cand.ground }}
                aria-hidden="true"
              />
              {cand.name}
              {cand.lead && <span className="dl-lead">lead</span>}
            </button>
          ))}
        </div>
        <p className="dl-note">{g.note}</p>
      </div>
    </div>
  );
}

const CSS = `
.drench-lab { min-height: 100vh; }
.dl-sentinel { height: 1px; }

/* ---- the drench (only when data-drenched is present) ---- */
.drench-lab[data-drenched] .dl-hero {
  background: var(--ground);
  /* full bleed: the ground runs edge to edge, content stays in the container */
  box-shadow: 0 0 0 100vmax var(--ground);
  clip-path: inset(0 -100vmax);
  border-bottom: none;
}
.drench-lab[data-drenched] .dl-eyebrow { color: color-mix(in srgb, white 58%, transparent); }
.drench-lab[data-drenched] .dl-h1 { color: #fff; }
.drench-lab[data-drenched] .dl-dek { color: color-mix(in srgb, white 80%, transparent); }
.drench-lab[data-drenched] .dl-dek strong { color: #fff; }
.drench-lab[data-drenched] .dl-meta { border-top-color: color-mix(in srgb, white 18%, transparent); }
.drench-lab[data-drenched] .hero-meta-line { color: color-mix(in srgb, white 60%, transparent); }
.drench-lab[data-drenched] .hero-meta-line a {
  color: #fff;
  text-decoration-color: color-mix(in srgb, white 40%, transparent);
}
.drench-lab[data-drenched] .copy-row { color: color-mix(in srgb, white 58%, transparent); }
.drench-lab[data-drenched] .ai-btn {
  background: color-mix(in srgb, white 8%, transparent);
  border-color: color-mix(in srgb, white 26%, transparent);
  color: #fff;
}
.drench-lab[data-drenched] .ai-btn:hover { border-color: #fff; color: #fff; }
.drench-lab[data-drenched] .copy-row-links a {
  color: color-mix(in srgb, white 72%, transparent);
  text-decoration-color: color-mix(in srgb, white 34%, transparent);
}

/* base hero spacing mirrors the real one so the preview is faithful */
.dl-hero { padding-block: var(--sp-10) var(--sp-8); border-bottom: 1px solid var(--line); position: relative; }
.dl-h1 { font-size: var(--text-2xl); font-weight: 700; letter-spacing: -0.025em; line-height: 1.04; text-wrap: balance; margin-top: var(--sp-4); }

/* ============================================================
   the morphing nav
   ============================================================ */
.dl-nav {
  /* liquid morph: a gentle overshoot on the shape so the bar settles into the
     island rather than snapping. Shape only; the surface is constant. */
  --dur-morph: 380ms;
  --ease-liquid: cubic-bezier(0.34, 1.28, 0.64, 1);
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  margin-inline: auto; width: 100%;
  pointer-events: none;
  color: var(--ink);
  /* always a light frosted surface, so hero content passes UNDER the nav and
     never through it. Only the shape changes on scroll. */
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid transparent;
  border-bottom-color: var(--line);
  border-radius: 0;
  box-shadow: none;
  transition:
    width var(--dur-morph) var(--ease-liquid),
    transform var(--dur-morph) var(--ease-liquid),
    border-color var(--dur-morph) var(--ease-liquid),
    border-radius var(--dur-morph) var(--ease-liquid),
    box-shadow var(--dur-morph) var(--ease-liquid);
}
.dl-nav-inner {
  pointer-events: auto;
  max-width: var(--container); width: 100%; margin-inline: auto;
  height: var(--header-h);
  padding-inline: var(--sp-5);
  display: flex; align-items: center; gap: var(--sp-4);
}
.dl-nav-home { display: inline-flex; align-items: center; gap: var(--sp-3); text-decoration: none; min-width: 0; color: inherit; }
.dl-nav-avatar {
  flex-shrink: 0; width: 1.75rem; height: 1.75rem; border-radius: 999px;
  object-fit: cover; border: 1px solid var(--line-strong); filter: grayscale(1) contrast(1.02);
}
.dl-nav .wordmark { color: inherit; }
.dl-nav .wordmark .tld { color: color-mix(in srgb, currentColor 60%, transparent); }
.dl-nav-links { display: flex; align-items: center; gap: var(--sp-1); font-family: var(--font-mono); font-size: var(--text-sm); white-space: nowrap; }
.dl-nav-link { padding: var(--sp-1) var(--sp-2); border-radius: var(--radius); color: inherit; text-decoration: none; }
.dl-nav-link.is-soon { color: color-mix(in srgb, currentColor 45%, transparent); }
.dl-nav-rule { width: 1px; height: 1.25rem; background: color-mix(in srgb, currentColor 24%, transparent); margin-inline: auto 0; }
.dl-kbd { display: inline-flex; align-items: center; gap: 0.25rem; font-family: var(--font-mono); font-size: var(--text-xs); color: color-mix(in srgb, currentColor 70%, transparent); }
.dl-kbd kbd { border: 1px solid color-mix(in srgb, currentColor 30%, transparent); border-radius: var(--radius-sm); padding: 0 0.3rem; font-family: inherit; }
.dl-kbd-label { margin-left: 0.15rem; }
.dl-theme { font-size: 1rem; color: color-mix(in srgb, currentColor 75%, transparent); }

/* condensed: the same frosted surface, contracted into the floating island. */
.dl-nav[data-condensed] {
  width: min(48rem, calc(100vw - var(--sp-4)));
  transform: translateY(var(--sp-3));
  border-color: var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}
.dl-nav[data-condensed] .dl-nav-inner { max-width: none; padding-inline: var(--sp-4) var(--sp-3); }

@media (prefers-reduced-motion: reduce) {
  .dl-nav { transition: none; }
}

/* ---- dev controls ---- */
.dl-controls {
  position: fixed; left: 50%; bottom: var(--sp-4); transform: translateX(-50%);
  z-index: 80; width: min(46rem, calc(100vw - 2rem));
  background: var(--surface); border: 1px solid var(--line-strong);
  border-radius: var(--radius-lg); box-shadow: var(--shadow);
  padding: var(--sp-3) var(--sp-4); display: flex; flex-wrap: wrap; gap: var(--sp-2) var(--sp-3);
  align-items: center; font-family: var(--font-mono); font-size: var(--text-xs);
}
.dl-toggle { padding: 0.25rem var(--sp-2); border: 1px solid var(--line-strong); border-radius: var(--radius); background: var(--wash); color: var(--ink); cursor: pointer; font: inherit; }
.dl-grounds { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
.dl-swatch { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem var(--sp-2); border: 1px solid var(--line); border-radius: var(--radius); background: transparent; color: var(--muted); cursor: pointer; font: inherit; }
.dl-swatch[data-active] { border-color: var(--ink); color: var(--ink); background: var(--wash); }
.dl-swatch-dot { width: 0.85rem; height: 0.85rem; border-radius: 3px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15); }
.dl-lead { font-size: 0.625rem; padding: 0 0.3rem; border-radius: 3px; background: var(--ink); color: var(--bg); }
.dl-note { flex-basis: 100%; margin: 0; color: var(--muted); line-height: 1.5; text-wrap: pretty; }
`;
