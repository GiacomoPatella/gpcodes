import Link from "next/link";
import CommandPalette from "@/components/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";

const IA = [
  { slug: "work", live: false },
  { slug: "lab", live: true },
  { slug: "photography", live: false },
  { slug: "about", live: false },
] as const;

const norm = (s: string) => (s === "/" ? "/" : s.replace(/\/+$/, ""));

/**
 * The one navigation surface: a floating bar that replaces both the old
 * sticky header and the bottom dock. It carries the avatar + wordmark (home),
 * the site IA — live routes as real links, planned ones visibly inactive
 * with a tooltip instead of a 404 — and the ⌘K + theme controls.
 *
 * Sticky rather than fixed, so by construction it can never overlap page
 * content (the old dock sat on top of the architecture canvas). On narrow
 * viewports the planned routes drop out first, then the ⌘K trigger loses its
 * text label; the palette itself is the escape hatch for everything else.
 */
export default function Menu({ current = "/" }: { current?: string }) {
  return (
    <div className="fmenu-wrap">
      <nav className="fmenu" aria-label="Site">
        <Link
          className="fmenu-home"
          href="/"
          aria-current={norm(current) === "/" ? "page" : undefined}
        >
          {/* Plain img: static export runs images.unoptimized. */}
          <img
            className="fmenu-avatar"
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
        </Link>

        <div className="fmenu-links">
          {IA.map((item) =>
            item.live ? (
              <Link
                key={item.slug}
                className="fmenu-link"
                href={`/${item.slug}/`}
                aria-current={
                  norm(current).startsWith(`/${item.slug}`)
                    ? "page"
                    : undefined
                }
              >
                /{item.slug}
              </Link>
            ) : (
              <span key={item.slug} className="fmenu-soon-wrap">
                <button
                  type="button"
                  className="fmenu-soon"
                  aria-disabled="true"
                  aria-describedby={`menu-tip-${item.slug}`}
                >
                  /{item.slug}
                </button>
                <span
                  className="fmenu-tip"
                  role="tooltip"
                  id={`menu-tip-${item.slug}`}
                >
                  coming soon
                </span>
              </span>
            ),
          )}
        </div>

        <span className="fmenu-rule" aria-hidden="true" />
        <CommandPalette />
        <ThemeToggle />
      </nav>
    </div>
  );
}
