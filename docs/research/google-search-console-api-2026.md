# Google Search Console API — Programmatic Access Research (2026-01, updated 2026-03)

**Status:** CURRENT
**Session:** Research for alexmayhew.dev GSC API integration + GitHub Actions CI/CD automation. Updated with deep research into authentication failure modes, JWT vs GoogleAuth differences, and the `sitemaps.submit` service account requirements.

---

## Key Findings

- Three distinct APIs exist: Search Console API (analytics + sitemaps + URL inspection), Indexing API (URL submission — restricted), and URL Inspection API (part of Search Console API)
- Service account auth is the correct choice for CI/CD automation — no user interaction required
- Indexing API is OFFICIALLY restricted to JobPosting and BroadcastEvent schema types — do NOT use for blog posts
- Sitemap submission via Search Console API is the correct CI/CD hook for regular sites
- URL Inspection API can check indexed status programmatically (2,000 QPD per site)
- Search Analytics API can pull impressions/clicks/position (1,200 QPM per site)
- All Search Console APIs are free; Indexing API is free but restricted
- GitHub Actions integration is well-documented and uses service account JSON stored as a secret

---

## API Inventory

### 1. Search Console API (v3 / webmasters)

**Base URL:** `https://www.googleapis.com/webmasters/v3/`
**Auth scope:** `https://www.googleapis.com/auth/webmasters` (read/write) or `https://www.googleapis.com/auth/webmasters.readonly`
**Auth method:** OAuth 2.0 (service account works)
**Free:** Yes

Sub-resources:

- **searchAnalytics** — query impressions, clicks, CTR, position by date/query/page/country/device
- **sitemaps** — list, get, submit, delete sitemaps
- **sites** — list, get, add, delete verified properties
- **urlInspection** — check indexed status of a URL (POST to `urlInspection/index:inspect`)

### 2. Indexing API (v3)

**Base URL:** `https://indexing.googleapis.com/v3/`
**Auth scope:** `https://www.googleapis.com/auth/indexing`
**Auth method:** Service account (required — no OAuth user flow)
**Free:** Yes

Operations:

- `urlNotifications:publish` — notify Google of new/updated URL
- `urlNotifications:publish` with `URL_DELETED` type — notify Google of deleted URL
- `urlNotifications/metadata` — check notification status for a URL
- Batch requests: up to 100 calls in one HTTP request

CRITICAL RESTRICTION: **Only valid for pages with `JobPosting` or `BroadcastEvent` (in VideoObject) schema markup.** Using for regular blog/article pages violates Google's guidelines and can cause ranking damage. Do not use for alexmayhew.dev blog posts.

---

## What Each API Can Do

| Capability                       | API                | Method                        | Notes                                       |
| -------------------------------- | ------------------ | ----------------------------- | ------------------------------------------- |
| Submit URLs for indexing         | Indexing API       | `urlNotifications:publish`    | RESTRICTED — JobPosting/BroadcastEvent only |
| Submit sitemap                   | Search Console API | `sitemaps.submit` PUT         | Safe for all sites                          |
| Check indexing status            | Search Console API | `urlInspection.index.inspect` | Returns indexed version, not live test      |
| Pull impressions/clicks/position | Search Console API | `searchAnalytics.query`       | Full data, 16 months history                |
| List submitted sitemaps          | Search Console API | `sitemaps.list`               | -                                           |
| Delete a sitemap                 | Search Console API | `sitemaps.delete`             | -                                           |

### Search Analytics Detail

Can dimension by: `date`, `query`, `page`, `country`, `device`, `searchAppearance`
Returns: `clicks`, `impressions`, `ctr`, `position`
Date range: up to 16 months history. New data: typically 2-3 days lag.
Row limit: 50,000 rows per request per search type.
2025 update: hourly data now available for the past 8 days.

### URL Inspection Detail

Endpoint: `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect`
Request body:

```json
{
	"inspectionUrl": "https://alexmayhew.dev/blog/my-post",
	"siteUrl": "https://alexmayhew.dev/"
}
```

Returns: index status, last crawl date, canonical URL, mobile usability, rich results, AMP status, referring sitemaps.
Note: Shows status of the version in Google's index, NOT a live crawl test.

### Sitemap Submission Detail

Endpoint: `PUT https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}`
No request body needed. `siteUrl` must be URL-encoded. `feedpath` is the full sitemap URL.
Example:

```
PUT https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Falexmayhew.dev%2F/sitemaps/https%3A%2F%2Falexmayhew.dev%2Fsitemap.xml
```

---

## Authentication: Service Account vs OAuth

### Service Account (correct choice for CI/CD)

- No user interaction required — runs unattended
- JSON key file downloaded from GCP Console
- Use `client_email` from JSON to add as delegated site owner in GSC
- Works for all Search Console API operations + Indexing API
- Store JSON key as GitHub Actions secret (base64-encoded recommended)

### OAuth 2.0 User Flow (wrong for CI/CD)

- Requires browser redirect and user consent
- Returns refresh token that can expire
- Appropriate for tools that act on behalf of a human user
- Not suitable for automated pipelines

---

## Setup: Step-by-Step

### Phase 1: GCP Project + Enable APIs

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g., `alexmayhew-dev-gsc`)
3. Navigate to **APIs & Services > Library**
4. Search for and enable: **Google Search Console API**
5. If needed: also enable **Web Search Indexing API** (for Indexing API)

### Phase 2: Create Service Account

1. Navigate to **APIs & Services > Credentials**
2. Click **Create Credentials > Service account**
3. Name it (e.g., `gsc-automation`)
4. Skip the optional permissions section — click Continue
5. Go to the service account's **Keys** tab
6. Click **Add Key > Create new key > JSON**
7. Download the JSON file — this is the credential
8. The service account email looks like: `gsc-automation@alexmayhew-dev-gsc.iam.gserviceaccount.com`

### Phase 3: Add Service Account to Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Select the `alexmayhew.dev` property
3. Go to **Settings > Users and permissions**
4. Click **Add user**
5. Enter the service account email (`client_email` from the JSON)
6. Set permission to **Owner** (required for Indexing API; Full is enough for Search Console API sitemaps)
7. Click **Add**

Note: For the Indexing API specifically, you need to add it via the old Search Console verification page at `https://www.google.com/webmasters/verification/home` as a **delegated owner**, not just a user.

### Phase 4: Verify Site Ownership (if not done)

- `alexmayhew.dev` presumably already verified in GSC
- Verification method options: HTML file, DNS TXT record, HTML meta tag, Google Analytics, Google Tag Manager
- Domain property (`alexmayhew.dev`) covers all subdomains and protocols

### Phase 5: GitHub Actions Integration

Store the JSON key as a GitHub secret:

```bash
# Base64-encode the JSON (on macOS/Linux)
base64 -i service-account.json | tr -d '\n'
```

Add to GitHub: **Settings > Secrets and variables > Actions > New repository secret**
Name: `GSC_SERVICE_ACCOUNT_JSON`

Example GitHub Actions workflow step (Node.js):

```yaml
- name: Submit sitemap to Google Search Console
  env:
    GSC_SERVICE_ACCOUNT_JSON: ${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}
  run: |
    node scripts/submit-sitemap.mjs
```

Example Node.js script (`scripts/submit-sitemap.mjs`):

```javascript
import { google } from "googleapis";

const credentials = JSON.parse(
	Buffer.from(process.env.GSC_SERVICE_ACCOUNT_JSON, "base64").toString("utf8")
);

const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, [
	"https://www.googleapis.com/auth/webmasters",
]);

const searchConsole = google.webmasters({ version: "v3", auth });

await searchConsole.sitemaps.submit({
	siteUrl: "https://alexmayhew.dev/",
	feedpath: "https://alexmayhew.dev/sitemap.xml",
});

console.log("Sitemap submitted successfully");
```

Install dependency: `npm install googleapis`

---

## Rate Limits and Quotas

### Search Console API (webmasters)

| Resource                              | Quota Type      | Limit       |
| ------------------------------------- | --------------- | ----------- |
| Search Analytics                      | Per-site QPM    | 1,200       |
| Search Analytics                      | Per-user QPM    | 1,200       |
| Search Analytics                      | Per-project QPD | 30,000,000  |
| Search Analytics                      | Per-project QPM | 40,000      |
| URL Inspection                        | Per-site QPD    | 2,000       |
| URL Inspection                        | Per-site QPM    | 600         |
| URL Inspection                        | Per-project QPD | 10,000,000  |
| URL Inspection                        | Per-project QPM | 15,000      |
| All other resources (sitemaps, sites) | Per-user QPS    | 20          |
| All other resources                   | Per-user QPM    | 200         |
| All other resources                   | Per-project QPD | 100,000,000 |

Source: developers.google.com/webmaster-tools/limits (updated 2025-08-28)

### Indexing API

| Quota                                       | Default |
| ------------------------------------------- | ------- |
| Publish requests per day per project        | 200     |
| Read-only (metadata) per minute per project | 180     |
| All endpoints per minute per project        | 380     |

To increase Indexing API quota: fill out Google's approval form (required, restricted to JobPosting/BroadcastEvent).

### Search Analytics Load Quotas

- Short-term: measured in 10-minute chunks. If exceeded, wait 15 min.
- Long-term: measured per day. To reduce load: narrow date range, remove page/query grouping.
- Most expensive queries: group by both page AND query string over a long date range.

---

## Practical Recommendations for alexmayhew.dev

### What to implement

1. **Sitemap submission in CI/CD** (high value, safe, approved use)
   - Trigger on every deploy via GitHub Actions
   - Submit `https://alexmayhew.dev/sitemap.xml` via `sitemaps.submit`
   - Takes 30 seconds max, no quota concern (one call per deploy)

2. **URL Inspection API** (medium value, for monitoring)
   - Check indexing status of newly published posts
   - Stay under 2,000 QPD per site limit (44 posts = trivial)
   - Can build a script to check all posts and flag unindexed ones

3. **Search Analytics pull** (high value, for content performance)
   - Pull weekly: impressions, clicks, position by page and query
   - Use for content optimization decisions
   - 16 months of history available

### What NOT to implement

- Do NOT use the Indexing API for blog posts — it is restricted to JobPosting/BroadcastEvent
- Do NOT use Indexing API as a workaround — tested SEO practitioners reported permanent ranking drops

---

## GitHub Actions Workflow Pattern

Place this as a post-deploy step in `.github/workflows/deploy.yml`:

```yaml
submit-to-gsc:
  name: Submit sitemap to Google Search Console
  runs-on: ubuntu-latest
  needs: [deploy] # Run after successful deploy
  steps:
    - uses: actions/checkout@v4

    - uses: actions/setup-node@v4
      with:
        node-version: "20"

    - name: Install googleapis
      run: npm install googleapis

    - name: Submit sitemap
      env:
        GSC_SERVICE_ACCOUNT_JSON: ${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}
      run: node scripts/submit-sitemap.mjs
```

---

---

## Authentication Deep Dive: The Critical Details

### Does `sitemaps.submit` work with service accounts?

**Yes, definitively.** Service accounts work with the Search Console API (including `sitemaps.submit`). Multiple production implementations confirmed this. The Google docs say "OAuth 2.0 only" but that language is misleading — service account JWT auth is a form of OAuth 2.0. Both `JWT` and `GoogleAuth` from `google-auth-library` work.

### JWT vs GoogleAuth: The Real Difference

Both work. Key distinction:

**`new google.auth.JWT(email, null, key, scopes)`** — explicit constructor, you pass credentials directly:

```javascript
const auth = new google.auth.JWT(
	credentials.client_email,
	null, // keyFile path (null when using inline key)
	credentials.private_key,
	["https://www.googleapis.com/auth/webmasters"]
);
const searchConsole = google.webmasters({ version: "v3", auth });
```

**`new google.auth.GoogleAuth({ credentials, scopes })`** — auto-detects auth method from environment:

```javascript
const auth = new google.auth.GoogleAuth({
	credentials: {
		client_email: credentials.client_email,
		private_key: credentials.private_key,
	},
	scopes: ["https://www.googleapis.com/auth/webmasters"],
});
google.options({ auth });
const searchConsole = google.webmasters({ version: "v3", auth });
```

**`google.auth.getApplicationDefault()`** — uses Application Default Credentials (ADC). This DOES NOT WORK for Search Console API. The Search Console API doesn't recognize ADC/workload identity credentials even with correct scopes. Confirmed in github.com/googleapis/google-api-nodejs-client/issues/730 — labeled "external" because the bug is in Google's API, not the library.

### The "missing required authentication credential" Error

**Error:** `Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential.`

This is an HTTP 401. It means the request reached Google's servers but had NO auth token at all. Distinguished from:

- HTTP 403 `"User does not have sufficient permission"` — auth worked but the service account lacks GSC access to that property
- HTTP 403 `"Insufficient Permission"` — auth worked but wrong scope or ADC not recognized

**Root causes of 401 "missing credential":**

1. **`getApplicationDefault()` / ADC used** — these credentials don't get recognized by the Search Console API. The token request succeeds client-side but the resulting token type is not accepted by GSC's auth layer.

2. **`GoogleAuth` without credentials passed** — if you do `new google.auth.GoogleAuth({ scopes })` without a `keyFile` or `credentials` field, it falls back to ADC and produces a 401.

3. **Wrong scope used** — must be `https://www.googleapis.com/auth/webmasters` (not the v1 searchconsole scope). The webmasters endpoint requires the webmasters scope.

4. **JWT `authorize()` not called before request** — with the older callback-style JWT, you needed to call `authClient.authorize()`. With the modern async client library this is handled automatically.

5. **The `siteUrl` passed is a sitemap URL instead of the property URL** — this causes a 403, not a 401, but common confusion. The `siteUrl` param must be the GSC property URL (e.g., `https://alexmayhew.dev/`), NOT the sitemap URL.

### The Exact Working Code (Node.js, ESM)

```javascript
import { google } from "googleapis";

// Parse credentials from environment (stored as base64-encoded JSON)
const credentials = JSON.parse(
	Buffer.from(process.env.GSC_SERVICE_ACCOUNT_JSON, "base64").toString("utf8")
);

// Method 1: JWT (explicit, reliable)
const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, [
	"https://www.googleapis.com/auth/webmasters",
]);

// Method 2: GoogleAuth (also works, slightly more flexible)
// const auth = new google.auth.GoogleAuth({
//   credentials: {
//     client_email: credentials.client_email,
//     private_key: credentials.private_key,
//   },
//   scopes: ['https://www.googleapis.com/auth/webmasters'],
// });

// Use webmasters v3 (the sitemaps endpoint lives here)
const webmasters = google.webmasters({ version: "v3", auth });

// Submit sitemap — siteUrl is the PROPERTY URL, feedpath is the SITEMAP URL
await webmasters.sitemaps.submit({
	siteUrl: "https://alexmayhew.dev/", // property URL, must match exactly
	feedpath: "https://alexmayhew.dev/sitemap.xml",
});

console.log("Sitemap submitted");
```

**Key API names:**

- `google.webmasters({ version: 'v3', auth })` — correct (the sitemaps resource is here)
- `google.searchconsole({ version: 'v1', auth })` — also works for sitemaps, but webmasters v3 is the canonical reference in all working examples
- Both resolve to the same underlying REST API; v3 was the original name, v1 is the renamed version

### GCP Setup: Exact API Name to Enable

In GCP Console > APIs & Services > Library, search for and enable:

- **"Google Search Console API"** — this is the one. It covers sitemaps, searchAnalytics, sites, and urlInspection.
- Do NOT confuse with "Web Search Indexing API" — that is for the restricted Indexing API (JobPosting/BroadcastEvent only).
- The GCP API ID is `searchconsole.googleapis.com`.

You do NOT need any IAM roles assigned to the service account in GCP for this to work. The GCP IAM permissions (Editor, Owner, etc.) are irrelevant to Search Console API access. What matters is the GSC property-level permission (see below).

### Service Account in Search Console: What Actually Works

The standard UI approach (Settings > Users and permissions > Add user) gives the service account either "Owner", "Full", or "Restricted" user access to the GSC property. This IS sufficient for `sitemaps.submit`.

Confirmed permission levels that work:

- **Owner** — works for sitemaps.submit and all GSC API operations
- **Full** — works for sitemaps.submit (confirmed: "Full" = `siteFullUser` in the API, which allows sitemap management)
- **Restricted** — works for read-only access (searchAnalytics, URL inspection)

The **legacy verification page** at `https://www.google.com/webmasters/verification/home` (now `https://www.google.com/webmasters/tools/user-admin`) is only relevant if you want the service account to be a **verified owner** (with its own verification token, independent of human owners). For `sitemaps.submit`, being added as a **delegated owner** (via Settings > Users and permissions with Owner level) OR as a **Full user** is sufficient. You do not need the legacy verification page for the Search Console API sitemaps endpoint.

The Indexing API is different — it requires the service account to be added as an owner via the legacy verification flow. The Search Console API sitemaps.submit does not have this requirement.

### The `siteUrl` Parameter Trap (Most Common 403 Cause)

Many developers pass the sitemap URL as `siteUrl`. This always fails with "User does not have sufficient permission" (403).

```
// WRONG — passing sitemap URL as siteUrl
siteUrl: 'https://alexmayhew.dev/sitemap.xml'  // NOT the property URL

// CORRECT — URL-prefix property
siteUrl: 'https://alexmayhew.dev/'

// CORRECT — Domain property (if using sc-domain property type in GSC)
siteUrl: 'sc-domain:alexmayhew.dev'
```

The `siteUrl` must exactly match how the property appears in your GSC account. Check your GSC property type (URL-prefix vs Domain) and use the matching format.

### URL-prefix vs Domain Property

URL-prefix property: `https://alexmayhew.dev/` — covers only that exact URL prefix with that protocol.
Domain property: `sc-domain:alexmayhew.dev` — covers all subdomains and protocols.

Both work with the sitemaps API. If your property in GSC is verified as a Domain property, use `sc-domain:alexmayhew.dev` as the `siteUrl`. If verified as a URL-prefix property, use `https://alexmayhew.dev/`.

### Service Account Verification in Your GSC Setup

The service account `voicekeepio@voicekeep-487021.iam.gserviceaccount.com` was added to GSC Settings > Users and permissions as Owner. This is correct and sufficient for `sitemaps.submit`. The permission level is NOT the problem.

### Diagnosis Checklist for "Request is missing required authentication credential" (401)

1. Are you using `getApplicationDefault()` or `GoogleAuth` without explicit credentials? If so, switch to JWT or GoogleAuth with explicit `credentials:` field.
2. Is `private_key` in the service account JSON being passed correctly? Check for escaped `\n` in the key — JSON.parse handles this, but string template literals may not.
3. Is the auth object being passed to the webmasters client? (`google.webmasters({ version: 'v3', auth })`)
4. Are you setting auth globally via `google.options({ auth })` and then NOT passing it to the client? Both patterns work, but mixing them can cause issues.
5. Is the scope exactly `https://www.googleapis.com/auth/webmasters` (not `webmasters.readonly` for submit)?

---

## Sources

- [Search Console API Prerequisites](https://developers.google.com/webmaster-tools/v1/prereqs)
- [Search Console API Usage Limits](https://developers.google.com/webmaster-tools/limits) — last updated 2025-08-28
- [Indexing API Prerequisites](https://developers.google.com/search/apis/indexing-api/v3/prereqs) — last updated 2025-12-16
- [Indexing API Quota and Pricing](https://developers.google.com/search/apis/indexing-api/v3/quota-pricing) — last updated 2025-12-10
- [Indexing API — Using the API](https://developers.google.com/search/apis/indexing-api/v3/using-api)
- [Sitemaps.submit Reference](https://developers.google.com/webmaster-tools/v1/sitemaps/submit)
- [URL Inspection API Reference](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- [GSC + GitHub Actions Automation](https://stateful.com/blog/google-search-console-github)
- [GSC Node.js Tutorial](https://stateful.com/blog/google-search-console-nodejs)
- [Authorize Requests — Search Console API](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)
- [Indexing API for Non-Job Pages: A Risky SEO Strategy](https://www.alexanderchukovski.com/is-it-ok-to-use-the-indexing-api-beyond-jobs/)
- [GSC Issue #730 — ADC doesn't work, JWT does](https://github.com/googleapis/google-api-nodejs-client/issues/730)
- [GSC Issue #2501 — Service account needs adding as user in GSC](https://github.com/googleapis/google-api-nodejs-client/issues/2501)
- [GSC Community: Service account unauthorized for sitemaps (2024)](https://support.google.com/webmasters/thread/268931735)
- [GSC Community: Service account permissions for Search Console API (2020)](https://support.google.com/webmasters/thread/87959428)
- [GSC Community: Permission issue submitting sitemaps with service account (2020)](https://support.google.com/webmasters/thread/29545106)
