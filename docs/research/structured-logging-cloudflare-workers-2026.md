# Structured Logging for Cloudflare Workers / Next.js Edge Runtime (2026-02-17)

**Status:** CURRENT
**Session:** Research for implementing structured logging with correlation IDs in the alexmayhew.dev stack (Next.js 15 + OpenNext + Cloudflare Workers)

---

## Summary / Recommendation

**Use plain `console.log({...})` with JSON objects — no logging library needed.**

The Cloudflare Workers runtime auto-indexes JSON fields from `console.log()` directly. Pino does not work in the Workers runtime (transports are incompatible, Node.js-specific deps fail). The correct pattern is a thin hand-rolled logger in `src/lib/logger.ts` that calls `console.log()` / `console.error()` with a structured object. Correlation IDs should be injected via `middleware.ts` as an `X-Request-ID` response header, then read inside route handlers via `request.headers`.

---

## 1. Existing Logging Audit

### All `console.error` / `console.log` calls in `src/app/api/`

| File                                                          | Line  | Call            | Message Pattern                                 |
| ------------------------------------------------------------- | ----- | --------------- | ----------------------------------------------- |
| `src/app/api/chat/route.ts`                                   | 170   | `console.error` | `"AI binding not configured"`                   |
| `src/app/api/chat/route.ts`                                   | 190   | `console.error` | `"Chat API error:", error`                      |
| `src/app/api/vectorize/generators/route.ts`                   | 32    | `console.error` | `"[TraceForge] Generators error:", error`       |
| `src/app/api/vectorize/route.ts`                              | 53-56 | `console.error` | `"[TraceForge] Upload error:", error.message`   |
| `src/app/api/vectorize/[taskId]/download/[filename]/route.ts` | 61-64 | `console.error` | `"[TraceForge] Download error:", error.message` |
| `src/app/api/vectorize/[taskId]/status/route.ts`              | 47-50 | `console.error` | `"[TraceForge] Status error:", error.message`   |
| `src/app/api/vectorize/[taskId]/process/route.ts`             | 68-71 | `console.error` | `"[TraceForge] Process error:", error.message`  |

**Current problems:**

- Unstructured strings — not queryable in Workers Logs dashboard
- No correlation/request IDs — cannot trace a single request across logs
- Mixed format (positional args to console vs JSON objects)
- No log level field — cannot filter by severity

### Existing logging utility

**None.** No logger exists in `src/lib/`. All logging is bare `console.error()` calls.

### Wrangler config logging note

`wrangler.jsonc` already has:

```json
"observability": {
  "enabled": true
}
```

This enables Workers Logs (the new structured observability product). The project is already opted in.

---

## 2. Cloudflare Workers Logging Constraints

### Pino: NOT compatible

**Verdict: Do not use pino with Cloudflare Workers.**

- Pino transports use Node.js `worker_threads` which are not available in the Workers runtime
- Pino's Node.js build has internal deps that fail in workerd
- Pino's creator (Matteo Collina) confirmed: "pino transports make no sense in workerd because in workerd executions are short lived, while transports make sense for long running processes"
- `pino/browser` is theoretically possible (it falls back to `console.log`) but adds bundle size with no benefit over plain `console.log({...})`

**Confidence: VERIFIED** (GitHub discussion cloudflare/workerd#3423)

### Lightweight logging libraries for edge

None are needed. The Workers runtime's `console.*` API feeds directly into Workers Logs with full structured indexing when you pass JSON objects.

Options if you wanted a library:

- `pino/browser` — works but unnecessary overhead for what amounts to `console.log` wrapping
- `consola` — browser-compatible but adds bundle weight
- `@std/log` / hand-rolled — recommended

### `console.log(JSON.stringify({...}))` vs `console.log({...})`

**Use `console.log({...})` (object directly), NOT `JSON.stringify`.**

From Cloudflare Workers Logs docs: passing an object directly causes Workers Logs to "automatically extract the fields and index them intelligently in the database." The dashboard can then filter and query by individual keys.

`console.log(JSON.stringify({...}))` produces a string, which is stored as an unstructured `{message: "..."}` blob — not individually indexed.

---

## 3. Cloudflare Logpush / Workers Logs

### How Workers Logs captures output

- All `console.log()`, `console.warn()`, `console.error()` calls are captured
- Workers Logs is enabled via `"observability": { "enabled": true }` in `wrangler.jsonc` (already set)
- Logs are stored for 7 days, queryable via the Workers Dashboard Query Builder
- Included in both Free and Paid plans (billing started April 2025)

### Structured logging standard

No prescribed field schema — Workers Logs indexes whatever key-value pairs you include. Recommended fields by convention:

```json
{
	"level": "error",
	"requestId": "550e8400-e29b-41d4-a716-446655440000",
	"route": "/api/chat",
	"method": "POST",
	"status": 500,
	"message": "AI binding not configured",
	"error": "...",
	"durationMs": 12
}
```

### Does `wrangler tail` parse JSON?

Yes. `wrangler tail` outputs each invocation as a structured JSON object. Each `console.log()` appears in the `logs` array with a `message` field. When you log an object, `wrangler tail | jq '.logs[].message'` shows the object. The Workers Logs dashboard provides full field-level filtering and queries.

### Logpush

`logpush` can be enabled via `wrangler.jsonc` with `"logpush": true` to ship logs to external destinations (S3, Splunk, Datadog, etc.). The `logs` + `exceptions` combined fields have a **16,384 character limit** before truncation — keep individual log payloads lean.

---

## 4. Correlation ID Pattern

### Can `crypto.randomUUID()` be used in Workers?

**Yes.** `crypto.randomUUID()` is part of the Web Crypto API and is fully available in the Cloudflare Workers runtime. Confirmed with compatibility date `2025-12-01` (the project's current date).

```typescript
const requestId = crypto.randomUUID(); // Works in Workers runtime
```

### Injecting request ID via Next.js middleware

**The correct approach for OpenNext/Cloudflare Workers:**

1. Create `src/middleware.ts` (does not exist yet in this project)
2. Generate a `requestId` in middleware using `crypto.randomUUID()`
3. Attach it as a request header forwarded to the route handler: `x-request-id`
4. Also set it on the response so clients can correlate: `x-request-id`
5. Read `request.headers.get('x-request-id')` in route handlers

**Why not AsyncLocalStorage?**

There have been open issues with AsyncLocalStorage context not propagating correctly from middleware through to server components and route handlers in Next.js 15 + Edge runtime. The header-based approach is simpler and fully reliable since HTTP headers pass through the request lifecycle by definition.

**Why not middleware runtime = "nodejs"?**

Next.js 15.5 added Node.js runtime for middleware, but on OpenNext/Cloudflare this is not guaranteed to work — the Workers runtime is not Node.js. Stick to Edge runtime for middleware.

### OpenNext middleware support

OpenNext for Cloudflare runs `middleware.ts` in the Cloudflare Worker (Edge runtime). Standard Next.js middleware APIs work. The CVE-2025-29927 header injection vulnerability is patched in current Next.js — do NOT use `x-middleware-subrequest` as a correlation ID (it's an internal Next.js header).

---

## 5. Recommended Implementation

### `src/lib/logger.ts` — hand-rolled structured logger

```typescript
/**
 * Structured logger for Cloudflare Workers edge runtime.
 * Outputs plain console.log({...}) objects — Workers Logs auto-indexes JSON fields.
 * No external dependencies. Zero bundle impact beyond existing console calls.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogFields {
	requestId?: string;
	route?: string;
	method?: string;
	status?: number;
	durationMs?: number;
	ip?: string;
	[key: string]: unknown;
}

function log(level: LogLevel, message: string, fields?: LogFields): void {
	const entry = {
		level,
		message,
		ts: Date.now(),
		...fields,
	};

	// Workers Logs indexes object fields when passed directly (not JSON.stringify)
	// console.error also flags log level in wrangler tail output
	if (level === "error" || level === "warn") {
		console.error(entry);
	} else {
		console.log(entry);
	}
}

export const logger = {
	debug: (message: string, fields?: LogFields) => log("debug", message, fields),
	info: (message: string, fields?: LogFields) => log("info", message, fields),
	warn: (message: string, fields?: LogFields) => log("warn", message, fields),
	error: (message: string, fields?: LogFields) => log("error", message, fields),
};
```

### `src/middleware.ts` — request ID injection

```typescript
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
	const requestId = crypto.randomUUID();

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-request-id", requestId);

	const response = NextResponse.next({
		request: { headers: requestHeaders },
	});

	// Expose to client for browser-side correlation (optional)
	response.headers.set("x-request-id", requestId);

	return response;
}

export const config = {
	matcher: ["/api/:path*"],
};
```

### Updated route handler usage (example: `src/app/api/chat/route.ts`)

```typescript
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
	const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
	const start = Date.now();

	try {
		// ... existing code ...

		if (!env.AI) {
			logger.error("AI binding not configured", {
				requestId,
				route: "/api/chat",
				method: "POST",
			});
			return Response.json(/* ... */);
		}

		// ... on success ...
		logger.info("Chat request completed", {
			requestId,
			route: "/api/chat",
			method: "POST",
			status: 200,
			durationMs: Date.now() - start,
		});

		return Response.json(/* ... */);
	} catch (error) {
		logger.error("Chat API error", {
			requestId,
			route: "/api/chat",
			method: "POST",
			status: 500,
			durationMs: Date.now() - start,
			error: error instanceof Error ? error.message : String(error),
		});
		return Response.json({ error: "Failed to process chat request" }, { status: 500 });
	}
}
```

### Log format output (what Workers Logs receives)

```json
{
	"level": "error",
	"message": "Chat API error",
	"ts": 1739808000000,
	"requestId": "550e8400-e29b-41d4-a716-446655440000",
	"route": "/api/chat",
	"method": "POST",
	"status": 500,
	"durationMs": 42,
	"error": "TypeError: Cannot read properties of undefined"
}
```

Each field is individually indexed in Workers Logs and queryable in the dashboard.

---

## 6. What NOT to Do

| Approach                                    | Problem                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| `pino` full package                         | Fails in Workers runtime — transports use worker_threads                 |
| `pino/browser`                              | Works but adds ~9KB for zero benefit over console.log                    |
| `console.log(JSON.stringify({...}))`        | Stored as unstructured string blob, not individually indexed             |
| `console.log("key: " + value)`              | Unstructured, not queryable by field                                     |
| AsyncLocalStorage for requestId propagation | Unreliable across middleware → route handler boundary in Next.js 15 edge |
| `x-middleware-subrequest` header            | Internal Next.js header, CVE-2025-29927 related, never use externally    |

---

## Sources

- [Workers Logs — Cloudflare Docs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Real-time logs (wrangler tail) — Cloudflare Docs](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/)
- [Workers Logpush — Cloudflare Docs](https://developers.cloudflare.com/workers/observability/logs/logpush/)
- [Introducing Workers Observability — Cloudflare Blog](https://blog.cloudflare.com/introducing-workers-observability-logs-metrics-and-queries-all-in-one-place/)
- [Pino Transport not supported in Cloudflare Workers — workerd#3423](https://github.com/cloudflare/workerd/discussions/3423)
- [Using pino/browser for Cloudflare Workers — pinojs/pino#2035](https://github.com/pinojs/pino/issues/2035)
- [Web Crypto (randomUUID) — Cloudflare Docs](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)
- [Next.js 15 Middleware API reference](https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware)
- [Request-ID patterns in Next.js — vercel/next.js Discussion #39543](https://github.com/vercel/next.js/discussions/39543)
- [OpenNext Cloudflare — GitHub](https://github.com/opennextjs/opennextjs-cloudflare)
