import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Seo } from "@/components/Seo";
import { getAllArticles, getArticle } from "@/content/articles";
import { countWords } from "@/lib/seo/indexability";
import { Clock, ShieldCheck, ArrowRight } from "lucide-react";

export default function LearnArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;
  if (!article) return <Navigate to="/learn" replace />;

  const url = `https://turbounitconverter.com/learn/${article.slug}`;
  const wordCount = countWords(...article.body, ...article.faqs.map((f) => `${f.q} ${f.a}`));
  // Body already ≥600w for every launch article, so ads are compliant here.
  const adsAllowed = wordCount >= 600;

  const others = getAllArticles().filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <Seo
        title={`${article.title} | Turbo Unit Converter`}
        description={article.description}
        canonical={url}
        ogType="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.h1,
            description: article.description,
            url,
            inLanguage: "en",
            datePublished: article.published ?? article.updated,
            dateModified: article.updated,
            author: { "@type": "Person", name: article.author.name, jobTitle: article.author.role },
            ...(article.reviewer && {
              reviewedBy: { "@type": "Person", name: article.reviewer.name, jobTitle: article.reviewer.credential },
            }),
            publisher: {
              "@type": "Organization",
              name: "Turbo Unit Converter",
              url: "https://turbounitconverter.com/",
            },
            mainEntityOfPage: url,
            isPartOf: { "@type": "WebSite", name: "Turbo Unit Converter", url: "https://turbounitconverter.com/" },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://turbounitconverter.com/" },
              { "@type": "ListItem", position: 2, name: "Learn", item: "https://turbounitconverter.com/learn" },
              { "@type": "ListItem", position: 3, name: article.title, item: url },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: article.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/learn" className="hover:text-primary">Learn</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{article.title}</span>
        </nav>

        <header className="mb-8">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">
            {article.category}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            {article.h1}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {article.hero}
          </p>
          <div className="mt-6 rounded-xl border border-border bg-surface-elevated p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">By {article.author.name}</span>
              <span>·</span>
              <span>{article.author.role}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readingMinutes} min read</span>
            </div>
            {article.author.bio && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{article.author.bio}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] uppercase tracking-wider text-muted-foreground/80">
              {article.published && (
                <span>
                  Published <span className="text-foreground/80 normal-case tracking-normal font-mono-num">{article.published}</span>
                </span>
              )}
              <span>
                Last updated <span className="text-foreground/80 normal-case tracking-normal font-mono-num">{article.updated}</span>
              </span>
              <span>
                Last reviewed <span className="text-foreground/80 normal-case tracking-normal font-mono-num">{article.reviewed ?? article.updated}</span>
              </span>
            </div>
            {article.reviewer && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs bg-primary-soft text-primary rounded-full px-3 py-1 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                Reviewed by {article.reviewer.name} — {article.reviewer.credential}
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {article.body.map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-2xl font-semibold tracking-tight mt-10 mb-3 text-foreground">
                  {block.slice(3)}
                </h2>
              );
            }
            if (block.startsWith("### ")) {
              return (
                <h3 key={i} className="text-lg font-semibold mt-6 mb-2 text-foreground">
                  {block.slice(4)}
                </h3>
              );
            }
            if (block.startsWith("> ")) {
              return (
                <blockquote key={i} className="border-l-4 border-primary/40 pl-4 my-4 italic text-foreground font-mono-num">
                  {block.slice(2)}
                </blockquote>
              );
            }
            return (
              <p key={i} className="text-base text-muted-foreground leading-relaxed mt-4">
                {block}
              </p>
            );
          })}
        </div>


        <section className="mt-10 bg-surface-elevated border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Try the converters mentioned in this article</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {article.related.map((r) => (
              <Link
                key={r.href}
                to={r.href}
                className="group flex items-center justify-between bg-background border border-border rounded-xl px-4 py-3 hover:border-primary transition"
              >
                <span className="text-sm font-semibold">{r.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">FAQ</h2>
          <div className="divide-y divide-border bg-surface-elevated border border-border rounded-2xl">
            {article.faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-sm">
                  {f.q}
                  <span className="text-primary group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            This article was written by {article.author.name} ({article.author.role}) and last reviewed on {article.reviewed ?? article.updated} against{" "}
            <a href="https://www.nist.gov/pml/special-publication-811" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NIST SP 811</a>{" "}
            and the{" "}
            <a href="https://www.bipm.org/en/publications/si-brochure" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BIPM SI Brochure</a>.
            Read our full{" "}
            <Link to="/editorial-policy" className="text-primary hover:underline">editorial policy</Link>.
          </p>
        </section>

        {others.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Keep reading</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {others.map((a) => (
                <Link
                  key={a.slug}
                  to={`/learn/${a.slug}`}
                  className="group bg-surface-elevated border border-border rounded-xl p-4 hover:border-primary transition"
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {a.category}
                  </div>
                  <div className="mt-2 font-semibold text-sm leading-snug group-hover:text-primary transition">
                    {a.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
