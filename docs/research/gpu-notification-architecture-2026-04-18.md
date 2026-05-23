# GPU Enable Endpoint — Notification Architecture (2026-04-18)

**Status:** CURRENT
**Session:** Decide where notification fanout (Discord + Resend) and Turnstile live for `/tools/traceforge` GPU wake flow.
**Sources:** 6 sources + 2 prior research docs.

## Research Analyst

### Decision: Option C (Hybrid) — origin is state authority, edge owns user flow + ALL notifications.

**A is wrong** because it puts Resend + Discord creds behind a home-IP FastAPI on a single-user consumer ISP. Blast radius of a compromised FastAPI process = leaked Resend key (site-wide email abuse) + leaked Discord webhook (owner impersonation). Origin is the highest-risk surface in this system; putting fanout creds there inverts correct secret placement [1][2].

**B is close but wrong** because "edge sees origin response, infers success" creates a notification source-of-truth that can silently drift from actual GPU state (origin restart mid-request, origin succeeds but edge timeout retries). For an event-driven notification ("GPU just woke"), the edge doesn't own the event — it owns the _request_.

**C is correct:**

- Origin (`POST /gpu/enable`) stays small: password check, WoL, structured log, return 200. No Resend, no Discord, no creds beyond what it already has. If FastAPI is owned, attacker gets GPU wake — not your Resend account.
- Edge (`/api/gpu-enable` Worker route) owns: Turnstile verify, rate limiting, proxy to origin, read `{success, wokeAt}` response, fan out Discord + Resend, return to user.
- "Two sources of truth" concern dissolves: origin logs = authoritative state record; edge notifications = owner-awareness channel. They serve different purposes.

Cloudflare's own guidance on Smart Placement / edge-origin split confirms this pattern — keep heavy fanout at the edge, keep authoritative state at origin [3]. Webhook-security best practices explicitly call out limiting blast radius by isolating secrets at the layer that owns the outbound call [1].

### Turnstile: edge, before the proxy.

Verify on the Worker, reject with 403 before any origin hit. This matches the established contact-form pattern (`src/app/actions/contact.ts`) and keeps the origin uncontaminated with Turnstile secret keys [4]. Reuse the same `TURNSTILE_SECRET_KEY` Worker binding — no new secrets, ~20 LoC. Origin never sees a Turnstile token, which is correct: Turnstile is a web-bot-gate, not a machine-auth token.

### Rate limit split: confirmed — both, per prior research.

Per `docs/research/gpu-enable-rate-limit-2026-04-18.md` and `docs/research/cloudflare-rate-limiting-2026.md`:

- **Tier A — Workers rate-limit binding** (per-IP, 3/60s, key = `CF-Connecting-IP`). Runs in the Worker. Near-zero latency, per-location counters [5].
- **Tier B — Cloudflare WAF rate-limiting rule** (global, 30/600s, path = `/api/gpu-enable`). Runs pre-Worker, globally coordinated across all PoPs — this is the answer to the Workers-binding per-location caveat [5][6]. Spend the Free-plan's 1 allowed WAF rule here; it's the highest-value slot on the site.

Also coalesce _notifications_ separately from the API call: 1 Discord msg per 60s, 1 email per 300s (Resend is paid-per-send). Notification coalescing state lives in edge KV — safe because coalescing is best-effort, eventual consistency is fine, and cost is zero.

### Discord webhook secret: Cloudflare Workers secret.

Same layer as Resend key and Turnstile secret. Three reasons: (1) co-locates all outbound-notification creds at the layer that makes the outbound call — audit = one `wrangler secret list`; (2) origin doesn't need it, so don't give it to origin (least-privilege [1]); (3) rotation path already exists via `pass show claude/cloudflare/*` + `wrangler secret put` — no new ops surface. Origin keeps only its own password-hash + GPU-control creds.

## Sources

1. [Kusari — Webhook Security Best Practices](https://www.kusari.dev/learning-center/webhook-security) — blast-radius isolation via layer-specific secrets, rotation cadence.
2. [Hookdeck — Webhooks Glossary](https://hookdeck.com/webhooks/guides/webhooks-glossary) — outbound notification architecture terminology, fan-out patterns.
3. [DigitalApplied — Cloudflare Workers Dev Guide 2026](https://www.digitalapplied.com/blog/edge-computing-cloudflare-workers-development-guide-2026) — edge-origin split, Smart Placement, secrets at Worker layer.
4. [Cloudflare Turnstile — Get Started](https://developers.cloudflare.com/turnstile/get-started/) — server-side siteverify at edge, secret key boundary.
5. [Cloudflare Workers Rate Limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) — per-location counter caveat.
6. [Cloudflare WAF Rate Limiting Rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) — globally coordinated counters, 1 rule on Free plan.

## Related research

- `docs/research/gpu-enable-rate-limit-2026-04-18.md` — rate-limit numbers and coalescing policy.
- `docs/research/cloudflare-rate-limiting-2026.md` — Workers binding vs WAF vs DO vs KV decision matrix.

## Security Auditor

Concurs with Research Analyst's Option C. Blast-radius analysis below, severity OWASP-aligned.

### Threat-by-threat comparison

| Threat                                                                                                      | Edge (Workers secret)                                                                                                                                                                                      | Origin (`.env` on disk)                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Disk exfil via RCE** (Potrace CVE, Celery deserialization, transitive dep RCE)                            | Not reachable. Workers has no filesystem; secrets live only in isolate memory, bound at request start. Compromise requires Cloudflare account takeover (2FA + hardware key on `alexmayhewnmbp@gmail.com`). | Directly reachable. `cat /home/deploy/projects/vectorizer/.env` — one syscall from any code-exec on FastAPI or Celery. Confirmed `.env` present (`-rw-rw-r-- deploy deploy`, world-readable on default umask).                                           |
| **Log leakage**                                                                                             | Workers stdout does not auto-include env; no persistent disk. `wrangler tail` redacts known secret bindings.                                                                                               | `api.log` exists in project root (`-rw-rw-r-- deploy deploy`). One stray `logger.exception(os.environ)` or FastAPI debug middleware writes secrets to disk. Historical rotations may survive the leak window.                                            |
| **Supply-chain**                                                                                            | Small JS surface: Next bundle + Sentry Cloudflare SDK + Resend SDK. `package-lock.json` hash-pinned; Wrangler enforces bundle integrity at deploy.                                                         | Broad Python transitive graph: FastAPI, Celery, Redis, vtracer, numpy, Pillow, torch, Potrace bindings. One malicious release with `open('.env').read()` exfils both secrets on next systemd restart. Vectorizer has no lockfile hash enforcement in CI. |
| **Credential rotation** (NIST SP 800-57 Pt 1 Rev 5 §5.3.6 — short cryptoperiod for high-use symmetric keys) | `wrangler secret put RESEND_API_KEY` → atomic, audited in CF dashboard, zero-downtime, versioned. ~30s.                                                                                                    | SSH in → edit `.env` → `systemctl restart vectorizer-*` → verify Celery/Redis reconnect → verify queue drained. Manual, no audit trail. Rotation friction means rotations don't happen.                                                                  |
| **Observability split**                                                                                     | Edge owns notification audit trail via Workers Logs + Sentry (already wired).                                                                                                                              | Origin holds authoritative state but adds a second audit surface. Acceptable tradeoff — origin logs state transitions, edge logs user-facing notifications; these serve different questions.                                                             |

### Cloudflare Workers secret model (citation for recommendation)

Secrets are encrypted at rest, decrypted into isolate memory only during request execution, never written to logs, and scoped per-environment. Reference: Cloudflare Workers docs — "Secrets are only made available to Workers at runtime" (developers.cloudflare.com/workers/configuration/secrets). Contrast with origin `.env`: plaintext on disk, readable by any process running as `deploy`, persists across restarts, no access audit.

### Specific recommendations

1. **Resend API key → Cloudflare Workers secret.** `wrangler secret put RESEND_API_KEY` (reuse the existing binding from `src/app/actions/contact.ts`). **HIGH** if placed on origin: a popped vectorizer can send mail as `alexmayhew.dev` with valid SPF/DKIM alignment → phishing + domain reputation damage.
2. **Discord webhook URL → Cloudflare Workers secret.** `wrangler secret put DISCORD_OPS_WEBHOOK`. Webhook URLs are bearer credentials. **MEDIUM** if placed on origin: attacker gains ability to post to ops channel as the bot (phishing/noise vector, not external reach).
3. **Origin → Edge event delivery:** origin `POST /gpu/enable` returns `{success, wokeAt}`; edge Worker (`/api/gpu-enable`) fans out to Resend + Discord using edge-resident secrets. No secret ever traverses the origin. Matches Research Analyst's Option C.
4. **Origin-to-edge auth:** if a reverse flow is ever needed (origin pushes state to edge), use a short-lived HMAC shared secret scoped to `POST /api/gpu/wake-complete` only. **LOW** blast radius — compromise only grants the ability to trigger your own notifier, no external capability.
5. **Origin hardening regardless:** chmod `.env` to `0600` (currently `0664`), rotate `api.log` via logrotate with mode `0640 deploy adm`, audit FastAPI exception handlers for `os.environ` or request-body dumps, pin `requirements.txt` with hashes (`pip-compile --generate-hashes`).
6. **Rotation cadence (NIST 800-57):** Resend key every 90 days, Discord webhook on any member change to the ops channel, any HMAC shared secret every 30 days.

### Final answer

Both Resend API key and Discord webhook URL belong on the Cloudflare Workers edge. The origin's job is to wake the GPU and return a success event; it should carry zero outbound-notification credentials. This collapses the RCE/supply-chain/log-leak attack surface for both secrets from "home server + full Python dep graph" to "Cloudflare account takeover only" — a dramatically smaller blast radius with an easier rotation story.

## DevOps Engineer

### Decision: C (Hybrid) — origin logs the event, edge owns all outbound notifications.

Reinforces prior sections from an operational-surface angle. Six points, decisive on velocity.

**1. Failure-mode count (edge wins).** Worker path: missing secret, Resend 4xx misclassified, unhandled `waitUntil` rejection = **3 modes, all visible in Workers Logs**. Celery path: worker SIGKILL mid-task, Redis eviction, `acks_late` duplicate delivery, systemd restart race, log-file rotation before tail = **5 modes, split across journalctl + Redis + task logs**. At 0-50 events/day, Celery's durability protection (the main reason it exists) buys nothing, but its duplicate-delivery surface is real.

**2. Retry semantics (edge cleaner).** Edge gets `waitUntil(withRetry())` using the existing helper (`src/app/actions/contact.ts:20-58`) — bounded at-least-once, no duplicate source. Celery `acks_late=True` + `max_retries` on a worker crash re-runs the task → duplicate Discord post with no idempotency key on the receiver side. For a low-volume event-driven notifier, at-least-once-with-duplicates is worse UX than at-least-once-from-a-stateless-Worker.

**3. Test seam (edge cheaper).** Edge already has a dependency-injected Resend client (`src/lib/_contact-deps.ts`) and a passing contact-form test suite to clone — ~30 min to a green test. Origin would need new Resend + Discord mocks, `CELERY_TASK_ALWAYS_EAGER` plumbing the current suite doesn't exercise, and a second test runtime in CI — half-day minimum.

**4. Debug path (edge: 1 hop; origin: 3).** "Notification didn't fire" on edge = Workers Logs, filter by request ID, structured JSON, already live. Origin = SSH to rtx01 → `journalctl -u vectorizer-api` → correlate with Redis `LRANGE` → cross-ref task ID. Three hops, all requiring home-network reachability on a consumer ISP.

**5. Cold start.** Edge `waitUntil` = 0ms to user response. Celery enqueue = Redis RTT + worker pickup (100-500ms) before the outbound call even starts. Invisible to the user either way, but edge composes cleanly with the existing Worker response path.

**6. Deploy coupling (decisive).** alexmayhew.dev ships multiple times/day; vectorizer ships in infrequent feature batches. Coupling notification copy changes ("update email subject") to GPU-stack release cadence means every trivial tweak waits for a batch window. This alone flips the decision independent of all other factors.

### Implementation boundary

- **Origin:** emit a structured log line on success (`gpu.enable.success`, event_id, ts). Zero new deps, zero new creds. Origin stays a thin WoL gate.
- **Edge:** on successful proxy response, `waitUntil(notify(event_id))` fires Discord + Resend via existing `withRetry`. Secrets via `wrangler secret put DISCORD_WEBHOOK_URL` (Resend binding already present).
- **Dedup:** include `event_id` in the Discord payload so any Worker-side retry produces a visually deduplicable message — cheap substitute for a real dedup store at this volume.
- **Observability:** one log surface (Workers Logs) for all notification outcomes; origin logs answer "did the GPU actually wake", which is what origin logs are for.
