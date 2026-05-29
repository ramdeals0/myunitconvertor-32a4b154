import { Link, useParams, Navigate } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Converter } from "@/components/Converter";
import { AdBanner } from "@/components/AdBanner";
import { CATEGORY_MAP, convert, formatResult } from "@/lib/converters/data";

function parsePair(pair: string): [string, string] {
  const parts = pair.split("-to-");
  return [parts[0] ?? "", parts[1] ?? ""];
}

export default function PairPage() {
  const { category: categoryId, pair } = useParams<{ category: string; pair: string }>();
  const category = categoryId ? CATEGORY_MAP[categoryId] : undefined;
  const [fromId, toId] = pair ? parsePair(pair) : ["", ""];
  const f = category?.units.find((u) => u.id === fromId);
  const t = category?.units.find((u) => u.id === toId);

  if (!category || !f || !t) return <Navigate to="/404" replace />;

  const examples = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];
  const factor = convert(category, 1, f.id, t.id);

  const title = `${f.name} to ${t.name} — Turbo Unit Converter`;
  const desc = `Convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}) instantly with engineering-grade precision.`.slice(0, 160);
  const url = `https://myunitconvertor.lovable.app/c/${category.id}/${pair}`;
  const catUrl = `https://myunitconvertor.lovable.app/c/${category.id}`;

  const faqs = [
    { q: `How do I convert ${f.name.toLowerCase()} to ${t.name.toLowerCase()}?`, a: `Multiply the ${f.name.toLowerCase()} value by ${formatResult(factor)} to get the equivalent in ${t.name.toLowerCase()}.` },
    { q: `What is 1 ${f.name.toLowerCase()} in ${t.name.toLowerCase()}?`, a: `1 ${f.symbol} equals ${formatResult(factor)} ${t.symbol}.` },
    { q: "How precise is this tool?", a: "We use 12-digit precision constants aligned with international metrology standards." },
    { q: "Is it free to use?", a: "Yes — the web converter is completely free for personal and professional use." },
  ];

  return (
    <>
      <Seo
        title={title}
        description={desc}
        canonical={url}
        ogType="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://myunitconvertor.lovable.app/" },
              { "@type": "ListItem", position: 2, name: category.name, item: catUrl },
              { "@type": "ListItem", position: 3, name: `${f.name} to ${t.name}`, item: url },
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
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/c/${category.id}`} className="hover:text-primary">{category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{f.symbol} → {t.symbol}</span>
        </nav>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{f.name} to {t.name}</h1>
          <p className="text-muted-foreground mt-2">Convert {f.symbol} to {t.symbol} with precision.</p>
        </div>

        <Converter category={category} initialFrom={f.id} initialTo={t.id} />

        <div className="mt-6 bg-primary-soft border border-primary/15 rounded-xl p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-primary/80">Resulting Conversion</div>
          <div className="mt-1 font-mono-num text-xl md:text-2xl font-semibold text-foreground">
            1 {f.symbol} = <span className="text-primary">{formatResult(factor)}</span> {t.symbol}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Calculated with engineering-grade precision.</div>
        </div>

        <AdBanner className="mt-10" />

        <section className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold mb-3">How to convert {f.name.toLowerCase()} to {t.name.toLowerCase()}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To convert {f.name.toLowerCase()} to {t.name.toLowerCase()}, multiply the {f.name.toLowerCase()} value by the conversion factor{" "}
              <span className="font-mono-num text-foreground font-semibold">{formatResult(factor)}</span>.
            </p>
            <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4 font-mono-num text-sm">
              {t.name} = {f.name} × {formatResult(factor)}
            </div>
            <div className="mt-4 text-sm">
              <div className="text-muted-foreground">Reference:</div>
              <div className="font-mono-num mt-1">
                1 {f.symbol} = <span className="text-primary font-semibold">{formatResult(factor)}</span> {t.symbol}
              </div>
            </div>
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

        <section className="mt-12">
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Conversion table</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {examples.map((v) => (
                  <tr key={v}>
                    <td className="py-2 font-mono-num">{v} {f.symbol}</td>
                    <td className="py-2 text-right font-mono-num text-primary font-semibold">
                      {formatResult(convert(category, v, f.id, t.id))} {t.symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
