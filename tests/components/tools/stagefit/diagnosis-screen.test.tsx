import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DiagnosisScreen } from "@/components/tools/stagefit/phases/DiagnosisScreen";

import type { StageFitInput, StageFitResult, TechDimension } from "@/data/saas-stagefit/types";

const ALL_DIMS: TechDimension[] = [
	"architecture",
	"database",
	"cicd",
	"observability",
	"security",
	"team",
	"performance",
	"data",
];

const mockInput: StageFitInput = {
	persona: "cto",
	customerType: "b2b-smb",
	revenueStage: 0,
	triggerEvent: "none",
	compliance: ["none"],
	teamSize: 1,
	techAnswers: Object.fromEntries(ALL_DIMS.map((d) => [d, 4])) as Record<TechDimension, 4>,
};

const mockResult: StageFitResult = {
	zone: "over-built",
	severity: "acute",
	delta: 24,
	velocityDragBand: "critical",
	reversibilityRiskCount: 2,
	topMisalignedDimensions: ["architecture", "database", "cicd"],
	ctaBucket: "fractional-cto",
};

describe("DiagnosisScreen", () => {
	it("renders the zone diagnosis", () => {
		render(<DiagnosisScreen input={mockInput} result={mockResult} />);
		expect(screen.getByText(/over-built/i)).toBeTruthy();
	});

	it("renders CTA link with source=stagefit query param", () => {
		render(<DiagnosisScreen input={mockInput} result={mockResult} />);
		const ctaLink = screen.getByRole("link");
		expect(ctaLink.getAttribute("href")).toContain("source=stagefit");
	});

	it("displays symptoms and velocity drag copy", () => {
		render(<DiagnosisScreen input={mockInput} result={mockResult} />);
		expect(screen.getByText(/tech stack is built for/i)).toBeTruthy();
		expect(screen.getByText(/velocity drag/i)).toBeTruthy();
	});
});
