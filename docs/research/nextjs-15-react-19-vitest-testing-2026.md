# Next.js 15 + React 19 + Vitest Testing Best Practices (2026)

**Status:** CURRENT
**Research Date:** 2026-02-15
**Stack:** Next.js 15 App Router + React 19 + Vitest + Cloudflare Workers (OpenNext)

## Executive Summary

**Critical Limitation:** Async Server Components are **not currently supported** by Vitest. Use E2E tests (Playwright) for async components.

**Recommended Approach:**

- Unit tests: Synchronous Server Components + Client Components (Vitest + React Testing Library)
- E2E tests: Async Server Components, full user flows (Playwright)
- Integration tests: API routes, Server Actions, middleware

**Realistic Coverage Target:** 85% for lines, functions, branches, and statements (industry standard for 2026).

---

## 1. Next.js 15 App Router Testing Patterns

### 1.1 Server Components (Synchronous Only)

**What Works:**

- Synchronous Server Components can be tested with Vitest + React Testing Library
- Server Components without async data fetching

**What Doesn't Work:**

- Async Server Components (use E2E tests instead)

**Example Test Pattern:**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MyServerComponent from '@/components/MyServerComponent'

describe('MyServerComponent', () => {
  it('renders expected content', () => {
    render(<MyServerComponent />)
    expect(screen.getByRole('heading', { name: /expected text/i })).toBeInTheDocument()
  })
})
```

**Source:** [Testing: Vitest | Next.js](https://nextjs.org/docs/app/guides/testing/vitest)

### 1.2 Server Actions

**Pattern:** Use `vi.mock()` to mock Next.js modules and test error handling.

**Example:**

```typescript
import { vi, describe, it, expect } from "vitest";

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

describe("submitContactForm", () => {
	it("handles validation errors", async () => {
		const formData = new FormData();
		formData.append("email", "invalid");

		const result = await submitContactForm(formData);
		expect(result.error).toBeDefined();
	});
});
```

**Note:** Server Actions are async functions that run on the server. Test them like regular async functions, mocking Next.js-specific APIs.

**Source:** [NextJs Unit Testing and End-to-End Testing](https://strapi.io/blog/nextjs-testing-guide-unit-and-e2e-tests-with-vitest-and-playwright)

### 1.3 API Route Handlers (app/api/\*)

**Pattern:** Use direct function calls with Request/Response mocks.

**Example:**

```typescript
import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
	it("returns 200 with health status", async () => {
		const response = await GET(new Request("http://localhost:3000/api/health"));
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data.status).toBe("healthy");
	});
});
```

**Source:** [API Testing with Vitest in Next.js](https://medium.com/@sanduni.s/api-testing-with-vitest-in-next-js-a-practical-guide-to-mocking-vs-spying-5e5b37677533)

### 1.4 Middleware

**Pattern:** Test middleware as a pure function with Request/Response mocks.

**Example:**

```typescript
import { describe, it, expect } from "vitest";
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

describe("middleware", () => {
	it("redirects unauthenticated users", async () => {
		const request = new NextRequest("http://localhost:3000/dashboard");
		const response = await middleware(request);

		expect(response.status).toBe(307);
		expect(response.headers.get("location")).toContain("/login");
	});
});
```

### 1.5 Mocking next/navigation

**Recommended Library:** `next-router-mock` (supports App Router)

**Installation:**

```bash
npm install --save-dev next-router-mock
```

**Vitest Setup:**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		alias: {
			"next/navigation": "next-router-mock/navigation",
		},
	},
});
```

**Programmatic Mock (Alternative):**

```typescript
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
	}),
	usePathname: () => "/current/path",
	useSearchParams: () => new URLSearchParams("?key=value"),
}));
```

**Sources:**

- [next-router-mock - npm](https://www.npmjs.com/package/next-router-mock)
- [How to mock useRouter from next/navigation?](https://github.com/vercel/next.js/discussions/48937)

### 1.6 Mocking next/headers

**Pattern:** Mock `headers()` and `cookies()` as functions returning Web API types.

**Example:**

```typescript
import { vi } from "vitest";

vi.mock("next/headers", () => ({
	headers: () =>
		new Headers({
			"user-agent": "Mozilla/5.0",
			"x-forwarded-for": "127.0.0.1",
		}),
	cookies: () => ({
		get: vi.fn((name) => ({ name, value: "mock-value" })),
		getAll: vi.fn(() => []),
		has: vi.fn(() => true),
		set: vi.fn(),
		delete: vi.fn(),
	}),
}));
```

---

## 2. React 19 Testing Considerations

### 2.1 The `use()` Hook

**Key Change:** React 19 introduces `use()` to read resources (Promises, Context) in render.

**Testing Strategy:**

- For components using `use()` with Promises: wrap in `<Suspense>` boundary
- Use `waitFor()` from React Testing Library to handle async state updates

**Example:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense } from 'react'

describe('ComponentWithUse', () => {
  it('resolves promise and renders data', async () => {
    const dataPromise = Promise.resolve({ name: 'Test' })

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <ComponentWithUse dataPromise={dataPromise} />
      </Suspense>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})
```

**Source:** [use – React](https://react.dev/reference/react/use)

### 2.2 Server Components with Async Data

**Best Practice:** Prefer `async/await` in Server Components over `use()`.

**Reason:** `async/await` picks up rendering from the await point, whereas `use()` re-renders the component after data resolves.

**Testing:** Since async Server Components aren't supported by Vitest, test these with Playwright E2E tests.

**Source:** [Developer Guide to React 19: Async Handling](https://www.callstack.com/blog/the-complete-developer-guide-to-react-19-part-1-async-handling)

### 2.3 Form Hooks: `useFormStatus` / `useFormState` / `useActionState`

**Pattern:** Test the component behavior, not the hook internals.

**Example (useFormStatus):**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock the hook
vi.mock('react-dom', () => ({
  ...vi.importActual('react-dom'),
  useFormStatus: () => ({ pending: true })
}))

describe('SubmitButton', () => {
  it('shows loading state when form is pending', () => {
    render(<SubmitButton />)
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
  })
})
```

**Note:** These hooks only work inside `<form>` with Server Actions. Test the full form flow in integration tests.

**Source:** [React v19 – React](https://react.dev/blog/2024/12/05/react-19)

### 2.4 Breaking Changes from React 18

**No major breaking changes for testing patterns.** React 19 is largely additive.

**Key Additions:**

- `use()` hook for reading resources
- Server Components (already existed, now stable)
- Server Actions (now stable)
- Improved async handling with Suspense

**Source:** [What's new in React 19 - Vercel](https://vercel.com/blog/whats-new-in-react-19)

---

## 3. Vitest Best Practices for Next.js

### 3.1 Environment Configuration

**Recommendation:** Use `jsdom` for DOM environment (React Testing Library compatibility).

**vitest.config.ts:**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
	},
});
```

**vitest.setup.ts:**

```typescript
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
	cleanup();
});
```

**Source:** [Setting up Vitest for Next.js 15](https://www.wisp.blog/blog/setting-up-vitest-for-nextjs-15)

### 3.2 Path Aliases

**Use `vite-tsconfig-paths`** to automatically resolve Next.js path aliases (`@/`, `~/`).

**Installation:**

```bash
npm install --save-dev vite-tsconfig-paths
```

**Configuration:** Already shown in vitest.config.ts above.

### 3.3 Testing Async Server Components

**Current Status:** **Not supported** by Vitest.

**Workaround:** Use Playwright for E2E tests of pages with async Server Components.

**Source:** [Testing: Vitest | Next.js](https://nextjs.org/docs/app/guides/testing/vitest)

### 3.4 Mocking Strategies

**Two Primary Approaches:**

1. **Mocking (`vi.mock`):** Completely replaces module implementations.
2. **Spying (`vi.spyOn`):** Observes function calls while preserving original behavior.

**When to Use:**

- **Mock:** External dependencies (APIs, Next.js modules, database calls)
- **Spy:** Internal functions where you need to verify calls but preserve logic

**Example (Mock):**

```typescript
vi.mock("@/lib/api", () => ({
	fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: "Test" })),
}));
```

**Example (Spy):**

```typescript
import * as api from "@/lib/api";

const spy = vi.spyOn(api, "fetchUser");
// ... perform test ...
expect(spy).toHaveBeenCalledWith(123);
```

**Source:** [API Testing with Vitest in Next.js](https://medium.com/@sanduni.s/api-testing-with-vitest-in-next-js-a-practical-guide-to-mocking-vs-spying-5e5b37677533)

### 3.5 Snapshot Testing vs Assertion Testing

**Recommendation:** **Prefer assertion testing** for React components.

**Why:**

- Snapshots are brittle (break on any markup change)
- Hard to review in PRs (JSON diffs are noisy)
- Don't test component behavior, just output

**When Snapshots Are OK:**

- JSON-LD structured data (exact match expected)
- Error messages (exact text expected)
- Generated config files

**Example (Assertion Testing - Preferred):**

```typescript
expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome");
expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
```

**Example (Snapshot - Use Sparingly):**

```typescript
const jsonLd = generateArticleJsonLd(post);
expect(jsonLd).toMatchSnapshot();
```

---

## 4. Component Testing Strategy

### 4.1 What to Test in Client Components

**Test:**

- User interactions (clicks, typing, form submissions)
- State changes (toggle, counter, form validation)
- Conditional rendering (show/hide based on state)
- Event handlers (onClick, onSubmit callbacks)
- Error boundaries (error states)
- Accessibility (ARIA attributes, keyboard navigation)

**Example:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Counter from '@/components/Counter'

describe('Counter', () => {
  it('increments count on button click', () => {
    render(<Counter />)

    const button = screen.getByRole('button', { name: /increment/i })
    const count = screen.getByText('Count: 0')

    fireEvent.click(button)

    expect(screen.getByText('Count: 1')).toBeInTheDocument()
  })
})
```

**Source:** [Best Practices for Using React Testing Library](https://medium.com/@ignatovich.dm/best-practices-for-using-react-testing-library-0f71181bb1f4)

### 4.2 What NOT to Test (Implementation Details)

**Don't Test:**

- Internal component state (e.g., `useState` values)
- Private functions or class methods
- CSS class names (unless functional, like `aria-*`)
- Third-party library internals (trust them)
- Exact HTML structure (unless accessibility-critical)
- How state is stored (primitive vs array vs object)

**Why:** Tests become brittle and fail during refactoring even when behavior is unchanged.

**Example of BAD Test:**

```typescript
// ❌ Don't test state implementation
expect(component.state.isOpen).toBe(true);

// ✅ Test observable behavior
expect(screen.getByRole("dialog")).toBeVisible();
```

**Source:** [What it means to not test implementation details in React](https://maxrozen.com/dont-test-implementation-details-react)

### 4.3 Framer Motion Animations

**Recommendation:** **Skip animation testing in unit tests** OR mock Framer Motion entirely.

**Why:**

- Animations are timing-dependent (flaky tests)
- Don't affect user-facing functionality (cosmetic)
- Hard to test in jsdom (no real layout engine)

**Option 1: Mock Framer Motion (Recommended)**

```typescript
vi.mock("framer-motion", () => ({
	motion: {
		div: "div",
		span: "span",
		section: "section",
		// ... other elements you use
	},
	AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
	useAnimation: () => ({
		start: vi.fn(),
		stop: vi.fn(),
	}),
}));
```

**Option 2: Disable Animations**

```typescript
import { MotionGlobalConfig } from "framer-motion";

beforeAll(() => {
	MotionGlobalConfig.skipAnimations = true;
});
```

**Option 3: Test Animation Completion (E2E Only)**
Use Playwright to wait for animations:

```typescript
await expect(page.locator("[data-animation-complete]")).toBeVisible();
```

**Sources:**

- [Mock Framer Motion with Jest](https://www.hectane.com/blog/mock-framer-motion-with-jest)
- [Animations • Chromatic docs](https://www.chromatic.com/docs/animations/)

### 4.4 Context Providers

**Pattern:** Wrap components with necessary providers in tests.

**Example:**

```typescript
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/contexts/theme'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  )
}

describe('ThemedButton', () => {
  it('applies theme colors', () => {
    renderWithTheme(<ThemedButton />)
    // ... assertions
  })
})
```

**Best Practice:** Create custom render functions for common provider combinations.

### 4.5 Testing Hooks Separately

**Library:** `@testing-library/react-hooks` (now deprecated — use `renderHook` from `@testing-library/react`)

**Pattern:**

```typescript
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "@/hooks/useCounter";

describe("useCounter", () => {
	it("increments counter", () => {
		const { result } = renderHook(() => useCounter());

		expect(result.current.count).toBe(0);

		act(() => {
			result.current.increment();
		});

		expect(result.current.count).toBe(1);
	});
});
```

**Source:** [How to Test React Hooks with @testing-library/react-hooks](https://oneuptime.com/blog/post/2026-01-15-test-react-hooks-testing-library/view)

---

## 5. Edge Cases for This Stack

### 5.1 Cloudflare Workers Edge Runtime Compatibility

**Critical:** Code must be compatible with Cloudflare Workers (`nodejs_compat`).

**Testing Strategy:**

- Run `npm run preview:worker` to test locally in Workers runtime (wrangler dev)
- Do NOT use Node.js-specific APIs in runtime code (`fs`, `path`, `process`, etc.)
- Use Web Standard APIs (Request, Response, Headers, FormData)

**Example Test (Avoid Node.js APIs):**

```typescript
// ❌ This will fail in Workers
import fs from "fs";
const data = fs.readFileSync("file.txt");

// ✅ Use Web APIs
const response = await fetch("/api/data");
const data = await response.text();
```

**Source:** [Cloudflare Pages and Next.js: Use OpenNext](https://www.thetombomb.com/posts/nextjs-pages-cloudflare-pages)

### 5.2 Testing MDX Content Rendering

**Pattern:** Test rendered MDX as React components.

**Example:**

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BlogPost from '@/content/blog/example.mdx'

describe('BlogPost MDX', () => {
  it('renders frontmatter metadata', () => {
    render(<BlogPost />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Expected Title')
  })

  it('renders code blocks', () => {
    render(<BlogPost />)
    expect(screen.getByRole('code')).toBeInTheDocument()
  })
})
```

**Fumadocs Specific:**

- Test `page.data.structuredData` for Search API
- Validate MDX frontmatter schema (use Zod)

**Source:** [Fumadocs - MDX](https://www.fumadocs.dev/docs/mdx)

### 5.3 Testing SEO/JSON-LD Structured Data

**Pattern:** Validate JSON-LD output against schema.

**Example:**

```typescript
import { describe, it, expect } from "vitest";
import { generateArticleJsonLd } from "@/lib/seo";

describe("generateArticleJsonLd", () => {
	it("generates valid Article schema", () => {
		const post = {
			title: "Test Post",
			description: "Test description",
			publishedAt: "2026-01-01",
			author: { name: "Alex Mayhew" },
		};

		const jsonLd = generateArticleJsonLd(post);

		expect(jsonLd["@type"]).toBe("Article");
		expect(jsonLd.headline).toBe("Test Post");
		expect(jsonLd.datePublished).toBe("2026-01-01");
		expect(jsonLd.author).toEqual({
			"@type": "Person",
			name: "Alex Mayhew",
		});
	});
});
```

**Validation Tools:**

- [Rich Results Test (Google)](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- Use `schema-dts` package for TypeScript types

**Source:** [Add Structured Data to your Next.js site with JSON-LD](https://mikebifulco.com/posts/structured-data-json-ld-for-next-js-sites)

### 5.4 Testing Form Submissions with Turnstile CAPTCHA

**Strategy:** Mock Turnstile in tests, test real integration in E2E.

**Mock Setup:**

```typescript
vi.mock("@/lib/turnstile", () => ({
	validateTurnstile: vi.fn(() => Promise.resolve({ success: true })),
}));
```

**Unit Test (Validation Logic):**

```typescript
import { describe, it, expect, vi } from "vitest";
import { submitContactForm } from "@/app/actions/contact";
import * as turnstile from "@/lib/turnstile";

vi.spyOn(turnstile, "validateTurnstile");

describe("submitContactForm", () => {
	it("rejects invalid CAPTCHA", async () => {
		vi.mocked(turnstile.validateTurnstile).mockResolvedValue({ success: false });

		const formData = new FormData();
		formData.append("cf-turnstile-response", "invalid-token");

		const result = await submitContactForm(formData);
		expect(result.error).toBe("CAPTCHA validation failed");
	});
});
```

**E2E Test (Real Turnstile):**

```typescript
// Use Playwright to test actual form submission with Turnstile
test("submits contact form with CAPTCHA", async ({ page }) => {
	await page.goto("/contact");
	await page.fill('input[name="email"]', "test@example.com");
	// Wait for Turnstile widget to load
	await page.waitForSelector("[data-turnstile-loaded]");
	await page.click('button[type="submit"]');
	await expect(page.locator(".success-message")).toBeVisible();
});
```

---

## 6. Test Organization and Naming

### 6.1 File Structure

**Recommended:** Co-located test files (same directory as component).

**Structure:**

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── button.test.tsx
│   ├── pages/
│   │   ├── home-page.tsx
│   │   └── home-page.test.tsx
├── app/
│   ├── api/
│   │   └── health/
│   │       ├── route.ts
│   │       └── route.test.ts
│   ├── actions/
│   │   ├── contact.ts
│   │   └── contact.test.ts
```

**Alternative:** Separate `__tests__/` or `tests/` directory (mirrors src structure).

**Why Co-located:**

- Easy to find tests for a given file
- Tests move with code during refactoring
- Clear which files lack tests

### 6.2 Naming Conventions

**File Names:**

- `component.test.tsx` (preferred)
- `component.spec.tsx` (alternative)

**Test Suites (`describe`):**

- Use component/function name: `describe('Button', ...)`
- Nest for variants: `describe('Button - disabled state', ...)`

**Test Cases (`it`):**

- Start with action/behavior: `it('renders with primary variant', ...)`
- Use present tense: "renders", "calls", "displays"
- Be specific: "displays error message when email is invalid"

**Example:**

```typescript
describe('NewsletterSignup', () => {
  describe('validation', () => {
    it('shows error when email is invalid', () => { ... })
    it('shows error when email is empty', () => { ... })
  })

  describe('submission', () => {
    it('calls onSubmit with email when form is valid', () => { ... })
    it('disables submit button while submitting', () => { ... })
  })
})
```

**Source:** [React Testing Library Basics, Best Practices](https://github.com/patternfly/patternfly-react/wiki/React-Testing-Library-Basics,-Best-Practices,-and-Guidelines)

### 6.3 Parameterized Tests (`describe.each` / `it.each`)

**Use When:** Testing same behavior with multiple inputs.

**Example:**

```typescript
describe.each([
	{ input: "", expected: "Email is required" },
	{ input: "invalid", expected: "Invalid email format" },
	{ input: "test@", expected: "Invalid email format" },
])("email validation", ({ input, expected }) => {
	it(`returns "${expected}" for input "${input}"`, () => {
		const result = validateEmail(input);
		expect(result.error).toBe(expected);
	});
});
```

**Benefits:**

- Reduces test duplication
- Easy to add new cases
- Clear failure messages

### 6.4 Coverage Targets

**Recommended for Portfolio Site:**

| Metric     | Target | Rationale                                      |
| ---------- | ------ | ---------------------------------------------- |
| Lines      | 85%    | Industry standard for quality-focused projects |
| Functions  | 85%    | Ensures all public APIs are tested             |
| Branches   | 85%    | Covers conditional logic (if/else, ternary)    |
| Statements | 85%    | Similar to lines, catches edge cases           |

**Configuration (vitest.config.ts):**

```typescript
export default defineConfig({
	test: {
		coverage: {
			provider: "v8", // or 'istanbul'
			reporter: ["text", "html", "json-summary"],
			thresholds: {
				lines: 85,
				functions: 85,
				branches: 85,
				statements: 85,
			},
			exclude: [
				"node_modules/",
				".next/",
				"vitest.config.ts",
				"**/*.d.ts",
				"**/*.test.{ts,tsx}",
				"**/types/**",
			],
		},
	},
});
```

**Note:** 85% is achievable for a portfolio site without over-testing. Don't chase 100% — diminishing returns.

**Source:** [Vitest Coverage Configuration](https://vitest.dev/config/coverage)

---

## Quick Start Checklist

- [ ] Install dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `vite-tsconfig-paths`
- [ ] Create `vitest.config.ts` with jsdom environment + React plugin + tsconfig paths
- [ ] Create `vitest.setup.ts` with `@testing-library/jest-dom/vitest` import
- [ ] Add test scripts to `package.json`: `"test": "vitest"`, `"test:ui": "vitest --ui"`
- [ ] Mock Framer Motion to avoid animation flakiness
- [ ] Set up `next-router-mock` for `next/navigation` mocking
- [ ] Configure coverage thresholds (85% across the board)
- [ ] Write unit tests for Client Components + synchronous Server Components
- [ ] Write E2E tests (Playwright) for async Server Components + full user flows
- [ ] Validate JSON-LD structured data with schema validators

---

## Key Takeaways

1. **Async Server Components require E2E tests** — Vitest doesn't support them yet.
2. **Mock Framer Motion** — animations cause flaky tests in unit tests.
3. **Use `next-router-mock`** for App Router navigation mocking.
4. **Test behavior, not implementation** — focus on what users see/do.
5. **85% coverage is realistic** — don't chase 100%.
6. **Co-locate tests** — easier to maintain and refactor.
7. **Use Playwright for E2E** — complements Vitest unit tests.

---

## Sources

### Official Documentation

- [Testing: Vitest | Next.js](https://nextjs.org/docs/app/guides/testing/vitest)
- [React v19 – React](https://react.dev/blog/2024/12/05/react-19)
- [use – React](https://react.dev/reference/react/use)
- [Guides: JSON-LD | Next.js](https://nextjs.org/docs/app/guides/json-ld)
- [Vitest Coverage Configuration](https://vitest.dev/config/coverage)

### Community Guides

- [NextJs Unit Testing and End-to-End Testing](https://strapi.io/blog/nextjs-testing-guide-unit-and-e2e-tests-with-vitest-and-playwright)
- [Setting up Vitest for Next.js 15](https://www.wisp.blog/blog/setting-up-vitest-for-nextjs-15)
- [Developer Guide to React 19: Async Handling](https://www.callstack.com/blog/the-complete-developer-guide-to-react-19-part-1-async-handling)
- [What it means to not test implementation details in React](https://maxrozen.com/dont-test-implementation-details-react)
- [Best Practices for Using React Testing Library](https://medium.com/@ignatovich.dm/best-practices-for-using-react-testing-library-0f71181bb1f4)

### Testing Patterns

- [API Testing with Vitest in Next.js](https://medium.com/@sanduni.s/api-testing-with-vitest-in-next-js-a-practical-guide-to-mocking-vs-spying-5e5b37677533)
- [How to mock useRouter from next/navigation?](https://github.com/vercel/next.js/discussions/48937)
- [Mock Framer Motion with Jest](https://www.hectane.com/blog/mock-framer-motion-with-jest)
- [How to Test React Hooks with @testing-library/react-hooks](https://oneuptime.com/blog/post/2026-01-15-test-react-hooks-testing-library/view)

### Edge Runtime & Cloudflare

- [Deploy your Next.js app to Cloudflare Workers with OpenNext](https://blog.cloudflare.com/deploying-nextjs-apps-to-cloudflare-workers-with-the-opennext-adapter/)
- [Cloudflare Pages and Next.js: Use OpenNext](https://www.thetombomb.com/posts/nextjs-pages-cloudflare-pages)

### MDX & SEO

- [Fumadocs - MDX](https://www.fumadocs.dev/docs/mdx)
- [Add Structured Data to your Next.js site with JSON-LD](https://mikebifulco.com/posts/structured-data-json-ld-for-next-js-sites)
