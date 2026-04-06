import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SaasReadinessQuiz } from "@/components/tools/saas-readiness-quiz";
import { QUIZ_QUESTIONS } from "@/data/saas-readiness";

describe("SaasReadinessQuiz", () => {
	it("renders the intro screen with start button", () => {
		render(<SaasReadinessQuiz />);
		expect(screen.getByText("SaaS Scaling Readiness Assessment")).toBeTruthy();
		expect(screen.getByRole("button", { name: /start assessment/i })).toBeTruthy();
	});

	it("shows first question after clicking start", () => {
		render(<SaasReadinessQuiz />);
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));
		expect(screen.getByText(/How would you describe your current architecture/)).toBeTruthy();
		expect(screen.getByText("1 of 8")).toBeTruthy();
	});

	it("advances through all questions and shows results", () => {
		render(<SaasReadinessQuiz />);
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
			const buttons = screen.getAllByRole("button");
			fireEvent.click(buttons[0]);
		}

		expect(screen.getByText("Your Results")).toBeTruthy();
	});

	it("shows correct tier when all minimum answers selected", () => {
		render(<SaasReadinessQuiz />);
		fireEvent.click(screen.getByRole("button", { name: /start assessment/i }));

		for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
			const buttons = screen.getAllByRole("button");
			fireEvent.click(buttons[0]);
		}

		expect(screen.getByText("Foundation Building")).toBeTruthy();
		expect(screen.getByRole("link", { name: /book a strategy call/i })).toBeTruthy();
	});
});
