import CopyPrompt from "@/components/CopyPrompt";
import Fig from "@/components/Fig";
import ParticleWordmark from "@/components/ParticleWordmark";
import Menu from "@/components/Menu";
import FaceField from "@/components/FaceField";
import { TESTIMONIALS, VISIBLE_WORK, isHidden } from "@/data/site";

/* The graphic design contact sheet, eleven pieces across five clients.
   Aspect ratios are no longer written here: Fig reads the real dimensions from
   the generated manifest, so the strip still lays out before a single image
   loads but the numbers cannot drift from the files. */
const SHEET: {
  file: string;
  caption: string;
  alt: string;
}[] = [
  {
    file: "compliance3-stationery",
    caption: "Compliance3 · identity",
    alt: "Compliance3 stationery set: letterhead, envelope, cards and mugs carrying a chain-ring logo in three blues",
  },
  {
    file: "compliance3-bizcard",
    caption: "Compliance3 · card",
    alt: "Compliance3 business card, the three chain rings running across the top edge",
  },
  {
    file: "janet-taylor-stationery",
    caption: "Janet Taylor · identity",
    alt: "Janet Taylor Consulting letterhead, envelope and cards with a circular JT monogram",
  },
  {
    file: "janet-taylor-bizcard",
    caption: "Janet Taylor · card",
    alt: "Stacks of Janet Taylor Consulting business cards, geometric monogram in teal",
  },
  {
    file: "hundo-top-trumps",
    caption: "hundo · Top Trumps",
    alt: "Six of hundo's 100 Top Trumps cards, black with teal and gold variants",
  },
  {
    file: "hundo-trump-card-single",
    caption: "hundo · one of 100",
    alt: "A single hundo Top Trump card with pixel-drawn stat counters",
  },
  {
    file: "sensee-flyer-front",
    caption: "Sensée · flyer",
    alt: "Sensée recruitment flyer: THIS COULD BE YOU beside a teal duotone photo of a father and son",
  },
  {
    file: "sensee-flyer-back",
    caption: "Sensée · flyer, back",
    alt: "Flyer reverse: apply now for a home-based job, benefits set in bold condensed type",
  },
  {
    file: "sensee-newsletter-1",
    caption: "Sensée · newsletter",
    alt: "Newsletter spread: a speech-bubble cover page and a home-agent diary page in the pink palette",
  },
  {
    file: "sensee-newsletter-2",
    caption: "Sensée · newsletter",
    alt: "Newsletter page: Diary of a Sensée Home Agent, magenta panels over a desk photo",
  },
  {
    file: "okappy-adwords",
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

      <Menu current="/" morph />

      <main id="main" className="flex-1">
        {/* ============ HERO ============ */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="hero-copy">
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

              {/* The eyebrow carries name and role; the prose carries tenure and
                  Passionfruit. All that's left here is how to reach me. The
                  coordinates were removed as rhythm noise (Giacomo, 21 Jul): this
                  metadata is kept as raw material for future inline hover moments,
                  not a data readout. See the roadmap note in docs/STATE.md. */}
              <div className="hero-meta">
                <p className="hero-meta-line">
                  <a href="mailto:gp@gpcodes.com">gp@gpcodes.com</a>
                </p>
                <CopyPrompt />
              </div>
            </div>

            {/* Interactive halftone portrait, filling the ~45% of dead hero
                space the impeccable critique flagged at >=1024px. Hidden below
                that: single-column, as the hero always was. Decorative, so it
                carries no accessible content of its own. No props, deliberately:
                this is a Server Component rendering a Client Component, and
                FaceField resolves its own tuned defaults internally, see the
                comment on FaceField itself for why that has to happen there
                rather than here. */}
            <div className="hero-face" aria-hidden="true">
              <FaceField />
            </div>
          </div>
        </section>

        {/* ============ SELECTED WORK ============ */}
        <section className="section" id="work" aria-labelledby="work-title">
          <div className="container">
            <div className="sec-head">
              <h2 id="work-title">Selected work</h2>
              <span className="sec-meta">
                {VISIBLE_WORK.length} entries · 2015 → now
              </span>
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
                  <Fig
                    src="/work/passionfruit/pip-welcome.jpg"
                    alt="PIP's chat home: an AI marketing co-pilot greeting the user, with agents, workflows, files, artefacts and integrations in the sidebar"
                    caption="PIP, the AI marketing co-pilot"
                    showPath
                    priority
                  />
                  <div className="fig-pair">
                    <Fig
                      src="/work/passionfruit/agents-leads.jpg"
                      alt="An outreach agent's campaign view: leads found, contacted, replies and reply rate above a lead table"
                      caption="Outreach agent, campaign view"
                    />
                    <Fig
                      src="/work/passionfruit/onboarding-goals.jpg"
                      alt="Onboarding step asking what goal the team is chasing, answered with selectable goal chips"
                      caption="Onboarding, goals"
                    />
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
                  <Fig
                    src="/work/hundo/desktop-1.jpg"
                    alt="hundo.xyz learn area on desktop: dark interface with bright yellow and violet accents"
                    caption="Learn area, launch build"
                    showPath
                  />
                  <div className="fig-pair">
                    <Fig
                      src="/work/hundo/mobile-1.jpg"
                      alt="hundo mobile screens with the brightened secondary palette"
                      caption="Mobile"
                    />
                    <Fig
                      src="/work/hundo/trump-cards.jpg"
                      alt="hundo Top Trumps card series designed for Careercon22"
                      caption="Top Trumps, Careercon22"
                    />
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
                  {/* The composite leads: it is the one PwC frame that was
                      composed to be looked at, and it carries the responsive
                      story on its own, search on desktop, a toolkit page and
                      the mobile results, so the separate mobile shot was
                      saying something already said here. Its true 16:9 is the
                      frame, so no ratio override. */}
                  <Fig
                    src="/work/pwc-consulting-source/overview.jpg"
                    alt="Consulting Source shown across three screens on PwC's orange and pink brand pattern: desktop search results, a Responsible AI toolkit page with nested navigation, and the mobile results view with filters applied"
                    caption="Consulting Source, across breakpoints*"
                    showPath
                  />
                  <div className="fig-pair">
                    {/* These two crop on purpose: the frames carry Lorem ipsum,
                        so they are cut to interaction detail and the footnote
                        below says so. The ratio override is what keeps that
                        crop; the manifest's true ratio would undo it. */}
                    <Fig
                      src="/work/pwc-consulting-source/search-desktop.jpg"
                      alt="Consulting Source search results page, cropped to the results list and filter rail"
                      caption="Search redesign, cropped to detail"
                      ratio="4 / 5"
                      objectPosition="top"
                    />
                    <Fig
                      src="/work/pwc-consulting-source/search-filters.jpg"
                      alt="Advanced search filter panel, cropped to the filter controls"
                      caption="Advanced filters"
                      ratio="4 / 5"
                      objectPosition="top"
                    />
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
                      DE, SA. *These frames carry placeholder copy, so the two
                      detail shots are cropped to the interaction rather than
                      the content.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Okappy */}
            {/* Withheld, not deleted. The entry keeps its copy, images and
                markup; `hidden` in src/data/site.ts is the only switch. */}
            {!isHidden("okappy") && (
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
                    <Fig
                      src="/work/okappy/db-list.jpg"
                      alt="Okappy connections database: redesigned list layout"
                      caption="Connections database, list layout"
                      showPath
                    />
                    <div className="fig-pair">
                      <Fig
                        src="/work/okappy/db-concept-1.jpg"
                        alt="Early layout concept for the connections database"
                        caption="Layout concept"
                      />
                      {/* The other half of the trade-off in the copy above:
                          db-list is many connections at a glance, this is fewer
                          with richer detail on each. */}
                      <Fig
                        src="/work/okappy/db-cards.jpg"
                        alt="Connections as cards, one expanded to show jobs, invoices and note actions alongside invited and connected states"
                        caption="Cards: fewer, with more detail"
                        ratio="2400 / 1706"
                        objectPosition="top"
                      />
                    </div>
                  </div>
                </div>
              </article>
            )}

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
                  <Fig
                    src="/work/octopus-powerloop/desktop.jpg"
                    alt="Powerloop web app on desktop: gamified night-charging schedule for EV owners"
                    caption="Charging dashboard"
                    showPath
                  />
                  <div className="fig-pair">
                    {/* Tall phone screens cut to a 3/4 window so the pair sits
                        level. Zoom shows the full scroll. */}
                    <Fig
                      src="/work/octopus-powerloop/dashboard-cycles.jpg"
                      alt="Powerloop mobile dashboard showing charge cycles"
                      caption="Charge cycles"
                      ratio="3 / 4"
                      objectPosition="top"
                    />
                    <Fig
                      src="/work/octopus-powerloop/history.jpg"
                      alt="Powerloop charging history with completed night cycles"
                      caption="Charging history"
                      ratio="3 / 4"
                      objectPosition="top"
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* Redington */}
            {/* Withheld, not deleted. The entry keeps its copy, images and
                markup; `hidden` in src/data/site.ts is the only switch. */}
            {!isHidden("redington") && (
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
                    <Fig
                      src="/work/redington-frank-e/dashboard.jpg"
                      alt="FRANK-E dashboard summarising a pension scheme's key metrics"
                      caption="Scheme overview"
                      showPath
                      ratio="4 / 3"
                      objectPosition="top"
                    />
                    <div className="fig-pair">
                      <Fig
                        src="/work/redington-frank-e/company-stats.jpg"
                        alt="FRANK-E company statistics view"
                        caption="Company stats"
                        ratio="3 / 4"
                        objectPosition="top"
                      />
                      <Fig
                        src="/work/redington-frank-e/governance.jpg"
                        alt="FRANK-E governance view"
                        caption="Governance"
                        ratio="3 / 4"
                        objectPosition="top"
                      />
                    </div>
                  </div>
                </div>
              </article>
            )}

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
                  <Fig
                    src="/work/ipc-ecosystem/table.jpg"
                    alt="IPC ecosystem prototype: licensing data table"
                    caption="One of 50+ prototype screens"
                    showPath
                  />
                  <div className="fig-pair">
                    <Fig
                      src="/work/ipc-ecosystem/menu.jpg"
                      alt="IPC prototype navigation menu"
                      caption="Navigation"
                    />
                    <Fig
                      src="/work/ipc-ecosystem/modal.jpg"
                      alt="IPC prototype modal dialog"
                      caption="Modal detail"
                    />
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
                      <Fig
                        src={`/work/graphic-design/${piece.file}.jpg`}
                        alt={piece.alt}
                        caption={piece.caption}
                      />
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
          <ParticleWordmark />
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
                Lately: AI tooling, and what a design engineer actually is.
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
