# fast-check Property-Based Testing Research (2026-02-17)

**Status:** CURRENT
**Session:** Evaluate fast-check for property-based testing of parseFrontmatter, parseTags, checkRateLimit, pseo validation schemas, and chat API schemas.

---

## Key Findings

- `@fast-check/vitest` v0.3 is the correct integration package — no manual `fc.assert()` wiring needed
- `zod-fast-check` v0.9 auto-derives arbitraries from Zod schemas (used in pseo/validation.ts and chat/route.ts)
- Zero vitest config changes needed — `@fast-check/vitest` drops in alongside existing `vitest` setup
- `parseFrontmatter` and `parseTags` are pure functions — high-value property test targets
- `checkRateLimit` has shared mutable state (`rateLimitMap`) — requires unique identifier per property run to avoid cross-contamination
- The rate-limit module already has thorough example-based tests; property tests add value for invariant verification, not coverage

---

## Package Versions (Feb 2026)

| Package              | Version     | Peer Deps             |
| -------------------- | ----------- | --------------------- |
| `fast-check`         | ^3.x / ^4.x | Node >=20.19          |
| `@fast-check/vitest` | ^0.3        | vitest ^1, ^2, ^3, ^4 |
| `zod-fast-check`     | ^0.9        | zod ^3, fast-check ^3 |

---

## Installation

```bash
npm install --save-dev fast-check @fast-check/vitest
# Optional: auto-derive arbitraries from Zod schemas
npm install --save-dev zod-fast-check
```

No changes to `vitest.config.ts` required. The `@fast-check/vitest` package exports its own `test` and `fc` that layer on top of Vitest's runner.

---

## Integration Pattern

```typescript
import { test, fc } from "@fast-check/vitest";
import { describe } from "vitest";

describe("my-module property tests", () => {
	test.prop([fc.string(), fc.string()])(
		"property description that should hold for ALL inputs",
		(a, b) => {
			// Return true/false OR throw on violation
			return myFunction(a, b) satisfies SomeType;
		}
	);
});
```

Two modes:

1. **`test.prop()`** — full property-based testing with shrinking on failure
2. **`test.random()`** — one-time random mode, no shrinking (lightweight)

---

## Candidate Analysis

### 1. `parseTags()` — scripts/generate-blog-index.ts

**Function:**

```typescript
function parseTags(raw: string): string[];
```

**Purity:** Pure. No side effects, no I/O. Ideal PBT target.

**Properties that must hold for ALL valid inputs:**

| Property                                | Invariant                                            |
| --------------------------------------- | ---------------------------------------------------- |
| Always returns array                    | `Array.isArray(parseTags(raw))` is always true       |
| Inline format round-trips               | `parseTags('["a","b"]')` returns `['a','b']`         |
| No input matching `[...]` returns empty | If raw does not match `/^\[(.+)\]$/`, result is `[]` |
| Tags are trimmed                        | No returned tag starts or ends with whitespace       |
| Tags have no surrounding quotes         | No returned tag starts/ends with `"` or `'`          |
| Length matches comma count              | For `["a","b","c"]`, length === 3                    |

**Edge cases generators must cover:**

- Empty string `""`
- String without brackets (no match) `"tag1, tag2"`
- Single-element array `"[tag1]"`
- Tags with internal spaces `["web development","node.js"]`
- Tags with mixed quotes `["tag", 'other']`
- Tags with unicode/special chars `["résumé","c++"]`
- Nested brackets `"[[nested]]"` — currently returns wrong result (bug candidate)
- Empty brackets `"[]"` — returns `['']` not `[]` (potential bug)

**Generator design:**

```typescript
// Valid inline tag array inputs
const inlineTagsArb = fc
	.array(
		fc
			.string({ unit: "grapheme", minLength: 1, maxLength: 20 })
			.filter((s) => !s.includes('"') && !s.includes("'") && !s.includes(",")),
		{ minLength: 1, maxLength: 10 }
	)
	.map((tags) => `["${tags.join('","')}"]`);
```

---

### 2. `parseFrontmatter()` — scripts/generate-blog-index.ts

**Function:**

```typescript
function parseFrontmatter(content: string): Record<string, string>;
```

**Purity:** Pure. No side effects. High-value PBT target.

**Properties that must hold:**

| Property                          | Invariant                                                             |
| --------------------------------- | --------------------------------------------------------------------- |
| No frontmatter returns `{}`       | Content without `---\n...\n---` → empty object                        |
| Key-value pairs are parsed        | A valid `key: value` line is always in result                         |
| Keys are word chars with hyphens  | All result keys match `/^\w[\w-]*$/`                                  |
| Values are trimmed                | No value starts/ends with whitespace                                  |
| Surrounding quotes stripped       | Values wrapped in `"` or `'` have them removed                        |
| Multi-line array items accumulate | Lines starting with `  - item` under a key append to that key's value |
| Idempotent on re-parse            | Parsing the output of serializing back to YAML gives same result      |

**Edge cases generators must cover:**

- Missing closing `---` delimiter
- Keys with special characters (should be ignored by the regex)
- Values with colons in them `title: "My title: subtitle"`
- Multi-line array items mixing with next key
- Empty values `key: ` (empty string after colon)
- Windows line endings `\r\n` vs `\n`
- Content before frontmatter

**Generator design:**

```typescript
const frontmatterKeyArb = fc
	.string({ unit: "grapheme", minLength: 1, maxLength: 20 })
	.filter((s) => /^\w[\w-]*$/.test(s));

const frontmatterValueArb = fc
	.string({ unit: "grapheme", minLength: 0, maxLength: 100 })
	.filter((s) => !s.includes("\n") && !s.startsWith('"') && !s.endsWith('"'));

const frontmatterArb = fc
	.array(fc.record({ key: frontmatterKeyArb, value: frontmatterValueArb }), {
		minLength: 1,
		maxLength: 10,
	})
	.map((pairs) => {
		const body = pairs.map((p) => `${p.key}: ${p.value}`).join("\n");
		return `---\n${body}\n---\n\nContent here.`;
	});
```

---

### 3. `checkRateLimit()` — src/lib/rate-limit.ts

**Function:**

```typescript
function checkRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult;
```

**Purity:** NOT pure — mutates shared `rateLimitMap`. Requires unique identifiers per test run.

**Note:** This function already has thorough example-based tests in `tests/lib/rate-limit.test.ts` covering the main cases. Property tests add value for invariant verification but should use `fc.uuid()` or `fc.uniqueArray` identifiers to prevent map pollution between runs.

**Properties that must hold:**

| Property                                | Invariant                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------- |
| First request always succeeds           | For any fresh identifier, `result.success === true`                       |
| `remaining` starts at `limit - 1`       | First request: `remaining === config.limit - 1`                           |
| `remaining` never goes below 0          | `result.remaining >= 0` always                                            |
| After `limit` requests, next is blocked | After exactly `config.limit` calls, `count > limit` → `success === false` |
| Blocked result has `remaining === 0`    | When `success === false`, `remaining === 0`                               |
| `resetIn` is positive                   | `result.resetIn > 0` always                                               |
| `resetIn <= windowSeconds`              | Result never reports more time than the window                            |
| Different identifiers are independent   | Requests for ID-A don't affect ID-B                                       |

**Config generator:**

```typescript
const rateLimitConfigArb = fc.record({
	limit: fc.integer({ min: 1, max: 20 }),
	windowSeconds: fc.integer({ min: 1, max: 3600 }),
});

// Use uuid to guarantee fresh identifier per run
const freshIdentifierArb = fc.uuid();
```

**IMPORTANT:** Because `rateLimitMap` is module-level state, tests must use Vitest's fake timers AND unique identifiers. The existing `beforeEach/afterEach` vi.useFakeTimers pattern from `rate-limit.test.ts` must be preserved.

---

### 4. `budgetRangeSchema` — src/data/pseo/validation.ts

**Schema:**

```typescript
budgetRangeSchema = z.object({
  mvpMin, mvpMax, fullMin, fullMax (positive numbers)
  currency: z.enum(["USD", "GBP", "EUR"])
  factors: z.array(nonEmptyString).min(2)
}).refine(mvpMin < mvpMax)
 .refine(fullMin < fullMax)
 .refine(mvpMax <= fullMin)
```

**Properties that must hold:**

| Property                          | Invariant                                                           |
| --------------------------------- | ------------------------------------------------------------------- |
| Valid ordering always passes      | Any `a < b <= c < d` with currency and 2+ factors → `success: true` |
| `mvpMin >= mvpMax` always fails   | Schema must reject this                                             |
| `fullMin >= fullMax` always fails | Schema must reject this                                             |
| `mvpMax > fullMin` always fails   | Schema must reject this                                             |
| Empty factors array fails         | `factors: []` is rejected                                           |
| Non-USD/GBP/EUR currency fails    | Arbitrary currency string rejected                                  |

**Generator (using zod-fast-check approach):**

```typescript
import { ZodFastCheck } from "zod-fast-check";

// Valid budget: auto-derived
const validBudgetArb = ZodFastCheck().inputOf(budgetRangeSchema);

// Invalid ordering: hand-crafted
const invalidOrderArb = fc.integer({ min: 1, max: 1000 }).chain((base) =>
	fc.record({
		mvpMin: fc.constant(base + 100), // mvpMin > mvpMax — violates constraint
		mvpMax: fc.constant(base),
		fullMin: fc.integer({ min: base + 200, max: base + 500 }),
		fullMax: fc.integer({ min: base + 600, max: base + 1000 }),
		currency: fc.constantFrom("USD", "GBP", "EUR"),
		factors: fc.array(fc.string({ minLength: 1 }), { minLength: 2 }),
	})
);
```

---

### 5. `seoMetaSchema` — src/data/pseo/validation.ts

**Properties that must hold:**

| Property                               | Invariant                                               |
| -------------------------------------- | ------------------------------------------------------- |
| Title in [30, 70] chars always passes  | Any string s where `30 <= s.length <= 70` → title valid |
| Title < 30 chars always fails          | `s.length < 30` → rejected                              |
| Title > 70 chars always fails          | `s.length > 70` → rejected                              |
| Description in [100, 170] chars passes | Similarly bounded                                       |
| 3+ keywords (each non-empty) passes    | Array of 3+ non-empty strings → valid                   |
| < 3 keywords fails                     | Array of 0-2 keywords → rejected                        |

**This is the clearest Zod property-test target** — bounded string lengths are a classic use case for PBT.

```typescript
// Title: valid range
const validTitleArb = fc.string({ minLength: 30, maxLength: 70 });

// Title: below min
const shortTitleArb = fc.string({ maxLength: 29 });

// Title: above max
const longTitleArb = fc.string({ minLength: 71 });
```

---

### 6. `ChatMessageSchema` / `ChatRequestSchema` — src/app/api/chat/route.ts

**Schemas:**

```typescript
ChatMessageSchema = z.object({
	role: z.enum(["user", "assistant", "system"]),
	content: z.string().max(1000),
});

ChatRequestSchema = z.object({
	messages: z.array(ChatMessageSchema).min(1).max(10),
});
```

**Properties that must hold:**

| Property                                   | Invariant                                               |
| ------------------------------------------ | ------------------------------------------------------- |
| Valid role + content <= 1000 always passes | Any message with valid role and short content → success |
| Content > 1000 chars always fails          | `content.length > 1000` → rejected                      |
| Empty messages array fails                 | `messages: []` → rejected                               |
| 11+ messages fail                          | `messages.length > 10` → rejected                       |
| Non-enum role fails                        | `role: "admin"` → rejected                              |
| Valid array of 1-10 messages passes        | Always accepted                                         |

**Generators:**

```typescript
const validRoleArb = fc.constantFrom("user", "assistant", "system");
const validContentArb = fc.string({ maxLength: 1000 });
const validMessageArb = fc.record({ role: validRoleArb, content: validContentArb });

const validRequestArb = fc.array(validMessageArb, { minLength: 1, maxLength: 10 });
const oversizedRequestArb = fc.array(validMessageArb, { minLength: 11, maxLength: 20 });
```

---

### 7. `countWords()` — src/data/pseo/validation.ts

**Function:**

```typescript
export function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length;
}
```

**Purity:** Pure. Excellent PBT candidate.

**Properties:**

| Property                             | Invariant                                                                         |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| Non-negative always                  | `countWords(any string) >= 0`                                                     |
| Empty string is 0                    | `countWords('') === 0`                                                            |
| Whitespace-only is 0                 | `countWords('   ') === 0`                                                         |
| Concatenating words increments count | `countWords(a + ' ' + b) === countWords(a) + countWords(b)` (when both non-empty) |
| Leading/trailing whitespace ignored  | `countWords('  text  ') === countWords('text')`                                   |
| Multiple spaces = single separator   | `countWords('a  b') === 2`                                                        |

---

### 8. `validateSlugFormat()` — src/data/pseo/validation.ts

**Function:**

```typescript
export function validateSlugFormat(slug: string): boolean {
	const parts = slug.split("-");
	if (parts.length < 2) return false;
	const tech = parts[0];
	const industry = parts.slice(1).join("-");
	return tech in TECHNOLOGY_LABELS && industry in INDUSTRY_LABELS;
}
```

**Purity:** Pure. Worth testing.

**Properties:**

- Any slug without a hyphen returns false
- Any slug where `parts[0]` is not a known technology key returns false
- Valid `tech + '-' + industry` combinations return true

---

## Estimated Test Count

| File                               | Functions                                                                | Example-based (existing) | Property tests to add | Priority |
| ---------------------------------- | ------------------------------------------------------------------------ | ------------------------ | --------------------- | -------- |
| `generate-blog-index.ts`           | `parseTags`, `parseFrontmatter`                                          | 0                        | ~8                    | HIGH     |
| `rate-limit.ts`                    | `checkRateLimit`, `getClientIP`                                          | 8 (existing)             | ~4                    | MEDIUM   |
| `pseo/validation.ts`               | `countWords`, `seoMetaSchema`, `budgetRangeSchema`, `validateSlugFormat` | 0                        | ~10                   | HIGH     |
| `api/chat/route.ts` (schemas only) | `ChatMessageSchema`, `ChatRequestSchema`                                 | 0                        | ~6                    | MEDIUM   |

**Total: approximately 28 property tests covering the highest-value invariants.**

---

## Example Test File Structure

```typescript
// tests/lib/property/parse-frontmatter.property.test.ts
import { describe } from "vitest";
import { test, fc } from "@fast-check/vitest";

// parseTags and parseFrontmatter must be exported from the script
// OR copied into a testable lib file

describe("parseTags properties", () => {
	test.prop([
		fc.array(
			fc
				.string({ unit: "grapheme", minLength: 1, maxLength: 20 })
				.filter((s) => !s.includes('"') && !s.includes(",") && s.trim() === s),
			{ minLength: 1, maxLength: 8 }
		),
	])("always returns an array", (tags) => {
		const raw = `["${tags.join('","')}"]`;
		return Array.isArray(parseTags(raw));
	});

	test.prop([
		fc.array(
			fc
				.string({ unit: "grapheme", minLength: 1, maxLength: 20 })
				.filter((s) => !s.includes('"') && !s.includes(",") && s.trim() === s),
			{ minLength: 1, maxLength: 8 }
		),
	])("parsed tags are trimmed", (tags) => {
		const raw = `["${tags.join('","')}"]`;
		return parseTags(raw).every((t) => t === t.trim());
	});

	test.prop([fc.string()])("non-bracket input returns empty array", (raw) => {
		fc.pre(!raw.startsWith("[") || !raw.endsWith("]"));
		return parseTags(raw).length === 0;
	});
});
```

```typescript
// tests/lib/property/seo-schema.property.test.ts
import { describe } from "vitest";
import { test, fc } from "@fast-check/vitest";
import { seoMetaSchema, SEO_TITLE_MIN, SEO_TITLE_MAX } from "@/data/pseo/validation";

describe("seoMetaSchema title invariants", () => {
	const validDescArb = fc.string({ minLength: 100, maxLength: 170 });
	const validKeywordsArb = fc.array(fc.string({ minLength: 1, maxLength: 30 }), {
		minLength: 3,
		maxLength: 10,
	});

	test.prop([
		fc.string({ minLength: SEO_TITLE_MIN, maxLength: SEO_TITLE_MAX }),
		validDescArb,
		validKeywordsArb,
	])("titles in valid range always pass", (title, description, keywords) => {
		const result = seoMetaSchema.safeParse({ title, description, keywords });
		return result.success;
	});

	test.prop([fc.string({ maxLength: SEO_TITLE_MIN - 1 }), validDescArb, validKeywordsArb])(
		"titles below min always fail",
		(title, description, keywords) => {
			const result = seoMetaSchema.safeParse({ title, description, keywords });
			return !result.success;
		}
	);

	test.prop([
		fc.string({ minLength: SEO_TITLE_MAX + 1, maxLength: SEO_TITLE_MAX + 100 }),
		validDescArb,
		validKeywordsArb,
	])("titles above max always fail", (title, description, keywords) => {
		const result = seoMetaSchema.safeParse({ title, description, keywords });
		return !result.success;
	});
});
```

```typescript
// tests/lib/property/rate-limit.property.test.ts
import { describe, beforeEach, afterEach, vi } from "vitest";
import { test, fc } from "@fast-check/vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit properties", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	const configArb = fc.record({
		limit: fc.integer({ min: 1, max: 20 }),
		windowSeconds: fc.integer({ min: 1, max: 3600 }),
	});

	test.prop([fc.uuid(), configArb])("first request always succeeds", (id, config) => {
		const result = checkRateLimit(id, config);
		return result.success === true;
	});

	test.prop([fc.uuid(), configArb])("remaining never goes below zero", (id, config) => {
		// Exhaust the limit
		for (let i = 0; i < config.limit + 5; i++) {
			checkRateLimit(id, config);
		}
		const result = checkRateLimit(id, config);
		return result.remaining >= 0;
	});

	test.prop([fc.uuid(), configArb])("resetIn is always positive", (id, config) => {
		const result = checkRateLimit(id, config);
		return result.resetIn > 0;
	});
});
```

---

## Viability Assessment

| Function             | Pure?             | Testable as-is?   | Blocker                                   |
| -------------------- | ----------------- | ----------------- | ----------------------------------------- |
| `parseTags`          | Yes               | No — not exported | Must export from script or extract to lib |
| `parseFrontmatter`   | Yes               | No — not exported | Must export from script or extract to lib |
| `checkRateLimit`     | No (shared state) | Yes               | Use `fc.uuid()` identifiers               |
| `countWords`         | Yes               | Yes               | None                                      |
| `validateSlugFormat` | Yes               | Yes               | None                                      |
| `seoMetaSchema`      | N/A (Zod)         | Yes               | None                                      |
| `budgetRangeSchema`  | N/A (Zod)         | Yes               | None                                      |
| `ChatMessageSchema`  | N/A (Zod)         | Yes               | None                                      |

**Key blocker:** `parseTags` and `parseFrontmatter` are not exported from `generate-blog-index.ts`. Either:

1. Extract them to `src/lib/frontmatter.ts` (recommended — reusable)
2. Test via the script's output (integration test, less precise)

---

## zod-fast-check for Zod Schemas

`zod-fast-check` can auto-derive valid inputs from any Zod schema:

```typescript
import { ZodFastCheck } from "zod-fast-check";
import { seoMetaSchema } from "@/data/pseo/validation";

const validSeoArb = ZodFastCheck().inputOf(seoMetaSchema);

test.prop([validSeoArb])("any auto-generated valid SEO meta passes", (seoData) => {
	return seoMetaSchema.safeParse(seoData).success;
});
```

**Limitation:** `zod-fast-check` generates values that satisfy the schema by construction — so this tests that the schema is consistent with itself, not that it catches real invalid data. Still useful for regression and round-trip testing.

---

## Sources

- [fast-check official docs](https://fast-check.dev/)
- [@fast-check/vitest npm](https://www.npmjs.com/package/@fast-check/vitest)
- [GitHub: @fast-check/vitest README](https://github.com/dubzzz/fast-check/tree/main/packages/vitest)
- [fast-check ecosystem](https://fast-check.dev/docs/ecosystem/)
- [zod-fast-check GitHub](https://github.com/DavidTimms/zod-fast-check)
- [zod-fast-check npm](https://www.npmjs.com/package/zod-fast-check)
- [Beyond flaky tests — fast-check + Vitest blog](https://fast-check.dev/blog/2025/03/28/beyond-flaky-tests-bringing-controlled-randomness-to-vitest/)
- [fast-check GitHub releases](https://github.com/dubzzz/fast-check/releases)
