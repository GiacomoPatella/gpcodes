"use client";

import { useEffect, useRef } from "react";

/**
 * The footer signature: particles converge to form `gpcodes.com`.
 *
 * Raw Canvas 2D, no p5. p5 was removed from this project once already, when a
 * 1.38MB chunk became 9KB, and one wordmark is nowhere near a reason to bring
 * it back.
 *
 * Two decisions worth stating, because both are about not being annoying:
 *
 * 1. **It settles and stops.** The RAF loop cancels itself once the last
 *    particle has arrived. "Not laggy" is an explicit requirement, and a
 *    permanently running animation loop at the foot of every page is exactly
 *    how that requirement gets broken. It re-runs only if you leave and come
 *    back, or if the theme changes under it.
 * 2. **The target is the real wordmark.** There is no logo to draw, so the
 *    honest subject is the text the site already uses in the menu. The
 *    canvas is decorative: the same wordmark sits behind it as real text for
 *    anyone not looking at pixels.
 *
 * Reduced motion draws the settled state immediately, with no travel.
 */
export default function ParticleWordmark() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    // Aliased after the guard: the hoisted helpers below close over this, and
    // narrowing on the ref itself does not reach inside them.
    const host: HTMLDivElement = hostRef.current;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      x: number; y: number;   // current
      tx: number; ty: number; // target
      sx: number; sy: number; // start
      delay: number;
      dur: number;
    };
    let particles: P[] = [];
    let raf = 0;
    let start = 0;
    let running = false;

    const reduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** Resolve a CSS custom property to a concrete colour string. */
    const token = (name: string) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${name})`;
      probe.style.display = "none";
      host.appendChild(probe);
      const c = getComputedStyle(probe).color;
      probe.remove();
      return c;
    };

    /**
     * Sample the wordmark into target points by rendering it to an offscreen
     * canvas and walking the alpha channel on a grid. The step size is the
     * density dial: smaller means more particles and a crisper word.
     */
    function build() {
      const W = host.clientWidth;
      if (!W) return;
      const H = Math.round(Math.min(Math.max(W * 0.14, 64), 140));

      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = Math.round(W * dpr);
      off.height = Math.round(H * dpr);
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const probe = document.createElement("span");
      probe.style.fontFamily = "var(--font-mono)";
      probe.style.display = "none";
      host.appendChild(probe);
      const mono = getComputedStyle(probe).fontFamily;
      probe.remove();

      // Fit the word to the width rather than guessing a size.
      let size = Math.round(H * 0.62);
      octx.font = `600 ${size}px ${mono}`;
      const target = W * 0.82;
      const measured = octx.measureText("gpcodes.com").width;
      size = Math.max(12, Math.round((size * target) / measured));
      octx.font = `600 ${size}px ${mono}`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#000";
      octx.fillText("gpcodes.com", W / 2, H / 2);

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      // Step in CSS px, scaled to device px when indexing.
      const step = W < 480 ? 3 : 4;
      const pts: { x: number; y: number }[] = [];
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const dx = Math.round(x * dpr);
          const dy = Math.round(y * dpr);
          const alpha = img[(dy * off.width + dx) * 4 + 3];
          if (alpha > 128) pts.push({ x, y });
        }
      }

      /* Hand over from the plain-text fallback only once there is something
         real to show. A canvas is transparent, so it never "covers" the text
         underneath: without this the two render on top of each other. */
      if (pts.length) host.dataset.ready = "true";

      particles = pts.map((p) => {
        // Enter from just outside the frame, biased to the nearer edge, so the
        // word assembles inward instead of exploding outward.
        const fromLeft = p.x < W / 2;
        const spread = 0.35;
        return {
          tx: p.x,
          ty: p.y,
          x: 0,
          y: 0,
          sx: fromLeft ? -W * spread * Math.random() : W + W * spread * Math.random(),
          sy: p.y + (Math.random() - 0.5) * H * 1.6,
          // Stagger left to right, plus jitter so it does not read as a wipe.
          delay: (p.x / W) * 420 + Math.random() * 220,
          dur: 620 + Math.random() * 420,
        };
      });
    }

    // easeOutCubic: quick commitment, soft arrival.
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    let ink = token("--accent-ink");
    const refreshInk = () => {
      ink = token("--accent-ink");
    };

    function draw(settledOnly: boolean, now: number) {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.clearRect(0, 0, W, H);
      // Resolved once per settle, not per frame: token() touches the DOM, and
      // doing that 60 times a second for a colour that only changes with the
      // theme is exactly the kind of cost "not laggy" was written about.
      ctx.fillStyle = ink;

      let done = true;
      const r = dpr > 1 ? 0.9 : 1;
      for (const p of particles) {
        let t = 1;
        if (!settledOnly) {
          t = (now - start - p.delay) / p.dur;
          if (t < 1) {
            // Still waiting out its stagger delay, or still travelling. Both
            // are "not done": treating a negative t as finished ended the loop
            // on frame one, with every particle drawn at alpha 0.
            if (t < 0) t = 0;
            done = false;
          } else {
            t = 1;
          }
        }
        const e = ease(t);
        p.x = p.sx + (p.tx - p.sx) * e;
        p.y = p.sy + (p.ty - p.sy) * e;
        // Fade in over the first half of the travel.
        ctx.globalAlpha = settledOnly ? 1 : Math.min(1, t * 2);
        ctx.fillRect(p.x, p.y, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      return done;
    }

    function frame(now: number) {
      if (!start) start = now;
      const done = draw(false, now);
      if (done) {
        // Settled. Stop burning frames.
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function run() {
      if (running || !particles.length) return;
      if (reduced()) {
        draw(true, 0);
        return;
      }
      running = true;
      start = 0;
      refreshInk();
      raf = requestAnimationFrame(frame);
    }

    function reset() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
      build();
    }

    let visible = false;

    /**
     * Build is gated on two things that are not ready at mount.
     *
     * Fonts: sampling before the webfont lands would trace the fallback's
     * letterforms, so the particles would spell the word in the wrong face and
     * never correct themselves.
     *
     * Width: the first layout pass can report 0, and an early build would
     * produce no particles at all. run() would then return silently forever,
     * because it has nothing to animate. A ResizeObserver covers both the
     * first real width and later resizes, so there is no guessing.
     */
    let lastW = 0;
    const rebuild = (replay: boolean) => {
      const W = host.clientWidth;
      if (!W || W === lastW) return;
      lastW = W;
      reset();
      if (visible && replay) run();
      else draw(true, 0);
    };

    document.fonts.ready.then(() => {
      lastW = 0; // force a resample now the real face is available
      rebuild(true);
    });

    const ro = new ResizeObserver(() => {
      // A resize is not an entrance: rebuild, but settle rather than replay.
      rebuild(false);
    });
    ro.observe(host);

    // Only animate when it is actually on screen, and replay on re-entry.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible) run();
          else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
            running = false;
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(host);

    // Theme or accent changes repaint the settled word; no need to replay.
    const repaint = () => {
      refreshInk();
      if (!running) draw(true, 0);
    };
    const themeObserver = new MutationObserver(repaint);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", repaint);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      scheme.removeEventListener("change", repaint);
      canvas.remove();
      delete host.dataset.ready;
    };
  }, []);

  return (
    <div className="pw" ref={hostRef}>
      {/* The real wordmark, for anyone the canvas is not for. The canvas
          covers it once it paints. */}
      <span className="pw-text">gpcodes.com</span>
    </div>
  );
}
