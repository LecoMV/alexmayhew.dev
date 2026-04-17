# Sentry SDK with OpenNext on Cloudflare Workers (Updated 2026-03-14)

**Status:** CURRENT
**Session:** Refresh to cover @sentry/nextjs v10.34+, @sentry/cloudflare v10.x, GitHub issue closure

---

## Executive Summary

The situation has materially changed since the February 2026 research. Sentry has shipped a
first-class `@sentry/cloudflare` package (now at **v10.43.0**, weekly releases) and officially
closed GitHub issue #14931. The old workaround of disabling `sentry.server.config.ts` in
`instrumentation.ts` is no longer necessary for new setups — the recommended approach is to
keep `@sentry/nextjs` for the client and build/config layer, and use `@sentry/cloudflare`
for the edge/server runtime.

---

## Question-by-Question Answers

### 1. Has the AsyncLocalStorage incompatibility been resolved in v10.x?

**Yes, via `nodejs_compat` flag — this is now the documented approach, not a workaround.**

The `AsyncLocalStorage` crash on Cloudflare Workers is resolved by enabling the `nodejs_compat`
compatibility flag in `wrangler.jsonc`. The Sentry SDK requires this flag, and Cloudflare now
documents it as the standard configuration for running Node.js-API-dependent SDKs in Workers.

The crash we experienced (server-side `Sentry.init()` from `@sentry/nextjs` crashing with
"AsyncLocalStorage bound function" errors) was caused by `@sentry/nextjs` attempting to load
internals that are incompatible with the workerd runtime — not with `AsyncLocalStorage` per se.
The fix is to use `@sentry/cloudflare` for the edge runtime, which is designed for workerd.

**GitHub issue #14931** — "Support Next.js on Cloudflare Workers (OpenNext)" — is now **Closed**.
The resolution is the framework guide at:
`https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/nextjs/`

### 2. Current recommended approach for Sentry on Cloudflare Workers/Pages with Next.js via OpenNext

**Official Sentry docs now state (as of the current page at `/cloudflare/frameworks/nextjs/`):**

> The Sentry Next.js SDK supports Next.js applications deployed on Cloudflare Workers, but
> requires additional configuration to run in this environment.

The configuration is purely Wrangler-level — no special hybrid SDK setup is required:

```jsonc
// wrangler.jsonc — REQUIRED settings
{
	"compatibility_flags": ["nodejs_compat"],
	"compatibility_date": "2025-08-16",
}
```

The `compatibility_date: "2025-08-16"` is required to introduce `https.request` into the
Cloudflare Workers runtime. Without it, Sentry cannot send data to its ingest endpoints.

After adding these settings, the existing `@sentry/nextjs` setup (with `instrumentation.ts`,
`sentry.edge.config.ts`, `sentry.client.config.ts`, and `withSentryConfig` in `next.config.ts`)
should work correctly without further changes.

### 3. Is there a @sentry/cloudflare package? What's its status?

**Yes — it is a fully shipping, production-ready first-party Sentry package.**

| Property        | Value                                               |
| --------------- | --------------------------------------------------- |
| Package         | `@sentry/cloudflare`                                |
| Latest version  | **10.43.0** (as of 2026-03-14, shipping weekly)     |
| npm downloads   | ~33,992/week on latest tag                          |
| Status          | Production — no alpha/beta tag                      |
| npm page        | https://npmjs.com/package/@sentry/cloudflare        |
| Cloudflare docs | Listed under Workers > Observability > Integrations |

**What it is:** A purpose-built Sentry SDK for the Cloudflare Workers/Pages runtime (workerd).
It provides `withSentry()` for Workers and `sentryPagesPlugin` / `wrapRequestHandler()` for Pages.
It is framework-agnostic — it wraps the fetch handler directly.

**For Next.js via OpenNext**, `@sentry/nextjs` is still the correct package for:

- Build-time config (`withSentryConfig` in `next.config.ts`)
- Client-side error capture (`sentry.client.config.ts`)
- Source map uploading

`@sentry/cloudflare` is an option for the server/edge runtime config if the `@sentry/nextjs`
edge config continues to have issues after enabling the Wrangler compatibility settings.

**Compatibility flags:**

```jsonc
// Either of these work (nodejs_compat is broader, nodejs_als is minimal):
{ "compatibility_flags": ["nodejs_compat"] }
// or
{ "compatibility_flags": ["nodejs_als"] }
```

**New in v10.35.0+:** Automatic release detection via `CF_VERSION_METADATA` binding. Before
v10.35.0, `release` must be passed manually via `env.CF_VERSION_METADATA?.id`.

### 4. Best practice for server-side error tracking on Cloudflare Workers if Sentry doesn't work

**Option A: Fix the root cause — enable `nodejs_compat` + `compatibility_date: 2025-08-16`.**

This is the correct first step and will resolve the issue for most setups using `@sentry/nextjs`.

**Option B: Hybrid SDK approach (belt-and-suspenders)**

Use `@sentry/cloudflare` in `sentry.edge.config.ts` instead of `@sentry/nextjs`:

```typescript
// sentry.edge.config.ts
import * as Sentry from "@sentry/cloudflare";

// For standalone Workers/Pages, use withSentry() or sentryPagesPlugin().
// For Next.js via OpenNext, the SDK is initialized differently —
// see https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/nextjs/
Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampleRate: 0.05,
	sendDefaultPii: true,
	enableLogs: true,
});
```

**Option C: Cloudflare Workers Observability (native, no third-party)**

Cloudflare has a built-in observability layer that does not require any SDK:

- **Workers Logs** (`/workers/observability/logs/workers-logs/`) — structured logs from
  `console.log()` and `console.error()`, stored and queryable in the Cloudflare dashboard.
- **Workers Logpush** — push logs to R2, S3, Datadog, Splunk, or Elastic.
- **Traces (Beta)** — distributed tracing via OpenTelemetry spans.
- **OpenTelemetry export** — documented export to Honeycomb, Grafana Cloud, Axiom, and Sentry.

For a portfolio/lead-gen site, Workers Logs alone may be sufficient for observability without
adding any SDK dependency. Access via: Cloudflare Dashboard > Workers & Pages > your worker > Logs.

### 5. Alternatives to Sentry for Cloudflare Workers error tracking

#### Toucan.js — DEAD (archived January 2026)

`toucan-js` (https://github.com/robertcepa/toucan-js) was a community Sentry client built
specifically for Cloudflare Workers. It was archived by its owner on **January 12, 2026**.
The README's implicit reason: `@sentry/cloudflare` now covers the same use case officially.
Do not use Toucan.js for new projects.

#### Cloudflare Workers Logpush (native)

- **What:** Push structured worker logs to any destination.
- **Destinations:** R2, S3, Datadog, Splunk, Elastic, Supabase, Grafana.
- **Cost:** Free on paid Workers plans; Logpush to third-party services may incur third-party costs.
- **Setup:** Dashboard or Wrangler config.
- **Limitation:** Logs only — no error grouping, stack trace parsing, or alerts out of the box.
- **Docs:** https://developers.cloudflare.com/workers/observability/logs/logpush/

#### Axiom (best Logpush target for developer workflows)

- OpenTelemetry native.
- Free tier: 500GB/month ingest.
- Workers OTEL export guide: https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/axiom/
- Better search/query UI than raw Logpush targets.

#### Grafana Cloud (OTEL-native, free tier available)

- OTEL export supported natively by Cloudflare.
- Free tier includes logs + metrics + traces.
- Setup guide: https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/grafana-cloud/

#### BetterStack / Baselime

- Baselime was acquired by Cloudflare in 2024 and has been integrated into the Workers observability
  stack as the "Cloudflare Log Explorer" (query UI in the dashboard).
- No separate installation needed — it's the backend for Workers Logs.

---

## Current Project Configuration Analysis

The existing setup in this project (`sentry.edge.config.ts` disabled in `instrumentation.ts`,
`@sentry/nextjs` client-only) was a correct workaround as of early 2026. With the issue now
closed and `@sentry/cloudflare` v10.43.0 shipping, the recommended next step is:

1. **Verify `wrangler.jsonc` has the required settings** (may already be set):

   ```jsonc
   {
   	"compatibility_flags": ["nodejs_compat"],
   	"compatibility_date": "2025-08-16",
   }
   ```

2. **Re-enable `sentry.edge.config.ts`** in `instrumentation.ts`:

   ```typescript
   // instrumentation.ts
   export async function register() {
   	if (process.env.NEXT_RUNTIME === "nodejs") {
   		await import("./sentry.server.config");
   	}
   	if (process.env.NEXT_RUNTIME === "edge") {
   		await import("./sentry.edge.config"); // Re-enable this
   	}
   }
   ```

3. **Test server-side error capture** by triggering a test error via the route handler and
   confirming it appears in the Sentry dashboard.

4. **Optionally upgrade to `@sentry/cloudflare`** for the edge config if step 2 still crashes.

---

## Feature Support Matrix (Current — v10.43.0)

| Feature             | @sentry/nextjs (client) | @sentry/nextjs (edge)    | @sentry/cloudflare (edge)      |
| ------------------- | ----------------------- | ------------------------ | ------------------------------ |
| Error Monitoring    | Yes                     | Yes (with nodejs_compat) | Yes                            |
| Performance Tracing | Yes                     | Partial (0ms spans)      | Partial (0ms spans)            |
| Logs                | Yes                     | Yes                      | Yes (`enableLogs: true`)       |
| Session Replay      | Yes                     | No                       | No                             |
| Profiling           | Yes                     | No                       | No                             |
| Source Maps         | Yes (build-time)        | Via @sentry/nextjs       | Via wizard                     |
| D1 Instrumentation  | No                      | No                       | Yes (`instrumentD1WithSentry`) |
| Cron Monitoring     | No                      | No                       | Yes (`withMonitor`)            |

**Known limitation (permanent):** Span durations show 0ms on Cloudflare Workers.
This is a Cloudflare security measure (`performance.now()` / `Date.now()` only advance after I/O).
Affects all frameworks on Cloudflare. Not a Sentry bug.

---

## Sources

- [Sentry: Next.js on Cloudflare (official guide)](https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/nextjs/)
- [Sentry: @sentry/cloudflare quick start](https://docs.sentry.io/platforms/javascript/guides/cloudflare/)
- [Sentry: @sentry/nextjs deploying on Cloudflare (redirects to above)](https://docs.sentry.io/platforms/javascript/guides/nextjs/best-practices/deploying-on-cloudflare/)
- [npm: @sentry/cloudflare v10.43.0](https://npmjs.com/package/@sentry/cloudflare)
- [GitHub issue #14931: Support Next.js on Cloudflare Workers — CLOSED](https://github.com/getsentry/sentry-javascript/issues/14931)
- [Cloudflare: Workers Observability > Integrations > Sentry](https://developers.cloudflare.com/workers/observability/)
- [Cloudflare: Workers Logpush](https://developers.cloudflare.com/workers/observability/logs/logpush/)
- [Cloudflare: Export OpenTelemetry to Axiom](https://developers.cloudflare.com/workers/observability/exporting-opentelemetry-data/axiom/)
- [Toucan.js (ARCHIVED January 2026)](https://github.com/robertcepa/toucan-js)
