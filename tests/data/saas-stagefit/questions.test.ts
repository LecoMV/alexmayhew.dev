import { describe, expect, it } from "vitest";

import { QUIZ_QUESTIONS } from "@/data/saas-stagefit/questions";

describe("Quiz questions structural validation", () => {
	it("has exactly 14 questions", () => {
		expect(QUIZ_QUESTIONS).toHaveLength(14);
	});
});
