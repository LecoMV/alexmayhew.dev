# GA4 & Analytics Best Practices for Portfolio/Lead-Gen Sites (2026-03-14)

**Status:** CURRENT
**Session:** Research covering GA4 verification, Consent Mode v2, custom dimensions, scroll/engagement tracking, CF Analytics dual-stack, event limits, and privacy-first alternatives.

---

## 1. Verifying GA4 Is Actually Collecting Data

### What to check without dashboard access

**Network tab inspection (most reliable):**

- Open DevTools > Network tab
- Filter by `collect?v=2` (the GA4 endpoint)
- Load a page — you should see POST requests to `https://www.google-analytics.com/g/collect`
- Click a request and look for `_dbg` or `ep.debug_mode` parameters — these confirm debug mode is active

**The current site disables GA4 in development** (`process.env.NODE_ENV === 'development'`), so network request verification must be done against the production build or a staging environment with the env vars set. This is intentional and correct.

**GA4 DebugView (requires dashboard):**

- Admin > DebugView shows real-time events per device
- Enable via Google Analytics Debugger Chrome extension (toggle to ON)
- Or add `debug_mode: true` to the gtag config call temporarily
- DebugView is device-specific — only your browser's traffic appears
- Gotcha: Internal Traffic filters block DebugView. Disable all filters temporarily when testing.
- Gotcha: Ad blockers (uBlock, Ghostery) will silently drop GA4 requests — disable when verifying.

**Quick production verification (no dashboard needed):**

```bash
# Confirm GA4 script loads
curl -s https://alexmayhew.dev | grep -o 'G-[A-Z0-9]*'

# Confirm measurement ID env var is set in CF Pages
# Check Cloudflare Dashboard > Pages > alexmayhew-dev > Settings > Environment Variables
```

**Status of current env vars:** `.env.local` exists but contents unknown. If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is empty/unset, `GoogleAnalytics` component returns null silently — no script loads, no data collected. Verify in CF Pages dashboard that both `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_CF_BEACON_TOKEN` are set as production environment variables.

---

## 2. GA4 Consent Mode v2 Compliance

### Current implementation assessment

The inline consent script in `layout.tsx` is:

```js
window.dataLayer = window.dataLayer || [];
function gtag() {
	dataLayer.push(arguments);
}
gtag("consent", "default", {
	analytics_storage: "denied",
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	wait_for_update: 500,
});
try {
	var s = localStorage.getItem("cookie-consent");
	if (s) {
		var c = JSON.parse(s);
		if (c.version === "1" && c.analytics) {
			gtag("consent", "update", { analytics_storage: "granted" });
		}
	}
} catch (e) {}
```

**This is the correct 2026 pattern.** Specifically:

- All four v2 signals are set (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) — required since March 2024 DMA enforcement
- Default-deny is correct — data collection blocked until consent granted
- `wait_for_update: 500` gives the CMP 500ms to fire an update before GA4 sends events — appropriate for localStorage-based consent (no async CMP roundtrip needed)
- localStorage check on page load correctly restores prior consent without re-prompting returning visitors
- Script is inline in `<head>` before gtag.js loads — correct execution order

**What does NOT need to change:**

- The four-signal pattern is the full v2 requirement; no additional signals added since DMA enforcement
- The `try/catch` around localStorage is correct defensive coding

**One gap to verify:** `ad_personalization` is set to `denied` in the config call but `allow_ad_personalization_signals: false` is also in the gtag `config()` call. These are redundant but not harmful — the Consent Mode signal takes precedence. The config option is a legacy belt-and-suspenders.

**EU DMA 2026 status:** No new consent signals were added post-March 2024. The AI Act's August 2026 enforcement deadline applies to AI systems, not analytics consent — no action required on consent code from that.

---

## 3. GA4 Custom Dimensions Registration

### What must be done in GA4 Admin

The site sends `page_category`, `content_type`, and `user_type` as event parameters on every `page_view` event. **These will NOT appear in GA4 reports until they are registered as custom dimensions.**

**Registration is NOT retroactive.** Any events sent before registration are lost for reporting purposes. Register these immediately.

**Steps:**

1. GA4 > Admin > Custom definitions > Create custom dimension
2. For each:
   - `page_category`: Scope = **Event**, Event parameter = `page_category`
   - `content_type`: Scope = **Event**, Event parameter = `content_type`
   - `user_type`: Scope = **Event**, Event parameter = `user_type`

**Quota:** 50 event-scoped custom dimensions per property. The site uses 3 — well within limits.

**Do NOT register these as User-scoped dimensions.** They change per page view, not per user. User-scoped is for stable attributes (e.g., plan tier, account type).

**Additional parameters being sent that are not registered:**

- `scroll_depth` (sent as number) → register as **custom metric**, not dimension
- `engagement_time_msec` → this is a GA4 reserved parameter name; GA4 uses it natively for `user_engagement` events. Do NOT register as a custom metric — it will conflict.
- `content_id`, `content_category`, `content_group` — register as event-scoped custom dimensions if you want to filter/segment by them in reports

**Naming convention:** GA4 admin display name can differ from parameter name. Use human-readable display names ("Page Category", "Content Type", "User Type") — the parameter name stays snake_case.

---

### Programmatic Registration via GA4 Admin API (2026-03-14)

**Research question:** Can these be created via API instead of the GA4 Dashboard UI?

**Answer: Yes.** The GA4 Admin API v1beta fully supports programmatic creation of custom dimensions and metrics. This section documents the complete approach.

#### Key Concepts: Property ID vs Measurement ID

These are two different identifiers:

| ID             | Format                    | Use                             |
| -------------- | ------------------------- | ------------------------------- |
| Measurement ID | `G-XXXXXXXXXX`            | Used in gtag.js / tracking code |
| Property ID    | Numeric, e.g. `123456789` | Used in ALL Admin API calls     |

**How to find your numeric Property ID:**

- GA4 Dashboard > Admin > Property Settings — the numeric ID appears at the top of the page
- Also visible in the GA4 URL: `analytics.google.com/analytics/web/#/p**123456789**/reports/...`
- They are NOT interchangeable — the Admin API will reject a `G-` measurement ID

#### Admin API Endpoints

**Create custom dimension:**

```
POST https://analyticsadmin.googleapis.com/v1beta/properties/{PROPERTY_ID}/customDimensions
```

**Create custom metric:**

```
POST https://analyticsadmin.googleapis.com/v1beta/properties/{PROPERTY_ID}/customMetrics
```

**Required OAuth scope for all write operations:**

```
https://www.googleapis.com/auth/analytics.edit
```

#### Authentication Options

**Option A — Service Account (recommended for scripts/CI):**

1. Create a service account in Google Cloud Console (IAM & Admin > Service Accounts)
2. Download the JSON key file
3. In GA4 Admin > Property Access Management, add the service account email with "Editor" role
4. Authenticate via `GOOGLE_APPLICATION_CREDENTIALS` env var pointing to the JSON key, or pass `keyFilename` explicitly

**Option B — `gcloud` CLI (simplest for one-off execution):**

```bash
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/analytics.edit
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)
```

Then use `curl` with `Authorization: Bearer $ACCESS_TOKEN`

**Option C — OAuth user credentials:** Required if the GA4 property is not connected to a GCP project. More complex — requires OAuth consent screen setup.

**Service account vs OAuth:** Service accounts work if your GA4 property has been linked to a Google Cloud project. For most standalone GA4 properties (not linked to GCP), you must use OAuth or add the service account manually to the GA4 property via the UI (which bypasses the GCP project requirement).

#### curl Implementation

```bash
PROPERTY_ID="123456789"  # Numeric, NOT G-XXXXXXXXXX
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

# Create page_category dimension
curl -s -X POST \
  "https://analyticsadmin.googleapis.com/v1beta/properties/${PROPERTY_ID}/customDimensions" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "parameterName": "page_category",
    "displayName": "Page Category",
    "description": "Content category of the page viewed",
    "scope": "EVENT"
  }'

# Create content_type dimension
curl -s -X POST \
  "https://analyticsadmin.googleapis.com/v1beta/properties/${PROPERTY_ID}/customDimensions" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "parameterName": "content_type",
    "displayName": "Content Type",
    "description": "Type of content: blog, service, landing",
    "scope": "EVENT"
  }'

# Create user_type dimension
curl -s -X POST \
  "https://analyticsadmin.googleapis.com/v1beta/properties/${PROPERTY_ID}/customDimensions" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "parameterName": "user_type",
    "displayName": "User Type",
    "description": "New vs returning visitor classification",
    "scope": "EVENT"
  }'

# Create scroll_depth METRIC (not dimension — it's a number)
curl -s -X POST \
  "https://analyticsadmin.googleapis.com/v1beta/properties/${PROPERTY_ID}/customMetrics" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "parameterName": "scroll_depth",
    "displayName": "Scroll Depth",
    "description": "Percentage of page scrolled (25/50/75/90)",
    "measurementUnit": "STANDARD",
    "scope": "EVENT"
  }'
```

#### Node.js Implementation (`@google-analytics/admin` package)

```typescript
import { AnalyticsAdminServiceClient } from "@google-analytics/admin";

const client = new AnalyticsAdminServiceClient({
	// Uses GOOGLE_APPLICATION_CREDENTIALS env var automatically,
	// or specify: keyFilename: '/path/to/service-account.json'
});

const PROPERTY = "properties/123456789"; // numeric ID, NOT G-XXXXXXXXXX

async function registerCustomDimensions() {
	const dimensions = [
		{ parameterName: "page_category", displayName: "Page Category", scope: "EVENT" as const },
		{ parameterName: "content_type", displayName: "Content Type", scope: "EVENT" as const },
		{ parameterName: "user_type", displayName: "User Type", scope: "EVENT" as const },
	];

	for (const dim of dimensions) {
		const [result] = await client.createCustomDimension({
			parent: PROPERTY,
			customDimension: {
				parameterName: dim.parameterName,
				displayName: dim.displayName,
				scope: dim.scope,
			},
		});
		console.log(`Created: ${result.name}`);
	}

	// scroll_depth is a metric, not a dimension
	const [metric] = await client.createCustomMetric({
		parent: PROPERTY,
		customMetric: {
			parameterName: "scroll_depth",
			displayName: "Scroll Depth",
			measurementUnit: "STANDARD",
			scope: "EVENT",
		},
	});
	console.log(`Created metric: ${metric.name}`);
}

registerCustomDimensions().catch(console.error);
```

Install: `npm install @google-analytics/admin`

#### CustomDimension Object Schema

| Field                        | Type    | Required | Notes                                                                                  |
| ---------------------------- | ------- | -------- | -------------------------------------------------------------------------------------- |
| `parameterName`              | string  | Yes      | Immutable after creation. Max 40 chars. Alphanumeric + underscore, starts with letter. |
| `displayName`                | string  | Yes      | Shown in GA4 UI. Max 82 chars.                                                         |
| `scope`                      | enum    | Yes      | `EVENT`, `USER`, or `ITEM`                                                             |
| `description`                | string  | No       | Max 150 chars.                                                                         |
| `disallowAdsPersonalization` | boolean | No       | Only for USER-scoped dimensions.                                                       |

#### CustomMetric Object Schema

| Field                  | Type   | Required | Notes                                                                                                          |
| ---------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------- |
| `parameterName`        | string | Yes      | Immutable after creation. Max 40 chars.                                                                        |
| `displayName`          | string | Yes      | Max 82 chars.                                                                                                  |
| `measurementUnit`      | enum   | Yes      | `STANDARD`, `CURRENCY`, `FEET`, `METERS`, `KILOMETERS`, `MILES`, `MILLISECONDS`, `SECONDS`, `MINUTES`, `HOURS` |
| `scope`                | enum   | Yes      | Only `EVENT` is valid for custom metrics.                                                                      |
| `description`          | string | No       | Max 150 chars.                                                                                                 |
| `restrictedMetricType` | enum   | No       | `COST_DATA` or `REVENUE_DATA`. Only for sensitive financial metrics.                                           |

For `scroll_depth` (a percentage 0-100): use `measurementUnit: "STANDARD"`.

#### Quotas and Limits

- Custom dimensions per property: **50 event-scoped, 25 user-scoped** — this project uses 3
- Custom metrics per property: **50** — this project uses 1
- Admin API write quota: 50 write requests per project per day (generous for one-time setup)
- `parameterName` is **immutable** — to rename a parameter name, you must archive and recreate
- Only `displayName`, `description`, and `disallowAdsPersonalization` are updatable via PATCH

#### Gotchas

1. **Property ID vs Measurement ID** — the API requires the numeric property ID. Using `G-XXXXXXXXXX` will return a 400 error.
2. **Service account must be added to GA4 property** — creating a GCP service account alone is insufficient. You must manually add the service account email in GA4 Admin > Property Access Management with at least "Editor" role.
3. **`analytics.edit` scope is required** — `analytics.readonly` is insufficient for write operations.
4. **Not retroactive** — dimensions registered today only appear in reports for events collected after registration. Historical event data cannot be backfilled.
5. **`parameterName` is immutable** — plan your parameter names carefully before creating. Archiving and recreating consumes quota slots (archived dimensions still count against your 50 limit until permanently deleted, which requires Google support).
6. **API version** — use `v1beta`, not `v1alpha`. v1alpha has additional fields but is less stable. The `@google-analytics/admin` npm package defaults to v1beta for stable methods.
7. **`scope` for metrics** — only `EVENT` scope is valid for custom metrics. `USER` and `ITEM` scopes are not supported for metrics.

#### Manual Dashboard Steps (2-minute fallback)

If API setup is too much overhead for a one-time registration:

1. Go to [analytics.google.com](https://analytics.google.com) > Admin (bottom-left gear icon)
2. Under "Property", click **Custom definitions**
3. Click **Create custom dimensions** (blue button)
4. For each dimension, fill in:
   - Display name: "Page Category" / "Content Type" / "User Type"
   - Scope: **Event**
   - Event parameter: `page_category` / `content_type` / `user_type`
   - Click **Save**
5. Click the **Custom metrics** tab
6. Click **Create custom metrics**
   - Display name: "Scroll Depth"
   - Scope: **Event**
   - Event parameter: `scroll_depth`
   - Unit of measurement: **Standard**
   - Click **Save**

Total time: ~2 minutes. This is the recommended approach for a one-time setup on a single property.

---

## 4. Scroll Depth Tracking

### Current implementation assessment

The `useContentAnalytics` hook uses `scroll` events with 100ms debounce and tracks 25/50/75/90% milestones. This is **functionally correct** for most cases.

### IntersectionObserver vs scroll events

**For milestone-based scroll depth (25/50/75/90%), IntersectionObserver is superior:**

| Aspect      | Scroll events                                                | IntersectionObserver                        |
| ----------- | ------------------------------------------------------------ | ------------------------------------------- |
| Performance | Fires on every scroll tick (even debounced)                  | Zero-cost until threshold crossed           |
| Accuracy    | Calculated via pageYOffset math (fragile on dynamic content) | Browser-native, accounts for sticky headers |
| SPA reset   | Must manually reset on route change                          | Observer automatically detaches/reattaches  |
| Main thread | Runs on main thread (even passive)                           | Runs off main thread                        |

**Recommended pattern for Next.js SPA with view transitions:**

Place invisible sentinel elements at 25%, 50%, 75%, 90% of the article element and observe them. On route change (pathname change), disconnect and recreate observers.

```tsx
// Sentinel approach — more reliable than scroll math on dynamic content
const sentinels = [25, 50, 75, 90].map((pct) => {
	const el = document.createElement("div");
	el.style.cssText = `position:absolute;top:${pct}%;height:1px;width:1px;`;
	articleEl.appendChild(el);
	return { el, pct };
});

const observer = new IntersectionObserver(
	(entries) => {
		entries
			.filter((e) => e.isIntersecting)
			.forEach((e) => {
				const milestone = sentinels.find((s) => s.el === e.target)?.pct;
				if (milestone) trackScrollMilestone(milestone);
			});
	},
	{ threshold: 0 }
);

sentinels.forEach(({ el }) => observer.observe(el));
// Cleanup: observer.disconnect() on route change
```

**SPA-specific gotcha:** GA4's built-in enhanced measurement scroll tracking (90% only) resets correctly when using `send_page_view: false` + manual page_view events. Custom scroll tracking in the hook is additive and correct — the built-in and custom events coexist without conflict.

**Current implementation verdict:** Functionally correct. The scroll event + debounce approach works and matches what most GA4 implementations use. IntersectionObserver is a meaningful improvement for performance, not a critical fix.

---

## 5. Engagement Time Tracking in Next.js SPA

### The SPA engagement time problem

GA4's native engagement time relies on `visibilitychange` and `pagehide` events to know when a user leaves. In a SPA, navigating to a new route does NOT fire these events — the "old page" never becomes hidden.

**The current timeout-based approach in `useContentAnalytics`** (fire at 30s/60s/2min/5min milestones) is a **reasonable workaround** but has gaps:

- If a user leaves mid-milestone (e.g., after 45 seconds), no exit event fires
- The `useEffect` cleanup function does fire on route change, sending final engagement time — this is the critical piece and it is correctly implemented
- The cleanup fires `engagement_time_msec` with `totalEngagementTime` only if > 5 seconds

### What GA4 actually needs

For GA4's built-in engagement metrics to work correctly, send `user_engagement` events (not custom `engagement_time` events) with `engagement_time_msec` as a parameter. GA4 uses this to calculate "Engaged sessions."

**The recommended 2026 pattern for SPA exit tracking:**

```tsx
// On route change (pathname change in useEffect cleanup):
// GA4's own mechanism: send user_engagement event, not custom event
if (typeof window !== "undefined" && window.gtag) {
	window.gtag("event", "user_engagement", {
		engagement_time_msec: Date.now() - startTime,
	});
}

// For final tab close / background: visibilitychange + sendBeacon
useEffect(() => {
	const handleVisibilityChange = () => {
		if (document.visibilityState === "hidden") {
			const time = Date.now() - startTime.current;
			if (time > 1000) {
				// sendBeacon survives page unload; gtag() does not
				navigator.sendBeacon(
					"/api/engagement",
					JSON.stringify({
						event: "user_engagement",
						engagement_time_msec: time,
					})
				);
				// OR use gtag directly (gtag.js uses sendBeacon internally for hit transport)
				window.gtag?.("event", "user_engagement", {
					engagement_time_msec: time,
				});
			}
		}
	};
	document.addEventListener("visibilitychange", handleVisibilityChange);
	return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
}, []);
```

**Key insight:** `window.gtag('event', ...)` uses `navigator.sendBeacon` internally when the transport is 'beacon'. The current custom `engagement_time` event name will NOT feed GA4's native "Engagement time" metric — only events named `user_engagement` with `engagement_time_msec` do.

**Action required:** Replace custom `engagement_time` event name with `user_engagement` in the cleanup handler to feed GA4's native engagement metrics.

---

## 6. Cloudflare Web Analytics vs GA4 — Running Both

### Should both run simultaneously?

**Yes, and they serve different purposes:**

|                         | GA4                                       | CF Web Analytics                    |
| ----------------------- | ----------------------------------------- | ----------------------------------- |
| Data                    | Behavioral (clicks, scrolls, conversions) | Traffic (requests, geographic, CWV) |
| Consent required        | Yes (EU/EEA)                              | No (cookieless, no fingerprinting)  |
| Ad blockers             | Frequently blocked                        | Less frequently blocked             |
| Bots                    | Filtered                                  | Included (server-level)             |
| Real-time               | ~24h delay                                | Immediate                           |
| Core Web Vitals         | Via `web-vitals` lib reporting to GA4     | Native, built-in                    |
| Unique visitor counting | JS session-based                          | Higher (includes bots/crawlers)     |

**CF Web Analytics is the privacy fallback** — it captures traffic that GA4 misses when users have ad blockers or decline consent. This is meaningful: ~30-40% of technical audiences use ad blockers.

**CF Analytics reports "10% sample"** — Cloudflare's dashboard states stats are based on a 10% sample of page load events. This means CF visitor counts should be read as relative trends, not absolute numbers.

**No interference:** CF Web Analytics beacon is a separate script load with no interaction with GA4's dataLayer. Running both simultaneously has no technical conflict.

**Recommendation:** Keep both. Use CF Analytics for traffic volume/CWV reality check and to catch the ad-blocker audience. Use GA4 for conversion funnel, event tracking, and lead attribution.

---

## 7. GA4 Event Limits

### Per-session limits

- **500 events per session** — hard limit; hits beyond 500 are not reported and GA4 does not start a new session automatically
- **20 hits per tracker object** — replenished at 2 hits/second (client-side rate limiting in gtag.js; applies to page-level bursts)

### Current site event budget per page load

Rough count of events fired on a typical blog post load:

| Event                                     | Count          |
| ----------------------------------------- | -------------- |
| `page_view`                               | 1              |
| `content_view`                            | 1              |
| `view_item` (service pages only)          | 0-1            |
| Web Vitals (CLS, FID/INP, LCP, FCP, TTFB) | 5              |
| Scroll milestones (25/50/75/90)           | 0-4            |
| Engagement time (30s/60s/2min/5min)       | 0-4            |
| CTA clicks                                | varies         |
| **Total per session**                     | ~12-20 typical |

**No risk of hitting 500 events per session.** The current tracking volume is extremely conservative. The 500 limit is a concern for sites doing granular ecommerce tracking or video tracking every few seconds.

### Custom event name limits

- **Unlimited unique event names** for web streams (no quota concern)
- **25 parameters per event** — current events use 4-6 parameters; well within limit
- **40 char parameter names, 100 char parameter values** — all current names are under 40 chars

### Custom dimension quota risk

- **50 event-scoped custom dimensions** per property
- Currently sending ~7-8 unique parameter names that could be registered
- Register only the ones you'll actually filter/segment by in reports

---

## 8. Privacy-First Analytics Alternatives

### Options assessed for a portfolio/lead-gen site

| Tool                 | Hosting           | Cost                  | Event tracking         | GDPR                      | Verdict                |
| -------------------- | ----------------- | --------------------- | ---------------------- | ------------------------- | ---------------------- |
| **Plausible**        | Cloud             | $9/mo (10k pageviews) | Custom events          | Cookieless, compliant     | Best for simplicity    |
| **Umami**            | Self-hosted       | Free                  | Full custom events     | Cookieless, compliant     | Best for control       |
| **Fathom**           | Cloud             | $14/mo                | Custom events          | Cookieless, SOC2+ISO27001 | Best for compliance    |
| **PostHog**          | Cloud/self-hosted | Free tier             | Full product analytics | Compliant                 | Overkill for portfolio |
| **CF Web Analytics** | Cloud (bundled)   | Free                  | None (page views only) | Cookieless                | Already running        |
| **GA4**              | Cloud             | Free                  | Full custom events     | Requires CMP              | Already running        |

### Recommendation for this site

**Keep the GA4 + CF Analytics dual stack.** Reasoning:

1. The site already has a compliant Consent Mode v2 implementation — the compliance overhead is already paid
2. GA4's lead tracking (generate_lead, qualify_lead events) requires a full event analytics platform — Plausible/Fathom don't support the conversion funnel depth needed
3. CF Analytics already provides the cookieless privacy fallback, covering the ad-blocker audience
4. Migrating away from GA4 loses Google Search Console integration and the ability to correlate organic search performance with conversions

**If the goal were purely traffic visibility** (no conversion tracking), Plausible would be the clear winner. But for a lead-gen site where understanding which content drives consultation bookings matters, GA4 is the right tool.

**If consent rate becomes a concern** (users declining analytics, leading to data gaps), consider adding a server-side event relay (Cloudflare Worker proxying GA4 Measurement Protocol) — this bypasses ad blockers while respecting consent signals.

---

## Action Items

| Priority | Action                                                                                                             | File                       |
| -------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| CRITICAL | Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_CF_BEACON_TOKEN` are set in CF Pages environment variables | CF Dashboard               |
| HIGH     | Register `page_category`, `content_type`, `user_type` as event-scoped custom dimensions in GA4 Admin               | GA4 Admin                  |
| HIGH     | Register `scroll_depth` as a custom metric in GA4 Admin                                                            | GA4 Admin                  |
| HIGH     | Replace custom `engagement_time` event with `user_engagement` + `engagement_time_msec` in cleanup handler          | `use-content-analytics.ts` |
| MEDIUM   | Add `visibilitychange` handler for tab-close engagement capture                                                    | `use-content-analytics.ts` |
| MEDIUM   | Consider migrating scroll tracking from scroll events to IntersectionObserver sentinels                            | `use-content-analytics.ts` |
| LOW      | Verify `content_id`, `content_category` registration if segment analysis is needed                                 | GA4 Admin                  |

---

## Sources

- [GA4 DebugView Guide — Analytics Mania](https://www.analyticsmania.com/post/debugview-in-google-analytics-4/)
- [How to Check if GA4 is Working — Analytify](https://analytify.io/how-to-check-if-ga4-is-working/)
- [Verify GA4 Implementation — Google Developers](https://developers.google.com/analytics/devguides/collection/protocol/ga4/verify-implementation)
- [Consent Mode v2 — Google Tag Manager Help](https://support.google.com/tagmanager/answer/13695607?hl=en)
- [Set Up Consent Mode — Google for Developers](https://developers.google.com/tag-platform/security/guides/consent)
- [Top 7 Consent Mode Mistakes 2025 — Bounteous](https://www.bounteous.com/insights/2025/07/30/top-7-google-consent-mode-mistakes-and-how-fix-them-2025/)
- [GA4 Custom Dimensions — Analytics Help](https://support.google.com/analytics/answer/14240153?hl=en)
- [GA4 Custom Dimensions Guide — Analytics Mania](https://www.analyticsmania.com/post/a-guide-to-custom-dimensions-in-google-analytics-4/)
- [Scroll Depth Tracking — Analytics Mania](https://www.analyticsmania.com/post/scroll-tracking-with-google-analytics-4-and-google-tag-manager/)
- [GA4 Cannot Fully Track SPA — Optimize Smart](https://www.optimizesmart.com/ga4-cannot-fully-track-spa-single-page-application-by-default/)
- [Engagement Time in GA4 — Thyngster](https://www.thyngster.com/unraveling-the-user-engagement-measurement-in-google-analytics-4)
- [visibilitychange — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)
- [sendBeacon — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [Cloudflare Web Analytics vs GA4 — Firas Esbai](https://www.firasesbai.com/articles/2024/08/11/cloudflare-vs-google-analytics.html)
- [Using Google Analytics with Cloudflare — Cloudflare Docs](https://developers.cloudflare.com/fundamentals/reference/google-analytics/)
- [GA4 Event Collection Limits — Analytics Help](https://support.google.com/analytics/answer/9267744?hl=en)
- [GA4 Configuration Limits — Analytics Help](https://support.google.com/analytics/answer/12229528?hl=en)
- [GA4 Limits & Quotas — Google Developers](https://developers.google.com/analytics/devguides/collection/gtagjs/limits-quotas)
- [Privacy-First Analytics Alternatives 2026 — LegalForge](https://www.legal-forge.com/en/blog/privacy-first-analytics-alternatives-2026/)
- [Solopreneur Analytics Stack 2026 — F3FundIt](https://f3fundit.com/the-solopreneur-analytics-stack-2026-posthog-vs-plausible-vs-fathom-analytics-and-why-you-should-ditch-google-analytics/)
- [Privacy-Preserving Analytics 2026 — dasroot.net](https://dasroot.net/posts/2026/03/privacy-preserving-analytics-plausible-umami-goatcounter/)
