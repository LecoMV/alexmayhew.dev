import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ContextQuestions } from "@/components/tools/stagefit/phases/ContextQuestions";

describe("ContextQuestions", () => {
	it("renders first question with progress indicator", () => {
		render(<ContextQuestions onComplete={() => {}} />);
		expect(screen.getByText("1 of 6")).toBeTruthy();
		expect(screen.getByText(/what's your role/i)).toBeTruthy();
	});

	it("advances to next question when an option is selected", () => {
		render(<ContextQuestions onComplete={() => {}} />);
		fireEvent.click(screen.getByText(/non-technical founder/i));
		expect(screen.getByText("2 of 6")).toBeTruthy();
	});

	it("calls onComplete with all answers after Q6", () => {
		const onComplete = vi.fn();
		render(<ContextQuestions onComplete={onComplete} />);

		fireEvent.click(screen.getByText(/non-technical founder/i));
		fireEvent.click(screen.getByText(/B2B SMB/i));
		fireEvent.click(screen.getByText(/Pre-revenue/i));
		fireEvent.click(screen.getByText(/No specific goal/i));
		fireEvent.click(screen.getByText(/^None$/));
		fireEvent.click(screen.getByText(/^Solo$/));

		expect(onComplete).toHaveBeenCalledTimes(1);
		const answers = onComplete.mock.calls[0][0];
		expect(Object.keys(answers)).toHaveLength(6);
	});
});
