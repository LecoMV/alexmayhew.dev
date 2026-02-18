# Stryker Mutation Testing Research (2026-02-17)

**Status:** CURRENT
**Session:** Evaluating Stryker mutation testing feasibility for alexmayhew.dev (Next.js 15 + Vitest 4)

---

## Key Findings

### 1. Package Status (Verified via npm registry)

| Package                               | Latest Version | Status                       |
| ------------------------------------- | -------------- | ---------------------------- |
| `@stryker-mutator/core`               | 9.5.1          | Active, updated monthly      |
| `@stryker-mutator/vitest-runner`      | 9.5.1          | Active, matches core version |
| `@stryker-mutator/typescript-checker` | 9.5.1          | Active, matches core version |

All three packages are at version 9.5.1 (last published ~January 2026). They are actively maintained.

### 2. Vitest Version Compatibility

- `@stryker-mutator/vitest-runner` peer dependency: `vitest >= 2.0.0`
- **This project uses vitest `^4.0.17`** (installed: `4.0.17`)
- **Verdict: Compatible.** The `>=2.0.0` peer dep range explicitly supports Vitest 4.x.
- Vitest is not bundled; the plugin uses the project's own installation.

### 3. Current Project Test Count

- **389 test cases** across 27 test files in `tests/`
- Vitest config: `vitest.config.ts` — jsdom environment, globals: true, `@vitejs/plugin-react` plugin
- Coverage provider: v8 with thresholds: statements/lines 75%, branches 55%, functions 70%

### 4. How Stryker Works with Vitest

Stryker enforces these settings during mutation runs (non-overridable):

- Single-threaded execution only (threads: true)
- Coverage reporting disabled
- Watch mode disabled
- Bail-on-first-failure
- Always uses "perTest" coverage analysis (ignores `coverageAnalysis` config)

The `vitest.related` option (default: true) means Stryker runs only tests related to the mutated file, which is critical for performance.

**Known limitations:**

- Browser Mode is unsupported
- Only threads mode supported (no disabling threads)
- The `coverageAnalysis` property is ignored

### 5. Critical Business Logic Files for Mutation Testing

#### HIGH PRIORITY (best ROI)

**`src/lib/rate-limit.ts`** (97 lines)

- `checkRateLimit()` — complex branching: new entry vs. expired vs. over-limit
- `getClientIP()` — header priority chain with fallbacks
- `cleanupRateLimits()` — map iteration and deletion
- Tests exist: `tests/lib/rate-limit.test.ts` (157 lines, 13 tests) — good coverage but mutation could expose:
  - Off-by-one on `entry.count > config.limit` vs `>= config.limit`
  - Wrong operator in `now > entry.resetTime` vs `now >= entry.resetTime`
  - Missing `trim()` on x-forwarded-for split result

**`src/data/pseo/validation.ts`** (441 lines)

- `checkQualityGates()` — multiple threshold comparisons (`< MIN_*` guards)
- `countWords()` — regex split + filter logic
- `validateSlugFormat()` — parts.length check, array join logic
- `budgetRangeSchema` — three cross-field `.refine()` validators
  - `mvpMin < mvpMax` (change `<` to `<=` would survive weak tests)
  - `fullMin < fullMax`
  - `mvpMax <= fullMin`
- Tests exist: `tests/data/pseo/validation.test.ts` (591 lines, ~50 tests) — strong coverage
- Mutation targets: boundary operators in quality gate checks

**`src/lib/geo.ts`** (98 lines)

- `getGeoFromHeaders()` — null coalescing chain
- `isGDPRCountry()` / `isEUCountry()` — Set membership checks, null guards
- `getGeoDataForClient()` — compound boolean logic
- Tests exist: `tests/lib/geo.test.ts`

**`src/lib/schemas/contact.ts`** (schema file)

- Zod schema boundary validation (name 2-100 chars, email max 254, message 10-5000)
- Tests exist: `tests/lib/schemas/contact.test.ts` (186 lines) — thorough boundary tests

#### MEDIUM PRIORITY

**`middleware.ts`** (CSP header generation)

- String concatenation logic for CSP directives
- Tests exist: `tests/middleware.test.ts` (187 lines, ~25 tests)
- Mutation value: moderate — mostly string assertions

**`src/app/api/chat/route.ts`** (193 lines)

- `POST` handler: rate limiting check → JSON parse → schema validation → AI binding check
- **Low mutation testing value** for this file because:
  - Heavy dependency on Cloudflare `env.AI` binding (untestable without mocking)
  - Integration with external AI model
  - Most logic is delegated to `checkRateLimit()` and `ChatRequestSchema` (tested elsewhere)
  - The testable business logic is in `rate-limit.ts` and the Zod schemas

#### AVOID for mutation testing

- `src/lib/utils.ts` — single `cn()` function wrapping clsx + tailwind-merge (trivial)
- `src/lib/motion-constants.ts` — just exported constants
- `src/lib/web-vitals.ts` — browser measurement, hard to test
- `src/lib/turnstile.ts` — external HTTP call, network-dependent
- `src/app/**/page.tsx` — React components (already excluded from coverage)

### 6. CI Time Impact

**Raw mutation run estimate (no incremental):**

- Stryker generates ~10-15 mutants per LOC in complex logic files
- For targeted files (rate-limit, validation, geo, schemas): ~250-400 LOC of testable logic
- Estimated mutants: 2,000-4,000
- With `vitest.related: true`, each mutant runs only related tests (~10-30 tests per mutant)
- Each test run: ~100-500ms for this test suite (fast, no async I/O)
- Estimated total: **15-40 minutes** for a full run without incremental mode

**With incremental mode (`--incremental`):**

- First run builds cache in `reports/stryker-incremental.json`
- Subsequent runs only test changed files
- For typical PRs (1-3 files changed): **2-5 minutes**
- Real-world example: Sentry's JS SDK ran 20-25 min for large packages; this project is smaller

**Recommendation for CI:**

- Do NOT run mutation testing on every push (too slow)
- Run on schedule (nightly) OR manually via `workflow_dispatch`
- Use `--incremental` to cache results
- Scope to high-value files only via `mutate` config option

### 7. TypeScript Checker Value Assessment

`@stryker-mutator/typescript-checker` pre-filters mutants that would cause TypeScript compilation errors before running tests.

**Value for this project:**

- This project uses strict TypeScript with no `any` types
- Many mutations that change types (e.g., string → number) would be caught by TS checker
- **Performance improvement: up to 43-50%** fewer mutants to test
- Particularly valuable for the Zod schema validation file (many typed refinements)
- Version 9.5.1 matches core and vitest-runner versions

**Verdict: Add it.** The 43% speed improvement is worth the extra package install for a TypeScript-first project.

### 8. Suggested Stryker Config

```json
{
	"$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
	"_comment": "Mutation testing config — run manually or nightly, NOT on every push",
	"packageManager": "npm",
	"reporters": ["html", "clear-text", "progress", "json"],
	"testRunner": "vitest",
	"vitest": {
		"configFile": "vitest.config.ts"
	},
	"checkers": ["typescript"],
	"tsconfigFile": "tsconfig.json",
	"mutate": [
		"src/lib/rate-limit.ts",
		"src/lib/geo.ts",
		"src/data/pseo/validation.ts",
		"src/lib/schemas/contact.ts",
		"middleware.ts"
	],
	"incremental": true,
	"incrementalFile": "reports/stryker-incremental.json",
	"thresholds": {
		"high": 80,
		"low": 70,
		"break": 60
	},
	"concurrency": 4,
	"timeoutMS": 10000,
	"timeoutFactor": 1.5
}
```

Save this as `stryker.config.json` at the project root.

**Installation:**

```bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/vitest-runner @stryker-mutator/typescript-checker
```

**Run:**

```bash
npx stryker run
```

### 9. Existing Gap Analysis (Mutation-Revealed Weaknesses)

Based on reading the existing tests, these mutations would likely survive:

**rate-limit.ts:**

- `entry.count++` mutated to `entry.count--` — tests check blocking at exact limit, may survive at 1 increment error
- `resetIn: config.windowSeconds` on first request — test checks `resetIn === 120` (exact value), but mutating to 0 or -1 may fail
- `Math.ceil(...)` removed — existing test uses `toBeLessThanOrEqual(90)` not exact value

**validation.ts:**

- `page.uniqueInsights.length < MIN_UNIQUE_INSIGHTS` changed to `<=` — boundary test checks length === MIN-1 as failing, but doesn't test length === MIN as passing (it does, in `makeValidPage`, but not explicitly for this boundary)
- `countWords` filter: `.filter(Boolean)` removed — whitespace-only string test would fail, but " " → 0 already works with trim()

**geo.ts:**

- `EU_COUNTRIES.has(country)` vs `EEA_COUNTRIES.has(country)` — tests may not verify exact set membership

---

## Sources

- [@stryker-mutator/vitest-runner - npm](https://www.npmjs.com/package/@stryker-mutator/vitest-runner) — version 9.5.1, peer dep `vitest >= 2.0.0`
- [Vitest Runner | Stryker Mutator](https://stryker-mutator.io/docs/stryker-js/vitest-runner/) — official docs
- [Incremental | Stryker Mutator](https://stryker-mutator.io/docs/stryker-js/incremental/) — incremental mode
- [TypeScript Checker | Stryker Mutator](https://stryker-mutator.io/docs/stryker-js/typescript-checker/) — 43-50% speedup
- [Announcing StrykerJS 7.0: Vitest and Tap support](https://stryker-mutator.io/blog/announcing-stryker-js-7/) — original Vitest support announcement
- [Mutation-testing our JavaScript SDKs - Sentry](https://sentry.engineering/blog/js-mutation-testing-our-sdks) — real-world CI time data (20-25 min for large packages)
- [Announcing faster TypeScript checking for StrykerJS](https://stryker-mutator.io/blog/announcing-faster-typescript-checking/) — 43% performance improvement
