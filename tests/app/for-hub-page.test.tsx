import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/analytics", () => ({
	trackCTAClick: vi.fn(),
}));

vi.mock("@/lib/motion-constants", () => ({
	fadeInUp: {},
	gentleSpring: {},
	springTransition: {},
	staggerContainer: {},
}));

import { ForHubPage } from "@/app/for/for-hub-page";

import type { RolePage } from "@/data/roles";

const mockPages: RolePage[] = [
	{
		slug: "ctos",
		role: "cto",
		headline: "CTO Advisory",
		subheadline: "Scale your engineering org",
		seo: { title: "For CTOs", description: "Advisory for CTOs", keywords: ["cto"] },
		painPoints: [
			{
				title: "Technical Debt",
				description: "Managing tech debt at scale",
				whyMatters: "Slows velocity",
				solution: "Incremental refactoring",
			},
			{
				title: "Team Scaling",
				description: "Growing from 5 to 50 engineers",
				whyMatters: "Bottleneck risk",
				solution: "Hiring process",
			},
			{
				title: "Architecture",
				description: "System design decisions",
				whyMatters: "Foundation",
				solution: "ADR process",
			},
		],
		faqs: [],
	} as never,
];

describe("ForHubPage", () => {
	it("renders role cards with headline and pain points", () => {
		render(<ForHubPage pages={mockPages} />);

		expect(screen.getByText("Built for Your Role")).toBeTruthy();
		expect(screen.getByText("CTO Advisory")).toBeTruthy();
		expect(screen.getByText("Technical Debt")).toBeTruthy();
		expect(screen.getByText("Team Scaling")).toBeTruthy();
		expect(screen.getByText(/Start the conversation/)).toBeTruthy();
	});
});
