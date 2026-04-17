# Plan 2: SEO & Schema Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all schema consolidation issues, add missing structured data, fix SEO metadata gaps, and improve site discoverability.

**Architecture:** Targeted edits to existing SEO components and page metadata. No new architectural patterns.

**Tech Stack:** Next.js 15 / React 19 / schema.org JSON-LD

---

## Chunk 1: Schema Entity Consolidation

### Task 1: Fix WEBSITE_REF @id Mismatch

**Files:**

- Modify: `src/components/seo/schema-utils.tsx` — change WEBSITE_REF @id from `SITE_URL` to `${SITE_URL}/#website`
- Modify: `src/app/technologies/[slug]/technology-page-content.tsx` — remove the manual `@id` override hack

- [ ] **Step 1: Write test for correct WEBSITE_REF @id**
- [ ] **Step 2: Fix WEBSITE_REF in schema-utils.tsx** — change to `{ "@id": "${SITE_URL}/#website" }` (pure reference, like PERSON_REF)
- [ ] **Step 3: Update all consumers** that spread WEBSITE_REF properties (webPageSchema, technology-json-ld)
- [ ] **Step 4: Run build, commit**

### Task 2: Replace Remaining 7 Inline Person Objects with PERSON_REF

**Files to modify:**

- `src/components/seo/contact-json-ld.tsx` — inline Person → PERSON_REF
- `src/components/seo/role-json-ld.tsx` — inline Person → PERSON_REF (add import)
- `src/components/seo/technology-json-ld.tsx` — inline Person → PERSON_REF (add import)
- `src/components/seo/case-study-json-ld.tsx` — inline Person → PERSON_REF
- `src/components/seo/comparison-json-ld.tsx` — TWO inline Persons → PERSON_REF + ORG_REF for publisher
- `src/app/services/page.tsx` — inline Person in ItemList → PERSON_REF
- `src/app/for/page.tsx` — inline Person in ItemList → PERSON_REF

- [ ] **Step 1: Write test** verifying no inline Person objects exist (grep for `"@type": "Person"` excluding json-ld.tsx)
- [ ] **Step 2: Replace all 7 files** — import PERSON_REF, replace inline objects
- [ ] **Step 3: Fix comparison publisher** — change from Person to ORG_REF for Article publisher
- [ ] **Step 4: Delete deprecated PROVIDER_PERSON** (zero importers remain)
- [ ] **Step 5: Run build, commit**

---

## Chunk 2: Missing Schemas

### Task 3: Add ProfilePage Schema to /about

**Files:**

- Modify: `src/app/about/page.tsx` — add ProfilePage JSON-LD with mainEntity referencing PERSON_REF

- [ ] **Step 1: Write test** checking about/page.tsx contains "ProfilePage"
- [ ] **Step 2: Add JSON-LD script** with `@type: "ProfilePage"`, `mainEntity: PERSON_REF`, `dateModified`, `description`
- [ ] **Step 3: Run build, commit**

### Task 4: Add CollectionPage Schema to /blog

**Files:**

- Modify: `src/app/blog/page.tsx` — add CollectionPage + ItemList JSON-LD

- [ ] **Step 1: Write test** checking blog/page.tsx contains "CollectionPage"
- [ ] **Step 2: Add JSON-LD** with `@type: "CollectionPage"`, ItemList of blog post URLs
- [ ] **Step 3: Run build, commit**

### Task 5: Fix Comparison Article Schema

**Files:**

- Modify: `src/components/seo/comparison-json-ld.tsx` — change Article → TechArticle, add missing required properties (datePublished, image)

- [ ] **Step 1: Add datePublished, image to comparison schema**
- [ ] **Step 2: Change @type from Article to TechArticle**
- [ ] **Step 3: Run build, commit**

---

## Chunk 3: SEO Metadata Fixes

### Task 6: Add /for to Main Navigation

**Files:**

- Modify: `src/components/ui/navigation.tsx` — add /for to navItems array

- [ ] **Step 1: Write test** checking navigation includes "/for"
- [ ] **Step 2: Add nav item** — `{ href: "/for", label: "Advisory", code: "09" }` (or similar)
- [ ] **Step 3: Run build, commit**

### Task 7: Shorten pSEO Titles to Avoid Truncation

**Files:**

- Modify: `src/data/pseo/pages.ts` — shorten seo.title fields to max 45 chars (before template suffix)

- [ ] **Step 1: Write script to find titles exceeding 45 chars**
- [ ] **Step 2: Shorten the worst offenders** (15 of 19 need trimming)
- [ ] **Step 3: Run build, commit**

### Task 8: Add Missing OG/Twitter Metadata

**Files:**

- Modify: `src/app/privacy/page.tsx` — add openGraph + twitter
- Modify: `src/app/terms/page.tsx` — add openGraph + twitter
- Modify: `src/app/newsletter/page.tsx` — add twitter
- Modify: `src/app/tools/page.tsx` — add twitter

- [ ] **Step 1: Add metadata to each file** following existing patterns
- [ ] **Step 2: Run build, commit**

### Task 9: Standardize Canonical URLs to Relative Format

**Files:** All page.tsx files using absolute canonicals

- [ ] **Step 1: Find all absolute canonicals** — `grep -rn 'canonical:.*siteUrl' src/app/`
- [ ] **Step 2: Change to relative** — e.g., `canonical: \`/technologies/${slug}\`` instead of `\`${siteUrl}/technologies/${slug}\``
- [ ] **Step 3: Run build, commit**

---

## Chunk 4: Deploy & Verify

### Task 10: Full Build, Push, GSC Resubmit

- [ ] **Step 1: Full test suite + build**
- [ ] **Step 2: Push to main**
- [ ] **Step 3: Monitor deploy**
- [ ] **Step 4: Resubmit sitemap to GSC**
- [ ] **Step 5: Request indexing for /about, /blog, /services, 5 hub posts via GSC**
