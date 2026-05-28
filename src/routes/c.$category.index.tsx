import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Converter } from "@/components/Converter";
import { AdBanner } from "@/components/AdBanner";
import { CATEGORY_MAP, CATEGORIES, convert, formatResult } from "@/lib/converters/data";
import type { Category } from "@/lib/converters/types";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/c/$category/")({
  head: ({ params }) => {
    const c = CATEGORY_MAP[params.category];
    const title = c ? `${c.name} Converter — Turbo Unit Converter` : "Converter";
    const baseDesc = c?.description ?? "Unit converter";
    const desc = c
      ? `${c.name} converter with ${c.units.length} units. ${baseDesc} Fast, accurate, engineering-grade precision for everyday and professional use.`
      : "Unit converter with engineering-grade precision for everyday and professional use across dozens of categories.";
    const url = `https://myunitconvertor.lovable.app/c/${params.category}`;
    const faqs = c
      ? [
          { q: "How precise is this tool?", a: "We use 12-digit precision constants aligned with international metrology standards." },
          { q: `Which ${c.name.toLowerCase()} units are supported?`, a: `${c.units.length} units across SI, US Customary, and Imperial systems where applicable.` },
          { q: "Is it free to use?", a: "Yes, the web tool is completely free for personal, educational, and professional use." },
        ]
      : [];
    const scripts: Array<{ type: string; children: string }> = [];
    if (c) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://myunitconvertor.lovable.app/" },
            { "@type": "ListItem", position: 2, name: c.name, item: url },
          ],
        }),
      });
    }
    if (faqs.length) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      });
    }
    return {
      meta: [
        { title },
        { name: "description", content: desc.slice(0, 160) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 160) },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts,
    };
  },
  loader: ({ params }) => {
    const c = CATEGORY_MAP[params.category];
    if (!c) throw notFound();
    return { category: c };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">Category not found</h1>
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData() as { category: Category };
  const related = CATEGORIES.filter((c) => c.group === category.group && c.id !== category.id).slice(0, 6);

  // Featured pair for explainer (first popular, or first two distinct units)
  const featured = category.popular?.[0] ?? { from: category.units[0]?.id, to: category.units[1]?.id };
  const f = category.units.find((u) => u.id === featured.from);
  const t = category.units.find((u) => u.id === featured.to);
  const factor = f && t ? convert(category, 1, f.id, t.id) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          {category.name} Converter
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {category.description}
        </p>
      </header>

      <Converter category={category} />

      {f && t && factor !== null && (
        <div className="mt-6 bg-primary-soft border border-primary/15 rounded-xl p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-primary/80">
            Resulting Conversion
          </div>
          <div className="mt-1 font-mono-num text-xl md:text-2xl font-semibold text-foreground">
            1 {f.symbol} = <span className="text-primary">{formatResult(factor)}</span> {t.symbol}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Calculated with engineering-grade precision.
          </div>
        </div>
      )}

      <AdBanner className="mt-10" />

      {category.popular?.length ? (
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Popular {category.name.toLowerCase()} conversions
          </h2>
          <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-3 font-semibold">From</th>
                  <th className="text-left p-3 font-semibold">To</th>
                  <th className="text-right p-3 font-semibold">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {category.popular.flatMap((p) => {
                  const pf = category.units.find((u) => u.id === p.from);
                  const pt = category.units.find((u) => u.id === p.to);
                  if (!pf || !pt) return [];
                  return [1, 5, 10, 25].map((v) => (
                    <tr key={`${p.from}-${p.to}-${v}`} className="hover:bg-muted/30">
                      <td className="p-3 font-mono-num">{v} {pf.name}</td>
                      <td className="p-3 font-mono-num text-primary font-semibold">
                        {formatResult(convert(category, v, pf.id, pt.id))} {pt.name}
                      </td>
                      <td className="p-3 text-right">
                        <Link to="/c/$category/$pair"
                          params={{ category: category.id, pair: `${pf.id}-to-${pt.id}` }}
                          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                          {pf.symbol} <ArrowRight className="h-3 w-3" /> {pt.symbol}
                        </Link>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {f && t && factor !== null && (
        <section className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold mb-3">
              How to convert {f.name.toLowerCase()} to {t.name.toLowerCase()}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To convert {f.name.toLowerCase()} to {t.name.toLowerCase()}, multiply
              the {f.name.toLowerCase()} value by the conversion factor{" "}
              <span className="font-mono-num text-foreground font-semibold">{formatResult(factor)}</span>.
            </p>
            <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4 font-mono-num text-sm">
              {t.name} = {f.name} × {formatResult(factor)}
            </div>
            <Link to="/c/$category/$pair"
              params={{ category: category.id, pair: `${f.id}-to-${t.id}` }}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Read full technical guide <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
            <div className="divide-y divide-border">
              {[
                {
                  q: "How precise is this tool?",
                  a: "We use 12-digit precision constants aligned with international metrology standards.",
                },
                {
                  q: `Which ${category.name.toLowerCase()} units are supported?`,
                  a: `${category.units.length} units across SI, US Customary, and Imperial systems where applicable.`,
                },
                {
                  q: "Is it free to use?",
                  a: "Yes, the web tool is completely free for personal, educational, and professional use.",
                },
              ].map((item) => (
                <details key={item.q} className="group py-3">
                  <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold">
                    {item.q}
                    <span className="text-primary group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">All {category.name.toLowerCase()} units</h2>
        <div className="bg-surface-elevated border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-semibold">Unit</th>
                <th className="text-left p-3 font-semibold">Symbol</th>
                <th className="text-right p-3 font-semibold">1 {category.baseUnit} equals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {category.units.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.symbol}</td>
                  <td className="p-3 text-right font-mono-num">{formatResult(convert(category, 1, category.baseUnit, u.id))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Related converters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {related.map((c) => (
              <Link key={c.id} to="/c/$category" params={{ category: c.id }}
                className="bg-surface-elevated border border-border rounded-xl p-3 text-sm font-medium hover:border-primary transition text-center">
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
