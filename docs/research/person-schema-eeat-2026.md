# Person Schema, E-E-A-T Signals & Entity Strategy Research (2026-03-30)

**Status:** CURRENT
**Session:** Deep dive into Person schema best practices, E-E-A-T signals, @id entity references, AboutPage/ProfilePage types, Knowledge Panel strategy, and author byline requirements for alexmayhew.dev
**Builds on:** `schema-markup-seo-2026.md` (2026-03-14) -- Section 4 (Person @id) is the starting point; this doc goes much deeper

---

## Executive Summary

Google's February and March 2026 core updates significantly amplified author/entity signals. The key findings:

1. **Person schema with `@id` is the single most important entity signal** -- define once, reference everywhere
2. **The About page MUST have enhanced schema** -- it should be the "Entity Home" (ProfilePage + Person as mainEntity)
3. **Duplicate Person objects across pages fragment the entity** -- all pages creating inline Person objects should switch to `@id` references
4. **Author bylines with photos are now strongly weighted** for E-E-A-T, especially post-March 2026
5. **`knowsAbout` is the second most impactful entity property** post-March 2026 update
6. **ProfilePage is the correct schema type for the About page** (not AboutPage) -- Google actively uses it
7. **Knowledge Panel generation depends on Entity Home + sameAs consistency** -- schema alone is necessary but not sufficient

---

## Finding 1: Google's 2026 Guidance on Person Schema for Personal Brand Sites

### What changed in 2026

Google's March 2026 core update (confirmed March 10, rolled out over 21 days) **amplified the first E in E-E-A-T** (Experience) beyond all previous signals. Specific changes:

- **72% of top-ranking pages** now display detailed author credentials
- **Author bios are ranking infrastructure**, not optional metadata -- sites that added structured author pages with verifiable credentials saw measurable ranking improvements within weeks
- Google added a new "Authors" section to Search Central documentation
- **Generic "Editorial Team" attribution** no longer provides meaningful E-E-A-T signal
- **Named authors with external profiles** (LinkedIn, Google Scholar, published books, professional associations) are now valued

### Required Person properties (Google-enforced for Article rich results)

| Property      | Required                   | Notes                                                       |
| ------------- | -------------------------- | ----------------------------------------------------------- |
| `name`        | Yes                        | Full name of the person                                     |
| `url`         | Recommended                | Link to the person's primary online representation          |
| `image`       | Recommended                | Photo of the person (Google prefers real photos over logos) |
| `jobTitle`    | Recommended                | Professional title                                          |
| `sameAs`      | Critical for entity        | Links to LinkedIn, GitHub, X, Wikipedia, Wikidata           |
| `knowsAbout`  | High value post-March 2026 | Array of expertise topics -- topical authority signal       |
| `description` | Recommended                | Professional bio                                            |

### High-value properties for consultants specifically

| Property        | Purpose                                                              | Implementation                                                                |
| --------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `knowsAbout`    | Topical authority signal -- AI Mode uses this when selecting sources | Array of strings matching actual expertise areas                              |
| `hasOccupation` | Establishes professional credibility                                 | `Occupation` type with `skills`, `startDate`                                  |
| `hasCredential` | Formal qualifications                                                | `EducationalOccupationalCredential` with `credentialCategory`, `recognizedBy` |
| `alumniOf`      | Educational background                                               | `EducationalOrganization` with name and URL                                   |
| `memberOf`      | Professional affiliations                                            | `Organization` types for associations                                         |
| `award`         | Recognition and authority                                            | Array of notable achievements                                                 |
| `worksFor`      | Current organization                                                 | `Organization` with name                                                      |

### Source verification

- [Google Search Central - Creating Helpful Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [E-E-A-T in March 2026 - DigitalApplied](https://www.digitalapplied.com/blog/e-e-a-t-march-2026-google-rewards-experience-content-guide)
- [Schema Markup After March 2026 - DigitalApplied](https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies)
- [Person Schema Markup - Aubrey Yung](https://aubreyyung.com/person-schema-markup/)

---

## Finding 2: The About Page MUST Have Enhanced Schema (ProfilePage, Not AboutPage)

### ProfilePage vs AboutPage

Both are subtypes of `WebPage` in schema.org. The key distinction:

| Type            | Purpose                                                               | Google Support                                                                                                                           |
| --------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **ProfilePage** | Pages about a specific person/creator sharing first-hand perspectives | **Actively supported by Google** -- announced Nov 2023, has dedicated Search Central documentation, powers Discussions & Forums features |
| **AboutPage**   | Generic "about us" company pages                                      | Listed in schema.org but **no dedicated Google documentation**, no specific rich result features                                         |

**Verdict: Use ProfilePage for the About page on alexmayhew.dev.** Google has dedicated documentation for ProfilePage at `developers.google.com/search/docs/appearance/structured-data/profile-page` and actively uses it for entity recognition.

### What ProfilePage provides

- Helps Google Search understand the creator and show better content in search results
- Powers "Discussions and Forums" feature attribution
- **mainEntity must be a Person or Organization** -- this is what links the page to the entity
- Recommended properties: `dateCreated`, `dateModified`

### Implementation for alexmayhew.dev About page

The About page should be the **Entity Home** -- the single canonical page Google considers the primary source of truth about Alex Mayhew.

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "2025-01-01",
  "dateModified": "2026-03-30",
  "mainEntity": {
    "@type": "Person",
    "@id": "https://alexmayhew.dev/#person",
    "name": "Alex Mayhew",
    "url": "https://alexmayhew.dev",
    "image": "https://alexmayhew.dev/images/alex-mayhew-headshot.webp",
    "jobTitle": "Technical Advisor & Systems Architect",
    "description": "...",
    "sameAs": [...],
    "knowsAbout": [...],
    "hasOccupation": {...},
    "alumniOf": {...},
    "worksFor": {...},
    "award": [...]
  }
}
```

**Critical:** The `@id` in this ProfilePage's mainEntity MUST match the global Person `@id` (`https://alexmayhew.dev/#person`). This tells Google "the person defined on this page IS the same entity referenced everywhere else on the site."

### Source verification

- [Google Search Central - ProfilePage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [ProfilePage Schema Markup - Aubrey Yung](https://aubreyyung.com/profilepage-schema/)
- [ProfilePage Schema for Organizations and People - Hill Web Creations](https://www.hillwebcreations.com/profile-page-schema-for-organizations-and-people/)

---

## Finding 3: Correct Use of @id References for Person Across Pages

### The problem on alexmayhew.dev today

The global layout (`json-ld.tsx`) correctly defines Person with `@id: "https://alexmayhew.dev/#person"` and references it via `@id` in Organization, WebSite, and ProfessionalService schemas.

However, **7 other files create duplicate inline Person objects** without using the `@id` reference:

| File                     | Creates duplicate Person                                             | Should use @id instead                                    |
| ------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------- |
| `services/page.tsx`      | `provider: { "@type": "Person", name: "Alex Mayhew", url: siteUrl }` | `provider: { "@id": "https://alexmayhew.dev/#person" }`   |
| `for/page.tsx`           | Same pattern as services                                             | Same fix                                                  |
| `role-json-ld.tsx`       | `provider: { "@type": "Person", ... }`                               | `provider: { "@id": "https://alexmayhew.dev/#person" }`   |
| `comparison-json-ld.tsx` | Both `author` and `publisher` as inline Person                       | Both should use `@id` reference                           |
| `technology-json-ld.tsx` | `provider: { "@type": "Person", ... }`                               | `provider: { "@id": "https://alexmayhew.dev/#person" }`   |
| `case-study-json-ld.tsx` | `author: { "@type": "Person", ... }`                                 | `author: { "@id": "https://alexmayhew.dev/#person" }`     |
| `contact-json-ld.tsx`    | `mainEntity: { "@type": "Person", ... }`                             | `mainEntity: { "@id": "https://alexmayhew.dev/#person" }` |
| `schema-utils.tsx`       | `PROVIDER_PERSON` constant creates inline Person                     | Should export an `@id` reference constant                 |

**Note:** `article-json-ld.tsx` and `software-json-ld.tsx` already correctly use `@id` references.

### The correct pattern

**Define the Person entity ONCE** (in the global layout via `json-ld.tsx` -- already done). On every other page, reference it by `@id` only:

```json
// CORRECT -- reference by @id
"author": { "@id": "https://alexmayhew.dev/#person" }

// WRONG -- duplicate inline definition
"author": { "@type": "Person", "name": "Alex Mayhew", "url": "https://alexmayhew.dev" }
```

### Why this matters

- **Entity fragmentation:** Each inline Person object is treated as a potentially different entity. Google's Knowledge Graph must disambiguate whether `{ "@type": "Person", "name": "Alex Mayhew" }` on page A is the same as `{ "@type": "Person", "name": "Alex Mayhew", "jobTitle": "Technical Advisor" }` on page B
- **@id references create a unified entity node:** All pages reinforce the same Knowledge Graph entity
- **The @id URI must be stable forever** -- changing it breaks all cross-page entity references
- **No penalty for duplicates**, but entity consolidation is weakened. It's not a ranking penalty -- it's a missed optimization

### @id format best practice

Standard convention:

- Person: `https://yourdomain.com/#person`
- Organization: `https://yourdomain.com/#organization`
- WebSite: `https://yourdomain.com/#website`
- Business: `https://yourdomain.com/#business`

The `#` fragment identifier means it's not a navigable URL but a unique identifier within the domain's namespace.

### Source verification

- [Using @id in Schema.org Markup - Momentic](https://momenticmarketing.com/blog/id-schema-for-seo-llms-knowledge-graphs)
- [What is an @id in Structured Data - Schema App](https://www.schemaapp.com/schema-markup/what-is-an-id-in-structured-data/)
- [How to Choose your @id for Schema - Aubrey Yung](https://aubreyyung.com/how-to-choose-id-for-schema/)
- [Entity SEO & Schema Markup - Schema Validator](https://schemavalidator.org/guides/entity-seo-schema-markup)

---

## Finding 4: Author Bylines with Photos for E-E-A-T

### Google's position

Google's official documentation asks these questions about content:

- "Is it self-evident to your visitors who authored your content?"
- "Do pages carry a byline, where one might be expected?"
- "Do bylines lead to further information about the author or authors involved?"

### What changed post-March 2026

- **Author identity directly influences page-level authority** in Google's evaluation
- Content demonstrating "genuine first-hand experience through specific details, original outcomes, and verifiable author credentials" outranks comprehensive but impersonal content
- Google has NOT made authorship a direct ranking factor (they've explicitly said this) -- but it **strongly influences trust, quality signals, and interpretation**
- **Consistent author entities help search systems connect content, expertise, and credibility** across the web

### Practical implications for alexmayhew.dev blog posts

1. **Every blog post SHOULD have a visible author byline** -- name linked to the About page
2. **Author photo is recommended** -- Google specifically mentions "clear author attribution with photos" as part of E-E-A-T implementation for AI Overviews visibility
3. **The byline should link to the About page** (the Entity Home) -- this creates a visible connection that mirrors the structured data connection
4. **Author pages with verifiable credentials** are now weighted more heavily -- the About page should list: industry experience, specific project outcomes, external profiles, and areas of expertise

### What the blog currently does vs what it should do

Currently: Blog posts likely have an author name but may not have a visible headshot, link to the About page, or match the Person schema entity.

Recommended: Each blog post should display a small author card (name + photo + one-line bio + link to /about) that reinforces the Person entity signals.

### Source verification

- [Is Authorship Still Important for SEO & AEO - seoClarity](https://www.seoclarity.net/blog/google-authorship)
- [How Author Bylines Boost Google Rankings - The Maker Desk](https://themakerdesk.com/how-author-bylines-boost-google-rankings-easy-fix/)
- [Google Search Central - Creating Helpful Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Author Page Examples that Showcase E-E-A-T - Digitaloft](https://digitaloft.co.uk/author-page-examples/)

---

## Finding 5: Person Schema, Knowledge Panel, and Indexing Relationship

### How Knowledge Panels work in 2026

A Google Knowledge Panel is triggered when Google's Knowledge Graph recognizes an entity as "notable" with sufficient consistent signals. The process:

1. **Entity Home establishment** -- a single canonical page (typically About page) serves as the primary source of truth
2. **Structured data (Person schema)** tells Google this is an entity worth tracking
3. **sameAs links** connect the entity to external authoritative profiles
4. **Independent coverage** in trusted publications strengthens entity confidence
5. **Consistency across all signals** is the "trust signal of 2026" -- if LinkedIn says "CEO" but your website says "Founder," Google experiences "Data Friction" that delays panel creation

### Timeline for Knowledge Panel generation

With strong digital footprint + correct schema: typically **4-8 weeks** for the Knowledge Graph to process connections and display a panel.

### Key factors (priority order)

1. **sameAs property** -- the most powerful tool. Tells Google the person on this page is the same individual on LinkedIn, X, GitHub, etc.
2. **Entity Home with ProfilePage** -- canonical source of truth
3. **Independent authoritative coverage** -- news articles, press releases, interviews, features on high-quality sites
4. **Consistency** -- same name, same title, same photo across all platforms
5. **Wikipedia/Wikidata** -- strong signal but NO LONGER required. Many professionals have panels without Wikipedia entries as of 2026

### Important: Wikipedia is no longer required

Google in 2026 relies more on **Entity Homes and structured data** than it does on Wikipedia. Many executives and professionals have Knowledge Panels without a Wikipedia entry, driven by:

- Comprehensive Person schema with sameAs
- Consistent profiles across authoritative platforms
- Independent coverage on trusted sites

### Schema's role vs other signals

Schema markup is **necessary but not sufficient** for a Knowledge Panel. It provides the structured signal that tells Google an entity exists and how to identify it. But Google also needs:

- **Notability signals** (coverage, citations, external references)
- **Disambiguation confidence** (sameAs links, consistent data across platforms)
- **Content volume** (enough pages referencing the entity)

### Source verification

- [Google Knowledge Panel for Person: 2026 Executive Guide - 12AM Agency](https://12amagency.com/blog/google-knowledge-panel-for-person/)
- [Structured Data to Improve Knowledge Panel: 2026 Technical Guide - 12AM Agency](https://12amagency.com/blog/structured-data-to-improve-knowledge-panel/)
- [How to Get a Google Knowledge Panel - Lindy Panels](https://lindypanels.com/blogs/how-to-get-a-google-knowledge-panel)
- [How to Get a Google Knowledge Panel - Stackmatix](https://www.stackmatix.com/blog/how-to-get-google-knowledge-panel)

---

## Finding 6: New/Updated Schema Properties for Consultants in 2026

### Schema.org V30.0 (released 2026-03-19) -- current version

All properties below are actively supported in the current schema.org version.

### `knowsAbout` -- the highest-leverage new-ish property

Post-March 2026, `knowsAbout` is confirmed as the **second most impactful entity markup change available**. It creates a topical authority signal that Google's AI Mode uses when selecting sources for specific query categories.

**Implementation:**

```json
"knowsAbout": [
  "System Architecture",
  "SaaS Development",
  "Performance Engineering",
  "Technical Due Diligence",
  "React",
  "Next.js",
  "TypeScript"
]
```

**Best practice:** Only list topics the person demonstrably has content about on the site. Google cross-references `knowsAbout` claims against actual page content.

### `hasCredential` -- formal qualifications

```json
"hasCredential": {
  "@type": "EducationalOccupationalCredential",
  "credentialCategory": "Professional Certification",
  "name": "AWS Solutions Architect",
  "recognizedBy": {
    "@type": "Organization",
    "name": "Amazon Web Services"
  }
}
```

### `hasOccupation` -- current and past roles

```json
"hasOccupation": {
  "@type": "Occupation",
  "name": "Technical Advisor",
  "occupationalCategory": "15-1252.00",
  "skills": "System Architecture, Performance Engineering, Technical Due Diligence"
}
```

The `occupationalCategory` can use O\*NET SOC codes for precision.

### `interactionStatistic` -- social proof (on ProfilePage)

Google's ProfilePage documentation specifically mentions this for showing follower counts and content popularity. Useful on the About page.

### Source verification

- [knowsAbout schema: A Short Guide (2026) - Aubrey Yung](https://aubreyyung.com/knowsabout-schema/)
- [hasCredential - Schema.org](https://schema.org/hasCredential)
- [hasOccupation - Schema.org](https://schema.org/hasOccupation)
- [Person - Schema.org Type](https://schema.org/Person)

---

## Finding 7: `knowsAbout` as Post-March 2026 Authority Signal

This is significant enough to warrant its own section.

### What Google's AI Mode does with `knowsAbout`

- AI Mode uses `knowsAbout` to **select sources for specific query categories**
- It creates a **topical authority signal** -- pages from entities that declare and demonstrate expertise in a topic are preferred for AI Overviews in that topic
- **Cross-referenced against actual content:** if you claim `knowsAbout: "Kubernetes"` but have zero content about Kubernetes, the signal is weakened or ignored
- **Entity disambiguation:** `knowsAbout` helps distinguish between multiple people with the same name

### Implementation on alexmayhew.dev

The current `knowsAbout` array in `json-ld.tsx` has 27 items. This is reasonable but should be reviewed to ensure every item has supporting content on the site.

### Recommendation

Audit the `knowsAbout` array against actual published content. Remove any topic that doesn't have at least one blog post or page substantively covering it. Add any topic that has substantial content but isn't listed.

---

## Finding 8: Entity Disambiguation via sameAs

### Current sameAs links on alexmayhew.dev

```json
"sameAs": [
  "https://github.com/LecoMV",
  "https://www.linkedin.com/in/alexmmayhew",
  "https://x.com/alexmayhewdev",
  "https://bsky.app/profile/alexmayhewdev.bsky.social"
]
```

### Recommended additions (if applicable)

| Platform       | Why                                                        | Priority                                 |
| -------------- | ---------------------------------------------------------- | ---------------------------------------- |
| Wikidata       | Strongest entity disambiguation signal for Knowledge Graph | High (if entry exists or can be created) |
| Crunchbase     | Business entity validation                                 | Medium                                   |
| Dev.to         | Technical content platform                                 | Medium                                   |
| Google Scholar | Academic/research credibility                              | Low (only if publications exist)         |
| YouTube        | Multi-modal content (Google favors)                        | Medium (if channel exists)               |

### Source verification

- [Entity SEO & Schema Markup - Schema Validator](https://schemavalidator.org/guides/entity-seo-schema-markup)
- [Organization Schema Markup: Complete Guide - Stackmatix](https://www.stackmatix.com/blog/organization-schema-knowledge-graph)

---

## Recommended Changes for alexmayhew.dev

### Priority 1: High Impact / Quick Wins

1. **Add ProfilePage schema to the About page** -- with `mainEntity` pointing to `@id: "https://alexmayhew.dev/#person"` and the full enhanced Person definition. The About page becomes the Entity Home.

2. **Fix all duplicate Person objects** -- replace inline Person definitions in these files with `@id` references:
   - `services/page.tsx`
   - `for/page.tsx`
   - `role-json-ld.tsx`
   - `comparison-json-ld.tsx` (both author and publisher)
   - `technology-json-ld.tsx`
   - `case-study-json-ld.tsx`
   - `contact-json-ld.tsx`
   - `schema-utils.tsx` (`PROVIDER_PERSON` constant)

3. **Update `PROVIDER_PERSON` in `schema-utils.tsx`** to be an `@id` reference:
   ```typescript
   export const PERSON_REF = {
   	"@id": "https://alexmayhew.dev/#person",
   };
   ```

### Priority 2: E-E-A-T Strengthening

4. **Add visible author bylines to blog posts** -- name + photo + one-line bio + link to /about page

5. **Add `hasOccupation` to the Person schema** -- "Technical Advisor" with skills array

6. **Add `hasCredential` if applicable** -- any professional certifications

7. **Audit `knowsAbout` array** -- cross-reference against actual published content, remove unsupported claims

### Priority 3: Knowledge Panel & Entity Growth

8. **Create Wikidata entry** (if notability threshold met) -- strongest sameAs signal for Knowledge Graph

9. **Add any missing sameAs links** -- Crunchbase, Dev.to, YouTube (if applicable)

10. **Ensure exact name consistency** -- "Alex Mayhew" must be identical across all platforms, schema, bylines, and external profiles

---

## What NOT to Do

- **Do NOT use AboutPage schema type** -- it has no Google documentation or rich result support; ProfilePage is the correct choice
- **Do NOT remove the global Person from layout** -- it must remain as the canonical definition on every page
- **Do NOT change the @id URI** -- `https://alexmayhew.dev/#person` is the permanent entity identifier
- **Do NOT add Person properties that can't be verified** -- `knowsAbout` claims without supporting content weaken trust
- **Do NOT add SpeakableSpecification** -- still beta, news-only
- **Do NOT use different name formats** -- "Alex Mayhew" everywhere, not "Alexander Mayhew" on one platform and "Alex M." on another

---

## Sources

### Google Official Documentation

- [Google Search Central - ProfilePage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google Search Central - Creating Helpful, Reliable, People-First Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google Search Central - General Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

### Schema.org Reference

- [Person - Schema.org Type](https://schema.org/Person)
- [ProfilePage - Schema.org Type](https://schema.org/ProfilePage)
- [AboutPage - Schema.org Type](https://schema.org/AboutPage)
- [knowsAbout - Schema.org Property](https://schema.org/knowsAbout)
- [hasCredential - Schema.org Property](https://schema.org/hasCredential)
- [hasOccupation - Schema.org Property](https://schema.org/hasOccupation)

### Industry Analysis (2026)

- [Schema Markup After March 2026: Structured Data Update - DigitalApplied](https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies)
- [E-E-A-T in March 2026: Google Experience Content Guide - DigitalApplied](https://www.digitalapplied.com/blog/e-e-a-t-march-2026-google-rewards-experience-content-guide)
- [Schema Markup in 2026: Why It's Now Critical - ALM Corp](https://almcorp.com/blog/schema-markup-detailed-guide-2026-serp-visibility/)
- [Structured Data AI Search: Schema Markup Guide (2026) - Stackmatix](https://www.stackmatix.com/blog/structured-data-ai-search)
- [Google February 2026 Core Update - Results Repeat](https://resultsrepeat.com/february-2026-google-core-update-what-it-means-for-seo-and-search-intelligence/)

### Entity SEO & Knowledge Panel

- [Using @id in Schema.org Markup - Momentic](https://momenticmarketing.com/blog/id-schema-for-seo-llms-knowledge-graphs)
- [What is an @id in Structured Data - Schema App](https://www.schemaapp.com/schema-markup/what-is-an-id-in-structured-data/)
- [How to Choose your @id for Schema - Aubrey Yung](https://aubreyyung.com/how-to-choose-id-for-schema/)
- [Entity SEO & Schema Markup: Build Your Knowledge Graph Presence - Schema Validator](https://schemavalidator.org/guides/entity-seo-schema-markup)
- [Google Knowledge Panel for Person: 2026 Executive Guide - 12AM Agency](https://12amagency.com/blog/google-knowledge-panel-for-person/)
- [Structured Data to Improve Knowledge Panel: 2026 Technical Guide - 12AM Agency](https://12amagency.com/blog/structured-data-to-improve-knowledge-panel/)

### Author & E-E-A-T

- [Is Authorship Still Important for SEO & AEO - seoClarity](https://www.seoclarity.net/blog/google-authorship)
- [How Author Bylines Boost Google Rankings - The Maker Desk](https://themakerdesk.com/how-author-bylines-boost-google-rankings-easy-fix/)
- [Author Page Examples that Showcase E-E-A-T - Digitaloft](https://digitaloft.co.uk/author-page-examples/)
- [knowsAbout schema: A Short Guide (2026) - Aubrey Yung](https://aubreyyung.com/knowsabout-schema/)
- [How To Implement Schema Markup To Increase E-E-A-T - Schema App](https://www.schemaapp.com/schema-markup/how-to-implement-schema-markup-to-increase-e-e-a-t/)
