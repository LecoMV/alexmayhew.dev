import { describe, expect, it } from "vitest";

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

	it("canonical JSON order — keys in different order produce same signature", () => {
		const a: StageFitResult = {
			zone: "over-built",
			severity: "mild",
			delta: 5,
			velocityDragBand: "moderate",
			reversibilityRiskCount: 1,
			topMisalignedDimensions: ["architecture"],
			ctaBucket: "architecture-review",
		};
		const b: StageFitResult = {
			ctaBucket: "architecture-review",
			topMisalignedDimensions: ["architecture"],
			reversibilityRiskCount: 1,
			velocityDragBand: "moderate",
			delta: 5,
			severity: "mild",
			zone: "over-built",
		};
		expect(signResult(a, "test")).toBe(signResult(b, "test"));
	});
});
