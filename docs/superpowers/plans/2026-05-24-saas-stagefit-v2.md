# SaaS Stage-Fit Matrix v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the v1 SaaS Readiness maturity grader with a stage-fit misalignment detector that maps Business Stage x Tech Complexity to a 3-zone diagnostic (Over-Built / Stage-Optimized / Under-Built), with dual-track CTO/Founder output copy, gated prescription lead capture, and a canonical AEO framework page.

**Architecture:** Data-driven diagnostic with pure-function scoring engine consuming typed inputs from a 14-question quiz. Questions adapt vocabulary by persona (Q1). Server action extends existing Beehiiv newsletter subscription with custom_fields for personalized automation. Feature-flagged rollout with v1 fallback. Canonical `/frameworks/saas-stage-fit-matrix` page provides the AEO citation surface.

**Tech Stack:** Next.js 15 (App Router, Server + Client Components), React 19, TypeScript (strict), Zod (validation), Framer Motion (spring animations), Vitest (unit/component tests), Beehiiv API (subscriptions + custom_fields), Cloudflare Workers (runtime), HMAC-SHA256 (result signing).

**Spec reference:** `docs/superpowers/specs/2026-05-24-saas-readiness-v2-design.md` (committed at `67fa6a2`). Read spec sections referenced below before implementing each task.

---

## File Structure

### New files

```
src/data/saas-stagefit/
  types.ts              # All shared types: StageFitInput, StageFitResult, Zone, Severity, TechDimension, CtaBucket, etc.
  schemas.ts            # Zod schemas matching types 1:1 (input validation)
  dimensions.ts         # DIMENSIONS ordered list + REVERSIBILITY map
  questions.ts          # 14 questions with dual-track persona text + 4 scored options each
  baseline-matrix.ts    # getStageBaseline() + applyModifiers() — the heart of the algorithm
  calculate.ts          # calculateStageFit() — pure function, spec §4.2 algorithm
  cta-routing.ts        # computeCtaBucket() — spec §5 routing table
  copy.ts               # Dual-track per-[zone][severity][persona] output strings
  recommendations.ts    # Per-dimension remediation text + hub-spoke links

src/lib/
  stagefit-token.ts     # signResult() + verifyResult() — HMAC-SHA256 signing

src/components/tools/stagefit/
  StageFitDiagnostic.tsx    # Top-level orchestrator (Client Component)
  analytics.ts              # Typed event names + payloads (spec §7.7)
  phases/IntroScreen.tsx    # Landing with framework explainer
  phases/ContextQuestions.tsx # Q1-Q6 multi-step
  phases/Interstitial.tsx   # "Loaded baseline X for your stage" bridge
  phases/TechQuestions.tsx  # Q7-Q14 one-page accordion
  phases/HotTruncate.tsx    # Partial preview at Q9 checkpoint
  phases/DiagnosisScreen.tsx # Doctor's Diagnosis layout (free + gated)
  LeadCapture.tsx           # Turnstile + signed token + customFields
  RecommendationCard.tsx    # Per-dimension card with hub link

src/app/frameworks/saas-stage-fit-matrix/
  page.tsx              # Canonical AEO page (Server Component)

tests/data/saas-stagefit/
  calculate.test.ts     # Property tests + fixtures for calculateStageFit
  baseline-matrix.test.ts # Modifier tests
  cta-routing.test.ts   # Routing table tests
  questions.test.ts     # Structure validation

tests/lib/
  stagefit-token.test.ts # Sign/verify/tamper tests

tests/components/tools/stagefit/
  full-flow.test.tsx    # Persona x zone render flows
  lead-capture.test.tsx # Turnstile + signed token + error states
  cta-href.test.tsx     # Query param validation
  abandonment.test.tsx  # v1 regression: single-fire abandonment
```

### Modified files

```
src/app/tools/saas-readiness/page.tsx  # Feature flag: v2 or v1
src/app/actions/newsletter.ts          # Extend for customFields
src/lib/schemas/external-responses.ts  # Extend Beehiiv schema if needed
src/app/sitemap.ts                     # Add /frameworks/saas-stage-fit-matrix
src/app/llms.txt/route.ts              # Add framework page reference
src/app/llms-full.txt/route.ts         # Add framework reference
src/data/search-index.ts               # Add framework page entry
tests/actions/newsletter.test.ts       # Add customFields + 409 tests
```

---

## Task 0: Patch v1 EmailCapture (pre-requisite)

**Files:**

- Modify: `src/components/tools/saas-readiness-quiz.tsx:410-513`

The v1 `EmailCapture` component is broken in production (no Turnstile). This must be fixed before v2 work begins so the false PDF promise stops immediately.

- [ ] **Step 1:** In `saas-readiness-quiz.tsx`, replace the `EmailCapture` component body with a disabled state that shows "Email capture is being upgraded. Your results are shown above."

```tsx
function EmailCapture({ tier }: { tier: string }) {
	return (
		<div className="mb-6 border border-white/10 p-6">
			<p className="text-slate-text text-sm">
				Results shown above. Email capture is being rebuilt with improved personalization.
			</p>
		</div>
	);
}
```

- [ ] **Step 2:** Run `npm run build` to verify no type errors.
- [ ] **Step 3:** Commit: `fix(quiz): disable broken EmailCapture — Turnstile missing, false PDF promise`

---

## Task 1: Types and schemas

**Files:**

- Create: `src/data/saas-stagefit/types.ts`
- Create: `src/data/saas-stagefit/schemas.ts`
- Test: `tests/data/saas-stagefit/questions.test.ts` (structure validation)

- [ ] **Step 1: Write types.ts**

```typescript
export type Persona = "founder" | "cto" | "other";
export type CustomerType = "b2b-enterprise" | "b2b-smb" | "b2c" | "marketplace";
export type RevenueStage = 0 | 1 | 2 | 3 | 4 | 5;
export type TriggerEvent =
	| "series-a"
	| "upmarket"
	| "10x-users"
	| "hire-10"
	| "due-diligence"
	| "none";
export type Compliance = "soc2" | "hipaa" | "pci" | "gdpr" | "none";
export type TeamSize = 0 | 1 | 2 | 3 | 4;
export type TechScore = 1 | 2 | 3 | 4;

export type TechDimension =
	| "architecture"
	| "database"
	| "cicd"
	| "observability"
	| "security"
	| "team"
	| "performance"
	| "data";

export type Zone = "over-built" | "stage-optimized" | "under-built";
export type OverBuiltSeverity = "mild" | "acute";
export type UnderBuiltSeverity = "today" | "tomorrow";
export type Severity = OverBuiltSeverity | UnderBuiltSeverity | null;

export type VelocityDragBand = "low" | "moderate" | "high" | "critical";

export type CtaBucket =
	| "architecture-review"
	| "advisory-retainer"
	| "strategic-implementation"
	| "technical-due-diligence"
	| "fractional-cto"
	| "newsletter-only";

export interface StageFitInput {
	persona: Persona;
	customerType: CustomerType;
	revenueStage: RevenueStage;
	triggerEvent: TriggerEvent;
	compliance: Compliance[];
	teamSize: TeamSize;
	techAnswers: Record<TechDimension, TechScore>;
}

export interface DimensionDelta {
	dim: TechDimension;
	delta: number;
	irreversible: boolean;
}

export interface StageFitResult {
	zone: Zone;
	severity: Severity;
	delta: number;
	velocityDragBand: VelocityDragBand;
	reversibilityRiskCount: number;
	topMisalignedDimensions: TechDimension[];
	ctaBucket: CtaBucket;
}

export interface QuizOption {
	label: string;
	score: TechScore;
}

export interface QuizQuestion {
	id: string;
	dimension?: TechDimension;
	category: string;
	questionCto: string;
	questionFounder: string;
	options: [QuizOption, QuizOption, QuizOption, QuizOption];
}
```

- [ ] **Step 2: Write schemas.ts** with Zod schemas matching every type above. Use `z.enum()` for unions, `z.record()` for techAnswers with `z.literal()` refinement. See spec §7.1.

- [ ] **Step 3: Write a structural test** at `tests/data/saas-stagefit/questions.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { QUIZ_QUESTIONS } from "@/data/saas-stagefit/questions";
import { stageFitInputSchema } from "@/data/saas-stagefit/schemas";

describe("Quiz questions structural validation", () => {
	it("has exactly 14 questions", () => {
		expect(QUIZ_QUESTIONS).toHaveLength(14);
	});

	it("every question has both persona text variants", () => {
		for (const q of QUIZ_QUESTIONS) {
			expect(q.questionCto).toBeTruthy();
			expect(q.questionFounder).toBeTruthy();
			expect(q.questionCto).not.toBe(q.questionFounder);
		}
	});

	it("every question has exactly 4 options scored 1-4", () => {
		for (const q of QUIZ_QUESTIONS) {
			expect(q.options).toHaveLength(4);
			const scores = q.options.map((o) => o.score);
			expect(scores).toEqual([1, 2, 3, 4]);
		}
	});

	it("tech questions (Q7-Q14) each have a dimension assigned", () => {
		const techQs = QUIZ_QUESTIONS.slice(6);
		expect(techQs).toHaveLength(8);
		for (const q of techQs) {
			expect(q.dimension).toBeDefined();
		}
	});
});
```

- [ ] **Step 4:** Run test, verify it fails (questions.ts not yet created).
- [ ] **Step 5:** Commit: `feat(stagefit): types, schemas, structural test`

---

## Task 2: Dimensions, reversibility, questions data

**Files:**

- Create: `src/data/saas-stagefit/dimensions.ts`
- Create: `src/data/saas-stagefit/questions.ts`

- [ ] **Step 1: Write dimensions.ts**

```typescript
import type { TechDimension } from "./types";

export const DIMENSIONS: TechDimension[] = [
	"architecture",
	"database",
	"cicd",
	"observability",
	"security",
	"team",
	"performance",
	"data",
];

export const REVERSIBILITY: Record<TechDimension, "irreversible" | "reversible"> = {
	architecture: "irreversible",
	database: "irreversible",
	cicd: "reversible",
	observability: "reversible",
	security: "reversible",
	team: "reversible",
	performance: "reversible",
	data: "reversible",
};
```

- [ ] **Step 2: Write questions.ts** with all 14 questions per spec §4.1 table. Context questions (Q1-Q6) use `dimension: undefined`; tech questions (Q7-Q14) each set `dimension` to the matching `TechDimension`. Dual-track text from spec §4.1 table.

- [ ] **Step 3:** Run `tests/data/saas-stagefit/questions.test.ts` — should now pass.
- [ ] **Step 4:** Commit: `feat(stagefit): dimensions, reversibility map, 14 questions`

---

## Task 3: Baseline matrix + modifiers

**Files:**

- Create: `src/data/saas-stagefit/baseline-matrix.ts`
- Test: `tests/data/saas-stagefit/baseline-matrix.test.ts`

- [ ] **Step 1: Write baseline-matrix.test.ts** (TDD — tests first)

```typescript
import { describe, expect, it } from "vitest";
import { getStageBaseline, applyModifiers } from "@/data/saas-stagefit/baseline-matrix";

describe("getStageBaseline", () => {
	it("seed stage (0) returns all 1s (simplest stack)", () => {
		const baseline = getStageBaseline(0);
		expect(Object.values(baseline).every((v) => v === 1)).toBe(true);
	});

	it("scale stage (4) returns elevated baselines", () => {
		const baseline = getStageBaseline(4);
		expect(baseline.architecture).toBeGreaterThanOrEqual(3);
		expect(baseline.observability).toBeGreaterThanOrEqual(3);
	});
});

describe("applyModifiers", () => {
	it("B2B Enterprise raises security baseline by at least 1", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-enterprise", ["none"], 1, "none");
		expect(modified.security).toBeGreaterThan(base.security);
	});

	it("SOC2 compliance raises security baseline", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-smb", ["soc2"], 1, "none");
		expect(modified.security).toBeGreaterThan(base.security);
	});

	it("trigger event 'series-a' raises observability baseline", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-smb", ["none"], 1, "series-a");
		expect(modified.observability).toBeGreaterThanOrEqual(base.observability);
	});

	it("baselines never exceed 4", () => {
		const base = getStageBaseline(5);
		const modified = applyModifiers(base, "b2b-enterprise", ["soc2", "hipaa"], 4, "due-diligence");
		for (const v of Object.values(modified)) {
			expect(v).toBeLessThanOrEqual(4);
		}
	});
});
```

- [ ] **Step 2:** Run tests, verify they fail.
- [ ] **Step 3: Implement baseline-matrix.ts.** Define a `STAGE_BASELINES: Record<RevenueStage, Record<TechDimension, TechScore>>` matrix (per spec §3.1 tiers). Implement `applyModifiers` that adjusts the baseline per customer type, compliance, team size, and trigger event. All values clamped to `Math.min(result, 4) as TechScore`.
- [ ] **Step 4:** Run tests, verify they pass.
- [ ] **Step 5:** Commit: `feat(stagefit): baseline matrix + modifier engine`

---

## Task 4: Core scoring algorithm

**Files:**

- Create: `src/data/saas-stagefit/calculate.ts`
- Test: `tests/data/saas-stagefit/calculate.test.ts`

This is the heart of the tool. Algorithm is fully defined in spec §4.2 TypeScript pseudocode.

- [ ] **Step 1: Write calculate.test.ts**

```typescript
import { describe, expect, it } from "vitest";
import { calculateStageFit } from "@/data/saas-stagefit/calculate";
import type { StageFitInput } from "@/data/saas-stagefit/types";

function makeInput(overrides: Partial<StageFitInput> = {}): StageFitInput {
	return {
		persona: "cto",
		customerType: "b2b-smb",
		revenueStage: 1,
		triggerEvent: "none",
		compliance: ["none"],
		teamSize: 1,
		techAnswers: {
			architecture: 1,
			database: 1,
			cicd: 1,
			observability: 1,
			security: 1,
			team: 1,
			performance: 1,
			data: 1,
		},
		...overrides,
	};
}

describe("calculateStageFit", () => {
	it("seed + all-simple tech → stage-optimized", () => {
		const result = calculateStageFit(makeInput({ revenueStage: 0 }));
		expect(result.zone).toBe("stage-optimized");
		expect(result.severity).toBeNull();
	});

	it("seed + all-extreme tech → over-built/acute", () => {
		const result = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: {
					architecture: 4,
					database: 4,
					cicd: 4,
					observability: 4,
					security: 4,
					team: 4,
					performance: 4,
					data: 4,
				},
			})
		);
		expect(result.zone).toBe("over-built");
		expect(result.severity).toBe("acute");
	});

	it("scale stage + all-simple tech → under-built", () => {
		const result = calculateStageFit(makeInput({ revenueStage: 4 }));
		expect(result.zone).toBe("under-built");
	});

	it("trigger event affects severity (today vs tomorrow)", () => {
		const withTrigger = calculateStageFit(
			makeInput({
				revenueStage: 3,
				triggerEvent: "series-a",
			})
		);
		const withoutTrigger = calculateStageFit(
			makeInput({
				revenueStage: 3,
				triggerEvent: "none",
			})
		);
		// With trigger, under-built should have severity "today" (more urgent)
		if (withTrigger.zone === "under-built" && withoutTrigger.zone === "under-built") {
			expect(["today"]).toContain(withTrigger.severity);
		}
	});

	it("fully aligned user gets empty topMisalignedDimensions", () => {
		const result = calculateStageFit(makeInput({ revenueStage: 0 }));
		if (result.zone === "stage-optimized") {
			expect(result.topMisalignedDimensions).toHaveLength(0);
		}
	});

	it("velocity drag band matches misaligned dimension count", () => {
		const result = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: {
					architecture: 4,
					database: 4,
					cicd: 1,
					observability: 1,
					security: 1,
					team: 1,
					performance: 1,
					data: 1,
				},
			})
		);
		// 2 misaligned dims → "moderate"
		expect(["low", "moderate"]).toContain(result.velocityDragBand);
	});

	it("reversibility risk counts only irreversible misaligned dims", () => {
		const result = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: {
					architecture: 4,
					database: 4,
					cicd: 4,
					observability: 1,
					security: 1,
					team: 1,
					performance: 1,
					data: 1,
				},
			})
		);
		// architecture + database are irreversible; cicd is reversible
		expect(result.reversibilityRiskCount).toBe(2);
	});

	it("produces valid zone/severity pairs only", () => {
		// Property-style: generate several inputs
		const stages = [0, 1, 2, 3, 4, 5] as const;
		const scores = [1, 2, 3, 4] as const;
		for (const stage of stages) {
			for (const score of scores) {
				const result = calculateStageFit(
					makeInput({
						revenueStage: stage,
						techAnswers: {
							architecture: score,
							database: score,
							cicd: score,
							observability: score,
							security: score,
							team: score,
							performance: score,
							data: score,
						},
					})
				);
				expect(["over-built", "stage-optimized", "under-built"]).toContain(result.zone);
				if (result.zone === "over-built") {
					expect(["mild", "acute"]).toContain(result.severity);
				} else if (result.zone === "under-built") {
					expect(["today", "tomorrow"]).toContain(result.severity);
				} else {
					expect(result.severity).toBeNull();
				}
			}
		}
	});
});
```

- [ ] **Step 2:** Run tests, verify they fail.
- [ ] **Step 3: Implement calculate.ts** following spec §4.2 algorithm exactly. Import `getStageBaseline`, `applyModifiers` from baseline-matrix, `DIMENSIONS`, `REVERSIBILITY` from dimensions.
- [ ] **Step 4:** Run tests, verify they pass.
- [ ] **Step 5:** Commit: `feat(stagefit): core scoring algorithm with zone/severity/delta/drag/reversibility`

---

## Task 5: CTA routing

**Files:**

- Create: `src/data/saas-stagefit/cta-routing.ts`
- Test: `tests/data/saas-stagefit/cta-routing.test.ts`

- [ ] **Step 1: Write cta-routing.test.ts** with fixtures from spec §5 table. Each `(zone, severity, trigger, customerType)` combination maps to expected `CtaBucket`.
- [ ] **Step 2:** Run tests, verify they fail.
- [ ] **Step 3: Implement cta-routing.ts** — `computeCtaBucket()` function with explicit switch/if-else per spec §5. Also implement `serializeResultForUrl(result): URLSearchParams`.
- [ ] **Step 4:** Run tests, verify they pass.
- [ ] **Step 5:** Commit: `feat(stagefit): CTA routing + URL serializer`

---

## Task 6: Result-token signing

**Files:**

- Create: `src/lib/stagefit-token.ts`
- Test: `tests/lib/stagefit-token.test.ts`

- [ ] **Step 1: Write stagefit-token.test.ts**

```typescript
import { describe, expect, it, vi } from "vitest";
import { signResult, verifyResult } from "@/lib/stagefit-token";
import type { StageFitResult } from "@/data/saas-stagefit/types";

const mockResult: StageFitResult = {
	zone: "over-built",
	severity: "acute",
	delta: 12,
	velocityDragBand: "high",
	reversibilityRiskCount: 2,
	topMisalignedDimensions: ["architecture", "database", "cicd"],
	ctaBucket: "architecture-review",
};

describe("stagefit-token", () => {
	it("signed token verifies correctly", () => {
		const token = signResult(mockResult, "test-secret");
		const verified = verifyResult(token, "test-secret");
		expect(verified).toEqual(mockResult);
	});

	it("tampered token is rejected", () => {
		const token = signResult(mockResult, "test-secret");
		const tampered = token.slice(0, -5) + "XXXXX";
		expect(verifyResult(tampered, "test-secret")).toBeNull();
	});

	it("wrong key rejects", () => {
		const token = signResult(mockResult, "key-a");
		expect(verifyResult(token, "key-b")).toBeNull();
	});
});
```

- [ ] **Step 2:** Run tests, verify they fail.
- [ ] **Step 3: Implement stagefit-token.ts** using `crypto.createHmac("sha256", key)` over canonical JSON. Format: `base64url(JSON) + "." + base64url(HMAC)`. Use Node's `crypto` module (available in Cloudflare Workers with `nodejs_compat`).
- [ ] **Step 4:** Run tests, verify they pass.
- [ ] **Step 5:** Commit: `feat(stagefit): HMAC-SHA256 result signing for server-recompute`

---

## Task 7: Extend newsletter action for customFields

**Files:**

- Modify: `src/app/actions/newsletter.ts`
- Test: `tests/actions/newsletter.test.ts`

- [ ] **Step 1: Add test for customFields pass-through**

```typescript
it("passes customFields to Beehiiv as array of {name, value}", async () => {
	const result = await subscribeToNewsletter({
		email: "test@example.com",
		source: "quiz-results-v2",
		customFields: { stagefit_zone: "over-built", stagefit_severity: "acute" },
	});
	expect(result.success).toBe(true);
	// Verify the mock received custom_fields in array format
	const lastCall = mockFetch.mock.calls[0];
	const body = JSON.parse(lastCall[1].body);
	expect(body.custom_fields).toEqual([
		{ name: "stagefit_zone", value: "over-built" },
		{ name: "stagefit_severity", value: "acute" },
	]);
});
```

- [ ] **Step 2: Add test for existing-subscriber (409) path**

```typescript
it("handles 409 existing subscriber by returning existingSubscriber flag", async () => {
	mockFetch.mockResolvedValueOnce(
		new Response(JSON.stringify({ errors: [{ message: "Subscriber already exists" }] }), {
			status: 409,
		})
	);
	const result = await subscribeToNewsletter({ email: "existing@example.com" });
	expect(result.success).toBe(true);
	expect(result.existingSubscriber).toBe(true);
});
```

- [ ] **Step 3:** Run tests, verify they fail.
- [ ] **Step 4: Extend newsletter.ts:**
  - Add `customFields: z.record(z.string(), z.string()).optional()` to `newsletterSchema`.
  - Add `existingSubscriber?: boolean` to `NewsletterFormState`.
  - Transform `customFields` Record to `[{ name, value }]` array before posting.
  - Handle 409 with PUT-by-email endpoint attempt (or graceful `existingSubscriber: true`).
- [ ] **Step 5:** Run tests, verify they pass.
- [ ] **Step 6:** Commit: `feat(newsletter): customFields pass-through + 409 existing-subscriber path`

---

## Task 8: Copy and recommendations data

**Files:**

- Create: `src/data/saas-stagefit/copy.ts`
- Create: `src/data/saas-stagefit/recommendations.ts`

- [ ] **Step 1: Write copy.ts** — dual-track output strings indexed by `[zone][severity][persona]`. Use spec §4.3 table as the reference for content. Each zone+severity combo has: `diagnosis`, `symptoms`, `prognosisVelocity`, `prognosisReversibility`, `prescriptionCta` strings for both `cto` and `founder` personas.

- [ ] **Step 2: Write recommendations.ts** — per-dimension remediation text + hub-spoke article slug links. Reference the SaaS Architecture Decision Framework hub and spoke articles. Each dimension has `title`, `description`, `hubLink` (slug of the related blog post).

- [ ] **Step 3:** Commit: `feat(stagefit): dual-track output copy + per-dimension recommendations`

---

## Task 9: Analytics events module

**Files:**

- Create: `src/components/tools/stagefit/analytics.ts`

- [ ] **Step 1: Write analytics.ts** with typed event definitions per spec §7.7. Export a `trackStageFitEvent(name, payload)` function that wraps the existing `trackEvent` from `@/components/analytics/google-analytics`.

```typescript
import { trackEvent } from "@/components/analytics/google-analytics";

export const QUIZ_ID = "saas-stagefit-v2";

export function trackStageFitEvent(
	name: keyof typeof STAGEFIT_EVENTS,
	payload: Record<string, string | number | boolean>
) {
	trackEvent(name, { quiz_id: QUIZ_ID, ...payload });
}

export const STAGEFIT_EVENTS = {
	stagefit_start: true,
	stagefit_persona_selected: true,
	stagefit_context_complete: true,
	stagefit_interstitial_viewed: true,
	stagefit_hot_truncate_viewed: true,
	stagefit_question_answered: true,
	stagefit_abandoned: true,
	stagefit_complete: true,
	stagefit_cta_click: true,
	stagefit_lead_capture_attempt: true,
	stagefit_lead_capture_success: true,
	stagefit_lead_capture_failure: true,
} as const;
```

- [ ] **Step 2:** Commit: `feat(stagefit): typed analytics events module`

---

## Task 10: Component — IntroScreen

**Files:**

- Create: `src/components/tools/stagefit/phases/IntroScreen.tsx`

- [ ] **Step 1: Implement IntroScreen** — landing section with framework explainer, "14 questions, ~5 minutes" positioning, "Start Assessment" button. Uses spring animations (Framer Motion). Design follows neo-brutalist system: `border border-white/10`, `font-mono` headers, `text-cyber-lime` accents, `text-slate-text` body. Link to `/frameworks/saas-stage-fit-matrix` for "What is the Stage-Fit Matrix?"
- [ ] **Step 2:** Commit: `feat(stagefit): IntroScreen component`

---

## Task 11: Component — ContextQuestions (Q1-Q6)

**Files:**

- Create: `src/components/tools/stagefit/phases/ContextQuestions.tsx`

- [ ] **Step 1: Implement ContextQuestions** — multi-step form for Q1-Q6. Each question renders as labeled radio buttons. Progress indicator shows "1 of 6". Fires `stagefit_persona_selected` after Q1 and `stagefit_context_complete` after Q6. Persona selection on Q1 is stored and passed to parent for downstream vocabulary switching.
- [ ] **Step 2:** Commit: `feat(stagefit): ContextQuestions Q1-Q6 multi-step`

---

## Task 12: Component — Interstitial

**Files:**

- Create: `src/components/tools/stagefit/phases/Interstitial.tsx`

- [ ] **Step 1: Implement Interstitial** — bridge screen between context and tech questions. Reads the stage + customer type + trigger from context answers. Displays: "Based on $X MRR + [customer type], mapping your tech against the [stage name] baseline." + "Next 6-12 mo: [trigger description]". Fires `stagefit_interstitial_viewed`. Auto-advance after 3s OR on click.
- [ ] **Step 2:** Commit: `feat(stagefit): Interstitial bridge screen`

---

## Task 13: Component — TechQuestions (Q7-Q14, accordion)

**Files:**

- Create: `src/components/tools/stagefit/phases/TechQuestions.tsx`

- [ ] **Step 1: Implement TechQuestions** — single-page accordion with all 8 tech questions. Each question expands on click, radio buttons for options. Progress: "7 of 14" through "14 of 14". Fires `stagefit_question_answered` per question with `time_on_question_ms`. Vocabulary selects `questionCto` vs `questionFounder` based on persona from Q1.
- [ ] **Step 2:** Commit: `feat(stagefit): TechQuestions Q7-Q14 accordion`

---

## Task 14: Component — HotTruncate

**Files:**

- Create: `src/components/tools/stagefit/phases/HotTruncate.tsx`

- [ ] **Step 1: Implement HotTruncate** — after Q9, show partial preview: "Current signal: X dimensions misaligned, leaning [zone] — finish 5 more questions to lock the zone." Fires `stagefit_hot_truncate_viewed`. "Continue" button to dismiss.
- [ ] **Step 2:** Commit: `feat(stagefit): HotTruncate partial preview at Q9`

---

## Task 15: Component — DiagnosisScreen

**Files:**

- Create: `src/components/tools/stagefit/phases/DiagnosisScreen.tsx`
- Create: `src/components/tools/stagefit/RecommendationCard.tsx`

- [ ] **Step 1: Implement DiagnosisScreen** — Doctor's Diagnosis layout per spec §4.3. Sections:
  1. **FREE zone**: Diagnosis (zone + severity as headline) + Symptoms (delta summary) + Prognosis (velocity drag band + reversibility count) + top misaligned dimensions (names only).
  2. **GATED zone**: `<LeadCapture />` component gates the 3-step remediation plan (RecommendationCards with hub links).
  3. CTA buttons mapped to `ctaBucket` via `serializeResultForUrl`.

- [ ] **Step 2: Implement RecommendationCard** — renders a single dimension remediation with title, description (persona-adapted), and hub-spoke link.

- [ ] **Step 3:** Commit: `feat(stagefit): DiagnosisScreen + RecommendationCard`

---

## Task 16: Component — LeadCapture (with Turnstile + signing)

**Files:**

- Create: `src/components/tools/stagefit/LeadCapture.tsx`
- Test: `tests/components/tools/stagefit/lead-capture.test.tsx`

- [ ] **Step 1: Write lead-capture.test.tsx**

```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadCapture } from "@/components/tools/stagefit/LeadCapture";

describe("LeadCapture", () => {
  it("renders email input + Turnstile + submit button", () => {
    render(<LeadCapture zone="over-built" result={mockResult} />);
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByText(/unlock/i)).toBeTruthy();
  });

  it("submit button is disabled without Turnstile token", () => {
    render(<LeadCapture zone="over-built" result={mockResult} />);
    const btn = screen.getByRole("button", { name: /unlock/i });
    expect(btn).toBeDisabled();
  });
});
```

- [ ] **Step 2:** Run tests, verify they fail.
- [ ] **Step 3: Implement LeadCapture.tsx** — uses `<Turnstile />` from `@/components/ui/turnstile`, `signResult()` from `@/lib/stagefit-token`, and `subscribeToNewsletter` with `customFields`. On success, reveals the gated `<RecommendationCard>` items.
- [ ] **Step 4:** Run tests, verify they pass.
- [ ] **Step 5:** Commit: `feat(stagefit): LeadCapture with Turnstile + HMAC signing`

---

## Task 17: Component — StageFitDiagnostic orchestrator

**Files:**

- Create: `src/components/tools/stagefit/StageFitDiagnostic.tsx`
- Test: `tests/components/tools/stagefit/abandonment.test.tsx`
- Test: `tests/components/tools/stagefit/full-flow.test.tsx`

- [ ] **Step 1: Write abandonment.test.tsx** (v1 regression lock)

```typescript
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const trackEventSpy = vi.fn();
vi.mock("@/components/analytics/google-analytics", () => ({
  trackEvent: trackEventSpy,
}));

import { StageFitDiagnostic } from "@/components/tools/stagefit/StageFitDiagnostic";

describe("Abandonment tracking", () => {
  it("completing all 14 questions never fires stagefit_abandoned", async () => {
    // Render, answer all 14 questions, verify no abandoned event
    render(<StageFitDiagnostic />);
    // ... simulate full flow ...
    const abandonCalls = trackEventSpy.mock.calls.filter(
      c => c[0] === "stagefit_abandoned"
    );
    expect(abandonCalls).toHaveLength(0);
  });

  it("unmount mid-flow fires exactly ONE stagefit_abandoned", () => {
    const { unmount } = render(<StageFitDiagnostic />);
    // Start quiz, answer Q1
    // ...
    unmount();
    const abandonCalls = trackEventSpy.mock.calls.filter(
      c => c[0] === "stagefit_abandoned"
    );
    expect(abandonCalls).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Implement StageFitDiagnostic.tsx** — orchestrates phases: `intro → contextQuestions → interstitial → techQuestions (with hotTruncate at Q9) → diagnosis`. Manages state: `phase`, `contextAnswers`, `techAnswers`, `result`. Uses refs for abandonment tracking (single mount/unmount effect, NO phase/currentIndex dependencies).

- [ ] **Step 3: Write full-flow.test.tsx** — at minimum 2 flows: CTO persona + Over-Built zone; Founder persona + Stage-Optimized zone. Verify vocabulary swap renders correct strings, free content shows before gate, gated content hidden before email submit.

- [ ] **Step 4:** Run all tests, verify they pass.
- [ ] **Step 5:** Commit: `feat(stagefit): StageFitDiagnostic orchestrator + abandonment regression lock`

---

## Task 18: Feature flag + page wiring

**Files:**

- Modify: `src/app/tools/saas-readiness/page.tsx`

- [ ] **Step 1:** Add feature flag conditional import:

```tsx
import { SaasReadinessQuiz } from "@/components/tools/saas-readiness-quiz";
import { StageFitDiagnostic } from "@/components/tools/stagefit/StageFitDiagnostic";

// Feature flag: env var controls which version renders
const v2Enabled = process.env.NEXT_PUBLIC_STAGEFIT_V2_ENABLED === "true";

export default function SaasReadinessPage() {
  return (
    <>
      <SoftwareJsonLd ... />
      <section className="flex-1 px-6 pt-32 pb-24 sm:px-12 md:px-24">
        <div className="max-w-content mx-auto">
          <nav className="mb-8">...</nav>
          {v2Enabled ? <StageFitDiagnostic /> : <SaasReadinessQuiz />}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2:** Run `npm run build` to verify both paths compile.
- [ ] **Step 3:** Commit: `feat(stagefit): feature flag NEXT_PUBLIC_STAGEFIT_V2_ENABLED`

---

## Task 19: Canonical AEO framework page

**Files:**

- Create: `src/app/frameworks/saas-stage-fit-matrix/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/llms.txt/route.ts`
- Modify: `src/app/llms-full.txt/route.ts`
- Modify: `src/data/search-index.ts`

- [ ] **Step 1: Implement page.tsx** — Server Component. Structure per spec §6: H1 definition, H2 per zone (with DefinedTerm JSON-LD), FAQPage JSON-LD with the 10 Q&A items from the spec, Article JSON-LD wrapper. Link to `/tools/saas-readiness` at bottom.

- [ ] **Step 2: Add to sitemap.ts** — new entry for `/frameworks/saas-stage-fit-matrix`.

- [ ] **Step 3: Add to llms.txt** — new line: `- [SaaS Stage-Fit Matrix](https://alexmayhew.dev/frameworks/saas-stage-fit-matrix): Architecture diagnostic framework`

- [ ] **Step 4: Add to llms-full.txt** — framework summary in the ABOUT_INLINE or HUB_SUMMARIES section.

- [ ] **Step 5: Add to search-index.ts** — new static page entry.

- [ ] **Step 6:** Run `npm run build` to verify the page renders.
- [ ] **Step 7:** Commit: `feat(stagefit): canonical /frameworks/saas-stage-fit-matrix AEO page`

---

## Task 20: CTA href tests

**Files:**

- Test: `tests/components/tools/stagefit/cta-href.test.tsx`

- [ ] **Step 1: Write cta-href.test.tsx** — verify CTA link contains `source=stagefit`, `z`, `sev`, `s`, `t`, `cust`, `w` query params, all URL-encoded correctly.
- [ ] **Step 2:** Run tests, verify they pass (implementation already in DiagnosisScreen).
- [ ] **Step 3:** Commit: `test(stagefit): CTA href query param validation`

---

## Task 21: Final integration test + build verification

- [ ] **Step 1:** Run `npx vitest run` — all tests pass.
- [ ] **Step 2:** Run `npm run build` — clean build.
- [ ] **Step 3:** Run `npm run lint` — zero errors.
- [ ] **Step 4:** Commit any remaining fixes.
- [ ] **Step 5:** Push branch, open PR.

---

## Task 22: Rollout (post-PR-merge)

Per spec §9.2:

- [ ] **Step 1:** Verify v1 is still rendering in production (flag OFF).
- [ ] **Step 2:** Set `NEXT_PUBLIC_STAGEFIT_V2_ENABLED=true` in preview environment only. Test end-to-end.
- [ ] **Step 3:** Verify Beehiiv automation: submit test lead, confirm personalized email arrives.
- [ ] **Step 4:** Alex publishes Newsletter Issue #1 in Beehiiv (launch gate).
- [ ] **Step 5:** Enable flag in production: `wrangler secret put NEXT_PUBLIC_STAGEFIT_V2_ENABLED` → `true`. Redeploy.
- [ ] **Step 6:** Monitor for 1 week. If healthy: delete v1 files, remove feature flag conditional.

---

## Dependency Graph

```
Task 0 (patch v1) → independent, do first
Task 1 (types/schemas) → Task 2 (questions) → Task 3 (baseline) → Task 4 (calculate) → Task 5 (CTA routing)
Task 6 (signing) → independent of 1-5
Task 7 (newsletter extend) → independent of 1-5
Task 8 (copy/recs) → depends on Task 1 (types)
Task 9 (analytics) → independent
Tasks 10-14 (UI components) → depend on Tasks 1-5, 8, 9
Task 15 (DiagnosisScreen) → depends on Tasks 10-14, 8
Task 16 (LeadCapture) → depends on Tasks 6, 7
Task 17 (orchestrator) → depends on Tasks 10-16
Task 18 (feature flag) → depends on Task 17
Task 19 (AEO page) → depends on Task 8 (shares copy data)
Tasks 20-21 (integration) → depend on all above
Task 22 (rollout) → post-merge
```

**Parallelizable pairs:** Tasks 6+7 can run alongside Tasks 2-5. Task 9 can run anytime. Task 19 can run alongside Tasks 10-17.
