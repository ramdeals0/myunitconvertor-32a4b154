// Build-time loader for the pSEO keyword grid CSV.
// Vite's `?raw` suffix inlines the file contents into the bundle at build time,
// so this is a static lookup (no fetch, no runtime I/O).
import csvRaw from "./pseo-grid.csv?raw";

export interface PseoOverride {
  category: string;
  fromUnit: string;
  toUnit: string;
  slug: string;
  pageTitle: string;
  h1: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  searchVolumeEst: number;
}

// Minimal CSV parser that handles quoted fields with embedded commas / escaped quotes.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = false; }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (ch === "\r") { /* skip */ }
      else cur += ch;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
}

function buildIndex(): Map<string, PseoOverride> {
  const rows = parseCsv(csvRaw);
  if (rows.length === 0) return new Map();
  const [header, ...body] = rows;
  const idx = (name: string) => header.indexOf(name);
  const cCat = idx("category");
  const cFrom = idx("from_unit");
  const cTo = idx("to_unit");
  const cSlug = idx("slug");
  const cTitle = idx("page_title");
  const cH1 = idx("h1");
  const cDesc = idx("meta_description");
  const cPk = idx("primary_keyword");
  const cSk = idx("secondary_keywords");
  const cVol = idx("search_volume_est");

  const map = new Map<string, PseoOverride>();
  for (const r of body) {
    if (!r[cCat] || !r[cSlug]) continue;
    const entry: PseoOverride = {
      category: r[cCat],
      fromUnit: r[cFrom],
      toUnit: r[cTo],
      slug: r[cSlug],
      pageTitle: r[cTitle] ?? "",
      h1: r[cH1] ?? "",
      metaDescription: r[cDesc] ?? "",
      primaryKeyword: r[cPk] ?? "",
      secondaryKeywords: (r[cSk] ?? "").split("|").map((s) => s.trim()).filter(Boolean),
      searchVolumeEst: Number(r[cVol] ?? 0) || 0,
    };
    map.set(`${entry.category}/${entry.slug}`, entry);
  }
  return map;
}

const INDEX = buildIndex();

export function getPseoOverride(categoryId: string, slug: string): PseoOverride | undefined {
  return INDEX.get(`${categoryId}/${slug}`);
}

export function listPseoEntries(): PseoOverride[] {
  return Array.from(INDEX.values());
}
