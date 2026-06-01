import { Link, useParams, Navigate } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Converter } from "@/components/Converter";
import { AdBanner } from "@/components/AdBanner";
import { TurboSearchBar } from "@/components/TurboSearchBar";
import { RecentConversions } from "@/components/RecentConversions";
import { CATEGORY_MAP, CATEGORIES, convert, formatResult } from "@/lib/converters/data";
import { GROUP_SCENARIOS } from "@/lib/converters/content";
import { ArrowRight } from "lucide-react";


export default function CategoryPage() {
  const { category: categoryId } = useParams<{ category: string }>();
  const category = categoryId ? CATEGORY_MAP[categoryId] : undefined;

  if (!category) return <Navigate to="/404" replace />;

  const related = CATEGORIES.filter((c) => c.group === category.group && c.id !== category.id).slice(0, 6);
  const featured = category.popular?.[0] ?? { from: category.units[0]?.id, to: category.units[1]?.id };
  const f = category.units.find((u) => u.id === featured.from);
  const t = category.units.find((u) => u.id === featured.to);
  const factor = f && t ? convert(category, 1, f.id, t.id) : null;

  const title = `${category.name} Converter — Turbo Unit Converter`;
  const description = `${category.name} converter with ${category.units.length} units. ${category.description}`.slice(0, 160);
  const url = `https://turbounitconverter.com/c/${category.id}`;

  const faqs = [
    { q: "How precise is this tool?", a: "We use 12-digit precision constants aligned with international metrology standards." },
    { q: `Which ${category.name.toLowerCase()} units are supported?`, a: `${category.units.length} units across SI, US Customary, and Imperial systems where applicable.` },
    { q: "Is it free to use?", a: "Yes, the web tool is completely free for personal, educational, and professional use." },
  ];

  const jsonLd: Record<string, unknown>[] = [
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

        <AdBanner className="mt-10" />

        <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)]">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">About the {category.name.toLowerCase()} converter</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The {category.name} Converter translates values between {category.units.length} different {category.name.toLowerCase()} units
            — including SI, US Customary, and Imperial measures where applicable — using 12-digit precision constants aligned with
            international metrology standards. {category.description} Enter any value on the left and the result updates instantly,
            so you can compare units, double-check a calculation, or generate reference tables without leaving the page.
          </p>

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

        {category.popular?.length ? (
          <section className="mt-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Popular {category.name.toLowerCase()} conversions</h2>

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
                          <Link to={`/c/${category.id}/${pf.id}-to-${pt.id}`}
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

            <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
              <div className="divide-y divide-border">
                {faqs.map((item) => (
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
