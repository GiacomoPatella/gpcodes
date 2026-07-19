import type { Metadata } from "next";
import Link from "next/link";
import Menu from "@/components/Menu";
import ArchMap from "@/components/lab/ArchMap";
import graphJson from "@/lib/graph.json";
import type { Graph } from "@/lib/graph-types";

export const metadata: Metadata = {
  title: "Architecture map · gpcodes lab",
  description:
    "The real module graph of gpcodes.com, generated from its own source at build time and drawn as an interactive force-directed map.",
};

const graph = graphJson as Graph;

const fmt = (n: number) => n.toLocaleString("en-US");

export default function ArchitecturePage() {
  const internals = graph.nodes.filter((n) => n.kind !== "external");
  const externals = graph.nodes.filter((n) => n.kind === "external");

  return (
    <>
      <a className="skip-link" href="#main">
        skip to content
      </a>

      <Menu current="/lab/architecture" />

      <main id="main" className="container lab-page flex-1">
        <p className="mono-label">lab / architecture</p>
        <h1>This site, mapped from its own imports</h1>
        <p className="lede">
          This is the real module graph of the site you&rsquo;re reading. At
          build time a small Node script walks the source, reads every static
          import, and writes the result to a JSON file, which this page then
          draws. Nothing here is illustrative: the script, the data file and
          this page all appear in the graph, because they are part of the site
          they describe.
        </p>
        <p className="lede">
          It&rsquo;s a small graph, and that&rsquo;s honest: the whole site
          is {`${graph.stats.files} files`}. I&rsquo;d rather show you a sparse truth
          than a padded diagram. What it does show: almost everything hangs off
          two heavy files, and the pages share a very thin set of primitives.
        </p>

        <p className="map-stats" role="status">
          {fmt(graph.stats.files)} source files · {fmt(graph.stats.edges)}{" "}
          import edges · {fmt(graph.stats.loc)} lines ·{" "}
          {fmt(graph.stats.externals)} external packages
        </p>

        <ArchMap graph={graph} />

        <p className="map-note">
          Node area tracks lines of code (imports here only span 0–
          {Math.max(...graph.nodes.map((n) => n.imports))}, so LOC is the
          dimension that actually differentiates). Shape encodes kind; the
          accent appears only on the node you&rsquo;re inspecting. Edges point
          from importer to imported. The colours are read live from the
          page&rsquo;s CSS custom properties, so the map follows the theme
          toggle above and whatever accent you picked on{" "}
          <Link className="a-link" href="/palette/">
            /palette
          </Link>
          .
        </p>

        {/* The same data as the canvas, in honest HTML: for screen readers,
            for no-JS, and for anyone who prefers a table to a picture. */}
        <section className="graph-data" aria-labelledby="graph-table-title">
          <h2 id="graph-table-title">The same data as a table</h2>
          <div className="table-scroll">
            <table className="graph-table">
              <thead>
                <tr>
                  <th scope="col">file</th>
                  <th scope="col">kind</th>
                  <th scope="col" className="num">
                    loc
                  </th>
                  <th scope="col" className="num">
                    imports →
                  </th>
                  <th scope="col" className="num">
                    ← imported by
                  </th>
                </tr>
              </thead>
              <tbody>
                {internals.map((n) => (
                  <tr key={n.id}>
                    <th scope="row">
                      <code>{n.id}</code>
                    </th>
                    <td>{n.kind}</td>
                    <td className="num">{fmt(n.loc)}</td>
                    <td className="num">{n.imports}</td>
                    <td className="num">{n.importedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>External packages</h3>
          <ul className="external-list">
            {externals.map((n) => (
              <li key={n.id}>
                <code>{n.id}</code>
                <span>imported by {n.importedBy}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="graph-notes" aria-labelledby="graph-notes-title">
          <h2 id="graph-notes-title">How it&rsquo;s generated, honestly</h2>
          <p>
            <code>scripts/graph.mjs</code> runs before every build (and its
            output, <code>src/lib/graph.json</code>, is committed, so the page
            always has data). It&rsquo;s a regex pass over the source, not a
            TypeScript compiler: it handles default, named, namespace, type and
            side-effect imports, re-exports, dynamic <code>import()</code> with
            a string literal, and CSS <code>@import</code>. It strips comments
            first and resolves relative and <code>@/</code> paths to real
            files; bare specifiers are recorded verbatim as external packages.
          </p>
          <p>
            What it doesn&rsquo;t handle: <code>require()</code>, computed
            import specifiers, imports quoted inside strings, and
            package-exports resolution. None of those occur in this codebase. If
            they ever do, the map will quietly miss them, and this paragraph
            is the confession.
          </p>
        </section>
      </main>
    </>
  );
}
