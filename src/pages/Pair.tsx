import { Link, useParams, Navigate } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Converter } from "@/components/Converter";
import { AdBanner } from "@/components/AdBanner";
import { CATEGORY_MAP, convert, formatResult } from "@/lib/converters/data";
import { GROUP_SCENARIOS } from "@/lib/converters/content";

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
  const inverse = convert(category, 1, t.id, f.id);

  const title = `${f.name} to ${t.name} — Turbo Unit Converter`;
  const desc = `Convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}) instantly with engineering-grade precision.`.slice(0, 160);
  const url = `https://turbounitconverter.vercel.app/c/${category.id}/${pair}`;
  const catUrl = `https://turbounitconverter.vercel.app/c/${category.id}`;

  const faqs = [
    { q: `How do I convert ${f.name.toLowerCase()} to ${t.name.toLowerCase()}?`, a: `Multiply the ${f.name.toLowerCase()} value by ${formatResult(factor)} to get the equivalent in ${t.name.toLowerCase()}.` },
    { q: `What is 1 ${f.name.toLowerCase()} in ${t.name.toLowerCase()}?`, a: `1 ${f.symbol} equals ${formatResult(factor)} ${t.symbol}.` },
    { q: `How do I convert ${t.name.toLowerCase()} back to ${f.name.toLowerCase()}?`, a: `Multiply the ${t.name.toLowerCase()} value by ${formatResult(inverse)} (or divide by ${formatResult(factor)}) to get ${f.name.toLowerCase()}.` },
    { q: `What is the formula for ${f.symbol} to ${t.symbol}?`, a: `${t.name} = ${f.name} × ${formatResult(factor)}. This factor is derived from the SI definitions of both units.` },
    { q: "How precise is this tool?", a: "We use 12-digit precision constants aligned with international metrology standards." },
    { q: "Is it free to use?", a: "Yes — the web converter is completely free for personal and professional use." },
  ];

  const howToSteps = [
    { name: `Enter the ${f.name.toLowerCase()} value`, text: `Type the number of ${f.name.toLowerCase()} (${f.symbol}) you want to convert into the input field above.` },
    { name: "Apply the conversion factor", text: `Multiply the value by ${formatResult(factor)} — the exact ${f.symbol} to ${t.symbol} factor.` },
    { name: `Read the ${t.name.toLowerCase()} result`, text: `The output instantly displays the equivalent value in ${t.name.toLowerCase()} (${t.symbol}).` },
    { name: "Verify with the reference table", text: `Cross-check common values such as 1, 10, or 100 ${f.symbol} in the conversion table below.` },
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
              { "@type": "ListItem", position: 1, name: "Home", item: "https://turbounitconverter.vercel.app/" },
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
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `How to convert ${f.name.toLowerCase()} to ${t.name.toLowerCase()}`,
            description: `Convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}) using the exact factor ${formatResult(factor)}.`,
            step: howToSteps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
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

        <section className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-3">{f.name} → {t.name} table</h2>
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
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-3">Reverse: {t.name} → {f.name}</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Multiply {t.name.toLowerCase()} by{" "}
              <span className="font-mono-num text-foreground font-semibold">{formatResult(inverse)}</span> to get {f.name.toLowerCase()}.
            </p>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {examples.map((v) => (
                  <tr key={v}>
                    <td className="py-2 font-mono-num">{v} {t.symbol}</td>
                    <td className="py-2 text-right font-mono-num text-primary font-semibold">
                      {formatResult(convert(category, v, t.id, f.id))} {f.symbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-lg font-semibold mb-4">Step-by-step: convert {f.name.toLowerCase()} to {t.name.toLowerCase()}</h2>
          <ol className="space-y-3">
            {howToSteps.map((s, i) => (
              <li key={s.name} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.text}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Worked example</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Suppose you need to convert <span className="font-mono-num text-foreground font-semibold">25 {f.symbol}</span> to {t.name.toLowerCase()}.
            Multiply by the conversion factor:
          </p>
          <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/30 p-4 font-mono-num text-sm">
            25 × {formatResult(factor)} = <span className="text-primary font-semibold">{formatResult(convert(category, 25, f.id, t.id))}</span> {t.symbol}
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The same approach works for any value — the relationship between {f.name.toLowerCase()} and {t.name.toLowerCase()} is strictly linear.
          </p>
        </section>

        {category.units.filter((u) => u.id !== f.id).length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Other {f.name.toLowerCase()} conversions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {category.units.filter((u) => u.id !== f.id).slice(0, 8).map((u) => (
                <Link key={u.id} to={`/c/${category.id}/${f.id}-to-${u.id}`}
                  className="bg-surface-elevated border border-border rounded-xl p-3 text-sm font-medium hover:border-primary transition text-center">
                  {f.symbol} → {u.symbol}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
