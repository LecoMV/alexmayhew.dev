# GPU Enable Endpoint — Rate Limit Policy (2026-04-18)

**Status:** CURRENT
**Session:** Design two-tier rate limit for `POST /gpu/enable` on alexmayhew.dev/tools/traceforge — proxied through Cloudflare Workers to a home RTX 3080. Bot abuse would keep GPU awake 24/7 or flood Discord/Resend notification pipeline.
**Sources:** 9 sources across WebSearch + codebase inspection.

## Codebase Reality

Endpoint already requires a **password** (`src/components/traceforge/gpu-control.tsx:37`). That is the primary gate. Rate limiting protects (a) password-guessing, (b) notification flood, (c) compute cost from a correct password leaking. Prior research (`docs/research/cloudflare-rate-limiting-2026.md`) established: Workers Rate Limit binding is the correct tool, WAF rule (1 free) is the pre-Worker belt.

Critical constraint from Cloudflare docs: the Workers rate limit binding is **per-Cloudflare-location, not global** [2]. A determined attacker rotating through global PoPs gets N × locations of budget. WAF rate limiting rules _are_ globally-coordinated [4] — use them for the cross-PoP tier.

## Recommended Policy

### Tier A — Per-IP (Workers Rate Limit binding)

- **Window:** 60 seconds
- **Limit:** 3 attempts per window
- **Key:** `CF-Connecting-IP` (full IPv4, or /64 for IPv6)
- **Action:** 429 with `Retry-After: 60`

**Justification.** A legitimate user presses the button, types a password, and retries at most once on typo. 3/min covers 100% of real usage with margin. Wake-on-LAN relay services standardize on **5 req/min per IP** [1]; a `/gpu/enable` with password guarding is more sensitive (compute cost, not just a magic packet) so tighten to 3. IPv6 /64 because ISPs hand out /64 blocks per customer — stops one attacker rotating /128s within their block.

### Tier B — Global (Cloudflare WAF Rate Limiting Rule)

- **Window:** 600 seconds (10 min)
- **Limit:** 30 requests
- **Characteristic:** URI path = `/gpu/enable`
- **Action:** Block

**Justification.** The GPU's _physical_ wake budget is bounded: it takes ~15s to wake, then auto-sleeps after 30 min idle. The worst-case legitimate traffic (50 enables/day projected) = **~2 per hour**. 30 per 10 min is 15× that — still catches a botnet that evades the per-IP tier by rotating sources. WAF rate limiting is globally coordinated across all PoPs [4], which the Workers binding is not [2]. Free plan ships 1 WAF rule — spend it here.

### Tier C — Mandatory: Turnstile on the endpoint

**Currently absent. Add it.** This is the single highest-leverage change. Cloudflare, Truefoundry, and multiple 2026 guides converge on "Turnstile + rate limit" as the standard pattern for expensive/resource-waking endpoints [5][6][8]. Cost: zero (free tier is 1M verify/mo [8]). Latency: <200ms, invisible managed mode. A bot distributed across 10,000 IPs still can't solve Turnstile at scale. Contact form already ships Turnstile; reuse the same pattern.

### Notification coalescing — YES, separate and aggressive

Rate-limit notifications **independently** of the API call:

- **Discord:** coalesce to 1 message per 60s window. If 10 enables arrive in 10s, send one "10 enables in last 60s, latest from IP X" summary. Discord's hard limit is 5 req/2s per webhook [3] — coalescing gives headroom for genuine burst incidents.
- **Resend:** 1 email per 300s window, same coalescing pattern. Resend is paid-per-send; a 1000-req botnet spike shouldn't cost $10 in transactional email.

Implementation: store `last_notify_at` + `pending_count` in the same KV namespace as the rate-limit counter. The _wake action_ still fires per-request (it's idempotent — GPU is already on). Only notifications coalesce.

## Industry Comparison

No public homelab GPU-wake-on-demand service exists at scale that I could find — this is a fairly novel exposure. Analogous patterns:

| Service class                                 | Typical per-IP limit   | Bot gate    |
| --------------------------------------------- | ---------------------- | ----------- |
| Wake-on-LAN relay (2026 guides) [1]           | 5 req/min              | HMAC/JWT    |
| Public Ollama instances (most are unauth) [7] | none (= abused)        | none        |
| Cloudflare AI Gateway default                 | 100 req/min per tenant | account key |
| LLM inference gateways (Truefoundry) [6]      | 429 w/ retry headers   | API key     |

Ollama is the cautionary tale: [7] documents 1,139 publicly-exposed Ollama instances being abused for free inference. The difference here is password + wake delay + idle auto-sleep, which already limits damage. Rate limiting is the second layer.

## Trade-off Analysis

| Concern                                     | At proposed limits                                                                                                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| False-positive rate (legit user locked out) | ~0. 3 req/min / IP vs. realistic 1-2 req/session. Only affects shared-NAT offices with multiple simultaneous users — not the target audience.                  |
| Abuse surface (bot keeps GPU awake)         | GPU draws ~15W idle, ~320W full. At 30 global/10min, worst-case keeps GPU awake indefinitely but doesn't load it. Password gate prevents actual compute abuse. |
| Notification DOS                            | Eliminated by coalescing — max 60 Discord msgs/hour, 12 emails/hour even under botnet.                                                                         |
| Cloudflare cost                             | $0. All tiers on free plan. Workers rate limit binding + 1 WAF rule + Turnstile free.                                                                          |

The worst realistic outcome at these limits is: attacker with correct password keeps the GPU awake and burns ~$5/month in idle electricity. The password leaking is the real failure mode, not rate limiting.

## Upgrade Signals

Tighten the policy when any of these fire:

1. **First 429 burst from a single IP** (>10 in an hour) → drop Tier A to 2/60s, log IP for manual review
2. **>100 enables/day sustained for 7 days** → traffic is real, consider: Turnstile mandatory + auth token instead of password
3. **Any evidence of password leak** (enables from geographies you don't operate in) → rotate password, add IP allowlist for admin, audit
4. **Discord/Resend rate limit 429s in logs** → coalescing window too small, widen to 300s
5. **GPU idle power draw bill increases noticeably** → attacker succeeded at the wake-keep-awake game; add cooldown: after disable, block re-enable from same IP for 5 minutes

## Sources

1. [TheLinuxCode — Remote Power-On Wake-on-LAN 2026 Guide](https://thelinuxcode.com/remote-power-on-over-the-internet-with-wake-on-lan-a-practical-2026-guide/) — 5 req/min per IP WoL industry norm, HMAC/JWT auth
2. [Cloudflare Workers Rate Limit binding docs](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) — confirms per-location (not global) counters, IP-key caveat
3. [Discord Webhooks Rate Limits](https://birdie0.github.io/discord-webhooks-guide/other/rate_limits.html) — 5 req/2s per webhook, batching/backoff
4. [Cloudflare WAF Rate Limiting Rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) — global counters across all PoPs, free plan = 1 rule
5. [Cloudflare Turnstile + WAF integration](https://blog.cloudflare.com/integrating-turnstile-with-the-cloudflare-waf-to-challenge-fetch-requests/) — standard pattern: Turnstile + rate limit on expensive endpoints
6. [Truefoundry — Rate Limiting for LLM/Inference Gateways](https://www.truefoundry.com/blog/rate-limiting-in-llm-gateway) — 429 + Retry-After headers, GPU burst protection
7. [UpGuard — Securing Exposed Ollama Instances](https://www.upguard.com/blog/understanding-and-securing-exposed-ollama-instances) — 1,139 exposed Ollama instances abused for free inference
8. [Cloudflare Turnstile plans](https://developers.cloudflare.com/turnstile/plans/) — 1M verify/mo free tier
9. `docs/research/cloudflare-rate-limiting-2026.md` — prior research: Workers binding is production-correct, KV unsuitable, DO overkill

## Related

- `docs/research/cloudflare-rate-limiting-2026.md` — infrastructure choice (use Workers binding, not KV)
- `src/components/traceforge/gpu-control.tsx` — endpoint consumer (password-gated)
- `src/app/actions/contact.ts` — reference Turnstile integration to reuse
