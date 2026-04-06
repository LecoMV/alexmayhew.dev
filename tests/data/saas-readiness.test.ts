import { describe, expect, it } from "vitest";

import {
	calculateScore,
	getCategoryResults,
	getResultTier,
	getWeakestCategories,
	QUIZ_QUESTIONS,
} from "@/data/saas-readiness";

describe("saas-readiness data", () => {
	it("has exactly 8 questions", () => {
		expect(QUIZ_QUESTIONS).toHaveLength(8);
	});

	it("each question has 4 options scored 1-4", () => {
		for (const q of QUIZ_QUESTIONS) {
			expect(q.options).toHaveLength(4);
			const scores = q.options.map((o) => o.score);
			expect(scores).toEqual([1, 2, 3, 4]);
		}
	});

	it("calculateScore returns 25% when all answers are minimum", () => {
		const answers: Record<string, number> = {};
		for (const q of QUIZ_QUESTIONS) {
			answers[q.id] = 1;
		}
		const result = calculateScore(answers);
		expect(result.totalScore).toBe(8);
		expect(result.maxScore).toBe(32);
		expect(result.percent).toBe(25);
	});

	it("getResultTier returns correct tier for each boundary", () => {
		expect(getResultTier(25).id).toBe("foundation");
		expect(getResultTier(39).id).toBe("foundation");
		expect(getResultTier(40).id).toBe("growth");
		expect(getResultTier(69).id).toBe("growth");
		expect(getResultTier(70).id).toBe("scale");
		expect(getResultTier(89).id).toBe("scale");
		expect(getResultTier(90).id).toBe("enterprise");
		expect(getResultTier(100).id).toBe("enterprise");
	});

	it("getCategoryResults returns per-category percentages", () => {
		const answers = { architecture: 3, database: 1 };
		const results = getCategoryResults(answers);
		expect(results).toHaveLength(QUIZ_QUESTIONS.length);
		const arch = results.find((r) => r.category === "Architecture");
		const db = results.find((r) => r.category === "Database");
		expect(arch?.percent).toBe(75);
		expect(db?.percent).toBe(25);
	});

	it("getWeakestCategories returns the N lowest-scoring categories", () => {
		const answers: Record<string, number> = {
			architecture: 4,
			database: 1,
			cicd: 2,
			observability: 4,
			security: 3,
			team: 1,
			performance: 4,
			data: 2,
		};
		const categories = getCategoryResults(answers);
		const weakest = getWeakestCategories(categories, 3);
		expect(weakest).toHaveLength(3);
		const weakNames = weakest.map((w) => w.category);
		expect(weakNames).toContain("Database");
		expect(weakNames).toContain("Team");
	});
});
