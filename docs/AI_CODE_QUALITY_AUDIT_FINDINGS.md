# AI Code Quality & Viability Audit — alexmayhew.dev

**Date:** 2026-02-15
**Scope:** Full codebase scan (`src/`, configs, git history, dependencies)
**Framework:** "Detecting AI Code Quality and Viability" (3-axis model) + "AI Slop Removal" remediation guide
**Files analyzed:** 188 TypeScript/TSX source files, 52 dependencies, 50 recent commits

---

## Executive Summary

**Overall Grade: A-** — The codebase demonstrates professional-grade architecture with minimal AI slop markers. Strong in type safety, input validation, and data integrity. Primary gaps are in operational fault tolerance (no timeouts, no retries, no circuit breakers on external API calls).

| Axis                                   | Score  | Rating    | Key Finding                                                                  |
| -------------------------------------- | ------ | --------- | ---------------------------------------------------------------------------- |
| **Lies** (hallucinated code, security) | 9.5/10 | Excellent | Zero `any` types, zero hardcoded secrets, all imports verified               |
| **Noise** (comments, boilerplate)      | 8.5/10 | Good      | 52 "obvious" comments found; no placeholder code, no boilerplate inflation   |
| **Soul** (architecture, design)        | 9.0/10 | Excellent | Server-first (86% RSC), proper separation of concerns, no God components     |
| **Git Forensics**                      | 8.0/10 | Good      | 100% AI-assisted (self-declared), 1 thrashing episode, clean commit messages |
| **Operational Resilience (DORA)**      | 6.2/10 | Moderate  | Strong validation/CSRF; zero timeouts on 6 external fetch calls              |

---

## 1. Lies Axis — Hallucinated Code, Type Safety, Security

### 1.1 Hallucinated Imports

**Status: CLEAN** — All 1,021 imports verified against actual files, `node_modules`, and `package.json`.

- `@/lib/*` — 15 files, all exist
- `@/components/*` — all paths valid
- `@/data/*` — all modules exist
- NPM packages — all 52 dependencies present and legitimate

### 1.2 Type Safety

| Metric                 | Result                                                        |
| ---------------------- | ------------------------------------------------------------- |
| `any` types            | **0** found                                                   |
| `as any` assertions    | **0** found                                                   |
| `@ts-ignore` comments  | **0** found                                                   |
| Zod validation schemas | **5** (contact, newsletter, taskId, processOptions, filename) |

### 1.3 Hardcoded Secrets

**Status: CLEAN** — No API keys, passwords, or tokens in source code.

Environment variables properly handled:

- `NEXT_PUBLIC_*` (client-safe): Turnstile site key, GA ID, CF beacon token
- Server secrets: Accessed via `getEnv()` abstraction in `src/lib/cloudflare-env.ts`
- Proper fallback: Cloudflare Workers context → `process.env` for local dev

### 1.4 Security Patterns

| Pattern                   | Status                         | Details                                                                      |
| ------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `dangerouslySetInnerHTML` | **12 uses, all safe**          | 9 JSON-LD (JSON.stringify), 2 DOMPurify-sanitized SVG, 1 GA script           |
| SVG sanitization          | **Defense in depth**           | Pre-filtering + DOMPurify in `src/lib/vectorizer/sanitize.ts`                |
| CSRF protection           | **Turnstile + Server Actions** | Server-side token verification, production-only gating                       |
| Content Security Policy   | **Implemented**                | CSP in middleware.ts (note: `unsafe-inline` needed for Next.js)              |
| Security headers          | **Complete**                   | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Path traversal prevention | **Zod-enforced**               | `filenameSchema` blocks `..`, `/`, `\`, null bytes                           |

### 1.5 Array Access Safety

All `[0]` accesses checked — use optional chaining (`page.patterns[0]?.name || "chosen"`) or length guards (`clusters.length > 0 && clusters[0].hubSlug`).

---

## 2. Noise Axis — Comments, Boilerplate, Placeholder Code

### 2.1 Obvious Comments

**52 instances found** — comments that explain "what" rather than "why."

**Top offenders by file:**

| File                                   | Count | Examples                                                        |
| -------------------------------------- | ----- | --------------------------------------------------------------- |
| `src/components/backgrounds/*.tsx`     | 11    | `// Initialize drops`, `// Handle resize`, `// Update position` |
| `src/components/terminal/terminal.tsx` | 5     | `// Handle command execution`, `// Handle clear command`        |
| `src/data/pseo/validation.ts`          | 5     | `// Check FAQs`, `// Check pain points`                         |
| `src/lib/hooks/use-vectorizer.ts`      | 4     | `// Create abort controller`, `// Create download blob`         |
| `src/app/actions/contact.ts`           | 2     | `// Get environment variables`, `// Render React email`         |

**Assessment:** Most appear in canvas/animation code where "what" and "why" overlap. They're brief and contextual — not systematic AI-generated padding. Removing them is optional cleanup, not a quality concern.

### 2.2 Boilerplate Inflation

**Status: NONE DETECTED**

32 files exceed 300 lines. All are justified:

- **pSEO data files** (3,659 / 2,097 / 1,709 / 1,482 lines): Intentional data-driven architecture
- **Canvas animations** (343 lines): Complex mathematical rendering logic
- **Contact form** (443 lines): Form + validation + analytics + CAPTCHA
- **Navigation** (403 lines): Menu + dropdown + mobile + accessibility

No excessive wrapper functions, no redundant logic, no indirection layers.

### 2.3 Placeholder / Stub Code

**Status: NONE FOUND**

- Zero `TODO` / `FIXME` / `XXX` / `STUB` / `PLACEHOLDER` comments
- Zero empty function bodies
- Zero `console.log("here")` debug statements

### 2.4 Unnecessary Defensive Code

All try/catch blocks serve specific purposes:

- Browser compatibility fallbacks (clipboard API)
- Abort signal handling (request cancellation)
- GDPR consent graceful degradation
- API error handling with specific messaging

---

## 3. Soul Axis — Architecture, Design, Complexity

### 3.1 Component Architecture

| Metric                             | Value             | Assessment                            |
| ---------------------------------- | ----------------- | ------------------------------------- |
| Client Components (`"use client"`) | 65 (34%)          | Good                                  |
| Server Components                  | ~120 (66%)        | Excellent — server-first              |
| Client Pages (of 29 total)         | 4 (14%)           | Excellent                             |
| API Routes                         | 9                 | Appropriate                           |
| Server Actions                     | 2                 | Clean (contact, newsletter)           |
| Custom Hooks                       | 3                 | Proper patterns                       |
| Barrel files                       | 11                | All selective exports (no `export *`) |
| Dynamic imports                    | 7 (in layout.tsx) | Smart code-splitting                  |

### 3.2 God Components

**Status: NONE** — No components mix unrelated concerns. Large files are content-heavy pSEO pages with static data, not logic mixing.

### 3.3 Cognitive Complexity

4 files exceed the sonarjs CC threshold of 15 (post-refactoring):

| File                    | CC  | Cause                                    | Decision                            |
| ----------------------- | --- | ---------------------------------------- | ----------------------------------- |
| `newsletter-signup.tsx` | 18  | 3 variant branches (card/inline/minimal) | Leave — JSX conditionals, not logic |
| `result-viewer.tsx`     | 20  | Quality tier color mapping               | Leave — visual mapping, not logic   |
| `system-status.tsx`     | 16  | Status display conditionals              | Leave — was 55, already refactored  |
| `upload-zone.tsx`       | 18  | Drag state + corner accents              | Leave — cosmetic complexity         |

All 4 are barely over threshold and would lose readability if extracted further.

### 3.4 Data Flow Patterns

- **Server Actions** for forms (not API routes) — correct for Next.js 15
- **Dependency injection** in both Server Actions — excellent for testing
- **Zod validation** on all user-facing inputs
- **No `useEffect` for data fetching** — avoided the anti-pattern
- **`useEffect` only for external systems** (event listeners, DOM, scroll, analytics)

### 3.5 Animation Constant Duplication

**`springTransition` redefined in 81 component files** (203 total references):

```typescript
const springTransition = { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 };
```

Each component re-declares this identical constant rather than importing from a shared module. While the values are consistent today, this creates:

- **Maintenance risk** — changing animation feel requires 81 file edits
- **Bundle overhead** — each file includes the duplicate declaration
- **Drift risk** — nothing prevents files from diverging

**Recommendation:** Extract to `src/lib/motion-constants.ts` and import everywhere. Add `staggerContainer`, `fadeInUp`, and other repeated motion presets to the same module.

### 3.6 Missing Component-Level Error Boundaries

**Zero React Error Boundaries** found wrapping complex client components:

| Component                            | Lines | Risk                                              |
| ------------------------------------ | ----- | ------------------------------------------------- |
| `terminal/terminal.tsx`              | 294   | Canvas rendering crash takes out entire page      |
| `traceforge/traceforge-app.tsx`      | 317   | File upload + external API — high failure surface |
| `chat/chat-widget.tsx`               | 282   | External Cloudflare Workers AI calls              |
| `backgrounds/hybrid-atmospheric.tsx` | 343   | Canvas animation — browser-specific failures      |

Note: App-level error boundaries exist (`error.tsx` + `global-error.tsx`), but no component-level boundaries provide granular fallback. A canvas crash in a background component currently takes down the entire page rather than degrading gracefully.

### 3.7 Large pSEO Page Components

4 service page content components exceed 850 lines:

| File                                                        | Lines | Assessment                      |
| ----------------------------------------------------------- | ----- | ------------------------------- |
| `services/integrations/[slug]/integration-page-content.tsx` | 1,035 | Content-heavy, not logic-mixing |
| `services/comparisons/[slug]/comparison-page-content.tsx`   | 952   | Same pattern — static sections  |
| `services/migrations/[slug]/migration-page-content.tsx`     | 922   | Same pattern — static sections  |
| `services/[slug]/service-page-content.tsx`                  | 867   | Same pattern — static sections  |

**Assessment:** These are **data-driven template pages**, not God components. Each renders 10-15 static content sections from typed data objects. The length comes from JSX volume, not logic complexity. Extracting sub-components would improve navigation but not reduce cognitive load — leave as-is unless the pattern needs reuse elsewhere.

### 3.8 Duplicate String Warnings (ESLint)

54 ESLint warnings remain, all `sonarjs/no-duplicate-string`:

- **36** in JSON-LD components (e.g., `"@context"` repeated) — addressed by `schema-utils.tsx` shared constants
- **18** in data files / UI components (Tailwind classes) — not worth extracting

---

## 4. Git Forensics

### 4.1 AI Authorship

**100% AI-assisted** — all 50 analyzed commits tagged:

```
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

This is explicitly self-declared. The LOC velocity confirms it:

- **88.5 LOC/min** peak burst (1,660 LOC in 19 minutes)
- **22,065 total LOC** on Feb 6 alone (20,494 insertions)
- **64.8 LOC/min** sustained (10,089 LOC in 2.6 hours for content batch)

### 4.2 Commit Message Quality

| Metric                                    | Result                                                                     |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| Conventional format                       | **100%** (50/50)                                                           |
| Generic messages ("fix", "update", "wip") | **0**                                                                      |
| Prefix distribution                       | fix: 38%, feat: 22%, content: 14%, chore: 8%                               |
| Fix rate                                  | **38%** — many same-session corrections (normal for AI-assisted iteration) |

### 4.3 Thrashing Pattern

One significant thrashing episode detected:

**Feb 6, 20:39-22:32** — Header navigation (`navigation.tsx`), 6 commits in 2 hours:

1. Remove Docs from nav
2. Increase padding
3. Center with max-width
4. Revert max-width
5. Revert padding
6. Final restore with accessibility

This is a classic visual-iteration pattern with AI tools. The file has 31 total modifications (highest churn in the repo).

### 4.4 File Churn (Top 10)

| Modifications | File                                    |
| ------------- | --------------------------------------- |
| 42            | `.beads/issues.jsonl` (metadata)        |
| 31            | `src/components/ui/navigation.tsx`      |
| 19            | `src/app/layout.tsx`                    |
| 19            | `CLAUDE.md`                             |
| 16            | `package.json`                          |
| 14            | `src/components/blog/blog-article.tsx`  |
| 14            | `.github/workflows/deploy.yml`          |
| 12            | `src/components/pages/contact-page.tsx` |
| 12            | `src/app/sitemap.ts`                    |
| 11            | `src/components/ui/footer.tsx`          |

---

## 5. Operational Resilience (DORA Framework)

### 5.1 Critical Gap — No Fetch Timeouts

**0 of 6 server-side fetch calls have timeout configuration:**

| Endpoint                  | External Service            | Timeout | Retry | Impact                    |
| ------------------------- | --------------------------- | ------- | ----- | ------------------------- |
| Contact form → Resend API | `api.resend.com`            | None    | None  | Form hangs if Resend down |
| Newsletter → Listmonk     | `localhost:9000`            | None    | None  | Subscribe hangs           |
| Turnstile verification    | `challenges.cloudflare.com` | None    | None  | Form submission blocks    |
| Vectorize upload          | External API                | None    | None  | Upload hangs              |
| Vectorize status          | External API                | None    | None  | Poll hangs                |
| Vectorize process         | External API                | None    | None  | Process hangs             |

**Recommendation:** Add `signal: AbortSignal.timeout(10000)` to all 6 calls.

### 5.2 Strengths

| Feature                     | Score | Implementation                                |
| --------------------------- | ----- | --------------------------------------------- |
| Input validation (Zod)      | 9/10  | All 5 endpoints validated                     |
| CSRF protection (Turnstile) | 9/10  | Client token + server verify                  |
| Rate limiting               | 8/10  | 3 endpoints (5/hr, 3/hr, 10/min)              |
| Security headers            | 8/10  | CSP, X-Frame, X-Content-Type                  |
| Service Worker offline      | 9/10  | Network-first + cache fallback + offline page |
| Health endpoint             | 9/10  | `/api/health` with build info                 |
| Web Vitals monitoring       | 8/10  | CLS, FID, LCP tracked                         |
| Error boundaries            | 7/10  | `/error.tsx` + `/global-error.tsx`            |

### 5.3 Gaps

| Feature                 | Score | Issue                                      |
| ----------------------- | ----- | ------------------------------------------ |
| Fetch timeouts          | 0/10  | No timeout on any server-side fetch        |
| Retry logic             | 0/10  | No exponential backoff                     |
| Circuit breakers        | 0/10  | No failure pattern detection               |
| Structured logging      | 0/10  | All `console.*`, removed in production     |
| Error tracking (Sentry) | 0/10  | Package in deps but not integrated in src/ |
| Distributed tracing     | 0/10  | No request IDs or trace context            |
| Rate limit persistence  | 5/10  | In-memory only (lost on restart)           |

### 5.4 Sentry Note

`@sentry/nextjs` is in `package.json` and Sentry config files exist at the project root, but **no Sentry SDK calls were found in `src/`**. The integration appears to be configured at the framework level (Next.js instrumentation) rather than with explicit `Sentry.captureException()` calls. Console logging is removed in production (`next.config.mjs` `removeConsole`), so error visibility depends entirely on Sentry's automatic capture working correctly.

---

## 6. Dependency Health

### 6.1 Vulnerability Audit

| Severity  | Count  |
| --------- | ------ |
| Critical  | 0      |
| High      | 25     |
| Moderate  | 2      |
| Low       | 11     |
| **Total** | **38** |

**Root cause:** `@lhci/cli` (Lighthouse CI) pulls in old `inquirer`/`tmp` with known vulnerabilities. Consider replacing with direct Lighthouse or `unlighthouse`.

### 6.2 Outdated Packages

29 packages outdated. Noteworthy:

- **Major:** `next` (15.5.9 → 16.1.6), `eslint` (9 → 10), `fumadocs-*` (15 → 16) — intentional, require migration
- **Minor/Patch:** `@opennextjs/cloudflare` (1.14 → 1.16), `wrangler` (4.60 → 4.65), `framer-motion` (12.26 → 12.34) — should update

### 6.3 Unused Files

| File                               | Status                           | Action                                     |
| ---------------------------------- | -------------------------------- | ------------------------------------------ |
| `src/components/blog/comments.tsx` | Dead code (Giscus incomplete)    | Delete                                     |
| `src/data/services.ts`             | Possibly superseded by pSEO data | Verify and consolidate                     |
| `src/env.ts`                       | Unused Zod env schema            | Delete (using `cloudflare-env.ts` instead) |

---

## 7. Remediation Priorities

### P0 — Do Now (< 1 hour)

1. **Add `AbortSignal.timeout(10000)` to all 6 server-side fetch calls** — prevents indefinite hangs
2. **Run `npm audit fix`** — resolves auto-fixable vulnerabilities
3. **Delete dead files** — `comments.tsx`, `env.ts`

### P1 — This Sprint (< 4 hours)

4. **Extract `springTransition` to shared module** — deduplicate 81 files into single `src/lib/motion-constants.ts` import
5. **Add component-level Error Boundaries** — wrap terminal, traceforge, chat, and background components
6. **Verify Sentry integration** — confirm `@sentry/nextjs` auto-captures errors in production since `console.*` is stripped
7. **Update deployment-critical packages** — `@opennextjs/cloudflare`, `wrangler`, `@sentry/nextjs`
8. **Migrate rate limiting to Cloudflare KV** — persist across deployments

### P2 — Nice to Have

9. **Add retry with exponential backoff** for Resend and Listmonk API calls
10. **Remove 52 obvious comments** — cosmetic cleanup pass
11. **Evaluate `@lhci/cli` replacement** — eliminates 25 high-severity transitive vulnerabilities
12. **Add structured logging** — if `console.*` is stripped in prod, need alternative for non-Sentry logs

### P3 — Future Consideration

13. **Circuit breaker pattern** for external service calls
14. **Distributed tracing** (request IDs across API calls)
15. **useActionState migration** for contact and newsletter forms (React 19)

---

## 8. AI Slop Removal Assessment (per 4-Phase Framework)

### Phase 1: Lock Behavior ✅ COMPLETE

- Build passes cleanly (184/184 static pages)
- ESLint: 0 errors, 54 warnings (all non-critical)
- TypeScript: strict mode, zero `any`

### Phase 2: Slop Detox — MINIMAL NEEDED

- 52 obvious comments (cosmetic, not systemic)
- Zero placeholder code
- Zero boilerplate inflation
- Zero unnecessary defensive patterns

### Phase 3: Adversarial Refactoring — MINIMAL

- No God components (large pSEO pages are data-driven templates, not logic-mixing)
- No deep nesting, no circular dependencies
- Architecture is clean (server-first, proper boundaries)
- **One extraction needed:** `springTransition` constant duplicated in 81 files → extract to shared module
- **One addition needed:** Component-level Error Boundaries for 4 complex client components

### Phase 4: DB/State Normalization — N/A

- No database in the frontend codebase
- State management is minimal (useState for forms, no Redux/Zustand)
- Data layer is well-structured (pSEO types + Zod validation)

---

## Conclusion

This codebase is **production-ready with high code quality**. The AI-assisted development (100% Claude Opus 4.6 co-authored) has produced clean, well-typed, properly architected code with strong security practices. The primary investment area is operational resilience — specifically adding timeouts and retry logic to external API calls, and verifying error observability in production.

The codebase shows no evidence of the "AI slop" patterns described in the detection framework: no hallucinated imports, no boilerplate inflation, no placeholder code, no type safety issues, and no architectural debt. The 52 obvious comments and 1 thrashing episode are minor artifacts that don't affect code quality or maintainability.
