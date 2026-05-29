# Turbo Unit Converter

Fast, accurate online unit converter for 75+ categories. Built as a **Vite + React SPA**.

## Tech Stack

- **Vite 7** + **React 19** + **TypeScript**
- **React Router v7** (client-side routing)
- **React Helmet Async** (per-page SEO)
- **Tailwind CSS v4** + Radix UI / shadcn
- **TanStack Query v5**
- **Lucide React**

No backend required — fully static / client-side.

## Development

```bash
bun install
bun run dev      # start dev server on :8080
bun run build    # production build (outputs to dist/)
bun run preview  # preview the production build
```

## Deployment

The build output (`dist/`) is a fully static SPA. Deploy to any static host:

### Vercel / Netlify / Cloudflare Pages
- Build command: `bun run build`
- Output directory: `dist`
- **SPA fallback required**: configure all routes to fall back to `/index.html`
  - Netlify: add `_redirects` with `/* /index.html 200`
  - Vercel: add `vercel.json` with a catch-all rewrite to `/index.html`
  - Cloudflare Pages: detected automatically for SPAs

### Self-hosted (nginx)
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Project Structure

```
src/
├── App.tsx               # Routes
├── main.tsx              # Entry point
├── pages/                # Route components (Home, About, Category, Pair, ...)
├── components/           # Reusable components (Converter, SiteChrome, Seo, ...)
├── lib/converters/       # Conversion data + math
└── lib/i18n.tsx          # Translations (en, es, hi)
public/
├── sitemap.xml           # Static sitemap
└── robots.txt
```

## Regenerating the sitemap

`public/sitemap.xml` is static. After adding categories or popular pairs, regenerate it from `src/lib/converters/data.ts` (see the script used during the Vite migration).

## License

MIT
