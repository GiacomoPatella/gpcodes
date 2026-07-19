import type { Metadata } from "next";
import Link from "next/link";
import Menu from "@/components/Menu";

export const metadata: Metadata = {
  title: "Lab · gpcodes",
  description:
    "Small built things: instruments, experiments, side pieces. One entry so far.",
};

export default function LabPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        skip to content
      </a>

      <Menu current="/lab" />

      <main id="main" className="container lab-page flex-1">
        <p className="mono-label">lab</p>
        <h1>Small built things</h1>
        <p className="lede">
          Design is my job; building is how I check my own thinking. This is
          where the built pieces go. There&rsquo;s one entry so far; this
          section is new, and I&rsquo;d rather open with a single real piece
          than pad the list.
        </p>

        <ul className="lab-list">
          <li>
            <Link href="/lab/architecture/" className="lab-entry">
              <div className="lab-entry-head">
                <h2>Architecture map</h2>
                <span className="lab-entry-meta">canvas 2d · force-directed</span>
              </div>
              <p>
                This site&rsquo;s real module graph: every file and import,
                generated from the source at build time and drawn as an
                interactive map. The page is itself a node in the graph it
                draws.
              </p>
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}
