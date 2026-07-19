#!/usr/bin/env node
/**
 * Asset pipeline. Downscales only, never upscales.
 *
 * The previous script used `sips -Z 2000`, which resamples in BOTH directions.
 * Anything whose source was smaller than the target got blown up: 8 of the 14
 * graphic design assets and 24 of the 37 product screenshots shipped larger
 * than the pixels they actually had. Worst case, the Compliance3 business card
 * came from a 238x156 raster and shipped at 2000px wide. Upscaling cannot add
 * detail; it only adds blur and bytes, so this script refuses to do it.
 *
 * Two rules:
 *   1. target width = min(cap, true source width). Never above the source.
 *   2. Assets whose source is vector are rendered from the vector at the cap,
 *      because there the cap is the only real limit.
 *
 * Caps come from how wide the image is actually displayed. The container is
 * 72rem and a featured figure occupies 7 of 12 columns, so it renders at about
 * 640 CSS px: 1600 is a comfortable 2x. Contact sheet thumbs are far smaller,
 * so they cap lower.
 *
 * Usage:  node scripts/images.mjs /path/to/extracted-archive [--dry]
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename } from "node:path";

const ARCHIVE = process.argv[2];
const DRY = process.argv.includes("--dry");
const ROOT = new URL("..", import.meta.url).pathname;
const OUT_ROOT = join(ROOT, "public/work");

if (!ARCHIVE || !existsSync(ARCHIVE)) {
  console.error("usage: node scripts/images.mjs <extracted-archive-root> [--dry]");
  process.exit(1);
}

/**
 * Caps bound BOTH axes. A width-only cap is wrong here: several screenshots are
 * full-page scrolls (hundo/employers is 2880x9334), and capping only width
 * would scale one of those to 1600x5185, which is far more pixels than the
 * upscaled file it replaces. The scale factor is min(capW/srcW, capH/srcH, 1),
 * so the 1 term is what makes upscaling structurally impossible.
 */
const FEATURED = { w: 1600, h: 2400 }; // work entry figures, ~640 CSS px at 2x
const SHEET = { w: 1200, h: 1600 }; // graphic design contact sheet thumbs

/**
 * Sources are matched by basename rather than full path: the archive has
 * inconsistent nesting and several near-duplicate directories, and a basename
 * match that reports its resolved path is easier to audit than a long literal.
 */
const MANIFEST = [
  // --- graphic design contact sheet ---------------------------------------
  { out: "graphic-design/compliance3-stationery.jpg", src: "C3_stationery.jpg", cap: SHEET },
  { out: "graphic-design/compliance3-bizcard.jpg", vector: "C3.pdf", cap: SHEET,
    // The card face on the portfolio page, cropped just inside its hairline
    // frame. Rendered at 900dpi then downscaled, so it is genuinely sharp.
    crop: { r: 900, x: 3891, y: 5334, w: 2940, h: 1926 } },
  { out: "graphic-design/janet-taylor-stationery.jpg", src: "JTC_stationery.jpg", cap: SHEET },
  { out: "graphic-design/janet-taylor-bizcard.jpg", src: "JTC_mockup_bizcard.png", cap: SHEET },
  { out: "graphic-design/hundo-top-trumps.jpg", src: "hundo-trump-cards.png", cap: SHEET },
  { out: "graphic-design/hundo-trump-card-single.jpg", src: "hundo100_TIMMU_TOKE.png", cap: SHEET },
  { out: "graphic-design/sensee-flyer-front.jpg", src: "SENSEE - flyer-front.png", cap: SHEET },
  { out: "graphic-design/sensee-flyer-back.jpg", src: "SENSEE - flyer-back.png", cap: SHEET },
  { out: "graphic-design/sensee-newsletter-1.jpg", src: "SENSEE - newsletter-1.png", cap: SHEET },
  { out: "graphic-design/sensee-newsletter-2.jpg", src: "SENSEE - Newsletter#2_pg6.png", cap: SHEET },
  { out: "graphic-design/okappy-adwords.jpg", src: "OKAPPY-adwords.png", cap: SHEET },

  // --- hundo ---------------------------------------------------------------
  { out: "hundo/desktop-1.jpg", src: "hundo-1-desktop.png", cap: FEATURED },
  { out: "hundo/desktop-2.jpg", src: "hundo-2-desktop.png", cap: FEATURED },
  { out: "hundo/desktop-3.jpg", src: "hundo-3-desktop.png", cap: FEATURED },
  { out: "hundo/employers.jpg", src: "Employers-hundo.png", cap: FEATURED },
  { out: "hundo/trump-cards.jpg", src: "hundo-trump-cards.png", cap: FEATURED },
  { out: "hundo/mobile-1.jpg", src: "hundo-1.png", cap: FEATURED },
  { out: "hundo/mobile-2.jpg", src: "hundo-2.png", cap: FEATURED },
  // 450x685 source. The honest ceiling is far below the slot it sits in.
  { out: "hundo/learn-tablet.jpg", src: "learn2-tablet.png", cap: FEATURED },

  // --- IPC -----------------------------------------------------------------
  { out: "ipc-ecosystem/licensing.jpg", src: "IPC - eco-license.png", cap: FEATURED },
  { out: "ipc-ecosystem/menu.jpg", src: "IPC - eco-menu.png", cap: FEATURED },
  { out: "ipc-ecosystem/modal.jpg", src: "IPC - eco-modal.png", cap: FEATURED },
  { out: "ipc-ecosystem/table.jpg", src: "IPC - eco-table.png", cap: FEATURED },

  // --- Octopus Powerloop ---------------------------------------------------
  { out: "octopus-powerloop/desktop.jpg", src: "OCTOPUS - Powerloop - Desktop.png", cap: FEATURED },
  { out: "octopus-powerloop/tablet.jpg", src: "OCTOPUS - Powerloop - Tablet.png", cap: FEATURED },
  { out: "octopus-powerloop/dashboard-charge.jpg",
    src: "OCTOPUS - Powerloop - Dashboard (Charge only mode)@2x.png", cap: FEATURED },
  { out: "octopus-powerloop/dashboard-cycles.jpg",
    src: "Powerloop - Dashboard (12 completed cycles)@2x.png", cap: FEATURED },
  { out: "octopus-powerloop/history.jpg", src: "Powerloop - History@2x.png", cap: FEATURED },

  // --- Okappy --------------------------------------------------------------
  { out: "okappy/db-list.jpg", src: "OKAPPY - Customers_DB_list.png", cap: FEATURED },
  { out: "okappy/db-list-hover.jpg", src: "OKAPPY - Customers_DB_list-hover.png", cap: FEATURED },
  { out: "okappy/db-list-click.jpg", src: "OKAPPY - Customers_DB_list-click.png", cap: FEATURED },
  { out: "okappy/db-concept-1.jpg", src: "OKAPPY - Customers_DB_1.png", cap: FEATURED },
  { out: "okappy/db-concept-2.jpg", src: "OKAPPY - Customers_DB_2.png", cap: FEATURED },
  { out: "okappy/connections-notes.jpg", src: "OKAPPY-connex-1.jpg", cap: FEATURED },
  { out: "okappy/home.jpg", src: "OKAPPY - home.png", cap: FEATURED },

  // --- PwC Consulting Source ----------------------------------------------
  { out: "pwc-consulting-source/search-desktop.jpg", src: "1. PA XP - Updated search results - Info btn + Updated info strip [Desktop].png", cap: FEATURED },
  { out: "pwc-consulting-source/search-filters.jpg", src: "2. Search results - Show filters.png", cap: FEATURED },
  { out: "pwc-consulting-source/search-mobile.jpg",
    src: "3. Search results - Selected filters [Mobile].png", cap: FEATURED },
  { out: "pwc-consulting-source/methodology-light.jpg",
    src: "CS - Methodolgy Light (Tablet - 768px) Copy.png", cap: FEATURED },
  { out: "pwc-consulting-source/overview.jpg", src: "Play_Consulting_Source Copy.png", cap: FEATURED },

  // --- Redington FRANK-E ---------------------------------------------------
  { out: "redington-frank-e/dashboard.jpg", src: "FRANK-E - Dashboard.png", cap: FEATURED },
  { out: "redington-frank-e/compliance.jpg", src: "FRANK-E - Compliance.png", cap: FEATURED },
  { out: "redington-frank-e/login.jpg", src: "FRANK-E - Log-in.png", cap: FEATURED },
  { out: "redington-frank-e/company-stats.jpg", src: "FRANK-E - Company Stats.png", cap: FEATURED },
  { out: "redington-frank-e/governance.jpg", src: "FRANK-E - Administration, Service & Governance.png", cap: FEATURED },

  // Passionfruit is deliberately absent: nothing in the archive matches those
  // three screens, so their true resolution is unknown and re-exporting them
  // from the shipped files would only launder the existing guess. They need a
  // fresh export from the live design file.
];

/** Index the archive once by basename, so manifest entries stay readable. */
function indexArchive(root) {
  const byName = new Map();
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (!byName.has(e.name)) byName.set(e.name, p);
    }
  };
  walk(root);
  return byName;
}

const dims = (file) => {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
    encoding: "utf8",
  });
  return {
    w: Number(out.match(/pixelWidth:\s*(\d+)/)?.[1]),
    h: Number(out.match(/pixelHeight:\s*(\d+)/)?.[1]),
  };
};

const index = indexArchive(ARCHIVE);
const rows = [];
const missing = [];

for (const item of MANIFEST) {
  const dest = join(OUT_ROOT, item.out);
  mkdirSync(dirname(dest), { recursive: true });

  // --- vector path: the cap is the only real ceiling ------------------------
  if (item.vector) {
    const src = index.get(item.vector);
    if (!src) {
      missing.push(`${item.out}  (vector ${item.vector})`);
      continue;
    }
    const tmp = join(ROOT, ".img-tmp");
    mkdirSync(tmp, { recursive: true });
    const stem = join(tmp, basename(item.out, ".jpg"));
    if (!DRY) {
      const { r, x, y, w, h } = item.crop;
      execFileSync("pdftocairo", [
        "-png", "-r", String(r),
        "-x", String(x), "-y", String(y), "-W", String(w), "-H", String(h),
        src, stem,
      ]);
      const rendered = `${stem}-1.png`;
      execFileSync("sips", [
        "--resampleWidth", String(item.cap.w),
        "-s", "format", "jpeg", "-s", "formatOptions", "82",
        rendered, "--out", dest,
      ]);
    }
    rows.push({
      out: item.out,
      srcW: "vector",
      cap: item.cap.w,
      shipped: item.cap.w,
      note: "rendered from vector",
    });
    continue;
  }

  // --- raster path: never exceed the source --------------------------------
  const src = index.get(item.src);
  if (!src) {
    missing.push(`${item.out}  (looked for "${item.src}")`);
    continue;
  }
  const { w: srcW, h: srcH } = dims(src);
  // The `1` is the whole point: scale can shrink but never grow.
  const scale = Math.min(item.cap.w / srcW, item.cap.h / srcH, 1);
  const target = Math.round(srcW * scale);

  if (!DRY) {
    if (scale < 1) {
      execFileSync("sips", [
        "--resampleWidth", String(target),
        "-s", "format", "jpeg", "-s", "formatOptions", "82",
        src, "--out", dest,
      ]);
    } else {
      // Already within both caps. Re-encode at native size, no resample.
      execFileSync("sips", [
        "-s", "format", "jpeg", "-s", "formatOptions", "82",
        src, "--out", dest,
      ]);
    }
  }

  rows.push({
    out: item.out,
    srcW: `${srcW}x${srcH}`,
    cap: item.cap.w,
    shipped: target,
    note: scale === 1 ? "source-limited" : "downscaled",
  });
}

// --- report ---------------------------------------------------------------
const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${pad("asset", 46)} ${pad("src", 8)} ${pad("shipped", 8)} note`);
console.log("-".repeat(84));
for (const r of rows) {
  console.log(`${pad(r.out, 46)} ${pad(r.srcW, 8)} ${pad(r.shipped, 8)} ${r.note}`);
}

const limited = rows.filter((r) => r.note === "source-limited" && r.shipped < r.cap);
if (limited.length) {
  console.log(`\nSource-limited (shipped below the ${FEATURED.w}/${SHEET.w} cap because the source ran out):`);
  for (const r of limited) console.log(`  ${pad(r.out, 46)} ${r.shipped}px`);
}
if (missing.length) {
  console.log("\nNOT FOUND in archive:");
  for (const m of missing) console.log(`  ${m}`);
}
console.log(`\n${rows.length} written, ${missing.length} missing.${DRY ? " (dry run)" : ""}`);
