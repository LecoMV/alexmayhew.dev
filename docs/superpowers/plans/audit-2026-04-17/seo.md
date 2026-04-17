# SEO Audit — 2026-04-17

## P0 — None (first audit fixes landed)

## P1 — Within 1 week

1. **Migration/integration/comparison pSEO pages are noindex'd AND excluded from sitemap** — `src/app/services/{migrations,integrations,comparisons}/[slug]/page.tsx:73` — but linked from `llms.txt` (lines 59-61) and command palette (`search-index.ts:60-80`). Contradictory: noindex overrides canonical. Decision needed: flip to `index: true` (they meet same quality gates as `/services/[slug]`) to unblock ~20+ pages given near-zero domain authority constraint. Rationale "wait for DR>20" is blocking real discovery.
2. **`maximumScale: 5` + `userScalable: true`** — `src/app/layout.tsx:46-47`. A11y anti-pattern per Lighthouse 2026; Google Search Central recommends removing `maximum-scale`. Set to 10 or remove.
3. **Sitemap `images` field only on blog posts** — `src/app/sitemap.ts:128`. Next.js 15 supports `images` per entry. pSEO services, role pages, case studies, technology pages all have OG imagery but no `images` field in sitemap. Add `images: [ogImageUrl]` to `servicePages`, `rolePages`, `caseStudyPages`, `technologyPages`.
4. **`lastModified` churn on non-blog routes** — `sitemap.ts:134,144,154,164,179,216,223`. All dynamic non-blog routes emit `siteLastUpdated` (build timestamp). Google 2026 discounts constantly-churning lastmod. Switch to per-page `lastUpdated` (preferred) or stable date.
5. **Contact page missing Twitter card** — `src/app/contact/page.tsx:6-31`. Only `openGraph` + `canonical`. Other top-level pages have full Twitter card.

## P2 — Nice-to-have

1. **`/demo/` disallowed in robots** — `src/app/robots.ts:9`. If showcase for E-E-A-T, reconsider disallow.
2. **No sitemap-images.xml or sitemap-news.xml** — Not required (image data inline is fine; news irrelevant).
3. **hreflang absent** — Correct for English-only, US-focused.
4. **FAQ schema only on blog hubs, not pSEO pages** — `src/app/blog/[slug]/page.tsx:121,143`. Service/migration/integration/comparison pages have 4+ FAQs in data but no `FAQPage` JSON-LD. Verify `ServiceJsonLd`/`MigrationJsonLd` include `mainEntity` FAQ.
5. **`changeFrequency: "weekly"` on `/blog` vs actual 2/month cadence** — `sitemap.ts:53`. Set to `"monthly"`.
6. **`priceRange: "$$$$"` on ConsultingService** — `json-ld.tsx:126`. Google ignores non-enum values. Remove (priceSpecification exists in hasOfferCatalog).
7. **knowsAbout duplication Person (30 items) vs ConsultingService (12 items)** — `json-ld.tsx:44-76, 143-156`. Consolidate to one canonical list.
8. **No `dateModified` strategy when updatedAt === publishedAt** — AI crawlers treat `dateModified === datePublished` as stale. Omit dateModified in that case.

## Summary

13 issues: 0 P0, 5 P1, 8 P2.

Biggest lever: P1-1 — indexing migration/integration/comparison pSEO would unlock ~20+ quality-gated pages currently orphaned, addressing the indexing bottleneck from near-zero domain authority.
