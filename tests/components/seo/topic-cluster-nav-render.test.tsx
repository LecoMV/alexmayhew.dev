import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TopicClusterNav } from "@/components/seo/topic-cluster-nav";

import type { ClusterSummary } from "@/components/seo/topic-cluster-nav";

vi.mock("next/link", () => ({
	default: ({ children, href }: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

const testClusters: ClusterSummary[] = [
	{ id: "cloud", name: "Cloud Infrastructure", hubSlug: "cloud-hub" },
];
const testRelatedSlugs = ["nextjs-saas", "nodejs-api", "postgresql-optimization"];

describe("TopicClusterNav", () => {
	it("renders null when no clusters", () => {
		const { container } = render(
			<TopicClusterNav currentSlug="empty" clusters={[]} relatedPageSlugs={[]} />
		);
		expect(container.innerHTML).toBe("");
	});

	it("renders related topics heading", () => {
		render(
			<TopicClusterNav
				currentSlug="test-page"
				clusters={testClusters}
				relatedPageSlugs={testRelatedSlugs}
			/>
		);
		expect(screen.getByText("Related Topics")).toBeTruthy();
	});

	it("renders cluster tags", () => {
		render(
			<TopicClusterNav
				currentSlug="test-page"
				clusters={testClusters}
				relatedPageSlugs={testRelatedSlugs}
			/>
		);
		expect(screen.getByText("Cloud Infrastructure")).toBeTruthy();
	});

	it("renders related page links with formatted slugs", () => {
		render(
			<TopicClusterNav
				currentSlug="test-page"
				clusters={testClusters}
				relatedPageSlugs={testRelatedSlugs}
			/>
		);
		expect(screen.getByText("Next.js SaaS")).toBeTruthy();
		expect(screen.getByText("Node.js Api")).toBeTruthy();
		expect(screen.getByText("PostgreSQL Optimization")).toBeTruthy();
	});

	it("renders hub CTA when current page is not the hub", () => {
		render(
			<TopicClusterNav
				currentSlug="test-page"
				clusters={testClusters}
				relatedPageSlugs={testRelatedSlugs}
			/>
		);
		expect(screen.getByText(/View all Cloud Infrastructure services/)).toBeTruthy();
	});

	it("uses custom basePath", () => {
		render(
			<TopicClusterNav
				currentSlug="test-page"
				clusters={testClusters}
				relatedPageSlugs={testRelatedSlugs}
				basePath="/services/migrations"
			/>
		);
		const link = screen.getByText("Next.js SaaS").closest("a");
		expect(link?.getAttribute("href")).toBe("/services/migrations/nextjs-saas");
	});
});
