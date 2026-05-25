import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StageFitDiagnostic } from "@/components/tools/stagefit/StageFitDiagnostic";

describe("StageFitDiagnostic", () => {
	it("renders intro screen initially", () => {
		render(<StageFitDiagnostic />);
		expect(screen.getByText(/saas stage-fit matrix/i)).toBeTruthy();
		expect(screen.getByRole("button", { name: /start/i })).toBeTruthy();
	});

	it("advances to context questions after clicking start", () => {
		render(<StageFitDiagnostic />);
		fireEvent.click(screen.getByRole("button", { name: /start/i }));
		expect(screen.getByText(/what's your role/i)).toBeTruthy();
	});

	it("completes full flow through to diagnosis", () => {
		render(<StageFitDiagnostic />);
		fireEvent.click(screen.getByRole("button", { name: /start/i }));

		fireEvent.click(screen.getByText(/^Technical founder or CTO$/));
		fireEvent.click(screen.getByText(/B2B SMB/i));
		fireEvent.click(screen.getByText(/Pre-revenue/i));
		fireEvent.click(screen.getByText(/No specific goal/i));
		fireEvent.click(screen.getByText(/^None$/));
		fireEvent.click(screen.getByText(/^Solo$/));

		fireEvent.click(screen.getByRole("button", { name: /continue/i }));

		const buttons = screen.getAllByRole("button");
		for (let i = 0; i < buttons.length; i += 4) {
			fireEvent.click(buttons[i]);
		}

		expect(screen.getByText(/stage-optimized|over-built|under-built/i)).toBeTruthy();
	});
});
