/**
 * graph.mjs — build-time module-graph generator.
 *
 * Walks src (ts, tsx, css) and scripts, reads each file's static imports,
 * and writes the resulting dependency graph to src/lib/graph.json.
 * The JSON is committed, so /lab/architecture always has data even without
 * running this script; `npm run build` regenerates it via `prebuild`.
 *
 * What it handles (regex over source text, not a full AST):
 *   - `import x from "spec"`, `import { a, b } from "spec"`,
 *     `import * as ns from "spec"`, `import type { T } from "spec"`
 *   - side-effect imports: `import "spec"`
 *   - re-exports: `export { a } from "spec"`, `export * from "spec"`
 *   - dynamic imports with a string literal: `import("spec")` — which covers
 *     `next/dynamic` and lazy `await import(...)` calls
 *   - CSS `@import "spec"`
 *
 * What it does NOT handle (documented limitation, acceptable for this site):
 *   - `require()` calls (none in this codebase)
 *   - computed import specifiers: `import(someVariable)`
 *   - imports inside template literals or strings (comments ARE stripped
 *     first, but a quoted string containing `import "x" from "y"` would
 *     false-positive; none exist here)
 *   - tsconfig path aliases other than `@/*` → `src/*`
 *   - package.json `exports` maps — bare specifiers are recorded verbatim
 *     (`next/font/google` stays `next/font/google`; it is not collapsed
 *     to `next`, deliberately, because the subpaths are real distinct
 *     capabilities)
 *
 * Determinism: nodes sorted by id, edges sorted by (from, to), no timestamp
 * (the brief allows omitting `generatedAt` to avoid a diff that churns on
 * every build — the git history of this file is its timestamp).
 */

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src", "lib", "graph.json");

const WALK_ROOTS = ["src", "scripts"];
const CODE_EXT = /\.(ts|tsx|mjs|js|css)$/;
const RESOLVE_EXTS = [".ts", ".tsx", ".mjs", ".js", ".css", ".json"];

/* Recursively collect source files, posix-style paths relative to ROOT. */
function walk(dir, files = []) {
  for (const entry of readdirSync(dir).sort()) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, files);
    else if (CODE_EXT.test(entry)) files.push(toPosix(relative(ROOT, abs)));
  }
  return files;
}

function toPosix(p) {
  return p.split(sep).join("/");
}

/** Strip // line comments and block comments so commented-out imports don't count. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[ \t]*\/\/.*$/gm, "");
}

/** Extract every import specifier from a file's text. */
function specifiers(src, isCss) {
  const out = [];
  if (isCss) {
    for (const m of src.matchAll(/@import\s+(?:url\()?["']([^"']+)["']\)?/g)) out.push(m[1]);
    return out;
  }
  const patterns = [
    /\bimport\s+[\w${},*\s]+?\s+from\s+["']([^"']+)["']/g, // default and named
    /\bimport\s+["']([^"']+)["']/g, //                        side-effect
    /\bexport\s+(?:\*|\{[^}]*\})\s+from\s+["']([^"']+)["']/g, // re-export
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g, //              dynamic
  ];
  for (const re of patterns) for (const m of src.matchAll(re)) out.push(m[1]);
  return out;
}

/** Resolve a specifier from `fromFile` to a repo-relative path, or an external. */
function resolveSpec(spec, fromFile) {
  let base = null;
  if (spec.startsWith(".")) base = resolve(ROOT, dirname(fromFile), spec);
  else if (spec.startsWith("@/")) base = resolve(ROOT, "src", spec.slice(2));
  else return { external: spec };

  const candidates = [
    base,
    ...RESOLVE_EXTS.map((e) => base + e),
    ...RESOLVE_EXTS.map((e) => join(base, "index" + e)),
  ];
  for (const c of candidates) {
    if (existsSync(c) && statSync(c).isFile()) return { file: toPosix(relative(ROOT, c)) };
  }
  return null; // unresolvable relative import — skipped, not guessed
}

/** Classify a repo-relative path. */
function kindOf(path) {
  if (path.startsWith("scripts/")) return "script";
  if (path.endsWith(".css")) return "style";
  if (/^src\/app\/.*(page|layout)\.tsx$/.test(path)) return "route";
  if (path.startsWith("src/components/")) return "component";
  return "lib"; // src/lib, src/data, resolved .json data files
}

// ---- build the graph ----

function locOf(abs) {
  return readFileSync(abs, "utf8").replace(/\n$/, "").split("\n").length;
}

function build() {
  const files = WALK_ROOTS.flatMap((r) => walk(join(ROOT, r)));
  const nodes = new Map(); // id -> node
  const edgeSet = new Set(); // "from to"

  const ensureNode = (id, kind, loc) => {
    if (!nodes.has(id)) nodes.set(id, { id, kind, loc, imports: 0, importedBy: 0 });
    return nodes.get(id);
  };

  for (const file of files) {
    const raw = readFileSync(join(ROOT, file), "utf8");
    ensureNode(file, kindOf(file), raw.replace(/\n$/, "").split("\n").length);
    const isCss = file.endsWith(".css");
    for (const spec of specifiers(stripComments(raw), isCss)) {
      const hit = resolveSpec(spec, file);
      if (!hit) continue;
      let to;
      if (hit.external) {
        to = hit.external;
        ensureNode(to, "external", 0);
      } else {
        to = hit.file;
        ensureNode(to, kindOf(to), locOf(join(ROOT, to)));
      }
      if (to !== file) edgeSet.add(`${file} ${to}`);
    }
  }

  const edges = [...edgeSet]
    .map((k) => {
      const [from, to] = k.split(" ");
      return { from, to };
    })
    .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));

  for (const e of edges) {
    nodes.get(e.from).imports += 1;
    nodes.get(e.to).importedBy += 1;
  }

  /* Labels are basenames, except page/layout files, which are ambiguous
     alone - those keep their parent directory ("lab/page.tsx"). */
  const labelOf = (n) => {
    if (n.kind === "external") return n.id;
    const parts = n.id.split("/");
    const base = parts.pop();
    return /^(page|layout)\.tsx$/.test(base) ? `${parts.pop()}/${base}` : base;
  };

  const sorted = [...nodes.values()]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((n) => ({
      id: n.id,
      label: labelOf(n),
      kind: n.kind,
      loc: n.loc,
      imports: n.imports,
      importedBy: n.importedBy,
    }));

  const internals = sorted.filter((n) => n.kind !== "external");
  return {
    nodes: sorted,
    edges,
    stats: {
      files: internals.length,
      edges: edges.length,
      loc: internals.reduce((s, n) => s + n.loc, 0),
      externals: sorted.length - internals.length,
    },
  };
}

/* graph.json is itself a node in the graph (the architecture page imports
   it), so its own line count feeds back into its own content. Iterate to the
   fixpoint - in practice one extra pass - so a single run is always stable. */
let graph = build();
for (let pass = 0; pass < 4; pass++) {
  const next = JSON.stringify(graph, null, 2) + "\n";
  const prev = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  writeFileSync(OUT, next);
  if (next === prev) break;
  graph = build();
}

console.log(
  `graph.json - ${graph.stats.files} files, ${graph.stats.edges} edges, ` +
    `${graph.stats.loc} loc, ${graph.stats.externals} externals`,
);
