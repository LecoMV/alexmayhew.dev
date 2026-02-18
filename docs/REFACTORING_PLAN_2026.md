# Refactoring Plan — alexmayhew.dev (2026)

> Comprehensive assessment and prioritized refactoring plan based on architecture analysis, code quality tooling, and 2026 React/Next.js best practices.

**Date:** 2026-02-08
**Baseline:** 189 TS/TSX files | Avg LDR: 0.252 | 0 `any` types | 0 TODO/FIXME

---

## Table of Contents

1. [Current Architecture Assessment](#1-current-architecture-assessment)
2. [Code Quality Baseline](#2-code-quality-baseline)
3. [2026 Best Practices Gap Analysis](#3-2026-best-practices-gap-analysis)
4. [Refactoring Priorities](#4-refactoring-priorities)
5. [Phase 1: Quick Wins (1-2 sessions)](#5-phase-1-quick-wins)
6. [Phase 2: Form Modernization (1 session)](#6-phase-2-form-modernization)
7. [Phase 3: Component Decomposition (2-3 sessions)](#7-phase-3-component-decomposition)
8. [Phase 4: JSON-LD Consolidation (1 session)](#8-phase-4-json-ld-consolidation)
9. [Phase 5: Playwright Characterization Tests (2-3 sessions)](#9-phase-5-playwright-characterization-tests)
10. [Phase 6: Feature-Sliced Design Migration (Future)](#10-phase-6-feature-sliced-design-migration)
11. [What NOT to Refactor](#11-what-not-to-refactor)
12. [Success Metrics](#12-success-metrics)

---

## 1. Current Architecture Assessment

### Strengths (Keep These)

| Area                | Finding                                                        | Verdict                                |
| ------------------- | -------------------------------------------------------------- | -------------------------------------- |
| Server/Client Split | 66% Server Components (120/189), 34% Client (65/189)           | Excellent — only 4/29 pages are client |
| Type Safety         | Zero `any` types across entire codebase                        | Perfect                                |
| Error Handling      | Consistent try-catch + status codes across 27 files            | Uniform                                |
| Data Fetching       | Server Actions for forms, no useEffect data fetching           | Correct pattern                        |
| Code Splitting      | 7 dynamic imports in root layout                               | Smart                                  |
| Barrel Files        | 11 barrel files, all selective exports (no `export *`)         | Tree-shake safe                        |
| Cleanup             | AbortController, Object URL revocation, event listener cleanup | No leaks                               |
| TODO/FIXME          | Zero across entire src/                                        | Clean                                  |

### Architecture Stats

```
Files:              189 TypeScript/TSX
Client Components:   65 (34%) — all justified (interactivity, browser APIs)
Server Components:  120 (66%) — correct default
useEffect Usage:     32 files — all proper patterns (no data fetching)
fetch() in clients:   5 — minimal (geo check, chat API, system status)
API Routes:           9
Server Actions:       2 (contact, newsletter)
Custom Hooks:         3 (content-analytics, vectorizer, platform)
Dynamic Imports:      7 (analytics, chat, cookie consent, service worker)
```

### Dependency Injection Pattern (Notable)

Both Server Actions use a testable DI pattern:

```typescript
// src/app/actions/contact.ts
let dependencies = { sendEmail, verifyTurnstile, rateLimit, getIP };
export const __setDependencies = async (deps) => { ... };
export const __resetDependencies = async () => { ... };
```

This is a clean pattern worth preserving during refactoring.

---

## 2. Code Quality Baseline

### ESLint Summary: 65 Warnings, 0 Errors

| Category                   | Count       | Root Cause                                    |
| -------------------------- | ----------- | --------------------------------------------- |
| Cognitive Complexity (>15) | 5 functions | Legitimate business logic                     |
| Duplicate Strings          | ~36         | JSON-LD `"@context"` / `"https://schema.org"` |
| Duplicate Strings (data)   | ~20         | pSEO data files (expected)                    |
| Duplicate Strings (UI)     | ~9          | Tailwind classes in TraceForge/Nav            |

### High-Complexity Functions

| File                                  | Function           | CC     | Root Cause                                              |
| ------------------------------------- | ------------------ | ------ | ------------------------------------------------------- |
| `traceforge/system-status.tsx:82`     | `SystemStatus`     | **55** | 6 state vars + GPU toggle + password + error handling   |
| `backgrounds/blueprint-grid.tsx:70`   | `drawGrid`         | **31** | Canvas API: 3 nested loop types (cols, rows, diagonals) |
| `newsletter/newsletter-signup.tsx:31` | `NewsletterSignup` | **23** | Validation + API + error states + analytics             |
| `terminal/terminal.tsx:111`           | `renderOutput`     | **19** | Command parsing with format strings                     |
| `traceforge/upload-zone.tsx:26`       | `UploadZone`       | **18** | Drag state + type validation + chunk upload             |

### Logic Density Ratio Distribution

```
0.00-0.05 (very low):  49 files  ██████████  (types, configs, data)
0.05-0.10 (low):       33 files  ██████
0.10-0.20 (moderate):  34 files  ███████
0.20-0.30 (good):      27 files  █████
0.30+     (dense):     61 files  ████████████  (logic-heavy, hooks, tests)
```

82 files below 0.1 LDR — all are types, barrel files, data files, or rendering-heavy pages. None are refactoring candidates.

### Dead Code

**Unused Files (6):**

| File                               | Lines | Status                          | Action             |
| ---------------------------------- | ----- | ------------------------------- | ------------------ |
| `src/components/blog/comments.tsx` | 77    | Dead — incomplete giscus config | Delete             |
| `src/components/chat/index.ts`     | 12    | Dangling barrel                 | Delete             |
| `src/components/pwa/index.ts`      | 12    | Dangling barrel                 | Delete             |
| `src/components/ui/am-logo.tsx`    | 127   | Replaced by newer logo          | Delete             |
| `src/data/services.ts`             | 127   | Duplicate of pSEO data          | Verify then delete |
| `src/env.ts`                       | 17    | Unused Zod env schema           | Delete             |

**Unused Dependencies (3):**

| Package       | Reason                                          |
| ------------- | ----------------------------------------------- |
| `@types/mdx`  | MDX types auto-included via fumadocs            |
| `gray-matter` | Replaced by Keystatic frontmatter handling      |
| `resend`      | SDK unused — direct API calls in Server Actions |

---

## 3. 2026 Best Practices Gap Analysis

### React 19 Gaps

| Best Practice                         | Current State               | Gap                         | Priority |
| ------------------------------------- | --------------------------- | --------------------------- | -------- |
| `useActionState` for forms            | Manual useState + try/catch | Forms work but verbose      | P1       |
| `useOptimistic` for instant feedback  | Not used                    | Minor UX gap                | P3       |
| Progressive enhancement (no-JS forms) | Forms require JS            | Low impact (portfolio site) | P3       |
| `use()` hook for client data          | useEffect + fetch           | Only 5 fetch calls, minor   | P3       |

### Next.js 15 Gaps

| Best Practice                      | Current State                  | Gap                    | Priority |
| ---------------------------------- | ------------------------------ | ---------------------- | -------- |
| Route Groups for layout separation | Single layout structure        | Not needed currently   | None     |
| Parallel Routes for dashboards     | N/A (not a dashboard app)      | N/A                    | None     |
| `template.tsx` for page analytics  | Analytics via dynamic import   | Current approach works | None     |
| Intercepting Routes for modals     | No modals that need deep links | N/A                    | None     |

### Feature-Sliced Design

| Best Practice             | Current State                         | Gap                    | Priority    |
| ------------------------- | ------------------------------------- | ---------------------- | ----------- |
| `src/pages/` thin routing | Components in `src/components/pages/` | Partial alignment      | P3 (future) |
| `src/entities/` for data  | Data in `src/data/`                   | Close to FSD structure | P3 (future) |
| `src/shared/ui/`          | Components in `src/components/ui/`    | Naming difference only | P3 (future) |
| Strict layer dependency   | No enforcement                        | Would need lint rule   | P3 (future) |

### Cloudflare Workers / OpenNext

| Best Practice             | Current State                        | Gap  | Priority |
| ------------------------- | ------------------------------------ | ---- | -------- |
| Typed env bindings        | Already done (`cloudflare-env.d.ts`) | None | Done     |
| R2 cache for ISR          | Configured (`NEXT_CACHE: R2Bucket`)  | None | Done     |
| No `fs`/`path` in runtime | Enforced by CLAUDE.md rules          | None | Done     |

### Testing

| Best Practice     | Current State                | Gap                         | Priority |
| ----------------- | ---------------------------- | --------------------------- | -------- |
| Playwright E2E    | Config exists, minimal tests | Need characterization tests | P2       |
| Visual regression | Not implemented              | Useful before refactoring   | P2       |
| Page Object Model | Not used                     | Needed for maintainability  | P2       |

---

## 4. Refactoring Priorities

### Priority Matrix

| Phase                          | Scope                                   | Effort   | Risk   | Value               |
| ------------------------------ | --------------------------------------- | -------- | ------ | ------------------- |
| **1: Quick Wins**              | Delete dead code, remove unused deps    | 30 min   | Zero   | Clean baseline      |
| **2: Form Modernization**      | useActionState for contact + newsletter | 2-3 hrs  | Low    | React 19 alignment  |
| **3: Component Decomposition** | Split 5 high-CC functions               | 4-6 hrs  | Medium | Maintainability     |
| **4: JSON-LD Consolidation**   | Extract schema constants                | 1-2 hrs  | Low    | -36 ESLint warnings |
| **5: Playwright Tests**        | Characterization + visual regression    | 4-6 hrs  | Low    | Safety net          |
| **6: FSD Migration**           | Restructure to Feature-Sliced Design    | 8-12 hrs | High   | Architecture        |

**Recommended Order:** 1 → 5 → 2 → 3 → 4 → 6

Rationale: Clean dead code first, then add characterization tests as a safety net BEFORE refactoring components.

---

## 5. Phase 1: Quick Wins

**Goal:** Remove dead code and unused dependencies. Zero risk.

### 5.1 Delete Unused Files

```bash
# Dead code
rm src/components/blog/comments.tsx
rm src/components/chat/index.ts
rm src/components/pwa/index.ts
rm src/components/ui/am-logo.tsx
rm src/env.ts

# Verify services.ts is truly duplicate before deleting
# Check: grep -r "from.*data/services" src/
rm src/data/services.ts  # if confirmed unused
```

### 5.2 Remove Unused Dependencies

```bash
npm uninstall @types/mdx gray-matter resend
```

### 5.3 Verify

```bash
npm run build   # Must pass
npm run knip    # Should show fewer unused items
```

---

## 6. Phase 2: Form Modernization

**Goal:** Migrate contact and newsletter forms from manual useState to React 19 `useActionState`.

### 6.1 Contact Form (contact-page.tsx)

**Current pattern (verbose):**

```typescript
const [formStatus, setFormStatus] = useState<FormStatus>("idle");
const [formData, setFormData] = useState({ name, email, ... });
const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setFormStatus("submitting");
  try {
    const result = await submitContactForm({...formData, turnstileToken});
    setFormStatus(result.success ? "success" : "error");
  } catch {
    setFormStatus("error");
  }
}
```

**Target pattern (React 19):**

```typescript
import { useActionState } from "react";

const [state, formAction, isPending] = useActionState(submitContactForm, null);

// In JSX:
<form action={formAction}>
  <input name="name" disabled={isPending} />
  <button disabled={isPending}>
    {isPending ? "Sending..." : "Send"}
  </button>
  {state?.error && <p className="text-burnt-ember">{state.error}</p>}
</form>
```

**Considerations:**

- Server Action signature needs adjustment (accept `FormData` or `prevState + FormData`)
- Turnstile token needs special handling (hidden input or separate state)
- Controlled inputs may still need useState for field-level validation
- Test with dependency injection pattern preserved

### 6.2 Newsletter Form (newsletter-signup.tsx)

Simpler migration — single email field. Same pattern as contact form.

### 6.3 Verify

```bash
npm run build
npm run test:run  # Existing tests should still pass
# Manual test: submit both forms on localhost:3001
```

---

## 7. Phase 3: Component Decomposition

**Goal:** Reduce cognitive complexity of 5 functions below threshold (CC ≤ 15).

### 7.1 SystemStatus (CC=55 → target: ≤15)

**Location:** `src/components/traceforge/system-status.tsx:82`

**Strategy:** Extract 3 sub-components + 1 custom hook.

```
SystemStatus (CC=55)
├── <PasswordPrompt />        # Password input + validation
├── <GpuToggle />             # GPU detection + toggle logic
├── <StatusDisplay />         # Status rendering with conditional sections
└── useSystemStatus()         # State management hook (6 state vars)
```

### 7.2 BlueprintGrid (CC=31 → target: ≤15)

**Location:** `src/components/backgrounds/blueprint-grid.tsx:70`

**Strategy:** Extract canvas drawing into utility functions.

```typescript
// src/components/backgrounds/blueprint-grid-utils.ts
export function drawGridLines(ctx: CanvasRenderingContext2D, config: GridConfig): void;
export function drawDiagonals(ctx: CanvasRenderingContext2D, config: DiagonalConfig): void;
export function drawCrosshairs(ctx: CanvasRenderingContext2D, config: CrosshairConfig): void;
```

### 7.3 NewsletterSignup (CC=23 → target: ≤15)

**Location:** `src/components/newsletter/newsletter-signup.tsx:31`

**Strategy:** `useActionState` migration (Phase 2) will naturally reduce CC by removing manual state management.

### 7.4 Terminal renderOutput (CC=19 → target: ≤15)

**Location:** `src/components/terminal/terminal.tsx:111`

**Strategy:** Extract format string parser into separate function.

```typescript
// Move parsing logic to:
// src/components/terminal/format-parser.ts
export function parseFormatString(text: string): FormattedSegment[];
```

### 7.5 UploadZone (CC=18 → target: ≤15)

**Location:** `src/components/traceforge/upload-zone.tsx:26`

**Strategy:** Extract validation logic.

```typescript
// src/components/traceforge/upload-validators.ts
export function validateFileType(file: File): ValidationResult;
export function validateFileSize(file: File, maxSize: number): ValidationResult;
```

### 7.3 Verify

```bash
npm run build
npx eslint src/ 2>&1 | grep "cognitive-complexity"  # Should show 0 warnings
npm run ldr --verbose  # LDR should stay ≥0.25 avg
```

---

## 8. Phase 4: JSON-LD Consolidation

**Goal:** Eliminate ~36 duplicate string warnings by extracting shared constants.

### 8.1 Create Constants File

```typescript
// src/lib/seo/schema-constants.ts
export const SCHEMA_CONTEXT = "https://schema.org" as const;
export const SCHEMA_TYPES = {
	ORGANIZATION: "Organization",
	ARTICLE: "Article",
	TECH_ARTICLE: "TechArticle",
	FAQ_PAGE: "FAQPage",
	HOW_TO: "HowTo",
	BREADCRUMB_LIST: "BreadcrumbList",
	WEB_PAGE: "WebPage",
	PERSON: "Person",
} as const;

export const SITE_DEFAULTS = {
	name: "Alex Mayhew",
	url: "https://alexmayhew.dev",
	// ... shared values
} as const;
```

### 8.2 Update JSON-LD Components

Replace hardcoded strings in these 6 files:

- `src/components/seo/comparison-json-ld.tsx`
- `src/components/seo/integration-json-ld.tsx`
- `src/components/seo/migration-json-ld.tsx`
- `src/components/seo/role-json-ld.tsx`
- `src/components/seo/service-json-ld.tsx`
- `src/components/seo/technology-json-ld.tsx`

### 8.3 Verify

```bash
npm run build
npx eslint src/ 2>&1 | grep "no-duplicate-string" | wc -l  # Should drop by ~36
```

---

## 9. Phase 5: Playwright Characterization Tests

**Goal:** Document existing behavior before any structural refactoring.

### 9.1 Test Structure

```
e2e/
├── characterization/
│   ├── homepage.spec.ts        # Hero, navigation, CTA rendering
│   ├── blog-listing.spec.ts    # Blog page, hub detection, filtering
│   ├── blog-post.spec.ts       # Post rendering, TOC, reading progress
│   ├── contact-form.spec.ts    # Form submission flow
│   ├── newsletter.spec.ts      # Newsletter signup flow
│   ├── services.spec.ts        # Service pages rendering
│   └── tools.spec.ts           # TraceForge, Pilot tools
├── visual/
│   ├── responsive.spec.ts      # Mobile/tablet/desktop screenshots
│   └── components.spec.ts      # Key component visual baselines
├── pages/                      # Page Object Model
│   ├── homepage.page.ts
│   ├── blog.page.ts
│   └── contact.page.ts
└── fixtures/
    └── test-data.ts
```

### 9.2 Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	webServer: {
		command: "SKIP_CF_DEV=1 PORT=3001 npm run dev",
		url: "http://localhost:3001",
		reuseExistingServer: !process.env.CI,
	},
	use: {
		baseURL: "http://localhost:3001",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		{ name: "mobile", use: { ...devices["iPhone 14"] } },
	],
});
```

### 9.3 Key Characterization Tests

**Homepage:** Verify hero text, navigation links, CTA buttons, background animation presence.

**Blog:** Verify hub posts show "Comprehensive Guides" section, spoke posts show series navigation.

**Contact Form:** Verify form fields render, Turnstile widget loads, submission triggers Server Action.

**Newsletter:** Verify email input, submit button, success/error states.

### 9.4 CI Integration

Add to `.github/workflows/` as a separate job that runs after build:

```yaml
playwright:
  needs: build
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install --with-deps chromium
    - run: npm run build
    - run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

---

## 10. Phase 6: Feature-Sliced Design Migration

**Status:** Future — plan separately when Phases 1-5 complete.

### 10.1 Target Structure

```
src/
├── app/                        # Next.js routing (thin layer)
│   ├── (marketing)/            # Public pages
│   │   ├── page.tsx            # → imports from src/pages/home
│   │   ├── blog/
│   │   ├── about/
│   │   └── services/
│   └── (tools)/                # Tool pages
│       └── tools/
├── pages/                      # FSD Page compositions
│   ├── home/
│   ├── blog/
│   └── contact/
├── widgets/                    # Composite blocks
│   ├── header/
│   ├── footer/
│   └── newsletter-banner/
├── features/                   # User interactions
│   ├── contact-form/
│   ├── newsletter-signup/
│   └── command-palette/
├── entities/                   # Business entities
│   ├── blog-post/
│   ├── project/
│   └── service/
└── shared/                     # Reusable infrastructure
    ├── ui/                     # Atomic components
    ├── lib/                    # Utilities
    ├── seo/                    # JSON-LD, meta
    └── analytics/              # Tracking
```

### 10.2 Migration Strategy: Strangler Fig

1. Create new FSD directories alongside existing code
2. Move one feature at a time (start with `newsletter-signup`)
3. Update imports in `app/` routing layer
4. Verify build passes after each move
5. Delete old location when all imports migrated
6. Repeat for next feature

### 10.3 Dependency Rule

```
app → pages → widgets → features → entities → shared
```

Never import from layers above. Enforce with ESLint `import/no-restricted-paths` or `eslint-plugin-boundaries`.

### 10.4 Prerequisites

- Phase 5 complete (characterization tests as safety net)
- Phase 3 complete (components already decomposed)
- Dedicated session with `/compact` before starting

---

## 11. What NOT to Refactor

### Leave These Alone

| File/Pattern                             | Reason                                                  |
| ---------------------------------------- | ------------------------------------------------------- |
| pSEO data files (8,944 LOC)              | Static data, low LDR is correct                         |
| 82 files with LDR < 0.1                  | Types, configs, barrel files — expected                 |
| 154 unused exports                       | Mostly legitimate APIs/types for extensibility          |
| Large pSEO page components (1000+ lines) | Content-heavy, minimal state, splitting adds complexity |
| Barrel file structure                    | Already uses selective exports, tree-shake safe         |
| Dependency injection in Server Actions   | Clean testable pattern, preserve it                     |
| Dynamic imports in root layout           | Already optimized for code splitting                    |
| Spring animation constants               | Consistent across codebase                              |

### Anti-Refactoring Rules

1. Do NOT extract components just to reduce line count — only extract when reducing cognitive complexity
2. Do NOT add abstractions for data files — pSEO data is intentionally co-located
3. Do NOT convert Server Actions to API routes — Server Actions are the correct 2026 pattern
4. Do NOT add `useOptimistic` unless users report perceived latency
5. Do NOT adopt FSD naming conventions without full migration — partial adoption creates confusion

---

## 12. Success Metrics

### After Phase 1 (Quick Wins)

- [ ] 6 dead files removed
- [ ] 3 unused dependencies removed
- [ ] Build passes clean
- [ ] `npm run knip` shows cleaner output

### After Phase 2 (Form Modernization)

- [ ] Contact form uses `useActionState`
- [ ] Newsletter form uses `useActionState`
- [ ] Both forms still pass existing tests
- [ ] Manual test: forms submit correctly on localhost

### After Phase 3 (Component Decomposition)

- [ ] `npx eslint src/ | grep cognitive-complexity` returns 0 warnings
- [ ] No function exceeds CC=15
- [ ] Average LDR ≥ 0.25

### After Phase 4 (JSON-LD Consolidation)

- [ ] `no-duplicate-string` warnings reduced by ≥30
- [ ] All JSON-LD components import from shared constants

### After Phase 5 (Playwright Tests)

- [ ] ≥10 characterization tests covering key flows
- [ ] Visual regression baselines for 3 breakpoints
- [ ] CI runs Playwright on every PR
- [ ] All tests green

### After Phase 6 (FSD Migration)

- [ ] `src/` follows FSD layer structure
- [ ] No cross-layer imports violating dependency rule
- [ ] All characterization tests still pass
- [ ] Build size unchanged or smaller

---

## Appendix A: Tool Configuration Reference

### ESLint (current)

```javascript
// eslint.config.mjs
{
  "sonarjs/cognitive-complexity": ["warn", 15],
  "sonarjs/no-duplicate-string": ["warn", { threshold: 4 }],
  "sonarjs/no-identical-functions": "warn",
  "perfectionist/sort-imports": ["warn", { type: "natural", ... }],
}
```

### Knip (current)

```typescript
// knip.config.ts
entry: ["src/app/**/page.tsx", "src/app/**/layout.tsx", ...],
ignore: [".source/**", ".open-next/**", ".next/**", ...],
ignoreDependencies: ["critters", "@lhci/cli", ...],
```

### LDR Measurement

```bash
npm run ldr                    # Full report
npm run ldr -- --verbose       # All files
npm run ldr -- --threshold 0.2 # Custom threshold
npm run ldr -- src/components  # Filter by path
```

---

## Appendix B: Research Sources

### React 19

- React v19 Official Release (react.dev)
- useActionState documentation
- useOptimistic for instant UI feedback
- Progressive Enhancement with Server Actions

### Next.js 15

- Route Groups, Parallel Routes, Intercepting Routes documentation
- layout.tsx vs template.tsx differences
- App Router architecture patterns

### Feature-Sliced Design

- Feature-Sliced Design Next.js App Router Guide
- Strict dependency hierarchy enforcement
- Thin routing layer pattern

### Cloudflare Workers / OpenNext

- OpenNext Cloudflare caching documentation
- Typed environment bindings via `cf-typegen`
- Workers AI integration patterns

### Playwright

- Next.js Playwright testing guide
- Visual regression testing patterns
- Page Object Model best practices
- CI sharding for parallel execution

### Strangler Fig Pattern

- Frontend migration with Next.js rewrites
- Feature flag gradual rollout strategy
- Proxy pattern for legacy API migration
