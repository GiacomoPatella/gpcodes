import { Fragment } from "react";
import Link from "next/link";

const LIVE = [
  { label: "index", href: "/" },
  { label: "/lab", href: "/lab/" },
] as const;

const PLANNED = ["work", "photography", "about"] as const;

const norm = (s: string) => (s === "/" ? "/" : s.replace(/\/+$/, ""));

/**
 * Floating dock. Signposts the planned IA: `/` and `/lab` exist today, so
 * they render as real links; the other routes render as visibly-inactive
 * entries with a tooltip instead of 404ing. When a section ships, its entry
 * moves from PLANNED to LIVE.
 */
export default function Dock({ current = "/" }: { current?: string }) {
  return (
    <nav className="dock" aria-label="Site map">
      {LIVE.map((item, i) => (
        <Fragment key={item.href}>
          {i > 0 && <span className="dock-rule" aria-hidden="true" />}
          <Link
            href={item.href}
            className="dock-link"
            aria-current={
              norm(current) === norm(item.href) ? "page" : undefined
            }
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
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
