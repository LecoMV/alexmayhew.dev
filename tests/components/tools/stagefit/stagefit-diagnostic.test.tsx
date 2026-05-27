import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { StageFitDiagnostic } from "@/components/tools/stagefit/StageFitDiagnostic";

function advanceThroughContext() {
	fireEvent.click(screen.getByRole("button", { name: /start/i }));
	fireEvent.click(screen.getByText(/^Technical founder or CTO$/));
	fireEvent.click(screen.getByText(/B2B SMB/i));
	fireEvent.click(screen.getByText(/Pre-revenue/i));
	fireEvent.click(screen.getByText(/No specific goal/i));
	fireEvent.click(screen.getByText(/^None$/));
	fireEvent.click(screen.getByText(/^Solo$/));
	fireEvent.click(screen.getByRole("button", { name: /continue/i }));
}

function answerAllTechQuestions() {
	for (let i = 0; i < 8; i++) {
		const continueBtn = screen.queryByRole("button", { name: /continue/i });
		if (continueBtn) fireEvent.click(continueBtn);

		const buttons = screen.getAllByRole("button");
		fireEvent.click(buttons[0]);
	}
}

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
		advanceThroughContext();
		answerAllTechQuestions();

		expect(screen.getByText(/stage-optimized|over-built|under-built/i)).toBeTruthy();
	});

	it("shows HotTruncate early signal after 3 tech questions", () => {
		render(<StageFitDiagnostic />);
		advanceThroughContext();

		for (let i = 0; i < 3; i++) {
			const buttons = screen.getAllByRole("button");
			fireEvent.click(buttons[0]);
		}

		expect(screen.getByText(/early signal/i)).toBeTruthy();
	});

	it("shows LeadCapture email form on diagnosis screen", () => {
		render(<StageFitDiagnostic />);
		advanceThroughContext();
		answerAllTechQuestions();

		expect(screen.getByLabelText(/email/i)).toBeTruthy();
		expect(screen.getByRole("button", { name: /unlock/i })).toBeTruthy();
	});

	it("hides LeadCapture and shows confirmation after email submit", async () => {
		vi.mock("@/app/actions/stagefit-lead", () => ({
			submitStageFitLead: vi.fn().mockResolvedValue({ success: true }),
		}));

		render(<StageFitDiagnostic />);
		advanceThroughContext();
		answerAllTechQuestions();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /unlock/i }));

		await vi.waitFor(() => {
			expect(screen.queryByLabelText(/email/i)).toBeNull();
			expect(screen.getByText(/check your inbox/i)).toBeTruthy();
		});
	});
});
