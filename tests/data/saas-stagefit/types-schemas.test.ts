import { describe, expect, it } from "vitest";

import { stageFitInputSchema, stageFitResultSchema } from "@/data/saas-stagefit/schemas";

import type { StageFitInput, StageFitResult, TechDimension } from "@/data/saas-stagefit/types";

const ALL_DIMENSIONS: TechDimension[] = [
	"architecture",
	"database",
	"cicd",
	"observability",
	"security",
	"team",
	"performance",
	"data",
];

describe("stageFitInputSchema", () => {
	it("validates a correct input", () => {
		const input: StageFitInput = {
			persona: "cto",
			customerType: "b2b-smb",
			revenueStage: 1,
			triggerEvent: "none",
			compliance: ["none"],
			teamSize: 1,
			techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 1])) as Record<
				TechDimension,
				1
			>,
		};
		const result = stageFitInputSchema.safeParse(input);
		expect(result.success).toBe(true);
	});

	it("rejects invalid persona", () => {
		const result = stageFitInputSchema.safeParse({
			persona: "invalid",
			customerType: "b2b-smb",
			revenueStage: 1,
			triggerEvent: "none",
			compliance: ["none"],
			teamSize: 1,
			techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 1])),
		});
		expect(result.success).toBe(false);
	});

	it("rejects tech score outside 1-4", () => {
		const result = stageFitInputSchema.safeParse({
			persona: "cto",
			customerType: "b2b-smb",
			revenueStage: 1,
			triggerEvent: "none",
			compliance: ["none"],
			teamSize: 1,
			techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 5])),
		});
		expect(result.success).toBe(false);
	});

	it("accepts compliance 'other' (R2 fix)", () => {
		const result = stageFitInputSchema.safeParse({
			persona: "founder",
			customerType: "b2b-enterprise",
			revenueStage: 2,
			triggerEvent: "series-a",
			compliance: ["other"],
			teamSize: 2,
			techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 2])),
		});
		expect(result.success).toBe(true);
	});
});

describe("stageFitResultSchema", () => {
	it("validates a correct result", () => {
		const result: StageFitResult = {
			zone: "over-built",
			severity: "acute",
			delta: 12,
			velocityDragBand: "high",
			reversibilityRiskCount: 2,
			topMisalignedDimensions: ["architecture", "database", "cicd"],
			ctaBucket: "architecture-review",
		};
		expect(stageFitResultSchema.safeParse(result).success).toBe(true);
	});

	it("validates stage-optimized with null severity", () => {
		const result: StageFitResult = {
			zone: "stage-optimized",
			severity: null,
			delta: 0,
			velocityDragBand: "low",
			reversibilityRiskCount: 0,
			topMisalignedDimensions: [],
			ctaBucket: "newsletter-only",
		};
		expect(stageFitResultSchema.safeParse(result).success).toBe(true);
	});

	it("rejects invalid zone", () => {
		expect(
			stageFitResultSchema.safeParse({
				zone: "invalid",
				severity: null,
				delta: 0,
				velocityDragBand: "low",
				reversibilityRiskCount: 0,
				topMisalignedDimensions: [],
				ctaBucket: "newsletter-only",
			}).success
		).toBe(false);
	});
});
