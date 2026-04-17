# Plan 4: Engineering Excellence Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix DRY violations, improve performance, accessibility, DevOps safety, and security vulnerabilities.

**Architecture:** Component extraction, lazy loading, config fixes, and dependency upgrades. Higher-risk refactoring — each chunk independently deployable.

**Tech Stack:** Next.js 15 / React 19 / Tailwind 4 / Framer Motion / GitHub Actions / Cloudflare Workers

---

## Chunk 1: Performance (Highest Impact)

### Task 1: Lazy-Load Command Palette (cmdk) — Save 276 KB on Every Page

**Files:**

- Modify: `src/app/layout.tsx` — change CommandPaletteServer from static import to interaction-triggered dynamic import

- [ ] **Step 1: Write test** verifying cmdk is not in the initial page load (check that the dynamic import wrapper exists)
- [ ] **Step 2: Wrap CommandPaletteServer in a client component** that only loads cmdk when Ctrl+K is pressed. Use `dynamic(() => import(...), { ssr: false })` or a custom lazy-load triggered by a keydown listener.
- [ ] **Step 3: Run build** — verify First Load JS for homepage drops by ~200+ KB
- [ ] **Step 4: Commit**

### Task 2: Split pSEO Data Chunk — Save 100-150 KB on Service Pages

**Files:**

- Modify: `src/data/pseo/index.ts` — use dynamic imports per data type instead of re-exporting everything

- [ ] **Step 1: Analyze current chunk composition** — `npm run build` and check chunk 3028 contents
- [ ] **Step 2: Split imports** — instead of barrel re-export, each page type imports only what it needs
- [ ] **Step 3: Run build** — verify /services/[slug] First Load JS drops
- [ ] **Step 4: Commit**

---

## Chunk 2: Accessibility

### Task 3: Fix Heading Hierarchy on 5 Pages

**Files:**

- Modify: `src/components/pages/about-page.tsx` — swap h1/h2
- Modify: `src/components/pages/contact-page.tsx` — swap h1/h2
- Modify: `src/components/pages/work-page.tsx` — swap h1/h2
- Modify: `src/components/pages/tools-page.tsx` — swap h1/h2
- Modify: `src/components/blog/blog-list.tsx` — swap h1/h2
- Also: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`

- [ ] **Step 1: Write test** checking each page has the primary content heading as h1, not the label
- [ ] **Step 2: On each page** — change the tiny label from `<h1>` to `<p>` or `<span>`, change the main heading from `<h2>` to `<h1>`
- [ ] **Step 3: Run build, commit**

### Task 4: Add Focus Ring to Form Inputs

**Files:**

- Modify: `src/components/pages/contact-page.tsx` — add `focus-visible:ring-2 focus-visible:ring-cyber-lime` to all inputs
- Modify: `src/components/newsletter/newsletter-signup.tsx` — same
- Modify: `src/components/chat/chat-widget.tsx` — same

- [ ] **Step 1: Add focus ring classes** alongside existing `focus:border-cyber-lime focus:outline-none`
- [ ] **Step 2: Run build, commit**

### Task 5: Add reducedMotion="user" to LazyMotion Provider

**Files:**

- Modify: `src/components/providers/motion.tsx`

- [ ] **Step 1: Write test** checking motion.tsx contains "reducedMotion"
- [ ] **Step 2: Add `reducedMotion="user"` prop to `<LazyMotion>`**
- [ ] **Step 3: Run build, commit**

### Task 6: Add role="dialog" to Command Palette

**Files:**

- Modify: `src/components/ui/command-palette.tsx`

- [ ] **Step 1: Add `role="dialog"` and `aria-modal="true"` to palette container**
- [ ] **Step 2: Add `aria-label="Search"` on chat input**
- [ ] **Step 3: Run build, commit**

### Task 7: Fix 5 Nested <main> Elements

**Files:**

- Modify: `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/offline/page.tsx`, `src/app/demo/error.tsx`, `src/app/tools/traceforge/error.tsx`

- [ ] **Step 1: Change `<main>` to `<section>` in each file**
- [ ] **Step 2: Run build, commit**

---

## Chunk 3: DRY Refactoring

### Task 8: Extract Shared Animation Constants

**Files:**

- Modify: `src/lib/motion-constants.ts` — add staggerContainer and fadeInUp
- Modify: 8 files that duplicate these constants — replace with import

Files to update: `home-page.tsx`, `services-page-content.tsx`, `service-page-content.tsx`, `migration-page-content.tsx`, `integration-page-content.tsx`, `comparison-page-content.tsx`, `for-hub-page.tsx`, `role-page-content.tsx`

- [ ] **Step 1: Add staggerContainer and fadeInUp** to motion-constants.ts
- [ ] **Step 2: Replace inline definitions** in all 8 files with imports
- [ ] **Step 3: Run build, commit**

### Task 9: Create max-w-container Design Token

**Files:**

- Modify: `src/app/globals.css` — add `--max-content-width: 1400px` to @theme
- Replace 25 occurrences of `max-w-[1400px]` with `max-w-content` (or whatever token name)

- [ ] **Step 1: Add token to globals.css**
- [ ] **Step 2: Bulk replace across all files**
- [ ] **Step 3: Run build, commit**

---

## Chunk 4: DevOps Safety

### Task 10: Add Deploy Concurrency Control

**Files:**

- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Add concurrency group**

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false
```

- [ ] **Step 2: Commit**

### Task 11: Fix Preview Deploy Fallback

**Files:**

- Modify: `.github/workflows/deploy.yml` — remove the `|| npx opennextjs-cloudflare deploy` fallback from preview deploys

- [ ] **Step 1: Change preview deploy** to only use `npx wrangler deploy --env preview` without fallback. If preview fails, let it fail — don't silently deploy to production.
- [ ] **Step 2: Commit**

### Task 12: Add SHA Verification to Health Check

**Files:**

- Modify: `.github/workflows/deploy.yml` — compare `deployment.sha` to `github.sha`

- [ ] **Step 1: Update health check step** to verify the deployed SHA matches the commit
- [ ] **Step 2: Replace fixed `sleep 15` with retry loop** (poll every 5s up to 60s)
- [ ] **Step 3: Commit**

### Task 13: Pin Unpinned CI Dependencies

**Files:**

- Modify: `.github/workflows/ci.yml` — pin `karpeslop` to specific version
- Modify: `.github/workflows/deploy.yml` — add `googleapis` to package.json devDependencies instead of installing at deploy time

- [ ] **Step 1: Pin karpeslop**: `npx karpeslop@latest` → `npx karpeslop@X.Y.Z` (check current version first)
- [ ] **Step 2: Add googleapis to devDependencies**: `npm install --save-dev googleapis`
- [ ] **Step 3: Remove the `npm install googleapis --no-save` from deploy.yml**
- [ ] **Step 4: Commit**

### Task 14: Add poweredByHeader: false

**Files:**

- Modify: `next.config.mjs`

- [ ] **Step 1: Add `poweredByHeader: false`** to the Next.js config
- [ ] **Step 2: Commit**

---

## Chunk 5: Security Dependencies

### Task 15: Upgrade Critical Security Dependencies

- [ ] **Step 1: Test OpenNext upgrade**

```bash
npm install @opennextjs/cloudflare@1.18.0
npm run build
```

If build passes, keep. If not, revert and document the incompatibility.

- [ ] **Step 2: Test Next.js upgrade**

```bash
npm install next@15.5.14
npm run build
```

Same approach — if it breaks, revert and document.

- [ ] **Step 3: Update DOMPurify**

```bash
npm audit fix
npm run build
```

- [ ] **Step 4: Run full test suite**
- [ ] **Step 5: Commit**

---

## Chunk 6: Deploy All Engineering Changes

### Task 16: Full Build, Push, Verify

- [ ] **Step 1: Full test suite**: `npx vitest run`
- [ ] **Step 2: Full build**: `npm run build`
- [ ] **Step 3: Compare bundle sizes** against pre-change baseline
- [ ] **Step 4: Push**: `git push origin main`
- [ ] **Step 5: Monitor deploy**: `gh run list --repo LecoMV/alexmayhew.dev --limit 3`
- [ ] **Step 6: Verify health**: `curl -s https://alexmayhew.dev/api/health | jq`
