"use client";

import { useState } from "react";
import CopyPrompt from "@/components/CopyPrompt";
import Menu from "@/components/Menu";
import FaceField, { type FaceConfig } from "./FaceField";

/**
 * HERO PROTOTYPE, VERSION 2. Dev aid, noindex, live site untouched.
 *
 * Keeps the real floating <Menu> and fills the ~45% of dead hero space at
 * >=1024px (the impeccable critique's finding) with an interactive halftone
 * portrait: Giacomo's face sampled into a dot field that the cursor pushes
 * through and that springs back home. See FaceField.tsx for the engine.
 *
 * Source image: `/face-source.jpg` (the high-res square export). If that file
 * is not in place yet the field falls back to `/avatar-384.jpg` on its own, so
 * this route always renders something; drop the export in `public/` to sharpen.
 *
 * Coherence note (STATE.md open item c): this is the SECOND particle moment on
 * the site after the footer wordmark. Both live here for the comparison; the
 * decision of whether both survive, or the face becomes the sole signature, is
 * Giacomo's and is easier to make with the two side by side.
 */
const DEFAULTS: FaceConfig = {
  src: "/face-source.jpg",
  pitch: 6,
  repelRadius: 95,
  repelStrength: 2.4,
  maxDotR: 2.7,
  cutout: 0.2,
  color: "ink",
};

export default function FaceLab() {
  const [cfg, setCfg] = useState<FaceConfig>(DEFAULTS);
  const set = <K extends keyof FaceConfig>(k: K, v: FaceConfig[K]) =>
    setCfg((c) => ({ ...c, [k]: v }));

  // Geometry-affecting props remount the field (a rebuild is unavoidable);
  // repelRadius/strength are read live inside the engine, no remount.
  const fieldKey = `${cfg.src}|${cfg.pitch}|${cfg.maxDotR}|${cfg.cutout}|${cfg.color}`;

  return (
    <>
      <style>{CSS}</style>
      <Menu current="/palette/face" />

      <main className="flab-main">
        <section className="hero flab-hero" aria-labelledby="f-hero-title">
          <div className="container flab-grid">
            <div className="flab-copy">
              <p className="mono-label">
                Giacomo Patella · senior product designer
              </p>
              <h1 id="f-hero-title" style={{ marginTop: "var(--sp-4)" }}>
                I make complicated products easier to live&nbsp;with.
              </h1>
              <p className="dek">
                Over a decade of that now, most recently the AI workspace at{" "}
                <strong>Passionfruit</strong>. Lately I&rsquo;m deep in AI
                tooling, working out what a design engineer actually is and
                whether I can become&nbsp;one.
              </p>
              <div className="hero-meta">
                <p className="hero-meta-line">
                  <a href="mailto:gp@gpcodes.com">gp@gpcodes.com</a>
                </p>
                <CopyPrompt />
              </div>
            </div>

            <div className="flab-face" aria-hidden="true">
              <FaceField key={fieldKey} {...cfg} />
            </div>
          </div>
        </section>

        <section className="section" aria-label="filler">
          <div className="container">
            <p style={{ color: "var(--muted)", maxWidth: "38rem" }}>
              Move the cursor across the portrait: the dots scatter away from it
              and spring home, then the field settles and stops. Below 1024px it
              hides and the hero is single-column, as the live site is today.
            </p>
          </div>
        </section>
      </main>

      {/* dev controls, fixed out of the way */}
      <div className="flab-controls" role="group" aria-label="Face field controls">
        <label>
          density
          <input
            type="range" min={4} max={10} step={0.5}
            value={cfg.pitch}
            onChange={(e) => set("pitch", Number(e.target.value))}
          />
          <span className="flab-val">{cfg.pitch}px</span>
        </label>
        <label>
          dot size
          <input
            type="range" min={1.6} max={4} step={0.1}
            value={cfg.maxDotR}
            onChange={(e) => set("maxDotR", Number(e.target.value))}
          />
          <span className="flab-val">{cfg.maxDotR}</span>
        </label>
        <label>
          cutout
          <input
            type="range" min={0.05} max={0.45} step={0.01}
            value={cfg.cutout}
            onChange={(e) => set("cutout", Number(e.target.value))}
          />
          <span className="flab-val">{cfg.cutout.toFixed(2)}</span>
        </label>
        <label>
          repel radius
          <input
            type="range" min={40} max={180} step={5}
            value={cfg.repelRadius}
            onChange={(e) => set("repelRadius", Number(e.target.value))}
          />
          <span className="flab-val">{cfg.repelRadius}</span>
        </label>
        <label>
          repel force
          <input
            type="range" min={0.8} max={5} step={0.1}
            value={cfg.repelStrength}
            onChange={(e) => set("repelStrength", Number(e.target.value))}
          />
          <span className="flab-val">{cfg.repelStrength}</span>
        </label>
        <div className="flab-seg" role="group" aria-label="dot colour">
          {(["ink", "muted", "accent"] as const).map((c) => (
            <button
              key={c}
              type="button"
              data-active={cfg.color === c ? "" : undefined}
              onClick={() => set("color", c)}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="flab-note">
          prototype v2 · halftone face · src falls back to avatar if
          /face-source.jpg is absent
        </p>
      </div>
    </>
  );
}

const CSS = `
.flab-main { min-height: 100vh; }
/* keep the hero border/spacing, but let the face column breathe */
.flab-hero { overflow: clip; }
.flab-grid { display: block; }
.flab-face { display: none; }

@media (min-width: 1024px) {
  .flab-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 30rem);
    align-items: center;
    gap: var(--sp-8);
  }
  .flab-copy { min-width: 0; }
  .flab-face {
    display: block;
    justify-self: end;
    width: 100%;
    max-width: 30rem;
    aspect-ratio: 1 / 1;
  }
}
.face-field { width: 100%; height: 100%; }
/* touch-action none so a drag over the field disturbs it instead of scrolling */
.face-field { touch-action: none; }

/* ---- dev controls ---- */
.flab-controls {
  position: fixed; left: 50%; bottom: var(--sp-4); transform: translateX(-50%);
  z-index: 80; width: min(52rem, calc(100vw - 2rem));
  background: var(--surface); border: 1px solid var(--line-strong);
  border-radius: var(--radius-lg); box-shadow: var(--shadow);
  padding: var(--sp-3) var(--sp-4);
  display: flex; flex-wrap: wrap; gap: var(--sp-2) var(--sp-4);
  align-items: center; font-family: var(--font-mono); font-size: var(--text-xs);
  color: var(--muted);
}
.flab-controls label { display: inline-flex; align-items: center; gap: var(--sp-2); }
.flab-controls input[type="range"] { width: 6rem; accent-color: var(--accent-ink); }
.flab-val { color: var(--ink); min-width: 2.5rem; }
.flab-seg { display: inline-flex; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
.flab-seg button {
  padding: 0.25rem var(--sp-2); border: 0; background: transparent;
  color: var(--muted); cursor: pointer; font: inherit; border-inline-start: 1px solid var(--line);
}
.flab-seg button:first-child { border-inline-start: 0; }
.flab-seg button[data-active] { background: var(--wash); color: var(--ink); }
.flab-note { flex-basis: 100%; margin: 0; line-height: 1.5; text-wrap: pretty; }
`;
