import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/home-page";

describe("Homepage internal linking", () => {
	it("renders links to service pages", () => {
		render(<Home />);
		const serviceLink = screen.getByRole("link", { name: /view all services/i });
		expect(serviceLink.getAttribute("href")).toBe("/services");
	});

	it("renders Featured Insights section with hub blog links", () => {
		render(<Home />);
		expect(screen.getByText("Featured Insights")).toBeDefined();
		const blogLink = screen.getByRole("link", { name: /view all articles/i });
		expect(blogLink.getAttribute("href")).toBe("/blog");
	});

	it("has at least 10 internal links (up from 2 previously)", () => {
		render(<Home />);
		const allLinks = screen.getAllByRole("link");
		expect(allLinks.length).toBeGreaterThanOrEqual(10);
	});
});
