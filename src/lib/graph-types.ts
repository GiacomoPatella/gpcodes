/**
 * Types for the module graph emitted by scripts/graph.mjs into
 * src/lib/graph.json. The JSON is the source of truth; these types just
 * describe its shape to the /lab/architecture page.
 */

export type NodeKind =
  | "route"
  | "component"
  | "lib"
  | "style"
  | "script"
  | "external";

export type GraphNode = {
  id: string;
  label: string;
  kind: NodeKind;
  loc: number;
  imports: number;
  importedBy: number;
};

export type GraphEdge = {
  from: string;
  to: string;
};

export type GraphStats = {
  files: number;
  edges: number;
  loc: number;
  externals: number;
};

export type Graph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: GraphStats;
};
