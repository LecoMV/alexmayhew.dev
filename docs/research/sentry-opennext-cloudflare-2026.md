# Sentry SDK with OpenNext on Cloudflare Workers (2026-02-15)

**Status:** CURRENT
**Session:** Integration health check after implementing Sentry monitoring

## Executive Summary

`@sentry/nextjs` v10+ has **partial support** for OpenNext on Cloudflare Workers. While it works, there are known issues and recommended workarounds. The Sentry team has an open GitHub issue (#14931) for improving this integration, indicating active development.

## Key Findings

### 1. Compatibility Status

**Works but with caveats:**

- `@sentry/nextjs` can run on Cloudflare Workers via OpenNext
- Requires specific compatibility settings (see Configuration Requirements)
- Edge runtime errors may not flush properly (known issue)
- **CONFIRMED (2026-02-16):** Server-side `Sentry.init()` crashes CF Workers with `AsyncLocalStorage` bound function error. Server/edge init in `instrumentation.ts` is DISABLED.
- **Recommended workaround:** Use `@sentry/cloudflare` for server/edge, `@sentry/nextjs` for client only

**Official stance:** As of January 2025, GitHub issue #14931 remains open with status "Waiting for: Product Owner", indicating official support is not yet complete.

### 2. Configuration Requirements

#### Cloudflare Compatibility Settings

**Required in `wrangler.toml` or OpenNext config:**

```toml
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2025-08-16"
```

**Why:**

- `nodejs_compat`: Provides `AsyncLocalStorage` API required by Sentry SDK
- `compatibility_date: 2025-08-16`: Introduces `https.request` needed for Sentry to send data

#### Next.js Config

**Our current setup is correct:**

```typescript
withSentryConfig(nextConfig, {
	sourcemaps: { disable: true },
	autoInstrumentServerFunctions: false,
	autoInstrumentMiddleware: false,
	autoInstrumentAppDirectory: false,
});
```

**Why we disabled auto-instrumentation:**

- These flags are **Webpack-only features** (no-ops in Turbopack/Next.js 15)
- With Turbopack, Sentry relies on Next.js's OpenTelemetry instrumentation instead
- Disabling them has **no negative impact** on modern Next.js apps
- Reduces build complexity and potential conflicts

### 3. Instrumentation Pattern

**Our `src/instrumentation.ts` approach is CORRECT:**

```typescript
export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./sentry.server.config");
	}
	if (process.env.NEXT_RUNTIME === "edge") {
		await import("./sentry.edge.config");
	}
}

export async function onRequestError(err: unknown, request: NextRequest) {
	Sentry.captureException(err, { extra: { request } });
}
```

**Which config file runs on Cloudflare?**

- **`sentry.edge.config.ts`** runs in Cloudflare Workers (workerd runtime)
- **`sentry.server.config.ts`** only runs if there are Node.js-based parts (unlikely with full OpenNext deployment)
- Both are needed because Next.js conditionally imports based on `NEXT_RUNTIME` environment variable

### 4. Feature Support on Cloudflare Workers

| Feature             | Supported  | Notes                                                 |
| ------------------- | ---------- | ----------------------------------------------------- |
| Error Monitoring    | ✅ Yes     | Core functionality works                              |
| Performance Tracing | ⚠️ Partial | Spans show 0ms duration (Cloudflare security measure) |
| Logs                | ✅ Yes     | Via `enableLogs` option                               |
| Session Replay      | ❌ No      | Client-side only, not available server-side           |
| Profiling           | ❌ No      | Not documented for Workers runtime                    |
| Source Maps         | ✅ Yes     | Upload via `authToken` in `withSentryConfig`          |

**Known Limitation:** Server-side spans display `0ms` for durations because `performance.now()` and `Date.now()` only advance after I/O occurs in Cloudflare Workers. This is intentional security design to prevent timing attacks. **This affects ALL frameworks on Cloudflare.**

### 5. Recommended `tracesSampleRate` for Production

**Portfolio/lead-gen site with moderate traffic:**

- **Start with:** `0.05` (5%)
- **Testing:** `1.0` (100%)
- **High-traffic apps:** `0.01` (1%) or use `tracesSampler` for dynamic sampling

**Rationale:**

- Balance between data accuracy and volume/cost
- Monitor usage stats via Sentry dashboard
- Gradually increase if you need more data
- Portfolio sites typically don't need 100% trace coverage

**Our current config uses:** `tracesSampleRate: 1.0` — acceptable for initial launch, should reduce to 0.05-0.1 after stabilization.

### 6. Hybrid SDK Approach (Recommended Workaround)

**Problem:** Edge runtime error flushing doesn't work reliably with `@sentry/nextjs` v8+ on Cloudflare Pages/Workers.

**Solution from Sentry team:**

```typescript
// sentry.edge.config.ts (server/edge runtime)
import * as Sentry from "@sentry/cloudflare";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampleRate: 0.05,
	sendDefaultPii: true,
	enableLogs: true,
});

// sentry.client.config.ts (browser)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampleRate: 0.05,
	replaysOnErrorSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
});
```

**Trade-off:** Adds `@sentry/cloudflare` as additional dependency, but ensures reliable error capture in edge runtime.

## Answers to Original Questions

### 1. Does `@sentry/nextjs` v10+ work correctly in Cloudflare Workers via OpenNext?

**Partially.** Client-side works fine. Server-side error capture may not flush properly (known issue). Recommended approach is hybrid: `@sentry/cloudflare` for edge, `@sentry/nextjs` for client.

### 2. Is `instrumentation.ts` the correct approach for OpenNext/Cloudflare?

**Yes.** This is the recommended pattern for Next.js 15+ (Turbopack + App Router). The `onRequestError` hook is especially important for capturing request-level errors in edge runtime.

### 3. Are the auto-instrumentation flags we disabled actually needed for Cloudflare compatibility?

**No.** These flags are Webpack-only and become no-ops in Turbopack/Next.js 15. Disabling them has zero impact on functionality. Modern Next.js relies on OpenTelemetry instrumentation instead.

### 4. Does `sentry.server.config.ts` even get loaded in an edge/Workers environment?

**No.** Only `sentry.edge.config.ts` loads in Cloudflare Workers (`process.env.NEXT_RUNTIME === 'edge'`). The `sentry.server.config.ts` file only runs if there are Node.js runtime components, which is unlikely with full OpenNext deployment. However, keep both files for flexibility.

### 5. Are there any Sentry features that don't work on Cloudflare Workers?

**Yes:**

- **Session Replay:** Client-side only, not available server-side
- **Profiling:** Not documented for Workers runtime
- **Accurate trace timing:** Spans show 0ms (Cloudflare security measure, not a bug)

### 6. What's the recommended `tracesSampleRate` for a portfolio/lead-gen site?

**0.05 to 0.1 (5-10%)** for production. Start at 5%, monitor usage, adjust as needed. Current config at 1.0 is fine for initial launch but should be reduced post-stabilization.

## Recommended Next Steps

### Immediate (Optional but Recommended)

1. **Add `@sentry/cloudflare` package:**

   ```bash
   npm install @sentry/cloudflare --save
   ```

2. **Update `sentry.edge.config.ts` to use `@sentry/cloudflare`:**

   ```typescript
   import * as Sentry from "@sentry/cloudflare";
   // ... rest of config
   ```

3. **Verify Cloudflare compatibility settings in OpenNext config** include:
   ```toml
   compatibility_flags = ["nodejs_compat"]
   compatibility_date = "2025-08-16"
   ```

### Post-Launch (Within 1-2 weeks)

4. **Reduce `tracesSampleRate` to 0.05 in production** to manage costs/volume

5. **Monitor Sentry dashboard** for:
   - Error capture rate (should be >0 once traffic arrives)
   - Trace volume (should match expected sample rate)
   - Alert for uncaught errors in edge runtime

6. **Track GitHub issue #14931** for official OpenNext support updates

## Sources

- [Sentry Next.js on Cloudflare Workers Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/best-practices/deploying-on-cloudflare/)
- [Sentry Cloudflare Workers SDK](https://docs.sentry.io/platforms/javascript/guides/cloudflare/)
- [GitHub Issue #14931: Support Next.js on Cloudflare Workers (OpenNext)](https://github.com/getsentry/sentry-javascript/issues/14931)
- [Sentry Next.js Automatic Instrumentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing/instrumentation/automatic-instrumentation/)
- [Sentry Sampling Configuration](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/sampling/)
- [Cloudflare Next.js Deployment Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare)
- [Sentry withSentryConfig Source Code](https://github.com/getsentry/sentry-javascript/blob/develop/packages/nextjs/src/config/withSentryConfig.ts)
- [Next.js Turbopack Support for Sentry](https://blog.sentry.io/turbopack-support-next-js-sdk/)

## Related Documentation

- `CLAUDE.md` — Project deployment rules (never manual deploy)
- `.claude/rules/deployment.md` — CI/CD workflow via GitHub Actions
- `docs/DEPLOYMENT.md` — Full deployment guide with health checks
