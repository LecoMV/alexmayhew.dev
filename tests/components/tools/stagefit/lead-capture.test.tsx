import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LeadCapture } from "@/components/tools/stagefit/LeadCapture";

import type { StageFitResult } from "@/data/saas-stagefit/types";

const mockResult: StageFitResult = {
	zone: "over-built",
	severity: "acute",
	delta: 12,
	velocityDragBand: "high",
	reversibilityRiskCount: 2,
	topMisalignedDimensions: ["architecture", "database", "cicd"],
	ctaBucket: "architecture-review",
};

describe("LeadCapture", () => {
	it("renders email input and submit button", () => {
		render(
			<LeadCapture
				zone="over-built"
				result={mockResult}
				onSuccess={() => {}}
				onSubmitEmail={async () => ({ success: true })}
			/>
		);
		expect(screen.getByLabelText(/email/i)).toBeTruthy();
		expect(screen.getByRole("button", { name: /unlock/i })).toBeTruthy();
	});

	it("calls onSubmitEmail with email and onSuccess on success", async () => {
		const onSubmitEmail = vi.fn().mockResolvedValue({ success: true });
		const onSuccess = vi.fn();
		render(
			<LeadCapture
				zone="over-built"
				result={mockResult}
				onSuccess={onSuccess}
				onSubmitEmail={onSubmitEmail}
			/>
		);
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: /unlock/i }));
		await vi.waitFor(() => {
			expect(onSubmitEmail).toHaveBeenCalledWith("test@example.com");
			expect(onSuccess).toHaveBeenCalled();
		});
	});
});
