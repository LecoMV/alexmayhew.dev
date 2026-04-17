# Schema Markup & Structured Data SEO Research (2026-03-14)

**Status:** CURRENT
**Session:** Audit of existing schema implementation on alexmayhew.dev — FAQ, HowTo, Article, Person, AEO/GEO, Service types, Breadcrumb, SearchAction, ImageObject

---

## Key Findings

### 1. FAQ Schema (FAQPage)

- **Google traditional search:** Rich results restricted to government and health sites only (since Aug 2023, unchanged in 2026)
- **For everyone else:** FAQ schema NO LONGER generates visual rich results in Google SERPs
- **But for AI citation (AEO/GEO): high value remains.** FAQ structured data has one of the highest AI citation rates. Properly implemented FAQPage schema pushes AI citation rates to ~41% vs 15% without it
- **Verdict for alexmayhew.dev:** Keep FAQPage schema. It does nothing for traditional SERP rich results but meaningfully helps Perplexity, ChatGPT, and Google AI Overviews cite the content

### 2. HowTo Schema

- **Completely deprecated from Google rich results** as of September 2023 (desktop + mobile). No rich results shown for ANY site type — not even government sites
- **HowToJsonLd is currently unused** on the site — correct decision, do not implement
- **AI citation:** The schema.org HowTo type is still crawled/parsed by AI systems. If you have step-by-step procedural content, structured markup may marginally help AI citation even without rich results
- **Verdict:** Leave HowToJsonLd unused. Do not add to blog posts. If a post is genuinely procedural, consider FAQ schema instead (question-format headers convert better for AI)

### 3. Article vs TechArticle

- Google's Article schema documentation supports: `Article`, `NewsArticle`, `BlogPosting`, `TechArticle`
- **Google treats them functionally identically** for rich result eligibility — no documented differentiation in ranking/visibility
- **TechArticle signals topical specificity** to AI systems and crawlers. Schema.org definition: "how-to, step-by-step, procedural troubleshooting, specifications." Matches the content profile of alexmayhew.dev exactly
- **Required properties Google enforces** (regardless of type): `headline`, `image`, `author`, `datePublished`, `dateModified`
- **Verdict:** For technical deep-dives (architecture guides, engineering playbooks), switch from `Article` to `TechArticle`. For business/leadership content, use `BlogPosting`. The change is low-risk and adds semantic precision for AI parsers

### 4. Person Schema — @id Entity Consolidation

**This is the most impactful structural improvement available.**

- **Correct pattern:** Define the Person entity ONCE on a canonical page (e.g., `/about`) with full properties + unique `@id` URI (e.g., `https://alexmayhew.dev/#person`)
- **On article pages:** Reference the `@id` only as `author: { "@id": "https://alexmayhew.dev/#person" }` — do NOT repeat full Person properties on every article
- **On root layout/WebSite schema:** Reference `author` or `publisher` with the same `@id`
- **On LocalBusiness/ProfessionalService:** Reference with `founder` or `employee` + `@id`
- **Why this matters:** Creates a unified entity node in Google's Knowledge Graph. All pages reinforce the same entity rather than creating disconnected duplicate nodes. Reduces entity disambiguation errors
- **@id URI must be stable forever.** Changing it breaks all cross-page entity references
- **sameAs links** are essential: LinkedIn, GitHub, Twitter/X, Crunchbase, any publications. Each sameAs reference strengthens the entity confidence score with Google and AI systems

### 5. AEO / GEO — AI Citation Optimization

**The schema types that matter most for AI citation (Perplexity, ChatGPT, Gemini):**

Priority order by impact:

1. **FAQPage** — highest AI citation rate (~41% with vs ~15% without)
2. **HowTo** (schema.org type, not rich result) — AI systems parse step arrays
3. **Article/TechArticle** with `headline`, `author`, `dateModified` — freshness signals
4. **Person with sameAs** — entity consolidation in knowledge graph
5. **Organization/WebSite** with `name`, `description`, `url` — brand entity grounding

Platform preferences:

- **ChatGPT:** Favors comparison tables, encyclopedic structure (Wikipedia-adjacent)
- **Perplexity:** Prefers bullet lists, direct answers in first 40-60 words, Reddit-cited content
- **Google AI Overviews:** Favors YouTube + multi-modal, question-format headers, FAQPage

**llms.txt** is complementary to schema, not a replacement. Schema works on every crawl; llms.txt is read by fewer systems currently.

**Beyond schema for AEO:** Direct answers in the first sentence, question-format `<h2>`/`<h3>` headers, explicit entity naming (not "I think" but "Alex Mayhew, independent technical advisor..."), and providing answers in multiple formats on the same page.

### 6. Service Schema — ProfessionalService vs ConsultingService

- **Schema.org hierarchy:** `LocalBusiness > ProfessionalService > ConsultingService`
- **ConsultingService** is a valid subtype of ProfessionalService and is MORE specific
- **Google does not differentiate** `ProfessionalService` vs `ConsultingService` for any specific rich result — both are treated as LocalBusiness subtypes
- **AI systems benefit from specificity** — `ConsultingService` narrows the entity type and reduces disambiguation
- **LocalBusiness vs Organization:** Use BOTH as co-types (JSON-LD allows `"@type": ["Organization", "LocalBusiness"]`) if you have a service area. Use Organization alone if purely online/national
- **Critical properties for consulting:** `areaServed`, `serviceType`, `priceRange`, `knowsAbout`, `hasOfferCatalog`, `sameAs` (LinkedIn, Clutch, etc.)
- **Verdict:** Switch from `ProfessionalService` to `ConsultingService`. Add `knowsAbout` array listing core technical domains. Add `areaServed` if targeting any geographic market

### 7. BreadcrumbList — Scope

- **Google removed breadcrumbs from mobile SERPs** in January 2025. They still appear on desktop
- **Only implement where hierarchy exists:** Blog posts (`/blog/{slug}`), case studies (`/case-studies/{slug}`), nested pages. NOT on the homepage or single-depth pages
- **Schema must exactly match visible breadcrumb nav** — discrepancy = potential manual action
- **Minimum 2 ListItems** required for valid BreadcrumbList
- **Verdict for alexmayhew.dev:** Blog posts and case studies only. Homepage and top-level service pages do not need BreadcrumbList

### 8. SearchAction / Sitelinks Searchbox

- **Fully deprecated and removed.** Google retired Sitelinks Search Box globally on November 21, 2024
- **Starting January 2026:** Also removed from Search Console rich result reporting, Rich Result Test, and appearance filters
- **Action required:** Remove `SearchAction`/`potentialAction` from WebSite schema. Leaving it in place does NOT cause errors or ranking penalty, but it is dead markup serving no purpose
- **Verdict:** Remove from root layout WebSite schema. Clean code has no orphaned markup

### 9. ImageObject for Blog Featured Images

- **Low-to-medium priority**, but valid
- When `Article`/`TechArticle` schema includes `image` property pointing to an `ImageObject`, it gives Google more metadata for image indexing (width, height, caption, license)
- Minimum for Article rich results: `image` must be present and meet size requirements (minimum 1200x630px recommended)
- Separate standalone `ImageObject` JSON-LD blocks are low value — the image data is better embedded within the Article schema's `image` property
- **Verdict:** Ensure `image` property in ArticleJsonLd is a full `ImageObject` with `url`, `width`, `height`. Do NOT add separate standalone ImageObject scripts per post

### 10. SpeakableSpecification

- **Still in BETA at Google as of 2026** — no graduation to stable
- Restricted to: news publishers, English language, US users with Google Home
- alexmayhew.dev is not a news publisher
- No evidence Google extends this beyond news in 2026
- **Verdict:** Do not implement. Zero benefit for this site type

---

## Deprecated Schema Types (January 2026)

Google removed rich result support and Search Console reporting for:

- Practice Problem
- Dataset (moved to Dataset Search only)
- Sitelinks Search Box (removed Nov 2024, SC reporting removed Jan 2026)
- SpecialAnnouncement
- Q&A Page
- Practice Problem
- Nutrition Facts (feature panel)
- Nearby Offers

**Still fully supported:** Product, Article, Organization, Person, Review, Event, Job Posting, LocalBusiness, BreadcrumbList, FAQPage (AI value only for non-gov), HowTo (AI value only, no rich results), Recipe, Video, Course

---

## Recommended Changes for alexmayhew.dev

### High Priority

1. **Remove SearchAction** from WebSite schema (dead markup post-deprecation)
2. **Consolidate Person @id** — define once on `/about` page, reference by `@id` everywhere else
3. **Switch service type** from `ProfessionalService` to `ConsultingService`
4. **Add `knowsAbout` array** to service schema with technical domains

### Medium Priority

5. **TechArticle** for technical posts — replace `Article` type on engineering/architecture posts
6. **Ensure Article `image` property** is a full ImageObject with dimensions (required for rich results)
7. **Scope BreadcrumbList** to only blog posts and case studies

### Low Priority / Skip

8. **Keep FAQPage schema** on any page with Q&A sections — value is AEO/GEO, not traditional rich results
9. **Do not implement HowToJsonLd** (deprecated rich result, marginal AI value)
10. **Do not implement SpeakableSpecification** (beta, news-only)

---

## Sources

- [Changes to HowTo and FAQ rich results — Google Search Central Blog](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [FAQPage Structured Data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Farewell, Sitelinks Search Box — Google Search Central Blog](https://developers.google.com/search/blog/2024/10/sitelinks-search-box)
- [Article Schema — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Speakable BETA — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/speakable)
- [Are FAQ Schemas Important for AI Search, GEO & AEO? — Frase.io](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)
- [Using @id in Schema.org Markup for SEO, LLMs & Knowledge Graphs — Momentic](https://momenticmarketing.com/blog/id-schema-for-seo-llms-knowledge-graphs)
- [Google Is Not Diminishing The Use Of Structured Data In 2026 — SEJ](https://www.searchenginejournal.com/google-is-not-diminishing-the-use-of-structured-data-in-2026/560516/)
- [ProfessionalService — Schema.org](https://schema.org/ProfessionalService)
- [BreadcrumbList — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google Deprecates Sitelinks Search Box — Schema App](https://www.schemaapp.com/schema-markup/google-deprecates-sitelinks-search-box-what-it-means-for-your-website/)
- [Entity SEO & Schema Markup: Build Your Knowledge Graph Presence — Schema Validator](https://schemavalidator.org/guides/entity-seo-schema-markup)
