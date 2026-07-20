import type { Metadata } from "next";
import Link from "next/link";
import Menu from "@/components/Menu";

export const metadata: Metadata = {
  title: "Lab · gpcodes",
  description:
    "Small built things: instruments, experiments, side pieces. Tonic Lab, a music theory explorer, and this site's own architecture map.",
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
          where the built pieces go. Two so far, and I&rsquo;d rather keep the
          list short and real than pad&nbsp;it.
        </p>

        <ul className="lab-list">
          <li>
            {/* Lives on its own domain, so a plain anchor rather than Link.
                Same tab on purpose: the site opens nothing in a new window,
                and the arrow plus the visible host already say it leaves. */}
            <a
              href="https://toniclab.vercel.app/"
              className="lab-entry"
              rel="noreferrer"
            >
              <div className="lab-entry-head">
                <h2>Tonic Lab ↗</h2>
                <span className="lab-entry-meta">
                  toniclab.vercel.app · web audio · midi
                </span>
              </div>
              <p>
                A music theory explorer I built to learn theory properly:
                intervals, chords, scales, key signatures and the circle of
                fifths, each one played on a keyboard rather than described in
                prose. There&rsquo;s a quiz mode, a key finder and a mood
                finder, and it takes MIDI in if you have something
                plugged&nbsp;in.
              </p>
            </a>
          </li>
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
