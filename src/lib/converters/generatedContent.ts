// Eager-load all per-pair JSON written by scripts/generate-pseo.ts.
// Vite resolves these at build time, so this is a static lookup.
import type { ReactNode } from "react";
import { createElement, Fragment } from "react";

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
    pageType: "category" | "pair";
    keywords?: string[];
    noindex?: boolean;
  };
  contentHash: string;
}

const pairModules = import.meta.glob<{ default: GeneratedConversionContent }>(
  "/src/generated/conversions/*/*.json",
  { eager: true },
);

const PAIR_INDEX = new Map<string, GeneratedConversionContent>();
for (const [path, mod] of Object.entries(pairModules)) {
  // path: /src/generated/conversions/<category>/<slug>.json
  const m = path.match(/\/conversions\/([^/]+)\/([^/]+)\.json$/);
  if (!m) continue;
  PAIR_INDEX.set(`${m[1]}/${m[2]}`, mod.default);
}

export function getGeneratedPair(category: string, slug: string): GeneratedConversionContent | undefined {
  return PAIR_INDEX.get(`${category}/${slug}`);
}

// ---------- Tiny markdown-lite renderers ----------
// Only handles what the generator produces: **bold**, paragraphs, > quote,
// - bullets, pipe tables, and FAQ Q/A blocks. No external dep.

function renderInline(text: string, key?: string | number): ReactNode {
  // Split on **bold** spans, keep delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return createElement(
    Fragment,
    { key },
    ...parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**")
        ? createElement("strong", { key: i, className: "font-semibold text-foreground" }, p.slice(2, -2))
        : p,
    ),
  );
}

/** Render plain text with inline bold support, splitting double newlines into paragraphs. */
export function MdParagraphs({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n{2,}/);
  return createElement(
    Fragment,
    null,
    ...blocks.map((b, i) => {
      if (b.startsWith("> ")) {
        return createElement(
          "blockquote",
          { key: i, className: "border-l-4 border-primary/40 pl-4 my-3 italic text-foreground font-mono-num" },
          renderInline(b.slice(2)),
        );
      }
      return createElement(
        "p",
        { key: i, className: className ?? "text-sm md:text-base text-muted-foreground leading-relaxed mt-3 first:mt-0" },
        renderInline(b),
      );
    }),
  );
}

/** Render a - bullet list as <ul>. */
export function MdBulletList({ text }: { text: string }) {
  const items = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2));
  return createElement(
    "ul",
    { className: "list-disc pl-5 space-y-1.5 text-sm md:text-base text-muted-foreground leading-relaxed" },
    ...items.map((it, i) => createElement("li", { key: i }, renderInline(it))),
  );
}

/** Render a markdown pipe table into a styled <table>. */
export function MdTable({ text }: { text: string }) {
  const rows = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (rows.length < 2) return null;
  const cells = (row: string) =>
    row.split("|").map((c) => c.trim()).filter((_, i, a) => i !== 0 && i !== a.length - 1);
  const header = cells(rows[0]);
  // rows[1] is the separator (| --- | --- |), skip it.
  const body = rows.slice(2).map(cells);
  return createElement(
    "table",
    { className: "w-full text-sm" },
    createElement(
      "thead",
      null,
      createElement(
        "tr",
        { className: "text-left text-xs uppercase tracking-wide text-muted-foreground" },
        ...header.map((h, i) =>
          createElement("th", { key: i, className: "py-2 font-semibold" }, h),
        ),
      ),
    ),
    createElement(
      "tbody",
      { className: "divide-y divide-border" },
      ...body.map((cols, ri) =>
        createElement(
          "tr",
          { key: ri },
          ...cols.map((c, ci) =>
            createElement(
              "td",
              {
                key: ci,
                className:
                  ci === 0
                    ? "py-2 font-mono-num"
                    : "py-2 text-right font-mono-num text-primary font-semibold",
              },
              c,
            ),
          ),
        ),
      ),
    ),
  );
}

/** Render the FAQ markdown (blocks of **Q:** …\n**A:** …) as <details> accordions. */
export function MdFaq({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const items = blocks
    .map((b) => {
      const qm = b.match(/\*\*Q:\*\*\s*([\s\S]*?)\n\*\*A:\*\*\s*([\s\S]*)/);
      return qm ? { q: qm[1].trim(), a: qm[2].trim() } : null;
    })
    .filter((x): x is { q: string; a: string } => !!x);
  return createElement(
    "div",
    { className: "divide-y divide-border" },
    ...items.map((it, i) =>
      createElement(
        "details",
        { key: i, className: "group py-3" },
        createElement(
          "summary",
          { className: "cursor-pointer list-none flex items-center justify-between text-sm font-semibold" },
          it.q,
          createElement(
            "span",
            { className: "text-primary group-open:rotate-45 transition-transform text-lg leading-none" },
            "+",
          ),
        ),
        createElement(
          "p",
          { className: "mt-2 text-sm text-muted-foreground leading-relaxed" },
          renderInline(it.a),
        ),
      ),
    ),
  );
}
