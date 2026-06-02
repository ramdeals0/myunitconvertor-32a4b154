import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";
import { useI18n, LANGUAGES } from "@/lib/i18n";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string;
  jsonLd?: object | object[];
  children?: ReactNode;
}

const BASE_URL = "https://turbounitconverter.com";

export function Seo({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage,
  keywords,
  jsonLd,
  children,
}: SeoProps) {
  const { lang: currentLang, localizePath } = useI18n();
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  // Generate hreflang tags and localized canonical if a base canonical URL is provided
  const canonicalUrl = canonical ? new URL(canonical) : null;
  const basePath = canonicalUrl ? canonicalUrl.pathname : "";

  const hreflangs = canonicalUrl
    ? LANGUAGES.map((l) => ({
        lang: l.code,
        href: `${BASE_URL}${localizePath(basePath, l.code)}`,
      }))
    : [];

  const localizedCanonical = canonicalUrl
    ? `${BASE_URL}${localizePath(basePath, currentLang)}`
    : undefined;

  const finalOgImage = ogImage || `${BASE_URL}/og-image.jpg`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={finalOgImage} />
      {localizedCanonical && <meta property="og:url" content={localizedCanonical} />}

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={finalOgImage} />

      {localizedCanonical && <link rel="canonical" href={localizedCanonical} />}

      {hreflangs.map((h) => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.href} />
      ))}
      {canonicalUrl && <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${basePath}`} />}

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
      {children}
    </Helmet>
  );
}
