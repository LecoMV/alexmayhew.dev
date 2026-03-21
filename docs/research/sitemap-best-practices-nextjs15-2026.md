# Sitemap Best Practices — Next.js 15 & Google (2026)

**Status:** CURRENT
**Session:** Enterprise-grade sitemap audit for alexmayhew.dev

---

## 1. Which Pages to Include

**Google's official position:** Include only URLs that you want to see in Google's search results. The sitemap is a _hint_ about canonical URLs — it doesn't guarantee crawling or indexing.

**Rules (from Google Search Central docs):**

- Include only canonical URLs. Do NOT include duplicate or alternate URLs for the same content — this wastes crawl budget without improving indexing.
- Exclude URLs disallowed by robots.txt (Googlebot can't fetch them).
- Exclude URLs that return errors (4xx, 5xx).
- Exclude paginated pages beyond page 1 unless each has unique value.
- Exclude thin content pages (tag pages, search results, etc.).
- Exclude admin/auth-gated pages (they won't be indexed regardless).

**For alexmayhew.dev:**
All current pages in `sitemap.ts` are appropriate candidates (static pages, blog, services, tools, roles, newsletter, case studies). The `/docs` hub entry is correct but the individual docs pages are missing — see section 2.

---

## 2. Fumadocs — Including All Docs Pages Dynamically

The `source.generateParams()` function (from `fumadocs-core/source`) already exists for use in `generateStaticParams()` in the docs route. The same source can be used in `sitemap.ts` to enumerate all docs pages.

**Pattern to add docs pages to sitemap.ts:**

```typescript
import { source } from "@/lib/source";

// Inside sitemap():
const docsPages: MetadataRoute.Sitemap = source.getPages().map((page) => ({
	url: `${siteUrl}${page.url}`, // page.url is already absolute path like /docs/...
	lastModified: siteLastUpdated,
	changeFrequency: "monthly" as const,
	priority: 0.6,
}));
```

`source.getPages()` returns all docs pages loaded by the Fumadocs loader. Each page has a `url` property that reflects the `baseUrl` set in the loader (`/docs` in this codebase).

**Important:** `source` from `@/lib/source` is a server-side API. It can be imported directly in `sitemap.ts` since `sitemap.ts` runs at build time as a Route Handler (server-only).

**Why the current sitemap is incomplete:** `sitemap.ts` includes only `${siteUrl}/docs` (the index page) but not individual docs pages like `/docs/traceforge/getting-started`. These are missing from sitemap submission.

---

## 3. Tool/Product Pages in Sitemap

**Should be included.** Tool pages (`/tools/traceforge`, `/tools/pilot`) are high-value conversion pages — they should be indexed and prioritized accordingly.

**Current sitemap already includes them** with priority 0.9–0.95, which is appropriate. Tool landing pages are equivalent in SEO value to service pages.

**Priority guidance (relative, not absolute):**

- Homepage: 1.0
- Core conversion pages (services, tools): 0.9–0.95
- Blog hub, /for/ pages, technology hubs: 0.8–0.9
- Individual blog posts (spokes): 0.7
- Hub blog posts: 0.85–0.9
- Docs pages: 0.5–0.6 (reference, not conversion)
- Legal (privacy, terms): 0.3

---

## 4. `lastmod` — Actual Date vs Fixed Date

**Google's definitive answer (from the 2023 Google Search Central blog post on sitemaps):**

> "If your page changed 7 years ago, but you're telling us in the lastmod element that it changed yesterday, eventually we're not going to believe you anymore."

**Rules:**

1. `lastmod` is USEFUL — Google uses it as a signal for scheduling recrawls. This was confirmed in the same 2023 post where Google deprecated the ping endpoint.
2. Use actual content modification dates, not a global fixed date for dynamic content.
3. "Last modification" means **last significant modification** — primary text changes, structured data updates, link changes. NOT: footer copyright updates, sidebar tweaks, CSS changes.
4. If you don't know when a page was last modified (e.g., an aggregation page), omit `lastmod` for that URL rather than using an inaccurate value.
5. A fixed date that doesn't change is acceptable for truly static pages (privacy policy, terms), but a global `siteLastUpdated` applied to frequently-updated content is a credibility risk.

**Assessment of current `sitemap.ts`:**

- Blog posts: CORRECT — uses `post.updatedAt ?? post.publishedAt` (actual dates)
- Newsletter issues: CORRECT — uses `issue.publishedAt`
- Static pages with `new Date("2026-03-14")`: ACCEPTABLE — but update this date whenever you actually update those pages
- Service/migration/comparison/role pages using global `siteLastUpdated`: ACCEPTABLE if those pages don't change often, but consider tracking actual update dates in the data layer

---

## 5. `changeFrequency` and `priority` — Include or Omit?

**Google's confirmed position (official docs + 2023 blog post):**

> "Google ignores `<priority>` and `<changefreq>` values."

This is not speculation — it's stated directly in the Google Search Central build-sitemap documentation page.

**Should you still include them?**

YES, for these reasons:

1. **Bing uses them.** Bing, DuckDuckGo, Yandex, and other crawlers still use `priority` and `changeFrequency` as crawl scheduling hints.
2. **No cost.** They add bytes but no crawl overhead or penalty.
3. **Next.js generates them by default** via `MetadataRoute.Sitemap` — no reason to fight the framework.
4. **Documentation value** — they communicate intent to future maintainers about relative page importance.

**Recommendation:** Keep them. They are already correctly set in the current `sitemap.ts`.

---

## 6. Single Sitemap vs Sitemap Index Files

**Google's threshold:** Single sitemap is limited to 50MB uncompressed or 50,000 URLs. Sitemap index is only required above those limits.

**For 100–500 pages:** Single sitemap file is the correct approach. No sitemap index needed.

**alexmayhew.dev page count estimate:**

- Static pages: ~12
- Blog posts: 44
- Service pages: ~20–50 (pSEO)
- Migration/integration/comparison pages: ~30–60 combined
- Technology pages: ~15–25
- Role pages: ~5–10
- Newsletter issues: ~10–20
- Case studies: ~5–10
- Docs pages: ~10–30

**Total estimate: 150–260 pages.** Well within the 50,000 URL single-sitemap limit. No sitemap index required now or in the foreseeable future.

**Optional pattern for organization** (not required): Some teams split by content type (e.g., `app/blog/sitemap.ts`, `app/docs/sitemap.ts`) for cleaner Search Console reporting. Next.js supports nested `sitemap.ts` files per route segment. Only worth doing if you want per-section crawl analytics in Search Console.

---

## 7. Image Sitemaps

**Google's guidance (from image-sitemaps docs):**

Image sitemaps help Google discover images that might not otherwise be found — specifically images loaded via JavaScript or lazy-loading that Googlebot's crawler might not execute.

**Format:** Extend the standard XML sitemap with `<image:image>` namespace:

```xml
<url>
  <loc>https://example.com/blog/post-slug</loc>
  <image:image>
    <image:loc>https://example.com/images/blog/post-slug-featured.webp</image:loc>
  </image:image>
</url>
```

**Next.js 15 support — CONFIRMED:** The `MetadataRoute.Sitemap` type supports an `images` property. The TypeScript type definition (verified from `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts`) is:

```typescript
type SitemapFile = Array<{
	url: string;
	lastModified?: string | Date | undefined;
	changeFrequency?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never"
		| undefined;
	priority?: number | undefined;
	alternates?: { languages?: Languages<string> | undefined } | undefined;
	images?: string[] | undefined; // <-- native support
	videos?: Videos[] | undefined;
}>;
```

Usage (the `images` value is `string[]` — array of fully-qualified image URLs):

```typescript
{
  url: `${siteUrl}/blog/${slug}`,
  lastModified: post.updatedAt ?? post.publishedAt,
  changeFrequency: "monthly" as const,
  priority: post.isHub ? 0.9 : 0.7,
  images: [`${siteUrl}/images/blog/${slug}-featured.webp`],
}
```

Next.js generates the correct `<image:image><image:loc>` XML output automatically — no custom XML needed.

**Implementation pattern for blog posts in `sitemap.ts`:**

```typescript
// Blog posts with image sitemap entries
const blogPosts: MetadataRoute.Sitemap = blog
	.filter((post) => !post.draft)
	.map((post) => {
		const slug = getSlug(post.info.path);
		return {
			url: `${siteUrl}/blog/${slug}`,
			lastModified: post.updatedAt ?? post.publishedAt,
			changeFrequency: "monthly" as const,
			priority: post.isHub ? 0.9 : 0.7,
			images: [`${siteUrl}/images/blog/${slug}-featured.webp`],
		};
	});
```

**Note:** Since every blog post has a featured image at a predictable path (`/images/blog/{slug}-featured.webp`), this is safe to add unconditionally. If a post is missing its image, the sitemap entry still validates — Google simply won't crawl an image that returns 404.

**Should alexmayhew.dev use image sitemaps?**

Conditionally. Featured images for blog posts are static WebP files at predictable paths (`/images/blog/{slug}-featured.webp`). Since these are standard `<img>` tags rendered server-side (not JS-loaded), Googlebot will discover them via page crawl. Image sitemaps would be most valuable if:

- Images are loaded via JavaScript
- Images are hosted on a CDN subdomain (Googlebot may not follow cross-origin lazy-load)
- You want Google Image Search indexing for portfolio/case study screenshots

**Verdict:** Not required for SEO correctness, but adding featured blog post images to the sitemap is low-cost and provides a Google Image Search signal. Can be added with a one-line change per blog post entry.

---

## 8. Sitemap URLs Must Match Canonical URLs

**This is a Google requirement, not a recommendation:**

> "Include the URLs in your sitemap that you want to see in Google's search results. Google generally shows the canonical URLs in its search results, which you can influence with sitemaps."

**Rules:**

1. URLs in sitemap must be fully-qualified absolute URLs (`https://alexmayhew.dev/blog/post-slug`, not `/blog/post-slug`).
2. Must match the `<link rel="canonical">` tag on the page exactly (protocol, www/non-www, trailing slash consistency).
3. If canonical is `https://alexmayhew.dev/blog/post` (no trailing slash), the sitemap entry must also have no trailing slash.
4. If you have both HTTP and HTTPS, only list HTTPS.

**Assessment of current `sitemap.ts`:** Uses `const siteUrl = "https://alexmayhew.dev"` and constructs URLs as `${siteUrl}/path` (no trailing slash). This is correct as long as canonical tags on pages also use no trailing slash. Verify this is consistent with the `canonicalUrl` setup documented in `docs/research/nextjs-canonical-url-best-practices-2026.md`.

---

## 9. Dynamically Generated Pages with `generateStaticParams`

Pages using `generateStaticParams` are statically generated at build time. Their URLs are known at build time, making them straightforward to include in `sitemap.ts`.

**Pattern:** Access the same data source used in `generateStaticParams` from `sitemap.ts`.

For the current codebase:

- `blog` (from `.source/server`) — already used in sitemap ✓
- `newsletter` (from `.source/server`) — already used in sitemap ✓
- `source.generateParams()` (Fumadocs docs) — NOT yet used in sitemap (gap)
- pSEO functions (`getPublishedPages()`, etc.) — already used in sitemap ✓
- `getTechnologyIds()` — already used in sitemap ✓
- `getPublishedRolePages()` — already used in sitemap ✓
- `getCaseStudyProjects()` — already used in sitemap ✓

**The single gap is docs pages.** See section 2 for the fix.

---

## 10. Auto-Resubmit Sitemap After Deploy via CI/CD

**Critical context: Google removed the ping endpoint in 2023.**

The old approach of `curl https://google.com/ping?sitemap=...` returns 404 and does nothing. Bing removed its anonymous ping in May 2022 as well.

**Current recommended approaches:**

### Option A: robots.txt (recommended — zero maintenance)

Add the sitemap URL to `robots.txt`. Google re-reads `robots.txt` on each crawl cycle and will discover the sitemap automatically. This is passive but reliable.

```
Sitemap: https://alexmayhew.dev/sitemap.xml
```

Check the current `robots.ts` in the project to confirm this is already set.

### Option B: Search Console API (active resubmission)

Requires OAuth2 service account. Useful for forcing re-crawl after major structural changes.

```bash
# Endpoint:
PUT https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}

# Example:
curl -X PUT \
  "https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Falexmayhew.dev%2F/sitemaps/https%3A%2F%2Falexmayhew.dev%2Fsitemap.xml" \
  -H "Authorization: Bearer $GSC_ACCESS_TOKEN"
```

**Important:** Google itself says resubmission is not needed on every deploy. Only resubmit when:

- You add a large batch of new URLs
- You migrate site structure
- You launch a new content section

For a portfolio site deploying 1–2 new blog posts per month, `robots.txt` reference is sufficient. The sitemap is re-read periodically regardless.

### Option C: IndexNow (Bing + other engines)

IndexNow is a protocol that notifies Bing, Yandex, and other engines (not Google) of new/updated URLs instantly. Bing removed anonymous ping in favor of IndexNow.

```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "alexmayhew.dev",
    "key": "YOUR_INDEXNOW_KEY",
    "urlList": ["https://alexmayhew.dev/blog/new-post"]
  }'
```

This can be integrated into GitHub Actions post-deploy for Bing indexing speed. Key must be hosted at `https://alexmayhew.dev/{key}.txt`.

---

## Summary: Gaps in Current `sitemap.ts`

| Issue                                           | Impact                                        | Fix                                               |
| ----------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| Docs pages not enumerated                       | Missing ~10–30 URLs from sitemap              | Add `source.getPages()` map to sitemap.ts         |
| Global `siteLastUpdated` for service/role pages | Minor — reduces lastmod credibility over time | Track actual update dates in data layer           |
| No image sitemap for blog posts                 | Minor — images are discoverable via crawl     | Optional: add `images` array to blog post entries |
| robots.txt sitemap reference                    | Verify this exists                            | Check `src/app/robots.ts`                         |

---

## Sources

- [Build and Submit a Sitemap — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [What Is a Sitemap — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Sitemaps Ping Deprecation + lastmod guidance — Google Search Central Blog (2023)](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)
- [Image Sitemaps — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
- [Manage Large Sitemaps / Sitemap Index Files — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)
- [sitemap.xml File Convention — Next.js 15 Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [generateSitemaps Function — Next.js Docs](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)
- [Fumadocs Loader API — source.getPages(), source.generateParams()](https://www.fumadocs.dev/docs/headless/source-api)
- [Search Console Sitemaps API — submit endpoint](https://developers.google.com/webmaster-tools/v1/sitemaps/submit)
- [Google ignores priority and changefreq — seocomponent.com](https://www.seocomponent.com/blog/ignore-priority-changefreq-fields-sitemap/)
