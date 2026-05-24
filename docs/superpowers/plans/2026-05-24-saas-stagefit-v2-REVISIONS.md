# SaaS Stage-Fit v2 Plan — Codex Revision Notes

**Status:** MUST APPLY before executing plan tasks
**Source:** Codex audit-review of plan (`f914412`), 2026-05-24

These 6 revisions must be applied to the implementation plan before a fresh session begins executing tasks. The spec (`67fa6a2`) is greenlit — only the plan needs adjustment.

---

## R1: Task dependency bugs (reorder tasks)

- Task 4 (`calculate.ts`) calls `computeCtaBucket()` which is created in Task 5 (`cta-routing.ts`). Fix: move CTA routing to Task 4, calculate to Task 5, or split `computeCtaBucket` into the calculate task.
- Task 15 (`DiagnosisScreen`) uses `<LeadCapture />` from Task 16, but Task 16 also references `RecommendationCard` from Task 15. **Circular.** Fix: `LeadCapture` should only collect email and return success boolean; recommendation reveal stays in `DiagnosisScreen`.
- Task 6 (`stagefit-token.ts`) imports `StageFitResult` from Task 1. Explicitly note this dependency.

## R2: Types need refinement (Task 1)

- `QuizQuestion.options` assumes 4 scored options for ALL questions, but Q1-Q6 are context questions with typed values (persona, revenue stage, etc.) and varied option counts. Fix: add discriminated question types: `ContextQuestion` (typed value, variable options) vs `TechQuestion` (scored 1-4, exactly 4 options).
- `Compliance` type is missing `"other"` value (spec §4.1 Q5 has "Other" option).
- `Persona = "other"` needs an explicit output-copy fallback path in `copy.ts` (defaults to CTO vocabulary).
- `serializeResultForUrl(result)` can't produce `s` (stage), `t` (trigger), `cust` (customer type) from `StageFitResult` alone because those fields aren't in the result type. Fix: change signature to `serializeResultForUrl(input: StageFitInput, result: StageFitResult)`.

## R3: Lead capture / signing boundary violation (Task 16)

- Task 16 calls `signResult()` inside a Client Component. Signing requires a server-side secret — this would expose the key to the client.
- Fix: create a **server action** `submitStageFitLead(answers, email, turnstileToken)` that:
  1. Recomputes `StageFitResult` server-side from answers
  2. Signs the result server-side
  3. Builds Beehiiv `customFields` from the server-computed result
  4. Calls `subscribeToNewsletter` with everything
- Keep `stagefit-token.ts` server-only. Client never touches the signing key.
- This is actually a cleaner architecture anyway — matches spec §4.4 "server-recompute" pattern.

## R4: Missing spec coverage (add tasks)

- §6: framework page must cross-link to hub spokes (not just sitemap/llms/search-index). Add as a sub-step of Task 19.
- §7.2: `scoreDimensionRisk()` function is in the spec but not in the plan. Either implement as part of `calculate.ts` (Task 4/5) or explicitly mark as deferred from spec.
- §7.3/§4.4: Matrix visual (`MatrixVisual.tsx`) is listed in spec as "post-MVP if it slips." Add a task that creates a placeholder SVG or simple visual, or explicitly mark as v2.1.
- §8.4: add a JSON-LD schema validation test for `/frameworks/saas-stage-fit-matrix` (DefinedTerm + FAQPage + Article). Add as a sub-step of Task 19.
- §10: Task 21 should include Codex `audit-review` of full diff, production 200 smoke for framework page, and Beehiiv manual verification gates.
- §11 R9: privacy note ("Your answers are used only to compute your Stage-Fit position") should be added to IntroScreen (Task 10).

## R5: Test fixtures need strengthening

- Task 4 (`calculate.test.ts`):
  - Add exact boundary tests: `totalDelta=4` → over-built/mild; `totalDelta=-4` → under-built/tomorrow; `totalDelta=3` → stage-optimized.
  - Add tie-breaker test: conflicting irreversible sum at `|totalDelta| in [4,6)`.
  - Add 1000-generated-input property test (not just the 24-combo loop currently there).
  - Add exact today-vs-tomorrow test: same input, with/without trigger event.
- Task 6 (`stagefit-token.test.ts`):
  - Add missing-key behavior test (both `signResult` and `verifyResult` should throw or return null with empty/undefined key).
  - Add canonical JSON order determinism test (keys in different order produce same signature).
- Task 7 (`newsletter.test.ts`):
  - The 409 test must assert that the update API call includes `custom_fields`, not just that the response has `existingSubscriber: true`.

## R6: Rollout task incomplete (Task 22)

- Add explicit "flag defaults to false" verification step.
- Add rollback steps from spec §9.3 (set flag to false, redeploy, v1 renders).
- Address `NEXT_PUBLIC_STAGEFIT_V2_ENABLED` timing: this is a `NEXT_PUBLIC_` env var, which means it's baked at BUILD time, not runtime. `wrangler secret put` changes Worker runtime secrets but `NEXT_PUBLIC_` vars are embedded in the JavaScript bundle during `next build`. Fix: either make it a server-only env var (not NEXT*PUBLIC*) read via `getCloudflareContext()`, or set it as a GitHub Actions secret so the build step embeds it correctly.

---

## How to apply these revisions

The fresh execution session should:

1. Read this file + the spec + the plan
2. Apply R1-R6 as plan amendments before starting any task
3. For R1: reorder tasks 4/5, break the 15/16 circular dep
4. For R2: update Task 1 types.ts with discriminated question types
5. For R3: add a new Task 16.5 or modify Task 16 to use a server action
6. For R4-R6: add sub-steps to existing tasks

After applying: proceed with Task 0, then Task 1, etc.
