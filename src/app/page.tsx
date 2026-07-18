import Link from "next/link";
import CommandPalette from "@/components/CommandPalette";
import Console from "@/components/Console";
import ThemeToggle from "@/components/ThemeToggle";
import { TESTIMONIALS } from "@/data/site";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        skip to content
      </a>

      <header className="site-header">
        <div className="container">
          <Link className="wordmark" href="/">
            gp<span className="tld">codes.com</span>
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <div className="nav-links">
              <a className="u-link" href="#work">
                work
              </a>
              <a className="u-link" href="#testimonials">
                testimonials
              </a>
              <a className="u-link" href="#contact">
                contact
              </a>
            </div>
            <CommandPalette />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ============ 01 · HERO ============ */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <p className="mono-label">
              Giacomo Patella · senior product designer
            </p>
            <h1 id="hero-title" style={{ marginTop: "var(--sp-4)" }}>
              Complex systems, made precise and legible.
            </h1>
            <p className="dek">
              Over a decade designing digital products end to end — research,
              interface, design system — and{" "}
              <strong>building the front-end</strong> when it counts. Based in
              Florence, Italy.
            </p>

            <dl className="field-grid">
              <div className="field">
                <dt>role</dt>
                <dd>Senior Product Designer</dd>
              </div>
              <div className="field">
                <dt>location</dt>
                <dd>Florence, IT · 43.77°N 11.26°E</dd>
              </div>
              <div className="field">
                <dt>practice</dt>
                <dd>over a decade</dd>
              </div>
              <div className="field">
                <dt>focus</dt>
                <dd>product · design systems · prototyping</dd>
              </div>
              <div className="field">
                <dt>current</dt>
                <dd>Passionfruit</dd>
              </div>
              <div className="field">
                <dt>contact</dt>
                <dd>
                  <a href="mailto:gp@gpcodes.com">gp@gpcodes.com</a>
                </dd>
              </div>
            </dl>

            <Console />
          </div>
        </section>

        {/* ============ 02 · SELECTED WORK ============ */}
        <section className="section" id="work" aria-labelledby="work-title">
          <div className="container">
            <div className="sec-head">
              <span className="sec-index" aria-hidden="true">
                02
              </span>
              <h2 id="work-title">Selected work</h2>
              <span className="sec-meta">7 entries · 2015 → now</span>
            </div>

            {/* 01 · Passionfruit — placeholder, content not yet available */}
            <article className="entry reveal" id="passionfruit">
              <div className="entry-head">
                <span className="entry-index" aria-hidden="true">
                  01
                </span>
                <h3 className="entry-title">Passionfruit</h3>
                <span className="entry-org">current work</span>
                <span className="entry-year">2026</span>
              </div>
              <div className="placeholder-slot">
                <span className="mono-label">case study in preparation</span>
                <p>
                  Giacomo&rsquo;s current role. Notes are being written up;
                  content is not yet available. This slot is reserved — nothing
                  here is placeholder copy pretending otherwise.
                </p>
              </div>
            </article>

            {/* 02 · hundo */}
            <article className="entry reveal" id="hundo">
              <div className="entry-head">
                <span className="entry-index" aria-hidden="true">
                  02
                </span>
                <h3 className="entry-title">hundo</h3>
                <span className="entry-org">hundo.xyz</span>
                <span className="entry-year">2022</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    On-demand learning content platform aimed at Gen&nbsp;Z,
                    launched end of 2022. Orchestrated the entire design
                    process, resulting in the launch of hundo.xyz — an
                    industry-first learning platform with a built-in skills
                    wallet. Mentored junior designers, grew the brand identity
                    and marketing assets, and worked closely with founders,
                    developers, QA and product.
                  </p>
                  <p>
                    The bold palette is an evolution of hundo&rsquo;s original
                    black and yellow brand: secondary colours brightened and
                    brought to the front, conveying energy for an audience that
                    values creativity — while making navigation between areas
                    of the web app easy to distinguish.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">product design</li>
                    <li className="chip">design system</li>
                    <li className="chip">brand</li>
                    <li className="chip">mentoring</li>
                  </ul>
                </div>
                <div>
                  <figure className="fig">
                    <div
                      className="fig-frame"
                      style={{ aspectRatio: "2400 / 1350" }}
                    >
                      <img
                        src="/work/hundo/desktop-1.jpg"
                        alt="hundo.xyz learn area on desktop: dark interface with bright yellow and violet accents"
                        loading="lazy"
                      />
                    </div>
                    <figcaption>
                      <span>Learn area, launch build</span>
                      <span className="path">work/hundo/desktop-1.jpg</span>
                    </figcaption>
                  </figure>
                  <div className="fig-pair">
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1350" }}
                      >
                        <img
                          src="/work/hundo/mobile-1.jpg"
                          alt="hundo mobile screens with the brightened secondary palette"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <span>Mobile</span>
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1350" }}
                      >
                        <img
                          src="/work/hundo/trump-cards.jpg"
                          alt="hundo Top Trumps card series designed for Careercon22"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <span>Top Trumps, Careercon22</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </article>

            {/* 03 · PwC */}
            <article className="entry reveal" id="pwc">
              <div className="entry-head">
                <span className="entry-index" aria-hidden="true">
                  03
                </span>
                <h3 className="entry-title">Consulting Source</h3>
                <span className="entry-org">PwC</span>
                <span className="entry-year">2021</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    Enabled thousands of PwC employees to sell and deliver work
                    by improving the usability and layout of a global knowledge
                    management system hosting methods, frameworks, templates,
                    case studies and toolkits.
                  </p>
                  <p>
                    Worked on the components library, search redesign, advanced
                    search, methodology light, and nested navigation.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">enterprise UX</li>
                    <li className="chip">design system</li>
                    <li className="chip">search</li>
                  </ul>
                </div>
                <div>
                  <div className="fig-pair">
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        <img
                          src="/work/pwc-consulting-source/search-desktop.jpg"
                          alt="Consulting Source search results page, cropped to the results list and filter rail"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Search redesign</span>
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        <img
                          src="/work/pwc-consulting-source/search-filters.jpg"
                          alt="Advanced search filter panel, cropped to the filter controls"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Advanced filters</span>
                        <span className="path">design-system artefacts*</span>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="stats">
                    <div className="stats-ruler" aria-hidden="true" />
                    <dl className="stats-grid">
                      <div className="stat">
                        <dt className="stat-label">monthly users</dt>
                        <dd className="stat-num">20,000</dd>
                      </div>
                      <div className="stat">
                        <dt className="stat-label">unique viewers</dt>
                        <dd className="stat-num">96,000</dd>
                      </div>
                      <div className="stat">
                        <dt className="stat-label">downloads</dt>
                        <dd className="stat-num">1.23M</dd>
                      </div>
                      <div className="stat">
                        <dt className="stat-label">page views</dt>
                        <dd className="stat-num">2.30M</dd>
                      </div>
                    </dl>
                    <p className="stats-caption">
                      2021 telemetry · top contributors: US · UK · IN · CA · AU
                      · DE · SA — *frames shown carry placeholder copy; cropped
                      to interaction detail
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 04 · Okappy */}
            <article className="entry reveal" id="okappy">
              <div className="entry-head">
                <span className="entry-index" aria-hidden="true">
                  04
                </span>
                <h3 className="entry-title">Connections database</h3>
                <span className="entry-org">Okappy</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    Reviewed and redesigned features of Okappy&rsquo;s web and
                    mobile apps, presenting concepts to stakeholders for
                    discussion and approval. Rethought the Connections database
                    layout to better use empty space and direct attention with
                    more selective use of the brand orange — weighing more
                    connections with less info above the fold against fewer
                    with more.
                  </p>
                  <p>
                    Also: a drip email onboarding flow with a deliberately warm
                    tone, a user journey touchpoint map with emotional states,
                    and a sign-up flow that let users straight into the app
                    while verifying via an emailed activation link — removing
                    friction without losing verification.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">UX process</li>
                    <li className="chip">IA</li>
                    <li className="chip">user flows</li>
                    <li className="chip">stakeholder facilitation</li>
                  </ul>
                </div>
                <div>
                  <figure
                    className="fig fig-stack"
                    tabIndex={0}
                    role="group"
                    aria-label="Connections database list. Hover or focus to preview the row hover state; press to preview the click state."
                  >
                    <div className="fig-frame">
                      <img
                        src="/work/okappy/db-list.jpg"
                        alt="Okappy connections database: list layout at rest"
                        loading="lazy"
                      />
                      <img
                        className="state state-hover"
                        src="/work/okappy/db-list-hover.jpg"
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                      />
                      <img
                        className="state state-active"
                        src="/work/okappy/db-list-click.jpg"
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                      />
                    </div>
                    <figcaption>
                      <span>
                        <span className="hint-dot" aria-hidden="true" /> hover
                        to preview the designed hover state · press for click
                      </span>
                      <span className="path">work/okappy/db-list*.jpg</span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>

            {/* 05 · Octopus Energy */}
            <article className="entry reveal" id="octopus">
              <div className="entry-head">
                <span className="entry-index" aria-hidden="true">
                  05
                </span>
                <h3 className="entry-title">Powerloop</h3>
                <span className="entry-org">Octopus Energy · via Play</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    Helped Octopus Energy launch an innovative, gamified pilot
                    scheme for EV owners to efficiently charge their electric
                    car and home systems at night via a smart charging point.
                    Delivered as part of the product team at Play Consulting.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">gamification</li>
                    <li className="chip">energy</li>
                    <li className="chip">web app</li>
                  </ul>
                </div>
                <div>
                  <figure className="fig">
                    <div
                      className="fig-frame"
                      style={{ aspectRatio: "2400 / 1800" }}
                    >
                      <img
                        src="/work/octopus-powerloop/desktop.jpg"
                        alt="Powerloop web app on desktop: gamified night-charging schedule for EV owners"
                        loading="lazy"
                      />
                    </div>
                    <figcaption>
                      <span>Charging dashboard</span>
                      <span className="path">
                        work/octopus-powerloop/desktop.jpg
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>

            {/* 06 · Redington */}
            <article className="entry reveal" id="redington">
              <div className="entry-head">
                <span className="entry-index" aria-hidden="true">
                  06
                </span>
                <h3 className="entry-title">FRANK-E</h3>
                <span className="entry-org">Redington</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    Designed a highly personal digital experience allowing
                    pension managers to quickly understand their scheme&rsquo;s
                    key metrics, highlight weak points, and see what to do
                    about them.
                  </p>
                  <p>
                    This kind of solution wasn&rsquo;t available to pension
                    managers; the aim was to make them more confident decision
                    makers, deliver the most value to their members, and reduce
                    costs.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">data visualisation</li>
                    <li className="chip">fintech</li>
                    <li className="chip">dashboard</li>
                  </ul>
                </div>
                <div>
                  <figure className="fig">
                    <div
                      className="fig-frame"
                      style={{ aspectRatio: "4 / 3" }}
                    >
                      <img
                        src="/work/redington-frank-e/dashboard.jpg"
                        alt="FRANK-E dashboard summarising a pension scheme's key metrics"
                        loading="lazy"
                        style={{ objectPosition: "top" }}
                      />
                    </div>
                    <figcaption>
                      <span>Scheme overview</span>
                      <span className="path">
                        work/redington-frank-e/dashboard.jpg
                      </span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>

            {/* 07 · IPC */}
            <article className="entry reveal" id="ipc">
              <div className="entry-head">
                <span className="entry-index" aria-hidden="true">
                  07
                </span>
                <h3 className="entry-title">Ecosystem prototype</h3>
                <span className="entry-org">IPC</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    Asked to create a high-fidelity prototype of a complex app
                    to present to a global Tier&nbsp;1 investment bank. Pushed
                    for the full UX process — research, interviews, user
                    journey, IA, wireframes, prototype, test — while the client
                    wanted a polished app first to convey their product vision.
                    Built a clickable prototype in Principle with over
                    50&nbsp;screens.
                  </p>
                  <div className="outcome">
                    <span className="mono-label">outcome</span>
                    <p>
                      The client&rsquo;s customer invested a{" "}
                      <strong>six-figure sum</strong> to develop it further.
                    </p>
                  </div>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">prototyping</li>
                    <li className="chip">enterprise</li>
                    <li className="chip">fintech</li>
                  </ul>
                </div>
                <div>
                  <figure className="fig">
                    <div
                      className="fig-frame"
                      style={{ aspectRatio: "2400 / 1500" }}
                    >
                      <img
                        src="/work/ipc-ecosystem/table.jpg"
                        alt="IPC ecosystem prototype: licensing data table"
                        loading="lazy"
                      />
                    </div>
                    <figcaption>
                      <span>One of 50+ prototype screens</span>
                      <span className="path">work/ipc-ecosystem/table.jpg</span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ============ 03 · TESTIMONIALS ============ */}
        <section
          className="section"
          id="testimonials"
          aria-labelledby="testimonials-title"
        >
          <div className="container">
            <div className="sec-head">
              <span className="sec-index" aria-hidden="true">
                03
              </span>
              <h2 id="testimonials-title">Testimonials</h2>
              <span className="sec-meta">6 records</span>
            </div>
            <div className="quote-grid">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className={`quote reveal${t.lead ? " quote-lead" : ""}`}
                >
                  <blockquote>
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <footer>
                    <cite>{t.name}</cite>
                    <span className="role">{t.role}</span>
                  </footer>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ============ 04 · FOOTER ============ */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <p className="mono-label" style={{ marginBottom: "var(--sp-3)" }}>
            04 · contact
          </p>
          <a className="footer-email u-link" href="mailto:gp@gpcodes.com">
            gp<span className="at">@</span>gpcodes.com
          </a>

          <dl className="footer-grid">
            <div className="footer-col">
              <dt>field notes</dt>
              <dd>
                Senior product designer, Florence.
                <br />
                Designs end to end, builds when it counts.
              </dd>
            </div>
            <div className="footer-col">
              <dt>machine</dt>
              <dd>
                <a href="/index.md">/index.md</a> — markdown twin
                <br />
                <a href="/llms.txt">/llms.txt</a> — model-readable index
              </dd>
            </div>
            <div className="footer-col">
              <dt>navigate</dt>
              <dd>
                <a href="#work">selected work</a>
                <br />
                <a href="#testimonials">testimonials</a> ·{" "}
                <kbd>⌘</kbd> <kbd>K</kbd>
              </dd>
            </div>
          </dl>

          <div className="colophon">
            <span>© 2026 Giacomo Patella · Florence, Italy</span>
            <span>
              Geist &amp; Geist Mono, self-hosted · Next.js static export ·
              CSS-only motion
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
