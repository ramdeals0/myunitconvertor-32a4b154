import { Link, useParams, Navigate } from "react-router-dom";

import { Seo } from "@/components/Seo";
import { Converter } from "@/components/Converter";
import { TurboSearchBar } from "@/components/TurboSearchBar";
import { RecentConversions } from "@/components/RecentConversions";
import { CATEGORY_MAP, CATEGORIES, convert, formatResult } from "@/lib/converters/data";
import { GROUP_SCENARIOS } from "@/lib/converters/content";
import { getCategoryContent } from "@/lib/converters/categoryContent";
import { getLaunchPairsByCategory, getTopLaunchPairs } from "@/lib/converters/pseoGrid";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useLocalizedPath, useLocalizedUrl, useI18n, BCP47, SITE_URL } from "@/lib/i18n";


export default function CategoryPage() {
  const { category: categoryId } = useParams<{ category: string }>();
  const category = categoryId ? CATEGORY_MAP[categoryId] : undefined;

  if (!category) return <Navigate to="/404" replace />;

  const related = CATEGORIES.filter((c) => c.group === category.group && c.id !== category.id).slice(0, 6);
  const featured = category.popular?.[0] ?? { from: category.units[0]?.id, to: category.units[1]?.id };
  const f = category.units.find((u) => u.id === featured.from);
  const t = category.units.find((u) => u.id === featured.to);
  const factor = f && t ? convert(category, 1, f.id, t.id) : null;
  const launchPairCount = getLaunchPairsByCategory(category.id, 24).length;
  // Only serve ads on hubs that anchor a real launch cluster (≥3 pair pages of long copy).
  const adsAllowed = launchPairCount >= 3;
  // Non-launch category hubs stay indexable (they list units) but are lower priority.

  const title = `${category.name} Converter — Turbo Unit Converter`;
  const description = `Free ${category.name.toLowerCase()} converter — ${category.units.length} units, instant results, engineering-grade accuracy. ${category.description}`.slice(0, 160);
  const url = `https://turbounitconverter.com/c/${category.id}`;

  const content = getCategoryContent(category);
  const faqs = content.faqs.map((item) => ({ q: item.q, a: item.a }));

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
      inLanguage: "en",
      isPartOf: { "@type": "WebSite", name: "Turbo Unit Converter", url: "https://turbounitconverter.com/" },
      mainEntity: {
        "@type": "WebApplication",
        name: `${category.name} Unit Converter`,
        applicationCategory: "UtilitiesApplication",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `https://turbounitconverter.com/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://turbounitconverter.com/" },
        { "@type": "ListItem", position: 2, name: category.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${category.name} Unit Converter`,
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Works in any modern browser.",
      description: `Free online ${category.name.toLowerCase()} converter with ${category.units.length} units.`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((q) => ({
        "@type": "Question",
        name: q.q,
        acceptedAnswer: { "@type": "Answer", text: q.a },
      })),
    },
  ];

  if (f && t && factor !== null) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `How to convert ${f.name.toLowerCase()} to ${t.name.toLowerCase()}`,
      description: `Step-by-step instructions to convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}).`,
      step: [
        { "@type": "HowToStep", position: 1, name: `Enter the ${f.name.toLowerCase()} value`, text: `Type the number of ${f.name.toLowerCase()} you want to convert into the input field.` },
        { "@type": "HowToStep", position: 2, name: "Apply the conversion factor", text: `Multiply the value by ${formatResult(factor)}, the exact factor from ${f.symbol} to ${t.symbol}.` },
        { "@type": "HowToStep", position: 3, name: `Read the ${t.name.toLowerCase()} result`, text: `The output field shows the equivalent value in ${t.name.toLowerCase()} (${t.symbol}).` },
      ],
    });
  }

  return (
    <>
      <Seo
        title={title}
        description={description}
        canonical={url}
        jsonLd={jsonLd}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{category.name} Converter</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{category.description}</p>
        </header>

        <TurboSearchBar className="max-w-3xl mx-auto mb-6" />

        <Converter category={category} smartDefaults />

        <RecentConversions className="mt-6" categoryId={category.id} />


        {f && t && factor !== null && (
          <div className="mt-6 bg-primary-soft border border-primary/15 rounded-xl p-5 text-center">
            <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-primary/80">
              Resulting Conversion
            </div>
            <div className="mt-1 font-mono-num text-xl md:text-2xl font-semibold text-foreground">
              1 {f.symbol} = <span className="text-primary">{formatResult(factor)}</span> {t.symbol}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Calculated with engineering-grade precision.</div>
          </div>
        )}


        <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)]">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">About the {category.name.toLowerCase()} converter</h2>
          <div className="space-y-4">
            {content.intro.map((paragraph, i) => (
              <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <h3 className="text-base md:text-lg font-semibold mt-6 mb-2">Common real-world scenarios</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            {GROUP_SCENARIOS[category.group].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          {f && t && factor !== null && (
            <>
              <h3 className="text-base md:text-lg font-semibold mt-6 mb-2">Formula</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most {category.name.toLowerCase()} conversions are linear — each unit relates to the SI base unit
                (<span className="font-mono-num text-foreground">{category.baseUnit}</span>) by a fixed factor. To convert
                {" "}{f.name.toLowerCase()} to {t.name.toLowerCase()}, apply:
              </p>
              <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/30 p-4 font-mono-num text-sm">
                {t.name} = {f.name} × {formatResult(factor)}
              </div>

              <h3 className="text-base md:text-lg font-semibold mt-6 mb-2">Worked example</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Suppose you need to convert <span className="font-mono-num text-foreground font-semibold">10 {f.symbol}</span> to {t.name.toLowerCase()}:
              </p>
              <ol className="mt-3 space-y-2 text-sm">
                <li><span className="font-semibold">Step 1.</span> Identify the source unit: <span className="font-mono-num">{f.name} ({f.symbol})</span>.</li>
                <li><span className="font-semibold">Step 2.</span> Look up the conversion factor: <span className="font-mono-num">1 {f.symbol} = {formatResult(factor)} {t.symbol}</span>.</li>
                <li><span className="font-semibold">Step 3.</span> Multiply: <span className="font-mono-num">10 × {formatResult(factor)} = {formatResult(convert(category, 10, f.id, t.id))} {t.symbol}</span>.</li>
              </ol>
            </>
          )}
        </section>

        {(() => {
          const launchPairs = getLaunchPairsByCategory(category.id, 12);
          if (!launchPairs.length) return null;
          return (
            <section className="mt-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl md:text-2xl font-semibold">
                  Popular {category.name.toLowerCase()} conversions
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
                The most-searched {category.name.toLowerCase()} pairs. Each opens a dedicated converter with
                formula, examples, and FAQs.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {launchPairs.map((p) => {
                  const pf = category.units.find((u) => u.id === p.fromUnit);
                  const pt = category.units.find((u) => u.id === p.toUnit);
                  if (!pf || !pt) return null;
                  const f1 = convert(category, 1, pf.id, pt.id);
                  return (
                    <Link
                      key={p.slug}
                      to={`/c/${category.id}/${p.slug}`}
                      className="group bg-surface-elevated border border-border rounded-xl p-4 hover:border-primary hover:shadow-[var(--shadow-card)] transition"
                    >
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>{pf.symbol} <ArrowRight className="inline h-3 w-3 mx-0.5 text-muted-foreground" /> {pt.symbol}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                      </div>
                      <div className="mt-2 font-mono-num text-xs text-muted-foreground">
                        1 {pf.symbol} = <span className="text-primary font-semibold">{formatResult(f1)}</span> {pt.symbol}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground capitalize">
                        {pf.name.toLowerCase()} to {pt.name.toLowerCase()}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })()}

        <section className="mt-12 grid md:grid-cols-2 gap-6">
          {f && t && factor !== null ? (
            <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold mb-3">
                How to convert {f.name.toLowerCase()} to {t.name.toLowerCase()}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To convert {f.name.toLowerCase()} to {t.name.toLowerCase()}, multiply the {f.name.toLowerCase()} value by the conversion factor{" "}
                <span className="font-mono-num text-foreground font-semibold">{formatResult(factor)}</span>.
              </p>
              <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4 font-mono-num text-sm">
                {t.name} = {f.name} × {formatResult(factor)}
              </div>
              <Link to={`/c/${category.id}/${f.id}-to-${t.id}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Read full technical guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold mb-3">About this converter</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.description} All {category.units.length} supported units are listed in the reference table below,
                each stored with 12-digit precision constants aligned with NIST SP 811.
              </p>
            </div>
          )}

          <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
            <div className="divide-y divide-border">
              {faqs.map((item) => (
                <details key={item.q} className="group py-3">
                  <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold gap-3">
                    <span>{item.q}</span>
                    <span className="text-primary group-open:rotate-45 transition-transform text-lg leading-none shrink-0">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

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

        {content.related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-1">Suggested related conversions</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
              Categories most often used alongside {category.name.toLowerCase()} — each links to its own converter, unit table and FAQ.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {content.related.map((r) => {
                const target = CATEGORY_MAP[r.id];
                if (!target) return null;
                return (
                  <Link
                    key={r.id}
                    to={`/c/${r.id}`}
                    className="group bg-surface-elevated border border-border rounded-xl p-4 hover:border-primary hover:shadow-[var(--shadow-card)] transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{r.label}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{r.reason}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">More in {category.group === "other" ? "this group" : `${category.group}`}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {related.map((c) => (
                <Link key={c.id} to={`/c/${c.id}`}
                  className="bg-surface-elevated border border-border rounded-xl p-3 text-sm font-medium hover:border-primary transition text-center">
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
