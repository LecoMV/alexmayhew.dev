import { describe, expect, it } from "vitest";

import { QUIZ_QUESTIONS } from "@/data/saas-stagefit/questions";

describe("Quiz questions structural validation", () => {
	it("has exactly 14 questions", () => {
		expect(QUIZ_QUESTIONS).toHaveLength(14);
	});

	it("every question has both persona text variants", () => {
		for (const q of QUIZ_QUESTIONS) {
			expect(q.questionCto).toBeTruthy();
			expect(q.questionFounder).toBeTruthy();
		}
	});

	it("tech questions (Q7-Q14) each have exactly 4 options scored 1-4", () => {
		const techQs = QUIZ_QUESTIONS.filter((q) => q.kind === "tech");
		expect(techQs).toHaveLength(8);
		for (const q of techQs) {
			if (q.kind !== "tech") continue;
			expect(q.options).toHaveLength(4);
			const scores = q.options.map((o) => o.score);
			expect(scores).toEqual([1, 2, 3, 4]);
		}
	});

	it("tech questions each have a unique dimension assigned", () => {
		const techQs = QUIZ_QUESTIONS.filter((q) => q.kind === "tech");
		const dims = techQs.map((q) => (q.kind === "tech" ? q.dimension : null));
		const unique = new Set(dims);
		expect(unique.size).toBe(8);
	});
});
