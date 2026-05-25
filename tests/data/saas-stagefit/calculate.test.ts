import { describe, expect, it } from "vitest";

import { calculateStageFit } from "@/data/saas-stagefit/calculate";

import type { StageFitInput, TechDimension, TechScore } from "@/data/saas-stagefit/types";

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

function makeInput(overrides: Partial<StageFitInput> = {}): StageFitInput {
	return {
		persona: "cto",
		customerType: "b2b-smb",
		revenueStage: 1,
		triggerEvent: "none",
		compliance: ["none"],
		teamSize: 1,
		techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 1])) as Record<TechDimension, 1>,
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
				techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 4])) as Record<
					TechDimension,
					4
				>,
			})
		);
		expect(result.zone).toBe("over-built");
		expect(result.severity).toBe("acute");
	});

	it("scale stage + all-simple tech → under-built", () => {
		const result = calculateStageFit(makeInput({ revenueStage: 4 }));
		expect(result.zone).toBe("under-built");
	});

	it("reversibility risk counts only irreversible misaligned dims", () => {
		const result = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: Object.fromEntries(
					ALL_DIMENSIONS.map((d) => [
						d,
						d === "architecture" || d === "database" || d === "cicd" ? 4 : 1,
					])
				) as Record<TechDimension, 1 | 4>,
			})
		);
		expect(result.reversibilityRiskCount).toBe(2);
	});

	it("velocity drag band reflects misaligned dimension count", () => {
		const result = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: Object.fromEntries(
					ALL_DIMENSIONS.map((d) => [d, d === "architecture" || d === "database" ? 4 : 1])
				) as Record<TechDimension, 1 | 4>,
			})
		);
		expect(result.velocityDragBand).toBe("moderate");
	});

	it("fully aligned user gets empty topMisalignedDimensions", () => {
		const result = calculateStageFit(makeInput({ revenueStage: 0 }));
		expect(result.topMisalignedDimensions).toHaveLength(0);
	});

	it("returns top 3 misaligned dimensions sorted by |delta| then irreversibility", () => {
		const result = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 4])) as Record<
					TechDimension,
					4
				>,
			})
		);
		expect(result.topMisalignedDimensions).toHaveLength(3);
		expect(result.topMisalignedDimensions[0]).toBe("architecture");
		expect(result.topMisalignedDimensions[1]).toBe("database");
	});

	it("ctaBucket matches zone routing", () => {
		const overBuilt = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, 4])) as Record<
					TechDimension,
					4
				>,
			})
		);
		expect(overBuilt.ctaBucket).toBe("fractional-cto");
	});

	it("boundary: totalDelta=4 → over-built/mild, 3 → stage-optimized", () => {
		const delta4 = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: {
					architecture: 2,
					database: 2,
					cicd: 2,
					observability: 2,
					security: 1,
					team: 1,
					performance: 1,
					data: 1,
				},
			})
		);
		expect(delta4.zone).toBe("over-built");
		expect(delta4.severity).toBe("mild");
		expect(delta4.delta).toBe(4);

		const delta3 = calculateStageFit(
			makeInput({
				revenueStage: 0,
				techAnswers: {
					architecture: 2,
					database: 2,
					cicd: 2,
					observability: 1,
					security: 1,
					team: 1,
					performance: 1,
					data: 1,
				},
			})
		);
		expect(delta3.zone).toBe("stage-optimized");
		expect(delta3.severity).toBeNull();
		expect(delta3.delta).toBe(3);
	});

	it("tie-breaker: irreversible direction overrides near-boundary zone", () => {
		const result = calculateStageFit(
			makeInput({
				revenueStage: 3,
				techAnswers: {
					architecture: 1,
					database: 1,
					cicd: 4,
					observability: 4,
					security: 4,
					team: 2,
					performance: 2,
					data: 2,
				},
			})
		);
		expect(result.delta).toBe(4);
		expect(result.zone).toBe("under-built");
	});

	it("produces valid zone/severity pairs across all stage/score combinations", () => {
		const stages = [0, 1, 2, 3, 4, 5] as const;
		const scores = [1, 2, 3, 4] as const;
		for (const stage of stages) {
			for (const score of scores) {
				const result = calculateStageFit(
					makeInput({
						revenueStage: stage,
						techAnswers: Object.fromEntries(ALL_DIMENSIONS.map((d) => [d, score])) as Record<
							TechDimension,
							typeof score
						>,
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
