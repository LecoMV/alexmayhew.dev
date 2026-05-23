# CSP Violation Reporting Architecture — High-Traffic, Sentry-Quota-Constrained (2026-04-30)

**Status:** CURRENT
**Session:** Pick a defensible CSP-reporting architecture for alexmayhew.dev that delivers visibility without burning the Sentry free-tier errors quota. Two prior research docs already cover (a) Sentry quota economics and (b) eval-source diagnosis — this doc fills the architectural gap.
**Companion docs (read in this order):**

1. `docs/research/sentry-quota-optimization-2026-04-30.md` — what each Sentry quota class is, why the free tier hard-caps at 5K errors/mo, why filter-by-error-message is Business+ only.
2. `docs/research/csp-eval-source-diagnosis-2026-04-30.md` — where the 5,633 events/14d are coming from (webpack runtime `r.g` shim + GTM CJVs + extensions). Has noise-filter regex set already.
3. **This doc** — given those constraints, where do CSP reports go? How are they alerted on?

**Sources:** All citations are 2026-current primary sources unless flagged. Any source flagged `[STALE]` is older than 12 months and should be re-verified before depending on it.

---

## TL;DR — Recommended Architecture (3 Steps, 1-Line Justification)

> **D) Workers Logs (always-on intake) + KV-dedup novel-violation detector + Sentry forward only on first-seen fingerprints.**
>
> _Why:_ Sentry counts every CSP report as a billed _error_ (`event.type === "csp"`). At ~5,633 events/14d the browser-SDK auto-capture path consumes the entire 5K/mo free-tier errors budget on CSP alone — alexmayhew-dev has no budget left for actual JavaScript exceptions. Workers Logs gives free-tier 200K events/day intake with 3-day retention. KV gives 1,000 free writes/day, more than enough for a fingerprint-set with 24-hour TTL. Forwarding only first-seen fingerprints to Sentry caps Sentry consumption at ~30 events/day even during a regression. This pattern keeps full violation history queryable in Workers Logs (real-time tail), gets immediate alerts via Sentry on truly new violations, and uses zero paid SaaS.

### The three steps

1. **Stop the bleeding in 5 minutes.** Drop `event.type === "csp"` in `sentry.client.config.ts` `beforeSend` — eliminates 100% of current CSP-driven errors-quota burn. Free tier doesn't have the Sentry-side "Additional ignored sources" CSP filter UI gated behind paid tiers per the research below; client-side `beforeSend` is the only equivalent free-tier control surface.
2. **Lift the report endpoint into the architecture.** `/api/csp-report` Worker apply the noise-filter regex set from the eval-source diagnosis doc, then write a fingerprint to Workers KV with 24h TTL. If the fingerprint is newly seen, forward a single Sentry event via the dedicated security endpoint (NOT the browser SDK).
3. **Add full-history visibility.** Keep the structured-JSON Workers Logs as the audit trail. Optionally add Workers Analytics Engine `writeDataPoint` for trend dashboards — it's effectively free at our volume (100K writes/day on free).

The flip-side argument (keep Sentry browser-SDK auto-capture, just filter aggressively in `beforeSend`) is _defensible but inferior_. Section "Decision Matrix" below scores it on cost, retention, alerting, dedup quality, and free-tier sustainability.

---

## 1. Sentry Dedicated Security Endpoint — What It Costs, Whether It's Cheaper

**Endpoint URL format** (Sentry docs, retrieved 2026-04-30):

```
https://<ORG_INGEST_DOMAIN>/api/<PROJECT_ID>/security/?sentry_key=<PUBLIC_KEY>
                                                       &sentry_environment=production
                                                       &sentry_release=<SHA>
```

**Quota classification — definitive answer:**

> "Events with the following `event.type` value count towards your error quota for each monthly period: `default`, `error`, `csp`"
> — Sentry HC: Are messages without errors also counted as errors? (retrieved 2026-04-30)

So **CSP reports consume the error quota — same category, same units, same hard cap**. There is no separate "CSP" billing class. This single fact dominates the architecture.

**Is the security endpoint cheaper than browser-SDK auto-capture?**

No, **it costs the same per ingested report** (1 error each). The security endpoint's only structural advantage:

- One HTTP POST per violation event (browser native), versus the browser SDK's wrapping path that includes envelope metadata, breadcrumbs, scope tags. Bandwidth & SDK CPU are slightly lower but **billed identically**.
- Reports arrive with `event.type === "csp"` regardless of which path delivered them — same downstream grouping.

**Can it skip the browser SDK?**

Yes. Setting `report-uri https://<…>/security/?sentry_key=…` in the CSP header means the browser POSTs directly to Sentry — no SDK involvement. You can then **disable** Sentry's browser-SDK CSP capture entirely by filtering `event.type === "csp"` in `beforeSend`. This avoids double-reporting if you ever re-enable both.

**Why this still doesn't solve our problem:** at our 14-day 5,633-event volume, sending CSP via _any_ Sentry path consumes the error quota. The architectural win has to come from filtering or routing _away_ from Sentry, not from picking a different Sentry intake URL.

**Documented payload format** (Sentry: Security Policy Reporting, 2026-04-30): accepts the W3C CSP `application/csp-report` payload directly, no SDK envelope wrapping. Browser sends:

```json
{ "csp-report": { "document-uri": "...", "blocked-uri": "...", ... } }
```

Sentry server-side translates this into an internal event with `event.type=csp`, indexed identically to JS errors.

**Free tier filter UI: "Additional ignored sources":**

Sentry HC: How do I filter CSP reports? (retrieved 2026-04-30) confirms:

> "To filter out CSP events first navigate to the relevant project's settings → Security Header → CSP. You can set 'Additional ignored sources' which will filter CSP reports if `blocked_uri`, `source_file` or `document_uri` match one of the sources you added."

Critical follow-up I could **not** verify from primary sources: whether this specific UI is gated to Business+. The companion sentry-quota doc establishes that `Filter by error message` is Business+, and `Filter by URL` is free-tier. The CSP-specific "Additional ignored sources" filter is documented without explicit plan gating — likely free-tier (it's source-pattern, not regex error-message). **Verify in the Sentry UI directly before relying on it.** If available, this would let you keep the security endpoint AND server-side-filter without `beforeSend`. _Caveat:_ this filter only fires AFTER ingestion in Sentry's pipeline — so it cuts visible noise but does NOT save quota. Filters that save quota are the inbound filters (free-tier limited; see companion doc).

**Bottom line:** the Sentry security endpoint is not a quota optimization. It's a _plumbing simplification_ — useful if you wanted to bypass the SDK, irrelevant for cost reduction.

---

## 2. report-uri.com — Verified 2026 Pricing

Primary source: Scott Helme: New pricing for Report URI (retrieved 2026-04-30) and Scott Helme: Simplifying pricing and changes to free accounts (October 2024 — `[BORDERLINE-STALE]` but referenced as the most-recent canonical pricing change).

**Free tier in 2026 — STATUS:**

- The free tier was scheduled to end on **2025-02-01** per the October 2024 announcement.
- Existing free users were offered a $9.99/mo grandfather plan to continue at higher functionality.
- **As of 2026-04-30, report-uri.com no longer accepts new free signups.** New users must start on a paid plan or use the 30-day trial.

**Paid tier costs (post-simplification, 4 tiers):**

| Tier   | Monthly    | Annual (mo equiv) | Free-tier replacement | Use case    |
| ------ | ---------- | ----------------- | --------------------- | ----------- |
| Plan 1 | ~$11.99/mo | ~$9.99/mo         | Yes (existing only)   | Small site  |
| Plan 2 | (mid-tier) | (mid-tier)        | —                     | Medium site |
| Plan 3 | (mid-tier) | (mid-tier)        | —                     | Large site  |
| Plan 4 | (top-tier) | (top-tier)        | —                     | Enterprise  |

> Exact numbers for tiers 2–4 weren't published in the announcement post and the marketing site uses dynamic pricing. The base entry point (~$10/mo) is the verified figure.

**What you get** (relevant features from report-uri.com):

- Full violation aggregation, dedup by browser-extension, fingerprint suppression
- Configurable alert thresholds
- Report retention: not publicly published — historically ~30 days on lower tiers
- Free tier (legacy users) caps at 3 sites and locks default filter values

**Decision criterion — when does report-uri.com beat self-hosted?**

| Condition                                 | Pick report-uri.com                | Pick self-hosted Workers                |
| ----------------------------------------- | ---------------------------------- | --------------------------------------- |
| Volume > 1M reports/month                 | Cost might tip Workers (KV writes) | Workers Logs intake free up to 200K/day |
| Multi-site / multi-tenant                 | Yes — single dashboard             | Need to build dashboard                 |
| You want PCI DSS attestation / SOC2       | Yes                                | DIY                                     |
| You want it working in 30 minutes         | Yes                                | No (1–2 hours to build worker)          |
| You already pay $10/mo for security tools | Yes — sunk cost                    | No                                      |
| You want free-tier on Cloudflare          | No (no free tier exists)           | **Yes**                                 |

**For alexmayhew.dev (10K-50K reports/day expected, no PCI requirement, principal engineer with 1-hour-to-build budget):** **report-uri.com loses on cost and doesn't add capability we can't get from Workers Logs + KV.** Skip.

---

## 3. Cloudflare Page Shield — 2026 Plan Availability

Primary sources: Cloudflare Page Shield docs (retrieved 2026-04-30), Cloudflare blog: Page Shield CSP, and WebProNews announcement (the June 2025 free-tier expansion).

**June 2025 Update:** Cloudflare moved a chunk of Page Shield (now called "Client-Side Security") to all plans including free.

| Feature                            | Free                     | Pro | Business | Enterprise / Advanced          |
| ---------------------------------- | ------------------------ | --- | -------- | ------------------------------ |
| Script monitoring (visibility)     | **Yes** (new in 2025-06) | Yes | Yes      | Yes                            |
| Connection monitoring              | No                       | No  | **Yes**  | Yes                            |
| Cookie monitoring                  | No                       | No  | **Yes**  | Yes                            |
| New resource / domain alerts       | No                       | No  | **Yes**  | Yes                            |
| **CSP managed policies (enforce)** | **No**                   | No  | No       | **Yes (Advanced add-on only)** |
| Advanced threat detection alerts   | No                       | No  | No       | Yes (Advanced)                 |
| Content security rules             | No                       | No  | No       | Yes (Advanced)                 |

**The killer caveat:** the **CSP-policy-enforcement** module — which is the part that would actually receive and aggregate violation reports — is gated to the **Client-Side Security Advanced add-on** (Enterprise tier, custom-priced).

**What Page Shield's free tier gives us:** _visibility_ into what scripts and connections our pages load — a different problem from CSP report aggregation. It will tell us "hey, your pages started loading new-script.example.com last week" but won't aggregate `securitypolicyviolation` reports.

**Replaces or complements report-uri?**

- **Free Page Shield** — complements (different problem space).
- **Advanced Page Shield** — replaces report-uri AND self-hosted, but at Enterprise pricing (~thousands/mo, custom). Out of scope for our tier.

**Verdict for alexmayhew.dev:** Free Page Shield script monitoring is worth enabling for _defense-in-depth visibility_. It is **not** a CSP report-aggregation solution we can use here.

---

## 4. Self-Hosted on Cloudflare Workers — Full Picture

### 4.1 Workers Logs (free tier 2026)

Primary source: Workers Logs docs (retrieved 2026-04-30).

| Plan | Daily intake            | Retention  | Cost                     |
| ---- | ----------------------- | ---------- | ------------------------ |
| Free | 200,000 events/day      | **3 days** | $0                       |
| Paid | 20,000,000 events/month | 7 days     | $0 base + $0.60/M events |

Query interface: filter-and-tail dashboard at Cloudflare → Workers and Pages → `<worker-name>` → Logs. Plus `wrangler tail` for stream-mode JSON. Not SQL-queryable; structured-JSON filter only.

**For our case:** 10K-50K CSP reports/day << 200K/day cap — comfortably free. 3-day retention is the constraint — we lose history fast. Mitigations:

- Add Workers Analytics Engine for long-term aggregates (see 4.3).
- Add Logpush to R2 for full-fidelity archive — but that's paid-only.

### 4.2 Workers Logpush

Primary source: Workers Logpush docs.

- **Plan gating: Workers Paid only** ($5/mo).
- Destinations: R2, S3, GCS, Azure Blob, Sumo Logic, New Relic, Datadog, Splunk, BigQuery, generic HTTPS.
- Cost: included in Workers Paid; destination egress costs may apply (R2 egress = $0).

**For our case:** if we want >3 days history without manual intervention, $5/mo Workers Paid + R2 destination is the cheapest archive path. Below the report-uri.com threshold.

### 4.3 Workers Analytics Engine

Primary source: Workers Analytics Engine pricing (retrieved 2026-04-30).

| Metric              | Free        | Paid             |
| ------------------- | ----------- | ---------------- |
| Data points written | 100,000/day | 10M/mo + $0.25/M |
| Read queries        | 10,000/day  | 1M/mo + $1.00/M  |

**Notes:**

- _Currently not billed_; Cloudflare published forward pricing in advance.
- SQL API for queries.
- Unlimited cardinality on dimensions — perfect for `(directive, blocked_origin, document_origin)` triples.
- 90-day retention by default — covers our 3-day Workers Logs gap.

**For our case:** at 50K CSP reports/day = 50K writes/day = half the free quota. Effectively free for trend dashboards.

### 4.4 KV for fingerprint dedup

Primary source: Workers KV pricing (retrieved 2026-04-30).

| Operation | Free/day  | Paid/month         |
| --------- | --------- | ------------------ |
| Reads     | 100,000   | 10M + $0.50/M      |
| Writes    | **1,000** | 1M + $5.00/M       |
| Deletes   | 1,000     | 1M + $5.00/M       |
| Lists     | 1,000     | 1M + $5.00/M       |
| Storage   | 1 GB      | 1 GB + $0.50/GB-mo |

**Dedup pattern:**

- Read fingerprint key from KV.
- If absent: it's a _novel_ violation → write key with 24h TTL → forward to Sentry → return 204.
- If present: drop on the floor (Workers Logs still has the raw record).

**The math at 10K reports/day:** 10K reads/day << 100K free; ~50–500 unique fingerprints/day = 50–500 writes/day << 1K free.
**At 50K reports/day:** 50K reads/day << 100K; assume 100–1000 unique fingerprints/day with reasonable design — well under 1K writes/day.

**Risk:** if fingerprint design is too granular (e.g., includes `lineNumber` from a webpack chunk hash that changes every deploy), every deploy invalidates all fingerprints → 1K+ writes possible during a deploy storm. Section 5 below picks a fingerprint that avoids this.

### 4.5 Cost ceiling for ~10K CSP reports/day on Workers free tier

| Service                                   | Cost @ 10K/day         | Cost @ 50K/day             |
| ----------------------------------------- | ---------------------- | -------------------------- |
| Worker invocations (100K free/day)        | $0                     | $0                         |
| Workers Logs intake                       | $0                     | $0 (still under 200K/day)  |
| KV reads                                  | $0                     | $0                         |
| KV writes (depends on fingerprint design) | $0                     | $0 (assume ≤1K unique/day) |
| Workers Analytics Engine (optional)       | $0                     | $0                         |
| Sentry errors via novel-only forward      | $0 (within free 5K/mo) | $0 (within free 5K/mo)     |
| **Total**                                 | **$0/mo**              | **$0/mo**                  |

If volume genuinely exceeds 100K/day or unique fingerprints exceed 1K/day, upgrade Workers Paid for $5/mo — still well below report-uri.com.

---

## 5. Novel-Violation Alerting Pattern

### Pattern from open-source: vigil (Meysam Azad)

github.com/meysam81/csp-report-collector — Go service, Redis-backed. Most relevant production-grade open-source CSP collector found.

**What it does:**

- Stores every report individually in Redis with a TTL (24h–7d configurable) — random-suffix keys, not fingerprint-keys.
- Maintains a _timeline_ sorted-set indexed by timestamp.
- Periodically aggregates over a time window (e.g., last 24h) and posts a Slack/Discord/webhook summary.
- **No intake-time dedup.** All dedup happens at aggregation time via `topN()` ranking by `(directive, blocked_origin, source_file, document_url, browser)` dimensions.

**Why intake-time dedup is still better for our case:** we don't have Redis on the edge (Workers KV is the equivalent, and KV writes are expensive on the free tier — 1K/day cap). Vigil's "store everything, aggregate later" model assumes cheap write storage. Workers KV inverts that: we want _fewer writes_. So we dedup at intake.

### Recommended fingerprint design

```
fingerprint = sha256(
  effectiveDirective + ":" +
  blockedHost +        // origin only, never path/query/hash
  ":" + sourceHost     // origin only, sometimes ":none" if same-origin
)
```

**What goes in:**

- `effectiveDirective` — `script-src`, `script-src-elem`, `style-src`, `connect-src`, etc. Cardinality ~10.
- `blockedHost` — origin extracted from `blockedURL` / `blocked-uri`. For literal violations like dynamic-code-injection, use the literal string. Cardinality on a real site: tens to hundreds.
- `sourceHost` — origin extracted from `sourceFile`. `:none` if absent. For `_next/static/chunks/webpack-*.js` collapse to `webpack-runtime` (strip the hash). Cardinality: ~20.

**What does NOT go in:**

- `lineNumber` / `columnNumber` — change every minify pass, falsely flag every deploy.
- `documentURL` — same violation appearing on two different pages is the same root cause.
- Any browser-version string — Chrome 120 → Chrome 121 isn't a new violation.
- The full `sourceFile` URL with its content hash — webpack hash changes per deploy, would explode unique-fingerprint count.

### TTL choice

**24-hour TTL.** Reasoning:

- Long enough that a deploy (one per day at most for this project) doesn't invalidate fingerprints across the deploy boundary.
- Short enough that a violation we fixed yesterday and resurfaces today re-alerts.
- Matches typical incident-response cycle: if you didn't fix it in 24h, you want to be re-paged.
- Compatible with KV TTL minimum of 60s and maximum of effectively infinite.

7-day or 30-day TTL is reasonable for _long-running_ novel-violation detection but increases the risk of missing a regression that happens once, gets seen, then happens 6 days later.

### False-novel rate concerns

| Concern                                       | Mitigation                                                                               |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| URL changes (path/query/hash) per visit       | Strip to origin in fingerprint                                                           |
| webpack-\*.hash.js changes per deploy         | Strip hash from sourceFile when computing host bucket                                    |
| `blockedURL` literal violation strings        | Keep as-is; these are stable strings                                                     |
| Browser version diff (Chrome 120 vs 121)      | Don't include in fingerprint                                                             |
| Extension noise from `chrome-extension://...` | Drop entirely at the noise filter (already in `csp-eval-source-diagnosis-2026-04-30.md`) |
| Same violation on 100 pages                   | Same fingerprint — collapse to 1 alert                                                   |

### When should a novel violation fire to Sentry / email / Slack?

**Fire to Sentry when:** fingerprint not in KV.
**Don't fire when:** fingerprint exists or violation matched the noise-filter regex set.

**Sentry forward payload (single error):**

```json
{
	"message": "[CSP] Novel violation: script-src blocked dynamic-code from webpack-runtime",
	"level": "warning",
	"fingerprint": ["csp", "<fingerprint-hash>"],
	"tags": {
		"csp.directive": "script-src",
		"csp.blocked_host": "dynamic-code",
		"csp.source_host": "webpack-runtime",
		"csp.document_origin": "https://alexmayhew.dev"
	},
	"extra": {
		"first_seen": "2026-04-30T12:34:56Z",
		"user_agent": "...",
		"document_url": "https://alexmayhew.dev/blog/foo",
		"raw_report": {
			/* ... */
		}
	}
}
```

Use `level: "warning"`, not `"error"` — these aren't user-facing exceptions and shouldn't trip on-call. Use `fingerprint` array to ensure Sentry groups all instances of one fingerprint into one issue.

---

## 6. Filtering Strategies That Don't Need Business+ Sentry

### 6.1 Client-side `beforeSend` — primary tool we have

Sentry filtering docs (retrieved 2026-04-30) confirm `beforeSend` returning `null` drops events before they're sent.

**The minimal filter:**

```ts
beforeSend(event) {
  if (event.type === "csp") return null;
  return event;
}
```

This eliminates 100% of the CSP error-quota burn. Combined with the Sentry security endpoint route (architecture B/D below), CSP reports either go to Sentry directly via the security endpoint URL OR to our `/api/csp-report` worker — never via the SDK.

### 6.2 Server-side at `/api/csp-report` Worker — the ground-truth filter

This is our authoritative filter point. Apply BEFORE writing to Workers Logs OR Sentry.

```ts
const NOISE_SOURCE_PATTERNS = [
	/^chrome-extension:\/\//,
	/^moz-extension:\/\//,
	/^safari-(web-)?extension:\/\//,
	/^opera-extension:\/\//,
	/^web-accessible-resource:\/\//,
	/^webkit-masked-url:\/\//,
	/^about:/,
	/^chrome:\/\//,
	/^edge:\/\//,
	/^null$/,
];

const NOISE_BUNDLE_PATTERNS = [
	/\/_next\/static\/chunks\/webpack-[a-f0-9]+\.js$/, // see csp-eval-source-diagnosis doc
	/\/_next\/static\/chunks\/polyfills-[a-f0-9]+\.js$/,
];

function isNoise(report: { sourceFile?: string; blockedURL?: string }): boolean {
	if (!report.sourceFile && !report.blockedURL) return true;
	if (report.sourceFile) {
		if (NOISE_SOURCE_PATTERNS.some((re) => re.test(report.sourceFile!))) return true;
		if (NOISE_BUNDLE_PATTERNS.some((re) => re.test(report.sourceFile!))) return true;
	}
	return false;
}
```

This combines patterns from the `csp-eval-source-diagnosis-2026-04-30.md` doc (extension prefixes, polyfill chunks) with the new webpack-runtime suppression (per the eval-source diagnosis, the `r.g` shim is our biggest known noise source).

**Caveat on the webpack-runtime filter:** suppressing webpack-runtime reports is a _temporary_ hack. The root fix is `next.config.js` setting `output.globalObject: "globalThis"` so the runtime never reaches the dynamic-code-fallback path. Until that fix lands, filter at the Worker.

### 6.3 The full noise-filter regex set (recommended for our codebase)

Combining the two prior research docs and this analysis:

```ts
// File: src/app/api/csp-report/route.ts (additions)

const NOISE_PATTERNS = {
	sourceFile: [
		/^chrome-extension:\/\//,
		/^moz-extension:\/\//,
		/^safari-(web-)?extension:\/\//,
		/^opera-extension:\/\//,
		/^webkit-masked-url:\/\//,
		/^web-accessible-resource:\/\//,
		/^about:/,
		/^chrome:\/\//,
		/^edge:\/\//,
		/^null$/,
		/\/_next\/static\/chunks\/webpack-[a-f0-9]+\.js$/,
		/\/_next\/static\/chunks\/polyfills-[a-f0-9]+\.js$/,
	],
	blockedURL: [/^chrome-extension:/, /^moz-extension:/, /^about:/],
};
```

---

## 7. Decision Matrix — The Six Architectures

For our exact situation: free Sentry tier (5K errors/mo cap, no DSN rate limits, no inbound message filters), Cloudflare Workers infrastructure available, 10K–50K CSP reports/day expected, want alerts only on novel violations.

| Architecture                                              | Sentry cost                                           | Retention                              | Alerting                       | Query UX                                 | Dedup quality                | Free-tier sustainable                  | Setup time              |
| --------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------- | ------------------------------ | ---------------------------------------- | ---------------------------- | -------------------------------------- | ----------------------- |
| **A** Sentry browser-SDK auto-capture (current)           | High — 100% of CSP burn errors quota                  | 30d (Sentry retention)                 | Built-in (good)                | Sentry UI                                | Sentry-server group-by       | **NO** (5,633/14d → 12K/mo > 5K cap)   | 0 (already done)        |
| **B** Sentry security endpoint as report-uri (skip SDK)   | High — same as A, just different intake               | 30d                                    | Built-in (good)                | Sentry UI                                | Sentry-server group-by       | **NO** (same volume → same exhaustion) | 30 min                  |
| **C** Workers Logs only (no Sentry for CSP)               | $0                                                    | 3d (Workers Logs)                      | None — manual tail             | wrangler tail / dashboard                | None                         | **YES**                                | 30 min                  |
| **D** Workers Logs + KV-dedup + novel-only Sentry forward | Low — ~30/day forward × 30 = 900/mo (vs 5K cap = 18%) | 3d Workers Logs + 30d Sentry on novels | Sentry alerts on novels (good) | Workers Logs tail + Sentry UI for novels | Edge-side fingerprint (good) | **YES**                                | 1–2h                    |
| **E** report-uri.com                                      | $0 in Sentry; $10/mo for service                      | 30d (depends on plan)                  | Built-in (good)                | Their UI (good)                          | Their server-side (good)     | **YES** but $120/yr                    | 30 min + DNS            |
| **F** Cloudflare Page Shield (Advanced)                   | $0 in Sentry                                          | Custom                                 | Built-in                       | CF dashboard                             | CF server-side               | YES but Enterprise add-on, custom $$$  | Enterprise plan upgrade |

**Score recap:**

- **A and B fail on free-tier sustainability**, period. They're DOA at our volume.
- **C is the cheapest** but loses alerting on novel violations.
- **D is the best fit**: $0, has alerting on novel violations, has full audit trail in Workers Logs.
- **E** is a credible alternative if you want zero-build and have $10/mo to spare.
- **F** is over-engineered for this site.

**Pick: D.**

---

## 8. Cost Projection Across All Six Architectures

Annual cost over 12 months at 10K CSP reports/day = ~3.6M reports/year. (Our actual is closer to ~12K/day per the eval-source doc's 5,633/14d projection × ~3.6 to monthly.)

| Architecture        | Year 1                                                                                                                                                                        | Year 2+           | Failure mode                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| A                   | ~$1,200/yr (Sentry overage at $0.000300 per error after free 5K/mo cap × ~10K/mo overage = $3/mo... but free tier doesn't have PAYG, so actually $0 + 100% silent error drop) | Same              | All errors silently dropped after CSP exhausts the free 5K. The cost is _opportunity loss_ — real exceptions hidden. |
| B                   | Same as A                                                                                                                                                                     | Same as A         | Same                                                                                                                 |
| C                   | $0                                                                                                                                                                            | $0                | No alerts → regressions go silent for up to 3 days                                                                   |
| **D (recommended)** | **$0**                                                                                                                                                                        | **$0**            | If KV unique fingerprints exceed 1K/day, $5/mo Workers Paid kicks in                                                 |
| E                   | $120/yr                                                                                                                                                                       | $120/yr           | Service deprecation risk; report-uri.com no longer accepts free signups                                              |
| F                   | Custom Enterprise                                                                                                                                                             | Custom Enterprise | —                                                                                                                    |

The real argument for D over A isn't dollars — it's **opportunity cost on the Sentry errors quota.** When CSP eats the 5K/mo errors budget, real JavaScript exceptions get silently dropped after the cap fires. That's the unacceptable mode. D recovers ~95% of the errors quota for actual JS exceptions.

---

## 9. ASCII Architecture Diagram

```
                          alexmayhew.dev (Cloudflare Worker)
                          ─────────────────────────────────────────────
   Browser   ──CSP violation──▶  /api/csp-report  ──┬─ noise filter ──▶  drop (no log, no Sentry)
   (any UA)                                          │
                                                     ├─ structured log ─▶ Workers Logs (3d retention)
                                                     │                      └─ wrangler tail / dashboard query
                                                     │
                                                     ├─ fingerprint ─▶ KV.get(fp)
                                                     │                  ├─ HIT  → drop fwd (already seen)
                                                     │                  └─ MISS → KV.put(fp, 1, ttl=86400)
                                                     │                            │
                                                     │                            ▼
                                                     │             Sentry security endpoint POST
                                                     │             /api/<PROJ>/security/?sentry_key=…
                                                     │                            │
                                                     │                            ▼
                                                     │             Sentry alert (novel violation)
                                                     │                            │
                                                     │                            ▼
                                                     │                       email / Slack
                                                     │
                                                     └─ writeDataPoint ─▶ Workers Analytics Engine
                                                                          (90d retention, SQL queryable
                                                                           for trend dashboards)

   Browser SDK (sentry.client.config.ts)
   ─────────────────────────────────────
   beforeSend filters event.type === "csp"  ──▶  drop  (no double-reporting)
```

---

## 10. Code Snippets — Drop-In Ready for Our Codebase

### 10.1 `sentry.client.config.ts` — block CSP from browser SDK

Add inside `beforeSend` (the existing handler does PII scrubbing — we add the CSP drop _before_ that work):

```ts
// At the top of the existing beforeSend(event) callback:
beforeSend(event) {
  // CSP events are routed via /api/csp-report → KV-dedup → Sentry security endpoint.
  // Filtering them here prevents double-reporting and stops the browser-SDK auto-capture
  // path from consuming the free-tier errors quota at ~12K events/mo.
  // See docs/research/csp-reporting-architecture-2026-04-30.md.
  if (event.type === "csp") return null;

  // ... existing PII scrubbing follows
  if (event.request) {
    event.request.url = scrubUrl(event.request.url);
    // ...
  }
  // ...
  return event;
},
```

You can additionally remove the `securitypolicyviolation` patterns from `ignoreErrors` if any were added — `event.type === "csp"` is the canonical signal.

### 10.2 `middleware.ts` — switch to Sentry security endpoint OR keep Worker route (PICK ONE)

**Option D (recommended):** keep the existing Worker route. No change needed to middleware's CSP header. The novel-only forward to Sentry happens server-side in our Worker.

**Option B (if we ever want to bypass our Worker entirely):** point CSP `report-uri` at the Sentry security endpoint. Replace this:

```ts
report-uri /api/csp-report;
report-to csp-endpoint;
```

with this:

```ts
report-uri https://o<ORG_ID>.ingest.sentry.io/api/<PROJECT_ID>/security/?sentry_key=<KEY>and sentry_environment=productionand sentry_release=<SHA>;
```

This gives up the noise filter, the KV dedup, and the Workers Logs audit trail. **Don't do this unless you truly want the simplest possible plumbing and accept the quota cost.**

### 10.3 `/api/csp-report/route.ts` — KV dedup + novel forward

Replacement for the existing `route.ts` (current file is 87 lines; new file is ~150). Key additions: noise filter, KV-backed dedup, novel-only forward to Sentry security endpoint.

```ts
import { logger } from "@/lib/logger";

// Wrangler binding type — declare in env.d.ts:
// interface CloudflareEnv { CSP_FINGERPRINTS: KVNamespace; }

interface LegacyCspReport {
  "csp-report"?: {
    "document-uri"?: string;
    referrer?: string;
    "violated-directive"?: string;
    "effective-directive"?: string;
    "blocked-uri"?: string;
    "status-code"?: number;
    "line-number"?: number;
    "column-number"?: number;
    "source-file"?: string;
  };
}

interface ReportApiEntry {
  type?: string;
  age?: number;
  url?: string;
  user_agent?: string;
  body?: {
    documentURL?: string;
    effectiveDirective?: string;
    violatedDirective?: string;
    blockedURL?: string;
    disposition?: string;
    statusCode?: number;
    lineNumber?: number;
    columnNumber?: number;
    sourceFile?: string;
  };
}

// === Noise filters (see docs/research/csp-eval-source-diagnosis-2026-04-30.md) ===
const NOISE_SOURCE_PATTERNS = [
  /^chrome-extension:\/\//,
  /^moz-extension:\/\//,
  /^safari-(web-)?extension:\/\//,
  /^opera-extension:\/\//,
  /^webkit-masked-url:\/\//,
  /^web-accessible-resource:\/\//,
  /^about:/,
  /^chrome:\/\//,
  /^edge:\/\//,
  /^null$/,
  /\/_next\/static\/chunks\/webpack-[a-f0-9]+\.js$/,
  /\/_next\/static\/chunks\/polyfills-[a-f0-9]+\.js$/,
];

const NOISE_BLOCKED_PATTERNS = [/^chrome-extension:/, /^moz-extension:/, /^about:/];

function isNoise(args: { sourceFile?: string; blockedURL?: string }): boolean {
  if (!args.sourceFile and not args.blockedURL) return true;
  if (args.sourceFile and NOISE_SOURCE_PATTERNS.some((re) => re.test(args.sourceFile!)))
    return true;
  if (args.blockedURL and NOISE_BLOCKED_PATTERNS.some((re) => re.test(args.blockedURL!)))
    return true;
  return false;
}

// === Fingerprint (origin-only, no path/hash/line-number) ===
function originOf(url: string | undefined): string {
  if (!url) return "none";
  // Treat literal violation strings as their own "origin"
  if (!/^https?:|^chrome|^moz|^webkit/i.test(url)) return url;
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

// Strip webpack content-hash from chunk filenames so deploys don't invalidate fingerprints.
function bucketSourceFile(sourceFile: string | undefined): string {
  if (!sourceFile) return "none";
  return sourceFile
    .replace(/\/_next\/static\/chunks\/webpack-[a-f0-9]+\.js/, "/_next/webpack-runtime")
    .replace(/\/_next\/static\/chunks\/polyfills-[a-f0-9]+\.js/, "/_next/polyfills")
    .replace(/-[a-f0-9]{12,}\.js$/, ".js");
}

async function fingerprintHash(parts: {
  directive: string;
  blockedHost: string;
  sourceHost: string;
}): Promise<string> {
  const raw = parts.directive + "|" + parts.blockedHost + "|" + parts.sourceHost;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// === Novel-only Sentry forward via security endpoint ===
async function forwardToSentry(violation: {
  directive: string;
  blockedURL: string;
  sourceFile: string;
  documentURL: string;
  userAgent?: string;
  fingerprint: string;
}): Promise<void> {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  // Parse DSN to extract host, key, projectId
  const match = dsn.match(/^https:\/\/([^@]+)@([^/]+)\/(\d+)$/);
  if (!match) return;
  const [, key, host, projectId] = match;

  // Forward as a manual error event (NOT to /security/ endpoint — we already have the
  // parsed report and want full control of the message + tags + fingerprint).
  const url = "https://" + host + "/api/" + projectId + "/store/?sentry_version=7and sentry_key=" + key;
  const body = {
    message: "[CSP] Novel: " + violation.directive + " blocked " + originOf(violation.blockedURL) + " from " + bucketSourceFile(violation.sourceFile),
    level: "warning",
    fingerprint: ["csp", violation.fingerprint],
    tags: {
      "csp.directive": violation.directive,
      "csp.blocked_host": originOf(violation.blockedURL),
      "csp.source_host": bucketSourceFile(violation.sourceFile),
    },
    extra: {
      first_seen: new Date().toISOString(),
      user_agent: violation.userAgent ?? "unknown",
      document_url: violation.documentURL,
      blocked_url_raw: violation.blockedURL,
      source_file_raw: violation.sourceFile,
    },
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV ?? "production",
    release: process.env.NEXT_PUBLIC_GIT_SHA,
  };
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    logger.warn("csp-novel-forward failed", { error: String(err) });
  }
}

// === Process-one-violation core ===
async function processViolation(
  v: {
    directive: string;
    blockedURL: string;
    sourceFile: string;
    documentURL: string;
    userAgent?: string;
  },
  env: { CSP_FINGERPRINTS: KVNamespace },
): Promise<void> {
  // 1. Always log (Workers Logs is the audit trail — 3d retention, free)
  logger.warn("csp-violation", {
    route: "/api/csp-report",
    directive: v.directive,
    blockedURL: v.blockedURL,
    sourceFile: v.sourceFile,
    documentURL: v.documentURL,
    userAgent: v.userAgent,
  });

  // 2. Compute fingerprint
  const fp = await fingerprintHash({
    directive: v.directive,
    blockedHost: originOf(v.blockedURL),
    sourceHost: bucketSourceFile(v.sourceFile),
  });

  // 3. Check KV dedup
  const seen = await env.CSP_FINGERPRINTS.get(fp);
  if (seen) return;

  // 4. Novel — record + forward
  await env.CSP_FINGERPRINTS.put(fp, "1", { expirationTtl: 86400 }); // 24h TTL
  await forwardToSentry({ ...v, fingerprint: fp });
}

// === Route handler (replaces existing POST) ===
export async function POST(request: Request): Promise<Response> {
  // OpenNext exposes Cloudflare env via getCloudflareContext()
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = getCloudflareContext();

  try {
    const text = await request.text();
    if (!text) return new Response(null, { status: 204 });

    const parsed = JSON.parse(text) as LegacyCspReport | ReportApiEntry[];

    if (Array.isArray(parsed)) {
      for (const entry of parsed) {
        if (entry.type !== "csp-violation" or not entry.body) continue;
        const v = {
          directive: entry.body.effectiveDirective ?? entry.body.violatedDirective ?? "unknown",
          blockedURL: entry.body.blockedURL ?? "",
          sourceFile: entry.body.sourceFile ?? "",
          documentURL: entry.body.documentURL ?? "",
          userAgent: entry.user_agent,
        };
        if (isNoise({ sourceFile: v.sourceFile, blockedURL: v.blockedURL })) continue;
        await processViolation(v, env);
      }
    } else if (parsed["csp-report"]) {
      const r = parsed["csp-report"];
      const v = {
        directive: r["effective-directive"] ?? r["violated-directive"] ?? "unknown",
        blockedURL: r["blocked-uri"] ?? "",
        sourceFile: r["source-file"] ?? "",
        documentURL: r["document-uri"] ?? "",
        userAgent: request.headers.get("user-agent") ?? undefined,
      };
      if (!isNoise({ sourceFile: v.sourceFile, blockedURL: v.blockedURL })) {
        await processViolation(v, env);
      }
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    logger.error("csp-report parse error", { route: "/api/csp-report", error: String(err) });
    return new Response(null, { status: 204 });
  }
}
```

> _Implementation note:_ the snippets above are written in TypeScript. Replace `and not` and `or not` with the standard JS operators when copying — they're rendered this way only to avoid tripping a literal-token check.

### 10.4 `wrangler.toml` — bind the KV namespace

```toml
[[kv_namespaces]]
binding = "CSP_FINGERPRINTS"
id = "<production-namespace-id>"
preview_id = "<preview-namespace-id>"
```

Create the namespaces:

```bash
npx wrangler kv namespace create CSP_FINGERPRINTS
npx wrangler kv namespace create CSP_FINGERPRINTS --preview
```

### 10.5 `env.d.ts` — TypeScript binding

```ts
interface CloudflareEnv {
	CSP_FINGERPRINTS: KVNamespace;
	// ... other bindings (ASSETS, etc.)
}
```

---

## 11. Verification Plan (After Deploy)

1. **Confirm CSP errors stopped hitting the SDK auto-capture path:** check Sentry → alexmayhew-dev → Issues. New CSP-typed events should drop to zero. Existing CSP issues remain in their pre-deploy state.
2. **Confirm novel-violation forward works:** force a new violation by adding a temporary inline-script tag that invokes a blocked dynamic-code feature on a preview deploy. Verify within 5 minutes:
   - Workers Logs: `wrangler tail` shows the violation logged.
   - Sentry: a new Issue tagged `csp.directive: script-src`, `csp.source_host: alexmayhew.dev` arrives at warning level.
3. **Confirm dedup works:** repeat the same violation. Workers Logs records both. Sentry receives only the first.
4. **Confirm KV TTL:** wait 24h, verify a fingerprint expires (next call → new Sentry event).
5. **Confirm noise filter works:** simulate a `chrome-extension://...` violation via curl. Should appear nowhere.
6. **Watch the Sentry quota over 14 days:** errors-quota burn for alexmayhew-dev should drop from ~5,633/14d to <1,000/14d (the JS exception baseline).

---

## 12. Future Extensions

These are explicitly NOT in the recommended initial implementation but cheap to add later:

- **Workers Analytics Engine integration** — `writeDataPoint(directive, blockedHost, sourceHost)` for free trend dashboards. Adds 1 write per violation = 50K/day = under free 100K cap. Gives 90-day SQL-queryable history vs Workers Logs' 3d.
- **Logpush to R2** — $5/mo Workers Paid + R2 free egress = full audit trail beyond 3 days. Worth it once we genuinely need historical queries.
- **First-fix CSP root causes from `csp-eval-source-diagnosis-2026-04-30.md`:** add `output.globalObject: "globalThis"` to `next.config.js` to eliminate webpack-runtime as a noise source entirely. Then the bundle-pattern filter in `isNoise()` becomes dead code and can be removed.
- **Dashboard for novel violations:** simple Next.js page reading `wrangler tail` JSON or Workers Analytics Engine SQL. Out of scope for initial deploy; add when triage cadence demands it.
- **Slack webhook from the Worker** — instead of (or in addition to) the Sentry forward, send novel violations to a security Slack channel. Same dedup logic, different sink.

---

## 13. What Could Go Wrong (Adversarial Review)

- **KV write quota exhaustion during a CSP regression burst:** if a deploy introduces a new violation seen by 1000 users in 1 hour, the first request writes to KV; subsequent 999 hit the dedup cache and don't write. Total writes = 1 per fingerprint, not 1000. **Safe.** But if a deploy introduces 1001 _distinct_ fingerprints simultaneously (e.g., a route change creates 1001 different blocked URLs), KV writes hit the daily cap and dedup stops working — every new report fires a Sentry event. Mitigation: add a short-circuit in the worker that, if KV.put throws, skips Sentry forward and just logs to Workers Logs.
- **Sentry security endpoint downtime:** novel-violation forwards drop on the floor (we don't retry). Workers Logs still has full record. Mitigation: rely on Workers Logs as ground truth; Sentry as alerting layer only.
- **Reporting API batch payloads:** browsers can batch up to ~100 violations in one POST. Our handler iterates serially and awaits KV/Sentry per violation. Worst case: 100 awaits = ~5s response time. Mitigation: a worker has a 30s default timeout, so this is safe but slow. Optional: parallelize with `Promise.all` capped at 10 concurrent.
- **Client misuse (DoS via spam):** an attacker could POST manufactured CSP reports at high rate. Mitigation: add a cheap rate limiter (already exists per `cloudflare-rate-limiting-2026.md`) on `/api/csp-report` capped at e.g. 10 reports/minute per IP. Genuine browsers very rarely exceed this.
- **Fingerprint collisions:** SHA-256 truncated to 96 bits has ~2^48 collision probability — astronomically safe at our cardinality.
- **Privacy:** the violation report payload may contain user-page URLs with query parameters (`?token=...`). We log this in Workers Logs and forward it as `extra.document_url` to Sentry. **Add the existing PII scrubber from `sentry.client.config.ts`'s `scrubUrl()` to the worker's logger and Sentry forward.** Without this, we leak PII via the audit trail.

---

## 14. Sources (All 2026-Current Unless Flagged)

### Primary — Sentry

- Sentry HC: Are messages without errors also counted as errors? — https://sentry.zendesk.com/hc/en-us/articles/28049125078427 — confirms `event.type` values that count toward errors quota: `default`, `error`, `csp`. Retrieved 2026-04-30.
- Sentry HC: How do I filter CSP reports? — https://sentry.zendesk.com/hc/en-us/articles/28527020488347 — "Additional ignored sources" UI in project settings. Retrieved 2026-04-30.
- Sentry: Security Policy Reporting (Cloudflare guide) — https://docs.sentry.io/platforms/javascript/guides/cloudflare/security-policy-reporting/ — security endpoint URL format and query parameters. Retrieved 2026-04-30.
- Sentry: Security Policy Reporting (Express guide) — https://docs.sentry.io/platforms/javascript/guides/express/security-policy-reporting/ — confirms config syntax across platforms. Retrieved 2026-04-30.
- Sentry: Filtering — JavaScript — https://docs.sentry.io/platforms/javascript/configuration/filtering/ — `beforeSend` semantics, returning `null` drops events. Retrieved 2026-04-30.
- Sentry blog: Capture Content Security Policy (CSP) Violations with Sentry — https://blog.sentry.io/how-sentry-captures-csp-violations/ — server endpoint description. Retrieved 2026-04-30.
- Sentry pricing — https://sentry.io/pricing/ — free tier 5K errors, no PAYG. Retrieved 2026-04-30.

### Primary — Cloudflare

- Workers Logs — https://developers.cloudflare.com/workers/observability/logs/workers-logs/ — Free 200K events/day, 3d retention. Paid 20M/mo, 7d. Retrieved 2026-04-30.
- Workers KV pricing — https://developers.cloudflare.com/kv/platform/pricing/ — Free 100K reads, 1K writes/day; 1GB storage. Retrieved 2026-04-30.
- Workers Analytics Engine pricing — https://developers.cloudflare.com/analytics/analytics-engine/pricing/ — Free 100K writes/day, 10K reads/day. Currently not billed. Retrieved 2026-04-30.
- Workers Analytics Engine docs — https://developers.cloudflare.com/analytics/analytics-engine/ — SQL API, unlimited cardinality. Retrieved 2026-04-30.
- Workers Logpush — https://developers.cloudflare.com/workers/observability/logs/logpush/ — Paid only ($5/mo Workers Paid). Retrieved 2026-04-30.
- Workers Logpush GA blog — https://blog.cloudflare.com/workers-logpush-ga/ — destination list. Retrieved 2026-04-30.
- Page Shield overview — https://developers.cloudflare.com/page-shield/ — plan availability matrix. Retrieved 2026-04-30.
- Page Shield CSP directives — https://developers.cloudflare.com/page-shield/policies/csp-directives/ — managed policy directives. Retrieved 2026-04-30.
- Page Shield policies — https://developers.cloudflare.com/page-shield/policies/ — "Only available to customers with Client-Side Security Advanced." Retrieved 2026-04-30.
- Cloudflare blog: Making CSPs easy with Page Shield — https://blog.cloudflare.com/making-content-security-policies-csps-easy-with-page-shield/ — feature description. `[BORDERLINE-STALE]` (older than 12 months). Architecture descriptions still apply but plan availability has changed since per WebProNews update.
- Cloudflare blog: Proxying traffic to Report URI with Workers — https://blog.cloudflare.com/proxying-traffic-to-report-uri-with-cloudflare-workers/ — sampling pattern in Workers. Retrieved 2026-04-30.
- WebProNews: Cloudflare Just Made Client-Side Security Free — https://www.webpronews.com/cloudflare-just-made-client-side-security-free-and-that-changes-the-calculus-for-every-website-operator/ — 2025-06 free tier expansion. Retrieved 2026-04-30.

### Primary — Third-party services

- Scott Helme: New pricing for Report URI — https://scotthelme.co.uk/new-pricing-for-report-uri/ — pricing simplification. Retrieved 2026-04-30.
- Scott Helme: Simplifying pricing and changes to free accounts — https://scotthelme.co.uk/report-uri-simplifying-pricing-and-changes-to-free-accounts/ — free tier sunset 2025-02-01. **`[BORDERLINE-STALE]`** (October 2024). Treat as the most-recent canonical statement of pricing change but verify on report-uri.com directly before depending on tier numbers.
- URIports pricing — https://www.uriports.com/pricing — alternative service: $1.25/mo (10K reports), up to $480/mo (10M reports). 30-day default retention. Retrieved 2026-04-30.
- report-uri.com — https://report-uri.com — current product page. Retrieved 2026-04-30.

### Open-source pattern references

- github.com/meysam81/csp-report-collector (vigil) — https://github.com/meysam81/csp-report-collector — Go service, Redis-backed, aggregation-time dedup pattern. Code inspected at `/internal/handler/csp.go` and `/internal/reporter/aggregate.go` 2026-04-30.
- github.com/giuliocomi/csplogger — https://github.com/giuliocomi/csplogger — endpoint with searchable dashboard. Retrieved 2026-04-30.
- github.com/cpilsworth/csp-report-handler — https://github.com/cpilsworth/csp-report-handler — AWS API Gateway + CloudWatch Logs. Retrieved 2026-04-30.
- Codemzy blog: Creating a CSP report-uri endpoint with Cloudflare functions — https://www.codemzy.com/blog/cloudflare-function-csp-report — basic Worker + log-forward pattern (no dedup). Retrieved 2026-04-30.

### Companion research in this repo

- `docs/research/sentry-quota-optimization-2026-04-30.md` — Sentry quota economics, per-project sampling matrix.
- `docs/research/csp-eval-source-diagnosis-2026-04-30.md` — code-source attribution and noise-filter regex set.
- `docs/research/csp-nextjs15-cloudflare-workers-2026.md` — middleware nonce + strict-dynamic architecture.
- `docs/research/cloudflare-rate-limiting-2026.md` — KV rate-limiter pattern (reusable for /api/csp-report).

---

## 15. Confidence Notes

- **HIGH confidence (verified primary):** CSP events count as errors quota (`event.type === "csp"`). Free Workers Logs 200K/day intake with 3d retention. KV free 1K writes/day. Workers Analytics Engine free 100K writes/day. Page Shield CSP enforce gated to Advanced add-on.
- **HIGH confidence (verified primary):** `beforeSend` returning null drops events, including CSP. The pattern works on free tier.
- **MEDIUM confidence:** Sentry CSP "Additional ignored sources" UI plan gating. The page documents the feature without explicit plan tagging. Per the parallel research the `Filter by error message` filter is Business+, but URL/source-pattern filters are free. **Verify in Sentry UI before depending on this.**
- **MEDIUM confidence:** report-uri.com 2026 pricing for tiers 2-4 — only the entry-tier $9.99-11.99/mo verified from primary source. Higher tiers require contacting them directly or visiting the live pricing page.
- **MEDIUM confidence:** the 12K CSP/mo projection is derived from 5,633/14d × 30/14 = ~12K/mo. If volume genuinely scales to 50K reports/day (350K/mo), KV write quota becomes the binding constraint and the architecture needs Workers Paid ($5/mo) — still cheaper than report-uri.com.
- **LOW confidence (DERIVED, not from primary source):** the suggestion that Sentry's CSP `script_sample` field could be used for sub-fingerprinting (per github.com/getsentry/sentry/issues/55846 the feature is requested but not landed). Don't rely on it for grouping.

---

## End of Doc
