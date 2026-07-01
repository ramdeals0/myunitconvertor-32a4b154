import { Link, useParams, Navigate } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Converter } from "@/components/Converter";
import { AdBanner } from "@/components/AdBanner";
import { CATEGORIES, convert, formatResult } from "@/lib/converters/data";
import { GROUP_SCENARIOS } from "@/lib/converters/content";
import type { Category, Unit } from "@/lib/converters/types";

function normalize(s: string) {
  return s.toLowerCase().replace(/[\s_]+/g, "-");
}

function matchUnit(category: Category, token: string): Unit | undefined {
  const t = normalize(token);
  return category.units.find((u) => {
    if (normalize(u.id) === t) return true;
    if (normalize(u.symbol) === t) return true;
    if (normalize(u.name) === t) return true;
    if (u.aliases?.some((a) => normalize(a) === t)) return true;
    // plural-ish fallback
    if (normalize(u.name) + "s" === t || normalize(u.name) === t.replace(/s$/, "")) return true;
    return false;
  });
}

function resolvePair(pair: string): { category: Category; from: Unit; to: Unit } | null {
  const parts = pair.split("-to-");
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  for (const cat of CATEGORIES) {
    const f = matchUnit(cat, a);
    const t = matchUnit(cat, b);
    if (f && t && f.id !== t.id) return { category: cat, from: f, to: t };
  }
  return null;
}

export default function ConvertPage() {
  const { pair } = useParams<{ pair: string }>();
  const resolved = pair ? resolvePair(pair) : null;
  if (!resolved) return <Navigate to="/404" replace />;
  const { category, from: f, to: t } = resolved;

  const factor = convert(category, 1, f.id, t.id);
  const inverse = convert(category, 1, t.id, f.id);
  const examples = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];

  const fSlug = normalize(f.symbol);
  const tSlug = normalize(t.symbol);
  const fLabel = f.symbol.toUpperCase();
  const tLabel = t.symbol.toUpperCase();

  const title = `${fLabel} to ${tLabel} Converter — ${f.name} to ${t.name}`.slice(0, 60);
  const desc = `Instantly convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}) online — free, accurate, and engineering-grade precise. 1 ${f.symbol} = ${formatResult(factor)} ${t.symbol}.`.slice(0, 160);
  const url = `https://turbounitconverter.com/convert/${fSlug}-to-${tSlug}`;

  const faqs = [
    { q: `How many ${t.name.toLowerCase()} are in a ${f.name.toLowerCase()}?`, a: `1 ${f.symbol} equals ${formatResult(factor)} ${t.symbol}.` },
    { q: `What is the formula to convert ${f.symbol} to ${t.symbol}?`, a: `${t.name} = ${f.name} × ${formatResult(factor)}.` },
    { q: `How do I convert ${t.symbol} back to ${f.symbol}?`, a: `Multiply ${t.name.toLowerCase()} by ${formatResult(inverse)} (or divide by ${formatResult(factor)}).` },
    { q: `Is this ${fLabel} to ${tLabel} converter free?`, a: "Yes — it's completely free and works instantly in your browser." },
    { q: "How accurate are the results?", a: "We use 12-digit precision constants aligned with international SI metrology standards." },
  ];

  const howToSteps = [
    { name: `Enter the ${f.name.toLowerCase()} value`, text: `Type the ${f.symbol} value you want to convert into the input above.` },
    { name: "Apply the conversion factor", text: `Multiply by ${formatResult(factor)} — the exact ${f.symbol} to ${t.symbol} factor.` },
    { name: `Get the ${t.name.toLowerCase()} result`, text: `The equivalent in ${t.symbol} appears instantly.` },
  ];

  return (
    <>
      <Seo
        title={title}
        description={desc}
        canonical={url}
        ogType="website"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://turbounitconverter.com/" },
              { "@type": "ListItem", position: 2, name: `${fLabel} to ${tLabel}`, item: url },
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
            name: `How to convert ${fLabel} to ${tLabel}`,
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
          <span className="text-foreground">{fLabel} → {tLabel}</span>
        </nav>

        <div className="text-center mb-6">
          <div className="inline-block text-[11px] uppercase tracking-[0.1em] font-semibold text-primary bg-primary-soft border border-primary/20 rounded-full px-3 py-1 mb-3">
            Instant Results · Free · Precise
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Fast {fLabel} to {tLabel} Converter
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Convert {f.name} ({f.symbol}) to {t.name} ({t.symbol}) instantly with engineering-grade accuracy.
          </p>
        </div>

        <Converter category={category} initialFrom={f.id} initialTo={t.id} persistValueInUrl />

        <div className="mt-6 bg-primary-soft border border-primary/15 rounded-xl p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-primary/80">Conversion factor</div>
          <div className="mt-1 font-mono-num text-xl md:text-2xl font-semibold text-foreground">
            1 {f.symbol} = <span className="text-primary">{formatResult(factor)}</span> {t.symbol}
          </div>
        </div>

        <AdBanner className="mt-10" />

        <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)]">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">About {fLabel} to {tLabel}</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            This converter transforms {f.name} ({f.symbol}) into {t.name} ({t.symbol}) using the exact factor{" "}
            <span className="font-mono-num text-foreground font-semibold">{formatResult(factor)}</span>. Both units measure{" "}
            {category.name.toLowerCase()}, so the relationship is strictly linear.
          </p>
          <h3 className="text-base md:text-lg font-semibold mt-6 mb-2">Common scenarios</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            {GROUP_SCENARIOS[category.group].slice(0, 4).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-3">{fLabel} → {tLabel} table</h2>
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
            <h2 className="font-semibold mb-4">FAQ</h2>
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

        <section className="mt-10 text-center">
          <Link
            to={`/c/${category.id}/${f.id}-to-${t.id}`}
            className="text-sm text-primary hover:underline"
          >
            View detailed {f.name} → {t.name} reference →
          </Link>
        </section>
      </div>
    </>
  );
}
