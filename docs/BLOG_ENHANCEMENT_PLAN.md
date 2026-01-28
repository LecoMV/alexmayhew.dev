# Blog Page Enhancement Plan

> **Created:** 2026-01-28
> **Goal:** Transform blog from simple post list to hub-and-spoke content discovery system
> **Based on:** 2026 blog UX research and SEO best practices

---

## Current State

The blog currently has:

- ✅ Magazine-style layout with hero + grid
- ✅ Multiple theme variants (cards, terminal, dossier)
- ✅ Featured images
- ✅ Category display per post
- ✅ Tag display
- ❌ No category filtering
- ❌ No search functionality
- ❌ No hub page links
- ❌ No "series" or "cluster" navigation
- ❌ No featured posts beyond first in list

---

## Research Summary

### Hub-and-Spoke SEO Best Practices

Sources: [Growth Minded Marketing](https://growthmindedmarketing.com/blog/hub-and-spoke-content-strategy/), [First Page Sage](https://firstpagesage.com/advanced-seo/best-seo-content-plan-the-hub-and-spoke-model-fc/), [Virayo](https://virayo.com/blog/hub-and-spoke-seo)

**Key principles:**

1. **Bidirectional linking** - Hub links to spokes, EVERY spoke links back to hub
2. **Spoke-to-spoke linking** - Link related spokes to each other
3. **Anchor text optimization** - Use keyword-rich, descriptive anchor text
4. **Link depth** - No page more than 3 clicks from homepage
5. **Topical authority** - Group content creates stronger ranking signals

### Filter UX Best Practices

Sources: [NN/g](https://www.nngroup.com/articles/filter-categories-values/), [LogRocket](https://blog.logrocket.com/ux-design/filtering-ux-ui-design-patterns-best-practices/), [Eleken](https://www.eleken.co/blog-posts/filter-ux-and-ui-for-saas)

**Key principles:**

1. **Top-of-page filters** for few high-level criteria (category, date)
2. **Show result counts** per filter to avoid zero-result frustration
3. **Single-select for primary categories** (posts belong to one category)
4. **Multi-select for tags** (posts can have multiple tags)
5. **Search within filters** if many options exist

### Blog Index Page Best Practices

Sources: [BlogTyrant](https://www.blogtyrant.com/blog-design/), [Powered by Search](https://www.poweredbysearch.com/learn/best-saas-blog-index-pages/), [BdThemes](https://bdthemes.com/best-blog-layout-design-to-rank-on-search-engine/)

**Key principles:**

1. **Featured posts section** - Highlight key/hub content
2. **Category tabs/filters** - Quick navigation by topic
3. **Clear visual hierarchy** - Hero → Featured → Grid
4. **Mobile-first** - 63%+ of blog traffic is mobile
5. **Search bar** - Essential for blogs with 20+ posts

---

## Enhancement Plan

### Phase 1: Category Filtering (High Priority)

**Goal:** Allow users to filter posts by category

**Categories (from existing posts):**

- `architecture` (9 posts)
- `business` (11 posts)
- `frontend` (6 posts)
- `infrastructure` (5 posts)

**Implementation:**

```tsx
// Add to blog-list.tsx
const categories = ["all", "architecture", "business", "frontend", "infrastructure"];

const [activeCategory, setActiveCategory] = useState("all");

const filteredPosts =
	activeCategory === "all" ? posts : posts.filter((p) => p.data.category === activeCategory);
```

**UI:** Horizontal pill tabs at top of blog page, showing post count per category.

---

### Phase 2: Hub Content Highlighting (High Priority)

**Goal:** Visually distinguish hub pages from spoke posts

**Hub pages (when created):**

- SaaS Architecture Decision Framework
- Engineering Leadership: Founder to CTO
- Modern Frontend Architecture
- Performance Engineering Playbook

**Implementation:**

- Add `isHub: boolean` to blog frontmatter schema
- Show "Comprehensive Guide" badge on hub posts
- Pin hub posts to top of their category
- Larger card treatment for hub pages

---

### Phase 3: Series/Cluster Navigation (Medium Priority)

**Goal:** Show related posts within a content cluster

**Implementation:**

- Add `series: string` to blog frontmatter (e.g., "saas-architecture")
- On blog index, group posts by series when viewing a category
- On individual posts, show "More in this series" sidebar/footer

---

### Phase 4: Search (Medium Priority)

**Goal:** Allow full-text search across posts

**Options:**

1. **Client-side (Fuse.js)** - Simple, no server needed, works with SSG
2. **Algolia DocSearch** - Free for open-source/docs, fast, hosted
3. **Pagefind** - Static search, build-time indexing, very fast

**Recommendation:** Pagefind for static site, Fuse.js as fallback.

---

### Phase 5: Featured Posts Section (Low Priority)

**Goal:** Manually curate featured posts beyond "most recent"

**Implementation:**

- Add `featured: boolean` to frontmatter (already exists)
- Create "Editor's Picks" section showing featured posts
- Separate from chronological listing

---

## Technical Implementation

### Updated Blog Frontmatter Schema

```typescript
interface BlogFrontmatter {
	title: string;
	description: string;
	date: string;
	author: string;
	tags: string[];
	category: "architecture" | "business" | "frontend" | "infrastructure";
	readingTime: string;
	featured: boolean;
	image: string;
	// New fields
	isHub?: boolean; // Is this a hub/pillar page?
	series?: string; // Content cluster ID
	seriesOrder?: number; // Order within series
}
```

### URL Structure

```
/blog                           # Index with filtering
/blog?category=architecture     # Filtered by category
/blog/saas-architecture-guide   # Hub page
/blog/multi-tenancy-prisma-rls  # Spoke page
```

### Internal Linking Pattern

Every spoke post should include:

```markdown
> **Part of:** [Complete SaaS Architecture Guide](/blog/saas-architecture-guide)

... content ...

---

## More in This Series

- [Hub: SaaS Architecture Guide](/blog/saas-architecture-guide)
- [Multi-Tenancy with Prisma & RLS](/blog/multi-tenancy-prisma-rls)
- [Database Query Optimization](/blog/database-query-optimization)
```

---

## Implementation Priority

| Phase | Feature            | Effort  | Impact | Priority |
| ----- | ------------------ | ------- | ------ | -------- |
| 1     | Category filtering | 2-3 hrs | High   | P1       |
| 2     | Hub highlighting   | 2-3 hrs | High   | P1       |
| 3     | Series navigation  | 4-6 hrs | Medium | P2       |
| 4     | Search             | 3-4 hrs | Medium | P2       |
| 5     | Featured section   | 1-2 hrs | Low    | P3       |

---

## Immediate Actions

1. **Add category filter tabs** to blog-list.tsx
2. **Update existing posts** with series tags (see CONTENT_CLUSTER_PLAN.md)
3. **Create hub pages** (amdev-8pb, amdev-ary, amdev-n68, amdev-cnm beads)
4. **Add "Part of" callouts** to spoke posts

---

## References

- [CONTENT_CLUSTER_PLAN.md](./CONTENT_CLUSTER_PLAN.md) - Hub-spoke content strategy
- [VOICE_GUIDE.md](./VOICE_GUIDE.md) - Content voice requirements
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Overall marketing plan
