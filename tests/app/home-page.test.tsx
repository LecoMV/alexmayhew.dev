import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/analytics", () => ({
	trackCTAClick: vi.fn(),
}));

vi.mock("@/components/newsletter", () => ({
	NewsletterSignup: () => <div data-testid="newsletter-signup" />,
}));

vi.mock("@/lib/motion-constants", () => ({
	fadeInUp: {},
	gentleSpring: {},
	springTransition: {},
	staggerContainer: {},
}));

import Home from "@/app/home-page";

describe("Home page", () => {
	it("renders hero section with key content", () => {
		render(<Home />);

		expect(screen.getByText("Technical Advisor")).toBeTruthy();
		expect(screen.getByText(/START_CONVERSATION/)).toBeTruthy();
		expect(screen.getByText("View Work")).toBeTruthy();
		expect(screen.getByText("Full-Stack Development")).toBeTruthy();
		expect(screen.getByText("System Architecture")).toBeTruthy();
		expect(screen.getByText("Performance Engineering")).toBeTruthy();
	});
});
