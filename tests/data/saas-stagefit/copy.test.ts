import { describe, expect, it } from "vitest";

import { getZoneCopy } from "@/data/saas-stagefit/copy";

describe("getZoneCopy", () => {
	it("returns CTO and Founder copy for over-built/acute", () => {
		const cto = getZoneCopy("over-built", "acute", "cto");
		expect(cto.diagnosis).toBeTruthy();
		expect(cto.symptoms).toBeTruthy();
		expect(cto.prognosisVelocity).toBeTruthy();
		expect(cto.prescriptionCta).toBeTruthy();

		const founder = getZoneCopy("over-built", "acute", "founder");
		expect(founder.diagnosis).toBeTruthy();
		expect(founder.diagnosis).not.toBe(cto.diagnosis);
	});

	it("returns copy for over-built/mild", () => {
		const copy = getZoneCopy("over-built", "mild", "cto");
		expect(copy.diagnosis).toBeTruthy();
	});

	it("returns copy for stage-optimized", () => {
		const copy = getZoneCopy("stage-optimized", null, "founder");
		expect(copy.diagnosis).toBeTruthy();
	});

	it("returns copy for under-built/tomorrow", () => {
		const copy = getZoneCopy("under-built", "tomorrow", "cto");
		expect(copy.diagnosis).toBeTruthy();
	});

	it("returns copy for under-built/today", () => {
		const copy = getZoneCopy("under-built", "today", "founder");
		expect(copy.diagnosis).toBeTruthy();
	});
});
