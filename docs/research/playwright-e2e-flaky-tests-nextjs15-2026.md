# Playwright E2E Flaky Tests — Next.js 15 + Cloudflare (2026-03-20)

**Status:** CURRENT
**Session:** Research for fixing flaky E2E tests in alexmayhew-dev; all findings apply directly to the e2e/ suite

---

## Executive Summary

Every `waitForLoadState("networkidle")` and `waitForTimeout()` call in the current test suite is a
known source of flakiness. The Playwright team, the `eslint-plugin-playwright` no-networkidle rule,
and the Biome `noPlaywrightNetworkidle` lint rule all categorize `networkidle` as discouraged.
The replacement pattern is: use **locator-based web-first assertions** for readiness, and
**`page.waitForURL()`** for navigation completion.

---

## 1. Why `waitForLoadState("networkidle")` Is Unreliable

### The technical cause

`networkidle` fires when there have been 0 in-flight network requests for 500 ms. Next.js 15 App
Router breaks this assumption in multiple ways:

- **Streaming SSR / React Suspense**: deferred chunks arrive over the network asynchronously after
  the initial HTML, keeping the network busy in small bursts indefinitely.
- **Next.js prefetching**: the Link component speculatively fetches adjacent routes during idle
  time. On a page with several nav links this fires continuously.
- **Analytics / third-party scripts**: any analytics call (even a tiny beacon) resets the 500 ms
  clock.
- **Background polling**: any React component that polls an API (chat, health checks) prevents
  network idle from ever being reached.

The result is that `networkidle` either times out (test fails) or takes an unpredictably long time
to settle (test is slow and CI-dependent). On GitHub Actions runners with shared CPU, the timing
window is even less reliable.

### Official position

From `eslint-plugin-playwright` docs (the canonical lint source):

> "Using `networkidle` is discouraged in favor of using web first assertions."

From Playwright navigations docs:

> "Modern pages perform numerous activities after the `load` event was fired… There is no way to
> tell that the page is `loaded`… In Playwright you can interact with the page at any moment. It
> will automatically wait for the target elements to become actionable."

Biome has codified this as the `noPlaywrightNetworkidle` lint rule.

### What `waitForLoadState("domcontentloaded")` does instead

`domcontentloaded` fires when the HTML is parsed and DOM is built — before images, stylesheets,
and scripts finish loading. It avoids the network-idle hanging problem but it is **too early**: the
React tree may not yet be hydrated and interactive elements may not yet be in the DOM. It is
marginally better than `networkidle` for simple pages but is still unreliable for RSC streaming
pages.

**The correct replacement is not a different `waitForLoadState` variant — it is removing the call
entirely and replacing with a locator assertion.**

---

## 2. The Replacement Pattern

### For page load readiness

Instead of:

```ts
await page.goto("/");
await page.waitForLoadState("networkidle");
```

Use:

```ts
await page.goto("/");
// Assert something meaningful that proves the page is ready
await expect(page).toHaveTitle(/Alex Mayhew/i);
// OR assert a key element is visible
await expect(page.locator("#main-content")).toBeVisible();
```

`toHaveTitle()` and `toBeVisible()` are **web-first (auto-retrying) assertions** — they poll with
a default 5-second retry window and only pass once the condition is true. This is strictly superior
to `networkidle` because it asserts what you actually care about (the content rendered) rather than
a heuristic proxy (no network traffic).

### How Playwright auto-waiting works

Every locator action (`click`, `fill`, `check`) and every `expect(locator).to*()` assertion has
built-in auto-waiting:

- Waits for the element to be attached to the DOM
- Waits for the element to be visible
- Waits for the element to be enabled
- Retries on assertion failure up to the configured `expect.timeout` (default 5 s)

This means after `page.goto()` completes (waits for the `load` event by default), any subsequent
locator assertion will naturally wait for SSR/streaming content to appear without any explicit
`waitForLoadState` call.

---

## 3. Navigation Testing in Next.js 15 App Router

### Why client-side navigation is different

The Next.js Link component performs **client-side navigation** — no full page load, no browser
navigation events. The URL changes via the History API. `waitForLoadState` is irrelevant here
because no document load cycle occurs.

### Correct pattern: `page.waitForURL()`

```ts
// Before (wrong for client-side nav):
await desktopNav.locator('a[href="/work"]').click();
await page.waitForLoadState("networkidle");
await expect(page).toHaveURL("/work");

// After (correct):
await desktopNav.locator('a[href="/work"]').click();
await page.waitForURL("/work");
// waitForURL resolves when URL matches — then assert content
await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
```

From Playwright navigations docs:

> "Clicking an element could trigger multiple navigations. In these cases, it is recommended to
> explicitly use `page.waitForURL()` to a specific url."

`waitForURL()` handles both full navigations (HTTP navigation lifecycle) and client-side History
API changes. It is the single correct primitive for "wait until I am on the right page."

### Combining `waitForURL` with content assertions

After `waitForURL` resolves, the URL has changed but React may still be rendering the new route's
content. Add one more locator assertion to confirm the page content is present:

```ts
await page.locator('a[href="/work"]').click();
await page.waitForURL("/work");
await expect(page.getByRole("main")).toBeVisible();
```

The `getByRole("main")` call will auto-retry until the new route's main content appears — covering
any streaming/Suspense delays.

---

## 4. Replacing `waitForTimeout()` (Animation Waits)

### Why it is an anti-pattern

`waitForTimeout(500)` is a fixed delay. It fails in two directions:

- If the animation is slower than 500 ms (flaky CI failure)
- If the animation completes faster, the test wastes 500 ms every run

### Correct replacement for animation testing

```ts
// Before:
await menuButton.click();
await page.waitForTimeout(500); // Wait for animation
await expect(closeButton).toBeVisible();

// After:
await menuButton.click();
await expect(closeButton).toBeVisible(); // auto-retries until visible
```

`toBeVisible()` will retry for up to 5 s by default, which covers any reasonable animation
duration. It passes as soon as the element appears — zero wasted time.

### When `waitForTimeout` IS acceptable

The only legitimate use case is when there is no observable DOM or state change to assert on —
for example, testing that something did NOT happen after a delay. Even then, prefer
`expect(locator).not.toBeVisible()` which will pass immediately if the element is absent.

---

## 5. CI-Specific Configuration

### Current config (playwright.config.ts) — what is correct

The current config already makes good choices:

- `workers: process.env.CI ? 1 : undefined` — correct; GitHub Actions free runners have 2 CPU
  cores and running Playwright workers in parallel on shared runners causes resource contention
- `retries: process.env.CI ? 2 : 0` — correct; gives flaky tests a chance to pass on CI
- `webServer` uses `npm run start` (built app) in CI, `next dev` locally — this is correct

### What is NOT in the config that should be

**Missing: `actionTimeout` and `navigationTimeout`**

GitHub Actions runners are slower than developer machines. The default Playwright action timeout
is 30 s but navigation can be slower on cold CI runners. Add explicit timeouts:

```ts
use: {
  baseURL: "http://localhost:3001",
  trace: "on-first-retry",
  screenshot: "only-on-failure",
  actionTimeout: 15_000,       // per-action timeout (click, fill, etc.)
  navigationTimeout: 30_000,   // page.goto() and page.waitForURL() timeout
},
```

**Missing: `expect.timeout`**

The default assertion retry window is 5 s. With streaming SSR on CI, some content may take longer
to hydrate. Consider:

```ts
export default defineConfig({
	expect: {
		timeout: 10_000, // retry assertions for up to 10 s
	},
	// ...
});
```

### `next start` vs `next dev` for webServer

Running tests against `next start` (the built app) in CI is correct and is already done. The
built app:

- Has no hot-reload overhead
- Matches the actual Cloudflare deployment (minus the Worker runtime)
- Has deterministic build output (no Turbopack incremental changes between tests)

`next dev` in local mode is acceptable for fast iteration but should NOT be used in CI.

### Browser installation optimization

Current config uses both Chromium and mobile Chrome. In CI this means two browser downloads plus
their deps. This is fine with the current two-project setup but if build times become a problem:

```yaml
# .github/workflows — install only what is needed
- run: npx playwright install chromium --with-deps
```

---

## 6. Prioritized Fix List for Current Test Suite

All files affected by these anti-patterns:

| File                     | Anti-Pattern Instances                                      |
| ------------------------ | ----------------------------------------------------------- |
| `e2e/navigation.spec.ts` | 8× `waitForLoadState("networkidle")`, 2× `waitForTimeout()` |
| `e2e/pages.spec.ts`      | 7× `waitForLoadState("networkidle")`, 3× `waitForTimeout()` |
| `e2e/seo.spec.ts`        | 8× `waitForLoadState("networkidle")`                        |
| `e2e/contact.spec.ts`    | 5× `waitForLoadState("networkidle")`, 1× `waitForTimeout()` |

### Fix strategy per file

**`navigation.spec.ts`** — navigation tests

- `beforeEach`: remove `waitForLoadState`, rely on subsequent test assertions
- After each `click()`: replace `waitForLoadState("networkidle")` with `page.waitForURL("/path")`
- `waitForTimeout(500)` after menu open/close: replace with `expect(button).toBeVisible()`

**`pages.spec.ts`** — page load tests

- After `page.goto()`: remove `waitForLoadState`, let `toHaveTitle()` / `toBeVisible()` serve
  as the readiness assertion (they already exist and will retry)
- `waitForTimeout(500)`: remove; the `toBeAttached()` calls already auto-wait

**`seo.spec.ts`** — meta tag tests

- After `page.goto()`: remove all `waitForLoadState` calls; meta tags are in the initial HTML
  and will be present immediately after `load` event (which `goto` already waits for)

**`contact.spec.ts`** — form tests

- `beforeEach`: remove `waitForLoadState` + `waitForTimeout(500)`; the `toBeVisible()` calls on
  form fields will gate on form readiness directly

---

## 7. Locator Best Practices (Official Playwright Hierarchy)

Prefer in this order (most to least resilient):

1. `page.getByRole()` — semantic, user-facing (best)
2. `page.getByLabel()` — for form fields
3. `page.getByText()` — for text content
4. `page.getByTestId()` — for elements without semantic role
5. `page.locator('css')` — fallback; CSS selectors break on refactor
6. XPath — last resort

Current tests use `page.locator('a[href="/work"]')` which is CSS — acceptable for nav link
testing since `href` is a stable API contract, not a styling detail.

The `desktopNav.locator('a[href="/work"]')` scoped locator pattern in `navigation.spec.ts` is
correct — chaining narrows scope and prevents ambiguous matches.

---

## 8. Complete Rewrite Template for `navigation.spec.ts` `beforeEach`

```ts
// Before
test.beforeEach(async ({ page }) => {
	await page.goto("/");
	await page.waitForLoadState("networkidle");
});

// After — no explicit wait; next assertion in each test gates on content
test.beforeEach(async ({ page }) => {
	await page.goto("/");
	// page.goto() waits for the load event by default.
	// Each test's first assertion will auto-retry until content is ready.
});
```

For the navigation click tests:

```ts
// Before
await desktopNav.locator('a[href="/work"]').click();
await page.waitForLoadState("networkidle");
await expect(page).toHaveURL("/work");

// After
await desktopNav.locator('a[href="/work"]').click();
await page.waitForURL("/work");
// Optionally assert a landmark to confirm the new page rendered:
await expect(page.getByRole("main")).toBeVisible();
```

For animation waits:

```ts
// Before
await menuButton.click();
await page.waitForTimeout(500);
await expect(closeButton).toBeVisible();

// After
await menuButton.click();
await expect(closeButton).toBeVisible(); // retries for up to expect.timeout (5-10 s)
```

---

## Sources

- [Playwright Best Practices (official)](https://playwright.dev/docs/best-practices)
- [Playwright Navigations (official)](https://playwright.dev/docs/navigations)
- [Playwright Auto-Waiting (official)](https://playwright.dev/docs/actionability)
- [Playwright Timeouts (official)](https://playwright.dev/docs/test-timeouts)
- [eslint-plugin-playwright no-networkidle rule](https://github.com/mskelton/eslint-plugin-playwright/blob/main/docs/rules/no-networkidle.md)
- [Biome noPlaywrightNetworkidle rule](https://biomejs.dev/linter/rules/no-playwright-networkidle/)
- [GitHub Issue: Infinite waiting for networkidle #19835](https://github.com/microsoft/playwright/issues/19835)
- [Playwright CI Setup (official)](https://playwright.dev/docs/ci-intro)
- [BrowserStack: Why not to use waitForTimeout](https://www.browserstack.com/guide/playwright-waitfortimeout)
- [Checkly: Waits and timeouts in Playwright](https://www.checklyhq.com/docs/learn/playwright/waits-and-timeouts/)
- [ray.run: Testing Next.js Apps Using Playwright](https://ray.run/blog/testing-nextjs-apps-using-playwright)
