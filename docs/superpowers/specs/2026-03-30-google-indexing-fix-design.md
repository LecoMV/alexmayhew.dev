# Google Indexing Fix — Design Spec

**Date:** 2026-03-30
**Status:** DRAFT
**Problem:** 178 of 180 sitemap URLs not indexed by Google (1.1% index rate)

---

## Diagnosis (Verified via GSC API + 3 Research Agents)

### GSC Data (Sampled 27 URLs)

| Status                              | Count | Examples                                                                                                         |
| ----------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------- |
| **Submitted and indexed**           | 5     | `/`, `/for/technical-founder`, `/blog/metr-paradox-ai-productivity`, `/docs`, `/privacy`                         |
| **Crawled - currently not indexed** | 2     | `/blog/saas-architecture-decision-framework`, `/technologies/postgresql`                                         |
| **URL unknown to Google**           | 20    | `/blog` (listing), `/about`, `/contact`, `/work`, `/tools`, `/services`, all hub posts, most spokes, newsletters |

### www vs non-www Split (28-day period)

| Domain                 | Pages with Impressions | Total Impressions | Clicks |
| ---------------------- | ---------------------- | ----------------- | ------ |
| alexmayhew.dev         | 11                     | 106               | 1      |
| **www.alexmayhew.dev** | **13**                 | **170**           | 0      |

Google is splitting authority across two domains. The www variant gets MORE impressions.

### Sitemap Status

180 URLs submitted. Sitemap shows: **0 indexed** web pages, **0 indexed** images. Last submitted 2026-03-21.

---

## 7 Root Causes

### 1. www.alexmayhew.dev Serves Content (No 301 Redirect)

**Evidence:** `curl -sI https://www.alexmayhew.dev/` returns HTTP 200 with 124KB of content. Canonical tags point to `alexmayhew.dev` (correct), but Google is indexing both versions and splitting authority.

**Root cause:** www is registered as a custom domain on the Cloudflare Workers project, so the OpenNext Worker serves full content on both hostnames.

**Fix:**

1. Remove `www.alexmayhew.dev` from Workers custom domains in Cloudflare Dashboard
2. Ensure proxied DNS A record for www exists (192.0.2.1 dummy IP, orange cloud ON)
3. Create Cloudflare Redirect Rule: `www.alexmayhew.dev/*` → `https://alexmayhew.dev/$1` (301, preserve query string)

**Source:** Cloudflare Pages documentation on www redirect + verified via DNS lookup and curl.

### 2. Homepage Links to Only 2 Pages

**Evidence:** `src/app/home-page.tsx` contains exactly 2 internal links: `/contact` (hero CTA) and `/work` (hero link). The Services section renders 3 static `<article>` cards with NO `href` — they're not links. Zero links to `/blog`, `/services`, `/technologies`, `/tools`, `/about`.

**Impact:** Homepage is the highest-authority page on the site. With only 2 outbound internal links, virtually no link equity flows to content pages. Google sees no signal that the content matters.

**Fix:** Add structured link sections to the homepage:

- Make services cards clickable (link to `/services/[slug]` or `/services`)
- Add "Featured Insights" section with 5 hub blog posts
- Add "Latest Articles" section with 3-4 recent posts
- Add link to `/services`, `/about`, `/blog` in existing sections

### 3. `relatedBlogPosts` Defined But Never Rendered

**Evidence:** 39 occurrences of `relatedBlogPosts` across `pages.ts` (19), `migrations.ts` (8), `integrations.ts` (6), `comparisons.ts` (6). Each entry contains 2-4 blog post slugs. The data is validated by Zod schemas. But NO page component ever renders these links.

**Impact:** ~108 potential contextual internal links between pSEO pages and blog posts — completely wasted. This is the single largest missed internal linking opportunity.

**Fix:** Add a "Related Insights" section to `service-page-content.tsx`, `migration-page-content.tsx`, `integration-page-content.tsx`, and `comparison-page-content.tsx` that renders the existing `relatedBlogPosts` data as links.

### 4. Blog Listing Pagination is JS-Only

**Evidence:** `src/components/blog/blog-list.tsx` uses `useState(POSTS_PER_PAGE)` where `POSTS_PER_PAGE = 12`. A "Load More" button increments `visibleCount`. Only 12 of 74 posts render in the initial HTML. Googlebot may not execute the JS click handler.

**Impact:** 62 blog posts are potentially invisible to search engine crawlers from the listing page. While individual posts ARE in the sitemap and cross-linked via MDX, the listing page as a discovery hub is severely limited.

**Fix:** Server-side pagination with `searchParams` (`?page=2`, `?page=3`), or render all posts in the initial HTML with the "Load More" as a progressive enhancement for UX. Since 74 posts is not excessive, rendering all with CSS-based progressive disclosure is the simplest approach.

### 5. Person @id Fragmentation

**Evidence:** `article-json-ld.tsx` correctly uses `{ "@id": "https://alexmayhew.dev/#person" }` for author references. But `schema-utils.tsx` (`PROVIDER_PERSON`), `contact-json-ld.tsx`, `case-study-json-ld.tsx`, and `comparison-json-ld.tsx` create standalone Person objects with inline properties instead of referencing `/#person`.

**Impact:** Google sees multiple Person entities instead of one consolidated entity. This weakens the Knowledge Graph association and E-E-A-T signal.

**Fix:** Replace all inline Person objects with `{ "@id": "https://alexmayhew.dev/#person" }` references. The global layout already defines the canonical Person entity.

### 6. Missing JSON-LD on Key Pages

**Evidence:**

- `/blog` listing: No JSON-LD at all (no CollectionPage, no ItemList)
- `/about`: No page-specific schema (no AboutPage WebPage type)
- Blog posts: Non-hub spoke posts always use `Article` instead of `BlogPosting`
- ProfessionalService should be ConsultingService per own research doc
- RSS alternate on `/blog` points to `/blog/rss.xml` which doesn't exist (actual feed is `/feed.xml`)

**Fix:**

- Add `CollectionPage` + `ItemList` schema to blog listing
- Add `AboutPage` WebPage type to about page with enhanced Person reference
- Change spoke post schema from `Article` to `BlogPosting`
- Change `ProfessionalService` to `ConsultingService`
- Fix RSS alternate to `/feed.xml`

### 7. No Links from Services/Work/Tools to Blog

**Evidence:** Service pages, work/case study pages, and tools pages have zero links to blog posts despite heavy topical overlap. The `relatedBlogPosts` data exists (Root Cause #3) but even beyond that, there's no cross-pollination between these content silos.

**Fix:** In addition to rendering `relatedBlogPosts` (#3), add contextual blog links in:

- Technology pages → related blog posts about that technology
- Work/case study pages → related blog posts about the approach used
- Tools pages → blog posts about the tools or their underlying technology

---

## Implementation Priority

### Phase 1: Infrastructure (No Code Changes)

1. Fix www → non-www 301 redirect in Cloudflare Dashboard
2. Verify redirect works with curl

### Phase 2: Critical Code Fixes (Highest SEO Impact)

3. Render `relatedBlogPosts` on all pSEO page types (~108 new internal links)
4. Fix homepage — add service links, featured blog posts, latest articles
5. Fix blog listing pagination — render all posts in initial HTML

### Phase 3: Schema & Structured Data

6. Consolidate Person @id references (remove duplicates)
7. Add CollectionPage schema to /blog
8. Add AboutPage schema to /about
9. Change ProfessionalService → ConsultingService
10. Fix spoke post Article → BlogPosting
11. Fix RSS alternate path

### Phase 4: Verification & Resubmission

12. Run `npm run build` + full lint
13. Push to main, monitor deploy
14. Verify www redirect with curl
15. Resubmit sitemap via GSC API
16. Inspect 10 priority URLs via GSC URL Inspection API
17. Monitor indexing over next 7-14 days

---

## Success Criteria

- www.alexmayhew.dev returns 301 → alexmayhew.dev (all paths)
- Homepage links to 15+ internal pages (from current 2)
- Every pSEO page has 2-4 blog post links rendered
- Blog listing renders all 74 posts in initial HTML
- Zero duplicate Person entities in JSON-LD
- All page types have appropriate schema
- GSC shows increasing indexed page count over 2-4 weeks

---

## Research Sources

- Voice-clone project: `docs/research/google-indexing-ranking-seo-geo-aeo-2026.md` (37KB, 2026-03-30)
- Voice-clone project: `docs/research/google-indexing-programmatic-2026.md` (24KB, 2026-03-30)
- Project: `docs/research/schema-markup-seo-2026.md`
- Project: `docs/research/google-search-console-api-2026.md`
- Cloudflare Pages docs: www redirect via Bulk Redirects
- GSC API URL Inspection: 27 URLs sampled, 5 indexed, 2 crawled-not-indexed, 20 unknown
