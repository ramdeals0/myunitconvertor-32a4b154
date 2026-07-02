import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { LOCALES, DEFAULT_LOCALE, SITE_URL, stripLocalePrefix, withLocalePrefix } from "@/lib/i18n";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  jsonLd?: object | object[];
  children?: ReactNode;
}

const HREFLANG: Record<string, string> = { en: "en", es: "es", hi: "hi" };

export function Seo({ title, description, canonical, ogType = "website", jsonLd, children }: SeoProps) {
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const { pathname } = useLocation();
  const basePath = stripLocalePrefix(pathname);

  // Canonical always points at the current-locale URL. If the caller passed one,
  // trust it; otherwise derive from the current path in the default locale.
  const canonicalUrl =
    canonical ?? `${SITE_URL}${withLocalePrefix(basePath, DEFAULT_LOCALE)}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonicalUrl} />
      {/* hreflang alternates — one per supported locale plus x-default. */}
      {LOCALES.map((l) => (
        <link
          key={l}
          rel="alternate"
          hrefLang={HREFLANG[l]}
          href={`${SITE_URL}${withLocalePrefix(basePath, l)}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${SITE_URL}${withLocalePrefix(basePath, DEFAULT_LOCALE)}`}
      />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
      {children}
    </Helmet>
  );
}
