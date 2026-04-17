# Plan I: Auto-Update Schema Date

**Goal:** Replace hardcoded `siteLastUpdated` with build-time environment variable.

**Tech Stack:** Next.js env vars, GitHub Actions

---

## Task 1: Replace hardcoded date in sitemap

**File:** `src/app/sitemap.ts`

- [ ] **Step 1:** Write test checking sitemap.ts does not contain hardcoded date string
- [ ] **Step 2:** Replace:
  ```ts
  // Before
  const siteLastUpdated = new Date("2026-04-05");
  // After
  const siteLastUpdated = new Date(process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString());
  ```
- [ ] **Step 3:** Run build, commit

## Task 2: Replace hardcoded date in about page schema

**File:** `src/app/about/page.tsx`

- [ ] **Step 1:** Replace `dateModified: "2026-04-05"` with:
  ```ts
  dateModified: process.env.NEXT_PUBLIC_BUILD_TIME?.split("T")[0] || "2026-04-05",
  ```
- [ ] **Step 2:** Run build, commit

**Note:** `NEXT_PUBLIC_BUILD_TIME` is already set in GitHub Actions deploy workflow as `${{ github.event.head_commit.timestamp }}`. No CI changes needed.
