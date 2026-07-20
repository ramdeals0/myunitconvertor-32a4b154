import { CATEGORIES } from "./converters/data";
import type { Category, Unit } from "./converters/types";

export interface ParsedQuery {
  category: Category;
  from: Unit;
  to: Unit;
  value: number;
  /** Optional second component for compound inputs like "5 ft 11 in" — already converted into `value` in the `from` unit. */
  compound?: boolean;
}

// Priority order — when a token matches multiple categories, prefer earlier.
const CATEGORY_PRIORITY = [
  "length", "weight", "temperature", "volume", "area", "time", "speed",
  "energy", "power", "pressure", "data", "frequency", "angle", "fuel",
];

function norm(s: string) {
  return s.toLowerCase().replace(/[°\s.]/g, "").replace(/[_-]+/g, "");
}

function unitMatches(u: Unit, token: string) {
  const t = norm(token);
  if (!t) return false;
  if (norm(u.id) === t) return true;
  if (norm(u.symbol) === t) return true;
  if (norm(u.name) === t) return true;
  if (norm(u.name) + "s" === t) return true; // plural
  if (norm(u.name) === t.replace(/s$/, "")) return true;
  if (u.aliases?.some((a) => norm(a) === t)) return true;
  return false;
}

function sortedCategories(): Category[] {
  const ordered: Category[] = [];
  for (const id of CATEGORY_PRIORITY) {
    const c = CATEGORIES.find((x) => x.id === id);
    if (c) ordered.push(c);
  }
  for (const c of CATEGORIES) if (!ordered.includes(c)) ordered.push(c);
  return ordered;
}

function findUnit(token: string, restrictTo?: Category): Array<{ cat: Category; unit: Unit }> {
  const cats = restrictTo ? [restrictTo] : sortedCategories();
  const out: Array<{ cat: Category; unit: Unit }> = [];
  for (const c of cats) {
    for (const u of c.units) {
      if (unitMatches(u, token)) out.push({ cat: c, unit: u });
    }
  }
  return out;
}

const NUM_RE = /-?\d+(?:[.,]\d+)?/;

/**
 * Parse a freeform conversion query.
 * Examples:
 *   "5 ft 11 in to cm"
 *   "70 F in C"
 *   "250 grams to cups"
 *   "5km to miles"
 */
export function parseConversionQuery(raw: string): ParsedQuery | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!cleaned) return null;

  // Split around "to" / "in" / "=" / "->" / "into"
  const splitRe = /\s+(?:to|in|into|->|=>|=)\s+/;
  const parts = cleaned.split(splitRe);
  if (parts.length < 2) return null;
  const left = parts[0].trim();
  const right = parts.slice(1).join(" ").trim();

  // Right side: first token that matches a unit
  const rightTokens = right.split(/[\s,]+/).filter(Boolean);
  // Left side: extract number(s) + unit token(s)
  // Match pairs of "<num><unit>" or "<num> <unit>"
  const pairRe = new RegExp(`(${NUM_RE.source})\\s*([a-zA-Zµ°"'/²³]+)`, "g");
  const leftMatches: Array<{ value: number; token: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = pairRe.exec(left)) !== null) {
    const v = parseFloat(m[1].replace(",", "."));
    if (!isNaN(v)) leftMatches.push({ value: v, token: m[2] });
  }
  if (leftMatches.length === 0) return null;

  // Try each right-side token until one resolves
  for (const rTok of rightTokens) {
    const rCandidates = findUnit(rTok);
    if (!rCandidates.length) continue;

    // Try to find a category where left[0] unit matches AND right unit matches.
    for (const { cat: rCat, unit: rUnit } of rCandidates) {
      const lCandidates = findUnit(leftMatches[0].token, rCat);
      if (!lCandidates.length) continue;
      const fromUnit = lCandidates[0].unit;

      // Compound: accumulate left matches all in same category, summed in `from` unit's base value
      if (leftMatches.length > 1) {
        let baseTotal = fromUnit.toBase(leftMatches[0].value);
        let allMatched = true;
        for (let i = 1; i < leftMatches.length; i++) {
          const cand = findUnit(leftMatches[i].token, rCat);
          if (!cand.length) { allMatched = false; break; }
          baseTotal += cand[0].unit.toBase(leftMatches[i].value);
        }
        if (!allMatched) continue;
        const valueInFrom = fromUnit.fromBase(baseTotal);
        return { category: rCat, from: fromUnit, to: rUnit, value: valueInFrom, compound: true };
      }

      return { category: rCat, from: fromUnit, to: rUnit, value: leftMatches[0].value };
    }
  }

  return null;
}

