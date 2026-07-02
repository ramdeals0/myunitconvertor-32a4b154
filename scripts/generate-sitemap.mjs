#!/usr/bin/env node
/**
 * Auto-generates public/sitemap.xml from the CATEGORIES dataset so every
 * category page and every popular X→Y pair (both directions) is listed.
 * Runs via npm `predev` and `prebuild` hooks so the sitemap is always
 * in sync with the converter catalog.
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const BASE = "https://turbounitconverter.com";

// Supported UI locales — must match src/lib/i18n.tsx LOCALES.
// English lives at the root; other locales live under /{lang}/… prefixes.
const LOCALES = ["en", "es", "hi"];
const DEFAULT_LOCALE = "en";
function localePath(path, lang) {
  if (lang === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// Use tsx to load the TS module — falls back to a regex parse if unavailable.
async function loadCategories() {
  try {
    const mod = await import(resolve(root, "src/lib/converters/data.ts"));
    return mod.CATEGORIES;
  } catch {
    return null;
  }
}

// A URL entry with hreflang alternates for each supported UI locale.
function urlTagLocalized(path, { changefreq = "monthly", priority = "0.6", lastmod } = {}) {
  const loc = `${BASE}${path}`;
  const alternates = LOCALES.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}${localePath(path, l)}" />`,
  );
  alternates.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${localePath(path, DEFAULT_LOCALE)}" />`,
  );
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    ...alternates,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

function urlTag(loc, { changefreq = "monthly", priority = "0.6", lastmod } = {}) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/converters", changefreq: "weekly", priority: "0.9" },
  { path: "/learn", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/methodology", changefreq: "monthly", priority: "0.6" },
  { path: "/editorial-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

// Learning-centre articles — discovered by scanning src/content/articles/*.json.
async function loadArticleSlugs() {
  try {
    const { readdirSync } = await import("node:fs");
    const dir = resolve(root, "src/content/articles");
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const categories = await loadCategories();
  if (!categories) {
    console.warn("[sitemap] Could not load CATEGORIES — keeping existing sitemap.xml.");
    return;
  }

  // Load the pSEO launch set — the single source of truth for indexable pair pages.
  // Pairs outside this set still render (handled by Pair.tsx) but are intentionally
  // kept out of the sitemap so Google focuses crawl budget on the strong set.
  const { readFileSync } = await import("node:fs");
  const csvPath = resolve(root, "src/lib/converters/pseo-grid.csv");
  let pseoPairs = new Map(); // key: `${catId}/${slug}` -> true
  try {
    const raw = readFileSync(csvPath, "utf8");
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const header = lines.shift().split(",");
    const ci = (n) => header.indexOf(n);
    for (const line of lines) {
      // CSV cells are quoted; a simple split works because none of our values contain commas
      // outside of quotes — but to be safe, parse with a tiny state machine.
      const cells = [];
      let cur = "", inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQ) {
          if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
          else if (ch === '"') inQ = false;
          else cur += ch;
        } else if (ch === '"') inQ = true;
        else if (ch === ",") { cells.push(cur); cur = ""; }
        else cur += ch;
      }
      cells.push(cur);
      const cat = cells[ci("category")];
      const slug = cells[ci("slug")];
      if (cat && slug) pseoPairs.set(`${cat}/${slug}`, true);
    }
  } catch (err) {
    console.warn("[sitemap] could not read pseo-grid.csv, falling back to popular+auto pairs:", err.message);
  }

  const entries = [];
  // Static routes and category listings ship hreflang alternates for every
  // supported UI locale so Google can surface the right language per user.
  for (const r of STATIC_ROUTES) entries.push(urlTagLocalized(r.path, { ...r, lastmod: today }));

  const articleSlugs = await loadArticleSlugs();
  for (const slug of articleSlugs) {
    entries.push(urlTag(`${BASE}/learn/${slug}`, { changefreq: "monthly", priority: "0.8", lastmod: today }));
  }

  for (const cat of categories) {
    entries.push(urlTagLocalized(`/c/${cat.id}`, { changefreq: "monthly", priority: "0.8", lastmod: today }));
  }

  // Pair pages: only those in the pSEO launch set.
  if (pseoPairs.size > 0) {
    for (const key of pseoPairs.keys()) {
      const [catId, slug] = key.split("/");
      entries.push(urlTag(`${BASE}/c/${catId}/${slug}`, { changefreq: "monthly", priority: "0.7", lastmod: today }));
    }
  } else {
    // Fallback: original popular + auto-derived behavior
    for (const cat of categories) {
      const pairs = new Set();
      for (const p of cat.popular ?? []) {
        pairs.add(`${p.from}-to-${p.to}`);
        pairs.add(`${p.to}-to-${p.from}`);
      }
      const base = cat.baseUnit;
      const baseUnit = cat.units.find((u) => u.id === base);
      if (baseUnit) {
        const topUnits = cat.units.filter((u) => u.id !== base).slice(0, 6);
        for (const u of topUnits) {
          pairs.add(`${base}-to-${u.id}`);
          pairs.add(`${u.id}-to-${base}`);
        }
      }
      for (const pair of pairs) {
        entries.push(urlTag(`${BASE}/c/${cat.id}/${pair}`, { changefreq: "monthly", priority: "0.7", lastmod: today }));
      }
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  writeFileSync(resolve(root, "public/sitemap.xml"), xml);
  console.log(`[sitemap] wrote ${entries.length} urls to public/sitemap.xml`);
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(0); // don't break the build
});
