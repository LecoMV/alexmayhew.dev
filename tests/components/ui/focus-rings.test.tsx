import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/ui/footer";
import { Navigation } from "@/components/ui/navigation";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

vi.mock("@/components/newsletter", () => ({
	NewsletterSignup: () => <div data-testid="newsletter-signup" />,
}));

vi.mock("./local-time", () => ({
	LocalTime: () => <span data-testid="local-time" />,
}));

const FOCUS_CLASSES = [
	"focus-visible:ring-2",
	"focus-visible:ring-cyber-lime",
	"focus-visible:outline-none",
];

function hasFocusClasses(element: HTMLElement): boolean {
	const className = element.className;
	return FOCUS_CLASSES.every((c) => className.includes(c));
}

describe("Footer focus-visible rings", () => {
	it("primary nav links have focus-visible classes", () => {
		render(<Footer />);
		const workLink = screen.getByRole("link", { name: "Work" });
		expect(hasFocusClasses(workLink)).toBe(true);
	});

	it("Privacy link has focus-visible classes", () => {
		render(<Footer />);
		const privacyLink = screen.getByRole("link", { name: "Privacy" });
		expect(hasFocusClasses(privacyLink)).toBe(true);
	});

	it("social icon anchors have focus-visible classes", () => {
		render(<Footer />);
		const github = screen.getByRole("link", { name: "GitHub" });
		expect(hasFocusClasses(github)).toBe(true);
	});
});

describe("Navigation focus-visible rings", () => {
	it("mobile menu toggle has focus-visible classes", () => {
		render(<Navigation />);
		const toggle = screen.getByRole("button", { name: /menu/i });
		expect(hasFocusClasses(toggle)).toBe(true);
	});

	it("contact CTA has focus-visible classes", () => {
		render(<Navigation />);
		const cta = screen.getByRole("link", { name: /contact|book/i });
		expect(hasFocusClasses(cta)).toBe(true);
	});
});
