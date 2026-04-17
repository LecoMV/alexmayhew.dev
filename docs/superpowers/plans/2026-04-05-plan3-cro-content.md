# Plan 3: CRO & Content Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix voice violations, improve conversion rates, and strengthen content quality across the site.

**Architecture:** Content and copy edits across data files, page components, and MDX blog posts. Bulk find-and-replace for em dashes.

**Tech Stack:** Next.js 15 / MDX / TypeScript data files

---

## Chunk 1: Voice & Copy Fixes

### Task 1: Update VOICE_GUIDE.md — Remove Em Dash Contradiction

**Files:**

- Modify: `docs/VOICE_GUIDE.md:113-114`

- [ ] **Step 1: Change em dash instruction to ellipsis**

Replace the em dash guidance with: "Use `...` (ellipsis) for parenthetical breaks and pauses. NEVER use em dashes (---) or double dashes (--)."

- [ ] **Step 2: Commit**

### Task 2: Fix ~500 Em Dash Violations Across Source Files

**Files (bulk replace `—` with `...` and `--` with `...` where used as parenthetical):**

- `src/data/pseo/pages.ts` (~143 occurrences)
- `src/data/pseo/migrations.ts` (~90)
- `src/data/pseo/comparisons.ts` (~90)
- `src/data/pseo/integrations.ts` (~30)
- `src/data/projects.ts` (~36)
- `src/app/home-page.tsx` (1 — hero)
- `src/components/pages/about-page.tsx` (~6)
- `src/app/services/services-page-content.tsx` (1)
- `src/components/pages/tools-page.tsx` (1)

- [ ] **Step 1: Run voice-rules test to establish baseline**

Run: `npx vitest run tests/content/voice-rules.test.ts`

- [ ] **Step 2: Bulk replace em dashes in data files**

Use sed/find-replace: `—` → `...` across all listed files. Review each file to ensure no false positives (e.g., actual dashes in URLs or code).

- [ ] **Step 3: Fix hero em dash**

In `src/app/home-page.tsx`, change "you need strategic guidance—not just code" to "you need strategic guidance...not just code"

- [ ] **Step 4: Run voice-rules test — expect improvement**
- [ ] **Step 5: Run build**
- [ ] **Step 6: Commit**

### Task 3: Fix 3 Blog Post Em Dash Violations

**Files:**

- `content/blog/code-review-practices-scale.mdx` (2 occurrences)
- `content/blog/documentation-engineers-read.mdx` (1 occurrence)

- [ ] **Step 1: Fix and run prettier on each file**
- [ ] **Step 2: Commit**

---

## Chunk 2: CRO Improvements

### Task 4: Add Nav Bar CTA Button

**Files:**

- Modify: `src/components/ui/navigation.tsx`

- [ ] **Step 1: Add a highlighted CTA** after the nav items — "Book a Call" or "Get Started" styled with `bg-cyber-lime text-void-navy` to stand out from the nav links
- [ ] **Step 2: Link to /contact**
- [ ] **Step 3: Run build, commit**

### Task 5: Fix CTA Casing Inconsistency

**Files:**

- Modify: `src/app/services/services-page-content.tsx` — change `Schedule_Consultation()` to `SCHEDULE_CONSULTATION()`

- [ ] **Step 1: Fix casing**
- [ ] **Step 2: Commit**

### Task 6: Add "Not Sure" Budget Option to Contact Form

**Files:**

- Modify: `src/components/pages/contact-page.tsx` — add budget option
- Modify: `src/lib/schemas/contact.ts` — update Zod enum

- [ ] **Step 1: Add "Let's discuss" or "Not sure yet" to budget enum**
- [ ] **Step 2: Update Zod schema to accept the new value**
- [ ] **Step 3: Run contact tests**
- [ ] **Step 4: Commit**

### Task 7: Fix Contact Form "us" → "me"

**Files:**

- Modify: `src/components/pages/contact-page.tsx:266`

- [ ] **Step 1: Change "How did you hear about us?" to "How did you find me?"**
- [ ] **Step 2: Commit**

### Task 8: Fix Services Buzzword Copy

**Files:**

- Modify: `src/app/home-page.tsx` — change "Specialized capabilities engineered for digital excellence." to specific copy
- Modify: `src/app/services/services-page-content.tsx` — fix centered CTA text

- [ ] **Step 1: Replace vague copy with specifics**
- [ ] **Step 2: Commit**

### Task 9: Fix Work Page Heading

**Files:**

- Modify: `src/components/pages/work-page.tsx`

- [ ] **Step 1: Change "Digital Instruments & Experiments" to "Digital Instruments & Case Studies"** (or similar — remove "Experiments")
- [ ] **Step 2: Commit**

---

## Chunk 3: Homepage Content Expansion

### Task 10: Add Substantive Content to Homepage

The homepage has only 262 words. Google needs more content to assess authority. Add at minimum:

**Files:**

- Modify: `src/app/home-page.tsx`

- [ ] **Step 1: Expand the services section** with 1-2 sentences per service card describing the outcome
- [ ] **Step 2: Add a brief "About" snippet** below services — 2-3 sentences about Alex's background with a link to /about
- [ ] **Step 3: Target 500+ words on homepage**
- [ ] **Step 4: Run build, commit**

---

## Chunk 4: Deploy & Verify

### Task 11: Full Build, Push, Verify

- [ ] **Step 1: Run voice-rules test**
- [ ] **Step 2: Full test suite + build**
- [ ] **Step 3: Push to main**
- [ ] **Step 4: Monitor deploy**
- [ ] **Step 5: Verify em dashes removed from live site**
