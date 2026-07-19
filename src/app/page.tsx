import CopyPrompt from "@/components/CopyPrompt";
import Menu from "@/components/Menu";
import { TESTIMONIALS } from "@/data/site";

/* The graphic design contact sheet. Aspect ratios are the real pixel
   dimensions of each file, so the strip lays out before a single image
   loads. Eleven pieces across five clients. */
const SHEET: {
  file: string;
  ratio: string;
  caption: string;
  alt: string;
}[] = [
  {
    file: "compliance3-stationery",
    ratio: "2000 / 1500",
    caption: "Compliance3 · identity",
    alt: "Compliance3 stationery set: letterhead, envelope, cards and mugs carrying a chain-ring logo in three blues",
  },
  {
    file: "compliance3-bizcard",
    ratio: "1200 / 786",
    caption: "Compliance3 · card",
    alt: "Compliance3 business card, the three chain rings running across the top edge",
  },
  {
    file: "janet-taylor-stationery",
    ratio: "2000 / 1500",
    caption: "Janet Taylor · identity",
    alt: "Janet Taylor Consulting letterhead, envelope and cards with a circular JT monogram",
  },
  {
    file: "janet-taylor-bizcard",
    ratio: "2000 / 1445",
    caption: "Janet Taylor · card",
    alt: "Stacks of Janet Taylor Consulting business cards, geometric monogram in teal",
  },
  {
    file: "hundo-top-trumps",
    ratio: "2000 / 1125",
    caption: "hundo · Top Trumps",
    alt: "Six of hundo's 100 Top Trumps cards, black with teal and gold variants",
  },
  {
    file: "hundo-trump-card-single",
    ratio: "1312 / 2000",
    caption: "hundo · one of 100",
    alt: "A single hundo Top Trump card with pixel-drawn stat counters",
  },
  {
    file: "sensee-flyer-front",
    ratio: "2000 / 1433",
    caption: "Sensée · flyer",
    alt: "Sensée recruitment flyer: THIS COULD BE YOU beside a teal duotone photo of a father and son",
  },
  {
    file: "sensee-flyer-back",
    ratio: "2000 / 1433",
    caption: "Sensée · flyer, back",
    alt: "Flyer reverse: apply now for a home-based job, benefits set in bold condensed type",
  },
  {
    file: "sensee-newsletter-1",
    ratio: "2000 / 1453",
    caption: "Sensée · newsletter",
    alt: "Newsletter spread: a speech-bubble cover page and a home-agent diary page in the pink palette",
  },
  {
    file: "sensee-newsletter-2",
    ratio: "1413 / 2000",
    caption: "Sensée · newsletter",
    alt: "Newsletter page: Diary of a Sensée Home Agent, magenta panels over a desk photo",
  },
  {
    file: "okappy-adwords",
    ratio: "2000 / 1220",
    caption: "Okappy · Google Ads",
    alt: "The Okappy banner set at every ad size, each one keeping Simplify and the green CTA legible",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        skip to content
      </a>

      <Menu current="/" />

      <main id="main" className="flex-1">
        {/* ============ HERO ============ */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <p className="mono-label">
              Giacomo Patella · senior product designer
            </p>
            <h1 id="hero-title" style={{ marginTop: "var(--sp-4)" }}>
              I make complicated products easier to live&nbsp;with.
            </h1>
            {/* The eyebrow already carries name and role, and hero-meta carries
                Florence, so the dek says neither. What is left is the part
                nothing else on the page says: how long, where now, where next. */}
            <p className="dek">
              Over a decade of that now, most recently the AI workspace at{" "}
              <strong>Passionfruit</strong>. Lately I&rsquo;m deep in AI
              tooling, working out what a design engineer actually is and
              whether I can become&nbsp;one.
            </p>

            {/* Everything the prose already says (role, tenure, Passionfruit)
                is gone. What's left is only what it doesn't: where, exactly,
                and how to reach me. */}
            <div className="hero-meta">
              <p className="hero-meta-line">
                Florence, Italy · 43.77°N 11.26°E ·{" "}
                <a href="mailto:gp@gpcodes.com">gp@gpcodes.com</a>
              </p>
              <CopyPrompt />
            </div>
          </div>
        </section>

        {/* ============ SELECTED WORK ============ */}
        <section className="section" id="work" aria-labelledby="work-title">
          <div className="container">
            <div className="sec-head">
              <h2 id="work-title">Selected work</h2>
              <span className="sec-meta">8 entries · 2015 → now</span>
            </div>

            {/* Passionfruit */}
            <article className="entry reveal" id="passionfruit">
              <div className="entry-head">
                <h3 className="entry-title">Passionfruit</h3>
                <span className="entry-org">current role</span>
                <span className="entry-year">2026</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    Passionfruit is a marketing platform that grew from a
                    vetted freelance talent marketplace into an AI-powered
                    workspace for enterprise marketing teams. I lead product
                    design across that whole evolution. On the marketplace
                    that meant both sides of it: client onboarding, project
                    creation, specialist matching, proposals and
                    collaboration.
                  </p>
                  <p>
                    The centre of it now is PIP, Passionfruit&rsquo;s AI
                    platform for marketing teams. PIP connects company
                    knowledge and marketing data (analytics, ad accounts,
                    CRMs, spreadsheets) to an assistant that analyses, reports
                    and automates recurring work. I define the information
                    architecture and design the core experiences: chat,
                    agents, integrations, files and knowledge, workflows,
                    AI-generated artefacts. The goal throughout is making
                    complex AI capabilities feel clear and&nbsp;trustworthy.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">product design</li>
                    <li className="chip">AI</li>
                    <li className="chip">enterprise</li>
                    <li className="chip">IA</li>
                    <li className="chip">design system</li>
                  </ul>
                </div>
                <div>
                  <figure className="fig">
                    <div
                      className="fig-frame"
                      style={{ aspectRatio: "2400 / 1400" }}
                    >
                      <img
                        src="/work/passionfruit/pip-welcome.jpg"
                        alt="PIP's chat home: an AI marketing co-pilot greeting the user, with agents, workflows, files, artefacts and integrations in the sidebar"
                        loading="lazy"
                      />
                    </div>
                    <figcaption>
                      <span>PIP, the AI marketing co-pilot</span>
                      <span className="path">
                        work/passionfruit/pip-welcome.jpg
                      </span>
                    </figcaption>
                  </figure>
                  <div className="fig-pair">
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1466" }}
                      >
                        <img
                          src="/work/passionfruit/agents-leads.jpg"
                          alt="An outreach agent's campaign view: leads found, contacted, replies and reply rate above a lead table"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <span>Outreach agent, campaign view</span>
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1466" }}
                      >
                        <img
                          src="/work/passionfruit/onboarding-goals.jpg"
                          alt="Onboarding step asking what goal the team is chasing, answered with selectable goal chips"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <span>Onboarding, goals</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </article>

            {/* hundo */}
            <article className="entry reveal" id="hundo">
              <div className="entry-head">
                <h3 className="entry-title">hundo</h3>
                <span className="entry-org">hundo.xyz</span>
                <span className="entry-year">2022</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    On-demand learning platform aimed at Gen&nbsp;Z, launched
                    at the end of 2022. I orchestrated the entire design
                    process behind hundo.xyz, an industry-first learning
                    platform with a built-in skills wallet. I mentored junior
                    designers, grew the brand identity and marketing assets,
                    and worked closely with founders, developers, QA and
                    product.
                  </p>
                  <p>
                    The bold palette evolves hundo&rsquo;s original black and
                    yellow brand: I brightened the secondary colours and
                    brought them to the front, conveying energy for an
                    audience that values creativity while keeping navigation
                    between areas of the web app easy to distinguish.
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

            {/* PwC */}
            <article className="entry reveal" id="pwc">
              <div className="entry-head">
                <h3 className="entry-title">Consulting Source</h3>
                <span className="entry-org">PwC</span>
                <span className="entry-year">2021</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    I improved the usability and layout of a global knowledge
                    management system hosting methods, frameworks, templates,
                    case studies and toolkits, enabling thousands of PwC
                    employees to sell and deliver work.
                  </p>
                  <p>
                    I worked on the components library, the search redesign,
                    advanced search, methodology light and nested navigation.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">enterprise UX</li>
                    <li className="chip">design system</li>
                    <li className="chip">search</li>
                  </ul>
                </div>
                <div>
                  <figure className="fig">
                    <div
                      className="fig-frame"
                      style={{ aspectRatio: "16 / 10" }}
                    >
                      <img
                        src="/work/pwc-consulting-source/search-desktop.jpg"
                        alt="Consulting Source search results page, cropped to the results list and filter rail"
                        loading="lazy"
                        style={{ objectPosition: "top" }}
                      />
                    </div>
                    <figcaption>
                      <span>Search redesign, cropped to detail*</span>
                      <span className="path">
                        work/pwc-consulting-source/search-desktop.jpg
                      </span>
                    </figcaption>
                  </figure>
                  <div className="fig-pair">
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
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        <img
                          src="/work/pwc-consulting-source/search-mobile.jpg"
                          alt="Consulting Source search on mobile, cropped to the results list"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Mobile search</span>
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
                      2021 telemetry · top contributors: US, UK, IN, CA, AU,
                      DE, SA. *The frames above carry placeholder copy, so I
                      crop them to interaction detail.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Okappy */}
            <article className="entry reveal" id="okappy">
              <div className="entry-head">
                <h3 className="entry-title">Connections database</h3>
                <span className="entry-org">Okappy</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    I reviewed and redesigned features of Okappy&rsquo;s web
                    and mobile apps, presenting concepts to stakeholders for
                    discussion and approval. I rethought the Connections
                    database layout to make better use of empty space and
                    direct attention with a more selective use of the brand
                    orange, weighing more connections above the fold against
                    fewer with richer detail.
                  </p>
                  <p>
                    I also designed a drip email onboarding flow with a
                    deliberately warm tone, mapped the user journey with
                    emotional states at each touchpoint, and reworked sign-up
                    so users get straight into the app while an emailed
                    activation link verifies them in the background: less
                    friction, same verification.
                  </p>
                  <ul className="chip-row" aria-label="Disciplines">
                    <li className="chip">UX process</li>
                    <li className="chip">IA</li>
                    <li className="chip">user flows</li>
                    <li className="chip">stakeholder facilitation</li>
                  </ul>
                </div>
                <div>
                  <figure className="fig">
                    <div
                      className="fig-frame"
                      style={{ aspectRatio: "2400 / 1706" }}
                    >
                      <img
                        src="/work/okappy/db-list.jpg"
                        alt="Okappy connections database: redesigned list layout"
                        loading="lazy"
                      />
                    </div>
                    <figcaption>
                      <span>Connections database, list layout</span>
                      <span className="path">work/okappy/db-list.jpg</span>
                    </figcaption>
                  </figure>
                  <div className="fig-pair">
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1706" }}
                      >
                        <img
                          src="/work/okappy/db-concept-1.jpg"
                          alt="Early layout concept for the connections database"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <span>Layout concept</span>
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1706" }}
                      >
                        <img
                          src="/work/okappy/connections-notes.jpg"
                          alt="Connection record with notes panel open"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Notes on a connection</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </article>

            {/* Octopus Energy */}
            <article className="entry reveal" id="octopus">
              <div className="entry-head">
                <h3 className="entry-title">Powerloop</h3>
                <span className="entry-org">Octopus Energy · via Play</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    I helped Octopus Energy launch an innovative, gamified
                    pilot scheme for EV owners to efficiently charge their
                    electric car and home systems at night via a smart
                    charging point. Delivered as part of the product team at
                    Play Consulting.
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
                  <div className="fig-pair">
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "3 / 4" }}
                      >
                        <img
                          src="/work/octopus-powerloop/dashboard-cycles.jpg"
                          alt="Powerloop mobile dashboard showing charge cycles"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Charge cycles</span>
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "3 / 4" }}
                      >
                        <img
                          src="/work/octopus-powerloop/history.jpg"
                          alt="Powerloop charging history with completed night cycles"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Charging history</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </article>

            {/* Redington */}
            <article className="entry reveal" id="redington">
              <div className="entry-head">
                <h3 className="entry-title">FRANK-E</h3>
                <span className="entry-org">Redington</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    I designed a highly personal digital experience that lets
                    pension managers quickly understand their scheme&rsquo;s
                    key metrics, spot weak points, and see what to do about
                    them.
                  </p>
                  <p>
                    Nothing like it was available to pension managers at the
                    time. The aim: more confident decision makers, more value
                    delivered to members, lower costs.
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
                  <div className="fig-pair">
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "3 / 4" }}
                      >
                        <img
                          src="/work/redington-frank-e/company-stats.jpg"
                          alt="FRANK-E company statistics view"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Company stats</span>
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "3 / 4" }}
                      >
                        <img
                          src="/work/redington-frank-e/governance.jpg"
                          alt="FRANK-E governance view"
                          loading="lazy"
                          style={{ objectPosition: "top" }}
                        />
                      </div>
                      <figcaption>
                        <span>Governance</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </article>

            {/* IPC */}
            <article className="entry reveal" id="ipc">
              <div className="entry-head">
                <h3 className="entry-title">Ecosystem prototype</h3>
                <span className="entry-org">IPC</span>
              </div>
              <div className="entry-body">
                <div className="entry-copy">
                  <p>
                    IPC asked me for a high-fidelity prototype of a complex
                    app to present to a global Tier&nbsp;1 investment bank. I
                    pushed for the full UX process (research, interviews, user
                    journey, IA, wireframes, prototype, test) while the client
                    wanted a polished app first to convey their product
                    vision. I built a clickable prototype in Principle with
                    over 50&nbsp;screens.
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
                  <div className="fig-pair">
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1500" }}
                      >
                        <img
                          src="/work/ipc-ecosystem/menu.jpg"
                          alt="IPC prototype navigation menu"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <span>Navigation</span>
                      </figcaption>
                    </figure>
                    <figure className="fig">
                      <div
                        className="fig-frame"
                        style={{ aspectRatio: "2400 / 1500" }}
                      >
                        <img
                          src="/work/ipc-ecosystem/modal.jpg"
                          alt="IPC prototype modal dialog"
                          loading="lazy"
                        />
                      </div>
                      <figcaption>
                        <span>Modal detail</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </article>

            {/* Graphic design & branding, one consolidated entry.
                Five clients as one body of work: together they read as range;
                as five entries they'd dilute the product work. */}
            <article className="entry reveal" id="graphic-design">
              <div className="entry-head">
                <h3 className="entry-title">Graphic design &amp; branding</h3>
                <span className="entry-org">five clients</span>
                <span className="entry-year">2015 → 2022</span>
              </div>
              <div className="entry-copy gallery-copy">
                <p>
                  Product is the day job; this is the rest of the practice.
                  Compliance3 does PCI compliance for contact centres, motto
                  &ldquo;People, Process, Technology&rdquo;, four steps to
                  each, so I drew the logo as three chain rings of four
                  elements each. For Janet Taylor, an organisational
                  psychologist consulting to large engineering firms, a clean
                  geometric monogram: creative, but academic.
                </p>
                <p>
                  Then the range: 100 Top Trumps cards for hundo, one revealed
                  a day in the run-up to Careercon22; Sensée&rsquo;s
                  recruitment campaign and a monthly newsletter for hundreds
                  of remote agents, re-designed every issue to fit the content
                  and held together by a strict pink palette; and 20 Google
                  Ads banners for Okappy that keep &ldquo;Simplify&rdquo;
                  legible at every&nbsp;size.
                </p>
                <ul className="chip-row" aria-label="Disciplines">
                  <li className="chip">branding</li>
                  <li className="chip">identity</li>
                  <li className="chip">print</li>
                  <li className="chip">campaign</li>
                </ul>
              </div>
              <div className="gallery">
                <ul
                  className="gallery-strip"
                  tabIndex={0}
                  aria-label="Graphic design contact sheet: 11 pieces, scrolls sideways"
                >
                  {SHEET.map((piece) => (
                    <li key={piece.file}>
                      <figure className="fig">
                        <div
                          className="fig-frame"
                          style={{ aspectRatio: piece.ratio }}
                        >
                          <img
                            src={`/work/graphic-design/${piece.file}.jpg`}
                            alt={piece.alt}
                            loading="lazy"
                          />
                        </div>
                        <figcaption>
                          <span>{piece.caption}</span>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
                <p className="gallery-note">
                  <span>11 pieces · 5 clients</span>
                  <span aria-hidden="true">scroll →</span>
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ============ TESTIMONIALS ============ */}
        <section
          className="section"
          id="testimonials"
          aria-labelledby="testimonials-title"
        >
          <div className="container">
            <div className="sec-head">
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

      {/* ============ FOOTER ============ */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <p className="mono-label" style={{ marginBottom: "var(--sp-3)" }}>
            contact
          </p>
          <a className="footer-email u-link" href="mailto:gp@gpcodes.com">
            gp<span className="at">@</span>gpcodes.com
          </a>

          <dl className="footer-grid">
            <div className="footer-col">
              <dt>field notes</dt>
              <dd>
                I&rsquo;m a senior product designer in Florence.
                <br />
                I design end to end and build when it counts.
              </dd>
            </div>
            <div className="footer-col">
              <dt>machine</dt>
              <dd>
                <a href="/index.md">/index.md</a>, the markdown twin
                <br />
                <a href="/llms.txt">/llms.txt</a>, model-readable index
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
              Figtree &amp; Geist Mono, self-hosted · Next.js static export ·
              CSS-only motion
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
