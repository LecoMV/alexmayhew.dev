# Article JSON-LD Enterprise Best Practices (2026-03-19)

**Status:** CURRENT
**Session:** Deep-dive into Article structured data for ArticleJsonLd component reuse across blog posts and newsletter issues — mainEntityOfPage, publisher type, author @id, isPartOf, speakable, and schema type selection.

---

## 1. Google's Required vs Recommended Fields (Current as of Dec 2025)

Google's official documentation is explicit: **there are no required properties for Article structured data**. Every field is recommended, not mandatory.

However, in practice, four properties are functionally required to be eligible for Article rich results (headline image, byline, and date in search):

| Property        | Status                                | Notes                                                       |
| --------------- | ------------------------------------- | ----------------------------------------------------------- |
| `headline`      | Effectively required for rich results | Max 110 chars; must match H1 semantically                   |
| `image`         | Effectively required for rich results | Min 696px wide; 1200px optimal; supply 1:1, 4:3, 16:9 array |
| `datePublished` | Effectively required for rich results | ISO 8601 with timezone                                      |
| `author`        | Effectively required for rich results | `name` minimum; `url` strongly recommended                  |

Recommended properties that carry meaningful SEO/AI weight:

| Property         | Notes                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| `author.url`     | Added to Google docs Aug 2025 — helps disambiguation                      |
| `dateModified`   | Critical for evergreen content; without it Google treats content as stale |
| `publisher`      | Required in practice for rich results (name + logo); see section 3        |
| `headline`       | Must be in markup even if using inline rendering                          |
| `description`    | Not a Google rich-result field, but parsed by AI systems                  |
| `articleSection` | Maps to content category — useful for topical authority signals           |
| `keywords`       | Parsed by AI systems; not a Google ranking signal                         |
| `inLanguage`     | Important for multilingual sites                                          |

Source: [Google Article Structured Data](https://developers.google.com/search/docs/appearance/structured-data/article) (last updated 2025-12-10)

---

## 2. `mainEntityOfPage` — Correct Usage, Parameterization, and Broken URL Impact

### What it means

`mainEntityOfPage` is the inverse of `mainEntity`. It declares that the current page is the **canonical, authoritative source** that primarily describes this entity. It links the Article (a Thing) to the WebPage (a CreativeWork) on which it is displayed.

The correct value is always the **canonical URL of the page this article appears on** — not a homepage, not a parent page, not a blog index.

### The two valid forms

**Form 1 — Simple URL string (schema.org canonical form):**

```json
"mainEntityOfPage": "https://alexmayhew.dev/blog/my-post-slug"
```

**Form 2 — WebPage object with @id (preferred for @graph implementations):**

```json
"mainEntityOfPage": {
  "@type": "WebPage",
  "@id": "https://alexmayhew.dev/blog/my-post-slug"
}
```

Form 2 is preferred when you are using `@graph` with a separate WebPage node, because the `@id` cross-reference resolves within the graph. Form 1 is correct and sufficient for standalone (non-@graph) Article scripts.

### What happens when it points to a non-existent or wrong URL

This is a real problem. One documented case study (`blog.bmarwell.de`, March 2026) confirmed that pointing `mainEntityOfPage` to the wrong URL (e.g., the homepage instead of the article page) was identified as a cause of "crawled, not indexed" status. The analysis noted:

> "Since Google's data parser likely treats JSON-LD data like compiled code (use everything or nothing at all if something is broken), this easy fix should have a high impact on being indexed."

Additional confirmed behaviors:

- **Relative URLs are silently rejected** — they are never corrected, they are just dropped
- **Pointing to the homepage** instead of the article URL is "terribly wrong" per schema.org community — the article is not a part of the homepage, it is part of the article's own page
- **Pointing to a non-existent URL** (404) is treated as a dangling reference — the property is effectively ignored but does not generate a crawl error

### How to parameterize for reuse across content types

Always pass the canonical URL of the page being rendered, never hardcode a fallback:

```tsx
// Blog post
<ArticleJsonLd
  mainEntityOfPage={`https://alexmayhew.dev/blog/${post.slug}`}
  // ...
/>

// Newsletter issue (if published on the web at a stable URL)
<ArticleJsonLd
  mainEntityOfPage={`https://alexmayhew.dev/newsletter/${issue.slug}`}
  // ...
/>
```

The component should receive `mainEntityOfPage` as a required prop and never infer it from `usePathname()` or similar — Next.js App Router pages render at a known URL, pass it explicitly from the data layer.

---

## 3. `publisher` Type — Organization vs Person for Solo Consultants

### What Google's docs say

Google's example in the Article documentation always shows `publisher` as `Organization`:

```json
"publisher": {
  "@type": "Organization",
  "name": "The Daily Bug",
  "url": "https://www.example.com"
}
```

However, the schema.org `publisher` property definition accepts **both Organization and Person**. The Google documentation examples use Organization because they were written for news publishers and media companies.

### The real distinction

The `publisher` is the entity that controls the distribution and publication of the content — the entity whose domain the content lives on. For a solo consultant running their own site:

- You are simultaneously the `author` (Person) AND the `publisher` (Organization or Person)
- Using `Organization` does NOT require a registered legal entity — it just requires a name and URL
- Using `Person` as publisher is semantically valid per schema.org spec

### Recommended approach for alexmayhew.dev

**Use Organization for `publisher`, with your site as the entity.** Reasons:

1. Google's rich result processing is optimized for Organization publishers — their parser expects `publisher.name` and `publisher.logo` in Organization shape
2. The `logo` property is only defined on Organization in the context that Google's parser reads it
3. You can define the Organization with an `@id` pointing to `https://alexmayhew.dev/#organization` and reuse it across all pages
4. Author is separately marked as Person — this separation is semantically correct

```json
"publisher": {
  "@type": "Organization",
  "@id": "https://alexmayhew.dev/#organization",
  "name": "Alex Mayhew",
  "url": "https://alexmayhew.dev",
  "logo": {
    "@type": "ImageObject",
    "url": "https://alexmayhew.dev/images/logo.png",
    "width": 200,
    "height": 60
  }
}
```

On all article pages, this can be referenced by `@id` only once the Organization is defined on the root layout or homepage.

---

## 4. `author` as `@id` Reference vs Inline Object

### What the @id pattern does

When you define a Person entity once with a unique `@id`:

```json
{
	"@type": "Person",
	"@id": "https://alexmayhew.dev/#person",
	"name": "Alex Mayhew",
	"url": "https://alexmayhew.dev/about",
	"sameAs": ["https://linkedin.com/in/alexmayhew", "https://github.com/alexmayhew"]
}
```

...and then reference it on every article page as:

```json
"author": {
  "@id": "https://alexmayhew.dev/#person"
}
```

...search engines and AI parsers merge all article authorship signals into a **single entity node** rather than creating separate disconnected Person records per article. Googlebot has been documented to follow `@id` links to crawl their target URLs for additional entity context (observed since 2017, confirmed by Schema App research).

### Which is preferred for entity recognition

**@id reference is strongly preferred** for entity consolidation and Knowledge Graph performance. The inline object approach works for basic rich results but creates disconnected entity records:

| Approach                                | Rich Results | Entity Recognition             | AI Citation | Knowledge Graph |
| --------------------------------------- | ------------ | ------------------------------ | ----------- | --------------- |
| Inline object (full Person per article) | Works        | Poor — creates duplicate nodes | Marginal    | Fragmented      |
| @id reference                           | Works        | Strong — single entity node    | Strong      | Consolidated    |
| @id reference + sameAs on entity home   | Works        | Strongest                      | Strongest   | Authoritative   |

**Practical implementation for alexmayhew.dev:**

Define the full Person entity on the `/about` page. On every article, use only the `@id` reference. Google docs (Aug 2025 update) also recommend including `author.url` — this can be satisfied by making the `@id` point to the about page URL, or by adding `"url": "https://alexmayhew.dev/about"` alongside the `@id`.

The W3C JSON-LD 1.1 spec calls a node with only `@id` a "node reference" — it is fully valid and the parser will resolve it against any other node in the same `@graph` that has that `@id`.

---

## 5. `isPartOf` — Should Articles Reference the WebSite Entity?

### What isPartOf is for

`isPartOf` in Article context links the Article to the **WebPage** node it lives on — not to the WebSite directly. The hierarchy is:

```
WebSite
  └── WebPage (isPartOf → WebSite via its own isPartOf)
        └── Article (isPartOf → WebPage, mainEntityOfPage → WebPage)
```

### The Yoast reference implementation (industry standard)

Yoast SEO's schema output (the most widely deployed Article schema implementation on the web) treats these as required on Article:

```json
"isPartOf": {
  "@id": "https://www.example.com/blog/example-article/"
},
"mainEntityOfPage": {
  "@id": "https://www.example.com/blog/example-article/"
}
```

Both `isPartOf` and `mainEntityOfPage` point to the same WebPage `@id`. They serve different semantic purposes:

- `isPartOf`: the Article is a component/part of this WebPage (structural containment)
- `mainEntityOfPage`: this WebPage's primary subject is this Article (semantic primacy)

### Should you implement isPartOf on alexmayhew.dev?

**Yes, if using @graph.** If your ArticleJsonLd is part of a `@graph` that also contains a WebPage node, `isPartOf` with the WebPage's `@id` is a meaningful signal.

**Skip it for standalone scripts.** If ArticleJsonLd outputs a standalone `<script>` without a `@graph`, `isPartOf` referencing a non-existent node in the same document provides no value. In that case, `mainEntityOfPage` with the full URL is sufficient.

**Do not use `isPartOf` to link Article → WebSite directly.** That is not the intended use of the property and would be semantically incorrect per schema.org hierarchy.

---

## 6. `speakable` for Voice Search Optimization

Per the existing research doc (`schema-markup-seo-2026.md`, section 10) and confirmed current:

- Still in **BETA at Google as of 2026** — has not graduated to stable
- Restricted to: news publishers, English language, US users with Google Home/Assistant
- alexmayhew.dev is not a news publisher
- No evidence Google extends `speakable` beyond news content in 2026
- **Verdict: Do not implement.** Zero benefit for this site type.

The `SpeakableSpecification` is listed as an optional property in Yoast's schema piece but with no practical impact for non-news sites.

---

## 7. Schema Type for Newsletter Issues

### The type hierarchy

```
Article (parent)
├── NewsArticle     — news cycle content, eligible for Top Stories
├── BlogPosting     — personal/company blog, opinion, evergreen
│   └── LiveBlogPosting
├── TechArticle     — dev tutorials, code guides, API docs
│   └── APIReference
├── ScholarlyArticle — academic/research
└── SocialMediaPosting
```

### For newsletter issues published on the web

Newsletter issues that are published as web pages (stable URL, publicly accessible) are best typed as **`BlogPosting`**. Reasons:

1. Newsletter issues are periodic, personally authored content — semantically identical to blog posts
2. They are NOT time-sensitive news (not eligible for Top Stories regardless of type)
3. `BlogPosting` is the correct semantic type for curated, opinionated, author-voiced content published on a schedule
4. Google treats `Article`, `BlogPosting`, and `TechArticle` identically for rich result eligibility — no ranking difference
5. `NewsArticle` is specifically for news journalism — using it for newsletters signals a content type mismatch to Google's classifier

### If newsletter issues are at `/newsletter/{slug}` vs `/blog/{slug}`

The URL path does not affect schema type selection. The content nature does. A monthly newsletter issue published at `alexmayhew.dev/newsletter/march-2026` should use `BlogPosting`, with `mainEntityOfPage` pointing to that URL.

### Complete recommended type mapping for alexmayhew.dev

| Content                                          | Schema Type   | Rationale                                           |
| ------------------------------------------------ | ------------- | --------------------------------------------------- |
| Technical deep-dives (architecture, engineering) | `TechArticle` | Involves technical instructions, code, system docs  |
| Business/leadership posts                        | `BlogPosting` | Opinionated, author-voiced, not technical procedure |
| Newsletter issues (web archive)                  | `BlogPosting` | Periodic authored content, not news                 |
| Hub guides (evergreen reference)                 | `Article`     | Generic, authoritative, not blog-style              |

---

## 8. Complete Reference Implementation

Recommended Article JSON-LD shape for alexmayhew.dev using `@graph` pattern:

```json
{
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebPage",
			"@id": "https://alexmayhew.dev/blog/my-post-slug",
			"url": "https://alexmayhew.dev/blog/my-post-slug",
			"name": "Article Title",
			"isPartOf": { "@id": "https://alexmayhew.dev/#website" },
			"breadcrumb": { "@id": "https://alexmayhew.dev/blog/my-post-slug#breadcrumb" },
			"inLanguage": "en-US"
		},
		{
			"@type": "TechArticle",
			"@id": "https://alexmayhew.dev/blog/my-post-slug#article",
			"headline": "Article Title",
			"description": "Article description for AI parsers.",
			"image": ["https://alexmayhew.dev/images/blog/my-post-slug-featured.webp"],
			"datePublished": "2026-03-19T08:00:00+00:00",
			"dateModified": "2026-03-19T08:00:00+00:00",
			"author": {
				"@id": "https://alexmayhew.dev/#person"
			},
			"publisher": {
				"@id": "https://alexmayhew.dev/#organization"
			},
			"isPartOf": {
				"@id": "https://alexmayhew.dev/blog/my-post-slug"
			},
			"mainEntityOfPage": {
				"@id": "https://alexmayhew.dev/blog/my-post-slug"
			},
			"articleSection": "Engineering",
			"inLanguage": "en-US"
		}
	]
}
```

The Person and Organization entities are defined once on the homepage/about page. All article pages reference them by `@id` only.

---

## Key Decisions Summary

| Question                            | Answer                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| Required fields?                    | None technically required; headline + image + datePublished + author are needed for rich results |
| mainEntityOfPage value?             | Always the canonical URL of the current page — never homepage, never parent                      |
| mainEntityOfPage broken URL impact? | Silently rejected; documented as contributing to "crawled not indexed" status                    |
| Publisher type for solo consultant? | Organization (with site name + @id) — enables logo property; Person is valid but less optimal    |
| author @id vs inline?               | @id reference is strongly preferred for entity consolidation                                     |
| isPartOf usage?                     | Link Article → WebPage node; only in @graph context; do not link Article → WebSite directly      |
| speakable?                          | Do not implement — beta, news-only, no benefit for this site                                     |
| Newsletter issue type?              | BlogPosting — periodic authored content, not news                                                |

---

## Sources

- [Article Structured Data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article) (last updated 2025-12-10)
- [schema.org/mainEntityOfPage](https://schema.org/mainEntityOfPage)
- [schemaorg/schemaorg Discussion #3274 — Correct usage of mainEntityOfPage](https://github.com/schemaorg/schemaorg/discussions/3274)
- [Article vs BlogPosting Schema: Which One Should You Use? (2026) — SchemaValidator.org](https://schemavalidator.org/guides/article-vs-blogposting-schema)
- [What is an @id in Structured Data? — Schema App](https://www.schemaapp.com/schema-markup/what-is-an-id-in-structured-data/)
- [Schema piece — Article — Yoast Developer Portal](https://developer.yoast.com/features/schema/pieces/article/)
- [schema.org/publisher](https://schema.org/publisher)
- [Crawled, Not Indexed: The Schema Bugs — Ben's Build Notes (2026-03-09)](https://blog.bmarwell.de/2026/03/09/crawled-not-indexed-schema-bugs-outlasted-every-performance-fix.html)
- [JSON-LD Best Practices — W3C](https://w3c.github.io/json-ld-bp/)
