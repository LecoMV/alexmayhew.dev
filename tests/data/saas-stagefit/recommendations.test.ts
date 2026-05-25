import { describe, expect, it } from "vitest";

import { DIMENSIONS } from "@/data/saas-stagefit/dimensions";
import { getRecommendation } from "@/data/saas-stagefit/recommendations";

describe("getRecommendation", () => {
	it("returns recommendation with title and hubLink for every dimension", () => {
		for (const dim of DIMENSIONS) {
			const rec = getRecommendation(dim);
			expect(rec.title).toBeTruthy();
			expect(rec.description).toBeTruthy();
			expect(rec.hubLink).toMatch(/^\//);
		}
	});
});
