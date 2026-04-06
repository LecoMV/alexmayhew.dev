# Code Quality Sprint — Design Spec

> Extract shared patterns, eliminate DRY violations, complete test coverage, refactor remaining client-side data imports.

## Sub-Project A1: CornerBrackets Component

**Problem:** 23 instances of the same two-div corner bracket pattern across 11 files.

**Solution:** Extract to `src/components/ui/corner-brackets.tsx`.

```tsx
interface CornerBracketsProps {
	hover?: boolean;
}

export function CornerBrackets({ hover }: CornerBracketsProps) {
	const hoverClass = hover
		? "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
		: "";
	return (
		<>
			<div
				className={cn(
					"border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r",
					hoverClass
				)}
			/>
			<div
				className={cn(
					"border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l",
					hoverClass
				)}
			/>
		</>
	);
}
```

Two variants: always-visible (default) and hover-reveal (`hover` prop). Uses `cn()` utility for clean class merging. Replace all 23 instances across 11 files.

**Files to update:** mdx-components.tsx, cards-layout.tsx, about-page.tsx, backgrounds/page.tsx, home-page.tsx, role-page-content.tsx, technologies-page-content.tsx, integration-page-content.tsx, migration-page-content.tsx, service-page-content.tsx, services-page-content.tsx.

## Sub-Project A2: PageLayout Utility Class

**Problem:** 22 instances of `flex-1 px-6 pt-44 pb-24 sm:px-12 md:px-24` across page components.

**Solution:** Add a Tailwind utility class via `@layer utilities` in `globals.css`:

```css
@layer utilities {
	.page-layout {
		@apply flex-1 px-6 pt-44 pb-24 sm:px-12 md:px-24;
	}
}
```

This is preferable to a wrapper component because the pattern is purely CSS (no children/props logic) and the pages use different HTML elements (`<section>`, `<div>`, `<article>`). A utility class preserves semantic HTML choice while eliminating duplication.

Replace all 22 instances with `className="page-layout"` (or merge with existing classes via `cn()`).

## Sub-Project A3: TopicClusterNav Refactor

**Problem:** `TopicClusterNav` is `"use client"` and imports `getClusterRelatedPages` and `getPageClusters` from `@/data/pseo/types`, keeping pSEO data in the client bundle.

**Solution:** Same pattern as the pSEO refactor already done — move data resolution to the server page.tsx and pass cluster data as props.

1. Create a `TopicClusterNavProps` interface that accepts pre-resolved cluster data
2. Move `getClusterRelatedPages(currentSlug)` and `getPageClusters(currentSlug)` calls to server `page.tsx` files
3. Remove the `@/data/pseo/types` import from the client component
4. Pass the resolved data as props

**Consumer files:** All service/migration/integration/comparison page.tsx files that render TopicClusterNav.

## Sub-Project A4: Hooks Test Coverage Push (64% → 90%+)

**Problem:** `src/lib/hooks/` at 64% coverage. Gaps in `use-content-analytics` branch coverage.

**Solution:** Write targeted tests for uncovered branches:

- `use-content-analytics.ts` — test all tracking functions (scroll depth, time on page, content interaction)
- `use-platform.ts` — already has tests, verify coverage
- `use-vectorizer.ts` — already has tests, verify coverage

Use `renderHook` from `@testing-library/react` with mocked `window`, `document`, `IntersectionObserver`.

## Sub-Project A5: Fumadocs 15→16 Coordinated Upgrade

**Problem:** fumadocs-core, fumadocs-ui, and fumadocs-mdx must be upgraded together. Core 15→16 is a major version with potential breaking changes to the MDX pipeline and blog system.

**Solution:**

1. Create a git branch for the upgrade
2. `npm install fumadocs-core@16 fumadocs-ui@16 fumadocs-mdx@latest`
3. Run build — identify breaking changes
4. Fix any API changes (import paths, component props, config)
5. Run full test suite + E2E
6. Merge only if everything passes, revert if not

**Risk mitigation:** Do this in a worktree so main stays clean.

## Execution Order

```
Group 1 (parallel, no deps):
  A1: CornerBrackets component
  A2: PageLayout utility class
  A4: Hooks test coverage

Group 2 (after Group 1 committed):
  A3: TopicClusterNav refactor (touches same service page files)

Group 3 (isolated, worktree):
  A5: Fumadocs upgrade
```

## Testing Strategy

- A1: Test that CornerBrackets renders two divs with correct classes, test hover variant
- A2: Test that globals.css contains `.page-layout` class
- A3: Test that TopicClusterNav source has no `@/data/pseo` imports
- A4: Branch coverage tests for hooks
- A5: Full build + E2E verification
