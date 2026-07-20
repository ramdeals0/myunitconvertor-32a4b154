// Editorial articles powering the /learn hub. Content lives in JSON files so
// it can be edited without touching UI code. Loaded eagerly at build time.

export interface RelatedConverter {
  label: string;
  href: string;
}

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface Article {
  slug: string;
  title: string;
  h1: string;
  description: string;
  category: string;
  readingMinutes: number;
  /** ISO date the article was first published. Falls back to `updated` when omitted. */
  published?: string;
  /** ISO date the article was last content-edited. */
  updated: string;
  /** ISO date the article was last technically reviewed. Falls back to `updated`. */
  reviewed?: string;
  author: {
    name: string;
    role: string;
    /** Optional short bio line, one sentence. */
    bio?: string;
  };
  reviewer?: {
    name: string;
    credential: string;
  };
  hero: string;
  body: string[]; // array of paragraphs / subheadings prefixed with "## "
  faqs: ArticleFaq[];
  related: RelatedConverter[];
}

const modules = import.meta.glob<{ default: Article }>("./*.json", { eager: true });

const list: Article[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => (a.updated < b.updated ? 1 : -1));

const bySlug = new Map(list.map((a) => [a.slug, a]));

export function getAllArticles(): Article[] {
  return list;
}

export function getArticle(slug: string): Article | undefined {
  return bySlug.get(slug);
}

export function getArticlesByCategoryHint(categoryId: string, limit = 3): Article[] {
  return list.filter((a) => a.category === categoryId).slice(0, limit);
}

export function getArticlesGroupedByCategory(): { category: string; articles: Article[] }[] {
  const map = new Map<string, Article[]>();
  for (const a of list) {
    const bucket = map.get(a.category) ?? [];
    bucket.push(a);
    map.set(a.category, bucket);
  }
  return Array.from(map.entries())
    .map(([category, articles]) => ({ category, articles }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
