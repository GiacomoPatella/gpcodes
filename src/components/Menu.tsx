"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CommandPalette from "@/components/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * `work` has no route of its own yet, but the homepage carries a full #work
 * section, so it points there rather than sitting inactive behind a "coming
 * soon" tooltip. When it becomes a real gallery page only `href` changes.
 * `route: false` keeps it out of the aria-current test, which compares
 * pathnames and would never match a fragment.
 */
const IA = [
  { slug: "work", href: "/#work", live: true, route: false },
  { slug: "lab", href: "/lab/", live: true, route: true },
  { slug: "photography", href: null, live: false, route: true },
  { slug: "about", href: null, live: false, route: true },
] as const;

const norm = (s: string) => (s === "/" ? "/" : s.replace(/\/+$/, ""));

/**
 * The actual nav content, shared between both `Menu` renderings below. `ghost`
 * renders the same markup for width measurement only: real interactive
 * children (CommandPalette, ThemeToggle) are swapped for inert stand-ins of
 * the same size, since CommandPalette owns fixed DOM ids and a global ⌘K
 * listener that must exist exactly once, not twice.
 */
function MenuInner({ current, ghost }: { current: string; ghost?: boolean }) {
  return (
    <>
      <Link
        className="fmenu-home"
        href="/"
        aria-current={norm(current) === "/" ? "page" : undefined}
        tabIndex={ghost ? -1 : undefined}
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
          item.live && item.href ? (
            <Link
              key={item.slug}
              className="fmenu-link"
              href={item.href}
              tabIndex={ghost ? -1 : undefined}
              aria-current={
                item.route && norm(current).startsWith(`/${item.slug}`)
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
                tabIndex={ghost ? -1 : undefined}
                aria-describedby={ghost ? undefined : `menu-tip-${item.slug}`}
              >
                /{item.slug}
              </button>
              {!ghost && (
                <span
                  className="fmenu-tip"
                  role="tooltip"
                  id={`menu-tip-${item.slug}`}
                >
                  coming soon
                </span>
              )}
            </span>
          ),
        )}
      </div>

      <span className="fmenu-rule" aria-hidden="true" />
      {ghost ? (
        <>
          <span className="palette-trigger" aria-hidden="true">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
            <span>index</span>
          </span>
          <span className="icon-btn" aria-hidden="true">
            ◐
          </span>
        </>
      ) : (
        <>
          <CommandPalette />
          <ThemeToggle />
        </>
      )}
    </>
  );
}

/**
 * The one navigation surface: a floating bar that replaces both the old
 * sticky header and the bottom dock. It carries the avatar + wordmark (home),
 * the site IA (live routes as real links, planned ones visibly inactive
 * with a tooltip instead of a 404) and the ⌘K + theme controls.
 *
 * `morph`, homepage-only, swaps the always-floating pill for a full-width
 * static bar at rest (content aligned to the hero's left edge, reconciling
 * the hero's own left alignment with the pill's centring) that detaches into
 * that same pill on first scroll. Ported from the `/palette/morph` prototype;
 * see docs/STATE.md for the fix history (the detach/re-attach jump, the size
 * snap, arrival timing, trigger point, and the slow-scroll hysteresis bug).
 * Every other page keeps the plain sticky pill unchanged: it is not fixed, so
 * by construction it can never overlap page content, and there is no
 * matching full-width hero to detach from on those routes.
 */
export default function Menu({
  current = "/",
  morph = false,
}: {
  current?: string;
  morph?: boolean;
}) {
  const [condensed, setCondensed] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  /* Detach the instant the page leaves the very top, and stay detached for as
     long as the user keeps scrolling further down, however slowly. Re-attach
     fires well before scroll actually gets back to the top (REATTACH_PX), so
     the return transition has time to finish before the gesture itself ends.
     Direction, comparing y against the previous sample, decides which rule
     applies: position alone is unstable for a slow scroll, see STATE.md. */
  useEffect(() => {
    if (!morph) return;
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
  }, [morph]);

  /* Measure the condensed pill width from a hidden ghost rendered at the
     compact layout, instead of hardcoding it. The ghost is `width:
     max-content`, so its box is exactly the pill's natural width; a
     ResizeObserver keeps `--pill-w` correct across font load, viewport resize
     and label changes. */
  useEffect(() => {
    if (!morph) return;
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
  }, [morph]);

  if (!morph) {
    return (
      <div className="fmenu-wrap">
        <nav className="fmenu" aria-label="Site">
          <MenuInner current={current} />
        </nav>
      </div>
    );
  }

  return (
    <div
      className="mnav"
      data-condensed={condensed ? "" : undefined}
      ref={wrapRef}
    >
      <div className="mnav-box">
        <nav className="mnav-inner" aria-label="Site">
          <MenuInner current={current} />
        </nav>
      </div>

      {/* hidden measuring copy: compact layout, never shown, never focusable */}
      <div className="mnav-ghost" aria-hidden="true" ref={ghostRef}>
        <div className="mnav-box">
          <div className="mnav-inner">
            <MenuInner current={current} ghost />
          </div>
        </div>
      </div>
    </div>
  );
}
