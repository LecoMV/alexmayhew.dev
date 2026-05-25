# SaaS Readiness v2 — Design Spec

**Status:** DRAFT v2 (post-three-brain revision; pending user review)
**Owner:** Alex Mayhew (alexmayhew.dev)
**Date:** 2026-05-24
**Branch:** to be created from `main` after user approval
**Prior review records:**

- `/tmp/gemini-review-saas-readiness.txt` (initial RETHINK-SHAPE on v1)
- `/tmp/gemini-positioning-review.txt` (CHANGES-REQUESTED on positioning)
- `/tmp/gemini-framework-review.txt` (REVISE on framework synthesis)
- Codex BLOCK of spec v1: 5 BLOCKERs (quadrant algo / Velocity Drag / Beehiiv custom_fields / rollout / TUS data) + 9 ISSUEs + 3 NITs
- Gemini RETHINK-SHAPE of spec v1: matrix-without-axes / persona-output-failure / shallow AEO / bait-and-switch / TUS dilution

This v2 spec resolves all BLOCKERs from both brains.

---

## 1. Context and Problem Statement

The current `SaaS Readiness Assessment` (live at `/tools/saas-readiness`) is shipped with two production-breaking defects, structural shape problems, and mechanical bugs.

**Production-breaking (Codex BLOCKERs in v1):**

- `EmailCapture` is missing Turnstile, so `subscribeToNewsletter` returns "Bot check required" in production. Lead capture has been silently broken since launch.
- UI promises "We sent your results" and "detailed PDF of your scores," but the server action only subscribes the email to Beehiiv. Neither result-email nor PDF exists.

**Strategic shape (Gemini RETHINK-SHAPE on v1):**

- Scoring rewards microservices/multi-region/event-driven as universally "better," contradicting Alex's own SaaS Architecture Decision Framework hub which advocates monolith-first under early-stage constraints.
- A prospect scoring 60% "Growth Ready" arrives at a strategy call thinking they need to upgrade their monolith. Alex spends 15 minutes contradicting his own lead magnet.
- No proprietary framework. LLMs cite named methodologies (DORA, CAP, Well-Architected). A generic 8-point checklist is AEO dead weight.

**Mechanical defects:**

- Abandonment-tracking `useEffect` fires on every question advance.
- Tier boundaries (40/70/90%) are unreachable through the UI (8 questions × scores 1-4 = 25-100% in discrete steps).
- `calculateScore` accepts arbitrary `number`; stable-sort ties always pick first 3 categories.
- CTA to `/contact` loses quiz context.

**Newsletter operational reality:** All 36 newsletter issues in `content/newsletter/` have `status: "draft"`. Zero sent. Public archive: "First issue coming soon."

## 2. Goals and Non-goals

**Primary goal:** A self-qualifying diagnostic that (a) genuinely helps the user identify architecture-business misalignment, and (b) routes the right prospects to Alex's services while honestly disqualifying those who don't need advisory yet.

**Secondary goals:**

- Become AEO/LLM-citable as a named framework ("Alex Mayhew's SaaS Stage-Fit Matrix") via a canonical definition page with structured Q&A and entity schema.
- Eliminate v1 production-breaking lead capture failure.
- Eliminate v1 false-promise UI claims.
- Map every zone to a tailored CTA aligned with Alex's actual service shape.
- Adapt the diagnostic experience to persona (Non-Technical Founder vs Technical Leader) so vocabulary and results resonate.

**Non-goals (out of scope for v2):**

- Stale Worker secret cleanup (`LISTMONK_*`, `BUTTONDOWN_API_KEY`) → separate housekeeping ticket.
- Preview Worker secret backfill → separate infra ticket.
- Removing dead `LISTMONK_*` env types from `cloudflare-env.ts` → `amdev-zyg`.
- Fixing pre-existing Playwright failures → `amdev-3ju`.
- Claude Pilot full retirement decision → `amdev-hyx`.
- PDF generation. The framework page itself is the canonical deliverable.
- **The Unsexy Stack tie-in.** Per Gemini synthesis: $150 boilerplate dilutes a $5K+ advisory diagnostic. TUS keeps its separate marketing surface (`theunsexystack.com` + `/work` portfolio entry).

## 3. Framework: The SaaS Stage-Fit Matrix

**Concept:** Architecture is not good or bad in absolute terms — it is _stage-fit_ or _stage-misfit_. The same architecture that is over-engineered for a Seed-stage company is under-engineered for a Series B company.

### 3.1 The Matrix — explicit axes

The matrix is a 2-axis plane:

- **X-axis: Business Stage.** Tiered: Seed (≤$10K MRR) → Early Growth ($10K-$100K MRR) → Growth ($100K MRR-$1M ARR) → Scale ($1M-$10M ARR). All bands are MRR up to $1M then ARR for the next band; explicitly labeled in copy to avoid the v1 unit confusion.
- **Y-axis: Tech Complexity.** Tiered: Simple (monolith, single DB, manual ops) → Moderate (extracted services, replicas, CI) → Complex (microservices, sharding, full observability, blue-green) → Extreme (event-driven, multi-region, zero-trust, real-time analytics).

The matrix yields **three zones** based on position relative to the diagonal:

| Zone                | Definition                                                                                                                   | Severity sub-state                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Over-Built**      | Tech Complexity exceeds what current Business Stage requires. Capital/engineering hours burned on capability not needed yet. | `Mild` (1 step above diagonal) / `Acute` (2+ steps above)                                            |
| **Stage-Optimized** | Tech Complexity matches Business Stage. Aligned today. Next milestone may surface new gaps.                                  | (no severity — "Goldilocks Zone")                                                                    |
| **Under-Built**     | Tech Complexity is below what current Business Stage requires.                                                               | `Today` (current users already feeling pain) / `Tomorrow` (will fail at next stage or trigger event) |

The `Under-Built/Today` and `Under-Built/Tomorrow` sub-states map roughly to what v1-spec called "Structural Deficit" and "Scaling Ceiling" — but they are the same zone, just at different time horizons (per Gemini's collapse). The output copy uses the sub-state to differentiate urgency.

### 3.2 Modifiers (NOT separate zones — they adjust the target Tech Complexity)

These shift the user's stage-appropriate baseline Tech Complexity along the Y-axis:

- **Customer Type** — `B2B Enterprise` raises the baseline (SSO, SOC2, tenant isolation become stage-appropriate earlier). `B2C/Prosumer` lowers it. `B2B SMB` is the neutral reference. `Marketplace` raises database/data-management baselines.
- **Compliance / Regulatory** — `SOC2` raises auth/security baseline. `HIPAA` raises data-isolation + audit baseline. `PCI-DSS` raises payments/security baseline. `GDPR-only` is a minor data-management modifier. Compliance is a baseline modifier — it never moves a user to a different zone, only changes what counts as Stage-Optimized.
- **Trigger Event** — `Raise Series A`, `Upmarket-enterprise`, `10x users`, `Hire 10+ engineers`, `Due diligence imminent`, `none`. The trigger calculates a **Target Tech Complexity** = `currentStageBaseline + trigger-required-uplift`. The Stage-Fit Delta is computed against `targetTechComplexity`, NOT just `currentStageBaseline`. (Resolves Codex ISSUE 6.)
- **Team Size** — `Solo` / `2-5` / `6-15` / `16-50` / `50+` engineers. Overrides stage baseline for microservices/CTO-threshold decisions.

### 3.3 Supporting metrics (output layers, presented in Doctor's Diagnosis order)

1. **Diagnosis** — Zone name + severity sub-state (e.g., "Over-Built: Acute").
2. **Symptoms** — Stage-Fit Delta. One sentence summarizing the vector. Example: _"Your tech is built for Series B. You are at Seed with no trigger event in the next 12 months."_
3. **Prognosis** — Combined impact narrative using **Velocity Drag bands** + **Reversibility Risk count**:
   - **Velocity Drag bands** (replaces v1's hand-wavy %): `Low` (0-1 misaligned dimensions) / `Moderate` (2-3) / `High` (4-5) / `Critical` (6+). Disclaimer copy: "Diagnostic signal based on dimension misalignment, not measured engineering capacity." (Resolves Codex BLOCKER 2 + Gemini's snake-oil concern.)
   - **Reversibility Risk count** = number of high-risk irreversible dimensions in the user's profile (DB model, tenant isolation, billing architecture, framework/language are weighted irreversible).
4. **Prescription** — Tailored CTA mapped to service + 3-5 specific recommendations linked to hub spokes.

### 3.4 Risk taxonomy — strictly bound to inputs

Each tech-choice question (Q7-Q14) maps to exactly one risk category. We only score risks that the questions actually measure (per Codex ISSUE 8):

| Risk category          | Driven by question(s)                   | Reversibility weight                                                                    |
| ---------------------- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| Architecture Misfit    | Q7 (architecture style)                 | **Irreversible** (extracting from monolith or consolidating microservices is expensive) |
| Data Architecture Risk | Q8 (database + tenant isolation)        | **Irreversible** (tenant model is a one-way door)                                       |
| Velocity Risk          | Q9 (CI/CD)                              | Reversible                                                                              |
| Observability Risk     | Q10 (observability + incident response) | Reversible                                                                              |
| Security Posture Risk  | Q11 (auth + security)                   | Mixed (compliance posture is reversible; some primitives are not)                       |
| Team/Ownership Risk    | Q12 (team structure)                    | Reversible                                                                              |
| Performance Risk       | Q13 (performance approach)              | Reversible                                                                              |
| Data Management Risk   | Q14 (data management)                   | Reversible                                                                              |

**Removed from v1-spec taxonomy** because no question measures them: billing architecture, framework/language choice, test coverage, runway. (Resolves Codex ISSUE 8.)

## 4. User Flow and UX

```
┌──────────┐    ┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌────────────┐
│  Intro   │ -> │ Context Q1-Q6   │ -> │ Interstitial │ -> │ Tech Q7-Q14     │ -> │ Diagnosis  │
│  + frame │    │ (multi-step)    │    │ "loaded X    │    │ (one-page       │    │ + Gated    │
│  preview │    │                 │    │ baseline"    │    │ accordion)      │    │ Rx + CTA   │
└──────────┘    └─────────────────┘    └──────────────┘    └─────────────────┘    └────────────┘
```

The UX shift from "Survey" to "Consultation Simulator" (per Gemini's strategic recommendation):

- **Progressive output**: Interstitial between Q6 and Q7 confirms the loaded baseline ("Based on $100K MRR + B2B, mapping your tech against the Series A target since you're targeting that raise in 6 months").
- **Hot-truncate gate**: After Q9 (CI/CD), show a partial diagnosis preview ("Current signal: 2 dimensions misaligned, leaning Over-Built — finish 5 more questions to lock the zone").
- **One-page accordion for tech questions** (Q7-Q14) on a single scrolling view instead of 8 separate page transitions.

### 4.1 Questions (14 total, ~5 minutes)

**Context (Q1-Q6, multi-step):**

| #   | Question                                  | Options                                                                                                                   |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | What's your role?                         | Non-technical founder/CEO / Technical founder or CTO / Other                                                              |
| 2   | What kind of SaaS?                        | B2B Enterprise / B2B SMB / B2C/Prosumer / Marketplace                                                                     |
| 3   | Current revenue tier?                     | Pre-revenue / ≤$10K MRR / $10K-$100K MRR / $100K MRR-$1M ARR / $1M-$10M ARR / $10M+ ARR                                   |
| 4   | What's your goal in the next 6-12 months? | Raise Series A / Move upmarket to enterprise / 10x users / Hire 10+ engineers / Due diligence imminent / No specific goal |
| 5   | Compliance/regulatory posture?            | None / SOC2 needed or in progress / HIPAA / PCI-DSS / GDPR-only / Other                                                   |
| 6   | Team size?                                | Solo / 2-5 engineers / 6-15 / 16-50 / 50+                                                                                 |

**Tech-choice (Q7-Q14, one-page accordion, persona-adapted text):**

| #   | Dimension                   | CTO-vocab question                                          | Founder-vocab question                                  |
| --- | --------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| 7   | Architecture style          | "How would you describe your service architecture?"         | "How is your codebase organized?"                       |
| 8   | Database + tenant isolation | "What's your database model and tenant isolation strategy?" | "How is customer data separated and stored?"            |
| 9   | CI/CD                       | "Describe your deployment pipeline"                         | "How does your team ship code to users?"                |
| 10  | Observability               | "How do you monitor production and respond to incidents?"   | "How do you know when something's wrong in production?" |
| 11  | Auth + security             | "What's your auth and access control?"                      | "How are user accounts and permissions handled?"        |
| 12  | Team structure              | "How is engineering work owned and divided?"                | "Who's accountable for what on your engineering team?"  |
| 13  | Performance                 | "What's your approach to performance and scale testing?"    | "How do you keep the product fast under load?"          |
| 14  | Data management             | "How do you handle analytics, ETL, and data governance?"    | "How do you access and report on user/business data?"   |

Each Q7-Q14 has exactly 4 options scored 1-4 reflecting `simple → extreme` Tech Complexity for that dimension.

### 4.2 Quadrant/zone assignment algorithm (resolves Codex BLOCKER 1)

For each user submission:

```typescript
type StageFitInput = {
	persona: "founder" | "cto" | "other";
	customerType: "b2b-enterprise" | "b2b-smb" | "b2c" | "marketplace";
	revenueStage: 0 | 1 | 2 | 3 | 4 | 5; // ordinal
	triggerEvent: "series-a" | "upmarket" | "10x-users" | "hire-10" | "due-diligence" | "none";
	compliance: ("soc2" | "hipaa" | "pci" | "gdpr" | "none")[];
	teamSize: 0 | 1 | 2 | 3 | 4; // ordinal
	techAnswers: { [dim in TechDimension]: 1 | 2 | 3 | 4 }; // each scored 1-4
};

type StageFitResult = {
	zone: "over-built" | "stage-optimized" | "under-built";
	severity: "mild" | "acute" | "today" | "tomorrow" | null;
	delta: number; // signed: positive = over-built, negative = under-built
	velocityDragBand: "low" | "moderate" | "high" | "critical";
	reversibilityRiskCount: number;
	topMisalignedDimensions: [TechDimension, TechDimension, TechDimension];
	ctaBucket: CtaBucket;
};

function calculateStageFit(input: StageFitInput): StageFitResult {
	// 1. Compute targetTechComplexity per dimension
	const baseline = getStageBaseline(input.revenueStage); // returns 1-4 per dim
	const modified = applyModifiers(
		baseline,
		input.customerType,
		input.compliance,
		input.teamSize,
		input.triggerEvent
	);
	// modified[dim] is the target Tech Complexity for each dim given context

	// 2. Compute per-dimension delta
	const dimDeltas = DIMENSIONS.map((dim) => ({
		dim,
		delta: input.techAnswers[dim] - modified[dim],
		irreversible: REVERSIBILITY[dim] === "irreversible",
	}));

	// 3. Aggregate delta (sum across all 8 dimensions, signed)
	const totalDelta = dimDeltas.reduce((sum, d) => sum + d.delta, 0);

	// 4. Determine zone by total delta
	// Range: -24 to +24 (8 dims × -3 to +3 per dim)
	let zone, severity;
	if (totalDelta >= 4) {
		zone = "over-built";
		severity = totalDelta >= 10 ? "acute" : "mild";
	} else if (totalDelta <= -4) {
		zone = "under-built";
		// Today vs Tomorrow distinction: based on triggerEvent
		severity = input.triggerEvent !== "none" && totalDelta <= -8 ? "today" : "tomorrow";
	} else {
		zone = "stage-optimized";
		severity = null;
	}

	// 5. Tie-breaking: if |totalDelta| is in [4-6) AND irreversible-dim deltas conflict,
	// the irreversible direction wins (Codex BLOCKER 1 tie-break).
	const irreversibleSum = dimDeltas.filter((d) => d.irreversible).reduce((s, d) => s + d.delta, 0);
	if (
		Math.abs(totalDelta) >= 4 &&
		Math.abs(totalDelta) < 6 &&
		Math.sign(irreversibleSum) !== Math.sign(totalDelta) &&
		irreversibleSum !== 0
	) {
		// Irreversible signal overrides near-boundary zones only (totalDelta 4-5)
		zone = irreversibleSum > 0 ? "over-built" : "under-built";
		// Use zone-appropriate severity (over-built uses mild/acute; under-built uses today/tomorrow)
		if (zone === "over-built") {
			severity = Math.abs(irreversibleSum) >= 4 ? "acute" : "mild";
		} else {
			severity = input.triggerEvent !== "none" ? "today" : "tomorrow";
		}
	}

	// 6. Velocity Drag band by count of misaligned dimensions (|delta| >= 1)
	const misalignedCount = dimDeltas.filter((d) => Math.abs(d.delta) >= 1).length;
	const velocityDragBand =
		misalignedCount <= 1
			? "low"
			: misalignedCount <= 3
				? "moderate"
				: misalignedCount <= 5
					? "high"
					: "critical";

	// 7. Reversibility risk count
	const reversibilityRiskCount = dimDeltas.filter(
		(d) => d.irreversible && Math.abs(d.delta) >= 1
	).length;

	// 8. Top misaligned dimensions: filter to actually misaligned (|delta| >= 1) first,
	// then sort by |delta| descending; ties broken by irreversibility, then dimension order.
	// Return up to 3. Fully aligned users get an empty array (not arbitrary dimensions).
	const topMisalignedDimensions: TechDimension[] = [...dimDeltas]
		.filter((d) => Math.abs(d.delta) >= 1)
		.sort((a, b) => {
			const absDiff = Math.abs(b.delta) - Math.abs(a.delta);
			if (absDiff !== 0) return absDiff;
			if (a.irreversible !== b.irreversible) return a.irreversible ? -1 : 1;
			return DIMENSIONS.indexOf(a.dim) - DIMENSIONS.indexOf(b.dim);
		})
		.slice(0, 3)
		.map((d) => d.dim);

	// 9. CTA bucket
	const ctaBucket = computeCtaBucket(zone, severity, input.triggerEvent, input.customerType);

	return {
		zone,
		severity,
		delta: totalDelta,
		velocityDragBand,
		reversibilityRiskCount,
		topMisalignedDimensions,
		ctaBucket,
	};
}
```

**Boundary behavior:** explicit `if/else if/else` ladder. Tie-breaker uses irreversibility. Determinism verified by property tests (see §8).

### 4.3 Diagnosis screen — dual-track output (resolves Gemini BLOCKER 2)

Each result element has BOTH a CTO version and a Founder version. The persona from Q1 selects which copy renders.

**Example: Over-Built/Acute zone**

| Element                          | CTO version                                                                                                                       | Founder version                                                                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Diagnosis**                    | Over-Built: Acute                                                                                                                 | You're paying for tech you don't need yet                                                                                |
| **Symptoms**                     | Built for Series B+. You're at Seed with no Series A trigger in the next 12 months.                                               | Your engineering setup is built for a company 10x your current size and scale.                                           |
| **Prognosis (Velocity Drag)**    | High velocity drag: 4 of 8 dimensions misaligned. Engineering capacity is partially consumed by managing capability not used yet. | Engineering is moving slower than it should because the team is maintaining infrastructure your customers don't notice.  |
| **Prognosis (Reversibility)**    | 2 of 4 misaligned dimensions are irreversible (database model, tenant isolation). Reversal cost compounds.                        | 2 of the things you're maintaining will get expensive to undo as you grow.                                               |
| **Top misaligned (example: DB)** | Database (current: sharded; target: single Postgres with RLS).                                                                    | Customer data architecture (current: complex distributed model; target: simple single database with logical separation). |
| **Prescription (CTA)**           | Architecture review — a 4-hour session mapping a simplification path.                                                             | A 4-hour architecture session to identify what to simplify first.                                                        |

Per-zone output strings live in `src/data/saas-stagefit/copy.ts` indexed by `[zone][severity][persona]`.

### 4.4 Lead capture — gate the Prescription (resolves Gemini BLOCKER on bait-and-switch + Codex BLOCKER 3 on Beehiiv)

Output sequence on the diagnosis screen:

1. **FREE (no email gate):** Diagnosis + Symptoms + Prognosis + Matrix visual with user position + top misaligned dimensions (names only)
2. **GATED (email required):** Specific 3-step remediation plan for top misaligned dimensions + hub-spoke links + Architect's Brief subscription

UI copy on the gate (honest):

> ### Unlock Your Stage-Fit Remediation Plan
>
> Get the 3 specific architecture changes ranked by impact, with links to the playbooks behind each, and join 0 readers of The Architect's Brief — one architecture decision every Tuesday.

(0 readers is honest while newsletter is pre-launch; replace with real count after first send.)

**Lead capture form:** email + Turnstile + signed token (see below).

**Server action:** EXTEND existing `subscribeToNewsletter` to accept `customFields` and pass them through to Beehiiv (Codex BLOCKER 3 fix). New work items:

- Extend `newsletterSchema` to accept optional `customFields: z.record(z.string(), z.string()).optional()`.
- Extend the Beehiiv API request body to include `custom_fields` when provided. Beehiiv API supports this natively at `POST /publications/{id}/subscriptions`.
- Add tests that confirm `custom_fields` reach the Beehiiv call.
- Define existing-subscriber semantics: on 409 (subscriber exists), update custom fields via `PATCH /publications/{id}/subscriptions/{subscription_id}` (lookup by email). If patch unavailable on the Beehiiv plan, return success but flag `existingSubscriber: true` in the response so the UI shows different copy ("You're already subscribed — your custom report data has been updated").

**Server-recompute pattern (resolves Codex ISSUE 9):** Client submits the answers; server recomputes `StageFitResult` and stores it in `custom_fields`. Hidden client-tampered fields are never trusted for the email content. The client-side result is for UI render only.

**The Architect's Brief automation (configured in Beehiiv UI, not in repo):**

- Triggered on subscription with `source=stage-fit-quiz-v2` or `customFields.stagefit_zone != null`.
- Sends a templated welcome email that:
  1. Reads back the user's zone + severity + top misaligned dimensions
  2. Lists the 3-step remediation plan
  3. Links to the hub stage section matching their current stage
  4. Confirms newsletter cadence ("one architecture decision every Tuesday")
- Pre-launch requirement: Alex publishes Newsletter Issue #1 in Beehiiv before the v2 tool ships. This is a launch gate, not a build dependency.

## 5. CTA Routing (TUS removed; resolves Codex BLOCKER 5 + Gemini MINOR)

| Zone            | Severity / Trigger                      | Primary CTA                             | Secondary CTA                                             |
| --------------- | --------------------------------------- | --------------------------------------- | --------------------------------------------------------- |
| Stage-Optimized | —                                       | Subscribe to Architect's Brief          | Read "Next Milestone Breaking Points" guide (hub article) |
| Over-Built      | Mild                                    | Architecture review (single engagement) | Subscribe to Architect's Brief                            |
| Over-Built      | Acute                                   | Architecture review + advisory retainer | Fractional CTO retainer                                   |
| Under-Built     | Tomorrow                                | Advisory retainer                       | Strategic implementation                                  |
| Under-Built     | Today + non-funding trigger             | Strategic implementation                | Advisory retainer                                         |
| Under-Built     | Today + Raise Series A or Due Diligence | Technical due diligence                 | Advisory retainer                                         |

**All primary CTAs link to `/contact?source=stagefit&z={zone}&sev={severity}&s={stage}&t={trigger}&cust={customerType}&w={weak1,weak2,weak3}`** so Alex sees the prospect's context before they reply.

## 6. Canonical AEO Page (expanded per Gemini MAJOR)

**Path:** `/frameworks/saas-stage-fit-matrix`

**Purpose:** Standalone, definitive entity that LLMs (Perplexity, ChatGPT, Claude, Gemini) cite when asked "what is the SaaS Stage-Fit Matrix?" or "how do I assess SaaS architecture readiness?"

**Structure (semantic, citation-optimized):**

```markdown
# The SaaS Stage-Fit Matrix

## Definition [DefinedTerm JSON-LD]

Two-sentence dictionary-style definition. Authoritative voice.

## The Three Zones [DefinedTerm JSON-LD per zone]

### Over-Built

### Stage-Optimized

### Under-Built

Each H3: criteria, example, what to do about it.

## How Stage-Fit Is Calculated

Plain-language explanation of the algorithm.

## When to Use the Stage-Fit Matrix

Bulleted use cases.

## Frequently Asked Questions [FAQPage JSON-LD]

- What is the SaaS Stage-Fit Matrix?
- How is it different from DORA / AWS Well-Architected?
- What architecture should a Seed-stage SaaS use?
- How do I know if my SaaS is over-engineered?
- When should a $100K MRR SaaS adopt microservices?
- What's the difference between Under-Built Today and Under-Built Tomorrow?
- Is "monolith" always the right early-stage choice?
- Does the Stage-Fit Matrix apply to B2B and B2C SaaS the same way?
- How does compliance change my Stage-Fit baseline?
- Where do I take the diagnostic?

## Risks Surfaced by the Matrix

H3 per risk category from §3.4.

## Relationship to Other Frameworks

DORA, AWS Well-Architected, CAP — explicitly state how Stage-Fit complements vs differs.

## Take the Diagnostic

CTA to `/tools/saas-readiness`.
```

**Schema markup:** `Article` + `DefinedTerm` per zone + `FAQPage` for the Q&A section. All inline in JSON-LD, not just rich-text. Linked from llms.txt and sitemap.

**Cross-links:**

- Hub spoke pages on SaaS architecture link to this framework page in their "Related Frameworks" section.
- Newsletter Issue #1 references the matrix.
- Tool intro screen ("What is the Stage-Fit Matrix? Read the definition →" link).

## 7. Implementation Components

### 7.1 Data layer (`src/data/saas-stagefit/`)

- `types.ts` — `StageFitInput`, `StageFitResult`, `TechDimension`, `CtaBucket`, `Zone`, `Severity`, etc.
- `schemas.ts` — Zod schemas for input validation (matching `types.ts` 1:1).
- `questions.ts` — All 14 questions, each with persona-adapted text.
- `baseline-matrix.ts` — `getStageBaseline(stage)` + `applyModifiers(baseline, customerType, compliance, teamSize, triggerEvent)` — the heart of the algorithm.
- `reversibility.ts` — `REVERSIBILITY` map (which dimensions are irreversible).
- `dimensions.ts` — `DIMENSIONS` ordered list.
- `cta-routing.ts` — `computeCtaBucket(zone, severity, triggerEvent, customerType)`.
- `copy.ts` — Dual-track per-zone, per-severity, per-persona output strings.
- `recommendations.ts` — Per-dimension remediation steps + hub-spoke article links (for the gated content).

### 7.2 Domain logic (pure functions, all unit-tested)

- `calculateStageFit(input): StageFitResult`
- `getStageBaseline(stage): TechBaseline`
- `applyModifiers(baseline, ...): TechBaseline`
- `scoreDimensionRisk(actual, target, irreversible): DimensionRisk`
- `computeCtaBucket(zone, severity, trigger, customerType): CtaBucket`
- `serializeResultForUrl(result): URLSearchParams`

### 7.3 Components (`src/components/tools/stagefit/`)

- `StageFitDiagnostic.tsx` — top-level orchestrator (Server Component shell + Client Component interactive parts where needed).
- `phases/IntroScreen.tsx` — landing with framework explainer + start button.
- `phases/ContextQuestions.tsx` — Q1-Q6 multi-step.
- `phases/Interstitial.tsx` — between Q6 and Q7. "Based on $100K MRR + B2B + targeting Series A, mapping your tech against the Series A baseline."
- `phases/TechQuestions.tsx` — Q7-Q14 one-page accordion.
- `phases/HotTruncate.tsx` — partial preview at Q9.
- `phases/DiagnosisScreen.tsx` — Doctor's Diagnosis layout with free + gated zones.
- `LeadCapture.tsx` — replaces v1 EmailCapture. Includes `<Turnstile />` + signed-result hidden field + customFields passthrough.
- `MatrixVisual.tsx` — SVG-based 2-axis matrix with user position pin (post-MVP if it slips).
- `RecommendationCard.tsx` — per-misaligned-dimension card with hub link (in gated content).
- `analytics.ts` — typed event names + payload schemas (see §7.6).

### 7.4 Server action extension (`src/app/actions/newsletter.ts`)

Extend the existing action (don't fork):

- Add optional `customFields` to `newsletterSchema` as `z.record(z.string(), z.string()).optional()`.
- Transform `customFields` from `Record<string, string>` to Beehiiv's required array shape `[{ name: string, value: string }]` before posting (Beehiiv API rejects flat object format).
- **Pre-create custom fields in Beehiiv dashboard** before first use — Beehiiv silently discards fields that don't exist in the publication's field schema. Fields needed: `stagefit_zone`, `stagefit_severity`, `stagefit_delta`, `velocity_drag_band`, `reversibility_risk_count`, `top_misaligned_1`, `top_misaligned_2`, `top_misaligned_3`, `persona`, `customer_type`, `revenue_stage`, `trigger_event`.
- Pass `custom_fields` to Beehiiv API request body at `POST /publications/{id}/subscriptions`.
- Handle 409 existing-subscriber path: update by email via `PUT /publications/{id}/subscriptions` (by-email endpoint, per Beehiiv docs). Return `existingSubscriber: true` in response.
- Add unit tests verifying: customFields reach Beehiiv payload in array `[{name, value}]` format; 409 path triggers PUT update; missing custom fields on Beehiiv side doesn't crash (degrades to no custom data).

### 7.5 Result-token signing (`src/lib/stagefit-token.ts`)

- `signResult(result): string` — HMAC-SHA256 over the canonical JSON of `StageFitResult` using a secret env var. Returned as a base64url token.
- `verifyResult(token): StageFitResult | null` — verifies signature server-side before trusting submitted result for email content.
- Secret env var: `STAGEFIT_RESULT_SIGNING_KEY` (added to required Worker secrets and GH Actions secrets).
- Why: prevents client tampering of submitted quadrant/weakest dimensions, per Codex ISSUE 9.

### 7.6 Framework canonical page (`src/app/frameworks/saas-stage-fit-matrix/page.tsx`)

- Server Component.
- Imports from `@/data/saas-stagefit/copy.ts` for zone definitions so the page and the tool stay in sync.
- JSON-LD: Article + DefinedTerm (one per zone) + FAQPage.
- Linked from `src/app/llms.txt/route.ts` + `src/app/sitemap.ts` + relevant hub spokes.

### 7.7 Analytics events (typed payloads)

`src/components/tools/stagefit/analytics.ts`:

```typescript
export const STAGEFIT_EVENTS = {
	start: { quiz_id: string }, // fired on intro mount
	persona_selected: { quiz_id, persona },
	context_complete: {
		quiz_id,
		persona,
		customer_type,
		revenue_stage,
		trigger_event,
		compliance,
		team_size,
	},
	interstitial_viewed: { quiz_id },
	hot_truncate_viewed: { quiz_id, leaning_zone },
	question_answered: { quiz_id, question_id, answer_value, time_on_question_ms },
	abandoned: { quiz_id, last_question_id, completion_pct }, // single fire on unmount/beforeunload only if NOT completed
	complete: {
		quiz_id,
		zone,
		severity,
		velocity_drag_band,
		reversibility_risk_count,
		time_total_ms,
	},
	cta_click: { quiz_id, cta_label, cta_destination, zone, severity },
	lead_capture_attempt: { quiz_id, zone },
	lead_capture_success: { quiz_id, zone, existing_subscriber },
	lead_capture_failure: { quiz_id, zone, reason },
} as const;
```

Abandonment effect: single mount/unmount effect using refs ONLY for state inspection. NO dependencies on `phase` or `currentIndex`. (Resolves Codex's abandonment-cleanup bug from v1.)

## 8. Testing Strategy

### 8.1 Unit tests (Vitest)

- `tests/data/saas-stagefit/calculate.test.ts`:
  - **Property test**: generate `N=1000` valid StageFitInput combinations, assert `calculateStageFit` produces exactly one of `over-built | stage-optimized | under-built`, and severity matches the zone schema (e.g., never `today` when zone is `stage-optimized`).
  - Fixture: Seed + microservices (totalDelta>=10) → Over-Built/Acute, irreversible count ≥1.
  - Fixture: $1M ARR + manual deploys (totalDelta<=-10) → Under-Built/Today (with trigger) or /Tomorrow (without).
  - Fixture: B2B Enterprise pre-SOC2 → security baseline raised + appropriate target.
  - Fixture: trigger=series-a + missing observability → target tech adjusted, observability counted as misaligned even at current stage.
  - Tie-breaker test: irreversible-dim conflict near zero totalDelta → irreversible direction wins.
  - Boundary test: totalDelta=4 → "over-built mild", totalDelta=-4 → "under-built tomorrow", totalDelta=3 → "stage-optimized".

- `tests/data/saas-stagefit/baseline-matrix.test.ts`:
  - `applyModifiers` raises auth baseline by ≥1 when compliance includes "soc2".
  - `applyModifiers` raises tenant baseline by ≥1 when customerType is "b2b-enterprise".
  - `applyModifiers` raises target by trigger-specific uplift when triggerEvent ≠ "none".

- `tests/data/saas-stagefit/cta-routing.test.ts`:
  - Each (zone × severity × trigger × customerType) combination maps to expected CTA bucket.

- `tests/lib/stagefit-token.test.ts`:
  - Signed token verifies; tampered token rejected; missing-key path errors loudly.

- `tests/actions/newsletter.test.ts` (extended):
  - `customFields` are forwarded to Beehiiv API request body.
  - Existing-subscriber (409) path triggers PATCH and returns `existingSubscriber: true`.

### 8.2 Component tests (RTL)

- `tests/components/tools/stagefit/full-flow.test.tsx`:
  - Each persona × each terminal zone (3 zones × 2 personas = 6 flows minimum).
  - Verifies vocabulary swap renders correctly between personas.
  - Verifies free content shows before gate; gated content does not show before submit.

- `tests/components/tools/stagefit/lead-capture.test.tsx`:
  - Form submits Turnstile token; submits signed result; error path renders.
  - Existing subscriber state renders correct copy.

- `tests/components/tools/stagefit/cta-href.test.tsx`:
  - CTA href contains all required query params, URL-encoded correctly.

- `tests/components/tools/stagefit/abandonment.test.tsx` (regression for v1 bug):
  - Answering 14 questions never fires `abandoned` event.
  - Unmount mid-flow fires exactly ONE `abandoned` event with correct `last_question_id`.

### 8.3 E2E (Playwright, when stable)

- Happy path per zone (3 tests, each persona).
- Lead capture success → Beehiiv mock verifies customFields payload.
- Mobile + chromium parity for the accordion UI.

### 8.4 Schema validation

- Test that `/frameworks/saas-stage-fit-matrix` renders valid JSON-LD per Google Rich Results structure (DefinedTerm + FAQPage + Article).

## 9. Migration and Rollout

### 9.1 Feature-flag mechanism

Use an env-var-driven flag, not GrowthBook (overkill for one-tenant binary toggle):

- Env var: `NEXT_PUBLIC_STAGEFIT_V2_ENABLED` (`true` | `false`).
- Set via `wrangler secret put` AND GitHub Actions secret.
- Read in `src/app/tools/saas-readiness/page.tsx`:
  ```typescript
  const v2Enabled = process.env.NEXT_PUBLIC_STAGEFIT_V2_ENABLED === "true";
  return v2Enabled ? <StageFitDiagnostic /> : <SaasReadinessQuiz />;
  ```

### 9.2 Rollout sequence (resolves Codex BLOCKER 4)

1. **Patch v1 immediately** (out of this spec's scope, but pre-requirement): either disable the v1 EmailCapture form (UI shows "Email capture temporarily unavailable") OR add Turnstile to v1. Most efficient is option A — disable the form so the false PDF promise stops being made. File as separate `amdev-???` ticket.
2. Build v2 on `feat/stage-fit-matrix-v2`. Feature flag defaults to `false` in all environments.
3. Ship v2 to production with flag OFF. v1 still renders for users; v2 code lives in repo but not exposed.
4. Test v2 in production preview by setting `NEXT_PUBLIC_STAGEFIT_V2_ENABLED=true` only in a preview environment.
5. Newsletter dependency: Alex publishes Issue #1 in Beehiiv. The Architect's Brief automation is configured.
6. Verify Beehiiv automation in production preview: submit a test lead, confirm email arrives with correct templated results.
7. Enable flag in production: `wrangler secret put NEXT_PUBLIC_STAGEFIT_V2_ENABLED` set to `true`, redeploy.
8. Monitor for 1 week. If healthy: delete v1 files (`src/data/saas-readiness.ts`, `src/components/tools/saas-readiness-quiz.tsx`, related v1 tests). Remove the feature flag conditional. Promote v2 to the default code path.

### 9.3 Rollback

If a critical bug surfaces post-launch:

- Set `NEXT_PUBLIC_STAGEFIT_V2_ENABLED=false` in Worker secrets, redeploy.
- v1 renders again. Fix v2 in branch. Re-enable.
- DO NOT delete v1 until rollback isn't needed (Step 8 above).

## 10. Acceptance Criteria (all measurable)

- All 14 questions render correctly for both `persona = founder | cto`. RTL test verifies vocabulary swap.
- `calculateStageFit` is deterministic per the algorithm in §4.2. Property test over 1000 generated inputs: zero invalid `(zone, severity)` pairs.
- Tie-breaker test: irreversible-dim conflict at `|totalDelta|<6` resolves in the irreversible direction. Fixture test.
- Stage-Fit Delta is signed and correctly reflects `actualTechSum - targetTechSum`. Fixture test.
- Velocity Drag band is one of `low|moderate|high|critical` and matches the misaligned-count bucketing. Fixture test.
- Reversibility risk count matches the count of irreversible dimensions with `|delta|>=1`. Fixture test.
- Lead capture form submits Turnstile token AND signed result token AND customFields to Beehiiv. Integration test against mock.
- Signed result token verifies on server; tampered token rejected with 400. Unit test.
- Existing-subscriber (409) path returns `existingSubscriber: true` and triggers PATCH for customFields update. Integration test.
- CTA href contains `source=stagefit`, `z`, `sev`, `s`, `t`, `cust`, `w` query params; all URL-encoded. Unit test.
- `/frameworks/saas-stage-fit-matrix` returns 200 in production. Smoke test.
- That page renders valid `Article` + `DefinedTerm` + `FAQPage` JSON-LD. Schema validator test (e.g., via `schema-dts`).
- The framework page is in `sitemap.xml` and referenced in `llms.txt`. Unit tests on those generators.
- v1 files deleted after Step 8 of rollout; no broken imports anywhere. `npm run build` green.
- All Vitest + RTL + Playwright tests pass.
- `npm run build` green throughout development.
- Codex audit-review of full diff: GREENLIT.
- Beehiiv test subscription with `source=stage-fit-quiz-v2` triggers the Architect's Brief welcome automation; templated email lands within 5 minutes. Manual verification before flag enable.
- Newsletter Issue #1 published in Beehiiv before flag enable. Manual verification.

## 11. Risks and Open Questions

| ID  | Risk                                                                                                               | Mitigation                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| R1  | Beehiiv welcome automation must be configured in Beehiiv UI before launch                                          | Launch gate: manual verification step (Step 6 of rollout)                                                                    |
| R2  | Newsletter publishing cadence — "every Tuesday" promise erodes trust if it slips                                   | Alex commits to cadence OR copy softens to "occasional architecture insights"                                                |
| R3  | 14 questions is high-friction even with accordion + hot truncate                                                   | Friction = filter for advisory leads. Monitor abandonment after launch; if `abandoned_pct > 50%`, revisit question count     |
| R4  | Signing-key rotation: if `STAGEFIT_RESULT_SIGNING_KEY` rotates mid-session, in-flight result tokens become invalid | Document key rotation runbook; key rotation invalidates open quiz sessions (acceptable)                                      |
| R5  | Beehiiv PATCH endpoint availability on current plan unverified                                                     | Verify before launch; if PATCH unavailable, accept that existing subscribers don't get re-personalized email and adjust copy |
| R6  | Feature-flag rollback workflow untested                                                                            | Practice flag toggle in staging before launch                                                                                |
| R7  | Accessibility of accordion + matrix visual                                                                         | a11y-axe test in component test suite; keyboard nav verified                                                                 |
| R8  | Property-test coverage gaps (only N=1000 generated)                                                                | Document the input space; expand N if specific zones are under-sampled                                                       |
| R9  | Privacy/consent for architecture answers (PII-adjacent at scale)                                                   | Add brief note on intro: "Your answers are used only to compute your Stage-Fit position. We don't sell or share."            |
| R10 | Client-side tampering of submitted result (without signing)                                                        | Resolved by §7.5 result-token signing                                                                                        |
| R11 | Hot-truncate gives information that lets users game their answers                                                  | Acceptable — qualified leads finish anyway                                                                                   |

**Open questions for user before/during implementation:**

- OQ1: Should the matrix visual ship in MVP or v2.1? (Default: MVP if dev time permits; otherwise v2.1.)
- OQ2: Should anonymous results persist in `localStorage` for return visits? (Default: yes — minimal effort, high UX value.)
- OQ3: Public share URL for results? (Default: defer to v2.1.)
- OQ4: What's the exact Beehiiv publication plan / API tier? Verify PATCH endpoint availability.
- OQ5: Is `NEXT_PUBLIC_STAGEFIT_V2_ENABLED` the right name, or use `STAGEFIT_V2_ENABLED` (server-only, less public)?

## 12. References

- Existing tool: `src/data/saas-readiness.ts`, `src/components/tools/saas-readiness-quiz.tsx`, `src/app/tools/saas-readiness/page.tsx`
- Existing newsletter action: `src/app/actions/newsletter.ts`
- Hub content: `content/blog/saas-architecture-decision-framework.mdx`, `content/blog/zero-to-10k-mrr-saas-playbook.mdx`, `content/blog/technical-debt-strategy.mdx`
- Newsletter: `content/newsletter/` (36 drafts, 0 sent as of 2026-05-24)
- Services positioning: `src/app/services/services-page-content.tsx`, `src/data/pseo/pages.ts`
- TUS portfolio entry (NOT in this funnel): `src/data/projects.ts` (id: `unsexy-stack`)
- Three-brain review records:
  - `/tmp/gemini-review-saas-readiness.txt` (v1 RETHINK-SHAPE)
  - `/tmp/gemini-positioning-review.txt` (positioning CHANGES-REQUESTED)
  - `/tmp/gemini-framework-review.txt` (framework REVISE)
  - `/tmp/gemini-spec-review.txt` (this spec v1 RETHINK-SHAPE)
- Beads tickets (separate, out of scope):
  - `amdev-zyg` — LISTMONK\_\* env type cleanup
  - `amdev-3ju` — Playwright pre-existing failures
  - `amdev-hyx` — Claude Pilot full retirement decision
- New beads ticket to file: patch v1 EmailCapture (disable form OR add Turnstile) BEFORE v2 work begins.
