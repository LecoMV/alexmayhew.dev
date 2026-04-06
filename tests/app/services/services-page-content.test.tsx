import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ServicesPage } from "@/app/services/services-page-content";

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

vi.mock("@/components/newsletter/newsletter-signup", () => ({
	NewsletterSignup: () => <div data-testid="newsletter-signup">Newsletter</div>,
}));

// Partial mock — only fields used by ServicesPage rendering

const mockPages = [
	{
		slug: "nextjs-saas",
		technology: "nextjs",
		industry: "saas",
		published: true,
		seo: {
			title: "Next.js for SaaS",
			description: "Build SaaS with Next.js",
			keywords: ["nextjs", "saas"],
		},
		whyThisStack: "Next.js is ideal for SaaS applications because of its performance features.",
		projectApproach: "We start with architecture design and build incrementally.",
		uniqueInsights: ["SSR reduces TTFB", "Edge functions for low latency"],
		painPoints: [{ problem: "Slow builds", solution: "Turbopack", icon: "zap" }],
		faqs: [{ question: "Why Next.js?", answer: "Performance and DX" }],
		techRecommendations: [],
		relatedPages: [],
		relatedBlogPosts: [],
		budgetRange: { min: 20000, max: 50000, currency: "USD" },
	},
];

describe("ServicesPage", () => {
	it("renders the service tiers", () => {
		render(<ServicesPage pages={mockPages as never[]} />);
		expect(screen.getByText("Advisory Retainer")).toBeTruthy();
		expect(screen.getByText("Strategic Implementation")).toBeTruthy();
		expect(screen.getByText("Technical Due Diligence")).toBeTruthy();
	});

	it("renders trust metrics", () => {
		render(<ServicesPage pages={mockPages as never[]} />);
		expect(screen.getByText("400%")).toBeTruthy();
		expect(screen.getByText("337x")).toBeTruthy();
	});

	it("renders with empty pages array", () => {
		const { container } = render(<ServicesPage pages={[]} />);
		expect(container).toBeTruthy();
	});

	it("renders newsletter signup", () => {
		render(<ServicesPage pages={mockPages as never[]} />);
		expect(screen.getByTestId("newsletter-signup")).toBeTruthy();
	});
});
