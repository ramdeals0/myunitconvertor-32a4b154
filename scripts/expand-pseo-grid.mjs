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
  ["volume", "mL", "L", 27100],
  ["volume", "L", "mL", 22200],
  ["volume", "gal_us", "L", 40500],
  ["volume", "L", "gal_us", 33100],
  ["volume", "qt", "L", 8100],
  ["volume", "pt", "L", 4400],
  ["volume", "cup", "mL", 27100],
  ["volume", "mL", "cup", 22200],
  ["volume", "tbsp", "mL", 18100],
  ["volume", "mL", "tbsp", 12100],
  ["volume", "tsp", "mL", 27100],
  ["volume", "mL", "tsp", 22200],
  ["volume", "cup", "tbsp", 40500],
  ["volume", "tbsp", "cup", 33100],
  ["volume", "cup", "tsp", 33100],
  ["volume", "tsp", "tbsp", 90500],
  ["volume", "tbsp", "tsp", 74000],
  ["volume", "floz", "mL", 22200],
  ["volume", "mL", "floz", 18100],
  ["volume", "floz", "L", 4400],
  ["volume", "gal_uk", "L", 6600],
  ["volume", "L", "gal_uk", 4400],
  ["volume", "gal_us", "qt", 3600],
  ["volume", "gal_us", "pt", 2400],
  ["volume", "gal_us", "cup", 3600],
  ["volume", "gal_us", "floz", 2900],
  // Temperature — massive
  ["temperature", "c", "f", 165000],
  ["temperature", "f", "c", 201000],
  ["temperature", "c", "k", 12100],
  ["temperature", "k", "c", 8100],
  ["temperature", "f", "k", 3600],
  ["temperature", "k", "f", 2400],
  ["temperature", "c", "r", 720],
  // Area
  ["area", "ft2", "m2", 27100],
  ["area", "m2", "ft2", 22200],
  ["area", "ac", "ft2", 12100],
  ["area", "ft2", "ac", 8100],
  ["area", "ac", "ha", 6600],
  ["area", "ha", "ac", 5400],
  ["area", "ac", "m2", 4400],
  ["area", "m2", "ac", 3600],
  ["area", "km2", "mi2", 2900],
  ["area", "mi2", "km2", 2400],
  ["area", "yd2", "ft2", 1900],
  ["area", "in2", "cm2", 1600],
  ["area", "cm2", "in2", 1900],
  // Speed
  ["speed", "kph", "mph", 33100],
  ["speed", "mph", "kph", 27100],
  ["speed", "mps", "kph", 6600],
  ["speed", "mps", "mph", 4400],
  ["speed", "knot", "kph", 3600],
  ["speed", "knot", "mph", 2900],
  ["speed", "fps", "mph", 2400],
  ["speed", "mach", "mph", 1900],
  // Pressure
  ["pressure", "psi", "bar", 12100],
  ["pressure", "bar", "psi", 9900],
  ["pressure", "psi", "kPa", 6600],
  ["pressure", "kPa", "psi", 5400],
  ["pressure", "atm", "psi", 3600],
  ["pressure", "atm", "bar", 2400],
  ["pressure", "mmHg", "kPa", 1900],
  ["pressure", "Pa", "psi", 1600],
  ["pressure", "MPa", "psi", 1600],
  ["pressure", "torr", "Pa", 1200],
  // Energy
  ["energy", "kJ", "kcal", 8100],
  ["energy", "kcal", "kJ", 6600],
  ["energy", "J", "cal", 3600],
  ["energy", "kWh", "J", 2900],
  ["energy", "BTU", "J", 2400],
  ["energy", "kWh", "BTU", 1900],
  // Power
  ["power", "hp", "kW", 27100],
  ["power", "kW", "hp", 22200],
  ["power", "W", "kW", 8100],
  ["power", "kW", "W", 6600],
  ["power", "MW", "hp", 1900],
  // Time
  ["time", "min", "s", 12100],
  ["time", "h", "min", 8100],
  ["time", "d", "h", 4400],
  ["time", "wk", "d", 6600],
  ["time", "yr", "d", 3600],
  ["time", "yr", "mo", 2900],
  ["time", "ms", "s", 1900],
  // Frequency
  ["frequency", "Hz", "kHz", 2900],
  ["frequency", "MHz", "Hz", 2400],
  ["frequency", "GHz", "MHz", 1900],
  ["frequency", "rpm", "Hz", 1600],
  // Angle
  ["angle", "deg", "rad", 8100],
  ["angle", "rad", "deg", 6600],
  ["angle", "grad", "deg", 1600],
  ["angle", "turn", "deg", 720],
  // Data
  ["data", "MB", "GB", 12100],
  ["data", "GB", "MB", 9900],
  ["data", "KB", "MB", 8100],
  ["data", "GB", "TB", 4400],
  ["data", "B", "KB", 2400],
  ["data", "MiB", "MB", 1900],
  ["data", "b", "B", 1600],
  ["data", "TB", "GB", 3600],
  // Fuel economy
  ["fuel", "mpg_us", "lp100km", 8100],
  ["fuel", "lp100km", "mpg_us", 6600],
  ["fuel", "mpg_uk", "lp100km", 3600],
  ["fuel", "kmpl", "mpg_us", 2400],
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
