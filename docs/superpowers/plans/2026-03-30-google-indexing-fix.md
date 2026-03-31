# Google Indexing Fix Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 7 root causes preventing 178/180 pages from being indexed by Google, increasing the index rate from 1.1% to 90%+ within 4 weeks.

**Architecture:** Fix infrastructure (www redirect) first, then internal linking (homepage, relatedBlogPosts, blog pagination), then schema consolidation. Each phase is independently deployable. All code changes target existing files — no new architectural patterns.

**Tech Stack:** Next.js 15 / React 19 / Tailwind 4 / Cloudflare Pages / OpenNext

**Spec:** `docs/superpowers/specs/2026-03-30-google-indexing-fix-design.md`

---

## Chunk 1: Infrastructure — www Redirect

### Task 1: Fix www → non-www 301 Redirect (Cloudflare Dashboard)

**Files:** None (Cloudflare Dashboard configuration only)

**IMPORTANT:** This task requires manual action in the Cloudflare Dashboard. It cannot be automated via code.

- [ ] **Step 1: Check current Workers custom domains**

Open Cloudflare Dashboard → Workers & Pages → `alexmayhew-dev` → Settings → Domains & Routes. Check if `www.alexmayhew.dev` is listed as a custom domain or route.

- [ ] **Step 2: Remove www custom domain from Workers project**

If `www.alexmayhew.dev` is listed, remove it. This is critical — the Worker claims the hostname first, so redirect rules never fire while it's set.

- [ ] **Step 3: Verify proxied DNS record for www**

Go to Cloudflare Dashboard → DNS → Records. Verify or create:

- Type: `A`
- Name: `www`
- Value: `192.0.2.1` (dummy — Cloudflare intercepts before origin)
- Proxy status: **Proxied** (orange cloud ON)

- [ ] **Step 4: Create Redirect Rule**

Go to Cloudflare Dashboard → Rules → Redirect Rules → Create Rule:

- Rule name: `www to apex 301`
- When: Hostname equals `www.alexmayhew.dev`
- Then: Dynamic redirect to `concat("https://alexmayhew.dev", http.request.uri.path)`
- Status code: 301
- Preserve query string: ON

- [ ] **Step 5: Verify redirect**

```bash
curl -sI "https://www.alexmayhew.dev/" | head -5
# Expected: HTTP/2 301, Location: https://alexmayhew.dev/

curl -sI "https://www.alexmayhew.dev/blog/boring-technology-wins" | head -5
# Expected: HTTP/2 301, Location: https://alexmayhew.dev/blog/boring-technology-wins
```

---

## Chunk 2: Internal Linking — relatedBlogPosts Component

### Task 2: Create RelatedBlogPostsSection Component

**Files:**

- Create: `src/components/seo/related-blog-posts.tsx`
- Test: `tests/components/related-blog-posts.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// tests/components/related-blog-posts.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RelatedBlogPostsSection } from "@/components/seo/related-blog-posts";

describe("RelatedBlogPostsSection", () => {
	it("renders nothing when slugs array is empty", () => {
		const { container } = render(<RelatedBlogPostsSection slugs={[]} />);
		expect(container.innerHTML).toBe("");
	});

	it("renders blog post links for valid slugs", () => {
		render(<RelatedBlogPostsSection slugs={["boring-technology-wins", "build-vs-buy"]} />);
		expect(screen.getByText("Related Insights")).toBeInTheDocument();
		expect(screen.getAllByRole("link")).toHaveLength(2);
	});

	it("links to correct blog URLs", () => {
		render(<RelatedBlogPostsSection slugs={["boring-technology-wins"]} />);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/blog/boring-technology-wins");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/related-blog-posts.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the component**

```tsx
// src/components/seo/related-blog-posts.tsx
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { allPosts } from "@/lib/blog";

interface RelatedBlogPostsSectionProps {
	slugs: string[];
}

export function RelatedBlogPostsSection({ slugs }: RelatedBlogPostsSectionProps) {
	if (slugs.length === 0) return null;

	const posts = slugs
		.map((slug) => {
			const post = allPosts.find((p) => p.slug === slug);
			return post
				? { slug: post.slug, title: post.data.title, category: post.data.category }
				: null;
		})
		.filter(Boolean);

	if (posts.length === 0) return null;

	return (
		<section className="mb-20">
			<h2 className="text-cyber-lime mb-8 font-mono text-xs tracking-wider uppercase">
				<span className="mr-2 animate-pulse">●</span>
				Related Insights
			</h2>
			<div className="grid gap-3 sm:grid-cols-2">
				{posts.map((post) => (
					<Link
						key={post!.slug}
						href={`/blog/${post!.slug}`}
						className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 relative flex items-center gap-4 border border-white/10 p-4 transition-colors duration-300"
					>
						<BookOpen className="text-cyber-lime/60 h-5 w-5 shrink-0" strokeWidth={1.5} />
						<div className="min-w-0 flex-1">
							<p className="group-hover:text-cyber-lime truncate font-mono text-sm tracking-tight transition-colors">
								{post!.title}
							</p>
							<p className="text-slate-text mt-1 text-xs capitalize">{post!.category}</p>
						</div>
						<ArrowRight
							className="text-slate-text group-hover:text-cyber-lime h-4 w-4 shrink-0 transition-colors"
							strokeWidth={1.5}
						/>
					</Link>
				))}
			</div>
		</section>
	);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/related-blog-posts.test.tsx`
Expected: PASS

- [ ] **Step 5: Export from SEO barrel**

Modify: `src/components/seo/index.ts` — add `export { RelatedBlogPostsSection } from "./related-blog-posts";`

- [ ] **Step 6: Commit**

```bash
git add src/components/seo/related-blog-posts.tsx tests/components/related-blog-posts.test.tsx src/components/seo/index.ts
git commit -m "feat(seo): add RelatedBlogPostsSection component for internal linking"
```

### Task 3: Render relatedBlogPosts on All pSEO Page Types

**Files:**

- Modify: `src/app/services/[slug]/service-page-content.tsx`
- Modify: `src/app/services/migrations/[slug]/migration-page-content.tsx`
- Modify: `src/app/services/integrations/[slug]/integration-page-content.tsx`
- Modify: `src/app/services/comparisons/[slug]/comparison-page-content.tsx`

- [ ] **Step 1: Add RelatedBlogPostsSection to service-page-content.tsx**

Add import: `import { RelatedBlogPostsSection } from "@/components/seo";`

Add after the RelatedServicesSection (around line 118):

```tsx
{
	/* Related Blog Posts */
}
<RelatedBlogPostsSection slugs={page.relatedBlogPosts} />;
```

- [ ] **Step 2: Add to migration-page-content.tsx**

Same pattern — import component, add `<RelatedBlogPostsSection slugs={page.relatedBlogPosts} />` after the RelatedServicesSection.

- [ ] **Step 3: Add to integration-page-content.tsx**

Same pattern.

- [ ] **Step 4: Add to comparison-page-content.tsx**

Same pattern.

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 6: Commit**

```bash
git add src/app/services/
git commit -m "feat(seo): render relatedBlogPosts on all pSEO pages (~108 new internal links)"
```

---

## Chunk 3: Internal Linking — Homepage

### Task 4: Add Internal Links to Homepage

**Files:**

- Modify: `src/app/home-page.tsx`
- Modify: `src/app/page.tsx` (may need to become server component to fetch blog data)

- [ ] **Step 1: Make services cards clickable**

In `src/app/home-page.tsx`, update the `services` array to include `href`:

```tsx
const services = [
	{
		icon: Terminal,
		title: "Full-Stack Development",
		description:
			"End-to-end web applications architected for scale, security, and long-term maintainability.",
		code: "dev.fullstack()",
		href: "/services",
	},
	{
		icon: Layers,
		title: "System Architecture",
		description: "Production systems designed to scale from MVP to millions without rewrites.",
		code: "sys.architect()",
		href: "/services",
	},
	{
		icon: Zap,
		title: "Performance Engineering",
		description: "Optimized experiences that convert users and reduce infrastructure costs.",
		code: "perf.optimize()",
		href: "/services",
	},
];
```

Wrap each service card's `<m.article>` in a `<Link href={service.href}>` or replace the `<m.article>` with `<m.a>` via `Link`.

- [ ] **Step 2: Add Featured Insights section with 5 hub post links**

Add a new section between Services and Newsletter. This section is static (hub posts don't change often):

```tsx
{
	/* Featured Insights */
}
<section className="border-t border-white/10 px-6 py-24 sm:px-12 md:px-24">
	<div className="mx-auto max-w-[1400px]">
		<h2 className="text-cyber-lime mb-4 font-mono text-xs tracking-wider uppercase">
			<span className="mr-2 animate-pulse">●</span>
			Featured Insights
		</h2>
		<p className="text-slate-text mb-8 max-w-2xl text-lg">
			Deep-dive guides on the decisions that define your architecture.
		</p>
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{[
				{
					title: "SaaS Architecture Decision Framework",
					slug: "saas-architecture-decision-framework",
					category: "architecture",
				},
				{
					title: "Engineering Leadership: Founder to CTO",
					slug: "engineering-leadership-founder-to-cto",
					category: "business",
				},
				{
					title: "Modern Frontend Architecture Guide",
					slug: "modern-frontend-architecture-guide",
					category: "frontend",
				},
				{
					title: "Performance Engineering Playbook",
					slug: "performance-engineering-playbook",
					category: "infrastructure",
				},
				{
					title: "AI-Assisted Development Guide",
					slug: "ai-assisted-development-guide",
					category: "architecture",
				},
			].map((post) => (
				<Link
					key={post.slug}
					href={`/blog/${post.slug}`}
					className="group bg-gunmetal-glass/10 hover:border-cyber-lime/50 border border-white/10 p-5 transition-colors duration-300"
				>
					<p className="text-slate-text mb-2 font-mono text-xs capitalize">{post.category}</p>
					<h3 className="group-hover:text-cyber-lime font-mono text-sm tracking-tight transition-colors">
						{post.title}
					</h3>
				</Link>
			))}
		</div>
		<Link
			href="/blog"
			className="text-cyber-lime mt-6 inline-flex items-center gap-2 font-mono text-sm hover:underline"
		>
			View all articles <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
		</Link>
	</div>
</section>;
```

- [ ] **Step 3: Add links to About and Technologies in existing sections**

Add footer-style quick links or weave `/about`, `/technologies`, `/blog` into the existing hero or CTA sections.

- [ ] **Step 4: Verify build passes**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/app/home-page.tsx src/app/page.tsx
git commit -m "feat(seo): add internal links to homepage (services, blog hubs, about)"
```

---

## Chunk 4: Internal Linking — Blog Pagination

### Task 5: Fix Blog Listing to Render All Posts in Initial HTML

**Files:**

- Modify: `src/components/blog/blog-list.tsx`

The simplest fix: render all posts in the initial HTML but keep the visual progressive disclosure. Change `POSTS_PER_PAGE` behavior to use CSS + `details/summary` or render all with the Load More button as purely visual (all links are in the DOM from the start).

- [ ] **Step 1: Render all posts in DOM, use CSS for progressive UX**

In `src/components/blog/blog-list.tsx`, change the slice logic so ALL posts render in the DOM but only `visibleCount` are visually shown. Use `hidden` attribute or `sr-only` class on the overflow posts rather than not rendering them at all.

The key change — replace:

```tsx
{filteredPosts.slice(0, visibleCount).map((post, index) => (
```

With a pattern where all posts render but extras are visually hidden:

```tsx
{filteredPosts.map((post, index) => (
	<div key={post.slug} className={index >= visibleCount ? "hidden" : undefined}>
```

Wait — `hidden` would also hide from crawlers. Better approach: render ALL posts as visible `<a>` links in a `<noscript>` fallback or simply render them all and keep Load More as a UX convenience that adds animation, not content.

Simplest correct approach: render all posts, make Load More just control animation/scroll, not content visibility.

```tsx
// Change POSTS_PER_PAGE from 12 to posts.length (show all)
// Or better: keep the Load More UX but ensure all links are in the HTML
const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

// Render ALL posts but only animate the visible ones
{
	filteredPosts.map((post, index) => {
		const isVisible = index < visibleCount;
		return (
			<m.div
				key={post.slug}
				initial={isVisible ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
				animate={{ opacity: 1, y: 0 }}
				transition={
					isVisible
						? { ...springTransition, delay: (index % POSTS_PER_PAGE) * 0.05 }
						: { duration: 0 }
				}
			>
				{/* PostCard renders the <Link> — always in DOM */}
			</m.div>
		);
	});
}
```

- [ ] **Step 2: Verify all 74 posts render in initial HTML**

```bash
curl -s https://localhost:3001/blog | grep -c 'href="/blog/'
# Expected: 74+ (one per blog post)
```

- [ ] **Step 3: Run build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/blog-list.tsx
git commit -m "fix(seo): render all blog posts in initial HTML for crawlability"
```

---

## Chunk 5: Schema Consolidation

### Task 6: Fix Person @id References

**Files:**

- Modify: `src/components/seo/schema-utils.tsx`
- Modify: `src/components/seo/contact-json-ld.tsx`
- Modify: `src/components/seo/case-study-json-ld.tsx`
- Modify: `src/components/seo/comparison-json-ld.tsx`

- [ ] **Step 1: Add PERSON_REF to schema-utils.tsx**

Add after `PROVIDER_PERSON`:

```tsx
/** Use this for referencing the Person entity defined in the global layout */
export const PERSON_REF = { "@id": `${SITE_URL}/#person` } as const;
```

- [ ] **Step 2: Replace inline Person objects in service schemas**

In `migration-json-ld.tsx`, `integration-json-ld.tsx`, `service-json-ld.tsx`, `role-json-ld.tsx`, `technology-json-ld.tsx`: replace `provider: PROVIDER_PERSON` with `provider: PERSON_REF`.

- [ ] **Step 3: Fix contact-json-ld.tsx**

Replace inline Person object with `PERSON_REF`.

- [ ] **Step 4: Fix case-study-json-ld.tsx**

Replace inline Person with `PERSON_REF` for `author`/`creator`.

- [ ] **Step 5: Fix comparison-json-ld.tsx**

Replace inline Person with `PERSON_REF` for `author`/`publisher`. Also fix `publisher` from `"@type": "Person"` to `"@type": "Organization"` with `"@id"` reference to `/#organization`.

- [ ] **Step 6: Run build to verify no breakage**

Run: `npm run build`

- [ ] **Step 7: Commit**

```bash
git add src/components/seo/
git commit -m "fix(seo): consolidate Person @id references, remove duplicate entities"
```

### Task 7: Add Missing JSON-LD to Key Pages

**Files:**

- Modify: `src/app/blog/page.tsx` — add CollectionPage schema
- Modify: `src/app/about/page.tsx` — add AboutPage schema
- Modify: `src/components/seo/json-ld.tsx` — change ProfessionalService → ConsultingService
- Modify: `src/components/seo/article-json-ld.tsx` — BlogPosting for non-hub posts
- Modify: `src/app/blog/page.tsx` metadata — fix RSS alternate `/blog/rss.xml` → `/feed.xml`

- [ ] **Step 1: Add CollectionPage JSON-LD to blog listing**

In `src/app/blog/page.tsx`, add JSON-LD script with `CollectionPage` + `ItemList` of blog posts. Use the same `JsonLdScript` helper from schema-utils.

- [ ] **Step 2: Add AboutPage schema to about page**

In `src/app/about/page.tsx`, add JSON-LD with `"@type": "AboutPage"` WebPage schema referencing `PERSON_REF`.

- [ ] **Step 3: Change ProfessionalService to ConsultingService**

In `src/components/seo/json-ld.tsx`, change `"@type": "ProfessionalService"` to `"@type": "ConsultingService"`.

- [ ] **Step 4: Change spoke post Article to BlogPosting**

In `src/components/seo/article-json-ld.tsx`, change non-hub posts from `"Article"` to `"BlogPosting"`.

- [ ] **Step 5: Fix RSS alternate on blog page**

In `src/app/blog/page.tsx` metadata, change `alternates.types["application/rss+xml"]` from `/blog/rss.xml` to `/feed.xml`.

- [ ] **Step 6: Run build**

Run: `npm run build`

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/page.tsx src/app/about/page.tsx src/components/seo/
git commit -m "fix(seo): add CollectionPage/AboutPage schema, fix BlogPosting/ConsultingService types"
```

---

## Chunk 6: Verification & Resubmission

### Task 8: Full Build Verification & Deploy

**Files:** None (verification only)

- [ ] **Step 1: Full build**

```bash
npm run build
```

- [ ] **Step 2: Full lint**

```bash
npm run lint
```

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

- [ ] **Step 4: Push to main**

```bash
git push origin main
```

- [ ] **Step 5: Monitor deploy**

```bash
gh run list --repo LecoMV/alexmayhew.dev --limit 3
# Wait for completed | success
```

- [ ] **Step 6: Verify www redirect**

```bash
curl -sI "https://www.alexmayhew.dev/" | head -5
curl -sI "https://www.alexmayhew.dev/blog/boring-technology-wins" | head -5
```

- [ ] **Step 7: Verify health**

```bash
curl -s https://alexmayhew.dev/api/health | jq
```

### Task 9: GSC Resubmission & Monitoring

**Files:** None (API calls only)

- [ ] **Step 1: Resubmit sitemap**

Use the existing `scripts/submit-sitemap-gsc.mjs` pattern to resubmit.

- [ ] **Step 2: Request indexing for priority URLs**

Use GSC URL Inspection API to request indexing for the 5 hub posts and key pages (`/blog`, `/about`, `/services`, `/work`, `/contact`).

- [ ] **Step 3: Document expected timeline**

Per research: indexing improvements take 2-4 weeks after fixing structural issues. The www redirect should take effect within 48 hours. Internal linking improvements should increase crawl frequency within 1-2 weeks.

---

## Dependencies

```
Task 1 (www redirect) — independent, do first
Task 2 (component) → Task 3 (render on pages) — sequential
Task 4 (homepage) — independent
Task 5 (blog pagination) — independent
Task 6 (Person @id) — independent
Task 7 (missing schema) — independent, after Task 6
Task 8 (verify) → after all code tasks
Task 9 (GSC) → after Task 8 deploy
```

**Parallelizable:** Tasks 2-3, 4, 5, 6 can all run in parallel. Task 7 depends on Task 6 (uses PERSON_REF). Task 1 is manual (Cloudflare Dashboard).

---

## Files Changed Summary

| File                                                                | Change                                           |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| `src/components/seo/related-blog-posts.tsx`                         | NEW — RelatedBlogPostsSection component          |
| `src/components/seo/index.ts`                                       | Add export                                       |
| `src/components/seo/schema-utils.tsx`                               | Add PERSON_REF constant                          |
| `src/components/seo/migration-json-ld.tsx`                          | PROVIDER_PERSON → PERSON_REF                     |
| `src/components/seo/integration-json-ld.tsx`                        | PROVIDER_PERSON → PERSON_REF                     |
| `src/components/seo/service-json-ld.tsx`                            | PROVIDER_PERSON → PERSON_REF                     |
| `src/components/seo/role-json-ld.tsx`                               | PROVIDER_PERSON → PERSON_REF                     |
| `src/components/seo/technology-json-ld.tsx`                         | PROVIDER_PERSON → PERSON_REF                     |
| `src/components/seo/contact-json-ld.tsx`                            | Inline Person → PERSON_REF                       |
| `src/components/seo/case-study-json-ld.tsx`                         | Inline Person → PERSON_REF                       |
| `src/components/seo/comparison-json-ld.tsx`                         | Person → PERSON_REF + Org fix                    |
| `src/components/seo/json-ld.tsx`                                    | ProfessionalService → ConsultingService          |
| `src/components/seo/article-json-ld.tsx`                            | Article → BlogPosting for spokes                 |
| `src/app/home-page.tsx`                                             | Add service links, featured insights, blog links |
| `src/app/page.tsx`                                                  | May need server data for blog posts              |
| `src/components/blog/blog-list.tsx`                                 | Render all posts in DOM                          |
| `src/app/services/[slug]/service-page-content.tsx`                  | Add RelatedBlogPostsSection                      |
| `src/app/services/migrations/[slug]/migration-page-content.tsx`     | Add RelatedBlogPostsSection                      |
| `src/app/services/integrations/[slug]/integration-page-content.tsx` | Add RelatedBlogPostsSection                      |
| `src/app/services/comparisons/[slug]/comparison-page-content.tsx`   | Add RelatedBlogPostsSection                      |
| `src/app/blog/page.tsx`                                             | Add CollectionPage schema + fix RSS alternate    |
| `src/app/about/page.tsx`                                            | Add AboutPage schema                             |
| `tests/components/related-blog-posts.test.tsx`                      | NEW — component tests                            |
