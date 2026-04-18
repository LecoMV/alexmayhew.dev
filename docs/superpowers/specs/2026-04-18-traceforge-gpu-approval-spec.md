# TraceForge Batch 3 — GPU Owner-Approval Flow Spec

**Date:** 2026-04-18
**Status:** DRAFT v2 (addresses v1 reviewer findings: vectorize-guard scope, concurrent-request race, KV-consistency one-shot consume, hex-sig verify, 423→503, HMAC dual-use split, password-cache drift, rate-limit windowSec, Resend coalesce flush, Turnstile path, 30s Workers invocation budget)
**Scope:** alexmayhew.dev (Cloudflare Workers edge) + vectorizer repo (FastAPI origin) + Discord webhook + Resend email to alex@alexmayhew.dev
**Estimated effort:** 10-12 hours focused work across two repos (new routes, KV schema, HMAC signing, Turnstile gate, Discord + email fanout, rolling-session logic, React UI for the request-and-wait flow, test harness)
**Compatibility:** Cloudflare Workers runtime (`nodejs_compat`), Next.js 15 + React 19, Web Crypto API (no Node crypto), existing `RATE_LIMIT_KV` binding, existing `TURNSTILE_SECRET_KEY` binding, existing Resend integration at `src/app/actions/contact.ts`, Python 3.11+ on origin (no new Python deps).
**Depends on:** nothing (Batches 1 + 2 are independent); can ship first or last.

## Why

Alex owns the RTX 3080 running TraceForge's upscaler. Currently `/tools/traceforge` exposes `POST /gpu/enable` to the public internet, password-gated. If the password leaks — or the attacker simply brute-forces a weak password — the GPU is commandeered silently: no email, no Discord ping, no way for Alex to know the 320 W draw isn't his own work.

The handoff at `/home/deploy/projects/vectorizer/HANDOFF_2026-04-18.md` section 5 proposed a notification webhook as an afterthought on the existing password flow. In discussion, the requirement tightened: **Alex must approve each cold-start session** before the GPU wakes for a stranger. The password becomes a Worker-held secret used by the edge _after_ approval; the user never sees it and never types it. Approval carries the authentication.

Three research artifacts (committed already to `docs/research/`) resolved the architecture before this spec:

- `gpu-notification-architecture-2026-04-18.md` — unanimous: **Option C hybrid**. Origin stays dumb (password check + WoL + log + 200). Edge owns Turnstile + rate limit + fanout + approval-gate state. No notification secrets on the origin. Co-locates blast radius with Cloudflare account security.
- `gpu-enable-rate-limit-2026-04-18.md` — two-tier: **Tier A** Workers rate-limit via KV counter at 3/60s per IP; **Tier B** Cloudflare WAF rule at 30/600s globally (the free plan's 1 allowed rule, spent here). Discord coalesce 1/60s, Resend coalesce 1/300s.
- `gpu-session-window-2026-04-18.md` — **30-min rolling, global, visible countdown**. Collapses "approval window" and "GPU auto-sleep" into one timer. Matches existing behavior, zero new state machine.

## Scope

**In scope (10 atomic commits across two repos):**

- **E1 — KV schema & session state helpers** (edge, `src/lib/gpu-session.ts`).
- **E2 — `POST /api/gpu/request`** route: Turnstile verify + Tier-A rate limit + HMAC approve/deny tokens + Discord+Resend coalesced fanout + KV state transition to `pending`.
- **E3 — `GET /api/gpu/approve?token=...&action=approve|deny`** route: HMAC verify + transition to `warm` (approve) or `cold` (deny) + call origin `POST /gpu/enable` with the Worker-held password secret + return a simple "thanks" page.
- **E4 — `GET /api/gpu/status`** route: public, read-only, returns `{state, last_activity_at, expires_at, countdown_seconds}` for UI polling.
- **E5 — vectorize-proxy guard**: existing `/api/vectorize/**` routes reject with HTTP 423 "GPU session not warm" unless KV state is `warm`, and bump `last_activity_at` on each successful call (rolling reset).
- **E6 — Cloudflare WAF Tier-B rule** (terraform-less, `docs/gpu-waf-rule.md` documents the single WAF rule to create in dashboard — one-shot manual step).
- **E7 — Frontend UI** — replace password prompt with a "Request GPU session" button that polls `/api/gpu/status`. Visible countdown pill. Toast on approval.
- **O1 — Origin HMAC-auth path**: `POST /gpu/enable` gains an alternative auth mode — accepts `X-Edge-Signature: <hmac>` header over the request body, using a shared secret `EDGE_ORIGIN_HMAC` on the origin. Backwards-compatible with password auth (password still works for direct admin access).
- **O2 — Discord + Resend content**: email template `gpu-approval-request.tsx` (uses same React-Email pattern as contact notification), Discord embed JSON structure.

**Out of scope:**

- Multi-owner approval / queue (only one approver — Alex).
- SMS / push notifications (Discord + email is enough; research confirmed phone push is overkill without Twilio).
- Batched weekly-summary notifications (upgrade signal, not v1).
- Any change to Batches 1/2 features — they can ship before or after B3.

## Architecture

### E1 — KV schema

**Namespace:** existing `RATE_LIMIT_KV` (verified at `wrangler.jsonc:71-76`, binding id `10d29082bf1741fa9a23ccf331cfb3ef`). No new namespace; reuse the existing binding for session state, Tier-A rate-limit counters, and notification-coalesce timestamps.

**Keys (flat, short, TTL-managed):**

| Key                       | Value shape (JSON)                                                                                                                                                                       | TTL                                                                                                                                       | Purpose                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `gpu:session`             | `{ state: "cold" \| "pending" \| "warm" \| "denied", requestId: string, requestedAt: number, approvedAt?: number, lastActivityAt?: number, requesterIp: string, userAgentHash: string }` | Set `expirationTtl: 1900` on transition to `warm` (30 min + 10s cushion). `pending` TTL 600 (10 min — approval window). `denied` TTL 300. | Single source of truth for session state. One global session.         |
| `gpu:ratelimit:<ip>`      | `{ count: number, firstAt: number }`                                                                                                                                                     | `expirationTtl: 65`                                                                                                                       | Tier-A per-IP window.                                                 |
| `gpu:coalesce:discord`    | `{ lastAt: number }`                                                                                                                                                                     | 120                                                                                                                                       | Gate Discord fanout to 1/60s; carry pending count.                    |
| `gpu:coalesce:email`      | `{ lastAt: number, pendingCount: number }`                                                                                                                                               | 600                                                                                                                                       | Gate Resend fanout to 1/300s; batch within window.                    |
| `gpu:approve:<requestId>` | `{ token: string, expiresAt: number, consumed: boolean }`                                                                                                                                | `expirationTtl: 600`                                                                                                                      | HMAC token binding; one-shot. Single-use enforced by `consumed` flag. |

**State transitions:**

```
cold ──(valid request)──> pending ──(approve)──> warm ──(idle 30m)──> cold
  ^                        │                      │
  │                        ├──(deny)──> denied ─TTL──┘
  └────────────────────────┘ (expire 10m)
```

**Concurrency model — two races explicitly acknowledged and handled:**

1. **Request race (two users simultaneously hitting `POST /api/gpu/request` when state is `cold`).**
   Without coordination, both read `cold`, both write `pending` with their own `requestId`, last-write-wins on `gpu:session`. The "loser" gets Discord/email sent for a session that no longer matches `gpu:session.requestId` — Alex clicks their link and gets a 409 "superseded."

   **Mitigation (best-effort optimistic concurrency via KV metadata):** on `POST /api/gpu/request`, read `gpu:session`; if present with `state !== cold`, 409 immediately. If absent, attempt `kv.put(...)` with `metadata: {writerId: requestId}`. Immediately re-read (`kv.get("gpu:session")`) and inspect metadata. If `writerId !== requestId`, another writer won — abort: write `gpu:approve:<lost-requestId>` with `consumed: true` so neither approve URL can complete, log, and return **409 superseded** to the user with message "Another user requested approval moments before you. Please wait — if they get approved, the session will be warm for everyone."
   This is last-writer-wins with a read-after-write check; not linearizable, but collapses the confusing-two-pending-links case to a single pending link within ~100ms of the second request.

2. **Approve-URL replay via KV eventual-consistency (Discord/email preview bots + cross-PoP replay).**
   KV writes can take up to 60s to propagate globally. A bot at PoP-US GETs the same URL Alex's click at PoP-EU already consumed — both pass the local `consumed === false` check.

   **Mitigation (two layers):**
   - **Origin-side nonce:** extend O1 (origin HMAC auth) to include the `requestId` in the signed message. Origin tracks consumed `requestId`s in a short-TTL Redis `SETNX gpu:consumed:<requestId>` with 10-min expiry. If SETNX fails (key already exists), origin returns 409 Gone. This gives us strict one-shot semantics at the origin, which is the only place that can be linearizable.
   - **Edge behaviour on origin 409:** treat as success at the "consume" level but do not transition `gpu:session` further if it's already `warm`. Return HTML "Already approved; GPU is warm" to Alex instead of "already used."

   Net effect: the Discord preview bot, if it crawls the approve URL, gets as far as the edge's local consume check (which may still read `consumed === false` during the propagation window), the edge calls origin, origin rejects via SETNX, edge returns "already approved." No double-wake, no ambiguity. The eventual KV consistency is covered by the origin's Redis linearizability.

3. **No Durable Objects.** Adding a DO for `gpu:session` would give linearizable transitions at ~$0.20/M-requests + 5ms latency. At this volume (~50 enables/day projected) that's $0.000003/day — but the implementation and test surface doubles. Accept the current KV + origin-side-nonce design; DO is the documented upgrade path if abuse or UX patterns demand it.

### E2 — `POST /api/gpu/request` (user-facing)

**File:** `src/app/api/gpu/request/route.ts` (new).

**Request body (Zod):**

```ts
const RequestSchema = z.object({
	turnstileToken: z.string().min(10),
	// optional: user-provided note shown in the Discord embed ("I'm making a
	// monogram for my band, would take 5 min"). HTML-escaped, max 140 chars.
	note: z.string().max(140).optional(),
});
```

**Flow:**

1. Extract `clientIp` via `headers()` `cf-connecting-ip` (same helper as `contact.ts:83`).
2. Tier-A rate limit. Current `src/lib/rate-limit.ts:19-23` signature is `{kv, key, limit}` with a hardcoded `WINDOW_MS = 60_000` and **fail-open** behavior (line 50-52). Required modifications:
   - Add optional `windowSec?: number` (default 60) to `CheckRateLimitOptions`.
   - Add optional `failClosed?: boolean` (default `false` — preserves existing contact-form fail-open behavior). Call sites for `gpu:ratelimit:*` pass `failClosed: true`. A public GPU trigger must **fail closed** — KV unavailability must not bypass the limit.
   - Replace the hardcoded `WINDOW_MS` with `(windowSec ?? 60) * 1000` in the `Math.floor(Date.now() / ...)` bucket computation.
   - Call site: `checkRateLimit({ kv: RATE_LIMIT_KV, key: \`gpu:ratelimit:\${clientIp}\`, limit: 3, windowSec: 60, failClosed: true })`. 429 on exceed with `Retry-After: 60`.
3. Turnstile verify. **Use `verifyTurnstileToken` from `@/lib/turnstile`** directly — NOT `dependencies.verifyTurnstile` from `_contact-deps.ts` (that's a DI wrapper scoped to the contact action). 403 on invalid.
4. Read `gpu:session` from KV. Reject with 409 if `state === "warm"` ("already warm, just trace") or `state === "pending"` ("approval already requested, awaiting owner"). Allow if `cold` or `denied`.
5. Generate `requestId = crypto.randomUUID()`.
6. Generate HMAC token — full implementation intent in `src/lib/edge-hmac.ts`:

   ```ts
   // src/lib/edge-hmac.ts
   const enc = new TextEncoder();

   export async function importHmacKey(
   	secret: string,
   	usage: "sign" | "verify"
   ): Promise<CryptoKey> {
   	return crypto.subtle.importKey(
   		"raw",
   		enc.encode(secret),
   		{ name: "HMAC", hash: "SHA-256" },
   		false,
   		[usage]
   	);
   }

   export async function signApproveToken(
   	secret: string,
   	requestId: string,
   	expiresAt: number
   ): Promise<string> {
   	const payload = `approve:${requestId}:${expiresAt}`; // domain separator "approve:"
   	const key = await importHmacKey(secret, "sign");
   	const sigBytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
   	// Token carries payload + sig, both base64url-encoded and dot-joined:
   	return `${base64urlEncode(enc.encode(payload))}.${base64urlEncode(sigBytes)}`;
   }

   export async function verifyApproveToken(
   	secret: string,
   	token: string
   ): Promise<{ requestId: string; expiresAt: number } | null> {
   	const [payloadB64, sigB64] = token.split(".");
   	if (!payloadB64 || !sigB64) return null;
   	const payloadBytes = base64urlDecode(payloadB64);
   	const sigBytes = base64urlDecode(sigB64);
   	const key = await importHmacKey(secret, "verify");
   	// Pass the decoded signature as a BufferSource to subtle.verify:
   	const ok = await crypto.subtle.verify("HMAC", key, sigBytes, payloadBytes);
   	if (!ok) return null;
   	const payload = new TextDecoder().decode(payloadBytes);
   	const match = payload.match(/^approve:([0-9a-f-]{36}):(\d+)$/);
   	if (!match) return null;
   	return { requestId: match[1], expiresAt: Number(match[2]) };
   }

   // base64url helpers (no padding, URL-safe):
   export function base64urlEncode(bytes: Uint8Array): string {
   	let s = "";
   	for (const b of bytes) s += String.fromCharCode(b);
   	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
   }
   export function base64urlDecode(s: string): Uint8Array {
   	s = s.replace(/-/g, "+").replace(/_/g, "/");
   	while (s.length % 4) s += "=";
   	const bin = atob(s);
   	const out = new Uint8Array(bin.length);
   	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
   	return out;
   }
   ```

   Key points:
   - `crypto.subtle.verify` receives the signature as `Uint8Array` (BufferSource), NOT a hex string. Constant-time comparison is intrinsic to `subtle.verify`.
   - Importing the key with a single usage (`"sign"` OR `"verify"`) prevents accidental use in the opposite direction.
   - Payload includes the domain-separator `"approve:"`. A sibling `"edge-origin:"` prefix is used for the origin-HMAC path (O1) so a leaked `approve:` HMAC cannot impersonate an edge→origin call.
   - Token format `<payload-b64url>.<sig-b64url>` (JWT-like but explicit). The payload itself contains `requestId` and `expiresAt`, so the verifier doesn't need to split-and-parse separate URL params.

7. Write `gpu:approve:<requestId>` → `{token, expiresAt: Date.now()+10*60*1000, consumed: false}` with `expirationTtl: 600`.
8. Write `gpu:session` → `{state:"pending", requestId, requestedAt, requesterIp, userAgentHash, ...}` with `expirationTtl: 600`.
9. **Notification fanout** (via `waitUntil`, non-blocking on the user response):
   - Build approve URL: `${siteUrl}/api/gpu/approve?token=${token}&action=approve`
   - Build deny URL: `${siteUrl}/api/gpu/approve?token=${token}&action=deny`
   - **Sanitize user note** to prevent Discord Markdown-injection phishing (reviewer m2). Discord embed `description` is rendered as Markdown. A note like `[click](https://evil.com)` becomes a live link styled to look legitimate. Escape function: `note.replace(/[\[\]()]/g, "")` — strips the syntax chars that build Markdown links. Also truncate to 140 chars (already enforced by Zod).
   - **Discord:** read `gpu:coalesce:discord`. If `(now - lastAt) < 60_000`, read the existing pending count from KV (default 0), write `gpu:coalesce:discord → {lastAt: lastAt, pendingCount: pendingCount+1}` and SKIP the post. Otherwise POST to `env.DISCORD_OPS_WEBHOOK` (Worker secret, stored from `pass show claude/discord/gpu-ops-webhook`) with an embed:
     ```json
     {
     	"embeds": [
     		{
     			"title": "TraceForge GPU approval request",
     			"description": "Requester IP: `1.2.3.4` (.US)\nUA hash: `abc12345`\nNote: `the user note, Markdown-stripped`\nPending (coalesced): 0",
     			"color": 13434112,
     			"fields": [
     				{ "name": "Approve (10 min)", "value": "[Wake GPU](APPROVE_URL)", "inline": true },
     				{ "name": "Deny", "value": "[Ignore](DENY_URL)", "inline": true }
     			],
     			"footer": { "text": "Request ID: <requestId>" }
     		}
     	]
     }
     ```
     After successful POST: write `gpu:coalesce:discord → {lastAt: now, pendingCount: 0}`.
   - **Email (Resend) with reliable tail flush (reviewer M6):** coalesce primitive via **two-key pattern**:
     - `gpu:coalesce:email:last` → `{lastSentAt: number}` ttl 600.
     - `gpu:coalesce:email:pending` → `{count: number, firstPendingAt: number, lastRequestId: string}` ttl 900.

     Logic per request:
     1. Read `last`. If missing or `(now - lastSentAt) >= 300_000`: send now, write `last = {lastSentAt: now}`, delete `pending`.
     2. Otherwise: read `pending`, set `count += 1`, write back. **Schedule a delayed flush** via Cloudflare Workers Cron Trigger `flush-gpu-email-coalesce` that runs every 60 seconds — it reads `gpu:coalesce:email:pending`, and if `count > 0` AND `(now - firstPendingAt) >= 300_000`, sends one summary email ("N requests coalesced in the last 5 min, latest requestId: ...") and deletes the `pending` key.

     This guarantees the tail is always flushed within ~360s of the first pending arrival, so Alex never misses coalesced events.

   - **Cron Trigger** `wrangler.jsonc` addition: `"triggers": {"crons": ["*/1 * * * *"]}` with a corresponding `scheduled(event, env, ctx)` handler in `custom-worker.ts` that calls `flushCoalescedEmail(env)`. Light workload (one KV read, usually a no-op).

10. Return 202 to user with `{requestId, state:"pending", message:"Awaiting owner approval. This usually takes a few minutes."}`.

**Failure modes — all surfaced, none silent:**

- KV read failure on step 4 → 503 with "Session state unavailable, try again."
- Turnstile verify network failure → treat as 403 (fail closed).
- Discord webhook 4xx/5xx → log via Sentry, do NOT fail user request. Email is the primary channel; Discord is nice-to-have.
- Resend 4xx/5xx → log via Sentry. Retry once at 1s (reuse `withRetry` helper pattern from `contact.ts:20-58`). If still fails, log `error` level — user request still succeeds (the session is in `pending`, Alex can see it via the dashboard-style `/api/gpu/status` endpoint if ping failed).

### E3 — `GET /api/gpu/approve?token=...&action=approve|deny`

**File:** `src/app/api/gpu/approve/route.ts` (new).

**Flow:**

1. Parse `token` query param. Pass to `verifyApproveToken(env.GPU_APPROVAL_HMAC_SECRET, token)`. Returns `{requestId, expiresAt}` or `null`.
2. Reject (400, HTML "Invalid or tampered approval link") on `null`.
3. Reject (400, HTML "Approval link expired") if `Date.now() > expiresAt`.
4. Read `gpu:approve:<requestId>` from KV. Reject (400, HTML "Approval link already used — check your Discord/email for the latest request") if `consumed === true` or the key is missing (missing = expired TTL = stale).
5. Read `gpu:session`. Reject (409, HTML "This request is no longer pending; it was superseded or expired") if `state !== "pending"` or `session.requestId !== requestId`.
6. Validate `action ∈ {"approve", "deny"}`. Anything else → 400.
7. **If `action === "deny"`:**
   - Write `gpu:session` → `{state: "denied", requestId, ...}` with `expirationTtl: 300`.
   - Mark `gpu:approve:<requestId>.consumed = true`.
   - Return 200 HTML "Request denied. User will see a 'declined' message."
8. **If `action === "approve"`:**
   - Write `gpu:approve:<requestId>.consumed = true` **before** the origin call (edge-local guard).
   - Call origin `POST ${ORIGIN_BASE}/gpu/enable` with HMAC-auth headers (O1) — NO password in body. Body is a single JSON `{requestId}` so origin can track the nonce. Use `fetch(..., {signal: AbortSignal.timeout(25_000)})` — 25s ceiling keeps us inside Workers' 30s invocation budget.
   - **Origin Redis SETNX check on `requestId`** (see O1). Three possible responses:
     - **200 `{enabled: true, message: "..."}`** → write `gpu:session` → `{state:"warm", approvedAt: now, lastActivityAt: now, ...}` with `expirationTtl: 1900`. Return HTML "GPU warmed. User can now trace."
     - **409 `{detail: "requestId already consumed"}`** → race with a cross-PoP replay (Discord preview bot etc). If `gpu:session.state === "warm"` already (by whichever PoP landed first), return HTML "Already approved; GPU is warm." If not, something's inconsistent — log Sentry error, return HTML "State inconsistent; please check /api/gpu/status."
     - **Timeout / 5xx / 4xx other** → write `gpu:session` → `{state:"cold"}` with short TTL, return HTML "Origin failed: <detail>. Session reset. Please re-request."
   - Omit the "Disable GPU" button from the HTML. Auto-sleep is enough; a disable route is explicitly out-of-scope (Open Question #1). Do not build half-features into the approval-confirmation page.

**Rationale for one-shot consume:** prevents Discord link preview crawlers from silently approving (Discord expands link previews automatically — any idempotent GET with side effects would be triggered by that crawl). Common mitigation: the link encodes a requestId that becomes invalid on first use. Spec enforces consume-before-origin-call so even a double-click on the approve button only wakes the GPU once.

**Rationale for GET not POST:** Approval must be clickable from an email client or Discord, neither of which POSTs reliably. The one-shot consume + HMAC + expiry + previewer-cache mitigation suffices; CSRF is structurally impossible because the HMAC key is Worker-held and per-request.

### E4 — `GET /api/gpu/status` (user-facing polling)

**File:** `src/app/api/gpu/status/route.ts` (new).

Read `gpu:session` from KV. Return:

```json
{
  "state": "cold" | "pending" | "warm" | "denied",
  "requestedAt": 1713456789000,
  "approvedAt": 1713456810000,
  "lastActivityAt": 1713456900000,
  "expiresAt": 1713458700000,
  "countdownSeconds": 1793
}
```

Cache-Control: `no-store`. Rate-limit: `gpu:status-rl:<ip>` at 60/60s (polling is expected). No Turnstile (read-only).

### E5 — Vectorize-proxy guard (ALL five vectorize routes)

**Enumerated route files that must gain the warm-check (verified by `find src/app/api/vectorize -name '*.ts'`):**

- `src/app/api/vectorize/route.ts` (POST upload)
- `src/app/api/vectorize/generators/route.ts` (GET generators/presets)
- `src/app/api/vectorize/[taskId]/process/route.ts` (POST process — **starts GPU work**)
- `src/app/api/vectorize/[taskId]/status/route.ts` (GET status)
- `src/app/api/vectorize/[taskId]/download/[filename]/route.ts` (GET SVG)

**Not all five consume GPU equally.** The `process` route triggers Real-ESRGAN (the expensive GPU path). The upload/status/download/generators routes do not. Guard policy:

- **Hard-gate on `process`:** reject with 503 if not warm.
- **Soft-gate on `upload`:** allow upload when `state ∈ {warm, pending}` so users can prep inputs while their session is still being approved. Reject when `cold` or `denied`.
- **Read-through on `status` / `download` / `generators`:** no warm-check. Existing task IDs need to remain retrievable (so the UI can show the final SVG) even if the session has since expired.

**Shared wrapper:** add `src/lib/gpu-session-guard.ts` exporting `withGpuSessionGuard(options: {allow: GpuState[]}): (req) => Response | null`. Each route's handler calls the guard first; `null` = proceed, non-null Response = return early. Enumerated in Files Touched.

On successful 2xx from origin in `process` + `upload`: bump `lastActivityAt = now` on `gpu:session` (rolling reset) via `waitUntil`, extending KV TTL to `1800` from now. Skip the bump on 4xx/5xx (a failed call shouldn't extend the session).

**Status code: HTTP 503 Service Unavailable** with headers:

- `Retry-After: 600` (approval window is 10 min; if user waits and re-requests, they'll get a fresh cycle)
- `Content-Type: application/json`

Body:

```json
{
	"error": "gpu_session_not_warm",
	"state": "cold",
	"actionUrl": "/api/gpu/request",
	"message": "The GPU isn't warm. Request approval at the linked URL."
}
```

Rationale for 503 over 423: 423 Locked is WebDAV-specific and surprises generic HTTP clients, CDN caches, and monitoring tools. 503 correctly communicates "resource not currently available, try again" and has well-understood `Retry-After` semantics. The UI reads `actionUrl` to drive the user to the request flow.

Edge case: **concurrent vectorize requests** within a warm session. KV last-write-wins on `lastActivityAt` is fine — we want the latest activity timestamp; minor skew (±1s) is irrelevant for a 30-min window.

### E6 — Cloudflare WAF Tier-B rule (manual dashboard step, one-shot)

**Documentation path:** `docs/gpu-waf-rule.md` (new). Explains the exact WAF rate-limit-rule settings to create:

- **URI path:** `/api/gpu/request`
- **Characteristic:** IP address
- **Requests:** 30
- **Period:** 10 minutes (600s)
- **Mitigation timeout:** 10 minutes
- **Action:** Block

Also mention: this consumes the free plan's single allowed WAF rule. If a future endpoint needs Tier-B, we need to either (a) pay the plan upgrade or (b) consolidate. Priority slot is correct — `/api/gpu/request` is the single highest-abuse-risk endpoint.

### E7 — Frontend UI changes

**File:** `src/components/traceforge/gpu-control.tsx` (existing — replace).

Behavioral change: **remove password input entirely.** Replace with a single CTA button.

States:

- `cold`: button "Request GPU session" (primary, `text-cyber-lime`). Click → Turnstile challenge → POST `/api/gpu/request` with token + optional note.
- `pending`: button disabled, caption "Awaiting owner approval (usually <5 min)". Spinner.
- `warm`: no button; persistent pill "GPU warm · MM:SS remaining" driven by `countdownSeconds` from polled `/api/gpu/status`. Pill updates every 1s via `setInterval`.
- `denied`: gray caption "Owner declined. Try again in 5 minutes." Auto-transitions to `cold` when the `denied` TTL lapses.

Polling:

- `/api/gpu/status` every 5s while `state in {pending, warm}`. Back off to 30s after 30min warm (near-expiry). Stop polling when `cold` or `denied`.
- Use `useSystemStatus` hook pattern (existing at `src/components/traceforge/use-system-status.ts`) — extend or clone.

Toast on approval transition (`pending → warm`): "Owner approved — GPU is warming up. ~15s to ready."

**Turnstile widget:** embed inline under the button, managed mode. **Verified component:** `Turnstile` default export at `src/components/ui/turnstile.tsx:19` — uses `@marsidev/react-turnstile` with a `forwardRef` exposing `reset()` + `getResponse()`. Reuse this component directly. No new component needed.

**Removed code:** the entire password submit form (lines 27-63 of current `gpu-control.tsx`). Password never touches the browser again. Replace with the state-machine UI above.

### O1 — Origin HMAC auth (backward-compatible) + requestId nonce tracking

**File:** `app/api/server.py`.

Goal: allow edge to authenticate to `POST /gpu/enable` without sending the plaintext password over the proxy hop. Keep password auth as a fallback for manual admin access via SSH tunnel. Add per-request nonce tracking so cross-PoP replays (B3) cannot double-wake the GPU.

**Two independent secrets (NOT dual-use, per reviewer M2):**

- `GPU_APPROVAL_HMAC_SECRET` — Worker-only. Signs approve-link tokens.
- `EDGE_ORIGIN_HMAC` — shared between edge Worker secret AND origin `.env`. Authenticates edge→origin requests only.

Independent secrets mean an origin `.env` leak cannot be used to forge approve-link tokens, and an edge-secret leak cannot be used to impersonate the edge to the origin (still bad, but smaller blast radius). Both generated via `openssl rand -hex 32`. Cost of separation: one extra `wrangler secret put` + one extra `.env` line.

**Message format for edge→origin auth:**

```
header X-Edge-Timestamp: <unix-seconds>
header X-Edge-Signature: hex(HMAC-SHA256(secret, "edge-origin:" + method + ":" + path + ":" + timestamp + ":" + body))
```

The `"edge-origin:"` prefix is the domain-separation tag that prevents an attacker who steals an approve-link HMAC (`approve:` implicit) from using it to authenticate a fake edge-origin request.

**Origin verification + nonce tracking (add at top of `enable_gpu()` and `disable_gpu()`):**

```python
import hmac, hashlib, time, json
import redis as redis_lib  # already in requirements.txt via Celery

NONCE_KEY_PREFIX = "gpu:consumed:"
NONCE_TTL_SECONDS = 600  # matches edge approve-link TTL

def verify_edge_signature(request: Request, body_bytes: bytes) -> bool:
    ts_header = request.headers.get("X-Edge-Timestamp")
    sig_header = request.headers.get("X-Edge-Signature")
    secret = os.environ.get("EDGE_ORIGIN_HMAC", "")
    if not (ts_header and sig_header and secret):
        return False
    try:
        ts = int(ts_header)
    except ValueError:
        return False
    if abs(time.time() - ts) > 300:
        return False
    # Domain-separator "edge-origin:" matches the edge's signing format.
    message = f"edge-origin:{request.method}:{request.url.path}:{ts}:".encode() + body_bytes
    expected = hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig_header)

def try_consume_nonce(request_id: str) -> bool:
    """
    Atomic set-if-not-exists via Redis SETNX. Returns True if this caller
    claimed the nonce (proceed with GPU enable), False if already consumed
    (cross-PoP replay; reject with 409).
    """
    r = redis_lib.Redis.from_url(os.environ.get("REDIS_URL", "redis://localhost:6379/0"))
    # SET key value NX EX ttl — atomic; returns None if key exists.
    return r.set(f"{NONCE_KEY_PREFIX}{request_id}", "1", nx=True, ex=NONCE_TTL_SECONDS) is not None

@app.post("/gpu/enable", tags=["gpu"])
async def enable_gpu(request: Request):
    body_bytes = await request.body()
    if verify_edge_signature(request, body_bytes):
        # Edge-authenticated path: require a requestId nonce and consume it atomically.
        try:
            body = json.loads(body_bytes or b"{}")
        except json.JSONDecodeError:
            raise HTTPException(400, "Invalid JSON body on edge-authenticated call")
        request_id = body.get("requestId")
        if not request_id or not isinstance(request_id, str):
            raise HTTPException(400, "edge call requires body.requestId")
        if not try_consume_nonce(request_id):
            raise HTTPException(409, detail={"detail": "requestId already consumed"})
        # fall through to enable logic
    else:
        # Fall back to password auth (existing path — manual admin use only)
        try:
            data = GPUToggleRequest.model_validate_json(body_bytes)
        except Exception:
            raise HTTPException(400, "Invalid body")
        if not GPU_CONTROL_PASSWORD or data.password != GPU_CONTROL_PASSWORD:
            raise HTTPException(403, "Invalid password")
        # Audit log every password-path enable so post-deploy drift from cached
        # bookmarks is visible in journalctl (reviewer M3):
        logger.warning(
            "password-path /gpu/enable called — edge HMAC not used; check for stale client"
        )
    # ...existing enable logic (GPUControl.set_enabled, gpu_preload, etc.)...
```

**Backwards compatibility:** direct admin POST with `{password: "..."}` still works (drops through to the `else` branch). Edge calls send `{requestId: "..."}` + HMAC headers; no password anywhere in the edge call. **Password-path drift audit (M3):** the `logger.warning` on the fallback branch lets Alex grep `journalctl -u vectorizer-api | grep password-path` to see whether any cached-bookmark clients are still calling the old flow post-deploy; if yes, rotate `GPU_CONTROL_PASSWORD` after a 7-day observation window.

**Redis dependency:** Redis is already an origin dependency (Celery broker). Reusing the same client/connection pool is zero new surface.

### O2 — Notification content

**File:** `src/components/emails/gpu-approval-request.tsx` (new).

Copy structure from `src/components/emails/contact-notification.tsx` (existing). Subject: `[TRACEFORGE] GPU approval request from <ip>`. Body contains two big buttons (Approve / Deny), a requester IP block, a user-agent hash, an optional user note, and the request ID + expiration countdown. HTML-only; no text part (acceptable for a single-recipient ops email).

**Security note on HTML:** user-provided `note` field is HTML-escaped at the React-Email render layer automatically (React escapes by default). IP is a string; UA hash is hex. No field is interpolated raw.

## Data flow

```
USER                EDGE (CF Workers)                          ORIGIN (FastAPI)        DISCORD    RESEND   ALEX
  │                        │                                         │                     │          │        │
  │  POST /api/gpu/request │                                         │                     │          │        │
  │ ──────────────────────>│                                         │                     │          │        │
  │  + Turnstile token     │ verify Turnstile                        │                     │          │        │
  │                        │ Tier-A rate limit (KV)                  │                     │          │        │
  │                        │ KV: gpu:session → pending               │                     │          │        │
  │                        │ generate requestId + HMAC token         │                     │          │        │
  │                        │ waitUntil: Discord coalesce + post      │ ─────────────────> │          │        │
  │                        │ waitUntil: Resend coalesce + send       │                     │ ──────> │        │
  │ <──── 202 pending ─────│                                         │                     │          │        │
  │  poll /api/gpu/status  │                                         │                     │          │  👀
  │ ...........pending..... │                                         │                     │          │        │
  │                        │                  GET /api/gpu/approve?token=...&action=approve│          │        │
  │                        │ <──────────────────────────────────────────────────────────────────────  │ click  │
  │                        │ HMAC verify + consume key               │                     │          │        │
  │                        │ POST /gpu/enable (X-Edge-Signature)     │ ──────────────────> │          │        │
  │                        │                                         │ verify sig, WoL, preload model│        │
  │                        │ <─── 200 {enabled:true} ───             │                     │          │        │
  │                        │ KV: gpu:session → warm, expiry 1800s    │                     │          │        │
  │                        │ return 200 HTML "GPU warmed"            │                     │          │        │
  │ ...........warm...      │                                         │                     │          │        │
  │  POST /api/vectorize   │                                         │                     │          │        │
  │ ──────────────────────>│ check gpu:session.warm ✓                │                     │          │        │
  │                        │ proxy to origin                         │ ──────────────────> │          │        │
  │                        │                                         │ <── SVG ───         │          │        │
  │                        │ waitUntil: bump lastActivityAt          │                     │          │        │
  │ <─── SVG ───           │                                         │                     │          │        │
  │ ... (30 min idle) ...  │                                         │                     │          │        │
  │                        │ KV expires → gpu:session gone → cold    │                     │          │        │
```

## Error handling

| Condition                   | Response                                                                                  | Recovery                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Turnstile fail              | 403 JSON `{error:"Security check failed"}`                                                | User refreshes, retries                                     |
| Tier-A rate limit           | 429 `{error:"Too many requests", retryAfter: 60}`                                         | User waits                                                  |
| Tier-B rate limit (WAF)     | Cloudflare-served 429 page                                                                | Attacker blocked globally; real users unaffected at 30/600s |
| Invalid Turnstile token     | 403                                                                                       | Browser anomaly; user retries                               |
| KV read failure             | 503 `{error:"Session state unavailable"}`                                                 | Cloudflare incident; rare                                   |
| Already warm on request     | 409 `{error:"already warm", expiresAt}`                                                   | User just traces                                            |
| Already pending on request  | 409 `{error:"already pending", requestId}`                                                | User waits                                                  |
| Approve link HMAC fail      | 400 HTML "Invalid or tampered link"                                                       | Indicates tampering; silent in Sentry                       |
| Approve link expired        | 400 HTML "Expired (after 10 min)"                                                         | Requester re-requests                                       |
| Approve link consumed       | 400 HTML "Already used"                                                                   | Discord/email previewer mis-trigger mitigated               |
| Approve target superseded   | 409 HTML "Another request in flight or completed"                                         | Safe                                                        |
| Origin `/gpu/enable` 5xx    | 502 HTML "Origin failed", session reset to cold                                           | User re-requests                                            |
| Origin timeout > 60s        | 504 HTML "Origin slow, session reset"                                                     | User re-requests                                            |
| Edge HMAC timestamp skew    | Origin 403                                                                                | Clock-skew alert; fallback to password if stuck             |
| Vectorize request when cold | 503 + `Retry-After: 600` + `{error:"gpu_session_not_warm", actionUrl:"/api/gpu/request"}` | UI prompts approval flow                                    |

## Security

- **Two independent 32-byte HMAC secrets, both generated via `openssl rand -hex 32`:**
  - `GPU_APPROVAL_HMAC_SECRET` — stored ONLY as a Cloudflare Worker secret (`wrangler secret put`). Signs approve-link tokens. Origin never sees it; leak blast-radius is bounded to approve-link forgery only.
  - `EDGE_ORIGIN_HMAC` — stored BOTH as a Cloudflare Worker secret AND on the origin `.env`. Authenticates edge→origin calls. Domain-separator `"edge-origin:"` in signed message keeps this secret usable only for that purpose.
    These are distinct random values — the domain-separator prefixes are defense-in-depth, not a substitute for key separation.
- **Rotation:** once per 90 days, or on any suspected leak. Rotation procedure: new value in `pass show claude/cloudflare/gpu-hmac`; `wrangler secret put` then SSH origin and update `.env` then `systemctl restart vectorizer-*`. 0 downtime if sequenced correctly (all in-flight approve links valid for up to 10 min — let them drain first).
- **Turnstile:** reuse existing `TURNSTILE_SECRET_KEY` binding. Sitekey already public in `src/components/contact/`. Add to the GPU-request widget.
- **Constant-time comparison:** Use `crypto.subtle.verify` on the edge; `hmac.compare_digest` on origin. No `string ==` on secrets.
- **Replay window (O1):** ±300s on timestamp prevents stale-capture replay; single-use `gpu:approve:<requestId>` prevents approve-link replay.
- **CSRF:** structurally impossible — approve URLs carry unguessable HMAC keys; an attacker who can get Alex to click a crafted URL can only click a URL they already know about (same as the one they'd forge), which is the request Alex is already approving. The real threat is **Alex's email being phished** (a fake approve link from an attacker); mitigated by the HMAC — only real links validate.
- **Secrets inventory** (audit with `wrangler secret list`):
  - `TURNSTILE_SECRET_KEY` (existing)
  - `RESEND_API_KEY` (existing)
  - `GPU_APPROVAL_HMAC_SECRET` (new, Worker-only, 32 bytes)
  - `EDGE_ORIGIN_HMAC` (new, shared edge Worker + origin `.env`, 32 bytes — distinct from `GPU_APPROVAL_HMAC_SECRET`)
  - `DISCORD_OPS_WEBHOOK` (new, stored in `pass show claude/discord/gpu-ops-webhook`, written to Worker via `wrangler secret put` at implementation time) — webhook URL is a long-lived bearer credential. **Rotation:** regenerate via Discord channel settings → delete old webhook → create new → pipe into `wrangler secret put` → pass-store update. Do this on any member departure from the ops channel, or on any Sentry event indicating leakage.
  - `GPU_CONTROL_PASSWORD` (Worker-side **retained** for emergency-admin fallback; existing origin-side). Post-deploy: audit origin journalctl for `password-path /gpu/enable called` warnings over 7 days; if any present, rotate `GPU_CONTROL_PASSWORD` to invalidate cached client bookmarks.
- **Origin hardening (carried in Batch 4 spec):** chmod 0600 .env, logrotate, pip-compile --hashes. Not in this batch.

## Observability

- Every route logs structured JSON via `logger.info`/`logger.error` with `route`, `requestId`, `state`, `clientIp` (truncated for PII), `outcome`.
- Sentry events on: Turnstile network failure, Discord webhook 5xx, Resend non-retryable, origin 5xx from approve flow.
- `/api/gpu/status` is the observability endpoint — Alex can hit it in a browser to see current state for manual debugging.
- KV keys are short-lived; no long-term PII retention.
- Discord embeds carry the first 8 hex chars of a SHA-256 hash of the user agent, not the UA itself (enough to correlate duplicate abusers, insufficient for fingerprinting).

## Testing

### Unit tests (alexmayhew.dev)

- `tests/api/gpu/request.test.ts`:
  - Turnstile fail → 403.
  - Rate limit exceeded → 429 with `Retry-After`.
  - Already warm → 409.
  - Already pending → 409.
  - Happy path → 202, KV writes verified (mock KV), Discord + Resend `waitUntil` called.
  - Discord coalesce: two requests within 60s → only one Discord post, both succeed.
  - Resend coalesce: second request within 300s → `pendingCount=1`, no send.
- `tests/api/gpu/approve.test.ts`:
  - Invalid HMAC → 400.
  - Expired token → 400.
  - Consumed token → 400.
  - Session not pending → 409.
  - Action=approve happy path: origin mock returns 200, KV transitions to warm with ttl 1900, HTML response.
  - Action=deny → KV transitions to denied, HTML response.
  - Origin 5xx on approve → session resets to cold, HTML error.
  - Linker preview crawl (simulated double-GET within 100ms): only first sets warm; second returns "already used."
- `tests/api/gpu/status.test.ts`: returns correct state + countdown; handles missing session key (→ cold).
- `tests/lib/gpu-session.test.ts`: KV helpers (put/get/expiry), state-machine transition validation.
- `tests/lib/edge-hmac.test.ts`: sign + verify round-trip, domain separation (approve tag vs edge-origin tag), constant-time comparison behavior.
- `tests/api/vectorize-guard.test.ts`: 423 when cold, proxied when warm, `lastActivityAt` bumped on success.

### Unit tests (vectorizer)

- `tests/api/test_edge_hmac_auth.py`:
  - Valid `X-Edge-Signature` header → 200.
  - Missing signature → falls back to password path.
  - Invalid signature → 403.
  - Timestamp > 300s old → 403 (replay protection).
  - Password still works for backward-compat admin auth.

### Integration tests (cross-repo, optional)

A stand-alone Playwright flow in `e2e/gpu-approval.spec.ts` that:

1. Requests a session → asserts pending state.
2. Extracts approve URL from a local mock Discord webhook receiver.
3. Hits approve URL → asserts warm state (origin mocked to return 200).
4. Sends a vectorize request → asserts 2xx and `lastActivityAt` bumped.
5. Fast-forwards KV TTL (via a test-only endpoint that writes synthetic TTL) → asserts session expires, next vectorize 423.

## Rollback

- **E1-E5 are additive routes** — rolling back the frontend to the old password form while leaving the new routes alive is safe. New routes respond only to the new UI.
- **E7 frontend revert:** restore `src/components/traceforge/gpu-control.tsx` from git. Old password flow still hits `POST ${apiUrl}/gpu/enable` directly; origin's fallback-password path handles it.
- **O1 origin HMAC:** purely additive (the `else` branch preserves the existing password path). Revert = `git revert` of the `verify_edge_signature` block.
- **KV cleanup on revert:** optional — set all `gpu:*` keys to expire short (script `scripts/gpu-kv-flush.ts`). Not strictly needed; existing TTLs drain within 30 min.
- **WAF rule revert:** dashboard toggle; no code revert needed.

## Open questions

1. **Should the "Disable GPU" button on the approval page hit origin `/gpu/disable`?** Probably yes for parity, but that's another edge route + HMAC path. Defer to a follow-up; auto-sleep covers the common case.
2. **Should `deny` TTL block same-IP re-requests for 300s?** Currently denied only prevents OTHER users from requesting (since `state !== cold`). Could tighten: on deny, also add an IP-specific block (`gpu:ip-block:<ip>` for 5 min). YAGNI this batch; add if abuse pattern emerges.
3. **Should `gpu:session` support a manual override key for Alex to force-warm without the flow?** Useful for local testing — but that's what `pass show claude/vectorizer/gpu-control-password` + direct `curl` to origin already gives Alex. Don't add an override; the fallback path is enough.
4. **Should notifications mention the user's geolocation (Cloudflare `cf.country`)?** Probably useful for Alex's context ("approval request from .DE — probably fine, from .RU — let me look"). Free from CF request headers. Add to Discord embed + email body. Proposed default: include unless `cf.country === undefined`.

## Acceptance criteria

- [ ] `POST /api/gpu/request` with valid Turnstile and cold session → 202, state=pending, Discord + email fired
- [ ] Coalesce: 10 rapid requests within 60s → 1 Discord message, 1 email (second+ coalesced into pending count)
- [ ] Rate limit Tier-A: 4th request from same IP within 60s → 429
- [ ] Tier-B WAF rule confirmed live in CF dashboard at `/api/gpu/request` with 30/600 limit
- [ ] Approve link: HMAC verified, one-shot (double-click → "already used"), origin called, KV warm
- [ ] Deny link: KV transitions to denied, 5-min cooldown
- [ ] Vectorize while cold → 423 with state message
- [ ] Vectorize while warm → proxied, lastActivityAt bumped, TTL extended
- [ ] 30-min idle → KV expires → next vectorize → 423
- [ ] Frontend: countdown pill shows live remaining; toast on approval
- [ ] Origin HMAC: edge request with valid signature → 200; password fallback still works for direct admin
- [ ] All unit tests pass; build green on both repos
- [ ] Health check unaffected

## Files touched (exhaustive)

### alexmayhew.dev

**New files:**

- `src/lib/gpu-session.ts` — KV helpers, state-machine types, TTL constants, optimistic-concurrency writer-id check.
- `src/lib/gpu-session-guard.ts` — `withGpuSessionGuard({allow})` wrapper used by all vectorize routes (E5).
- `src/lib/edge-hmac.ts` — Web Crypto HMAC sign/verify with explicit BufferSource signature handling, base64url encode/decode, two domain-separator prefixes (`"approve:"` and `"edge-origin:"`).
- `src/lib/coalesce.ts` — shared coalesce primitive for Discord + Resend (two-key pattern supporting tail flush).
- `src/app/api/gpu/request/route.ts` — POST handler (E2).
- `src/app/api/gpu/approve/route.ts` — GET handler (E3).
- `src/app/api/gpu/status/route.ts` — GET handler (E4).
- `src/components/emails/gpu-approval-request.tsx` — React-Email template (O2).
- `src/components/traceforge/gpu-session-pill.tsx` — countdown pill component.
- `docs/gpu-waf-rule.md` — WAF rule setup instructions (E6).
- `tests/api/gpu/request.test.ts`, `tests/api/gpu/approve.test.ts`, `tests/api/gpu/status.test.ts` — route tests.
- `tests/api/vectorize-guard.test.ts` — covers all 5 vectorize route files (E5).
- `tests/lib/gpu-session.test.ts`, `tests/lib/edge-hmac.test.ts`, `tests/lib/coalesce.test.ts` — lib tests.

**Modified files:**

- `src/components/traceforge/gpu-control.tsx` — **replace** password form with state-machine UI (E7).
- `src/app/api/vectorize/route.ts` — add warm-check via `withGpuSessionGuard({allow:["warm","pending"]})` (upload allowed during pending).
- `src/app/api/vectorize/generators/route.ts` — no guard (public read).
- `src/app/api/vectorize/[taskId]/process/route.ts` — add warm-check via `withGpuSessionGuard({allow:["warm"]})` + `lastActivityAt` bump on 2xx (E5, hard-gate — the actual GPU consumer).
- `src/app/api/vectorize/[taskId]/status/route.ts` — no guard (existing task ID still retrievable after session expires).
- `src/app/api/vectorize/[taskId]/download/[filename]/route.ts` — no guard (same rationale).
- `src/lib/rate-limit.ts` — add `windowSec?: number` + `failClosed?: boolean` options; replace `WINDOW_MS` constant with dynamic window (E2 dependency).
- `custom-worker.ts` — add `scheduled(event, env, ctx)` handler calling `flushCoalescedEmail(env)` for the cron trigger (M6 fix).
- `wrangler.jsonc` — add `"triggers": {"crons": ["*/1 * * * *"]}`. No binding change for KV. Document new secrets in comment block: `GPU_APPROVAL_HMAC_SECRET`, `EDGE_ORIGIN_HMAC`, `DISCORD_OPS_WEBHOOK`, and a retained `GPU_CONTROL_PASSWORD` for the admin-fallback path.
- `next.config.mjs` — no change expected.

### vectorizer

**Modified files:**

- `app/api/server.py` — `verify_edge_signature()` helper + HMAC-first auth in `enable_gpu` + `disable_gpu` (O1); unchanged Celery task dispatch.
- `.env.example` — add `EDGE_ORIGIN_HMAC=<32-byte-hex>`.
- `tests/api/test_edge_hmac_auth.py` — **NEW** covering the 5 cases listed above.

## Sequencing

Each commit is atomic and ships independently. Sequencing minimizes risk: helpers first, then routes, then UI, then origin, then WAF rule.

1. **Commit A (alexmayhew.dev):** `src/lib/edge-hmac.ts` + `src/lib/gpu-session.ts` + unit tests. Pure library code, no route impact. Land and verify.
2. **Commit B (alexmayhew.dev):** `/api/gpu/status` route + test. Read-only observability endpoint; shipping this first means the rest of the dev loop can eyeball state.
3. **Commit C (alexmayhew.dev):** `/api/gpu/request` route + test + Resend email template. Discord webhook env not required yet — template renders, Resend send guarded on env.
4. **Commit D (alexmayhew.dev):** `/api/gpu/approve` route + test. Origin call mocked in tests; actual origin call requires O1 shipped first OR fallback to password — so this commit includes the password fallback as the primary origin auth (keeps things shippable).
5. **Commit E (vectorizer):** O1 — HMAC-verify function + fallback path. Backward-compatible. Land, restart `vectorizer-api`.
6. **Commit F (alexmayhew.dev):** flip `/api/gpu/approve` origin auth from password to HMAC. Verify end-to-end with a manual curl.
7. **Commit G (alexmayhew.dev):** vectorize proxy guard (E5) + test. Now users will see 423 when cold.
8. **Commit H (alexmayhew.dev):** frontend UI (E7) — new button, polling, countdown pill.
9. **Commit I (alexmayhew.dev):** docs + WAF rule creation in CF dashboard (E6, manual).
10. **Commit J (alexmayhew.dev):** add Discord webhook env wiring + test with a real webhook URL staged into a dev channel first.

Each step ships to production independently. A partial deploy leaves the system in a known state (e.g., after C but before D, the user can request but Alex can't approve — visible immediately via `/api/gpu/status`).
