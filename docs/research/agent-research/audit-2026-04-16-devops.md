# DevOps / Infrastructure Audit — alexmayhew.dev

**Date:** 2026-04-16
**Auditor:** devops-engineer (read-only)
**Scope:** GitHub Actions, Cloudflare Workers/Pages, OpenNext, monitoring, dependencies, secrets, DR, post-deploy tests, feeds
**Prior audit baseline:** 2026-04-05 Plan 4 findings — re-verifying which were fixed.

---

## Executive Summary

| Severity  | Count  |
| --------- | ------ |
| CRITICAL  | 5      |
| HIGH      | 11     |
| MEDIUM    | 14     |
| LOW       | 9      |
| **Total** | **39** |

**Headline findings:**

1. **Preview deployments are 100% broken** — every Dependabot/external PR fails. `wrangler deploy --env preview` references a non-existent `env.preview` block in `wrangler.jsonc`. Compounded by Dependabot PRs receiving empty secrets.
2. **Scheduled-publish commits cannot trigger a deploy** (GitHub anti-recursion). If the Monday cron finds a due post, it commits to `main` but no build/deploy fires — content sits undeployed until a human push.
3. **No cache persistence for `.next/cache`** across runs. Build step rebuilds everything every time. Adds 60-120s to each deploy.
4. **Secret push races with deployment.** `wrangler secret put` runs AFTER `opennextjs-cloudflare deploy`; there is a window where new code runs against an old secret snapshot. `echo "$secret" | wrangler secret put` also silently pushes empty strings if a GitHub secret is unset.
5. **npm audit: 6 vulnerabilities (2 moderate, 4 high)** — `next 15.5.14` has an unaddressed DoS advisory (GHSA-q4gf-8mx6-v5v3), `dompurify`, `minimatch`, `vite`, `brace-expansion`. `npm audit fix` is safe per audit output (no breaking changes needed except for `eslint-plugin-sonarjs`).
6. **CLAUDE.md version pins are stale/wrong.** It claims `next@15.5.9` and `@opennextjs/cloudflare@~1.14.10` are pinned — actual package.json has `^15.5.14` and `^1.18.0`. Operator is following outdated guidance.
7. **No uptime monitoring.** No UptimeRobot / Better Stack / Pingdom / Grafana. Only post-deploy health check; a zero-traffic Worker with a 500 would not page anyone.
8. **Worker job timeouts missing** on every job except e2e. A hung `npm ci` or `wrangler deploy` burns up to 360 min of Actions minutes.

---

## 1. GitHub Actions — Workflows

### CRITICAL

#### [C1] Preview deployment is broken on every PR

**File:** `.github/workflows/deploy.yml:113`, `wrangler.jsonc` (no `env.preview`)
**Evidence:** Every recent dependabot PR deploy-preview job fails. Log (run 24343135328):

> ✘ No environment found in configuration with name "preview". ... Error: Failed to start the remote proxy session, see the error details below: You must be logged in to use wrangler dev in remote mode.

**Root cause (double):**

1. `wrangler.jsonc` has zero `env.*` blocks — `--env preview` references nothing.
2. Dependabot PRs receive empty `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` (confirmed in failure log: `CLOUDFLARE_API_TOKEN: \n CLOUDFLARE_ACCOUNT_ID:`). GitHub withholds secrets from PRs opened by `dependabot[bot]` unless explicitly granted via Dependabot secrets.
3. Workflow uses `npx wrangler deploy --env preview` but OpenNext detects the project and calls `opennextjs-cloudflare deploy` instead (see log), which needs `getPlatformProxy` — which needs a login session. The `deploy-preview` step is effectively running `wrangler dev --remote` under the hood.

**Risk:** Reviewers have no preview URL. Risky changes merge without visual verification. Status badge is permanently red on PRs. Prior note ("preview falls back to prod — fixed?") is **NOT fixed**.

#### [C2] Scheduled-publish commits silently do not deploy

**File:** `.github/workflows/publish-scheduled.yml:112-119`
**Evidence:** The workflow uses `GITHUB_TOKEN` (line 26). GitHub's documented behavior: a push by `github-actions[bot]` using the default token does **not** trigger `push` workflows (anti-recursion guard). `deploy.yml` only triggers on `push` to main.

**Risk:** If the Monday 05:00 UTC cron finds a due post (the loop worked fine but found 0 on recent runs), it will commit to main — and the blog post will never reach production until a human pushes. Content pipeline has a dead-end failure mode that is invisible (success badge on publish, no deploy).

**Fix path:** Either (a) commit using a PAT/GitHub App token that triggers workflows, (b) add a `workflow_run` trigger to deploy.yml that fires when publish-scheduled completes, or (c) invoke deploy.yml via `workflow_dispatch` at the end of the publish script.

#### [C3] `wrangler secret put` runs after deploy → race window + silent empty-secret push

**File:** `.github/workflows/deploy.yml:187-196`
**Evidence:**

```yaml
- name: Deploy to Cloudflare Workers # line 180
  run: npx opennextjs-cloudflare deploy
- name: Set Worker secrets # line 187
  run: |
    echo "${{ secrets.LISTMONK_API_URL }}" | npx wrangler secret put LISTMONK_API_URL
    ...
```

**Risks:**

1. **Race window:** Worker is live with new code for several seconds to minutes before secrets reach Cloudflare (secret put requires 1-2s per call × 5 secrets = ~10s window). If a visitor hits `/actions/contact` during the window, code attempts to fetch with the OLD secret snapshot. Less relevant for first deploys, but meaningful if secrets are rotated.
2. **Empty-secret push:** `echo "${{ secrets.RESEND_API_KEY }}" | wrangler secret put RESEND_API_KEY` — if the GitHub Actions secret is unset or expired, `echo ""` pushes an empty string, wiping production credentials. No pre-validation guard.
3. **Every deploy re-pushes all 5 secrets**, creating noise in CF audit logs and obscuring genuine rotations.

**Fix path:** (a) Push secrets **before** `deploy` — they persist in Cloudflare and don't need to be pushed every build unless values changed. (b) Wrap each `secret put` with `if [ -z "$VAR" ]; then echo "::error"; exit 1; fi`. Better: stop setting secrets in CI at all; set them once via dashboard and only rotate manually.

#### [C4] `next@15.5.14` has an unaddressed DoS advisory (GHSA-q4gf-8mx6-v5v3)

**File:** `package.json:53`, `npm audit` output
**Evidence:**

> next 13.0.0 - 15.5.14 — Severity: high — Next.js has a Denial of Service with Server Components — fix available via `npm audit fix`

**Risk:** An attacker can trigger a DoS by crafting requests that exhaust the RSC render loop. alexmayhew.dev uses Server Components extensively. Fix is non-breaking (patch upgrade).

#### [C5] `rate_limits` binding is malformed — wrangler flags it as unexpected field

**File:** `wrangler.jsonc:61-77`
**Evidence:** Preview deploy logs:

> WARNING: Unexpected fields found in top-level field: "rate_limits"

**Risk:** Per Cloudflare docs, rate-limit bindings use `[[unsafe.bindings]]` with `type = "ratelimit"`, not a top-level `rate_limits` array. The bindings in the current `wrangler.jsonc` may not actually be connected to runtime limiters. This means `RATE_LIMITER_CHAT`, `RATE_LIMITER_CONTACT`, `RATE_LIMITER_NEWSLETTER` bindings might be **undefined at runtime** and the rate-limiting code is a no-op. Prior audit noted a concern about missing rate limits; this syntax bug would silently bypass them.

Needs runtime verification: log the binding object in prod and check if `.limit()` actually returns `{ success: true/false }`.

### HIGH

#### [H1] No `.next/cache` or `.next/standalone` caching between runs

**Files:** `.github/workflows/deploy.yml:31, 100, 163`, `ci.yml:27, 51, 69, 114`
**Current state:** `cache: "npm"` (npm cache only) — the Next.js build cache is discarded every run. With `optimizeCss` + `optimizePackageImports` + Sentry source map upload, full builds take ~60s extra. Over 100 deploys/month, that's meaningful CI minutes.

**Fix:**

```yaml
- uses: actions/cache@v4
  with:
    path: |
      .next/cache
      node_modules/.cache
    key: nextjs-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.ts', '**/*.tsx', '**/*.mjs') }}
    restore-keys: |
      nextjs-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}-
```

#### [H2] Test job is NOT a prerequisite for production deploy

**File:** `.github/workflows/deploy.yml:145`, cross-reference with `ci.yml`
**Evidence:** `deploy-production` depends only on `validate` (typecheck + lint + build). Tests live in `ci.yml` (separate workflow) and are invisible to deploy.yml's `needs:` graph. A push that breaks tests but compiles successfully will deploy to production.

**Fix:** Either merge validate + test into one workflow, or use `workflow_run` with a condition on `ci.yml` success.

#### [H3] GitHub Actions pinned to major, not SHA

**Files:** All workflows — `actions/checkout@v6`, `actions/setup-node@v6`, `actions/upload-artifact@v7`, `actions/download-artifact@v8`, `actions/github-script@v8`, `codecov/codecov-action@v6`
**Risk:** A compromised maintainer account could push a malicious minor release to any of these tags; your workflow picks it up silently. Supply-chain risk documented by OpenSSF Scorecard and Trail of Bits.
**Fix:** Pin to full commit SHA with a comment for human readability:

```yaml
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v6.0.0
```

Dependabot already has `github-actions` updater configured — it can propose SHA bumps once initial pinning is in place.

#### [H4] Job timeouts missing on all jobs except e2e

**Files:** `ci.yml` (all jobs), `deploy.yml` (all jobs), `mutation-testing.yml`, `publish-scheduled.yml`
**Risk:** GitHub default job timeout is 360 minutes (6 hours). A hung `npm ci` or `wrangler deploy` with a network stall burns CI minutes until the default expires.
**Fix:** Add `timeout-minutes: 15` to validate/build/deploy/typecheck/test/lint jobs, `timeout-minutes: 5` for the simple publish-scheduled job.

#### [H5] Dependabot produces 6-plus "failed" deploys per week

**Evidence:** `gh run list --workflow deploy.yml --limit 10` — dependabot PR deploy-preview jobs account for the majority of red runs. Root cause is the `env.preview` bug (C1), not the bumps. Every week, Dependabot bumps minor/patch versions → 10+ PRs → 10+ red deploys → dashboard noise that masks real failures.
**Fix:** Fix C1, or add `if: github.actor != 'dependabot[bot]'` to deploy-preview until preview is repaired.

#### [H6] Preview/PR runs fetch secrets that Dependabot can't access

**File:** `.github/workflows/deploy.yml:114-116`
**Evidence:** Dependabot's PRs run with `CLOUDFLARE_API_TOKEN = ""` (observed in logs). Any step that passes these to an external command gets an empty string. This is a GitHub policy (repo secrets aren't shared to Dependabot PRs); Dependabot secrets must be configured separately under Settings → Secrets → Dependabot.
**Fix:** Mirror required deploy secrets into Dependabot-scoped secrets, OR skip deploy-preview for dependabot.

#### [H7] No Lighthouse / web-vitals CI gate

**Files:** `.github/workflows/*.yml` — searched, none present.
**Risk:** Core Web Vitals regressions (INP, LCP, CLS) can ship undetected. Deploy smoke test only checks 200-status — it does not measure performance. Given "Performance Engineering" is a core content pillar, ironic to not gate on it.
**Fix:** Add `lighthouse-ci` action as a non-blocking gate first (collect baseline), then promote to blocking after 2-week baseline.

#### [H8] No rollback automation / rollback on smoke-test failure

**File:** `.github/workflows/deploy.yml:223-238` — smoke test fails the job, but Cloudflare deploy is already live.
**Evidence:** Deploy happens at line 180; smoke test runs at line 223. If smoke test fails, the job reports red, but the bad deployment is still the active one. Only remediation is manual dashboard rollback.
**Fix:** On smoke-test failure, run `wrangler rollback` (or the OpenNext equivalent) to the previous deployment ID, then fail the job. At minimum, auto-create an urgent GitHub issue (already done at line 294) **plus** Slack/email page.

#### [H9] `observability: enabled` produces logs but no retention or alerting configured

**File:** `wrangler.jsonc:34-36`
**Current:** `"observability": { "enabled": true }` — enables Worker logs but no `head_sampling_rate`, no log export target (R2, Datadog, Grafana), no alerting.
**Risk:** Logs accumulate in Workers logs dashboard (7-day retention). No central aggregation. `sentry.server.config.ts` is disabled per `src/instrumentation.ts:6`, though `custom-worker.ts` does wrap with `@sentry/cloudflare` — so SOME server errors reach Sentry, but not all execution contexts.
**Fix:** Add `head_sampling_rate: 0.1` and an explicit log export binding to R2 (or a 3rd-party).

#### [H10] Extraneous node_modules packages

**Evidence:** `npm ls --depth=0` shows:

> ├── @emnapi/core@1.8.1 extraneous
> ├── @emnapi/runtime@1.8.1 extraneous
> ├── @emnapi/wasi-threads@1.1.0 extraneous
> ├── @tybys/wasm-util@0.10.1 extraneous

**Risk:** Packages installed but not declared in `package.json` or `package-lock.json`. Indicates either a broken post-install step or an orphaned prior install. `npm ci` should fail on this in CI with `--ignore-scripts`-style strictness — it currently passes, meaning the lockfile is being regenerated or `legacy-peer-deps=true` is masking the drift.

#### [H11] Dependabot "production-dependencies" group excludes `next` and `react`

**File:** `.github/dependabot.yml:30-35`
**Current:** Major-version bumps excluded (reasonable), but minor/patch Next.js/React bumps are deferred to a separate group (`react-next`) that applies minor/patch. Combined with failing preview deploys, **these PRs are failing and accumulating**. Next.js security patches (like C4 above) sit in red PRs instead of auto-merging.
**Fix:** Once C1 + C4 resolved, enable auto-merge for `react-next` patch bumps.

### MEDIUM

#### [M1] Compatibility date 4.5 months old

**File:** `wrangler.jsonc:15`
**Current:** `"compatibility_date": "2025-12-01"`
**Risk:** Misses runtime fixes and opt-in features from Dec 2025 → April 2026. Low risk of breakage; fail-safe default. Bumping to `2026-04-01` picks up the latest stable runtime behaviors.

#### [M2] CLAUDE.md has stale version pins

**File:** `CLAUDE.md` (root) and `alexmayhew-dev/CLAUDE.md`
**Current:** "Pinned versions: `next@15.5.9`, `@opennextjs/cloudflare@~1.14.10` — do NOT upgrade without testing"
**Actual:** `package.json` has `^15.5.14` and `^1.18.0`. Your own agent memory references `15.5.9` as the pin. Latest OpenNext is `1.19.1`; latest Next is `15.5.15`. Either update CLAUDE.md or actually pin the versions (drop `^`).

#### [M3] No `engines` in package.json

**File:** `package.json`
**Current:** No `engines.node` declaration; `.nvmrc` has "20" but `package.json` doesn't mirror it.
**Risk:** Dev running Node 22 locally might introduce code that subtly breaks on Node 20 runtime in CI. `engines.node": ">=20 <22"` would enforce.

#### [M4] No health check for Listmonk or Turnstile

**File:** `src/app/api/health/route.ts:3-14`
**Current:** Only checks `https://api.resend.com`. Listmonk (`LISTMONK_API_URL`, self-hosted at `localhost:9000` per CLAUDE.md) and Turnstile are not probed. Prior audit note: "health check checks zero deps, now checks resend" — partially improved, still incomplete.
**Risk:** Newsletter subscribe + contact form depend on Listmonk / Turnstile respectively; an outage in either would return 200 from `/api/health` while users see 500s.

#### [M5] `health` endpoint `buildTime` resets every request

**File:** `src/app/api/health/route.ts:23`
**Current:** `buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString()` — the fallback uses request time, not build time.
**Evidence:** Live endpoint `curl https://alexmayhew.dev/api/health` returns `"buildTime":"2026-04-17T01:48:36.573Z"` (a timestamp from MINUTES ago, not the last deploy).
**Root cause:** The build env var is only set in `validate` job (deploy.yml:46) but NOT in the OpenNext build (deploy.yml:53-60 block), so the compiled bundle loses it. Every request falls through to the `new Date()` default.

#### [M6] Missing `env.preview` and `env.staging` blocks in wrangler

**File:** `wrangler.jsonc` — no environments defined
**Risk:** Root cause of C1. Also means there is no way to do schema-safe staging deploys today.

#### [M7] `public/llms.txt` shadows dynamic `/llms.txt` route

**Files:** `public/llms.txt` (static, stale 2026-03-15), `src/app/llms.txt/route.ts` (dynamic, newer)
**Evidence:** `curl https://alexmayhew.dev/llms.txt` returns the static content (194 lines) — ASSETS binding served it before the Worker executed. Dynamic route never runs.
**Risk:** You have a dynamic route generating up-to-date content, but the stale static file is served instead. Blog posts published after 2026-03-15 are not listed in the production llms.txt.
**Fix:** Delete `public/llms.txt`. The route will handle it.

#### [M8] Dependabot `typescript-eslint` group has no exclude

**File:** `.github/dependabot.yml:40-46`
**Note:** Since `typescript: 6.0.3` is available and breaks Next 15 ESLint config, the group would propose a failing PR. Already verified in `gh run list` — a TypeScript 6 bump failed.

#### [M9] No CODEOWNERS enforcement / review rules

**File:** `.github/CODEOWNERS` — exists but only references `@alexmayhew`; no branch protection rules visible in this repo (only server-side).
**Recommendation:** Confirm branch protection requires CI + deploy.validate to pass on `main`.

#### [M10] Mutation testing scheduled but may never complete

**File:** `.github/workflows/mutation-testing.yml:33` — `continue-on-error: true` + no timeout. Stryker mutation testing on 1099 tests can easily exceed 3 hours.
**Risk:** If it runs past 6 hours (default job timeout), it silently gets killed mid-report. `continue-on-error: true` means status is green regardless, so no alert.

#### [M11] No SBOM or supply-chain attestation

**Files:** All workflows
**Risk:** Given the adjacent use of `eslint-plugin-deslop` and `karpeslop` (unusual packages) — plus recent `karpeslop` pin — a supply-chain audit job would reduce risk. Consider `actions/attest-build-provenance` + SBOM generation on prod deploys.

#### [M12] Smoke test omits critical paths

**File:** `.github/workflows/deploy.yml:228`
**Current:** Tests `/`, `/services`, `/for`, `/contact`, `/work`. Does not test: `/blog`, `/api/health` (already done), `/robots.txt`, `/sitemap.xml`, `/feed.xml`, a known blog post, a pSEO page. A broken `[slug]` page would not be caught.

#### [M13] Sitemap validation is strict — one 404 breaks deploy

**File:** `.github/workflows/deploy.yml:240-258`
**Current:** `curl ... -> if STATUS != 200 then FAIL`. If a transient 503 from CF hits one URL, the deploy is marked failed after it already succeeded. No retries.
**Fix:** Retry each URL up to 3 times with backoff before counting as failure.

#### [M14] IndexNow + GSC submission are `if: success()` but not idempotent

**File:** `.github/workflows/deploy.yml:260-292`
**Risk:** A deploy where the sitemap job runs but IndexNow is rate-limited does not retry. GSC sitemap submission is non-fatal (line 36 of `submit-sitemap-gsc.mjs` exits 0 on error) — that's safe, but no monitoring of cumulative successes.

### LOW

#### [L1] Wrangler version one minor behind

**Current (observed in CI):** `wrangler@4.80.0`, latest 4.83.0. `opennextjs/cloudflare@1.18.0`, latest 1.19.1. Non-urgent.

#### [L2] No `.npmrc` save-exact setting

**File:** `.npmrc` only has `legacy-peer-deps=true`. Adding `save-exact=true` would prevent future `^` drift.

#### [L3] Workflow permission blocks not declared for `ci.yml`, `e2e.yml`, `mutation-testing.yml`

Following least-privilege best practice, add `permissions: contents: read` at top level of each.

#### [L4] `deploy.yml` uploads build artifacts with 1-day retention — OK, but name ("opennext-build") has no SHA suffix → parallel runs collide

If two push events arrive near-simultaneously on main, both upload-artifact steps write to the same artifact name. `concurrency.cancel-in-progress: false` mitigates, but artifact collision is still possible during the window between "validate finishes" and "download-artifact starts".

#### [L5] `public/_headers` duplicates what `custom-worker.ts` injects

**Files:** `public/_headers:4-10` and `custom-worker.ts:9-29`
Both set X-Frame-Options, X-Content-Type-Options, etc. The public/\_headers applies to static assets; the worker header applies to HTML. Functionally correct but confusing — two sources of truth for security headers. Drift is a risk (e.g., CSP differs between the two).

#### [L6] `middleware.ts` also sets CSP but with a DIFFERENT value from `custom-worker.ts`

**File:** `middleware.ts:8-20` vs `custom-worker.ts:10-24`
Both define CSP with slightly different directives. Middleware.ts omits `worker-src`; custom-worker.ts includes it. Likely middleware is shadowed by custom-worker's header injection (since worker runs after), but unclear which wins for edge-cached pages.

#### [L7] `publish-scheduled.yml` commit message pattern doesn't include `[deploy]` marker or SHA

Even if the re-trigger issue (C2) is fixed, the commit message `"content: publish <slugs> (scheduled)"` might match any no-deploy filter. Low risk.

#### [L8] No Slack/email notification on deploy failure — only GH issue

**File:** `.github/workflows/deploy.yml:294-308` creates a GitHub issue on failure. Good, but issues don't page you in real time.

#### [L9] Deploy artifact contains `NEXT_PUBLIC_*` env vars baked into bundle

**File:** `.github/workflows/deploy.yml:44-51`
`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_SENTRY_DSN`, etc. are by design public (shipped to browser). But stored as GH secrets + uploaded as artifact with retention-days: 1 — fine, just worth noting these aren't "secrets" in the secret sense.

---

## 2. Cloudflare Workers / Pages Configuration

### Verified good

- R2 binding name is exactly `NEXT_INC_CACHE_R2_BUCKET` (wrangler.jsonc:52). ✓
- `global_fetch_strictly_public` flag set (wrangler.jsonc:16) — SSRF hardening verified. ✓
- `nodejs_compat` flag set. ✓
- Self-reference service binding for cache revalidation present (wrangler.jsonc:26-33). ✓
- Smart placement enabled (wrangler.jsonc:85). ✓
- `workers.dev` subdomain kept active with `X-Robots-Tag: noindex` on `.pages.dev` responses (custom-worker.ts:49-53) — good for dev access without SEO pollution. ✓

### Issues

- See C5 (rate_limits schema), M1 (compat date), M6 (no env blocks) above.

---

## 3. OpenNext (`open-next.config.ts`) — VERDICT: MINIMAL BUT CORRECT

`open-next.config.ts` is 23 lines — only enables R2 incremental cache. No custom ISR TTLs, no fallbacks configured. For a site this size (≈150 pages, mostly static blog/pSEO), this is fine. The SSRF-relevant CVE is addressed via the compat flag in wrangler.jsonc. No action needed at this layer.

---

## 4. Monitoring & Observability

### CRITICAL / HIGH already covered:

- C5 (rate limits broken)
- H9 (no log aggregation or alerting)

### Gaps

- **No uptime monitoring.** No external pinger. A 500 from the Worker is only caught post-deploy. Recommend: Better Stack (free tier) or UptimeRobot on `/api/health` every 60s with PagerDuty/email.
- **No error budget / SLO definition.** Sentry captures errors, but no target like "99.9% of prod requests succeed over 28 days." Operationally this is fine for a solo portfolio, but if clients are being referred here, defining and publishing an SLO builds credibility.
- **Sentry release tracking:** Release is set via `NEXT_PUBLIC_SENTRY_RELEASE: ${{ github.sha }}` (deploy.yml:50, 59). Good. But no upload of source maps (`sourcemaps: { disable: true }` in next.config.mjs:73) — so Sentry errors show minified stack traces. For a public-facing site where the source is already effectively visible via the bundle, this is a needless handicap.
- **No Sentry server-side in AsyncLocalStorage contexts.** `src/instrumentation.ts` is empty. `@sentry/cloudflare` wraps the outermost fetch handler (custom-worker.ts), so the SSR render errors ARE captured. But anything running inside `React.cache()`, `unstable_cache()`, or during RSC streaming will not have a Sentry context because `@sentry/cloudflare` doesn't hook into React context. Likely acceptable — just document it.

---

## 5. Dependencies

### HIGH (covered in C4 for the critical case)

- `npm audit` report: 6 vulns (2 mod, 4 high). `npm audit fix` is safe (per audit output — "fix available via `npm audit fix`" for all except eslint-plugin-sonarjs which is dev-only).
- 20+ packages behind minor/patch. Dependabot is trying to catch up but blocked by C1.
- `framer-motion`: 12.26.2 → 12.38.0 (12 patches behind)
- `@opennextjs/cloudflare`: 1.18.0 → 1.19.1
- `next`: 15.5.14 → 15.5.15 (DoS patch)
- `@sentry/nextjs`: 10.34.0 → 10.49.0 (15 patches behind)

### Lockfile integrity

- `lockfileVersion: 3` — correct
- `legacy-peer-deps=true` in `.npmrc` — required per CLAUDE.md to keep Keystatic CSS working
- No `.npmrc` `save-exact` — so any manual `npm i foo` adds `^`

---

## 6. Build Determinism

| Check                              | State                                                           |
| ---------------------------------- | --------------------------------------------------------------- |
| `.nvmrc` present                   | ✓ (Node 20)                                                     |
| `package.json.engines`             | ✗ (not set)                                                     |
| `package-lock.json` committed      | ✓                                                               |
| `package-lock.json` uses integrity | ✓ (1880 integrity lines)                                        |
| CI uses `npm ci`                   | ✓                                                               |
| CI Node matches `.nvmrc`           | ✓ (NODE_VERSION=20)                                             |
| Build env vars passed consistently | ✗ (see M5 — buildTime lost between validate and opennext build) |

---

## 7. Preview Environments

Covered in C1. **Zero working preview environments** today.

---

## 8. Secrets Rotation Cadence

No documented policy. Secrets touched:

- `CLOUDFLARE_API_TOKEN` — no rotation evidence
- `RESEND_API_KEY`, `LISTMONK_API_*` — re-pushed every deploy (ironic: less secure, not more, because more audit log noise masks suspicious events)
- `GSC_SERVICE_ACCOUNT_JSON` — JWT-based, no rotation surface needed
- `INDEXNOW_KEY` — keyed by file at `/publik/<KEY>.txt`, no rotation process documented

Recommendation: add a `SECURITY.md` with a 90-day rotation cadence and a one-pager in `docs/` on "how to rotate each secret".

---

## 9. Disaster Recovery

### Documented

`docs/DEPLOYMENT.md:140-158` — rollback via Cloudflare Dashboard → Workers & Pages → alexmayhew-dev → Deployments → Rollback. Good, clear.

### Missing

- No documented DR for R2 cache corruption. If `NEXT_INC_CACHE_R2_BUCKET` is wiped or gets bad data, ISR pages serve stale forever. Runbook for "purge R2 cache" is missing.
- No runbook for "Cloudflare account locked / API token revoked".
- No runbook for "DNS compromised at Cloudflare".
- No off-site backup of content. Content lives in git + GitHub. If GitHub is down and rtx01 local checkout is gone, you have no deployable snapshot. (Low probability but zero-effort mitigation: mirror to a second remote like `codeberg.org`.)

---

## 10. Post-Deploy Smoke Tests

### Covered

- Health endpoint (with SHA verification, 12 retries, 5s interval) — good
- 5 critical pages (/ /services /for /contact /work) — see M12 for gaps
- Sitemap URL validation (ALL URLs) — see M13 for fragility
- IndexNow submission — warning-only, good
- GSC submission — non-fatal, good

### Missing

- No Lighthouse budget check
- No axe CI on production URL (axe IS run pre-deploy via e2e.yml against localhost; not on live prod)
- No regression test of specific pSEO pages
- No check that rate limiters fire (easy: call `/actions/contact` 10 times, assert 5 succeed and 5 rate-limited — would have caught C5)

---

## 11. IndexNow + GSC Submission

**IndexNow (deploy.yml:260-286):** Works, warning-only on failure. Key file at `/home/deploy/projects/amdev/alexmayhew-dev/public/e228067567174bb8fd777fc08c88c943.txt` served from the /{key}.txt location — confirmed present.

**GSC (scripts/submit-sitemap-gsc.mjs):** Uses service-account JWT auth against `sc-domain:alexmayhew.dev`. Non-fatal on failure (exits 0). Fine.

**Concern:** Neither script de-dupes. Sitemap has ~126 URLs after 04-09 pruning; every deploy submits all 126 to IndexNow, even if only 1 changed. IndexNow rate limits apply (per Bing docs, ≤10k URLs/day/host, which you won't hit, but it's noisy).

---

## 12. Feed Generation

- `src/app/feed.xml/route.ts` — dynamic, generates RSS from `.source/server` blog data. Served fresh every hour (`Cache-Control: public, max-age=3600`). **Working** (curl test: returns valid RSS). ✓
- `src/app/llms.txt/route.ts` — dynamic, generates from blog. **NOT reachable in prod** because `public/llms.txt` shadows it (M7 above).
- `public/llms.txt` — static, last modified 2026-03-15. Stale.
- `src/app/robots.ts` and `src/app/sitemap.ts` — exist, not audited in this pass but recent fix noted in git log ("prune sitemap 152→126").

---

## Priority Fix Order (recommended sequence)

1. **C1 / M6** — Add `env.preview` block to `wrangler.jsonc`; unblock all PRs. Or short-term: skip deploy-preview for dependabot (`if: github.actor != 'dependabot[bot]'`).
2. **C4 / npm audit** — `npm audit fix` to patch Next.js DoS + dompurify + vite + minimatch + brace-expansion.
3. **C3** — Move secret push BEFORE deploy, add empty-secret guards, or drop secret-push entirely if they don't rotate.
4. **C5** — Fix `rate_limits` schema in wrangler.jsonc; verify at runtime that limiters actually fire.
5. **C2** — Either use a PAT in publish-scheduled.yml, or chain via `workflow_run`.
6. **H2** — Merge test into deploy prerequisite chain.
7. **H4** — Add `timeout-minutes` to every job.
8. **M7** — Delete `public/llms.txt` so the dynamic route wins.
9. **M5** — Pass `NEXT_PUBLIC_BUILD_TIME` through the opennext build step.
10. **M2** — Update CLAUDE.md version pins to match reality, OR actually pin.
11. **H1** — Add `.next/cache` restore to CI.
12. **H3** — Pin GitHub Actions to SHAs.
13. **H9** — Configure Workers log export + uptime monitor.

---

## Appendix — Verified Pipeline Runtime

From `curl https://alexmayhew.dev/api/health` at 2026-04-17 01:48 UTC:

```json
{
  "status": "ok",
  "deployment": { "sha": "c86c947", ... },
  "dependencies": { "resend": "reachable" }
}
```

Production is healthy. Last green deploy: c86c947 (2026-04-09, "fix(seo): prune sitemap"). All failures since are dependabot preview-deploys (C1), not production.
