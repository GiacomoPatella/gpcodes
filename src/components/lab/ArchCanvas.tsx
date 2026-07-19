"use client";

/**
 * The canvas for /lab/architecture, drawn with the raw Canvas 2D API.
 * (This used to be p5. p5 2.x's pointer events never fired here, so the DOM
 * already owned all interaction; p5 was doing only the render loop, for a
 * 1.3 MB route chunk. The 2D context does the same job for free, so the
 * drawing below is a direct port: same simulation, same marks, same frames.)
 * Everything it draws comes from graph.json: no decoration that isn't data.
 *
 * Visual language: hairline edges in the site's line colour, node marks in
 * ink, mono labels in muted. The accent appears only under interaction
 * (hover/pin highlight of a node and its direct edges). Kind is encoded by
 * mark shape, not colour: ● route, ○ component, □ lib, ◇ style, △ script,
 * · external. All colours are read live from the CSS custom properties on
 * the DOM, so the map follows the theme toggle and the /palette accent
 * picker without a reload.
 */

import { useEffect, useRef, useState } from "react";
import type { GraphEdge, GraphNode } from "@/lib/graph-types";

type RGB = [number, number, number];

type Tokens = {
  ink: RGB;
  muted: RGB;
  line: RGB;
  lineStrong: RGB;
  surface: RGB;
  accent: RGB;
  mono: string;
};

type SimNode = {
  n: GraphNode;
  r: number;
  x: number;
  y: number;
};

type Focus = { node: GraphNode; pinned: boolean } | null;

/* Deterministic per-node seeding so the initial arrangement (and therefore
   the settled one) is the same on every load. */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Node radius. Internal files are sized by lines of code (area ∝ loc via a
   square root), because import counts here only span 0–6 and would render
   near-uniform; LOC actually shows where the mass of the site sits.
   Externals are sized by how many files lean on them. */
function radiusOf(n: GraphNode): number {
  if (n.kind === "external") return 2.5 + 1.1 * Math.sqrt(n.importedBy);
  return Math.min(4 + 0.42 * Math.sqrt(n.loc), 21);
}

/* Resolve CSS custom properties to concrete rgb triplets by computing them on
   a probe element, then normalising through a 1×1 canvas, because computed colours
   can come back as rgb(), color(srgb …) or oklch() depending on the token. */
function readTokens(host: HTMLElement): Tokens {
  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  host.appendChild(probe);
  const ctx = document.createElement("canvas").getContext("2d", {
    willReadFrequently: true,
  })!;
  const grab = (token: string): RGB => {
    probe.style.color = "";
    probe.style.color = `var(${token})`;
    ctx.fillStyle = "#ff00ff";
    ctx.fillStyle = getComputedStyle(probe).color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  probe.style.fontFamily = "var(--font-mono)";
  /* The computed stack is already concrete family names, usable verbatim
     in a canvas font string. */
  const mono = getComputedStyle(probe).fontFamily;
  const tokens: Tokens = {
    ink: grab("--ink"),
    muted: grab("--muted"),
    line: grab("--line"),
    lineStrong: grab("--line-strong"),
    surface: grab("--surface"),
    accent: grab("--accent-ink"),
    mono,
  };
  probe.remove();
  return tokens;
}

const LEGEND: { kind: string; mark: React.ReactNode }[] = [
  { kind: "route", mark: <circle cx="7" cy="7" r="4" fill="currentColor" /> },
  {
    kind: "component",
    mark: <circle cx="7" cy="7" r="4" fill="none" stroke="currentColor" />,
  },
  {
    kind: "lib",
    mark: (
      <rect x="3.5" y="3.5" width="7" height="7" fill="none" stroke="currentColor" />
    ),
  },
  {
    kind: "style",
    mark: (
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        fill="none"
        stroke="currentColor"
        transform="rotate(45 7 7)"
      />
    ),
  },
  {
    kind: "script",
    mark: (
      <polygon points="7,2.8 11,10.6 3,10.6" fill="none" stroke="currentColor" />
    ),
  },
  {
    kind: "external",
    mark: <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.55" />,
  },
];

export default function ArchCanvas({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<Focus>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const teardown: (() => void)[] = [];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tokens = { current: readTokens(host) };

    /* ---- graph state, index-aligned with `nodes` ---- */
    const index = new Map(nodes.map((n, i) => [n.id, i]));
    const links: [number, number][] = [];
    for (const e of edges) {
      const a = index.get(e.from);
      const b = index.get(e.to);
      if (a !== undefined && b !== undefined) links.push([a, b]);
    }
    const neighbors: Set<number>[] = nodes.map(() => new Set());
    for (const [a, b] of links) {
      neighbors[a].add(b);
      neighbors[b].add(a);
    }

    let W = Math.max(host.clientWidth, 320);
    let H = Math.max(host.clientHeight, 360);

    const sim: SimNode[] = nodes.map((n) => {
      const rand = mulberry32(hash(n.id));
      return {
        n,
        r: radiusOf(n),
        x: W * (0.18 + 0.64 * rand()),
        y: H * (0.18 + 0.64 * rand()),
      };
    });
    /* Half-width of each node's label at ~10px mono (≈6.2px per glyph),
       used to keep side-by-side labels from colliding. */
    const labelHalf = sim.map((s) => (s.n.label.length * 6.2) / 2);

    let temperature = 1;
    let settled = false;
    let onScreen = true;
    let hovered: number | null = null;
    let pinned: number | null = null;

    /* One tick of a Fruchterman–Reingold-style layout: pairwise repulsion
       (plus extra padding push so labels keep breathing room), springs
       along edges, gentle pull to centre, cooling temperature. */
    const K = () => 0.52 * Math.sqrt((W * H) / sim.length);
    function tick(): number {
      const k = K();
      const disp = sim.map(() => [0, 0] as [number, number]);
      for (let i = 0; i < sim.length; i++) {
        for (let j = i + 1; j < sim.length; j++) {
          let dx = sim[i].x - sim[j].x;
          let dy = sim[i].y - sim[j].y;
          let d = Math.hypot(dx, dy);
          if (d < 0.01) {
            dx = ((i - j) % 3) * 0.1 + 0.05; // coincident: deterministic nudge
            dy = 0.05;
            d = Math.hypot(dx, dy);
          }
          /* Label-aware clearance: labels hang centred under the marks, so
             a pair needs more clearance horizontally than vertically. The
             pad check runs in a squashed metric where x is scaled by the
             ratio of the two clearances. */
          const padY = sim[i].r + sim[j].r + 30;
          const padX = sim[i].r + sim[j].r + labelHalf[i] + labelHalf[j] + 10;
          const ds = Math.hypot(dx * (padY / padX), dy);
          const f = (k * k) / d + (ds < padY ? ((padY - ds) * 1.6 * padX) / padY : 0);
          disp[i][0] += (dx / d) * f;
          disp[i][1] += (dy / d) * f;
          disp[j][0] -= (dx / d) * f;
          disp[j][1] -= (dy / d) * f;
        }
      }
      for (const [a, b] of links) {
        const dx = sim[a].x - sim[b].x;
        const dy = sim[a].y - sim[b].y;
        const d = Math.max(Math.hypot(dx, dy), 0.01);
        const f = (d * d) / k / 3;
        disp[a][0] -= (dx / d) * f;
        disp[a][1] -= (dy / d) * f;
        disp[b][0] += (dx / d) * f;
        disp[b][1] += (dy / d) * f;
      }
      const cap = 14 * temperature;
      let maxMove = 0;
      for (let i = 0; i < sim.length; i++) {
        disp[i][0] += (W / 2 - sim[i].x) * 0.02;
        disp[i][1] += (H / 2 - sim[i].y) * 0.03;
        const d = Math.hypot(disp[i][0], disp[i][1]);
        const step = Math.min(d * 0.08, cap);
        if (d > 0.01) {
          sim[i].x += (disp[i][0] / d) * step;
          sim[i].y += (disp[i][1] / d) * step;
        }
        /* margins leave room for the centred labels under each node */
        sim[i].x = Math.min(W - 60, Math.max(60, sim[i].x));
        sim[i].y = Math.min(H - 44, Math.max(30, sim[i].y));
        maxMove = Math.max(maxMove, step);
      }
      temperature = Math.max(temperature * 0.97, 0.003);
      return maxMove;
    }

    function settle(iterations: number) {
      let calm = 0;
      for (let i = 0; i < iterations; i++) {
        if (tick() < 0.16) calm++;
        else calm = 0;
        if (calm > 12) break;
      }
      settled = true;
    }

    /* ---- the canvas ---- */
    const canvas = document.createElement("canvas");
    host.appendChild(canvas);
    teardown.push(() => canvas.remove());
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function fitCanvas() {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    fitCanvas();

    const rgba = (c: RGB, a = 255) => `rgba(${c[0]},${c[1]},${c[2]},${a / 255})`;

    function mark(s: SimNode, focused: boolean, dimmed: boolean) {
      const t = tokens.current;
      const alpha = dimmed ? 64 : 255;
      const ink = rgba(t.ink, alpha);
      ctx.save();
      ctx.translate(s.x, s.y);
      if (focused) {
        ctx.strokeStyle = rgba(t.accent);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, s.r + 4.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      switch (s.n.kind) {
        case "route":
          ctx.fillStyle = ink;
          ctx.beginPath();
          ctx.arc(0, 0, s.r, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "component":
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1.25;
          ctx.fillStyle = rgba(t.surface, alpha);
          ctx.beginPath();
          ctx.arc(0, 0, s.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case "lib":
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1.25;
          ctx.fillStyle = rgba(t.surface, alpha);
          ctx.beginPath();
          ctx.rect(-s.r * 0.9, -s.r * 0.9, s.r * 1.8, s.r * 1.8);
          ctx.fill();
          ctx.stroke();
          break;
        case "style":
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1.25;
          ctx.fillStyle = rgba(t.surface, alpha);
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.rect(-s.r * 0.8, -s.r * 0.8, s.r * 1.6, s.r * 1.6);
          ctx.fill();
          ctx.stroke();
          break;
        case "script":
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1.25;
          ctx.fillStyle = rgba(t.surface, alpha);
          ctx.beginPath();
          ctx.moveTo(0, -s.r);
          ctx.lineTo(s.r * 0.95, s.r * 0.75);
          ctx.lineTo(-s.r * 0.95, s.r * 0.75);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case "external":
          ctx.fillStyle = rgba(t.muted, dimmed ? 50 : 150);
          ctx.beginPath();
          ctx.arc(0, 0, s.r, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      ctx.restore();
    }

    function line(x1: number, y1: number, x2: number, y2: number) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function render() {
      const t = tokens.current;
      ctx.clearRect(0, 0, W, H);
      const focusIdx = pinned ?? hovered;
      const near = focusIdx !== null ? neighbors[focusIdx] : null;

      /* Edges: hairlines at rest. Accent (and an import-direction
         arrowhead) only for the focused node's direct edges. */
      ctx.lineWidth = 1;
      for (const [a, b] of links) {
        if (focusIdx !== null && (a === focusIdx || b === focusIdx)) continue;
        ctx.strokeStyle = rgba(t.line, focusIdx === null ? 255 : 90);
        line(sim[a].x, sim[a].y, sim[b].x, sim[b].y);
      }
      if (focusIdx !== null) {
        for (const [a, b] of links) {
          if (a !== focusIdx && b !== focusIdx) continue;
          const from = sim[a];
          const to = sim[b];
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const d = Math.max(Math.hypot(dx, dy), 0.01);
          const ux = dx / d;
          const uy = dy / d;
          ctx.strokeStyle = rgba(t.accent);
          line(from.x, from.y, to.x, to.y);
          const tipX = to.x - ux * (to.r + 5);
          const tipY = to.y - uy * (to.r + 5);
          line(tipX, tipY, tipX - ux * 5 - uy * 3, tipY - uy * 5 + ux * 3);
          line(tipX, tipY, tipX - ux * 5 + uy * 3, tipY - uy * 5 - ux * 3);
        }
      }

      for (let i = 0; i < sim.length; i++) {
        const dimmed = focusIdx !== null && i !== focusIdx && !near!.has(i);
        mark(sim[i], i === focusIdx, dimmed);
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      for (let i = 0; i < sim.length; i++) {
        const s = sim[i];
        const dimmed = focusIdx !== null && i !== focusIdx && !near!.has(i);
        const external = s.n.kind === "external";
        ctx.font = `${external ? 9 : 10}px ${t.mono}`;
        const base = i === focusIdx ? t.accent : t.muted;
        ctx.fillStyle = rgba(base, dimmed ? 64 : external ? 175 : 235);
        ctx.fillText(s.n.label, s.x, s.y + s.r + 5);
      }
    }

    /* ---- the render loop: run while settling, then stop dead ---- */
    let raf = 0;
    let looping = false;
    let calmFrames = 0;

    function frame() {
      raf = 0;
      if (!looping) return;
      if (!settled) {
        const moved = Math.max(tick(), tick());
        calmFrames = moved < 0.16 ? calmFrames + 1 : 0;
        if (calmFrames > 12) {
          settled = true;
          looping = false;
        }
      } else {
        looping = false;
      }
      render();
      if (looping) raf = requestAnimationFrame(frame);
    }

    function loop() {
      if (!looping) {
        looping = true;
        if (!raf) raf = requestAnimationFrame(frame);
      }
    }
    function noLoop() {
      looping = false;
    }
    function redraw() {
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          render();
        });
      }
    }
    teardown.push(() => {
      looping = false;
      if (raf) cancelAnimationFrame(raf);
    });

    if (reduced) {
      /* No animation: settle synchronously, paint the final layout
         immediately. Still fully interactive. */
      settle(700);
      render();
    } else {
      /* Pre-run so the first painted frame is already organised
         rather than scrambled. */
      for (let i = 0; i < 40; i++) tick();
      render();
      loop();
    }

    /* ---- interaction: hover, pin, cursor: DOM pointer events ---- */
    function hitAt(x: number, y: number): number | null {
      if (x < 0 || y < 0 || x > W || y > H) return null;
      let best: number | null = null;
      let bestD = Infinity;
      for (let i = 0; i < sim.length; i++) {
        const d = Math.hypot(sim[i].x - x, sim[i].y - y);
        if (d < sim[i].r + 7 && d < bestD) {
          best = i;
          bestD = d;
        }
      }
      return best;
    }

    function announce() {
      const f = pinned ?? hovered;
      setFocus(f === null ? null : { node: sim[f].n, pinned: pinned !== null });
    }

    const rel = (e: PointerEvent): [number, number] => {
      const r = host.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onMove = (e: PointerEvent) => {
      const [x, y] = rel(e);
      const h = hitAt(x, y);
      host.style.cursor = h === null ? "default" : "pointer";
      if (h !== hovered) {
        hovered = h;
        announce();
        if (settled) redraw();
      }
    };
    const onLeave = () => {
      host.style.cursor = "default";
      if (hovered !== null) {
        hovered = null;
        announce();
        if (settled) redraw();
      }
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = rel(e);
      const h = hitAt(x, y);
      pinned = h === null || h === pinned ? null : h;
      announce();
      if (settled) redraw();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    teardown.push(() => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    });

    /* Follow the theme toggle, system scheme and the /palette accent. All of these
       land as attribute/style changes or events on the document. */
    const refresh = () => {
      tokens.current = readTokens(host);
      if (settled && onScreen) redraw();
    };
    const mutations = new MutationObserver(refresh);
    mutations.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });
    teardown.push(() => mutations.disconnect());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", refresh);
    teardown.push(() => media.removeEventListener("change", refresh));
    window.addEventListener("accentchange", refresh);
    window.addEventListener("storage", refresh);
    teardown.push(() => {
      window.removeEventListener("accentchange", refresh);
      window.removeEventListener("storage", refresh);
    });
    /* Mono webfont may finish loading after first paint, so repaint labels. */
    document.fonts?.ready.then(refresh).catch(() => {});

    /* Idle when the canvas is off-screen or the tab is hidden. */
    const setOnScreen = (v: boolean) => {
      onScreen = v;
      if (!v) noLoop();
      else if (!settled && !reduced) loop();
      else redraw();
    };
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(host);
    teardown.push(() => io.disconnect());
    const onVisibility = () =>
      setOnScreen(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    teardown.push(() =>
      document.removeEventListener("visibilitychange", onVisibility),
    );

    const ro = new ResizeObserver(() => {
      const w = Math.max(host.clientWidth, 320);
      const h = Math.max(host.clientHeight, 360);
      if (Math.abs(w - W) > 1 || Math.abs(h - H) > 1) {
        const sx = w / W;
        const sy = h / H;
        W = w;
        H = h;
        fitCanvas();
        for (const s of sim) {
          s.x *= sx;
          s.y *= sy;
        }
        temperature = Math.max(temperature, 0.25);
        if (reduced || !onScreen) {
          settled = false;
          settle(220);
          redraw();
        } else {
          settled = false;
          calmFrames = 0;
          loop();
        }
      }
    });
    ro.observe(host);
    teardown.push(() => ro.disconnect());

    return () => {
      for (const fn of teardown.splice(0)) fn();
    };
  }, [nodes, edges]);

  return (
    <figure className="map-frame">
      <div className="map-top">
        <ul className="map-legend" aria-hidden="true">
          {LEGEND.map((l) => (
            <li key={l.kind}>
              <svg width="14" height="14" viewBox="0 0 14 14">
                {l.mark}
              </svg>
              {l.kind}
            </li>
          ))}
        </ul>
        <span className="map-hint" aria-hidden="true">
          hover · click to pin
        </span>
      </div>
      <div ref={hostRef} className="map-canvas" aria-hidden="true" />
      <figcaption className="map-status">
        {focus ? (
          <>
            <code>{focus.node.id}</code>
            <span className="map-status-fields">
              {focus.node.kind}
              {focus.node.kind !== "external" && <> · {focus.node.loc} loc</>}
              {" · imports → "}
              {focus.node.imports}
              {" · imported by ← "}
              {focus.node.importedBy}
              {focus.pinned && <span className="map-pin"> · pinned</span>}
            </span>
          </>
        ) : (
          <span className="map-status-idle">
            hover a node for its readout; click to pin it. Full data in the
            table below.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
