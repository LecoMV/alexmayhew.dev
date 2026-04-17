# Schema / JSON-LD Audit — 2026-04-17

## P0 — Critical

1. **SoftwareApplication missing offers.availability + publisher** — `src/components/seo/software-json-ld.tsx:28-45`. Google rich-result gate requires `availability: "InStock"` + price OR aggregateRating. Also missing `publisher: ORG_REF`, `sameAs: [github repo URL]`. Consider `@type: ["SoftwareApplication", "SoftwareSourceCode"]` for TraceForge/Pilot (OSS) with `codeRepository` + `programmingLanguage`.
2. **Case studies use bare `CreativeWork`** — `src/components/seo/case-study-json-ld.tsx:14-29`. Switch to `"Article"` or `TechArticle` with `headline`, `image`, `datePublished` (pull real date, not `${year}-01-01` stub), `dateModified`, `publisher: ORG_REF`, `mainEntityOfPage`.
3. **`/tools` CollectionPage missing BreadcrumbList** — `src/app/tools/page.tsx:43-66`. Same for `/work/page.tsx:38-66`.

## P1 — High

1. **No `@graph` consolidation anywhere** — every page emits 2-5 standalone `<script type="application/ld+json">` blocks. Consolidate per file into `{ "@context": "https://schema.org", "@graph": [...] }` per `docs/research/schema-markup-seo-2026.md`. Affected: `json-ld.tsx:218-237` (4 blocks), `service-json-ld.tsx:76-96` (4), `technology-json-ld.tsx:86-100` (5), `case-study-json-ld.tsx:56-67`.
2. **Person.sameAs missing platforms** — `json-ld.tsx:7-12`. Bluesky present, but no Mastodon, Stack Overflow, Dev.to (when cross-posting lands).
3. **Organization.knowsAbout missing** — `json-ld.tsx:85-99`. Person has knowsAbout, ConsultingService has it, but Organization is bare. Add `knowsAbout`, `description`, `areaServed`, `foundingDate`.
4. **No Product schema for Gumroad** — `shop.alexmayhew.dev` is separate subdomain; reference products from `/tools` or `/about` via `Organization.makesOffer` or `Person.owns` with `Product` URLs.
5. **ArticleJsonLd missing wordCount + timeRequired** — `article-json-ld.tsx:28-57`. `post.readingTime` available in data (`src/app/blog/[slug]/page.tsx:93`). Add `timeRequired: "PT{n}M"` and `wordCount`.
6. **Newsletter uses generic Article type** — `src/app/newsletter/[slug]/page.tsx:53-59`. Use `"@type": "NewsletterIssue"` + `isPartOf: Periodical` (stable in schema.org 25.0, Feb 2026).

## P2 — Medium

1. **SoftwareApplication missing @id** — can't be cross-referenced from `Person.owns`. Add `@id: "${SITE_URL}${url}#software"`.
2. **CollectionPage missing BreadcrumbList** on `/tools` and `/work`.
3. **TechnologyJsonLd emits standalone ItemList blocks** with no @id — invisible in Rich Results. Nest under `WebPage.mentions` or give @ids.
4. **SaaS Readiness Assessment should be Quiz type** — `src/app/tools/saas-readiness/page.tsx:52-64`. `Quiz` promoted in schema.org 25.0. `"@type": ["SoftwareApplication", "Quiz"]` with `numberOfQuestions: 8`.
5. **No Review/AggregateRating** — if client testimonials exist, wrap in `Review` referencing ConsultingService @id. Unlocks review rich result on service pages.
6. **Person.award as strings** — convert to `Award` objects with `awarder` for stronger graph signals.
7. **WebSite missing potentialAction SearchAction** — `json-ld.tsx:101-111`. Site has cmdk sitewide search. Declare `SearchAction` with `target: /search?q={search_term_string}` to unlock sitelinks searchbox in SERP.
8. **Breadcrumb coverage gaps** — missing on `/about`, `/contact`, `/work` (hub), `/tools`, `/tools/[tool]`, `/technologies` (hub), `/for/[role]`.
9. **ContactJsonLd is thin** — `contact-json-ld.tsx:4-12` — no `breadcrumb`, no `potentialAction (ContactAction)`, no `about`.
10. **Missing ProfessionalService.knowsLanguage, ConsultingService.slogan** — low-effort AEO strengthening.

## Highest-ROI fixes

1. P0-1 SoftwareApp offers.availability (unlocks rich result)
2. P0-2 case studies → Article (rich result eligibility)
3. P1-1 @graph consolidation sitewide
4. P1-4 Gumroad Product linkage
5. P2-7 SearchAction for sitelinks searchbox
