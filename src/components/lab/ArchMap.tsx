"use client";

/**
 * Client boundary for the architecture map. The canvas component is loaded
 * with `ssr: false`, so it stays out of the server render and other routes'
 * bundles. The static placeholder keeps the first paint deterministic —
 * same frame, same height, no layout shift when the canvas arrives.
 */

import dynamic from "next/dynamic";
import type { Graph } from "@/lib/graph-types";

const ArchCanvas = dynamic(() => import("./ArchCanvas"), {
  ssr: false,
  loading: () => (
    <figure className="map-frame">
      <div className="map-top">
        <span className="map-hint">loading canvas</span>
      </div>
      <div className="map-canvas" aria-hidden="true" />
      <figcaption className="map-status">
        <span className="map-status-idle">
          The interactive map needs JavaScript — the full data is in the table
          below.
        </span>
      </figcaption>
    </figure>
  ),
});

export default function ArchMap({ graph }: { graph: Graph }) {
  return <ArchCanvas nodes={graph.nodes} edges={graph.edges} />;
}
