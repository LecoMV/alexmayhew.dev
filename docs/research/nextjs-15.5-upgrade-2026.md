# Next.js 15.5.x Upgrade Research (2026-02-15)

**Status:** CURRENT
**Session:** Evaluating upgrade from 15.5.9 to 15.5.10+ to resolve CVE-2026-23864 and CVE-2025-59471
**Context:** Next.js 15 + React 19 app deployed via @opennextjs/cloudflare to Cloudflare Workers

---

## Executive Summary

**Recommended Action:** Upgrade to Next.js **15.5.10** (not 15.5.11 or 15.5.12) due to security patches and compatibility constraints.

**Key Findings:**

1. **Security patches:** 15.5.10 resolves both CVEs
2. **OpenNext compatibility:** 15.5.10 is explicitly listed in peer dependencies (`~15.5.10`)
3. **Edge runtime impact:** Both CVEs have **reduced/no impact** on Cloudflare Workers deployments
4. **Known regression:** 15.5.11+ has unresolvable @next/swc version mismatch warnings
5. **Breaking changes:** None between 15.5.9 → 15.5.10

---

## 1. Available Versions & Patches

### Next.js 15.5.x Releases (Verified via NPM)

```
15.5.9  → Current version
15.5.10 → Security patch (Jan 26, 2026) — RECOMMENDED
15.5.11 → Has @next/swc mismatch issue
15.5.12 → Latest stable (Feb 2026)
```

### @opennextjs/cloudflare Compatibility

**Current:** `1.14.4`
**Supported Next.js versions (from peer dependencies):**

```
~15.0.8 || ~15.1.12 || ~15.2.9 || ~15.3.9 || ~15.4.11 || ~15.5.10 || ~16.0.11 || ^16.1.5
```

**Critical:** OpenNext **explicitly lists `~15.5.10`**, meaning 15.5.10 is the supported patch version for the 15.5 minor line. Upgrading to 15.5.11 or 15.5.12 may cause compatibility issues.

---

## 2. Security Vulnerabilities Analysis

### CVE-2026-23864 (GHSA-h25m-26qc-wcjf)

**Severity:** High (DoS via HTTP request deserialization)
**Affected:** Next.js 13.x, 14.x, 15.x, 16.x using App Router
**Attack Vector:** Specially crafted HTTP requests to Server Function endpoints cause excessive CPU/memory usage
**Patched in:** 15.5.10, 16.1.5

**Impact on Cloudflare Workers:**

- **Likely REDUCED risk** — Cloudflare Workers enforce strict memory limits (128MB default) and CPU time limits (50ms-30s depending on plan)
- Workers runtime kills processes exceeding limits, preventing sustained DoS
- Attack would cause individual request failures, not entire server crashes
- **Still recommended to patch** as excessive requests could exhaust account quotas

### CVE-2025-59471 (GHSA-9g9p-9gw9-jx7f)

**Severity:** High (DoS via Image Optimizer)
**Affected:** Self-hosted Next.js applications with `remotePatterns` configured
**Attack Vector:** Requesting optimization of arbitrarily large images via `/_next/image` causes OOM
**Patched in:** 15.5.10, 16.1.5

**Impact on Cloudflare Workers:**

- **NO IMPACT** on OpenNext Cloudflare deployments
- Cloudflare Workers **does not support** the default Next.js Image Optimizer (`/_next/image` endpoint)
- OpenNext Cloudflare uses [Cloudflare Images API](https://opennext.js.org/cloudflare/howtos/image) instead, which requires explicit IMAGES binding configuration
- If you're not using Cloudflare Images (i.e., no IMAGES binding in `wrangler.jsonc`), image optimization is disabled entirely
- **Verify:** Check `next.config.js` for `images.loader` config and `wrangler.jsonc` for `IMAGES` binding

**Conclusion:** This CVE is irrelevant to Cloudflare Workers deployments unless you've explicitly configured Cloudflare Images (which has its own resource limits).

---

## 3. Breaking Changes & Regressions

### 15.5.9 → 15.5.10

**Breaking changes:** None documented
**Changes:** Security patches for CVE-2026-23864 and CVE-2025-59471

### 15.5.10 → 15.5.11/15.5.12

**Known regression (15.5.11+):** Unresolvable `@next/swc` version mismatch warnings

**Issue:** Next.js 15.5.11+ lists `@next/swc@15.5.7` as an optional dependency, but expects `@next/swc@15.5.11`. There is no `@next/swc@15.5.11` published, causing warnings:

```
Mismatching @next/swc version, detected: 15.5.7 while Next.js is on 15.5.11
```

**Workaround:** Run `npm install` again to suppress warnings temporarily, but this is a cosmetic issue with no functional impact.

**Recommendation:** Avoid 15.5.11+ unless OpenNext explicitly adds support. Stick with 15.5.10.

### Next.js 15 → 16 (Future)

Next.js 16 introduces:

- Removal of `legacyBehavior` prop for `next/link`
- Deprecation warnings for Next.js 15 patterns
- OpenNext already supports 16.0.11 and ^16.1.5

---

## 4. Upgrade Path Recommendation

### Option A: Direct Upgrade to 15.5.10 (RECOMMENDED)

```bash
npm install next@15.5.10
npm run build  # Verify build passes
npm test       # Run test suite
git add package.json package-lock.json
git commit -m "security: upgrade Next.js 15.5.9 → 15.5.10 (CVE-2026-23864, CVE-2025-59471)"
git push origin main  # GitHub Actions handles deployment
```

**Rationale:**

- Single-step upgrade minimizes risk
- 15.5.10 is explicitly supported by OpenNext 1.14.4
- Both CVEs patched
- No breaking changes

### Option B: Incremental Upgrade (Overly Cautious)

Not necessary for a patch-level upgrade. Only consider this for major version jumps (e.g., 15 → 16).

---

## 5. Pre-Upgrade Checklist

### Verify Current Configuration

```bash
# Check Next.js image config (should use Cloudflare Images or disable optimization)
grep -A 10 "images:" /home/deploy/projects/amdev/alexmayhew-dev/next.config.js

# Check wrangler.jsonc for IMAGES binding
grep -A 5 "IMAGES" /home/deploy/projects/amdev/alexmayhew-dev/wrangler.jsonc

# Confirm current versions
cd /home/deploy/projects/amdev/alexmayhew-dev
npm list next @opennextjs/cloudflare react react-dom
```

### Post-Upgrade Verification

```bash
# Local build test
npm run build

# Lint + typecheck
npm run validate

# Health check after deploy
curl -s https://alexmayhew.dev/api/health | jq
```

---

## 6. Edge Runtime Considerations

### Cloudflare Workers Constraints

- **No Node.js fs/path** — Already handled (project uses `nodejs_compat` flag)
- **No Image Optimizer by default** — Next.js `/_next/image` doesn't work on Workers
- **Memory limits:** 128MB default (can OOM, but Workers kill the process)
- **CPU time limits:** 10ms (free), 50ms (paid), 30s (unbound workers)

### OpenNext Cloudflare Adapter

- **Version 1.14.4** supports Next.js `~15.5.10` explicitly
- **Compatibility date:** Must be `2024-09-23` or later (already configured)
- **Turbopack:** Supported in dev mode (`npm run dev` uses `--turbopack`)
- **Composable Caching (`use cache`):** NOT yet supported (Next.js 15 feature)

---

## 7. Known Limitations (Not Upgrade-Related)

### Next.js 15 Features Not Supported by OpenNext

- `'use cache'` directive (Composable Caching)
- Dynamic OG image generation in edge runtime (requires Node.js APIs)

### Next.js 14 EOL

OpenNext will drop Next.js 14 support in Q1 2026 (already past). Focus on 15.x or 16.x.

---

## 8. Monitoring & Rollback Plan

### Health Monitoring

- **Cloudflare Workers Dashboard:** Monitor error rates, CPU time, memory usage
- **Sentry:** Already configured (`@sentry/nextjs@10.34.0`) — watch for new error patterns
- **GitHub Actions:** Deployment includes automated health check (`/api/health`)

### Rollback Procedure

**DO NOT deploy manually.** If production breaks:

1. **Cloudflare Dashboard:** Workers & Pages → alexmayhew-dev → Deployments → Rollback
2. **Fix locally:** Revert commit, test, push new commit
3. **GitHub Actions re-deploys** automatically

---

## Sources

### Security Advisories

- [GHSA-h25m-26qc-wcjf: Next.js HTTP request deserialization DoS](https://github.com/advisories/GHSA-h25m-26qc-wcjf)
- [GHSA-9g9p-9gw9-jx7f: Next.js Image Optimizer DoS](https://github.com/vercel/next.js/security/advisories/GHSA-9g9p-9gw9-jx7f)
- [GitLab Advisory Database (GHSA-h25m-26qc-wcjf)](https://advisories.gitlab.com/pkg/npm/next/GHSA-h25m-26qc-wcjf/)

### Next.js Documentation

- [Next.js 15.5 Release](https://nextjs.org/blog/next-15-5)
- [Next.js Releases (GitHub)](https://github.com/vercel/next.js/releases)
- [Upgrading to Next.js 15](https://nextjs.org/docs/app/guides/upgrading/version-15)

### OpenNext Cloudflare

- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare)
- [Image Optimization with Cloudflare](https://opennext.js.org/cloudflare/howtos/image)
- [Cloudflare Next.js Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [@opennextjs/cloudflare NPM](https://www.npmjs.com/package/@opennextjs/cloudflare)

### Known Issues

- [Unresolvable @next/swc version mismatch (Issue #89251)](https://github.com/vercel/next.js/issues/89251)
- [Next.js and Cloudflare Pages Limitations](https://www.thetombomb.com/posts/nextjs-pages-cloudflare-pages)
- [Cloudflare Pages Next.js Image Optimization Discussion](https://community.cloudflare.com/t/next-image-optimization/625474)

---

## Decision Record

**Date:** 2026-02-15
**Decision:** Upgrade to Next.js 15.5.10
**Rationale:**

1. Both CVEs patched (GHSA-h25m-26qc-wcjf, GHSA-9g9p-9gw9-jx7f)
2. Explicitly supported by @opennextjs/cloudflare@1.14.4
3. No breaking changes from 15.5.9
4. Avoids 15.5.11+ @next/swc mismatch issue
5. Edge runtime deployment reduces CVE impact significantly

**Risk Level:** LOW
**Rollback Plan:** Cloudflare Dashboard → Rollback deployment
