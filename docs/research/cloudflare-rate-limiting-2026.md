# Cloudflare Rate Limiting — Next.js on Workers (2026-03-14)

**Status:** CURRENT
**Session:** Comprehensive rate limiting options for alexmayhew.dev (Next.js 15 + OpenNext + Cloudflare Workers)

---

## Codebase Reality Check

Before evaluating options, the actual state of the codebase:

- **`/api/chat`** — Rate-limited: 10 req/60s per IP, in-memory (`src/lib/rate-limit.ts`)
- **`/api/contact`** — Rate-limited: 5 req/3600s per IP, in-memory (Server Action `src/app/actions/contact.ts`)
- **`/api/vectorize/*`** — No rate limiting
- **`/api/geo`** — No rate limiting (read-only, returns Cloudflare headers, low risk)
- **Contact form** — Has Cloudflare Turnstile in production (strong bot gate)

The in-memory implementation (`src/lib/rate-limit.ts`) uses a module-level `Map` and `setInterval` for cleanup.

---

## 1. The `setInterval` Problem in Cloudflare Workers

### What Actually Happens

`setInterval` is available in Cloudflare Workers (it's part of the Web Standards API). However, it does **not** behave like Node.js or browser `setInterval`. The critical difference is the Workers execution model:

**Isolate lifetime is non-deterministic.** A Workers isolate:

- May be spun up fresh for each request (especially after periods of inactivity)
- May serve many requests if it stays warm
- Will be evicted when resource limits are hit on the host machine, when it exceeds memory limits (128 MB per isolate), or on redeploy

The Cloudflare docs state explicitly: _"Because there is no guarantee that any two user requests will be routed to the same or a different instance of your Worker, Cloudflare recommends you do not use or mutate global state."_

### What This Means for `setInterval` Specifically

```typescript
// src/lib/rate-limit.ts — current implementation
const rateLimitMap = new Map<string, RateLimitEntry>();
setInterval(cleanupRateLimits, 60000); // <-- THIS
```

**Three failure modes:**

1. **Cleanup never fires.** `setInterval` callbacks in Workers only fire if the Worker remains active. If the isolate is cold-started for a request, handles it, and goes idle, the interval callback may never execute before the isolate is evicted. The interval is registered but never called.

2. **Map state is per-isolate, not per-global.** Two concurrent requests may hit two different isolates. Each has its own `rateLimitMap`. A user who hits their limit on isolate A can immediately make another request that lands on isolate B with a fresh count. This is the fundamental bypass vector for in-memory rate limiting on Workers.

3. **Memory accumulation without cleanup.** If an isolate stays warm and handles high traffic, the `rateLimitMap` grows. The `MAX_ENTRIES = 10_000` cap with LRU eviction handles this correctly, but the `setInterval` cleanup is unreliable backup.

### Verdict on `setInterval` Pattern

**It is not "wrong" per se — it is simply ineffective at its stated purpose.** The interval may or may not fire. Cloudflare does not terminate Workers mid-request, and `setInterval` is syntactically valid. The issue is not a crash risk; it is that in-memory state across isolates cannot be relied upon for security guarantees. For a portfolio site at low traffic, this is acceptable (see section 6). At scale, it is not.

---

## 2. Cloudflare WAF Rate Limiting Rules

### What Is It

Cloudflare WAF rate limiting rules operate at the network edge, **before the Worker even starts**. They run in Cloudflare's Ruleset Engine, the same infrastructure that handles DDoS mitigation. State is maintained globally across all Cloudflare PoPs.

### Free Tier Availability (2025-2026)

**Free plan: 1 rate limiting rule.** This is the confirmed limit from Cloudflare community and documentation cross-references.

| Plan     | Rate Limiting Rules | Cost    |
| -------- | ------------------: | ------- |
| Free     |                   1 | $0/mo   |
| Pro      |                  10 | $20/mo  |
| Business |                  15 | $200/mo |

**Key constraint for Free plan:** Cannot configure a custom block duration. The rule will always perform throttling (the default action). "Block" action with custom duration requires Pro+.

### How to Configure (Dashboard)

Cloudflare Dashboard → Security → WAF → Rate Limiting Rules → Create Rule

```
# Rule for /api/contact (contact form — highest priority)
Name: Contact Form Rate Limit
If: URI Path contains /api/contact
  OR URI Path contains /api/chat      # Combine into 1 rule on Free plan
Characteristic: IP Address
Period: 60 seconds
Requests allowed: 20
Action: Block (or Managed Challenge)
```

**Note:** On Free plan you only get 1 rule, so combine `/api/contact` and `/api/chat` into a single rule using OR logic, or use a broader path match.

### How to Configure (API / Terraform)

Via the Rulesets API (the old Rate Limiting API was deprecated 2025-06-15):

```bash
# Create rule via API
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets/phases/http_ratelimit/entrypoint/rules" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "API rate limiting",
    "expression": "(http.request.uri.path contains \"/api/chat\") or (http.request.uri.path contains \"/api/contact\")",
    "action": "block",
    "ratelimit": {
      "characteristics": ["ip.src"],
      "period": 60,
      "requests_per_period": 20,
      "mitigation_timeout": 60
    }
  }'
```

**Valid period values:** 10, 60, 120, 300, 600, 3600 seconds.

### Advantages

- Zero latency impact on legitimate traffic (runs before Worker, no compute cost)
- Globally coordinated counters (all 300+ PoPs share state)
- No code changes needed
- Free plan covers the primary use case with 1 rule

### Limitations

- Free plan = 1 rule maximum
- Cannot express per-endpoint different limits in a single rule (e.g., 10 req/60s for chat vs 5 req/3600s for contact) without Pro
- No access to `CF-Connecting-IP` header tricks — purely network-layer IP matching
- Cannot rate limit based on request body content or custom headers

### Recommendation for This Project

**Implement immediately.** Configure 1 WAF rule covering both `/api/chat` and `/api/contact`. Use a conservative combined limit (e.g., 20 req/60s) since contact submissions are rare and chat is the primary API consumer. Turnstile on contact form provides independent protection for that endpoint.

---

## 3. Cloudflare Workers Rate Limiting Binding

### What Is It

As of September 19, 2025, the Workers Rate Limiting binding (`env.MY_RATE_LIMITER.limit()`) is **GA (Generally Available)**. This is a first-party Cloudflare product that runs inside the Worker but with counters backed by Cloudflare's distributed rate limiting infrastructure — not in-memory.

**Key property:** Counters are cached locally on the same machine the Worker runs on and updated asynchronously in the background. This means `limit()` has **near-zero latency** (no network hop) while still providing globally-informed rate limiting.

This is the correct production replacement for `src/lib/rate-limit.ts`.

### wrangler.jsonc Configuration

```jsonc
// Add to wrangler.jsonc
{
	"rate_limits": [
		{
			"binding": "RATE_LIMITER_CHAT",
			"namespace_id": "chat_api",
		},
		{
			"binding": "RATE_LIMITER_CONTACT",
			"namespace_id": "contact_form",
		},
	],
}
```

**Note:** Requires Wrangler CLI v4.36.0+. The namespace_id is a user-defined string that groups counters. Multiple Workers sharing the same namespace_id share the same counters.

### TypeScript Usage

```typescript
// In wrangler.jsonc: add rate_limits bindings
// In src/env.d.ts or cloudflare-env.ts: declare the binding types

interface CloudflareEnv {
	AI: Ai;
	ASSETS: Fetcher;
	RATE_LIMITER_CHAT: RateLimit;
	RATE_LIMITER_CONTACT: RateLimit;
	// ... other bindings
}

// In src/app/api/chat/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: Request) {
	const { env } = await getCloudflareContext();
	const clientIP = getClientIP(request.headers);

	// Near-zero latency — no network call, counter cached on local machine
	const { success } = await env.RATE_LIMITER_CHAT.limit({ key: clientIP });

	if (!success) {
		return Response.json({ error: "Too many requests" }, { status: 429 });
	}
	// ... rest of handler
}
```

### Limits Configuration

The limits (requests per period) are configured in the Cloudflare Dashboard (Workers → Rate Limiting) or via the API, not in code. The binding in code only calls `.limit({ key })` and gets back `{ success: boolean }`.

This separation means you can change rate limits without redeploying.

### Cost

Workers Rate Limiting is included in the **Workers Free plan** (100K requests/day free). There is no additional charge for using the rate limiting binding within the free tier.

### Latency

Per Cloudflare docs: _"You are not waiting on a network request when calling the `limit()` method."_ Counters are cached on the local machine and reconciled in the background. Measured overhead is sub-millisecond.

### Recommendation for This Project

This is the **correct long-term replacement** for `src/lib/rate-limit.ts`. It fixes all three failure modes of the current implementation:

- Globally coordinated (shared across isolates and PoPs)
- Near-zero latency overhead
- No `setInterval` or in-memory state management

However, it requires code changes to both `src/app/api/chat/route.ts` and `src/app/actions/contact.ts`, plus wrangler config additions.

---

## 4. Cloudflare KV for Rate Limiting

### Verdict: Do Not Use

KV is eventually consistent. Writes propagate to the global cache with up to 60 seconds of staleness. This is a documented, fundamental design constraint:

> _"KV achieves high performance by caching which makes reads eventually-consistent with writes, with changes potentially taking up to 60 seconds or more to be visible in other global network locations."_

For rate limiting, this means:

- Request 1 writes `count=1` for an IP
- Request 2 (from same IP, different PoP, same second) reads `count=0` (stale)
- Both requests succeed — the rate limit is bypassed

**A 60-second staleness window completely defeats rate limiting logic.**

Additionally, KV is not designed for high write-frequency to the same key. Updating a counter on every request is exactly the write pattern KV is optimized against.

### KV Cost (for reference)

- Free tier: 100K reads/day, 1K writes/day, 1K deletes/day, 1K lists/day
- At 100K req/month that is ~3,333 req/day — well within free tier

**But cost is irrelevant — consistency makes KV unsuitable for rate limiting regardless of traffic.**

---

## 5. Cloudflare Durable Objects for Rate Limiting

### What Is It

Durable Objects (DOs) provide strongly consistent, transactional state. A DO is a named singleton — all requests for a given key (e.g., an IP address) route to a single instance running in one location. That instance has a built-in SQLite database and in-memory state that persists as long as the DO is alive.

### When to Use

DO rate limiting is correct when you need:

- Exact, globally-coordinated counters (no false positives or bypasses)
- Complex rate limiting logic (sliding windows, token buckets, per-user tiers)
- State that spans multiple endpoints under one shared limit

### Latency

- Requests that hit the same DO instance as before: ~1-5ms overhead (in-memory, no I/O)
- Requests from a PoP far from where the DO lives: ~10-100ms added latency (round trip to DO location)
- DOs auto-migrate to be close to where they're most used, but this takes time

### Cost (2026)

Durable Objects require the **Workers Paid plan ($5/month minimum)**. DO pricing:

- $0.15 per million requests to DO
- $0.20 per GB-month storage (SQLite-backed DOs — billing enabled January 2026)
- The storage for rate limit counters is negligible (a few bytes per IP)

At 100K requests/month: ~$0.015 in DO request charges + $5/month Workers plan minimum.

### Recommendation for This Project

**Overkill.** Do not use DOs for rate limiting on a portfolio site at current traffic. The Workers Rate Limiting binding (section 3) provides near-equivalent guarantees at zero additional cost. DOs are warranted when:

- You need sliding window rate limiting (not fixed window)
- You are handling >10K requests/hour per endpoint
- You need to rate limit by API key or user ID with complex quota logic

---

## 6. Summary: What to Use and When

| Option                    | Consistency           | Latency           | Cost                       | Code Changes | Free Plan                |
| ------------------------- | --------------------- | ----------------- | -------------------------- | ------------ | ------------------------ |
| In-Memory (`setInterval`) | Per-isolate only      | 0ms               | Free                       | None         | Yes                      |
| WAF Rate Limiting Rules   | Global, exact         | 0ms (pre-Worker)  | Free (1 rule)              | None         | Yes                      |
| Workers RateLimit Binding | Global, near-exact    | ~0ms (async sync) | Free (within Workers free) | Yes          | Yes                      |
| KV                        | Eventually consistent | 5-50ms            | Free tier                  | Yes          | Yes — but **do not use** |
| Durable Objects           | Exact, transactional  | 1-100ms           | $5/mo + usage              | Yes          | No                       |

---

## 7. Recommended Strategy for alexmayhew.dev

### Tier 1: Immediate (no code changes) — WAF Rule

Configure 1 WAF rate limiting rule covering both sensitive API paths:

- **Path:** URI contains `/api/chat` OR `/api/contact`
- **Characteristic:** IP Address
- **Period:** 60 seconds
- **Limit:** 20 requests
- **Action:** Block

This runs before the Worker, has zero compute cost, and is globally coordinated. The Turnstile on the contact form provides independent, stronger protection for that endpoint specifically.

### Tier 2: Correct Architecture (code changes) — Workers RateLimit Binding

Replace `src/lib/rate-limit.ts` in-memory implementation with the Workers RateLimit binding:

1. Add `rate_limits` entries to `wrangler.jsonc`
2. Declare `RateLimit` types in the CloudflareEnv interface
3. Update `src/app/api/chat/route.ts` to use `env.RATE_LIMITER_CHAT.limit()`
4. Update `src/app/actions/contact.ts` to use `env.RATE_LIMITER_CONTACT.limit()`

This is the production-correct approach. The current `setInterval` cleanup is benign but unreliable. The in-memory `Map` is the real issue — it is per-isolate, not global.

### Tier 3: Skip

- **KV rate limiting** — fundamentally broken by eventual consistency
- **Durable Objects** — warranted only if traffic exceeds 10K req/hour or if complex quota logic is needed
- **Upstash Redis** — viable alternative to DO for exact counting, but adds an external dependency for a problem the Workers RateLimit binding already solves natively

### For `/api/vectorize/*` and `/api/geo`

- **`/api/geo`** — No rate limiting needed. It reads Cloudflare's own headers (no external API calls, no expensive compute). `Cache-Control: private, max-age=3600` already reduces repeat calls.
- **`/api/vectorize/*`** — Should have rate limiting. These routes hit Cloudflare Vectorize (paid service). A WAF rule or Workers RateLimit binding at 5 req/60s per IP is appropriate. If not behind auth, this is the highest priority to add.

---

## 8. Sources

- [Cloudflare WAF Rate Limiting Rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) — Official docs
- [Rate Limiting Best Practices](https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/) — Cloudflare docs
- [Workers Rate Limiting Binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) — Official docs
- [Rate Limiting in Workers is now GA](https://developers.cloudflare.com/changelog/post/2025-09-19-ratelimit-workers-ga/) — Changelog, Sep 19 2025
- [How Workers Works](https://developers.cloudflare.com/workers/reference/how-workers-works/) — Isolate model, global state warning
- [How KV Works](https://developers.cloudflare.com/kv/concepts/how-kv-works/) — Eventual consistency documented
- [Workers KV Limits](https://developers.cloudflare.com/kv/platform/limits/) — Free tier quotas
- [Durable Objects Pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/) — DO cost structure
- [Durable Objects Limits](https://developers.cloudflare.com/durable-objects/platform/limits/) — DO throughput limits
- [Workers Storage Options Comparison](https://developers.cloudflare.com/workers/platform/storage-options/) — When to use what
- [Rate Limiting AI APIs with Durable Objects](https://shivekkhurana.com/blog/global-rate-limiter-durable-objects/) — DO rate limiting pattern
- [Cloudflare Rate Limiting Guide (Dec 2025)](https://eastondev.com/blog/en/posts/dev/20251201-cloudflare-rate-limiting-guide/) — Free plan configuration walkthrough
- [Workers KV Performance Improvements (Aug 2025)](https://developers.cloudflare.com/changelog/2025-08-22-kv-performance-improvements/) — p95 latency -67%, architecture changes

---

## Related Research

- `docs/research/security-tooling-nextjs-cloudflare-2026.md` — Prior rate limiting overview (section 2), CSP, Unlighthouse
- `src/lib/rate-limit.ts` — Current in-memory implementation
- `src/app/actions/contact.ts` — Contact form rate limiting (Server Action)
- `src/app/api/chat/route.ts` — Chat API rate limiting
