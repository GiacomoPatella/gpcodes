"use client";

import { useEffect, useRef } from "react";

/**
 * The interactive halftone face for hero prototype v2.
 *
 * A portrait sampled into a dot field, built in two stages per cell: distance
 * from the backdrop colour decides whether a cell is part of the subject at
 * all (the float, the clean silhouette), then luminance inside that mask
 * decides the dot's size (the likeness). Distance-from-background alone
 * flattens internal shading, eye sockets, the underside of the brow, the
 * corners of the mouth, into one another, which is exactly what makes a
 * halftone read as a specific person rather than a generic silhouette. The
 * cursor pushes particles aside; a damped spring pulls each back to its home
 * cell. The entrance is a different effect on purpose: dots sit at their home
 * cell throughout, no travel and no rotation, and a white flash over the top
 * quickly fades away to reveal them, like a photo just taken. It settles and
 * STOPS when undisturbed, the same discipline as
 * ParticleWordmark: a permanently running RAF in the hero is exactly how "not
 * laggy" gets broken.
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
  /** largest dot radius in CSS px (darkest cells within the subject) */
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

/** Giacomo's tuned settings from live testing, 8 Aug 2026 (see docs/STATE.md).
 *  The single source of truth for both the homepage hero and the /palette/face
 *  tuning harness, so the two can never quietly drift apart. */
export const FACE_DEFAULTS: FaceConfig = {
  src: "/face-source.jpg",
  pitch: 4,
  repelRadius: 95,
  repelStrength: 2.4,
  maxDotR: 4,
  cutout: 0.05,
  color: "ink",
};

/**
 * Every field individually defaulted via destructuring, not a single
 * `cfg: FaceConfig = FACE_DEFAULTS` parameter default: page.tsx (a Server
 * Component) renders this with no props at all, because a plain data value
 * imported from a "use client" module does not survive the server-to-client
 * boundary as real data (it resolves to a client-reference marker, so every
 * field came through undefined, cols went NaN, and getImageData threw).
 * Resolving defaults inside the client module itself needs nothing to cross
 * that boundary. A single whole-object default, or even an optional
 * `cfgProp?: FaceConfig` resolved with `??`, both LOOK like they should let
 * `<FaceField />` type-check, but neither does: JSX with no attributes
 * produces a props type of `{}`, and TypeScript checks `{}` against the
 * parameter's own annotated type (`FaceConfig`, or `FaceConfig | undefined`)
 * rather than accounting for what the default resolves to at runtime; `{}`
 * satisfies neither. `Partial<FaceConfig> = {}` is what actually
 * type-checks, since `{}` is trivially a valid `Partial`. /palette/face still
 * passes a full `FaceConfig` via `{...cfg}`, itself a valid `Partial`.
 */
export default function FaceField({
  src = FACE_DEFAULTS.src,
  pitch = FACE_DEFAULTS.pitch,
  repelRadius = FACE_DEFAULTS.repelRadius,
  repelStrength = FACE_DEFAULTS.repelStrength,
  maxDotR = FACE_DEFAULTS.maxDotR,
  cutout = FACE_DEFAULTS.cutout,
  color = FACE_DEFAULTS.color,
}: Partial<FaceConfig> = {}) {
  const cfg: FaceConfig = {
    src,
    pitch,
    repelRadius,
    repelStrength,
    maxDotR,
    cutout,
    color,
  };
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
      ox: number; oy: number; // small starting offset from home for the entrance pop-in
      delay: number;          // ms this particle waits before it starts appearing
      r: number;              // dot radius
    };
    let particles: P[] = [];
    let raf = 0;
    let running = false;
    let side = 0; // css px, square

    const pointer = { x: -1e4, y: -1e4, active: false };

    // Formation entrance: no rotation, no big travel, but not a single flat
    // fade either. Each dot pops in on its own clock: a short fade-in plus a
    // few-pixel settle from a small starting offset, staggered outward from
    // the centre so the reveal has visible texture instead of the whole
    // image just materialising at once. A brief white flash rides on top for
    // the "photo just taken" feel.
    let entranceActive = false;
    let entranceT0: number | null = null;
    const FLASH_DURATION = 240;  // the white overlay's own fade-out
    const POP_DURATION = 260;    // each dot's own fade + settle, once its delay elapses
    const POP_STAGGER = 300;     // max extra delay for the farthest-from-centre dot
    const POP_SHIFT = 8;         // css px each dot starts offset from its home cell
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // Auto "demo swipe": once per mount, a beat after the entrance settles, a
    // synthetic cursor sweeps through the field using the SAME repel/spring
    // code path as a real pointer, so it teaches "this responds to you"
    // rather than playing a separate canned effect. Cancels the instant a
    // real pointer shows up, so it never fights genuine interaction, and
    // never runs at all under reduced motion.
    let userInteracted = false;
    let demoPending = false;
    let demoTimer = 0;
    const demo = {
      active: false,
      t0: null as number | null,
      duration: 1100,
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
    };
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const startDemo = () => {
      demo.active = true;
      demo.t0 = null;
      demo.from = { x: -side * 0.12, y: side * 0.5 };
      demo.to = { x: side * 1.12, y: side * 0.46 };
    };

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
      const luminance = (c: { r: number; g: number; b: number }) =>
        0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

      // Border samples from the TOP REGION only: the top row plus the upper
      // 40% of the side columns. The full border ring cannot be trusted
      // because the subject's shoulders/shirt reach the bottom edge, which
      // would poison the estimate with dark pixels. The area above the
      // shoulders and beside the head is reliably backdrop in a portrait.
      const border: { i: number; j: number; c: { r: number; g: number; b: number } }[] = [];
      const upper = Math.max(1, Math.floor(cols * 0.4));
      for (let i = 0; i < cols; i++) border.push({ i, j: 0, c: at(i, 0) });
      for (let j = 1; j < upper; j++) {
        border.push({ i: 0, j, c: at(0, j) });
        border.push({ i: cols - 1, j, c: at(cols - 1, j) });
      }

      // The backdrop is not flat, it is vignetted: it darkens with distance
      // from the frame's centre. A single flat average reads the far corners
      // as "different from the background" purely because of that falloff,
      // not because anything is actually there, which is exactly what
      // produced floating halo blobs at a low cutout, they are genuinely
      // connected to the subject through the wide shoulder/shirt band at the
      // bottom of the frame, not a thin seam an erosion pass could sever.
      // Fit each channel as a PLANE over (i, j), not just a function of
      // radius from centre, using the same trusted border samples, so every
      // cell is judged against its own expected local background. A radius-
      // only fit assumes the backdrop is symmetric, but this one is not: the
      // right side measures consistently brighter than the left at matching
      // radius (row 15 of the border sample: left channel-average 134 vs
      // right 137), a directional gradient, angled light on the backdrop,
      // that a radial model averages away and then under-predicts on the
      // brighter side, which is exactly what produced a lingering fringe
      // skewed to the right rather than an even ring.
      const cx = (cols - 1) / 2;
      const cy = (cols - 1) / 2;
      const fitPlane = (get: (c: { r: number; g: number; b: number }) => number) => {
        let n = 0;
        let sx = 0;
        let sy = 0;
        let sxx = 0;
        let syy = 0;
        let sxy = 0;
        let sc = 0;
        let sxc = 0;
        let syc = 0;
        for (const s of border) {
          const x = s.i - cx;
          const y = s.j - cy;
          const c = get(s.c);
          n++;
          sx += x;
          sy += y;
          sxx += x * x;
          syy += y * y;
          sxy += x * y;
          sc += c;
          sxc += x * c;
          syc += y * c;
        }
        // Normal equations for least-squares c ~= a + bx*x + by*y, solved by
        // Cramer's rule on the 3x3 system.
        const M = [
          [n, sx, sy],
          [sx, sxx, sxy],
          [sy, sxy, syy],
        ];
        const v = [sc, sxc, syc];
        const det3 = (m: number[][]) =>
          m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
          m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
          m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
        const D = det3(M);
        if (Math.abs(D) < 1e-6) return { a: sc / n, bx: 0, by: 0 };
        const withCol = (col: number) =>
          M.map((row, ri) => row.map((val, ci) => (ci === col ? v[ri] : val)));
        return {
          a: det3(withCol(0)) / D,
          bx: det3(withCol(1)) / D,
          by: det3(withCol(2)) / D,
        };
      };
      const fitR = fitPlane((c) => c.r);
      const fitG = fitPlane((c) => c.g);
      const fitB = fitPlane((c) => c.b);
      // Clamp to a valid channel range: the fit is only trustworthy inside
      // the region the border samples actually cover, and extrapolating it
      // toward the centre (where the face sits) or past a corner can send a
      // channel far outside 0..255, manufacturing a huge synthetic distance
      // for a cell that never earned one.
      const clamp255 = (v: number) => Math.min(255, Math.max(0, v));
      const bgAt = (i: number, j: number) => {
        const x = i - cx;
        const y = j - cy;
        return {
          r: clamp255(fitR.a + fitR.bx * x + fitR.by * y),
          g: clamp255(fitG.a + fitG.bx * x + fitG.by * y),
          b: clamp255(fitB.a + fitB.bx * x + fitB.by * y),
        };
      };

      // Farthest cell from its local background, to normalise the
      // SEGMENTATION range only: this decides which cells are the subject.
      // It says nothing about dot size. A 99th-percentile, not a literal
      // max: one leftover bad-fit outlier at an extreme corner would
      // otherwise blow the whole range open and swallow the entire face as
      // "background", which is exactly what the unclamped version did at the
      // default settings.
      const allDist: number[] = [];
      for (let j = 0; j < cols; j++)
        for (let i = 0; i < cols; i++)
          allDist.push(dist(at(i, j), bgAt(i, j)));
      allDist.sort((a, b) => a - b);
      const maxD = Math.max(
        1,
        allDist[Math.floor(allDist.length * 0.99)],
      );

      const { maxDotR, cutout } = cfgRef.current;
      // Everything within `cutout` of the tonal range counts as background. A
      // slider, not a constant: a vignetted backdrop and a flat one want
      // different cuts, and it is the dial between a floating face and a fuller
      // particle field, which is a taste call for Giacomo.
      const bgCut = maxD * cutout;

      // Which cells clear bgCut. Earlier drafts tried to clean this up with
      // a morphological opening (erode away thin bridges to background
      // noise, keep the largest surviving blob, dilate it back out). That
      // fought the wrong problem: a face is porous (eyes, nostrils,
      // highlights all read as background-ish), so erosion fragmented the
      // head into pieces too small to survive while the solid shirt/
      // shoulders stayed intact, and "largest surviving blob" picked the
      // shoulders and threw the entire face away. The radial background
      // model below already removes the actual cause of stray background
      // noise (a vignette misread as subject), so no cleanup pass is needed
      // on top of it.
      const N = cols * cols;
      const subject = new Uint8Array(N);
      for (let j = 0; j < cols; j++)
        for (let i = 0; i < cols; i++)
          if (dist(at(i, j), bgAt(i, j)) > bgCut) subject[j * cols + i] = 1;

      // Two-stage map. Stage 1 (above) decided membership; stage 2 decides
      // size. Distance-from-bg cuts a clean silhouette but flattens what is
      // INSIDE it: an eye socket and a cheek can sit at similar distance from
      // a light backdrop and would earn near-identical dots, which is why the
      // one-stage version produced a floating outline with no face inside it.
      // Luminance inside the mask is what actually carries shading, so it
      // drives size instead. This first pass finds the subject cells and the
      // luminance range among only those cells, not the whole frame, so a
      // dark backdrop or a bright shirt never skews the stretch.
      const inside: { i: number; j: number; l: number }[] = [];
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < cols; i++) {
          if (!subject[j * cols + i]) continue;
          inside.push({ i, j, l: luminance(at(i, j)) });
        }
      }

      // Percentile clip, not true min/max: one specular highlight (an eye
      // catchlight, a tooth in an open-mouth smile) or one deep shadow
      // crevice would otherwise anchor an end of the range and drag every
      // ordinary midtone cell toward it.
      const byL = [...inside].sort((a, b) => a.l - b.l);
      const pct = (p: number) =>
        byL[Math.min(byL.length - 1, Math.floor(byL.length * p))]?.l ?? 0;
      const lMin = pct(0.03);
      const lMax = pct(0.97);
      const lSpan = Math.max(1, lMax - lMin);

      // gamma > 1 pushes ordinary midtone skin toward SMALL dots and saves
      // large ones for what is actually dark: eyebrows, eye sockets, nostril
      // shadow, beard. A gamma below 1 (tried first) does the reverse: it
      // compresses light-to-mid tones toward the large-dot end together,
      // which is why that pass rendered as one dark mass with no shape in
      // it rather than separating skin from the features sitting on it.
      const gamma = 1.9;
      // Small floor rather than zero: a hard cutoff at the bright end would
      // erase forehead/cheek highlights instead of drawing them as small
      // dots, which reads as literal holes punched in the face.
      const minT = 0.08;
      const next: P[] = [];
      for (const { i, j, l } of inside) {
        // Darker cell -> bigger dot, the way an ink halftone puts more
        // coverage where the source is darker. Inside the mask that darkness
        // IS the shading, sockets, nostrils, the underside of the brow, that
        // reads as a specific face rather than how far the patch sits from
        // the backdrop.
        const norm = Math.min(1, Math.max(0, (lMax - l) / lSpan));
        const t = minT + (1 - minT) * Math.pow(norm, gamma);
        const r = t * maxDotR;
        if (r < 0.35) continue;
        const hx = (i + 0.5) * cell;
        const hy = (j + 0.5) * cell;
        next.push({ hx, hy, x: hx, y: hy, vx: 0, vy: 0, ox: 0, oy: 0, delay: 0, r });
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

    /** Per-particle small offset + stagger delay for the entrance pop-in. */
    function primeEntrance() {
      const cx = side / 2;
      const cy = side / 2;
      const maxR = Math.hypot(side, side) / 2; // centre-to-corner, for delay normalisation
      for (const p of particles) {
        const a = ((p.hx + p.hy) % 6.283) + p.r; // deterministic-ish angle
        const mag = POP_SHIFT * (0.5 + (p.r % 1) * 0.5);
        p.ox = Math.cos(a * 3.1) * mag;
        p.oy = Math.sin(a * 2.3) * mag;
        const distFromCentre = Math.hypot(p.hx - cx, p.hy - cy);
        p.delay = (distFromCentre / maxR) * POP_STAGGER;
      }
    }

    const K = 0.055; // spring stiffness toward home
    const DAMP = 0.82; // velocity retained per frame

    function step(now: number) {
      if (entranceActive) {
        if (entranceT0 === null) entranceT0 = now;
        const elapsed = now - entranceT0;
        const flashAlpha = 1 - easeOutCubic(Math.min(1, elapsed / FLASH_DURATION));
        let allDone = true;
        ctx.clearRect(0, 0, side, side);
        ctx.fillStyle = ink;
        for (const p of particles) {
          const t = Math.min(1, Math.max(0, (elapsed - p.delay) / POP_DURATION));
          if (t < 1) allDone = false;
          const e = easeOutCubic(t);
          const rf = 1 - e; // remaining fraction of this particle's starting offset
          ctx.globalAlpha = e;
          ctx.beginPath();
          ctx.arc(p.hx + p.ox * rf, p.hy + p.oy * rf, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (flashAlpha > 0) {
          ctx.fillStyle = "#fff";
          ctx.globalAlpha = flashAlpha;
          ctx.fillRect(0, 0, side, side);
          ctx.globalAlpha = 1;
        }
        if (allDone && flashAlpha <= 0) {
          entranceActive = false;
          running = false;
          raf = 0;
          if (demoPending && !userInteracted) {
            demoPending = false;
            demoTimer = window.setTimeout(() => {
              if (userInteracted || reduced()) return;
              startDemo();
              wake();
            }, 450);
          }
          return;
        }
        raf = requestAnimationFrame(step);
        running = true;
        return;
      }
      if (demo.active) {
        if (demo.t0 === null) demo.t0 = now;
        const t = Math.min(1, (now - demo.t0) / demo.duration);
        const e = easeInOutCubic(t);
        pointer.x = demo.from.x + (demo.to.x - demo.from.x) * e;
        pointer.y = demo.from.y + (demo.to.y - demo.from.y) * e;
        pointer.active = true;
        if (t >= 1) {
          demo.active = false;
          pointer.active = false;
        }
      }
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
      if (moving || pointer.active || demo.active) {
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
        // First settle after the entrance: queue the demo sweep for a beat
        // later, as its own wake cycle, so the RAF loop still fully stops in
        // between rather than idling through the pause.
        if (demoPending && !userInteracted) {
          demoPending = false;
          demoTimer = window.setTimeout(() => {
            if (userInteracted || reduced()) return;
            startDemo();
            wake();
          }, 450);
        }
      }
    }
    const wake = () => {
      if (!running && particles.length) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    // ---- pointer interaction (mouse hover + touch drag/tap) ----
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      if (reduced()) return;
      userInteracted = true;
      demo.active = false;
      entranceActive = false;
      toLocal(e);
      pointer.active = true;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced()) return;
      userInteracted = true;
      demo.active = false;
      entranceActive = false;
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
        primeEntrance();
        played = true;
        demoPending = true;
        entranceActive = true;
        entranceT0 = null;
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
            primeEntrance();
            played = true;
            demoPending = true;
            entranceActive = true;
            entranceT0 = null;
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
      if (demoTimer) clearTimeout(demoTimer);
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
  }, []);

  return <div className="face-field" ref={hostRef} />;
}
