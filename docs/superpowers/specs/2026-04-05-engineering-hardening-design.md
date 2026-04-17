# Engineering Hardening & Site Excellence — Design Spec

> Comprehensive plan to bring alexmayhew.dev to enterprise-grade quality across testing, resilience, performance, accessibility, and content infrastructure.

## Decomposition: 10 Independent Plans

Each plan is independently deployable and testable. Ordered by impact and dependency.

---

### Plan A: Ellipsis Spacing Fix

**Scope:** 662 instances of `...` followed immediately by a letter (no space).
**Pattern:** `word...next` → `word... next`
**Regex:** Replace `\.\.\.([a-zA-Z])` with `... $1` across all .ts/.tsx source files.
**Excludes:** URLs, file paths, spread operators (`...args`), template literals with `...${`.
**Verification:** Zero matches for `/\.\.\.[a-zA-Z]/` excluding spread patterns.
**Effort:** 30 min. Bulk sed + manual review of false positives (spread operators).

### Plan B: Smooth Scroll & Framer Motion Transitions

**Scope:** Lenis smooth scroll feels rough. 35 non-spring Framer Motion transitions.
**Smooth Scroll Fix:**

- Current: `duration: 1.2`, `wheelMultiplier: 1` — too slow, feels laggy
- Fix: `duration: 0.8`, `wheelMultiplier: 1.2`, `touchMultiplier: 1.5` — snappier response
- Research Lenis best practices for portfolio sites (fast content, not infinite scroll)

**Framer Motion Fix:**

- Replace all `duration:` transitions with `type: "spring"` equivalents
- Map: `duration: 0.15` → `springTransition` (or `snappySpringTransition` for micro-interactions)
- Map: `duration: 0.2` → `snappySpringTransition`
- Map: `duration: 0.5+` → `springTransition`
- Map cursor blink (`repeat: Infinity`) — keep duration-based (animation, not transition)
- Files: navigation.tsx, command-palette.tsx, terminal.tsx, chat-widget.tsx, circuit-traces.tsx, smooth-scroll.tsx
  **Effort:** 1 hour.

### Plan C: Test Coverage Push (51% → 80%+)

**Scope:** 14/17 JSON-LD components at 0%. Hooks at 28%. Data/roles at 38%.
**Priority targets (biggest coverage gaps):**

1. `src/components/seo/*.tsx` — 17 JSON-LD components, render + snapshot tests
2. `src/lib/hooks/` — useContentAnalytics, other hooks
3. `src/data/roles/` — role page data validation
4. `src/app/for/` — role pages
5. `src/app/actions/` — contact + newsletter server actions (mock fetch)
   **Approach:** Dispatch parallel test-writing agents per directory.
   **Effort:** 2-3 hours with agents.

### Plan D: Health Check Dependencies

**Scope:** Health endpoint checks zero dependencies. Should verify Resend API, Listmonk.
**Current:** Returns `{ status: "ok" }` unconditionally.
**Fix:** Add lightweight checks:

- Resend API: `HEAD https://api.resend.com` (check reachability, not auth)
- Return `{ status: "ok", dependencies: { resend: "reachable", listmonk: "reachable" } }`
- If any dep unreachable: `status: "degraded"` (not "error" — site still works)
  **Edge constraint:** Must run on Cloudflare Workers. No TCP checks. HTTP only.
  **Effort:** 30 min.

### Plan E: Contact Form Resilience

**Scope:** Contact messages lost if Resend API fails. No retry or fallback.
**Options:**

1. **Retry with backoff** — retry 2x with exponential backoff before failing
2. **KV fallback queue** — on Resend failure, store message in Cloudflare KV, retry later via cron
3. **Dual delivery** — send via both Resend and a webhook (n8n) simultaneously
   **Recommendation:** Option 1 (retry) + structured error logging. KV queue adds complexity for a low-traffic contact form. Retry handles transient failures which are 95% of cases.
   **Implementation:** Wrap sendEmailViaResend in retry logic (max 2 retries, 1s/3s delays).
   **Effort:** 45 min.

### Plan F: pSEO Data Chunk Split

**Scope:** Barrel export at `src/data/pseo/index.ts` bundles all pSEO data together.
**Analysis needed:** Check if Next.js SSG already tree-shakes this (server components don't send data to client). If the data is only used in server components, splitting has zero client-side impact.
**Action:** Run build analyzer, check if pSEO data appears in client chunks. If yes, split imports per page type. If no (server-only), skip — it's a non-issue.
**Effort:** 30 min investigation, 1 hour if split needed.

### Plan G: Focus States & A11y Polish

**Scope:** 2 elements with `focus:outline-none` but no `focus-visible:ring`.
**Files:** Find and fix all interactive elements missing visible focus indicators.
**Also:** Chat widget input, cookie consent buttons.
**Effort:** 30 min.

### Plan H: Tailwind Design Token Cleanup

**Scope:** 6 remaining arbitrary `max-w-[...]` values.
**Files:** chat-widget (260px), traceforge result-viewer (200px), blog-article (1280px), newsletter (900px).
**Approach:** Add tokens for content-narrow (900px) and content-wide (1280px) to globals.css. Leave component-specific values (200px, 260px) as-is — they're one-off constraints, not design tokens.
**Effort:** 15 min.

### Plan I: Auto-Update Schema Date

**Scope:** `siteLastUpdated` in JSON-LD is manually set. Should auto-update on deploy.
**Fix:** Use `NEXT_PUBLIC_BUILD_TIME` env var (already set in CI) instead of hardcoded date.
**File:** `src/components/seo/json-ld.tsx` — replace hardcoded date with env var.
**Effort:** 15 min.

### Plan J: Lead Magnet & Gated Content Research

**Scope:** Research what lead magnets work for technical advisory targeting CTOs/founders.
**Deliverable:** Research doc at `docs/research/lead-magnets-gated-content-2026.md` with:

- Top lead magnet formats for B2B technical advisory
- How other technical advisors/fractional CTOs structure their lead gen
- Integration strategy with shop.alexmayhew.dev (Gumroad)
- Recommended first 3 lead magnets to build
- Content gate vs. free-with-email vs. paid (Gumroad) decision framework
  **Approach:** Web research + competitive analysis. Uses alex-voice skill for any content drafts.
  **Effort:** Research only (no implementation). 1 hour.

---

## Execution Order

```
Parallel Group 1 (quick wins, no deps):
  Plan A: Ellipsis spacing fix
  Plan J: Lead magnet research (background agent)

Parallel Group 2 (scroll + motion):
  Plan B: Smooth scroll + Framer Motion

Parallel Group 3 (infrastructure):
  Plan D: Health check deps
  Plan E: Contact form resilience
  Plan I: Auto-update schema date

Parallel Group 4 (quality):
  Plan G: Focus states
  Plan H: Tailwind tokens

Parallel Group 5 (heavy):
  Plan C: Test coverage push (agents)
  Plan F: pSEO chunk analysis

Deploy after each group.
```

## Voice Compliance

All user-facing content uses alex-voice skill. Ellipsis format: `word... next word`.
