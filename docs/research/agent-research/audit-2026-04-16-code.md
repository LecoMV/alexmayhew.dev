# Code Quality & Architecture Audit — 2026-04-16

**Scope:** TypeScript strictness, React 19 / Next.js 15 patterns, component hygiene, error handling, testing, infrastructure.
**Reviewer:** code-reviewer (Principal Engineer perspective, CLAUDE.md + .claude/rules enforcement).
**Mode:** REPORT only — no edits performed.

---

## Summary

| Severity | Count |
| -------- | ----- |
| CRITICAL | 2     |
| HIGH     | 10    |
| MEDIUM   | 16    |
| LOW      | 12    |

**Highlights:**

- Zero `any` types in `src/` (only prose matches). Strict mode enforcement is holding.
- Zod coverage is partial — public API contracts validated, but Resend / Listmonk / Turnstile / self-proxied vectorizer responses and internal `/api/geo` / `/api/chat` client consumers are not.
- Framework discipline is uneven: **71 files use `'use client'`**. Several page-content shells (`services-page-content.tsx`, `home-page.tsx`, `about-page.tsx`, `services/[slug]/service-page-content.tsx` etc.) are client components solely for `framer-motion` + `trackCTAClick` and would render as Server Components with a small client shell wrapping animated sections.
- Server-side Sentry is **fully stubbed** (`instrumentation.ts` is an empty `register()`). `error.tsx` calls `Sentry.captureException` inside `"use client"` — browser context only. Server errors are invisible to Sentry.
- `catch` blocks lacking a binding are used as silent swallowers in 11 locations — CLAUDE.md bans bare try/catch and requires specific exception handling; the current pattern is bare-by-omission.
- File-size discipline is broken on 4 pSEO page-content components (787, 826, 868, 938 lines) and on the aggregated pSEO data files (pages.ts 3419 lines).

---

## CRITICAL

### C1 — Server-side Sentry completely disabled, errors invisible in production

**Files:** `src/instrumentation.ts:1-6`, `src/app/global-error.tsx:3`, `src/app/error.tsx:3`, `sentry.server.config.ts`

`instrumentation.ts` is an empty stub. Comment says "Client-side Sentry handles browser errors", but the two error boundary files that call `Sentry.captureException` are both `"use client"` — they only fire in the browser. Any server-rendered error (Server Component, Server Action, `generateMetadata`, etc.) goes nowhere.

```ts
// src/instrumentation.ts
export async function register() {}
```

Consequences:

- Contact form failures (server action) — `console.error("Contact form error:", err)` only; no alert.
- `generateStaticParams` / `generateMetadata` throws during build: Vercel/CF logs only.
- Every API route under `src/app/api/*` logs via `logger.error` (`console.log`) but never hits Sentry despite the `@sentry/nextjs` wrapper in `next.config.mjs`.

The deferred plan (`@sentry/cloudflare`) is referenced but not scheduled. This is a production observability hole given the site is a lead-generation engine.

**Recommendation:** Install `@sentry/cloudflare` and wire it through `instrumentation.ts`. In the interim, at least forward `logger.error` calls to Sentry from the API routes (fetch-based transport works on Workers).

---

### C2 — Turnstile verification response is not schema-validated

**File:** `src/lib/turnstile.ts:33`

```ts
const data: TurnstileVerifyResponse = await response.json();
if (!data.success) { ... }
return data.success;
```

Cloudflare Turnstile returns an object, but the cast is unchecked. If the endpoint ever changes shape, or returns `{ "error": "..." }` on 4xx (which it does), `data.success` is `undefined`, which is falsy — so the check passes accidentally on an error payload. Worse, `data.success` could be the string `"false"` from a misconfigured proxy and coerce truthy in a future refactor.

Per CLAUDE.md: **"All external API responses (Postiz, n8n, Listmonk) must be typed via Zod schemas. No untyped `fetch` responses."** Turnstile is not in the list but should be — it's a security boundary (bot protection).

**Recommendation:**

```ts
const turnstileResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
});
const parsed = turnstileResponseSchema.safeParse(await response.json());
if (!parsed.success) { logger.error("Turnstile invalid response", ...); return false; }
return parsed.data.success;
```

---

## HIGH

### H1 — Bare `catch` (no binding) used as silent swallower in 11 locations

**Files:**

- `src/app/actions/contact.ts:174` (rate limiting — acceptable intent but swallows all)
- `src/app/actions/newsletter.ts:87` (same)
- `src/lib/cloudflare-env.ts:37` (acceptable, documented local-dev fallback)
- `src/app/api/health/route.ts:11`
- `src/app/api/chat/route.ts:152` (JSON parse — acceptable but log it)
- `src/app/og/route.tsx:22`
- `src/components/ui/cookie-consent.tsx:40`
- `src/components/chat/chat-widget.tsx:98` — shows generic error to user, loses root cause
- `src/components/blog/share-buttons.tsx:62`
- `src/components/traceforge/gpu-control.tsx:51`
- `src/components/traceforge/use-system-status.ts:46`
- `middleware.ts:40` (also swallows — CSP header generation should not throw, so this branch is dead; see M13)

CLAUDE.md: "No bare `try/catch` — catch specific exception types" and "Never swallow errors silently — at minimum log a warning."

**Recommendation:** Each one needs `catch (error)` + `logger.warn(...)`/`logger.error(...)` with context. Network errors (expected in rate limiters, health checks) are fine to swallow but must still log.

---

### H2 — pSEO page-content files violate 300/50-line guidance

**Files:**

- `src/app/services/[slug]/service-page-content.tsx` — **787 lines**
- `src/app/services/migrations/[slug]/migration-page-content.tsx` — **826 lines**
- `src/app/services/comparisons/[slug]/comparison-page-content.tsx` — **868 lines**
- `src/app/services/integrations/[slug]/integration-page-content.tsx` — **938 lines**
- `src/components/blog/table-of-contents.tsx` — **478 lines**
- `src/components/ui/navigation.tsx` — **416 lines**
- `src/components/pages/contact-page.tsx` — **416 lines**
- `src/app/home-page.tsx` — **405 lines**
- `src/components/pages/about-page.tsx` — **380 lines**
- `src/app/blog/[slug]/hub-faqs.ts` — **437 lines** (data, acceptable)

CLAUDE.md: "If a function exceeds 50 lines, refactor it." While `service-page-content.tsx` _does_ decompose into sub-components (`Breadcrumbs`, `HeroSection`, `UniqueInsightsSection`, ...), the four pSEO shells are near-parallel implementations of the same structural pattern. Each has its own `Breadcrumbs`, its own `HeroSection`, its own FAQ accordion with duplicate `useState` toggle logic.

**Recommendation:**

1. Extract shared primitives to `src/components/pseo/`:
   - `<PseoBreadcrumbs />`
   - `<PseoHero />`
   - `<FaqAccordion />` (currently duplicated 4×)
   - `<PainPointsGrid />`
   - `<CtaSection />`
2. Leave the top-level file as a thin composition (~150 lines each).
3. Estimated reduction: 3,400 lines → ~1,200.

---

### H3 — Ten page-content components are `'use client'` purely for animation + tracking

**Files:**

- `src/app/home-page.tsx:1`
- `src/app/services/services-page-content.tsx:1`
- `src/app/services/[slug]/service-page-content.tsx:1`
- `src/app/services/migrations/[slug]/migration-page-content.tsx:1`
- `src/app/services/integrations/[slug]/integration-page-content.tsx:1`
- `src/app/services/comparisons/[slug]/comparison-page-content.tsx:1`
- `src/app/for/for-hub-page.tsx:1`
- `src/app/for/[role]/role-page-content.tsx:1`
- `src/app/technologies/technologies-page-content.tsx:1`
- `src/components/pages/about-page.tsx:1`

Each of these is ~300–900 lines of mostly static JSX wrapped in `framer-motion` `<m.div>` + `onClick={() => trackCTAClick(...)}`. This means:

- Every service page ships the full JSX tree as client JS.
- The SEO-critical body content is hydrated, not streamed.

Next.js 15 + React 19 idiom is to render the SEO body as a Server Component and wrap **only the animated island** in a client component (`<AnimatedHero>`, `<TrackedCta>`).

**Recommendation:** Split each page-content file into:

1. Server Component: static JSX, SEO content, `<Link>` (no analytics).
2. Client islands: `<HeroMotion>`, `<CtaButton>` (~20 lines each, tracks the click + animates).

This is the same pattern already used correctly for `<NewsletterSignup />` (client island inside server pages).

---

### H4 — Contact form uses `document.getElementById` to pipe Turnstile token

**File:** `src/components/pages/contact-page.tsx:324-344`

```tsx
onSuccess={(token) => {
  const hidden = document.getElementById("turnstileToken") as HTMLInputElement | null;
  if (hidden) hidden.value = token;
}}
```

Direct DOM manipulation inside React is an anti-pattern: it bypasses the reconciler, and React 19 concurrent rendering can re-render the hidden input (resetting `defaultValue=""`) between `onSuccess` firing and form submission. This is why the form uses `defaultValue` (uncontrolled) — but uncontrolled means React may not see the latest token.

Three type assertions (`as HTMLInputElement | null`) are the smell.

**Recommendation:** Use `useState`:

```tsx
const [turnstileToken, setTurnstileToken] = useState("");
// ...
<Turnstile
  onSuccess={setTurnstileToken}
  onError={() => setTurnstileToken("")}
  onExpire={() => setTurnstileToken("")}
/>
<input type="hidden" name="turnstileToken" value={turnstileToken} />
```

---

### H5 — Listmonk / Resend / Vectorizer API responses consumed without Zod validation

**Files:**

- `src/app/actions/newsletter.ts:121` — Listmonk error body cast to `Record<string, unknown>`, then `errorData?.message` accessed without shape check.
- `src/app/actions/contact.ts:80-81` — Resend error body cast to `{ message?: string }` via type assertion, not Zod.
- `src/app/api/vectorize/route.ts:51` — `const data = await response.json();` returned to client as-is.
- `src/app/api/vectorize/[taskId]/status/route.ts:46` — same.
- `src/app/api/vectorize/[taskId]/process/route.ts:66` — same.
- `src/components/ui/cookie-consent.tsx:47` — `res.json() as Promise<GeoResponse>` (client-side consumption of own `/api/geo`).
- `src/components/chat/chat-widget.tsx:88` — `(await response.json()) as ChatApiResponse`.

CLAUDE.md requires Zod on all external API responses. Currently only `/api/chat`'s **inbound** validation is Zod-backed. Outbound (what the browser receives) and inter-service (what the server consumes) are type-asserted.

**Recommendation:** Centralize response schemas in `src/lib/schemas/`:

- `resend-error.ts` — `{ message: string, name?: string, statusCode?: number }`
- `listmonk-error.ts`
- `vectorizer-response.ts`
- `geo-response.ts`
- `chat-response.ts`

Replace every `as X` with `schema.parse(await response.json())` or `.safeParse(...)` for graceful fallback.

---

### H6 — Sentry missing user context, release tracking environmental-only

**Files:** `sentry.client.config.ts:34`, no `Sentry.setUser` / `Sentry.setContext` calls anywhere in `src/`.

Release tracking relies on `process.env.NEXT_PUBLIC_SENTRY_RELEASE` which is never set in any config I could find. Git SHA is written to `NEXT_PUBLIC_GIT_SHA` via `next.config.mjs` — that's what should be the release.

No `setUser` means Sentry groups all errors under "unknown user" — when the contact form silently fails for one user, it's invisible in the funnel.

**Recommendation:**

1. In `next.config.mjs`, pass `NEXT_PUBLIC_SENTRY_RELEASE: getGitSha()` alongside `NEXT_PUBLIC_GIT_SHA`.
2. In a root-layout client island, call `Sentry.setUser({ id: anonymousCookieId })` — matches the existing GA4 client_id pattern.
3. Tag errors with `{ page_category, content_type }` already computed in `page-analytics.tsx` — that lets Sentry filter by route segment.

---

### H7 — Cascading render risk: `prevSuccess.current = true` + analytics inside `useEffect`

**Files:**

- `src/components/pages/contact-page.tsx:90-101`
- `src/components/newsletter/newsletter-signup.tsx:34-44`

```tsx
useEffect(() => {
  if (state.success && !prevSuccess.current) {
    prevSuccess.current = true;
    trackLeadEvent(...);
  }
}, [state.success]);
```

Using `useRef` as a "has this fired" flag inside `useEffect` is a React 19 anti-pattern that the concurrent renderer may replay. The effect itself is fine, but if Strict Mode double-invokes (as React 19 will do in dev and Profiler mode), the guard works — however it hides that this should be a **Server Action post-processor** or a `redirect()` to a success page, so the server-rendered next view fires the analytics via a tracking pixel on mount.

Lower priority than H1–H6 but worth a refactor when touching.

---

### H8 — `generateStaticParams` runs `getPublishedPages()` / reads MDX repeatedly; no shared cache

**Files:** `src/app/services/[slug]/page.tsx:29`, `src/app/services/migrations/[slug]/page.tsx`, `src/app/services/integrations/[slug]/page.tsx`, `src/app/services/comparisons/[slug]/page.tsx`, `src/app/for/[role]/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/newsletter/[slug]/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/technologies/[slug]/page.tsx`, `src/app/docs/[[...slug]]/page.tsx`

All 10 use `generateStaticParams`. Each also calls `generateMetadata` per slug (cold call). None use `unstable_cache` or React `cache()` to memoize the data loader. Fine at 126 pages but creating friction for the `optimizePackageImports` experimental flag.

**Recommendation (MEDIUM-ranking but logged here):** wrap `getPageBySlug`, `getPublishedPages`, `getAllMigrationPages` etc. in `React.cache(...)` so the same SSG pass dedupes across `generateStaticParams` → `generateMetadata` → `default`.

---

### H9 — Inline bootstrap script in `src/app/layout.tsx:152` is a 500+ char single line

**File:** `src/app/layout.tsx:146-155`

The Consent Mode v2 bootstrap is fine in intent — needs to run before GA4 — but packed into a single line with regex-unfriendly escaping. Any CSP tightening of `script-src 'unsafe-inline'` breaks this.

Middleware.ts sets `script-src 'self' 'unsafe-inline'` — meaning the inline script works, but CSP is effectively neutered for inline XSS protection everywhere. The script content is static (no user input), but the directive still allows any injected inline script.

**Recommendation:** Migrate to a nonce-based CSP. Generate a nonce in middleware, pass via a header, read in server layout, attach `nonce={nonce}` to both the inline script tag and any `Script` component. Then drop `'unsafe-inline'` from `script-src`.

---

### H10 — `src/data/pseo/pages.ts` is 3,419 lines of inline literal

**File:** `src/data/pseo/pages.ts`

Adjacent files: `migrations.ts` (2008), `comparisons.ts` (1455), `industries.ts` (1878), `integrations.ts` (1638), `technologies.ts` (529). Every edit to any page causes every other page to re-parse.

These are data files, so "function length" doesn't apply — but the monolith kills IDE performance, blame-ability, and bundle splitting on the client for pages that touch `TECHNOLOGY_LABELS`.

**Recommendation:** Break into `src/data/pseo/pages/nextjs-saas.ts`, `nextjs-fintech.ts`, etc., with an index file collecting them. Existing plan (Plan 4 — "Split pSEO data chunk") aligns with this.

---

## MEDIUM

### M1 — `{} as Record<string, PseoPage[]>` accumulator in `reduce`

**File:** `src/app/services/services-page-content.tsx:87`

```ts
{} as Record<string, PseoPage[]>
```

Minor but the idiomatic fix is `new Map<string, PseoPage[]>()` or pre-typed initial value: `const initial: Record<string, PseoPage[]> = {}; pages.reduce((acc, p) => { ... }, initial);`. The `as` cast silences TypeScript's narrowing.

---

### M2 — `fieldErrors as Record<string, string[]>` cast in contact action

**File:** `src/app/actions/contact.ts:138`

`validation.error.flatten().fieldErrors` is already typed by Zod. The cast is redundant and masks Zod version-upgrade breakage. Drop it.

---

### M3 — `validation.ts:299` returns `result.data as Partial<PseoPage>`

**File:** `src/data/pseo/validation.ts:299`

```ts
return { success: true, data: result.data as Partial<PseoPage> };
```

The partial schema is structurally compatible with `Partial<PseoPage>` — if it isn't, the assertion hides the divergence. Either define the partial schema using `pseoPageSchema.partial()` so Zod infers the type, or split into a narrower type.

---

### M4 — `src/lib/blog-themes/utils.ts` deep-merge uses 5 unsafe casts

**File:** `src/lib/blog-themes/utils.ts:25-31`

Deep merging arbitrary nested records requires type gymnastics, but the current approach casts through `Record<string, unknown>` 5× per key. Because `deepMerge` is only used for theme override resolution, a more restrictive signature (e.g., distribute over known theme keys only) would be safer. Alternatively, use `lodash.merge` (already edge-safe) and delete the custom implementation.

---

### M5 — Contact form dep-injection `dependencies` is module-level mutable

**File:** `src/app/actions/contact.ts:89, 95-110`

```ts
let dependencies = { sendEmail: ..., verifyTurnstile: ... };
export const __setDependencies = async (deps) => { dependencies = { ...dependencies, ...deps }; };
```

Module-level mutable state in a Server Action is a test-introduced hazard. Two parallel requests in the same worker instance (CF Workers reuses workers) could observe each other's injected deps if tests run in production by accident. The `__setDependencies` export is reachable via any client that can call a Server Action by name — `use server` exports everything.

**Recommendation:**

- Move DI to a `context` parameter or a factory: `makeSubmitContact(deps) => async function submitContactForm(...)`.
- Or gate the mutation with `if (process.env.NODE_ENV !== "test") throw`.
- Verify `__setDependencies` is stripped from the Server Action registry (it's prefixed `__` but that's by convention, not enforcement).

Same issue in `src/app/actions/newsletter.ts:35-50`.

---

### M6 — Chat widget hardcodes "Sorry, I couldn't process that request." fallback with untyped response

**File:** `src/components/chat/chat-widget.tsx:88, 93`

```ts
const data = (await response.json()) as ChatApiResponse;
...
content: data.message ?? "Sorry, I couldn't process that request.",
```

If the API returns `{ error: "Too many requests..." }`, the user sees the generic fallback instead of the actionable rate-limit message. See H5 — Zod-validate the response and surface `.error` when present.

---

### M7 — Large useEffect in `src/components/blog/table-of-contents.tsx:113-142`

Function is ~30 lines — within the 50-line rule, but tightly couples IntersectionObserver lifecycle with observer-pause logic and DOM ID tracking. Three concerns in one effect.

**Recommendation:** Extract `createTocObserver({ ids, onActive, paused })` to `src/lib/toc-observer.ts` — testable, reusable.

---

### M8 — `src/components/ui/navigation.tsx` mixes dropdown, mobile menu, search, and skip-link

**File:** `src/components/ui/navigation.tsx:72-416`

`Navigation` function body is ~345 lines. Three pieces of state (`mobileMenuOpen`, `toolsDropdownOpen`, `dropdownTimeoutRef`) and four effects. Separate `<DesktopNav />`, `<MobileMenu />`, `<ToolsDropdown />`.

---

### M9 — `src/app/home-page.tsx` ships 3 `<CornerBrackets />` copies + multi-section JSX in one 405-line client component

Same pattern as H3; call out separately because the home page is the #1 entry point and hydration cost matters most here.

---

### M10 — `src/components/blog/blog-article.tsx` `useEffect(() => setArticleUrl(window.location.href), [])`

**File:** `src/components/blog/blog-article.tsx:45-47`

Using effect to read `window.location.href` is fine for SSR skip, but the result is then passed to `<ShareButtons url={articleUrl} />`. React 19 `useSyncExternalStore` is the idiomatic API for this now.

---

### M11 — `Array.map` keys use array index

**Files:** see Grep result above — 40+ occurrences of `key={index}` or `key={i}` across pSEO page components.

For static arrays of literal data (FAQs, insights) this works, but React reconciliation loses track if the array is ever sorted/filtered (which some of these are — `.filter` in integration page content). Use content-derived keys (`key={insight.slice(0, 40)}`, `key={faq.question}`).

---

### M12 — `src/components/ui/error-boundary.tsx` returns `null` as default fallback

**File:** `src/components/ui/error-boundary.tsx:35`

```ts
return this.props.fallback ?? null;
```

Silent failure — if `<ChatWidget />` crashes, users see nothing, no retry button. Fallback should always be visible-but-minimal.

---

### M13 — `middleware.ts` `try/catch` wraps static header construction

**File:** `middleware.ts:6, 40-42`

```ts
try {
  const cspHeader = `...`.replace(...).trim();
  const response = NextResponse.next();
  response.headers.set(...);
  return response;
} catch { return NextResponse.next(); }
```

None of those operations throw. The catch is dead code; if it ever fires it silently drops security headers. Either remove the try/catch, or make it `catch (error) { logger.error("middleware failed", { error: ... }); return NextResponse.next(); }`.

Also: middleware has hardcoded CSP with `'unsafe-inline'` (see H9) and does not use nonces.

---

### M14 — Test file has `any[]` type annotation

**File:** `tests/components/pages/for-hub-page.test.tsx:27`

```ts
const mockPages: any[] = [ ... ];
```

Only `any` in the codebase. Tests are in scope per CLAUDE.md strict TypeScript rule. Mock should use the real `RolePage` type or a narrower test-specific type.

---

### M15 — `src/components/ui/cookie-consent.tsx` swallows `/api/geo` failure by showing banner

**File:** `src/components/ui/cookie-consent.tsx:54-57`

"On error, default to showing banner (safer for GDPR)" is correct GDPR posture, but the `.catch(() => { setShowBanner(true); })` logs nothing. If `/api/geo` starts failing globally (CF Worker cold start, deploy bug), everyone world-wide sees the banner — but there's no signal in logs that anything broke.

**Recommendation:** `.catch((error) => { logger.warn("geo detection failed", { error }); setShowBanner(true); })`.

---

### M16 — `src/app/og/route.tsx:22` bare catch

**File:** `src/app/og/route.tsx:22`

OG image generation is a public endpoint; silent failure means broken social previews with no traceability.

---

## LOW

### L1 — Import grouping mostly correct; minor drift

`tsconfig.json` + Prettier config (not shown) handles bulk of import discipline. Spot-checked files show consistent grouping (external → internal → types) with alphabetical within groups. A few files have `type` imports interspersed with value imports (e.g., `src/components/blog/blog-list.tsx:11-13` has `import type { Post }` after `import { ... }` — fine).

### L2 — `src/data/pseo/types.ts:519-520` double cast on tuple destructure

```ts
const tech = parts[0] as Technology;
const industry = parts.slice(1).join("-") as Industry;
```

These are string literals; the cast is necessary because `split("-")` loses the literal type. Acceptable but a `parseSlug` helper with branded types would be stronger.

### L3 — `src/data/projects.ts` is 672 lines of literal data

Same category as pages.ts; lower severity since only 1 file.

### L4 — Three non-spring `framer-motion` transitions remain

- `src/app/home-page.tsx:162` — `duration: 0.8, repeat: Infinity, repeatType: "reverse"`
- `src/components/terminal/terminal.tsx:265` — same shape
- `src/components/traceforge/progress-log.tsx:102`

Design rules require spring physics. These are caret-blink animations, which are legitimately tween — but `.claude/rules/design-system.md` says "ALWAYS use spring physics". Either document the exception (caret blink is acceptable tween) in the design system or convert to spring with `type: "spring", ...` and a cyclic keyframe.

### L5 — `src/components/analytics/page-analytics.tsx` `getUserType()` uses referrer heuristics

Pattern `referrer.includes("linkedin")` is fine but brittle. If LinkedIn ever uses `lnkd.in`, bucket misses. Not a correctness bug, just observational.

### L6 — Three `forwardRef` + `useImperativeHandle` in `src/components/ui/turnstile.tsx`

React 19 deprecates `forwardRef` in favor of `ref` as a prop. Turnstile wrapper would be simpler as:

```tsx
export function Turnstile({ ref, ...props }: TurnstileProps & { ref?: React.Ref<TurnstileRef> }) { ... }
```

### L7 — `src/components/blog/table-of-contents.tsx` has `useReducedMotion()` local hook

**Duplicates** the `MotionConfig reducedMotion="user"` already set in `<MotionProvider />` (`src/components/providers/motion.tsx:21`). Can delete the local hook and use `useReducedMotion` from `framer-motion` which already respects the motion config.

### L8 — `wrangler.jsonc` `workers_dev: true` in production

**File:** `wrangler.jsonc:79`

Comment: "Keep workers.dev subdomain active until custom domain is set up in dashboard." Custom domain is set up. Leaving `workers_dev: true` means `alexmayhew-dev.<account>.workers.dev` stays publicly reachable, bypassing Cloudflare's custom-domain security posture. Flip to `false` once www→non-www redirect is stable.

### L9 — `next.config.mjs` Sentry wrapper has sourcemaps disabled

**File:** `next.config.mjs:73`

```js
sourcemaps: { disable: true },
```

Without sourcemaps, Sentry shows minified stack traces. Since the site ships to production, `disable: true` reduces Sentry value. Trade-off is upload size / auth tokens; document the reason or enable.

### L10 — `src/instrumentation.ts` is empty but still exports `register`

Just delete the file — empty `register` is a no-op and the export confuses readers. Next.js recognizes the absence.

### L11 — `tests/components/ui/turnstile.test.tsx` mutates `process.env` in each test

**File:** `tests/components/ui/turnstile.test.tsx:14-44`

Known-fragile pattern called out in audit notes. Each test sets `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` then attempts restore; a thrown assertion leaves env polluted for next test. Use `vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-key")` + `vi.unstubAllEnvs()` in `afterEach`.

### L12 — `tsconfig.json` does not enable `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`

**File:** `tsconfig.json:7`

Only `strict: true`. With CLAUDE.md's "zero cognitive debt" goal, these two flags catch real bugs:

- `noUncheckedIndexedAccess` — every `arr[0]` becomes `T | undefined`, forcing explicit handling (would have flagged H4's `defaultValue` gap).
- `exactOptionalPropertyTypes` — `{ foo?: string }` can no longer accept `{ foo: undefined }`, catching subtle API contract drift.

Enabling both likely surfaces 50+ TS errors in the current codebase; plan as a dedicated session.

---

## Testing & Infrastructure Notes

### Positives

- Zod schemas drive both request validation (`src/app/api/chat/route.ts`) and pSEO quality gates (`src/data/pseo/validation.ts`) — good discipline.
- `src/lib/motion-constants.ts` is canonical; 9 files correctly import `staggerContainer`/`fadeInUp`.
- Server Actions use `useActionState` + `useFormStatus` — modern React 19 idiom.
- `generateStaticParams` + `generateMetadata` + `dynamicParams = false` pattern consistent across all dynamic routes.
- `MotionProvider` correctly sets `reducedMotion="user"`.
- `sentry.client.config.ts` ignores well-chosen noise (Network errors, extensions, ResizeObserver).
- `src/lib/logger.ts` structured logging is edge-compatible (plain `console.log` with JSON payloads).
- `next.config.mjs` `optimizePackageImports: ["lucide-react", "framer-motion"]` is the right call.
- `wrangler.jsonc` correctly uses `NEXT_INC_CACHE_R2_BUCKET` binding name per `.claude/rules/opennext.md`.

### Test Coverage Gaps (based on test-file presence)

- No tests covering contact-page client-side Turnstile flow (only the Server Action is tested in `tests/actions/contact.test.ts`).
- No E2E test for the chat widget (ChatWidget in `src/components/chat/chat-widget.tsx` has 261 lines, zero test file).
- `src/lib/hooks/use-vectorizer.ts` (386 lines) has no dedicated test — validation file covers schemas but not the hook's retry/cancel logic.
- `src/components/ui/command-palette.tsx` (149 lines) has only the dialog-semantics test (`tests/a11y/command-palette-dialog.test.tsx`), no interaction coverage.

### Infrastructure

- `middleware.ts` is 62 lines — well within edge bundle limit.
- CSP is comprehensive but `unsafe-inline` in `script-src` (see H9) and `style-src` neutralizes it.
- `compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"]` correct for OpenNext.
- `rate_limits` binding usage in `chat`, `contact`, `newsletter` is consistent.

---

## Recommended Priority Order

1. **C1** (instrumentation / server Sentry) — production observability hole.
2. **C2 + H5** (Zod for external APIs) — security + correctness, one sweep.
3. **H1** (bare catch cleanup) — one PR, mechanical.
4. **H4** (contact form `document.getElementById` → `useState`) — small, high-impact bug risk.
5. **H2 + H3** (pSEO page shells split & server-componentize) — biggest architectural win; do as one campaign.
6. **H9** (nonce-based CSP) — unblocks removing `'unsafe-inline'`.
7. **H6** (Sentry user context + release tracking) — dependent on C1.
8. **H10** (pSEO data file split) — can be done any time.
9. MEDIUM and LOW items — triage into quality sprint.
