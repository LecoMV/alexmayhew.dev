import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TechQuestions } from "@/components/tools/stagefit/phases/TechQuestions";

import type { TechBaseline } from "@/data/saas-stagefit/baseline-matrix";

const STAGE_0_BASELINE: TechBaseline = {
	architecture: 1,
	database: 1,
	cicd: 1,
	observability: 1,
	security: 1,
	team: 1,
	performance: 1,
	data: 1,
};

describe("TechQuestions", () => {
	it("renders the first tech question on mount", () => {
		render(<TechQuestions persona="cto" onComplete={() => {}} />);
		expect(screen.getByText(/service architecture/i)).toBeTruthy();
		expect(screen.getAllByRole("button")).toHaveLength(4);
	});

	it("calls onComplete with all 8 answers after selecting one option per question", () => {
		const onComplete = vi.fn();
		render(<TechQuestions persona="cto" onComplete={onComplete} />);
		for (let i = 0; i < 8; i++) {
			const buttons = screen.getAllByRole("button");
			fireEvent.click(buttons[0]);
		}
		expect(onComplete).toHaveBeenCalledTimes(1);
		const answers = onComplete.mock.calls[0][0] as Record<string, number>;
		expect(Object.keys(answers)).toHaveLength(8);
	});

	it("displays question counter and category label", () => {
		render(<TechQuestions persona="cto" onComplete={() => {}} />);
		expect(screen.getByText("7 of 14")).toBeTruthy();
		expect(screen.getByText("Architecture")).toBeTruthy();
	});

	it("shows one question at a time instead of all 8", () => {
		render(<TechQuestions persona="cto" onComplete={() => {}} />);
		const archQuestion = screen.getByText(/service architecture/i);
		expect(archQuestion).toBeTruthy();
		expect(screen.queryByText(/database model/i)).toBeNull();
	});

	it("shows HotTruncate early signal after 3 answers when baseline provided", () => {
		render(<TechQuestions persona="cto" onComplete={() => {}} baseline={STAGE_0_BASELINE} />);

		for (let i = 0; i < 3; i++) {
			const buttons = screen.getAllByRole("button");
			fireEvent.click(buttons[0]);
		}

		expect(screen.getByText(/early signal/i)).toBeTruthy();
	});
});
