/** Light index of the page used by the command palette and machine surfaces. */

export type WorkRef = {
  id: string;
  name: string;
  meta: string;
  /**
   * Withheld from the site without being deleted from it. The entry keeps its
   * copy, its images and its markup; it is only filtered out of what renders.
   * Set this back to false (or drop the line) to bring one back, and check
   * nothing else needs to follow: the count in the work heading and the
   * VISIBLE_WORK filter are derived, but public/llms.txt and public/index.md
   * are hand-written and do not read this file.
   */
  hidden?: boolean;
};

export const WORK_INDEX: WorkRef[] = [
  { id: "passionfruit", name: "Passionfruit", meta: "current · marketplace to AI platform" },
  { id: "hundo", name: "hundo", meta: "learning platform · 2022" },
  { id: "pwc", name: "PwC, Consulting Source", meta: "enterprise knowledge system" },
  { id: "okappy", name: "Okappy", meta: "connections database & UX process", hidden: true },
  { id: "octopus", name: "Octopus Energy, Powerloop", meta: "gamified EV charging pilot" },
  { id: "redington", name: "Redington, FRANK-E", meta: "pensions dashboard", hidden: true },
  { id: "ipc", name: "IPC, Ecosystem prototype", meta: "fintech prototype, 50+ screens" },
  { id: "graphic-design", name: "Graphic design & branding", meta: "identity · print · campaign" },
];

/** What actually renders. Everything user-facing should read this, not the raw index. */
export const VISIBLE_WORK: WorkRef[] = WORK_INDEX.filter((w) => !w.hidden);

/** True for an entry that is currently withheld, so page.tsx can gate its markup. */
export const isHidden = (id: string): boolean =>
  WORK_INDEX.some((w) => w.id === id && w.hidden === true);

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  lead?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "His design and UX abilities speak for themselves but his way of working sets him apart from most others. He has a highly perceptive instinct for design that he uses to interrogate, challenge and fully understand what it is we’re trying to achieve; this makes briefing sessions highly productive and enjoyable. We couldn’t have done without him.",
    name: "Will Kemble-Clarkson",
    role: "CEO, Zen Exchange",
    lead: true,
  },
  {
    quote:
      "I have had the pleasure of working with Giacomo at both Play and hundo. Giacomo has a talent for distilling complexity into well thought-out and enjoyable to use product design deliverables. Giacomo was a key player in launching hundo.xyz. He was responsible for the full spectrum of design from user testing and UX to visual design. When I started building a new team at hundo, I didn’t think twice about reaching out to Giacomo.",
    name: "Scott Byrne-Fraser",
    role: "Technical Co-Founder, hundo",
  },
  {
    quote:
      "Giacomo’s UI/UX and Graphic Design work was instrumental in delivering our prototype product which secured funding from a Global Tier 1 Investment Bank for further development and testing. Throughout our early development cycles Giacomo brought clarity and focus to the UI/UX design process and delivered working concepts that introduced an ease of use and customer friendly GUI not often found in enterprise banking software.",
    name: "Harel Zanzuri",
    role: "VP Risk & Compliance Services, IPC",
  },
  {
    quote:
      "I have had the privilege of working with Giacomo for just over a year. He possesses one of the most outstanding creative minds I have had the opportunity to work with and his ability to translate ideas into fully formed, carefully considered, high quality deliverables is a huge asset to any project. He will always be a much valued member of the team that launched hundo. I cannot recommend him highly enough.",
    name: "Esther O'Callaghan OBE",
    role: "Founder, hundo",
    lead: true,
  },
  {
    quote:
      "He delivered excellent and well thought through changes, considering all of the elements and even creating an internal training document to ensure all parties were clear on usage and requirements. I would be happy to re-employ him as I consider him to have been a valuable member of the team, who consistently achieved excellent results and delivered all expectations.",
    name: "Nicola Snell",
    role: "Founder & MD, Press Loft",
  },
  {
    quote:
      "Giacomo’s work has enabled us to fast track Compliance3’s entry to a buoyant and highly competitive market. From brand design to priority applications, everything he has done has been of the highest standard and designed not just for today, but also with the longevity required to underpin our growth.",
    name: "Compliance3",
    role: "Client",
  },
];
