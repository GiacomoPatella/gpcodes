import Link from "next/link";

const PLANNED = ["work", "lab", "photography", "about"] as const;

/**
 * Floating dock. Signposts the planned IA: only `/` exists today, so the
 * other routes render as visibly-inactive entries with a tooltip instead of
 * 404ing. When a section ships, its entry becomes a Link.
 */
export default function Dock({ current = "/" }: { current?: string }) {
  return (
    <nav className="dock" aria-label="Site map">
      <Link
        href="/"
        className="dock-link"
        aria-current={current === "/" ? "page" : undefined}
      >
        index
      </Link>
      <span className="dock-rule" aria-hidden="true" />
      {PLANNED.map((slug) => (
        <span key={slug} className="dock-soon-wrap">
          <button
            type="button"
            className="dock-soon"
            aria-disabled="true"
            aria-describedby={`dock-tip-${slug}`}
          >
            /{slug}
          </button>
          <span className="dock-tip" role="tooltip" id={`dock-tip-${slug}`}>
            coming soon
          </span>
        </span>
      ))}
    </nav>
  );
}
