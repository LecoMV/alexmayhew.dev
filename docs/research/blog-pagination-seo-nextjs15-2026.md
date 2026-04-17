# Blog Listing Pagination SEO for Next.js 15 (2026-03-30)

**Status:** CURRENT
**Session:** alexmayhew.dev has 74 blog posts but only shows 12 initially with a JS "Load More" button. Research whether Googlebot can see the other 62 posts and what the best pagination approach is.

---

## Executive Summary

**The current implementation is an SEO problem.** Googlebot does NOT click "Load More" buttons. The 62 posts behind the button are invisible to search engines. The recommended fix is a hybrid approach: path-based pagination (`/blog/page/2`) using `generateStaticParams` for crawlability, with the existing "Load More" UX preserved as a progressive enhancement on top.

---

## 1. Does Googlebot Execute "Load More" Buttons?

**No. Verified from multiple authoritative sources.**

Googlebot renders JavaScript but does NOT interact with pages. It does not scroll, click buttons, hover, or trigger any user-initiated events. From Google's own documentation:

> "Google's crawlers don't 'click' buttons and generally don't trigger JavaScript functions that require user actions to update the current page contents."
> -- [Google Search Central: Pagination Best Practices](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)

> "Search bots crawl in a stateless manner, meaning those bots do not interact beyond loading the page. At best, these bots will see any content added to the initial HTML by JavaScript immediately after the page loads."
> -- [Matthew Edgar: Rendering and Bots](https://www.matthewedgar.net/rendering-how-bots-see-your-pages/)

**Key distinction:** Googlebot WILL execute JavaScript that runs automatically on page load (e.g., a React component rendering). It will NOT execute JavaScript triggered by user actions (clicks, scrolls, hovers). A `<button onClick={loadMore}>` is invisible to Googlebot.

**Impact on alexmayhew.dev:** Of 74 posts (5 hubs + 69 spokes), only 12 non-hub posts are visible to Googlebot. The remaining 57+ posts are effectively de-indexed from the blog listing page. They may still be found via the sitemap, but they lose the internal linking signal from the listing page.

---

## 2. SEO-Recommended Pagination Patterns

### Option A: Path-Based Pagination (RECOMMENDED)

URL structure: `/blog`, `/blog/page/2`, `/blog/page/3`, etc.

**Why this is best for Next.js 15:**

- Works with `generateStaticParams` for full SSG (static generation at build time)
- Every page is a unique, crawlable URL with `<a href>` navigation links
- Google treats each paginated URL as a separate page with its own canonical
- Compatible with ISR for cache freshness
- Does NOT break static generation (unlike `?page=2` searchParams)

**Google's explicit recommendation:**

> "Give each page a unique URL. For example, include a ?page=n query parameter, as URLs in a paginated sequence are treated as separate pages by Google."
> -- [Google Search Central](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)

Path-based (`/blog/page/2`) is superior to query-based (`/blog?page=2`) in Next.js App Router because `searchParams` forces dynamic rendering and prevents static generation.

### Option B: Query Parameter Pagination (`?page=2`)

**Trade-off:** Simpler URL structure but **prevents static generation** in Next.js 15. Accessing `searchParams` in a page component opts the entire route into dynamic rendering.

> "Accepting searchParams in a page component opts the entire route into dynamic rendering -- not just filtered pages, but every page served through that route."
> -- [Build with Matija: searchParams Fix](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix)

**Verdict:** Not recommended for a statically-generated blog.

### Option C: "View All" Single Page

Show all 74 posts on one page with no pagination.

**When it works:** Google says a "View All" page is the strongest option for SEO IF the page remains fast and mobile-friendly. For 74 posts (just titles, descriptions, and thumbnails), this is feasible but approaches the upper limit.

**Risks:**

- Page weight grows linearly with post count (74 image thumbnails)
- Mobile performance degrades
- A Zyppy SEO study found pages with 45-50 internal links saw peak organic traffic; beyond that, link equity dilution occurs
- No natural breaking point for future growth (150+ posts)

**Verdict:** Viable today at 74 posts but not future-proof. Better to implement pagination now.

### Option D: Hybrid (BEST APPROACH)

Combine path-based pagination for crawlers with "Load More" UX for users.

**How it works:**

1. Server-side: generate `/blog`, `/blog/page/2`, `/blog/page/3` as static pages
2. Each page has `<a href>` links to next/prev pages (visible in HTML for Googlebot)
3. Client-side: JavaScript intercepts and implements "Load More" behavior, loading the next batch inline
4. The visible pagination links become the crawlable fallback when JS doesn't execute

This gives Google crawlable `<a href>` links to discover all pages while users get the smooth "Load More" experience.

---

## 3. Path-Based vs Query Parameter Pagination

| Factor                     | Path-Based (`/blog/page/2`)    | Query (`/blog?page=2`)         |
| -------------------------- | ------------------------------ | ------------------------------ |
| Static Generation (SSG)    | YES via `generateStaticParams` | NO -- forces dynamic rendering |
| ISR Compatible             | YES                            | YES (but dynamic)              |
| Googlebot Crawlable        | YES                            | YES                            |
| URL Shareability           | Clean, bookmarkable            | Functional but less clean      |
| Next.js App Router Support | Native via dynamic routes      | Native via `searchParams` prop |
| Build Time                 | Pages pre-rendered at build    | Rendered per-request           |
| Performance                | Best (static HTML)             | Good (server-rendered)         |
| Implementation Complexity  | Moderate (new route segment)   | Low (read searchParams)        |

**Winner:** Path-based pagination. The SSG advantage is decisive for a blog with known content at build time.

---

## 4. `rel="next"` and `rel="prev"` -- Status in 2026

**Google does NOT use `rel="next/prev"` and has not since at least 2019.**

> "In 2019, Google publicly confirmed that it no longer used the rel='prev' and rel='next' attributes for indexing or ranking."
> -- [Yoast](https://yoast.com/google-doesnt-use-rel-prev-next-for-pagination/)

A 2025 test by Journey Further confirmed this:

> "Google does not crawl URLs referenced only in rel='next/prev' tags. Even with a perfect chain of clean rel-tagged pages, no crawl occurred without the presence of visible, clickable anchor links."
> -- [Journey Further: Pagination Links 2025](https://www.journeyfurther.com/articles/how-does-google-handle-pagination-links-in-2025)

**Recommendation:** Do NOT rely on `rel="next/prev"`. Instead, include actual `<a href>` links in the page HTML (e.g., "Previous Page" / "Next Page" links, or numbered page links). These are what Googlebot actually follows.

**Note:** `rel="next/prev"` won't hurt if included, and other search engines (Bing) may still use them. But they're not sufficient alone.

---

## 5. Maximum Links Per Page

**Google's official limit:** "A few thousand at most" per page. The old 100-link guideline was dropped years ago.

However, SEO effectiveness is different from crawl limits:

- **Zyppy study (23M links):** Pages with 45-50 internal links saw peak organic traffic. Beyond that, diminishing returns and sometimes negative impact from link equity dilution.
- **Practical recommendation:** 10-20 internal links per 2,000 words of content. For a listing page, 20-30 post links per page is reasonable.
- **Google's crawl discovery limit:** ~150 links per page before Googlebot may deprioritize additional links (flexible, not hard).

**For alexmayhew.dev (74 posts):**

- Showing all 74 on one page is technically fine for Google but suboptimal for link equity
- 12-15 posts per page across 5-6 pages is ideal
- Hub posts (5) displayed separately at the top are fine -- they're high-value internal links

---

## 6. How Major Next.js Sites Handle This

### Vercel Blog (vercel.com/blog)

- Uses SSG pagination template with 10 posts per page
- Official Vercel example: first 5 pages pre-rendered at build, rest via ISR
- Path-based pagination with `generateStaticParams`

### Tailwind CSS Blog (tailwindcss.com/blog)

- Loads all posts but uses webpack `resourceQuery` to load only previews (not full content) on the listing page
- Avoids bundling full post content into the listing page
- Smaller site (~50 posts) so single-page approach works

### General Pattern Across Major Sites

- Sites under ~50 posts: often show all on one page
- Sites with 50-200 posts: paginated (12-20 per page)
- Sites with 200+ posts: paginated with category/tag filtering

---

## 7. Recommended Implementation for alexmayhew.dev

### Architecture

```
src/app/blog/page.tsx                    # Page 1 (shows posts 1-12)
src/app/blog/page/[number]/page.tsx      # Pages 2+ (shows posts 13-24, etc.)
```

### Key Design Decisions

1. **Posts per page:** 12 (current value, good balance)
2. **Pagination type:** Path-based (`/blog/page/2`) for SSG compatibility
3. **Page 1 URL:** `/blog` (not `/blog/page/1` -- avoid duplicate content)
4. **Canonical:** Each page self-references (`/blog` for page 1, `/blog/page/2` for page 2)
5. **Hub posts:** Continue showing at top of page 1 only
6. **Category filtering:** Keep as client-side UX enhancement (not paginated per category)

### Crawlability Requirements

Each paginated page MUST include in the server-rendered HTML:

- `<a href="/blog/page/2">` style links (not just `<button>` elements)
- Links to at least: first page, previous page, next page, last page
- Each page's canonical URL pointing to itself
- All 12 post links as `<a href="/blog/post-slug">`

### Progressive Enhancement

- **Without JS (Googlebot):** Standard pagination with `<a href>` links between pages
- **With JS (Users):** "Load More" button intercepts and loads content inline (preserving current UX)
- The `<a href>` pagination links can be visually hidden when JS is active but MUST remain in the DOM

### What NOT to Do

- Do NOT use `?page=2` query params (breaks static generation)
- Do NOT rely on `rel="next/prev"` (Google ignores them)
- Do NOT use fragment identifiers (`#page-2`) for pagination (Google ignores fragments)
- Do NOT make the "Load More" button the only way to discover posts
- Do NOT set page 1 as the canonical for all paginated pages (each page is its own canonical)

---

## Sources

- [Google Search Central: Pagination Best Practices](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)
- [Google Search Central: JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google Search Central: Infinite Scroll Recommendations](https://developers.google.com/search/blog/2014/02/infinite-scroll-search-friendly)
- [Search Engine Land: Pagination and SEO 2025](https://searchengineland.com/pagination-seo-what-you-need-to-know-453707)
- [Semrush: Pagination and SEO Complete Guide](https://www.semrush.com/blog/pagination-seo/)
- [Yoast: Google Doesn't Use rel=prev/next](https://yoast.com/google-doesnt-use-rel-prev-next-for-pagination/)
- [Journey Further: Pagination Links in 2025](https://www.journeyfurther.com/articles/how-does-google-handle-pagination-links-in-2025)
- [Gray Dot Co: Pagination SEO Guide](https://thegray.company/blog/pagination-seo-guide)
- [Melt Digital: SEO-Friendly Pagination Examples](https://www.meltdigital.com/knowledge-hub/seo-friendly-pagination-practical-examples-using-load-more-and-infinite-scroll)
- [Build with Matija: searchParams Static Generation Fix](https://www.buildwithmatija.com/blog/nextjs-searchparams-static-generation-fix)
- [Next.js Docs: generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js Learn: Adding Search and Pagination](https://nextjs.org/learn/dashboard-app/adding-search-and-pagination)
- [Vercel: Pagination with SSG Template](https://vercel.com/templates/next.js/pagination-with-ssg)
- [GitHub Discussion: searchParams Prevents ISR](https://github.com/vercel/next.js/discussions/58884)
- [ClickRank: Pagination SEO Ultimate 2026 Guide](https://www.clickrank.ai/pagination-in-seo/)
- [Shopify: Pagination SEO Best Practices 2025](https://www.shopify.com/blog/pagination-seo)
- [Rush Analytics: Internal Links Per Page](https://rush-analytics.com/blog/how-many-internal-links-per-page-seo)
- [Matthew Edgar: How Bots Render Pages](https://www.matthewedgar.net/rendering-how-bots-see-your-pages/)
- [Chris Berkley: Pagination vs Incremental Loading](https://chrisberkley.com/blog/pagination-vs-incremental-page-loading-for-search-engine-crawlability/)
