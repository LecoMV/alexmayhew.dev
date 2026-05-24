import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TechQuestions } from "@/components/tools/stagefit/phases/TechQuestions";

describe("TechQuestions", () => {
	it("renders all 8 tech questions as accordion items", () => {
		render(<TechQuestions persona="cto" onComplete={() => {}} />);
		expect(screen.getByText(/service architecture/i)).toBeTruthy();
		expect(screen.getByText(/database model/i)).toBeTruthy();
	});

	it("calls onComplete with all 8 answers after selecting one option per question", () => {
		const onComplete = vi.fn();
		render(<TechQuestions persona="cto" onComplete={onComplete} />);
		const buttons = screen.getAllByRole("button");
		for (let i = 0; i < buttons.length; i += 4) {
			fireEvent.click(buttons[i]);
		}
		expect(onComplete).toHaveBeenCalledTimes(1);
		const answers = onComplete.mock.calls[0][0] as Record<string, number>;
		expect(Object.keys(answers)).toHaveLength(8);
	});
});
