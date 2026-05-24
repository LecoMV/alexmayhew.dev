import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
		render(<LeadCapture zone="over-built" result={mockResult} onSuccess={() => {}} />);
		expect(screen.getByLabelText(/email/i)).toBeTruthy();
		expect(screen.getByRole("button", { name: /unlock/i })).toBeTruthy();
	});
});
