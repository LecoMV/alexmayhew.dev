# Next.js 15 App Router Canonical URL Best Practices (2026-03-14, updated 2026-03-19)

**Status:** CURRENT
**Session:** Researched for canonical audit of alexmayhew.dev — updated with deep-dive answers on 8 specific questions

## Sources

- Next.js official docs: `generateMetadata` (last updated 2026-02-27)
- Google Search Central: "How to specify a canonical URL" — [consolidate-duplicate-urls](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) (extracted directly 2026-03-19)
- Google Search Central: "What is URL Canonicalization" — [canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization) (extracted directly 2026-03-19)
- Live audit of `/home/deploy/projects/amdev/alexmayhew-dev/src/app/` (verified 2026-03-19)

---

## 1. Does `metadata.alternates.canonical` cascade from root layout?

**Answer: No. `alternates` is NOT inherited across segments — it is replaced (overwritten) on merge.**

Next.js metadata merges **shallowly**. From the official docs (Merging section):

> Metadata objects exported from multiple segments in the same route are **shallowly** merged
> together to form the final metadata output of a route. Duplicate keys are **replaced** based
> on their ordering.
>
> This means metadata with nested fields such as `openGraph` and `robots` that are defined in
> an earlier segment are **overwritten** by the last segment to define them.

Critically: **inheritance only happens when a child segment does NOT export the same top-level key.**
If `app/layout.tsx` exports `alternates: { canonical: '/' }`, and `app/about/page.tsx` exports
`alternates: { types: { ... } }` (without a `canonical` key), then the entire `alternates` object
from the layout is **replaced** — the `canonical` disappears.

If `app/about/page.tsx` exports **no `alternates` key at all**, the layout's `alternates` object
is fully inherited. However, that layout canonical (`'/'` = `https://alexmayhew.dev`) would be
wrong for `/about`.

**Conclusion: Setting canonical in root layout is actively harmful for child pages. Every page
that needs a distinct canonical must set it explicitly.**

---

## 2. Correct pattern for per-page canonical URLs

### Static pages

```typescript
// src/app/about/page.tsx
export const metadata: Metadata = {
	title: "About",
	alternates: {
		canonical: "/about", // relative path — metadataBase resolves to https://alexmayhew.dev/about
	},
};
```

Because `metadataBase: new URL('https://alexmayhew.dev')` is set in `app/layout.tsx`, any
relative path in a child's `alternates.canonical` resolves correctly. The layout's `metadataBase`
IS inherited (it's set at the top-level metadata object, not inside `alternates`).

### Dynamic routes

```typescript
// src/app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
	const { slug } = await params;
	return {
		alternates: {
			canonical: `/blog/${slug}`, // relative path is fine with metadataBase set
		},
	};
}
```

The site currently uses absolute URLs (`${siteUrl}/blog/${slug}`) in dynamic routes. Both are
correct — absolute takes precedence over metadataBase; relative relies on metadataBase. Either
works, but **be consistent**. Since `metadataBase` is set, relative paths are cleaner and reduce
the `siteUrl` constant duplication.

---

## 3. `metadataBase` interaction with canonical

From the docs:

> `metadataBase` is typically set in root `app/layout.js` to apply to URL-based `metadata`
> fields **across all routes**.
>
> If a `metadata` field provides an absolute URL, `metadataBase` will be ignored.

**URL resolution table** (with `metadataBase: new URL('https://alexmayhew.dev')`):

| `canonical` value                | Resolved URL                                          |
| -------------------------------- | ----------------------------------------------------- |
| `'/'`                            | `https://alexmayhew.dev`                              |
| `'/about'`                       | `https://alexmayhew.dev/about`                        |
| `'about'`                        | `https://alexmayhew.dev/about`                        |
| `'https://alexmayhew.dev/about'` | `https://alexmayhew.dev/about` (metadataBase ignored) |

Trailing slashes: Next.js **normalizes duplicate slashes** between metadataBase and the relative
path. `metadataBase = 'https://alexmayhew.dev/'` + `'/about'` → `'https://alexmayhew.dev/about'`.

**Both relative (`'/about'`) and absolute (`'https://alexmayhew.dev/about'`) are correct.
The site already uses absolute on dynamic pages — be consistent and use relative on static pages
OR switch all to absolute. Do not mix randomly.**

---

## 4. Trailing slash considerations

- `next.config.mjs` has **no `trailingSlash` config** → default is `false` (Next.js serves
  pages without trailing slash, redirects trailing-slash requests to non-trailing-slash)
- Cloudflare Pages respects this via OpenNext
- Canonical URLs should therefore be **without trailing slash** (consistent with what Next.js serves)
- Google treats `https://alexmayhew.dev/about` and `https://alexmayhew.dev/about/` as different
  URLs. Having canonical point to the correct (no-slash) version prevents accidental duplicate
  indexing from crawlers following slash variants

---

## 5. Should static pages like /about, /contact, /privacy have explicit canonicals?

**Google's 2025 guidance:** Canonicals are NOT required. Google will infer canonicals on its own.
However, explicit self-referencing canonicals are a strong signal and best practice because:

1. **Consolidates link signals** — any inbound links to URL variants (www, http, query params)
   get consolidated to the canonical
2. **Prevents accidental duplicate indexing** — e.g., if a CDN or crawler adds `?utm_source=...`
3. **Explicit beats implicit** — Google says it "identifies which version is objectively best,"
   but it can get this wrong without hints
4. **Low cost, high certainty** — adding 2 lines per page file eliminates an entire class of
   indexing ambiguity

From Google docs:

> While we encourage you to use these methods, none of them are required; your site will likely
> do just fine without specifying a canonical preference.

However, also from Google:

> Use absolute paths rather than relative paths with the `rel="canonical"` link element.
> Even though relative paths are supported by Google, they can cause problems in the long run
> (for example, if you unintentionally allow your testing site to be crawled).

**For alexmayhew.dev**: Given this is a lead generation site where indexing quality directly
affects business outcomes, adding explicit self-referencing canonicals to all ~20 pages is
the right call.

---

## 6. Self-referencing canonicals: every page vs. ambiguous pages only

**Best practice: every page, without exception.**

Reasons:

- You cannot predict which URLs Google will discover first or which variants crawlers will generate
- Query strings, UTM parameters, Cloudflare challenge pages, CDN variants can all create
  perceived duplicates
- The overhead is two lines of TypeScript per page file
- Google explicitly recommends it for any site where canonical signals matter

The standard industry practice (2025): every page has `alternates.canonical` pointing to itself.
Pages with confirmed no duplicates can omit it, but the default should be explicit.

---

## 7. Current site audit — what has canonicals, what doesn't

### Has explicit canonical (14 pages/routes)

- `/blog` (`blog/page.tsx`)
- `/blog/[slug]` — absolute URL
- `/technologies` — absolute URL
- `/technologies/[slug]` — absolute URL
- `/services/[slug]` — absolute URL
- `/services/comparisons/[slug]` — absolute URL
- `/services/integrations/[slug]` — absolute URL
- `/services/migrations/[slug]` — absolute URL
- `/work/[slug]` — absolute URL
- `/for/[role]` — absolute URL

### Missing canonical (9 static pages)

- `/` — `src/app/page.tsx` (homepage — highest priority)
- `/about` — `src/app/about/page.tsx`
- `/contact` — `src/app/contact/page.tsx`
- `/services` — `src/app/services/page.tsx`
- `/for` — `src/app/for/page.tsx`
- `/work` — `src/app/work/page.tsx`
- `/tools` — `src/app/tools/page.tsx`
- `/newsletter` — `src/app/newsletter/page.tsx` (has `alternates.types` but no `canonical`)
- `/privacy` — `src/app/privacy/page.tsx`
- `/terms` — `src/app/terms/page.tsx`

Also check:

- `/tools/traceforge`, `/tools/pilot`, `/tools/voice-cloner` — tool sub-pages
- `/newsletter/[slug]` — newsletter detail pages

### Root layout (`app/layout.tsx`)

The root layout has `alternates: { types: { 'application/rss+xml': ... } }` but **no canonical**.
This is correct — do NOT add canonical to the root layout (it would cascade to pages that
don't override it and could set the homepage canonical on child pages that inherit the full
`alternates` object).

---

## 8. Recommended implementation pattern

### For static pages (copy-paste pattern)

```typescript
// Relative path — cleanest with metadataBase set in root layout
alternates: {
  canonical: "/about",  // replace with actual path
},
```

For pages that already have `alternates.types` (like newsletter), merge:

```typescript
alternates: {
  canonical: "/newsletter",
  types: {
    "application/rss+xml": `${siteUrl}/feed.xml`,
  },
},
```

### For dynamic routes (already handled, but note the pattern)

```typescript
// In generateMetadata:
alternates: {
  canonical: `/${routeSegment}/${slug}`,  // relative, or keep absolute — be consistent
},
```

### Do NOT set canonical in root layout

The root layout `alternates` object should only contain the RSS feed type declaration.
If you add `canonical: '/'` to the root layout, any child page that doesn't explicitly
set `alternates` will inherit `canonical: 'https://alexmayhew.dev'` (homepage URL) — wrong
for every non-homepage page.

---

## 9. Consistency note: absolute vs. relative

The site currently uses a mix:

- `blog/page.tsx`: `"https://alexmayhew.dev/blog"` (absolute hardcoded string)
- `technologies/page.tsx`: `` `${siteUrl}/technologies` `` (absolute template literal)
- `blog/[slug]/page.tsx`: `` `${siteUrl}/blog/${slug}` `` (absolute template literal)

For new static pages, prefer **relative paths** (`"/about"`) — they are shorter, rely on
`metadataBase` correctly, and eliminate the `siteUrl` constant duplication. Do not change
existing ones unless doing a full audit pass — consistency within a file matters more than
cross-file consistency.

---

## Key Findings Summary

1. **Canonical does NOT cascade** from root layout to child pages when the child sets any
   `alternates` key — the whole object is replaced. When child sets NO `alternates`, it
   inherits the layout's — but inherited canonical from layout would be wrong (homepage URL).

2. **Per-page explicit canonical is the correct pattern** in Next.js App Router. Use
   `alternates: { canonical: '/path' }` in every page's `metadata` export.

3. **`metadataBase` in root layout + relative canonical paths** is the cleanest approach.
   Absolute URLs also work and override `metadataBase`.

4. **No trailing slash** — Next.js default, Cloudflare Pages default. Canonicals should
   match: `/about` not `/about/`.

5. **9 static pages** on alexmayhew.dev currently lack canonical declarations. Homepage
   is highest priority to fix.

6. **Google's position**: canonicals are strongly recommended but not required. For a lead
   generation site, explicit self-referencing canonicals on all pages is the right call.

7. **Never add canonical to root layout** — it will be wrong for every child page that
   inherits `alternates` without overriding.

---

## 10. Google's Exact Wording: Absolute vs. Relative Paths

From the live Google Search Central documentation (extracted 2026-03-19):

> Use absolute paths rather than relative paths with the `rel="canonical"` link element.
> Even though relative paths are supported by Google, they can cause problems in the long run
> (for example, if you unintentionally allow your testing site to be crawled) and thus
> **we don't recommend them**.
>
> **Good example**: `https://www.example.com/dresses/green/green-dress.html`
> **Bad example**: `/dresses/green/green-dress.html`

**Implication for alexmayhew.dev:** Next.js resolves relative canonical paths to absolute
URLs in the rendered HTML (via `metadataBase`). The `<link rel="canonical">` tag in the
actual HTML output is always absolute — so using `canonical: "/about"` in TypeScript is fine.
The concern about relative paths applies to raw HTML canonical tags, not to the value passed
to the Next.js metadata API. Verify this for your setup with `curl https://alexmayhew.dev/about | grep canonical`.

**Practical rule:** Pass relative paths to `alternates.canonical` in Next.js (cleaner code),
but verify that `metadataBase` is always set in root layout so Next.js renders absolute URLs.

---

## 11. What Google Does When No Canonical Is Set

From Google's canonicalization documentation (extracted 2026-03-19):

> If you don't specify a canonical URL, Google will identify which version of the URL is
> objectively the best version to show to users in Search.
>
> When Google finds multiple pages that seem to be the same or the primary content very
> similar, it chooses the page that, based on the factors (or signals) the indexing process
> collected, is objectively the most complete and useful for search users, and marks it
> as canonical.

**Canonicalization signals Google uses without an explicit canonical:**

- HTTPS over HTTP (strong preference)
- Presence in sitemap (weak signal)
- hreflang cluster membership
- Internal link consistency (link to canonical from other pages)
- Redirect targets

**Risk without explicit canonicals:**

- Google may choose a URL variant you did not intend (with UTM params, trailing slash,
  or a Cloudflare `.pages.dev` mirror)
- Tracking in GSC becomes fragmented (signals split across URL variants)
- Link equity from external sites pointing to non-canonical variants is not reliably
  consolidated without the explicit hint
- On alexmayhew.dev specifically: the `.pages.dev` preview URL is accessible — without
  explicit canonicals AND the `X-Robots-Tag: noindex` middleware on `.pages.dev`, Google
  could choose a `.pages.dev` URL as canonical

**Google's guarantee:** "Your site will likely do just fine without specifying a canonical
preference." This is accurate for straightforward sites with no duplicate-URL risk. For
alexmayhew.dev (a lead generation site with a live `.pages.dev` mirror, UTM traffic, and
pSEO pages), explicit canonicals are the correct defense.

---

## 12. Dynamic Route Canonical Patterns

### `/blog/[slug]` — already implemented correctly

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
	const { slug } = await params;
	return {
		alternates: {
			canonical: `/blog/${slug}`, // resolves to https://alexmayhew.dev/blog/[slug]
		},
	};
}
```

### `/newsletter/[slug]` — MISSING canonical (verified 2026-03-19)

Current `generateMetadata` returns title, description, openGraph but no `alternates.canonical`.
Fix:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const issue = newsletter.find((i) => getSlug(i.info.path) === slug);
	if (!issue) return {};
	return {
		title: `${issue.title} | The Architect's Brief`,
		description: issue.subject,
		alternates: {
			canonical: `/newsletter/${slug}`, // ADD THIS
		},
		openGraph: {
			title: issue.title,
			description: issue.subject,
			type: "article",
			publishedTime: issue.publishedAt.toISOString(),
		},
	};
}
```

### `/docs/[[...slug]]` — Fumadocs catch-all route (MISSING canonical, verified 2026-03-19)

Current `generateMetadata` in `src/app/docs/[[...slug]]/page.tsx` returns title and description
only. No `alternates.canonical`. The slug is an array (optional catch-all).

Fix:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = source.getPage(slug);
	if (!page) return {};

	// slug is string[] | undefined — build the path correctly
	const canonicalPath = slug && slug.length > 0 ? `/docs/${slug.join("/")}` : "/docs";

	return {
		title: `${page.data.title} | Docs`,
		description: page.data.description,
		alternates: {
			canonical: canonicalPath,
		},
	};
}
```

**Should docs pages have canonicals?** Yes. Fumadocs integrates with the standard Next.js
metadata API — there is nothing special about docs pages from a canonicalization standpoint.
Each `/docs/[path]` URL is a distinct page that can be discovered by crawlers. Without a
canonical, Google will attempt to canonicalize it automatically. Since docs pages use
catch-all routing (`[[...slug]]`), there is potential for:

- `/docs` vs `/docs/` (trailing slash variant)
- Fumadocs-generated sidebar links potentially creating path variants
- Shared doc content appearing at multiple URLs if deep-linking to sections

Explicit canonicals on docs pages cost two lines of TypeScript per route file and eliminate
this ambiguity entirely.

---

## 13. Tool Pages: Self-Referencing Canonicals

Verified state (2026-03-19):

- `/tools` — HAS canonical: `"/tools"` (correct)
- `/tools/traceforge` — NO canonical (metadata has title, description, keywords but no `alternates`)
- `/tools/pilot` — NO canonical (same)
- `/tools/voice-cloner` — NO canonical (same)

**Should tool pages have self-referencing canonicals?** Yes, for the same reasons as any
other public page:

- These pages have unique content (distinct tools) and may receive inbound links
- Without canonicals, Google must decide which URL variant is authoritative
- These pages are accessible and crawlable — they need canonical signals

Pattern to add to each tool page:

```typescript
// /tools/traceforge/page.tsx
export const metadata: Metadata = {
	title: "TraceForge",
	description: "...",
	alternates: {
		canonical: "/tools/traceforge", // ADD THIS
	},
	// ... rest of metadata
};
```

---

## 14. Layout vs. Per-Page Canonical: The Definitive Answer

**Never set canonical in a layout. Always set it per page.**

The argument for layout-level canonicals ("set it once, inherit everywhere") fails because:

1. Metadata `alternates` is shallowly replaced, not merged, when a child sets any `alternates` key
2. A layout canonical of `/parent-path` is wrong for every child page under it
3. Even with no child override, the inherited URL would be the layout's path, not the page's path
4. There is no mechanism in Next.js App Router to set "each page gets its own path as canonical"
   at the layout level — that logic must live in each page's `metadata` or `generateMetadata`

**Setting canonical in a shared layout is an antipattern with no safe use case on this site.**

The one partial exception is the docs layout — you could add a `generateMetadata` to
`src/app/docs/layout.tsx` to set some shared metadata, but canonical still must be set in
`[[...slug]]/page.tsx` because only the page file knows the actual slug.

---

## 15. Updated Page Audit (2026-03-19)

### Has explicit canonical

- `/` (homepage) — relative `"/"`
- `/tools` — relative `"/tools"`
- `/blog` — absolute hardcoded
- `/blog/[slug]` — absolute template literal
- `/technologies` — absolute template literal
- `/technologies/[slug]` — absolute template literal
- `/services/[slug]` — absolute template literal
- `/services/comparisons/[slug]` — absolute template literal
- `/services/integrations/[slug]` — absolute template literal
- `/services/migrations/[slug]` — absolute template literal
- `/work/[slug]` — absolute template literal
- `/for/[role]` — absolute template literal

### Still missing canonical (requires fix)

- `/about`
- `/contact`
- `/services`
- `/for`
- `/work`
- `/newsletter` — has `alternates.types` but no `alternates.canonical`
- `/privacy`
- `/terms`
- `/tools/traceforge`
- `/tools/pilot`
- `/tools/voice-cloner`
- `/newsletter/[slug]` — `generateMetadata` has no `alternates`
- `/docs/[[...slug]]` — `generateMetadata` has no `alternates`
