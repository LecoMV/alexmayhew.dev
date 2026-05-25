import { describe, expect, it } from "vitest";

import { applyModifiers, getStageBaseline } from "@/data/saas-stagefit/baseline-matrix";

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

	it("mid-range stages (2, 3) have elevated baselines above seed", () => {
		const stage2 = getStageBaseline(2);
		const stage3 = getStageBaseline(3);
		const seedSum = Object.values(getStageBaseline(0)).reduce((a, b) => a + b, 0);
		const sum2 = Object.values(stage2).reduce((a, b) => a + b, 0);
		const sum3 = Object.values(stage3).reduce((a, b) => a + b, 0);
		expect(sum2).toBeGreaterThan(seedSum);
		expect(sum3).toBeGreaterThan(sum2);
	});

	it("highest stage (5) has baselines at least as high as stage 4", () => {
		const stage4 = getStageBaseline(4);
		const stage5 = getStageBaseline(5);
		const sum4 = Object.values(stage4).reduce((a, b) => a + b, 0);
		const sum5 = Object.values(stage5).reduce((a, b) => a + b, 0);
		expect(sum5).toBeGreaterThanOrEqual(sum4);
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
		expect(modified.observability).toBeGreaterThanOrEqual(base.observability + 1);
	});

	it("large team (size >= 3) raises team and cicd baselines", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-smb", ["none"], 3, "none");
		expect(modified.team).toBeGreaterThan(base.team);
		expect(modified.cicd).toBeGreaterThan(base.cicd);
	});

	it("marketplace raises database and data baselines", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "marketplace", ["none"], 1, "none");
		expect(modified.database).toBeGreaterThan(base.database);
		expect(modified.data).toBeGreaterThan(base.data);
	});

	it("trigger event 'hire-10' raises team and cicd", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-smb", ["none"], 1, "hire-10");
		expect(modified.team).toBeGreaterThan(base.team);
		expect(modified.cicd).toBeGreaterThan(base.cicd);
	});

	it("trigger event 'upmarket' raises security and database", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-smb", ["none"], 1, "upmarket");
		expect(modified.security).toBeGreaterThan(base.security);
		expect(modified.database).toBeGreaterThan(base.database);
	});

	it("trigger event '10x-users' raises performance baseline", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-smb", ["none"], 1, "10x-users");
		expect(modified.performance).toBeGreaterThan(base.performance);
	});

	it("trigger event 'due-diligence' raises observability baseline", () => {
		const base = getStageBaseline(1);
		const modified = applyModifiers(base, "b2b-smb", ["none"], 1, "due-diligence");
		expect(modified.observability).toBeGreaterThan(base.observability);
	});

	it("baselines never exceed 4 even with stacked modifiers", () => {
		const base = getStageBaseline(4);
		const modified = applyModifiers(base, "b2b-enterprise", ["soc2", "hipaa"], 4, "series-a");
		for (const v of Object.values(modified)) {
			expect(v).toBeLessThanOrEqual(4);
		}
	});
});
