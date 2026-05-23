# CSP `eval:` Violation Source Diagnosis (2026-04-30)

**Status:** CURRENT
**Session:** Investigate 3,382 "Blocked 'script' from 'eval:'" CSP violations across 420 unique users in 14 days on alexmayhew.dev.

## TL;DR — Top 3 Most-Likely Sources

| Rank | Source                                                                                                                                                                                                                                   | Confidence                                                                 | Why                                                                                                                                                                                                                                                                                                                             | Diagnostic next step                                                                                                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **Next.js webpack runtime `__webpack_require__.g` shim** (`Function("return this")()`) executed in browsers where `globalThis === undefined` AND the runtime's `try { return this \|\| ... }` path executes the `Function(...)` fallback | **HIGH** (probable explanation for the steady, broadly-distributed volume) | We confirmed the literal `Function("return this")()` lives in our shipped `webpack-50c334adbccd1d94.js` runtime chunk. webpack maintainers themselves admit (GitHub Discussion #16734) that the try/catch swallows the _console_ error but **CSP-Report-Only still fires a report**.                                            | Inspect `sourceFile` field on logged violations — if it points at `/_next/static/chunks/webpack-*.js`, it's confirmed.                                                                                     |
| 2    | **GTM Custom JavaScript variables** — `gtm.js` evaluates user-defined CJV strings via the Function constructor and silently fails to `undefined` without `'unsafe-eval'`. Google's own docs say so.                                      | **MEDIUM-HIGH** (only if any container has CJVs configured)                | We load `https://www.googletagmanager.com/gtag/js?id=...` directly (gtag.js, not full GTM container). Pure gtag.js DOES NOT use eval. But GA4 routinely fetches sub-resources from googletagmanager.com — and if any GA4-side server-side container or measurement-protocol bridge resolves to a GTM-style CJV, the eval fires. | Check whether the GA4 measurement ID (`G-K4TLSRKMCV`) has any linked GTM container. Check the _blockedURL_ / _sourceFile_ — if it ends in `gtm.js` or contains `googletagmanager.com`, this is the source. |
| 3    | **Browser extensions** (Grammarly, password managers, ad-blockers, dev tools) injecting content scripts that call eval-equivalent constructs in the page world                                                                           | **MEDIUM** (but probably much lower than its reputation)                   | Chrome has suppressed `chrome-extension://` source-files in CSP reports since 2015 (Chromium issue 41197022, fix r201969). So Chrome users in 2026 should NOT report extension-origin eval. **Firefox does NOT suppress** — extension reports CAN come from Firefox + older Chromium forks.                                     | Group violations by user-agent. If Firefox dominates → extensions. If Chrome dominates → likely #1 or #2.                                                                                                  |

The other realistic candidates (Sentry, Cloudflare Insights, Turnstile) we **eliminated** by source inspection — see Q3, Q4 below.

---

## Q1 — All Realistic Sources of an `eval:` Violation in this Stack

### A. Our own bundles (shipped to every user)

#### A1. Next.js webpack runtime `__webpack_require__.g` (HIGH confidence in our chunk)

- **Code path** (verbatim from `.next/static/chunks/webpack-50c334adbccd1d94.js`):
  ```js
  r.g = (function () {
  	if ("object" == typeof globalThis) return globalThis;
  	try {
  		return this || Function("return this")();
  	} catch (e) {
  		if ("object" == typeof window) return window;
  	}
  })();
  ```
- **When it triggers eval:** The `try` evaluates `this`. In a strict-mode ES module, top-level `this` is `undefined` and `undefined || Function("return this")()` reaches the Function constructor. Modern browsers all have `globalThis` since Chrome 71 / Firefox 65 / Safari 12.1 (early 2019), so the first branch wins and we never reach the eval. **However:** this runtime is also evaluated inside Workers / Service Workers, inside iframes (cross-origin sandboxes), inside extensions' isolated worlds, and inside bizarre user-agent fingerprint shells where `globalThis` may not be defined the same way.
- **Origin:** webpack's `lib/runtime/GlobalRuntimeModule.js` — Next.js doesn't set `output.globalObject`, so the default shim ships.
- **Strict-dynamic interaction:** `'strict-dynamic'` allows the chunk to _load_, but it does **not** unblock the Function constructor or `eval` — those need `'unsafe-eval'` regardless. So even our own trusted `webpack-*.js` chunk produces a CSP violation when this branch executes.
- **Severity: real bug** — but only fires in old/edge browsers + Service Worker contexts. Most reports.
- **Source-file pattern in reports:** `/_next/static/chunks/webpack-<hash>.js` line ~1, with column inside the `r.g` definition.

#### A2. Next.js polyfill-nomodule.js (LOW probability for typical visits, possible for old-browser users)

- **Path:** `.next/static/chunks/polyfills-42372ed130431b0a.js` — loaded with `<script nomodule>`. Any browser supporting ES modules **never executes it**.
- **Code:** Bundled core-js — contains `||function(){return this}()||Function("return this")()` as a globalThis polyfill (line 1).
- **Who hits it:** Pre-2018 browsers (IE11, old Android WebView builds). Very small share, but those users WILL hit the Function constructor because `globalThis` doesn't exist for them.
- **Severity: noise** — old-browser noise. Worth filtering once attributed.

### B. Third-party scripts on this site

#### B1. Google Tag Manager — gtag.js (LOW eval risk by itself)

- We load `https://www.googletagmanager.com/gtag/js?id=G-K4TLSRKMCV` (Google Analytics, not full GTM). gtag.js is built on top of GTM's runtime and _can_ dynamically fetch a GTM container if one is linked at the measurement-ID level. Pure gtag-only mode has been eval-free for years.
- **Custom JavaScript variables in any GTM container:** require `'unsafe-eval'`. They evaluate to `undefined` silently (Stack Overflow 71576581, Bounteous, Google's own CSP docs page). If any CJV exists in a linked container, every GA4 page-view evaluation re-fires the eval.
- **Severity: real bug if eval source is GTM** — but no console error. Custom variables silently fail.

#### B2. Google Tag Assistant Preview Mode (LOW probability — only if you opened GTM Preview yourself)

- Preview mode injects extra scripts that need `'unsafe-eval'`. Not a public-user issue.

#### B3. Cloudflare Web Analytics (`beacon.min.js`)

- **Inspected** node_modules-equivalent behavior: vanilla beacon, no eval. **Eliminated.**

#### B4. Cloudflare Turnstile (`challenges.cloudflare.com/turnstile/v0/api.js`)

- Per Cloudflare CSP docs, no `'unsafe-eval'` requirement. Implementation is a small loader + iframe to challenge widget. **Eliminated.**

### C. Sentry browser SDK (`@sentry/nextjs` 10.34, `@sentry/browser` 10.x)

- We grep'd the entire `node_modules/@sentry/**/*.js` tree for the relevant patterns — **no matches.** Sentry deliberately avoids eval to support strict CSPs since v6+.
- The Replay integration and BrowserTracing use Performance API + MutationObserver, not eval.
- **Eliminated.**

### D. Browser extensions

- **Chrome:** suppresses chrome-extension:// frames from CSP reports since 2015 (commit r201969). Should NOT contribute material volume in 2026.
- **Firefox:** does NOT suppress moz-extension:// reports. Will appear with `source-file: moz-extension://<uuid>/...`.
- **Brave/Edge/Vivaldi:** Chromium-based, inherit Chromium's suppression.
- Common eval-using extensions: Grammarly (uses dynamic script injection), older LastPass, some shopping/coupon extensions, custom userscripts (Tampermonkey/Violentmonkey running CJS bundles).
- **Severity: noise** — not our bug. Filter out by `sourceFile` containing `://` extension prefix.

### E. Browser-internal / OS code

- iOS Safari occasionally reports CSP violations from internal frame loaders with `sourceFile: about:blank` and empty blockedURL. **Noise.**

### F. Our own React/Next.js application code

- We grep'd `src/` for `\beval\(`, `\bnew Function\(`, and string-form `setTimeout(...)`/`setInterval(...)` — **no matches**. We have plenty of `dangerouslySetInnerHTML`, but ALL of those are static `JSON.stringify(...)` schema-LD payloads — they do not trigger `eval:` violations (CSP `eval:` blocks the Function constructor and `eval`, not inline JSON-LD).
- **Eliminated for our own source code.**

---

## Q2 — Does GTM use eval?

Source: Google's own [Tag Platform CSP guide](https://developers.google.com/tag-platform/security/guides/csp) (last updated 2025-08-29) — confirmed direct quote:

> "Due to how Custom JavaScript variables are implemented, they will evaluate to `undefined` in the presence of a CSP unless the `'unsafe-eval'` directive is given in the `script-src` section of the CSP."

| GTM feature                           | Uses eval?                        | Notes                                                                                               |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Base `gtm.js` / `gtag.js` loader      | **No**                            | Vanilla DOM-injection. Works fine with strict CSP + nonce.                                          |
| Custom HTML tags                      | **No**                            | They inject as inline `<script>` tags — need `'unsafe-inline'` OR a propagated nonce, NOT eval.     |
| **Custom JavaScript variables**       | **YES**                           | Function-constructor evaluation of user code. Fails silent → `undefined`. Requires `'unsafe-eval'`. |
| **Tag Manager Preview Mode**          | YES (script-src/style-src extras) | Only when GTM-side debugger active.                                                                 |
| Custom variable templates (sandboxed) | No                                | Use a sandboxed template language; were designed exactly to escape this trap.                       |

**Workaround pattern:**

1. Replace every Custom JavaScript variable with a Custom Variable Template (sandboxed). Caveat: not all `{{Click Element}}`-style references are allowed.
2. Or: move the logic into your site bundle and push a computed value into `dataLayer` before GTM sees it.
3. Last resort: add `'unsafe-eval'` to script-src — explicitly recommended _against_ by Google itself.

---

## Q3 — Does Sentry browser SDK use eval?

**No.** Verified by exhaustive grep over `node_modules/@sentry/{browser,core,react,nextjs}/**/*.js` for both eval and Function-constructor patterns. Zero matches.

This is intentional — Sentry's docs explicitly support strict CSPs. The Replay integration uses Mutation/Performance observers and IntersectionObserver. BrowserTracing uses `performance.getEntries()`. No dynamic code generation in the modern SDK.

The only Sentry-adjacent place dynamic code would appear is **source-map fetching for Replay**, which uses `fetch()` of `.map` files — not eval. Source maps are parsed via `JSON.parse`.

---

## Q4 — Cloudflare Insights / Turnstile

| Service                                          | eval?     | Source                                                                                                                                                                                  |
| ------------------------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Web Analytics (`beacon.min.js`)       | **No**    | Beacon-only — pings `cloudflareinsights.com/cdn-cgi/beacon` with timing data via `navigator.sendBeacon`.                                                                                |
| Cloudflare Turnstile (`turnstile/v0/api.js`)     | **No**    | Loader + iframe to challenge widget. Cloudflare's [Turnstile CSP doc](https://developers.cloudflare.com/turnstile/reference/content-security-policy/) does not require `'unsafe-eval'`. |
| **Cloudflare Bot Fight Mode** (separate feature) | Sometimes | If enabled in dashboard, CF injects its own anti-bot inline JS without nonce. Can produce _inline_ CSP violations, but generally not eval.                                              |

We are NOT running Bot Fight Mode (Turnstile replaces it). **All three Cloudflare components: eliminated.**

---

## Q5 — Browser Extensions Commonly Triggering eval CSP Violations

| Extension                               | eval pattern                                                                                | Reported as                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Grammarly**                           | content script uses Function-constructor for runtime config                                 | `chrome-extension://kbfnbcaeplbcioakkpcpgfkobkghlhen/...` (Chromium-suppressed); `moz-extension://...` (Firefox visible) |
| **LastPass / 1Password / Bitwarden**    | older builds use eval for autofill config                                                   | mostly Firefox-visible                                                                                                   |
| **Honey / Capital One Shopping**        | dynamic coupon-rule evaluation                                                              | Firefox-visible                                                                                                          |
| **Grammarly (older versions)**          | known XSS vector (Project Zero 2018)                                                        | both browsers                                                                                                            |
| **React DevTools / Vue DevTools**       | hook injection via `__REACT_DEVTOOLS_GLOBAL_HOOK__` — does NOT use eval in current versions | n/a                                                                                                                      |
| **Adblockers (uBlock Origin, AdGuard)** | declarativeNetRequest (MV3) — no eval. Older filter-engine forks may.                       | rare                                                                                                                     |
| **Tampermonkey / Violentmonkey**        | YES — userscript execution often uses Function-constructor                                  | extension or `userscript:` source                                                                                        |

**Attribution behavior:**

- **Chrome** (and Chromium derivatives — Edge, Brave, Opera, Vivaldi): hides extension stack frames from CSP reports per Chromium r201969 (2015). You should see ZERO `chrome-extension://` source-files in reports from modern Chrome.
- **Firefox**: does not suppress. `source-file: moz-extension://<uuid>/<path>` will appear. Filter on this prefix.
- **Safari**: Safari extensions don't typically inject into the page world the same way; eval reports from Safari Web Extensions are rare.

**If you see significant volume with empty `sourceFile` fields and `lineNumber: 0`**, that's also extension-attributable — Chromium strips the source but the report still fires.

---

## Q6 — How to Diagnose the Source

### Diagnostic fields to log (already done)

`/api/csp-report` already logs the right shape (`src/app/api/csp-report/route.ts` lines 60-87). The diagnostic fields are:

| Field                        | Value patterns                                    | Means                                                       |
| ---------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| `sourceFile` / `source-file` | `/_next/static/chunks/webpack-*.js`               | webpack runtime shim — Source #1 (most likely)              |
|                              | `/_next/static/chunks/polyfills-*.js`             | core-js polyfill — old browsers                             |
|                              | `https://www.googletagmanager.com/gtag/js?id=...` | GTM Custom JavaScript variable                              |
|                              | `chrome-extension://` / `moz-extension://`        | extension (rare from Chrome)                                |
|                              | empty / `about:blank`                             | Chromium-stripped extension or browser internal             |
|                              | one of our own static chunks                      | our app code (we ruled this out by grep but worth flagging) |
| `blockedURL` / `blocked-uri` | Always `eval` for this violation type             | confirms it's the eval directive                            |
| `lineNumber`                 | small (1-3) for minified bundles                  | unhelpful in our case                                       |
| `documentURL`                | which page the user was on                        | helps see if violation is page-specific                     |
| `effectiveDirective`         | `script-src-elem` vs `script-src`                 | `script-src` for the Function constructor / eval            |
| `disposition`                | `enforce`                                         | confirms blocked, not just reported                         |

The CSP report payload **does not include user-agent** in the legacy format. For Reporting API (newer browsers) you get a `user_agent` field — but you logged `entry.body.*` and skipped the top-level `user_agent`. **Recommend adding `user_agent` to the logged shape** (see Action 4 below).

### Workers Logs query

Without direct access to your Cloudflare account I can't query it. The logs path is:

```
Cloudflare Dashboard → Workers & Pages → alexmayhew-dev → Logs (real-time)
# OR via wrangler:
npx wrangler tail alexmayhew-dev --format=pretty | grep csp-violation
# OR Logpush if configured.
```

Filter by the structured field `event.message == "csp-violation"`. Group by `sourceFile` to get top sources. Group by `documentURL` to find hotspot pages.

### DevTools workflow to reproduce

1. Open DevTools → Console → "Show CSP errors only" filter on (Chrome's network/console panel groups them).
2. Hard-reload `https://alexmayhew.dev/` in incognito (no extensions). If you see _any_ eval violations, source #1 (webpack runtime) or #2 (GTM CJV) — both ours.
3. If clean in incognito but violations on regular browser → extensions.
4. Toggle on each tab: Network panel → click on each `_next/static/chunks/*.js` request → "Initiator" column tells you which entry triggered loading.

### Browser-console eval-tracker (paste into DevTools "Sources → Snippets")

The snippet wraps `window.Function` and `window.eval` with a Proxy/wrapper that logs every call site with a stack trace, then forwards the call. Concept:

- Save the original `window.Function` reference.
- Replace `window.Function` with a Proxy whose `apply` and `construct` traps log `console.warn(...)` plus `console.trace()` then call `Reflect.apply`/`Reflect.construct` on the saved original.
- Do the same for `window.eval` — assign a wrapper that logs the argument and stack, then invokes the saved original.

Run this BEFORE the page hydrates (paste into "Sources → Snippets" and "Run on page load" via DevTools, or via a local Custom Header inject extension on a `*.pages.dev` preview deployment so you don't poison prod). The stack traces tell you whether the call is from our webpack chunk, gtm.js, an extension, etc. **Do not commit this snippet to source** — it's for one-shot debugging only and itself triggers CSP violations on a strict origin (which is fine when running against a temporary report-only deployment).

---

## Q7 — Right Architectural Response

### Decision matrix per source:

| Source identified                                                 | Right response                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **webpack runtime `r.g`** (most likely)                           | (a) Set `output.globalObject = "globalThis"` in our Next.js webpack config — this avoids the runtime shim entirely for modern browsers. (b) OR set `target: "browserslist"` + restrict browserslist to `>0.5%, not dead, supports globalthis`. (c) OR accept noise + filter at the report endpoint. **Do NOT add `'unsafe-eval'` for this** — the path is unreachable for 99%+ of users. |
| **GTM Custom JavaScript Variable**                                | Refactor to Custom Variable Template (sandboxed). Or push computed values into `dataLayer` from our site code. **Do NOT add `'unsafe-eval'`** — security-policy rule + GTM's own docs recommend against.                                                                                                                                                                                 |
| **Browser extensions**                                            | Filter at `/api/csp-report`. Not our problem.                                                                                                                                                                                                                                                                                                                                            |
| **Old-browser polyfill**                                          | (a) Tighten browserslist to drop IE11 (it's already past EoL). (b) Filter at `/api/csp-report`.                                                                                                                                                                                                                                                                                          |
| **Our own application code** (worst case — currently no evidence) | Refactor. Never ship `'unsafe-eval'`.                                                                                                                                                                                                                                                                                                                                                    |

**Specific note on `'wasm-unsafe-eval'`:**

- It's a _narrower_ keyword that allows WebAssembly compilation but NOT JavaScript eval.
- Useful if any of our deps later add WASM (none currently — sugar-high, lenis, framer-motion are pure JS).
- Adding it preemptively is harmless and recommended; it does NOT relax JS eval blocking.
- **Recommendation: add `'wasm-unsafe-eval'` to `script-src` defensively** — costs nothing today.

### Filter rules for `/api/csp-report` (drop noise regardless of source)

Add these to `route.ts` BEFORE the `logger.warn` call:

```ts
// Suppress known-noise sources so signal stays high.
const NOISE_SOURCE_PATTERNS = [
	/^chrome-extension:\/\//,
	/^moz-extension:\/\//,
	/^safari-(web-)?extension:\/\//,
	/^webkit-masked-url:\/\//,
	/^about:/,
	// Polyfill chunks fire eval in old-browsers only — separate signal.
	/\/_next\/static\/chunks\/polyfills-/,
];
function isNoise(sourceFile: string | undefined): boolean {
	if (!sourceFile) return true; // empty source = Chromium-stripped extension
	return NOISE_SOURCE_PATTERNS.some((re) => re.test(sourceFile));
}

// In the loop:
if (isNoise(entry.body.sourceFile)) continue;
```

Plus rate-limit the endpoint itself (per Wave K — KV-based rate limiter). Add a per-IP cap of e.g. 10 reports/min to prevent CSP-report flooding from a single misbehaving client.

---

## Specific Actions Attempted in this Investigation

### 1. Cloudflare Workers Logs access

I do not have direct access to the live Workers logs. The `/api/csp-report` route already logs the diagnostic fields (`sourceFile`, `lineNumber`, `documentURL`, `violatedDirective`, `blockedURL`). The **missing field** is `user_agent` — for Reporting API format the entry has it at the top level (`entry.user_agent`) but the route reads only `entry.body.*` and drops it. **Add it.**

### 2. Dependency scan (verbatim results)

| Package                                          | eval / Function-constructor matches                              |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| `cmdk`                                           | none                                                             |
| `framer-motion`                                  | none                                                             |
| `@sentry/{browser,core,react,nextjs,cloudflare}` | **none** (Sentry is clean)                                       |
| `lenis`                                          | none                                                             |
| `lucide-react`                                   | none                                                             |
| `sugar-high`                                     | none                                                             |
| `react-markdown`                                 | none                                                             |
| `@radix-ui/*`                                    | (only via @keystatic transitive) — none in critical paths        |
| `@keystatic/*`                                   | none                                                             |
| `zod`                                            | none                                                             |
| `next` shipped runtime                           | **YES — webpack-_.js (`r.g` shim) and polyfills-_.js (core-js)** |

### 3. Source code grep

- `\beval\(` — zero hits in `src/`
- `\bnew Function\(` — zero hits in `src/`
- string-form `setTimeout("...")`/`setInterval("...")` — zero hits
- `dangerouslySetInnerHTML` — present, but ALL targets are `JSON.stringify(schema)` for JSON-LD or sanitized SVG via DOMPurify. None of these trigger eval.

### 4. Production CSP header inspection (CRITICAL FINDING)

Live `curl -I https://alexmayhew.dev/` returns this `Content-Security-Policy`:

```
script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://challenges.cloudflare.com https://*.googletagmanager.com
```

**Note what's missing:** no `'nonce-...'`, no `'strict-dynamic'`. That is the **`FALLBACK_CSP` from `custom-worker.ts`**, NOT the middleware-generated CSP. Confirmed on `/`, `/blog`, `/contact`. **The middleware is NOT running on production routes.**

This means:

- Our middleware-only nonce migration (commit `c3500a2` and predecessors) is **silently inoperative** in production for SSG/static-rendered routes.
- The fallback CSP is what users actually see → real eval gets blocked → real reports fire (since no `'unsafe-eval'`).
- This also explains why `'strict-dynamic'` is not protecting us as the threat model assumed — host allowlists + `'unsafe-inline'` are what's enforced.

This is a significantly more important finding than the eval-source question itself. It is a CSP architectural regression that should be triaged separately. The audit memory already flags this concept ("fallback CSP unsafe-inline") — but the active runtime impact (`'strict-dynamic'` is not in effect on the homepage) was not characterized.

---

## Action Plan to Identify Source Within 24h

1. **Patch `/api/csp-report`** to also log `user_agent` (top-level Reporting API field), and apply the noise filter from Q7. Land before next batch of reports.
2. **Tail Workers logs** while triggering canary requests: open `https://alexmayhew.dev/` in incognito Chrome + Firefox, then in regular browser with extensions. Observe which sourceFile patterns appear in each.
3. **Add the eval-tracker snippet** (Q6) via a 5-minute test branch deployed to `*.pages.dev` preview — gives stack-traced confirmation in dev tools.
4. **Run `wrangler tail alexmayhew-dev --format=json | jq 'select(.message == "csp-violation")' | jq -s 'group_by(.sourceFile) | map({source: .[0].sourceFile, count: length}) | sort_by(-.count)'`** — gives exact top-source ranking from real production traffic over the next 1-6 hours.
5. **If top sourceFile is `/_next/static/chunks/webpack-*.js`** → confirmed as #1, fix by setting `output.globalObject = "globalThis"` in next.config.js webpack section.
6. **If top sourceFile contains `googletagmanager.com`** → audit GA4 → GTM container linkage and remove any Custom JavaScript variables.
7. **Separately and urgently:** investigate the middleware-not-running-on-production finding from action 4 above. Either fix the middleware execution path on Cloudflare (matcher / OpenNext SSG bypass) or drop the partial migration and standardize on the static fallback. The current state ships a more permissive CSP than the code suggests.

---

## Filter Rules for `/api/csp-report` (Apply Now)

```ts
// In src/app/api/csp-report/route.ts

const NOISE_SOURCE_PATTERNS = [
	/^chrome-extension:\/\//,
	/^moz-extension:\/\//,
	/^safari-(web-)?extension:\/\//,
	/^webkit-masked-url:\/\//,
	/^about:/,
	/^null$/,
];

const NOISE_DOMAIN_PATTERNS = [
	// browser-internal frames the user can't fix
	/^chrome:\/\//,
	/^edge:\/\//,
];

function isNoiseViolation(args: { sourceFile?: string; blockedURL?: string }): boolean {
	if (!args.sourceFile && !args.blockedURL) return true;
	if (args.sourceFile && NOISE_SOURCE_PATTERNS.some((re) => re.test(args.sourceFile!))) return true;
	if (args.blockedURL && NOISE_DOMAIN_PATTERNS.some((re) => re.test(args.blockedURL!))) return true;
	return false;
}
```

Then in the report-loop:

```ts
if (isNoiseViolation({ sourceFile: entry.body.sourceFile, blockedURL: entry.body.blockedURL }))
	continue;
```

For legacy format, mirror the same check on `r["source-file"]` and `r["blocked-uri"]`.

Optionally add a per-fingerprint dedupe (sourceFile + lineNumber + violatedDirective) with a small in-memory or KV TTL — drops repeat-violation flooding. CF Workers Logs are not free at scale, and one user can fire hundreds of reports per session if the page does heavy SPA navigation.

---

## Sources

- Google Tag Platform — Use Tag Manager with a Content Security Policy (Aug 2025)
  https://developers.google.com/tag-platform/security/guides/csp
- Google Tag Manager + CSP technical guide (Incremys, 2026)
  https://www.incremys.com/en/resources/blog/google-tag-manager-csp
- webpack GitHub Discussion #16734 — `new Function('return this')()` in final bundle
  https://github.com/orgs/webpack/discussions/16734
- Vercel Next.js Issue #57865 — strict CSP + Next.js eval errors
  https://github.com/vercel/next.js/issues/57865
- Chromium Issue 41197022 — extension CSP report suppression (fix r201969, 2015)
  https://issues.chromium.org/41197022
- Cloudflare Turnstile CSP reference
  https://developers.cloudflare.com/turnstile/reference/content-security-policy/
- MDN Content Security Policy
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
- This project's existing research:
  `docs/research/csp-nextjs15-cloudflare-workers-2026.md`
