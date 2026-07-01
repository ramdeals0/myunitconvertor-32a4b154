#!/usr/bin/env node
/**
 * expand-pseo-grid.mjs
 *
 * Programmatically expands src/lib/converters/pseo-grid.csv beyond the initial
 * hand-authored launch set by:
 *   1. Adding every category × popular-pair combination from data.ts that
 *      isn't already listed.
 *   2. Adding a hand-picked long-tail set of high-intent pairs across
 *      cooking, engineering and everyday categories informed by Semrush
 *      search-volume research on unitconverters.net + rapidtables.com
 *      top pages.
 *
 * Idempotent — running twice makes no changes. Preserves existing rows verbatim.
 *
 * Run: `bunx tsx scripts/expand-pseo-grid.mjs`
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const CSV_PATH = resolve(root, "src/lib/converters/pseo-grid.csv");
const BASE_URL = "https://turbounitconverter.com";

const { CATEGORIES, convert } = await import(resolve(root, "src/lib/converters/data.ts"));

// ---------- CSV parse / serialize ----------
function parseCsv(text) {
  const rows = [];
  let row = [], cur = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else { inQ = false; }
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") { row.push(cur); cur = ""; }
    else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
    else if (ch !== "\r") cur += ch;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
}

function csvField(v) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}
function csvLine(fields) { return fields.map(csvField).join(","); }

// ---------- Extra long-tail pairs (Semrush-informed, high intent) ----------
// Each entry: [categoryId, fromUnitId, toUnitId, searchVolumeEst]
const LONG_TAIL_PAIRS = [
  // Length — micro/precision
  ["length", "um", "in", 2900],
  ["length", "in", "um", 2400],
  ["length", "mm", "ft", 4400],
  ["length", "ft", "mm", 3600],
  ["length", "m", "in", 8100],
  ["length", "in", "m", 6600],
  ["length", "km", "ft", 3600],
  ["length", "ft", "km", 2400],
  ["length", "yd", "m", 9900],
  ["length", "m", "yd", 6600],
  ["length", "yd", "in", 2400],
  ["length", "in", "yd", 1900],
  ["length", "nmi", "km", 3600],
  ["length", "nmi", "mi", 2900],
  // Weight — everyday cooking/fitness
  ["weight", "kg", "st", 27100],
  ["weight", "st", "kg", 22200],
  ["weight", "lb", "g", 12100],
  ["weight", "g", "lb", 9900],
  ["weight", "oz", "kg", 4400],
  ["weight", "kg", "oz", 3600],
  ["weight", "mg", "oz", 1600],
  // Volume — cooking is huge
  ["volume", "ml", "l", 27100],
  ["volume", "l", "ml", 22200],
  ["volume", "gal_us", "l", 40500],
  ["volume", "l", "gal_us", 33100],
  ["volume", "qt_us", "l", 8100],
  ["volume", "pt_us", "l", 4400],
  ["volume", "cup_us", "ml", 27100],
  ["volume", "ml", "cup_us", 22200],
  ["volume", "tbsp_us", "ml", 18100],
  ["volume", "ml", "tbsp_us", 12100],
  ["volume", "tsp_us", "ml", 27100],
  ["volume", "ml", "tsp_us", 22200],
  ["volume", "cup_us", "tbsp_us", 40500],
  ["volume", "tbsp_us", "cup_us", 33100],
  ["volume", "cup_us", "tsp_us", 33100],
  ["volume", "tsp_us", "tbsp_us", 90500],
  ["volume", "tbsp_us", "tsp_us", 74000],
  ["volume", "floz_us", "ml", 22200],
  ["volume", "ml", "floz_us", 18100],
  ["volume", "floz_us", "l", 4400],
  ["volume", "gal_uk", "l", 6600],
  ["volume", "l", "gal_uk", 4400],
  // Temperature — massive
  ["temperature", "c", "f", 165000],
  ["temperature", "f", "c", 201000],
  ["temperature", "c", "k", 12100],
  ["temperature", "k", "c", 8100],
  ["temperature", "f", "k", 3600],
  // Area
  ["area", "sqft", "sqm", 27100],
  ["area", "sqm", "sqft", 22200],
  ["area", "acre", "sqft", 12100],
  ["area", "sqft", "acre", 8100],
  ["area", "acre", "ha", 6600],
  ["area", "ha", "acre", 5400],
  ["area", "acre", "sqm", 4400],
  ["area", "sqm", "acre", 3600],
  ["area", "sqkm", "sqmi", 2900],
  ["area", "sqmi", "sqkm", 2400],
  ["area", "sqyd", "sqft", 1900],
  ["area", "sqin", "sqcm", 1600],
  // Speed
  ["speed", "kph", "mph", 33100],
  ["speed", "mph", "kph", 27100],
  ["speed", "mps", "kph", 6600],
  ["speed", "mps", "mph", 4400],
  ["speed", "knot", "kph", 3600],
  ["speed", "knot", "mph", 2900],
  ["speed", "fps", "mph", 2400],
  // Pressure
  ["pressure", "psi", "bar", 12100],
  ["pressure", "bar", "psi", 9900],
  ["pressure", "psi", "kpa", 6600],
  ["pressure", "kpa", "psi", 5400],
  ["pressure", "atm", "psi", 3600],
  ["pressure", "atm", "bar", 2400],
  ["pressure", "mmhg", "kpa", 1900],
  ["pressure", "pa", "psi", 1600],
  // Energy
  ["energy", "kj", "kcal", 8100],
  ["energy", "kcal", "kj", 6600],
  ["energy", "j", "cal", 3600],
  ["energy", "kwh", "j", 2900],
  ["energy", "btu", "j", 2400],
  // Power
  ["power", "hp", "kw", 27100],
  ["power", "kw", "hp", 22200],
  ["power", "w", "kw", 8100],
  ["power", "kw", "w", 6600],
  // Time
  ["time", "min", "s", 12100],
  ["time", "h", "min", 8100],
  ["time", "d", "h", 4400],
  ["time", "wk", "d", 6600],
  ["time", "y", "d", 3600],
  ["time", "y", "mo", 2900],
  // Frequency
  ["frequency", "hz", "khz", 2900],
  ["frequency", "mhz", "hz", 2400],
  ["frequency", "ghz", "mhz", 1900],
  // Angle
  ["angle", "deg", "rad", 8100],
  ["angle", "rad", "deg", 6600],
  ["angle", "grad", "deg", 1600],
  // Data
  ["data", "mb", "gb", 12100],
  ["data", "gb", "mb", 9900],
  ["data", "kb", "mb", 8100],
  ["data", "gb", "tb", 4400],
  ["data", "byte", "kb", 2400],
  ["data", "mib", "mb", 1900],
  // Fuel economy
  ["fuel", "mpg_us", "l_100km", 8100],
  ["fuel", "l_100km", "mpg_us", 6600],
  ["fuel", "mpg_uk", "l_100km", 3600],
  ["fuel", "kml", "mpg_us", 2400],
];

// ---------- Load existing CSV ----------
const raw = readFileSync(CSV_PATH, "utf8");
const rows = parseCsv(raw);
const header = rows[0];
const body = rows.slice(1);

const H = Object.fromEntries(header.map((n, i) => [n, i]));
const existing = new Set(body.map((r) => `${r[H.category]}/${r[H.slug]}`));

// ---------- Helpers to build a row ----------
function findUnit(cat, id) { return cat.units.find((u) => u.id === id); }
function slug(fromId, toId) {
  // Strip common suffixes to keep slugs clean (e.g. cup_us → cup)
  const norm = (s) => s.replace(/_us$/, "").replace(/_uk$/, "-uk");
  return `${norm(fromId)}-to-${norm(toId)}`;
}
function humanize(name) { return name.replace(/\s*\(.*?\)\s*/g, "").trim(); }

function buildRow(catId, fromId, toId, vol) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  if (!cat) return null;
  const fu = findUnit(cat, fromId);
  const tu = findUnit(cat, toId);
  if (!fu || !tu) return null;
  const s = slug(fromId, toId);
  const key = `${catId}/${s}`;
  if (existing.has(key)) return null;
  existing.add(key);
  let factor = "";
  try {
    const one = convert(1, fu, tu);
    factor = Number.isFinite(one) ? String(Number(one.toPrecision(8))) : "";
  } catch { factor = ""; }
  const fromLabel = humanize(fu.name);
  const toLabel = humanize(tu.name);
  const primary = `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`;
  const title = `${fu.symbol} to ${tu.symbol} — Convert ${fromLabel} to ${toLabel} | Turbo Unit Converter`;
  const h1 = `${fu.symbol} to ${tu.symbol} Converter`;
  const desc = factor
    ? `Convert ${fromLabel} (${fu.symbol}) to ${toLabel} (${tu.symbol}) instantly. 1 ${fu.symbol} = ${factor} ${tu.symbol}. Free, accurate, engineering-grade precision.`
    : `Convert ${fromLabel} (${fu.symbol}) to ${toLabel} (${tu.symbol}) instantly. Free, accurate, engineering-grade precision.`;
  const secondary = [
    `${fu.symbol} to ${tu.symbol}`,
    `convert ${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()}`,
    `how many ${toLabel.toLowerCase()} in a ${fromLabel.toLowerCase()}`,
    `${fromLabel.toLowerCase()} in ${toLabel.toLowerCase()}`,
    `${fu.symbol} to ${tu.symbol} converter`,
    `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} formula`,
    `${fromLabel.toLowerCase()} to ${toLabel.toLowerCase()} calculator`,
  ].join(" | ");
  return [
    catId, fromId, toId, fu.symbol, tu.symbol, s,
    `${BASE_URL}/c/${catId}/${s}`,
    title, h1, desc, primary, secondary, String(vol), factor,
  ];
}

// ---------- Build new rows ----------
const added = [];

// 1) From data.ts popular pairs
for (const cat of CATEGORIES) {
  if (!Array.isArray(cat.popular)) continue;
  for (const p of cat.popular) {
    const row = buildRow(cat.id, p.from, p.to, 500);
    if (row) added.push(row);
  }
}

// 2) Long-tail set
for (const [catId, fromId, toId, vol] of LONG_TAIL_PAIRS) {
  const row = buildRow(catId, fromId, toId, vol);
  if (row) added.push(row);
}

// ---------- Write ----------
if (added.length === 0) {
  console.log("[expand-pseo] no new rows to add — CSV already up to date.");
  process.exit(0);
}

const out = [
  header.join(","),
  ...body.map((r) => csvLine(r)),
  ...added.map((r) => csvLine(r)),
].join("\n") + "\n";

writeFileSync(CSV_PATH, out);
console.log(`[expand-pseo] added ${added.length} new pairs (total: ${body.length + added.length}).`);
