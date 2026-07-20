"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/* Muted, deep candidates: deliberately low-chroma alternatives to the bright
   trio. None are in the warm beige/orange family the original palette fell into. */
const PRESETS: { hex: string; name: string }[] = [
  { hex: "#2f3a4a", name: "graphite blue" },
  { hex: "#37485c", name: "slate" },
  { hex: "#2c4a56", name: "deep petrol" },
  { hex: "#2b4f47", name: "pine" },
  { hex: "#3b4a2f", name: "olive" },
  { hex: "#4a3350", name: "aubergine" },
  { hex: "#5a2f3a", name: "oxblood" },
  { hex: "#1f2430", name: "near-black" },
];

/* Must match --accent in globals.css. This route's whole job is reporting
   which accent is live, so a wrong value here does more than mislabel the
   swatch: no preset reads as selected, and reset returns to the real accent
   while the field still shows this one. */
const DEFAULT = "#2c4a56";

/* Relative luminance per WCAG 2.x. */
function luminance([r, g, b]: number[]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: number[], b: number[]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* Resolve a CSS value to rgb by letting the browser compute it. Custom
   properties can return unsubstituted token streams, so we read a real
   `color` off a probe element instead. */
function resolve(probe: HTMLElement, value: string): number[] | null {
  probe.style.color = "";
  probe.style.color = value;
  const computed = getComputedStyle(probe).color;
  const m = computed.match(/-?[\d.]+/g);
  return m && m.length >= 3 ? m.slice(0, 3).map(Number) : null;
}

/* The applied accent lives outside React: it's written to localStorage and
   onto the document element by the pre-paint script in layout.tsx. Reading it
   through useSyncExternalStore keeps hydration correct without setting state
   from an effect. */
const EVENT = "accentchange";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): string {
  try {
    const stored = localStorage.getItem("accent");
    if (stored && /^#[0-9a-f]{6}$/i.test(stored)) return stored;
  } catch {
    /* private mode */
  }
  return DEFAULT;
}

export default function AccentPicker() {
  const applied = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT);
  /* Held only while the hex field is mid-edit and may be incomplete. */
  const [draft, setDraft] = useState<string | null>(null);
  const [ratios, setRatios] = useState<{ ink: number; bg: number } | null>(null);
  const probeRef = useRef<HTMLSpanElement>(null);

  const accent = draft ?? applied;

  const apply = useCallback((hex: string) => {
    document.documentElement.style.setProperty("--accent", hex);
    try {
      localStorage.setItem("accent", hex);
    } catch {
      /* private mode: the trial still works for this page view */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const reset = useCallback(() => {
    setDraft(null);
    document.documentElement.style.removeProperty("--accent");
    try {
      localStorage.removeItem("accent");
    } catch {
      /* no-op */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  /* Measure the *derived* text ink, not the raw accent, which is what actually
     lands on text, and it's clamped in CSS. Re-measure on theme change too. */
  useEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const measure = () => {
      const ink = resolve(probe, "var(--accent-ink)");
      const bg = resolve(probe, "var(--bg)");
      const surface = resolve(probe, "var(--surface)");
      if (ink && bg && surface) {
        setRatios({ ink: contrast(ink, bg), bg: contrast(ink, surface) });
      }
    };
    measure();
    const observer = new MutationObserver(measure);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", measure);
    };
  }, [accent]);

  const worst = ratios ? Math.min(ratios.ink, ratios.bg) : null;
  const passes = worst !== null && worst >= 4.5;

  return (
    <div className="not-prose my-8 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
          Try an accent
        </h2>
        <button
          type="button"
          onClick={reset}
          className="font-mono text-xs text-[var(--muted)] underline underline-offset-4 hover:text-[var(--ink)]"
        >
          reset
        </button>
      </div>

      <p className="mt-2 max-w-prose text-sm text-[var(--muted)]">
        Applies live across the whole site and persists while you browse, so you
        can navigate to the homepage and keep judging it. Nothing is committed
        until you pick one.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          <span className="sr-only">Accent colour</span>
          <input
            type="color"
            value={accent}
            onChange={(e) => {
              setDraft(null);
              apply(e.target.value);
            }}
            className="h-9 w-14 cursor-pointer rounded border border-[var(--line)] bg-transparent p-1"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="sr-only">Accent hex value</span>
          <input
            type="text"
            value={accent}
            spellCheck={false}
            onChange={(e) => {
              const v = e.target.value.trim();
              if (/^#[0-9a-f]{6}$/i.test(v)) {
                setDraft(null);
                apply(v);
              } else {
                setDraft(v);
              }
            }}
            className="w-28 rounded border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5 font-mono text-sm text-[var(--ink)]"
          />
        </label>

        {ratios && (
          <p
            className="font-mono text-xs"
            style={{ color: passes ? "var(--muted)" : "#b42318" }}
            role="status"
          >
            derived text ink {worst!.toFixed(1)}:1{" "}
            {passes ? "· passes AA" : "· below 4.5:1, fails AA"}
          </p>
        )}
      </div>

      <div className="mt-5">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
          Muted candidates
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.hex}
              type="button"
              onClick={() => {
                setDraft(null);
                apply(p.hex);
              }}
              aria-pressed={accent.toLowerCase() === p.hex}
              title={`${p.name} ${p.hex}`}
              className="flex items-center gap-2 rounded border px-2.5 py-1.5 font-mono text-xs transition-colors"
              style={{
                borderColor:
                  accent.toLowerCase() === p.hex
                    ? "var(--ink)"
                    : "var(--line)",
              }}
            >
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 rounded-full"
                style={{ background: p.hex }}
              />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live preview. Deliberately NOT inside .accent-scope so it inherits the
          root --accent the picker is setting. The sections below this card
          override the accent locally and so can't show the current choice. */}
      <div className="mt-5">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
          Live preview
        </p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="rounded border border-[var(--line)] bg-[var(--bg)] p-4">
            <p className="text-sm text-[var(--ink)]">
              Body copy with an{" "}
              <a
                href="#accent-preview"
                onClick={(e) => e.preventDefault()}
                className="underline underline-offset-2"
                style={{ color: "var(--accent-ink)" }}
              >
                accent link
              </a>{" "}
              in context.
            </p>
            <div className="mt-3 flex gap-2">
              <span
                className="rounded px-2.5 py-1.5 font-mono text-xs text-white"
                style={{ background: "var(--accent-ink)" }}
              >
                primary action
              </span>
              <span className="rounded border border-[var(--line-strong)] px-2.5 py-1.5 font-mono text-xs text-[var(--ink)]">
                secondary
              </span>
            </div>
          </div>

          <div
            className="rounded p-4"
            style={{
              background: "var(--accent-wash)",
              borderLeft: "2px solid var(--accent-ink)",
            }}
          >
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">
              Outcome
            </p>
            <p className="mt-1 text-sm text-[var(--ink)]">
              The client&rsquo;s customer invested a{" "}
              <strong>six-figure sum</strong> to develop it further.
            </p>
          </div>
        </div>
      </div>

      <span ref={probeRef} aria-hidden="true" className="sr-only" />
    </div>
  );
}
