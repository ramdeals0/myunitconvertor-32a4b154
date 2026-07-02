import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight as ArrowRightIcon } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Seo } from "@/components/Seo";
import { Converter } from "@/components/Converter";
import { CATEGORY_MAP, convert, formatResult } from "@/lib/converters/data";
import { GROUP_SCENARIOS } from "@/lib/converters/content";
import { getRealWorldExamples } from "@/lib/converters/realWorldExamples";
import { getPseoOverride, getLaunchPairsByCategory, getTopLaunchPairs } from "@/lib/converters/pseoGrid";
import { pairIndexability } from "@/lib/seo/indexability";
import { getArticlesByCategoryHint, getAllArticles } from "@/content/articles";
import { useLocalizedPath, useLocalizedUrl, useI18n, BCP47, SITE_URL } from "@/lib/i18n";

import {
  getGeneratedPair,
  MdParagraphs,
  MdBulletList,
  MdTable,
  MdFaq,
} from "@/lib/converters/generatedContent";

function parsePair(pair: string): [string, string] {
  const parts = pair.split("-to-");
  return [parts[0] ?? "", parts[1] ?? ""];
}

export default function PairPage() {
  const { category: categoryId, pair } = useParams<{ category: string; pair: string }>();
  const L = useLocalizedPath();
  const LU = useLocalizedUrl();
  const { lang } = useI18n();
  const category = categoryId ? CATEGORY_MAP[categoryId] : undefined;
  const [fromId, toId] = pair ? parsePair(pair) : ["", ""];
  const f = category?.units.find((u) => u.id === fromId);
  const t = category?.units.find((u) => u.id === toId);

  if (!category || !f || !t) return <Navigate to={L("/404")} replace />;

  const examples = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];
  const factor = convert(category, 1, f.id, t.id);
  const inverse = convert(category, 1, t.id, f.id);
  const realExamples = getRealWorldExamples(category, f.id, t.id, 6);


  // pSEO overrides from the build-time CSV grid (by category + slug).
  const slug = `${f.id}-to-${t.id}`;
  const pseo = getPseoOverride(category.id, slug);
  // Cached long-form JSON written by scripts/generate-pseo.ts (may be undefined for non-launch pairs).
  const gen = getGeneratedPair(category.id, slug);
  const idx = pairIndexability(category.id, slug);

  const title = gen?.meta.title || pseo?.pageTitle || `${f.name} to ${t.name} Converter | Turbo Unit Converter`;
  const desc = (gen?.meta.description || pseo?.metaDescription ||
    `Convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}) instantly. Free, accurate ${category.name.toLowerCase()} converter with formula, examples & no signup.`
  ).slice(0, 160);
  const heading = gen?.meta.h1 || pseo?.h1 || `${f.name} to ${t.name}`;
  const url = LU(`/c/${category.id}/${pair}`);
  const catUrl = LU(`/c/${category.id}`);
  const homeUrl = LU("/");
  const langTag = BCP47[lang];

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
        ogType="website"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: heading,
            description: desc,
            url,
            inLanguage: langTag,
            isPartOf: { "@type": "WebSite", name: "Turbo Unit Converter", url: `${SITE_URL}/` },
            primaryImageOfPage: undefined,
            mainEntity: {
              "@type": "HowTo",
              name: `Convert ${f.name} to ${t.name}`,
              description: `Convert ${f.name} (${f.symbol}) to ${t.name} (${t.symbol}) using the exact factor ${formatResult(factor)}.`,
            },
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
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
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `${f.name} to ${t.name} Converter`,
            url,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any (Web)",
            browserRequirements: "Requires JavaScript. Modern browser.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: desc,
          },
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            name: `Standards & references for ${f.name} to ${t.name} conversion`,
            headline: `Standards & references for ${f.name} to ${t.name} conversion`,
            url,
            inLanguage: langTag,
            isPartOf: { "@type": "WebSite", name: "Turbo Unit Converter", url: `${SITE_URL}/` },
            about: {
              "@type": "Thing",
              name: `${f.name} to ${t.name} unit conversion`,
              description: `Conversion factor: ${formatResult(factor)} ${t.symbol} per ${f.symbol}`,
            },
            citation: [
              {
                "@type": "ScholarlyArticle",
                name: "NIST SP 811 — Guide for the Use of the International System of Units",
                url: "https://www.nist.gov/pml/special-publication-811",
                publisher: { "@type": "GovernmentOrganization", name: "National Institute of Standards and Technology" },
              },
              {
                "@type": "ScholarlyArticle",
                name: "NIST SP 811 Appendix B — Conversion Factors",
                url: "https://physics.nist.gov/cuu/pdf/sp811.pdf#page=45",
                isPartOf: {
                  "@type": "ScholarlyArticle",
                  name: "NIST SP 811 — Guide for the Use of the International System of Units",
                  url: "https://www.nist.gov/pml/special-publication-811",
                },
                publisher: { "@type": "GovernmentOrganization", name: "National Institute of Standards and Technology" },
              },
              {
                "@type": "ScholarlyArticle",
                name: "BIPM — The International System of Units (SI Brochure)",
                url: "https://www.bipm.org/en/publications/si-brochure",
                publisher: { "@type": "GovernmentOrganization", name: "Bureau International des Poids et Mesures" },
              },
              {
                "@type": "ScholarlyArticle",
                name: "IEEE/ASTM SI 10 — American National Standard for Metric Practice",
                publisher: { "@type": "Organization", name: "IEEE / ASTM International" },
              },
              {
                "@type": "WebPage",
                name: "Turbo Unit Converter — Methodology",
                url: LU("/methodology"),
                isPartOf: { "@type": "WebSite", name: "Turbo Unit Converter", url: `${SITE_URL}/` },
              },
            ],
          },
        ]}
      />
      {!idx.indexable && (
        <Helmet>
          <meta name="robots" content="noindex,follow" />
        </Helmet>
      )}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to={L("/")} className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to={L(`/c/${category.id}`)} className="hover:text-primary">{category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{f.symbol} → {t.symbol}</span>
        </nav>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{heading}</h1>
          <p className="text-muted-foreground mt-2">Convert {f.symbol} to {t.symbol} with precision.</p>
        </div>

        <Converter category={category} initialFrom={f.id} initialTo={t.id} persistValueInUrl />

        <div className="mt-6 bg-primary-soft border border-primary/15 rounded-xl p-5 text-center">
          <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-primary/80">Resulting Conversion</div>
          <div className="mt-1 font-mono-num text-xl md:text-2xl font-semibold text-foreground">
            1 {f.symbol} = <span className="text-primary">{formatResult(factor)}</span> {t.symbol}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Calculated with engineering-grade precision.</div>
        </div>

        {realExamples.length > 0 && (
          <section className="mt-8 bg-surface-elevated border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)]">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Real-world examples: {f.symbol} to {t.symbol}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Concrete, everyday quantities to help you visualise {f.name.toLowerCase()} in {t.name.toLowerCase()}.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                    <th className="py-2 pr-4 font-semibold">Example</th>
                    <th className="py-2 pr-4 font-semibold font-mono-num">{f.symbol}</th>
                    <th className="py-2 font-semibold font-mono-num">{t.symbol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {realExamples.map((ex) => (
                    <tr key={ex.label}>
                      <td className="py-2.5 pr-4 text-foreground">{ex.label}</td>
                      <td className="py-2.5 pr-4 font-mono-num text-muted-foreground">{formatResult(ex.fromValue)}</td>
                      <td className="py-2.5 font-mono-num text-primary font-semibold">{formatResult(ex.toValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}




        {gen ? (
          <>
            <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)]">
              <h2 className="text-xl md:text-2xl font-semibold mb-3">
                About {f.name.toLowerCase()} to {t.name.toLowerCase()}
              </h2>
              <MdParagraphs text={gen.content.intro} />
              <div className="mt-4">
                <MdParagraphs text={gen.content.result_section} />
              </div>
            </section>

            <section className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-lg font-semibold mb-3">
                  Formula: {f.name.toLowerCase()} → {t.name.toLowerCase()}
                </h2>
                <MdParagraphs text={gen.content.formula_section} />
              </div>
              <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-lg font-semibold mb-4">Frequently asked questions</h2>
                <MdFaq text={gen.content.faq} />
              </div>
            </section>

            <section className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-surface-elevated border border-border rounded-xl p-6">
                <h2 className="font-semibold mb-3">{f.name} → {t.name} table</h2>
                <MdTable text={gen.content.conversion_table} />
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

            <section className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-lg font-semibold mb-4">Common use cases</h2>
                <MdBulletList text={gen.content.use_cases} />
              </div>
              <div className="bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
                <h2 className="text-lg font-semibold mb-4">Tips</h2>
                <MdParagraphs text={gen.content.tips} />
              </div>
            </section>

            <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold mb-4">
                Step-by-step: convert {f.name.toLowerCase()} to {t.name.toLowerCase()}
              </h2>
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
          </>
        ) : (
          <>
        <section className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)]">
          <h2 className="text-xl md:text-2xl font-semibold mb-3">About {f.name.toLowerCase()} to {t.name.toLowerCase()} conversion</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            This tool converts {f.name} ({f.symbol}) to {t.name} ({t.symbol}) using the exact factor{" "}
            <span className="font-mono-num text-foreground font-semibold">{formatResult(factor)}</span>, derived from the SI
            definitions of both units. Both {f.name.toLowerCase()} and {t.name.toLowerCase()} are units of {category.name.toLowerCase()},
            so the relationship is strictly linear — multiply the input by the factor and you have your answer. Use it for
            quick reference, double-checking calculations, or generating tables of common values.
          </p>

          <h3 className="text-base md:text-lg font-semibold mt-6 mb-2">Common real-world scenarios</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground leading-relaxed">
            {GROUP_SCENARIOS[category.group].slice(0, 3).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>



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
          </>
        )}


        {(() => {
          const currentKey = `${category.id}/${f.id}-to-${t.id}`;
          const reverseSlug = `${t.id}-to-${f.id}`;
          const hasReverse = !!getPseoOverride(category.id, reverseSlug);
          const sameCat = getLaunchPairsByCategory(category.id, 9).filter((p) => p.slug !== `${f.id}-to-${t.id}`).slice(0, 8);
          const crossCat = getTopLaunchPairs(8, currentKey).filter((p) => p.category !== category.id).slice(0, 6);
          return (
            <>
              {hasReverse && (
                <section className="mt-12 bg-primary-soft border border-primary/15 rounded-xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-primary/80">Reverse direction</div>
                    <div className="mt-1 text-sm font-semibold text-foreground">
                      Need to go the other way? Convert {t.name.toLowerCase()} to {f.name.toLowerCase()} instead.
                    </div>
                  </div>
                  <Link
                    to={L(`/c/${category.id}/${reverseSlug}`)}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
                  >
                    {t.symbol} <ArrowRightIcon className="h-3.5 w-3.5" /> {f.symbol}
                  </Link>
                </section>
              )}

              {sameCat.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">
                    Next: popular {category.name.toLowerCase()} conversions
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sameCat.map((p) => {
                      const pf = category.units.find((u) => u.id === p.fromUnit);
                      const pt = category.units.find((u) => u.id === p.toUnit);
                      if (!pf || !pt) return null;
                      return (
                        <Link
                          key={p.slug}
                          to={L(`/c/${category.id}/${p.slug}`)}
                          className="group bg-surface-elevated border border-border rounded-xl p-3 hover:border-primary transition"
                        >
                          <div className="text-sm font-semibold flex items-center justify-between">
                            <span>{pf.symbol} → {pt.symbol}</span>
                            <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition" />
                          </div>
                          <div className="mt-1 text-[11px] text-muted-foreground capitalize">
                            {pf.name.toLowerCase()} to {pt.name.toLowerCase()}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {crossCat.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-xl font-semibold mb-4">Trending across other categories</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {crossCat.map((p) => (
                      <Link
                        key={`${p.category}/${p.slug}`}
                        to={L(`/c/${p.category}/${p.slug}`)}
                        className="bg-surface-elevated border border-border rounded-xl p-3 text-sm font-medium hover:border-primary transition text-center"
                      >
                        <div className="font-semibold">{p.fromUnit} → {p.toUnit}</div>
                        <div className="text-[11px] text-muted-foreground capitalize mt-0.5">{p.category}</div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          );
        })()}

        {(() => {
          const hinted = getArticlesByCategoryHint(category.id, 2);
          const fallback = getAllArticles().slice(0, 2);
          const articles = (hinted.length ? hinted : fallback).slice(0, 2);
          if (!articles.length) return null;
          return (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Read more in the learning centre</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {articles.map((a) => (
                  <Link
                    key={a.slug}
                    to={L(`/learn/${a.slug}`)}
                    className="group bg-surface-elevated border border-border rounded-xl p-5 hover:border-primary hover:shadow-[var(--shadow-card)] transition"
                  >
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {a.category} · {a.readingMinutes} min read
                    </div>
                    <div className="mt-2 font-semibold leading-snug group-hover:text-primary transition">
                      {a.title}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {a.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}


        <section
          className="mt-12 bg-surface-elevated border border-border rounded-xl p-6 shadow-[var(--shadow-card)]"
          aria-labelledby="standards-refs"
        >
          <h2 id="standards-refs" className="text-lg font-semibold mb-2">
            Standards &amp; references
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The {f.symbol} → {t.symbol} factor used on this page (
            <span className="font-mono-num text-foreground font-semibold">{formatResult(factor)}</span>
            ) follows the guidelines of NIST Special Publication 811 and the SI definitions
            maintained by the BIPM. Turbo Unit Converter is an independent tool and is not
            certified or endorsed by NIST.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a
                href="https://www.nist.gov/pml/special-publication-811"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                NIST SP 811 — Guide for the Use of the International System of Units
              </a>
            </li>
            <li>
              <a
                href="https://physics.nist.gov/cuu/pdf/sp811.pdf#page=45"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                NIST SP 811 Appendix B — Conversion Factors
              </a>
            </li>
            <li>
              <a
                href="https://www.bipm.org/en/publications/si-brochure"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                BIPM — The International System of Units (SI Brochure)
              </a>
            </li>
            <li>
              <span className="text-muted-foreground">
                IEEE/ASTM SI 10 — American National Standard for Metric Practice
              </span>
            </li>
            <li>
              <Link to={L("/methodology")} className="text-primary hover:underline">
                Read our full methodology →
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
