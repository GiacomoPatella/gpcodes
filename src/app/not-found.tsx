import type { Metadata } from "next";
import Link from "next/link";
import Menu from "@/components/Menu";

export const metadata: Metadata = {
  title: "Not found · gpcodes",
  description: "That page does not exist.",
};

/**
 * The 404. Deliberately written in the site's plain register rather than the
 * apologetic one: a wrong URL is not an error the reader committed, and the
 * useful thing here is a way onward, not a paragraph about what went wrong.
 *
 * The voice is the open question. docs/STATE.md lists this route as one of the
 * three candidate homes for humour (alongside microcopy and the empty state of
 * ⌘K), and this copy does not attempt it: a joke in someone else's voice reads
 * worse than no joke. The structure is here so the copy has somewhere to land.
 */
export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main">
        skip to content
      </a>

      {/* Not the default "/": that marks the home link aria-current="page",
          and this page is not the homepage. Nothing in the IA is current. */}
      <Menu current="/404" />

      <main id="main" className="container lab-page flex-1">
        <p className="mono-label">404</p>
        <h1>No page at this address</h1>
        <p className="lede">
          The link is wrong, or it pointed at something that has since moved.
          Either way it is not your&nbsp;fault.
        </p>

        <ul className="lab-list">
          <li>
            <Link href="/" className="lab-entry">
              <div className="lab-entry-head">
                <h2>Selected work</h2>
                <span className="lab-entry-meta">gpcodes.com</span>
              </div>
              <p>
                Six projects, the testimonials, and how to get hold of&nbsp;me.
              </p>
            </Link>
          </li>
          <li>
            <Link href="/lab/" className="lab-entry">
              <div className="lab-entry-head">
                <h2>Lab</h2>
                <span className="lab-entry-meta">/lab</span>
              </div>
              <p>Small built things: instruments, experiments, side&nbsp;pieces.</p>
            </Link>
          </li>
        </ul>

        <p className="lede">
          Or press <kbd>⌘</kbd>
          <kbd>K</kbd> to search everything from&nbsp;here.
        </p>
      </main>
    </>
  );
}
