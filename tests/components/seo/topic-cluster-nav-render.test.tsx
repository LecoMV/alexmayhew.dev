import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TopicClusterNav } from "@/components/seo/topic-cluster-nav";

vi.mock("next/link", () => ({
	default: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

vi.mock("@/data/pseo/types", () => ({
	getPageClusters: (slug: string) => {
		if (slug === "empty") return [];
		return [{ id: "cloud", name: "Cloud Infrastructure", hubSlug: "cloud-hub" }];
	},
	getClusterRelatedPages: (slug: string) => {
		if (slug === "empty") return [];
		return ["nextjs-saas", "nodejs-api", "postgresql-optimization"];
	},
}));

describe("TopicClusterNav", () => {
	it("renders null when no clusters", () => {
		const { container } = render(<TopicClusterNav currentSlug="empty" />);
		expect(container.innerHTML).toBe("");
	});

	it("renders related topics heading", () => {
		render(<TopicClusterNav currentSlug="test-page" />);
		expect(screen.getByText("Related Topics")).toBeTruthy();
	});

	it("renders cluster tags", () => {
		render(<TopicClusterNav currentSlug="test-page" />);
		expect(screen.getByText("Cloud Infrastructure")).toBeTruthy();
	});

	it("renders related page links with formatted slugs", () => {
		render(<TopicClusterNav currentSlug="test-page" />);
		expect(screen.getByText("Next.js SaaS")).toBeTruthy();
		expect(screen.getByText("Node.js Api")).toBeTruthy();
		expect(screen.getByText("PostgreSQL Optimization")).toBeTruthy();
	});

	it("renders hub CTA when current page is not the hub", () => {
		render(<TopicClusterNav currentSlug="test-page" />);
		expect(screen.getByText(/View all Cloud Infrastructure services/)).toBeTruthy();
	});

	it("uses custom basePath", () => {
		render(<TopicClusterNav currentSlug="test-page" basePath="/services/migrations" />);
		const link = screen.getByText("Next.js SaaS").closest("a");
		expect(link?.getAttribute("href")).toBe("/services/migrations/nextjs-saas");
	});
});
