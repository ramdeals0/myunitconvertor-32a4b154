import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { getAllArticles, getArticlesGroupedByCategory } from "@/content/articles";
import { BookOpen, Clock, User, X } from "lucide-react";

export default function LearnPage() {
  const articles = getAllArticles();
  const groups = getArticlesGroupedByCategory();
  const url = "https://turbounitconverter.com/learn";

  const [searchParams, setSearchParams] = useSearchParams();
  const activeParam = searchParams.get("category") ?? "";
  const activeCategories = useMemo(
    () => new Set(activeParam.split(",").map((c) => c.trim()).filter(Boolean)),
    [activeParam]
  );
  const [query, setQuery] = useState("");

  const toggleCategory = (category: string) => {
    const next = new Set(activeCategories);
    if (next.has(category)) next.delete(category);
    else next.add(category);
    const nextParams = new URLSearchParams(searchParams);
    if (next.size === 0) nextParams.delete("category");
    else nextParams.set("category", Array.from(next).join(","));
    setSearchParams(nextParams, { replace: true });
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("category");
    setSearchParams(nextParams, { replace: true });
    setQuery("");
  };

  const q = query.trim().toLowerCase();
  const filteredGroups = groups
    .filter((g) => activeCategories.size === 0 || activeCategories.has(g.category))
    .map((g) => ({
      ...g,
      articles: q
        ? g.articles.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.description.toLowerCase().includes(q)
          )
        : g.articles,
    }))
    .filter((g) => g.articles.length > 0);

  const visibleCount = filteredGroups.reduce((n, g) => n + g.articles.length, 0);
  const hasActiveFilter = activeCategories.size > 0 || q.length > 0;

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
        <header className="max-w-3xl mb-8">
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

        {/* Filter bar */}
        <div className="mb-10 border border-border rounded-2xl bg-surface-elevated p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
            <label className="flex-1">
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles by title or topic…"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              Showing <span className="font-semibold text-foreground">{visibleCount}</span> of {articles.length} articles
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <X className="h-3 w-3" /> Clear filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => {
              const active = activeCategories.has(g.category);
              return (
                <button
                  key={g.category}
                  type="button"
                  onClick={() => toggleCategory(g.category)}
                  aria-pressed={active}
                  className={
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition " +
                    (active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary hover:text-primary")
                  }
                >
                  {g.category}
                  <span className={active ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {g.articles.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-sm">No articles match your filters.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => (
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
                    <span className="inline-flex self-start items-center rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary mb-3">
                      {a.category}
                    </span>
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
          ))
        )}
      </div>
    </>
  );
}
