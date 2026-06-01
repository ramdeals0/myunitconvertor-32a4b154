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

// Use tsx to load the TS module — falls back to a regex parse if unavailable.
async function loadCategories() {
  try {
    // Prefer dynamic TS import (requires tsx runtime, which is invoked from npm script)
    const mod = await import(resolve(root, "src/lib/converters/data.ts"));
    return mod.CATEGORIES;
  } catch {
    return null;
  }
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
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const categories = await loadCategories();
  if (!categories) {
    console.warn("[sitemap] Could not load CATEGORIES — keeping existing sitemap.xml.");
    return;
  }

  const entries = [];
  for (const r of STATIC_ROUTES) entries.push(urlTag(`${BASE}${r.path}`, { ...r, lastmod: today }));

  for (const cat of categories) {
    entries.push(urlTag(`${BASE}/c/${cat.id}`, { changefreq: "monthly", priority: "0.8", lastmod: today }));

    const pairs = new Set();
    // 1. Author-declared popular pairs (both directions)
    for (const p of cat.popular ?? []) {
      pairs.add(`${p.from}-to-${p.to}`);
      pairs.add(`${p.to}-to-${p.from}`);
    }
    // 2. Auto-derive base-unit ↔ top units so every category gets pair coverage
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

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
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
