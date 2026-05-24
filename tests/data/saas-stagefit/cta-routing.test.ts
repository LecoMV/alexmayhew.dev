import { describe, expect, it } from "vitest";

import { computeCtaBucket, serializeResultForUrl } from "@/data/saas-stagefit/cta-routing";

import type { StageFitInput, StageFitResult, TechDimension } from "@/data/saas-stagefit/types";

describe("computeCtaBucket", () => {
	it("stage-optimized → newsletter-only", () => {
		expect(computeCtaBucket("stage-optimized", null, "none", "b2b-smb")).toBe("newsletter-only");
	});

	it("over-built/mild → architecture-review", () => {
		expect(computeCtaBucket("over-built", "mild", "none", "b2b-smb")).toBe("architecture-review");
	});

	it("over-built/acute → fractional-cto", () => {
		expect(computeCtaBucket("over-built", "acute", "none", "b2b-smb")).toBe("fractional-cto");
	});

	it("under-built/tomorrow → advisory-retainer", () => {
		expect(computeCtaBucket("under-built", "tomorrow", "none", "b2b-smb")).toBe(
			"advisory-retainer"
		);
	});

	it("under-built/today + non-funding trigger → strategic-implementation", () => {
		expect(computeCtaBucket("under-built", "today", "10x-users", "b2b-smb")).toBe(
			"strategic-implementation"
		);
	});

	it("under-built/today + series-a → technical-due-diligence", () => {
		expect(computeCtaBucket("under-built", "today", "series-a", "b2b-smb")).toBe(
			"technical-due-diligence"
		);
	});
});

describe("serializeResultForUrl", () => {
	it("includes all required query params", () => {
		const dims: TechDimension[] = [
			"architecture",
			"database",
			"cicd",
			"observability",
			"security",
			"team",
			"performance",
			"data",
		];
		const input: StageFitInput = {
			persona: "cto",
			customerType: "b2b-enterprise",
			revenueStage: 3,
			triggerEvent: "series-a",
			compliance: ["soc2"],
			teamSize: 2,
			techAnswers: Object.fromEntries(dims.map((d) => [d, 2])) as Record<TechDimension, 2>,
		};
		const result: StageFitResult = {
			zone: "under-built",
			severity: "today",
			delta: -8,
			velocityDragBand: "high",
			reversibilityRiskCount: 2,
			topMisalignedDimensions: ["architecture", "database"],
			ctaBucket: "technical-due-diligence",
		};
		const params = serializeResultForUrl(input, result);
		expect(params.get("source")).toBe("stagefit");
		expect(params.get("z")).toBe("under-built");
		expect(params.get("sev")).toBe("today");
		expect(params.get("s")).toBe("3");
		expect(params.get("t")).toBe("series-a");
		expect(params.get("cust")).toBe("b2b-enterprise");
		expect(params.get("w")).toBe("architecture,database");
	});
});
