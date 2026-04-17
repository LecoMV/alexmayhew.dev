# JSON-LD Structured Data Audit — alexmayhew.dev (2026-04-16)

**Auditor:** schema-auditor (read-only)
**Scope:** All page types, all JSON-LD components, @id graph consolidation, schema type correctness
**Reference:** `docs/research/schema-markup-seo-2026.md`

---

## Executive Summary

The site's schema foundation is **strong and well-architected**: `PERSON_REF` / `ORG_REF` / `WEBSITE_REF` helper pattern is used consistently across 9 JSON-LD component files, Person `@id` is consolidated, `ConsultingService` replaces the old `ProfessionalService`, `TechArticle` vs `BlogPosting` is differentiated via `isHub`, FAQPage + BreadcrumbList are present on the right page types, and ProfilePage + CollectionPage were correctly added per E-E-A-T best practices.

However, there are **1 CRITICAL** and **several HIGH** issues that break the entity graph for /technologies and several pages, plus a long tail of MEDIUM inconsistencies (inline Organization in worksFor, FAQ gaps on 4/5 hub posts, missing schema on /work hub, /tools hub, /newsletter archive, /docs, /privacy, /terms) that are costing AI-citation signal and rich-result eligibility.

**Counts:** 1 CRITICAL • 7 HIGH • 11 MEDIUM • 6 LOW

---

## CRITICAL

### C1. `/technologies` (hub) references wrong WebSite `@id` — breaks entity graph

**File:** `src/app/technologies/page.tsx:64`
**Evidence:**

```tsx
isPartOf: {
  "@type": "WebSite",
  "@id": `${siteUrl}#website`,   // ← missing slash
  url: siteUrl,
  name: "Alex Mayhew",
},
```

**Canonical `@id` (json-ld.tsx:86 + schema-utils.tsx:17):** `https://alexmayhew.dev/#website`
**Bug produced:** `https://alexmayhew.dev#website` — different URI, creates a **second disconnected WebSite node** in Google's entity graph every time this page is crawled.
**Severity:** Critical. Breaks the exact pattern the rest of the codebase has painstakingly maintained.
**Fix:** Replace the inline `isPartOf` with `WEBSITE_REF` imported from `@/components/seo/schema-utils`. The file already has a local `webPageSchema` object — swap the object literal for `isPartOf: WEBSITE_REF`.

---

## HIGH

### H1. `worksFor` in Person is an inline Organization object, not a ref

**File:** `src/components/seo/json-ld.tsx:16-19`
**Evidence:**

```tsx
worksFor: {
  "@type": "Organization",
  name: "Alex Mayhew Consulting",
},
```

**Problem:** Root-layout Person declares a fresh unnamed Organization inline (no `@id`). The canonical Organization is `https://alexmayhew.dev/#organization`, which uses `name: "Alex Mayhew"` (not `"Alex Mayhew Consulting"`). This creates a second Organization entity on every page with a different name, fragmenting the brand entity.
**Fix:** `worksFor: ORG_REF` (i.e. `{ "@id": "https://alexmayhew.dev/#organization" }`). If Alex wants to keep the alternate name "Alex Mayhew Consulting", add it as `alternateName` on the canonical Organization — it already exists on ConsultingService (json-ld.tsx:101).

### H2. 4 of 5 hub posts declared as `isHub: true` have NO FAQ schema

**Files:**

- `content/blog/ai-assisted-development-guide.mdx` (frontmatter `isHub: true`) → key `ai-assisted-development-guide` IS in hub-faqs.ts ✓
- `content/blog/engineering-leadership-founder-to-cto.mdx` → key `engineering-leadership-founder-to-cto` IS in hub-faqs.ts ✓
- `content/blog/modern-frontend-architecture.mdx` → key `modern-frontend-architecture` IS in hub-faqs.ts ✓
- `content/blog/performance-engineering-playbook.mdx` → key `performance-engineering-playbook` IS in hub-faqs.ts ✓
- `content/blog/saas-architecture-decision-framework.mdx` → key `saas-architecture-decision-framework` IS in hub-faqs.ts ✓

**Correction after re-check:** All 5 hub posts have FAQ. Re-classified — see MEDIUM section for the real FAQ coverage gap (spoke post FAQ sparsity).

### H2 (revised). FAQPage schema missing on many published pSEO/spoke URLs

**Context:** pSEO page types (`/services/{slug}`, `/services/migrations/{slug}`, `/services/integrations/{slug}`, `/services/comparisons/{slug}`, `/for/{role}`) DO render `faqSchema()` via their JSON-LD components — verified. That side is healthy.
**Real gap:** Only ~14 of 65 blog post slugs are in `src/app/blog/[slug]/hub-faqs.ts`. Spoke posts that have natural Q&A structure in prose (boring-technology-wins, build-vs-buy, fractional-cto-vs-full-time, ic-to-tech-lead, multi-tenancy-prisma-rls, event-driven-architecture-saas, incident-response-saas, saas-billing-stripe-architecture, core-web-vitals-optimization, rsc-edge-death-of-waterfall, soc2-compliance-startup-roadmap, and ~35 others) currently emit no FAQPage schema.
**Impact:** AI citation rate for those posts is ~15% (no schema) vs ~41% with FAQ schema per the research doc. Direct AEO/GEO loss on the content that is ranking hardest.
**Fix:** Either (a) extract 3 Q&A pairs from each spoke post body into hub-faqs.ts, or (b) better — move FAQ authoring into MDX frontmatter so every post can declare `faqs: [...]` and have it auto-emit without requiring a separate file.

### H3. `/work` (case study hub) has no schema at all

**File:** `src/app/work/page.tsx`
**Evidence:** Page has Metadata only; no JSON-LD component is rendered. Compare to `/blog` which renders `BlogCollectionJsonLd` and `/technologies` which renders `TechnologiesHubJsonLd`.
**Fix:** Add a `CollectionPage` with `@id: /work`, `isPartOf: WEBSITE_REF`, and `mainEntity: ItemList` enumerating the published case studies. Also add BreadcrumbList (Home → Work).

### H4. `/tools` hub page has no schema at all

**File:** `src/app/tools/page.tsx`
**Evidence:** Metadata only; no JSON-LD. Compare to `/services` which renders `ServicesHubJsonLd`.
**Fix:** Add `CollectionPage` enumerating `/tools/traceforge`, `/tools/pilot`, `/tools/voice-cloner`, `/tools/saas-readiness` as ItemList of SoftwareApplication items. Add BreadcrumbList.

### H5. `/newsletter` archive has no schema

**File:** `src/app/newsletter/page.tsx`
**Evidence:** No JSON-LD rendered. Per the research doc this should be a `CollectionPage` → `Blog` (the whole newsletter is a Blog, individual issues are BlogPostings — which `/newsletter/[slug]` already uses).
**Fix:** Add `CollectionPage` or `Blog` schema at `@id: /newsletter` with `mainEntity: ItemList` of all issues, `isPartOf: WEBSITE_REF`, `publisher: ORG_REF`, `author: PERSON_REF`. Add BreadcrumbList.

### H6. `/docs` and docs pages have no JSON-LD at all

**File:** `src/app/docs/[[...slug]]/page.tsx`
**Evidence:** Fumadocs page with Metadata only, no JSON-LD injection. Docs pages are the highest-signal technical content on the site and should be TechArticle at minimum.
**Fix:** Inject TechArticle schema in the Fumadocs page with `headline`, `author: PERSON_REF`, `publisher: ORG_REF`, `dateModified` (from git last-modified or frontmatter), `isPartOf: WEBSITE_REF`. Also add BreadcrumbList.

### H7. `/tools/saas-readiness` quiz has no SoftwareApplication / WebApplication schema

**File:** `src/app/tools/saas-readiness/page.tsx`
**Evidence:** Every other tool page (traceforge, pilot, voice-cloner) renders `SoftwareJsonLd`. saas-readiness is the most recently shipped lead magnet and has zero schema.
**Fix:** Render `SoftwareJsonLd` with `applicationCategory: "BusinessApplication"`, `operatingSystem: "Web Browser"`, `featureList`, author `@id` reference. This is a lead magnet — missing schema is CRO loss.

---

## MEDIUM

### M1. Organization `@id` consolidation — `sameAs` drift vs Person

**File:** `src/components/seo/json-ld.tsx:76-80` (Organization), `src/components/seo/json-ld.tsx:197-201` (ConsultingService)
**Evidence:** Person sameAs includes Bluesky (`bsky.app/profile/alexmayhewdev.bsky.social`); Organization and ConsultingService sameAs arrays do not. All three entities represent the same actor/brand and should have consistent sameAs lists for knowledge-graph reinforcement.
**Fix:** Add Bluesky to Organization sameAs (line 76) and ConsultingService sameAs (line 197).

### M2. `CollectionPage` on `/blog` missing `isPartOf` and `publisher`

**File:** `src/app/blog/page.tsx:48-67`
**Evidence:**

```tsx
"@context": SCHEMA_CONTEXT,
"@type": "CollectionPage",
"@id": `${SITE_URL}/blog`,
// missing: isPartOf, publisher, about
```

**Fix:** Add `isPartOf: WEBSITE_REF`, `publisher: ORG_REF`, `author: PERSON_REF`, `inLanguage: "en-US"` for consistency with the rest of the graph.

### M3. `CollectionPage` on `/technologies` duplicates WebSite node instead of referencing

**File:** `src/app/technologies/page.tsx:62-67`
**Evidence:** Inline re-declaration with bad `@id` (see C1). Even after fixing the `@id` slash bug, the pattern should be `isPartOf: WEBSITE_REF` — not re-declaring the WebSite with name/url.
**Fix:** Use `WEBSITE_REF`. Also applies to fixing C1.

### M4. `ProfilePage` on `/about` missing `breadcrumb` and `inLanguage`

**File:** `src/app/about/page.tsx:37-48`
**Evidence:** ProfilePage has `@id`, `url`, `name`, `description`, `mainEntity`, `dateModified`. Missing `inLanguage`, `isPartOf: WEBSITE_REF`, and `breadcrumb` (the page has a /about breadcrumb in the navigation).
**Fix:** Add `isPartOf: WEBSITE_REF`, `inLanguage: "en-US"`, and a minimal BreadcrumbList (Home → About).

### M5. `ContactPage` missing `isPartOf` and `breadcrumb`

**File:** `src/components/seo/contact-json-ld.tsx:4-12`
**Evidence:** ContactPage defines `name`, `description`, `url`, `mainEntity: PERSON_REF`. Missing `isPartOf: WEBSITE_REF`, `inLanguage`, BreadcrumbList.
**Fix:** Add `isPartOf`, `inLanguage`, and a BreadcrumbList (Home → Contact).

### M6. CaseStudy: Author inline + BreadcrumbList inline (not using helpers)

**File:** `src/components/seo/case-study-json-ld.tsx:13-65`
**Evidence:**

- Line 20: uses `author: PERSON_REF` ✓
- Line 22-28: `about.SoftwareApplication` is inline (fine, represents the project)
- Line 32-54: BreadcrumbList is hand-rolled instead of using `breadcrumbSchema()` helper
- Missing `publisher: ORG_REF`, `inLanguage`, `mainEntityOfPage`, `isPartOf: WEBSITE_REF`
- `datePublished: ${project.year}-01-01` — fake January 1st date. If unknown, omit; if known, use real date. Fake dates erode freshness signals.
  **Fix:** Refactor to use `breadcrumbSchema()`, add publisher/inLanguage/mainEntityOfPage, and source real dates from the project data or omit.

### M7. `ArticleJsonLd` does not surface `series` / topic cluster relationship

**File:** `src/components/seo/article-json-ld.tsx:26-49`
**Evidence:** `post.series` is read in the page (blog/[slug]/page.tsx:93) but never passed to ArticleJsonLd. Hub-and-spoke is the explicit content strategy (5 hubs × 39 spokes) and schema does not express it.
**Fix:** When `series` is present and the post is a spoke, add `isPartOf: { "@type": "CreativeWorkSeries", name: seriesName, url: hubUrl }` OR `hasPart` on the hub's TechArticle pointing at spokes. The former is simpler. This signals topical clustering to AI and search engines.

### M8. ComparisonJsonLd — date is hardcoded

**File:** `src/components/seo/comparison-json-ld.tsx:80`
**Evidence:** `datePublished: "2026-03-01"` hardcoded for every comparison page regardless of actual publication date.
**Fix:** Pull from `page.lastUpdated` or a dedicated `publishedAt` in `ComparisonPage` data. Hardcoded dates drift and eventually look suspicious.

### M9. ArticleJsonLd `mainEntityOfPage.@id` includes slug prefix inconsistently

**File:** `src/components/seo/article-json-ld.tsx:41-44`
**Evidence:** `@id: ${siteUrl}/${slug}` where slug is called with `blog/{slug}` for posts and `newsletter/{slug}` for newsletter. Works, but the prefix is passed by caller — fragile. Newsletter issues should probably use `Article` or `NewsArticle` explicitly, not `BlogPosting`.
**Fix:** Consider separating ArticleJsonLd into ArticleJsonLd (canonical) and NewsletterJsonLd, OR add a `type` prop to ArticleJsonLd to let newsletter pages emit `NewsArticle` and blog pages emit `BlogPosting`/`TechArticle`.

### M10. HowTo schemas on migration/integration have no `image`

**Files:** `src/components/seo/migration-json-ld.tsx:72-123`, `src/components/seo/integration-json-ld.tsx:72-123`
**Evidence:** HowTo steps have `name` and `text`, but no `image` on the HowTo or steps. Per research doc, HowTo is deprecated for rich results but still parsed by AI — image would help AI understanding marginally.
**Fix:** Low priority given deprecation. Skip unless pages add diagrams. Flag if step-level diagrams exist in page body and aren't referenced.

### M11. Service `@id` collides with WebPage `@id`

**Files:** `src/components/seo/service-json-ld.tsx:28`, `migration-json-ld.tsx:25`, `integration-json-ld.tsx:25`, `comparison-json-ld.tsx:26`, `role-json-ld.tsx:27`
**Evidence:** Service `@id: pageUrl` and WebPage `@id: pageUrl` (webPageSchema) both use the exact same `@id` on the same page. These are two different entities (a Service and a WebPage) and should have distinct `@id`s.
**Fix:** Service `@id` should be `${pageUrl}#service`, WebPage stays at `pageUrl`. Example: technology-json-ld.tsx already does this correctly (`${pageUrl}#service`, line 23). Align all other components to match.

---

## LOW

### L1. `SoftwareJsonLd` — missing publisher

**File:** `src/components/seo/software-json-ld.tsx:28-45`
**Evidence:** Has `author: { "@id": /#person }` but no `publisher: ORG_REF`.
**Fix:** Add `publisher: { "@id": "https://alexmayhew.dev/#organization" }` for consistency.

### L2. `ConsultingService` has `logo: /favicon.svg` — should be a full URL

**File:** `src/components/seo/json-ld.tsx:103`
**Evidence:** `logo: "https://alexmayhew.dev/favicon.svg"` — actually full URL, verified. Not an issue. SVG logos are acceptable per Google. Disregard.

### L3. `Organization` logo uses `og-image.png` not a logo file

**File:** `src/components/seo/json-ld.tsx:70-75`
**Evidence:** `logo.url: "https://alexmayhew.dev/og-image.png"` — an OG card, not a logo. Google's Organization schema docs recommend a square logo file optimized for logos (min 112×112).
**Fix:** Create `/public/logo.png` (square, transparent bg) or use `/favicon.svg`. `og-image.png` is 1200×630 landscape — wrong aspect ratio for a logo.

### L4. `ConsultingService` `priceRange: "$$$$"` is ambiguous

**File:** `src/components/seo/json-ld.tsx:108`
**Evidence:** `$$$$` is the highest tier. OK if accurate (positioning as premium), but the actual `hasOfferCatalog` prices range $2k-$200k (minPrice 2000 → maxPrice 200000). If the site wants to signal approachability for advisory retainer ($2k/mo), `$$$` is more honest.
**Fix:** Review positioning. No structural bug — just a business judgment call.

### L5. `ArticleJsonLd` lacks `wordCount`, `articleBody` excerpt

**File:** `src/components/seo/article-json-ld.tsx:26-49`
**Evidence:** Not required but modern Article schema benefits AI citation from `wordCount` and optionally a short `articleBody` excerpt. Readingtime is computed (post.readingTime) but not exposed.
**Fix:** Add `wordCount` derived from `readingTime` (rough: words = readingTimeMinutes \* 250) OR expose it directly if fumadocs provides it. Low-impact nice-to-have.

### L6. `/privacy`, `/terms` have no JSON-LD

**Files:** `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`
**Evidence:** Metadata only. Legal pages are low priority but could emit `WebPage` with `isPartOf: WEBSITE_REF` for graph completeness and BreadcrumbList (Home → Privacy / Terms).
**Fix:** Optional — add WebPage + BreadcrumbList. Very low signal.

---

## What's Right (keep doing)

- `PERSON_REF`, `ORG_REF`, `WEBSITE_REF` exported from `schema-utils.tsx` and consistently imported across 12 files.
- `ConsultingService` (not `ProfessionalService`) per 2026 research recommendation.
- `TechArticle` vs `BlogPosting` differentiated via `isHub` prop — exactly right.
- `ProfilePage` on /about, `CollectionPage` on /blog — both correctly chosen per E-E-A-T best practices.
- `LocalBusinessJsonLd` correctly stubbed to no-op after consolidation into ConsultingService.
- `BreadcrumbList` rendered on all deep pages via `breadcrumbSchema()` helper (pSEO) or `BreadcrumbJsonLd` component (blog, newsletter).
- `FaqJsonLd` + pSEO `faqSchema()` rendered with correct Question/Answer nesting.
- `Person.@id` is consolidated — only one inline Person in the codebase (json-ld.tsx).
- `Organization.@id` is consolidated — only one canonical Organization node.
- Migration and integration pages correctly `noindex` (doorway page guidance).
- `/services`, `/for`, `/technologies` hubs all have ItemList schema (despite the /technologies @id bug).

---

## Recommended Fix Order for seo-implementer

1. **C1** — one-line fix, highest structural impact.
2. **H1** — one-line fix (replace inline Organization with ORG_REF).
3. **H3, H4, H5, H7** — add CollectionPage + BreadcrumbList + SoftwareJsonLd. Clear patterns already exist in the codebase to copy.
4. **H6** — docs TechArticle injection into Fumadocs page.
5. **M1, M2, M4, M5** — small additions (`isPartOf`, `publisher`, Bluesky sameAs).
6. **M11** — systematic `#service` suffix on Service `@id`s (alignment with technology-json-ld.tsx).
7. **H2 (revised), M7** — content work: expand hub-faqs.ts coverage OR migrate to MDX frontmatter, add `series` relationship.
8. **M3, M6, M8, M9, M10** — pattern cleanups, DRY helpers.
9. **L1-L6** — polish, optional.
