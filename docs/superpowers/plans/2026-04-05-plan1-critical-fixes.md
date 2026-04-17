# Plan 1: Critical Fixes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 6 most urgent issues that are actively harming indexing, analytics, and data integrity.

**Architecture:** Minimal, targeted fixes to existing files. No new components or refactors. Each task is independently deployable.

**Tech Stack:** Next.js 15 / TypeScript / Cloudflare Workers

---

## Chunk 1: Indexing-Critical Fixes

### Task 1: Fix Broken Homepage Link (404)

**Files:**

- Modify: `src/app/home-page.tsx:66`

- [ ] **Step 1: Verify the correct slug**

Run: `ls content/blog/modern-frontend-architecture*`
Expected: `content/blog/modern-frontend-architecture.mdx` (no `-guide` suffix)

- [ ] **Step 2: Fix the slug in featuredInsights array**

In `src/app/home-page.tsx`, change line 66:

```tsx
// FROM:
slug: "modern-frontend-architecture-guide",
// TO:
slug: "modern-frontend-architecture",
```

- [ ] **Step 3: Verify build**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/app/home-page.tsx
git commit -m "fix(seo): correct broken homepage link to modern-frontend-architecture"
```

### Task 2: Fix Future-Dated Sitemap Entries

**Files:**

- Modify: `src/app/sitemap.ts:174-188`

The newsletter section uses `issue.publishedAt` which includes future-dated scheduled newsletters. Google says future lastmod erodes trust for the ENTIRE sitemap.

- [ ] **Step 1: Write failing test**

Create `tests/seo/sitemap-dates.test.ts`:

```typescript
import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Sitemap date integrity", () => {
	it("sitemap.ts caps newsletter lastmod to current date", () => {
		const source = fs.readFileSync("src/app/sitemap.ts", "utf-8");
		expect(source).toContain("Math.min");
	});
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npx vitest run tests/seo/sitemap-dates.test.ts`

- [ ] **Step 3: Fix sitemap.ts newsletter section**

Change lines 182-187 from:

```typescript
...newsletter.map((issue) => ({
  url: `${siteUrl}/newsletter/${getSlug(issue.info.path)}`,
  lastModified: issue.publishedAt,
  changeFrequency: "yearly" as const,
  priority: 0.5,
})),
```

To:

```typescript
...newsletter
  .filter((issue) => issue.publishedAt <= new Date())
  .map((issue) => ({
    url: `${siteUrl}/newsletter/${getSlug(issue.info.path)}`,
    lastModified: issue.publishedAt,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  })),
```

This excludes future-dated newsletters from the sitemap entirely (they shouldn't be in the sitemap before they're published).

- [ ] **Step 4: Update siteLastUpdated to today**

Change line 24 from:

```typescript
const siteLastUpdated = new Date("2026-03-14");
```

To:

```typescript
const siteLastUpdated = new Date("2026-04-05");
```

- [ ] **Step 5: Remove duplicate /docs entry**

Check if `/docs` appears twice in the sitemap. The static pages include `/docs` AND `docsPages` from Fumadocs may also include the root `/docs`. Add a deduplication check or remove the static `/docs` entry if Fumadocs generates it.

- [ ] **Step 6: Run test — expect PASS**

Run: `npx vitest run tests/seo/sitemap-dates.test.ts`

- [ ] **Step 7: Verify build and check sitemap output**

```bash
npm run build
# Verify no future dates in built sitemap
```

- [ ] **Step 8: Commit**

```bash
git add src/app/sitemap.ts tests/seo/sitemap-dates.test.ts
git commit -m "fix(seo): exclude future-dated newsletters from sitemap, update lastmod"
```

### Task 3: Add Switzerland (CH) to GDPR Countries

**Files:**

- Modify: `src/lib/geo.ts:50`
- Modify: `tests/lib/geo.test.ts`

- [ ] **Step 1: Write failing test**

Add to `tests/lib/geo.test.ts`:

```typescript
it("treats Switzerland (CH) as GDPR country", () => {
	expect(isGDPRCountry("CH")).toBe(true);
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npx vitest run tests/lib/geo.test.ts`

- [ ] **Step 3: Add CH to GDPR_COUNTRIES**

In `src/lib/geo.ts`, change line 50 from:

```typescript
const GDPR_COUNTRIES = new Set([...EEA_COUNTRIES, "GB"]);
```

To:

```typescript
const GDPR_COUNTRIES = new Set([...EEA_COUNTRIES, "GB", "CH"]);
```

- [ ] **Step 4: Run test — expect PASS**

Run: `npx vitest run tests/lib/geo.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/geo.ts tests/lib/geo.test.ts
git commit -m "fix(analytics): add Switzerland (CH) to GDPR countries for consent banner"
```

---

## Chunk 2: Data Integrity Fixes

### Task 4: Fix generate_lead Event Data Loss

**Files:**

- Modify: `src/app/actions/contact.ts` (return form values in success state)
- Modify: `src/components/pages/contact-page.tsx` (pass values to trackLeadEvent)

- [ ] **Step 1: Read current ContactFormState type**

Read `src/app/actions/contact.ts` to understand the return type.

- [ ] **Step 2: Add form values to success return**

In the success return of the server action, include the submitted values:

```typescript
return {
	success: true,
	error: null,
	fieldErrors: {},
	submittedValues: {
		projectType: data.projectType,
		budget: data.budget,
		referralSource: data.referralSource,
	},
};
```

- [ ] **Step 3: Update contact-page.tsx to use submitted values**

In the `useEffect` that fires `trackLeadEvent`, read from `state.submittedValues` instead of hardcoded "unknown":

```typescript
trackLeadEvent("generate_lead", {
	lead_source: "contact_form",
	project_type: state.submittedValues?.projectType ?? "unknown",
	budget_range: state.submittedValues?.budget ?? "unknown",
	referral_source: state.submittedValues?.referralSource ?? "not_specified",
});
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/actions/contact.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/app/actions/contact.ts src/components/pages/contact-page.tsx
git commit -m "fix(analytics): pass real form values to generate_lead event"
```

### Task 5: Verify Factual Claims in pSEO

**Files:**

- Review: `src/data/pseo/pages.ts` (search for "SOC2", "PCI-DSS", "HIPAA")

- [ ] **Step 1: Search for claims**

```bash
grep -n "SOC2\|PCI-DSS\|HIPAA\|certified\|audit" src/data/pseo/pages.ts
```

- [ ] **Step 2: Flag for user review**

Any claims about certifications or compliance must be verified by the user. List them for manual review. Do not change content — flag only.

- [ ] **Step 3: No commit needed** (verification task only)

---

## Chunk 3: Deploy & Verify

### Task 6: Build, Push, Verify

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 2: Run full build**

Run: `npm run build`

- [ ] **Step 3: Push**

```bash
git push origin main
```

- [ ] **Step 4: Monitor deploy**

```bash
gh run list --repo LecoMV/alexmayhew.dev --limit 3
```

- [ ] **Step 5: Verify live site**

```bash
# Broken link fixed
curl -sI https://alexmayhew.dev/blog/modern-frontend-architecture | head -3

# Health check
curl -s https://alexmayhew.dev/api/health | jq

# Sitemap has no future dates
curl -s https://alexmayhew.dev/sitemap.xml | grep -oP '<lastmod>[^<]+</lastmod>' | sed 's/<[^>]*>//g' | sort -u | while read d; do [[ "$d" > "2026-04-05" ]] && echo "FUTURE: $d"; done
```

- [ ] **Step 6: Resubmit sitemap to GSC**

```bash
node -e "
const { google } = require('googleapis');
const fs = require('fs');
const key = JSON.parse(fs.readFileSync('alexmayhew-dev-b44c9e53041e.json'));
const auth = new google.auth.JWT({ email: key.client_email, key: key.private_key, scopes: ['https://www.googleapis.com/auth/webmasters'] });
const wm = google.webmasters({ version: 'v3', auth });
wm.sitemaps.submit({ siteUrl: 'sc-domain:alexmayhew.dev', feedpath: 'https://alexmayhew.dev/sitemap.xml' }).then(() => console.log('Sitemap resubmitted'));
"
```
