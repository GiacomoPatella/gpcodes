import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import Menu from "@/components/Menu";
import AccentPicker from "@/components/AccentPicker";

export const metadata: Metadata = {
  title: "Accent comparison · gpcodes",
  robots: { index: false },
};

/**
 * Dev aid: renders the page's key accent-carrying components under each
 * accent candidate. The site derives every accent usage from the single
 * `--accent` custom property, so overriding it per-section here shows
 * exactly what a one-line swap in globals.css would produce.
 *
 * Derived hexes below are precomputed from the same formulas the CSS uses:
 *   light text  = oklch(from accent min(l, 0.5) c h)
 *   dark text   = oklch(from accent max(l, 0.75) calc(c * 0.8) h)
 */
const ACCENTS = [
  {
    name: "electric blue",
    value: "#2b4cff",
    shipping: true,
    lightInk: "≈#2642f5 · 6.4:1 on light bg",
    darkInk: "≈#8aabfe · 8.5:1 on dark bg",
  },
  {
    name: "acid green",
    value: "#00c07f",
    shipping: false,
    lightInk: "≈#02764d · 5.5:1 on light bg",
    darkInk: "≈#58c792 · 9.1:1 on dark bg",
  },
  {
    name: "deep violet",
    value: "#6b2bff",
    shipping: false,
    lightInk: "≈#641af5 · 6.8:1 on light bg",
    darkInk: "≈#a7a1fe · 8.4:1 on dark bg",
  },
] as const;

function Samples() {
  return (
    <div className="swatch-samples">
      <div className="swatch-cell">
        <span className="mono-label" style={{ color: "var(--accent-ink)" }}>
          accent as label
        </span>
        <p>
          Body copy with an{" "}
          <Link className="a-link" href="/#work">
            accent link
          </Link>{" "}
          in context, plus <kbd>⌘</kbd> <kbd>K</kbd> chrome around it.
        </p>
        <div className="chip-row">
          <button type="button" className="btn btn-primary">
            primary action
          </button>
          <button type="button" className="btn">
            secondary
          </button>
        </div>
        <div
          className="palette-item"
          style={{
            background: "var(--wash)",
            boxShadow: "inset 2px 0 0 var(--accent-ink)",
          }}
        >
          <span>selected palette row</span>
          <span className="hint">↵</span>
        </div>
      </div>
      <div className="swatch-cell">
        <div className="outcome" style={{ marginTop: 0 }}>
          <span className="mono-label">outcome</span>
          <p>
            The client&rsquo;s customer invested a <strong>six-figure sum</strong>{" "}
            to develop it further.
          </p>
        </div>
        <p
          className="mono-label"
          style={{
            border: "1px solid var(--accent-ink)",
            borderRadius: "var(--radius)",
            color: "var(--accent-ink)",
            alignSelf: "flex-start",
            padding: "0.125rem var(--sp-2)",
          }}
        >
          case study in preparation
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
          <span style={{ background: "var(--accent-ink)", color: "var(--bg)" }}>
            selected text
          </span>{" "}
          uses the same derived ink.
        </p>
      </div>
    </div>
  );
}

export default function PalettePage() {
  return (
    <>
      <Menu current="/palette" />

      <main className="container swatch-page">
        <h1>Accent comparison</h1>
        <p className="lede">
          Dev aid. The site&rsquo;s accent is one line in{" "}
          <code>globals.css</code>: set <code>--accent</code> and every use
          (text ink, washes, dark-mode variant) is derived from it in CSS.
          Each section below overrides that property locally, so what you see
          is exactly what the swap ships. Toggle the theme to check dark mode.
        </p>

        <nav className="proto-index" aria-label="Hero prototypes">
          <span className="mono-label">hero prototypes</span>
          <ul>
            <li>
              <Link href="/palette/morph">/palette/morph</Link> — v1, static nav
              morphing into the floating menu (tier 2 rubber-band)
            </li>
            <li>
              <Link href="/palette/face">/palette/face</Link> — v2, interactive
              stippling-halftone face in the hero
            </li>
            <li>
              <Link href="/palette/drench">/palette/drench</Link> — earlier
              drenched-hero + morph experiment
            </li>
          </ul>
        </nav>

        <AccentPicker />

        {ACCENTS.map((a) => (
          <section
            key={a.name}
            className="swatch-section accent-scope"
            style={{ "--accent": a.value } as CSSProperties}
            aria-label={`Accent candidate: ${a.name}`}
          >
            <div className="swatch-head">
              <span className="swatch-chip" aria-hidden="true" />
              <h2>{a.name}</h2>
              <code>--accent: {a.value}</code>
              {a.shipping && <span className="mono-label">shipping</span>}
            </div>
            <Samples />
            <p className="swatch-derived">
              derived text ink, light: {a.lightInk}
              <br />
              derived text ink, dark: {a.darkInk}
            </p>
          </section>
        ))}
      </main>
    </>
  );
}
