import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { getAllArticles, getArticlesGroupedByCategory } from "@/content/articles";
import { BookOpen, Clock, User } from "lucide-react";

export default function LearnPage() {
  const articles = getAllArticles();
  const groups = getArticlesGroupedByCategory();
  const url = "https://turbounitconverter.com/learn";

  return (
    <>
      <Seo
        title="Learn — Unit Conversion Guides & Engineering References | Turbo Unit Converter"
        description="In-depth articles on unit conversions engineers actually run into: pressure, torque, fuel economy, data rates, temperature and more. Reviewed against NIST SP 811."
        canonical={url}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Learn — Unit Conversion Guides",
            url,
            inLanguage: "en",
            isPartOf: {
              "@type": "WebSite",
              name: "Turbo Unit Converter",
              url: "https://turbounitconverter.com/",
            },
            hasPart: articles.map((a) => ({
              "@type": "Article",
              headline: a.h1,
              url: `https://turbounitconverter.com/learn/${a.slug}`,
              datePublished: a.published ?? a.updated,
              dateModified: a.updated,
              author: { "@type": "Person", name: a.author.name },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://turbounitconverter.com/" },
              { "@type": "ListItem", position: 2, name: "Learn", item: url },
            ],
          },
        ]}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary mb-4">
            <BookOpen className="h-3.5 w-3.5" /> Learning centre
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Unit conversion, explained by engineers
          </h1>
          <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">
            {articles.length} deep, practical guides for the conversions that
            trip people up in real work — turbo boost pressure, torque wrench
            units, fuel economy across regions, radiation dose, data rate
            confusion, and more. Every article is written by our engineering
            desk and reviewed against{" "}
            <Link to="/methodology" className="text-primary hover:underline">
              NIST SP 811 and the BIPM SI Brochure
            </Link>
            .
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.category} className="mb-14">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                {group.category}
              </h2>
              <span className="text-xs text-muted-foreground">
                {group.articles.length} article{group.articles.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.articles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/learn/${a.slug}`}
                  className="group bg-surface-elevated border border-border rounded-2xl p-6 hover:border-primary hover:shadow-[var(--shadow-card)] transition flex flex-col"
                >
                  <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {a.description}
                  </p>
                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      <span className="font-medium text-foreground/80">{a.author.name}</span>
                      <span className="text-muted-foreground/60">·</span>
                      <span>{a.author.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {a.readingMinutes} min read
                      </span>
                      <span>·</span>
                      <span>Reviewed {a.reviewed ?? a.updated}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
