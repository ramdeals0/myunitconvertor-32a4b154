import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  jsonLd?: object | object[];
  children?: ReactNode;
}

export function Seo({ title, description, canonical, ogType = "website", jsonLd, children }: SeoProps) {
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      {canonical && <link rel="canonical" href={canonical} />}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
      {children}
    </Helmet>
  );
}
