#!/usr/bin/env tsx
/**
 * generate-pseo.ts — Deterministic pSEO content generator.
 *
 * Loops every category × pair in the converters config, calls a pluggable
 * content provider (default: deterministic template provider, no AI), and
 * writes JSON to src/generated/conversions/{category}/{slug}.json.
 *
 * Category hubs are written to src/generated/categories/{category}.json.
 *
 * Flags:
 *   --category=<id>     Only generate pages for one category (repeatable)
 *   --pair=<from-to-to> Only generate one pair (requires --category)
 *   --type=category|pair  Restrict to a page type (default: both)
 *   --force             Overwrite existing JSON files
 *   --dry-run           Report what would be written, write nothing
 *
 * Examples:
 *   bunx tsx scripts/generate-pseo.ts --category=length
 *   bunx tsx scripts/generate-pseo.ts --type=pair --force
 *   bunx tsx scripts/generate-pseo.ts --dry-run
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

import { CATEGORIES, convert, formatResult as rawFormatResult } from "../src/lib/converters/data";
const formatResult = (v: number): string => {
  try { return rawFormatResult(v); } catch { return Number(v).toExponential(6); }
};
import type { Category, Unit } from "../src/lib/converters/types";

// ---------- pSEO CSV loader (tsx-safe; avoids the Vite ?raw import) ----------

interface PseoOverride {
  category: string;
  slug: string;
  pageTitle: string;
  h1: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
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

const PSEO_INDEX: Map<string, PseoOverride> = (() => {
  const map = new Map<string, PseoOverride>();
  const csvPath = join(dirname(fileURLToPath(import.meta.url)), "..", "src/lib/converters/pseo-grid.csv");
  if (!existsSync(csvPath)) return map;
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  if (!rows.length) return map;
  const [header, ...body] = rows;
  const idx = (n: string) => header.indexOf(n);
  const cCat = idx("category"), cSlug = idx("slug"), cTitle = idx("page_title"),
        cH1 = idx("h1"), cDesc = idx("meta_description"),
        cPk = idx("primary_keyword"), cSk = idx("secondary_keywords");
  for (const r of body) {
    if (!r[cCat] || !r[cSlug]) continue;
    map.set(`${r[cCat]}/${r[cSlug]}`, {
      category: r[cCat], slug: r[cSlug],
      pageTitle: r[cTitle] ?? "", h1: r[cH1] ?? "", metaDescription: r[cDesc] ?? "",
      primaryKeyword: r[cPk] ?? "",
      secondaryKeywords: (r[cSk] ?? "").split("|").map((s) => s.trim()).filter(Boolean),
    });
  }
  return map;
})();

const getPseoOverride = (cat: string, slug: string) => PSEO_INDEX.get(`${cat}/${slug}`);
const listPseoEntries = () => Array.from(PSEO_INDEX.values());

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_PAIRS = join(ROOT, "src/generated/conversions");
const OUT_CATS = join(ROOT, "src/generated/categories");
const BASE_URL = "https://turbounitconverter.com";

// ---------- Types ----------

export type PageType = "category" | "pair";

export interface GeneratedConversionContent {
  meta: { title: string; description: string; h1: string };
  content: {
    intro: string;
    result_section: string;
    formula_section: string;
    conversion_table: string;
    use_cases: string;
    tips: string;
    faq: string;
  };
  internal_links: { anchor: string; href: string }[];
  seo: {
    canonicalSlug: string;
    canonicalUrl: string;
    category: string;
    pageType: PageType;
    keywords?: string[];
    noindex?: boolean;
  };
  /** Hash of inputs so reruns are stable and we can detect drift. */
  contentHash: string;
}

interface PairTarget {
  type: "pair";
  category: Category;
  from: Unit;
  to: Unit;
  slug: string;
}
interface CategoryTarget {
  type: "category";
  category: Category;
  slug: string;
}
type Target = PairTarget | CategoryTarget;

// ---------- CLI parsing ----------

function parseArgs(argv: string[]) {
  const out = {
    categories: new Set<string>(),
    pairs: new Set<string>(),
    type: null as PageType | null,
    force: false,
    dryRun: false,
  };
  for (const a of argv.slice(2)) {
    if (a === "--force") out.force = true;
    else if (a === "--dry-run") out.dryRun = true;
    else if (a.startsWith("--category=")) out.categories.add(a.slice("--category=".length));
    else if (a.startsWith("--pair=")) out.pairs.add(a.slice("--pair=".length));
    else if (a.startsWith("--type=")) {
      const t = a.slice("--type=".length);
      if (t !== "category" && t !== "pair") throw new Error(`--type must be category|pair (got ${t})`);
      out.type = t;
    } else {
      console.warn(`[pseo] Ignoring unknown arg: ${a}`);
    }
  }
  return out;
}

// ---------- Target enumeration ----------

function pairSlug(from: Unit, to: Unit): string {
  // Match Pair.tsx's expected slug pattern: <fromId>-to-<toId>
  return `${from.id}-to-${to.id}`.toLowerCase();
}

function enumerateTargets(args: ReturnType<typeof parseArgs>): Target[] {
  const cats = args.categories.size
    ? CATEGORIES.filter((c) => args.categories.has(c.id))
    : CATEGORIES;

  const out: Target[] = [];

  if (args.type !== "pair") {
    for (const c of cats) out.push({ type: "category", category: c, slug: c.id });
  }

  if (args.type !== "category") {
    // Prefer the pSEO launch set first (CSV-driven); fall back to all category pairs.
    const launchKeys = new Set(listPseoEntries().map((e) => `${e.category}/${e.slug}`));
    for (const c of cats) {
      for (const f of c.units) {
        for (const t of c.units) {
          if (f.id === t.id) continue;
          const slug = pairSlug(f, t);
          if (args.pairs.size && !args.pairs.has(slug)) continue;
          // If pair filter not set and no category filter, restrict to launch set
          // to avoid generating thousands of files on first run.
          if (!args.pairs.size && !args.categories.size && !launchKeys.has(`${c.id}/${slug}`)) continue;
          out.push({ type: "pair", category: c, from: f, to: t, slug });
        }
      }
    }
  }
  return out;
}

// ---------- Deterministic template provider ----------
// This is the default "mock" provider: no AI call, no network, fully deterministic.
// Swap behind a Provider interface later to call Lovable AI Gateway.

function hash(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 12);
}

function renderPair(target: PairTarget): GeneratedConversionContent {
  const { category, from: f, to: t, slug } = target;
  const override = getPseoOverride(category.id, slug);
  const factor = convert(category, 1, f.id, t.id);
  const inverse = convert(category, 1, t.id, f.id);
  const factorStr = formatResult(factor);
  const inverseStr = formatResult(inverse);
  const fLabel = f.symbol;
  const tLabel = t.symbol;
  const fPlural = f.aliases?.[0] ?? `${f.name.toLowerCase()}s`;
  const tPlural = t.aliases?.[0] ?? `${t.name.toLowerCase()}s`;
  const canonicalUrl = `${BASE_URL}/c/${category.id}/${slug}`;

  const title = override?.pageTitle
    || `${fLabel} to ${tLabel} Converter — ${f.name} to ${t.name}`.slice(0, 65);
  const description = override?.metaDescription
    || `Convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}) instantly. 1 ${f.symbol} = ${factorStr} ${t.symbol}. Free, accurate, browser-based.`.slice(0, 160);
  const h1 = override?.h1 || `${f.name} to ${t.name} Converter`;

  const intro = `Convert ${fPlural} (${f.symbol}) to ${tPlural} (${t.symbol}) instantly. Both measure ${category.name.toLowerCase()}, so the relationship is strictly linear: each ${f.name.toLowerCase()} equals ${factorStr} ${tPlural}. Use the converter above for any value, or read on for the formula, a quick lookup table, and practical tips.`;

  const result_section = `One ${f.name.toLowerCase()} is equal to **${factorStr} ${tPlural}**. To go the other way, one ${t.name.toLowerCase()} equals **${inverseStr} ${fPlural}**. For everyday use, rounding to 2–4 decimal places is usually enough; for engineering or scientific work, keep the full precision shown by the converter.`;

  const formula_section = `The conversion is a single multiplication:\n\n> ${tPlural} = ${fPlural} × ${factorStr}\n\nWorked example — converting 10 ${fPlural}:\n\n10 × ${factorStr} = **${formatResult(convert(category, 10, f.id, t.id))} ${t.symbol}**.\n\nTo invert, divide by ${factorStr} (or multiply by ${inverseStr}).`;

  const tableRows = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000]
    .map((v) => `| ${v} ${f.symbol} | ${formatResult(convert(category, v, f.id, t.id))} ${t.symbol} |`)
    .join("\n");
  const conversion_table = `| ${fPlural} | ${tPlural} |\n| --- | --- |\n${tableRows}`;

  const use_cases = scenariosFor(category)
    .slice(0, 5)
    .map((s) => `- ${s}`)
    .join("\n");

  const tips = [
    `Keep the factor handy: 1 ${f.symbol} ≈ ${factorStr} ${t.symbol}. For rough mental math, round to the nearest sensible digit.`,
    `Mind the units. ${f.name} and ${t.name} both measure ${category.name.toLowerCase()}; squared or cubic variants need a different factor (factor², factor³).`,
    `When precision matters (engineering, lab work, dosing), avoid rounding mid-calculation — convert once at the final step using the full factor.`,
  ].join("\n\n");

  const faq = [
    `**Q:** How many ${tPlural} are in 1 ${f.name.toLowerCase()}?\n**A:** ${factorStr} ${tPlural}.`,
    `**Q:** What's the formula to convert ${f.symbol} to ${t.symbol}?\n**A:** ${tPlural} = ${fPlural} × ${factorStr}.`,
    `**Q:** How do I convert ${t.symbol} back to ${f.symbol}?\n**A:** Multiply by ${inverseStr} (or divide by ${factorStr}).`,
    `**Q:** Is rounding to 2 decimal places accurate enough?\n**A:** For most everyday uses, yes. For scientific or engineering work, use the full precision from the converter.`,
    `**Q:** Does this ${fLabel} to ${tLabel} converter work offline?\n**A:** Yes — all math runs in your browser, no network required after the page loads.`,
  ].join("\n\n");

  const reverseSlug = `${t.id}-to-${f.id}`;
  const internal_links = [
    { anchor: `${t.name} to ${f.name} converter`, href: `/c/${category.id}/${reverseSlug}` },
    { anchor: `All ${category.name.toLowerCase()} conversions`, href: `/c/${category.id}` },
  ];

  const keywords = override
    ? [override.primaryKeyword, ...override.secondaryKeywords].filter(Boolean)
    : [`${f.name.toLowerCase()} to ${t.name.toLowerCase()}`, `${f.symbol} to ${t.symbol}`, `convert ${f.symbol} to ${t.symbol}`];

  const payload = {
    meta: { title, description, h1 },
    content: { intro, result_section, formula_section, conversion_table, use_cases, tips, faq },
    internal_links,
    seo: {
      canonicalSlug: slug,
      canonicalUrl,
      category: category.id,
      pageType: "pair" as const,
      keywords,
    },
  };
  return { ...payload, contentHash: hash(JSON.stringify(payload) + factorStr) };
}

function renderCategory(target: CategoryTarget): GeneratedConversionContent {
  const { category } = target;
  const canonicalUrl = `${BASE_URL}/c/${category.id}`;
  const unitList = category.units.map((u) => `${u.name} (${u.symbol})`).join(", ");
  const title = `${category.name} Converter — Convert ${category.units[0]?.name} and More`.slice(0, 65);
  const description = `Free ${category.name.toLowerCase()} converter for ${category.units.length}+ units including ${category.units.slice(0, 3).map((u) => u.name).join(", ")}. Instant, accurate, browser-based.`.slice(0, 160);
  const h1 = `${category.name} Converter`;

  const intro = `${category.description} Convert between ${category.units.length} ${category.name.toLowerCase()} units instantly, with engineering-grade precision and no signup required.`;

  const result_section = `Pick any two units below to convert between them. The base unit for ${category.name.toLowerCase()} in this tool is **${category.baseUnit}**; every conversion routes through it for consistency.`;

  const formula_section = `Most ${category.name.toLowerCase()} conversions are a single multiplication by a fixed factor. Temperature is the notable exception — it uses additive offsets, not just multiplication. The converter handles both transparently.`;

  const conversion_table = `| Unit | Symbol |\n| --- | --- |\n${category.units.map((u) => `| ${u.name} | ${u.symbol} |`).join("\n")}`;

  const use_cases = scenariosFor(category).slice(0, 5).map((s) => `- ${s}`).join("\n");

  const tips = `Bookmark the conversions you use most — each pair has its own dedicated page with formulas, a lookup table, and FAQs.\n\nWhen working with derived units (area, volume), remember the factor scales with the dimension: a length factor f becomes f² for area and f³ for volume.`;

  const faq = [
    `**Q:** How accurate is this ${category.name.toLowerCase()} converter?\n**A:** It uses ${category.units.length} canonical unit definitions and 12-digit precision constants.`,
    `**Q:** Is it free?\n**A:** Yes — completely free, no signup, no limits.`,
    `**Q:** Which units are supported?\n**A:** ${unitList}.`,
  ].join("\n\n");

  // Pick top launch-set pair links if present.
  const launch = listPseoEntries().filter((e) => e.category === category.id).slice(0, 6);
  const internal_links = launch.length
    ? launch.map((e) => ({ anchor: e.h1 || e.primaryKeyword, href: `/c/${category.id}/${e.slug}` }))
    : category.units.slice(0, 4).flatMap((f) =>
        category.units
          .filter((t) => t.id !== f.id)
          .slice(0, 1)
          .map((t) => ({
            anchor: `${f.name} to ${t.name}`,
            href: `/c/${category.id}/${pairSlug(f, t)}`,
          })),
      );

  const payload = {
    meta: { title, description, h1 },
    content: { intro, result_section, formula_section, conversion_table, use_cases, tips, faq },
    internal_links,
    seo: {
      canonicalSlug: category.id,
      canonicalUrl,
      category: category.id,
      pageType: "category" as const,
      keywords: [`${category.name.toLowerCase()} converter`, `convert ${category.name.toLowerCase()}`],
    },
  };
  return { ...payload, contentHash: hash(JSON.stringify(payload)) };
}

function scenariosFor(category: Category): string[] {
  // Lightweight per-group scenario bank; kept local so this script has no UI deps.
  const byGroup: Record<string, string[]> = {
    common: [
      "Cooking and recipe conversions when switching between metric and imperial measurements.",
      "Travel planning where signage and maps use different unit systems.",
      "DIY and home-improvement projects that mix metric materials with imperial tools.",
      "Fitness tracking when devices report in one system and goals are set in another.",
      "Shipping and logistics where weight and dimensions drive cost.",
    ],
    engineering: [
      "Reading datasheets where SI and imperial units appear side by side.",
      "Cross-checking CAD drawings against fabrication specs in a different system.",
      "Converting torque, pressure, or stress values for procurement.",
      "Translating field measurements into engineering reports.",
      "Spec'ing parts from international suppliers.",
    ],
    heat: [
      "Cooking, baking, and oven temperature checks across recipes.",
      "Weather and climate comparisons across regions.",
      "HVAC sizing, where loads are quoted in BTU, kW, or tons.",
      "Lab work and material processing temperature setpoints.",
      "Industrial process control in mixed-unit environments.",
    ],
    fluids: [
      "Recipe scaling and bartending where measures span metric and imperial.",
      "Fuel economy comparisons across regions.",
      "Lab dosing and reagent prep across mL, L, and US/UK units.",
      "Aquarium, pool, and tank capacity calculations.",
      "Shipping fluid product specs across markets.",
    ],
    light: [
      "Photography exposure planning across lumen and lux references.",
      "Workspace lighting design to meet ergonomic targets.",
      "Display brightness and ambient-light comparisons.",
      "Plant-grow lighting setups.",
      "Stage and event lighting design.",
    ],
    electricity: [
      "Power supply sizing and load calculations.",
      "Battery capacity comparisons across mAh, Wh, and J.",
      "Electric vehicle range estimates.",
      "Solar and renewable system sizing.",
      "Lab and bench-test electrical measurements.",
    ],
    magnetism: [
      "MRI, NMR, and scientific-instrument field strength.",
      "Magnet selection for industrial holding applications.",
      "Sensor calibration in gauss vs tesla.",
      "Audio and speaker magnet specs.",
      "Magnetic shielding design.",
    ],
    radiology: [
      "Medical imaging dose tracking.",
      "Radiation protection calculations.",
      "Material activity assays.",
      "Lab radiation source labeling.",
      "Industrial NDT inspections.",
    ],
    other: [
      "Engineering reference and cross-discipline calculations.",
      "Scientific paper unit harmonization.",
      "International standards compliance.",
      "Procurement and supplier negotiation.",
      "Education and tutoring contexts.",
    ],
  };
  return byGroup[category.group] ?? byGroup.other;
}

// ---------- Writer ----------

interface WriteResult {
  path: string;
  wrote: boolean;
  skipped: "exists" | "dry-run" | null;
  content: GeneratedConversionContent;
}

function targetPath(t: Target): string {
  return t.type === "pair"
    ? join(OUT_PAIRS, t.category.id, `${t.slug}.json`)
    : join(OUT_CATS, `${t.slug}.json`);
}

function writeTarget(t: Target, force: boolean, dryRun: boolean): WriteResult {
  const path = targetPath(t);
  const content = t.type === "pair" ? renderPair(t) : renderCategory(t);
  if (dryRun) return { path, wrote: false, skipped: "dry-run", content };
  if (existsSync(path) && !force) return { path, wrote: false, skipped: "exists", content };
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(content, null, 2) + "\n", "utf8");
  return { path, wrote: true, skipped: null, content };
}

// ---------- Validation ----------

interface ValidationReport {
  total: number;
  written: number;
  skippedExists: number;
  duplicateTitles: string[][];
  duplicateDescriptions: string[][];
  duplicateSlugs: string[];
  thinContent: { path: string; chars: number }[];
}

const MIN_CONTENT_CHARS = 600;

function validate(results: WriteResult[]): ValidationReport {
  const byTitle = new Map<string, string[]>();
  const byDesc = new Map<string, string[]>();
  const slugCount = new Map<string, number>();
  const thin: { path: string; chars: number }[] = [];

  for (const r of results) {
    const m = r.content.meta;
    byTitle.set(m.title, [...(byTitle.get(m.title) ?? []), r.path]);
    byDesc.set(m.description, [...(byDesc.get(m.description) ?? []), r.path]);
    // Scope slug uniqueness per-category — same slug across categories is fine.
    const key = `${r.content.seo.category}/${r.content.seo.canonicalSlug}`;
    slugCount.set(key, (slugCount.get(key) ?? 0) + 1);
    const totalChars = Object.values(r.content.content).join(" ").length;
    if (totalChars < MIN_CONTENT_CHARS) thin.push({ path: r.path, chars: totalChars });
  }

  return {
    total: results.length,
    written: results.filter((r) => r.wrote).length,
    skippedExists: results.filter((r) => r.skipped === "exists").length,
    duplicateTitles: [...byTitle.values()].filter((a) => a.length > 1),
    duplicateDescriptions: [...byDesc.values()].filter((a) => a.length > 1),
    duplicateSlugs: [...slugCount.entries()].filter(([, n]) => n > 1).map(([s]) => s),
    thinContent: thin,
  };
}

function printReport(rep: ValidationReport, dryRun: boolean) {
  console.log("");
  console.log("─── pSEO generation report ───");
  console.log(`Targets:           ${rep.total}`);
  console.log(`Written:           ${rep.written}${dryRun ? " (dry-run)" : ""}`);
  console.log(`Skipped (exists):  ${rep.skippedExists}`);
  console.log(`Duplicate titles:  ${rep.duplicateTitles.length}`);
  console.log(`Duplicate descs:   ${rep.duplicateDescriptions.length}`);
  console.log(`Duplicate slugs:   ${rep.duplicateSlugs.length}`);
  console.log(`Thin pages (<${MIN_CONTENT_CHARS} chars): ${rep.thinContent.length}`);

  for (const group of rep.duplicateTitles.slice(0, 5)) {
    console.warn(`  ! duplicate title across:\n    - ${group.join("\n    - ")}`);
  }
  for (const thin of rep.thinContent.slice(0, 5)) {
    console.warn(`  ! thin (${thin.chars} chars): ${thin.path}`);
  }
  console.log("──────────────────────────────");
}

// ---------- Main ----------

async function main() {
  const args = parseArgs(process.argv);
  const targets = enumerateTargets(args);
  if (!targets.length) {
    console.log("[pseo] No targets matched filters. Exiting.");
    return;
  }
  console.log(`[pseo] ${args.dryRun ? "DRY RUN — " : ""}generating ${targets.length} targets…`);
  const results = targets.map((t) => writeTarget(t, args.force, args.dryRun));
  const rep = validate(results);
  printReport(rep, args.dryRun);

  if (rep.duplicateSlugs.length) {
    console.error("[pseo] FAIL: duplicate canonical slugs detected.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[pseo] ERROR:", err);
  process.exit(1);
});
