"use client";

import { useEffect, useRef } from "react";

/**
 * The interactive halftone face for hero prototype v2.
 *
 * A portrait sampled into a dot field: each cell of a grid becomes one particle
 * whose size is how far that patch of the photo sits from the flat background
 * colour, so the subject floats free of the backdrop instead of the whole
 * square filling in. The cursor pushes particles aside; a damped spring pulls
 * each back to its home cell. It settles and STOPS when undisturbed, the same
 * discipline as ParticleWordmark: a permanently running RAF in the hero is
 * exactly how "not laggy" gets broken.
 *
 * Reuses the wordmark's engine ideas (offscreen sample, token() for colour,
 * gated build, settle-and-stop) but the physics are new: springs + repulsion
 * rather than a one-shot ease to target.
 *
 * Same-origin image, so no CORS taint and getImageData is allowed.
 */
export type FaceConfig = {
  src: string;
  /** grid pitch in CSS px; smaller = more, finer dots */
  pitch: number;
  /** cursor repulsion radius in CSS px */
  repelRadius: number;
  /** cursor repulsion strength */
  repelStrength: number;
  /** largest dot radius in CSS px (darkest / most-contrasting cells) */
  maxDotR: number;
  /** background cutout, 0..1 of the tonal range: higher floats the face more */
  cutout: number;
  /** dot colour token */
  color: "ink" | "muted" | "accent";
};

const COLOR_TOKEN: Record<FaceConfig["color"], string> = {
  ink: "--ink",
  muted: "--muted",
  accent: "--accent-ink",
};

export default function FaceField(cfg: FaceConfig) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Latest config in a ref so the pointer handlers and RAF loop read live
  // values without the effect tearing down and rebuilding on every tweak.
  // useRef seeds it with the first cfg, so the mount build already reads the
  // right values; this keeps it fresh on later renders.
  const cfgRef = useRef(cfg);
  useEffect(() => {
    cfgRef.current = cfg;
  });

  useEffect(() => {
    if (!hostRef.current) return;
    // Explicit type so the hoisted helpers that close over this see a non-null
    // element; control-flow narrowing does not reach inside them.
    const host: HTMLDivElement = hostRef.current;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const reduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type P = {
      hx: number; hy: number; // home
      x: number; y: number;   // current
      vx: number; vy: number; // velocity
      r: number;              // dot radius
    };
    let particles: P[] = [];
    let raf = 0;
    let running = false;
    let side = 0; // css px, square

    const pointer = { x: -1e4, y: -1e4, active: false };

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
    let ink = token(COLOR_TOKEN[cfgRef.current.color]);
    const refreshInk = () => {
      ink = token(COLOR_TOKEN[cfgRef.current.color]);
    };

    const img = new Image();
    img.decoding = "async";

    function build() {
      const W = host.clientWidth;
      const H = host.clientHeight;
      side = Math.min(W, H);
      if (!side || !img.width) return;

      canvas.width = Math.round(side * dpr);
      canvas.height = Math.round(side * dpr);
      // centre the square inside the (possibly wider) host box
      canvas.style.width = `${side}px`;
      canvas.style.height = `${side}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { pitch } = cfgRef.current;
      const cols = Math.max(8, Math.round(side / pitch));
      const cell = side / cols;

      // Downsample the photo to one pixel per cell: the browser averages each
      // patch for us, so reading these pixels is reading cell-average colour.
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = cols;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      // cover-fit the square crop of the source
      const s = Math.min(img.width, img.height);
      const sx = (img.width - s) / 2;
      const sy = (img.height - s) / 2;
      octx.drawImage(img, sx, sy, s, s, 0, 0, cols, cols);
      const data = octx.getImageData(0, 0, cols, cols).data;

      const at = (i: number, j: number) => {
        const o = (j * cols + i) * 4;
        return { r: data[o], g: data[o + 1], b: data[o + 2] };
      };
      const dist = (
        a: { r: number; g: number; b: number },
        b: { r: number; g: number; b: number },
      ) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);

      // Background reference from the TOP REGION only: the top row plus the
      // upper 40% of the side columns. The full border ring cannot be trusted
      // because the subject's shoulders/shirt reach the bottom edge, which would
      // poison the estimate with dark pixels. The area above the shoulders and
      // beside the head is reliably backdrop in a portrait.
      const samples: { r: number; g: number; b: number }[] = [];
      const upper = Math.max(1, Math.floor(cols * 0.4));
      for (let i = 0; i < cols; i++) samples.push(at(i, 0));
      for (let j = 1; j < upper; j++) samples.push(at(0, j), at(cols - 1, j));
      const bg = samples.reduce(
        (a, c) => ({
          r: a.r + c.r / samples.length,
          g: a.g + c.g / samples.length,
          b: a.b + c.b / samples.length,
        }),
        { r: 0, g: 0, b: 0 },
      );

      // Farthest cell from bg, to normalise the tonal range.
      let maxD = 1;
      for (let j = 0; j < cols; j++)
        for (let i = 0; i < cols; i++)
          maxD = Math.max(maxD, dist(at(i, j), bg));

      const { maxDotR, cutout } = cfgRef.current;
      // Everything within `cutout` of the tonal range counts as background. A
      // slider, not a constant: a vignetted backdrop and a flat one want
      // different cuts, and it is the dial between a floating face and a fuller
      // particle field, which is a taste call for Giacomo.
      const bgCut = maxD * cutout;
      const gamma = 0.72; // lift mid-contrast so the face is not only its darkest parts
      const span = Math.max(1, maxD - bgCut);
      const next: P[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < cols; i++) {
          const d = dist(at(i, j), bg);
          if (d <= bgCut) continue;
          const t = Math.pow((d - bgCut) / span, gamma);
          const r = t * maxDotR;
          // No minimum-radius floor: a floor draws the backdrop as a full field
          // of tiny dots instead of letting the subject float. Cells too faint
          // to earn a real dot are dropped entirely.
          if (r < 0.5) continue;
          const hx = (i + 0.5) * cell;
          const hy = (j + 0.5) * cell;
          next.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, r });
        }
      }
      particles = next;
      host.dataset.ready = "true";
    }

    function draw() {
      ctx.clearRect(0, 0, side, side);
      ctx.fillStyle = ink;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const K = 0.055; // spring stiffness toward home
    const DAMP = 0.82; // velocity retained per frame

    function step() {
      const { repelRadius: R, repelStrength: S } = cfgRef.current;
      const R2 = R * R;
      let moving = false;
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * S;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        // spring home
        p.vx += (p.hx - p.x) * K;
        p.vy += (p.hy - p.y) * K;
        p.vx *= DAMP;
        p.vy *= DAMP;
        p.x += p.vx;
        p.y += p.vy;
        if (
          Math.abs(p.vx) > 0.02 ||
          Math.abs(p.vy) > 0.02 ||
          Math.abs(p.x - p.hx) > 0.05 ||
          Math.abs(p.y - p.hy) > 0.05
        )
          moving = true;
      }
      draw();
      if (moving || pointer.active) {
        raf = requestAnimationFrame(step);
        running = true;
      } else {
        // snap the last sub-pixel residue and stop burning frames
        for (const p of particles) {
          p.x = p.hx;
          p.y = p.hy;
          p.vx = p.vy = 0;
        }
        draw();
        running = false;
        raf = 0;
      }
    }
    const wake = () => {
      if (!running && particles.length) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    /** Scatter every particle off its home, then let the springs reassemble it.
        The formation entrance and the reset-after-resize both reuse this. */
    function scatter() {
      for (const p of particles) {
        const a = ((p.hx + p.hy) % 6.283) + p.r; // deterministic-ish angle
        const spread = side * 0.55;
        p.x = p.hx + Math.cos(a * 3.1) * spread * (0.3 + (p.r % 1));
        p.y = p.hy + Math.sin(a * 2.3) * spread * (0.3 + (p.r % 1));
        p.vx = p.vy = 0;
      }
    }

    // ---- pointer interaction (mouse hover + touch drag/tap) ----
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      if (reduced()) return;
      toLocal(e);
      pointer.active = true;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced()) return;
      toLocal(e);
      pointer.active = true;
      // Touch has no hover, so a tap gives a one-off outward impulse and then
      // releases; the springs carry the rebound.
      if (e.pointerType === "touch") {
        const { repelRadius: R, repelStrength: S } = cfgRef.current;
        for (const p of particles) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy) || 0.01;
          if (d < R) {
            const f = (1 - d / R) * S * 3.2;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        pointer.active = false;
      }
      wake();
    };
    const onLeave = () => {
      pointer.active = false;
      wake(); // run until the springs settle, then it stops itself
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    // ---- lifecycle: gated build, entrance on first view, settle-and-stop ----
    let played = false;
    let visible = false;
    let lastSide = 0;

    const rebuild = (entrance: boolean) => {
      const W = host.clientWidth;
      const s = Math.min(W, host.clientHeight);
      if (!s) return;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
      build();
      if (!particles.length) return;
      if (reduced()) {
        draw();
        return;
      }
      if (entrance && visible) {
        scatter();
        played = true;
        wake();
      } else if (played) {
        draw();
      } else {
        // off screen still: leave it blank until first entry so nobody sees the
        // finished portrait before it assembles.
        ctx.clearRect(0, 0, side, side);
      }
    };

    img.onload = () => {
      lastSide = 0;
      rebuild(true);
    };
    img.onerror = () => {
      // The higher-res export may not be in place yet; fall back to the avatar.
      if (img.src.indexOf("avatar-384") === -1) img.src = "/avatar-384.jpg";
    };
    img.src = cfgRef.current.src;

    const ro = new ResizeObserver(() => {
      const s = Math.min(host.clientWidth, host.clientHeight);
      if (!s || s === lastSide) return;
      lastSide = s;
      rebuild(false); // a resize is not an entrance
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible && !played && particles.length && !reduced()) {
            scatter();
            played = true;
            wake();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(host);

    const repaint = () => {
      refreshInk();
      if (!running) draw();
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
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      canvas.remove();
      delete host.dataset.ready;
    };
    // Rebuilt only when the SOURCE changes; live tuning reads cfgRef so the
    // field is not town down on every slider nudge. pitch/maxDotR need a
    // rebuild, handled by the caller keying the component on them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="face-field" ref={hostRef} />;
}
