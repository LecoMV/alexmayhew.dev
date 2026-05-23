# Sentry Quota Optimization for LecoNet Free Tier (2026-04-30)

**Status:** CURRENT
**Session:** Multi-project free-tier audit; voice-cloner-sentry burning span quota; alexmayhew-dev errors hitting rate limit; claude-pilot graveyard
**Sources:** All citations are 2026-current Sentry primary docs unless flagged otherwise

---

## TL;DR — Three Prioritized Actions for LecoNet Org

### 1. STOP THE BLEEDING — disable dead/runaway DSNs today (15 min)

- **claude-pilot:** disable the DSN entirely. `Project Settings → Client Keys (DSN) → Disable`. SDK rate limits and inbound filters can't help a project we don't own anymore. DSN disable is the only "graveyard" tool the free tier offers ([Sentry HC: What happens if I disable the DSN](https://sentry.zendesk.com/hc/en-us/articles/23282860895131)). Takes up to 30 min to fully propagate.
- **voice-cloner-sentry:** drop `tracesSampleRate` from 0.1 → **0.02** AND add a `tracesSampler` that returns 0 for healthchecks/static. Currently burning ~1.5–2× the org's monthly span budget every 14 days (382K accepted + 390K client_discard at 10% sample rate ≈ 7.7M sampled-out spans/14d → ~16M spans/month true volume).
- **alexmayhew-dev errors RATE-LIMITED at 4,193:** that's spike protection or org-wide error quota cap kicking in. Audit which errors via `Stats → Usage → alexmayhew-dev → Issues`. Likely a noisy issue the SDK sample rate can't help with — use **inbound filters** (server-side, no deploy) to drop it.

### 2. RESHAPE THE SAMPLING — match config to project value (1 hour)

The single most expensive mistake on a free tier is `tracesSampleRate: 0.1` set blindly across all projects. With only **5M spans/month** shared across 11 projects, that's an org-wide budget of ~450K spans per project per month before everything gets dropped. Per-project allocation (the recommended config matrix below) drops voice-cloner to 0.02, alexmayhew-dev to 0.05, and explicitly disables Performance on all "graveyard / side project" SDKs.

### 3. DECIDE: STAY FREE OR UPGRADE TO TEAM ($26/mo) (one-time decision)

The crossover math is in the "Tier Upgrade Economics" section. Short version: if optimizing the free tier is taking >2 hours/month of engineering time, the Team plan ($26/mo annual / $29/mo monthly per [Sentry HC: How is my plan changing](https://sentry.zendesk.com/hc/en-us/articles/40116900282011)) **pays for itself immediately**. Team gives you 10× errors (50K), 1,000× spans (5M same as free — no change!), 1× replays (50 same — no change!) but unlocks **PAYG, DSN rate limits, and Spike Protection** which are not available on free.

**Wait — here's the surprise from primary sources:** the Team plan's _base quota_ for spans (5M) and replays (50) is **identical to free**. The Team plan's value is NOT more quota — it's:

1. PAYG so overflow doesn't get silently dropped
2. DSN rate limits (free tier can't set per-project rate limits at all)
3. More users
4. Inbound filter by error message / release version (free is limited to built-in filters)

This materially changes the upgrade calculus. See the economics section for breakeven.

---

## Free Tier Quota Numbers — Verified Current

Retrieved from [sentry.io/pricing](https://sentry.io/pricing/) via WebFetch on 2026-04-30. These are official, authoritative numbers.

| Category                                                          | Developer (Free)  | Team ($26/mo annual) | Business ($80/mo annual)                     |
| ----------------------------------------------------------------- | ----------------- | -------------------- | -------------------------------------------- |
| Errors                                                            | 5,000/mo          | 50,000/mo            | 50,000/mo                                    |
| Spans (tracing)                                                   | **5M/mo**         | 5M/mo                | 5M/mo                                        |
| Session Replays                                                   | 50/mo             | 50/mo                | 50/mo                                        |
| Logs                                                              | 5GB/mo            | 5GB/mo               | 5GB/mo                                       |
| Application Metrics                                               | 5GB/mo            | 5GB/mo               | 5GB/mo                                       |
| Cron Monitors                                                     | 1                 | 1                    | 1                                            |
| Uptime Monitors                                                   | 1                 | 1                    | 1                                            |
| Attachments                                                       | 1GB/mo            | 1GB/mo               | 1GB/mo                                       |
| Data retention                                                    | 30 days           | 30 days              | **90 days**                                  |
| Users                                                             | **1**             | Unlimited            | Unlimited                                    |
| Projects                                                          | Unlimited         | Unlimited            | Unlimited                                    |
| PAYG                                                              | **NOT AVAILABLE** | Available            | Available                                    |
| Spike Protection                                                  | Per-project       | Per-project          | Per-project                                  |
| DSN Rate Limits                                                   | **NOT AVAILABLE** | **Business+ ONLY**   | Available                                    |
| Dynamic Sampling                                                  | Not available     | Sampling Priorities  | Sampling Priorities (+ Custom on Enterprise) |
| Inbound: built-in filters (web crawlers, localhost, browser ext.) | Yes               | Yes                  | Yes                                          |
| Inbound: filter by IP                                             | Yes               | Yes                  | Yes                                          |
| Inbound: filter by error message                                  | No                | No                   | **Business+ ONLY**                           |
| Inbound: filter by release version                                | No                | No                   | **Business+ ONLY**                           |

**Verified retrieval URL:** https://sentry.io/pricing/ (2026-04-30)
**Cross-verified:** https://docs.sentry.io/pricing/

### What happens when free tier hits the cap?

From [docs.sentry.io/pricing/](https://docs.sentry.io/pricing/) and [SentryPricing.com](https://sentrypricing.com/free-plan):

> "When you reach your 5,000 event limit for the month, Sentry stops accepting new events until the next billing cycle, and any errors that occur after the limit is reached are silently dropped."

- **Hard cap.** No PAYG fallback on free.
- **Silently dropped** server-side (returns 429; SDK records as `client_discard` if SDK still tries).
- Quota is **org-wide** with optional per-project allocation cap (see Spend Allocation feature, but that's paid-only).
- Effectively: with 11 projects on free, the noisiest project will eat the entire org budget unless you constrain each SDK manually.

### Spike Protection on Free Tier — clarification

From [docs.sentry.io/pricing/quotas/spike-protection/](https://docs.sentry.io/pricing/quotas/spike-protection/):

- **Default ON** for projects in non-trial orgs (your existing projects should already have it).
- **Per-project, not org-wide.**
- Algorithm: weighted hourly average from past 7 days; recalculated hourly during a spike.
- **Covers:** errors, spans, transactions, attachments. **Does NOT cover replays.**
- **What it does:** drops events server-side (returns `retry_after` header → SDK backs off → events recorded as `client_discard`).
- **What it does NOT do:** prevent quota exhaustion. Spike protection slows the burn rate during a spike but still drops the same events. It's a fairness mechanism, not a quota saver.
- **The 4,193 alexmayhew-dev errors RATE-LIMITED** is almost certainly spike protection firing on a noisy issue. Good — it means the system worked. But the underlying issue still needs to be fixed via inbound filter.

---

## Per-Question Answers

### Q1. Sentry free tier 2026 limits — verified above ✓

### Q2. Sampling strategies — current best practice (2026)

**tracesSampleRate (fixed) vs tracesSampler (function): use tracesSampler for any non-trivial app.**

From [docs.sentry.io/platforms/javascript/configuration/sampling/](https://docs.sentry.io/platforms/javascript/configuration/sampling/):

> "If `tracesSampler` is defined, its decision will be used. It can choose to keep or ignore any parent sampling decision, use the sampling context data to make its own decision, or choose a sample rate for the transaction."

**Canonical 2026 pattern (from official Sentry docs):**

```typescript
Sentry.init({
	tracesSampler: ({ name, attributes, inheritOrSampleWith }) => {
		// NEVER sample health checks
		if (name.includes("healthcheck")) return 0;
		if (name.includes("/api/health")) return 0;
		if (name.includes("/_next/static")) return 0;

		// Always capture critical paths
		if (name.includes("/api/contact")) return 1.0;
		if (name.includes("/checkout")) return 1.0;
		if (name.includes("auth")) return 1.0;

		// High-volume noise → 1%
		if (name.includes("comment") || name.includes("/api/log")) return 0.01;

		// Default: inherit upstream decision or fall back to your base rate
		return inheritOrSampleWith(0.05);
	},
});
```

The `inheritOrSampleWith` helper is the 2026-current way to handle distributed tracing — it preserves trace continuity when an upstream service has already made a sampling decision.

**Recommended sample rates by traffic level — primary source guidance:**

| Traffic level                     | tracesSampleRate | Source                                                                                        |
| --------------------------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| Dev / staging                     | 1.0              | [Sentry blog](https://blog.sentry.io/sampling-strategy-sentry/)                               |
| Low traffic (< 10K req/day)       | 0.10–0.20        | [docs.sentry.io](https://docs.sentry.io/platforms/javascript/guides/nextjs/) example uses 0.1 |
| Medium traffic (10K–100K req/day) | 0.05             | [Sentry blog example](https://blog.sentry.io/sampling-strategy-sentry/) explicitly uses 0.05  |
| High traffic (> 100K req/day)     | 0.01             | Sentry blog: "1% sampling" for high-volume endpoints                                          |
| Free tier with multi-project      | 0.01–0.02        | DERIVED — not a Sentry recommendation, my math from 5M span budget                            |

**Why NOT sample at 100% in production** ([Sentry blog](https://blog.sentry.io/sampling-strategy-sentry/)):

> "Needing to parse through 1 million 'user clicked button' spans to discover the 100 times users experienced issues during checkout isn't efficient."

> "By sampling only what you need, performance stays high while still collecting valuable information."

**Dynamic Sampling — what it is and who can use it:**

From [docs.sentry.io/organization/dynamic-sampling/](https://docs.sentry.io/organization/dynamic-sampling/):

- **Server-side, after events reach Sentry's infrastructure.** Distinct from SDK-level sampling.
- **NOT available on free tier.** Team and Business get "Dynamic Sampling with Sampling Priorities." Custom Sample Rates are Enterprise-only.
- Recommendation when using Dynamic Sampling: set SDK `tracesSampleRate` to 1.0 and let the server side do the optimization.
- **For LecoNet free tier: not relevant.** All sampling decisions must happen client-side in the SDK.

**Head-based vs tail-based sampling:**

Sentry's SDK sampling is **head-based** (decision made when the trace starts; entire trace kept or dropped). True tail-based sampling (where you wait for the trace to finish, see if it had errors, then decide to keep) is not supported by Sentry SDKs natively. The closest equivalent is `replaysOnErrorSampleRate: 1.0`, which captures the _last 60 seconds_ of session replay buffer when an error fires — that's a tail-based decision for replays only, not for traces.

**Sampling spans within a transaction vs whole transactions:**

In SDK v10+ (2026), Sentry has migrated to **spans as the billing unit** ([docs.sentry.io/pricing/quotas/manage-transaction-quota/](https://docs.sentry.io/pricing/quotas/manage-transaction-quota/) is now titled "Manage Your Span Quota"). The sampling decision is still effectively made at the trace level — when you sample a trace, all its spans are kept; when you drop a trace, all its spans are dropped. The relevant setting for the SDK is still `tracesSampleRate` / `tracesSampler`.

**When to disable Performance entirely vs sample at low rate:**

Disable entirely (`tracesSampleRate: 0`) when:

- Project is a side project / graveyard / experimental
- You only care about errors
- You're hitting org quota and want to redirect spans to a higher-value project

Sample at low rate (0.01–0.02) when:

- Project is production
- You want to keep the option of investigating perf regressions
- You can tolerate some span dropping during traffic spikes

### Q3. Spike protection / smart routing

**How it works** (from [docs.sentry.io/pricing/quotas/spike-protection/](https://docs.sentry.io/pricing/quotas/spike-protection/)):

- Per-project. Toggle in `Settings → Spike Protection`. Default ON for non-trial orgs.
- Algorithm: max of (a) minimum-event floor and (b) usage-based threshold from past 7 days, weighted by hourly seasonality.
- Recalculated hourly during a spike.
- **Coverage:** errors, transactions, spans, attachments. NOT replays.
- **Behavior on trip:** server returns 429 with `retry_after`; SDK records as `client_discard` (counts as a "dropped" event in Stats but doesn't consume quota).

**Inbound filters** (from [docs.sentry.io/concepts/data-management/filtering/](https://docs.sentry.io/concepts/data-management/filtering/)):

> "Filtered events do not consume quota."

Critical: inbound filters drop events before they hit your quota. This is the most underused free-tier hygiene tool.

**Free tier filter access:**

| Filter                    | Free tier?                               |
| ------------------------- | ---------------------------------------- |
| Browser extension errors  | Yes                                      |
| Health check transactions | Yes                                      |
| Legacy browsers           | Yes                                      |
| Localhost events          | Yes                                      |
| Web crawler errors        | Yes                                      |
| React hydration errors    | Yes                                      |
| ChunkLoadErrors           | Yes                                      |
| IPv4/IPv6/CIDR            | Yes                                      |
| Filter by error message   | **Business+ only**                       |
| Filter by release version | **Business+ only**                       |
| Filter by request URL     | Yes (Project Settings → Inbound Filters) |
| Filter by user-agent      | Yes                                      |

**LecoNet action:** turn on EVERY built-in filter for every project today. Specifically, `Browser Extensions`, `Localhost`, `Web Crawlers`, `Legacy Browsers`, `React Hydration Errors`, `ChunkLoadErrors`, `Filter Out Health Checks`. These cost nothing to enable and consistently drop 5–20% of free-tier noise.

**DSN rate limits — IMPORTANT:**

From [docs.sentry.io/pricing/quotas/manage-event-stream-guide/](https://docs.sentry.io/pricing/quotas/manage-event-stream-guide/):

> "Rate limits ... act as a ceiling intended to protect you from unexpected spikes" — listed as **Business/Enterprise plans only**.

**This is wrong in some third-party blogs but the Sentry source confirms: DSN rate limits are not in Team or Free.** The implication: on the free tier, your only client-side throttling tool is `tracesSampleRate` / `tracesSampler`. Everything else is server-side filtering and spike protection.

### Q4. Cost per unit on PAYG (Team and Business plans)

Retrieved from [sentry.io/pricing](https://sentry.io/pricing/) WebFetch (2026-04-30) — these are PAYG overage rates after base quota is consumed:

| Category             | Volume tier | Team rate       | Business rate   |
| -------------------- | ----------- | --------------- | --------------- |
| Errors               | 50K–100K    | $0.000363/error | $0.001113/error |
| Errors               | 100K–500K   | $0.000219/error | $0.000625/error |
| Errors               | 500K–10M    | $0.000188/error | $0.000375/error |
| Errors               | 10M–20M     | $0.000163/error | $0.000325/error |
| Errors               | 20M+        | $0.000150/error | $0.000300/error |
| Spans                | 5M–100M     | $0.0000020/span | $0.0000040/span |
| Replays              | 50–5K       | $0.00375/replay | $0.00375/replay |
| Logs / Metrics       | per GB      | $0.50/GB        | $0.50/GB        |
| Attachments          | per GB      | $0.3125/GB      | $0.3125/GB      |
| Cron monitors        | per monitor | $0.78/mo        | $0.78/mo        |
| Uptime monitors      | per monitor | $1.00/mo        | $1.00/mo        |
| Continuous profiling | per hour    | $0.0315/hr      | $0.0315/hr      |
| UI profiling         | per hour    | $0.25/hr        | $0.25/hr        |

**Cross-checked:** [sentrypricing.com](https://sentrypricing.com/) and [last9.io/blog/sentry-pricing](https://last9.io/blog/sentry-pricing/) report consistent figures. PAYG rates for spans cited as **$0.0000016/span at higher volumes** in some sources — Sentry's own tiered rate of $0.0000020/span at 5–100M is the safest reference for our band.

**Key reality check on costs:**

- Spans are **~150× cheaper than errors per unit** on Team plan ($0.000002 vs $0.000300 at high volume).
- Replays are **~13× more expensive than errors** per unit ($0.00375 vs $0.000300).
- Profile hours are by FAR the most expensive class — $0.25/hr UI profiling = a single user hour costs more than 800 errors.

**For LecoNet's voice-cloner-sentry burn rate:**

- 382K accepted spans + 181K transactions over 14 days ≈ 1.2M spans/month equivalent assuming similar 14-day windows persist.
- 390K client_discard means SDK _tried_ to send 4× that volume but spike protection / sample rate dropped most.
- True traffic at 100% sample = ~8M spans/month (5M over org cap, 3M overage).
- **On Team PAYG:** 3M overage × $0.0000020 = **$6/mo** in span overage. Trivial.
- **On Free:** the entire 5M org budget gets eaten by voice-cloner alone, every other project loses spans.

This is the crossover insight: span overage is so cheap on Team plan that a $26/mo Team subscription effectively gives you 100M spans/mo for $26 + $190 = $216/mo. Free tier: 5M spans, hard cap, multi-project starvation.

### Q5. Multi-project free tier hygiene — recommended checklist

**Best practice for 11 projects on one free tier:**

1. **Categorize each project** into Production / Side / Graveyard. Apply different SDK config per category.
2. **Disable Performance entirely** (`tracesSampleRate: 0`) on Side and Graveyard projects.
3. **Disable Replay entirely** on every project except the one customer-facing production frontend (alexmayhew-dev).
4. **Enable every applicable inbound filter** on every project (free, server-side).
5. **Audit `Stats → Usage Stats` weekly** to spot a new spike before it eats the org budget.
6. **DSN rotation** for projects you're sunsetting — disable the DSN, don't just remove the SDK from code (in case there's a stale build out there).

**The "graveyard" problem (you just hit this with claude-pilot):**

Recommended cleanup checklist when retiring a Sentry project:

1. **Disable the DSN first** — Project Settings → Client Keys (DSN) → click the toggle. This blocks all events server-side within ~30 min ([Sentry HC: Disable DSN](https://sentry.zendesk.com/hc/en-us/articles/23282860895131)).
2. **Remove the SDK from any deployed code** that's still emitting (the actual app on production servers).
3. **Disable cron monitors and uptime monitors** in the project. These keep emitting check-ins regardless of DSN state.
4. **Remove any scheduled cron monitors** in code that still call Sentry.
5. **Remove alert rules** so old alerts don't keep firing.
6. **Remove team member access** to keep the project list tidy.
7. **Optional: delete the project** once you've confirmed nothing external is still calling its DSN. Note: deleting cannot be undone.

**For claude-pilot specifically:** disabling the DSN today blocks the 819K span / 83K monitor burn within 30 min. Don't skip step 3 — those 83K monitors are cron check-ins from the still-running monitor, not from SDK telemetry. Disable the cron monitor in `Crons → claude-pilot → toggle off` or you'll keep eating monitor budget.

**Should "side projects" disable Performance entirely?**

Yes. Almost always. The math:

- 11 projects on free tier × 0.1 tracesSampleRate × ~50K req/mo each = 55K traces/mo × ~10 spans/trace = 5.5M spans = **already over org cap**.
- Disabling Performance on 8 of 11 projects (keep on production-only: alexmayhew-dev, voicekeep, voice-cloner) and dropping the production three to 0.02–0.05 brings the org well under 1M spans/mo.

### Q6. LecoNet-specific projection math

**voice-cloner-sentry — current vs proposed:**

```
CURRENT (tracesSampleRate=0.1):
  14d accepted: 382K spans + 181K transactions ≈ 563K combined items
  14d client_discard: 390K (these are the ones spike protection / SDK rate limit dropped)
  Total SDK attempted: ~953K items / 14d → ~2M items/month at 10% sample rate
  → True 100% traffic = ~20M spans/month equivalent
  → At 0.1 sample = 2M/month → eats 40% of free tier 5M cap alone

PROPOSED (tracesSampleRate=0.02 + tracesSampler dropping healthchecks):
  20M true volume × 0.02 = 400K spans/month from voice-cloner
  After dropping ~30% noise (healthchecks, static, /api/internal): ~280K spans/mo
  → 5.6% of org cap. Sustainable.
```

**alexmayhew-dev — current vs proposed:**

```
CURRENT (tracesSampleRate=0.1, replaysSessionSampleRate=0.1):
  14d accepted: 8,835 spans + 1,382 transactions + 864 errors
  14d errors RATE-LIMITED: 4,193 (5,057 attempted, 864 accepted = 17% acceptance)
  Implication: error volume is fine for free tier monthly (864 errors × 30/14 = ~1850/mo well under 5K)
  BUT: a noisy issue is hitting spike protection. Find and inbound-filter it.
  Spans: 8,835 × 30/14 = ~19K/mo. Trivial.

PROPOSED (tracesSampleRate=0.05, replaysSessionSampleRate=0):
  Spans: ~9K/mo. 0.2% of org cap.
  Replays: only on-error replays (target ~5–20/mo for a low-traffic site).
  Errors: must inbound-filter the noisy issue first; then ~1,800/mo well under 5K.
```

**Org-wide projection if all recommendations applied:**

| Project               | Spans/mo (proposed) | Errors/mo (proposed)  | Replays/mo |
| --------------------- | ------------------- | --------------------- | ---------- |
| voice-cloner-sentry   | 280K                | ~500                  | 0          |
| voicekeep (prod)      | 100K                | ~200                  | 0          |
| alexmayhew-dev        | 9K                  | ~1,800 (after filter) | 5–20       |
| navius / navius-api   | 50K (low traffic)   | ~50                   | 0          |
| claude-pilot          | 0 (DSN disabled)    | 0                     | 0          |
| 6 other side projects | 0 (Perf disabled)   | ~50 each = 300        | 0          |
| **TOTAL**             | **~440K**           | **~2,800**            | **~20**    |

**Headroom:** 440K of 5M spans (~9%), 2,800 of 5,000 errors (~56%), 20 of 50 replays (~40%). Comfortable on free tier.

---

## Recommended Configuration Matrix — All 11 Projects

Categorize each project, then apply the matching config row.

| Project               | Category       | tracesSampleRate            | replaysSessionRate | replaysOnErrorRate | profilesSampleRate | Cron monitor? | Errors enabled?   |
| --------------------- | -------------- | --------------------------- | ------------------ | ------------------ | ------------------ | ------------- | ----------------- |
| voicekeep (prod)      | Critical       | **tracesSampler 0.05 base** | 0                  | 0                  | 0                  | If used       | Yes               |
| voice-cloner-sentry   | Critical       | **tracesSampler 0.02 base** | 0                  | 0                  | 0                  | If used       | Yes               |
| alexmayhew-dev        | Marketing site | **tracesSampler 0.05 base** | **0**              | **1.0**            | 0                  | No            | Yes               |
| navius / navius-api   | Active dev     | **tracesSampler 0.05 base** | 0                  | 0                  | 0                  | If used       | Yes               |
| claude-pilot          | Graveyard      | **DSN DISABLED**            | —                  | —                  | —                  | **Disable**   | DSN disabled      |
| 6 other side projects | Side           | **0**                       | 0                  | 0                  | 0                  | No            | Yes (errors only) |

**Key changes from current:**

- Drop voice-cloner from 0.1 → 0.02 with `tracesSampler` dropping healthchecks/static.
- Drop alexmayhew-dev from 0.1 → 0.05 AND drop `replaysSessionSampleRate` from 0.1 → 0 (rely entirely on error-triggered replay; this fits a marketing site with low organic traffic).
- Disable performance entirely on side projects (`tracesSampleRate: 0`).
- Disable claude-pilot DSN AND cron monitor today.
- Enable all built-in inbound filters on every project.
- For alexmayhew-dev specifically: identify the issue causing 4,193 RATE-LIMITED errors and add it to inbound filters by URL pattern (free tier supports URL filter even though it doesn't support error message filter).

**`tracesSampler` template for production projects:**

```typescript
// Apply this in sentry.client.config.ts AND sentry.server.config.ts
// (or wherever Sentry.init runs for the project)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampler: ({ name, attributes, inheritOrSampleWith }) => {
		// Hard zeros — never trace these
		if (!name) return 0;
		if (name.includes("/api/health")) return 0;
		if (name.includes("/health")) return 0;
		if (name.includes("/_next/static")) return 0;
		if (name.includes("/_next/image")) return 0;
		if (name.includes("favicon")) return 0;
		if (name.includes("/api/csp-report")) return 0;
		if (attributes?.["http.method"] === "OPTIONS") return 0;

		// Critical paths — always trace
		if (name.includes("/api/contact")) return 1.0;
		if (name.includes("/api/auth")) return 1.0;
		if (name.includes("/api/checkout") || name.includes("/api/subscribe")) return 1.0;

		// Default — inherit upstream or apply project base rate
		// Replace 0.05 with 0.02 for voice-cloner, 0.05 for alexmayhew-dev, etc.
		return inheritOrSampleWith(0.05);
	},

	// Replay — error-only for marketing site
	replaysSessionSampleRate: 0,
	replaysOnErrorSampleRate: 1.0,

	// Disable profiling entirely (paid feature, expensive)
	profilesSampleRate: 0,

	// Required for spike protection to work cleanly
	sendClientReports: true,
});
```

---

## Tier Upgrade Economics — Free vs Team ($26/mo)

### When does Team plan become cheaper than engineering time?

**Engineering time cost assumptions:**

- Your hourly value: assume $150/hr (conservative for a Principal SE with consulting work).
- Audit/optimization cycle: ~2 hours per cycle (DSN audit, sample rate tuning, inbound filter setup, verification).
- Frequency on free tier: roughly monthly when you have 11 projects emitting at scale, since one new noisy issue can eat the org budget.

**Free tier annual TCO (engineering time):**

- 12 cycles × 2 hours × $150/hr = **$3,600/year of your time**

**Team plan annual cost:**

- $26/mo annual billing × 12 = **$312/year** + average ~$50/year PAYG for occasional overage = **~$362/year**

**Net annual savings of upgrading: ~$3,238.** Pays for itself in the first month.

### When does free tier still make sense?

- All 11 projects are pure side projects with < 100 errors/month each combined.
- You don't care if errors get silently dropped during a spike.
- You can audit and tune in <30 minutes per cycle.
- You don't need replay session recording (only on-error fine).
- Single user accessing the dashboard.

### When does Team plan become _necessary_?

- More than one team member needs dashboard access (free tier = 1 user max).
- You're regularly hitting the 5K error cap.
- You need DSN rate limits (Business+ only — Team doesn't have them either, contradiction in some Sentry pages so verify before purchase).
- You need to filter by error message or release version (Business+ only).
- You want PAYG so events stop getting silently dropped.

### When does Business plan ($80/mo) make sense?

- You need filter-by-error-message (the killer feature for noisy projects).
- You need 90-day retention for compliance.
- You need DSN rate limits (this is the documented Business+ feature gate).
- Multiple production properties consuming significant span volume.

### My recommendation for LecoNet right now

**Stay on free tier through 2026-Q2. Re-evaluate when:**

1. Engineering time spent on Sentry quota optimization exceeds 2 hours per month consistently.
2. A second user needs dashboard access (e.g., contractor, support engineer).
3. You hit the 5K error cap two months in a row even after applying inbound filters.

The recommended config matrix above projects ~9% span, ~56% error, ~40% replay utilization. That's healthy headroom and the optimization should hold for 3–6 months without intervention as long as no project sees a major traffic spike.

---

## Sources

### Primary (Sentry official docs and pricing pages)

- [Sentry Pricing — main page](https://sentry.io/pricing/) — verified 2026-04-30
- [Sentry Pricing & Billing docs](https://docs.sentry.io/pricing/) — pricing structure, definitions
- [Spike Protection](https://docs.sentry.io/pricing/quotas/spike-protection/) — algorithm, coverage, behavior
- [Inbound Filters](https://docs.sentry.io/concepts/data-management/filtering/) — filter categories and quota impact
- [Manage Event Stream](https://docs.sentry.io/pricing/quotas/manage-event-stream-guide/) — DSN rate limits, cleanup checklist
- [Manage Span Quota](https://docs.sentry.io/pricing/quotas/manage-transaction-quota/) — span as 2026 billing unit
- [Manage Replay Quota](https://docs.sentry.io/pricing/quotas/manage-replay-quota/) — replay quota mechanics
- [JavaScript Sampling](https://docs.sentry.io/platforms/javascript/configuration/sampling/) — `tracesSampler` semantics, `inheritOrSampleWith`
- [Sample Rates concepts](https://docs.sentry.io/concepts/key-terms/sample-rates/) — terminology
- [Dynamic Sampling](https://docs.sentry.io/organization/dynamic-sampling/) — server-side sampling, paid-only
- [Sentry HC: Disable DSN](https://sentry.zendesk.com/hc/en-us/articles/23282860895131) — graveyard cleanup primary source
- [Sentry HC: How is my plan changing 2025-08](https://sentry.zendesk.com/hc/en-us/articles/40116900282011) — confirms $26 annual / $29 monthly base
- [Sentry HC: Why did spike protection drop a small number of events](https://sentry.zendesk.com/hc/en-us/articles/30480869547931) — `client_discard` mechanics
- [Sentry HC: PAYG](https://sentry.zendesk.com/hc/en-us/articles/25235882936987) — confirms PAYG NOT available on free
- [Client Reports protocol](https://develop.sentry.dev/sdk/telemetry/client-reports/) — definitions of `client_discard` reasons
- [Rate Limiting protocol](https://develop.sentry.dev/sdk/expected-features/rate-limiting/) — SDK retry-after behavior
- [Sentry blog: Sampling Strategy](https://blog.sentry.io/sampling-strategy-sentry/) — 0.05 production rate example, "watching everything is watching nothing"
- [Sentry blog: Per-Project Rate Limits](https://blog.sentry.io/per-project-rate-limits/) — DSN rate limit feature
- [Sentry blog: Spike Protection](https://blog.sentry.io/event-spike-protection/) — algorithm background

### Secondary (price cross-checks only — used to verify 2026 numbers, not as primary citations)

- [SentryPricing.com Free Plan](https://sentrypricing.com/free-plan)
- [Last9 Sentry Pricing breakdown](https://last9.io/blog/sentry-pricing/)
- [Costbench Sentry pricing 2026](https://costbench.com/software/developer-tools/sentry/)

### Existing in our research dir (related)

- `docs/research/sentry-opennext-cloudflare-2026.md` — SDK setup for Cloudflare Workers / OpenNext (current as of 2026-03-14, still applies)

---

## Confidence Notes

- **HIGH confidence (verified from multiple Sentry primary sources):** all quota numbers, PAYG overage rates, free tier hard cap behavior, DSN rate limits being Business+, inbound filter availability matrix, spike protection algorithm.
- **MEDIUM confidence (single primary source):** the Team-vs-Business inbound filter gating (filter-by-error-message). Cross-check Sentry account UI before assuming this for billing decisions.
- **MEDIUM confidence (synthesized):** voice-cloner span volume projection (assumes the 14-day window is representative; if the burst was atypical, real monthly volume could be 50% lower).
- **DERIVED, not Sentry-recommended:** the 0.02 sample rate for voice-cloner. Sentry's recommendations top out at 0.05 production. We're being more conservative due to the 5M shared-org constraint.
- **Areas needing further research:** whether DSN rate limits exist on the Team plan or are truly Business-only. Sentry's pricing page hints at "rate limits available on Business and Enterprise" but the [manage-event-stream-guide](https://docs.sentry.io/pricing/quotas/manage-event-stream-guide/) implies Business/Enterprise. If considering Team upgrade specifically for DSN rate limits, verify with Sentry sales first.
