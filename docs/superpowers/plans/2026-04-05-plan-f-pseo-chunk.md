# Plan F: pSEO Chunk Analysis + Split

**Goal:** Determine if pSEO barrel export impacts client bundles. Split only if needed.

**Tech Stack:** Next.js 15 SSG, webpack bundle analysis

---

## Task 1: Analyze current bundle composition

- [ ] **Step 1:** Run `ANALYZE=true npm run build` or check `.next/` output
- [ ] **Step 2:** Check if any pSEO data appears in client-side JS chunks:
  ```bash
  grep -r "Technical Advisor" .next/static/chunks/ | head -5
  ```
- [ ] **Step 3:** If pSEO data is server-only (RSC/SSG), **skip the split** — document finding
- [ ] **Step 4:** If pSEO data leaks to client, split barrel export:
  - Change `src/data/pseo/index.ts` from re-exporting everything to per-module imports
  - Each page type imports directly: `import { pseoPages } from "@/data/pseo/pages"`
  - Remove barrel re-exports of data arrays (keep type exports)
- [ ] **Step 5:** Run build, compare First Load JS sizes, commit

**Expected outcome:** pSEO data is likely server-only since all consuming pages are SSG Server Components. Split may not be needed.
