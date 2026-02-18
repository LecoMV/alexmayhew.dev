# Security & Tooling Research: Next.js 15 + Cloudflare (2026-02-17)

**Status:** CURRENT
**Session:** Audit of CSP, rate limiting, error boundaries, Lighthouse CI, KarpeSlop, and eslint-plugin-deslop for the alexmayhew.dev stack

---

## 1. CSP Headers on Cloudflare Pages + OpenNext

### Confidence: VERIFIED

### Current State (middleware.ts)

The project already has a working middleware-based CSP. However, it uses `'unsafe-eval'` and `'unsafe-inline'` in script-src, which undermines CSP's XSS protection.

```
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com;
```

This is functionally equivalent to no CSP for scripts.

### Recommended Approach: Middleware with `'strict-dynamic'`

**For OpenNext/Cloudflare Pages, middleware (middleware.ts) is the correct and only viable approach for dynamic CSP.** The reasons:

1. `next.config.ts` `headers()` applies to static builds, works fine for non-nonce headers
2. `_headers` file (Cloudflare Pages native) runs AFTER the Worker response — Next.js middleware runs first. Using both creates duplicate CSP headers; browsers honor only the last one (unpredictable behavior)
3. Nonce-based CSP requires per-request generation, which requires middleware running server-side
4. OpenNext middleware runs in the Cloudflare Worker, so middleware.ts works correctly

**Critical caveat:** Nonce-based CSP forces all pages to be dynamically rendered (no ISR/static caching). For a portfolio site that is nearly all static, this is a significant performance penalty. The better path for this project is `'strict-dynamic'` with `'unsafe-inline'` fallback for static compatibility, or use hash-based SRI (experimental, Webpack only — not available with Turbopack which this project uses).

### Production-Ready CSP for This Stack

This site uses: Framer Motion, Google Fonts, Sentry (client-side), Cloudflare Analytics, Cloudflare Turnstile.

```typescript
// middleware.ts — production CSP for alexmayhew.dev
const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' blob: data: https://static.cloudflareinsights.com;
  connect-src 'self'
    https://sentry.io
    https://*.ingest.sentry.io
    https://cloudflareinsights.com
    https://static.cloudflareinsights.com;
  frame-src 'self' https://challenges.cloudflare.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
	.replace(/\s{2,}/g, " ")
	.trim();
```

**Key differences from current implementation:**

- Remove `'unsafe-eval'` from production (React does not need it in prod)
- Remove `'unsafe-inline'` from script-src (replaced by nonce + strict-dynamic)
- Add `https://fonts.googleapis.com` to style-src (Google Fonts CSS)
- Add `https://fonts.gstatic.com` to font-src (Google Fonts files)
- Add `https://*.ingest.sentry.io` to connect-src (Sentry error transport)
- Add `frame-src https://challenges.cloudflare.com` (Turnstile widget)
- Keep `'unsafe-inline'` in style-src only (Framer Motion injects inline styles; no nonce support for CSS-in-JS)

**Note on `'strict-dynamic'`:** When present, it allows scripts loaded by trusted scripts (nonce-bearing) to run, even from inline script tags they create. This handles Next.js's internal dynamic script injection. The `'unsafe-inline'` in script-src is ignored by browsers that support `'strict-dynamic'`, so it's safe to omit for script-src.

**Note on Framer Motion + style-src:** Framer Motion uses inline styles (not inline style tags), so style-src does not block it. The `'unsafe-inline'` in style-src is for `<style>` tags injected by frameworks, not `style=""` attributes.

**Known limitation:** Cloudflare's Bot Fight Mode injects inline JS that does not receive the nonce. If Bot Fight Mode is enabled in the Cloudflare dashboard, it will cause CSP violations. Mitigation: disable Bot Fight Mode (Turnstile handles this already), or switch to a looser script-src.

### Sources

- [Next.js CSP Guide (official, updated 2026-02-11)](https://nextjs.org/docs/app/guides/content-security-policy)
- [Cloudflare Pages \_headers docs](https://developers.cloudflare.com/pages/configuration/headers/)
- [CSP Header — cloudflare/next-on-pages Discussion](https://github.com/cloudflare/next-on-pages/discussions/442)
- [OpenNext Cloudflare middleware issue #606](https://github.com/opennextjs/opennextjs-cloudflare/issues/606)

---

## 2. Rate Limiting on Edge/Serverless

### Confidence: VERIFIED

### Current State

The project has in-memory rate limiting in API routes (contact form). In-memory rate limiting on Cloudflare Workers has two problems:

1. Resets on every new Worker invocation (cold start / new isolate)
2. Does not share state across Cloudflare's global edge (300+ PoPs)

### Options Evaluated

#### Option A: In-Memory (current approach)

**Verdict for this project: ACCEPTABLE.**

For a portfolio site with low traffic:

- Contact form abuse is the primary concern
- At this traffic level, per-isolate rate limiting still meaningfully slows down a determined spammer
- Cloudflare Workers have isolate affinity — the same visitor often hits the same isolate within a session
- Turnstile (already deployed) provides stronger bot protection than rate limiting alone

**Do not add complexity for a problem that doesn't exist at current scale.**

#### Option B: Cloudflare WAF Rate Limiting Rules

**Verdict: BEST for production at zero additional cost.**

As of 2025, Cloudflare WAF rate limiting is included in Free, Pro, and Business plans. Configure in Cloudflare Dashboard → Security → WAF → Rate Limiting Rules.

Advantage: runs at Cloudflare's edge BEFORE the Worker even starts. Zero compute cost. Shared state globally.

Example rule for contact form protection:

```
Field: URI Path
Operator: contains
Value: /api/contact

Characteristic: IP
Period: 1 minute
Requests allowed: 5
Action: Block (or Managed Challenge)
```

#### Option C: Cloudflare KV

**Verdict: NOT suitable for rate limiting.**
KV is eventually consistent — concurrent requests from different PoPs cannot coordinate accurately. Reads may be stale by 60 seconds globally. Unsuitable for per-request rate limiting.

#### Option D: Cloudflare Durable Objects

**Verdict: Overkill for this project, but correct architecture for high-scale.**
Durable Objects provide strongly consistent, transactional state. A single DO instance acts as a stateful singleton (all requests route to one location). This adds ~10-20ms latency for the DO request. Required for enterprise-grade distributed rate limiting. Durable Objects are not free (Workers Paid plan at $5/month minimum).

### Recommendation for alexmayhew.dev

**Tier 1 (free, immediate):** Configure Cloudflare WAF rate limiting rules for `/api/contact` — 5 requests per IP per minute. No code changes.

**Tier 2 (keep):** In-memory rate limiting in API route as a secondary layer (defense in depth). Low cost to maintain.

**Tier 3 (skip):** Durable Objects — not warranted at current traffic scale.

### Sources

- [Cloudflare WAF Rate Limiting docs](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [Rate Limiting AI APIs with Durable Objects](https://shivekkhurana.com/blog/global-rate-limiter-durable-objects/)
- [Cloudflare Storage Options comparison](https://developers.cloudflare.com/workers/platform/storage-options/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)

---

## 3. Error Boundaries in React 19

### Confidence: VERIFIED

**Full research already exists:** `docs/research/react-19-error-boundaries-2026.md` (status: CURRENT, 2026-02-15)

### Summary

- React 19 still requires class components for error boundaries. No hooks alternative.
- `react-error-boundary` v4+ is the recommended production library.
- Next.js `error.tsx` = route-level boundaries (file convention). Custom ErrorBoundary = component-level.
- They are complementary, not redundant.
- Sentry integrates via `onError` prop on `<ErrorBoundary>` — captures component stack automatically.
- In-house `src/components/ui/error-boundary.tsx` (37 lines, null fallback) is appropriate for ChatWidget use case.

### Three-Layer Pattern for this Project

```
Layer 1: app/global-error.tsx       — catches root layout errors (Next.js convention, must be 'use client')
Layer 2: app/error.tsx              — catches route segment errors per-page
Layer 3: <ErrorBoundary>            — wraps specific widgets (ChatWidget) for silent failure
```

### Sentry + Error Boundaries

Sentry client-side (`sentry.client.config.ts`) automatically reports errors that bubble up. `onError` prop provides component stack:

```tsx
import { ErrorBoundary } from "react-error-boundary";
import * as Sentry from "@sentry/nextjs";

<ErrorBoundary
	fallback={null}
	onError={(error, info) => {
		Sentry.captureException(error, {
			contexts: { react: { componentStack: info.componentStack } },
		});
	}}
>
	<ChatWidget />
</ErrorBoundary>;
```

Avoid duplicate reporting: do not use both `onError` prop AND root-level `onCaughtError` hook for the same boundary.

### Sources

- See `docs/research/react-19-error-boundaries-2026.md` for full citation list.

---

## 4. Unlighthouse Replacing @lhci/cli

### Confidence: VERIFIED

### Is @lhci/cli Actually in This Project?

**No.** Confirmed by inspection of `package.json` — `@lhci/cli` is NOT a dependency (dev or otherwise). It was mentioned in docs but never installed.

### What Are the 27 High-Severity Vulnerabilities?

The current project has **27 high-severity vulnerabilities** from `npm audit`. They are NOT from `@lhci/cli`. They are entirely from:

```
@opennextjs/cloudflare → @opennextjs/aws → @aws-sdk/* → @smithy/config-resolver
```

The root advisory is `GHSA-6475-r3vj-m8vf`: "AWS SDK for JavaScript v3 adopted defense in depth enhancement for region parameter value." This affects `@smithy/config-resolver <4.4.0`.

The fix (`npm audit fix --force`) would install `@opennextjs/cloudflare@1.16.5`, which is OUTSIDE the pinned range `~1.14.10`. Do not apply this fix without testing the build. The pinned version must not change without explicit testing.

**These vulnerabilities are in the build toolchain (opennext build scripts), not runtime code. They do not affect the deployed Cloudflare Worker.**

### Unlighthouse for CI

**Yes, Unlighthouse runs in CI against a deployed URL.** It is the recommended replacement for `@lhci/cli` for full-site auditing.

```yaml
# .github/workflows/lighthouse-audit.yml
name: Lighthouse Audit
on:
  workflow_dispatch: # Manual trigger only (don't run on every push)
  schedule:
    - cron: "0 9 * * 1" # Weekly Monday 9 AM

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Unlighthouse
        run: npm install -g @unlighthouse/cli puppeteer
      - name: Run Unlighthouse CI
        run: unlighthouse-ci --site https://alexmayhew.dev --budget 80 --build-static
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: unlighthouse-report
          path: .unlighthouse/
```

**Configuration file (`unlighthouse.config.ts`):**

```typescript
export default {
	site: "https://alexmayhew.dev",
	ci: {
		budget: {
			performance: 85,
			accessibility: 95,
			"best-practices": 90,
			seo: 90,
		},
	},
	scanner: {
		exclude: ["/api/*"],
	},
};
```

**Key differences from @lhci/cli:**

- Unlighthouse scans the entire site (crawls all pages) vs @lhci/cli requiring explicit URL list
- Output is a rich HTML dashboard + JSON, not just a report artifact
- CI mode (`unlighthouse-ci`) has built-in budget assertions with non-zero exit codes
- No server required — runs against any deployed URL
- Install: `@unlighthouse/cli` + `puppeteer` (provides Chromium for CI environments)

### Sources

- [Unlighthouse CI Integration](https://unlighthouse.dev/integrations/ci)
- [Unlighthouse GitHub](https://github.com/harlan-zw/unlighthouse)
- [@lhci/cli npm page](https://www.npmjs.com/package/@lhci/cli) — latest: 0.15.1

---

## 5. KarpeSlop

### Confidence: VERIFIED (package exists and is published)

### Package Status

**The package exists on npm and is actively published.**

```
Package: karpeslop
Version: 1.0.22 (as of 2025-12-14)
License: MIT
Versions: 22 releases
GitHub: https://github.com/CodeDeficient/KarpeSlop
```

Latest 4 releases were all in December 2025, indicating active development.

### CLI Interface

```bash
# Run (no install required)
npx karpeslop@latest

# Options
--help, -h       Show usage
--quiet, -q      Scan only core app files (recommended for CI)
--strict, -s     Exit code 2 if critical issues found (for CI gating)
--version, -v    Show version
```

### Exit Codes

- `0` — No issues
- `1` — Issues found (warnings, non-blocking)
- `2` — Critical issues (with `--strict` flag, e.g. hallucinated imports)

### Output Format

Generates `./ai-slop-report.json` with identified patterns, fix recommendations, and documentation links. Console output shows pattern codes with educational context.

### What It Detects

Three categories:

1. **Information Utility** — Redundant comments, boilerplate noise
2. **Information Quality** — Hallucinated imports (e.g., `import { useRouter } from 'react'`), incorrect type assumptions
3. **Style/Taste** — Overconfident patterns, vibe-coded shortcuts

### CI Integration

```yaml
- name: KarpeSlop AI Quality Check
  run: npx karpeslop@latest --quiet --strict
  continue-on-error: true # Warn but don't block
```

### Known Limitations

- Small project (22 versions), not yet battle-tested at enterprise scale
- Detection is heuristic-based, will have false positives
- Primarily TypeScript/JavaScript focused
- Config file `.karpesloprc.json` allows customization but is poorly documented
- `tsx` and `glob` are the only dependencies — lightweight

### Recommendation

Run as a non-blocking CI check (`continue-on-error: true`) to track AI slop trends without blocking deploys. Not a substitute for code review.

### Sources

- [KarpeSlop GitHub](https://github.com/CodeDeficient/KarpeSlop)
- [karpeslop npm](https://www.npmjs.com/package/karpeslop)

---

## 6. eslint-plugin-deslop

### Confidence: VERIFIED (package exists, recently published)

### Package Status

```
Package: eslint-plugin-deslop
Version: 0.3.3 (published ~3 weeks ago from 2026-02-17, so ~late January 2026)
License: MIT
Versions: 9 releases
GitHub: https://github.com/ahxar/eslint-plugin-deslop
Zero dependencies
```

### ESLint Version Requirements

```json
peerDependencies: { "eslint": ">=8.0.0" }
engines: { "node": ">=18.0.0" }
```

This is compatible with the project's ESLint 9 (flat config). Works with both ESLint 8 (legacy config) and ESLint 9 (flat config).

### Rules

Only two rules currently:

1. **`deslop/no-excessive-comments`** — Detects comment density > threshold inside function bodies
   - Default maxDensity: `0.3` (30%)
   - Configurable: `0` to `1` range

2. **`deslop/no-obvious-comments`** — Detects comments that restate what the code does
   - Checks ~13 category types of obvious comments
   - Options: `customPatterns` (regex array), `checkVariableNames` (boolean, default: true)

### Configuration (Flat Config — matches this project's eslint.config.mjs)

```javascript
// eslint.config.mjs
import deslop from "eslint-plugin-deslop";

export default [
  // ... existing config
  {
    plugins: { deslop },
    rules: {
      "deslop/no-excessive-comments": ["warn", { maxDensity: 0.3 }],
      "deslop/no-obvious-comments": ["warn", { checkVariableNames: true }],
    }
  }
];

// Or use recommended preset (enables both at "warn" with 30% density default):
export default [...deslop.configs.recommended];
```

### Interaction with Existing sonarjs Rules

`eslint-plugin-sonarjs` v3 (already installed) includes `sonarjs/cognitive-complexity` and `sonarjs/comment-regex` but does NOT overlap with deslop's comment density rules. They are complementary:

- sonarjs focuses on cognitive complexity, duplicate code, bug patterns
- deslop focuses specifically on AI-generated comment noise

No rule conflicts expected. Safe to add alongside sonarjs.

### Known Limitations

- Only 2 rules — narrow scope vs what was marketed
- No documentation of ESLint version compatibility beyond peerDependencies
- No legacy config examples in README (flat config only in docs)
- Recently published (Jan 2026) — minimal community validation
- Comment density threshold is crude: legitimate documentation-heavy code will trigger warnings

### Recommendation

Add as a dev dependency with both rules at `"warn"` (not `"error"`). Tune `maxDensity` upward (0.5) for files that are intentionally well-commented (hooks, utility functions).

### Sources

- [eslint-plugin-deslop GitHub](https://github.com/ahxar/eslint-plugin-deslop)
- [eslint-plugin-deslop npm](https://www.npmjs.com/package/eslint-plugin-deslop)

---

## Summary Table

| Item                 | Verdict                                            | Confidence | Action                                                                                        |
| -------------------- | -------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| CSP via middleware   | Correct approach for OpenNext                      | VERIFIED   | Remove `'unsafe-eval'` + `'unsafe-inline'` from script-src, add Google Fonts + Sentry domains |
| Rate limiting        | Cloudflare WAF rules = best approach               | VERIFIED   | Configure WAF rule for /api/contact, keep in-memory as secondary                              |
| Error boundaries     | Full research in react-19-error-boundaries-2026.md | VERIFIED   | Three-layer pattern: global-error.tsx + error.tsx + ErrorBoundary                             |
| @lhci/cli            | NOT installed in this project                      | VERIFIED   | 27 high vulns are from @opennextjs/aws → AWS SDK, not lhci                                    |
| Unlighthouse         | Works in CI, scan deployed URL                     | VERIFIED   | Use workflow_dispatch + `unlighthouse-ci --site https://alexmayhew.dev`                       |
| KarpeSlop            | Real package, v1.0.22, Dec 2025                    | VERIFIED   | Use as non-blocking CI check with `--quiet --strict`                                          |
| eslint-plugin-deslop | Real package, v0.3.3, Jan 2026                     | VERIFIED   | Add with ESLint 9 flat config, both rules at "warn"                                           |

---

## Related Research

- `docs/research/react-19-error-boundaries-2026.md` — Full error boundary reference
- `docs/research/sentry-opennext-cloudflare-2026.md` — Sentry CSP connect-src requirements
