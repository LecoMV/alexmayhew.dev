# Schema Audit — AEO / AI Citation Readiness (2026-04-19)

**Status:** CURRENT
**Session:** AEO-focused schema audit for AI citation (ChatGPT, Claude.ai, Perplexity, Google AI Overviews)
**Scope:** All 17 `*-json-ld.tsx` components in `src/components/seo/`, glossary, about, blog, and pSEO pages
**Prior audit:** `docs/research/agent-research/audit-2026-04-16-schema.md` (structural baseline)

---

## Executive Summary

The entity graph is **structurally sound**. The 2026-03-30 and 2026-04-16 sprints consolidated Person / Organization / WebSite / ConsultingService into canonical `@id` nodes and eliminated inline duplicates. What remains are **AEO enhancement gaps** — high-signal fields that move the needle for AI citation but have no direct Google rich-result gate.

**Top structural wins already in place**

- Exactly one canonical `Person` entity at `https://alexmayhew.dev/#person` (json-ld.tsx:18). No inline stray Person objects outside json-ld.tsx. Verified via `grep "@type":\s*"Person"` — only 1 match.
- Exactly one canonical `Organization` entity at `https://alexmayhew.dev/#organization`. Verified via grep — only 1 match.
- Exactly one canonical `WebSite` entity at `https://alexmayhew.dev/#website`, with `SearchAction` hooked up.
- Exactly one canonical `ConsultingService` entity at `https://alexmayhew.dev/#business` with `hasOfferCatalog` and `priceSpecification` on each offer.
- `PERSON_REF` / `ORG_REF` helpers used consistently across `article-json-ld.tsx`, `case-study-json-ld.tsx`, `service-json-ld.tsx`, `migration-json-ld.tsx`, `integration-json-ld.tsx`, `comparison-json-ld.tsx`, `role-json-ld.tsx`, `technology-json-ld.tsx`, `contact-json-ld.tsx`, `software-json-ld.tsx`.
- `ProfilePage` schema present on `/about`, `CollectionPage` on `/blog`, `ContactPage` on `/contact`, `DefinedTermSet` + `DefinedTerm` on `/glossary`.
- `TechArticle` vs `BlogPosting` switch driven by `isHub` frontmatter (article-json-ld.tsx:36).
- FAQ coverage is broad — **70 posts** have Q/A pairs in `hub-faqs.ts` (well beyond the prior "14 of 65" baseline).
- `inLanguage: "en-US"` present on Article, TechArticle (case study), and WebPage schemas.

---

## Findings by Severity

### CRITICAL — 0 findings

No entity-graph fragmentation. No duplicate canonical `@id` nodes. No stray inline Person / Organization bodies.

---

### HIGH — 5 findings

#### H1. Article `publisher` is required to have a `logo.ImageObject` — currently a bare `@id` reference

**File:** `src/components/seo/article-json-ld.tsx:48`
**Current:**

```ts
publisher: { "@id": "https://alexmayhew.dev/#organization" },
```

**Why it matters:** Google's Article rich-result documentation requires `publisher` to resolve to an Organization with a `logo` that is an `ImageObject` of minimum 600×60 for AMP or 112×112 for non-AMP. Bare `@id` resolves at the graph level but the global Organization at json-ld.tsx:88 uses a 1200×630 OG image as the logo — which is **not a logo**, it is a hero image. Google may silently drop the Article card.

**Fix:** In `src/components/seo/json-ld.tsx:88-97`, replace `logo.url` with a genuine square/wordmark image (create `public/logo.png` at ≥512×512 with transparent or neutral background). Emit `width` / `height` that match the actual file.

```ts
logo: {
  "@type": "ImageObject",
  url: "https://alexmayhew.dev/logo.png",
  width: 512,
  height: 512,
},
```

**Severity:** HIGH. Blocks Article rich-result eligibility graph-wide.
**Effort:** 30 min (create image asset + update schema).

---

#### H2. `ConsultingService.logo` points to `favicon.svg` — fails Google logo spec

**File:** `src/components/seo/json-ld.tsx:150`
**Current:** `logo: "https://alexmayhew.dev/favicon.svg",`

**Why it matters:** Google's Organization / LocalBusiness logo spec requires a raster PNG/JPG at documented dimensions; SVG is not supported. The favicon is also not a logo — it's an icon. This was flagged in the user's prompt as "fake-favicon URL." The same replacement in H1 resolves this.

**Fix:** Use the same `ImageObject` from H1 (point both `Organization.logo` and `ConsultingService.logo` at `logo.png`).

**Severity:** HIGH. Same AI / crawler signal degradation as H1.
**Effort:** 5 min (reuse asset from H1).

---

#### H3. `sameAs` on the Person entity is missing Dev.to, Mastodon, and email

**File:** `src/components/seo/json-ld.tsx:7-12`
**Current:**

```ts
const SOCIAL_PROFILES = [
	"https://github.com/LecoMV",
	"https://www.linkedin.com/in/alexmmayhew",
	"https://x.com/alexmayhewdev",
	"https://bsky.app/profile/alexmayhewdev.bsky.social",
];
```

**Why it matters:** `sameAs` is the single most important signal for cross-platform entity identity for LLM retrieval. The user is active on Dev.to (per marketing plan — bi-weekly cross-posts) and the site emits email (`alex@alexmayhew.dev`) elsewhere. Each additional `sameAs` link reinforces entity confidence in Knowledge Graph. Perplexity in particular scores entities partly on sameAs breadth.

**Fix:** Add to `SOCIAL_PROFILES`:

```ts
"https://dev.to/alexmayhew",          // verify handle
"mailto:alex@alexmayhew.dev",
// Optional but valuable:
"https://news.ycombinator.com/user?id=<handle>",
"https://stackoverflow.com/users/<id>",
```

Verify handles exist before committing (404 sameAs links degrade the signal).

**Severity:** HIGH. Under-utilized high-leverage AEO signal.
**Effort:** 15 min (verify handles + add).

---

#### H4. `ArticleJsonLd` does not accept or emit `wordCount`, despite the prop being defined

**File:** `src/components/seo/article-json-ld.tsx:14-15, 59` — prop exists and is conditionally emitted.
**Call site:** `src/app/blog/[slug]/page.tsx:135-146` — does NOT pass `wordCount`.
**Schema source:** `source.config.ts:13-29` — `readingTime` is a string, no `wordCount` in frontmatter.

**Why it matters:** `wordCount` is the single most reliable depth signal for AI retrievers ranking "thorough answer" vs "link bait." At 2,000–5,000 words, the site's posts genuinely are depth leaders — but the schema does not advertise this. Without `wordCount`, AI crawlers must infer from rendered HTML, which is noisier and more expensive.

**Fix:** Compute `wordCount` at build time in the route component. Strategy:

1. Add a `wordCount` field in the Zod schema transform (via MDX plain-text extraction using `remark-gfm` + a stripper), OR
2. Simplest: use `readingTime` minutes × 225 wpm as a rough estimate until a real word count is available.

Option 2 inline:

```ts
// src/app/blog/[slug]/page.tsx
const minutes = parseReadingMinutes(post.readingTime);
const estimatedWordCount = minutes ? minutes * 225 : undefined;

<ArticleJsonLd
  ...
  readingTime={minutes}
  wordCount={estimatedWordCount}
/>
```

**Severity:** HIGH. Zero-cost depth signal currently wasted.
**Effort:** 30 min (add compute + 74 posts inherit it automatically).

---

#### H5. `Person` is missing `hasOccupation`, `alumniOf`, `worksFor` relationship is thin

**File:** `src/components/seo/json-ld.tsx:24, 27-43`
**Current state:** Has `jobTitle` (string), `worksFor: { "@id": ... }` (ref), `hasCredential` (array of 2). Missing `hasOccupation` (the modern schema.org relationship for professional identity), `alumniOf` (educational history), `alternateName` (name variants: "Alex M. Mayhew," "Alexander Mayhew" if applicable).

**Why it matters:**

- `hasOccupation` supersedes bare `jobTitle` for E-E-A-T signals. Google specifically documents `Person.hasOccupation` as a knowledge-graph enrichment property. LLMs parse it for "who is this person" attribution.
- `alumniOf` (even if omitted from the site's visible copy) establishes credential provenance. Citation-ready AI prefers people whose background they can verify.
- `alternateName` handles queries for name variants ("Alex Mayhew" vs "Alexander Mayhew"). Low effort, reduces disambiguation.

**Fix:** Add to personSchema in `json-ld.tsx`:

```ts
alternateName: ["Alexander Mayhew"],  // only if true
hasOccupation: {
  "@type": "Occupation",
  name: "Technical Advisor & Systems Architect",
  occupationalCategory: "15-1252",  // BLS SOC code for Software Developers
  skills: [
    "System Architecture",
    "Performance Engineering",
    "SaaS Development",
    "Technical Due Diligence",
  ],
  responsibilities: "Architecture advisory, technical due diligence, strategic implementation for founders and CTOs in SaaS, fintech, healthcare, and B2B.",
},
// If/when disclosable:
// alumniOf: { "@type": "CollegeOrUniversity", name: "...", sameAs: "https://..." },
```

**Severity:** HIGH. Directly improves E-E-A-T for AI citation.
**Effort:** 30 min (only fields Alex can factually attest to — skip `alumniOf` if not public).

---

### MEDIUM — 8 findings

#### M1. `Article` and `TechArticle` have no `about` / `mentions` / `citation` arrays

**File:** `src/components/seo/article-json-ld.tsx:34-66`
**Current:** No `about`, `mentions`, or `citation`.

**Why it matters:** Per user's prompt (#5, bullets on `mentions` / `citation`): when a post references external things (products, concepts, studies), linking them via `mentions: [{"@type": "Thing", name, sameAs}]` is a first-class AEO signal. Perplexity's retrieval scoring explicitly rewards documents that link to authoritative sources. The METR Paradox post is a prime example — it references a METR study but emits no `citation`.

**Fix (progressive rollout):** Add an optional `mentions` / `citation` prop to `ArticleJsonLd` and a frontmatter field:

```yaml
# MDX frontmatter
mentions:
  - name: "METR"
    sameAs: "https://metr.org"
    type: "Organization"
citations:
  - name: "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity"
    url: "https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study.pdf"
    type: "ScholarlyArticle"
```

Then in article-json-ld.tsx:

```ts
...(mentions?.length && { mentions: mentions.map(m => ({ "@type": m.type ?? "Thing", name: m.name, sameAs: m.sameAs })) }),
...(citations?.length && { citation: citations.map(c => ({ "@type": c.type ?? "CreativeWork", name: c.name, url: c.url })) }),
```

Retrofit only on hub posts (5 posts) first. Roll out to spokes opportunistically.

**Severity:** MEDIUM. High ceiling, gradual effort.
**Effort:** 2 hrs initial (schema + 5 hub posts); 5 min per post thereafter.

---

#### M2. `Article.about` is missing entirely — articles don't declare their subject entity

**File:** `src/components/seo/article-json-ld.tsx`

**Why it matters:** `Article.about` (distinct from `mentions`) declares the primary entity the article is about. For the SaaS Architecture hub post, `about` should reference a `Thing` (or better, a `DefinedTerm` from the glossary when applicable). This links articles to glossary entries bidirectionally in the graph.

**Fix:** Add optional `about` prop:

```ts
...(aboutEntity && { about: aboutEntity }),
```

For posts that cite a glossary term (e.g., "cognitive-debt-ai-teams" cites Cognitive Debt):

```ts
about: { "@id": "https://alexmayhew.dev/glossary#cognitive-debt" },
```

**Severity:** MEDIUM. Links post → glossary → knowledge graph.
**Effort:** 1 hr (wire it, add to 10 glossary-citing posts).

---

#### M3. Glossary `DefinedTerm` entries don't link back to the blog posts that cite them

**File:** `src/app/glossary/page.tsx:40-60`
**Current:** Emits `hasDefinedTerm` array but each `DefinedTerm` lacks a link to the posts that cite it.

**Why it matters:** `DefinedTerm` supports `subjectOf` (inverse of `about`) — the CreativeWorks that discuss this term. Bidirectional linking is high-value for AI because it lets the retriever find "the canonical definition" and "where it's used" in one graph hop.

**Fix:** Enrich each DefinedTerm:

```ts
hasDefinedTerm: entries.map((entry) => ({
  "@type": "DefinedTerm",
  "@id": `${SITE_URL}/glossary#${entry.slug}`,
  name: entry.term,
  termCode: entry.slug,
  description: entry.fullDefinition,
  inDefinedTermSet: `${SITE_URL}/glossary`,
  url: `${SITE_URL}/glossary#${entry.slug}`,
  subjectOf: entry.citedInPosts.map((slug) => ({
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${slug}`,
    url: `${SITE_URL}/blog/${slug}`,
  })),
})),
```

**Severity:** MEDIUM. High AEO value; the glossary is the site's strongest citation-attractor.
**Effort:** 15 min.

---

#### M4. `DefinedTermSet` is missing `creator` / `publisher`

**File:** `src/app/glossary/page.tsx:42-58`

**Why it matters:** Without `creator: PERSON_REF` and `publisher: ORG_REF`, the DefinedTermSet floats free of the author identity. LLMs citing a glossary term lose the "Alex Mayhew defined this" attribution.

**Fix:**

```ts
const schema = {
  "@context": SCHEMA_CONTEXT,
  "@type": "DefinedTermSet",
  "@id": `${SITE_URL}/glossary`,
  name: "Alex Mayhew Engineering Glossary",
  description: "...",
  url: `${SITE_URL}/glossary`,
  creator: { "@id": `${SITE_URL}/#person` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-US",
  hasDefinedTerm: [...],
};
```

**Severity:** MEDIUM. Entity attribution.
**Effort:** 5 min.

---

#### M5. `ComparisonJsonLd` and `SoftwareJsonLd` are not exported from `src/components/seo/index.ts`

**File:** `src/components/seo/index.ts`

**Why it matters:** Both components exist and are used (ComparisonJsonLd in `src/app/services/comparisons/[slug]/page.tsx`, SoftwareJsonLd in `src/app/tools/*`) but are imported via deep paths rather than the barrel. Inconsistent pattern; refactor risk.

**Fix:** Add:

```ts
export { ComparisonJsonLd } from "./comparison-json-ld";
export { SoftwareJsonLd } from "./software-json-ld";
```

**Severity:** MEDIUM (code hygiene, not AEO).
**Effort:** 5 min.

---

#### M6. `LocalBusinessJsonLd` stub still exists but is deprecated

**File:** `src/components/seo/local-business-json-ld.tsx`

**Why it matters:** The file is a no-op (returns null) and its own comment says "remove the import from src/app/layout.tsx and delete this file." Dead code that future agents may re-wire by mistake.

**Fix:** Grep for the import in `src/app/layout.tsx`, remove both, delete the file, drop the export from `index.ts`.

**Severity:** MEDIUM (hygiene).
**Effort:** 10 min.

---

#### M7. `BreadcrumbJsonLd` not present on pSEO `services` / `technologies` / `tools` INDEX pages

**File:** (verify) `src/app/services/page.tsx`, `src/app/technologies/page.tsx`, `src/app/tools/page.tsx`

**Why it matters:** Google docs say BreadcrumbList helps even on 2-level-deep pages (Home > Services). Leaf pages have breadcrumbs (verified in service/migration/integration/comparison/role JSON-LD) but landing pages often don't.

**Fix:** Audit each landing page. If missing, add `<BreadcrumbJsonLd items={[{name: "Home", url: "/"}, {name: "Services", url: "/services"}]} />`.

**Severity:** MEDIUM.
**Effort:** 30 min (audit + add 3–5 breadcrumbs).

---

#### M8. `inLanguage: "en-US"` missing on non-Article schemas (ConsultingService, Service, ProfilePage, CollectionPage, DefinedTermSet)

**File:** `src/components/seo/json-ld.tsx`, `src/components/seo/service-json-ld.tsx`, `src/components/seo/role-json-ld.tsx`, `src/app/about/page.tsx`, `src/app/blog/page.tsx`, `src/app/glossary/page.tsx`

**Why it matters:** Multilingual retrieval filters use `inLanguage`. Omission == "unknown language" in some crawlers. The canonical WebSite schema (json-ld.tsx:119-140) also lacks `inLanguage`.

**Fix:** Add `inLanguage: "en-US"` to:

- `websiteSchema` in json-ld.tsx:120
- `professionalServiceSchema` in json-ld.tsx:146
- `personSchema` in json-ld.tsx:16 (use `knowsLanguage: ["en"]` already present; also add at top-level for profile)
- `ProfilePage` in about/page.tsx:38
- `CollectionPage` in blog/page.tsx:48
- `DefinedTermSet` in glossary/page.tsx:42
- `webPageSchema()` in schema-utils.tsx:71 already has it — good.

**Severity:** MEDIUM.
**Effort:** 15 min.

---

### LOW — 5 findings

#### L1. `Article` / `TechArticle` has no `isPartOf` linking spoke → hub

**File:** `src/components/seo/article-json-ld.tsx:60-65`
**Current:** Emits `isPartOf: { "@type": "CreativeWorkSeries", name: series }` — but without an `@id`.

**Why it matters:** The hub post itself has an `@id` at `${siteUrl}/blog/{hub-slug}` but the CreativeWorkSeries is anonymous. This means the series is created ad-hoc on every spoke rather than resolving to a shared series entity.

**Fix:** Emit a stable `@id` for the series, or reference the hub post directly:

```ts
isPartOf: {
  "@type": "CreativeWorkSeries",
  "@id": `${siteUrl}/blog/${hubSlug}`,   // if hubSlug can be passed down
  name: series,
},
```

Requires adding a `hubSlug` lookup in blog/[slug]/page.tsx.

**Severity:** LOW.
**Effort:** 30 min.

---

#### L2. `Person.award` is text-only; Google prefers structured awards

**File:** `src/components/seo/json-ld.tsx:77-82`
**Current:** Strings like "337x performance improvement - TraceForge vectorization engine."

**Why it matters:** Strings are parsed but lose structure. LLMs prefer `{name, awarder}` pairs.

**Fix:** Either leave as-is (acceptable) or upgrade to:

```ts
award: [
  { name: "337x performance improvement", description: "TraceForge vectorization engine" },
  ...
]
```

Note: schema.org `Person.award` takes `Text`, not `Award` type. Upgrade is syntactically `Text` only. This is a LOW-priority cosmetic.

**Severity:** LOW.
**Effort:** 15 min.

---

#### L3. FAQ answers are sometimes <50 words — watch for thin FAQ penalty

**File:** `src/app/blog/[slug]/hub-faqs.ts` (sample inspected: lines 7-38)

**Why it matters:** The user's prompt flagged "over-stuffed FAQ is a known 2025 ranking penalty." Inspected answers are substantive (100-200 words each for the first 3 Q/A pairs). No action required — content meets the AEO bar. Flag kept as a watch item when new FAQs are added.

**Severity:** LOW (currently healthy).
**Effort:** N/A (monitoring only).

---

#### L4. `Person.image` points at 1200×630 OG image — Google prefers square person photos

**File:** `src/components/seo/json-ld.tsx:21`
**Current:** `image: OG_IMAGE_URL,` (= `/og-image.png`, 1200×630)

**Why it matters:** Google Knowledge Panel prefers square or portrait person images. 1200×630 is OG aspect. For entity cards in AI Overviews, a square profile photo is preferred.

**Fix:** Create `/headshot.png` at 800×800 and point `personSchema.image` at it. Emit as `ImageObject`:

```ts
image: {
  "@type": "ImageObject",
  url: "https://alexmayhew.dev/headshot.png",
  width: 800,
  height: 800,
},
```

**Severity:** LOW.
**Effort:** 30 min (if asset exists) / 2 hrs (if new photo needed).

---

#### L5. `ConsultingService.aggregateRating` absent

**File:** `src/components/seo/json-ld.tsx:146-246`

**Why it matters:** User's prompt asked specifically about `aggregateRating`. The site has no public testimonials / reviews surfaced yet, so emitting synthetic ratings would be dishonest. Skip until genuine reviews exist.

**Severity:** LOW (not applicable until reviews ship).
**Effort:** N/A.

---

## Fields Verified Present ✓

- `Person.knowsAbout` — 25 entries (json-ld.tsx:44-76). Excellent coverage.
- `Person.knowsLanguage` — `["en"]`.
- `Person.hasCredential` — 2 entries with description.
- `Person.jobTitle`, `description`, `worksFor`, `award` — all present.
- `Organization.foundingDate`, `areaServed`, `knowsAbout`, `sameAs`, `founder`.
- `WebSite.potentialAction.SearchAction` — wired to `/blog?q={search_term_string}`.
- `ConsultingService.hasOfferCatalog` with 3 offers, each with `priceSpecification`.
- `ConsultingService.contactPoint`, `address`, `areaServed` (7 entries), `knowsAbout`, `sameAs`.
- Article/TechArticle: `headline`, `datePublished`, `dateModified`, `image (ImageObject with dimensions)`, `author (@id)`, `publisher (@id)`, `mainEntityOfPage`, `articleSection`, `keywords`, `inLanguage`, `isAccessibleForFree`, `timeRequired`.
- CaseStudy: `TechArticle` with `sameAs` link to external product URL.
- Glossary: `DefinedTermSet` + `DefinedTerm` with `termCode`, `description`, `inDefinedTermSet`, `url`.
- ProfilePage on `/about` with `mainEntity: PERSON_REF`.
- CollectionPage on `/blog` with `ItemList` of all posts.
- ContactPage on `/contact` with `mainEntity: PERSON_REF`.
- BreadcrumbList on all deep pages (verified in service/migration/integration/comparison/role/case-study/technology/blog).
- FAQPage on 70 blog posts, 6 pSEO page types (service/migration/integration/comparison/role).

---

## Prioritized Fix Order (Impact : Effort)

| #   | Fix                                                                        | Severity | Impact                         | Effort               | Ratio |
| --- | -------------------------------------------------------------------------- | -------- | ------------------------------ | -------------------- | ----- |
| 1   | **H2** — Replace `ConsultingService.logo = favicon.svg` with real logo PNG | HIGH     | High (Google logo spec)        | 5 min                | 10x   |
| 2   | **M4** — Add `creator` / `publisher` to DefinedTermSet                     | MED      | Medium (attribution)           | 5 min                | 8x    |
| 3   | **M5** — Export ComparisonJsonLd, SoftwareJsonLd from index.ts             | MED      | Low (hygiene)                  | 5 min                | 5x    |
| 4   | **M3** — Add `subjectOf` back-references to each DefinedTerm               | MED      | High (bidirectional graph)     | 15 min               | 6x    |
| 5   | **H1** — Replace Organization.logo with real logo ImageObject              | HIGH     | High (Article rich results)    | 30 min (incl. asset) | 4x    |
| 6   | **H3** — Expand `sameAs` with Dev.to + mailto                              | HIGH     | High (cross-platform identity) | 15 min               | 4x    |
| 7   | **H4** — Emit `wordCount` on ArticleJsonLd                                 | HIGH     | High (AI depth ranking)        | 30 min               | 3x    |
| 8   | **H5** — Add `hasOccupation`, `alternateName` to Person                    | HIGH     | High (E-E-A-T)                 | 30 min               | 3x    |
| 9   | **M8** — Add `inLanguage: "en-US"` to non-Article schemas                  | MED      | Medium                         | 15 min               | 3x    |
| 10  | **M1/M2** — `about` / `mentions` / `citation` on Article (hub posts first) | MED      | Very High (long-term)          | 2 hrs                | 2x    |

---

## Anti-Patterns Confirmed Absent

These were explicitly checked and are clean:

- ✗ No stray inline `{"@type": "Person", name: "Alex Mayhew"}` objects.
- ✗ No duplicate Organization nodes.
- ✗ No duplicate WebSite `@id`s (one in schema-utils ref, one in json-ld.tsx — same `@id`, so they resolve to the same node; acceptable).
- ✗ No `ProfessionalService` (correctly migrated to `ConsultingService`).
- ✗ No `AboutPage` on `/about` (correctly `ProfilePage` per E-E-A-T research).

---

## Sources

- Schema markup research baseline: `docs/research/schema-markup-seo-2026.md`
- Prior structural audit: `docs/research/agent-research/audit-2026-04-16-schema.md`
- Person/E-E-A-T research: `docs/research/person-schema-eeat-2026.md`
- Google Search Central: Article, Organization, Logo, ProfilePage, FAQPage docs (April 2026 versions)
- Schema.org: Person, Organization, DefinedTerm, DefinedTermSet, TechArticle, BlogPosting
