## AdSense Recovery Implementation Plan

Executing the full recovery plan in ordered phases. Each phase ships independently so we can rescan/verify.

### Phase 1 — Compliance guardrails (ship first, unblocks resubmission)
1. **Ad slot component** (`src/components/AdSlot.tsx`)
   - Renders AdSense only when: page has ≥600 words of prose AND route is in an allowlist (`/`, `/learn/*`, `/guides/*`, `/convert/*` with generated content).
   - Requires `context` prop (surrounding prose) — refuses to render otherwise.
   - Adds `data-ad-context` for auditability.
2. **Noindex sweep**
   - Add `<meta name="robots" content="noindex,follow">` via Helmet on: category pages with <300 words, pair pages lacking generated JSON, any auto-derived pair not in the 139 launch set.
   - Update `scripts/generate-sitemap.mjs` to exclude noindexed URLs (already limited to 139 + static).
3. **Remove ads from thin templates** — strip AdSense units from `Category.tsx` and `Pair.tsx` fallback branches.

### Phase 2 — Publisher-first homepage (~1,000 words original prose)
Rewrite `src/pages/Home.tsx` around editorial sections:
- Hero + Turbo Search (kept)
- "Why unit conversion accuracy matters" (200w original)
- "How Turbo Unit Converter is built" (200w, cites NIST SP 811, methodology link)
- "Choosing the right converter" — decision guide (250w)
- "Common conversion mistakes engineers make" (200w)
- Featured articles grid (links to /learn)
- FAQ (kept, expanded to 6 Qs)

### Phase 3 — `/learn` content hub + 10 launch articles
- New route `/learn` (index) and `/learn/:slug` (article template).
- `src/content/articles/` — 10 MDX-lite JSON articles (800–1,200 words each) with schema `Article` + `BreadcrumbList`:
  1. Psi vs Bar: turbo boost pressure explained
  2. Why 1 kg ≠ 2.2 lb exactly (and when it matters)
  3. Fluid ounces: US vs Imperial — the 4% error
  4. Torque units for mechanics: Nm, lb-ft, kgf·m
  5. Fuel economy: MPG (US) vs MPG (UK) vs L/100km
  6. HP vs kW vs PS: three horsepowers, one engine
  7. Cooking conversions: why grams beat cups
  8. Data rates: Mbps vs MB/s and the ×8 trap
  9. Temperature deltas vs points: Celsius pitfalls
  10. Nautical miles, knots, and why aviation still uses feet
- Article template: intro → key facts → tables → worked examples → FAQ → references → related converters (deep links to pair pages).

### Phase 4 — Trust & E-E-A-T signals
- `/about`, `/editorial-policy`, `/contact` pages.
- Author byline block on articles ("Reviewed against NIST SP 811").
- Link footer + methodology to every article and pair page.

### Phase 5 — Internal linking & sitemap
- Every launch pair page links to ≥2 related articles.
- Every article links to ≥3 pair pages.
- Sitemap expanded to include `/learn`, article slugs, /about, /editorial-policy.

### Technical details
- Article content: JSON files under `src/content/articles/*.json` loaded via `import.meta.glob`, rendered with the existing `MdParagraphs/MdTable/MdFaq` helpers — no new deps.
- Ad safety: `AdSlot` computes surrounding word count from a `context` prop passed by the parent; returns `null` under threshold.
- All new pages get per-route Helmet (title/description/canonical/og) + JSON-LD.
- Noindex logic centralized in `src/lib/seo/indexability.ts`.

### Scope note
This is ~15–20 files across 5 phases. I'll ship phases 1→5 sequentially in this turn, stopping between phases only if a build breaks. The 10 articles will be substantive but written deterministically (no external AI calls) — you can edit copy afterward.
