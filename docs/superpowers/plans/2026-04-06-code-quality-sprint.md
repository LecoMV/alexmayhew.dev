# Code Quality Sprint Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate DRY violations, complete test coverage, refactor remaining client-side data imports, and upgrade fumadocs.

**Architecture:** Extract shared UI patterns (CornerBrackets, page-layout) into reusable components/utilities, move pSEO data resolution from client to server for TopicClusterNav, push hooks test coverage to 90%+, coordinated fumadocs major upgrade.

**Tech Stack:** Next.js 15 / React 19 / Tailwind 4 / Vitest / Framer Motion

---

## Chunk 1: CornerBrackets Component

### Task 1: Create CornerBrackets component

**Files:**

- Create: `src/components/ui/corner-brackets.tsx`
- Test: `tests/components/ui/corner-brackets.test.tsx`

- [ ] **Step 1: Write failing test for default variant**

```tsx
// tests/components/ui/corner-brackets.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CornerBrackets } from "@/components/ui/corner-brackets";

describe("CornerBrackets", () => {
	it("renders two bracket divs with border-cyber-lime", () => {
		const { container } = render(<CornerBrackets />);
		const divs = container.querySelectorAll("div");
		expect(divs).toHaveLength(2);
		expect(divs[0].className).toContain("border-t");
		expect(divs[0].className).toContain("border-r");
		expect(divs[1].className).toContain("border-b");
		expect(divs[1].className).toContain("border-l");
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/ui/corner-brackets.test.tsx`

- [ ] **Step 3: Create component**

```tsx
// src/components/ui/corner-brackets.tsx
import { cn } from "@/lib/utils";

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

- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Write test for hover variant**

```tsx
it("adds hover opacity classes when hover prop is true", () => {
	const { container } = render(<CornerBrackets hover />);
	const divs = container.querySelectorAll("div");
	expect(divs[0].className).toContain("group-hover:opacity-100");
	expect(divs[1].className).toContain("group-hover:opacity-100");
});
```

- [ ] **Step 6: Run tests, verify pass**
- [ ] **Step 7: Commit**

### Task 2: Replace corner brackets in all consumer files

**Files to modify (11 files, ~15 pairs):**

- `src/components/mdx/mdx-components.tsx:92-93, 144-145`
- `src/components/blog/layouts/cards-layout.tsx:335-339`
- `src/components/pages/about-page.tsx:237-238, 271-272`
- `src/app/demo/backgrounds/page.tsx:255-256`
- `src/app/home-page.tsx:133-134, 205-206, 326-327`
- `src/app/for/[role]/role-page-content.tsx:178-179, 342-343, 421-422`
- `src/app/technologies/technologies-page-content.tsx:98-99`
- `src/app/services/integrations/[slug]/integration-page-content.tsx:228-229, 305-306, 660-661, 954`
- `src/app/services/migrations/[slug]/migration-page-content.tsx` (find bracket pairs)
- `src/app/services/[slug]/service-page-content.tsx` (find bracket pairs)
- `src/app/services/services-page-content.tsx` (find bracket pairs)

**Pattern:**
Replace:

```tsx
<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r" />
<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l" />
```

With: `<CornerBrackets />`

Replace hover variants:

```tsx
<div className="border-cyber-lime absolute top-0 right-0 h-3 w-3 border-t border-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
<div className="border-cyber-lime absolute bottom-0 left-0 h-3 w-3 border-b border-l opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
```

With: `<CornerBrackets hover />`

- [ ] **Step 1: Write test checking no inline bracket patterns remain**

```ts
// Add to tests/dry/ — check no file has the inline pattern
it("no source files contain inline corner bracket divs", () => {
	// grep for the old pattern
});
```

- [ ] **Step 2: Replace in each file** — import CornerBrackets, replace div pairs
- [ ] **Step 3: Run build**
- [ ] **Step 4: Commit**

---

## Chunk 2: PageLayout Utility Class

### Task 3: Add page-layout utility class

**Files:**

- Modify: `src/app/globals.css`
- Test: `tests/dry/page-layout.test.ts`

- [ ] **Step 1: Write failing test**

```ts
it("globals.css should define page-layout utility class", () => {
	const content = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf-8");
	expect(content).toContain("page-layout");
});
```

- [ ] **Step 2: Run test, verify fail**
- [ ] **Step 3: Add to globals.css**

```css
@layer utilities {
	.page-layout {
		@apply flex-1 px-6 pt-44 pb-24 sm:px-12 md:px-24;
	}
}
```

- [ ] **Step 4: Run test, verify pass**
- [ ] **Step 5: Commit**

### Task 4: Replace page layout pattern in all files

**Files (21 files):**

- `src/components/blog/blog-list.tsx:76`
- `src/components/blog/blog-article.tsx:53`
- `src/components/pages/work-page.tsx:19`
- `src/components/pages/case-study-page.tsx:34`
- `src/components/pages/tools-page.tsx:67`
- `src/components/pages/about-page.tsx:119`
- `src/components/pages/contact-page.tsx:120`
- `src/app/terms/page.tsx:26`
- `src/app/privacy/page.tsx:26`
- `src/app/demo/page.tsx:67`
- `src/app/demo/backgrounds/page.tsx:153`
- `src/app/for/for-hub-page.tsx:27`
- `src/app/for/[role]/role-page-content.tsx:34`
- `src/app/newsletter/page.tsx:52`
- `src/app/newsletter/[slug]/page.tsx:67`
- `src/app/technologies/technologies-page-content.tsx:40`
- `src/app/technologies/[slug]/technology-page-content.tsx:49`
- `src/app/services/comparisons/[slug]/comparison-page-content.tsx:44`
- `src/app/services/integrations/[slug]/integration-page-content.tsx:54`
- `src/app/services/migrations/[slug]/migration-page-content.tsx:48`
- `src/app/services/[slug]/service-page-content.tsx:60`
- `src/app/services/services-page-content.tsx:91`

**Pattern:** Replace `className="flex-1 px-6 pt-44 pb-24 sm:px-12 md:px-24"` with `className="page-layout"`.

- [ ] **Step 1: Write test checking no files have the old pattern**
- [ ] **Step 2: Replace in each file**
- [ ] **Step 3: Run build**
- [ ] **Step 4: Commit**

---

## Chunk 3: TopicClusterNav Refactor

### Task 5: Move data resolution to server

**Files:**

- Modify: `src/components/seo/topic-cluster-nav.tsx` — remove `@/data/pseo/types` import, accept data as props
- Modify: `src/app/services/[slug]/page.tsx` — resolve cluster data server-side, pass as props

- [ ] **Step 1: Write test checking topic-cluster-nav has no pSEO import**

```ts
it("topic-cluster-nav.tsx should not import from @/data/pseo", () => {
	const content = readFileSync("src/components/seo/topic-cluster-nav.tsx", "utf-8");
	expect(content).not.toMatch(/from ["']@\/data\/pseo/);
});
```

- [ ] **Step 2: Run test, verify fail**
- [ ] **Step 3: Read TopicClusterNav to understand what data it uses**
- [ ] **Step 4: Create typed props interface for pre-resolved data**
- [ ] **Step 5: Update server page.tsx to resolve data and pass as props**
- [ ] **Step 6: Remove import from client component**
- [ ] **Step 7: Run build, verify bundle size drops**
- [ ] **Step 8: Commit**

---

## Chunk 4: Hooks Test Coverage

### Task 6: Cover use-content-analytics branches

**Files:**

- Modify: `tests/lib/hooks/use-content-analytics.test.ts`

- [ ] **Step 1: Run coverage for hooks only**

```bash
npx vitest run --coverage -- tests/lib/hooks/
```

- [ ] **Step 2: Identify uncovered branches**
- [ ] **Step 3: Write tests for each uncovered branch** (scroll depth thresholds, time tracking, content interaction)
- [ ] **Step 4: Run coverage, verify 90%+**
- [ ] **Step 5: Commit**

---

## Chunk 5: Fumadocs Upgrade

### Task 7: Coordinated fumadocs 15→16 upgrade

**Files:**

- Modify: `package.json`
- Possibly modify: `source.config.ts`, MDX config, any fumadocs API imports

- [ ] **Step 1: Create worktree branch**

```bash
git worktree add ../alexmayhew-dev-fumadocs fumadocs-16-upgrade
```

- [ ] **Step 2: Install new versions**

```bash
npm install fumadocs-core@16 fumadocs-ui@16
```

Note: fumadocs-mdx may need to stay at 14.x or go to 15.x — check compatibility.

- [ ] **Step 3: Run build, identify breaking changes**
- [ ] **Step 4: Fix any API changes** (import paths, component props, config)
- [ ] **Step 5: Run full test suite**
- [ ] **Step 6: Run E2E tests locally if possible**
- [ ] **Step 7: If all passes, merge to main. If not, document issues and revert.**
- [ ] **Step 8: Commit**

---

## Chunk 6: Deploy & Verify

### Task 8: Full verification and deploy

- [ ] **Step 1: Run full test suite**: `npx vitest run`
- [ ] **Step 2: Run coverage**: `npx vitest run --coverage` — verify 85%+
- [ ] **Step 3: Run build**: `npm run build`
- [ ] **Step 4: Compare bundle sizes** to baseline (218KB First Load JS)
- [ ] **Step 5: Push**: `git push origin main`
- [ ] **Step 6: Monitor all 3 pipelines** (CI, E2E, Deploy)
- [ ] **Step 7: Health check**: `curl -sf https://alexmayhew.dev/api/health | jq`
