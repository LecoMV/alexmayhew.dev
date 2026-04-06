import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ForHubPage } from "@/app/for/for-hub-page";

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
		[key: string]: unknown;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

vi.mock("@/components/analytics", () => ({
	trackCTAClick: vi.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPages: any[] = [
	{
		slug: "cto",
		role: "cto" as const,
		published: true,
		headline: "Strategic Technology Leadership",
		subheadline: "For CTOs scaling engineering organizations",
		seo: {
			title: "For CTOs",
			description: "CTO advisory services",
			keywords: ["cto"],
		},
		painPoints: [
			{
				title: "Scaling challenges",
				description: "Architecture reviews to handle growth",
				icon: "code",
			},
		],
		faqs: [{ question: "What do you offer?", answer: "Advisory services" }],
		serviceTiers: [
			{
				name: "Advisory",
				description: "Strategic guidance",
				features: ["Architecture reviews"],
				commitment: "10hr/mo",
				ideal: "Growth-stage CTOs",
			},
		],
		ctaText: "Book a Call",
		ctaDescription: "Let us discuss your challenges",
	},
];

describe("ForHubPage", () => {
	it("renders the page heading", () => {
		render(<ForHubPage pages={mockPages as never[]} />);
		expect(screen.getByText("Technical Advisory")).toBeTruthy();
	});

	it("renders breadcrumb navigation", () => {
		render(<ForHubPage pages={mockPages as never[]} />);
		expect(screen.getByText("Home")).toBeTruthy();
		expect(screen.getByText("For Leaders")).toBeTruthy();
	});

	it("renders role label for each page", () => {
		render(<ForHubPage pages={mockPages as never[]} />);
		// ROLE_LABELS["cto"] = "CTO", renders as "For CTO"
		expect(screen.getByText("For CTO")).toBeTruthy();
	});

	it("renders headline from page data", () => {
		render(<ForHubPage pages={mockPages as never[]} />);
		expect(screen.getByText("Strategic Technology Leadership")).toBeTruthy();
	});

	it("renders with empty pages array", () => {
		const { container } = render(<ForHubPage pages={[]} />);
		expect(container).toBeTruthy();
	});
});
