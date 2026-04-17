# pSEO System Audit — 2026-04-16

**Scope:** Deep audit of programmatic SEO system at alexmayhew.dev. Read-only report; no code changes.

**Files audited:**

- `src/data/pseo/types.ts` (526 LOC)
- `src/data/pseo/validation.ts` (441 LOC)
- `src/data/pseo/pages.ts` (3,641 LOC, 19 pages)
- `src/data/pseo/technologies.ts` (542 LOC, 8 pages)
- `src/data/pseo/industries.ts` (1,985 LOC, 10 industries — data only, no routes)
- `src/data/pseo/migrations.ts` (2,084 LOC, 7 pages, noindex)
- `src/data/pseo/integrations.ts` (1,696 LOC, 5 pages, noindex)
- `src/data/pseo/comparisons.ts` (1,472 LOC, 5 pages, noindex)
- `src/data/pseo/index.ts` (176 LOC, barrel)
- `src/app/services/`, `src/app/technologies/`, `src/app/for/` route groups
- `src/components/seo/{service,technology,migration,integration,comparison,role}-json-ld.tsx`

**Page inventory (total 44 pSEO routes):**

| Route template                  | Count  | Indexed     | Source                             |
| ------------------------------- | ------ | ----------- | ---------------------------------- |
| `/services/[slug]`              | 19     | Yes         | `pages.ts`                         |
| `/services/migrations/[slug]`   | 7      | **noindex** | `migrations.ts`                    |
| `/services/integrations/[slug]` | 5      | **noindex** | `integrations.ts`                  |
| `/services/comparisons/[slug]`  | 5      | **noindex** | `comparisons.ts`                   |
| `/technologies/[slug]`          | 8      | Yes         | `technologies.ts`                  |
| `/for/[role]`                   | varies | Yes         | `src/data/roles` (separate system) |

Sitemap emits services + technologies + roles + case studies + blog only. Migrations/integrations/comparisons excluded both from sitemap AND via `robots: noindex`. Consistent with "authority-conservation" strategy for DR <20 site.

---

## CRITICAL (5)

### C1. Five published pSEO service pages fail their own quality gates

**Severity:** CRITICAL. Quality gates are declared "non-negotiable" in `.claude/rules/pseo.md` (`MIN_LONG_FORM_WORDS = 150`) but are only enforced in unit tests, not in the build pipeline. Running `checkQualityGates()` against the published `pseoPages` array:

| Slug                                  | `whyThisStack` words | `projectApproach` words | Gate |
| ------------------------------------- | -------------------- | ----------------------- | ---- |
| `postgresql-developer-for-fintech`    | 152                  | **136**                 | FAIL |
| `fractional-cto-for-startups`         | **123**              | **109**                 | FAIL |
| `technical-due-diligence-consultant`  | **103**              | **94**                  | FAIL |
| `legacy-migration-architect`          | **121**              | **107**                 | FAIL |
| `performance-optimization-consultant` | **119**              | **118**                 | FAIL |

These same five pages also have only **3 FAQs** (project rule requires 4+). They are the indexed, authority-building pSEO surface — yet they are the weakest content on the site. Thin-content risk is real on a zero-backlink domain.

File refs: `src/data/pseo/pages.ts:2811-3641` (lines of the five failing pages).

**Remediation options:**

1. Expand copy to hit 150 words (preferred — add expertApproach block, deepen narrative).
2. Add a build-time validator that runs `validatePseoPage()` over `pseoPages` and fails the build.
3. Noindex these 5 until remediated (matches migration/integration/comparison strategy, loses 5 indexed URLs).

### C2. Topic cluster system is broken — 12 of 19 cluster slugs point to pages that do not exist

**Severity:** CRITICAL. `TOPIC_CLUSTERS` in `src/data/pseo/types.ts:390-447` references slugs without the `-for-` connector the actual page slugs use:

- HUB `technical-advisor-startups` → **missing** (actual: `technical-advisor-for-startups`)
- HUB `ai-integration-developer` → **missing** (actual: `ai-integration-developer-for-saas`)
- SPOKE `postgresql-fintech-database` → **missing** (actual: `postgresql-developer-for-fintech`)
- SPOKE `fractional-cto-startups` → **missing** (actual: `fractional-cto-for-startups`)
- SPOKE `ai-integration-healthcare` → **missing** (actual: `ai-integration-developer-for-healthcare`)
- SPOKE `fractional-cto-investor-ready` → never existed
- SPOKE `technical-due-diligence` → **missing** (actual: `technical-due-diligence-consultant`)
- Entire `startup-stack` cluster (4 slugs): **zero valid pages**
- Entire `ai-integration` cluster (2 slugs): **zero valid pages**

Impact: `TopicClusterNav` on service pages renders broken links. `getClusterRelatedPages()` returns invalid slugs that are then filtered by the consumer, but the hub/spoke internal-linking strategy documented in `MEMORY.md` and `docs/CONTENT_STATUS.md` is effectively dead for pSEO. **This is the same drift class of bug as the homepage broken link that was just fixed on 2026-04-05** — only caught by manual runtime testing.

**Remediation:** fix slug strings in `TOPIC_CLUSTERS` AND add a runtime test that `spokeSlugs.every(s => pseoPages.find(p => p.slug === s))`.

### C3. 13 `relatedServices` entries reference non-existent pages

**Severity:** CRITICAL. Page-level internal linking pointing at phantom URLs:

```
nextjs-developer-for-saas          -> typescript-developer-for-saas, postgresql-developer-for-saas
react-developer-for-fintech        -> typescript-developer-for-fintech, nodejs-developer-for-fintech
python-developer-for-healthcare    -> python-developer-for-ai-integration, postgresql-developer-for-healthcare,
                                       nodejs-developer-for-healthcare, typescript-developer-for-healthcare
fullstack-developer-for-startups   -> typescript-developer-for-saas
technical-advisor-for-startups     -> technical-due-diligence-services
react-developer-for-saas           -> typescript-developer-for-saas
nodejs-developer-for-logistics     -> nodejs-developer-for-saas
ai-integration-developer-for-saas  -> python-developer-for-saas
```

Consumers (`getRelatedPages()` in `pages.ts`) filter undefined results, so users don't see 404s — but this means each failing page silently renders **fewer related services than designed**. The intended 4-link density drops to 2-3 on several flagship pages. Internal-linking-for-SEO benefit is diluted exactly on the highest-authority pSEO surface.

**Remediation:** Add a barrel-level assertion in `getRelatedPages()` dev mode, or a CI validator that cross-checks all `relatedServices[]` strings exist in `pseoPages`.

### C4. Migrations/Integrations/Comparisons breadcrumb schemas reference non-existent hub URLs

**Severity:** CRITICAL (schema validity). Example from `src/components/seo/migration-json-ld.tsx:142-144`:

```ts
{ name: "Migrations", item: `${SITE_URL}/services/migrations` },
```

But `src/app/services/migrations/page.tsx` **does not exist** (only `[slug]/page.tsx` exists). Same for `/services/integrations` and `/services/comparisons`. Google Structured Data Testing flags breadcrumb items that 404 as "Parsing error" / reduced rich-result eligibility.

The visible breadcrumb UI in `migration-page-content.tsx:133-136` links to `/services` (not the missing hub), so users aren't broken — but the JSON-LD lies about the site structure.

**Remediation:** (a) Either remove the intermediate "Migrations/Integrations/Comparisons" entries from breadcrumb JSON-LD, OR (b) create minimal hub pages at those routes. Option (a) is faster and doesn't compromise the noindex strategy.

### C5. Five pSEO service pages have no `<h1>` — h1/h2 inversion pattern

**Severity:** CRITICAL (SEO + a11y). On `/services/[slug]`, `/technologies/[slug]`, `/for/[role]`, `/services` and `/for` hub pages, the DOM is:

```jsx
<h1 className="text-cyber-lime font-mono text-xs tracking-wider uppercase">  // tiny eyebrow
  {techLabel} + {industryLabel}                                              // e.g. "Next.js + SaaS"
</h1>
<h2 className="text-4xl font-bold md:text-5xl lg:text-6xl">                  // the ACTUAL title
  {techLabel} Developer for {industryLabel}                                  // e.g. "Next.js Developer for SaaS"
</h2>
```

This is exactly the issue flagged in the 2026-04-05 Plan 4 audit (heading hierarchy on 7 pages). Googlebot uses the `<h1>` as the strongest on-page title signal; treating it as a category eyebrow rather than the target keyword phrase loses ranking strength on every indexed service + technology + role page.

Migration/Integration/Comparison pages get this **correct** — their `<m.h1>` is the real 4-6xl title (e.g., `migration-page-content.tsx:163-174`). Inconsistent standard between page templates.

**Remediation:** Swap semantic roles. Make the large title `<h1>`, demote the eyebrow to a `<p>` or `<span aria-hidden>`. Zero visual change, meaningful SEO gain.

---

## HIGH (9)

### H1. Quality gate enforcement is disconnected from build

`npm run build` does NOT call `validatePseoPage()` or `checkQualityGates()` against `pseoPages`. The schema exists, the validator exists, the tests call both — but the published data can drift below the gate (and has: see C1). Add a `prebuild` script or `scripts/validate-pseo.ts` that fails on any violation.

### H2. Two JSON-LD templates use wrong Schema.org type

- `technology-json-ld.tsx` uses `@type: "Service"` for pages about Next.js/React/Python. A tech landing page that describes a framework and when to use it should use `@type: "SoftwareApplication"` (or `TechArticle`) with Alex as `author`. Current `Service` type collapses "developer for hire" and "technology encyclopedia" into one entity, which dilutes topical relevance.
- Industry pSEO pages (`pages.ts`) correctly use `Service` for "X Developer for Y", but they lack any reference to `ConsultingService` (which the main site schema already defines). Add `isRelatedTo: { "@id": `${SITE_URL}#consulting-service` }` to link pSEO services to the parent ConsultingService entity.

### H3. Template-bound content homogeneity on bottom 5 pSEO pages

The first 14 pSEO pages (nextjs/react/python/nodejs/ai-integration for fintech/healthcare/saas/ecommerce/logistics) are genuinely distinct — different opening sentences, industry-specific regulations, unique case studies. The last 5 (postgresql-for-fintech, fractional-cto, tech-due-diligence, legacy-migration, perf-optimization) share a more generic voice:

- Shorter `whyThisStack` (all <155 words)
- Only 3 FAQs each (others have 4-6)
- No `expertApproach` block on any of the 5 (others have detailed real outcomes)
- Missing `industryRegulations` depth (1 vague regulation vs. 2-3 specific ones)
- `budgetGuidance.factors` shorter (3-4 items vs 5)

These pages read like "written when energy ran out." On a zero-backlink domain, Google's helpful-content filter flags precisely this pattern.

### H4. AI-slop red flag: `relatedProjectId` points to nothing on 13/19 pages

Only 4 pages populate `expertApproach` with a real `relatedProjectId` (e.g., `claude-pilot`, `photokeep`, `traceforge`). The schema has the field; the content doesn't use it. Missing opportunity to tie pSEO to actual case studies in `src/data/projects.ts`. Readers who want proof of claims find none.

### H5. FAQs sometimes generic / templatable

Spot-check across pages: the question "How long does it take to build a {industry} {tech} MVP?" appears with similar answer structures on nextjs-saas, react-fintech, nextjs-ecommerce. Answers differ in specifics (weeks, tools) but the scaffold is the same. Not ideal for SERP snippet differentiation; Google de-dupes "how long does X take" FAQ snippets if too similar.

### H6. Canonical handling correct but lacks cross-linking between pSEO verticals

All pSEO pages set `alternates.canonical` to their own URL (correct). But there is **no hreflang/alternate/relationship** between `/services/nextjs-developer-for-saas` and `/technologies/react-nextjs` (which both cover "Next.js development"). A user-intent-aware site would treat these as complementary surfaces; right now they compete. Consider adding `isPartOf` / `relatedLink` in schema, or visible "See Also" cross-links.

### H7. CTA casing contradiction (code-syntax) is universal across pSEO

All pSEO pages use `SCHEDULE_CONSULTATION()`, `START_CONVERSATION()`, `VIEW_SERVICE()` as CTAs. Prior CRO audit flagged "code-syntax CTAs" as hurting conversion (technical audience vs. buyer audience). This audit confirms the pattern exists uniformly across 44 pSEO pages, all 5 page templates. High blast-radius fix: single constant file. Recommend A/B testing "Schedule Consultation" vs `SCHEDULE_CONSULTATION()`.

### H8. Missing `datePublished` / `dateModified` in service JSON-LD

`service-json-ld.tsx` passes `dateModified: page.lastUpdated?.toISOString() ?? new Date().toISOString()` — which falls back to **build time** when `lastUpdated` is missing. Zero pages in `pages.ts` populate `lastUpdated`. Every deploy changes the apparent modified date for every pSEO page simultaneously. Google distrusts uniform-lastmod patterns (as noted in `sitemap.ts:23` comment). Either populate `lastUpdated` per page manually, or drop `dateModified` entirely and let crawlers infer from HTTP headers.

### H9. No `SoftwareApplication` / `HowTo` / `Article` schema variant per content type

Service pages get `Service + FAQPage + WebPage + BreadcrumbList`. Technology pages get `Service + ItemList(×2) + WebPage + BreadcrumbList`. Migration gets `Service + HowTo + FAQPage + WebPage + BreadcrumbList` (best of the templates). Integration & Comparison lack `HowTo` despite describing multi-step procedures. Comparison pages could legitimately emit `Review` or `ItemList` of alternatives. Opportunity to distinguish SERP presentation.

---

## MEDIUM (8)

### M1. Bundle size: prior pSEO chunk split was applied but scope is partial

Per `MEMORY.md` Plan 4, a fix was designed to split the pSEO chunk. The 12,563 LOC of pSEO data (`pages.ts` 216k, `migrations.ts` 119k, `integrations.ts` 89k, `comparisons.ts` 83k, `industries.ts` 74k) still imports monolithically through `src/data/pseo/index.ts`. Any component that imports one thing from `@/data/pseo` pulls the barrel. `service-json-ld.tsx` imports `{INDUSTRY_LABELS, TECHNOLOGY_LABELS}` only — but the webpack chunk resolution for that module depends on whether Next tree-shakes through the barrel. Verify actual chunk output in `.next/analyze/`.

### M2. Industries file orphaned

`src/data/pseo/industries.ts` (1,985 LOC, rich regulatory + pain-point data per industry) has NO route. There is no `/industries/[slug]` page. The `INDUSTRY_LABELS` constant is used; the rich `industries` record is only consumed via `getIndustryData()` helper — zero call sites outside tests. This is 74KB of authored content doing no SEO work. Could ship 10 industry landing pages (`/industries/fintech`, `/industries/healthcare`...) at minimal cost. Or delete the unused data.

### M3. Comparison pages noindex even though content is strong

Comparison pages (~5 total, 294 LOC per page in data, 5 uniqueInsights + 4-5 FAQs + full `whenToChooseA/B` analysis + `expertVerdict`) carry **better content density than the 5 failing service pages (C1)**. Strategy pre-commits them to noindex for authority reasons. If/when DR >20, these could be the easiest win for indexing — they target commercial-intent keywords ("postgresql vs mongodb for fintech"). Worth a re-evaluation threshold.

### M4. Comparison tables are substantive (not slop) but criteria scoring is opaque

`ComparisonCriterion` schema asks for `optionAScore` and `optionBScore` (1-10). Spot-check: scores are plausible but the `analysis` string explains the scoring qualitatively. No `source` field populated on most criteria despite the schema having one. Without cited sources, comparison pages risk being flagged as AI-generated opinion (Googlebot increasingly weights citations). Add benchmark URLs to `source`.

### M5. `caseStudySnippet` optional field underused

Schema supports `caseStudySnippet?: CaseStudy` with `clientName`, `challenge`, `solution`, `results`, `techUsed`. Spot-check: **0 pSEO pages populate `caseStudySnippet`**. Social proof is the most powerful CTA booster; the schema is ready, the data is missing. Projects like PhotoKeep/TraceForge/Claude Pilot have case study material elsewhere (`src/data/projects.ts`). Zero reuse.

### M6. `dynamicParams = false` on all templates — correct but no 410 Gone handling

`export const dynamicParams = false` on `/services/[slug]`, etc., returns 404 for unknown slugs. If a page is removed from `pseoPages` (which should be rare, but happens), old URLs return 404. Google keeps attempting indexing of 404s for 6-12 months. Better: emit `410 Gone` for known-removed slugs. Not urgent, but add to the removal checklist.

### M7. SEO description length violation on 2 migration pages

`angularjs-to-nextjs-migration` (180 chars) and `monolith-to-microservices-migration` (175 chars) exceed the 170-char limit from `SEO_DESCRIPTION_MAX` in validation. Build doesn't fail because `validatePseoPage` isn't run at build. Google truncates to ~155-160 chars in SERPs, so the last 15-20 chars are wasted.

### M8. Sitemap priority values hardcoded, no decay

All pSEO pages get `priority: 0.85-0.9` uniformly. Google documented years ago that `priority` is a weak signal, but flat priorities across 44 pages tell Google "treat them all equally." Consider a priority decay based on pSEO quality (e.g., pages with `expertApproach` + `caseStudySnippet` → 0.9; generic → 0.7).

---

## LOW (6)

### L1. `PseoPageSummary` type unused

Defined in `types.ts:494-502`, consumed in zero files. Dead type. Delete.

### L2. `parseSlug()` function buggy for TypeScript slugs

`parseSlug("typescript-saas")` returns `{ technology: "typescript", industry: "saas" }` — correct. But `parseSlug("typescript-developer-for-saas")` returns `null` because `industry = "developer-for-saas"` is not in `INDUSTRY_LABELS`. Function works for legacy slug format `{tech}-{industry}` but all current page slugs use `{tech}-developer-for-{industry}`. Effectively dead code; verify no production callsite.

### L3. `generateSlug()` inconsistent with actual slugs

`generateSlug("nextjs", "saas")` → `"nextjs-saas"`, but actual pSEO slug is `"nextjs-developer-for-saas"`. Another function that no longer matches the data shape.

### L4. `published: false` pages would still be in `generateStaticParams`

`getPublishedPages()` is used correctly by `generateStaticParams()` in `services/[slug]/page.tsx:30`. But `migrations/[slug]/page.tsx:27` uses `getAllMigrationSlugs()` without filtering by `published`. If a draft migration gets added, it ships. Minor: all current pages are `published: true`.

### L5. Twitter handle hardcoded across all templates

`@alexmayhewdev` literal in 6 JSON-LD + Metadata files. Should be a single constant (it already is: `TWITTER_HANDLE` in `schema-utils.tsx` — but pSEO page.tsx files don't use it). DRY violation.

### L6. `siteUrl` hardcoded in every `page.tsx`

Each `page.tsx` has `const siteUrl = "https://alexmayhew.dev";` inline. `SITE_URL` already exists in `schema-utils.tsx`. Extract to a shared constant module.

---

## Template-Level Quality Scores (1-10)

| Template                        | Count  | Indexed | Schema                                                                         | Content density                                                               | H-hierarchy  | CTAs        | Uniqueness              | Score   |
| ------------------------------- | ------ | ------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------ | ----------- | ----------------------- | ------- |
| `/services/[slug]` (top 14)     | 14     | Yes     | Strong (4 schemas)                                                             | High (200+ words/section, expertApproach, 5 insights, 4-5 FAQs)               | **Inverted** | Code-syntax | High                    | **7.5** |
| `/services/[slug]` (bottom 5)   | 5      | Yes     | Strong                                                                         | **Fails gates** (100-150 words, 3 FAQs, no expertApproach)                    | Inverted     | Code-syntax | Medium                  | **4.0** |
| `/services/migrations/[slug]`   | 7      | No      | Very strong (HowTo + Service + FAQ)                                            | Very high (6-7 insights, 5-6 FAQs, risk dashboard, patterns)                  | Correct      | Code-syntax | High                    | **8.5** |
| `/services/integrations/[slug]` | 5      | No      | Strong (Service + FAQ)                                                         | Very high (6-7 insights, 5-6 FAQs, 3 integration patterns with architectures) | Correct      | Code-syntax | High                    | **8.0** |
| `/services/comparisons/[slug]`  | 5      | No      | Strong                                                                         | High (5 insights, 4-5 FAQs, decision matrix, scored criteria)                 | Correct      | Code-syntax | High                    | **7.5** |
| `/technologies/[slug]`          | 8      | Yes     | **Wrong @type** (Service, should be SoftwareApplication); 2 ItemList + WebPage | High (7 when-to-use, 7 pitfalls, 7 best practices, realWorldExample)          | **Inverted** | Code-syntax | Medium (cross-industry) | **6.5** |
| `/for/[role]`                   | varies | Yes     | Service + OfferCatalog + Audience                                              | N/A (separate data system)                                                    | **Inverted** | Code-syntax | Not audited (roles/)    | **6.0** |

**Average quality across all pSEO: 6.9/10.** Drags are the 5 failing service pages and h1/h2 inversion. Migrations are the strongest template.

---

## Page-Level Findings: Indexed pSEO Service Pages

| Slug                                    | Insights | FAQs  | whyThisStack words | projectApproach words | expertApproach     | Orphan related | Score   |
| --------------------------------------- | -------- | ----- | ------------------ | --------------------- | ------------------ | -------------- | ------- |
| nextjs-developer-for-saas               | 5        | 4     | 187                | 211                   | Yes (claude-pilot) | 2              | 8.0     |
| react-developer-for-fintech             | 5        | 4     | 200                | 255                   | —                  | 2              | 7.5     |
| python-developer-for-healthcare         | 5        | 4     | 193                | 258                   | —                  | 4              | 7.0     |
| fullstack-developer-for-startups        | 5        | 4     | 203                | 204                   | —                  | 1              | 7.5     |
| technical-advisor-for-startups          | 5        | 4     | 185                | 176                   | —                  | 1              | 7.0     |
| nextjs-developer-for-fintech            | 5        | 4     | 208                | 224                   | —                  | 0              | 8.0     |
| nextjs-developer-for-healthcare         | 5        | 4     | 202                | 226                   | —                  | 0              | 8.0     |
| nextjs-developer-for-ecommerce          | 5        | 4     | 217                | 226                   | —                  | 0              | 8.0     |
| react-developer-for-saas                | 5        | 4     | 215                | 247                   | —                  | 1              | 7.5     |
| react-developer-for-healthcare          | 5        | 4     | 195                | 225                   | —                  | 0              | 8.0     |
| nodejs-developer-for-logistics          | 5        | 4     | 210                | 237                   | —                  | 1              | 7.5     |
| python-developer-for-fintech            | 5        | 4     | 207                | 217                   | —                  | 0              | 8.0     |
| ai-integration-developer-for-saas       | 5        | 4     | 206                | 237                   | —                  | 1              | 7.5     |
| ai-integration-developer-for-healthcare | 5        | 4     | 205                | 201                   | —                  | 0              | 8.0     |
| **postgresql-developer-for-fintech**    | 5        | **3** | 152                | **136**               | —                  | 0              | **5.5** |
| **fractional-cto-for-startups**         | 5        | **3** | **123**            | **109**               | —                  | 0              | **4.5** |
| **technical-due-diligence-consultant**  | 5        | **3** | **103**            | **94**                | —                  | 0              | **4.0** |
| **legacy-migration-architect**          | 5        | **3** | **121**            | **107**               | —                  | 0              | **4.5** |
| **performance-optimization-consultant** | 5        | **3** | **119**            | **118**               | —                  | 0              | **4.5** |

---

## Recommended Remediation Order

1. **Fix C2** (topic cluster slugs) — 5-minute text edit, restores cross-linking on 14+ pages.
2. **Fix C3** (orphan relatedServices) — remove or create the missing pages; add CI validator.
3. **Fix C4** (breadcrumb JSON-LD phantom hubs) — trim the invalid entries.
4. **Fix C5** (h1/h2 inversion) — 5-template edit, biggest ranking-per-keystroke win.
5. **Fix C1** (5 failing quality gates) — either expand content, noindex them, or both.
6. **Fix H1** (hook validation into build) — prevent regression of C1.
7. **Fix H2** (SoftwareApplication type for technologies).
8. **Fix H7** (CTA A/B test) — measure, don't guess.
9. **Fix M2** (either ship `/industries/[slug]` or delete orphaned industries data).
10. Everything else is low-urgency polish.

---

## Sources & Cross-Refs

- `MEMORY.md`: 15-agent audit, Plan 4 (Engineering) called out pSEO chunk split; none of it addresses content quality.
- `MEMORY.md`: Plan 3 (CRO & Content) noted code-syntax CTAs as a CRO concern.
- `.claude/rules/pseo.md`: quality gates declared non-negotiable but not enforced by build.
- Commit `c86c947` (2026-04-05): sitemap pruned 152→126, template pages noindexed — this audit verifies the noindex strategy is consistent across migrations/integrations/comparisons and that canonicals match URLs.
- Google indexing context: zero external backlinks + 5 indexed pSEO pages that fail their own quality gates = high "scaled content abuse" risk flag.
